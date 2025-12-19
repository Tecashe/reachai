

"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getSystemTemplates(industry?: string, search?: string) {
  console.log("[v0] getSystemTemplates called with:", { industry, search })

  try {
    const templates = await db.emailTemplate.findMany({
      where: {
        isSystemTemplate: true,
        ...(industry && industry !== "all" && { industry }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { category: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: { createdAt: "desc" },
    })

    console.log(`[v0] Found ${templates.length} system templates`)
    if (templates.length > 0) {
      console.log("[v0] First template:", {
        id: templates[0].id,
        name: templates[0].name,
        industry: templates[0].industry,
        hasThumbnail: !!templates[0].thumbnailUrl,
        hasPreview: !!templates[0].previewImageUrl,
      })
    }

    return templates.map((template) => ({
      ...template,
      avgClickRate: 0,
      totalSent: 0,
    }))
  } catch (error) {
    console.error("[v0] Error fetching system templates:", error)
    return []
  }
}

export async function cloneSystemTemplate(templateId: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    const systemTemplate = await db.emailTemplate.findUnique({
      where: { id: templateId, isSystemTemplate: true },
    })

    if (!systemTemplate) return { success: false, error: "System template not found" }

    const clonedTemplate = await db.emailTemplate.create({
      data: {
        userId: user.id,
        name: systemTemplate.name,
        description: systemTemplate.description,
        subject: systemTemplate.subject,
        body: systemTemplate.body,
        category: systemTemplate.category,
        variables: systemTemplate.variables || [],
        thumbnailUrl: systemTemplate.thumbnailUrl,
        previewImageUrl: systemTemplate.previewImageUrl,
        colorScheme: systemTemplate.colorScheme ? JSON.parse(JSON.stringify(systemTemplate.colorScheme)) : null,
        industry: systemTemplate.industry,
        tags: systemTemplate.tags || [],
        templateType: systemTemplate.templateType,
        isSystemTemplate: false,
      },
    })

    revalidatePath("/dashboard/templates")

    return {
      success: true,
      template: {
        ...clonedTemplate,
        avgClickRate: 0,
        totalSent: 0,
      },
    }
  } catch (error) {
    console.error("[v0] Error cloning system template:", error)
    return { success: false, error: "Failed to clone template" }
  }
}

export async function getTemplates() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const templates = await db.emailTemplate.findMany({
    where: {
      OR: [{ userId: user.id }, { isSystemTemplate: true }],
    },
    include: {
      templateCategories: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return templates.map((template) => ({
    ...template,
    avgClickRate: 0,
    totalSent: 0,
  }))
}

export async function getTemplatesByIndustry(industry: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    const templates = await db.emailTemplate.findMany({
      where: {
        OR: [{ userId: user.id }, { isSystemTemplate: true }],
        industry,
      },
      include: {
        templateCategories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { timesUsed: "desc" },
    })

    return {
      success: true,
      templates: templates.map((template) => ({
        ...template,
        avgClickRate: 0,
        totalSent: 0,
      })),
    }
  } catch (error) {
    console.error("Error fetching templates by industry:", error)
    return { success: false, error: "Failed to fetch templates" }
  }
}

export async function getFavoriteTemplates() {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    const templates = await db.emailTemplate.findMany({
      where: {
        userId: user.id,
        isFavorite: true,
      },
      include: {
        templateCategories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    return {
      success: true,
      templates: templates.map((template) => ({
        ...template,
        avgClickRate: 0,
        totalSent: 0,
      })),
    }
  } catch (error) {
    console.error("Error fetching favorite templates:", error)
    return { success: false, error: "Failed to fetch favorites" }
  }
}

export async function createTemplate(data: {
  name: string
  subject: string
  body: string
  category: string
  variables?: string[]
  industry?: string
  tags?: string[]
  thumbnailUrl?: string
  colorScheme?: any
  templateType?: string
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
        industry: data.industry,
        tags: data.tags || [],
        thumbnailUrl: data.thumbnailUrl,
        colorScheme: data.colorScheme ? JSON.parse(JSON.stringify(data.colorScheme)) : null,
        templateType: (data.templateType as any) || "TEXT",
        isSystemTemplate: false,
      },
    })

    revalidatePath("/dashboard/templates")

    return {
      success: true,
      template: {
        ...template,
        avgClickRate: 0,
        totalSent: 0,
      },
    }
  } catch (error) {
    console.error("Error creating template:", error)
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
    console.error("Error deleting template:", error)
    return { success: false, error: "Failed to delete template" }
  }
}

export async function updateTemplate(
  templateId: string,
  data: {
    name?: string
    subject?: string
    body?: string
    category?: string
    industry?: string
    tags?: string[]
    thumbnailUrl?: string
    colorScheme?: any
    editorBlocks?: any
  },
) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    // Extract variables if subject or body changed
    let variables: string[] | undefined
    if (data.subject || data.body) {
      const variableRegex = /\{\{(\w+)\}\}/g
      const extractedVars = new Set<string>()

      if (data.subject) {
        const subjectMatches = data.subject.matchAll(variableRegex)
        for (const match of subjectMatches) {
          extractedVars.add(match[1])
        }
      }

      if (data.body) {
        const bodyMatches = data.body.matchAll(variableRegex)
        for (const match of bodyMatches) {
          extractedVars.add(match[1])
        }
      }

      if (extractedVars.size > 0) {
        variables = Array.from(extractedVars)
      }
    }

    const updateData: any = {}

    if (data.name !== undefined) updateData.name = data.name
    if (data.subject !== undefined) updateData.subject = data.subject
    if (data.body !== undefined) updateData.body = data.body
    if (data.category !== undefined) updateData.category = data.category
    if (data.industry !== undefined) updateData.industry = data.industry
    if (data.tags !== undefined) updateData.tags = data.tags
    if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl
    if (variables !== undefined) updateData.variables = variables

    if ("colorScheme" in data) {
      updateData.colorScheme = data.colorScheme ? JSON.parse(JSON.stringify(data.colorScheme)) : null
    }
    if ("editorBlocks" in data) {
      updateData.editorBlocks = data.editorBlocks ? JSON.parse(JSON.stringify(data.editorBlocks)) : null
    }

    const template = await db.emailTemplate.update({
      where: { id: templateId, userId: user.id },
      data: updateData,
    })

    revalidatePath("/dashboard/templates")

    return {
      success: true,
      template: {
        ...template,
        avgClickRate: 0,
        totalSent: 0,
      },
    }
  } catch (error) {
    console.error("Error updating template:", error)
    return { success: false, error: "Failed to update template" }
  }
}

