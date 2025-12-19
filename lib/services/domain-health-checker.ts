
import { db } from "../db"
import { logger } from "../logger"
import dns from "dns/promises"

interface DomainHealth {
  domain: string
  spf: { valid: boolean; record?: string; error?: string; status?: string }
  dkim: { valid: boolean; selector?: string; selectors?: string[]; error?: string; status?: string }
  dmarc: { valid: boolean; policy?: string; record?: string; error?: string; status?: string }
  blacklisted: boolean
  blacklists: string[]
  mxRecords: string[]
  score: number
  reputation?: { overall: number }
  issues?: Array<{ severity: string; message: string }>
}

class DomainHealthChecker {
  private readonly BLACKLIST_PROVIDERS = ["zen.spamhaus.org", "bl.spamcop.net", "b.barracudacentral.org"]

  private readonly DKIM_SELECTORS = [
    // Generic/default
    "default",
    "dkim",
    "mail",
    "email",
    "k1",
    "k2",
    "s1",
    "s2",
    "selector",
    "sel1",
    "sel2",
    // Google Workspace
    "google",
    "google1",
    "google2",
    "gm1",
    "gm2",
    "ga1",
    "20230601",
    "20221208",
    "20210112",
    // Microsoft 365 / Outlook
    "selector1",
    "selector2",
    "s1024",
    "s2048",
    "mso",
    // SendGrid
    "smtpapi",
    "sendgrid",
    "em",
    "em1",
    "em2",
    "em3",
    "em4",
    "em5",
    "em6",
    "em7",
    "em8",
    "s1",
    "s2",
    // Mailchimp / Mandrill
    "mandrill",
    "mte1",
    "mte2",
    "k1",
    "k2",
    "k3",
    "mc",
    // Amazon SES
    "amazonses",
    "ses",
    "dkim1",
    "dkim2",
    "dkim3",
    // Mailgun
    "mailo",
    "mg",
    "pic",
    "smtp",
    "k1",
    // Postmark
    "pm",
    "20161025",
    "20170328",
    "20221121",
    // Zoho
    "zoho",
    "zmail",
    "zohomail",
    "zm",
    // Constant Contact
    "ctct1",
    "ctct2",
    "cc",
    // HubSpot
    "hs1",
    "hs2",
    "hubspot",
    "hsm",
    // Klaviyo
    "kl",
    "kl1",
    "kl2",
    "klaviyo",
    // ActiveCampaign
    "dk",
    "ac",
    "ac1",
    "ac2",
    // Brevo (Sendinblue)
    "sib",
    "mail",
    "brevo",
    // Instantly
    "instantly",
    "inst",
    // Lemlist
    "lemlist",
    "lem",
    // Apollo
    "apollo",
    "apo",
    // Outreach
    "outreach",
    "or",
    // Mailjet
    "mailjet",
    "mj",
    // Customer.io
    "cio",
    "customerio",
    // Intercom
    "intercom",
    "ic",
    // Drip
    "drip",
    // ConvertKit
    "ck",
    "convertkit",
    // MailerLite
    "ml",
    "mailerlite",
    // GoDaddy
    "gd",
    "godaddy",
    // Namecheap
    "nc",
    "namecheap",
    // Cloudflare
    "cf",
    "cloudflare",
    // cPanel / WHM
    "default",
    "cpanel",
    // Fastmail
    "fm1",
    "fm2",
    "fm3",
    "mesmtp",
    // ProtonMail
    "protonmail",
    // Rackspace
    "rackspace",
    // Yahoo
    "yahoo",
    "s1024",
    "s2048",
    // Custom/numbered patterns
    "dkim1",
    "dkim2",
    "dkim3",
    "key1",
    "key2",
    "key3",
    "sig1",
    "sig2",
    // Year-based selectors (common pattern)
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
    // Month-year patterns
    "jan2024",
    "feb2024",
    "mar2024",
    "apr2024",
    // Common ESP patterns
    "esp",
    "email1",
    "email2",
    "mx",
    "mx1",
    "mx2",
  ]

  private extractDomain(input: string): string | null {
    if (!input || typeof input !== "string") {
      return null
    }

    const trimmed = input.trim().toLowerCase()
    if (!trimmed) {
      return null
    }

    if (trimmed.includes("@")) {
      const parts = trimmed.split("@")
      return parts[1] || null
    }

    return trimmed
  }

