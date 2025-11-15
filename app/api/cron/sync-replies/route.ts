// import { NextRequest, NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { type gmail_v1, google } from "googleapis"
// import { decrypt } from "@/lib/encryption"

// export const dynamic = "force-dynamic"
// export const maxDuration = 300

// export async function GET(request: NextRequest) {
//   try {
//     console.log("[v0] Starting reply sync...")

//     // Get all active Gmail sending accounts (case-insensitive)
//     const sendingAccounts = await db.sendingAccount.findMany({
//       where: {
//         provider: {
//           equals: "gmail",
//           mode: "insensitive"  // This will match "gmail", "Gmail", "GMAIL"
//         },
//         isActive: true,
//       },
//     })

//     console.log("[v0] Found", sendingAccounts.length, "Gmail accounts to sync")

//     let totalReplies = 0

//     for (const account of sendingAccounts) {
//       console.log("[v0] Syncing account:", account.email)
//       const replies = await syncAccountReplies(account)
//       totalReplies += replies
//     }

//     console.log("[v0] Reply sync complete. Total replies:", totalReplies)

//     return NextResponse.json({
//       success: true,
//       accountsSynced: sendingAccounts.length,
//       totalReplies,
//     })
//   } catch (error) {
//     console.error("[v0] Reply sync error:", error)
//     return NextResponse.json({ 
//       error: "Failed to sync replies",
//       details: error instanceof Error ? error.message : String(error)
//     }, { status: 500 })
//   }
// }

// // export async function GET() {
// //   try {
// //     console.log("[v0] Starting reply sync...")

// //     // Get all active Gmail sending accounts
// //     const sendingAccounts = await db.sendingAccount.findMany({
// //       where: {
// //         provider: "GMAIL",
// //         isActive: true,
// //       },
// //     })

// //     console.log("[v0] Found", sendingAccounts.length, "Gmail accounts to sync")

// //     let totalReplies = 0

// //     for (const account of sendingAccounts) {
// //       const replies = await syncAccountReplies(account)
// //       totalReplies += replies
// //     }

// //     console.log("[v0] Reply sync complete. Total replies:", totalReplies)

// //     return NextResponse.json({
// //       success: true,
// //       accountsSynced: sendingAccounts.length,
// //       totalReplies,
// //     })
// //   } catch (error) {
// //     console.error("[v0] Reply sync error:", error)
// //     return NextResponse.json({ error: "Failed to sync replies" }, { status: 500 })
// //   }
// // }

// async function syncAccountReplies(sendingAccount: any): Promise<number> {
//   try {
//     const credentials = decrypt(sendingAccount.credentials)

//     const oauth2Client = new google.auth.OAuth2()
//     oauth2Client.setCredentials({
//       access_token: credentials.accessToken,
//       refresh_token: credentials.refreshToken,
//     })

//     const gmail = google.gmail({ version: "v1", auth: oauth2Client })

//     // Get messages from last 24 hours
//     const oneDayAgo = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000)
//     const response = await gmail.users.messages.list({
//       userId: "me",
//       q: `in:inbox after:${oneDayAgo}`,
//       maxResults: 100,
//     })

//     const messages = response.data.messages || []
//     let repliesProcessed = 0

//     for (const message of messages) {
//       const processed = await processReplyMessage(gmail, message.id!, sendingAccount)
//       if (processed) repliesProcessed++
//     }

//     console.log("[v0] Synced", repliesProcessed, "replies for", sendingAccount.email)
//     return repliesProcessed
//   } catch (error) {
//     console.error("[v0] Sync account replies error:", error)
//     return 0
//   }
// }

// async function processReplyMessage(gmail: gmail_v1.Gmail, messageId: string, sendingAccount: any): Promise<boolean> {
//   try {
//     const message = await gmail.users.messages.get({
//       userId: "me",
//       id: messageId,
//       format: "full",
//     })

//     const headers = message.data.payload?.headers || []
//     const fromHeader = headers.find((h) => h.name?.toLowerCase() === "from")
//     const subjectHeader = headers.find((h) => h.name?.toLowerCase() === "subject")

//     const from = fromHeader?.value || ""
//     const subject = subjectHeader?.value || ""
//     const body = extractBody(message.data)

//     const emailMatch = from.match(/<(.+?)>/)
//     const senderEmail = emailMatch ? emailMatch[1] : from

//     const prospect = await db.prospect.findFirst({
//       where: {
//         email: senderEmail,
//         userId: sendingAccount.userId,
//       },
//     })

//     if (!prospect) return false

//     // Check if reply already exists
//     const existingReply = await db.emailReply.findFirst({
//       where: {
//         prospectId: prospect.id,
//         subject,
//         body,
//       },
//     })

//     if (existingReply) return false

//     const emailLog = await db.emailLog.findFirst({
//       where: {
//         prospectId: prospect.id,
//         sendingAccountId: sendingAccount.id,
//       },
//       orderBy: {
//         sentAt: "desc",
//       },
//     })

//     if (!emailLog) return false

//     await db.emailReply.create({
//       data: {
//         prospectId: prospect.id,
//         campaignId: prospect.campaignId,
//         emailLogId: emailLog.id,
//         fromEmail: senderEmail,
//         subject,
//         body,
//         repliedAt: new Date(),
//         isRead: false,
//       },
//     })

//     await db.prospect.update({
//       where: { id: prospect.id },
//       data: {
//         emailsReplied: { increment: 1 },
//         lastContactedAt: new Date(),
//         status: "REPLIED",
//       },
//     })

