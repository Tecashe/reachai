// "use server"

// import { revalidatePath } from "next/cache"
// import { db } from "@/lib/db"
// import { Prisma } from "@prisma/client"
// import type {
//   Sequence,
//   SequenceStep,
//   SequenceStepVariant,
//   SequenceStatus,
//   StepType,
//   DelayUnit,
//   SequenceEnrollment,
//   EnrollmentStatus,
// } from "@/lib/types/sequence"

// // ===========================================
// // SEQUENCE CRUD
// // ===========================================

// export async function getSequences(userId: string): Promise<Sequence[]> {
//   const sequences = await db.sequence.findMany({
//     where: { userId },
//     orderBy: { updatedAt: "desc" },
//     include: {
//       _count: {
//         select: { steps: true, enrollments: true },
//       },
//     },
//   })

//   return sequences.map((s) => ({
//     ...s,
//     totalSteps: s._count.steps,
//     totalEnrolled: s._count.enrollments,
//   })) as Sequence[]
// }

// export async function getSequenceById(
//   sequenceId: string,
//   userId: string,
// ): Promise<(Sequence & { steps: SequenceStep[] }) | null> {
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//     include: {
//       steps: {
//         orderBy: { order: "asc" },
//         include: { variants: true },
//       },
//     },
//   })

//   return sequence as (Sequence & { steps: SequenceStep[] }) | null
// }

// export async function createSequence(
//   userId: string,
//   data: Partial<Omit<Sequence, "id" | "userId" | "createdAt" | "updatedAt">>,
// ): Promise<Sequence> {
//   const sequence = await db.sequence.create({
//     data: {
//       userId,
//       name: data.name || "New Sequence",
//       description: data.description,
//       status: data.status || "DRAFT",
//       timezone: data.timezone || "America/New_York",
//       sendInBusinessHours: data.sendInBusinessHours ?? true,
//       businessHoursStart: data.businessHoursStart || "09:00",
//       businessHoursEnd: data.businessHoursEnd || "17:00",
//       businessDays: data.businessDays || [1, 2, 3, 4, 5],
//       dailySendLimit: data.dailySendLimit ?? 50,
//       minDelayBetweenSends: data.minDelayBetweenSends ?? 60,
//       trackOpens: data.trackOpens ?? true,
//       trackClicks: data.trackClicks ?? true,
//       enableLinkedIn: data.enableLinkedIn ?? false,
//       enableCalls: data.enableCalls ?? false,
//       enableTasks: data.enableTasks ?? false,
//       enableABTesting: data.enableABTesting ?? false,
//       abTestWinnerMetric: data.abTestWinnerMetric || "REPLY_RATE",
//       abTestSampleSize: data.abTestSampleSize ?? 20,
//       abTestDuration: data.abTestDuration ?? 48,
//       aiOptimizeSendTime: data.aiOptimizeSendTime ?? true,
//       aiPersonalization: data.aiPersonalization ?? true,
//       toneOfVoice: data.toneOfVoice || "professional",
//       tags: data.tags || [],
//     },
//   })

//   revalidatePath("/sequences")
//   return sequence as Sequence
// }

// export async function updateSequence(
//   sequenceId: string,
//   userId: string,
//   data: Partial<Omit<Sequence, "id" | "userId" | "createdAt" | "updatedAt">>,
// ): Promise<Sequence> {
//   // Destructure to remove any fields that aren't direct DB columns
//   const { steps: _steps, ...updateData } = data as Partial<Sequence> & { steps?: SequenceStep[] }

//   const sequence = await db.sequence.update({
//     where: { id: sequenceId, userId },
//     data: {
//       ...updateData,
//       // Handle nullable fields properly for Prisma
//       folderId: updateData.folderId === null ? null : updateData.folderId,
//       description: updateData.description === null ? null : updateData.description,
//       archivedAt: updateData.archivedAt === null ? null : updateData.archivedAt,
//       avgOpenRate: updateData.avgOpenRate === null ? null : updateData.avgOpenRate,
//       avgReplyRate: updateData.avgReplyRate === null ? null : updateData.avgReplyRate,
//       avgClickRate: updateData.avgClickRate === null ? null : updateData.avgClickRate,
//       updatedAt: new Date(),
//     },
//   })

//   revalidatePath("/sequences")
//   revalidatePath(`/sequences/${sequenceId}`)
//   return sequence as Sequence
// }

// export async function updateSequenceStatus(sequenceId: string, userId: string, status: SequenceStatus): Promise<void> {
//   await db.sequence.update({
//     where: { id: sequenceId, userId },
//     data: { status },
//   })

//   revalidatePath("/sequences")
//   revalidatePath(`/sequences/${sequenceId}`)
// }

// export async function deleteSequence(sequenceId: string, userId: string): Promise<void> {
//   await db.sequence.delete({
//     where: { id: sequenceId, userId },
//   })

//   revalidatePath("/sequences")
// }

// export async function archiveSequence(sequenceId: string, userId: string): Promise<void> {
//   await db.sequence.update({
//     where: { id: sequenceId, userId },
//     data: {
//       status: "ARCHIVED",
//       archivedAt: new Date(),
//     },
//   })

//   revalidatePath("/sequences")
// }

// export async function duplicateSequence(sequenceId: string, userId: string): Promise<Sequence> {
//   const original = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//     include: {
//       steps: {
//         include: {
//           variants: true,
//         },
//       },
//     },
//   })

//   if (!original) throw new Error("Sequence not found")

//   const { id, createdAt, updatedAt, steps, ...sequenceData } = original

//   const duplicated = await db.sequence.create({
//     data: {
//       ...sequenceData,
//       name: `${original.name} (Copy)`,
//       status: "DRAFT",
//       totalEnrolled: 0,
//       totalCompleted: 0,
//       archivedAt: null,
//       steps: {
//         create: steps.map((step) => ({
//           order: step.order,
//           stepType: step.stepType,
//           delayValue: step.delayValue,
//           delayUnit: step.delayUnit,
//           subject: step.subject,
//           body: step.body,
//           bodyHtml: step.bodyHtml,
//           templateId: step.templateId,
//           variables: step.variables === null ? Prisma.JsonNull : step.variables,
//           spintaxEnabled: step.spintaxEnabled,
//           conditions: step.conditions === null ? Prisma.JsonNull : step.conditions,
//           skipIfReplied: step.skipIfReplied,
//           skipIfBounced: step.skipIfBounced,
//           linkedInAction: step.linkedInAction,
//           linkedInMessage: step.linkedInMessage,
//           callScript: step.callScript,
//           callDuration: step.callDuration,
//           taskTitle: step.taskTitle,
//           taskDescription: step.taskDescription,
//           taskPriority: step.taskPriority,
//           internalNotes: step.internalNotes,
//           sent: 0,
//           delivered: 0,
//           opened: 0,
//           clicked: 0,
//           replied: 0,
//           bounced: 0,
//         })),
//       },
//     },
//   })

//   revalidatePath("/sequences")
//   return duplicated as Sequence
// }

// export async function bulkUpdateSequenceStatus(
//   sequenceIds: string[],
//   userId: string,
//   status: SequenceStatus,
// ): Promise<void> {
//   await db.sequence.updateMany({
//     where: {
//       id: { in: sequenceIds },
//       userId,
//     },
//     data: { status },
//   })

