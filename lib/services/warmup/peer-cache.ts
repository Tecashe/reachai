// import { redis, REDIS_KEYS } from '@/lib/redis'
// import { prisma } from '@/lib/db'
// import { logger } from '@/lib/logger'
// import type { SendingAccount } from '@prisma/client'

// interface SendingAccountWithUser {
//   id: string
//   email: string
//   name: string | null
//   provider: string
//   warmupStage: string
//   healthScore: number
//   replyRate: number
//   openRate: number
//   user?: {
//     subscriptionTier: string
//   } | null
// }

// interface CachedPeer {
//   email: string
//   name: string
//   provider: string
//   lastUsed?: Date
//   matchScore: number
// }

// export class PeerMatchingCache {
//   private readonly CACHE_TTL = 3600 // 1 hour
//   private readonly CACHE_VERSION = 'v2' // Increment to invalidate all caches

//   /**
//    * Get cached peer matches for an account
//    */
//   async getCachedMatches(
//     accountId: string,
//     limit = 10
//   ): Promise<CachedPeer[]> {
//     const cacheKey = this.getCacheKey(accountId)

//     try {
//       const cached = await redis.get(cacheKey)

//       if (cached && typeof cached === 'string') {
//         const peers = JSON.parse(cached) as CachedPeer[]
//         logger.debug('Peer cache hit', { accountId, count: peers.length })
//         return peers.slice(0, limit)
//       }

//       // Cache miss - compute and cache
//       logger.debug('Peer cache miss', { accountId })
//       return await this.refreshCache(accountId, limit * 3)
//     } catch (error) {
//       logger.error('Failed to get cached peers', error as Error, { accountId })
      
//       // Fallback: direct DB query
//       return await this.computePeerMatches(accountId, limit)
//     }
//   }

//   /**
//    * Refresh cache for a specific account
//    */
//   async refreshCache(
//     accountId: string,
//     limit = 30
//   ): Promise<CachedPeer[]> {
//     const peers = await this.computePeerMatches(accountId, limit)
//     const cacheKey = this.getCacheKey(accountId)

//     try {
//       await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(peers))
//       logger.info('Peer cache refreshed', { accountId, count: peers.length })
//     } catch (error) {
//       logger.error('Failed to cache peers', error as Error, { accountId })
//     }

//     return peers
//   }

//   /**
//    * Compute peer matches using intelligent algorithm
//    */
//   private async computePeerMatches(
//     accountId: string,
//     limit: number
//   ): Promise<CachedPeer[]> {
//     const account = await prisma.sendingAccount.findUnique({
//       where: { id: accountId },
//       include: { 
//         user: {
//           select: {
//             subscriptionTier: true,
//             industry: true,
//           }
//         }
//       },
//     })

//     if (!account) {
//       logger.warn('Account not found for peer matching', { accountId })
//       return []
//     }

//     // Get subscription tier
//     const tier = account.user?.subscriptionTier || 'FREE'

//     // Eligible stages for peer warmup
//     const eligibleStages = ['WARM', 'ACTIVE', 'ESTABLISHED']

//     if (!eligibleStages.includes(account.warmupStage)) {
//       logger.debug('Account not eligible for peer warmup', {
//         accountId,
//         stage: account.warmupStage,
//       })
//       return []
//     }

//     // Find matching peers
//     const candidates = await prisma.sendingAccount.findMany({
//       where: {
//         id: { not: accountId },
//         peerWarmupEnabled: true,
//         peerWarmupOptIn: true,
//         isActive: true,
//         pausedAt: null,
//         warmupStage: { in: eligibleStages },
//         healthScore: { gte: 70 }, // Only healthy accounts
//         bounceRate: { lte: 5 },
//         // Tier-based matching
//         user: {
//           subscriptionTier: this.getTierPool(tier),
//         },
//       },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         provider: true,
//         warmupStage: true,
//         healthScore: true,
//         replyRate: true,
//         openRate: true,
//         user: {
//           select: {
//             subscriptionTier: true,
//           },
//         },
//       },
//       take: limit * 2, // Get extra for scoring
//     })

