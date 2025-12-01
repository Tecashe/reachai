// import { db } from "../db"
// import dns from "dns/promises"
// import crypto from "crypto"

// interface DNSRecord {
//   type: "TXT" | "CNAME" | "MX"
//   name: string
//   value: string
//   ttl?: number
// }

// interface DNSVerificationResult {
//   domain: string
//   spf: {
//     found: boolean
//     record?: string
//     valid: boolean
//     issues: string[]
//   }
//   dkim: {
//     found: boolean
//     selectors: string[]
//     valid: boolean
//     issues: string[]
//   }
//   dmarc: {
//     found: boolean
//     record?: string
//     valid: boolean
//     policy?: string
//     issues: string[]
//   }
//   mx: {
//     found: boolean
//     records: string[]
//   }
//   overallValid: boolean
//   score: number
// }

// class DNSVerificationService {
//   private readonly COMMON_DKIM_SELECTORS = [
//     "default",
//     "google",
//     "k1",
//     "s1",
//     "s2",
//     "dkim",
//     "mail",
//     "smtp",
//     "selector1",
//     "selector2",
//   ]

//   /**
//    * Generate DNS records needed for domain verification
//    */
//   generateDNSRecords(domain: string, dkimSelector = "default"): DNSRecord[] {
//     return [
//       {
//         type: "TXT",
//         name: "@",
//         value: `v=spf1 include:sendgrid.net ~all`,
//         ttl: 3600,
//       },
//       {
//         type: "CNAME",
//         name: `${dkimSelector}._domainkey`,
//         value: `${dkimSelector}.sendgrid.net`,
//         ttl: 3600,
//       },
//       {
//         type: "TXT",
//         name: "_dmarc",
//         value: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${domain}; ruf=mailto:dmarc-forensics@${domain}; pct=25`,
//         ttl: 3600,
//       },
//     ]
//   }

//   /**
//    * Comprehensive DNS verification
//    */
//   async verifyDNSRecords(domain: string): Promise<DNSVerificationResult> {
//     const [spfResult, dkimResult, dmarcResult, mxResult] = await Promise.all([
//       this.verifySPF(domain),
//       this.verifyDKIM(domain),
//       this.verifyDMARC(domain),
//       this.verifyMXRecords(domain),
//     ])

//     const overallValid = spfResult.valid && dkimResult.valid && dmarcResult.valid && mxResult.found

//     // Calculate score (0-100)
//     let score = 0
//     if (spfResult.valid) score += 25
//     if (dkimResult.valid) score += 25
//     if (dmarcResult.valid) score += 25
//     if (mxResult.found) score += 25

//     return {
//       domain,
//       spf: spfResult,
//       dkim: dkimResult,
//       dmarc: dmarcResult,
//       mx: mxResult,
//       overallValid,
//       score,
//     }
//   }

//   private async verifySPF(domain: string) {
//     const issues: string[] = []
//     let found = false
//     let record: string | undefined
//     let valid = false

//     try {
//       const txtRecords = await dns.resolveTxt(domain)
//       const spfRecord = txtRecords.find((r) => r.join("").startsWith("v=spf1"))

//       if (spfRecord) {
//         found = true
//         record = spfRecord.join("")

//         // Validate SPF
//         if (!record.includes("~all") && !record.includes("-all")) {
//           issues.push("SPF record should end with ~all or -all")
//         }

//         if (record.split(" ").length > 10) {
//           issues.push("SPF record has too many mechanisms (max 10 recommended)")
//         }

//         valid = issues.length === 0
//       } else {
//         issues.push("No SPF record found")
//       }
//     } catch (error) {
//       issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }

//     return { found, record, valid, issues }
//   }

//   private async verifyDKIM(domain: string) {
//     const issues: string[] = []
//     const selectors: string[] = []
//     let valid = false

//     for (const selector of this.COMMON_DKIM_SELECTORS) {
//       try {
//         const dkimDomain = `${selector}._domainkey.${domain}`
//         const txtRecords = await dns.resolveTxt(dkimDomain)

//         const hasDKIM = txtRecords.some((r) => r.join("").includes("v=DKIM1"))

//         if (hasDKIM) {
//           selectors.push(selector)
//         }
//       } catch {
//         // Selector not found, continue
//       }
//     }

//     if (selectors.length === 0) {
//       issues.push("No DKIM records found for common selectors")
//     } else {
//       valid = true
//     }

//     return {
//       found: selectors.length > 0,
//       selectors,
//       valid,
//       issues,
//     }
//   }

//   private async verifyDMARC(domain: string) {
//     const issues: string[] = []
//     let found = false
//     let record: string | undefined
//     let policy: string | undefined
//     let valid = false

//     try {
//       const dmarcDomain = `_dmarc.${domain}`
//       const txtRecords = await dns.resolveTxt(dmarcDomain)
//       const dmarcRecord = txtRecords.find((r) => r.join("").startsWith("v=DMARC1"))

//       if (dmarcRecord) {
//         found = true
//         record = dmarcRecord.join("")

//         const policyMatch = record.match(/p=(none|quarantine|reject)/)
//         if (policyMatch) {
//           policy = policyMatch[1]

//           if (policy === "none") {
//             issues.push("DMARC policy is set to 'none' - consider using 'quarantine' or 'reject'")
//           }

//           valid = true
//         } else {
//           issues.push("Invalid DMARC policy")
//         }
//       } else {
//         issues.push("No DMARC record found")
//       }
//     } catch (error) {
//       issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }

//     return {
//       found,
//       record,
//       valid,
//       policy,
//       issues,
//     }
//   }

//   private async verifyMXRecords(domain: string) {
//     const issues: string[] = []
//     const records: string[] = []

//     try {
//       const mxRecords = await dns.resolveMx(domain)

//       if (mxRecords.length === 0) {
//         issues.push("No MX records found")
//       } else {
//         records.push(...mxRecords.sort((a, b) => a.priority - b.priority).map((mx) => mx.exchange))
//       }
//     } catch (error) {
//       issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }

//     return {
//       found: records.length > 0,
//       records,
//     }
//   }

//   /**
//    * Generate a unique DKIM selector for this domain
//    */
//   generateDKIMSelector(): string {
//     return `reach${crypto.randomBytes(4).toString("hex")}`
//   }

//   /**
//    * Store verification result in database
//    */
//   async saveVerificationResult(userId: string, domain: string, result: DNSVerificationResult): Promise<void> {
//     // Create or update Domain record
//     await db.domain.upsert({
//       where: {
//         userId_domain: {
//           userId,
//           domain,
//         },
//       },
//       create: {
//         userId,
//         domain,
//         isVerified: result.overallValid,
//         verifiedAt: result.overallValid ? new Date() : null,
//         healthScore: result.score,
//         dnsRecords: {
//           spf: result.spf,
//           dkim: result.dkim,
//           dmarc: result.dmarc,
//           mx: result.mx,
//         },
//       },
//       update: {
//         isVerified: result.overallValid,
//         verifiedAt: result.overallValid ? new Date() : null,
//         healthScore: result.score,
//         dnsRecords: {
//           spf: result.spf,
//           dkim: result.dkim,
//           dmarc: result.dmarc,
//           mx: result.mx,
//         },
//         lastVerificationCheck: new Date(),
//         verificationAttempts: {
//           increment: 1,
//         },
//       },
//     })

//     // Create DeliverabilityHealth if not exists
//     const domainRecord = await db.domain.findUnique({
//       where: {
//         userId_domain: {
//           userId,
//           domain,
//         },
//       },
//     })

//     if (domainRecord && !domainRecord.deliverabilityHealth) {
//       await db.deliverabilityHealth.create({
//         data: {
//           domainId: domainRecord.id,
//           spfStatus: result.spf.valid ? "VALID" : result.spf.found ? "INVALID" : "MISSING",
//           spfValid: result.spf.valid,
//           spfRecord: result.spf.record,
//           dkimStatus: result.dkim.valid ? "VALID" : result.dkim.found ? "INVALID" : "MISSING",
//           dkimValid: result.dkim.valid,
//           dkimSelectors: result.dkim.selectors,
//           dmarcStatus: result.dmarc.valid ? "VALID" : result.dmarc.found ? "INVALID" : "MISSING",
//           dmarcValid: result.dmarc.valid,
//           dmarcRecord: result.dmarc.record,
//           dmarcPolicy: result.dmarc.policy,
//           mxRecordsValid: result.mx.found,
//           mxRecords: result.mx.records,
//         },
//       })
//     }
//   }
// }

// export const dnsVerificationService = new DNSVerificationService()

// import { db } from "../db"
// import dns from "dns/promises"
// import crypto from "crypto"

// interface DNSRecord {
//   type: "TXT" | "CNAME" | "MX"
//   name: string
//   value: string
//   ttl?: number
// }

// interface DNSVerificationResult {
//   domain: string
//   spf: {
//     found: boolean
//     record?: string
//     valid: boolean
//     issues: string[]
//   }
//   dkim: {
//     found: boolean
//     selectors: string[]
//     valid: boolean
//     issues: string[]
//   }
//   dmarc: {
//     found: boolean
//     record?: string
//     valid: boolean
//     policy?: string
//     issues: string[]
//   }
//   mx: {
//     found: boolean
//     records: string[]
//   }
//   overallValid: boolean
//   score: number
// }

// class DNSVerificationService {
//   private readonly COMMON_DKIM_SELECTORS = [
//     "default",
//     "google",
//     "k1",
//     "s1",
//     "s2",
//     "dkim",
//     "mail",
//     "smtp",
//     "selector1",
//     "selector2",
//   ]

//   /**
//    * Generate DNS records needed for domain verification
//    */
//   generateDNSRecords(domain: string, dkimSelector = "default"): DNSRecord[] {
//     return [
//       {
//         type: "TXT",
//         name: "@",
//         value: `v=spf1 include:sendgrid.net ~all`,
//         ttl: 3600,
//       },
//       {
//         type: "CNAME",
//         name: `${dkimSelector}._domainkey`,
//         value: `${dkimSelector}.sendgrid.net`,
//         ttl: 3600,
//       },
//       {
//         type: "TXT",
//         name: "_dmarc",
//         value: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${domain}; ruf=mailto:dmarc-forensics@${domain}; pct=25`,
//         ttl: 3600,
//       },
//     ]
//   }

//   /**
//    * Comprehensive DNS verification
//    */
//   async verifyDNSRecords(domain: string): Promise<DNSVerificationResult> {
//     const [spfResult, dkimResult, dmarcResult, mxResult] = await Promise.all([
//       this.verifySPF(domain),
//       this.verifyDKIM(domain),
//       this.verifyDMARC(domain),
//       this.verifyMXRecords(domain),
//     ])

//     const overallValid = spfResult.valid && dkimResult.valid && dmarcResult.valid && mxResult.found

//     // Calculate score (0-100)
//     let score = 0
//     if (spfResult.valid) score += 25
//     if (dkimResult.valid) score += 25
//     if (dmarcResult.valid) score += 25
//     if (mxResult.found) score += 25

//     return {
//       domain,
//       spf: spfResult,
//       dkim: dkimResult,
//       dmarc: dmarcResult,
//       mx: mxResult,
//       overallValid,
//       score,
//     }
//   }

//   private async verifySPF(domain: string) {
//     const issues: string[] = []
//     let found = false
//     let record: string | undefined
//     let valid = false

//     try {
//       const txtRecords = await dns.resolveTxt(domain)
//       const spfRecord = txtRecords.find((r) => r.join("").startsWith("v=spf1"))

//       if (spfRecord) {
//         found = true
//         record = spfRecord.join("")

//         // Validate SPF
//         if (!record.includes("~all") && !record.includes("-all")) {
//           issues.push("SPF record should end with ~all or -all")
//         }

//         if (record.split(" ").length > 10) {
//           issues.push("SPF record has too many mechanisms (max 10 recommended)")
//         }

