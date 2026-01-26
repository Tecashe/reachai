"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import type { StepType, DelayUnit } from "@prisma/client"

interface SequenceStepInput {
    order: number
    stepType: StepType
    delayValue: number
    delayUnit: DelayUnit
    subject?: string | null
    body?: string | null
    linkedInMessage?: string | null
    callScript?: string | null
    taskTitle?: string | null
    taskDescription?: string | null
    internalNotes?: string | null
}

/**
 * Create a new Sequence from the campaign wizard
 * This saves the sequence to the main sequences dashboard
 */
export async function createSequenceForCampaign(
    userId: string,
    campaignId: string,
    sequenceName: string,
    steps: SequenceStepInput[]
): Promise<{ success: boolean; sequenceId?: string; error?: string }> {
    try {
        // Get campaign to inherit settings
        const campaign = await db.campaign.findFirst({
            where: { id: campaignId, userId },
        })

        if (!campaign) {
            return { success: false, error: "Campaign not found" }
        }

        // Create the sequence
        const sequence = await db.sequence.create({
            data: {
                userId,
                name: sequenceName,
                description: `Created for campaign: ${campaign.name}`,
                status: "DRAFT",
                timezone: "America/New_York",
                sendInBusinessHours: true,
                businessHoursStart: "09:00",
                businessHoursEnd: "17:00",
                businessDays: [1, 2, 3, 4, 5],
                dailySendLimit: campaign.dailySendLimit,
                trackOpens: campaign.trackOpens,
                trackClicks: campaign.trackClicks,
                toneOfVoice: campaign.toneOfVoice,
                aiPersonalization: true,
                totalSteps: steps.length,
            },
        })

        // Create all steps
        for (const step of steps) {
            await db.sequenceStep.create({
                data: {
                    sequenceId: sequence.id,
                    order: step.order,
                    stepType: step.stepType,
                    delayValue: step.delayValue,
                    delayUnit: step.delayUnit,
                    subject: step.subject,
                    body: step.body,
                    linkedInMessage: step.linkedInMessage,
                    callScript: step.callScript,
                    taskTitle: step.taskTitle,
                    taskDescription: step.taskDescription,
                    internalNotes: step.internalNotes,
                    skipIfReplied: true,
                    skipIfBounced: true,
                    spintaxEnabled: false,
                },
            })
        }

        // Link the sequence to the campaign
        await db.campaign.update({
            where: { id: campaignId },
            data: { sequenceId: sequence.id },
        })

        revalidatePath("/dashboard/sequences")
        revalidatePath(`/dashboard/campaigns/${campaignId}`)

        return { success: true, sequenceId: sequence.id }
    } catch (error) {
        console.error("[createSequenceForCampaign] Error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create sequence",
        }
    }
}

/**
 * Update an existing sequence from the campaign wizard
 */
export async function updateSequenceFromCampaign(
    userId: string,
    sequenceId: string,
    sequenceName: string,
    steps: SequenceStepInput[]
): Promise<{ success: boolean; error?: string }> {
    try {
        // Verify ownership
        const sequence = await db.sequence.findFirst({
            where: { id: sequenceId, userId },
        })

        if (!sequence) {
            return { success: false, error: "Sequence not found" }
        }

        // Update sequence name
        await db.sequence.update({
            where: { id: sequenceId },
            data: {
                name: sequenceName,
                totalSteps: steps.length,
                updatedAt: new Date(),
            },
        })

        // Delete existing steps
        await db.sequenceStep.deleteMany({
            where: { sequenceId },
        })

        // Create new steps
        for (const step of steps) {
            await db.sequenceStep.create({
                data: {
                    sequenceId,
                    order: step.order,
                    stepType: step.stepType,
                    delayValue: step.delayValue,
                    delayUnit: step.delayUnit,
                    subject: step.subject,
                    body: step.body,
                    linkedInMessage: step.linkedInMessage,
                    callScript: step.callScript,
                    taskTitle: step.taskTitle,
                    taskDescription: step.taskDescription,
                    internalNotes: step.internalNotes,
                    skipIfReplied: true,
                    skipIfBounced: true,
                    spintaxEnabled: false,
                },
            })
        }

        revalidatePath("/dashboard/sequences")
        revalidatePath(`/dashboard/sequences/${sequenceId}`)

        return { success: true }
    } catch (error) {
        console.error("[updateSequenceFromCampaign] Error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update sequence",
        }
    }
}

/**
 * Link an existing sequence to a campaign
 */
export async function linkSequenceToCampaign(
    userId: string,
    campaignId: string,
    sequenceId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // Verify ownership of both
        const [campaign, sequence] = await Promise.all([
            db.campaign.findFirst({ where: { id: campaignId, userId } }),
            db.sequence.findFirst({ where: { id: sequenceId, userId } }),
        ])

        if (!campaign) {
            return { success: false, error: "Campaign not found" }
        }

        if (!sequence) {
            return { success: false, error: "Sequence not found" }
        }

        // Link them
        await db.campaign.update({
            where: { id: campaignId },
            data: { sequenceId },
        })

        revalidatePath(`/dashboard/campaigns/${campaignId}`)

        return { success: true }
    } catch (error) {
        console.error("[linkSequenceToCampaign] Error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to link sequence",
        }
    }
}

/**
 * Get campaign with its linked sequence
 */
export async function getCampaignWithSequence(userId: string, campaignId: string) {
    const campaign = await db.campaign.findFirst({
        where: { id: campaignId, userId },
        include: {
            prospects: {
                take: 5,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    company: true,
                    jobTitle: true,
                    researchData: true,
                    qualityScore: true,
                },
            },
            _count: {
                select: { prospects: true },
            },
        },
    })

    if (!campaign) return null

    // Get linked sequence if exists
    let sequence = null
    if (campaign.sequenceId) {
        sequence = await db.sequence.findFirst({
            where: { id: campaign.sequenceId, userId },
            include: {
                steps: {
                    orderBy: { order: "asc" },
                },
            },
        })
    }

    return { campaign, sequence }
}