  async checkDomainHealth(emailOrDomain: string): Promise<DomainHealth> {
    const domain = this.extractDomain(emailOrDomain)

    if (!domain) {
      logger.warn("Invalid domain provided for health check", { input: emailOrDomain })
      return {
        domain: emailOrDomain || "unknown",
        spf: { valid: false, error: "Invalid domain", status: "UNKNOWN" },
        dkim: { valid: false, error: "Invalid domain", status: "UNKNOWN" },
        dmarc: { valid: false, error: "Invalid domain", status: "UNKNOWN" },
        blacklisted: false,
        blacklists: [],
        mxRecords: [],
        score: 0,
        reputation: { overall: 0 },
        issues: [{ severity: "critical", message: "Invalid domain provided" }],
      }
    }

    try {
      const [spf, dkim, dmarc, mxRecords, blacklistResults] = await Promise.all([
        this.checkSPF(domain),
        this.checkDKIM(domain),
        this.checkDMARC(domain),
        this.checkMXRecords(domain),
        this.checkBlacklists(domain),
      ])

      const health: DomainHealth = {
        domain,
        spf: { ...spf, status: spf.valid ? "VALID" : "INVALID" },
        dkim: { ...dkim, status: dkim.valid ? "VALID" : "INVALID" },
        dmarc: { ...dmarc, status: dmarc.valid ? "VALID" : "INVALID" },
        blacklisted: blacklistResults.blacklisted,
        blacklists: blacklistResults.listedOn,
        mxRecords,
        score: 0,
      }

      health.score = this.calculateHealthScore(health)
      health.reputation = { overall: health.score }

      health.issues = []
      if (!spf.valid) {
        health.issues.push({
          severity: "warning",
          message: `SPF record issue: ${spf.error || "Not found"}`,
        })
      }
      if (!dkim.valid) {
        health.issues.push({
          severity: "warning",
          message: `DKIM record issue: ${dkim.error || "Not found"}`,
        })
      }
      if (!dmarc.valid) {
        health.issues.push({
          severity: "info",
          message: `DMARC policy issue: ${dmarc.error || "Not found"}`,
        })
      }
      if (blacklistResults.blacklisted) {
        health.issues.push({
          severity: "critical",
          message: `Domain blacklisted on: ${blacklistResults.listedOn.join(", ")}`,
        })
      }

      return health
    } catch (error) {
      logger.error("Domain health check failed", error as Error, { domain })

      return {
        domain,
        spf: { valid: false, error: "Check failed", status: "UNKNOWN" },
        dkim: { valid: false, error: "Check failed", status: "UNKNOWN" },
        dmarc: { valid: false, error: "Check failed", status: "UNKNOWN" },
        blacklisted: false,
        blacklists: [],
        mxRecords: [],
        score: 0,
        reputation: { overall: 0 },
        issues: [{ severity: "critical", message: "Health check failed" }],
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
      const hasValidMechanism = /\b(include|a|mx|ip4|ip6|all)\b/.test(spfString)
      const hasValidQualifier = /[~\-+?]all/.test(spfString)

      return {
        valid: hasValidMechanism && hasValidQualifier,
        record: spfString,
        error: !hasValidMechanism || !hasValidQualifier ? "Invalid SPF format" : undefined,
      }
    } catch {
      return {
        valid: false,
        error: "DNS lookup failed",
      }
    }
  }

  private async checkDKIM(
    domain: string,
  ): Promise<{ valid: boolean; selector?: string; selectors?: string[]; error?: string }> {
    const foundSelectors: string[] = []

    // Check all selectors in parallel for speed
    const results = await Promise.allSettled(
      this.DKIM_SELECTORS.map(async (selector) => {
        try {
          const dkimDomain = `${selector}._domainkey.${domain}`
          const txtRecords = await dns.resolveTxt(dkimDomain)

          // Check if any record looks like a DKIM record
          const hasDKIM = txtRecords.some((record) => {
            const recordStr = record.join("")
            return (
              recordStr.includes("v=DKIM1") ||
              recordStr.includes("k=rsa") ||
              recordStr.includes("p=") ||
              recordStr.includes("k=ed25519")
            )
          })

          return hasDKIM ? selector : null
        } catch {
          return null
        }
      }),
    )

    // Collect found selectors
    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        foundSelectors.push(result.value)
      }
    }

    if (foundSelectors.length > 0) {
      return {
        valid: true,
        selector: foundSelectors[0],
        selectors: foundSelectors,
      }
    }

