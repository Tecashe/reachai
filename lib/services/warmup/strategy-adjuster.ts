// import { prisma } from "@/lib/db"
// import { logger } from "@/lib/logger"
// import { inboxPlacementMonitor } from "./inbox-placement-monitor"

// /**
//  * DYNAMIC STRATEGY ADJUSTER
//  * Automatically adjusts warmup strategy based on deliverability signals
//  * Handles emergency situations (spam folder, high bounces)
//  * Scales to 100,000+ accounts with intelligent decisioning
//  */
// class StrategyAdjuster {
//   /**
//    * Analyze account and adjust strategy if needed
//    */
//   async analyzeAndAdjust(accountId: string): Promise<{
//     adjusted: boolean
//     reason?: string
//     adjustmentId?: string
//     previousLimit?: number
//     newLimit?: number
//   }> {
//     try {
//       const account = await prisma.sendingAccount.findUnique({
//         where: { id: accountId },
//         include: { reputationProfile: true },
//       })

//       if (!account || !account.reputationProfile) {
//         return { adjusted: false }
//       }

//       // Get recent performance metrics
//       const [placementStats, interactionStats] = await Promise.all([
//         inboxPlacementMonitor.getPlacementStats(accountId, 3), // Last 3 days
//         this.getInteractionStats(accountId, 7), // Last 7 days
//       ])

//       // Determine if adjustment needed
//       const analysis = this.analyzePerformance({
//         account,
//         placementStats,
//         interactionStats,
//       })

//       if (!analysis.needsAdjustment) {
//         return { adjusted: false }
//       }

//       // Calculate new strategy
//       const newStrategy = this.calculateNewStrategy({
//         account,
//         analysis,
//         placementStats,
//         interactionStats,
//       })

//       // Create adjustment record
//       const adjustment = await prisma.strategyAdjustment.create({
//         data: {
//           accountId,
//           trigger: analysis.trigger,
//           severity: analysis.severity,
//           previousDailyLimit: account.dailyLimit,
//           newDailyLimit: newStrategy.dailyLimit,
//           previousStrategy: {
//             warmupStage: account.reputationProfile.currentWarmupStage,
//             dailyLimit: account.dailyLimit,
//           },
//           newStrategy: newStrategy,
//           autoRevertAt:
//             analysis.severity === "EMERGENCY"
//               ? null // Manual review required
//               : new Date(Date.now() + newStrategy.revertAfterDays * 24 * 60 * 60 * 1000),
//           isActive: true,
//         },
//       })

//       // Apply new strategy
//       await this.applyStrategy(accountId, newStrategy)

//       logger.info("[StrategyAdjuster] Strategy adjusted", {
//         accountId,
//         trigger: analysis.trigger,
//         severity: analysis.severity,
//         oldLimit: account.dailyLimit,
//         newLimit: newStrategy.dailyLimit,
//       })

//       return {
//         adjusted: true,
//         reason: analysis.trigger,
//         adjustmentId: adjustment.id,
//         previousLimit: account.dailyLimit,
//         newLimit: newStrategy.dailyLimit,
//       }
//     } catch (error) {
//       logger.error("[StrategyAdjuster] Analysis failed", { error, accountId })
//       return { adjusted: false }
//     }
//   }

//   /**
//    * Analyze performance and determine if adjustment needed
//    */
//   private analyzePerformance(data: {
//     account: any
//     placementStats: any
//     interactionStats: any
//   }): {
//     needsAdjustment: boolean
//     trigger?: string
//     severity?: "MINOR" | "MODERATE" | "MAJOR" | "EMERGENCY"
//     reason?: string
//   } {
//     const { account, placementStats, interactionStats } = data

//     // EMERGENCY: Spam folder detection
//     if (placementStats.spamRate > 50) {
//       return {
//         needsAdjustment: true,
//         trigger: "spam_detected",
//         severity: "EMERGENCY",
//         reason: `Critical: ${placementStats.spamRate.toFixed(1)}% emails in spam`,
//       }
//     }

//     // MAJOR: High spam rate
//     if (placementStats.spamRate > 20) {
//       return {
//         needsAdjustment: true,
//         trigger: "high_spam_rate",
//         severity: "MAJOR",
//         reason: `${placementStats.spamRate.toFixed(1)}% emails in spam folder`,
//       }
//     }

//     // MAJOR: Bounce spike
//     if (interactionStats.bounceRate > 10) {
//       return {
//         needsAdjustment: true,
//         trigger: "bounce_spike",
//         severity: "MAJOR",
//         reason: `High bounce rate: ${interactionStats.bounceRate.toFixed(1)}%`,
//       }
//     }

//     // MODERATE: Low primary inbox rate
//     if (placementStats.primaryRate < 30 && placementStats.totalChecked > 10) {
//       return {
//         needsAdjustment: true,
//         trigger: "low_inbox_rate",
//         severity: "MODERATE",
//         reason: `Low primary inbox rate: ${placementStats.primaryRate.toFixed(1)}%`,
//       }
//     }

//     // MODERATE: Low engagement
//     if (interactionStats.openRate < 15 && interactionStats.totalSent > 50) {
//       return {
//         needsAdjustment: true,
//         trigger: "low_engagement",
//         severity: "MODERATE",
//         reason: `Low open rate: ${interactionStats.openRate.toFixed(1)}%`,
//       }
//     }

