import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { redis, REDIS_KEYS } from '@/lib/redis'

interface HealthMetrics {
  healthScore: number
  bounceRate: number
  spamComplaintRate: number
  replyRate: number
  openRate: number
  inboxPlacementRate: number
}

interface HealthCheckResult {
  accountId: string
  previousScore: number
  currentScore: number
  metrics: HealthMetrics
  action: 'continue' | 'pause' | 'alert'
  reason?: string
}

export class HealthMonitor {
  private readonly HEALTH_THRESHOLDS = {
    CRITICAL: 40,
    WARNING: 60,
    GOOD: 80,
  }

  private readonly BOUNCE_RATE_LIMITS = {
    CRITICAL: 10, // 10%
    WARNING: 5, // 5%
  }

  private readonly SPAM_RATE_LIMITS = {
    CRITICAL: 0.5, // 0.5%
    WARNING: 0.2, // 0.2%
  }

  /**
   * Perform comprehensive health check for an account
   */
  async checkAccountHealth(accountId: string): Promise<HealthCheckResult> {
    const account = await prisma.sendingAccount.findUnique({
      where: { id: accountId },
      select: {
        id: true,
        email: true,
        healthScore: true,
        bounceRate: true,
        spamComplaintRate: true,
        replyRate: true,
        openRate: true,
        warmupStage: true,
      },
    })

    if (!account) {
      throw new Error(`Account ${accountId} not found`)
    }

    const previousScore = account.healthScore

    // Calculate current metrics
    const metrics = await this.calculateMetrics(accountId)

    // Calculate new health score
    const currentScore = this.calculateHealthScore(metrics)

    // Determine action
    const action = this.determineAction(currentScore, metrics)

    // Update account
    await this.updateAccountHealth(accountId, currentScore, metrics)

    // Cache health check
    await this.cacheHealthCheck(accountId, {
      score: currentScore,
      timestamp: Date.now(),
    })

    logger.info('Health check completed', {
      accountId,
      previousScore,
      currentScore,
      action,
    })

    return {
      accountId,
      previousScore,
      currentScore,
      metrics,
      action,
      reason: action === 'pause' ? this.getPauseReason(metrics) : undefined,
    }
  }

