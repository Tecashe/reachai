// import { prisma } from "@/lib/db"
// import { redis } from "@/lib/redis"
// import { logger } from "@/lib/logger"

// /**
//  * PRIVATE POOL MANAGER
//  * Creates and manages private warmup pools based on reputation, industry, ESP
//  * Prevents high-risk accounts from contaminating pristine accounts
//  * Optimized for 100,000+ accounts with intelligent pool assignment
//  */
// class PoolManager {
//   private readonly CACHE_TTL = 3600 // 1 hour
//   private readonly REDIS_PREFIX = "warmup:pool:"

//   /**
//    * Initialize defaultpools
//    * Run this once during system setup
//    */
//   async initializeDefaultPools(): Promise<void> {
//     try {
//       // Create reputation tier pools
//       const reputationPools = [
//         { name: "Pristine Pool", tier: "PRISTINE", description: "Perfect reputation accounts only" },
//         { name: "High Tier Pool", tier: "HIGH", description: "Good reputation accounts" },
//         { name: "Medium Tier Pool", tier: "MEDIUM", description: "Average reputation accounts" },
//         { name: "Recovery Pool", tier: "LOW", description: "Accounts recovering reputation" },
//       ]

//       for (const pool of reputationPools) {
//         await prisma.warmupPool.upsert({
//           where: { name: pool.name },
//           create: {
//             name: pool.name,
//             description: pool.description,
//             reputationTier: pool.tier as any,
//             isDefault: true,
//             maxMembers: 10000,
//             minEngagement: 0.5,
//           },
//           update: {},
//         })
//       }

//       // Create industry pools
//       const industries = ["tech", "finance", "healthcare", "marketing", "education"]
//       for (const industry of industries) {
//         await prisma.warmupPool.upsert({
//           where: { name: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Pool` },
//           create: {
//             name: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Pool`,
//             description: `Industry-specific pool for ${industry}`,
//             industry,
//             isDefault: false,
//             maxMembers: 5000,
//             minEngagement: 0.4,
//           },
//           update: {},
//         })
//       }

//       logger.info("[PoolManager] Default pools initialized")
//     } catch (error) {
//       logger.error("[PoolManager] Pool initialization failed", { error })
//     }
//   }

//   /**
//    * Assign account to appropriate pools
//    * Automatically selects best pools based on profile
//    */
//   async assignAccountToPools(accountId: string): Promise<{
//     success: boolean
//     poolIds?: string[]
//     error?: string
//   }> {
//     try {
//       const account = await prisma.sendingAccount.findUnique({
//         where: { id: accountId },
//         include: { reputationProfile: true },
//       })

//       if (!account || !account.reputationProfile) {
//         return { success: false, error: "Account or profile not found" }
//       }

//       const profile = account.reputationProfile

//       // Find matching pools
//       const matchingPools = await this.findMatchingPools({
//         reputationTier: profile.reputationTier,
//         industry: profile.industry,
//         espType: profile.espType,
//       })

//       if (matchingPools.length === 0) {
//         return { success: false, error: "No matching pools found" }
//       }

//       // Create memberships
//       const poolIds: string[] = []
//       for (const pool of matchingPools) {
//         // Check if already a member
//         const existing = await prisma.poolMembership.findUnique({
//           where: {
//             accountId_poolId: {
//               accountId,
//               poolId: pool.id,
//             },
//           },
//         })

//         if (existing) {
//           poolIds.push(pool.id)
//           continue
//         }

//         // Check if pool is full
//         if (pool.activeMembers >= pool.maxMembers) {
//           continue
//         }

//         // Create membership
//         await prisma.poolMembership.create({
//           data: {
//             accountId,
//             poolId: pool.id,
//             status: "ACTIVE",
//             lastActiveAt: new Date(),
//           },
//         })

//         // Update pool member count
//         await prisma.warmupPool.update({
//           where: { id: pool.id },
//           data: { activeMembers: { increment: 1 } },
//         })

//         poolIds.push(pool.id)
//       }

//       // Cache pool assignments
//       await this.cachePoolAssignments(accountId, poolIds)

//       logger.info("[PoolManager] Account assigned to pools", {
//         accountId,
//         poolCount: poolIds.length,
//       })

