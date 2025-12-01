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
import dns from "dns/promises"

interface DNSRecord {
  type: "TXT" | "CNAME" | "MX"
  name: string
  value: string
  ttl?: number
  selector?: string
}

interface GeneratedDNSRecords {
  records: DNSRecord[]
  selector: string
  provider: string
}

interface DNSVerificationResult {
  domain: string
  spf: {
    found: boolean
    record?: string
    valid: boolean
    issues: string[]
  }
  dkim: {
    found: boolean
    selectors: string[]
    valid: boolean
    issues: string[]
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
  }>
  propagationStatus?: {
    spf: boolean
    dkim: boolean
    dmarc: boolean
  }
}

interface EmailProvider {
  id: string
  name: string
  dkimType: "CNAME" | "TXT"
  spfInclude?: string
  defaultSelector: string
  setupUrl?: string
  instructions: string
}

class DNSVerificationService {
  private readonly EMAIL_PROVIDERS: Record<string, EmailProvider> = {
    sendgrid: {
      id: "sendgrid",
      name: "SendGrid",
      dkimType: "CNAME",
      spfInclude: "sendgrid.net",
      defaultSelector: "s1",
      setupUrl: "https://app.sendgrid.com/settings/sender_auth",
      instructions: "Complete SendGrid domain authentication first, then copy the records here",
    },
    gmail: {
      id: "gmail",
      name: "Google Workspace",
      dkimType: "TXT",
      spfInclude: "_spf.google.com",
      defaultSelector: "google",
      setupUrl: "https://admin.google.com",
      instructions: "Generate DKIM key in Google Admin Console under Apps > Google Workspace > Gmail > Authenticate email",
    },
    outlook: {
      id: "outlook",
      name: "Microsoft 365",
      dkimType: "CNAME",
      spfInclude: "spf.protection.outlook.com",
      defaultSelector: "selector1",
      setupUrl: "https://admin.microsoft.com",
      instructions: "Enable DKIM signing in Microsoft 365 admin center under Threat management > DKIM",
    },
    mailgun: {
      id: "mailgun",
      name: "Mailgun",
      dkimType: "TXT",
      spfInclude: "mailgun.org",
      defaultSelector: "mx",
      setupUrl: "https://app.mailgun.com/app/sending/domains",
      instructions: "Get DKIM records from Mailgun dashboard under Sending > Domains",
    },
    postmark: {
      id: "postmark",
      name: "Postmark",
      dkimType: "TXT",
      spfInclude: "spf.mtasv.net",
      defaultSelector: "pm",
      setupUrl: "https://account.postmarkapp.com/signature_domains",
      instructions: "Get DKIM records from Postmark Sender Signatures page",
    },
    ses: {
      id: "ses",
      name: "Amazon SES",
      dkimType: "CNAME",
      spfInclude: "amazonses.com",
      defaultSelector: "amazonses",
      setupUrl: "https://console.aws.amazon.com/ses",
      instructions: "Enable Easy DKIM in AWS SES console for your verified domain",
    },
    custom: {
      id: "custom",
      name: "Custom / Other",
      dkimType: "TXT",
      defaultSelector: "default",
      instructions: "Contact your email service provider for specific DNS records",
    },
  }

  private readonly DNS_PROVIDERS = {
    cloudflare: {
      nameservers: ["cloudflare.com"],
      notes: {
        dkim: "Enter the full subdomain including your domain (e.g., selector._domainkey.yourdomain.com)",
        spf: "Use @ for root domain",
        flatten: true,
      },
    },
    godaddy: {
      nameservers: ["domaincontrol.com"],
      notes: {
        dkim: "DO NOT include your domain in the Name field - GoDaddy adds it automatically",
        spf: "Use @ for root domain",
        flatten: false,
      },
    },
    namecheap: {
      nameservers: ["namecheaphosting.com", "registrar-servers.com"],
      notes: {
        dkim: "Enter only the subdomain part (e.g., selector._domainkey) - Namecheap adds the domain",
        spf: "Use @ for root domain",
        flatten: false,
      },
    },
    route53: {
      nameservers: ["awsdns"],
      notes: {
        dkim: "Enter the full FQDN with trailing dot (e.g., selector._domainkey.yourdomain.com.)",
        spf: "Use the domain name itself for root domain",
        flatten: false,
      },
    },
  }

  /**
   * Detect DNS provider from nameservers
   */
  async detectDNSProvider(domain: string): Promise<{ provider: string; notes: any } | null> {
    try {
      const nameservers = await dns.resolveNs(domain)
      const nsString = nameservers.join(" ").toLowerCase()

      for (const [provider, config] of Object.entries(this.DNS_PROVIDERS)) {
        if (config.nameservers.some((ns) => nsString.includes(ns))) {
          return { provider, notes: config.notes }
        }
      }

      return null
    } catch (error) {
      console.warn(`Could not detect DNS provider for ${domain}`)
      return null
    }
  }

