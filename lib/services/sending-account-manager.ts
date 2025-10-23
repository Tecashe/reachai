import { db } from "../db"
import { logger } from "../logger"

interface SendingAccount {
  id: string
  email: string
  provider: string
  dailyLimit: number
  hourlyLimit: number
  emailsSentToday: number
  emailsSentThisHour: number
  warmupEnabled: boolean
  warmupStage: number
  warmupDailyLimit: number
  isActive: boolean
}

class SendingAccountManager {
  async getAvailableAccount(userId: string): Promise<SendingAccount | null> {
    const now = new Date()

    // Get all active accounts for user
    const accounts = await db.sendingAccount.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        emailsSentToday: "asc", // Prefer accounts with fewer sends
      },
    })

    if (accounts.length === 0) {
      logger.warn("No active sending accounts found", { userId })
      return null
    }

    // Reset daily counters if needed
    for (const account of accounts) {
      const lastReset = new Date(account.lastResetDate)
      if (now.getDate() !== lastReset.getDate()) {
        await db.sendingAccount.update({
          where: { id: account.id },
          data: {
            emailsSentToday: 0,
            lastResetDate: now,
          },
        })
        account.emailsSentToday = 0
      }

      // Reset hourly counters if needed
      const lastHourReset = new Date(account.lastResetHour)
      if (now.getHours() !== lastHourReset.getHours()) {
        await db.sendingAccount.update({
          where: { id: account.id },
          data: {
            emailsSentThisHour: 0,
            lastResetHour: now,
          },
        })
        account.emailsSentThisHour = 0
      }
    }

    // Find account with available capacity
    for (const account of accounts) {
      const effectiveDailyLimit = account.warmupEnabled ? account.warmupDailyLimit : account.dailyLimit

      const hasHourlyCapacity = account.emailsSentThisHour < account.hourlyLimit
      const hasDailyCapacity = account.emailsSentToday < effectiveDailyLimit

      if (hasHourlyCapacity && hasDailyCapacity) {
        logger.info("Selected sending account", {
          accountId: account.id,
          email: account.email,
          sentToday: account.emailsSentToday,
          dailyLimit: effectiveDailyLimit,
        })
        return account
      }
    }

    logger.warn("All sending accounts at capacity", { userId })
    return null
  }

  async incrementAccountUsage(accountId: string): Promise<void> {
    await db.sendingAccount.update({
      where: { id: accountId },
      data: {
        emailsSentToday: { increment: 1 },
        emailsSentThisHour: { increment: 1 },
      },
    })
  }

  async recordBounce(accountId: string): Promise<void> {
    const account = await db.sendingAccount.findUnique({
      where: { id: accountId },
      include: {
        emailLogs: {
          where: {
            status: "BOUNCED",
          },
        },
      },
    })

    if (!account) return

    const totalSent = account.emailsSentToday
    const bounces = account.emailLogs.length
    const bounceRate = totalSent > 0 ? (bounces / totalSent) * 100 : 0

    await db.sendingAccount.update({
      where: { id: accountId },
      data: {
        bounceRate,
        // Pause account if bounce rate exceeds 5%
        isActive: bounceRate < 5,
      },
    })

    // if (bounceRate >= 5) {
    //   logger.error("Sending account paused due to high bounce rate", {
    //     accountId,
    //     bounceRate,
    //   })
    // }
  }

  async getAccountStats(accountId: string) {
    const account = await db.sendingAccount.findUnique({
      where: { id: accountId },
      include: {
        emailLogs: {
          where: {
            sentAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        },
      },
    })

    if (!account) return null

    const totalSent = account.emailLogs.length
    const delivered = account.emailLogs.filter((log) => log.status === "DELIVERED").length
    const bounced = account.emailLogs.filter((log) => log.status === "BOUNCED").length
    const opened = account.emailLogs.filter((log) => log.openedAt !== null).length

    return {
      accountId: account.id,
      email: account.email,
      totalSent,
      delivered,
      bounced,
      opened,
      deliveryRate: totalSent > 0 ? (delivered / totalSent) * 100 : 0,
      bounceRate: totalSent > 0 ? (bounced / totalSent) * 100 : 0,
      openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
      dailyLimit: account.warmupEnabled ? account.warmupDailyLimit : account.dailyLimit,
      emailsSentToday: account.emailsSentToday,
      remainingToday: Math.max(
        0,
        (account.warmupEnabled ? account.warmupDailyLimit : account.dailyLimit) - account.emailsSentToday,
      ),
    }
  }
}

export const sendingAccountManager = new SendingAccountManager()
