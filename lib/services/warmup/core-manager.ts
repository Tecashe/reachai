// import { prisma } from '@/lib/db'
// import { logger } from '@/lib/logger'
// import { distributedLock } from './distributed-lock'
// import { peerCache } from './peer-cache'
// import { emailSender } from './email-sender'
// import { sessionManager } from './session-manager'
// import { replyAutomation } from './reply-automation'
// import { metricsTracker } from './metrics-tracker'
// import { healthMonitor } from './health-monitor'
// import type { SendingAccount } from '@prisma/client'

// interface WarmupResult {
//   success: boolean
//   accountId: string
//   emailsSent: number
//   warmupType: 'POOL' | 'PEER'
//   peerEmail?: string
//   error?: string
//   skipped?: boolean
//   skipReason?: string
// }

// export class CoreWarmupManager {
//   /**
//    * Process warmup for a single account
//    * This is the main entry point called by Inngest jobs
//    */
//   async processAccountWarmup(accountId: string): Promise<WarmupResult> {
//     logger.info('Starting warmup processing', { accountId })

//     // Step 1: Acquire distributed lock
//     const lockId = await distributedLock.acquire(accountId, 300) // 5 min lock

//     if (!lockId) {
//       logger.debug('Account already being processed', { accountId })
//       return {
//         success: false,
//         accountId,
//         emailsSent: 0,
//         warmupType: 'POOL',
//         skipped: true,
//         skipReason: 'Already processing',
//       }
//     }

//     try {
//       // Step 2: Load account with validation
//       const account = await this.loadAndValidateAccount(accountId)

//       if (!account) {
//         return {
//           success: false,
//           accountId,
//           emailsSent: 0,
//           warmupType: 'POOL',
//           skipped: true,
//           skipReason: 'Account not found or invalid',
//         }
//       }

//       // Step 3: Check if account can send today
//       if (!this.canSendToday(account)) {
//         logger.debug('Account reached daily limit', {
//           accountId,
//           sent: account.emailsSentToday,
//           limit: account.warmupDailyLimit,
//         })

//         return {
//           success: true,
//           accountId,
//           emailsSent: 0,
//           warmupType: this.getWarmupType(account.warmupStage),
//           skipped: true,
//           skipReason: 'Daily limit reached',
//         }
//       }

//       // Step 4: Determine warmup type
//       const warmupType = this.getWarmupType(account.warmupStage)

//       // Step 5: Get peer/pool email
//       const recipient = await this.getRecipient(account, warmupType)

//       if (!recipient) {
//         return {
//           success: false,
//           accountId,
//           emailsSent: 0,
//           warmupType,
//           error: 'No recipient available',
//         }
//       }

//       // Step 6: Get or create session
//       const session = await sessionManager.getOrCreateSession(account, {
//         warmupType,
//         dailyLimit: account.warmupDailyLimit,
//         peerAccountEmail: warmupType === 'PEER' ? recipient.email : undefined,
//       })

//       // Step 7: Send warmup email
//       const sendResult = await emailSender.sendWarmupEmail(
//         session.id,
//         account,
//         recipient.email,
//         recipient.name
//       )

//       if (!sendResult.success) {
//         return {
//           success: false,
//           accountId,
//           emailsSent: 0,
//           warmupType,
//           error: sendResult.error,
//         }
//       }

//       // Step 8: Track metrics
//       await metricsTracker.trackEmailSent(accountId, session.id)

//       // Step 9: Update session
//       await sessionManager.updateSessionMetrics(session.id, {
//         emailsSent: 1,
//       })

//       // Step 10: Schedule reply (if warmup type is POOL and random decides)
//       if (warmupType === 'POOL' && replyAutomation.shouldReply()) {
//         await replyAutomation.scheduleReply(
//           session.id,
//           {
//             subject: 'Warmup Email',
//             body: 'This is a warmup email',
//             from: account.email,
//             warmupId: sendResult.warmupId!,
//             threadId: sendResult.threadId!,
//             messageId: sendResult.messageId!,
//           },
//           recipient
//         )
//       }

//       // Step 11: Update warmup progress
//       await this.updateWarmupProgress(accountId, account.warmupStage)

//       logger.info('Warmup email sent successfully', {
//         accountId,
//         warmupType,
//         recipient: recipient.email,
//         messageId: sendResult.messageId,
//       })

//       return {
//         success: true,
//         accountId,
//         emailsSent: 1,
//         warmupType,
//         peerEmail: recipient.email,
//       }
//     } catch (error) {
//       logger.error('Warmup processing failed', error as Error, { accountId })

//       return {
//         success: false,
//         accountId,
//         emailsSent: 0,
//         warmupType: 'POOL',
//         error: (error as Error).message,
//       }
//     } finally {
//       // Always release lock
//       await distributedLock.release(accountId, lockId)
//     }
//   }

//   /**
//    * Load and validate account
//    */
//   private async loadAndValidateAccount(
//     accountId: string
//   ): Promise<SendingAccount | null> {
//     const account = await prisma.sendingAccount.findUnique({
//       where: { id: accountId },
//       include: {
//         user: {
//           select: {
//             subscriptionTier: true,
//           },
//         },
//       },
//     })

//     if (!account) {
//       logger.warn('Account not found', { accountId })
//       return null
//     }

//     // Validation checks
//     if (!account.warmupEnabled) {
//       logger.debug('Warmup not enabled', { accountId })
//       return null
//     }

//     if (!account.isActive || account.pausedAt) {
//       logger.debug('Account is paused', { accountId })
//       return null
//     }

//     if (account.healthScore < 50) {
//       logger.warn('Account health too low', {
//         accountId,
//         healthScore: account.healthScore,
//       })
//       return null
//     }

//     return account
//   }

//   /**
//    * Check if account can send today
//    */
//   private canSendToday(account: SendingAccount): boolean {
//     return account.emailsSentToday < account.warmupDailyLimit
//   }

//   /**
//    * Determine warmup type based on stage
//    */
//   private getWarmupType(stage: string): 'POOL' | 'PEER' {
//     const peerEligibleStages = ['WARM', 'ACTIVE', 'ESTABLISHED']
//     return peerEligibleStages.includes(stage) ? 'PEER' : 'POOL'
//   }

//   /**
//    * Get recipient (peer or pool email)
//    */
//   private async getRecipient(
//     account: any,
//     warmupType: 'POOL' | 'PEER'
//   ): Promise<{ email: string; name: string; id?: string } | null> {
//     if (warmupType === 'POOL') {
//       return await this.getPoolEmail()
//     } else {
//       return await this.getPeerEmail(account)
//     }
//   }

//   /**
//    * Get email from pool (30-email warmup pool)
//    */
//   private async getPoolEmail(): Promise<{
//     email: string
//     name: string
//     id: string
//   } | null> {
//     const poolEmails = await prisma.warmupEmail.findMany({
//       where: {
//         isActive: true,
//         cooldownUntil: {
//           lte: new Date(),
//         },
//       },
//       orderBy: {
//         lastEmailSentAt: 'asc', // Use least recently used
//       },
//       take: 1,
//     })

//     if (poolEmails.length === 0) {
//       logger.warn('No pool emails available')
//       return null
//     }

//     const poolEmail = poolEmails[0]

//     // Update cooldown
//     await prisma.warmupEmail.update({
//       where: { id: poolEmail.id },
//       data: {
//         lastEmailSentAt: new Date(),
//         cooldownUntil: new Date(Date.now() + 3600000), // 1 hour cooldown
//       },
//     })

