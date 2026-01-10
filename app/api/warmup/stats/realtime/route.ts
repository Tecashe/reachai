import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { WarmupDirection } from "@prisma/client"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const accounts = await prisma.sendingAccount.findMany({
      where: {
        userId: user.id,
        warmupEnabled: true,
      },
      include: {
        warmupSessions: {
          orderBy: { startedAt: "desc" },
          take: 1,
        },
      },
    })

    const totalAccounts = accounts.length

    // Calculate today's emails sent
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayInteractions = await prisma.warmupInteraction.findMany({
      where: {
        sendingAccountId: {
          in: accounts.map((a) => a.id),
        },
        createdAt: {
          gte: today,
        },
        direction: WarmupDirection.OUTBOUND,
      },
    })

    const emailsSentToday = todayInteractions.length

    // Calculate total daily limit
    const totalDailyLimit = accounts.reduce((sum, acc) => sum + (acc.warmupDailyLimit || 0), 0)

    // Calculate average inbox placement rate
    const accountsWithSessions = accounts.filter((a) => a.warmupSessions.length > 0)
    const avgInboxRate =
      accountsWithSessions.length > 0
        ? accountsWithSessions.reduce((sum, acc) => sum + (acc.warmupSessions[0]?.inboxPlacementRate || 0), 0) /
          accountsWithSessions.length
        : 0

    // Calculate network health score (composite metric)
    const healthScore = Math.round(
      avgInboxRate * 0.4 + // 40% weight on inbox placement
        (accountsWithSessions.filter((a) => a.warmupSessions[0]?.status === "ACTIVE").length / totalAccounts) *
          100 *
          0.3 + // 30% weight on active accounts
        (emailsSentToday / Math.max(totalDailyLimit, 1)) * 100 * 0.3, // 30% weight on daily progress
    )

    return NextResponse.json({
      activeAccounts: totalAccounts,
      emailsSentToday,
      totalDailyLimit,
      avgInboxRate: Math.round(avgInboxRate * 100) / 100,
      networkHealth: Math.min(100, healthScore),
      activeAccountsTrendValue: 0, // Will be calculated from historical data
    })
  } catch (error) {
    console.error("[v0] Error fetching real-time warmup stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
