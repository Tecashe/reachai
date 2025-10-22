// import { type NextRequest, NextResponse } from "next/server"
// import { protectApiRoute } from "@/lib/api-protection"
// import { parseProspectCSV } from "@/lib/csv-parser"
// import { db } from "@/lib/db"
// import { logger } from "@/lib/logger"

// export async function POST(request: NextRequest) {
//   const { error, user } = await protectApiRoute()
//   if (error) return error

//   try {
//     const formData = await request.formData()
//     const file = formData.get("file") as File
//     const campaignId = formData.get("campaignId") as string

//     if (!file) {
//       return NextResponse.json({ error: "No file provided" }, { status: 400 })
//     }

//     if (!campaignId) {
//       return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 })
//     }

//     // Verify campaign belongs to user
//     const campaign = await db.campaign.findUnique({
//       where: { id: campaignId, userId: user!.id },
//     })

//     if (!campaign) {
//       return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
//     }

//     // Parse CSV
//     logger.info("Parsing CSV file", { filename: file.name, size: file.size })
//     const parseResult = await parseProspectCSV(file)

//     if (!parseResult.success || !parseResult.data) {
//       logger.error("CSV parsing failed", undefined, { errors: parseResult.errors })
//       return NextResponse.json(
//         {
//           error: "Failed to parse CSV",
//           details: parseResult.errors,
//         },
//         { status: 400 },
//       )
//     }

//     // Check subscription limits
//     const prospectCount = parseResult.data.length
//     const currentProspects = await db.prospect.count({
//       where: { userId: user!.id },
//     })

//     // Get subscription limits
//     const limits: Record<string, number> = {
//       FREE: 50,
//       STARTER: 500,
//       PRO: 2500,
//       AGENCY: 10000,
//     }

//     const limit = limits[user!.subscriptionTier]
//     if (currentProspects + prospectCount > limit) {
//       return NextResponse.json(
//         {
//           error: `Subscription limit exceeded. Your ${user!.subscriptionTier} plan allows ${limit} prospects. You currently have ${currentProspects}.`,
//         },
//         { status: 402 },
//       )
//     }

//     const prospectsToCreate = parseResult.data.map((p) => ({
//       userId: user!.id,
//       campaignId,
//       email: p.email,
//       firstName: p.firstName || null,
//       lastName: p.lastName || null,
//       company: p.company || null,
//       jobTitle: p.jobTitle || null,
//       linkedinUrl: p.linkedinUrl || null,
//       websiteUrl: p.websiteUrl || null,
//       phoneNumber: p.phoneNumber || null,
//       location: p.location || null,
//       industry: p.industry || null,
//       status: "ACTIVE" as const,
//     }))

//     logger.info("Creating prospects", {
//       count: prospectsToCreate.length,
//       sample: prospectsToCreate[0],
//     })

//     const created = await db.prospect.createMany({
//       data: prospectsToCreate,
//       skipDuplicates: true,
//     })

//     // Update campaign stats
//     await db.campaign.update({
//       where: { id: campaignId },
//       data: {
//         totalProspects: { increment: created.count },
//       },
//     })

//     // Update user stats
//     await db.user.update({
//       where: { id: user!.id },
//       data: {
//         prospectsThisMonth: { increment: created.count },
//       },
//     })

//     logger.info("CSV upload successful", {
//       campaignId,
//       uploaded: created.count,
//       stats: parseResult.stats,
//     })

//     return NextResponse.json({
//       success: true,
//       uploaded: created.count,
//       stats: parseResult.stats,
//       warnings: parseResult.errors,
//     })
//   } catch (error) {
//     const err = error instanceof Error ? error : new Error(String(error))
//     logger.error("CSV upload error", err, {
//       message: err.message,
//       stack: err.stack,
//     })

//     return NextResponse.json(
//       {
//         error: "Failed to upload prospects",
//         details: err.message,
//       },
//       { status: 500 },
//     )
//   }
// }
import { type NextRequest, NextResponse } from "next/server"
import { protectApiRoute } from "@/lib/api-protection"
import { parseProspectCSVText } from "@/lib/csv-parser"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  const { error, user } = await protectApiRoute()
  if (error) return error

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const campaignId = formData.get("campaignId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!campaignId) {
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 })
    }

    // Verify campaign belongs to user
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId, userId: user!.id },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const csvText = await file.text()

    // Parse CSV
    logger.info("Parsing CSV file", { filename: file.name, size: file.size })
    const parseResult = await parseProspectCSVText(csvText)

    if (!parseResult.success || !parseResult.data) {
      logger.error("CSV parsing failed", undefined, { errors: parseResult.errors })
      return NextResponse.json(
        {
          error: "Failed to parse CSV",
          details: parseResult.errors,
        },
        { status: 400 },
      )
    }

    // Check subscription limits
    const prospectCount = parseResult.data.length
    const currentProspects = await db.prospect.count({
      where: { userId: user!.id },
    })

    // Get subscription limits
    const limits: Record<string, number> = {
      FREE: 50,
      STARTER: 500,
      PRO: 2500,
      AGENCY: 10000,
    }

    const limit = limits[user!.subscriptionTier]
    if (currentProspects + prospectCount > limit) {
      return NextResponse.json(
        {
          error: `Subscription limit exceeded. Your ${user!.subscriptionTier} plan allows ${limit} prospects. You currently have ${currentProspects}.`,
        },
        { status: 402 },
      )
    }

    const prospectsToCreate = parseResult.data.map((p) => ({
      userId: user!.id,
      campaignId,
      email: p.email,
      firstName: p.firstName || null,
      lastName: p.lastName || null,
      company: p.company || null,
      jobTitle: p.jobTitle || null,
      linkedinUrl: p.linkedinUrl || null,
      websiteUrl: p.websiteUrl || null,
      phoneNumber: p.phoneNumber || null,
      location: p.location || null,
      industry: p.industry || null,
      status: "ACTIVE" as const,
    }))

    logger.info("Creating prospects", {
      count: prospectsToCreate.length,
      sample: prospectsToCreate[0],
    })

    const created = await db.prospect.createMany({
      data: prospectsToCreate,
      skipDuplicates: true,
    })

    // Update campaign stats
    await db.campaign.update({
      where: { id: campaignId },
      data: {
        totalProspects: { increment: created.count },
      },
    })

    // Update user stats
    await db.user.update({
      where: { id: user!.id },
      data: {
        prospectsThisMonth: { increment: created.count },
      },
    })

    logger.info("CSV upload successful", {
      campaignId,
      uploaded: created.count,
      stats: parseResult.stats,
    })

    return NextResponse.json({
      success: true,
      uploaded: created.count,
      stats: parseResult.stats,
      warnings: parseResult.errors,
    })
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    logger.error("CSV upload error", err, {
      message: err.message,
      stack: err.stack,
    })

    return NextResponse.json(
      {
        error: "Failed to upload prospects",
        details: err.message,
      },
      { status: 500 },
    )
  }
}
