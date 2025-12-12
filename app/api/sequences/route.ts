import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    console.log("[v0] Sequences API - Clerk userId:", userId)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    console.log("[v0] Sequences API - Found user:", user?.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    console.log("[v0] Sequences API - Status filter:", status)

    const sequences = await db.sequence.findMany({
      where: {
        userId: user.id,
        ...(status && { status: status as any }),
      },
      include: {
        steps: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    console.log("[v0] Sequences API - Found sequences:", sequences.length)
    console.log(
      "[v0] Sequences API - Sequence details:",
      sequences.map((s) => ({ id: s.id, name: s.name, status: s.status })),
    )

    return NextResponse.json({
      success: true,
      sequences: sequences.map((seq) => ({
        ...seq,
        totalEnrolled: seq._count.enrollments,
      })),
    })
  } catch (error) {
    console.error("[v0] Fetch sequences error:", error)
    return NextResponse.json({ error: "Failed to fetch sequences" }, { status: 500 })
  }
}