  /**
   * Generate provider-specific DNS records
   */
  generateDNSRecords(
    domain: string,
    emailProvider: string = "sendgrid",
    customSelector?: string,
  ): GeneratedDNSRecords {
    const provider = this.EMAIL_PROVIDERS[emailProvider] || this.EMAIL_PROVIDERS.custom
    const selector = customSelector || provider.defaultSelector

    const records: DNSRecord[] = []

    // SPF Record
    if (provider.spfInclude) {
      records.push({
        type: "TXT",
        name: "@",
        value: `v=spf1 include:${provider.spfInclude} ~all`,
        ttl: 3600,
      })
    } else {
      records.push({
        type: "TXT",
        name: "@",
        value: `v=spf1 ~all`,
        ttl: 3600,
      })
    }

    // DKIM Record
    if (provider.dkimType === "CNAME" && provider.spfInclude) {
      records.push({
        type: "CNAME",
        name: `${selector}._domainkey`,
        value: `${selector}.${provider.spfInclude}`,
        ttl: 3600,
        selector,
      })
    } else {
      records.push({
        type: "TXT",
        name: `${selector}._domainkey`,
        value: `v=DKIM1; k=rsa; p=PASTE_YOUR_PUBLIC_KEY_HERE`,
        ttl: 3600,
        selector,
      })
    }

    // DMARC Record
    records.push({
      type: "TXT",
      name: "_dmarc",
      value: `v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain}; pct=100; fo=1`,
      ttl: 3600,
    })

    return {
      records,
      selector,
      provider: emailProvider,
    }
  }

  /**
   * Check DNS propagation across multiple servers
   */
  async checkDNSPropagation(domain: string, recordType: string, recordName: string): Promise<boolean> {
    const dnsServers = [
      "8.8.8.8", // Google
      "1.1.1.1", // Cloudflare
      "208.67.222.222", // OpenDNS
    ]

    const results = await Promise.allSettled(
      dnsServers.map(async (server) => {
        try {
          dns.setServers([server])
          if (recordType === "TXT") {
            await dns.resolveTxt(recordName)
          } else if (recordType === "CNAME") {
            await dns.resolveCname(recordName)
          }
          return true
        } catch {
          return false
        }
      }),
    )

    // Reset to default DNS servers
    dns.setServers([])

    const successCount = results.filter((r) => r.status === "fulfilled" && r.value).length
    return successCount >= 2 // Propagated if 2+ servers can see it
  }

  /**
   * Comprehensive DNS verification with propagation status
   */
  async verifyDNSRecords(domain: string, userDkimSelector?: string): Promise<DNSVerificationResult> {
    const [spfResult, dkimResult, dmarcResult, mxResult] = await Promise.all([
      this.verifySPF(domain),
      this.verifyDKIM(domain, userDkimSelector),
      this.verifyDMARC(domain),
      this.verifyMXRecords(domain),
    ])

    // Check propagation status
    const propagationStatus = {
      spf: await this.checkDNSPropagation(domain, "TXT", domain),
      dkim: userDkimSelector
        ? await this.checkDNSPropagation(domain, "TXT", `${userDkimSelector}._domainkey.${domain}`)
        : false,
      dmarc: await this.checkDNSPropagation(domain, "TXT", `_dmarc.${domain}`),
    }

    const overallValid = spfResult.valid && dkimResult.valid && dmarcResult.valid && mxResult.found

    let score = 0
    if (spfResult.valid) score += 25
    if (dkimResult.valid) score += 25
    if (dmarcResult.valid) score += 25
    if (mxResult.found) score += 25

    const results = [
      {
        type: "SPF",
        valid: spfResult.valid,
        message: spfResult.issues.join(", ") || "SPF configured correctly",
      },
      {
        type: "DKIM",
        valid: dkimResult.valid,
        message:
          dkimResult.issues.join(", ") || `DKIM verified for selector(s): ${dkimResult.selectors.join(", ")}`,
      },
      {
        type: "DMARC",
        valid: dmarcResult.valid,
        message: dmarcResult.issues.join(", ") || "DMARC configured correctly",
      },
      {
        type: "MX",
        valid: mxResult.found,
        message: mxResult.found ? `MX records found: ${mxResult.records.slice(0, 2).join(", ")}` : "No MX records",
      },
    ]

    return {
      domain,
      spf: spfResult,
      dkim: dkimResult,
      dmarc: dmarcResult,
      mx: mxResult,
      overallValid,
      score,
      allValid: overallValid,
      healthScore: score,
      results,
      propagationStatus,
    }
  }

