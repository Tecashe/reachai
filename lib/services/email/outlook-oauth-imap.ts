// // lib/services/email/outlook-oauth-imap.ts
// import { ConfidentialClientApplication } from '@azure/msal-node'
// import type { AuthenticationResult } from '@azure/msal-node'
// import Imap from 'imap'
// import nodemailer from 'nodemailer'
// import type { Transporter } from 'nodemailer'
// import type SMTPTransport from 'nodemailer/lib/smtp-transport'

// interface OutlookTokens {
//   accessToken: string
//   refreshToken: string
//   expiresOn: Date
// }

// export class OutlookOAuthImapService {
//   private msalClient: ConfidentialClientApplication

//   constructor() {
//     this.msalClient = new ConfidentialClientApplication({
//       auth: {
//         clientId: process.env.MICROSOFT_CLIENT_ID!,
//         clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
//         authority: 'https://login.microsoftonline.com/common',
//       },
//     })
//   }

//   /**
//    * Generate OAuth URL for Outlook with IMAP/SMTP scopes
//    */
//   async getAuthUrl(userId: string): Promise<string> {
//     const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/outlook/callback`
    
//     return await this.msalClient.getAuthCodeUrl({
//       scopes: [
//         'https://outlook.office.com/IMAP.AccessAsUser.All',
//         'https://outlook.office.com/SMTP.Send',
//         'offline_access',
//         'User.Read',
//       ],
//       redirectUri,
//       state: userId,
//     })
//   }

//   /**
//    * Exchange authorization code for tokens
//    */
//   async getTokensFromCode(code: string): Promise<OutlookTokens> {
//     const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/outlook/callback`
    
//     const response: AuthenticationResult = await this.msalClient.acquireTokenByCode({
//       code,
//       scopes: [
//         'https://outlook.office.com/IMAP.AccessAsUser.All',
//         'https://outlook.office.com/SMTP.Send',
//         'offline_access',
//       ],
//       redirectUri,
//     })

//     if (!response.accessToken) {
//       throw new Error('No access token received from Microsoft')
//     }

//     return {
//       accessToken: response.accessToken,
//       refreshToken: response.refreshToken || '',
//       expiresOn: response.expiresOn || new Date(Date.now() + 3600 * 1000),
//     }
//   }

//   /**
//    * Refresh access token
//    */
//   async refreshAccessToken(refreshToken: string): Promise<string> {
//     try {
//       const response: AuthenticationResult = await this.msalClient.acquireTokenByRefreshToken({
//         refreshToken,
//         scopes: [
//           'https://outlook.office.com/IMAP.AccessAsUser.All',
//           'https://outlook.office.com/SMTP.Send',
//         ],
//       })

//       return response.accessToken
//     } catch (error) {
//       console.error('Failed to refresh Outlook token:', error)
//       throw new Error('Failed to refresh access token')
//     }
//   }

//   /**
//    * Get user profile
//    */
//   async getUserProfile(accessToken: string): Promise<{ email: string; name: string }> {
//     const response = await fetch('https://graph.microsoft.com/v1.0/me', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })

//     const data = await response.json()
    
//     return {
//       email: data.mail || data.userPrincipalName,
//       name: data.displayName || data.mail,
//     }
//   }

//   /**
//    * Generate XOAUTH2 token for IMAP authentication
//    */
//   generateXOAuth2Token(email: string, accessToken: string): string {
//     const authString = `user=${email}\x01auth=Bearer ${accessToken}\x01\x01`
//     return Buffer.from(authString).toString('base64')
//   }

//   /**
//    * Create IMAP connection using OAuth
//    */
//   async createImapConnection(email: string, accessToken: string): Promise<Imap> {
//     const xoauth2Token = this.generateXOAuth2Token(email, accessToken)

//     // Type as 'any' to bypass TypeScript issues with node-imap
//     const config: any = {
//       user: email,
//       xoauth2: xoauth2Token,
//       host: 'outlook.office365.com',
//       port: 993,
//       tls: true,
//       tlsOptions: {
//         rejectUnauthorized: false,
//       },
//     }

//     const imap = new Imap(config)

//     return new Promise((resolve, reject) => {
//       imap.once('ready', () => resolve(imap))
//       imap.once('error', reject)
//       imap.connect()
//     })
//   }

//   /**
//    * Create SMTP transporter using OAuth
//    */
//   createSmtpTransporter(email: string, accessToken: string): Transporter<SMTPTransport.SentMessageInfo> {
//     const config: SMTPTransport.Options = {
//       host: 'smtp.office365.com',
//       port: 587,
//       secure: false, // Use STARTTLS
//       auth: {
//         type: 'OAuth2',
//         user: email,
//         accessToken: accessToken,
//       },
//     }

