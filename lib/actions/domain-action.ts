// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import { generateDNSRecords, verifyDNSRecords } from "@/lib/services/dns-verification"
// import { updateDeliverabilityHealth } from "@/lib/services/deliverability-alerts"

// /**
//  * Add a new domain with DNS setup guidance
//  */
// export async function addDomain(domain: string, recordType: "subdomain" | "main" = "subdomain") {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   // Check if domain already exists
//   const existing = await db.domain.findUnique({
//     where: { userId_domain: { userId: user.id, domain } },
//   })

//   if (existing) {
//     throw new Error("Domain already exists")
//   }

//   // Generate DNS records
//   const dnsRecords = await generateDNSRecords(domain)

//   // Create domain
//   const newDomain = await db.domain.create({
//     data: {
//       userId: user.id,
//       domain,
//       recordType,
//       dnsRecords,
//       isVerified: false,
//     },
//   })

//   // Create verification records
//   for (const record of dnsRecords.records) {
//     await db.domainVerificationRecord.create({
//       data: {
//         userId: user.id,
//         domain,
//         recordType: record.type,
//         recordName: record.name,
//         recordValue: record.value,
//         selector: record.selector,
//       },
//     })
//   }

//   revalidatePath("/dashboard/deliverability")
//   revalidatePath("/dashboard/settings")

//   return { success: true, domainId: newDomain.id, dnsRecords }
// }

// /**
//  * Verify domain DNS records
//  */
// export async function verifyDomain(domainId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const domain = await db.domain.findUnique({
//     where: { id: domainId, userId: user.id },
//   })

//   if (!domain) throw new Error("Domain not found")

//   // Verify DNS records
//   const verification = await verifyDNSRecords(domain.domain)

//   // Update domain
//   await db.domain.update({
//     where: { id: domainId },
//     data: {
//       isVerified: verification.allValid,
//       verifiedAt: verification.allValid ? new Date() : null,
//       verificationAttempts: domain.verificationAttempts + 1,
//       lastVerificationCheck: new Date(),
//       healthScore: verification.healthScore,
//     },
//   })

//   // Update verification records
//   for (const result of verification.results) {
//     await db.domainVerificationRecord.updateMany({
//       where: {
//         userId: user.id,
//         domain: domain.domain,
//         recordType: result.type,
//       },
//       data: {
//         isVerified: result.valid,
//         verifiedAt: result.valid ? new Date() : null,
//       },
//     })
//   }

//   // Create or update deliverability health
//   await updateDeliverabilityHealth(domainId)

//   revalidatePath("/dashboard/deliverability")
//   revalidatePath("/dashboard/settings")

//   return {
//     success: true,
//     verified: verification.allValid,
//     results: verification.results,
//     healthScore: verification.healthScore,
//   }
// }

// /**
//  * Get domain with DNS records
//  */
// export async function getDomainDetails(domainId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const domain = await db.domain.findUnique({
//     where: { id: domainId, userId: user.id },
//     include: {
//       deliverabilityHealth: true,
//       sendingAccounts: true,
//     },
//   })

//   if (!domain) throw new Error("Domain not found")

//   const verificationRecords = await db.domainVerificationRecord.findMany({
//     where: { userId: user.id, domain: domain.domain },
//   })

//   return { domain, verificationRecords }
// }

// /**
//  * Delete domain
//  */
// export async function deleteDomain(domainId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   // Check if domain has active sending accounts
//   const accountsCount = await db.sendingAccount.count({
//     where: { domainId, isActive: true },
//   })

//   if (accountsCount > 0) {
//     throw new Error("Cannot delete domain with active sending accounts. Please deactivate them first.")
//   }

//   await db.domain.delete({
//     where: { id: domainId, userId: user.id },
//   })

//   revalidatePath("/dashboard/deliverability")
//   revalidatePath("/dashboard/settings")

//   return { success: true }
// }



// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import { generateDNSRecords, verifyDNSRecords } from "@/lib/services/dns-verification"
// import { updateDeliverabilityHealth } from "@/lib/services/deliverability-alerts"

