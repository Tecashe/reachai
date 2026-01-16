import { prisma } from "@/lib/db"
import { logger } from "@/lib/logger"
import { imapReader } from "@/lib/services/warmup/imap-reader"

/**
 * Cron job to check IMAP for replies
 * Should run every 5-10 minutes
 */
export async function checkImapReplies() {
  logger.info("Starting IMAP reply check")

  try {
    // Get all active accounts with IMAP configured
    const accounts = await prisma.sendingAccount.findMany({
      where: {
        isActive: true,
        pausedAt: null,
        OR: [
          { imapHost: { not: null } },
          { smtpHost: { not: null } }, // Can infer IMAP from SMTP
        ],
      },
      take: 100, // Process 100 accounts per run
    })

    logger.info("Checking IMAP for accounts", { count: accounts.length })

    let totalReplies = 0

    // Process accounts in batches to avoid overwhelming servers
    for (const account of accounts) {
      try {
        const replies = await imapReader.checkWarmupReplies(account)
        totalReplies += replies

        logger.info("Checked IMAP for account", {
          accountId: account.id,
          repliesFound: replies,
        })

        // Small delay between accounts
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        logger.error("Failed to check IMAP for account", error as Error, {
          accountId: account.id,
        })
      }
    }

    logger.info("IMAP reply check completed", {
      accountsChecked: accounts.length,
      totalReplies,
    })

    return { accountsChecked: accounts.length, totalReplies }
  } catch (error) {
    logger.error("IMAP reply check failed", error as Error)
    throw error
  }
}
