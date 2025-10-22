import { db } from "../db"
import { logger } from "../logger"

export async function resetMonthlyCredits() {
  logger.info("Starting monthly credit reset")

  try {
    const users = await db.user.findMany({
      where: {
        subscriptionStatus: "ACTIVE",
      },
    })

    const creditMap: Record<string, { email: number; research: number }> = {
      FREE: { email: 100, research: 50 },
      STARTER: { email: 1000, research: 500 },
      PRO: { email: 5000, research: 2500 },
      AGENCY: { email: 20000, research: 10000 },
    }

    for (const user of users) {
      const credits = creditMap[user.subscriptionTier]

      await db.user.update({
        where: { id: user.id },
        data: {
          emailCredits: credits.email,
          researchCredits: credits.research,
          emailsSentThisMonth: 0,
          prospectsThisMonth: 0,
          aiCreditsUsed: 0,
        },
      })
    }

    logger.info(`Monthly credits reset complete for ${users.length} users`)
  } catch (error) {
    logger.error("Credit reset failed", error as Error)
    throw error
  }
}

export async function processEmailQueue() {
  logger.info("Processing email queue")

  try {
    const queuedEmails = await db.emailLog.findMany({
      where: {
        status: "QUEUED",
        retryCount: { lt: 3 },
      },
      take: 100,
    })

    logger.info(`Found ${queuedEmails.length} queued emails to process`)

    // Process emails in batches
    // Implementation would go here
  } catch (error) {
    logger.error("Email queue processing failed", error as Error)
  }
}
