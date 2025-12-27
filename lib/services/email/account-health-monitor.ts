// lib/services/email/account-health-monitor.ts
import { db } from "@/lib/db"
import { decrypt } from "@/lib/encryption"
import { gmailOAuthImap } from "./gmail-oauth-imap"
import { outlookOAuthImap } from "./outlook-oauth-imap"
import { customSmtpImap } from "./custom-smtp-imap"
import type { Prisma } from "@prisma/client"

interface HealthMetrics {
  healthScore: number
  bounceRate: number
  spamComplaintRate: number
  replyRate: number
  openRate: number
  issues: string[]
  recommendations: string[]
}

export class AccountHealthMonitor {
  /**
   * Calculate health score for a sending account
   */
  async calculateHealthScore(accountId: string): Promise<HealthMetrics> {
    const account = await db.sendingAccount.findUnique({
      where: { id: accountId },
      include: {
        emailLogs: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        },
        bounces: {
          where: {
            bouncedAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    })

    if (!account) {
      throw new Error("Account not found")
    }

    const totalEmails = account.emailLogs.length
    const totalBounces = account.bounces.length
    const hardBounces = account.bounces.filter(b => b.bounceType === "HARD").length
    const spamComplaints = account.bounces.filter(b => b.bounceType === "COMPLAINT").length
    
    const opened = account.emailLogs.filter(e => e.opens > 0).length
    const replied = account.emailLogs.filter(e => e.status === "REPLIED").length

    // Calculate rates
    const bounceRate = totalEmails > 0 ? (totalBounces / totalEmails) * 100 : 0
    const spamComplaintRate = totalEmails > 0 ? (spamComplaints / totalEmails) * 100 : 0
    const replyRate = totalEmails > 0 ? (replied / totalEmails) * 100 : 0
    const openRate = totalEmails > 0 ? (opened / totalEmails) * 100 : 0

    // Calculate health score (0-100)
    let healthScore = 100
    const issues: string[] = []
    const recommendations: string[] = []

    // Bounce rate impact (critical)
    if (bounceRate > 5) {
      healthScore -= 30
      issues.push(`High bounce rate: ${bounceRate.toFixed(1)}%`)
      recommendations.push("Clean your email list and remove invalid addresses")
    } else if (bounceRate > 2) {
      healthScore -= 15
      issues.push(`Elevated bounce rate: ${bounceRate.toFixed(1)}%`)
      recommendations.push("Review email list quality")
    }

    // Spam complaint rate (critical)
    if (spamComplaintRate > 0.1) {
      healthScore -= 40
      issues.push(`High spam complaint rate: ${spamComplaintRate.toFixed(2)}%`)
      recommendations.push("Review email content and ensure proper consent")
    } else if (spamComplaintRate > 0.05) {
      healthScore -= 20
      issues.push(`Spam complaints detected: ${spamComplaintRate.toFixed(2)}%`)
      recommendations.push("Improve email content and targeting")
    }

    // Hard bounce tracking
    if (hardBounces > 10) {
      healthScore -= 15
      issues.push(`Too many hard bounces: ${hardBounces}`)
      recommendations.push("Validate emails before sending")
    }

    // Low engagement (warning)
    if (openRate < 10 && totalEmails > 20) {
      healthScore -= 10
      issues.push(`Low open rate: ${openRate.toFixed(1)}%`)
      recommendations.push("Improve subject lines and sender reputation")
    }

    // Reply rate (positive indicator)
    if (replyRate > 5) {
      healthScore += 5 // Bonus for good engagement
      healthScore = Math.min(100, healthScore) // Cap at 100
    }

    // Ensure score stays within bounds
    healthScore = Math.max(0, Math.min(100, healthScore))

    return {
      healthScore: Math.round(healthScore),
      bounceRate: parseFloat(bounceRate.toFixed(2)),
      spamComplaintRate: parseFloat(spamComplaintRate.toFixed(2)),
      replyRate: parseFloat(replyRate.toFixed(2)),
      openRate: parseFloat(openRate.toFixed(2)),
      issues,
      recommendations,
    }
  }

  /**
   * Test account connectivity (IMAP/SMTP)
   */
  async testConnectivity(accountId: string): Promise<{
    imap: boolean
    smtp: boolean
    healthy: boolean
    error?: string
  }> {
    const account = await db.sendingAccount.findUnique({
      where: { id: accountId },
    })

    if (!account) {
      throw new Error("Account not found")
    }

    // Decrypt credentials - handle Prisma JsonValue type
    const credentialsJson = account.credentials as Prisma.JsonValue
    const credentials = decrypt(JSON.stringify(credentialsJson))

    try {
      if (account.provider === "gmail") {
        // Refresh token if needed
        const accessToken = await this.ensureValidToken(
          credentials.refreshToken,
          "gmail"
        )
        return await gmailOAuthImap.verifyConnections(account.email, accessToken)
      } else if (account.provider === "outlook") {
        const accessToken = await this.ensureValidToken(
          credentials.refreshToken,
          "outlook"
        )
        return await outlookOAuthImap.verifyConnections(account.email, accessToken)
      } else {
        // Custom SMTP/IMAP
        return await customSmtpImap.validateCredentials(credentials)
      }
    } catch (error) {
      return {
        imap: false,
        smtp: false,
        healthy: false,
        error: error instanceof Error ? error.message : "Connection test failed",
      }
    }
  }

  /**
   * Ensure access token is valid (refresh if expired)
   */
  private async ensureValidToken(
    refreshToken: string,
    provider: "gmail" | "outlook"
  ): Promise<string> {
    if (provider === "gmail") {
      return await gmailOAuthImap.refreshAccessToken(refreshToken)
    } else {
      return await outlookOAuthImap.refreshAccessToken(refreshToken)
    }
  }

  /**
   * Run full health check on an account
   */
  async runHealthCheck(accountId: string): Promise<void> {
    console.log(`[Health Check] Starting for account ${accountId}`)

    // Calculate health metrics
    const metrics = await this.calculateHealthScore(accountId)

    // Test connectivity
    const connectivity = await this.testConnectivity(accountId)

    // Determine if account should be paused
    let shouldPause = false
    let pausedReason: string | null = null

    if (!connectivity.healthy) {
      shouldPause = true
      pausedReason = "Connection failed - IMAP or SMTP unreachable"
    } else if (metrics.healthScore < 30) {
      shouldPause = true
      pausedReason = "Health score critical - high bounce/spam rate"
    } else if (metrics.spamComplaintRate > 0.1) {
      shouldPause = true
      pausedReason = "Spam complaint rate exceeded threshold"
    } else if (metrics.bounceRate > 10) {
      shouldPause = true
      pausedReason = "Bounce rate exceeded threshold"
    }

    // Update account
    await db.sendingAccount.update({
      where: { id: accountId },
      data: {
        healthScore: metrics.healthScore,
        bounceRate: metrics.bounceRate,
        spamComplaintRate: metrics.spamComplaintRate,
        replyRate: metrics.replyRate,
        openRate: metrics.openRate,
        lastHealthCheck: new Date(),
        isActive: !shouldPause,
        pausedReason: shouldPause ? pausedReason : null,
        pausedAt: shouldPause ? new Date() : null,
      },
    })

    // Create notification if account was paused
    if (shouldPause) {
      const account = await db.sendingAccount.findUnique({
        where: { id: accountId },
        include: { user: true },
      })

      if (account) {
        await db.notification.create({
          data: {
            userId: account.userId,
            type: "CAMPAIGN_PAUSED",
            title: `Sending account paused: ${account.email}`,
            message: pausedReason || "Account health check failed",
            entityType: "sending_account",
            entityId: accountId,
            actionUrl: "/dashboard/settings",
          },
        })
      }
    }

    console.log(`[Health Check] Completed for account ${accountId}`, {
      healthScore: metrics.healthScore,
      isHealthy: connectivity.healthy,
      paused: shouldPause,
    })
  }

  /**
   * Run health checks for all active accounts
   */
  async runHealthChecksForAllAccounts(): Promise<void> {
    const accounts = await db.sendingAccount.findMany({
      where: {
        OR: [
          { isActive: true },
          {
            lastHealthCheck: {
              lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Not checked in 24h
            },
          },
        ],
      },
    })

    console.log(`[Health Check] Running checks for ${accounts.length} accounts`)

    for (const account of accounts) {
      try {
        await this.runHealthCheck(account.id)
      } catch (error) {
        console.error(`[Health Check] Failed for account ${account.id}:`, error)
      }
    }
  }

  /**
   * Get account rotation candidates (for load balancing)
   */
  async getRotationCandidates(userId: string): Promise<string[]> {
    const accounts = await db.sendingAccount.findMany({
      where: {
        userId,
        isActive: true,
        healthScore: {
          gte: 70, // Only use healthy accounts
        },
      },
      orderBy: [
        { healthScore: "desc" },
        { emailsSentToday: "asc" }, // Prefer accounts with fewer emails sent
      ],
    })

    return accounts.map(a => a.id)
  }
}

export const accountHealthMonitor = new AccountHealthMonitor()