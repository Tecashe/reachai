
// import { db } from "@/lib/db"
// import { Resend } from "resend"
// import { gmailOAuth } from "./oauth/gmail-oauth"
// import { outlookOAuth } from "./oauth/outlook-oauth"
// import { decrypt } from "@/lib/encryption"
// import { accountRotationService } from "./account-rotation"
// import { checkDomainHealth } from "./domain-health-checker"
// import { emailTracking } from "./email-tracking"
// import nodemailer from "nodemailer"

// interface SendEmailParams {
//   to: string
//   subject: string
//   html: string
//   userId?: string
//   campaignId?: string
//   prospectId?: string
//   skipValidation?: boolean
// }

// interface SendingAccountWithCredentials {
//   id: string
//   email: string
//   provider: string
//   credentials: any
//   dailyLimit: number
//   hourlyLimit: number
//   emailsSentToday: number
//   emailsSentThisHour: number
//   isActive: boolean
//   domain?: any
// }

// /**
//  * Email Sender Service
//  *
//  * IMPORTANT: This service uses EACH USER'S sending accounts, NOT the platform owner's.
//  *
//  * For transactional emails (password resets, invitations), use lib/resend.tsx
//  * For campaign emails (cold outreach), use this service with user's sending accounts
//  */
// export class EmailSenderService {
//   /**
//    * Send email using user's connected sending account with intelligent rotation
//    */
//   async sendCampaignEmail(
//     params: SendEmailParams,
//   ): Promise<{ success: boolean; messageId?: string; error?: string; logId?: string }> {
//     const { to, subject, html, userId, campaignId, prospectId, skipValidation } = params

//     console.log("[v0] Sending campaign email to:", to, "for user:", userId)

//     try {
//       let actualUserId = userId
//       if (!actualUserId && campaignId) {
//         const campaign = await db.campaign.findUnique({
//           where: { id: campaignId },
//           select: { userId: true },
//         })
//         actualUserId = campaign?.userId
//       }

//       if (!actualUserId) {
//         return {
//           success: false,
//           error: "User ID not found",
//         }
//       }

//       const rotationResult = await accountRotationService.getNextAccount(actualUserId, { type: "HEALTH_BASED" })

//       if (!rotationResult) {
//         return {
//           success: false,
//           error: "No active sending account available. Please connect a sending account in Settings.",
//         }
//       }

//       // Get full account details
//       const sendingAccount = await db.sendingAccount.findUnique({
//         where: { id: rotationResult.accountId },
//         include: { domain: true },
//       })

//       if (!sendingAccount) {
//         return {
//           success: false,
//           error: "Sending account not found",
//         }
//       }

//       if (!skipValidation && sendingAccount.domain) {
//         const domainHealth = await checkDomainHealth(sendingAccount.domain.domain)

//         // Prevent sending if domain health is critical
//         if (domainHealth.reputation && domainHealth.reputation.overall < 60) {
//           console.warn("[v0] Domain health too low for sending:", domainHealth.reputation.overall)
//           return {
//             success: false,
//             error: `Domain ${sendingAccount.domain.domain} has poor health (score: ${domainHealth.reputation.overall}). Please fix DNS issues before sending.`,
//           }
//         }

//         if (sendingAccount.domain.isBlacklisted && sendingAccount.domain.blacklistedOn.length > 0) {
//           console.warn("[v0] Domain is blacklisted:", sendingAccount.domain.blacklistedOn)
//           return {
//             success: false,
//             error: `Domain ${sendingAccount.domain.domain} is blacklisted on: ${sendingAccount.domain.blacklistedOn.join(", ")}. Cannot send emails.`,
//           }
//         }
//       }

//       // Check rate limits
//       if (sendingAccount.emailsSentThisHour >= sendingAccount.hourlyLimit) {
//         return {
//           success: false,
//           error: "Hourly sending limit reached. Please wait before sending more emails.",
//         }
//       }

