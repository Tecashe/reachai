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


import { resend } from "../resend"
import { db } from "../db"
import { logger } from "../logger"
import { env } from "../env"
import { nanoid } from "nanoid"
import { emailValidator, type ValidationParams } from "./email-validator"
import { sendingAccountManager } from "./sending-account-manager"
import { timezoneDetector } from "./timezone-detector"
import { warmupManager } from "./warmup-manager"

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
  skipValidation?: boolean
  recipientName?: string
  recipientCompany?: string
  scheduleFor?: Date
  sendInBusinessHours?: boolean
  useTimezoneOptimization?: boolean
}

interface SendEmailResult {
  success: boolean
  providerId?: string
  logId?: string
  error?: string
  validationResult?: {
    passed: boolean
    score: number
    recommendations: string[]
  }
  scheduled?: boolean
  scheduledFor?: Date
}

class EmailSender {
  private generateTrackingId(): string {
    return nanoid(32)
  }

  private injectTrackingPixel(html: string, trackingId: string): string {
    const trackingPixelUrl = `${env.NEXT_PUBLIC_APP_URL}/api/track/open/${trackingId}`
    const trackingPixel = `<img src="${trackingPixelUrl}" width="1" height="1" alt="" style="display:none;" />`

    if (html.includes("</body>")) {
      return html.replace("</body>", `${trackingPixel}</body>`)
    }
    return html + trackingPixel
  }

  private wrapLinksWithTracking(html: string, trackingId: string): string {
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi

    return html.replace(linkRegex, (match, url) => {
      if (url.includes("/api/track/click/")) {
        return match
      }

      const trackingUrl = `${env.NEXT_PUBLIC_APP_URL}/api/track/click/${trackingId}?url=${encodeURIComponent(url)}`
      return match.replace(url, trackingUrl)
    })
  }

  private isBusinessHours(date: Date, timezone = "America/New_York"): boolean {
    const hour = date.getHours()
    const day = date.getDay()

    // Monday-Friday, 9 AM - 5 PM
    const isWeekday = day >= 1 && day <= 5
    const isWorkingHours = hour >= 9 && hour < 17

    return isWeekday && isWorkingHours
  }

  private async scheduleEmail(params: SendEmailParams, userId: string): Promise<SendEmailResult> {
    const { to, subject, html, prospectId, campaignId, scheduleFor, sendInBusinessHours, useTimezoneOptimization } =
      params

    if (!scheduleFor) {
      return { success: false, error: "Schedule date required" }
    }

    let finalSchedule = new Date(scheduleFor)

    if (useTimezoneOptimization && prospectId) {
      const prospect = await db.prospect.findUnique({
        where: { id: prospectId },
      })

      if (prospect) {
        // Detect timezone if not already set
        if (!prospect.timezone) {
          await timezoneDetector.updateProspectTimezone(prospectId)
        }

        // Get optimal send time in prospect's timezone
        const timezone = prospect.timezone || "America/New_York"
        finalSchedule = timezoneDetector.getOptimalSendTime(timezone, 10) // 10 AM local time
      }
    } else if (sendInBusinessHours) {
      // Adjust schedule if business hours required
      while (!this.isBusinessHours(finalSchedule)) {
        finalSchedule.setHours(finalSchedule.getHours() + 1)
      }
    }

    // Create schedule record
    const schedule = await db.sendingSchedule.create({
      data: {
        userId,
        prospectId: prospectId || "",
        campaignId,
        subject,
        body: html,
        scheduledFor: finalSchedule,
        sendInBusinessHours: sendInBusinessHours || false,
        status: "PENDING",
      },
    })

    logger.info("Email scheduled with timezone optimization", {
      scheduleId: schedule.id,
      scheduledFor: finalSchedule,
      recipient: to,
      timezoneOptimized: useTimezoneOptimization,
    })

    return {
      success: true,
      scheduled: true,
      scheduledFor: finalSchedule,
      logId: schedule.id,
    }
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
      fromEmail,
      fromName = "ReachAI",
      skipValidation = false,
      recipientName,
      recipientCompany,
      scheduleFor,
      sendInBusinessHours,
      useTimezoneOptimization,
    } = params

