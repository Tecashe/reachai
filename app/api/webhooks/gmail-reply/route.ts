// import { type NextRequest, NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { type gmail_v1, google } from "googleapis"
// import { decrypt } from "@/lib/encryption"

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     console.log("[v0] Gmail webhook received:", body)

//     // Gmail sends push notifications via Pub/Sub
//     const message = body.message
//     if (!message || !message.data) {
//       return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 })
//     }

//     // Decode the message
//     const decodedData = Buffer.from(message.data, "base64").toString()
//     const notification = JSON.parse(decodedData)

//     console.log("[v0] Gmail notification:", notification)

//     // Get the email address from notification
//     const emailAddress = notification.emailAddress

//     // Find sending account
//     const sendingAccount = await db.sendingAccount.findFirst({
//       where: {
//         email: emailAddress,
//         provider: "GMAIL",
//         isActive: true,
//       },
//     })

//     if (!sendingAccount) {
//       console.log("[v0] Sending account not found for:", emailAddress)
//       return NextResponse.json({ success: true })
//     }

//     // Fetch new messages using Gmail API
//     await processGmailReplies(sendingAccount)

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("[v0] Gmail webhook error:", error)
//     return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
//   }
// }

// async function processGmailReplies(sendingAccount: any) {
//   try {
//     const credentials = decrypt(sendingAccount.credentials)

//     const oauth2Client = new google.auth.OAuth2()
//     oauth2Client.setCredentials({
//       access_token: credentials.accessToken,
//       refresh_token: credentials.refreshToken,
//     })

//     const gmail = google.gmail({ version: "v1", auth: oauth2Client })

//     // Get unread messages in inbox
//     const response = await gmail.users.messages.list({
//       userId: "me",
//       q: "is:unread in:inbox",
//       maxResults: 50,
//     })

//     const messages = response.data.messages || []

//     for (const message of messages) {
//       await processMessage(gmail, message.id!, sendingAccount)
//     }
//   } catch (error) {
//     console.error("[v0] Process Gmail replies error:", error)
//   }
// }

// async function processMessage(gmail: gmail_v1.Gmail, messageId: string, sendingAccount: any) {
//   try {
//     const message = await gmail.users.messages.get({
//       userId: "me",
//       id: messageId,
//       format: "full",
//     })

//     const headers = message.data.payload?.headers || []
//     const fromHeader = headers.find((h) => h.name?.toLowerCase() === "from")
//     const subjectHeader = headers.find((h) => h.name?.toLowerCase() === "subject")
//     const inReplyToHeader = headers.find((h) => h.name?.toLowerCase() === "in-reply-to")

//     const from = fromHeader?.value || ""
//     const subject = subjectHeader?.value || ""
//     const body = extractBody(message.data)

//     // Extract email from "Name <email>" format
//     const emailMatch = from.match(/<(.+?)>/)
//     const senderEmail = emailMatch ? emailMatch[1] : from

//     console.log("[v0] Processing reply from:", senderEmail)

//     // Find the prospect who sent this reply
//     const prospect = await db.prospect.findFirst({
//       where: {
//         email: senderEmail,
//         userId: sendingAccount.userId,
//       },
//     })

//     if (!prospect) {
//       console.log("[v0] Prospect not found for reply:", senderEmail)
//       return
//     }

//     // Find the email log this is replying to
//     const emailLog = await db.emailLog.findFirst({
//       where: {
//         prospectId: prospect.id,
//         sendingAccountId: sendingAccount.id,
//       },
//       orderBy: {
//         sentAt: "desc",
//       },
//     })

//     if (!emailLog) {
//       console.log("[v0] Email log not found for prospect:", prospect.id)
//       return
//     }

//     const reply = await db.emailReply.create({
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

//     console.log("[v0] Reply processed successfully:", reply.id)

//     // Mark Gmail message as read
//     await gmail.users.messages.modify({
//       userId: "me",
//       id: messageId,
//       requestBody: {
//         removeLabelIds: ["UNREAD"],
//       },
//     })
//   } catch (error) {
//     console.error("[v0] Process message error:", error)
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

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { decryptPassword } from "@/lib/encryption"
import { ImapFlow } from "imapflow"
import { simpleParser } from "mailparser"

