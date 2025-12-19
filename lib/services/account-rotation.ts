

import { db } from "../db"
import { logger } from "../logger"

interface RotationStrategy {
  type: "ROUND_ROBIN" | "LOAD_BALANCE" | "HEALTH_BASED"
  priority?: string[] // Account IDs in priority order
}

interface AccountRotationResult {
  accountId: string
  email: string
  ipAddress?: string
  provider: string
  rotationReason: string
}

class AccountRotationService {
  private rotationState: Map<string, number> = new Map() // userId -> lastAccountIndex

  /**
   * Get next account based on rotation strategy
   */
  async getNextAccount(
    userId: string,
    strategy: RotationStrategy = { type: "LOAD_BALANCE" },
  ): Promise<AccountRotationResult | null> {
    const accounts = await db.sendingAccount.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        domain: true,
        emailLogs: {  // FIXED: Changed from sentEmails to emailLogs
          where: {
            sentAt: {
              gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
            },
          },
          select: { id: true },
        },
      },
    })

    if (accounts.length === 0) {
      logger.warn("No active accounts for rotation", { userId })
      return null
    }

    let selectedAccount

    // Implement different rotation strategies
    if (strategy.type === "ROUND_ROBIN") {
      selectedAccount = this.roundRobinSelect(userId, accounts)
    } else if (strategy.type === "LOAD_BALANCE") {
      selectedAccount = this.loadBalancedSelect(accounts)
    } else if (strategy.type === "HEALTH_BASED") {
      selectedAccount = this.healthBasedSelect(accounts)
    }

    if (!selectedAccount) {
      logger.warn("No suitable account found for rotation", { userId })
      return null
    }

    logger.info("Account selected for rotation", {
      userId,
      accountId: selectedAccount.id,
      strategy: strategy.type,
    })

    return {
      accountId: selectedAccount.id,
      email: selectedAccount.email,
      ipAddress: selectedAccount.ipAddress || "shared",
      provider: selectedAccount.provider,
      rotationReason: "Automatic rotation",
    }
  }

  /**
   * Round-robin account selection
   */
  private roundRobinSelect(userId: string, accounts: any[]): any {
    const currentIndex = this.rotationState.get(userId) || 0

    // Find next account with capacity
    for (let i = 0; i < accounts.length; i++) {
      const accountIndex = (currentIndex + i) % accounts.length
      const account = accounts[accountIndex]

      if (this.hasCapacity(account)) {
        // Update state for next time
        this.rotationState.set(userId, (accountIndex + 1) % accounts.length)
        return account
      }
    }

    return accounts[currentIndex % accounts.length]
  }

  /**
   * Load-balanced account selection (prefers accounts with fewer recent sends)
   */
  private loadBalancedSelect(accounts: any[]): any {
    // Filter by health first
    const healthyAccounts = accounts.filter((a) => (a.healthScore || 100) >= 60)

    if (healthyAccounts.length === 0) {
      return accounts[0]
    }

    // Sort by recent send count (ascending)
    const sorted = healthyAccounts.sort((a, b) => {
      const aRecentCount = a.emailLogs?.length || 0  // FIXED: Changed from sentEmails to emailLogs
      const bRecentCount = b.emailLogs?.length || 0  // FIXED: Changed from sentEmails to emailLogs
      return aRecentCount - bRecentCount
    })

    return sorted[0]
  }

  /**
   * Health-based account selection
   */
  private healthBasedSelect(accounts: any[]): any {
    // Sort by health score (descending), then by recent sends (ascending)
    const sorted = accounts.sort((a, b) => {
      const healthDiff = (b.healthScore || 100) - (a.healthScore || 100)
      if (healthDiff !== 0) return healthDiff

      const aRecentCount = a.emailLogs?.length || 0  // FIXED: Changed from sentEmails to emailLogs
      const bRecentCount = b.emailLogs?.length || 0  // FIXED: Changed from sentEmails to emailLogs
      return aRecentCount - bRecentCount
    })

    return sorted[0]
  }

  /**
   * Check if account has capacity
   */
  private hasCapacity(account: any): boolean {
    const dailyLimit = account.warmupEnabled ? account.warmupDailyLimit : account.dailyLimit
    return account.emailsSentToday < dailyLimit && account.emailsSentThisHour < account.hourlyLimit
  }

  /**
   * Rotate account when health degrades
   */
  async rotateOnHealthDegradation(accountId: string, userId: string): Promise<AccountRotationResult | null> {
    const account = await db.sendingAccount.findUnique({
      where: { id: accountId },
    })

    if (!account) return null

    // Mark current account as needing rotation
    await db.sendingAccount.update({
      where: { id: accountId },
      data: {
        isActive: false,
        rotatedAt: new Date(),  // Now this field exists
        rotationCount: {
          increment: 1  // Increment rotation count
        }
      },
    })

    logger.warn("Account rotated due to health degradation", {
      accountId,
      healthScore: account.healthScore,
    })

    // Get next healthy account
    return this.getNextAccount(userId, { type: "HEALTH_BASED" })
  }

  /**
   * Implement IP rotation by selecting accounts with different IPs
   */
  async rotateIP(userId: string): Promise<AccountRotationResult | null> {
    const accounts = await db.sendingAccount.findMany({
      where: {
        userId,
        isActive: true,
      },
    })

    if (accounts.length < 2) {
      logger.warn("Cannot perform IP rotation - fewer than 2 accounts", { userId })
      return null
    }

    // Group by IP address
    const ipGroups = new Map<string, any[]>()
    accounts.forEach((acc) => {
      const ip = acc.ipAddress || "shared"
      if (!ipGroups.has(ip)) {
        ipGroups.set(ip, [])
      }
      ipGroups.get(ip)!.push(acc)
    })

    // Select account from IP group with lowest recent send count
    let selectedAccount: any = null
    let minSends = Number.POSITIVE_INFINITY

    for (const [ip, groupAccounts] of ipGroups) {
      for (const account of groupAccounts) {
        const recentSends = account.emailsSentThisHour || 0
        if (recentSends < minSends && this.hasCapacity(account)) {
          selectedAccount = account
          minSends = recentSends
        }
      }
    }

    if (!selectedAccount) {
      selectedAccount = this.loadBalancedSelect(accounts)
    }

    return {
      accountId: selectedAccount.id,
      email: selectedAccount.email,
      ipAddress: selectedAccount.ipAddress || "shared",
      provider: selectedAccount.provider,
      rotationReason: "IP rotation",
    }
  }

  /**
   * Get rotation metrics for a user
   */
  async getRotationMetrics(userId: string) {
    const accounts = await db.sendingAccount.findMany({
      where: { userId },
      include: {
        emailLogs: {  // FIXED: Changed from sentEmails to emailLogs
          where: {
            sentAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
          select: { id: true, status: true },
        },
      },
    })

    const metrics = accounts.map((account) => {
      const total = account.emailLogs.length  // FIXED: Changed from sentEmails to emailLogs
      const delivered = account.emailLogs.filter((e) => e.status === "DELIVERED").length  // FIXED

      return {
        accountId: account.id,
        email: account.email,
        ipAddress: account.ipAddress || "shared",
        emailsSent24h: total,
        deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
        healthScore: account.healthScore,
        isActive: account.isActive,
        rotations: account.rotationCount || 0,  // Now this field exists
      }
    })

    return {
      totalAccounts: accounts.length,
      activeAccounts: accounts.filter((a) => a.isActive).length,
      averageHealthScore:
        accounts.length > 0 ? Math.round(accounts.reduce((sum, a) => sum + a.healthScore, 0) / accounts.length) : 0,
      metrics,
    }
  }

  /**
   * Reset rotation state (useful for testing or manual reset)
   */
  resetRotationState(userId?: string): void {
    if (userId) {
      this.rotationState.delete(userId)
    } else {
      this.rotationState.clear()
    }
    logger.info("Rotation state reset", { userId })
  }
}

export const accountRotationService = new AccountRotationService()