    try {
      let userId: string | undefined
      if (prospectId) {
        const prospect = await db.prospect.findUnique({
          where: { id: prospectId },
          select: { userId: true, timezone: true },
        })
        userId = prospect?.userId
      }

      if (scheduleFor && userId) {
        return this.scheduleEmail(params, userId)
      }

      if (!skipValidation && userId) {
        const validationParams: ValidationParams = {
          subject,
          body: html,
          recipientEmail: to,
          recipientName,
          recipientCompany,
          userId,
        }

        const validation = await emailValidator.validateEmail(validationParams)

        if (!validation.passed) {
          logger.warn("Email failed validation", {
            recipient: to,
            score: validation.overallScore,
            triggers: validation.spamTriggers,
          })

          return {
            success: false,
            error: "Email failed validation checks",
            validationResult: {
              passed: false,
              score: validation.overallScore,
              recommendations: validation.recommendations,
            },
          }
        }
      }

      let selectedAccount = null
      let effectiveFromEmail = fromEmail || env.RESEND_FROM_EMAIL

      if (userId) {
        selectedAccount = await sendingAccountManager.getAvailableAccount(userId)

        if (selectedAccount) {
          effectiveFromEmail = selectedAccount.email

          // Check warmup progression
          await warmupManager.checkAndProgressWarmup(selectedAccount.id)

          logger.info("Using sending account", {
            accountId: selectedAccount.id,
            email: selectedAccount.email,
            warmupStage: selectedAccount.warmupStage,
          })
        } else {
          logger.warn("No available sending accounts, using default", { userId })
        }
      }

      // Generate tracking ID
      const trackingId = trackingEnabled ? this.generateTrackingId() : undefined

      // Inject tracking
      let trackedHtml = html
      if (trackingEnabled && trackingId) {
        trackedHtml = this.injectTrackingPixel(html, trackingId)
        trackedHtml = this.wrapLinksWithTracking(trackedHtml, trackingId)
      }

      let recipientTimezone: string | undefined
      if (prospectId) {
        const prospect = await db.prospect.findUnique({
          where: { id: prospectId },
          select: { timezone: true },
        })
        recipientTimezone = prospect?.timezone || undefined
      }

      // Create email log
      const emailLog = await db.emailLog.create({
        data: {
          prospectId: prospectId || "",
          subject,
          body: html,
          fromEmail: effectiveFromEmail,
          toEmail: to,
          status: "QUEUED",
          trackingId,
          provider: "resend",
          sendingAccountId: selectedAccount?.id,
          recipientTimezone,
          sentInBusinessHours: recipientTimezone
            ? timezoneDetector.isBusinessHours(new Date(), recipientTimezone)
            : false,
        },
      })

      // Send via Resend
      // const { data, error } = await resend.emails.send({
      //   from: `${fromName} <${effectiveFromEmail}>`,
      //   to,
      //   subject,
      //   html: trackedHtml,
      //   text: text || this.htmlToText(html),
      // })
       const { data, error } = await resend.send({
        to,
        subject,
        html: trackedHtml,
      })

      if (error) {
        logger.error("Failed to send email via Resend", error, { to, subject })

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

      if (selectedAccount) {
        await sendingAccountManager.incrementAccountUsage(selectedAccount.id)
      }

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

    const batchSize = 5
    const results: SendEmailResult[] = []

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)
      const batchResults = await Promise.all(batch.map((email) => this.sendEmail(email)))
      results.push(...batchResults)

      if (i + batchSize < emails.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    const successCount = results.filter((r) => r.success).length
    logger.info(`Bulk email send complete: ${successCount}/${emails.length} successful`)

    return results
  }

  private htmlToText(html: string): string {
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
        sendingAccount: {
          select: {
            email: true,
            provider: true,
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

    await db.emailLog.update({
      where: { id: logId },
      data: {
        retryCount: { increment: 1 },
        status: "QUEUED",
      },
    })

    return this.sendEmail({
      to: log.toEmail,
      subject: log.subject,
      html: log.body,
      prospectId: log.prospectId,
      skipValidation: true, // Skip validation on retry
    })
  }
}

export const emailSender = new EmailSender()

export const sendEmail = (params: SendEmailParams) => emailSender.sendEmail(params)
export const sendBulkEmails = (emails: SendEmailParams[]) => emailSender.sendBulkEmails(emails)
export const getEmailStatus = (logId: string) => emailSender.getEmailStatus(logId)
export const retryFailedEmail = (logId: string) => emailSender.retryFailedEmail(logId)

export type { SendEmailParams, SendEmailResult }
