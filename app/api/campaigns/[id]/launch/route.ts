import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { updateOnboardingStep } from "@/lib/actions/onboarding"
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

    const body = await request.json()
    const { startDate, dailyLimit, sendInBusinessHours, timezone } = body

    // Update campaign status to ACTIVE
    await db.campaign.update({
      where: {
        id: params.id,
        userId: user.id,
      },
      data: {
        status: "ACTIVE",
        dailySendLimit: dailyLimit,
        launchedAt: new Date(),
        sendingSchedule: {
          startDate,
          sendInBusinessHours,
          timezone,
        },
      },
    })

    await campaignScheduler.scheduleCampaign(params.id, {
      startDate,
      dailyLimit,
      sendInBusinessHours,
      timezone,
    })

    // Mark onboarding step as complete
    await updateOnboardingStep("hasSentEmail")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[builtbycashe] Failed to launch campaign:", error)
    return NextResponse.json({ error: "Failed to launch campaign" }, { status: 500 })
  }
}
