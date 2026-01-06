// import { db } from "@/lib/db"
// import type { SendingAccount, User } from "@prisma/client"

// interface PeerMatch {
//   email: string
//   accountId: string
//   score: number
//   provider: string
//   industry?: string
//   healthScore: number
// }

// interface MatchingCriteria {
//   industry?: string
//   provider?: string
//   minHealthScore: number
//   excludeAccountIds: string[]
//   limit: number
// }

// export class PeerMatchingEngine {
//   /**
//    * Match sending accounts with high-quality peers based on multiple criteria
//    */
//   async findPeerMatches(sendingAccountId: string, criteria: Partial<MatchingCriteria> = {}): Promise<PeerMatch[]> {
//     const account = await db.sendingAccount.findUnique({
//       where: { id: sendingAccountId },
//       include: { user: true },
//     })

//     if (!account) return []

//     const { minHealthScore = 80, excludeAccountIds = [], limit = 10 } = criteria

//     // Get user's subscription tier to determine pool access
//     const userTier = account.user.subscriptionTier

//     // Build query based on tier
//     const tierFilter = this.getTierFilter(userTier)

//     // Find potential peer accounts
//     const potentialPeers = await db.sendingAccount.findMany({
//       where: {
//         AND: [
//           { userId: { not: account.userId } }, // Different user
//           { id: { notIn: [...excludeAccountIds, sendingAccountId] } }, // Not excluded
//           { peerWarmupEnabled: true },
//           { peerWarmupOptIn: true },
//           { isActive: true },
//           { healthScore: { gte: minHealthScore } },
//           tierFilter, // Tier-based filtering
//         ],
//       },
//       include: {
//         user: true,
//       },
//       take: limit * 3, // Get more for scoring
//     })

//     // Score and rank peers
//     const scoredPeers = potentialPeers.map((peer) => ({
//       email: peer.email,
//       accountId: peer.id,
//       provider: peer.provider,
//       healthScore: peer.healthScore,
//       industry: peer.user.userRole, // Use user role as industry proxy
//       score: this.calculateMatchScore(account, peer),
//     }))

//     // Sort by score and return top matches
//     return scoredPeers.sort((a, b) => b.score - a.score).slice(0, limit) 
//   }

//   /**
//    * Calculate match score between two accounts (0-100)
//    */
//   private calculateMatchScore(account: SendingAccount & { user: User }, peer: SendingAccount & { user: User }): number {
//     let score = 0

//     // Provider diversity (prefer different providers) - 30 points
//     if (account.provider !== peer.provider) {
//       score += 30
//     } else {
//       score += 10 // Same provider is okay, just less optimal
//     }

//     // Health score proximity (±10 points) - 25 points
//     const healthDiff = Math.abs(account.healthScore - peer.healthScore)
//     score += Math.max(0, 25 - healthDiff * 2.5)

//     // Industry match (same or complementary) - 20 points
//     if (account.user.userRole === peer.user.userRole) {
//       score += 20
//     } else if (account.user.userRole && peer.user.userRole) {
//       score += 10 // Different but both have industry set
//     }

//     // Account age (prefer established accounts) - 15 points
//     const peerAgeDays = Math.floor((Date.now() - peer.createdAt.getTime()) / (1000 * 60 * 60 * 24))
//     if (peerAgeDays > 90) score += 15
//     else if (peerAgeDays > 30) score += 10
//     else score += 5

//     // Warmup stage compatibility - 10 points
//     if (account.warmupStage === peer.warmupStage) {
//       score += 10
//     } else {
//       // Close stages are okay
//       const stageOrder = ["NEW", "WARMING", "WARM", "ACTIVE", "ESTABLISHED"]
//       const accountStageIdx = stageOrder.indexOf(account.warmupStage)
//       const peerStageIdx = stageOrder.indexOf(peer.warmupStage)
//       const stageDiff = Math.abs(accountStageIdx - peerStageIdx)
//       score += Math.max(0, 10 - stageDiff * 3)
//     }

//     return Math.min(100, score)
//   }

//   /**
//    * Get tier-based filter for pool access
//    */
//   private getTierFilter(tier: string) {
//     switch (tier) {
//       case "AGENCY":
//         // Premium pool: Only Google Workspace and Office 365 accounts
//         return {
//           OR: [
//             { provider: { contains: "google" } },
//             { provider: { contains: "gmail" } },
//             { provider: { contains: "outlook" } },
//             { provider: { contains: "office365" } },
//             { provider: { contains: "microsoft" } },
//           ],
//         }

