// "use server"

// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import { logger } from "@/lib/logger"
// import { Prisma } from "@prisma/client"

// export interface CreateTemplateInput {
//   name: string
//   description?: string
//   subject: string
//   body: string
//   category?: string
//   industry?: string
//   tags?: string[]
//   thumbnailUrl?: string
//   previewImageUrl?: string
//   colorScheme?: {
//     primary: string
//     secondary: string
//     accent: string
//   }
//   templateType?: "TEXT" | "VISUAL" | "HTML"
//   variables?: Array<{
//     name: string
//     required: boolean
//     defaultValue?: string
//     description?: string
//   }>
//   editorBlocks?: any
//   isSystemTemplate?: boolean
// }

// export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {
//   id: string
// }

// // Create a new email template
// export async function createTemplate(userId: string, input: CreateTemplateInput) {
//   try {
//     const template = await db.emailTemplate.create({
//       data: {
//         userId,
//         name: input.name,
//         description: input.description,
//         subject: input.subject,
//         body: input.body,
//         category: input.category,
//         industry: input.industry,
//         tags: input.tags || [],
//         thumbnailUrl: input.thumbnailUrl,
//         previewImageUrl: input.previewImageUrl,
//         colorScheme: input.colorScheme ? (input.colorScheme as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
//         templateType: input.templateType || "TEXT",
//         variables: input.variables ? (input.variables as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
//         editorBlocks: input.editorBlocks ? (input.editorBlocks as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
//         isSystemTemplate: input.isSystemTemplate || false,
//       },
//     })

//     revalidatePath("/templates")
//     return { success: true, template }
//   } catch (err) {
//     logger.error("Failed to create template", err as Error, { userId })
//     return { success: false, message: "Failed to create template" }
//   }
// }

// // Get all templates with filtering
// export async function getTemplates(
//   userId: string,
//   filters?: {
//     category?: string
//     industry?: string
//     tags?: string[]
//     search?: string
//     includeSystem?: boolean
//   },
// ) {
//   try {
//     const where: Prisma.EmailTemplateWhereInput = {
//       OR: [{ userId }, filters?.includeSystem !== false ? { isSystemTemplate: true } : {}],
//     }

//     if (filters?.category) {
//       where.category = filters.category
//     }

//     if (filters?.industry) {
//       where.industry = filters.industry
//     }

//     if (filters?.tags && filters.tags.length > 0) {
//       where.tags = {
//         hasSome: filters.tags,
//       }
//     }

//     if (filters?.search) {
//       where.AND = [
//         {
//           OR: [
//             { name: { contains: filters.search, mode: "insensitive" } },
//             { description: { contains: filters.search, mode: "insensitive" } },
//             { subject: { contains: filters.search, mode: "insensitive" } },
//           ],
//         },
//       ]
//     }

//     const templates = await db.emailTemplate.findMany({
//       where,
//       orderBy: [{ isFavorite: "desc" }, { timesUsed: "desc" }, { createdAt: "desc" }],
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//       },
//     })

//     return { success: true, templates }
//   } catch (err) {
//     logger.error("Failed to get templates", err as Error, { userId })
//     return { success: false, message: "Failed to get templates", templates: [] }
//   }
// }

// // Get single template by ID
// export async function getTemplate(userId: string, templateId: string) {
//   try {
//     const template = await db.emailTemplate.findFirst({
//       where: {
//         id: templateId,
//         OR: [{ userId }, { isSystemTemplate: true }],
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//       },
//     })

//     if (!template) {
//       return { success: false, message: "Template not found" }
//     }

//     // Increment view count
//     await db.emailTemplate.update({
//       where: { id: templateId },
//       data: { viewCount: { increment: 1 } },
//     })

//     return { success: true, template }
//   } catch (err) {
//     logger.error("Failed to get template", err as Error, { userId, templateId })
//     return { success: false, message: "Failed to get template" }
//   }
// }

// // Update template
// export async function updateTemplate(userId: string, input: UpdateTemplateInput) {
//   try {
//     // Verify ownership
//     const existing = await db.emailTemplate.findFirst({
//       where: {
//         id: input.id,
//         userId,
//       },
//     })

//     if (!existing) {
//       return { success: false, message: "Template not found or access denied" }
//     }

//     const { id, ...updateData } = input

//     const processedUpdateData: Prisma.EmailTemplateUpdateInput = {
//       ...updateData,
//       colorScheme: updateData.colorScheme ? (updateData.colorScheme as unknown as Prisma.InputJsonValue) : undefined,
//       variables: updateData.variables ? (updateData.variables as unknown as Prisma.InputJsonValue) : undefined,
//       editorBlocks: updateData.editorBlocks ? (updateData.editorBlocks as unknown as Prisma.InputJsonValue) : undefined,
//     }

//     const template = await db.emailTemplate.update({
//       where: { id },
//       data: processedUpdateData,
//     })

//     revalidatePath("/templates")
//     revalidatePath(`/templates/${id}`)
//     return { success: true, template }
//   } catch (err) {
//     logger.error("Failed to update template", err as Error, { userId, templateId: input.id })
//     return { success: false, message: "Failed to update template" }
//   }
// }

// // Delete template
// export async function deleteTemplate(userId: string, templateId: string) {
//   try {
//     const template = await db.emailTemplate.findFirst({
//       where: {
//         id: templateId,
//         userId,
//       },
//     })

