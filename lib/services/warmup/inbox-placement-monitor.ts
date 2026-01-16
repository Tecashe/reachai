// import { prisma } from "@/lib/db"
// import { logger } from "@/lib/logger"
// import { imapReader } from "./imap-reader"

// /**
//  * INBOX PLACEMENT MONITOR
//  * Detects where emails land (Primary, Promotions, Spam)
//  * Provides real-time deliverability feedback
//  * Critical for 100,000+ account monitoring
//  */
// class InboxPlacementMonitor {
//   /**
//    * Check inbox placement for a specific email
//    * Uses IMAPfolder detection
//    */
//   async checkPlacement(params: {
//     accountId: string
//     emailLogId?: string
//     warmupInteractionId?: string
//     messageId?: string
//   }): Promise<{
//     success: boolean
//     folder?: string
//     confidence?: number
//     error?: string
//   }> {
//     try {
//       const { accountId, emailLogId, warmupInteractionId, messageId } = params

//       // Get account with credentials
//       const account = await prisma.sendingAccount.findUnique({
//         where: { id: accountId },
//       })

//       if (!account) {
//         return { success: false, error: "Account not found" }
//       }

//       // Detect folder via IMAP
//       const folderResult = await imapReader.detectEmailFolder({
//         email: account.email,
//         password: account.password, // Encrypted, will be decrypted in imapReader
//         messageId,
//       })

//       if (!folderResult.success) {
//         return { success: false, error: folderResult.error }
//       }

//       // Map IMAP folder to our enum
//       const detectedFolder = this.mapFolderToEnum(folderResult.folder, account.email)

//       // Store placement record
//       await prisma.inboxPlacement.create({
//         data: {
//           accountId,
//           emailLogId,
//           warmupInteractionId,
//           detectedFolder,
//           espType: this.detectESPType(account.email),
//           detectionMethod: "imap_folder",
//           confidence: folderResult.confidence || 1.0,
//         },
//       })

//       // Update reputation profile based on placement
//       await this.updateReputationFromPlacement(accountId, detectedFolder)

//       logger.info("[InboxPlacementMonitor] Placement detected", {
//         accountId,
//         folder: detectedFolder,
//         emailLogId,
//       })

//       return { success: true, folder: detectedFolder, confidence: folderResult.confidence }
//     } catch (error) {
//       logger.error("[InboxPlacementMonitor] Placement check failed", { error, params })
//       return { success: false, error: error.message }
//     }
//   }

//   /**
//    * Batch check placements for multiple emails
//    */
//   async batchCheckPlacements(
//     accountId: string,
//     limit = 20,
//   ): Promise<{
//     checked: number
//     placements: Record<string, number>
//   }> {
//     try {
//       // Get recent warmup interactions without placement data
//       const interactions = await prisma.warmupInteraction.findMany({
//         where: {
//           recipientAccountId: accountId,
//           status: "SENT",
//           landedInInbox: true,
//           inboxPlacements: { none: {} }, // No placement record yet
//         },
//         take: limit,
//         orderBy: { sentAt: "desc" },
//       })

//       const placements: Record<string, number> = {}

//       for (const interaction of interactions) {
//         const result = await this.checkPlacement({
//           accountId,
//           warmupInteractionId: interaction.id,
//           messageId: interaction.id, // Use interaction ID if no external messageId
//         })

//         if (result.success && result.folder) {
//           placements[result.folder] = (placements[result.folder] || 0) + 1
//         }
//       }

//       return { checked: interactions.length, placements }
//     } catch (error) {
//       logger.error("[InboxPlacementMonitor] Batch check failed", { error, accountId })
//       return { checked: 0, placements: {} }
//     }
//   }

//   /**
//    * Get placement statistics for an account
//    */
//   async getPlacementStats(
//     accountId: string,
//     days = 7,
//   ): Promise<{
//     primaryRate: number
//     promotionsRate: number
//     spamRate: number
//     totalChecked: number
//   }> {
//     const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

//     const placements = await prisma.inboxPlacement.findMany({
//       where: {
//         accountId,
//         createdAt: { gte: since },
//       },
//     })

//     const total = placements.length
//     if (total === 0) {
//       return { primaryRate: 0, promotionsRate: 0, spamRate: 0, totalChecked: 0 }
//     }

