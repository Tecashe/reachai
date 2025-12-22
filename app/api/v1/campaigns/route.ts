import { NextResponse } from "next/server"
import { withApiAuth } from "@/lib/middleware/api-wrapper"
import { db } from "@/lib/db"
import { z } from "zod"

const createCampaignSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  dailySendLimit: z.number().min(1).max(500).default(50),
  researchDepth: z.enum(["BASIC", "STANDARD", "DEEP"]).default("STANDARD"),
  personalizationLevel: z.enum(["LOW", "MEDIUM", "HIGH", "ULTRA"]).default("MEDIUM"),
  toneOfVoice: z.string().default("professional"),
})

export const GET = withApiAuth("campaigns:read")(async (request, context) => {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "50"), 100)
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const where: any = {
      userId: context.user.id,
    }

    if (status) {
      where.status = status
    }

    const [campaigns, total] = await Promise.all([
      db.campaign.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          dailySendLimit: true,
          totalProspects: true,
          emailsSent: true,
          emailsOpened: true,
          emailsReplied: true,
          emailsBounced: true,
          createdAt: true,
          launchedAt: true,
        },
      }),
      db.campaign.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        campaigns,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
    })
  } catch (error: any) {
    console.error("[v0] Error fetching campaigns:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch campaigns",
      },
      { status: 500 },
    )
  }
})

export const POST = withApiAuth("campaigns:write")(async (request, context) => {
  try {
    const body = await request.json()
    const validated = createCampaignSchema.parse(body)

    const campaign = await db.campaign.create({
      data: {
        ...validated,
        userId: context.user.id,
        status: "DRAFT",
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: campaign,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Error creating campaign:", error)

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
        error: error.message || "Failed to create campaign",
      },
      { status: 500 },
    )
  }
})
