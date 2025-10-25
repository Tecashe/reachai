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





// import { resend } from "../resend"
// import { db } from "../db"
// import { logger } from "../logger"
// import { env } from "../env"
// import { nanoid } from "nanoid"

// interface SendEmailParams {
//   to: string
//   subject: string
//   html: string
//   text?: string
//   trackingEnabled?: boolean
//   prospectId?: string
//   campaignId?: string
//   fromEmail?: string
//   fromName?: string
// }

// interface SendEmailResult {
//   success: boolean
//   providerId?: string
//   logId?: string
//   error?: string
// }

// class EmailSender {
//   private generateTrackingId(): string {
//     return nanoid(32)
//   }

//   private injectTrackingPixel(html: string, trackingId: string): string {
//     const trackingPixelUrl = `${env.NEXT_PUBLIC_APP_URL}/api/track/open/${trackingId}`
//     const trackingPixel = `<img src="${trackingPixelUrl}" width="1" height="1" alt="" style="display:none;" />`

//     // Try to inject before closing body tag, otherwise append
//     if (html.includes("</body>")) {
//       return html.replace("</body>", `${trackingPixel}</body>`)
//     }
//     return html + trackingPixel
//   }

//   private wrapLinksWithTracking(html: string, trackingId: string): string {
//     const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi

//     return html.replace(linkRegex, (match, url) => {
//       // Skip if already a tracking link
//       if (url.includes("/api/track/click/")) {
//         return match
//       }

//       // Create tracking URL
//       const trackingUrl = `${env.NEXT_PUBLIC_APP_URL}/api/track/click/${trackingId}?url=${encodeURIComponent(url)}`
//       return match.replace(url, trackingUrl)
//     })
//   }

//   async sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
//     const {
//       to,
//       subject,
//       html,
//       text,
//       trackingEnabled = true,
//       prospectId,
//       campaignId,
//       fromEmail = env.RESEND_FROM_EMAIL,
//       fromName = "ReachAI",
//     } = params

//     try {
//       // Generate tracking ID
//       const trackingId = trackingEnabled ? this.generateTrackingId() : undefined

//       // Inject tracking
//       let trackedHtml = html
//       if (trackingEnabled && trackingId) {
//         trackedHtml = this.injectTrackingPixel(html, trackingId)
//         trackedHtml = this.wrapLinksWithTracking(trackedHtml, trackingId)
//       }

//       // Create email log
//       const emailLog = await db.emailLog.create({
//         data: {
//           prospectId: prospectId || "",
//           subject,
//           body: html,
//           fromEmail,
//           toEmail: to,
//           status: "QUEUED",
//           trackingId,
//           provider: "resend",
//         },
//       })

//       // Send via Resend
//       // const { data, error } = await resend.emails.send({
//       //   from: `${fromName} <${fromEmail}>`,
//       //   to,
//       //   subject,
//       //   html: trackedHtml,
//       //   text: text || this.htmlToText(html),
//       // })

//       const { data, error } = await resend.send({
//         to,
//         subject,
//         html: trackedHtml,
//       })

//       if (error) {
//         logger.error("Failed to send email via Resend", error, { to, subject })

//         // Update log with erro
//         await db.emailLog.update({
//           where: { id: emailLog.id },
//           data: {
//             status: "FAILED",
//             errorMessage: error.message,
//           },
//         })

//         return {
//           success: false,
//           error: error.message,
//         }
//       }

//       // Update log with success
//       await db.emailLog.update({
//         where: { id: emailLog.id },
//         data: {
//           status: "SENT",
//           sentAt: new Date(),
//           providerId: data?.id,
//         },
//       })

//       // Update prospect stats
//       if (prospectId) {
//         await db.prospect.update({
//           where: { id: prospectId },
//           data: {
//             emailsReceived: { increment: 1 },
//             lastContactedAt: new Date(),
//             status: "CONTACTED",
//           },
//         })
//       }

//       // Update campaign stats
//       if (campaignId) {
//         await db.campaign.update({
//           where: { id: campaignId },
//           data: {
//             emailsSent: { increment: 1 },
//           },
//         })
//       }

//       logger.info("Email sent successfully", { to, subject, providerId: data?.id })

//       return {
//         success: true,
//         providerId: data?.id,
//         logId: emailLog.id,
//       }
//     } catch (error) {
//       logger.error("Email sending exception", error as Error, { to, subject })
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : "Unknown error",
//       }
//     }
//   }

//   async sendBulkEmails(emails: SendEmailParams[]): Promise<SendEmailResult[]> {
//     logger.info(`Sending ${emails.length} bulk emails`)

//     // Send in batches to avoid rate limits
//     const batchSize = 10
//     const results: SendEmailResult[] = []

//     for (let i = 0; i < emails.length; i += batchSize) {
//       const batch = emails.slice(i, i + batchSize)
//       const batchResults = await Promise.all(batch.map((email) => this.sendEmail(email)))
//       results.push(...batchResults)

