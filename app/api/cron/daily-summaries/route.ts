import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { emailNotificationService } from "@/lib/services/email-notification"
import { logger } from "@/lib/logger"

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all active users
    const users = await db.user.findMany({
      where: {
        subscriptionStatus: "ACTIVE",
      },
      select: {
        id: true,
      },
    })

    let successCount = 0
    let errorCount = 0

    // Send daily summary to each user
    for (const user of users) {
      try {
        await emailNotificationService.sendDailySummary(user.id)
        successCount++
      } catch (error) {
        logger.error("Failed to send daily summary", error as Error, { userId: user.id })
        errorCount++
      }
    }

    logger.info("Daily summaries sent", { successCount, errorCount })

    return NextResponse.json({
      success: true,
      sent: successCount,
      errors: errorCount,
    })
  } catch (error) {
    logger.error("Daily summaries cron error", error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
