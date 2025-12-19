


import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"
import { sendTransactionalEmail } from "@/lib/resend"
import { resend } from "@/lib/resend"
import { env } from "@/lib/env"

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
})

const webhookSecret = env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    logger.error("Stripe webhook signature verification failed", err as Error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  logger.info("Stripe webhook received", { type: event.type })

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        logger.info("Unhandled webhook event type", { type: event.type })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error("Webhook handler error", error as Error, { type: event.type })
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  if (!userId) {
    logger.error("No userId in checkout session metadata")
    return
  }

  // Ensure subscription is a string before retrieving
  if (typeof session.subscription !== 'string') {
    logger.error("Invalid subscription ID in checkout session")
    return
  }

  const subscription = await stripe.subscriptions.retrieve(session.subscription)

  // Create subscription record
  await db.subscription.create({
    data: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    },
  })

  // Determine tier and credits
  const { tier, emailCredits, researchCredits } = getTierFromPriceId(subscription.items.data[0].price.id)

  // Update user
  const user = await db.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: tier,
      subscriptionStatus: "ACTIVE",
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      emailCredits,
      researchCredits,
    },
  })

  // Send welcome emails
  await sendTransactionalEmail({
    to: user.email,
    subject: `Welcome to ReachAI ${tier}!`,
    html: `
      <h1>Welcome to ReachAI ${tier}!</h1>
      <p>Your subscription is now active. You have:</p>
      <ul>
        <li>${emailCredits} email credits</li>
        <li>${researchCredits} research credits</li>
      </ul>
      <p>Start creating campaigns and reaching out to prospects!</p>
    `,
  })

  logger.info("Checkout completed", { userId, tier })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { tier, emailCredits, researchCredits } = getTierFromPriceId(subscription.items.data[0].price.id)

  await db.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    },
  })

  const sub = await db.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
    include: { user: true },
  })

  if (sub) {
    await db.user.update({
      where: { id: sub.userId },
      data: {
        subscriptionTier: tier,
        subscriptionStatus: subscription.status === "active" ? "ACTIVE" : "INACTIVE",
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      },
    })

    logger.info("Subscription updated", { userId: sub.userId, tier })
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const sub = await db.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
    include: { user: true },
  })

  if (sub) {
    await db.user.update({
      where: { id: sub.userId },
      data: {
        subscriptionTier: "FREE",
        subscriptionStatus: "CANCELLED",
        emailCredits: 100,
        researchCredits: 50,
      },
    })

    await sendTransactionalEmail({
      to: sub.user.email,
      subject: "Your ReachAI subscription has been cancelled",
      html: `
        <h1>Subscription Cancelled</h1>
        <p>Your subscription has been cancelled. You've been moved to the FREE plan.</p>
        <p>You can resubscribe anytime from your billing page.</p>
      `,
    })

    logger.info("Subscription deleted", { userId: sub.userId })
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Access subscription property with type assertion
  const invoiceWithSub = invoice as any
  const subscriptionId = typeof invoiceWithSub.subscription === 'string' 
    ? invoiceWithSub.subscription 
    : invoiceWithSub.subscription?.id

  if (!subscriptionId) {
    logger.error("Invalid subscription in invoice")
    return
  }

  const subscription = await db.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
    include: { user: true },
  })

  if (subscription) {
    // Refill credits on successful payment
    const { emailCredits, researchCredits } = getTierFromPriceId(subscription.stripePriceId)

    await db.user.update({
      where: { id: subscription.userId },
      data: {
        emailCredits,
        researchCredits,
        emailsSentThisMonth: 0,
        prospectsThisMonth: 0,
      },
    })

    await resend.sendPaymentSuccessEmail(
      subscription.user.email,
      invoice.amount_paid ?? 0,
      emailCredits,
      "Subscription Payment"
    )

    logger.info("Payment succeeded", { userId: subscription.userId, amount: invoice.amount_paid })
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Access subscription property with type assertion
  const invoiceWithSub = invoice as any
  const subscriptionId = typeof invoiceWithSub.subscription === 'string' 
    ? invoiceWithSub.subscription 
    : invoiceWithSub.subscription?.id

  if (!subscriptionId) {
    logger.error("Invalid subscription in invoice")
    return
  }

  const subscription = await db.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
    include: { user: true },
  })

  if (subscription) {
    await db.user.update({
      where: { id: subscription.userId },
      data: {
        subscriptionStatus: "PAST_DUE",
      },
    })

    await resend.sendPaymentFailedEmail(
      subscription.user.email,
      (invoice as any).last_payment_error?.message || "Payment declined - please update your payment method"
    )

    logger.warn("Payment failed", { userId: subscription.userId, amount: invoice.amount_due })
  }
}

function getTierFromPriceId(priceId: string): {
  tier: "STARTER" | "PRO" | "AGENCY"
  emailCredits: number
  researchCredits: number
} {
  if (priceId.includes("pro")) {
    return { tier: "PRO", emailCredits: 5000, researchCredits: 2500 }
  } else if (priceId.includes("agency")) {
    return { tier: "AGENCY", emailCredits: 20000, researchCredits: 10000 }
  }
  return { tier: "STARTER", emailCredits: 1000, researchCredits: 500 }
}





