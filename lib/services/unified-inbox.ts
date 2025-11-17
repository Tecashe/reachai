// import { db } from "../db"
// import { logger } from "../logger"
// import { generateObject } from "ai"
// import { z } from "zod"

// const categorizationSchema = z.object({
//   category: z.enum(["INTERESTED", "NOT_INTERESTED", "QUESTION", "OUT_OF_OFFICE", "UNSUBSCRIBE", "REFERRAL"]),
//   sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE", "AUTO_REPLY"]),
//   priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
//   suggestedResponse: z.string(),
//   keyPoints: z.array(z.string()),
// })

// interface InboxMessage {
//   id: string
//   prospectId: string
//   prospectName: string
//   prospectEmail: string
//   prospectCompany: string
//   campaignId: string
//   campaignName: string
//   subject: string
//   body: string
//   receivedAt: Date
//   category?: string
//   sentiment?: string
//   priority?: string
//   isRead: boolean
//   isArchived: boolean
// }

// class UnifiedInbox {
//   async getInboxMessages(userId: string, filters?: { category?: string; isRead?: boolean }): Promise<InboxMessage[]> {
//     const replies = await db.emailReply.findMany({
//       where: {
//         prospect: {
//           userId,
//         },
//         ...(filters?.category && { category: filters.category as any }),
//       },
//       include: {
//         prospect: {
//           include: {
//             campaign: true,
//           },
//         },
//         emailLog: true,
//       },
//       orderBy: {
//         repliedAt: "desc",
//       },
//     })

//     const messages: InboxMessage[] = replies.map((reply) => ({
//       id: reply.id,
//       prospectId: reply.prospectId,
//       prospectName: `${reply.prospect.firstName || ""} ${reply.prospect.lastName || ""}`.trim() || "Unknown",
//       prospectEmail: reply.prospect.email,
//       prospectCompany: reply.prospect.company || "Unknown Company",
//       campaignId: reply.campaignId || "",
//       campaignName: reply.campaign?.name || "Unknown Campaign",
//       subject: reply.subject,
//       body: reply.body,
//       receivedAt: reply.repliedAt,
//       category: reply.category || undefined,
//       sentiment: reply.sentiment || undefined,
//       priority: this.calculatePriority(reply),
//       isRead: false, // Would need to add read tracking
//       isArchived: false, // Would need to add archive tracking
//     }))

//     return messages
//   }

//   private calculatePriority(reply: any): "HIGH" | "MEDIUM" | "LOW" {
//     if (reply.sentiment === "POSITIVE" || reply.category === "INTERESTED") {
//       return "HIGH"
//     }
//     if (reply.category === "QUESTION" || reply.sentiment === "NEUTRAL") {
//       return "MEDIUM"
//     }
//     return "LOW"
//   }

//   async categorizeReply(replyId: string): Promise<void> {
//     const reply = await db.emailReply.findUnique({
//       where: { id: replyId },
//       include: {
//         prospect: true,
//         emailLog: true,
//       },
//     })

//     if (!reply) {
//       throw new Error("Reply not found")
//     }

//     try {
//       const { object: categorization } = await generateObject({
//         model: "openai/gpt-4o-mini",
//         schema: categorizationSchema,
//         prompt: `You are an AI assistant analyzing email replies to cold outreach. Categorize this reply.

// Original Email Subject: ${reply.emailLog.subject}
// Original Email Body: ${reply.emailLog.body}

// Reply Subject: ${reply.subject}
// Reply Body: ${reply.body}

// Prospect: ${reply.prospect.firstName} ${reply.prospect.lastName} at ${reply.prospect.company}

// Analyze and provide:
// 1. Category: INTERESTED, NOT_INTERESTED, QUESTION, OUT_OF_OFFICE, UNSUBSCRIBE, or REFERRAL
// 2. Sentiment: POSITIVE, NEUTRAL, NEGATIVE, or AUTO_REPLY
// 3. Priority: HIGH (needs immediate attention), MEDIUM (respond soon), or LOW (can wait)
// 4. Suggested response (brief, professional)
// 5. Key points from the reply

// Be accurate and helpful.`,
//       })

//       // Update reply with categorization
//       await db.emailReply.update({
//         where: { id: replyId },
//         data: {
//           category: categorization.category,
//           sentiment: categorization.sentiment,
//           analyzedAt: new Date(),
//         },
//       })

