

"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getDashboardStats() {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      console.error("[v0] User not found in database")
      return {
        emailsSent: 0,
        activeProspects: 0,
        openRate: "0.0",
        clickRate: "0.0",
        replyRate: "0.0",
        emailsSentChange: null,
        prospectsChange: null,
        openRateChange: null,
        clickRateChange: null,
      }
    }

    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get all campaigns for this user
    const campaigns = await db.campaign.findMany({
      where: { userId: user.id },
      include: {
        prospects: {
          select: {
            emailsReceived: true,
            emailsOpened: true,
            emailsClicked: true,
            emailsReplied: true,
            status: true,
            createdAt: true,
          },
        },
      },
    })

    const thisMonthLogs = await db.emailLog.findMany({
      where: {
        prospect: {
          campaign: { userId: user.id },
        },
        createdAt: { gte: startOfThisMonth },
      },
      select: { status: true },
    })

    const lastMonthLogs = await db.emailLog.findMany({
      where: {
        prospect: {
          campaign: { userId: user.id },
        },
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      select: { status: true },
    })

    // Calculate aggregate stats
    let totalEmailsSent = 0
    let totalEmailsOpened = 0
    let totalEmailsClicked = 0
    let totalEmailsReplied = 0
    let activeProspects = 0
    let lastMonthActiveProspects = 0

    campaigns.forEach((campaign) => {
      campaign.prospects.forEach((prospect) => {
        totalEmailsSent += prospect.emailsReceived
        totalEmailsOpened += prospect.emailsOpened
        totalEmailsClicked += prospect.emailsClicked
        totalEmailsReplied += prospect.emailsReplied
        if (prospect.status === "ACTIVE" || prospect.status === "CONTACTED") {
          activeProspects++
          // Count if prospect existed last month
          if (prospect.createdAt < startOfThisMonth) {
            lastMonthActiveProspects++
          }
        }
      })
    })

    const thisMonthSent = thisMonthLogs.length
    const lastMonthSent = lastMonthLogs.length

    // Calculate percentage change safely (avoid division by zero, cap at reasonable values)
    const calculateChange = (current: number, previous: number): number | null => {
      if (previous === 0 && current === 0) return null
      if (previous === 0) return current > 0 ? 100 : 0 // New activity this month
      const change = ((current - previous) / previous) * 100
      // Cap at -100% to +100% for reasonable display
      return Math.max(-100, Math.min(100, change))
    }

    const emailsSentChange = calculateChange(thisMonthSent, lastMonthSent)
    const prospectsChange = calculateChange(activeProspects, lastMonthActiveProspects)

    const openRate = totalEmailsSent > 0 ? Math.min(100, (totalEmailsOpened / totalEmailsSent) * 100) : 0
    const clickRate = totalEmailsSent > 0 ? Math.min(100, (totalEmailsClicked / totalEmailsSent) * 100) : 0
    const replyRate = totalEmailsSent > 0 ? Math.min(100, (totalEmailsReplied / totalEmailsSent) * 100) : 0

    // This prevents confusing numbers like "113% increase in open rate"
    const thisMonthOpened = thisMonthLogs.filter((l) => l.status === "OPENED").length
    const lastMonthOpened = lastMonthLogs.filter((l) => l.status === "OPENED").length
    const thisMonthOpenRate = thisMonthSent > 0 ? Math.min(100, (thisMonthOpened / thisMonthSent) * 100) : 0
    const lastMonthOpenRate = lastMonthSent > 0 ? Math.min(100, (lastMonthOpened / lastMonthSent) * 100) : 0
    const openRateChange =
      lastMonthSent > 0 ? Math.max(-100, Math.min(100, thisMonthOpenRate - lastMonthOpenRate)) : null

    const thisMonthClicked = thisMonthLogs.filter((l) => l.status === "CLICKED").length
    const lastMonthClicked = lastMonthLogs.filter((l) => l.status === "CLICKED").length
    const thisMonthClickRate = thisMonthSent > 0 ? Math.min(100, (thisMonthClicked / thisMonthSent) * 100) : 0
    const lastMonthClickRate = lastMonthSent > 0 ? Math.min(100, (lastMonthClicked / lastMonthSent) * 100) : 0
    const clickRateChange =
      lastMonthSent > 0 ? Math.max(-100, Math.min(100, thisMonthClickRate - lastMonthClickRate)) : null

    return {
      emailsSent: totalEmailsSent,
      activeProspects,
      openRate: openRate.toFixed(1),
      clickRate: clickRate.toFixed(1),
      replyRate: replyRate.toFixed(1),
      emailsSentChange,
      prospectsChange,
      openRateChange,
      clickRateChange,
    }
  } catch (error) {
    console.error("[v0] Error getting dashboard stats:", error)
    return {
      emailsSent: 0,
      activeProspects: 0,
      openRate: "0.0",
      clickRate: "0.0",
      replyRate: "0.0",
      emailsSentChange: null,
      prospectsChange: null,
      openRateChange: null,
      clickRateChange: null,
    }
  }
}

export async function getRecentActivity() {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      console.error("[v0] User not found in database")
      return []
    }

    // Get recent email logs
    const recentLogs = await db.emailLog.findMany({
      where: {
        prospect: {
          campaign: {
            userId: user.id,
          },
        },
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
      take: 10,
    })

    return recentLogs.map((log) => ({
      id: log.id,
      type: log.status === "DELIVERED" ? "email_sent" : log.status === "BOUNCED" ? "email_bounced" : "email_opened",
      message:
        log.status === "DELIVERED"
          ? `Email sent to ${log.prospect.firstName} ${log.prospect.lastName}`
          : log.status === "BOUNCED"
            ? `Email bounced for ${log.prospect.email}`
            : `${log.prospect.firstName} opened your email`,
      timestamp: log.createdAt,
      prospect: log.prospect,
    }))
  } catch (error) {
    console.error("[v0] Error getting recent activity:", error)
    return []
  }
}

export async function getWarmupStats() {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return {
        avgHealthScore: 0,
        activeAccounts: 0,
        avgInboxRate: 0,
      }
    }

    const accounts = await db.sendingAccount.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      select: {
        healthScore: true,
        openRate: true,
        warmupStage: true,
      },
    })

    if (accounts.length === 0) {
      return {
        avgHealthScore: 0,
        activeAccounts: 0,
        avgInboxRate: 0,
      }
    }

    // Calculate average health score
    const totalHealth = accounts.reduce((sum, acc) => sum + acc.healthScore, 0)
    const avgHealthScore = Math.round(totalHealth / accounts.length)

    // Calculate average inbox rate from open rates
    const totalInboxRate = accounts.reduce((sum, acc) => sum + acc.openRate, 0)
    const avgInboxRate = Math.round(totalInboxRate / accounts.length)

    return {
      avgHealthScore,
      activeAccounts: accounts.length,
      avgInboxRate,
    }
  } catch (error) {
    console.error("[v0] Error getting warmup stats:", error)
    return {
      avgHealthScore: 0,
      activeAccounts: 0,
      avgInboxRate: 0,
    }
  }
}


