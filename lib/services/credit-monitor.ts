import { db } from "../db"
import { resend } from "../resend"
import { logger } from "../logger"

const LOW_CREDIT_THRESHOLD = 20 // Alert when credits fall below this

export async function checkAndNotifyLowCredits(userId: string): Promise<void> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        emailCredits: true,
        researchCredits: true,
        lastCreditWarning: true,
      },
    })

    if (!user) return

    const shouldSendWarning =
      (user.emailCredits < LOW_CREDIT_THRESHOLD || user.researchCredits < LOW_CREDIT_THRESHOLD) &&
      (!user.lastCreditWarning ||
        new Date().getTime() - user.lastCreditWarning.getTime() > 24 * 60 * 60 * 1000) // 24 hours

    if (shouldSendWarning) {
      await resend.sendLowCreditsWarning(
        user.email,
        user.name || "User",
        user.emailCredits,
        user.researchCredits,
      )

      await db.user.update({
        where: { id: userId },
        data: { lastCreditWarning: new Date() },
      })

      logger.info("Low credits warning sent", { userId, emailCredits: user.emailCredits })
    }
  } catch (error) {
    logger.error("Failed to check/notify low credits", error as Error, { userId })
  }
}
