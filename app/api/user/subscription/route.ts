import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({
      tier: user.subscriptionTier || "FREE",
      canUsePeerWarmup: ["PRO", "AGENCY"].includes(user.subscriptionTier || "FREE"),
    })
  } catch (error) {
    console.error("[v0] Error fetching subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
