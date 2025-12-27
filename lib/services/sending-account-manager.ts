

// "use server"

// import { db } from "@/lib/db"

// /**
//  * Campaign Performance Monitor
//  * Automatically pauses campaigns with poor performance to protect sender reputation
//  */

// interface PerformanceThresholds {
//   bounceRate: number // Pause if > 5%
//   spamComplaintRate: number // Pause if > 0.1%
//   unsubscribeRate: number // Pause if > 2%
//   lowEngagement: number // Pause if open rate < 10% after 50+ sends
// }

// const DEFAULT_THRESHOLDS: PerformanceThresholds = {
//   bounceRate: 5,
//   spamComplaintRate: 0.1,
//   unsubscribeRate: 2,
//   lowEngagement: 10,
// }

// export class CampaignPerformanceMonitor {
//   /**
//    * Check campaign performance and auto-pause if needed
//    */
//   async checkCampaignPerformance(campaignId: string): Promise<{
//     shouldPause: boolean
//     reason?: string
//     metrics: any
//   }> {
//     const campaign = await db.campaign.findUnique({
//       where: { id: campaignId },
//       include: {
//         prospects: {
//           include: {
//             emailLogs: {
//               include: {
//                 bounces: true,
//               },
//             },
//           },
//         },
//       },
//     })

//     if (!campaign || campaign.status !== "ACTIVE") {
//       return { shouldPause: false, metrics: {} }
//     }

//     // Calculate metrics
//     const totalSent = campaign.emailsSent
//     const totalBounced = campaign.emailsBounced
//     const totalOpened = campaign.emailsOpened
//     const totalUnsubscribed = campaign.prospects.filter((p) => p.unsubscribed).length

//     // Count spam complaints from bounces
//     const spamComplaints = await db.emailBounce.count({
//       where: {
//         emailLog: {
//           prospect: {
//             campaignId,
//           },
//         },
//         bounceType: "COMPLAINT",
//       },
//     })

//     if (totalSent < 10) {
//       // Need minimum sends to make decisions
//       return { shouldPause: false, metrics: {} }
//     }

//     const bounceRate = (totalBounced / totalSent) * 100
//     const spamComplaintRate = (spamComplaints / totalSent) * 100
//     const unsubscribeRate = (totalUnsubscribed / totalSent) * 100
//     const openRate = (totalOpened / totalSent) * 100

//     const metrics = {
//       totalSent,
//       totalBounced,
//       totalOpened,
//       totalUnsubscribed,
//       spamComplaints,
//       bounceRate,
//       spamComplaintRate,
//       unsubscribeRate,
//       openRate,
//     }

//     // Check thresholds
//     if (bounceRate > DEFAULT_THRESHOLDS.bounceRate) {
//       await this.pauseCampaign(campaignId, `High bounce rate: ${bounceRate.toFixed(2)}%`)
//       return {
//         shouldPause: true,
//         reason: `High bounce rate (${bounceRate.toFixed(2)}%). Paused to protect sender reputation.`,
//         metrics,
//       }
//     }

//     if (spamComplaintRate > DEFAULT_THRESHOLDS.spamComplaintRate) {
//       await this.pauseCampaign(campaignId, `High spam complaint rate: ${spamComplaintRate.toFixed(2)}%`)
//       return {
//         shouldPause: true,
//         reason: `High spam complaint rate (${spamComplaintRate.toFixed(2)}%). Campaign paused immediately.`,
//         metrics,
//       }
//     }

//     if (unsubscribeRate > DEFAULT_THRESHOLDS.unsubscribeRate) {
//       await this.pauseCampaign(campaignId, `High unsubscribe rate: ${unsubscribeRate.toFixed(2)}%`)
//       return {
//         shouldPause: true,
//         reason: `High unsubscribe rate (${unsubscribeRate.toFixed(2)}%). Content may need improvement.`,
//         metrics,
//       }
//     }

//     if (totalSent >= 50 && openRate < DEFAULT_THRESHOLDS.lowEngagement) {
//       await this.pauseCampaign(campaignId, `Low engagement: ${openRate.toFixed(2)}% open rate`)
//       return {
//         shouldPause: true,
//         reason: `Low engagement (${openRate.toFixed(2)}% opens). Consider improving subject lines and content.`,
//         metrics,
//       }
//     }

