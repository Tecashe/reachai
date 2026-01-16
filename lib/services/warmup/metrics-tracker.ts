// import { prisma } from '@/lib/db'
// import { logger } from '@/lib/logger'
// import { redis, REDIS_KEYS } from '@/lib/redis'

// interface DailyMetrics {
//   date: string
//   accountId: string
//   emailsSent: number
//   emailsDelivered: number
//   emailsOpened: number
//   emailsReplied: number
//   bounces: number
//   spamComplaints: number
//   inboxPlacement: number
// }

// export class MetricsTracker {
//   /**
//    * Track email sent event
//    */
//   async trackEmailSent(
//     accountId: string,
//     sessionId: string,
//     metadata?: Record<string, any>
//   ): Promise<void> {
//     try {
//       // Increment account counter
//       await prisma.sendingAccount.update({
//         where: { id: accountId },
//         data: {
//           emailsSentToday: { increment: 1 },
//           lastWarmupAt: new Date(),
//         },
//       })

//       // Update session counter
//       await prisma.warmupSession.update({
//         where: { id: sessionId },
//         data: {
//           emailsSent: { increment: 1 },
//           lastSentAt: new Date(),
//         },
//       })

//       // Increment Redis counter
//       await this.incrementDailyMetric(accountId, 'sent')

//       logger.debug('Email sent tracked', { accountId, sessionId })
//     } catch (error) {
//       logger.error('Failed to track email sent', error as Error, { accountId })
//     }
//   }

//   /**
//    * Track email delivered event
//    */
//   async trackEmailDelivered(
//     accountId: string,
//     sessionId: string,
//     landedInInbox: boolean
//   ): Promise<void> {
//     try {
//       await this.incrementDailyMetric(accountId, 'delivered')

//       if (landedInInbox) {
//         await this.incrementDailyMetric(accountId, 'inbox')
//       } else {
//         await this.incrementDailyMetric(accountId, 'spam')
//       }

//       logger.debug('Email delivered tracked', {
//         accountId,
//         sessionId,
//         landedInInbox,
//       })
//     } catch (error) {
//       logger.error('Failed to track email delivered', error as Error, {
//         accountId,
//       })
//     }
//   }

//   /**
//    * Track email opened event
//    */
//   async trackEmailOpened(
//     accountId: string,
//     sessionId: string
//   ): Promise<void> {
//     try {
//       await prisma.warmupSession.update({
//         where: { id: sessionId },
//         data: {
//           emailsOpened: { increment: 1 },
//         },
//       })

//       await this.incrementDailyMetric(accountId, 'opened')

//       logger.debug('Email opened tracked', { accountId, sessionId })
//     } catch (error) {
//       logger.error('Failed to track email opened', error as Error, {
//         accountId,
//       })
//     }
//   }

//   /**
//    * Track email replied event
//    */
//   async trackEmailReplied(
//     accountId: string,
//     sessionId: string
//   ): Promise<void> {
//     try {
//       await prisma.warmupSession.update({
//         where: { id: sessionId },
//         data: {
//           emailsReplied: { increment: 1 },
//         },
//       })

//       await this.incrementDailyMetric(accountId, 'replied')

//       logger.debug('Email replied tracked', { accountId, sessionId })
//     } catch (error) {
//       logger.error('Failed to track email replied', error as Error, {
//         accountId,
//       })
//     }
//   }

//   /**
//    * Track bounce event
//    */
//   async trackBounce(
//     accountId: string,
//     bounceType: 'HARD' | 'SOFT' | 'COMPLAINT'
//   ): Promise<void> {
//     try {
//       await this.incrementDailyMetric(accountId, 'bounces')

//       if (bounceType === 'COMPLAINT') {
//         await this.incrementDailyMetric(accountId, 'spam_complaints')
//       }

//       logger.debug('Bounce tracked', { accountId, bounceType })
//     } catch (error) {
//       logger.error('Failed to track bounce', error as Error, { accountId })
//     }
//   }

