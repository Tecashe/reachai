import { type NextRequest, NextResponse } from "next/server"
import { replyDetector } from "@/lib/services/reply-detector"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate webhook signature
    // const signature = request.headers.get("x-webhook-signature")
    // if (!validateSignature(signature, body)) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    // }

    // Handle reply event
    await replyDetector.handleReply({
      emailLogId: body.emailLogId,
      fromEmail: body.fromEmail,
      subject: body.subject,
      body: body.body,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Reply webhook error", error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
