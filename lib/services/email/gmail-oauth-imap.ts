// lib/services/email/gmail-oauth-imap.ts
import { google } from 'googleapis'
import Imap from 'imap'
import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'

interface GmailTokens {
  access_token: string
  refresh_token: string
  expiry_date: number
}

export class GmailOAuthImapService {
  private oauth2Client: any

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/gmail/callback`
    )
  }

  /**
   * Generate OAuth URL with correct scopes for IMAP/SMTP
   * NOT gmail.send - we use mail.google.com for IMAP/SMTP
   */
  getAuthUrl(userId: string): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', // Force to get refresh_token
      scope: [
        'https://mail.google.com/', // Full mail access for IMAP/SMTP
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      state: userId, // Pass userId for callback
    })
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokensFromCode(code: string): Promise<GmailTokens> {
    const { tokens } = await this.oauth2Client.getToken(code)
    this.oauth2Client.setCredentials(tokens)
    return tokens as GmailTokens
  }

  /**
   * Get user profile information
   */
  async getUserProfile(accessToken: string): Promise<{ email: string; name: string }> {
    this.oauth2Client.setCredentials({ access_token: accessToken })
    const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client })
    const { data } = await oauth2.userinfo.get()
    
    return {
      email: data.email!,
      name: data.name || data.email!,
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    this.oauth2Client.setCredentials({ refresh_token: refreshToken })
    const { credentials } = await this.oauth2Client.refreshAccessToken()
    return credentials.access_token!
  }

  /**
   * Generate XOAUTH2 token for IMAP authentication
   */
  generateXOAuth2Token(email: string, accessToken: string): string {
    const authString = `user=${email}\x01auth=Bearer ${accessToken}\x01\x01`
    return Buffer.from(authString).toString('base64')
  }

  /**
   * Create IMAP connection using OAuth
   */
  async createImapConnection(email: string, accessToken: string): Promise<Imap> {
    const xoauth2Token = this.generateXOAuth2Token(email, accessToken)

    // Type as 'any' to bypass TypeScript issues with node-imap
    const config: any = {
      user: email,
      xoauth2: xoauth2Token,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false,
      },
    }

    const imap = new Imap(config)

    return new Promise((resolve, reject) => {
      imap.once('ready', () => resolve(imap))
      imap.once('error', reject)
      imap.connect()
    })
  }

  /**
   * Create SMTP transporter using OAuth
   */
  createSmtpTransporter(email: string, accessToken: string): Transporter<SMTPTransport.SentMessageInfo> {
    const config: SMTPTransport.Options = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: email,
        accessToken: accessToken,
      },
    }

    return nodemailer.createTransport(config)
  }

  /**
   * Send email using SMTP with OAuth
   */
  async sendEmail(
    email: string,
    accessToken: string,
    to: string,
    subject: string,
    body: string,
    html?: string
  ): Promise<void> {
    const transporter = this.createSmtpTransporter(email, accessToken)

    await transporter.sendMail({
      from: email,
      to,
      subject,
      text: body,
      html: html || body,
    })
  }

  /**
   * Test IMAP connection
   */
  async testImapConnection(email: string, accessToken: string): Promise<boolean> {
    try {
      const imap = await this.createImapConnection(email, accessToken)
      imap.end()
      return true
    } catch (error) {
      console.error('IMAP connection test failed:', error)
      return false
    }
  }

  /**
   * Test SMTP connection
   */
  async testSmtpConnection(email: string, accessToken: string): Promise<boolean> {
    try {
      const transporter = this.createSmtpTransporter(email, accessToken)
      await transporter.verify()
      return true
    } catch (error) {
      console.error('SMTP connection test failed:', error)
      return false
    }
  }

  /**
   * Verify both IMAP and SMTP connections
   */
  async verifyConnections(email: string, accessToken: string): Promise<{
    imap: boolean
    smtp: boolean
    healthy: boolean
  }> {
    const [imap, smtp] = await Promise.all([
      this.testImapConnection(email, accessToken),
      this.testSmtpConnection(email, accessToken),
    ])

    return {
      imap,
      smtp,
      healthy: imap && smtp,
    }
  }
}

export const gmailOAuthImap = new GmailOAuthImapService()
