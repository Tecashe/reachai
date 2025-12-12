// import { NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { sendEmail } from "@/lib/services/email-sender"

// export const dynamic = "force-dynamic"
// export const maxDuration = 300

// /**
//  * NEW SEQUENCE EXECUTION ENGINE
//  * Processes SequenceEnrollment records and executes steps
//  * Runs every 5-15 minutes via Vercel Cron
//  */
// export async function GET(req: Request) {
//   try {
//     // Auth check
//     const authHeader = req.headers.get("authorization")
//     if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     console.log("[v0] Starting sequence processing...")

//     // Get all active enrollments ready for next step
//     const readyEnrollments = await db.sequenceEnrollment.findMany({
//       where: {
//         status: "ACTIVE",
//         nextStepAt: {
//           lte: new Date(),
//         },
//       },
//       include: {
//         sequence: {
//           include: {
//             steps: {
//               orderBy: { order: "asc" },
//             },
//           },
//         },
//       },
//       take: 500, // Process in batches
//     })

//     console.log(`[v0] Found ${readyEnrollments.length} enrollments ready for processing`)

//     let emailsSent = 0
//     let stepsExecuted = 0
//     let errors = 0

//     for (const enrollment of readyEnrollments) {
//       try {
//         const { sequence } = enrollment

//         if (!sequence || sequence.status !== "ACTIVE") {
//           console.log(`[v0] Skipping enrollment ${enrollment.id} - sequence not active`)
//           continue
//         }

//         const prospect = await db.prospect.findUnique({
//           where: { id: enrollment.prospectId },
//           include: {
//             campaign: true,
//           },
//         })

//         if (!prospect) {
//           console.log(`[v0] Skipping enrollment ${enrollment.id} - prospect not found`)
//           continue
//         }

//         // Get next step to execute
//         const nextStepIndex = enrollment.currentStep
//         const nextStep = sequence.steps[nextStepIndex]

//         if (!nextStep) {
//           // No more steps - mark as completed
//           await db.sequenceEnrollment.update({
//             where: { id: enrollment.id },
//             data: {
//               status: "COMPLETED",
//               completedAt: new Date(),
//               nextStepAt: null,
//             },
//           })

//           await db.sequence.update({
//             where: { id: sequence.id },
//             data: {
//               totalCompleted: { increment: 1 },
//             },
//           })

//           console.log(`[v0] Enrollment ${enrollment.id} completed - no more steps`)
//           continue
//         }

//         // Check skip conditions
//         if (nextStep.skipIfReplied && enrollment.replied) {
//           console.log(`[v0] Skipping step ${nextStep.order} - prospect replied`)
//           await advanceToNextStep(enrollment, sequence)
//           continue
//         }

//         if (nextStep.skipIfBounced && prospect.bounced) {
//           console.log(`[v0] Skipping step ${nextStep.order} - prospect bounced`)
//           await advanceToNextStep(enrollment, sequence)
//           continue
//         }

//         // Execute step based on type
//         switch (nextStep.stepType) {
//           case "EMAIL":
//             await executeEmailStep(enrollment, nextStep, prospect, sequence)
//             emailsSent++
//             break

//           case "DELAY":
//             // Just advance to next step after delay
//             await advanceToNextStep(enrollment, sequence)
//             break

//           case "TASK":
//             await executeTaskStep(enrollment, nextStep, prospect)
//             break

//           case "LINKEDIN_VIEW":
//           case "LINKEDIN_CONNECT":
//           case "LINKEDIN_MESSAGE":
//             // LinkedIn steps would be handled here
//             console.log(`[v0] LinkedIn step not yet implemented`)
//             await advanceToNextStep(enrollment, sequence)
//             break

//           case "CALL":
//             await executeCallStep(enrollment, nextStep, prospect)
//             break

//           default:
//             console.log(`[v0] Unknown step type: ${nextStep.stepType}`)
//             await advanceToNextStep(enrollment, sequence)
//         }

//         stepsExecuted++
//       } catch (error) {
//         console.error(`[v0] Error processing enrollment ${enrollment.id}:`, error)
//         errors++
//       }

//       // Small delay between processing to avoid rate limits
//       await new Promise((resolve) => setTimeout(resolve, 100))
//     }

//     console.log("[v0] Sequence processing completed", {
//       enrollmentsProcessed: readyEnrollments.length,
//       stepsExecuted,
//       emailsSent,
//       errors,
//     })

//     return NextResponse.json({
//       success: true,
//       enrollmentsProcessed: readyEnrollments.length,
//       stepsExecuted,
//       emailsSent,
//       errors,
//     })
//   } catch (error) {
//     console.error("[v0] Fatal sequence processing error:", error)
//     return NextResponse.json(
//       {
//         success: false,
//         error: error instanceof Error ? error.message : "Internal server error",
//       },
//       { status: 500 },
//     )
//   }
// }

// /**
//  * Execute email step
//  */
// async function executeEmailStep(enrollment: any, step: any, prospect: any, sequence: any) {
//   try {
//     // Personalize email content
//     const personalizedSubject = personalizeContent(step.subject || "", prospect)
//     const personalizedBody = personalizeContent(step.bodyHtml || step.body || "", prospect)

//     console.log(`[v0] Sending email to ${prospect.email} (Step ${step.order})`)

//     // Send email
//     const result = await sendEmail({
//       to: prospect.email,
//       subject: personalizedSubject,
//       html: personalizedBody,
//       userId: prospect.campaign.userId,
//       campaignId: prospect.campaignId,
//       prospectId: prospect.id,
//     })

//     if (result.success) {
//       // Create execution record
//       await db.sequenceStepExecution.create({
//         data: {
//           enrollmentId: enrollment.id,
//           stepId: step.id,
//           scheduledAt: enrollment.nextStepAt,
//           executedAt: new Date(),
//           status: "SENT",
//           messageId: result.messageId,
//         },
//       })

//       // Update step stats
//       await db.sequenceStep.update({
//         where: { id: step.id },
//         data: {
//           sent: { increment: 1 },
//         },
//       })

//       // Update enrollment
//       await db.sequenceEnrollment.update({
//         where: { id: enrollment.id },
//         data: {
//           emailsSent: { increment: 1 },
//         },
//       })

//       // Update prospect
//       await db.prospect.update({
//         where: { id: prospect.id },
//         data: {
//           lastContactedAt: new Date(),
//         },
//       })

//       // Advance to next step
//       await advanceToNextStep(enrollment, sequence)

//       console.log(`[v0] Email sent successfully to ${prospect.email}`)
//     } else {
//       // Log error but don't fail
//       console.error(`[v0] Failed to send email to ${prospect.email}:`, result.error)

//       await db.sequenceStepExecution.create({
//         data: {
//           enrollmentId: enrollment.id,
//           stepId: step.id,
//           scheduledAt: enrollment.nextStepAt,
//           executedAt: new Date(),
//           status: "FAILED",
//           errorMessage: result.error,
//         },
//       })
//     }
//   } catch (error) {
//     console.error(`[v0] Email step execution error:`, error)
//     throw error
//   }
// }

// /**
//  * Execute task step
//  */
// async function executeTaskStep(enrollment: any, step: any, prospect: any) {
//   console.log(`[v0] Creating task for ${prospect.email}`)

//   // Create a task record (you might have a Task model)
//   // For now, just log and advance

//   await db.sequenceStepExecution.create({
//     data: {
//       enrollmentId: enrollment.id,
//       stepId: step.id,
//       scheduledAt: enrollment.nextStepAt,
//       executedAt: new Date(),
//       status: "SENT",
//     },
//   })

//   const sequence = await db.sequence.findUnique({
//     where: { id: enrollment.sequenceId },
//     include: {
//       steps: { orderBy: { order: "asc" } },
//     },
//   })

//   if (sequence) {
//     await advanceToNextStep(enrollment, sequence)
//   }
// }

// /**
//  * Execute call step
//  */
// async function executeCallStep(enrollment: any, step: any, prospect: any) {
//   console.log(`[v0] Creating call task for ${prospect.email}`)

//   // Similar to task step - create a call reminder/task

//   await db.sequenceStepExecution.create({
//     data: {
//       enrollmentId: enrollment.id,
//       stepId: step.id,
//       scheduledAt: enrollment.nextStepAt,
//       executedAt: new Date(),
//       status: "SENT",
//     },
//   })