//     // MINOR: Gradual decline
//     if (interactionStats.recentOpenRate < interactionStats.historicOpenRate * 0.7) {
//       return {
//         needsAdjustment: true,
//         trigger: "engagement_decline",
//         severity: "MINOR",
//         reason: "Engagement declining over time",
//       }
//     }

//     return { needsAdjustment: false }
//   }

//   /**
//    * Calculate new strategy based on analysis
//    */
//   private calculateNewStrategy(data: {
//     account: any
//     analysis: any
//     placementStats: any
//     interactionStats: any
//   }): any {
//     const { account, analysis, placementStats, interactionStats } = data
//     const currentLimit = account.dailyLimit

//     let newLimit = currentLimit
//     let pauseDuration = 0 // days
//     let revertAfterDays = 7

//     switch (analysis.severity) {
//       case "EMERGENCY":
//         // Halt immediately
//         newLimit = 0
//         pauseDuration = 3
//         revertAfterDays = 0 // Manual review required
//         break

//       case "MAJOR":
//         // Reduce to 25% of current
//         newLimit = Math.max(5, Math.floor(currentLimit * 0.25))
//         revertAfterDays = 14
//         break

//       case "MODERATE":
//         // Reduce to 50% of current
//         newLimit = Math.max(10, Math.floor(currentLimit * 0.5))
//         revertAfterDays = 10
//         break

//       case "MINOR":
//         // Reduce to 75% of current
//         newLimit = Math.max(15, Math.floor(currentLimit * 0.75))
//         revertAfterDays = 7
//         break
//     }

//     return {
//       dailyLimit: newLimit,
//       pauseDuration,
//       revertAfterDays,
//       reason: analysis.reason,
//       adjustments: {
//         increaseReplyRate: true,
//         focusOnEngagedPeers: true,
//         improveContentQuality: true,
//         monitorPlacementDaily: true,
//       },
//     }
//   }

//   /**
//    * Apply new strategy to account
//    */
//   private async applyStrategy(accountId: string, strategy: any): Promise<void> {
//     // Update account
//     await prisma.sendingAccount.update({
//       where: { id: accountId },
//       data: {
//         dailyLimit: strategy.dailyLimit,
//         status: strategy.dailyLimit === 0 ? "PAUSED" : "ACTIVE",
//       },
//     })

//     // Update reputation profile
//     await prisma.reputationProfile.update({
//       where: { accountId },
//       data: {
//         recommendedDailyLimit: strategy.dailyLimit,
//         currentWarmupStage: strategy.dailyLimit < 10 ? "initial" : "building",
//       },
//     })

//     // If paused, cancel pending interactions
//     if (strategy.dailyLimit === 0) {
//       await prisma.warmupInteraction.updateMany({
//         where: {
//           senderAccountId: accountId,
//           status: "PENDING",
//         },
//         data: { status: "CANCELLED" },
//       })
//     }
//   }

//   /**
//    * Get interaction statistics
//    */
//   private async getInteractionStats(
//     accountId: string,
//     days: number,
//   ): Promise<{
//     totalSent: number
//     bounceRate: number
//     openRate: number
//     replyRate: number
//     recentOpenRate: number
//     historicOpenRate: number
//   }> {
//     const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
//     const midpoint = new Date(Date.now() - (days / 2) * 24 * 60 * 60 * 1000)

//     const [total, recent, historic] = await Promise.all([
//       prisma.warmupInteraction.aggregate({
//         where: {
//           senderAccountId: accountId,
//           status: "SENT",
//           sentAt: { gte: since },
//         },
//         _count: { id: true },
//         _sum: { opened: true, replied: true, bounced: true },
//       }),
//       prisma.warmupInteraction.aggregate({
//         where: {
//           senderAccountId: accountId,
//           status: "SENT",
//           sentAt: { gte: midpoint },
//         },
//         _count: { id: true },
//         _sum: { opened: true },
//       }),
//       prisma.warmupInteraction.aggregate({
//         where: {
//           senderAccountId: accountId,
//           status: "SENT",
//           sentAt: { gte: since, lt: midpoint },
//         },
//         _count: { id: true },
//         _sum: { opened: true },
//       }),
//     ])

//     const totalSent = total._count.id || 0
//     const bounceRate = totalSent > 0 ? ((total._sum.bounced || 0) / totalSent) * 100 : 0
//     const openRate = totalSent > 0 ? ((total._sum.opened || 0) / totalSent) * 100 : 0
//     const replyRate = totalSent > 0 ? ((total._sum.replied || 0) / totalSent) * 100 : 0

//     const recentSent = recent._count.id || 0
//     const historicSent = historic._count.id || 0

//     const recentOpenRate = recentSent > 0 ? ((recent._sum.opened || 0) / recentSent) * 100 : 0
//     const historicOpenRate = historicSent > 0 ? ((historic._sum.opened || 0) / historicSent) * 100 : 0

//     return {
//       totalSent,
//       bounceRate,
//       openRate,
//       replyRate,
//       recentOpenRate,
//       historicOpenRate,
//     }
//   }