//   revalidatePath("/sequences")
// }

// // Added bulkArchiveSequences function
// export async function bulkArchiveSequences(sequenceIds: string[], userId: string): Promise<void> {
//   await db.sequence.updateMany({
//     where: {
//       id: { in: sequenceIds },
//       userId,
//     },
//     data: {
//       status: "ARCHIVED",
//       archivedAt: new Date(),
//     },
//   })

//   revalidatePath("/sequences")
// }

// // ===========================================
// // STEP CRUD
// // ===========================================

// export async function createStep(
//   sequenceId: string,
//   userId: string,
//   data: {
//     order: number
//     stepType: StepType
//     delayValue?: number
//     delayUnit?: DelayUnit
//     subject?: string | null
//     body?: string | null
//   },
// ): Promise<SequenceStep> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })

//   if (!sequence) throw new Error("Sequence not found")

//   const step = await db.sequenceStep.create({
//     data: {
//       sequenceId,
//       order: data.order,
//       stepType: data.stepType,
//       delayValue: data.delayValue ?? 1,
//       delayUnit: data.delayUnit ?? "DAYS",
//       subject: data.subject || null,
//       body: data.body || null,
//       skipIfReplied: true,
//       skipIfBounced: true,
//       spintaxEnabled: false,
//       sent: 0,
//       delivered: 0,
//       opened: 0,
//       clicked: 0,
//       replied: 0,
//       bounced: 0,
//     },
//     include: {
//       variants: true,
//     },
//   })

//   // Update sequence totalSteps
//   await db.sequence.update({
//     where: { id: sequenceId },
//     data: {
//       totalSteps: { increment: 1 },
//     },
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
//   return step as SequenceStep
// }

// export async function updateStep(
//   stepId: string,
//   sequenceId: string,
//   userId: string,
//   data: Partial<Omit<SequenceStep, "id" | "sequenceId" | "createdAt" | "updatedAt">>,
// ): Promise<SequenceStep> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })

//   if (!sequence) throw new Error("Sequence not found")

//   // Handle JsonValue fields properly
//   const updateData: Record<string, unknown> = { ...data }
//   if ("variables" in data) {
//     updateData.variables = data.variables === null ? Prisma.JsonNull : data.variables
//   }
//   if ("conditions" in data) {
//     updateData.conditions = data.conditions === null ? Prisma.JsonNull : data.conditions
//   }

//   const step = await db.sequenceStep.update({
//     where: { id: stepId },
//     data: updateData,
//     include: {
//       variants: true,
//     },
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
//   return step as SequenceStep
// }

// export async function deleteStep(stepId: string, sequenceId: string, userId: string): Promise<void> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })

//   if (!sequence) throw new Error("Sequence not found")

//   const deletedStep = await db.sequenceStep.delete({
//     where: { id: stepId },
//   })

//   // Reorder remaining steps
//   await db.sequenceStep.updateMany({
//     where: {
//       sequenceId,
//       order: { gt: deletedStep.order },
//     },
//     data: {
//       order: { decrement: 1 },
//     },
//   })

//   // Update sequence totalSteps
//   await db.sequence.update({
//     where: { id: sequenceId },
//     data: {
//       totalSteps: { decrement: 1 },
//     },
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
// }

// export async function reorderSteps(sequenceId: string, userId: string, stepIds: string[]): Promise<void> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })

//   if (!sequence) throw new Error("Sequence not found")

//   // Update each step's order
//   await Promise.all(
//     stepIds.map((stepId, index) =>
//       db.sequenceStep.update({
//         where: { id: stepId },
//         data: { order: index },
//       }),
//     ),
//   )

//   revalidatePath(`/sequences/${sequenceId}`)
// }

// export async function duplicateStep(stepId: string, sequenceId: string, userId: string): Promise<SequenceStep> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   const original = await db.sequenceStep.findUnique({
//     where: { id: stepId },
//     include: { variants: true },
//   })
//   if (!original) throw new Error("Step not found")

//   // Shift steps after the original
//   await db.sequenceStep.updateMany({
//     where: {
//       sequenceId,
//       order: { gt: original.order },
//     },
//     data: {
//       order: { increment: 1 },
//     },
//   })

//   const { id, createdAt, updatedAt, variants, ...stepData } = original

//   const newStep = await db.sequenceStep.create({
//     data: {
//       ...stepData,
//       variables: stepData.variables === null ? Prisma.JsonNull : stepData.variables,
//       conditions: stepData.conditions === null ? Prisma.JsonNull : stepData.conditions,
//       order: original.order + 1,
//       sent: 0,
//       delivered: 0,
//       opened: 0,
//       clicked: 0,
//       replied: 0,
//       bounced: 0,
//       variants: {
//         create: variants.map((v) => {
//           const { id: vId, stepId: vsId, createdAt: vc, updatedAt: vu, ...variantData } = v
//           return {
//             ...variantData,
//             sent: 0,
//             opened: 0,
//             clicked: 0,
//             replied: 0,
//             isWinner: false,
//             winnerSelectedAt: null,
//           }
//         }),
//       },
//     },
//     include: { variants: true },
//   })

//   // Update total steps count
//   await updateSequenceStepCount(sequenceId)

//   revalidatePath(`/sequences/${sequenceId}`)
//   return newStep as SequenceStep
// }

// // ===========================================
// // VARIANT CRUD
// // ===========================================

// export async function createVariant(
//   stepId: string,
//   sequenceId: string,
//   userId: string,
//   data: {
//     variantName: string
//     subject?: string | null
//     body?: string | null
//     weight?: number
//   },
// ): Promise<SequenceStepVariant> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   const variant = await db.sequenceStepVariant.create({
//     data: {
//       stepId,
//       variantName: data.variantName,
//       subject: data.subject,
//       body: data.body,
//       weight: data.weight ?? 50,
//       sent: 0,
//       opened: 0,
//       clicked: 0,
//       replied: 0,
//       isWinner: false,
//     },
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
//   return variant as SequenceStepVariant
// }

// export async function updateVariant(
//   variantId: string,
//   sequenceId: string,
//   userId: string,
//   data: Partial<Omit<SequenceStepVariant, "id" | "stepId" | "createdAt" | "updatedAt">>,
// ): Promise<SequenceStepVariant> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   const variant = await db.sequenceStepVariant.update({
//     where: { id: variantId },
//     data,
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
//   return variant as SequenceStepVariant
// }

// export async function deleteVariant(variantId: string, sequenceId: string, userId: string): Promise<void> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   await db.sequenceStepVariant.delete({
//     where: { id: variantId },
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
// }

// export async function selectVariantAsWinner(
//   variantId: string,
//   stepId: string,
//   sequenceId: string,
//   userId: string,
// ): Promise<void> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   // Reset all variants for this step
//   await db.sequenceStepVariant.updateMany({
//     where: { stepId },
//     data: { isWinner: false, winnerSelectedAt: null },
//   })

//   // Set the winner
//   const winner = await db.sequenceStepVariant.update({
//     where: { id: variantId },
//     data: { isWinner: true, winnerSelectedAt: new Date() },
//   })

