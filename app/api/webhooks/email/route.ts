import { type NextRequest, NextResponse } from "next/server"
import { webhookHandler, type WebhookProvider } from "@/lib/services/webhook-handler"
import { logger } from "@/lib/logger"

/**
 * Unified webhook endpoint for all email providers
 * Route: POST /api/webhooks/email?provider=sendgrid
 */
export async function POST(request: NextRequest) {
  try {
    // Get provider from query param
    const provider = request.nextUrl.searchParams.get("provider") as WebhookProvider

    if (!provider) {
      return NextResponse.json({ error: "Provider parameter required" }, { status: 400 })
    }

    // Get signature headers (provider-specific)
    const signature =
      request.headers.get("x-webhook-signature") ||
      request.headers.get("x-twilio-email-event-webhook-signature") || // SendGrid
      request.headers.get("x-mailgun-signature") ||
      request.headers.get("stripe-signature") || // If using Resend with Stripe-like sigs
      undefined

    const timestamp =
      request.headers.get("x-webhook-timestamp") || request.headers.get("x-mailgun-timestamp") || undefined

    // Parse body
    const body = await request.json()

    logger.info("Webhook received", {
      provider,
      hasSignature: !!signature,
      hasTimestamp: !!timestamp,
    })

    // Process webhook
    const result = await webhookHandler.processWebhook(provider, body, signature, timestamp)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Webhook processing failed" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Webhook endpoint error", error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * Health check endpoint
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  })
}