//       return { success: true, poolIds }
//     } catch (error) {
//       logger.error("[PoolManager] Pool assignment failed", { error, accountId })
//       return { success: false, error: error.message }
//     }
//   }

//   /**
//    * Find matching pools based on criteria
//    */
//   private async findMatchingPools(criteria: {
//     reputationTier: string
//     industry?: string | null
//     espType?: string | null
//   }): Promise<any[]> {
//     const pools: any[] = []

//     // 1. Reputation tier pool (mandatory)
//     const tierPool = await prisma.warmupPool.findFirst({
//       where: {
//         reputationTier: criteria.reputationTier as any,
//         isDefault: true,
//       },
//     })
//     if (tierPool) pools.push(tierPool)

//     // 2. Industry pool (if available and relevant)
//     if (criteria.industry) {
//       const industryPool = await prisma.warmupPool.findFirst({
//         where: {
//           industry: criteria.industry,
//           activeMembers: { lt: prisma.warmupPool.fields.maxMembers },
//         },
//       })
//       if (industryPool) pools.push(industryPool)
//     }

//     // 3. ESP-specific pool (if needed)
//     if (criteria.espType && ["gmail", "outlook"].includes(criteria.espType)) {
//       const espPool = await prisma.warmupPool.findFirst({
//         where: {
//           espType: criteria.espType,
//           activeMembers: { lt: prisma.warmupPool.fields.maxMembers },
//         },
//       })
//       if (espPool) pools.push(espPool)
//     }

//     return pools
//   }

//   /**
//    * Get peers from account's pools
//    * Returns accounts from same pools for warmup interactions
//    */
//   async getPoolPeers(accountId: string, limit = 50): Promise<string[]> {
//     try {
//       // Get account's pools (from cache or database)
//       const poolIds = await this.getAccountPools(accountId)

//       if (poolIds.length === 0) {
//         return []
//       }

//       // Get active members from these pools
//       const peers = await prisma.poolMembership.findMany({
//         where: {
//           poolId: { in: poolIds },
//           status: "ACTIVE",
//           accountId: { not: accountId }, // Exclude self
//         },
//         select: { accountId: true },
//         take: limit * 2, // Get more than needed for randomization
//       })

//       // Randomize and limit
//       const shuffled = peers
//         .map((p) => p.accountId)
//         .sort(() => Math.random() - 0.5)
//         .slice(0, limit)

//       return shuffled
//     } catch (error) {
//       logger.error("[PoolManager] Failed to get pool peers", { error, accountId })
//       return []
//     }
//   }

//   /**
//    * Update pool statistics
//    * Run periodically to keep pool metrics up to date
//    */
//   async updatePoolStats(poolId: string): Promise<void> {
//     try {
//       const memberships = await prisma.poolMembership.findMany({
//         where: { poolId, status: "ACTIVE" },
//         include: { account: true },
//       })

//       if (memberships.length === 0) return

//       // Calculate engagement rates
//       const engagementRates = await Promise.all(
//         memberships.map(async (m) => {
//           const stats = await prisma.warmupInteraction.aggregate({
//             where: {
//               senderAccountId: m.accountId,
//               status: "SENT",
//               sentAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
//             },
//             _count: { id: true },
//             _sum: { opened: true, replied: true },
//           })

//           const sent = stats._count.id || 0
//           const opened = stats._sum.opened || 0
//           const replied = stats._sum.replied || 0

//           const openRate = sent > 0 ? opened / sent : 0
//           const replyRate = sent > 0 ? replied / sent : 0

//           return { openRate, replyRate, engagement: (openRate + replyRate * 2) / 3 }
//         }),
//       )

//       const avgOpenRate = engagementRates.reduce((sum, e) => sum + e.openRate, 0) / engagementRates.length
//       const avgReplyRate = engagementRates.reduce((sum, e) => sum + e.replyRate, 0) / engagementRates.length

//       // Update pool
//       await prisma.warmupPool.update({
//         where: { id: poolId },
//         data: {
//           activeMembers: memberships.length,
//           avgOpenRate: avgOpenRate * 100,
//           avgReplyRate: avgReplyRate * 100,
//         },
//       })

//       logger.info("[PoolManager] Pool stats updated", {
//         poolId,
//         members: memberships.length,
//         avgOpenRate: (avgOpenRate * 100).toFixed(1),
//         avgReplyRate: (avgReplyRate * 100).toFixed(1),
//       })
//     } catch (error) {
//       logger.error("[PoolManager] Failed to update pool stats", { error, poolId })
//     }
//   }