  private async verifySPF(domain: string) {
    const issues: string[] = []
    let found = false
    let record: string | undefined
    let valid = false

    try {
      const txtRecords = await dns.resolveTxt(domain)
      const spfRecord = txtRecords.find((r) => r.join("").startsWith("v=spf1"))

      if (spfRecord) {
        found = true
        record = spfRecord.join("")

        if (!record.includes("~all") && !record.includes("-all") && !record.includes("+all")) {
          issues.push("SPF record should end with ~all (soft fail) or -all (hard fail)")
        }

        const mechanisms = record.split(" ").filter((m) => m.startsWith("include:") || m.startsWith("a:"))
        if (mechanisms.length > 10) {
          issues.push(`SPF has ${mechanisms.length} lookups (max 10 recommended to avoid "permerror")`)
        }

        if (record.includes("+all")) {
          issues.push("SPF uses +all which allows anyone to send - this is insecure")
        }

        valid = issues.length === 0
      } else {
        issues.push("No SPF record found - add a TXT record with v=spf1")
      }
    } catch (error) {
      issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    return { found, record, valid, issues }
  }

  private async verifyDKIM(domain: string, userSelector?: string) {
    const issues: string[] = []
    const selectors: string[] = []
    let valid = false

    // Priority 1: Check user's specific selector FIRST
    if (userSelector) {
      try {
        const dkimDomain = `${userSelector}._domainkey.${domain}`
        
        // Try CNAME first
        try {
          await dns.resolveCname(dkimDomain)
          selectors.push(userSelector)
          valid = true
          console.log(`✅ DKIM CNAME found for selector: ${userSelector}`)
        } catch {
          // Try TXT
          const txtRecords = await dns.resolveTxt(dkimDomain)
          const dkimRecord = txtRecords.find((r) => {
            const record = r.join("")
            return record.includes("v=DKIM1") || record.includes("k=rsa") || record.includes("p=")
          })

          if (dkimRecord) {
            selectors.push(userSelector)
            valid = true
            console.log(`✅ DKIM TXT found for selector: ${userSelector}`)
          }
        }

        if (!valid) {
          issues.push(
            `DKIM record not found for '${userSelector}._domainkey.${domain}'. Check: 1) Record was added, 2) Name field is correct, 3) DNS has propagated (wait 1-4 hours)`,
          )
        }
      } catch (error) {
        issues.push(
          `Cannot verify DKIM for selector '${userSelector}': ${error instanceof Error ? error.message : "Unknown error"}`,
        )
      }
    }

    // Priority 2: If user's selector failed, scan common selectors
    if (!valid) {
      const commonSelectors = [
        "default",
        "google",
        "selector1",
        "selector2",
        "s1",
        "s2",
        "k1",
        "mail",
        "dkim",
        "mx",
        "pm",
      ]

      const results = await Promise.allSettled(
        commonSelectors.map(async (selector) => {
          try {
            const dkimDomain = `${selector}._domainkey.${domain}`

            // Try CNAME
            try {
              await dns.resolveCname(dkimDomain)
              return { selector, found: true }
            } catch {
              // Try TXT
              const txtRecords = await dns.resolveTxt(dkimDomain)
              const dkimRecord = txtRecords.find((r) => {
                const record = r.join("")
                return record.includes("v=DKIM1") || record.includes("k=rsa") || record.includes("p=")
              })

              if (dkimRecord) return { selector, found: true }
            }

            return { selector, found: false }
          } catch {
            return { selector, found: false }
          }
        }),
      )

      for (const result of results) {
        if (result.status === "fulfilled" && result.value.found) {
          selectors.push(result.value.selector)
          valid = true
        }
      }

      if (!valid && selectors.length === 0) {
        issues.push(
          userSelector
            ? `No DKIM found for '${userSelector}' or common selectors. Verify your email provider's DKIM setup.`
            : "No DKIM records found. Configure DKIM with your email provider first, then add DNS records.",
        )
      }
    }

    return { found: selectors.length > 0, selectors, valid, issues }
  }

  private async verifyDMARC(domain: string) {
    const issues: string[] = []
    let found = false
    let record: string | undefined
    let policy: string | undefined
    let valid = false

    try {
      const dmarcDomain = `_dmarc.${domain}`
      const txtRecords = await dns.resolveTxt(dmarcDomain)
      const dmarcRecord = txtRecords.find((r) => r.join("").startsWith("v=DMARC1"))

      if (dmarcRecord) {
        found = true
        record = dmarcRecord.join("")

        const policyMatch = record.match(/p=(none|quarantine|reject)/i)
        if (policyMatch) {
          policy = policyMatch[1].toLowerCase()
          valid = true

          if (policy === "none") {
            issues.push(
              "DMARC policy is 'none' (monitoring only). Consider 'quarantine' for better protection once you verify legitimate emails work.",
            )
          }
        } else {
          issues.push("DMARC record found but policy (p=) is missing or invalid")
        }

        if (!record.includes("rua=")) {
          issues.push("Consider adding rua= to receive aggregate reports about your email authentication")
        }
      } else {
        issues.push("No DMARC record found at _dmarc.{domain} - add a TXT record with v=DMARC1")
      }
    } catch (error) {
      issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    return { found, record, valid, policy, issues }
  }

  private async verifyMXRecords(domain: string) {
    const records: string[] = []

    try {
      if (!domain || typeof domain !== "string" || domain.trim() === "") {
        return { found: false, records: [] }
      }

      const cleanDomain = domain.trim().toLowerCase()
      const mxRecords = await dns.resolveMx(cleanDomain)

      if (mxRecords.length > 0) {
        records.push(...mxRecords.sort((a, b) => a.priority - b.priority).map((mx) => mx.exchange))
      }
    } catch (error: any) {
      console.warn(`[DNS] MX lookup failed for ${domain}: ${error.message}`)
    }

    return { found: records.length > 0, records }
  }

  /**
   * Pre-validation before full verification
   */
  async preValidateDomain(domain: string): Promise<{ canProceed: boolean; error?: string }> {
    try {
      // Check if domain exists in DNS
      const mxRecords = await this.verifyMXRecords(domain)

      if (!mxRecords.found) {
        return {
          canProceed: false,
          error:
            "No MX records found. This domain may not be set up for email. Please verify this is the correct domain.",
        }
      }

      return { canProceed: true }
    } catch (error) {
      return {
        canProceed: false,
        error: "Domain not found in DNS. Please check the domain name and try again.",
      }
    }
  }

  async saveVerificationResult(userId: string, domain: string, result: DNSVerificationResult): Promise<void> {
    await db.domain.upsert({
      where: { userId_domain: { userId, domain } },
      create: {
        userId,
        domain,
        isVerified: result.overallValid,
        verifiedAt: result.overallValid ? new Date() : null,
        healthScore: result.score,
        dnsRecords: {
          spf: result.spf,
          dkim: result.dkim,
          dmarc: result.dmarc,
          mx: result.mx,
          propagationStatus: result.propagationStatus,
        } as any,
      },
      update: {
        isVerified: result.overallValid,
        verifiedAt: result.overallValid ? new Date() : null,
        healthScore: result.score,
        dnsRecords: {
          spf: result.spf,
          dkim: result.dkim,
          dmarc: result.dmarc,
          mx: result.mx,
          propagationStatus: result.propagationStatus,
        } as any,
        lastVerificationCheck: new Date(),
        verificationAttempts: { increment: 1 },
      },
    })

    const domainRecord = await db.domain.findUnique({
      where: { userId_domain: { userId, domain } },
      include: { deliverabilityHealth: true },
    })

    if (domainRecord && !domainRecord.deliverabilityHealth) {
      await db.deliverabilityHealth.create({
        data: {
          domainId: domainRecord.id,
          spfStatus: result.spf.valid ? "VALID" : result.spf.found ? "INVALID" : "MISSING",
          spfValid: result.spf.valid,
          spfRecord: result.spf.record,
          dkimStatus: result.dkim.valid ? "VALID" : result.dkim.found ? "INVALID" : "MISSING",
          dkimValid: result.dkim.valid,
          dkimSelectors: result.dkim.selectors,
          dmarcStatus: result.dmarc.valid ? "VALID" : result.dmarc.found ? "INVALID" : "MISSING",
          dmarcValid: result.dmarc.valid,
          dmarcRecord: result.dmarc.record,
          dmarcPolicy: result.dmarc.policy,
          mxRecordsValid: result.mx.found,
          mxRecords: result.mx.records,
        },
      })
    }
  }

  getEmailProviders(): EmailProvider[] {
    return Object.values(this.EMAIL_PROVIDERS)
  }

  getEmailProvider(id: string): EmailProvider | undefined {
    return this.EMAIL_PROVIDERS[id]
  }
}

export const dnsVerificationService = new DNSVerificationService()

export const generateDNSRecords = (domain: string, emailProvider = "sendgrid", customSelector?: string) =>
  dnsVerificationService.generateDNSRecords(domain, emailProvider, customSelector)

export const verifyDNSRecords = (domain: string, userDkimSelector?: string) =>
  dnsVerificationService.verifyDNSRecords(domain, userDkimSelector)

export const preValidateDomain = (domain: string) => dnsVerificationService.preValidateDomain(domain)

export const detectDNSProvider = (domain: string) => dnsVerificationService.detectDNSProvider(domain)

export const getEmailProviders = () => dnsVerificationService.getEmailProviders()

export const getEmailProvider = (id: string) => dnsVerificationService.getEmailProvider(id)