//       if (sendingAccount.emailsSentToday >= sendingAccount.dailyLimit) {
//         return {
//           success: false,
//           error: "Daily sending limit reached. Please try again tomorrow.",
//         }
//       }

//       // Send email based on provider
//       let messageId: string | undefined

//       if (campaignId && prospectId) {
//         const emailLog = await db.emailLog.create({
//           data: {
//             prospectId,
//             sendingAccountId: sendingAccount.id,
//             subject,
//             body: html,
//             fromEmail: sendingAccount.email,
//             toEmail: to,
//             status: "QUEUED",
//             provider: sendingAccount.provider,
//           },
//         })
//         const logId = emailLog.id

//         const trackedHtml = emailTracking.injectTracking(html, logId)

//         // Now send with tracked HTML
//         switch (sendingAccount.provider.toLowerCase()) {
//           case "gmail":
//             messageId = await this.sendViaGmail(sendingAccount, to, subject, trackedHtml)
//             break
//           case "outlook":
//             messageId = await this.sendViaOutlook(sendingAccount, to, subject, trackedHtml)
//             break
//           case "smtp":
//             messageId = await this.sendViaSMTP(sendingAccount, to, subject, trackedHtml)
//             break
//           case "resend":
//             messageId = await this.sendViaResend(sendingAccount, to, subject, trackedHtml)
//             break
//           default:
//             return {
//               success: false,
//               error: `Unsupported email provider: ${sendingAccount.provider}`,
//             }
//         }

//         await db.emailLog.update({
//           where: { id: logId },
//           data: {
//             status: "SENT",
//             providerId: messageId || undefined,
//             sentAt: new Date(),
//           },
//         })

//         // Update prospect stats
//         await db.prospect.update({
//           where: { id: prospectId },
//           data: {
//             emailsReceived: { increment: 1 },
//             lastContactedAt: new Date(),
//           },
//         })
//       } else {
//         // No tracking for non-campaign emails
//         switch (sendingAccount.provider.toLowerCase()) {
//           case "gmail":
//             messageId = await this.sendViaGmail(sendingAccount, to, subject, html)
//             break
//           case "outlook":
//             messageId = await this.sendViaOutlook(sendingAccount, to, subject, html)
//             break
//           case "smtp":
//             messageId = await this.sendViaSMTP(sendingAccount, to, subject, html)
//             break
//           case "resend":
//             messageId = await this.sendViaResend(sendingAccount, to, subject, html)
//             break
//           default:
//             return {
//               success: false,
//               error: `Unsupported email provider: ${sendingAccount.provider}`,
//             }
//         }
//       }

//       // Update sending account counters
//       await db.sendingAccount.update({
//         where: { id: sendingAccount.id },
//         data: {
//           emailsSentToday: { increment: 1 },
//           emailsSentThisHour: { increment: 1 },
//         },
//       })

//       console.log(
//         "[v0] Email sent successfully via",
//         sendingAccount.provider,
//         "messageId:",
//         messageId,
//         "rotation:",
//         rotationResult.rotationReason,
//       )

//       return { success: true, messageId }
//     } catch (error) {
//       console.error("[v0] Failed to send email:", error)
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : "Failed to send email",
//       }
//     }
//   }

//   /**
//    * Send email via Gmail OAuth
//    */
//   private async sendViaGmail(
//     account: SendingAccountWithCredentials,
//     to: string,
//     subject: string,
//     html: string,
//   ): Promise<string> {
//     try {
//       // Decrypt credentials
//       const credentials = decrypt(account.credentials)

//       // Check if token is expired and refresh if needed
//       if (credentials.expiresAt && credentials.expiresAt < Date.now()) {
//         console.log("[v0] Gmail token expired, refreshing...")
//         const newTokens = await gmailOAuth.refreshAccessToken(credentials.refreshToken)

//         // Update credentials in database
//         const { encrypt } = await import("@/lib/encryption")
//         const encryptedCredentials = encrypt({
//           accessToken: newTokens.access_token,
//           refreshToken: newTokens.refresh_token || credentials.refreshToken,
//           expiresAt: newTokens.expiry_date,
//         })