//     return {
//       email: poolEmail.email,
//       name: poolEmail.name,
//       id: poolEmail.id,
//     }
//   }

//   /**
//    * Get peer email from cache
//    */
//   private async getPeerEmail(
//     account: any
//   ): Promise<{ email: string; name: string } | null> {
//     // Check if peer warmup is enabled
//     if (!account.peerWarmupEnabled || !account.peerWarmupOptIn) {
//       logger.debug('Peer warmup not enabled for account', {
//         accountId: account.id,
//       })
//       return null
//     }

//     // Get cached peer matches
//     const peers = await peerCache.getCachedMatches(account.id, 10)

//     if (peers.length === 0) {
//       logger.warn('No peer matches available', { accountId: account.id })
//       return null
//     }

//     // Select random peer from top matches
//     const randomPeer = peers[Math.floor(Math.random() * Math.min(3, peers.length))]

//     return {
//       email: randomPeer.email,
//       name: randomPeer.name,
//     }
//   }

//   /**
//    * Update warmup progress and potentially advance stage
//    */
//   private async updateWarmupProgress(
//     accountId: string,
//     currentStage: string
//   ): Promise<void> {
//     const account = await prisma.sendingAccount.findUnique({
//       where: { id: accountId },
//       select: {
//         warmupProgress: true,
//         warmupStartDate: true,
//       },
//     })

//     if (!account) return

//     const daysInStage = Math.floor(
//       (Date.now() - account.warmupStartDate.getTime()) / (1000 * 60 * 60 * 24)
//     )

//     // Stage advancement logic
//     const stageMap = {
//       NEW: { duration: 7, nextStage: 'WARMING', dailyLimit: 20 },
//       WARMING: { duration: 14, nextStage: 'WARM', dailyLimit: 40 },
//       WARM: { duration: 21, nextStage: 'ACTIVE', dailyLimit: 60 },
//       ACTIVE: { duration: 30, nextStage: 'ESTABLISHED', dailyLimit: 80 },
//       ESTABLISHED: { duration: Infinity, nextStage: null, dailyLimit: 100 },
//     }

//     const currentStageConfig = stageMap[currentStage as keyof typeof stageMap]

//     if (currentStageConfig && daysInStage >= currentStageConfig.duration) {
//       const nextStage = currentStageConfig.nextStage

//       if (nextStage) {
//         await prisma.sendingAccount.update({
//           where: { id: accountId },
//           data: {
//             warmupStage: nextStage,
//             warmupDailyLimit: stageMap[nextStage as keyof typeof stageMap].dailyLimit,
//             warmupProgress: 0,
//             // Enable peer warmup when reaching WARM stage
//             peerWarmupEnabled: ['WARM', 'ACTIVE', 'ESTABLISHED'].includes(nextStage),
//           },
//         })

//         logger.info('Account advanced to next warmup stage', {
//           accountId,
//           previousStage: currentStage,
//           newStage: nextStage,
//         })
//       }
//     } else {
//       // Just increment progress
//       await prisma.sendingAccount.update({
//         where: { id: accountId },
//         data: {
//           warmupProgress: { increment: 1 },
//         },
//       })
//     }
//   }

//   /**
//    * Batch process multiple accounts
//    */
//   async batchProcessAccounts(
//     accountIds: string[],
//     concurrency = 10
//   ): Promise<WarmupResult[]> {
//     logger.info('Starting batch warmup processing', {
//       total: accountIds.length,
//       concurrency,
//     })

//     const results: WarmupResult[] = []

//     // Process in chunks to control concurrency
//     for (let i = 0; i < accountIds.length; i += concurrency) {
//       const chunk = accountIds.slice(i, i + concurrency)

//       const chunkResults = await Promise.allSettled(
//         chunk.map((id) => this.processAccountWarmup(id))
//       )

//       const fulfilled = chunkResults
//         .filter((r) => r.status === 'fulfilled')
//         .map((r) => (r as PromiseFulfilledResult<WarmupResult>).value)

//       results.push(...fulfilled)

//       logger.info('Batch chunk processed', {
//         processed: i + chunk.length,
//         total: accountIds.length,
//       })

//       // Small delay between chunks
//       await new Promise((resolve) => setTimeout(resolve, 100))
//     }

//     const summary = {
//       total: results.length,
//       successful: results.filter((r) => r.success).length,
//       failed: results.filter((r) => !r.success && !r.skipped).length,
//       skipped: results.filter((r) => r.skipped).length,
//       emailsSent: results.reduce((sum, r) => sum + r.emailsSent, 0),
//     }

//     logger.info('Batch warmup processing completed', summary)

//     return results
//   }

//   /**
//    * Get accounts eligible for warmup right now
//    */
//   async getEligibleAccounts(limit = 1000): Promise<string[]> {
//     const accounts = await prisma.sendingAccount.findMany({
//       where: {
//         warmupEnabled: true,
//         isActive: true,
//         pausedAt: null,
//         healthScore: { gte: 50 },
//         emailsSentToday: {
//           lt: prisma.sendingAccount.fields.warmupDailyLimit,
//         },
//         // Only accounts that haven't been warmed in the last hour
//         OR: [
//           { lastWarmupAt: null },
//           {
//             lastWarmupAt: {
//               lte: new Date(Date.now() - 3600000), // 1 hour ago
//             },
//           },
//         ],
//       },
//       select: { id: true },
//       take: limit,
//       orderBy: [
//         { lastWarmupAt: 'asc' }, // Prioritize least recently warmed
//         { warmupProgress: 'asc' }, // Then by progress
//       ],
//     })

//     logger.info('Found eligible accounts for warmup', {
//       count: accounts.length,
//       limit,
//     })

//     return accounts.map((a) => a.id)
//   }

//   /**
//    * Estimate time to process all eligible accounts
//    */
//   async estimateProcessingTime(): Promise<{
//     eligibleAccounts: number
//     estimatedMinutes: number
//     currentRate: number
//   }> {
//     const eligible = await this.getEligibleAccounts(10000)

//     // Assume 5 seconds per account on average
//     const estimatedSeconds = eligible.length * 5
//     const estimatedMinutes = Math.ceil(estimatedSeconds / 60)

//     // Calculate current processing rate (accounts per minute)
//     const recentSessions = await prisma.warmupSession.count({
//       where: {
//         lastSentAt: {
//           gte: new Date(Date.now() - 600000), // Last 10 minutes
//         },
//       },
//     })

//     const currentRate = recentSessions / 10 // Per minute

//     return {
//       eligibleAccounts: eligible.length,
//       estimatedMinutes,
//       currentRate,
//     }
//   }
// }

// export const coreWarmupManager = new CoreWarmupManager()

// import { prisma } from '@/lib/db'
// import { logger } from '@/lib/logger'
// import { distributedLock } from './distributed-lock'
// import { peerCache } from './peer-cache'
// import { emailSender } from './email-sender'
// import { sessionManager } from './session-manager'
// import { replyAutomation } from './reply-automation'
// import { metricsTracker } from './metrics-tracker'
// import type { SendingAccount, WarmupEmail, WarmupStage  } from '@prisma/client'

// interface SendingAccountWithUser extends SendingAccount {
//   user?: {
//     subscriptionTier: string
//   } | null
// }