//       // Wait between batches to respect rate limits
//       if (i + batchSize < emails.length) {
//         await new Promise((resolve) => setTimeout(resolve, 1000))
//       }
//     }

//     const successCount = results.filter((r) => r.success).length
//     logger.info(`Bulk email send complete: ${successCount}/${emails.length} successful`)

//     return results
//   }

//   private htmlToText(html: string): string {
//     // Basic HTML to text conversion
//     return html
//       .replace(/<style[^>]*>.*<\/style>/gm, "")
//       .replace(/<script[^>]*>.*<\/script>/gm, "")
//       .replace(/<[^>]+>/gm, "")
//       .replace(/\s+/g, " ")
//       .trim()
//   }

//   async getEmailStatus(logId: string) {
//     const log = await db.emailLog.findUnique({
//       where: { id: logId },
//       include: {
//         prospect: {
//           select: {
//             email: true,
//             firstName: true,
//             lastName: true,
//           },
//         },
//       },
//     })

//     return log
//   }

//   async retryFailedEmail(logId: string): Promise<SendEmailResult> {
//     const log = await db.emailLog.findUnique({
//       where: { id: logId },
//     })

//     if (!log) {
//       return { success: false, error: "Email log not found" }
//     }

//     if (log.status !== "FAILED") {
//       return { success: false, error: "Email is not in failed state" }
//     }

//     // Increment retry count
//     await db.emailLog.update({
//       where: { id: logId },
//       data: {
//         retryCount: { increment: 1 },
//         status: "QUEUED",
//       },
//     })

//     // Retry sending
//     return this.sendEmail({
//       to: log.toEmail,
//       subject: log.subject,
//       html: log.body,
//       prospectId: log.prospectId,
//     })
//   }
// }

// export const emailSender = new EmailSender()

// export const sendEmail = (params: SendEmailParams) => emailSender.sendEmail(params)
// export const sendBulkEmails = (emails: SendEmailParams[]) => emailSender.sendBulkEmails(emails)
// export const getEmailStatus = (logId: string) => emailSender.getEmailStatus(logId)
// export const retryFailedEmail = (logId: string) => emailSender.retryFailedEmail(logId)

// export type { SendEmailParams, SendEmailResult }

// import { resend } from "../resend"
// import { db } from "../db"
// import { logger } from "../logger"
// import { env } from "../env"
// import { nanoid } from "nanoid"
// import { emailValidator, type ValidationParams } from "./email-validator"
// import { sendingAccountManager } from "./sending-account-manager"

// interface SendEmailParams {
//   to: string
//   subject: string
//   html: string
//   text?: string
//   trackingEnabled?: boolean
//   prospectId?: string
//   campaignId?: string
//   fromEmail?: string
//   fromName?: string
//   skipValidation?: boolean
//   recipientName?: string
//   recipientCompany?: string
//   scheduleFor?: Date
//   sendInBusinessHours?: boolean
// }

// interface SendEmailResult {
//   success: boolean
//   providerId?: string
//   logId?: string
//   error?: string
//   validationResult?: {
//     passed: boolean
//     score: number
//     recommendations: string[]
//   }
//   scheduled?: boolean
//   scheduledFor?: Date
// }

// class EmailSender {
//   private generateTrackingId(): string {
//     return nanoid(32)
//   }

//   private injectTrackingPixel(html: string, trackingId: string): string {
//     const trackingPixelUrl = `${env.NEXT_PUBLIC_APP_URL}/api/track/open/${trackingId}`
//     const trackingPixel = `<img src="${trackingPixelUrl}" width="1" height="1" alt="" style="display:none;" />`

//     if (html.includes("</body>")) {
//       return html.replace("</body>", `${trackingPixel}</body>`)
//     }
//     return html + trackingPixel
//   }

//   private wrapLinksWithTracking(html: string, trackingId: string): string {
//     const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi

//     return html.replace(linkRegex, (match, url) => {
//       if (url.includes("/api/track/click/")) {
//         return match
//       }

//       const trackingUrl = `${env.NEXT_PUBLIC_APP_URL}/api/track/click/${trackingId}?url=${encodeURIComponent(url)}`
//       return match.replace(url, trackingUrl)
//     })
//   }

//   private isBusinessHours(date: Date, timezone = "America/New_York"): boolean {
//     const hour = date.getHours()
//     const day = date.getDay()

//     // Monday-Friday, 9 AM - 5 PM
//     const isWeekday = day >= 1 && day <= 5
//     const isWorkingHours = hour >= 9 && hour < 17

//     return isWeekday && isWorkingHours
//   }

//   private async scheduleEmail(params: SendEmailParams, userId: string): Promise<SendEmailResult> {
//     const { to, subject, html, prospectId, campaignId, scheduleFor, sendInBusinessHours } = params