//       // Auto-pause campaign if unsubscribe
//       if (categorization.category === "UNSUBSCRIBE") {
//         await db.prospect.update({
//           where: { id: reply.prospectId },
//           data: {
//             unsubscribed: true,
//             status: "UNSUBSCRIBED",
//           },
//         })
//       }

//       // Auto-pause campaign if interested
//       if (categorization.category === "INTERESTED" && reply.campaignId) {
//         await db.prospect.update({
//           where: { id: reply.prospectId },
//           data: {
//             status: "REPLIED",
//           },
//         })
//       }

//       logger.info("Reply categorized", {
//         replyId,
//         category: categorization.category,
//         sentiment: categorization.sentiment,
//       })
//     } catch (error) {
//       logger.error("Failed to categorize reply", error as Error, { replyId })
//     }
//   }

//   async getInboxStats(userId: string): Promise<any> {
//     const replies = await db.emailReply.findMany({
//       where: {
//         prospect: {
//           userId,
//         },
//       },
//     })

//     const total = replies.length
//     const interested = replies.filter((r) => r.category === "INTERESTED").length
//     const questions = replies.filter((r) => r.category === "QUESTION").length
//     const notInterested = replies.filter((r) => r.category === "NOT_INTERESTED").length
//     const unsubscribes = replies.filter((r) => r.category === "UNSUBSCRIBE").length

//     const positive = replies.filter((r) => r.sentiment === "POSITIVE").length
//     const neutral = replies.filter((r) => r.sentiment === "NEUTRAL").length
//     const negative = replies.filter((r) => r.sentiment === "NEGATIVE").length

//     return {
//       total,
//       byCategory: {
//         interested,
//         questions,
//         notInterested,
//         unsubscribes,
//       },
//       bySentiment: {
//         positive,
//         neutral,
//         negative,
//       },
//       responseRate: total > 0 ? ((interested + questions) / total) * 100 : 0,
//     }
//   }
// }

// export const unifiedInbox = new UnifiedInbox()
// export type { InboxMessage }

// import { db } from "../db"
// import { logger } from "../logger"
// import { generateObject } from "ai"
// import { z } from "zod"

// const categorizationSchema = z.object({
//   category: z.enum(["INTERESTED", "NOT_INTERESTED", "QUESTION", "OUT_OF_OFFICE", "UNSUBSCRIBE", "REFERRAL"]),
//   sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE", "AUTO_REPLY"]),
//   priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
//   suggestedResponse: z.string(),
//   keyPoints: z.array(z.string()),
// })

// interface InboxMessage {
//   id: string
//   prospectId: string
//   prospectName: string
//   prospectEmail: string
//   prospectCompany: string
//   campaignId: string
//   campaignName: string
//   subject: string
//   body: string
//   receivedAt: Date
//   category?: string
//   sentiment?: string
//   priority?: string
//   isRead: boolean
//   isArchived: boolean
// }

// class UnifiedInbox {
//   async getInboxMessages(userId: string, filters?: { category?: string; isRead?: boolean }): Promise<InboxMessage[]> {
//     const replies = await db.emailReply.findMany({
//       where: {
//         prospect: {
//           userId,
//         },
//         ...(filters?.category && { category: filters.category as any }),
//         ...(filters?.isRead !== undefined && { isRead: filters.isRead }),
//       },
//       include: {
//         prospect: {
//           include: {
//             campaign: true,
//           },
//         },
//         emailLog: true,
//       },
//       orderBy: {
//         repliedAt: "desc",
//       },
//     })

//     const messages: InboxMessage[] = replies.map((reply) => ({
//       id: reply.id,
//       prospectId: reply.prospectId,
//       prospectName: `${reply.prospect.firstName || ""} ${reply.prospect.lastName || ""}`.trim() || "Unknown",
//       prospectEmail: reply.prospect.email,
//       prospectCompany: reply.prospect.company || "Unknown Company",
//       campaignId: reply.campaignId || "",
//       campaignName: reply.prospect.campaign?.name || "Unknown Campaign",
//       subject: reply.subject,
//       body: reply.body,
//       receivedAt: reply.repliedAt,
//       category: reply.category || undefined,
//       sentiment: reply.sentiment || undefined,
//       priority: this.calculatePriority(reply),
//       isRead: reply.isRead,
//       isArchived: reply.isArchived,
//     }))

//     return messages
//   }

