

"use server"

import { db } from "@/lib/db"

/**
 * Campaign Performance Monitor
 * Automatically pauses campaigns with poor performance to protect sender reputation
 */

interface PerformanceThresholds {
  bounceRate: number // Pause if > 5%
  spamComplaintRate: number // Pause if > 0.1%
  unsubscribeRate: number // Pause if > 2%
  lowEngagement: number // Pause if open rate < 10% after 50+ sends
}

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  bounceRate: 5,
  spamComplaintRate: 0.1,
  unsubscribeRate: 2,
  lowEngagement: 10,
}

export class CampaignPerformanceMonitor {
  /**
   * Check campaign performance and auto-pause if needed
   */
  async checkCampaignPerformance(campaignId: string): Promise<{
    shouldPause: boolean
    reason?: string
    metrics: any
  }> {
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
      include: {
        prospects: {
          include: {
            emailLogs: {
              include: {
                bounces: true,
              },
            },
          },
        },
      },
    })

    if (!campaign || campaign.status !== "ACTIVE") {
      return { shouldPause: false, metrics: {} }
    }

    // Calculate metrics
    const totalSent = campaign.emailsSent
    const totalBounced = campaign.emailsBounced
    const totalOpened = campaign.emailsOpened
    const totalUnsubscribed = campaign.prospects.filter((p) => p.unsubscribed).length

    // Count spam complaints from bounces
    const spamComplaints = await db.emailBounce.count({
      where: {
        emailLog: {
          prospect: {
            campaignId,
          },
        },
        bounceType: "COMPLAINT",
      },
    })

    if (totalSent < 10) {
      // Need minimum sends to make decisions
      return { shouldPause: false, metrics: {} }
    }

    const bounceRate = (totalBounced / totalSent) * 100
    const spamComplaintRate = (spamComplaints / totalSent) * 100
    const unsubscribeRate = (totalUnsubscribed / totalSent) * 100
    const openRate = (totalOpened / totalSent) * 100

    const metrics = {
      totalSent,
      totalBounced,
      totalOpened,
      totalUnsubscribed,
      spamComplaints,
      bounceRate,
      spamComplaintRate,
      unsubscribeRate,
      openRate,
    }

    // Check thresholds
    if (bounceRate > DEFAULT_THRESHOLDS.bounceRate) {
      await this.pauseCampaign(campaignId, `High bounce rate: ${bounceRate.toFixed(2)}%`)
      return {
        shouldPause: true,
        reason: `High bounce rate (${bounceRate.toFixed(2)}%). Paused to protect sender reputation.`,
        metrics,
      }
    }

    if (spamComplaintRate > DEFAULT_THRESHOLDS.spamComplaintRate) {
      await this.pauseCampaign(campaignId, `High spam complaint rate: ${spamComplaintRate.toFixed(2)}%`)
      return {
        shouldPause: true,
        reason: `High spam complaint rate (${spamComplaintRate.toFixed(2)}%). Campaign paused immediately.`,
        metrics,
      }
    }

    if (unsubscribeRate > DEFAULT_THRESHOLDS.unsubscribeRate) {
      await this.pauseCampaign(campaignId, `High unsubscribe rate: ${unsubscribeRate.toFixed(2)}%`)
      return {
        shouldPause: true,
        reason: `High unsubscribe rate (${unsubscribeRate.toFixed(2)}%). Content may need improvement.`,
        metrics,
      }
    }

    if (totalSent >= 50 && openRate < DEFAULT_THRESHOLDS.lowEngagement) {
      await this.pauseCampaign(campaignId, `Low engagement: ${openRate.toFixed(2)}% open rate`)
      return {
        shouldPause: true,
        reason: `Low engagement (${openRate.toFixed(2)}% opens). Consider improving subject lines and content.`,
        metrics,
      }
    }

    return { shouldPause: false, metrics }
  }

  /**
   * Pause campaign and notify user
   */
  private async pauseCampaign(campaignId: string, reason: string) {
    await db.campaign.update({
      where: { id: campaignId },
      data: {
        status: "PAUSED",
      },
    })

    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
      select: { userId: true, name: true },
    })

    if (campaign) {
      await db.realtimeNotification.create({
        data: {
          userId: campaign.userId,
          type: "CAMPAIGN_PAUSED",
          title: `Campaign "${campaign.name}" auto-paused`,
          message: reason,
          priority: "HIGH",
          entityType: "campaign",
          entityId: campaignId,
          playSound: true,
        },
      })
    }

    console.log(`[v0] Campaign ${campaignId} auto-paused: ${reason}`)
  }

  /**
   * Check sending account health and pause if needed
   */
  async checkAccountHealth(accountId: string): Promise<{
    shouldPause: boolean
    reason?: string
    healthScore: number
  }> {
    const account = await db.sendingAccount.findUnique({
      where: { id: accountId },
      include: {
        bounces: {
          where: {
            bouncedAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        },
        emailLogs: {
          where: {
            sentAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    })

    if (!account) {
      return { shouldPause: false, healthScore: 0 }
    }

    const totalSent = account.emailLogs.length
    const totalBounces = account.bounces.length
    const spamComplaints = account.bounces.filter((b) => b.bounceType === "COMPLAINT").length

    if (totalSent === 0) {
      return { shouldPause: false, healthScore: 100 }
    }

    const bounceRate = (totalBounces / totalSent) * 100
    const spamComplaintRate = (spamComplaints / totalSent) * 100

    // Calculate health score (0-100)
    let healthScore = 100
    healthScore -= bounceRate * 5 // Each 1% bounce = -5 points
    healthScore -= spamComplaintRate * 50 // Each 0.1% spam = -5 points
    healthScore = Math.max(0, Math.min(100, healthScore))

    // Update account health
    await db.sendingAccount.update({
      where: { id: accountId },
      data: {
        healthScore: Math.round(healthScore),
        bounceRate: Number.parseFloat(bounceRate.toFixed(2)),
        spamComplaintRate: Number.parseFloat(spamComplaintRate.toFixed(2)),
        lastHealthCheck: new Date(),
      },
    })

    // Pause if health is critical
    if (healthScore < 50) {
      console.log(`[v0] Sending account paused due to low health score`, {
        accountId,
        healthScore,
        bounceRate,
        spamComplaintRate,
      })

      await db.sendingAccount.update({
        where: { id: accountId },
        data: {
          isActive: false,
          pausedReason: `Low health score: ${healthScore.toFixed(0)}/100`,
          pausedAt: new Date(),
        },
      })

      return {
        shouldPause: true,
        reason: `Account health critical (${healthScore.toFixed(0)}/100). Paused to prevent further damage.`,
        healthScore,
      }
    }

    return { shouldPause: false, healthScore }
  }
}

export const campaignPerformanceMonitor = new CampaignPerformanceMonitor()