//     if (!scheduleFor) {
//       return { success: false, error: "Schedule date required" }
//     }

//     // Adjust schedule if business hours required
//     const finalSchedule = new Date(scheduleFor)
//     if (sendInBusinessHours && !this.isBusinessHours(finalSchedule)) {
//       // Move to next business day at 9 AM
//       while (!this.isBusinessHours(finalSchedule)) {
//         finalSchedule.setHours(finalSchedule.getHours() + 1)
//       }
//     }

//     // Create schedule record
//     const schedule = await db.sendingSchedule.create({
//       data: {
//         userId,
//         prospectId: prospectId || "",
//         campaignId,
//         subject,
//         body: html,
//         scheduledFor: finalSchedule,
//         sendInBusinessHours: sendInBusinessHours || false,
//         status: "PENDING",
//       },
//     })

//     logger.info("Email scheduled", {
//       scheduleId: schedule.id,
//       scheduledFor: finalSchedule,
//       recipient: to,
//     })

//     return {
//       success: true,
//       scheduled: true,
//       scheduledFor: finalSchedule,
//       logId: schedule.id,
//     }
//   }

//   async sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
//     const {
//       to,
//       subject,
//       html,
//       text,
//       trackingEnabled = true,
//       prospectId,
//       campaignId,
//       fromEmail,
//       fromName = "ReachAI",
//       skipValidation = false,
//       recipientName,
//       recipientCompany,
//       scheduleFor,
//       sendInBusinessHours,
//     } = params

//     try {
//       let userId: string | undefined
//       if (prospectId) {
//         const prospect = await db.prospect.findUnique({
//           where: { id: prospectId },
//           select: { userId: true },
//         })
//         userId = prospect?.userId
//       }

//       if (scheduleFor && userId) {
//         return this.scheduleEmail(params, userId)
//       }

//       if (!skipValidation && userId) {
//         const validationParams: ValidationParams = {
//           subject,
//           body: html,
//           recipientEmail: to,
//           recipientName,
//           recipientCompany,
//           userId,
//         }

//         const validation = await emailValidator.validateEmail(validationParams)

//         if (!validation.passed) {
//           logger.warn("Email failed validation", {
//             recipient: to,
//             score: validation.overallScore,
//             triggers: validation.spamTriggers,
//           })

//           return {
//             success: false,
//             error: "Email failed validation checks",
//             validationResult: {
//               passed: false,
//               score: validation.overallScore,
//               recommendations: validation.recommendations,
//             },
//           }
//         }
//       }

//       let selectedAccount = null
//       let effectiveFromEmail = fromEmail || env.RESEND_FROM_EMAIL

//       if (userId) {
//         selectedAccount = await sendingAccountManager.getAvailableAccount(userId)

//         if (selectedAccount) {
//           effectiveFromEmail = selectedAccount.email
//           logger.info("Using sending account", {
//             accountId: selectedAccount.id,
//             email: selectedAccount.email,
//           })
//         } else {
//           logger.warn("No available sending accounts, using default", { userId })
//         }
//       }

//       // Generate tracking ID
//       const trackingId = trackingEnabled ? this.generateTrackingId() : undefined

//       // Inject tracking
//       let trackedHtml = html
//       if (trackingEnabled && trackingId) {
//         trackedHtml = this.injectTrackingPixel(html, trackingId)
//         trackedHtml = this.wrapLinksWithTracking(trackedHtml, trackingId)
//       }

//       // Create email log
//       const emailLog = await db.emailLog.create({
//         data: {
//           prospectId: prospectId || "",
//           subject,
//           body: html,
//           fromEmail: effectiveFromEmail,
//           toEmail: to,
//           status: "QUEUED",
//           trackingId,
//           provider: "resend",
//           sendingAccountId: selectedAccount?.id,
//         },
//       })

//       // Send via Resend
//       // const { data, error } = await resend.send({
//       //   from: `${fromName} <${effectiveFromEmail}>`,
//       //   to,
//       //   subject,
//       //   html: trackedHtml,
//       //   text: text || this.htmlToText(html),
//       // })

//       const { data, error } = await resend.send({
//         to,
//         subject,
//         html: trackedHtml,
//       })

//       if (error) {
//         logger.error("Failed to send email via Resend", error, { to, subject })

//         await db.emailLog.update({
//           where: { id: emailLog.id },
//           data: {
//             status: "FAILED",
//             errorMessage: error.message,
//           },
//         })

//         return {
//           success: false,
//           error: error.message,
//         }
//       }

//       // Update log with success
//       await db.emailLog.update({
//         where: { id: emailLog.id },
//         data: {
//           status: "SENT",
//           sentAt: new Date(),
//           providerId: data?.id,
//         },
//       })

//       if (selectedAccount) {
//         await sendingAccountManager.incrementAccountUsage(selectedAccount.id)
//       }