// interface WarmupResult {
//   success: boolean
//   accountId: string
//   emailsSent: number
//   warmupType: 'POOL' | 'PEER'
//   peerEmail?: string
//   error?: string
//   skipped?: boolean
//   skipReason?: string
// }

// export class CoreWarmupManager {
//   /**
//    * Process warmup for a single account
//    * This is the main entry point called by Inngest jobs
//    */
//   async processAccountWarmup(accountId: string): Promise<WarmupResult> {
//   logger.info('Starting warmup processing', { accountId })

//     // Step 1: Acquire distributed lock
//     const lockId = await distributedLock.acquire(accountId, 300) // 5 min lock
   

//     if (!lockId) {
//       logger.debug('Account already being processed', { accountId })
//       return {
//         success: false,
//         accountId,
//         emailsSent: 0,
//         warmupType: 'POOL',
//         skipped: true,
//         skipReason: 'Already processing',
//       }
//     }

//     try {
//       // Step 2: Load account with validation
//       const account = await this.loadAndValidateAccount(accountId)

//       if (!account) {
//         return {
//           success: false,
//           accountId,
//           emailsSent: 0,
//           warmupType: 'POOL',
//           skipped: true,
//           skipReason: 'Account not found or invalid',
//         }
//       }

//       // Step 3: Check if account can send today
//       if (!this.canSendToday(account)) {
//         logger.debug('Account reached daily limit', {
//           accountId,
//           sent: account.emailsSentToday,
//           limit: account.warmupDailyLimit,
//         })

//         return {
//           success: true,
//           accountId,
//           emailsSent: 0,
//           warmupType: this.getWarmupType(account.warmupStage),
//           skipped: true,
//           skipReason: 'Daily limit reached',
//         }
//       }

//       // Step 4: Determine warmup type
//       const warmupType = this.getWarmupType(account.warmupStage)

//       // Step 5: Get peer/pool email
//       const recipient = await this.getRecipient(account, warmupType)

//       if (!recipient) {
//         return {
//           success: false,
//           accountId,
//           emailsSent: 0,
//           warmupType,
//           error: 'No recipient available',
//         }
//       }

//       // Step 6: Get or create session
//       const session = await sessionManager.getOrCreateSession(account, {
//         warmupType,
//         dailyLimit: account.warmupDailyLimit,
//         peerAccountEmail: warmupType === 'PEER' ? recipient.email : undefined,
//       })

//       // Step 7: Send warmup email
//       const sendResult = await emailSender.sendWarmupEmail(
//         session.id,
//         account,
//         recipient.email,
//         recipient.name
//       )

//       if (!sendResult.success) {
//         return {
//           success: false,
//           accountId,
//           emailsSent: 0,
//           warmupType,
//           error: sendResult.error,
//         }
//       }

//       // Step 8: Track metrics
//       await metricsTracker.trackEmailSent(accountId, session.id)

//       // Step 9: Update session
//       await sessionManager.updateSessionMetrics(session.id, {
//         emailsSent: 1,
//       })

//       // Step 10: Schedule reply (if warmup type is POOL and random decides)
//       if (warmupType === 'POOL' && recipient.warmupEmailData && replyAutomation.shouldReply()) {
//         await replyAutomation.scheduleReply(
//           session.id,
//           {
//             subject: 'Warmup Email',
//             body: 'This is a warmup email',
//             from: account.email,
//             warmupId: sendResult.warmupId!,
//             threadId: sendResult.threadId!,
//             messageId: sendResult.messageId!,
//           },
//           recipient.warmupEmailData
//         )
//       }

//       // Step 11: Update warmup progress
//       await this.updateWarmupProgress(accountId, account.warmupStage)

//       logger.info('Warmup email sent successfully', {
//         accountId,
//         warmupType,
//         recipient: recipient.email,
//         messageId: sendResult.messageId,
//       })

//       return {
//         success: true,
//         accountId,
//         emailsSent: 1,
//         warmupType,
//         peerEmail: recipient.email,
//       }
//     } catch (error) {
//       logger.error('Warmup processing failed', error as Error, { accountId })

//       return {
//         success: false,
//         accountId,
//         emailsSent: 0,
//         warmupType: 'POOL',
//         error: (error as Error).message,
//       }
//     } finally {
//       // Always release lock
//       await distributedLock.release(accountId, lockId)
//     }
//   }

//   /**
//    * Load and validate account
//    */
//   private async loadAndValidateAccount(
//     accountId: string
//   ): Promise<SendingAccountWithUser | null> {
//     const account = await prisma.sendingAccount.findUnique({
//       where: { id: accountId },
//       include: {
//         user: {
//           select: {
//             subscriptionTier: true,
//           },
//         },
//       },
//     })

//     if (!account) {
//       logger.warn('Account not found', { accountId })
//       return null
//     }

//     // Validation checks
//     if (!account.warmupEnabled) {
//       logger.debug('Warmup not enabled', { accountId })
//       return null
//     }

//     if (!account.isActive || account.pausedAt) {
//       logger.debug('Account is paused', { accountId })
//       return null
//     }

//     if (account.healthScore < 50) {
//       logger.warn('Account health too low', {
//         accountId,
//         healthScore: account.healthScore,
//       })
//       return null
//     }

//     return account
//   }

//   /**
//    * Check if account can send today
//    */
//   private canSendToday(account: SendingAccount): boolean {
//     return account.emailsSentToday < account.warmupDailyLimit
//   }

//   /**
//    * Determine warmup type based on stage
//    */
//   private getWarmupType(stage: string): 'POOL' | 'PEER' {
//     const peerEligibleStages = ['WARM', 'ACTIVE', 'ESTABLISHED']
//     return peerEligibleStages.includes(stage) ? 'PEER' : 'POOL'
//   }

//   /**
//    * Get recipient (peer or pool email)
//    */
//   private async getRecipient(
//     account: SendingAccountWithUser,
//     warmupType: 'POOL' | 'PEER'
//   ): Promise<{
//     email: string
//     name: string
//     id?: string
//     warmupEmailData?: WarmupEmail
//   } | null> {
//     if (warmupType === 'POOL') {
//       return await this.getPoolEmail()
//     } else {
//       return await this.getPeerEmail(account)
//     }
//   }

//   /**
//    * Get email from pool (30-email warmup pool)
//    */
//   private async getPoolEmail(): Promise<{
//     email: string
//     name: string
//     id: string
//     warmupEmailData: WarmupEmail
//   } | null> {
//     const poolEmails = await prisma.warmupEmail.findMany({
//       where: {
//         isActive: true,
//         OR: [
//           { cooldownUntil: null },
//           { cooldownUntil: { lte: new Date() } },
//         ],
//       },
//       orderBy: {
//         lastEmailSentAt: 'asc', // Use least recently used
//       },
//       take: 1,
//     })

//     if (poolEmails.length === 0) {
//       logger.warn('No pool emails available')
//       return null
//     }

//     const poolEmail = poolEmails[0]

//     // Update cooldown
//     await prisma.warmupEmail.update({
//       where: { id: poolEmail.id },
//       data: {
//         lastEmailSentAt: new Date(),
//         cooldownUntil: new Date(Date.now() + 3600000), // 1 hour cooldown
//       },
//     })

//     return {
//       email: poolEmail.email,
//       name: poolEmail.name,
//       id: poolEmail.id,
//       warmupEmailData: poolEmail,
//     }
//   }

