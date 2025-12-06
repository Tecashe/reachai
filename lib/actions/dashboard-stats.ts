"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

// Main dashboard data fetch - all metrics in one call for performance
export async function getDashboardData() {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return getEmptyDashboardData()
    }

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Parallel queries for performance
    const [campaigns, prospects, sendingAccounts, recentEmailLogs, dailyAnalytics, thisMonthLogs, lastMonthLogs] =
      await Promise.all([
        db.campaign.findMany({
          where: { userId: user.id },
          include: {
            prospects: {
              select: {
                emailsReceived: true,
                emailsOpened: true,
                emailsClicked: true,
                emailsReplied: true,
                status: true,
                bounced: true,
                createdAt: true,
              },
            },
          },
        }),
        // All prospects with status
        db.prospect.findMany({
          where: { userId: user.id, isTrashed: false },
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        }),
        // Sending accounts health
        db.sendingAccount.findMany({
          where: { userId: user.id },
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
            healthScore: true,
            warmupStage: true,
            bounceRate: true,
            spamComplaintRate: true,
            openRate: true,
            replyRate: true,
            dailyLimit: true,
            emailsSentToday: true,
          },
        }),
        // Recent email logs for activity feed
        db.emailLog.findMany({
          where: {
            prospect: { campaign: { userId: user.id } },
          },
          include: {
            prospect: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                company: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 8,
        }),
        // Daily analytics for last 30 days
        db.analytics.findMany({
          where: {
            campaign: { userId: user.id },
            date: { gte: thirtyDaysAgo },
          },
          select: {
            date: true,
            emailsSent: true,
            emailsOpened: true,
            emailsClicked: true,
            emailsReplied: true,
            emailsBounced: true,
          },
          orderBy: { date: "asc" },
        }),
        db.emailLog.findMany({
          where: {
            prospect: { campaign: { userId: user.id } },
            createdAt: { gte: startOfThisMonth },
          },
          select: { status: true },
        }),
        db.emailLog.findMany({
          where: {
            prospect: { campaign: { userId: user.id } },
            createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
          },
          select: { status: true },
        }),
      ])

    // Campaign status distribution
    const campaignStatusCounts = { DRAFT: 0, ACTIVE: 0, PAUSED: 0, COMPLETED: 0, ARCHIVED: 0 }
    campaigns.forEach((c) => {
      campaignStatusCounts[c.status as keyof typeof campaignStatusCounts]++
    })

    // Prospect status distribution
    const prospectStatusCounts = {
      ACTIVE: 0,
      CONTACTED: 0,
      REPLIED: 0,
      BOUNCED: 0,
      UNSUBSCRIBED: 0,
      COMPLETED: 0,
    }
    prospects.forEach((p) => {
      if (p.status in prospectStatusCounts) {
        prospectStatusCounts[p.status as keyof typeof prospectStatusCounts]++
      }
    })

    let totalEmailsSent = 0
    let totalEmailsOpened = 0
    let totalEmailsClicked = 0
    let totalEmailsReplied = 0
    let totalEmailsBounced = 0
    let activeProspects = 0
    let lastMonthActiveProspects = 0

    campaigns.forEach((campaign) => {
      campaign.prospects.forEach((prospect) => {
        totalEmailsSent += prospect.emailsReceived
        totalEmailsOpened += prospect.emailsOpened
        totalEmailsClicked += prospect.emailsClicked
        totalEmailsReplied += prospect.emailsReplied
        if (prospect.bounced) totalEmailsBounced++
        if (prospect.status === "ACTIVE" || prospect.status === "CONTACTED") {
          activeProspects++
          if (prospect.createdAt < startOfThisMonth) {
            lastMonthActiveProspects++
          }
        }
      })
    })

    // Email engagement funnel
    const emailEngagement = {
      sent: totalEmailsSent,
      opened: totalEmailsOpened,
      clicked: totalEmailsClicked,
      replied: totalEmailsReplied,
      bounced: totalEmailsBounced,
    }

    // Calculate rates
    const openRate = totalEmailsSent > 0 ? (totalEmailsOpened / totalEmailsSent) * 100 : 0
    const clickRate = totalEmailsSent > 0 ? (totalEmailsClicked / totalEmailsSent) * 100 : 0
    const replyRate = totalEmailsSent > 0 ? (totalEmailsReplied / totalEmailsSent) * 100 : 0
    const bounceRate = totalEmailsSent > 0 ? (totalEmailsBounced / totalEmailsSent) * 100 : 0

    const thisMonthSent = thisMonthLogs.length
    const lastMonthSent = lastMonthLogs.length

    const calculateChange = (current: number, previous: number): number | null => {
      if (previous === 0 && current === 0) return null
      if (previous === 0) return current > 0 ? 100 : 0
      const change = ((current - previous) / previous) * 100
      return Math.max(-100, Math.min(100, change))
    }

    const emailsSentChange = calculateChange(thisMonthSent, lastMonthSent)
    const prospectsChange = calculateChange(activeProspects, lastMonthActiveProspects)

    const thisMonthOpened = thisMonthLogs.filter((l) => l.status === "OPENED").length
    const lastMonthOpened = lastMonthLogs.filter((l) => l.status === "OPENED").length
    const thisMonthOpenRate = thisMonthSent > 0 ? (thisMonthOpened / thisMonthSent) * 100 : 0
    const lastMonthOpenRate = lastMonthSent > 0 ? (lastMonthOpened / lastMonthSent) * 100 : 0
    const openRateChange = lastMonthSent > 0 ? thisMonthOpenRate - lastMonthOpenRate : null

    const thisMonthReplied = thisMonthLogs.filter((l) => l.status === "REPLIED").length
    const lastMonthReplied = lastMonthLogs.filter((l) => l.status === "REPLIED").length
    const thisMonthReplyRate = thisMonthSent > 0 ? (thisMonthReplied / thisMonthSent) * 100 : 0
    const lastMonthReplyRate = lastMonthSent > 0 ? (lastMonthReplied / lastMonthSent) * 100 : 0
    const replyRateChange = lastMonthSent > 0 ? thisMonthReplyRate - lastMonthReplyRate : null

    // Sending accounts health summary
    const activeAccounts = sendingAccounts.filter((a) => a.isActive)
    const avgHealthScore =
      activeAccounts.length > 0
        ? Math.round(activeAccounts.reduce((sum, a) => sum + a.healthScore, 0) / activeAccounts.length)
        : 0

    // Warmup stage distribution
    const warmupStages = { NEW: 0, WARMING: 0, WARM: 0, ACTIVE: 0, ESTABLISHED: 0 }
    sendingAccounts.forEach((a) => {
      if (a.warmupStage in warmupStages) {
        warmupStages[a.warmupStage as keyof typeof warmupStages]++
      }
    })

    // Aggregate daily analytics for chart
    const dailyPerformance = aggregateDailyAnalytics(dailyAnalytics)

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const sparklineData = dailyPerformance.filter((d) => new Date(d.date) >= sevenDaysAgo).map((d) => d.sent)
    // Pad to 7 days if needed
    while (sparklineData.length < 7) sparklineData.unshift(0)

    // Top campaigns by reply rate
    const topCampaigns = campaigns
      .map((c) => {
        const sent = c.prospects.reduce((sum, p) => sum + p.emailsReceived, 0)
        const replied = c.prospects.reduce((sum, p) => sum + p.emailsReplied, 0)
        const opened = c.prospects.reduce((sum, p) => sum + p.emailsOpened, 0)
        return {
          id: c.id,
          name: c.name,
          status: c.status,
          emailsSent: sent,
          replyRate: sent > 0 ? (replied / sent) * 100 : 0,
          openRate: sent > 0 ? (opened / sent) * 100 : 0,
        }
      })
      .filter((c) => c.emailsSent > 0)
      .sort((a, b) => b.replyRate - a.replyRate)
      .slice(0, 5)

    // Format activity feed
    const activityFeed = recentEmailLogs.map((log) => ({
      id: log.id,
      type: mapEmailStatusToActivityType(log.status),
      status: log.status,
      prospectName: `${log.prospect.firstName || ""} ${log.prospect.lastName || ""}`.trim() || log.prospect.email,
      prospectEmail: log.prospect.email,
      company: log.prospect.company,
      timestamp: log.createdAt,
    }))

    return {
      overview: {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter((c) => c.status === "ACTIVE").length,
        totalProspects: prospects.length,
        activeProspects,
        totalEmailsSent,
        emailCredits: user.emailCredits,
        researchCredits: user.researchCredits,
      },
      rates: {
        openRate: openRate.toFixed(1),
        clickRate: clickRate.toFixed(1),
        replyRate: replyRate.toFixed(1),
        bounceRate: bounceRate.toFixed(1),
      },
      trends: {
        emailsSentChange,
        prospectsChange,
        openRateChange,
        replyRateChange,
      },
      sparklines: {
        emailsSent: sparklineData,
      },
      charts: {
        campaignStatus: Object.entries(campaignStatusCounts).map(([status, count]) => ({
          name: status,
          value: count,
        })),
        prospectStatus: Object.entries(prospectStatusCounts).map(([status, count]) => ({
          name: status,
          value: count,
        })),
        emailEngagement: [
          { name: "Opened", value: emailEngagement.opened },
          { name: "Clicked", value: emailEngagement.clicked },
          { name: "Replied", value: emailEngagement.replied },
          { name: "Bounced", value: emailEngagement.bounced },
        ],
        dailyPerformance,
      },
      sendingAccounts: {
        total: sendingAccounts.length,
        active: activeAccounts.length,
        avgHealthScore,
        warmupStages: Object.entries(warmupStages).map(([stage, count]) => ({
          name: stage,
          value: count,
        })),
        accounts: sendingAccounts.map((a) => ({
          id: a.id,
          name: a.name,
          email: a.email,
          isActive: a.isActive,
          healthScore: a.healthScore,
          warmupStage: a.warmupStage,
          utilization: a.dailyLimit > 0 ? Math.round((a.emailsSentToday / a.dailyLimit) * 100) : 0,
        })),
      },
      topCampaigns,
      activityFeed,
    }
  } catch (error) {
    console.error("[Dashboard] Error fetching data:", error)
    return getEmptyDashboardData()
  }
}

