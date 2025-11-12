import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"

export const dynamic = "force-dynamic"
export const maxDuration = 60

/**
 * Cron job to reset daily company send limits
 * Runs every day at midnight UTC
 */
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Resetting daily company send limits")

    // Reset daily counters
    await db.companySendLimit.updateMany({
      where: {
        emailsSentToday: { gt: 0 },
      },
      data: {
        emailsSentToday: 0,
        lastResetDate: new Date(),
      },
    })

    // Reset weekly counters (if it's been a week)
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    await db.companySendLimit.updateMany({
      where: {
        lastResetWeek: { lt: oneWeekAgo },
      },
      data: {
        emailsSentThisWeek: 0,
        lastResetWeek: new Date(),
      },
    })

    logger.info("Company send limits reset successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    // logger.error("Company limit reset error", { error })
    logger.error("Company limit reset error")
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
