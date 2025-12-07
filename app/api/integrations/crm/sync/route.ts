import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { syncLeadsFromCRM, syncDealsFromCRM } from "@/lib/actions/crm"

export async function POST() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const [leadsResult, dealsResult] = await Promise.all([syncLeadsFromCRM(), syncDealsFromCRM()])

    if (!leadsResult.success || !dealsResult.success) {
      return NextResponse.json({ error: leadsResult.error || dealsResult.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      synced: {
        leads: leadsResult.synced,
        deals: dealsResult.scored,
      },
    })
  } catch (error) {
    console.error("[CRM Sync] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