// /**
//  * Add a new domain with DNS setup guidance
//  */
// export async function addDomain(domain: string, recordType: "subdomain" | "main" = "subdomain") {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   // Check if domain already exists
//   const existing = await db.domain.findUnique({
//     where: { userId_domain: { userId: user.id, domain } },
//   })

//   if (existing) {
//     throw new Error("Domain already exists")
//   }

//   // Generate DNS records
//   const dnsRecords = await generateDNSRecords(domain)

//   // Create domain
//   const newDomain = await db.domain.create({
//     data: {
//       userId: user.id,
//       domain,
//       recordType,
//       dnsRecords: dnsRecords as any,
//       isVerified: false,
//     },
//   })

//   // Create verification records
//   for (const record of dnsRecords.records) {
//     await db.domainVerificationRecord.create({
//       data: {
//         userId: user.id,
//         domain,
//         recordType: record.type,
//         recordName: record.name,
//         recordValue: record.value,
//         selector: record.selector,
//       },
//     })
//   }

//   revalidatePath("/dashboard/deliverability")
//   revalidatePath("/dashboard/settings")

//   return { success: true, domainId: newDomain.id, dnsRecords }
// }

// /**
//  * Verify domain DNS records
//  */
// export async function verifyDomain(domainId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const domain = await db.domain.findUnique({
//     where: { id: domainId, userId: user.id },
//   })

//   if (!domain) throw new Error("Domain not found")

//   // Verify DNS records
//   const verification = await verifyDNSRecords(domain.domain)

//   // Update domain
//   await db.domain.update({
//     where: { id: domainId },
//     data: {
//       isVerified: verification.allValid,
//       verifiedAt: verification.allValid ? new Date() : null,
//       verificationAttempts: domain.verificationAttempts + 1,
//       lastVerificationCheck: new Date(),
//       healthScore: verification.healthScore,
//     },
//   })

//   // Update verification records
//   for (const result of verification.results) {
//     await db.domainVerificationRecord.updateMany({
//       where: {
//         userId: user.id,
//         domain: domain.domain,
//         recordType: result.type,
//       },
//       data: {
//         isVerified: result.valid,
//         verifiedAt: result.valid ? new Date() : null,
//       },
//     })
//   }

//   // Create or update deliverability health
//   await updateDeliverabilityHealth(domainId)

//   revalidatePath("/dashboard/deliverability")
//   revalidatePath("/dashboard/settings")

//   return {
//     success: true,
//     verified: verification.allValid,
//     results: verification.results,
//     healthScore: verification.healthScore,
//   }
// }

// /**
//  * Get domain with DNS records
//  */
// export async function getDomainDetails(domainId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const domain = await db.domain.findUnique({
//     where: { id: domainId, userId: user.id },
//     include: {
//       deliverabilityHealth: true,
//       sendingAccounts: true,
//     },
//   })

//   if (!domain) throw new Error("Domain not found")

//   const verificationRecords = await db.domainVerificationRecord.findMany({
//     where: { userId: user.id, domain: domain.domain },
//   })

//   return { domain, verificationRecords }
// }

// /**
//  * Delete domain
//  */
// export async function deleteDomain(domainId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   // Check if domain has active sending accounts
//   const accountsCount = await db.sendingAccount.count({
//     where: { domainId, isActive: true },
//   })

//   if (accountsCount > 0) {
//     throw new Error("Cannot delete domain with active sending accounts. Please deactivate them first.")
//   }

//   await db.domain.delete({
//     where: { id: domainId, userId: user.id },
//   })

//   revalidatePath("/dashboard/deliverability")
//   revalidatePath("/dashboard/settings")

//   return { success: true }
// }

// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import { generateDNSRecords, verifyDNSRecords } from "@/lib/services/dns-verification"
// import { updateDeliverabilityHealth } from "@/lib/services/deliverability-alerts"

// /**
//  * Add a new domain with DNS setup guidance
//  */
// export async function addDomain(domain: string, recordType: "subdomain" | "main" = "subdomain") {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const domainCount = await db.domain.count({ where: { userId: user.id } })
//   const domainLimit = getDomainLimit(user.subscriptionTier)

//   if (domainCount >= domainLimit) {
//     throw new Error(`Domain limit reached. Upgrade your plan to add more domains. Current limit: ${domainLimit}`)
//   }

