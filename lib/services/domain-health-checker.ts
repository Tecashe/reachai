// import { db } from "../db"
// import { logger } from "../logger"
// import dns from "dns/promises"

// interface DomainHealth {
//   domain: string
//   spf: { valid: boolean; record?: string; error?: string }
//   dkim: { valid: boolean; selector?: string; error?: string }
//   dmarc: { valid: boolean; policy?: string; error?: string }
//   blacklisted: boolean
//   blacklists: string[]
//   mxRecords: string[]
//   score: number
// }

// class DomainHealthChecker {
//   // Major blacklist providers
//   private readonly BLACKLIST_PROVIDERS = [
//     "zen.spamhaus.org",
//     "bl.spamcop.net",
//     "b.barracudacentral.org",
//     "dnsbl.sorbs.net",
//     "spam.dnsbl.sorbs.net",
//     "bl.mailspike.net",
//     "psbl.surriel.com",
//     "ubl.unsubscore.com",
//   ]

//   async checkDomainHealth(email: string): Promise<DomainHealth> {
//     const domain = email.split("@")[1]

//     try {
//       // Run all checks in parallel for speed
//       const [spf, dkim, dmarc, mxRecords, blacklistResults] = await Promise.all([
//         this.checkSPF(domain),
//         this.checkDKIM(domain),
//         this.checkDMARC(domain),
//         this.checkMXRecords(domain),
//         this.checkBlacklists(domain),
//       ])

//       const health: DomainHealth = {
//         domain,
//         spf,
//         dkim,
//         dmarc,
//         blacklisted: blacklistResults.blacklisted,
//         blacklists: blacklistResults.listedOn,
//         mxRecords,
//         score: 0,
//       }

//       // Calculate overall score
//       health.score = this.calculateHealthScore(health)

//       return health
//     } catch (error) {
//       logger.error("Domain health check failed", error as Error, { domain })

//       return {
//         domain,
//         spf: { valid: false, error: "Check failed" },
//         dkim: { valid: false, error: "Check failed" },
//         dmarc: { valid: false, error: "Check failed" },
//         blacklisted: false,
//         blacklists: [],
//         mxRecords: [],
//         score: 0,
//       }
//     }
//   }

//   private async checkSPF(domain: string): Promise<{ valid: boolean; record?: string; error?: string }> {
//     try {
//       const txtRecords = await dns.resolveTxt(domain)
//       const spfRecord = txtRecords.find((record) => record.join("").startsWith("v=spf1"))

//       if (!spfRecord) {
//         return {
//           valid: false,
//           error: "No SPF record found",
//         }
//       }

//       const spfString = spfRecord.join("")

//       // Validate SPF record format
//       const hasValidMechanism = /\b(include|a|mx|ip4|ip6|all)\b/.test(spfString)
//       const hasValidQualifier = /[~\-+?]all/.test(spfString)

//       return {
//         valid: hasValidMechanism && hasValidQualifier,
//         record: spfString,
//         error: !hasValidMechanism || !hasValidQualifier ? "Invalid SPF format" : undefined,
//       }
//     } catch (error) {
//       return {
//         valid: false,
//         error: "DNS lookup failed",
//       }
//     }
//   }

//   private async checkDKIM(domain: string): Promise<{ valid: boolean; selector?: string; error?: string }> {
//     // Common DKIM selectors to check
//     const commonSelectors = ["default", "google", "k1", "s1", "s2", "dkim", "mail", "smtp"]

//     try {
//       // Check each common selector
//       for (const selector of commonSelectors) {
//         try {
//           const dkimDomain = `${selector}._domainkey.${domain}`
//           const txtRecords = await dns.resolveTxt(dkimDomain)

//           // Check if any record contains DKIM signature
//           const hasDKIM = txtRecords.some((record) => record.join("").includes("v=DKIM1"))

//           if (hasDKIM) {
//             return {
//               valid: true,
//               selector,
//             }
//           }
//         } catch {
//           // Selector not found, continue to next
//           continue
//         }
//       }

