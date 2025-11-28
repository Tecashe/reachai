import { type NextRequest, NextResponse } from "next/server"
import { protectApiRoute } from "@/lib/api-protection"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"
import { Prisma } from "@prisma/client"

export async function POST(request: NextRequest) {
  const { error, user } = await protectApiRoute()
  if (error) return error

  try {
    const body = await request.json()
    const { prospects, folderId, campaignId } = body

    if (!prospects || !Array.isArray(prospects)) {
      return NextResponse.json({ error: "Invalid request: prospects array is required" }, { status: 400 })
    }

    if (prospects.length === 0) {
      return NextResponse.json({ error: "No prospects to import" }, { status: 400 })
    }

    // Validate that all prospects have email
    const invalidProspects = prospects.filter((p: { email?: string }) => !p.email)
    if (invalidProspects.length > 0) {
      return NextResponse.json(
        { error: `${invalidProspects.length} prospects are missing email addresses` },
        { status: 400 },
      )
    }

    // If folderId provided, verify it belongs to user
    if (folderId) {
      const folder = await db.prospectFolder.findUnique({
        where: { id: folderId, userId: user!.id },
      })

      if (!folder) {
        return NextResponse.json({ error: "Folder not found" }, { status: 404 })
      }
    }

    // If campaignId provided, verify it belongs to user
    if (campaignId) {
      const campaign = await db.campaign.findUnique({
        where: { id: campaignId, userId: user!.id },
      })

      if (!campaign) {
        return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
      }
    }

    // Check subscription limits - only count non-trashed prospects
    const prospectCount = prospects.length
    const currentProspects = await db.prospect.count({
      where: {
        userId: user!.id,
        isTrashed: false,
      },
    })

    const limits: Record<string, number> = {
      FREE: 50,
      STARTER: 500,
      PRO: 2500,
      AGENCY: 10000,
    }

    const limit = limits[user!.subscriptionTier] || 50
    if (currentProspects + prospectCount > limit) {
      return NextResponse.json(
        {
          error: `Subscription limit exceeded`,
          currentCount: currentProspects,
          limit: limit,
          plan: user!.subscriptionTier,
          message: `Your ${user!.subscriptionTier} plan allows ${limit} prospects. You currently have ${currentProspects}.`,
        },
        { status: 402 },
      )
    }

    logger.info("Importing prospects", {
      count: prospectCount,
      folderId,
      campaignId,
    })

    // Prepare prospects for creation with flexible custom fields
    const prospectsToCreate = prospects.map((p: Record<string, unknown>) => ({
      userId: user!.id,
      campaignId: campaignId || null,
      folderId: folderId || null,
      email: p.email as string,
      firstName: (p.firstName as string) || null,
      lastName: (p.lastName as string) || null,
      company: (p.company as string) || null,
      jobTitle: (p.jobTitle as string) || null,
      linkedinUrl: (p.linkedinUrl as string) || null,
      websiteUrl: (p.websiteUrl as string) || null,
      phoneNumber: (p.phone as string) || null,
      location: (p.location as string) || null,
      industry: (p.industry as string) || null,
      personalizationTokens:
        p.customFields && Object.keys(p.customFields as object).length > 0
          ? (p.customFields as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      status: "ACTIVE" as const,
    }))

    // Create prospects with skipDuplicates to handle unique constraint on email+campaignId
    const created = await db.prospect.createMany({
      data: prospectsToCreate,
      skipDuplicates: true,
    })

    // If folder was specified, also create ProspectInFolder entries for many-to-many relationship
    if (folderId && created.count > 0) {
      // Get the IDs of just-created prospects
      const createdProspects = await db.prospect.findMany({
        where: {
          userId: user!.id,
          folderId: folderId,
          email: { in: prospects.map((p: { email: string }) => p.email) },
        },
        select: { id: true },
      })

      // Create ProspectInFolder entries
      if (createdProspects.length > 0) {
        await db.prospectInFolder.createMany({
          data: createdProspects.map((p) => ({
            prospectId: p.id,
            folderId: folderId,
          })),
          skipDuplicates: true,
        })
      }

      // Update folder prospect count
      await db.prospectFolder.update({
        where: { id: folderId },
        data: {
          prospectCount: { increment: created.count },
        },
      })
    }

    // Update campaign stats if campaign was specified
    if (campaignId) {
      await db.campaign.update({
        where: { id: campaignId },
        data: {
          totalProspects: { increment: created.count },
        },
      })
    }

    // Update user stats
    await db.user.update({
      where: { id: user!.id },
      data: {
        prospectsThisMonth: { increment: created.count },
      },
    })

    const skipped = prospectCount - created.count

    logger.info("Import successful", {
      imported: created.count,
      skipped,
      folderId,
    })

    return NextResponse.json({
      success: true,
      imported: created.count,
      failed: 0,
      skipped,
      folderId: folderId || null,
      message: `Successfully imported ${created.count} prospects${skipped > 0 ? ` (${skipped} duplicates skipped)` : ""}`,
    })
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    logger.error("Import error", err, {
      message: err.message,
      stack: err.stack,
    })

    return NextResponse.json(
      {
        error: "Failed to import prospects",
        details: err.message,
      },
      { status: 500 },
    )
  }
}
