
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
  domainId?: string
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  if (data.domainId) {
    const domain = await db.domain.findUnique({
      where: { id: data.domainId, userId: user.id },
    })

    if (!domain) {
      throw new Error("Domain not found")
    }

    if (!domain.isVerified) {
      throw new Error("Domain must be verified before adding sending accounts. Please complete DNS verification first.")
    }
  }

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
      domainId: data.domainId,
    },
  })

  revalidatePath("/dashboard/settings")
  revalidatePath("/dashboard/deliverability")
  return { success: true, accountId: account.id }
}

export async function getSendingAccounts() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const accounts = await db.sendingAccount.findMany({
    where: { userId: user.id },
    include: {
      domain: {
        select: {
          id: true,
          domain: true,
          isVerified: true,
          healthScore: true,
        },
      },
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
  revalidatePath("/dashboard/deliverability")
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
  revalidatePath("/dashboard/deliverability")
  return { success: true }
}