//   /**
//    * Increment daily metric in Redis
//    */
//   private async incrementDailyMetric(
//     accountId: string,
//     metric: string
//   ): Promise<void> {
//     const date = new Date().toISOString().split('T')[0] // YYYY-MM-DD
//     const key = `${REDIS_KEYS.METRICS}${accountId}:${date}:${metric}`

//     try {
//       await redis.incr(key)
//       await redis.expire(key, 86400 * 30) // Keep for 30 days
//     } catch (error) {
//       logger.error('Failed to increment metric', error as Error, {
//         accountId,
//         metric,
//       })
//     }
//   }

//   /**
//    * Get daily metrics for an account
//    */
//   async getDailyMetrics(
//     accountId: string,
//     date?: string
//   ): Promise<DailyMetrics> {
//     const targetDate = date || new Date().toISOString().split('T')[0]

//     const metrics = {
//       sent: 0,
//       delivered: 0,
//       opened: 0,
//       replied: 0,
//       bounces: 0,
//       spam_complaints: 0,
//       inbox: 0,
//       spam: 0,
//     }

//     // Fetch from Redis
//     for (const [metric, _] of Object.entries(metrics)) {
//       const key = `${REDIS_KEYS.METRICS}${accountId}:${targetDate}:${metric}`
//       try {
//         const value = await redis.get(key)
//         metrics[metric as keyof typeof metrics] = value
//           ? parseInt(value as string, 10)
//           : 0
//       } catch (error) {
//         logger.error('Failed to get metric', error as Error, {
//           accountId,
//           metric,
//         })
//       }
//     }

//     const inboxPlacement =
//       metrics.inbox + metrics.spam > 0
//         ? (metrics.inbox / (metrics.inbox + metrics.spam)) * 100
//         : 100

//     return {
//       date: targetDate,
//       accountId,
//       emailsSent: metrics.sent,
//       emailsDelivered: metrics.delivered,
//       emailsOpened: metrics.opened,
//       emailsReplied: metrics.replied,
//       bounces: metrics.bounces,
//       spamComplaints: metrics.spam_complaints,
//       inboxPlacement: Math.round(inboxPlacement),
//     }
//   }

//   /**
//    * Get metrics for date range
//    */
//   async getMetricsRange(
//     accountId: string,
//     startDate: string,
//     endDate: string
//   ): Promise<DailyMetrics[]> {
//     const start = new Date(startDate)
//     const end = new Date(endDate)
//     const metrics: DailyMetrics[] = []

//     for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//       const dateStr = d.toISOString().split('T')[0]
//       const dailyMetrics = await this.getDailyMetrics(accountId, dateStr)
//       metrics.push(dailyMetrics)
//     }

//     return metrics
//   }

//   /**
//    * Get aggregated metrics for an account
//    */
//   async getAggregatedMetrics(
//     accountId: string,
//     days = 7
//   ): Promise<{
//     totalSent: number
//     totalDelivered: number
//     totalOpened: number
//     totalReplied: number
//     totalBounces: number
//     deliveryRate: number
//     openRate: number
//     replyRate: number
//     bounceRate: number
//     avgInboxPlacement: number
//     }> {
//     const endDate = new Date()
//     const startDate = new Date()
//     startDate.setDate(startDate.getDate() - days)
//     const metrics = await this.getMetricsRange(
//     accountId,
//     startDate.toISOString().split('T')[0],
//     endDate.toISOString().split('T')[0]
//     )

//     const totals = metrics.reduce(
//     (acc, day) => ({
//         sent: acc.sent + day.emailsSent,
//         delivered: acc.delivered + day.emailsDelivered,
//         opened: acc.opened + day.emailsOpened,
//         replied: acc.replied + day.emailsReplied,
//         bounces: acc.bounces + day.bounces,
//         inboxPlacement: acc.inboxPlacement + day.inboxPlacement,
//     }),
//     {
//         sent: 0,
//         delivered: 0,
//         opened: 0,
//         replied: 0,
//         bounces: 0,
//         inboxPlacement: 0,
//     }
//     )

