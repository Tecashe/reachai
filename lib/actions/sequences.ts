// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"

// export async function getSequences(campaignId?: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const where: any = {
//     campaign: {
//       userId: user.id,
//     },
//   }

//   if (campaignId) {
//     where.campaignId = campaignId
//   }

//   const sequences = await db.emailSequence.findMany({
//     where,
//     include: {
//       campaign: {
//         select: {
//           name: true,
//         },
//       },
//       template: {
//         select: {
//           name: true,
//           subject: true,
//         },
//       },
//     },
//     orderBy: [{ campaignId: "asc" }, { stepNumber: "asc" }],
//   })

//   return sequences
// }

// export async function createSequence(data: {
//   campaignId: string
//   templateId: string
//   stepNumber: number
//   delayDays: number
//   sendOnlyIfNotReplied: boolean
//   sendOnlyIfNotOpened: boolean
// }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   // Verify campaign belongs to user
//   const campaign = await db.campaign.findUnique({
//     where: { id: data.campaignId, userId: user.id },
//   })

//   if (!campaign) throw new Error("Campaign not found")

//   const sequence = await db.emailSequence.create({
//     data,
//   })

//   revalidatePath("/dashboard/sequences")
//   revalidatePath(`/dashboard/campaigns/${data.campaignId}`)

//   return sequence
// }

// export async function deleteSequence(sequenceId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   await db.emailSequence.delete({
//     where: {
//       id: sequenceId,
//       campaign: {
//         userId: user.id,
//       },
//     },
//   })

//   revalidatePath("/dashboard/sequences")
// }


// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"

// export async function getSequences(campaignId?: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const where: any = {
//     campaign: {
//       userId: user.id,
//     },
//   }

//   if (campaignId) {
//     where.campaignId = campaignId
//   }

//   const sequences = await db.emailSequence.findMany({
//     where,
//     include: {
//       campaign: {
//         select: {
//           name: true,
//         },
//       },
//       template: {
//         select: {
//           name: true,
//           subject: true,
//         },
//       },
//     },
//     orderBy: [{ campaignId: "asc" }, { stepNumber: "asc" }],
//   })

//   return sequences
// }

// export async function createSequence(data: {
//   name?: string
//   description?: string
//   campaignId: string
//   templateId: string
//   stepNumber: number
//   delayDays: number
//   sendOnlyIfNotReplied?: boolean
//   sendOnlyIfNotOpened?: boolean
// }) {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) return { success: false, error: "User not found" }

//   // Verify campaign belongs to user
//   const campaign = await db.campaign.findUnique({
//     where: { id: data.campaignId, userId: user.id },
//   })

//   if (!campaign) return { success: false, error: "Campaign not found" }

//   try {
//     const sequence = await db.emailSequence.create({
//       data: {
//         campaignId: data.campaignId,
//         templateId: data.templateId,
//         stepNumber: data.stepNumber,
//         delayDays: data.delayDays,
//         sendOnlyIfNotReplied: data.sendOnlyIfNotReplied ?? true,
//         sendOnlyIfNotOpened: data.sendOnlyIfNotOpened ?? false,
//       },
//     })

//     revalidatePath("/dashboard/sequences")
//     revalidatePath(`/dashboard/campaigns/${data.campaignId}`)

//     return { success: true, sequence }
//   } catch (error) {
//     console.error("[builtbycashe] Error creating sequence:", error)
//     return { success: false, error: "Failed to create sequence" }
//   }
// }

// export async function deleteSequence(sequenceId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   await db.emailSequence.delete({
//     where: {
//       id: sequenceId,
//       campaign: {
//         userId: user.id,
//       },
//     },
//   })

//   revalidatePath("/dashboard/sequences")
// }


"use server"

import { db } from "@/lib/db"
import { getCurrentUserFromDb } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getSequences(campaignId?: string) {
  const user = await getCurrentUserFromDb()
  if (!user) throw new Error("Unauthorized")

  const where: any = {
    campaign: {
      userId: user.id,
    },
  }

  if (campaignId) {
    where.campaignId = campaignId
  }

  const sequences = await db.emailSequence.findMany({
    where,
    include: {
      campaign: {
        select: {
          name: true,
        },
      },
      template: {
        select: {
          name: true,
          subject: true,
        },
      },
    },
    orderBy: [{ campaignId: "asc" }, { stepNumber: "asc" }],
  })

  return sequences
}

export async function createSequence(data: {
  name?: string
  description?: string
  campaignId: string
  templateId: string
  stepNumber: number
  delayDays: number
  sendOnlyIfNotReplied?: boolean
  sendOnlyIfNotOpened?: boolean
}) {
  const user = await getCurrentUserFromDb()
  if (!user) return { success: false, error: "Unauthorized" }

  // Verify campaign belongs to user
  const campaign = await db.campaign.findUnique({
    where: { id: data.campaignId, userId: user.id },
  })

  if (!campaign) return { success: false, error: "Campaign not found" }

  try {
    const sequence = await db.emailSequence.create({
      data: {
        campaignId: data.campaignId,
        templateId: data.templateId,
        stepNumber: data.stepNumber,
        delayDays: data.delayDays,
        sendOnlyIfNotReplied: data.sendOnlyIfNotReplied ?? true,
        sendOnlyIfNotOpened: data.sendOnlyIfNotOpened ?? false,
      },
    })

    revalidatePath("/dashboard/sequences")
    revalidatePath(`/dashboard/campaigns/${data.campaignId}`)

    return { success: true, sequence }
  } catch (error) {
    console.error("[sequences] Error creating sequence:", error)
    return { success: false, error: "Failed to create sequence" }
  }
}

