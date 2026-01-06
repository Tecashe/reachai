import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { NetworkQualityControl } from "@/lib/services/netwrok-quality-control"

const qualityControl = new NetworkQualityControl()

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const accounts = await db.sendingAccount.findMany({
      where: {
        userId,
        warmupEnabled: true,
      },
      include: {
        warmupSessions: {
          take: 1,
          orderBy: { startedAt: "desc" },
          where: {
            status: "ACTIVE",
          },
        },
      },
    })

    // Calculate health scores and prepare account data
    const accountsWithHealth = await Promise.all(
      accounts.map(async (account) => {
        const healthScore = await qualityControl.calculateCompositeHealthScore(account.id)
        const session = account.warmupSessions[0]

        return {
          id: account.id,
          email: account.email,
          healthScore: healthScore,
          warmupStage: account.warmupStage || "NEW",
          warmupProgress: session?.emailsSent || 0,
          openRate: account.openRate || 0,
          replyRate: account.replyRate || 0,
          spamRate: account.spamComplaintRate || 0,
          bounceRate: account.bounceRate || 0,
          inboxPlacementRate: session?.inboxPlacementRate || 100,
          warmupDailyLimit: account.warmupDailyLimit || 20,
          emailsSentToday: account.emailsSentToday || 0,
          warmupEnabled: account.warmupEnabled,
          warmupStartDate: session?.startedAt || account.warmupStartDate,
          daysInStage: session ? Math.floor((Date.now() - session.startedAt.getTime()) / (1000 * 60 * 60 * 24)) : 0,
          daysUntilNext: session ? calculateDaysUntilNext(account.warmupStage, session.startedAt) : 0,
        }
      }),
    )

    return NextResponse.json({
      accounts: accountsWithHealth,
      totalAccounts: accounts.length,
      avgHealth:
        accountsWithHealth.length > 0
          ? Math.round(accountsWithHealth.reduce((sum, acc) => sum + acc.healthScore, 0) / accountsWithHealth.length)
          : 0,
    })
  } catch (error) {
    console.error("[v0] Error fetching warmup stats:", error)
    return NextResponse.json({ error: "Failed to fetch warmup stats" }, { status: 500 })
  }
}

function calculateDaysUntilNext(stage: string, startedAt: Date): number {
  const daysInStage = Math.floor((Date.now() - startedAt.getTime()) / (1000 * 60 * 60 * 24))
  const stageDurations: Record<string, number> = {
    NEW: 3,
    WARMING: 7,
    WARM: 7,
    ACTIVE: 7,
    ESTABLISHED: 0, // No next stage
  }
  const duration = stageDurations[stage] || 0
  return Math.max(0, duration - daysInStage)
}