//     // Score and sort peers
//     const scoredPeers = candidates
//       .map((peer) => ({
//         email: peer.email,
//         name: peer.name || peer.email.split('@')[0],
//         provider: peer.provider,
//         matchScore: this.calculateMatchScore(account, peer),
//       }))
//       .sort((a, b) => b.matchScore - a.matchScore)
//       .slice(0, limit)

//     logger.debug('Computed peer matches', {
//       accountId,
//       candidates: candidates.length,
//       matched: scoredPeers.length,
//     })

//     return scoredPeers
//   }

//   /**
//    * Calculate match score between two accounts
//    */
//   private calculateMatchScore(
//     account: any,
//     peer: any
//   ): number {
//     let score = 100

//     // Same tier bonus
//     if (account.user?.subscriptionTier === peer.user?.subscriptionTier) {
//       score += 20
//     }

//     // Similar warmup stage bonus
//     if (account.warmupStage === peer.warmupStage) {
//       score += 15
//     }

//     // Health score factor
//     score += peer.healthScore * 0.3

//     // Engagement factor
//     score += (peer.replyRate || 0) * 0.2
//     score += (peer.openRate || 0) * 0.1

//     // Different provider bonus (more realistic)
//     if (account.provider !== peer.provider) {
//       score += 10
//     }

//     return Math.round(score)
//   }

//   /**
//    * Get tier-specific peer pool
//    */
//   private getTierPool(tier: string): string[] {
//   switch (tier) {
//     case 'FREE':
//       return ['FREE']
//     case 'STARTER':
//       return ['FREE', 'STARTER']
//     case 'PRO':
//       return ['STARTER', 'PRO']
//     case 'AGENCY':
//       return ['PRO', 'AGENCY']
//     default:
//       return ['FREE']
//   }
// }

//   /**
//    * Pre-compute cache for all eligible accounts (background job)
//    */
//   async precomputeAllCaches(batchSize = 100): Promise<number> {
//     const accounts = await prisma.sendingAccount.findMany({
//       where: {
//         peerWarmupEnabled: true,
//         isActive: true,
//         pausedAt: null,
//         warmupStage: { in: ['WARM', 'ACTIVE', 'ESTABLISHED'] },
//       },
//       select: { id: true },
//     })

//     logger.info('Starting peer cache precomputation', {
//       total: accounts.length,
//     })

//     let processed = 0
//     const accountIds = accounts.map((a) => a.id)

//     // Process in batches
//     for (let i = 0; i < accountIds.length; i += batchSize) {
//       const batch = accountIds.slice(i, i + batchSize)

//       await Promise.allSettled(
//         batch.map((accountId) => this.refreshCache(accountId, 30))
//       )

//       processed += batch.length

//       logger.info('Peer cache batch completed', {
//         processed,
//         total: accounts.length,
//         progress: `${((processed / accounts.length) * 100).toFixed(1)}%`,
//       })

//       // Small delay between batches to avoid overwhelming the system
//       await new Promise((resolve) => setTimeout(resolve, 100))
//     }

//     logger.info('Peer cache precomputation complete', {
//       total: accounts.length,
//       processed,
//     })

//     return processed
//   }

//   /**
//    * Invalidate cache for an account
//    */
//   async invalidate(accountId: string): Promise<void> {
//     const cacheKey = this.getCacheKey(accountId)

//     try {
//       await redis.del(cacheKey)
//       logger.debug('Peer cache invalidated', { accountId })
//     } catch (error) {
//       logger.error('Failed to invalidate cache', error as Error, { accountId })
//     }
//   }

//   /**
//    * Invalidate all caches (use when algorithm changes)
//    */
//   async invalidateAll(): Promise<number> {
//     try {
//       const pattern = `${REDIS_KEYS.PEER_CACHE}*`
//       const keys = await redis.keys(pattern)

//       if (keys.length === 0) return 0

