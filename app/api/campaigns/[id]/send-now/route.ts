// import { db } from "@/lib/db"
// import { NextResponse } from "next/server"
// import { requireAuth } from "@/lib/auth"
// import { companySendLimits } from "@/lib/services/company-send-limits"

// /**
//  * Manual Send API
//  * Allows user to manually trigger email sending with strict limit enforcement
//  */
// export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
//   try {
//     const { id: campaignId } = await params
//     const userId = await requireAuth()

//     // Get campaign
//     const campaign = await db.campaign.findUnique({
//       where: { id: campaignId, userId },
//       include: {
//         prospects: {
//           where: {
//             status: "ACTIVE",
//           },
//           include: {
//             sendingSchedules: {
//               where: {
//                 status: "PENDING",
//               },
//             },
//           },
//         },
//       },
//     })

//     if (!campaign) {
//       return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
//     }

//     if (campaign.status !== "ACTIVE") {
//       return NextResponse.json({ error: "Campaign must be active to send emails" }, { status: 400 })
//     }

//     // Check if user has sending accounts
//     const sendingAccounts = await db.sendingAccount.findMany({
//       where: {
//         userId,
//         isActive: true,
//         healthScore: {
//           gte: 50,
//         },
//       },
//     })

//     if (sendingAccounts.length === 0) {
//       return NextResponse.json(
//         { error: "No healthy sending accounts available. Please check your account health." },
//         { status: 400 },
//       )
//     }

//     // Get pending schedules
//     const pendingSchedules = campaign.prospects.flatMap((p) => p.sendingSchedules)

//     if (pendingSchedules.length === 0) {
//       return NextResponse.json({ error: "No emails pending to send" }, { status: 400 })
//     }

//     // Check company send limits for each prospect
//     const limitsChecked = await Promise.all(
//       campaign.prospects.map(async (prospect) => {
//         if (!prospect.email) return { canSend: false, reason: "No email", prospectId: prospect.id, email: "" }

//         const result = await companySendLimits.canSendToCompany(userId, prospect.email)

//         return {
//           prospectId: prospect.id,
//           email: prospect.email,
//           canSend: result.allowed,
//           reason: result.reason || "OK",
//         }
//       }),
//     )

//     const allowedToSend = limitsChecked.filter((l) => l.canSend)
//     const blocked = limitsChecked.filter((l) => !l.canSend)

//     console.log(`[v0] Manual send: ${allowedToSend.length} allowed, ${blocked.length} blocked by limits`)

//     // Send allowed emails
//     let sent = 0
//     let failed = 0

//     for (const check of allowedToSend) {
//       const prospect = campaign.prospects.find((p) => p.id === check.prospectId)
//       if (!prospect) continue

//       const schedules = prospect.sendingSchedules.filter((s) => s.status === "PENDING")

//       for (const schedule of schedules) {
//         try {
//           // Update schedule to send immediately
//           await db.sendingSchedule.update({
//             where: { id: schedule.id },
//             data: {
//               scheduledFor: new Date(),
//               status: "PENDING",
//             },
//           })

//           sent++
//         } catch (error) {
//           console.error(`[v0] Failed to schedule email for ${prospect.email}:`, error)
//           failed++
//         }
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       message: `${sent} emails queued for immediate sending${blocked.length > 0 ? `, ${blocked.length} blocked by company limits` : ""}`,
//       sent,
//       blocked: blocked.length,
//       blockedReasons: blocked.map((b) => ({ email: b.email, reason: b.reason })),
//     })
//   } catch (error) {
//     console.error("[v0] Manual send error:", error)
//     return NextResponse.json({ error: "Failed to send emails" }, { status: 500 })
//   }
// }

// import { db } from "@/lib/db"
// import { NextResponse } from "next/server"
// import { requireAuth } from "@/lib/auth"
// import { companySendLimits } from "@/lib/services/company-send-limits"

// /**
//  * Manual Send API
//  * Allows user to manually trigger email sending with strict limit enforcement
//  */
// export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
//   try {
//     const { id: campaignId } = await params
//     const userId = await requireAuth()

//     console.log("[v0] Send now request:", { campaignId, userId })

//     // Get campaign
//     const campaign = await db.campaign.findUnique({
//       where: { id: campaignId, userId },
//       include: {
//         prospects: {
//           where: {
//             status: "ACTIVE",
//           },
//           include: {
//             sendingSchedules: {
//               where: {
//                 status: "PENDING",
//               },
//             },
//           },
//         },
//       },
//     })

//     console.log("[v0] Campaign found:", campaign ? "Yes" : "No")

//     if (!campaign) {
//       const campaignExists = await db.campaign.findUnique({ where: { id: campaignId } })
//       console.log("[v0] Campaign exists in DB:", campaignExists ? "Yes" : "No")
//       if (campaignExists) {
//         console.log("[v0] Campaign userId:", campaignExists.userId, "Request userId:", userId)
//       }
//       return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
//     }

//     if (campaign.status !== "ACTIVE") {
//       return NextResponse.json({ error: "Campaign must be active to send emails" }, { status: 400 })
//     }

//     // Check if user has sending accounts
//     const sendingAccounts = await db.sendingAccount.findMany({
//       where: {
//         userId,
//         isActive: true,
//         healthScore: {
//           gte: 50,
//         },
//       },
//     })

//     if (sendingAccounts.length === 0) {
//       return NextResponse.json(
//         { error: "No healthy sending accounts available. Please check your account health." },
//         { status: 400 },
//       )
//     }

//     // Get pending schedules
//     const pendingSchedules = campaign.prospects.flatMap((p) => p.sendingSchedules)

