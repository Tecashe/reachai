import { NextResponse } from "next/server"
import { processScheduledReplies } from "@/lib/services/warmup-email-manager"
import { logger } from "@/lib/logger"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Starting scheduled reply processing")

    await processScheduledReplies()

    logger.info("Scheduled reply processing complete")

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error("Scheduled reply cron error", error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
