"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import type { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function createAutomation(data: {
  name: string
  description?: string
  instagramAccountId?: string
  triggers: Array<{
    type: string
    conditions: any
    order: number
  }>
  triggerLogic: "AND" | "OR"
  actions: Array<{
    type: string
    content: any
    order: number
    parentActionId?: string | null
    branchType?: "true" | "false" | null
  }>
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const automation = await prisma.automation.create({
    data: {
      userId: user.id,
      name: data.name,
      description: data.description,
      instagramAccountId: data.instagramAccountId,
      status: "draft",
      triggerLogic: data.triggerLogic,
      triggers: {
        create: data.triggers.map((trigger) => ({
          type: trigger.type,
          conditions: trigger.conditions as Prisma.InputJsonValue,
          order: trigger.order,
        })),
      },
      actions: {
        create: data.actions.map((action) => ({
          type: action.type,
          content: action.content as Prisma.InputJsonValue,
          order: action.order,
          parentActionId: action.parentActionId,
          branchType: action.branchType,
        })),
      },
    },
    include: {
      triggers: { orderBy: { order: "asc" } },
      actions: { orderBy: { order: "asc" } },
      instagramAccount: true,
    },
  })

  revalidatePath("/automations")
  return automation
}

export async function updateAutomation(
  automationId: string,
  data: {
    name?: string
    description?: string
    instagramAccountId?: string
    triggerLogic?: "AND" | "OR"
    triggers?: Array<{
      id?: string
      type: string
      conditions: any
      order: number
    }>
    actions?: Array<{
      id?: string
      type: string
      content: any
      order: number
      parentActionId?: string | null
      branchType?: "true" | "false" | null
    }>
  },
) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const automation = await prisma.automation.findFirst({
    where: { id: automationId, userId: user.id },
    include: { triggers: true, actions: true },
  })
  if (!automation) throw new Error("Automation not found")

  const updated = await prisma.automation.update({
    where: { id: automationId },
    data: {
      name: data.name,
      description: data.description,
      instagramAccountId: data.instagramAccountId,
      triggerLogic: data.triggerLogic,
    },
  })

  if (data.triggers) {
    await prisma.automationTrigger.deleteMany({
      where: { automationId },
    })
    await prisma.automationTrigger.createMany({
      data: data.triggers.map((trigger) => ({
        automationId,
        type: trigger.type,
        conditions: trigger.conditions as Prisma.InputJsonValue,
        order: trigger.order,
      })),
    })
  }

  if (data.actions) {
    await prisma.automationAction.deleteMany({
      where: { automationId },
    })
    await prisma.automationAction.createMany({
      data: data.actions.map((action) => ({
        automationId,
        type: action.type,
        content: action.content as Prisma.InputJsonValue,
        order: action.order,
        parentActionId: action.parentActionId,
        branchType: action.branchType,
      })),
    })
  }

  revalidatePath("/automations")
  revalidatePath(`/automations/${automationId}`)
  return updated
}

export async function toggleAutomationStatus(automationId: string, isActive: boolean) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const automation = await prisma.automation.findFirst({
    where: { id: automationId, userId: user.id },
  })
  if (!automation) throw new Error("Automation not found")

  await prisma.automation.update({
    where: { id: automationId },
    data: {
      isActive,
      status: isActive ? "active" : "paused",
    },
  })

  revalidatePath("/automations")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteAutomation(automationId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const automation = await prisma.automation.findFirst({
    where: { id: automationId, userId: user.id },
  })
  if (!automation) throw new Error("Automation not found")

  await prisma.automation.delete({
    where: { id: automationId },
  })

  revalidatePath("/automations")
  return { success: true }
}