//     if (pendingSchedules.length === 0) {
//       return NextResponse.json({ error: "No emails pending to send" }, { status: 400 })
//     }

//     // Check company send limits for each prospect
//     const limitsChecked = await Promise.all(
//       campaign.prospects.map(async (prospect) => {
//         if (!prospect.email) return { canSend: false, reason: "No email", prospectId: prospect.id, email: "" }

//         const result = await companySendLimits.canSendToCompany(userId, prospect.email)

//         return {
//           prospectId: prospect.id,
//           email: prospect.email,
//           canSend: result.allowed,
//           reason: result.reason || "OK",
//         }
//       }),
//     )

//     const allowedToSend = limitsChecked.filter((l) => l.canSend)
//     const blocked = limitsChecked.filter((l) => !l.canSend)

//     console.log(`[v0] Manual send: ${allowedToSend.length} allowed, ${blocked.length} blocked by limits`)

//     // Send allowed emails
//     let sent = 0
//     let failed = 0

//     for (const check of allowedToSend) {
//       const prospect = campaign.prospects.find((p) => p.id === check.prospectId)
//       if (!prospect) continue

//       const schedules = prospect.sendingSchedules.filter((s) => s.status === "PENDING")

//       for (const schedule of schedules) {
//         try {
//           // Update schedule to send immediately
//           await db.sendingSchedule.update({
//             where: { id: schedule.id },
//             data: {
//               scheduledFor: new Date(),
//               status: "PENDING",
//             },
//           })

//           sent++
//         } catch (error) {
//           console.error(`[v0] Failed to schedule email for ${prospect.email}:`, error)
//           failed++
//         }
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       message: `${sent} emails queued for immediate sending${blocked.length > 0 ? `, ${blocked.length} blocked by company limits` : ""}`,
//       sent,
//       blocked: blocked.length,
//       blockedReasons: blocked.map((b) => ({ email: b.email, reason: b.reason })),
//     })
//   } catch (error) {
//     console.error("[v0] Manual send error:", error)
//     return NextResponse.json({ error: "Failed to send emails" }, { status: 500 })
//   }
// }


import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { companySendLimits } from "@/lib/services/company-send-limits"

/**
 * Manual Send API
 * Allows user to manually trigger email sending with strict limit enforcement
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: campaignId } = await params
    const user = await getCurrentUserFromDb()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = user.id

    console.log("[v0] Send now request:", { campaignId, userId })

    // Get campaign
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId, userId },
      include: {
        prospects: {
          where: {
            status: "ACTIVE",
          },
          include: {
            sendingSchedules: {
              where: {
                status: "PENDING",
              },
            },
          },
        },
      },
    })

    console.log("[v0] Campaign found:", campaign ? "Yes" : "No")

    if (!campaign) {
      const campaignExists = await db.campaign.findUnique({ where: { id: campaignId } })
      console.log("[v0] Campaign exists in DB:", campaignExists ? "Yes" : "No")
      if (campaignExists) {
        console.log("[v0] Campaign userId:", campaignExists.userId, "Request userId:", userId)
      }
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    if (campaign.status !== "ACTIVE") {
      return NextResponse.json({ error: "Campaign must be active to send emails" }, { status: 400 })
    }

    // Check if user has sending accounts
    const sendingAccounts = await db.sendingAccount.findMany({
      where: {
        userId,
        isActive: true,
        healthScore: {
          gte: 50,
        },
      },
    })

    if (sendingAccounts.length === 0) {
      return NextResponse.json(
        { error: "No healthy sending accounts available. Please check your account health." },
        { status: 400 },
      )
    }

    // Get pending schedules
    const pendingSchedules = campaign.prospects.flatMap((p) => p.sendingSchedules)

    if (pendingSchedules.length === 0) {
      return NextResponse.json({ error: "No emails pending to send" }, { status: 400 })
    }

    // Check company send limits for each prospect
    const limitsChecked = await Promise.all(
      campaign.prospects.map(async (prospect) => {
        if (!prospect.email) return { canSend: false, reason: "No email", prospectId: prospect.id, email: "" }

        const result = await companySendLimits.canSendToCompany(userId, prospect.email)

        return {
          prospectId: prospect.id,
          email: prospect.email,
          canSend: result.allowed,
          reason: result.reason || "OK",
        }
      }),
    )

    const allowedToSend = limitsChecked.filter((l) => l.canSend)
    const blocked = limitsChecked.filter((l) => !l.canSend)

    console.log(`[v0] Manual send: ${allowedToSend.length} allowed, ${blocked.length} blocked by limits`)

    // Send allowed emails
    let sent = 0
    let failed = 0

    for (const check of allowedToSend) {
      const prospect = campaign.prospects.find((p) => p.id === check.prospectId)
      if (!prospect) continue

      const schedules = prospect.sendingSchedules.filter((s) => s.status === "PENDING")

      for (const schedule of schedules) {
        try {
          // Update schedule to send immediately
          await db.sendingSchedule.update({
            where: { id: schedule.id },
            data: {
              scheduledFor: new Date(),
              status: "PENDING",
            },
          })

          sent++
        } catch (error) {
          console.error(`[v0] Failed to schedule email for ${prospect.email}:`, error)
          failed++
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${sent} emails queued for immediate sending${blocked.length > 0 ? `, ${blocked.length} blocked by company limits` : ""}`,
      sent,
      blocked: blocked.length,
      blockedReasons: blocked.map((b) => ({ email: b.email, reason: b.reason })),
    })
  } catch (error) {
    console.error("[v0] Manual send error:", error)
    return NextResponse.json({ error: "Failed to send emails" }, { status: 500 })
  }
}
