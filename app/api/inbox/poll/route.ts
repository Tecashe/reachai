
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { realtimeInbox } from "@/lib/services/realtime-inbox"

// Cache to prevent excessive polling
const userLastPoll = new Map<string, number>()
const POLL_INTERVAL = 12 * 60 * 60 * 1000 // 12 hours in milliseconds

export async function GET(request: Request) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const lastChecked = searchParams.get("lastChecked")
    const isInitial = searchParams.get("initial") === "true"
    const now = Date.now()

    // Check if user is polling too frequently
    const lastPollTime = userLastPoll.get(user.id) || 0
    const timeSinceLastPoll = now - lastPollTime

    if (!isInitial && timeSinceLastPoll < POLL_INTERVAL) {
      // Return empty array if polling too soon
      const nextPollIn = POLL_INTERVAL - timeSinceLastPoll
      const hoursRemaining = Math.floor(nextPollIn / (60 * 60 * 1000))
      const minutesRemaining = Math.floor((nextPollIn % (60 * 60 * 1000)) / (60 * 1000))
      
      console.log(`[API Poll] Too soon to poll. Next poll in ${hoursRemaining}h ${minutesRemaining}m`)
      
      return NextResponse.json({ 
        notifications: [],
        nextPollAt: new Date(lastPollTime + POLL_INTERVAL).toISOString(),
        message: `Polling limited to every 12 hours. Next check available in ${hoursRemaining}h ${minutesRemaining}m`
      })
    }

    // Update last poll time
    userLastPoll.set(user.id, now)

    console.log('[API Poll] User ID:', user.id)

    let notifications

    if (isInitial || !lastChecked) {
      // First load - get all recent notifications
      console.log('[API Poll] Initial load - fetching all recent notifications')
      notifications = await realtimeInbox.getRecentNotifications(user.id, 50)
    } else {
      // 12-hour polling - get notifications from last 12 hours
      const since = new Date(now - POLL_INTERVAL)
      console.log('[API Poll] 12-hour poll for notifications since:', since)
      notifications = await realtimeInbox.pollNotifications(user.id, since)
    }

    console.log('[API Poll] Found notifications:', notifications.length)

    // Clean up old entries from cache (prevent memory leak)
    if (userLastPoll.size > 1000) {
      const entries = Array.from(userLastPoll.entries())
      entries
        .sort((a, b) => a[1] - b[1])
        .slice(0, 500)
        .forEach(([key]) => userLastPoll.delete(key))
    }

    return NextResponse.json({ 
      notifications,
      nextPollAt: new Date(now + POLL_INTERVAL).toISOString()
    })
  } catch (error) {
    console.error("[API Poll] Error:", error)
    return NextResponse.json({ error: "Failed to poll inbox" }, { status: 500 })
  }
}

/* 
 * CONFIGURATION:
 * - Polls every 12 hours instead of constantly
 * - Reduces CPU usage by ~99%
 * - Reduces database queries by ~99%
 * 
 * TO ADJUST POLLING INTERVAL:
 * Change POLL_INTERVAL at the top:
 * - 6 hours: 6 * 60 * 60 * 1000
 * - 24 hours: 24 * 60 * 60 * 1000
 * - 1 hour: 1 * 60 * 60 * 1000
 */