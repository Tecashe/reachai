import { db } from "../db"
import { logger } from "../logger"
import { resend } from "../resend"
import { render } from "@react-email/render"
import ReplyNotificationEmail from "../email-templates/reply-notification"
import DailySummaryEmail from "../email-templates/daily-summary"

interface ReplyNotificationData {
  userId: string
  prospectEmail: string
  prospectName: string
  campaignName: string
  replySubject: string
  replyPreview: string
  sentiment: string
  category: string
  replyUrl: string
}

interface DailySummaryData {
  totalReplies: number
  positiveReplies: number
  emailsSent: number
  openRate: number
  replyRate: number
  topCampaigns: Array<{
    name: string
    replies: number
    sent: number
  }>
  recentReplies: Array<{
    prospectName: string
    campaignName: string
    sentiment: string
    preview: string
  }>
}

class EmailNotificationService {
  async sendReplyNotification(data: ReplyNotificationData): Promise<void> {
    try {
      // Get user email
      const user = await db.user.findUnique({
        where: { id: data.userId },
        select: { email: true, name: true },
      })

      if (!user?.email) {
        logger.error("User not found for reply notification", undefined, { userId: data.userId })
        return
      }

      const emailHtml = await render(
        <ReplyNotificationEmail
          userName={user.name || user.email}
          prospectName={data.prospectName}
          prospectEmail={data.prospectEmail}
          campaignName={data.campaignName}
          replySubject={data.replySubject}
          replyPreview={data.replyPreview}
          sentiment={data.sentiment}
          category={data.category}
          replyUrl={data.replyUrl}
        />,
      )

      await resend.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: user.email,
        subject: `New Reply: ${data.prospectName} replied to ${data.campaignName}`,
        html: emailHtml,
      })

      logger.info("Reply notification sent", {
        userId: data.userId,
        prospectEmail: data.prospectEmail,
      })
    } catch (error) {
      logger.error("Failed to send reply notification", error as Error, {
        userId: data.userId,
      })
    }
  }

  async sendDailySummary(userId: string): Promise<void> {
    try {
      // Get user
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      })

      if (!user?.email) {
        logger.error("User not found for daily summary", undefined, { userId })
        return
      }

      // Get yesterday's date range
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const [replies, emailsSent, campaigns] = await Promise.all([
        db.emailReply.findMany({
          where: {
            campaign: { userId },
            repliedAt: {
              gte: yesterday,
              lt: today,
            },
          },
          include: {
            prospect: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            campaign: {
              select: {
                name: true,
              },
            },
          },
          orderBy: { repliedAt: "desc" },
          take: 5,
        }),
        db.emailLog.count({
          where: {
            prospect: {
              userId,
            },
            sentAt: {
              gte: yesterday,
              lt: today,
            },
          },
        }),
        db.campaign.findMany({
          where: {
            userId,
            updatedAt: {
              gte: yesterday,
            },
          },
          select: {
            id: true,
            name: true,
            emailsSent: true,
            emailsReplied: true,
          },
          orderBy: { emailsReplied: "desc" },
          take: 3,
        }),
      ])

      const positiveReplies = replies.filter((r) => r.sentiment === "POSITIVE").length
      const openRate = emailsSent > 0 ? Math.round((replies.length / emailsSent) * 100) : 0
      const replyRate = emailsSent > 0 ? Math.round((replies.length / emailsSent) * 100) : 0

      const data: DailySummaryData = {
        totalReplies: replies.length,
        positiveReplies,
        emailsSent,
        openRate,
        replyRate,
        topCampaigns: campaigns.map((c) => ({
          name: c.name,
          replies: c.emailsReplied,
          sent: c.emailsSent,
        })),
        recentReplies: replies.map((r) => ({
          prospectName: `${r.prospect.firstName || ""} ${r.prospect.lastName || ""}`.trim() || r.prospect.email,
          campaignName: r.campaign?.name || "Unknown Campaign",
          sentiment: r.sentiment || "NEUTRAL",
          preview: r.body.substring(0, 100) + (r.body.length > 100 ? "..." : ""),
        })),
      }

      const emailHtml = await render(
        <DailySummaryEmail
          userName={user.name || user.email}
          date={yesterday.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {...data}
        />,
      )

      await resend.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: user.email,
        subject: `Your Daily Summary - ${replies.length} new replies`,
        html: emailHtml,
      })

      logger.info("Daily summary sent", { userId, totalReplies: replies.length })
    } catch (error) {
      logger.error("Failed to send daily summary", error as Error, { userId })
    }
  }
}

export const emailNotificationService = new EmailNotificationService()
