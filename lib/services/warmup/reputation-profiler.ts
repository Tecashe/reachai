// import { prisma } from "@/lib/db"
// import { redis } from "@/lib/redis"
// import { logger } from "@/lib/logger"
// import dns from "dns/promises"

// /**
//  * REPUTATION PROFILER
//  * Analyzes account reputation, domain health, ESP configuration
//  * Provides personalized warmup strategies for each account
//  * Handles 100,000+ accounts with intelligent caching and batch processing
//  */
// class ReputationProfiler {
//   private readonly CACHE_TTL = 86400 // 24 hours
//   private readonly REDIS_PREFIX = "warmup:reputation:"

//   /**
//    * Create  or update reputation profile for an account
//    * Performs comprehensive analysis of domain, ESP, and sending history
//    */
//   async analyzeAccount(accountId: string): Promise<{
//     success: boolean
//     profileId?: string
//     recommendations?: any
//     error?: string
//   }> {
//     try {
//       const account = await prisma.sendingAccount.findUnique({
//         where: { id: accountId },
//         include: { reputationProfile: true },
//       })

//       if (!account) {
//         return { success: false, error: "Account not found" }
//       }

//       logger.info("[ReputationProfiler] Starting analysis", { accountId, email: account.email })

//       // Run parallel analysis
//       const [domainAnalysis, espAnalysis, historyAnalysis] = await Promise.all([
//         this.analyzeDomain(account.email),
//         this.detectESP(account),
//         this.analyzeHistory(accountId),
//       ])

//       // Calculate risk score and reputation tier
//       const riskScore = this.calculateRiskScore({
//         domainAnalysis,
//         historyAnalysis,
//       })

//       const reputationTier = this.determineReputationTier(riskScore, historyAnalysis)

//       // Determine account role based on sending patterns
//       const accountRole = this.determineAccountRole(historyAnalysis)

//       // Calculate recommended daily limit
//       const recommendedDailyLimit = this.calculateDailyLimit({
//         reputationTier,
//         domainAnalysis,
//         historyAnalysis,
//       })

//       // Determine warmup stage
//       const warmupStage = this.determineWarmupStage(historyAnalysis)

//       // Create or update profile
//       const profile = await prisma.reputationProfile.upsert({
//         where: { accountId },
//         create: {
//           accountId,
//           domainAge: domainAnalysis.domainAge,
//           domainReputation: domainAnalysis.reputation,
//           hasSpfRecord: domainAnalysis.hasSpf,
//           hasDkimRecord: domainAnalysis.hasDkim,
//           hasDmarcRecord: domainAnalysis.hasDmarc,
//           espType: espAnalysis.type,
//           espConfiguration: espAnalysis.config,
//           totalEmailsSent: historyAnalysis.totalSent,
//           lifetimeBounceRate: historyAnalysis.bounceRate,
//           lifetimeOpenRate: historyAnalysis.openRate,
//           lifetimeReplyRate: historyAnalysis.replyRate,
//           lifetimeSpamRate: historyAnalysis.spamRate,
//           riskScore,
//           reputationTier,
//           accountRole,
//           recommendedDailyLimit,
//           currentWarmupStage: warmupStage,
//           daysInWarmup: historyAnalysis.daysInWarmup,
//           industry: await this.detectIndustry(account.email),
//           lastAnalyzedAt: new Date(),
//           nextAnalysisAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
//         },
//         update: {
//           domainAge: domainAnalysis.domainAge,
//           domainReputation: domainAnalysis.reputation,
//           hasSpfRecord: domainAnalysis.hasSpf,
//           hasDkimRecord: domainAnalysis.hasDkim,
//           hasDmarcRecord: domainAnalysis.hasDmarc,
//           espType: espAnalysis.type,
//           espConfiguration: espAnalysis.config,
//           totalEmailsSent: historyAnalysis.totalSent,
//           lifetimeBounceRate: historyAnalysis.bounceRate,
//           lifetimeOpenRate: historyAnalysis.openRate,
//           lifetimeReplyRate: historyAnalysis.replyRate,
//           lifetimeSpamRate: historyAnalysis.spamRate,
//           riskScore,
//           reputationTier,
//           accountRole,
//           recommendedDailyLimit,
//           currentWarmupStage: warmupStage,
//           daysInWarmup: historyAnalysis.daysInWarmup,
//           lastAnalyzedAt: new Date(),
//           nextAnalysisAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//         },
//       })

//       // Cache profile
//       await this.cacheProfile(accountId, profile)

//       // Generate recommendations
//       const recommendations = this.generateRecommendations({
//         profile,
//         domainAnalysis,
//         historyAnalysis,
//       })

//       logger.info("[ReputationProfiler] Analysis complete", {
//         accountId,
//         reputationTier,
//         riskScore,
//         recommendedDailyLimit,
//       })

//       return { success: true, profileId: profile.id, recommendations }
//     } catch (error) {
//       logger.error("[ReputationProfiler] Analysis failed", { error, accountId })
//       return { success: false, error: error.message }
//     }
//   }

//   /**
//    * Analyze domain health and configuration
//    */
//   private async analyzeDomain(email: string): Promise<{
//     domainAge: number | null
//     reputation: number
//     hasSpf: boolean
//     hasDkim: boolean
//     hasDmarc: boolean
//   }> {
//     const domain = email.split("@")[1]

//     try {
//       // Check DNS records in parallel
//       const [spfRecords, dmarcRecords] = await Promise.all([
//         dns.resolveTxt(domain).catch(() => []),
//         dns.resolveTxt(`_dmarc.${domain}`).catch(() => []),
//       ])

//       const hasSpf = spfRecords.some((record) => record.join("").includes("v=spf1"))
//       const hasDmarc = dmarcRecords.some((record) => record.join("").includes("v=DMARC1"))

//       // DKIM is provider-specific, assume true if using known provider
//       const hasDkim = true // Will be refined with ESP detection

//       // Domain reputation score (0-100)
//       let reputation = 50 // Start neutral

//       if (hasSpf) reputation += 15
//       if (hasDkim) reputation += 15
//       if (hasDmarc) reputation += 20

//       // Domain age would require WHOIS lookup (implement if needed)
//       // For now, estimate based on account creation date
//       const domainAge = null

//       return {
//         domainAge,
//         reputation,
//         hasSpf,
//         hasDkim,
//         hasDmarc,
//       }
//     } catch (error) {
//       logger.error("[ReputationProfiler] Domain analysis failed", { error, domain })
//       return {
//         domainAge: null,
//         reputation: 50,
//         hasSpf: false,
//         hasDkim: false,
//         hasDmarc: false,
//       }
//     }
//   }

//   /**
//    * Detect ESP type and configuration
//    */
//   private async detectESP(account: any): Promise<{
//     type: string
//     config: any
//   }> {
//     const email = account.email.toLowerCase()
//     const domain = email.split("@")[1]

//     // Detect major ESPs
//     if (domain === "gmail.com" || domain === "googlemail.com") {
//       return {
//         type: "gmail",
//         config: {
//           primaryInboxStrategy: "high_engagement",
//           promotionsRisk: "medium",
//           spamSensitivity: "high",
//         },
//       }
//     }

//     if (domain.includes("outlook") || domain.includes("hotmail") || domain.includes("live.com")) {
//       return {
//         type: "outlook",
//         config: {
//           focusedInboxStrategy: "sender_reputation",
//           spamSensitivity: "medium",
//         },
//       }
//     }