//   /**
//    * Remove inactive members from pools
//    */
//   async cleanupInactiveMembers(daysInactive = 7): Promise<{ removed: number }> {
//     try {
//       const cutoff = new Date(Date.now() - daysInactive * 24 * 60 * 60 * 1000)

//       const inactive = await prisma.poolMembership.findMany({
//         where: {
//           status: "ACTIVE",
//           lastActiveAt: { lt: cutoff },
//         },
//       })

//       for (const membership of inactive) {
//         await prisma.poolMembership.update({
//           where: { id: membership.id },
//           data: { status: "INACTIVE" },
//         })

//         await prisma.warmupPool.update({
//           where: { id: membership.poolId },
//           data: { activeMembers: { decrement: 1 } },
//         })
//       }

//       logger.info("[PoolManager] Inactive members cleaned up", { removed: inactive.length })

//       return { removed: inactive.length }
//     } catch (error) {
//       logger.error("[PoolManager] Cleanup failed", { error })
//       return { removed: 0 }
//     }
//   }

//   /**
//    * Cache operations
//    */
//   private async cachePoolAssignments(accountId: string, poolIds: string[]): Promise<void> {
//     const key = `${this.REDIS_PREFIX}${accountId}`
//     await redis.setex(key, this.CACHE_TTL, JSON.stringify(poolIds))
//   }

//   private async getAccountPools(accountId: string): Promise<string[]> {
//     const key = `${this.REDIS_PREFIX}${accountId}`
//     const cached = await redis.get(key)

//     if (cached) {
//       return JSON.parse(cached)
//     }

//     const memberships = await prisma.poolMembership.findMany({
//       where: { accountId, status: "ACTIVE" },
//       select: { poolId: true },
//     })

//     const poolIds = memberships.map((m) => m.poolId)

//     if (poolIds.length > 0) {
//       await this.cachePoolAssignments(accountId, poolIds)
//     }

//     return poolIds
//   }

//   /**
//    * Get pool information for UI
//    */
//   async getPoolInfo(poolId: string): Promise<any> {
//     return await prisma.warmupPool.findUnique({
//       where: { id: poolId },
//       include: {
//         members: {
//           where: { status: "ACTIVE" },
//           take: 10, // Sample members
//           include: { account: { select: { email: true, status: true } } },
//         },
//       },
//     })
//   }
// }

// export const poolManager = new PoolManager()

import { prisma } from "@/lib/db"
import { redis } from "@/lib/redis"
import { logger } from "@/lib/logger"

/**
 * PRIVATE POOL MANAGER
 * Creates and manages private warmup pools based on reputation, industry, ESP
 * Prevents high-risk accounts from contaminating pristine accounts
 * Optimized for 100,000+ accounts with intelligent pool assignment
 */
class PoolManager {
  private readonly CACHE_TTL = 3600 // 1 hour
  private readonly REDIS_PREFIX = "warmup:pool:"

  /**
   * Initialize default pools
   * Run this once during system setup
   */
  async initializeDefaultPools(): Promise<void> {
    try {
      // Create reputation tier pools
      const reputationPools = [
        { name: "Pristine Pool", tier: "PRISTINE", description: "Perfect reputation accounts only" },
        { name: "High Tier Pool", tier: "HIGH", description: "Good reputation accounts" },
        { name: "Medium Tier Pool", tier: "MEDIUM", description: "Average reputation accounts" },
        { name: "Recovery Pool", tier: "LOW", description: "Accounts recovering reputation" },
      ]

      for (const pool of reputationPools) {
        const existing = await prisma.warmupPool.findFirst({
          where: { name: pool.name },
        })

        if (!existing) {
          await prisma.warmupPool.create({
            data: {
              name: pool.name,
              description: pool.description,
              reputationTier: pool.tier as any,
              isDefault: true,
              maxMembers: 10000,
              minEngagement: 0.5,
            },
          })
        }
      }

      const industries = ["tech", "finance", "healthcare", "marketing", "education"]
      for (const industry of industries) {
        const poolName = `${industry.charAt(0).toUpperCase() + industry.slice(1)} Pool`

        const existing = await prisma.warmupPool.findFirst({
          where: { name: poolName },
        })

        if (!existing) {
          await prisma.warmupPool.create({
            data: {
              name: poolName,
              description: `Industry-specific pool for ${industry}`,
              industry,
              isDefault: false,
              maxMembers: 5000,
              minEngagement: 0.4,
            },
          })
        }
      }

      logger.info("[PoolManager] Default pools initialized")
    } catch (error) {
      const err = error as Error
      logger.error("[PoolManager] Pool initialization failed", { error: err.message })
    }
  }

