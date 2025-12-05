// import { db } from "../db"
// import { logger } from "../logger"

// class RealtimeInboxManager {
//   /**
//    * Create notification for new reply
//    */
//   async notifyNewReply(replyId: string): Promise<void> {
//     const reply = await db.emailReply.findUnique({
//       where: { id: replyId },
//       include: {
//         prospect: true,
//         campaign: true,
//       },
//     })

//     if (!reply) return

//     // Determine priority based on sentiment and category
//     let priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" = "MEDIUM"
//     let playSound = false

//     if (reply.sentiment === "POSITIVE" || reply.category === "INTERESTED") {
//       priority = "URGENT"
//       playSound = true
//     } else if (reply.category === "QUESTION") {
//       priority = "HIGH"
//       playSound = true
//     }

//     await db.realtimeNotification.create({
//       data: {
//         userId: reply.prospect.userId,
//         type: "NEW_REPLY",
//         title: `New ${priority.toLowerCase()} priority reply`,
//         message: `${reply.prospect.firstName} ${reply.prospect.lastName} replied: "${reply.subject}"`,
//         priority,
//         entityType: "reply",
//         entityId: replyId,
//         playSound,
//       },
//     })

//     logger.info("Realtime notification created", { replyId, priority })
//   }

//   /**
//    * Get pending notifications for user
//    */
//   async getPendingNotifications(userId: string) {
//     return db.realtimeNotification.findMany({
//       where: {
//         userId,
//         delivered: false,
//       },
//       orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
//       take: 50,
//     })
//   }

//   /**
//    * Mark notifications as delivered
//    */
//   async markAsDelivered(notificationIds: string[]): Promise<void> {
//     await db.realtimeNotification.updateMany({
//       where: { id: { in: notificationIds } },
//       data: {
//         delivered: true,
//         deliveredAt: new Date(),
//       },
//     })
//   }

//   /**
//    * Poll for new notifications (for clients without WebSocket)
//    */
//   async pollNotifications(userId: string, lastChecked: Date) {
//     return db.realtimeNotification.findMany({
//       where: {
//         userId,
//         createdAt: { gt: lastChecked },
//       },
//       orderBy: { createdAt: "desc" },
//     })
//   }
// }

// export const realtimeInbox = new RealtimeInboxManager()



// import { db } from "../db"
// import { logger } from "../logger"

// class RealtimeInboxManager {
//   /**
//    * Create notification for new reply
//    */
//   async notifyNewReply(replyId: string): Promise<void> {
//     const reply = await db.emailReply.findUnique({
//       where: { id: replyId },
//       include: {
//         prospect: true,
//         campaign: true,
//       },
//     })

//     if (!reply) return

//     // Determine priority based on sentiment and category
//     let priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" = "MEDIUM"
//     let playSound = false

//     if (reply.sentiment === "POSITIVE" || reply.category === "INTERESTED") {
//       priority = "URGENT"
//       playSound = true
//     } else if (reply.category === "QUESTION") {
//       priority = "HIGH"
//       playSound = true
//     }

//     await db.realtimeNotification.create({
//       data: {
//         userId: reply.prospect.userId,
//         type: "NEW_REPLY",
//         title: `New ${priority.toLowerCase()} priority reply`,
//         message: `${reply.prospect.firstName} ${reply.prospect.lastName} replied: "${reply.subject}"`,
//         priority,
//         entityType: "reply",
//         entityId: replyId,
//         playSound,
//       },
//     })

//     logger.info("Realtime notification created", { replyId, priority })
//   }

//   /**
//    * Get pending notifications for user (undelivered only)
//    */
//   async getPendingNotifications(userId: string) {
//     return db.realtimeNotification.findMany({
//       where: {
//         userId,
//         delivered: false,
//       },
//       orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
//       take: 50,
//     })
//   }

//   /**
//    * Get all recent notifications (for initial load)
//    * This fetches ALL notifications, regardless of delivery status
//    */
//   async getRecentNotifications(userId: string, limit: number = 50) {
//     return db.realtimeNotification.findMany({
//       where: {
//         userId,
//       },
//       orderBy: { createdAt: "desc" },
//       take: limit,
//     })
//   }

//   /**
//    * Mark notifications as delivered
//    */
//   async markAsDelivered(notificationIds: string[]): Promise<void> {
//     await db.realtimeNotification.updateMany({
//       where: { id: { in: notificationIds } },
//       data: {
//         delivered: true,
//         deliveredAt: new Date(),
//       },
//     })
//   }

//   /**
//    * Poll for new notifications (for clients without WebSocket)
//    */
//   async pollNotifications(userId: string, lastChecked: Date) {
//     return db.realtimeNotification.findMany({
//       where: {
//         userId,
//         createdAt: { gt: lastChecked },
//       },
//       orderBy: { createdAt: "desc" },
//     })
//   }
// }

// export const realtimeInbox = new RealtimeInboxManager()

import { db } from "../db"
import { logger } from "../logger"

// ============================================================================
// Types
// ============================================================================

interface UnifiedNotification {
  id: string
  type: string
  title: string
  message: string
  priority: string
  entityType?: string | null
  entityId?: string | null
  playSound: boolean
  createdAt: Date
  source: 'realtime' | 'standard'
}

type NotificationPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"

// ============================================================================
// Realtime Inbox Manager
// ============================================================================

class RealtimeInboxManager {
  /**
   * Create a realtime notification for a new reply
   * Automatically determines priority based on sentiment and category
   */
  async notifyNewReply(replyId: string): Promise<void> {
    const reply = await db.emailReply.findUnique({
      where: { id: replyId },
      include: {
        prospect: true,
        campaign: true,
      },
    })

    if (!reply) {
      logger.warn("Reply not found for notification", { replyId })
      return
    }

    // Determine priority based on sentiment and category
    const { priority, playSound } = this.calculateReplyPriority(
      reply.sentiment,
      reply.category
    )

    await db.realtimeNotification.create({
      data: {
        userId: reply.prospect.userId,
        type: "NEW_REPLY",
        title: `New ${priority.toLowerCase()} priority reply`,
        message: `${reply.prospect.firstName} ${reply.prospect.lastName} replied: "${reply.subject}"`,
        priority,
        entityType: "reply",
        entityId: replyId,
        playSound,
      },
    })

    logger.info("Realtime notification created", { replyId, priority })
  }

  /**
   * Get undelivered notifications (RealtimeNotification only)
   */
  async getPendingNotifications(userId: string): Promise<UnifiedNotification[]> {
    const notifications = await db.realtimeNotification.findMany({
      where: {
        userId,
        delivered: false,
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: 50,
    })

    return this.convertRealtimeToUnified(notifications)
  }

  /**
   * Get all recent notifications from BOTH Notification and RealtimeNotification
   * Used for initial load
   */
  async getRecentNotifications(
    userId: string,
    limit: number = 50
  ): Promise<UnifiedNotification[]> {
    // Fetch from both models in parallel
    const [realtimeNotifs, standardNotifs] = await Promise.all([
      db.realtimeNotification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      db.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    ])

    // Convert both to unified format
    const realtimeUnified = this.convertRealtimeToUnified(realtimeNotifs)
    const standardUnified = this.convertStandardToUnified(standardNotifs)

    // Merge and sort by creation date, then limit results
    return [...realtimeUnified, ...standardUnified]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  }

  /**
   * Poll for new notifications from BOTH models since last check
   * Used for periodic polling
   */
  async pollNotifications(
    userId: string,
    lastChecked: Date
  ): Promise<UnifiedNotification[]> {
    // Fetch new notifications from both models
    const [realtimeNotifs, standardNotifs] = await Promise.all([
      db.realtimeNotification.findMany({
        where: {
          userId,
          createdAt: { gt: lastChecked },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.notification.findMany({
        where: {
          userId,
          createdAt: { gt: lastChecked },
        },
        orderBy: { createdAt: "desc" },
      }),
    ])

    // Convert to unified format
    const realtimeUnified = this.convertRealtimeToUnified(realtimeNotifs)
    const standardUnified = this.convertStandardToUnified(standardNotifs)

    // Merge and sort by creation date
    return [...realtimeUnified, ...standardUnified].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )
  }

  /**
   * Mark notifications as delivered and read (works for both types)
   */
  async markAsDelivered(notificationIds: string[]): Promise<void> {
    if (!notificationIds.length) return

    // Update RealtimeNotification
    try {
      await db.realtimeNotification.updateMany({
        where: { id: { in: notificationIds } },
        data: {
          delivered: true,
          deliveredAt: new Date(),
          read: true,
          readAt: new Date(),
        },
      })
    } catch (error) {
      logger.warn("Failed to update realtime notifications", { error, notificationIds })
    }

    // Update standard Notification
    try {
      await db.notification.updateMany({
        where: { id: { in: notificationIds } },
        data: {
          read: true,
          readAt: new Date(),
        },
      })
    } catch (error) {
      logger.warn("Failed to update standard notifications", { error, notificationIds })
    }
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Calculate reply priority based on sentiment and category
   */
  private calculateReplyPriority(
    sentiment: string | null,
    category: string | null
  ): { priority: NotificationPriority; playSound: boolean } {
    if (sentiment === "POSITIVE" || category === "INTERESTED") {
      return { priority: "URGENT", playSound: true }
    }

    if (category === "QUESTION") {
      return { priority: "HIGH", playSound: true }
    }

    return { priority: "MEDIUM", playSound: false }
  }

  /**
   * Convert RealtimeNotification array to unified format
   */
  private convertRealtimeToUnified(
    notifications: any[]
  ): UnifiedNotification[] {
    return notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      priority: n.priority,
      entityType: n.entityType,
      entityId: n.entityId,
      playSound: n.playSound,
      createdAt: n.createdAt,
      source: "realtime" as const,
    }))
  }

  /**
   * Convert standard Notification array to unified format
   */
  private convertStandardToUnified(
    notifications: any[]
  ): UnifiedNotification[] {
    return notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      priority: "MEDIUM", // Standard notifications don't have priority
      entityType: n.entityType,
      entityId: n.entityId,
      playSound: false,
      createdAt: n.createdAt,
      source: "standard" as const,
    }))
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const realtimeInbox = new RealtimeInboxManager()