//         valid = issues.length === 0
//       } else {
//         issues.push("No SPF record found")
//       }
//     } catch (error) {
//       issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }

//     return { found, record, valid, issues }
//   }

//   private async verifyDKIM(domain: string) {
//     const issues: string[] = []
//     const selectors: string[] = []
//     let valid = false

//     for (const selector of this.COMMON_DKIM_SELECTORS) {
//       try {
//         const dkimDomain = `${selector}._domainkey.${domain}`
//         const txtRecords = await dns.resolveTxt(dkimDomain)

//         const hasDKIM = txtRecords.some((r) => r.join("").includes("v=DKIM1"))

//         if (hasDKIM) {
//           selectors.push(selector)
//         }
//       } catch {
//         // Selector not found, continue
//       }
//     }

//     if (selectors.length === 0) {
//       issues.push("No DKIM records found for common selectors")
//     } else {
//       valid = true
//     }

//     return {
//       found: selectors.length > 0,
//       selectors,
//       valid,
//       issues,
//     }
//   }

//   private async verifyDMARC(domain: string) {
//     const issues: string[] = []
//     let found = false
//     let record: string | undefined
//     let policy: string | undefined
//     let valid = false

//     try {
//       const dmarcDomain = `_dmarc.${domain}`
//       const txtRecords = await dns.resolveTxt(dmarcDomain)
//       const dmarcRecord = txtRecords.find((r) => r.join("").startsWith("v=DMARC1"))

//       if (dmarcRecord) {
//         found = true
//         record = dmarcRecord.join("")

//         const policyMatch = record.match(/p=(none|quarantine|reject)/)
//         if (policyMatch) {
//           policy = policyMatch[1]

//           if (policy === "none") {
//             issues.push("DMARC policy is set to 'none' - consider using 'quarantine' or 'reject'")
//           }

//           valid = true
//         } else {
//           issues.push("Invalid DMARC policy")
//         }
//       } else {
//         issues.push("No DMARC record found")
//       }
//     } catch (error) {
//       issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }

//     return {
//       found,
//       record,
//       valid,
//       policy,
//       issues,
//     }
//   }

//   private async verifyMXRecords(domain: string) {
//     const issues: string[] = []
//     const records: string[] = []

//     try {
//       const mxRecords = await dns.resolveMx(domain)

//       if (mxRecords.length === 0) {
//         issues.push("No MX records found")
//       } else {
//         records.push(...mxRecords.sort((a, b) => a.priority - b.priority).map((mx) => mx.exchange))
//       }
//     } catch (error) {
//       issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }

//     return {
//       found: records.length > 0,
//       records,
//     }
//   }

//   /**
//    * Generate a unique DKIM selector for this domain
//    */
//   generateDKIMSelector(): string {
//     return `reach${crypto.randomBytes(4).toString("hex")}`
//   }

//   /**
//    * Store verification result in database
//    */
//   async saveVerificationResult(userId: string, domain: string, result: DNSVerificationResult): Promise<void> {
//     // Create or update Domain record
//     await db.domain.upsert({
//       where: {
//         userId_domain: {
//           userId,
//           domain,
//         },
//       },
//       create: {
//         userId,
//         domain,
//         isVerified: result.overallValid,
//         verifiedAt: result.overallValid ? new Date() : null,
//         healthScore: result.score,
//         dnsRecords: {
//           spf: result.spf,
//           dkim: result.dkim,
//           dmarc: result.dmarc,
//           mx: result.mx,
//         },
//       },
//       update: {
//         isVerified: result.overallValid,
//         verifiedAt: result.overallValid ? new Date() : null,
//         healthScore: result.score,
//         dnsRecords: {
//           spf: result.spf,
//           dkim: result.dkim,
//           dmarc: result.dmarc,
//           mx: result.mx,
//         },
//         lastVerificationCheck: new Date(),
//         verificationAttempts: {
//           increment: 1,
//         },
//       },
//     })

//     // FIXED: Properly check for existing deliverabilityHealth via relation
//     const domainRecord = await db.domain.findUnique({
//       where: {
//         userId_domain: {
//           userId,
//           domain,
//         },
//       },
//       include: {
//         deliverabilityHealth: true,  // Include the relation
//       },
//     })

//     if (domainRecord && !domainRecord.deliverabilityHealth) {
//       await db.deliverabilityHealth.create({
//         data: {
//           domainId: domainRecord.id,
//           spfStatus: result.spf.valid ? "VALID" : result.spf.found ? "INVALID" : "MISSING",
//           spfValid: result.spf.valid,
//           spfRecord: result.spf.record,
//           dkimStatus: result.dkim.valid ? "VALID" : result.dkim.found ? "INVALID" : "MISSING",
//           dkimValid: result.dkim.valid,
//           dkimSelectors: result.dkim.selectors,
//           dmarcStatus: result.dmarc.valid ? "VALID" : result.dmarc.found ? "INVALID" : "MISSING",
//           dmarcValid: result.dmarc.valid,
//           dmarcRecord: result.dmarc.record,  // Now this field exists
//           dmarcPolicy: result.dmarc.policy,
//           mxRecordsValid: result.mx.found,
//           mxRecords: result.mx.records,
//         },
//       })
//     } else if (domainRecord?.deliverabilityHealth) {
//       // Update existing deliverability health
//       await db.deliverabilityHealth.update({
//         where: {
//           domainId: domainRecord.id,
//         },
//         data: {
//           spfStatus: result.spf.valid ? "VALID" : result.spf.found ? "INVALID" : "MISSING",
//           spfValid: result.spf.valid,
//           spfRecord: result.spf.record,
//           dkimStatus: result.dkim.valid ? "VALID" : result.dkim.found ? "INVALID" : "MISSING",
//           dkimValid: result.dkim.valid,
//           dkimSelectors: result.dkim.selectors,
//           dmarcStatus: result.dmarc.valid ? "VALID" : result.dmarc.found ? "INVALID" : "MISSING",
//           dmarcValid: result.dmarc.valid,
//           dmarcRecord: result.dmarc.record,
//           dmarcPolicy: result.dmarc.policy,
//           mxRecordsValid: result.mx.found,
//           mxRecords: result.mx.records,
//           lastFullCheck: new Date(),
//         },
//       })
//     }
//   }
// }

// export const dnsVerificationService = new DNSVerificationService()


// import { db } from "../db"
// import dns from "dns/promises"
// import crypto from "crypto"

// interface DNSRecord {
//   type: "TXT" | "CNAME" | "MX"
//   name: string
//   value: string
//   ttl?: number
//   selector?: string
// }

// interface GeneratedDNSRecords {
//   records: DNSRecord[]
//   selector: string
// }

// interface DNSVerificationResult {
//   domain: string
//   spf: {
//     found: boolean
//     record?: string
//     valid: boolean
//     issues: string[]
//   }
//   dkim: {
//     found: boolean
//     selectors: string[]
//     valid: boolean
//     issues: string[]
//   }
//   dmarc: {
//     found: boolean
//     record?: string
//     valid: boolean
//     policy?: string
//     issues: string[]
//   }
//   mx: {
//     found: boolean
//     records: string[]
//   }
//   overallValid: boolean
//   score: number
//   allValid: boolean
//   healthScore: number
//   results: Array<{
//     type: string
//     valid: boolean
//     message?: string
//   }>
// }

// class DNSVerificationService {
//   private readonly COMMON_DKIM_SELECTORS = [
//     "default",
//     "google",
//     "k1",
//     "s1",
//     "s2",
//     "dkim",
//     "mail",
//     "smtp",
//     "selector1",
//     "selector2",
//   ]

//   /**
//    * Generate DNS records needed for domain verification
//    */
//   generateDNSRecords(domain: string, dkimSelector = "default"): GeneratedDNSRecords {
//     const records: DNSRecord[] = [
//       {
//         type: "TXT",
//         name: "@",
//         value: `v=spf1 include:sendgrid.net ~all`,
//         ttl: 3600,
//       },
//       {
//         type: "CNAME",
//         name: `${dkimSelector}._domainkey`,
//         value: `${dkimSelector}.sendgrid.net`,
//         ttl: 3600,
//         selector: dkimSelector,
//       },
//       {
//         type: "TXT",
//         name: "_dmarc",
//         value: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${domain}; ruf=mailto:dmarc-forensics@${domain}; pct=25`,
//         ttl: 3600,
//       },
//     ]

//     return {
//       records,
//       selector: dkimSelector,
//     }
//   }

//   /**
//    * Comprehensive DNS verification
//    */
//   async verifyDNSRecords(domain: string): Promise<DNSVerificationResult> {
//     const [spfResult, dkimResult, dmarcResult, mxResult] = await Promise.all([
//       this.verifySPF(domain),
//       this.verifyDKIM(domain),
//       this.verifyDMARC(domain),
//       this.verifyMXRecords(domain),
//     ])

//     const overallValid = spfResult.valid && dkimResult.valid && dmarcResult.valid && mxResult.found

//     // Calculate score (0-100)
//     let score = 0
//     if (spfResult.valid) score += 25
//     if (dkimResult.valid) score += 25
//     if (dmarcResult.valid) score += 25
//     if (mxResult.found) score += 25

//     const results = [
//       {
//         type: "SPF",
//         valid: spfResult.valid,
//         message: spfResult.issues.join(", "),
//       },
//       {
//         type: "DKIM",
//         valid: dkimResult.valid,
//         message: dkimResult.issues.join(", "),
//       },
//       {
//         type: "DMARC",
//         valid: dmarcResult.valid,
//         message: dmarcResult.issues.join(", "),
//       },
//       {
//         type: "MX",
//         valid: mxResult.found,
//         message: mxResult.found ? "MX records found" : "No MX records",
//       },
//     ]

//     return {
//       domain,
//       spf: spfResult,
//       dkim: dkimResult,
//       dmarc: dmarcResult,
//       mx: mxResult,
//       overallValid,
//       score,
//       allValid: overallValid,
//       healthScore: score,
//       results,
//     }
//   }

//   private async verifySPF(domain: string) {
//     const issues: string[] = []
//     let found = false
//     let record: string | undefined
//     let valid = false

//     try {
//       const txtRecords = await dns.resolveTxt(domain)
//       const spfRecord = txtRecords.find((r) => r.join("").startsWith("v=spf1"))

//       if (spfRecord) {
//         found = true
//         record = spfRecord.join("")

//         if (!record.includes("~all") && !record.includes("-all")) {
//           issues.push("SPF record should end with ~all or -all")
//         }

//         if (record.split(" ").length > 10) {
//           issues.push("SPF record has too many mechanisms (max 10 recommended)")
//         }

//         valid = issues.length === 0
//       } else {
//         issues.push("No SPF record found")
//       }
//     } catch (error) {
//       issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }

//     return { found, record, valid, issues }
//   }

//   private async verifyDKIM(domain: string) {
//     const issues: string[] = []
//     const selectors: string[] = []
//     let valid = false

//     for (const selector of this.COMMON_DKIM_SELECTORS) {
//       try {
//         const dkimDomain = `${selector}._domainkey.${domain}`
//         const txtRecords = await dns.resolveTxt(dkimDomain)

//         const hasDKIM = txtRecords.some((r) => r.join("").includes("v=DKIM1"))

//         if (hasDKIM) {
//           selectors.push(selector)
//         }
//       } catch {
//         // Selector not found, continue
//       }
//     }

//     if (selectors.length === 0) {
//       issues.push("No DKIM records found for common selectors")
//     } else {
//       valid = true
//     }

//     return {
//       found: selectors.length > 0,
//       selectors,
//       valid,
//       issues,
//     }
//   }

//   private async verifyDMARC(domain: string) {
//     const issues: string[] = []
//     let found = false
//     let record: string | undefined
//     let policy: string | undefined
//     let valid = false

