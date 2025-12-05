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
// app/api/inbox/poll/route.ts
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { realtimeInbox } from "@/lib/services/realtime-inbox"

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const lastChecked = searchParams.get("lastChecked")
    const since = lastChecked ? new Date(lastChecked) : new Date(Date.now() - 60000)

    const notifications = await realtimeInbox.pollNotifications(user.id, since)

    console.log('[API Poll] Found notifications:', notifications.length) // Debug log

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("[API Poll] Error:", error)
    return NextResponse.json({ error: "Failed to poll inbox" }, { status: 500 })
  }
}