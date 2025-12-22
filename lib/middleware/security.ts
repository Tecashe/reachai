import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const MAX_REQUEST_SIZE = 10 * 1024 * 1024 // 10MB

export function securityHeaders() {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  }
}

export async function validateRequestSize(request: NextRequest): Promise<NextResponse | null> {
  const contentLength = request.headers.get("content-length")

  if (contentLength && Number.parseInt(contentLength) > MAX_REQUEST_SIZE) {
    return NextResponse.json(
      {
        success: false,
        error: "Request payload too large. Maximum size is 10MB.",
      },
      { status: 413 },
    )
  }

  return null
}

export function validateIdempotencyKey(request: NextRequest): string | null {
  if (request.method === "POST" || request.method === "PUT") {
    return request.headers.get("X-Idempotency-Key")
  }
  return null
}
