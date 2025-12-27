// // lib/services/email/custom-smtp-imap.ts
// import Imap from 'imap'
// import nodemailer from 'nodemailer'

// interface SmtpImapCredentials {
//   email: string
//   // SMTP
//   smtpHost: string
//   smtpPort: number
//   smtpSecure: boolean // true for 465, false for 587
//   smtpUsername: string
//   smtpPassword: string
//   // IMAP
//   imapHost: string
//   imapPort: number
//   imapUsername: string
//   imapPassword: string
// }

// export class CustomSmtpImapService {
//   /**
//    * Validate SMTP credentials by attempting connection
//    */
//   async validateSmtpCredentials(credentials: SmtpImapCredentials): Promise<boolean> {
//     try {
//       const transporter = this.createSmtpTransporter(credentials)
//       await transporter.verify()
//       return true
//     } catch (error) {
//       console.error('SMTP validation failed:', error)
//       return false
//     }
//   }

//   /**
//    * Validate IMAP credentials by attempting connection
//    */
//   async validateImapCredentials(credentials: SmtpImapCredentials): Promise<boolean> {
//     try {
//       const imap = await this.createImapConnection(credentials)
//       imap.end()
//       return true
//     } catch (error) {
//       console.error('IMAP validation failed:', error)
//       return false
//     }
//   }

//   /**
//    * Validate both SMTP and IMAP credentials
//    */
//   async validateCredentials(credentials: SmtpImapCredentials): Promise<{
//     smtp: boolean
//     imap: boolean
//     healthy: boolean
//     error?: string
//   }> {
//     try {
//       const [smtp, imap] = await Promise.all([
//         this.validateSmtpCredentials(credentials),
//         this.validateImapCredentials(credentials),
//       ])

//       return {
//         smtp,
//         imap,
//         healthy: smtp && imap,
//         error: !smtp && !imap 
//           ? 'Both SMTP and IMAP failed' 
//           : !smtp 
//           ? 'SMTP connection failed' 
//           : !imap 
//           ? 'IMAP connection failed' 
//           : undefined,
//       }
//     } catch (error) {
//       return {
//         smtp: false,
//         imap: false,
//         healthy: false,
//         error: error instanceof Error ? error.message : 'Validation failed',
//       }
//     }
//   }

//   /**
//    * Create SMTP transporter
//    */
//   createSmtpTransporter(credentials: SmtpImapCredentials) {
//     return nodemailer.createTransport({
//       host: credentials.smtpHost,
//       port: credentials.smtpPort,
//       secure: credentials.smtpSecure,
//       auth: {
//         user: credentials.smtpUsername,
//         pass: credentials.smtpPassword,
//       },
//     })
//   }

//   /**
//    * Create IMAP connection
//    */
//   async createImapConnection(credentials: SmtpImapCredentials): Promise<Imap> {
//     const config = {
//       user: credentials.imapUsername,
//       password: credentials.imapPassword,
//       host: credentials.imapHost,
//       port: credentials.imapPort,
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
//    * Send email using SMTP
//    */
//   async sendEmail(
//     credentials: SmtpImapCredentials,
//     to: string,
//     subject: string,
//     body: string,
//     html?: string
//   ): Promise<void> {
//     const transporter = this.createSmtpTransporter(credentials)

//     await transporter.sendMail({
//       from: credentials.email,
//       to,
//       subject,
//       text: body,
//       html: html || body,
//     })
//   }

//   /**
//    * Detect common SMTP/IMAP settings for popular providers
//    */
//   detectProviderSettings(email: string): Partial<SmtpImapCredentials> | null {
//     const domain = email.split('@')[1]?.toLowerCase()