//         await db.sendingAccount.update({
//           where: { id: account.id },
//           data: { credentials: encryptedCredentials },
//         })

//         credentials.accessToken = newTokens.access_token
//       }

//       // Send email via Gmail API
//       const messageId = await gmailOAuth.sendEmail(credentials.accessToken, credentials.refreshToken, {
//         to,
//         subject,
//         html,
//         from: account.email,
//       })

//       return messageId
//     } catch (error) {
//       console.error("[v0] Gmail sending error:", error)
//       throw new Error(`Gmail sending failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }
//   }

//   /**
//    * Send email via Outlook OAuth
//    */
//   private async sendViaOutlook(
//     account: SendingAccountWithCredentials,
//     to: string,
//     subject: string,
//     html: string,
//   ): Promise<string> {
//     try {
//       // Decrypt credentials
//       const credentials = decrypt(account.credentials)

//       // Check if token is expired and refresh if needed
//       const expiresAt = credentials.expiresAt || Date.now() + credentials.expiresIn * 1000
//       if (expiresAt < Date.now()) {
//         console.log("[v0] Outlook token expired, refreshing...")
//         const newTokens = await outlookOAuth.refreshAccessToken(credentials.refreshToken)

//         // Update credentials in database
//         const { encrypt } = await import("@/lib/encryption")
//         const encryptedCredentials = encrypt({
//           accessToken: newTokens.access_token,
//           refreshToken: newTokens.refresh_token,
//           expiresIn: newTokens.expires_in,
//           expiresAt: Date.now() + newTokens.expires_in * 1000,
//         })

//         await db.sendingAccount.update({
//           where: { id: account.id },
//           data: { credentials: encryptedCredentials },
//         })

//         credentials.accessToken = newTokens.access_token
//       }

//       // Send email via Microsoft Graph API
//       const messageId = await outlookOAuth.sendEmail(credentials.accessToken, {
//         to,
//         subject,
//         html,
//         from: account.email,
//       })

//       return messageId
//     } catch (error) {
//       console.error("[v0] Outlook sending error:", error)
//       throw new Error(`Outlook sending failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }
//   }

//   /**
//    * Send email via SMTP using nodemailer
//    */
//   private async sendViaSMTP(
//     account: SendingAccountWithCredentials,
//     to: string,
//     subject: string,
//     html: string,
//   ): Promise<string> {
//     try {
   
//       const credentials = decrypt(account.credentials)

//       const transporter = nodemailer.createTransport({
//         host: credentials.smtpHost,
//         port: credentials.smtpPort || 587,
//         secure: credentials.smtpPort === 465, // true for 465, false for other ports
//         auth: {
//           user: credentials.smtpUsername || account.email,
//           pass: credentials.smtpPassword,
//         },
//       })

//       const info = await transporter.sendMail({
//         from: account.email,
//         to,
//         subject,
//         html,
//       })

//       return info.messageId
//     } catch (error) {
//       console.error("[v0] SMTP sending error:", error)
//       throw new Error(`SMTP sending failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }
//   }

//   /**
//    * Send email via Resend (user's own Resend account)
//    */
//   private async sendViaResend(
//     account: SendingAccountWithCredentials,
//     to: string,
//     subject: string,
//     html: string,
//   ): Promise<string> {
//     const resend = new Resend(account.credentials.apiKey)

//     const { data, error } = await resend.emails.send({
//       from: account.email,
//       to,
//       subject,
//       html,
//     })

//     if (error) {
//       throw new Error(`Resend error: ${error.message}`)
//     }

//     return data?.id || ""
//   }
// }

// export const emailSender = new EmailSenderService()

// export async function sendEmail(
//   params: SendEmailParams,
// ): Promise<{ success: boolean; messageId?: string; error?: string; logId?: string }> {
//   return emailSender.sendCampaignEmail(params)
// }

