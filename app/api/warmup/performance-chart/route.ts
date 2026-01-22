import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"
import { WarmupDirection, WarmupSessionStatus } from "@prisma/client"

export async function GET(req: Request) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get("days") || "30", 10)

    const userId = user.id

    // Get active warmup sessions
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

    const sessionIds = accounts.flatMap((acc) => acc.warmupSessions.map((s) => s.id))

    if (sessionIds.length === 0) {
      return NextResponse.json({ data: [] })
    }

    // Get date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Generate date array
    const dateArray: string[] = []
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dateArray.push(d.toISOString().split("T")[0])
    }

    // Fetch interactions grouped by date
    const interactions = await db.warmupInteraction.findMany({
      where: {
        sessionId: { in: sessionIds },
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        createdAt: true,
        direction: true,
        landedInInbox: true,
        openedAt: true,
        repliedAt: true,
      },
    })

    // Group by date
    const dataByDate = new Map<string, { sent: number; inbox: number; opened: number; replied: number }>()

    for (const date of dateArray) {
      dataByDate.set(date, { sent: 0, inbox: 0, opened: 0, replied: 0 })
    }

    for (const interaction of interactions) {
      const date = interaction.createdAt.toISOString().split("T")[0]
      const data = dataByDate.get(date)

      if (data && interaction.direction === WarmupDirection.OUTBOUND) {
        data.sent += 1
        if (interaction.landedInInbox) data.inbox += 1
        if (interaction.openedAt) data.opened += 1
        if (interaction.repliedAt) data.replied += 1
      }
    }

    // Convert to chart data format
    const chartData = Array.from(dataByDate.entries()).map(([date, stats]) => ({
      date,
      sent: stats.sent,
      inboxRate: stats.sent > 0 ? Math.round((stats.inbox / stats.sent) * 100) : 0,
      openRate: stats.sent > 0 ? Math.round((stats.opened / stats.sent) * 100) : 0,
      replyRate: stats.sent > 0 ? Math.round((stats.replied / stats.sent) * 100) : 0,
    }))

    return NextResponse.json({ data: chartData })
  } catch (error) {
    console.error("[v0] Error fetching performance chart data:", error)
    return NextResponse.json({ error: "Failed to fetch chart data" }, { status: 500 })
  }
}