//     return {
//     totalSent: totals.sent,
//     totalDelivered: totals.delivered,
//     totalOpened: totals.opened,
//     totalReplied: totals.replied,
//     totalBounces: totals.bounces,
//     deliveryRate: totals.sent > 0 ? (totals.delivered / totals.sent) * 100 : 0,
//     openRate: totals.delivered > 0 ? (totals.opened / totals.delivered) * 100 : 0,
//     replyRate: totals.delivered > 0 ? (totals.replied / totals.delivered) * 100 : 0,
//     bounceRate: totals.sent > 0 ? (totals.bounces / totals.sent) * 100 : 0,
//     avgInboxPlacement: metrics.length > 0 ? totals.inboxPlacement / metrics.length : 100,
//     }
//     }
//     /**

//     Reset daily counters (called at midnight)
//     */
//     async resetDailyCounters(): Promise<number> {
//     const result = await prisma.sendingAccount.updateMany({
//     where: {
//     emailsSentToday: { gt: 0 },
//     },
//     data: {
//     emailsSentToday: 0,
//     lastResetDate: new Date(),
//     },
//     })

//     logger.info('Daily counters reset', { count: result.count })
//     return result.count
//     }
//     /**

//     Clean up old metrics (older than 30 days)
//     */
//     async cleanupOldMetrics(): Promise<number> {
//     const thirtyDaysAgo = new Date()
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
//     const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0]

//     try {
//     const pattern = `${REDIS_KEYS.METRICS}*:${cutoffDate}:*`
//     const keys = await redis.keys(pattern)

//     if (keys.length > 0) {
//         await redis.del(...keys)
//     }

//     logger.info('Old metrics cleaned up', { deleted: keys.length })
//     return keys.length
//     } catch (error) {
//     logger.error('Failed to cleanup old metrics', error as Error)
//     return 0
//     }
//     }
//     }
//     export const metricsTracker = new MetricsTracker()


// import { prisma } from "@/lib/db"
// import { logger } from "@/lib/logger"
// import { redis, REDIS_KEYS } from "@/lib/redis"

// interface DailyMetrics {
//   date: string
//   accountId: string
//   emailsSent: number
//   emailsDelivered: number
//   emailsOpened: number
//   emailsReplied: number
//   bounces: number
//   spamComplaints: number
//   inboxPlacement: number
//   clicked: number
// }

// export class MetricsTracker {
//   /**
//    * Track email sent event
//    */
//   async trackEmailSent(accountId: string, sessionId: string, metadata?: Record<string, any>): Promise<void> {
//     try {
//       // Increment account counter
//       await prisma.sendingAccount.update({
//         where: { id: accountId },
//         data: {
//           emailsSentToday: { increment: 1 },
//           lastWarmupAt: new Date(),
//         },
//       })

//       // Update session counter
//       await prisma.warmupSession.update({
//         where: { id: sessionId },
//         data: {
//           emailsSent: { increment: 1 },
//           lastSentAt: new Date(),
//         },
//       })

//       // Increment Redis counter
//       await this.incrementDailyMetric(accountId, "sent")

//       logger.debug("Email sent tracked", { accountId, sessionId })
//     } catch (error) {
//       logger.error("Failed to track email sent", error as Error, { accountId })
//     }
//   }

//   /**
//    * Track email delivered event
//    */
//   async trackEmailDelivered(accountId: string, sessionId: string, landedInInbox: boolean): Promise<void> {
//     try {
//       await this.incrementDailyMetric(accountId, "delivered")

//       if (landedInInbox) {
//         await this.incrementDailyMetric(accountId, "inbox")
//       } else {
//         await this.incrementDailyMetric(accountId, "spam")
//       }

//       logger.debug("Email delivered tracked", {
//         accountId,
//         sessionId,
//         landedInInbox,
//       })
//     } catch (error) {
//       logger.error("Failed to track email delivered", error as Error, {
//         accountId,
//       })
//     }
//   }

