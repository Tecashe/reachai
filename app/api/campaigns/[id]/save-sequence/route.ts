
import { type NextRequest, NextResponse } from "next/server"
import { protectApiRoute } from "@/lib/api-protection"
import { db } from "@/lib/db"

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { error, user } = await protectApiRoute()
    if (error) return error

    try {
        const campaignId = params.id
        const body = await request.json()
        const { steps } = body

        if (!Array.isArray(steps) || steps.length === 0) {
            return NextResponse.json({ error: "Invalid steps data" }, { status: 400 })
        }

        // Verify ownership
        const campaign = await db.campaign.findUnique({
            where: { id: campaignId, userId: user!.id },
        })

        if (!campaign) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
        }

        // Transaction to replace sequence
        await db.$transaction(async (tx) => {
            // 1. Delete existing sequence steps for this campaign
            await tx.emailSequence.deleteMany({
                where: { campaignId },
            })

            // 2. Create new steps and templates
            // Note: In a real app, you might want to reuse templates or manage them better.
            // Here we create fresh templates for the sequence.
            for (let i = 0; i < steps.length; i++) {
                const step = steps[i]

                // Create template
                const template = await tx.emailTemplate.create({
                    data: {
                        userId: user!.id,
                        name: `${campaign.name} - Step ${i + 1}`,
                        subject: step.subject,
                        body: step.body,
                        isSystemTemplate: false,
                        templateType: "TEXT"
                    }
                })

                // Create sequence step
                await tx.emailSequence.create({
                    data: {
                        campaignId,
                        templateId: template.id,
                        stepNumber: i + 1,
                        delayDays: step.delayDays,
                        sendOnlyIfNotReplied: true // Default
                    }
                })
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[builtbycashe] Convert sequence error:", error)
        return NextResponse.json({ error: "Failed to save sequence" }, { status: 500 })
    }
}
