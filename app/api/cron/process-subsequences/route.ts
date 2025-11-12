import { NextResponse } from "next/server"
import { subsequenceManager } from "@/lib/services/subsequence-manager"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"

export const dynamic = "force-dynamic"
export const maxDuration = 300

/**
 * Cron job to process subsequence triggers
 * Runs every 15 minutes to check if prospects meet trigger conditions
 */
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Starting subsequence trigger processing")

    // Get all active campaigns with active triggers
    const campaigns = await db.campaign.findMany({
      where: {
        status: "ACTIVE",
        subsequenceTriggers: {
          some: {
            isActive: true,
          },
        },
      },
      include: {
        prospects: {
          where: {
            status: "ACTIVE",
            replied: false, // Only check prospects who haven't replied
          },
        },
        subsequenceTriggers: {
          where: { isActive: true },
        },
      },
    })

    let triggersChecked = 0
    const triggersExecuted = 0

    for (const campaign of campaigns) {
      for (const prospect of campaign.prospects) {
        await subsequenceManager.checkTriggers(prospect.id, campaign.id)
        triggersChecked++
      }
    }

    logger.info("Subsequence trigger processing completed", {
      triggersChecked,
      triggersExecuted,
    })

    return NextResponse.json({
      success: true,
      triggersChecked,
      triggersExecuted,
    })
  } catch (error) {
    // logger.error("Subsequence trigger processing error", { error })
    logger.error("Subsequence trigger processing error")
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