//       // Update prospect stat
//       if (prospectId) {
//         await db.prospect.update({
//           where: { id: prospectId },
//           data: {
//             emailsReceived: { increment: 1 },
//             lastContactedAt: new Date(),
//             status: "CONTACTED",
//           },
//         })
//       }

//       // Update campaign stats
//       if (campaignId) {
//         await db.campaign.update({
//           where: { id: campaignId },
//           data: {
//             emailsSent: { increment: 1 },
//           },
//         })
//       }

//       logger.info("Email sent successfully", { to, subject, providerId: data?.id })

//       return {
//         success: true,
//         providerId: data?.id,
//         logId: emailLog.id,
//       }
//     } catch (error) {
//       logger.error("Email sending exception", error as Error, { to, subject })
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : "Unknown error",
//       }
//     }
//   }

//   async sendBulkEmails(emails: SendEmailParams[]): Promise<SendEmailResult[]> {
//     logger.info(`Sending ${emails.length} bulk emails`)

//     const batchSize = 5
//     const results: SendEmailResult[] = []

//     for (let i = 0; i < emails.length; i += batchSize) {
//       const batch = emails.slice(i, i + batchSize)
//       const batchResults = await Promise.all(batch.map((email) => this.sendEmail(email)))
//       results.push(...batchResults)

//       if (i + batchSize < emails.length) {
//         await new Promise((resolve) => setTimeout(resolve, 2000))
//       }
//     }

//     const successCount = results.filter((r) => r.success).length
//     logger.info(`Bulk email send complete: ${successCount}/${emails.length} successful`)

//     return results
//   }

//   private htmlToText(html: string): string {
//     return html
//       .replace(/<style[^>]*>.*<\/style>/gm, "")
//       .replace(/<script[^>]*>.*<\/script>/gm, "")
//       .replace(/<[^>]+>/gm, "")
//       .replace(/\s+/g, " ")
//       .trim()
//   }

//   async getEmailStatus(logId: string) {
//     const log = await db.emailLog.findUnique({
//       where: { id: logId },
//       include: {
//         prospect: {
//           select: {
//             email: true,
//             firstName: true,
//             lastName: true,
//           },
//         },
//         sendingAccount: {
//           select: {
//             email: true,
//             provider: true,
//           },
//         },
//       },
//     })

//     return log
//   }

//   async retryFailedEmail(logId: string): Promise<SendEmailResult> {
//     const log = await db.emailLog.findUnique({
//       where: { id: logId },
//     })

//     if (!log) {
//       return { success: false, error: "Email log not found" }
//     }

//     if (log.status !== "FAILED") {
//       return { success: false, error: "Email is not in failed state" }
//     }

//     await db.emailLog.update({
//       where: { id: logId },
//       data: {
//         retryCount: { increment: 1 },
//         status: "QUEUED",
//       },
//     })

//     return this.sendEmail({
//       to: log.toEmail,
//       subject: log.subject,
//       html: log.body,
//       prospectId: log.prospectId,
//       skipValidation: true, // Skip validation on retry
//     })
//   }
// }

// export const emailSender = new EmailSender()

// export const sendEmail = (params: SendEmailParams) => emailSender.sendEmail(params)
// export const sendBulkEmails = (emails: SendEmailParams[]) => emailSender.sendBulkEmails(emails)
// export const getEmailStatus = (logId: string) => emailSender.getEmailStatus(logId)
// export const retryFailedEmail = (logId: string) => emailSender.retryFailedEmail(logId)

// export type { SendEmailParams, SendEmailResult }


// import { resend } from "../resend"
// import { db } from "../db"
// import { logger } from "../logger"
// import { env } from "../env"
// import { nanoid } from "nanoid"
// import { emailValidator, type ValidationParams } from "./email-validator"
// import { sendingAccountManager } from "./sending-account-manager"
// import { timezoneDetector } from "./timezone-detector"
// import { warmupManager } from "./warmup-manager"

// interface SendEmailParams {
//   to: string
//   subject: string
//   html: string
//   text?: string
//   trackingEnabled?: boolean
//   prospectId?: string
//   campaignId?: string
//   fromEmail?: string
//   fromName?: string
//   skipValidation?: boolean
//   recipientName?: string
//   recipientCompany?: string
//   scheduleFor?: Date
//   sendInBusinessHours?: boolean
//   useTimezoneOptimization?: boolean
// }

// interface SendEmailResult {
//   success: boolean
//   providerId?: string
//   logId?: string
//   error?: string
//   validationResult?: {
//     passed: boolean
//     score: number
//     recommendations: string[]
//   }
//   scheduled?: boolean
//   scheduledFor?: Date
// }

// class EmailSender {
//   private generateTrackingId(): string {
//     return nanoid(32)
//   }

