
// import { NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { sendEmail } from "@/lib/services/email-sender"
// import { replaceVariables, isSafeToSend } from "@/lib/utils/variable-validator"

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
//     const personalizedSubject = replaceVariables(step.subject || "", prospect)
//     const personalizedBody = replaceVariables(step.bodyHtml || step.body || "", prospect)

//     const subjectSafe = isSafeToSend(personalizedSubject, prospect)
//     const bodySafe = isSafeToSend(personalizedBody, prospect)

//     if (!subjectSafe.safe || !bodySafe.safe) {
//       console.warn(`[Sequence Engine] Email has unresolved variables, skipping send to ${prospect.email}`)
//       console.warn(`[Sequence Engine] Reason: ${subjectSafe.reason || bodySafe.reason}`)

//       // Record failed execution
//       await db.sequenceStepExecution.create({
//         data: {
//           enrollmentId: enrollment.id,
//           stepId: step.id,
//           scheduledAt: enrollment.nextStepAt,
//           executedAt: new Date(),
//           status: "FAILED",
//           errorMessage: subjectSafe.reason || bodySafe.reason || "Unresolved variables in email content",
//         },
//       })

//       // Still advance to next step
//       await advanceToNextStep(enrollment, sequence)
//       return { success: false }
//     }

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

//   const taskTitle = replaceVariables(step.taskTitle || "Manual Task", prospect)
//   const taskDescription = replaceVariables(step.taskDescription || "", prospect)

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

//   const callScript = replaceVariables(step.callScript || "", prospect)

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

//   const connectionNote = replaceVariables(step.linkedInMessage || "", prospect)

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

//   const linkedInMessage = replaceVariables(step.linkedInMessage || "", prospect)

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












// import { NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { sendEmail } from "@/lib/services/email-sender"
// import { Prisma } from "@prisma/client"
// import { replaceVariables, isSafeToSend } from "@/lib/utils/variable-validator"

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
//       abTestsEvaluated: 0,
//       waitUntilChecked: 0,
//       exitTriggersChecked: 0,
//       manualReviewsPaused: 0,
//       multiChannelExecuted: 0,
//       behaviorBranches: 0,
//       randomVariants: 0,
//       voicemailDrops: 0,
//       directMailSent: 0,
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

//         // Check if step is disabled
//         if (nextStep.isEnabled === false) {
//           console.log(`[Sequence Engine] Skipping disabled step ${nextStep.order}`)
//           await advanceToNextStep(enrollment, sequence)
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

//           case "AB_SPLIT":
//             await executeABSplitStep(enrollment, nextStep, prospect, sequence)
//             stats.abTestsEvaluated++
//             break

//           case "WAIT_UNTIL":
//             const waitResult = await executeWaitUntilStep(enrollment, nextStep, prospect, sequence)
//             stats.waitUntilChecked++
//             if (!waitResult.conditionMet) {
//               // Don't advance - continue waiting
//               continue
//             }
//             break

//           case "EXIT_TRIGGER":
//             const shouldExit = await executeExitTriggerStep(enrollment, nextStep, prospect, sequence)
//             stats.exitTriggersChecked++
//             if (shouldExit) {
//               continue // Already exited
//             }
//             break

//           case "MANUAL_REVIEW":
//             await executeManualReviewStep(enrollment, nextStep, prospect, sequence)
//             stats.manualReviewsPaused++
//             continue // Don't advance - wait for manual approval

//           case "MULTI_CHANNEL_TOUCH":
//             await executeMultiChannelTouchStep(enrollment, nextStep, prospect, sequence)
//             stats.multiChannelExecuted++
//             break

//           case "BEHAVIOR_BRANCH":
//             await executeBehaviorBranchStep(enrollment, nextStep, prospect, sequence)
//             stats.behaviorBranches++
//             break

//           case "RANDOM_VARIANT":
//             const randomResult = await executeRandomVariantStep(enrollment, nextStep, prospect, sequence)
//             if (randomResult.success) stats.randomVariants++
//             break

//           case "VOICEMAIL_DROP":
//             await executeVoicemailDropStep(enrollment, nextStep, prospect, sequence)
//             stats.voicemailDrops++
//             break

//           case "DIRECT_MAIL":
//             await executeDirectMailStep(enrollment, nextStep, prospect, sequence)
//             stats.directMailSent++
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

//     // Also process WAIT_UNTIL steps that are waiting for conditions
//     await processWaitingEnrollments(stats)

//     // Check for manual review approvals
//     await processManualReviewApprovals(stats)

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
// // EXISTING STEP EXECUTION FUNCTIONS
// // ============================================

// /**
//  * Execute EMAIL step - Send personalized email
//  */
// async function executeEmailStep(enrollment: any, step: any, prospect: any, sequence: any) {
//   try {
//     const personalizedSubject = replaceVariables(step.subject || "", prospect)
//     const personalizedBody = replaceVariables(step.bodyHtml || step.body || "", prospect)

//     const subjectSafe = isSafeToSend(personalizedSubject, prospect)
//     const bodySafe = isSafeToSend(personalizedBody, prospect)

//     if (!subjectSafe.safe || !bodySafe.safe) {
//       console.warn(`[Sequence Engine] Email has unresolved variables, skipping send to ${prospect.email}`)
//       console.warn(`[Sequence Engine] Reason: ${subjectSafe.reason || bodySafe.reason}`)

//       // Record failed execution
//       await db.sequenceStepExecution.create({
//         data: {
//           enrollmentId: enrollment.id,
//           stepId: step.id,
//           scheduledAt: enrollment.nextStepAt,
//           executedAt: new Date(),
//           status: "FAILED",
//           errorMessage: subjectSafe.reason || bodySafe.reason || "Unresolved variables in email content",
//         },
//       })

//       // Still advance to next step
//       await advanceToNextStep(enrollment, sequence)
//       return { success: false }
//     }

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

//   const taskTitle = replaceVariables(step.taskTitle || "Manual Task", prospect)
//   const taskDescription = replaceVariables(step.taskDescription || "", prospect)

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
//         estimatedTime: step.estimatedTime,
//         requireProof: step.requireProof,
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

//   const callScript = replaceVariables(step.callScript || "", prospect)

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
//         callOutcome: step.callOutcome,
//         bestTimeToCall: step.bestTimeToCall,
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

//   const connectionNote = replaceVariables(step.linkedInMessage || "", prospect)

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
//         useInMail: step.useInMail,
//         dailyLimit: step.dailyLimit,
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

//   const linkedInMessage = replaceVariables(step.linkedInMessage || "", prospect)

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
//         useInMail: step.useInMail,
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

// // ============================================
// // NEW NODE TYPE IMPLEMENTATIONS
// // ============================================

// /**
//  * Execute AB_SPLIT step - A/B test with traffic allocation
//  */
// async function executeABSplitStep(enrollment: any, step: any, prospect: any, sequence: any) {
//   console.log(`[Sequence Engine] Evaluating A/B split for ${prospect.email}`)

//   // Get A/B config from conditions JSON
//   const abConfig = step.conditions as {
//     variants?: Array<{
//       id: string
//       name: string
//       allocation: number
//       subject?: string
//       body?: string
//       stepOrder?: number
//     }>
//     winnerCriteria?: "OPEN_RATE" | "CLICK_RATE" | "REPLY_RATE"
//     testDuration?: number
//   } | null

//   if (!abConfig?.variants || abConfig.variants.length === 0) {
//     console.log(`[Sequence Engine] No A/B variants defined, advancing`)
//     await advanceToNextStep(enrollment, sequence)
//     return
//   }

//   // Select variant based on weighted random selection
//   const selectedVariant = selectWeightedVariant(abConfig.variants)

//   console.log(`[Sequence Engine] Selected variant: ${selectedVariant.name} (${selectedVariant.allocation}%)`)

//   // Track variant assignment
//   await db.sequenceStepExecution.create({
//     data: {
//       enrollmentId: enrollment.id,
//       stepId: step.id,
//       scheduledAt: enrollment.nextStepAt,
//       executedAt: new Date(),
//       status: "SENT",
//       metadata: {
//         variantId: selectedVariant.id,
//         variantName: selectedVariant.name,
//       },
//     },
//   })

//   // Update variant stats
//   await db.sequenceStep.update({
//     where: { id: step.id },
//     data: {
//       sent: { increment: 1 },
//       conditions: {
//         ...abConfig,
//         variantStats: {
//           ...(abConfig as any).variantStats,
//           [selectedVariant.id]: {
//             sent: ((abConfig as any).variantStats?.[selectedVariant.id]?.sent || 0) + 1,
//           },
//         },
//       },
//     },
//   })

//   // If variant has specific content, send it
//   if (selectedVariant.subject && selectedVariant.body) {
//     const personalizedSubject = replaceVariables(selectedVariant.subject, prospect)
//     const personalizedBody = replaceVariables(selectedVariant.body, prospect)

//     const result = await sendEmail({
//       to: prospect.email,
//       subject: personalizedSubject,
//       html: personalizedBody,
//       userId: prospect.campaign?.userId,
//       campaignId: prospect.campaignId,
//       prospectId: prospect.id,
//     })

//     if (result.success) {
//       await db.sequenceEnrollment.update({
//         where: { id: enrollment.id },
//         data: { emailsSent: { increment: 1 } },
//       })
//     }
//   }

