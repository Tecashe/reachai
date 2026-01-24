// import Imap from "imap"
// import { simpleParser, type ParsedMail } from "mailparser"
// import { prisma } from "@/lib/db"
// import { logger } from "@/lib/logger"
// import { decryptPassword } from "@/lib/encryption"
// import { metricsTracker } from "./metrics-tracker"
// import type { SendingAccount } from "@prisma/client"

// interface ImapConfig {
//   user: string
//   password: string
//   host: string
//   port: number
//   tls: boolean
// }

// interface ProcessedEmail {
//   messageId: string
//   from: string
//   to: string
//   subject: string
//   body: string
//   inReplyTo?: string
//   references?: string[]
//   receivedDate: Date
//   isWarmupReply?: boolean
// }

// export class ImapReader {
//   private connections: Map<string, Imap> = new Map()

//   /**
//    * Connect to IMAP server for an account
//    */
//   async connectAccount(account: SendingAccount): Promise<Imap | null> {
//     try {
//       // Check if already connected
//       if (this.connections.has(account.id)) {
//         return this.connections.get(account.id)!
//       }

//       // Get IMAP configuration
//       const config = this.getImapConfig(account)
//       if (!config) {
//         logger.warn("No IMAP config found for account", { accountId: account.id })
//         return null
//       }

//       // Create IMAP connection
//       const imap = new Imap({
//         user: config.user,
//         password: config.password,
//         host: config.host,
//         port: config.port,
//         tls: config.tls,
//         tlsOptions: { rejectUnauthorized: false },
//         connTimeout: 30000,
//         authTimeout: 30000,
//       })

//       // Setup event handlers
//       imap.once("ready", () => {
//         logger.info("IMAP connection ready", { accountId: account.id })
//       })

//       imap.once("error", (err: Error) => {
//         logger.error("IMAP connection error", err, { accountId: account.id })
//         this.connections.delete(account.id)
//       })

//       imap.once("end", () => {
//         logger.info("IMAP connection ended", { accountId: account.id })
//         this.connections.delete(account.id)
//       })

//       // Connect
//       await new Promise<void>((resolve, reject) => {
//         imap.once("ready", () => resolve())
//         imap.once("error", reject)
//         imap.connect()
//       })

//       this.connections.set(account.id, imap)
//       return imap
//     } catch (error) {
//       logger.error("Failed to connect IMAP", error as Error, { accountId: account.id })
//       return null
//     }
//   }

//   /**
//    * Read new emails from inbox
//    */
//   async readNewEmails(account: SendingAccount, limit = 50): Promise<ProcessedEmail[]> {
//     const imap = await this.connectAccount(account)
//     if (!imap) return []

//     try {
//       // Open inbox
//       await this.openMailbox(imap, "INBOX")

//       // Search for unseen emails
//       const uids = await this.searchUnseen(imap)

//       if (uids.length === 0) {
//         logger.debug("No new emails found", { accountId: account.id })
//         return []
//       }

//       logger.info("Found new emails", { accountId: account.id, count: uids.length })

//       // Fetch and parse emails (limit to avoid overwhelming)
//       const emailsToFetch = uids.slice(0, limit)
//       const emails = await this.fetchEmails(imap, emailsToFetch)

//       // Process each email
//       const processed: ProcessedEmail[] = []
//       for (const email of emails) {
//         const processedEmail = await this.parseEmail(email)
//         if (processedEmail) {
//           processed.push(processedEmail)
//           await this.handleIncomingEmail(account, processedEmail)
//         }
//       }

//       // Mark as seen
//       await this.markAsSeen(imap, emailsToFetch)

//       logger.info("Processed new emails", {
//         accountId: account.id,
//         processed: processed.length,
//       })

//       return processed
//     } catch (error) {
//       logger.error("Failed to read emails", error as Error, { accountId: account.id })
//       return []
//     } finally {
//       // Don't close connection, keep it alive for next read
//     }
//   }

//   /**
//    * Check for replies to warmup emails
//    */
//   async checkWarmupReplies(account: SendingAccount): Promise<number> {
//     const emails = await this.readNewEmails(account, 100)

//     let repliesFound = 0

//     for (const email of emails) {
//       // Check if this is a reply to a warmup email
//       const isWarmupReply = await this.isWarmupReply(email, account.id)

//       if (isWarmupReply) {
//         await this.processWarmupReply(email, account.id)
//         repliesFound++
//       } else {
//         // Check if it's a reply to a campaign email
//         await this.processCampaignReply(email, account.id)
//       }
//     }

//     logger.info("Checked warmup replies", { accountId: account.id, repliesFound })

//     return repliesFound
//   }

//   /**
//    * Get IMAP configuration from account
//    */
//   private getImapConfig(account: SendingAccount): ImapConfig | null {
//     try {
//       // Try direct IMAP fields first
//       if (account.imapHost && account.imapUsername) {
//         return {
//           user: account.imapUsername,
//           password: decryptPassword(account.imapPassword!),
//           host: account.imapHost,
//           port: account.imapPort || 993,
//           tls: account.imapTls ?? true,
//         }
//       }

//       // Try SMTP fields (many providers use same credentials)
//       if (account.smtpHost && account.smtpUsername) {
//         const host = account.smtpHost.replace("smtp", "imap")
//         return {
//           user: account.smtpUsername,
//           password: decryptPassword(account.smtpPassword!),
//           host,
//           port: 993,
//           tls: true,
//         }
//       }

//       // Try credentials object
//       const credentials =
//         typeof account.credentials === "string" ? JSON.parse(account.credentials) : account.credentials

//       if (credentials.imapHost) {
//         return {
//           user: credentials.imapUser || account.email,
//           password: decryptPassword(credentials.imapPassword),
//           host: credentials.imapHost,
//           port: credentials.imapPort || 993,
//           tls: credentials.imapTls ?? true,
//         }
//       }

