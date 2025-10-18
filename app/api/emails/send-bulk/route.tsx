import { type NextRequest, NextResponse } from "next/server"
import { emailSender } from "@/lib/services/email-sender"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaignId, prospectIds } = body

    // Get campaign and prospectss
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const prospects = await db.prospect.findMany({
      where: {
        id: { in: prospectIds },
        campaignId,
      },
    })

    // Prepare emails
    const emails = prospects.map((prospect) => ({
      to: prospect.email,
      subject: campaign.name,
      html: `<p>Hello ${prospect.firstName},</p><p>This is a test email.</p>`,
      trackingEnabled: true,
      prospectId: prospect.id,
      campaignId,
    }))

    // Send bulk emails
    const results = await emailSender.sendBulkEmails(emails)

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.filter((r) => !r.success).length

    return NextResponse.json({
      success: true,
      total: results.length,
      sent: successCount,
      failed: failureCount,
      results,
    })
  } catch (error) {
    console.error("[v0] Bulk send error:", error)
    return NextResponse.json({ error: "Failed to send bulk emails" }, { status: 500 })
  }
}
