// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"

// export async function getTemplates() {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const templates = await db.emailTemplate.findMany({
//     where: { userId: user.id },
//     orderBy: { createdAt: "desc" },
//   })

//   return templates
// }

// export async function createTemplate(formData: FormData) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const name = formData.get("name") as string
//   const subject = formData.get("subject") as string
//   const body = formData.get("body") as string
//   const category = formData.get("category") as string

//   const template = await db.emailTemplate.create({
//     data: {
//       userId: user.id,
//       name,
//       subject,
//       body,
//       category: category as any,
//     },
//   })

//   revalidatePath("/dashboard/templates")
//   return template
// }

// export async function deleteTemplate(templateId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   await db.emailTemplate.delete({
//     where: { id: templateId, userId: user.id },
//   })

//   revalidatePath("/dashboard/templates")
// }

"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getTemplates() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const templates = await db.emailTemplate.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })

  return templates
}

export async function createTemplate(data: {
  name: string
  subject: string
  body: string
  category: string
  variables: string[]
}) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    // Extract variables from subject and body
    const variableRegex = /\{\{(\w+)\}\}/g
    const extractedVars = new Set<string>()

    const subjectMatches = data.subject.matchAll(variableRegex)
    for (const match of subjectMatches) {
      extractedVars.add(match[1])
    }

    const bodyMatches = data.body.matchAll(variableRegex)
    for (const match of bodyMatches) {
      extractedVars.add(match[1])
    }

    const template = await db.emailTemplate.create({
      data: {
        userId: user.id,
        name: data.name,
        subject: data.subject,
        body: data.body,
        category: data.category,
        variables: Array.from(extractedVars),
      },
    })

    revalidatePath("/dashboard/templates")
    return { success: true, template }
  } catch (error) {
    console.error("[v0] Error creating template:", error)
    return { success: false, error: "Failed to create template" }
  }
}

export async function deleteTemplate(templateId: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    await db.emailTemplate.delete({
      where: { id: templateId, userId: user.id },
    })

    revalidatePath("/dashboard/templates")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting template:", error)
    return { success: false, error: "Failed to delete template" }
  }
}