//     const providers: Record<string, Partial<SmtpImapCredentials>> = {
//       'gmail.com': {
//         smtpHost: 'smtp.gmail.com',
//         smtpPort: 587,
//         smtpSecure: false,
//         imapHost: 'imap.gmail.com',
//         imapPort: 993,
//       },
//       'outlook.com': {
//         smtpHost: 'smtp.office365.com',
//         smtpPort: 587,
//         smtpSecure: false,
//         imapHost: 'outlook.office365.com',
//         imapPort: 993,
//       },
//       'hotmail.com': {
//         smtpHost: 'smtp.office365.com',
//         smtpPort: 587,
//         smtpSecure: false,
//         imapHost: 'outlook.office365.com',
//         imapPort: 993,
//       },
//       'yahoo.com': {
//         smtpHost: 'smtp.mail.yahoo.com',
//         smtpPort: 587,
//         smtpSecure: false,
//         imapHost: 'imap.mail.yahoo.com',
//         imapPort: 993,
//       },
//       'zoho.com': {
//         smtpHost: 'smtp.zoho.com',
//         smtpPort: 587,
//         smtpSecure: false,
//         imapHost: 'imap.zoho.com',
//         imapPort: 993,
//       },
//     }

//     return providers[domain] || null
//   }

//   /**
//    * Get common SMTP providers for transactional emails
//    */
//   getTransactionalProviders(): Array<{
//     name: string
//     smtpHost: string
//     smtpPort: number
//     smtpSecure: boolean
//     requiresApiKey: boolean
//   }> {
//     return [
//       {
//         name: 'SendGrid',
//         smtpHost: 'smtp.sendgrid.net',
//         smtpPort: 587,
//         smtpSecure: false,
//         requiresApiKey: true,
//       },
//       {
//         name: 'Mailgun',
//         smtpHost: 'smtp.mailgun.org',
//         smtpPort: 587,
//         smtpSecure: false,
//         requiresApiKey: true,
//       },
//       {
//         name: 'Amazon SES',
//         smtpHost: 'email-smtp.us-east-1.amazonaws.com',
//         smtpPort: 587,
//         smtpSecure: false,
//         requiresApiKey: true,
//       },
//       {
//         name: 'Postmark',
//         smtpHost: 'smtp.postmarkapp.com',
//         smtpPort: 587,
//         smtpSecure: false,
//         requiresApiKey: true,
//       },
//     ]
//   }
// }

// export const customSmtpImap = new CustomSmtpImapService()
// lib/services/email/custom-smtp-imap.ts
import Imap from 'imap'
import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'

interface SmtpImapCredentials {
  email: string
  // SMTP
  smtpHost: string
  smtpPort: number
  smtpSecure: boolean // true for 465, false for 587
  smtpUsername: string
  smtpPassword: string
  // IMAP
  imapHost: string
  imapPort: number
  imapUsername: string
  imapPassword: string
}

export class CustomSmtpImapService {
  /**
   * Validate SMTP credentials by attempting connection
   */
  async validateSmtpCredentials(credentials: SmtpImapCredentials): Promise<boolean> {
    try {
      const transporter = this.createSmtpTransporter(credentials)
      await transporter.verify()
      return true
    } catch (error) {
      console.error('SMTP validation failed:', error)
      return false
    }
  }

  /**
   * Validate IMAP credentials by attempting connection
   */
  async validateImapCredentials(credentials: SmtpImapCredentials): Promise<boolean> {
    try {
      const imap = await this.createImapConnection(credentials)
      imap.end()
      return true
    } catch (error) {
      console.error('IMAP validation failed:', error)
      return false
    }
  }

  /**
   * Validate both SMTP and IMAP credentials
   */
  async validateCredentials(credentials: SmtpImapCredentials): Promise<{
    smtp: boolean
    imap: boolean
    healthy: boolean
    error?: string
  }> {
    try {
      const [smtp, imap] = await Promise.all([
        this.validateSmtpCredentials(credentials),
        this.validateImapCredentials(credentials),
      ])

      return {
        smtp,
        imap,
        healthy: smtp && imap,
        error: !smtp && !imap 
          ? 'Both SMTP and IMAP failed' 
          : !smtp 
          ? 'SMTP connection failed' 
          : !imap 
          ? 'IMAP connection failed' 
          : undefined,
      }
    } catch (error) {
      return {
        smtp: false,
        imap: false,
        healthy: false,
        error: error instanceof Error ? error.message : 'Validation failed',
      }
    }
  }

