import { inngest } from "../client"
import { logger } from "@/lib/logger"
import { inboxPlacementMonitor } from "@/lib/services/warmup/inbox-placement-monitor"

/**
 * Monitor inbox placements
 * Runs hourly to check where emails are landing
 */
export const placementMonitor = inngest.createFunction(
  {
    id: "placement-monitor",
    name: "Monitor Inbox Placements",
  },
  { cron: "0 * * * *" }, // Every hour
  async ({ step }) => {
    logger.info("[PlacementMonitor] Starting")

    const result = await step.run("monitor-accounts", async () => {
      return await inboxPlacementMonitor.monitorAllAccounts(100)
    })

    if (result.issues.length > 0) {
      await step.run("log-issues", async () => {
        logger.warn("[PlacementMonitor] Issues detected", {
          count: result.issues.length,
          issues: result.issues,
        })
      })
    }

    logger.info("[PlacementMonitor] Completed", {
      monitored: result.monitored,
      issues: result.issues.length,
    })

    return result
  },
)