//       return null
//     } catch (error) {
//       logger.error("Failed to get IMAP config", error as Error, {
//         accountId: account.id,
//       })
//       return null
//     }
//   }

//   /**
//    * Open mailbox
//    */
//   private openMailbox(imap: Imap, mailbox: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//       imap.openBox(mailbox, false, (err) => {
//         if (err) reject(err)
//         else resolve()
//       })
//     })
//   }

//   /**
//    * Search for unseen emails
//    */
//   private searchUnseen(imap: Imap): Promise<number[]> {
//     return new Promise((resolve, reject) => {
//       imap.search(["UNSEEN"], (err, results) => {
//         if (err) reject(err)
//         else resolve(results || [])
//       })
//     })
//   }

//   /**
//    * Fetch emails by UIDs
//    */
//   private fetchEmails(imap: Imap, uids: number[]): Promise<Buffer[]> {
//     return new Promise((resolve, reject) => {
//       const emails: Buffer[] = []
//       const fetch = imap.fetch(uids, { bodies: "" })

//       fetch.on("message", (msg) => {
//         msg.on("body", (stream) => {
//           let buffer = Buffer.alloc(0)
//           stream.on("data", (chunk) => {
//             buffer = Buffer.concat([buffer, chunk])
//           })
//           stream.once("end", () => {
//             emails.push(buffer)
//           })
//         })
//       })

//       fetch.once("error", reject)
//       fetch.once("end", () => resolve(emails))
//     })
//   }

//   /**
//    * Parse raw email
//    */
//   private async parseEmail(raw: Buffer): Promise<ProcessedEmail | null> {
//     try {
//       const parsed: ParsedMail = await simpleParser(raw)

//       return {
//         messageId: parsed.messageId || "",
//         from: parsed.from?.text || "",
//         to: parsed.to?.text || "",
//         subject: parsed.subject || "",
//         body: parsed.text || parsed.html || "",
//         inReplyTo: parsed.inReplyTo,
//         references: parsed.references ? [parsed.references].flat() : [],
//         receivedDate: parsed.date || new Date(),
//       }
//     } catch (error) {
//       logger.error("Failed to parse email", error as Error)
//       return null
//     }
//   }

//   /**
//    * Mark emails as seen
//    */
//   private markAsSeen(imap: Imap, uids: number[]): Promise<void> {
//     return new Promise((resolve, reject) => {
//       imap.addFlags(uids, ["\\Seen"], (err) => {
//         if (err) reject(err)
//         else resolve()
//       })
//     })
//   }

//   /**
//    * Handle incoming email
//    */
//   private async handleIncomingEmail(account: SendingAccount, email: ProcessedEmail): Promise<void> {
//     logger.info("Handling incoming email", {
//       accountId: account.id,
//       from: email.from,
//       subject: email.subject,
//     })

//     // Store in database for tracking
//     // You can extend this to create IncomingEmail model
//   }

//   /**
//    * Check if email is a reply to warmup email
//    */
//   private async isWarmupReply(email: ProcessedEmail, accountId: string): Promise<boolean> {
//     // Check by In-Reply-To header
//     if (email.inReplyTo) {
//       const interaction = await prisma.warmupInteraction.findFirst({
//         where: {
//           messageId: email.inReplyTo,
//           sendingAccountId: accountId,
//         },
//       })

//       if (interaction) return true
//     }

//     // Check by subject pattern (Re: warmup-...)
//     if (email.subject.toLowerCase().includes("warmup")) {
//       return true
//     }

//     // Check by references header
//     if (email.references && email.references.length > 0) {
//       const interaction = await prisma.warmupInteraction.findFirst({
//         where: {
//           messageId: { in: email.references },
//           sendingAccountId: accountId,
//         },
//       })

//       if (interaction) return true
//     }

//     return false
//   }

//   /**
//    * Process warmup reply
//    */
//   private async processWarmupReply(email: ProcessedEmail, accountId: string): Promise<void> {
//     // Find original warmup interaction
//     const originalMessageId = email.inReplyTo || email.references?.[0]

//     if (!originalMessageId) {
//       logger.warn("Could not find original message ID for reply")
//       return
//     }

//     const interaction = await prisma.warmupInteraction.findFirst({
//       where: {
//         messageId: originalMessageId,
//         sendingAccountId: accountId,
//       },
//     })

//     if (!interaction) {
//       logger.warn("Original warmup interaction not found", { originalMessageId })
//       return
//     }

//     // Update interaction with reply
//     await prisma.warmupInteraction.update({
//       where: { id: interaction.id },
//       data: {
//         repliedAt: email.receivedDate,
//         landedInInbox: true, // If they replied, it landed in inbox
//       },
//     })

//     // Track reply metrics
//     await metricsTracker.trackReplied(accountId)

//     logger.info("Warmup reply processed", {
//       accountId,
//       sessionId: interaction.sessionId,
//       from: email.from,
//     })
//   }

//   /**
//    * Process campaign reply
//    */
//   private async processCampaignReply(email: ProcessedEmail, accountId: string): Promise<void> {
//     // Find original email log
//     const originalMessageId = email.inReplyTo || email.references?.[0]

//     if (!originalMessageId) return

//     const emailLog = await prisma.emailLog.findFirst({
//       where: {
//         providerId: originalMessageId,
//         sendingAccountId: accountId,
//       },
//       include: {
//         prospect: true,
//       },
//     })

//     if (!emailLog) return