//   private injectTrackingPixel(html: string, trackingId: string): string {
//     const trackingPixelUrl = `${env.NEXT_PUBLIC_APP_URL}/api/track/open/${trackingId}`
//     const trackingPixel = `<img src="${trackingPixelUrl}" width="1" height="1" alt="" style="display:none;" />`

//     if (html.includes("</body>")) {
//       return html.replace("</body>", `${trackingPixel}</body>`)
//     }
//     return html + trackingPixel
//   }

//   private wrapLinksWithTracking(html: string, trackingId: string): string {
//     const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi

//     return html.replace(linkRegex, (match, url) => {
//       if (url.includes("/api/track/click/")) {
//         return match
//       }

//       const trackingUrl = `${env.NEXT_PUBLIC_APP_URL}/api/track/click/${trackingId}?url=${encodeURIComponent(url)}`
//       return match.replace(url, trackingUrl)
//     })
//   }

//   private isBusinessHours(date: Date, timezone = "America/New_York"): boolean {
//     const hour = date.getHours()
//     const day = date.getDay()

//     // Monday-Friday, 9 AM - 5 PM
//     const isWeekday = day >= 1 && day <= 5
//     const isWorkingHours = hour >= 9 && hour < 17

//     return isWeekday && isWorkingHours
//   }

//   private async scheduleEmail(params: SendEmailParams, userId: string): Promise<SendEmailResult> {
//     const { to, subject, html, prospectId, campaignId, scheduleFor, sendInBusinessHours, useTimezoneOptimization } =
//       params

//     if (!scheduleFor) {
//       return { success: false, error: "Schedule date required" }
//     }

//     let finalSchedule = new Date(scheduleFor)

//     if (useTimezoneOptimization && prospectId) {
//       const prospect = await db.prospect.findUnique({
//         where: { id: prospectId },
//       })

//       if (prospect) {
//         // Detect timezone if not already set
//         if (!prospect.timezone) {
//           await timezoneDetector.updateProspectTimezone(prospectId)
//         }

//         // Get optimal send time in prospect's timezone
//         const timezone = prospect.timezone || "America/New_York"
//         finalSchedule = timezoneDetector.getOptimalSendTime(timezone, 10) // 10 AM local time
//       }
//     } else if (sendInBusinessHours) {
//       // Adjust schedule if business hours required
//       while (!this.isBusinessHours(finalSchedule)) {
//         finalSchedule.setHours(finalSchedule.getHours() + 1)
//       }
//     }

//     // Create schedule record
//     const schedule = await db.sendingSchedule.create({
//       data: {
//         userId,
//         prospectId: prospectId || "",
//         campaignId,
//         subject,
//         body: html,
//         scheduledFor: finalSchedule,
//         sendInBusinessHours: sendInBusinessHours || false,
//         status: "PENDING",
//       },
//     })

//     logger.info("Email scheduled with timezone optimization", {
//       scheduleId: schedule.id,
//       scheduledFor: finalSchedule,
//       recipient: to,
//       timezoneOptimized: useTimezoneOptimization,
//     })

//     return {
//       success: true,
//       scheduled: true,
//       scheduledFor: finalSchedule,
//       logId: schedule.id,
//     }
//   }

//   async sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
//     const {
//       to,
//       subject,
//       html,
//       text,
//       trackingEnabled = true,
//       prospectId,
//       campaignId,
//       fromEmail,
//       fromName = "ReachAI",
//       skipValidation = false,
//       recipientName,
//       recipientCompany,
//       scheduleFor,
//       sendInBusinessHours,
//       useTimezoneOptimization,
//     } = params

//     try {
//       let userId: string | undefined
//       if (prospectId) {
//         const prospect = await db.prospect.findUnique({
//           where: { id: prospectId },
//           select: { userId: true, timezone: true },
//         })
//         userId = prospect?.userId
//       }

//       if (scheduleFor && userId) {
//         return this.scheduleEmail(params, userId)
//       }

//       if (!skipValidation && userId) {
//         const validationParams: ValidationParams = {
//           subject,
//           body: html,
//           recipientEmail: to,
//           recipientName,
//           recipientCompany,
//           userId,
//         }

//         const validation = await emailValidator.validateEmail(validationParams)

//         if (!validation.passed) {
//           logger.warn("Email failed validation", {
//             recipient: to,
//             score: validation.overallScore,
//             triggers: validation.spamTriggers,
//           })

//           return {
//             success: false,
//             error: "Email failed validation checks",
//             validationResult: {
//               passed: false,
//               score: validation.overallScore,
//               recommendations: validation.recommendations,
//             },
//           }
//         }
//       }

//       let selectedAccount = null
//       let effectiveFromEmail = fromEmail || env.RESEND_FROM_EMAIL

//       if (userId) {
//         selectedAccount = await sendingAccountManager.getAvailableAccount(userId)

//         if (selectedAccount) {
//           effectiveFromEmail = selectedAccount.email

//           // Check warmup progression
//           await warmupManager.checkAndProgressWarmup(selectedAccount.id)