//     if (domain === "yahoo.com" || domain === "ymail.com") {
//       return {
//         type: "yahoo",
//         config: {
//           spamSensitivity: "high",
//           throttlingStrict: true,
//         },
//       }
//     }

//     // Custom domain
//     return {
//       type: "custom",
//       config: {
//         domain,
//         requiresDNSValidation: true,
//       },
//     }
//   }

//   /**
//    * Analyze sending history
//    */
//   private async analyzeHistory(accountId: string): Promise<{
//     totalSent: number
//     bounceRate: number
//     openRate: number
//     replyRate: number
//     spamRate: number
//     daysInWarmup: number
//   }> {
//     const [metrics, firstEmail] = await Promise.all([
//       prisma.warmupInteraction.aggregate({
//         where: { senderAccountId: accountId, status: "SENT" },
//         _count: { id: true },
//         _sum: {
//           opened: true,
//           replied: true,
//           bounced: true,
//           markedSpam: true,
//         },
//       }),
//       prisma.warmupInteraction.findFirst({
//         where: { senderAccountId: accountId },
//         orderBy: { sentAt: "asc" },
//         select: { sentAt: true },
//       }),
//     ])

//     const totalSent = metrics._count.id || 0
//     const totalOpened = metrics._sum.opened || 0
//     const totalReplied = metrics._sum.replied || 0
//     const totalBounced = metrics._sum.bounced || 0
//     const totalSpam = metrics._sum.markedSpam || 0

//     const bounceRate = totalSent > 0 ? (totalBounced / totalSent) * 100 : 0
//     const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0
//     const replyRate = totalSent > 0 ? (totalReplied / totalSent) * 100 : 0
//     const spamRate = totalSent > 0 ? (totalSpam / totalSent) * 100 : 0

//     const daysInWarmup = firstEmail
//       ? Math.floor((Date.now() - new Date(firstEmail.sentAt).getTime()) / (24 * 60 * 60 * 1000))
//       : 0

//     return {
//       totalSent,
//       bounceRate,
//       openRate,
//       replyRate,
//       spamRate,
//       daysInWarmup,
//     }
//   }

//   /**
//    * Calculate risk score (0-100, higher = riskier)
//    */
//   private calculateRiskScore(data: {
//     domainAnalysis: any
//     historyAnalysis: any
//   }): number {
//     let risk = 50 // Start neutral

//     // Domain health (reduce risk)
//     risk -= (data.domainAnalysis.reputation - 50) * 0.3

//     // Bounce rate (increase risk)
//     risk += data.historyAnalysis.bounceRate * 2

//     // Spam rate (major risk increase)
//     risk += data.historyAnalysis.spamRate * 3

//     // Open rate (reduce risk)
//     if (data.historyAnalysis.openRate > 30) {
//       risk -= (data.historyAnalysis.openRate - 30) * 0.5
//     }

//     // Reply rate (significantly reduce risk)
//     if (data.historyAnalysis.replyRate > 10) {
//       risk -= (data.historyAnalysis.replyRate - 10) * 1.5
//     }

//     // Clamp to 0-100
//     return Math.max(0, Math.min(100, risk))
//   }

//   /**
//    * Determine reputation tier
//    */
//   private determineReputationTier(
//     riskScore: number,
//     history: any,
//   ): "PRISTINE" | "HIGH" | "MEDIUM" | "LOW" | "CRITICAL" {
//     if (riskScore < 20 && history.spamRate === 0) return "PRISTINE"
//     if (riskScore < 35) return "HIGH"
//     if (riskScore < 60) return "MEDIUM"
//     if (riskScore < 80) return "LOW"
//     return "CRITICAL"
//   }

//   /**
//    * Determine account role based on sending patterns
//    */
//   private determineAccountRole(history: any): "BUSINESS" | "CUSTOMER" | "NEUTRAL" {
//     if (history.totalSent > 100 && history.replyRate < 20) return "BUSINESS"
//     if (history.replyRate > 40) return "CUSTOMER"
//     return "NEUTRAL"
//   }

//   /**
//    * Calculate recommended daily sending limit
//    */
//   private calculateDailyLimit(data: {
//     reputationTier: string
//     domainAnalysis: any
//     historyAnalysis: any
//   }): number {
//     const baseLimits = {
//       PRISTINE: 50,
//       HIGH: 40,
//       MEDIUM: 25,
//       LOW: 15,
//       CRITICAL: 5,
//     }

//     let limit = baseLimits[data.reputationTier] || 20

//     // Adjust based on domain reputation
//     if (data.domainAnalysis.reputation > 70) {
//       limit = Math.floor(limit * 1.2)
//     }

//     // Adjust based on warmup maturity
//     if (data.historyAnalysis.daysInWarmup > 30) {
//       limit = Math.floor(limit * 1.5)
//     }

//     return limit
//   }

//   /**
//    * Determine warmup stage
//    */
//   private determineWarmupStage(history: any): string {
//     if (history.daysInWarmup < 7) return "initial"
//     if (history.daysInWarmup < 21) return "building"
//     if (history.daysInWarmup < 45) return "established"
//     return "mature"
//   }

//   /**
//    * Detect industry from email domain
//    */
//   private async detectIndustry(email: string): Promise<string | null> {
//     const domain = email.split("@")[1].toLowerCase()

//     // Simple industry detection (can be enhanced with ML/API)
//     const industryKeywords = {
//       tech: ["tech", "software", "dev", "digital", "cloud", "ai"],
//       finance: ["bank", "finance", "capital", "invest", "trading"],
//       healthcare: ["health", "medical", "clinic", "pharma", "care"],
//       marketing: ["marketing", "agency", "media", "creative", "brand"],
//       education: ["edu", "university", "school", "academy", "learning"],
//     }

//     for (const [industry, keywords] of Object.entries(industryKeywords)) {
//       if (keywords.some((keyword) => domain.includes(keyword))) {
//         return industry
//       }
//     }

//     return null
//   }

//   /**
//    * Generate personalized recommendations
//    */
//   private generateRecommendations(data: {
//     profile: any
//     domainAnalysis: any
//     historyAnalysis: any
//   }): any {
//     const recommendations = []

//     // DNS recommendations
//     if (!data.domainAnalysis.hasSpf) {
//       recommendations.push({
//         type: "critical",
//         category: "dns",
//         message: "Add SPF record to improve deliverability",
//         impact: "high",
//       })
//     }

//     if (!data.domainAnalysis.hasDmarc) {
//       recommendations.push({
//         type: "warning",
//         category: "dns",
//         message: "Add DMARC record for better email authentication",
//         impact: "medium",
//       })
//     }

//     // Bounce rate warnings
//     if (data.historyAnalysis.bounceRate > 5) {
//       recommendations.push({
//         type: "critical",
//         category: "deliverability",
//         message: `High bounce rate (${data.historyAnalysis.bounceRate.toFixed(1)}%). Clean your recipient list.`,
//         impact: "high",
//       })
//     }

//     // Engagement recommendations
//     if (data.historyAnalysis.openRate < 20 && data.historyAnalysis.totalSent > 50) {
//       recommendations.push({
//         type: "warning",
//         category: "engagement",
//         message: "Low open rate. Consider improving subject lines and sender reputation.",
//         impact: "medium",
//       })
//     }