//     // Create reply record
//     await prisma.emailReply.create({
//       data: {
//         emailLogId: emailLog.id,
//         prospectId: emailLog.prospectId,
//         campaignId: emailLog.prospect.campaignId!,
//         sendingAccountId: accountId,
//         subject: email.subject,
//         body: email.body,
//         fromEmail: email.from,
//         receivedAt: email.receivedDate,
//         sentiment: "NEUTRAL", // Could use AI to analyze sentiment
//       },
//     })

//     // Update email log
//     await prisma.emailLog.update({
//       where: { id: emailLog.id },
//       data: {
//         repliedAt: email.receivedDate,
//       },
//     })

//     // Update prospect
//     await prisma.prospect.update({
//       where: { id: emailLog.prospectId },
//       data: {
//         replied: true,
//         repliedAt: email.receivedDate,
//         emailsReplied: { increment: 1 },
//         status: "REPLIED",
//       },
//     })

//     logger.info("Campaign reply processed", {
//       accountId,
//       prospectId: emailLog.prospectId,
//       from: email.from,
//     })
//   }

//   /**
//    * Close connection for account
//    */
//   closeConnection(accountId: string): void {
//     const imap = this.connections.get(accountId)
//     if (imap) {
//       imap.end()
//       this.connections.delete(accountId)
//     }
//   }

//   /**
//    * Close all connections
//    */
//   closeAllConnections(): void {
//     for (const [accountId, imap] of this.connections) {
//       imap.end()
//       this.connections.delete(accountId)
//     }
//   }
// }

// export const imapReader = new ImapReader()


// import Imap from "imap"
// import { simpleParser, type ParsedMail, type AddressObject } from "mailparser"
// import { prisma } from "@/lib/db"
// import { logger } from "@/lib/logger"
// import { decryptPassword } from "@/lib/encryption"
// import { metricsTracker } from "./metrics-tracker"
// import type { SendingAccount } from "@prisma/client"

// interface ImapConfig {
//   user: string
//   password: string
//   host: string
//   port: number
//   tls: boolean
// }

// interface ProcessedEmail {
//   messageId: string
//   from: string
//   to: string
//   subject: string
//   body: string
//   inReplyTo?: string
//   references?: string[]
//   receivedDate: Date
//   isWarmupReply?: boolean
// }

// export class ImapReader {
//   private connections: Map<string, Imap> = new Map()

//   /**
//    * Connect to IMAP server for an account
//    */
//   async connectAccount(account: SendingAccount): Promise<Imap | null> {
//     try {
//       // Check if already connected
//       if (this.connections.has(account.id)) {
//         return this.connections.get(account.id)!
//       }

//       // Get IMAP configuration
//       const config = this.getImapConfig(account)
//       if (!config) {
//         logger.warn("No IMAP config found for account", { accountId: account.id })
//         return null
//       }

//       // Create IMAP connection
//       const imap = new Imap({
//         user: config.user,
//         password: config.password,
//         host: config.host,
//         port: config.port,
//         tls: config.tls,
//         tlsOptions: { rejectUnauthorized: false },
//         connTimeout: 30000,
//         authTimeout: 30000,
//       })

//       // Setup event handlers
//       imap.once("ready", () => {
//         logger.info("IMAP connection ready", { accountId: account.id })
//       })

//       imap.once("error", (err: Error) => {
//         logger.error("IMAP connection error", err, { accountId: account.id })
//         this.connections.delete(account.id)
//       })

//       imap.once("end", () => {
//         logger.info("IMAP connection ended", { accountId: account.id })
//         this.connections.delete(account.id)
//       })

//       // Connect
//       await new Promise<void>((resolve, reject) => {
//         imap.once("ready", () => resolve())
//         imap.once("error", reject)
//         imap.connect()
//       })

//       this.connections.set(account.id, imap)
//       return imap
//     } catch (error) {
//       logger.error("Failed to connect IMAP", error, { accountId: account.id })
//       return null
//     }
//   }

//   /**
//    * Read new emails from inbox
//    */
//   async readNewEmails(account: SendingAccount, limit = 50): Promise<ProcessedEmail[]> {
//     const imap = await this.connectAccount(account)
//     if (!imap) return []

//     try {
//       // Open inbox
//       await this.openMailbox(imap, "INBOX")

//       // Search for unseen emails
//       const uids = await this.searchUnseen(imap)

//       if (uids.length === 0) {
//         logger.debug("No new emails found", { accountId: account.id })
//         return []
//       }

//       logger.info("Found new emails", { accountId: account.id, count: uids.length })

//       // Fetch and parse emails (limit to avoid overwhelming)
//       const emailsToFetch = uids.slice(0, limit)
//       const emails = await this.fetchEmails(imap, emailsToFetch)

//       // Process each email
//       const processed: ProcessedEmail[] = []
//       for (const email of emails) {
//         const processedEmail = await this.parseEmail(email)
//         if (processedEmail) {
//           processed.push(processedEmail)
//           await this.handleIncomingEmail(account, processedEmail)
//         }
//       }

//       // Mark as seen
//       await this.markAsSeen(imap, emailsToFetch)

//       logger.info("Processed new emails", {
//         accountId: account.id,
//         processed: processed.length,
//       })

//       return processed
//     } catch (error) {
//       logger.error("Failed to read emails", error, { accountId: account.id })
//       return []
//     } finally {
//       // Don't close connection, keep it alive for next read
//     }
//   }

//   /**
//    * Check for replies to warmup emails
//    */
//   async checkWarmupReplies(account: SendingAccount): Promise<number> {
//     const emails = await this.readNewEmails(account, 100)

//     let repliesFound = 0

//     for (const email of emails) {
//       // Check if this is a reply to a warmup email
//       const isWarmupReply = await this.isWarmupReply(email, account.id)

