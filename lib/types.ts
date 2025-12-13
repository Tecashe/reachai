// import type { User, Campaign, Prospect, EmailTemplate, EmailLog, Analytics } from "@prisma/client"

// // Extended types with relations 
// export type UserWithRelations = User & {
//   campaigns?: Campaign[]
//   prospects?: Prospect[]
//   emailTemplates?: EmailTemplate[]
// }

// export type CampaignWithRelations = Campaign & {
//   prospects?: Prospect[]
//   emailSequences?: any[]
//   analytics?: Analytics[]
// }

// export type ProspectWithRelations = Prospect & {
//   campaign?: Campaign
//   emailLogs?: EmailLog[]
// }

// // API Response types
// export type ApiResponse<T = any> = {
//   success: boolean
//   data?: T
//   error?: string
//   message?: string
// }

// // Dashboard stats
// export type DashboardStats = {
//   totalCampaigns: number
//   activeCampaigns: number
//   totalProspects: number
//   emailsSentThisMonth: number
//   avgOpenRate: number
//   avgReplyRate: number
//   recentActivity: any[]
// }

// // Campaign stats
// export type CampaignStats = {
//   totalProspects: number
//   emailsSent: number
//   deliveryRate: number
//   openRate: number
//   clickRate: number
//   replyRate: number
//   bounceRate: number
// }

// // Subscription limits
// export const SUBSCRIPTION_LIMITS = {
//   FREE: {
//     emailsPerMonth: 100,
//     prospectsPerMonth: 50,
//     campaigns: 1,
//     aiCredits: 10,
//     teamMembers: 1,
//   },
//   STARTER: {
//     emailsPerMonth: 1000,
//     prospectsPerMonth: 500,
//     campaigns: 5,
//     aiCredits: 100,
//     teamMembers: 2,
//   },
//   PRO: {
//     emailsPerMonth: 5000,
//     prospectsPerMonth: 2500,
//     campaigns: 20,
//     aiCredits: 500,
//     teamMembers: 5,
//   },
//   AGENCY: {
//     emailsPerMonth: 20000,
//     prospectsPerMonth: 10000,
//     campaigns: -1, // unlimited
//     aiCredits: 2000,
//     teamMembers: 20,
//   },
// } as const

// export type SubscriptionLimits = (typeof SUBSCRIPTION_LIMITS)[keyof typeof SUBSCRIPTION_LIMITS]



// //new types





// export type TemplateType = 'TEXT' | 'VISUAL' | 'HTML'

// export type BlockType = 
//   | 'HEADER'
//   | 'PARAGRAPH'
//   | 'IMAGE'
//   | 'BUTTON'
//   | 'DIVIDER'
//   | 'SIGNATURE'
//   | 'PERSONALIZATION'
//   | 'SOCIAL_LINKS'
//   | 'SPACER'
//   | 'COLUMNS'
//   | 'LIST'
//   | 'QUOTE'
//   | 'CODE'

// export interface ColorScheme {
//   primary: string
//   secondary: string
//   accent: string
//   background?: string
//   text?: string
// }

// export interface TemplateVariable {
//   name: string
//   required: boolean
//   defaultValue?: string
//   description?: string
//   example?: string
// }

// export interface TemplateBlock {
//   id: string
//   type: BlockType
//   order: number
//   content: Record<string, any>
//   styling?: {
//     backgroundColor?: string
//     textColor?: string
//     fontSize?: string
//     padding?: string
//     margin?: string
//     alignment?: 'left' | 'center' | 'right'
//     [key: string]: any
//   }
//   config?: Record<string, any>
// }

// export interface EditorBlocks {
//   version: string
//   blocks: TemplateBlock[]
// }

// export interface TemplateCategory {
//   id: string
//   name: string
//   slug: string
//   description?: string
//   icon?: string
//   color: string
//   order: number
//   industry?: string
//   createdAt: Date
//   updatedAt: Date
// }

// export interface EnhancedEmailTemplate {
//   id: string
//   userId: string
//   name: string
//   description?: string
//   category?: string
  
//   subject: string
//   body: string
  
//   // Visual enhancements
//   thumbnailUrl?: string
//   previewImageUrl?: string
//   colorScheme?: ColorScheme
  
