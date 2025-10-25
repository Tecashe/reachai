export const RESEARCH_LIMITS = {
  FREE: {
    maxProspectsPerBatch: 10,
    maxConcurrentResearch: 3,
  },
  STARTER: {
    maxProspectsPerBatch: 50,
    maxConcurrentResearch: 5,
  },
  PRO: {
    maxProspectsPerBatch: 100,
    maxConcurrentResearch: 10,
  },
  AGENCY: {
    maxProspectsPerBatch: 500,
    maxConcurrentResearch: 15,
  },
} as const

export type SubscriptionTier = keyof typeof RESEARCH_LIMITS

export function getResearchLimits(tier: SubscriptionTier) {
  return RESEARCH_LIMITS[tier] || RESEARCH_LIMITS.FREE
}
