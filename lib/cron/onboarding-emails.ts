import { db } from "@/lib/db"
import { resend } from "@/lib/resend"
import { logger } from "@/lib/logger"

export async function sendOnboardingReminders() {
  try {
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Find users who haven't completed onboarding
    const incompleteUsers = await db.user.findMany({
      where: {
        onboardingCompletedAt: null,
        OR: [
          // Day 3 reminder -haven't received any emails yet
          {
            createdAt: {
              lte: threeDaysAgo,
              gte: sevenDaysAgo,
            },
            onboardingEmailsSent: 0,
          },
          // Day 7 final reminder - received first email but not second
          {
            createdAt: {
              lte: sevenDaysAgo,
            },
            onboardingEmailsSent: 1,
          },
        ],
      },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        hasCreatedCampaign: true,
        hasAddedProspects: true,
        hasResearchedProspects: true,
        hasGeneratedEmail: true,
        hasSentEmail: true,
        hasViewedAnalytics: true,
        onboardingEmailsSent: true,
        createdAt: true,
      },
    })

    for (const user of incompleteUsers) {
      const completedSteps = [
        user.hasCreatedCampaign,
        user.hasAddedProspects,
        user.hasResearchedProspects,
        user.hasGeneratedEmail,
        user.hasSentEmail,
        user.hasViewedAnalytics,
      ].filter(Boolean).length

      const progress = Math.round((completedSteps / 6) * 100)
      const remainingSteps = 6 - completedSteps

      const isFirstEmail = user.onboardingEmailsSent === 0
      const subject = isFirstEmail
        ? "🚀 You're almost there! Complete your mailfra setup"
        : "⏰ Final reminder: Unlock the full power of mailfra"

      try {
        await resend.sendOnboardingReminder(
          user.email,
          user.firstName || user.name || "there",
          progress,
          remainingSteps,
          isFirstEmail,
        )

        await db.user.update({
          where: { id: user.id },
          data: {
            onboardingEmailsSent: user.onboardingEmailsSent + 1,
            lastOnboardingEmailSent: new Date(),
          },
        })

       
      } catch (error) {
        logger.error("Failed to send onboarding reminder", error as Error, {
          userId: user.id,
          email: user.email,
        })
      }
    }

    return { success: true, processed: incompleteUsers.length }
  } catch (error) {
    logger.error("Failed to process onboarding reminders", error as Error)
    throw error
  }
}
