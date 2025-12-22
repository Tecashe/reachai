import { NextResponse } from "next/server"
import { withApiAuth } from "@/lib/middleware/api-wrapper"
import { db } from "@/lib/db"
import { z } from "zod"

const createProspectSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  campaignId: z.string().optional(),
  folderId: z.string().optional(),
})

const bulkCreateProspectsSchema = z.object({
  prospects: z.array(createProspectSchema).min(1).max(1000),
})

export const GET = withApiAuth("prospects:read")(async (request, context) => {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get("campaignId")
    const folderId = searchParams.get("folderId")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "50"), 100)
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const where: any = {
      userId: context.user.id,
      isTrashed: false,
    }

    if (campaignId) {
      where.campaignId = campaignId
    }

    if (folderId) {
      where.folderId = folderId
    }

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ]
    }

    const [prospects, total] = await Promise.all([
      db.prospect.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          company: true,
          jobTitle: true,
          status: true,
          qualityScore: true,
          replied: true,
          bounced: true,
          unsubscribed: true,
          emailsReceived: true,
          emailsOpened: true,
          emailsReplied: true,
          createdAt: true,
          lastContactedAt: true,
        },
      }),
      db.prospect.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        prospects,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
    })
  } catch (error: any) {
    console.error("[v0] Error fetching prospects:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch prospects",
      },
      { status: 500 },
    )
  }
})

export const POST = withApiAuth("prospects:write")(async (request, context) => {
  try {
    const body = await request.json()

    // Check if bulk or single create
    if (Array.isArray(body.prospects)) {
      const validated = bulkCreateProspectsSchema.parse(body)

      const prospects = await db.prospect.createMany({
        data: validated.prospects.map((p) => ({
          ...p,
          userId: context.user.id,
        })),
        skipDuplicates: true,
      })

      return NextResponse.json(
        {
          success: true,
          data: {
            created: prospects.count,
          },
        },
        { status: 201 },
      )
    } else {
      const validated = createProspectSchema.parse(body)

      const prospect = await db.prospect.create({
        data: {
          ...validated,
          userId: context.user.id,
        },
      })

      return NextResponse.json(
        {
          success: true,
          data: prospect,
        },
        { status: 201 },
      )
    }
  } catch (error: any) {
    console.error("[v0] Error creating prospect(s):", error)

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
        error: error.message || "Failed to create prospect(s)",
      },
      { status: 500 },
    )
  }
})
