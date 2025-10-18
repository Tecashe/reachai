"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getUserIntegrations() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      integrations: true,
    },
  })

  if (!user) throw new Error("User not found")

  return user.integrations
}

export async function connectIntegration(type: string, credentials: any) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  await db.integration.upsert({
    where: {
      userId_type: {
        userId: user.id,
        type: type as any,
      },
    },
    create: {
      userId: user.id,
      type: type as any,
      name: type,
      credentials,
      isActive: true,
    },
    update: {
      credentials,
      isActive: true,
      lastSyncedAt: new Date(),
    },
  })

  revalidatePath("/dashboard/integrations")
  return { success: true }
}

export async function disconnectIntegration(integrationId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  await db.integration.delete({
    where: {
      id: integrationId,
      userId: user.id,
    },
  })

  revalidatePath("/dashboard/integrations")
  return { success: true }
}