//     // Warmup pace
//     if (data.profile.reputationTier === "CRITICAL") {
//       recommendations.push({
//         type: "critical",
//         category: "strategy",
//         message: "Critical reputation. Slow warmup recommended (5-10 emails/day).",
//         impact: "high",
//       })
//     }

//     return {
//       recommendations,
//       dailyLimit: data.profile.recommendedDailyLimit,
//       estimatedWarmupDuration: this.estimateWarmupDuration(data.profile.reputationTier),
//     }
//   }

//   /**
//    * Estimate warmup duration in days
//    */
//   private estimateWarmupDuration(tier: string): number {
//     const durations = {
//       PRISTINE: 21,
//       HIGH: 28,
//       MEDIUM: 35,
//       LOW: 45,
//       CRITICAL: 60,
//     }
//     return durations[tier] || 35
//   }

//   /**
//    * Cache operations
//    */
//   private async cacheProfile(accountId: string, profile: any): Promise<void> {
//     const key = `${this.REDIS_PREFIX}${accountId}`
//     await redis.setex(key, this.CACHE_TTL, JSON.stringify(profile))
//   }

//   async getProfile(accountId: string): Promise<any> {
//     const key = `${this.REDIS_PREFIX}${accountId}`
//     const cached = await redis.get(key)

//     if (cached) {
//       return JSON.parse(cached)
//     }

//     const profile = await prisma.reputationProfile.findUnique({
//       where: { accountId },
//       include: { account: true },
//     })

//     if (profile) {
//       await this.cacheProfile(accountId, profile)
//     }

//     return profile
//   }

//   /**
//    * Batch analyze accounts (for background jobs)
//    */
//   async batchAnalyze(accountIds: string[]): Promise<{
//     processed: number
//     succeeded: number
//     failed: number
//   }> {
//     let succeeded = 0
//     let failed = 0

//     // Process in batches of 10
//     const batchSize = 10
//     for (let i = 0; i < accountIds.length; i += batchSize) {
//       const batch = accountIds.slice(i, i + batchSize)

//       await Promise.all(
//         batch.map(async (accountId) => {
//           const result = await this.analyzeAccount(accountId)
//           if (result.success) succeeded++
//           else failed++
//         }),
//       )
//     }

//     return { processed: accountIds.length, succeeded, failed }
//   }
// }

// export const reputationProfiler = new ReputationProfiler()



// import { prisma } from "@/lib/db"
// import { redis } from "@/lib/redis"
// import { logger } from "@/lib/logger"
// import dns from "dns/promises"
// import { handleError } from "@/lib/types/custom-errors"

// /**
//  * REPUTATION PROFILER
//  * Analyzes account reputation, domain health, ESP configuration
//  * Provides personalized warmup strategies for each account
//  * Handles 100,000+ accounts with intelligent caching and batch processing
//  */
// class ReputationProfiler {
//   private readonly CACHE_TTL = 86400 // 24 hours
//   private readonly REDIS_PREFIX = "warmup:reputation:"

//   /**
//    * Create or update reputation profile for an account
//    * Performs comprehensive analysis of domain, ESP, and sending history
//    */
//   async analyzeAccount(accountId: string): Promise<{
//     success: boolean
//     profileId?: string
//     recommendations?: any
//     error?: string
//   }> {
//     try {
//       const account = await prisma.sendingAccount.findUnique({
//         where: { id: accountId },
//         include: { reputationProfile: true },
//       })

//       if (!account) {
//         return { success: false, error: "Account not found" }
//       }

//       logger.info("[ReputationProfiler] Starting analysis", { accountId, email: account.email })

//       // Run parallel analysis
//       const [domainAnalysis, espAnalysis, historyAnalysis] = await Promise.all([
//         this.analyzeDomain(account.email),
//         this.detectESP(account),
//         this.analyzeHistory(accountId),
//       ])

//       // Calculate risk score and reputation tier
//       const riskScore = this.calculateRiskScore({
//         domainAnalysis,
//         historyAnalysis,
//       })

//       const reputationTier = this.determineReputationTier(riskScore, historyAnalysis)

//       // Determine account role based on sending patterns
//       const accountRole = this.determineAccountRole(historyAnalysis)

//       // Calculate recommended daily limit
//       const recommendedDailyLimit = this.calculateDailyLimit({
//         reputationTier,
//         domainAnalysis,
//         historyAnalysis,
//       })

//       // Determine warmup stage
//       const warmupStage = this.determineWarmupStage(historyAnalysis)

//       // Create or update profile
//       const profile = await prisma.reputationProfile.upsert({
//         where: { accountId },
//         create: {
//           accountId,
//           domainAge: domainAnalysis.domainAge,
//           domainReputation: domainAnalysis.reputation,
//           hasSpfRecord: domainAnalysis.hasSpf,
//           hasDkimRecord: domainAnalysis.hasDkim,
//           hasDmarcRecord: domainAnalysis.hasDmarc,
//           espType: espAnalysis.type,
//           espConfiguration: espAnalysis.config,
//           totalEmailsSent: historyAnalysis.totalSent,
//           lifetimeBounceRate: historyAnalysis.bounceRate,
//           lifetimeOpenRate: historyAnalysis.openRate,
//           lifetimeReplyRate: historyAnalysis.replyRate,
//           lifetimeSpamRate: historyAnalysis.spamRate,
//           riskScore,
//           reputationTier,
//           accountRole,
//           recommendedDailyLimit,
//           currentWarmupStage: warmupStage,
//           daysInWarmup: historyAnalysis.daysInWarmup,
//           industry: await this.detectIndustry(account.email),
//           lastAnalyzedAt: new Date(),
//           nextAnalysisAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
//         },
//         update: {
//           domainAge: domainAnalysis.domainAge,
//           domainReputation: domainAnalysis.reputation,
//           hasSpfRecord: domainAnalysis.hasSpf,
//           hasDkimRecord: domainAnalysis.hasDkim,
//           hasDmarcRecord: domainAnalysis.hasDmarc,
//           espType: espAnalysis.type,
//           espConfiguration: espAnalysis.config,
//           totalEmailsSent: historyAnalysis.totalSent,
//           lifetimeBounceRate: historyAnalysis.bounceRate,
//           lifetimeOpenRate: historyAnalysis.openRate,
//           lifetimeReplyRate: historyAnalysis.replyRate,
//           lifetimeSpamRate: historyAnalysis.spamRate,
//           riskScore,
//           reputationTier,
//           accountRole,
//           recommendedDailyLimit,
//           currentWarmupStage: warmupStage,
//           daysInWarmup: historyAnalysis.daysInWarmup,
//           lastAnalyzedAt: new Date(),
//           nextAnalysisAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//         },
//       })

//       // Cache profile
//       await this.cacheProfile(accountId, profile)

//       // Generate recommendations
//       const recommendations = this.generateRecommendations({
//         profile,
//         domainAnalysis,
//         historyAnalysis,
//       })

//       logger.info("[ReputationProfiler] Analysis complete", {
//         accountId,
//         reputationTier,
//         riskScore,
//         recommendedDailyLimit,
//       })

//       return { success: true, profileId: profile.id, recommendations }
//     } catch (error) {
//       logger.error("[ReputationProfiler] Analysis failed", { error: handleError(error), accountId })
//       return { success: false, error: handleError(error) }
//     }
//   }

