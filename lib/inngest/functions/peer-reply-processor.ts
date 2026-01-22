import { inngest } from '../client'
import { logger } from '@/lib/logger'
import { replyAutomation } from '@/lib/services/warmup/reply-automation'

/**
 * PEER REPLY PROCESSOR
 * Processes pending peer-to-peer warmup replies
 * Uses the peer account's own SMTP credentials for true peer-to-peer threads
 */
export const peerReplyProcessor = inngest.createFunction(
    {
        id: 'peer-reply-processor',
        name: 'Process Peer Warmup Replies',
        concurrency: {
            limit: 10, // Process 10 reply batches simultaneously
        },
        retries: 2,
    },
    { cron: '*/15 * * * *' }, // Every 15 minutes
    async ({ step }) => {
        logger.info('Peer reply processor started')

        // Step 1: Process pending peer replies
        const result = await step.run('process-peer-replies', async () => {
            return await replyAutomation.processPendingPeerReplies(100)
        })

        logger.info('Peer reply processing completed', {
            processed: result.processed,
            succeeded: result.succeeded,
            failed: result.failed,
        })

        return result
    }
)
