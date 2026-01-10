// import { NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"

// export async function PATCH(request: Request, { params }: { params: { accountId: string } }) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     const { warmupEnabled } = await request.json()

//     const account = await db.sendingAccount.findFirst({
//       where: {
//         id: params.accountId,
//         userId: user.id,
//       },
//     })

//     if (!account) {
//       return NextResponse.json({ error: "Account not found" }, { status: 404 })
//     }

//     const updatedAccount = await db.sendingAccount.update({
//       where: { id: params.accountId },
//       data: { warmupEnabled },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         provider: true,
//         warmupEnabled: true,
//         warmupStage: true,
//         healthScore: true,
//       },
//     })

//     return NextResponse.json(updatedAccount)
//   } catch (error) {
//     console.error("Failed to update sending account:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }


// import { NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"

// export async function PATCH(request: Request, { params }: { params: { accountId: string } }) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     const { warmupEnabled } = await request.json()

//     const account = await db.sendingAccount.findFirst({
//       where: {
//         id: params.accountId,
//         userId: user.id,
//       },
//     })

//     if (!account) {
//       return NextResponse.json({ error: "Account not found" }, { status: 404 })
//     }

//     const updatedAccount = await db.sendingAccount.update({
//       where: { id: params.accountId },
//       data: { warmupEnabled },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         provider: true,
//         warmupEnabled: true,
//         warmupStage: true,
//         healthScore: true,
//       },
//     })

//     if (warmupEnabled && !account.warmupEnabled) {
//       // Check if session already exists
//       const existingSession = await db.warmupSession.findFirst({
//         where: {
//           sendingAccountId: params.accountId,
//           status: { in: ["ACTIVE", "PAUSED"] },
//         },
//       })

//       if (!existingSession) {
//         await db.warmupSession.create({
//           data: {
//             sendingAccountId: params.accountId,
//             status: "ACTIVE",
//             warmupType: account.warmupStage === "NEW" || account.warmupStage === "WARMING" ? "POOL" : "PEER",
//             dailyLimit: 5, // Start conservatively
//             inboxPlacementRate: 0,
//             spamRate: 0,
//             bounceRate: 0,
//             replyRate: 0,
//             openRate: 0,
//             startedAt: new Date(),
//           },
//         })

//         console.log("[v0] Created warmup session immediately for account:", params.accountId)
//       }
//     }

//     if (!warmupEnabled && account.warmupEnabled) {
//       await db.warmupSession.updateMany({
//         where: {
//           sendingAccountId: params.accountId,
//           status: "ACTIVE",
//         },
//         data: {
//           status: "PAUSED",
//         },
//       })
//     }

//     return NextResponse.json(updatedAccount)
//   } catch (error) {
//     console.error("Failed to update sending account:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }


import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function PATCH(request: Request, { params }: { params: { accountId: string } }) {
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

    const { warmupEnabled } = await request.json()

    const account = await db.sendingAccount.findFirst({
      where: {
        id: params.accountId,
        userId: user.id,
      },
    })

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    const updatedAccount = await db.sendingAccount.update({
      where: { id: params.accountId },
      data: { warmupEnabled },
      select: {
        id: true,
        email: true,
        name: true,
        provider: true,
        warmupEnabled: true,
        warmupStage: true,
        healthScore: true,
      },
    })

    if (warmupEnabled && !account.warmupEnabled) {
      // Check if session already exists
      const existingSession = await db.warmupSession.findFirst({
        where: {
          sendingAccountId: params.accountId,
          status: { in: ["ACTIVE", "PAUSED"] },
        },
      })

      if (!existingSession) {
        await db.warmupSession.create({
          data: {
            sendingAccountId: params.accountId,
            status: "ACTIVE",
            warmupType: account.warmupStage === "NEW" || account.warmupStage === "WARMING" ? "POOL" : "PEER",
            dailyLimit: 5, // Start conservatively
            emailsSent: 0,
            emailsOpened: 0,
            emailsReceived: 0,
            emailsReplied: 0,
            inboxPlacementRate: 0,
            startedAt: new Date(),
          },
        })

        console.log("[v0] Created warmup session immediately for account:", params.accountId)
      }
    }

    if (!warmupEnabled && account.warmupEnabled) {
      await db.warmupSession.updateMany({
        where: {
          sendingAccountId: params.accountId,
          status: "ACTIVE",
        },
        data: {
          status: "PAUSED",
        },
      })
    }

    return NextResponse.json(updatedAccount)
  } catch (error) {
    console.error("Failed to update sending account:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}