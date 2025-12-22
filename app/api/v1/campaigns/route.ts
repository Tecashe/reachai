import { NextResponse } from "next/server"
import { withApiAuth } from "@/lib/middleware/api-wrapper"
import { db } from "@/lib/db"
import { z } from "zod"
import { withCache, cache } from "@/lib/services/cache"
import { normalizePagination, createPaginationMeta } from "@/lib/utils/pagination"

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
    const search = searchParams.get("search")
    const { limit, offset } = normalizePagination({
      limit: searchParams.get("limit"),
      offset: searchParams.get("offset"),
    })
//s
    const cacheKey = `campaigns:${context.user.id}:${status || "all"}:${search || "none"}:${limit}:${offset}`

    const result = await withCache(
      cacheKey,
      async () => {
        const where: any = {
          userId: context.user.id,
        }

        if (status) {
          where.status = status
        }

        if (search) {
          where.name = {
            contains: search,
            mode: "insensitive",
          }
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

        return {
          campaigns,
          pagination: createPaginationMeta(total, limit, offset),
        }
      },
      { ttl: 60, tags: [`user:${context.user.id}:campaigns`] },
    )

    return NextResponse.json({
      success: true,
      data: result.campaigns,
      meta: result.pagination,
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

    await cache.invalidateTag(`user:${context.user.id}:campaigns`)

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