export async function getAutomations() {
  const { userId } = await auth()
  if (!userId) return []

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return []

  const automations = await prisma.automation.findMany({
    where: { userId: user.id },
    include: {
      triggers: { orderBy: { order: "asc" } },
      actions: { orderBy: { order: "asc" } },
      instagramAccount: true,
      _count: {
        select: { executions: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return automations
}

export async function getAutomation(automationId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const automation = await prisma.automation.findFirst({
    where: { id: automationId, userId: user.id },
    include: {
      triggers: { orderBy: { order: "asc" } },
      actions: { orderBy: { order: "asc" } },
      instagramAccount: true,
      executions: {
        orderBy: { executedAt: "desc" },
        take: 10,
      },
    },
  })

  if (!automation) throw new Error("Automation not found")
  return automation
}

export async function duplicateAutomation(automationId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const original = await prisma.automation.findFirst({
    where: { id: automationId, userId: user.id },
    include: {
      triggers: { orderBy: { order: "asc" } },
      actions: { orderBy: { order: "asc" } },
    },
  })

  if (!original) throw new Error("Automation not found")

  const duplicate = await prisma.automation.create({
    data: {
      userId: user.id,
      name: `${original.name} (Copy)`,
      description: original.description,
      instagramAccountId: original.instagramAccountId,
      status: "draft",
      isActive: false,
      triggerLogic: original.triggerLogic,
      triggers: {
        create: original.triggers.map((t) => ({
          type: t.type,
          conditions: t.conditions as Prisma.InputJsonValue,
          order: t.order,
        })),
      },
      actions: {
        create: original.actions.map((a) => ({
          type: a.type,
          content: a.content as Prisma.InputJsonValue,
          order: a.order,
          parentActionId: a.parentActionId,
          branchType: a.branchType,
        })),
      },
    },
    include: {
      triggers: true,
      actions: true,
    },
  })

  revalidatePath("/automations")
  return duplicate
}

export async function getAutomationTemplates() {
  // Return predefined templates for quick setup
  return [
    {
      id: "welcome-dm",
      name: "Welcome New Followers",
      description: "Automatically send a welcome message when someone DMs you for the first time",
      category: "Engagement",
      triggers: [
        {
          type: "FIRST_MESSAGE",
          conditions: {},
          order: 0,
        },
      ],
      actions: [
        {
          type: "SEND_MESSAGE",
          content: {
            message: "Hey {name}! 👋 Thanks for reaching out. How can I help you today?",
          },
          order: 0,
        },
      ],
    },
    {
      id: "comment-to-dm",
      name: "Comment to DM",
      description: "Reply to comments and send a follow-up DM",
      category: "Lead Generation",
      triggers: [
        {
          type: "COMMENT",
          conditions: {
            postType: "any",
            keywords: [],
            matchType: "any",
          },
          order: 0,
        },
      ],
      actions: [
        {
          type: "REPLY_TO_COMMENT",
          content: {
            message: "Thanks for your comment! Check your DMs 💌",
          },
          order: 0,
        },
        {
          type: "SEND_MESSAGE",
          content: {
            message: "Hey {name}! I saw your comment. Here's what you asked for:",
          },
          order: 1,
        },
      ],
    },
    {
      id: "keyword-responder",
      name: "Keyword Auto-Responder",
      description: "Respond to specific keywords with automated messages",
      category: "Customer Support",
      triggers: [
        {
          type: "KEYWORD",
          conditions: {
            keywords: ["price", "cost", "how much"],
            matchType: "any",
          },
          order: 0,
        },
      ],
      actions: [
        {
          type: "SEND_MESSAGE",
          content: {
            message: "Thanks for asking about pricing! Here are our current rates:",
          },
          order: 0,
        },
      ],
    },
    {
      id: "ai-assistant",
      name: "AI-Powered Assistant",
      description: "Use AI to respond intelligently to all incoming messages",
      category: "AI",
      triggers: [
        {
          type: "DM_RECEIVED",
          conditions: {},
          order: 0,
        },
      ],
      actions: [
        {
          type: "AI_RESPONSE",
          content: {
            tone: "friendly",
            useKnowledgeBase: true,
            instructions: "Help customers with their questions about products and services",
            maxLength: 500,
          },
          order: 0,
        },
      ],
    },
  ]
}

export async function createFromTemplate(templateId: string, instagramAccountId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const templates = await getAutomationTemplates()
  const template = templates.find((t) => t.id === templateId)
  if (!template) throw new Error("Template not found")

  const automation = await prisma.automation.create({
    data: {
      userId: user.id,
      name: template.name,
      description: template.description,
      instagramAccountId,
      status: "draft",
      isActive: false,
      triggerLogic: "OR",
      triggers: {
        create: template.triggers.map((t) => ({
          type: t.type,
          conditions: t.conditions as Prisma.InputJsonValue,
          order: t.order,
        })),
      },
      actions: {
        create: template.actions.map((a) => ({
          type: a.type,
          content: a.content as Prisma.InputJsonValue,
          order: a.order,
        })),
      },
    },
    include: {
      triggers: true,
      actions: true,
      instagramAccount: true,
    },
  })

  revalidatePath("/automations")
  return automation
}
