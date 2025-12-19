
"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { logger } from "@/lib/logger"

export async function submitOnboardingQuestionnaire(data: {
  companyName: string
  userRole: string
  useCase: string
  monthlyVolume: string
}) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return { success: false, error: "Unauthorized" }
    }

    await db.user.update({
      where: { clerkId },
      data: {
        companyName: data.companyName,
        userRole: data.userRole,
        useCase: data.useCase,
        monthlyVolume: data.monthlyVolume,
        onboardingCompletedQuestionnaire: true,
      },
    })

    logger.info("User completed onboarding questionnaire", {
      clerkId,
      companyName: data.companyName,
      userRole: data.userRole,
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    logger.error("Failed to submit onboarding questionnaire", error as Error)
    return { success: false, error: "Failed to submit questionnaire" }
  }
}

export async function getOnboardingProgress() {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return { success: false, error: "Unauthorized" }
    }

    const user = await db.user.findUnique({
      where: { clerkId },
      select: {
        onboardingCompletedQuestionnaire: true,
        hasCreatedCampaign: true,
        hasAddedProspects: true,
        hasResearchedProspects: true,
        hasGeneratedEmail: true,
        hasSentEmail: true,
        hasViewedAnalytics: true,
        onboardingCompletedAt: true,
        createdAt: true,
        companyName: true,
        userRole: true,
        useCase: true,
        monthlyVolume: true,
      },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    const steps = [
      { key: "questionnaire", completed: user.onboardingCompletedQuestionnaire, label: "Complete questionnaire" },
      { key: "hasCreatedCampaign", completed: user.hasCreatedCampaign, label: "Create your first campaign" },
      { key: "hasAddedProspects", completed: user.hasAddedProspects, label: "Add prospects" },
      { key: "hasResearchedProspects", completed: user.hasResearchedProspects, label: "Research prospects" },
      { key: "hasGeneratedEmail", completed: user.hasGeneratedEmail, label: "Generate emails" },
      { key: "hasSentEmail", completed: user.hasSentEmail, label: "Send your first email" },
    ]

    const completedCount = steps.filter((s) => s.completed).length
    const totalSteps = steps.length
    const progress = Math.round((completedCount / totalSteps) * 100)

    return {
      success: true,
      data: {
        ...user,
        steps,
        completedCount,
        totalSteps,
        progress,
        isComplete: completedCount === totalSteps,
      },
    }
  } catch (error) {
    logger.error("Failed to get onboarding progress", error as Error)
    return { success: false, error: "Failed to get onboarding progress" }
  }
}

export async function updateOnboardingStep(step: string) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return { success: false, error: "Unauthorized" }
    }

    const validSteps = [
      "hasCreatedCampaign",
      "hasAddedProspects",
      "hasResearchedProspects",
      "hasGeneratedEmail",
      "hasSentEmail",
    ]

    if (!validSteps.includes(step)) {
      return { success: false, error: "Invalid step" }
    }

    const user = await db.user.findUnique({
      where: { clerkId },
      select: {
        id: true,
        hasCreatedCampaign: true,
        hasAddedProspects: true,
        hasResearchedProspects: true,
        hasGeneratedEmail: true,
        hasSentEmail: true,
        hasViewedAnalytics: true,
        onboardingCompletedQuestionnaire: true,
      },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Update the specific step
    await db.user.update({
      where: { clerkId },
      data: { [step]: true },
    })

    // Check if all steps are now complete
    const allSteps = [
      user.onboardingCompletedQuestionnaire,
      user.hasCreatedCampaign || step === "hasCreatedCampaign",
      user.hasAddedProspects || step === "hasAddedProspects",
      user.hasResearchedProspects || step === "hasResearchedProspects",
      user.hasGeneratedEmail || step === "hasGeneratedEmail",
      user.hasSentEmail || step === "hasSentEmail",
    ]

    const isComplete = allSteps.every((s) => s)

    // If all steps complete, mark onboarding as done
    if (isComplete) {
      await db.user.update({
        where: { clerkId },
        data: { onboardingCompletedAt: new Date() },
      })

      logger.info("User completed onboarding", { userId: user.id })
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    logger.error("Failed to update onboarding step", error as Error, { step })
    return { success: false, error: "Failed to update onboarding step" }
  }
}

export async function dismissOnboarding() {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return { success: false, error: "Unauthorized" }
    }

    await db.user.update({
      where: { clerkId },
      data: { onboardingCompletedAt: new Date() },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    logger.error("Failed to dismiss onboarding", error as Error)
    return { success: false, error: "Failed to dismiss onboarding" }
  }
}
