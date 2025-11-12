import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { companySendLimits } from "@/lib/services/company-send-limits"

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

    const { emails } = await request.json()

    const results = await companySendLimits.bulkCheckLimits(user.id, emails)

    // Convert Map to object for JSON response
    const resultsObject = Object.fromEntries(results)

    return NextResponse.json({ limits: resultsObject })
  } catch (error) {
    console.error("[v0] Company limits check error:", error)
    return NextResponse.json({ error: "Failed to check limits" }, { status: 500 })
  }
}
