import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const { userId: clerkId } = await auth()
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get prospects grouped by status for pipeline stages
    const prospects = await db.prospect.findMany({
      where: {
        campaign: { userId: user.id },
        crmId: { not: null },
      },
      select: {
        status: true,
        dealScore: true,
      },
    })

    // Define pipeline stages based on prospect status
    const stageMap: Record<string, { count: number; value: number }> = {
      ACTIVE: { count: 0, value: 0 },
      CONTACTED: { count: 0, value: 0 },
      REPLIED: { count: 0, value: 0 },
      COMPLETED: { count: 0, value: 0 },
    }

    prospects.forEach((p) => {
      if (stageMap[p.status]) {
        stageMap[p.status].count++
        // Estimate value based on deal score (100 score = $10k potential)
        stageMap[p.status].value += (p.dealScore || 50) * 100
      }
    })

    const stages = Object.entries(stageMap).map(([name, data]) => ({
      name: name.charAt(0) + name.slice(1).toLowerCase(),
      count: data.count,
      value: data.value,
    }))

    return NextResponse.json({ success: true, data: stages })
  } catch (error) {
    console.error("[CRM Pipeline] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
