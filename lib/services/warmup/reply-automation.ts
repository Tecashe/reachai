import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { warmupEmailGenerator } from '@/lib/services/warmup-email-generator'
import { emailSender } from './email-sender'
import nodemailer from 'nodemailer'
import { decryptPassword } from '@/lib/encryption'

interface ReplyConfig {
  replyRate: number // Percentage (0-100)
  minDelayMinutes: number
  maxDelayMinutes: number
  maxConsecutiveReplies: number
}

export class ReplyAutomation {
  private readonly DEFAULT_CONFIG: ReplyConfig = {
    replyRate: 45, // 45% reply rate
    minDelayMinutes: 15,
    maxDelayMinutes: 1440, // 24 hours
    maxConsecutiveReplies: 3,
  }

  /**
   * Determine if we should reply to an email
   */
  shouldReply(config: Partial<ReplyConfig> = {}): boolean {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config }
    const random = Math.random() * 100
    return random <= finalConfig.replyRate
  }

  /**
   * Calculate realistic reply delay
   */
  calculateReplyDelay(config: Partial<ReplyConfig> = {}): number {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config }
    
    // Weighted random: favor shorter delays but allow long ones
    const weights = [
      { max: 60, weight: 0.4 },    // 40% within 1 hour
      { max: 240, weight: 0.3 },   // 30% within 4 hours
      { max: 480, weight: 0.2 },   // 20% within 8 hours
      { max: 1440, weight: 0.1 },  // 10% within 24 hours
    ]

    const random = Math.random()
    let cumulative = 0

    for (const { max, weight } of weights) {
      cumulative += weight
      if (random <= cumulative) {
        return Math.floor(
          Math.random() * (max - finalConfig.minDelayMinutes) +
            finalConfig.minDelayMinutes
        )
      }
    }

    return finalConfig.maxDelayMinutes
  }

  /**
   * Schedule a reply for a warmup email
   */
  async scheduleReply(
    sessionId: string,
    originalEmail: {
      subject: string
      body: string
      from: string
      warmupId: string
      threadId: string
      messageId: string
    },
    warmupEmail: any
  ): Promise<void> {
    try {
      const delayMinutes = this.calculateReplyDelay()
      const replyBody = await warmupEmailGenerator.generateReply(
        originalEmail.subject,
        originalEmail.body,
        {
          senderName: warmupEmail.name || warmupEmail.email.split('@')[0],
          recipientName: originalEmail.from.split('@')[0],
          warmupStage: 'WARM',
        }
      )

      const replyWarmupId = `${originalEmail.warmupId}-reply-${Date.now()}`
      const scheduledAt = new Date(Date.now() + delayMinutes * 60 * 1000)

      // Create pending interaction
      await prisma.warmupInteraction.create({
        data: {
          sessionId,
          sendingAccountId: originalEmail.from,
          warmupEmailId: warmupEmail.id,
          direction: 'INBOUND',
          subject: replyBody.subject,
          snippet: replyBody.body.slice(0, 100),
          sentAt: scheduledAt,
          warmupId: replyWarmupId,
          threadId: originalEmail.threadId,
          inReplyTo: originalEmail.messageId,
          references: originalEmail.messageId,
          landedInInbox: true,
          landedInSpam: false,
          isPending: true,
        },
      })

      logger.info('Reply scheduled', {
        warmupId: replyWarmupId,
        delayMinutes,
        scheduledAt,
      })
    } catch (error) {
      logger.error('Failed to schedule reply', error as Error, {
        originalWarmupId: originalEmail.warmupId,
      })
    }
  }

  /**
   * Process pending replies (called by cron)
   */
  async processPendingReplies(batchSize = 100): Promise<{
    processed: number
    succeeded: number
    failed: number
  }> {
    const pendingReplies = await prisma.warmupInteraction.findMany({
      where: {
        direction: 'INBOUND',
        isPending: true,
        sentAt: { lte: new Date() },
      },
      include: {
        session: {
          include: {
            sendingAccount: true,
            warmupEmail: true,
          },
        },
      },
      take: batchSize,
      orderBy: { sentAt: 'asc' },
    })

    logger.info('Processing pending replies', { count: pendingReplies.length })

    let succeeded = 0
    let failed = 0

    const results = await Promise.allSettled(
      pendingReplies.map(async (reply) => {
        try {
          await this.sendReply(reply)
          succeeded++
        } catch (error) {
          logger.error('Failed to send reply', error as Error, {
            replyId: reply.id,
          })
          failed++
        }
      })
    )

    logger.info('Pending replies processed', {
      total: pendingReplies.length,
      succeeded,
      failed,
    })

    return {
      processed: pendingReplies.length,
      succeeded,
      failed,
    }
  }

  /**
   * Send a scheduled reply
   */
  private async sendReply(reply: any): Promise<void> {
    const { session } = reply
    
    if (!session.warmupEmail || !session.sendingAccount) {
      throw new Error('Missing warmup email or sending account')
    }

    const warmupEmail = session.warmupEmail
    const sendingAccount = session.sendingAccount

    // Decrypt warmup email password
    const password = decryptPassword(
      warmupEmail.smtpPassword || warmupEmail.imapPassword
    )

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: warmupEmail.smtpHost || 'smtp.gmail.com',
      port: warmupEmail.smtpPort || 587,
      secure: warmupEmail.smtpPort === 465,
      auth: {
        user: warmupEmail.smtpUsername || warmupEmail.email,
        pass: password,
      },
    })

    // Send reply
    const info = await transporter.sendMail({
      from: `${warmupEmail.name} <${warmupEmail.email}>`,
      to: sendingAccount.email,
      subject: reply.subject,
      text: reply.snippet || '',
      html: `<p>${reply.snippet || ''}</p>`,
      headers: {
        'In-Reply-To': reply.inReplyTo,
        References: reply.references,
        'X-Warmup-ID': reply.warmupId,
        'X-Warmup-Thread': reply.threadId,
      },
    })

    // Mark as sent
    await prisma.warmupInteraction.update({
      where: { id: reply.id },
      data: {
        isPending: false,
        deliveredAt: new Date(),
        messageId: info.messageId,
      },
    })

    // Update session stats
    await prisma.warmupSession.update({
      where: { id: reply.sessionId },
      data: {
        emailsReplied: { increment: 1 },
      },
    })

    logger.info('Reply sent successfully', {
      replyId: reply.id,
      warmupId: reply.warmupId,
      messageId: info.messageId,
    })
  }

  /**
   * Generate natural conversation flow
   */
  async generateConversationThread(
    initialSubject: string,
    participantA: string,
    participantB: string,
    threadLength = 3
  ): Promise<Array<{ from: string; subject: string; body: string }>> {
    const thread: Array<{ from: string; subject: string; body: string }> = []

    let currentSubject = initialSubject
    let previousBody = ''

    for (let i = 0; i < threadLength; i++) {
      const sender = i % 2 === 0 ? participantA : participantB
      const recipient = i % 2 === 0 ? participantB : participantA

      const content = await warmupEmailGenerator.generateReply(
        currentSubject,
        previousBody,
        {
          senderName: sender,
          recipientName: recipient,
          warmupStage: 'WARM',
        }
      )

      thread.push({
        from: sender,
        subject: content.subject,
        body: content.body,
      })

      currentSubject = content.subject
      previousBody = content.body
    }

    return thread
  }

  /**
   * Clean up old pending replies
   */
  async cleanupStalePendingReplies(hoursOld = 48): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setHours(cutoffDate.getHours() - hoursOld)

    const result = await prisma.warmupInteraction.deleteMany({
      where: {
        isPending: true,
        sentAt: { lte: cutoffDate },
      },
    })

    logger.info('Stale pending replies cleaned up', { deleted: result.count })
    return result.count
  }
}

export const replyAutomation = new ReplyAutomation()