// import { db } from "@/lib/db"
// import { Resend } from "resend"
// import { gmailOAuth } from "./oauth/gmail-oauth"
// import { outlookOAuth } from "./oauth/outlook-oauth"
// import { decrypt } from "@/lib/encryption"
// import { accountRotationService } from "./account-rotation"
// import { checkDomainHealth } from "./domain-health-checker"
// import { emailTracking } from "./email-tracking"
// import nodemailer from "nodemailer"

// interface SendEmailParams {
//   to: string
//   subject: string
//   html: string
//   userId?: string
//   campaignId?: string
//   prospectId?: string
//   skipValidation?: boolean
// }

// interface BulkEmailParams {
//   to: string
//   subject: string
//   html: string
//   prospectId: string
//   campaignId: string
//   trackingEnabled?: boolean
// }

// interface BulkEmailResult {
//   success: boolean
//   messageId?: string
//   error?: string
//   prospectId: string
// }

// interface SendingAccountWithCredentials {
//   id: string
//   email: string
//   provider: string
//   credentials: any
//   dailyLimit: number
//   hourlyLimit: number
//   emailsSentToday: number
//   emailsSentThisHour: number
//   isActive: boolean
//   domain?: any
// }

// /**
//  * Email Sender Service
//  *
//  * IMPORTANT: This service uses EACH USER'S sending accounts, NOT the platform owner's.
//  *
//  * For transactional emails (password resets, invitations), use lib/resend.tsx
//  * For campaign emails (cold outreach), use this service with user's sending accounts
//  */
// export class EmailSenderService {
//   /**
//    * Send multiple emails in bulk with rate limiting and error handling
//    */
//   async sendBulkEmails(emails: BulkEmailParams[]): Promise<BulkEmailResult[]> {
//     const results: BulkEmailResult[] = []

//     for (const email of emails) {
//       try {
//         const result = await this.sendCampaignEmail({
//           to: email.to,
//           subject: email.subject,
//           html: email.html,
//           campaignId: email.campaignId,
//           prospectId: email.prospectId,
//           skipValidation: false,
//         })

//         results.push({
//           ...result,
//           prospectId: email.prospectId,
//         })

//         // Add small delay between emails to avoid rate limits
//         await new Promise((resolve) => setTimeout(resolve, 1000))
//       } catch (error) {
//         results.push({
//           success: false,
//           error: error instanceof Error ? error.message : "Unknown error",
//           prospectId: email.prospectId,
//         })
//       }
//     }

//     return results
//   }

//   /**
//    * Send email using user's connected sending account with intelligent rotation
//    */
//   async sendCampaignEmail(
//     params: SendEmailParams,
//   ): Promise<{ success: boolean; messageId?: string; error?: string; logId?: string }> {
//     const { to, subject, html, userId, campaignId, prospectId, skipValidation } = params

//     console.log("[v0] Sending campaign email to:", to, "for user:", userId)

//     try {
//       let actualUserId = userId
//       if (!actualUserId && campaignId) {
//         const campaign = await db.campaign.findUnique({
//           where: { id: campaignId },
//           select: { userId: true },
//         })
//         actualUserId = campaign?.userId
//       }

//       if (!actualUserId) {
//         return {
//           success: false,
//           error: "User ID not found",
//         }
//       }

//       const rotationResult = await accountRotationService.getNextAccount(actualUserId, { type: "HEALTH_BASED" })

//       if (!rotationResult) {
//         return {
//           success: false,
//           error: "No active sending account available. Please connect a sending account in Settings.",
//         }
//       }

//       // Get full account details
//       const sendingAccount = await db.sendingAccount.findUnique({
//         where: { id: rotationResult.accountId },
//         include: { domain: true },
//       })

//       if (!sendingAccount) {
//         return {
//           success: false,
//           error: "Sending account not found",
//         }
//       }

//       if (!skipValidation && sendingAccount.domain) {
//         const domainHealth = await checkDomainHealth(sendingAccount.domain.domain)

