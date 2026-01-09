import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch ALL sending accounts for this user (both warmup enabled and not)
    const accounts = await prisma.sendingAccount.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        provider: true,
        warmupEnabled: true,
        warmupStage: true,
        warmupDailyLimit: true,
        warmupStartDate: true,
        emailsSentToday: true,
        healthScore: true,
        openRate: true,
        replyRate: true,
        spamComplaintRate: true,
        bounceRate: true,
        // inboxPlacementRate: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ accounts })
  } catch (error) {
    console.error("Error fetching warmup accounts:", error)
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
  }
}