//     if (!template) {
//       return { success: false, message: "Template not found or access denied" }
//     }

//     await db.emailTemplate.delete({
//       where: { id: templateId },
//     })

//     revalidatePath("/templates")
//     return { success: true }
//   } catch (err) {
//     logger.error("Failed to delete template", err as Error, { userId, templateId })
//     return { success: false, message: "Failed to delete template" }
//   }
// }

// // Duplicate template
// export async function duplicateTemplate(userId: string, templateId: string) {
//   try {
//     const original = await db.emailTemplate.findFirst({
//       where: {
//         id: templateId,
//         OR: [{ userId }, { isSystemTemplate: true }],
//       },
//     })

//     if (!original) {
//       return { success: false, message: "Template not found" }
//     }

//     // Increment duplicate count on original
//     await db.emailTemplate.update({
//       where: { id: templateId },
//       data: { duplicateCount: { increment: 1 } },
//     })

//     const duplicate = await db.emailTemplate.create({
//       data: {
//         userId,
//         name: `${original.name} (Copy)`,
//         description: original.description,
//         subject: original.subject,
//         body: original.body,
//         category: original.category,
//         industry: original.industry,
//         tags: original.tags,
//         thumbnailUrl: original.thumbnailUrl,
//         previewImageUrl: original.previewImageUrl,
//         colorScheme: original.colorScheme as Prisma.InputJsonValue,
//         templateType: original.templateType,
//         variables: original.variables as Prisma.InputJsonValue,
//         editorBlocks: original.editorBlocks as Prisma.InputJsonValue,
//         isSystemTemplate: false,
//       },
//     })

//     revalidatePath("/templates")
//     return { success: true, template: duplicate }
//   } catch (err) {
//     logger.error("Failed to duplicate template", err as Error, { userId, templateId })
//     return { success: false, message: "Failed to duplicate template" }
//   }
// }

// // Toggle favorite
// export async function toggleTemplateFavorite(userId: string, templateId: string) {
//   try {
//     const template = await db.emailTemplate.findFirst({
//       where: {
//         id: templateId,
//         userId,
//       },
//     })

//     if (!template) {
//       return { success: false, message: "Template not found or access denied" }
//     }

//     const updated = await db.emailTemplate.update({
//       where: { id: templateId },
//       data: { isFavorite: !template.isFavorite },
//     })

//     revalidatePath("/templates")
//     return { success: true, isFavorite: updated.isFavorite }
//   } catch (err) {
//     logger.error("Failed to toggle favorite", err as Error, { userId, templateId })
//     return { success: false, message: "Failed to toggle favorite" }
//   }
// }

// // Track template usage (called when template is used in email composer)
// export async function trackTemplateUsage(userId: string, templateId: string) {
//   try {
//     await db.emailTemplate.update({
//       where: { id: templateId },
//       data: {
//         timesUsed: { increment: 1 },
//         lastUsedAt: new Date(),
//       },
//     })

//     return { success: true }
//   } catch (err) {
//     logger.error("Failed to track template usage", err as Error, { userId, templateId })
//     return { success: false, message: "Failed to track usage" }
//   }
// }

// // Update template analytics (called periodically to sync stats)
// export async function updateTemplateAnalytics(userId: string, templateId: string) {
//   try {
//     // Get all analytics data from the last 30 days
//     const analytics = await db.analytics.findMany({
//       where: {
//         date: {
//           gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
//         },
//       },
//       select: {
//         openRate: true,
//         replyRate: true,
//       },
//     })

//     if (analytics.length > 0) {
//       const avgOpenRate = analytics.reduce((sum, a) => sum + (a.openRate || 0), 0) / analytics.length
//       const avgReplyRate = analytics.reduce((sum, a) => sum + (a.replyRate || 0), 0) / analytics.length

//       await db.emailTemplate.update({
//         where: { id: templateId },
//         data: {
//           avgOpenRate,
//           avgReplyRate,
//         },
//       })

//       return { success: true, avgOpenRate, avgReplyRate }
//     }

//     return { success: true, message: "No analytics data available" }
//   } catch (err) {
//     logger.error("Failed to update template analytics", err as Error, { userId, templateId })
//     return { success: false, message: "Failed to update analytics" }
//   }
// }

// // Get template categories (for filtering)
// export async function getTemplateCategories() {
//   try {
//     const categories = [
//       "Cold Outreach",
//       "Follow-up",
//       "Meeting Request",
//       "Introduction",
//       "Value Proposition",
//       "Product Demo",
//       "Case Study",
//       "Event Invitation",
//       "Content Sharing",
//       "Partnership",
//       "Re-engagement",
//       "Thank You",
//     ]

//     return { success: true, categories }
//   } catch (err) {
//     logger.error("Failed to get categories", err as Error)
//     return { success: false, message: "Failed to get categories", categories: [] }
//   }
// }

// // Get template industries (for filtering)
// export async function getTemplateIndustries() {
//   try {
//     const industries = [
//       "SaaS",
//       "E-commerce",
//       "Real Estate",
//       "Recruiting",
//       "Healthcare",
//       "Finance",
//       "Education",
//       "Nonprofit",
//       "Technology",
//       "Consulting",
//       "Marketing",
//       "Sales",
//     ]

//     return { success: true, industries }
//   } catch (err) {
//     logger.error("Failed to get industries", err as Error)
//     return { success: false, message: "Failed to get industries", industries: [] }
//   }
// }

// "use server"

// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import { logger } from "@/lib/logger"
// import { Prisma } from "@prisma/client"
// import { auth } from "@clerk/nextjs/server"
// export interface CreateTemplateInput {
//   name: string
//   description?: string
//   subject: string
//   body: string
//   category?: string
//   industry?: string
//   tags?: string[]
//   thumbnailUrl?: string
//   previewImageUrl?: string
//   colorScheme?: {
//     primary: string
//     secondary: string
//     accent: string
//   }
//   templateType?: "TEXT" | "VISUAL" | "HTML"
//   variables?: Array<{
//     name: string
//     required: boolean
//     defaultValue?: string
//     description?: string
//   }>
//   editorBlocks?: any
//   isSystemTemplate?: boolean
// }

// export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {
//   id: string
// }

// // Create a new email template
// export async function createTemplate(userId: string, input: CreateTemplateInput) {
//   try {
//     const template = await db.emailTemplate.create({
//       data: {
//         userId,
//         name: input.name,
//         description: input.description,
//         subject: input.subject,
//         body: input.body,
//         category: input.category,
//         industry: input.industry,
//         tags: input.tags || [],
//         thumbnailUrl: input.thumbnailUrl,
//         previewImageUrl: input.previewImageUrl,
//         colorScheme: input.colorScheme ? (input.colorScheme as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
//         templateType: input.templateType || "TEXT",
//         variables: input.variables ? (input.variables as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
//         editorBlocks: input.editorBlocks ? (input.editorBlocks as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
//         isSystemTemplate: input.isSystemTemplate || false,
//       },
//     })

//     revalidatePath("/templates")
//     return { success: true, template }
//   } catch (err) {
//     logger.error("Failed to create template", err as Error, { userId })
//     return { success: false, message: "Failed to create template" }
//   }
// }

// // Get all templates with filtering
// export async function getTemplates(
//   userId: string,
//   filters?: {
//     category?: string
//     industry?: string
//     tags?: string[]
//     search?: string
//     includeSystem?: boolean
//   },
// ) {
//   try {
//     const where: Prisma.EmailTemplateWhereInput = {
//       OR: [{ userId }, filters?.includeSystem !== false ? { isSystemTemplate: true } : {}],
//     }

//     if (filters?.category) {
//       where.category = filters.category
//     }

//     if (filters?.industry) {
//       where.industry = filters.industry
//     }

//     if (filters?.tags && filters.tags.length > 0) {
//       where.tags = {
//         hasSome: filters.tags,
//       }
//     }

//     if (filters?.search) {
//       where.AND = [
//         {
//           OR: [
//             { name: { contains: filters.search, mode: "insensitive" } },
//             { description: { contains: filters.search, mode: "insensitive" } },
//             { subject: { contains: filters.search, mode: "insensitive" } },
//           ],
//         },
//       ]
//     }

//     const templates = await db.emailTemplate.findMany({
//       where,
//       orderBy: [{ isFavorite: "desc" }, { timesUsed: "desc" }, { createdAt: "desc" }],
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//       },
//     })

//     return { success: true, templates }
//   } catch (err) {
//     logger.error("Failed to get templates", err as Error, { userId })
//     return { success: false, message: "Failed to get templates", templates: [] }
//   }
// }

// // Get single template by ID
// export async function getTemplate(userId: string, templateId: string) {
//   try {
//     const template = await db.emailTemplate.findFirst({
//       where: {
//         id: templateId,
//         OR: [{ userId }, { isSystemTemplate: true }],
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//       },
//     })

//     if (!template) {
//       return { success: false, message: "Template not found" }
//     }

//     // Increment view count
//     await db.emailTemplate.update({
//       where: { id: templateId },
//       data: { viewCount: { increment: 1 } },
//     })

//     return { success: true, template }
//   } catch (err) {
//     logger.error("Failed to get template", err as Error, { userId, templateId })
//     return { success: false, message: "Failed to get template" }
//   }
// }

// // Update template
// export async function updateTemplate(templateId: string, input: Partial<CreateTemplateInput>) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       return { success: false, error: "Unauthorized" }
//     }

//     // Verify ownership
//     const existing = await db.emailTemplate.findFirst({
//       where: {
//         id: templateId,
//         userId,
//       },
//     })

//     if (!existing) {
//       return { success: false, error: "Template not found or access denied" }
//     }

//     const processedUpdateData: Prisma.EmailTemplateUpdateInput = {
//       ...input,
//       colorScheme: input.colorScheme ? (input.colorScheme as unknown as Prisma.InputJsonValue) : undefined,
//       variables: input.variables ? (input.variables as unknown as Prisma.InputJsonValue) : undefined,
//       editorBlocks: input.editorBlocks ? (input.editorBlocks as unknown as Prisma.InputJsonValue) : undefined,
//     }

//     const template = await db.emailTemplate.update({
//       where: { id: templateId },
//       data: processedUpdateData,
//     })

//     revalidatePath("/templates")
//     revalidatePath(`/templates/${templateId}`)
//     return { success: true, template }
//   } catch (err) {
//     logger.error("Error updating template", err as Error, { templateId })
//     return { success: false, error: "Failed to update template" }
//   }
// }

// // Delete template
// export async function deleteTemplate(userId: string, templateId: string) {
//   try {
//     const template = await db.emailTemplate.findFirst({
//       where: {
//         id: templateId,
//         userId,
//       },
//     })