//           logger.info("Using sending account", {
//             accountId: selectedAccount.id,
//             email: selectedAccount.email,
//             warmupStage: selectedAccount.warmupStage,
//           })
//         } else {
//           logger.warn("No available sending accounts, using default", { userId })
//         }
//       }

//       // Generate tracking ID
//       const trackingId = trackingEnabled ? this.generateTrackingId() : undefined

//       // Inject tracking
//       let trackedHtml = html
//       if (trackingEnabled && trackingId) {
//         trackedHtml = this.injectTrackingPixel(html, trackingId)
//         trackedHtml = this.wrapLinksWithTracking(trackedHtml, trackingId)
//       }

//       let recipientTimezone: string | undefined
//       if (prospectId) {
//         const prospect = await db.prospect.findUnique({
//           where: { id: prospectId },
//           select: { timezone: true },
//         })
//         recipientTimezone = prospect?.timezone || undefined
//       }

//       // Create email log
//       const emailLog = await db.emailLog.create({
//         data: {
//           prospectId: prospectId || "",
//           subject,
//           body: html,
//           fromEmail: effectiveFromEmail,
//           toEmail: to,
//           status: "QUEUED",
//           trackingId,
//           provider: "resend",
//           sendingAccountId: selectedAccount?.id,
//           recipientTimezone,
//           sentInBusinessHours: recipientTimezone
//             ? timezoneDetector.isBusinessHours(new Date(), recipientTimezone)
//             : false,
//         },
//       })

//       // Send via Resend
//       // const { data, error } = await resend.emails.send({
//       //   from: `${fromName} <${effectiveFromEmail}>`,
//       //   to,
//       //   subject,
//       //   html: trackedHtml,
//       //   text: text || this.htmlToText(html),
//       // })
//        const { data, error } = await resend.send({
//         to,
//         subject,
//         html: trackedHtml,
//       })

//       if (error) {
//         logger.error("Failed to send email via Resend", error, { to, subject })

//         await db.emailLog.update({
//           where: { id: emailLog.id },
//           data: {
//             status: "FAILED",
//             errorMessage: error.message,
//           },
//         })

//         return {
//           success: false,
//           error: error.message,
//         }
//       }

//       // Update log with success
//       await db.emailLog.update({
//         where: { id: emailLog.id },
//         data: {
//           status: "SENT",
//           sentAt: new Date(),
//           providerId: data?.id,
//         },
//       })

//       if (selectedAccount) {
//         await sendingAccountManager.incrementAccountUsage(selectedAccount.id)
//       }

//       // Update prospect stats
//       if (prospectId) {
//         await db.prospect.update({
//           where: { id: prospectId },
//           data: {
//             emailsReceived: { increment: 1 },
//             lastContactedAt: new Date(),
//             status: "CONTACTED",
//           },
//         })
//       }

//       // Update campaign stats
//       if (campaignId) {
//         await db.campaign.update({
//           where: { id: campaignId },
//           data: {
//             emailsSent: { increment: 1 },
//           },
//         })
//       }

//       logger.info("Email sent successfully", { to, subject, providerId: data?.id })

//       return {
//         success: true,
//         providerId: data?.id,
//         logId: emailLog.id,
//       }
//     } catch (error) {
//       logger.error("Email sending exception", error as Error, { to, subject })
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : "Unknown error",
//       }
//     }
//   }

//   async sendBulkEmails(emails: SendEmailParams[]): Promise<SendEmailResult[]> {
//     logger.info(`Sending ${emails.length} bulk emails`)

//     const batchSize = 5
//     const results: SendEmailResult[] = []

//     for (let i = 0; i < emails.length; i += batchSize) {
//       const batch = emails.slice(i, i + batchSize)
//       const batchResults = await Promise.all(batch.map((email) => this.sendEmail(email)))
//       results.push(...batchResults)

//       if (i + batchSize < emails.length) {
//         await new Promise((resolve) => setTimeout(resolve, 2000))
//       }
//     }

//     const successCount = results.filter((r) => r.success).length
//     logger.info(`Bulk email send complete: ${successCount}/${emails.length} successful`)

//     return results
//   }

//   private htmlToText(html: string): string {
//     return html
//       .replace(/<style[^>]*>.*<\/style>/gm, "")
//       .replace(/<script[^>]*>.*<\/script>/gm, "")
//       .replace(/<[^>]+>/gm, "")
//       .replace(/\s+/g, " ")
//       .trim()
//   }

//   async getEmailStatus(logId: string) {
//     const log = await db.emailLog.findUnique({
//       where: { id: logId },
//       include: {
//         prospect: {
//           select: {
//             email: true,
//             firstName: true,
//             lastName: true,
//           },
//         },
//         sendingAccount: {
//           select: {
//             email: true,
//             provider: true,
//           },
//         },
//       },
//     })

//     return log
//   }

