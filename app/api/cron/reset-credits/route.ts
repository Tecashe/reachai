import { NextResponse } from "next/server"
import { resetMonthlyCredits } from "@/lib/cron/reset-credit"
import { logger } from "@/lib/logger"

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await resetMonthlyCredits()
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Cron job failed", error as Error)
    return NextResponse.json({ error: "Failed to reset credits" }, { status: 500 })
  }
}