//     return { shouldPause: false, metrics }
//   }

//   /**
//    * Pause campaign and notify user
//    */
//   private async pauseCampaign(campaignId: string, reason: string) {
//     await db.campaign.update({
//       where: { id: campaignId },
//       data: {
//         status: "PAUSED",
//       },
//     })

//     const campaign = await db.campaign.findUnique({
//       where: { id: campaignId },
//       select: { userId: true, name: true },
//     })

//     if (campaign) {
//       await db.realtimeNotification.create({
//         data: {
//           userId: campaign.userId,
//           type: "CAMPAIGN_PAUSED",
//           title: `Campaign "${campaign.name}" auto-paused`,
//           message: reason,
//           priority: "HIGH",
//           entityType: "campaign",
//           entityId: campaignId,
//           playSound: true,
//         },
//       })
//     }

//     console.log(`[v0] Campaign ${campaignId} auto-paused: ${reason}`)
//   }

//   /**
//    * Check sending account health and pause if needed
//    */
//   async checkAccountHealth(accountId: string): Promise<{
//     shouldPause: boolean
//     reason?: string
//     healthScore: number
//   }> {
//     const account = await db.sendingAccount.findUnique({
//       where: { id: accountId },
//       include: {
//         bounces: {
//           where: {
//             bouncedAt: {
//               gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
//             },
//           },
//         },
//         emailLogs: {
//           where: {
//             sentAt: {
//               gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//             },
//           },
//         },
//       },
//     })

//     if (!account) {
//       return { shouldPause: false, healthScore: 0 }
//     }

//     const totalSent = account.emailLogs.length
//     const totalBounces = account.bounces.length
//     const spamComplaints = account.bounces.filter((b) => b.bounceType === "COMPLAINT").length

//     if (totalSent === 0) {
//       return { shouldPause: false, healthScore: 100 }
//     }

//     const bounceRate = (totalBounces / totalSent) * 100
//     const spamComplaintRate = (spamComplaints / totalSent) * 100

//     // Calculate health score (0-100)
//     let healthScore = 100
//     healthScore -= bounceRate * 5 // Each 1% bounce = -5 points
//     healthScore -= spamComplaintRate * 50 // Each 0.1% spam = -5 points
//     healthScore = Math.max(0, Math.min(100, healthScore))

//     // Update account health
//     await db.sendingAccount.update({
//       where: { id: accountId },
//       data: {
//         healthScore: Math.round(healthScore),
//         bounceRate: Number.parseFloat(bounceRate.toFixed(2)),
//         spamComplaintRate: Number.parseFloat(spamComplaintRate.toFixed(2)),
//         lastHealthCheck: new Date(),
//       },
//     })

//     // Pause if health is critical
//     if (healthScore < 50) {
//       console.log(`[v0] Sending account paused due to low health score`, {
//         accountId,
//         healthScore,
//         bounceRate,
//         spamComplaintRate,
//       })

//       await db.sendingAccount.update({
//         where: { id: accountId },
//         data: {
//           isActive: false,
//           pausedReason: `Low health score: ${healthScore.toFixed(0)}/100`,
//           pausedAt: new Date(),
//         },
//       })

//       return {
//         shouldPause: true,
//         reason: `Account health critical (${healthScore.toFixed(0)}/100). Paused to prevent further damage.`,
//         healthScore,
//       }
//     }

//     return { shouldPause: false, healthScore }
//   }
// }

// export const campaignPerformanceMonitor = new CampaignPerformanceMonitor()

import { db } from "../db"
import { logger } from "../logger"
import type { WarmupStage } from "@prisma/client"

interface SendingAccount {
  id: string
  email: string
  provider: string
  dailyLimit: number
  hourlyLimit: number
  emailsSentToday: number
  emailsSentThisHour: number
  warmupEnabled: boolean
  warmupStage: WarmupStage
  warmupDailyLimit: number
  isActive: boolean
}

