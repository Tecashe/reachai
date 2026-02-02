"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { triggerSequenceAutomation } from "@/lib/services/automation-engine"

import type { ProspectStatus, EnrollmentStatus, ExitReason } from "@prisma/client"

/**
 * Bulk enroll campaign prospects into a sequence
 */
export async function enrollCampaignInSequence(campaignId: string, sequenceId: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error("User not found")

    // Verify campaign ownership
    const campaign = await db.campaign.findFirst({
      where: { id: campaignId, userId: user.id },
      include: {
        prospects: {
          where: {
            status: { in: ["ACTIVE"] as ProspectStatus[] },
            bounced: false,
            unsubscribed: false,
          },
        },
      },
    })

    if (!campaign) throw new Error("Campaign not found")

    // Verify sequence ownership and get first step
    const sequence = await db.sequence.findFirst({
      where: { id: sequenceId, userId: user.id },
      include: {
        steps: {
          orderBy: { order: "asc" },
        },
      },
    })

    if (!sequence) throw new Error("Sequence not found")
    if (sequence.status !== "ACTIVE") throw new Error("Sequence must be active to enroll prospects")
    if (!sequence.steps || sequence.steps.length === 0) throw new Error("Sequence has no steps")

    const firstStep = sequence.steps[0]

    // Calculate initial delay for first step
    let nextStepAt = new Date()
    if (firstStep.delayValue > 0) {
      const delayMs = calculateDelayInMs(firstStep.delayValue, firstStep.delayUnit)
      nextStepAt = new Date(Date.now() + delayMs)
    }

    // Bulk create enrollments
    const enrollments = campaign.prospects.map((prospect) => ({
      sequenceId: sequence.id,
      prospectId: prospect.id,
      status: "ACTIVE" as EnrollmentStatus,
      currentStep: 0, // Will start at step 0, move to 1 after first execution
      enrolledAt: new Date(),
      nextStepAt: nextStepAt,
      emailsSent: 0,
      emailsOpened: 0,
      emailsClicked: 0,
      replied: false,
    }))

    await db.sequenceEnrollment.createMany({
      data: enrollments,
      skipDuplicates: true,
    })

    // Update sequence stats
    await db.sequence.update({
      where: { id: sequenceId },
      data: {
        totalEnrolled: { increment: enrollments.length },
      },
    })

    await db.campaign.update({
      where: { id: campaignId },
      data: {
        status: "ACTIVE",
        launchedAt: new Date(),
      },
    })

    revalidatePath(`/dashboard/campaigns/${campaignId}`)
    revalidatePath(`/dashboard/sequences/${sequenceId}`)

    // Trigger automation for each enrolled prospect
    for (const prospect of campaign.prospects) {
      try {
        await triggerSequenceAutomation('SEQUENCE_ENROLLED', {
          sequenceId: sequence.id,
          prospectId: prospect.id,
          userId: user.id,
          campaignId,
        })
      } catch (automationError) {
        console.warn('Failed to trigger automation for sequence enrollment', automationError)
      }
    }

    return {
      success: true,
      enrolledCount: enrollments.length,
    }
  } catch (error) {
    console.error("[v0] Enrollment error:", error)
    throw error
  }
}

/**
 * Remove a prospect from sequence enrollment
 */
export async function unenrollProspect(enrollmentId: string, reason?: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error("User not found")

    const enrollment = await db.sequenceEnrollment.update({
      where: { id: enrollmentId },
      data: {
        status: "MANUALLY_REMOVED" as EnrollmentStatus,
        exitReason: "MANUAL" as ExitReason,
        exitedAt: new Date(),
      },
      include: {
        prospect: true,
        sequence: true,
      },
    })

    // Trigger automation for sequence exit
    try {
      await triggerSequenceAutomation('SEQUENCE_EXITED', {
        sequenceId: enrollment.sequenceId,
        prospectId: enrollment.prospectId,
        userId: user.id,
        exitReason: 'MANUAL',
      })
    } catch (automationError) {
      console.warn('Failed to trigger automation for sequence exit', automationError)
    }

    revalidatePath("/dashboard/sequences")

    return { success: true }
  } catch (error) {
    console.error("[v0] Unenroll error:", error)
    throw error
  }
}

/**
 * Pause sequence enrollment
 */
export async function pauseEnrollment(enrollmentId: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await db.sequenceEnrollment.update({
      where: { id: enrollmentId },
      data: {
        status: "PAUSED" as EnrollmentStatus,
        pausedAt: new Date(),
      },
    })

    revalidatePath("/dashboard/sequences")

    return { success: true }
  } catch (error) {
    console.error("[v0] Pause enrollment error:", error)
    throw error
  }
}

/**
 * Resume sequence enrollment
 */
export async function resumeEnrollment(enrollmentId: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await db.sequenceEnrollment.update({
      where: { id: enrollmentId },
      data: {
        status: "ACTIVE" as EnrollmentStatus,
        pausedAt: null,
      },
    })

    revalidatePath("/dashboard/sequences")

    return { success: true }
  } catch (error) {
    console.error("[v0] Resume enrollment error:", error)
    throw error
  }
}

/**
 * Calculate delay in milliseconds
 */
function calculateDelayInMs(value: number, unit: string): number {
  switch (unit) {
    case "MINUTES":
      return value * 60 * 1000
    case "HOURS":
      return value * 60 * 60 * 1000
    case "DAYS":
      return value * 24 * 60 * 60 * 1000
    case "WEEKS":
      return value * 7 * 24 * 60 * 60 * 1000
    default:
      return 0
  }
}
