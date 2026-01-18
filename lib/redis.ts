// // import { Redis } from '@upstash/redis'
// // import { logger } from '@/lib/logger'

// // // Singleton Redis client
// // let redisInstance: Redis | null = null

// // export function getRedisClient(): Redis {
// //   if (!redisInstance) {
// //     if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
// //       throw new Error('Redis credentials not configured')
// //     }

// //     redisInstance = new Redis({
// //       url: process.env.UPSTASH_REDIS_REST_URL,
// //       token: process.env.UPSTASH_REDIS_REST_TOKEN,
// //     })

// //     logger.info('Redis client initialized')
// //   }

// //   return redisInstance
// // }

// // // Export singleton
// // export const redis = getRedisClient()

// // // Redis key prefixes
// // export const REDIS_KEYS = {
// //   PEER_CACHE: 'warmup:peers:',
// //   ACCOUNT_LOCK: 'warmup:lock:',
// //   POOL_EMAILS: 'warmup:pool',
// //   HEALTH_CHECK: 'warmup:health:',
// //   METRICS: 'warmup:metrics:',
// //   RATE_LIMIT: 'warmup:ratelimit:',
// // } as const

// import { Redis } from "@upstash/redis"

// // Initialize Redis client
// export const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL!,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN!,
// })

// // Redis key prefixes for organization
// export const REDIS_KEYS = {
//   LOCK: "lock:",
//   PEER_CACHE: "peer:cache:",
//   PEER_MATCHES: "peer:matches:",
//   SESSION: "session:",
//   METRICS: "metrics:",
//   RATE_LIMIT: "ratelimit:",
//   RETRY_QUEUE: "retry:queue",
//   RETRY_PROCESSING: "retry:processing",
//   HEALTH_CHECK: "health:check:",
// } as const

// // Helper to safely parse Redis JSON values
// export function parseRedisJson<T>(value: string | null): T | null {
//   if (!value) return null
//   try {
//     return JSON.parse(value) as T
//   } catch {
//     return null
//   }
// }

// // Helper to serialize for Redis
// export function serializeForRedis(value: any): string {
//   return JSON.stringify(value)
// }

// // Connection health check
// export async function checkRedisHealth(): Promise<boolean> {
//   try {
//     await redis.ping()
//     return true
//   } catch (error) {
//     console.error("Redis health check failed:", error)
//     return false
//   }
// }
import { Redis } from '@upstash/redis'

// Validate environment variables
if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error('UPSTASH_REDIS_REST_URL is not defined')
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('UPSTASH_REDIS_REST_TOKEN is not defined')
}

// Initialize Redis client with retry logic
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  automaticDeserialization: true, // Auto parse JSON
  retry: {
    retries: 3,
    backoff: (retryCount) => Math.min(1000 * 2 ** retryCount, 3000),
  },
})

// Redis key prefixes for organization
export const REDIS_KEYS = {
  LOCK: 'lock:',
  PEER_CACHE: 'peer:cache:',
  PEER_MATCHES: 'peer:matches:',
  SESSION: 'session:',
  METRICS: 'metrics:',
  RATE_LIMIT: 'ratelimit:',
  RETRY_QUEUE: 'retry:queue',
  RETRY_PROCESSING: 'retry:processing',
  HEALTH_CHECK: 'health:check:',
} as const

// Helper to safely parse Redis JSON values
export function parseRedisJson<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch (error) {
    console.error('Failed to parse Redis JSON:', error)
    return null
  }
}

// Helper to serialize for Redis
export function serializeForRedis(value: any): string {
  return JSON.stringify(value)
}

// Connection health check with detailed error logging
export async function checkRedisHealth(): Promise<{
  healthy: boolean
  error?: string
  latency?: number
}> {
  const startTime = Date.now()
  
  try {
    const pingResult = await redis.ping()
    const latency = Date.now() - startTime

    if (pingResult !== 'PONG') {
      console.error('Redis ping returned unexpected value:', pingResult)
      return { healthy: false, error: 'Unexpected ping response' }
    }

    // Test read/write with simple string
    const testKey = 'health:check:test'
    const testValue = `test-${Date.now()}`
    
    await redis.set(testKey, testValue, { ex: 10 })
    const retrieved = await redis.get<string>(testKey)
    
    // Clean up test key
    await redis.del(testKey)
    
    if (retrieved !== testValue) {
      console.error('Read/write test failed:', { 
        expected: testValue, 
        received: retrieved 
      })
      return { 
        healthy: false, 
        error: 'Read/write test failed',
        latency 
      }
    }

    return { healthy: true, latency }
  } catch (error) {
    console.error('Redis health check failed:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
    })
    
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Initialize and test connection on startup (non-blocking)
let isInitialized = false
let initializationPromise: Promise<void> | null = null

export async function initializeRedis(): Promise<void> {
  if (isInitialized) return
  if (initializationPromise) return initializationPromise

  initializationPromise = (async () => {
    console.log('Initializing Redis connection...')
    
    const health = await checkRedisHealth()
    
    if (!health.healthy) {
      console.error('Redis initialization failed:', health.error)
      // Don't throw - let the app continue, Redis errors will be handled per-operation
      console.warn('⚠️  Redis is not healthy but application will continue')
      return
    }

    console.log('✅ Redis connected successfully', {
      latency: `${health.latency}ms`,
    })
    
    isInitialized = true
  })()

  return initializationPromise
}

// Optional: Auto-initialize in serverless environments (non-blocking)
if (typeof window === 'undefined') {
  // Fire and forget - don't block app startup
  initializeRedis().catch((error) => {
    console.error('❌ Redis auto-initialization failed:', error)
  })
}