import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUserFromDb } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get network-wide stats
    const totalPeers = await prisma.sendingAccount.count({
      where: {
        peerWarmupOptIn: true,
        peerWarmupEnabled: true,
        isActive: true,
      },
    })

    const avgHealthScore = await prisma.sendingAccount.aggregate({
      where: {
        peerWarmupOptIn: true,
        peerWarmupEnabled: true,
        isActive: true,
      },
      _avg: {
        healthScore: true,
      },
    })

    const providerDistribution = await prisma.sendingAccount.groupBy({
      by: ["provider"],
      where: {
        peerWarmupOptIn: true,
        peerWarmupEnabled: true,
        isActive: true,
      },
      _count: true,
    })

    const activeSessions = await prisma.warmupSession.count({
      where: {
        status: "ACTIVE",
        warmupType: "PEER",
      },
    })

    const todaysSessions = await prisma.warmupSession.count({
      where: {
        status: "ACTIVE",
        warmupType: "PEER",
        lastSentAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    })

    // Get user's contribution stats
    const userAccounts = await prisma.sendingAccount.findMany({
      where: { userId: user.id, peerWarmupOptIn: true },
      select: { id: true },
    })

    const userContribution = await prisma.warmupSession.count({
      where: {
        sendingAccountId: { in: userAccounts.map((a) => a.id) },
        warmupType: "PEER",
        status: "ACTIVE",
      },
    })

    return NextResponse.json({
      network: {
        totalPeers,
        avgHealthScore: Math.round(avgHealthScore._avg.healthScore || 0),
        activeSessions,
        todaysSessions,
        providerDistribution: providerDistribution.map((p) => ({
          provider: p.provider,
          count: p._count,
          percentage: ((p._count / totalPeers) * 100).toFixed(1),
        })),
      },
      userContribution: {
        activeConnections: userContribution,
        contributionLevel:
          userContribution === 0 ? "None" : userContribution < 10 ? "Low" : userContribution < 25 ? "Medium" : "High",
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching P2P network stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
