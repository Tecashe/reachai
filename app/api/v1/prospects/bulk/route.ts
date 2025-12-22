import { NextResponse } from "next/server"
import { withApiAuth } from "@/lib/middleware/api-wrapper"
import { db } from "@/lib/db"
import { z } from "zod"

const bulkCreateProspectsSchema = z.object({
  campaignId: z.string().optional(),
  prospects: z
    .array(
      z.object({
        email: z.string().email(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        company: z.string().optional(),
        jobTitle: z.string().optional(),
        linkedinUrl: z.string().url().optional(),
      }),
    )
    .min(1)
    .max(1000),
})

export const POST = withApiAuth("prospects:write")(async (request, context) => {
  try {
    const body = await request.json()
    const validated = bulkCreateProspectsSchema.parse(body)

    const prospects = await db.$transaction(
      validated.prospects.map((prospect) =>
        db.prospect.create({
          data: {
            ...prospect,
            userId: context.user.id,
            campaignId: validated.campaignId,
            status: "ACTIVE",
          },
        }),
      ),
    )

    return NextResponse.json(
      {
        success: true,
        data: {
          created: prospects.length,
          prospects: prospects.map((p) => ({
            id: p.id,
            email: p.email,
          })),
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Error bulk creating prospects:", error)

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
        error: error.message || "Failed to bulk create prospects",
      },
      { status: 500 },
    )
  }
})
