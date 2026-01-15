import { inngest } from '../client'
import { logger } from '@/lib/logger'
import { healthMonitor } from '@/lib/services/warmup/health-monitor'
import { prisma } from '@/lib/db'

/**
 * HEALTH MONITOR
 * Checks account health every 6 hours
 */
export const healthMonitorJob = inngest.createFunction(
  {
    id: 'health-monitor',
    name: 'Monitor Account Health',
  },
  { cron: '0 */6 * * *' }, // Every 6 hours
  async ({ step }) => {
    logger.info('Health monitor started')

    // Step 1: Auto-pause unhealthy accounts
    const pauseResult = await step.run('auto-pause', async () => {
      return await healthMonitor.autoPauseUnhealthyAccounts()
    })

    logger.info('Auto-pause completed', pauseResult)

    // Step 2: Get health statistics
    const stats = await step.run('get-stats', async () => {
      return await healthMonitor.getHealthStatistics()
    })

    // Step 3: Create alerts for critical accounts
    if (stats.critical > 0) {
      await step.run('create-critical-alerts', async () => {
        const criticalAccounts = await prisma.sendingAccount.findMany({
          where: {
            warmupEnabled: true,
            isActive: true,
            healthScore: { lt: 40 },
          },
          include: {
            user: {
              select: { id: true },
            },
          },
          take: 10, // Limit notifications
        })

        for (const account of criticalAccounts) {
          await prisma.notification.create({
            data: {
              userId: account.user.id,
              type: 'SYSTEM_UPDATE',
              title: 'Critical Account Health',
              message: `Account ${account.email} has critical health issues (Score: ${account.healthScore}/100)`,
              severity: 'critical',
              relatedAccountId: account.id,
            },
          })
        }

        return criticalAccounts.length
      })
    }

    logger.info('Health monitor completed', {
      ...pauseResult,
      ...stats,
    })

    return {
      pauseResult,
      stats,
      timestamp: new Date().toISOString(),
    }
  }
)

/**
 * ON-DEMAND HEALTH CHECK
 * Triggered when a specific account needs health check
 */
export const healthCheckJob = inngest.createFunction(
  {
    id: 'health-check',
    name: 'Check Account Health',
  },
  { event: 'warmup/health.check' },
  async ({ event, step }) => {
    const { accountId } = event.data

    if (!accountId) {
      logger.warn('No accountId provided for health check')
      return { error: 'No accountId provided' }
    }

    logger.info('Running health check', { accountId })

    const result = await step.run('check-health', async () => {
      return await healthMonitor.checkAccountHealth(accountId)
    })

    // If action is pause, pause the account
    if (result.action === 'pause') {
      await step.run('pause-account', async () => {
        await prisma.sendingAccount.update({
          where: { id: accountId },
          data: {
            isActive: false,
            pausedAt: new Date(),
            pausedReason: result.reason,
          },
        })
      })

      // Create notification
      await step.run('create-notification', async () => {
        const account = await prisma.sendingAccount.findUnique({
          where: { id: accountId },
          select: { userId: true, email: true },
        })

        if (account) {
          await prisma.notification.create({
            data: {
              userId: account.userId,
              type: 'ACCOUNT_PAUSED',
              title: 'Account Paused',
              message: `${account.email} was automatically paused: ${result.reason}`,
              severity: 'critical',
              relatedAccountId: accountId,
            },
          })
        }
      })
    }

    logger.info('Health check completed', {
      accountId,
      action: result.action,
    })

    return result
  }
)