class SendingAccountManager {
  async getAvailableAccount(userId: string): Promise<SendingAccount | null> {
    const now = new Date()

    // Get all active accounts for user
    const accounts = await db.sendingAccount.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        emailsSentToday: "asc",
      },
    })

    if (accounts.length === 0) {
      logger.warn("No active sending accounts found", { userId })
      return null
    }

    // Reset daily counters if needed
    for (const account of accounts) {
      const lastReset = new Date(account.lastResetDate || 0)
      if (now.getDate() !== lastReset.getDate()) {
        await db.sendingAccount.update({
          where: { id: account.id },
          data: {
            emailsSentToday: 0,
            lastResetDate: now,
          },
        })
        account.emailsSentToday = 0
      }

      // Reset hourly counters if needed
      const lastHourReset = new Date(account.lastResetHour || 0)
      if (now.getHours() !== lastHourReset.getHours()) {
        await db.sendingAccount.update({
          where: { id: account.id },
          data: {
            emailsSentThisHour: 0,
            lastResetHour: now,
          },
        })
        account.emailsSentThisHour = 0
      }
    }

    // Find account with available capacity
    for (const account of accounts) {
      const effectiveDailyLimit = account.warmupEnabled ? account.warmupDailyLimit : account.dailyLimit

      const hasHourlyCapacity = account.emailsSentThisHour < account.hourlyLimit
      const hasDailyCapacity = account.emailsSentToday < effectiveDailyLimit

      if (hasHourlyCapacity && hasDailyCapacity) {
        logger.info("Selected sending account", {
          accountId: account.id,
          email: account.email,
          sentToday: account.emailsSentToday,
          dailyLimit: effectiveDailyLimit,
        })
        return account as SendingAccount
      }
    }

    logger.warn("All sending accounts at capacity", { userId })
    return null
  }

  async incrementAccountUsage(accountId: string): Promise<void> {
    await db.sendingAccount.update({
      where: { id: accountId },
      data: {
        emailsSentToday: { increment: 1 },
        emailsSentThisHour: { increment: 1 },
      },
    })
  }

  async recordBounce(accountId: string): Promise<void> {
    const account = await db.sendingAccount.findUnique({
      where: { id: accountId },
      include: {
        emailLogs: {
          where: {
            status: "BOUNCED",
          },
        },
      },
    })

    if (!account) return

    const totalSent = account.emailsSentToday
    const bounces = account.emailLogs.length
    const bounceRate = totalSent > 0 ? (bounces / totalSent) * 100 : 0

    await db.sendingAccount.update({
      where: { id: accountId },
      data: {
        bounceRate,
        isActive: bounceRate < 5,
      },
    })

    if (bounceRate >= 5) {
      // Fix: Pass undefined for error parameter, then context as third parameter
      logger.error(`Sending account paused due to high bounce rate: ${bounceRate}%`, undefined, {
        accountId,
        bounceRate,
      })
    }
  }

  async getAccountStats(accountId: string) {
    const account = await db.sendingAccount.findUnique({
      where: { id: accountId },
      include: {
        emailLogs: {
          where: {
            sentAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    })

    if (!account) return null

    const totalSent = account.emailLogs.length
    const delivered = account.emailLogs.filter((log) => log.status === "DELIVERED").length
    const bounced = account.emailLogs.filter((log) => log.status === "BOUNCED").length
    const opened = account.emailLogs.filter((log) => log.openedAt !== null).length

    return {
      accountId: account.id,
      email: account.email,
      totalSent,
      delivered,
      bounced,
      opened,
      deliveryRate: totalSent > 0 ? (delivered / totalSent) * 100 : 0,
      bounceRate: totalSent > 0 ? (bounced / totalSent) * 100 : 0,
      openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
      dailyLimit: account.warmupEnabled ? account.warmupDailyLimit : account.dailyLimit,
      emailsSentToday: account.emailsSentToday,
      remainingToday: Math.max(
        0,
        (account.warmupEnabled ? account.warmupDailyLimit : account.dailyLimit) - account.emailsSentToday,
      ),
    }
  }
}

export const sendingAccountManager = new SendingAccountManager()