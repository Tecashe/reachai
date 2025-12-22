import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  // Add production domains
  ...(process.env.ALLOWED_ORIGINS?.split(",") || []),
].filter(Boolean)

const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
const ALLOWED_HEADERS = ["Content-Type", "Authorization", "X-API-Key", "X-Idempotency-Key"]

export function corsHeaders(origin: string | null) {
  const isAllowedOrigin =
    origin &&
    (ALLOWED_ORIGINS.includes(origin) ||
      origin.endsWith(".vercel.app") ||
      (process.env.NODE_ENV === "development" && origin.startsWith("http://localhost")))

  return {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin : ALLOWED_ORIGINS[0] || "*",
    "Access-Control-Allow-Methods": ALLOWED_METHODS.join(", "),
    "Access-Control-Allow-Headers": ALLOWED_HEADERS.join(", "),
    "Access-Control-Max-Age": "86400",
    "Access-Control-Allow-Credentials": "true",
  }
}

export function handleCors(request: NextRequest) {
  const origin = request.headers.get("origin")

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders(origin),
    })
  }

  return null
}
