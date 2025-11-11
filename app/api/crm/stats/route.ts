import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const [totalLeads, hotLeads, prospects] = await Promise.all([
      db.prospect.count({ where: { userId } }),
      db.prospect.count({
        where: { userId, dealScore: { gte: 80 } },
      }),
      db.prospect.findMany({
        where: { userId },
        select: { dealScore: true, emailsReplied: true, emailsReceived: true },
      }),
    ])

    const pipelineValue = prospects.reduce((sum, p) => sum + (p.dealScore || 0) * 100, 0)
    const conversionRate =
      prospects.length > 0
        ? Math.round((prospects.filter((p) => p.emailsReplied > 0).length / prospects.length) * 100)
        : 0

    return NextResponse.json({
      totalLeads,
      hotLeads,
      pipelineValue,
      conversionRate,
    })
  } catch (error) {
    console.error("[builtbycashe] CRM stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
