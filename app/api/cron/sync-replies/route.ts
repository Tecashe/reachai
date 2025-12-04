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












// import { NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { type gmail_v1, google } from "googleapis"
// import { decrypt } from "@/lib/encryption"

// export const dynamic = "force-dynamic"
// export const maxDuration = 300

// export async function GET(request: Request) {
//   try {
//     const authHeader = request.headers.get("authorization")
//     const cronSecret = process.env.CRON_SECRET

//     if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     console.log("[v0] Starting reply sync...")

//     // Get all active Gmail sending accounts
//     const sendingAccounts = await db.sendingAccount.findMany({
//       where: {
//         provider: {
//           equals: "gmail",
//           mode: "insensitive"  // This will match "gmail", "Gmail", "GMAIL"
//         },
//         isActive: true,
//       },
//     })

//     // const sendingAccounts = await db.sendingAccount.findMany({
//     //   where: {
//     //     provider: "GMAIL",
//     //     isActive: true,
//     //   },
//     // })

//     console.log("[v0] Found", sendingAccounts.length, "Gmail accounts to sync")

//     let totalReplies = 0

//     for (const account of sendingAccounts) {
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
//     return NextResponse.json({ error: "Failed to sync replies" }, { status: 500 })
//   }
// }

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
//         emailsOpened: { increment: 1 },
//         lastContactedAt: new Date(),
//         status: "REPLIED",
//       },
//     })

//     await db.emailLog.update({
//       where: { id: emailLog.id },
//       data: {
//         repliedAt: new Date(),
//         opens: { increment: 1 },
//         openedAt: emailLog.openedAt || new Date(),
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



// import { NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { type gmail_v1, google } from "googleapis"
// import { decrypt } from "@/lib/encryption"

// export const dynamic = "force-dynamic"
// export const maxDuration = 300

// export async function GET(request: Request) {
//   try {
//     const authHeader = request.headers.get("authorization")
//     const cronSecret = process.env.CRON_SECRET

//     if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     console.log("[v0] Starting reply sync...")

//     // Get all active Gmail sending accounts
//     const sendingAccounts = await db.sendingAccount.findMany({
//       where: {
//         provider: {
//           equals: "gmail",
//           mode: "insensitive"
//         },
//         isActive: true,
//       },
//     })

//     console.log("[v0] Found", sendingAccounts.length, "Gmail accounts to sync")

//     let totalReplies = 0

//     for (const account of sendingAccounts) {
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
//     return NextResponse.json({ error: "Failed to sync replies" }, { status: 500 })
//   }
// }

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

//     const newReply = await db.emailReply.create({
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
//         emailsOpened: { increment: 1 },
//         lastContactedAt: new Date(),
//         status: "REPLIED",
//       },
//     })

//     await db.emailLog.update({
//       where: { id: emailLog.id },
//       data: {
//         repliedAt: new Date(),
//         opens: { increment: 1 },
//         openedAt: emailLog.openedAt || new Date(),
//       },
//     })

