// "use server"

// import { type NextRequest, NextResponse } from "next/server"
// import { getCurrentUserFromDb } from "@/lib/auth"
// import { db } from "@/lib/db"
// import { emailSender } from "@/lib/services/email-sender"
// import { logger } from "@/lib/logger"

// export async function POST(req: NextRequest) {
//   try {
//     const user = await getCurrentUserFromDb()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { replyId, message, useTemplate } = await req.json()

//     const reply = await db.emailReply.findUnique({
//       where: { id: replyId },
//       include: {
//         prospect: true,
//         emailLog: {
//           include: {
//             sendingAccount: true,
//           },
//         },
//       },
//     })

//     if (!reply || reply.prospect.userId !== user.id) {
//       return NextResponse.json({ error: "Reply not found" }, { status: 404 })
//     }

//     const result = await emailSender.sendEmail({
//       to: reply.fromEmail,
//       from: reply.emailLog.sendingAccount?.email || user.email || "",
//       subject: `Re: ${reply.subject}`,
//       html: message,
//       text: message,
//       prospectId: reply.prospectId,
//       campaignId: reply.campaignId,
//       sendingAccountId: reply.sendingAccountId || undefined,
//     })

//     if (!result.success) {
//       throw new Error(result.error || "Failed to send reply")
//     }

//     await db.emailReply.update({
//       where: { id: replyId },
//       data: {
//         isRead: true,
//         readAt: new Date(),
//       },
//     })

//     logger.info("Reply sent", { replyId, prospectId: reply.prospectId })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     logger.error("Reply error", error as Error)
//     return NextResponse.json({ error: "Failed to send reply" }, { status: 500 })
//   }
// }

"use server"

import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"
import { emailSender } from "@/lib/services/email-sender"
import { logger } from "@/lib/logger"

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { replyId, message } = await req.json()

    const reply = await db.emailReply.findUnique({
      where: { id: replyId },
      include: {
        prospect: true,
        emailLog: {
          include: {
            sendingAccount: true,
          },
        },
      },
    })

    if (!reply || reply.prospect.userId !== user.id) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 })
    }

    const result = await emailSender.sendCampaignEmail({
      to: reply.fromEmail,
      subject: `Re: ${reply.subject}`,
      html: message,
      userId: user.id,
      prospectId: reply.prospectId,
      campaignId: reply.campaignId || undefined,
      skipValidation: true,
    })

    if (!result.success) {
      throw new Error(result.error || "Failed to send reply")
    }

    await db.emailReply.update({
      where: { id: replyId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    logger.info("Reply sent", { replyId, prospectId: reply.prospectId })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Reply error", error as Error)
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 })
  }
}
