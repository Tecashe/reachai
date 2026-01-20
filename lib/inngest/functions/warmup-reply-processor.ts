import { inngest } from '../client'
import { logger } from '@/lib/logger'
import { replyAutomation } from '@/lib/services/warmup/reply-automation'

/**
 * WARMUP REPLY PROCESSOR
 * Processes pending replies every 15 minutes
 */
export const warmupReplyProcessor = inngest.createFunction(
  {
    id: 'warmup-reply-processor',
    name: 'Process Warmup Replies',
    concurrency: {
      limit: 4, // Process 10 reply batches simultaneously
    },
  },
  { cron: '*/45 * * * *' }, // Every 15 minutes TODO: change back to 15
  async ({ step }) => {
    logger.info('Reply processor started')

    // Step 1: Process pending replies
    const result = await step.run('process-replies', async () => {
      return await replyAutomation.processPendingReplies(100)
    })

    logger.info('Reply processing completed', {
      processed: result.processed,
      succeeded: result.succeeded,
      failed: result.failed,
    })

    // Step 2: Clean up stale pending replies
    await step.run('cleanup-stale-replies', async () => {
      return await replyAutomation.cleanupStalePendingReplies(48)
    })

    return result
  }
)