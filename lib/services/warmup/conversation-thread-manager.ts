// import { prisma } from "@/lib/db"
// import { redis } from "@/lib/redis"
// import { logger } from "@/lib/logger"
// import { contentGenerator } from "./content-generator"

// /**
//  * CONVERSATION THREAD MANAGER
//  * Creates and manages multi-message conversation threads for realistic warmup
//  * Handles 100,000+ accounts with Redis-backed state management
//  */
// class ConversationThreadManager {
//   private readonly CACHE_TTL = 3600 // 1 hour
//   private readonly REDIS_PREFIX = "warmup:thread:"

//   /**
//    * Createa new conversation thread between two accounts
//    * Matches accounts based on reputation tier, industry, and role
//    */
//   async createThread(params: {
//     initiatorAccountId: string
//     recipientAccountId: string
//     topic?: string
//     industry?: string
//   }): Promise<{ threadId: string; success: boolean; error?: string }> {
//     try {
//       const { initiatorAccountId, recipientAccountId, topic, industry } = params

//       // Validate accounts exist and are eligible
//       const [initiator, recipient] = await Promise.all([
//         prisma.sendingAccount.findUnique({
//           where: { id: initiatorAccountId },
//           include: { reputationProfile: true },
//         }),
//         prisma.sendingAccount.findUnique({
//           where: { id: recipientAccountId },
//           include: { reputationProfile: true },
//         }),
//       ])

//       if (!initiator || !recipient) {
//         return { threadId: "", success: false, error: "Account not found" }
//       }

//       // Determine thread topic based on industry or random selection
//       const selectedTopic = topic || (await this.selectThreadTopic(industry || initiator.reputationProfile?.industry))

//       // Generate realistic thread parameters
//       const threadParams = this.generateThreadParameters(initiator.reputationProfile, recipient.reputationProfile)

//       // Generate subject line
//       const subjectLine = await contentGenerator.generateSubject(selectedTopic, industry)

//       // Create thread in database
//       const thread = await prisma.warmupThread.create({
//         data: {
//           userId: initiator.userId,
//           initiatorAccountId,
//           recipientAccountId,
//           threadSubject: subjectLine,
//           threadTopic: selectedTopic,
//           industry: industry || initiator.reputationProfile?.industry,
//           ...threadParams,
//           status: "ACTIVE",
//           nextScheduledAt: new Date(Date.now() + threadParams.responseTimeMin * 60000),
//         },
//       })

//       // Cache thread for fast lookups
//       await this.cacheThread(thread.id, thread)

//       logger.info("[ConversationThreadManager] Thread created", {
//         threadId: thread.id,
//         initiator: initiator.email,
//         recipient: recipient.email,
//         topic: selectedTopic,
//       })

//       return { threadId: thread.id, success: true }
//     } catch (error) {
//       logger.error("[ConversationThreadManager] Failed to create thread", { error, params })
//       return { threadId: "", success: false, error: error.message }
//     }
//   }

//   /**
//    * Process next message in thread
//    * Handles realistic timing, content generation, and thread completion
//    */
//   async processThreadMessage(threadId: string): Promise<{
//     success: boolean
//     messageId?: string
//     threadCompleted?: boolean
//     error?: string
//   }> {
//     try {
//       // Get thread (from cache or database)
//       const thread = await this.getThread(threadId)
//       if (!thread) {
//         return { success: false, error: "Thread not found" }
//       }

//       // Check if thread should continue
//       if (thread.messageCount >= thread.maxMessages || thread.status !== "ACTIVE") {
//         await this.completeThread(threadId)
//         return { success: true, threadCompleted: true }
//       }

//       // Determine sender (alternate between initiator and recipient)
//       const isInitiatorTurn = thread.messageCount % 2 === 0
//       const senderAccountId = isInitiatorTurn ? thread.initiatorAccountId : thread.recipientAccountId
//       const recipientAccountId = isInitiatorTurn ? thread.recipientAccountId : thread.initiatorAccountId

//       // Get previous message for context
//       const previousMessages = await prisma.warmupInteraction.findMany({
//         where: { threadId },
//         orderBy: { sentAt: "desc" },
//         take: 3,
//       })

//       // Generate message content based on thread context
//       const messageContent = await contentGenerator.generateThreadMessage({
//         topic: thread.threadTopic,
//         industry: thread.industry,
//         messageNumber: thread.messageCount + 1,
//         isReply: thread.messageCount > 0,
//         previousMessages: previousMessages.map((m) => m.subject),
//         includeLinks: thread.includeLinks,
//         includeAttachments: thread.includeAttachments,
//       })

