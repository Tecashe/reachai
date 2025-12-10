import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

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
    const { assignments } = body

    if (!assignments || !Array.isArray(assignments) || assignments.length === 0) {
      return NextResponse.json({ error: "No assignments provided" }, { status: 400 })
    }

    // Apply assignments
    let assignedCount = 0
    for (const assignment of assignments) {
      const { prospectId, sequenceId } = assignment

      // Verify prospect belongs to user
      const prospect = await db.prospect.findFirst({
        where: { id: prospectId, userId: user.id },
      })

      if (!prospect) continue

      // Verify sequence (campaign) belongs to user
      const campaign = await db.campaign.findFirst({
        where: { id: sequenceId, userId: user.id },
      })

      if (!campaign) continue

      // Update prospect
      await db.prospect.update({
        where: { id: prospectId },
        data: {
          campaignId: sequenceId,
          status: "ACTIVE",
          currentStep: 1,
        },
      })

      // Update campaign prospect count
      await db.campaign.update({
        where: { id: sequenceId },
        data: {
          totalProspects: { increment: 1 },
        },
      })

      assignedCount++
    }

    return NextResponse.json({
      success: true,
      assignedCount,
    })
  } catch (error) {
    console.error("Error assigning sequences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
