import { NextResponse } from "next/server"
import { withApiAuth } from "@/lib/middleware/api-wrapper"
import { db } from "@/lib/db"
import { z } from "zod"

const sequenceStepSchema = z.object({
  templateId: z.string(),
  stepNumber: z.number().int().min(1),
  delayDays: z.number().int().min(0).default(2),
  sendOnlyIfNotReplied: z.boolean().default(true),
  sendOnlyIfNotOpened: z.boolean().default(false),
})

const createSequenceSchema = z.object({
  campaignId: z.string(),
  steps: z.array(sequenceStepSchema).min(1).max(10),
})

export const GET = withApiAuth("sequences:read")(async (request, context) => {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get("campaignId")

    if (!campaignId) {
      return NextResponse.json(
        {
          success: false,
          error: "campaignId is required",
        },
        { status: 400 },
      )
    }

    // Verify campaign belongs to user
    const campaign = await db.campaign.findFirst({
      where: {
        id: campaignId,
        userId: context.user.id,
      },
    })

    if (!campaign) {
      return NextResponse.json(
        {
          success: false,
          error: "Campaign not found",
        },
        { status: 404 },
      )
    }

    const sequences = await db.emailSequence.findMany({
      where: { campaignId },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            subject: true,
            body: true,
            category: true,
          },
        },
      },
      orderBy: { stepNumber: "asc" },
    })

    return NextResponse.json({
      success: true,
      data: sequences,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching sequences:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch sequences",
      },
      { status: 500 },
    )
  }
})

export const POST = withApiAuth("sequences:write")(async (request, context) => {
  try {
    const body = await request.json()
    const validated = createSequenceSchema.parse(body)

    // Verify campaign belongs to user
    const campaign = await db.campaign.findFirst({
      where: {
        id: validated.campaignId,
        userId: context.user.id,
      },
    })

    if (!campaign) {
      return NextResponse.json(
        {
          success: false,
          error: "Campaign not found",
        },
        { status: 404 },
      )
    }

    // Delete existing sequences for this campaign
    await db.emailSequence.deleteMany({
      where: { campaignId: validated.campaignId },
    })

    // Create new sequences
    const sequences = await db.emailSequence.createMany({
      data: validated.steps.map((step) => ({
        campaignId: validated.campaignId,
        ...step,
      })),
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          created: sequences.count,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Error creating sequences:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create sequences",
      },
      { status: 500 },
    )
  }
})