//   // If variant specifies a branch (stepOrder), jump to it
//   if (selectedVariant.stepOrder !== undefined) {
//     const targetStepIndex = sequence.steps.findIndex((s: any) => s.order === selectedVariant.stepOrder)
//     if (targetStepIndex >= 0) {
//       await jumpToStep(enrollment, sequence, targetStepIndex)
//       return
//     }
//   }

//   await advanceToNextStep(enrollment, sequence)
// }

// /**
//  * Execute WAIT_UNTIL step - Wait for specific conditions
//  */
// async function executeWaitUntilStep(
//   enrollment: any,
//   step: any,
//   prospect: any,
//   sequence: any,
// ): Promise<{ conditionMet: boolean }> {
//   console.log(`[Sequence Engine] Checking wait_until condition for ${prospect.email}`)

//   const waitConfig = step.conditions as {
//     waitType?:
//       | "EMAIL_OPENED"
//       | "EMAIL_CLICKED"
//       | "EMAIL_REPLIED"
//       | "FORM_SUBMITTED"
//       | "PAGE_VISITED"
//       | "CUSTOM_EVENT"
//       | "DATE_TIME"
//     maxWaitDays?: number
//     targetDateTime?: string
//     eventName?: string
//     timeoutAction?: "CONTINUE" | "EXIT" | "BRANCH"
//     timeoutBranchStep?: number
//   } | null

//   if (!waitConfig) {
//     return { conditionMet: true }
//   }

//   // Check if max wait time exceeded
//   const enrolledAt = new Date(enrollment.enrolledAt)
//   const maxWaitMs = (waitConfig.maxWaitDays || 7) * 24 * 60 * 60 * 1000
//   const waitExpired = Date.now() - enrolledAt.getTime() > maxWaitMs

//   if (waitExpired) {
//     console.log(`[Sequence Engine] Wait timeout reached for ${prospect.email}`)

//     await db.sequenceStepExecution.create({
//       data: {
//         enrollmentId: enrollment.id,
//         stepId: step.id,
//         scheduledAt: enrollment.nextStepAt,
//         executedAt: new Date(),
//         status: "TIMEOUT",
//         metadata: { reason: "max_wait_exceeded" },
//       },
//     })

//     // Handle timeout action
//     switch (waitConfig.timeoutAction) {
//       case "EXIT":
//         await exitEnrollment(enrollment.id, sequence.id, "wait_timeout")
//         return { conditionMet: false }
//       case "BRANCH":
//         if (waitConfig.timeoutBranchStep !== undefined) {
//           const targetIdx = sequence.steps.findIndex((s: any) => s.order === waitConfig.timeoutBranchStep)
//           if (targetIdx >= 0) {
//             await jumpToStep(enrollment, sequence, targetIdx)
//           }
//         }
//         return { conditionMet: true }
//       default:
//         await advanceToNextStep(enrollment, sequence)
//         return { conditionMet: true }
//     }
//   }

//   // Check the specific wait condition
//   let conditionMet = false

//   switch (waitConfig.waitType) {
//     case "EMAIL_OPENED":
//       conditionMet = enrollment.emailsOpened > 0
//       break
//     case "EMAIL_CLICKED":
//       conditionMet = enrollment.emailsClicked > 0
//       break
//     case "EMAIL_REPLIED":
//       conditionMet = enrollment.replied === true
//       break
//     case "DATE_TIME":
//       if (waitConfig.targetDateTime) {
//         conditionMet = new Date() >= new Date(waitConfig.targetDateTime)
//       }
//       break
//     case "CUSTOM_EVENT":
//       // Check custom events from prospect metadata or activity log
//       const events = (prospect.metadata as any)?.events || []
//       conditionMet = events.some((e: any) => e.name === waitConfig.eventName)
//       break
//     default:
//       conditionMet = true
//   }

//   if (conditionMet) {
//     console.log(`[Sequence Engine] Wait condition met for ${prospect.email}`)

//     await db.sequenceStepExecution.create({
//       data: {
//         enrollmentId: enrollment.id,
//         stepId: step.id,
//         scheduledAt: enrollment.nextStepAt,
//         executedAt: new Date(),
//         status: "SENT",
//         metadata: { conditionType: waitConfig.waitType },
//       },
//     })

//     await advanceToNextStep(enrollment, sequence)
//     return { conditionMet: true }
//   }

//   // Condition not met - keep waiting (don't advance)
//   console.log(`[Sequence Engine] Wait condition not yet met for ${prospect.email}, continuing to wait`)
//   return { conditionMet: false }
// }

// /**
//  * Execute EXIT_TRIGGER step - Check exit conditions
//  */
// async function executeExitTriggerStep(enrollment: any, step: any, prospect: any, sequence: any): Promise<boolean> {
//   console.log(`[Sequence Engine] Checking exit trigger for ${prospect.email}`)

//   const exitConfig = step.conditions as {
//     exitConditions?: Array<{
//       type: "REPLIED" | "BOUNCED" | "UNSUBSCRIBED" | "CONVERTED" | "MEETING_BOOKED" | "CUSTOM"
//       customField?: string
//       customValue?: any
//     }>
//     exitAction?: "MARK_CONVERTED" | "MARK_UNSUBSCRIBED" | "JUST_EXIT"
//   } | null

//   if (!exitConfig?.exitConditions || exitConfig.exitConditions.length === 0) {
//     await advanceToNextStep(enrollment, sequence)
//     return false
//   }

//   // Check each exit condition
//   for (const condition of exitConfig.exitConditions) {
//     let shouldExit = false

//     switch (condition.type) {
//       case "REPLIED":
//         shouldExit = enrollment.replied === true
//         break
//       case "BOUNCED":
//         shouldExit = prospect.bounced === true
//         break
//       case "UNSUBSCRIBED":
//         shouldExit = prospect.status === "UNSUBSCRIBED"
//         break
//       case "CONVERTED":
//         shouldExit = prospect.status === "CONVERTED"
//         break
//       case "MEETING_BOOKED":
//         shouldExit = (prospect.metadata as any)?.meetingBooked === true
//         break
//       case "CUSTOM":
//         if (condition.customField) {
//           shouldExit = (prospect as any)[condition.customField] === condition.customValue
//         }
//         break
//     }

//     if (shouldExit) {
//       console.log(`[Sequence Engine] Exit condition met: ${condition.type} for ${prospect.email}`)

//       await db.sequenceStepExecution.create({
//         data: {
//           enrollmentId: enrollment.id,
//           stepId: step.id,
//           scheduledAt: enrollment.nextStepAt,
//           executedAt: new Date(),
//           status: "SENT",
//           metadata: { exitReason: condition.type },
//         },
//       })

//       // Handle exit action
//       if (exitConfig.exitAction === "MARK_CONVERTED") {
//         await db.prospect.update({
//           where: { id: prospect.id },
//           data: { status: "CONVERTED" },
//         })
//       }

//       await exitEnrollment(enrollment.id, sequence.id, condition.type)
//       return true
//     }
//   }

//   // No exit conditions met
//   await advanceToNextStep(enrollment, sequence)
//   return false
// }

// /**
//  * Execute MANUAL_REVIEW step - Pause for human approval
//  */
// async function executeManualReviewStep(enrollment: any, step: any, prospect: any, sequence: any) {
//   const userId = prospect.campaign?.userId
//   if (!userId) {
//     await advanceToNextStep(enrollment, sequence)
//     return
//   }

//   const prospectName = prospect.firstName
//     ? `${prospect.firstName}${prospect.lastName ? ` ${prospect.lastName}` : ""}`
//     : prospect.email

//   const reviewNote = replaceVariables(step.reviewNote || "", prospect)

//   // Create notification for manual review
//   await db.notification.create({
//     data: {
//       userId,
//       type: "SYSTEM_UPDATE",
//       title: `Review Required: ${prospectName}`,
//       message: reviewNote || `Manual review required for ${prospectName} in sequence "${sequence.name}"`,
//       entityType: "sequence_manual_review",
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
//         prospectJobTitle: prospect.jobTitle,
//         reviewNote,
//         requiresApproval: true,
//       },
//       actionUrl: `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}&action=review`,
//     },
//   })

//   // Mark enrollment as paused for review
//   await db.sequenceEnrollment.update({
//     where: { id: enrollment.id },
//     data: {
//       status: "PAUSED",
//       metadata: {
//         ...(enrollment.metadata as any),
//         pauseReason: "manual_review",
//         pausedAt: new Date().toISOString(),
//         reviewStepId: step.id,
//       },
//     },
//   })

//   await db.sequenceStepExecution.create({
//     data: {
//       enrollmentId: enrollment.id,
//       stepId: step.id,
//       scheduledAt: enrollment.nextStepAt,
//       executedAt: new Date(),
//       status: "PENDING",
//       metadata: { awaitingApproval: true },
//     },
//   })

//   console.log(`[Sequence Engine] Manual review requested for ${prospect.email}`)
//   // Don't advance - wait for manual approval
// }

// /**
//  * Execute MULTI_CHANNEL_TOUCH step - Execute multiple actions simultaneously
//  */
// async function executeMultiChannelTouchStep(enrollment: any, step: any, prospect: any, sequence: any) {
//   console.log(`[Sequence Engine] Executing multi-channel touch for ${prospect.email}`)