//   async retryFailedEmail(logId: string): Promise<SendEmailResult> {
//     const log = await db.emailLog.findUnique({
//       where: { id: logId },
//     })

//     if (!log) {
//       return { success: false, error: "Email log not found" }
//     }

//     if (log.status !== "FAILED") {
//       return { success: false, error: "Email is not in failed state" }
//     }

//     await db.emailLog.update({
//       where: { id: logId },
//       data: {
//         retryCount: { increment: 1 },
//         status: "QUEUED",
//       },
//     })

//     return this.sendEmail({
//       to: log.toEmail,
//       subject: log.subject,
//       html: log.body,
//       prospectId: log.prospectId,
//       skipValidation: true, // Skip validation on retry
//     })
//   }
// }

// export const emailSender = new EmailSender()

// export const sendEmail = (params: SendEmailParams) => emailSender.sendEmail(params)
// export const sendBulkEmails = (emails: SendEmailParams[]) => emailSender.sendBulkEmails(emails)
// export const getEmailStatus = (logId: string) => emailSender.getEmailStatus(logId)
// export const retryFailedEmail = (logId: string) => emailSender.retryFailedEmail(logId)

// export type { SendEmailParams, SendEmailResult }
import { db } from "@/lib/db"
import { Resend } from "resend"
import { gmailOAuth } from "./oauth/gmail-oauth"
import { outlookOAuth } from "./oauth/outlook-oauth"
import { decrypt } from "@/lib/encryption"

interface SendEmailParams {
  to: string
  subject: string
  html: string
  userId?: string
  campaignId?: string
  prospectId?: string
  skipValidation?: boolean
}

interface SendingAccountWithCredentials {
  id: string
  email: string
  provider: string
  credentials: any
  dailyLimit: number
  hourlyLimit: number
  emailsSentToday: number
  emailsSentThisHour: number
  isActive: boolean
}

/**
 * Email Sender Service
 *
 * IMPORTANT: This service uses EACH USER'S sending accounts, NOT the platform owner's.
 *
 * For transactional emails (password resets, invitations), use lib/resend.tsx
 * For campaign emails (cold outreach), use this service with user's sending accounts
 */
