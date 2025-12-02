import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: campaignId } = await params

    // Verify campaign belongs to user
    const campaign = await db.campaign.findFirst({
      where: { id: campaignId, userId },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const rules = await db.sequenceAutomationRule.findMany({
      where: { campaignId },
      orderBy: { priority: "desc" },
    })

    return NextResponse.json({ success: true, rules })
  } catch (error) {
    console.error("Error fetching automation rules:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: campaignId } = await params
    const body = await req.json()

    // Verify campaign belongs to user
    const campaign = await db.campaign.findFirst({
      where: { id: campaignId, userId },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const rule = await db.sequenceAutomationRule.create({
      data: {
        campaignId,
        name: body.name,
        description: body.description,
        triggerType: body.triggerType,
        triggerValue: body.triggerValue,
        timeWindowHours: body.timeWindowHours,
        conditions: body.conditions || {},
        actions: body.actions || [],
        isActive: body.isActive ?? true,
        priority: body.priority || 0,
      },
    })

    return NextResponse.json({ success: true, rule })
  } catch (error) {
    console.error("Error creating automation rule:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: campaignId } = await params
    const body = await req.json()

    // Verify campaign belongs to user
    const campaign = await db.campaign.findFirst({
      where: { id: campaignId, userId },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    // Update all rules
    if (body.rules && Array.isArray(body.rules)) {
      // Delete existing rules not in the new list
      const newRuleIds = body.rules.filter((r: any) => r.id).map((r: any) => r.id)

      await db.sequenceAutomationRule.deleteMany({
        where: {
          campaignId,
          id: { notIn: newRuleIds },
        },
      })

      // Upsert each rule
      for (const rule of body.rules) {
        if (rule.id) {
          await db.sequenceAutomationRule.update({
            where: { id: rule.id },
            data: {
              name: rule.name,
              triggerType: rule.triggerType,
              triggerValue: rule.triggerValue,
              timeWindowHours: rule.timeWindowHours,
              conditions: rule.conditions,
              actions: rule.actions,
              isActive: rule.isActive,
              priority: rule.priority,
            },
          })
        } else {
          await db.sequenceAutomationRule.create({
            data: {
              campaignId,
              name: rule.name,
              triggerType: rule.triggerType,
              triggerValue: rule.triggerValue,
              timeWindowHours: rule.timeWindowHours,
              conditions: rule.conditions || {},
              actions: rule.actions || [],
              isActive: rule.isActive ?? true,
              priority: rule.priority || 0,
            },
          })
        }
      }
    }

    const updatedRules = await db.sequenceAutomationRule.findMany({
      where: { campaignId },
      orderBy: { priority: "desc" },
    })

    return NextResponse.json({ success: true, rules: updatedRules })
  } catch (error) {
    console.error("Error updating automation rules:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
