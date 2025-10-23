import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { CREDIT_PACKAGES } from "@/lib/constants"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { packageId, creditType, paymentMethodId, cardholderName, country } = await req.json()

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Find the package
    const pkg = CREDIT_PACKAGES[creditType as "email" | "research"].find((p) => p.id === packageId)

    if (!pkg) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 })
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: pkg.price * 100, // Convert to cents
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      description: `${pkg.name} - ${pkg.credits} ${creditType === "email" ? "Email" : "Research"} Credits`,
      metadata: {
        userId: user.id,
        packageId: pkg.id,
        creditType,
        creditAmount: pkg.credits.toString(),
      },
      receipt_email: user.email,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits?success=true`,
    })

    // Create purchase record
    const purchase = await db.creditPurchase.create({
      data: {
        userId: user.id,
        packageId: pkg.id,
        packageName: pkg.name,
        creditType: creditType === "email" ? "EMAIL" : "RESEARCH",
        creditAmount: pkg.credits,
        amount: pkg.price * 100,
        currency: "usd",
        stripeSessionId: paymentIntent.id,
        status: paymentIntent.status === "succeeded" ? "COMPLETED" : "PENDING",
      },
    })

    if (paymentIntent.status === "succeeded") {
      if (creditType === "email") {
        await db.user.update({
          where: { id: user.id },
          data: {
            emailCredits: {
              increment: pkg.credits,
            },
          },
        })
      } else {
        await db.user.update({
          where: { id: user.id },
          data: {
            researchCredits: {
              increment: pkg.credits,
            },
          },
        })
      }

      // Create transaction record
      await db.creditTransaction.create({
        data: {
          userId: user.id,
          type: "PURCHASE",
          creditType: creditType === "email" ? "EMAIL" : "RESEARCH",
          amount: pkg.credits,
          balance: creditType === "email" ? user.emailCredits + pkg.credits : user.researchCredits + pkg.credits,
          description: `Purchased ${pkg.name}`,
          metadata: {
            packageId: pkg.id,
            paymentIntentId: paymentIntent.id,
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    })
  } catch (error: any) {
    console.error("Error processing payment:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