//       // Create warmup interaction
//       const interaction = await prisma.warmupInteraction.create({
//         data: {
//           userId: thread.userId,
//           senderAccountId,
//           recipientAccountId,
//           threadId,
//           subject: thread.messageCount === 0 ? thread.threadSubject : `Re: ${thread.threadSubject}`,
//           body: messageContent.body,
//           status: "PENDING",
//           scheduledFor: new Date(),
//           messageType: thread.messageCount === 0 ? "INITIAL" : "REPLY",
//         },
//       })

//       // Update thread
//       const nextResponseTime = this.calculateNextResponseTime(thread.responseTimeMin, thread.responseTimeMax)

//       await prisma.warmupThread.update({
//         where: { id: threadId },
//         data: {
//           messageCount: { increment: 1 },
//           lastMessageAt: new Date(),
//           nextScheduledAt: new Date(Date.now() + nextResponseTime * 60000),
//         },
//       })

//       // Invalidate cache
//       await this.invalidateCache(threadId)

//       logger.info("[ConversationThreadManager] Thread message created", {
//         threadId,
//         messageNumber: thread.messageCount + 1,
//         interactionId: interaction.id,
//       })

//       return {
//         success: true,
//         messageId: interaction.id,
//         threadCompleted: thread.messageCount + 1 >= thread.maxMessages,
//       }
//     } catch (error) {
//       logger.error("[ConversationThreadManager] Failed to process thread message", { error, threadId })
//       return { success: false, error: error.message }
//     }
//   }

//   /**
//    * Get all threads ready for next message
//    * Used by scheduler to find threads needing processing
//    */
//   async getThreadsReadyForNextMessage(limit = 100): Promise<string[]> {
//     try {
//       const threads = await prisma.warmupThread.findMany({
//         where: {
//           status: "ACTIVE",
//           nextScheduledAt: {
//             lte: new Date(),
//           },
//           messageCount: {
//             lt: prisma.warmupThread.fields.maxMessages,
//           },
//         },
//         select: { id: true },
//         take: limit,
//         orderBy: { nextScheduledAt: "asc" },
//       })

//       return threads.map((t) => t.id)
//     } catch (error) {
//       logger.error("[ConversationThreadManager] Failed to get ready threads", { error })
//       return []
//     }
//   }

//   /**
//    * Complete a thread
//    */
//   private async completeThread(threadId: string): Promise<void> {
//     await prisma.warmupThread.update({
//       where: { id: threadId },
//       data: {
//         status: "COMPLETED",
//         completedAt: new Date(),
//       },
//     })

//     await this.invalidateCache(threadId)

//     logger.info("[ConversationThreadManager] Thread completed", { threadId })
//   }

//   /**
//    * Generate realistic thread parameters based on reputation profiles
//    */
//   private generateThreadParameters(
//     initiatorProfile: any,
//     recipientProfile: any,
//   ): {
//     maxMessages: number
//     conversationDepth: number
//     responseTimeMin: number
//     responseTimeMax: number
//     includeLinks: boolean
//     includeAttachments: boolean
//   } {
//     // Adjust based on reputation tier
//     const avgTier = this.getAverageTier(initiatorProfile?.reputationTier, recipientProfile?.reputationTier)

//     // Higher reputation = more sophisticated conversations
//     const maxMessages =
//       avgTier === "PRISTINE" || avgTier === "HIGH"
//         ? Math.floor(Math.random() * 3) + 4 // 4-6 messages
//         : Math.floor(Math.random() * 2) + 3 // 3-4 messages

//     const conversationDepth = Math.floor(maxMessages / 2)

//     // Response time varies by reputation
//     const responseTimeMin =
//       avgTier === "PRISTINE"
//         ? 60 // 1 hour min for high reputation
//         : 30 // 30 min for lower

//     const responseTimeMax =
//       avgTier === "PRISTINE"
//         ? 1440 // 24 hours max
//         : 720 // 12 hours max

//     // Links and attachments based on warmup maturity
//     const daysInWarmup = Math.max(initiatorProfile?.daysInWarmup || 0, recipientProfile?.daysInWarmup || 0)

//     const includeLinks = daysInWarmup > 7 && Math.random() > 0.7
//     const includeAttachments = daysInWarmup > 14 && Math.random() > 0.85

//     return {
//       maxMessages,
//       conversationDepth,
//       responseTimeMin,
//       responseTimeMax,
//       includeLinks,
//       includeAttachments,
//     }
//   }

//   /**
//    * Select appropriate thread topic
//    */
//   private async selectThreadTopic(industry?: string): Promise<string> {
//     const topics = [
//       "project_update",
//       "meeting_request",
//       "proposal_discussion",
//       "follow_up",
//       "introduction",
//       "collaboration",
//       "feedback_request",
//       "status_update",
//     ]

