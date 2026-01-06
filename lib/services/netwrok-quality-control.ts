// import { db } from "@/lib/db"

// interface AccountQualityScore {
//   accountId: string
//   email: string
//   qualityScore: number
//   issues: string[]
//   recommendation: "ACCEPT" | "DOWNGRADE" | "REMOVE"
// }

// export class NetworkQualityControl {
//   /**
//    * Evaluate account quality for P2P network participation
//    */
//   async evaluateAccountQuality(accountId: string): Promise<AccountQualityScore> {
//     const account = await db.sendingAccount.findUnique({
//       where: { id: accountId },
//       include: {
//         domain: true,
//         user: true,
//       },
//     })

//     if (!account) {
//       throw new Error("Account not found")
//     }

//     let qualityScore = 100
//     const issues: string[] = []

//     // Check 1: DNS Records (SPF, DKIM, DMARC) - Critical
//     if (!account.domain || !account.domain.isVerified) {
//       qualityScore -= 30
//       issues.push("DNS records not verified")
//     }

//     // Check 2: Health Score
//     if (account.healthScore < 70) {
//       qualityScore -= 20
//       issues.push(`Low health score: ${account.healthScore}`)
//     } else if (account.healthScore < 85) {
//       qualityScore -= 10
//       issues.push("Health score below optimal")
//     }

//     // Check 3: Bounce Rate
//     if (account.bounceRate > 5) {
//       qualityScore -= 15
//       issues.push(`High bounce rate: ${account.bounceRate.toFixed(2)}%`)
//     } else if (account.bounceRate > 2) {
//       qualityScore -= 5
//       issues.push("Elevated bounce rate")
//     }

//     // Check 4: Spam Complaint Rate
//     if (account.spamComplaintRate > 0.5) {
//       qualityScore -= 15
//       issues.push(`High spam complaints: ${account.spamComplaintRate.toFixed(2)}%`)
//     }

//     // Check 5: Blacklist Status
//     if (account.blacklistStatus) {
//       const status = account.blacklistStatus as any
//       if (status.isBlacklisted) {
//         qualityScore -= 40
//         issues.push("Domain/IP blacklisted")
//       }
//     }

//     // Check 6: Provider Quality (prefer Google Workspace / Office 365)
//     const provider = account.provider.toLowerCase()
//     if (provider.includes("google") || provider.includes("office365") || provider.includes("outlook")) {
//       qualityScore += 10 // Bonus for premium providers
//     } else if (provider.includes("resend") || provider === "smtp") {
//       qualityScore -= 5 // Slight penalty for generic SMTP
//     }

//     // Check 7: Account Age (prefer established accounts)
//     const accountAgeDays = Math.floor((Date.now() - account.createdAt.getTime()) / (1000 * 60 * 60 * 24))
//     if (accountAgeDays < 7) {
//       qualityScore -= 10
//       issues.push("Account too new")
//     }

//     // Determine recommendation
//     let recommendation: "ACCEPT" | "DOWNGRADE" | "REMOVE"
//     if (qualityScore >= 80) {
//       recommendation = "ACCEPT"
//     } else if (qualityScore >= 60) {
//       recommendation = "DOWNGRADE"
//     } else {
//       recommendation = "REMOVE"
//     }

//     return {
//       accountId: account.id,
//       email: account.email,
//       qualityScore: Math.max(0, qualityScore),
//       issues,
//       recommendation,
//     }
//   }

//   /**
//    * Automatically enforce quality standards across network
//    */
//   async enforceQualityStandards(): Promise<{
//     evaluated: number
//     downgraded: number
//     removed: number
//   }> {
//     const accounts = await db.sendingAccount.findMany({
//       where: {
//         peerWarmupEnabled: true,
//         isActive: true,
//       },
//     })

//     let downgraded = 0
//     let removed = 0

//     for (const account of accounts) {
//       const evaluation = await this.evaluateAccountQuality(account.id)

