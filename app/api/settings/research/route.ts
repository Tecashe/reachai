import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { scrapingMode } = await req.json()

    if (!["FAST", "DEEP"].includes(scrapingMode)) {
      return NextResponse.json({ error: "Invalid scraping mode" }, { status: 400 })
    }

    // Update user preferences
    await db.user.update({
      where: { clerkId: userId },
      data: {
        preferences: {
          scrapingMode,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[builtbycashe] Failed to update research settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { preferences: true },
    })

    return NextResponse.json({
      scrapingMode: (user?.preferences as any)?.scrapingMode || "FAST",
    })
  } catch (error) {
    console.error("[builtbycashe] Failed to get research settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
