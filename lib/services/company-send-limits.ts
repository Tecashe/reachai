import { db } from "../db"
import { logger } from "../logger"

interface CompanyLimitCheck {
  allowed: boolean
  reason?: string
  currentCount: number
  limit: number
  suggestedAction?: string
}

class CompanySendLimitManager {
  /**
   * Extract company domain from email address
   */
  private extractDomain(email: string): string {
    const domain = email.split("@")[1]?.toLowerCase()
    if (!domain) throw new Error("Invalid email address")
    return domain
  }

  /**
   * Check if sending to this company is allowed
   */
  async canSendToCompany(userId: string, recipientEmail: string): Promise<CompanyLimitCheck> {
    const domain = this.extractDomain(recipientEmail)

    // Get or create company limit record
    let companyLimit = await db.companySendLimit.findUnique({
      where: { userId_companyDomain: { userId, companyDomain: domain } },
    })

    if (!companyLimit) {
      companyLimit = await db.companySendLimit.create({
        data: {
          userId,
          companyDomain: domain,
          dailyLimit: 2, // Conservative default
          weeklyLimit: 5,
        },
      })
    }

    // Reset counters if needed
    const now = new Date()
    const lastReset = new Date(companyLimit.lastResetDate)

    if (now.getDate() !== lastReset.getDate()) {
      companyLimit = await db.companySendLimit.update({
        where: { id: companyLimit.id },
        data: {
          emailsSentToday: 0,
          lastResetDate: now,
        },
      })
    }

    // Check daily limit
    if (companyLimit.emailsSentToday >= companyLimit.dailyLimit) {
      return {
        allowed: false,
        reason: `Daily limit reached for ${domain}`,
        currentCount: companyLimit.emailsSentToday,
        limit: companyLimit.dailyLimit,
        suggestedAction:
          companyLimit.engagementScore > 70
            ? "This company is highly engaged. Consider increasing limit."
            : "Try again tomorrow or increase limit manually.",
      }
    }

    // Check weekly limit
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    if (companyLimit.lastResetWeek < weekStart) {
      await db.companySendLimit.update({
        where: { id: companyLimit.id },
        data: {
          emailsSentThisWeek: 0,
          lastResetWeek: now,
        },
      })
    }

    if (companyLimit.emailsSentThisWeek >= companyLimit.weeklyLimit) {
      return {
        allowed: false,
        reason: `Weekly limit reached for ${domain}`,
        currentCount: companyLimit.emailsSentThisWeek,
        limit: companyLimit.weeklyLimit,
        suggestedAction: "Try again next week or increase limit manually.",
      }
    }

    return {
      allowed: true,
      currentCount: companyLimit.emailsSentToday,
      limit: companyLimit.dailyLimit,
    }
  }

  /**
   * Record that an email was sent to this company
   */
  async recordEmailSent(userId: string, recipientEmail: string): Promise<void> {
    const domain = this.extractDomain(recipientEmail)

    await db.companySendLimit.upsert({
      where: { userId_companyDomain: { userId, companyDomain: domain } },
      create: {
        userId,
        companyDomain: domain,
        emailsSentToday: 1,
        emailsSentThisWeek: 1,
        totalEmailsSent: 1,
      },
      update: {
        emailsSentToday: { increment: 1 },
        emailsSentThisWeek: { increment: 1 },
        totalEmailsSent: { increment: 1 },
      },
    })

    logger.info("Email sent to company recorded", { userId, domain })
  }

  /**
   * Update engagement metrics when prospect interacts
   */
  async recordEngagement(userId: string, recipientEmail: string, type: "open" | "click" | "reply"): Promise<void> {
    const domain = this.extractDomain(recipientEmail)

    const companyLimit = await db.companySendLimit.findUnique({
      where: { userId_companyDomain: { userId, companyDomain: domain } },
    })

    if (!companyLimit) return

    // Calculate new engagement score
    const totalInteractions = companyLimit.totalOpens + companyLimit.totalClicks + companyLimit.totalReplies
    const totalEmails = companyLimit.totalEmailsSent || 1
    const baseScore = (totalInteractions / totalEmails) * 100

    // Weight replies more heavily
    const replyBonus = companyLimit.totalReplies * 10
    const engagementScore = Math.min(100, baseScore + replyBonus)

    // Auto-adjust limits based on engagement
    const updates: any = {
      lastEngagement: new Date(),
      engagementScore,
    }

    if (type === "open") updates.totalOpens = { increment: 1 }
    if (type === "click") updates.totalClicks = { increment: 1 }
    if (type === "reply") updates.totalReplies = { increment: 1 }

    // AI-powered limit adjustment
    if (companyLimit.autoAdjust) {
      if (engagementScore > 70 && companyLimit.dailyLimit < 5) {
        updates.dailyLimit = 5
        updates.suggestedLimit = 5
        logger.info("AI increased company send limit", { domain, newLimit: 5 })
      } else if (engagementScore > 50 && companyLimit.dailyLimit < 3) {
        updates.dailyLimit = 3
        updates.suggestedLimit = 3
        logger.info("AI increased company send limit", { domain, newLimit: 3 })
      }
    }

    await db.companySendLimit.update({
      where: { id: companyLimit.id },
      data: updates,
    })

    logger.info("Company engagement recorded", { userId, domain, type, engagementScore })
  }

  /**
   * Get all company limits for a user
   */
  async getCompanyLimits(userId: string) {
    return db.companySendLimit.findMany({
      where: { userId },
      orderBy: { engagementScore: "desc" },
    })
  }

  /**
   * Bulk check limits for multiple recipients
   */
  async bulkCheckLimits(userId: string, recipientEmails: string[]): Promise<Map<string, CompanyLimitCheck>> {
    const results = new Map<string, CompanyLimitCheck>()

    for (const email of recipientEmails) {
      const check = await this.canSendToCompany(userId, email)
      results.set(email, check)
    }

    return results
  }
}

export const companySendLimits = new CompanySendLimitManager()
