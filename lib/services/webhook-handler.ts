// import { prisma } from "@/lib/db"
// import { logger } from "@/lib/logger"
// import { metricsTracker } from "./metrics-tracker"
// import crypto from "crypto"

// // Webhook event types from major email providers
// export type WebhookProvider = "sendgrid" | "postmark" | "mailgun" | "resend" | "ses"

// export interface WebhookEvent {
//   provider: WebhookProvider
//   event: string
//   timestamp: Date
//   messageId?: string
//   recipientEmail: string
//   rawPayload: any
// }

// interface BounceEvent extends WebhookEvent {
//   bounceType: "hard" | "soft" | "complaint"
//   bounceReason?: string
//   diagnosticCode?: string
// }

// interface EngagementEvent extends WebhookEvent {
//   event: "open" | "click" | "delivered"
//   userAgent?: string
//   ipAddress?: string
//   clickedUrl?: string
// }

// export class WebhookHandler {
//   /**
//    * Main webhook processing entry point
//    * Validates signature and routes to appropriate handler
//    */
//   async processWebhook(
//     provider: WebhookProvider,
//     payload: any,
//     signature?: string,
//     timestamp?: string,
//   ): Promise<{ success: boolean; error?: string }> {
//     try {
//       // Step 1: Validate webhook signature
//       if (!this.validateSignature(provider, payload, signature, timestamp)) {
//         logger.warn("Invalid webhook signature", { provider })
//         return { success: false, error: "Invalid signature" }
//       }

//       // Step 2: Parse provider-specific payload
//       const events = this.parseWebhookPayload(provider, payload)

//       // Step 3: Process each event
//       for (const event of events) {
//         await this.processEvent(event)
//       }

//       // Step 4: Store webhook event for debugging
//       await this.storeWebhookEvent(provider, payload, events.length)

//       logger.info("Webhook processed successfully", {
//         provider,
//         eventsCount: events.length,
//       })

//       return { success: true }
//     } catch (error) {
//       logger.error("Webhook processing failed", error as Error, { provider })
//       return { success: false, error: (error as Error).message }
//     }
//   }

//   /**
//    * Validate webhook signature based on provider
//    */
//   private validateSignature(provider: WebhookProvider, payload: any, signature?: string, timestamp?: string): boolean {
//     // In production, implement signature validation for each provider
//     // For now, allow webhooks in development
//     if (process.env.NODE_ENV === "development") return true

//     try {
//       switch (provider) {
//         case "sendgrid":
//           return this.validateSendGridSignature(payload, signature, timestamp)
//         case "postmark":
//           return this.validatePostmarkSignature(payload, signature)
//         case "mailgun":
//           return this.validateMailgunSignature(payload, signature, timestamp)
//         case "resend":
//           return this.validateResendSignature(payload, signature)
//         case "ses":
//           return this.validateSESSignature(payload, signature)
//         default:
//           return false
//       }
//     } catch (error) {
//       logger.error("Signature validation error", error as Error, { provider })
//       return false
//     }
//   }

//   private validateSendGridSignature(payload: any, signature?: string, timestamp?: string): boolean {
//     if (!signature || !timestamp) return false

//     const verificationKey = process.env.SENDGRID_WEBHOOK_VERIFICATION_KEY
//     if (!verificationKey) return false

//     const payload_string = timestamp + JSON.stringify(payload)
//     const hash = crypto.createHmac("sha256", verificationKey).update(payload_string).digest("base64")

//     return hash === signature
//   }

//   private validatePostmarkSignature(payload: any, signature?: string): boolean {
//     // Postmark doesn't use signatures, but validates via headers
//     return true
//   }

//   private validateMailgunSignature(payload: any, signature?: string, timestamp?: string): boolean {
//     if (!signature || !timestamp) return false

//     const signingKey = process.env.MAILGUN_WEBHOOK_SIGNING_KEY
//     if (!signingKey) return false

//     const token = payload.token
//     const hmac = crypto
//       .createHmac("sha256", signingKey)
//       .update(timestamp + token)
//       .digest("hex")

//     return hmac === signature
//   }

//   private validateResendSignature(payload: any, signature?: string): boolean {
//     if (!signature) return false

//     const webhookSecret = process.env.RESEND_WEBHOOK_SECRET
//     if (!webhookSecret) return false

//     const hash = crypto.createHmac("sha256", webhookSecret).update(JSON.stringify(payload)).digest("hex")

//     return `sha256=${hash}` === signature
//   }

//   private validateSESSignature(payload: any, signature?: string): boolean {
//     // AWS SNS signature validation
//     // This requires the AWS SDK for proper validation
//     return true
//   }

//   /**
//    * Parse webhook payload based on provider format
//    */
//   private parseWebhookPayload(provider: WebhookProvider, payload: any): WebhookEvent[] {
//     switch (provider) {
//       case "sendgrid":
//         return this.parseSendGridPayload(payload)
//       case "postmark":
//         return this.parsePostmarkPayload(payload)
//       case "mailgun":
//         return this.parseMailgunPayload(payload)
//       case "resend":
//         return this.parseResendPayload(payload)
//       case "ses":
//         return this.parseSESPayload(payload)
//       default:
//         throw new Error(`Unknown provider: ${provider}`)
//     }
//   }

//   private parseSendGridPayload(payload: any): WebhookEvent[] {
//     // SendGrid sends array of events
//     if (!Array.isArray(payload)) {
//       payload = [payload]
//     }

//     return payload.map((event: any) => ({
//       provider: "sendgrid",
//       event: event.event,
//       timestamp: new Date(event.timestamp * 1000),
//       messageId: event.sg_message_id,
//       recipientEmail: event.email,
//       rawPayload: event,
//     }))
//   }

//   private parsePostmarkPayload(payload: any): WebhookEvent[] {
//     return [
//       {
//         provider: "postmark",
//         event: payload.RecordType?.toLowerCase() || "unknown",
//         timestamp: new Date(payload.DeliveredAt || payload.BouncedAt || Date.now()),
//         messageId: payload.MessageID,
//         recipientEmail: payload.Email || payload.Recipient,
//         rawPayload: payload,
//       },
//     ]
//   }

//   private parseMailgunPayload(payload: any): WebhookEvent[] {
//     const eventData = payload["event-data"]
//     return [
//       {
//         provider: "mailgun",
//         event: eventData.event,
//         timestamp: new Date(eventData.timestamp * 1000),
//         messageId: eventData.message?.headers?.["message-id"],
//         recipientEmail: eventData.recipient,
//         rawPayload: payload,
//       },
//     ]
//   }

//   private parseResendPayload(payload: any): WebhookEvent[] {
//     return [
//       {
//         provider: "resend",
//         event: payload.type,
//         timestamp: new Date(payload.created_at),
//         messageId: payload.data?.email_id,
//         recipientEmail: payload.data?.to?.[0],
//         rawPayload: payload,
//       },
//     ]
//   }

//   private parseSESPayload(payload: any): WebhookEvent[] {
//     const message = JSON.parse(payload.Message)
//     return [
//       {
//         provider: "ses",
//         event: message.notificationType?.toLowerCase() || "unknown",
//         timestamp: new Date(message.mail.timestamp),
//         messageId: message.mail.messageId,
//         recipientEmail: message.mail.destination[0],
//         rawPayload: payload,
//       },
//     ]
//   }

//   /**
//    * Process individual webhook event
//    */
//   private async processEvent(event: WebhookEvent): Promise<void> {
//     logger.info("Processing webhook event", {
//       provider: event.provider,
//       event: event.event,
//       recipient: event.recipientEmail,
//     })

//     // Find the email log by message ID or recipient
//     const emailLog = await this.findEmailLog(event)

//     if (!emailLog) {
//       logger.warn("Email log not found for webhook event", {
//         messageId: event.messageId,
//         recipient: event.recipientEmail,
//       })
//       return
//     }

//     // Route to specific handler based on event type
//     switch (event.event) {
//       case "delivered":
//       case "delivery":
//         await this.handleDelivered(emailLog.id, event)
//         break

//       case "open":
//       case "opened":
//         await this.handleOpened(emailLog.id, event as EngagementEvent)
//         break

//       case "click":
//       case "clicked":
//         await this.handleClicked(emailLog.id, event as EngagementEvent)
//         break

//       case "bounce":
//       case "bounced":
//         await this.handleBounce(emailLog.id, event as BounceEvent)
//         break

//       case "complaint":
//       case "spamcomplaint":
//       case "spam_report":
//         await this.handleComplaint(emailLog.id, event as BounceEvent)
//         break

//       case "unsubscribe":
//       case "unsubscribed":
//         await this.handleUnsubscribe(emailLog.id, event)
//         break

//       default:
//         logger.debug("Unhandled webhook event type", { event: event.event })
//     }
//   }

//   /**
//    * Find email log by message ID or tracking info
//    */
//   private async findEmailLog(event: WebhookEvent) {
//     // Try by provider ID first (most reliable)
//     if (event.messageId) {
//       const byProviderId = await prisma.emailLog.findFirst({
//         where: { providerId: event.messageId },
//       })
//       if (byProviderId) return byProviderId
//     }

//     // Try by tracking ID (for warmup emails)
//     const byTrackingId = await prisma.emailLog.findFirst({
//       where: {
//         toEmail: event.recipientEmail,
//         sentAt: {
//           gte: new Date(event.timestamp.getTime() - 3600000), // Within 1 hour
//           lte: new Date(event.timestamp.getTime() + 3600000),
//         },
//       },
//       orderBy: { sentAt: "desc" },
//     })

//     return byTrackingId
//   }

//   /**
//    * Handle delivered event
//    */
//   private async handleDelivered(emailLogId: string, event: WebhookEvent): Promise<void> {
//     await prisma.emailLog.update({
//       where: { id: emailLogId },
//       data: {
//         status: "DELIVERED",
//         deliveredAt: event.timestamp,
//       },
//     })

//     // Update prospect
//     const emailLog = await prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//       select: { prospectId: true, sendingAccountId: true },
//     })

//     if (emailLog?.sendingAccountId) {
//       await metricsTracker.trackDelivered(emailLog.sendingAccountId)
//     }
//   }

//   /**
//    * Handle email opened event
//    */
//   private async handleOpened(emailLogId: string, event: EngagementEvent): Promise<void> {
//     const emailLog = await prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//       select: { opens: true, prospectId: true, sendingAccountId: true },
//     })

//     if (!emailLog) return

//     const isFirstOpen = emailLog.opens === 0

//     await prisma.emailLog.update({
//       where: { id: emailLogId },
//       data: {
//         opens: { increment: 1 },
//         openedAt: isFirstOpen ? event.timestamp : undefined,
//       },
//     })

//     // Update prospect engagement
//     await prisma.prospect.update({
//       where: { id: emailLog.prospectId },
//       data: {
//         emailsOpened: { increment: 1 },
//       },
//     })

//     // Track metrics (only first open)
//     if (isFirstOpen && emailLog.sendingAccountId) {
//       await metricsTracker.trackOpened(emailLog.sendingAccountId)
//     }

//     logger.info("Email opened", {
//       emailLogId,
//       prospectId: emailLog.prospectId,
//       totalOpens: emailLog.opens + 1,
//     })
//   }

//   /**
//    * Handle email clicked event
//    */
//   private async handleClicked(emailLogId: string, event: EngagementEvent): Promise<void> {
//     const emailLog = await prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//       select: { clicks: true, prospectId: true, sendingAccountId: true },
//     })

//     if (!emailLog) return

//     const isFirstClick = emailLog.clicks === 0

