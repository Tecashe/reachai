import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { replyIds, snoozeUntil } = await req.json()

    if (!Array.isArray(replyIds) || replyIds.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    await db.emailReply.updateMany({
      where: {
        id: { in: replyIds },
        prospect: { userId: user.id },
      },
      data: {
        isArchived: true,
        archivedAt: new Date(),
        snoozedUntil: new Date(snoozeUntil),
      },
    })

    logger.info("Snoozed messages", {
      userId: user.id,
      count: replyIds.length,
      until: snoozeUntil,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Snooze error", error as Error)
    return NextResponse.json({ error: "Failed to snooze messages" }, { status: 500 })
  }
}