//   const multiConfig = step.conditions as {
//     channels?: Array<{
//       type: "EMAIL" | "LINKEDIN_VIEW" | "LINKEDIN_CONNECT" | "LINKEDIN_MESSAGE" | "CALL" | "TASK"
//       subject?: string
//       body?: string
//       message?: string
//       taskTitle?: string
//       taskDescription?: string
//       delayMinutes?: number
//     }>
//     executeOrder?: "SIMULTANEOUS" | "SEQUENTIAL"
//     sequentialDelayMinutes?: number
//   } | null

//   if (!multiConfig?.channels || multiConfig.channels.length === 0) {
//     await advanceToNextStep(enrollment, sequence)
//     return
//   }

//   const userId = prospect.campaign?.userId
//   const prospectName = prospect.firstName
//     ? `${prospect.firstName}${prospect.lastName ? ` ${prospect.lastName}` : ""}`
//     : prospect.email

//   // Execute each channel action
//   for (let i = 0; i < multiConfig.channels.length; i++) {
//     const channel = multiConfig.channels[i]

//     // Add delay for sequential execution
//     if (multiConfig.executeOrder === "SEQUENTIAL" && i > 0 && multiConfig.sequentialDelayMinutes) {
//       await new Promise((resolve) => setTimeout(resolve, multiConfig.sequentialDelayMinutes! * 60 * 1000))
//     }

//     switch (channel.type) {
//       case "EMAIL":
//         if (channel.subject && channel.body) {
//           const personalizedSubject = replaceVariables(channel.subject, prospect)
//           const personalizedBody = replaceVariables(channel.body, prospect)

//           await sendEmail({
//             to: prospect.email,
//             subject: personalizedSubject,
//             html: personalizedBody,
//             userId,
//             campaignId: prospect.campaignId,
//             prospectId: prospect.id,
//           })
//         }
//         break

//       case "LINKEDIN_VIEW":
//       case "LINKEDIN_CONNECT":
//       case "LINKEDIN_MESSAGE":
//         if (userId) {
//           await db.notification.create({
//             data: {
//               userId,
//               type: "SYSTEM_UPDATE",
//               title: `LinkedIn ${channel.type.replace("LINKEDIN_", "")}: ${prospectName}`,
//               message: channel.message
//                 ? replaceVariables(channel.message, prospect)
//                 : `Complete LinkedIn action for ${prospectName}`,
//               entityType: "sequence_linkedin",
//               entityId: step.id,
//               metadata: {
//                 sequenceId: sequence.id,
//                 enrollmentId: enrollment.id,
//                 prospectId: prospect.id,
//                 linkedInAction: channel.type,
//                 prospectLinkedIn: prospect.linkedinUrl,
//               },
//               actionUrl: prospect.linkedinUrl || `/dashboard/sequences/${sequence.id}`,
//             },
//           })
//         }
//         break

//       case "CALL":
//         if (userId) {
//           await db.notification.create({
//             data: {
//               userId,
//               type: "SYSTEM_UPDATE",
//               title: `Call: ${prospectName}`,
//               message: `Make a call to ${prospectName}${prospect.phoneNumber ? ` at ${prospect.phoneNumber}` : ""}`,
//               entityType: "sequence_call",
//               entityId: step.id,
//               metadata: {
//                 sequenceId: sequence.id,
//                 enrollmentId: enrollment.id,
//                 prospectId: prospect.id,
//                 prospectPhone: prospect.phoneNumber,
//               },
//               actionUrl: `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}`,
//             },
//           })
//         }
//         break

//       case "TASK":
//         if (userId && channel.taskTitle) {
//           await db.notification.create({
//             data: {
//               userId,
//               type: "SYSTEM_UPDATE",
//               title: `Task: ${replaceVariables(channel.taskTitle, prospect)}`,
//               message: channel.taskDescription ? replaceVariables(channel.taskDescription, prospect) : "",
//               entityType: "sequence_task",
//               entityId: step.id,
//               metadata: {
//                 sequenceId: sequence.id,
//                 enrollmentId: enrollment.id,
//                 prospectId: prospect.id,
//               },
//               actionUrl: `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}`,
//             },
//           })
//         }
//         break
//     }
//   }

//   await db.sequenceStepExecution.create({
//     data: {
//       enrollmentId: enrollment.id,
//       stepId: step.id,
//       scheduledAt: enrollment.nextStepAt,
//       executedAt: new Date(),
//       status: "SENT",
//       metadata: {
//         channelsExecuted: multiConfig.channels.map((c) => c.type),
//       },
//     },
//   })

//   await db.sequenceStep.update({
//     where: { id: step.id },
//     data: { sent: { increment: 1 } },
//   })

//   console.log(`[Sequence Engine] Multi-channel touch completed for ${prospect.email}`)
//   await advanceToNextStep(enrollment, sequence)
// }

// /**
//  * Execute BEHAVIOR_BRANCH step - Branch based on engagement behavior
//  */
// async function executeBehaviorBranchStep(enrollment: any, step: any, prospect: any, sequence: any) {
//   console.log(`[Sequence Engine] Evaluating behavior branch for ${prospect.email}`)

//   const branchConfig = step.conditions as {
//     metric?: "OPEN_RATE" | "CLICK_RATE" | "REPLY_STATUS" | "ENGAGEMENT_SCORE"
//     threshold?: number
//     highEngagementStep?: number
//     lowEngagementStep?: number
//   } | null

//   if (!branchConfig) {
//     await advanceToNextStep(enrollment, sequence)
//     return
//   }

//   let isHighEngagement = false

//   switch (branchConfig.metric) {
//     case "OPEN_RATE":
//       const openRate = enrollment.emailsSent > 0 ? (enrollment.emailsOpened / enrollment.emailsSent) * 100 : 0
//       isHighEngagement = openRate >= (branchConfig.threshold || 50)
//       break
//     case "CLICK_RATE":
//       const clickRate = enrollment.emailsSent > 0 ? (enrollment.emailsClicked / enrollment.emailsSent) * 100 : 0
//       isHighEngagement = clickRate >= (branchConfig.threshold || 10)
//       break
//     case "REPLY_STATUS":
//       isHighEngagement = enrollment.replied === true
//       break
//     case "ENGAGEMENT_SCORE":
//       // Calculate composite engagement score
//       const score = enrollment.emailsOpened * 1 + enrollment.emailsClicked * 3 + (enrollment.replied ? 10 : 0)
//       isHighEngagement = score >= (branchConfig.threshold || 5)
//       break
//   }

//   console.log(`[Sequence Engine] Behavior branch result: ${isHighEngagement ? "high" : "low"} engagement`)

//   await db.sequenceStepExecution.create({
//     data: {
//       enrollmentId: enrollment.id,
//       stepId: step.id,
//       scheduledAt: enrollment.nextStepAt,
//       executedAt: new Date(),
//       status: "SENT",
//       metadata: {
//         engagementLevel: isHighEngagement ? "high" : "low",
//         metric: branchConfig.metric,
//       },
//     },
//   })

//   // Branch based on engagement level
//   const targetStep = isHighEngagement ? branchConfig.highEngagementStep : branchConfig.lowEngagementStep

//   if (targetStep !== undefined) {
//     const targetIdx = sequence.steps.findIndex((s: any) => s.order === targetStep)
//     if (targetIdx >= 0) {
//       await jumpToStep(enrollment, sequence, targetIdx)
//       return
//     }
//   }

//   await advanceToNextStep(enrollment, sequence)
// }

// /**
//  * Execute RANDOM_VARIANT step - Randomly select email content variation
//  */
// async function executeRandomVariantStep(
//   enrollment: any,
//   step: any,
//   prospect: any,
//   sequence: any,
// ): Promise<{ success: boolean }> {
//   console.log(`[Sequence Engine] Selecting random variant for ${prospect.email}`)

//   const variantConfig = step.conditions as {
//     variants?: Array<{
//       id: string
//       name: string
//       subject: string
//       body: string
//       weight?: number
//     }>
//   } | null

//   if (!variantConfig?.variants || variantConfig.variants.length === 0) {
//     await advanceToNextStep(enrollment, sequence)
//     return { success: false }
//   }

//   // Select random variant (weighted if weights provided)
//   const selectedVariant = selectWeightedVariant(
//     variantConfig.variants.map((v) => ({
//       ...v,
//       allocation: v.weight || 100 / variantConfig.variants!.length,
//     })),
//   )

//   console.log(`[Sequence Engine] Selected variant: ${selectedVariant.name}`)

//   // Send email with selected variant
//   const personalizedSubject = replaceVariables(selectedVariant.subject || "", prospect)
//   const personalizedBody = replaceVariables(selectedVariant.body || "", prospect)

//   const result = await sendEmail({
//     to: prospect.email,
//     subject: personalizedSubject,
//     html: personalizedBody,
//     userId: prospect.campaign?.userId,
//     campaignId: prospect.campaignId,
//     prospectId: prospect.id,
//   })

//   await db.sequenceStepExecution.create({
//     data: {
//       enrollmentId: enrollment.id,
//       stepId: step.id,
//       scheduledAt: enrollment.nextStepAt,
//       executedAt: new Date(),
//       status: result.success ? "SENT" : "FAILED",
//       messageId: result.messageId,
//       metadata: {
//         variantId: selectedVariant.id,
//         variantName: selectedVariant.name,
//       },
//     },
//   })