//       if (isWarmupReply) {
//         await this.processWarmupReply(email, account.id)
//         repliesFound++
//       } else {
//         // Check if it's a reply to a campaign email
//         await this.processCampaignReply(email, account.id)
//       }
//     }

//     logger.info("Checked warmup replies", { accountId: account.id, repliesFound })

//     return repliesFound
//   }

//   /**
//    * Get IMAP configuration from account
//    */

//   /**
//  * Get IMAP configuration from account
//  */
// private getImapConfig(account: SendingAccount): ImapConfig | null {
//   try {
//     // First, check if IMAP fields are directly on the account (NEW APPROACH)
//     if (account.imapHost && account.imapUsername && account.imapPassword) {
//       return {
//         user: account.imapUsername,
//         password: decryptPassword(account.imapPassword),
//         host: account.imapHost,
//         port: account.imapPort || 993,
//         tls: account.imapTls !== undefined ? (account.imapTls as boolean) : true,
//       }
//     }

//     // Fallback: Try SMTP fields directly on account (many providers use same credentials)
//     if (account.smtpHost && account.smtpUsername && account.smtpPassword) {
//       const host = account.smtpHost.replace("smtp", "imap")
//       return {
//         user: account.smtpUsername,
//         password: decryptPassword(account.smtpPassword),
//         host,
//         port: account.imapPort || 993,
//         tls: account.imapTls !== undefined ? (account.imapTls as boolean) : true,
//       }
//     }

//     // Legacy: Try to get IMAP fields from credentials JSON
//     const credentials =
//       typeof account.credentials === "string" 
//         ? JSON.parse(account.credentials) 
//         : account.credentials as Record<string, any>

//     // Try credentials object with IMAP fields
//     if (credentials && typeof credentials === "object") {
//       if (credentials.imapHost && credentials.imapUsername && credentials.imapPassword) {
//         return {
//           user: credentials.imapUsername as string,
//           password: decryptPassword(credentials.imapPassword as string),
//           host: credentials.imapHost as string,
//           port: (credentials.imapPort as number) || 993,
//           tls: credentials.imapTls !== undefined ? (credentials.imapTls as boolean) : true,
//         }
//       }

//       // Try SMTP fields from credentials (many providers use same credentials)
//       if (credentials.smtpHost && credentials.smtpUsername && credentials.smtpPassword) {
//         const host = (credentials.smtpHost as string).replace("smtp", "imap")
//         return {
//           user: credentials.smtpUsername as string,
//           password: decryptPassword(credentials.smtpPassword as string),
//           host,
//           port: 993,
//           tls: true,
//         }
//       }
//     }

//     return null
//   } catch (error) {
//     logger.error("Failed to get IMAP config", error, {
//       accountId: account.id,
//     })
//     return null
//   }
// }


//   /**
//    * Open mailbox
//    */
//   private openMailbox(imap: Imap, mailbox: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//       imap.openBox(mailbox, false, (err) => {
//         if (err) reject(err)
//         else resolve()
//       })
//     })
//   }

//   /**
//    * Search for unseen emails
//    */
//   private searchUnseen(imap: Imap): Promise<number[]> {
//     return new Promise((resolve, reject) => {
//       imap.search(["UNSEEN"], (err, results) => {
//         if (err) reject(err)
//         else resolve(results || [])
//       })
//     })
//   }

//   /**
//    * Fetch emails by UIDs
//    */
//   private fetchEmails(imap: Imap, uids: number[]): Promise<Buffer[]> {
//     return new Promise((resolve, reject) => {
//       const emails: Buffer[] = []
//       const fetch = imap.fetch(uids, { bodies: "" })

//       fetch.on("message", (msg) => {
//         msg.on("body", (stream) => {
//           let buffer = Buffer.alloc(0)
//           stream.on("data", (chunk) => {
//             buffer = Buffer.concat([buffer, chunk])
//           })
//           stream.once("end", () => {
//             emails.push(buffer)
//           })
//         })
//       })

//       fetch.once("error", reject)
//       fetch.once("end", () => resolve(emails))
//     })
//   }

//   /**
//    * Helper to extract email address from AddressObject
//    */
//   private extractEmailAddress(addressObj: AddressObject | AddressObject[] | undefined): string {
//     if (!addressObj) return ""

//     if (Array.isArray(addressObj)) {
//       const firstAddr = addressObj[0]
//       if (!firstAddr) return ""
//       return firstAddr.value?.[0]?.address || firstAddr.text || ""
//     }

//     return addressObj.value?.[0]?.address || addressObj.text || ""
//   }

//   /**
//    * Parse raw email
//    */
//   private async parseEmail(raw: Buffer): Promise<ProcessedEmail | null> {
//     try {
//       const parsed: ParsedMail = await simpleParser(raw)

//       const fromAddress = this.extractEmailAddress(parsed.from)
//       const toAddress = this.extractEmailAddress(parsed.to)

//       return {
//         messageId: parsed.messageId || "",
//         from: fromAddress,
//         to: toAddress,
//         subject: parsed.subject || "",
//         body: parsed.text || parsed.html || "",
//         inReplyTo: parsed.inReplyTo || undefined,
//         references: parsed.references ? [parsed.references].flat() : [],
//         receivedDate: parsed.date || new Date(),
//       }
//     } catch (error) {
//       logger.error("Failed to parse email", error)
//       return null
//     }
//   }

//   /**
//    * Mark emails as seen
//    */
//   private markAsSeen(imap: Imap, uids: number[]): Promise<void> {
//     return new Promise((resolve, reject) => {
//       imap.addFlags(uids, ["\\Seen"], (err) => {
//         if (err) reject(err)
//         else resolve()
//       })
//     })
//   }