//     await prisma.emailLog.update({
//       where: { id: emailLogId },
//       data: {
//         clicks: { increment: 1 },
//         clickedAt: isFirstClick ? event.timestamp : undefined,
//       },
//     })

//     // Update prospect engagement
//     await prisma.prospect.update({
//       where: { id: emailLog.prospectId },
//       data: {
//         emailsClicked: { increment: 1 },
//       },
//     })

//     // Track metrics (only first click)
//     if (isFirstClick && emailLog.sendingAccountId) {
//       await metricsTracker.trackClicked(emailLog.sendingAccountId)
//     }

//     logger.info("Email clicked", {
//       emailLogId,
//       url: event.clickedUrl,
//       totalClicks: emailLog.clicks + 1,
//     })
//   }

//   /**
//    * Handle bounce event
//    */
//   private async handleBounce(emailLogId: string, event: BounceEvent): Promise<void> {
//     const emailLog = await prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//       select: { prospectId: true, sendingAccountId: true },
//     })

//     if (!emailLog) return

//     // Determine bounce type from payload
//     const bounceType = this.determineBounceType(event)

//     // Update email log
//     await prisma.emailLog.update({
//       where: { id: emailLogId },
//       data: {
//         status: "BOUNCED",
//         bouncedAt: event.timestamp,
//       },
//     })

//     // Create bounce record
//     await prisma.emailBounce.create({
//       data: {
//         emailLogId,
//         sendingAccountId: emailLog.sendingAccountId!,
//         bounceType,
//         bounceReason: event.bounceReason,
//         diagnosticCode: event.diagnosticCode,
//         recipientEmail: event.recipientEmail,
//         bouncedAt: event.timestamp,
//       },
//     })

//     // Update prospect status
//     await prisma.prospect.update({
//       where: { id: emailLog.prospectId },
//       data: {
//         bounced: bounceType === "HARD",
//         status: bounceType === "HARD" ? "BOUNCED" : undefined,
//       },
//     })

//     // Track metrics
//     if (emailLog.sendingAccountId) {
//       await metricsTracker.trackBounce(emailLog.sendingAccountId, bounceType)
//     }

//     logger.warn("Email bounced", {
//       emailLogId,
//       bounceType,
//       reason: event.bounceReason,
//     })
//   }

//   /**
//    * Handle spam complaint
//    */
//   private async handleComplaint(emailLogId: string, event: BounceEvent): Promise<void> {
//     const emailLog = await prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//       select: { prospectId: true, sendingAccountId: true },
//     })

//     if (!emailLog) return

//     // Create bounce record with COMPLAINT type
//     await prisma.emailBounce.create({
//       data: {
//         emailLogId,
//         sendingAccountId: emailLog.sendingAccountId!,
//         bounceType: "COMPLAINT",
//         bounceReason: "Spam complaint",
//         recipientEmail: event.recipientEmail,
//         bouncedAt: event.timestamp,
//       },
//     })

//     // Update prospect - mark as unsubscribed
//     await prisma.prospect.update({
//       where: { id: emailLog.prospectId },
//       data: {
//         unsubscribed: true,
//         status: "UNSUBSCRIBED",
//       },
//     })

//     // Track complaint (critical for sender reputation)
//     if (emailLog.sendingAccountId) {
//       await metricsTracker.trackComplaint(emailLog.sendingAccountId)
//     }

//     logger.error("Spam complaint received", {
//       emailLogId,
//       recipient: event.recipientEmail,
//     })
//   }

//   /**
//    * Handle unsubscribe event
//    */
//   private async handleUnsubscribe(emailLogId: string, event: WebhookEvent): Promise<void> {
//     const emailLog = await prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//       select: { prospectId: true },
//     })

//     if (!emailLog) return

//     await prisma.prospect.update({
//       where: { id: emailLog.prospectId },
//       data: {
//         unsubscribed: true,
//         status: "UNSUBSCRIBED",
//       },
//     })

//     logger.info("Prospect unsubscribed", { prospectId: emailLog.prospectId })
//   }

//   /**
//    * Determine bounce type from event payload
//    */
//   private determineBounceType(event: BounceEvent): "HARD" | "SOFT" | "COMPLAINT" {
//     const payload = event.rawPayload
//     const reason = event.bounceReason?.toLowerCase() || ""

//     // Hard bounce indicators
//     const hardBounceKeywords = [
//       "permanent",
//       "invalid",
//       "not exist",
//       "unknown",
//       "disabled",
//       "rejected",
//       "mailbox not found",
//     ]

//     // Soft bounce indicators
//     const softBounceKeywords = ["temporary", "mailbox full", "quota", "over quota", "try again"]

//     if (hardBounceKeywords.some((keyword) => reason.includes(keyword))) {
//       return "HARD"
//     }

//     if (softBounceKeywords.some((keyword) => reason.includes(keyword))) {
//       return "SOFT"
//     }

//     // Provider-specific checks
//     if (event.provider === "sendgrid" && payload.type === "bounce") {
//       return "HARD"
//     }
//     if (event.provider === "postmark" && payload.Type === "HardBounce") {
//       return "HARD"
//     }

//     // Default to soft bounce
//     return "SOFT"
//   }

//   /**
//    * Store webhook event for debugging
//    */
//   private async storeWebhookEvent(provider: WebhookProvider, payload: any, eventsProcessed: number): Promise<void> {
//     try {
//       await prisma.webhookEvent.create({
//         data: {
//           provider,
//           payload,
//           eventsProcessed,
//           processedAt: new Date(),
//         },
//       })
//     } catch (error) {
//       // Don't fail webhook processing if storage fails
//       logger.error("Failed to store webhook event", error as Error)
//     }
//   }

//   /**
//    * Process warmup interaction feedback
//    * Called when warmup emails get engagement
//    */
//   async processWarmupFeedback(
//     warmupId: string,
//     feedbackType: "delivered" | "opened" | "clicked" | "replied",
//   ): Promise<void> {
//     const interaction = await prisma.warmupInteraction.findFirst({
//       where: { warmupId },
//     })

//     if (!interaction) {
//       logger.warn("Warmup interaction not found", { warmupId })
//       return
//     }

//     const updates: any = {}

//     switch (feedbackType) {
//       case "delivered":
//         updates.deliveredAt = new Date()
//         updates.landedInInbox = true
//         break
//       case "opened":
//         updates.openedAt = new Date()
//         updates.landedInInbox = true
//         break
//       case "clicked":
//         updates.clickedAt = new Date()
//         break
//       case "replied":
//         updates.repliedAt = new Date()
//         break
//     }

//     await prisma.warmupInteraction.update({
//       where: { id: interaction.id },
//       data: updates,
//     })

//     logger.info("Warmup feedback processed", {
//       warmupId,
//       feedbackType,
//       sessionId: interaction.sessionId,
//     })
//   }
// }

// export const webhookHandler = new WebhookHandler()
// import { prisma } from "@/lib/db"
// import { logger } from "@/lib/logger"
// import { metricsTracker } from "./metrics-tracker"
// import crypto from "crypto"

// // Webhook event types from major email providers
// export type WebhookProvider = "sendgrid" | "postmark" | "mailgun" | "resend" | "ses"

// export interface WebhookEvent {
//   provider: WebhookProvider
//   event: string
//   timestamp: Date
//   messageId?: string
//   recipientEmail: string
//   rawPayload: any
// }

// interface BounceEvent extends WebhookEvent {
//   bounceType: "hard" | "soft" | "complaint"
//   bounceReason?: string
//   diagnosticCode?: string
// }

// interface EngagementEvent extends WebhookEvent {
//   event: "open" | "click" | "delivered"
//   userAgent?: string
//   ipAddress?: string
//   clickedUrl?: string
// }

// export class WebhookHandler {
//   /**
//    * Main webhook processing entry point
//    * Validates signature and routes to appropriate handler
//    */
//   async processWebhook(
//     provider: WebhookProvider,
//     payload: any,
//     signature?: string,
//     timestamp?: string,
//   ): Promise<{ success: boolean; error?: string }> {
//     try {
//       // Step 1: Validate webhook signature
//       if (!this.validateSignature(provider, payload, signature, timestamp)) {
//         logger.warn("Invalid webhook signature", { provider })
//         return { success: false, error: "Invalid signature" }
//       }

//       // Step 2: Parse provider-specific payload
//       const events = this.parseWebhookPayload(provider, payload)

//       // Step 3: Process each event
//       for (const event of events) {
//         await this.processEvent(event)
//       }

//       // Step 4: Store webhook event for debugging
//       await this.storeWebhookEvent(provider, payload, events.length)

//       logger.info("Webhook processed successfully", {
//         provider,
//         eventsCount: events.length,
//       })

//       return { success: true }
//     } catch (error) {
//       logger.error("Webhook processing failed", error as Error, { provider })
//       return { success: false, error: (error as Error).message }
//     }
//   }

//   /**
//    * Validate webhook signature based on provider
//    */
//   private validateSignature(provider: WebhookProvider, payload: any, signature?: string, timestamp?: string): boolean {
//     // In production, implement signature validation for each provider
//     // For now, allow webhooks in development
//     if (process.env.NODE_ENV === "development") return true

//     try {
//       switch (provider) {
//         case "sendgrid":
//           return this.validateSendGridSignature(payload, signature, timestamp)
//         case "postmark":
//           return this.validatePostmarkSignature(payload, signature)
//         case "mailgun":
//           return this.validateMailgunSignature(payload, signature, timestamp)
//         case "resend":
//           return this.validateResendSignature(payload, signature)
//         case "ses":
//           return this.validateSESSignature(payload, signature)
//         default:
//           return false
//       }
//     } catch (error) {
//       logger.error("Signature validation error", error as Error, { provider })
//       return false
//     }
//   }

//   private validateSendGridSignature(payload: any, signature?: string, timestamp?: string): boolean {
//     if (!signature || !timestamp) return false

//     const verificationKey = process.env.SENDGRID_WEBHOOK_VERIFICATION_KEY
//     if (!verificationKey) return false

//     const payload_string = timestamp + JSON.stringify(payload)
//     const hash = crypto.createHmac("sha256", verificationKey).update(payload_string).digest("base64")

//     return hash === signature
//   }

//   private validatePostmarkSignature(payload: any, signature?: string): boolean {
//     // Postmark doesn't use signatures, but validates via headers
//     return true
//   }

//   private validateMailgunSignature(payload: any, signature?: string, timestamp?: string): boolean {
//     if (!signature || !timestamp) return false

//     const signingKey = process.env.MAILGUN_WEBHOOK_SIGNING_KEY
//     if (!signingKey) return false

//     const token = payload.token
//     const hmac = crypto
//       .createHmac("sha256", signingKey)
//       .update(timestamp + token)
//       .digest("hex")

//     return hmac === signature
//   }

//   private validateResendSignature(payload: any, signature?: string): boolean {
//     if (!signature) return false

//     const webhookSecret = process.env.RESEND_WEBHOOK_SECRET
//     if (!webhookSecret) return false

//     const hash = crypto.createHmac("sha256", webhookSecret).update(JSON.stringify(payload)).digest("hex")

//     return `sha256=${hash}` === signature
//   }

//   private validateSESSignature(payload: any, signature?: string): boolean {
//     // AWS SNS signature validation
//     // This requires the AWS SDK for proper validation
//     return true
//   }

//   /**
//    * Parse webhook payload based on provider format
//    */
//   private parseWebhookPayload(provider: WebhookProvider, payload: any): WebhookEvent[] {
//     switch (provider) {
//       case "sendgrid":
//         return this.parseSendGridPayload(payload)
//       case "postmark":
//         return this.parsePostmarkPayload(payload)
//       case "mailgun":
//         return this.parseMailgunPayload(payload)
//       case "resend":
//         return this.parseResendPayload(payload)
//       case "ses":
//         return this.parseSESPayload(payload)
//       default:
//         throw new Error(`Unknown provider: ${provider}`)
//     }
//   }

