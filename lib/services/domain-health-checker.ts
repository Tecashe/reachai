import { db } from "../db"
import { logger } from "../logger"

interface DomainHealth {
  domain: string
  spf: { valid: boolean; record?: string }
  dkim: { valid: boolean; selector?: string }
  dmarc: { valid: boolean; policy?: string }
  blacklisted: boolean
  blacklists: string[]
  score: number
}

class DomainHealthChecker {
  async checkDomainHealth(email: string): Promise<DomainHealth> {
    const domain = email.split("@")[1]

    try {
      // In production, you would use actual DNS lookup services
      // For now, we'll simulate the checks
      const health: DomainHealth = {
        domain,
        spf: await this.checkSPF(domain),
        dkim: await this.checkDKIM(domain),
        dmarc: await this.checkDMARC(domain),
        blacklisted: false,
        blacklists: [],
        score: 0,
      }

      // Calculate overall score
      health.score = this.calculateHealthScore(health)

      return health
    } catch (error) {
      logger.error("Domain health check failed", error as Error, { domain })

      return {
        domain,
        spf: { valid: false },
        dkim: { valid: false },
        dmarc: { valid: false },
        blacklisted: false,
        blacklists: [],
        score: 0,
      }
    }
  }

  private async checkSPF(domain: string): Promise<{ valid: boolean; record?: string }> {
    // In production: Use DNS lookup to check SPF record
    // For now, assume valid
    return {
      valid: true,
      record: `v=spf1 include:_spf.${domain} ~all`,
    }
  }

  private async checkDKIM(domain: string): Promise<{ valid: boolean; selector?: string }> {
    // In production: Check DKIM selector records
    return {
      valid: true,
      selector: "default",
    }
  }

  private async checkDMARC(domain: string): Promise<{ valid: boolean; policy?: string }> {
    // In production: Check DMARC policy
    return {
      valid: true,
      policy: "quarantine",
    }
  }

  private calculateHealthScore(health: DomainHealth): number {
    let score = 100

    if (!health.spf.valid) score -= 30
    if (!health.dkim.valid) score -= 30
    if (!health.dmarc.valid) score -= 20
    if (health.blacklisted) score -= 50

    return Math.max(0, score)
  }

  async updateAccountDomainHealth(accountId: string): Promise<void> {
    const account = await db.sendingAccount.findUnique({
      where: { id: accountId },
    })

    if (!account) return

    const health = await this.checkDomainHealth(account.email)

    await db.sendingAccount.update({
      where: { id: accountId },
      data: {
        domainReputation: health as any,
        lastDomainCheck: new Date(),
      },
    })

    if (health.score < 70) {
      logger.warn("Poor domain health detected", {
        accountId,
        email: account.email,
        score: health.score,
      })
    }

    logger.info("Domain health updated", {
      accountId,
      domain: health.domain,
      score: health.score,
    })
  }
}

export const domainHealthChecker = new DomainHealthChecker()