//     // Industry-specific topics
//     if (industry) {
//       const industryTopics = {
//         tech: ["technical_review", "sprint_planning", "deployment_update"],
//         finance: ["quarterly_report", "budget_review", "compliance_update"],
//         marketing: ["campaign_review", "content_approval", "analytics_summary"],
//         healthcare: ["patient_update", "compliance_review", "research_discussion"],
//       }

//       const specificTopics = industryTopics[industry.toLowerCase()] || []
//       topics.push(...specificTopics)
//     }

//     return topics[Math.floor(Math.random() * topics.length)]
//   }

//   /**
//    * Calculate next response time with realistic variation
//    */
//   private calculateNextResponseTime(min: number, max: number): number {
//     // Weighted towards middle values (more realistic)
//     const range = max - min
//     const variance = Math.random() * Math.random() // Square for bell curve effect
//     return Math.floor(min + range * variance)
//   }

//   /**
//    * Get average reputation tier
//    */
//   private getAverageTier(tier1?: string, tier2?: string): string {
//     const tiers = ["CRITICAL", "LOW", "MEDIUM", "HIGH", "PRISTINE"]
//     const idx1 = tier1 ? tiers.indexOf(tier1) : 2
//     const idx2 = tier2 ? tiers.indexOf(tier2) : 2
//     const avgIdx = Math.floor((idx1 + idx2) / 2)
//     return tiers[avgIdx] || "MEDIUM"
//   }

//   /**
//    * Cache operations for performance
//    */
//   private async cacheThread(threadId: string, thread: any): Promise<void> {
//     const key = `${this.REDIS_PREFIX}${threadId}`
//     await redis.setex(key, this.CACHE_TTL, JSON.stringify(thread))
//   }

//   private async getThread(threadId: string): Promise<any> {
//     const key = `${this.REDIS_PREFIX}${threadId}`
//     const cached = await redis.get(key)

//     if (cached) {
//       return JSON.parse(cached)
//     }

//     const thread = await prisma.warmupThread.findUnique({
//       where: { id: threadId },
//       include: {
//         initiatorAccount: { include: { reputationProfile: true } },
//         recipientAccount: { include: { reputationProfile: true } },
//       },
//     })

//     if (thread) {
//       await this.cacheThread(threadId, thread)
//     }

//     return thread
//   }

//   private async invalidateCache(threadId: string): Promise<void> {
//     const key = `${this.REDIS_PREFIX}${threadId}`
//     await redis.del(key)
//   }

//   /**
//    * Get thread statistics for monitoring
//    */
//   async getThreadStats(): Promise<{
//     activeThreads: number
//     completedToday: number
//     avgMessagesPerThread: number
//     avgThreadDuration: number
//   }> {
//     const [active, completedToday, avgStats] = await Promise.all([
//       prisma.warmupThread.count({ where: { status: "ACTIVE" } }),
//       prisma.warmupThread.count({
//         where: {
//           status: "COMPLETED",
//           completedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
//         },
//       }),
//       prisma.warmupThread.aggregate({
//         _avg: { messageCount: true },
//         where: { status: "COMPLETED" },
//       }),
//     ])

//     return {
//       activeThreads: active,
//       completedToday,
//       avgMessagesPerThread: avgStats._avg.messageCount || 0,
//       avgThreadDuration: 0, // Calculate if needed
//     }
//   }
// }

// export const conversationThreadManager = new ConversationThreadManager()
















// import { prisma } from "@/lib/db"
// import { redis } from "@/lib/redis"
// import { logger } from "@/lib/logger"
// import { contentGenerator } from "./content-generator"

// /**
//  * CONVERSATION THREAD MANAGER
//  * Creates and manages multi-message conversation threads for realistic warmup
//  * Handles 100,000+ accounts with Redis-backed state management
//  */
// class ConversationThreadManager {
//   private readonly CACHE_TTL = 3600 // 1 hour
//   private readonly REDIS_PREFIX = "warmup:thread:"

//   /**
//    * Create a new conversation thread between two accounts
//    * Matches accounts based on reputation tier, industry, and role
//    */
//   async createThread(params: {
//     initiatorAccountId: string
//     recipientAccountId: string
//     topic?: string
//     industry?: string
//   }): Promise<{ threadId: string; success: boolean; error?: string }> {
//     try {
//       const { initiatorAccountId, recipientAccountId, topic, industry } = params

//       // Validate accounts exist and are eligible
//       const [initiator, recipient] = await Promise.all([
//         prisma.sendingAccount.findUnique({
//           where: { id: initiatorAccountId },
//           include: { reputationProfile: true },
//         }),
//         prisma.sendingAccount.findUnique({
//           where: { id: recipientAccountId },
//           include: { reputationProfile: true },
//         }),
//       ])

