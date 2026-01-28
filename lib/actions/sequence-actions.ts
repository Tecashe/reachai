
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

//   // Fetch enrollments without the prospect relation
//   const enrollments = await db.sequenceEnrollment.findMany({
//     where: {
//       sequenceId,
//       ...(status && { status }),
//     },
//     orderBy: { enrolledAt: "desc" },
//   })

//   // Fetch all prospects for these enrollments
//   const prospectIds = enrollments.map((e) => e.prospectId)
//   const prospects = await db.prospect.findMany({
//     where: { id: { in: prospectIds } },
//     select: {
//       id: true,
//       firstName: true,
//       lastName: true,
//       email: true,
//       company: true,
//       jobTitle: true,
//     },
//   })

//   // Create a map for quick lookup
//   const prospectMap = new Map(prospects.map((p) => [p.id, p]))

//   return enrollments.map((enrollment) => ({
//     ...enrollment,
//     prospect: prospectMap.get(enrollment.prospectId) || null,
//   })) as any
// }

// export async function createEnrollment(
//   sequenceId: string,
//   userId: string,
//   prospectId: string,
// ): Promise<SequenceEnrollment> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

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
//   dailyStats: Array<{
//     date: string
//     sent: number
//     opened: number
//     clicked: number
//     replied: number
//   }>
//   previousWeekTotals: {
//     totalSent: number
//     totalOpened: number
//     totalClicked: number
//     totalReplied: number
//   }
//   steps: SequenceStep[]
// }> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })
//   if (!sequence) throw new Error("Sequence not found")

//   // Get all enrollments for this sequence
//   const enrolledProspects = await db.sequenceEnrollment.findMany({
//     where: { sequenceId },
//     select: { prospectId: true },
//   })
//   const prospectIds = enrolledProspects.map((e) => e.prospectId)

//   console.log("[v0] Analytics Debug - Enrolled prospects:", prospectIds.length)

//   // Sync step stats from EmailLog if we have enrollments
//   if (prospectIds.length > 0) {
//     const steps = await db.sequenceStep.findMany({
//       where: { sequenceId },
//       orderBy: { order: "asc" },
//       include: { variants: true },
//     })

//     console.log("[v0] Analytics Debug - Steps found:", steps.length)

//     for (const step of steps) {
//       const emailLogs = await db.emailLog.findMany({
//         where: {
//           prospectId: { in: prospectIds },
//           ...(step.subject ? { subject: { contains: step.subject } } : {}),
//         },
//       })

//       console.log(`[v0] Analytics Debug - Step ${step.order} "${step.subject}": ${emailLogs.length} emails found`)

//       // Calculate step stats from email logs
//       const stepStats = emailLogs.reduce(
//         (acc, log) => {
//           acc.sent += 1
//           if (log.status === "DELIVERED") acc.delivered += 1
//           if (log.openedAt || log.opens > 0 || log.clickedAt || log.clicks > 0) acc.opened += 1
//           if (log.clickedAt || log.clicks > 0) acc.clicked += 1
//           if (log.repliedAt) acc.replied += 1
//           if (log.bouncedAt) acc.bounced += 1
//           return acc
//         },
//         { sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0, bounced: 0 },
//       )

//       console.log(`[v0] Analytics Debug - Step ${step.order} stats:`, stepStats)

//       // Update step in database if stats changed
//       if (
//         step.sent !== stepStats.sent ||
//         step.opened !== stepStats.opened ||
//         step.clicked !== stepStats.clicked ||
//         step.replied !== stepStats.replied ||
//         step.bounced !== stepStats.bounced
//       ) {
//         await db.sequenceStep.update({
//           where: { id: step.id },
//           data: stepStats,
//         })
//         console.log(`[v0] Analytics Debug - Updated step ${step.order} in database`)
//       }
//     }
//   }

//   // Get aggregate totals from sequence steps (now with updated data)
//   const steps = await db.sequenceStep.findMany({
//     where: { sequenceId },
//     orderBy: { order: "asc" },
//     include: { variants: true },
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

//   // Get enrollments to find the associated campaign
//   const enrollments = await db.sequenceEnrollment.findMany({
//     where: { sequenceId },
//     select: { prospectId: true },
//     take: 1,
//   })

