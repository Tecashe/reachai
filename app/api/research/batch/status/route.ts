// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"

// export async function GET(request: NextRequest) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const searchParams = request.nextUrl.searchParams
//     const campaignId = searchParams.get("campaignId")

//     if (!campaignId) {
//       return NextResponse.json({ error: "Campaign ID required" }, { status: 400 })
//     }

//     // TODO: Implement actual progress tracking from database
//     // For now, return mock progress data
//     const mockProgress = Math.floor(Math.random() * 100)
//     const mockCompleted = Math.floor(mockProgress / 10)

//     return NextResponse.json({
//       progress: mockProgress,
//       completed: mockCompleted,
//       avgScore: 85,
//     })
//   } catch (error) {
//     console.error("[builtbycashe] Batch research status error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const campaignId = searchParams.get("campaignId")

    if (!campaignId) {
      return NextResponse.json({ error: "Campaign ID required" }, { status: 400 })
    }

    const prospects = await db.prospect.findMany({
      where: {
        campaignId,
        userId,
      },
      select: {
        id: true,
        researchData: true,
        qualityScore: true,
      },
    })

    const total = prospects.length
    const completed = prospects.filter((p) => p.researchData !== null).length
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0

    const scores = prospects.filter((p) => p.qualityScore !== null).map((p) => p.qualityScore as number)
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

    return NextResponse.json({
      progress,
      completed,
      total,
      avgScore,
    })
  } catch (error) {
    console.error("[builtbycashe] Batch research status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