//   /**
//    * Track email opened event
//    */
//   async trackEmailOpened(accountId: string, sessionId: string): Promise<void> {
//     try {
//       await prisma.warmupSession.update({
//         where: { id: sessionId },
//         data: {
//           emailsOpened: { increment: 1 },
//         },
//       })

//       await this.incrementDailyMetric(accountId, "opened")

//       logger.debug("Email opened tracked", { accountId, sessionId })
//     } catch (error) {
//       logger.error("Failed to track email opened", error as Error, {
//         accountId,
//       })
//     }
//   }

//   /**
//    * Track email replied event
//    */
//   async trackEmailReplied(accountId: string, sessionId: string): Promise<void> {
//     try {
//       await prisma.warmupSession.update({
//         where: { id: sessionId },
//         data: {
//           emailsReplied: { increment: 1 },
//         },
//       })

//       await this.incrementDailyMetric(accountId, "replied")

//       logger.debug("Email replied tracked", { accountId, sessionId })
//     } catch (error) {
//       logger.error("Failed to track email replied", error as Error, {
//         accountId,
//       })
//     }
//   }

//   /**
//    * Track bounce event
//    */
//   async trackBounce(accountId: string, bounceType: "HARD" | "SOFT" | "COMPLAINT"): Promise<void> {
//     try {
//       await this.incrementDailyMetric(accountId, "bounces")

//       if (bounceType === "COMPLAINT") {
//         await this.incrementDailyMetric(accountId, "spam_complaints")
//       }

//       logger.debug("Bounce tracked", { accountId, bounceType })
//     } catch (error) {
//       logger.error("Failed to track bounce", error as Error, { accountId })
//     }
//   }

//   /**
//    * Track delivered event from webhook (no session required)
//    */
//   async trackDelivered(accountId: string): Promise<void> {
//     try {
//       await this.incrementDailyMetric(accountId, "delivered")
//       await this.incrementDailyMetric(accountId, "inbox")
//       logger.debug("Delivered tracked from webhook", { accountId })
//     } catch (error) {
//       logger.error("Failed to track delivered", error as Error, { accountId })
//     }
//   }

//   /**
//    * Track opened event from webhook (no session required)
//    */
//   async trackOpened(accountId: string): Promise<void> {
//     try {
//       await this.incrementDailyMetric(accountId, "opened")
//       logger.debug("Opened tracked from webhook", { accountId })
//     } catch (error) {
//       logger.error("Failed to track opened", error as Error, { accountId })
//     }
//   }

//   /**
//    * Track clicked event from webhook (no session required)
//    */
//   async trackClicked(accountId: string): Promise<void> {
//     try {
//       await this.incrementDailyMetric(accountId, "clicked")
//       logger.debug("Clicked tracked from webhook", { accountId })
//     } catch (error) {
//       logger.error("Failed to track clicked", error as Error, { accountId })
//     }
//   }

//   /**
//    * Track spam complaint from webhook (no session required)
//    */
//   async trackComplaint(accountId: string): Promise<void> {
//     try {
//       await this.incrementDailyMetric(accountId, "spam_complaints")
//       logger.debug("Complaint tracked from webhook", { accountId })
//     } catch (error) {
//       logger.error("Failed to track complaint", error as Error, { accountId })
//     }
//   }

//   /**
//    * Increment daily metric in Redis
//    */
//   private async incrementDailyMetric(accountId: string, metric: string): Promise<void> {
//     const date = new Date().toISOString().split("T")[0] // YYYY-MM-DD
//     const key = `${REDIS_KEYS.METRICS}${accountId}:${date}:${metric}`

//     try {
//       await redis.incr(key)
//       await redis.expire(key, 86400 * 30) // Keep for 30 days
//     } catch (error) {
//       logger.error("Failed to increment metric", error as Error, {
//         accountId,
//         metric,
//       })
//     }
//   }

//   /**
//    * Get daily metrics for an account
//    */
//   async getDailyMetrics(accountId: string, date?: string): Promise<DailyMetrics> {
//     const targetDate = date || new Date().toISOString().split("T")[0]

