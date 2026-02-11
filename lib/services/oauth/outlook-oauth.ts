import { Client } from "@microsoft/microsoft-graph-client"

const SCOPES = [
  "openid",
  "email",
  "profile",
  "offline_access",
  "https://outlook.office.com/IMAP.AccessAsUser.All",
  "https://outlook.office.com/SMTP.Send",
  "https://outlook.office.com/Mail.Send",
]

export class OutlookOAuthService {
  private clientId: string
  private clientSecret: string
  private tenantId = "common" // Use 'common' for multi-tenant
  private redirectUri: string

  constructor() {
    this.clientId = process.env.OUTLOOK_CLIENT_ID || ""
    this.clientSecret = process.env.OUTLOOK_CLIENT_SECRET || ""
    this.redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/outlook/callback`
  }

  /**
   * Generate OAuth URL for user to authorize Outlook access
   */
  getAuthUrl(userId: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: "code",
      redirect_uri: this.redirectUri,
      response_mode: "query",
      scope: SCOPES.join(" "),
      state: userId,
      prompt: "select_account",
      sso_reload: "true",
    })

    return `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/authorize?${params.toString()}`
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokensFromCode(code: string) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      redirect_uri: this.redirectUri,
      grant_type: "authorization_code",
      scope: SCOPES.join(" "),
    })

    const response = await fetch(`https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get tokens: ${error}`)
    }

    const data = await response.json()
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
      scope: SCOPES.join(" "),
    })

    const response = await fetch(`https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to refresh token: ${error}`)
    }

    const data = await response.json()
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token || refreshToken, // Outlook may not return new refresh token
      expires_in: data.expires_in,
    }
  }

  /**
   * Send email via Microsoft Graph API
   */
  async sendEmail(
    accessToken: string,
    params: {
      to: string
      subject: string
      html: string
      from: string
    },
  ): Promise<string> {
    const client = Client.init({
      authProvider: (done) => {
        done(null, accessToken)
      },
    })

    const message = {
      subject: params.subject,
      body: {
        contentType: "HTML",
        content: params.html,
      },
      toRecipients: [
        {
          emailAddress: {
            address: params.to,
          },
        },
      ],
    }

    const response = await client.api("/me/sendMail").post({
      message,
      saveToSentItems: true,
    })

    // Microsoft Graph doesn't return message ID for sendMail
    // We'll generate a unique ID for tracking
    return `outlook-${Date.now()}-${Math.random().toString(36).substring(7)}`
  }

  /**
   * Get user's Outlook profile
   */
  async getUserProfile(accessToken: string) {
    const client = Client.init({
      authProvider: (done) => {
        done(null, accessToken)
      },
    })

    const user = await client.api("/me").get()

    return {
      email: user.mail || user.userPrincipalName || "",
      displayName: user.displayName || "",
    }
  }
}

export const outlookOAuth = new OutlookOAuthService()
