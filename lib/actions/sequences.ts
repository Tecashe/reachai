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


"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getSequences(campaignId?: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

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
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

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
    console.error("[builtbycashe] Error creating sequence:", error)
    return { success: false, error: "Failed to create sequence" }
  }
}

export async function deleteSequence(sequenceId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

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
