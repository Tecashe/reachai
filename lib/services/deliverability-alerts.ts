"use server"

import { db } from "@/lib/db"
import { createNotification } from "@/lib/actions/notifications"
import { checkDomainHealth } from "./domain-health-checker"

export type AlertSeverity = "INFO" | "WARNING" | "CRITICAL"

export interface DeliverabilityAlert {
  severity: AlertSeverity
  title: string
  message: string
  domainId?: string
  sendingAccountId?: string
  actionUrl?: string
  metadata?: Record<string, any>
}

/**
 * Monitor domain health and create alerts
 */
export async function monitorDomainHealth(userId: string) {
  const domains = await db.domain.findMany({
    where: { userId, isActive: true },
    include: { deliverabilityHealth: true, sendingAccounts: true },
  })

  const alerts: DeliverabilityAlert[] = []

  for (const domain of domains) {
    // Check blacklist status
    if (domain.isBlacklisted && domain.blacklistedOn.length > 0) {
      alerts.push({
        severity: "CRITICAL",
        title: `Domain Blacklisted: ${domain.domain}`,
        message: `Your domain ${domain.domain} is blacklisted on ${domain.blacklistedOn.join(", ")}. This will severely impact deliverability.`,
        domainId: domain.id,
        actionUrl: `/dashboard/deliverability?domain=${domain.id}`,
        metadata: { blacklists: domain.blacklistedOn },
      })

      await createNotification({
        userId,
        type: "SYSTEM_UPDATE",
        title: `Domain Blacklisted: ${domain.domain}`,
        message: `Your domain ${domain.domain} is blacklisted. Immediate action required.`,
        entityType: "domain",
        entityId: domain.id,
        actionUrl: `/dashboard/deliverability?domain=${domain.id}`,
      })
    }

    // Check DNS configuration
    const health = domain.deliverabilityHealth
    if (health) {
      if (!health.spfValid || health.spfStatus !== "VALID") {
        alerts.push({
          severity: "WARNING",
          title: `SPF Record Issue: ${domain.domain}`,
          message: `SPF record for ${domain.domain} is ${health.spfStatus}. This may affect email deliverability.`,
          domainId: domain.id,
          actionUrl: `/dashboard/deliverability?domain=${domain.id}`,
        })
      }

      if (!health.dkimValid || health.dkimStatus !== "VALID") {
        alerts.push({
          severity: "WARNING",
          title: `DKIM Record Issue: ${domain.domain}`,
          message: `DKIM record for ${domain.domain} is ${health.dkimStatus}. This may affect email authentication.`,
          domainId: domain.id,
          actionUrl: `/dashboard/deliverability?domain=${domain.id}`,
        })
      }

      if (!health.dmarcValid || health.dmarcStatus !== "VALID") {
        alerts.push({
          severity: "INFO",
          title: `DMARC Policy Missing: ${domain.domain}`,
          message: `DMARC record for ${domain.domain} is ${health.dmarcStatus}. Consider adding a DMARC policy.`,
          domainId: domain.id,
          actionUrl: `/dashboard/deliverability?domain=${domain.id}`,
        })
      }

      // Check bounce rate
      if (health.avgBounceRate && health.avgBounceRate > 5) {
        alerts.push({
          severity: health.avgBounceRate > 10 ? "CRITICAL" : "WARNING",
          title: `High Bounce Rate: ${domain.domain}`,
          message: `Bounce rate is ${health.avgBounceRate.toFixed(2)}% for ${domain.domain}. Clean your list and verify email addresses.`,
          domainId: domain.id,
          actionUrl: `/dashboard/deliverability?domain=${domain.id}`,
          metadata: { bounceRate: health.avgBounceRate },
        })
      }

      // Check spam complaints
      if (health.avgSpamComplaintRate && health.avgSpamComplaintRate > 0.1) {
        alerts.push({
          severity: "CRITICAL",
          title: `High Spam Complaints: ${domain.domain}`,
          message: `Spam complaint rate is ${health.avgSpamComplaintRate.toFixed(2)}% for ${domain.domain}. Review your email content and targeting.`,
          domainId: domain.id,
          actionUrl: `/dashboard/deliverability?domain=${domain.id}`,
          metadata: { spamComplaintRate: health.avgSpamComplaintRate },
        })

        await createNotification({
          userId,
          type: "SYSTEM_UPDATE",
          title: `High Spam Complaints: ${domain.domain}`,
          message: `Your spam complaint rate is too high. Review your campaigns immediately.`,
          entityType: "domain",
          entityId: domain.id,
          actionUrl: `/dashboard/deliverability?domain=${domain.id}`,
        })
      }

      // Check reputation score
      if (health.senderReputation < 50) {
        alerts.push({
          severity: "CRITICAL",
          title: `Low Sender Reputation: ${domain.domain}`,
          message: `Sender reputation is ${health.senderReputation}/100 for ${domain.domain}. This will impact inbox placement.`,
          domainId: domain.id,
          actionUrl: `/dashboard/deliverability?domain=${domain.id}`,
          metadata: { reputation: health.senderReputation },
        })
      }
    }

    // Check if domain needs verification
    if (!domain.isVerified) {
      alerts.push({
        severity: "WARNING",
        title: `Domain Not Verified: ${domain.domain}`,
        message: `Domain ${domain.domain} is not verified. Complete DNS setup to start sending emails.`,
        domainId: domain.id,
        actionUrl: `/dashboard/deliverability?domain=${domain.id}`,
      })
    }

    // Check sending account health
    for (const account of domain.sendingAccounts) {
      if (account.healthScore < 50) {
        alerts.push({
          severity: "WARNING",
          title: `Low Account Health: ${account.email}`,
          message: `Sending account ${account.email} has a health score of ${account.healthScore}/100. Consider pausing or rotating.`,
          sendingAccountId: account.id,
          actionUrl: `/dashboard/deliverability?account=${account.id}`,
          metadata: { healthScore: account.healthScore },
        })
      }

      if (account.bounceRate > 5) {
        alerts.push({
          severity: "CRITICAL",
          title: `High Bounce Rate: ${account.email}`,
          message: `Account ${account.email} has a bounce rate of ${account.bounceRate.toFixed(2)}%. Pause sending immediately.`,
          sendingAccountId: account.id,
          actionUrl: `/dashboard/deliverability?account=${account.id}`,
          metadata: { bounceRate: account.bounceRate },
        })
      }
    }
  }

  return alerts
}