//   /**
//    * Handle incoming email
//    */
//   private async handleIncomingEmail(account: SendingAccount, email: ProcessedEmail): Promise<void> {
//     logger.info("Handling incoming email", {
//       accountId: account.id,
//       from: email.from,
//       subject: email.subject,
//     })

//     // Store in database for tracking
//     // You can extend this to create IncomingEmail model
//   }

//   /**
//    * Check if email is a reply to warmup email
//    */
//   private async isWarmupReply(email: ProcessedEmail, accountId: string): Promise<boolean> {
//     // Check by In-Reply-To header
//     if (email.inReplyTo) {
//       const interaction = await prisma.warmupInteraction.findFirst({
//         where: {
//           messageId: email.inReplyTo,
//           sendingAccountId: accountId,
//         },
//       })

//       if (interaction) return true
//     }

//     // Check by subject pattern (Re: warmup-...)
//     if (email.subject.toLowerCase().includes("warmup")) {
//       return true
//     }

//     // Check by references header
//     if (email.references && email.references.length > 0) {
//       const interaction = await prisma.warmupInteraction.findFirst({
//         where: {
//           messageId: { in: email.references },
//           sendingAccountId: accountId,
//         },
//       })

//       if (interaction) return true
//     }

//     return false
//   }

//   /**
//    * Process warmup reply - peer-to-peer only
//    */
//   private async processWarmupReply(email: ProcessedEmail, accountId: string): Promise<void> {
//     // Find original warmup interaction
//     const originalMessageId = email.inReplyTo || email.references?.[0]

//     if (!originalMessageId) {
//       logger.warn("Could not find original message ID for warmup reply")
//       return
//     }

//     const interaction = await prisma.warmupInteraction.findFirst({
//       where: {
//         messageId: originalMessageId,
//         sendingAccountId: accountId,
//       },
//     })

//     if (!interaction) {
//       logger.warn("Original warmup interaction not found", { originalMessageId })
//       return
//     }

//     // Update interaction with reply
//     await prisma.warmupInteraction.update({
//       where: { id: interaction.id },
//       data: {
//         repliedAt: email.receivedDate,
//         landedInInbox: true, // If they replied, it landed in inbox
//       },
//     })

//     await metricsTracker.trackWarmupReply(accountId, interaction.sessionId)

//     logger.info("Warmup reply processed (peer-to-peer)", {
//       accountId,
//       sessionId: interaction.sessionId,
//       from: email.from,
//     })
//   }

//   /**
//    * Process campaign reply - CAMPAIGN ONLY (to prospects)
//    */
//   private async processCampaignReply(email: ProcessedEmail, accountId: string): Promise<void> {
//     // Find original email log
//     const originalMessageId = email.inReplyTo || email.references?.[0]

//     if (!originalMessageId) return

//     const emailLog = await prisma.emailLog.findFirst({
//   where: {
//     providerId: originalMessageId,
//     sendingAccountId: accountId,
//     prospectId: { not: null as any },
//   },
//   include: {
//     prospect: true,
//   },
// })

// // Type assertion after the query
// if (!emailLog || !emailLog.prospectId) return

// // Fetch prospect separately to avoid type issues
// const prospect = await prisma.prospect.findUnique({
//   where: { id: emailLog.prospectId },
// })

// if (!prospect?.campaignId) {
//   logger.warn("Campaign reply found but prospect has no campaign", {
//     emailLogId: emailLog.id,
//     prospectId: emailLog.prospectId,
//   })
//   return
// }

// // Now use prospect directly
// await prisma.emailReply.create({
//   data: {
//     emailLogId: emailLog.id,
//     prospectId: emailLog.prospectId,
//     campaignId: prospect.campaignId,
//     sendingAccountId: accountId,
//     subject: email.subject,
//     body: email.body,
//     fromEmail: email.from,
//     sentiment: "NEUTRAL",
//   },
// })
//     // Update email log
//     await prisma.emailLog.update({
//       where: { id: emailLog.id },
//       data: {
//         repliedAt: email.receivedDate,
//       },
//     })

//     // Update prospect
//     await prisma.prospect.update({
//       where: { id: emailLog.prospectId },
//       data: {
//         replied: true,
//         repliedAt: email.receivedDate,
//         emailsReplied: { increment: 1 },
//         status: "REPLIED",
//       },
//     })

//     logger.info("Campaign reply processed (from prospect)", {
//       accountId,
//       prospectId: emailLog.prospectId,
//       from: email.from,
//     })
//   }

//   /**
//    * Close connection for account
//    */
//   closeConnection(accountId: string): void {
//     const imap = this.connections.get(accountId)
//     if (imap) {
//       imap.end()
//       this.connections.delete(accountId)
//     }
//   }

//   /**
//    * Close all connections
//    */
//   closeAllConnections(): void {
//     for (const [accountId, imap] of this.connections) {
//       imap.end()
//       this.connections.delete(accountId)
//     }
//   }
// }

// export const imapReader = new ImapReader()









import Imap from "imap"
import { simpleParser, type ParsedMail } from "mailparser"
import { prisma } from "@/lib/db"
import { logger } from "@/lib/logger"
import { decryptPassword } from "@/lib/encryption"
import { metricsTracker } from "./metrics-tracker"
import type { SendingAccount } from "@prisma/client"

interface ProcessedEmail {
  messageId: string
  from: string
  to: string
  subject: string
  body: string
  inReplyTo?: string
  references?: string[]
  receivedDate: Date
  warmupId?: string
  threadId?: string
  sessionId?: string
  headers?: Record<string, any>
}

export class ImapReader {
  private connections: Map<string, Imap> = new Map()

