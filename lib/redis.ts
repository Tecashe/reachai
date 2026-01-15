import { Redis } from '@upstash/redis'
import { logger } from '@/lib/logger'

// Singleton Redis client
let redisInstance: Redis | null = null

export function getRedisClient(): Redis {
  if (!redisInstance) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error('Redis credentials not configured')
    }

    redisInstance = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })

    logger.info('Redis client initialized')
  }

  return redisInstance
}

// Export singleton
export const redis = getRedisClient()

// Redis key prefixes
export const REDIS_KEYS = {
  PEER_CACHE: 'warmup:peers:',
  ACCOUNT_LOCK: 'warmup:lock:',
  POOL_EMAILS: 'warmup:pool',
  HEALTH_CHECK: 'warmup:health:',
  METRICS: 'warmup:metrics:',
  RATE_LIMIT: 'warmup:ratelimit:',
} as const