/**
 * Deprecated: Gmail Push Notification webhook
 * Replaced Gmail API with IMAP-based processing. This endpoint is deprecated and just returns success.
 * Replies are now fetched via IMAP polling in the cron job (/api/cron/sync-replies).
 * Kept for backward compatibility but does not process messages.
 */
export async function POST(request: NextRequest) {
  console.log("[v0] Gmail reply webhook received (deprecated - using IMAP polling instead)")

  // Return success to acknowledge receipt and prevent retries from Gmail
  return NextResponse.json({
    success: true,
    note: "Using IMAP polling instead of push notifications. See /api/cron/sync-replies",
  })
}

// Functionality below is kept for reference and backward compatibility
// It will not be executed due to the deprecated endpoint above

async function processGmailReplies(sendingAccount: any) {
  try {
    const imapPassword = decryptPassword(sendingAccount.imapPassword || sendingAccount.credentials)

    const client = new ImapFlow({
      host: sendingAccount.imapHost || "imap.gmail.com",
      port: sendingAccount.imapPort || 993,
      secure: true,
      auth: {
        user: sendingAccount.email,
        pass: imapPassword,
      },
    })

    await client.connect()

    await client.mailboxOpen("INBOX")

    // Fix 1: Use 'seen: false' instead of 'unseen: true'
    const messageIds = await client.search({ seen: false })

    // Fix 2: Check if messageIds is an array before iterating
    if (!Array.isArray(messageIds)) {
      console.log("[v0] No messages found or search failed")
      await client.logout()
      return
    }

    for (const messageId of messageIds) {
      try {
        const message = await client.fetchOne(messageId, { source: true })
        
        // Fix 3: Check if message is truthy before accessing source
        if (message && message.source) {
          const parsed = await simpleParser(message.source)
          await processEmail(parsed, sendingAccount)
        }
      } catch (err) {
        console.error("[v0] Error fetching message:", err)
      }
    }

    await client.logout()
  } catch (error) {
    console.error("[v0] Process Gmail replies error:", error)
  }
}

async function processEmail(email: any, sendingAccount: any) {
  try {
    const fromHeader = typeof email.from === "string" ? email.from : email.from?.text || ""
    const subject = email.subject || ""
    const body = email.text || ""

    // Extract email from "Name <email>" format
    const emailMatch = fromHeader.match(/<(.+?)>/)
    const fromEmail = emailMatch ? emailMatch[1] : fromHeader.split("@")[1] ? fromHeader : ""

    if (!fromEmail) {
      console.log("[v0] Could not extract sender email from:", fromHeader)
      return
    }

    console.log("[v0] Processing reply from:", fromEmail)

    const prospect = await db.prospect.findFirst({
      where: {
        email: fromEmail,
        userId: sendingAccount.userId,
      },
    })

    if (!prospect) {
      console.log("[v0] Prospect not found for reply:", fromEmail)
      return
    }

    const emailLog = await db.emailLog.findFirst({
      where: {
        prospectId: prospect.id,
        sendingAccountId: sendingAccount.id,
      },
      orderBy: {
        sentAt: "desc",
      },
    })

    if (!emailLog) {
      console.log("[v0] Email log not found for prospect:", prospect.id)
      return
    }

    // Fix 4: Add missing fromEmail field
    const reply = await db.emailReply.create({
      data: {
        prospectId: prospect.id,
        campaignId: prospect.campaignId,
        emailLogId: emailLog.id,
        fromEmail, // Add required fromEmail field
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
        lastContactedAt: new Date(),
        status: "REPLIED",
      },
    })

    await db.emailLog.update({
      where: { id: emailLog.id },
      data: {
        repliedAt: new Date(),
      },
    })

    console.log("[v0] Reply processed successfully:", reply.id)
  } catch (error) {
    console.error("[v0] Process email error:", error)
  }
}