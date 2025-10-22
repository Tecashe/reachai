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













// import { headers } from "next/headers"
// import { NextResponse } from "next/server"
// import Stripe from "stripe"
// import { db } from "@/lib/db"
// import { logger } from "@/lib/logger"
// import { sendTransactionalEmail } from "@/lib/resend"
// import { env } from "@/lib/env"

// const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
//   apiVersion: "2025-09-30.clover",
// })

// const webhookSecret = env.STRIPE_WEBHOOK_SECRET

// export async function POST(req: Request) {
//   const body = await req.text()
//   const headersList = await headers()
//   const signature = headersList.get("stripe-signature")!

//   let event: Stripe.Event

//   try {
//     event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
//   } catch (err) {
//     logger.error("Stripe webhook signature verification failed", err as Error)
//     return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
//   }

//   logger.info("Stripe webhook received", { type: event.type })

//   try {
//     switch (event.type) {
//       case "checkout.session.completed": {
//         const session = event.data.object as Stripe.Checkout.Session
//         await handleCheckoutCompleted(session)
//         break
//       }

//       case "customer.subscription.updated": {
//         const subscription = event.data.object as Stripe.Subscription
//         await handleSubscriptionUpdated(subscription)
//         break
//       }

//       case "customer.subscription.deleted": {
//         const subscription = event.data.object as Stripe.Subscription
//         await handleSubscriptionDeleted(subscription)
//         break
//       }

//       case "invoice.payment_succeeded": {
//         const invoice = event.data.object as Stripe.Invoice
//         await handlePaymentSucceeded(invoice)
//         break
//       }

//       case "invoice.payment_failed": {
//         const invoice = event.data.object as Stripe.Invoice
//         await handlePaymentFailed(invoice)
//         break
//       }

//       default:
//         logger.info("Unhandled webhook event type", { type: event.type })
//     }

//     return NextResponse.json({ received: true })
//   } catch (error) {
//     logger.error("Webhook handler error", error as Error, { type: event.type })
//     return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
//   }
// }

// async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
//   const userId = session.metadata?.userId
//   if (!userId) {
//     logger.error("No userId in checkout session metadata")
//     return
//   }

//   const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

//   // Create subscription record
//   await db.subscription.create({
//     data: {
//       userId,
//       stripeSubscriptionId: subscription.id,
//       stripeCustomerId: subscription.customer as string,
//       stripePriceId: subscription.items.data[0].price.id,
//       stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
//     },
//   })

//   // Determine tier and credits
//   const { tier, emailCredits, researchCredits } = getTierFromPriceId(subscription.items.data[0].price.id)

//   // Update user
//   const user = await db.user.update({
//     where: { id: userId },
//     data: {
//       subscriptionTier: tier,
//       subscriptionStatus: "ACTIVE",
//       currentPeriodEnd: new Date(subscription.current_period_end * 1000),
//       emailCredits,
//       researchCredits,
//     },
//   })

//   // Send welcome email
//   await sendTransactionalEmail({
//     to: user.email,
//     subject: `Welcome to ReachAI ${tier}!`,
//     html: `
//       <h1>Welcome to ReachAI ${tier}!</h1>
//       <p>Your subscription is now active. You have:</p>
//       <ul>
//         <li>${emailCredits} email credits</li>
//         <li>${researchCredits} research credits</li>
//       </ul>
//       <p>Start creating campaigns and reaching out to prospects!</p>
//     `,
//   })

//   logger.info("Checkout completed", { userId, tier })
// }

// async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
//   const { tier, emailCredits, researchCredits } = getTierFromPriceId(subscription.items.data[0].price.id)

//   await db.subscription.update({
//     where: { stripeSubscriptionId: subscription.id },
//     data: {
//       stripePriceId: subscription.items.data[0].price.id,
//       stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
//     },
//   })

//   const sub = await db.subscription.findUnique({
//     where: { stripeSubscriptionId: subscription.id },
//     include: { user: true },
//   })