//         // Prevent sending if domain health is critical
//         if (domainHealth.reputation && domainHealth.reputation.overall < 60) {
//           console.warn("[v0] Domain health too low for sending:", domainHealth.reputation.overall)
//           return {
//             success: false,
//             error: `Domain ${sendingAccount.domain.domain} has poor health (score: ${domainHealth.reputation.overall}). Please fix DNS issues before sending.`,
//           }
//         }

//         if (sendingAccount.domain.isBlacklisted && sendingAccount.domain.blacklistedOn.length > 0) {
//           console.warn("[v0] Domain is blacklisted:", sendingAccount.domain.blacklistedOn)
//           return {
//             success: false,
//             error: `Domain ${sendingAccount.domain.domain} is blacklisted on: ${sendingAccount.domain.blacklistedOn.join(", ")}. Cannot send emails.`,
//           }
//         }
//       }

//       // Check rate limits
//       if (sendingAccount.emailsSentThisHour >= sendingAccount.hourlyLimit) {
//         return {
//           success: false,
//           error: "Hourly sending limit reached. Please wait before sending more emails.",
//         }
//       }

//       if (sendingAccount.emailsSentToday >= sendingAccount.dailyLimit) {
//         return {
//           success: false,
//           error: "Daily sending limit reached. Please try again tomorrow.",
//         }
//       }

//       // Send email based on provider
//       let messageId: string | undefined

//       if (campaignId && prospectId) {
//         const emailLog = await db.emailLog.create({
//           data: {
//             prospectId,
//             sendingAccountId: sendingAccount.id,
//             subject,
//             body: html,
//             fromEmail: sendingAccount.email,
//             toEmail: to,
//             status: "QUEUED",
//             provider: sendingAccount.provider,
//           },
//         })
//         const logId = emailLog.id

//         const trackedHtml = emailTracking.injectTracking(html, logId)

//         // Now send with tracked HTML
//         switch (sendingAccount.provider.toLowerCase()) {
//           case "gmail":
//             messageId = await this.sendViaGmail(sendingAccount, to, subject, trackedHtml)
//             break
//           case "outlook":
//             messageId = await this.sendViaOutlook(sendingAccount, to, subject, trackedHtml)
//             break
//           case "smtp":
//             messageId = await this.sendViaSMTP(sendingAccount, to, subject, trackedHtml)
//             break
//           case "resend":
//             messageId = await this.sendViaResend(sendingAccount, to, subject, trackedHtml)
//             break
//           default:
//             return {
//               success: false,
//               error: `Unsupported email provider: ${sendingAccount.provider}`,
//             }
//         }

//         await db.emailLog.update({
//           where: { id: logId },
//           data: {
//             status: "SENT",
//             providerId: messageId || undefined,
//             sentAt: new Date(),
//           },
//         })

//         // Update prospect stats
//         await db.prospect.update({
//           where: { id: prospectId },
//           data: {
//             emailsReceived: { increment: 1 },
//             lastContactedAt: new Date(),
//           },
//         })
//       } else {
//         // No tracking for non-campaign emails
//         switch (sendingAccount.provider.toLowerCase()) {
//           case "gmail":
//             messageId = await this.sendViaGmail(sendingAccount, to, subject, html)
//             break
//           case "outlook":
//             messageId = await this.sendViaOutlook(sendingAccount, to, subject, html)
//             break
//           case "smtp":
//             messageId = await this.sendViaSMTP(sendingAccount, to, subject, html)
//             break
//           case "resend":
//             messageId = await this.sendViaResend(sendingAccount, to, subject, html)
//             break
//           default:
//             return {
//               success: false,
//               error: `Unsupported email provider: ${sendingAccount.provider}`,
//             }
//         }
//       }

//       // Update sending account counters
//       await db.sendingAccount.update({
//         where: { id: sendingAccount.id },
//         data: {
//           emailsSentToday: { increment: 1 },
//           emailsSentThisHour: { increment: 1 },
//         },
//       })

