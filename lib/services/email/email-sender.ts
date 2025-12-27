// lib/services/email/email-sender.ts
import { db } from "@/lib/db"
import { decrypt, encrypt } from "@/lib/encryption"
import { gmailOAuthImap } from "./gmail-oauth-imap"
import { outlookOAuthImap } from "./outlook-oauth-imap"
import { customSmtpImap } from "./custom-smtp-imap"
import { accountHealthMonitor } from "./account-health-monitor"
import type { Prisma } from "@prisma/client"

interface SendEmailParams {
  prospectId: string
  subject: string
  body: string
  html?: string
  userId: string
  campaignId?: string
}

interface SendResult {
  success: boolean
  emailLogId?: string
  sendingAccountId?: string
  error?: string
}

export class EmailSendingService {
  /**
   * Select best sending account for email
   * Implements intelligent rotation based on:
   * - Health score
   * - Daily/hourly limits
   * - Warmup stage
   * - Recent usage
   */
  private async selectSendingAccount(userId: string): Promise<string | null> {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours())

    // Find eligible accounts
    const accounts = await db.sendingAccount.findMany({
      where: {
        userId,
        isActive: true,
        healthScore: { gte: 70 }, // Only use healthy accounts
      },
      orderBy: [
        { healthScore: "desc" },
        { warmupStage: "desc" }, // Prefer more warmed up accounts
        { emailsSentToday: "asc" }, // Prefer accounts with fewer emails sent
      ],
    })

    if (accounts.length === 0) {
      return null
    }

    // Filter accounts that haven't hit limits
    const eligibleAccounts = accounts.filter(account => {
      // Check if need to reset daily counter
      const lastReset = new Date(account.lastResetDate)
      if (lastReset < today) {
        // Will be reset when selected
        return true
      }

      // Check if need to reset hourly counter
      const lastHourReset = new Date(account.lastResetHour)
      if (lastHourReset < thisHour) {
        // Will be reset when selected
        return true
      }

      // Check warmup limits
      const effectiveLimit = account.warmupEnabled 
        ? account.warmupDailyLimit 
        : account.dailyLimit

      // Check daily limit
      if (account.emailsSentToday >= effectiveLimit) {
        return false
      }

      // Check hourly limit
      if (account.emailsSentThisHour >= account.hourlyLimit) {
        return false
      }

      return true
    })

    if (eligibleAccounts.length === 0) {
      // All accounts hit limits - try to find one that can be reset
      const resettableAccount = accounts.find(account => {
        const lastReset = new Date(account.lastResetDate)
        return lastReset < today
      })

      return resettableAccount?.id || null
    }

