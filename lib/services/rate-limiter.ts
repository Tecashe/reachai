import { db } from "@/lib/db"
import { Redis } from "@upstash/redis"

// Initialize Redis client if available
const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
    : null

interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  reset: number
}

export async function checkRateLimit(apiKeyId: string, limit: number): Promise<RateLimitResult> {
  const now = Date.now()
  const window = 3600000 // 1 hour in milliseconds
  const windowStart = now - window

  if (redis) {
    // Use Redis for distributed rate limiting
    const key = `ratelimit:${apiKeyId}`

    // Get current count
    const requests = await redis.zcount(key, windowStart, now)

    if (requests >= limit) {
      const oldestRequest = await redis.zrange(key, 0, 0, { withScores: true })
      const resetTime = oldestRequest[1] ? Number(oldestRequest[1]) + window : now + window

      return {
        allowed: false,
        limit,
        remaining: 0,
        reset: Math.ceil(resetTime / 1000),
      }
    }

    // Add current request
    await redis.zadd(key, { score: now, member: `${now}-${Math.random()}` })

    // Clean old entries
    await redis.zremrangebyscore(key, 0, windowStart)

    // Set expiry
    await redis.expire(key, Math.ceil(window / 1000))

    return {
      allowed: true,
      limit,
      remaining: limit - (requests + 1),
      reset: Math.ceil((now + window) / 1000),
    }
  } else {
    // Fallback to database-based rate limiting
    const count = await db.apiRequestLog.count({
      where: {
        apiKeyId,
        createdAt: {
          gte: new Date(windowStart),
        },
      },
    })

    if (count >= limit) {
      const oldestRequest = await db.apiRequestLog.findFirst({
        where: { apiKeyId },
        orderBy: { createdAt: "asc" },
      })

      const resetTime = oldestRequest ? oldestRequest.createdAt.getTime() + window : now + window

      return {
        allowed: false,
        limit,
        remaining: 0,
        reset: Math.ceil(resetTime / 1000),
      }
    }

    return {
      allowed: true,
      limit,
      remaining: limit - (count + 1),
      reset: Math.ceil((now + window) / 1000),
    }
  }
}

export async function logApiRequest(
  apiKeyId: string,
  endpoint: string,
  method: string,
  statusCode: number,
  responseTime: number,
): Promise<void> {
  try {
    await db.apiRequestLog.create({
      data: {
        apiKeyId,
        endpoint,
        method,
        statusCode,
        responseTime,
      },
    })
  } catch (error) {
    console.error("[v0] Failed to log API request:", error)
  }
}

export function getRateLimitByTier(tier: string): number {
  const limits: Record<string, number> = {
    FREE: 100,
    STARTER: 1000,
    PRO: 10000,
    AGENCY: 100000,
  }
  return limits[tier] || 100
}