//   // Update the step with winner's content
//   await db.sequenceStep.update({
//     where: { id: stepId },
//     data: {
//       subject: winner.subject,
//       body: winner.body,
//     },
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
// }

// export async function redistributeVariantWeights(
//   stepId: string,
//   sequenceId: string,
//   userId: string,
//   weights: { variantId: string; weight: number }[],
// ): Promise<void> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   await Promise.all(
//     weights.map(({ variantId, weight }) =>
//       db.sequenceStepVariant.update({
//         where: { id: variantId },
//         data: { weight },
//       }),
//     ),
//   )

//   revalidatePath(`/sequences/${sequenceId}`)
// }

// // ===========================================
// // ENROLLMENT CRUD
// // ===========================================

// export async function getEnrollments(
//   sequenceId: string,
//   userId: string,
//   status?: EnrollmentStatus,
// ): Promise<
//   (SequenceEnrollment & {
//     prospect: {
//       firstName: string | null
//       lastName: string | null
//       email: string
//       company: string | null
//       jobTitle: string | null
//       imageUrl?: string | null
//     } | null
//   })[]
// > {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   const enrollments = await db.sequenceEnrollment.findMany({
//     where: {
//       sequenceId,
//       ...(status && { status }),
//     },
//     include: {
//       prospect: {
//         select: {
//           firstName: true,
//           lastName: true,
//           email: true,
//           company: true,
//           jobTitle: true,
//         },
//       },
//     },
//     orderBy: { enrolledAt: "desc" },
//   })

//   return enrollments as any
// }

// export async function pauseEnrollment(enrollmentId: string, sequenceId: string, userId: string): Promise<void> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   await db.sequenceEnrollment.update({
//     where: { id: enrollmentId },
//     data: {
//       status: "PAUSED",
//       pausedAt: new Date(),
//     },
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
// }

// export async function resumeEnrollment(enrollmentId: string, sequenceId: string, userId: string): Promise<void> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   await db.sequenceEnrollment.update({
//     where: { id: enrollmentId },
//     data: {
//       status: "ACTIVE",
//       pausedAt: null,
//     },
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
// }

// export async function bulkPauseEnrollments(enrollmentIds: string[], sequenceId: string, userId: string): Promise<void> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   await db.sequenceEnrollment.updateMany({
//     where: { id: { in: enrollmentIds } },
//     data: {
//       status: "PAUSED",
//       pausedAt: new Date(),
//     },
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
// }

// export async function bulkResumeEnrollments(
//   enrollmentIds: string[],
//   sequenceId: string,
//   userId: string,
// ): Promise<void> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   await db.sequenceEnrollment.updateMany({
//     where: { id: { in: enrollmentIds } },
//     data: {
//       status: "ACTIVE",
//       pausedAt: null,
//     },
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
// }

// export async function createEnrollment(
//   sequenceId: string,
//   userId: string,
//   emailOrProspectId: string,
// ): Promise<SequenceEnrollment | null> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   let prospectId = emailOrProspectId

//   // If it looks like an email, find or create the prospect
//   if (emailOrProspectId.includes("@")) {
//     let prospect = await db.prospect.findFirst({
//       where: { email: emailOrProspectId, userId },
//     })

//     if (!prospect) {
//       // Create a new prospect
//       prospect = await db.prospect.create({
//         data: {
//           userId,
//           email: emailOrProspectId,
//           firstName: null,
//           lastName: null,
//           status: "ACTIVE",
//         },
//       })
//     }
//     prospectId = prospect.id
//   }

//   // Check for duplicate enrollment
//   const existingEnrollment = await db.sequenceEnrollment.findFirst({
//     where: { sequenceId, prospectId },
//   })

//   if (existingEnrollment) {
//     // Already enrolled, return null to indicate no new enrollment
//     return null
//   }

//   const enrollment = await db.sequenceEnrollment.create({
//     data: {
//       sequenceId,
//       prospectId,
//       status: "ACTIVE",
//       currentStep: 0,
//       emailsSent: 0,
//       emailsOpened: 0,
//       emailsClicked: 0,
//       replied: false,
//     },
//   })

//   // Update sequence totalEnrolled
//   await db.sequence.update({
//     where: { id: sequenceId },
//     data: { totalEnrolled: { increment: 1 } },
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
//   return enrollment as SequenceEnrollment
// }

// export async function updateEnrollmentStatus(
//   enrollmentId: string,
//   sequenceId: string,
//   userId: string,
//   status: EnrollmentStatus,
// ): Promise<void> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   await db.sequenceEnrollment.update({
//     where: { id: enrollmentId },
//     data: {
//       status,
//       ...(status === "PAUSED" && { pausedAt: new Date() }),
//       ...(status === "COMPLETED" && { completedAt: new Date() }),
//     },
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
// }

// export async function removeEnrollment(enrollmentId: string, sequenceId: string, userId: string): Promise<void> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   await db.sequenceEnrollment.delete({
//     where: { id: enrollmentId },
//   })

//   // Update sequence totalEnrolled
//   await db.sequence.update({
//     where: { id: sequenceId },
//     data: { totalEnrolled: { decrement: 1 } },
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
// }

// export async function bulkUpdateEnrollmentStatus(
//   enrollmentIds: string[],
//   sequenceId: string,
//   userId: string,
//   status: EnrollmentStatus,
// ): Promise<void> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   await db.sequenceEnrollment.updateMany({
//     where: { id: { in: enrollmentIds } },
//     data: {
//       status,
//       ...(status === "PAUSED" && { pausedAt: new Date() }),
//     },
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
// }

// export async function bulkRemoveEnrollments(
//   enrollmentIds: string[],
//   sequenceId: string,
//   userId: string,
// ): Promise<void> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   await db.sequenceEnrollment.deleteMany({
//     where: { id: { in: enrollmentIds } },
//   })

//   // Update sequence totalEnrolled
//   await db.sequence.update({
//     where: { id: sequenceId },
//     data: { totalEnrolled: { decrement: enrollmentIds.length } },
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
// }

// // ===========================================
// // ANALYTICS
// // ===========================================

// export async function getSequenceAnalytics(
//   sequenceId: string,
//   userId: string,
// ): Promise<{
//   totalSent: number
//   totalOpened: number
//   totalClicked: number
//   totalReplied: number
//   totalBounced: number
//   openRate: number
//   clickRate: number
//   replyRate: number
//   bounceRate: number
// }> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   const steps = await db.sequenceStep.findMany({
//     where: { sequenceId },
//     select: { sent: true, opened: true, clicked: true, replied: true, bounced: true },
//   })

//   const totals = steps.reduce(
//     (acc, step) => ({
//       totalSent: acc.totalSent + step.sent,
//       totalOpened: acc.totalOpened + step.opened,
//       totalClicked: acc.totalClicked + step.clicked,
//       totalReplied: acc.totalReplied + step.replied,
//       totalBounced: acc.totalBounced + step.bounced,
//     }),
//     { totalSent: 0, totalOpened: 0, totalClicked: 0, totalReplied: 0, totalBounced: 0 },
//   )

