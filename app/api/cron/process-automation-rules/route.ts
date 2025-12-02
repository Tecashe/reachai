import { NextResponse } from "next/server"
import { automationRuleExecutor } from "@/lib/services/automation-rule-executor"
import { logger } from "@/lib/logger"

export const dynamic = "force-dynamic"
export const maxDuration = 300

/**
 * Cron job to process automation rules
 * Runs every 15 minutes to evaluate and execute automation rules
 */
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Starting automation rule processing cron job")

    const result = await automationRuleExecutor.processAllRules()

    logger.info("Automation rule processing completed", result)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    logger.error("Automation rule processing error")
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
