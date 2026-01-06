// import { db } from "@/lib/db"

// interface WarmupLimits {
//   canUsePeerWarmup: boolean
//   canAccessPremiumPool: boolean
//   maxWarmupAccounts: number
//   warmupDailyLimit: number
//   poolQuality: "BASIC" | "STANDARD" | "PREMIUM"
// }

// export class WarmupSubscriptionGate {
//   /**
//    * Get warmup limits based on subscription tier
//    */
//   async getWarmupLimits(userId: string): Promise<WarmupLimits> {
//     const user = await db.user.findUnique({
//       where: { id: userId },
//       select: { subscriptionTier: true },
//     })

//     if (!user) {
//       throw new Error("User not found")
//     }

//     return this.getLimitsByTier(user.subscriptionTier)
//   }

//   /**
//    * Check if user can enable P2P warmup
//    */
//   async canEnablePeerWarmup(userId: string): Promise<{
//     allowed: boolean
//     reason?: string
//     upgradeRequired?: string
//   }> {
//     const limits = await this.getWarmupLimits(userId)

//     if (!limits.canUsePeerWarmup) {
//       return {
//         allowed: false,
//         reason: "Peer warmup requires PRO or AGENCY plan",
//         upgradeRequired: "PRO",
//       }
//     }

//     // Check current warmup account count
//     const warmupAccountsCount = await db.sendingAccount.count({
//       where: {
//         userId,
//         warmupEnabled: true,
//       },
//     })

//     if (warmupAccountsCount >= limits.maxWarmupAccounts) {
//       return {
//         allowed: false,
//         reason: `You've reached the maximum of ${limits.maxWarmupAccounts} warmup accounts for your plan`,
//         upgradeRequired: "AGENCY",
//       }
//     }

//     return { allowed: true }
//   }

//   /**
//    * Get warmup limits by subscription tier
//    */
//   private getLimitsByTier(tier: string): WarmupLimits {
//     switch (tier) {
//       case "FREE":
//         return {
//           canUsePeerWarmup: false,
//           canAccessPremiumPool: false,
//           maxWarmupAccounts: 1,
//           warmupDailyLimit: 20,
//           poolQuality: "BASIC",
//         }

//       case "STARTER":
//         return {
//           canUsePeerWarmup: false,
//           canAccessPremiumPool: false,
//           maxWarmupAccounts: 2,
//           warmupDailyLimit: 30,
//           poolQuality: "BASIC",
//         }

//       case "PRO":
//         return {
//           canUsePeerWarmup: true,
//           canAccessPremiumPool: false,
//           maxWarmupAccounts: 5,
//           warmupDailyLimit: 50,
//           poolQuality: "STANDARD",
//         }

//       case "AGENCY":
//         return {
//           canUsePeerWarmup: true,
//           canAccessPremiumPool: true,
//           maxWarmupAccounts: 20,
//           warmupDailyLimit: 150,
//           poolQuality: "PREMIUM",
//         }

//       default:
//         return {
//           canUsePeerWarmup: false,
//           canAccessPremiumPool: false,
//           maxWarmupAccounts: 1,
//           warmupDailyLimit: 20,
//           poolQuality: "BASIC",
//         }
//     }
//   }

//   /**
//    * Validate warmup account creation
//    */
//   async validateWarmupAccountCreation(userId: string): Promise<{
//     allowed: boolean
//     reason?: string
//   }> {
//     const limits = await this.getWarmupLimits(userId)

//     const currentCount = await db.sendingAccount.count({
//       where: {
//         userId,
//         warmupEnabled: true,
//       },
//     })

//     if (currentCount >= limits.maxWarmupAccounts) {
//       return {
//         allowed: false,
//         reason: `Maximum warmup accounts (${limits.maxWarmupAccounts}) reached for your plan. Upgrade to add more.`,
//       }
//     }

//     return { allowed: true }
//   }
// }

// export const warmupSubscriptionGate = new WarmupSubscriptionGate()
import { db } from "@/lib/db"

interface WarmupLimits {
  canUsePeerWarmup: boolean
  canAccessPremiumPool: boolean
  maxWarmupAccounts: number
  warmupDailyLimit: number
  poolQuality: "BASIC" | "STANDARD" | "PREMIUM"
}

