import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "5")

    const hotDeals = await db.prospect.findMany({
      where: {
        campaign: { userId: user.id },
        dealScore: { gte: 70 },
      },
      orderBy: { dealScore: "desc" },
      take: limit,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        dealScore: true,
        crmSyncedAt: true,
      },
    })

    return NextResponse.json({ success: true, data: hotDeals })
  } catch (error) {
    console.error("[CRM Deals] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