//   private parseSendGridPayload(payload: any): WebhookEvent[] {
//     // SendGrid sends array of events
//     if (!Array.isArray(payload)) {
//       payload = [payload]
//     }

//     return payload.map((event: any) => ({
//       provider: "sendgrid",
//       event: event.event,
//       timestamp: new Date(event.timestamp * 1000),
//       messageId: event.sg_message_id,
//       recipientEmail: event.email,
//       rawPayload: event,
//     }))
//   }

//   private parsePostmarkPayload(payload: any): WebhookEvent[] {
//     return [
//       {
//         provider: "postmark",
//         event: payload.RecordType?.toLowerCase() || "unknown",
//         timestamp: new Date(payload.DeliveredAt || payload.BouncedAt || Date.now()),
//         messageId: payload.MessageID,
//         recipientEmail: payload.Email || payload.Recipient,
//         rawPayload: payload,
//       },
//     ]
//   }

//   private parseMailgunPayload(payload: any): WebhookEvent[] {
//     const eventData = payload["event-data"]
//     return [
//       {
//         provider: "mailgun",
//         event: eventData.event,
//         timestamp: new Date(eventData.timestamp * 1000),
//         messageId: eventData.message?.headers?.["message-id"],
//         recipientEmail: eventData.recipient,
//         rawPayload: payload,
//       },
//     ]
//   }

//   private parseResendPayload(payload: any): WebhookEvent[] {
//     return [
//       {
//         provider: "resend",
//         event: payload.type,
//         timestamp: new Date(payload.created_at),
//         messageId: payload.data?.email_id,
//         recipientEmail: payload.data?.to?.[0],
//         rawPayload: payload,
//       },
//     ]
//   }

//   private parseSESPayload(payload: any): WebhookEvent[] {
//     const message = JSON.parse(payload.Message)
//     return [
//       {
//         provider: "ses",
//         event: message.notificationType?.toLowerCase() || "unknown",
//         timestamp: new Date(message.mail.timestamp),
//         messageId: message.mail.messageId,
//         recipientEmail: message.mail.destination[0],
//         rawPayload: payload,
//       },
//     ]
//   }

//   /**
//    * Process individual webhook event
//    */
//   private async processEvent(event: WebhookEvent): Promise<void> {
//     logger.info("Processing webhook event", {
//       provider: event.provider,
//       event: event.event,
//       recipient: event.recipientEmail,
//     })

//     // Find the email log OR warmup interaction
//     const emailLogOrWarmup = await this.findEmailLog(event)

//     if (!emailLogOrWarmup) {
//       logger.warn("Email log/warmup interaction not found for webhook event", {
//         messageId: event.messageId,
//         recipient: event.recipientEmail,
//       })
//       return
//     }

//     const isWarmup = emailLogOrWarmup.isWarmup
//     const emailLogId = emailLogOrWarmup.id
//     const warmupInteractionId = emailLogOrWarmup.warmupInteractionId

//     // Route to specific handler based on event type
//     switch (event.event) {
//       case "delivered":
//       case "delivery":
//         if (isWarmup) {
//           await this.handleWarmupDelivered(warmupInteractionId, event)
//         } else {
//           await this.handleDelivered(emailLogId, event)
//         }
//         break

//       case "open":
//       case "opened":
//         if (isWarmup) {
//           await this.handleWarmupOpened(warmupInteractionId, event as EngagementEvent)
//         } else {
//           await this.handleOpened(emailLogId, event as EngagementEvent)
//         }
//         break

//       case "click":
//       case "clicked":
//         if (isWarmup) {
//           await this.handleWarmupClicked(warmupInteractionId, event as EngagementEvent)
//         } else {
//           await this.handleClicked(emailLogId, event as EngagementEvent)
//         }
//         break

//       case "bounce":
//       case "bounced":
//         if (isWarmup) {
//           await this.handleWarmupBounce(warmupInteractionId, event as BounceEvent)
//         } else {
//           await this.handleBounce(emailLogId, event as BounceEvent)
//         }
//         break

//       case "complaint":
//       case "spamcomplaint":
//       case "spam_report":
//         if (isWarmup) {
//           await this.handleWarmupComplaint(warmupInteractionId, event as BounceEvent)
//         } else {
//           await this.handleComplaint(emailLogId, event as BounceEvent)
//         }
//         break

//       default:
//         logger.debug("Unhandled webhook event type", { event: event.event })
//     }
//   }

//   /**
//    * Find email log by message ID or tracking info
//    */
//   private async findEmailLog(event: WebhookEvent) {
//     // Try by provider ID first (most reliable)
//     if (event.messageId) {
//       const byProviderId = await prisma.emailLog.findFirst({
//         where: { providerId: event.messageId },
//       })
//       if (byProviderId) return { id: byProviderId.id, isWarmup: false }
//     }

//     if (event.messageId) {
//       const warmupInteraction = await prisma.warmupInteraction.findFirst({
//         where: { messageId: event.messageId },
//       })
//       if (warmupInteraction) {
//         return { id: null, warmupInteractionId: warmupInteraction.id, isWarmup: true }
//       }
//     }

//     // Try by tracking ID (for campaign emails)
//     const byTrackingId = await prisma.emailLog.findFirst({
//       where: {
//         toEmail: event.recipientEmail,
//         sentAt: {
//           gte: new Date(event.timestamp.getTime() - 3600000), // Within 1 hour
//           lte: new Date(event.timestamp.getTime() + 3600000),
//         },
//       },
//       orderBy: { sentAt: "desc" },
//     })

//     return byTrackingId ? { id: byTrackingId.id, isWarmup: false } : null
//   }

//   /**
//    * Handle warmup email delivered
//    */
//   private async handleWarmupDelivered(warmupInteractionId: string, event: WebhookEvent): Promise<void> {
//     const interaction = await prisma.warmupInteraction.findUnique({
//       where: { id: warmupInteractionId },
//       select: { sendingAccountId: true },
//     })

//     await prisma.warmupInteraction.update({
//       where: { id: warmupInteractionId },
//       data: {
//         deliveredAt: event.timestamp,
//         landedInInbox: true,
//       },
//     })

//     if (interaction?.sendingAccountId) {
//       await metricsTracker.trackDelivered(interaction.sendingAccountId)
//     }

//     logger.info("Warmup email delivered", { warmupInteractionId })
//   }

//   /**
//    * Handle warmup email opened
//    */
//   private async handleWarmupOpened(warmupInteractionId: string, event: EngagementEvent): Promise<void> {
//     const interaction = await prisma.warmupInteraction.findUnique({
//       where: { id: warmupInteractionId },
//       select: { sendingAccountId: true, openedAt: true },
//     })

//     const isFirstOpen = !interaction?.openedAt

//     await prisma.warmupInteraction.update({
//       where: { id: warmupInteractionId },
//       data: {
//         openedAt: isFirstOpen ? event.timestamp : undefined,
//         landedInInbox: true,
//       },
//     })

//     if (isFirstOpen && interaction?.sendingAccountId) {
//       await metricsTracker.trackOpened(interaction.sendingAccountId)
//     }

//     logger.info("Warmup email opened", { warmupInteractionId })
//   }

//   /**
//    * Handle warmup email clicked
//    */
//   private async handleWarmupClicked(warmupInteractionId: string, event: EngagementEvent): Promise<void> {
//     const interaction = await prisma.warmupInteraction.findUnique({
//       where: { id: warmupInteractionId },
//       select: { sendingAccountId: true, clickedAt: true },
//     })

//     const isFirstClick = !interaction?.clickedAt

//     await prisma.warmupInteraction.update({
//       where: { id: warmupInteractionId },
//       data: {
//         clickedAt: isFirstClick ? event.timestamp : undefined,
//       },
//     })

//     if (isFirstClick && interaction?.sendingAccountId) {
//       await metricsTracker.trackClicked(interaction.sendingAccountId)
//     }

//     logger.info("Warmup email clicked", { warmupInteractionId })
//   }

//   /**
//    * Handle warmup email bounce
//    */
//   private async handleWarmupBounce(warmupInteractionId: string, event: BounceEvent): Promise<void> {
//     const interaction = await prisma.warmupInteraction.findUnique({
//       where: { id: warmupInteractionId },
//       select: { sendingAccountId: true, peerAccountId: true },
//     })

//     if (!interaction) return

//     const bounceType = this.determineBounceType(event)

//     // Update interaction
//     await prisma.warmupInteraction.update({
//       where: { id: warmupInteractionId },
//       data: {
//         landedInInbox: false,
//       },
//     })

//     // Track bounce
//     if (interaction.sendingAccountId) {
//       await metricsTracker.trackBounce(interaction.sendingAccountId, bounceType)
//     }

//     // If hard bounce, might need to remove peer from warmup pool
//     if (bounceType === "HARD" && interaction.peerAccountId) {
//       logger.warn("Hard bounce on warmup email to peer", {
//         peerAccountId: interaction.peerAccountId,
//       })
//     }

//     logger.warn("Warmup email bounced", {
//       warmupInteractionId,
//       bounceType,
//     })
//   }

//   /**
//    * Handle warmup email spam complaint
//    */
//   private async handleWarmupComplaint(warmupInteractionId: string, event: BounceEvent): Promise<void> {
//     const interaction = await prisma.warmupInteraction.findUnique({
//       where: { id: warmupInteractionId },
//       select: { sendingAccountId: true, peerAccountId: true },
//     })

//     if (!interaction) return

//     if (interaction.sendingAccountId) {
//       await metricsTracker.trackComplaint(interaction.sendingAccountId)
//     }

//     // Critical: peer marked warmup email as spam
//     if (interaction.peerAccountId) {
//       logger.error("Warmup peer marked email as spam", {
//         peerAccountId: interaction.peerAccountId,
//         sendingAccountId: interaction.sendingAccountId,
//       })
//     }
//   }

//   /**
//    * Handle campaign email delivered (original logic)
//    */
//   private async handleDelivered(emailLogId: string, event: WebhookEvent): Promise<void> {
//     await prisma.emailLog.update({
//       where: { id: emailLogId },
//       data: {
//         status: "DELIVERED",
//         deliveredAt: event.timestamp,
//       },
//     })

//     // Update prospect
//     const emailLog = await prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//       select: { prospectId: true, sendingAccountId: true },
//     })

//     if (emailLog?.sendingAccountId) {
//       await metricsTracker.trackDelivered(emailLog.sendingAccountId)
//     }
//   }

//   /**
//    * Handle campaign email opened (original logic)
//    */
//   private async handleOpened(emailLogId: string, event: EngagementEvent): Promise<void> {
//     const emailLog = await prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//       select: { opens: true, prospectId: true, sendingAccountId: true },
//     })

//     if (!emailLog) return

//     const isFirstOpen = emailLog.opens === 0

//     await prisma.emailLog.update({
//       where: { id: emailLogId },
//       data: {
//         opens: { increment: 1 },
//         openedAt: isFirstOpen ? event.timestamp : undefined,
//       },
//     })

//     if (emailLog.prospectId) {
//       await prisma.prospect.update({
//         where: { id: emailLog.prospectId },
//         data: {
//           emailsOpened: { increment: 1 },
//         },
//       })
//     }

//     // Track metrics (only first open)
//     if (isFirstOpen && emailLog.sendingAccountId) {
//       await metricsTracker.trackOpened(emailLog.sendingAccountId)
//     }

