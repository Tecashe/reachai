import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { authenticateApiKey, checkScope } from "./api-auth"
import { checkRateLimit, logApiRequest } from "../services/rate-limiter"
import { corsHeaders, handleCors } from "./cors"
import { securityHeaders, validateRequestSize, validateIdempotencyKey } from "./security"
import { errorTracker } from "../monitoring/error-tracker"

export interface ApiContext {
  user: any
  apiKey: any
  scopes: string[]
}

export type ApiHandler<T = any> = (request: NextRequest, context: ApiContext) => Promise<NextResponse<T>>

export function withApiAuth(requiredScope?: string) {
  return (handler: ApiHandler) =>
    async (request: NextRequest): Promise<NextResponse> => {
      const startTime = Date.now()
      const endpoint = new URL(request.url).pathname
      const method = request.method
      const origin = request.headers.get("origin")

      const corsResponse = handleCors(request)
      if (corsResponse) return corsResponse

      const sizeValidation = await validateRequestSize(request)
      if (sizeValidation) return sizeValidation

      const idempotencyKey = validateIdempotencyKey(request)

      // Authenticate API key
      const auth = await authenticateApiKey(request)

      if (!auth.authenticated) {
        const response = NextResponse.json(
          {
            success: false,
            error: auth.error,
          },
          { status: auth.status },
        )

        Object.entries({ ...corsHeaders(origin), ...securityHeaders() }).forEach(([key, value]) => {
          response.headers.set(key, value)
        })

        return response
      }

      // Check required scope
      if (requiredScope && !checkScope(auth.scopes, requiredScope)) {
        const response = NextResponse.json(
          {
            success: false,
            error: `Missing required scope: ${requiredScope}`,
          },
          { status: 403 },
        )

        Object.entries({ ...corsHeaders(origin), ...securityHeaders() }).forEach(([key, value]) => {
          response.headers.set(key, value)
        })

        return response
      }

      // Check rate limit
      const rateLimit = await checkRateLimit(auth.apiKey.id, auth.apiKey.rateLimit)

      if (!rateLimit.allowed) {
        const response = NextResponse.json(
          {
            success: false,
            error: "Rate limit exceeded",
          },
          { status: 429 },
        )

        response.headers.set("X-RateLimit-Limit", String(rateLimit.limit))
        response.headers.set("X-RateLimit-Remaining", "0")
        response.headers.set("X-RateLimit-Reset", String(rateLimit.reset))

        Object.entries({ ...corsHeaders(origin), ...securityHeaders() }).forEach(([key, value]) => {
          response.headers.set(key, value)
        })

        return response
      }

      if (idempotencyKey) {
        const { checkIdempotency, storeIdempotency } = await import("../services/idempotency")
        const cached = await checkIdempotency(auth.apiKey.id, idempotencyKey)
        if (cached) {
          return NextResponse.json(cached.response, { status: cached.status })
        }
      }

      try {
        errorTracker.setUser(auth.user.id)

        // Execute the handler
        const response = await handler(request, {
          user: auth.user,
          apiKey: auth.apiKey,
          scopes: auth.scopes,
        })

        if (idempotencyKey && response.status < 500) {
          const { storeIdempotency } = await import("../services/idempotency")
          const body = await response.clone().json()
          await storeIdempotency(auth.apiKey.id, idempotencyKey, body, response.status)
        }

        response.headers.set("X-RateLimit-Limit", String(rateLimit.limit))
        response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining))
        response.headers.set("X-RateLimit-Reset", String(rateLimit.reset))

        Object.entries({ ...corsHeaders(origin), ...securityHeaders() }).forEach(([key, value]) => {
          response.headers.set(key, value)
        })

        // Log the request
        const responseTime = Date.now() - startTime
        await logApiRequest(auth.apiKey.id, endpoint, method, response.status, responseTime)

        return response
      } catch (error: any) {
        console.error("[v0] API handler error:", error)

        errorTracker.captureException(error, {
          userId: auth.user.id,
          apiKeyId: auth.apiKey.id,
          endpoint,
          method,
        })

        const responseTime = Date.now() - startTime
        await logApiRequest(auth.apiKey.id, endpoint, method, 500, responseTime)

        const response = NextResponse.json(
          {
            success: false,
            error: error.message || "Internal server error",
          },
          { status: 500 },
        )

        Object.entries({ ...corsHeaders(origin), ...securityHeaders() }).forEach(([key, value]) => {
          response.headers.set(key, value)
        })

        return response
      } finally {
        errorTracker.clearUser()
      }
    }
}