//   /**
//    * Auto-revert adjustments that have expired
//    */
//   async revertExpiredAdjustments(): Promise<{ reverted: number }> {
//     try {
//       const expired = await prisma.strategyAdjustment.findMany({
//         where: {
//           isActive: true,
//           autoRevertAt: { lte: new Date() },
//         },
//         include: { account: true },
//       })

//       for (const adjustment of expired) {
//         // Get original strategy from previous adjustment or profile
//         const profile = await prisma.reputationProfile.findUnique({
//           where: { accountId: adjustment.accountId },
//         })

//         if (!profile) continue

//         // Revert to recommended limit
//         await prisma.sendingAccount.update({
//           where: { id: adjustment.accountId },
//           data: {
//             dailyLimit: profile.recommendedDailyLimit,
//             status: "ACTIVE",
//           },
//         })

//         // Mark adjustment as reverted
//         await prisma.strategyAdjustment.update({
//           where: { id: adjustment.id },
//           data: {
//             isActive: false,
//             revertedAt: new Date(),
//           },
//         })

//         logger.info("[StrategyAdjuster] Adjustment reverted", {
//           accountId: adjustment.accountId,
//           adjustmentId: adjustment.id,
//         })
//       }

//       return { reverted: expired.length }
//     } catch (error) {
//       logger.error("[StrategyAdjuster] Revert failed", { error })
//       return { reverted: 0 }
//     }
//   }

//   /**
//    * Batch analyze multiple accounts
//    */
//   async batchAnalyze(accountIds: string[]): Promise<{
//     analyzed: number
//     adjusted: number
//   }> {
//     let adjusted = 0

//     for (const accountId of accountIds) {
//       const result = await this.analyzeAndAdjust(accountId)
//       if (result.adjusted) adjusted++
//     }

//     return { analyzed: accountIds.length, adjusted }
//   }
// }

// export const strategyAdjuster = new StrategyAdjuster()



// import { prisma } from "@/lib/db"
// import { logger } from "@/lib/logger"
// import { inboxPlacementMonitor } from "./inbox-placement-monitor"

// /**
//  * DYNAMIC STRATEGY ADJUSTER
//  * Automatically adjusts warmup strategy based on deliverability signals
//  * Handles emergency situations (spam folder, high bounces)
//  * Scales to 100,000+ accounts with intelligent decisioning
//  */
// class StrategyAdjuster {
//   /**
//    * Analyze account and adjust strategy if needed
//    */
//   async analyzeAndAdjust(accountId: string): Promise<{
//     adjusted: boolean
//     reason?: string
//     adjustmentId?: string
//     previousLimit?: number
//     newLimit?: number
//   }> {
//     try {
//       const account = await prisma.sendingAccount.findUnique({
//         where: { id: accountId },
//         include: { reputationProfile: true },
//       })

//       if (!account || !account.reputationProfile) {
//         return { adjusted: false }
//       }

//       // Get recent performance metrics
//       const [placementStats, interactionStats] = await Promise.all([
//         inboxPlacementMonitor.getPlacementStats(accountId, 3), // Last 3 days
//         this.getInteractionStats(accountId, 7), // Last 7 days
//       ])

//       // Determine if adjustment needed
//       const analysis = this.analyzePerformance({
//         account,
//         placementStats,
//         interactionStats,
//       })

//       if (!analysis.needsAdjustment) {
//         return { adjusted: false }
//       }

//       // Calculate new strategy
//       const newStrategy = this.calculateNewStrategy({
//         account,
//         analysis,
//         placementStats,
//         interactionStats,
//       })

//       // Create adjustment record
//       const adjustment = await prisma.strategyAdjustment.create({
//         data: {
//           accountId,
//           trigger: analysis.trigger,
//           severity: analysis.severity,
//           previousDailyLimit: account.dailyLimit,
//           newDailyLimit: newStrategy.dailyLimit,
//           previousStrategy: {
//             warmupStage: account.reputationProfile.currentWarmupStage,
//             dailyLimit: account.dailyLimit,
//           },
//           newStrategy: newStrategy,
//           autoRevertAt:
//             analysis.severity === "EMERGENCY"
//               ? null // Manual review required
//               : new Date(Date.now() + newStrategy.revertAfterDays * 24 * 60 * 60 * 1000),
//           isActive: true,
//         },
//       })

//       // Apply new strategy
//       await this.applyStrategy(accountId, newStrategy)

//       logger.info("[StrategyAdjuster] Strategy adjusted", {
//         accountId,
//         trigger: analysis.trigger,
//         severity: analysis.severity,
//         oldLimit: account.dailyLimit,
//         newLimit: newStrategy.dailyLimit,
//       })

//       return {
//         adjusted: true,
//         reason: analysis.trigger,
//         adjustmentId: adjustment.id,
//         previousLimit: account.dailyLimit,
//         newLimit: newStrategy.dailyLimit,
//       }
//     } catch (error) {
//       logger.error("[StrategyAdjuster] Analysis failed", { error, accountId })
//       return { adjusted: false }
//     }
//   }

//   /**
//    * Analyze performance and determine if adjustment needed
//    */
//   private analyzePerformance(data: {
//     account: any
//     placementStats: any
//     interactionStats: any
//   }): {
//     needsAdjustment: boolean
//     trigger?: string
//     severity?: "MINOR" | "MODERATE" | "MAJOR" | "EMERGENCY"
//     reason?: string
//   } {
//     const { account, placementStats, interactionStats } = data

