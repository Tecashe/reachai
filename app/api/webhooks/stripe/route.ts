import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { db } from "@/lib/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("[v0] Stripe webhook error:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

    await db.subscription.create({
      data: {
        userId: session.metadata?.userId!,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        // stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        stripeCurrentPeriodEnd: new Date(),
      },
    })

    // Update user subscription tier based on price
    const priceId = subscription.items.data[0].price.id
    let tier: "STARTER" | "PRO" | "AGENCY" = "STARTER"
    let emailCredits = 1000
    let researchCredits = 500

    if (priceId.includes("pro")) {
      tier = "PRO"
      emailCredits = 5000
      researchCredits = 2500
    } else if (priceId.includes("agency")) {
      tier = "AGENCY"
      emailCredits = 20000
      researchCredits = 10000
    }

    await db.user.update({
      where: { id: session.metadata?.userId! },
      data: {
        subscriptionTier: tier,
        subscriptionStatus: "ACTIVE",
        emailCredits,
        researchCredits,
      },
    })
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

    await db.subscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        // stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        stripeCurrentPeriodEnd: new Date(),
      },
    })
  }

  return NextResponse.json({ received: true })
}