//       await redis.del(...keys)

//       logger.warn('All peer caches invalidated', { count: keys.length })
//       return keys.length
//     } catch (error) {
//       logger.error('Failed to invalidate all caches', error as Error)
//       return 0
//     }
//   }

//   /**
//    * Get cache key for an account
//    */
//   private getCacheKey(accountId: string): string {
//     return `${REDIS_KEYS.PEER_CACHE}${this.CACHE_VERSION}:${accountId}`
//   }

//   /**
//    * Get cache statistics
//    */
//   async getStats(): Promise<{
//     totalCached: number
//     avgCacheSize: number
//     oldestCache: number
//   }> {
//     try {
//       const pattern = `${REDIS_KEYS.PEER_CACHE}${this.CACHE_VERSION}:*`
//       const keys = await redis.keys(pattern)

//       if (keys.length === 0) {
//         return { totalCached: 0, avgCacheSize: 0, oldestCache: 0 }
//       }

//       // Get TTLs for all keys
//       const ttls = await Promise.all(keys.map((key) => redis.ttl(key)))

//       const oldestCache = Math.max(...ttls.filter((ttl) => ttl > 0))

//       return {
//         totalCached: keys.length,
//         avgCacheSize: 0, // Would need to fetch all to calculate
//         oldestCache,
//       }
//     } catch (error) {
//       logger.error('Failed to get cache stats', error as Error)
//       return { totalCached: 0, avgCacheSize: 0, oldestCache: 0 }
//     }
//   }
// }

// export const peerCache = new PeerMatchingCache()


// import { redis, REDIS_KEYS } from '@/lib/redis'
// import { prisma } from '@/lib/db'
// import { logger } from '@/lib/logger'
// import type { SendingAccount, WarmupStage, SubscriptionTier } from '@prisma/client'

// interface SendingAccountWithUser {
//   id: string
//   email: string
//   name: string | null
//   provider: string
//   warmupStage: string
//   healthScore: number
//   replyRate: number
//   openRate: number
//   user?: {
//     subscriptionTier: string
//   } | null
// }

// interface CachedPeer {
//   email: string
//   name: string
//   provider: string
//   lastUsed?: Date
//   matchScore: number
// }

// export class PeerMatchingCache {
//   private readonly CACHE_TTL = 3600 // 1 hour
//   private readonly CACHE_VERSION = 'v2' // Increment to invalidate all caches

//   /**
//    * Get cached peer matches for an account
//    */
//   async getCachedMatches(
//     accountId: string,
//     limit = 10
//   ): Promise<CachedPeer[]> {
//     const cacheKey = this.getCacheKey(accountId)

//     try {
//       const cached = await redis.get(cacheKey)

//       if (cached && typeof cached === 'string') {
//         const peers = JSON.parse(cached) as CachedPeer[]
//         logger.debug('Peer cache hit', { accountId, count: peers.length })
//         return peers.slice(0, limit)
//       }

//       // Cache miss - compute and cache
//       logger.debug('Peer cache miss', { accountId })
//       return await this.refreshCache(accountId, limit * 3)
//     } catch (error) {
//       logger.error('Failed to get cached peers', error as Error, { accountId })
      
//       // Fallback: direct DB query
//       return await this.computePeerMatches(accountId, limit)
//     }
//   }

//   /**
//    * Refresh cache for a specific account
//    */
//   async refreshCache(
//     accountId: string,
//     limit = 30
//   ): Promise<CachedPeer[]> {
//     const peers = await this.computePeerMatches(accountId, limit)
//     const cacheKey = this.getCacheKey(accountId)

//     try {
//       await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(peers))
//       logger.info('Peer cache refreshed', { accountId, count: peers.length })
//     } catch (error) {
//       logger.error('Failed to cache peers', error as Error, { accountId })
//     }

//     return peers
//   }