//     logger.info("Campaign email opened", {
//       emailLogId,
//       prospectId: emailLog.prospectId,
//       totalOpens: emailLog.opens + 1,
//     })
//   }

//   /**
//    * Handle campaign email clicked (original logic)
//    */
//   private async handleClicked(emailLogId: string, event: EngagementEvent): Promise<void> {
//     const emailLog = await prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//       select: { clicks: true, prospectId: true, sendingAccountId: true },
//     })

//     if (!emailLog) return

//     const isFirstClick = emailLog.clicks === 0

//     await prisma.emailLog.update({
//       where: { id: emailLogId },
//       data: {
//         clicks: { increment: 1 },
//         clickedAt: isFirstClick ? event.timestamp : undefined,
//       },
//     })

//     if (emailLog.prospectId) {
//       await prisma.prospect.update({
//         where: { id: emailLog.prospectId },
//         data: {
//           emailsClicked: { increment: 1 },
//         },
//       })
//     }

//     // Track metrics (only first click)
//     if (isFirstClick && emailLog.sendingAccountId) {
//       await metricsTracker.trackClicked(emailLog.sendingAccountId)
//     }

//     logger.info("Campaign email clicked", {
//       emailLogId,
//       url: event.clickedUrl,
//       totalClicks: emailLog.clicks + 1,
//     })
//   }

//   /**
//    * Handle campaign bounce
//    */
//   private async handleBounce(emailLogId: string, event: BounceEvent): Promise<void> {
//     const emailLog = await prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//       select: { prospectId: true, sendingAccountId: true },
//     })

//     if (!emailLog) return

//     // Determine bounce type from payload
//     const bounceType = this.determineBounceType(event)

//     // Update email log
//     await prisma.emailLog.update({
//       where: { id: emailLogId },
//       data: {
//         status: "BOUNCED",
//         bouncedAt: event.timestamp,
//       },
//     })

//     // Create bounce record
//     await prisma.emailBounce.create({
//       data: {
//         emailLogId,
//         sendingAccountId: emailLog.sendingAccountId!,
//         bounceType,
//         bounceReason: event.bounceReason,
//         diagnosticCode: event.diagnosticCode,
//         recipientEmail: event.recipientEmail,
//         bouncedAt: event.timestamp,
//       },
//     })

//     if (emailLog.prospectId) {
//       await prisma.prospect.update({
//         where: { id: emailLog.prospectId },
//         data: {
//           bounced: bounceType === "HARD",
//           status: bounceType === "HARD" ? "BOUNCED" : undefined,
//         },
//       })
//     }

//     // Track metrics
//     if (emailLog.sendingAccountId) {
//       await metricsTracker.trackBounce(emailLog.sendingAccountId, bounceType)
//     }

//     logger.warn("Campaign email bounced", {
//       emailLogId,
//       bounceType,
//       reason: event.bounceReason,
//     })
//   }

//   /**
//    * Handle campaign spam complaint
//    */
//   private async handleComplaint(emailLogId: string, event: BounceEvent): Promise<void> {
//     const emailLog = await prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//       select: { prospectId: true, sendingAccountId: true },
//     })

//     if (!emailLog) return

//     // Create bounce record with COMPLAINT type
//     await prisma.emailBounce.create({
//       data: {
//         emailLogId,
//         sendingAccountId: emailLog.sendingAccountId!,
//         bounceType: "COMPLAINT",
//         bounceReason: "Spam complaint",
//         recipientEmail: event.recipientEmail,
//         bouncedAt: event.timestamp,
//       },
//     })

//     if (emailLog.prospectId) {
//       await prisma.prospect.update({
//         where: { id: emailLog.prospectId },
//         data: {
//           unsubscribed: true,
//           status: "UNSUBSCRIBED",
//         },
//       })
//     }

//     // Track complaint (critical for sender reputation)
//     if (emailLog.sendingAccountId) {
//       await metricsTracker.trackComplaint(emailLog.sendingAccountId)
//     }

//     logger.error("Spam complaint received", {
//       emailLogId,
//       recipient: event.recipientEmail,
//     })
//   }

//   /**
//    * Handle unsubscribe event - CAMPAIGN ONLY
//    */
//   private async handleUnsubscribe(emailLogId: string, event: WebhookEvent): Promise<void> {
//     const emailLog = await prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//       select: { prospectId: true },
//     })

//     if (!emailLog || !emailLog.prospectId) return

//     await prisma.prospect.update({
//       where: { id: emailLog.prospectId },
//       data: {
//         unsubscribed: true,
//         status: "UNSUBSCRIBED",
//       },
//     })

//     logger.info("Prospect unsubscribed", { prospectId: emailLog.prospectId })
//   }

//   /**
//    * Determine bounce type from event payload
//    */
//   private determineBounceType(event: BounceEvent): "HARD" | "SOFT" | "COMPLAINT" {
//     const payload = event.rawPayload
//     const reason = event.bounceReason?.toLowerCase() || ""

//     // Hard bounce indicators
//     const hardBounceKeywords = [
//       "permanent",
//       "invalid",
//       "not exist",
//       "unknown",
//       "disabled",
//       "rejected",
//       "mailbox not found",
//     ]

//     // Soft bounce indicators
//     const softBounceKeywords = ["temporary", "mailbox full", "quota", "over quota", "try again"]

//     if (hardBounceKeywords.some((keyword) => reason.includes(keyword))) {
//       return "HARD"
//     }

//     if (softBounceKeywords.some((keyword) => reason.includes(keyword))) {
//       return "SOFT"
//     }

//     // Provider-specific checks
//     if (event.provider === "sendgrid" && payload.type === "bounce") {
//       return "HARD"
//     }
//     if (event.provider === "postmark" && payload.Type === "HardBounce") {
//       return "HARD"
//     }

//     // Default to soft bounce
//     return "SOFT"
//   }

//   /**
//    * Store webhook event for debugging
//    */
//   private async storeWebhookEvent(provider: WebhookProvider, payload: any, eventsProcessed: number): Promise<void> {
//     try {
//       await prisma.webhookEvent.create({
//         data: {
//           provider,
//           payload,
//           eventsProcessed,
//           processedAt: new Date(),
//         },
//       })
//     } catch (error) {
//       // Don't fail webhook processing if storage fails
//       logger.error("Failed to store webhook event", error as Error)
//     }
//   }

//   /**
//    * Process warmup interaction feedback
//    * Called when warmup emails get engagement
//    */
//   async processWarmupFeedback(
//     warmupId: string,
//     feedbackType: "delivered" | "opened" | "clicked" | "replied",
//   ): Promise<void> {
//     const interaction = await prisma.warmupInteraction.findFirst({
//       where: { warmupId },
//     })

//     if (!interaction) {
//       logger.warn("Warmup interaction not found", { warmupId })
//       return
//     }

//     const updates: any = {}

//     switch (feedbackType) {
//       case "delivered":
//         updates.deliveredAt = new Date()
//         updates.landedInInbox = true
//         break
//       case "opened":
//         updates.openedAt = new Date()
//         updates.landedInInbox = true
//         break
//       case "clicked":
//         updates.clickedAt = new Date()
//         break
//       case "replied":
//         updates.repliedAt = new Date()
//         break
//     }

//     await prisma.warmupInteraction.update({
//       where: { id: interaction.id },
//       data: updates,
//     })

//     logger.info("Warmup feedback processed", {
//       warmupId,
//       feedbackType,
//       sessionId: interaction.sessionId,
//     })
//   }
// }

// export const webhookHandler = new WebhookHandler()







// import { prisma } from "@/lib/db"
// import { logger } from "@/lib/logger"
// import { metricsTracker } from "./warmup/metrics-tracker"
// import crypto from "crypto"
// import { strategyAdjuster } from "./warmup/strategy-adjuster"
// import { handleError } from "@/lib/types/custom-errors"

// // Webhook event types from major email providers
// export type WebhookProvider = "sendgrid" | "postmark" | "mailgun" | "resend" | "ses"

// export interface WebhookEvent {
//   provider: WebhookProvider
//   event: string
//   timestamp: Date
//   messageId?: string
//   recipientEmail: string
//   rawPayload: any
// }

// interface BounceEvent extends WebhookEvent {
//   bounceType: "hard" | "soft" | "complaint"
//   bounceReason?: string
//   diagnosticCode?: string
// }

// interface EngagementEvent extends WebhookEvent {
//   event: "open" | "click" | "delivered"
//   userAgent?: string
//   ipAddress?: string
//   clickedUrl?: string
// }

// interface WebhookEventData {
//   provider: WebhookProvider
//   eventType: string
//   recipientEmail: string
//   subject?: string
//   messageId?: string
//   emailLogId?: string
//   sendingAccountId?: string
//   warmupInteractionId?: string
//   bounceType?: string
//   bounceReason?: string
//   diagnosticCode?: string
//   ipAddress?: string
//   userAgent?: string
//   deviceType?: string
//   location?: string
//   rawPayload: any
//   signature?: string
// }

// export class WebhookHandler {
//   /**
//    * Main webhook processing entry point
//    * Validates signature and routes to appropriate handler
//    */
//   async processWebhook(
//     provider: WebhookProvider,
//     payload: any,
//     signature?: string,
//     timestamp?: string,
//   ): Promise<{ success: boolean; error?: string }> {
//     try {
//       // Step 1: Validate webhook signature
//       if (!this.validateSignature(provider, payload, signature, timestamp)) {
//         logger.warn("Invalid webhook signature", { provider })
//         return { success: false, error: "Invalid signature" }
//       }

//       // Step 2: Parse provider-specific payload
//       const events = this.parseWebhookPayload(provider, payload)

//       // Step 3: Process each event
//       for (const event of events) {
//         await this.processEvent(event)
//       }

//       // Step 4: Store webhook event for debugging
//       await this.storeWebhookEvent(provider, payload, events.length)

//       logger.info("Webhook processed successfully", {
//         provider,
//         eventsCount: events.length,
//       })

//       return { success: true }
//     } catch (error) {
//       logger.error("Webhook processing failed", error as Error, { provider })
//       return { success: false, error: (error as Error).message }
//     }
//   }

//   /**
//    * Validate webhook signature based on provider
//    */
//   private validateSignature(provider: WebhookProvider, payload: any, signature?: string, timestamp?: string): boolean {
//     // In production, implement signature validation for each provider
//     // For now, allow webhooks in development
//     if (process.env.NODE_ENV === "development") return true

//     try {
//       switch (provider) {
//         case "sendgrid":
//           return this.validateSendGridSignature(payload, signature, timestamp)
//         case "postmark":
//           return this.validatePostmarkSignature(payload, signature)
//         case "mailgun":
//           return this.validateMailgunSignature(payload, signature, timestamp)
//         case "resend":
//           return this.validateResendSignature(payload, signature)
//         case "ses":
//           return this.validateSESSignature(payload, signature)
//         default:
//           return false
//       }
//     } catch (error) {
//       logger.error("Signature validation error", error as Error, { provider })
//       return false
//     }
//   }

//   private validateSendGridSignature(payload: any, signature?: string, timestamp?: string): boolean {
//     if (!signature || !timestamp) return false

//     const verificationKey = process.env.SENDGRID_WEBHOOK_VERIFICATION_KEY
//     if (!verificationKey) return false

//     const payload_string = timestamp + JSON.stringify(payload)
//     const hash = crypto.createHmac("sha256", verificationKey).update(payload_string).digest("base64")

//     return hash === signature
//   }

//   private validatePostmarkSignature(payload: any, signature?: string): boolean {
//     // Postmark doesn't use signatures, but validates via headers
//     return true
//   }