  /**
   * Check for warmup replies - PEER TO PEER ONLY
   * This checks if peer SendingAccounts replied to warmup emails
   */
  async checkWarmupReplies(account: SendingAccount): Promise<number> {
    const imap = await this.connectAccount(account)
    if (!imap) return 0

    try {
      await this.openMailbox(imap, "INBOX")

      // Only search last 7 days for warmup emails
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const uids = await this.searchWarmupEmails(imap, sevenDaysAgo)

      if (uids.length === 0) {
        logger.debug("No warmup emails found", { accountId: account.id })
        return 0
      }

      logger.info("Found potential warmup emails", {
        accountId: account.id,
        count: uids.length
      })

      // Process in batches to avoid memory issues
      let repliesFound = 0
      const batchSize = 50

      for (let i = 0; i < uids.length; i += batchSize) {
        const batchUids = uids.slice(i, i + batchSize)
        const emails = await this.fetchEmails(imap, batchUids)

        for (const emailBuffer of emails) {
          const email = await this.parseEmail(emailBuffer)

          if (email && await this.isUnprocessedWarmupEmail(email, account.id)) {
            // Check if this is a reply from a peer SendingAccount
            const isReply = await this.isWarmupReplyFromPeer(email, account.id)

            if (isReply) {
              await this.processWarmupReplyFromPeer(email, account.id)
              repliesFound++
            }

            // Mark as processed in database (NOT in IMAP)
            await this.markProcessedInDatabase(email, account.id)
          }
        }

        logger.debug("Processed batch", {
          accountId: account.id,
          batch: i / batchSize + 1,
          repliesFound
        })
      }

      logger.info("Warmup reply check complete", {
        accountId: account.id,
        repliesFound
      })

      return repliesFound
    } catch (error) {
      logger.error("Failed to check warmup replies", error, {
        accountId: account.id
      })
      return 0
    }
  }

  /**
   * Search for warmup emails using custom headers
   * Uses X-Warmup-* headers that we control
   */
  private searchWarmupEmails(imap: Imap, since: Date): Promise<number[]> {
    return new Promise((resolve, reject) => {
      // Search for emails since the given date
      // Note: Custom X-Warmup-* header searches are not universally supported by IMAP servers,
      // and the imap library requires a non-empty value for HEADER searches.
      // We use SINCE-based search and filter by warmup headers in the processing loop.
      imap.search(
        [
          ['SINCE', since]
        ],
        (err, results) => {
          if (err) {
            logger.error("IMAP search failed", { error: err.message })
            reject(err)
          } else {
            logger.info("IMAP search successful", { count: results?.length || 0 })
            resolve(results || [])
          }
        }
      )
    })
  }

  /**
   * Parse email and extract warmup metadata from headers
   */
  private async parseEmail(raw: Buffer): Promise<ProcessedEmail | null> {
    try {
      const parsed: ParsedMail = await simpleParser(raw)

      const fromAddress = this.extractEmailAddress(parsed.from)
      const toAddress = this.extractEmailAddress(parsed.to)

      // Extract warmup headers (case-insensitive)
      const headers = parsed.headers as Map<string, any>
      const warmupId = this.getHeader(headers, 'x-warmup-id')
      const threadId = this.getHeader(headers, 'x-warmup-thread')
      const sessionId = this.getHeader(headers, 'x-warmup-session')

      // Store all headers for debugging
      const allHeaders: Record<string, any> = {}
      headers.forEach((value, key) => {
        allHeaders[key] = value
      })

      return {
        messageId: parsed.messageId || "",
        from: fromAddress,
        to: toAddress,
        subject: parsed.subject || "",
        body: parsed.text || parsed.html || "",
        inReplyTo: parsed.inReplyTo || undefined,
        references: parsed.references ? [parsed.references].flat() : [],
        receivedDate: parsed.date || new Date(),
        warmupId,
        threadId,
        sessionId,
        headers: allHeaders,
      }
    } catch (error) {
      logger.error("Failed to parse email", error)
      return null
    }
  }

  /**
   * Helper to get header value (handles arrays)
   */
  private getHeader(headers: Map<string, any>, key: string): string | undefined {
    const value = headers.get(key.toLowerCase())
    if (!value) return undefined
    return Array.isArray(value) ? value[0] : value
  }

  /**
   * Check if email is unprocessed warmup email
   */
  private async isUnprocessedWarmupEmail(
    email: ProcessedEmail,
    accountId: string
  ): Promise<boolean> {
    // Check if already processed
    const exists = await prisma.processedWarmupEmail.findFirst({
      where: {
        messageId: email.messageId,
        accountId
      }
    })

    if (exists) {
      logger.debug("Email already processed", {
        messageId: email.messageId
      })
      return false
    }

    // Validate it's a warmup email
    return this.isWarmupEmail(email)
  }

  /**
   * Validate if email is warmup-related using our custom headers
   */
  private isWarmupEmail(email: ProcessedEmail): boolean {
    // Check custom headers (most reliable - we control these)
    if (email.warmupId || email.sessionId || email.threadId) {
      return true
    }

    // Check message ID pattern (warmup-{accountId}-{timestamp}-{random})
    if (email.messageId?.includes('warmup-')) {
      return true
    }

    // Check in-reply-to for warmup pattern
    if (email.inReplyTo?.includes('warmup-')) {
      return true
    }

    // Check references for warmup pattern
    if (email.references?.some(ref => ref.includes('warmup-'))) {
      return true
    }

    // Check thread-related headers
    if (email.inReplyTo?.includes('thread-')) {
      return true
    }

    return false
  }