export async function getTemplate(templateId: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    const template = await db.emailTemplate.findFirst({
      where: {
        id: templateId,
        OR: [{ userId: user.id }, { isSystemTemplate: true }],
      },
      include: {
        templateCategories: {
          include: {
            category: true,
          },
        },
      },
    })

    if (!template) return { success: false, error: "Template not found" }

    // Increment view count
    await db.emailTemplate.update({
      where: { id: templateId },
      data: { viewCount: { increment: 1 } },
    })

    return {
      success: true,
      template: {
        ...template,
        avgClickRate: 0,
        totalSent: 0,
      },
    }
  } catch (error) {
    console.error("Error fetching template:", error)
    return { success: false, error: "Failed to fetch template" }
  }
}

export async function duplicateTemplate(templateId: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    const original = await db.emailTemplate.findFirst({
      where: {
        id: templateId,
        OR: [{ userId: user.id }, { isSystemTemplate: true }],
      },
    })

    if (!original) return { success: false, error: "Template not found" }

    // Increment duplicate count on original
    if (original.isSystemTemplate) {
      await db.emailTemplate.update({
        where: { id: templateId },
        data: { duplicateCount: { increment: 1 } },
      })
    }

    const template = await db.emailTemplate.create({
      data: {
        userId: user.id,
        name: `${original.name} (Copy)`,
        subject: original.subject,
        body: original.body,
        category: original.category,
        variables: original.variables || [],
        description: original.description,
        industry: original.industry,
        tags: original.tags || [],
        thumbnailUrl: original.thumbnailUrl,
        previewImageUrl: original.previewImageUrl,
        colorScheme: original.colorScheme ? JSON.parse(JSON.stringify(original.colorScheme)) : null,
        templateType: original.templateType,
        editorBlocks: original.editorBlocks ? JSON.parse(JSON.stringify(original.editorBlocks)) : null,
        isSystemTemplate: false,
      },
    })

    revalidatePath("/dashboard/templates")

    return {
      success: true,
      template: {
        ...template,
        avgClickRate: 0,
        totalSent: 0,
      },
    }
  } catch (error) {
    console.error("Error duplicating template:", error)
    return { success: false, error: "Failed to duplicate template" }
  }
}

