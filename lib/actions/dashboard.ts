// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"

// export async function getDashboardStats() {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   // Get all campaigns for this user
//   const campaigns = await db.campaign.findMany({
//     where: { userId: user.id },
//     include: {
//       prospects: {
//         select: {
//           emailsReceived: true,
//           emailsOpened: true,
//           emailsClicked: true,
//           emailsReplied: true,
//           status: true,
//         },
//       },
//     },
//   })

//   // Calculate aggregate stats
//   let totalEmailsSent = 0
//   let totalEmailsOpened = 0
//   let totalEmailsClicked = 0
//   let totalEmailsReplied = 0
//   let activeProspects = 0

//   campaigns.forEach((campaign) => {
//     campaign.prospects.forEach((prospect) => {
//       totalEmailsSent += prospect.emailsReceived
//       totalEmailsOpened += prospect.emailsOpened
//       totalEmailsClicked += prospect.emailsClicked
//       totalEmailsReplied += prospect.emailsReplied
//       if (prospect.status === "ACTIVE" || prospect.status === "CONTACTED") {
//         activeProspects++
//       }
//     })
//   })

//   const openRate = totalEmailsSent > 0 ? (totalEmailsOpened / totalEmailsSent) * 100 : 0
//   const clickRate = totalEmailsSent > 0 ? (totalEmailsClicked / totalEmailsSent) * 100 : 0
//   const replyRate = totalEmailsSent > 0 ? (totalEmailsReplied / totalEmailsSent) * 100 : 0

//   return {
//     emailsSent: totalEmailsSent,
//     activeProspects,
//     openRate: openRate.toFixed(1),
//     clickRate: clickRate.toFixed(1),
//     replyRate: replyRate.toFixed(1),
//   }
// }

// export async function getRecentActivity() {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   // Get recent email logs
//   const recentLogs = await db.emailLog.findMany({
//     where: {
//       prospect: {
//         campaign: {
//           userId: user.id,
//         },
//       },
//     },
//     include: {
//       prospect: {
//         select: {
//           firstName: true,
//           lastName: true,
//           email: true,
//           company: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//     take: 10,
//   })

//   return recentLogs.map((log) => ({
//     id: log.id,
//     type: log.status === "DELIVERED" ? "email_sent" : log.status === "BOUNCED" ? "email_bounced" : "email_opened",
//     message:
//       log.status === "DELIVERED"
//         ? `Email sent to ${log.prospect.firstName} ${log.prospect.lastName}`
//         : log.status === "BOUNCED"
//           ? `Email bounced for ${log.prospect.email}`
//           : `${log.prospect.firstName} opened your email`,
//     timestamp: log.createdAt,
//     prospect: log.prospect,
//   }))
// }



"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getDashboardStats() {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      console.error("[builtbycashe] User not found in database")
      return {
        emailsSent: 0,
        activeProspects: 0,
        openRate: "0.0",
        clickRate: "0.0",
        replyRate: "0.0",
      }
    }

    // Get all campaigns for this user
    const campaigns = await db.campaign.findMany({
      where: { userId: user.id },
      include: {
        prospects: {
          select: {
            emailsReceived: true,
            emailsOpened: true,
            emailsClicked: true,
            emailsReplied: true,
            status: true,
          },
        },
      },
    })

    // Calculate aggregate stats
    let totalEmailsSent = 0
    let totalEmailsOpened = 0
    let totalEmailsClicked = 0
    let totalEmailsReplied = 0
    let activeProspects = 0

    campaigns.forEach((campaign) => {
      campaign.prospects.forEach((prospect) => {
        totalEmailsSent += prospect.emailsReceived
        totalEmailsOpened += prospect.emailsOpened
        totalEmailsClicked += prospect.emailsClicked
        totalEmailsReplied += prospect.emailsReplied
        if (prospect.status === "ACTIVE" || prospect.status === "CONTACTED") {
          activeProspects++
        }
      })
    })

    const openRate = totalEmailsSent > 0 ? (totalEmailsOpened / totalEmailsSent) * 100 : 0
    const clickRate = totalEmailsSent > 0 ? (totalEmailsClicked / totalEmailsSent) * 100 : 0
    const replyRate = totalEmailsSent > 0 ? (totalEmailsReplied / totalEmailsSent) * 100 : 0

    return {
      emailsSent: totalEmailsSent,
      activeProspects,
      openRate: openRate.toFixed(1),
      clickRate: clickRate.toFixed(1),
      replyRate: replyRate.toFixed(1),
    }
  } catch (error) {
    console.error("[builtbycashe] Error getting dashboard stats:", error)
    return {
      emailsSent: 0,
      activeProspects: 0,
      openRate: "0.0",
      clickRate: "0.0",
      replyRate: "0.0",
    }
  }
}

export async function getRecentActivity() {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      console.error("[builtbycashe] User not found in database")
      return []
    }

    // Get recent email logs
    const recentLogs = await db.emailLog.findMany({
      where: {
        prospect: {
          campaign: {
            userId: user.id,
          },
        },
      },
      include: {
        prospect: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            company: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    return recentLogs.map((log) => ({
      id: log.id,
      type: log.status === "DELIVERED" ? "email_sent" : log.status === "BOUNCED" ? "email_bounced" : "email_opened",
      message:
        log.status === "DELIVERED"
          ? `Email sent to ${log.prospect.firstName} ${log.prospect.lastName}`
          : log.status === "BOUNCED"
            ? `Email bounced for ${log.prospect.email}`
            : `${log.prospect.firstName} opened your email`,
      timestamp: log.createdAt,
      prospect: log.prospect,
    }))
  } catch (error) {
    console.error("[builtbycashe] Error getting recent activity:", error)
    return []
  }
}
