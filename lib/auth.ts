

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getCurrentUser() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      subscription: true,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  return user
}

export async function getCurrentUserFromDb() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      subscription: true,
    },
  })

  return user
}

export async function requireAuth() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  return userId
}
