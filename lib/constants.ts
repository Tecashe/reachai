// export const APP_NAME = "ReachAI"
// export const APP_DESCRIPTION = "AI-Powered Cold Email Personalization Platform"
// export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

// // Pricing
// export const PRICING_PLANS = [
//   {
//     tier: "FREE",
//     name: "Free",
//     price: 0,
//     interval: "month",
//     features: [
//       "100 emails/month",
//       "50 prospects/month",
//       "1 campaign",
//       "10 AI credits",
//       "Basic email templates",
//       "Email tracking",
//     ],
//   },
//   {
//     tier: "STARTER",
//     name: "Starter",
//     price: 29,
//     interval: "month",
//     features: [
//       "1,000 emails/month",
//       "500 prospects/month",
//       "5 campaigns",
//       "100 AI credits",
//       "AI research assistant",
//       "Advanced templates",
//       "Email sequences",
//       "Priority support",
//     ],
//     popular: true,
//   },
//   {
//     tier: "PRO",
//     name: "Pro",
//     price: 79,
//     interval: "month",
//     features: [
//       "5,000 emails/month",
//       "2,500 prospects/month",
//       "20 campaigns",
//       "500 AI credits",
//       "Deep AI research",
//       "Competitor intelligence",
//       "A/B testing",
//       "Team collaboration (5 members)",
//       "API access",
//     ],
//   },
//   {
//     tier: "AGENCY",
//     name: "Agency",
//     price: 199,
//     interval: "month",
//     features: [
//       "20,000 emails/month",
//       "10,000 prospects/month",
//       "Unlimited campaigns",
//       "2,000 AI credits",
//       "White-label options",
//       "Dedicated account manager",
//       "Custom integrations",
//       "Team collaboration (20 members)",
//       "Advanced analytics",
//     ],
//   },
// ] as const

// // Email providers
// export const EMAIL_PROVIDERS = [
//   { id: "resend", name: "Resend", icon: "📧" },
//   { id: "gmail", name: "Gmail", icon: "📮" },
//   { id: "outlook", name: "Outlook", icon: "📨" },
// ] as const

// // CRM integrations
// export const CRM_INTEGRATIONS = [
//   { id: "lemlist", name: "Lemlist", icon: "🔗" },
//   { id: "instantly", name: "Instantly", icon: "⚡" },
//   { id: "smartlead", name: "Smartlead", icon: "🎯" },
// ] as const

// // Research depth options
// export const RESEARCH_DEPTH_OPTIONS = [
//   { value: "BASIC", label: "Basic", description: "Company name and website" },
//   { value: "STANDARD", label: "Standard", description: "Company info + recent news" },
//   { value: "DEEP", label: "Deep", description: "Full research with competitor analysis" },
// ] as const

// // Personalization levels
// export const PERSONALIZATION_LEVELS = [
//   { value: "LOW", label: "Low", description: "Basic name and company" },
//   { value: "MEDIUM", label: "Medium", description: "Include job title and industry" },
//   { value: "HIGH", label: "High", description: "Deep personalization with insights" },
//   { value: "ULTRA", label: "Ultra", description: "Maximum personalization with AI research" },
// ] as const

// // Tone of voice options
// export const TONE_OPTIONS = ["professional", "casual", "friendly", "formal", "enthusiastic", "consultative"] as const

export const APP_NAME = "ReachAI"
export const APP_DESCRIPTION = "AI-Powered Cold Email Personalization Platform"
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

// Pricing
export const PRICING_PLANS = [
  {
    tier: "FREE",
    name: "Free",
    price: 0,
    interval: "month",
    features: [
      "100 emails/month",
      "50 prospects/month",
      "1 campaign",
      "10 AI credits",
      "Basic email templates",
      "Email tracking",
    ],
    popular: false,
  },
  {
    tier: "STARTER",
    name: "Starter",
    price: 29,
    interval: "month",
    features: [
      "1,000 emails/month",
      "500 prospects/month",
      "5 campaigns",
      "100 AI credits",
      "AI research assistant",
      "Advanced templates",
      "Email sequences",
      "Priority support",
    ],
    popular: true,
  },
  {
    tier: "PRO",
    name: "Pro",
    price: 79,
    interval: "month",
    features: [
      "5,000 emails/month",
      "2,500 prospects/month",
      "20 campaigns",
      "500 AI credits",
      "Deep AI research",
      "Competitor intelligence",
      "A/B testing",
      "Team collaboration (5 members)",
      "API access",
    ],
    popular: false,
  },
  {
    tier: "AGENCY",
    name: "Agency",
    price: 199,
    interval: "month",
    features: [
      "20,000 emails/month",
      "10,000 prospects/month",
      "Unlimited campaigns",
      "2,000 AI credits",
      "White-label options",
      "Dedicated account manager",
      "Custom integrations",
      "Team collaboration (20 members)",
      "Advanced analytics",
    ],
    popular: false,
  },
] as const

// Email providers
export const EMAIL_PROVIDERS = [
  { id: "resend", name: "Resend", icon: "📧" },
  { id: "gmail", name: "Gmail", icon: "📮" },
  { id: "outlook", name: "Outlook", icon: "📨" },
] as const

// CRM integrations
export const CRM_INTEGRATIONS = [
  { id: "lemlist", name: "Lemlist", icon: "🔗" },
  { id: "instantly", name: "Instantly", icon: "⚡" },
  { id: "smartlead", name: "Smartlead", icon: "🎯" },
] as const

// Research depth options
export const RESEARCH_DEPTH_OPTIONS = [
  { value: "BASIC", label: "Basic", description: "Company name and website" },
  { value: "STANDARD", label: "Standard", description: "Company info + recent news" },
  { value: "DEEP", label: "Deep", description: "Full research with competitor analysis" },
] as const

// Personalization levels
export const PERSONALIZATION_LEVELS = [
  { value: "LOW", label: "Low", description: "Basic name and company" },
  { value: "MEDIUM", label: "Medium", description: "Include job title and industry" },
  { value: "HIGH", label: "High", description: "Deep personalization with insights" },
  { value: "ULTRA", label: "Ultra", description: "Maximum personalization with AI research" },
] as const

// Tone of voice options
export const TONE_OPTIONS = ["professional", "casual", "friendly", "formal", "enthusiastic", "consultative"] as const
