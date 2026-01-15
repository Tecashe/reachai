import { inngest } from '../client'
import { logger } from '@/lib/logger'
import { peerCache } from '@/lib/services/warmup/peer-cache'

/**
 * PEER CACHE REBUILDER
 * Rebuilds peer matching cache every 6 hours
 */
export const peerCacheRebuilder = inngest.createFunction(
  {
    id: 'peer-cache-rebuilder',
    name: 'Rebuild Peer Matching Cache',
  },
  { cron: '0 */6 * * *' }, // Every 6 hours
  async ({ step }) => {
    logger.info('Peer cache rebuild started')

    // Step 1: Precompute all peer caches
    const processed = await step.run('rebuild-cache', async () => {
      return await peerCache.precomputeAllCaches(100)
    })

    // Step 2: Get cache statistics
    const stats = await step.run('get-stats', async () => {
      return await peerCache.getStats()
    })

    logger.info('Peer cache rebuild completed', {
      processed,
      ...stats,
    })

    return {
      processed,
      stats,
      timestamp: new Date().toISOString(),
    }
  }
)

/**
 * ON-DEMAND CACHE REFRESH
 * Triggered when a specific account needs cache refresh
 */
export const peerCacheRefresh = inngest.createFunction(
  {
    id: 'peer-cache-refresh',
    name: 'Refresh Peer Cache for Account',
  },
  { event: 'warmup/cache.rebuild' },
  async ({ event, step }) => {
    const { accountId } = event.data

    if (accountId) {
      // Refresh single account
      logger.info('Refreshing peer cache for account', { accountId })

      const peers = await step.run('refresh-single', async () => {
        return await peerCache.refreshCache(accountId, 30)
      })

      return {
        accountId,
        peersFound: peers.length,
      }
    } else {
      // Refresh all
      logger.info('Refreshing all peer caches')

      const processed = await step.run('refresh-all', async () => {
        return await peerCache.precomputeAllCaches(100)
      })

      return {
        processed,
      }
    }
  }
)