//     try {
//       const dmarcDomain = `_dmarc.${domain}`
//       const txtRecords = await dns.resolveTxt(dmarcDomain)
//       const dmarcRecord = txtRecords.find((r) => r.join("").startsWith("v=DMARC1"))

//       if (dmarcRecord) {
//         found = true
//         record = dmarcRecord.join("")

//         const policyMatch = record.match(/p=(none|quarantine|reject)/)
//         if (policyMatch) {
//           policy = policyMatch[1]

//           if (policy === "none") {
//             issues.push("DMARC policy is set to 'none' - consider using 'quarantine' or 'reject'")
//           }

//           valid = true
//         } else {
//           issues.push("Invalid DMARC policy")
//         }
//       } else {
//         issues.push("No DMARC record found")
//       }
//     } catch (error) {
//       issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }

//     return {
//       found,
//       record,
//       valid,
//       policy,
//       issues,
//     }
//   }

//   private async verifyMXRecords(domain: string) {
//     const issues: string[] = []
//     const records: string[] = []

//     try {
//       const mxRecords = await dns.resolveMx(domain)

//       if (mxRecords.length === 0) {
//         issues.push("No MX records found")
//       } else {
//         records.push(...mxRecords.sort((a, b) => a.priority - b.priority).map((mx) => mx.exchange))
//       }
//     } catch (error) {
//       issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }

//     return {
//       found: records.length > 0,
//       records,
//     }
//   }

//   /**
//    * Generate a unique DKIM selector for this domain
//    */
//   generateDKIMSelector(): string {
//     return `reach${crypto.randomBytes(4).toString("hex")}`
//   }

//   /**
//    * Store verification result in database
//    */
//   async saveVerificationResult(userId: string, domain: string, result: DNSVerificationResult): Promise<void> {
//     await db.domain.upsert({
//       where: {
//         userId_domain: {
//           userId,
//           domain,
//         },
//       },
//       create: {
//         userId,
//         domain,
//         isVerified: result.overallValid,
//         verifiedAt: result.overallValid ? new Date() : null,
//         healthScore: result.score,
//         dnsRecords: {
//           spf: result.spf,
//           dkim: result.dkim,
//           dmarc: result.dmarc,
//           mx: result.mx,
//         } as any,
//       },
//       update: {
//         isVerified: result.overallValid,
//         verifiedAt: result.overallValid ? new Date() : null,
//         healthScore: result.score,
//         dnsRecords: {
//           spf: result.spf,
//           dkim: result.dkim,
//           dmarc: result.dmarc,
//           mx: result.mx,
//         } as any,
//         lastVerificationCheck: new Date(),
//         verificationAttempts: {
//           increment: 1,
//         },
//       },
//     })

//     const domainRecord = await db.domain.findUnique({
//       where: {
//         userId_domain: {
//           userId,
//           domain,
//         },
//       },
//       include: {
//         deliverabilityHealth: true,
//       },
//     })

//     if (domainRecord && !domainRecord.deliverabilityHealth) {
//       await db.deliverabilityHealth.create({
//         data: {
//           domainId: domainRecord.id,
//           spfStatus: result.spf.valid ? "VALID" : result.spf.found ? "INVALID" : "MISSING",
//           spfValid: result.spf.valid,
//           spfRecord: result.spf.record,
//           dkimStatus: result.dkim.valid ? "VALID" : result.dkim.found ? "INVALID" : "MISSING",
//           dkimValid: result.dkim.valid,
//           dkimSelectors: result.dkim.selectors,
//           dmarcStatus: result.dmarc.valid ? "VALID" : result.dmarc.found ? "INVALID" : "MISSING",
//           dmarcValid: result.dmarc.valid,
//           dmarcRecord: result.dmarc.record,
//           dmarcPolicy: result.dmarc.policy,
//           mxRecordsValid: result.mx.found,
//           mxRecords: result.mx.records,
//         },
//       })
//     }
//   }
// }

// export const dnsVerificationService = new DNSVerificationService()

// export const generateDNSRecords = (domain: string, dkimSelector = "default") =>
//   dnsVerificationService.generateDNSRecords(domain, dkimSelector)

// export const verifyDNSRecords = (domain: string) => dnsVerificationService.verifyDNSRecords(domain)

// export const generateDKIMSelector = () => dnsVerificationService.generateDKIMSelector()


// import { db } from "../db"
// import dns from "dns/promises"
// import crypto from "crypto"

// interface DNSRecord {
//   type: "TXT" | "CNAME" | "MX"
//   name: string
//   value: string
//   ttl?: number
//   selector?: string
// }

// interface GeneratedDNSRecords {
//   records: DNSRecord[]
//   selector: string
// }

// interface DNSVerificationResult {
//   domain: string
//   spf: {
//     found: boolean
//     record?: string
//     valid: boolean
//     issues: string[]
//   }
//   dkim: {
//     found: boolean
//     selectors: string[]
//     valid: boolean
//     issues: string[]
//   }
//   dmarc: {
//     found: boolean
//     record?: string
//     valid: boolean
//     policy?: string
//     issues: string[]
//   }
//   mx: {
//     found: boolean
//     records: string[]
//   }
//   overallValid: boolean
//   score: number
//   allValid: boolean
//   healthScore: number
//   results: Array<{
//     type: string
//     valid: boolean
//     message?: string
//   }>
// }

// class DNSVerificationService {
//   private readonly COMMON_DKIM_SELECTORS = [
//     "default",
//     "google",
//     "k1",
//     "s1",
//     "s2",
//     "dkim",
//     "mail",
//     "smtp",
//     "selector1",
//     "selector2",
//   ]

//   /**
//    * Generate DNS records needed for domain verification
//    */
//   generateDNSRecords(domain: string, dkimSelector = "default"): GeneratedDNSRecords {
//     const records: DNSRecord[] = [
//       {
//         type: "TXT",
//         name: "@",
//         value: `v=spf1 include:sendgrid.net ~all`,
//         ttl: 3600,
//       },
//       {
//         type: "CNAME",
//         name: `${dkimSelector}._domainkey`,
//         value: `${dkimSelector}.sendgrid.net`,
//         ttl: 3600,
//         selector: dkimSelector,
//       },
//       {
//         type: "TXT",
//         name: "_dmarc",
//         value: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${domain}; ruf=mailto:dmarc-forensics@${domain}; pct=25`,
//         ttl: 3600,
//       },
//     ]

//     return {
//       records,
//       selector: dkimSelector,
//     }
//   }

//   /**
//    * Comprehensive DNS verification
//    */
//   async verifyDNSRecords(domain: string): Promise<DNSVerificationResult> {
//     const [spfResult, dkimResult, dmarcResult, mxResult] = await Promise.all([
//       this.verifySPF(domain),
//       this.verifyDKIM(domain),
//       this.verifyDMARC(domain),
//       this.verifyMXRecords(domain),
//     ])

//     const overallValid = spfResult.valid && dkimResult.valid && dmarcResult.valid && mxResult.found

//     // Calculate score (0-100)
//     let score = 0
//     if (spfResult.valid) score += 25
//     if (dkimResult.valid) score += 25
//     if (dmarcResult.valid) score += 25
//     if (mxResult.found) score += 25

//     const results = [
//       {
//         type: "SPF",
//         valid: spfResult.valid,
//         message: spfResult.issues.join(", "),
//       },
//       {
//         type: "DKIM",
//         valid: dkimResult.valid,
//         message: dkimResult.issues.join(", "),
//       },
//       {
//         type: "DMARC",
//         valid: dmarcResult.valid,
//         message: dmarcResult.issues.join(", "),
//       },
//       {
//         type: "MX",
//         valid: mxResult.found,
//         message: mxResult.found ? "MX records found" : "No MX records",
//       },
//     ]

//     return {
//       domain,
//       spf: spfResult,
//       dkim: dkimResult,
//       dmarc: dmarcResult,
//       mx: mxResult,
//       overallValid,
//       score,
//       allValid: overallValid,
//       healthScore: score,
//       results,
//     }
//   }

//   private async verifySPF(domain: string) {
//     const issues: string[] = []
//     let found = false
//     let record: string | undefined
//     let valid = false

//     try {
//       const txtRecords = await dns.resolveTxt(domain)
//       const spfRecord = txtRecords.find((r) => r.join("").startsWith("v=spf1"))

//       if (spfRecord) {
//         found = true
//         record = spfRecord.join("")

//         if (!record.includes("~all") && !record.includes("-all")) {
//           issues.push("SPF record should end with ~all or -all")
//         }

//         if (record.split(" ").length > 10) {
//           issues.push("SPF record has too many mechanisms (max 10 recommended)")
//         }

//         valid = issues.length === 0
//       } else {
//         issues.push("No SPF record found")
//       }
//     } catch (error) {
//       issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }

//     return { found, record, valid, issues }
//   }

//   private async verifyDKIM(domain: string) {
//     const issues: string[] = []
//     const selectors: string[] = []
//     let valid = false

//     for (const selector of this.COMMON_DKIM_SELECTORS) {
//       try {
//         const dkimDomain = `${selector}._domainkey.${domain}`
//         const txtRecords = await dns.resolveTxt(dkimDomain)

//         const hasDKIM = txtRecords.some((r) => r.join("").includes("v=DKIM1"))

//         if (hasDKIM) {
//           selectors.push(selector)
//         }
//       } catch {
//         // Selector not found, continue
//       }
//     }

//     if (selectors.length === 0) {
//       issues.push("No DKIM records found for common selectors")
//     } else {
//       valid = true
//     }

//     return {
//       found: selectors.length > 0,
//       selectors,
//       valid,
//       issues,
//     }
//   }

//   private async verifyDMARC(domain: string) {
//     const issues: string[] = []
//     let found = false
//     let record: string | undefined
//     let policy: string | undefined
//     let valid = false

//     try {
//       const dmarcDomain = `_dmarc.${domain}`
//       const txtRecords = await dns.resolveTxt(dmarcDomain)
//       const dmarcRecord = txtRecords.find((r) => r.join("").startsWith("v=DMARC1"))

//       if (dmarcRecord) {
//         found = true
//         record = dmarcRecord.join("")

//         const policyMatch = record.match(/p=(none|quarantine|reject)/)
//         if (policyMatch) {
//           policy = policyMatch[1]

//           if (policy === "none") {
//             issues.push("DMARC policy is set to 'none' - consider using 'quarantine' or 'reject'")
//           }

//           valid = true
//         } else {
//           issues.push("Invalid DMARC policy")
//         }
//       } else {
//         issues.push("No DMARC record found")
//       }
//     } catch (error) {
//       issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }

//     return {
//       found,
//       record,
//       valid,
//       policy,
//       issues,
//     }
//   }

//   private async verifyMXRecords(domain: string) {
//     const records: string[] = []

//     try {
//       if (!domain || typeof domain !== "string") {
//         throw new Error("Invalid domain provided for MX lookup")
//       }

//       const mxRecords = await dns.resolveMx(domain)

//       if (mxRecords.length === 0) {
//         console.warn(`[DNS] No MX records found for ${domain}`)
//       } else {
//         records.push(...mxRecords.sort((a, b) => a.priority - b.priority).map((mx) => mx.exchange))
//       }
//     } catch (error) {
//       console.error(`[DNS] MX record lookup failed for ${domain}:`, error)
//       // Don't throw - just return empty records
//     }

//     return {
//       found: records.length > 0,
//       records,
//     }
//   }

//   /**
//    * Generate a unique DKIM selector for this domain
//    */
//   generateDKIMSelector(): string {
//     return `reach${crypto.randomBytes(4).toString("hex")}`
//   }