//   // Categorization
//   industry?: string
//   tags: string[]
  
//   // Template type
//   isSystemTemplate: boolean
//   templateType: TemplateType
  
//   // Editor data
//   editorBlocks?: EditorBlocks
//   editorVersion?: string
  
//   // AI generation
//   aiGenerated: boolean
//   basePrompt?: string
//   aiModel?: string
//   aiPrompt?: string
//   aiGenerationId?: string
  
//   // Variables
//   variables?: TemplateVariable[]
  
//   // Stats
//   timesUsed: number
//   avgOpenRate?: number
//   avgReplyRate?: number
//   lastUsedAt?: Date
//   isFavorite: boolean
//   viewCount: number
//   duplicateCount: number
  
//   // Relationships
//   templateCategories?: Array<{
//     category: TemplateCategory
//   }>
  
//   createdAt: Date
//   updatedAt: Date
// }

// export interface TemplateGenerationRequest {
//   prompt: string
//   industry?: string
//   purpose?: 'cold-outreach' | 'follow-up' | 'meeting-request' | 'nurture' | 'reengagement'
//   tone?: 'professional' | 'casual' | 'friendly' | 'formal' | 'enthusiastic'
//   recipientInfo?: {
//     industry?: string
//     role?: string
//     companySize?: string
//   }
//   includePersonalization?: boolean
//   targetLength?: 'short' | 'medium' | 'long'
// }

// export interface TemplateGenerationResponse {
//   name: string
//   subject: string
//   body: string
//   variables: TemplateVariable[]
//   suggestions?: string[]
//   quality?: number
//   personalizationScore?: number
// }

// // Industry types
// export type Industry = 
//   | 'saas'
//   | 'ecommerce'
//   | 'real_estate'
//   | 'recruiting'
//   | 'healthcare'
//   | 'finance'
//   | 'education'
//   | 'nonprofit'
//   | 'technology'
//   | 'consulting'
//   | 'manufacturing'
//   | 'retail'
//   | 'hospitality'
//   | 'other'

// export const INDUSTRIES: Array<{ value: Industry; label: string; icon: string }> = [
//   { value: 'saas', label: 'SaaS & Technology', icon: 'Zap' },
//   { value: 'ecommerce', label: 'E-commerce & Retail', icon: 'ShoppingBag' },
//   { value: 'real_estate', label: 'Real Estate', icon: 'Home' },
//   { value: 'recruiting', label: 'Recruiting & HR', icon: 'Users' },
//   { value: 'healthcare', label: 'Healthcare', icon: 'Heart' },
//   { value: 'finance', label: 'Finance & Banking', icon: 'DollarSign' },
//   { value: 'education', label: 'Education', icon: 'GraduationCap' },
//   { value: 'nonprofit', label: 'Nonprofit', icon: 'HandHeart' },
//   { value: 'technology', label: 'Technology Services', icon: 'Laptop' },
//   { value: 'consulting', label: 'Consulting', icon: 'Briefcase' },
//   { value: 'manufacturing', label: 'Manufacturing', icon: 'Factory' },
//   { value: 'retail', label: 'Retail', icon: 'Store' },
//   { value: 'hospitality', label: 'Hospitality', icon: 'Hotel' },
//   { value: 'other', label: 'Other', icon: 'MoreHorizontal' },
// ]

// // Common template tags
// export const TEMPLATE_TAGS = [
//   'cold-outreach',
//   'follow-up',
//   'meeting-request',
//   'nurture',
//   'reengagement',
//   'b2b',
//   'b2c',
//   'enterprise',
//   'startup',
//   'demo-request',
//   'trial',
//   'product-launch',
//   'case-study',
//   'event-invitation',
//   'partnership',
//   'networking',
//   'referral',
//   'testimonial',
//   'onboarding',
//   'upsell',
//   'cross-sell',
//   'renewal',
//   'thank-you',
//   'welcome',
//   'announcement',
// ]




















// import type { User, Campaign, Prospect, EmailTemplate, EmailLog, Analytics, Prisma } from "@prisma/client"

// // Extended types with relations
// export type UserWithRelations = User & {
//   campaigns?: Campaign[]
//   prospects?: Prospect[]
//   emailTemplates?: EmailTemplate[]
// }

