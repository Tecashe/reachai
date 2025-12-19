

"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import {
  generateDNSRecords,
  verifyDNSRecords,
  getEmailProviders,
  getEmailProvider,
  checkCustomDKIMSelector,
} from "@/lib/services/dns-verification"
import { updateDeliverabilityHealth } from "@/lib/services/deliverability-alerts"

// =============================================================================
// TYPES
// =============================================================================

interface AddDomainResult {
  success: boolean
  domainId?: string
  dnsRecords?: ReturnType<typeof generateDNSRecords>
  error?: string
  code?: string
}

interface VerifyDomainResult {
  success: boolean
  verified: boolean
  results: Array<{
    type: string
    valid: boolean
    message?: string
    details?: string
  }>
  healthScore: number
  dkimSelector?: string
  diagnostics?: {
    timestamp: Date
    dnsLookupTime: number
    selectorsChecked: number
  }
}

// =============================================================================
// AUTH HELPER
// =============================================================================

async function getAuthUser() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  return user
}

// =============================================================================
// DOMAIN MANAGEMENT
// =============================================================================

/**
 * Add a new domain with email provider selection
 */
export async function addDomain(
  domain: string,
  providerId = "custom",
  recordType: "subdomain" | "main" = "subdomain",
): Promise<AddDomainResult> {
  const user = await getAuthUser()

  // Check domain limit
  const domainCount = await db.domain.count({ where: { userId: user.id } })
  const domainLimit = getDomainLimit(user.subscriptionTier)

  if (domainCount >= domainLimit) {
    return {
      success: false,
      error: `Domain limit reached. Your ${user.subscriptionTier} plan allows ${domainLimit} domain${domainLimit > 1 ? "s" : ""}. Please upgrade to add more domains.`,
      code: "DOMAIN_LIMIT_REACHED",
    }
  }

  // Normalize domain
  const normalizedDomain = domain
    .toLowerCase()
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?/, "")

  // Check if domain already exists
  const existing = await db.domain.findUnique({
    where: { userId_domain: { userId: user.id, domain: normalizedDomain } },
  } as any)

  if (existing) {
    return {
      success: false,
      error: `Domain "${normalizedDomain}" is already added to your account.`,
      code: "DOMAIN_EXISTS",
    }
  }

  // Generate DNS records based on provider
  const dnsRecords = generateDNSRecords(normalizedDomain, providerId)

  // Create domain
  const newDomain = await db.domain.create({
    data: {
      userId: user.id,
      domain: normalizedDomain,
      recordType,
      emailProviderId: providerId,
      dnsRecords: dnsRecords as any,
      isVerified: false,
    },
  })

  // Create verification records
  for (const record of dnsRecords.records) {
    await db.domainVerificationRecord.create({
      data: {
        userId: user.id,
        domain: normalizedDomain,
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
 * Verify domain DNS records with provider-aware checking
 */
export async function verifyDomain(domainId: string, customSelector?: string): Promise<VerifyDomainResult> {
  const user = await getAuthUser()

  const domain = await db.domain.findUnique({
    where: { id: domainId, userId: user.id },
  } as any)

  if (!domain) throw new Error("Domain not found")

  // Verify DNS records with provider-specific selector priority
  const verification = await verifyDNSRecords(domain.domain, domain.emailProviderId || undefined, customSelector)

  // Update domain
  await db.domain.update({
    where: { id: domainId },
    data: {
      isVerified: verification.allValid,
      verifiedAt: verification.allValid ? new Date() : null,
      verificationAttempts: (domain.verificationAttempts || 0) + 1,
      lastVerificationCheck: new Date(),
      healthScore: verification.healthScore,
      dkimSelector: verification.dkim.selector,
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
        lastMessage: result.message,
      },
    } as any)
  }

  // Update deliverability health
  await updateDeliverabilityHealth(domainId)

  revalidatePath("/dashboard/deliverability")
  revalidatePath("/dashboard/settings")

  return {
    success: true,
    verified: verification.allValid,
    results: verification.results,
    healthScore: verification.healthScore,
    dkimSelector: verification.dkim.selector,
    diagnostics: verification.diagnostics,
  }
}

/**
 * Check a custom DKIM selector for a domain
 */
export async function checkDKIMSelector(domainId: string, selector: string) {
  const user = await getAuthUser()

  const domain = await db.domain.findUnique({
    where: { id: domainId, userId: user.id },
  } as any)

  if (!domain) throw new Error("Domain not found")

  const result = await checkCustomDKIMSelector(domain.domain, selector)

  if (result.valid) {
    // Update domain with found selector
    await db.domain.update({
      where: { id: domainId },
      data: { dkimSelector: selector },
    })
  }

  return result
}

/**
 * Update domain's email provider
 */
export async function updateDomainProvider(domainId: string, providerId: string) {
  const user = await getAuthUser()

  const domain = await db.domain.findUnique({
    where: { id: domainId, userId: user.id },
  } as any)

  if (!domain) throw new Error("Domain not found")

  // Regenerate DNS records for new provider
  const dnsRecords = generateDNSRecords(domain.domain, providerId)

  await db.domain.update({
    where: { id: domainId },
    data: {
      emailProviderId: providerId,
      dnsRecords: dnsRecords as any,
    },
  })

  revalidatePath("/dashboard/deliverability")
  revalidatePath("/dashboard/settings")

  return { success: true, dnsRecords }
}

/**
 * Get list of supported email providers
 */
export async function getProviders() {
  return getEmailProviders()
}

/**
 * Get domain with DNS records
 */
export async function getDomainDetails(domainId: string) {
  const user = await getAuthUser()

  const domain = await db.domain.findUnique({
    where: { id: domainId, userId: user.id },
    include: {
      deliverabilityHealth: true,
      sendingAccounts: true,
    },
  } as any)

  if (!domain) throw new Error("Domain not found")

  const verificationRecords = await db.domainVerificationRecord.findMany({
    where: { userId: user.id, domain: domain.domain },
  } as any)

  // Get provider info if set
  const provider = domain.emailProviderId ? getEmailProvider(domain.emailProviderId) : null

  return { domain, verificationRecords, provider }
}

/**
 * Delete domain
 */
export async function deleteDomain(domainId: string) {
  const user = await getAuthUser()

  // Check for active sending accounts
  const accountsCount = await db.sendingAccount.count({
    where: { domainId, isActive: true },
  } as any)

  if (accountsCount > 0) {
    throw new Error("Cannot delete domain with active sending accounts. Please deactivate them first.")
  }

  // Delete verification records first
  const domain = await db.domain.findUnique({ where: { id: domainId } } as any)
  if (domain) {
    await db.domainVerificationRecord.deleteMany({
      where: { domain: domain.domain, userId: user.id },
    } as any)
  }

  await db.domain.delete({
    where: { id: domainId, userId: user.id },
  } as any)

  revalidatePath("/dashboard/deliverability")
  revalidatePath("/dashboard/settings")

  return { success: true }
}

// =============================================================================
// HELPERS
// =============================================================================

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