//   /**
//    * Store verification result in database
//    */
//   async saveVerificationResult(userId: string, domain: string, result: DNSVerificationResult): Promise<void> {
//     await db.domain.upsert({
//       where: {
//         userId_domain: {
//           userId,
//           domain,
//         },
//       },
//       create: {
//         userId,
//         domain,
//         isVerified: result.overallValid,
//         verifiedAt: result.overallValid ? new Date() : null,
//         healthScore: result.score,
//         dnsRecords: {
//           spf: result.spf,
//           dkim: result.dkim,
//           dmarc: result.dmarc,
//           mx: result.mx,
//         } as any,
//       },
//       update: {
//         isVerified: result.overallValid,
//         verifiedAt: result.overallValid ? new Date() : null,
//         healthScore: result.score,
//         dnsRecords: {
//           spf: result.spf,
//           dkim: result.dkim,
//           dmarc: result.dmarc,
//           mx: result.mx,
//         } as any,
//         lastVerificationCheck: new Date(),
//         verificationAttempts: {
//           increment: 1,
//         },
//       },
//     })

//     const domainRecord = await db.domain.findUnique({
//       where: {
//         userId_domain: {
//           userId,
//           domain,
//         },
//       },
//       include: {
//         deliverabilityHealth: true,
//       },
//     })

//     if (domainRecord && !domainRecord.deliverabilityHealth) {
//       await db.deliverabilityHealth.create({
//         data: {
//           domainId: domainRecord.id,
//           spfStatus: result.spf.valid ? "VALID" : result.spf.found ? "INVALID" : "MISSING",
//           spfValid: result.spf.valid,
//           spfRecord: result.spf.record,
//           dkimStatus: result.dkim.valid ? "VALID" : result.dkim.found ? "INVALID" : "MISSING",
//           dkimValid: result.dkim.valid,
//           dkimSelectors: result.dkim.selectors,
//           dmarcStatus: result.dmarc.valid ? "VALID" : result.dmarc.found ? "INVALID" : "MISSING",
//           dmarcValid: result.dmarc.valid,
//           dmarcRecord: result.dmarc.record,
//           dmarcPolicy: result.dmarc.policy,
//           mxRecordsValid: result.mx.found,
//           mxRecords: result.mx.records,
//         },
//       })
//     }
//   }
// }

// export const dnsVerificationService = new DNSVerificationService()

// export const generateDNSRecords = (domain: string, dkimSelector = "default") =>
//   dnsVerificationService.generateDNSRecords(domain, dkimSelector)

// export const verifyDNSRecords = (domain: string) => dnsVerificationService.verifyDNSRecords(domain)

// export const generateDKIMSelector = () => dnsVerificationService.generateDKIMSelector()



// import { db } from "../db"
// import dns from "dns/promises"
// import crypto from "crypto"

// interface DNSRecord {
//   type: "TXT" | "CNAME" | "MX"
//   name: string
//   value: string
//   ttl?: number
//   selector?: string
// }

// interface GeneratedDNSRecords {
//   records: DNSRecord[]
//   selector: string
// }

// interface DNSVerificationResult {
//   domain: string
//   spf: {
//     found: boolean
//     record?: string
//     valid: boolean
//     issues: string[]
//   }
//   dkim: {
//     found: boolean
//     selectors: string[]
//     valid: boolean
//     issues: string[]
//   }
//   dmarc: {
//     found: boolean
//     record?: string
//     valid: boolean
//     policy?: string
//     issues: string[]
//   }
//   mx: {
//     found: boolean
//     records: string[]
//   }
//   overallValid: boolean
//   score: number
//   allValid: boolean
//   healthScore: number
//   results: Array<{
//     type: string
//     valid: boolean
//     message?: string
//   }>
// }

// class DNSVerificationService {
//   private readonly COMMON_DKIM_SELECTORS = [
//     "default",
//     "google",
//     "k1",
//     "s1",
//     "s2",
//     "dkim",
//     "mail",
//     "smtp",
//     "selector1",
//     "selector2",
//   ]

//   /**
//    * Generate DNS records needed for domain verification
//    */
//   generateDNSRecords(domain: string, dkimSelector = "default"): GeneratedDNSRecords {
//     const records: DNSRecord[] = [
//       {
//         type: "TXT",
//         name: "@",
//         value: `v=spf1 include:sendgrid.net ~all`,
//         ttl: 3600,
//       },
//       {
//         type: "CNAME",
//         name: `${dkimSelector}._domainkey`,
//         value: `${dkimSelector}.sendgrid.net`,
//         ttl: 3600,
//         selector: dkimSelector,
//       },
//       {
//         type: "TXT",
//         name: "_dmarc",
//         value: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${domain}; ruf=mailto:dmarc-forensics@${domain}; pct=25`,
//         ttl: 3600,
//       },
//     ]

//     return {
//       records,
//       selector: dkimSelector,
//     }
//   }

//   /**
//    * Comprehensive DNS verification
//    */
//   async verifyDNSRecords(domain: string): Promise<DNSVerificationResult> {
//     const [spfResult, dkimResult, dmarcResult, mxResult] = await Promise.all([
//       this.verifySPF(domain),
//       this.verifyDKIM(domain),
//       this.verifyDMARC(domain),
//       this.verifyMXRecords(domain),
//     ])

//     const overallValid = spfResult.valid && dkimResult.valid && dmarcResult.valid && mxResult.found

//     // Calculate score (0-100)
//     let score = 0
//     if (spfResult.valid) score += 25
//     if (dkimResult.valid) score += 25
//     if (dmarcResult.valid) score += 25
//     if (mxResult.found) score += 25

//     const results = [
//       {
//         type: "SPF",
//         valid: spfResult.valid,
//         message: spfResult.issues.join(", "),
//       },
//       {
//         type: "DKIM",
//         valid: dkimResult.valid,
//         message: dkimResult.issues.join(", "),
//       },
//       {
//         type: "DMARC",
//         valid: dmarcResult.valid,
//         message: dmarcResult.issues.join(", "),
//       },
//       {
//         type: "MX",
//         valid: mxResult.found,
//         message: mxResult.found ? "MX records found" : "No MX records",
//       },
//     ]

//     return {
//       domain,
//       spf: spfResult,
//       dkim: dkimResult,
//       dmarc: dmarcResult,
//       mx: mxResult,
//       overallValid,
//       score,
//       allValid: overallValid,
//       healthScore: score,
//       results,
//     }
//   }

//   private async verifySPF(domain: string) {
//     const issues: string[] = []
//     let found = false
//     let record: string | undefined
//     let valid = false

//     try {
//       const txtRecords = await dns.resolveTxt(domain)
//       const spfRecord = txtRecords.find((r) => r.join("").startsWith("v=spf1"))

//       if (spfRecord) {
//         found = true
//         record = spfRecord.join("")

//         if (!record.includes("~all") && !record.includes("-all")) {
//           issues.push("SPF record should end with ~all or -all")
//         }

//         if (record.split(" ").length > 10) {
//           issues.push("SPF record has too many mechanisms (max 10 recommended)")
//         }

//         valid = issues.length === 0
//       } else {
//         issues.push("No SPF record found")
//       }
//     } catch (error) {
//       issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }

//     return { found, record, valid, issues }
//   }

//   private async verifyDKIM(domain: string) {
//     const issues: string[] = []
//     const selectors: string[] = []
//     let valid = false

//     for (const selector of this.COMMON_DKIM_SELECTORS) {
//       try {
//         const dkimDomain = `${selector}._domainkey.${domain}`
//         const txtRecords = await dns.resolveTxt(dkimDomain)

//         const hasDKIM = txtRecords.some((r) => r.join("").includes("v=DKIM1"))

//         if (hasDKIM) {
//           selectors.push(selector)
//         }
//       } catch {
//         // Selector not found, continue
//       }
//     }

//     if (selectors.length === 0) {
//       issues.push("No DKIM records found for common selectors")
//     } else {
//       valid = true
//     }

//     return {
//       found: selectors.length > 0,
//       selectors,
//       valid,
//       issues,
//     }
//   }

//   private async verifyDMARC(domain: string) {
//     const issues: string[] = []
//     let found = false
//     let record: string | undefined
//     let policy: string | undefined
//     let valid = false

//     try {
//       const dmarcDomain = `_dmarc.${domain}`
//       const txtRecords = await dns.resolveTxt(dmarcDomain)
//       const dmarcRecord = txtRecords.find((r) => r.join("").startsWith("v=DMARC1"))

//       if (dmarcRecord) {
//         found = true
//         record = dmarcRecord.join("")

//         const policyMatch = record.match(/p=(none|quarantine|reject)/)
//         if (policyMatch) {
//           policy = policyMatch[1]

//           if (policy === "none") {
//             issues.push("DMARC policy is set to 'none' - consider using 'quarantine' or 'reject'")
//           }

//           valid = true
//         } else {
//           issues.push("Invalid DMARC policy")
//         }
//       } else {
//         issues.push("No DMARC record found")
//       }
//     } catch (error) {
//       issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }

//     return {
//       found,
//       record,
//       valid,
//       policy,
//       issues,
//     }
//   }

//   private async verifyMXRecords(domain: string) {
//     const records: string[] = []

//     try {
//       if (!domain || typeof domain !== "string" || domain.trim() === "") {
//         console.warn(`[DNS] Invalid domain provided for MX lookup: ${domain}`)
//         return { found: false, records: [] }
//       }

//       const cleanDomain = domain.trim().toLowerCase()
//       const mxRecords = await dns.resolveMx(cleanDomain)

//       if (mxRecords.length === 0) {
//         console.info(`[DNS] No MX records found for ${cleanDomain}`)
//       } else {
//         records.push(...mxRecords.sort((a, b) => a.priority - b.priority).map((mx) => mx.exchange))
//       }
//     } catch (error: any) {
//       // Don't throw - just log and return empty
//       if (error.code === "ENOTFOUND") {
//         console.info(`[DNS] Domain not found in DNS: ${domain}`)
//       } else {
//         console.warn(`[DNS] MX lookup failed for ${domain}: ${error.message}`)
//       }
//     }

//     return {
//       found: records.length > 0,
//       records,
//     }
//   }

//   /**
//    * Generate a unique DKIM selector for this domain
//    */
//   generateDKIMSelector(): string {
//     return `reach${crypto.randomBytes(4).toString("hex")}`
//   }

//   /**
//    * Store verification result in database
//    */
//   async saveVerificationResult(userId: string, domain: string, result: DNSVerificationResult): Promise<void> {
//     await db.domain.upsert({
//       where: {
//         userId_domain: {
//           userId,
//           domain,
//         },
//       },
//       create: {
//         userId,
//         domain,
//         isVerified: result.overallValid,
//         verifiedAt: result.overallValid ? new Date() : null,
//         healthScore: result.score,
//         dnsRecords: {
//           spf: result.spf,
//           dkim: result.dkim,
//           dmarc: result.dmarc,
//           mx: result.mx,
//         } as any,
//       },
//       update: {
//         isVerified: result.overallValid,
//         verifiedAt: result.overallValid ? new Date() : null,
//         healthScore: result.score,
//         dnsRecords: {
//           spf: result.spf,
//           dkim: result.dkim,
//           dmarc: result.dmarc,
//           mx: result.mx,
//         } as any,
//         lastVerificationCheck: new Date(),
//         verificationAttempts: {
//           increment: 1,
//         },
//       },
//     })

//     const domainRecord = await db.domain.findUnique({
//       where: {
//         userId_domain: {
//           userId,
//           domain,
//         },
//       },
//       include: {
//         deliverabilityHealth: true,
//       },
//     })

