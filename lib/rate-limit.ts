import type { NextRequest } from "next/server"

interface RateLimitConfig {
  interval: number // milliseconds
  uniqueTokenPerInterval: number
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(config: RateLimitConfig) {
  return {
    check: async (request: NextRequest, limit: number, token: string) => {
      const now = Date.now()
      const tokenData = rateLimitMap.get(token)

      if (!tokenData || now > tokenData.resetTime) {
        rateLimitMap.set(token, {
          count: 1,
          resetTime: now + config.interval,
        })
        return { success: true, remaining: limit - 1 }
      }

      if (tokenData.count >= limit) {
        return {
          success: false,
          remaining: 0,
          reset: tokenData.resetTime,
        }
      }

      tokenData.count++
      return { success: true, remaining: limit - tokenData.count }
    },
  }
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [token, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(token)
    }
  }
}, 60000) // Clean up every minute

// Rate limiters for different endpoints
export const apiRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

export const emailRateLimit = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 1000,
})

export const aiRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 100,
})
