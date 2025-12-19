
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const accounts = await db.sendingAccount.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        provider: true,
        healthScore: true,
        warmupStage: true,
        bounceRate: true,
        replyRate: true,
        openRate: true,
        isActive: true,
        dailyLimit: true,
        emailsSentToday: true,
      },
    })

    return NextResponse.json(accounts)
  } catch (error) {
    console.error("Failed to fetch sending accounts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