//   /**
//    * Get peer email from cache
//    */
//   private async getPeerEmail(
//     account: SendingAccountWithUser
//   ): Promise<{ email: string; name: string } | null> {
//     // Check if peer warmup is enabled
//     if (!account.peerWarmupEnabled || !account.peerWarmupOptIn) {
//       logger.debug('Peer warmup not enabled for account', {
//         accountId: account.id,
//       })
//       return null
//     }

//     // Get cached peer matches
//     const peers = await peerCache.getCachedMatches(account.id, 10)

//     if (peers.length === 0) {
//       logger.warn('No peer matches available', { accountId: account.id })
//       return null
//     }

//     // Select random peer from top matches
//     const randomPeer = peers[Math.floor(Math.random() * Math.min(3, peers.length))]

//     return {
//       email: randomPeer.email,
//       name: randomPeer.name,
//     }
//   }

//   /**
//    * Update warmup progress and potentially advance stage
//    */
//   private async updateWarmupProgress(
//     accountId: string,
//     currentStage: string
//   ): Promise<void> {
//     const account = await prisma.sendingAccount.findUnique({
//       where: { id: accountId },
//       select: {
//         warmupProgress: true,
//         warmupStartDate: true,
//       },
//     })

//     if (!account) return

//     const daysInStage = Math.floor(
//       (Date.now() - account.warmupStartDate.getTime()) / (1000 * 60 * 60 * 24)
//     )

//     // Stage advancement logic
//     const stageMap = {
//       NEW: { duration: 7, nextStage: 'WARMING', dailyLimit: 20 },
//       WARMING: { duration: 14, nextStage: 'WARM', dailyLimit: 40 },
//       WARM: { duration: 21, nextStage: 'ACTIVE', dailyLimit: 60 },
//       ACTIVE: { duration: 30, nextStage: 'ESTABLISHED', dailyLimit: 80 },
//       ESTABLISHED: { duration: Infinity, nextStage: null, dailyLimit: 100 },
//     }

//     const currentStageConfig = stageMap[currentStage as keyof typeof stageMap]

//     if (currentStageConfig && daysInStage >= currentStageConfig.duration) {
//       const nextStage = currentStageConfig.nextStage

//       if (nextStage) {
//         await prisma.sendingAccount.update({
//           where: { id: accountId },
//           data: {
//             warmupStage: nextStage as WarmupStage,
//             warmupDailyLimit: stageMap[nextStage as keyof typeof stageMap].dailyLimit,
//             warmupProgress: 0,
//             // Enable peer warmup when reaching WARM stage
//             peerWarmupEnabled: ['WARM', 'ACTIVE', 'ESTABLISHED'].includes(nextStage),
//           },
//         })

//         logger.info('Account advanced to next warmup stage', {
//           accountId,
//           previousStage: currentStage,
//           newStage: nextStage,
//         })
//       }
//     } else {
//       // Just increment progress
//       await prisma.sendingAccount.update({
//         where: { id: accountId },
//         data: {
//           warmupProgress: { increment: 1 },
//         },
//       })
//     }
//   }

//   /**
//    * Batch process multiple accounts
//    */
//   async batchProcessAccounts(
//     accountIds: string[],
//     concurrency = 10
//   ): Promise<WarmupResult[]> {
//     logger.info('Starting batch warmup processing', {
//       total: accountIds.length,
//       concurrency,
//     })

//     const results: WarmupResult[] = []

//     // Process in chunks to control concurrency
//     for (let i = 0; i < accountIds.length; i += concurrency) {
//       const chunk = accountIds.slice(i, i + concurrency)

//       const chunkResults = await Promise.allSettled(
//         chunk.map((id) => this.processAccountWarmup(id))
//       )

//       const fulfilled = chunkResults
//         .filter((r) => r.status === 'fulfilled')
//         .map((r) => (r as PromiseFulfilledResult<WarmupResult>).value)

//       results.push(...fulfilled)

//       logger.info('Batch chunk processed', {
//         processed: i + chunk.length,
//         total: accountIds.length,
//       })

//       // Small delay between chunks
//       await new Promise((resolve) => setTimeout(resolve, 100))
//     }

//     const summary = {
//       total: results.length,
//       successful: results.filter((r) => r.success).length,
//       failed: results.filter((r) => !r.success && !r.skipped).length,
//       skipped: results.filter((r) => r.skipped).length,
//       emailsSent: results.reduce((sum, r) => sum + r.emailsSent, 0),
//     }

//     logger.info('Batch warmup processing completed', summary)

//     return results
//   }

//   /**
//    * Get accounts eligible for warmup right now
//    */
//   async getEligibleAccounts(limit = 1000): Promise<string[]> {
//     const oneHourAgo = new Date(Date.now() - 3600000)

//     const accounts = await prisma.sendingAccount.findMany({
//       where: {
//         warmupEnabled: true,
//         isActive: true,
//         pausedAt: null,
//         healthScore: { gte: 50 },
//         emailsSentToday: {
//           lt: prisma.sendingAccount.fields.warmupDailyLimit,
//         },
//         // Only accounts that haven't been warmed in the last hour
//         OR: [
//           { lastWarmupAt: null },
//           { lastWarmupAt: { lte: oneHourAgo } },
//         ],
//       },
//       select: { id: true },
//       take: limit,
//       orderBy: [
//         { lastWarmupAt: 'asc' }, // Prioritize least recently warmed
//         { warmupProgress: 'asc' }, // Then by progress
//       ],
//     })

//     logger.info('Found eligible accounts for warmup', {
//       count: accounts.length,
//       limit,
//     })

//     return accounts.map((a) => a.id)
//   }

//   /**
//    * Estimate time to process all eligible accounts
//    */
//   async estimateProcessingTime(): Promise<{
//     eligibleAccounts: number
//     estimatedMinutes: number
//     currentRate: number
//   }> {
//     const eligible = await this.getEligibleAccounts(10000)

//     // Assume 5 seconds per account on average
//     const estimatedSeconds = eligible.length * 5
//     const estimatedMinutes = Math.ceil(estimatedSeconds / 60)

//     // Calculate current processing rate (accounts per minute)
//     const tenMinutesAgo = new Date(Date.now() - 600000)

//     const recentSessions = await prisma.warmupSession.count({
//       where: {
//         lastSentAt: { gte: tenMinutesAgo },
//       },
//     })

//     const currentRate = recentSessions / 10 // Per minute

//     return {
//       eligibleAccounts: eligible.length,
//       estimatedMinutes,
//       currentRate,
//     }
//   }
// }

// export const coreWarmupManager = new CoreWarmupManager()

// import { prisma } from '@/lib/db'
// import { logger } from '@/lib/logger'
// import { distributedLock } from './distributed-lock'
// import { peerCache } from './peer-cache'
// import { emailSender } from './email-sender'
// import { sessionManager } from './session-manager'
// import { replyAutomation } from './reply-automation'
// import { metricsTracker } from './metrics-tracker'
// import type { SendingAccount, WarmupEmail, WarmupStage } from '@prisma/client'

// interface SendingAccountWithUser extends SendingAccount {
//   user?: {
//     subscriptionTier: string
//   } | null
// }

// interface WarmupResult {
//   success: boolean
//   accountId: string
//   emailsSent: number
//   warmupType: 'POOL' | 'PEER'
//   peerEmail?: string
//   error?: string
//   skipped?: boolean
//   skipReason?: string
// }