//     if (domainRecord && !domainRecord.deliverabilityHealth) {
//       await db.deliverabilityHealth.create({
//         data: {
//           domainId: domainRecord.id,
//           spfStatus: result.spf.valid ? "VALID" : result.spf.found ? "INVALID" : "MISSING",
//           spfValid: result.spf.valid,
//           spfRecord: result.spf.record,
//           dkimStatus: result.dkim.valid ? "VALID" : result.dkim.found ? "INVALID" : "MISSING",
//           dkimValid: result.dkim.valid,
//           dkimSelectors: result.dkim.selectors,
//           dmarcStatus: result.dmarc.valid ? "VALID" : result.dmarc.found ? "INVALID" : "MISSING",
//           dmarcValid: result.dmarc.valid,
//           dmarcRecord: result.dmarc.record,
//           dmarcPolicy: result.dmarc.policy,
//           mxRecordsValid: result.mx.found,
//           mxRecords: result.mx.records,
//         },
//       })
//     }
//   }
// }

// export const dnsVerificationService = new DNSVerificationService()

// export const generateDNSRecords = (domain: string, dkimSelector = "default") =>
//   dnsVerificationService.generateDNSRecords(domain, dkimSelector)

// export const verifyDNSRecords = (domain: string) => dnsVerificationService.verifyDNSRecords(domain)

// export const generateDKIMSelector = () => dnsVerificationService.generateDKIMSelector()









// import { db } from "../db"
// import dns from "dns/promises"
// import crypto from "crypto"

// interface DNSRecord {
//   type: "TXT" | "CNAME" | "MX"
//   name: string
//   value: string
//   ttl?: number
//   selector?: string
// }

// interface GeneratedDNSRecords {
//   records: DNSRecord[]
//   selector: string
// }

// interface DNSVerificationResult {
//   domain: string
//   spf: {
//     found: boolean
//     record?: string
//     valid: boolean
//     issues: string[]
//   }
//   dkim: {
//     found: boolean
//     selectors: string[]
//     valid: boolean
//     issues: string[]
//   }
//   dmarc: {
//     found: boolean
//     record?: string
//     valid: boolean
//     policy?: string
//     issues: string[]
//   }
//   mx: {
//     found: boolean
//     records: string[]
//   }
//   overallValid: boolean
//   score: number
//   allValid: boolean
//   healthScore: number
//   results: Array<{
//     type: string
//     valid: boolean
//     message?: string
//   }>
// }

// class DNSVerificationService {
//   private readonly COMMON_DKIM_SELECTORS = [
//     // Generic/default
//     "default",
//     "dkim",
//     "mail",
//     "email",
//     "k1",
//     "k2",
//     "s1",
//     "s2",
//     // Google Workspace
//     "google",
//     "google1",
//     "google2",
//     "gm1",
//     "gm2",
//     // Microsoft 365 / Outlook
//     "selector1",
//     "selector2",
//     "s1024",
//     "s2048",
//     // SendGrid
//     "s1",
//     "s2",
//     "smtpapi",
//     "sendgrid",
//     "em",
//     "em1",
//     "em2",
//     // Mailchimp / Mandrill
//     "k1",
//     "mandrill",
//     "mte1",
//     "mte2",
//     // Amazon SES
//     "amazonses",
//     "ses",
//     // Mailgun
//     "mailo",
//     "mg",
//     "pic",
//     "k1",
//     // Postmark
//     "pm",
//     "20161025",
//     // Zoho
//     "zoho",
//     "zmail",
//     // Constant Contact
//     "ctct1",
//     "ctct2",
//     // HubSpot
//     "hs1",
//     "hs2",
//     "hubspot",
//     // Klaviyo
//     "kl",
//     "kl1",
//     "kl2",
//     // ActiveCampaign
//     "dk",
//     // Brevo (Sendinblue)
//     "mail",
//     "sib",
//     // Instantly
//     "instantly",
//     // Lemlist
//     "lemlist",
//     // Apollo
//     "apollo",
//     // Outreach
//     "outreach",
//     // Custom/numbered
//     "dkim1",
//     "dkim2",
//     "key1",
//     "key2",
//   ]

//   /**
//    * Generate DNS records needed for domain verification
//    */
//   generateDNSRecords(domain: string, dkimSelector = "default"): GeneratedDNSRecords {
//     const records: DNSRecord[] = [
//       {
//         type: "TXT",
//         name: "@",
//         value: `v=spf1 include:sendgrid.net ~all`,
//         ttl: 3600,
//       },
//       {
//         type: "CNAME",
//         name: `${dkimSelector}._domainkey`,
//         value: `${dkimSelector}.sendgrid.net`,
//         ttl: 3600,
//         selector: dkimSelector,
//       },
//       {
//         type: "TXT",
//         name: "_dmarc",
//         value: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${domain}; ruf=mailto:dmarc-forensics@${domain}; pct=25`,
//         ttl: 3600,
//       },
//     ]

//     return {
//       records,
//       selector: dkimSelector,
//     }
//   }

//   /**
//    * Comprehensive DNS verification
//    */
//   async verifyDNSRecords(domain: string): Promise<DNSVerificationResult> {
//     const [spfResult, dkimResult, dmarcResult, mxResult] = await Promise.all([
//       this.verifySPF(domain),
//       this.verifyDKIM(domain),
//       this.verifyDMARC(domain),
//       this.verifyMXRecords(domain),
//     ])

//     const overallValid = spfResult.valid && dkimResult.valid && dmarcResult.valid && mxResult.found

//     // Calculate score (0-100)
//     let score = 0
//     if (spfResult.valid) score += 25
//     if (dkimResult.valid) score += 25
//     if (dmarcResult.valid) score += 25
//     if (mxResult.found) score += 25

//     const results = [
//       {
//         type: "SPF",
//         valid: spfResult.valid,
//         message: spfResult.issues.join(", "),
//       },
//       {
//         type: "DKIM",
//         valid: dkimResult.valid,
//         message: dkimResult.issues.join(", "),
//       },
//       {
//         type: "DMARC",
//         valid: dmarcResult.valid,
//         message: dmarcResult.issues.join(", "),
//       },
//       {
//         type: "MX",
//         valid: mxResult.found,
//         message: mxResult.found ? "MX records found" : "No MX records",
//       },
//     ]

//     return {
//       domain,
//       spf: spfResult,
//       dkim: dkimResult,
//       dmarc: dmarcResult,
//       mx: mxResult,
//       overallValid,
//       score,
//       allValid: overallValid,
//       healthScore: score,
//       results,
//     }
//   }

//   private async verifySPF(domain: string) {
//     const issues: string[] = []
//     let found = false
//     let record: string | undefined
//     let valid = false

//     try {
//       const txtRecords = await dns.resolveTxt(domain)
//       const spfRecord = txtRecords.find((r) => r.join("").startsWith("v=spf1"))

//       if (spfRecord) {
//         found = true
//         record = spfRecord.join("")

//         if (!record.includes("~all") && !record.includes("-all")) {
//           issues.push("SPF record should end with ~all or -all")
//         }

//         if (record.split(" ").length > 10) {
//           issues.push("SPF record has too many mechanisms (max 10 recommended)")
//         }

//         valid = issues.length === 0
//       } else {
//         issues.push("No SPF record found")
//       }
//     } catch (error) {
//       issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }

//     return { found, record, valid, issues }
//   }

//   private async verifyDKIM(domain: string) {
//     const issues: string[] = []
//     const selectors: string[] = []
//     let valid = false

//     // Remove duplicates from selector list
//     const uniqueSelectors = [...new Set(this.COMMON_DKIM_SELECTORS)]

//     // Check selectors in parallel for speed
//     const results = await Promise.allSettled(
//       uniqueSelectors.map(async (selector) => {
//         try {
//           const dkimDomain = `${selector}._domainkey.${domain}`
//           const txtRecords = await dns.resolveTxt(dkimDomain)

//           const dkimRecord = txtRecords.find((r) => {
//             const record = r.join("")
//             return record.includes("v=DKIM1") || record.includes("k=rsa") || record.includes("p=")
//           })

//           if (dkimRecord) {
//             return { selector, found: true }
//           }
//           return { selector, found: false }
//         } catch {
//           return { selector, found: false }
//         }
//       }),
//     )

//     // Collect found selectors
//     for (const result of results) {
//       if (result.status === "fulfilled" && result.value.found) {
//         selectors.push(result.value.selector)
//       }
//     }

//     if (selectors.length === 0) {
//       issues.push(
//         "No DKIM records found. This is common - check your email provider's setup guide for the correct selector.",
//       )
//     } else {
//       valid = true
//     }

//     return {
//       found: selectors.length > 0,
//       selectors,
//       valid,
//       issues,
//     }
//   }

//   private async verifyDMARC(domain: string) {
//     const issues: string[] = []
//     let found = false
//     let record: string | undefined
//     let policy: string | undefined
//     let valid = false

//     try {
//       const dmarcDomain = `_dmarc.${domain}`
//       const txtRecords = await dns.resolveTxt(dmarcDomain)
//       const dmarcRecord = txtRecords.find((r) => r.join("").startsWith("v=DMARC1"))

//       if (dmarcRecord) {
//         found = true
//         record = dmarcRecord.join("")

//         const policyMatch = record.match(/p=(none|quarantine|reject)/)
//         if (policyMatch) {
//           policy = policyMatch[1]

//           if (policy === "none") {
//             issues.push("DMARC policy is set to 'none' - consider using 'quarantine' or 'reject'")
//           }

//           valid = true
//         } else {
//           issues.push("Invalid DMARC policy")
//         }
//       } else {
//         issues.push("No DMARC record found")
//       }
//     } catch (error) {
//       issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }

//     return {
//       found,
//       record,
//       valid,
//       policy,
//       issues,
//     }
//   }

//   private async verifyMXRecords(domain: string) {
//     const records: string[] = []

//     try {
//       if (!domain || typeof domain !== "string" || domain.trim() === "") {
//         console.warn(`[DNS] Invalid domain provided for MX lookup: ${domain}`)
//         return { found: false, records: [] }
//       }

//       const cleanDomain = domain.trim().toLowerCase()
//       const mxRecords = await dns.resolveMx(cleanDomain)

//       if (mxRecords.length === 0) {
//         console.info(`[DNS] No MX records found for ${cleanDomain}`)
//       } else {
//         records.push(...mxRecords.sort((a, b) => a.priority - b.priority).map((mx) => mx.exchange))
//       }
//     } catch (error: any) {
//       // Don't throw - just log and return empty
//       if (error.code === "ENOTFOUND") {
//         console.info(`[DNS] Domain not found in DNS: ${domain}`)
//       } else {
//         console.warn(`[DNS] MX lookup failed for ${domain}: ${error.message}`)
//       }
//     }

//     return {
//       found: records.length > 0,
//       records,
//     }
//   }

//   /**
//    * Generate a unique DKIM selector for this domain
//    */
//   generateDKIMSelector(): string {
//     return `reach${crypto.randomBytes(4).toString("hex")}`
//   }

//   /**
//    * Store verification result in database
//    */
//   async saveVerificationResult(userId: string, domain: string, result: DNSVerificationResult): Promise<void> {
//     await db.domain.upsert({
//       where: {
//         userId_domain: {
//           userId,
//           domain,
//         },
//       },
//       create: {
//         userId,
//         domain,
//         isVerified: result.overallValid,
//         verifiedAt: result.overallValid ? new Date() : null,
//         healthScore: result.score,
//         dnsRecords: {
//           spf: result.spf,
//           dkim: result.dkim,
//           dmarc: result.dmarc,
//           mx: result.mx,
//         } as any,
//       },
//       update: {
//         isVerified: result.overallValid,
//         verifiedAt: result.overallValid ? new Date() : null,
//         healthScore: result.score,
//         dnsRecords: {
//           spf: result.spf,
//           dkim: result.dkim,
//           dmarc: result.dmarc,
//           mx: result.mx,
//         } as any,
//         lastVerificationCheck: new Date(),
//         verificationAttempts: {
//           increment: 1,
//         },
//       },
//     })

//     const domainRecord = await db.domain.findUnique({
//       where: {
//         userId_domain: {
//           userId,
//           domain,
//         },
//       },
//       include: {
//         deliverabilityHealth: true,
//       },
//     })

