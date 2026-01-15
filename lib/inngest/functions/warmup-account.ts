import { inngest } from '../client'
import { logger } from '@/lib/logger'
import { coreWarmupManager } from '@/lib/services/warmup/core-manager'
import { healthMonitor } from '@/lib/services/warmup/health-monitor'
import { prisma } from '@/lib/db'

/**
 * ACCOUNT WARMUP PROCESSOR
 * Processes warmup for a single account
 */
export const warmupAccountProcessor = inngest.createFunction(
  {
    id: 'warmup-account',
    name: 'Process Account Warmup',
    concurrency: {
      limit: 50, // Process 50 accounts simultaneously
    },
    rateLimit: {
      limit: 100, // Max 100 accounts per minute
      period: '1m',
    },
    retries: 2,
  },
  { event: 'warmup/account.process' },
  async ({ event, step }) => {
    const { accountId, priority } = event.data

    logger.info('Processing account warmup', { accountId, priority })

    // Step 1: Process warmup
    const result = await step.run('process-warmup', async () => {
      return await coreWarmupManager.processAccountWarmup(accountId)
    })

    if (!result.success && !result.skipped) {
    //   logger.error('Warmup failed', { accountId, error: result.error })
      
      // Create notification for failed warmup
      await step.run('create-failure-notification', async () => {
        const account = await prisma.sendingAccount.findUnique({
          where: { id: accountId },
          select: { userId: true, email: true },
        })

        if (account) {
          await prisma.notification.create({
            data: {
              userId: account.userId,
              type: 'SYSTEM_UPDATE',
              title: 'Warmup Failed',
              message: `Warmup failed for ${account.email}: ${result.error}`,
              severity: 'warning',
              relatedAccountId: accountId,
            },
          })
        }
      })

      return result
    }

    // Step 2: If successful, check health (every 10 emails)
    if (result.success && result.emailsSent > 0) {
      const account = await prisma.sendingAccount.findUnique({
        where: { id: accountId },
        select: { emailsSentToday: true },
      })

      if (account && account.emailsSentToday % 10 === 0) {
        await step.run('health-check', async () => {
          return await healthMonitor.checkAccountHealth(accountId)
        })
      }
    }

    logger.info('Account warmup completed', {
      accountId,
      success: result.success,
      emailsSent: result.emailsSent,
    })

    return result
  }
)