//   private calculatePriority(reply: any): "HIGH" | "MEDIUM" | "LOW" {
//     if (reply.sentiment === "POSITIVE" || reply.category === "INTERESTED") {
//       return "HIGH"
//     }
//     if (reply.category === "QUESTION" || reply.sentiment === "NEUTRAL") {
//       return "MEDIUM"
//     }
//     return "LOW"
//   }

//   async categorizeReply(replyId: string): Promise<void> {
//     const reply = await db.emailReply.findUnique({
//       where: { id: replyId },
//       include: {
//         prospect: true,
//         emailLog: true,
//       },
//     })

//     if (!reply) {
//       throw new Error("Reply not found")
//     }

//     try {
//       const { object: categorization } = await generateObject({
//         model: "openai/gpt-4o-mini",
//         schema: categorizationSchema,
//         prompt: `You are an AI assistant analyzing email replies to cold outreach. Categorize this reply.

// Original Email Subject: ${reply.emailLog.subject}
// Original Email Body: ${reply.emailLog.body}

// Reply Subject: ${reply.subject}
// Reply Body: ${reply.body}

// Prospect: ${reply.prospect.firstName} ${reply.prospect.lastName} at ${reply.prospect.company}

// Analyze and provide:
// 1. Category: INTERESTED, NOT_INTERESTED, QUESTION, OUT_OF_OFFICE, UNSUBSCRIBE, or REFERRAL
// 2. Sentiment: POSITIVE, NEUTRAL, NEGATIVE, or AUTO_REPLY
// 3. Priority: HIGH (needs immediate attention), MEDIUM (respond soon), or LOW (can wait)
// 4. Suggested response (brief, professional)
// 5. Key points from the reply

// Be accurate and helpful.`,
//       })

//       // Update reply with categorization
//       await db.emailReply.update({
//         where: { id: replyId },
//         data: {
//           category: categorization.category,
//           sentiment: categorization.sentiment,
//           analyzedAt: new Date(),
//         },
//       })

//       // Auto-pause campaign if unsubscribe
//       if (categorization.category === "UNSUBSCRIBE") {
//         await db.prospect.update({
//           where: { id: reply.prospectId },
//           data: {
//             unsubscribed: true,
//             status: "UNSUBSCRIBED",
//           },
//         })
//       }

//       // Auto-pause campaign if interested
//       if (categorization.category === "INTERESTED" && reply.campaignId) {
//         await db.prospect.update({
//           where: { id: reply.prospectId },
//           data: {
//             status: "REPLIED",
//           },
//         })
//       }

//       logger.info("Reply categorized", {
//         replyId,
//         category: categorization.category,
//         sentiment: categorization.sentiment,
//       })
//     } catch (error) {
//       logger.error("Failed to categorize reply", error as Error, { replyId })
//     }
//   }

//   async getInboxStats(userId: string): Promise<any> {
//     const replies = await db.emailReply.findMany({
//       where: {
//         prospect: {
//           userId,
//         },
//       },
//     })

//     const total = replies.length
//     const interested = replies.filter((r) => r.category === "INTERESTED").length
//     const questions = replies.filter((r) => r.category === "QUESTION").length
//     const notInterested = replies.filter((r) => r.category === "NOT_INTERESTED").length
//     const unsubscribes = replies.filter((r) => r.category === "UNSUBSCRIBE").length

//     const positive = replies.filter((r) => r.sentiment === "POSITIVE").length
//     const neutral = replies.filter((r) => r.sentiment === "NEUTRAL").length
//     const negative = replies.filter((r) => r.sentiment === "NEGATIVE").length

//     return {
//       total,
//       byCategory: {
//         interested,
//         questions,
//         notInterested,
//         unsubscribes,
//       },
//       bySentiment: {
//         positive,
//         neutral,
//         negative,
//       },
//       responseRate: total > 0 ? ((interested + questions) / total) * 100 : 0,
//     }
//   }

//   async markAsRead(replyId: string): Promise<void> {
//     await db.emailReply.update({
//       where: { id: replyId },
//       data: {
//         isRead: true,
//         readAt: new Date(),
//       },
//     })

//     logger.info("Reply marked as read", { replyId })
//   }

//   async markAsUnread(replyId: string): Promise<void> {
//     await db.emailReply.update({
//       where: { id: replyId },
//       data: {
//         isRead: false,
//         readAt: null,
//       },
//     })

