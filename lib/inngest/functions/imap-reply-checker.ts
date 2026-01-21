// // src/inngest/functions/imap-reply-checker.ts
// import { inngest } from '../client'
// import { logger } from '@/lib/logger'
// import { prisma } from '@/lib/db'
// import { imapReader } from '@/lib/services/warmup/imap-reader'

// export const imapReplyChecker = inngest.createFunction(
//   {
//     id: 'imap-reply-checker',
//     name: 'Check IMAP for Warmup Replies',
//     concurrency: { limit: 2 },
//   },
//   { cron: '*/10 * * * *' },
//   async ({ step }) => {
//     logger.info('Starting IMAP reply check')

//     // Don't use step.run for the query - do it directly to preserve types
//     const accounts = await prisma.sendingAccount.findMany({
//       where: {
//         isActive: true,
//         pausedAt: null,
//         warmupEnabled: true,
//         peerWarmupEnabled: true,
//       },
//       take: 50,
//     })

//     const results = await step.run('check-imap-replies', async () => {
//       let totalReplies = 0
//       let accountsChecked = 0
      
//       for (const account of accounts) {
//         try {
//           // Parse credentials and check if IMAP is configured
//           const credentials = typeof account.credentials === 'string' 
//             ? JSON.parse(account.credentials) 
//             : account.credentials as Record<string, any>
          
//           // Skip if no IMAP config
//           if (!credentials?.imapHost && !credentials?.smtpHost) {
//             continue
//           }
          
//           const replies = await imapReader.checkWarmupReplies(account)
//           totalReplies += replies
//           accountsChecked++
          
//           // Small delay between accounts
//           await new Promise(resolve => setTimeout(resolve, 500))
//         } catch (error) {
//           logger.error('Failed to check IMAP', error as Error, { accountId: account.id })
//         }
//       }
      
//       return { accountsChecked, totalReplies }
//     })

//     logger.info('IMAP check completed', results)
//     return results
//   }
// )

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

    // Fetch accounts directly - don't wrap in step.run to preserve Date types
    logger.info('Fetching accounts from database')
    
    const accounts = await prisma.sendingAccount.findMany({
      where: {
        isActive: true,
        pausedAt: null,
        warmupEnabled: true,
        peerWarmupEnabled: true,
      },
      take: 50,
    })
    
    logger.info('Accounts fetched', { count: accounts.length })
    
    if (accounts.length === 0) {
      logger.warn('No accounts found matching criteria')
      return { accountsChecked: 0, totalReplies: 0 }
    }
    
    logger.info('Account IDs found', { ids: accounts.map(a => a.id) })

    const results = await step.run('check-imap-replies', async () => {
      logger.info('Starting IMAP check loop', { totalAccounts: accounts.length })
      
      let totalReplies = 0
      let accountsChecked = 0
      
      for (const account of accounts) {
        logger.info('Processing account', { accountId: account.id, email: account.email })
        
        try {
          // Parse credentials
          const credentials = typeof account.credentials === 'string' 
            ? JSON.parse(account.credentials) 
            : account.credentials as Record<string, any>
          
          logger.info('Credentials parsed', { 
            accountId: account.id,
            hasImapHost: !!credentials?.imapHost,
            hasSmtpHost: !!credentials?.smtpHost,
            hasImapUsername: !!credentials?.imapUsername,
            hasImapPassword: !!credentials?.imapPassword,
            hasSmtpUsername: !!credentials?.smtpUsername,
            hasSmtpPassword: !!credentials?.smtpPassword
          })
          
          // Skip if no IMAP config
          if (!credentials?.imapHost && !credentials?.smtpHost) {
            logger.warn('Skipping account - no IMAP/SMTP config', { accountId: account.id })
            continue
          }
          
          logger.info('Checking IMAP for replies', { accountId: account.id })
          const replies = await imapReader.checkWarmupReplies(account)
          
          logger.info('IMAP check complete for account', { 
            accountId: account.id, 
            repliesFound: replies 
          })
          
          totalReplies += replies
          accountsChecked++
          
          await new Promise(resolve => setTimeout(resolve, 500))
        } catch (error) {
          logger.error('Failed to check IMAP', error as Error, { 
            accountId: account.id,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
            errorStack: error instanceof Error ? error.stack : undefined
          })
        }
      }
      
      logger.info('IMAP loop completed', { accountsChecked, totalReplies })
      return { accountsChecked, totalReplies }
    })

    logger.info('IMAP check completed', results)
    return results
  }
)