//   /**
//    * Analyze domain health and configuration
//    */
//   private async analyzeDomain(email: string): Promise<{
//     domainAge: number | null
//     reputation: number
//     hasSpf: boolean
//     hasDkim: boolean
//     hasDmarc: boolean
//   }> {
//     const domain = email.split("@")[1]

//     try {
//       // Check DNS records in parallel
//       const [spfRecords, dmarcRecords] = await Promise.all([
//         dns.resolveTxt(domain).catch(() => []),
//         dns.resolveTxt(`_dmarc.${domain}`).catch(() => []),
//       ])

//       const hasSpf = spfRecords.some((record) => record.join("").includes("v=spf1"))
//       const hasDmarc = dmarcRecords.some((record) => record.join("").includes("v=DMARC1"))

//       // DKIM is provider-specific, assume true if using known provider
//       const hasDkim = true // Will be refined with ESP detection

//       // Domain reputation score (0-100)
//       let reputation = 50 // Start neutral

//       if (hasSpf) reputation += 15
//       if (hasDkim) reputation += 15
//       if (hasDmarc) reputation += 20

//       // Domain age would require WHOIS lookup (implement if needed)
//       // For now, estimate based on account creation date
//       const domainAge = null

//       return {
//         domainAge,
//         reputation,
//         hasSpf,
//         hasDkim,
//         hasDmarc,
//       }
//     } catch (error) {
//       logger.error("[ReputationProfiler] Domain analysis failed", { error, domain })
//       return {
//         domainAge: null,
//         reputation: 50,
//         hasSpf: false,
//         hasDkim: false,
//         hasDmarc: false,
//       }
//     }
//   }

//   /**
//    * Detect ESP type and configuration
//    */
//   private async detectESP(account: any): Promise<{
//     type: string
//     config: any
//   }> {
//     const email = account.email.toLowerCase()
//     const domain = email.split("@")[1]

//     // Detect major ESPs
//     if (domain === "gmail.com" || domain === "googlemail.com") {
//       return {
//         type: "gmail",
//         config: {
//           primaryInboxStrategy: "high_engagement",
//           promotionsRisk: "medium",
//           spamSensitivity: "high",
//         },
//       }
//     }

//     if (domain.includes("outlook") || domain.includes("hotmail") || domain.includes("live.com")) {
//       return {
//         type: "outlook",
//         config: {
//           focusedInboxStrategy: "sender_reputation",
//           spamSensitivity: "medium",
//         },
//       }
//     }

//     if (domain === "yahoo.com" || domain === "ymail.com") {
//       return {
//         type: "yahoo",
//         config: {
//           spamSensitivity: "high",
//           throttlingStrict: true,
//         },
//       }
//     }

//     // Custom domain
//     return {
//       type: "custom",
//       config: {
//         domain,
//         requiresDNSValidation: true,
//       },
//     }
//   }

//   /**
//    * Analyze sending history
//    */
//   private async analyzeHistory(accountId: string): Promise<{
//     totalSent: number
//     bounceRate: number
//     openRate: number
//     replyRate: number
//     spamRate: number
//     daysInWarmup: number
//   }> {
//     const metricsResult = await prisma.warmupInteraction.aggregate({
//       where: { sendingAccountId: accountId },
//       _count: { id: true },
//     })

//     const totalSent = metricsResult._count.id || 0

//     const firstEmail = await prisma.warmupInteraction.findFirst({
//       where: { sendingAccountId: accountId },
//       orderBy: { sentAt: "asc" },
//       select: { sentAt: true },
//     })

//     const [openedCount, repliedCount, spamCount] = await Promise.all([
//       prisma.warmupInteraction.count({
//         where: { sendingAccountId: accountId, opened: true },
//       }),
//       prisma.warmupInteraction.count({
//         where: { sendingAccountId: accountId, repliedAt: { not: null } },
//       }),
//       prisma.warmupInteraction.count({
//         where: { sendingAccountId: accountId, landedInSpam: true },
//       }),
//     ])

//     const totalOpened = openedCount
//     const totalReplied = repliedCount
//     const totalSpam = spamCount
//     const totalBounced = 0 // Calculate from email logs if needed

//     const bounceRate = totalSent > 0 ? (totalBounced / totalSent) * 100 : 0
//     const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0
//     const replyRate = totalSent > 0 ? (totalReplied / totalSent) * 100 : 0
//     const spamRate = totalSent > 0 ? (totalSpam / totalSent) * 100 : 0

//     const daysInWarmup = firstEmail
//       ? Math.floor((Date.now() - new Date(firstEmail.sentAt).getTime()) / (24 * 60 * 60 * 1000))
//       : 0

//     return {
//       totalSent,
//       bounceRate,
//       openRate,
//       replyRate,
//       spamRate,
//       daysInWarmup,
//     }
//   }

//   /**
//    * Calculate risk score (0-100, higher = riskier)
//    */
//   private calculateRiskScore(data: {
//     domainAnalysis: any
//     historyAnalysis: any
//   }): number {
//     let risk = 50 // Start neutral

//     // Domain health (reduce risk)
//     risk -= (data.domainAnalysis.reputation - 50) * 0.3

//     // Bounce rate (increase risk)
//     risk += data.historyAnalysis.bounceRate * 2

//     // Spam rate (major risk increase)
//     risk += data.historyAnalysis.spamRate * 3

//     // Open rate (reduce risk)
//     if (data.historyAnalysis.openRate > 30) {
//       risk -= (data.historyAnalysis.openRate - 30) * 0.5
//     }

//     // Reply rate (significantly reduce risk)
//     if (data.historyAnalysis.replyRate > 10) {
//       risk -= (data.historyAnalysis.replyRate - 10) * 1.5
//     }

//     // Clamp to 0-100
//     return Math.max(0, Math.min(100, risk))
//   }

//   /**
//    * Determine reputation tier
//    */
//   private determineReputationTier(
//     riskScore: number,
//     history: any,
//   ): "PRISTINE" | "HIGH" | "MEDIUM" | "LOW" | "CRITICAL" {
//     if (riskScore < 20 && history.spamRate === 0) return "PRISTINE"
//     if (riskScore < 35) return "HIGH"
//     if (riskScore < 60) return "MEDIUM"
//     if (riskScore < 80) return "LOW"
//     return "CRITICAL"
//   }

//   /**
//    * Determine account role based on sending patterns
//    */
//   private determineAccountRole(history: any): "BUSINESS" | "CUSTOMER" | "NEUTRAL" {
//     if (history.totalSent > 100 && history.replyRate < 20) return "BUSINESS"
//     if (history.replyRate > 40) return "CUSTOMER"
//     return "NEUTRAL"
//   }

//   /**
//    * Calculate recommended daily sending limit
//    */
//   private calculateDailyLimit(data: {
//     reputationTier: string
//     domainAnalysis: any
//     historyAnalysis: any
//   }): number {
//     const baseLimits: Record<string, number> = {
//       PRISTINE: 50,
//       HIGH: 40,
//       MEDIUM: 25,
//       LOW: 15,
//       CRITICAL: 5,
//     }

//     let limit = baseLimits[data.reputationTier] || 20

//     // Adjust based on domain reputation
//     if (data.domainAnalysis.reputation > 70) {
//       limit = Math.floor(limit * 1.2)
//     }