//       return {
//         valid: false,
//         error: "No DKIM record found for common selectors",
//       }
//     } catch (error) {
//       return {
//         valid: false,
//         error: "DNS lookup failed",
//       }
//     }
//   }

//   private async checkDMARC(domain: string): Promise<{ valid: boolean; policy?: string; error?: string }> {
//     try {
//       const dmarcDomain = `_dmarc.${domain}`
//       const txtRecords = await dns.resolveTxt(dmarcDomain)

//       const dmarcRecord = txtRecords.find((record) => record.join("").startsWith("v=DMARC1"))

//       if (!dmarcRecord) {
//         return {
//           valid: false,
//           error: "No DMARC record found",
//         }
//       }

//       const dmarcString = dmarcRecord.join("")

//       // Extract policy
//       const policyMatch = dmarcString.match(/p=(none|quarantine|reject)/)
//       const policy = policyMatch ? policyMatch[1] : undefined

//       return {
//         valid: !!policy,
//         policy,
//         error: !policy ? "Invalid DMARC policy" : undefined,
//       }
//     } catch (error) {
//       return {
//         valid: false,
//         error: "DNS lookup failed",
//       }
//     }
//   }

//   private async checkMXRecords(domain: string): Promise<string[]> {
//     try {
//       const mxRecords = await dns.resolveMx(domain)
//       return mxRecords.sort((a, b) => a.priority - b.priority).map((mx) => mx.exchange)
//     } catch (error) {
//       logger.error("MX record lookup failed", error as Error, { domain })
//       return []
//     }
//   }

//   private async checkBlacklists(domain: string): Promise<{ blacklisted: boolean; listedOn: string[] }> {
//     try {
//       // Get domain IP addresses
//       const ipAddresses = await dns.resolve4(domain).catch(() => [])

//       if (ipAddresses.length === 0) {
//         return { blacklisted: false, listedOn: [] }
//       }

//       // Check first IP against all blacklists
//       const ip = ipAddresses[0]
//       const reversedIP = ip.split(".").reverse().join(".")

//       const blacklistChecks = this.BLACKLIST_PROVIDERS.map(async (provider) => {
//         try {
//           const query = `${reversedIP}.${provider}`
//           await dns.resolve4(query)
//           // If resolve succeeds, IP is listed
//           return provider
//         } catch {
//           // If resolve fails, IP is not listed
//           return null
//         }
//       })

//       const results = await Promise.all(blacklistChecks)
//       const listedOn = results.filter((r): r is string => r !== null)

//       return {
//         blacklisted: listedOn.length > 0,
//         listedOn,
//       }
//     } catch (error) {
//       logger.error("Blacklist check failed", error as Error, { domain })
//       return { blacklisted: false, listedOn: [] }
//     }
//   }

//   private calculateHealthScore(health: DomainHealth): number {
//     let score = 100

//     // SPF check (30 points)
//     if (!health.spf.valid) score -= 30

//     // DKIM check (30 points)
//     if (!health.dkim.valid) score -= 30

//     // DMARC check (20 points)
//     if (!health.dmarc.valid) score -= 20

//     // MX records (10 points)
//     if (health.mxRecords.length === 0) score -= 10

//     // Blacklist check (50 points - critical)
//     if (health.blacklisted) {
//       score -= 50
//       // Additional penalty for multiple blacklists
//       score -= Math.min(30, health.blacklists.length * 10)
//     }

//     return Math.max(0, score)
//   }

//   async updateAccountDomainHealth(accountId: string): Promise<void> {
//     const account = await db.sendingAccount.findUnique({
//       where: { id: accountId },
//     })

//     if (!account) return

//     const health = await this.checkDomainHealth(account.email)

//     await db.sendingAccount.update({
//       where: { id: accountId },
//       data: {
//         domainReputation: health as any,
//         lastDomainCheck: new Date(),
//       },
//     })

//     // Alert on critical issues
//     // if (health.blacklisted) {
//     //   logger.error("Domain is blacklisted", {
//     //     accountId,
//     //     email: account.email,
//     //     blacklists: health.blacklists,
//     //   })
//     // }