//       if (!initiator || !recipient) {
//         return { threadId: "", success: false, error: "Account not found" }
//       }

//       const selectedTopic =
//         topic || (await this.selectThreadTopic(industry ?? initiator.reputationProfile?.industry ?? undefined))

//       // Generate realistic thread parameters
//       const threadParams = this.generateThreadParameters(initiator.reputationProfile, recipient.reputationProfile)

//       // Generate subject line
//       const subjectLine = await contentGenerator.generateSubject(selectedTopic, industry ?? undefined)

//       // Create thread in database
//       const thread = await prisma.warmupThread.create({
//         data: {
//           userId: initiator.userId,
//           initiatorAccountId,
//           recipientAccountId,
//           threadSubject: subjectLine,
//           threadTopic: selectedTopic,
//           industry: industry || initiator.reputationProfile?.industry || undefined,
//           ...threadParams,
//           status: "ACTIVE",
//           nextScheduledAt: new Date(Date.now() + threadParams.responseTimeMin * 60000),
//         },
//       })

//       // Cache thread for fast lookups
//       await this.cacheThread(thread.id, thread)

//       logger.info("[ConversationThreadManager] Thread created", {
//         threadId: thread.id,
//         initiator: initiator.email,
//         recipient: recipient.email,
//         topic: selectedTopic,
//       })

//       return { threadId: thread.id, success: true }
//     } catch (error) {
//       logger.error("[ConversationThreadManager] Failed to create thread", error as Error, params)
//       return { threadId: "", success: false, error: error instanceof Error ? error.message : String(error) }
//     }
//   }

//   /**
//    * Process next message in thread
//    * Handles realistic timing, content generation, and thread completion
//    */
//   async processThreadMessage(threadId: string): Promise<{
//     success: boolean
//     messageId?: string
//     threadCompleted?: boolean
//     error?: string
//   }> {
//     try {
//       // Get thread (from cache or database)
//       const thread = await this.getThread(threadId)
//       if (!thread) {
//         return { success: false, error: "Thread not found" }
//       }

//       // Check if thread should continue
//       if (thread.messageCount >= thread.maxMessages || thread.status !== "ACTIVE") {
//         await this.completeThread(threadId)
//         return { success: true, threadCompleted: true }
//       }

//       // Determine sender (alternate between initiator and recipient)
//       const isInitiatorTurn = thread.messageCount % 2 === 0
//       const senderAccountId = isInitiatorTurn ? thread.initiatorAccountId : thread.recipientAccountId
//       const recipientAccountId = isInitiatorTurn ? thread.recipientAccountId : thread.initiatorAccountId

//       // Get previous messages for context
//       const previousMessages = await prisma.warmupInteraction.findMany({
//         where: { threadId },
//         orderBy: { sentAt: "desc" },
//         take: 3,
//       })

//       // Generate message content based on thread context
//       const messageContent = await contentGenerator.generateThreadMessage({
//         topic: thread.threadTopic,
//         industry: thread.industry || undefined,
//         messageNumber: thread.messageCount + 1,
//         isReply: thread.messageCount > 0,
//         previousMessages: previousMessages.map((m) => m.subject),
//         includeLinks: thread.includeLinks,
//         includeAttachments: thread.includeAttachments,
//       })

//       // Create warmup interaction
//       const interaction = await prisma.warmupInteraction.create({
//         data: {
//           userId: thread.userId,
//           sendingAccountId: senderAccountId,
//           recipientAccountId,
//           threadId,
//           subject: thread.messageCount === 0 ? thread.threadSubject : `Re: ${thread.threadSubject}`,
//           body: messageContent.body,
//           status: "PENDING",
//           scheduledFor: new Date(),
//           messageType: thread.messageCount === 0 ? "INITIAL" : "REPLY",
//         },
//       })

//       // Update thread
//       const nextResponseTime = this.calculateNextResponseTime(thread.responseTimeMin, thread.responseTimeMax)

//       await prisma.warmupThread.update({
//         where: { id: threadId },
//         data: {
//           messageCount: { increment: 1 },
//           lastMessageAt: new Date(),
//           nextScheduledAt: new Date(Date.now() + nextResponseTime * 60000),
//         },
//       })

//       // Invalidate cache
//       await this.invalidateCache(threadId)

//       logger.info("[ConversationThreadManager] Thread message created", {
//         threadId,
//         messageNumber: thread.messageCount + 1,
//         interactionId: interaction.id,
//       })

//       return {
//         success: true,
//         messageId: interaction.id,
//         threadCompleted: thread.messageCount + 1 >= thread.maxMessages,
//       }
//     } catch (error) {
//       logger.error("[ConversationThreadManager] Failed to process thread message", error as Error, {
//         threadId,
//       })
//       return { success: false, error: error instanceof Error ? error.message : String(error) }
//     }
//   }