  /**
   * Create SMTP transporter
   */
  createSmtpTransporter(credentials: SmtpImapCredentials): Transporter<SMTPTransport.SentMessageInfo> {
    const config: SMTPTransport.Options = {
      host: credentials.smtpHost,
      port: credentials.smtpPort,
      secure: credentials.smtpSecure,
      auth: {
        user: credentials.smtpUsername,
        pass: credentials.smtpPassword,
      },
    }

    return nodemailer.createTransport(config)
  }

  /**
   * Create IMAP connection
   */
  async createImapConnection(credentials: SmtpImapCredentials): Promise<Imap> {
    // Type as 'any' to bypass TypeScript issues with node-imap
    const config: any = {
      user: credentials.imapUsername,
      password: credentials.imapPassword,
      host: credentials.imapHost,
      port: credentials.imapPort,
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
   * Send email using SMTP
   */
  async sendEmail(
    credentials: SmtpImapCredentials,
    to: string,
    subject: string,
    body: string,
    html?: string
  ): Promise<void> {
    const transporter = this.createSmtpTransporter(credentials)

    await transporter.sendMail({
      from: credentials.email,
      to,
      subject,
      text: body,
      html: html || body,
    })
  }

  /**
   * Detect common SMTP/IMAP settings for popular providers
   */
  detectProviderSettings(email: string): Partial<SmtpImapCredentials> | null {
    const domain = email.split('@')[1]?.toLowerCase()

    const providers: Record<string, Partial<SmtpImapCredentials>> = {
      'gmail.com': {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpSecure: false,
        imapHost: 'imap.gmail.com',
        imapPort: 993,
      },
      'outlook.com': {
        smtpHost: 'smtp.office365.com',
        smtpPort: 587,
        smtpSecure: false,
        imapHost: 'outlook.office365.com',
        imapPort: 993,
      },
      'hotmail.com': {
        smtpHost: 'smtp.office365.com',
        smtpPort: 587,
        smtpSecure: false,
        imapHost: 'outlook.office365.com',
        imapPort: 993,
      },
      'yahoo.com': {
        smtpHost: 'smtp.mail.yahoo.com',
        smtpPort: 587,
        smtpSecure: false,
        imapHost: 'imap.mail.yahoo.com',
        imapPort: 993,
      },
      'zoho.com': {
        smtpHost: 'smtp.zoho.com',
        smtpPort: 587,
        smtpSecure: false,
        imapHost: 'imap.zoho.com',
        imapPort: 993,
      },
    }

    return providers[domain] || null
  }

  /**
   * Get common SMTP providers for transactional emails
   */
  getTransactionalProviders(): Array<{
    name: string
    smtpHost: string
    smtpPort: number
    smtpSecure: boolean
    requiresApiKey: boolean
  }> {
    return [
      {
        name: 'SendGrid',
        smtpHost: 'smtp.sendgrid.net',
        smtpPort: 587,
        smtpSecure: false,
        requiresApiKey: true,
      },
      {
        name: 'Mailgun',
        smtpHost: 'smtp.mailgun.org',
        smtpPort: 587,
        smtpSecure: false,
        requiresApiKey: true,
      },
      {
        name: 'Amazon SES',
        smtpHost: 'email-smtp.us-east-1.amazonaws.com',
        smtpPort: 587,
        smtpSecure: false,
        requiresApiKey: true,
      },
      {
        name: 'Postmark',
        smtpHost: 'smtp.postmarkapp.com',
        smtpPort: 587,
        smtpSecure: false,
        requiresApiKey: true,
      },
    ]
  }
}

export const customSmtpImap = new CustomSmtpImapService()