//       console.log(
//         "[v0] Email sent successfully via",
//         sendingAccount.provider,
//         "messageId:",
//         messageId,
//         "rotation:",
//         rotationResult.rotationReason,
//       )

//       return { success: true, messageId }
//     } catch (error) {
//       console.error("[v0] Failed to send email:", error)
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : "Failed to send email",
//       }
//     }
//   }

//   /**
//    * Send email via Gmail OAuth
//    */
//   private async sendViaGmail(
//     account: SendingAccountWithCredentials,
//     to: string,
//     subject: string,
//     html: string,
//   ): Promise<string> {
//     try {
//       // Decrypt credentials
//       const credentials = decrypt(account.credentials)

//       // Check if token is expired and refresh if needed
//       if (credentials.expiresAt && credentials.expiresAt < Date.now()) {
//         console.log("[v0] Gmail token expired, refreshing...")
//         const newTokens = await gmailOAuth.refreshAccessToken(credentials.refreshToken)

//         // Update credentials in database
//         const { encrypt } = await import("@/lib/encryption")
//         const encryptedCredentials = encrypt({
//           accessToken: newTokens.access_token,
//           refreshToken: newTokens.refresh_token || credentials.refreshToken,
//           expiresAt: newTokens.expiry_date,
//         })

//         await db.sendingAccount.update({
//           where: { id: account.id },
//           data: { credentials: encryptedCredentials },
//         })

//         credentials.accessToken = newTokens.access_token
//       }

//       // Send email via Gmail API
//       const messageId = await gmailOAuth.sendEmail(credentials.accessToken, credentials.refreshToken, {
//         to,
//         subject,
//         html,
//         from: account.email,
//       })

//       return messageId
//     } catch (error) {
//       console.error("[v0] Gmail sending error:", error)
//       throw new Error(`Gmail sending failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }
//   }

//   /**
//    * Send email via Outlook OAuth
//    */
//   private async sendViaOutlook(
//     account: SendingAccountWithCredentials,
//     to: string,
//     subject: string,
//     html: string,
//   ): Promise<string> {
//     try {
//       // Decrypt credentials
//       const credentials = decrypt(account.credentials)

//       // Check if token is expired and refresh if needed
//       const expiresAt = credentials.expiresAt || Date.now() + credentials.expiresIn * 1000
//       if (expiresAt < Date.now()) {
//         console.log("[v0] Outlook token expired, refreshing...")
//         const newTokens = await outlookOAuth.refreshAccessToken(credentials.refreshToken)

//         // Update credentials in database
//         const { encrypt } = await import("@/lib/encryption")
//         const encryptedCredentials = encrypt({
//           accessToken: newTokens.access_token,
//           refreshToken: newTokens.refresh_token,
//           expiresIn: newTokens.expires_in,
//           expiresAt: Date.now() + newTokens.expires_in * 1000,
//         })

//         await db.sendingAccount.update({
//           where: { id: account.id },
//           data: { credentials: encryptedCredentials },
//         })

//         credentials.accessToken = newTokens.access_token
//       }

//       // Send email via Microsoft Graph API
//       const messageId = await outlookOAuth.sendEmail(credentials.accessToken, {
//         to,
//         subject,
//         html,
//         from: account.email,
//       })

//       return messageId
//     } catch (error) {
//       console.error("[v0] Outlook sending error:", error)
//       throw new Error(`Outlook sending failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }
//   }

//   /**
//    * Send email via SMTP using nodemailer
//    */
//   private async sendViaSMTP(
//     account: SendingAccountWithCredentials,
//     to: string,
//     subject: string,
//     html: string,
//   ): Promise<string> {
//     try {
//       const credentials = decrypt(account.credentials)