//     logger.info("Reply marked as unread", { replyId })
//   }

//   async archiveReply(replyId: string): Promise<void> {
//     await db.emailReply.update({
//       where: { id: replyId },
//       data: {
//         isArchived: true,
//         archivedAt: new Date(),
//       },
//     })

//     logger.info("Reply archived", { replyId })
//   }

//   async unarchiveReply(replyId: string): Promise<void> {
//     await db.emailReply.update({
//       where: { id: replyId },
//       data: {
//         isArchived: false,
//         archivedAt: null,
//       },
//     })

//     logger.info("Reply unarchived", { replyId })
//   }

//   async bulkMarkAsRead(replyIds: string[]): Promise<void> {
//     await db.emailReply.updateMany({
//       where: { id: { in: replyIds } },
//       data: {
//         isRead: true,
//         readAt: new Date(),
//       },
//     })

//     logger.info("Bulk marked as read", { count: replyIds.length })
//   }

//   async bulkArchive(replyIds: string[]): Promise<void> {
//     await db.emailReply.updateMany({
//       where: { id: { in: replyIds } },
//       data: {
//         isArchived: true,
//         archivedAt: new Date(),
//       },
//     })

//     logger.info("Bulk archived", { count: replyIds.length })
//   }
// }

// export const unifiedInbox = new UnifiedInbox()
// export type { InboxMessage }


// import { db } from "../db"
// import { logger } from "../logger"
// import { generateObject } from "ai"
// import { z } from "zod"

// const categorizationSchema = z.object({
//   category: z.enum(["INTERESTED", "NOT_INTERESTED", "QUESTION", "OUT_OF_OFFICE", "UNSUBSCRIBE", "REFERRAL"]),
//   sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE", "AUTO_REPLY"]),
//   priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
//   suggestedResponse: z.string(),
//   keyPoints: z.array(z.string()),
// })

// interface InboxMessage {
//   id: string
//   prospectId: string
//   prospectName: string
//   prospectEmail: string
//   prospectCompany: string
//   campaignId: string
//   campaignName: string
//   subject: string
//   body: string
//   receivedAt: Date
//   category?: string
//   sentiment?: string
//   priority?: string
//   isRead: boolean
//   isArchived: boolean
//   attachments?: Array<{
//     id: string
//     filename: string
//     contentType: string
//     size: number
//     storageUrl: string | null
//   }>
// }

// class UnifiedInbox {
//   async getInboxMessages(userId: string, filters?: { category?: string; isRead?: boolean; isArchived?: boolean }): Promise<InboxMessage[]> {
//     const replies = await db.emailReply.findMany({
//       where: {
//         prospect: {
//           userId,
//         },
//         ...(filters?.category && { category: filters.category as any }),
//         ...(filters?.isRead !== undefined && { isRead: filters.isRead }),
//         ...(filters?.isArchived !== undefined && { isArchived: filters.isArchived }),
//       },
//       include: {
//         prospect: {
//           include: {
//             campaign: true,
//           },
//         },
//         emailLog: true,
//         attachments: true,
//       },
//       orderBy: {
//         repliedAt: "desc",
//       },
//     })

//     const messages: InboxMessage[] = replies.map((reply) => ({
//       id: reply.id,
//       prospectId: reply.prospectId,
//       prospectName: `${reply.prospect.firstName || ""} ${reply.prospect.lastName || ""}`.trim() || "Unknown",
//       prospectEmail: reply.prospect.email,
//       prospectCompany: reply.prospect.company || "Unknown Company",
//       campaignId: reply.campaignId || "",
//       campaignName: reply.prospect.campaign?.name || "Unknown Campaign",
//       subject: reply.subject,
//       body: reply.body,
//       receivedAt: reply.repliedAt,
//       category: reply.category || undefined,
//       sentiment: reply.sentiment || undefined,
//       priority: this.calculatePriority(reply),
//       isRead: reply.isRead,
//       isArchived: reply.isArchived,
//       attachments: reply.attachments?.map((att) => ({
//         id: att.id,
//         filename: att.filename,
//         contentType: att.contentType,
//         size: att.size,
//         storageUrl: att.storageUrl,
//       })),
//     }))

//     return messages
//   }

//   private calculatePriority(reply: any): "HIGH" | "MEDIUM" | "LOW" {
//     if (reply.sentiment === "POSITIVE" || reply.category === "INTERESTED") {
//       return "HIGH"
//     }
//     if (reply.category === "QUESTION" || reply.sentiment === "NEUTRAL") {
//       return "MEDIUM"
//     }
//     return "LOW"
//   }

