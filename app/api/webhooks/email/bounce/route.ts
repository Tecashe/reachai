import { type NextRequest, NextResponse } from "next/server"
import { bounceHandler } from "@/lib/services/bounce-handler"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate webhook signature (implement based on your email provider)
    // const signature = request.headers.get("x-webhook-signature")
    // if (!validateSignature(signature, body)) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    // }

    // Handle bounce event
    await bounceHandler.handleBounce({
      emailLogId: body.emailLogId,
      bounceType: body.bounceType,
      bounceReason: body.bounceReason,
      diagnosticCode: body.diagnosticCode,
      recipientEmail: body.recipientEmail,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Bounce webhook error", error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
