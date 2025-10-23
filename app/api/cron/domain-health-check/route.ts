import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { domainHealthChecker } from "@/lib/services/domain-health-checker"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Starting domain health check")

    // Get all active accounts
    const accounts = await db.sendingAccount.findMany({
      where: {
        isActive: true,
      },
    })

    let checkedCount = 0

    for (const account of accounts) {
      await domainHealthChecker.updateAccountDomainHealth(account.id)
      checkedCount++

      // Small delay to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    logger.info("Domain health check complete", {
      totalAccounts: accounts.length,
      checked: checkedCount,
    })

    return NextResponse.json({
      success: true,
      accountsChecked: checkedCount,
    })
  } catch (error) {
    logger.error("Domain health check cron error", error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