//   // Check if domain already exists
//   const existing = await db.domain.findUnique({
//     where: { userId_domain: { userId: user.id, domain } },
//   })

//   if (existing) {
//     return {
//       success: false,
//       error: "Domain already exists. Please use a different domain or manage your existing domains.",
//       code: "DOMAIN_EXISTS",
//     }
//   }

//   // Generate DNS records
//   const dnsRecords = await generateDNSRecords(domain)

//   // Create domain
//   const newDomain = await db.domain.create({
//     data: {
//       userId: user.id,
//       domain,
//       recordType,
//       dnsRecords: dnsRecords as any,
//       isVerified: false,
//     },
//   })

//   // Create verification records
//   for (const record of dnsRecords.records) {
//     await db.domainVerificationRecord.create({
//       data: {
//         userId: user.id,
//         domain,
//         recordType: record.type,
//         recordName: record.name,
//         recordValue: record.value,
//         selector: record.selector,
//       },
//     })
//   }

//   revalidatePath("/dashboard/deliverability")
//   revalidatePath("/dashboard/settings")

//   return { success: true, domainId: newDomain.id, dnsRecords }
// }

// /**
//  * Verify domain DNS records
//  */
// export async function verifyDomain(domainId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const domain = await db.domain.findUnique({
//     where: { id: domainId, userId: user.id },
//   })

//   if (!domain) throw new Error("Domain not found")

//   // Verify DNS records
//   const verification = await verifyDNSRecords(domain.domain)

//   // Update domain
//   await db.domain.update({
//     where: { id: domainId },
//     data: {
//       isVerified: verification.allValid,
//       verifiedAt: verification.allValid ? new Date() : null,
//       verificationAttempts: domain.verificationAttempts + 1,
//       lastVerificationCheck: new Date(),
//       healthScore: verification.healthScore,
//     },
//   })

//   // Update verification records
//   for (const result of verification.results) {
//     await db.domainVerificationRecord.updateMany({
//       where: {
//         userId: user.id,
//         domain: domain.domain,
//         recordType: result.type,
//       },
//       data: {
//         isVerified: result.valid,
//         verifiedAt: result.valid ? new Date() : null,
//       },
//     })
//   }

//   // Create or update deliverability health
//   await updateDeliverabilityHealth(domainId)

//   revalidatePath("/dashboard/deliverability")
//   revalidatePath("/dashboard/settings")

//   return {
//     success: true,
//     verified: verification.allValid,
//     results: verification.results,
//     healthScore: verification.healthScore,
//   }
// }

// /**
//  * Get domain with DNS records
//  */
// export async function getDomainDetails(domainId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const domain = await db.domain.findUnique({
//     where: { id: domainId, userId: user.id },
//     include: {
//       deliverabilityHealth: true,
//       sendingAccounts: true,
//     },
//   })

//   if (!domain) throw new Error("Domain not found")

//   const verificationRecords = await db.domainVerificationRecord.findMany({
//     where: { userId: user.id, domain: domain.domain },
//   })

//   return { domain, verificationRecords }
// }

// /**
//  * Delete domain
//  */
// export async function deleteDomain(domainId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   // Check if domain has active sending accounts
//   const accountsCount = await db.sendingAccount.count({
//     where: { domainId, isActive: true },
//   })

//   if (accountsCount > 0) {
//     throw new Error("Cannot delete domain with active sending accounts. Please deactivate them first.")
//   }

//   await db.domain.delete({
//     where: { id: domainId, userId: user.id },
//   })

//   revalidatePath("/dashboard/deliverability")
//   revalidatePath("/dashboard/settings")

//   return { success: true }
// }

// function getDomainLimit(tier: string): number {
//   switch (tier) {
//     case "FREE":
//       return 2
//     case "STARTER":
//       return 4
//     case "PRO":
//       return 10
//     case "AGENCY":
//       return 50
//     default:
//       return 1
//   }
// }


// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import { generateDNSRecords, verifyDNSRecords } from "@/lib/services/dns-verification"
// import { updateDeliverabilityHealth } from "@/lib/services/deliverability-alerts"