//     // EMERGENCY: Spam folder detection
//     if (placementStats.spamRate > 50) {
//       return {
//         needsAdjustment: true,
//         trigger: "spam_detected",
//         severity: "EMERGENCY",
//         reason: `Critical: ${placementStats.spamRate.toFixed(1)}% emails in spam`,
//       }
//     }

//     // MAJOR: High spam rate
//     if (placementStats.spamRate > 20) {
//       return {
//         needsAdjustment: true,
//         trigger: "high_spam_rate",
//         severity: "MAJOR",
//         reason: `${placementStats.spamRate.toFixed(1)}% emails in spam folder`,
//       }
//     }

//     // MAJOR: Bounce spike
//     if (interactionStats.bounceRate > 10) {
//       return {
//         needsAdjustment: true,
//         trigger: "bounce_spike",
//         severity: "MAJOR",
//         reason: `High bounce rate: ${interactionStats.bounceRate.toFixed(1)}%`,
//       }
//     }

//     // MODERATE: Low primary inbox rate
//     if (placementStats.primaryRate < 30 && placementStats.totalChecked > 10) {
//       return {
//         needsAdjustment: true,
//         trigger: "low_inbox_rate",
//         severity: "MODERATE",
//         reason: `Low primary inbox rate: ${placementStats.primaryRate.toFixed(1)}%`,
//       }
//     }

//     // MODERATE: Low engagement
//     if (interactionStats.openRate < 15 && interactionStats.totalSent > 50) {
//       return {
//         needsAdjustment: true,
//         trigger: "low_engagement",
//         severity: "MODERATE",
//         reason: `Low open rate: ${interactionStats.openRate.toFixed(1)}%`,
//       }
//     }

//     // MINOR: Gradual decline
//     if (interactionStats.recentOpenRate < interactionStats.historicOpenRate * 0.7) {
//       return {
//         needsAdjustment: true,
//         trigger: "engagement_decline",
//         severity: "MINOR",
//         reason: "Engagement declining over time",
//       }
//     }

//     return { needsAdjustment: false }
//   }

//   /**
//    * Calculate new strategy based on analysis
//    */
//   private calculateNewStrategy(data: {
//     account: any
//     analysis: any
//     placementStats: any
//     interactionStats: any
//   }): any {
//     const { account, analysis, placementStats, interactionStats } = data
//     const currentLimit = account.dailyLimit

//     let newLimit = currentLimit
//     let pauseDuration = 0 // days
//     let revertAfterDays = 7

//     switch (analysis.severity) {
//       case "EMERGENCY":
//         // Halt immediately
//         newLimit = 0
//         pauseDuration = 3
//         revertAfterDays = 0 // Manual review required
//         break

//       case "MAJOR":
//         // Reduce to 25% of current
//         newLimit = Math.max(5, Math.floor(currentLimit * 0.25))
//         revertAfterDays = 14
//         break

//       case "MODERATE":
//         // Reduce to 50% of current
//         newLimit = Math.max(10, Math.floor(currentLimit * 0.5))
//         revertAfterDays = 10
//         break

//       case "MINOR":
//         // Reduce to 75% of current
//         newLimit = Math.max(15, Math.floor(currentLimit * 0.75))
//         revertAfterDays = 7
//         break
//     }

//     return {
//       dailyLimit: newLimit,
//       pauseDuration,
//       revertAfterDays,
//       reason: analysis.reason,
//       adjustments: {
//         increaseReplyRate: true,
//         focusOnEngagedPeers: true,
//         improveContentQuality: true,
//         monitorPlacementDaily: true,
//       },
//     }
//   }

//   /**
//    * Apply new strategy to account
//    */
//   private async applyStrategy(accountId: string, strategy: any): Promise<void> {
//     await prisma.sendingAccount.update({
//       where: { id: accountId },
//       data: {
//         dailyLimit: strategy.dailyLimit,
//       },
//     })

//     await prisma.reputationProfile.update({
//       where: { accountId },
//       data: {
//         recommendedDailyLimit: strategy.dailyLimit,
//         currentWarmupStage: strategy.dailyLimit < 10 ? "initial" : "building",
//       },
//     })

//     // If paused, cancel pending interactions
//     if (strategy.dailyLimit === 0) {
//       await prisma.warmupInteraction.updateMany({
//         where: {
//           senderAccountId: accountId,
//           isPending: true,
//         },
//         data: { isPending: false },
//       })
//     }
//   }

//   /**
//    * Get interaction statistics
//    */
//   private async getInteractionStats(
//     accountId: string,
//     days: number,
//   ): Promise<{
//     totalSent: number
//     bounceRate: number
//     openRate: number
//     replyRate: number
//     recentOpenRate: number
//     historicOpenRate: number
//   }> {
//     const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
//     const midpoint = new Date(Date.now() - (days / 2) * 24 * 60 * 60 * 1000)

