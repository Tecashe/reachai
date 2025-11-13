// "use server"

// import { db } from "@/lib/db"
// import { NextResponse } from "next/server"
// import { sendEmail } from "@/lib/services/email-sender"

// /**
//  * Cron job to process and send scheduled emails
//  * Run every 15 minutes
//  */
// export async function GET(request: Request) {
//   try {
//     console.log("[v0] Starting email sending cron job")

//     // Get all pending emails scheduled for now or earlier
//     const scheduledEmails = await db.sendingSchedule.findMany({
//       where: {
//         status: "PENDING",
//         scheduledFor: {
//           lte: new Date(),
//         },
//       },
//       include: {
//         prospect: true,
//         sendingAccount: true,
//       },
//       take: 100, // Process 100 at a time
//     })

//     console.log(`[v0] Found ${scheduledEmails.length} emails to send`)

//     const results = {
//       sent: 0,
//       failed: 0,
//       skipped: 0,
//     }

//     for (const schedule of scheduledEmails) {
//       try {
//         // Mark as processing
//         await db.sendingSchedule.update({
//           where: { id: schedule.id },
//           data: { status: "PROCESSING" },
//         })

//         // Send the email
//         const emailLog = await sendEmail({
//           to: schedule.prospect.email,
//           subject: schedule.subject,
//           body: schedule.body,
//           sendingAccountId: schedule.sendingAccountId || undefined,
//           prospectId: schedule.prospectId,
//           campaignId: schedule.campaignId || undefined,
//         })

//         // Update schedule status
//         await db.sendingSchedule.update({
//           where: { id: schedule.id },
//           data: {
//             status: "SENT",
//             processedAt: new Date(),
//             emailLogId: emailLog.id,
//           },
//         })

//         results.sent++
//         console.log(`[v0] Sent email to ${schedule.prospect.email}`)
//       } catch (error) {
//         console.error(`[v0] Failed to send email:`, error)

//         // Update schedule with error
//         await db.sendingSchedule.update({
//           where: { id: schedule.id },
//           data: {
//             status: "FAILED",
//             errorMessage: error instanceof Error ? error.message : "Unknown error",
//             retryCount: { increment: 1 },
//           },
//         })

//         results.failed++
//       }
//     }

//     console.log("[v0] Email sending complete:", results)

//     return NextResponse.json({
//       success: true,
//       results,
//     })
//   } catch (error) {
//     console.error("[v0] Email sending cron error:", error)
//     return NextResponse.json({ error: "Failed to process emails" }, { status: 500 })
//   }
// }

"use server"

import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/services/email-sender"

/**
 * Cron job to process and send scheduled emails
 * Run every 15 minutes
 */
export async function GET(request: Request) {
  try {
    console.log("[v0] Starting email sending cron job")

    // Get all pending emails scheduled for now or earlier
    const scheduledEmails = await db.sendingSchedule.findMany({
      where: {
        status: "PENDING",
        scheduledFor: {
          lte: new Date(),
        },
      },
      include: {
        prospect: true,
        sendingAccount: true,
      },
      take: 100, // Process 100 at a time
    })

    console.log(`[v0] Found ${scheduledEmails.length} emails to send`)

    const results = {
      sent: 0,
      failed: 0,
      skipped: 0,
    }

    for (const schedule of scheduledEmails) {
      try {
        // Mark as processing
        await db.sendingSchedule.update({
          where: { id: schedule.id },
          data: { status: "PROCESSING" },
        })

        const emailResult = await sendEmail({
          to: schedule.prospect.email,
          subject: schedule.subject,
          html: schedule.body,
          prospectId: schedule.prospectId,
          campaignId: schedule.campaignId || undefined,
        })

        if (emailResult.success) {
          await db.sendingSchedule.update({
            where: { id: schedule.id },
            data: {
              status: "SENT",
              processedAt: new Date(),
              emailLogId: emailResult.logId,
            },
          })
          results.sent++
          console.log(`[v0] Sent email to ${schedule.prospect.email}`)
        } else {
          await db.sendingSchedule.update({
            where: { id: schedule.id },
            data: {
              status: "FAILED",
              processedAt: new Date(),
              errorMessage: emailResult.error,
              retryCount: { increment: 1 },
            },
          })
          results.failed++
        }
      } catch (error) {
        console.error(`[v0] Failed to send email:`, error)

        await db.sendingSchedule.update({
          where: { id: schedule.id },
          data: {
            status: "FAILED",
            errorMessage: error instanceof Error ? error.message : "Unknown error",
            retryCount: { increment: 1 },
          },
        })

        results.failed++
      }
    }

    console.log("[v0] Email sending complete:", results)

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error("[v0] Email sending cron error:", error)
    return NextResponse.json({ error: "Failed to process emails" }, { status: 500 })
  }
}