//   /**
//    * Compute peer matches using intelligent algorithm
//    */
//   private async computePeerMatches(
//     accountId: string,
//     limit: number
//   ): Promise<CachedPeer[]> {
//     const account = await prisma.sendingAccount.findUnique({
//       where: { id: accountId },
//       include: { 
//         user: {
//           select: {
//             subscriptionTier: true,
//           }
//         }
//       },
//     })

//     if (!account) {
//       logger.warn('Account not found for peer matching', { accountId })
//       return []
//     }

//     // Get subscription tier
//     const tier = account.user?.subscriptionTier || 'FREE'

//     // Eligible stages for peer warmup - typed as WarmupStage[]
//     const eligibleStages: WarmupStage[] = ['WARM', 'ACTIVE', 'ESTABLISHED']

//     if (!eligibleStages.includes(account.warmupStage as WarmupStage)) {
//       logger.debug('Account not eligible for peer warmup', {
//         accountId,
//         stage: account.warmupStage,
//       })
//       return []
//     }

//     // Get tier pool for matching
//     const tierPool = this.getTierPool(tier)

//     // Find matching peers
//     const candidates = await prisma.sendingAccount.findMany({
//       where: {
//         id: { not: accountId },
//         peerWarmupEnabled: true,
//         peerWarmupOptIn: true,
//         isActive: true,
//         pausedAt: null,
//         warmupStage: { in: eligibleStages },
//         healthScore: { gte: 70 }, // Only healthy accounts
//         bounceRate: { lte: 5 },
//         // Tier-based matching
//         user: {
//           subscriptionTier: { in: tierPool },
//         },
//       },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         provider: true,
//         warmupStage: true,
//         healthScore: true,
//         replyRate: true,
//         openRate: true,
//         user: {
//           select: {
//             subscriptionTier: true,
//           },
//         },
//       },
//       take: limit * 2, // Get extra for scoring
//     })

//     // Score and sort peers
//     const scoredPeers = candidates
//       .map((peer) => ({
//         email: peer.email,
//         name: peer.name || peer.email.split('@')[0],
//         provider: peer.provider,
//         matchScore: this.calculateMatchScore(account, peer),
//       }))
//       .sort((a, b) => b.matchScore - a.matchScore)
//       .slice(0, limit)

//     logger.debug('Computed peer matches', {
//       accountId,
//       candidates: candidates.length,
//       matched: scoredPeers.length,
//     })

//     return scoredPeers
//   }

//   /**
//    * Calculate match score between two accounts
//    */
//   private calculateMatchScore(
//     account: any,
//     peer: any
//   ): number {
//     let score = 100

//     // Same tier bonus
//     if (account.user?.subscriptionTier === peer.user?.subscriptionTier) {
//       score += 20
//     }

//     // Similar warmup stage bonus
//     if (account.warmupStage === peer.warmupStage) {
//       score += 15
//     }

//     // Health score factor
//     score += peer.healthScore * 0.3

//     // Engagement factor
//     score += (peer.replyRate || 0) * 0.2
//     score += (peer.openRate || 0) * 0.1

//     // Different provider bonus (more realistic)
//     if (account.provider !== peer.provider) {
//       score += 10
//     }

//     return Math.round(score)
//   }

//   /**
//    * Get tier-specific peer pool
//    */
//   private getTierPool(tier: string): SubscriptionTier[] {
//     switch (tier) {
//       case 'FREE':
//         return ['FREE']
//       case 'STARTER':
//         return ['FREE', 'STARTER']
//       case 'PRO':
//         return ['STARTER', 'PRO']
//       case 'AGENCY':
//         return ['PRO', 'AGENCY']
//       default:
//         return ['FREE']
//     }
//   }

//   /**
//    * Pre-compute cache for all eligible accounts (background job)
//    */
//   async precomputeAllCaches(batchSize = 100): Promise<number> {
//     const accounts = await prisma.sendingAccount.findMany({
//       where: {
//         peerWarmupEnabled: true,
//         isActive: true,
//         pausedAt: null,
//         warmupStage: { in: ['WARM', 'ACTIVE', 'ESTABLISHED'] },
//       },
//       select: { id: true },
//     })

