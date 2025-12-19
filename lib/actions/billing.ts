
"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { stripe } from "@/lib/stripe"

export async function getUserSubscription() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { subscription: true },
  })

  if (!user) throw new Error("User not found")

  return {
    tier: user.subscriptionTier,
    status: user.subscriptionStatus,
    currentPeriodEnd: user.currentPeriodEnd,
    subscription: user.subscription,
  }
}

export async function getBillingHistory() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { subscription: true },
  })

  if (!user) throw new Error("User not found")

  // Fetch real invoices from Stripe
  if (user.subscription?.stripeCustomerId) {
    try {
      const invoices = await stripe.invoices.list({
        customer: user.subscription.stripeCustomerId,
        limit: 12,
      })

      return invoices.data.map((invoice) => ({
        id: invoice.id,
        date: new Date(invoice.created * 1000),
        amount: invoice.amount_paid,
        status: invoice.status as "paid" | "open" | "void" | "uncollectible",
        invoiceUrl: invoice.hosted_invoice_url,
      }))
    } catch (error) {
      console.error("[builtbycashe] Failed to fetch Stripe invoices:", error)
    }
  }

  // If no Stripe data, return empty array
  return []
}

export async function cancelSubscription() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  // In production, cancel via Stripe
  await db.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: "CANCELLED",
    },
  })

  revalidatePath("/dashboard/billing")
  return { success: true }
}
