

import { auth } from "@clerk/nextjs/server"
import { NextResponse, type NextRequest } from "next/server"
import { db } from "@/lib/db"

export async function protectApiRoute() {
  const { userId } = await auth()

  if (!userId) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      userId: null,
      user: null,
    }
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      subscription: true,
    },
  })

  if (!user) {
    return {
      error: NextResponse.json({ error: "User not found" }, { status: 404 }),
      userId,
      user: null,
    }
  }

  return {
    error: null,
    userId,
    user,
  }
}

export async function checkCredits(
  user: { emailCredits: number; researchCredits: number },
  type: "email" | "research",
) {
  if (type === "email" && user.emailCredits <= 0) {
    return {
      hasCredits: false,
      error: NextResponse.json({ error: "Insufficient email credits" }, { status: 403 }),
    }
  }

  if (type === "research" && user.researchCredits <= 0) {
    return {
      hasCredits: false,
      error: NextResponse.json({ error: "Insufficient research credits" }, { status: 403 }),
    }
  }

  return {
    hasCredits: true,
    error: null,
  }
}

export async function withAuth(
  request: NextRequest,
  handler: (userId: string, user: any) => Promise<NextResponse>,
): Promise<NextResponse> {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      subscription: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return handler(userId, user)
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export async function checkRateLimit(
  userId: string,
  action: string,
  limit = 10,
  windowMs = 60000,
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const key = `${userId}:${action}`
  const now = Date.now()

  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    // Create new rate limit window
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })

    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
    }
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    }
  }

  // Increment count
  record.count++
  rateLimitMap.set(key, record)

  return {
    allowed: true,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  }
}

// Clean up old rate limit records periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 60000) // Clean up every minute