//     // Adjust based on warmup maturity
//     if (data.historyAnalysis.daysInWarmup > 30) {
//       limit = Math.floor(limit * 1.5)
//     }

//     return limit
//   }

//   /**
//    * Determine warmup stage
//    */
//   private determineWarmupStage(history: any): string {
//     if (history.daysInWarmup < 7) return "initial"
//     if (history.daysInWarmup < 21) return "building"
//     if (history.daysInWarmup < 45) return "established"
//     return "mature"
//   }

//   /**
//    * Detect industry from email domain
//    */
//   private async detectIndustry(email: string): Promise<string | null> {
//     const domain = email.split("@")[1].toLowerCase()

//     // Simple industry detection (can be enhanced with ML/API)
//     const industryKeywords = {
//       tech: ["tech", "software", "dev", "digital", "cloud", "ai"],
//       finance: ["bank", "finance", "capital", "invest", "trading"],
//       healthcare: ["health", "medical", "clinic", "pharma", "care"],
//       marketing: ["marketing", "agency", "media", "creative", "brand"],
//       education: ["edu", "university", "school", "academy", "learning"],
//     }

//     for (const [industry, keywords] of Object.entries(industryKeywords)) {
//       if (keywords.some((keyword) => domain.includes(keyword))) {
//         return industry
//       }
//     }

//     return null
//   }

//   /**
//    * Generate personalized recommendations
//    */
//   private generateRecommendations(data: {
//     profile: any
//     domainAnalysis: any
//     historyAnalysis: any
//   }): any {
//     const recommendations = []

//     // DNS recommendations
//     if (!data.domainAnalysis.hasSpf) {
//       recommendations.push({
//         type: "critical",
//         category: "dns",
//         message: "Add SPF record to improve deliverability",
//         impact: "high",
//       })
//     }

//     if (!data.domainAnalysis.hasDmarc) {
//       recommendations.push({
//         type: "warning",
//         category: "dns",
//         message: "Add DMARC record for better email authentication",
//         impact: "medium",
//       })
//     }

//     // Bounce rate warnings
//     if (data.historyAnalysis.bounceRate > 5) {
//       recommendations.push({
//         type: "critical",
//         category: "deliverability",
//         message: `High bounce rate (${data.historyAnalysis.bounceRate.toFixed(1)}%). Clean your recipient list.`,
//         impact: "high",
//       })
//     }

//     // Engagement recommendations
//     if (data.historyAnalysis.openRate < 20 && data.historyAnalysis.totalSent > 50) {
//       recommendations.push({
//         type: "warning",
//         category: "engagement",
//         message: "Low open rate. Consider improving subject lines and sender reputation.",
//         impact: "medium",
//       })
//     }

//     // Warmup pace
//     if (data.profile.reputationTier === "CRITICAL") {
//       recommendations.push({
//         type: "critical",
//         category: "strategy",
//         message: "Critical reputation. Slow warmup recommended (5-10 emails/day).",
//         impact: "high",
//       })
//     }

//     return {
//       recommendations,
//       dailyLimit: data.profile.recommendedDailyLimit,
//       estimatedWarmupDuration: this.estimateWarmupDuration(data.profile.reputationTier),
//     }
//   }

//   /**
//    * Estimate warmup duration in days
//    */
//   private estimateWarmupDuration(tier: string): number {
//     const durations: Record<string, number> = {
//       PRISTINE: 21,
//       HIGH: 28,
//       MEDIUM: 35,
//       LOW: 45,
//       CRITICAL: 60,
//     }
//     return durations[tier] || 35
//   }

//   /**
//    * Cache operations
//    */
//   private async cacheProfile(accountId: string, profile: any): Promise<void> {
//     const key = `${this.REDIS_PREFIX}${accountId}`
//     await redis.setex(key, this.CACHE_TTL, JSON.stringify(profile))
//   }

//   async getProfile(accountId: string): Promise<any> {
//     const key = `${this.REDIS_PREFIX}${accountId}`
//     const cached = await redis.get(key)

//     if (cached) {
//       return JSON.parse(cached)
//     }

//     const profile = await prisma.reputationProfile.findUnique({
//       where: { accountId },
//       include: { account: true },
//     })

//     if (profile) {
//       await this.cacheProfile(accountId, profile)
//     }

//     return profile
//   }

//   /**
//    * Batch analyze accounts (for background jobs)
//    */
//   async batchAnalyze(accountIds: string[]): Promise<{
//     processed: number
//     succeeded: number
//     failed: number
//   }> {
//     let succeeded = 0
//     let failed = 0

//     // Process in batches of 10
//     const batchSize = 10
//     for (let i = 0; i < accountIds.length; i += batchSize) {
//       const batch = accountIds.slice(i, i + batchSize)

//       await Promise.all(
//         batch.map(async (accountId) => {
//           const result = await this.analyzeAccount(accountId)
//           if (result.success) succeeded++
//           else failed++
//         }),
//       )
//     }

//     return { processed: accountIds.length, succeeded, failed }
//   }

//   /**
//    * Update reputation metrics after events
//    * Called by webhook handler
//    */
//   async updateReputation(
//     accountId: string,
//     metrics: {
//       bounceCount?: number
//       complaintCount?: number
//       openCount?: number
//       replyCount?: number
//     },
//   ): Promise<void> {
//     try {
//       const profile = await prisma.reputationProfile.findUnique({
//         where: { accountId },
//       })

//       if (!profile) {
//         logger.warn("[ReputationProfiler] Profile not found, creating...", { accountId })
//         await this.analyzeAccount(accountId)
//         return
//       }

//       // Calculate new rates
//       const totalSent = profile.totalEmailsSent || 1

//       const updates: {
//         lifetimeBounceRate?: number
//         lifetimeSpamRate?: number
//         lifetimeOpenRate?: number
//         lifetimeReplyRate?: number
//         riskScore?: number
//         reputationTier?: string
//         recommendedDailyLimit?: number
//       } = {}

//       if (metrics.bounceCount) {
//         const newBounceRate = ((profile.lifetimeBounceRate * totalSent + metrics.bounceCount) / (totalSent + 1)) * 100
//         updates.lifetimeBounceRate = newBounceRate

//         // Adjust risk score
//         if (newBounceRate > 5) {
//           updates.riskScore = Math.min(100, (profile.riskScore || 50) + 5)
//         }
//       }

//       if (metrics.complaintCount) {
//         const newSpamRate = ((profile.lifetimeSpamRate * totalSent + metrics.complaintCount) / (totalSent + 1)) * 100
//         updates.lifetimeSpamRate = newSpamRate

//         // Complaint is critical - increase risk significantly
//         updates.riskScore = Math.min(100, (profile.riskScore || 50) + 15)
//       }

//       if (metrics.openCount) {
//         const newOpenRate = ((profile.lifetimeOpenRate * totalSent + metrics.openCount) / (totalSent + 1)) * 100
//         updates.lifetimeOpenRate = newOpenRate

//         // Good engagement reduces risk
//         if (newOpenRate > 30) {
//           updates.riskScore = Math.max(0, (profile.riskScore || 50) - 2)
//         }
//       }

//       if (metrics.replyCount) {
//         const newReplyRate = ((profile.lifetimeReplyRate * totalSent + metrics.replyCount) / (totalSent + 1)) * 100
//         updates.lifetimeReplyRate = newReplyRate

