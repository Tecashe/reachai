"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { accountRotationService } from "@/lib/services/account-rotation"
import { logger } from "@/lib/logger"

export async function getRotationMetrics() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    return { success: false, error: "Not authenticated" }
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  })

  if (!user) {
    return { success: false, error: "User not found" }
  }

  try {
    // CHANGE: Fetch rotation metrics for dashboard
    const metrics = await accountRotationService.getRotationMetrics(user.id)

    return {
      success: true,
      data: metrics,
    }
  } catch (error) {
    logger.error("Failed to get rotation metrics", error as Error, { userId: user.id })
    return {
      success: false,
      error: "Failed to fetch metrics",
    }
  }
}

export async function triggerAccountRotation() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    return { success: false, error: "Not authenticated" }
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  })

  if (!user) {
    return { success: false, error: "User not found" }
  }

  try {
    // CHANGE: Trigger manual account rotation
    const nextAccount = await accountRotationService.getNextAccount(user.id, { type: "HEALTH_BASED" })

    if (!nextAccount) {
      return { success: false, error: "No available accounts for rotation" }
    }

    logger.info("Manual account rotation triggered", {
      userId: user.id,
      accountId: nextAccount.accountId,
    })

    return {
      success: true,
      data: nextAccount,
    }
  } catch (error) {
    logger.error("Failed to trigger rotation", error as Error, { userId: user.id })
    return {
      success: false,
      error: "Failed to rotate account",
    }
  }
}

export async function triggerIPRotation() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    return { success: false, error: "Not authenticated" }
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  })

  if (!user) {
    return { success: false, error: "User not found" }
  }

  try {
    // CHANGE: Trigger IP rotation across accounts
    const nextAccount = await accountRotationService.rotateIP(user.id)

    if (!nextAccount) {
      return { success: false, error: "Cannot perform IP rotation with less than 2 accounts" }
    }

    logger.info("IP rotation triggered", {
      userId: user.id,
      accountId: nextAccount.accountId,
      ipAddress: nextAccount.ipAddress,
    })

    return {
      success: true,
      data: nextAccount,
    }
  } catch (error) {
    logger.error("Failed to trigger IP rotation", error as Error, { userId: user.id })
    return {
      success: false,
      error: "Failed to rotate IP",
    }
  }
}