//   async categorizeReply(replyId: string): Promise<void> {
//     const reply = await db.emailReply.findUnique({
//       where: { id: replyId },
//       include: {
//         prospect: true,
//         emailLog: true,
//       },
//     })

//     if (!reply) {
//       throw new Error("Reply not found")
//     }

//     try {
//       const { object: categorization } = await generateObject({
//         model: "openai/gpt-4o-mini",
//         schema: categorizationSchema,
//         prompt: `You are an AI assistant analyzing email replies to cold outreach. Categorize this reply.

// Original Email Subject: ${reply.emailLog.subject}
// Original Email Body: ${reply.emailLog.body}

// Reply Subject: ${reply.subject}
// Reply Body: ${reply.body}

// Prospect: ${reply.prospect.firstName} ${reply.prospect.lastName} at ${reply.prospect.company}

// Analyze and provide:
// 1. Category: INTERESTED, NOT_INTERESTED, QUESTION, OUT_OF_OFFICE, UNSUBSCRIBE, or REFERRAL
// 2. Sentiment: POSITIVE, NEUTRAL, NEGATIVE, or AUTO_REPLY
// 3. Priority: HIGH (needs immediate attention), MEDIUM (respond soon), or LOW (can wait)
// 4. Suggested response (brief, professional)
// 5. Key points from the reply

// Be accurate and helpful.`,
//       })

//       // Update reply with categorization
//       await db.emailReply.update({
//         where: { id: replyId },
//         data: {
//           category: categorization.category,
//           sentiment: categorization.sentiment,
//           analyzedAt: new Date(),
//         },
//       })

//       // Auto-pause campaign if unsubscribe
//       if (categorization.category === "UNSUBSCRIBE") {
//         await db.prospect.update({
//           where: { id: reply.prospectId },
//           data: {
//             unsubscribed: true,
//             status: "UNSUBSCRIBED",
//           },
//         })
//       }

//       // Auto-pause campaign if interested
//       if (categorization.category === "INTERESTED" && reply.campaignId) {
//         await db.prospect.update({
//           where: { id: reply.prospectId },
//           data: {
//             status: "REPLIED",
//           },
//         })
//       }

//       logger.info("Reply categorized", {
//         replyId,
//         category: categorization.category,
//         sentiment: categorization.sentiment,
//       })
//     } catch (error) {
//       logger.error("Failed to categorize reply", error as Error, { replyId })
//     }
//   }

//   async getInboxStats(userId: string): Promise<any> {
//     const replies = await db.emailReply.findMany({
//       where: {
//         prospect: {
//           userId,
//         },
//       },
//     })

//     const total = replies.length
//     const interested = replies.filter((r) => r.category === "INTERESTED").length
//     const questions = replies.filter((r) => r.category === "QUESTION").length
//     const notInterested = replies.filter((r) => r.category === "NOT_INTERESTED").length
//     const unsubscribes = replies.filter((r) => r.category === "UNSUBSCRIBE").length

//     const positive = replies.filter((r) => r.sentiment === "POSITIVE").length
//     const neutral = replies.filter((r) => r.sentiment === "NEUTRAL").length
//     const negative = replies.filter((r) => r.sentiment === "NEGATIVE").length

//     return {
//       total,
//       byCategory: {
//         interested,
//         questions,
//         notInterested,
//         unsubscribes,
//       },
//       bySentiment: {
//         positive,
//         neutral,
//         negative,
//       },
//       responseRate: total > 0 ? ((interested + questions) / total) * 100 : 0,
//     }
//   }

//   async markAsRead(replyId: string): Promise<void> {
//     await db.emailReply.update({
//       where: { id: replyId },
//       data: {
//         isRead: true,
//         readAt: new Date(),
//       },
//     })

//     logger.info("Reply marked as read", { replyId })
//   }

//   async markAsUnread(replyId: string): Promise<void> {
//     await db.emailReply.update({
//       where: { id: replyId },
//       data: {
//         isRead: false,
//         readAt: null,
//       },
//     })

//     logger.info("Reply marked as unread", { replyId })
//   }

//   async archiveReply(replyId: string): Promise<void> {
//     await db.emailReply.update({
//       where: { id: replyId },
//       data: {
//         isArchived: true,
//         archivedAt: new Date(),
//       },
//     })