//   let dailyStats: Array<{ date: string; sent: number; opened: number; clicked: number; replied: number }> = []
//   let previousWeekTotals = { totalSent: 0, totalOpened: 0, totalClicked: 0, totalReplied: 0 }

//   // Try to get daily analytics data from Analytics table via Campaign
//   if (enrollments.length > 0) {
//     const prospect = await db.prospect.findUnique({
//       where: { id: enrollments[0].prospectId },
//       select: { campaignId: true },
//     })

//     if (prospect?.campaignId) {
//       // Get last 7 days of analytics
//       const sevenDaysAgo = new Date()
//       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

//       const fourteenDaysAgo = new Date()
//       fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

//       const analyticsData = await db.analytics.findMany({
//         where: {
//           campaignId: prospect.campaignId,
//           date: { gte: sevenDaysAgo },
//         },
//         orderBy: { date: "asc" },
//       })

//       // Get previous week data for comparison
//       const previousWeekData = await db.analytics.findMany({
//         where: {
//           campaignId: prospect.campaignId,
//           date: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
//         },
//       })

//       previousWeekTotals = previousWeekData.reduce(
//         (acc, day) => ({
//           totalSent: acc.totalSent + day.emailsSent,
//           totalOpened: acc.totalOpened + day.emailsOpened,
//           totalClicked: acc.totalClicked + day.emailsClicked,
//           totalReplied: acc.totalReplied + day.emailsReplied,
//         }),
//         { totalSent: 0, totalOpened: 0, totalClicked: 0, totalReplied: 0 },
//       )

//       dailyStats = analyticsData.map((day) => ({
//         date: day.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
//         sent: day.emailsSent,
//         opened: day.emailsOpened,
//         clicked: day.emailsClicked,
//         replied: day.emailsReplied,
//       }))
//     }
//   }

//   // If no Analytics data available, fall back to EmailLog aggregation
//   if (dailyStats.length === 0 && prospectIds.length > 0) {
//     const sevenDaysAgo = new Date()
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

//     // Query EmailLog for daily stats
//     const emailLogs = await db.emailLog.findMany({
//       where: {
//         prospectId: { in: prospectIds },
//         createdAt: { gte: sevenDaysAgo },
//       },
//       select: {
//         createdAt: true,
//         status: true,
//         opens: true,
//         clicks: true,
//       },
//     })

//     // Group by date
//     const dailyMap = new Map<string, { sent: number; opened: number; clicked: number; replied: number }>()

//     emailLogs.forEach((log) => {
//       const dateKey = log.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })
//       const stats = dailyMap.get(dateKey) || { sent: 0, opened: 0, clicked: 0, replied: 0 }

//       stats.sent += 1
//       if (log.opens > 0) stats.opened += 1
//       if (log.clicks > 0) stats.clicked += 1
//       if (log.status === "REPLIED") stats.replied += 1

//       dailyMap.set(dateKey, stats)
//     })

//     // Convert to array and fill missing days
//     dailyStats = []
//     for (let i = 6; i >= 0; i--) {
//       const date = new Date()
//       date.setDate(date.getDate() - i)
//       const dateKey = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
//       const existingStats = dailyMap.get(dateKey)

//       dailyStats.push({
//         date: dateKey,
//         sent: existingStats?.sent || 0,
//         opened: existingStats?.opened || 0,
//         clicked: existingStats?.clicked || 0,
//         replied: existingStats?.replied || 0,
//       })
//     }
//   }