// export type CampaignWithRelations = Campaign & {
//   prospects?: Prospect[]
//   emailSequences?: any[]
//   analytics?: Analytics[]
// }

// export type ProspectWithRelations = Prospect & {
//   campaign?: Campaign
//   emailLogs?: EmailLog[]
// }

// // API Response types
// export type ApiResponse<T = any> = {
//   success: boolean
//   data?: T
//   error?: string
//   message?: string
// }

// // Dashboard stats
// export type DashboardStats = {
//   totalCampaigns: number
//   activeCampaigns: number
//   totalProspects: number
//   emailsSentThisMonth: number
//   avgOpenRate: number
//   avgReplyRate: number
//   recentActivity: any[]
// }

// // Campaign stats
// export type CampaignStats = {
//   totalProspects: number
//   emailsSent: number
//   deliveryRate: number
//   openRate: number
//   clickRate: number
//   replyRate: number
//   bounceRate: number
// }

// // Subscription limits
// export const SUBSCRIPTION_LIMITS = {
//   FREE: {
//     emailsPerMonth: 100,
//     prospectsPerMonth: 50,
//     campaigns: 1,
//     aiCredits: 10,
//     teamMembers: 1,
//   },
//   STARTER: {
//     emailsPerMonth: 1000,
//     prospectsPerMonth: 500,
//     campaigns: 5,
//     aiCredits: 100,
//     teamMembers: 2,
//   },
//   PRO: {
//     emailsPerMonth: 5000,
//     prospectsPerMonth: 2500,
//     campaigns: 20,
//     aiCredits: 500,
//     teamMembers: 5,
//   },
//   AGENCY: {
//     emailsPerMonth: 20000,
//     prospectsPerMonth: 10000,
//     campaigns: -1, // unlimited
//     aiCredits: 2000,
//     teamMembers: 20,
//   },
// } as const

// export type SubscriptionLimits = (typeof SUBSCRIPTION_LIMITS)[keyof typeof SUBSCRIPTION_LIMITS]

// //new types

// export type TemplateType = "TEXT" | "VISUAL" | "HTML"

// export type BlockType =
//   | "HEADER"
//   | "PARAGRAPH"
//   | "IMAGE"
//   | "BUTTON"
//   | "DIVIDER"
//   | "SIGNATURE"
//   | "PERSONALIZATION"
//   | "SOCIAL_LINKS"
//   | "SPACER"
//   | "COLUMNS"
//   | "LIST"
//   | "QUOTE"
//   | "CODE"

// export interface ColorScheme {
//   primary: string
//   secondary: string
//   accent: string
//   background?: string
//   text?: string
// }

// export interface TemplateVariable {
//   name: string
//   required: boolean
//   defaultValue?: string
//   description?: string
//   example?: string
// }

// export interface TemplateBlock {
//   id: string
//   type: BlockType
//   order: number
//   content: Record<string, any>
//   styling?: {
//     backgroundColor?: string
//     textColor?: string
//     fontSize?: string
//     padding?: string
//     margin?: string
//     alignment?: "left" | "center" | "right"
//     [key: string]: any
//   }
//   config?: Record<string, any>
// }

// export interface EditorBlocks {
//   version: string
//   blocks: TemplateBlock[]
// }

// export interface TemplateCategory {
//   id: string
//   name: string
//   slug: string
//   description: string | null
//   icon: string | null
//   color: string
//   order: number
//   industry: string | null
//   createdAt: Date
//   updatedAt: Date
// }

// export interface EnhancedEmailTemplate {
//   id: string
//   userId: string | null
//   name: string
//   description: string | null
//   category: string | null

//   user?: {
//     id: string
//     name: string | null
//     email: string | null
//   } | null

//   subject: string
//   body: string

//   // Visual enhancements
//   thumbnailUrl: string | null
//   previewImageUrl: string | null
//   colorScheme: Prisma.JsonValue | null

//   // Categorization
//   industry: string | null
//   tags: string[]

//   // Template type
//   isSystemTemplate: boolean
//   templateType: string

//   // Editor data
//   editorBlocks: Prisma.JsonValue | null
//   editorVersion: string | null

//   // AI generation
//   aiGenerated: boolean
//   basePrompt: string | null
//   aiModel: string | null
//   aiPrompt: string | null
//   aiGenerationId: string | null

