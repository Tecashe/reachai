// import { db } from "@/lib/db"
// import { EmailStatus } from "@prisma/client"

// interface SendEmailOptions {
//   to: string
//   subject: string
//   html: string
//   text?: string
//   from?: string
//   replyTo?: string
//   trackingEnabled?: boolean
//   prospectId: string // Made required since EmailLog requires prospectId
// }

// interface SendEmailResult {
//   success: boolean
//   providerId?: string // Changed from messageId to match schema
//   error?: string
//   logId?: string
// }

// export class EmailSender {
//   private apiKey: string
//   private fromEmail: string

//   constructor() {
//     this.apiKey = process.env.RESEND_API_KEY || ""
//     this.fromEmail = process.env.FROM_EMAIL || "noreply@reachai.com"
//   }

//   async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
//     try {
//       // Add tracking pixels and link tracking if enabled
//       let htmlContent = options.html
//       let trackingId: string | undefined

//       if (options.trackingEnabled) {
//         trackingId = this.generateTrackingId()
//         htmlContent = this.addTrackingPixel(options.html, trackingId)
//         htmlContent = this.addLinkTracking(htmlContent, trackingId)
//       }

//       // Create email log entry
//       const log = await db.emailLog.create({
//         data: {
//           prospectId: options.prospectId,
//           subject: options.subject,
//           body: options.html,
//           fromEmail: options.from || this.fromEmail,
//           toEmail: options.to,
//           status: EmailStatus.QUEUED,
//           trackingId,
//           provider: "resend",
//         },
//       })

//       // Send via Resend API
//       const response = await fetch("https://api.resend.com/emails", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${this.apiKey}`,
//         },
//         body: JSON.stringify({
//           from: options.from || this.fromEmail,
//           to: options.to,
//           subject: options.subject,
//           html: htmlContent,
//           text: options.text,
//           reply_to: options.replyTo,
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to send email")
//       }

//       // Update log with success
//       await db.emailLog.update({
//         where: { id: log.id },
//         data: {
//           status: EmailStatus.SENT,
//           sentAt: new Date(),
//           providerId: data.id,
//         },
//       })

//       return {
//         success: true,
//         providerId: data.id,
//         logId: log.id,
//       }
//     } catch (error) {
//       console.error("[v0] Email send error:", error)

//       // Update log with failure if log was created
//       if (options.prospectId) {
//         await db.emailLog.updateMany({
//           where: {
//             prospectId: options.prospectId,
//             status: EmailStatus.QUEUED,
//           },
//           data: {
//             status: EmailStatus.FAILED,
//             errorMessage: error instanceof Error ? error.message : "Unknown error",
//           },
//         })
//       }

//       return {
//         success: false,
//         error: error instanceof Error ? error.message : "Unknown error",
//       }
//     }
//   }

//   async sendBulkEmails(emails: SendEmailOptions[]): Promise<SendEmailResult[]> {
//     const results: SendEmailResult[] = []

//     for (const email of emails) {
//       const result = await this.sendEmail(email)
//       results.push(result)

//       // Add delay between emails to avoid rate limits
//       await this.delay(1000)
//     }

//     return results
//   }

//   // For scheduling, use a separate queue/cron system

//   private generateTrackingId(): string {
//     return `track_${Date.now()}_${Math.random().toString(36).substring(7)}`
//   }

//   private addTrackingPixel(html: string, trackingId: string): string {
//     const trackingPixel = `<img src="${process.env.NEXT_PUBLIC_APP_URL}/api/track/open/${trackingId}" width="1" height="1" style="display:none" alt="" />`
//     return html.replace("</body>", `${trackingPixel}</body>`)
//   }

//   private addLinkTracking(html: string, trackingId: string): string {
//     // Replace all links with tracked versions
//     return html.replace(/href="(https?:\/\/[^"]+)"/g, (match, url) => {
//       const trackedUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/track/click/${trackingId}?url=${encodeURIComponent(url)}`
//       return `href="${trackedUrl}"`
//     })
//   }

//   private delay(ms: number): Promise<void> {
//     return new Promise((resolve) => setTimeout(resolve, ms))
//   }
// }

// export const emailSender = new EmailSender()

import { db } from "@/lib/db"
import { EmailStatus } from "@prisma/client"

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
  trackingEnabled?: boolean
  prospectId: string // Made required since EmailLog requires prospectId
}

interface SendEmailResult {
  success: boolean
  providerId?: string // Changed from messageId to match schema
  error?: string
  logId?: string
}

export class EmailSender {
  private apiKey: string
  private fromEmail: string

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || ""
    this.fromEmail = process.env.FROM_EMAIL || "noreply@reachai.com"
  }

  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      // Add tracking pixels and link tracking if enabled
      let htmlContent = options.html
      let trackingId: string | undefined

      if (options.trackingEnabled) {
        trackingId = this.generateTrackingId()
        htmlContent = this.addTrackingPixel(options.html, trackingId)
        htmlContent = this.addLinkTracking(htmlContent, trackingId)
      }

      // Create email log entry
      const log = await db.emailLog.create({
        data: {
          prospectId: options.prospectId,
          subject: options.subject,
          body: options.html,
          fromEmail: options.from || this.fromEmail,
          toEmail: options.to,
          status: EmailStatus.QUEUED,
          trackingId,
          provider: "resend",
        },
      })

      // Send via Resend API
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: options.from || this.fromEmail,
          to: options.to,
          subject: options.subject,
          html: htmlContent,
          text: options.text,
          reply_to: options.replyTo,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send email")
      }

      // Update log with success
      await db.emailLog.update({
        where: { id: log.id },
        data: {
          status: EmailStatus.SENT,
          sentAt: new Date(),
          providerId: data.id,
        },
      })

      return {
        success: true,
        providerId: data.id,
        logId: log.id,
      }
    } catch (error) {
      console.error("[v0] Email send error:", error)

      // Update log with failure if log was created
      if (options.prospectId) {
        await db.emailLog.updateMany({
          where: {
            prospectId: options.prospectId,
            status: EmailStatus.QUEUED,
          },
          data: {
            status: EmailStatus.FAILED,
            errorMessage: error instanceof Error ? error.message : "Unknown error",
          },
        })
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async sendBulkEmails(emails: SendEmailOptions[]): Promise<SendEmailResult[]> {
    const results: SendEmailResult[] = []

    for (const email of emails) {
      const result = await this.sendEmail(email)
      results.push(result)

      // Add delay between emails to avoid rate limits
      await this.delay(1000)
    }

    return results
  }

  // For scheduling, use a separate queue/cron system

  private generateTrackingId(): string {
    return `track_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }

  private addTrackingPixel(html: string, trackingId: string): string {
    const trackingPixel = `<img src="${process.env.NEXT_PUBLIC_APP_URL}/api/track/open/${trackingId}" width="1" height="1" style="display:none" alt="" />`
    return html.replace("</body>", `${trackingPixel}</body>`)
  }

  private addLinkTracking(html: string, trackingId: string): string {
    // Replace all links with tracked versions
    return html.replace(/href="(https?:\/\/[^"]+)"/g, (match, url) => {
      const trackedUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/track/click/${trackingId}?url=${encodeURIComponent(url)}`
      return `href="${trackedUrl}"`
    })
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const emailSender = new EmailSender()

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  return emailSender.sendEmail(options)
}
