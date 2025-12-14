"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getUserCredits() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthorized")
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: {
      emailCredits: true,
      researchCredits: true,
      subscriptionTier: true,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  return {
    emailCredits: user.emailCredits,
    researchCredits: user.researchCredits,
    subscriptionTier: user.subscriptionTier,
  }
}

export async function deductResearchCredits(amount: number) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthorized")
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      researchCredits: true,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  if (user.researchCredits < amount) {
    throw new Error("Insufficient research credits")
  }

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      researchCredits: {
        decrement: amount,
      },
    },
    select: {
      researchCredits: true,
    },
  })

  // Log the transaction
  await db.creditTransaction.create({
    data: {
      userId: user.id,
      type: "DEDUCTION",
      creditType: "RESEARCH",
      amount: -amount,
      balance: updatedUser.researchCredits,
      description: `Apollo lead search (${amount} credits)`,
      entityType: "research",
    },
  })

  return {
    success: true,
    remainingCredits: updatedUser.researchCredits,
  }
}