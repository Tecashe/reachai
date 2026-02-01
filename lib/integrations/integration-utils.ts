/**
 * Integration utilities and helpers for managing OAuth flows
 */

import type { OAuthProviderKey } from './oauth-config'
import { OAUTH_PROVIDERS } from './oauth-config'
import type { Integration as PrismaIntegration, OAuthToken as PrismaOAuthToken } from '@prisma/client'

// Type alias for convenience
export type Integration = PrismaIntegration & {
  oauthToken?: PrismaOAuthToken | null
}

export const PROVIDER_NAMES: Record<OAuthProviderKey, string> = {
  AIRTABLE: 'Airtable',
  AMPLITUDE: 'Amplitude',
  ASANA: 'Asana',
  CLICKUP: 'ClickUp',
  CODA: 'Coda',
  GMAIL: 'Gmail',
  GOOGLE_DOCS: 'Google Docs',
  GOOGLE_SHEETS: 'Google Sheets',
  HUBSPOT: 'HubSpot',
  INTERCOM: 'Intercom',
  KLAVIYO: 'Klaviyo',
  MAILCHIMP: 'Mailchimp',
  MIXPANEL: 'Mixpanel',
  NOTION: 'Notion',
  OPENAI: 'OpenAI',
  OUTLOOK: 'Outlook',
  PIPEDRIVE: 'Pipedrive',
  RESEND: 'Resend',
  SALESFORCE: 'Salesforce',
  SEGMENT: 'Segment',
  SERVICENOW: 'ServiceNow',
  STRIPE: 'Stripe',
  TRELLO: 'Trello',
  ZENDESK: 'Zendesk',
  ZOHO_CRM: 'Zoho CRM',
  SLACK: 'Slack',
  APOLLO: 'Apollo',
  LEMLIST: 'Lemlist',
  HIGHLEVEL: 'GoHighLevel',
}

export interface IntegrationStatus {
  provider: string
  isConnected: boolean
  accountEmail?: string | null
  accountName?: string | null
  connectedSince?: Date
  expiresAt?: Date | null
  lastError?: string | null
}

/**
 * Get all integration statuses for a user
 */
export function getIntegrationStatuses(
  integrations: Integration[],
): IntegrationStatus[] {
  const statuses: IntegrationStatus[] = []

  for (const [provider] of Object.entries(OAUTH_PROVIDERS)) {
    const integration = integrations.find((i) => i.type === provider)

    statuses.push({
      provider,
      isConnected: integration?.isActive ?? false,
      accountEmail: integration?.accountEmail,
      accountName: integration?.accountName,
      connectedSince: integration?.createdAt,
      expiresAt: integration?.oauthToken?.expiresAt,
      lastError: integration?.lastError,
    })
  }

  return statuses
}

/**
 * Check if token needs refresh
 */
export function isTokenExpired(expiresAt: Date | null | undefined): boolean {
  if (!expiresAt) return false
  return new Date() >= new Date(expiresAt)
}

/**
 * Get token expiration status
 */
export function getTokenExpirationStatus(expiresAt: Date | null | undefined) {
  if (!expiresAt) {
    return { status: 'unknown', message: 'Expiration unknown' }
  }

  const now = new Date()
  const expired = now >= expiresAt
  const hoursUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (expired) {
    return { status: 'expired', message: 'Token expired', hoursUntilExpiry: 0 }
  }

  if (hoursUntilExpiry < 1) {
    return { status: 'critical', message: 'Expires in less than 1 hour', hoursUntilExpiry }
  }

  if (hoursUntilExpiry < 24) {
    return { status: 'warning', message: 'Expires in less than 24 hours', hoursUntilExpiry }
  }

  return { status: 'ok', message: 'Token valid', hoursUntilExpiry }
}

/**
 * Format integration type to display name
 */
export function formatProviderName(provider: string): string {
  return PROVIDER_NAMES[provider as OAuthProviderKey] || provider
}

