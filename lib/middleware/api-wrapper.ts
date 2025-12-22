import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { authenticateApiKey, checkScope } from "./api-auth"
import { checkRateLimit, logApiRequest } from "../services/rate-limiter"

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

      // Authenticate API key
      const auth = await authenticateApiKey(request)

      if (!auth.authenticated) {
        return NextResponse.json(
          {
            success: false,
            error: auth.error,
          },
          { status: auth.status },
        )
      }

      // Check required scope
      if (requiredScope && !checkScope(auth.scopes, requiredScope)) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required scope: ${requiredScope}`,
          },
          { status: 403 },
        )
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

        return response
      }

      try {
        // Execute the handler
        const response = await handler(request, {
          user: auth.user,
          apiKey: auth.apiKey,
          scopes: auth.scopes,
        })

        // Add rate limit headers
        response.headers.set("X-RateLimit-Limit", String(rateLimit.limit))
        response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining))
        response.headers.set("X-RateLimit-Reset", String(rateLimit.reset))

        // Log the request
        const responseTime = Date.now() - startTime
        await logApiRequest(auth.apiKey.id, endpoint, method, response.status, responseTime)

        return response
      } catch (error: any) {
        console.error("[v0] API handler error:", error)

        const responseTime = Date.now() - startTime
        await logApiRequest(auth.apiKey.id, endpoint, method, 500, responseTime)

        return NextResponse.json(
          {
            success: false,
            error: error.message || "Internal server error",
          },
          { status: 500 },
        )
      }
    }
}
