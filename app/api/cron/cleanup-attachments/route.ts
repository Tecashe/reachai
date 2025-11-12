import { NextResponse } from "next/server"
import { attachmentManager } from "@/lib/services/attachment-manager"

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    console.log("[v0] Starting attachment cleanup cron job")

    // Delete attachments older than 90 days
    const deletedCount = await attachmentManager.cleanupOldAttachments(90)

    console.log("[v0] Attachment cleanup complete", { deletedCount })

    return NextResponse.json({
      success: true,
      deletedCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Attachment cleanup cron error:", error)
    return NextResponse.json({ success: false, error: "Failed to cleanup attachments" }, { status: 500 })
  }
}