//     if (!template) {
//       return { success: false, message: "Template not found or access denied" }
//     }

//     await db.emailTemplate.delete({
//       where: { id: templateId },
//     })

//     revalidatePath("/templates")
//     return { success: true }
//   } catch (err) {
//     logger.error("Failed to delete template", err as Error, { userId, templateId })
//     return { success: false, message: "Failed to delete template" }
//   }
// }

// // Duplicate template
// export async function duplicateTemplate(userId: string, templateId: string) {
//   try {
//     const original = await db.emailTemplate.findFirst({
//       where: {
//         id: templateId,
//         OR: [{ userId }, { isSystemTemplate: true }],
//       },
//     })

//     if (!original) {
//       return { success: false, message: "Template not found" }
//     }

//     // Increment duplicate count on original
//     await db.emailTemplate.update({
//       where: { id: templateId },
//       data: { duplicateCount: { increment: 1 } },
//     })

//     const duplicate = await db.emailTemplate.create({
//       data: {
//         userId,
//         name: `${original.name} (Copy)`,
//         description: original.description,
//         subject: original.subject,
//         body: original.body,
//         category: original.category,
//         industry: original.industry,
//         tags: original.tags,
//         thumbnailUrl: original.thumbnailUrl,
//         previewImageUrl: original.previewImageUrl,
//         colorScheme: original.colorScheme as Prisma.InputJsonValue,
//         templateType: original.templateType,
//         variables: original.variables as Prisma.InputJsonValue,
//         editorBlocks: original.editorBlocks as Prisma.InputJsonValue,
//         isSystemTemplate: false,
//       },
//     })

//     revalidatePath("/templates")
//     return { success: true, template: duplicate }
//   } catch (err) {
//     logger.error("Failed to duplicate template", err as Error, { userId, templateId })
//     return { success: false, message: "Failed to duplicate template" }
//   }
// }

// // Toggle favorite
// export async function toggleTemplateFavorite(userId: string, templateId: string) {
//   try {
//     const template = await db.emailTemplate.findFirst({
//       where: {
//         id: templateId,
//         userId,
//       },
//     })

//     if (!template) {
//       return { success: false, message: "Template not found or access denied" }
//     }

//     const updated = await db.emailTemplate.update({
//       where: { id: templateId },
//       data: { isFavorite: !template.isFavorite },
//     })

//     revalidatePath("/templates")
//     return { success: true, isFavorite: updated.isFavorite }
//   } catch (err) {
//     logger.error("Failed to toggle favorite", err as Error, { userId, templateId })
//     return { success: false, message: "Failed to toggle favorite" }
//   }
// }

// // Track template usage (called when template is used in email composer)
// export async function trackTemplateUsage(userId: string, templateId: string) {
//   try {
//     await db.emailTemplate.update({
//       where: { id: templateId },
//       data: {
//         timesUsed: { increment: 1 },
//         lastUsedAt: new Date(),
//       },
//     })

//     return { success: true }
//   } catch (err) {
//     logger.error("Failed to track template usage", err as Error, { userId, templateId })
//     return { success: false, message: "Failed to track usage" }
//   }
// }

// // Update template analytics (called periodically to sync stats)
// export async function updateTemplateAnalytics(userId: string, templateId: string) {
//   try {
//     // Get all analytics data from the last 30 days
//     const analytics = await db.analytics.findMany({
//       where: {
//         date: {
//           gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
//         },
//       },
//       select: {
//         openRate: true,
//         replyRate: true,
//       },
//     })

//     if (analytics.length > 0) {
//       const avgOpenRate = analytics.reduce((sum, a) => sum + (a.openRate || 0), 0) / analytics.length
//       const avgReplyRate = analytics.reduce((sum, a) => sum + (a.replyRate || 0), 0) / analytics.length

//       await db.emailTemplate.update({
//         where: { id: templateId },
//         data: {
//           avgOpenRate,
//           avgReplyRate,
//         },
//       })

//       return { success: true, avgOpenRate, avgReplyRate }
//     }

//     return { success: true, message: "No analytics data available" }
//   } catch (err) {
//     logger.error("Failed to update template analytics", err as Error, { userId, templateId })
//     return { success: false, message: "Failed to update analytics" }
//   }
// }

// // Get template categories (for filtering)
// export async function getTemplateCategories() {
//   try {
//     const categories = [
//       "Cold Outreach",
//       "Follow-up",
//       "Meeting Request",
//       "Introduction",
//       "Value Proposition",
//       "Product Demo",
//       "Case Study",
//       "Event Invitation",
//       "Content Sharing",
//       "Partnership",
//       "Re-engagement",
//       "Thank You",
//     ]

//     return { success: true, categories }
//   } catch (err) {
//     logger.error("Failed to get categories", err as Error)
//     return { success: false, message: "Failed to get categories", categories: [] }
//   }
// }

// // Get template industries (for filtering)
// export async function getTemplateIndustries() {
//   try {
//     const industries = [
//       "SaaS",
//       "E-commerce",
//       "Real Estate",
//       "Recruiting",
//       "Healthcare",
//       "Finance",
//       "Education",
//       "Nonprofit",
//       "Technology",
//       "Consulting",
//       "Marketing",
//       "Sales",
//     ]

//     return { success: true, industries }
//   } catch (err) {
//     logger.error("Failed to get industries", err as Error)
//     return { success: false, message: "Failed to get industries", industries: [] }
//   }
// }