//   return {
//     ...totals,
//     openRate: totals.totalSent > 0 ? (totals.totalOpened / totals.totalSent) * 100 : 0,
//     clickRate: totals.totalSent > 0 ? (totals.totalClicked / totals.totalSent) * 100 : 0,
//     replyRate: totals.totalSent > 0 ? (totals.totalReplied / totals.totalSent) * 100 : 0,
//     bounceRate: totals.totalSent > 0 ? (totals.totalBounced / totals.totalSent) * 100 : 0,
//     dailyStats,
//     previousWeekTotals,
//     steps: steps as SequenceStep[],
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
    // New node type configs
    waitUntilConfig?: any
    exitTriggerConfig?: any
    manualReviewConfig?: any
    abSplitConfig?: any
    behaviorBranchConfig?: any
    multiChannelConfig?: any
    randomVariantConfig?: any
    contentReferenceConfig?: any
    voicemailDropConfig?: any
    directMailConfig?: any
  },
): Promise<SequenceStep> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })

  if (!sequence) throw new Error("Sequence not found")

  // Build the step data with node configs stored in appropriate JSON fields

  await db.sequenceStep.updateMany({
    where: {
      sequenceId,
      order: { gte: data.order },
    },
    data: {
      order: { increment: 1 },
    },
  })

  // Build the step data with node configs stored in appropriate JSON fields
  const stepData: any = {
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
  }
  // const stepData: any = {
  //   sequenceId,
  //   order: data.order,
  //   stepType: data.stepType,
  //   delayValue: data.delayValue ?? 1,
  //   delayUnit: data.delayUnit ?? "DAYS",
  //   subject: data.subject || null,
  //   body: data.body || null,
  //   skipIfReplied: true,
  //   skipIfBounced: true,
  //   spintaxEnabled: false,
  //   sent: 0,
  //   delivered: 0,
  //   opened: 0,
  //   clicked: 0,
  //   replied: 0,
  //   bounced: 0,
  // }

  // Store node-specific configs in the conditions JSON field
  // This is a workaround since the schema doesn't have dedicated columns
  const nodeConfig: Record<string, any> = {}

  if (data.waitUntilConfig) nodeConfig.waitUntilConfig = data.waitUntilConfig
  if (data.exitTriggerConfig) nodeConfig.exitTriggerConfig = data.exitTriggerConfig
  if (data.manualReviewConfig) nodeConfig.manualReviewConfig = data.manualReviewConfig
  if (data.abSplitConfig) nodeConfig.abSplitConfig = data.abSplitConfig
  if (data.behaviorBranchConfig) nodeConfig.behaviorBranchConfig = data.behaviorBranchConfig
  if (data.multiChannelConfig) nodeConfig.multiChannelConfig = data.multiChannelConfig
  if (data.randomVariantConfig) nodeConfig.randomVariantConfig = data.randomVariantConfig
  if (data.contentReferenceConfig) nodeConfig.contentReferenceConfig = data.contentReferenceConfig
  if (data.voicemailDropConfig) nodeConfig.voicemailDropConfig = data.voicemailDropConfig
  if (data.directMailConfig) nodeConfig.directMailConfig = data.directMailConfig

  if (Object.keys(nodeConfig).length > 0) {
    stepData.conditions = nodeConfig
  }

  // const step = await db.sequenceStep.create({
  //   data: stepData,
  //   include: {
  //     variants: true,
  //   },
  // })
  const step = await db.sequenceStep.create({
    data: stepData,
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

  // Map the stored config back to the step object for frontend use
  const result = step as SequenceStep
  if (step.conditions && typeof step.conditions === "object") {
    const config = step.conditions as Record<string, any>
    if (config.waitUntilConfig) result.waitUntilConfig = config.waitUntilConfig
    if (config.exitTriggerConfig) result.exitTriggerConfig = config.exitTriggerConfig
    if (config.manualReviewConfig) result.manualReviewConfig = config.manualReviewConfig
    if (config.abSplitConfig) result.abSplitConfig = config.abSplitConfig
    if (config.behaviorBranchConfig) result.behaviorBranchConfig = config.behaviorBranchConfig
    if (config.multiChannelConfig) result.multiChannelConfig = config.multiChannelConfig
    if (config.randomVariantConfig) result.randomVariantConfig = config.randomVariantConfig
    if (config.contentReferenceConfig) result.contentReferenceConfig = config.contentReferenceConfig
    if (config.voicemailDropConfig) result.voicemailDropConfig = config.voicemailDropConfig
    if (config.directMailConfig) result.directMailConfig = config.directMailConfig
  }

  return result
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
  const updateData: Record<string, unknown> = {}

  // Standard fields
  if (data.order !== undefined) updateData.order = data.order
  if (data.stepType !== undefined) updateData.stepType = data.stepType
  if (data.delayValue !== undefined) updateData.delayValue = data.delayValue
  if (data.delayUnit !== undefined) updateData.delayUnit = data.delayUnit
  if (data.subject !== undefined) updateData.subject = data.subject
  if (data.body !== undefined) updateData.body = data.body
  if (data.bodyHtml !== undefined) updateData.bodyHtml = data.bodyHtml
  if (data.templateId !== undefined) updateData.templateId = data.templateId
  if (data.spintaxEnabled !== undefined) updateData.spintaxEnabled = data.spintaxEnabled
  if (data.skipIfReplied !== undefined) updateData.skipIfReplied = data.skipIfReplied
  if (data.skipIfBounced !== undefined) updateData.skipIfBounced = data.skipIfBounced
  if (data.linkedInAction !== undefined) updateData.linkedInAction = data.linkedInAction
  if (data.linkedInMessage !== undefined) updateData.linkedInMessage = data.linkedInMessage
  if (data.callScript !== undefined) updateData.callScript = data.callScript
  if (data.callDuration !== undefined) updateData.callDuration = data.callDuration
  if (data.taskTitle !== undefined) updateData.taskTitle = data.taskTitle
  if (data.taskDescription !== undefined) updateData.taskDescription = data.taskDescription
  if (data.taskPriority !== undefined) updateData.taskPriority = data.taskPriority
  if (data.internalNotes !== undefined) updateData.internalNotes = data.internalNotes

  // Handle variables JSON
  if ("variables" in data) {
    updateData.variables = data.variables === null ? Prisma.JsonNull : data.variables
  }

  // Handle node configs - merge into conditions JSON
  const nodeConfigKeys = [
    "waitUntilConfig",
    "exitTriggerConfig",
    "manualReviewConfig",
    "abSplitConfig",
    "behaviorBranchConfig",
    "multiChannelConfig",
    "randomVariantConfig",
    "contentReferenceConfig",
    "voicemailDropConfig",
    "directMailConfig",
  ]

  const hasNodeConfig = nodeConfigKeys.some((key) => key in data)

  if (hasNodeConfig || "conditions" in data) {
    // Get existing step to preserve other configs
    const existingStep = await db.sequenceStep.findUnique({ where: { id: stepId } })
    const existingConfig = (existingStep?.conditions as Record<string, any>) || {}

    const newConfig = { ...existingConfig }

    // Preserve standard conditions
    if (data.conditions?.sendIf) {
      newConfig.sendIf = data.conditions.sendIf
    }
    if (data.conditions?.logicOperator) {
      newConfig.logicOperator = data.conditions.logicOperator
    }

    // Update node-specific configs
    nodeConfigKeys.forEach((key) => {
      if (key in data) {
        newConfig[key] = (data as any)[key]
      }
    })

    updateData.conditions = Object.keys(newConfig).length > 0 ? newConfig : Prisma.JsonNull
  }

  const step = await db.sequenceStep.update({
    where: { id: stepId },
    data: updateData,
    include: {
      variants: true,
    },
  })

  revalidatePath(`/sequences/${sequenceId}`)

  // Map configs back to step object
  const result = step as SequenceStep
  if (step.conditions && typeof step.conditions === "object") {
    const config = step.conditions as Record<string, any>
    if (config.waitUntilConfig) result.waitUntilConfig = config.waitUntilConfig
    if (config.exitTriggerConfig) result.exitTriggerConfig = config.exitTriggerConfig
    if (config.manualReviewConfig) result.manualReviewConfig = config.manualReviewConfig
    if (config.abSplitConfig) result.abSplitConfig = config.abSplitConfig
    if (config.behaviorBranchConfig) result.behaviorBranchConfig = config.behaviorBranchConfig
    if (config.multiChannelConfig) result.multiChannelConfig = config.multiChannelConfig
    if (config.randomVariantConfig) result.randomVariantConfig = config.randomVariantConfig
    if (config.contentReferenceConfig) result.contentReferenceConfig = config.contentReferenceConfig
    if (config.voicemailDropConfig) result.voicemailDropConfig = config.voicemailDropConfig
    if (config.directMailConfig) result.directMailConfig = config.directMailConfig
  }

  return result
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

  return enrollments.map((enrollment) => ({
    ...enrollment,
    prospect: prospectMap.get(enrollment.prospectId) || null,
  })) as any
}

// export async function getSequenceEnrollments(sequenceId: string, userId: string): Promise<any[]> {
//   // Verify ownership
//   const sequence = await db.sequence.findFirst({
//     where: { id: sequenceId, userId },
//   })

//   if (!sequence) throw new Error("Sequence not found")

//   const enrollments = await db.sequenceEnrollment.findMany({
//     where: { sequenceId },
//     include: {
//       prospect: {
//         select: {
//           id: true,
//           firstName: true,
//           lastName: true,
//           email: true,
//           company: true,
//           title: true,
//           avatarUrl: true,
//           linkedinUrl: true,
//         },
//       },
//     },
//     orderBy: { enrolledAt: "desc" },
//   })

//   // Calculate stats for each enrollment
//   return enrollments.map((enrollment) => ({
//     id: enrollment.id,
//     prospectId: enrollment.prospectId,
//     status: enrollment.status,
//     currentStepIndex: enrollment.currentStepIndex,
//     enrolledAt: enrollment.enrolledAt,
//     completedAt: enrollment.completedAt,
//     lastActivityAt: enrollment.lastActivityAt,
//     prospect: enrollment.prospect,
//     stats: {
//       emailsSent: enrollment.emailsSent || 0,
//       emailsOpened: enrollment.emailsOpened || 0,
//       linksClicked: enrollment.linksClicked || 0,
//     },
//   }))
// }

export async function getSequenceEnrollments(sequenceId: string, userId: string): Promise<any[]> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })

  if (!sequence) throw new Error("Sequence not found")

  const enrollments = await db.sequenceEnrollment.findMany({
    where: { sequenceId },
    // REMOVE the include block entirely
    orderBy: { enrolledAt: "desc" },
  })

  // Fetch prospects separately
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
      linkedinUrl: true,
    },
  })

  // Create a map for quick lookup
  const prospectMap = new Map(prospects.map((p) => [p.id, p]))

  // Calculate stats for each enrollment
  return enrollments.map((enrollment) => ({
    id: enrollment.id,
    prospectId: enrollment.prospectId,
    status: enrollment.status,
    currentStepIndex: enrollment.currentStepIndex,
    enrolledAt: enrollment.enrolledAt,
    completedAt: enrollment.completedAt,
    lastActivityAt: enrollment.lastActivityAt,
    prospect: prospectMap.get(enrollment.prospectId) || null,
    stats: {
      emailsSent: enrollment.emailsSent || 0,
      emailsOpened: enrollment.emailsOpened || 0,
      linksClicked: enrollment.linksClicked || 0,
    },
  }))
}