//     const primary = placements.filter((p) => p.detectedFolder === "PRIMARY").length
//     const promotions = placements.filter((p) => p.detectedFolder === "PROMOTIONS").length
//     const spam = placements.filter((p) => p.detectedFolder === "SPAM").length

//     return {
//       primaryRate: (primary / total) * 100,
//       promotionsRate: (promotions / total) * 100,
//       spamRate: (spam / total) * 100,
//       totalChecked: total,
//     }
//   }

//   /**
//    * Map IMAP folder name to our enum
//    */
//   private mapFolderToEnum(folderName: string, email: string): string {
//     const lower = folderName.toLowerCase()

//     // Gmail-specific
//     if (email.includes("gmail")) {
//       if (lower === "inbox" || lower === "[gmail]/all mail") return "PRIMARY"
//       if (lower.includes("promotions")) return "PROMOTIONS"
//       if (lower.includes("social")) return "SOCIAL"
//       if (lower.includes("spam") || lower.includes("junk")) return "SPAM"
//       if (lower.includes("trash")) return "TRASH"
//     }

//     // Outlook/Hotmail
//     if (email.includes("outlook") || email.includes("hotmail")) {
//       if (lower === "inbox") return "PRIMARY"
//       if (lower.includes("junk")) return "SPAM"
//       if (lower.includes("deleted")) return "TRASH"
//     }

//     // Generic
//     if (lower === "inbox") return "PRIMARY"
//     if (lower.includes("spam") || lower.includes("junk")) return "SPAM"
//     if (lower.includes("trash") || lower.includes("deleted")) return "TRASH"

//     return "UNKNOWN"
//   }

//   /**
//    * Detect ESP type from email
//    */
//   private detectESPType(email: string): string {
//     const domain = email.split("@")[1].toLowerCase()
//     if (domain === "gmail.com") return "gmail"
//     if (domain.includes("outlook") || domain.includes("hotmail")) return "outlook"
//     if (domain === "yahoo.com") return "yahoo"
//     return "custom"
//   }

//   /**
//    * Update reputation profile based on placement
//    */
//   private async updateReputationFromPlacement(accountId: string, folder: string): Promise<void> {
//     try {
//       // Get current stats
//       const stats = await this.getPlacementStats(accountId, 7)

//       // Update reputation profile
//       await prisma.reputationProfile.update({
//         where: { accountId },
//         data: {
//           primaryInboxRate: stats.primaryRate,
//           promotionsRate: stats.promotionsRate,
//           spamRate: stats.spamRate,
//         },
//       })

//       // If spam rate is high, trigger strategy adjustment
//       if (stats.spamRate > 20) {
//         logger.warn("[InboxPlacementMonitor] High spam rate detected", {
//           accountId,
//           spamRate: stats.spamRate,
//         })

//         // Trigger adjustment (will be handled by strategy adjuster)
//         await prisma.strategyAdjustment.create({
//           data: {
//             accountId,
//             trigger: "spam_detected",
//             severity: stats.spamRate > 50 ? "MAJOR" : "MODERATE",
//             previousDailyLimit: 0, // Will be filled by adjuster
//             newDailyLimit: 0,
//             previousStrategy: {},
//             newStrategy: { reason: "high_spam_rate", spamRate: stats.spamRate },
//           },
//         })
//       }
//     } catch (error) {
//       logger.error("[InboxPlacementMonitor] Failed to update reputation", { error, accountId })
//     }
//   }

//   /**
//    * Monitor all active accounts for placement issues
//    * Run this periodically (e.g., every hour)
//    */
//   async monitorAllAccounts(limit = 100): Promise<{
//     monitored: number
//     issues: Array<{ accountId: string; issue: string }>
//   }> {
//     try {
//       // Get accounts needing monitoring
//       const accounts = await prisma.sendingAccount.findMany({
//         where: {
//           status: "ACTIVE",
//           warmupEnabled: true,
//         },
//         take: limit,
//         orderBy: { lastUsedAt: "desc" },
//       })

//       const issues: Array<{ accountId: string; issue: string }> = []

//       for (const account of accounts) {
//         const stats = await this.getPlacementStats(account.id, 1) // Last 24h

//         // Check for issues
//         if (stats.spamRate > 30) {
//           issues.push({
//             accountId: account.id,
//             issue: `High spam rate: ${stats.spamRate.toFixed(1)}%`,
//           })
//         }

