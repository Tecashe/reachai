import { redis } from "@/lib/redis"
import { logger } from "@/lib/logger"

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  accountId: string
  limitType: "hourly" | "daily" | "warmup" | "sending"
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
  retryAfter?: number
}

function handleError(error: any): Error {
  if (error instanceof Error) {
    return error
  }
  return new Error(JSON.stringify(error))
}

export class RateLimiter {
  /**
   * Check if action is allowed under rate limit
   * Uses Redis sorted sets for accurate sliding window
   */
  async checkLimit(config: RateLimitConfig): Promise<RateLimitResult> {
    const key = this.getLimitKey(config)
    const now = Date.now()
    const windowStart = now - config.windowMs

    try {
      // Step 1: Remove old entries outside the window
      await redis.zremrangebyscore(key, 0, windowStart)

      // Step 2: Count current entries in window
      const currentCount = await redis.zcard(key)

      // Step 3: Check if limit exceeded
      if (currentCount >= config.maxRequests) {
        const oldestEntries = await redis.zrange(key, 0, 0, { withScores: true })
        const oldestTimestamp = oldestEntries.length > 1 ? Number.parseFloat(String(oldestEntries[1])) : now

        const resetAt = new Date(oldestTimestamp + config.windowMs)
        const retryAfter = Math.ceil((resetAt.getTime() - now) / 1000)

        logger.debug("Rate limit exceeded", {
          accountId: config.accountId,
          limitType: config.limitType,
          currentCount,
          maxRequests: config.maxRequests,
          retryAfter,
        })

        return {
          allowed: false,
          remaining: 0,
          resetAt,
          retryAfter,
        }
      }

      // Step 4: Add current request to sorted set
      await redis.zadd(key, {
        score: now,
        member: `${now}-${Math.random()}`,
      })

      // Step 5: Set expiry on key (cleanup)
      await redis.expire(key, Math.ceil(config.windowMs / 1000))

      const remaining = config.maxRequests - currentCount - 1
      const resetAt = new Date(now + config.windowMs)

      logger.debug("Rate limit check passed", {
        accountId: config.accountId,
        limitType: config.limitType,
        currentCount: currentCount + 1,
        remaining,
      })

      return {
        allowed: true,
        remaining,
        resetAt,
      }
    } catch (error) {
      logger.error("Rate limit check failed", handleError(error), {
        accountId: config.accountId,
      })

      // Fail open in case of Redis error
      return {
        allowed: true,
        remaining: config.maxRequests,
        resetAt: new Date(now + config.windowMs),
      }
    }
  }

  /**
   * Check hourly sending limit
   */
  async checkHourlyLimit(accountId: string, hourlyLimit: number): Promise<RateLimitResult> {
    return this.checkLimit({
      accountId,
      maxRequests: hourlyLimit,
      windowMs: 3600000, // 1 hour
      limitType: "hourly",
    })
  }

  /**
   * Check daily sending limit
   */
  async checkDailyLimit(accountId: string, dailyLimit: number): Promise<RateLimitResult> {
    return this.checkLimit({
      accountId,
      maxRequests: dailyLimit,
      windowMs: 86400000, // 24 hours
      limitType: "daily",
    })
  }

  /**
   * Check warmup daily limit (separate from campaign sending)
   */
  async checkWarmupLimit(accountId: string, warmupLimit: number): Promise<RateLimitResult> {
    return this.checkLimit({
      accountId,
      maxRequests: warmupLimit,
      windowMs: 86400000, // 24 hours
      limitType: "warmup",
    })
  }

  /**
   * Check multiple limits at once
   * Returns false if any limit is exceeded
   */
  async checkAllLimits(
    accountId: string,
    limits: {
      hourlyLimit?: number
      dailyLimit?: number
      warmupLimit?: number
    },
  ): Promise<{
    allowed: boolean
    results: {
      hourly?: RateLimitResult
      daily?: RateLimitResult
      warmup?: RateLimitResult
    }
    blockingLimit?: string
  }> {
    const results: any = {}

    if (limits.hourlyLimit) {
      results.hourly = await this.checkHourlyLimit(accountId, limits.hourlyLimit)
      if (!results.hourly.allowed) {
        return { allowed: false, results, blockingLimit: "hourly" }
      }
    }

    if (limits.dailyLimit) {
      results.daily = await this.checkDailyLimit(accountId, limits.dailyLimit)
      if (!results.daily.allowed) {
        return { allowed: false, results, blockingLimit: "daily" }
      }
    }

    if (limits.warmupLimit) {
      results.warmup = await this.checkWarmupLimit(accountId, limits.warmupLimit)
      if (!results.warmup.allowed) {
        return { allowed: false, results, blockingLimit: "warmup" }
      }
    }

    return { allowed: true, results }
  }