//     logger.info('Starting peer cache precomputation', {
//       total: accounts.length,
//     })

//     let processed = 0
//     const accountIds = accounts.map((a) => a.id)

//     // Process in batches
//     for (let i = 0; i < accountIds.length; i += batchSize) {
//       const batch = accountIds.slice(i, i + batchSize)

//       await Promise.allSettled(
//         batch.map((accountId) => this.refreshCache(accountId, 30))
//       )

//       processed += batch.length

//       logger.info('Peer cache batch completed', {
//         processed,
//         total: accounts.length,
//         progress: `${((processed / accounts.length) * 100).toFixed(1)}%`,
//       })

//       // Small delay between batches to avoid overwhelming the system
//       await new Promise((resolve) => setTimeout(resolve, 100))
//     }

//     logger.info('Peer cache precomputation complete', {
//       total: accounts.length,
//       processed,
//     })

//     return processed
//   }

//   /**
//    * Invalidate cache for an account
//    */
//   async invalidate(accountId: string): Promise<void> {
//     const cacheKey = this.getCacheKey(accountId)

//     try {
//       await redis.del(cacheKey)
//       logger.debug('Peer cache invalidated', { accountId })
//     } catch (error) {
//       logger.error('Failed to invalidate cache', error as Error, { accountId })
//     }
//   }

//   /**
//    * Invalidate all caches (use when algorithm changes)
//    */
//   async invalidateAll(): Promise<number> {
//     try {
//       const pattern = `${REDIS_KEYS.PEER_CACHE}*`
//       const keys = await redis.keys(pattern)

//       if (keys.length === 0) return 0

//       await redis.del(...keys)

//       logger.warn('All peer caches invalidated', { count: keys.length })
//       return keys.length
//     } catch (error) {
//       logger.error('Failed to invalidate all caches', error as Error)
//       return 0
//     }
//   }

//   /**
//    * Get cache key for an account
//    */
//   private getCacheKey(accountId: string): string {
//     return `${REDIS_KEYS.PEER_CACHE}${this.CACHE_VERSION}:${accountId}`
//   }

//   /**
//    * Get cache statistics
//    */
//   async getStats(): Promise<{
//     totalCached: number
//     avgCacheSize: number
//     oldestCache: number
//   }> {
//     try {
//       const pattern = `${REDIS_KEYS.PEER_CACHE}${this.CACHE_VERSION}:*`
//       const keys = await redis.keys(pattern)

//       if (keys.length === 0) {
//         return { totalCached: 0, avgCacheSize: 0, oldestCache: 0 }
//       }

//       // Get TTLs for all keys
//       const ttls = await Promise.all(keys.map((key) => redis.ttl(key)))

//       const oldestCache = Math.max(...ttls.filter((ttl) => ttl > 0))

//       return {
//         totalCached: keys.length,
//         avgCacheSize: 0, // Would need to fetch all to calculate
//         oldestCache,
//       }
//     } catch (error) {
//       logger.error('Failed to get cache stats', error as Error)
//       return { totalCached: 0, avgCacheSize: 0, oldestCache: 0 }
//     }
//   }
// }

// export const peerCache = new PeerMatchingCache()

import { redis, REDIS_KEYS } from '@/lib/redis'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import type { SendingAccount, WarmupStage, SubscriptionTier } from '@prisma/client'

interface SendingAccountWithUser {
  id: string
  email: string
  name: string | null
  provider: string
  warmupStage: string
  healthScore: number
  replyRate: number
  openRate: number
  user?: {
    subscriptionTier: string
  } | null
}

interface CachedPeer {
  id: string          // ✅ ADDED
  email: string
  name: string
  provider: string
  lastUsed?: Date
  matchScore: number
}

export class PeerMatchingCache {
  private readonly CACHE_TTL = 3600 // 1 hour
  private readonly CACHE_VERSION = 'v2' // Increment to invalidate all caches

