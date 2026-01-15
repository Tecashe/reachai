import { inngest } from '../client'
import { logger } from '@/lib/logger'
import { metricsTracker } from '@/lib/services/warmup/metrics-tracker'
import { sessionManager } from '@/lib/services/warmup/session-manager'
import { replyAutomation } from '@/lib/services/warmup/reply-automation'

/**
 * DAILY MAINTENANCE
 * Runs at midnight UTC to reset counters and clean up
 */
export const dailyMaintenance = inngest.createFunction(
  {
    id: 'daily-maintenance',
    name: 'Daily Warmup Maintenance',
  },
  { cron: '0 0 * * *' }, // Midnight UTC
  async ({ step }) => {
    logger.info('Daily maintenance started')

    // Step 1: Reset daily counters
    const resetCount = await step.run('reset-counters', async () => {
      return await metricsTracker.resetDailyCounters()
    })

    // Step 2: Clean up old sessions
    const deletedSessions = await step.run('cleanup-sessions', async () => {
      return await sessionManager.cleanupOldSessions(30)
    })

    // Step 3: Clean up stale pending replies
    const deletedReplies = await step.run('cleanup-replies', async () => {
      return await replyAutomation.cleanupStalePendingReplies(48)
    })

    // Step 4: Clean up old metrics
    const deletedMetrics = await step.run('cleanup-metrics', async () => {
      return await metricsTracker.cleanupOldMetrics()
    })

    logger.info('Daily maintenance completed', {
      resetCount,
      deletedSessions,
      deletedReplies,
      deletedMetrics,
    })

    return {
      resetCount,
      deletedSessions,
      deletedReplies,
      deletedMetrics,
      timestamp: new Date().toISOString(),
    }
  }
)