//     if (health.score < 70) {
//       logger.warn("Poor domain health detected", {
//         accountId,
//         email: account.email,
//         score: health.score,
//         issues: {
//           spf: !health.spf.valid,
//           dkim: !health.dkim.valid,
//           dmarc: !health.dmarc.valid,
//           blacklisted: health.blacklisted,
//         },
//       })
//     }

//     logger.info("Domain health updated", {
//       accountId,
//       domain: health.domain,
//       score: health.score,
//     })
//   }
// }

// export const domainHealthChecker = new DomainHealthChecker()

import { db } from "../db"
import { logger } from "../logger"
import dns from "dns/promises"

interface DomainHealth {
  domain: string
  spf: { valid: boolean; record?: string; error?: string }
  dkim: { valid: boolean; selector?: string; error?: string }
  dmarc: { valid: boolean; policy?: string; error?: string }
  blacklisted: boolean
  blacklists: string[]
  mxRecords: string[]
  score: number
}

class DomainHealthChecker {
  // Major blacklist providers
  private readonly BLACKLIST_PROVIDERS = [
    "zen.spamhaus.org",
    "bl.spamcop.net",
    "b.barracudacentral.org",
    "dnsbl.sorbs.net",
    "spam.dnsbl.sorbs.net",
    "bl.mailspike.net",
    "psbl.surriel.com",
    "ubl.unsubscore.com",
  ]

  async checkDomainHealth(email: string): Promise<DomainHealth> {
    const domain = email.split("@")[1]

    try {
      // Run all checks in parallel for speed
      const [spf, dkim, dmarc, mxRecords, blacklistResults] = await Promise.all([
        this.checkSPF(domain),
        this.checkDKIM(domain),
        this.checkDMARC(domain),
        this.checkMXRecords(domain),
        this.checkBlacklists(domain),
      ])

      const health: DomainHealth = {
        domain,
        spf,
        dkim,
        dmarc,
        blacklisted: blacklistResults.blacklisted,
        blacklists: blacklistResults.listedOn,
        mxRecords,
        score: 0,
      }

      // Calculate overall score
      health.score = this.calculateHealthScore(health)

      return health
    } catch (error) {
      logger.error("Domain health check failed", error as Error, { domain })

      return {
        domain,
        spf: { valid: false, error: "Check failed" },
        dkim: { valid: false, error: "Check failed" },
        dmarc: { valid: false, error: "Check failed" },
        blacklisted: false,
        blacklists: [],
        mxRecords: [],
        score: 0,
      }
    }
  }

  private async checkSPF(domain: string): Promise<{ valid: boolean; record?: string; error?: string }> {
    try {
      const txtRecords = await dns.resolveTxt(domain)
      const spfRecord = txtRecords.find((record) => record.join("").startsWith("v=spf1"))

      if (!spfRecord) {
        return {
          valid: false,
          error: "No SPF record found",
        }
      }

      const spfString = spfRecord.join("")

      // Validate SPF record format
      const hasValidMechanism = /\b(include|a|mx|ip4|ip6|all)\b/.test(spfString)
      const hasValidQualifier = /[~\-+?]all/.test(spfString)

      return {
        valid: hasValidMechanism && hasValidQualifier,
        record: spfString,
        error: !hasValidMechanism || !hasValidQualifier ? "Invalid SPF format" : undefined,
      }
    } catch (error) {
      return {
        valid: false,
        error: "DNS lookup failed",
      }
    }
  }

  private async checkDKIM(domain: string): Promise<{ valid: boolean; selector?: string; error?: string }> {
    // Common DKIM selectors to check
    const commonSelectors = ["default", "google", "k1", "s1", "s2", "dkim", "mail", "smtp"]

    try {
      // Check each common selector
      for (const selector of commonSelectors) {
        try {
          const dkimDomain = `${selector}._domainkey.${domain}`
          const txtRecords = await dns.resolveTxt(dkimDomain)

          // Check if any record contains DKIM signature
          const hasDKIM = txtRecords.some((record) => record.join("").includes("v=DKIM1"))

          if (hasDKIM) {
            return {
              valid: true,
              selector,
            }
          }
        } catch {
          // Selector not found, continue to next
          continue
        }
      }

      return {
        valid: false,
        error: "No DKIM record found for common selectors",
      }
    } catch (error) {
      return {
        valid: false,
        error: "DNS lookup failed",
      }
    }
  }

