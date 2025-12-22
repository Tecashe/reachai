import { NextResponse } from "next/server"
import { withApiAuth } from "@/lib/middleware/api-wrapper"
import { db } from "@/lib/db"

export const GET = withApiAuth("analytics:read")(async (request, context) => {
  try {
    const campaignId = request.nextUrl.pathname.split("/").slice(-1)[0]
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    // Verify campaign belongs to user
    const campaign = await db.campaign.findFirst({
      where: {
        id: campaignId,
        userId: context.user.id,
      },
    })

    if (!campaign) {
      return NextResponse.json(
        {
          success: false,
          error: "Campaign not found",
        },
        { status: 404 },
      )
    }

    const since = new Date()
    since.setDate(since.getDate() - days)

    // Get daily analytics
    const analytics = await db.analytics.findMany({
      where: {
        campaignId,
        date: { gte: since },
      },
      orderBy: { date: "asc" },
    })

    // Calculate totals
    const totals = {
      emailsSent: campaign.emailsSent,
      emailsDelivered: campaign.emailsDelivered,
      emailsOpened: campaign.emailsOpened,
      emailsClicked: campaign.emailsClicked,
      emailsReplied: campaign.emailsReplied,
      emailsBounced: campaign.emailsBounced,
      deliveryRate: campaign.emailsSent > 0 ? (campaign.emailsDelivered / campaign.emailsSent) * 100 : 0,
      openRate: campaign.emailsDelivered > 0 ? (campaign.emailsOpened / campaign.emailsDelivered) * 100 : 0,
      clickRate: campaign.emailsOpened > 0 ? (campaign.emailsClicked / campaign.emailsOpened) * 100 : 0,
      replyRate: campaign.emailsDelivered > 0 ? (campaign.emailsReplied / campaign.emailsDelivered) * 100 : 0,
      bounceRate: campaign.emailsSent > 0 ? (campaign.emailsBounced / campaign.emailsSent) * 100 : 0,
    }

    return NextResponse.json({
      success: true,
      data: {
        campaign: {
          id: campaign.id,
          name: campaign.name,
          status: campaign.status,
        },
        totals,
        daily: analytics,
      },
    })
  } catch (error: any) {
    console.error("[v0] Error fetching campaign analytics:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch analytics",
      },
      { status: 500 },
    )
  }
})
