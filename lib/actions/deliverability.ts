"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { domainHealthChecker } from "@/lib/services/domain-health-checker"
import { revalidatePath } from "next/cache"

export async function recheckDomainHealth(domainId: string) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return { success: false, error: "Unauthorized" }
    }

    const user = await db.user.findUnique({
      where: { clerkId },
      select: { id: true },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Get the domain and verify ownership
    const domain = await db.domain.findFirst({
      where: {
        id: domainId,
        userId: user.id,
      },
    })

    if (!domain) {
      return { success: false, error: "Domain not found" }
    }

    // Perform fresh health check
    const health = await domainHealthChecker.checkDomainHealth(domain.domain)

    await db.domain.update({
      where: { id: domainId },
      data: {
        healthScore: health.score,
        isBlacklisted: health.blacklisted,
        blacklistedOn: health.blacklists,
        blacklistCheckAt: new Date(),
        lastHealthCheck: new Date(),
      },
    })

    // Build alert messages
    const alertMessages: string[] = []
    if (!health.spf.valid) alertMessages.push(`SPF: ${health.spf.error || "Not configured"}`)
    if (!health.dkim.valid) alertMessages.push(`DKIM: ${health.dkim.error || "Not configured"}`)
    if (!health.dmarc.valid) alertMessages.push(`DMARC: ${health.dmarc.error || "Not configured"}`)
    if (health.blacklisted) alertMessages.push(`Blacklisted on: ${health.blacklists.join(", ")}`)

    const hasIssues = !health.spf.valid || !health.dkim.valid || !health.dmarc.valid || health.blacklisted

    const alertLevel = health.blacklisted
      ? "CRITICAL"
      : !health.spf.valid || !health.dkim.valid || !health.dmarc.valid
        ? "WARNING"
        : "NONE"

    // Update or create deliverability health record
    await db.deliverabilityHealth.upsert({
      where: { domainId },
      create: {
        domainId,
        spfValid: health.spf.valid,
        spfRecord: health.spf.record,
        dkimValid: health.dkim.valid,
        dkimSelector: health.dkim.selector || null,
        dkimSelectors: health.dkim.selectors || [],
        dmarcValid: health.dmarc.valid,
        dmarcPolicy: health.dmarc.policy,
        dmarcRecord: health.dmarc.record,
        mxRecordsValid: health.mxRecords.length > 0,
        mxRecords: health.mxRecords,
        blacklists: health.blacklists,
        hasIssues,
        alertLevel,
        alertMessage: alertMessages.length > 0 ? alertMessages.join("; ") : null,
        lastFullCheck: new Date(),
      },
      update: {
        spfValid: health.spf.valid,
        spfRecord: health.spf.record,
        dkimValid: health.dkim.valid,
        dkimSelector: health.dkim.selector || null,
        dkimSelectors: health.dkim.selectors || [],
        dmarcValid: health.dmarc.valid,
        dmarcPolicy: health.dmarc.policy,
        dmarcRecord: health.dmarc.record,
        mxRecordsValid: health.mxRecords.length > 0,
        mxRecords: health.mxRecords,
        blacklists: health.blacklists,
        hasIssues,
        alertLevel,
        alertMessage: alertMessages.length > 0 ? alertMessages.join("; ") : null,
        lastFullCheck: new Date(),
        updatedAt: new Date(),
      },
    })

    revalidatePath("/dashboard/deliverability")

    return {
      success: true,
      health: {
        score: health.score,
        spf: health.spf.valid,
        dkim: health.dkim.valid,
        dmarc: health.dmarc.valid,
        blacklisted: health.blacklisted,
        blacklists: health.blacklists,
      },
    }
  } catch (error) {
    console.error("Error rechecking domain health:", error)
    return { success: false, error: "Failed to recheck domain health" }
  }
}
