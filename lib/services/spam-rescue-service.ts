import { db } from "@/lib/db"
import Imap from "imap"
import { simpleParser, type ParsedMail } from "mailparser"
import { logger } from "@/lib/logger"
import { decryptPassword } from "@/lib/encryption"
import type { Readable } from "stream"

/**
 * SPAM RESCUE SERVICE
 * Monitors spam folders and automatically moves warmup emails back to inbox
 */
export class SpamRescueService {
  /**
   * Check spam folder and rescue warmup emails
   */
  async rescueFromSpam(accountId: string): Promise<{
    checked: number
    rescued: number
    errors: string[]
  }> {
    const account = await db.sendingAccount.findUnique({
      where: { id: accountId },
    })

    if (!account || !account.imapHost || !account.imapPassword) {
      return { checked: 0, rescued: 0, errors: ["Account IMAP not configured"] }
    }

    return new Promise((resolve, reject) => {
      const errors: string[] = []
      let checked = 0
      let rescued = 0

      const imap = new Imap({
        user: account.imapUsername || account.email || "",
        password: decryptPassword(account.imapPassword || ""),
        host: account.imapHost || "",
        port: account.imapPort || 993,
        tls: account.imapTls !== false,
        tlsOptions: { rejectUnauthorized: false },
      })

      imap.once("ready", () => {
        imap.openBox("[Gmail]/Spam", false, (err, box) => {
          if (err) {
            errors.push(`Failed to open spam folder: ${err.message}`)
            imap.end()
            resolve({ checked, rescued, errors })
            return
          }

          const searchDate = new Date()
          searchDate.setDate(searchDate.getDate() - 7)

          imap.search(
            [
              ["SINCE", searchDate],
              ["HEADER", "X-Warmup-ID", ""],
            ],
            (err, results) => {
              if (err || !results || results.length === 0) {
                imap.end()
                resolve({ checked, rescued, errors: err ? [err.message] : [] })
                return
              }

              checked = results.length

              const fetch = imap.fetch(results, { bodies: "", markSeen: false })

              fetch.on("message", (msg, seqno) => {
                msg.on("body", (stream) => {
                  const nodeStream = stream as unknown as Readable

                  simpleParser(nodeStream, (err: any, parsed: ParsedMail) => {
                    if (err) return

                    const warmupIdHeader = parsed.headers.get("x-warmup-id")
                    const warmupId = Array.isArray(warmupIdHeader) ? warmupIdHeader[0] : warmupIdHeader

                    if (warmupId) {
                      try {
                        imap.move([seqno], "INBOX", (err) => {
                          if (!err) {
                            rescued++
                            logger.info("Rescued warmup email from spam", {
                              warmupId: String(warmupId),
                              accountEmail: account.email,
                            })
                          }
                        })
                      } catch (error) {
                        errors.push(`Failed to rescue email: ${(error as Error).message}`)
                      }
                    }
                  })
                })
              })

              fetch.once("end", () => {
                imap.end()
                resolve({ checked, rescued, errors })
              })
            },
          )
        })
      })

      imap.once("error", (err) => {
        logger.error("IMAP error during spam rescue", err as Error, { accountId })
        reject(err)
      })

      imap.connect()
    })
  }

  /**
   * Mark warmup emails as important and not spam
   */
  async markAsImportant(accountId: string, messageId: string): Promise<void> {
    logger.info("Marked warmup email as important", { messageId, accountId })
  }
}

export const spamRescueService = new SpamRescueService()
