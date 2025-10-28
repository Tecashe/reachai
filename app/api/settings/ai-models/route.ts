import { type NextRequest, NextResponse } from "next/server"
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
      select: { preferences: true },
    })

    const preferences = (user?.preferences as any)?.aiModels || null

    return NextResponse.json({ preferences })
  } catch (error) {
    console.error("[v0] Failed to get AI model preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { preferences } = await request.json()

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { preferences: true },
    })

    const currentPreferences = (user?.preferences as any) || {}

    await db.user.update({
      where: { clerkId: userId },
      data: {
        preferences: {
          ...currentPreferences,
          aiModels: preferences,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Failed to save AI model preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
