import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { aiSequenceAssigner } from "@/lib/services/ai-sequence-assigner"

export async function POST(req: Request) {
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

    const body = await req.json()
    const { prospectIds } = body

    if (!prospectIds || !Array.isArray(prospectIds) || prospectIds.length === 0) {
      return NextResponse.json({ error: "No prospect IDs provided" }, { status: 400 })
    }

    // Verify prospects belong to user
    const prospects = await db.prospect.findMany({
      where: {
        id: { in: prospectIds },
        userId: user.id,
      },
    })

    if (prospects.length === 0) {
      return NextResponse.json({ error: "No valid prospects found" }, { status: 404 })
    }

    // Get available sequences for recommendations
    const campaigns = await db.campaign.findMany({
      where: {
        userId: user.id,
        status: { in: ["ACTIVE", "PAUSED", "DRAFT"] },
        emailSequences: { some: {} },
      },
      select: {
        id: true,
        name: true,
      },
    })

    // Get AI recommendations
    const results = await aiSequenceAssigner.bulkAssignProspects(prospects.map((p) => p.id))

    // Map results with additional data
    const recommendations = results.map((result) => {
      const prospect = prospects.find((p) => p.id === result.prospectId)
      const sequence = campaigns.find((c) => c.id === result.recommendedSequenceId)

      return {
        prospectId: result.prospectId,
        prospectName: prospect ? `${prospect.firstName || ""} ${prospect.lastName || ""}`.trim() : "",
        prospectEmail: prospect?.email || "",
        recommendedSequenceId: result.recommendedSequenceId,
        recommendedSequenceName: sequence?.name || "Unknown Sequence",
        confidence: result.confidence,
        reasoning: result.reasoning,
      }
    })

    return NextResponse.json({
      success: true,
      recommendations,
    })
  } catch (error) {
    console.error("Error getting sequence recommendations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
