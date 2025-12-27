import nodemailer from "nodemailer"
import { ImapFlow } from "imapflow"
import { simpleParser } from "mailparser"
import { prisma } from "@/lib/db"
import { decryptPassword } from "@/lib/encryption"

export interface SMTPConfig {
  host: string
  port: number
  secure: boolean
  username: string
  password: string
}

export interface IMAPConfig {
  host: string
  port: number
  tls: boolean
  username: string
  password: string
}

export interface ParsedEmail {
  id: string
  from: string
  to: string
  subject: string
  text: string
  html: string
  date: Date
  inReplyTo?: string
  messageId?: string
}

export class EmailConnectionService {
  /**
   * Test SMTP connection
   */
  async testSMTPConnection(config: SMTPConfig): Promise<{ success: boolean; error?: string }> {
    try {
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.username,
          pass: config.password,
        },
        connectionTimeout: 10000,
        socketTimeout: 10000,
      })

      await transporter.verify()
      await transporter.close()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "SMTP connection failed",
      }
    }
  }

  /**
   * Test IMAP connection
   */
  async testIMAPConnection(config: IMAPConfig): Promise<{ success: boolean; error?: string }> {
    try {
      const imap = new ImapFlow({
        host: config.host,
        port: config.port,
        secure: config.tls,
        auth: {
          user: config.username,
          pass: config.password,
        },
        socketTimeout: 10000,
      })

      await imap.connect()
      await imap.logout()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "IMAP connection failed",
      }
    }
  }

  /**
   * Send email via SMTP
   */
  async sendEmail(
    accountId: string,
    {
      to,
      subject,
      html,
      text,
      replyTo,
    }: {
      to: string
      subject: string
      html: string
      text?: string
      replyTo?: string
    },
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const account = await prisma.sendingAccount.findUnique({
        where: { id: accountId },
      })

      if (!account) {
        return { success: false, error: "Account not found" }
      }

      if (!account.smtpHost || !account.smtpUsername || !account.smtpPassword) {
        return { success: false, error: "Account SMTP configuration incomplete" }
      }

      if (account.emailsSentToday >= account.dailyLimit) {
        return { success: false, error: "Daily sending limit reached" }
      }

      const smtpPassword = decryptPassword(account.smtpPassword)

      const transporter = nodemailer.createTransport({
        host: account.smtpHost,
        port: account.smtpPort || 587,
        secure: account.smtpSecure || false,
        auth: {
          user: account.smtpUsername,
          pass: smtpPassword,
        },
        connectionTimeout: 10000,
      })

      const info = await transporter.sendMail({
        from: `${account.name || account.email.split("@")[0]} <${account.email}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ""),
        replyTo: replyTo || account.email,
        headers: {
          "X-ReachAI-Account-Id": accountId,
        },
      })

      await transporter.close()

      await prisma.sendingAccount.update({
        where: { id: accountId },
        data: {
          emailsSentToday: { increment: 1 },
          emailsSentThisHour: { increment: 1 },
        },
      })

      return {
        success: true,
        messageId: info.messageId || `${Date.now()}-${Math.random()}`,
      }
    } catch (error) {
      console.error("[v0] SMTP sending error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      }
    }
  }

  /**
   * Fetch new emails via IMAP
   */
  async fetchNewEmails(accountId: string, options: { limit?: number; unseen?: boolean } = {}): Promise<ParsedEmail[]> {
    try {
      const account = await prisma.sendingAccount.findUnique({
        where: { id: accountId },
      })

      if (!account) {
        console.error("[v0] Account not found")
        return []
      }

      if (!account.imapHost || !account.imapUsername || !account.imapPassword) {
        console.error("[v0] Account IMAP configuration incomplete")
        return []
      }

      const imapPassword = decryptPassword(account.imapPassword)

      const emails: ParsedEmail[] = []

      const imap = new ImapFlow({
        host: account.imapHost,
        port: account.imapPort ?? 993,
        secure: account.imapTls !== false,
        auth: {
          user: account.imapUsername,
          pass: imapPassword,
        },
        socketTimeout: 10000,
      })

      await imap.connect()

      try {
        await imap.mailboxOpen("INBOX")

        // Fix 1: Use 'seen' instead of 'unseen', and remove limit from search options
        const searchCriteria: { seen?: boolean } = {}
        if (options.unseen) {
          searchCriteria.seen = false
        }

        const results = await imap.search(searchCriteria)

        // Fix 2: Check if results is an array before iterating
        if (!Array.isArray(results)) {
          console.log("[v0] No messages found or search failed")
          await imap.logout()
          return []
        }

        // Apply limit manually after search
        const limitedResults = options.limit ? results.slice(0, options.limit) : results

        for (const uid of limitedResults) {
          try {
            const message = await imap.fetchOne(uid, { source: true })
            
            // Fix 3: Check if message is truthy before accessing source
            if (!message || !message.source) continue

            const parsed = await simpleParser(message.source)

            // Fix 4: Properly extract email from AddressObject
            const fromEmail = parsed.from 
              ? (Array.isArray(parsed.from) 
                  ? parsed.from[0]?.text || ""
                  : parsed.from.text || "")
              : ""

            const toEmail = parsed.to
              ? (Array.isArray(parsed.to)
                  ? parsed.to[0]?.text || ""
                  : parsed.to.text || "")
              : ""

            emails.push({
              id: `${accountId}-${uid}`,
              from: fromEmail,
              to: toEmail,
              subject: parsed.subject || "(no subject)",
              text: parsed.text || "",
              html: parsed.html || "",
              date: parsed.date || new Date(),
              inReplyTo: (parsed.inReplyTo as string) || undefined,
              messageId: (parsed.messageId as string) || undefined,
            })
          } catch (err) {
            console.error("[v0] Error parsing individual email:", err)
          }
        }
      } finally {
        await imap.logout()
      }

      return emails
    } catch (error) {
      console.error("[v0] IMAP fetch error:", error)
      return []
    }
  }

  /**
   * Mark email as read via IMAP
   */
  async markAsRead(accountId: string, messageId: number): Promise<boolean> {
    try {
      const account = await prisma.sendingAccount.findUnique({
        where: { id: accountId },
      })

      if (!account) {
        return false
      }

      if (!account.imapHost || !account.imapUsername || !account.imapPassword) {
        return false
      }

      const imapPassword = decryptPassword(account.imapPassword)

      const imap = new ImapFlow({
        host: account.imapHost,
        port: account.imapPort ?? 993,
        secure: account.imapTls !== false,
        auth: {
          user: account.imapUsername,
          pass: imapPassword,
        },
      })

      await imap.connect()

      try {
        await imap.mailboxOpen("INBOX")
        
        // Fix 5: Use messageFlagsAdd instead of setFlags
        await imap.messageFlagsAdd([messageId], ["\\Seen"])
        return true
      } finally {
        await imap.logout()
      }
    } catch (error) {
      console.error("[v0] Error marking email as read:", error)
      return false
    }
  }
}

export const emailConnectionService = new EmailConnectionService()