import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: campaignId } = await params
    const { triggers } = await req.json()

    // Verify campaign ownership
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId, userId: user.id },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    // Delete existing triggers
    await db.subsequenceTrigger.deleteMany({
      where: { campaignId },
    })

    // Create new triggers
    for (const trigger of triggers) {
      await db.subsequenceTrigger.create({
        data: {
          campaignId,
          name: trigger.name,
          description: `Auto-add to sequence when conditions are met`,
          conditions: trigger.conditions,
          actionType: "SEND_EMAIL",
          templateId: trigger.targetSequenceId,
          delayHours: trigger.delayHours,
          isActive: trigger.isActive,
        },
      })
    }

    logger.info("Sequence triggers saved", { campaignId, count: triggers.length })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Save sequence triggers error", error as Error)
    return NextResponse.json({ error: "Failed to save triggers" }, { status: 500 })
  }
}