//     if (domainRecord && !domainRecord.deliverabilityHealth) {
//       await db.deliverabilityHealth.create({
//         data: {
//           domainId: domainRecord.id,
//           spfStatus: result.spf.valid ? "VALID" : result.spf.found ? "INVALID" : "MISSING",
//           spfValid: result.spf.valid,
//           spfRecord: result.spf.record,
//           dkimStatus: result.dkim.valid ? "VALID" : result.dkim.found ? "INVALID" : "MISSING",
//           dkimValid: result.dkim.valid,
//           dkimSelectors: result.dkim.selectors,
//           dmarcStatus: result.dmarc.valid ? "VALID" : result.dmarc.found ? "INVALID" : "MISSING",
//           dmarcValid: result.dmarc.valid,
//           dmarcRecord: result.dmarc.record,
//           dmarcPolicy: result.dmarc.policy,
//           mxRecordsValid: result.mx.found,
//           mxRecords: result.mx.records,
//         },
//       })
//     }
//   }
// }

// export const dnsVerificationService = new DNSVerificationService()

// export const generateDNSRecords = (domain: string, dkimSelector = "default") =>
//   dnsVerificationService.generateDNSRecords(domain, dkimSelector)

// export const verifyDNSRecords = (domain: string) => dnsVerificationService.verifyDNSRecords(domain)

// export const generateDKIMSelector = () => dnsVerificationService.generateDKIMSelector()


// import { db } from "../db"
// import dns from "dns/promises"

// interface DNSRecord {
//   type: "TXT" | "CNAME" | "MX"
//   name: string
//   value: string
//   ttl?: number
//   selector?: string
// }

// interface GeneratedDNSRecords {
//   records: DNSRecord[]
//   selector: string
// }

// interface DNSVerificationResult {
//   domain: string
//   spf: {
//     found: boolean
//     record?: string
//     valid: boolean
//     issues: string[]
//   }
//   dkim: {
//     found: boolean
//     selectors: string[]
//     valid: boolean
//     issues: string[]
//   }
//   dmarc: {
//     found: boolean
//     record?: string
//     valid: boolean
//     policy?: string
//     issues: string[]
//   }
//   mx: {
//     found: boolean
//     records: string[]
//   }
//   overallValid: boolean
//   score: number
//   allValid: boolean
//   healthScore: number
//   results: Array<{
//     type: string
//     valid: boolean
//     message?: string
//   }>
// }

// class DNSVerificationService {
//   // Keep common selectors as fallback only
//   private readonly COMMON_DKIM_SELECTORS = [
//     "google", "google1", "selector1", "selector2", "default", 
//     "s1", "s2", "k1", "dkim", "mail"
//   ]

//   /**
//    * Generate DNS records - PROVIDER AGNOSTIC approach
//    */
//   generateDNSRecords(domain: string, dkimSelector = "default"): GeneratedDNSRecords {
//     const records: DNSRecord[] = [
//       // SPF - Generic, works with most providers
//       {
//         type: "TXT",
//         name: "@",
//         value: `v=spf1 include:_spf.${domain} ~all`,
//         ttl: 3600,
//       },
//       // DKIM - Placeholder that user must customize
//       {
//         type: "TXT",
//         name: `${dkimSelector}._domainkey`,
//         value: `v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY_HERE`,
//         ttl: 3600,
//         selector: dkimSelector,
//       },
//       // DMARC - Standard
//       {
//         type: "TXT",
//         name: "_dmarc",
//         value: `v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain}; pct=100`,
//         ttl: 3600,
//       },
//     ]

//     return { records, selector: dkimSelector }
//   }

//   /**
//    * FIXED: Verify the SPECIFIC selector the user configured
//    */
//   async verifyDNSRecords(
//     domain: string, 
//     userDkimSelector?: string
//   ): Promise<DNSVerificationResult> {
//     const [spfResult, dkimResult, dmarcResult, mxResult] = await Promise.all([
//       this.verifySPF(domain),
//       this.verifyDKIM(domain, userDkimSelector), // ✅ Pass user's selector
//       this.verifyDMARC(domain),
//       this.verifyMXRecords(domain),
//     ])

//     const overallValid = spfResult.valid && dkimResult.valid && dmarcResult.valid && mxResult.found

//     let score = 0
//     if (spfResult.valid) score += 25
//     if (dkimResult.valid) score += 25
//     if (dmarcResult.valid) score += 25
//     if (mxResult.found) score += 25

//     const results = [
//       {
//         type: "SPF",
//         valid: spfResult.valid,
//         message: spfResult.issues.join(", ") || "SPF configured correctly",
//       },
//       {
//         type: "DKIM",
//         valid: dkimResult.valid,
//         message: dkimResult.issues.join(", ") || `DKIM verified for selector(s): ${dkimResult.selectors.join(", ")}`,
//       },
//       {
//         type: "DMARC",
//         valid: dmarcResult.valid,
//         message: dmarcResult.issues.join(", ") || "DMARC configured correctly",
//       },
//       {
//         type: "MX",
//         valid: mxResult.found,
//         message: mxResult.found ? "MX records found" : "No MX records",
//       },
//     ]

//     return {
//       domain,
//       spf: spfResult,
//       dkim: dkimResult,
//       dmarc: dmarcResult,
//       mx: mxResult,
//       overallValid,
//       score,
//       allValid: overallValid,
//       healthScore: score,
//       results,
//     }
//   }

//   private async verifySPF(domain: string) {
//     const issues: string[] = []
//     let found = false
//     let record: string | undefined
//     let valid = false

//     try {
//       const txtRecords = await dns.resolveTxt(domain)
//       const spfRecord = txtRecords.find((r) => r.join("").startsWith("v=spf1"))

//       if (spfRecord) {
//         found = true
//         record = spfRecord.join("")

//         if (!record.includes("~all") && !record.includes("-all")) {
//           issues.push("SPF record should end with ~all or -all")
//         }

//         if (record.split(" ").length > 10) {
//           issues.push("SPF record has too many mechanisms (max 10 recommended)")
//         }

//         valid = issues.length === 0
//       } else {
//         issues.push("No SPF record found")
//       }
//     } catch (error) {
//       issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }

//     return { found, record, valid, issues }
//   }

//   /**
//    * FIXED: Check user's specific selector FIRST, then fallback
//    */
//   private async verifyDKIM(domain: string, userSelector?: string) {
//     const issues: string[] = []
//     const selectors: string[] = []
//     let valid = false

//     // Priority 1: Check user's specific selector
//     if (userSelector) {
//       try {
//         const dkimDomain = `${userSelector}._domainkey.${domain}`
//         const txtRecords = await dns.resolveTxt(dkimDomain)

//         const dkimRecord = txtRecords.find((r) => {
//           const record = r.join("")
//           return record.includes("v=DKIM1") || record.includes("k=rsa") || record.includes("p=")
//         })

//         if (dkimRecord) {
//           selectors.push(userSelector)
//           valid = true
//           console.log(`✅ DKIM verified for user selector: ${userSelector}`)
//         } else {
//           issues.push(`DKIM record not found for selector '${userSelector}'`)
//         }
//       } catch (error) {
//         issues.push(`DNS lookup failed for selector '${userSelector}': ${error instanceof Error ? error.message : "Unknown"}`)
//       }
//     }

//     // Priority 2: If user's selector failed, scan common ones
//     if (!valid) {
//       const uniqueSelectors = [...new Set(this.COMMON_DKIM_SELECTORS)]
      
//       const results = await Promise.allSettled(
//         uniqueSelectors.map(async (selector) => {
//           try {
//             const dkimDomain = `${selector}._domainkey.${domain}`
//             const txtRecords = await dns.resolveTxt(dkimDomain)

//             const dkimRecord = txtRecords.find((r) => {
//               const record = r.join("")
//               return record.includes("v=DKIM1") || record.includes("k=rsa") || record.includes("p=")
//             })

//             if (dkimRecord) return { selector, found: true }
//             return { selector, found: false }
//           } catch {
//             return { selector, found: false }
//           }
//         }),
//       )

//       for (const result of results) {
//         if (result.status === "fulfilled" && result.value.found) {
//           selectors.push(result.value.selector)
//           valid = true
//         }
//       }
//     }

//     if (selectors.length === 0) {
//       issues.push(
//         userSelector 
//           ? `DKIM not found for '${userSelector}'. Check your email provider's DKIM setup instructions.`
//           : "No DKIM records found. Configure DKIM with your email provider first."
//       )
//     }

//     return { found: selectors.length > 0, selectors, valid, issues }
//   }

//   private async verifyDMARC(domain: string) {
//     const issues: string[] = []
//     let found = false
//     let record: string | undefined
//     let policy: string | undefined
//     let valid = false

//     try {
//       const dmarcDomain = `_dmarc.${domain}`
//       const txtRecords = await dns.resolveTxt(dmarcDomain)
//       const dmarcRecord = txtRecords.find((r) => r.join("").startsWith("v=DMARC1"))

//       if (dmarcRecord) {
//         found = true
//         record = dmarcRecord.join("")

//         const policyMatch = record.match(/p=(none|quarantine|reject)/)
//         if (policyMatch) {
//           policy = policyMatch[1]
//           valid = true

//           if (policy === "none") {
//             issues.push("DMARC policy 'none' is monitoring-only. Consider 'quarantine' or 'reject' for protection.")
//           }
//         } else {
//           issues.push("Invalid DMARC policy")
//         }
//       } else {
//         issues.push("No DMARC record found")
//       }
//     } catch (error) {
//       issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }

//     return { found, record, valid, policy, issues }
//   }

//   private async verifyMXRecords(domain: string) {
//     const records: string[] = []

//     try {
//       if (!domain || typeof domain !== "string" || domain.trim() === "") {
//         return { found: false, records: [] }
//       }

//       const cleanDomain = domain.trim().toLowerCase()
//       const mxRecords = await dns.resolveMx(cleanDomain)

//       if (mxRecords.length > 0) {
//         records.push(...mxRecords.sort((a, b) => a.priority - b.priority).map((mx) => mx.exchange))
//       }
//     } catch (error: any) {
//       console.warn(`[DNS] MX lookup failed for ${domain}: ${error.message}`)
//     }

//     return { found: records.length > 0, records }
//   }

//   async saveVerificationResult(userId: string, domain: string, result: DNSVerificationResult): Promise<void> {
//     await db.domain.upsert({
//       where: { userId_domain: { userId, domain } },
//       create: {
//         userId,
//         domain,
//         isVerified: result.overallValid,
//         verifiedAt: result.overallValid ? new Date() : null,
//         healthScore: result.score,
//         dnsRecords: {
//           spf: result.spf,
//           dkim: result.dkim,
//           dmarc: result.dmarc,
//           mx: result.mx,
//         } as any,
//       },
//       update: {
//         isVerified: result.overallValid,
//         verifiedAt: result.overallValid ? new Date() : null,
//         healthScore: result.score,
//         dnsRecords: {
//           spf: result.spf,
//           dkim: result.dkim,
//           dmarc: result.dmarc,
//           mx: result.mx,
//         } as any,
//         lastVerificationCheck: new Date(),
//         verificationAttempts: { increment: 1 },
//       },
//     })

//     const domainRecord = await db.domain.findUnique({
//       where: { userId_domain: { userId, domain } },
//       include: { deliverabilityHealth: true },
//     })