// /**
//  * Add a new domain with DNS setup guidance
//  */
// export async function addDomain(domain: string, recordType: "subdomain" | "main" = "subdomain") {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const domainCount = await db.domain.count({ where: { userId: user.id } })
//   const domainLimit = getDomainLimit(user.subscriptionTier)

//   if (domainCount >= domainLimit) {
//     return {
//       success: false,
//       error: `Domain limit reached. Your ${user.subscriptionTier} plan allows ${domainLimit} domain${domainLimit > 1 ? "s" : ""}. Please upgrade to add more domains.`,
//       code: "DOMAIN_LIMIT_REACHED",
//     }
//   }

//   // Check if domain already exists
//   const existing = await db.domain.findUnique({
//     where: { userId_domain: { userId: user.id, domain: domain.toLowerCase() } },
//   })

//   if (existing) {
//     return {
//       success: false,
//       error: `Domain "${domain}" is already added to your account. You can manage it in your settings.`,
//       code: "DOMAIN_EXISTS",
//     }
//   }

//   // Generate DNS records
//   const dnsRecords = await generateDNSRecords(domain)

//   // Create domain
//   const newDomain = await db.domain.create({
//     data: {
//       userId: user.id,
//       domain: domain.toLowerCase(),
//       recordType,
//       dnsRecords: dnsRecords as any,
//       isVerified: false,
//     },
//   })

//   // Create verification records
//   for (const record of dnsRecords.records) {
//     await db.domainVerificationRecord.create({
//       data: {
//         userId: user.id,
//         domain: domain.toLowerCase(),
//         recordType: record.type,
//         recordName: record.name,
//         recordValue: record.value,
//         selector: record.selector,
//       },
//     })
//   }

//   revalidatePath("/dashboard/deliverability")
//   revalidatePath("/dashboard/settings")

//   return { success: true, domainId: newDomain.id, dnsRecords }
// }

// /**
//  * Verify domain DNS records
//  */
// export async function verifyDomain(domainId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const domain = await db.domain.findUnique({
//     where: { id: domainId, userId: user.id },
//   })

//   if (!domain) throw new Error("Domain not found")

//   // Verify DNS records
//   const verification = await verifyDNSRecords(domain.domain)

//   // Update domain
//   await db.domain.update({
//     where: { id: domainId },
//     data: {
//       isVerified: verification.allValid,
//       verifiedAt: verification.allValid ? new Date() : null,
//       verificationAttempts: domain.verificationAttempts + 1,
//       lastVerificationCheck: new Date(),
//       healthScore: verification.healthScore,
//     },
//   })

//   // Update verification records
//   for (const result of verification.results) {
//     await db.domainVerificationRecord.updateMany({
//       where: {
//         userId: user.id,
//         domain: domain.domain,
//         recordType: result.type,
//       },
//       data: {
//         isVerified: result.valid,
//         verifiedAt: result.valid ? new Date() : null,
//       },
//     })
//   }

//   // Create or update deliverability health
//   await updateDeliverabilityHealth(domainId)

//   revalidatePath("/dashboard/deliverability")
//   revalidatePath("/dashboard/settings")

//   return {
//     success: true,
//     verified: verification.allValid,
//     results: verification.results,
//     healthScore: verification.healthScore,
//   }
// }

// /**
//  * Get domain with DNS records
//  */
// export async function getDomainDetails(domainId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   const domain = await db.domain.findUnique({
//     where: { id: domainId, userId: user.id },
//     include: {
//       deliverabilityHealth: true,
//       sendingAccounts: true,
//     },
//   })

//   if (!domain) throw new Error("Domain not found")

//   const verificationRecords = await db.domainVerificationRecord.findMany({
//     where: { userId: user.id, domain: domain.domain },
//   })

//   return { domain, verificationRecords }
// }

// /**
//  * Delete domain
//  */
// export async function deleteDomain(domainId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) throw new Error("User not found")

//   // Check if domain has active sending accounts
//   const accountsCount = await db.sendingAccount.count({
//     where: { domainId, isActive: true },
//   })

//   if (accountsCount > 0) {
//     throw new Error("Cannot delete domain with active sending accounts. Please deactivate them first.")
//   }

