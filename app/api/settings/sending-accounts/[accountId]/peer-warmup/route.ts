import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function PATCH(request: Request, { params }: { params: { accountId: string } }) {
  try {
    const clerkUserId = await requireAuth()

    const { peerWarmupEnabled } = await request.json()

    // Get the internal userId from clerkId
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const account = await db.sendingAccount.update({
      where: {
        id: params.accountId,
        userId: user.id,
      },
      data: {
        peerWarmupEnabled,
        peerWarmupOptIn: peerWarmupEnabled, // Boolean field matching schema
      },
    })

    return NextResponse.json(account)
  } catch (error) {
    console.error("Error updating peer warmup:", error)
    return NextResponse.json({ error: "Failed to update peer warmup" }, { status: 500 })
  }
}
