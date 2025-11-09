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

"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { generateDNSRecords, verifyDNSRecords } from "@/lib/services/dns-verification"
import { updateDeliverabilityHealth } from "@/lib/services/deliverability-alerts"

/**
 * Add a new domain with DNS setup guidance
 */
export async function addDomain(domain: string, recordType: "subdomain" | "main" = "subdomain") {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  const domainCount = await db.domain.count({ where: { userId: user.id } })
  const domainLimit = getDomainLimit(user.subscriptionTier)

  if (domainCount >= domainLimit) {
    throw new Error(`Domain limit reached. Upgrade your plan to add more domains. Current limit: ${domainLimit}`)
  }

  // Check if domain already exists
  const existing = await db.domain.findUnique({
    where: { userId_domain: { userId: user.id, domain } },
  })

  if (existing) {
    return {
      success: false,
      error: "Domain already exists. Please use a different domain or manage your existing domains.",
      code: "DOMAIN_EXISTS",
    }
  }

  // Generate DNS records
  const dnsRecords = await generateDNSRecords(domain)

  // Create domain
  const newDomain = await db.domain.create({
    data: {
      userId: user.id,
      domain,
      recordType,
      dnsRecords: dnsRecords as any,
      isVerified: false,
    },
  })

  // Create verification records
  for (const record of dnsRecords.records) {
    await db.domainVerificationRecord.create({
      data: {
        userId: user.id,
        domain,
        recordType: record.type,
        recordName: record.name,
        recordValue: record.value,
        selector: record.selector,
      },
    })
  }

  revalidatePath("/dashboard/deliverability")
  revalidatePath("/dashboard/settings")

  return { success: true, domainId: newDomain.id, dnsRecords }
}

/**
 * Verify domain DNS records
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

  // Verify DNS records
  const verification = await verifyDNSRecords(domain.domain)

  // Update domain
  await db.domain.update({
    where: { id: domainId },
    data: {
      isVerified: verification.allValid,
      verifiedAt: verification.allValid ? new Date() : null,
      verificationAttempts: domain.verificationAttempts + 1,
      lastVerificationCheck: new Date(),
      healthScore: verification.healthScore,
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
  }
}

/**
 * Get domain with DNS records
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

  return { domain, verificationRecords }
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

function getDomainLimit(tier: string): number {
  switch (tier) {
    case "FREE":
      return 2
    case "STARTER":
      return 4
    case "PRO":
      return 10
    case "AGENCY":
      return 50
    default:
      return 1
  }
}