// "use server"

// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import { logger } from "@/lib/logger"
// import { Prisma } from "@prisma/client"
// import { auth } from "@clerk/nextjs/server"

// export interface CreateTemplateInput {
//   name: string
//   description?: string
//   subject: string
//   body: string
//   category?: string
//   industry?: string
//   tags?: string[]
//   thumbnailUrl?: string
//   previewImageUrl?: string
//   colorScheme?: {
//     primary: string
//     secondary: string
//     accent: string
//   }
//   templateType?: "TEXT" | "VISUAL" | "HTML"
//   variables?: Array<{
//     name: string
//     required: boolean
//     defaultValue?: string
//     description?: string
//   }>
//   editorBlocks?: any
//   isSystemTemplate?: boolean
// }

// export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {
//   id: string
// }

// // Create a new email template
// export async function createTemplate(userId: string, input: CreateTemplateInput) {
//   try {
//     const template = await db.emailTemplate.create({
//       data: {
//         userId,
//         name: input.name,
//         description: input.description,
//         subject: input.subject,
//         body: input.body,
//         category: input.category,
//         industry: input.industry,
//         tags: input.tags || [],
//         thumbnailUrl: input.thumbnailUrl,
//         previewImageUrl: input.previewImageUrl,
//         colorScheme: input.colorScheme ? (input.colorScheme as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
//         templateType: input.templateType || "TEXT",
//         variables: input.variables ? (input.variables as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
//         editorBlocks: input.editorBlocks ? (input.editorBlocks as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
//         isSystemTemplate: input.isSystemTemplate || false,
//       },
//     })

//     revalidatePath("/templates")
//     return { success: true, template }
//   } catch (err) {
//     logger.error("Failed to create template", err as Error, { userId })
//     return { success: false, message: "Failed to create template" }
//   }
// }

// // Get all templates with filtering
// export async function getTemplates(
//   userId: string,
//   filters?: {
//     category?: string
//     industry?: string
//     tags?: string[]
//     search?: string
//     includeSystem?: boolean
//   },
// ) {
//   try {
//     const where: Prisma.EmailTemplateWhereInput = {
//       OR: [{ userId }, filters?.includeSystem !== false ? { isSystemTemplate: true } : {}],
//     }

//     if (filters?.category) {
//       where.category = filters.category
//     }

//     if (filters?.industry) {
//       where.industry = filters.industry
//     }

//     if (filters?.tags && filters.tags.length > 0) {
//       where.tags = {
//         hasSome: filters.tags,
//       }
//     }

//     if (filters?.search) {
//       where.AND = [
//         {
//           OR: [
//             { name: { contains: filters.search, mode: "insensitive" } },
//             { description: { contains: filters.search, mode: "insensitive" } },
//             { subject: { contains: filters.search, mode: "insensitive" } },
//           ],
//         },
//       ]
//     }

//     const templates = await db.emailTemplate.findMany({
//       where,
//       orderBy: [{ isFavorite: "desc" }, { timesUsed: "desc" }, { createdAt: "desc" }],
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//       },
//     })

//     return { success: true, templates }
//   } catch (err) {
//     logger.error("Failed to get templates", err as Error, { userId })
//     return { success: false, message: "Failed to get templates", templates: [] }
//   }
// }

// // Get single template by ID
// export async function getTemplate(userId: string, templateId: string) {
//   try {
//     const template = await db.emailTemplate.findFirst({
//       where: {
//         id: templateId,
//         OR: [{ userId }, { isSystemTemplate: true }],
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//       },
//     })

//     if (!template) {
//       return { success: false, message: "Template not found" }
//     }

//     // Increment view count
//     await db.emailTemplate.update({
//       where: { id: templateId },
//       data: { viewCount: { increment: 1 } },
//     })

//     return { success: true, template }
//   } catch (err) {
//     logger.error("Failed to get template", err as Error, { userId, templateId })
//     return { success: false, message: "Failed to get template" }
//   }
// }

// // Update template
// export async function updateTemplate(templateId: string, input: Partial<CreateTemplateInput>) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       return { success: false, error: "Unauthorized" }
//     }

//     console.log("[v0] updateTemplate called", { templateId, userId, hasInput: !!input })

//     // Verify ownership and template exists
//     const existing = await db.emailTemplate.findFirst({
//       where: {
//         id: templateId,
//         userId,
//       },
//     })

//     console.log("[v0] Template found:", { exists: !!existing, templateId })

//     if (!existing) {
//       return { success: false, error: "Template not found or access denied" }
//     }

//     const processedUpdateData: Prisma.EmailTemplateUpdateInput = {
//       ...input,
//       colorScheme: input.colorScheme ? (input.colorScheme as unknown as Prisma.InputJsonValue) : undefined,
//       variables: input.variables ? (input.variables as unknown as Prisma.InputJsonValue) : undefined,
//       editorBlocks: input.editorBlocks ? (input.editorBlocks as unknown as Prisma.InputJsonValue) : undefined,
//     }

//     const template = await db.emailTemplate.update({
//       where: {
//         id: templateId,
//         userId, // Add userId to where clause for extra safety
//       },
//       data: processedUpdateData,
//     })

//     console.log("[v0] Template updated successfully", { templateId })

//     revalidatePath("/templates")
//     revalidatePath(`/templates/${templateId}`)
//     return { success: true, template }
//   } catch (err) {
//     logger.error("Error updating template", err as Error, { templateId })
//     console.error("[v0] Update template error:", err)
//     return { success: false, error: "Failed to update template" }
//   }
// }

