// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/db"
// import { reputationProfiler } from "@/lib/services/warmup/reputation-profiler"
// import { poolManager } from "@/lib/services/warmup/pool-manager"
// import { logger } from "@/lib/logger"

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { accountId, userId } = body

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

//     if (account.warmupEnabled) {
//       return NextResponse.json({ error: "Account is already enrolled in warmup" }, { status: 400 })
//     }

//     const profile = await reputationProfiler.analyzeAccount(accountId)

//     const limitByTier: Record<string, number> = {
//       PRISTINE: 50,
//       HIGH: 40,
//       MEDIUM: 30,
//       LOW: 20,
//       CRITICAL: 10,
//     }
//     const initialDailyLimit = limitByTier[profile.reputationTier] || 20

//     const stageByTier: Record<string, string> = {
//       PRISTINE: "WARM",
//       HIGH: "WARMING",
//       MEDIUM: "NEW",
//       LOW: "NEW",
//       CRITICAL: "NEW",
//     }
//     const initialStage = stageByTier[profile.reputationTier] || "NEW"

//     // Createwarmup session
//     const session = await prisma.warmupSession.create({
//       data: {
//         accountId,
//         userId,
//         warmupType: "POOL",
//         dailyLimit: initialDailyLimit,
//         status: "ACTIVE",
//       },
//     })

//     await prisma.sendingAccount.update({
//       where: { id: accountId },
//       data: {
//         warmupEnabled: true,
//         warmupStage: initialStage as any,
//         warmupDailyLimit: initialDailyLimit,
//         warmupStartDate: new Date(),
//         warmupProgress: 0,
//         peerWarmupEnabled: ["WARM", "ACTIVE", "ESTABLISHED"].includes(initialStage),
//         peerWarmupOptIn: true,
//         healthScore: 100 - profile.riskScore,
//       },
//     })

//     await poolManager.addAccountToPools(accountId)

//     logger.info("[EnrollAPI] Account enrolled in warmup", {
//       accountId,
//       tier: profile.reputationTier,
//       initialLimit: initialDailyLimit,
//       stage: initialStage,
//     })

//     return NextResponse.json({
//       success: true,
//       session: {
//         id: session.id,
//         dailyLimit: initialDailyLimit,
//         stage: initialStage,
//       },
//       profile: {
//         tier: profile.reputationTier,
//         riskScore: profile.riskScore,
//         industry: profile.industry,
//       },
//       message: `Warmup started with ${initialDailyLimit} emails/day based on ${profile.reputationTier} reputation`,
//     })
//   } catch (error) {
//     logger.error("[EnrollAPI] Failed to enroll account", { error: (error as Error).message })
//     return NextResponse.json({ error: "Failed to enroll account" }, { status: 500 })
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { reputationProfiler } from "@/lib/services/warmup/reputation-profiler"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accountId, userId } = body

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

    if (account.warmupEnabled) {
      return NextResponse.json({ error: "Account is already enrolled in warmup" }, { status: 400 })
    }

    // Analyze and get/create reputation profile
    await reputationProfiler.analyzeAccount(accountId)
    
    const profile = await prisma.reputationProfile.findUnique({
      where: { accountId },
    })

    if (!profile) {
      return NextResponse.json({ error: "Failed to create reputation profile" }, { status: 500 })
    }

    const limitByTier: Record<string, number> = {
      PRISTINE: 50,
      HIGH: 40,
      MEDIUM: 30,
      LOW: 20,
      CRITICAL: 10,
    }
    const initialDailyLimit = limitByTier[profile.reputationTier] || 20

    const stageByTier: Record<string, "NEW" | "WARMING" | "WARM" | "ACTIVE" | "ESTABLISHED"> = {
      PRISTINE: "WARM",
      HIGH: "WARMING",
      MEDIUM: "NEW",
      LOW: "NEW",
      CRITICAL: "NEW",
    }
    const initialStage = stageByTier[profile.reputationTier] || "NEW"

    // Create warmup session
    const session = await prisma.warmupSession.create({
      data: {
        sendingAccountId: accountId,
        warmupType: "POOL",
        dailyLimit: initialDailyLimit,
        status: "ACTIVE",
      },
    })

    await prisma.sendingAccount.update({
      where: { id: accountId },
      data: {
        warmupEnabled: true,
        warmupStage: initialStage,
        warmupDailyLimit: initialDailyLimit,
        warmupStartDate: new Date(),
        warmupProgress: 0,
        peerWarmupEnabled: ["WARM", "ACTIVE", "ESTABLISHED"].includes(initialStage),
        peerWarmupOptIn: true,
        healthScore: Math.round(100 - profile.riskScore),
      },
    })

    // Add to default pool
    const defaultPool = await prisma.warmupPool.findFirst({
      where: { isDefault: true },
    })

    if (defaultPool) {
      await prisma.poolMembership.create({
        data: {
          accountId,
          poolId: defaultPool.id,
          status: "ACTIVE",
        },
      })
    }

    logger.info("[EnrollAPI] Account enrolled in warmup", {
      accountId,
      tier: profile.reputationTier,
      initialLimit: initialDailyLimit,
      stage: initialStage,
    })

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        dailyLimit: initialDailyLimit,
        stage: initialStage,
      },
      profile: {
        tier: profile.reputationTier,
        riskScore: profile.riskScore,
        industry: profile.industry,
      },
      message: `Warmup started with ${initialDailyLimit} emails/day based on ${profile.reputationTier} reputation`,
    })
  } catch (error) {
    logger.error("[EnrollAPI] Failed to enroll account", { error: (error as Error).message })
    return NextResponse.json({ error: "Failed to enroll account" }, { status: 500 })
  }
}