//     const metrics = {
//       sent: 0,
//       delivered: 0,
//       opened: 0,
//       replied: 0,
//       bounces: 0,
//       spam_complaints: 0,
//       inbox: 0,
//       spam: 0,
//       clicked: 0,
//     }

//     // Fetch from Redis
//     for (const [metric, _] of Object.entries(metrics)) {
//       const key = `${REDIS_KEYS.METRICS}${accountId}:${targetDate}:${metric}`
//       try {
//         const value = await redis.get(key)
//         metrics[metric as keyof typeof metrics] = value ? Number.parseInt(value as string, 10) : 0
//       } catch (error) {
//         logger.error("Failed to get metric", error as Error, {
//           accountId,
//           metric,
//         })
//       }
//     }

//     const inboxPlacement =
//       metrics.inbox + metrics.spam > 0 ? (metrics.inbox / (metrics.inbox + metrics.spam)) * 100 : 100

//     return {
//       date: targetDate,
//       accountId,
//       emailsSent: metrics.sent,
//       emailsDelivered: metrics.delivered,
//       emailsOpened: metrics.opened,
//       emailsReplied: metrics.replied,
//       bounces: metrics.bounces,
//       spamComplaints: metrics.spam_complaints,
//       inboxPlacement: Math.round(inboxPlacement),
//       clicked: metrics.clicked,
//     }
//   }

//   /**
//    * Get metrics for date range
//    */
//   async getMetricsRange(accountId: string, startDate: string, endDate: string): Promise<DailyMetrics[]> {
//     const start = new Date(startDate)
//     const end = new Date(endDate)
//     const metrics: DailyMetrics[] = []

//     for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//       const dateStr = d.toISOString().split("T")[0]
//       const dailyMetrics = await this.getDailyMetrics(accountId, dateStr)
//       metrics.push(dailyMetrics)
//     }

//     return metrics
//   }

//   /**
//    * Get aggregated metrics for an account
//    */
//   async getAggregatedMetrics(
//     accountId: string,
//     days = 7,
//   ): Promise<{
//     totalSent: number
//     totalDelivered: number
//     totalOpened: number
//     totalReplied: number
//     totalBounces: number
//     deliveryRate: number
//     openRate: number
//     replyRate: number
//     bounceRate: number
//     avgInboxPlacement: number
//     avgClicked: number
//   }> {
//     const endDate = new Date()
//     const startDate = new Date()
//     startDate.setDate(startDate.getDate() - days)
//     const metrics = await this.getMetricsRange(
//       accountId,
//       startDate.toISOString().split("T")[0],
//       endDate.toISOString().split("T")[0],
//     )

//     const totals = metrics.reduce(
//       (acc, day) => ({
//         sent: acc.sent + day.emailsSent,
//         delivered: acc.delivered + day.emailsDelivered,
//         opened: acc.opened + day.emailsOpened,
//         replied: acc.replied + day.emailsReplied,
//         bounces: acc.bounces + day.bounces,
//         inboxPlacement: acc.inboxPlacement + day.inboxPlacement,
//         clicked: acc.clicked + day.clicked,
//       }),
//       {
//         sent: 0,
//         delivered: 0,
//         opened: 0,
//         replied: 0,
//         bounces: 0,
//         inboxPlacement: 0,
//         clicked: 0,
//       },
//     )

//     return {
//       totalSent: totals.sent,
//       totalDelivered: totals.delivered,
//       totalOpened: totals.opened,
//       totalReplied: totals.replied,
//       totalBounces: totals.bounces,
//       deliveryRate: totals.sent > 0 ? (totals.delivered / totals.sent) * 100 : 0,
//       openRate: totals.delivered > 0 ? (totals.opened / totals.delivered) * 100 : 0,
//       replyRate: totals.delivered > 0 ? (totals.replied / totals.delivered) * 100 : 0,
//       bounceRate: totals.sent > 0 ? (totals.bounces / totals.sent) * 100 : 0,
//       avgInboxPlacement: metrics.length > 0 ? totals.inboxPlacement / metrics.length : 100,
//       avgClicked: metrics.length > 0 ? totals.clicked / metrics.length : 0,
//     }
//   }

