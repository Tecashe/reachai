// import { Redis } from '@upstash/redis'
// import { logger } from '@/lib/logger'

// // Singleton Redis client
// let redisInstance: Redis | null = null

// export function getRedisClient(): Redis {
//   if (!redisInstance) {
//     if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
//       throw new Error('Redis credentials not configured')
//     }

//     redisInstance = new Redis({
//       url: process.env.UPSTASH_REDIS_REST_URL,
//       token: process.env.UPSTASH_REDIS_REST_TOKEN,
//     })

//     logger.info('Redis client initialized')
//   }

//   return redisInstance
// }

// // Export singleton
// export const redis = getRedisClient()

// // Redis key prefixes
// export const REDIS_KEYS = {
//   PEER_CACHE: 'warmup:peers:',
//   ACCOUNT_LOCK: 'warmup:lock:',
//   POOL_EMAILS: 'warmup:pool',
//   HEALTH_CHECK: 'warmup:health:',
//   METRICS: 'warmup:metrics:',
//   RATE_LIMIT: 'warmup:ratelimit:',
// } as const

import { Redis } from "@upstash/redis"

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Redis key prefixes for organization
export const REDIS_KEYS = {
  LOCK: "lock:",
  PEER_CACHE: "peer:cache:",
  PEER_MATCHES: "peer:matches:",
  SESSION: "session:",
  METRICS: "metrics:",
  RATE_LIMIT: "ratelimit:",
  RETRY_QUEUE: "retry:queue",
  RETRY_PROCESSING: "retry:processing",
  HEALTH_CHECK: "health:check:",
} as const

// Helper to safely parse Redis JSON values
export function parseRedisJson<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

// Helper to serialize for Redis
export function serializeForRedis(value: any): string {
  return JSON.stringify(value)
}

// Connection health check
export async function checkRedisHealth(): Promise<boolean> {
  try {
    await redis.ping()
    return true
  } catch (error) {
    console.error("Redis health check failed:", error)
    return false
  }
}
