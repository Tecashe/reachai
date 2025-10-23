import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { warmupManager } from "@/lib/services/warmup-manager"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Starting warmup progression check")

    // Get all accounts with warmup enabled
    const accounts = await db.sendingAccount.findMany({
      where: {
        warmupEnabled: true,
        isActive: true,
      },
    })

    let progressedCount = 0

    for (const account of accounts) {
      await warmupManager.checkAndProgressWarmup(account.id)
      progressedCount++
    }

    logger.info("Warmup progression check complete", {
      totalAccounts: accounts.length,
      processed: progressedCount,
    })

    return NextResponse.json({
      success: true,
      accountsProcessed: progressedCount,
    })
  } catch (error) {
    logger.error("Warmup progression cron error", error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