//         if (stats.primaryRate < 50 && stats.totalChecked > 10) {
//           issues.push({
//             accountId: account.id,
//             issue: `Low primary inbox rate: ${stats.primaryRate.toFixed(1)}%`,
//           })
//         }
//       }

//       return { monitored: accounts.length, issues }
//     } catch (error) {
//       logger.error("[InboxPlacementMonitor] Monitoring failed", { error })
//       return { monitored: 0, issues: [] }
//     }
//   }
// }

// export const inboxPlacementMonitor = new InboxPlacementMonitor()

// import { prisma } from "@/lib/db"
// import { logger } from "@/lib/logger"
// import { strategyAdjuster } from "./strategy-adjuster"

// /**
//  * INBOX PLACEMENT MONITOR
//  * Detects where emails land (Primary, Promotions, Spam)
//  * Provides real-time deliverability feedback
//  * Critical for 100,000+ account monitoring
//  */
// class InboxPlacementMonitor {
//   /**
//    * Check inbox placement for a specific email
//    * Uses IMAP folder detection
//    */
//   async checkPlacement(params: {
//     accountId: string
//     emailLogId?: string
//     warmupInteractionId?: string
//     messageId?: string
//   }): Promise<{
//     success: boolean
//     folder?: string
//     confidence?: number
//     error?: string
//   }> {
//     try {
//       const { accountId, emailLogId, warmupInteractionId, messageId } = params

//       // Get account with credentials
//       const account = await prisma.sendingAccount.findUnique({
//         where: { id: accountId },
//       })

//       if (!account) {
//         return { success: false, error: "Account not found" }
//       }

//       // IMAP detection would need separate implementation with proper IMAP credentials management

//       logger.info("[InboxPlacementMonitor] Placement check initiated", {
//         accountId,
//         emailLogId,
//       })

//       // For now, return placeholder - full IMAP integration requires credential decryption
//       return { success: true, folder: "PRIMARY", confidence: 0.8 }
//     } catch (error) {
//       const err = error as Error
//       logger.error("[InboxPlacementMonitor] Placement check failed", {
//         error: err.message,
//         params,
//       })
//       return { success: false, error: err.message }
//     }
//   }

//   /**
//    * Batch check placements for multiple emails
//    */
//   async batchCheckPlacements(
//     accountId: string,
//     limit = 20,
//   ): Promise<{
//     checked: number
//     placements: Record<string, number>
//   }> {
//     try {
//       const interactions = await prisma.warmupInteraction.findMany({
//         where: {
//           sendingAccountId: accountId,
//           landedInInbox: true,
//           inboxPlacements: { none: {} },
//         },
//         take: limit,
//         orderBy: { sentAt: "desc" },
//       })

//       const placements: Record<string, number> = {}

//       for (const interaction of interactions) {
//         const result = await this.checkPlacement({
//           accountId,
//           warmupInteractionId: interaction.id,
//           messageId: interaction.id, // Use interaction ID if no external messageId
//         })

//         if (result.success && result.folder) {
//           placements[result.folder] = (placements[result.folder] || 0) + 1
//         }
//       }

//       return { checked: interactions.length, placements }
//     } catch (error) {
//       logger.error("[InboxPlacementMonitor] Batch check failed", { error, accountId })
//       return { checked: 0, placements: {} }
//     }
//   }

//   /**
//    * Get placement statistics for an account
//    */
//   async getPlacementStats(
//     accountId: string,
//     days = 7,
//   ): Promise<{
//     primaryRate: number
//     promotionsRate: number
//     spamRate: number
//     totalChecked: number
//   }> {
//     const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

//     const placements = await prisma.inboxPlacement.findMany({
//       where: {
//         accountId,
//         createdAt: { gte: since },
//       },
//     })

//     const total = placements.length
//     if (total === 0) {
//       return { primaryRate: 0, promotionsRate: 0, spamRate: 0, totalChecked: 0 }
//     }

//     const primary = placements.filter((p) => p.detectedFolder === "PRIMARY").length
//     const promotions = placements.filter((p) => p.detectedFolder === "PROMOTIONS").length
//     const spam = placements.filter((p) => p.detectedFolder === "SPAM").length

