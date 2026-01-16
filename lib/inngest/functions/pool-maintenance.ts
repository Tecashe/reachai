import { inngest } from "../client"
import { logger } from "@/lib/logger"
import { poolManager } from "@/lib/services/warmup/pool-manager"
import { prisma } from "@/lib/db"

/**
 * Maintain warmup pools
 * Runs daily to update pool stats and clean up inactive members
 */
export const poolMaintenance = inngest.createFunction(
  {
    id: "pool-maintenance",
    name: "Maintain Warmup Pools",
  },
  { cron: "0 3 * * *" }, // 3 AM daily
  async ({ step }) => {
    logger.info("[PoolMaintenance] Starting")

    // Update all pool stats
    const pools = await step.run("get-pools", async () => {
      return await prisma.warmupPool.findMany({ select: { id: true } })
    })

    await step.run("update-pool-stats", async () => {
      for (const pool of pools) {
        await poolManager.updatePoolStats(pool.id)
      }
    })

    // Clean up inactive members
    const cleaned = await step.run("cleanup-inactive", async () => {
      return await poolManager.cleanupInactiveMembers(7)
    })

    logger.info("[PoolMaintenance] Completed", {
      poolsUpdated: pools.length,
      membersRemoved: cleaned.removed,
    })

    return { poolsUpdated: pools.length, membersRemoved: cleaned.removed }
  },
)