// export class CoreWarmupManager {
//   /**
//    * Process warmup for a single account
//    * This is the main entry point called by Inngest jobs
//    */
//   async processAccountWarmup(accountId: string): Promise<WarmupResult> {
//     logger.info('Starting warmup processing', { accountId })

//     let lockId: string | null = null

//     try {
//       // Step 1: Acquire distributed lock
//       lockId = await distributedLock.acquire(accountId, 300) // 5 min lock
//     } catch (error) {
//       logger.error('Failed to acquire lock - Redis error', error as Error, {
//         accountId,
//       })
//       return {
//         success: false,
//         accountId,
//         emailsSent: 0,
//         warmupType: 'POOL',
//         error: `Lock acquisition failed: ${(error as Error).message}`,
//       }
//     }

//     if (!lockId) {
//       logger.debug('Account already being processed', { accountId })
//       return {
//         success: false,
//         accountId,
//         emailsSent: 0,
//         warmupType: 'POOL',
//         skipped: true,
//         skipReason: 'Already processing',
//       }
//     }

//     try {
//       // Step 2: Load account with validation
//       const account = await this.loadAndValidateAccount(accountId)

//       if (!account) {
//         return {
//           success: false,
//           accountId,
//           emailsSent: 0,
//           warmupType: 'POOL',
//           skipped: true,
//           skipReason: 'Account not found or invalid',
//         }
//       }

//       // Step 3: Check if account can send today
//       if (!this.canSendToday(account)) {
//         logger.debug('Account reached daily limit', {
//           accountId,
//           sent: account.emailsSentToday,
//           limit: account.warmupDailyLimit,
//         })

//         return {
//           success: true,
//           accountId,
//           emailsSent: 0,
//           warmupType: this.getWarmupType(account.warmupStage),
//           skipped: true,
//           skipReason: 'Daily limit reached',
//         }
//       }

//       // Step 4: Determine warmup type
//       const warmupType = this.getWarmupType(account.warmupStage)

//       // Step 5: Get peer/pool email
//       const recipient = await this.getRecipient(account, warmupType)

//       if (!recipient) {
//         return {
//           success: false,
//           accountId,
//           emailsSent: 0,
//           warmupType,
//           error: 'No recipient available',
//         }
//       }

//       // Step 6: Get or create session
//       const session = await sessionManager.getOrCreateSession(account, {
//         warmupType,
//         dailyLimit: account.warmupDailyLimit,
//         peerAccountEmail: warmupType === 'PEER' ? recipient.email : undefined,
//       })

//       // Step 7: Send warmup email
//       const sendResult = await emailSender.sendWarmupEmail(
//         session.id,
//         account,
//         recipient.email,
//         recipient.name
//       )

//       if (!sendResult.success) {
//         logger.error('Email send failed', {
//           accountId,
//           error: sendResult.error,
//           recipient: recipient.email,
//         })
//         return {
//           success: false,
//           accountId,
//           emailsSent: 0,
//           warmupType,
//           error: sendResult.error,
//         }
//       }

//       // Step 8: Track metrics
//       await metricsTracker.trackEmailSent(accountId, session.id)

//       // Step 9: Update session
//       await sessionManager.updateSessionMetrics(session.id, {
//         emailsSent: 1,
//       })

//       // Step 10: Schedule reply (if warmup type is POOL and random decides)
//       if (
//         warmupType === 'POOL' &&
//         recipient.warmupEmailData &&
//         replyAutomation.shouldReply()
//       ) {
//         await replyAutomation.scheduleReply(
//           session.id,
//           {
//             subject: 'Warmup Email',
//             body: 'This is a warmup email',
//             from: account.email,
//             warmupId: sendResult.warmupId!,
//             threadId: sendResult.threadId!,
//             messageId: sendResult.messageId!,
//           },
//           recipient.warmupEmailData
//         )
//       }

//       // Step 11: Update warmup progress
//       await this.updateWarmupProgress(accountId, account.warmupStage)

//       logger.info('Warmup email sent successfully', {
//         accountId,
//         warmupType,
//         recipient: recipient.email,
//         messageId: sendResult.messageId,
//       })

//       return {
//         success: true,
//         accountId,
//         emailsSent: 1,
//         warmupType,
//         peerEmail: recipient.email,
//       }
//     } catch (error) {
//       logger.error('Warmup processing failed', error as Error, { accountId })

//       return {
//         success: false,
//         accountId,
//         emailsSent: 0,
//         warmupType: 'POOL',
//         error: (error as Error).message,
//       }
//     } finally {
//       // Always release lock
//       if (lockId) {
//         try {
//           await distributedLock.release(accountId, lockId)
//           logger.debug('Lock released successfully', { accountId, lockId })
//         } catch (error) {
//           logger.error('Failed to release lock', error as Error, {
//             accountId,
//             lockId,
//           })
//         }
//       }
//     }
//   }

//   /**
//    * Load and validate account
//    */
//   private async loadAndValidateAccount(
//     accountId: string
//   ): Promise<SendingAccountWithUser | null> {
//     try {
//       const account = await prisma.sendingAccount.findUnique({
//         where: { id: accountId },
//         include: {
//           user: {
//             select: {
//               subscriptionTier: true,
//             },
//           },
//         },
//       })

//       if (!account) {
//         logger.warn('Account not found', { accountId })
//         return null
//       }

//       // Validation checks
//       if (!account.warmupEnabled) {
//         logger.debug('Warmup not enabled', { accountId })
//         return null
//       }

//       if (!account.isActive || account.pausedAt) {
//         logger.debug('Account is paused', { accountId })
//         return null
//       }

//       if (account.healthScore < 50) {
//         logger.warn('Account health too low', {
//           accountId,
//           healthScore: account.healthScore,
//         })
//         return null
//       }

//       return account
//     } catch (error) {
//       logger.error('Failed to load account', error as Error, { accountId })
//       return null
//     }
//   }

//   /**
//    * Check if account can send today
//    */
//   private canSendToday(account: SendingAccount): boolean {
//     return account.emailsSentToday < account.warmupDailyLimit
//   }

//   /**
//    * Determine warmup type based on stage
//    */
//   private getWarmupType(stage: string): 'POOL' | 'PEER' {
//     const peerEligibleStages = ['WARM', 'ACTIVE', 'ESTABLISHED']
//     return peerEligibleStages.includes(stage) ? 'PEER' : 'POOL'
//   }

//   /**
//    * Get recipient (peer or pool email)
//    */
//   private async getRecipient(
//     account: SendingAccountWithUser,
//     warmupType: 'POOL' | 'PEER'
//   ): Promise<{
//     email: string
//     name: string
//     id?: string
//     warmupEmailData?: WarmupEmail
//   } | null> {
//     try {
//       if (warmupType === 'POOL') {
//         return await this.getPoolEmail()
//       } else {
//         return await this.getPeerEmail(account)
//       }
//     } catch (error) {
//       logger.error('Failed to get recipient', error as Error, {
//         accountId: account.id,
//         warmupType,
//       })
//       return null
//     }
//   }

//   /**
//    * Get email from pool (30-email warmup pool)
//    */
//   private async getPoolEmail(): Promise<{
//     email: string
//     name: string
//     id: string
//     warmupEmailData: WarmupEmail
//   } | null> {
//     try {
//       const poolEmails = await prisma.warmupEmail.findMany({
//         where: {
//           isActive: true,
//           OR: [
//             { cooldownUntil: null },
//             { cooldownUntil: { lte: new Date() } },
//           ],
//         },
//         orderBy: {
//           lastEmailSentAt: 'asc', // Use least recently used
//         },
//         take: 1,
//       })

