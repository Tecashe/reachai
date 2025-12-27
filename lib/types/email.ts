// types/email.ts
// Comprehensive type definitions for email services

import type { Transporter } from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'

/**
 * OAuth Token types
 */
export interface GmailTokens {
  access_token: string
  refresh_token: string
  expiry_date: number
}

export interface OutlookTokens {
  accessToken: string
  refreshToken: string
  expiresOn: Date
}

/**
 * IMAP Configuration
 * Note: The 'imap' package expects either password OR xoauth2, not both
 */
export interface ImapConfig {
  user: string
  password?: string // For basic auth (custom SMTP)
  xoauth2?: string // For OAuth (Gmail/Outlook)
  host: string
  port: number
  tls: boolean
  tlsOptions: {
    rejectUnauthorized: boolean
  }
}

/**
 * SMTP/IMAP Credentials for custom providers
 */
export interface SmtpImapCredentials {
  email: string
  // SMTP settings
  smtpHost: string
  smtpPort: number
  smtpSecure: boolean
  smtpUsername: string
  smtpPassword: string
  // IMAP settings
  imapHost: string
  imapPort: number
  imapUsername: string
  imapPassword: string
}

/**
 * Encrypted credentials stored in database
 */
export interface StoredGmailCredentials {
  provider: 'gmail'
  connectionType: 'oauth_imap_smtp'
  accessToken: string
  refreshToken: string
  expiresAt: number
  imapHost: string
  imapPort: number
  smtpHost: string
  smtpPort: number
}

export interface StoredOutlookCredentials {
  provider: 'outlook'
  connectionType: 'oauth_imap_smtp'
  accessToken: string
  refreshToken: string
  expiresAt: number
  imapHost: string
  imapPort: number
  smtpHost: string
  smtpPort: number
}

export interface StoredCustomCredentials {
  provider: 'custom'
  connectionType: 'smtp_imap'
  smtpHost: string
  smtpPort: number
  smtpSecure: boolean
  smtpUsername: string
  smtpPassword: string
  imapHost: string
  imapPort: number
  imapUsername: string
  imapPassword: string
}

export type StoredCredentials = 
  | StoredGmailCredentials 
  | StoredOutlookCredentials 
  | StoredCustomCredentials

/**
 * Connection test results
 */
export interface ConnectionTestResult {
  imap: boolean
  smtp: boolean
  healthy: boolean
  error?: string
}

/**
 * Health metrics
 */
export interface HealthMetrics {
  healthScore: number
  bounceRate: number
  spamComplaintRate: number
  replyRate: number
  openRate: number
  issues: string[]
  recommendations: string[]
}

/**
 * Email sending params
 */
export interface SendEmailParams {
  prospectId: string
  subject: string
  body: string
  html?: string
  userId: string
  campaignId?: string
}

/**
 * Send result
 */
export interface SendResult {
  success: boolean
  emailLogId?: string
  sendingAccountId?: string
  error?: string
}

/**
 * Nodemailer transporter type
 */
export type EmailTransporter = Transporter<SMTPTransport.SentMessageInfo>

/**
 * Provider detection result
 */
export interface ProviderDetectionResult {
  detected: boolean
  settings?: Partial<SmtpImapCredentials>
  suggestions?: Array<{
    name: string
    smtpHost: string
    smtpPort: number
    smtpSecure: boolean
    requiresApiKey: boolean
  }>
}

/**
 * User profile from OAuth providers
 */
export interface UserProfile {
  email: string
  name: string
}