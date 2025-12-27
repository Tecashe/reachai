
// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "../db"
// import { revalidatePath } from "next/cache"

// export async function createSendingAccount(data: {
//   name: string
//   email: string
//   provider: string
//   apiKey: string
//   dailyLimit?: number
//   hourlyLimit?: number
//   domainId?: string
// }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   if (data.domainId) {
//     const domain = await db.domain.findUnique({
//       where: { id: data.domainId, userId: user.id },
//     })

//     if (!domain) {
//       throw new Error("Domain not found")
//     }

//     if (!domain.isVerified) {
//       throw new Error("Domain must be verified before adding sending accounts. Please complete DNS verification first.")
//     }
//   }

//   // Encrypt credentials (in production, use proper encryption)
//   const credentials = {
//     apiKey: data.apiKey,
//     provider: data.provider,
//   }

//   const account = await db.sendingAccount.create({
//     data: {
//       userId: user.id,
//       name: data.name,
//       email: data.email,
//       provider: data.provider,
//       credentials,
//       dailyLimit: data.dailyLimit || 50,
//       hourlyLimit: data.hourlyLimit || 10,
//       domainId: data.domainId,
//     },
//   })

//   revalidatePath("/dashboard/settings")
//   revalidatePath("/dashboard/deliverability")
//   return { success: true, accountId: account.id }
// }

// export async function getSendingAccounts() {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const accounts = await db.sendingAccount.findMany({
//     where: { userId: user.id },
//     include: {
//       domain: {
//         select: {
//           id: true,
//           domain: true,
//           isVerified: true,
//           healthScore: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   return accounts
// }

// export async function deleteSendingAccount(accountId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await db.sendingAccount.delete({
//     where: {
//       id: accountId,
//       userId: user.id,
//     },
//   })

//   revalidatePath("/dashboard/settings")
//   revalidatePath("/dashboard/deliverability")
//   return { success: true }
// }

// export async function toggleSendingAccount(accountId: string, isActive: boolean) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   await db.sendingAccount.update({
//     where: {
//       id: accountId,
//       userId: user.id,
//     },
//     data: { isActive },
//   })

//   revalidatePath("/dashboard/settings")
//   revalidatePath("/dashboard/deliverability")
//   return { success: true }
// }

//THIS IS THE NEW SENDING ACCOUNTS FILE AS OF FROM NOT USING GMAIL API

// lib/actions/sending-accounts.ts
"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { accountHealthMonitor } from "@/lib/services/email/account-health-monitor"
import { revalidatePath } from "next/cache"

/**
 * Get all sending accounts for current user
 */
export async function getSendingAccounts() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { error: "Unauthorized" }
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { error: "User not found" }
    }

    const accounts = await db.sendingAccount.findMany({
      where: { userId: user.id },
      orderBy: [
        { isActive: "desc" },
        { healthScore: "desc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        name: true,
        email: true,
        provider: true,
        isActive: true,
        healthScore: true,
        warmupEnabled: true,
        warmupStage: true,
        warmupDailyLimit: true,
        dailyLimit: true,
        hourlyLimit: true,
        emailsSentToday: true,
        emailsSentThisHour: true,
        bounceRate: true,
        spamComplaintRate: true,
        replyRate: true,
        openRate: true,
        lastHealthCheck: true,
        pausedReason: true,
        pausedAt: true,
        createdAt: true,
      },
    })

    return { accounts }
  } catch (error) {
    console.error("[Action] Get sending accounts error:", error)
    return { error: "Failed to fetch sending accounts" }
  }
}

/**
 * Delete sending account
 */
export async function deleteSendingAccount(accountId: string) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { error: "Unauthorized" }
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { error: "User not found" }
    }

    // Verify ownership
    const account = await db.sendingAccount.findFirst({
      where: {
        id: accountId,
        userId: user.id,
      },
    })

    if (!account) {
      return { error: "Account not found or access denied" }
    }

    // Delete account
    await db.sendingAccount.delete({
      where: { id: accountId },
    })

    // Log action
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "sending_account.deleted",
        entityType: "sending_account",
        entityId: accountId,
        metadata: {
          email: account.email,
          provider: account.provider,
        },
      },
    })

    revalidatePath("/dashboard/settings")

    return { success: true }
  } catch (error) {
    console.error("[Action] Delete sending account error:", error)
    return { error: "Failed to delete sending account" }
  }
}

