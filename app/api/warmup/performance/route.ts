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
//     const days = Number.parseInt(searchParams.get("days") || "30")

//     const startDate = new Date()
//     startDate.setDate(startDate.getDate() - days)

//     const userAccountIds = await prisma.sendingAccount
//       .findMany({
//         where: { userId: user.id },
//         select: { id: true },
//       })
//       .then((accounts) => accounts.map((a) => a.id))

//     // Get daily interaction counts
//     const interactions = await prisma.warmupInteraction.findMany({
//       where: {
//         sendingAccountId: {
//           in: userAccountIds,
//         },
//         createdAt: {
//           gte: startDate,
//         },
//       },
//       select: {
//         createdAt: true,
//         direction: true,
//         repliedAt: true,
//         sendingAccount: {
//           select: {
//             warmupSessions: {
//               select: {
//                 inboxPlacementRate: true,
//               },
//               orderBy: {
//                 startedAt: "desc",
//               },
//               take: 1,
//             },
//           },
//         },
//       },
//     })

//     // Group by day and calculate metrics
//     const dailyData: Record<
//       string,
//       { sent: number; opened: number; replied: number; inboxRate: number; count: number }
//     > = {}

//     for (let i = 0; i < days; i++) {
//       const date = new Date(startDate)
//       date.setDate(date.getDate() + i)
//       const dateStr = date.toISOString().split("T")[0]
//       dailyData[dateStr] = { sent: 0, opened: 0, replied: 0, inboxRate: 0, count: 0 }
//     }

//     interactions.forEach((interaction) => {
//       const dateStr = interaction.createdAt.toISOString().split("T")[0]
//       if (dailyData[dateStr]) {
//         if (interaction.direction === WarmupDirection.OUTBOUND) {
//           dailyData[dateStr].sent++
//         } else if (interaction.direction === WarmupDirection.INBOUND) {
//           dailyData[dateStr].opened++
//         }
//         if (interaction.repliedAt) {
//           dailyData[dateStr].replied++
//         }
//         if (interaction.sendingAccount.warmupSessions[0]) {
//           dailyData[dateStr].inboxRate += interaction.sendingAccount.warmupSessions[0].inboxPlacementRate
//           dailyData[dateStr].count++
//         }
//       }
//     })

//     // Format for chart
//     const chartData = Object.entries(dailyData)
//       .map(([date, data]) => ({
//         date,
//         sent: data.sent,
//         opened: data.opened,
//         replied: data.replied,
//         inboxRate: data.count > 0 ? Math.round((data.inboxRate / data.count) * 100) / 100 : 0,
//       }))
//       .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

//     return NextResponse.json({ data: chartData })
//   } catch (error) {
//     console.error("[v0] Error fetching performance data:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { WarmupDirection } from "@prisma/client"

interface DailyMetrics {
  sent: number
  opened: number
  replied: number
  inboxRate: number
  count: number
}

interface ChartDataPoint {
  date: string
  sent: number
  opened: number
  replied: number
  inboxRate: number
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get daily interaction counts
    const interactions = await prisma.warmupInteraction.findMany({
      where: {
        session: {
          sendingAccount: {
            userId: user.id,
          },
        },
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
        direction: true,
        repliedAt: true,
        session: {
          select: {
            inboxPlacementRate: true,
            sendingAccount: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })

    // Group by day and calculate metrics
    const dailyData: Record<string, DailyMetrics> = {}

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]
      dailyData[dateStr] = { sent: 0, opened: 0, replied: 0, inboxRate: 0, count: 0 }
    }

    interactions.forEach((interaction) => {
      const dateStr = interaction.createdAt.toISOString().split("T")[0]
      if (dailyData[dateStr]) {
        if (interaction.direction === WarmupDirection.OUTBOUND) {
          dailyData[dateStr].sent++
        } else if (interaction.direction === WarmupDirection.INBOUND) {
          dailyData[dateStr].opened++
        }
        if (interaction.repliedAt) {
          dailyData[dateStr].replied++
        }
        // Use the inbox placement rate from the session
        if (interaction.session.inboxPlacementRate !== null && interaction.session.inboxPlacementRate !== undefined) {
          dailyData[dateStr].inboxRate += interaction.session.inboxPlacementRate
          dailyData[dateStr].count++
        }
      }
    })

    // Format for chart
    const chartData: ChartDataPoint[] = Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        sent: data.sent,
        opened: data.opened,
        replied: data.replied,
        inboxRate: data.count > 0 ? Math.round((data.inboxRate / data.count) * 100) / 100 : 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json({ data: chartData })
  } catch (error) {
    console.error("[v0] Error fetching performance data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}