//   return {
//     ...totals,
//     openRate: totals.totalSent > 0 ? (totals.totalOpened / totals.totalSent) * 100 : 0,
//     clickRate: totals.totalSent > 0 ? (totals.totalClicked / totals.totalSent) * 100 : 0,
//     replyRate: totals.totalSent > 0 ? (totals.totalReplied / totals.totalSent) * 100 : 0,
//     bounceRate: totals.totalSent > 0 ? (totals.totalBounced / totals.totalSent) * 100 : 0,
//   }
// }

// export async function getSequencePerformanceTrend(
//   sequenceId: string,
//   userId: string,
//   days = 30,
// ): Promise<{ date: string; sent: number; opened: number; replied: number }[]> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   // This would typically query a separate analytics/events table
//   // For now, return mock trend data based on current stats
//   const result: { date: string; sent: number; opened: number; replied: number }[] = []
//   const now = new Date()

//   for (let i = days - 1; i >= 0; i--) {
//     const date = new Date(now)
//     date.setDate(date.getDate() - i)
//     result.push({
//       date: date.toISOString().split("T")[0],
//       sent: Math.floor(Math.random() * 50),
//       opened: Math.floor(Math.random() * 30),
//       replied: Math.floor(Math.random() * 10),
//     })
//   }

//   return result
// }

// // ===========================================
// // TAGS
// // ===========================================

// export async function getAllTags(userId: string): Promise<string[]> {
//   const sequences = await db.sequence.findMany({
//     where: { userId },
//     select: { tags: true },
//   })

//   const allTags = new Set<string>()
//   sequences.forEach((s) => s.tags.forEach((tag) => allTags.add(tag)))

//   return Array.from(allTags).sort()
// }

// export async function addTagToSequence(sequenceId: string, userId: string, tag: string): Promise<void> {
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   if (!sequence.tags.includes(tag)) {
//     await db.sequence.update({
//       where: { id: sequenceId },
//       data: { tags: [...sequence.tags, tag] },
//     })
//   }

//   revalidatePath("/sequences")
// }

// export async function removeTagFromSequence(sequenceId: string, userId: string, tag: string): Promise<void> {
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   await db.sequence.update({
//     where: { id: sequenceId },
//     data: { tags: sequence.tags.filter((t) => t !== tag) },
//   })

//   revalidatePath("/sequences")
// }

// // ===========================================
// // TEMPLATE OPERATIONS
// // ===========================================

// export async function getEmailTemplates(userId: string) {
//   const templates = await db.sequenceTemplate.findMany({
//     where: {
//       OR: [{ userId }, { isSystem: true }],
//     },
//     orderBy: [{ isSystem: "desc" }, { usageCount: "desc" }],
//   })

//   return templates
// }

// export async function createEmailTemplate(
//   userId: string,
//   data: {
//     name: string
//     description?: string
//     category: string
//     steps: any
//     settings?: any
//   },
// ) {
//   const template = await db.sequenceTemplate.create({
//     data: {
//       userId,
//       name: data.name,
//       description: data.description || null,
//       category: data.category,
//       steps: data.steps,
//       settings: data.settings || null,
//       isSystem: false,
//       usageCount: 0,
//     },
//   })

//   revalidatePath("/sequences")
//   return template
// }

// export async function useTemplate(templateId: string, userId: string) {
//   await db.sequenceTemplate.update({
//     where: { id: templateId },
//     data: {
//       usageCount: { increment: 1 },
//     },
//   })

//   const template = await db.sequenceTemplate.findUnique({
//     where: { id: templateId },
//   })

//   return template
// }

// export async function deleteTemplate(templateId: string, userId: string): Promise<void> {
//   await db.sequenceTemplate.delete({
//     where: {
//       id: templateId,
//       userId, // Only allow deleting own templates
//     },
//   })

//   revalidatePath("/sequences")
// }

// // ===========================================
// // BULK OPERATIONS
// // ===========================================

// export async function bulkPauseSequences(sequenceIds: string[], userId: string): Promise<void> {
//   await db.sequence.updateMany({
//     where: {
//       id: { in: sequenceIds },
//       userId,
//     },
//     data: { status: "PAUSED" },
//   })

//   revalidatePath("/sequences")
// }

// export async function bulkResumeSequences(sequenceIds: string[], userId: string): Promise<void> {
//   await db.sequence.updateMany({
//     where: {
//       id: { in: sequenceIds },
//       userId,
//     },
//     data: { status: "ACTIVE" },
//   })

//   revalidatePath("/sequences")
// }

// export async function bulkDeleteSequences(sequenceIds: string[], userId: string): Promise<void> {
//   await db.sequence.deleteMany({
//     where: {
//       id: { in: sequenceIds },
//       userId,
//     },
//   })

//   revalidatePath("/sequences")
// }

// // ===========================================
// // HELPER FUNCTIONS
// // ===========================================

// async function updateSequenceStepCount(sequenceId: string): Promise<void> {
//   const stepCount = await db.sequenceStep.count({
//     where: { sequenceId },
//   })

//   await db.sequence.update({
//     where: { id: sequenceId },
//     data: { totalSteps: stepCount },
//   })
// }

// async function updateSequenceEnrolledCount(sequenceId: string): Promise<void> {
//   const activeEnrollments = await db.sequenceEnrollment.count({
//     where: {
//       sequenceId,
//       status: { in: ["ACTIVE", "PAUSED", "REPLIED"] },
//     },
//   })

//   await db.sequence.update({
//     where: { id: sequenceId },
//     data: { totalEnrolled: activeEnrollments },
//   })
// }

// async function updateSequenceStats(sequenceId: string): Promise<void> {
//   const sequence = await db.sequence.findUnique({
//     where: { id: sequenceId },
//     include: {
//       steps: true,
//     },
//   })

//   if (!sequence) return

//   const totalSent = sequence.steps.reduce((sum, s) => sum + s.sent, 0)
//   const totalOpened = sequence.steps.reduce((sum, s) => sum + s.opened, 0)
//   const totalReplied = sequence.steps.reduce((sum, s) => sum + s.replied, 0)
//   const totalClicked = sequence.steps.reduce((sum, s) => sum + s.clicked, 0)

//   await db.sequence.update({
//     where: { id: sequenceId },
//     data: {
//       avgOpenRate: totalSent > 0 ? (totalOpened / totalSent) * 100 : null,
//       avgReplyRate: totalSent > 0 ? (totalReplied / totalSent) * 100 : null,
//       avgClickRate: totalSent > 0 ? (totalClicked / totalSent) * 100 : null,
//     },
//   })
// }

// // ===========================================
// // AUTOMATION OPERATIONS
// // ===========================================

// export async function getSequenceAutomations(sequenceId: string, userId: string) {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   const automations = await db.sequenceAutomation.findMany({
//     where: { sequenceId },
//     orderBy: { createdAt: "desc" },
//   })

//   return automations
// }

// export async function createAutomation(
//   sequenceId: string,
//   userId: string,
//   data: {
//     name: string
//     description?: string
//     trigger: string
//     triggerConfig?: any
//     conditions?: any
//     actions: any
//   },
// ) {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   const automation = await db.sequenceAutomation.create({
//     data: {
//       sequenceId,
//       name: data.name,
//       description: data.description || null,
//       trigger: data.trigger as any,
//       triggerConfig: data.triggerConfig || null,
//       conditions: data.conditions || null,
//       actions: data.actions,
//       isActive: true,
//       timesTriggered: 0,
//     },
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
//   return automation
// }

// export async function toggleAutomation(automationId: string, sequenceId: string, userId: string): Promise<void> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   const automation = await db.sequenceAutomation.findUnique({
//     where: { id: automationId },
//   })
//   if (!automation) throw new Error("Automation not found")

//   await db.sequenceAutomation.update({
//     where: { id: automationId },
//     data: { isActive: !automation.isActive },
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
// }

// export async function deleteAutomation(automationId: string, sequenceId: string, userId: string): Promise<void> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   await db.sequenceAutomation.delete({
//     where: { id: automationId },
//   })

//   revalidatePath(`/sequences/${sequenceId}`)
// }

"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"
import type {
  Sequence,
  SequenceStep,
  SequenceStepVariant,
  SequenceStatus,
  StepType,
  DelayUnit,
  SequenceEnrollment,
  EnrollmentStatus,
} from "@/lib/types/sequence"

// ===========================================
// SEQUENCE CRUD
// ===========================================

export async function getSequences(userId: string): Promise<Sequence[]> {
  const sequences = await db.sequence.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { steps: true, enrollments: true },
      },
    },
  })

  return sequences.map((s) => ({
    ...s,
    totalSteps: s._count.steps,
    totalEnrolled: s._count.enrollments,
  })) as Sequence[]
}