//     return nodemailer.createTransport(config)
//   }

//   /**
//    * Send email using SMTP with OAuth
//    */
//   async sendEmail(
//     email: string,
//     accessToken: string,
//     to: string,
//     subject: string,
//     body: string,
//     html?: string
//   ): Promise<void> {
//     const transporter = this.createSmtpTransporter(email, accessToken)

//     await transporter.sendMail({
//       from: email,
//       to,
//       subject,
//       text: body,
//       html: html || body,
//     })
//   }

//   /**
//    * Test IMAP connection
//    */
//   async testImapConnection(email: string, accessToken: string): Promise<boolean> {
//     try {
//       const imap = await this.createImapConnection(email, accessToken)
//       imap.end()
//       return true
//     } catch (error) {
//       console.error('IMAP connection test failed:', error)
//       return false
//     }
//   }

//   /**
//    * Test SMTP connection
//    */
//   async testSmtpConnection(email: string, accessToken: string): Promise<boolean> {
//     try {
//       const transporter = this.createSmtpTransporter(email, accessToken)
//       await transporter.verify()
//       return true
//     } catch (error) {
//       console.error('SMTP connection test failed:', error)
//       return false
//     }
//   }

//   /**
//    * Verify both IMAP and SMTP connections
//    */
//   async verifyConnections(email: string, accessToken: string): Promise<{
//     imap: boolean
//     smtp: boolean
//     healthy: boolean
//   }> {
//     const [imap, smtp] = await Promise.all([
//       this.testImapConnection(email, accessToken),
//       this.testSmtpConnection(email, accessToken),
//     ])

//     return {
//       imap,
//       smtp,
//       healthy: imap && smtp,
//     }
//   }
// }

// export const outlookOAuthImap = new OutlookOAuthImapService()




// lib/services/email/outlook-oauth-imap.ts
import { ConfidentialClientApplication } from '@azure/msal-node'
import type { AuthenticationResult } from '@azure/msal-node'
import Imap from 'imap'
import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'

interface OutlookTokens {
  accessToken: string
  refreshToken: string
  expiresOn: Date
}

export class OutlookOAuthImapService {
  private msalClient: ConfidentialClientApplication

  constructor() {
    this.msalClient = new ConfidentialClientApplication({
      auth: {
        clientId: process.env.MICROSOFT_CLIENT_ID!,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
        authority: 'https://login.microsoftonline.com/common',
      },
    })
  }

  /**
   * Generate OAuth URL for Outlook with IMAP/SMTP scopes
   */
  async getAuthUrl(userId: string): Promise<string> {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/outlook/callback`
    
    return await this.msalClient.getAuthCodeUrl({
      scopes: [
        'https://outlook.office.com/IMAP.AccessAsUser.All',
        'https://outlook.office.com/SMTP.Send',
        'offline_access',
        'User.Read',
      ],
      redirectUri,
      state: userId,
    })
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokensFromCode(code: string): Promise<OutlookTokens> {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/outlook/callback`
    
    const response = await this.msalClient.acquireTokenByCode({
      code,
      scopes: [
        'https://outlook.office.com/IMAP.AccessAsUser.All',
        'https://outlook.office.com/SMTP.Send',
        'offline_access',
      ],
      redirectUri,
    })

    if (!response || !response.accessToken) {
      throw new Error('No access token received from Microsoft')
    }

    return {
      accessToken: response.accessToken,
      refreshToken: (response.account?.homeAccountId || response.idToken) || '',
      expiresOn: response.expiresOn || new Date(Date.now() + 3600 * 1000),
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      // Use acquireTokenSilent with the account information instead
      const accounts = await this.msalClient.getTokenCache().getAllAccounts()
      
      if (accounts.length === 0) {
        throw new Error('No accounts found in cache')
      }

      const response = await this.msalClient.acquireTokenSilent({
        account: accounts[0],
        scopes: [
          'https://outlook.office.com/IMAP.AccessAsUser.All',
          'https://outlook.office.com/SMTP.Send',
        ],
      })

      if (!response || !response.accessToken) {
        throw new Error('Failed to refresh access token')
      }

      return response.accessToken
    } catch (error) {
      console.error('Failed to refresh Outlook token:', error)
      throw new Error('Failed to refresh access token')
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(accessToken: string): Promise<{ email: string; name: string }> {
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()
    
    return {
      email: data.mail || data.userPrincipalName,
      name: data.displayName || data.mail,
    }
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
      host: 'outlook.office365.com',
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
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // Use STARTTLS
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
   * Verify both IMAP and SMTP 
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

export const outlookOAuthImap = new OutlookOAuthImapService()