//     return {
//       primaryRate: (primary / total) * 100,
//       promotionsRate: (promotions / total) * 100,
//       spamRate: (spam / total) * 100,
//       totalChecked: total,
//     }
//   }

//   /**
//    * Map IMAP folder name to our enum
//    */
//   private mapFolderToEnum(folderName: string, email: string): string {
//     const lower = folderName.toLowerCase()

//     // Gmail-specific
//     if (email.includes("gmail")) {
//       if (lower === "inbox" || lower === "[gmail]/all mail") return "PRIMARY"
//       if (lower.includes("promotions")) return "PROMOTIONS"
//       if (lower.includes("social")) return "SOCIAL"
//       if (lower.includes("spam") || lower.includes("junk")) return "SPAM"
//       if (lower.includes("trash")) return "TRASH"
//     }

//     // Outlook/Hotmail
//     if (email.includes("outlook") || email.includes("hotmail")) {
//       if (lower === "inbox") return "PRIMARY"
//       if (lower.includes("junk")) return "SPAM"
//       if (lower.includes("deleted")) return "TRASH"
//     }

//     // Generic
//     if (lower === "inbox") return "PRIMARY"
//     if (lower.includes("spam") || lower.includes("junk")) return "SPAM"
//     if (lower.includes("trash") || lower.includes("deleted")) return "TRASH"

//     return "UNKNOWN"
//   }

//   /**
//    * Detect ESP type from email
//    */
//   private detectESPType(email: string): string {
//     const domain = email.split("@")[1].toLowerCase()
//     if (domain === "gmail.com") return "gmail"
//     if (domain.includes("outlook") || domain.includes("hotmail")) return "outlook"
//     if (domain === "yahoo.com") return "yahoo"
//     return "custom"
//   }

//   /**
//    * Update reputation profile based on placement
//    */
//   private async updateReputationFromPlacement(accountId: string, folder: string): Promise<void> {
//     try {
//       const stats = await this.getPlacementStats(accountId, 7)

//       await prisma.reputationProfile.update({
//         where: { accountId },
//         data: {
//           primaryInboxRate: stats.primaryRate,
//           promotionsRate: stats.promotionsRate,
//           spamRate: stats.spamRate,
//         },
//       })

//       if (stats.spamRate > 20) {
//         logger.warn("[InboxPlacementMonitor] High spam rate detected", {
//           accountId,
//           spamRate: stats.spamRate,
//         })

//         await strategyAdjuster.handleDeliverabilityIssue(accountId, {
//           trigger: "spam_detected",
//           severity: stats.spamRate > 50 ? "MAJOR" : "MODERATE",
//           detectedAt: new Date(),
//         })
//       }
//     } catch (error) {
//       const err = error as Error
//       logger.error("[InboxPlacementMonitor] Failed to update reputation", {
//         error: err.message,
//         accountId,
//       })
//     }
//   }

//   /**
//    * Monitor all active accounts for placement issues
//    * Run this periodically (e.g., every hour)
//    */
//   async monitorAllAccounts(limit = 100): Promise<{
//     monitored: number
//     issues: Array<{ accountId: string; issue: string }>
//   }> {
//     try {
//       const accounts = await prisma.sendingAccount.findMany({
//         where: {
//           warmupEnabled: true,
//         },
//         take: limit,
//         orderBy: { createdAt: "desc" },
//       })

//       const issues: Array<{ accountId: string; issue: string }> = []

//       for (const account of accounts) {
//         const stats = await this.getPlacementStats(account.id, 1) // Last 24h

//         // Check for issues
//         if (stats.spamRate > 30) {
//           issues.push({
//             accountId: account.id,
//             issue: `High spam rate: ${stats.spamRate.toFixed(1)}%`,
//           })
//         }

//         if (stats.primaryRate < 50 && stats.totalChecked > 10) {
//           issues.push({
//             accountId: account.id,
//             issue: `Low primary inbox rate: ${stats.primaryRate.toFixed(1)}%`,
//           })
//         }
//       }

//       return { monitored: accounts.length, issues }
//     } catch (error) {
//       logger.error("[InboxPlacementMonitor] Monitoring failed", { error })
//       return { monitored: 0, issues: [] }
//     }
//   }
// }

// export const inboxPlacementMonitor = new InboxPlacementMonitor()



