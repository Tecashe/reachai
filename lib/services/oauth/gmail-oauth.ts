

import { google } from "googleapis"

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.compose",
]

export class GmailOAuthService {
  private oauth2Client

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/gmail/callback`,
    )
  }

  /**
   * Generate OAuth URL for user to authorize Gmail access
   */
  getAuthUrl(userId: string): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      state: userId, // Pass userId to identify user in callback
      prompt: "consent", // Force consent screen to get refresh token
    })
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokensFromCode(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code)
    return tokens
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string) {
    this.oauth2Client.setCredentials({
      refresh_token: refreshToken,
    })

    const { credentials } = await this.oauth2Client.refreshAccessToken()
    return credentials
  }

  /**
   * Send email via Gmail API
   */
  async sendEmail(
    accessToken: string,
    refreshToken: string,
    params: {
      to: string
      subject: string
      html: string
      from: string
    },
  ): Promise<string> {
    // Set credentials
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    const gmail = google.gmail({ version: "v1", auth: this.oauth2Client })

    // Create email message
    const message = [
      `From: ${params.from}`,
      `To: ${params.to}`,
      `Subject: ${params.subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=utf-8",
      "",
      params.html,
    ].join("\n")

    // Encode message in base64url
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")

    // Send email
    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    })

    return response.data.id || ""
  }

  /**
   * Get user's Gmail profile
   */
  async getUserProfile(accessToken: string) {
    this.oauth2Client.setCredentials({
      access_token: accessToken,
    })

    const gmail = google.gmail({ version: "v1", auth: this.oauth2Client })
    const response = await gmail.users.getProfile({ userId: "me" })

    return {
      email: response.data.emailAddress || "",
      messagesTotal: response.data.messagesTotal || 0,
    }
  }
}

export const gmailOAuth = new GmailOAuthService()