//   private validateMailgunSignature(payload: any, signature?: string, timestamp?: string): boolean {
//     if (!signature || !timestamp) return false

//     const signingKey = process.env.MAILGUN_WEBHOOK_SIGNING_KEY
//     if (!signingKey) return false

//     const token = payload.token
//     const hmac = crypto
//       .createHmac("sha256", signingKey)
//       .update(timestamp + token)
//       .digest("hex")

//     return hmac === signature
//   }

//   private validateResendSignature(payload: any, signature?: string): boolean {
//     if (!signature) return false

//     const webhookSecret = process.env.RESEND_WEBHOOK_SECRET
//     if (!webhookSecret) return false

//     const hash = crypto.createHmac("sha256", webhookSecret).update(JSON.stringify(payload)).digest("hex")

//     return `sha256=${hash}` === signature
//   }

//   private validateSESSignature(payload: any, signature?: string): boolean {
//     // AWS SNS signature validation
//     // This requires the AWS SDK for proper validation
//     return true
//   }

//   /**
//    * Parse webhook payload based on provider format
//    */
//   private parseWebhookPayload(provider: WebhookProvider, payload: any): WebhookEvent[] {
//     switch (provider) {
//       case "sendgrid":
//         return this.parseSendGridPayload(payload)
//       case "postmark":
//         return this.parsePostmarkPayload(payload)
//       case "mailgun":
//         return this.parseMailgunPayload(payload)
//       case "resend":
//         return this.parseResendPayload(payload)
//       case "ses":
//         return this.parseSESPayload(payload)
//       default:
//         throw new Error(`Unknown provider: ${provider}`)
//     }
//   }

//   private parseSendGridPayload(payload: any): WebhookEvent[] {
//     // SendGrid sends array of events
//     if (!Array.isArray(payload)) {
//       payload = [payload]
//     }

//     return payload.map((event: any) => ({
//       provider: "sendgrid",
//       event: event.event,
//       timestamp: new Date(event.timestamp * 1000),
//       messageId: event.sg_message_id,
//       recipientEmail: event.email,
//       rawPayload: event,
//     }))
//   }

//   private parsePostmarkPayload(payload: any): WebhookEvent[] {
//     return [
//       {
//         provider: "postmark",
//         event: payload.RecordType?.toLowerCase() || "unknown",
//         timestamp: new Date(payload.DeliveredAt || payload.BouncedAt || Date.now()),
//         messageId: payload.MessageID,
//         recipientEmail: payload.Email || payload.Recipient,
//         rawPayload: payload,
//       },
//     ]
//   }

//   private parseMailgunPayload(payload: any): WebhookEvent[] {
//     const eventData = payload["event-data"]
//     return [
//       {
//         provider: "mailgun",
//         event: eventData.event,
//         timestamp: new Date(eventData.timestamp * 1000),
//         messageId: eventData.message?.headers?.["message-id"],
//         recipientEmail: eventData.recipient,
//         rawPayload: payload,
//       },
//     ]
//   }

//   private parseResendPayload(payload: any): WebhookEvent[] {
//     return [
//       {
//         provider: "resend",
//         event: payload.type,
//         timestamp: new Date(payload.created_at),
//         messageId: payload.data?.email_id,
//         recipientEmail: payload.data?.to?.[0],
//         rawPayload: payload,
//       },
//     ]
//   }

//   private parseSESPayload(payload: any): WebhookEvent[] {
//     const message = JSON.parse(payload.Message)
//     return [
//       {
//         provider: "ses",
//         event: message.notificationType?.toLowerCase() || "unknown",
//         timestamp: new Date(message.mail.timestamp),
//         messageId: message.mail.messageId,
//         recipientEmail: message.mail.destination[0],
//         rawPayload: payload,
//       },
//     ]
//   }

//   /**
//    * Process individual webhook event
//    */
//   private async processEvent(event: WebhookEvent): Promise<void> {
//     logger.info("Processing webhook event", {
//       provider: event.provider,
//       event: event.event,
//       recipient: event.recipientEmail,
//     })

//     // Find the email log OR warmup interaction
//     const emailLogOrWarmup = await this.findEmailLog(event)

//     if (!emailLogOrWarmup) {
//       logger.warn("Email log/warmup interaction not found for webhook event", {
//         messageId: event.messageId,
//         recipient: event.recipientEmail,
//       })
//       return
//     }

//     const isWarmup = emailLogOrWarmup.isWarmup
//     const emailLogId = emailLogOrWarmup.id
//     const warmupInteractionId = emailLogOrWarmup.warmupInteractionId

//     // Route to specific handler based on event type
//     switch (event.event) {
//       case "delivered":
//       case "delivery":
//         if (isWarmup) {
//           await this.handleWarmupDelivered(warmupInteractionId, event)
//         } else {
//           await this.handleDelivered(emailLogId||"", event)
//         }
//         break

//       case "open":
//       case "opened":
//         if (isWarmup) {
//           await this.handleWarmupOpened(warmupInteractionId, event as EngagementEvent)
//         } else {
//           await this.handleOpened(emailLogId||"", event as EngagementEvent)
//         }
//         break

//       case "click":
//       case "clicked":
//         if (isWarmup) {
//           await this.handleWarmupClicked(warmupInteractionId, event as EngagementEvent)
//         } else {
//           await this.handleClicked(emailLogId||"", event as EngagementEvent)
//         }
//         break

//       case "bounce":
//       case "bounced":
//         if (isWarmup) {
//           await this.handleWarmupBounce(warmupInteractionId, event as BounceEvent)
//         } else {
//           await this.handleBounce(emailLogId||"", event as BounceEvent)
//         }
//         break

//       case "complaint":
//       case "spamcomplaint":
//       case "spam_report":
//         if (isWarmup) {
//           await this.handleWarmupComplaint(warmupInteractionId, event as BounceEvent)
//         } else {
//           await this.handleComplaint(emailLogId||"", event as BounceEvent)
//         }
//         break

//       case "unsubscribe":
//         await this.handleUnsubscribe(emailLogId||"", event)
//         break

//       default:
//         logger.debug("Unhandled webhook event type", { event: event.event })
//     }
//   }

//   /**
//    * Find email log by message ID or tracking info
//    */
//   private async findEmailLog(event: WebhookEvent) {
//     // Try by provider ID first (most reliable)
//     if (event.messageId) {
//       const byProviderId = await prisma.emailLog.findFirst({
//         where: { providerId: event.messageId },
//       })
//       if (byProviderId) return { id: byProviderId.id, isWarmup: false }
//     }

//     if (event.messageId) {
//       const warmupInteraction = await prisma.warmupInteraction.findFirst({
//         where: { messageId: event.messageId },
//       })
//       if (warmupInteraction) {
//         return { id: null, warmupInteractionId: warmupInteraction.id, isWarmup: true }
//       }
//     }

//     // Try by tracking ID (for campaign emails)
//     const byTrackingId = await prisma.emailLog.findFirst({
//       where: {
//         toEmail: event.recipientEmail,
//         sentAt: {
//           gte: new Date(event.timestamp.getTime() - 3600000), // Within 1 hour
//           lte: new Date(event.timestamp.getTime() + 3600000),
//         },
//       },
//       orderBy: { sentAt: "desc" },
//     })

//     return byTrackingId ? { id: byTrackingId.id, isWarmup: false } : null
//   }

//   /**
//    * Handle warmup email delivered
//    */
//   private async handleWarmupDelivered(warmupInteractionId: string | undefined, event: WebhookEvent): Promise<void> {
//     if (!warmupInteractionId) return

//     const interaction = await prisma.warmupInteraction.findUnique({
//       where: { id: warmupInteractionId },
//       select: { sendingAccountId: true },
//     })

//     await prisma.warmupInteraction.update({
//       where: { id: warmupInteractionId },
//       data: {
//         deliveredAt: event.timestamp,
//         landedInInbox: true,
//       },
//     })

//     if (interaction?.sendingAccountId) {
//       await metricsTracker.trackDelivered(interaction.sendingAccountId)
//     }

//     logger.info("Warmup email delivered", { warmupInteractionId })
//   }

//   /**
//    * Handle warmup email opened
//    */
//   private async handleWarmupOpened(warmupInteractionId: string | undefined, event: EngagementEvent): Promise<void> {
//     if (!warmupInteractionId) return

//     const interaction = await prisma.warmupInteraction.findUnique({
//       where: { id: warmupInteractionId },
//       select: { sendingAccountId: true, openedAt: true },
//     })

//     const isFirstOpen = !interaction?.openedAt

//     await prisma.warmupInteraction.update({
//       where: { id: warmupInteractionId },
//       data: { openedAt: isFirstOpen ? event.timestamp : undefined, landedInInbox: true },
//     })

//     if (isFirstOpen && interaction?.sendingAccountId) {
//       await metricsTracker.trackOpened(interaction.sendingAccountId)
//     }

//     logger.info("Warmup email opened", { warmupInteractionId })
//   }

//   /**
//    * Handle warmup email clicked
//    */
//   private async handleWarmupClicked(warmupInteractionId: string | undefined, event: EngagementEvent): Promise<void> {
//     if (!warmupInteractionId) return

//     const interaction = await prisma.warmupInteraction.findUnique({
//       where: { id: warmupInteractionId },
//       select: { sendingAccountId: true, openedAt: true },
//     })

//     if (!interaction) return

//     // For clicks, we just mark inbox placement as positive (user engaged)
//     await prisma.warmupInteraction.update({
//       where: { id: warmupInteractionId },
//       data: { landedInInbox: true },
//     })

//     // Track click in metrics
//     if (interaction.sendingAccountId) {
//       await metricsTracker.trackClicked(interaction.sendingAccountId)
//     }

//     logger.info("Warmup email clicked", { warmupInteractionId })
//   }

//   /**
//    * Handle warmup email bounce
//    */
//   private async handleWarmupBounce(warmupInteractionId: string | undefined, event: BounceEvent): Promise<void> {
//     if (!warmupInteractionId) return

//     const interaction = await prisma.warmupInteraction.findUnique({
//       where: { id: warmupInteractionId },
//       select: { sendingAccountId: true, warmupEmailId: true },
//     })

//     if (!interaction || !interaction.sendingAccountId) return

//     const bounceType = this.determineBounceType(event)

//     // Track bounce in metrics
//     await metricsTracker.trackBounce(interaction.sendingAccountId, bounceType)

//     // If hard bounce on warmup email, log warning
//     if (bounceType === "HARD" && interaction.warmupEmailId) {
//       logger.warn("Hard bounce on warmup email", {
//         warmupEmailId: interaction.warmupEmailId,
//       })
//     }

//     logger.warn("Warmup email bounced", {
//       warmupInteractionId,
//       bounceType,
//     })
//   }

//   /**
//    * Handle warmup email spam complaint
//    */
//   private async handleWarmupComplaint(warmupInteractionId: string | undefined, event: BounceEvent): Promise<void> {
//     if (!warmupInteractionId) return

//     const interaction = await prisma.warmupInteraction.findUnique({
//       where: { id: warmupInteractionId },
//       select: { sendingAccountId: true, warmupEmailId: true },
//     })

//     if (!interaction) return

//     // Update interaction to show it landed in spam
//     await prisma.warmupInteraction.update({
//       where: { id: warmupInteractionId },
//       data: { landedInSpam: true },
//     })

//     if (interaction.sendingAccountId) {
//       await metricsTracker.trackComplaint(interaction.sendingAccountId)
//     }