//   /**
//    * Get all threads ready for next message
//    * Used by scheduler to find threads needing processing
//    */
//   async getThreadsReadyForNextMessage(limit = 100): Promise<string[]> {
//     try {
//       const threads = await prisma.warmupThread.findMany({
//         where: {
//           status: "ACTIVE",
//           nextScheduledAt: {
//             lte: new Date(),
//           },
//           messageCount: {
//             lt: prisma.warmupThread.fields.maxMessages,
//           },
//         },
//         select: { id: true },
//         take: limit,
//         orderBy: { nextScheduledAt: "asc" },
//       })

//       return threads.map((t) => t.id)
//     } catch (error) {
//       logger.error("[ConversationThreadManager] Failed to get ready threads", { error })
//       return []
//     }
//   }

//   /**
//    * Complete a thread
//    */
//   private async completeThread(threadId: string): Promise<void> {
//     await prisma.warmupThread.update({
//       where: { id: threadId },
//       data: {
//         status: "COMPLETED",
//         completedAt: new Date(),
//       },
//     })

//     await this.invalidateCache(threadId)

//     logger.info("[ConversationThreadManager] Thread completed", { threadId })
//   }

//   /**
//    * Generate realistic thread parameters based on reputation profiles
//    */
//   private generateThreadParameters(
//     initiatorProfile: any,
//     recipientProfile: any,
//   ): {
//     maxMessages: number
//     conversationDepth: number
//     responseTimeMin: number
//     responseTimeMax: number
//     includeLinks: boolean
//     includeAttachments: boolean
//   } {
//     // Adjust based on reputation tier
//     const avgTier = this.getAverageTier(initiatorProfile?.reputationTier, recipientProfile?.reputationTier)

//     // Higher reputation = more sophisticated conversations
//     const maxMessages =
//       avgTier === "PRISTINE" || avgTier === "HIGH"
//         ? Math.floor(Math.random() * 3) + 4 // 4-6 messages
//         : Math.floor(Math.random() * 2) + 3 // 3-4 messages

//     const conversationDepth = Math.floor(maxMessages / 2)

//     // Response time varies by reputation
//     const responseTimeMin =
//       avgTier === "PRISTINE"
//         ? 60 // 1 hour min for high reputation
//         : 30 // 30 min for lower

//     const responseTimeMax =
//       avgTier === "PRISTINE"
//         ? 1440 // 24 hours max
//         : 720 // 12 hours max

//     // Links and attachments based on warmup maturity
//     const daysInWarmup = Math.max(initiatorProfile?.daysInWarmup || 0, recipientProfile?.daysInWarmup || 0)

//     const includeLinks = daysInWarmup > 7 && Math.random() > 0.7
//     const includeAttachments = daysInWarmup > 14 && Math.random() > 0.85

//     return {
//       maxMessages,
//       conversationDepth,
//       responseTimeMin,
//       responseTimeMax,
//       includeLinks,
//       includeAttachments,
//     }
//   }

//   /**
//    * Select appropriate thread topic
//    */
//   private async selectThreadTopic(industry?: string): Promise<string> {
//     const topics = [
//       "project_update",
//       "meeting_request",
//       "proposal_discussion",
//       "follow_up",
//       "introduction",
//       "collaboration",
//       "feedback_request",
//       "status_update",
//     ]

//     // Industry-specific topics
//     if (industry) {
//       const industryTopics: Record<string, string[]> = {
//         tech: ["technical_review", "sprint_planning", "deployment_update"],
//         finance: ["quarterly_report", "budget_review", "compliance_update"],
//         marketing: ["campaign_review", "content_approval", "analytics_summary"],
//         healthcare: ["patient_update", "compliance_review", "research_discussion"],
//       }

//       const specificTopics = industryTopics[industry.toLowerCase()] || []
//       topics.push(...specificTopics)
//     }

//     return topics[Math.floor(Math.random() * topics.length)]
//   }

//   /**
//    * Calculate next response time with realistic variation
//    */
//   private calculateNextResponseTime(min: number, max: number): number {
//     // Weighted towards middle values (more realistic)
//     const range = max - min
//     const variance = Math.random() * Math.random() // Square for bell curve effect
//     return Math.floor(min + range * variance)
//   }

//   /**
//    * Get average reputation tier
//    */
//   private getAverageTier(tier1?: string, tier2?: string): string {
//     const tiers = ["CRITICAL", "LOW", "MEDIUM", "HIGH", "PRISTINE"]
//     const idx1 = tier1 ? tiers.indexOf(tier1) : 2
//     const idx2 = tier2 ? tiers.indexOf(tier2) : 2
//     const avgIdx = Math.floor((idx1 + idx2) / 2)
//     return tiers[avgIdx] || "MEDIUM"
//   }

