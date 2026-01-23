import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const accounts = await db.sendingAccount.findMany({
      where: {
        userId: user.id,
        warmupEnabled: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        provider: true,
        warmupStage: true,
        healthScore: true,
        emailsSentToday: true,
        warmupDailyLimit: true,
        lastWarmupAt: true,
        inboxPlacements: {
          take: 50,
          orderBy: { createdAt: 'desc' },
          select: { detectedFolder: true }
        },
        warmupThreadsInitiated: {
          where: { status: 'ACTIVE' },
          select: { id: true }
        },
        warmupThreadsReceived: {
          where: { status: 'ACTIVE' },
          select: { id: true }
        }
      }
    })

    const detailedAccounts = accounts.map(acc => {
      // Calculate individual inbox rate
      const totalPlacements = acc.inboxPlacements.length
      const landedInInbox = acc.inboxPlacements.filter(p => p.detectedFolder === 'PRIMARY').length
      const inboxRate = totalPlacements > 0 ? Math.round((landedInInbox / totalPlacements) * 100) : 100

      // Active threads count
      const activeThreads = acc.warmupThreadsInitiated.length + acc.warmupThreadsReceived.length

      return {
        id: acc.id,
        email: acc.email,
        name: acc.name,
        provider: acc.provider,
        stage: acc.warmupStage,
        healthScore: acc.healthScore,
        sentToday: acc.emailsSentToday,
        dailyLimit: acc.warmupDailyLimit,
        lastActive: acc.lastWarmupAt,
        inboxRate,
        activeThreads
      }
    })

    return NextResponse.json({ accounts: detailedAccounts })

  } catch (error) {
    console.error("Error fetching warmup accounts:", error)
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
  }
}