//     // Critical: warmup email marked as spam
//     if (interaction.warmupEmailId) {
//       logger.error("Warmup email marked as spam", {
//         warmupEmailId: interaction.warmupEmailId,
//         sendingAccountId: interaction.sendingAccountId,
//       })

//       // Trigger strategy adjustment
//       if (interaction.sendingAccountId) {
//         await strategyAdjuster.handleDeliverabilityIssue(interaction.sendingAccountId, {
//           trigger: "spam_rate",
//           severity: "MAJOR",
//           detectedAt: new Date(),
//         })
//       }
//     }
//   }

//   /**
//    * Handle campaign email delivered (original logic)
//    */
//   private async handleDelivered(emailLogId: string, event: WebhookEvent): Promise<void> {
//     await prisma.emailLog.update({
//       where: { id: emailLogId },
//       data: {
//         status: "DELIVERED",
//         deliveredAt: event.timestamp,
//       },
//     })

//     // Update prospect
//     const emailLog = await prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//       select: { prospectId: true, sendingAccountId: true },
//     })

//     if (emailLog?.sendingAccountId) {
//       await metricsTracker.trackDelivered(emailLog.sendingAccountId)
//     }
//   }

//   /**
//    * Handle campaign email opened (original logic)
//    */
//   private async handleOpened(emailLogId: string, event: EngagementEvent): Promise<void> {
//     const emailLog = await prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//       select: { opens: true, prospectId: true, sendingAccountId: true },
//     })

//     if (!emailLog) return

//     const isFirstOpen = emailLog.opens === 0

//     await prisma.emailLog.update({
//       where: { id: emailLogId },
//       data: {
//         opens: { increment: 1 },
//         openedAt: isFirstOpen ? event.timestamp : undefined,
//       },
//     })

//     if (emailLog.prospectId) {
//       await prisma.prospect.update({
//         where: { id: emailLog.prospectId },
//         data: {
//           emailsOpened: { increment: 1 },
//         },
//       })
//     }

//     // Track metrics (only first open)
//     if (isFirstOpen && emailLog.sendingAccountId) {
//       await metricsTracker.trackOpened(emailLog.sendingAccountId)
//     }

//     logger.info("Campaign email opened", {
//       emailLogId,
//       prospectId: emailLog.prospectId,
//       totalOpens: emailLog.opens + 1,
//     })
//   }

//   /**
//    * Handle campaign email clicked (original logic)
//    */
//   private async handleClicked(emailLogId: string, event: EngagementEvent): Promise<void> {
//     const emailLog = await prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//       select: { clicks: true, prospectId: true, sendingAccountId: true },
//     })

//     if (!emailLog) return

//     const isFirstClick = emailLog.clicks === 0

//     await prisma.emailLog.update({
//       where: { id: emailLogId },
//       data: {
//         clicks: { increment: 1 },
//         clickedAt: isFirstClick ? event.timestamp : undefined,
//       },
//     })

//     if (emailLog.prospectId) {
//       await prisma.prospect.update({
//         where: { id: emailLog.prospectId },
//         data: {
//           emailsClicked: { increment: 1 },
//         },
//       })
//     }

//     // Track metrics (only first click)
//     if (isFirstClick && emailLog.sendingAccountId) {
//       await metricsTracker.trackClicked(emailLog.sendingAccountId)
//     }

//     logger.info("Campaign email clicked", {
//       emailLogId,
//       url: event.clickedUrl,
//       totalClicks: emailLog.clicks + 1,
//     })
//   }

//   /**
//    * Handle campaign bounce
//    */
//   private async handleBounce(emailLogId: string, event: BounceEvent): Promise<void> {
//     const emailLog = await prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//       select: { prospectId: true, sendingAccountId: true },
//     })

//     if (!emailLog) return

//     // Determine bounce type from payload
//     const bounceType = this.determineBounceType(event)

//     // Update email log
//     await prisma.emailLog.update({
//       where: { id: emailLogId },
//       data: {
//         status: "BOUNCED",
//         bouncedAt: event.timestamp,
//       },
//     })

//     // Create bounce record
//     await prisma.emailBounce.create({
//       data: {
//         emailLogId,
//         sendingAccountId: emailLog.sendingAccountId!,
//         bounceType,
//         bounceReason: event.bounceReason,
//         diagnosticCode: event.diagnosticCode,
//         recipientEmail: event.recipientEmail,
//         bouncedAt: event.timestamp,
//       },
//     })

//     if (emailLog.prospectId) {
//       await prisma.prospect.update({
//         where: { id: emailLog.prospectId },
//         data: {
//           bounced: bounceType === "HARD",
//           status: bounceType === "HARD" ? "BOUNCED" : undefined,
//         },
//       })
//     }

//     // Track metrics
//     if (emailLog.sendingAccountId) {
//       await metricsTracker.trackBounce(emailLog.sendingAccountId, bounceType)
//     }

//     logger.warn("Campaign email bounced", {
//       emailLogId,
//       bounceType,
//       reason: event.bounceReason,
//     })
//   }

//   /**
//    * Handle campaign spam complaint
//    */
//   private async handleComplaint(emailLogId: string, event: BounceEvent): Promise<void> {
//     const emailLog = await prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//       select: { prospectId: true, sendingAccountId: true },
//     })

//     if (!emailLog) return

//     // Create bounce record with COMPLAINT type
//     await prisma.emailBounce.create({
//       data: {
//         emailLogId,
//         sendingAccountId: emailLog.sendingAccountId!,
//         bounceType: "COMPLAINT",
//         bounceReason: "Spam complaint",
//         recipientEmail: event.recipientEmail,
//         bouncedAt: event.timestamp,
//       },
//     })

//     if (emailLog.prospectId) {
//       await prisma.prospect.update({
//         where: { id: emailLog.prospectId },
//         data: {
//           unsubscribed: true,
//           status: "UNSUBSCRIBED",
//         },
//       })
//     }

//     // Track complaint (critical for sender reputation)
//     if (emailLog.sendingAccountId) {
//       await metricsTracker.trackComplaint(emailLog.sendingAccountId)
//     }

//     logger.error("Spam complaint received", {
//       emailLogId,
//       recipient: event.recipientEmail,
//     })
//   }

//   /**
//    * Handle unsubscribe event - CAMPAIGN ONLY
//    */
//   private async handleUnsubscribe(emailLogId: string, event: WebhookEvent): Promise<void> {
//     const emailLog = await prisma.emailLog.findUnique({
//       where: { id: emailLogId },
//       select: { prospectId: true },
//     })

//     if (!emailLog || !emailLog.prospectId) return

//     await prisma.prospect.update({
//       where: { id: emailLog.prospectId },
//       data: {
//         unsubscribed: true,
//         status: "UNSUBSCRIBED",
//       },
//     })

//     logger.info("Prospect unsubscribed", { prospectId: emailLog.prospectId })
//   }

//   /**
//    * Determine bounce type from event payload
//    */
//   private determineBounceType(event: BounceEvent): "HARD" | "SOFT" | "COMPLAINT" {
//     const bounceStr = event.bounceType?.toLowerCase() || ""

//     if (bounceStr.includes("hard") || bounceStr.includes("permanent")) {
//       return "HARD"
//     }
//     if (bounceStr.includes("complaint") || bounceStr.includes("spam")) {
//       return "COMPLAINT"
//     }
//     return "SOFT"
//   }

//   /**
//    * Store webhook event for debugging
//    */
//   private async storeWebhookEvent(provider: WebhookProvider, payload: any, eventCount: number): Promise<void> {
//     try {
//       await prisma.webhookEvent.create({
//         data: {
//           userId: "system",
//           provider,
//           eventType: "batch",
//           recipientEmail: "system@webhook.log",
//           rawPayload: payload,
//           processed: true,
//           processedAt: new Date(),
//         },
//       })
//     } catch (error) {
//       logger.error("Failed to store webhook event", { error: handleError(error) })
//     }
//   }

//   /**
//    * Process warmup interaction feedback
//    * Called when warmup emails get engagement
//    */
//   async processWarmupFeedback(
//     warmupId: string,
//     feedbackType: "delivered" | "opened" | "clicked" | "replied",
//   ): Promise<void> {
//     const interaction = await prisma.warmupInteraction.findFirst({
//       where: { warmupId },
//     })

//     if (!interaction) {
//       logger.warn("Warmup interaction not found", { warmupId })
//       return
//     }

//     const updates: any = {}

//     switch (feedbackType) {
//       case "delivered":
//         updates.deliveredAt = new Date()
//         updates.landedInInbox = true
//         break
//       case "opened":
//         updates.openedAt = new Date()
//         updates.landedInInbox = true
//         break
//       case "clicked":
//         updates.clickedAt = new Date()
//         break
//       case "replied":
//         updates.repliedAt = new Date()
//         break
//     }

//     await prisma.warmupInteraction.update({
//       where: { id: interaction.id },
//       data: updates,
//     })

//     logger.info("Warmup feedback processed", {
//       warmupId,
//       feedbackType,
//       sessionId: interaction.sessionId,
//     })
//   }

//   /**
//    * Log webhook event to database
//    */
//   async logWebhookEvent(data: {
//     userId: string
//     provider: WebhookProvider
//     eventType: string
//     recipientEmail: string
//     subject?: string
//     messageId?: string
//     emailLogId?: string
//     sendingAccountId?: string
//     warmupInteractionId?: string
//     bounceType?: string
//     bounceReason?: string
//     diagnosticCode?: string
//     ipAddress?: string
//     userAgent?: string
//     deviceType?: string
//     location?: string
//     rawPayload: any
//     signature?: string
//   }): Promise<void> {
//     try {
//       await prisma.webhookEvent.create({
//         data: {
//           userId: data.userId,
//           provider: data.provider,
//           eventType: data.eventType,
//           recipientEmail: data.recipientEmail,
//           subject: data.subject,
//           messageId: data.messageId,
//           emailLogId: data.emailLogId,
//           sendingAccountId: data.sendingAccountId,
//           warmupInteractionId: data.warmupInteractionId,
//           bounceType: data.bounceType,
//           bounceReason: data.bounceReason,
//           diagnosticCode: data.diagnosticCode,
//           ipAddress: data.ipAddress,
//           userAgent: data.userAgent,
//           deviceType: data.deviceType,
//           location: data.location,
//           rawPayload: data.rawPayload as any,
//           signature: data.signature,
//         },
//       })

//       logger.info("Webhook event logged", {
//         provider: data.provider,
//         eventType: data.eventType,
//         messageId: data.messageId,
//       })
//     } catch (error) {
//       logger.error("Failed to log webhook event", {
//         error: error instanceof Error ? error.message : String(error),
//         provider: data.provider,
//         eventType: data.eventType,
//       })
//     }
//   }
// }

// export const webhookHandler = new WebhookHandler()










import { prisma } from "@/lib/db"
import { logger } from "@/lib/logger"
import { metricsTracker } from "./warmup/metrics-tracker"
import crypto from "crypto"
import { strategyAdjuster } from "./warmup/strategy-adjuster"
import { handleError } from "@/lib/types/custom-errors"

// Webhook event types from major email providers
export type WebhookProvider = "sendgrid" | "postmark" | "mailgun" | "resend" | "ses"

export interface WebhookEvent {
  provider: WebhookProvider
  event: string
  timestamp: Date
  messageId?: string
  recipientEmail: string
  rawPayload: any
}

interface BounceEvent extends WebhookEvent {
  bounceType: "hard" | "soft" | "complaint"
  bounceReason?: string
  diagnosticCode?: string
}

interface EngagementEvent extends WebhookEvent {
  event: "open" | "click" | "delivered"
  userAgent?: string
  ipAddress?: string
  clickedUrl?: string
}