  /**
   * Get current usage for an account
   */
  async getUsage(
    accountId: string,
    limitType: "hourly" | "daily" | "warmup",
  ): Promise<{ count: number; limit: number; remaining: number }> {
    const windowMs = limitType === "hourly" ? 3600000 : 86400000
    const key = this.getLimitKey({
      accountId,
      maxRequests: 0,
      windowMs,
      limitType,
    })

    const now = Date.now()
    const windowStart = now - windowMs

    // Remove old entries
    await redis.zremrangebyscore(key, 0, windowStart)

    // Count current entries
    const count = await redis.zcard(key)

    return {
      count,
      limit: 0, // Caller should provide limit
      remaining: 0,
    }
  }

  /**
   * Reset limits for an account (useful for testing or manual resets)
   */
  async resetLimits(accountId: string): Promise<void> {
    const limitTypes: Array<"hourly" | "daily" | "warmup" | "sending"> = ["hourly", "daily", "warmup", "sending"]

    for (const limitType of limitTypes) {
      const keys = [
        this.getLimitKey({
          accountId,
          maxRequests: 0,
          windowMs: 3600000,
          limitType,
        }),
        this.getLimitKey({
          accountId,
          maxRequests: 0,
          windowMs: 86400000,
          limitType,
        }),
      ]

      for (const key of keys) {
        await redis.del(key)
      }
    }

    logger.info("Rate limits reset", { accountId })
  }

  /**
   * Generate rate limit key
   */
  private getLimitKey(config: RateLimitConfig): string {
    return `ratelimit:${config.accountId}:${config.limitType}:${config.windowMs}`
  }

  /**
   * Distributed rate limiting across multiple servers
   * Uses Redis Lua script for atomicity
   */
  async checkDistributedLimit(config: RateLimitConfig): Promise<RateLimitResult> {
    const key = this.getLimitKey(config)
    const now = Date.now()
    const windowStart = now - config.windowMs

    const luaScript = `
      local key = KEYS[1]
      local now = tonumber(ARGV[1])
      local window_start = tonumber(ARGV[2])
      local max_requests = tonumber(ARGV[3])
      local window_ms = tonumber(ARGV[4])
      
      -- Remove old entries
      redis.call('ZREMRANGEBYSCORE', key, 0, window_start)
      
      -- Get current count
      local current_count = redis.call('ZCARD', key)
      
      -- Check limit
      if current_count >= max_requests then
        local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
        local reset_at = oldest[2] and (tonumber(oldest[2]) + window_ms) or now
        return {0, 0, reset_at}
      end
      
      -- Add entry
      redis.call('ZADD', key, now, now .. '-' .. math.random())
      redis.call('EXPIRE', key, math.ceil(window_ms / 1000))
      
      local remaining = max_requests - current_count - 1
      return {1, remaining, now + window_ms}
    `

    try {
      const result = (await redis.eval(
    luaScript,
    [key], // Keys as array
    [
      now.toString(),
      windowStart.toString(),
      config.maxRequests.toString(),
      config.windowMs.toString(),
    ], // Args as array
  )) as [number, number, number]

      const [allowed, remaining, resetAtMs] = result

      return {
        allowed: allowed === 1,
        remaining,
        resetAt: new Date(resetAtMs),
        retryAfter: allowed === 0 ? Math.ceil((resetAtMs - now) / 1000) : undefined,
      }
    } catch (error) {
      logger.error("Distributed rate limit check failed", error as Error)

      // Fail open
      return {
        allowed: true,
        remaining: config.maxRequests,
        resetAt: new Date(now + config.windowMs),
      }
    }
  }
}

export const rateLimiter = new RateLimiter()