export async function getSequenceById(
  sequenceId: string,
  userId: string,
): Promise<(Sequence & { steps: SequenceStep[] }) | null> {
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
    include: {
      steps: {
        orderBy: { order: "asc" },
        include: { variants: true },
      },
    },
  })

  return sequence as (Sequence & { steps: SequenceStep[] }) | null
}

export async function createSequence(
  userId: string,
  data: Partial<Omit<Sequence, "id" | "userId" | "createdAt" | "updatedAt">>,
): Promise<Sequence> {
  const sequence = await db.sequence.create({
    data: {
      userId,
      name: data.name || "New Sequence",
      description: data.description,
      status: data.status || "DRAFT",
      timezone: data.timezone || "America/New_York",
      sendInBusinessHours: data.sendInBusinessHours ?? true,
      businessHoursStart: data.businessHoursStart || "09:00",
      businessHoursEnd: data.businessHoursEnd || "17:00",
      businessDays: data.businessDays || [1, 2, 3, 4, 5],
      dailySendLimit: data.dailySendLimit ?? 50,
      minDelayBetweenSends: data.minDelayBetweenSends ?? 60,
      trackOpens: data.trackOpens ?? true,
      trackClicks: data.trackClicks ?? true,
      enableLinkedIn: data.enableLinkedIn ?? false,
      enableCalls: data.enableCalls ?? false,
      enableTasks: data.enableTasks ?? false,
      enableABTesting: data.enableABTesting ?? false,
      abTestWinnerMetric: data.abTestWinnerMetric || "REPLY_RATE",
      abTestSampleSize: data.abTestSampleSize ?? 20,
      abTestDuration: data.abTestDuration ?? 48,
      aiOptimizeSendTime: data.aiOptimizeSendTime ?? true,
      aiPersonalization: data.aiPersonalization ?? true,
      toneOfVoice: data.toneOfVoice || "professional",
      tags: data.tags || [],
    },
  })

  revalidatePath("/sequences")
  return sequence as Sequence
}

export async function updateSequence(
  sequenceId: string,
  userId: string,
  data: Partial<Omit<Sequence, "id" | "userId" | "createdAt" | "updatedAt">>,
): Promise<Sequence> {
  // Destructure to remove any fields that aren't direct DB columns
  const { steps: _steps, ...updateData } = data as Partial<Sequence> & { steps?: SequenceStep[] }

  const sequence = await db.sequence.update({
    where: { id: sequenceId, userId },
    data: {
      ...updateData,
      // Handle nullable fields properly for Prisma
      folderId: updateData.folderId === null ? null : updateData.folderId,
      description: updateData.description === null ? null : updateData.description,
      archivedAt: updateData.archivedAt === null ? null : updateData.archivedAt,
      avgOpenRate: updateData.avgOpenRate === null ? null : updateData.avgOpenRate,
      avgReplyRate: updateData.avgReplyRate === null ? null : updateData.avgReplyRate,
      avgClickRate: updateData.avgClickRate === null ? null : updateData.avgClickRate,
      updatedAt: new Date(),
    },
  })

  revalidatePath("/sequences")
  revalidatePath(`/sequences/${sequenceId}`)
  return sequence as Sequence
}

export async function updateSequenceStatus(sequenceId: string, userId: string, status: SequenceStatus): Promise<void> {
  await db.sequence.update({
    where: { id: sequenceId, userId },
    data: { status },
  })

  revalidatePath("/sequences")
  revalidatePath(`/sequences/${sequenceId}`)
}

export async function deleteSequence(sequenceId: string, userId: string): Promise<void> {
  await db.sequence.delete({
    where: { id: sequenceId, userId },
  })

  revalidatePath("/sequences")
}

export async function archiveSequence(sequenceId: string, userId: string): Promise<void> {
  await db.sequence.update({
    where: { id: sequenceId, userId },
    data: {
      status: "ARCHIVED",
      archivedAt: new Date(),
    },
  })

  revalidatePath("/sequences")
}

export async function duplicateSequence(sequenceId: string, userId: string): Promise<Sequence> {
  const original = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
    include: {
      steps: {
        include: {
          variants: true,
        },
      },
    },
  })

  if (!original) throw new Error("Sequence not found")

  const { id, createdAt, updatedAt, steps, ...sequenceData } = original

  const duplicated = await db.sequence.create({
    data: {
      ...sequenceData,
      name: `${original.name} (Copy)`,
      status: "DRAFT",
      totalEnrolled: 0,
      totalCompleted: 0,
      archivedAt: null,
      steps: {
        create: steps.map((step) => ({
          order: step.order,
          stepType: step.stepType,
          delayValue: step.delayValue,
          delayUnit: step.delayUnit,
          subject: step.subject,
          body: step.body,
          bodyHtml: step.bodyHtml,
          templateId: step.templateId,
          variables: step.variables === null ? Prisma.JsonNull : step.variables,
          spintaxEnabled: step.spintaxEnabled,
          conditions: step.conditions === null ? Prisma.JsonNull : step.conditions,
          skipIfReplied: step.skipIfReplied,
          skipIfBounced: step.skipIfBounced,
          linkedInAction: step.linkedInAction,
          linkedInMessage: step.linkedInMessage,
          callScript: step.callScript,
          callDuration: step.callDuration,
          taskTitle: step.taskTitle,
          taskDescription: step.taskDescription,
          taskPriority: step.taskPriority,
          internalNotes: step.internalNotes,
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          replied: 0,
          bounced: 0,
        })),
      },
    },
  })

  revalidatePath("/sequences")
  return duplicated as Sequence
}

export async function bulkUpdateSequenceStatus(
  sequenceIds: string[],
  userId: string,
  status: SequenceStatus,
): Promise<void> {
  await db.sequence.updateMany({
    where: {
      id: { in: sequenceIds },
      userId,
    },
    data: { status },
  })

  revalidatePath("/sequences")
}

