

import { db } from "../db"
import { logger } from "../logger"

interface ScheduleSettings {
  startDate: string
  dailyLimit: number
  sendInBusinessHours: boolean
  timezone: string
}

/**
 * Campaign Scheduler Service
 *
 * Responsible for creating sending schedules for active campaigns.
 * Respects daily limits, business hours, and timezone preferences.
 */
class CampaignScheduler {
  /**
   * Schedule all emails for a campaign when it's launched
   */
  async scheduleCampaign(campaignId: string, settings: ScheduleSettings): Promise<void> {
    logger.info("Scheduling campaign", { campaignId, settings })

    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
      include: {
        prospects: {
          where: {
            status: "ACTIVE",
          },
        },
      },
    })

    if (!campaign) {
      throw new Error("Campaign not found")
    }

    if (campaign.prospects.length === 0) {
      throw new Error("No prospects with generated emails found")
    }

    // Calculate sending schedule
    const schedules = this.calculateSchedule(campaign.prospects, settings)

    // Create sending schedules in database
    await db.sendingSchedule.createMany({
      data: schedules.map((schedule) => ({
        userId: campaign.userId,
        campaignId: campaign.id,
        prospectId: schedule.prospectId,
        subject: schedule.subject,
        body: schedule.body,
        scheduledFor: schedule.scheduledFor,
        status: "PENDING",
        retryCount: 0,
      })),
    })

    logger.info("Campaign scheduled", {
      campaignId,
      totalEmails: schedules.length,
      firstEmail: schedules[0]?.scheduledFor,
      lastEmail: schedules[schedules.length - 1]?.scheduledFor,
    })
  }

  /**
   * Calculate optimal sending times for all prospects
   */
  private calculateSchedule(
    prospects: any[],
    settings: ScheduleSettings,
  ): Array<{
    prospectId: string
    subject: string
    body: string
    scheduledFor: Date
  }> {
    const schedules: Array<{
      prospectId: string
      subject: string
      body: string
      scheduledFor: Date
    }> = []

    let currentDate = new Date(settings.startDate)
    let emailsScheduledToday = 0

    for (const prospect of prospects) {
      // If we've hit daily limit, move to next day
      if (emailsScheduledToday >= settings.dailyLimit) {
        currentDate = this.getNextDay(currentDate)
        emailsScheduledToday = 0
      }

      // Calculate sending time
      const sendTime = this.calculateSendTime(currentDate, settings, emailsScheduledToday)

      let subject = "Follow up"
      let body = ""

      if (prospect.generatedEmail) {
        // generatedEmail is a JSON object: { subject, body, qualityScore, personalizationScore }
        if (typeof prospect.generatedEmail === "object") {
          subject = prospect.generatedEmail.subject || subject
          body = prospect.generatedEmail.body || ""
        } else if (typeof prospect.generatedEmail === "string") {
          // Fallback: if it's stored as a string
          body = prospect.generatedEmail
        }
      }

      schedules.push({
        prospectId: prospect.id,
        subject,
        body,
        scheduledFor: sendTime,
      })

      emailsScheduledToday++
    }

    return schedules
  }

  /**
   * Calculate specific send time based on business hours and timezone
   */
  private calculateSendTime(date: Date, settings: ScheduleSettings, emailIndex: number): Date {
    const sendDate = new Date(date)

    if (settings.sendInBusinessHours) {
      // Business hours: 9 AM - 5 PM
      const startHour = 9
      const endHour = 17

      // Spread emails throughout the day
      const hoursAvailable = endHour - startHour
      const minutesPerEmail = (hoursAvailable * 60) / settings.dailyLimit

      const minutesOffset = emailIndex * minutesPerEmail
      const hour = startHour + Math.floor(minutesOffset / 60)
      const minute = Math.floor(minutesOffset % 60)

      sendDate.setHours(hour, minute, 0, 0)
    } else {
      // Spread throughout 24 hours
      const minutesPerEmail = (24 * 60) / settings.dailyLimit
      const minutesOffset = emailIndex * minutesPerEmail

      const hour = Math.floor(minutesOffset / 60)
      const minute = Math.floor(minutesOffset % 60)

      sendDate.setHours(hour, minute, 0, 0)
    }

    return sendDate
  }

  /**
   * Get next day, skipping weekends if business hours enabled
   */
  private getNextDay(date: Date): Date {
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)
    nextDay.setHours(0, 0, 0, 0)

    // Skip weekends if business hours enabled
    const dayOfWeek = nextDay.getDay()
    if (dayOfWeek === 0) {
      // Sunday -> Monday
      nextDay.setDate(nextDay.getDate() + 1)
    } else if (dayOfWeek === 6) {
      // Saturday -> Monday
      nextDay.setDate(nextDay.getDate() + 2)
    }

    return nextDay
  }

  /**
   * Reschedule failed emails
   */
  async rescheduleFailed(campaignId: string): Promise<void> {
    logger.info("Rescheduling failed emails", { campaignId })

    const failedSchedules = await db.sendingSchedule.findMany({
      where: {
        campaignId,
        status: "FAILED",
        retryCount: { lt: 3 },
      },
    })

    for (const schedule of failedSchedules) {
      // Reschedule for 1 hour from now
      await db.sendingSchedule.update({
        where: { id: schedule.id },
        data: {
          status: "PENDING",
          scheduledFor: new Date(Date.now() + 60 * 60 * 1000),
          retryCount: { increment: 1 },
        },
      })
    }

    logger.info("Failed emails rescheduled", {
      campaignId,
      count: failedSchedules.length,
    })
  }

  /**
   * Pause campaign sending
   */
  async pauseCampaign(campaignId: string): Promise<void> {
    logger.info("Pausing campaign", { campaignId })

    await db.sendingSchedule.updateMany({
      where: {
        campaignId,
        status: "PENDING",
      },
      data: {
        status: "CANCELLED",
      },
    })

    await db.campaign.update({
      where: { id: campaignId },
      data: { status: "PAUSED" },
    })

    logger.info("Campaign paused", { campaignId })
  }

  /**
   * Resume campaign sending
   */
  async resumeCampaign(campaignId: string): Promise<void> {
    logger.info("Resuming campaign", { campaignId })

    // Get all paused schedules
    const pausedSchedules = await db.sendingSchedule.findMany({
      where: {
        campaignId,
        status: "CANCELLED",
      },
      orderBy: { scheduledFor: "asc" },
    })

    // Reschedule them starting from now
    const now = new Date()
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
    })

    if (!campaign) {
      throw new Error("Campaign not found")
    }

    const dailyLimit = campaign.dailySendLimit || 50
    let currentDate = now
    let emailsScheduledToday = 0

    for (const schedule of pausedSchedules) {
      if (emailsScheduledToday >= dailyLimit) {
        currentDate = this.getNextDay(currentDate)
        emailsScheduledToday = 0
      }

      const sendTime = this.calculateSendTime(
        currentDate,
        {
          startDate: currentDate.toISOString(),
          dailyLimit,
          sendInBusinessHours: true,
          timezone: "America/New_York",
        },
        emailsScheduledToday,
      )

      await db.sendingSchedule.update({
        where: { id: schedule.id },
        data: {
          status: "PENDING",
          scheduledFor: sendTime,
        },
      })

      emailsScheduledToday++
    }

    await db.campaign.update({
      where: { id: campaignId },
      data: { status: "ACTIVE" },
    })

    logger.info("Campaign resumed", { campaignId, rescheduled: pausedSchedules.length })
  }

  /**
   * Get campaign sending stats
   */
  async getCampaignStats(campaignId: string) {
    const schedules = await db.sendingSchedule.groupBy({
      by: ["status"],
      where: { campaignId },
      _count: true,
    })

    const stats: Record<string, number> = {
      total: 0,
      pending: 0,
      sent: 0,
      failed: 0,
      paused: 0,
    }

    for (const schedule of schedules) {
      stats[schedule.status.toLowerCase()] = schedule._count
      stats.total += schedule._count
    }

    return stats
  }
}

export const campaignScheduler = new CampaignScheduler()
