import { Inngest } from 'inngest'
import { logger } from '@/lib/logger'

export const inngest = new Inngest({
  id: 'warmup-system',
  name: 'Email Warmup System',
  eventKey: process.env.INNGEST_EVENT_KEY,
  retryFunction: async (attempt: number) => ({
    delay: Math.min(1000 * Math.pow(2, attempt), 60000), // Exponential backoff, max 60s
    maxAttempts: 3,
  }),
})

// Event types for type safety
export type WarmupEvents = {
  'warmup/account.process': {
    data: {
      accountId: string
      priority?: 'high' | 'normal' | 'low'
    }
  }
  'warmup/replies.process': {
    data: {
      batchSize?: number
    }
  }
  'warmup/cache.rebuild': {
    data: {
      accountId?: string // If undefined, rebuild all
    }
  }
  'warmup/health.check': {
    data: {
      accountId?: string
    }
  }
  'warmup/session.create': {
    data: {
      accountId: string
      warmupType: 'POOL' | 'PEER'
    }
  }
}

logger.info('Inngest client initialized')