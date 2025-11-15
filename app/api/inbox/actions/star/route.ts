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

    const { replyIds, starred } = await req.json()

    if (!Array.isArray(replyIds) || replyIds.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    await db.emailReply.updateMany({
      where: {
        id: { in: replyIds },
        prospect: { userId: user.id },
      },
      data: {
        isStarred: starred,
        starredAt: starred ? new Date() : null,
      },
    })

    logger.info(`${starred ? "Starred" : "Unstarred"} messages`, {
      userId: user.id,
      count: replyIds.length,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Star messages error", error as Error)
    return NextResponse.json({ error: "Failed to star messages" }, { status: 500 })
  }
}
