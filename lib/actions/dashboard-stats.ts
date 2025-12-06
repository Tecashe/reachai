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

    // Parallel queries for performance
    const [campaigns, prospects, sendingAccounts, recentEmailLogs, dailyAnalytics] = await Promise.all([
      // All campaigns with stats
      db.campaign.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          name: true,
          status: true,
          totalProspects: true,
          emailsSent: true,
          emailsOpened: true,
          emailsClicked: true,
          emailsReplied: true,
          emailsBounced: true,
          createdAt: true,
          launchedAt: true,
        },
      }),
      // All prospects with status
      db.prospect.findMany({
        where: { userId: user.id, isTrashed: false },
        select: {
          id: true,
          status: true,
          emailsReceived: true,
          emailsOpened: true,
          emailsClicked: true,
          emailsReplied: true,
          bounced: true,
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
    ])

    // Calculate campaign status distribution (for donut chart)
    const campaignStatusCounts = {
      DRAFT: 0,
      ACTIVE: 0,
      PAUSED: 0,
      COMPLETED: 0,
      ARCHIVED: 0,
    }
    campaigns.forEach((c) => {
      campaignStatusCounts[c.status]++
    })

    // Calculate prospect status distribution (for donut chart)
    const prospectStatusCounts = {
      ACTIVE: 0,
      CONTACTED: 0,
      REPLIED: 0,
      BOUNCED: 0,
      UNSUBSCRIBED: 0,
      COMPLETED: 0,
    }
    prospects.forEach((p) => {
      prospectStatusCounts[p.status]++
    })

    // Calculate totals
    const totalEmailsSent = campaigns.reduce((sum, c) => sum + c.emailsSent, 0)
    const totalEmailsOpened = campaigns.reduce((sum, c) => sum + c.emailsOpened, 0)
    const totalEmailsClicked = campaigns.reduce((sum, c) => sum + c.emailsClicked, 0)
    const totalEmailsReplied = campaigns.reduce((sum, c) => sum + c.emailsReplied, 0)
    const totalEmailsBounced = campaigns.reduce((sum, c) => sum + c.emailsBounced, 0)

    // Email engagement funnel (for donut chart)
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

    // Sending accounts health summary
    const activeAccounts = sendingAccounts.filter((a) => a.isActive)
    const avgHealthScore =
      activeAccounts.length > 0
        ? Math.round(activeAccounts.reduce((sum, a) => sum + a.healthScore, 0) / activeAccounts.length)
        : 0

    // Warmup stage distribution
    const warmupStages = {
      NEW: 0,
      WARMING: 0,
      WARM: 0,
      ACTIVE: 0,
      ESTABLISHED: 0,
    }
    sendingAccounts.forEach((a) => {
      warmupStages[a.warmupStage]++
    })

    // Aggregate daily analytics for chart
    const dailyPerformance = aggregateDailyAnalytics(dailyAnalytics)

    // Top campaigns by reply rate
    const topCampaigns = campaigns
      .filter((c) => c.emailsSent > 0)
      .map((c) => ({
        id: c.id,
        name: c.name,
        status: c.status,
        emailsSent: c.emailsSent,
        replyRate: (c.emailsReplied / c.emailsSent) * 100,
        openRate: (c.emailsOpened / c.emailsSent) * 100,
      }))
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
      // Overview stats
      overview: {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter((c) => c.status === "ACTIVE").length,
        totalProspects: prospects.length,
        activeProspects: prospects.filter((p) => p.status === "ACTIVE" || p.status === "CONTACTED").length,
        totalEmailsSent,
        emailCredits: user.emailCredits,
        researchCredits: user.researchCredits,
      },
      // Rates
      rates: {
        openRate: openRate.toFixed(1),
        clickRate: clickRate.toFixed(1),
        replyRate: replyRate.toFixed(1),
        bounceRate: bounceRate.toFixed(1),
      },
      // Charts data
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
      // Sending accounts
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
      // Top campaigns
      topCampaigns,
      // Activity feed
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
      grouped.set(dateKey, {
        date: dateKey,
        sent: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
      })
    }
    const entry = grouped.get(dateKey)!
    entry.sent += a.emailsSent
    entry.opened += a.emailsOpened
    entry.clicked += a.emailsClicked
    entry.replied += a.emailsReplied
  })

  return Array.from(grouped.values()).slice(-14) // Last 14 days
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