//     logger.info("Reply archived", { replyId })
//   }

//   async unarchiveReply(replyId: string): Promise<void> {
//     await db.emailReply.update({
//       where: { id: replyId },
//       data: {
//         isArchived: false,
//         archivedAt: null,
//       },
//     })

//     logger.info("Reply unarchived", { replyId })
//   }

//   async bulkMarkAsRead(replyIds: string[]): Promise<void> {
//     await db.emailReply.updateMany({
//       where: { id: { in: replyIds } },
//       data: {
//         isRead: true,
//         readAt: new Date(),
//       },
//     })

//     logger.info("Bulk marked as read", { count: replyIds.length })
//   }

//   async bulkArchive(replyIds: string[]): Promise<void> {
//     await db.emailReply.updateMany({
//       where: { id: { in: replyIds } },
//       data: {
//         isArchived: true,
//         archivedAt: new Date(),
//       },
//     })

//     logger.info("Bulk archived", { count: replyIds.length })
//   }
// }

// export const unifiedInbox = new UnifiedInbox()
// export type { InboxMessage }

import { db } from "../db"
import { logger } from "../logger"
import { generateObject } from "ai"
import { z } from "zod"

const categorizationSchema = z.object({
  category: z.enum(["INTERESTED", "NOT_INTERESTED", "QUESTION", "OUT_OF_OFFICE", "UNSUBSCRIBE", "REFERRAL"]),
  sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE", "AUTO_REPLY"]),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
  suggestedResponse: z.string(),
  keyPoints: z.array(z.string()),
})

interface InboxMessage {
  id: string
  prospectId: string
  prospectName: string
  prospectEmail: string
  prospectCompany: string
  campaignId: string
  campaignName: string
  subject: string
  body: string
  receivedAt: Date
  category?: string
  sentiment?: string
  priority?: string
  isRead: boolean
  isArchived: boolean
  isStarred: boolean
  notes: string | null
  attachments?: Array<{
    id: string
    filename: string
    contentType: string
    size: number
    storageUrl: string | null
  }>
}

class UnifiedInbox {
  async getInboxMessages(userId: string, filters?: { category?: string; isRead?: boolean }): Promise<InboxMessage[]> {
    const replies = await db.emailReply.findMany({
      where: {
        prospect: {
          userId,
        },
        ...(filters?.category && { category: filters.category as any }),
        ...(filters?.isRead !== undefined && { isRead: filters.isRead }),
      },
      include: {
        prospect: {
          include: {
            campaign: true,
          },
        },
        emailLog: true,
        attachments: true,
      },
      orderBy: {
        repliedAt: "desc",
      },
    })

    const messages: InboxMessage[] = replies.map((reply) => ({
      id: reply.id,
      prospectId: reply.prospectId,
      prospectName: `${reply.prospect.firstName || ""} ${reply.prospect.lastName || ""}`.trim() || "Unknown",
      prospectEmail: reply.prospect.email,
      prospectCompany: reply.prospect.company || "Unknown Company",
      campaignId: reply.campaignId || "",
      campaignName: reply.prospect.campaign?.name || "Unknown Campaign",
      subject: reply.subject,
      body: reply.body,
      receivedAt: reply.repliedAt,
      category: reply.category || undefined,
      sentiment: reply.sentiment || undefined,
      priority: this.calculatePriority(reply),
      isRead: reply.isRead,
      isArchived: reply.isArchived,
      isStarred: reply.isStarred || false,
      notes: reply.notes || null,
      attachments: reply.attachments?.map((att) => ({
        id: att.id,
        filename: att.filename,
        contentType: att.contentType,
        size: att.size,
        storageUrl: att.storageUrl,
      })),
    }))

    return messages
  }

  private calculatePriority(reply: any): "HIGH" | "MEDIUM" | "LOW" {
    if (reply.sentiment === "POSITIVE" || reply.category === "INTERESTED") {
      return "HIGH"
    }
    if (reply.category === "QUESTION" || reply.sentiment === "NEUTRAL") {
      return "MEDIUM"
    }
    return "LOW"
  }

