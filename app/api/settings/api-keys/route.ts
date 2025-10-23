import { type NextRequest, NextResponse } from "next/server"
import { protectApiRoute } from "@/lib/api-protection"
import { db } from "@/lib/db"
import { nanoid } from "nanoid"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  const { error, user } = await protectApiRoute()
  if (error) return error

  try {
    const apiKeys = await db.apiKey.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        scopes: true,
        createdAt: true,
        lastUsedAt: true,
        // usageCount: true,
      },
    })

    const formattedKeys = apiKeys.map((key) => ({
      id: key.id,
      name: key.name,
      keyPrefix: key.keyPrefix,
      scopes: key.scopes,
      created: new Date(key.createdAt).toLocaleDateString(),
      lastUsed: key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : "Never",
      // usageCount: key.usageCount,
    }))

    return NextResponse.json({ keys: formattedKeys })
  } catch (err) {
    logger.error("Failed to fetch API keys", err as Error)
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { error, user } = await protectApiRoute()
  if (error) return error

  try {
    const { name, scopes } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    if (!scopes || !Array.isArray(scopes) || scopes.length === 0) {
      return NextResponse.json({ error: "At least one scope is required" }, { status: 400 })
    }

    // Generate API key with prefix
    const keyPrefix = `sk_${user!.subscriptionTier === "FREE" ? "test" : "live"}_${nanoid(8)}`
    const keySecret = nanoid(32)
    const fullKey = `${keyPrefix}_${keySecret}`

    // Hash the full key for storage
    const crypto = await import("crypto")
    const hashedKey = crypto.createHash("sha256").update(fullKey).digest("hex")

    const apiKey = await db.apiKey.create({
      data: {
        userId: user!.id,
        name,
        key: hashedKey,
        keyPrefix,
        scopes,
      },
    })

    logger.info("API key created", { userId: user!.id, keyId: apiKey.id, name })

    // Return the full key only once (it won't be shown again)
    return NextResponse.json({
      id: apiKey.id,
      name: apiKey.name,
      key: fullKey, // Full key shown only on creation
      keyPrefix: apiKey.keyPrefix,
      scopes: apiKey.scopes,
    })
  } catch (err) {
    logger.error("Failed to create API key", err as Error)
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
}