// Added bulkArchiveSequences function
export async function bulkArchiveSequences(sequenceIds: string[], userId: string): Promise<void> {
  await db.sequence.updateMany({
    where: {
      id: { in: sequenceIds },
      userId,
    },
    data: {
      status: "ARCHIVED",
      archivedAt: new Date(),
    },
  })

  revalidatePath("/sequences")
}

// ===========================================
// STEP CRUD
// ===========================================

export async function createStep(
  sequenceId: string,
  userId: string,
  data: {
    order: number
    stepType: StepType
    delayValue?: number
    delayUnit?: DelayUnit
    subject?: string | null
    body?: string | null
  },
): Promise<SequenceStep> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })

  if (!sequence) throw new Error("Sequence not found")

  const step = await db.sequenceStep.create({
    data: {
      sequenceId,
      order: data.order,
      stepType: data.stepType,
      delayValue: data.delayValue ?? 1,
      delayUnit: data.delayUnit ?? "DAYS",
      subject: data.subject || null,
      body: data.body || null,
      skipIfReplied: true,
      skipIfBounced: true,
      spintaxEnabled: false,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      bounced: 0,
    },
    include: {
      variants: true,
    },
  })

  // Update sequence totalSteps
  await db.sequence.update({
    where: { id: sequenceId },
    data: {
      totalSteps: { increment: 1 },
    },
  })

  revalidatePath(`/sequences/${sequenceId}`)
  return step as SequenceStep
}

export async function updateStep(
  stepId: string,
  sequenceId: string,
  userId: string,
  data: Partial<Omit<SequenceStep, "id" | "sequenceId" | "createdAt" | "updatedAt">>,
): Promise<SequenceStep> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })

  if (!sequence) throw new Error("Sequence not found")

  // Handle JsonValue fields properly
  const updateData: Record<string, unknown> = { ...data }
  if ("variables" in data) {
    updateData.variables = data.variables === null ? Prisma.JsonNull : data.variables
  }
  if ("conditions" in data) {
    updateData.conditions = data.conditions === null ? Prisma.JsonNull : data.conditions
  }

  const step = await db.sequenceStep.update({
    where: { id: stepId },
    data: updateData,
    include: {
      variants: true,
    },
  })

  revalidatePath(`/sequences/${sequenceId}`)
  return step as SequenceStep
}

export async function deleteStep(stepId: string, sequenceId: string, userId: string): Promise<void> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })

  if (!sequence) throw new Error("Sequence not found")

  const deletedStep = await db.sequenceStep.delete({
    where: { id: stepId },
  })

  // Reorder remaining steps
  await db.sequenceStep.updateMany({
    where: {
      sequenceId,
      order: { gt: deletedStep.order },
    },
    data: {
      order: { decrement: 1 },
    },
  })

  // Update sequence totalSteps
  await db.sequence.update({
    where: { id: sequenceId },
    data: {
      totalSteps: { decrement: 1 },
    },
  })

  revalidatePath(`/sequences/${sequenceId}`)
}

export async function reorderSteps(sequenceId: string, userId: string, stepIds: string[]): Promise<void> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })

  if (!sequence) throw new Error("Sequence not found")

  // Update each step's order
  await Promise.all(
    stepIds.map((stepId, index) =>
      db.sequenceStep.update({
        where: { id: stepId },
        data: { order: index },
      }),
    ),
  )

  revalidatePath(`/sequences/${sequenceId}`)
}

export async function duplicateStep(stepId: string, sequenceId: string, userId: string): Promise<SequenceStep> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  const original = await db.sequenceStep.findUnique({
    where: { id: stepId },
    include: { variants: true },
  })
  if (!original) throw new Error("Step not found")

  // Shift steps after the original
  await db.sequenceStep.updateMany({
    where: {
      sequenceId,
      order: { gt: original.order },
    },
    data: {
      order: { increment: 1 },
    },
  })

  const { id, createdAt, updatedAt, variants, ...stepData } = original

  const newStep = await db.sequenceStep.create({
    data: {
      ...stepData,
      variables: stepData.variables === null ? Prisma.JsonNull : stepData.variables,
      conditions: stepData.conditions === null ? Prisma.JsonNull : stepData.conditions,
      order: original.order + 1,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      bounced: 0,
      variants: {
        create: variants.map((v) => {
          const { id: vId, stepId: vsId, createdAt: vc, updatedAt: vu, ...variantData } = v
          return {
            ...variantData,
            sent: 0,
            opened: 0,
            clicked: 0,
            replied: 0,
            isWinner: false,
            winnerSelectedAt: null,
          }
        }),
      },
    },
    include: { variants: true },
  })

  // Update total steps count
  await updateSequenceStepCount(sequenceId)

  revalidatePath(`/sequences/${sequenceId}`)
  return newStep as SequenceStep
}

// ===========================================
// VARIANT CRUD
// ===========================================

export async function createVariant(
  stepId: string,
  sequenceId: string,
  userId: string,
  data: {
    variantName: string
    subject?: string | null
    body?: string | null
    weight?: number
  },
): Promise<SequenceStepVariant> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  const variant = await db.sequenceStepVariant.create({
    data: {
      stepId,
      variantName: data.variantName,
      subject: data.subject,
      body: data.body,
      weight: data.weight ?? 50,
      sent: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      isWinner: false,
    },
  })

  revalidatePath(`/sequences/${sequenceId}`)
  return variant as SequenceStepVariant
}

export async function updateVariant(
  variantId: string,
  sequenceId: string,
  userId: string,
  data: Partial<Omit<SequenceStepVariant, "id" | "stepId" | "createdAt" | "updatedAt">>,
): Promise<SequenceStepVariant> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  const variant = await db.sequenceStepVariant.update({
    where: { id: variantId },
    data,
  })

  revalidatePath(`/sequences/${sequenceId}`)
  return variant as SequenceStepVariant
}

export async function deleteVariant(variantId: string, sequenceId: string, userId: string): Promise<void> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  await db.sequenceStepVariant.delete({
    where: { id: variantId },
  })

  revalidatePath(`/sequences/${sequenceId}`)
}

export async function selectVariantAsWinner(
  variantId: string,
  stepId: string,
  sequenceId: string,
  userId: string,
): Promise<void> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  // Reset all variants for this step
  await db.sequenceStepVariant.updateMany({
    where: { stepId },
    data: { isWinner: false, winnerSelectedAt: null },
  })

  // Set the winner
  const winner = await db.sequenceStepVariant.update({
    where: { id: variantId },
    data: { isWinner: true, winnerSelectedAt: new Date() },
  })

  // Update the step with winner's content
  await db.sequenceStep.update({
    where: { id: stepId },
    data: {
      subject: winner.subject,
      body: winner.body,
    },
  })

  revalidatePath(`/sequences/${sequenceId}`)
}

export async function redistributeVariantWeights(
  stepId: string,
  sequenceId: string,
  userId: string,
  weights: { variantId: string; weight: number }[],
): Promise<void> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  await Promise.all(
    weights.map(({ variantId, weight }) =>
      db.sequenceStepVariant.update({
        where: { id: variantId },
        data: { weight },
      }),
    ),
  )

  revalidatePath(`/sequences/${sequenceId}`)
}