//         // Replies are excellent - reduce risk
//         updates.riskScore = Math.max(0, (profile.riskScore || 50) - 5)
//       }

//       // Recalculate reputation tier if risk score changed
//       if (updates.riskScore !== undefined) {
//         updates.reputationTier = this.determineReputationTier(updates.riskScore, {
//           totalSent: profile.totalEmailsSent,
//           bounceRate: updates.lifetimeBounceRate || profile.lifetimeBounceRate,
//           openRate: updates.lifetimeOpenRate || profile.lifetimeOpenRate,
//           replyRate: updates.lifetimeReplyRate || profile.lifetimeReplyRate,
//           spamRate: updates.lifetimeSpamRate || profile.lifetimeSpamRate,
//           daysInWarmup: profile.daysInWarmup,
//         })

//         // Recalculate recommended limit
//         updates.recommendedDailyLimit = this.calculateDailyLimit({
//           reputationTier: updates.reputationTier,
//           domainAnalysis: {
//             reputation: profile.domainReputation,
//           },
//           historyAnalysis: {
//             daysInWarmup: profile.daysInWarmup,
//           },
//         })
//       }

//       await prisma.reputationProfile.update({
//         where: { accountId },
//         data: updates,
//       })

//       // Invalidate cache
//       await this.invalidateCache(accountId)

//       logger.info("[ReputationProfiler] Reputation updated", {
//         accountId,
//         updates: Object.keys(updates),
//       })
//     } catch (error) {
//       logger.error("[ReputationProfiler] Update failed", error as Error, {
//         accountId,
//       })
//     }
//   }

//   /**
//    * Invalidate cache for account
//    */
//   private async invalidateCache(accountId: string): Promise<void> {
//     const key = `${this.REDIS_PREFIX}${accountId}`
//     await redis.del(key)
//   }
// }

// export const reputationProfiler = new ReputationProfiler()






import { prisma } from "@/lib/db"
import { redis } from "@/lib/redis"
import { logger } from "@/lib/logger"
import dns from "dns/promises"
import { handleError } from "@/lib/types/custom-errors"

/**
 * REPUTATION PROFILER
 * Analyzes account reputation, domain health, ESP configuration
 * Provides personalized warmup strategies for each account
 * Handles 100,000+ accounts with intelligent caching and batch processing
 */
class ReputationProfiler {
  private readonly CACHE_TTL = 86400 // 24 hours
  private readonly REDIS_PREFIX = "warmup:reputation:"