  /**
   * Check if email is a reply from a peer SendingAccount
   * CRITICAL: This is peer-to-peer, NOT from prospects
   */
  private async isWarmupReplyFromPeer(
    email: ProcessedEmail,
    accountId: string
  ): Promise<boolean> {
    // Method 1: Check by In-Reply-To header
    if (email.inReplyTo) {
      const interaction = await prisma.warmupInteraction.findFirst({
        where: {
          messageId: email.inReplyTo,
          sendingAccountId: accountId, // This account sent the original
          direction: 'OUTBOUND', // Must be replying to our outbound email
        },
      })

      if (interaction) {
        // Verify sender is a SendingAccount (peer), not a prospect
        const isPeerAccount = await this.verifyPeerSender(email.from)
        if (isPeerAccount) {
          logger.debug("Found peer reply by In-Reply-To", {
            messageId: email.inReplyTo,
            peerEmail: email.from
          })
          return true
        }
      }
    }

    // Method 2: Check by warmup ID in headers
    if (email.warmupId) {
      const interaction = await prisma.warmupInteraction.findFirst({
        where: {
          warmupId: email.warmupId,
          sendingAccountId: accountId,
          direction: 'OUTBOUND',
        },
      })

      if (interaction) {
        const isPeerAccount = await this.verifyPeerSender(email.from)
        if (isPeerAccount) {
          logger.debug("Found peer reply by warmup ID", {
            warmupId: email.warmupId,
            peerEmail: email.from
          })
          return true
        }
      }
    }

    // Method 3: Check by thread ID
    if (email.threadId) {
      const interaction = await prisma.warmupInteraction.findFirst({
        where: {
          threadId: email.threadId,
          sendingAccountId: accountId,
          direction: 'OUTBOUND',
        },
      })

      if (interaction) {
        const isPeerAccount = await this.verifyPeerSender(email.from)
        if (isPeerAccount) {
          logger.debug("Found peer reply by thread ID", {
            threadId: email.threadId,
            peerEmail: email.from
          })
          return true
        }
      }
    }

    // Method 4: Check references array
    if (email.references && email.references.length > 0) {
      const interaction = await prisma.warmupInteraction.findFirst({
        where: {
          messageId: { in: email.references },
          sendingAccountId: accountId,
          direction: 'OUTBOUND',
        },
      })

      if (interaction) {
        const isPeerAccount = await this.verifyPeerSender(email.from)
        if (isPeerAccount) {
          logger.debug("Found peer reply by references", {
            references: email.references,
            peerEmail: email.from
          })
          return true
        }
      }
    }

    return false
  }

  /**
   * Verify that the sender is actually a peer SendingAccount
   * CRITICAL: Prevents treating prospect replies as warmup replies
   */
  private async verifyPeerSender(emailAddress: string): Promise<boolean> {
    const peerAccount = await prisma.sendingAccount.findFirst({
      where: {
        email: emailAddress,
        isActive: true,
        warmupEnabled: true,
        peerWarmupEnabled: true,
        peerWarmupOptIn: true,
      }
    })

    return !!peerAccount
  }

  /**
   * Process warmup reply from peer SendingAccount
   * PEER-TO-PEER ONLY - Not from prospects
   */
  private async processWarmupReplyFromPeer(
    email: ProcessedEmail,
    accountId: string
  ): Promise<void> {
    try {
      // Find original interaction this is replying to
      const originalMessageId = email.inReplyTo || email.references?.[0]

      if (!originalMessageId) {
        logger.warn("No original message ID for warmup reply")
        return
      }

      // Find the original OUTBOUND interaction
      const interaction = await prisma.warmupInteraction.findFirst({
        where: {
          OR: [
            { messageId: originalMessageId },
            { warmupId: email.warmupId },
            { threadId: email.threadId },
          ],
          sendingAccountId: accountId,
          direction: 'OUTBOUND',
        },
        include: {
          session: true,
        }
      })

      if (!interaction) {
        logger.warn("Original warmup interaction not found", {
          originalMessageId,
          warmupId: email.warmupId,
          threadId: email.threadId,
        })
        return
      }

      // Verify peer account exists
      const peerAccount = await prisma.sendingAccount.findFirst({
        where: { email: email.from }
      })

      if (!peerAccount) {
        logger.error("Reply from non-existent peer account", {
          fromEmail: email.from
        })
        return
      }

      // Update original interaction with reply data
      await prisma.warmupInteraction.update({
        where: { id: interaction.id },
        data: {
          repliedAt: email.receivedDate,
          landedInInbox: true, // If they replied, it landed in inbox
        },
      })

      // Track metrics for the session
      if (interaction.sessionId) {
        await metricsTracker.trackWarmupReply(
          accountId,
          interaction.sessionId
        )

        // Update session stats
        await prisma.warmupSession.update({
          where: { id: interaction.sessionId },
          data: {
            emailsReplied: { increment: 1 },
          }
        })
      }

      // Update thread if exists
      if (email.threadId) {
        await prisma.warmupThread.updateMany({
          where: { id: email.threadId },
          data: {
            totalReplies: { increment: 1 },
          }
        })
      }

      logger.info("Warmup reply from peer processed", {
        accountId,
        peerAccountId: peerAccount.id,
        peerEmail: email.from,
        sessionId: interaction.sessionId,
        threadId: email.threadId,
      })
    } catch (error) {
      logger.error("Failed to process warmup reply from peer", error, {
        accountId,
        messageId: email.messageId,
        from: email.from,
      })
    }
  }

  /**
   * Mark email as processed in database (NOT in IMAP)
   * CRITICAL: We don't mark as read in IMAP to avoid messing with user's inbox
   */
  private async markProcessedInDatabase(
    email: ProcessedEmail,
    accountId: string
  ): Promise<void> {
    try {
      await prisma.processedWarmupEmail.create({
        data: {
          messageId: email.messageId,
          accountId,
          warmupId: email.warmupId,
          threadId: email.threadId,
          sessionId: email.sessionId,
          processedAt: new Date(),
        },
      })
    } catch (error) {
      // Ignore duplicate key errors (already processed)
      if ((error as any).code !== 'P2002') {
        logger.error("Failed to mark email as processed", error, {
          messageId: email.messageId,
        })
      }
    }
  }