function getEmptyDashboardData() {
  return {
    overview: {
      totalCampaigns: 0,
      activeCampaigns: 0,
      totalProspects: 0,
      activeProspects: 0,
      totalEmailsSent: 0,
      emailCredits: 0,
      researchCredits: 0,
    },
    rates: {
      openRate: "0.0",
      clickRate: "0.0",
      replyRate: "0.0",
      bounceRate: "0.0",
    },
    trends: {
      emailsSentChange: null,
      prospectsChange: null,
      openRateChange: null,
      replyRateChange: null,
    },
    sparklines: {
      emailsSent: [0, 0, 0, 0, 0, 0, 0],
    },
    charts: {
      campaignStatus: [],
      prospectStatus: [],
      emailEngagement: [],
      dailyPerformance: [],
    },
    sendingAccounts: {
      total: 0,
      active: 0,
      avgHealthScore: 0,
      warmupStages: [],
      accounts: [],
    },
    topCampaigns: [],
    activityFeed: [],
  }
}

function aggregateDailyAnalytics(analytics: any[]) {
  const grouped = new Map<string, any>()

  analytics.forEach((a) => {
    const dateKey = a.date.toISOString().split("T")[0]
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, { date: dateKey, sent: 0, opened: 0, clicked: 0, replied: 0 })
    }
    const entry = grouped.get(dateKey)!
    entry.sent += a.emailsSent
    entry.opened += a.emailsOpened
    entry.clicked += a.emailsClicked
    entry.replied += a.emailsReplied
  })

  return Array.from(grouped.values()).slice(-14)
}

function mapEmailStatusToActivityType(status: string) {
  switch (status) {
    case "DELIVERED":
    case "SENT":
      return "email_sent"
    case "OPENED":
      return "email_opened"
    case "CLICKED":
      return "email_clicked"
    case "REPLIED":
      return "email_replied"
    case "BOUNCED":
      return "email_bounced"
    default:
      return "email_sent"
  }
}
