"use server"

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import type { CreditType, CreditTransactionType } from "@prisma/client"

export async function createCreditTransaction(
  userId: string,
  type: CreditTransactionType,
  creditType: CreditType,
  amount: number,
  description: string,
  entityType?: string,
  entityId?: string,
  metadata?: any,
) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { emailCredits: true, researchCredits: true },
  })

  if (!user) {
    throw new Error("User not found")
  }

  const balance = creditType === "EMAIL" ? user.emailCredits : user.researchCredits

  const transaction = await db.creditTransaction.create({
    data: {
      userId,
      type,
      creditType,
      amount,
      balance: balance + amount, // New balance after transaction
      description,
      entityType,
      entityId,
      metadata,
    },
  })

  return transaction
}

export async function deductCreditsWithTracking(
  userId: string,
  creditType: CreditType,
  amount: number,
  description: string,
  entityType?: string,
  entityId?: string,
) {
  // Deduct credits and create transaction in a single operation
  const user = await db.user.update({
    where: { id: userId },
    data: {
      [creditType === "EMAIL" ? "emailCredits" : "researchCredits"]: {
        decrement: amount,
      },
    },
    select: {
      emailCredits: true,
      researchCredits: true,
    },
  })

  // Log the transaction
  await createCreditTransaction(
    userId,
    "DEDUCTION",
    creditType,
    -amount, // Negative for deduction
    description,
    entityType,
    entityId,
  )

  return user
}

export async function refundCredits(
  userId: string,
  creditType: CreditType,
  amount: number,
  description: string,
  entityType?: string,
  entityId?: string,
) {
  // Refund credits
  const user = await db.user.update({
    where: { id: userId },
    data: {
      [creditType === "EMAIL" ? "emailCredits" : "researchCredits"]: {
        increment: amount,
      },
    },
    select: {
      emailCredits: true,
      researchCredits: true,
    },
  })

  // Log the refund transaction
  await createCreditTransaction(
    userId,
    "REFUND",
    creditType,
    amount, // Positive for refund
    description,
    entityType,
    entityId,
  )

  return user
}

export async function getCreditTransactions(userId: string, limit = 50) {
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) {
    throw new Error("Unauthorized")
  }

  const user = await db.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  })

  if (!user || user.id !== userId) {
    throw new Error("Unauthorized")
  }

  const transactions = await db.creditTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  })

  return transactions
}