//   await db.domain.delete({
//     where: { id: domainId, userId: user.id },
//   })

//   revalidatePath("/dashboard/deliverability")
//   revalidatePath("/dashboard/settings")

//   return { success: true }
// }

// function getDomainLimit(tier: string): number {
//   switch (tier) {
//     case "FREE":
//       return 1
//     case "STARTER":
//       return 3
//     case "PRO":
//       return 10
//     case "AGENCY":
//       return 50
//     default:
//       return 1
//   }
// }

"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import {
  generateDNSRecords,
  verifyDNSRecords,
  preValidateDomain,
  detectDNSProvider,
} from "@/lib/services/dns-verification"
import { updateDeliverabilityHealth } from "@/lib/services/deliverability-alerts"

/**
 * Pre-validate domain before adding
 */
export async function validateDomain(domain: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  // Clean domain
  const cleanDomain = domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")

  // Check if already exists
  const existing = await db.domain.findUnique({
    where: { userId_domain: { userId: user.id, domain: cleanDomain } },
  })

  if (existing) {
    return {
      success: false,
      error: existing.isVerified
        ? "Domain already verified and active"
        : "Domain already added but not verified. Continue setup below.",
      code: existing.isVerified ? "DOMAIN_VERIFIED" : "DOMAIN_EXISTS",
      domainId: existing.id,
    }
  }

  // Validate domain has MX records
  const validation = await preValidateDomain(cleanDomain)
  if (!validation.canProceed) {
    return {
      success: false,
      error: validation.error,
      code: "VALIDATION_FAILED",
    }
  }

  // Detect DNS provider
  const dnsProvider = await detectDNSProvider(cleanDomain)

  return {
    success: true,
    domain: cleanDomain,
    dnsProvider,
  }
}

/**
 * Add a new domain with provider-specific DNS setup guidance
 */
export async function addDomain(
  domain: string,
  emailProvider: string = "sendgrid",
  recordType: "subdomain" | "main" = "subdomain",
) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const domainCount = await db.domain.count({ where: { userId: user.id } })
  const domainLimit = getDomainLimit(user.subscriptionTier)

  if (domainCount >= domainLimit) {
    return {
      success: false,
      error: `Domain limit reached. Your ${user.subscriptionTier} plan allows ${domainLimit} domain${domainLimit > 1 ? "s" : ""}. Please upgrade to add more domains.`,
      code: "DOMAIN_LIMIT_REACHED",
    }
  }

  const cleanDomain = domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")

  // Check if domain already exists
  const existing = await db.domain.findUnique({
    where: { userId_domain: { userId: user.id, domain: cleanDomain } },
  })

  if (existing) {
    return {
      success: false,
      error: `Domain "${cleanDomain}" is already added to your account. You can manage it in your settings.`,
      code: "DOMAIN_EXISTS",
      domainId: existing.id,
    }
  }

  // Pre-validate domain
  const validation = await preValidateDomain(cleanDomain)
  if (!validation.canProceed) {
    return {
      success: false,
      error: validation.error || "Domain validation failed",
      code: "VALIDATION_FAILED",
    }
  }

  // Generate DNS records based on email provider
  const dnsRecords = await generateDNSRecords(cleanDomain, emailProvider)

  // Detect DNS provider for custom instructions
  const dnsProvider = await detectDNSProvider(cleanDomain)

  // Create domain
  const newDomain = await db.domain.create({
    data: {
      userId: user.id,
      domain: cleanDomain,
      recordType,
      dnsRecords: {
        ...dnsRecords,
        dnsProvider: dnsProvider?.provider,
        dnsProviderNotes: dnsProvider?.notes,
      } as any,
      isVerified: false,
    },
  })

  // Create verification records
  for (const record of dnsRecords.records) {
    await db.domainVerificationRecord.create({
      data: {
        userId: user.id,
        domain: cleanDomain,
        recordType: record.type,
        recordName: record.name,
        recordValue: record.value,
        selector: record.selector,
      },
    })
  }

  revalidatePath("/dashboard/deliverability")
  revalidatePath("/dashboard/settings")

  return {
    success: true,
    domainId: newDomain.id,
    dnsRecords,
    dnsProvider,
  }
}