// // Delete template
// export async function deleteTemplate(userId: string, templateId: string) {
//   try {
//     const template = await db.emailTemplate.findFirst({
//       where: {
//         id: templateId,
//         userId,
//       },
//     })

//     if (!template) {
//       return { success: false, message: "Template not found or access denied" }
//     }

//     await db.emailTemplate.delete({
//       where: { id: templateId },
//     })

//     revalidatePath("/templates")
//     return { success: true }
//   } catch (err) {
//     logger.error("Failed to delete template", err as Error, { userId, templateId })
//     return { success: false, message: "Failed to delete template" }
//   }
// }

// // Duplicate template
// export async function duplicateTemplate(userId: string, templateId: string) {
//   try {
//     const original = await db.emailTemplate.findFirst({
//       where: {
//         id: templateId,
//         OR: [{ userId }, { isSystemTemplate: true }],
//       },
//     })

//     if (!original) {
//       return { success: false, message: "Template not found" }
//     }

//     // Increment duplicate count on original
//     await db.emailTemplate.update({
//       where: { id: templateId },
//       data: { duplicateCount: { increment: 1 } },
//     })

//     const duplicate = await db.emailTemplate.create({
//       data: {
//         userId,
//         name: `${original.name} (Copy)`,
//         description: original.description,
//         subject: original.subject,
//         body: original.body,
//         category: original.category,
//         industry: original.industry,
//         tags: original.tags,
//         thumbnailUrl: original.thumbnailUrl,
//         previewImageUrl: original.previewImageUrl,
//         colorScheme: original.colorScheme as Prisma.InputJsonValue,
//         templateType: original.templateType,
//         variables: original.variables as Prisma.InputJsonValue,
//         editorBlocks: original.editorBlocks as Prisma.InputJsonValue,
//         isSystemTemplate: false,
//       },
//     })

//     revalidatePath("/templates")
//     return { success: true, template: duplicate }
//   } catch (err) {
//     logger.error("Failed to duplicate template", err as Error, { userId, templateId })
//     return { success: false, message: "Failed to duplicate template" }
//   }
// }

// // Toggle favorite
// export async function toggleTemplateFavorite(userId: string, templateId: string) {
//   try {
//     const template = await db.emailTemplate.findFirst({
//       where: {
//         id: templateId,
//         userId,
//       },
//     })

//     if (!template) {
//       return { success: false, message: "Template not found or access denied" }
//     }

//     const updated = await db.emailTemplate.update({
//       where: { id: templateId },
//       data: { isFavorite: !template.isFavorite },
//     })

//     revalidatePath("/templates")
//     return { success: true, isFavorite: updated.isFavorite }
//   } catch (err) {
//     logger.error("Failed to toggle favorite", err as Error, { userId, templateId })
//     return { success: false, message: "Failed to toggle favorite" }
//   }
// }

// // Track template usage (called when template is used in email composer)
// export async function trackTemplateUsage(userId: string, templateId: string) {
//   try {
//     await db.emailTemplate.update({
//       where: { id: templateId },
//       data: {
//         timesUsed: { increment: 1 },
//         lastUsedAt: new Date(),
//       },
//     })

//     return { success: true }
//   } catch (err) {
//     logger.error("Failed to track template usage", err as Error, { userId, templateId })
//     return { success: false, message: "Failed to track usage" }
//   }
// }

// // Update template analytics (called periodically to sync stats)
// export async function updateTemplateAnalytics(userId: string, templateId: string) {
//   try {
//     // Get all analytics data from the last 30 days
//     const analytics = await db.analytics.findMany({
//       where: {
//         date: {
//           gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
//         },
//       },
//       select: {
//         openRate: true,
//         replyRate: true,
//       },
//     })

//     if (analytics.length > 0) {
//       const avgOpenRate = analytics.reduce((sum, a) => sum + (a.openRate || 0), 0) / analytics.length
//       const avgReplyRate = analytics.reduce((sum, a) => sum + (a.replyRate || 0), 0) / analytics.length

//       await db.emailTemplate.update({
//         where: { id: templateId },
//         data: {
//           avgOpenRate,
//           avgReplyRate,
//         },
//       })

//       return { success: true, avgOpenRate, avgReplyRate }
//     }

//     return { success: true, message: "No analytics data available" }
//   } catch (err) {
//     logger.error("Failed to update template analytics", err as Error, { userId, templateId })
//     return { success: false, message: "Failed to update analytics" }
//   }
// }

// // Get template categories (for filtering)
// export async function getTemplateCategories() {
//   try {
//     const categories = [
//       "Cold Outreach",
//       "Follow-up",
//       "Meeting Request",
//       "Introduction",
//       "Value Proposition",
//       "Product Demo",
//       "Case Study",
//       "Event Invitation",
//       "Content Sharing",
//       "Partnership",
//       "Re-engagement",
//       "Thank You",
//     ]

//     return { success: true, categories }
//   } catch (err) {
//     logger.error("Failed to get categories", err as Error)
//     return { success: false, message: "Failed to get categories", categories: [] }
//   }
// }

// // Get template industries (for filtering)
// export async function getTemplateIndustries() {
//   try {
//     const industries = [
//       "SaaS",
//       "E-commerce",
//       "Real Estate",
//       "Recruiting",
//       "Healthcare",
//       "Finance",
//       "Education",
//       "Nonprofit",
//       "Technology",
//       "Consulting",
//       "Marketing",
//       "Sales",
//     ]