//       const transporter = nodemailer.createTransport({
//         host: credentials.smtpHost,
//         port: credentials.smtpPort || 587,
//         secure: credentials.smtpPort === 465, // true for 465, false for other ports
//         auth: {
//           user: credentials.smtpUsername || account.email,
//           pass: credentials.smtpPassword,
//         },
//       })

//       const info = await transporter.sendMail({
//         from: account.email,
//         to,
//         subject,
//         html,
//       })

//       return info.messageId
//     } catch (error) {
//       console.error("[v0] SMTP sending error:", error)
//       throw new Error(`SMTP sending failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }
//   }

//   /**
//    * Send email via Resend (user's own Resend account)
//    */
//   private async sendViaResend(
//     account: SendingAccountWithCredentials,
//     to: string,
//     subject: string,
//     html: string,
//   ): Promise<string> {
//     const resend = new Resend(account.credentials.apiKey)

//     const { data, error } = await resend.emails.send({
//       from: account.email,
//       to,
//       subject,
//       html,
//     })

//     if (error) {
//       throw new Error(`Resend error: ${error.message}`)
//     }

//     return data?.id || ""
//   }
// }

// export const emailSender = new EmailSenderService()

// export async function sendEmail(
//   params: SendEmailParams,
// ): Promise<{ success: boolean; messageId?: string; error?: string; logId?: string }> {
//   return emailSender.sendCampaignEmail(params)
// }

//with the new method

import { db } from "@/lib/db"
import { accountRotationService } from "./account-rotation"
import { checkDomainHealth } from "./domain-health-checker"
import { emailTracking } from "./email-tracking"
import nodemailer from "nodemailer"

interface SendEmailParams {
  to: string
  subject: string
  html: string
  userId?: string
  campaignId?: string
  prospectId?: string
  skipValidation?: boolean
}

// Fix: Allow null values in addition to undefined to match Prisma's return types
interface SendingAccountWithCredentials {
  id: string
  email: string
  provider: string
  credentials: any
  dailyLimit: number
  hourlyLimit: number
  emailsSentToday: number
  emailsSentThisHour: number
  isActive: boolean
  domain?: any
  smtpHost?: string | null
  smtpPort?: number | null
  smtpSecure?: boolean | null
  smtpUsername?: string | null
  smtpPassword?: string | null
}

/**
 * Email Sender Service
 *
 * IMPORTANT: This service uses EACH USER'S sending accounts, NOT the platform owner's.
 *
 * For transactional emails (password resets, invitations), use lib/resend.tsx
 * For campaign emails (cold outreach), use this service with user's sending accounts
 */