//       if (evaluation.recommendation === "REMOVE") {
//         // Disable peer warmup for this account
//         await db.sendingAccount.update({
//           where: { id: account.id },
//           data: {
//             peerWarmupEnabled: false,
//             pausedReason: `Removed from peer network: ${evaluation.issues.join(", ")}`,
//             pausedAt: new Date(),
//           },
//         })
//         removed++
//       } else if (evaluation.recommendation === "DOWNGRADE") {
//         // Could implement tier downgrading here
//         // For now, just log
//         console.log(
//           `[NetworkQualityControl] Account ${account.email} downgraded. Issues: ${evaluation.issues.join(", ")}`,
//         )
//         downgraded++
//       }
//     }

//     return {
//       evaluated: accounts.length,
//       downgraded,
//       removed,
//     }
//   }

//   /**
//    * Get network health overview
//    */
//   async getNetworkHealth(): Promise<{
//     totalParticipants: number
//     premiumAccounts: number
//     standardAccounts: number
//     basicAccounts: number
//     avgQualityScore: number
//     avgHealthScore: number
//   }> {
//     const participants = await db.sendingAccount.findMany({
//       where: {
//         peerWarmupEnabled: true,
//         isActive: true,
//       },
//       include: {
//         user: true,
//       },
//     })

//     const premiumAccounts = participants.filter((acc) => acc.user.subscriptionTier === "AGENCY").length

//     const standardAccounts = participants.filter((acc) => acc.user.subscriptionTier === "PRO").length

//     const basicAccounts = participants.length - premiumAccounts - standardAccounts

//     const avgHealthScore =
//       participants.length > 0 ? participants.reduce((sum, acc) => sum + acc.healthScore, 0) / participants.length : 0

//     return {
//       totalParticipants: participants.length,
//       premiumAccounts,
//       standardAccounts,
//       basicAccounts,
//       avgQualityScore: avgHealthScore, // Simplified for now
//       avgHealthScore,
//     }
//   }
// }

// export const networkQualityControl = new NetworkQualityControl()
// import { db } from "@/lib/db"

// interface AccountQualityScore {
//   accountId: string
//   email: string
//   qualityScore: number
//   issues: string[]
//   recommendation: "ACCEPT" | "DOWNGRADE" | "REMOVE"
// }

// interface QualityEnforcementResult {
//   evaluated: number
//   downgraded: number
//   removed: number
//   actions: Array<{
//     accountId: string
//     action: "downgrade" | "remove" | "accept"
//     reason: string
//   }>
// }

// export class NetworkQualityControl {
//   /**
//    * Evaluate account quality for P2P network participation
//    */
//   async evaluateAccountQuality(accountId: string): Promise<AccountQualityScore> {
//     const account = await db.sendingAccount.findUnique({
//       where: { id: accountId },
//       include: {
//         domain: true,
//         user: true,
//       },
//     })

//     if (!account) {
//       throw new Error("Account not found")
//     }

//     let qualityScore = 100
//     const issues: string[] = []

//     // Check 1: DNS Records (SPF, DKIM, DMARC) - Critical
//     if (!account.domain || !account.domain.isVerified) {
//       qualityScore -= 30
//       issues.push("DNS records not verified")
//     }

//     // Check 2: Health Score
//     if (account.healthScore < 70) {
//       qualityScore -= 20
//       issues.push(`Low health score: ${account.healthScore}`)
//     } else if (account.healthScore < 85) {
//       qualityScore -= 10
//       issues.push("Health score below optimal")
//     }

//     // Check 3: Bounce Rate
//     if (account.bounceRate > 5) {
//       qualityScore -= 15
//       issues.push(`High bounce rate: ${account.bounceRate.toFixed(2)}%`)
//     } else if (account.bounceRate > 2) {
//       qualityScore -= 5
//       issues.push("Elevated bounce rate")
//     }

//     // Check 4: Spam Complaint Rate
//     if (account.spamComplaintRate > 0.5) {
//       qualityScore -= 15
//       issues.push(`High spam complaints: ${account.spamComplaintRate.toFixed(2)}%`)
//     }

