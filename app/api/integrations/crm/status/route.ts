import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const integration = await db.integration.findFirst({
      where: {
        userId,
        type: {
          in: ["HUBSPOT", "SALESFORCE", "PIPEDRIVE"],
        },
      },
    })

    return NextResponse.json({
      connected: !!integration,
      crmType: integration?.name || null,
      integrationId: integration?.id || null,
    })
  } catch (error) {
    console.error("[v0] CRM status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