//     await db.notification.create({
//       data: {
//         userId: sendingAccount.userId,
//         type: "NEW_REPLY",
//         title: "New Reply Received",
//         message: `${prospect.firstName || senderEmail} replied to your campaign`,
//         entityType: "reply",
//         entityId: newReply.id,
//         actionUrl: `/dashboard/inbox?replyId=${newReply.id}`,
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

    console.log("[v0] Starting reply sync at", new Date().toISOString())

    // Get all active Gmail sending accounts
    const sendingAccounts = await db.sendingAccount.findMany({
      where: {
        provider: {
          equals: "gmail",
          mode: "insensitive",
        },
        isActive: true,
      },
    })

    console.log("[v0] Found", sendingAccounts.length, "Gmail accounts to sync")
    
    // Log account details
    for (const account of sendingAccounts) {
      console.log(`[v0] Account: ${account.email}, User: ${account.userId}`)
    }

    let totalReplies = 0
    const accountResults: any[] = []

    for (const account of sendingAccounts) {
      console.log(`\n[v0] ====== Processing account: ${account.email} ======`)
      const result = await syncAccountReplies(account)
      totalReplies += result.repliesProcessed
      accountResults.push({
        email: account.email,
        messagesFound: result.messagesFound,
        repliesProcessed: result.repliesProcessed,
        errors: result.errors
      })
    }

    console.log("[v0] Reply sync complete. Total replies:", totalReplies)

    return NextResponse.json({
      success: true,
      accountsSynced: sendingAccounts.length,
      totalReplies,
      details: accountResults
    })
  } catch (error) {
    console.error("[v0] Reply sync error:", error)
    return NextResponse.json({ 
      error: "Failed to sync replies",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

async function syncAccountReplies(sendingAccount: any): Promise<{
  messagesFound: number
  repliesProcessed: number
  errors: string[]
}> {
  const errors: string[] = []
  
  try {
    console.log(`[${sendingAccount.email}] Decrypting credentials...`)
    const credentials = decrypt(sendingAccount.credentials)
    console.log(`[${sendingAccount.email}] ✓ Credentials decrypted`)
    console.log(`[${sendingAccount.email}] Has access token: ${!!credentials.accessToken}`)
    console.log(`[${sendingAccount.email}] Has refresh token: ${!!credentials.refreshToken}`)

    // Check if OAuth credentials are configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      const error = "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables"
      console.error(`[${sendingAccount.email}] ✗ ${error}`)
      errors.push(error)
      return { messagesFound: 0, repliesProcessed: 0, errors }
    }

    console.log(`[${sendingAccount.email}] OAuth client ID configured: ${process.env.GOOGLE_CLIENT_ID?.substring(0, 20)}...`)

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )
    
    oauth2Client.setCredentials({
      access_token: credentials.accessToken,
      refresh_token: credentials.refreshToken,
    })

    // Set up token refresh handler
    oauth2Client.on('tokens', async (tokens) => {
      console.log(`[${sendingAccount.email}] Tokens refreshed`)
      if (tokens.refresh_token) {
        console.log(`[${sendingAccount.email}] Got new refresh token, updating database...`)
        try {
          const { encrypt } = await import("@/lib/encryption")
          await db.sendingAccount.update({
            where: { id: sendingAccount.id },
            data: {
              credentials: encrypt({
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
              })
            }
          })
          console.log(`[${sendingAccount.email}] ✓ Updated tokens in database`)
        } catch (updateError) {
          console.error(`[${sendingAccount.email}] Failed to update tokens:`, updateError)
        }
      }
    })

    const gmail = google.gmail({ version: "v1", auth: oauth2Client })

    // Get messages from last 7 days
    const sevenDaysAgo = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000)
    const query = `after:${sevenDaysAgo} -from:me`
    
    console.log(`[${sendingAccount.email}] Gmail query: "${query}"`)
    console.log(`[${sendingAccount.email}] Querying Gmail API...`)
    
    let response
    try {
      response = await gmail.users.messages.list({
        userId: "me",
        q: query,
        maxResults: 500,
      })
      console.log(`[${sendingAccount.email}] ✓ Gmail API responded successfully`)
    } catch (gmailError: any) {
      console.error(`[${sendingAccount.email}] Gmail API error:`, {
        message: gmailError.message,
        code: gmailError.code,
        status: gmailError.status,
        errors: gmailError.errors
      })
      errors.push(`Gmail API: ${gmailError.message || 'unknown error'}`)
      return { messagesFound: 0, repliesProcessed: 0, errors }
    }

    const messages = response.data.messages || []
    console.log(`[${sendingAccount.email}] ✓ Found ${messages.length} messages`)

    if (messages.length === 0) {
      console.log(`[${sendingAccount.email}] No messages found in last 7 days`)
      return { messagesFound: 0, repliesProcessed: 0, errors }
    }

    // Check if we have prospects for this user
    const prospectsCount = await db.prospect.count({
      where: { userId: sendingAccount.userId }
    })
    console.log(`[${sendingAccount.email}] User has ${prospectsCount} prospects in database`)

    // Check if we have email logs for this account
    const emailLogsCount = await db.emailLog.count({
      where: { sendingAccountId: sendingAccount.id }
    })
    console.log(`[${sendingAccount.email}] Account has ${emailLogsCount} sent emails in database`)

    let repliesProcessed = 0

    for (let i = 0; i < Math.min(messages.length, 10); i++) {
      const message = messages[i]
      console.log(`\n[${sendingAccount.email}] --- Message ${i + 1}/${messages.length} ---`)
      
      try {
        const processed = await processReplyMessage(gmail, message.id!, sendingAccount)
        if (processed) {
          repliesProcessed++
          console.log(`[${sendingAccount.email}] ✓ Reply processed successfully`)
        } else {
          console.log(`[${sendingAccount.email}] ✗ Reply not processed`)
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        console.error(`[${sendingAccount.email}] Error processing message:`, errorMsg)
        errors.push(`Message ${message.id}: ${errorMsg}`)
      }
    }

    if (messages.length > 10) {
      console.log(`[${sendingAccount.email}] Note: Only processed first 10 messages for debugging`)
    }

    return { 
      messagesFound: messages.length, 
      repliesProcessed,
      errors 
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error(`[${sendingAccount.email}] Sync error:`, errorMsg)
    errors.push(errorMsg)
    return { messagesFound: 0, repliesProcessed: 0, errors }
  }
}

async function processReplyMessage(
  gmail: gmail_v1.Gmail, 
  messageId: string, 
  sendingAccount: any
): Promise<boolean> {
  const email = sendingAccount.email
  
  console.log(`[${email}] Getting message details...`)
  
  const message = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
    format: "full",
  })

  const headers = message.data.payload?.headers || []
  const fromHeader = headers.find((h) => h.name?.toLowerCase() === "from")
  const subjectHeader = headers.find((h) => h.name?.toLowerCase() === "subject")
  const toHeader = headers.find((h) => h.name?.toLowerCase() === "to")
  const dateHeader = headers.find((h) => h.name?.toLowerCase() === "date")

  const from = fromHeader?.value || ""
  const to = toHeader?.value || ""
  const subject = subjectHeader?.value || ""
  const date = dateHeader?.value || ""

  console.log(`[${email}] From: ${from}`)
  console.log(`[${email}] To: ${to}`)
  console.log(`[${email}] Subject: ${subject}`)
  console.log(`[${email}] Date: ${date}`)

  // Extract sender email
  const emailMatch = from.match(/<(.+?)>/) || from.match(/([^\s]+@[^\s]+)/)
  const senderEmail = emailMatch ? emailMatch[1].trim().toLowerCase() : from.trim().toLowerCase()

  console.log(`[${email}] Extracted sender email: ${senderEmail}`)

  // Check if this is actually a reply (has Re: or similar)
  const isReply = subject.toLowerCase().startsWith('re:') || 
                  subject.toLowerCase().startsWith('fwd:') ||
                  headers.some(h => h.name?.toLowerCase() === 'in-reply-to')
  
  console.log(`[${email}] Looks like a reply: ${isReply}`)

  // Find prospect
  console.log(`[${email}] Looking for prospect with email: ${senderEmail}`)
  const prospect = await db.prospect.findFirst({
    where: {
      email: {
        equals: senderEmail,
        mode: 'insensitive',
      },
      userId: sendingAccount.userId,
    },
  })

  if (!prospect) {
    console.log(`[${email}] ✗ No prospect found for: ${senderEmail}`)
    
    // List some prospects for debugging
    const allProspects = await db.prospect.findMany({
      where: { userId: sendingAccount.userId },
      take: 5,
      select: { email: true, firstName: true, lastName: true }
    })
    console.log(`[${email}] Sample prospects in database:`, allProspects.map(p => p.email))
    
    return false
  }

  console.log(`[${email}] ✓ Found prospect: ${prospect.firstName} ${prospect.lastName} (${prospect.id})`)

  // Check if reply already exists (by Gmail message ID)
  // const existingByMessageId = await db.emailReply.findFirst({
  //   where: { gmailMessageId: messageId }
  // })

  // if (existingByMessageId) {
  //   console.log(`[${email}] ✗ Reply already exists (by Gmail message ID)`)
  //   return false
  // }

  // Check by subject and prospect
  const body = extractBody(message.data)
  const existingByContent = await db.emailReply.findFirst({
    where: {
      prospectId: prospect.id,
      subject,
      body,
    },
  })

  if (existingByContent) {
    console.log(`[${email}] ✗ Reply already exists (by content)`)
    return false
  }

  // Find most recent email log
  console.log(`[${email}] Looking for email log...`)
  const emailLog = await db.emailLog.findFirst({
    where: {
      prospectId: prospect.id,
      sendingAccountId: sendingAccount.id,
      sentAt: { not: null },
    },
    orderBy: {
      sentAt: "desc",
    },
  })

  if (!emailLog) {
    console.log(`[${email}] ✗ No email log found for prospect ${prospect.id}`)
    
    // Check if there are any email logs at all
    const anyLogs = await db.emailLog.count({
      where: { prospectId: prospect.id }
    })
    console.log(`[${email}] This prospect has ${anyLogs} email logs total`)
    
    return false
  }

  console.log(`[${email}] ✓ Found email log: ${emailLog.id} (sent at: ${emailLog.sentAt})`)

  // Create the reply
  console.log(`[${email}] Creating email reply record...`)
  const newReply = await db.emailReply.create({
    data: {
      prospectId: prospect.id,
      campaignId: prospect.campaignId,
      emailLogId: emailLog.id,
      fromEmail: senderEmail,
      subject,
      body,
      repliedAt: dateHeader?.value ? new Date(dateHeader.value) : new Date(),
      isRead: false,
      // gmailMessageId: messageId,
    },
  })

  console.log(`[${email}] ✓ Created reply: ${newReply.id}`)

  // Update prospect
  await db.prospect.update({
    where: { id: prospect.id },
    data: {
      emailsReplied: { increment: 1 },
      emailsOpened: { increment: 1 },
      lastContactedAt: new Date(),
      status: "REPLIED",
    },
  })

  // Update email log
  await db.emailLog.update({
    where: { id: emailLog.id },
    data: {
      repliedAt: new Date(),
      opens: { increment: 1 },
      openedAt: emailLog.openedAt || new Date(),
    },
  })

  // Create notification
  await db.notification.create({
    data: {
      userId: sendingAccount.userId,
      type: "NEW_REPLY",
      title: "New Reply Received",
      message: `${prospect.firstName || senderEmail} replied to your campaign`,
      entityType: "reply",
      entityId: newReply.id,
      actionUrl: `/dashboard/inbox?replyId=${newReply.id}`,
    },
  })

  console.log(`[${email}] ✓✓✓ Successfully processed reply from ${senderEmail}`)
  return true
}

function extractBody(message: gmail_v1.Schema$Message): string {
  if (!message.payload) return ""

  const parts = message.payload.parts || [message.payload]

  // Try text/plain first
  for (const part of parts) {
    if (part.mimeType === "text/plain" && part.body?.data) {
      return Buffer.from(part.body.data, "base64").toString()
    }
  }

  // Fall back to text/html
  for (const part of parts) {
    if (part.mimeType === "text/html" && part.body?.data) {
      const html = Buffer.from(part.body.data, "base64").toString()
      return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    }
  }

  // Check direct body
  if (message.payload.body?.data) {
    return Buffer.from(message.payload.body.data, "base64").toString()
  }

  return ""
}