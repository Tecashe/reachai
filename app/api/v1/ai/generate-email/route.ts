import { NextResponse } from "next/server"
import { withApiAuth } from "@/lib/middleware/api-wrapper"
import { z } from "zod"

const generateEmailSchema = z.object({
  prospectId: z.string(),
  templateId: z.string().optional(),
  tone: z.string().default("professional"),
  personalizationLevel: z.enum(["LOW", "MEDIUM", "HIGH", "ULTRA"]).default("MEDIUM"),
})

export const POST = withApiAuth("ai:use")(async (request, context) => {
  try {
    const body = await request.json()
    const validated = generateEmailSchema.parse(body)

    // This would integrate with your actual AI email generation service
    // For now, return a mock response structure
    const generatedEmail = {
      subject: "Quick question about scaling your sales team",
      body: `Hi {{firstName}},\n\nI noticed you're actively hiring for sales positions at {{company}}. Congratulations on the recent Series B funding!\n\nI wanted to reach out because many fast-growing companies like yours face challenges with outreach automation as they scale.\n\nWould you be open to a quick 15-minute call to discuss how we've helped similar companies streamline their sales outreach?\n\nBest regards,\n{{senderName}}`,
      qualityScore: 92,
      personalizationScore: 88,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: generatedEmail,
    })
  } catch (error: any) {
    console.error("[v0] Error generating email:", error)

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
        error: error.message || "Failed to generate email",
      },
      { status: 500 },
    )
  }
})