export async function createEnrollment(
  sequenceId: string,
  userId: string,
  prospectId: string,
): Promise<SequenceEnrollment> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

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

export async function removeEnrollmentOLD(enrollmentId: string, sequenceId: string, userId: string): Promise<void> {
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

// Removed sequenceId and userId from parameters. Verified ownership through sequence.
export async function pauseEnrollment(enrollmentId: string, userId: string): Promise<void> {
  // Verify ownership through sequence
  const enrollment = await db.sequenceEnrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      sequence: { select: { userId: true } },
    },
  })

  if (!enrollment || enrollment.sequence.userId !== userId) {
    throw new Error("Enrollment not found")
  }

  await db.sequenceEnrollment.update({
    where: { id: enrollmentId },
    data: {
      status: "PAUSED",
      pausedAt: new Date(),
    },
  })
}

// Removed sequenceId and userId from parameters. Verified ownership through sequence.
export async function resumeEnrollment(enrollmentId: string, userId: string): Promise<void> {
  // Verify ownership through sequence
  const enrollment = await db.sequenceEnrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      sequence: { select: { userId: true } },
    },
  })

  if (!enrollment || enrollment.sequence.userId !== userId) {
    throw new Error("Enrollment not found")
  }

  await db.sequenceEnrollment.update({
    where: { id: enrollmentId },
    data: {
      status: "ACTIVE",
      pausedAt: null,
      resumedAt: new Date(),
    },
  })
}