//     if (domainRecord && !domainRecord.deliverabilityHealth) {
//       await db.deliverabilityHealth.create({
//         data: {
//           domainId: domainRecord.id,
//           spfStatus: result.spf.valid ? "VALID" : result.spf.found ? "INVALID" : "MISSING",
//           spfValid: result.spf.valid,
//           spfRecord: result.spf.record,
//           dkimStatus: result.dkim.valid ? "VALID" : result.dkim.found ? "INVALID" : "MISSING",
//           dkimValid: result.dkim.valid,
//           dkimSelectors: result.dkim.selectors,
//           dmarcStatus: result.dmarc.valid ? "VALID" : result.dmarc.found ? "INVALID" : "MISSING",
//           dmarcValid: result.dmarc.valid,
//           dmarcRecord: result.dmarc.record,
//           dmarcPolicy: result.dmarc.policy,
//           mxRecordsValid: result.mx.found,
//           mxRecords: result.mx.records,
//         },
//       })
//     }
//   }
// }

// export const dnsVerificationService = new DNSVerificationService()

// export const generateDNSRecords = (domain: string, dkimSelector = "default") =>
//   dnsVerificationService.generateDNSRecords(domain, dkimSelector)

// export const verifyDNSRecords = (domain: string, userDkimSelector?: string) => 
//   dnsVerificationService.verifyDNSRecords(domain, userDkimSelector)




import { db } from "../db"
import { DNSStatus } from "@prisma/client"
import dns from "dns/promises"
import crypto from "crypto"

// =============================================================================
// EMAIL PROVIDER DEFINITIONS
// =============================================================================

export interface EmailProvider {
  id: string
  name: string
  icon: string
  dkimSelectors: string[]
  spfInclude: string
  setupUrl: string
  instructions: string[]
  estimatedTime: string
}

export const EMAIL_PROVIDERS: EmailProvider[] = [
  {
    id: "google",
    name: "Google Workspace",
    icon: "google",
    dkimSelectors: ["google", "google1", "google2", "20230601", "20210112"],
    spfInclude: "include:_spf.google.com",
    setupUrl: "https://admin.google.com/ac/apps/gmail/authenticateemail",
    instructions: [
      "Go to Google Admin Console → Apps → Google Workspace → Gmail",
      "Click 'Authenticate email' under 'Setup'",
      "Click 'Generate new record' to create your DKIM key",
      "Add the TXT record to your DNS (Google will provide exact values)",
      "Return to Admin Console and click 'Start authentication'",
    ],
    estimatedTime: "5-10 minutes",
  },
  {
    id: "microsoft",
    name: "Microsoft 365 / Outlook",
    icon: "microsoft",
    dkimSelectors: ["selector1", "selector2"],
    spfInclude: "include:spf.protection.outlook.com",
    setupUrl: "https://security.microsoft.com/dkimv2",
    instructions: [
      "Go to Microsoft 365 Defender → Email & collaboration → Policies → DKIM",
      "Select your domain and click 'Create DKIM keys'",
      "Add both CNAME records Microsoft provides to your DNS",
      "Wait for DNS propagation (5-60 minutes)",
      "Return and click 'Enable' to activate DKIM signing",
    ],
    estimatedTime: "10-15 minutes",
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    icon: "sendgrid",
    dkimSelectors: ["s1", "s2", "smtpapi", "sendgrid"],
    spfInclude: "include:sendgrid.net",
    setupUrl: "https://app.sendgrid.com/settings/sender_auth",
    instructions: [
      "Go to SendGrid → Settings → Sender Authentication",
      "Click 'Authenticate Your Domain'",
      "Enter your domain and choose DNS host",
      "Add the 3 CNAME records SendGrid provides to your DNS",
      "Return to SendGrid and click 'Verify'",
    ],
    estimatedTime: "10-15 minutes",
  },
  {
    id: "mailgun",
    name: "Mailgun",
    icon: "mailgun",
    dkimSelectors: ["smtp", "k1", "mailo", "mailgun"],
    spfInclude: "include:mailgun.org",
    setupUrl: "https://app.mailgun.com/app/sending/domains",
    instructions: [
      "Go to Mailgun → Sending → Domains → Add New Domain",
      "Enter your domain name",
      "Add all DNS records Mailgun provides (SPF, DKIM, MX)",
      "Click 'Verify DNS Settings' after adding records",
    ],
    estimatedTime: "10-15 minutes",
  },
  {
    id: "amazon_ses",
    name: "Amazon SES",
    icon: "aws",
    dkimSelectors: ["amazonses", "ses"],
    spfInclude: "include:amazonses.com",
    setupUrl: "https://console.aws.amazon.com/ses/home#/verified-identities",
    instructions: [
      "Go to Amazon SES Console → Verified identities",
      "Click 'Create identity' and choose 'Domain'",
      "Enable 'Easy DKIM' with 2048-bit key",
      "Add all 3 CNAME records AWS provides to your DNS",
      "Wait for 'Verified' status (usually 1-72 hours)",
    ],
    estimatedTime: "15-20 minutes",
  },
  {
    id: "zoho",
    name: "Zoho Mail",
    icon: "zoho",
    dkimSelectors: ["zoho", "zmail", "default._domainkey"],
    spfInclude: "include:zoho.com",
    setupUrl: "https://mail.zoho.com/cpanel/index.do#mail/settings/dkim",
    instructions: [
      "Go to Zoho Mail Admin Console → Email Authentication → DKIM",
      "Click 'Add Selector' for your domain",
      "Copy the TXT record value Zoho provides",
      "Add the TXT record to your DNS",
      "Return and click 'Verify'",
    ],
    estimatedTime: "5-10 minutes",
  },
  {
    id: "custom",
    name: "Other / Custom SMTP",
    icon: "server",
    dkimSelectors: ["default", "dkim", "mail", "smtp", "k1", "s1"],
    spfInclude: "",
    setupUrl: "",
    instructions: [
      "Contact your email provider for DKIM setup instructions",
      "They will provide a selector name and TXT record value",
      "Add the TXT record to your DNS",
      "Verify with your provider",
    ],
    estimatedTime: "Varies",
  },
]

// =============================================================================
// DNS RECORD TYPES
// =============================================================================

interface DNSRecord {
  type: "TXT" | "CNAME" | "MX"
  name: string
  value: string
  ttl?: number
  selector?: string
  priority?: number
}

interface GeneratedDNSRecords {
  records: DNSRecord[]
  providerId: string
  providerName: string
  selector?: string
}

interface DNSVerificationResult {
  domain: string
  providerId?: string
  spf: {
    found: boolean
    record?: string
    valid: boolean
    issues: string[]
    includes: string[]
  }
  dkim: {
    found: boolean
    selector?: string
    selectors: string[]
    record?: string
    valid: boolean
    issues: string[]
    checkedSelectors: string[]
  }
  dmarc: {
    found: boolean
    record?: string
    valid: boolean
    policy?: string
    issues: string[]
  }
  mx: {
    found: boolean
    records: string[]
  }
  overallValid: boolean
  score: number
  allValid: boolean
  healthScore: number
  results: Array<{
    type: string
    valid: boolean
    message?: string
    details?: string
  }>
  diagnostics: {
    timestamp: Date
    dnsLookupTime: number
    selectorsChecked: number
  }
}

// =============================================================================
// DNS VERIFICATION SERVICE
// =============================================================================

class DNSVerificationService {
  // Extended list of common DKIM selectors across all providers
  private readonly COMMON_DKIM_SELECTORS = [
    // Google
    "google",
    "google1",
    "google2",
    "20230601",
    "20210112",
    "20161025",
    // Microsoft
    "selector1",
    "selector2",
    // SendGrid
    "s1",
    "s2",
    "smtpapi",
    "sendgrid",
    // Mailgun
    "k1",
    "mailo",
    "mailgun",
    "smtp",
    // Amazon SES
    "amazonses",
    // Zoho
    "zoho",
    "zmail",
    // Generic
    "default",
    "dkim",
    "mail",
    "email",
    "mx",
    // Postmark
    "pm",
    "20200720091950pm",
    // Mailchimp/Mandrill
    "k2",
    "k3",
    "mandrill",
    "mcsv",
    // HubSpot
    "hs1",
    "hs2",
    "hubspot",
    // Salesforce
    "sf",
    "sf1",
    "sf2",
    // Custom/Other
    "mail1",
    "mail2",
  ]

  /**
   * Get provider by ID
   */
  getProvider(providerId: string): EmailProvider | undefined {
    return EMAIL_PROVIDERS.find((p) => p.id === providerId)
  }

  /**
   * Get all supported providers
   */
  getAllProviders(): EmailProvider[] {
    return EMAIL_PROVIDERS
  }

