// import { type NextRequest, NextResponse } from "next/server"
// import { getCurrentUserFromDb } from "@/lib/auth"
// import { prisma } from "@/lib/db"
// import { WarmupDirection } from "@prisma/client"

// export async function GET(req: NextRequest) {
//   try {
//     const user = await getCurrentUserFromDb()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { searchParams } = new URL(req.url)
//     const limit = Number.parseInt(searchParams.get("limit") || "50")

//     const activities = await prisma.warmupInteraction.findMany({
//       where: {
//         sendingAccountId: {
//           in: await prisma.sendingAccount
//             .findMany({
//               where: { userId: user.id },
//               select: { id: true },
//             })
//             .then((accounts) => accounts.map((a) => a.id)),
//         },
//       },
//       include: {
//         sendingAccount: {
//           select: {
//             email: true,
//             name: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//       take: limit,
//     })

//     // Transform to activity format
//     const formattedActivities = activities.map((interaction) => {
//       let type: string
//       let message: string

//       if (interaction.direction === WarmupDirection.OUTBOUND) {
//         type = "sent"
//         message = "Sent warmup email"
//       } else if (interaction.repliedAt) {
//         type = "reply"
//         message = "Positive reply received"
//       } else {
//         type = "received"
//         message = "Received warmup email"
//       }

//       return {
//         id: interaction.id,
//         type,
//         message,
//         email: interaction.sendingAccount.email,
//         accountName: interaction.sendingAccount.name || interaction.sendingAccount.email,
//         timestamp: interaction.createdAt,
//         subject: interaction.subject,
//       }
//     })

//     return NextResponse.json({ activities: formattedActivities })
//   } catch (error) {
//     console.error("[v0] Error fetching activities:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }
import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { WarmupDirection } from "@prisma/client"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const activities = await prisma.warmupInteraction.findMany({
      where: {
        session: {
          sendingAccount: {
            userId: user.id,
          },
        },
      },
      include: {
        session: {
          include: {
            sendingAccount: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })

    // Transform to activity format
    const formattedActivities = activities.map((interaction) => {
      let type: string
      let message: string

      if (interaction.direction === WarmupDirection.OUTBOUND) {
        type = "sent"
        message = "Sent warmup email"
      } else if (interaction.repliedAt) {
        type = "reply"
        message = "Positive reply received"
      } else {
        type = "received"
        message = "Received warmup email"
      }

      return {
        id: interaction.id,
        type,
        message,
        email: interaction.session.sendingAccount.email,
        accountName: interaction.session.sendingAccount.name || interaction.session.sendingAccount.email,
        timestamp: interaction.createdAt,
        subject: interaction.subject,
      }
    })

    return NextResponse.json({ activities: formattedActivities })
  } catch (error) {
    console.error("[v0] Error fetching activities:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}