//       case "PRO":
//         // Standard pool: All verified accounts with good health
//         return {
//           healthScore: { gte: 85 },
//         }

//       case "STARTER":
//       case "FREE":
//       default:
//         // Basic pool: All active peer accounts
//         return {
//           healthScore: { gte: 80 },
//         }
//     }
//   }

//   /**
//    * Track peer interaction to avoid over-using same peer
//    */
//   async recordPeerInteraction(sendingAccountId: string, peerEmail: string): Promise<void> {
//     // This could be expanded to track frequency and implement cooldown
//     await db.warmupSession.updateMany({
//       where: {
//         sendingAccountId,
//         peerAccountEmail: peerEmail,
//         warmupType: "PEER",
//       },
//       data: {
//         lastSentAt: new Date(),
//       },
//     })
//   }

//   /**
//    * Get peer accounts that haven't been used recently
//    */
//   async getAvailablePeers(sendingAccountId: string, limit = 10): Promise<string[]> {
//     const cooldownHours = 24 // Don't send to same peer within 24 hours

//     const recentSessions = await db.warmupSession.findMany({
//       where: {
//         sendingAccountId,
//         warmupType: "PEER",
//         lastSentAt: {
//           gte: new Date(Date.now() - cooldownHours * 60 * 60 * 1000),
//         },
//       },
//       select: { peerAccountEmail: true },
//     })

//     const recentPeerEmails = recentSessions
//       .map((s) => s.peerAccountEmail)
//       .filter((email): email is string => email !== null)

//     // Find peers using matching engine, excluding recent ones
//     const matches = await this.findPeerMatches(sendingAccountId, {
//       excludeAccountIds: [], // Could pass recent peer IDs if we had them
//       limit: limit + recentPeerEmails.length,
//     })

//     return matches
//       .filter((match) => !recentPeerEmails.includes(match.email))
//       .map((match) => match.email)
//       .slice(0, limit)
//   }
// }

// export const peerMatchingEngine = new PeerMatchingEngine()
import { db } from "@/lib/db"
import type { SendingAccount, User } from "@prisma/client"

interface PeerMatch {
  email: string
  accountId: string
  score: number
  provider: string
  industry: string | null
  healthScore: number
}

interface MatchingCriteria {
  industry?: string
  provider?: string
  minHealthScore: number
  excludeAccountIds: string[]
  limit: number
}

export class PeerMatchingEngine {
  /**
   * Match sending accounts with high-quality peers based on multiple criteria
   */
  async findPeerMatches(sendingAccountId: string, criteria: Partial<MatchingCriteria> = {}): Promise<PeerMatch[]> {
    const account = await db.sendingAccount.findUnique({
      where: { id: sendingAccountId },
      include: { user: true },
    })

    if (!account) return []

    const { minHealthScore = 80, excludeAccountIds = [], limit = 10 } = criteria

    // Get user's subscription tier to determine pool access
    const userTier = account.user.subscriptionTier

    // Build query based on tier
    const tierFilter = this.getTierFilter(userTier)

    // Find potential peer accounts
    const potentialPeers = await db.sendingAccount.findMany({
      where: {
        AND: [
          { userId: { not: account.userId } }, // Different user
          { id: { notIn: [...excludeAccountIds, sendingAccountId] } }, // Not excluded
          { peerWarmupEnabled: true },
          { peerWarmupOptIn: true },
          { isActive: true },
          { healthScore: { gte: minHealthScore } },
          tierFilter, // Tier-based filtering
        ],
      },
      include: {
        user: true,
      },
      take: limit * 3, // Get more for scoring
    })

    // Score and rank peers
    const scoredPeers = potentialPeers.map((peer) => ({
      email: peer.email,
      accountId: peer.id,
      provider: peer.provider,
      healthScore: peer.healthScore,
      industry: peer.user.userRole || null,
      score: this.calculateMatchScore(account, peer),
    }))

    // Sort by score and return top matches
    return scoredPeers.sort((a, b) => b.score - a.score).slice(0, limit)
  }

