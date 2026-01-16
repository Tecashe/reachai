import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { coreWarmupManager } from "@/lib/services/warmup/core-manager"
import { inngest } from "@/lib/inngest/client"
import { logger } from "@/lib/logger"

/**
 * POST /api/warmup/trigger
 * Manually trigger warmup for an account or batch
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accountId, userId, batch = false } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    if (batch) {
      // Triggerbatch warmup for all eligible accounts
      const eligibleAccounts = await coreWarmupManager.getEligibleAccounts(100)

      const userAccounts = await prisma.sendingAccount.findMany({
        where: {
          userId,
          id: { in: eligibleAccounts },
        },
        select: { id: true },
      })

      if (userAccounts.length === 0) {
        return NextResponse.json({
          success: true,
          message: "No eligible accounts for warmup",
          processed: 0,
        })
      }

      // Dispatch to Inngest
      const events = userAccounts.map((account, idx) => ({
        name: "warmup/account.process" as const,
        data: { accountId: account.id, priority: idx },
      }))

      await inngest.send(events)

      logger.info("[TriggerAPI] Batch warmup triggered", {
        userId,
        accountCount: userAccounts.length,
      })

      return NextResponse.json({
        success: true,
        message: `Triggered warmup for ${userAccounts.length} accounts`,
        accounts: userAccounts.map((a) => a.id),
      })
    }

    // Single account trigger
    if (!accountId) {
      return NextResponse.json({ error: "Account ID required for single trigger" }, { status: 400 })
    }

    // Verify ownership
    const account = await prisma.sendingAccount.findFirst({
      where: { id: accountId, userId },
    })

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    if (!account.warmupEnabled) {
      return NextResponse.json({ error: "Warmup not enabled for this account" }, { status: 400 })
    }

    // Process warmup directly
    const result = await coreWarmupManager.processAccountWarmup(accountId)

    logger.info("[TriggerAPI] Single warmup triggered", {
      accountId,
      success: result.success,
    })

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    logger.error("[TriggerAPI] Trigger failed", { error: (error as Error).message })
    return NextResponse.json({ error: "Failed to trigger warmup" }, { status: 500 })
  }
}