/**
 * Verify domain DNS records with enhanced feedback
 */
export async function verifyDomain(domainId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const domain = await db.domain.findUnique({
    where: { id: domainId, userId: user.id },
  })

  if (!domain) throw new Error("Domain not found")

  // Get the selector from stored DNS records
  const storedDNSRecords = domain.dnsRecords as any
  const dkimSelector = storedDNSRecords?.selector || "default"

  // Verify DNS records with user's specific selector
  const verification = await verifyDNSRecords(domain.domain, dkimSelector)

  // Calculate verification progress
  const verifiedCount = verification.results.filter((r) => r.valid).length
  const totalCount = verification.results.length
  const progressPercentage = Math.round((verifiedCount / totalCount) * 100)

  // Update domain
  await db.domain.update({
    where: { id: domainId },
    data: {
      isVerified: verification.allValid,
      verifiedAt: verification.allValid ? new Date() : null,
      verificationAttempts: domain.verificationAttempts + 1,
      lastVerificationCheck: new Date(),
      healthScore: verification.healthScore,
      dnsRecords: {
        ...storedDNSRecords,
        lastVerificationResult: verification,
        propagationStatus: verification.propagationStatus,
      } as any,
    },
  })

  // Update verification records
  for (const result of verification.results) {
    await db.domainVerificationRecord.updateMany({
      where: {
        userId: user.id,
        domain: domain.domain,
        recordType: result.type,
      },
      data: {
        isVerified: result.valid,
        verifiedAt: result.valid ? new Date() : null,
      },
    })
  }

  // Create or update deliverability health
  await updateDeliverabilityHealth(domainId)

  revalidatePath("/dashboard/deliverability")
  revalidatePath("/dashboard/settings")

  return {
    success: true,
    verified: verification.allValid,
    results: verification.results,
    healthScore: verification.healthScore,
    progressPercentage,
    propagationStatus: verification.propagationStatus,
    allValid: verification.allValid,
  }
}

/**
 * Poll domain verification (for auto-retry)
 */
export async function pollDomainVerification(domainId: string, maxAttempts: number = 3) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  let lastResult = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    lastResult = await verifyDomain(domainId)

    if (lastResult.verified) {
      return {
        // success: true,
        // verified: true,
        attempts: attempt,
        ...lastResult,
      }
    }

    // Wait 10 seconds before next attempt (except on last attempt)
    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 10000))
    }
  }

  return {
    success: false,
    verified: false,
    attempts: maxAttempts,
    message: "DNS records still propagating. This can take 1-4 hours. You can check back later.",
    ...lastResult,
  }
}

/**
 * Get domain with DNS records and provider info
 */
export async function getDomainDetails(domainId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const domain = await db.domain.findUnique({
    where: { id: domainId, userId: user.id },
    include: {
      deliverabilityHealth: true,
      sendingAccounts: true,
    },
  })

  if (!domain) throw new Error("Domain not found")

  const verificationRecords = await db.domainVerificationRecord.findMany({
    where: { userId: user.id, domain: domain.domain },
  })

  // Get DNS provider info
  const dnsRecords = domain.dnsRecords as any
  const dnsProvider = dnsRecords?.dnsProvider
  const dnsProviderNotes = dnsRecords?.dnsProviderNotes

  return {
    domain,
    verificationRecords,
    dnsProvider,
    dnsProviderNotes,
  }
}

/**
 * Re-check a specific DNS record
 */
export async function recheckDNSRecord(domainId: string, recordType: "SPF" | "DKIM" | "DMARC") {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const domain = await db.domain.findUnique({
    where: { id: domainId, userId: user.id },
  })

  if (!domain) throw new Error("Domain not found")

  const storedDNSRecords = domain.dnsRecords as any
  const dkimSelector = storedDNSRecords?.selector || "default"

  // Verify only the specific record
  const verification = await verifyDNSRecords(domain.domain, dkimSelector)
  const recordResult = verification.results.find((r) => r.type === recordType)

  if (recordResult) {
    // Update only this record
    await db.domainVerificationRecord.updateMany({
      where: {
        userId: user.id,
        domain: domain.domain,
        recordType: recordType,
      },
      data: {
        isVerified: recordResult.valid,
        verifiedAt: recordResult.valid ? new Date() : null,
      },
    })
  }

  revalidatePath("/dashboard/deliverability")
  revalidatePath("/dashboard/settings")

  return {
    success: true,
    recordType,
    valid: recordResult?.valid || false,
    message: recordResult?.message,
  }
}

