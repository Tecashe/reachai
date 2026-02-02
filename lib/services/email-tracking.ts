
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"
import { triggerEmailAutomation } from "@/lib/services/automation-engine"

/**
 * REMOVED: generateTrackingPixelUrl - Tracking pixels get marked as spam
 * Use click tracking and reply detection instead for more reliable engagement tracking
 */

/**
 * Wrap URL with click tracking
 */
export function wrapLinkWithTracking(emailLogId: string, originalUrl: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mailfra.com"
  const encodedUrl = encodeURIComponent(originalUrl)
  return `${baseUrl}/api/track/click/${emailLogId}?url=${encodedUrl}`
}

/**
 * Inject tracking into email HTML
 * Removed tracking pixel injection - only wraps links now
 */
export function injectTracking(emailHtml: string, emailLogId: string): string {
  let trackedHtml = emailHtml

  // Only wrap links with click tracking now

  // Wrap all links with click tracking
  const linkRegex = /<a\s+([^>]*href=["']([^"']+)["'][^>]*)>/gi
  trackedHtml = trackedHtml.replace(linkRegex, (match, attributes, url) => {
    // Skip unsubscribe links and already tracked links
    if (url.includes("unsubscribe") || url.includes("/track/")) {
      return match
    }
    const trackedUrl = wrapLinkWithTracking(emailLogId, url)
    return match.replace(url, trackedUrl)
  })

  return trackedHtml
}

/**
 * Track email open event via link click inference
 * Modified: Opens are now inferred from clicks since we removed the pixel
 * Note: This can still be called from API routes if you implement alternative open tracking
 */
export async function trackEmailOpen(emailLogId: string, userAgent?: string, ipAddress?: string) {
  try {
    const emailLog = await db.emailLog.findUnique({
      where: { id: emailLogId },
      include: { prospect: true },
    })

    if (!emailLog) {
      logger.warn("Email log not found for tracking", { emailLogId })
      return { success: false, error: "Email log not found" }
    }

    // Update email log with open event
    await db.emailLog.update({
      where: { id: emailLogId },
      data: {
        status: "OPENED",
        openedAt: emailLog.openedAt || new Date(), // Only set first open
        opens: { increment: 1 },
      },
    })

    // Update prospect status and engagement
    if (emailLog.prospectId) {
      await db.prospect.update({
        where: { id: emailLog.prospectId },
        data: {
          status: "CONTACTED",
          lastContactedAt: new Date(),
          emailsOpened: { increment: 1 },
        },
      })
    }

    logger.info("Email open tracked", { emailLogId, userAgent, ipAddress })

    // Trigger automation for email opened
    try {
      await triggerEmailAutomation('EMAIL_OPENED', emailLog.prospect.userId, emailLogId, {
        prospectId: emailLog.prospectId || '',
        subject: emailLog.subject || '',
        campaignId: emailLog.prospect.campaignId ?? undefined,
        sequenceId: undefined,
        openCount: emailLog.opens ?? 1,
      })
    } catch (automationError) {
      logger.warn('Failed to trigger automation for email open', { error: automationError })
    }

    return { success: true }
  } catch (error) {
    logger.error("Failed to track email open", error as Error)
    return { success: false, error: "Failed to track email open" }
  }
}

/**
 * Track link click event
 * Enhanced to also mark email as opened when clicked
 */
export async function trackLinkClick(emailLogId: string, linkUrl: string, userAgent?: string, ipAddress?: string) {
  try {
    const emailLog = await db.emailLog.findUnique({
      where: { id: emailLogId },
      include: { prospect: true },
    })

    if (!emailLog) {
      logger.warn("Email log not found for tracking", { emailLogId })
      return { success: false, error: "Email log not found", redirectUrl: linkUrl }
    }

    const updateData: any = {
      clickedAt: emailLog.clickedAt || new Date(), // Only set first click
      clicks: { increment: 1 },
    }

    if (!emailLog.openedAt) {
      updateData.status = "OPENED"
      updateData.openedAt = new Date()
      updateData.opens = 1
    }

    // Update email log with click event
    await db.emailLog.update({
      where: { id: emailLogId },
      data: updateData,
    })

    if (emailLog.prospectId) {
      const prospectUpdate: any = {
        status: "CONTACTED",
        lastContactedAt: new Date(),
        emailsClicked: { increment: 1 },
      }

      if (!emailLog.openedAt) {
        prospectUpdate.emailsOpened = { increment: 1 }
      }

      await db.prospect.update({
        where: { id: emailLog.prospectId },
        data: prospectUpdate,
      })
    }

    logger.info("Link click tracked", { emailLogId, linkUrl, userAgent, ipAddress })

    // Trigger automation for email clicked
    try {
      await triggerEmailAutomation('EMAIL_CLICKED', emailLog.prospect.userId, emailLogId, {
        prospectId: emailLog.prospectId || '',
        subject: emailLog.subject || '',
        campaignId: emailLog.prospect.campaignId ?? undefined,
        sequenceId: undefined,
        clickedUrl: linkUrl,
      })
    } catch (automationError) {
      logger.warn('Failed to trigger automation for email click', { error: automationError })
    }

    return { success: true, redirectUrl: linkUrl }
  } catch (error) {
    logger.error("Failed to track link click", error as Error)
    return { success: false, error: "Failed to track link click", redirectUrl: linkUrl }
  }
}

export const emailTracking = {
  wrapLinkWithTracking,
  injectTracking,
  trackEmailOpen,
  trackLinkClick,
}
