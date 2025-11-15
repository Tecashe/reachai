"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getWarmupStats() {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return {
        avgHealthScore: 0,
        activeAccounts: 0,
        avgInboxRate: 0,
      }
    }

    const accounts = await db.sendingAccount.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      select: {
        healthScore: true,
        openRate: true,
        warmupStage: true,
      },
    })

    if (accounts.length === 0) {
      return {
        avgHealthScore: 0,
        activeAccounts: 0,
        avgInboxRate: 0,
      }
    }

    // Calculate average health score
    const totalHealth = accounts.reduce((sum, acc) => sum + acc.healthScore, 0)
    const avgHealthScore = Math.round(totalHealth / accounts.length)

    // Calculate average inbox rate from open rates
    const totalInboxRate = accounts.reduce((sum, acc) => sum + acc.openRate, 0)
    const avgInboxRate = Math.round(totalInboxRate / accounts.length)

    return {
      avgHealthScore,
      activeAccounts: accounts.length,
      avgInboxRate,
    }
  } catch (error) {
    console.error("[v0] Error getting warmup stats:", error)
    return {
      avgHealthScore: 0,
      activeAccounts: 0,
      avgInboxRate: 0,
    }
  }
}
