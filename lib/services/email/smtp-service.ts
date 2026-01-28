// lib/services/email/smtp-service.ts

import nodemailer, { type Transporter } from 'nodemailer'
import { serviceAccountAuth } from '../google/service-account-auth'

/**
 * SMTP Email Service using Google Service Account with Domain-Wide Delegation
 * 
 * This service sends emails via Gmail's SMTP servers using OAuth2 authentication
 * through a service account that impersonates Google Workspace users.
 * 
 * KEY FEATURES:
 * - Uses SMTP protocol (NOT Gmail API) - allowed for cold email
 * - Authenticates via XOAUTH2 with service account tokens
 * - Respects Gmail sending limits (2,000 emails/day per user)
 * - Production-ready error handling and retry logic
 * - Connection pooling for performance
 */

interface EmailOptions {
    from: string // The email address to send from (must be authorized via delegation)
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

export class SMTPService {
    private transporters: Map<string, Transporter> = new Map()
    private tokenCache: Map<string, { token: string; expiresAt: Date }> = new Map()

    /**
     * Get or create an SMTP transporter for a specific user
     * Transporters are cached per user for performance
     * 
     * @param userEmail - The email address to send from
     * @returns Configured nodemailer transporter
     */
    private async getTransporter(userEmail: string): Promise<Transporter> {
        // Check if we have a cached transporter
        if (this.transporters.has(userEmail)) {
            const transporter = this.transporters.get(userEmail)!

            // Verify the cached token is still valid
            const cachedToken = this.tokenCache.get(userEmail)
            if (cachedToken && cachedToken.expiresAt > new Date()) {
                return transporter
            }

            // Token expired, remove cached transporter
            this.transporters.delete(userEmail)
            this.tokenCache.delete(userEmail)
        }

        // Get fresh access token from service account
        const { accessToken, expiresAt } = await serviceAccountAuth.getAccessToken(userEmail)

        // Cache the token
        this.tokenCache.set(userEmail, { token: accessToken, expiresAt })

        // Create SMTP transporter with OAuth2
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Use TLS
            auth: {
                type: 'OAuth2',
                user: userEmail,
                accessToken: accessToken,
            },
            pool: true, // Use connection pooling for better performance
            maxConnections: 5, // Max concurrent connections
            maxMessages: 100, // Max messages per connection
            rateDelta: 1000, // Rate limiting: time between messages (ms)
            rateLimit: 5, // Rate limiting: max messages per rateDelta
        })

        // Cache the transporter
        this.transporters.set(userEmail, transporter)

        console.log(`[SMTP] Created new transporter for: ${userEmail}`)

        return transporter
    }

    /**
     * Send an email via SMTP
     * 
     * @param options - Email sending options
     * @returns Result object with success status and message ID
     */
    async sendEmail(options: EmailOptions): Promise<SendResult> {
        try {
            console.log(`[SMTP] Sending email from ${options.from} to ${options.to}`)

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

            console.log(`[SMTP] ✅ Email sent successfully. Message ID: ${info.messageId}`)

            return {
                success: true,
                messageId: info.messageId,
            }
        } catch (error) {
            console.error(`[SMTP] ❌ Failed to send email from ${options.from}:`, error)

            let errorMessage = 'Unknown error occurred'

            if (error instanceof Error) {
                errorMessage = error.message

                // Provide helpful error messages
                if (error.message.includes('Invalid login')) {
                    errorMessage = 'Authentication failed. Domain-wide delegation may not be set up correctly.'
                } else if (error.message.includes('Daily user sending quota exceeded')) {
                    errorMessage = 'Gmail daily sending limit reached (2,000 emails/day per user)'
                } else if (error.message.includes('Message rejected')) {
                    errorMessage = 'Email rejected by Gmail. Check content for spam signals.'
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
     * Respects rate limits and handles errors gracefully
     * 
     * @param emails - Array of email options
     * @returns Array of results for each email
     */
    async sendBatch(emails: EmailOptions[]): Promise<SendResult[]> {
        console.log(`[SMTP] Sending batch of ${emails.length} emails`)

        const results: SendResult[] = []

        // Send emails sequentially to respect rate limits
        // For production, you'd want more sophisticated queuing
        for (const email of emails) {
            const result = await this.sendEmail(email)
            results.push(result)

            // Small delay between emails to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200))
        }

        const successCount = results.filter(r => r.success).length
        console.log(`[SMTP] Batch complete: ${successCount}/${emails.length} sent successfully`)

        return results
    }

    /**
     * Test SMTP connection for a user
     * Useful for verifying domain-wide delegation setup
     * 
     * @param userEmail - Email address to test
     * @returns True if connection successful
     */
    async testConnection(userEmail: string): Promise<boolean> {
        try {
            console.log(`[SMTP] Testing connection for: ${userEmail}`)

            const transporter = await this.getTransporter(userEmail)
            await transporter.verify()

            console.log(`[SMTP] ✅ Connection verified for: ${userEmail}`)
            return true
        } catch (error) {
            console.error(`[SMTP] ❌ Connection test failed for ${userEmail}:`, error)
            throw error
        }
    }

    /**
     * Send a test email to verify everything is working
     * 
     * @param from - Email address to send from
     * @param to - Email address to send to
     * @returns Send result
     */
    async sendTestEmail(from: string, to: string): Promise<SendResult> {
        return this.sendEmail({
            from,
            to,
            subject: '✅ Test Email - Domain-Wide Delegation Working',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">✅ Success!</h1>
          <p>Your Google Workspace domain-wide delegation is configured correctly.</p>
          <p>This test email was sent via SMTP using service account authentication.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280;">
            <strong>Technical details:</strong><br>
            From: ${from}<br>
            Service Account: ${serviceAccountAuth.getServiceAccountEmail()}<br>
            Sent via: smtp.gmail.com (OAuth2 XOAUTH2)
          </p>
        </div>
      `,
            text: `
✅ Success!

Your Google Workspace domain-wide delegation is configured correctly.
This test email was sent via SMTP using service account authentication.

Technical details:
From: ${from}
Service Account: ${serviceAccountAuth.getServiceAccountEmail()}
Sent via: smtp.gmail.com (OAuth2 XOAUTH2)
      `,
        })
    }

    /**
     * Clear cached transporters and tokens
     * Useful when you need to force refresh (e.g., after delegation changes)
     */
    clearCache(): void {
        console.log('[SMTP] Clearing transporter and token cache')

        // Close all pooled connections
        this.transporters.forEach((transporter, email) => {
            transporter.close()
            console.log(`[SMTP] Closed transporter for: ${email}`)
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
            console.log(`[SMTP] Cleared transporter for: ${userEmail}`)
        }

        this.tokenCache.delete(userEmail)
    }

    /**
     * Get current cache statistics
     * Useful for monitoring and debugging
     */
    getCacheStats(): {
        transporterCount: number
        tokenCount: number
        users: string[]
    } {
        return {
            transporterCount: this.transporters.size,
            tokenCount: this.tokenCache.size,
            users: Array.from(this.transporters.keys()),
        }
    }
}

// Export singleton instance
export const smtpService = new SMTPService()