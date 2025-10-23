"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { nanoid } from "nanoid"
import { createHash } from "crypto"
import { revalidatePath } from "next/cache"

export async function getApiKeys() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        apiKeys: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    return {
      success: true,
      apiKeys: user.apiKeys.map((key) => ({
        id: key.id,
        name: key.name,
        keyPrefix: key.keyPrefix,
        isActive: key.isActive,
        lastUsedAt: key.lastUsedAt,
        requestCount: key.requestCount,
        createdAt: key.createdAt,
        expiresAt: key.expiresAt,
      })),
    }
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return { success: false, error: "Failed to fetch API keys" }
  }
}

function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex")
}

export async function createApiKey(data: {
  name: string
  scopes: string[]
  expiresInDays?: number
}) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Generate API key: sk_live_<random>
    const randomPart = nanoid(32)
    const apiKey = `sk_live_${randomPart}`
    const hashedKey = hashApiKey(apiKey)
    const keyPrefix = `${apiKey.substring(0, 15)}...`

    // Calculate expiration
    const expiresAt = data.expiresInDays ? new Date(Date.now() + data.expiresInDays * 24 * 60 * 60 * 1000) : null

    const newApiKey = await db.apiKey.create({
      data: {
        userId: user.id,
        name: data.name,
        key: hashedKey,
        keyPrefix,
        scopes: data.scopes,
        expiresAt,
      },
    })

    revalidatePath("/dashboard/settings")

    // Return the plain API key ONLY on creation (never stored)
    return {
      success: true,
      apiKey: {
        id: newApiKey.id,
        name: newApiKey.name,
        key: apiKey, // Plain key - show once!
        keyPrefix,
        createdAt: newApiKey.createdAt,
      },
    }
  } catch (error) {
    console.error("Error creating API key:", error)
    return { success: false, error: "Failed to create API key" }
  }
}

export async function deleteApiKey(keyId: string) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    await db.apiKey.delete({
      where: {
        id: keyId,
        userId: user.id,
      },
    })

    revalidatePath("/dashboard/settings")

    return { success: true }
  } catch (error) {
    console.error("Error deleting API key:", error)
    return { success: false, error: "Failed to delete API key" }
  }
}

export async function toggleApiKey(keyId: string, isActive: boolean) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    await db.apiKey.update({
      where: {
        id: keyId,
        userId: user.id,
      },
      data: { isActive },
    })

    revalidatePath("/dashboard/settings")

    return { success: true }
  } catch (error) {
    console.error("Error toggling API key:", error)
    return { success: false, error: "Failed to toggle API key" }
  }
}
