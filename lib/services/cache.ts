import { Redis } from "@upstash/redis"

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

interface CacheOptions {
  ttl?: number // Time to live in seconds
  tags?: string[] // Cache tags for invalidation
}

export class CacheService {
  private prefix = "cache:"

  async get<T>(key: string): Promise<T | null> {
    if (!redis) return null

    try {
      const value = await redis.get(`${this.prefix}${key}`)
      return value as T | null
    } catch (error) {
      console.error("[CACHE] Get failed:", error)
      return null
    }
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    if (!redis) return

    try {
      const ttl = options.ttl || 300 // Default 5 minutes
      await redis.setex(`${this.prefix}${key}`, ttl, JSON.stringify(value))

      // Store tags for invalidation
      if (options.tags) {
        for (const tag of options.tags) {
          await redis.sadd(`${this.prefix}tag:${tag}`, key)
          await redis.expire(`${this.prefix}tag:${tag}`, ttl)
        }
      }
    } catch (error) {
      console.error("[CACHE] Set failed:", error)
    }
  }

  async delete(key: string): Promise<void> {
    if (!redis) return

    try {
      await redis.del(`${this.prefix}${key}`)
    } catch (error) {
      console.error("[CACHE] Delete failed:", error)
    }
  }

  async invalidateTag(tag: string): Promise<void> {
    if (!redis) return

    try {
      const keys = await redis.smembers(`${this.prefix}tag:${tag}`)
      if (keys && keys.length > 0) {
        const pipeline = redis.pipeline()
        for (const key of keys) {
          pipeline.del(`${this.prefix}${key}`)
        }
        await pipeline.exec()
      }
      await redis.del(`${this.prefix}tag:${tag}`)
    } catch (error) {
      console.error("[CACHE] Invalidate tag failed:", error)
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    if (!redis) return

    try {
      // Note: This is expensive, use sparingly
      const keys = await redis.keys(`${this.prefix}${pattern}`)
      if (keys && keys.length > 0) {
        await redis.del(...keys)
      }
    } catch (error) {
      console.error("[CACHE] Invalidate pattern failed:", error)
    }
  }
}

export const cache = new CacheService()

// Helper function for caching API responses
export async function withCache<T>(key: string, fetcher: () => Promise<T>, options: CacheOptions = {}): Promise<T> {
  // Try to get from cache
  const cached = await cache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  // Fetch fresh data
  const data = await fetcher()

  // Store in cache
  await cache.set(key, data, options)

  return data
}
