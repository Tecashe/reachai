"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "../db"
import { revalidatePath } from "next/cache"

export async function createSendingAccount(data: {
  name: string
  email: string
  provider: string
  apiKey: string
  dailyLimit?: number
  hourlyLimit?: number
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  // Encrypt credentials (in production, use proper encryption)
  const credentials = {
    apiKey: data.apiKey,
    provider: data.provider,
  }

  const account = await db.sendingAccount.create({
    data: {
      userId: user.id,
      name: data.name,
      email: data.email,
      provider: data.provider,
      credentials,
      dailyLimit: data.dailyLimit || 50,
      hourlyLimit: data.hourlyLimit || 10,
    },
  })

  revalidatePath("/dashboard/settings")
  return { success: true, accountId: account.id }
}

export async function getSendingAccounts() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const accounts = await db.sendingAccount.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      provider: true,
      dailyLimit: true,
      hourlyLimit: true,
      emailsSentToday: true,
      emailsSentThisHour: true,
      warmupEnabled: true,
      warmupStage: true,
      warmupDailyLimit: true,
      isActive: true,
      bounceRate: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return accounts
}

export async function deleteSendingAccount(accountId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  await db.sendingAccount.delete({
    where: {
      id: accountId,
      userId: user.id,
    },
  })

  revalidatePath("/dashboard/settings")
  return { success: true }
}

export async function toggleSendingAccount(accountId: string, isActive: boolean) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  await db.sendingAccount.update({
    where: {
      id: accountId,
      userId: user.id,
    },
    data: { isActive },
  })

  revalidatePath("/dashboard/settings")
  return { success: true }
}