  /**
   * Assign account to appropriate pools
   * Automatically selects best pools based on profile
   */
  async assignAccountToPools(accountId: string): Promise<{
    success: boolean
    poolIds?: string[]
    error?: string
  }> {
    try {
      const account = await prisma.sendingAccount.findUnique({
        where: { id: accountId },
        include: { reputationProfile: true },
      })

      if (!account || !account.reputationProfile) {
        return { success: false, error: "Account or profile not found" }
      }

      const profile = account.reputationProfile

      // Find matching pools
      const matchingPools = await this.findMatchingPools({
        reputationTier: profile.reputationTier,
        industry: profile.industry,
        espType: profile.espType,
      })

      if (matchingPools.length === 0) {
        return { success: false, error: "No matching pools found" }
      }

      // Create memberships
      const poolIds: string[] = []
      for (const pool of matchingPools) {
        // Check if already a member
        const existing = await prisma.poolMembership.findUnique({
          where: {
            accountId_poolId: {
              accountId,
              poolId: pool.id,
            },
          },
        })

        if (existing) {
          poolIds.push(pool.id)
          continue
        }

        // Check if pool is full
        if (pool.activeMembers >= pool.maxMembers) {
          continue
        }

        // Create membership
        await prisma.poolMembership.create({
          data: {
            accountId,
            poolId: pool.id,
            status: "ACTIVE",
            lastActiveAt: new Date(),
          },
        })

        // Update pool member count
        await prisma.warmupPool.update({
          where: { id: pool.id },
          data: { activeMembers: { increment: 1 } },
        })

        poolIds.push(pool.id)
      }

      // Cache pool assignments
      await this.cachePoolAssignments(accountId, poolIds)

      logger.info("[PoolManager] Account assigned to pools", {
        accountId,
        poolCount: poolIds.length,
      })

      return { success: true, poolIds }
    }  catch (error) {
      const err = error as Error
      logger.error("[PoolManager] Pool assignment failed", { error, accountId })
      return { success: false, error: err.message }
    }
  }

  /**
   * Find matching pools based on criteria
   */
  private async findMatchingPools(criteria: {
    reputationTier: string
    industry?: string | null
    espType?: string | null
  }): Promise<any[]> {
    const pools: any[] = []

    const tierPool = await prisma.warmupPool.findFirst({
      where: {
        reputationTier: criteria.reputationTier as any,
        isDefault: true,
      },
    })
    if (tierPool) pools.push(tierPool)

    if (criteria.industry) {
      const industryPool = await prisma.warmupPool.findFirst({
        where: {
          industry: criteria.industry,
          activeMembers: { lt: 10000 },
        },
      })
      if (industryPool) pools.push(industryPool)
    }

    if (criteria.espType && ["gmail", "outlook"].includes(criteria.espType)) {
      const espPool = await prisma.warmupPool.findFirst({
        where: {
          espType: criteria.espType,
          activeMembers: { lt: 10000 },
        },
      })
      if (espPool) pools.push(espPool)
    }

    return pools
  }

  /**
   * Get peers from account's pools
   * Returns accounts from same pools for warmup interactions
   */
  async getPoolPeers(accountId: string, limit = 50): Promise<string[]> {
    try {
      // Get account's pools (from cache or database)
      const poolIds = await this.getAccountPools(accountId)

      if (poolIds.length === 0) {
        return []
      }

      // Get active members from these pools
      const peers = await prisma.poolMembership.findMany({
        where: {
          poolId: { in: poolIds },
          status: "ACTIVE",
          accountId: { not: accountId }, // Exclude self
        },
        select: { accountId: true },
        take: limit * 2, // Get more than needed for randomization
      })

      // Randomize and limit
      const shuffled = peers
        .map((p) => p.accountId)
        .sort(() => Math.random() - 0.5)
        .slice(0, limit)

      return shuffled
    } catch (error) {
      logger.error("[PoolManager] Failed to get pool peers", { error, accountId })
      return []
    }
  }