    // Return best account (highest health score and warmup stage)
    return eligibleAccounts[0].id
  }

  /**
   * Reset account counters if needed
   */
  private async resetAccountCounters(accountId: string): Promise<void> {
    const account = await db.sendingAccount.findUnique({
      where: { id: accountId },
    })

    if (!account) return

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours())

    const updates: any = {}

    // Reset daily counter
    const lastReset = new Date(account.lastResetDate)
    if (lastReset < today) {
      updates.emailsSentToday = 0
      updates.lastResetDate = today
    }

    // Reset hourly counter
    const lastHourReset = new Date(account.lastResetHour)
    if (lastHourReset < thisHour) {
      updates.emailsSentThisHour = 0
      updates.lastResetHour = thisHour
    }

    if (Object.keys(updates).length > 0) {
      await db.sendingAccount.update({
        where: { id: accountId },
        data: updates,
      })
    }
  }

  /**
   * Get fresh access token for OAuth accounts
   */
  private async getFreshAccessToken(
    sendingAccount: any
  ): Promise<string> {
    // Decrypt credentials - handle Prisma JsonValue type
    const credentialsJson = sendingAccount.credentials as Prisma.JsonValue
    const credentials = decrypt(JSON.stringify(credentialsJson))

    if (sendingAccount.provider === "gmail") {
      // Check if token is expired
      const expiresAt = credentials.expiresAt
      if (expiresAt && expiresAt < Date.now() + 5 * 60 * 1000) {
        // Token expired or expiring in 5 minutes
        const newAccessToken = await gmailOAuthImap.refreshAccessToken(
          credentials.refreshToken
        )

        // Update stored credentials
        const updatedCredentials = encrypt({
          ...credentials,
          accessToken: newAccessToken,
          expiresAt: Date.now() + 3600 * 1000, // 1 hour from now
        })

        await db.sendingAccount.update({
          where: { id: sendingAccount.id },
          data: {
            credentials: updatedCredentials as unknown as Prisma.InputJsonValue,
          },
        })

        return newAccessToken
      }

      return credentials.accessToken
    } else if (sendingAccount.provider === "outlook") {
      const expiresAt = credentials.expiresAt
      if (expiresAt && expiresAt < Date.now() + 5 * 60 * 1000) {
        const newAccessToken = await outlookOAuthImap.refreshAccessToken(
          credentials.refreshToken
        )

        const updatedCredentials = encrypt({
          ...credentials,
          accessToken: newAccessToken,
          expiresAt: Date.now() + 3600 * 1000,
        })

        await db.sendingAccount.update({
          where: { id: sendingAccount.id },
          data: {
            credentials: updatedCredentials as unknown as Prisma.InputJsonValue,
          },
        })

        return newAccessToken
      }

      return credentials.accessToken
    }

    throw new Error("Provider does not use OAuth tokens")
  }

  /**
   * Send email using selected account
   */
  async sendEmail(params: SendEmailParams): Promise<SendResult> {
    try {
      // Select best sending account
      const accountId = await this.selectSendingAccount(params.userId)

      if (!accountId) {
        return {
          success: false,
          error: "No available sending accounts. Please connect an email account or wait for limits to reset.",
        }
      }

      // Reset counters if needed
      await this.resetAccountCounters(accountId)

      // Get account details
      const sendingAccount = await db.sendingAccount.findUnique({
        where: { id: accountId },
      })

      if (!sendingAccount) {
        return {
          success: false,
          error: "Sending account not found",
        }
      }

      // Get prospect details
      const prospect = await db.prospect.findUnique({
        where: { id: params.prospectId },
      })

      if (!prospect) {
        return {
          success: false,
          error: "Prospect not found",
        }
      }

      // Create email log
      const emailLog = await db.emailLog.create({
        data: {
          prospectId: params.prospectId,
          subject: params.subject,
          body: params.body,
          fromEmail: sendingAccount.email,
          toEmail: prospect.email,
          status: "SENDING",
          sendingAccountId: accountId,
          provider: sendingAccount.provider,
        },
      })

      // Send email based on provider
      try {
        const credentialsJson = sendingAccount.credentials as Prisma.JsonValue
        const credentials = decrypt(JSON.stringify(credentialsJson))

        if (sendingAccount.provider === "gmail") {
          const accessToken = await this.getFreshAccessToken(sendingAccount)
          await gmailOAuthImap.sendEmail(
            sendingAccount.email,
            accessToken,
            prospect.email,
            params.subject,
            params.body,
            params.html
          )
        } else if (sendingAccount.provider === "outlook") {
          const accessToken = await this.getFreshAccessToken(sendingAccount)
          await outlookOAuthImap.sendEmail(
            sendingAccount.email,
            accessToken,
            prospect.email,
            params.subject,
            params.body,
            params.html
          )
        } else {
          // Custom SMTP
          await customSmtpImap.sendEmail(
            credentials,
            prospect.email,
            params.subject,
            params.body,
            params.html
          )
        }

        // Update email log as sent
        await db.emailLog.update({
          where: { id: emailLog.id },
          data: {
            status: "SENT",
            sentAt: new Date(),
          },
        })

        // Update sending account counters
        await db.sendingAccount.update({
          where: { id: accountId },
          data: {
            emailsSentToday: { increment: 1 },
            emailsSentThisHour: { increment: 1 },
          },
        })

        // Update prospect
        await db.prospect.update({
          where: { id: params.prospectId },
          data: {
            emailsReceived: { increment: 1 },
            lastContactedAt: new Date(),
            status: "CONTACTED",
          },
        })

        // Update user stats
        await db.user.update({
          where: { id: params.userId },
          data: {
            emailsSentThisMonth: { increment: 1 },
          },
        })

        return {
          success: true,
          emailLogId: emailLog.id,
          sendingAccountId: accountId,
        }
      } catch (sendError) {
        // Update email log as failed
        await db.emailLog.update({
          where: { id: emailLog.id },
          data: {
            status: "FAILED",
            errorMessage: sendError instanceof Error ? sendError.message : "Send failed",
          },
        })

        // Decrease account health score
        await db.sendingAccount.update({
          where: { id: accountId },
          data: {
            healthScore: {
              decrement: 5,
            },
          },
        })

        return {
          success: false,
          error: sendError instanceof Error ? sendError.message : "Failed to send email",
        }
      }
    } catch (error) {
      console.error("[Email Sender] Error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected error",
      }
    }
  }

  /**
   * Send batch of emails with intelligent rotation
   */
  async sendBatch(emails: SendEmailParams[]): Promise<SendResult[]> {
    const results: SendResult[] = []

    for (const email of emails) {
      const result = await this.sendEmail(email)
      results.push(result)

      // Add delay between sends (2-5 seconds)
      const delay = 2000 + Math.random() * 3000
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    return results
  }
}

export const emailSender = new EmailSendingService()