//     return { success: true, industries }
//   } catch (err) {
//     logger.error("Failed to get industries", err as Error)
//     return { success: false, message: "Failed to get industries", industries: [] }
//   }
// }



"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { logger } from "@/lib/logger"
import { Prisma } from "@prisma/client"
import { auth } from "@clerk/nextjs/server"

export interface CreateTemplateInput {
  name: string
  description?: string
  subject: string
  body: string
  category?: string
  industry?: string
  tags?: string[]
  thumbnailUrl?: string
  previewImageUrl?: string
  colorScheme?: {
    primary: string
    secondary: string
    accent: string
  }
  templateType?: "TEXT" | "VISUAL" | "HTML"
  variables?: Array<{
    name: string
    required: boolean
    defaultValue?: string
    description?: string
  }>
  editorBlocks?: any
  isSystemTemplate?: boolean
}

export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {
  id: string
}

// Create a new email template
export async function createTemplate(input: CreateTemplateInput) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    const template = await db.emailTemplate.create({
      data: {
        userId,
        name: input.name,
        description: input.description,
        subject: input.subject,
        body: input.body,
        category: input.category,
        industry: input.industry,
        tags: input.tags || [],
        thumbnailUrl: input.thumbnailUrl,
        previewImageUrl: input.previewImageUrl,
        colorScheme: input.colorScheme ? (input.colorScheme as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
        templateType: input.templateType || "TEXT",
        variables: input.variables ? (input.variables as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
        editorBlocks: input.editorBlocks ? (input.editorBlocks as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
        isSystemTemplate: input.isSystemTemplate || false,
      },
    })

    revalidatePath("/templates")
    revalidatePath("/dashboard/templates")
    return { success: true, template }
  } catch (err) {
    logger.error("Failed to create template", err as Error)
    return { success: false, error: "Failed to create template" }
  }
}

// Get all templates with filtering
export async function getTemplates(
  userId: string,
  filters?: {
    category?: string
    industry?: string
    tags?: string[]
    search?: string
    includeSystem?: boolean
  },
) {
  try {
    const where: Prisma.EmailTemplateWhereInput = {
      OR: [{ userId }, filters?.includeSystem !== false ? { isSystemTemplate: true } : {}],
    }

    if (filters?.category) {
      where.category = filters.category
    }

    if (filters?.industry) {
      where.industry = filters.industry
    }

    if (filters?.tags && filters.tags.length > 0) {
      where.tags = {
        hasSome: filters.tags,
      }
    }

    if (filters?.search) {
      where.AND = [
        {
          OR: [
            { name: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
            { subject: { contains: filters.search, mode: "insensitive" } },
          ],
        },
      ]
    }

    const templates = await db.emailTemplate.findMany({
      where,
      orderBy: [{ isFavorite: "desc" }, { timesUsed: "desc" }, { createdAt: "desc" }],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return { success: true, templates }
  } catch (err) {
    logger.error("Failed to get templates", err as Error, { userId })
    return { success: false, message: "Failed to get templates", templates: [] }
  }
}

// Get single template by ID
export async function getTemplate(userId: string, templateId: string) {
  try {
    const template = await db.emailTemplate.findFirst({
      where: {
        id: templateId,
        OR: [{ userId }, { isSystemTemplate: true }],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!template) {
      return { success: false, message: "Template not found" }
    }

    // Increment view count
    await db.emailTemplate.update({
      where: { id: templateId },
      data: { viewCount: { increment: 1 } },
    })

    return { success: true, template }
  } catch (err) {
    logger.error("Failed to get template", err as Error, { userId, templateId })
    return { success: false, message: "Failed to get template" }
  }
}

// Update template
export async function updateTemplate(templateId: string, input: Partial<CreateTemplateInput>) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    console.log("[v0] updateTemplate called", { templateId, userId, inputKeys: Object.keys(input) })

    const existing = await db.emailTemplate.findFirst({
      where: {
        id: templateId,
        userId, // Must be owned by this user
      },
    })

    console.log("[v0] Template ownership check:", {
      exists: !!existing,
      templateId,
      ownedByUser: existing?.userId === userId,
      isSystem: existing?.isSystemTemplate,
    })

    if (!existing) {
      return { success: false, error: "Template not found or you don't have permission to edit it" }
    }

    if (existing.isSystemTemplate) {
      return { success: false, error: "System templates cannot be edited. Please duplicate it first." }
    }

    const processedUpdateData: Prisma.EmailTemplateUpdateInput = {
      ...input,
      colorScheme: input.colorScheme ? (input.colorScheme as unknown as Prisma.InputJsonValue) : undefined,
      variables: input.variables ? (input.variables as unknown as Prisma.InputJsonValue) : undefined,
      editorBlocks: input.editorBlocks ? (input.editorBlocks as unknown as Prisma.InputJsonValue) : undefined,
    }

    const template = await db.emailTemplate.update({
      where: {
        id: templateId,
        userId, // Double-check ownership in where clause
      },
      data: processedUpdateData,
    })

    console.log("[v0] Template updated successfully", { templateId })

    revalidatePath("/templates")
    revalidatePath("/dashboard/templates")
    revalidatePath(`/templates/${templateId}`)
    revalidatePath(`/dashboard/templates/${templateId}`)
    return { success: true, template }
  } catch (err) {
    logger.error("Error updating template", err as Error, { templateId })
    console.error("[v0] Update template error:", err)
    return { success: false, error: "Failed to update template" }
  }
}

// Delete template
export async function deleteTemplate(userId: string, templateId: string) {
  try {
    const template = await db.emailTemplate.findFirst({
      where: {
        id: templateId,
        userId,
      },
    })

    if (!template) {
      return { success: false, message: "Template not found or access denied" }
    }

    await db.emailTemplate.delete({
      where: { id: templateId },
    })

    revalidatePath("/templates")
    return { success: true }
  } catch (err) {
    logger.error("Failed to delete template", err as Error, { userId, templateId })
    return { success: false, message: "Failed to delete template" }
  }
}

// Duplicate template
export async function duplicateTemplate(userId: string, templateId: string) {
  try {
    const original = await db.emailTemplate.findFirst({
      where: {
        id: templateId,
        OR: [{ userId }, { isSystemTemplate: true }],
      },
    })

    if (!original) {
      return { success: false, message: "Template not found" }
    }

    // Increment duplicate count on original
    await db.emailTemplate.update({
      where: { id: templateId },
      data: { duplicateCount: { increment: 1 } },
    })

    const duplicate = await db.emailTemplate.create({
      data: {
        userId,
        name: `${original.name} (Copy)`,
        description: original.description,
        subject: original.subject,
        body: original.body,
        category: original.category,
        industry: original.industry,
        tags: original.tags,
        thumbnailUrl: original.thumbnailUrl,
        previewImageUrl: original.previewImageUrl,
        colorScheme: original.colorScheme as Prisma.InputJsonValue,
        templateType: original.templateType,
        variables: original.variables as Prisma.InputJsonValue,
        editorBlocks: original.editorBlocks as Prisma.InputJsonValue,
        isSystemTemplate: false,
      },
    })

    revalidatePath("/templates")
    return { success: true, template: duplicate }
  } catch (err) {
    logger.error("Failed to duplicate template", err as Error, { userId, templateId })
    return { success: false, message: "Failed to duplicate template" }
  }
}

// Toggle favorite
export async function toggleTemplateFavorite(userId: string, templateId: string) {
  try {
    const template = await db.emailTemplate.findFirst({
      where: {
        id: templateId,
        userId,
      },
    })

    if (!template) {
      return { success: false, message: "Template not found or access denied" }
    }

    const updated = await db.emailTemplate.update({
      where: { id: templateId },
      data: { isFavorite: !template.isFavorite },
    })

    revalidatePath("/templates")
    return { success: true, isFavorite: updated.isFavorite }
  } catch (err) {
    logger.error("Failed to toggle favorite", err as Error, { userId, templateId })
    return { success: false, message: "Failed to toggle favorite" }
  }
}

// Track template usage (called when template is used in email composer)
export async function trackTemplateUsage(userId: string, templateId: string) {
  try {
    await db.emailTemplate.update({
      where: { id: templateId },
      data: {
        timesUsed: { increment: 1 },
        lastUsedAt: new Date(),
      },
    })

    return { success: true }
  } catch (err) {
    logger.error("Failed to track template usage", err as Error, { userId, templateId })
    return { success: false, message: "Failed to track usage" }
  }
}

// Update template analytics (called periodically to sync stats)
export async function updateTemplateAnalytics(userId: string, templateId: string) {
  try {
    // Get all analytics data from the last 30 days
    const analytics = await db.analytics.findMany({
      where: {
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      select: {
        openRate: true,
        replyRate: true,
      },
    })

    if (analytics.length > 0) {
      const avgOpenRate = analytics.reduce((sum, a) => sum + (a.openRate || 0), 0) / analytics.length
      const avgReplyRate = analytics.reduce((sum, a) => sum + (a.replyRate || 0), 0) / analytics.length

      await db.emailTemplate.update({
        where: { id: templateId },
        data: {
          avgOpenRate,
          avgReplyRate,
        },
      })

      return { success: true, avgOpenRate, avgReplyRate }
    }

    return { success: true, message: "No analytics data available" }
  } catch (err) {
    logger.error("Failed to update template analytics", err as Error, { userId, templateId })
    return { success: false, message: "Failed to update analytics" }
  }
}

// Get template categories (for filtering)
export async function getTemplateCategories() {
  try {
    const categories = [
      "Cold Outreach",
      "Follow-up",
      "Meeting Request",
      "Introduction",
      "Value Proposition",
      "Product Demo",
      "Case Study",
      "Event Invitation",
      "Content Sharing",
      "Partnership",
      "Re-engagement",
      "Thank You",
    ]

    return { success: true, categories }
  } catch (err) {
    logger.error("Failed to get categories", err as Error)
    return { success: false, message: "Failed to get categories", categories: [] }
  }
}

// Get template industries (for filtering)
export async function getTemplateIndustries() {
  try {
    const industries = [
      "SaaS",
      "E-commerce",
      "Real Estate",
      "Recruiting",
      "Healthcare",
      "Finance",
      "Education",
      "Nonprofit",
      "Technology",
      "Consulting",
      "Marketing",
      "Sales",
    ]

    return { success: true, industries }
  } catch (err) {
    logger.error("Failed to get industries", err as Error)
    return { success: false, message: "Failed to get industries", industries: [] }
  }
}
