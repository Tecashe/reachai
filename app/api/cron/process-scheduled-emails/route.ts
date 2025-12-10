import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { emailSender } from "@/lib/services/email-sender"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const now = new Date()

    // Get all pending schedules that are due
    const dueSchedules = await db.sendingSchedule.findMany({
      where: {
        status: "PENDING",
        scheduledFor: {
          lte: now,
        },
      },
      include: {
        prospect: true,
      },
      take: 100, // Process 100 at a time
    })

    logger.info(`Processing ${dueSchedules.length} scheduled emails`)

    const results = []

    for (const schedule of dueSchedules) {
      try {
        // Mark as processing
        await db.sendingSchedule.update({
          where: { id: schedule.id },
          data: { status: "PROCESSING" },
        })

        // Send email
        const result = await emailSender.sendCampaignEmail({
          to: schedule.prospect.email,
          subject: schedule.subject,
          html: schedule.body,
          prospectId: schedule.prospectId,
          campaignId: schedule.campaignId || undefined,
          skipValidation: true, // Already validated when schedule
        })

        if (result.success) {
          await db.sendingSchedule.update({
            where: { id: schedule.id },
            data: {
              status: "SENT",
              processedAt: new Date(),
              emailLogId: result.logId,
            },
          })
          results.push({ scheduleId: schedule.id, success: true })
        } else {
          // Retry logic
          const retryCount = schedule.retryCount + 1
          if (retryCount < 3) {
            await db.sendingSchedule.update({
              where: { id: schedule.id },
              data: {
                status: "PENDING",
                retryCount,
                errorMessage: result.error,
                scheduledFor: new Date(Date.now() + 60 * 60 * 1000), // Retry in 1 hour
              },
            })
          } else {
            await db.sendingSchedule.update({
              where: { id: schedule.id },
              data: {
                status: "FAILED",
                errorMessage: result.error,
                processedAt: new Date(),
              },
            })
          }
          results.push({ scheduleId: schedule.id, success: false, error: result.error })
        }
      } catch (err) {
        logger.error("Failed to process scheduled email", err as Error, { scheduleId: schedule.id })
        results.push({ scheduleId: schedule.id, success: false, error: "Processing error" })
      }
    }

    const successCount = results.filter((r) => r.success).length

    return NextResponse.json({
      success: true,
      processed: dueSchedules.length,
      successful: successCount,
      failed: dueSchedules.length - successCount,
      results,
    })
  } catch (error) {
    logger.error("Cron job error", error as Error)
    return NextResponse.json({ error: "Failed to process scheduled emails" }, { status: 500 })
  }
}