/**
 * Toggle sending account active status
 */
export async function toggleSendingAccount(accountId: string, isActive: boolean) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { error: "Unauthorized" }
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { error: "User not found" }
    }

    // Verify ownership
    const account = await db.sendingAccount.findFirst({
      where: {
        id: accountId,
        userId: user.id,
      },
    })

    if (!account) {
      return { error: "Account not found or access denied" }
    }

    // Update account
    await db.sendingAccount.update({
      where: { id: accountId },
      data: {
        isActive,
        pausedReason: isActive ? null : "Manually paused by user",
        pausedAt: isActive ? null : new Date(),
      },
    })

    // Log action
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: isActive ? "sending_account.activated" : "sending_account.paused",
        entityType: "sending_account",
        entityId: accountId,
        metadata: {
          email: account.email,
        },
      },
    })

    revalidatePath("/dashboard/settings")

    return { success: true }
  } catch (error) {
    console.error("[Action] Toggle sending account error:", error)
    return { error: "Failed to toggle sending account" }
  }
}

/**
 * Run health check on specific account
 */
export async function runAccountHealthCheck(accountId: string) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { error: "Unauthorized" }
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { error: "User not found" }
    }

    // Verify ownership
    const account = await db.sendingAccount.findFirst({
      where: {
        id: accountId,
        userId: user.id,
      },
    })

    if (!account) {
      return { error: "Account not found or access denied" }
    }

    // Run health check
    await accountHealthMonitor.runHealthCheck(accountId)

    // Get updated account
    const updatedAccount = await db.sendingAccount.findUnique({
      where: { id: accountId },
      select: {
        healthScore: true,
        bounceRate: true,
        spamComplaintRate: true,
        replyRate: true,
        openRate: true,
        isActive: true,
        pausedReason: true,
        lastHealthCheck: true,
      },
    })

    revalidatePath("/dashboard/settings")

    return { success: true, account: updatedAccount }
  } catch (error) {
    console.error("[Action] Health check error:", error)
    return { error: "Failed to run health check" }
  }
}

/**
 * Update account limits
 */
export async function updateAccountLimits(
  accountId: string,
  dailyLimit: number,
  hourlyLimit: number
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { error: "Unauthorized" }
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { error: "User not found" }
    }

    // Verify ownership
    const account = await db.sendingAccount.findFirst({
      where: {
        id: accountId,
        userId: user.id,
      },
    })

    if (!account) {
      return { error: "Account not found or access denied" }
    }

    // Validate limits
    if (dailyLimit < 1 || hourlyLimit < 1) {
      return { error: "Limits must be at least 1" }
    }

    if (hourlyLimit > dailyLimit) {
      return { error: "Hourly limit cannot exceed daily limit" }
    }

    // Update account
    await db.sendingAccount.update({
      where: { id: accountId },
      data: {
        dailyLimit,
        hourlyLimit,
      },
    })

    revalidatePath("/dashboard/settings")

    return { success: true }
  } catch (error) {
    console.error("[Action] Update account limits error:", error)
    return { error: "Failed to update account limits" }
  }
}

/**
 * Toggle warmup for account
 */
export async function toggleAccountWarmup(accountId: string, enabled: boolean) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { error: "Unauthorized" }
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { error: "User not found" }
    }

    // Verify ownership
    const account = await db.sendingAccount.findFirst({
      where: {
        id: accountId,
        userId: user.id,
      },
    })

    if (!account) {
      return { error: "Account not found or access denied" }
    }

    // Update account
    await db.sendingAccount.update({
      where: { id: accountId },
      data: {
        warmupEnabled: enabled,
        warmupStartDate: enabled ? new Date() : account.warmupStartDate,
      },
    })

    revalidatePath("/dashboard/settings")

    return { success: true }
  } catch (error) {
    console.error("[Action] Toggle warmup error:", error)
    return { error: "Failed to toggle warmup" }
  }
}