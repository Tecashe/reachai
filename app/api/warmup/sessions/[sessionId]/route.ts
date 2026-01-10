import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PATCH(req: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId } = params
    const body = await req.json()
    const { status } = body

    // Verify session belongs to user
    const session = await prisma.warmupSession.findFirst({
      where: {
        id: sessionId,
        sendingAccount: {
          userId: user.id,
        },
      },
    })

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Update session status
    const updated = await prisma.warmupSession.update({
      where: { id: sessionId },
      data: { status },
    })

    return NextResponse.json({ session: updated })
  } catch (error) {
    console.error("[v0] Error updating warmup session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId } = params

    // Verify session belongs to user
    const session = await prisma.warmupSession.findFirst({
      where: {
        id: sessionId,
        sendingAccount: {
          userId: user.id,
        },
      },
    })

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Delete session and set warmupEnabled to false on account
    await prisma.$transaction([
      prisma.warmupSession.delete({
        where: { id: sessionId },
      }),
      prisma.sendingAccount.update({
        where: { id: session.sendingAccountId },
        data: { warmupEnabled: false },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting warmup session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