export class EmailSenderService {
  /**
   * Send email using user's connected sending account
   */
  async sendCampaignEmail(
    params: SendEmailParams,
  ): Promise<{ success: boolean; messageId?: string; error?: string; logId?: string }> {
    const { to, subject, html, userId, campaignId, prospectId, skipValidation } = params

    console.log("[v0] Sending campaign email to:", to, "for user:", userId)

    try {
      let actualUserId = userId
      if (!actualUserId && campaignId) {
        const campaign = await db.campaign.findUnique({
          where: { id: campaignId },
          select: { userId: true },
        })
        actualUserId = campaign?.userId
      }

      if (!actualUserId) {
        return {
          success: false,
          error: "User ID not found",
        }
      }

      // Get user's active sending account
      const sendingAccount = await this.getAvailableSendingAccount(actualUserId)

      if (!sendingAccount) {
        return {
          success: false,
          error: "No active sending account available. Please connect a sending account in Settings.",
        }
      }

      // Check rate limits
      if (sendingAccount.emailsSentThisHour >= sendingAccount.hourlyLimit) {
        return {
          success: false,
          error: "Hourly sending limit reached. Please wait before sending more emails.",
        }
      }

      if (sendingAccount.emailsSentToday >= sendingAccount.dailyLimit) {
        return {
          success: false,
          error: "Daily sending limit reached. Please try again tomorrow.",
        }
      }

      // Send email based on provider
      let messageId: string | undefined

      switch (sendingAccount.provider.toLowerCase()) {
        case "gmail":
          messageId = await this.sendViaGmail(sendingAccount, to, subject, html)
          break
        case "outlook":
          messageId = await this.sendViaOutlook(sendingAccount, to, subject, html)
          break
        case "smtp":
          messageId = await this.sendViaSMTP(sendingAccount, to, subject, html)
          break
        case "resend":
          messageId = await this.sendViaResend(sendingAccount, to, subject, html)
          break
        default:
          return {
            success: false,
            error: `Unsupported email provider: ${sendingAccount.provider}`,
          }
      }

      // Update sending account counters
      await db.sendingAccount.update({
        where: { id: sendingAccount.id },
        data: {
          emailsSentToday: { increment: 1 },
          emailsSentThisHour: { increment: 1 },
        },
      })

      let logId: string | undefined
      if (campaignId && prospectId) {
        const emailLog = await db.emailLog.create({
          data: {
            prospectId,
            sendingAccountId: sendingAccount.id,
            subject,
            body: html,
            fromEmail: sendingAccount.email,
            toEmail: to,
            status: "SENT",
            provider: sendingAccount.provider,
            providerId: messageId || undefined,
            sentAt: new Date(),
          },
        })
        logId = emailLog.id

        // Update prospect stats
        await db.prospect.update({
          where: { id: prospectId },
          data: {
            emailsReceived: { increment: 1 },
            lastContactedAt: new Date(),
          },
        })
      }

      console.log("[v0] Email sent successfully via", sendingAccount.provider, "messageId:", messageId)

      return { success: true, messageId, logId }
    } catch (error) {
      console.error("[v0] Failed to send email:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      }
    }
  }

  /**
   * Get an available sending account for the user
   * Uses round-robin selection and respects rate limits
   */
  private async getAvailableSendingAccount(userId: string): Promise<SendingAccountWithCredentials | null> {
    const accounts = await db.sendingAccount.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        lastResetDate: "asc", // Round-robin: use least recently used
      },
    })

    // Find first account that hasn't hit limits
    for (const account of accounts) {
      if (account.emailsSentThisHour < account.hourlyLimit && account.emailsSentToday < account.dailyLimit) {
        return account as SendingAccountWithCredentials
      }
    }

    return null
  }

  /**
   * Send email via Gmail OAuth
   */
  private async sendViaGmail(
    account: SendingAccountWithCredentials,
    to: string,
    subject: string,
    html: string,
  ): Promise<string> {
    try {
      // Decrypt credentials
      const credentials = decrypt(account.credentials)

      // Check if token is expired and refresh if needed
      if (credentials.expiresAt && credentials.expiresAt < Date.now()) {
        console.log("[v0] Gmail token expired, refreshing...")
        const newTokens = await gmailOAuth.refreshAccessToken(credentials.refreshToken)

        // Update credentials in database
        const { encrypt } = await import("@/lib/encryption")
        const encryptedCredentials = encrypt({
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token || credentials.refreshToken,
          expiresAt: newTokens.expiry_date,
        })

        await db.sendingAccount.update({
          where: { id: account.id },
          data: { credentials: encryptedCredentials },
        })

        credentials.accessToken = newTokens.access_token
      }

      // Send email via Gmail API
      const messageId = await gmailOAuth.sendEmail(credentials.accessToken, credentials.refreshToken, {
        to,
        subject,
        html,
        from: account.email,
      })

      return messageId
    } catch (error) {
      console.error("[v0] Gmail sending error:", error)
      throw new Error(`Gmail sending failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Send email via Outlook OAuth
   */
  private async sendViaOutlook(
    account: SendingAccountWithCredentials,
    to: string,
    subject: string,
    html: string,
  ): Promise<string> {
    try {
      // Decrypt credentials
      const credentials = decrypt(account.credentials)

      // Check if token is expired and refresh if needed
      const expiresAt = credentials.expiresAt || Date.now() + credentials.expiresIn * 1000
      if (expiresAt < Date.now()) {
        console.log("[v0] Outlook token expired, refreshing...")
        const newTokens = await outlookOAuth.refreshAccessToken(credentials.refreshToken)

        // Update credentials in database
        const { encrypt } = await import("@/lib/encryption")
        const encryptedCredentials = encrypt({
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token,
          expiresIn: newTokens.expires_in,
          expiresAt: Date.now() + newTokens.expires_in * 1000,
        })

        await db.sendingAccount.update({
          where: { id: account.id },
          data: { credentials: encryptedCredentials },
        })

        credentials.accessToken = newTokens.access_token
      }

      // Send email via Microsoft Graph API
      const messageId = await outlookOAuth.sendEmail(credentials.accessToken, {
        to,
        subject,
        html,
        from: account.email,
      })

      return messageId
    } catch (error) {
      console.error("[v0] Outlook sending error:", error)
      throw new Error(`Outlook sending failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Send email via SMTP
   */
  private async sendViaSMTP(
    account: SendingAccountWithCredentials,
    to: string,
    subject: string,
    html: string,
  ): Promise<string> {
    // TODO: Implement SMTP sending using nodemailer
    // Use account.credentials for SMTP config

    console.log("[v0] SMTP sending not yet implemented")
    throw new Error("SMTP sending not yet implemented. Please use Resend.")
  }

  /**
   * Send email via Resend (user's own Resend account)
   */
  private async sendViaResend(
    account: SendingAccountWithCredentials,
    to: string,
    subject: string,
    html: string,
  ): Promise<string> {
    const resend = new Resend(account.credentials.apiKey)

    const { data, error } = await resend.emails.send({
      from: account.email,
      to,
      subject,
      html,
    })

    if (error) {
      throw new Error(`Resend error: ${error.message}`)
    }

    return data?.id || ""
  }
}

export const emailSender = new EmailSenderService()

/**
 * Convenience function to send campaign email
 * Uses the singleton emailSender instance
 */
export async function sendEmail(
  params: SendEmailParams,
): Promise<{ success: boolean; messageId?: string; error?: string; logId?: string }> {
  return emailSender.sendCampaignEmail(params)
}
