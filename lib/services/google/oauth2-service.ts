// lib/services/google/oauth2-service.ts

import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

/**
 * Google OAuth2 Service for Individual User Authentication
 * 
 * This implements the OAuth flow that Instantly uses:
 * - Admin pre-authorizes the app in App Access Control
 * - Each user authenticates individually
 * - Each user gets their own tokens
 * - Tokens are stored per user and refreshed automatically
 * 
 * KEY DIFFERENCES FROM SERVICE ACCOUNT:
 * - Users consent individually (standard OAuth flow)
 * - Each user has their own refresh token
 * - Easier to get approved (only needs brand verification)
 * - Admin just allowlists the app (less trust required)
 */


interface OAuth2Config {
    clientId: string
    clientSecret: string
    redirectUri: string
}

interface OAuth2Tokens {
    accessToken: string
    refreshToken: string
    expiresAt: Date
    scope: string
}

export class GoogleOAuth2Service {
    private config: OAuth2Config
    private oauth2Client: OAuth2Client

    // The scopes we need for SMTP email sending
    private readonly REQUIRED_SCOPES = [
        'https://mail.google.com/', // Full Gmail access (needed for SMTP)
        'https://www.googleapis.com/auth/userinfo.email', // Get user's email address
        'https://www.googleapis.com/auth/userinfo.profile', // Get user's profile info
    ]

    constructor() {
        // Load OAuth credentials from environment
        const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
        const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
        const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'

        if (!clientId || !clientSecret) {
            throw new Error(
                'Missing OAuth credentials. Please set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET'
            )
        }

        this.config = {
            clientId,
            clientSecret,
            redirectUri,
        }

        // Initialize OAuth2 client
        this.oauth2Client = new OAuth2Client(
            this.config.clientId,
            this.config.clientSecret,
            this.config.redirectUri
        )

        console.log('[OAuth2] Initialized with client ID:', clientId)
        console.log('[OAuth2] Redirect URI:', redirectUri)
    }

    /**
     * Get the OAuth Client ID
     * This is what customers need to add in App Access Control
     */
    getClientId(): string {
        return this.config.clientId
    }

    /**
     * Generate the authorization URL that users click to start OAuth flow
     * 
     * @param state - Optional state parameter for CSRF protection
     * @returns Authorization URL to redirect user to
     */
    getAuthorizationUrl(state?: string): string {
        const authUrl = this.oauth2Client.generateAuthUrl({
            access_type: 'offline', // Request refresh token
            prompt: 'consent', // Force consent screen to get refresh token
            scope: this.REQUIRED_SCOPES,
            state: state || '', // CSRF protection
            include_granted_scopes: true, // Incremental authorization
        })

        console.log('[OAuth2] Generated authorization URL')
        return authUrl
    }

    /**
     * Exchange authorization code for tokens
     * This is called in the OAuth callback after user consents
     * 
     * @param code - Authorization code from Google
     * @returns OAuth2 tokens including refresh token
     */
    async getTokensFromCode(code: string): Promise<OAuth2Tokens> {
        try {
            console.log('[OAuth2] Exchanging authorization code for tokens')

            const { tokens } = await this.oauth2Client.getToken(code)

            if (!tokens.access_token || !tokens.refresh_token) {
                throw new Error('Failed to get access token or refresh token')
            }

            // Calculate expiration date
            const expiresAt = tokens.expiry_date
                ? new Date(tokens.expiry_date)
                : new Date(Date.now() + 3600 * 1000) // Default 1 hour

            console.log('[OAuth2] ✅ Successfully obtained tokens')

            return {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiresAt,
                scope: tokens.scope || this.REQUIRED_SCOPES.join(' '),
            }
        } catch (error) {
            console.error('[OAuth2] Failed to exchange code for tokens:', error)
            throw new Error(`Failed to get tokens: ${error}`)
        }
    }

