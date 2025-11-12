import { db } from "../db"
import { logger } from "../logger"

class RealtimeInboxManager {
  /**
   * Create notification for new reply
   */
  async notifyNewReply(replyId: string): Promise<void> {
    const reply = await db.emailReply.findUnique({
      where: { id: replyId },
      include: {
        prospect: true,
        campaign: true,
      },
    })

    if (!reply) return

    // Determine priority based on sentiment and category
    let priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" = "MEDIUM"
    let playSound = false

    if (reply.sentiment === "POSITIVE" || reply.category === "INTERESTED") {
      priority = "URGENT"
      playSound = true
    } else if (reply.category === "QUESTION") {
      priority = "HIGH"
      playSound = true
    }

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
   * Get pending notifications for user
   */
  async getPendingNotifications(userId: string) {
    return db.realtimeNotification.findMany({
      where: {
        userId,
        delivered: false,
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: 50,
    })
  }

  /**
   * Mark notifications as delivered
   */
  async markAsDelivered(notificationIds: string[]): Promise<void> {
    await db.realtimeNotification.updateMany({
      where: { id: { in: notificationIds } },
      data: {
        delivered: true,
        deliveredAt: new Date(),
      },
    })
  }

  /**
   * Poll for new notifications (for clients without WebSocket)
   */
  async pollNotifications(userId: string, lastChecked: Date) {
    return db.realtimeNotification.findMany({
      where: {
        userId,
        createdAt: { gt: lastChecked },
      },
      orderBy: { createdAt: "desc" },
    })
  }
}

export const realtimeInbox = new RealtimeInboxManager()
