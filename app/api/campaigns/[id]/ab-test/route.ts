import { NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: campaignId } = await params
    const { variants } = await request.json()

    if (!variants || variants.length < 2) {
      return NextResponse.json(
        { error: "At least 2 variants required" },
        { status: 400 }
      )
    }

    const campaign = await db.campaign.findUnique({
      where: { id: campaignId, userId: user.id },
      include: {
        prospects: {
          where: { status: "ACTIVE" },
        },
      },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const prospects = campaign.prospects
    const groupId = `ab_${Date.now()}`
    const prospectsPerVariant = Math.floor(prospects.length / variants.length)

    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i]
      const variantLetter = String.fromCharCode(65 + i) // A, B, C, etc.
      const startIdx = i * prospectsPerVariant
      const endIdx = i === variants.length - 1 ? prospects.length : (i + 1) * prospectsPerVariant
      const variantProspects = prospects.slice(startIdx, endIdx)

      for (const prospect of variantProspects) {
        await db.sendingSchedule.create({
          data: {
            userId: user.id,
            prospectId: prospect.id,
            campaignId: campaign.id,
            subject: variant.subject,
            body: variant.body,
            scheduledFor: new Date(),
            status: "PENDING",
          },
        })
      }

      console.log(`[v0] A/B test: Assigned ${variantProspects.length} prospects to variant ${variantLetter}`)
    }

    await db.campaign.update({
      where: { id: campaignId },
      data: {
        wizardData: {
          abTestActive: true,
          abTestGroupId: groupId,
          abTestVariants: variants.map((v: any, i: number) => ({
            id: String.fromCharCode(65 + i),
            name: v.name,
            subject: v.subject,
          })),
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: `A/B test started with ${variants.length} variants`,
      groupId,
      prospectsPerVariant,
    })
  } catch (error) {
    console.error("[v0] A/B test error:", error)
    return NextResponse.json(
      { error: "Failed to start A/B test" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: campaignId } = await params

    const campaign = await db.campaign.findUnique({
      where: { id: campaignId, userId: user.id },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const wizardData = campaign.wizardData as any
    if (!wizardData?.abTestActive) {
      return NextResponse.json({ abTestActive: false })
    }

    const emailLogs = await db.emailLog.findMany({
      where: {
        prospect: {
          campaignId: campaign.id,
        },
        variantGroup: wizardData.abTestGroupId,
      },
      include: {
        prospect: true,
      },
    })

    const variantStats = new Map()

    for (const log of emailLogs) {
      const variant = log.variant || "A"
      
      if (!variantStats.has(variant)) {
        variantStats.set(variant, {
          variant,
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          replied: 0,
        })
      }

      const stats = variantStats.get(variant)
      stats.sent++
      if (log.status === "DELIVERED" || log.openedAt) stats.delivered++
      if (log.openedAt) stats.opened++
      if (log.clickedAt) stats.clicked++
      if (log.repliedAt) stats.replied++
    }

    const results = Array.from(variantStats.values()).map((stats: any) => ({
      ...stats,
      openRate: stats.delivered > 0 ? ((stats.opened / stats.delivered) * 100).toFixed(2) : 0,
      clickRate: stats.delivered > 0 ? ((stats.clicked / stats.delivered) * 100).toFixed(2) : 0,
      replyRate: stats.delivered > 0 ? ((stats.replied / stats.delivered) * 100).toFixed(2) : 0,
      score: stats.opened * 3 + stats.clicked * 5 + stats.replied * 10, // Weighted score
    }))

    results.sort((a, b) => b.score - a.score)
    
    if (results.length > 0) {
      results[0].isWinner = true
    }

    return NextResponse.json({
      abTestActive: true,
      groupId: wizardData.abTestGroupId,
      variants: wizardData.abTestVariants,
      results,
    })
  } catch (error) {
    console.error("[v0] Get A/B test results error:", error)
    return NextResponse.json(
      { error: "Failed to get A/B test results" },
      { status: 500 }
    )
  }
}
