import { NextResponse } from "next/server"
import { withApiAuth } from "@/lib/middleware/api-wrapper"
import { db } from "@/lib/db"
import { z } from "zod"

const updateProspectSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  status: z.enum(["ACTIVE", "CONTACTED", "REPLIED", "BOUNCED", "UNSUBSCRIBED", "COMPLETED"]).optional(),
  campaignId: z.string().nullable().optional(),
  folderId: z.string().nullable().optional(),
})

export const GET = withApiAuth("prospects:read")(async (request, context) => {
  try {
    const prospectId = request.nextUrl.pathname.split("/").pop()

    const prospect = await db.prospect.findFirst({
      where: {
        id: prospectId,
        userId: context.user.id,
      },
      include: {
        emailLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            subject: true,
            status: true,
            sentAt: true,
            openedAt: true,
            repliedAt: true,
            opens: true,
            clicks: true,
          },
        },
        replies: {
          orderBy: { repliedAt: "desc" },
          take: 5,
          select: {
            id: true,
            subject: true,
            body: true,
            sentiment: true,
            repliedAt: true,
          },
        },
      },
    })

    if (!prospect) {
      return NextResponse.json(
        {
          success: false,
          error: "Prospect not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: prospect,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching prospect:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch prospect",
      },
      { status: 500 },
    )
  }
})

export const PATCH = withApiAuth("prospects:write")(async (request, context) => {
  try {
    const prospectId = request.nextUrl.pathname.split("/").pop()
    const body = await request.json()
    const validated = updateProspectSchema.parse(body)

    const existingProspect = await db.prospect.findFirst({
      where: {
        id: prospectId,
        userId: context.user.id,
      },
    })

    if (!existingProspect) {
      return NextResponse.json(
        {
          success: false,
          error: "Prospect not found",
        },
        { status: 404 },
      )
    }

    const prospect = await db.prospect.update({
      where: { id: prospectId },
      data: validated,
    })

    return NextResponse.json({
      success: true,
      data: prospect,
    })
  } catch (error: any) {
    console.error("[v0] Error updating prospect:", error)

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
        error: error.message || "Failed to update prospect",
      },
      { status: 500 },
    )
  }
})

export const DELETE = withApiAuth("prospects:write")(async (request, context) => {
  try {
    const prospectId = request.nextUrl.pathname.split("/").pop()

    const existingProspect = await db.prospect.findFirst({
      where: {
        id: prospectId,
        userId: context.user.id,
      },
    })

    if (!existingProspect) {
      return NextResponse.json(
        {
          success: false,
          error: "Prospect not found",
        },
        { status: 404 },
      )
    }

    await db.prospect.delete({
      where: { id: prospectId },
    })

    return NextResponse.json({
      success: true,
      message: "Prospect deleted successfully",
    })
  } catch (error: any) {
    console.error("[v0] Error deleting prospect:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete prospect",
      },
      { status: 500 },
    )
  }
})