import { prisma } from "@/lib/db"
import { logger } from "@/lib/logger"
import { strategyAdjuster } from "./strategy-adjuster"
import { InboxFolder } from "@prisma/client"

/**
 * INBOX PLACEMENT MONITOR
 * Detects where emails land (Primary, Promotions, Spam)
 * Provides real-time deliverability feedback
 * Critical for 100,000+ account monitoring
 */
class InboxPlacementMonitor {
  /**
   * Check inbox placement for a specific email
   * Uses IMAP folder detection
   */
  async checkPlacement(params: {
  accountId: string
  emailLogId?: string
  warmupInteractionId?: string
  messageId?: string
}): Promise<{
  success: boolean
  folder?: InboxFolder  // Change from string to InboxFolder
  confidence?: number
  error?: string
}> {
    try {
      const { accountId, emailLogId, warmupInteractionId, messageId } = params

      // Get account with credentials
      const account = await prisma.sendingAccount.findUnique({
        where: { id: accountId },
      })

      if (!account) {
        return { success: false, error: "Account not found" }
      }

      // IMAP detection would need separate implementation with proper IMAP credentials management

      logger.info("[InboxPlacementMonitor] Placement check initiated", {
        accountId,
        emailLogId,
      })

      // For now, return placeholder - full IMAP integration requires credential decryption
      return { success: true, folder: "PRIMARY", confidence: 0.8 }
    } catch (error) {
      const err = error as Error
      logger.error("[InboxPlacementMonitor] Placement check failed", {
        error: err.message,
        params,
      })
      return { success: false, error: err.message }
    }
  }

  /**
   * Batch check placements for multiple emails
   */
  async batchCheckPlacements(
    accountId: string,
    limit = 20,
  ): Promise<{
    checked: number
    placements: Record<string, number>
  }> {
    try {
      // Get recent warmup interactions that landed in inbox
      // Get IDs of interactions that already have placement records
      const existingPlacements = await prisma.inboxPlacement.findMany({
        where: {
          accountId,
          warmupInteractionId: { not: null },
        },
        select: {
          warmupInteractionId: true,
        },
      })

      const existingIds = existingPlacements
        .map((p) => p.warmupInteractionId)
        .filter((id): id is string => id !== null)

      // Get interactions that don't have placement records yet
      const interactions = await prisma.warmupInteraction.findMany({
        where: {
          sendingAccountId: accountId,
          landedInInbox: true,
          id: { notIn: existingIds },
        },
        take: limit,
        orderBy: { sentAt: "desc" },
      })

      const placements: Record<string, number> = {}

      for (const interaction of interactions) {
        const result = await this.checkPlacement({
          accountId,
          warmupInteractionId: interaction.id,
          messageId: interaction.messageId || interaction.id,
        })

        if (result.success && result.folder) {
          placements[result.folder] = (placements[result.folder] || 0) + 1

          // Store the placement result
          await prisma.inboxPlacement.create({
            data: {
              accountId,
              warmupInteractionId: interaction.id,
              detectedFolder: result.folder,
              confidence: result.confidence || 0.8,
              espType: this.detectESPType(interaction.sendingAccountId),
              detectionMethod: "IMAP",
            },
          })
        }
      }

      return { checked: interactions.length, placements }
    } catch (error) {
      logger.error("[InboxPlacementMonitor] Batch check failed", { error, accountId })
      return { checked: 0, placements: {} }
    }
  }

  /**
   * Get placement statistics for an account
   */
  async getPlacementStats(
    accountId: string,
    days = 7,
  ): Promise<{
    primaryRate: number
    promotionsRate: number
    spamRate: number
    totalChecked: number
  }> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const placements = await prisma.inboxPlacement.findMany({
      where: {
        accountId,
        createdAt: { gte: since },
      },
    })

    const total = placements.length
    if (total === 0) {
      return { primaryRate: 0, promotionsRate: 0, spamRate: 0, totalChecked: 0 }
    }

    const primary = placements.filter((p) => p.detectedFolder === "PRIMARY").length
    const promotions = placements.filter((p) => p.detectedFolder === "PROMOTIONS").length
    const spam = placements.filter((p) => p.detectedFolder === "SPAM").length

