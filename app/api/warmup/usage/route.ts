import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's subscription tier and limits
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { subscriptionTier: true },
    })

    const tier = user?.subscriptionTier || "FREE"

    // Define limits by tier
    const limits = {
      FREE: { warmupEmails: 5000, apiCalls: 10000 },
      STARTER: { warmupEmails: 15000, apiCalls: 25000 },
      PRO: { warmupEmails: 50000, apiCalls: 100000 },
      AGENCY: { warmupEmails: 200000, apiCalls: 500000 },
    }

    const tierLimits = limits[tier as keyof typeof limits] || limits.FREE

    // Get current month start
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Count warmup emails sent this month across all user's accounts
    const userAccounts = await db.sendingAccount.findMany({
      where: { userId },
      select: { id: true },
    })

    const accountIds = userAccounts.map((a) => a.id)

    const warmupEmailsThisMonth = await db.warmupInteraction.count({
      where: {
        sendingAccountId: { in: accountIds },
        direction: "OUTBOUND",
        createdAt: { gte: monthStart },
      },
    })

    // Count API calls this month (you can track this in a separate table)
    // For now, we'll use warmup interactions as a proxy
    const apiCallsThisMonth = await db.warmupInteraction.count({
      where: {
        sendingAccountId: { in: accountIds },
        createdAt: { gte: monthStart },
      },
    })

    return NextResponse.json({
      tier,
      warmupEmails: {
        used: warmupEmailsThisMonth,
        limit: tierLimits.warmupEmails,
        remaining: tierLimits.warmupEmails - warmupEmailsThisMonth,
      },
      apiCalls: {
        used: apiCallsThisMonth,
        limit: tierLimits.apiCalls,
        remaining: tierLimits.apiCalls - apiCallsThisMonth,
      },
      networkAccess: tier === "FREE" || tier === "STARTER" ? "Basic Pool" : "P2P Premium",
    })
  } catch (error) {
    console.error("[v0] Error fetching usage:", error)
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 })
  }
}
