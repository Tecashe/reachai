import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Return network health data
    // In production, this would query actual network statistics
    const networkHealth = {
      score: 95,
      totalSize: 15000,
      composition: {
        googleWorkspace: 96,
        office365: 3,
        other: 1,
      },
      averageReputation: 92,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(networkHealth)
  } catch (error) {
    console.error("Error fetching network health:", error)
    return NextResponse.json({ error: "Failed to fetch network data" }, { status: 500 })
  }
}
