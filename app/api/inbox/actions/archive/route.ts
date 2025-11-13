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

    const { replyIds, archive } = await req.json()

    if (archive) {
      await unifiedInbox.bulkArchive(replyIds)
    } else {
      for (const id of replyIds) {
        await unifiedInbox.unarchiveReply(id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to archive" }, { status: 500 })
  }
}
