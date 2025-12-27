// lib/services/oauth/gmail-xoauth2.ts

/**
 * Gmail OAuth for IMAP/SMTP (XOAUTH2)
 * 
 * This uses OAuth for authentication to IMAP/SMTP servers,
 * NOT the Gmail API. This is allowed and doesn't require verification.
 * 
 * Scopes used are for email access only, not Gmail API:
 * - https://mail.google.com/ (Full mail access via IMAP/SMTP)
 */

interface GoogleTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  scope: string
  token_type: string
}

interface GoogleUserProfile {
  email: string
  name: string
  picture?: string
  verified_email: boolean
}

class GmailXOAuth2Service {
  private clientId: string
  private clientSecret: string
  private redirectUri: string

  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID!
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET!
    this.redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/gmail/callback`
  }

  /**
   * Generate authorization URL
   * 
   * IMPORTANT: We use https://mail.google.com/ scope
   * This gives IMAP/SMTP access without using Gmail API
   */
  getAuthorizationUrl(userId: string): string {
    const scopes = [
      'https://mail.google.com/', // Full mail access for IMAP/SMTP
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ]

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: scopes.join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state: userId,
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokensFromCode(code: string): Promise<GoogleTokenResponse> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get tokens: ${error}`)
    }

    return response.json()
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<GoogleTokenResponse> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to refresh token: ${error}`)
    }

    return response.json()
  }

  /**
   * Get user profile
   */
  async getUserProfile(accessToken: string): Promise<GoogleUserProfile> {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get user profile')
    }

    return response.json()
  }
}

export const gmailXOAuth2 = new GmailXOAuth2Service()