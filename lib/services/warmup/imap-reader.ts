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


import Imap from "imap"
import { simpleParser, type ParsedMail, type AddressObject } from "mailparser"
import { prisma } from "@/lib/db"
import { logger } from "@/lib/logger"
import { decryptPassword } from "@/lib/encryption"
import { metricsTracker } from "./metrics-tracker"
import type { SendingAccount } from "@prisma/client"

interface ImapConfig {
  user: string
  password: string
  host: string
  port: number
  tls: boolean
}

interface ProcessedEmail {
  messageId: string
  from: string
  to: string
  subject: string
  body: string
  inReplyTo?: string
  references?: string[]
  receivedDate: Date
  isWarmupReply?: boolean
}

export class ImapReader {
  private connections: Map<string, Imap> = new Map()

  /**
   * Connect to IMAP server for an account
   */
  async connectAccount(account: SendingAccount): Promise<Imap | null> {
    try {
      // Check if already connected
      if (this.connections.has(account.id)) {
        return this.connections.get(account.id)!
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
   * Read new emails from inbox
   */
  async readNewEmails(account: SendingAccount, limit = 50): Promise<ProcessedEmail[]> {
    const imap = await this.connectAccount(account)
    if (!imap) return []

    try {
      // Open inbox
      await this.openMailbox(imap, "INBOX")

      // Search for unseen emails
      const uids = await this.searchUnseen(imap)

      if (uids.length === 0) {
        logger.debug("No new emails found", { accountId: account.id })
        return []
      }

      logger.info("Found new emails", { accountId: account.id, count: uids.length })

      // Fetch and parse emails (limit to avoid overwhelming)
      const emailsToFetch = uids.slice(0, limit)
      const emails = await this.fetchEmails(imap, emailsToFetch)

      // Process each email
      const processed: ProcessedEmail[] = []
      for (const email of emails) {
        const processedEmail = await this.parseEmail(email)
        if (processedEmail) {
          processed.push(processedEmail)
          await this.handleIncomingEmail(account, processedEmail)
        }
      }

      // Mark as seen
      await this.markAsSeen(imap, emailsToFetch)

      logger.info("Processed new emails", {
        accountId: account.id,
        processed: processed.length,
      })

      return processed
    } catch (error) {
      logger.error("Failed to read emails", error, { accountId: account.id })
      return []
    } finally {
      // Don't close connection, keep it alive for next read
    }
  }

  /**
   * Check for replies to warmup emails
   */
  async checkWarmupReplies(account: SendingAccount): Promise<number> {
    const emails = await this.readNewEmails(account, 100)

    let repliesFound = 0

    for (const email of emails) {
      // Check if this is a reply to a warmup email
      const isWarmupReply = await this.isWarmupReply(email, account.id)

      if (isWarmupReply) {
        await this.processWarmupReply(email, account.id)
        repliesFound++
      } else {
        // Check if it's a reply to a campaign email
        await this.processCampaignReply(email, account.id)
      }
    }

    logger.info("Checked warmup replies", { accountId: account.id, repliesFound })

    return repliesFound
  }

  /**
   * Get IMAP configuration from account
   */
  private getImapConfig(account: SendingAccount): ImapConfig | null {
    try {
      // First, try to get IMAP fields from credentials JSON
      const credentials =
        typeof account.credentials === "string" 
          ? JSON.parse(account.credentials) 
          : account.credentials as Record<string, any>

      // Try credentials object with IMAP fields
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

        // Try SMTP fields (many providers use same credentials)
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
   * Search for unseen emails
   */
  private searchUnseen(imap: Imap): Promise<number[]> {
    return new Promise((resolve, reject) => {
      imap.search(["UNSEEN"], (err, results) => {
        if (err) reject(err)
        else resolve(results || [])
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
  private extractEmailAddress(addressObj: AddressObject | AddressObject[] | undefined): string {
    if (!addressObj) return ""
    
    if (Array.isArray(addressObj)) {
      const firstAddr = addressObj[0]
      if (!firstAddr) return ""
      return firstAddr.value?.[0]?.address || firstAddr.text || ""
    }
    
    return addressObj.value?.[0]?.address || addressObj.text || ""
  }

  /**
   * Parse raw email
   */
  private async parseEmail(raw: Buffer): Promise<ProcessedEmail | null> {
    try {
      const parsed: ParsedMail = await simpleParser(raw)

      const fromAddress = this.extractEmailAddress(parsed.from)
      const toAddress = this.extractEmailAddress(parsed.to)

      return {
        messageId: parsed.messageId || "",
        from: fromAddress,
        to: toAddress,
        subject: parsed.subject || "",
        body: parsed.text || parsed.html || "",
        inReplyTo: parsed.inReplyTo || undefined,
        references: parsed.references ? [parsed.references].flat() : [],
        receivedDate: parsed.date || new Date(),
      }
    } catch (error) {
      logger.error("Failed to parse email", error)
      return null
    }
  }

  /**
   * Mark emails as seen
   */
  private markAsSeen(imap: Imap, uids: number[]): Promise<void> {
    return new Promise((resolve, reject) => {
      imap.addFlags(uids, ["\\Seen"], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  /**
   * Handle incoming email
   */
  private async handleIncomingEmail(account: SendingAccount, email: ProcessedEmail): Promise<void> {
    logger.info("Handling incoming email", {
      accountId: account.id,
      from: email.from,
      subject: email.subject,
    })

    // Store in database for tracking
    // You can extend this to create IncomingEmail model
  }

  /**
   * Check if email is a reply to warmup email
   */
  private async isWarmupReply(email: ProcessedEmail, accountId: string): Promise<boolean> {
    // Check by In-Reply-To header
    if (email.inReplyTo) {
      const interaction = await prisma.warmupInteraction.findFirst({
        where: {
          messageId: email.inReplyTo,
          sendingAccountId: accountId,
        },
      })

      if (interaction) return true
    }

    // Check by subject pattern (Re: warmup-...)
    if (email.subject.toLowerCase().includes("warmup")) {
      return true
    }

    // Check by references header
    if (email.references && email.references.length > 0) {
      const interaction = await prisma.warmupInteraction.findFirst({
        where: {
          messageId: { in: email.references },
          sendingAccountId: accountId,
        },
      })

      if (interaction) return true
    }

    return false
  }

  /**
   * Process warmup reply - peer-to-peer only
   */
  private async processWarmupReply(email: ProcessedEmail, accountId: string): Promise<void> {
    // Find original warmup interaction
    const originalMessageId = email.inReplyTo || email.references?.[0]

    if (!originalMessageId) {
      logger.warn("Could not find original message ID for warmup reply")
      return
    }

    const interaction = await prisma.warmupInteraction.findFirst({
      where: {
        messageId: originalMessageId,
        sendingAccountId: accountId,
      },
    })

    if (!interaction) {
      logger.warn("Original warmup interaction not found", { originalMessageId })
      return
    }

    // Update interaction with reply
    await prisma.warmupInteraction.update({
      where: { id: interaction.id },
      data: {
        repliedAt: email.receivedDate,
        landedInInbox: true, // If they replied, it landed in inbox
      },
    })

    await metricsTracker.trackWarmupReply(accountId, interaction.sessionId)

    logger.info("Warmup reply processed (peer-to-peer)", {
      accountId,
      sessionId: interaction.sessionId,
      from: email.from,
    })
  }

  /**
   * Process campaign reply - CAMPAIGN ONLY (to prospects)
   */
  private async processCampaignReply(email: ProcessedEmail, accountId: string): Promise<void> {
    // Find original email log
    const originalMessageId = email.inReplyTo || email.references?.[0]

    if (!originalMessageId) return

    const emailLog = await prisma.emailLog.findFirst({
  where: {
    providerId: originalMessageId,
    sendingAccountId: accountId,
    prospectId: { not: null as any },
  },
  include: {
    prospect: true,
  },
})

// Type assertion after the query
if (!emailLog || !emailLog.prospectId) return

// Fetch prospect separately to avoid type issues
const prospect = await prisma.prospect.findUnique({
  where: { id: emailLog.prospectId },
})

if (!prospect?.campaignId) {
  logger.warn("Campaign reply found but prospect has no campaign", {
    emailLogId: emailLog.id,
    prospectId: emailLog.prospectId,
  })
  return
}

// Now use prospect directly
await prisma.emailReply.create({
  data: {
    emailLogId: emailLog.id,
    prospectId: emailLog.prospectId,
    campaignId: prospect.campaignId,
    sendingAccountId: accountId,
    subject: email.subject,
    body: email.body,
    fromEmail: email.from,
    sentiment: "NEUTRAL",
  },
})
    // Update email log
    await prisma.emailLog.update({
      where: { id: emailLog.id },
      data: {
        repliedAt: email.receivedDate,
      },
    })

    // Update prospect
    await prisma.prospect.update({
      where: { id: emailLog.prospectId },
      data: {
        replied: true,
        repliedAt: email.receivedDate,
        emailsReplied: { increment: 1 },
        status: "REPLIED",
      },
    })

    logger.info("Campaign reply processed (from prospect)", {
      accountId,
      prospectId: emailLog.prospectId,
      from: email.from,
    })
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

