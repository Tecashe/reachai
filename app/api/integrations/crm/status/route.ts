import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ connected: false }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ connected: false })
    }

    const integration = await db.integration.findFirst({
      where: {
        userId: user.id,
        type: { in: ["HUBSPOT", "SALESFORCE", "PIPEDRIVE"] },
        isActive: true,
      },
      select: {
        id: true,
        type: true,
        name: true,
        lastSyncedAt: true,
      },
    })

    return NextResponse.json({
      connected: !!integration,
      integration: integration || null,
    })
  } catch (error) {
    console.error("[CRM Status] Error:", error)
    return NextResponse.json({ connected: false, error: "Internal error" }, { status: 500 })
  }
}
