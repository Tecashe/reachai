import { type NextRequest, NextResponse } from "next/server"
import { smartCampaignAutomator } from "@/lib/services/smart-campaign-automator"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    logger.info("Starting campaign automation cron job")

    await smartCampaignAutomator.processAutomations()

    return NextResponse.json({
      success: true,
      message: "Campaign automations processed",
    })
  } catch (error) {
    logger.error("Campaign automation cron failed", error as Error)
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 })
  }
}