/**
 * Delete domain
 */
export async function deleteDomain(domainId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  // Check if domain has active sending accounts
  const accountsCount = await db.sendingAccount.count({
    where: { domainId, isActive: true },
  })

  if (accountsCount > 0) {
    throw new Error("Cannot delete domain with active sending accounts. Please deactivate them first.")
  }

  await db.domain.delete({
    where: { id: domainId, userId: user.id },
  })

  revalidatePath("/dashboard/deliverability")
  revalidatePath("/dashboard/settings")

  return { success: true }
}

/**
 * Get DNS troubleshooting tips
 */
export async function getDNSTroubleshootingTips(domainId: string, recordType: "SPF" | "DKIM" | "DMARC") {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const domain = await db.domain.findUnique({
    where: { id: domainId, userId: user.id },
  })

  if (!domain) throw new Error("Domain not found")

  const dnsRecords = domain.dnsRecords as any
  const dnsProvider = dnsRecords?.dnsProvider
  const providerNotes = dnsRecords?.dnsProviderNotes

  const tips: Record<string, any> = {
    SPF: {
      title: "SPF Record Troubleshooting",
      commonIssues: [
        "Record not added yet - verify in your DNS dashboard",
        "DNS hasn't propagated (wait 1-4 hours, up to 48 hours worst case)",
        "Wrong record type (should be TXT, not A or CNAME)",
        "Typo in the value - must start with 'v=spf1'",
      ],
      providerSpecific: providerNotes?.spf || "Use @ or leave Name blank for root domain",
      checkTools: [
        { name: "MXToolbox SPF Check", url: `https://mxtoolbox.com/spf.aspx` },
        { name: "WhatsmyDNS", url: `https://www.whatsmydns.net/#TXT/${domain.domain}` },
      ],
    },
    DKIM: {
      title: "DKIM Record Troubleshooting",
      commonIssues: [
        "Record not added yet - verify in your DNS dashboard",
        "Wrong selector name - must match exactly (including underscore)",
        "DNS provider added domain suffix automatically - try removing it",
        "DNS hasn't propagated yet (wait 1-4 hours)",
        "Email provider hasn't generated DKIM key yet - check provider dashboard",
      ],
      providerSpecific:
        providerNotes?.dkim || "Enter subdomain with _domainkey (e.g., selector._domainkey.yourdomain.com)",
      checkTools: [
        { name: "MXToolbox DKIM Check", url: `https://mxtoolbox.com/dkim.aspx` },
        {
          name: "WhatsmyDNS",
          url: `https://www.whatsmydns.net/#TXT/${dnsRecords?.selector || "default"}._domainkey.${domain.domain}`,
        },
      ],
    },
    DMARC: {
      title: "DMARC Record Troubleshooting",
      commonIssues: [
        "Record not added yet - verify in your DNS dashboard",
        "Wrong name - must be exactly '_dmarc' (with underscore)",
        "Invalid policy value - must be p=none, p=quarantine, or p=reject",
        "DNS hasn't propagated yet (wait 1-4 hours)",
      ],
      providerSpecific: providerNotes?.dmarc || "Name should be _dmarc (with underscore)",
      checkTools: [
        { name: "MXToolbox DMARC Check", url: `https://mxtoolbox.com/dmarc.aspx` },
        { name: "WhatsmyDNS", url: `https://www.whatsmydns.net/#TXT/_dmarc.${domain.domain}` },
      ],
    },
  }

  return tips[recordType] || null
}

function getDomainLimit(tier: string): number {
  switch (tier) {
    case "FREE":
      return 1
    case "STARTER":
      return 3
    case "PRO":
      return 10
    case "AGENCY":
      return 50
    default:
      return 1
  }
}