  /**
   * Connect to IMAP server for an account
   */
  async connectAccount(account: SendingAccount): Promise<Imap | null> {
    try {
      // Check if already connected and valid
      if (this.connections.has(account.id)) {
        const imap = this.connections.get(account.id)!
        if (imap.state === 'authenticated') {
          return imap
        }
        // Connection stale, cleanup
        try { imap.end() } catch { }
        this.connections.delete(account.id)
      }

      // Get IMAP configuration
      const config = this.getImapConfig(account)
      if (!config) {
        logger.warn("No IMAP config found for account", { accountId: account.id })
        return null
      }

      // Create IMAP connection
      const imap = new Imap({
        user: config.user,
        password: config.password,
        host: config.host,
        port: config.port,
        tls: config.tls,
        tlsOptions: { rejectUnauthorized: false },
        connTimeout: 30000,
        authTimeout: 30000,
        keepalive: true, // Keep connection alive
      })

      // Setup event handlers
      imap.once("ready", () => {
        logger.info("IMAP connection ready", { accountId: account.id })
      })

      imap.once("error", (err: Error) => {
        logger.error("IMAP connection error", err, { accountId: account.id })
        this.connections.delete(account.id)
      })

      imap.once("end", () => {
        logger.info("IMAP connection ended", { accountId: account.id })
        this.connections.delete(account.id)
      })

      // Connect
      await new Promise<void>((resolve, reject) => {
        imap.once("ready", () => resolve())
        imap.once("error", reject)
        imap.connect()
      })

      this.connections.set(account.id, imap)
      return imap
    } catch (error) {
      logger.error("Failed to connect IMAP", error, { accountId: account.id })
      return null
    }
  }

  /**
   * Get IMAP configuration from account
   */
  private getImapConfig(account: SendingAccount): {
    user: string
    password: string
    host: string
    port: number
    tls: boolean
  } | null {
    try {
      // Check direct IMAP fields first
      if (account.imapHost && account.imapUsername && account.imapPassword) {
        return {
          user: account.imapUsername,
          password: decryptPassword(account.imapPassword),
          host: account.imapHost,
          port: account.imapPort || 993,
          tls: account.imapTls !== undefined ? (account.imapTls as boolean) : true,
        }
      }

      // Fallback: Try SMTP fields (many providers use same credentials)
      if (account.smtpHost && account.smtpUsername && account.smtpPassword) {
        const host = account.smtpHost.replace("smtp", "imap")
        return {
          user: account.smtpUsername,
          password: decryptPassword(account.smtpPassword),
          host,
          port: account.imapPort || 993,
          tls: account.imapTls !== undefined ? (account.imapTls as boolean) : true,
        }
      }

      // Legacy: Try credentials JSON
      const credentials =
        typeof account.credentials === "string"
          ? JSON.parse(account.credentials)
          : account.credentials as Record<string, any>

      if (credentials && typeof credentials === "object") {
        if (credentials.imapHost && credentials.imapUsername && credentials.imapPassword) {
          return {
            user: credentials.imapUsername as string,
            password: decryptPassword(credentials.imapPassword as string),
            host: credentials.imapHost as string,
            port: (credentials.imapPort as number) || 993,
            tls: credentials.imapTls !== undefined ? (credentials.imapTls as boolean) : true,
          }
        }

        // Try SMTP from credentials
        if (credentials.smtpHost && credentials.smtpUsername && credentials.smtpPassword) {
          const host = (credentials.smtpHost as string).replace("smtp", "imap")
          return {
            user: credentials.smtpUsername as string,
            password: decryptPassword(credentials.smtpPassword as string),
            host,
            port: 993,
            tls: true,
          }
        }
      }

      return null
    } catch (error) {
      logger.error("Failed to get IMAP config", error, {
        accountId: account.id,
      })
      return null
    }
  }

  /**
   * Open mailbox
   */
  private openMailbox(imap: Imap, mailbox: string): Promise<void> {
    return new Promise((resolve, reject) => {
      imap.openBox(mailbox, false, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  /**
   * Fetch emails by UIDs
   */
  private fetchEmails(imap: Imap, uids: number[]): Promise<Buffer[]> {
    return new Promise((resolve, reject) => {
      const emails: Buffer[] = []
      const fetch = imap.fetch(uids, { bodies: "" })

      fetch.on("message", (msg) => {
        msg.on("body", (stream) => {
          let buffer = Buffer.alloc(0)
          stream.on("data", (chunk) => {
            buffer = Buffer.concat([buffer, chunk])
          })
          stream.once("end", () => {
            emails.push(buffer)
          })
        })
      })

      fetch.once("error", reject)
      fetch.once("end", () => resolve(emails))
    })
  }

  /**
   * Helper to extract email address from AddressObject
   */
  private extractEmailAddress(addressObj: any): string {
    if (!addressObj) return ""

    if (Array.isArray(addressObj)) {
      const firstAddr = addressObj[0]
      if (!firstAddr) return ""
      return firstAddr.value?.[0]?.address || firstAddr.text || ""
    }

    return addressObj.value?.[0]?.address || addressObj.text || ""
  }

  /**
   * Close connection for account
   */
  closeConnection(accountId: string): void {
    const imap = this.connections.get(accountId)
    if (imap) {
      imap.end()
      this.connections.delete(accountId)
    }
  }

  /**
   * Close all connections
   */
  closeAllConnections(): void {
    for (const [accountId, imap] of this.connections) {
      imap.end()
      this.connections.delete(accountId)
    }
  }
}

export const imapReader = new ImapReader()