  /**
   * Get cached peer matches for an account
   */
  async getCachedMatches(
    accountId: string,
    limit = 10
  ): Promise<CachedPeer[]> {
    const cacheKey = this.getCacheKey(accountId)

    try {
      const cached = await redis.get(cacheKey)

      if (cached && typeof cached === 'string') {
        const peers = JSON.parse(cached) as CachedPeer[]
        logger.debug('Peer cache hit', { accountId, count: peers.length })
        return peers.slice(0, limit)
      }

      // Cache miss - compute and cache
      logger.debug('Peer cache miss', { accountId })
      return await this.refreshCache(accountId, limit * 3)
    } catch (error) {
      logger.error('Failed to get cached peers', error as Error, { accountId })
      
      // Fallback: direct DB query
      return await this.computePeerMatches(accountId, limit)
    }
  }

  /**
   * Refresh cache for a specific account
   */
  async refreshCache(
    accountId: string,
    limit = 30
  ): Promise<CachedPeer[]> {
    const peers = await this.computePeerMatches(accountId, limit)
    const cacheKey = this.getCacheKey(accountId)

    try {
      await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(peers))
      logger.info('Peer cache refreshed', { accountId, count: peers.length })
    } catch (error) {
      logger.error('Failed to cache peers', error as Error, { accountId })
    }

