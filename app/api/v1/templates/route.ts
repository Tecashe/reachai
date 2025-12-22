import { NextResponse } from "next/server"
import { withApiAuth } from "@/lib/middleware/api-wrapper"
import { db } from "@/lib/db"
import { z } from "zod"

const createTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  category: z.string().optional(),
  subject: z.string().min(1).max(500),
  body: z.string().min(1),
  variables: z
    .array(
      z.object({
        name: z.string(),
        required: z.boolean().default(false),
      }),
    )
    .optional(),
})

export const GET = withApiAuth("templates:read")(async (request, context) => {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    const where: any = {
      userId: context.user.id,
    }

    if (category) {
      where.category = category
    }

    const templates = await db.emailTemplate.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        subject: true,
        body: true,
        variables: true,
        timesUsed: true,
        avgOpenRate: true,
        avgReplyRate: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: templates,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching templates:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch templates",
      },
      { status: 500 },
    )
  }
})

export const POST = withApiAuth("templates:write")(async (request, context) => {
  try {
    const body = await request.json()
    const validated = createTemplateSchema.parse(body)

    const template = await db.emailTemplate.create({
      data: {
        ...validated,
        userId: context.user.id,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: template,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Error creating template:", error)

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
        error: error.message || "Failed to create template",
      },
      { status: 500 },
    )
  }
})