export class WarmupSubscriptionGate {
  /**
   * Get warmup limits based on subscription tier
   */
  async getWarmupLimits(userId: string): Promise<WarmupLimits> {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { subscriptionTier: true },
    })

    if (!user) {
      throw new Error("User not found")
    }

    return this.getLimitsByTier(user.subscriptionTier)
  }

  /**
   * Check if user can enable P2P warmup
   */
  async canEnablePeerWarmup(userId: string): Promise<{
    allowed: boolean
    reason?: string
    upgradeRequired?: string
  }> {
    const limits = await this.getWarmupLimits(userId)

    if (!limits.canUsePeerWarmup) {
      return {
        allowed: false,
        reason: "Peer warmup requires PRO or AGENCY plan",
        upgradeRequired: "PRO",
      }
    }

    // Check current warmup account count
    const warmupAccountsCount = await db.sendingAccount.count({
      where: {
        userId,
        warmupEnabled: true,
      },
    })

    if (warmupAccountsCount >= limits.maxWarmupAccounts) {
      return {
        allowed: false,
        reason: `You've reached the maximum of ${limits.maxWarmupAccounts} warmup accounts for your plan`,
        upgradeRequired: "AGENCY",
      }
    }

    return { allowed: true }
  }

  /**
   * Get warmup limits by subscription tier
   */
  private getLimitsByTier(tier: string): WarmupLimits {
    switch (tier) {
      case "FREE":
        return {
          canUsePeerWarmup: false,
          canAccessPremiumPool: false,
          maxWarmupAccounts: 1,
          warmupDailyLimit: 20,
          poolQuality: "BASIC",
        }

      case "STARTER":
        return {
          canUsePeerWarmup: false,
          canAccessPremiumPool: false,
          maxWarmupAccounts: 2,
          warmupDailyLimit: 30,
          poolQuality: "BASIC",
        }

      case "PRO":
        return {
          canUsePeerWarmup: true,
          canAccessPremiumPool: false,
          maxWarmupAccounts: 5,
          warmupDailyLimit: 50,
          poolQuality: "STANDARD",
        }

      case "AGENCY":
        return {
          canUsePeerWarmup: true,
          canAccessPremiumPool: true,
          maxWarmupAccounts: 20,
          warmupDailyLimit: 150,
          poolQuality: "PREMIUM",
        }

      default:
        return {
          canUsePeerWarmup: false,
          canAccessPremiumPool: false,
          maxWarmupAccounts: 1,
          warmupDailyLimit: 20,
          poolQuality: "BASIC",
        }
    }
  }

  /**
   * Validate warmup account creation
   */
  async validateWarmupAccountCreation(userId: string): Promise<{
    allowed: boolean
    reason?: string
  }> {
    const limits = await this.getWarmupLimits(userId)

    const currentCount = await db.sendingAccount.count({
      where: {
        userId,
        warmupEnabled: true,
      },
    })

    if (currentCount >= limits.maxWarmupAccounts) {
      return {
        allowed: false,
        reason: `Maximum warmup accounts (${limits.maxWarmupAccounts}) reached for your plan. Upgrade to add more.`,
      }
    }

    return { allowed: true }
  }

  /**
   * Get tier-specific peer pool for subscription-based matching
   */
  async getTierSpecificPeerPool(userId: string, tier: "FREE" | "STARTER" | "PRO" | "AGENCY"): Promise<string[]> {
    const limits = this.getLimitsByTier(tier)

    if (limits.poolQuality === "PREMIUM") {
      // AGENCY tier: Premium pool (Google Workspace, Office 365 only)
      const premiumAccounts = await db.sendingAccount.findMany({
        where: {
          peerWarmupEnabled: true,
          isActive: true,
          healthScore: { gte: 90 },
          provider: { in: ["GOOGLE_WORKSPACE", "MICROSOFT_365"] },
          userId: { not: userId },
        },
        select: { email: true },
        take: 100,
      })
      return premiumAccounts.map((a) => a.email)
    } else if (limits.poolQuality === "STANDARD") {
      // PRO tier: Standard pool (verified accounts, health >= 80)
      const standardAccounts = await db.sendingAccount.findMany({
        where: {
          peerWarmupEnabled: true,
          isActive: true,
          healthScore: { gte: 80 },
          userId: { not: userId },
        },
        select: { email: true },
        take: 100,
      })
      return standardAccounts.map((a) => a.email)
    }

    // FREE/STARTER: No peer access, return empty array
    return []
  }
}

export const warmupSubscriptionGate = new WarmupSubscriptionGate()