//   /**
//    * Reset daily counters (called at midnight)
//    */
//   async resetDailyCounters(): Promise<number> {
//     const result = await prisma.sendingAccount.updateMany({
//       where: {
//         emailsSentToday: { gt: 0 },
//       },
//       data: {
//         emailsSentToday: 0,
//         lastResetDate: new Date(),
//       },
//     })

//     logger.info("Daily counters reset", { count: result.count })
//     return result.count
//   }

//   /**
//    * Clean up old metrics (older than 30 days)
//    */
//   async cleanupOldMetrics(): Promise<number> {
//     const thirtyDaysAgo = new Date()
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
//     const cutoffDate = thirtyDaysAgo.toISOString().split("T")[0]

//     try {
//       const pattern = `${REDIS_KEYS.METRICS}*:${cutoffDate}:*`
//       const keys = await redis.keys(pattern)

//       if (keys.length > 0) {
//         await redis.del(...keys)
//       }

//       logger.info("Old metrics cleaned up", { deleted: keys.length })
//       return keys.length
//     } catch (error) {
//       logger.error("Failed to cleanup old metrics", error as Error)
//       return 0
//     }
//   }
// }
// export const metricsTracker = new MetricsTracker()


import { prisma } from "@/lib/db"
import { logger } from "@/lib/logger"
import { redis, REDIS_KEYS } from "@/lib/redis"

interface DailyMetrics {
  date: string
  accountId: string
  emailsSent: number
  emailsDelivered: number
  emailsOpened: number
  emailsReplied: number
  bounces: number
  spamComplaints: number
  inboxPlacement: number
  clicked: number
}

export class MetricsTracker {
  /**
   * Track email sent event
   */
  async trackEmailSent(accountId: string, sessionId: string, metadata?: Record<string, any>): Promise<void> {
    try {
      // Increment account counter
      await prisma.sendingAccount.update({
        where: { id: accountId },
        data: {
          emailsSentToday: { increment: 1 },
          lastWarmupAt: new Date(),
        },
      })

      // Update session counter
      await prisma.warmupSession.update({
        where: { id: sessionId },
        data: {
          emailsSent: { increment: 1 },
          lastSentAt: new Date(),
        },
      })

      // Increment Redis counter
      await this.incrementDailyMetric(accountId, "sent")

      logger.debug("Email sent tracked", { accountId, sessionId })
    } catch (error) {
      logger.error("Failed to track email sent", error as Error, { accountId })
    }
  }

  /**
   * Track email delivered event
   */
  async trackEmailDelivered(accountId: string, sessionId: string, landedInInbox: boolean): Promise<void> {
    try {
      await this.incrementDailyMetric(accountId, "delivered")

      if (landedInInbox) {
        await this.incrementDailyMetric(accountId, "inbox")
      } else {
        await this.incrementDailyMetric(accountId, "spam")
      }

      logger.debug("Email delivered tracked", {
        accountId,
        sessionId,
        landedInInbox,
      })
    } catch (error) {
      logger.error("Failed to track email delivered", error as Error, {
        accountId,
      })
    }
  }

  /**
   * Track email opened event
   */
  async trackEmailOpened(accountId: string, sessionId: string): Promise<void> {
    try {
      await prisma.warmupSession.update({
        where: { id: sessionId },
        data: {
          emailsOpened: { increment: 1 },
        },
      })

      await this.incrementDailyMetric(accountId, "opened")

      logger.debug("Email opened tracked", { accountId, sessionId })
    } catch (error) {
      logger.error("Failed to track email opened", error as Error, {
        accountId,
      })
    }
  }

  /**
   * Track email replied event
   */
  async trackEmailReplied(accountId: string, sessionId: string): Promise<void> {
    try {
      await prisma.warmupSession.update({
        where: { id: sessionId },
        data: {
          emailsReplied: { increment: 1 },
        },
      })

      await this.incrementDailyMetric(accountId, "replied")

      logger.debug("Email replied tracked", { accountId, sessionId })
    } catch (error) {
      logger.error("Failed to track email replied", error as Error, {
        accountId,
      })
    }
  }

