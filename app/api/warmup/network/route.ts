import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get total peer network size (accounts opted into P2P with good health)
    const peerNetworkSize = await db.sendingAccount.count({
      where: {
        peerWarmupEnabled: true,
        peerWarmupOptIn: true,
        healthScore: { gte: 80 },
        isActive: true,
      },
    })

    // Get provider composition
    const googleWorkspaceCount = await db.sendingAccount.count({
      where: {
        peerWarmupEnabled: true,
        provider: "google-workspace",
      },
    })

    const office365Count = await db.sendingAccount.count({
      where: {
        peerWarmupEnabled: true,
        provider: "office365",
      },
    })

    const otherCount = peerNetworkSize - googleWorkspaceCount - office365Count

    // Calculate percentages
    const total = peerNetworkSize || 1
    const composition = {
      googleWorkspace: Math.round((googleWorkspaceCount / total) * 100),
      office365: Math.round((office365Count / total) * 100),
      other: Math.round((otherCount / total) * 100),
    }

    // Calculate average reputation across all active peer accounts
    const accounts = await db.sendingAccount.findMany({
      where: {
        peerWarmupEnabled: true,
        isActive: true,
      },
      select: {
        healthScore: true,
      },
    })

    const averageReputation =
      accounts.length > 0
        ? Math.round(accounts.reduce((sum, acc) => sum + (acc.healthScore || 85), 0) / accounts.length)
        : 85

    // Calculate network health score based on size, composition, and average reputation
    let networkScore = 0

    // Base score from network size
    if (peerNetworkSize >= 5000) networkScore += 40
    else if (peerNetworkSize >= 1000) networkScore += 30
    else if (peerNetworkSize >= 500) networkScore += 20
    else networkScore += 10

    // Score from provider diversity (prefer more Google Workspace/Office 365)
    const highQualityPercent = composition.googleWorkspace + composition.office365
    if (highQualityPercent >= 90) networkScore += 30
    else if (highQualityPercent >= 80) networkScore += 25
    else if (highQualityPercent >= 70) networkScore += 20
    else networkScore += 15

    // Score from average reputation
    networkScore += Math.round(averageReputation * 0.3)

    const networkHealth = {
      score: Math.min(100, networkScore),
      totalSize: peerNetworkSize,
      composition,
      averageReputation,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(networkHealth)
  } catch (error) {
    console.error("[v0] Error fetching network health:", error)
    return NextResponse.json({ error: "Failed to fetch network data" }, { status: 500 })
  }
}