//   const sequence = await db.sequence.findUnique({
//     where: { id: enrollment.sequenceId },
//     include: {
//       steps: { orderBy: { order: "asc" } },
//     },
//   })

//   if (sequence) {
//     await advanceToNextStep(enrollment, sequence)
//   }
// }

// /**
//  * Advance enrollment to next step
//  */
// async function advanceToNextStep(enrollment: any, sequence: any) {
//   const nextStepIndex = enrollment.currentStep + 1
//   const nextStep = sequence.steps[nextStepIndex]

//   if (!nextStep) {
//     // No more steps
//     await db.sequenceEnrollment.update({
//       where: { id: enrollment.id },
//       data: {
//         status: "COMPLETED",
//         completedAt: new Date(),
//         nextStepAt: null,
//         currentStep: nextStepIndex,
//       },
//     })

//     await db.sequence.update({
//       where: { id: sequence.id },
//       data: {
//         totalCompleted: { increment: 1 },
//       },
//     })

//     return
//   }

//   // Calculate next step time
//   const delayMs = calculateDelayInMs(nextStep.delayValue, nextStep.delayUnit)
//   const nextStepAt = new Date(Date.now() + delayMs)

//   // Check business hours if enabled
//   const finalNextStepAt = sequence.sendInBusinessHours ? adjustForBusinessHours(nextStepAt, sequence) : nextStepAt

//   await db.sequenceEnrollment.update({
//     where: { id: enrollment.id },
//     data: {
//       currentStep: nextStepIndex,
//       nextStepAt: finalNextStepAt,
//     },
//   })
// }

// /**
//  * Calculate delay in milliseconds
//  */
// function calculateDelayInMs(value: number, unit: string): number {
//   switch (unit) {
//     case "MINUTES":
//       return value * 60 * 1000
//     case "HOURS":
//       return value * 60 * 60 * 1000
//     case "DAYS":
//       return value * 24 * 60 * 60 * 1000
//     case "WEEKS":
//       return value * 7 * 24 * 60 * 60 * 1000
//     default:
//       return 0
//   }
// }

// /**
//  * Adjust send time for business hours
//  */
// function adjustForBusinessHours(date: Date, sequence: any): Date {
//   const hours = date.getHours()
//   const day = date.getDay()

//   // Check if it's a business day
//   if (!sequence.businessDays.includes(day)) {
//     // Move to next business day
//     let daysToAdd = 1
//     let nextDay = (day + daysToAdd) % 7
//     while (!sequence.businessDays.includes(nextDay)) {
//       daysToAdd++
//       nextDay = (day + daysToAdd) % 7
//     }
//     date.setDate(date.getDate() + daysToAdd)
//     date.setHours(9, 0, 0, 0) // Start at 9 AM
//     return date
//   }

//   // Parse business hours
//   const startHour = Number.parseInt(sequence.businessHoursStart.split(":")[0])
//   const endHour = Number.parseInt(sequence.businessHoursEnd.split(":")[0])

//   // Check if outside business hours
//   if (hours < startHour) {
//     date.setHours(startHour, 0, 0, 0)
//   } else if (hours >= endHour) {
//     // Move to next business day
//     date.setDate(date.getDate() + 1)
//     date.setHours(startHour, 0, 0, 0)
//   }

//   return date
// }

// /**
//  * Personalize email content with prospect data
//  */
// function personalizeContent(content: string, prospect: any): string {
//   let personalized = content

//   // Replace all common variables
//   personalized = personalized.replace(/\{\{firstName\}\}/g, prospect.firstName || "")
//   personalized = personalized.replace(/\{\{lastName\}\}/g, prospect.lastName || "")
//   personalized = personalized.replace(
//     /\{\{fullName\}\}/g,
//     prospect.firstName && prospect.lastName
//       ? `${prospect.firstName} ${prospect.lastName}`
//       : prospect.firstName || "there",
//   )
//   personalized = personalized.replace(/\{\{company\}\}/g, prospect.company || "your company")
//   personalized = personalized.replace(/\{\{jobTitle\}\}/g, prospect.jobTitle || "")
//   personalized = personalized.replace(/\{\{email\}\}/g, prospect.email || "")
//   personalized = personalized.replace(/\{\{phone\}\}/g, prospect.phoneNumber || "")
//   personalized = personalized.replace(/\{\{location\}\}/g, prospect.location || "")
//   personalized = personalized.replace(/\{\{industry\}\}/g, prospect.industry || "")
//   personalized = personalized.replace(/\{\{companySize\}\}/g, prospect.companySize || "")
//   personalized = personalized.replace(/\{\{linkedinUrl\}\}/g, prospect.linkedinUrl || "")

//   // Handle personalizationTokens from research/AI data
//   if (prospect.personalizationTokens && typeof prospect.personalizationTokens === "object") {
//     Object.entries(prospect.personalizationTokens).forEach(([key, value]) => {
//       const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g")
//       personalized = personalized.replace(regex, String(value || ""))
//     })
//   }

//   return personalized
// }

// import { NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { sendEmail } from "@/lib/services/email-sender"

// export const dynamic = "force-dynamic"
// export const maxDuration = 300

// /**
//  * SEQUENCE EXECUTION ENGINE
//  * Processes SequenceEnrollment records and executes all step types
//  * Runs every 5-15 minutes via Vercel Cron
//  */
// export async function GET(req: Request) {
//   try {
//     // Auth check
//     const authHeader = req.headers.get("authorization")
//     if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     console.log("[Sequence Engine] Starting sequence processing...")

//     // Get all active enrollments ready for next step
//     const readyEnrollments = await db.sequenceEnrollment.findMany({
//       where: {
//         status: "ACTIVE",
//         nextStepAt: {
//           lte: new Date(),
//         },
//       },
//       include: {
//         sequence: {
//           include: {
//             steps: {
//               orderBy: { order: "asc" },
//             },
//           },
//         },
//       },
//       take: 500, // Process in batches
//     })

//     console.log(`[Sequence Engine] Found ${readyEnrollments.length} enrollments ready for processing`)

//     const stats = {
//       emailsSent: 0,
//       tasksCreated: 0,
//       callsScheduled: 0,
//       linkedInActions: 0,
//       conditionsEvaluated: 0,
//       stepsExecuted: 0,
//       errors: 0,
//     }

//     for (const enrollment of readyEnrollments) {
//       try {
//         const { sequence } = enrollment

//         if (!sequence || sequence.status !== "ACTIVE") {
//           console.log(`[Sequence Engine] Skipping enrollment ${enrollment.id} - sequence not active`)
//           continue
//         }

//         const prospect = await db.prospect.findUnique({
//           where: { id: enrollment.prospectId },
//           include: {
//             campaign: {
//               include: {
//                 user: true,
//               },
//             },
//           },
//         })

//         if (!prospect) {
//           console.log(`[Sequence Engine] Skipping enrollment ${enrollment.id} - prospect not found`)
//           continue
//         }

//         // Get next step to execute
//         const nextStepIndex = enrollment.currentStep
//         const nextStep = sequence.steps[nextStepIndex]

//         if (!nextStep) {
//           // No more steps - mark as completed
//           await markEnrollmentCompleted(enrollment.id, sequence.id)
//           console.log(`[Sequence Engine] Enrollment ${enrollment.id} completed - no more steps`)
//           continue
//         }

//         // Check skip conditions
//         if (nextStep.skipIfReplied && enrollment.replied) {
//           console.log(`[Sequence Engine] Skipping step ${nextStep.order} - prospect replied`)
//           await advanceToNextStep(enrollment, sequence)
//           continue
//         }

//         if (nextStep.skipIfBounced && prospect.bounced) {
//           console.log(`[Sequence Engine] Skipping step ${nextStep.order} - prospect bounced`)
//           await advanceToNextStep(enrollment, sequence)
//           continue
//         }

//         // Execute step based on type
//         switch (nextStep.stepType) {
//           case "EMAIL":
//             const emailResult = await executeEmailStep(enrollment, nextStep, prospect, sequence)
//             if (emailResult.success) stats.emailsSent++
//             break

//           case "DELAY":
//             await advanceToNextStep(enrollment, sequence)
//             break

//           case "TASK":
//             await executeTaskStep(enrollment, nextStep, prospect, sequence)
//             stats.tasksCreated++
//             break