/**
 * Check if domain health monitoring is needed
 */
export async function shouldCheckDomainHealth(domainId: string): Promise<boolean> {
  const domain = await db.domain.findUnique({
    where: { id: domainId },
    include: { deliverabilityHealth: true },
  })

  if (!domain) return false

  // Check every 6 hours
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000)

  if (!domain.deliverabilityHealth?.lastFullCheck) return true

  return domain.deliverabilityHealth.lastFullCheck < sixHoursAgo
}

/**
 * Update deliverability health and trigger alerts
 */
export async function updateDeliverabilityHealth(domainId: string) {
  const domain = await db.domain.findUnique({
    where: { id: domainId },
    include: { user: true },
  })

  if (!domain) throw new Error("Domain not found")

  // Run comprehensive health check
  const healthCheck = await checkDomainHealth(domain.domain)

  const spfStatus = healthCheck.spf.status as "VALID" | "INVALID" | "MISSING"
  const dkimStatus = healthCheck.dkim.status as "VALID" | "INVALID" | "MISSING"
  const dmarcStatus = healthCheck.dmarc.status as "VALID" | "INVALID" | "MISSING"

  const reputation = healthCheck.reputation?.overall ?? 0
  const issues = healthCheck.issues ?? []

  // Update deliverability health
  await db.deliverabilityHealth.upsert({
    where: { domainId },
    create: {
      domainId,
      spfStatus,
      spfValid: healthCheck.spf.valid,
      spfRecord: healthCheck.spf.record,
      dkimStatus,
      dkimValid: healthCheck.dkim.valid,
      dmarcStatus,
      dmarcValid: healthCheck.dmarc.valid,
      dmarcPolicy: healthCheck.dmarc.policy,
      mxRecordsValid: healthCheck.mxRecords.length > 0,
      mxRecords: healthCheck.mxRecords,
      senderReputation: reputation,
      hasIssues: issues.length > 0,
      alertLevel: issues.some((i: any) => i.severity === "critical")
        ? "CRITICAL"
        : issues.length > 0
          ? "WARNING"
          : "NONE",
      alertMessage: issues.map((i: any) => i.message).join("; "),
      lastFullCheck: new Date(),
    },
    update: {
      spfStatus,
      spfValid: healthCheck.spf.valid,
      spfRecord: healthCheck.spf.record,
      dkimStatus,
      dkimValid: healthCheck.dkim.valid,
      dmarcStatus,
      dmarcValid: healthCheck.dmarc.valid,
      dmarcPolicy: healthCheck.dmarc.policy,
      mxRecordsValid: healthCheck.mxRecords.length > 0,
      mxRecords: healthCheck.mxRecords,
      senderReputation: reputation,
      hasIssues: issues.length > 0,
      alertLevel: issues.some((i: any) => i.severity === "critical")
        ? "CRITICAL"
        : issues.length > 0
          ? "WARNING"
          : "NONE",
      alertMessage: issues.map((i: any) => i.message).join("; "),
      lastFullCheck: new Date(),
      updatedAt: new Date(),
    },
  })

  // Check for critical issues and create notifications
  if (issues.some((i: any) => i.severity === "critical")) {
    await createNotification({
      userId: domain.userId,
      type: "SYSTEM_UPDATE",
      title: `Critical Issues Detected: ${domain.domain}`,
      message: `Critical deliverability issues found for ${domain.domain}. Check your DNS configuration immediately.`,
      entityType: "domain",
      entityId: domainId,
      actionUrl: `/dashboard/deliverability?domain=${domainId}`,
    })
  }

  return healthCheck
}