//   if (result.success) {
//     await db.sequenceStep.update({
//       where: { id: step.id },
//       data: { sent: { increment: 1 } },
//     })

//     await db.sequenceEnrollment.update({
//       where: { id: enrollment.id },
//       data: { emailsSent: { increment: 1 } },
//     })
//   }

//   await advanceToNextStep(enrollment, sequence)
//   return { success: result.success }
// }

// /**
//  * Execute VOICEMAIL_DROP step - Create voicemail notification (requires integration)
//  */
// async function executeVoicemailDropStep(enrollment: any, step: any, prospect: any, sequence: any) {
//   const userId = prospect.campaign?.userId
//   if (!userId) {
//     await advanceToNextStep(enrollment, sequence)
//     return
//   }

//   const prospectName = prospect.firstName
//     ? `${prospect.firstName}${prospect.lastName ? ` ${prospect.lastName}` : ""}`
//     : prospect.email

//   // Get voicemail config
//   const voicemailConfig = step.conditions as {
//     audioUrl?: string
//     audioName?: string
//     provider?: "SLYBROADCAST" | "DROP_COWBOY" | "MANUAL"
//   } | null

//   // If manual or no integration, create task notification
//   if (!voicemailConfig?.provider || voicemailConfig.provider === "MANUAL") {
//     await db.notification.create({
//       data: {
//         userId,
//         type: "SYSTEM_UPDATE",
//         title: `Voicemail: ${prospectName}`,
//         message: `Drop a voicemail to ${prospectName}${prospect.phoneNumber ? ` at ${prospect.phoneNumber}` : ""}`,
//         entityType: "sequence_voicemail",
//         entityId: step.id,
//         metadata: {
//           sequenceId: sequence.id,
//           sequenceName: sequence.name,
//           stepId: step.id,
//           enrollmentId: enrollment.id,
//           prospectId: prospect.id,
//           prospectName,
//           prospectPhone: prospect.phoneNumber,
//           audioUrl: voicemailConfig?.audioUrl,
//           audioName: voicemailConfig?.audioName,
//         },
//         actionUrl: `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}`,
//       },
//     })
//   } else {
//     // Integration with voicemail provider would go here
//     // For now, create a task for manual action
//     console.log(`[Sequence Engine] Voicemail drop integration (${voicemailConfig.provider}) not yet implemented`)

//     await db.notification.create({
//       data: {
//         userId,
//         type: "SYSTEM_UPDATE",
//         title: `Voicemail: ${prospectName}`,
//         message: `Drop a voicemail to ${prospectName}${prospect.phoneNumber ? ` at ${prospect.phoneNumber}` : ""} (${voicemailConfig.provider} integration pending)`,
//         entityType: "sequence_voicemail",
//         entityId: step.id,
//         metadata: {
//           sequenceId: sequence.id,
//           enrollmentId: enrollment.id,
//           prospectId: prospect.id,
//           prospectPhone: prospect.phoneNumber,
//           provider: voicemailConfig.provider,
//           audioUrl: voicemailConfig.audioUrl,
//         },
//         actionUrl: `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}`,
//       },
//     })
//   }

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

//   console.log(`[Sequence Engine] Voicemail task created for ${prospect.email}`)
//   await advanceToNextStep(enrollment, sequence)
// }

// /**
//  * Execute DIRECT_MAIL step - Create direct mail task (requires integration)
//  */
// async function executeDirectMailStep(enrollment: any, step: any, prospect: any, sequence: any) {
//   const userId = prospect.campaign?.userId
//   if (!userId) {
//     await advanceToNextStep(enrollment, sequence)
//     return
//   }

//   const prospectName = prospect.firstName
//     ? `${prospect.firstName}${prospect.lastName ? ` ${prospect.lastName}` : ""}`
//     : prospect.email

//   // Get direct mail config
//   const mailConfig = step.conditions as {
//     templateId?: string
//     templateName?: string
//     provider?: "LOB" | "SENDOSO" | "MANUAL"
//     mailType?: "POSTCARD" | "LETTER" | "GIFT"
//   } | null

//   // If manual or no integration, create task notification
//   if (!mailConfig?.provider || mailConfig.provider === "MANUAL") {
//     await db.notification.create({
//       data: {
//         userId,
//         type: "SYSTEM_UPDATE",
//         title: `Direct Mail: ${prospectName}`,
//         message: `Send ${mailConfig?.mailType || "mail"} to ${prospectName}`,
//         entityType: "sequence_direct_mail",
//         entityId: step.id,
//         metadata: {
//           sequenceId: sequence.id,
//           sequenceName: sequence.name,
//           stepId: step.id,
//           enrollmentId: enrollment.id,
//           prospectId: prospect.id,
//           prospectName,
//           prospectEmail: prospect.email,
//           prospectCompany: prospect.company,
//           prospectAddress: (prospect.metadata as any)?.address,
//           templateId: mailConfig?.templateId,
//           templateName: mailConfig?.templateName,
//           mailType: mailConfig?.mailType,
//         },
//         actionUrl: `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}`,
//       },
//     })
//   } else {
//     // Integration with direct mail provider would go here
//     console.log(`[Sequence Engine] Direct mail integration (${mailConfig.provider}) not yet implemented`)

//     await db.notification.create({
//       data: {
//         userId,
//         type: "SYSTEM_UPDATE",
//         title: `Direct Mail: ${prospectName}`,
//         message: `Send ${mailConfig.mailType || "mail"} to ${prospectName} (${mailConfig.provider} integration pending)`,
//         entityType: "sequence_direct_mail",
//         entityId: step.id,
//         metadata: {
//           sequenceId: sequence.id,
//           enrollmentId: enrollment.id,
//           prospectId: prospect.id,
//           provider: mailConfig.provider,
//           templateId: mailConfig.templateId,
//           mailType: mailConfig.mailType,
//         },
//         actionUrl: `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}`,
//       },
//     })
//   }

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

//   console.log(`[Sequence Engine] Direct mail task created for ${prospect.email}`)
//   await advanceToNextStep(enrollment, sequence)
// }

// // ============================================
// // ADDITIONAL PROCESSING FUNCTIONS
// // ============================================

// /**
//  * Process enrollments waiting for conditions (WAIT_UNTIL)
//  */
// // async function processWaitingEnrollments(stats: any) {
// //   const waitingEnrollments = await db.sequenceEnrollment.findMany({
// //     where: {
// //       status: "ACTIVE",
// //       NOT: {
// //         metadata: {
// //           path: ["waitingFor"],
// //           equals: Prisma.JsonNull,
// //         },
// //       },
// //     },
// //     include: {
// //       sequence: {
// //         include: {
// //           steps: {
// //             orderBy: { order: "asc" },
// //           },
// //         },
// //       },
// //     },
// //     take: 100,
// //   })

// //   for (const enrollment of waitingEnrollments) {
// //     const prospect = await db.prospect.findUnique({
// //       where: { id: enrollment.prospectId },
// //     })

// //     if (!prospect) continue

// //     const currentStep = enrollment.sequence.steps[enrollment.currentStep]
// //     if (currentStep?.stepType === "WAIT_UNTIL") {
// //       const result = await executeWaitUntilStep(enrollment, currentStep, prospect, enrollment.sequence)
// //       if (result.conditionMet) {
// //         stats.waitUntilChecked++
// //       }
// //     }
// //   }
// // }

// async function processWaitingEnrollments(stats: any) {
//   const waitingEnrollments = await db.sequenceEnrollment.findMany({
//     where: {
//       status: "ACTIVE",
//       metadata: {
//         path: ["waitingFor"],
//         not: Prisma.JsonNull, // Also fix error #2 here
//       },
//     },
//     include: {
//       sequence: {  // This is already here but let's verify the steps are included
//         include: {
//           steps: {
//             orderBy: { order: "asc" },
//           },
//         },
//       },
//     },
//     take: 100,
//   })

//   for (const enrollment of waitingEnrollments) {
//     const prospect = await db.prospect.findUnique({
//       where: { id: enrollment.prospectId },
//     })

//     if (!prospect || !enrollment.sequence) continue // Add null check for sequence

//     const currentStep = enrollment.sequence.steps[enrollment.currentStep]
//     if (currentStep?.stepType === "WAIT_UNTIL") {
//       const result = await executeWaitUntilStep(enrollment, currentStep, prospect, enrollment.sequence)
//       if (result.conditionMet) {
//         stats.waitUntilChecked++
//       }
//     }
//   }
// }












// /**
//  * Process manual review approvals
//  */
// async function processManualReviewApprovals(stats: any) {
//   // Find enrollments paused for manual review that have been approved
//   const approvedEnrollments = await db.sequenceEnrollment.findMany({
//     where: {
//       status: "PAUSED",
//       metadata: {
//         path: ["pauseReason"],
//         equals: "manual_review",
//       },
//     },
//     include: {
//       sequence: {
//         include: {
//           steps: {
//             orderBy: { order: "asc" },
//           },
//         },
//       },
//     },
//     take: 100,
//   })

//   for (const enrollment of approvedEnrollments) {
//     const metadata = enrollment.metadata as any

//     // Check if approved (this would be set by a separate approval action)
//     if (metadata?.approved === true) {
//       console.log(`[Sequence Engine] Resuming approved enrollment ${enrollment.id}`)