// ===========================================
// ENROLLMENT CRUD
// ===========================================

export async function getEnrollments(
  sequenceId: string,
  userId: string,
  status?: EnrollmentStatus,
): Promise<
  (SequenceEnrollment & {
    prospect: {
      firstName: string | null
      lastName: string | null
      email: string
      company: string | null
      jobTitle: string | null
      imageUrl?: string | null
    } | null
  })[]
> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  // Fetch enrollments without the prospect relation
  const enrollments = await db.sequenceEnrollment.findMany({
    where: {
      sequenceId,
      ...(status && { status }),
    },
    orderBy: { enrolledAt: "desc" },
  })

  // Fetch all prospects for these enrollments
  const prospectIds = enrollments.map((e) => e.prospectId)
  const prospects = await db.prospect.findMany({
    where: { id: { in: prospectIds } },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      company: true,
      jobTitle: true,
    },
  })

  // Create a map for quick lookup
  const prospectMap = new Map(prospects.map((p) => [p.id, p]))

  // Combine enrollments with prospect data
  return enrollments.map((enrollment) => ({
    ...enrollment,
    prospect: prospectMap.get(enrollment.prospectId) || null,
  }))
}

export async function pauseEnrollment(enrollmentId: string, sequenceId: string, userId: string): Promise<void> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  await db.sequenceEnrollment.update({
    where: { id: enrollmentId },
    data: {
      status: "PAUSED",
      pausedAt: new Date(),
    },
  })

  revalidatePath(`/sequences/${sequenceId}`)
}

export async function resumeEnrollment(enrollmentId: string, sequenceId: string, userId: string): Promise<void> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  await db.sequenceEnrollment.update({
    where: { id: enrollmentId },
    data: {
      status: "ACTIVE",
      pausedAt: null,
    },
  })

  revalidatePath(`/sequences/${sequenceId}`)
}

export async function bulkPauseEnrollments(enrollmentIds: string[], sequenceId: string, userId: string): Promise<void> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  await db.sequenceEnrollment.updateMany({
    where: { id: { in: enrollmentIds } },
    data: {
      status: "PAUSED",
      pausedAt: new Date(),
    },
  })

  revalidatePath(`/sequences/${sequenceId}`)
}

export async function bulkResumeEnrollments(
  enrollmentIds: string[],
  sequenceId: string,
  userId: string,
): Promise<void> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  await db.sequenceEnrollment.updateMany({
    where: { id: { in: enrollmentIds } },
    data: {
      status: "ACTIVE",
      pausedAt: null,
    },
  })

  revalidatePath(`/sequences/${sequenceId}`)
}

export async function createEnrollment(
  sequenceId: string,
  userId: string,
  emailOrProspectId: string,
): Promise<SequenceEnrollment | null> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  let prospectId = emailOrProspectId

  // If it looks like an email, find or create the prospect
  if (emailOrProspectId.includes("@")) {
    let prospect = await db.prospect.findFirst({
      where: { email: emailOrProspectId, userId },
    })

    if (!prospect) {
      // Create a new prospect
      prospect = await db.prospect.create({
        data: {
          userId,
          email: emailOrProspectId,
          firstName: null,
          lastName: null,
          status: "ACTIVE",
        },
      })
    }
    prospectId = prospect.id
  }

  // Check for duplicate enrollment
  const existingEnrollment = await db.sequenceEnrollment.findFirst({
    where: { sequenceId, prospectId },
  })

  if (existingEnrollment) {
    // Already enrolled, return null to indicate no new enrollment
    return null
  }

  const enrollment = await db.sequenceEnrollment.create({
    data: {
      sequenceId,
      prospectId,
      status: "ACTIVE",
      currentStep: 0,
      emailsSent: 0,
      emailsOpened: 0,
      emailsClicked: 0,
      replied: false,
    },
  })

  // Update sequence totalEnrolled
  await db.sequence.update({
    where: { id: sequenceId },
    data: { totalEnrolled: { increment: 1 } },
  })

  revalidatePath(`/sequences/${sequenceId}`)
  return enrollment as SequenceEnrollment
}

export async function updateEnrollmentStatus(
  enrollmentId: string,
  sequenceId: string,
  userId: string,
  status: EnrollmentStatus,
): Promise<void> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  await db.sequenceEnrollment.update({
    where: { id: enrollmentId },
    data: {
      status,
      ...(status === "PAUSED" && { pausedAt: new Date() }),
      ...(status === "COMPLETED" && { completedAt: new Date() }),
    },
  })

  revalidatePath(`/sequences/${sequenceId}`)
}

export async function removeEnrollment(enrollmentId: string, sequenceId: string, userId: string): Promise<void> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  await db.sequenceEnrollment.delete({
    where: { id: enrollmentId },
  })

  // Update sequence totalEnrolled
  await db.sequence.update({
    where: { id: sequenceId },
    data: { totalEnrolled: { decrement: 1 } },
  })

  revalidatePath(`/sequences/${sequenceId}`)
}

export async function bulkUpdateEnrollmentStatus(
  enrollmentIds: string[],
  sequenceId: string,
  userId: string,
  status: EnrollmentStatus,
): Promise<void> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  await db.sequenceEnrollment.updateMany({
    where: { id: { in: enrollmentIds } },
    data: {
      status,
      ...(status === "PAUSED" && { pausedAt: new Date() }),
    },
  })

  revalidatePath(`/sequences/${sequenceId}`)
}

export async function bulkRemoveEnrollments(
  enrollmentIds: string[],
  sequenceId: string,
  userId: string,
): Promise<void> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  await db.sequenceEnrollment.deleteMany({
    where: { id: { in: enrollmentIds } },
  })

  // Update sequence totalEnrolled
  await db.sequence.update({
    where: { id: sequenceId },
    data: { totalEnrolled: { decrement: enrollmentIds.length } },
  })

  revalidatePath(`/sequences/${sequenceId}`)
}

// ===========================================
// ANALYTICS
// ===========================================

export async function getSequenceAnalytics(
  sequenceId: string,
  userId: string,
): Promise<{
  totalSent: number
  totalOpened: number
  totalClicked: number
  totalReplied: number
  totalBounced: number
  openRate: number
  clickRate: number
  replyRate: number
  bounceRate: number
}> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  const steps = await db.sequenceStep.findMany({
    where: { sequenceId },
    select: { sent: true, opened: true, clicked: true, replied: true, bounced: true },
  })

  const totals = steps.reduce(
    (acc, step) => ({
      totalSent: acc.totalSent + step.sent,
      totalOpened: acc.totalOpened + step.opened,
      totalClicked: acc.totalClicked + step.clicked,
      totalReplied: acc.totalReplied + step.replied,
      totalBounced: acc.totalBounced + step.bounced,
    }),
    { totalSent: 0, totalOpened: 0, totalClicked: 0, totalReplied: 0, totalBounced: 0 },
  )

  return {
    ...totals,
    openRate: totals.totalSent > 0 ? (totals.totalOpened / totals.totalSent) * 100 : 0,
    clickRate: totals.totalSent > 0 ? (totals.totalClicked / totals.totalSent) * 100 : 0,
    replyRate: totals.totalSent > 0 ? (totals.totalReplied / totals.totalSent) * 100 : 0,
    bounceRate: totals.totalSent > 0 ? (totals.totalBounced / totals.totalSent) * 100 : 0,
  }
}