//   variables: Prisma.JsonValue | null

//   // Stats
//   timesUsed: number
//   avgOpenRate: number | null
//   avgReplyRate: number | null
//   lastUsedAt: Date | null
//   isFavorite: boolean
//   viewCount: number
//   duplicateCount: number

//   // Relationships
//   templateCategories?: Array<{
//     category: TemplateCategory
//   }>

//   createdAt: Date
//   updatedAt: Date
// }

// export interface TemplateGenerationRequest {
//   prompt: string
//   industry?: string
//   purpose?: "cold-outreach" | "follow-up" | "meeting-request" | "nurture" | "reengagement"
//   tone?: "professional" | "casual" | "friendly" | "formal" | "enthusiastic"
//   recipientInfo?: {
//     industry?: string
//     role?: string
//     companySize?: string
//   }
//   includePersonalization?: boolean
//   targetLength?: "short" | "medium" | "long"
// }

// export interface TemplateGenerationResponse {
//   name: string
//   subject: string
//   body: string
//   variables: TemplateVariable[]
//   suggestions?: string[]
//   quality?: number
//   personalizationScore?: number
// }

// // Industry types
// export type Industry =
//   | "saas"
//   | "ecommerce"
//   | "real_estate"
//   | "recruiting"
//   | "healthcare"
//   | "finance"
//   | "education"
//   | "nonprofit"
//   | "technology"
//   | "consulting"
//   | "manufacturing"
//   | "retail"
//   | "hospitality"
//   | "other"

// export const INDUSTRIES: Array<{ value: Industry; label: string; icon: string }> = [
//   { value: "saas", label: "SaaS & Technology", icon: "Zap" },
//   { value: "ecommerce", label: "E-commerce & Retail", icon: "ShoppingBag" },
//   { value: "real_estate", label: "Real Estate", icon: "Home" },
//   { value: "recruiting", label: "Recruiting & HR", icon: "Users" },
//   { value: "healthcare", label: "Healthcare", icon: "Heart" },
//   { value: "finance", label: "Finance & Banking", icon: "DollarSign" },
//   { value: "education", label: "Education", icon: "GraduationCap" },
//   { value: "nonprofit", label: "Nonprofit", icon: "HandHeart" },
//   { value: "technology", label: "Technology Services", icon: "Laptop" },
//   { value: "consulting", label: "Consulting", icon: "Briefcase" },
//   { value: "manufacturing", label: "Manufacturing", icon: "Factory" },
//   { value: "retail", label: "Retail", icon: "Store" },
//   { value: "hospitality", label: "Hospitality", icon: "Hotel" },
//   { value: "other", label: "Other", icon: "MoreHorizontal" },
// ]

// // Common template tags
// export const TEMPLATE_TAGS = [
//   "cold-outreach",
//   "follow-up",
//   "meeting-request",
//   "nurture",
//   "reengagement",
//   "b2b",
//   "b2c",
//   "enterprise",
//   "startup",
//   "demo-request",
//   "trial",
//   "product-launch",
//   "case-study",
//   "event-invitation",
//   "partnership",
//   "networking",
//   "referral",
//   "testimonial",
//   "onboarding",
//   "upsell",
//   "cross-sell",
//   "renewal",
//   "thank-you",
//   "welcome",
//   "announcement",
// ]

import type { User, Campaign, Prospect, EmailTemplate, EmailLog, Analytics, Prisma } from "@prisma/client"

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

export type TemplateType = "TEXT" | "VISUAL" | "HTML"

export type BlockType =
  | "HEADER"
  | "PARAGRAPH"
  | "IMAGE"
  | "BUTTON"
  | "DIVIDER"
  | "SIGNATURE"
  | "PERSONALIZATION"
  | "SOCIAL_LINKS"
  | "SPACER"
  | "COLUMNS"
  | "LIST"
  | "QUOTE"
  | "CODE"

export interface ColorScheme {
  primary: string
  secondary: string
  accent: string
  background?: string
  text?: string
}

export interface TemplateVariable {
  id?: string
  name: string
  required: boolean
  defaultValue?: string
  description?: string
  example?: string
}