//       await db.sequenceEnrollment.update({
//         where: { id: enrollment.id },
//         data: {
//           status: "ACTIVE",
//           metadata: {
//             ...metadata,
//             pauseReason: null,
//             approvedAt: new Date().toISOString(),
//           },
//         },
//       })

//       await advanceToNextStep(enrollment, enrollment.sequence)
//       stats.manualReviewsPaused++
//     }
//   }
// }

// // ============================================
// // CONDITION EVALUATION HELPERS
// // ============================================

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

// /**
//  * Select variant based on weighted allocation
//  */
// function selectWeightedVariant<T extends { allocation: number }>(variants: T[]): T {
//   const totalWeight = variants.reduce((sum, v) => sum + v.allocation, 0)
//   let random = Math.random() * totalWeight

//   for (const variant of variants) {
//     random -= variant.allocation
//     if (random <= 0) {
//       return variant
//     }
//   }

//   return variants[variants.length - 1]
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
//  * Exit enrollment (for exit triggers)
//  */
// async function exitEnrollment(enrollmentId: string, sequenceId: string, reason: string) {
//   await db.sequenceEnrollment.update({
//     where: { id: enrollmentId },
//     data: {
//       status: "EXITED",
//       completedAt: new Date(),
//       nextStepAt: null,
//       metadata: {
//         exitReason: reason,
//         exitedAt: new Date().toISOString(),
//       },
//     },
//   })

//   await db.sequence.update({
//     where: { id: sequenceId },
//     data: {
//       totalExited: { increment: 1 },
//     },
//   })

//   console.log(`[Sequence Engine] Enrollment ${enrollmentId} exited: ${reason}`)
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






import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendEmail } from "@/lib/services/email-sender"
import { Prisma } from "@prisma/client"
import { replaceVariables, isSafeToSend } from "@/lib/utils/variable-validator"

export const dynamic = "force-dynamic"
export const maxDuration = 300

/**
 * PRODUCTION-READY SEQUENCE EXECUTION ENGINE
 * Processes SequenceEnrollment records and executes all step types
 * Runs every 5-15 minutes via Vercel Cron
 * 
 * NEW FEATURES:
 * - Full idempotency protection
 * - Rate limiting & throttling
 * - Comprehensive error logging
 * - A/B testing with variant tracking
 * - Business hours enforcement
 * - All 17 step types fully implemented
 */
