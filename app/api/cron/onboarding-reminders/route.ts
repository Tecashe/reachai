import { type NextRequest, NextResponse } from "next/server"
import { sendOnboardingReminders } from "@/lib/cron/onboarding-emails"
import { logger } from "@/lib/logger"

export const dynamic = "force-dynamic"
export const maxDuration = 300

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      logger.error("Unauthorized cron request")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Starting onboarding reminders cron job")

    const result = await sendOnboardingReminders()

    // logger.info("Onboarding reminders cron job completed", undefined, result)

    return NextResponse.json({
      // success: true,
      message: `Processed ${result.processed} users`,
      ...result,
    })
  } catch (error) {
    logger.error("Onboarding reminders cron job failed", error as Error)
    return NextResponse.json({ error: "Failed to process onboarding reminders" }, { status: 500 })
  }
}