  /**
   * Generate DNS records based on email provider
   * NOTE: For DKIM, we now guide users to their provider instead of generating fake records
   */
  generateDNSRecords(domain: string, providerId = "custom"): GeneratedDNSRecords {
    const provider = this.getProvider(providerId) || EMAIL_PROVIDERS.find((p) => p.id === "custom")!

    const records: DNSRecord[] = []

    // SPF Record - customize based on provider
    let spfValue = "v=spf1"
    if (provider.spfInclude) {
      spfValue += ` ${provider.spfInclude}`
    }
    spfValue += " ~all"

    records.push({
      type: "TXT",
      name: "@",
      value: spfValue,
      ttl: 3600,
    })

    // DMARC Record - standard for all providers
    records.push({
      type: "TXT",
      name: "_dmarc",
      value: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${domain}; pct=100`,
      ttl: 3600,
    })

    // NOTE: We no longer generate fake DKIM CNAME records
    // Instead, users must get DKIM from their email provider

    return {
      records,
      selector: provider.dkimSelectors[0] || "default",
      providerId: provider.id,
      providerName: provider.name,
    }
  }

  /**
   * Comprehensive DNS verification with provider-aware DKIM checking
   */
  async verifyDNSRecords(domain: string, providerId?: string, customSelector?: string): Promise<DNSVerificationResult> {
    const startTime = Date.now()

    // Determine which selectors to check first based on provider
    const provider = providerId ? this.getProvider(providerId) : undefined
    let prioritizedSelectors: string[] = []

    if (customSelector) {
      // User provided a specific selector - check it first
      prioritizedSelectors = [customSelector, ...this.COMMON_DKIM_SELECTORS.filter((s) => s !== customSelector)]
    } else if (provider) {
      // Provider-specific selectors first, then common ones
      prioritizedSelectors = [
        ...provider.dkimSelectors,
        ...this.COMMON_DKIM_SELECTORS.filter((s) => !provider.dkimSelectors.includes(s)),
      ]
    } else {
      prioritizedSelectors = this.COMMON_DKIM_SELECTORS
    }

    // Run all verifications in parallel
    const [spfResult, dkimResult, dmarcResult, mxResult] = await Promise.all([
      this.verifySPF(domain, provider),
      this.verifyDKIM(domain, prioritizedSelectors),
      this.verifyDMARC(domain),
      this.verifyMXRecords(domain),
    ])

    // For cold outreach, MX is optional (sending-only domains)
    // But SPF, DKIM, and DMARC are important
    const overallValid = spfResult.valid && dkimResult.valid && dmarcResult.valid

    // Calculate score (0-100)
    let score = 0
    if (spfResult.valid) score += 30
    if (dkimResult.valid) score += 35 // DKIM is most important for deliverability
    if (dmarcResult.valid) score += 25
    if (mxResult.found) score += 10 // MX is nice to have but not critical for sending

    const dnsLookupTime = Date.now() - startTime

    // Build results array for backwards compatibility
    const results = [
      {
        type: "SPF",
        valid: spfResult.valid,
        message: spfResult.valid ? "SPF configured correctly" : "SPF not configured or invalid",
        details: spfResult.record || "No SPF record found",
      },
      {
        type: "DKIM",
        valid: dkimResult.valid,
        message: dkimResult.valid
          ? `DKIM found with selector: ${dkimResult.selector}`
          : "DKIM not found - complete setup in your email provider",
        details: dkimResult.valid
          ? `Selector: ${dkimResult.selector}`
          : `Checked ${dkimResult.checkedSelectors.length} selectors`,
      },
      {
        type: "DMARC",
        valid: dmarcResult.valid,
        message: dmarcResult.valid ? `DMARC policy: ${dmarcResult.policy}` : "DMARC not configured",
        details: dmarcResult.record || "No DMARC record found",
      },
      {
        type: "MX",
        valid: mxResult.found,
        message: mxResult.found
          ? `${mxResult.records.length} MX record(s) found`
          : "No MX records (optional for sending)",
        details: mxResult.records.join(", ") || "No MX records",
      },
    ]

    return {
      domain,
      providerId,
      spf: spfResult,
      dkim: dkimResult,
      dmarc: dmarcResult,
      mx: mxResult,
      overallValid,
      score,
      allValid: overallValid,
      healthScore: score,
      results,
      diagnostics: {
        timestamp: new Date(),
        dnsLookupTime,
        selectorsChecked: dkimResult.checkedSelectors.length,
      },
    }
  }

  /**
   * Verify SPF record with provider-specific validation
   */
  private async verifySPF(domain: string, provider?: EmailProvider) {
    const issues: string[] = []
    const includes: string[] = []
    let found = false
    let record: string | undefined
    let valid = false

    try {
      const txtRecords = await dns.resolveTxt(domain)
      const spfRecord = txtRecords.find((r) => r.join("").toLowerCase().startsWith("v=spf1"))

      if (spfRecord) {
        found = true
        record = spfRecord.join("")

        // Extract all includes
        const includeMatches = record.match(/include:([^\s]+)/g)
        if (includeMatches) {
          includes.push(...includeMatches.map((m) => m.replace("include:", "")))
        }

        // Validate SPF structure
        if (!record.includes("~all") && !record.includes("-all") && !record.includes("?all")) {
          issues.push("SPF should end with ~all (softfail) or -all (hardfail)")
        }

        // Check for provider-specific include
        if (provider?.spfInclude && !record.includes(provider.spfInclude)) {
          issues.push(`Missing ${provider.name} SPF include: ${provider.spfInclude}`)
        }

        // Warn about too many DNS lookups (SPF limit is 10)
        const lookupCount = (record.match(/include:|a:|mx:|ptr:|exists:/g) || []).length
        if (lookupCount > 10) {
          issues.push(`SPF has ${lookupCount} DNS lookups (max 10 allowed)`)
        } else if (lookupCount > 7) {
          issues.push(`SPF has ${lookupCount} DNS lookups (approaching limit of 10)`)
        }

        valid = issues.length === 0 || issues.every((i) => i.includes("approaching") || i.includes("Missing"))
      } else {
        issues.push("No SPF record found for this domain")
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOTFOUND") {
        issues.push("Domain not found - check if domain exists and DNS is configured")
      } else if ((error as NodeJS.ErrnoException).code === "ENODATA") {
        issues.push("No TXT records found for this domain")
      } else {
        issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    return { found, record, valid, issues, includes }
  }

  /**
   * Verify DKIM with prioritized selector checking
   */
  private async verifyDKIM(domain: string, selectors: string[]) {
    const issues: string[] = []
    const foundSelectors: string[] = []
    const checkedSelectors: string[] = []
    let valid = false
    let foundSelector: string | undefined
    let foundRecord: string | undefined

    // Check selectors in order (prioritized based on provider)
    for (const selector of selectors) {
      checkedSelectors.push(selector)

      try {
        const dkimDomain = `${selector}._domainkey.${domain}`
        const txtRecords = await dns.resolveTxt(dkimDomain)
        const dkimRecord = txtRecords.find((r) => r.join("").toLowerCase().includes("v=dkim1"))

        if (dkimRecord) {
          const record = dkimRecord.join("")
          foundSelectors.push(selector)

          // Validate DKIM record structure
          if (record.includes("p=")) {
            // Found a valid DKIM record
            if (!foundSelector) {
              foundSelector = selector
              foundRecord = record
            }

            // Check key length (2048-bit recommended)
            const publicKey = record.match(/p=([^;]+)/)?.[1]
            if (publicKey && publicKey.length < 200) {
              issues.push(`DKIM key for ${selector} may be too short (recommend 2048-bit)`)
            }
          }
        }
      } catch {
        // Selector not found, continue to next
      }

      // Early exit if we found a valid selector
      if (foundSelector && foundSelectors.length > 0) {
        valid = true
        break
      }
    }

    if (foundSelectors.length === 0) {
      issues.push("No DKIM records found")
      issues.push("Complete DKIM setup in your email provider first")
      issues.push("Then return here to verify")
    }

    return {
      found: foundSelectors.length > 0,
      selector: foundSelector,
      selectors: foundSelectors,
      record: foundRecord,
      valid,
      issues,
      checkedSelectors,
    }
  }

  /**
   * Verify DMARC record
   */
  private async verifyDMARC(domain: string) {
    const issues: string[] = []
    let found = false
    let record: string | undefined
    let policy: string | undefined
    let valid = false

    try {
      const dmarcDomain = `_dmarc.${domain}`
      const txtRecords = await dns.resolveTxt(dmarcDomain)
      const dmarcRecord = txtRecords.find((r) => r.join("").toLowerCase().startsWith("v=dmarc1"))

      if (dmarcRecord) {
        found = true
        record = dmarcRecord.join("")

        const policyMatch = record.match(/p=(none|quarantine|reject)/i)
        if (policyMatch) {
          policy = policyMatch[1].toLowerCase()

          if (policy === "none") {
            issues.push("DMARC policy is 'none' - emails won't be rejected but you can monitor")
          }

          // Check for rua (aggregate reports)
          if (!record.includes("rua=")) {
            issues.push("Consider adding rua= for DMARC reports")
          }

          valid = true
        } else {
          issues.push("Invalid DMARC policy - must be none, quarantine, or reject")
        }
      } else {
        issues.push("No DMARC record found")
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENODATA") {
        issues.push("No DMARC record found - add a TXT record at _dmarc.yourdomain.com")
      } else {
        issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    return { found, record, valid, policy, issues }
  }

  /**
   * Verify MX records
   */
  private async verifyMXRecords(domain: string) {
    const records: string[] = []

    try {
      const mxRecords = await dns.resolveMx(domain)
      if (mxRecords.length > 0) {
        records.push(...mxRecords.sort((a, b) => a.priority - b.priority).map((mx) => `${mx.priority} ${mx.exchange}`))
      }
    } catch {
      // MX records are optional for sending-only domains
    }

    return {
      found: records.length > 0,
      records,
    }
  }

  /**
   * Check a specific DKIM selector (for manual input)
   */
  async checkCustomSelector(
    domain: string,
    selector: string,
  ): Promise<{
    found: boolean
    valid: boolean
    record?: string
    error?: string
  }> {
    try {
      const dkimDomain = `${selector}._domainkey.${domain}`
      const txtRecords = await dns.resolveTxt(dkimDomain)
      const dkimRecord = txtRecords.find((r) => r.join("").toLowerCase().includes("v=dkim1"))

      if (dkimRecord) {
        const record = dkimRecord.join("")
        const hasPublicKey = record.includes("p=")
        return {
          found: true,
          valid: hasPublicKey,
          record,
        }
      }

      return { found: false, valid: false }
    } catch (error) {
      return {
        found: false,
        valid: false,
        error: error instanceof Error ? error.message : "Lookup failed",
      }
    }
  }

  /**
   * Generate a unique DKIM selector (for future self-hosted email)
   */
  generateDKIMSelector(): string {
    return `reach${crypto.randomBytes(4).toString("hex")}`
  }

  /**
   * Store verification result in database
   */
  async saveVerificationResult(
    userId: string,
    domain: string,
    result: DNSVerificationResult,
    providerId?: string,
  ): Promise<void> {
    // Create or update Domain record
    await db.domain.upsert({
      where: {
        userId_domain: { userId, domain },
      },
      create: {
        userId,
        domain,
        isVerified: result.overallValid,
        verifiedAt: result.overallValid ? new Date() : null,
        healthScore: result.score,
        emailProviderId: providerId,
        dnsRecords: {
          spf: result.spf,
          dkim: result.dkim,
          dmarc: result.dmarc,
          mx: result.mx,
        },
      },
      update: {
        isVerified: result.overallValid,
        verifiedAt: result.overallValid ? new Date() : null,
        healthScore: result.score,
        emailProviderId: providerId,
        dnsRecords: {
          spf: result.spf,
          dkim: result.dkim,
          dmarc: result.dmarc,
          mx: result.mx,
        },
        lastVerificationCheck: new Date(),
        verificationAttempts: { increment: 1 },
      },
    })

    // Update deliverability health
    const domainRecord = await db.domain.findUnique({
      where: { userId_domain: { userId, domain } },
      include: { deliverabilityHealth: true },
    })

    // if (domainRecord) {
    //   const healthData = {
    //     spfStatus: result.spf.valid ? "VALID" : result.spf.found ? "INVALID" : "MISSING",
    //     spfValid: result.spf.valid,
    //     spfRecord: result.spf.record,
    //     dkimStatus: result.dkim.valid ? "VALID" : result.dkim.found ? "INVALID" : "MISSING",
    //     dkimValid: result.dkim.valid,
    //     dkimSelectors: result.dkim.selectors,
    //     dmarcStatus: result.dmarc.valid ? "VALID" : result.dmarc.found ? "INVALID" : "MISSING",
    //     dmarcValid: result.dmarc.valid,
    //     dmarcRecord: result.dmarc.record,
    //     dmarcPolicy: result.dmarc.policy,
    //     mxRecordsValid: result.mx.found,
    //     mxRecords: result.mx.records,
    //     lastFullCheck: new Date(),
    //   }

    //   if (domainRecord.deliverabilityHealth) {
    //     await db.deliverabilityHealth.update({
    //       where: { domainId: domainRecord.id },
    //       data: healthData,
    //     })
    //   } else {
    //     await db.deliverabilityHealth.create({
    //       data: { domainId: domainRecord.id, ...healthData },
    //     })
    //   }
    // }
    

    // ... then later in the code:

    if (domainRecord) {
      const healthData = {
        spfStatus: result.spf.valid ? DNSStatus.VALID : result.spf.found ? DNSStatus.INVALID : DNSStatus.MISSING,
        spfValid: result.spf.valid,
        spfRecord: result.spf.record,
        dkimStatus: result.dkim.valid ? DNSStatus.VALID : result.dkim.found ? DNSStatus.INVALID : DNSStatus.MISSING,
        dkimValid: result.dkim.valid,
        dkimSelectors: result.dkim.selectors,
        dmarcStatus: result.dmarc.valid ? DNSStatus.VALID : result.dmarc.found ? DNSStatus.INVALID : DNSStatus.MISSING,
        dmarcValid: result.dmarc.valid,
        dmarcRecord: result.dmarc.record,
        dmarcPolicy: result.dmarc.policy,
        mxRecordsValid: result.mx.found,
        mxRecords: result.mx.records,
        lastFullCheck: new Date(),
      }

      if (domainRecord.deliverabilityHealth) {
        await db.deliverabilityHealth.update({
          where: { domainId: domainRecord.id },
          data: healthData,
        })
      } else {
        await db.deliverabilityHealth.create({
          data: { domainId: domainRecord.id, ...healthData },
        })
      }
    }
  }
}

export const dnsVerificationService = new DNSVerificationService()

// Export helper functions for backwards compatibility
export function generateDNSRecords(domain: string, providerId?: string) {
  return dnsVerificationService.generateDNSRecords(domain, providerId)
}

export function verifyDNSRecords(domain: string, providerId?: string, customSelector?: string) {
  return dnsVerificationService.verifyDNSRecords(domain, providerId, customSelector)
}

export function getEmailProviders() {
  return dnsVerificationService.getAllProviders()
}

export function getEmailProvider(providerId: string) {
  return dnsVerificationService.getProvider(providerId)
}

export function checkCustomDKIMSelector(domain: string, selector: string) {
  return dnsVerificationService.checkCustomSelector(domain, selector)
}