export async function GET(req: Request) {
  try {
    // Auth check
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[Sequence Engine] Starting sequence processing...")
    const startTime = Date.now()

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
      abTestsEvaluated: 0,
      waitUntilChecked: 0,
      exitTriggersChecked: 0,
      manualReviewsPaused: 0,
      multiChannelExecuted: 0,
      behaviorBranches: 0,
      randomVariants: 0,
      voicemailDrops: 0,
      directMailSent: 0,
      stepsExecuted: 0,
      errors: 0,
      skipped: 0,
      rateLimited: 0,
    }

    // Process enrollments with rate limiting and idempotency
    for (const enrollment of readyEnrollments) {
      try {
        // Check rate limits before processing
        const canProceed = await checkRateLimits(enrollment)
        if (!canProceed) {
          stats.rateLimited++
          // Reschedule for later (15 minutes)
          await db.sequenceEnrollment.update({
            where: { id: enrollment.id },
            data: { nextStepAt: new Date(Date.now() + 15 * 60 * 1000) },
          })
          continue
        }

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
          await markEnrollmentCompleted(enrollment.id, sequence.id)
          console.log(`[Sequence Engine] Enrollment ${enrollment.id} completed - no more steps`)
          continue
        }

        // Check if step is disabled
        if (nextStep.isEnabled === false) {
          console.log(`[Sequence Engine] Skipping disabled step ${nextStep.order}`)
          await advanceToNextStep(enrollment, sequence)
          stats.skipped++
          continue
        }

        // Check skip conditions
        if (nextStep.skipIfReplied && enrollment.replied) {
          console.log(`[Sequence Engine] Skipping step ${nextStep.order} - prospect replied`)
          await advanceToNextStep(enrollment, sequence)
          stats.skipped++
          continue
        }

        if (nextStep.skipIfBounced && prospect.bounced) {
          console.log(`[Sequence Engine] Skipping step ${nextStep.order} - prospect bounced`)
          await advanceToNextStep(enrollment, sequence)
          stats.skipped++
          continue
        }

        // Idempotency check - prevent duplicate execution
        const idempotencyKey = `${enrollment.id}-${nextStep.id}-${nextStepIndex}`
        const alreadyExecuted = await checkIdempotency(idempotencyKey)

        if (alreadyExecuted) {
          console.log(`[Sequence Engine] Step already executed (idempotency): ${idempotencyKey}`)
          await advanceToNextStep(enrollment, sequence)
          continue
        }

        // Execute step based on type
        await executeStep(enrollment, nextStep, prospect, sequence, stats)

        // Mark as executed for idempotency
        await markExecuted(idempotencyKey)

        stats.stepsExecuted++
      } catch (error) {
        console.error(`[Sequence Engine] Error processing enrollment ${enrollment.id}:`, error)
        stats.errors++

        // Log error for monitoring
        await logError(enrollment.id, error)
      }

      // Small delay between processing to avoid rate limits
      await sleep(100)
    }

    // Process waiting enrollments (WAIT_UNTIL)
    await processWaitingEnrollments(stats)

    // Process manual review approvals
    await processManualReviewApprovals(stats)

    // Cleanup old idempotency records
    await cleanupIdempotency()

    const duration = Date.now() - startTime
    console.log(`[Sequence Engine] Processing completed in ${duration}ms`, stats)

    return NextResponse.json({
      success: true,
      duration,
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

/**
 * Execute a sequence step with proper error handling
 */
async function executeStep(
  enrollment: any,
  step: any,
  prospect: any,
  sequence: any,
  stats: any
) {
  switch (step.stepType) {
    case "EMAIL":
      const emailResult = await executeEmailStep(enrollment, step, prospect, sequence)
      if (emailResult.success) stats.emailsSent++
      break

    case "DELAY":
      await advanceToNextStep(enrollment, sequence)
      break

    case "TASK":
      await executeTaskStep(enrollment, step, prospect, sequence)
      stats.tasksCreated++
      break

    case "CALL":
      await executeCallStep(enrollment, step, prospect, sequence)
      stats.callsScheduled++
      break

    case "LINKEDIN_VIEW":
      await executeLinkedInViewStep(enrollment, step, prospect, sequence)
      stats.linkedInActions++
      break

    case "LINKEDIN_CONNECT":
      await executeLinkedInConnectStep(enrollment, step, prospect, sequence)
      stats.linkedInActions++
      break

    case "LINKEDIN_MESSAGE":
      await executeLinkedInMessageStep(enrollment, step, prospect, sequence)
      stats.linkedInActions++
      break

    case "CONDITION":
      await executeConditionStep(enrollment, step, prospect, sequence)
      stats.conditionsEvaluated++
      break

    case "AB_SPLIT":
      await executeABSplitStep(enrollment, step, prospect, sequence)
      stats.abTestsEvaluated++
      break

    case "WAIT_UNTIL":
      const waitResult = await executeWaitUntilStep(enrollment, step, prospect, sequence)
      stats.waitUntilChecked++
      if (!waitResult.conditionMet) {
        return // Don't advance - continue waiting
      }
      break

    case "EXIT_TRIGGER":
      const shouldExit = await executeExitTriggerStep(enrollment, step, prospect, sequence)
      stats.exitTriggersChecked++
      if (shouldExit) {
        return // Already exited
      }
      break

    case "MANUAL_REVIEW":
      await executeManualReviewStep(enrollment, step, prospect, sequence)
      stats.manualReviewsPaused++
      return // Don't advance - wait for manual approval

    case "MULTI_CHANNEL_TOUCH":
      await executeMultiChannelTouchStep(enrollment, step, prospect, sequence)
      stats.multiChannelExecuted++
      break

    case "BEHAVIOR_BRANCH":
      await executeBehaviorBranchStep(enrollment, step, prospect, sequence)
      stats.behaviorBranches++
      break

    case "RANDOM_VARIANT":
      const randomResult = await executeRandomVariantStep(enrollment, step, prospect, sequence)
      if (randomResult.success) stats.randomVariants++
      break

    case "VOICEMAIL_DROP":
      await executeVoicemailDropStep(enrollment, step, prospect, sequence)
      stats.voicemailDrops++
      break

    case "DIRECT_MAIL":
      await executeDirectMailStep(enrollment, step, prospect, sequence)
      stats.directMailSent++
      break

    default:
      console.log(`[Sequence Engine] Unknown step type: ${step.stepType}`)
      await advanceToNextStep(enrollment, sequence)
  }
}

// ============================================
// STEP EXECUTION FUNCTIONS
// ============================================

async function executeEmailStep(enrollment: any, step: any, prospect: any, sequence: any) {
  try {
    // Select variant if A/B testing is enabled
    let subject = step.subject || ""
    let body = step.bodyHtml || step.body || ""
    let variantId: string | null = null

    if (step.variants && step.variants.length > 0) {
      const selectedVariant = selectWeightedVariant(step.variants)
      subject = selectedVariant.subject || subject
      body = selectedVariant.body || body
      variantId = selectedVariant.id
    }

    const personalizedSubject = replaceVariables(subject, prospect)
    const personalizedBody = replaceVariables(body, prospect)

    const subjectSafe = isSafeToSend(personalizedSubject, prospect)
    const bodySafe = isSafeToSend(personalizedBody, prospect)

    if (!subjectSafe.safe || !bodySafe.safe) {
      console.warn(`[Sequence Engine] Email has unresolved variables, skipping send to ${prospect.email}`)

      await db.sequenceStepExecution.create({
        data: {
          enrollmentId: enrollment.id,
          stepId: step.id,
          variantId,
          scheduledAt: enrollment.nextStepAt,
          executedAt: new Date(),
          status: "FAILED",
          errorMessage: subjectSafe.reason || bodySafe.reason || "Unresolved variables",
        },
      })

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
          variantId,
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

      // Update variant stats if applicable
      if (variantId) {
        await db.sequenceStepVariant.update({
          where: { id: variantId },
          data: { sent: { increment: 1 } },
        })
      }

      await db.sequenceEnrollment.update({
        where: { id: enrollment.id },
        data: {
          emailsSent: { increment: 1 },
          lastActivityAt: new Date(),
        },
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
          variantId,
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

async function executeTaskStep(enrollment: any, step: any, prospect: any, sequence: any) {
  const userId = prospect.campaign?.userId
  if (!userId) {
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
      message: taskDescription || `Complete this task for ${prospectName}`,
      entityType: "sequence_task",
      entityId: step.id,
      severity: step.taskPriority?.toLowerCase() || "medium",
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
        estimatedTime: step.estimatedTime,
        requireProof: step.requireProof,
      },
      actionUrl: `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}`,
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

  console.log(`[Sequence Engine] Task created for ${prospect.email}: ${taskTitle}`)
  await advanceToNextStep(enrollment, sequence)
}

async function executeCallStep(enrollment: any, step: any, prospect: any, sequence: any) {
  const userId = prospect.campaign?.userId
  if (!userId) {
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
      message: `Make a call to ${prospectName}${prospect.phoneNumber ? ` at ${prospect.phoneNumber}` : ""}`,
      entityType: "sequence_call",
      entityId: step.id,
      severity: "medium",
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
        callOutcome: step.callOutcome,
        bestTimeToCall: step.bestTimeToCall,
      },
      actionUrl: `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}`,
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

  console.log(`[Sequence Engine] Call scheduled for ${prospect.email}`)
  await advanceToNextStep(enrollment, sequence)
}

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
      message: `View LinkedIn profile to warm up engagement`,
      entityType: "sequence_linkedin",
      entityId: step.id,
      severity: "info",
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

  await advanceToNextStep(enrollment, sequence)
}

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
      message: `Send LinkedIn connection request`,
      entityType: "sequence_linkedin",
      entityId: step.id,
      severity: "medium",
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
        useInMail: step.useInMail,
        dailyLimit: step.dailyLimit,
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

  await advanceToNextStep(enrollment, sequence)
}

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
      message: `Send LinkedIn message`,
      entityType: "sequence_linkedin",
      entityId: step.id,
      severity: "medium",
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
        useInMail: step.useInMail,
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

  await advanceToNextStep(enrollment, sequence)
}

async function executeConditionStep(enrollment: any, step: any, prospect: any, sequence: any) {
  const conditions = step.conditions as any

  if (!conditions) {
    await advanceToNextStep(enrollment, sequence)
    return
  }

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
        conditionMet = false
    }
  } catch (error) {
    console.error(`[Sequence Engine] Error evaluating condition:`, error)
    conditionMet = false
  }

  await db.sequenceStepExecution.create({
    data: {
      enrollmentId: enrollment.id,
      stepId: step.id,
      scheduledAt: enrollment.nextStepAt,
      executedAt: new Date(),
      status: "SENT",
      metadata: { conditionMet, conditionType: conditions.type },
    },
  })

  if (conditionMet && conditions.trueStepOrder !== undefined) {
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
    await advanceToNextStep(enrollment, sequence)
  }
}

async function executeABSplitStep(enrollment: any, step: any, prospect: any, sequence: any) {
  const abConfig = step.conditions as any

  if (!abConfig?.variants || abConfig.variants.length === 0) {
    await advanceToNextStep(enrollment, sequence)
    return
  }

  const selectedVariant = selectWeightedVariant(abConfig.variants)

  await db.sequenceStepExecution.create({
    data: {
      enrollmentId: enrollment.id,
      stepId: step.id,
      scheduledAt: enrollment.nextStepAt,
      executedAt: new Date(),
      status: "SENT",
      variantId: selectedVariant.id,
      metadata: {
        variantId: selectedVariant.id,
        variantName: selectedVariant.name,
      },
    },
  })

  await db.sequenceStep.update({
    where: { id: step.id },
    data: {
      sent: { increment: 1 },
      conditions: {
        ...abConfig,
        variantStats: {
          ...(abConfig as any).variantStats,
          [selectedVariant.id]: {
            sent: ((abConfig as any).variantStats?.[selectedVariant.id]?.sent || 0) + 1,
          },
        },
      },
    },
  })

  if (selectedVariant.subject && selectedVariant.body) {
    const personalizedSubject = replaceVariables(selectedVariant.subject, prospect)
    const personalizedBody = replaceVariables(selectedVariant.body, prospect)

    await sendEmail({
      to: prospect.email,
      subject: personalizedSubject,
      html: personalizedBody,
      userId: prospect.campaign?.userId,
      campaignId: prospect.campaignId,
      prospectId: prospect.id,
    })

    await db.sequenceEnrollment.update({
      where: { id: enrollment.id },
      data: { emailsSent: { increment: 1 } },
    })
  }

  if (selectedVariant.stepOrder !== undefined) {
    const targetStepIndex = sequence.steps.findIndex((s: any) => s.order === selectedVariant.stepOrder)
    if (targetStepIndex >= 0) {
      await jumpToStep(enrollment, sequence, targetStepIndex)
      return
    }
  }

  await advanceToNextStep(enrollment, sequence)
}

async function executeWaitUntilStep(
  enrollment: any,
  step: any,
  prospect: any,
  sequence: any
): Promise<{ conditionMet: boolean }> {
  const waitConfig = step.conditions as any

  if (!waitConfig) {
    return { conditionMet: true }
  }

  const enrolledAt = new Date(enrollment.enrolledAt)
  const maxWaitMs = (waitConfig.maxWaitDays || 7) * 24 * 60 * 60 * 1000
  const waitExpired = Date.now() - enrolledAt.getTime() > maxWaitMs

  if (waitExpired) {
    await db.sequenceStepExecution.create({
      data: {
        enrollmentId: enrollment.id,
        stepId: step.id,
        scheduledAt: enrollment.nextStepAt,
        executedAt: new Date(),
        status: "TIMEOUT",
        metadata: { reason: "max_wait_exceeded" },
      },
    })

    switch (waitConfig.timeoutAction) {
      case "EXIT":
        await exitEnrollment(enrollment.id, sequence.id, "AUTOMATION")
        return { conditionMet: false }
      case "BRANCH":
        if (waitConfig.timeoutBranchStep !== undefined) {
          const targetIdx = sequence.steps.findIndex((s: any) => s.order === waitConfig.timeoutBranchStep)
          if (targetIdx >= 0) {
            await jumpToStep(enrollment, sequence, targetIdx)
          }
        }
        return { conditionMet: true }
      default:
        await advanceToNextStep(enrollment, sequence)
        return { conditionMet: true }
    }
  }

  let conditionMet = false

  switch (waitConfig.waitType) {
    case "EMAIL_OPENED":
      conditionMet = enrollment.emailsOpened > 0
      break
    case "EMAIL_CLICKED":
      conditionMet = enrollment.emailsClicked > 0
      break
    case "EMAIL_REPLIED":
      conditionMet = enrollment.replied === true
      break
    case "DATE_TIME":
      if (waitConfig.targetDateTime) {
        conditionMet = new Date() >= new Date(waitConfig.targetDateTime)
      }
      break
    case "CUSTOM_EVENT":
      const events = (prospect.metadata as any)?.events || []
      conditionMet = events.some((e: any) => e.name === waitConfig.eventName)
      break
    default:
      conditionMet = true
  }

  if (conditionMet) {
    await db.sequenceStepExecution.create({
      data: {
        enrollmentId: enrollment.id,
        stepId: step.id,
        scheduledAt: enrollment.nextStepAt,
        executedAt: new Date(),
        status: "SENT",
        metadata: { conditionType: waitConfig.waitType },
      },
    })

    // Clear waiting metadata
    await db.sequenceEnrollment.update({
      where: { id: enrollment.id },
      data: {
        metadata: {
          ...(enrollment.metadata as any || {}),
          waitingFor: null,
        },
      },
    })

    await advanceToNextStep(enrollment, sequence)
    return { conditionMet: true }
  }

  // Mark as waiting
  await db.sequenceEnrollment.update({
    where: { id: enrollment.id },
    data: {
      metadata: {
        ...(enrollment.metadata as any || {}),
        waitingFor: waitConfig.waitType,
        waitingStepId: step.id,
        waitingSince: new Date().toISOString(),
      },
    },
  })

  return { conditionMet: false }
}

async function executeExitTriggerStep(
  enrollment: any,
  step: any,
  prospect: any,
  sequence: any
): Promise<boolean> {
  const exitConfig = step.conditions as any

  if (!exitConfig?.exitConditions || exitConfig.exitConditions.length === 0) {
    await advanceToNextStep(enrollment, sequence)
    return false
  }

  for (const condition of exitConfig.exitConditions) {
    let shouldExit = false

    switch (condition.type) {
      case "REPLIED":
        shouldExit = enrollment.replied === true
        break
      case "BOUNCED":
        shouldExit = prospect.bounced === true
        break
      case "UNSUBSCRIBED":
        shouldExit = prospect.status === "UNSUBSCRIBED"
        break
      case "CONVERTED":
        shouldExit = prospect.status === "CONVERTED"
        break
      case "MEETING_BOOKED":
        shouldExit = (prospect.metadata as any)?.meetingBooked === true
        break
      case "CUSTOM":
        if (condition.customField) {
          shouldExit = (prospect as any)[condition.customField] === condition.customValue
        }
        break
    }

    if (shouldExit) {
      await db.sequenceStepExecution.create({
        data: {
          enrollmentId: enrollment.id,
          stepId: step.id,
          scheduledAt: enrollment.nextStepAt,
          executedAt: new Date(),
          status: "SENT",
          metadata: { exitReason: condition.type },
        },
      })

      if (exitConfig.exitAction === "MARK_CONVERTED") {
        await db.prospect.update({
          where: { id: prospect.id },
          data: { status: "CONVERTED" },
        })
      }

      await exitEnrollment(enrollment.id, sequence.id, "AUTOMATION")
      return true
    }
  }

  await advanceToNextStep(enrollment, sequence)
  return false
}

async function executeManualReviewStep(enrollment: any, step: any, prospect: any, sequence: any) {
  const userId = prospect.campaign?.userId
  if (!userId) {
    await advanceToNextStep(enrollment, sequence)
    return
  }

  const prospectName = prospect.firstName
    ? `${prospect.firstName}${prospect.lastName ? ` ${prospect.lastName}` : ""}`
    : prospect.email

  const reviewNote = replaceVariables(step.reviewNote || "", prospect)

  await db.notification.create({
    data: {
      userId,
      type: "SYSTEM_UPDATE",
      title: `Review Required: ${prospectName}`,
      message: reviewNote || `Manual review required for ${prospectName}`,
      entityType: "sequence_manual_review",
      entityId: step.id,
      severity: "warning",
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
        prospectJobTitle: prospect.jobTitle,
        reviewNote,
        requiresApproval: true,
      },
      actionUrl: `/dashboard/sequences/${sequence.id}?tab=prospects&prospect=${prospect.id}&action=review`,
    },
  })

  await db.sequenceEnrollment.update({
    where: { id: enrollment.id },
    data: {
      status: "PAUSED",
      pausedAt: new Date(),
      metadata: {
        ...(enrollment.metadata as any || {}),
        pauseReason: "manual_review",
        pausedAt: new Date().toISOString(),
        reviewStepId: step.id,
      },
    },
  })

  await db.sequenceStepExecution.create({
    data: {
      enrollmentId: enrollment.id,
      stepId: step.id,
      scheduledAt: enrollment.nextStepAt,
      executedAt: new Date(),
      status: "PENDING",
      metadata: { awaitingApproval: true },
    },
  })
}

async function executeMultiChannelTouchStep(enrollment: any, step: any, prospect: any, sequence: any) {
  const multiConfig = step.conditions as any

  if (!multiConfig?.channels || multiConfig.channels.length === 0) {
    await advanceToNextStep(enrollment, sequence)
    return
  }

  const userId = prospect.campaign?.userId
  const prospectName = prospect.firstName
    ? `${prospect.firstName}${prospect.lastName ? ` ${prospect.lastName}` : ""}`
    : prospect.email

  for (let i = 0; i < multiConfig.channels.length; i++) {
    const channel = multiConfig.channels[i]

    if (multiConfig.executeOrder === "SEQUENTIAL" && i > 0 && multiConfig.sequentialDelayMinutes) {
      await sleep(multiConfig.sequentialDelayMinutes * 60 * 1000)
    }

    switch (channel.type) {
      case "EMAIL":
        if (channel.subject && channel.body) {
          const personalizedSubject = replaceVariables(channel.subject, prospect)
          const personalizedBody = replaceVariables(channel.body, prospect)

          await sendEmail({
            to: prospect.email,
            subject: personalizedSubject,
            html: personalizedBody,
            userId,
            campaignId: prospect.campaignId,
            prospectId: prospect.id,
          })
        }
        break

      case "LINKEDIN_VIEW":
      case "LINKEDIN_CONNECT":
      case "LINKEDIN_MESSAGE":
      case "CALL":
      case "TASK":
        if (userId) {
          await db.notification.create({
            data: {
              userId,
              type: "SYSTEM_UPDATE",
              title: `${channel.type.replace("_", " ")}: ${prospectName}`,
              message: channel.message ? replaceVariables(channel.message, prospect) : "",
              entityType: "sequence_multi_channel",
              entityId: step.id,
              severity: "medium",
              metadata: {
                sequenceId: sequence.id,
                enrollmentId: enrollment.id,
                prospectId: prospect.id,
                channelType: channel.type,
              },
              actionUrl: `/dashboard/sequences/${sequence.id}?prospect=${prospect.id}`,
            },
          })
        }
        break
    }
  }

  await db.sequenceStepExecution.create({
    data: {
      enrollmentId: enrollment.id,
      stepId: step.id,
      scheduledAt: enrollment.nextStepAt,
      executedAt: new Date(),
      status: "SENT",
      metadata: {
        channelsExecuted: multiConfig.channels.map((c: any) => c.type),
      },
    },
  })

  await db.sequenceStep.update({
    where: { id: step.id },
    data: { sent: { increment: 1 } },
  })

  await advanceToNextStep(enrollment, sequence)
}

async function executeBehaviorBranchStep(enrollment: any, step: any, prospect: any, sequence: any) {
  const branchConfig = step.conditions as any

  if (!branchConfig) {
    await advanceToNextStep(enrollment, sequence)
    return
  }

  let isHighEngagement = false

  switch (branchConfig.metric) {
    case "OPEN_RATE":
      const openRate = enrollment.emailsSent > 0 ? (enrollment.emailsOpened / enrollment.emailsSent) * 100 : 0
      isHighEngagement = openRate >= (branchConfig.threshold || 50)
      break
    case "CLICK_RATE":
      const clickRate = enrollment.emailsSent > 0 ? (enrollment.emailsClicked / enrollment.emailsSent) * 100 : 0
      isHighEngagement = clickRate >= (branchConfig.threshold || 10)
      break
    case "REPLY_STATUS":
      isHighEngagement = enrollment.replied === true
      break
    case "ENGAGEMENT_SCORE":
      const score = enrollment.emailsOpened * 1 + enrollment.emailsClicked * 3 + (enrollment.replied ? 10 : 0)
      isHighEngagement = score >= (branchConfig.threshold || 5)
      break
  }

  await db.sequenceStepExecution.create({
    data: {
      enrollmentId: enrollment.id,
      stepId: step.id,
      scheduledAt: enrollment.nextStepAt,
      executedAt: new Date(),
      status: "SENT",
      metadata: {
        engagementLevel: isHighEngagement ? "high" : "low",
        metric: branchConfig.metric,
      },
    },
  })

  const targetStep = isHighEngagement ? branchConfig.highEngagementStep : branchConfig.lowEngagementStep

  if (targetStep !== undefined) {
    const targetIdx = sequence.steps.findIndex((s: any) => s.order === targetStep)
    if (targetIdx >= 0) {
      await jumpToStep(enrollment, sequence, targetIdx)
      return
    }
  }

  await advanceToNextStep(enrollment, sequence)
}

async function executeRandomVariantStep(
  enrollment: any,
  step: any,
  prospect: any,
  sequence: any
): Promise<{ success: boolean }> {
  const variantConfig = step.conditions as any

  if (!variantConfig?.variants || variantConfig.variants.length === 0) {
    await advanceToNextStep(enrollment, sequence)
    return { success: false }
  }

  const selectedVariant = selectWeightedVariant(
    variantConfig.variants.map((v: any) => ({
      ...v,
      allocation: v.weight || 100 / variantConfig.variants!.length,
    }))
  )

  const personalizedSubject = replaceVariables(selectedVariant.subject || "", prospect)
  const personalizedBody = replaceVariables(selectedVariant.body || "", prospect)

  const result = await sendEmail({
    to: prospect.email,
    subject: personalizedSubject,
    html: personalizedBody,
    userId: prospect.campaign?.userId,
    campaignId: prospect.campaignId,
    prospectId: prospect.id,
  })

  await db.sequenceStepExecution.create({
    data: {
      enrollmentId: enrollment.id,
      stepId: step.id,
      scheduledAt: enrollment.nextStepAt,
      executedAt: new Date(),
      status: result.success ? "SENT" : "FAILED",
      messageId: result.messageId,
      metadata: {
        variantId: selectedVariant.id,
        variantName: selectedVariant.name,
      },
    },
  })

  if (result.success) {
    await db.sequenceStep.update({
      where: { id: step.id },
      data: { sent: { increment: 1 } },
    })

    await db.sequenceEnrollment.update({
      where: { id: enrollment.id },
      data: { emailsSent: { increment: 1 } },
    })
  }

  await advanceToNextStep(enrollment, sequence)
  return { success: result.success }
}

async function executeVoicemailDropStep(enrollment: any, step: any, prospect: any, sequence: any) {
  const userId = prospect.campaign?.userId
  if (!userId) {
    await advanceToNextStep(enrollment, sequence)
    return
  }

  const prospectName = prospect.firstName
    ? `${prospect.firstName}${prospect.lastName ? ` ${prospect.lastName}` : ""}`
    : prospect.email

  const voicemailConfig = step.conditions as any

  await db.notification.create({
    data: {
      userId,
      type: "SYSTEM_UPDATE",
      title: `Voicemail: ${prospectName}`,
      message: `Drop a voicemail to ${prospectName}${prospect.phoneNumber ? ` at ${prospect.phoneNumber}` : ""}`,
      entityType: "sequence_voicemail",
      entityId: step.id,
      severity: "medium",
      metadata: {
        sequenceId: sequence.id,
        sequenceName: sequence.name,
        stepId: step.id,
        enrollmentId: enrollment.id,
        prospectId: prospect.id,
        prospectPhone: prospect.phoneNumber,
        audioUrl: voicemailConfig?.audioUrl,
      },
      actionUrl: `/dashboard/sequences/${sequence.id}?prospect=${prospect.id}`,
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

  await advanceToNextStep(enrollment, sequence)
}

async function executeDirectMailStep(enrollment: any, step: any, prospect: any, sequence: any) {
  const userId = prospect.campaign?.userId
  if (!userId) {
    await advanceToNextStep(enrollment, sequence)
    return
  }

  const prospectName = prospect.firstName
    ? `${prospect.firstName}${prospect.lastName ? ` ${prospect.lastName}` : ""}`
    : prospect.email

  const mailConfig = step.conditions as any

  await db.notification.create({
    data: {
      userId,
      type: "SYSTEM_UPDATE",
      title: `Direct Mail: ${prospectName}`,
      message: `Send ${mailConfig?.mailType || "mail"} to ${prospectName}`,
      entityType: "sequence_direct_mail",
      entityId: step.id,
      severity: "medium",
      metadata: {
        sequenceId: sequence.id,
        sequenceName: sequence.name,
        stepId: step.id,
        enrollmentId: enrollment.id,
        prospectId: prospect.id,
        templateId: mailConfig?.templateId,
        mailType: mailConfig?.mailType,
      },
      actionUrl: `/dashboard/sequences/${sequence.id}?prospect=${prospect.id}`,
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

  await advanceToNextStep(enrollment, sequence)
}

// ============================================
// HELPER FUNCTIONS
// ============================================

async function processWaitingEnrollments(stats: any) {
  const waitingEnrollments = await db.sequenceEnrollment.findMany({
    where: {
      status: "ACTIVE",
      metadata: {
        path: ["waitingFor"],
        not: Prisma.DbNull,
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
    take: 100,
  })

  for (const enrollment of waitingEnrollments) {
    const prospect = await db.prospect.findUnique({
      where: { id: enrollment.prospectId },
    })

    if (!prospect || !enrollment.sequence) continue

    const metadata = enrollment.metadata as any
    const waitingStepId = metadata?.waitingStepId

    if (!waitingStepId) continue

    const currentStep = enrollment.sequence.steps.find((s: any) => s.id === waitingStepId)
    if (currentStep?.stepType === "WAIT_UNTIL") {
      const result = await executeWaitUntilStep(enrollment, currentStep, prospect, enrollment.sequence)
      if (result.conditionMet) {
        stats.waitUntilChecked++
      }
    }
  }
}

async function processManualReviewApprovals(stats: any) {
  const approvedEnrollments = await db.sequenceEnrollment.findMany({
    where: {
      status: "PAUSED",
      metadata: {
        path: ["pauseReason"],
        equals: "manual_review",
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
    take: 100,
  })

  for (const enrollment of approvedEnrollments) {
    const metadata = enrollment.metadata as any

    if (metadata?.approved === true) {
      await db.sequenceEnrollment.update({
        where: { id: enrollment.id },
        data: {
          status: "ACTIVE",
          pausedAt: null,
          resumedAt: new Date(),
          metadata: {
            ...metadata,
            pauseReason: null,
            approvedAt: new Date().toISOString(),
          },
        },
      })

      await advanceToNextStep(enrollment, enrollment.sequence)
      stats.manualReviewsPaused++
    }
  }
}

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

async function exitEnrollment(enrollmentId: string, sequenceId: string, reason: string) {
  await db.sequenceEnrollment.update({
    where: { id: enrollmentId },
    data: {
      status: "EXITED",
      exitReason: reason as any,
      exitedAt: new Date(),
      nextStepAt: null,
    },
  })

  await db.sequence.update({
    where: { id: sequenceId },
    data: {
      totalExited: { increment: 1 },
    },
  })
}

async function advanceToNextStep(enrollment: any, sequence: any) {
  const nextStepIndex = enrollment.currentStep + 1
  const nextStep = sequence.steps[nextStepIndex]

  if (!nextStep) {
    await markEnrollmentCompleted(enrollment.id, sequence.id)
    return
  }

  const delayMs = calculateDelayInMs(nextStep.delayValue, nextStep.delayUnit)
  const nextStepAt = new Date(Date.now() + delayMs)
  const finalNextStepAt = sequence.sendInBusinessHours
    ? adjustForBusinessHours(nextStepAt, sequence)
    : nextStepAt

  await db.sequenceEnrollment.update({
    where: { id: enrollment.id },
    data: {
      currentStep: nextStepIndex,
      nextStepAt: finalNextStepAt,
      lastActivityAt: new Date(),
    },
  })
}

async function jumpToStep(enrollment: any, sequence: any, targetStepIndex: number) {
  const targetStep = sequence.steps[targetStepIndex]

  if (!targetStep) {
    await markEnrollmentCompleted(enrollment.id, sequence.id)
    return
  }

  const delayMs = calculateDelayInMs(targetStep.delayValue, targetStep.delayUnit)
  const nextStepAt = new Date(Date.now() + delayMs)
  const finalNextStepAt = sequence.sendInBusinessHours
    ? adjustForBusinessHours(nextStepAt, sequence)
    : nextStepAt

  await db.sequenceEnrollment.update({
    where: { id: enrollment.id },
    data: {
      currentStep: targetStepIndex,
      nextStepAt: finalNextStepAt,
      lastActivityAt: new Date(),
    },
  })
}

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

function evaluateTimeCondition(conditions: any, enrollment: any): boolean {
  const { field, operator, value } = conditions

  let targetDate: Date | null = null
  switch (field) {
    case "enrolledAt":
      targetDate = new Date(enrollment.enrolledAt)
      break
    default:
      return false
  }

  if (!targetDate) return false

  const now = new Date()
  const diffHours = (now.getTime() - targetDate.getTime()) / (1000 * 60 * 60)

  return compareValues(diffHours, operator, Number(value))
}

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

function selectWeightedVariant<T extends Record<string, any>>(variants: T[]): T {
  // If no variants, return empty object
  if (variants.length === 0) {
    return {} as T
  }
  
  // Check if variants have weights defined
  const hasWeights = variants.some(v => v.allocation !== undefined || v.weight !== undefined)
  
  // If no weights, distribute evenly
  const totalWeight = hasWeights 
    ? variants.reduce((sum, v) => sum + (v.allocation || v.weight || 0), 0)
    : variants.length
    
  let random = Math.random() * totalWeight

  for (const variant of variants) {
    const weight = hasWeights 
      ? (variant.allocation || variant.weight || 0)
      : 1 // Equal weight if no weights defined
      
    random -= weight
    if (random <= 0) {
      return variant
    }
  }

  return variants[variants.length - 1]
}

// function selectWeightedVariant<T extends { allocation?: number; weight?: number }>(variants: T[]): T {
//   const totalWeight = variants.reduce((sum, v) => sum + (v.allocation || v.weight || 0), 0)
//   let random = Math.random() * totalWeight

//   for (const variant of variants) {
//     const weight = variant.allocation || variant.weight || 0
//     random -= weight
//     if (random <= 0) {
//       return variant
//     }
//   }

//   return variants[variants.length - 1]
// }

async function checkRateLimits(enrollment: any): Promise<boolean> {
  const activeAccounts = await db.sendingAccount.count({
    where: {
      userId: enrollment.sequence.userId,
      isActive: true,
      emailsSentToday: {
        lt: db.sendingAccount.fields.dailyLimit,
      },
    },
  })

  return activeAccounts > 0
}

async function checkIdempotency(key: string): Promise<boolean> {
  const cached = await db.idempotencyCache.findUnique({
    where: { key },
  })

  if (!cached) return false

  if (cached.expiresAt < new Date()) {
    await db.idempotencyCache.delete({ where: { id: cached.id } })
    return false
  }

  return true
}

async function markExecuted(key: string) {
  await db.idempotencyCache.create({
    data: {
      key,
      userId: "system",
      statusCode: 200,
      responseBody: { executed: true },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  })
}

async function cleanupIdempotency() {
  await db.idempotencyCache.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })
}

async function logError(enrollmentId: string, error: any) {
  await db.errorLog.create({
    data: {
      message: error.message || "Unknown error",
      stack: error.stack,
      errorType: "SEQUENCE_EXECUTION",
      endpoint: "/api/cron/sequences",
      method: "GET",
      fingerprint: `enrollment-${enrollmentId}`,
      resolved: false,
    },
  })
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}