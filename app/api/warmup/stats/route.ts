// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/db"
// import { conversationThreadManager } from "@/lib/services/warmup/conversation-thread-manager"
// import { retryQueue } from "@/lib/services/warmup/retry-queue"

// /**
//  * GET /api/warmup/stats
//  * Get comprehensive warmup system statistics
//  */
// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams
//     const userId = searchParams.get("userId")

//     if (!userId) {
//       return NextResponse.json({ error: "User ID required" }, { status: 400 })
//     }

//     // Get account stats
//     const accountStats = await prisma.sendingAccount.aggregate({
//       where: { userId, warmupEnabled: true },
//       _count: { id: true },
//       _avg: { healthScore: true, warmupProgress: true },
//     })

//     // Gettoday's email stats
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)

//     const todayStats = await prisma.warmupInteraction.groupBy({
//       by: ["direction"],
//       where: {
//         session: { userId },
//         sentAt: { gte: today },
//       },
//       _count: { id: true },
//     })

//     // Get thread stats
//     const threadStats = await conversationThreadManager.getThreadStats()

//     // Get retry queue stats
//     const retryStats = await retryQueue.getStats()

//     // Get reputation distribution
//     const reputationDistribution = await prisma.reputationProfile.groupBy({
//       by: ["reputationTier"],
//       where: { sendingAccount: { userId } },
//       _count: { id: true },
//     })

//     // Get stage distribution
//     const stageDistribution = await prisma.sendingAccount.groupBy({
//       by: ["warmupStage"],
//       where: { userId, warmupEnabled: true },
//       _count: { id: true },
//     })

//     // Get 30-day trend
//     const thirtyDaysAgo = new Date()
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

//     const dailyTrend = await prisma.warmupInteraction.groupBy({
//       by: ["sentAt"],
//       where: {
//         session: { userId },
//         sentAt: { gte: thirtyDaysAgo },
//         direction: "OUTBOUND",
//       },
//       _count: { id: true },
//     })

//     return NextResponse.json({
//       accounts: {
//         total: accountStats._count.id,
//         avgHealthScore: Math.round(accountStats._avg.healthScore || 0),
//         avgProgress: Math.round(accountStats._avg.warmupProgress || 0),
//       },
//       today: {
//         sent: todayStats.find((s) => s.direction === "OUTBOUND")?._count.id || 0,
//         received: todayStats.find((s) => s.direction === "INBOUND")?._count.id || 0,
//       },
//       threads: threadStats,
//       retryQueue: retryStats,
//       reputationDistribution: reputationDistribution.map((r) => ({
//         tier: r.reputationTier,
//         count: r._count.id,
//       })),
//       stageDistribution: stageDistribution.map((s) => ({
//         stage: s.warmupStage,
//         count: s._count.id,
//       })),
//       trend: dailyTrend.map((d) => ({
//         date: d.sentAt,
//         count: d._count.id,
//       })),
//     })
//   } catch (error) {
//     console.error("[v0] Error fetching warmup stats:", error)
//     return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Get account stats
    const accountStats = await prisma.sendingAccount.aggregate({
      where: { userId, warmupEnabled: true },
      _count: { id: true },
      _avg: { healthScore: true, warmupProgress: true },
    })

    // Get today's email stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayStats = await prisma.warmupInteraction.groupBy({
      by: ["direction"],
      where: {
        session: { sendingAccount: { userId } },
        sentAt: { gte: today },
      },
      _count: { id: true },
    })

    // Get reputation distribution
    const reputationDistribution = await prisma.reputationProfile.groupBy({
      by: ["reputationTier"],
      where: { account: { userId } },
      _count: { id: true },
    })

    // Get stage distribution
    const stageDistribution = await prisma.sendingAccount.groupBy({
      by: ["warmupStage"],
      where: { userId, warmupEnabled: true },
      _count: { id: true },
    })

    // Get 30-day trend
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailyTrend = await prisma.warmupInteraction.groupBy({
      by: ["sentAt"],
      where: {
        session: { sendingAccount: { userId } },
        sentAt: { gte: thirtyDaysAgo },
        direction: "OUTBOUND",
      },
      _count: { id: true },
    })

    return NextResponse.json({
      accounts: {
        total: accountStats._count.id,
        avgHealthScore: Math.round(accountStats._avg.healthScore || 0),
        avgProgress: Math.round(accountStats._avg.warmupProgress || 0),
      },
      today: {
        sent: todayStats.find((s) => s.direction === "OUTBOUND")?._count.id || 0,
        received: todayStats.find((s) => s.direction === "INBOUND")?._count.id || 0,
      },
      reputationDistribution: reputationDistribution.map((r) => ({
        tier: r.reputationTier,
        count: r._count.id,
      })),
      stageDistribution: stageDistribution.map((s) => ({
        stage: s.warmupStage,
        count: s._count.id,
      })),
      trend: dailyTrend.map((d) => ({
        date: d.sentAt,
        count: d._count.id,
      })),
    })
  } catch (error) {
    console.error("[v0] Error fetching warmup stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}