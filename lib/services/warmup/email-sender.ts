
import nodemailer from 'nodemailer'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { decryptPassword } from '@/lib/encryption'
import { warmupEmailGenerator } from '@/lib/services/warmup-email-generator'
import crypto from 'crypto'
import type { SendingAccount, WarmupEmail } from '@prisma/client'

interface SendResult {
  success: boolean
  messageId?: string
  warmupId?: string
  threadId?: string
  error?: string
}

interface SendingAccountWithRelations extends SendingAccount {
  user?: {
    subscriptionTier: string
  } | null
}

export class EmailSender {
  /**
   * Send a warmup email
   */
  async sendWarmupEmail(
    sessionId: string,
    sendingAccount: SendingAccountWithRelations,
    recipientEmail: string,
    recipientName?: string
  ): Promise<SendResult> {
    try {
      // Generate unique IDs
      const warmupId = this.generateWarmupId(sendingAccount.id)
      const threadId = this.generateThreadId()

      // Generate AI-powered email content
      const senderName = sendingAccount.name || sendingAccount.email.split('@')[0]
      const emailContent = await warmupEmailGenerator.generateWarmupEmail(
        senderName,
        recipientName || recipientEmail.split('@')[0],
        'general', // You can add industry field to SendingAccount if needed
        sendingAccount.warmupStage
      )

      // Create SMTP transporter
      const transporter = await this.createTransporter(sendingAccount)

      // Send email
      const info = await transporter.sendMail({
        from: `${senderName} <${sendingAccount.email}>`,
        to: recipientEmail,
        subject: emailContent.subject,
        text: emailContent.body,
        html: this.convertToHtml(emailContent.body),
        headers: {
          'X-Warmup-ID': warmupId,
          'X-Warmup-Session': sessionId,
          'X-Warmup-Thread': threadId,
          'Message-ID': `<${warmupId}@${sendingAccount.email.split('@')[1]}>`,
        },
      })

      // Record interaction
      await this.recordInteraction(sessionId, sendingAccount.id, {
        direction: 'OUTBOUND',
        subject: emailContent.subject,
        snippet: emailContent.body.slice(0, 100),
        messageId: info.messageId,
        warmupId,
        threadId,
        recipientEmail,
      })

      logger.info('Warmup email sent successfully', {
        accountId: sendingAccount.id,
        recipient: recipientEmail,
        messageId: info.messageId,
        warmupId,
      })

      return {
        success: true,
        messageId: info.messageId,
        warmupId,
        threadId,
      }
    } catch (error) {
      logger.error('Failed to send warmup email', error as Error, {
        accountId: sendingAccount.id,
        recipient: recipientEmail,
      })

      return {
        success: false,
        error: (error as Error).message,
      }
    }
  }

  /**
   * Create SMTP transporter from account credentials
   */
  private async createTransporter(
    account: SendingAccountWithRelations
  ): Promise<nodemailer.Transporter> {
    // Try to get password from different possible locations
    let password: string

    if (account.smtpPassword) {
      password = decryptPassword(account.smtpPassword)
    } else if (account.imapPassword) {
      password = decryptPassword(account.imapPassword)
    } else {
      // Try credentials object
      const credentials =
        typeof account.credentials === 'string'
          ? JSON.parse(account.credentials)
          : account.credentials

      if (credentials.smtpPassword) {
        password = decryptPassword(credentials.smtpPassword)
      } else if (credentials.password) {
        password = decryptPassword(credentials.password)
      } else if (credentials.apiKey) {
        password = credentials.apiKey // API keys might not be encrypted
      } else {
        throw new Error('No password found in account credentials')
      }
    }

    // Determine SMTP configuration
    const config = {
      host: account.smtpHost || 'smtp.gmail.com',
      port: account.smtpPort || 587,
      secure: account.smtpSecure || (account.smtpPort === 465),
      auth: {
        user: account.smtpUsername || account.email,
        pass: password,
      },
    }

    return nodemailer.createTransport(config)
  }

  /**
   * Record warmup interaction
   */
  private async recordInteraction(
    sessionId: string,
    accountId: string,
    data: {
      direction: 'OUTBOUND' | 'INBOUND'
      subject: string
      snippet: string
      messageId: string
      warmupId: string
      threadId: string
      recipientEmail: string
    }
  ): Promise<void> {
    try {
      await prisma.warmupInteraction.create({
        data: {
          sessionId,
          sendingAccountId: accountId,
          direction: data.direction,
          subject: data.subject,
          snippet: data.snippet,
          messageId: data.messageId,
          warmupId: data.warmupId,
          threadId: data.threadId,
          sentAt: new Date(),
          deliveredAt: new Date(),
          landedInInbox: true,
          landedInSpam: false,
        },
      })
    } catch (error) {
      logger.error('Failed to record interaction', error as Error, {
        sessionId,
        accountId,
      })
    }
  }

  /**
   * Generate unique warmup ID
   */
  private generateWarmupId(accountId: string): string {
    const timestamp = Date.now()
    const random = crypto.randomBytes(4).toString('hex')
    return `warmup-${accountId}-${timestamp}-${random}`
  }

  /**
   * Generate thread ID
   */
  private generateThreadId(): string {
    return `thread-${crypto.randomBytes(8).toString('hex')}`
  }

  /**
   * Convert plain text to HTML
   */
  private convertToHtml(text: string): string {
    return text
      .split('\n')
      .map((line) => `<p>${line}</p>`)
      .join('')
  }

  /**
   * Validate email before sending
   */
  async validateBeforeSend(
    accountId: string,
    recipientEmail: string
  ): Promise<{ valid: boolean; reason?: string }> {
    // Check account health
    const account = await prisma.sendingAccount.findUnique({
      where: { id: accountId },
      select: {
        isActive: true,
        pausedAt: true,
        healthScore: true,
        emailsSentToday: true,
        warmupDailyLimit: true,
      },
    })

    if (!account) {
      return { valid: false, reason: 'Account not found' }
    }

    if (!account.isActive || account.pausedAt) {
      return { valid: false, reason: 'Account is paused' }
    }

    if (account.healthScore < 50) {
      return { valid: false, reason: 'Account health too low' }
    }

    if (account.emailsSentToday >= account.warmupDailyLimit) {
      return { valid: false, reason: 'Daily limit reached' }
    }

    // Basic email validation
    if (!this.isValidEmail(recipientEmail)) {
      return { valid: false, reason: 'Invalid recipient email' }
    }

    return { valid: true }
  }

  /**
   * Basic email validation
   */
  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }
}

export const emailSender = new EmailSender()