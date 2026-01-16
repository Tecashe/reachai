// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/db"
// import { reputationProfiler } from "@/lib/services/warmup/reputation-profiler"

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

//     // Get reputation profile
//     const profile = await reputationProfiler.analyzeAccount(accountId)

//     // Get recent healthmetrics
//     const metrics = await prisma.healthMetric.findMany({
//       where: { accountId },
//       orderBy: { date: "desc" },
//       take: 7,
//     })

//     // Get active adjustments
//     const adjustments = await prisma.strategyAdjustment.findMany({
//       where: {
//         accountId,
//         isActive: true,
//       },
//       orderBy: { createdAt: "desc" },
//     })

//     // Get DNS configuration
//     const dnsConfig = await prisma.dNSConfiguration.findFirst({
//       where: { accountId },
//       orderBy: { lastCheckedAt: "desc" },
//     })

//     return NextResponse.json({
//       profile,
//       recentMetrics: metrics,
//       activeAdjustments: adjustments,
//       dnsConfiguration: dnsConfig,
//       healthSummary: {
//         overallHealth: profile.riskScore,
//         reputationTier: profile.reputationTier,
//         warmupStage: profile.warmupStage,
//         recommendedDailyLimit: profile.recommendedDailyLimit,
//         issues: adjustments.map((a) => ({
//           severity: a.severity,
//           reason: a.reason,
//           adjustedAt: a.createdAt,
//         })),
//       },
//     })
//   } catch (error) {
//     console.error("[v0] Error fetching health data:", error)
//     return NextResponse.json({ error: "Failed to fetch health data" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { reputationProfiler } from "@/lib/services/warmup/reputation-profiler"

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

    // Get reputation profile
    await reputationProfiler.analyzeAccount(accountId)
    const profile = await prisma.reputationProfile.findUnique({
      where: { accountId },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Get active adjustments
    const adjustments = await prisma.strategyAdjustment.findMany({
      where: {
        accountId,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      profile: {
        reputationTier: profile.reputationTier,
        riskScore: profile.riskScore,
        currentWarmupStage: profile.currentWarmupStage,
        recommendedDailyLimit: profile.recommendedDailyLimit,
        industry: profile.industry,
        accountRole: profile.accountRole,
      },
      activeAdjustments: adjustments,
      healthSummary: {
        overallHealth: 100 - profile.riskScore,
        reputationTier: profile.reputationTier,
        warmupStage: profile.currentWarmupStage,
        recommendedDailyLimit: profile.recommendedDailyLimit,
        issues: adjustments.map((a) => ({
          severity: a.severity,
          reason: a.trigger,
          adjustedAt: a.createdAt,
        })),
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching health data:", error)
    return NextResponse.json({ error: "Failed to fetch health data" }, { status: 500 })
  }
}