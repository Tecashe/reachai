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

//     // Pauseactive session
//     const session = await prisma.warmupSession.findFirst({
//       where: { accountId, isActive: true },
//     })

//     if (!session) {
//       return NextResponse.json({ error: "No active warmup session found" }, { status: 404 })
//     }

//     await prisma.warmupSession.update({
//       where: { id: session.id },
//       data: {
//         isActive: false,
//         pausedAt: new Date(),
//       },
//     })

//     await prisma.sendingAccount.update({
//       where: { id: accountId },
//       data: {
//         warmupEnabled: false,
//       },
//     })

//     return NextResponse.json({
//       success: true,
//       message: "Warmup paused successfully",
//     })
//   } catch (error) {
//     console.error("[v0] Error pausing warmup:", error)
//     return NextResponse.json({ error: "Failed to pause warmup" }, { status: 500 })
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

    // Pause active session
    const session = await prisma.warmupSession.findFirst({
      where: { sendingAccountId: accountId, status: "ACTIVE" },
    })

    if (!session) {
      return NextResponse.json({ error: "No active warmup session found" }, { status: 404 })
    }

    await prisma.warmupSession.update({
      where: { id: session.id },
      data: {
        status: "PAUSED",
      },
    })

    await prisma.sendingAccount.update({
      where: { id: accountId },
      data: {
        warmupEnabled: false,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Warmup paused successfully",
    })
  } catch (error) {
    console.error("[v0] Error pausing warmup:", error)
    return NextResponse.json({ error: "Failed to pause warmup" }, { status: 500 })
  }
}