//     await db.emailLog.update({
//       where: { id: emailLog.id },
//       data: {
//         repliedAt: new Date(),
//       },
//     })

//     return true
//   } catch (error) {
//     console.error("[v0] Process reply message error:", error)
//     return false
//   }
// }

// function extractBody(message: gmail_v1.Schema$Message): string {
//   if (!message.payload) return ""

//   const parts = message.payload.parts || [message.payload]

//   for (const part of parts) {
//     if (part.mimeType === "text/plain" && part.body?.data) {
//       return Buffer.from(part.body.data, "base64").toString()
//     }
//   }

//   for (const part of parts) {
//     if (part.mimeType === "text/html" && part.body?.data) {
//       return Buffer.from(part.body.data, "base64").toString()
//     }
//   }

//   return ""
// }












import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { type gmail_v1, google } from "googleapis"
import { decrypt } from "@/lib/encryption"

export const dynamic = "force-dynamic"
export const maxDuration = 300

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Starting reply sync...")

    // Get all active Gmail sending accounts
    const sendingAccounts = await db.sendingAccount.findMany({
      where: {
        provider: {
          equals: "gmail",
          mode: "insensitive"  // This will match "gmail", "Gmail", "GMAIL"
        },
        isActive: true,
      },
    })

    // const sendingAccounts = await db.sendingAccount.findMany({
    //   where: {
    //     provider: "GMAIL",
    //     isActive: true,
    //   },
    // })

    console.log("[v0] Found", sendingAccounts.length, "Gmail accounts to sync")

    let totalReplies = 0

    for (const account of sendingAccounts) {
      const replies = await syncAccountReplies(account)
      totalReplies += replies
    }

    console.log("[v0] Reply sync complete. Total replies:", totalReplies)

    return NextResponse.json({
      success: true,
      accountsSynced: sendingAccounts.length,
      totalReplies,
    })
  } catch (error) {
    console.error("[v0] Reply sync error:", error)
    return NextResponse.json({ error: "Failed to sync replies" }, { status: 500 })
  }
}

async function syncAccountReplies(sendingAccount: any): Promise<number> {
  try {
    const credentials = decrypt(sendingAccount.credentials)

    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
      access_token: credentials.accessToken,
      refresh_token: credentials.refreshToken,
    })

    const gmail = google.gmail({ version: "v1", auth: oauth2Client })

    // Get messages from last 24 hours
    const oneDayAgo = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000)
    const response = await gmail.users.messages.list({
      userId: "me",
      q: `in:inbox after:${oneDayAgo}`,
      maxResults: 100,
    })

    const messages = response.data.messages || []
    let repliesProcessed = 0

    for (const message of messages) {
      const processed = await processReplyMessage(gmail, message.id!, sendingAccount)
      if (processed) repliesProcessed++
    }

    console.log("[v0] Synced", repliesProcessed, "replies for", sendingAccount.email)
    return repliesProcessed
  } catch (error) {
    console.error("[v0] Sync account replies error:", error)
    return 0
  }
}

async function processReplyMessage(gmail: gmail_v1.Gmail, messageId: string, sendingAccount: any): Promise<boolean> {
  try {
    const message = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full",
    })

    const headers = message.data.payload?.headers || []
    const fromHeader = headers.find((h) => h.name?.toLowerCase() === "from")
    const subjectHeader = headers.find((h) => h.name?.toLowerCase() === "subject")

    const from = fromHeader?.value || ""
    const subject = subjectHeader?.value || ""
    const body = extractBody(message.data)

    const emailMatch = from.match(/<(.+?)>/)
    const senderEmail = emailMatch ? emailMatch[1] : from

    const prospect = await db.prospect.findFirst({
      where: {
        email: senderEmail,
        userId: sendingAccount.userId,
      },
    })

    if (!prospect) return false

    // Check if reply already exists
    const existingReply = await db.emailReply.findFirst({
      where: {
        prospectId: prospect.id,
        subject,
        body,
      },
    })

    if (existingReply) return false

    const emailLog = await db.emailLog.findFirst({
      where: {
        prospectId: prospect.id,
        sendingAccountId: sendingAccount.id,
      },
      orderBy: {
        sentAt: "desc",
      },
    })

    if (!emailLog) return false

    await db.emailReply.create({
      data: {
        prospectId: prospect.id,
        campaignId: prospect.campaignId,
        emailLogId: emailLog.id,
        fromEmail: senderEmail,
        subject,
        body,
        repliedAt: new Date(),
        isRead: false,
      },
    })

    await db.prospect.update({
      where: { id: prospect.id },
      data: {
        emailsReplied: { increment: 1 },
        emailsOpened: { increment: 1 },
        lastContactedAt: new Date(),
        status: "REPLIED",
      },
    })

    await db.emailLog.update({
      where: { id: emailLog.id },
      data: {
        repliedAt: new Date(),
        opens: { increment: 1 },
        openedAt: emailLog.openedAt || new Date(),
      },
    })

    return true
  } catch (error) {
    console.error("[v0] Process reply message error:", error)
    return false
  }
}

function extractBody(message: gmail_v1.Schema$Message): string {
  if (!message.payload) return ""

  const parts = message.payload.parts || [message.payload]

  for (const part of parts) {
    if (part.mimeType === "text/plain" && part.body?.data) {
      return Buffer.from(part.body.data, "base64").toString()
    }
  }

  for (const part of parts) {
    if (part.mimeType === "text/html" && part.body?.data) {
      return Buffer.from(part.body.data, "base64").toString()
    }
  }

  return ""
}