export class EmailSenderService {
  /**
   * Send email using user's connected sending account with intelligent rotation
   */
  async sendCampaignEmail(
    params: SendEmailParams,
  ): Promise<{ success: boolean; messageId?: string; error?: string; logId?: string }> {
    const { to, subject, html, userId, campaignId, prospectId, skipValidation } = params

    console.log("[v0] Sending campaign email to:", to, "for user:", userId)

    try {
      let actualUserId = userId
      if (!actualUserId && campaignId) {
        const campaign = await db.campaign.findUnique({
          where: { id: campaignId },
          select: { userId: true },
        })
        actualUserId = campaign?.userId
      }

      if (!actualUserId) {
        return {
          success: false,
          error: "User ID not found",
        }
      }

      const rotationResult = await accountRotationService.getNextAccount(actualUserId, { type: "HEALTH_BASED" })

      if (!rotationResult) {
        return {
          success: false,
          error: "No active sending account available. Please connect a sending account in Settings.",
        }
      }

      const sendingAccount = await db.sendingAccount.findUnique({
        where: { id: rotationResult.accountId },
        include: { domain: true },
      })

      if (!sendingAccount) {
        return {
          success: false,
          error: "Sending account not found",
        }
      }

      if (!skipValidation && sendingAccount.domain) {
        const domainHealth = await checkDomainHealth(sendingAccount.domain.domain)

        if (domainHealth.reputation && domainHealth.reputation.overall < 60) {
          console.warn("[v0] Domain health too low for sending:", domainHealth.reputation.overall)
          return {
            success: false,
            error: `Domain ${sendingAccount.domain.domain} has poor health (score: ${domainHealth.reputation.overall}). Please fix DNS issues before sending.`,
          }
        }

        if (sendingAccount.domain.isBlacklisted && sendingAccount.domain.blacklistedOn.length > 0) {
          console.warn("[v0] Domain is blacklisted:", sendingAccount.domain.blacklistedOn)
          return {
            success: false,
            error: `Domain ${sendingAccount.domain.domain} is blacklisted on: ${sendingAccount.domain.blacklistedOn.join(", ")}. Cannot send emails.`,
          }
        }
      }

      if (sendingAccount.emailsSentThisHour >= sendingAccount.hourlyLimit) {
        return {
          success: false,
          error: "Hourly sending limit reached. Please wait before sending more emails.",
        }
      }

      if (sendingAccount.emailsSentToday >= sendingAccount.dailyLimit) {
        return {
          success: false,
          error: "Daily sending limit reached. Please try again tomorrow.",
        }
      }

      let messageId: string | undefined

      if (campaignId && prospectId) {
        const emailLog = await db.emailLog.create({
          data: {
            prospectId,
            sendingAccountId: sendingAccount.id,
            subject,
            body: html,
            fromEmail: sendingAccount.email,
            toEmail: to,
            status: "QUEUED",
            provider: sendingAccount.provider,
          },
        })
        const logId = emailLog.id

        const trackedHtml = emailTracking.injectTracking(html, logId)

        messageId = await this.sendViaSMTP(sendingAccount, to, subject, trackedHtml)

        await db.emailLog.update({
          where: { id: logId },
          data: {
            status: "SENT",
            providerId: messageId || undefined,
            sentAt: new Date(),
          },
        })

        await db.prospect.update({
          where: { id: prospectId },
          data: {
            emailsReceived: { increment: 1 },
            lastContactedAt: new Date(),
          },
        })
      } else {
        messageId = await this.sendViaSMTP(sendingAccount, to, subject, html)
      }

      await db.sendingAccount.update({
        where: { id: sendingAccount.id },
        data: {
          emailsSentToday: { increment: 1 },
          emailsSentThisHour: { increment: 1 },
        },
      })

      console.log("[v0] Email sent successfully via SMTP, messageId:", messageId)

      return { success: true, messageId }
    } catch (error) {
      console.error("[v0] Failed to send email:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      }
    }
  }

  /**
   * Send email via SMTP using nodemailer
   * Works with Gmail, Outlook, Yahoo, and custom SMTP providers
   */
  private async sendViaSMTP(
    account: SendingAccountWithCredentials,
    to: string,
    subject: string,
    html: string,
  ): Promise<string> {
    try {
      if (!account.smtpHost || !account.smtpUsername || !account.smtpPassword) {
        throw new Error("SMTP configuration incomplete for account")
      }

      const { decryptPassword } = await import("@/lib/encryption")

      const smtpPassword = decryptPassword(account.smtpPassword)

      const transporter = nodemailer.createTransport({
        host: account.smtpHost,
        port: account.smtpPort || 587,
        secure: account.smtpSecure === true, // true for 465, false for 587
        auth: {
          user: account.smtpUsername,
          pass: smtpPassword,
        },
        connectionTimeout: 10000,
        socketTimeout: 10000,
      })

      const info = await transporter.sendMail({
        from: account.email,
        to,
        subject,
        html,
        text: html.replace(/<[^>]*>/g, ""), // Strip HTML for plain text
      })

      return info.messageId || ""
    } catch (error) {
      console.error("[v0] SMTP sending error:", error)
      throw new Error(`SMTP sending failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }
}

export const emailSender = new EmailSenderService()

export async function sendEmail(
  params: SendEmailParams,
): Promise<{ success: boolean; messageId?: string; error?: string; logId?: string }> {
  return emailSender.sendCampaignEmail(params)
}