//           case "CALL":
//             await executeCallStep(enrollment, nextStep, prospect, sequence)
//             stats.callsScheduled++
//             break

//           case "LINKEDIN_VIEW":
//             await executeLinkedInViewStep(enrollment, nextStep, prospect, sequence)
//             stats.linkedInActions++
//             break

//           case "LINKEDIN_CONNECT":
//             await executeLinkedInConnectStep(enrollment, nextStep, prospect, sequence)
//             stats.linkedInActions++
//             break

//           case "LINKEDIN_MESSAGE":
//             await executeLinkedInMessageStep(enrollment, nextStep, prospect, sequence)
//             stats.linkedInActions++
//             break

//           case "CONDITION":
//             await executeConditionStep(enrollment, nextStep, prospect, sequence)
//             stats.conditionsEvaluated++
//             break

//           default:
//             console.log(`[Sequence Engine] Unknown step type: ${nextStep.stepType}`)
//             await advanceToNextStep(enrollment, sequence)
//         }

//         stats.stepsExecuted++
//       } catch (error) {
//         console.error(`[Sequence Engine] Error processing enrollment ${enrollment.id}:`, error)
//         stats.errors++
//       }

//       // Small delay between processing to avoid rate limits
//       await new Promise((resolve) => setTimeout(resolve, 100))
//     }

//     console.log("[Sequence Engine] Processing completed", stats)

//     return NextResponse.json({
//       success: true,
//       enrollmentsProcessed: readyEnrollments.length,
//       ...stats,
//     })
//   } catch (error) {
//     console.error("[Sequence Engine] Fatal error:", error)
//     return NextResponse.json(
//       {
//         success: false,
//         error: error instanceof Error ? error.message : "Internal server error",
//       },
//       { status: 500 },
//     )
//   }
// }

// // ============================================
// // STEP EXECUTION FUNCTIONS
// // ============================================

// /**
//  * Execute EMAIL step - Send personalized email
//  */
// async function executeEmailStep(enrollment: any, step: any, prospect: any, sequence: any) {
//   try {
//     const personalizedSubject = personalizeContent(step.subject || "", prospect)
//     const personalizedBody = personalizeContent(step.bodyHtml || step.body || "", prospect)

//     console.log(`[Sequence Engine] Sending email to ${prospect.email} (Step ${step.order})`)

//     const result = await sendEmail({
//       to: prospect.email,
//       subject: personalizedSubject,
//       html: personalizedBody,
//       userId: prospect.campaign?.userId,
//       campaignId: prospect.campaignId,
//       prospectId: prospect.id,
//     })

//     if (result.success) {
//       await db.sequenceStepExecution.create({
//         data: {
//           enrollmentId: enrollment.id,
//           stepId: step.id,
//           scheduledAt: enrollment.nextStepAt,
//           executedAt: new Date(),
//           status: "SENT",
//           messageId: result.messageId,
//         },
//       })

//       await db.sequenceStep.update({
//         where: { id: step.id },
//         data: { sent: { increment: 1 } },
//       })

//       await db.sequenceEnrollment.update({
//         where: { id: enrollment.id },
//         data: { emailsSent: { increment: 1 } },
//       })

//       await db.prospect.update({
//         where: { id: prospect.id },
//         data: { lastContactedAt: new Date() },
//       })

//       await advanceToNextStep(enrollment, sequence)
//       console.log(`[Sequence Engine] Email sent successfully to ${prospect.email}`)
//       return { success: true }
//     } else {
//       await db.sequenceStepExecution.create({
//         data: {
//           enrollmentId: enrollment.id,
//           stepId: step.id,
//           scheduledAt: enrollment.nextStepAt,
//           executedAt: new Date(),
//           status: "FAILED",
//           errorMessage: result.error,
//         },
//       })
//       console.error(`[Sequence Engine] Failed to send email to ${prospect.email}:`, result.error)
//       return { success: false, error: result.error }
//     }
//   } catch (error) {
//     console.error(`[Sequence Engine] Email step execution error:`, error)
//     throw error
//   }
// }

// /**
//  * Execute TASK step - Create actionable task notification for user
//  */
// async function executeTaskStep(enrollment: any, step: any, prospect: any, sequence: any) {
//   const userId = prospect.campaign?.userId
//   if (!userId) {
//     console.error(`[Sequence Engine] No user ID found for task step`)
//     await advanceToNextStep(enrollment, sequence)
//     return
//   }

//   const prospectName = prospect.firstName
//     ? `${prospect.firstName}${prospect.lastName ? ` ${prospect.lastName}` : ""}`
//     : prospect.email

//   const taskTitle = personalizeContent(step.taskTitle || "Manual Task", prospect)
//   const taskDescription = personalizeContent(step.taskDescription || "", prospect)

//   await db.notification.create({
//     data: {
//       userId,
//       type: "SYSTEM_UPDATE",
//       title: `Task: ${taskTitle}`,
//       message: taskDescription || `Complete this task for ${prospectName} in sequence "${sequence.name}"`,
//       entityType: "sequence_task",
//       entityId: step.id,
//       metadata: {
//         sequenceId: sequence.id,
//         sequenceName: sequence.name,
//         stepId: step.id,
//         stepOrder: step.order,
//         enrollmentId: enrollment.id,
//         prospectId: prospect.id,
//         prospectName,
//         prospectEmail: prospect.email,
//         prospectCompany: prospect.company,
//         taskPriority: step.taskPriority || "MEDIUM",
//         taskTitle,
//         taskDescription,
//       },
//       actionUrl: `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}`,
//     },
//   })

//   // Create execution record
//   await db.sequenceStepExecution.create({
//     data: {
//       enrollmentId: enrollment.id,
//       stepId: step.id,
//       scheduledAt: enrollment.nextStepAt,
//       executedAt: new Date(),
//       status: "SENT",
//     },
//   })

//   // Update step stats
//   await db.sequenceStep.update({
//     where: { id: step.id },
//     data: { sent: { increment: 1 } },
//   })

//   console.log(`[Sequence Engine] Task created for ${prospect.email}: ${taskTitle}`)
//   await advanceToNextStep(enrollment, sequence)
// }

// /**
//  * Execute CALL step - Create call reminder with script
//  */
// async function executeCallStep(enrollment: any, step: any, prospect: any, sequence: any) {
//   const userId = prospect.campaign?.userId
//   if (!userId) {
//     console.error(`[Sequence Engine] No user ID found for call step`)
//     await advanceToNextStep(enrollment, sequence)
//     return
//   }

//   const prospectName = prospect.firstName
//     ? `${prospect.firstName}${prospect.lastName ? ` ${prospect.lastName}` : ""}`
//     : prospect.email

//   const callScript = personalizeContent(step.callScript || "", prospect)

//   await db.notification.create({
//     data: {
//       userId,
//       type: "SYSTEM_UPDATE",
//       title: `Call: ${prospectName}`,
//       message: `Make a call to ${prospectName}${prospect.phoneNumber ? ` at ${prospect.phoneNumber}` : ""} for sequence "${sequence.name}"`,
//       entityType: "sequence_call",
//       entityId: step.id,
//       metadata: {
//         sequenceId: sequence.id,
//         sequenceName: sequence.name,
//         stepId: step.id,
//         stepOrder: step.order,
//         enrollmentId: enrollment.id,
//         prospectId: prospect.id,
//         prospectName,
//         prospectEmail: prospect.email,
//         prospectPhone: prospect.phoneNumber,
//         prospectCompany: prospect.company,
//         prospectJobTitle: prospect.jobTitle,
//         callScript,
//         expectedDuration: step.callDuration,
//       },
//       actionUrl: `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}`,
//     },
//   })

//   // Create execution record
//   await db.sequenceStepExecution.create({
//     data: {
//       enrollmentId: enrollment.id,
//       stepId: step.id,
//       scheduledAt: enrollment.nextStepAt,
//       executedAt: new Date(),
//       status: "SENT",
//     },
//   })

//   // Update step stats
//   await db.sequenceStep.update({
//     where: { id: step.id },
//     data: { sent: { increment: 1 } },
//   })

//   console.log(
//     `[Sequence Engine] Call scheduled for ${prospect.email}${prospect.phoneNumber ? ` (${prospect.phoneNumber})` : ""}`,
//   )
//   await advanceToNextStep(enrollment, sequence)
// }

