import { inngest } from "../client"
import { logger } from "@/lib/logger"
import { strategyAdjuster } from "@/lib/services/warmup/strategy-adjuster"
import { prisma } from "@/lib/db"

/**
 * Monitor and adjust strategies
 * Runs every 6 hours to check for accounts needing adjustments
 */
export const strategyMonitor = inngest.createFunction(
  {
    id: "strategy-monitor",
    name: "Monitor and Adjust Strategies",
  },
  { cron: "0 */6 * * *" }, // Every 6 hours
  async ({ step }) => {
    logger.info("[StrategyMonitor] Starting")

    const accountIds = await step.run("get-active-accounts", async () => {
      const accounts = await prisma.sendingAccount.findMany({
        where: {
          isActive: true,
          warmupEnabled: true,
        },
        select: { id: true },
        take: 500, // Check 500 accounts per run
      })
      return accounts.map((a) => a.id)
    })

    const result = await step.run("batch-analyze", async () => {
      return await strategyAdjuster.batchAnalyze(accountIds)
    })

    // Auto-revert expired adjustments
    const reverted = await step.run("revert-expired", async () => {
      return await strategyAdjuster.revertExpiredAdjustments()
    })

    logger.info("[StrategyMonitor] Completed", {
      ...result,
      reverted: reverted.reverted,
    })

    return { ...result, reverted: reverted.reverted }
  },
)
