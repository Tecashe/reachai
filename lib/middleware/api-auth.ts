import type { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { createHash } from "crypto"

type AuthSuccess = {
  authenticated: true
  user: any
  apiKey: any
  scopes: string[]
}

type AuthFailure = {
  authenticated: false
  error: string
  status: number
}

export type AuthResult = AuthSuccess | AuthFailure

function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex")
}

export async function authenticateApiKey(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      authenticated: false,
      error: "Missing or invalid authorization header",
      status: 401,
    }
  }

  const apiKey = authHeader.substring(7) // Remove "Bearer "
  const hashedKey = hashApiKey(apiKey)

  try {
    const key = await db.apiKey.findUnique({
      where: { key: hashedKey },
      include: { user: true },
    })

    if (!key) {
      return {
        authenticated: false,
        error: "Invalid API key",
        status: 401,
      }
    }

    if (!key.isActive) {
      return {
        authenticated: false,
        error: "API key is inactive",
        status: 403,
      }
    }

    if (key.expiresAt && key.expiresAt < new Date()) {
      return {
        authenticated: false,
        error: "API key has expired",
        status: 403,
      }
    }

    // Update last used timestamp and request count
    await db.apiKey.update({
      where: { id: key.id },
      data: {
        lastUsedAt: new Date(),
        requestCount: { increment: 1 },
      },
    })

    return {
      authenticated: true,
      user: key.user,
      apiKey: key,
      scopes: (key.scopes as string[]) || [],
    }
  } catch (error) {
    console.error("API authentication error:", error)
    return {
      authenticated: false,
      error: "Authentication failed",
      status: 500,
    }
  }
}

export function checkScope(userScopes: string[], requiredScope: string): boolean {
  return userScopes.includes(requiredScope) || userScopes.includes("*")
}
