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

// export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
//   return emailSender.sendEmail(options)
// }

import { resend } from "../resend"
import { db } from "../db"
import { logger } from "../logger"
import { env } from "../env"
import { nanoid } from "nanoid"

interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
  trackingEnabled?: boolean
  prospectId?: string
  campaignId?: string
  fromEmail?: string
  fromName?: string
}

interface SendEmailResult {
  success: boolean
  providerId?: string
  logId?: string
  error?: string
}

class EmailSender {
  private generateTrackingId(): string {
    return nanoid(32)
  }

  private injectTrackingPixel(html: string, trackingId: string): string {
    const trackingPixelUrl = `${env.NEXT_PUBLIC_APP_URL}/api/track/open/${trackingId}`
    const trackingPixel = `<img src="${trackingPixelUrl}" width="1" height="1" alt="" style="display:none;" />`

    // Try to inject before closing body tag, otherwise append
    if (html.includes("</body>")) {
      return html.replace("</body>", `${trackingPixel}</body>`)
    }
    return html + trackingPixel
  }

  private wrapLinksWithTracking(html: string, trackingId: string): string {
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi

    return html.replace(linkRegex, (match, url) => {
      // Skip if already a tracking link
      if (url.includes("/api/track/click/")) {
        return match
      }

      // Create tracking URL
      const trackingUrl = `${env.NEXT_PUBLIC_APP_URL}/api/track/click/${trackingId}?url=${encodeURIComponent(url)}`
      return match.replace(url, trackingUrl)
    })
  }

  async sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
    const {
      to,
      subject,
      html,
      text,
      trackingEnabled = true,
      prospectId,
      campaignId,
      fromEmail = env.RESEND_FROM_EMAIL,
      fromName = "ReachAI",
    } = params

    try {
      // Generate tracking ID
      const trackingId = trackingEnabled ? this.generateTrackingId() : undefined

      // Inject tracking
      let trackedHtml = html
      if (trackingEnabled && trackingId) {
        trackedHtml = this.injectTrackingPixel(html, trackingId)
        trackedHtml = this.wrapLinksWithTracking(trackedHtml, trackingId)
      }

      // Create email log
      const emailLog = await db.emailLog.create({
        data: {
          prospectId: prospectId || "",
          subject,
          body: html,
          fromEmail,
          toEmail: to,
          status: "QUEUED",
          trackingId,
          provider: "resend",
        },
      })

      // Send via Resend
      const { data, error } = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to,
        subject,
        html: trackedHtml,
        text: text || this.htmlToText(html),
      })

      if (error) {
        logger.error("Failed to send email via Resend", error, { to, subject })

        // Update log with error
        await db.emailLog.update({
          where: { id: emailLog.id },
          data: {
            status: "FAILED",
            errorMessage: error.message,
          },
        })

        return {
          success: false,
          error: error.message,
        }
      }

      // Update log with success
      await db.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: "SENT",
          sentAt: new Date(),
          providerId: data?.id,
        },
      })

      // Update prospect stats
      if (prospectId) {
        await db.prospect.update({
          where: { id: prospectId },
          data: {
            emailsReceived: { increment: 1 },
            lastContactedAt: new Date(),
            status: "CONTACTED",
          },
        })
      }

      // Update campaign stats
      if (campaignId) {
        await db.campaign.update({
          where: { id: campaignId },
          data: {
            emailsSent: { increment: 1 },
          },
        })
      }

      logger.info("Email sent successfully", { to, subject, providerId: data?.id })

      return {
        success: true,
        providerId: data?.id,
        logId: emailLog.id,
      }
    } catch (error) {
      logger.error("Email sending exception", error as Error, { to, subject })
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async sendBulkEmails(emails: SendEmailParams[]): Promise<SendEmailResult[]> {
    logger.info(`Sending ${emails.length} bulk emails`)

    // Send in batches to avoid rate limits
    const batchSize = 10
    const results: SendEmailResult[] = []

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)
      const batchResults = await Promise.all(batch.map((email) => this.sendEmail(email)))
      results.push(...batchResults)

      // Wait between batches to respect rate limits
      if (i + batchSize < emails.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    const successCount = results.filter((r) => r.success).length
    logger.info(`Bulk email send complete: ${successCount}/${emails.length} successful`)

    return results
  }

  private htmlToText(html: string): string {
    // Basic HTML to text conversion
    return html
      .replace(/<style[^>]*>.*<\/style>/gm, "")
      .replace(/<script[^>]*>.*<\/script>/gm, "")
      .replace(/<[^>]+>/gm, "")
      .replace(/\s+/g, " ")
      .trim()
  }

  async getEmailStatus(logId: string) {
    const log = await db.emailLog.findUnique({
      where: { id: logId },
      include: {
        prospect: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return log
  }

  async retryFailedEmail(logId: string): Promise<SendEmailResult> {
    const log = await db.emailLog.findUnique({
      where: { id: logId },
    })

    if (!log) {
      return { success: false, error: "Email log not found" }
    }

    if (log.status !== "FAILED") {
      return { success: false, error: "Email is not in failed state" }
    }

    // Increment retry count
    await db.emailLog.update({
      where: { id: logId },
      data: {
        retryCount: { increment: 1 },
        status: "QUEUED",
      },
    })

    // Retry sending
    return this.sendEmail({
      to: log.toEmail,
      subject: log.subject,
      html: log.body,
      prospectId: log.prospectId,
    })
  }
}

export const emailSender = new EmailSender()

export const sendEmail = (params: SendEmailParams) => emailSender.sendEmail(params)
export const sendBulkEmails = (emails: SendEmailParams[]) => emailSender.sendBulkEmails(emails)
export const getEmailStatus = (logId: string) => emailSender.getEmailStatus(logId)
export const retryFailedEmail = (logId: string) => emailSender.retryFailedEmail(logId)

export type { SendEmailParams, SendEmailResult }