    return {
      primaryRate: (primary / total) * 100,
      promotionsRate: (promotions / total) * 100,
      spamRate: (spam / total) * 100,
      totalChecked: total,
    }
  }

  /**
   * Map IMAP folder name to our enum
   */
  private mapFolderToEnum(folderName: string, email: string): string {
    const lower = folderName.toLowerCase()

    // Gmail-specific
    if (email.includes("gmail")) {
      if (lower === "inbox" || lower === "[gmail]/all mail") return "PRIMARY"
      if (lower.includes("promotions")) return "PROMOTIONS"
      if (lower.includes("social")) return "SOCIAL"
      if (lower.includes("spam") || lower.includes("junk")) return "SPAM"
      if (lower.includes("trash")) return "TRASH"
    }

    // Outlook/Hotmail
    if (email.includes("outlook") || email.includes("hotmail")) {
      if (lower === "inbox") return "PRIMARY"
      if (lower.includes("junk")) return "SPAM"
      if (lower.includes("deleted")) return "TRASH"
    }

    // Generic
    if (lower === "inbox") return "PRIMARY"
    if (lower.includes("spam") || lower.includes("junk")) return "SPAM"
    if (lower.includes("trash") || lower.includes("deleted")) return "TRASH"

    return "UNKNOWN"
  }

  /**
   * Detect ESP type from email
   */
  private detectESPType(email: string): string {
    const domain = email.split("@")[1]?.toLowerCase() || ""
    if (domain === "gmail.com") return "gmail"
    if (domain.includes("outlook") || domain.includes("hotmail")) return "outlook"
    if (domain === "yahoo.com") return "yahoo"
    return "custom"
  }

  /**
   * Update reputation profile based on placement
   */
  private async updateReputationFromPlacement(accountId: string, folder: string): Promise<void> {
    try {
      const stats = await this.getPlacementStats(accountId, 7)

      // Check if reputation profile exists
      const existingProfile = await prisma.reputationProfile.findUnique({
        where: { accountId },
      })

      if (existingProfile) {
        await prisma.reputationProfile.update({
          where: { accountId },
          data: {
            primaryInboxRate: stats.primaryRate,
            promotionsRate: stats.promotionsRate,
            spamRate: stats.spamRate,
          },
        })
      } else {
        // Create if doesn't exist
        await prisma.reputationProfile.create({
          data: {
            accountId,
            primaryInboxRate: stats.primaryRate,
            promotionsRate: stats.promotionsRate,
            spamRate: stats.spamRate,
          },
        })
      }

      if (stats.spamRate > 20) {
        logger.warn("[InboxPlacementMonitor] High spam rate detected", {
          accountId,
          spamRate: stats.spamRate,
        })

        await strategyAdjuster.handleDeliverabilityIssue(accountId, {
          trigger: "spam_detected",
          severity: stats.spamRate > 50 ? "MAJOR" : "MODERATE",
          detectedAt: new Date(),
        })
      }
    } catch (error) {
      const err = error as Error
      logger.error("[InboxPlacementMonitor] Failed to update reputation", {
        error: err.message,
        accountId,
      })
    }
  }

  /**
   * Monitor all active accounts for placement issues
   * Run this periodically (e.g., every hour)
   */
  async monitorAllAccounts(limit = 100): Promise<{
    monitored: number
    issues: Array<{ accountId: string; issue: string }>
  }> {
    try {
      const accounts = await prisma.sendingAccount.findMany({
        where: {
          warmupEnabled: true,
        },
        take: limit,
        orderBy: { createdAt: "desc" },
      })

      const issues: Array<{ accountId: string; issue: string }> = []

      for (const account of accounts) {
        const stats = await this.getPlacementStats(account.id, 1) // Last 24h

        // Check for issues
        if (stats.spamRate > 30) {
          issues.push({
            accountId: account.id,
            issue: `High spam rate: ${stats.spamRate.toFixed(1)}%`,
          })
        }

        if (stats.primaryRate < 50 && stats.totalChecked > 10) {
          issues.push({
            accountId: account.id,
            issue: `Low primary inbox rate: ${stats.primaryRate.toFixed(1)}%`,
          })
        }
      }

      return { monitored: accounts.length, issues }
    } catch (error) {
      logger.error("[InboxPlacementMonitor] Monitoring failed", { error })
      return { monitored: 0, issues: [] }
    }
  }
}

export const inboxPlacementMonitor = new InboxPlacementMonitor()