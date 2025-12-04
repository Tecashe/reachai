import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: Promise<{ prospectId: string }> }) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { prospectId } = await params

    // Verify prospect belongs to user
    const prospect = await db.prospect.findUnique({
      where: { id: prospectId },
    })

    if (!prospect || prospect.userId !== user.id) {
      return NextResponse.json({ error: "Prospect not found" }, { status: 404 })
    }

    // Fetch email logs for activity
    const emailLogs = await db.emailLog.findMany({
      where: { prospectId },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    // Build activity timeline
    const activities = emailLogs.flatMap((log) => {
      const items = []

      // Sent
      if (log.sentAt) {
        items.push({
          id: `${log.id}-sent`,
          type: "sent",
          description: `Email sent: ${log.subject}`,
          timestamp: log.sentAt,
        })
      }

      // Opened
      if (log.opens > 0 && log.openedAt) {
        items.push({
          id: `${log.id}-opened`,
          type: "opened",
          description: "Email opened",
          timestamp: log.openedAt,
          metadata: { count: log.opens },
        })
      }

      // Clicked
      if (log.clicks > 0 && log.clickedAt) {
        items.push({
          id: `${log.id}-clicked`,
          type: "clicked",
          description: "Clicked link",
          timestamp: log.clickedAt,
          metadata: { count: log.clicks },
        })
      }

      // Replied
      if (log.repliedAt) {
        items.push({
          id: `${log.id}-replied`,
          type: "replied",
          description: "Replied to email",
          timestamp: log.repliedAt,
        })
      }

      // Bounced
      if (log.bouncedAt) {
        items.push({
          id: `${log.id}-bounced`,
          type: "bounced",
          description: "Email bounced",
          timestamp: log.bouncedAt,
        })
      }

      return items
    })

    // Sort by timestamp desc
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Activity fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 })
  }
}
