import type { User, Campaign, Prospect, EmailTemplate, EmailLog, Analytics } from "@prisma/client"

// Extended types with relations 
export type UserWithRelations = User & {
  campaigns?: Campaign[]
  prospects?: Prospect[]
  emailTemplates?: EmailTemplate[]
}

export type CampaignWithRelations = Campaign & {
  prospects?: Prospect[]
  emailSequences?: any[]
  analytics?: Analytics[]
}

export type ProspectWithRelations = Prospect & {
  campaign?: Campaign
  emailLogs?: EmailLog[]
}

// API Response types
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Dashboard stats
export type DashboardStats = {
  totalCampaigns: number
  activeCampaigns: number
  totalProspects: number
  emailsSentThisMonth: number
  avgOpenRate: number
  avgReplyRate: number
  recentActivity: any[]
}

// Campaign stats
export type CampaignStats = {
  totalProspects: number
  emailsSent: number
  deliveryRate: number
  openRate: number
  clickRate: number
  replyRate: number
  bounceRate: number
}

// Subscription limits
export const SUBSCRIPTION_LIMITS = {
  FREE: {
    emailsPerMonth: 100,
    prospectsPerMonth: 50,
    campaigns: 1,
    aiCredits: 10,
    teamMembers: 1,
  },
  STARTER: {
    emailsPerMonth: 1000,
    prospectsPerMonth: 500,
    campaigns: 5,
    aiCredits: 100,
    teamMembers: 2,
  },
  PRO: {
    emailsPerMonth: 5000,
    prospectsPerMonth: 2500,
    campaigns: 20,
    aiCredits: 500,
    teamMembers: 5,
  },
  AGENCY: {
    emailsPerMonth: 20000,
    prospectsPerMonth: 10000,
    campaigns: -1, // unlimited
    aiCredits: 2000,
    teamMembers: 20,
  },
} as const

export type SubscriptionLimits = (typeof SUBSCRIPTION_LIMITS)[keyof typeof SUBSCRIPTION_LIMITS]
