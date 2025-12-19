

import { type NextRequest, NextResponse } from "next/server"
import { emailSender } from "@/lib/services/email-sender"
import { protectApiRoute } from "@/lib/api-protection"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  const { error, user } = await protectApiRoute()
  if (error) return error

  try {
    const body = await request.json()
    const { campaignId, prospectIds } = body

    if (!campaignId || !prospectIds || !Array.isArray(prospectIds)) {
      return NextResponse.json({ error: "Campaign ID and prospect IDs are required" }, { status: 400 })
    }

    // Get campaign
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
      include: {
        emailSequences: {
          include: {
            template: true,
          },
          orderBy: {
            stepNumber: "asc",
          },
        },
      },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    if (campaign.userId !== user!.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get prospects
    const prospects = await db.prospect.findMany({
      where: {
        id: { in: prospectIds },
        campaignId,
      },
    })

    // Check credits
    const requiredCredits = prospects.length
    if (user!.emailCredits < requiredCredits) {
      return NextResponse.json(
        { error: `Insufficient credits. Need ${requiredCredits}, have ${user!.emailCredits}` },
        { status: 402 },
      )
    }

    // Get first email in sequence
    const firstEmail = campaign.emailSequences[0]
    if (!firstEmail) {
      return NextResponse.json({ error: "No email sequence found" }, { status: 400 })
    }

    // Prepare bulk emails
    const emails = prospects.map((prospect) => {
      // Replace template variables
      let subject = firstEmail.template.subject
      let body = firstEmail.template.body

      const variables: Record<string, string> = {
        firstName: prospect.firstName || "",
        lastName: prospect.lastName || "",
        company: prospect.company || "",
        jobTitle: prospect.jobTitle || "",
      }

      // Replace {{variable}} with actual values
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, "g")
        subject = subject.replace(regex, value)
        body = body.replace(regex, value)
      })

      return {
        to: prospect.email,
        subject,
        html: body,
        prospectId: prospect.id,
        campaignId: campaign.id,
        trackingEnabled: campaign.trackOpens,
      }
    })

    logger.info(`Sending bulk emails for campaign ${campaignId}`, {
      count: emails.length,
    })

    // Send emails
    const results = await emailSender.sendBulkEmails(emails)

    // Deduct credits
    const successCount = results.filter((r) => r.success).length
    await db.user.update({
      where: { id: user!.id },
      data: {
        emailCredits: { decrement: successCount },
        emailsSentThisMonth: { increment: successCount },
      },
    })

    // Update campaign stats
    await db.campaign.update({
      where: { id: campaignId },
      data: {
        emailsSent: { increment: successCount },
      },
    })

    logger.info(`Bulk email send complete`, {
      campaignId,
      total: emails.length,
      successful: successCount,
      failed: emails.length - successCount,
    })

    return NextResponse.json({
      success: true,
      total: emails.length,
      successful: successCount,
      failed: emails.length - successCount,
      results,
    })
  } catch (error) {
    logger.error("Bulk email send error", error as Error)
    return NextResponse.json({ error: "Failed to send bulk emails" }, { status: 500 })
  }
}
