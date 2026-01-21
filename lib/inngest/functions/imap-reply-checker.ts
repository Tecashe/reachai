// src/inngest/functions/imap-reply-checker.ts
import { inngest } from '../client'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/db'
import { imapReader } from '@/lib/services/warmup/imap-reader'

export const imapReplyChecker = inngest.createFunction(
  {
    id: 'imap-reply-checker',
    name: 'Check IMAP for Warmup Replies',
    concurrency: { limit: 2 },
  },
  { cron: '*/10 * * * *' },
  async ({ step }) => {
    logger.info('Starting IMAP reply check')

    // Don't use step.run for the query - do it directly to preserve types
    const accounts = await prisma.sendingAccount.findMany({
      where: {
        isActive: true,
        pausedAt: null,
        warmupEnabled: true,
        peerWarmupEnabled: true,
      },
      take: 50,
    })

    const results = await step.run('check-imap-replies', async () => {
      let totalReplies = 0
      let accountsChecked = 0
      
      for (const account of accounts) {
        try {
          // Parse credentials and check if IMAP is configured
          const credentials = typeof account.credentials === 'string' 
            ? JSON.parse(account.credentials) 
            : account.credentials as Record<string, any>
          
          // Skip if no IMAP config
          if (!credentials?.imapHost && !credentials?.smtpHost) {
            continue
          }
          
          const replies = await imapReader.checkWarmupReplies(account)
          totalReplies += replies
          accountsChecked++
          
          // Small delay between accounts
          await new Promise(resolve => setTimeout(resolve, 500))
        } catch (error) {
          logger.error('Failed to check IMAP', error as Error, { accountId: account.id })
        }
      }
      
      return { accountsChecked, totalReplies }
    })

    logger.info('IMAP check completed', results)
    return results
  }
)