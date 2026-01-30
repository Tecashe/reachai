// lib/services/email/oauth2-smtp-service.ts

import nodemailer, { type Transporter } from 'nodemailer'
import { oauth2Service } from '../google/oauth2-service'
import { db } from '@/lib/db'

/**
 * SMTP Email Service using OAuth2 (Individual User Authentication)
 * 
 * This is what Instantly uses:
 * - Each user has their own OAuth tokens
 * - Tokens are refreshed automatically when expired
 * - Uses SMTP with XOAUTH2 (allowed for cold email)
 * - No service account impersonation
 * 
 * KEY DIFFERENCES FROM SERVICE ACCOUNT APPROACH:
 * - Tokens come from individual user OAuth, not service account
 * - Each user authenticated separately
 * - Refresh tokens stored per user in database
 */

interface EmailOptions {
    from: string // The email address to send from
    to: string | string[]
    subject: string
    html?: string
    text?: string
    replyTo?: string
    cc?: string | string[]
    bcc?: string | string[]
    attachments?: Array<{
        filename: string
        content?: string | Buffer
        path?: string
    }>
}

interface SendResult {
    success: boolean
    messageId?: string
    error?: string
}

interface CachedToken {
    accessToken: string
    expiresAt: Date
}

export class OAuth2SMTPService {
    private transporters: Map<string, Transporter> = new Map()
    private tokenCache: Map<string, CachedToken> = new Map()

    /**
     * Get a valid access token for a user
     * Automatically refreshes if expired
     * 
     * @param userEmail - Email address
     * @param userId - User ID (optional, will be looked up if not provided)
     * @returns Valid access token
     */
    private async getValidAccessToken(userEmail: string, userId?: string): Promise<string> {
        // Check cache first
        const cached = this.tokenCache.get(userEmail)
        if (cached && cached.expiresAt > new Date(Date.now() + 5 * 60 * 1000)) {
            // Token valid for at least 5 more minutes
            return cached.accessToken
        }

        // Get tokens from database
        // First, find the account to get userId if not provided
        const account = await db.sendingAccount.findFirst({
            where: { email: userEmail },
            select: {
                userId: true,
                credentials: true,
            },
        })

        if (!account || !account.credentials) {
            throw new Error(`No OAuth credentials found for ${userEmail}`)
        }

        const actualUserId = userId || account.userId

        const credentials = account.credentials as any

        if (!credentials.refreshToken) {
            throw new Error(`No refresh token found for ${userEmail}. User needs to re-authenticate.`)
        }

        // Check if access token is still valid
        if (
            credentials.accessToken &&
            credentials.expiresAt &&
            new Date(credentials.expiresAt) > new Date(Date.now() + 5 * 60 * 1000)
        ) {
            // Cache and return existing token
            this.tokenCache.set(userEmail, {
                accessToken: credentials.accessToken,
                expiresAt: new Date(credentials.expiresAt),
            })
            return credentials.accessToken
        }

        // Token expired, refresh it
        console.log(`[OAuth2SMTP] Refreshing access token for: ${userEmail}`)

        try {
            const { accessToken, expiresAt } = await oauth2Service.refreshAccessToken(
                credentials.refreshToken
            )

            // Update database with new token
            await db.sendingAccount.update({
                where: {
                    userId_email: {
                        userId: actualUserId,
                        email: userEmail,
                    },
                },
                data: {
                    credentials: {
                        ...credentials,
                        accessToken,
                        expiresAt: expiresAt.toISOString(),
                    },
                },
            })

            // Update cache
            this.tokenCache.set(userEmail, {
                accessToken,
                expiresAt,
            })

            console.log(`[OAuth2SMTP] ✅ Token refreshed for: ${userEmail}`)

            return accessToken
        } catch (error) {
            console.error(`[OAuth2SMTP] Failed to refresh token for ${userEmail}:`, error)

            // Mark account as needing re-authentication
            await db.sendingAccount.update({
                where: {
                    userId_email: {
                        userId: actualUserId,
                        email: userEmail,
                    },
                },
                data: {
                    delegationStatus: 'needs_reauth',
                    isActive: false,
                },
            })

            throw new Error(
                `Failed to refresh token for ${userEmail}. User needs to re-authenticate.`
            )
        }
    }