export async function deleteSequence(sequenceId: string) {
  const user = await getCurrentUserFromDb()
  if (!user) throw new Error("Unauthorized")

  await db.emailSequence.delete({
    where: {
      id: sequenceId,
      campaign: {
        userId: user.id,
      },
    },
  })

  revalidatePath("/dashboard/sequences")
}

export async function addSequenceStep({
  campaignId,
  templateId,
  subject,
  body,
  delayDays,
  sendOnlyIfNotReplied,
  sendOnlyIfNotOpened,
  afterStepNumber,
}: {
  campaignId: string
  templateId?: string
  subject?: string
  body?: string
  delayDays: number
  sendOnlyIfNotReplied: boolean
  sendOnlyIfNotOpened: boolean
  afterStepNumber?: number
}) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    // Verify campaign ownership
    const campaign = await db.campaign.findFirst({
      where: {
        id: campaignId,
        userId: user.id,
      },
      include: {
        emailSequences: {
          orderBy: { stepNumber: "asc" },
        },
      },
    })

    if (!campaign) {
      return { success: false, error: "Campaign not found" }
    }

    let finalTemplateId = templateId

    // If no templateId, create a new template from the provided subject/body
    if (!templateId && subject && body) {
      const newTemplate = await db.emailTemplate.create({
        data: {
          name: subject.substring(0, 50),
          subject,
          body,
          userId: user.id,
          category: "custom",
          templateType: "TEXT",
        },
      })
      finalTemplateId = newTemplate.id
    }

    if (!finalTemplateId) {
      return { success: false, error: "Template is required" }
    }

    // Calculate the new step number
    let newStepNumber: number
    if (afterStepNumber !== undefined) {
      newStepNumber = afterStepNumber + 1
      // Shift all steps after this position
      await db.emailSequence.updateMany({
        where: {
          campaignId,
          stepNumber: { gte: newStepNumber },
        },
        data: {
          stepNumber: { increment: 1 },
        },
      })
    } else {
      // Add at the end
      newStepNumber = campaign.emailSequences.length + 1
    }

    // Create the new sequence step
    const newStep = await db.emailSequence.create({
      data: {
        campaignId,
        templateId: finalTemplateId,
        stepNumber: newStepNumber,
        delayDays,
        sendOnlyIfNotReplied,
        sendOnlyIfNotOpened,
      },
      include: {
        template: true,
      },
    })

    revalidatePath(`/dashboard/sequences/${campaignId}`)

    return { success: true, step: newStep }
  } catch (error) {
    console.error("Failed to add sequence step:", error)
    return { success: false, error: "Failed to add step" }
  }
}

export async function deleteSequenceStep(stepId: string) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    // Get the step to delete
    const step = await db.emailSequence.findUnique({
      where: { id: stepId },
      include: {
        campaign: true,
      },
    })

    if (!step || step.campaign.userId !== user.id) {
      return { success: false, error: "Step not found" }
    }

    // Delete the step
    await db.emailSequence.delete({
      where: { id: stepId },
    })

    // Reorder remaining steps
    await db.emailSequence.updateMany({
      where: {
        campaignId: step.campaignId,
        stepNumber: { gt: step.stepNumber },
      },
      data: {
        stepNumber: { decrement: 1 },
      },
    })

    revalidatePath(`/dashboard/sequences/${step.campaignId}`)

    return { success: true }
  } catch (error) {
    console.error("Failed to delete sequence step:", error)
    return { success: false, error: "Failed to delete step" }
  }
}

export async function duplicateSequenceStep(stepId: string) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    // Get the step to duplicate
    const step = await db.emailSequence.findUnique({
      where: { id: stepId },
      include: {
        campaign: true,
        template: true,
      },
    })

    if (!step || step.campaign.userId !== user.id) {
      return { success: false, error: "Step not found" }
    }

    // Shift all steps after this position
    const newStepNumber = step.stepNumber + 1
    await db.emailSequence.updateMany({
      where: {
        campaignId: step.campaignId,
        stepNumber: { gte: newStepNumber },
      },
      data: {
        stepNumber: { increment: 1 },
      },
    })

    // Create the duplicate
    const duplicatedStep = await db.emailSequence.create({
      data: {
        campaignId: step.campaignId,
        templateId: step.templateId,
        stepNumber: newStepNumber,
        delayDays: step.delayDays,
        sendOnlyIfNotReplied: step.sendOnlyIfNotReplied,
        sendOnlyIfNotOpened: step.sendOnlyIfNotOpened,
      },
      include: {
        template: true,
      },
    })

    revalidatePath(`/dashboard/sequences/${step.campaignId}`)

    return { success: true, step: duplicatedStep }
  } catch (error) {
    console.error("Failed to duplicate sequence step:", error)
    return { success: false, error: "Failed to duplicate step" }
  }
}