//     // Check 5: Blacklist Status
//     if (account.blacklistStatus) {
//       const status = account.blacklistStatus as any
//       if (status.isBlacklisted) {
//         qualityScore -= 40
//         issues.push("Domain/IP blacklisted")
//       }
//     }

//     // Check 6: Provider Quality (prefer Google Workspace / Office 365)
//     const provider = account.provider.toLowerCase()
//     if (provider.includes("google") || provider.includes("office365") || provider.includes("outlook")) {
//       qualityScore += 10 // Bonus for premium providers
//     } else if (provider.includes("resend") || provider === "smtp") {
//       qualityScore -= 5 // Slight penalty for generic SMTP
//     }

//     // Check 7: Account Age (prefer established accounts)
//     const accountAgeDays = Math.floor((Date.now() - account.createdAt.getTime()) / (1000 * 60 * 60 * 24))
//     if (accountAgeDays < 7) {
//       qualityScore -= 10
//       issues.push("Account too new")
//     }

//     // Determine recommendation
//     let recommendation: "ACCEPT" | "DOWNGRADE" | "REMOVE"
//     if (qualityScore >= 80) {
//       recommendation = "ACCEPT"
//     } else if (qualityScore >= 60) {
//       recommendation = "DOWNGRADE"
//     } else {
//       recommendation = "REMOVE"
//     }

//     return {
//       accountId: account.id,
//       email: account.email,
//       qualityScore: Math.max(0, qualityScore),
//       issues,
//       recommendation,
//     }
//   }

//   /**
//    * Automatically enforce quality standards across network
//    */
//   async enforceQualityStandards(accountId?: string): Promise<QualityEnforcementResult> {
//     const accounts = accountId
//       ? await db.sendingAccount.findMany({
//           where: {
//             id: accountId,
//             peerWarmupEnabled: true,
//             isActive: true,
//           },
//         })
//       : await db.sendingAccount.findMany({
//           where: {
//             peerWarmupEnabled: true,
//             isActive: true,
//           },
//         })

//     let downgraded = 0
//     let removed = 0
//     const actions: Array<{ accountId: string; action: "downgrade" | "remove" | "accept"; reason: string }> = []

//     for (const account of accounts) {
//       const evaluation = await this.evaluateAccountQuality(account.id)

//       if (evaluation.recommendation === "REMOVE") {
//         // Disable peer warmup for this account
//         await db.sendingAccount.update({
//           where: { id: account.id },
//           data: {
//             peerWarmupEnabled: false,
//             pausedReason: `Removed from peer network: ${evaluation.issues.join(", ")}`,
//             pausedAt: new Date(),
//           },
//         })
//         removed++
//         actions.push({
//           accountId: account.id,
//           action: "remove",
//           reason: evaluation.issues.join(", "),
//         })
//       } else if (evaluation.recommendation === "DOWNGRADE") {
//         downgraded++
//         actions.push({
//           accountId: account.id,
//           action: "downgrade",
//           reason: evaluation.issues.join(", "),
//         })
//       } else {
//         actions.push({
//           accountId: account.id,
//           action: "accept",
//           reason: "Quality standards met",
//         })
//       }
//     }

//     return {
//       evaluated: accounts.length,
//       downgraded,
//       removed,
//       actions,
//     }
//   }

//   /**
//    * Get network health overview
//    */
//   async getNetworkHealth(): Promise<{
//     totalParticipants: number
//     premiumAccounts: number
//     standardAccounts: number
//     basicAccounts: number
//     avgQualityScore: number
//     avgHealthScore: number
//   }> {
//     const participants = await db.sendingAccount.findMany({
//       where: {
//         peerWarmupEnabled: true,
//         isActive: true,
//       },
//       include: {
//         user: true,
//       },
//     })

//     const premiumAccounts = participants.filter((acc) => acc.user.subscriptionTier === "AGENCY").length

