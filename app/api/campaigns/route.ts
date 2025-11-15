import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUserFromDb()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const campaigns = await db.campaign.findMany({
      where: {
        userId: user.id,
        status: {
          in: ["ACTIVE", "PAUSED"],
        },
      },
      include: {
        emailSequences: {
          orderBy: {
            stepNumber: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Filter to only campaigns that have sequences defined
    const campaignsWithSequences = campaigns.filter(
      (c) => c.emailSequences && c.emailSequences.length > 0
    )

    return NextResponse.json({
      campaigns: campaignsWithSequences,
    })
  } catch (error) {
    console.error("[v0] Error fetching campaigns:", error)
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}