export async function toggleFavorite(templateId: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    const template = await db.emailTemplate.findFirst({
      where: {
        id: templateId,
        OR: [{ userId: user.id }, { isSystemTemplate: true }],
      },
    })

    if (!template) return { success: false, error: "Template not found" }

    // If it's a system template, duplicate it to user's library first
    if (template.isSystemTemplate) {
      const duplicated = await db.emailTemplate.create({
        data: {
          userId: user.id,
          name: template.name,
          subject: template.subject,
          body: template.body,
          category: template.category,
          variables: template.variables || [],
          description: template.description,
          industry: template.industry,
          tags: template.tags || [],
          thumbnailUrl: template.thumbnailUrl,
          previewImageUrl: template.previewImageUrl,
          colorScheme: template.colorScheme ? JSON.parse(JSON.stringify(template.colorScheme)) : null,
          templateType: template.templateType,
          editorBlocks: template.editorBlocks ? JSON.parse(JSON.stringify(template.editorBlocks)) : null,
          isSystemTemplate: false,
          isFavorite: true, // Mark as favorite
        },
      })

      // Increment duplicate count on original system template
      await db.emailTemplate.update({
        where: { id: templateId },
        data: { duplicateCount: { increment: 1 } },
      })

      revalidatePath("/dashboard/templates")
      return { success: true, isFavorite: true, duplicatedId: duplicated.id }
    } else {
      // User's own template - toggle isFavorite field
      const updated = await db.emailTemplate.update({
        where: { id: templateId },
        data: { isFavorite: !template.isFavorite },
      })
      revalidatePath("/dashboard/templates")
      return { success: true, isFavorite: updated.isFavorite }
    }
  } catch (error) {
    console.error("Error toggling favorite:", error)
    return { success: false, error: "Failed to toggle favorite" }
  }
}

export async function getTemplateCategories() {
  try {
    const categories = await db.templateCategory.findMany({
      orderBy: { order: "asc" },
    })

    return { success: true, categories }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return { success: false, error: "Failed to fetch categories" }
  }
}

export async function searchTemplates(
  query: string,
  filters?: {
    industry?: string
    category?: string
    tags?: string[]
  },
) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    const templates = await db.emailTemplate.findMany({
      where: {
        OR: [{ userId: user.id }, { isSystemTemplate: true }],
        AND: [
          query
            ? {
                OR: [
                  { name: { contains: query, mode: "insensitive" } },
                  { description: { contains: query, mode: "insensitive" } },
                  { subject: { contains: query, mode: "insensitive" } },
                  { body: { contains: query, mode: "insensitive" } },
                ],
              }
            : {},
          filters?.industry ? { industry: filters.industry } : {},
          filters?.category ? { category: filters.category } : {},
          filters?.tags && filters.tags.length > 0
            ? {
                tags: {
                  hasSome: filters.tags,
                },
              }
            : {},
        ],
      },
      include: {
        templateCategories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { timesUsed: "desc" },
      take: 50,
    })

    return {
      success: true,
      templates: templates.map((template) => ({
        ...template,
        avgClickRate: 0,
        totalSent: 0,
      })),
    }
  } catch (error) {
    console.error("Error searching templates:", error)
    return { success: false, error: "Failed to search templates" }
  }
}
