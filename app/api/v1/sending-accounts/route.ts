import { NextResponse } from "next/server"
import { withApiAuth } from "@/lib/middleware/api-wrapper"
import { db } from "@/lib/db"
import { z } from "zod"

const createAccountSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  provider: z.enum(["resend", "gmail", "outlook"]),
  credentials: z.record(z.any()),
  dailyLimit: z.number().int().min(1).max(500).default(50),
  hourlyLimit: z.number().int().min(1).max(50).default(10),
  warmupEnabled: z.boolean().default(true),
  domainId: z.string().optional(),
})

export const GET = withApiAuth("email:read")(async (request, context) => {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get("isActive")

    const where: any = {
      userId: context.user.id,
    }

    if (isActive !== null) {
      where.isActive = isActive === "true"
    }

    const accounts = await db.sendingAccount.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        provider: true,
        isActive: true,
        healthScore: true,
        bounceRate: true,
        replyRate: true,
        openRate: true,
        warmupEnabled: true,
        warmupStage: true,
        dailyLimit: true,
        emailsSentToday: true,
        lastHealthCheck: true,
        createdAt: true,
        domain: {
          select: {
            id: true,
            domain: true,
            isVerified: true,
            healthScore: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: accounts,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching sending accounts:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch sending accounts",
      },
      { status: 500 },
    )
  }
})

export const POST = withApiAuth("email:write")(async (request, context) => {
  try {
    const body = await request.json()
    const validated = createAccountSchema.parse(body)

    // Check for duplicate email
    const existing = await db.sendingAccount.findFirst({
      where: {
        userId: context.user.id,
        email: validated.email,
      },
    })

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Sending account with this email already exists",
        },
        { status: 409 },
      )
    }

    const account = await db.sendingAccount.create({
      data: {
        ...validated,
        userId: context.user.id,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Error creating sending account:", error)

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
        error: error.message || "Failed to create sending account",
      },
      { status: 500 },
    )
  }
})
