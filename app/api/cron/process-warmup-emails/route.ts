
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { processAccountWarmup, processScheduledReplies } from "@/lib/services/warmup-email-manager"
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

    logger.info("Starting warmup email processing")

    await processScheduledReplies()

    // Get all sending accounts with warmup enabled
    const sendingAccounts = await prisma.sendingAccount.findMany({
      where: {
        warmupEnabled: true,
        isActive: true,
        pausedAt: null,
      },
    })

    logger.info(`Found ${sendingAccounts.length} accounts for warmup`)

    let processed = 0
    let errors = 0

    // Process each account
    for (const account of sendingAccounts) {
      try {
        await processAccountWarmup(account.id)
        processed++
      } catch (error) {
        logger.error(`Error processing warmup for ${account.email}:`, error as Error)
        errors++
      }
    }

    logger.info("Warmup processing complete", { processed, errors })

    return NextResponse.json({
      success: true,
      processed,
      errors,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error("Warmup cron error", error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
