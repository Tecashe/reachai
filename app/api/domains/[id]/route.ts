import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const domain = await db.domain.findUnique({
      where: { id: params.id, userId: user.id },
      include: {
        deliverabilityHealth: true,
        sendingAccounts: true,
      },
    })

    if (!domain) {
      return NextResponse.json({ success: false, error: "Domain not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, domain })
  } catch (error) {
    console.error("Failed to fetch domain:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch domain" }, { status: 500 })
  }
}
