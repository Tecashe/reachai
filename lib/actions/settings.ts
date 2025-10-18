// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"

// export async function updateProfile(formData: FormData) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const firstName = formData.get("firstName") as string
//   const lastName = formData.get("lastName") as string
//   const timezone = formData.get("timezone") as string

//   await db.user.update({
//     where: { id: user.id },
//     data: {
//       firstName,
//       lastName,
//       name: `${firstName} ${lastName}`,
//       timezone,
//     },
//   })

//   revalidatePath("/dashboard/settings")
// }

// export async function updateEmailSettings(formData: FormData) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const defaultFromName = formData.get("defaultFromName") as string
//   const defaultFromEmail = formData.get("defaultFromEmail") as string
//   const emailSignature = formData.get("emailSignature") as string

//   await db.user.update({
//     where: { id: user.id },
//     data: {
//       defaultFromName,
//       defaultFromEmail,
//       emailSignature,
//     },
//   })

//   revalidatePath("/dashboard/settings")
// }

// export async function getUser() {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   return user
// }

// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"

// export async function updateProfile(formData: FormData) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const firstName = formData.get("firstName") as string
//   const lastName = formData.get("lastName") as string
//   const timezone = formData.get("timezone") as string

//   await db.user.update({
//     where: { id: user.id },
//     data: {
//       firstName,
//       lastName,
//       name: `${firstName} ${lastName}`,
//       timezone,
//     },
//   })

//   revalidatePath("/dashboard/settings")
// }

// export async function updateEmailSettings(formData: FormData) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const defaultFromName = formData.get("defaultFromName") as string
//   const defaultFromEmail = formData.get("defaultFromEmail") as string
//   const emailSignature = formData.get("emailSignature") as string

//   await db.user.update({
//     where: { id: user.id },
//     data: {
//       defaultFromName,
//       defaultFromEmail,
//       emailSignature,
//     },
//   })

//   revalidatePath("/dashboard/settings")
// }

// export async function getUser() {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   return user
// }

// export async function getUserSettings() {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//     include: {
//       teamMembers: {
//         orderBy: { invitedAt: "desc" },
//       },
//     },
//   })

//   if (!user) throw new Error("User not found")

//   return {
//     user: {
//       id: user.id,
//       email: user.email,
//       name: user.name,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       imageUrl: user.imageUrl,
//       timezone: user.timezone,
//     },
//     emailSettings: {
//       defaultFromName: user.defaultFromName,
//       defaultFromEmail: user.defaultFromEmail,
//       emailSignature: user.emailSignature,
//     },
//     notificationSettings: {
//       // Add notification preferences here when schema is updated
//     },
//     teamMembers: user.teamMembers,
//   }
// }

"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const timezone = formData.get("timezone") as string

  await db.user.update({
    where: { id: user.id },
    data: {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      timezone,
    },
  })

  revalidatePath("/dashboard/settings")
}

export async function updateEmailSettings(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const defaultFromName = formData.get("defaultFromName") as string
  const defaultFromEmail = formData.get("defaultFromEmail") as string
  const emailSignature = formData.get("emailSignature") as string

  await db.user.update({
    where: { id: user.id },
    data: {
      defaultFromName,
      defaultFromEmail,
      emailSignature,
    },
  })

  revalidatePath("/dashboard/settings")
}

export async function getUser() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  return user
}

export async function getUserSettings() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      teamMembers: {
        orderBy: { invitedAt: "desc" },
      },
    },
  })

  if (!user) throw new Error("User not found")

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      timezone: user.timezone,
    },
    emailSettings: {
      defaultFromName: user.defaultFromName,
      defaultFromEmail: user.defaultFromEmail,
      emailSignature: user.emailSignature,
    },
    notificationSettings: {
      campaignUpdates: true,
      newReplies: true,
      weeklyReports: true,
      productUpdates: false,
      desktopNotifications: true,
      soundAlerts: false,
    },
    teamMembers: user.teamMembers.map((member) => ({
      id: member.id,
      email: member.email,
      role: member.role,
      status: member.status,
      invitedAt: member.invitedAt,
      acceptedAt: member.acceptedAt,
    })),
  }
}