// /**
//  * Execute LINKEDIN_VIEW step - Remind user to view LinkedIn profile
//  */
// async function executeLinkedInViewStep(enrollment: any, step: any, prospect: any, sequence: any) {
//   const userId = prospect.campaign?.userId
//   if (!userId) {
//     await advanceToNextStep(enrollment, sequence)
//     return
//   }

//   const prospectName = prospect.firstName
//     ? `${prospect.firstName}${prospect.lastName ? ` ${prospect.lastName}` : ""}`
//     : prospect.email

//   await db.notification.create({
//     data: {
//       userId,
//       type: "SYSTEM_UPDATE",
//       title: `LinkedIn: View ${prospectName}'s profile`,
//       message: `View the LinkedIn profile of ${prospectName}${prospect.company ? ` at ${prospect.company}` : ""} to warm up engagement`,
//       entityType: "sequence_linkedin",
//       entityId: step.id,
//       metadata: {
//         sequenceId: sequence.id,
//         sequenceName: sequence.name,
//         stepId: step.id,
//         stepOrder: step.order,
//         enrollmentId: enrollment.id,
//         prospectId: prospect.id,
//         prospectName,
//         prospectEmail: prospect.email,
//         prospectLinkedIn: prospect.linkedinUrl,
//         prospectCompany: prospect.company,
//         prospectJobTitle: prospect.jobTitle,
//         linkedInAction: "VIEW_PROFILE",
//       },
//       actionUrl: prospect.linkedinUrl || `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}`,
//     },
//   })

//   await db.sequenceStepExecution.create({
//     data: {
//       enrollmentId: enrollment.id,
//       stepId: step.id,
//       scheduledAt: enrollment.nextStepAt,
//       executedAt: new Date(),
//       status: "SENT",
//     },
//   })

//   await db.sequenceStep.update({
//     where: { id: step.id },
//     data: { sent: { increment: 1 } },
//   })

//   console.log(`[Sequence Engine] LinkedIn View task created for ${prospect.email}`)
//   await advanceToNextStep(enrollment, sequence)
// }

// /**
//  * Execute LINKEDIN_CONNECT step - Remind user to send connection request
//  */
// async function executeLinkedInConnectStep(enrollment: any, step: any, prospect: any, sequence: any) {
//   const userId = prospect.campaign?.userId
//   if (!userId) {
//     await advanceToNextStep(enrollment, sequence)
//     return
//   }

//   const prospectName = prospect.firstName
//     ? `${prospect.firstName}${prospect.lastName ? ` ${prospect.lastName}` : ""}`
//     : prospect.email

//   const connectionNote = personalizeContent(step.linkedInMessage || "", prospect)

//   await db.notification.create({
//     data: {
//       userId,
//       type: "SYSTEM_UPDATE",
//       title: `LinkedIn: Connect with ${prospectName}`,
//       message: `Send a LinkedIn connection request to ${prospectName}${prospect.company ? ` at ${prospect.company}` : ""}`,
//       entityType: "sequence_linkedin",
//       entityId: step.id,
//       metadata: {
//         sequenceId: sequence.id,
//         sequenceName: sequence.name,
//         stepId: step.id,
//         stepOrder: step.order,
//         enrollmentId: enrollment.id,
//         prospectId: prospect.id,
//         prospectName,
//         prospectEmail: prospect.email,
//         prospectLinkedIn: prospect.linkedinUrl,
//         prospectCompany: prospect.company,
//         prospectJobTitle: prospect.jobTitle,
//         linkedInAction: "SEND_CONNECTION",
//         connectionNote,
//       },
//       actionUrl: prospect.linkedinUrl || `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}`,
//     },
//   })

//   await db.sequenceStepExecution.create({
//     data: {
//       enrollmentId: enrollment.id,
//       stepId: step.id,
//       scheduledAt: enrollment.nextStepAt,
//       executedAt: new Date(),
//       status: "SENT",
//     },
//   })

//   await db.sequenceStep.update({
//     where: { id: step.id },
//     data: { sent: { increment: 1 } },
//   })

//   console.log(`[Sequence Engine] LinkedIn Connect task created for ${prospect.email}`)
//   await advanceToNextStep(enrollment, sequence)
// }

// /**
//  * Execute LINKEDIN_MESSAGE step - Remind user to send LinkedIn message
//  */
// async function executeLinkedInMessageStep(enrollment: any, step: any, prospect: any, sequence: any) {
//   const userId = prospect.campaign?.userId
//   if (!userId) {
//     await advanceToNextStep(enrollment, sequence)
//     return
//   }

//   const prospectName = prospect.firstName
//     ? `${prospect.firstName}${prospect.lastName ? ` ${prospect.lastName}` : ""}`
//     : prospect.email

//   const linkedInMessage = personalizeContent(step.linkedInMessage || "", prospect)

//   await db.notification.create({
//     data: {
//       userId,
//       type: "SYSTEM_UPDATE",
//       title: `LinkedIn: Message ${prospectName}`,
//       message: `Send a LinkedIn message to ${prospectName}${prospect.company ? ` at ${prospect.company}` : ""}`,
//       entityType: "sequence_linkedin",
//       entityId: step.id,
//       metadata: {
//         sequenceId: sequence.id,
//         sequenceName: sequence.name,
//         stepId: step.id,
//         stepOrder: step.order,
//         enrollmentId: enrollment.id,
//         prospectId: prospect.id,
//         prospectName,
//         prospectEmail: prospect.email,
//         prospectLinkedIn: prospect.linkedinUrl,
//         prospectCompany: prospect.company,
//         prospectJobTitle: prospect.jobTitle,
//         linkedInAction: "SEND_MESSAGE",
//         messageTemplate: linkedInMessage,
//       },
//       actionUrl: prospect.linkedinUrl || `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}`,
//     },
//   })

//   await db.sequenceStepExecution.create({
//     data: {
//       enrollmentId: enrollment.id,
//       stepId: step.id,
//       scheduledAt: enrollment.nextStepAt,
//       executedAt: new Date(),
//       status: "SENT",
//     },
//   })

//   await db.sequenceStep.update({
//     where: { id: step.id },
//     data: { sent: { increment: 1 } },
//   })

//   console.log(`[Sequence Engine] LinkedIn Message task created for ${prospect.email}`)
//   await advanceToNextStep(enrollment, sequence)
// }

// /**
//  * Execute CONDITION step - Evaluate conditions and branch accordingly
//  */
// async function executeConditionStep(enrollment: any, step: any, prospect: any, sequence: any) {
//   console.log(`[Sequence Engine] Evaluating condition for ${prospect.email}`)

//   // Parse conditions from JSON
//   const conditions = step.conditions as {
//     type?: string
//     field?: string
//     operator?: string
//     value?: any
//     trueStepOrder?: number
//     falseStepOrder?: number
//   } | null

//   if (!conditions) {
//     console.log(`[Sequence Engine] No conditions defined, advancing to next step`)
//     await advanceToNextStep(enrollment, sequence)
//     return
//   }

//   // Evaluate condition
//   let conditionMet = false

//   try {
//     switch (conditions.type) {
//       case "engagement":
//         conditionMet = evaluateEngagementCondition(conditions, enrollment, prospect)
//         break
//       case "field":
//         conditionMet = evaluateFieldCondition(conditions, prospect)
//         break
//       case "time":
//         conditionMet = evaluateTimeCondition(conditions, enrollment)
//         break
//       default:
//         console.log(`[Sequence Engine] Unknown condition type: ${conditions.type}`)
//         conditionMet = false
//     }
//   } catch (error) {
//     console.error(`[Sequence Engine] Error evaluating condition:`, error)
//     conditionMet = false
//   }

//   console.log(`[Sequence Engine] Condition result: ${conditionMet}`)

//   // Create execution record
//   await db.sequenceStepExecution.create({
//     data: {
//       enrollmentId: enrollment.id,
//       stepId: step.id,
//       scheduledAt: enrollment.nextStepAt,
//       executedAt: new Date(),
//       status: "SENT",
//     },
//   })

