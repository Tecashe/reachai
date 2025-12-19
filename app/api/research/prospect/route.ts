
import { type NextRequest, NextResponse } from "next/server"
import { researchProspect } from "@/lib/services/ai-research"
import { protectApiRoute, checkCredits } from "@/lib/api-protection"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  const { error, user } = await protectApiRoute()
  if (error) return error

  const creditCheck = await checkCredits(user!, "research")
  if (!creditCheck.hasCredits) return creditCheck.error

  try {
    const body = await request.json()
    const { prospect, depth = "STANDARD" } = body

    if (!prospect || !prospect.email) {
      return NextResponse.json({ error: "Prospect email is required" }, { status: 400 })
    }

    const result = await researchProspect(prospect, depth)

    await db.user.update({
      where: { id: user!.id },
      data: { researchCredits: { decrement: 1 } },
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("[builtbycashe] Research API error:", error)
    return NextResponse.json({ error: "Failed to research prospect" }, { status: 500 })
  }
}
