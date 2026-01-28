// lib/services/google/service-account-auth.ts

import { JWT } from 'google-auth-library'

/**
 * Google Service Account Authentication for Domain-Wide Delegation
 * 
 * This service handles authentication using a Google service account
 * with domain-wide delegation to impersonate Google Workspace users
 * for SMTP email sending.
 * 
 * KEY POINTS:
 * - Uses service account, NOT OAuth2
 * - Requires domain-wide delegation setup by customer's Workspace admin
 * - Only requires brand verification (no restricted scope verification!)
 * - Generates access tokens to authenticate SMTP connections
 * - Tokens are short-lived (1 hour) and auto-refreshed
 */

interface ServiceAccountConfig {
    email: string
    privateKey: string
    clientId: string
}

interface AccessTokenResult {
    accessToken: string
    expiresAt: Date
}

export class GoogleServiceAccountAuth {
    private config: ServiceAccountConfig
    private jwtClient: JWT | null = null

    constructor() {
        // Load service account credentials from environment
        const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
        const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
        const clientId = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID

        if (!email || !privateKey || !clientId) {
            throw new Error(
                'Missing service account credentials. Please set GOOGLE_SERVICE_ACCOUNT_EMAIL, ' +
                'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, and GOOGLE_SERVICE_ACCOUNT_CLIENT_ID environment variables.'
            )
        }

        // Handle private key formatting
        // In environment variables, newlines might be escaped as \\n
        // We need actual newlines for the JWT library
        const formattedPrivateKey = privateKey.replace(/\\n/g, '\n')

        this.config = {
            email,
            privateKey: formattedPrivateKey,
            clientId,
        }

        console.log('[ServiceAccount] Initialized with email:', email)
    }

    /**
     * Get the service account client ID
     * This is what customers need to authorize in their Google Workspace Admin Console
     */
    getClientId(): string {
        return this.config.clientId
    }

    /**
     * Get the service account email
     * Useful for debugging and logging
     */
    getServiceAccountEmail(): string {
        return this.config.email
    }

    /**
     * Create a JWT client for a specific user
     * This is the core of domain-wide delegation - we impersonate the user
     * 
     * @param userEmail - The email address to impersonate (e.g., user@company.com)
     * @returns JWT client configured for that user
     */
    private createJWTClient(userEmail: string): JWT {
        return new JWT({
            email: this.config.email,
            key: this.config.privateKey,
            scopes: [
                'https://mail.google.com/', // Required for SMTP/IMAP access
            ],
            subject: userEmail, // This is the impersonation part!
        })
    }

    /**
     * Get an access token for a specific user
     * This token can be used to authenticate SMTP connections via XOAUTH2
     * 
     * @param userEmail - Email address to get token for
     * @returns Access token and expiration time
     * @throws Error if token generation fails
     */
    async getAccessToken(userEmail: string): Promise<AccessTokenResult> {
        try {
            console.log(`[ServiceAccount] Generating access token for: ${userEmail}`)

            // Create JWT client for this specific user
            const client = this.createJWTClient(userEmail)

            // Authorize and get access token
            await client.authorize()

            const accessToken = client.credentials.access_token
            const expiryDate = client.credentials.expiry_date

            if (!accessToken) {
                throw new Error('Failed to generate access token')
            }

            // Calculate expiration date (tokens typically expire in 1 hour)
            const expiresAt = expiryDate
                ? new Date(expiryDate)
                : new Date(Date.now() + 3600 * 1000) // Default to 1 hour

            console.log(`[ServiceAccount] Token generated successfully, expires at: ${expiresAt.toISOString()}`)

            return {
                accessToken,
                expiresAt,
            }
        } catch (error) {
            console.error(`[ServiceAccount] Failed to generate token for ${userEmail}:`, error)

            // Provide helpful error messages
            if (error instanceof Error) {
                if (error.message.includes('invalid_grant')) {
                    throw new Error(
                        `Domain-wide delegation not authorized for ${userEmail}. ` +
                        `The customer's Workspace admin needs to authorize service account client ID: ${this.config.clientId}`
                    )
                }
                if (error.message.includes('invalid_scope')) {
                    throw new Error(
                        `Invalid scope configuration. Ensure https://mail.google.com/ is authorized ` +
                        `in the customer's Google Workspace Admin Console.`
                    )
                }
            }

            throw new Error(`Failed to generate access token: ${error}`)
        }
    }

    /**
     * Verify that domain-wide delegation is set up correctly for a user
     * This is useful for testing and onboarding
     * 
     * @param userEmail - Email address to test
     * @returns True if delegation is working, throws error otherwise
     */
    async verifyDelegation(userEmail: string): Promise<boolean> {
        try {
            await this.getAccessToken(userEmail)
            console.log(`[ServiceAccount] ✅ Domain-wide delegation verified for: ${userEmail}`)
            return true
        } catch (error) {
            console.error(`[ServiceAccount] ❌ Domain-wide delegation verification failed for: ${userEmail}`)
            throw error
        }
    }

    /**
     * Get a fresh access token, even if a cached one exists
     * Useful when you suspect the cached token might be invalid
     * 
     * @param userEmail - Email address to get token for
     * @returns Fresh access token and expiration
     */
    async refreshAccessToken(userEmail: string): Promise<AccessTokenResult> {
        // JWT tokens are always generated fresh, so this is the same as getAccessToken
        // But we expose it as a separate method for API clarity
        return this.getAccessToken(userEmail)
    }
}

// Export singleton instance
export const serviceAccountAuth = new GoogleServiceAccountAuth()