//   // Branch based on condition result
//   if (conditionMet && conditions.trueStepOrder !== undefined) {
//     // Jump to the specified step
//     const targetStepIndex = sequence.steps.findIndex((s: any) => s.order === conditions.trueStepOrder)
//     if (targetStepIndex >= 0) {
//       await jumpToStep(enrollment, sequence, targetStepIndex)
//     } else {
//       await advanceToNextStep(enrollment, sequence)
//     }
//   } else if (!conditionMet && conditions.falseStepOrder !== undefined) {
//     const targetStepIndex = sequence.steps.findIndex((s: any) => s.order === conditions.falseStepOrder)
//     if (targetStepIndex >= 0) {
//       await jumpToStep(enrollment, sequence, targetStepIndex)
//     } else {
//       await advanceToNextStep(enrollment, sequence)
//     }
//   } else {
//     // No branching specified, just continue
//     await advanceToNextStep(enrollment, sequence)
//   }
// }

// /**
//  * Evaluate engagement-based conditions
//  */
// function evaluateEngagementCondition(conditions: any, enrollment: any, prospect: any): boolean {
//   const { field, operator, value } = conditions

//   let actualValue: number
//   switch (field) {
//     case "emailsOpened":
//       actualValue = enrollment.emailsOpened || 0
//       break
//     case "emailsClicked":
//       actualValue = enrollment.emailsClicked || 0
//       break
//     case "replied":
//       return enrollment.replied === (value === true || value === "true")
//     case "bounced":
//       return prospect.bounced === (value === true || value === "true")
//     default:
//       return false
//   }

//   return compareValues(actualValue, operator, Number(value))
// }

// /**
//  * Evaluate field-based conditions
//  */
// function evaluateFieldCondition(conditions: any, prospect: any): boolean {
//   const { field, operator, value } = conditions

//   const actualValue = prospect[field]
//   if (actualValue === undefined) return false

//   if (typeof actualValue === "string") {
//     switch (operator) {
//       case "equals":
//         return actualValue.toLowerCase() === String(value).toLowerCase()
//       case "contains":
//         return actualValue.toLowerCase().includes(String(value).toLowerCase())
//       case "startsWith":
//         return actualValue.toLowerCase().startsWith(String(value).toLowerCase())
//       case "endsWith":
//         return actualValue.toLowerCase().endsWith(String(value).toLowerCase())
//       case "isEmpty":
//         return !actualValue || actualValue.trim() === ""
//       case "isNotEmpty":
//         return !!actualValue && actualValue.trim() !== ""
//       default:
//         return false
//     }
//   }

//   return compareValues(actualValue, operator, value)
// }

// /**
//  * Evaluate time-based conditions
//  */
// function evaluateTimeCondition(conditions: any, enrollment: any): boolean {
//   const { field, operator, value } = conditions

//   let targetDate: Date | null = null
//   switch (field) {
//     case "enrolledAt":
//       targetDate = new Date(enrollment.enrolledAt)
//       break
//     case "lastEmailAt":
//       // Would need to track this
//       return false
//     default:
//       return false
//   }

//   if (!targetDate) return false

//   const now = new Date()
//   const diffHours = (now.getTime() - targetDate.getTime()) / (1000 * 60 * 60)

//   return compareValues(diffHours, operator, Number(value))
// }

// /**
//  * Compare values with operator
//  */
// function compareValues(actual: any, operator: string, expected: any): boolean {
//   switch (operator) {
//     case "equals":
//     case "eq":
//       return actual === expected
//     case "notEquals":
//     case "ne":
//       return actual !== expected
//     case "greaterThan":
//     case "gt":
//       return actual > expected
//     case "greaterThanOrEquals":
//     case "gte":
//       return actual >= expected
//     case "lessThan":
//     case "lt":
//       return actual < expected
//     case "lessThanOrEquals":
//     case "lte":
//       return actual <= expected
//     default:
//       return false
//   }
// }

// // ============================================
// // HELPER FUNCTIONS
// // ============================================

// /**
//  * Mark enrollment as completed
//  */
// async function markEnrollmentCompleted(enrollmentId: string, sequenceId: string) {
//   await db.sequenceEnrollment.update({
//     where: { id: enrollmentId },
//     data: {
//       status: "COMPLETED",
//       completedAt: new Date(),
//       nextStepAt: null,
//     },
//   })

//   await db.sequence.update({
//     where: { id: sequenceId },
//     data: {
//       totalCompleted: { increment: 1 },
//     },
//   })
// }

// /**
//  * Advance enrollment to next step
//  */
// async function advanceToNextStep(enrollment: any, sequence: any) {
//   const nextStepIndex = enrollment.currentStep + 1
//   const nextStep = sequence.steps[nextStepIndex]

//   if (!nextStep) {
//     await markEnrollmentCompleted(enrollment.id, sequence.id)
//     return
//   }

//   const delayMs = calculateDelayInMs(nextStep.delayValue, nextStep.delayUnit)
//   const nextStepAt = new Date(Date.now() + delayMs)
//   const finalNextStepAt = sequence.sendInBusinessHours ? adjustForBusinessHours(nextStepAt, sequence) : nextStepAt

//   await db.sequenceEnrollment.update({
//     where: { id: enrollment.id },
//     data: {
//       currentStep: nextStepIndex,
//       nextStepAt: finalNextStepAt,
//     },
//   })
// }

// /**
//  * Jump to a specific step (for condition branching)
//  */
// async function jumpToStep(enrollment: any, sequence: any, targetStepIndex: number) {
//   const targetStep = sequence.steps[targetStepIndex]

//   if (!targetStep) {
//     await markEnrollmentCompleted(enrollment.id, sequence.id)
//     return
//   }

//   const delayMs = calculateDelayInMs(targetStep.delayValue, targetStep.delayUnit)
//   const nextStepAt = new Date(Date.now() + delayMs)
//   const finalNextStepAt = sequence.sendInBusinessHours ? adjustForBusinessHours(nextStepAt, sequence) : nextStepAt

//   await db.sequenceEnrollment.update({
//     where: { id: enrollment.id },
//     data: {
//       currentStep: targetStepIndex,
//       nextStepAt: finalNextStepAt,
//     },
//   })

//   console.log(`[Sequence Engine] Jumped to step ${targetStepIndex} for enrollment ${enrollment.id}`)
// }

// /**
//  * Calculate delay in milliseconds
//  */
// function calculateDelayInMs(value: number, unit: string): number {
//   switch (unit) {
//     case "MINUTES":
//       return value * 60 * 1000
//     case "HOURS":
//       return value * 60 * 60 * 1000
//     case "DAYS":
//       return value * 24 * 60 * 60 * 1000
//     case "WEEKS":
//       return value * 7 * 24 * 60 * 60 * 1000
//     default:
//       return 0
//   }
// }

// /**
//  * Adjust send time for business hours
//  */
// function adjustForBusinessHours(date: Date, sequence: any): Date {
//   const hours = date.getHours()
//   const day = date.getDay()

//   if (!sequence.businessDays.includes(day)) {
//     let daysToAdd = 1
//     let nextDay = (day + daysToAdd) % 7
//     while (!sequence.businessDays.includes(nextDay)) {
//       daysToAdd++
//       nextDay = (day + daysToAdd) % 7
//     }
//     date.setDate(date.getDate() + daysToAdd)
//     date.setHours(9, 0, 0, 0)
//     return date
//   }

//   const startHour = Number.parseInt(sequence.businessHoursStart.split(":")[0])
//   const endHour = Number.parseInt(sequence.businessHoursEnd.split(":")[0])

//   if (hours < startHour) {
//     date.setHours(startHour, 0, 0, 0)
//   } else if (hours >= endHour) {
//     date.setDate(date.getDate() + 1)
//     date.setHours(startHour, 0, 0, 0)
//   }

//   return date
// }

// /**
//  * Personalize content with prospect data
//  */
// function personalizeContent(content: string, prospect: any): string {
//   let personalized = content

//   personalized = personalized.replace(/\{\{firstName\}\}/g, prospect.firstName || "")
//   personalized = personalized.replace(/\{\{lastName\}\}/g, prospect.lastName || "")
//   personalized = personalized.replace(
//     /\{\{fullName\}\}/g,
//     prospect.firstName && prospect.lastName
//       ? `${prospect.firstName} ${prospect.lastName}`
//       : prospect.firstName || "there",
//   )
//   personalized = personalized.replace(/\{\{company\}\}/g, prospect.company || "your company")
//   personalized = personalized.replace(/\{\{jobTitle\}\}/g, prospect.jobTitle || "")
//   personalized = personalized.replace(/\{\{email\}\}/g, prospect.email || "")
//   personalized = personalized.replace(/\{\{phone\}\}/g, prospect.phoneNumber || "")
//   personalized = personalized.replace(/\{\{location\}\}/g, prospect.location || "")
//   personalized = personalized.replace(/\{\{industry\}\}/g, prospect.industry || "")
//   personalized = personalized.replace(/\{\{companySize\}\}/g, prospect.companySize || "")
//   personalized = personalized.replace(/\{\{linkedinUrl\}\}/g, prospect.linkedinUrl || "")