    /**
     * Get or create an SMTP transporter for a specific user
     * 
     * @param userEmail - The email address to send from
     * @returns Configured nodemailer transporter
     */
    private async getTransporter(userEmail: string): Promise<Transporter> {
        // Get valid access token (auto-refreshes if needed)
        const accessToken = await this.getValidAccessToken(userEmail)

        // Check if we have a cached transporter
        const cached = this.transporters.get(userEmail)
        if (cached) {
            // Update the transporter with new token
            cached.set('oauth2_access_token', accessToken)
            return cached
        }

        // Create new SMTP transporter with OAuth2
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Use TLS
            auth: {
                type: 'OAuth2',
                user: userEmail,
                accessToken: accessToken,
            },
            pool: true, // Use connection pooling
            maxConnections: 5,
            maxMessages: 100,
            rateDelta: 1000,
            rateLimit: 5,
        })

        // Cache the transporter
        this.transporters.set(userEmail, transporter)

        console.log(`[OAuth2SMTP] Created new transporter for: ${userEmail}`)

        return transporter
    }

    /**
     * Send an email via SMTP using OAuth2
     * 
     * @param options - Email sending options
     * @returns Result object with success status and message ID
     */
    async sendEmail(options: EmailOptions): Promise<SendResult> {
        try {
            console.log(`[OAuth2SMTP] Sending email from ${options.from} to ${options.to}`)

            // Verify account exists and is active
            const account = await db.sendingAccount.findFirst({
                where: { email: options.from },
                select: {
                    userId: true,
                    isActive: true,
                    delegationStatus: true,
                },
            })

            if (!account) {
                throw new Error(`Account ${options.from} not found`)
            }

            if (!account.isActive) {
                throw new Error(`Account ${options.from} is not active`)
            }

            if (account.delegationStatus === 'needs_reauth') {
                throw new Error(`Account ${options.from} needs re-authentication`)
            }

            // Get transporter for this sender
            const transporter = await this.getTransporter(options.from)

            // Send the email
            const info = await transporter.sendMail({
                from: options.from,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
                replyTo: options.replyTo,
                cc: options.cc,
                bcc: options.bcc,
                attachments: options.attachments,
            })

            console.log(`[OAuth2SMTP] ✅ Email sent successfully. Message ID: ${info.messageId}`)

            // Update last sent timestamp
            await db.sendingAccount.update({
                where: {
                    userId_email: {
                        userId: account.userId,
                        email: options.from,
                    },
                },
                data: {
                    lastSentAt: new Date(),
                },
            })

            return {
                success: true,
                messageId: info.messageId,
            }
        } catch (error) {
            console.error(`[OAuth2SMTP] ❌ Failed to send email from ${options.from}:`, error)

            let errorMessage = 'Unknown error occurred'

            if (error instanceof Error) {
                errorMessage = error.message

                // Provide helpful error messages
                if (error.message.includes('Invalid login')) {
                    errorMessage = 'Authentication failed. Please re-connect your Google account.'
                } else if (error.message.includes('Daily user sending quota exceeded')) {
                    errorMessage = 'Gmail daily sending limit reached (2,000 emails/day per user)'
                } else if (error.message.includes('Message rejected')) {
                    errorMessage = 'Email rejected by Gmail. Check content for spam signals.'
                } else if (error.message.includes('needs re-authentication')) {
                    errorMessage = 'Account needs re-authentication. Please reconnect your Google account.'
                }

                // Update error count in database
                const errorAccount = await db.sendingAccount.findFirst({
                    where: { email: options.from },
                    select: { userId: true },
                })

                if (errorAccount) {
                    await db.sendingAccount.update({
                        where: {
                            userId_email: {
                                userId: errorAccount.userId,
                                email: options.from,
                            },
                        },
                        data: {
                            lastError: errorMessage,
                        },
                    })
                }
            }

            return {
                success: false,
                error: errorMessage,
            }
        }
    }

    /**
     * Send multiple emails in batch
     * 
     * @param emails - Array of email options
     * @returns Array of results for each email
     */
    async sendBatch(emails: EmailOptions[]): Promise<SendResult[]> {
        console.log(`[OAuth2SMTP] Sending batch of ${emails.length} emails`)

        const results: SendResult[] = []

        for (const email of emails) {
            const result = await this.sendEmail(email)
            results.push(result)

            // Small delay between emails
            await new Promise(resolve => setTimeout(resolve, 200))
        }

        const successCount = results.filter(r => r.success).length
        console.log(`[OAuth2SMTP] Batch complete: ${successCount}/${emails.length} sent successfully`)

        return results
    }

    /**
     * Test SMTP connection for a user
     * 
     * @param userEmail - Email address to test
     * @returns True if connection successful
     */
    async testConnection(userEmail: string): Promise<boolean> {
        try {
            console.log(`[OAuth2SMTP] Testing connection for: ${userEmail}`)

            const transporter = await this.getTransporter(userEmail)
            await transporter.verify()

            console.log(`[OAuth2SMTP] ✅ Connection verified for: ${userEmail}`)
            return true
        } catch (error) {
            console.error(`[OAuth2SMTP] ❌ Connection test failed for ${userEmail}:`, error)
            throw error
        }
    }

    /**
     * Send a test email
     * 
     * @param from - Email address to send from
     * @param to - Email address to send to (optional, defaults to from)
     * @returns Send result
     */
    async sendTestEmail(from: string, to?: string): Promise<SendResult> {
        const recipient = to || from

        return this.sendEmail({
            from,
            to: recipient,
            subject: '✅ Test Email - OAuth2 Connection Working',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">✅ Success!</h1>
          <p>Your Google account is connected correctly via OAuth2.</p>
          <p>This test email was sent via SMTP using your personal OAuth tokens.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280;">
            <strong>Technical details:</strong><br>
            From: ${from}<br>
            Authentication: OAuth2 (Individual User)<br>
            Sent via: smtp.gmail.com (XOAUTH2)
          </p>
        </div>
      `,
            text: `
✅ Success!

Your Google account is connected correctly via OAuth2.
This test email was sent via SMTP using your personal OAuth tokens.

Technical details:
From: ${from}
Authentication: OAuth2 (Individual User)
Sent via: smtp.gmail.com (XOAUTH2)
      `,
        })
    }

    /**
     * Clear cached transporters and tokens
     */
    clearCache(): void {
        console.log('[OAuth2SMTP] Clearing transporter and token cache')

        this.transporters.forEach((transporter, email) => {
            transporter.close()
            console.log(`[OAuth2SMTP] Closed transporter for: ${email}`)
        })

        this.transporters.clear()
        this.tokenCache.clear()
    }

    /**
     * Clear cache for a specific user
     * 
     * @param userEmail - Email to clear cache for
     */
    clearCacheForUser(userEmail: string): void {
        const transporter = this.transporters.get(userEmail)
        if (transporter) {
            transporter.close()
            this.transporters.delete(userEmail)
        }
        this.tokenCache.delete(userEmail)
        console.log(`[OAuth2SMTP] Cleared cache for: ${userEmail}`)
    }
}

// Export singleton instance
export const oauth2SMTPService = new OAuth2SMTPService()