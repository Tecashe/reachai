import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendEmail } from "@/lib/services/email-sender"

export const dynamic = "force-dynamic"
export const maxDuration = 300

/**
 * NEW SEQUENCE EXECUTION ENGINE
 * Processes SequenceEnrollment records and executes steps
 * Runs every 5-15 minutes via Vercel Cron
 */
export async function GET(req: Request) {
  try {
    // Auth check
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Starting sequence processing...")

    // Get all active enrollments ready for next step
    const readyEnrollments = await db.sequenceEnrollment.findMany({
      where: {
        status: "ACTIVE",
        nextStepAt: {
          lte: new Date(),
        },
      },
      include: {
        sequence: {
          include: {
            steps: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
      take: 500, // Process in batches
    })

    console.log(`[v0] Found ${readyEnrollments.length} enrollments ready for processing`)

    let emailsSent = 0
    let stepsExecuted = 0
    let errors = 0

    for (const enrollment of readyEnrollments) {
      try {
        const { sequence } = enrollment

        if (!sequence || sequence.status !== "ACTIVE") {
          console.log(`[v0] Skipping enrollment ${enrollment.id} - sequence not active`)
          continue
        }

        const prospect = await db.prospect.findUnique({
          where: { id: enrollment.prospectId },
          include: {
            campaign: true,
          },
        })

        if (!prospect) {
          console.log(`[v0] Skipping enrollment ${enrollment.id} - prospect not found`)
          continue
        }

        // Get next step to execute
        const nextStepIndex = enrollment.currentStep
        const nextStep = sequence.steps[nextStepIndex]

        if (!nextStep) {
          // No more steps - mark as completed
          await db.sequenceEnrollment.update({
            where: { id: enrollment.id },
            data: {
              status: "COMPLETED",
              completedAt: new Date(),
              nextStepAt: null,
            },
          })

          await db.sequence.update({
            where: { id: sequence.id },
            data: {
              totalCompleted: { increment: 1 },
            },
          })

          console.log(`[v0] Enrollment ${enrollment.id} completed - no more steps`)
          continue
        }

        // Check skip conditions
        if (nextStep.skipIfReplied && enrollment.replied) {
          console.log(`[v0] Skipping step ${nextStep.order} - prospect replied`)
          await advanceToNextStep(enrollment, sequence)
          continue
        }

        if (nextStep.skipIfBounced && prospect.bounced) {
          console.log(`[v0] Skipping step ${nextStep.order} - prospect bounced`)
          await advanceToNextStep(enrollment, sequence)
          continue
        }

        // Execute step based on type
        switch (nextStep.stepType) {
          case "EMAIL":
            await executeEmailStep(enrollment, nextStep, prospect, sequence)
            emailsSent++
            break

          case "DELAY":
            // Just advance to next step after delay
            await advanceToNextStep(enrollment, sequence)
            break

          case "TASK":
            await executeTaskStep(enrollment, nextStep, prospect)
            break

          case "LINKEDIN_VIEW":
          case "LINKEDIN_CONNECT":
          case "LINKEDIN_MESSAGE":
            // LinkedIn steps would be handled here
            console.log(`[v0] LinkedIn step not yet implemented`)
            await advanceToNextStep(enrollment, sequence)
            break

          case "CALL":
            await executeCallStep(enrollment, nextStep, prospect)
            break

          default:
            console.log(`[v0] Unknown step type: ${nextStep.stepType}`)
            await advanceToNextStep(enrollment, sequence)
        }

        stepsExecuted++
      } catch (error) {
        console.error(`[v0] Error processing enrollment ${enrollment.id}:`, error)
        errors++
      }

      // Small delay between processing to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    console.log("[v0] Sequence processing completed", {
      enrollmentsProcessed: readyEnrollments.length,
      stepsExecuted,
      emailsSent,
      errors,
    })

    return NextResponse.json({
      success: true,
      enrollmentsProcessed: readyEnrollments.length,
      stepsExecuted,
      emailsSent,
      errors,
    })
  } catch (error) {
    console.error("[v0] Fatal sequence processing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}

/**
 * Execute email step
 */
async function executeEmailStep(enrollment: any, step: any, prospect: any, sequence: any) {
  try {
    // Personalize email content
    const personalizedSubject = personalizeContent(step.subject || "", prospect)
    const personalizedBody = personalizeContent(step.bodyHtml || step.body || "", prospect)

    console.log(`[v0] Sending email to ${prospect.email} (Step ${step.order})`)

    // Send email
    const result = await sendEmail({
      to: prospect.email,
      subject: personalizedSubject,
      html: personalizedBody,
      userId: prospect.campaign.userId,
      campaignId: prospect.campaignId,
      prospectId: prospect.id,
    })

    if (result.success) {
      // Create execution record
      await db.sequenceStepExecution.create({
        data: {
          enrollmentId: enrollment.id,
          stepId: step.id,
          scheduledAt: enrollment.nextStepAt,
          executedAt: new Date(),
          status: "SENT",
          messageId: result.messageId,
        },
      })

      // Update step stats
      await db.sequenceStep.update({
        where: { id: step.id },
        data: {
          sent: { increment: 1 },
        },
      })

      // Update enrollment
      await db.sequenceEnrollment.update({
        where: { id: enrollment.id },
        data: {
          emailsSent: { increment: 1 },
        },
      })

      // Update prospect
      await db.prospect.update({
        where: { id: prospect.id },
        data: {
          lastContactedAt: new Date(),
        },
      })

      // Advance to next step
      await advanceToNextStep(enrollment, sequence)

      console.log(`[v0] Email sent successfully to ${prospect.email}`)
    } else {
      // Log error but don't fail
      console.error(`[v0] Failed to send email to ${prospect.email}:`, result.error)

      await db.sequenceStepExecution.create({
        data: {
          enrollmentId: enrollment.id,
          stepId: step.id,
          scheduledAt: enrollment.nextStepAt,
          executedAt: new Date(),
          status: "FAILED",
          errorMessage: result.error,
        },
      })
    }
  } catch (error) {
    console.error(`[v0] Email step execution error:`, error)
    throw error
  }
}

/**
 * Execute task step
 */
async function executeTaskStep(enrollment: any, step: any, prospect: any) {
  console.log(`[v0] Creating task for ${prospect.email}`)

  // Create a task record (you might have a Task model)
  // For now, just log and advance

  await db.sequenceStepExecution.create({
    data: {
      enrollmentId: enrollment.id,
      stepId: step.id,
      scheduledAt: enrollment.nextStepAt,
      executedAt: new Date(),
      status: "SENT",
    },
  })

  const sequence = await db.sequence.findUnique({
    where: { id: enrollment.sequenceId },
    include: {
      steps: { orderBy: { order: "asc" } },
    },
  })

  if (sequence) {
    await advanceToNextStep(enrollment, sequence)
  }
}

/**
 * Execute call step
 */
async function executeCallStep(enrollment: any, step: any, prospect: any) {
  console.log(`[v0] Creating call task for ${prospect.email}`)

  // Similar to task step - create a call reminder/task

  await db.sequenceStepExecution.create({
    data: {
      enrollmentId: enrollment.id,
      stepId: step.id,
      scheduledAt: enrollment.nextStepAt,
      executedAt: new Date(),
      status: "SENT",
    },
  })

  const sequence = await db.sequence.findUnique({
    where: { id: enrollment.sequenceId },
    include: {
      steps: { orderBy: { order: "asc" } },
    },
  })

  if (sequence) {
    await advanceToNextStep(enrollment, sequence)
  }
}

/**
 * Advance enrollment to next step
 */
async function advanceToNextStep(enrollment: any, sequence: any) {
  const nextStepIndex = enrollment.currentStep + 1
  const nextStep = sequence.steps[nextStepIndex]

  if (!nextStep) {
    // No more steps
    await db.sequenceEnrollment.update({
      where: { id: enrollment.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        nextStepAt: null,
        currentStep: nextStepIndex,
      },
    })

    await db.sequence.update({
      where: { id: sequence.id },
      data: {
        totalCompleted: { increment: 1 },
      },
    })

    return
  }

  // Calculate next step time
  const delayMs = calculateDelayInMs(nextStep.delayValue, nextStep.delayUnit)
  const nextStepAt = new Date(Date.now() + delayMs)

  // Check business hours if enabled
  const finalNextStepAt = sequence.sendInBusinessHours ? adjustForBusinessHours(nextStepAt, sequence) : nextStepAt

  await db.sequenceEnrollment.update({
    where: { id: enrollment.id },
    data: {
      currentStep: nextStepIndex,
      nextStepAt: finalNextStepAt,
    },
  })
}

/**
 * Calculate delay in milliseconds
 */
function calculateDelayInMs(value: number, unit: string): number {
  switch (unit) {
    case "MINUTES":
      return value * 60 * 1000
    case "HOURS":
      return value * 60 * 60 * 1000
    case "DAYS":
      return value * 24 * 60 * 60 * 1000
    case "WEEKS":
      return value * 7 * 24 * 60 * 60 * 1000
    default:
      return 0
  }
}

/**
 * Adjust send time for business hours
 */
function adjustForBusinessHours(date: Date, sequence: any): Date {
  const hours = date.getHours()
  const day = date.getDay()

  // Check if it's a business day
  if (!sequence.businessDays.includes(day)) {
    // Move to next business day
    let daysToAdd = 1
    let nextDay = (day + daysToAdd) % 7
    while (!sequence.businessDays.includes(nextDay)) {
      daysToAdd++
      nextDay = (day + daysToAdd) % 7
    }
    date.setDate(date.getDate() + daysToAdd)
    date.setHours(9, 0, 0, 0) // Start at 9 AM
    return date
  }

  // Parse business hours
  const startHour = Number.parseInt(sequence.businessHoursStart.split(":")[0])
  const endHour = Number.parseInt(sequence.businessHoursEnd.split(":")[0])

  // Check if outside business hours
  if (hours < startHour) {
    date.setHours(startHour, 0, 0, 0)
  } else if (hours >= endHour) {
    // Move to next business day
    date.setDate(date.getDate() + 1)
    date.setHours(startHour, 0, 0, 0)
  }

  return date
}

/**
 * Personalize email content with prospect data
 */
function personalizeContent(content: string, prospect: any): string {
  let personalized = content

  // Replace all common variables
  personalized = personalized.replace(/\{\{firstName\}\}/g, prospect.firstName || "")
  personalized = personalized.replace(/\{\{lastName\}\}/g, prospect.lastName || "")
  personalized = personalized.replace(
    /\{\{fullName\}\}/g,
    prospect.firstName && prospect.lastName
      ? `${prospect.firstName} ${prospect.lastName}`
      : prospect.firstName || "there",
  )
  personalized = personalized.replace(/\{\{company\}\}/g, prospect.company || "your company")
  personalized = personalized.replace(/\{\{jobTitle\}\}/g, prospect.jobTitle || "")
  personalized = personalized.replace(/\{\{email\}\}/g, prospect.email || "")
  personalized = personalized.replace(/\{\{phone\}\}/g, prospect.phoneNumber || "")
  personalized = personalized.replace(/\{\{location\}\}/g, prospect.location || "")
  personalized = personalized.replace(/\{\{industry\}\}/g, prospect.industry || "")
  personalized = personalized.replace(/\{\{companySize\}\}/g, prospect.companySize || "")
  personalized = personalized.replace(/\{\{linkedinUrl\}\}/g, prospect.linkedinUrl || "")

  // Handle personalizationTokens from research/AI data
  if (prospect.personalizationTokens && typeof prospect.personalizationTokens === "object") {
    Object.entries(prospect.personalizationTokens).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g")
      personalized = personalized.replace(regex, String(value || ""))
    })
  }

  return personalized
}
