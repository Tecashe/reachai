// import { type NextRequest, NextResponse } from "next/server"
// import { batchResearchProspects } from "@/lib/services/ai-research"

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { prospects, depth = "STANDARD" } = body

//     if (!prospects || !Array.isArray(prospects) || prospects.length === 0) {
//       return NextResponse.json({ error: "Prospects array is required" }, { status: 400 })
//     }

//     const results = await batchResearchProspects(prospects, depth)

//     return NextResponse.json({
//       success: true,
//       data: Object.fromEntries(results),
//       count: results.size,
//     })
//   } catch (error) {
//     console.error("[v0] Batch research API error:", error)
//     return NextResponse.json({ error: "Failed to research prospects" }, { status: 500 })
//   }
// }

// import { type NextRequest, NextResponse } from "next/server"
// import { batchResearchProspects } from "@/lib/services/ai-research"
// import { protectApiRoute } from "@/lib/api-protection"
// import { db } from "@/lib/db"

// export async function POST(request: NextRequest) {
//   const { error, user } = await protectApiRoute()
//   if (error) return error

//   try {
//     const body = await request.json()
//     const { prospects, depth = "STANDARD" } = body

//     if (!prospects || !Array.isArray(prospects) || prospects.length === 0) {
//       return NextResponse.json({ error: "Prospects array is required" }, { status: 400 })
//     }

//     if (user!.researchCredits < prospects.length) {
//       return NextResponse.json(
//         { error: `Insufficient research credits. Need ${prospects.length}, have ${user!.researchCredits}` },
//         { status: 403 },
//       )
//     }

//     const results = await batchResearchProspects(prospects, depth)

//     await db.user.update({
//       where: { id: user!.id },
//       data: { researchCredits: { decrement: prospects.length } },
//     })

//     return NextResponse.json({
//       success: true,
//       data: Object.fromEntries(results),
//       count: results.size,
//     })
//   } catch (error) {
//     console.error("[v0] Batch research API error:", error)
//     return NextResponse.json({ error: "Failed to research prospects" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { batchResearchProspects } from "@/lib/services/ai-research"
import { protectApiRoute } from "@/lib/api-protection"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  console.log("[v0] Batch research API called")

  const { error, user } = await protectApiRoute()
  if (error) {
    console.error("[v0] Auth failed in research API")
    return error
  }

  try {
    const body = await request.json()
    console.log("[v0] Research request body:", {
      prospectCount: body.prospects?.length,
      depth: body.depth,
    })

    const { prospects, depth = "STANDARD" } = body

    if (!prospects || !Array.isArray(prospects) || prospects.length === 0) {
      console.error("[v0] Invalid prospects array:", prospects)
      return NextResponse.json({ error: "Prospects array is required" }, { status: 400 })
    }

    console.log("[v0] User research credits:", user!.researchCredits)

    if (user!.researchCredits < prospects.length) {
      console.error("[v0] Insufficient credits:", {
        needed: prospects.length,
        available: user!.researchCredits,
      })
      return NextResponse.json(
        { error: `Insufficient research credits. Need ${prospects.length}, have ${user!.researchCredits}` },
        { status: 403 },
      )
    }

    console.log("[v0] Starting batch research for", prospects.length, "prospects")
    const results = await batchResearchProspects(prospects, depth)
    console.log("[v0] Batch research completed successfully:", results.size, "results")

    await db.user.update({
      where: { id: user!.id },
      data: { researchCredits: { decrement: prospects.length } },
    })
    console.log("[v0] Credits decremented successfully")

    return NextResponse.json({
      success: true,
      data: Object.fromEntries(results),
      count: results.size,
    })
  } catch (error) {
    console.error("[v0] Batch research API error:", error)
    console.error("[v0] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    })
    return NextResponse.json(
      {
        error: "Failed to research prospects",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