    return peers
  }

  /**
   * Compute peer matches using intelligent algorithm
   */
  private async computePeerMatches(
    accountId: string,
    limit: number
  ): Promise<CachedPeer[]> {
    const account = await prisma.sendingAccount.findUnique({
      where: { id: accountId },
      include: { 
        user: {
          select: {
            subscriptionTier: true,
          }
        }
      },
    })

    if (!account) {
      logger.warn('Account not found for peer matching', { accountId })
      return []
    }

    // Get subscription tier
    const tier = account.user?.subscriptionTier || 'FREE'

    // Eligible stages for peer warmup - typed as WarmupStage[]
    const eligibleStages: WarmupStage[] = ['WARM', 'ACTIVE', 'ESTABLISHED']

    if (!eligibleStages.includes(account.warmupStage as WarmupStage)) {
      logger.debug('Account not eligible for peer warmup', {
        accountId,
        stage: account.warmupStage,
      })
      return []
    }

    // Get tier pool for matching
    const tierPool = this.getTierPool(tier)

    // Find matching peers
    const candidates = await prisma.sendingAccount.findMany({
      where: {
        id: { not: accountId },
        peerWarmupEnabled: true,
        peerWarmupOptIn: true,
        isActive: true,
        pausedAt: null,
        warmupStage: { in: eligibleStages },
        healthScore: { gte: 70 }, // Only healthy accounts
        bounceRate: { lte: 5 },
        // Tier-based matching
        user: {
          subscriptionTier: { in: tierPool },
        },
      },
      select: {
        id: true,          // ✅ Make sure this is selected
        email: true,
        name: true,
        provider: true,
        warmupStage: true,
        healthScore: true,
        replyRate: true,
        openRate: true,
        user: {
          select: {
            subscriptionTier: true,
          },
        },
      },
      take: limit * 2, // Get extra for scoring
    })

    // Score and sort peers
    const scoredPeers = candidates
      .map((peer) => ({
        id: peer.id,       // ✅ ADDED - map the id from the peer
        email: peer.email,
        name: peer.name || peer.email.split('@')[0],
        provider: peer.provider,
        matchScore: this.calculateMatchScore(account, peer),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit)

    logger.debug('Computed peer matches', {
      accountId,
      candidates: candidates.length,
      matched: scoredPeers.length,
    })

    return scoredPeers
  }

  /**
   * Calculate match score between two accounts
   */
  private calculateMatchScore(
    account: any,
    peer: any
  ): number {
    let score = 100

    // Same tier bonus
    if (account.user?.subscriptionTier === peer.user?.subscriptionTier) {
      score += 20
    }

    // Similar warmup stage bonus
    if (account.warmupStage === peer.warmupStage) {
      score += 15
    }

    // Health score factor
    score += peer.healthScore * 0.3

    // Engagement factor
    score += (peer.replyRate || 0) * 0.2
    score += (peer.openRate || 0) * 0.1

    // Different provider bonus (more realistic)
    if (account.provider !== peer.provider) {
      score += 10
    }

    return Math.round(score)
  }

  /**
   * Get tier-specific peer pool
   */
  private getTierPool(tier: string): SubscriptionTier[] {
    switch (tier) {
      case 'FREE':
        return ['FREE']
      case 'STARTER':
        return ['FREE', 'STARTER']
      case 'PRO':
        return ['STARTER', 'PRO']
      case 'AGENCY':
        return ['PRO', 'AGENCY']
      default:
        return ['FREE']
    }
  }

  /**
   * Pre-compute cache for all eligible accounts (background job)
   */
  async precomputeAllCaches(batchSize = 100): Promise<number> {
    const accounts = await prisma.sendingAccount.findMany({
      where: {
        peerWarmupEnabled: true,
        isActive: true,
        pausedAt: null,
        warmupStage: { in: ['WARM', 'ACTIVE', 'ESTABLISHED'] },
      },
      select: { id: true },
    })

    logger.info('Starting peer cache precomputation', {
      total: accounts.length,
    })

    let processed = 0
    const accountIds = accounts.map((a) => a.id)

    // Process in batches
    for (let i = 0; i < accountIds.length; i += batchSize) {
      const batch = accountIds.slice(i, i + batchSize)

      await Promise.allSettled(
        batch.map((accountId) => this.refreshCache(accountId, 30))
      )

      processed += batch.length

      logger.info('Peer cache batch completed', {
        processed,
        total: accounts.length,
        progress: `${((processed / accounts.length) * 100).toFixed(1)}%`,
      })

      // Small delay between batches to avoid overwhelming the system
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    logger.info('Peer cache precomputation complete', {
      total: accounts.length,
      processed,
    })

    return processed
  }

  /**
   * Invalidate cache for an account
   */
  async invalidate(accountId: string): Promise<void> {
    const cacheKey = this.getCacheKey(accountId)

    try {
      await redis.del(cacheKey)
      logger.debug('Peer cache invalidated', { accountId })
    } catch (error) {
      logger.error('Failed to invalidate cache', error as Error, { accountId })
    }
  }

  /**
   * Invalidate all caches (use when algorithm changes)
   */
  async invalidateAll(): Promise<number> {
    try {
      const pattern = `${REDIS_KEYS.PEER_CACHE}*`
      const keys = await redis.keys(pattern)

      if (keys.length === 0) return 0

      await redis.del(...keys)

      logger.warn('All peer caches invalidated', { count: keys.length })
      return keys.length
    } catch (error) {
      logger.error('Failed to invalidate all caches', error as Error)
      return 0
    }
  }

  /**
   * Get cache key for an account
   */
  private getCacheKey(accountId: string): string {
    return `${REDIS_KEYS.PEER_CACHE}${this.CACHE_VERSION}:${accountId}`
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    totalCached: number
    avgCacheSize: number
    oldestCache: number
  }> {
    try {
      const pattern = `${REDIS_KEYS.PEER_CACHE}${this.CACHE_VERSION}:*`
      const keys = await redis.keys(pattern)

      if (keys.length === 0) {
        return { totalCached: 0, avgCacheSize: 0, oldestCache: 0 }
      }

      // Get TTLs for all keys
      const ttls = await Promise.all(keys.map((key) => redis.ttl(key)))

      const oldestCache = Math.max(...ttls.filter((ttl) => ttl > 0))

      return {
        totalCached: keys.length,
        avgCacheSize: 0, // Would need to fetch all to calculate
        oldestCache,
      }
    } catch (error) {
      logger.error('Failed to get cache stats', error as Error)
      return { totalCached: 0, avgCacheSize: 0, oldestCache: 0 }
    }
  }
}

export const peerCache = new PeerMatchingCache()