//     const [totalInteractions, recentInteractions, historicInteractions] = await Promise.all([
//       prisma.warmupInteraction.findMany({
//         where: {
//           sendingAccountId: accountId,
//           sentAt: { gte: since },
//         },
//         select: {
//           openedAt: true,
//           repliedAt: true,
//         },
//       }),
//       prisma.warmupInteraction.findMany({
//         where: {
//           sendingAccountId: accountId,
//           sentAt: { gte: midpoint },
//         },
//         select: {
//           openedAt: true,
//         },
//       }),
//       prisma.warmupInteraction.findMany({
//         where: {
//           sendingAccountId: accountId,
//           sentAt: { gte: since, lt: midpoint },
//         },
//         select: {
//           openedAt: true,
//         },
//       }),
//     ])

//     const totalSent = totalInteractions.length
//     const opened = totalInteractions.filter((i) => i.openedAt !== null).length
//     const replied = totalInteractions.filter((i) => i.repliedAt !== null).length

//     // Bounce rate would need to be tracked separately via webhooks
//     const bounceRate = 0

//     const openRate = totalSent > 0 ? (opened / totalSent) * 100 : 0
//     const replyRate = totalSent > 0 ? (replied / totalSent) * 100 : 0

//     const recentSent = recentInteractions.length
//     const historicSent = historicInteractions.length

//     const recentOpened = recentInteractions.filter((i) => i.openedAt !== null).length
//     const historicOpened = historicInteractions.filter((i) => i.openedAt !== null).length

//     const recentOpenRate = recentSent > 0 ? (recentOpened / recentSent) * 100 : 0
//     const historicOpenRate = historicSent > 0 ? (historicOpened / historicSent) * 100 : 0

//     return {
//       totalSent,
//       bounceRate,
//       openRate,
//       replyRate,
//       recentOpenRate,
//       historicOpenRate,
//     }
//   }

//   /**
//    * Auto-revert adjustments that have expired
//    */
//   async revertExpiredAdjustments(): Promise<{ reverted: number }> {
//     try {
//       const expired = await prisma.strategyAdjustment.findMany({
//         where: {
//           isActive: true,
//           autoRevertAt: { lte: new Date() },
//         },
//         include: { account: true },
//       })

//       for (const adjustment of expired) {
//         // Get original strategy from previous adjustment or profile
//         const profile = await prisma.reputationProfile.findUnique({
//           where: { accountId: adjustment.accountId },
//         })

//         if (!profile) continue

//         // Revert to recommended limit
//         await prisma.sendingAccount.update({
//           where: { id: adjustment.accountId },
//           data: {
//             dailyLimit: profile.recommendedDailyLimit,
//           },
//         })

//         // Mark adjustment as reverted
//         await prisma.strategyAdjustment.update({
//           where: { id: adjustment.id },
//           data: {
//             isActive: false,
//             revertedAt: new Date(),
//           },
//         })

//         logger.info("[StrategyAdjuster] Adjustment reverted", {
//           accountId: adjustment.accountId,
//           adjustmentId: adjustment.id,
//         })
//       }

//       return { reverted: expired.length }
//     } catch (error) {
//       logger.error("[StrategyAdjuster] Revert failed", { error })
//       return { reverted: 0 }
//     }
//   }

//   /**
//    * Batch analyze multiple accounts
//    */
//   async batchAnalyze(accountIds: string[]): Promise<{
//     analyzed: number
//     adjusted: number
//   }> {
//     let adjusted = 0

//     for (const accountId of accountIds) {
//       const result = await this.analyzeAndAdjust(accountId)
//       if (result.adjusted) adjusted++
//     }

//     return { analyzed: accountIds.length, adjusted }
//   }

//   /**
//    * Handle deliverability issue immediately
//    * Called by webhook handler when critical issues detected
//    */
//   async handleDeliverabilityIssue(
//     accountId: string,
//     issue: {
//       trigger: string
//       severity: "MINOR" | "MODERATE" | "MAJOR" | "EMERGENCY"
//       detectedAt: Date
//     },
//   ): Promise<void> {
//     try {
//       logger.warn("[StrategyAdjuster] Deliverability issue detected", {
//         accountId,
//         trigger: issue.trigger,
//         severity: issue.severity,
//       })

//       const account = await prisma.sendingAccount.findUnique({
//         where: { id: accountId },
//         include: { reputationProfile: true },
//       })

//       if (!account) {
//         logger.error("[StrategyAdjuster] Account not found", { accountId })
//         return
//       }

//       const newStrategy = this.calculateEmergencyStrategy(account.dailyLimit, issue.severity)

//       await prisma.strategyAdjustment.create({
//         data: {
//           accountId,
//           trigger: issue.trigger,
//           severity: issue.severity,
//           previousDailyLimit: account.dailyLimit,
//           newDailyLimit: newStrategy.dailyLimit,
//           previousStrategy: {
//             warmupStage: account.reputationProfile?.currentWarmupStage,
//             dailyLimit: account.dailyLimit,
//           },
//           newStrategy: newStrategy,
//           autoRevertAt:
//             issue.severity === "EMERGENCY"
//               ? null
//               : new Date(Date.now() + newStrategy.revertAfterDays * 24 * 60 * 60 * 1000),
//           isActive: true,
//         },
//       })

//       await this.applyStrategy(accountId, newStrategy)

//       logger.info("[StrategyAdjuster] Emergency strategy applied", {
//         accountId,
//         newLimit: newStrategy.dailyLimit,
//       })
//     } catch (error) {
//       const err = error as Error
//       logger.error("[StrategyAdjuster] Failed to handle deliverability issue", {
//         error: err.message,
//         accountId,
//       })
//     }
//   }

