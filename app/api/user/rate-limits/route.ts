import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const feature = searchParams.get("feature") || "ai_generation"

    // Define limits per tier
    const limits = {
      FREE: { ai_generation: 50, research: 100 },
      STARTER: { ai_generation: 500, research: 1000 },
      PRO: { ai_generation: 2000, research: 5000 },
      AGENCY: { ai_generation: 10000, research: 20000 },
    }

    const tier = user.subscriptionTier || "FREE"
    const limit = limits[tier as keyof typeof limits]?.[feature as keyof typeof limits.FREE] || 50

    // Count usage this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    let used = 0
    if (feature === "ai_generation") {
      used = await db.prospect.count({
        where: {
          userId: user.id,
          generatedEmail: {
            not: undefined,
          },
          createdAt: {
            gte: startOfMonth,
          },
        },
      })
    }

    return NextResponse.json({
      feature,
      tier,
      limit,
      used,
      remaining: Math.max(0, limit - used),
      resetsAt: new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 1),
    })
  } catch (error) {
    console.error("[v0] Rate limit check error:", error)
    return NextResponse.json({ error: "Failed to check rate limits" }, { status: 500 })
  }
}