  /**
   * Calculate health metrics for an account
   */
  private async calculateMetrics(accountId: string): Promise<HealthMetrics> {
    // Get recent interactions (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const interactions = await prisma.warmupInteraction.findMany({
      where: {
        sendingAccountId: accountId,
        createdAt: { gte: sevenDaysAgo },
      },
      select: {
        direction: true,
        deliveredAt: true,
        openedAt: true,
        repliedAt: true,
        landedInInbox: true,
        landedInSpam: true,
      },
    })

    const outbound = interactions.filter((i) => i.direction === 'OUTBOUND')
    const total = outbound.length

    if (total === 0) {
      return {
        healthScore: 100,
        bounceRate: 0,
        spamComplaintRate: 0,
        replyRate: 0,
        openRate: 0,
        inboxPlacementRate: 100,
      }
    }

    // Calculate rates
    const delivered = outbound.filter((i) => i.deliveredAt).length
    const opened = outbound.filter((i) => i.openedAt).length
    const replied = outbound.filter((i) => i.repliedAt).length
    const inbox = outbound.filter((i) => i.landedInInbox).length
    const spam = outbound.filter((i) => i.landedInSpam).length

    // Get bounce data
    const bounces = await prisma.emailBounce.findMany({
      where: {
        sendingAccountId: accountId,
        bouncedAt: { gte: sevenDaysAgo },
      },
    })

    const hardBounces = bounces.filter((b) => b.bounceType === 'HARD').length
    const spamComplaints = bounces.filter((b) => b.bounceType === 'COMPLAINT')
      .length

    return {
      healthScore: 0, // Will be calculated
      bounceRate: total > 0 ? (hardBounces / total) * 100 : 0,
      spamComplaintRate: total > 0 ? (spamComplaints / total) * 100 : 0,
      replyRate: delivered > 0 ? (replied / delivered) * 100 : 0,
      openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
      inboxPlacementRate:
        delivered > 0 ? (inbox / (inbox + spam)) * 100 : 100,
    }
  }

  /**
   * Calculate overall health score (0-100)
   */
  private calculateHealthScore(metrics: HealthMetrics): number {
    let score = 100

    // Penalize bounces (heavy penalty)
    score -= metrics.bounceRate * 5 // 10% bounce = -50 points

    // Penalize spam complaints (critical penalty)
    score -= metrics.spamComplaintRate * 20 // 0.5% spam = -10 points

    // Reward inbox placement
    score += (metrics.inboxPlacementRate - 80) * 0.5 // Bonus above 80%

    // Reward engagement
    score += metrics.openRate * 0.1 // Small bonus
    score += metrics.replyRate * 0.2 // Bigger bonus

    // Clamp between 0-100
    return Math.max(0, Math.min(100, Math.round(score)))
  }

  /**
   * Determine action based on health metrics
   */
  private determineAction(
    score: number,
    metrics: HealthMetrics
  ): 'continue' | 'pause' | 'alert' {
    // Critical conditions - immediate pause
    if (
      score < this.HEALTH_THRESHOLDS.CRITICAL ||
      metrics.bounceRate > this.BOUNCE_RATE_LIMITS.CRITICAL ||
      metrics.spamComplaintRate > this.SPAM_RATE_LIMITS.CRITICAL
    ) {
      return 'pause'
    }

    // Warning conditions - alert but continue
    if (
      score < this.HEALTH_THRESHOLDS.WARNING ||
      metrics.bounceRate > this.BOUNCE_RATE_LIMITS.WARNING ||
      metrics.spamComplaintRate > this.SPAM_RATE_LIMITS.WARNING
    ) {
      return 'alert'
    }

    return 'continue'
  }

  /**
   * Get reason for pausing account
   */
  private getPauseReason(metrics: HealthMetrics): string {
    const reasons: string[] = []

    if (metrics.bounceRate > this.BOUNCE_RATE_LIMITS.CRITICAL) {
      reasons.push(`High bounce rate: ${metrics.bounceRate.toFixed(1)}%`)
    }

    if (metrics.spamComplaintRate > this.SPAM_RATE_LIMITS.CRITICAL) {
      reasons.push(
        `High spam complaint rate: ${metrics.spamComplaintRate.toFixed(2)}%`
      )
    }

    if (metrics.inboxPlacementRate < 50) {
      reasons.push(
        `Low inbox placement: ${metrics.inboxPlacementRate.toFixed(1)}%`
      )
    }

    return reasons.join('; ') || 'Multiple health issues detected'
  }

  /**
   * Update account health in database
   */
  private async updateAccountHealth(
    accountId: string,
    healthScore: number,
    metrics: HealthMetrics
  ): Promise<void> {
    await prisma.sendingAccount.update({
      where: { id: accountId },
      data: {
        healthScore,
        bounceRate: metrics.bounceRate,
        spamComplaintRate: metrics.spamComplaintRate,
        replyRate: metrics.replyRate,
        openRate: metrics.openRate,
        lastHealthCheck: new Date(),
      },
    })
  }

  /**
   * Cache health check result
   */
  private async cacheHealthCheck(
    accountId: string,
    data: { score: number; timestamp: number }
  ): Promise<void> {
    const key = `${REDIS_KEYS.HEALTH_CHECK}${accountId}`

    try {
      await redis.setex(key, 3600, JSON.stringify(data)) // 1 hour cache
    } catch (error) {
      logger.error('Failed to cache health check', error as Error, {
        accountId,
      })
    }
  }

  /**
   * Get cached health check
   */
  async getCachedHealthCheck(
    accountId: string
  ): Promise<{ score: number; timestamp: number } | null> {
    const key = `${REDIS_KEYS.HEALTH_CHECK}${accountId}`

    try {
      const cached = await redis.get(key)
      if (cached && typeof cached === 'string') {
        return JSON.parse(cached)
      }
    } catch (error) {
      logger.error('Failed to get cached health check', error as Error, {
        accountId,
      })
    }

    return null
  }

  /**
   * Batch health check for multiple accounts
   */
  async batchHealthCheck(accountIds: string[]): Promise<HealthCheckResult[]> {
    logger.info('Starting batch health check', { count: accountIds.length })

    const results = await Promise.allSettled(
      accountIds.map((id) => this.checkAccountHealth(id))
    )

    const successful = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => (r as PromiseFulfilledResult<HealthCheckResult>).value)

    const failed = results.filter((r) => r.status === 'rejected').length

    logger.info('Batch health check completed', {
      total: accountIds.length,
      successful: successful.length,
      failed,
    })

    return successful
  }

  /**
   * Auto-pause unhealthy accounts
   */
  async autoPauseUnhealthyAccounts(): Promise<{
    checked: number
    paused: number
  }> {
    const accounts = await prisma.sendingAccount.findMany({
      where: {
        isActive: true,
        warmupEnabled: true,
        pausedAt: null,
      },
      select: { id: true },
    })

    logger.info('Checking accounts for auto-pause', { count: accounts.length })

    let paused = 0

    for (const account of accounts) {
      try {
        const result = await this.checkAccountHealth(account.id)

        if (result.action === 'pause') {
          await prisma.sendingAccount.update({
            where: { id: account.id },
            data: {
              isActive: false,
              pausedAt: new Date(),
              pausedReason: result.reason,
            },
          })

          paused++

          logger.warn('Account auto-paused', {
            accountId: account.id,
            reason: result.reason,
          })
        }
      } catch (error) {
        logger.error('Failed to check account', error as Error, {
          accountId: account.id,
        })
      }
    }

    logger.info('Auto-pause check completed', {
      checked: accounts.length,
      paused,
    })

    return { checked: accounts.length, paused }
  }

  /**
   * Get health statistics for all accounts
   */
  async getHealthStatistics(): Promise<{
    total: number
    healthy: number
    warning: number
    critical: number
    paused: number
    avgScore: number
  }> {
    const accounts = await prisma.sendingAccount.findMany({
      where: {
        warmupEnabled: true,
      },
      select: {
        healthScore: true,
        isActive: true,
        pausedAt: true,
      },
    })

    const total = accounts.length
    const paused = accounts.filter((a) => a.pausedAt !== null).length
    const active = accounts.filter((a) => a.isActive && !a.pausedAt)

    const healthy = active.filter(
      (a) => a.healthScore >= this.HEALTH_THRESHOLDS.GOOD
    ).length
    const warning = active.filter(
      (a) =>
        a.healthScore >= this.HEALTH_THRESHOLDS.WARNING &&
        a.healthScore < this.HEALTH_THRESHOLDS.GOOD
    ).length
    const critical = active.filter(
      (a) => a.healthScore < this.HEALTH_THRESHOLDS.WARNING
    ).length

    const avgScore =
      active.reduce((sum, a) => sum + a.healthScore, 0) / (active.length || 1)

    return {
      total,
      healthy,
      warning,
      critical,
      paused,
      avgScore: Math.round(avgScore),
    }
  }
}

export const healthMonitor = new HealthMonitor()