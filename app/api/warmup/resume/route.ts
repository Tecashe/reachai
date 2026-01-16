// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/db"

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { accountId, userId } = body

//     if (!accountId || !userId) {
//       return NextResponse.json({ error: "Account ID and User ID are required" }, { status: 400 })
//     }

//     // Verify account ownership
//     const account = await prisma.sendingAccount.findFirst({
//       where: { id: accountId, userId },
//     })

//     if (!account) {
//       return NextResponse.json({ error: "Account not found" }, { status: 404 })
//     }

//     // Find pausedsession
//     const session = await prisma.warmupSession.findFirst({
//       where: { accountId, isActive: false },
//       orderBy: { pausedAt: "desc" },
//     })

//     if (!session) {
//       return NextResponse.json({ error: "No paused warmup session found" }, { status: 404 })
//     }

//     await prisma.warmupSession.update({
//       where: { id: session.id },
//       data: {
//         isActive: true,
//         pausedAt: null,
//         lastActivityAt: new Date(),
//       },
//     })

//     await prisma.sendingAccount.update({
//       where: { id: accountId },
//       data: {
//         warmupEnabled: true,
//       },
//     })

//     return NextResponse.json({
//       success: true,
//       message: "Warmup resumed successfully",
//     })
//   } catch (error) {
//     console.error("[v0] Error resuming warmup:", error)
//     return NextResponse.json({ error: "Failed to resume warmup" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accountId, userId } = body

    if (!accountId || !userId) {
      return NextResponse.json({ error: "Account ID and User ID are required" }, { status: 400 })
    }

    // Verify account ownership
    const account = await prisma.sendingAccount.findFirst({
      where: { id: accountId, userId },
    })

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    // Find paused session
    const session = await prisma.warmupSession.findFirst({
      where: { sendingAccountId: accountId, status: "PAUSED" },
      orderBy: { startedAt: "desc" },
    })

    if (!session) {
      return NextResponse.json({ error: "No paused warmup session found" }, { status: 404 })
    }

    await prisma.warmupSession.update({
      where: { id: session.id },
      data: {
        status: "ACTIVE",
      },
    })

    await prisma.sendingAccount.update({
      where: { id: accountId },
      data: {
        warmupEnabled: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Warmup resumed successfully",
    })
  } catch (error) {
    console.error("[v0] Error resuming warmup:", error)
    return NextResponse.json({ error: "Failed to resume warmup" }, { status: 500 })
  }
}