export async function getSequencePerformanceTrend(
  sequenceId: string,
  userId: string,
  days = 30,
): Promise<{ date: string; sent: number; opened: number; replied: number }[]> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  // This would typically query a separate analytics/events table
  // For now, return mock trend data based on current stats
  const result: { date: string; sent: number; opened: number; replied: number }[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    result.push({
      date: date.toISOString().split("T")[0],
      sent: Math.floor(Math.random() * 50),
      opened: Math.floor(Math.random() * 30),
      replied: Math.floor(Math.random() * 10),
    })
  }

  return result
}

// ===========================================
// TAGS
// ===========================================

export async function getAllTags(userId: string): Promise<string[]> {
  const sequences = await db.sequence.findMany({
    where: { userId },
    select: { tags: true },
  })

  const allTags = new Set<string>()
  sequences.forEach((s) => s.tags.forEach((tag) => allTags.add(tag)))

  return Array.from(allTags).sort()
}

export async function addTagToSequence(sequenceId: string, userId: string, tag: string): Promise<void> {
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  if (!sequence.tags.includes(tag)) {
    await db.sequence.update({
      where: { id: sequenceId },
      data: { tags: [...sequence.tags, tag] },
    })
  }

  revalidatePath("/sequences")
}

export async function removeTagFromSequence(sequenceId: string, userId: string, tag: string): Promise<void> {
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  await db.sequence.update({
    where: { id: sequenceId },
    data: { tags: sequence.tags.filter((t) => t !== tag) },
  })

  revalidatePath("/sequences")
}

// ===========================================
// TEMPLATE OPERATIONS
// ===========================================

export async function getEmailTemplates(userId: string) {
  const templates = await db.sequenceTemplate.findMany({
    where: {
      OR: [{ userId }, { isSystem: true }],
    },
    orderBy: [{ isSystem: "desc" }, { usageCount: "desc" }],
  })

  return templates
}

export async function createEmailTemplate(
  userId: string,
  data: {
    name: string
    description?: string
    category: string
    steps: any
    settings?: any
  },
) {
  const template = await db.sequenceTemplate.create({
    data: {
      userId,
      name: data.name,
      description: data.description || null,
      category: data.category,
      steps: data.steps,
      settings: data.settings || null,
      isSystem: false,
      usageCount: 0,
    },
  })

  revalidatePath("/sequences")
  return template
}

export async function useTemplate(templateId: string, userId: string) {
  await db.sequenceTemplate.update({
    where: { id: templateId },
    data: {
      usageCount: { increment: 1 },
    },
  })

  const template = await db.sequenceTemplate.findUnique({
    where: { id: templateId },
  })

  return template
}

export async function deleteTemplate(templateId: string, userId: string): Promise<void> {
  await db.sequenceTemplate.delete({
    where: {
      id: templateId,
      userId, // Only allow deleting own templates
    },
  })

  revalidatePath("/sequences")
}

// ===========================================
// BULK OPERATIONS
// ===========================================

export async function bulkPauseSequences(sequenceIds: string[], userId: string): Promise<void> {
  await db.sequence.updateMany({
    where: {
      id: { in: sequenceIds },
      userId,
    },
    data: { status: "PAUSED" },
  })

  revalidatePath("/sequences")
}

export async function bulkResumeSequences(sequenceIds: string[], userId: string): Promise<void> {
  await db.sequence.updateMany({
    where: {
      id: { in: sequenceIds },
      userId,
    },
    data: { status: "ACTIVE" },
  })

  revalidatePath("/sequences")
}

export async function bulkDeleteSequences(sequenceIds: string[], userId: string): Promise<void> {
  await db.sequence.deleteMany({
    where: {
      id: { in: sequenceIds },
      userId,
    },
  })

  revalidatePath("/sequences")
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

async function updateSequenceStepCount(sequenceId: string): Promise<void> {
  const stepCount = await db.sequenceStep.count({
    where: { sequenceId },
  })

  await db.sequence.update({
    where: { id: sequenceId },
    data: { totalSteps: stepCount },
  })
}

async function updateSequenceEnrolledCount(sequenceId: string): Promise<void> {
  const activeEnrollments = await db.sequenceEnrollment.count({
    where: {
      sequenceId,
      status: { in: ["ACTIVE", "PAUSED", "REPLIED"] },
    },
  })

  await db.sequence.update({
    where: { id: sequenceId },
    data: { totalEnrolled: activeEnrollments },
  })
}

async function updateSequenceStats(sequenceId: string): Promise<void> {
  const sequence = await db.sequence.findUnique({
    where: { id: sequenceId },
    include: {
      steps: true,
    },
  })

  if (!sequence) return

  const totalSent = sequence.steps.reduce((sum, s) => sum + s.sent, 0)
  const totalOpened = sequence.steps.reduce((sum, s) => sum + s.opened, 0)
  const totalReplied = sequence.steps.reduce((sum, s) => sum + s.replied, 0)
  const totalClicked = sequence.steps.reduce((sum, s) => sum + s.clicked, 0)

  await db.sequence.update({
    where: { id: sequenceId },
    data: {
      avgOpenRate: totalSent > 0 ? (totalOpened / totalSent) * 100 : null,
      avgReplyRate: totalSent > 0 ? (totalReplied / totalSent) * 100 : null,
      avgClickRate: totalSent > 0 ? (totalClicked / totalSent) * 100 : null,
    },
  })
}

// ===========================================
// AUTOMATION OPERATIONS
// ===========================================

export async function getSequenceAutomations(sequenceId: string, userId: string) {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  const automations = await db.sequenceAutomation.findMany({
    where: { sequenceId },
    orderBy: { createdAt: "desc" },
  })

  return automations
}

export async function createAutomation(
  sequenceId: string,
  userId: string,
  data: {
    name: string
    description?: string
    trigger: string
    triggerConfig?: any
    conditions?: any
    actions: any
  },
) {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  const automation = await db.sequenceAutomation.create({
    data: {
      sequenceId,
      name: data.name,
      description: data.description || null,
      trigger: data.trigger as any,
      triggerConfig: data.triggerConfig || null,
      conditions: data.conditions || null,
      actions: data.actions,
      isActive: true,
      timesTriggered: 0,
    },
  })

  revalidatePath(`/sequences/${sequenceId}`)
  return automation
}

export async function toggleAutomation(automationId: string, sequenceId: string, userId: string): Promise<void> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  const automation = await db.sequenceAutomation.findUnique({
    where: { id: automationId },
  })
  if (!automation) throw new Error("Automation not found")

  await db.sequenceAutomation.update({
    where: { id: automationId },
    data: { isActive: !automation.isActive },
  })

  revalidatePath(`/sequences/${sequenceId}`)
}

export async function deleteAutomation(automationId: string, sequenceId: string, userId: string): Promise<void> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  await db.sequenceAutomation.delete({
    where: { id: automationId },
  })

  revalidatePath(`/sequences/${sequenceId}`)
}