  /**
   * Track bounce event
   */
  async trackBounce(accountId: string, bounceType: "HARD" | "SOFT" | "COMPLAINT"): Promise<void> {
    try {
      await this.incrementDailyMetric(accountId, "bounces")

      if (bounceType === "COMPLAINT") {
        await this.incrementDailyMetric(accountId, "spam_complaints")
      }

      logger.debug("Bounce tracked", { accountId, bounceType })
    } catch (error) {
      logger.error("Failed to track bounce", error as Error, { accountId })
    }
  }

  /**
   * Track delivered event from webhook (no session required)
   */
  async trackDelivered(accountId: string): Promise<void> {
    try {
      await this.incrementDailyMetric(accountId, "delivered")
      await this.incrementDailyMetric(accountId, "inbox")
      logger.debug("Delivered tracked from webhook", { accountId })
    } catch (error) {
      logger.error("Failed to track delivered", error as Error, { accountId })
    }
  }

  /**
   * Track opened event from webhook (no session required)
   */
  async trackOpened(accountId: string): Promise<void> {
    try {
      await this.incrementDailyMetric(accountId, "opened")
      logger.debug("Opened tracked from webhook", { accountId })
    } catch (error) {
      logger.error("Failed to track opened", error as Error, { accountId })
    }
  }

  /**
   * Track clicked event from webhook (no session required)
   */
  async trackClicked(accountId: string): Promise<void> {
    try {
      await this.incrementDailyMetric(accountId, "clicked")
      logger.debug("Clicked tracked from webhook", { accountId })
    } catch (error) {
      logger.error("Failed to track clicked", error as Error, { accountId })
    }
  }

  /**
   * Track spam complaint from webhook (no session required)
   */
  async trackComplaint(accountId: string): Promise<void> {
    try {
      await this.incrementDailyMetric(accountId, "spam_complaints")
      logger.debug("Complaint tracked from webhook", { accountId })
    } catch (error) {
      logger.error("Failed to track complaint", error as Error, { accountId })
    }
  }

  /**
   * Track warmup reply (peer-to-peer)
   */
  async trackWarmupReply(accountId: string, sessionId: string): Promise<void> {
    try {
      await prisma.warmupSession.update({
        where: { id: sessionId },
        data: {
          emailsReplied: { increment: 1 },
        },
      })

      await this.incrementDailyMetric(accountId, "replied")

      logger.debug("Warmup reply tracked", { accountId, sessionId })
    } catch (error) {
      logger.error("Failed to track warmup reply", error as Error, {
        accountId,
      })
    }
  }

  /**
   * Increment daily metric in Redis
   */
  private async incrementDailyMetric(accountId: string, metric: string): Promise<void> {
    const date = new Date().toISOString().split("T")[0] // YYYY-MM-DD
    const key = `${REDIS_KEYS.METRICS}${accountId}:${date}:${metric}`

    try {
      await redis.incr(key)
      await redis.expire(key, 86400 * 30) // Keep for 30 days
    } catch (error) {
      logger.error("Failed to increment metric", error as Error, {
        accountId,
        metric,
      })
    }
  }

  /**
   * Get daily metrics for an account
   */
  async getDailyMetrics(accountId: string, date?: string): Promise<DailyMetrics> {
    const targetDate = date || new Date().toISOString().split("T")[0]

    const metrics = {
      sent: 0,
      delivered: 0,
      opened: 0,
      replied: 0,
      bounces: 0,
      spam_complaints: 0,
      inbox: 0,
      spam: 0,
      clicked: 0,
    }

    // Fetch from Redis
    for (const [metric, _] of Object.entries(metrics)) {
      const key = `${REDIS_KEYS.METRICS}${accountId}:${targetDate}:${metric}`
      try {
        const value = await redis.get(key)
        metrics[metric as keyof typeof metrics] = value ? Number.parseInt(value as string, 10) : 0
      } catch (error) {
        logger.error("Failed to get metric", error as Error, {
          accountId,
          metric,
        })
      }
    }

    const inboxPlacement =
      metrics.inbox + metrics.spam > 0 ? (metrics.inbox / (metrics.inbox + metrics.spam)) * 100 : 100

    return {
      date: targetDate,
      accountId,
      emailsSent: metrics.sent,
      emailsDelivered: metrics.delivered,
      emailsOpened: metrics.opened,
      emailsReplied: metrics.replied,
      bounces: metrics.bounces,
      spamComplaints: metrics.spam_complaints,
      inboxPlacement: Math.round(inboxPlacement),
      clicked: metrics.clicked,
    }
  }

