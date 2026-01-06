// import { db } from "@/lib/db"
// import { logger } from "@/lib/logger"

// type NotificationType =
//   | "HEALTH_CRITICAL"
//   | "HEALTH_WARNING"
//   | "HEALTH_RECOVERED"
//   | "STAGE_ADVANCED"
//   | "READY_TO_SEND"
//   | "PEER_NETWORK_JOINED"
//   | "WARMUP_COMPLETE"

// interface WarmupNotification {
//   accountId: string
//   type: NotificationType
//   title: string
//   message: string
//   severity: "info" | "warning" | "critical" | "success"
// }

// /**
//  * WARMUP NOTIFICATION SERVICE
//  * Sends real-time alerts about warmup progress and issues
//  */
// export class WarmupNotificationService {
//   /**
//    * Create and store notification
//    */
//   async createNotification(notification: WarmupNotification): Promise<void> {
//     const account = await db.sendingAccount.findUnique({
//       where: { id: notification.accountId },
//       include: { user: true },
//     })

//     if (!account) return

//     // Store notification in database
//     await db.notification.create({
//       data: {
//         userId: account.userId,
//         type: notification.type,
//         title: notification.title,
//         message: notification.message,
//         severity: notification.severity,
//         relatedAccountId: notification.accountId,
//         isRead: false,
//       },
//     })

//     logger.info(`Notification created for ${account.email}: ${notification.title}`)

//     // TODO: Send to frontend via WebSocket/SSE for real-time updates
//     // TODO: Send email notification for critical issues
//     // TODO: Send Slack notification if integration configured
//   }

//   /**
//    * Check health and create alerts if needed
//    */
//   async checkHealthAlerts(accountId: string, previousHealth: number, currentHealth: number): Promise<void> {
//     if (currentHealth < 70 && previousHealth >= 70) {
//       // Dropped below critical threshold
//       await this.createNotification({
//         accountId,
//         type: "HEALTH_CRITICAL",
//         title: "Critical: Warmup Health Dropped",
//         message: `Health score dropped to ${currentHealth}. Cold sending has been paused. Continue warming for 5-7 days.`,
//         severity: "critical",
//       })
//     } else if (currentHealth < 85 && previousHealth >= 85) {
//       // Dropped below warning threshold
//       await this.createNotification({
//         accountId,
//         type: "HEALTH_WARNING",
//         title: "Warning: Warmup Health Declining",
//         message: `Health score is ${currentHealth}. Monitor closely and continue warming to improve deliverability.`,
//         severity: "warning",
//       })
//     } else if (currentHealth >= 90 && previousHealth < 90) {
//       // Ready to send!
//       await this.createNotification({
//         accountId,
//         type: "READY_TO_SEND",
//         title: "Ready to Send Cold Emails!",
//         message: `Congratulations! Your account has reached ${currentHealth} health score. You can now safely start cold email campaigns.`,
//         severity: "success",
//       })
//     }
//   }

//   /**
//    * Notify when account advances to new warmup stage
//    */
//   async notifyStageAdvancement(accountId: string, newStage: string, benefits: string[]): Promise<void> {
//     await this.createNotification({
//       accountId,
//       type: "STAGE_ADVANCED",
//       title: `Advanced to ${newStage} Stage`,
//       message: `Your account has progressed! Benefits: ${benefits.join(", ")}`,
//       severity: "success",
//     })
//   }

//   /**
//    * Notify when P2P network access is granted
//    */
//   async notifyPeerNetworkJoined(accountId: string, poolTier: string): Promise<void> {
//     await this.createNotification({
//       accountId,
//       type: "PEER_NETWORK_JOINED",
//       title: "Joined P2P Warmup Network",
//       message: `You now have access to the ${poolTier} peer warmup pool for accelerated reputation building.`,
//       severity: "info",
//     })
//   }
// }

// export const warmupNotificationService = new WarmupNotificationService()
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"
import type { NotificationType } from "@prisma/client"
import { resend } from "@/lib/resend"

type WarmupNotification = {
  accountId: string
  type: string
  title: string
  message: string
  severity: "info" | "warning" | "critical" | "success"
}

/**
 * WARMUP NOTIFICATION SERVICE
 * Sends real-time alerts about warmup progress and issues
 */