//   /**
//    * Calculate emergency strategy for immediate response
//    */
//   private calculateEmergencyStrategy(
//     currentLimit: number,
//     severity: "MINOR" | "MODERATE" | "MAJOR" | "EMERGENCY",
//   ): any {
//     let newLimit = currentLimit
//     let pauseDuration = 0
//     let revertAfterDays = 7

//     switch (severity) {
//       case "EMERGENCY":
//         newLimit = 0
//         pauseDuration = 3
//         revertAfterDays = 0
//         break
//       case "MAJOR":
//         newLimit = Math.max(5, Math.floor(currentLimit * 0.25))
//         revertAfterDays = 14
//         break
//       case "MODERATE":
//         newLimit = Math.max(10, Math.floor(currentLimit * 0.5))
//         revertAfterDays = 10
//         break
//       case "MINOR":
//         newLimit = Math.max(15, Math.floor(currentLimit * 0.75))
//         revertAfterDays = 7
//         break
//     }

//     return {
//       dailyLimit: newLimit,
//       pauseDuration,
//       revertAfterDays,
//       adjustments: {
//         increaseReplyRate: true,
//         focusOnEngagedPeers: true,
//         improveContentQuality: true,
//         monitorPlacementDaily: true,
//       },
//     }
//   }
// }

// export const strategyAdjuster = new StrategyAdjuster()


import { prisma } from "@/lib/db"
import { logger } from "@/lib/logger"
import { inboxPlacementMonitor } from "./inbox-placement-monitor"

/**
 * DYNAMIC STRATEGY ADJUSTER
 * Automatically adjusts warmup strategy based on deliverability signals
 * Handles emergency situations (spam folder, high bounces)
 * Scales to 100,000+ accounts with intelligent decisioning
 */
class StrategyAdjuster {
  /**
   * Analyze account and adjust strategy if needed
   */
  async analyzeAndAdjust(accountId: string): Promise<{
    adjusted: boolean
    reason?: string
    adjustmentId?: string
    previousLimit?: number
    newLimit?: number
  }> {
    try {
      const account = await prisma.sendingAccount.findUnique({
        where: { id: accountId },
        include: { reputationProfile: true },
      })

      if (!account || !account.reputationProfile) {
        return { adjusted: false }
      }

      // Get recent performance metrics
      const [placementStats, interactionStats] = await Promise.all([
        inboxPlacementMonitor.getPlacementStats(accountId, 3), // Last 3 days
        this.getInteractionStats(accountId, 7), // Last 7 days
      ])

      // Determine if adjustment needed
      const analysis = this.analyzePerformance({
        account,
        placementStats,
        interactionStats,
      })

      if (!analysis.needsAdjustment) {
        return { adjusted: false }
      }

      

      // Calculate new strategy
      const newStrategy = this.calculateNewStrategy({
        account,
        analysis,
        placementStats,
        interactionStats,
      })

       if (!analysis.trigger || !analysis.severity) {
          return { adjusted: false }
        }

      // Create adjustment record
      const adjustment = await prisma.strategyAdjustment.create({
        data: {
          accountId,
          trigger: analysis.trigger,
          severity: analysis.severity,
          previousDailyLimit: account.dailyLimit,
          newDailyLimit: newStrategy.dailyLimit,
          previousStrategy: {
            warmupStage: account.reputationProfile.currentWarmupStage,
            dailyLimit: account.dailyLimit,
          },
          newStrategy: newStrategy,
          autoRevertAt:
            analysis.severity === "EMERGENCY"
              ? null // Manual review required
              : new Date(Date.now() + newStrategy.revertAfterDays * 24 * 60 * 60 * 1000),
          isActive: true,
        },
      })

      // Apply new strategy
      await this.applyStrategy(accountId, newStrategy)

      logger.info("[StrategyAdjuster] Strategy adjusted", {
        accountId,
        trigger: analysis.trigger,
        severity: analysis.severity,
        oldLimit: account.dailyLimit,
        newLimit: newStrategy.dailyLimit,
      })

      return {
        adjusted: true,
        reason: analysis.trigger,
        adjustmentId: adjustment.id,
        previousLimit: account.dailyLimit,
        newLimit: newStrategy.dailyLimit,
      }
    } catch (error) {
      logger.error("[StrategyAdjuster] Analysis failed", { error, accountId })
      return { adjusted: false }
    }
  }

