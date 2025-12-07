// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { NextResponse } from "next/server"

// export async function GET() {
//   try {
//     const { userId } = await auth()
//     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//     const [totalLeads, hotLeads, prospects] = await Promise.all([
//       db.prospect.count({ where: { userId } }),
//       db.prospect.count({
//         where: { userId, dealScore: { gte: 80 } },
//       }),
//       db.prospect.findMany({
//         where: { userId },
//         select: { dealScore: true, emailsReplied: true, emailsReceived: true },
//       }),
//     ])

//     const pipelineValue = prospects.reduce((sum, p) => sum + (p.dealScore || 0) * 100, 0)
//     const conversionRate =
//       prospects.length > 0
//         ? Math.round((prospects.filter((p) => p.emailsReplied > 0).length / prospects.length) * 100)
//         : 0

//     return NextResponse.json({
//       totalLeads,
//       hotLeads,
//       pipelineValue,
//       conversionRate,
//     })
//   } catch (error) {
//     console.error("[builtbycashe] CRM stats error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ totalLeads: 0, hotLeads: 0, pipelineValue: 0, conversionRate: 0 })
    }

    const [totalLeads, hotLeads, repliedLeads, prospectsWithScores] = await Promise.all([
      db.prospect.count({ where: { userId: user.id, crmId: { not: null } } }),
      db.prospect.count({ where: { userId: user.id, crmId: { not: null }, dealScore: { gte: 70 } } }),
      db.prospect.count({ where: { userId: user.id, crmId: { not: null }, replied: true } }),
      db.prospect.findMany({
        where: { userId: user.id, dealScore: { not: null } },
        select: { dealScore: true },
      }),
    ])

    const pipelineValue = prospectsWithScores.reduce((sum, p) => sum + (p.dealScore || 0) * 100, 0)
    const conversionRate = totalLeads > 0 ? Math.round((repliedLeads / totalLeads) * 100) : 0

    return NextResponse.json({
      totalLeads,
      hotLeads,
      pipelineValue,
      conversionRate,
    })
  } catch (error) {
    console.error("[CRM Stats] Error:", error)
    return NextResponse.json({ totalLeads: 0, hotLeads: 0, pipelineValue: 0, conversionRate: 0 })
  }
}