//     const standardAccounts = participants.filter((acc) => acc.user.subscriptionTier === "PRO").length

//     const basicAccounts = participants.length - premiumAccounts - standardAccounts

//     const avgHealthScore =
//       participants.length > 0 ? participants.reduce((sum, acc) => sum + acc.healthScore, 0) / participants.length : 0

//     return {
//       totalParticipants: participants.length,
//       premiumAccounts,
//       standardAccounts,
//       basicAccounts,
//       avgQualityScore: avgHealthScore, // Simplified for now
//       avgHealthScore,
//     }
//   }
// }

// export const networkQualityControl = new NetworkQualityControl()

import { db } from "@/lib/db"

interface AccountQualityScore {
  accountId: string
  email: string
  qualityScore: number
  issues: string[]
  recommendation: "ACCEPT" | "DOWNGRADE" | "REMOVE"
}

interface QualityEnforcementResult {
  evaluated: number
  downgraded: number
  removed: number
  actions: Array<{
    accountId: string
    action: "downgrade" | "remove" | "accept"
    reason: string
  }>
}

export class NetworkQualityControl {
  /**
   * Evaluate account quality for P2P network participation
   */
  async evaluateAccountQuality(accountId: string): Promise<AccountQualityScore> {
    const account = await db.sendingAccount.findUnique({
      where: { id: accountId },
      include: {
        domain: true,
        user: true,
      },
    })

    if (!account) {
      throw new Error("Account not found")
    }

    let qualityScore = 100
    const issues: string[] = []

    // Check 1: DNS Records (SPF, DKIM, DMARC) - Critical
    if (!account.domain || !account.domain.isVerified) {
      qualityScore -= 30
      issues.push("DNS records not verified")
    }

    // Check 2: Health Score
    if (account.healthScore < 70) {
      qualityScore -= 20
      issues.push(`Low health score: ${account.healthScore}`)
    } else if (account.healthScore < 85) {
      qualityScore -= 10
      issues.push("Health score below optimal")
    }

    // Check 3: Bounce Rate
    if (account.bounceRate > 5) {
      qualityScore -= 15
      issues.push(`High bounce rate: ${account.bounceRate.toFixed(2)}%`)
    } else if (account.bounceRate > 2) {
      qualityScore -= 5
      issues.push("Elevated bounce rate")
    }

    // Check 4: Spam Complaint Rate
    if (account.spamComplaintRate > 0.5) {
      qualityScore -= 15
      issues.push(`High spam complaints: ${account.spamComplaintRate.toFixed(2)}%`)
    }

    // Check 5: Blacklist Status
    if (account.blacklistStatus) {
      const status = account.blacklistStatus as any
      if (status.isBlacklisted) {
        qualityScore -= 40
        issues.push("Domain/IP blacklisted")
      }
    }

    // Check 6: Provider Quality (prefer Google Workspace / Office 365)
    const provider = account.provider.toLowerCase()
    if (provider.includes("google") || provider.includes("office365") || provider.includes("outlook")) {
      qualityScore += 10 // Bonus for premium providers
    } else if (provider.includes("resend") || provider === "smtp") {
      qualityScore -= 5 // Slight penalty for generic SMTP
    }

    // Check 7: Account Age (prefer established accounts)
    const accountAgeDays = Math.floor((Date.now() - account.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    if (accountAgeDays < 7) {
      qualityScore -= 10
      issues.push("Account too new")
    }

    // Determine recommendation
    let recommendation: "ACCEPT" | "DOWNGRADE" | "REMOVE"
    if (qualityScore >= 80) {
      recommendation = "ACCEPT"
    } else if (qualityScore >= 60) {
      recommendation = "DOWNGRADE"
    } else {
      recommendation = "REMOVE"
    }

    return {
      accountId: account.id,
      email: account.email,
      qualityScore: Math.max(0, qualityScore),
      issues,
      recommendation,
    }
  }

  /**
   * Automatically enforce quality standards across network
   */
  async enforceQualityStandards(accountId?: string): Promise<QualityEnforcementResult> {
    const accounts = accountId
      ? await db.sendingAccount.findMany({
          where: {
            id: accountId,
            peerWarmupEnabled: true,
            isActive: true,
          },
        })
      : await db.sendingAccount.findMany({
          where: {
            peerWarmupEnabled: true,
            isActive: true,
          },
        })

    let downgraded = 0
    let removed = 0
    const actions: Array<{ accountId: string; action: "downgrade" | "remove" | "accept"; reason: string }> = []

    for (const account of accounts) {
      const evaluation = await this.evaluateAccountQuality(account.id)

      if (evaluation.recommendation === "REMOVE") {
        // Disable peer warmup for this account
        await db.sendingAccount.update({
          where: { id: account.id },
          data: {
            peerWarmupEnabled: false,
            pausedReason: `Removed from peer network: ${evaluation.issues.join(", ")}`,
            pausedAt: new Date(),
          },
        })
        removed++
        actions.push({
          accountId: account.id,
          action: "remove",
          reason: evaluation.issues.join(", "),
        })
      } else if (evaluation.recommendation === "DOWNGRADE") {
        downgraded++
        actions.push({
          accountId: account.id,
          action: "downgrade",
          reason: evaluation.issues.join(", "),
        })
      } else {
        actions.push({
          accountId: account.id,
          action: "accept",
          reason: "Quality standards met",
        })
      }
    }

    return {
      evaluated: accounts.length,
      downgraded,
      removed,
      actions,
    }
  }

  /**
   * Get network health overview
   */
  async getNetworkHealth(): Promise<{
    totalParticipants: number
    premiumAccounts: number
    standardAccounts: number
    basicAccounts: number
    avgQualityScore: number
    avgHealthScore: number
  }> {
    const participants = await db.sendingAccount.findMany({
      where: {
        peerWarmupEnabled: true,
        isActive: true,
      },
      include: {
        user: true,
      },
    })

    const premiumAccounts = participants.filter((acc) => acc.user.subscriptionTier === "AGENCY").length

    const standardAccounts = participants.filter((acc) => acc.user.subscriptionTier === "PRO").length

    const basicAccounts = participants.length - premiumAccounts - standardAccounts

    const avgHealthScore =
      participants.length > 0 ? participants.reduce((sum, acc) => sum + acc.healthScore, 0) / participants.length : 0

    return {
      totalParticipants: participants.length,
      premiumAccounts,
      standardAccounts,
      basicAccounts,
      avgQualityScore: avgHealthScore, // Simplified for now
      avgHealthScore,
    }
  }

  /**
   * Calculate composite health score from all metrics
   */
  async calculateCompositeHealthScore(accountId: string): Promise<number> {
    const session = await db.warmupSession.findFirst({
      where: {
        sendingAccountId: accountId,
        status: "ACTIVE",
      },
      orderBy: { startedAt: "desc" },
    })

    if (!session) {
      return 0
    }

    const account = await db.sendingAccount.findUnique({
      where: { id: accountId },
    })

    if (!account) {
      return 0
    }

    // Calculate weighted composite score
    const inboxScore = session.inboxPlacementRate || 0 // 40% weight
    const openScore = (session.emailsOpened / Math.max(session.emailsSent, 1)) * 100 || 0 // 20% weight
    const replyScore = (session.emailsReplied / Math.max(session.emailsSent, 1)) * 100 * 2 || 0 // 20% weight (2x multiplier)
    const spamPenalty = (account.spamComplaintRate || 0) * 3 // 15% weight (penalty)
    const bouncePenalty = (account.bounceRate || 0) * 2 // 5% weight (penalty)

    const compositeScore =
      inboxScore * 0.4 + openScore * 0.2 + replyScore * 0.2 - spamPenalty * 0.15 - bouncePenalty * 0.05

    return Math.max(0, Math.min(100, Math.round(compositeScore)))
  }
}

export const networkQualityControl = new NetworkQualityControl()
