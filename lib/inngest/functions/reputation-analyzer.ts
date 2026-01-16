import { inngest } from "../client"
import { logger } from "@/lib/logger"
import { reputationProfiler } from "@/lib/services/warmup/reputation-profiler"
import { prisma } from "@/lib/db"

/**
 * Analyze account reputations
 * Runs daily to update reputation profiles
 */
export const reputationAnalyzer = inngest.createFunction(
  {
    id: "reputation-analyzer",
    name: "Analyze Account Reputations",
  },
  { cron: "0 2 * * *" }, // 2 AM daily
  async ({ step }) => {
    logger.info("[ReputationAnalyzer] Starting")

    const accountIds = await step.run("get-accounts-needing-analysis", async () => {
      const accounts = await prisma.sendingAccount.findMany({
        where: {
          isActive: true,
          OR: [{ reputationProfile: null }, { reputationProfile: { nextAnalysisAt: { lte: new Date() } } }],
        },
        select: { id: true },
        take: 1000, // Analyze 1000 accounts per day
      })
      return accounts.map((a) => a.id)
    })

    if (accountIds.length === 0) {
      return { analyzed: 0 }
    }

    const result = await step.run("batch-analyze", async () => {
      return await reputationProfiler.batchAnalyze(accountIds)
    })

    logger.info("[ReputationAnalyzer] Completed", result)

    return result
  },
)
