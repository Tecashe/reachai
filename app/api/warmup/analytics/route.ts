// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/db"

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams
//     const accountId = searchParams.get("accountId")
//     const userId = searchParams.get("userId")

//     if (!accountId || !userId) {
//       return NextResponse.json({ error: "Account ID and User ID are required" }, { status: 400 })
//     }

//     // Verify account ownership
//     const account = await prisma.sendingAccount.findFirst({
//       where: { id: accountId, userId },
//     })

//     if (!account) {
//       return NextResponse.json({ error: "Account not found" }, { status: 404 })
//     }

//     // Get warmup session
//     const session = await prisma.warmupSession.findFirst({
//       where: { accountId },
//       orderBy: { createdAt: "desc" },
//     })

//     if (!session) {
//       return NextResponse.json({ error: "No warmup session found" }, { status: 404 })
//     }

//     // Get metrics for last 30 days
//     const thirtyDaysAgo = new Date()
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

//     const metrics = await prisma.healthMetric.findMany({
//       where: {
//         accountId,
//         date: { gte: thirtyDaysAgo },
//       },
//       orderBy: { date: "asc" },
//     })

//     // Get interaction stats
//     const interactions = await prisma.warmupInteraction.findMany({
//       where: {
//         OR: [{ senderAccountId: accountId }, { recipientAccountId: accountId }],
//         createdAt: { gte: thirtyDaysAgo },
//       },
//     })

//     const sent = interactions.filter((i) => i.senderAccountId === accountId)
//     const received = interactions.filter((i) => i.recipientAccountId === accountId)

//     const opened = sent.filter((i) => i.opened).length
//     const replied = sent.filter((i) => i.replied).length
//     const bounced = sent.filter((i) => i.bounced).length

//     // Get inbox placement stats
//     const placements = await prisma.inboxPlacement.findMany({
//       where: {
//         accountId,
//         checkedAt: { gte: thirtyDaysAgo },
//       },
//       orderBy: { checkedAt: "asc" },
//     })

//     const placementStats = placements.reduce(
//       (acc, p) => {
//         acc[p.placement] = (acc[p.placement] || 0) + 1
//         return acc
//       },
//       {} as Record<string, number>,
//     )

//     // Get conversation threads
//     const threads = await prisma.conversationThread.findMany({
//       where: {
//         OR: [{ initiatorAccountId: accountId }, { responderAccountId: accountId }],
//       },
//       include: {
//         interactions: {
//           orderBy: { sentAt: "asc" },
//         },
//       },
//     })
// //
//     return NextResponse.json({
//       session: {
//         id: session.id,
//         stage: session.currentStage,
//         emailsSent: session.emailsSent,
//         emailsReceived: session.emailsReceived,
//         startedAt: session.startedAt,
//         lastActivityAt: session.lastActivityAt,
//       },
//       stats: {
//         sent: sent.length,
//         received: received.length,
//         opened,
//         replied,
//         bounced,
//         openRate: sent.length > 0 ? (opened / sent.length) * 100 : 0,
//         replyRate: sent.length > 0 ? (replied / sent.length) * 100 : 0,
//         bounceRate: sent.length > 0 ? (bounced / sent.length) * 100 : 0,
//       },
//       metrics,
//       placementStats,
//       threads: threads.map((t) => ({
//         id: t.id,
//         messageCount: t.messageCount,
//         status: t.status,
//         startedAt: t.startedAt,
//         lastMessageAt: t.lastMessageAt,
//       })),
//     })
//   } catch (error) {
//     console.error("[v0] Error fetching analytics:", error)
//     return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const accountId = searchParams.get("accountId")
    const userId = searchParams.get("userId")

    if (!accountId || !userId) {
      return NextResponse.json({ error: "Account ID and User ID are required" }, { status: 400 })
    }

    // Verify account ownership
    const account = await prisma.sendingAccount.findFirst({
      where: { id: accountId, userId },
    })

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    // Get warmup session
    const session = await prisma.warmupSession.findFirst({
      where: { sendingAccountId: accountId },
      orderBy: { startedAt: "desc" },
    })

    if (!session) {
      return NextResponse.json({ error: "No warmup session found" }, { status: 404 })
    }

    // Get metrics for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Get interaction stats
    const interactions = await prisma.warmupInteraction.findMany({
      where: {
        sendingAccountId: accountId,
        createdAt: { gte: thirtyDaysAgo },
      },
    })

    const sent = interactions.filter((i) => i.direction === "OUTBOUND")
    const received = interactions.filter((i) => i.direction === "INBOUND")

    const opened = sent.filter((i) => i.openedAt !== null).length
    const replied = sent.filter((i) => i.repliedAt !== null).length
    const bounced = 0 // Bounces tracked via EmailBounce model

    // Get inbox placement stats
    const placements = await prisma.inboxPlacement.findMany({
      where: {
        accountId,
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: "asc" },
    })

    const placementStats = placements.reduce(
      (acc, p) => {
        acc[p.detectedFolder] = (acc[p.detectedFolder] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Get conversation threads
    const threads = await prisma.warmupThread.findMany({
      where: {
        OR: [
          { initiatorAccountId: accountId },
          { recipientAccountId: accountId }
        ],
      },
      include: {
        interactions: {
          orderBy: { sentAt: "asc" },
        },
      },
    })

    return NextResponse.json({
      session: {
        id: session.id,
        status: session.status,
        emailsSent: session.emailsSent,
        emailsReceived: session.emailsReceived,
        startedAt: session.startedAt,
      },
      stats: {
        sent: sent.length,
        received: received.length,
        opened,
        replied,
        bounced,
        openRate: sent.length > 0 ? (opened / sent.length) * 100 : 0,
        replyRate: sent.length > 0 ? (replied / sent.length) * 100 : 0,
        bounceRate: sent.length > 0 ? (bounced / sent.length) * 100 : 0,
      },
      placementStats,
      threads: threads.map((t) => ({
        id: t.id,
        messageCount: t.messageCount,
        status: t.status,
        createdAt: t.createdAt,
        lastMessageAt: t.lastMessageAt,
      })),
    })
  } catch (error) {
    console.error("[v0] Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}