//   /**
//    * Cache operations for performance
//    */
//   private async cacheThread(threadId: string, thread: any): Promise<void> {
//     const key = `${this.REDIS_PREFIX}${threadId}`
//     await redis.setex(key, this.CACHE_TTL, JSON.stringify(thread))
//   }

//   private async getThread(threadId: string): Promise<any> {
//     const key = `${this.REDIS_PREFIX}${threadId}`
//     const cached = await redis.get(key)

//     if (cached) {
//       return JSON.parse(cached)
//     }

//     const thread = await prisma.warmupThread.findUnique({
//       where: { id: threadId },
//       include: {
//         initiatorAccount: { include: { reputationProfile: true } },
//         recipientAccount: { include: { reputationProfile: true } },
//       },
//     })

//     if (thread) {
//       await this.cacheThread(threadId, thread)
//     }

//     return thread
//   }

//   private async invalidateCache(threadId: string): Promise<void> {
//     const key = `${this.REDIS_PREFIX}${threadId}`
//     await redis.del(key)
//   }

//   /**
//    * Get thread statistics for monitoring
//    */
//   async getThreadStats(): Promise<{
//     activeThreads: number
//     completedToday: number
//     avgMessagesPerThread: number
//     avgThreadDuration: number
//   }> {
//     const [active, completedToday, avgStats] = await Promise.all([
//       prisma.warmupThread.count({ where: { status: "ACTIVE" } }),
//       prisma.warmupThread.count({
//         where: {
//           status: "COMPLETED",
//           completedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
//         },
//       }),
//       prisma.warmupThread.aggregate({
//         _avg: { messageCount: true },
//         where: { status: "COMPLETED" },
//       }),
//     ])

//     return {
//       activeThreads: active,
//       completedToday,
//       avgMessagesPerThread: avgStats._avg.messageCount || 0,
//       avgThreadDuration: 0, // Calculate if needed
//     }
//   }
// }

// export const conversationThreadManager = new ConversationThreadManager()










import { prisma } from "@/lib/db"
import { redis } from "@/lib/redis"
import { logger } from "@/lib/logger"
import { contentGenerator } from "./content-generator"

/**
 * CONVERSATION THREAD MANAGER
 * Creates and manages multi-message conversation threads for realistic warmup
 * Handles 100,000+ accounts with Redis-backed state management
 */

interface CachedThread {
  id: string
  userId: string
  initiatorAccountId: string
  recipientAccountId: string
  threadSubject: string
  threadTopic: string
  industry?: string | null
  status: string
  messageCount: number
  maxMessages: number
  responseTimeMin: number
  responseTimeMax: number
  includeLinks: boolean
  includeAttachments: boolean
  conversationDepth: number
  nextScheduledAt: Date | string | null
  lastMessageAt?: Date | string | null
  createdAt: Date | string
  completedAt?: Date | string | null
}

class ConversationThreadManager {
  private readonly CACHE_TTL = 3600 // 1 hour
  private readonly REDIS_PREFIX = "warmup:thread:"

  /**
   * Create a new conversation thread between two accounts
   * Matches accounts based on reputation tier, industry, and role
   */
  async createThread(params: {
    initiatorAccountId: string
    recipientAccountId: string
    topic?: string
    industry?: string
  }): Promise<{ threadId: string; success: boolean; error?: string }> {
    try {
      const { initiatorAccountId, recipientAccountId, topic, industry } = params

      // Validate accounts exist and are eligible
      const [initiator, recipient] = await Promise.all([
        prisma.sendingAccount.findUnique({
          where: { id: initiatorAccountId },
          include: { reputationProfile: true },
        }),
        prisma.sendingAccount.findUnique({
          where: { id: recipientAccountId },
          include: { reputationProfile: true },
        }),
      ])

      if (!initiator || !recipient) {
        return { threadId: "", success: false, error: "Account not found" }
      }

      const selectedTopic =
        topic || (await this.selectThreadTopic(industry ?? initiator.reputationProfile?.industry ?? undefined))

      // Generate realistic thread parameters
      const threadParams = this.generateThreadParameters(initiator.reputationProfile, recipient.reputationProfile)

      // Generate subject line
      const subjectLine = await contentGenerator.generateSubject(selectedTopic, industry ?? undefined)

      // Create thread in database
      const thread = await prisma.warmupThread.create({
        data: {
          userId: initiator.userId,
          initiatorAccountId,
          recipientAccountId,
          threadSubject: subjectLine,
          threadTopic: selectedTopic,
          industry: industry || initiator.reputationProfile?.industry || undefined,
          ...threadParams,
          status: "ACTIVE",
          nextScheduledAt: new Date(Date.now() + threadParams.responseTimeMin * 60000),
        },
      })

      // Cache thread for fast lookups
      await this.cacheThread(thread.id, thread)

      logger.info("[ConversationThreadManager] Thread created", {
        threadId: thread.id,
        initiator: initiator.email,
        recipient: recipient.email,
        topic: selectedTopic,
      })

      return { threadId: thread.id, success: true }
    } catch (error) {
      logger.error("[ConversationThreadManager] Failed to create thread", error, params)
      return { threadId: "", success: false, error: error instanceof Error ? error.message : String(error) }
    }
  }