  /**
   * Create or update reputation profile for an account
   * Performs comprehensive analysis of domain, ESP, and sending history
   */
  async analyzeAccount(accountId: string): Promise<{
    success: boolean
    profileId?: string
    recommendations?: any
    error?: string
  }> {
    try {
      const account = await prisma.sendingAccount.findUnique({
        where: { id: accountId },
        include: { reputationProfile: true },
      })

      if (!account) {
        return { success: false, error: "Account not found" }
      }

      logger.info("[ReputationProfiler] Starting analysis", { accountId, email: account.email })

      // Run parallel analysis
      const [domainAnalysis, espAnalysis, historyAnalysis] = await Promise.all([
        this.analyzeDomain(account.email),
        this.detectESP(account),
        this.analyzeHistory(accountId),
      ])

      // Calculate risk score and reputation tier
      const riskScore = this.calculateRiskScore({
        domainAnalysis,
        historyAnalysis,
      })

      const reputationTier = this.determineReputationTier(riskScore, historyAnalysis)

      // Determine account role based on sending patterns
      const accountRole = this.determineAccountRole(historyAnalysis)

      // Calculate recommended daily limit
      const recommendedDailyLimit = this.calculateDailyLimit({
        reputationTier,
        domainAnalysis,
        historyAnalysis,
      })

      // Determine warmup stage
      const warmupStage = this.determineWarmupStage(historyAnalysis)

      // Create or update profile
      const profile = await prisma.reputationProfile.upsert({
        where: { accountId },
        create: {
          accountId,
          domainAge: domainAnalysis.domainAge,
          domainReputation: domainAnalysis.reputation,
          hasSpfRecord: domainAnalysis.hasSpf,
          hasDkimRecord: domainAnalysis.hasDkim,
          hasDmarcRecord: domainAnalysis.hasDmarc,
          espType: espAnalysis.type,
          espConfiguration: espAnalysis.config,
          totalEmailsSent: historyAnalysis.totalSent,
          lifetimeBounceRate: historyAnalysis.bounceRate,
          lifetimeOpenRate: historyAnalysis.openRate,
          lifetimeReplyRate: historyAnalysis.replyRate,
          lifetimeSpamRate: historyAnalysis.spamRate,
          riskScore,
          reputationTier,
          accountRole,
          recommendedDailyLimit,
          currentWarmupStage: warmupStage,
          daysInWarmup: historyAnalysis.daysInWarmup,
          industry: await this.detectIndustry(account.email),
          lastAnalyzedAt: new Date(),
          nextAnalysisAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
        update: {
          domainAge: domainAnalysis.domainAge,
          domainReputation: domainAnalysis.reputation,
          hasSpfRecord: domainAnalysis.hasSpf,
          hasDkimRecord: domainAnalysis.hasDkim,
          hasDmarcRecord: domainAnalysis.hasDmarc,
          espType: espAnalysis.type,
          espConfiguration: espAnalysis.config,
          totalEmailsSent: historyAnalysis.totalSent,
          lifetimeBounceRate: historyAnalysis.bounceRate,
          lifetimeOpenRate: historyAnalysis.openRate,
          lifetimeReplyRate: historyAnalysis.replyRate,
          lifetimeSpamRate: historyAnalysis.spamRate,
          riskScore,
          reputationTier,
          accountRole,
          recommendedDailyLimit,
          currentWarmupStage: warmupStage,
          daysInWarmup: historyAnalysis.daysInWarmup,
          lastAnalyzedAt: new Date(),
          nextAnalysisAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      })

      // Cache profile
      await this.cacheProfile(accountId, profile)

      // Generate recommendations
      const recommendations = this.generateRecommendations({
        profile,
        domainAnalysis,
        historyAnalysis,
      })

      logger.info("[ReputationProfiler] Analysis complete", {
        accountId,
        reputationTier,
        riskScore,
        recommendedDailyLimit,
      })

      return { success: true, profileId: profile.id, recommendations }
    } catch (error) {
      logger.error("[ReputationProfiler] Analysis failed", { error: handleError(error), accountId })
      return { success: false, error: handleError(error) }
    }
  }

  /**
   * Analyze domain health and configuration
   */
  private async analyzeDomain(email: string): Promise<{
    domainAge: number | null
    reputation: number
    hasSpf: boolean
    hasDkim: boolean
    hasDmarc: boolean
  }> {
    const domain = email.split("@")[1]

    try {
      // Check DNS records in parallel
      const [spfRecords, dmarcRecords] = await Promise.all([
        dns.resolveTxt(domain).catch(() => []),
        dns.resolveTxt(`_dmarc.${domain}`).catch(() => []),
      ])

      const hasSpf = spfRecords.some((record) => record.join("").includes("v=spf1"))
      const hasDmarc = dmarcRecords.some((record) => record.join("").includes("v=DMARC1"))

      // DKIM is provider-specific, assume true if using known provider
      const hasDkim = true // Will be refined with ESP detection

      // Domain reputation score (0-100)
      let reputation = 50 // Start neutral

      if (hasSpf) reputation += 15
      if (hasDkim) reputation += 15
      if (hasDmarc) reputation += 20

      // Domain age would require WHOIS lookup (implement if needed)
      // For now, estimate based on account creation date
      const domainAge = null

      return {
        domainAge,
        reputation,
        hasSpf,
        hasDkim,
        hasDmarc,
      }
    } catch (error) {
      logger.error("[ReputationProfiler] Domain analysis failed", { error, domain })
      return {
        domainAge: null,
        reputation: 50,
        hasSpf: false,
        hasDkim: false,
        hasDmarc: false,
      }
    }
  }

  /**
   * Detect ESP type and configuration
   */
  private async detectESP(account: any): Promise<{
    type: string
    config: any
  }> {
    const email = account.email.toLowerCase()
    const domain = email.split("@")[1]

    // Detect major ESPs
    if (domain === "gmail.com" || domain === "googlemail.com") {
      return {
        type: "gmail",
        config: {
          primaryInboxStrategy: "high_engagement",
          promotionsRisk: "medium",
          spamSensitivity: "high",
        },
      }
    }

    if (domain.includes("outlook") || domain.includes("hotmail") || domain.includes("live.com")) {
      return {
        type: "outlook",
        config: {
          focusedInboxStrategy: "sender_reputation",
          spamSensitivity: "medium",
        },
      }
    }

    if (domain === "yahoo.com" || domain === "ymail.com") {
      return {
        type: "yahoo",
        config: {
          spamSensitivity: "high",
          throttlingStrict: true,
        },
      }
    }

    // Custom domain
    return {
      type: "custom",
      config: {
        domain,
        requiresDNSValidation: true,
      },
    }
  }

  /**
   * Analyze sending history
   */
  private async analyzeHistory(accountId: string): Promise<{
    totalSent: number
    bounceRate: number
    openRate: number
    replyRate: number
    spamRate: number
    daysInWarmup: number
  }> {
    const metricsResult = await prisma.warmupInteraction.aggregate({
      where: { sendingAccountId: accountId },
      _count: { id: true },
    })

    const totalSent = metricsResult._count.id || 0

    const firstEmail = await prisma.warmupInteraction.findFirst({
      where: { sendingAccountId: accountId },
      orderBy: { sentAt: "asc" },
      select: { sentAt: true },
    })

    const [openedCount, repliedCount, spamCount] = await Promise.all([
      prisma.warmupInteraction.count({
        where: { sendingAccountId: accountId, openedAt: { not: null } },
      }),
      prisma.warmupInteraction.count({
        where: { sendingAccountId: accountId, repliedAt: { not: null } },
      }),
      prisma.warmupInteraction.count({
        where: { sendingAccountId: accountId, landedInSpam: true },
      }),
    ])

    const totalOpened = openedCount
    const totalReplied = repliedCount
    const totalSpam = spamCount
    const totalBounced = 0 // Calculate from email logs if needed

    const bounceRate = totalSent > 0 ? (totalBounced / totalSent) * 100 : 0
    const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0
    const replyRate = totalSent > 0 ? (totalReplied / totalSent) * 100 : 0
    const spamRate = totalSent > 0 ? (totalSpam / totalSent) * 100 : 0

    const daysInWarmup = firstEmail?.sentAt
  ? Math.floor((Date.now() - new Date(firstEmail.sentAt).getTime()) / (24 * 60 * 60 * 1000))
  : 0

    return {
      totalSent,
      bounceRate,
      openRate,
      replyRate,
      spamRate,
      daysInWarmup,
    }
  }

  /**
   * Calculate risk score (0-100, higher = riskier)
   */
  private calculateRiskScore(data: {
    domainAnalysis: any
    historyAnalysis: any
  }): number {
    let risk = 50 // Start neutral

    // Domain health (reduce risk)
    risk -= (data.domainAnalysis.reputation - 50) * 0.3

    // Bounce rate (increase risk)
    risk += data.historyAnalysis.bounceRate * 2

    // Spam rate (major risk increase)
    risk += data.historyAnalysis.spamRate * 3

    // Open rate (reduce risk)
    if (data.historyAnalysis.openRate > 30) {
      risk -= (data.historyAnalysis.openRate - 30) * 0.5
    }

    // Reply rate (significantly reduce risk)
    if (data.historyAnalysis.replyRate > 10) {
      risk -= (data.historyAnalysis.replyRate - 10) * 1.5
    }

    // Clamp to 0-100
    return Math.max(0, Math.min(100, risk))
  }

  /**
   * Determine reputation tier
   */
  private determineReputationTier(
    riskScore: number,
    history: any,
  ): "PRISTINE" | "HIGH" | "MEDIUM" | "LOW" | "CRITICAL" {
    if (riskScore < 20 && history.spamRate === 0) return "PRISTINE"
    if (riskScore < 35) return "HIGH"
    if (riskScore < 60) return "MEDIUM"
    if (riskScore < 80) return "LOW"
    return "CRITICAL"
  }

  /**
   * Determine account role based on sending patterns
   */
  private determineAccountRole(history: any): "BUSINESS" | "CUSTOMER" | "NEUTRAL" {
    if (history.totalSent > 100 && history.replyRate < 20) return "BUSINESS"
    if (history.replyRate > 40) return "CUSTOMER"
    return "NEUTRAL"
  }

  /**
   * Calculate recommended daily sending limit
   */
  private calculateDailyLimit(data: {
    reputationTier: string
    domainAnalysis: any
    historyAnalysis: any
  }): number {
    const baseLimits: Record<string, number> = {
      PRISTINE: 50,
      HIGH: 40,
      MEDIUM: 25,
      LOW: 15,
      CRITICAL: 5,
    }

    let limit = baseLimits[data.reputationTier] || 20

    // Adjust based on domain reputation
    if (data.domainAnalysis.reputation > 70) {
      limit = Math.floor(limit * 1.2)
    }

    // Adjust based on warmup maturity
    if (data.historyAnalysis.daysInWarmup > 30) {
      limit = Math.floor(limit * 1.5)
    }

    return limit
  }

  /**
   * Determine warmup stage
   */
  private determineWarmupStage(history: any): string {
    if (history.daysInWarmup < 7) return "initial"
    if (history.daysInWarmup < 21) return "building"
    if (history.daysInWarmup < 45) return "established"
    return "mature"
  }

  /**
   * Detect industry from email domain
   */
  private async detectIndustry(email: string): Promise<string | null> {
    const domain = email.split("@")[1].toLowerCase()

    // Simple industry detection (can be enhanced with ML/API)
    const industryKeywords = {
      tech: ["tech", "software", "dev", "digital", "cloud", "ai"],
      finance: ["bank", "finance", "capital", "invest", "trading"],
      healthcare: ["health", "medical", "clinic", "pharma", "care"],
      marketing: ["marketing", "agency", "media", "creative", "brand"],
      education: ["edu", "university", "school", "academy", "learning"],
    }

    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      if (keywords.some((keyword) => domain.includes(keyword))) {
        return industry
      }
    }

    return null
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(data: {
    profile: any
    domainAnalysis: any
    historyAnalysis: any
  }): any {
    const recommendations = []

    // DNS recommendations
    if (!data.domainAnalysis.hasSpf) {
      recommendations.push({
        type: "critical",
        category: "dns",
        message: "Add SPF record to improve deliverability",
        impact: "high",
      })
    }

    if (!data.domainAnalysis.hasDmarc) {
      recommendations.push({
        type: "warning",
        category: "dns",
        message: "Add DMARC record for better email authentication",
        impact: "medium",
      })
    }

    // Bounce rate warnings
    if (data.historyAnalysis.bounceRate > 5) {
      recommendations.push({
        type: "critical",
        category: "deliverability",
        message: `High bounce rate (${data.historyAnalysis.bounceRate.toFixed(1)}%). Clean your recipient list.`,
        impact: "high",
      })
    }

    // Engagement recommendations
    if (data.historyAnalysis.openRate < 20 && data.historyAnalysis.totalSent > 50) {
      recommendations.push({
        type: "warning",
        category: "engagement",
        message: "Low open rate. Consider improving subject lines and sender reputation.",
        impact: "medium",
      })
    }

    // Warmup pace
    if (data.profile.reputationTier === "CRITICAL") {
      recommendations.push({
        type: "critical",
        category: "strategy",
        message: "Critical reputation. Slow warmup recommended (5-10 emails/day).",
        impact: "high",
      })
    }

    return {
      recommendations,
      dailyLimit: data.profile.recommendedDailyLimit,
      estimatedWarmupDuration: this.estimateWarmupDuration(data.profile.reputationTier),
    }
  }

  /**
   * Estimate warmup duration in days
   */
  private estimateWarmupDuration(tier: string): number {
    const durations: Record<string, number> = {
      PRISTINE: 21,
      HIGH: 28,
      MEDIUM: 35,
      LOW: 45,
      CRITICAL: 60,
    }
    return durations[tier] || 35
  }

  /**
   * Cache operations
   */
  private async cacheProfile(accountId: string, profile: any): Promise<void> {
    const key = `${this.REDIS_PREFIX}${accountId}`
    await redis.setex(key, this.CACHE_TTL, JSON.stringify(profile))
  }

  async getProfile(accountId: string): Promise<any> {
    const key = `${this.REDIS_PREFIX}${accountId}`
    const cached = await redis.get(key)

    if (cached && typeof cached === 'string') {
      return JSON.parse(cached)
    }

    const profile = await prisma.reputationProfile.findUnique({
      where: { accountId },
      include: { account: true },
    })

    if (profile) {
      await this.cacheProfile(accountId, profile)
    }

    return profile
  }

  /**
   * Batch analyze accounts (for background jobs)
   */
  async batchAnalyze(accountIds: string[]): Promise<{
    processed: number
    succeeded: number
    failed: number
  }> {
    let succeeded = 0
    let failed = 0

    // Process in batches of 10
    const batchSize = 10
    for (let i = 0; i < accountIds.length; i += batchSize) {
      const batch = accountIds.slice(i, i + batchSize)

      await Promise.all(
        batch.map(async (accountId) => {
          const result = await this.analyzeAccount(accountId)
          if (result.success) succeeded++
          else failed++
        }),
      )
    }

    return { processed: accountIds.length, succeeded, failed }
  }

  /**
   * Update reputation metrics after events
   * Called by webhook handler
   */
  async updateReputation(
    accountId: string,
    metrics: {
      bounceCount?: number
      complaintCount?: number
      openCount?: number
      replyCount?: number
    },
  ): Promise<void> {
    try {
      const profile = await prisma.reputationProfile.findUnique({
        where: { accountId },
      })

      if (!profile) {
        logger.warn("[ReputationProfiler] Profile not found, creating...", { accountId })
        await this.analyzeAccount(accountId)
        return
      }

      // Calculate new rates
      const totalSent = profile.totalEmailsSent || 1

      const updatesOld: {
        lifetimeBounceRate?: number
        lifetimeSpamRate?: number
        lifetimeOpenRate?: number
        lifetimeReplyRate?: number
        riskScore?: number
        reputationTier?: string
        recommendedDailyLimit?: number
      } = {}

      const updates: {
        lifetimeBounceRate?: number
        lifetimeSpamRate?: number
        lifetimeOpenRate?: number
        lifetimeReplyRate?: number
        riskScore?: number
        reputationTier?: "PRISTINE" | "HIGH" | "MEDIUM" | "LOW" | "CRITICAL"
        recommendedDailyLimit?: number
      } = {}

      if (metrics.bounceCount) {
        const newBounceRate = ((profile.lifetimeBounceRate * totalSent + metrics.bounceCount) / (totalSent + 1)) * 100
        updates.lifetimeBounceRate = newBounceRate

        // Adjust risk score
        if (newBounceRate > 5) {
          updates.riskScore = Math.min(100, (profile.riskScore || 50) + 5)
        }
      }

      if (metrics.complaintCount) {
        const newSpamRate = ((profile.lifetimeSpamRate * totalSent + metrics.complaintCount) / (totalSent + 1)) * 100
        updates.lifetimeSpamRate = newSpamRate

        // Complaint is critical - increase risk significantly
        updates.riskScore = Math.min(100, (profile.riskScore || 50) + 15)
      }

      if (metrics.openCount) {
        const newOpenRate = ((profile.lifetimeOpenRate * totalSent + metrics.openCount) / (totalSent + 1)) * 100
        updates.lifetimeOpenRate = newOpenRate

        // Good engagement reduces risk
        if (newOpenRate > 30) {
          updates.riskScore = Math.max(0, (profile.riskScore || 50) - 2)
        }
      }

      if (metrics.replyCount) {
        const newReplyRate = ((profile.lifetimeReplyRate * totalSent + metrics.replyCount) / (totalSent + 1)) * 100
        updates.lifetimeReplyRate = newReplyRate

        // Replies are excellent - reduce risk
        updates.riskScore = Math.max(0, (profile.riskScore || 50) - 5)
      }

      // Recalculate reputation tier if risk score changed
      if (updates.riskScore !== undefined) {
        
        updates.reputationTier = this.determineReputationTier(updates.riskScore, {
          totalSent: profile.totalEmailsSent,
          bounceRate: updates.lifetimeBounceRate || profile.lifetimeBounceRate,
          openRate: updates.lifetimeOpenRate || profile.lifetimeOpenRate,
          replyRate: updates.lifetimeReplyRate || profile.lifetimeReplyRate,
          spamRate: updates.lifetimeSpamRate || profile.lifetimeSpamRate,
          daysInWarmup: profile.daysInWarmup,
        })

        // Recalculate recommended limit
        updates.recommendedDailyLimit = this.calculateDailyLimit({
          reputationTier: updates.reputationTier,
          domainAnalysis: {
            reputation: profile.domainReputation,
          },
          historyAnalysis: {
            daysInWarmup: profile.daysInWarmup,
          },
        })
      }

      await prisma.reputationProfile.update({
        where: { accountId },
        data: updates,
      })

      // Invalidate cache
      await this.invalidateCache(accountId)

      logger.info("[ReputationProfiler] Reputation updated", {
        accountId,
        updates: Object.keys(updates),
      })
    } catch (error) {
      logger.error("[ReputationProfiler] Update failed", error as Error, {
        accountId,
      })
    }
  }

  /**
   * Invalidate cache for account
   */
  private async invalidateCache(accountId: string): Promise<void> {
    const key = `${this.REDIS_PREFIX}${accountId}`
    await redis.del(key)
  }
}

export const reputationProfiler = new ReputationProfiler()
