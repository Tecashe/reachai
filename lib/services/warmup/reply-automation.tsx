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

    // Sendreply
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
        OR: [
          { isPending: true, sentAt: { lte: cutoffDate } },
          { isPendingPeerReply: true, scheduledAt: { lte: cutoffDate } },
        ],
      },
    })

    logger.info('Stale pending replies cleaned up', { deleted: result.count })
    return result.count
  }

  // ============================================
  // PEER-TO-PEER WARMUP REPLY METHODS
  // ============================================

  /**
   * Schedule a peer reply for true peer-to-peer warmup
   * When Account A sends to Account B, this schedules Account B to reply back
   */
  async schedulePeerReply(
    sessionId: string,
    senderAccountId: string,     // Account A (who sent the original)
    recipientAccountId: string,  // Account B (who should reply)
    threadContext: {
      threadId: string
      originalMessageId: string
      originalSubject: string
      senderEmail: string        // Account A's email (for To: header)
    }
  ): Promise<void> {
    try {
      const delayMinutes = this.calculateReplyDelay()
      const scheduledAt = new Date(Date.now() + delayMinutes * 60 * 1000)
      const replyWarmupId = `peer-reply-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

      // Generate reply subject
      const replySubject = threadContext.originalSubject.startsWith('Re:')
        ? threadContext.originalSubject
        : `Re: ${threadContext.originalSubject}`

      // Create pending peer reply interaction
      await prisma.warmupInteraction.create({
        data: {
          sessionId,
          sendingAccountId: recipientAccountId, // Account B will be the sender
          direction: 'OUTBOUND',                // Outbound from B to A
          subject: replySubject,
          snippet: 'Pending peer reply...',
          warmupId: replyWarmupId,
          threadId: threadContext.threadId,
          inReplyTo: threadContext.originalMessageId,
          references: threadContext.originalMessageId,
          // Peer reply tracking fields
          isPendingPeerReply: true,
          replyFromAccountId: recipientAccountId,
          scheduledAt,
          originalSenderEmail: threadContext.senderEmail,
        },
      })

      // Update thread message count and next scheduled time
      if (threadContext.threadId) {
        await prisma.warmupThread.update({
          where: { id: threadContext.threadId },
          data: {
            messageCount: { increment: 1 },
            lastSenderId: senderAccountId,
            nextScheduledAt: scheduledAt,
          },
        }).catch(() => {
          // Thread may not exist yet, that's OK
        })
      }

      logger.info('Peer reply scheduled', {
        warmupId: replyWarmupId,
        from: recipientAccountId,
        to: threadContext.senderEmail,
        delayMinutes,
        scheduledAt,
        threadId: threadContext.threadId,
      })
    } catch (error) {
      logger.error('Failed to schedule peer reply', error as Error, {
        senderAccountId,
        recipientAccountId,
      })
    }
  }

  /**
   * Process pending peer replies (called by Inngest cron job)
   * Uses the peer account's own SMTP credentials to send replies
   */
  async processPendingPeerReplies(batchSize = 100): Promise<{
    processed: number
    succeeded: number
    failed: number
  }> {
    const pendingPeerReplies = await prisma.warmupInteraction.findMany({
      where: {
        isPendingPeerReply: true,
        scheduledAt: { lte: new Date() },
      },
      include: {
        replyFromAccount: true,  // Account B's SMTP credentials
        thread: true,
      },
      take: batchSize,
      orderBy: { scheduledAt: 'asc' },
    })

    logger.info('Processing pending peer replies', { count: pendingPeerReplies.length })

    let succeeded = 0
    let failed = 0

    for (const reply of pendingPeerReplies) {
      try {
        await this.sendPeerReply(reply)
        succeeded++
      } catch (error) {
        logger.error('Failed to send peer reply', error as Error, {
          replyId: reply.id,
          accountId: reply.replyFromAccountId,
        })
        failed++
      }
    }

    logger.info('Pending peer replies processed', {
      total: pendingPeerReplies.length,
      succeeded,
      failed,
    })

    return {
      processed: pendingPeerReplies.length,
      succeeded,
      failed,
    }
  }

  /**
   * Send a peer reply using the peer account's SMTP credentials
   */
  private async sendPeerReply(reply: any): Promise<void> {
    const account = reply.replyFromAccount

    if (!account) {
      throw new Error('Peer account not found for reply')
    }

    if (!reply.originalSenderEmail) {
      throw new Error('Original sender email not found')
    }

    // Get SMTP credentials from the peer account
    let password: string | null = null
    let smtpConfig: { host: string; port: number; secure: boolean; user: string } | null = null

    // Try OAuth first, then SMTP password
    if (account.oauthAccessToken) {
      // For OAuth accounts (Gmail, Outlook), use OAuth2 transport
      // This is simplified - in production you'd refresh the token if expired
      password = account.oauthAccessToken
      smtpConfig = {
        host: account.provider === 'gmail' ? 'smtp.gmail.com' : 'smtp.office365.com',
        port: 587,
        secure: false,
        user: account.email,
      }
    } else if (account.smtpPassword) {
      password = decryptPassword(account.smtpPassword)
      smtpConfig = {
        host: account.smtpHost || 'smtp.gmail.com',
        port: account.smtpPort || 587,
        secure: account.smtpPort === 465,
        user: account.smtpUsername || account.email,
      }
    } else {
      throw new Error('No SMTP credentials available for peer account')
    }

    // Generate reply content
    const replyContent = await warmupEmailGenerator.generateReply(
      reply.subject,
      'Previous message in thread',
      {
        senderName: account.name || account.email.split('@')[0],
        recipientName: reply.originalSenderEmail.split('@')[0],
        warmupStage: account.warmupStage || 'WARM',
      }
    )

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: account.oauthAccessToken
        ? {
          type: 'OAuth2',
          user: smtpConfig.user,
          accessToken: password,
        }
        : {
          user: smtpConfig.user,
          pass: password,
        },
    } as any)

    // Send the reply
    const info = await transporter.sendMail({
      from: `${account.name || account.email.split('@')[0]} <${account.email}>`,
      to: reply.originalSenderEmail,
      subject: replyContent.subject,
      text: replyContent.body,
      html: `<p>${replyContent.body.replace(/\n/g, '<br>')}</p>`,
      headers: {
        'In-Reply-To': reply.inReplyTo,
        'References': reply.references,
        'X-Warmup-ID': reply.warmupId,
        'X-Warmup-Thread': reply.threadId,
        'X-Warmup-Type': 'peer-reply',
      },
    })

    // Mark interaction as sent
    await prisma.warmupInteraction.update({
      where: { id: reply.id },
      data: {
        isPendingPeerReply: false,
        deliveredAt: new Date(),
        sentAt: new Date(),
        messageId: info.messageId,
        snippet: replyContent.body.slice(0, 100),
        subject: replyContent.subject,
      },
    })

    // Update account stats
    await prisma.sendingAccount.update({
      where: { id: account.id },
      data: {
        emailsSentToday: { increment: 1 },
        lastWarmupAt: new Date(),
      },
    })

    // Update warmup session stats
    await prisma.warmupSession.update({
      where: { id: reply.sessionId },
      data: {
        emailsReplied: { increment: 1 },
        lastSentAt: new Date(),
      },
    })

    // Check if thread should continue (schedule next reply from original sender)
    if (reply.thread && reply.thread.messageCount < reply.thread.maxMessages) {
      // Schedule the original sender (Account A) to reply back
      const shouldContinue = this.shouldReply({ replyRate: 60 }) // 60% chance to continue thread

      if (shouldContinue) {
        await this.schedulePeerReply(
          reply.sessionId,
          account.id,                    // Now Account B is the sender
          reply.thread.initiatorAccountId === account.id
            ? reply.thread.recipientAccountId
            : reply.thread.initiatorAccountId, // Account A becomes recipient
          {
            threadId: reply.threadId,
            originalMessageId: info.messageId,
            originalSubject: replyContent.subject,
            senderEmail: account.email,
          }
        )
      } else {
        // Complete the thread
        await prisma.warmupThread.update({
          where: { id: reply.threadId },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
          },
        })
      }
    }

    logger.info('Peer reply sent successfully', {
      replyId: reply.id,
      from: account.email,
      to: reply.originalSenderEmail,
      messageId: info.messageId,
      threadId: reply.threadId,
    })
  }
}

export const replyAutomation = new ReplyAutomation()