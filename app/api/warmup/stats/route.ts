


import { NextResponse } from "next/server"
import { warmupEmailManager } from "@/lib/services/warmup-email-manager"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stats = await warmupEmailManager.getWarmupPoolStats()
  
    return NextResponse.json({
      totalEmails: stats.poolSize,
      activeEmails: stats.poolActive,
      activeSessions: stats.activeAccounts,
      avgInboxPlacement: stats.avgInboxPlacement,
      totalInteractions: stats.totalInteractions,
      peerNetworkSize: stats.peerNetworkSize,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch warmup stats" }, { status: 500 })
  }
}
