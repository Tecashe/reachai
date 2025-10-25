import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { campaignScheduler } from "@/lib/services/campaign-scheduler"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Verify campaign belongs to user
    const campaign = await db.campaign.findUnique({
      where: { id: params.id, userId: user.id },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    // Resume campaign
    await campaignScheduler.resumeCampaign(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Failed to resume campaign:", error)
    return NextResponse.json({ error: "Failed to resume campaign" }, { status: 500 })
  }
}