//       if (poolEmails.length === 0) {
//         logger.warn('No pool emails available')
//         return null
//       }

//       const poolEmail = poolEmails[0]

//       // Update cooldown
//       await prisma.warmupEmail.update({
//         where: { id: poolEmail.id },
//         data: {
//           lastEmailSentAt: new Date(),
//           cooldownUntil: new Date(Date.now() + 3600000), // 1 hour cooldown
//         },
//       })

//       return {
//         email: poolEmail.email,
//         name: poolEmail.name,
//         id: poolEmail.id,
//         warmupEmailData: poolEmail,
//       }
//     } catch (error) {
//       logger.error('Failed to get pool email', error as Error)
//       return null
//     }
//   }

//   /**
//    * Get peer email from cache
//    */
//   private async getPeerEmail(
//     account: SendingAccountWithUser
//   ): Promise<{ email: string; name: string } | null> {
//     try {
//       // Check if peer warmup is enabled
//       if (!account.peerWarmupEnabled || !account.peerWarmupOptIn) {
//         logger.debug('Peer warmup not enabled for account', {
//           accountId: account.id,
//         })
//         return null
//       }

//       // Get cached peer matches
//       const peers = await peerCache.getCachedMatches(account.id, 10)

//       if (peers.length === 0) {
//         logger.warn('No peer matches available', { accountId: account.id })
//         return null
//       }

//       // Select random peer from top matches
//       const randomPeer =
//         peers[Math.floor(Math.random() * Math.min(3, peers.length))]

//       return {
//         email: randomPeer.email,
//         name: randomPeer.name,
//       }
//     } catch (error) {
//       logger.error('Failed to get peer email', error as Error, {
//         accountId: account.id,
//       })
//       return null
//     }
//   }

//   /**
//    * Update warmup progress and potentially advance stage
//    */
//   private async updateWarmupProgress(
//     accountId: string,
//     currentStage: string
//   ): Promise<void> {
//     try {
//       const account = await prisma.sendingAccount.findUnique({
//         where: { id: accountId },
//         select: {
//           warmupProgress: true,
//           warmupStartDate: true,
//         },
//       })

//       if (!account) {
//         logger.warn('Account not found for progress update', { accountId })
//         return
//       }

//       const daysInStage = Math.floor(
//         (Date.now() - account.warmupStartDate.getTime()) /
//           (1000 * 60 * 60 * 24)
//       )

//       // Stage advancement logic
//       const stageMap = {
//         NEW: { duration: 7, nextStage: 'WARMING', dailyLimit: 20 },
//         WARMING: { duration: 14, nextStage: 'WARM', dailyLimit: 40 },
//         WARM: { duration: 21, nextStage: 'ACTIVE', dailyLimit: 60 },
//         ACTIVE: { duration: 30, nextStage: 'ESTABLISHED', dailyLimit: 80 },
//         ESTABLISHED: { duration: Infinity, nextStage: null, dailyLimit: 100 },
//       }

//       const currentStageConfig =
//         stageMap[currentStage as keyof typeof stageMap]

//       if (currentStageConfig && daysInStage >= currentStageConfig.duration) {
//         const nextStage = currentStageConfig.nextStage

//         if (nextStage) {
//           await prisma.sendingAccount.update({
//             where: { id: accountId },
//             data: {
//               warmupStage: nextStage as WarmupStage,
//               warmupDailyLimit:
//                 stageMap[nextStage as keyof typeof stageMap].dailyLimit,
//               warmupProgress: 0,
//               // Enable peer warmup when reaching WARM stage
//               peerWarmupEnabled: ['WARM', 'ACTIVE', 'ESTABLISHED'].includes(
//                 nextStage
//               ),
//             },
//           })

//           logger.info('Account advanced to next warmup stage', {
//             accountId,
//             previousStage: currentStage,
//             newStage: nextStage,
//           })
//         }
//       } else {
//         // Just increment progress
//         await prisma.sendingAccount.update({
//           where: { id: accountId },
//           data: {
//             warmupProgress: { increment: 1 },
//           },
//         })
//       }
//     } catch (error) {
//       logger.error('Failed to update warmup progress', error as Error, {
//         accountId,
//       })
//       // Don't throw - this is non-critical
//     }
//   }

//   /**
//    * Batch process multiple accounts
//    */
//   async batchProcessAccounts(
//     accountIds: string[],
//     concurrency = 10
//   ): Promise<WarmupResult[]> {
//     logger.info('Starting batch warmup processing', {
//       total: accountIds.length,
//       concurrency,
//     })

//     const results: WarmupResult[] = []

//     // Process in chunks to control concurrency
//     for (let i = 0; i < accountIds.length; i += concurrency) {
//       const chunk = accountIds.slice(i, i + concurrency)

//       const chunkResults = await Promise.allSettled(
//         chunk.map((id) => this.processAccountWarmup(id))
//       )

//       const fulfilled = chunkResults
//         .filter((r) => r.status === 'fulfilled')
//         .map((r) => (r as PromiseFulfilledResult<WarmupResult>).value)

//       results.push(...fulfilled)

//       logger.info('Batch chunk processed', {
//         processed: i + chunk.length,
//         total: accountIds.length,
//       })

//       // Small delay between chunks
//       await new Promise((resolve) => setTimeout(resolve, 100))
//     }

//     const summary = {
//       total: results.length,
//       successful: results.filter((r) => r.success).length,
//       failed: results.filter((r) => !r.success && !r.skipped).length,
//       skipped: results.filter((r) => r.skipped).length,
//       emailsSent: results.reduce((sum, r) => sum + r.emailsSent, 0),
//     }

//     logger.info('Batch warmup processing completed', summary)

//     return results
//   }

//   /**
//    * Get accounts eligible for warmup right now
//    */
//   async getEligibleAccounts(limit = 1000): Promise<string[]> {
//     try {
//       const oneHourAgo = new Date(Date.now() - 3600000)

//       const accounts = await prisma.sendingAccount.findMany({
//         where: {
//           warmupEnabled: true,
//           isActive: true,
//           pausedAt: null,
//           healthScore: { gte: 50 },
//           emailsSentToday: {
//             lt: prisma.sendingAccount.fields.warmupDailyLimit,
//           },
//           // Only accounts that haven't been warmed in the last hour
//           OR: [
//             { lastWarmupAt: null },
//             { lastWarmupAt: { lte: oneHourAgo } },
//           ],
//         },
//         select: { id: true },
//         take: limit,
//         orderBy: [
//           { lastWarmupAt: 'asc' }, // Prioritize least recently warmed
//           { warmupProgress: 'asc' }, // Then by progress
//         ],
//       })

//       logger.info('Found eligible accounts for warmup', {
//         count: accounts.length,
//         limit,
//       })

//       return accounts.map((a) => a.id)
//     } catch (error) {
//       logger.error('Failed to get eligible accounts', error as Error)
//       return []
//     }
//   }

//   /**
//    * Estimate time to process all eligible accounts
//    */
//   async estimateProcessingTime(): Promise<{
//     eligibleAccounts: number
//     estimatedMinutes: number
//     currentRate: number
//   }> {
//     try {
//       const eligible = await this.getEligibleAccounts(10000)