  /**
   * Get metrics for date range
   */
  async getMetricsRange(accountId: string, startDate: string, endDate: string): Promise<DailyMetrics[]> {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const metrics: DailyMetrics[] = []

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0]
      const dailyMetrics = await this.getDailyMetrics(accountId, dateStr)
      metrics.push(dailyMetrics)
    }

    return metrics
  }

  /**
   * Get aggregated metrics for an account
   */
  async getAggregatedMetrics(
    accountId: string,
    days = 7,
  ): Promise<{
    totalSent: number
    totalDelivered: number
    totalOpened: number
    totalReplied: number
    totalBounces: number
    deliveryRate: number
    openRate: number
    replyRate: number
    bounceRate: number
    avgInboxPlacement: number
    avgClicked: number
  }> {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const metrics = await this.getMetricsRange(
      accountId,
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0],
    )

    const totals = metrics.reduce(
      (acc, day) => ({
        sent: acc.sent + day.emailsSent,
        delivered: acc.delivered + day.emailsDelivered,
        opened: acc.opened + day.emailsOpened,
        replied: acc.replied + day.emailsReplied,
        bounces: acc.bounces + day.bounces,
        inboxPlacement: acc.inboxPlacement + day.inboxPlacement,
        clicked: acc.clicked + day.clicked,
      }),
      {
        sent: 0,
        delivered: 0,
        opened: 0,
        replied: 0,
        bounces: 0,
        inboxPlacement: 0,
        clicked: 0,
      },
    )

    return {
      totalSent: totals.sent,
      totalDelivered: totals.delivered,
      totalOpened: totals.opened,
      totalReplied: totals.replied,
      totalBounces: totals.bounces,
      deliveryRate: totals.sent > 0 ? (totals.delivered / totals.sent) * 100 : 0,
      openRate: totals.delivered > 0 ? (totals.opened / totals.delivered) * 100 : 0,
      replyRate: totals.delivered > 0 ? (totals.replied / totals.delivered) * 100 : 0,
      bounceRate: totals.sent > 0 ? (totals.bounces / totals.sent) * 100 : 0,
      avgInboxPlacement: metrics.length > 0 ? totals.inboxPlacement / metrics.length : 100,
      avgClicked: metrics.length > 0 ? totals.clicked / metrics.length : 0,
    }
  }

  /**
   * Reset daily counters (called at midnight)
   */
  async resetDailyCounters(): Promise<number> {
    const result = await prisma.sendingAccount.updateMany({
      where: {
        emailsSentToday: { gt: 0 },
      },
      data: {
        emailsSentToday: 0,
        lastResetDate: new Date(),
      },
    })

    logger.info("Daily counters reset", { count: result.count })
    return result.count
  }

  /**
   * Clean up old metrics (older than 30 days)
   */
  async cleanupOldMetrics(): Promise<number> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const cutoffDate = thirtyDaysAgo.toISOString().split("T")[0]

    try {
      const pattern = `${REDIS_KEYS.METRICS}*:${cutoffDate}:*`
      const keys = await redis.keys(pattern)

      if (keys.length > 0) {
        await redis.del(...keys)
      }

      logger.info("Old metrics cleaned up", { deleted: keys.length })
      return keys.length
    } catch (error) {
      logger.error("Failed to cleanup old metrics", error as Error)
      return 0
    }
  }
}
export const metricsTracker = new MetricsTracker()