  /**
   * Analyze performance and determine if adjustment needed
   */
  private analyzePerformance(data: {
    account: any
    placementStats: any
    interactionStats: any
  }): {
    needsAdjustment: boolean
    trigger?: string
    severity?: "MINOR" | "MODERATE" | "MAJOR" | "EMERGENCY"
    reason?: string
  } {
    const { account, placementStats, interactionStats } = data

    // EMERGENCY: Spam folder detection
    if (placementStats.spamRate > 50) {
      return {
        needsAdjustment: true,
        trigger: "spam_detected",
        severity: "EMERGENCY",
        reason: `Critical: ${placementStats.spamRate.toFixed(1)}% emails in spam`,
      }
    }

    // MAJOR: High spam rate
    if (placementStats.spamRate > 20) {
      return {
        needsAdjustment: true,
        trigger: "high_spam_rate",
        severity: "MAJOR",
        reason: `${placementStats.spamRate.toFixed(1)}% emails in spam folder`,
      }
    }

    // MAJOR: Bounce spike
    if (interactionStats.bounceRate > 10) {
      return {
        needsAdjustment: true,
        trigger: "bounce_spike",
        severity: "MAJOR",
        reason: `High bounce rate: ${interactionStats.bounceRate.toFixed(1)}%`,
      }
    }

    // MODERATE: Low primary inbox rate
    if (placementStats.primaryRate < 30 && placementStats.totalChecked > 10) {
      return {
        needsAdjustment: true,
        trigger: "low_inbox_rate",
        severity: "MODERATE",
        reason: `Low primary inbox rate: ${placementStats.primaryRate.toFixed(1)}%`,
      }
    }

    // MODERATE: Low engagement
    if (interactionStats.openRate < 15 && interactionStats.totalSent > 50) {
      return {
        needsAdjustment: true,
        trigger: "low_engagement",
        severity: "MODERATE",
        reason: `Low open rate: ${interactionStats.openRate.toFixed(1)}%`,
      }
    }

    // MINOR: Gradual decline
    if (interactionStats.recentOpenRate < interactionStats.historicOpenRate * 0.7) {
      return {
        needsAdjustment: true,
        trigger: "engagement_decline",
        severity: "MINOR",
        reason: "Engagement declining over time",
      }
    }

    return { needsAdjustment: false }
  }

  /**
   * Calculate new strategy based on analysis
   */
  private calculateNewStrategy(data: {
    account: any
    analysis: any
    placementStats: any
    interactionStats: any
  }): any {
    const { account, analysis, placementStats, interactionStats } = data
    const currentLimit = account.dailyLimit

    let newLimit = currentLimit
    let pauseDuration = 0 // days
    let revertAfterDays = 7

    switch (analysis.severity) {
      case "EMERGENCY":
        // Halt immediately
        newLimit = 0
        pauseDuration = 3
        revertAfterDays = 0 // Manual review required
        break

      case "MAJOR":
        // Reduce to 25% of current
        newLimit = Math.max(5, Math.floor(currentLimit * 0.25))
        revertAfterDays = 14
        break

      case "MODERATE":
        // Reduce to 50% of current
        newLimit = Math.max(10, Math.floor(currentLimit * 0.5))
        revertAfterDays = 10
        break

      case "MINOR":
        // Reduce to 75% of current
        newLimit = Math.max(15, Math.floor(currentLimit * 0.75))
        revertAfterDays = 7
        break
    }

    return {
      dailyLimit: newLimit,
      pauseDuration,
      revertAfterDays,
      reason: analysis.reason,
      adjustments: {
        increaseReplyRate: true,
        focusOnEngagedPeers: true,
        improveContentQuality: true,
        monitorPlacementDaily: true,
      },
    }
  }

  /**
   * Apply new strategy to account
   */
  private async applyStrategy(accountId: string, strategy: any): Promise<void> {
    await prisma.sendingAccount.update({
      where: { id: accountId },
      data: {
        dailyLimit: strategy.dailyLimit,
      },
    })

    await prisma.reputationProfile.update({
      where: { accountId },
      data: {
        recommendedDailyLimit: strategy.dailyLimit,
        currentWarmupStage: strategy.dailyLimit < 10 ? "initial" : "building",
      },
    })

    // If paused, cancel pending interactions
    if (strategy.dailyLimit === 0) {
      await prisma.warmupInteraction.updateMany({
        where: {
          sendingAccountId: accountId,
          isPending: true,
        },
        data: { isPending: false },
      })
    }
  }

  /**
   * Get interaction statistics
   */
  private async getInteractionStats(
    accountId: string,
    days: number,
  ): Promise<{
    totalSent: number
    bounceRate: number
    openRate: number
    replyRate: number
    recentOpenRate: number
    historicOpenRate: number
  }> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const midpoint = new Date(Date.now() - (days / 2) * 24 * 60 * 60 * 1000)

    const [totalInteractions, recentInteractions, historicInteractions] = await Promise.all([
      prisma.warmupInteraction.findMany({
        where: {
          sendingAccountId: accountId,
          sentAt: { gte: since },
        },
        select: {
          openedAt: true,
          repliedAt: true,
        },
      }),
      prisma.warmupInteraction.findMany({
        where: {
          sendingAccountId: accountId,
          sentAt: { gte: midpoint },
        },
        select: {
          openedAt: true,
        },
      }),
      prisma.warmupInteraction.findMany({
        where: {
          sendingAccountId: accountId,
          sentAt: { gte: since, lt: midpoint },
        },
        select: {
          openedAt: true,
        },
      }),
    ])

    const totalSent = totalInteractions.length
    const opened = totalInteractions.filter((i) => i.openedAt !== null).length
    const replied = totalInteractions.filter((i) => i.repliedAt !== null).length

    // Bounce rate would need to be tracked separately via webhooks
    const bounceRate = 0

    const openRate = totalSent > 0 ? (opened / totalSent) * 100 : 0
    const replyRate = totalSent > 0 ? (replied / totalSent) * 100 : 0

    const recentSent = recentInteractions.length
    const historicSent = historicInteractions.length

