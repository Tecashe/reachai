import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import type { SendingAccount, WarmupSession } from '@prisma/client'

interface SessionConfig {
  warmupType: 'POOL' | 'PEER'
  dailyLimit: number
  peerAccountEmail?: string
}

export class SessionManager {
  /**
   * Get or create active session for an account
   */
  async getOrCreateSession(
    account: SendingAccount,
    config: SessionConfig
  ): Promise<WarmupSession> {
    // Check for existing active session
    const existing = await prisma.warmupSession.findFirst({
      where: {
        sendingAccountId: account.id,
        status: 'ACTIVE',
        warmupType: config.warmupType,
      },
      orderBy: { startedAt: 'desc' },
    })

    if (existing) {
      logger.debug('Using existing warmup session', {
        sessionId: existing.id,
        accountId: account.id,
      })
      return existing
    }

    // Create new session
    const warmupEmailId = config.warmupType === 'POOL' 
      ? await this.getPoolEmailId() 
      : null

    const session = await prisma.warmupSession.create({
      data: {
        sendingAccountId: account.id,
        warmupEmailId,
        warmupType: config.warmupType,
        peerAccountEmail: config.peerAccountEmail,
        status: 'ACTIVE',
        dailyLimit: config.dailyLimit,
        nextScheduledSend: this.calculateNextSendTime(),
      },
    })

    logger.info('Created new warmup session', {
      sessionId: session.id,
      accountId: account.id,
      warmupType: config.warmupType,
    })

    return session
  }

  /**
   * Update session metrics after sending
   */
  async updateSessionMetrics(
    sessionId: string,
    updates: {
      emailsSent?: number
      emailsOpened?: number
      emailsReceived?: number
      emailsReplied?: number
    }
  ): Promise<void> {
    try {
      await prisma.warmupSession.update({
        where: { id: sessionId },
        data: {
          emailsSent: { increment: updates.emailsSent || 0 },
          emailsOpened: { increment: updates.emailsOpened || 0 },
          emailsReceived: { increment: updates.emailsReceived || 0 },
          emailsReplied: { increment: updates.emailsReplied || 0 },
          lastSentAt: new Date(),
          nextScheduledSend: this.calculateNextSendTime(),
        },
      })

      logger.debug('Session metrics updated', { sessionId, updates })
    } catch (error) {
      logger.error('Failed to update session metrics', error as Error, {
        sessionId,
      })
    }
  }

  /**
   * Calculate inbox placement rate for a session
   */
  async calculateInboxPlacement(sessionId: string): Promise<number> {
    const interactions = await prisma.warmupInteraction.findMany({
      where: {
        sessionId,
        direction: 'OUTBOUND',
        deliveredAt: { not: null },
      },
      select: {
        landedInInbox: true,
        landedInSpam: true,
      },
    })

    if (interactions.length === 0) return 100

    const inboxCount = interactions.filter((i) => i.landedInInbox).length
    const rate = (inboxCount / interactions.length) * 100

    // Update session
    await prisma.warmupSession.update({
      where: { id: sessionId },
      data: { inboxPlacementRate: rate },
    })

    return rate
  }

  /**
   * Complete a session
   */
  async completeSession(
    sessionId: string,
    reason: string = 'Completed successfully'
  ): Promise<void> {
    await prisma.warmupSession.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        endedAt: new Date(),
      },
    })

    logger.info('Session completed', { sessionId, reason })
  }

  /**
   * Pause a session
   */
  async pauseSession(
    sessionId: string,
    reason: string = 'Paused by system'
  ): Promise<void> {
    await prisma.warmupSession.update({
      where: { id: sessionId },
      data: {
        status: 'PAUSED',
      },
    })

    logger.info('Session paused', { sessionId, reason })
  }

  /**
   * Get sessions due for sending
   */
  async getDueSessions(limit = 100): Promise<WarmupSession[]> {
    return await prisma.warmupSession.findMany({
      where: {
        status: 'ACTIVE',
        nextScheduledSend: {
          lte: new Date(),
        },
      },
      include: {
        sendingAccount: {
          select: {
            id: true,
            email: true,
            emailsSentToday: true,
            warmupDailyLimit: true,
          },
        },
      },
      take: limit,
      orderBy: { nextScheduledSend: 'asc' },
    })
  }

  /**
   * Calculate next send time (random within business hours)
   */
  private calculateNextSendTime(): Date {
    const now = new Date()
    const delayMinutes = Math.floor(Math.random() * 60) + 30 // 30-90 minutes
    return new Date(now.getTime() + delayMinutes * 60 * 1000)
  }

  /**
   * Get a pool email ID (rotating selection)
   */
  private async getPoolEmailId(): Promise<string | null> {
    const poolEmails = await prisma.warmupEmail.findMany({
      where: {
        isActive: true,
        cooldownUntil: {
          lte: new Date(),
        },
      },
      orderBy: {
        lastEmailSentAt: 'asc', // Use least recently used
      },
      take: 1,
    })

    return poolEmails[0]?.id || null
  }

  /**
   * Clean up old sessions
   */
  async cleanupOldSessions(daysOld = 30): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const result = await prisma.warmupSession.deleteMany({
      where: {
        status: { in: ['COMPLETED', 'FAILED'] },
        endedAt: {
          lte: cutoffDate,
        },
      },
    })

    logger.info('Old sessions cleaned up', { deleted: result.count })
    return result.count
  }
}

export const sessionManager = new SessionManager()