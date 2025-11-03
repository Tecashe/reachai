import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { syncCrmLeads } from "@/lib/services/crm-integrations"
import { checkSubscriptionGate } from "@/lib/subscription-gate"

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const isAllowed = await checkSubscriptionGate(userId, ["PRO", "AGENCY"])
    if (!isAllowed) {
      return NextResponse.json({ error: "CRM integration requires PRO subscription or higher" }, { status: 403 })
    }

    const integration = await db.integration.findFirst({
      where: {
        userId,
        type: {
          in: ["HUBSPOT", "SALESFORCE", "PIPEDRIVE"],
        },
      },
    })

    if (!integration) {
      return NextResponse.json({ error: "No CRM integration found" }, { status: 404 })
    }

    const crmType = integration.type.toLowerCase()
    const credentials = integration.credentials as any

    console.log("[v0] Starting CRM sync for user:", userId)
    const leads = await syncCrmLeads(userId, crmType, credentials)

    return NextResponse.json({
      success: true,
      leadsImported: leads.length,
      message: `Successfully imported ${leads.length} prospects from ${crmType}`,
    })
  } catch (error) {
    console.error("[v0] CRM sync route error:", error)
    return NextResponse.json({ error: "Failed to sync CRM" }, { status: 500 })
  }
}