  /**
   * Process next message in thread
   * Handles realistic timing, content generation, and thread completion
   */
  async processThreadMessage(threadId: string): Promise<{
    success: boolean
    messageId?: string
    threadCompleted?: boolean
    error?: string
  }> {
    try {
      const thread = await this.getThread(threadId)
      if (!thread) {
        return { success: false, error: "Thread not found" }
      }

      if (thread.messageCount >= thread.maxMessages || thread.status !== "ACTIVE") {
        await this.completeThread(threadId)
        return { success: true, threadCompleted: true }
      }

      const isInitiatorTurn = thread.messageCount % 2 === 0
      const senderAccountId = isInitiatorTurn ? thread.initiatorAccountId : thread.recipientAccountId

      // Get the warmup session for this thread to link the interaction
      const session = await prisma.warmupSession.findFirst({
        where: {
          sendingAccountId: senderAccountId,
          status: "ACTIVE",
        },
      })

      if (!session) {
        return { success: false, error: "No active warmup session found for sender" }
      }

      const previousMessages = await prisma.warmupInteraction.findMany({
        where: { threadId },
        orderBy: { sentAt: "desc" },
        take: 3,
      })

      const messageContent = await contentGenerator.generateThreadMessage({
        topic: thread.threadTopic,
        industry: thread.industry ?? undefined,
        messageNumber: thread.messageCount + 1,
        isReply: thread.messageCount > 0,
        previousMessages: previousMessages.map((m) => m.subject),
        includeLinks: thread.includeLinks,
        includeAttachments: thread.includeAttachments,
      })

      // Create the interaction linked to the session (not directly to recipient)
      const interaction = await prisma.warmupInteraction.create({
        data: {
          sessionId: session.id,
          sendingAccountId: senderAccountId,
          threadId,
          subject: thread.messageCount === 0 ? thread.threadSubject : `Re: ${thread.threadSubject}`,
          snippet: messageContent.body.substring(0, 100),
          direction: "OUTBOUND",
          isPending: true,
        },
      })

      const nextResponseTime = this.calculateNextResponseTime(thread.responseTimeMin, thread.responseTimeMax)

      await prisma.warmupThread.update({
        where: { id: threadId },
        data: {
          messageCount: { increment: 1 },
          lastMessageAt: new Date(),
          nextScheduledAt: new Date(Date.now() + nextResponseTime * 60000),
        },
      })

      await this.invalidateCache(threadId)

      logger.info("[ConversationThreadManager] Thread message created", {
        threadId,
        messageNumber: thread.messageCount + 1,
        interactionId: interaction.id,
      })

      return {
        success: true,
        messageId: interaction.id,
        threadCompleted: thread.messageCount + 1 >= thread.maxMessages,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logger.error("[ConversationThreadManager] Failed to process thread message", error, {
        threadId,
      })
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Get all threads ready for next message
   * Used by scheduler to find threads needing processing
   */
  async getThreadsReadyForNextMessage(limit = 100): Promise<string[]> {
    try {
      const threads = await prisma.warmupThread.findMany({
        where: {
          status: "ACTIVE",
          nextScheduledAt: {
            lte: new Date(),
          },
          messageCount: {
            lt: prisma.warmupThread.fields.maxMessages,
          },
        },
        select: { id: true },
        take: limit,
        orderBy: { nextScheduledAt: "asc" },
      })

      return threads.map((t) => t.id)
    } catch (error) {
      logger.error("[ConversationThreadManager] Failed to get ready threads", { error })
      return []
    }
  }

  /**
   * Complete a thread
   */
  private async completeThread(threadId: string): Promise<void> {
    await prisma.warmupThread.update({
      where: { id: threadId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    })

    await this.invalidateCache(threadId)

    logger.info("[ConversationThreadManager] Thread completed", { threadId })
  }

  /**
   * Generate realistic thread parameters based on reputation profiles
   */
  private generateThreadParameters(
    initiatorProfile: any,
    recipientProfile: any,
  ): {
    maxMessages: number
    conversationDepth: number
    responseTimeMin: number
    responseTimeMax: number
    includeLinks: boolean
    includeAttachments: boolean
  } {
    const avgTier = this.getAverageTier(initiatorProfile?.reputationTier, recipientProfile?.reputationTier)

    const maxMessages =
      avgTier === "PRISTINE" || avgTier === "HIGH"
        ? Math.floor(Math.random() * 3) + 4
        : Math.floor(Math.random() * 2) + 3

    const conversationDepth = Math.floor(maxMessages / 2)

    const responseTimeMin = avgTier === "PRISTINE" ? 60 : 30
    const responseTimeMax = avgTier === "PRISTINE" ? 1440 : 720

    const daysInWarmup = Math.max(initiatorProfile?.daysInWarmup || 0, recipientProfile?.daysInWarmup || 0)

    const includeLinks = daysInWarmup > 7 && Math.random() > 0.7
    const includeAttachments = daysInWarmup > 14 && Math.random() > 0.85

    return {
      maxMessages,
      conversationDepth,
      responseTimeMin,
      responseTimeMax,
      includeLinks,
      includeAttachments,
    }
  }

  /**
   * Select appropriate thread topic
   */
  private async selectThreadTopic(industry?: string): Promise<string> {
    const topics = [
      "project_update",
      "meeting_request",
      "proposal_discussion",
      "follow_up",
      "introduction",
      "collaboration",
      "feedback_request",
      "status_update",
    ]

    if (industry) {
      const industryTopics: Record<string, string[]> = {
        tech: ["technical_review", "sprint_planning", "deployment_update"],
        finance: ["quarterly_report", "budget_review", "compliance_update"],
        marketing: ["campaign_review", "content_approval", "analytics_summary"],
        healthcare: ["patient_update", "compliance_review", "research_discussion"],
      }

      const specificTopics = industryTopics[industry.toLowerCase()] || []
      topics.push(...specificTopics)
    }

    return topics[Math.floor(Math.random() * topics.length)]
  }

  /**
   * Calculate next response time with realistic variation
   */
  private calculateNextResponseTime(min: number, max: number): number {
    const range = max - min
    const variance = Math.random() * Math.random()
    return Math.floor(min + range * variance)
  }

  /**
   * Get average reputation tier
   */
  private getAverageTier(tier1?: string, tier2?: string): string {
    const tiers = ["CRITICAL", "LOW", "MEDIUM", "HIGH", "PRISTINE"]
    const idx1 = tier1 ? tiers.indexOf(tier1) : 2
    const idx2 = tier2 ? tiers.indexOf(tier2) : 2
    const avgIdx = Math.floor((idx1 + idx2) / 2)
    return tiers[avgIdx] || "MEDIUM"
  }

  /**
   * Cache operations for performance
   */
  private async cacheThread(threadId: string, thread: any): Promise<void> {
    const key = `${this.REDIS_PREFIX}${threadId}`
    await redis.setex(key, this.CACHE_TTL, JSON.stringify(thread))
  }

  private async getThread(threadId: string): Promise<CachedThread | null> {
    const key = `${this.REDIS_PREFIX}${threadId}`
    const cached = await redis.get(key)

    if (cached && typeof cached === 'string') {
      try {
        const parsed = JSON.parse(cached) as CachedThread
        return parsed
      } catch (error) {
        logger.error("[ConversationThreadManager] Failed to parse cached thread", error, { threadId })
        // Fall through to fetch from database
      }
    }

    const thread = await prisma.warmupThread.findUnique({
      where: { id: threadId },
      include: {
        initiatorAccount: { include: { reputationProfile: true } },
        recipientAccount: { include: { reputationProfile: true } },
      },
    })

    if (thread) {
      await this.cacheThread(threadId, thread)
    }

    return thread
  }

  private async invalidateCache(threadId: string): Promise<void> {
    const key = `${this.REDIS_PREFIX}${threadId}`
    await redis.del(key)
  }

  /**
   * Get thread statistics for monitoring
   */
  async getThreadStats(): Promise<{
    activeThreads: number
    completedToday: number
    avgMessagesPerThread: number
    avgThreadDuration: number
  }> {
    const [active, completedToday, avgStats] = await Promise.all([
      prisma.warmupThread.count({ where: { status: "ACTIVE" } }),
      prisma.warmupThread.count({
        where: {
          status: "COMPLETED",
          completedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.warmupThread.aggregate({
        _avg: { messageCount: true },
        where: { status: "COMPLETED" },
      }),
    ])

    return {
      activeThreads: active,
      completedToday,
      avgMessagesPerThread: avgStats._avg.messageCount || 0,
      avgThreadDuration: 0, // Calculate if needed
    }
  }
}

export const conversationThreadManager = new ConversationThreadManager()