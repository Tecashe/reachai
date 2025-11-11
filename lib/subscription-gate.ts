// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { getCurrentUser } from "@/lib/actions/auth"
// import { PRICING_PLANS } from "@/lib/constants"

// export type FeatureLimit = {
//   allowed: boolean
//   limit: number
//   current: number
//   tier: string
//   message?: string
// }

// export async function checkFeatureAccess(feature: string): Promise<FeatureLimit> {
//   const { userId } = await auth()

//   if (!userId) {
//     return {
//       allowed: false,
//       limit: 0,
//       current: 0,
//       tier: "NONE",
//       message: "Please sign in to access this feature",
//     }
//   }

//   const user = await getCurrentUser(userId)

//   if (!user) {
//     return {
//       allowed: false,
//       limit: 0,
//       current: 0,
//       tier: "NONE",
//       message: "User not found",
//     }
//   }

//   const tier = user.subscriptionTier
//   const plan = PRICING_PLANS.find((p) => p.tier === tier)

//   // Define feature limits per tier
//   const limits: Record<string, Record<string, number>> = {
//     FREE: {
//       campaigns: 1,
//       prospects: 50,
//       emails: 100,
//       aiCredits: 10,
//       sequences: 1,
//       templates: 5,
//       teamMembers: 1,
//     },
//     STARTER: {
//       campaigns: 5,
//       prospects: 500,
//       emails: 1000,
//       aiCredits: 100,
//       sequences: 5,
//       templates: 20,
//       teamMembers: 1,
//     },
//     PRO: {
//       campaigns: 20,
//       prospects: 2500,
//       emails: 5000,
//       aiCredits: 500,
//       sequences: 20,
//       templates: 100,
//       teamMembers: 5,
//     },
//     AGENCY: {
//       campaigns: 999999,
//       prospects: 10000,
//       emails: 20000,
//       aiCredits: 2000,
//       sequences: 999999,
//       templates: 999999,
//       teamMembers: 20,
//     },
//   }

//   const tierLimits = limits[tier] || limits.FREE
//   const limit = tierLimits[feature] || 0

//   // Get current usage
//   let current = 0
//   switch (feature) {
//     case "campaigns":
//       current = await getCampaignCount(userId)
//       break
//     case "prospects":
//       current = user.prospectsThisMonth
//       break
//     case "emails":
//       current = user.emailsSentThisMonth
//       break
//     case "aiCredits":
//       current = user.aiCreditsUsed
//       break
//     case "sequences":
//       current = await getSequenceCount(userId)
//       break
//     case "templates":
//       current = await getTemplateCount(userId)
//       break
//     case "teamMembers":
//       current = await getTeamMemberCount(userId)
//       break
//   }

//   const allowed = current < limit

//   return {
//     allowed,
//     limit,
//     current,
//     tier,
//     message: allowed ? undefined : `You've reached your ${tier} plan limit. Upgrade to continue.`,
//   }
// }

// async function getCampaignCount(userId: string): Promise<number> {
//   const { db } = await import("@/lib/db")
//   return await db.campaign.count({ where: { userId } })
// }

// async function getSequenceCount(userId: string): Promise<number> {
//   const { db } = await import("@/lib/db")
//   const campaigns = await db.campaign.findMany({
//     where: { userId },
//     include: { emailSequences: true },
//   })
//   return campaigns.reduce((sum, c) => sum + c.emailSequences.length, 0)
// }

// async function getTemplateCount(userId: string): Promise<number> {
//   const { db } = await import("@/lib/db")
//   return await db.emailTemplate.count({ where: { userId } })
// }

// async function getTeamMemberCount(userId: string): Promise<number> {
//   const { db } = await import("@/lib/db")
//   return await db.teamMember.count({ where: { userId, status: "ACCEPTED" } })
// }

"use server"

import { auth } from "@clerk/nextjs/server"
import { getCurrentUser } from "@/lib/actions/auth"
import { PRICING_PLANS } from "@/lib/constants"

export type FeatureLimit = {
  allowed: boolean
  limit: number
  current: number
  tier: string
  message?: string
}

export async function checkFeatureAccess(feature: string): Promise<FeatureLimit> {
  const { userId } = await auth()

  if (!userId) {
    return {
      allowed: false,
      limit: 0,
      current: 0,
      tier: "NONE",
      message: "Please sign in to access this feature",
    }
  }

  const user = await getCurrentUser(userId)

  if (!user) {
    return {
      allowed: false,
      limit: 0,
      current: 0,
      tier: "NONE",
      message: "User not found",
    }
  }

  const tier = user.subscriptionTier
  const plan = PRICING_PLANS.find((p) => p.tier === tier)

  // Define feature limits per tier
  const limits: Record<string, Record<string, number>> = {
    FREE: {
      campaigns: 1,
      prospects: 50,
      emails: 100,
      aiCredits: 10,
      sequences: 1,
      templates: 5,
      teamMembers: 1,
    },
    STARTER: {
      campaigns: 5,
      prospects: 500,
      emails: 1000,
      aiCredits: 100,
      sequences: 5,
      templates: 20,
      teamMembers: 1,
    },
    PRO: {
      campaigns: 20,
      prospects: 2500,
      emails: 5000,
      aiCredits: 500,
      sequences: 20,
      templates: 100,
      teamMembers: 5,
    },
    AGENCY: {
      campaigns: 999999,
      prospects: 10000,
      emails: 20000,
      aiCredits: 2000,
      sequences: 999999,
      templates: 999999,
      teamMembers: 20,
    },
  }

  const tierLimits = limits[tier] || limits.FREE
  const limit = tierLimits[feature] || 0

  // Get current usage
  let current = 0
  switch (feature) {
    case "campaigns":
      current = await getCampaignCount(userId)
      break
    case "prospects":
      current = user.prospectsThisMonth
      break
    case "emails":
      current = user.emailsSentThisMonth
      break
    case "aiCredits":
      current = user.aiCreditsUsed
      break
    case "sequences":
      current = await getSequenceCount(userId)
      break
    case "templates":
      current = await getTemplateCount(userId)
      break
    case "teamMembers":
      current = await getTeamMemberCount(userId)
      break
  }

  const allowed = current < limit

  return {
    allowed,
    limit,
    current,
    tier,
    message: allowed ? undefined : `You've reached your ${tier} plan limit. Upgrade to continue.`,
  }
}

export async function checkSubscriptionGate(userId: string, allowedTiers: string[]): Promise<boolean> {
  try {
    const user = await getCurrentUser(userId)
    if (!user) return false
    return allowedTiers.includes(user.subscriptionTier)
  } catch (error) {
    console.error("[builtbycashe] Subscription gate error:", error)
    return false
  }
}

async function getCampaignCount(userId: string): Promise<number> {
  const { db } = await import("@/lib/db")
  return await db.campaign.count({ where: { userId } })
}

async function getSequenceCount(userId: string): Promise<number> {
  const { db } = await import("@/lib/db")
  const campaigns = await db.campaign.findMany({
    where: { userId },
    include: { emailSequences: true },
  })
  return campaigns.reduce((sum, c) => sum + c.emailSequences.length, 0)
}

async function getTemplateCount(userId: string): Promise<number> {
  const { db } = await import("@/lib/db")
  return await db.emailTemplate.count({ where: { userId } })
}

async function getTeamMemberCount(userId: string): Promise<number> {
  const { db } = await import("@/lib/db")
  return await db.teamMember.count({ where: { userId, status: "ACCEPTED" } })
}