//   if (sub) {
//     await db.user.update({
//       where: { id: sub.userId },
//       data: {
//         subscriptionTier: tier,
//         subscriptionStatus: subscription.status === "active" ? "ACTIVE" : "INACTIVE",
//         currentPeriodEnd: new Date(subscription.current_period_end * 1000),
//       },
//     })

//     logger.info("Subscription updated", { userId: sub.userId, tier })
//   }
// }

// async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
//   const sub = await db.subscription.findUnique({
//     where: { stripeSubscriptionId: subscription.id },
//     include: { user: true },
//   })

//   if (sub) {
//     await db.user.update({
//       where: { id: sub.userId },
//       data: {
//         subscriptionTier: "FREE",
//         subscriptionStatus: "CANCELLED",
//         emailCredits: 100,
//         researchCredits: 50,
//       },
//     })

//     await sendTransactionalEmail({
//       to: sub.user.email,
//       subject: "Your ReachAI subscription has been cancelled",
//       html: `
//         <h1>Subscription Cancelled</h1>
//         <p>Your subscription has been cancelled. You've been moved to the FREE plan.</p>
//         <p>You can resubscribe anytime from your billing page.</p>
//       `,
//     })

//     logger.info("Subscription deleted", { userId: sub.userId })
//   }
// }

// async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
//   const subscription = await db.subscription.findUnique({
//     where: { stripeSubscriptionId: invoice.subscription as string },
//     include: { user: true },
//   })

//   if (subscription) {
//     // Refill credits on successful payment
//     const { emailCredits, researchCredits } = getTierFromPriceId(subscription.stripePriceId)

//     await db.user.update({
//       where: { id: subscription.userId },
//       data: {
//         emailCredits,
//         researchCredits,
//         emailsSentThisMonth: 0,
//         prospectsThisMonth: 0,
//       },
//     })

//     await sendTransactionalEmail({
//       to: subscription.user.email,
//       subject: "Payment successful - Credits refilled",
//       html: `
//         <h1>Payment Successful</h1>
//         <p>Your payment of $${(invoice.amount_paid / 100).toFixed(2)} was successful.</p>
//         <p>Your credits have been refilled:</p>
//         <ul>
//           <li>${emailCredits} email credits</li>
//           <li>${researchCredits} research credits</li>
//         </ul>
//       `,
//     })

//     logger.info("Payment succeeded", { userId: subscription.userId, amount: invoice.amount_paid })
//   }
// }

// async function handlePaymentFailed(invoice: Stripe.Invoice) {
//   const subscription = await db.subscription.findUnique({
//     where: { stripeSubscriptionId: invoice.subscription as string },
//     include: { user: true },
//   })

//   if (subscription) {
//     await db.user.update({
//       where: { id: subscription.userId },
//       data: {
//         subscriptionStatus: "PAST_DUE",
//       },
//     })

//     await sendTransactionalEmail({
//       to: subscription.user.email,
//       subject: "Payment failed - Action required",
//       html: `
//         <h1>Payment Failed</h1>
//         <p>We couldn't process your payment of $${(invoice.amount_due / 100).toFixed(2)}.</p>
//         <p>Please update your payment method to continue using ReachAI.</p>
//         <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard/billing">Update Payment Method</a>
//       `,
//     })

//     logger.warn("Payment failed", { userId: subscription.userId, amount: invoice.amount_due })
//   }
// }

// function getTierFromPriceId(priceId: string): {
//   tier: "STARTER" | "PRO" | "AGENCY"
//   emailCredits: number
//   researchCredits: number
// } {
//   if (priceId.includes("pro")) {
//     return { tier: "PRO", emailCredits: 5000, researchCredits: 2500 }
//   } else if (priceId.includes("agency")) {
//     return { tier: "AGENCY", emailCredits: 20000, researchCredits: 10000 }
//   }
//   return { tier: "STARTER", emailCredits: 1000, researchCredits: 500 }
// }
