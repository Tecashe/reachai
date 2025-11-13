"use server"

import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { unifiedInbox } from "@/lib/services/unified-inbox"

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { replyIds, read } = await req.json()

    if (read) {
      await unifiedInbox.bulkMarkAsRead(replyIds)
    } else {
      for (const id of replyIds) {
        await unifiedInbox.markAsUnread(id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update read status" }, { status: 500 })
  }
}