  async categorizeReply(replyId: string): Promise<void> {
    const reply = await db.emailReply.findUnique({
      where: { id: replyId },
      include: {
        prospect: true,
        emailLog: true,
      },
    })

    if (!reply) {
      throw new Error("Reply not found")
    }

    try {
      const { object: categorization } = await generateObject({
        model: "openai/gpt-4o-mini",
        schema: categorizationSchema,
        prompt: `You are an AI assistant analyzing email replies to cold outreach. Categorize this reply.

Original Email Subject: ${reply.emailLog.subject}
Original Email Body: ${reply.emailLog.body}

Reply Subject: ${reply.subject}
Reply Body: ${reply.body}

Prospect: ${reply.prospect.firstName} ${reply.prospect.lastName} at ${reply.prospect.company}

Analyze and provide:
1. Category: INTERESTED, NOT_INTERESTED, QUESTION, OUT_OF_OFFICE, UNSUBSCRIBE, or REFERRAL
2. Sentiment: POSITIVE, NEUTRAL, NEGATIVE, or AUTO_REPLY
3. Priority: HIGH (needs immediate attention), MEDIUM (respond soon), or LOW (can wait)
4. Suggested response (brief, professional)
5. Key points from the reply

Be accurate and helpful.`,
      })

      // Update reply with categorization
      await db.emailReply.update({
        where: { id: replyId },
        data: {
          category: categorization.category,
          sentiment: categorization.sentiment,
          analyzedAt: new Date(),
        },
      })

      // Auto-pause campaign if unsubscribe
      if (categorization.category === "UNSUBSCRIBE") {
        await db.prospect.update({
          where: { id: reply.prospectId },
          data: {
            unsubscribed: true,
            status: "UNSUBSCRIBED",
          },
        })
      }

      // Auto-pause campaign if interested
      if (categorization.category === "INTERESTED" && reply.campaignId) {
        await db.prospect.update({
          where: { id: reply.prospectId },
          data: {
            status: "REPLIED",
          },
        })
      }

      logger.info("Reply categorized", {
        replyId,
        category: categorization.category,
        sentiment: categorization.sentiment,
      })
    } catch (error) {
      logger.error("Failed to categorize reply", error as Error, { replyId })
    }
  }

  async getInboxStats(userId: string): Promise<any> {
    const replies = await db.emailReply.findMany({
      where: {
        prospect: {
          userId,
        },
      },
    })

    const total = replies.length
    const interested = replies.filter((r) => r.category === "INTERESTED").length
    const questions = replies.filter((r) => r.category === "QUESTION").length
    const notInterested = replies.filter((r) => r.category === "NOT_INTERESTED").length
    const unsubscribes = replies.filter((r) => r.category === "UNSUBSCRIBE").length

    const positive = replies.filter((r) => r.sentiment === "POSITIVE").length
    const neutral = replies.filter((r) => r.sentiment === "NEUTRAL").length
    const negative = replies.filter((r) => r.sentiment === "NEGATIVE").length

    return {
      total,
      byCategory: {
        interested,
        questions,
        notInterested,
        unsubscribes,
      },
      bySentiment: {
        positive,
        neutral,
        negative,
      },
      responseRate: total > 0 ? ((interested + questions) / total) * 100 : 0,
    }
  }

  async markAsRead(replyId: string): Promise<void> {
    await db.emailReply.update({
      where: { id: replyId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    logger.info("Reply marked as read", { replyId })
  }

  async markAsUnread(replyId: string): Promise<void> {
    await db.emailReply.update({
      where: { id: replyId },
      data: {
        isRead: false,
        readAt: null,
      },
    })

    logger.info("Reply marked as unread", { replyId })
  }

  async archiveReply(replyId: string): Promise<void> {
    await db.emailReply.update({
      where: { id: replyId },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    })

    logger.info("Reply archived", { replyId })
  }

  async unarchiveReply(replyId: string): Promise<void> {
    await db.emailReply.update({
      where: { id: replyId },
      data: {
        isArchived: false,
        archivedAt: null,
      },
    })

    logger.info("Reply unarchived", { replyId })
  }

  async bulkMarkAsRead(replyIds: string[]): Promise<void> {
    await db.emailReply.updateMany({
      where: { id: { in: replyIds } },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    logger.info("Bulk marked as read", { count: replyIds.length })
  }

  async bulkArchive(replyIds: string[]): Promise<void> {
    await db.emailReply.updateMany({
      where: { id: { in: replyIds } },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    })

    logger.info("Bulk archived", { count: replyIds.length })
  }
}

export const unifiedInbox = new UnifiedInbox()
export type { InboxMessage }
