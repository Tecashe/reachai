// import { NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { realtimeInbox } from "@/lib/services/realtime-inbox"

// export async function GET(request: Request) {
//   try {
//     const { userId: clerkId } = await auth()
//     if (!clerkId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const user = await db.user.findUnique({
//       where: { clerkId },
//     })

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     const { searchParams } = new URL(request.url)
//     const lastChecked = searchParams.get("lastChecked")
//     const since = lastChecked ? new Date(lastChecked) : new Date(Date.now() - 60000) // Last minute

//     const notifications = await realtimeInbox.pollNotifications(user.id, since)

//     return NextResponse.json({ notifications })
//   } catch (error) {
//     console.error("[v0] Inbox poll error:", error)
//     return NextResponse.json({ error: "Failed to poll inbox" }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { realtimeInbox } from "@/lib/services/realtime-inbox"

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { notificationIds } = body

    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return NextResponse.json({ error: "Invalid notification IDs" }, { status: 400 })
    }

    await realtimeInbox.markAsDelivered(notificationIds)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Mark delivered error:", error)
    return NextResponse.json({ error: "Failed to mark as delivered" }, { status: 500 })
  }
}