/**
 * Get callback URL for provider
 */
export function getCallbackUrl(provider: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const slug = provider.toLowerCase().replace(/_/g, '-')
  return `${appUrl}/api/integrations/callback/${slug}`
}

/**
 * Validate OAuth provider
 */
export function isValidProvider(provider: string): provider is OAuthProviderKey {
  return provider in OAUTH_PROVIDERS
}

/**
 * Get all available providers
 */
export function getAllProviders(): OAuthProviderKey[] {
  return Object.keys(OAUTH_PROVIDERS) as OAuthProviderKey[]
}

/**
 * Get provider info
 */
export function getProviderInfo(provider: string) {
  const key = provider as OAuthProviderKey
  return {
    ...OAUTH_PROVIDERS[key],
    displayName: formatProviderName(provider),
    callbackUrl: getCallbackUrl(provider),
  }
}

/**
 * Calculate sync status percentage
 */
export function calculateSyncPercentage(integrations: Integration[]): number {
  if (integrations.length === 0) return 0
  const connected = integrations.filter((i) => i.isActive).length
  return Math.round((connected / integrations.length) * 100)
}

/**
 * Group integrations by category
 */
export const INTEGRATION_CATEGORIES = {
  CRM: ['HUBSPOT', 'SALESFORCE', 'PIPEDRIVE', 'ZOHO_CRM'],
  EMAIL: ['GMAIL', 'OUTLOOK', 'RESEND', 'MAILCHIMP', 'KLAVIYO'],
  COMMUNICATION: ['ZENDESK', 'INTERCOM', 'SEGMENT'],
  PRODUCTIVITY: ['AIRTABLE', 'NOTION', 'ASANA', 'CLICKUP', 'CODA'],
  ANALYTICS: ['AMPLITUDE', 'MIXPANEL', 'SEGMENT'],
  INFRASTRUCTURE: ['SERVICENOW', 'TRELLO', 'GOOGLE_SHEETS', 'GOOGLE_DOCS'],
  PAYMENTS: ['STRIPE'],
  AI: ['OPENAI'],
} as const

export function getCategoryForProvider(provider: string): string {
  for (const [category, providers] of Object.entries(INTEGRATION_CATEGORIES)) {
    if ((providers as readonly string[]).includes(provider)) {
      return category
    }
  }
  return 'OTHER'
}

/**
 * Get providers by category
 */
export function getProvidersByCategory(category: keyof typeof INTEGRATION_CATEGORIES) {
  return INTEGRATION_CATEGORIES[category].map((p) => ({
    provider: p,
    displayName: formatProviderName(p),
  }))
}

/**
 * Validate token freshness
 */
export function validateTokenFreshness(expiresAt: Date | null | undefined): {
  isValid: boolean
  requiresRefresh: boolean
  message: string
} {
  if (!expiresAt) {
    return {
      isValid: true,
      requiresRefresh: false,
      message: 'No expiration set',
    }
  }

  const now = new Date()
  const expiryDate = new Date(expiresAt)
  const bufferTime = 5 * 60 * 1000 // 5 minutes

  if (now >= expiryDate) {
    return {
      isValid: false,
      requiresRefresh: true,
      message: 'Token has expired',
    }
  }

  if (now >= new Date(expiryDate.getTime() - bufferTime)) {
    return {
      isValid: true,
      requiresRefresh: true,
      message: 'Token expiring soon, refresh recommended',
    }
  }

  return {
    isValid: true,
    requiresRefresh: false,
    message: 'Token is valid',
  }
}

/**
 * Format last synced time
 */
export function formatLastSyncedTime(lastSyncedAt: Date | null | undefined): string {
  if (!lastSyncedAt) {
    return 'Never'
  }

  const now = new Date()
  const diff = now.getTime() - new Date(lastSyncedAt).getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  }

  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  }

  if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''} ago`
  }

  return lastSyncedAt.toLocaleDateString()
}