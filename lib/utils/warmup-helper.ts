import { WarmupStage } from '@prisma/client'

/**
 * Get warmup configuration for a stage
 */
export function getWarmupStageConfig(stage: WarmupStage) {
  const config = {
    NEW: {
      duration: 7,
      dailyLimit: 20,
      nextStage: 'WARMING' as WarmupStage,
      warmupType: 'POOL' as const,
      description: 'New account - building initial reputation',
    },
    WARMING: {
      duration: 7,
      dailyLimit: 40,
      nextStage: 'WARM' as WarmupStage,
      warmupType: 'POOL' as const,
      description: 'Warming up - gradually increasing volume',
    },
    WARM: {
      duration: 7,
      dailyLimit: 60,
      nextStage: 'ACTIVE' as WarmupStage,
      warmupType: 'PEER' as const,
      description: 'Warm account - peer-to-peer warmup enabled',
    },
    ACTIVE: {
      duration: 9,
      dailyLimit: 80,
      nextStage: 'ESTABLISHED' as WarmupStage,
      warmupType: 'PEER' as const,
      description: 'Active warmup - high volume peer warmup',
    },
    ESTABLISHED: {
      duration: Infinity,
      dailyLimit: 100,
      nextStage: null,
      warmupType: 'PEER' as const,
      description: 'Established account - maximum warmup capacity',
    },
  }

  return config[stage]
}

/**
 * Calculate warmup progress percentage
 */
export function calculateWarmupProgress(
  stage: WarmupStage,
  daysInStage: number
): number {
  const config = getWarmupStageConfig(stage)

  if (config.duration === Infinity) return 100

  const progress = Math.min((daysInStage / config.duration) * 100, 100)
  return Math.round(progress)
}

/**
 * Get total warmup duration in days
 */
export function getTotalWarmupDuration(): number {
  return 7 + 7 + 7 + 9 // NEW + WARMING + WARM + ACTIVE = 30 days
}

/**
 * Check if account is eligible for peer warmup
 */
export function isPeerWarmupEligible(stage: WarmupStage): boolean {
  return ['WARM', 'ACTIVE', 'ESTABLISHED'].includes(stage)
}

/**
 * Format warmup stage for display
 */
export function formatWarmupStage(stage: WarmupStage): string {
  const labels = {
    NEW: 'New Account',
    WARMING: 'Warming Up',
    WARM: 'Warm',
    ACTIVE: 'Active Warmup',
    ESTABLISHED: 'Established',
  }

  return labels[stage]
}

/**
 * Get stage color for UI
 */
export function getStageColor(stage: WarmupStage): string {
  const colors = {
    NEW: 'blue',
    WARMING: 'yellow',
    WARM: 'orange',
    ACTIVE: 'green',
    ESTABLISHED: 'purple',
  }

  return colors[stage]
}

/**
 * Calculate days until next stage
 */
export function getDaysUntilNextStage(
  stage: WarmupStage,
  daysInStage: number
): number | null {
  const config = getWarmupStageConfig(stage)

  if (config.nextStage === null) return null

  return Math.max(0, config.duration - daysInStage)
}

/**
 * Get recommended daily send limit based on health score
 */
export function getRecommendedDailyLimit(
  baseLimit: number,
  healthScore: number
): number {
  // Reduce limit if health score is low
  if (healthScore < 50) return Math.floor(baseLimit * 0.3)
  if (healthScore < 70) return Math.floor(baseLimit * 0.6)
  if (healthScore < 85) return Math.floor(baseLimit * 0.8)

  return baseLimit
}

/**
 * Format duration in minutes to human-readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`

  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  return `${days}d ${hours}h`
}

/**
 * Calculate optimal send time within business hours
 */
export function calculateOptimalSendTime(
  timezone: string = 'America/New_York'
): Date {
  const now = new Date()

  // Business hours: 9 AM - 5 PM in account's timezone
  const businessHours = {
    start: 9,
    end: 17,
  }

  // Add random delay between 30-90 minutes
  const delayMinutes = Math.floor(Math.random() * 60) + 30
  const sendTime = new Date(now.getTime() + delayMinutes * 60 * 1000)

  // TODO: Implement timezone-aware business hours checking
  // For now, just return the calculated time

  return sendTime
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Extract domain from email
 */
export function extractDomain(email: string): string {
  return email.split('@')[1] || ''
}

/**
 * Check if two accounts are from the same domain
 */
export function isSameDomain(email1: string, email2: string): boolean {
  return extractDomain(email1) === extractDomain(email2)
}

/**
 * Generate unique warmup ID
 */
export function generateWarmupId(accountId: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `warmup-${accountId.substring(0, 8)}-${timestamp}-${random}`
}

/**
 * Parse warmup ID to extract account ID and timestamp
 */
export function parseWarmupId(warmupId: string): {
  accountId: string
  timestamp: number
} | null {
  const parts = warmupId.split('-')
  if (parts.length !== 4 || parts[0] !== 'warmup') return null

  return {
    accountId: parts[1],
    timestamp: parseInt(parts[2], 10),
  }
}

/**
 * Calculate engagement score from metrics
 */
export function calculateEngagementScore(metrics: {
  opens: number
  clicks: number
  replies: number
  total: number
}): number {
  if (metrics.total === 0) return 0

  const openRate = metrics.opens / metrics.total
  const clickRate = metrics.clicks / metrics.total
  const replyRate = metrics.replies / metrics.total

  // Weighted score
  const score = openRate * 30 + clickRate * 30 + replyRate * 40

  return Math.round(score * 100)
}

/**
 * Get health status text and color
 */
export function getHealthStatus(
  healthScore: number
): { status: string; color: string; icon: string } {
  if (healthScore >= 85) {
    return { status: 'Excellent', color: 'green', icon: '✓' }
  }
  if (healthScore >= 70) {
    return { status: 'Good', color: 'blue', icon: '✓' }
  }
  if (healthScore >= 50) {
    return { status: 'Fair', color: 'yellow', icon: '⚠' }
  }
  if (healthScore >= 30) {
    return { status: 'Poor', color: 'orange', icon: '⚠' }
  }
  return { status: 'Critical', color: 'red', icon: '✗' }
}

/**
 * Chunk array into smaller arrays
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error

      const delay = baseDelay * Math.pow(2, i)
      await sleep(delay)
    }
  }

  throw new Error('Max retries exceeded')
}