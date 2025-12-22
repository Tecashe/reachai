import { NextResponse } from "next/server"
import { withApiAuth } from "@/lib/middleware/api-wrapper"
import { db } from "@/lib/db"

export const GET = withApiAuth("email:read")(async (request, context) => {
  try {
    const { searchParams } = new URL(request.url)
    const sendingAccountId = searchParams.get("sendingAccountId")

    if (!sendingAccountId) {
      return NextResponse.json(
        {
          success: false,
          error: "sendingAccountId is required",
        },
        { status: 400 },
      )
    }

    // Verify sending account belongs to user
    const account = await db.sendingAccount.findFirst({
      where: {
        id: sendingAccountId,
        userId: context.user.id,
      },
    })

    if (!account) {
      return NextResponse.json(
        {
          success: false,
          error: "Sending account not found",
        },
        { status: 404 },
      )
    }

    // Get warmup sessions
    const sessions = await db.warmupSession.findMany({
      where: { sendingAccountId },
      orderBy: { startedAt: "desc" },
      take: 10,
    })

    // Get recent warmup interactions
    const recentInteractions = await db.warmupInteraction.findMany({
      where: {
        sendingAccountId,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    // Calculate stats
    const totalSent = recentInteractions.filter((i) => i.direction === "OUTBOUND").length
    const totalReceived = recentInteractions.filter((i) => i.direction === "INBOUND").length
    const inboxPlaced = recentInteractions.filter((i) => i.landedInInbox).length
    const spamPlaced = recentInteractions.filter((i) => i.landedInSpam).length
    const opened = recentInteractions.filter((i) => i.openedAt).length
    const replied = recentInteractions.filter((i) => i.repliedAt).length

    const stats = {
      sendingAccount: {
        id: account.id,
        email: account.email,
        warmupStage: account.warmupStage,
        warmupProgress: account.warmupProgress,
        warmupDailyLimit: account.warmupDailyLimit,
      },
      overall: {
        totalEmailsSent: totalSent,
        totalEmailsReceived: totalReceived,
        inboxPlacementRate: totalSent > 0 ? (inboxPlaced / totalSent) * 100 : 0,
        spamRate: totalSent > 0 ? (spamPlaced / totalSent) * 100 : 0,
        openRate: totalSent > 0 ? (opened / totalSent) * 100 : 0,
        replyRate: totalSent > 0 ? (replied / totalSent) * 100 : 0,
      },
      sessions: sessions.map((s) => ({
        id: s.id,
        status: s.status,
        warmupType: s.warmupType,
        emailsSent: s.emailsSent,
        emailsOpened: s.emailsOpened,
        emailsReplied: s.emailsReplied,
        inboxPlacementRate: s.inboxPlacementRate,
        startedAt: s.startedAt,
        endedAt: s.endedAt,
      })),
      recentActivity: recentInteractions.slice(0, 10).map((i) => ({
        id: i.id,
        direction: i.direction,
        subject: i.subject,
        sentAt: i.sentAt,
        openedAt: i.openedAt,
        repliedAt: i.repliedAt,
        landedInInbox: i.landedInInbox,
        landedInSpam: i.landedInSpam,
      })),
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching warmup stats:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch warmup stats",
      },
      { status: 500 },
    )
  }
})
