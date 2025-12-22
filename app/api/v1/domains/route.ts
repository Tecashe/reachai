import { NextResponse } from "next/server"
import { withApiAuth } from "@/lib/middleware/api-wrapper"
import { db } from "@/lib/db"
import { z } from "zod"

const createDomainSchema = z.object({
  domain: z.string().min(1).max(255),
  recordType: z.enum(["subdomain", "main"]).default("subdomain"),
})

export const GET = withApiAuth("email:read")(async (request, context) => {
  try {
    const { searchParams } = new URL(request.url)
    const isVerified = searchParams.get("isVerified")

    const where: any = {
      userId: context.user.id,
    }

    if (isVerified !== null) {
      where.isVerified = isVerified === "true"
    }

    const domains = await db.domain.findMany({
      where,
      select: {
        id: true,
        domain: true,
        recordType: true,
        isVerified: true,
        verifiedAt: true,
        healthScore: true,
        isBlacklisted: true,
        blacklistedOn: true,
        bounceRate: true,
        spamComplaintRate: true,
        lastHealthCheck: true,
        isActive: true,
        createdAt: true,
        deliverabilityHealth: {
          select: {
            spfStatus: true,
            spfValid: true,
            dkimStatus: true,
            dkimValid: true,
            dmarcStatus: true,
            dmarcValid: true,
            senderReputation: true,
            hasIssues: true,
            alertLevel: true,
            alertMessage: true,
          },
        },
        _count: {
          select: {
            sendingAccounts: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: domains,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching domains:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch domains",
      },
      { status: 500 },
    )
  }
})

export const POST = withApiAuth("email:write")(async (request, context) => {
  try {
    const body = await request.json()
    const validated = createDomainSchema.parse(body)

    // Check for duplicate domain
    const existing = await db.domain.findFirst({
      where: {
        userId: context.user.id,
        domain: validated.domain,
      },
    })

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Domain already exists",
        },
        { status: 409 },
      )
    }

    const domain = await db.domain.create({
      data: {
        ...validated,
        userId: context.user.id,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: domain,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Error creating domain:", error)

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
        error: error.message || "Failed to create domain",
      },
      { status: 500 },
    )
  }
})