//       // Assume 5 seconds per account on average
//       const estimatedSeconds = eligible.length * 5
//       const estimatedMinutes = Math.ceil(estimatedSeconds / 60)

//       // Calculate current processing rate (accounts per minute)
//       const tenMinutesAgo = new Date(Date.now() - 600000)

//       const recentSessions = await prisma.warmupSession.count({
//         where: {
//           lastSentAt: { gte: tenMinutesAgo },
//         },
//       })

//       const currentRate = recentSessions / 10 // Per minute

//       return {
//         eligibleAccounts: eligible.length,
//         estimatedMinutes,
//         currentRate,
//       }
//     } catch (error) {
//       logger.error('Failed to estimate processing time', error as Error)
//       return {
//         eligibleAccounts: 0,
//         estimatedMinutes: 0,
//         currentRate: 0,
//       }
//     }
//   }
// }

// export const coreWarmupManager = new CoreWarmupManager()

import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { distributedLock } from './distributed-lock'
import { peerCache } from './peer-cache'
import { emailSender } from './email-sender'
import { sessionManager } from './session-manager'
import { replyAutomation } from './reply-automation'
import { metricsTracker } from './metrics-tracker'
import type { SendingAccount, WarmupStage } from '@prisma/client'

interface SendingAccountWithUser extends SendingAccount {
  user?: {
    subscriptionTier: string
  } | null
}

interface WarmupResult {
  success: boolean
  accountId: string
  emailsSent: number
  peerEmail?: string
  error?: string
  skipped?: boolean
  skipReason?: string
}

export class CoreWarmupManager {
  /**
   * Process warmup for a single account
   * This is the main entry point called by Inngest jobs
   */
  async processAccountWarmup(accountId: string): Promise<WarmupResult> {
    logger.info('Starting warmup processing', { accountId })

    let lockId: string | null = null

    try {
      // Step 1: Acquire distributed lock
      lockId = await distributedLock.acquire(accountId, 300) // 5 min lock
    } catch (error) {
      logger.error('Failed to acquire lock - Redis error', error as Error, {
        accountId,
      })
      return {
        success: false,
        accountId,
        emailsSent: 0,
        error: `Lock acquisition failed: ${(error as Error).message}`,
      }
    }

    if (!lockId) {
      logger.debug('Account already being processed', { accountId })
      return {
        success: false,
        accountId,
        emailsSent: 0,
        skipped: true,
        skipReason: 'Already processing',
      }
    }

    try {
      // Step 2: Load account with validation
      const account = await this.loadAndValidateAccount(accountId)

      if (!account) {
        return {
          success: false,
          accountId,
          emailsSent: 0,
          skipped: true,
          skipReason: 'Account not found or invalid',
        }
      }

      // Step 3: Check if account can send today
      if (!this.canSendToday(account)) {
        logger.debug('Account reached daily limit', {
          accountId,
          sent: account.emailsSentToday,
          limit: account.warmupDailyLimit,
        })

        return {
          success: true,
          accountId,
          emailsSent: 0,
          skipped: true,
          skipReason: 'Daily limit reached',
        }
      }

      // Step 4: Get peer account to send to
      const peerAccount = await this.getPeerAccount(account)

      if (!peerAccount) {
        return {
          success: false,
          accountId,
          emailsSent: 0,
          error: 'No peer account available',
        }
      }

      // Step 5: Get or create session
      const session = await sessionManager.getOrCreateSession(account, {
        warmupType: 'PEER',
        dailyLimit: account.warmupDailyLimit,
        peerAccountEmail: peerAccount.email,
      })

      // Step 6: Send warmup email to peer
      const sendResult = await emailSender.sendWarmupEmail(
        session.id,
        account,
        peerAccount.email,
        peerAccount.name
      )

      if (!sendResult.success) {
        logger.error('Email send failed', {
          accountId,
          error: sendResult.error,
          recipient: peerAccount.email,
        })
        return {
          success: false,
          accountId,
          emailsSent: 0,
          error: sendResult.error,
        }
      }

      // Step 7: Track metrics
      await metricsTracker.trackEmailSent(accountId, session.id)

      // Step 8: Update session
      await sessionManager.updateSessionMetrics(session.id, {
        emailsSent: 1,
      })

      // Step 9: Schedule auto-reply from peer (simulate natural conversation)
      if (sendResult.warmupId && replyAutomation.shouldReply()) {
        await replyAutomation.scheduleReply(
          session.id,
          {
            subject: 'Warmup Email',
            body: 'This is a warmup email',
            from: account.email,
            warmupId: sendResult.warmupId,
            threadId: sendResult.threadId!,
            messageId: sendResult.messageId!,
          },
          peerAccount // Peer will reply to this account
        )
      }

      // Step 10: Update warmup progress
      await this.updateWarmupProgress(accountId, account.warmupStage)

      logger.info('Warmup email sent successfully', {
        accountId,
        peerEmail: peerAccount.email,
        messageId: sendResult.messageId,
      })

      return {
        success: true,
        accountId,
        emailsSent: 1,
        peerEmail: peerAccount.email,
      }
    } catch (error) {
      logger.error('Warmup processing failed', error as Error, { accountId })

      return {
        success: false,
        accountId,
        emailsSent: 0,
        error: (error as Error).message,
      }
    } finally {
      // Always release lock
      if (lockId) {
        try {
          await distributedLock.release(accountId, lockId)
          logger.debug('Lock released successfully', { accountId, lockId })
        } catch (error) {
          logger.error('Failed to release lock', error as Error, {
            accountId,
            lockId,
          })
        }
      }
    }
  }

  /**
   * Load and validate account
   */
  private async loadAndValidateAccount(
    accountId: string
  ): Promise<SendingAccountWithUser | null> {
    try {
      const account = await prisma.sendingAccount.findUnique({
        where: { id: accountId },
        include: {
          user: {
            select: {
              subscriptionTier: true,
            },
          },
        },
      })

      if (!account) {
        logger.warn('Account not found', { accountId })
        return null
      }

      // Validation checks
      if (!account.warmupEnabled) {
        logger.debug('Warmup not enabled', { accountId })
        return null
      }

      if (!account.isActive || account.pausedAt) {
        logger.debug('Account is paused', { accountId })
        return null
      }

      if (account.healthScore < 50) {
        logger.warn('Account health too low', {
          accountId,
          healthScore: account.healthScore,
        })
        return null
      }

      // Check if peer warmup is enabled
      if (!account.peerWarmupEnabled || !account.peerWarmupOptIn) {
        logger.warn('Peer warmup not enabled or opted in', {
          accountId,
          peerWarmupEnabled: account.peerWarmupEnabled,
          peerWarmupOptIn: account.peerWarmupOptIn,
        })
        return null
      }

      return account
    } catch (error) {
      logger.error('Failed to load account', error as Error, { accountId })
      return null
    }
  }

  /**
   * Check if account can send today
   */
  private canSendToday(account: SendingAccount): boolean {
    return account.emailsSentToday < account.warmupDailyLimit
  }

