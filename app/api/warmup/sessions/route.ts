import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sessions = await prisma.warmupSession.findMany({
      where: {
        sendingAccount: {
          userId: user.id,
        },
      },
      include: {
        sendingAccount: {
          select: {
            id: true,
            email: true,
            name: true,
            provider: true,
          },
        },
      },
      orderBy: {
        startedAt: "desc",
      },
    })

    const formattedSessions = sessions.map((session) => ({
      id: session.id,
      accountEmail: session.sendingAccount.email,
      accountName: session.sendingAccount.name || session.sendingAccount.email,
      provider: session.sendingAccount.provider,
      stage: session.status,
      progress: Math.min(
        100,
        (session.emailsSent / session.dailyLimit) * 100 * (session.status === "ACTIVE" ? 1 : 0.5),
      ),
      emailsSent: session.emailsSent,
      inboxRate: session.inboxPlacementRate,
      openRate: session.emailsSent > 0 ? (session.emailsOpened / session.emailsSent) * 100 : 0,
      replyRate: session.emailsSent > 0 ? (session.emailsReplied / session.emailsSent) * 100 : 0,
      health: session.inboxPlacementRate,
      startedAt: session.startedAt,
    }))

    return NextResponse.json({ sessions: formattedSessions })
  } catch (error) {
    console.error("[v0] Error fetching warmup sessions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
