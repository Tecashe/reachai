import { NextResponse } from "next/server"
import { withApiAuth } from "@/lib/middleware/api-wrapper"
import { db } from "@/lib/db"
import { z } from "zod"
import crypto from "crypto"

const createWebhookSchema = z.object({
  url: z.string().url(),
  events: z
    .array(
      z.enum([
        "campaign.created",
        "campaign.launched",
        "campaign.paused",
        "campaign.completed",
        "email.sent",
        "email.opened",
        "email.clicked",
        "email.replied",
        "email.bounced",
        "prospect.created",
        "prospect.updated",
        "sequence.completed",
      ]),
    )
    .min(1),
})

export const GET = withApiAuth("webhooks:read")(async (request, context) => {
  try {
    const webhooks = await db.webhook.findMany({
      where: { userId: context.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        url: true,
        events: true,
        isActive: true, // Changed from 'active' to 'isActive' to match schema
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: webhooks,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching webhooks:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch webhooks",
      },
      { status: 500 },
    )
  }
})

export const POST = withApiAuth("webhooks:write")(async (request, context) => {
  try {
    const body = await request.json()
    const validated = createWebhookSchema.parse(body)

    const secret = crypto.randomBytes(32).toString("hex")

    const webhook = await db.webhook.create({
      data: {
        userId: context.user.id,
        url: validated.url,
        events: validated.events,
        secret,
        isActive: true, // Changed from 'active' to 'isActive' to match schema
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          id: webhook.id,
          url: webhook.url,
          events: webhook.events,
          secret: webhook.secret,
          isActive: webhook.isActive, // Changed from 'active' to 'isActive'
          createdAt: webhook.createdAt,
        },
        message: "Webhook created successfully. Save the secret - it will not be shown again.",
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Error creating webhook:", error)

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
        error: error.message || "Failed to create webhook",
      },
      { status: 500 },
    )
  }
})
