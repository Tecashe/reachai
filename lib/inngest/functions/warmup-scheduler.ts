// import { inngest } from '../client'
// import { logger } from '@/lib/logger'
// import { coreWarmupManager } from '@/lib/services/warmup/core-manager'

// /**
//  * MAIN WARMUP SCHEDULER
//  * Runs every hour and enqueues warmup jobs for eligible accounts
//  */
// export const warmupScheduler = inngest.createFunction(
//   {
//     id: 'warmup-scheduler',
//     name: 'Warmup Email Scheduler',
//   },
//   { cron: '0 * * * *' }, // Every hour
//   async ({ step }) => {
//     logger.info('Warmup scheduler started')

//     // Step 1: Get eligible accounts
//     const accountIds = await step.run('get-eligible-accounts', async () => {
//       return await coreWarmupManager.getEligibleAccounts(10000)
//     })

//     if (accountIds.length === 0) {
//       logger.info('No eligible accounts for warmup')
//       return { scheduled: 0 }
//     }

//     logger.info('Scheduling warmup jobs', { count: accountIds.length })

//     // Step 2: Enqueue individual warmup jobs
//     const events = accountIds.map((accountId) => ({
//       name: 'warmup/account.process' as const,
//       data: { accountId, priority: 'normal' as const },
//     }))

//     await step.sendEvent('enqueue-warmup-jobs', events)

//     logger.info('Warmup jobs scheduled', { count: accountIds.length })

//     return {
//       scheduled: accountIds.length,
//       timestamp: new Date().toISOString(),
//     }
//   }
// )

import { inngest } from '../client'
import { logger } from '@/lib/logger'
import { coreWarmupManager } from '@/lib/services/warmup/core-manager'

/**
 * MAIN WARMUP SCHEDULER
 * Triggered by Vercel Cron via event
 */
export const warmupScheduler = inngest.createFunction(
  {
    id: 'warmup-scheduler',
    name: 'Warmup Email Scheduler',
  },
  { event: 'warmup/scheduler.trigger' }, // ✅ Changed from cron to event trigger
  async ({ event, step }) => {
    logger.info('Warmup scheduler started', {
      triggeredBy: event.data.triggeredBy,
      timestamp: event.data.timestamp,
    })

    // Step 1: Get eligible accounts
    const accountIds = await step.run('get-eligible-accounts', async () => {
      return await coreWarmupManager.getEligibleAccounts(10000)
    })

    if (accountIds.length === 0) {
      logger.info('No eligible accounts for warmup')
      return { scheduled: 0 }
    }

    logger.info('Scheduling warmup jobs', { count: accountIds.length })

    // Step 2: Enqueue individual warmup jobs
    const events = accountIds.map((accountId) => ({
      name: 'warmup/account.process' as const,
      data: { accountId, priority: 'normal' as const },
    }))

    await step.sendEvent('enqueue-warmup-jobs', events)

    logger.info('Warmup jobs scheduled', { count: accountIds.length })

    return {
      scheduled: accountIds.length,
      timestamp: new Date().toISOString(),
    }
  }
)