  /**
   * Update pool statistics
   * Run periodically to keep pool metrics up to date
   */
  async updatePoolStats(poolId: string): Promise<void> {
    try {
      const memberships = await prisma.poolMembership.findMany({
        where: { poolId, status: "ACTIVE" },
        include: { account: true },
      })

      if (memberships.length === 0) return

      // Calculate engagement rates
      const engagementRates = await Promise.all(
        memberships.map(async (m) => {
          const interactions = await prisma.warmupInteraction.findMany({
            where: {
              sendingAccountId: m.accountId,
              sentAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            },
            select: {
              openedAt: true,
              repliedAt: true,
            },
          })

          const sent = interactions.length
          const opened = interactions.filter((i) => i.openedAt !== null).length
          const replied = interactions.filter((i) => i.repliedAt !== null).length

          const openRate = sent > 0 ? opened / sent : 0
          const replyRate = sent > 0 ? replied / sent : 0

          return { openRate, replyRate, engagement: (openRate + replyRate * 2) / 3 }
        }),
      )

      const avgOpenRate = engagementRates.reduce((sum, e) => sum + e.openRate, 0) / engagementRates.length
      const avgReplyRate = engagementRates.reduce((sum, e) => sum + e.replyRate, 0) / engagementRates.length

      // Update pool
      await prisma.warmupPool.update({
        where: { id: poolId },
        data: {
          activeMembers: memberships.length,
          avgOpenRate: avgOpenRate * 100,
          avgReplyRate: avgReplyRate * 100,
        },
      })

      logger.info("[PoolManager] Pool stats updated", {
        poolId,
        members: memberships.length,
        avgOpenRate: (avgOpenRate * 100).toFixed(1),
        avgReplyRate: (avgReplyRate * 100).toFixed(1),
      })
    } catch (error) {
      logger.error("[PoolManager] Failed to update pool stats", { error, poolId })
    }
  }

  /**
   * Remove inactive members from pools
   */
  async cleanupInactiveMembers(daysInactive = 7): Promise<{ removed: number }> {
    try {
      const cutoff = new Date(Date.now() - daysInactive * 24 * 60 * 60 * 1000)

      const inactive = await prisma.poolMembership.findMany({
        where: {
          status: "ACTIVE",
          lastActiveAt: { lt: cutoff },
        },
      })

      for (const membership of inactive) {
        await prisma.poolMembership.update({
          where: { id: membership.id },
          data: { status: "INACTIVE" },
        })

        await prisma.warmupPool.update({
          where: { id: membership.poolId },
          data: { activeMembers: { decrement: 1 } },
        })
      }

      logger.info("[PoolManager] Inactive members cleaned up", { removed: inactive.length })

      return { removed: inactive.length }
    } catch (error) {
      logger.error("[PoolManager] Cleanup failed", { error })
      return { removed: 0 }
    }
  }

  /**
   * Cache operations
   */
  private async cachePoolAssignments(accountId: string, poolIds: string[]): Promise<void> {
    const key = `${this.REDIS_PREFIX}${accountId}`
    await redis.setex(key, this.CACHE_TTL, JSON.stringify(poolIds))
  }

  private async getAccountPools(accountId: string): Promise<string[]> {
  const key = `${this.REDIS_PREFIX}${accountId}`
  const cached = await redis.get(key)

  if (cached && typeof cached === 'string') {
    return JSON.parse(cached)
  }



    const memberships = await prisma.poolMembership.findMany({
      where: { accountId, status: "ACTIVE" },
      select: { poolId: true },
    })

    const poolIds = memberships.map((m) => m.poolId)

    if (poolIds.length > 0) {
      await this.cachePoolAssignments(accountId, poolIds)
    }

    return poolIds
  }

  /**
   * Get pool information for UI
   */
  async getPoolInfo(poolId: string): Promise<any> {
    return await prisma.warmupPool.findUnique({
      where: { id: poolId },
      include: {
        members: {
          where: { status: "ACTIVE" },
          take: 10, // Sample members
          include: { account: { select: { email: true } } },
        },
      },
    })
  }
}

export const poolManager = new PoolManager()
