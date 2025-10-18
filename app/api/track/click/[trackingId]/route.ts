import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { trackingId: string } }) {
  try {
    const { trackingId } = params
    const { searchParams } = new URL(request.url)
    const targetUrl = searchParams.get("url")

    if (!targetUrl) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 })
    }

    // Find email log by tracking ID
    const log = await db.emailLog.findFirst({
      where: { trackingId },
    })

    if (log) {
      await db.emailLog.update({
        where: { id: log.id },
        data: {
          clickedAt: new Date(),
          clicks: { increment: 1 },
        },
      })

      if (log.prospectId) {
        await db.prospect.update({
          where: { id: log.prospectId },
          data: {
            emailsClicked: { increment: 1 },
          },
        })
      }
    }

    // Redirect to target URL
    return NextResponse.redirect(targetUrl)
  } catch (error) {
    console.error("[v0] Track click error:", error)
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 })
  }
}
