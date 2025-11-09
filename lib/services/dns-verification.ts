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


import { db } from "../db"
import dns from "dns/promises"
import crypto from "crypto"

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
}

class DNSVerificationService {
  private readonly COMMON_DKIM_SELECTORS = [
    "default",
    "google",
    "k1",
    "s1",
    "s2",
    "dkim",
    "mail",
    "smtp",
    "selector1",
    "selector2",
  ]

  /**
   * Generate DNS records needed for domain verification
   */
  generateDNSRecords(domain: string, dkimSelector = "default"): GeneratedDNSRecords {
    const records: DNSRecord[] = [
      {
        type: "TXT",
        name: "@",
        value: `v=spf1 include:sendgrid.net ~all`,
        ttl: 3600,
      },
      {
        type: "CNAME",
        name: `${dkimSelector}._domainkey`,
        value: `${dkimSelector}.sendgrid.net`,
        ttl: 3600,
        selector: dkimSelector,
      },
      {
        type: "TXT",
        name: "_dmarc",
        value: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${domain}; ruf=mailto:dmarc-forensics@${domain}; pct=25`,
        ttl: 3600,
      },
    ]

    return {
      records,
      selector: dkimSelector,
    }
  }

  /**
   * Comprehensive DNS verification
   */
  async verifyDNSRecords(domain: string): Promise<DNSVerificationResult> {
    const [spfResult, dkimResult, dmarcResult, mxResult] = await Promise.all([
      this.verifySPF(domain),
      this.verifyDKIM(domain),
      this.verifyDMARC(domain),
      this.verifyMXRecords(domain),
    ])

    const overallValid = spfResult.valid && dkimResult.valid && dmarcResult.valid && mxResult.found

    // Calculate score (0-100)
    let score = 0
    if (spfResult.valid) score += 25
    if (dkimResult.valid) score += 25
    if (dmarcResult.valid) score += 25
    if (mxResult.found) score += 25

    const results = [
      {
        type: "SPF",
        valid: spfResult.valid,
        message: spfResult.issues.join(", "),
      },
      {
        type: "DKIM",
        valid: dkimResult.valid,
        message: dkimResult.issues.join(", "),
      },
      {
        type: "DMARC",
        valid: dmarcResult.valid,
        message: dmarcResult.issues.join(", "),
      },
      {
        type: "MX",
        valid: mxResult.found,
        message: mxResult.found ? "MX records found" : "No MX records",
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

        if (!record.includes("~all") && !record.includes("-all")) {
          issues.push("SPF record should end with ~all or -all")
        }

        if (record.split(" ").length > 10) {
          issues.push("SPF record has too many mechanisms (max 10 recommended)")
        }

        valid = issues.length === 0
      } else {
        issues.push("No SPF record found")
      }
    } catch (error) {
      issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    return { found, record, valid, issues }
  }

  private async verifyDKIM(domain: string) {
    const issues: string[] = []
    const selectors: string[] = []
    let valid = false

    for (const selector of this.COMMON_DKIM_SELECTORS) {
      try {
        const dkimDomain = `${selector}._domainkey.${domain}`
        const txtRecords = await dns.resolveTxt(dkimDomain)

        const hasDKIM = txtRecords.some((r) => r.join("").includes("v=DKIM1"))

        if (hasDKIM) {
          selectors.push(selector)
        }
      } catch {
        // Selector not found, continue
      }
    }

    if (selectors.length === 0) {
      issues.push("No DKIM records found for common selectors")
    } else {
      valid = true
    }

    return {
      found: selectors.length > 0,
      selectors,
      valid,
      issues,
    }
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

        const policyMatch = record.match(/p=(none|quarantine|reject)/)
        if (policyMatch) {
          policy = policyMatch[1]

          if (policy === "none") {
            issues.push("DMARC policy is set to 'none' - consider using 'quarantine' or 'reject'")
          }

          valid = true
        } else {
          issues.push("Invalid DMARC policy")
        }
      } else {
        issues.push("No DMARC record found")
      }
    } catch (error) {
      issues.push(`DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    return {
      found,
      record,
      valid,
      policy,
      issues,
    }
  }

  private async verifyMXRecords(domain: string) {
    const records: string[] = []

    try {
      if (!domain || typeof domain !== "string") {
        throw new Error("Invalid domain provided for MX lookup")
      }

      const mxRecords = await dns.resolveMx(domain)

      if (mxRecords.length === 0) {
        console.warn(`[DNS] No MX records found for ${domain}`)
      } else {
        records.push(...mxRecords.sort((a, b) => a.priority - b.priority).map((mx) => mx.exchange))
      }
    } catch (error) {
      console.error(`[DNS] MX record lookup failed for ${domain}:`, error)
      // Don't throw - just return empty records
    }

    return {
      found: records.length > 0,
      records,
    }
  }

  /**
   * Generate a unique DKIM selector for this domain
   */
  generateDKIMSelector(): string {
    return `reach${crypto.randomBytes(4).toString("hex")}`
  }

  /**
   * Store verification result in database
   */
  async saveVerificationResult(userId: string, domain: string, result: DNSVerificationResult): Promise<void> {
    await db.domain.upsert({
      where: {
        userId_domain: {
          userId,
          domain,
        },
      },
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
        } as any,
        lastVerificationCheck: new Date(),
        verificationAttempts: {
          increment: 1,
        },
      },
    })

    const domainRecord = await db.domain.findUnique({
      where: {
        userId_domain: {
          userId,
          domain,
        },
      },
      include: {
        deliverabilityHealth: true,
      },
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
}

export const dnsVerificationService = new DNSVerificationService()

export const generateDNSRecords = (domain: string, dkimSelector = "default") =>
  dnsVerificationService.generateDNSRecords(domain, dkimSelector)

export const verifyDNSRecords = (domain: string) => dnsVerificationService.verifyDNSRecords(domain)

export const generateDKIMSelector = () => dnsVerificationService.generateDKIMSelector()