//   if (prospect.personalizationTokens && typeof prospect.personalizationTokens === "object") {
//     Object.entries(prospect.personalizationTokens).forEach(([key, value]) => {
//       const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g")
//       personalized = personalized.replace(regex, String(value || ""))
//     })
//   }

//   return personalized
// }


import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendEmail } from "@/lib/services/email-sender"
import { replaceVariables, isSafeToSend } from "@/lib/utils/variable-validator"

export const dynamic = "force-dynamic"
export const maxDuration = 300

/**
 * SEQUENCE EXECUTION ENGINE
 * Processes SequenceEnrollment records and executes all step types
 * Runs every 5-15 minutes via Vercel Cron
 */
export async function GET(req: Request) {
  try {
    // Auth check
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[Sequence Engine] Starting sequence processing...")

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

    console.log(`[Sequence Engine] Found ${readyEnrollments.length} enrollments ready for processing`)

    const stats = {
      emailsSent: 0,
      tasksCreated: 0,
      callsScheduled: 0,
      linkedInActions: 0,
      conditionsEvaluated: 0,
      stepsExecuted: 0,
      errors: 0,
    }

    for (const enrollment of readyEnrollments) {
      try {
        const { sequence } = enrollment

        if (!sequence || sequence.status !== "ACTIVE") {
          console.log(`[Sequence Engine] Skipping enrollment ${enrollment.id} - sequence not active`)
          continue
        }

        const prospect = await db.prospect.findUnique({
          where: { id: enrollment.prospectId },
          include: {
            campaign: {
              include: {
                user: true,
              },
            },
          },
        })

        if (!prospect) {
          console.log(`[Sequence Engine] Skipping enrollment ${enrollment.id} - prospect not found`)
          continue
        }

        // Get next step to execute
        const nextStepIndex = enrollment.currentStep
        const nextStep = sequence.steps[nextStepIndex]

        if (!nextStep) {
          // No more steps - mark as completed
          await markEnrollmentCompleted(enrollment.id, sequence.id)
          console.log(`[Sequence Engine] Enrollment ${enrollment.id} completed - no more steps`)
          continue
        }

        // Check skip conditions
        if (nextStep.skipIfReplied && enrollment.replied) {
          console.log(`[Sequence Engine] Skipping step ${nextStep.order} - prospect replied`)
          await advanceToNextStep(enrollment, sequence)
          continue
        }

        if (nextStep.skipIfBounced && prospect.bounced) {
          console.log(`[Sequence Engine] Skipping step ${nextStep.order} - prospect bounced`)
          await advanceToNextStep(enrollment, sequence)
          continue
        }

        // Execute step based on type
        switch (nextStep.stepType) {
          case "EMAIL":
            const emailResult = await executeEmailStep(enrollment, nextStep, prospect, sequence)
            if (emailResult.success) stats.emailsSent++
            break

          case "DELAY":
            await advanceToNextStep(enrollment, sequence)
            break

          case "TASK":
            await executeTaskStep(enrollment, nextStep, prospect, sequence)
            stats.tasksCreated++
            break

          case "CALL":
            await executeCallStep(enrollment, nextStep, prospect, sequence)
            stats.callsScheduled++
            break

          case "LINKEDIN_VIEW":
            await executeLinkedInViewStep(enrollment, nextStep, prospect, sequence)
            stats.linkedInActions++
            break

          case "LINKEDIN_CONNECT":
            await executeLinkedInConnectStep(enrollment, nextStep, prospect, sequence)
            stats.linkedInActions++
            break

          case "LINKEDIN_MESSAGE":
            await executeLinkedInMessageStep(enrollment, nextStep, prospect, sequence)
            stats.linkedInActions++
            break

          case "CONDITION":
            await executeConditionStep(enrollment, nextStep, prospect, sequence)
            stats.conditionsEvaluated++
            break

          default:
            console.log(`[Sequence Engine] Unknown step type: ${nextStep.stepType}`)
            await advanceToNextStep(enrollment, sequence)
        }

        stats.stepsExecuted++
      } catch (error) {
        console.error(`[Sequence Engine] Error processing enrollment ${enrollment.id}:`, error)
        stats.errors++
      }

      // Small delay between processing to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    console.log("[Sequence Engine] Processing completed", stats)

    return NextResponse.json({
      success: true,
      enrollmentsProcessed: readyEnrollments.length,
      ...stats,
    })
  } catch (error) {
    console.error("[Sequence Engine] Fatal error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}

// ============================================
// STEP EXECUTION FUNCTIONS
// ============================================

/**
 * Execute EMAIL step - Send personalized email
 */
async function executeEmailStep(enrollment: any, step: any, prospect: any, sequence: any) {
  try {
    const personalizedSubject = replaceVariables(step.subject || "", prospect)
    const personalizedBody = replaceVariables(step.bodyHtml || step.body || "", prospect)

    const subjectSafe = isSafeToSend(personalizedSubject, prospect)
    const bodySafe = isSafeToSend(personalizedBody, prospect)

    if (!subjectSafe.safe || !bodySafe.safe) {
      console.warn(`[Sequence Engine] Email has unresolved variables, skipping send to ${prospect.email}`)
      console.warn(`[Sequence Engine] Reason: ${subjectSafe.reason || bodySafe.reason}`)

      // Record failed execution
      await db.sequenceStepExecution.create({
        data: {
          enrollmentId: enrollment.id,
          stepId: step.id,
          scheduledAt: enrollment.nextStepAt,
          executedAt: new Date(),
          status: "FAILED",
          errorMessage: subjectSafe.reason || bodySafe.reason || "Unresolved variables in email content",
        },
      })

      // Still advance to next step
      await advanceToNextStep(enrollment, sequence)
      return { success: false }
    }

    console.log(`[Sequence Engine] Sending email to ${prospect.email} (Step ${step.order})`)

    const result = await sendEmail({
      to: prospect.email,
      subject: personalizedSubject,
      html: personalizedBody,
      userId: prospect.campaign?.userId,
      campaignId: prospect.campaignId,
      prospectId: prospect.id,
    })

    if (result.success) {
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

      await db.sequenceStep.update({
        where: { id: step.id },
        data: { sent: { increment: 1 } },
      })

      await db.sequenceEnrollment.update({
        where: { id: enrollment.id },
        data: { emailsSent: { increment: 1 } },
      })

      await db.prospect.update({
        where: { id: prospect.id },
        data: { lastContactedAt: new Date() },
      })

      await advanceToNextStep(enrollment, sequence)
      console.log(`[Sequence Engine] Email sent successfully to ${prospect.email}`)
      return { success: true }
    } else {
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
      console.error(`[Sequence Engine] Failed to send email to ${prospect.email}:`, result.error)
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error(`[Sequence Engine] Email step execution error:`, error)
    throw error
  }
}

/**
 * Execute TASK step - Create actionable task notification for user
 */
async function executeTaskStep(enrollment: any, step: any, prospect: any, sequence: any) {
  const userId = prospect.campaign?.userId
  if (!userId) {
    console.error(`[Sequence Engine] No user ID found for task step`)
    await advanceToNextStep(enrollment, sequence)
    return
  }

  const prospectName = prospect.firstName
    ? `${prospect.firstName}${prospect.lastName ? ` ${prospect.lastName}` : ""}`
    : prospect.email

  const taskTitle = replaceVariables(step.taskTitle || "Manual Task", prospect)
  const taskDescription = replaceVariables(step.taskDescription || "", prospect)

  await db.notification.create({
    data: {
      userId,
      type: "SYSTEM_UPDATE",
      title: `Task: ${taskTitle}`,
      message: taskDescription || `Complete this task for ${prospectName} in sequence "${sequence.name}"`,
      entityType: "sequence_task",
      entityId: step.id,
      metadata: {
        sequenceId: sequence.id,
        sequenceName: sequence.name,
        stepId: step.id,
        stepOrder: step.order,
        enrollmentId: enrollment.id,
        prospectId: prospect.id,
        prospectName,
        prospectEmail: prospect.email,
        prospectCompany: prospect.company,
        taskPriority: step.taskPriority || "MEDIUM",
        taskTitle,
        taskDescription,
      },
      actionUrl: `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}`,
    },
  })

  // Create execution record
  await db.sequenceStepExecution.create({
    data: {
      enrollmentId: enrollment.id,
      stepId: step.id,
      scheduledAt: enrollment.nextStepAt,
      executedAt: new Date(),
      status: "SENT",
    },
  })

  // Update step stats
  await db.sequenceStep.update({
    where: { id: step.id },
    data: { sent: { increment: 1 } },
  })

  console.log(`[Sequence Engine] Task created for ${prospect.email}: ${taskTitle}`)
  await advanceToNextStep(enrollment, sequence)
}

/**
 * Execute CALL step - Create call reminder with script
 */
async function executeCallStep(enrollment: any, step: any, prospect: any, sequence: any) {
  const userId = prospect.campaign?.userId
  if (!userId) {
    console.error(`[Sequence Engine] No user ID found for call step`)
    await advanceToNextStep(enrollment, sequence)
    return
  }

  const prospectName = prospect.firstName
    ? `${prospect.firstName}${prospect.lastName ? ` ${prospect.lastName}` : ""}`
    : prospect.email

  const callScript = replaceVariables(step.callScript || "", prospect)

  await db.notification.create({
    data: {
      userId,
      type: "SYSTEM_UPDATE",
      title: `Call: ${prospectName}`,
      message: `Make a call to ${prospectName}${prospect.phoneNumber ? ` at ${prospect.phoneNumber}` : ""} for sequence "${sequence.name}"`,
      entityType: "sequence_call",
      entityId: step.id,
      metadata: {
        sequenceId: sequence.id,
        sequenceName: sequence.name,
        stepId: step.id,
        stepOrder: step.order,
        enrollmentId: enrollment.id,
        prospectId: prospect.id,
        prospectName,
        prospectEmail: prospect.email,
        prospectPhone: prospect.phoneNumber,
        prospectCompany: prospect.company,
        prospectJobTitle: prospect.jobTitle,
        callScript,
        expectedDuration: step.callDuration,
      },
      actionUrl: `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}`,
    },
  })

  // Create execution record
  await db.sequenceStepExecution.create({
    data: {
      enrollmentId: enrollment.id,
      stepId: step.id,
      scheduledAt: enrollment.nextStepAt,
      executedAt: new Date(),
      status: "SENT",
    },
  })

  // Update step stats
  await db.sequenceStep.update({
    where: { id: step.id },
    data: { sent: { increment: 1 } },
  })

  console.log(
    `[Sequence Engine] Call scheduled for ${prospect.email}${prospect.phoneNumber ? ` (${prospect.phoneNumber})` : ""}`,
  )
  await advanceToNextStep(enrollment, sequence)
}

/**
 * Execute LINKEDIN_VIEW step - Remind user to view LinkedIn profile
 */
async function executeLinkedInViewStep(enrollment: any, step: any, prospect: any, sequence: any) {
  const userId = prospect.campaign?.userId
  if (!userId) {
    await advanceToNextStep(enrollment, sequence)
    return
  }

  const prospectName = prospect.firstName
    ? `${prospect.firstName}${prospect.lastName ? ` ${prospect.lastName}` : ""}`
    : prospect.email

  await db.notification.create({
    data: {
      userId,
      type: "SYSTEM_UPDATE",
      title: `LinkedIn: View ${prospectName}'s profile`,
      message: `View the LinkedIn profile of ${prospectName}${prospect.company ? ` at ${prospect.company}` : ""} to warm up engagement`,
      entityType: "sequence_linkedin",
      entityId: step.id,
      metadata: {
        sequenceId: sequence.id,
        sequenceName: sequence.name,
        stepId: step.id,
        stepOrder: step.order,
        enrollmentId: enrollment.id,
        prospectId: prospect.id,
        prospectName,
        prospectEmail: prospect.email,
        prospectLinkedIn: prospect.linkedinUrl,
        prospectCompany: prospect.company,
        prospectJobTitle: prospect.jobTitle,
        linkedInAction: "VIEW_PROFILE",
      },
      actionUrl: prospect.linkedinUrl || `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}`,
    },
  })

  await db.sequenceStepExecution.create({
    data: {
      enrollmentId: enrollment.id,
      stepId: step.id,
      scheduledAt: enrollment.nextStepAt,
      executedAt: new Date(),
      status: "SENT",
    },
  })

  await db.sequenceStep.update({
    where: { id: step.id },
    data: { sent: { increment: 1 } },
  })

  console.log(`[Sequence Engine] LinkedIn View task created for ${prospect.email}`)
  await advanceToNextStep(enrollment, sequence)
}

/**
 * Execute LINKEDIN_CONNECT step - Remind user to send connection request
 */
async function executeLinkedInConnectStep(enrollment: any, step: any, prospect: any, sequence: any) {
  const userId = prospect.campaign?.userId
  if (!userId) {
    await advanceToNextStep(enrollment, sequence)
    return
  }

  const prospectName = prospect.firstName
    ? `${prospect.firstName}${prospect.lastName ? ` ${prospect.lastName}` : ""}`
    : prospect.email

  const connectionNote = replaceVariables(step.linkedInMessage || "", prospect)

  await db.notification.create({
    data: {
      userId,
      type: "SYSTEM_UPDATE",
      title: `LinkedIn: Connect with ${prospectName}`,
      message: `Send a LinkedIn connection request to ${prospectName}${prospect.company ? ` at ${prospect.company}` : ""}`,
      entityType: "sequence_linkedin",
      entityId: step.id,
      metadata: {
        sequenceId: sequence.id,
        sequenceName: sequence.name,
        stepId: step.id,
        stepOrder: step.order,
        enrollmentId: enrollment.id,
        prospectId: prospect.id,
        prospectName,
        prospectEmail: prospect.email,
        prospectLinkedIn: prospect.linkedinUrl,
        prospectCompany: prospect.company,
        prospectJobTitle: prospect.jobTitle,
        linkedInAction: "SEND_CONNECTION",
        connectionNote,
      },
      actionUrl: prospect.linkedinUrl || `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}`,
    },
  })

  await db.sequenceStepExecution.create({
    data: {
      enrollmentId: enrollment.id,
      stepId: step.id,
      scheduledAt: enrollment.nextStepAt,
      executedAt: new Date(),
      status: "SENT",
    },
  })

  await db.sequenceStep.update({
    where: { id: step.id },
    data: { sent: { increment: 1 } },
  })

  console.log(`[Sequence Engine] LinkedIn Connect task created for ${prospect.email}`)
  await advanceToNextStep(enrollment, sequence)
}

/**
 * Execute LINKEDIN_MESSAGE step - Remind user to send LinkedIn message
 */
async function executeLinkedInMessageStep(enrollment: any, step: any, prospect: any, sequence: any) {
  const userId = prospect.campaign?.userId
  if (!userId) {
    await advanceToNextStep(enrollment, sequence)
    return
  }

  const prospectName = prospect.firstName
    ? `${prospect.firstName}${prospect.lastName ? ` ${prospect.lastName}` : ""}`
    : prospect.email

  const linkedInMessage = replaceVariables(step.linkedInMessage || "", prospect)

  await db.notification.create({
    data: {
      userId,
      type: "SYSTEM_UPDATE",
      title: `LinkedIn: Message ${prospectName}`,
      message: `Send a LinkedIn message to ${prospectName}${prospect.company ? ` at ${prospect.company}` : ""}`,
      entityType: "sequence_linkedin",
      entityId: step.id,
      metadata: {
        sequenceId: sequence.id,
        sequenceName: sequence.name,
        stepId: step.id,
        stepOrder: step.order,
        enrollmentId: enrollment.id,
        prospectId: prospect.id,
        prospectName,
        prospectEmail: prospect.email,
        prospectLinkedIn: prospect.linkedinUrl,
        prospectCompany: prospect.company,
        prospectJobTitle: prospect.jobTitle,
        linkedInAction: "SEND_MESSAGE",
        messageTemplate: linkedInMessage,
      },
      actionUrl: prospect.linkedinUrl || `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}`,
    },
  })

  await db.sequenceStepExecution.create({
    data: {
      enrollmentId: enrollment.id,
      stepId: step.id,
      scheduledAt: enrollment.nextStepAt,
      executedAt: new Date(),
      status: "SENT",
    },
  })

  await db.sequenceStep.update({
    where: { id: step.id },
    data: { sent: { increment: 1 } },
  })

  console.log(`[Sequence Engine] LinkedIn Message task created for ${prospect.email}`)
  await advanceToNextStep(enrollment, sequence)
}

/**
 * Execute CONDITION step - Evaluate conditions and branch accordingly
 */
async function executeConditionStep(enrollment: any, step: any, prospect: any, sequence: any) {
  console.log(`[Sequence Engine] Evaluating condition for ${prospect.email}`)

  // Parse conditions from JSON
  const conditions = step.conditions as {
    type?: string
    field?: string
    operator?: string
    value?: any
    trueStepOrder?: number
    falseStepOrder?: number
  } | null

  if (!conditions) {
    console.log(`[Sequence Engine] No conditions defined, advancing to next step`)
    await advanceToNextStep(enrollment, sequence)
    return
  }

  // Evaluate condition
  let conditionMet = false

  try {
    switch (conditions.type) {
      case "engagement":
        conditionMet = evaluateEngagementCondition(conditions, enrollment, prospect)
        break
      case "field":
        conditionMet = evaluateFieldCondition(conditions, prospect)
        break
      case "time":
        conditionMet = evaluateTimeCondition(conditions, enrollment)
        break
      default:
        console.log(`[Sequence Engine] Unknown condition type: ${conditions.type}`)
        conditionMet = false
    }
  } catch (error) {
    console.error(`[Sequence Engine] Error evaluating condition:`, error)
    conditionMet = false
  }

  console.log(`[Sequence Engine] Condition result: ${conditionMet}`)

  // Create execution record
  await db.sequenceStepExecution.create({
    data: {
      enrollmentId: enrollment.id,
      stepId: step.id,
      scheduledAt: enrollment.nextStepAt,
      executedAt: new Date(),
      status: "SENT",
    },
  })

  // Branch based on condition result
  if (conditionMet && conditions.trueStepOrder !== undefined) {
    // Jump to the specified step
    const targetStepIndex = sequence.steps.findIndex((s: any) => s.order === conditions.trueStepOrder)
    if (targetStepIndex >= 0) {
      await jumpToStep(enrollment, sequence, targetStepIndex)
    } else {
      await advanceToNextStep(enrollment, sequence)
    }
  } else if (!conditionMet && conditions.falseStepOrder !== undefined) {
    const targetStepIndex = sequence.steps.findIndex((s: any) => s.order === conditions.falseStepOrder)
    if (targetStepIndex >= 0) {
      await jumpToStep(enrollment, sequence, targetStepIndex)
    } else {
      await advanceToNextStep(enrollment, sequence)
    }
  } else {
    // No branching specified, just continue
    await advanceToNextStep(enrollment, sequence)
  }
}

/**
 * Evaluate engagement-based conditions
 */
function evaluateEngagementCondition(conditions: any, enrollment: any, prospect: any): boolean {
  const { field, operator, value } = conditions

  let actualValue: number
  switch (field) {
    case "emailsOpened":
      actualValue = enrollment.emailsOpened || 0
      break
    case "emailsClicked":
      actualValue = enrollment.emailsClicked || 0
      break
    case "replied":
      return enrollment.replied === (value === true || value === "true")
    case "bounced":
      return prospect.bounced === (value === true || value === "true")
    default:
      return false
  }

  return compareValues(actualValue, operator, Number(value))
}

/**
 * Evaluate field-based conditions
 */
function evaluateFieldCondition(conditions: any, prospect: any): boolean {
  const { field, operator, value } = conditions

  const actualValue = prospect[field]
  if (actualValue === undefined) return false

  if (typeof actualValue === "string") {
    switch (operator) {
      case "equals":
        return actualValue.toLowerCase() === String(value).toLowerCase()
      case "contains":
        return actualValue.toLowerCase().includes(String(value).toLowerCase())
      case "startsWith":
        return actualValue.toLowerCase().startsWith(String(value).toLowerCase())
      case "endsWith":
        return actualValue.toLowerCase().endsWith(String(value).toLowerCase())
      case "isEmpty":
        return !actualValue || actualValue.trim() === ""
      case "isNotEmpty":
        return !!actualValue && actualValue.trim() !== ""
      default:
        return false
    }
  }

  return compareValues(actualValue, operator, value)
}

/**
 * Evaluate time-based conditions
 */
function evaluateTimeCondition(conditions: any, enrollment: any): boolean {
  const { field, operator, value } = conditions

  let targetDate: Date | null = null
  switch (field) {
    case "enrolledAt":
      targetDate = new Date(enrollment.enrolledAt)
      break
    case "lastEmailAt":
      // Would need to track this
      return false
    default:
      return false
  }

  if (!targetDate) return false

  const now = new Date()
  const diffHours = (now.getTime() - targetDate.getTime()) / (1000 * 60 * 60)

  return compareValues(diffHours, operator, Number(value))
}

/**
 * Compare values with operator
 */
function compareValues(actual: any, operator: string, expected: any): boolean {
  switch (operator) {
    case "equals":
    case "eq":
      return actual === expected
    case "notEquals":
    case "ne":
      return actual !== expected
    case "greaterThan":
    case "gt":
      return actual > expected
    case "greaterThanOrEquals":
    case "gte":
      return actual >= expected
    case "lessThan":
    case "lt":
      return actual < expected
    case "lessThanOrEquals":
    case "lte":
      return actual <= expected
    default:
      return false
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Mark enrollment as completed
 */
async function markEnrollmentCompleted(enrollmentId: string, sequenceId: string) {
  await db.sequenceEnrollment.update({
    where: { id: enrollmentId },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
      nextStepAt: null,
    },
  })

  await db.sequence.update({
    where: { id: sequenceId },
    data: {
      totalCompleted: { increment: 1 },
    },
  })
}

/**
 * Advance enrollment to next step
 */
async function advanceToNextStep(enrollment: any, sequence: any) {
  const nextStepIndex = enrollment.currentStep + 1
  const nextStep = sequence.steps[nextStepIndex]

  if (!nextStep) {
    await markEnrollmentCompleted(enrollment.id, sequence.id)
    return
  }

  const delayMs = calculateDelayInMs(nextStep.delayValue, nextStep.delayUnit)
  const nextStepAt = new Date(Date.now() + delayMs)
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
 * Jump to a specific step (for condition branching)
 */
async function jumpToStep(enrollment: any, sequence: any, targetStepIndex: number) {
  const targetStep = sequence.steps[targetStepIndex]

  if (!targetStep) {
    await markEnrollmentCompleted(enrollment.id, sequence.id)
    return
  }

  const delayMs = calculateDelayInMs(targetStep.delayValue, targetStep.delayUnit)
  const nextStepAt = new Date(Date.now() + delayMs)
  const finalNextStepAt = sequence.sendInBusinessHours ? adjustForBusinessHours(nextStepAt, sequence) : nextStepAt

  await db.sequenceEnrollment.update({
    where: { id: enrollment.id },
    data: {
      currentStep: targetStepIndex,
      nextStepAt: finalNextStepAt,
    },
  })

  console.log(`[Sequence Engine] Jumped to step ${targetStepIndex} for enrollment ${enrollment.id}`)
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

  if (!sequence.businessDays.includes(day)) {
    let daysToAdd = 1
    let nextDay = (day + daysToAdd) % 7
    while (!sequence.businessDays.includes(nextDay)) {
      daysToAdd++
      nextDay = (day + daysToAdd) % 7
    }
    date.setDate(date.getDate() + daysToAdd)
    date.setHours(9, 0, 0, 0)
    return date
  }

  const startHour = Number.parseInt(sequence.businessHoursStart.split(":")[0])
  const endHour = Number.parseInt(sequence.businessHoursEnd.split(":")[0])

  if (hours < startHour) {
    date.setHours(startHour, 0, 0, 0)
  } else if (hours >= endHour) {
    date.setDate(date.getDate() + 1)
    date.setHours(startHour, 0, 0, 0)
  }

  return date
}