export interface TemplateBlock {
  id: string
  type: BlockType
  order: number
  content: Record<string, any>
  styling?: {
    backgroundColor?: string
    textColor?: string
    fontSize?: string
    padding?: string
    margin?: string
    alignment?: "left" | "center" | "right"
    [key: string]: any
  }
  config?: Record<string, any>
}

export interface EditorBlocks {
  version: string
  blocks: TemplateBlock[]
}

export interface TemplateCategory {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string
  order: number
  industry: string | null
  createdAt: Date
  updatedAt: Date
}

export interface EnhancedEmailTemplate {
  id: string
  userId: string | null
  name: string
  description: string | null
  category: string | null

  user?: {
    id: string
    name: string | null
    email: string | null
  } | null

  subject: string
  body: string

  // Visual enhancements
  thumbnailUrl: string | null
  previewImageUrl: string | null
  colorScheme: Prisma.JsonValue | null

  // Categorization
  industry: string | null
  tags: string[]

  // Template type
  isSystemTemplate: boolean
  templateType: TemplateType

  // Editor data
  editorBlocks: Prisma.JsonValue | null
  editorVersion: string | null

  // AI generation
  aiGenerated: boolean
  basePrompt: string | null
  aiModel: string | null
  aiPrompt: string | null
  aiGenerationId: string | null

  variables: Prisma.JsonValue | null

  // Stats
  timesUsed: number
  avgOpenRate: number | null
  avgReplyRate: number | null
  lastUsedAt: Date | null
  isFavorite: boolean
  viewCount: number
  duplicateCount: number
  version?: number

  // Relationships
  templateCategories?: Array<{
    category: TemplateCategory
  }>

  createdAt: Date
  updatedAt: Date
}

export interface TemplateGenerationRequest {
  prompt: string
  industry?: string
  purpose?: "cold-outreach" | "follow-up" | "meeting-request" | "nurture" | "reengagement"
  tone?: "professional" | "casual" | "friendly" | "formal" | "enthusiastic"
  recipientInfo?: {
    industry?: string
    role?: string
    companySize?: string
  }
  includePersonalization?: boolean
  targetLength?: "short" | "medium" | "long"
}

export interface TemplateGenerationResponse {
  name: string
  subject: string
  body: string
  variables: TemplateVariable[]
  suggestions?: string[]
  quality?: number
  personalizationScore?: number
}

export type Industry =
  | "saas"
  | "ecommerce"
  | "real_estate"
  | "recruiting"
  | "healthcare"
  | "finance"
  | "education"
  | "nonprofit"
  | "technology"
  | "consulting"
  | "manufacturing"
  | "retail"
  | "hospitality"
  | "other"

export const INDUSTRIES: Array<{ value: Industry; label: string; icon: string }> = [
  { value: "saas", label: "SaaS & Technology", icon: "Zap" },
  { value: "ecommerce", label: "E-commerce & Retail", icon: "ShoppingBag" },
  { value: "real_estate", label: "Real Estate", icon: "Home" },
  { value: "recruiting", label: "Recruiting & HR", icon: "Users" },
  { value: "healthcare", label: "Healthcare", icon: "Heart" },
  { value: "finance", label: "Finance & Banking", icon: "DollarSign" },
  { value: "education", label: "Education", icon: "GraduationCap" },
  { value: "nonprofit", label: "Nonprofit", icon: "HandHeart" },
  { value: "technology", label: "Technology Services", icon: "Laptop" },
  { value: "consulting", label: "Consulting", icon: "Briefcase" },
  { value: "manufacturing", label: "Manufacturing", icon: "Factory" },
  { value: "retail", label: "Retail", icon: "Store" },
  { value: "hospitality", label: "Hospitality", icon: "Hotel" },
  { value: "other", label: "Other", icon: "MoreHorizontal" },
]

export const TEMPLATE_TAGS = [
  "cold-outreach",
  "follow-up",
  "meeting-request",
  "nurture",
  "reengagement",
  "b2b",
  "b2c",
  "enterprise",
  "startup",
  "demo-request",
  "trial",
  "product-launch",
  "case-study",
  "event-invitation",
  "partnership",
  "networking",
  "referral",
  "testimonial",
  "onboarding",
  "upsell",
  "cross-sell",
  "renewal",
  "thank-you",
  "welcome",
  "announcement",
]






























