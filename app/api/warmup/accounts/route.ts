import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { reputationProfiler } from "@/lib/services/warmup/reputation-profiler"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get all accounts with warmup status
    const accounts = await prisma.sendingAccount.findMany({
      where: { userId },
      include: {
        warmupSessions: {
          where: { status: "ACTIVE" },
          orderBy: { startedAt: "desc" },
          take: 1,
        },
        reputationProfile: true,
        _count: {
          select: {
            emailLogs: true,
            warmupSessions: true,
          },
        },
      },
    })

    // Enhance with reputation profiles
    const accountsWithProfiles = await Promise.all(
      accounts.map(async (account) => {
        const profile = account.reputationProfile || 
          await reputationProfiler.analyzeAccount(account.id)
        const currentSession = account.warmupSessions[0]

        return {
          id: account.id,
          email: account.email,
          provider: account.provider,
          isActive: account.isActive,
          dailyLimit: account.dailyLimit,
          warmupEnabled: account.warmupEnabled,
          warmupStage: account.warmupStage,
          healthScore: account.healthScore,
          createdAt: account.createdAt,
          profile,
          currentSession: currentSession
            ? {
                id: currentSession.id,
                status: currentSession.status,
                emailsSent: currentSession.emailsSent,
                emailsReceived: currentSession.emailsReceived,
                startedAt: currentSession.startedAt,
              }
            : null,
          totalEmails: account._count.emailLogs,
        }
      }),
    )

    return NextResponse.json({ accounts: accountsWithProfiles })
  } catch (error) {
    console.error("[v0] Error fetching warmup accounts:", error)
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
  }
}