// Removed sequenceId and userId from parameters. Verified ownership through sequence.
export async function removeEnrollment(enrollmentId: string, userId: string): Promise<void> {
  // Verify ownership through sequence
  const enrollment = await db.sequenceEnrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      sequence: { select: { userId: true, id: true } },
    },
  })

  if (!enrollment || enrollment.sequence.userId !== userId) {
    throw new Error("Enrollment not found")
  }

  await db.sequenceEnrollment.delete({
    where: { id: enrollmentId },
  })

  // Update sequence enrollment count
  await db.sequence.update({
    where: { id: enrollment.sequence.id },
    data: {
      totalEnrolled: { decrement: 1 },
    },
  })
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
  dailyStats: Array<{
    date: string
    sent: number
    opened: number
    clicked: number
    replied: number
  }>
  previousWeekTotals: {
    totalSent: number
    totalOpened: number
    totalClicked: number
    totalReplied: number
  }
  steps: SequenceStep[]
}> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  // Get all enrollments for this sequence
  const enrolledProspects = await db.sequenceEnrollment.findMany({
    where: { sequenceId },
    select: { prospectId: true },
  })
  const prospectIds = enrolledProspects.map((e) => e.prospectId)

  // Sync step stats from EmailLog if we have enrollments
  if (prospectIds.length > 0) {
    const steps = await db.sequenceStep.findMany({
      where: { sequenceId },
      orderBy: { order: "asc" },
      include: { variants: true },
    })

    for (const step of steps) {
      const emailLogs = await db.emailLog.findMany({
        where: {
          prospectId: { in: prospectIds },
          ...(step.subject ? { subject: { contains: step.subject } } : {}),
        },
      })

      // Calculate step stats from email logs
      const stepStats = emailLogs.reduce(
        (acc, log) => {
          acc.sent += 1
          if (log.status === "DELIVERED") acc.delivered += 1
          if (log.openedAt || log.opens > 0 || log.clickedAt || log.clicks > 0) acc.opened += 1
          if (log.clickedAt || log.clicks > 0) acc.clicked += 1
          if (log.repliedAt) acc.replied += 1
          if (log.bouncedAt) acc.bounced += 1
          return acc
        },
        { sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0, bounced: 0 },
      )

      // Update step in database if stats changed
      if (
        step.sent !== stepStats.sent ||
        step.opened !== stepStats.opened ||
        step.clicked !== stepStats.clicked ||
        step.replied !== stepStats.replied ||
        step.bounced !== stepStats.bounced
      ) {
        await db.sequenceStep.update({
          where: { id: step.id },
          data: stepStats,
        })
      }
    }
  }

  // Get aggregate totals from sequence steps (now with updated data)
  const steps = await db.sequenceStep.findMany({
    where: { sequenceId },
    orderBy: { order: "asc" },
    include: { variants: true },
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

  // Get enrollments to find the associated campaign
  const enrollments = await db.sequenceEnrollment.findMany({
    where: { sequenceId },
    select: { prospectId: true },
    take: 1,
  })

  let dailyStats: Array<{ date: string; sent: number; opened: number; clicked: number; replied: number }> = []
  let previousWeekTotals = { totalSent: 0, totalOpened: 0, totalClicked: 0, totalReplied: 0 }

  // Try to get daily analytics data from Analytics table via Campaign
  if (enrollments.length > 0) {
    const prospect = await db.prospect.findUnique({
      where: { id: enrollments[0].prospectId },
      select: { campaignId: true },
    })

    if (prospect?.campaignId) {
      // Get last 7 days of analytics
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const fourteenDaysAgo = new Date()
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

      const analyticsData = await db.analytics.findMany({
        where: {
          campaignId: prospect.campaignId,
          date: { gte: sevenDaysAgo },
        },
        orderBy: { date: "asc" },
      })

      // Get previous week data for comparison
      const previousWeekData = await db.analytics.findMany({
        where: {
          campaignId: prospect.campaignId,
          date: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
        },
      })

      previousWeekTotals = previousWeekData.reduce(
        (acc, day) => ({
          totalSent: acc.totalSent + day.emailsSent,
          totalOpened: acc.totalOpened + day.emailsOpened,
          totalClicked: acc.totalClicked + day.emailsClicked,
          totalReplied: acc.totalReplied + day.emailsReplied,
        }),
        { totalSent: 0, totalOpened: 0, totalClicked: 0, totalReplied: 0 },
      )

      dailyStats = analyticsData.map((day) => ({
        date: day.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        sent: day.emailsSent,
        opened: day.emailsOpened,
        clicked: day.emailsClicked,
        replied: day.emailsReplied,
      }))
    }
  }

  // If no Analytics data available, fall back to EmailLog aggregation
  if (dailyStats.length === 0 && prospectIds.length > 0) {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Query EmailLog for daily stats
    const emailLogs = await db.emailLog.findMany({
      where: {
        prospectId: { in: prospectIds },
        createdAt: { gte: sevenDaysAgo },
      },
      select: {
        createdAt: true,
        status: true,
        opens: true,
        clicks: true,
      },
    })

    // Group by date
    const dailyMap = new Map<string, { sent: number; opened: number; clicked: number; replied: number }>()

    emailLogs.forEach((log) => {
      const dateKey = log.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      const stats = dailyMap.get(dateKey) || { sent: 0, opened: 0, clicked: 0, replied: 0 }

      stats.sent += 1
      if (log.opens > 0) stats.opened += 1
      if (log.clicks > 0) stats.clicked += 1
      if (log.status === "REPLIED") stats.replied += 1

      dailyMap.set(dateKey, stats)
    })

    // Convert to array and fill missing days
    dailyStats = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateKey = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      const existingStats = dailyMap.get(dateKey)

      dailyStats.push({
        date: dateKey,
        sent: existingStats?.sent || 0,
        opened: existingStats?.opened || 0,
        clicked: existingStats?.clicked || 0,
        replied: existingStats?.replied || 0,
      })
    }
  }

  return {
    ...totals,
    openRate: totals.totalSent > 0 ? (totals.totalOpened / totals.totalSent) * 100 : 0,
    clickRate: totals.totalSent > 0 ? (totals.totalClicked / totals.totalSent) * 100 : 0,
    replyRate: totals.totalSent > 0 ? (totals.totalReplied / totals.totalSent) * 100 : 0,
    bounceRate: totals.totalSent > 0 ? (totals.totalBounced / totals.totalSent) * 100 : 0,
    dailyStats,
    previousWeekTotals,
    steps: steps as SequenceStep[],
  }
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

// ===========================================
// BATCH SAVE OPERATIONS
// ===========================================

export async function batchSaveSequenceAndSteps(
  sequenceId: string,
  userId: string,
  sequenceUpdates: Partial<Sequence>,
  stepUpdates: Map<string, Partial<SequenceStep>> | { [key: string]: Partial<SequenceStep> },
  newSteps: SequenceStep[],
  deletedStepIds: string[],
): Promise<{ sequence: Sequence; steps: SequenceStep[] }> {
  // Verify ownership
  const sequence = await db.sequence.findFirst({
    where: { id: sequenceId, userId },
  })
  if (!sequence) throw new Error("Sequence not found")

  // Convert Map to object if needed
  const stepUpdatesObj = stepUpdates instanceof Map ? Object.fromEntries(stepUpdates) : stepUpdates

  // Use a transaction for atomicity
  const result = await db.$transaction(async (tx) => {
    // 1. Update sequence settings
    if (Object.keys(sequenceUpdates).length > 0) {
      const { steps: _steps, ...updateData } = sequenceUpdates as any
      await tx.sequence.update({
        where: { id: sequenceId },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
      })
    }

    // 2. Delete removed steps
    if (deletedStepIds.length > 0) {
      await tx.sequenceStep.deleteMany({
        where: { id: { in: deletedStepIds } },
      })
    }

    // 3. Update existing steps
    for (const [stepId, updates] of Object.entries(stepUpdatesObj)) {
      if (!stepId.startsWith("temp_")) {
        const { variants: _v, ...stepData } = updates as any

        // Prepare update data
        const updateData: Record<string, any> = {}

        // Copy standard fields
        const standardFields = [
          "order",
          "stepType",
          "delayValue",
          "delayUnit",
          "subject",
          "body",
          "bodyHtml",
          "templateId",
          "spintaxEnabled",
          "skipIfReplied",
          "skipIfBounced",
          "linkedInAction",
          "linkedInMessage",
          "callScript",
          "callDuration",
          "taskTitle",
          "taskDescription",
          "taskPriority",
          "internalNotes",
          "isEnabled",
        ]

        standardFields.forEach((field) => {
          if (field in stepData) {
            updateData[field] = stepData[field]
          }
        })

        // Handle JSON fields
        if ("variables" in stepData) {
          updateData.variables = stepData.variables === null ? Prisma.JsonNull : stepData.variables
        }

        // Handle node configs
        const nodeConfigKeys = [
          "waitUntilConfig",
          "exitTriggerConfig",
          "manualReviewConfig",
          "abSplitConfig",
          "behaviorBranchConfig",
          "multiChannelConfig",
          "randomVariantConfig",
          "contentReferenceConfig",
          "voicemailDropConfig",
          "directMailConfig",
          "conditions",
        ]

        const hasNodeConfig = nodeConfigKeys.some((key) => key in stepData)
        if (hasNodeConfig) {
          const existingStep = await tx.sequenceStep.findUnique({ where: { id: stepId } })
          const existingConfig = (existingStep?.conditions as Record<string, any>) || {}
          const newConfig = { ...existingConfig }

          nodeConfigKeys.forEach((key) => {
            if (key in stepData) {
              if (key === "conditions" && stepData.conditions?.sendIf) {
                newConfig.sendIf = stepData.conditions.sendIf
              } else if (key !== "conditions") {
                newConfig[key] = stepData[key]
              }
            }
          })

          updateData.conditions = Object.keys(newConfig).length > 0 ? newConfig : Prisma.JsonNull
        }

        if (Object.keys(updateData).length > 0) {
          await tx.sequenceStep.update({
            where: { id: stepId },
            data: updateData,
          })
        }
      }
    }

    // 4. Create new steps
    for (const step of newSteps) {
      const { id: _id, variants: _v, sequenceId: _sId, createdAt: _c, updatedAt: _u, ...stepData } = step

      // Build conditions JSON for node configs
      const nodeConfig: Record<string, any> = {}
      const nodeConfigKeys = [
        "waitUntilConfig",
        "exitTriggerConfig",
        "manualReviewConfig",
        "abSplitConfig",
        "behaviorBranchConfig",
        "multiChannelConfig",
        "randomVariantConfig",
        "contentReferenceConfig",
        "voicemailDropConfig",
        "directMailConfig",
      ]

      nodeConfigKeys.forEach((key) => {
        if ((stepData as any)[key]) {
          nodeConfig[key] = (stepData as any)[key]
          delete (stepData as any)[key]
        }
      })

      await tx.sequenceStep.create({
        data: {
          ...stepData,
          sequenceId,
          variables: stepData.variables === null ? Prisma.JsonNull : stepData.variables || Prisma.JsonNull,
          conditions: Object.keys(nodeConfig).length > 0 ? nodeConfig : Prisma.JsonNull,
        },
      })
    }

    // 5 Update step count
    const stepCount = await tx.sequenceStep.count({ where: { sequenceId } })
    await tx.sequence.update({
      where: { id: sequenceId },
      data: { totalSteps: stepCount },
    })

    // 6. Return updated data
    const updatedSequence = await tx.sequence.findUnique({
      where: { id: sequenceId },
      include: {
        steps: {
          orderBy: { order: "asc" },
          include: { variants: true },
        },
      },
    })

    return updatedSequence
  })

  revalidatePath(`/sequences/${sequenceId}`)
  revalidatePath("/sequences")

  // Map node configs back to steps
  const mappedSteps =
    result?.steps.map((step) => {
      const mapped = step as SequenceStep
      if (step.conditions && typeof step.conditions === "object") {
        const config = step.conditions as Record<string, any>
        if (config.waitUntilConfig) mapped.waitUntilConfig = config.waitUntilConfig
        if (config.exitTriggerConfig) mapped.exitTriggerConfig = config.exitTriggerConfig
        if (config.manualReviewConfig) mapped.manualReviewConfig = config.manualReviewConfig
        if (config.abSplitConfig) mapped.abSplitConfig = config.abSplitConfig
        if (config.behaviorBranchConfig) mapped.behaviorBranchConfig = config.behaviorBranchConfig
        if (config.multiChannelConfig) mapped.multiChannelConfig = config.multiChannelConfig
        if (config.randomVariantConfig) mapped.randomVariantConfig = config.randomVariantConfig
        if (config.contentReferenceConfig) mapped.contentReferenceConfig = config.contentReferenceConfig
        if (config.voicemailDropConfig) mapped.voicemailDropConfig = config.voicemailDropConfig
        if (config.directMailConfig) mapped.directMailConfig = config.directMailConfig
      }
      return mapped
    }) || []

  return {
    sequence: result as Sequence,
    steps: mappedSteps,
  }
}
