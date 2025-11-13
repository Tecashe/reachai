import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"

/**
 * Check if sending accounts are properly warmed up before launching campaign
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: campaignId } = await params
    const userId = await requireAuth()

    // Get campaign
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId, userId },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    // Get all sending accounts
    const sendingAccounts = await db.sendingAccount.findMany({
      where: {
        userId,
        isActive: true,
      },
    })

    if (sendingAccounts.length === 0) {
      return NextResponse.json({
        ready: false,
        reason: "No sending accounts connected",
        accounts: [],
      })
    }

    // Check each account's warmup status
    const accountStatuses = sendingAccounts.map((account) => {
      const daysSinceStart = Math.floor((Date.now() - account.warmupStartDate.getTime()) / (1000 * 60 * 60 * 24))

      let isReady = false
      let recommendation = ""

      if (account.warmupStage === "NEW" && daysSinceStart < 7) {
        isReady = false
        recommendation = `Account needs ${7 - daysSinceStart} more days of warmup. Currently sending ${account.warmupDailyLimit} emails/day.`
      } else if (account.warmupStage === "WARMING") {
        isReady = true // Can send but with limits
        recommendation = `Account is warming up (${daysSinceStart} days). Recommended daily limit: ${account.warmupDailyLimit} emails.`
      } else if (["WARM", "ACTIVE", "ESTABLISHED"].includes(account.warmupStage)) {
        isReady = true
        recommendation = `Account is fully warmed (${account.warmupStage}). Safe to send at full capacity.`
      }

      return {
        id: account.id,
        email: account.email,
        warmupStage: account.warmupStage,
        daysSinceStart,
        isReady,
        recommendation,
        dailyLimit: account.dailyLimit,
        warmupDailyLimit: account.warmupDailyLimit,
        healthScore: account.healthScore,
      }
    })

    const readyAccounts = accountStatuses.filter((a) => a.isReady)
    const notReadyAccounts = accountStatuses.filter((a) => !a.isReady)

    return NextResponse.json({
      ready: readyAccounts.length > 0,
      totalAccounts: sendingAccounts.length,
      readyAccounts: readyAccounts.length,
      notReadyAccounts: notReadyAccounts.length,
      accounts: accountStatuses,
      recommendation:
        readyAccounts.length === 0
          ? "Wait for warmup to complete or connect additional pre-warmed accounts"
          : `${readyAccounts.length} account(s) ready. Recommended daily send limit: ${readyAccounts.reduce((sum, a) => sum + a.warmupDailyLimit, 0)} emails.`,
    })
  } catch (error) {
    console.error("[v0] Warmup check error:", error)
    return NextResponse.json({ error: "Failed to check warmup status" }, { status: 500 })
  }
}
