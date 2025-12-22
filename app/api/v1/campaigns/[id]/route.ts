import { NextResponse } from "next/server"
import { withApiAuth } from "@/lib/middleware/api-wrapper"
import { db } from "@/lib/db"
import { z } from "zod"

const updateCampaignSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  dailySendLimit: z.number().min(1).max(500).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"]).optional(),
})

export const GET = withApiAuth("campaigns:read")(async (request, context) => {
  try {
    const campaignId = request.nextUrl.pathname.split("/").pop()

    const campaign = await db.campaign.findFirst({
      where: {
        id: campaignId,
        userId: context.user.id,
      },
      include: {
        prospects: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            status: true,
          },
          take: 10,
        },
        emailSequences: {
          include: {
            template: {
              select: {
                id: true,
                name: true,
                subject: true,
              },
            },
          },
          orderBy: { stepNumber: "asc" },
        },
        _count: {
          select: {
            prospects: true,
          },
        },
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

    return NextResponse.json({
      success: true,
      data: campaign,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching campaign:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch campaign",
      },
      { status: 500 },
    )
  }
})

export const PATCH = withApiAuth("campaigns:write")(async (request, context) => {
  try {
    const campaignId = request.nextUrl.pathname.split("/").pop()
    const body = await request.json()
    const validated = updateCampaignSchema.parse(body)

    const existingCampaign = await db.campaign.findFirst({
      where: {
        id: campaignId,
        userId: context.user.id,
      },
    })

    if (!existingCampaign) {
      return NextResponse.json(
        {
          success: false,
          error: "Campaign not found",
        },
        { status: 404 },
      )
    }

    const campaign = await db.campaign.update({
      where: { id: campaignId },
      data: validated,
    })

    return NextResponse.json({
      success: true,
      data: campaign,
    })
  } catch (error: any) {
    console.error("[v0] Error updating campaign:", error)

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
        error: error.message || "Failed to update campaign",
      },
      { status: 500 },
    )
  }
})

export const DELETE = withApiAuth("campaigns:write")(async (request, context) => {
  try {
    const campaignId = request.nextUrl.pathname.split("/").pop()

    const existingCampaign = await db.campaign.findFirst({
      where: {
        id: campaignId,
        userId: context.user.id,
      },
    })

    if (!existingCampaign) {
      return NextResponse.json(
        {
          success: false,
          error: "Campaign not found",
        },
        { status: 404 },
      )
    }

    await db.campaign.delete({
      where: { id: campaignId },
    })

    return NextResponse.json({
      success: true,
      message: "Campaign deleted successfully",
    })
  } catch (error: any) {
    console.error("[v0] Error deleting campaign:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete campaign",
      },
      { status: 500 },
    )
  }
})