  /**
   * Calculate match score between two accounts (0-100)
   */
  private calculateMatchScore(account: SendingAccount & { user: User }, peer: SendingAccount & { user: User }): number {
    let score = 0

    // Provider diversity (prefer different providers) - 30 points
    if (account.provider !== peer.provider) {
      score += 30
    } else {
      score += 10 // Same provider is okay, just less optimal
    }

    // Health score proximity (±10 points) - 25 points
    const healthDiff = Math.abs(account.healthScore - peer.healthScore)
    score += Math.max(0, 25 - healthDiff * 2.5)

    // Industry match (same or complementary) - 20 points
    if (account.user.userRole === peer.user.userRole) {
      score += 20
    } else if (account.user.userRole && peer.user.userRole) {
      score += 10 // Different but both have industry set
    }

    // Account age (prefer established accounts) - 15 points
    const peerAgeDays = Math.floor((Date.now() - peer.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    if (peerAgeDays > 90) score += 15
    else if (peerAgeDays > 30) score += 10
    else score += 5

    // Warmup stage compatibility - 10 points
    if (account.warmupStage === peer.warmupStage) {
      score += 10
    } else {
      // Close stages are okay
      const stageOrder = ["NEW", "WARMING", "WARM", "ACTIVE", "ESTABLISHED"]
      const accountStageIdx = stageOrder.indexOf(account.warmupStage)
      const peerStageIdx = stageOrder.indexOf(peer.warmupStage)
      const stageDiff = Math.abs(accountStageIdx - peerStageIdx)
      score += Math.max(0, 10 - stageDiff * 3)
    }

    return Math.min(100, score)
  }

  /**
   * Get tier-based filter for pool access
   */
  private getTierFilter(tier: string) {
    switch (tier) {
      case "AGENCY":
        // Premium pool: Only Google Workspace and Office 365 accounts
        return {
          OR: [
            { provider: { contains: "google" } },
            { provider: { contains: "gmail" } },
            { provider: { contains: "outlook" } },
            { provider: { contains: "office365" } },
            { provider: { contains: "microsoft" } },
          ],
        }

      case "PRO":
        // Standard pool: All verified accounts with good health
        return {
          healthScore: { gte: 85 },
        }

      case "STARTER":
      case "FREE":
      default:
        // Basic pool: All active peer accounts
        return {
          healthScore: { gte: 80 },
        }
    }
  }

  /**
   * Track peer interaction to avoid over-using same peer
   */
  async recordPeerInteraction(sendingAccountId: string, peerEmail: string): Promise<void> {
    // This could be expanded to track frequency and implement cooldown
    await db.warmupSession.updateMany({
      where: {
        sendingAccountId,
        peerAccountEmail: peerEmail,
        warmupType: "PEER",
      },
      data: {
        lastSentAt: new Date(),
      },
    })
  }

  /**
   * Get peer accounts that haven't been used recently
   */
  async getAvailablePeers(sendingAccountId: string, limit = 10): Promise<string[]> {
    const cooldownHours = 24 // Don't send to same peer within 24 hours

    const recentSessions = await db.warmupSession.findMany({
      where: {
        sendingAccountId,
        warmupType: "PEER",
        lastSentAt: {
          gte: new Date(Date.now() - cooldownHours * 60 * 60 * 1000),
        },
      },
      select: { peerAccountEmail: true },
    })

    const recentPeerEmails = recentSessions
      .map((s) => s.peerAccountEmail)
      .filter((email): email is string => email !== null)

    // Find peers using matching engine, excluding recent ones
    const matches = await this.findPeerMatches(sendingAccountId, {
      excludeAccountIds: [], // Could pass recent peer IDs if we had them
      limit: limit + recentPeerEmails.length,
    })

    return matches
      .filter((match) => !recentPeerEmails.includes(match.email))
      .map((match) => match.email)
      .slice(0, limit)
  }

  /**
   * Find matches for a sending account (used by warmup email manager)
   */
  async findMatchesForAccount(
    account: any,
    limit: number,
    tierPool: string[],
  ): Promise<Array<{ email: string; accountId: string }>> {
    const matches = await this.findPeerMatches(account.id, { limit })

    // Filter by tier pool if provided
    if (tierPool.length > 0) {
      return matches.filter((match) => tierPool.includes(match.email))
    }

    return matches.map((m) => ({ email: m.email, accountId: m.accountId }))
  }
}

export const peerMatchingEngine = new PeerMatchingEngine()
