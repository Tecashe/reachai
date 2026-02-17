import { db } from "../db"
import { logger } from "../logger"
import { generateObject } from "ai"
import { fastModel } from "@/lib/ai-provider"
import { z } from "zod"

const predictiveSchema = z.object({
  predictedOpenRate: z.number(),
  predictedReplyRate: z.number(),
  predictedConversionRate: z.number(),
  confidenceScore: z.number(),
  keyFactors: z.array(z.string()),
  recommendations: z.array(z.string()),
})

interface CampaignMetrics {
  campaignId: string
  totalProspects: number
  emailsSent: number
  delivered: number
  opened: number
  clicked: number
  replied: number
  bounced: number
  deliveryRate: number
  openRate: number
  clickRate: number
  replyRate: number
  bounceRate: number
  avgTimeToOpen: number
  avgTimeToReply: number
  bestSendTime: string
  topPerformingSubject: string
}

interface CohortAnalysis {
  cohortName: string
  size: number
  openRate: number
  replyRate: number
  conversionRate: number
  avgDealValue: number
  totalRevenue: number
}

class AdvancedAnalytics {
  async getCampaignMetrics(campaignId: string): Promise<CampaignMetrics> {
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
      include: {
        prospects: {
          include: {
            emailLogs: true,
          },
        },
      },
    })

    if (!campaign) {
      throw new Error("Campaign not found")
    }

    const allEmailLogs = campaign.prospects.flatMap((p) => p.emailLogs)

    const totalProspects = campaign.prospects.length
    const emailsSent = allEmailLogs.filter((log) => log.sentAt).length
    const delivered = allEmailLogs.filter((log) => log.deliveredAt).length
    const opened = allEmailLogs.filter((log) => log.openedAt).length
    const clicked = allEmailLogs.filter((log) => log.clickedAt).length
    const replied = allEmailLogs.filter((log) => log.repliedAt).length
    const bounced = allEmailLogs.filter((log) => log.bouncedAt).length

    // Calculate rates
    const deliveryRate = emailsSent > 0 ? (delivered / emailsSent) * 100 : 0
    const openRate = delivered > 0 ? (opened / delivered) * 100 : 0
    const clickRate = opened > 0 ? (clicked / opened) * 100 : 0
    const replyRate = delivered > 0 ? (replied / delivered) * 100 : 0
    const bounceRate = emailsSent > 0 ? (bounced / emailsSent) * 100 : 0

    // Calculate average time to open
    const openTimes = allEmailLogs
      .filter((log) => log.sentAt && log.openedAt)
      .map((log) => log.openedAt!.getTime() - log.sentAt!.getTime())

    const avgTimeToOpen =
      openTimes.length > 0 ? openTimes.reduce((a, b) => a + b, 0) / openTimes.length / (1000 * 60 * 60) : 0

    // Calculate average time to reply
    const replyTimes = allEmailLogs
      .filter((log) => log.sentAt && log.repliedAt)
      .map((log) => log.repliedAt!.getTime() - log.sentAt!.getTime())

    const avgTimeToReply =
      replyTimes.length > 0 ? replyTimes.reduce((a, b) => a + b, 0) / replyTimes.length / (1000 * 60 * 60) : 0

    // Find best send time
    const sendTimePerformance = new Map<number, { sent: number; opened: number }>()

    allEmailLogs.forEach((log) => {
      if (log.sentAt) {
        const hour = log.sentAt.getHours()
        const current = sendTimePerformance.get(hour) || { sent: 0, opened: 0 }
        current.sent++
        if (log.openedAt) current.opened++
        sendTimePerformance.set(hour, current)
      }
    })

    let bestHour = 9
    let bestOpenRate = 0

    sendTimePerformance.forEach((stats, hour) => {
      const rate = stats.sent > 0 ? (stats.opened / stats.sent) * 100 : 0
      if (rate > bestOpenRate) {
        bestOpenRate = rate
        bestHour = hour
      }
    })

    const bestSendTime = `${bestHour}:00 - ${bestHour + 1}:00`

    // Find top performing subject
    const subjectPerformance = new Map<string, { sent: number; opened: number }>()

    allEmailLogs.forEach((log) => {
      const current = subjectPerformance.get(log.subject) || { sent: 0, opened: 0 }
      current.sent++
      if (log.openedAt) current.opened++
      subjectPerformance.set(log.subject, current)
    })

    let topSubject = ""
    let topOpenRate = 0

    subjectPerformance.forEach((stats, subject) => {
      const rate = stats.sent > 0 ? (stats.opened / stats.sent) * 100 : 0
      if (rate > topOpenRate && stats.sent >= 5) {
        // Minimum 5 sends for statistical significance
        topOpenRate = rate
        topSubject = subject
      }
    })

    return {
      campaignId,
      totalProspects,
      emailsSent,
      delivered,
      opened,
      clicked,
      replied,
      bounced,
      deliveryRate: Math.round(deliveryRate * 10) / 10,
      openRate: Math.round(openRate * 10) / 10,
      clickRate: Math.round(clickRate * 10) / 10,
      replyRate: Math.round(replyRate * 10) / 10,
      bounceRate: Math.round(bounceRate * 10) / 10,
      avgTimeToOpen: Math.round(avgTimeToOpen * 10) / 10,
      avgTimeToReply: Math.round(avgTimeToReply * 10) / 10,
      bestSendTime,
      topPerformingSubject: topSubject || "N/A",
    }
  }

  async predictCampaignPerformance(campaignId: string): Promise<any> {
    try {
      const metrics = await this.getCampaignMetrics(campaignId)

      const campaign = await db.campaign.findUnique({
        where: { id: campaignId },
        include: {
          prospects: {
            take: 10,
            include: {
              emailLogs: {
                take: 1,
                orderBy: { sentAt: "desc" },
              },
            },
          },
          emailSequences: {
            include: {
              template: true,
            },
          },
        },
      })

      const { object: prediction } = await generateObject({
        model: fastModel,
        schema: predictiveSchema,
        prompt: `You are a data scientist analyzing cold email campaign performance. Predict future performance based on current data.

Current Campaign Metrics:
- Total Prospects: ${metrics.totalProspects}
- Emails Sent: ${metrics.emailsSent}
- Open Rate: ${metrics.openRate}%
- Reply Rate: ${metrics.replyRate}%
- Bounce Rate: ${metrics.bounceRate}%
- Avg Time to Open: ${metrics.avgTimeToOpen} hours
- Best Send Time: ${metrics.bestSendTime}

Campaign Details:
- Research Depth: ${campaign?.researchDepth}
- Personalization Level: ${campaign?.personalizationLevel}
- Tone: ${campaign?.toneOfVoice}
- Sequence Steps: ${campaign?.emailSequences.length}

Based on this data, predict:
1. Expected open rate for remaining prospects (0-100)
2. Expected reply rate for remaining prospects (0-100)
3. Expected conversion rate (0-100)
4. Confidence score in predictions (0-100)
5. Key factors affecting performance
6. Actionable recommendations to improve results

Be realistic and data-driven in your predictions.`,
      })

      logger.info("Campaign performance predicted", { campaignId, prediction })

      return prediction
    } catch (error) {
      logger.error("Failed to predict campaign performance", error as Error, { campaignId })
      throw error
    }
  }

  async analyzeCohorts(userId: string): Promise<CohortAnalysis[]> {
    // Group prospects by industry, company size, job title, etc.
    const prospects = await db.prospect.findMany({
      where: { userId },
      include: {
        emailLogs: true,
      },
    })

    const cohorts = new Map<string, any[]>()

    // Group by industry
    prospects.forEach((prospect) => {
      const cohortKey = prospect.industry || "Unknown Industry"
      if (!cohorts.has(cohortKey)) {
        cohorts.set(cohortKey, [])
      }
      cohorts.get(cohortKey)!.push(prospect)
    })

    const cohortAnalyses: CohortAnalysis[] = []

    cohorts.forEach((prospects, cohortName) => {
      const size = prospects.length
      const totalOpened = prospects.filter((p) => p.emailsOpened > 0).length
      const totalReplied = prospects.filter((p) => p.emailsReplied > 0).length

      const openRate = size > 0 ? (totalOpened / size) * 100 : 0
      const replyRate = size > 0 ? (totalReplied / size) * 100 : 0

      cohortAnalyses.push({
        cohortName,
        size,
        openRate: Math.round(openRate * 10) / 10,
        replyRate: Math.round(replyRate * 10) / 10,
        conversionRate: 0, // Would need deal tracking
        avgDealValue: 0, // Would need CRM integration
        totalRevenue: 0, // Would need CRM integration
      })
    })

    // Sort by size
    cohortAnalyses.sort((a, b) => b.size - a.size)

    logger.info("Cohort analysis complete", { userId, cohortCount: cohortAnalyses.length })

    return cohortAnalyses
  }

  async getCompetitiveBenchmarks(campaignId: string): Promise<any> {
    const metrics = await this.getCampaignMetrics(campaignId)

    // Industry benchmarks (based on research)
    const benchmarks = {
      coldEmail: {
        openRate: 23.9,
        replyRate: 8.5,
        bounceRate: 2.0,
      },
      yourCampaign: {
        openRate: metrics.openRate,
        replyRate: metrics.replyRate,
        bounceRate: metrics.bounceRate,
      },
      comparison: {
        openRate: metrics.openRate - 23.9,
        replyRate: metrics.replyRate - 8.5,
        bounceRate: metrics.bounceRate - 2.0,
      },
    }

    return benchmarks
  }
}

export const advancedAnalytics = new AdvancedAnalytics()
export type { CampaignMetrics, CohortAnalysis }
