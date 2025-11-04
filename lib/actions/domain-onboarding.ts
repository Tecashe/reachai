"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { dnsVerificationService } from "@/lib/services/dns-verification"

export async function addDomainOnboarding(domain: string) {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    return { success: false, error: "Not authenticated" }
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  })

  if (!user) {
    return { success: false, error: "User not found" }
  }

  try {
    // CHANGE: Verify DNS records and save to database
    const verificationResult = await dnsVerificationService.verifyDNSRecords(domain)

    await dnsVerificationService.saveVerificationResult(user.id, domain, verificationResult)

    return {
      success: true,
      data: {
        domainId: domain,
        isVerified: verificationResult.overallValid,
        healthScore: verificationResult.score,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add domain",
    }
  }
}