    const recentOpened = recentInteractions.filter((i) => i.openedAt !== null).length
    const historicOpened = historicInteractions.filter((i) => i.openedAt !== null).length

    const recentOpenRate = recentSent > 0 ? (recentOpened / recentSent) * 100 : 0
    const historicOpenRate = historicSent > 0 ? (historicOpened / historicSent) * 100 : 0

    return {
      totalSent,
      bounceRate,
      openRate,
      replyRate,
      recentOpenRate,
      historicOpenRate,
    }
  }

  /**
   * Auto-revert adjustments that have expired
   */
  async revertExpiredAdjustments(): Promise<{ reverted: number }> {
    try {
      const expired = await prisma.strategyAdjustment.findMany({
        where: {
          isActive: true,
          autoRevertAt: { lte: new Date() },
        },
        include: { account: true },
      })

      for (const adjustment of expired) {
        // Get original strategy from previous adjustment or profile
        const profile = await prisma.reputationProfile.findUnique({
          where: { accountId: adjustment.accountId },
        })

        if (!profile) continue

        // Revert to recommended limit
        await prisma.sendingAccount.update({
          where: { id: adjustment.accountId },
          data: {
            dailyLimit: profile.recommendedDailyLimit,
          },
        })

        // Mark adjustment as reverted
        await prisma.strategyAdjustment.update({
          where: { id: adjustment.id },
          data: {
            isActive: false,
            revertedAt: new Date(),
          },
        })

        logger.info("[StrategyAdjuster] Adjustment reverted", {
          accountId: adjustment.accountId,
          adjustmentId: adjustment.id,
        })
      }

      return { reverted: expired.length }
    } catch (error) {
      logger.error("[StrategyAdjuster] Revert failed", { error })
      return { reverted: 0 }
    }
  }

  /**
   * Batch analyze multiple accounts
   */
  async batchAnalyze(accountIds: string[]): Promise<{
    analyzed: number
    adjusted: number
  }> {
    let adjusted = 0

    for (const accountId of accountIds) {
      const result = await this.analyzeAndAdjust(accountId)
      if (result.adjusted) adjusted++
    }

    return { analyzed: accountIds.length, adjusted }
  }

  /**
   * Handle deliverability issue immediately
   * Called by webhook handler when critical issues detected
   */
  async handleDeliverabilityIssue(
    accountId: string,
    issue: {
      trigger: string
      severity: "MINOR" | "MODERATE" | "MAJOR" | "EMERGENCY"
      detectedAt: Date
    },
  ): Promise<void> {
    try {
      logger.warn("[StrategyAdjuster] Deliverability issue detected", {
        accountId,
        trigger: issue.trigger,
        severity: issue.severity,
      })

      const account = await prisma.sendingAccount.findUnique({
        where: { id: accountId },
        include: { reputationProfile: true },
      })

      if (!account) {
        logger.error("[StrategyAdjuster] Account not found", { accountId })
        return
      }

      const newStrategy = this.calculateEmergencyStrategy(account.dailyLimit, issue.severity)

      await prisma.strategyAdjustment.create({
        data: {
          accountId,
          trigger: issue.trigger,
          severity: issue.severity,
          previousDailyLimit: account.dailyLimit,
          newDailyLimit: newStrategy.dailyLimit,
          previousStrategy: {
            warmupStage: account.reputationProfile?.currentWarmupStage || "initial",
            dailyLimit: account.dailyLimit,
          },
          newStrategy: newStrategy,
          autoRevertAt:
            issue.severity === "EMERGENCY"
              ? null
              : new Date(Date.now() + newStrategy.revertAfterDays * 24 * 60 * 60 * 1000),
          isActive: true,
        },
      })

      await this.applyStrategy(accountId, newStrategy)

      logger.info("[StrategyAdjuster] Emergency strategy applied", {
        accountId,
        newLimit: newStrategy.dailyLimit,
      })
    } catch (error) {
      const err = error as Error
      logger.error("[StrategyAdjuster] Failed to handle deliverability issue", {
        error: err.message,
        accountId,
      })
    }
  }

  /**
   * Calculate emergency strategy for immediate response
   */
  private calculateEmergencyStrategy(
    currentLimit: number,
    severity: "MINOR" | "MODERATE" | "MAJOR" | "EMERGENCY",
  ): any {
    let newLimit = currentLimit
    let pauseDuration = 0
    let revertAfterDays = 7

    switch (severity) {
      case "EMERGENCY":
        newLimit = 0
        pauseDuration = 3
        revertAfterDays = 0
        break
      case "MAJOR":
        newLimit = Math.max(5, Math.floor(currentLimit * 0.25))
        revertAfterDays = 14
        break
      case "MODERATE":
        newLimit = Math.max(10, Math.floor(currentLimit * 0.5))
        revertAfterDays = 10
        break
      case "MINOR":
        newLimit = Math.max(15, Math.floor(currentLimit * 0.75))
        revertAfterDays = 7
        break
    }

    return {
      dailyLimit: newLimit,
      pauseDuration,
      revertAfterDays,
      adjustments: {
        increaseReplyRate: true,
        focusOnEngagedPeers: true,
        improveContentQuality: true,
        monitorPlacementDaily: true,
      },
    }
  }
}

export const strategyAdjuster = new StrategyAdjuster()
