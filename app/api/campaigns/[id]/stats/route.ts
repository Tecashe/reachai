import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const prospects = await db.prospect.findMany({
      where: {
        campaignId: params.id,
        campaign: {
          userId: user.id,
        },
      },
      select: {
        qualityScore: true,
      },
    })

    const scores = prospects.map((p) => p.qualityScore || 0)
    const avgQualityScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0

    const highQuality = scores.filter((s) => s >= 80).length
    const mediumQuality = scores.filter((s) => s >= 60 && s < 80).length
    const lowQuality = scores.filter((s) => s < 60).length

    return NextResponse.json({
      totalProspects: prospects.length,
      avgQualityScore,
      highQuality,
      mediumQuality,
      lowQuality,
    })
  } catch (error) {
    console.error("[builtbycashe] Failed to get campaign stats:", error)
    return NextResponse.json({ error: "Failed to get campaign stats" }, { status: 500 })
  }
}
