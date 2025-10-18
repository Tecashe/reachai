import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
  typescript: true,
})

export const STRIPE_PLANS = {
  STARTER: {
    name: "Starter",
    price: 29,
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    features: [
      "1,000 emails/month",
      "500 AI research credits",
      "Basic personalization",
      "Email tracking",
      "CSV import",
    ],
  },
  PRO: {
    name: "Pro",
    price: 79,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      "5,000 emails/month",
      "2,500 AI research credits",
      "Advanced personalization",
      "Email sequences",
      "A/B testing",
      "Priority support",
    ],
  },
  AGENCY: {
    name: "Agency",
    price: 199,
    priceId: process.env.STRIPE_AGENCY_PRICE_ID!,
    features: [
      "20,000 emails/month",
      "10,000 AI research credits",
      "Ultra personalization",
      "Team collaboration",
      "White-label options",
      "Dedicated support",
      "API access",
    ],
  },
}