    return {
      valid: false,
      error: "No DKIM record found. Check your email provider's setup guide for the correct selector name.",
    }
  }

  private async checkDMARC(
    domain: string,
  ): Promise<{ valid: boolean; policy?: string; record?: string; error?: string }> {
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
      const policyMatch = dmarcString.match(/p=(none|quarantine|reject)/)
      const policy = policyMatch ? policyMatch[1] : undefined

      return {
        valid: !!policy,
        policy,
        record: dmarcString,
        error: !policy ? "Invalid DMARC policy" : undefined,
      }
    } catch {
      return {
        valid: false,
        error: "DNS lookup failed",
      }
    }
  }

  private async checkMXRecords(domain: string): Promise<string[]> {
    try {
      if (!domain || typeof domain !== "string" || domain.trim() === "") {
        return []
      }

      const cleanDomain = domain.trim().toLowerCase()
      const mxRecords = await dns.resolveMx(cleanDomain)
      return mxRecords.sort((a, b) => a.priority - b.priority).map((mx) => mx.exchange)
    } catch {
      return []
    }
  }

  private async checkBlacklists(domain: string): Promise<{ blacklisted: boolean; listedOn: string[] }> {
    try {
      if (!domain || typeof domain !== "string" || domain.trim() === "") {
        return { blacklisted: false, listedOn: [] }
      }

      const cleanDomain = domain.trim().toLowerCase()

      // Get domain IP addresses
      let ipAddresses: string[] = []
      try {
        ipAddresses = await dns.resolve4(cleanDomain)
      } catch {
        // Domain might not have A records (e.g., email-only domains)
        // This is NOT an error - just means we can't do IP-based blacklist check
        return { blacklisted: false, listedOn: [] }
      }

      if (ipAddresses.length === 0) {
        return { blacklisted: false, listedOn: [] }
      }

      const ip = ipAddresses[0]
      const reversedIP = ip.split(".").reverse().join(".")
      const listedOn: string[] = []

      // Check each blacklist with proper timeout and error handling
      const results = await Promise.allSettled(
        this.BLACKLIST_PROVIDERS.map(async (provider) => {
          try {
            const query = `${reversedIP}.${provider}`

            // Use a promise with timeout to avoid hanging
            const result = await Promise.race([
              dns.resolve4(query),
              new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
            ])

            // If we got a response (not timeout and not empty), check if it's a positive listing
            if (result && Array.isArray(result) && result.length > 0) {
              // Most blacklists return 127.0.0.x for positive listings
              // Specifically check for valid blacklist response codes
              const isListed = result.some((r: string) => {
                if (!r || typeof r !== "string") return false
                // Spamhaus returns 127.0.0.2-11 for different list types
                // Spamcop returns 127.0.0.2
                // Barracuda returns 127.0.0.2
                return r.startsWith("127.0.0.") && r !== "127.0.0.1"
              })
              return isListed ? provider : null
            }
            return null
          } catch (err: any) {
            // NXDOMAIN (ENOTFOUND) means NOT listed - this is the expected "not blacklisted" response
            // SERVFAIL, TIMEOUT, etc. should also be treated as "not listed" to avoid false positives
            return null
          }
        }),
      )

      // Collect found blacklists
      for (const result of results) {
        if (result.status === "fulfilled" && result.value) {
          listedOn.push(result.value)
        }
      }

      return {
        blacklisted: listedOn.length > 0,
        listedOn,
      }
    } catch {
      // On any error, assume not blacklisted to avoid false positives
      return { blacklisted: false, listedOn: [] }
    }
  }

  private calculateHealthScore(health: DomainHealth): number {
    let score = 100

    if (!health.spf.valid) score -= 30
    if (!health.dkim.valid) score -= 30
    if (!health.dmarc.valid) score -= 20
    if (health.mxRecords.length === 0) score -= 10
    if (health.blacklisted) {
      score -= 50
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

    if (health.blacklisted) {
      const error = new Error("Domain is blacklisted")
      logger.error("Domain is blacklisted", error, {
        accountId,
        email: account.email,
        blacklists: health.blacklists,
      })
    }
  }
}

export const domainHealthChecker = new DomainHealthChecker()

export async function checkDomainHealth(domain: string): Promise<DomainHealth> {
  return domainHealthChecker.checkDomainHealth(domain)
}
