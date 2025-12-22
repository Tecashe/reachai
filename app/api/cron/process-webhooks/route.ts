import { NextResponse } from "next/server"
import { webhookService } from "@/lib/services/webhook-delivery"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await webhookService.processDeliveries()

    return NextResponse.json({
      success: true,
      message: "Webhook deliveries processed",
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("[CRON] Webhook processing failed:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
