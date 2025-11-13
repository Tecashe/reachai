// "use server"

// import { type NextRequest, NextResponse } from "next/server"
// import { getCurrentUserFromDb } from "@/lib/auth"
// import { db } from "@/lib/db"
// import { logger } from "@/lib/logger"

// export async function POST(req: NextRequest) {
//   try {
//     const user = await getCurrentUserFromDb()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { replyId, subsequenceId, delayHours } = await req.json()

//     const reply = await db.emailReply.findUnique({
//       where: { id: replyId },
//       include: { prospect: true },
//     })

//     if (!reply || reply.prospect.userId !== user.id) {
//       return NextResponse.json({ error: "Reply not found" }, { status: 404 })
//     }

//     const scheduledFor = new Date(Date.now() + (delayHours || 24) * 60 * 60 * 1000)

//     await db.sendingSchedule.create({
//       data: {
//         userId: user.id,
//         prospectId: reply.prospectId,
//         campaignId: reply.campaignId,
//         subject: `Following up on ${reply.subject}`,
//         body: `This is a follow-up email triggered by reply category: ${reply.category}`,
//         scheduledFor,
//         status: "PENDING",
//       },
//     })

//     logger.info("Added to subsequence", { replyId, prospectId: reply.prospectId })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     logger.error("Add to sequence error", error as Error)
//     return NextResponse.json({ error: "Failed to add to sequence" }, { status: 500 })
//   }
// }

"use server"

import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { replyId, sequenceId, delayHours } = await req.json()

    const reply = await db.emailReply.findUnique({
      where: { id: replyId },
      include: { prospect: true },
    })

    if (!reply || reply.prospect.userId !== user.id) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 })
    }

    const campaign = await db.campaign.findUnique({
      where: { id: sequenceId }, // sequenceId is actually campaignId
      include: {
        emailSequences: {
          include: { template: true },
          orderBy: { stepNumber: "asc" },
        },
      },
    })

    if (!campaign || campaign.userId !== user.id) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const baseTime = Date.now() + (delayHours || 24) * 60 * 60 * 1000

    for (const sequenceStep of campaign.emailSequences) {
      const scheduledFor = new Date(baseTime + sequenceStep.delayDays * 24 * 60 * 60 * 1000)

      // Personalize template with prospect data
      const personalizedSubject = sequenceStep.template.subject
        .replace(/{{firstName}}/g, reply.prospect.firstName || "")
        .replace(/{{lastName}}/g, reply.prospect.lastName || "")
        .replace(/{{company}}/g, reply.prospect.company || "")

      const personalizedBody = sequenceStep.template.body
        .replace(/{{firstName}}/g, reply.prospect.firstName || "")
        .replace(/{{lastName}}/g, reply.prospect.lastName || "")
        .replace(/{{company}}/g, reply.prospect.company || "")
        .replace(/{{jobTitle}}/g, reply.prospect.jobTitle || "")

      await db.sendingSchedule.create({
        data: {
          userId: user.id,
          prospectId: reply.prospectId,
          campaignId: reply.campaignId,
          subject: personalizedSubject,
          body: personalizedBody,
          scheduledFor,
          status: "PENDING",
        },
      })
    }

    await db.prospect.update({
      where: { id: reply.prospectId },
      data: {
        status: "CONTACTED",
      },
    })

    logger.info("Added to sequence", {
      replyId,
      prospectId: reply.prospectId,
      campaignId: campaign.id,
      emailsScheduled: campaign.emailSequences.length,
    })

    return NextResponse.json({
      success: true,
      emailsScheduled: campaign.emailSequences.length,
    })
  } catch (error) {
    logger.error("Add to sequence error", error as Error)
    return NextResponse.json({ error: "Failed to add to sequence" }, { status: 500 })
  }
}