export class WarmupNotificationService {
  /**
   * Create and store notification
   */
  async createNotification(notification: WarmupNotification): Promise<void> {
    const account = await db.sendingAccount.findUnique({
      where: { id: notification.accountId },
      include: { user: true },
    })

    if (!account) return

    // Store notification in database
    await db.notification.create({
      data: {
        userId: account.userId,
        type: notification.type as NotificationType,
        title: notification.title,
        message: notification.message,
        // severity: notification.severity, // Will be enabled after DB migration
        relatedAccountId: notification.accountId,
        isRead: false,
      },
    })

    logger.info("Notification created", { email: account.email, title: notification.title })

    await db.realtimeNotification.create({
      data: {
        userId: account.userId,
        type: notification.type as any,
        title: notification.title,
        message: notification.message,
        priority:
          notification.severity === "critical" ? "URGENT" : notification.severity === "warning" ? "HIGH" : "MEDIUM",
        entityType: "warmup_account",
        entityId: notification.accountId,
        playSound: notification.severity === "critical" || notification.severity === "success",
      },
    })

    if (notification.severity === "critical" || notification.severity === "success") {
      try {
        await resend.send({
          from: process.env.RESEND_FROM_EMAIL!,
          to: account.user.email,
          subject: `Warmup Alert: ${notification.title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: ${notification.severity === "critical" ? "#dc2626" : "#16a34a"};">
                ${notification.title}
              </h2>
              <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                ${notification.message}
              </p>
              <div style="margin-top: 24px; padding: 16px; background: #f3f4f6; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                  <strong>Account:</strong> ${account.email}<br>
                  <strong>Health Score:</strong> ${account.healthScore}/100
                </p>
              </div>
              <div style="margin-top: 24px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/warmup" 
                   style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  View Warmup Dashboard
                </a>
              </div>
            </div>
          `,
        })
        logger.info("Email notification sent", { userId: account.userId, type: notification.type })
      } catch (error) {
        logger.error("Failed to send email notification", error as Error, { userId: account.userId })
      }
    }

    if (notification.severity === "critical" && process.env.SLACK_WEBHOOK_URL) {
      try {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `:rotating_light: *Warmup Critical Alert*`,
            blocks: [
              {
                type: "header",
                text: {
                  type: "plain_text",
                  text: notification.title,
                },
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: notification.message,
                },
              },
              {
                type: "section",
                fields: [
                  {
                    type: "mrkdwn",
                    text: `*Account:*\n${account.email}`,
                  },
                  {
                    type: "mrkdwn",
                    text: `*Health Score:*\n${account.healthScore}/100`,
                  },
                ],
              },
            ],
          }),
        })
        logger.info("Slack notification sent", { accountId: notification.accountId })
      } catch (error) {
        logger.error("Failed to send Slack notification", error as Error)
      }
    }
  }

  /**
   * Check health and create alerts if needed
   */
  async checkHealthAlerts(accountId: string, previousHealth: number, currentHealth: number): Promise<void> {
    if (currentHealth < 70 && previousHealth >= 70) {
      // Dropped below critical threshold
      await this.createNotification({
        accountId,
        type: "HEALTH_CRITICAL",
        title: "Critical: Warmup Health Dropped",
        message: `Health score dropped to ${currentHealth}. Cold sending has been paused. Continue warming for 5-7 days.`,
        severity: "critical",
      })
    } else if (currentHealth < 85 && previousHealth >= 85) {
      // Dropped below warning threshold
      await this.createNotification({
        accountId,
        type: "HEALTH_WARNING",
        title: "Warning: Warmup Health Declining",
        message: `Health score is ${currentHealth}. Monitor closely and continue warming to improve deliverability.`,
        severity: "warning",
      })
    } else if (currentHealth >= 90 && previousHealth < 90) {
      // Ready to send!
      await this.createNotification({
        accountId,
        type: "READY_TO_SEND",
        title: "Ready to Send Cold Emails!",
        message: `Congratulations! Your account has reached ${currentHealth} health score. You can now safely start cold email campaigns.`,
        severity: "success",
      })
    }
  }

  /**
   * Notify when account advances to new warmup stage
   */
  async notifyStageAdvancement(accountId: string, newStage: string, benefits: string[]): Promise<void> {
    await this.createNotification({
      accountId,
      type: "STAGE_ADVANCED",
      title: `Advanced to ${newStage} Stage`,
      message: `Your account has progressed! Benefits: ${benefits.join(", ")}`,
      severity: "success",
    })
  }

  /**
   * Notify when P2P network access is granted
   */
  async notifyPeerNetworkJoined(accountId: string, poolTier: string): Promise<void> {
    await this.createNotification({
      accountId,
      type: "PEER_NETWORK_JOINED",
      title: "Joined P2P Warmup Network",
      message: `You now have access to the ${poolTier} peer warmup pool for accelerated reputation building.`,
      severity: "info",
    })
  }
}

export const warmupNotificationService = new WarmupNotificationService()