interface WebhookEventData {
  provider: WebhookProvider
  eventType: string
  recipientEmail: string
  subject?: string
  messageId?: string
  emailLogId?: string
  sendingAccountId?: string
  warmupInteractionId?: string
  bounceType?: string
  bounceReason?: string
  diagnosticCode?: string
  ipAddress?: string
  userAgent?: string
  deviceType?: string
  location?: string
  rawPayload: any
  signature?: string
}

export class WebhookHandler {
  /**
   * Main webhook processing entry point
   * Validates signature and routes to appropriate handler
   */
  async processWebhook(
    provider: WebhookProvider,
    payload: any,
    signature?: string,
    timestamp?: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Step 1: Validate webhook signature
      if (!this.validateSignature(provider, payload, signature, timestamp)) {
        logger.warn("Invalid webhook signature", { provider })
        return { success: false, error: "Invalid signature" }
      }

      // Step 2: Parse provider-specific payload
      const events = this.parseWebhookPayload(provider, payload)

      // Step 3: Process each event
      for (const event of events) {
        await this.processEvent(event)
      }

      // Step 4: Store webhook event for debugging
      await this.storeWebhookEvent(provider, payload, events.length)

      logger.info("Webhook processed successfully", {
        provider,
        eventsCount: events.length,
      })

      return { success: true }
    } catch (error) {
      logger.error("Webhook processing failed", error as Error, { provider })
      return { success: false, error: (error as Error).message }
    }
  }

  /**
   * Validate webhook signature based on provider
   */
  private validateSignature(provider: WebhookProvider, payload: any, signature?: string, timestamp?: string): boolean {
    // In production, implement signature validation for each provider
    // For now, allow webhooks in development
    if (process.env.NODE_ENV === "development") return true

    try {
      switch (provider) {
        case "sendgrid":
          return this.validateSendGridSignature(payload, signature, timestamp)
        case "postmark":
          return this.validatePostmarkSignature(payload, signature)
        case "mailgun":
          return this.validateMailgunSignature(payload, signature, timestamp)
        case "resend":
          return this.validateResendSignature(payload, signature)
        case "ses":
          return this.validateSESSignature(payload, signature)
        default:
          return false
      }
    } catch (error) {
      logger.error("Signature validation error", error as Error, { provider })
      return false
    }
  }

  private validateSendGridSignature(payload: any, signature?: string, timestamp?: string): boolean {
    if (!signature || !timestamp) return false

    const verificationKey = process.env.SENDGRID_WEBHOOK_VERIFICATION_KEY
    if (!verificationKey) return false

    const payload_string = timestamp + JSON.stringify(payload)
    const hash = crypto.createHmac("sha256", verificationKey).update(payload_string).digest("base64")

    return hash === signature
  }

  private validatePostmarkSignature(payload: any, signature?: string): boolean {
    // Postmark doesn't use signatures, but validates via headers
    return true
  }

  private validateMailgunSignature(payload: any, signature?: string, timestamp?: string): boolean {
    if (!signature || !timestamp) return false

    const signingKey = process.env.MAILGUN_WEBHOOK_SIGNING_KEY
    if (!signingKey) return false

    const token = payload.token
    const hmac = crypto
      .createHmac("sha256", signingKey)
      .update(timestamp + token)
      .digest("hex")

    return hmac === signature
  }

  private validateResendSignature(payload: any, signature?: string): boolean {
    if (!signature) return false

    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET
    if (!webhookSecret) return false

    const hash = crypto.createHmac("sha256", webhookSecret).update(JSON.stringify(payload)).digest("hex")

    return `sha256=${hash}` === signature
  }

  private validateSESSignature(payload: any, signature?: string): boolean {
    // AWS SNS signature validation
    // This requires the AWS SDK for proper validation
    return true
  }

  /**
   * Parse webhook payload based on provider format
   */
  private parseWebhookPayload(provider: WebhookProvider, payload: any): WebhookEvent[] {
    switch (provider) {
      case "sendgrid":
        return this.parseSendGridPayload(payload)
      case "postmark":
        return this.parsePostmarkPayload(payload)
      case "mailgun":
        return this.parseMailgunPayload(payload)
      case "resend":
        return this.parseResendPayload(payload)
      case "ses":
        return this.parseSESPayload(payload)
      default:
        throw new Error(`Unknown provider: ${provider}`)
    }
  }

  private parseSendGridPayload(payload: any): WebhookEvent[] {
    // SendGrid sends array of events
    if (!Array.isArray(payload)) {
      payload = [payload]
    }

    return payload.map((event: any) => ({
      provider: "sendgrid",
      event: event.event,
      timestamp: new Date(event.timestamp * 1000),
      messageId: event.sg_message_id,
      recipientEmail: event.email,
      rawPayload: event,
    }))
  }

  private parsePostmarkPayload(payload: any): WebhookEvent[] {
    return [
      {
        provider: "postmark",
        event: payload.RecordType?.toLowerCase() || "unknown",
        timestamp: new Date(payload.DeliveredAt || payload.BouncedAt || Date.now()),
        messageId: payload.MessageID,
        recipientEmail: payload.Email || payload.Recipient,
        rawPayload: payload,
      },
    ]
  }

  private parseMailgunPayload(payload: any): WebhookEvent[] {
    const eventData = payload["event-data"]
    return [
      {
        provider: "mailgun",
        event: eventData.event,
        timestamp: new Date(eventData.timestamp * 1000),
        messageId: eventData.message?.headers?.["message-id"],
        recipientEmail: eventData.recipient,
        rawPayload: payload,
      },
    ]
  }

  private parseResendPayload(payload: any): WebhookEvent[] {
    return [
      {
        provider: "resend",
        event: payload.type,
        timestamp: new Date(payload.created_at),
        messageId: payload.data?.email_id,
        recipientEmail: payload.data?.to?.[0],
        rawPayload: payload,
      },
    ]
  }

  private parseSESPayload(payload: any): WebhookEvent[] {
    const message = JSON.parse(payload.Message)
    return [
      {
        provider: "ses",
        event: message.notificationType?.toLowerCase() || "unknown",
        timestamp: new Date(message.mail.timestamp),
        messageId: message.mail.messageId,
        recipientEmail: message.mail.destination[0],
        rawPayload: payload,
      },
    ]
  }

  /**
   * Process individual webhook event
   */
  private async processEvent(event: WebhookEvent): Promise<void> {
    logger.info("Processing webhook event", {
      provider: event.provider,
      event: event.event,
      recipient: event.recipientEmail,
    })

    // Find the email log OR warmup interaction
    const emailLogOrWarmup = await this.findEmailLog(event)

    if (!emailLogOrWarmup) {
      logger.warn("Email log/warmup interaction not found for webhook event", {
        messageId: event.messageId,
        recipient: event.recipientEmail,
      })
      return
    }

    const isWarmup = emailLogOrWarmup.isWarmup
    const emailLogId = emailLogOrWarmup.id
    const warmupInteractionId = emailLogOrWarmup.warmupInteractionId

    // Route to specific handler based on event type
    switch (event.event) {
      case "delivered":
      case "delivery":
        if (isWarmup) {
          await this.handleWarmupDelivered(warmupInteractionId, event)
        } else {
          await this.handleDelivered(emailLogId||"", event)
        }
        break

      case "open":
      case "opened":
        if (isWarmup) {
          await this.handleWarmupOpened(warmupInteractionId, event as EngagementEvent)
        } else {
          await this.handleOpened(emailLogId||"", event as EngagementEvent)
        }
        break

      case "click":
      case "clicked":
        if (isWarmup) {
          await this.handleWarmupClicked(warmupInteractionId, event as EngagementEvent)
        } else {
          await this.handleClicked(emailLogId||"", event as EngagementEvent)
        }
        break

      case "bounce":
      case "bounced":
        if (isWarmup) {
          await this.handleWarmupBounce(warmupInteractionId, event as BounceEvent)
        } else {
          await this.handleBounce(emailLogId||"", event as BounceEvent)
        }
        break

      case "complaint":
      case "spamcomplaint":
      case "spam_report":
        if (isWarmup) {
          await this.handleWarmupComplaint(warmupInteractionId, event as BounceEvent)
        } else {
          await this.handleComplaint(emailLogId||"", event as BounceEvent)
        }
        break

      case "unsubscribe":
        await this.handleUnsubscribe(emailLogId||"", event)
        break

      default:
        logger.debug("Unhandled webhook event type", { event: event.event })
    }
  }

  /**
   * Find email log by message ID or tracking info
   */
  private async findEmailLog(event: WebhookEvent) {
    // Try by provider ID first (most reliable)
    if (event.messageId) {
      const byProviderId = await prisma.emailLog.findFirst({
        where: { providerId: event.messageId },
      })
      if (byProviderId) return { id: byProviderId.id, isWarmup: false }
    }

    if (event.messageId) {
      const warmupInteraction = await prisma.warmupInteraction.findFirst({
        where: { messageId: event.messageId },
      })
      if (warmupInteraction) {
        return { id: null, warmupInteractionId: warmupInteraction.id, isWarmup: true }
      }
    }

    // Try by tracking ID (for campaign emails)
    const byTrackingId = await prisma.emailLog.findFirst({
      where: {
        toEmail: event.recipientEmail,
        sentAt: {
          gte: new Date(event.timestamp.getTime() - 3600000), // Within 1 hour
          lte: new Date(event.timestamp.getTime() + 3600000),
        },
      },
      orderBy: { sentAt: "desc" },
    })

    return byTrackingId ? { id: byTrackingId.id, isWarmup: false } : null
  }

  /**
   * Handle warmup email delivered
   */
  private async handleWarmupDelivered(warmupInteractionId: string | undefined, event: WebhookEvent): Promise<void> {
    if (!warmupInteractionId) return

    const interaction = await prisma.warmupInteraction.findUnique({
      where: { id: warmupInteractionId },
      select: { sendingAccountId: true },
    })

    await prisma.warmupInteraction.update({
      where: { id: warmupInteractionId },
      data: {
        deliveredAt: event.timestamp,
        landedInInbox: true,
      },
    })

    if (interaction?.sendingAccountId) {
      await metricsTracker.trackDelivered(interaction.sendingAccountId)
    }

    logger.info("Warmup email delivered", { warmupInteractionId })
  }

  /**
   * Handle warmup email opened
   */
  private async handleWarmupOpened(warmupInteractionId: string | undefined, event: EngagementEvent): Promise<void> {
    if (!warmupInteractionId) return

    const interaction = await prisma.warmupInteraction.findUnique({
      where: { id: warmupInteractionId },
      select: { sendingAccountId: true, openedAt: true },
    })

    const isFirstOpen = !interaction?.openedAt

    await prisma.warmupInteraction.update({
      where: { id: warmupInteractionId },
      data: { openedAt: isFirstOpen ? event.timestamp : undefined, landedInInbox: true },
    })

    if (isFirstOpen && interaction?.sendingAccountId) {
      await metricsTracker.trackOpened(interaction.sendingAccountId)
    }

    logger.info("Warmup email opened", { warmupInteractionId })
  }

  /**
   * Handle warmup email clicked
   */
  private async handleWarmupClicked(warmupInteractionId: string | undefined, event: EngagementEvent): Promise<void> {
    if (!warmupInteractionId) return

    const interaction = await prisma.warmupInteraction.findUnique({
      where: { id: warmupInteractionId },
      select: { sendingAccountId: true, openedAt: true },
    })

    if (!interaction) return

    // For clicks, we just mark inbox placement as positive (user engaged)
    await prisma.warmupInteraction.update({
      where: { id: warmupInteractionId },
      data: { landedInInbox: true },
    })

    // Track click in metrics
    if (interaction.sendingAccountId) {
      await metricsTracker.trackClicked(interaction.sendingAccountId)
    }

    logger.info("Warmup email clicked", { warmupInteractionId })
  }

  /**
   * Handle warmup email bounce
   */
  private async handleWarmupBounce(warmupInteractionId: string | undefined, event: BounceEvent): Promise<void> {
    if (!warmupInteractionId) return

    const interaction = await prisma.warmupInteraction.findUnique({
      where: { id: warmupInteractionId },
      select: { sendingAccountId: true, warmupEmailId: true },
    })

    if (!interaction || !interaction.sendingAccountId) return

    const bounceType = this.determineBounceType(event)

    // Track bounce in metrics
    await metricsTracker.trackBounce(interaction.sendingAccountId, bounceType)

    if (bounceType === "HARD" && interaction.warmupEmailId) {
      logger.warn("Hard bounce on warmup email", {
        warmupEmailId: interaction.warmupEmailId,
      })
    }

    logger.warn("Warmup email bounced", {
      warmupInteractionId,
      bounceType,
    })
  }

  /**
   * Handle warmup email spam complaint
   */
  private async handleWarmupComplaint(warmupInteractionId: string | undefined, event: BounceEvent): Promise<void> {
    if (!warmupInteractionId) return

    const interaction = await prisma.warmupInteraction.findUnique({
      where: { id: warmupInteractionId },
      select: { sendingAccountId: true, warmupEmailId: true },
    })

    if (!interaction) return

    await prisma.warmupInteraction.update({
      where: { id: warmupInteractionId },
      data: { landedInSpam: true },
    })

    if (interaction.sendingAccountId) {
      await metricsTracker.trackComplaint(interaction.sendingAccountId)
    }

    if (interaction.warmupEmailId) {
      logger.error("Warmup email marked as spam", {
        warmupEmailId: interaction.warmupEmailId,
        sendingAccountId: interaction.sendingAccountId,
      })

      if (interaction.sendingAccountId) {
        await strategyAdjuster.handleDeliverabilityIssue(interaction.sendingAccountId, {
          trigger: "spam_rate",
          severity: "MAJOR",
          detectedAt: new Date(),
        })
      }
    }
  }

  /**
   * Handle campaign email delivered (original logic)
   */
  private async handleDelivered(emailLogId: string, event: WebhookEvent): Promise<void> {
    await prisma.emailLog.update({
      where: { id: emailLogId },
      data: {
        status: "DELIVERED",
        deliveredAt: event.timestamp,
      },
    })

    // Update prospect
    const emailLog = await prisma.emailLog.findUnique({
      where: { id: emailLogId },
      select: { prospectId: true, sendingAccountId: true },
    })

    if (emailLog?.sendingAccountId) {
      await metricsTracker.trackDelivered(emailLog.sendingAccountId)
    }
  }

  /**
   * Handle campaign email opened (original logic)
   */
  private async handleOpened(emailLogId: string, event: EngagementEvent): Promise<void> {
    const emailLog = await prisma.emailLog.findUnique({
      where: { id: emailLogId },
      select: { opens: true, prospectId: true, sendingAccountId: true },
    })

    if (!emailLog) return

    const isFirstOpen = emailLog.opens === 0

    await prisma.emailLog.update({
      where: { id: emailLogId },
      data: {
        opens: { increment: 1 },
        openedAt: isFirstOpen ? event.timestamp : undefined,
      },
    })

    if (emailLog.prospectId) {
      await prisma.prospect.update({
        where: { id: emailLog.prospectId },
        data: {
          emailsOpened: { increment: 1 },
        },
      })
    }

    // Track metrics (only first open)
    if (isFirstOpen && emailLog.sendingAccountId) {
      await metricsTracker.trackOpened(emailLog.sendingAccountId)
    }

    logger.info("Campaign email opened", {
      emailLogId,
      prospectId: emailLog.prospectId,
      totalOpens: emailLog.opens + 1,
    })
  }

  /**
   * Handle campaign email clicked (original logic)
   */
  private async handleClicked(emailLogId: string, event: EngagementEvent): Promise<void> {
    const emailLog = await prisma.emailLog.findUnique({
      where: { id: emailLogId },
      select: { clicks: true, prospectId: true, sendingAccountId: true },
    })

    if (!emailLog) return

    const isFirstClick = emailLog.clicks === 0

    await prisma.emailLog.update({
      where: { id: emailLogId },
      data: {
        clicks: { increment: 1 },
        clickedAt: isFirstClick ? event.timestamp : undefined,
      },
    })

    if (emailLog.prospectId) {
      await prisma.prospect.update({
        where: { id: emailLog.prospectId },
        data: {
          emailsClicked: { increment: 1 },
        },
      })
    }

    // Track metrics (only first click)
    if (isFirstClick && emailLog.sendingAccountId) {
      await metricsTracker.trackClicked(emailLog.sendingAccountId)
    }

    logger.info("Campaign email clicked", {
      emailLogId,
      url: event.clickedUrl,
      totalClicks: emailLog.clicks + 1,
    })
  }

  /**
   * Handle campaign bounce
   */
  private async handleBounce(emailLogId: string, event: BounceEvent): Promise<void> {
    const emailLog = await prisma.emailLog.findUnique({
      where: { id: emailLogId },
      select: { prospectId: true, sendingAccountId: true },
    })

    if (!emailLog) return

    // Determine bounce type from payload
    const bounceType = this.determineBounceType(event)

    // Update email log
    await prisma.emailLog.update({
      where: { id: emailLogId },
      data: {
        status: "BOUNCED",
        bouncedAt: event.timestamp,
      },
    })

    // Create bounce record
    await prisma.emailBounce.create({
      data: {
        emailLogId,
        sendingAccountId: emailLog.sendingAccountId!,
        bounceType,
        bounceReason: event.bounceReason,
        diagnosticCode: event.diagnosticCode,
        recipientEmail: event.recipientEmail,
        bouncedAt: event.timestamp,
      },
    })

    if (emailLog.prospectId) {
      await prisma.prospect.update({
        where: { id: emailLog.prospectId },
        data: {
          bounced: bounceType === "HARD",
          status: bounceType === "HARD" ? "BOUNCED" : undefined,
        },
      })
    }

    // Track metrics
    if (emailLog.sendingAccountId) {
      await metricsTracker.trackBounce(emailLog.sendingAccountId, bounceType)
    }

    logger.warn("Campaign email bounced", {
      emailLogId,
      bounceType,
      reason: event.bounceReason,
    })
  }

  /**
   * Handle campaign spam complaint
   */
  private async handleComplaint(emailLogId: string, event: BounceEvent): Promise<void> {
    const emailLog = await prisma.emailLog.findUnique({
      where: { id: emailLogId },
      select: { prospectId: true, sendingAccountId: true },
    })

    if (!emailLog) return

    await prisma.emailLog.update({
      where: { id: emailLogId },
      data: {
        status: "BOUNCED",
        bouncedAt: event.timestamp,
      },
    })

    if (emailLog.sendingAccountId) {
      await metricsTracker.trackComplaint(emailLog.sendingAccountId)

      await strategyAdjuster.handleDeliverabilityIssue(emailLog.sendingAccountId, {
        trigger: "spam_complaint",
        severity: "MAJOR",
        detectedAt: new Date(),
      })
    }

    logger.warn("Campaign email complaint", { emailLogId })
  }

  /**
   * Handle unsubscribe event - CAMPAIGN ONLY
   */
  private async handleUnsubscribe(emailLogId: string, event: WebhookEvent): Promise<void> {
    const emailLog = await prisma.emailLog.findUnique({
      where: { id: emailLogId },
      select: { prospectId: true },
    })

    if (!emailLog || !emailLog.prospectId) return

    await prisma.prospect.update({
      where: { id: emailLog.prospectId },
      data: {
        unsubscribed: true,
        status: "UNSUBSCRIBED",
      },
    })

    logger.info("Prospect unsubscribed", { prospectId: emailLog.prospectId })
  }

  /**
   * Determine bounce type from event payload
   */
  private determineBounceType(event: BounceEvent): "HARD" | "SOFT" | "COMPLAINT" {
    const bounceStr = event.bounceType?.toLowerCase() || ""

    if (bounceStr.includes("hard") || bounceStr.includes("permanent")) {
      return "HARD"
    }
    if (bounceStr.includes("complaint") || bounceStr.includes("spam")) {
      return "COMPLAINT"
    }
    return "SOFT"
  }

  /**
   * Store webhook event for debugging
   */
  private async storeWebhookEvent(provider: WebhookProvider, payload: any, eventCount: number): Promise<void> {
    try {
      await prisma.webhookEvent.create({
        data: {
          userId: "system",
          provider,
          eventType: "batch",
          recipientEmail: "system@webhook.log",
          rawPayload: payload,
          processed: true,
          processedAt: new Date(),
        },
      })
    } catch (error) {
      logger.error("Failed to store webhook event", { error: handleError(error) })
    }
  }

  /**
   * Process warmup interaction feedback
   * Called when warmup emails get engagement
   */
  async processWarmupFeedback(
    warmupId: string,
    feedbackType: "delivered" | "opened" | "clicked" | "replied",
  ): Promise<void> {
    const interaction = await prisma.warmupInteraction.findFirst({
      where: { warmupId },
    })

    if (!interaction) {
      logger.warn("Warmup interaction not found", { warmupId })
      return
    }

    const updates: any = {}

    switch (feedbackType) {
      case "delivered":
        updates.deliveredAt = new Date()
        updates.landedInInbox = true
        break
      case "opened":
        updates.openedAt = new Date()
        updates.landedInInbox = true
        break
      case "clicked":
        updates.clickedAt = new Date()
        break
      case "replied":
        updates.repliedAt = new Date()
        break
    }

    await prisma.warmupInteraction.update({
      where: { id: interaction.id },
      data: updates,
    })

    logger.info("Warmup feedback processed", {
      warmupId,
      feedbackType,
      sessionId: interaction.sessionId,
    })
  }

  /**
   * Log webhook event to database
   */
  async logWebhookEvent(data: {
    userId: string
    provider: WebhookProvider
    eventType: string
    recipientEmail: string
    subject?: string
    messageId?: string
    emailLogId?: string
    sendingAccountId?: string
    warmupInteractionId?: string
    bounceType?: string
    bounceReason?: string
    diagnosticCode?: string
    ipAddress?: string
    userAgent?: string
    deviceType?: string
    location?: string
    rawPayload: any
    signature?: string
  }): Promise<void> {
    try {
      await prisma.webhookEvent.create({
        data: {
          userId: data.userId,
          provider: data.provider,
          eventType: data.eventType,
          recipientEmail: data.recipientEmail,
          subject: data.subject,
          messageId: data.messageId,
          emailLogId: data.emailLogId,
          sendingAccountId: data.sendingAccountId,
          warmupInteractionId: data.warmupInteractionId,
          bounceType: data.bounceType,
          bounceReason: data.bounceReason,
          diagnosticCode: data.diagnosticCode,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          deviceType: data.deviceType,
          location: data.location,
          rawPayload: data.rawPayload as any,
          signature: data.signature,
        },
      })

      logger.info("Webhook event logged", {
        provider: data.provider,
        eventType: data.eventType,
        messageId: data.messageId,
      })
    } catch (error) {
      logger.error("Failed to log webhook event", {
        error: error instanceof Error ? error.message : String(error),
        provider: data.provider,
        eventType: data.eventType,
      })
    }
  }
}

export const webhookHandler = new WebhookHandler()