  /**
   * Get a peer SendingAccount to send warmup email to
   */
  private async getPeerAccount(
    account: SendingAccountWithUser
  ): Promise<SendingAccount | null> {
    try {
      // Get cached peer matches for this account
      const peers = await peerCache.getCachedMatches(account.id, 10)

      if (peers.length === 0) {
        logger.warn('No peer matches available from cache', {
          accountId: account.id,
        })

        // Fallback: Find any eligible peer account
        return await this.findAnyEligiblePeer(account)
      }

      // Select random peer from top matches
      const randomPeer =
        peers[Math.floor(Math.random() * Math.min(3, peers.length))]

      // Get the full SendingAccount record
      const peerAccount = await prisma.sendingAccount.findUnique({
        where: { id: randomPeer.id },
      })

      if (!peerAccount) {
        logger.warn('Peer account not found', { peerId: randomPeer.id })
        return await this.findAnyEligiblePeer(account)
      }

      return peerAccount
    } catch (error) {
      logger.error('Failed to get peer account', error as Error, {
        accountId: account.id,
      })
      return null
    }
  }

  /**
   * Fallback: Find any eligible peer account when cache is empty
   */
  private async findAnyEligiblePeer(
    account: SendingAccount
  ): Promise<SendingAccount | null> {
    try {
      const peers = await prisma.sendingAccount.findMany({
        where: {
          id: { not: account.id }, // Not the same account
          isActive: true,
          warmupEnabled: true,
          peerWarmupEnabled: true,
          peerWarmupOptIn: true,
          healthScore: { gte: 50 },
          // Don't send to accounts that can't receive more today
          emailsSentToday: {
            lt: prisma.sendingAccount.fields.warmupDailyLimit,
          },
        },
        take: 10,
        orderBy: {
          lastWarmupAt: 'asc', // Prefer accounts that haven't received recently
        },
      })

      if (peers.length === 0) {
        logger.warn('No eligible peer accounts found', {
          accountId: account.id,
        })
        return null
      }

      // Return random peer
      return peers[Math.floor(Math.random() * peers.length)]
    } catch (error) {
      logger.error('Failed to find eligible peer', error as Error, {
        accountId: account.id,
      })
      return null
    }
  }

  /**
   * Update warmup progress and potentially advance stage
   */
  private async updateWarmupProgress(
    accountId: string,
    currentStage: string
  ): Promise<void> {
    try {
      const account = await prisma.sendingAccount.findUnique({
        where: { id: accountId },
        select: {
          warmupProgress: true,
          warmupStartDate: true,
        },
      })

      if (!account) {
        logger.warn('Account not found for progress update', { accountId })
        return
      }

      const daysInStage = Math.floor(
        (Date.now() - account.warmupStartDate.getTime()) /
          (1000 * 60 * 60 * 24)
      )

      // Stage advancement logic
      const stageMap = {
        NEW: { duration: 7, nextStage: 'WARMING', dailyLimit: 20 },
        WARMING: { duration: 14, nextStage: 'WARM', dailyLimit: 40 },
        WARM: { duration: 21, nextStage: 'ACTIVE', dailyLimit: 60 },
        ACTIVE: { duration: 30, nextStage: 'ESTABLISHED', dailyLimit: 80 },
        ESTABLISHED: { duration: Infinity, nextStage: null, dailyLimit: 100 },
      }

      const currentStageConfig =
        stageMap[currentStage as keyof typeof stageMap]

      if (currentStageConfig && daysInStage >= currentStageConfig.duration) {
        const nextStage = currentStageConfig.nextStage

        if (nextStage) {
          await prisma.sendingAccount.update({
            where: { id: accountId },
            data: {
              warmupStage: nextStage as WarmupStage,
              warmupDailyLimit:
                stageMap[nextStage as keyof typeof stageMap].dailyLimit,
              warmupProgress: 0,
            },
          })

          logger.info('Account advanced to next warmup stage', {
            accountId,
            previousStage: currentStage,
            newStage: nextStage,
          })
        }
      } else {
        // Just increment progress
        await prisma.sendingAccount.update({
          where: { id: accountId },
          data: {
            warmupProgress: { increment: 1 },
          },
        })
      }
    } catch (error) {
      logger.error('Failed to update warmup progress', error as Error, {
        accountId,
      })
      // Don't throw - this is non-critical
    }
  }

  /**
   * Batch process multiple accounts
   */
  async batchProcessAccounts(
    accountIds: string[],
    concurrency = 10
  ): Promise<WarmupResult[]> {
    logger.info('Starting batch warmup processing', {
      total: accountIds.length,
      concurrency,
    })

    const results: WarmupResult[] = []

    // Process in chunks to control concurrency
    for (let i = 0; i < accountIds.length; i += concurrency) {
      const chunk = accountIds.slice(i, i + concurrency)

      const chunkResults = await Promise.allSettled(
        chunk.map((id) => this.processAccountWarmup(id))
      )

      const fulfilled = chunkResults
        .filter((r) => r.status === 'fulfilled')
        .map((r) => (r as PromiseFulfilledResult<WarmupResult>).value)

      results.push(...fulfilled)

      logger.info('Batch chunk processed', {
        processed: i + chunk.length,
        total: accountIds.length,
      })

      // Small delay between chunks
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    const summary = {
      total: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success && !r.skipped).length,
      skipped: results.filter((r) => r.skipped).length,
      emailsSent: results.reduce((sum, r) => sum + r.emailsSent, 0),
    }

    logger.info('Batch warmup processing completed', summary)

    return results
  }

  /**
   * Get accounts eligible for warmup right now
   */
  async getEligibleAccounts(limit = 1000): Promise<string[]> {
    try {
      const oneHourAgo = new Date(Date.now() - 3600000)

      const accounts = await prisma.sendingAccount.findMany({
        where: {
          warmupEnabled: true,
          isActive: true,
          pausedAt: null,
          healthScore: { gte: 50 },
          peerWarmupEnabled: true, // Must have peer warmup enabled
          peerWarmupOptIn: true, // Must have opted in
          emailsSentToday: {
            lt: prisma.sendingAccount.fields.warmupDailyLimit,
          },
          // Only accounts that haven't been warmed in the last hour
          OR: [
            { lastWarmupAt: null },
            { lastWarmupAt: { lte: oneHourAgo } },
          ],
        },
        select: { id: true },
        take: limit,
        orderBy: [
          { lastWarmupAt: 'asc' }, // Prioritize least recently warmed
          { warmupProgress: 'asc' }, // Then by progress
        ],
      })

      logger.info('Found eligible accounts for warmup', {
        count: accounts.length,
        limit,
      })

      return accounts.map((a) => a.id)
    } catch (error) {
      logger.error('Failed to get eligible accounts', error as Error)
      return []
    }
  }

  /**
   * Estimate time to process all eligible accounts
   */
  async estimateProcessingTime(): Promise<{
    eligibleAccounts: number
    estimatedMinutes: number
    currentRate: number
  }> {
    try {
      const eligible = await this.getEligibleAccounts(10000)

      // Assume 5 seconds per account on average
      const estimatedSeconds = eligible.length * 5
      const estimatedMinutes = Math.ceil(estimatedSeconds / 60)

      // Calculate current processing rate (accounts per minute)
      const tenMinutesAgo = new Date(Date.now() - 600000)

      const recentSessions = await prisma.warmupSession.count({
        where: {
          lastSentAt: { gte: tenMinutesAgo },
        },
      })

      const currentRate = recentSessions / 10 // Per minute

      return {
        eligibleAccounts: eligible.length,
        estimatedMinutes,
        currentRate,
      }
    } catch (error) {
      logger.error('Failed to estimate processing time', error as Error)
      return {
        eligibleAccounts: 0,
        estimatedMinutes: 0,
        currentRate: 0,
      }
    }
  }
}

export const coreWarmupManager = new CoreWarmupManager()