    /**
     * Refresh an expired access token using refresh token
     * 
     * @param refreshToken - The user's refresh token
     * @returns New access token and expiration
     */
    async refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string
        expiresAt: Date
    }> {
        try {
            console.log('[OAuth2] Refreshing access token')

            // Set the refresh token
            this.oauth2Client.setCredentials({
                refresh_token: refreshToken,
            })

            // Get new access token
            const { credentials } = await this.oauth2Client.refreshAccessToken()

            if (!credentials.access_token) {
                throw new Error('Failed to refresh access token')
            }

            const expiresAt = credentials.expiry_date
                ? new Date(credentials.expiry_date)
                : new Date(Date.now() + 3600 * 1000)

            console.log('[OAuth2] ✅ Access token refreshed successfully')

            return {
                accessToken: credentials.access_token,
                expiresAt,
            }
        } catch (error) {
            console.error('[OAuth2] Failed to refresh access token:', error)

            // Check if refresh token is invalid/revoked
            if (error instanceof Error && error.message.includes('invalid_grant')) {
                throw new Error(
                    'Refresh token is invalid or revoked. User needs to re-authenticate.'
                )
            }

            throw new Error(`Failed to refresh token: ${error}`)
        }
    }

    /**
     * Get user information from Google
     * Useful after OAuth to get the user's email address
     * 
     * @param accessToken - User's access token
     * @returns User information (email, name, picture)
     */
    async getUserInfo(accessToken: string): Promise<{
        email: string
        name: string
        picture?: string
        emailVerified: boolean
    }> {
        try {
            console.log('[OAuth2] Fetching user info')

            this.oauth2Client.setCredentials({
                access_token: accessToken,
            })

            const oauth2 = google.oauth2({
                auth: this.oauth2Client,
                version: 'v2',
            })

            const { data } = await oauth2.userinfo.get()

            if (!data.email) {
                throw new Error('Failed to get user email')
            }

            console.log(`[OAuth2] ✅ Got user info for: ${data.email}`)

            return {
                email: data.email,
                name: data.name || '',
                picture: data.picture ?? undefined,
                emailVerified: data.verified_email || false,
            }
        } catch (error) {
            console.error('[OAuth2] Failed to get user info:', error)
            throw new Error(`Failed to get user info: ${error}`)
        }
    }

    /**
     * Verify that an access token is valid
     * 
     * @param accessToken - Token to verify
     * @returns True if valid, false otherwise
     */
    async verifyAccessToken(accessToken: string): Promise<boolean> {
        try {
            const ticket = await this.oauth2Client.verifyIdToken({
                idToken: accessToken,
            })
            return !!ticket
        } catch (error) {
            // Access token verification failed
            return false
        }
    }

    /**
     * Revoke a user's tokens (disconnect account)
     * 
     * @param accessToken - User's access token
     */
    async revokeToken(accessToken: string): Promise<void> {
        try {
            console.log('[OAuth2] Revoking tokens')
            await this.oauth2Client.revokeToken(accessToken)
            console.log('[OAuth2] ✅ Tokens revoked successfully')
        } catch (error) {
            console.error('[OAuth2] Failed to revoke tokens:', error)
            throw new Error(`Failed to revoke tokens: ${error}`)
        }
    }

    /**
     * Get setup instructions for customers
     * This tells them how to allowlist your app in App Access Control
     */
    getSetupInstructions(): {
        clientId: string
        steps: string[]
        adminConsoleUrl: string
    } {
        return {
            clientId: this.config.clientId,
            adminConsoleUrl: 'https://admin.google.com/ac/owl/list',
            steps: [
                '1. Go to Google Workspace Admin Console',
                '2. Navigate to: Security → Access and data control → API Controls',
                '3. Click "MANAGE APP ACCESS" (or "Configure new app")',
                '4. Select "Configure new app" → "OAuth App Name Or Client ID"',
                `5. Paste this Client ID: ${this.config.clientId}`,
                '6. Click "Search" and select your app',
                '7. Select "All Users" or specific organizational units',
                '8. Choose "Trusted" to allow access to all Google services',
                '9. Click "Finish"',
            ],
        }
    }
}

// Export singleton instance
export const oauth2Service = new GoogleOAuth2Service()