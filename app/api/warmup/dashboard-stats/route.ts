import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"
import { WarmupSessionStatus, WarmupDirection } from "@prisma/client"

export async function GET() {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = user.id

    // Get all warmup-enabled accounts for this user
    const accounts = await db.sendingAccount.findMany({
      where: {
        userId,
        warmupEnabled: true,
      },
      include: {
        warmupSessions: {
          where: {
            status: WarmupSessionStatus.ACTIVE,
          },
        },
      },
    })

    const activeSessionIds = accounts.flatMap((acc) => acc.warmupSessions.map((s) => s.id))

    // Get stats for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Total emails sent today
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const emailsSentToday = await db.warmupInteraction.count({
      where: {
        sessionId: { in: activeSessionIds },
        direction: WarmupDirection.OUTBOUND,
        sentAt: { gte: startOfToday },
      },
    })

    // Get inbox placement rate
    const totalSent = await db.warmupInteraction.count({
      where: {
        sessionId: { in: activeSessionIds },
        direction: WarmupDirection.OUTBOUND,
        sentAt: { gte: thirtyDaysAgo },
      },
    })

    const inboxCount = await db.warmupInteraction.count({
      where: {
        sessionId: { in: activeSessionIds },
        direction: WarmupDirection.OUTBOUND,
        sentAt: { gte: thirtyDaysAgo },
        landedInInbox: true,
      },
    })

    const inboxRate = totalSent > 0 ? (inboxCount / totalSent) * 100 : 0

    // Calculate health score
    const openedCount = await db.warmupInteraction.count({
      where: {
        sessionId: { in: activeSessionIds },
        openedAt: { not: null },
        sentAt: { gte: thirtyDaysAgo },
      },
    })

    const repliedCount = await db.warmupInteraction.count({
      where: {
        sessionId: { in: activeSessionIds },
        repliedAt: { not: null },
        sentAt: { gte: thirtyDaysAgo },
      },
    })

    const spamCount = await db.warmupInteraction.count({
      where: {
        sessionId: { in: activeSessionIds },
        landedInSpam: true,
        sentAt: { gte: thirtyDaysAgo },
      },
    })

    const openRate = totalSent > 0 ? (openedCount / totalSent) * 100 : 0
    const replyRate = totalSent > 0 ? (repliedCount / totalSent) * 100 : 0
    const spamRate = totalSent > 0 ? (spamCount / totalSent) * 100 : 0

    // Health score calculation (weighted)
    const healthScore = Math.round(
      inboxRate * 0.4 + openRate * 0.2 + replyRate * 0.15 + Math.max(0, 100 - spamRate * 2) * 0.15 + 10
    )

    // Get trend data (compare to previous 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const prevSevenDaysAgo = new Date(sevenDaysAgo)
    prevSevenDaysAgo.setDate(prevSevenDaysAgo.getDate() - 7)

    const recentSent = await db.warmupInteraction.count({
      where: {
        sessionId: { in: activeSessionIds },
        direction: WarmupDirection.OUTBOUND,
        sentAt: { gte: sevenDaysAgo },
      },
    })

    const prevSent = await db.warmupInteraction.count({
      where: {
        sessionId: { in: activeSessionIds },
        direction: WarmupDirection.OUTBOUND,
        sentAt: { gte: prevSevenDaysAgo, lt: sevenDaysAgo },
      },
    })

    const sentTrend = prevSent > 0 ? ((recentSent - prevSent) / prevSent) * 100 : 0

    return NextResponse.json({
      activeAccounts: accounts.length,
      emailsSentToday,
      inboxRate: Math.round(inboxRate * 10) / 10,
      healthScore: Math.min(100, healthScore),
      trends: {
        activeAccounts: 0, // Can calculate if needed
        emailsSent: Math.round(sentTrend),
        inboxRate: 0, // Can calculate if needed
        healthScore: 0, // Can calculate if needed
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching warmup dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}