  private async checkDMARC(domain: string): Promise<{ valid: boolean; policy?: string; error?: string }> {
    try {
      const dmarcDomain = `_dmarc.${domain}`
      const txtRecords = await dns.resolveTxt(dmarcDomain)

      const dmarcRecord = txtRecords.find((record) => record.join("").startsWith("v=DMARC1"))

      if (!dmarcRecord) {
        return {
          valid: false,
          error: "No DMARC record found",
        }
      }

      const dmarcString = dmarcRecord.join("")

      // Extract policy
      const policyMatch = dmarcString.match(/p=(none|quarantine|reject)/)
      const policy = policyMatch ? policyMatch[1] : undefined

      return {
        valid: !!policy,
        policy,
        error: !policy ? "Invalid DMARC policy" : undefined,
      }
    } catch (error) {
      return {
        valid: false,
        error: "DNS lookup failed",
      }
    }
  }

  private async checkMXRecords(domain: string): Promise<string[]> {
    try {
      const mxRecords = await dns.resolveMx(domain)
      return mxRecords.sort((a, b) => a.priority - b.priority).map((mx) => mx.exchange)
    } catch (error) {
      logger.error("MX record lookup failed", error as Error, { domain })
      return []
    }
  }

  private async checkBlacklists(domain: string): Promise<{ blacklisted: boolean; listedOn: string[] }> {
    try {
      // Get domain IP addresses
      const ipAddresses = await dns.resolve4(domain).catch(() => [])

      if (ipAddresses.length === 0) {
        return { blacklisted: false, listedOn: [] }
      }

      // Check first IP against all blacklists
      const ip = ipAddresses[0]
      const reversedIP = ip.split(".").reverse().join(".")

      const blacklistChecks = this.BLACKLIST_PROVIDERS.map(async (provider) => {
        try {
          const query = `${reversedIP}.${provider}`
          await dns.resolve4(query)
          // If resolve succeeds, IP is listed
          return provider
        } catch {
          // If resolve fails, IP is not listed
          return null
        }
      })

      const results = await Promise.all(blacklistChecks)
      const listedOn = results.filter((r): r is string => r !== null)

      return {
        blacklisted: listedOn.length > 0,
        listedOn,
      }
    } catch (error) {
      logger.error("Blacklist check failed", error as Error, { domain })
      return { blacklisted: false, listedOn: [] }
    }
  }

  private calculateHealthScore(health: DomainHealth): number {
    let score = 100

    // SPF check (30 points)
    if (!health.spf.valid) score -= 30

    // DKIM check (30 points)
    if (!health.dkim.valid) score -= 30

    // DMARC check (20 points)
    if (!health.dmarc.valid) score -= 20

    // MX records (10 points)
    if (health.mxRecords.length === 0) score -= 10

    // Blacklist check (50 points - critical)
    if (health.blacklisted) {
      score -= 50
      // Additional penalty for multiple blacklists
      score -= Math.min(30, health.blacklists.length * 10)
    }

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

    // Alert on critical issues
    if (health.blacklisted) {
      const error = new Error("Domain is blacklisted")
      logger.error("Domain is blacklisted", error, {
        accountId,
        email: account.email,
        blacklists: health.blacklists,
      })
    }

    if (health.score < 70) {
      logger.warn("Poor domain health detected", {
        accountId,
        email: account.email,
        score: health.score,
        issues: {
          spf: !health.spf.valid,
          dkim: !health.dkim.valid,
          dmarc: !health.dmarc.valid,
          blacklisted: health.blacklisted,
        },
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
