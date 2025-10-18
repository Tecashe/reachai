import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { trackingId: string } }) {
  try {
    const { trackingId } = params

    // Find email log by tracking ID
    const log = await db.emailLog.findFirst({
      where: { trackingId },
    })

    if (log) {
      await db.emailLog.update({
        where: { id: log.id },
        data: {
          openedAt: new Date(),
          opens: { increment: 1 },
        },
      })

      if (log.prospectId) {
        await db.prospect.update({
          where: { id: log.prospectId },
          data: {
            emailsOpened: { increment: 1 },
          },
        })
      }
    }

    // Return 1x1 transparent pixel
    const pixel = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64")

    return new NextResponse(pixel, {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("[v0] Track open error:", error)
    // Still return pixel even on error
    const pixel = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64")
    return new NextResponse(pixel, {
      headers: { "Content-Type": "image/gif" },
    })
  }
}
