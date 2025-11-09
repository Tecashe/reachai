"use server"

import { db } from "@/lib/db"
import { logger } from "@/lib/logger"

export class EmailTrackingService {
  /**
   * Generate tracking pixel URL for open tracking
   */
  generateTrackingPixel(emailLogId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.reachai.com"
    return `${baseUrl}/api/track/open/${emailLogId}/pixel.gif`
  }

  /**
   * Generate tracked link for click tracking
   */
  generateTrackedLink(emailLogId: string, originalUrl: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.reachai.com"
    const encoded = encodeURIComponent(originalUrl)
    return `${baseUrl}/api/track/click/${emailLogId}?url=${encoded}`
  }

  /**
   * Inject tracking pixel into email HTML
   */
  injectTrackingPixel(htmlBody: string, emailLogId: string): string {
    const pixelUrl = this.generateTrackingPixel(emailLogId)
    const trackingPixel = `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:none;" />`

    // Try to inject before closing </body> tag
    if (htmlBody.includes("</body>")) {
      return htmlBody.replace("</body>", `${trackingPixel}</body>`)
    }

    // Otherwise append to end
    return htmlBody + trackingPixel
  }

  /**
   * Wrap all links in email with tracking
   */
  injectLinkTracking(htmlBody: string, emailLogId: string): string {
    // Regex to find all href attributes
    const hrefRegex = /href="([^"]+)"/g

    return htmlBody.replace(hrefRegex, (match, url) => {
      // Don't track tracking pixels or unsubscribe links
      if (url.includes("/track/") || url.includes("unsubscribe")) {
        return match
      }

      const trackedUrl = this.generateTrackedLink(emailLogId, url)
      return `href="${trackedUrl}"`
    })
  }

  /**
   * Record email open
   */
  async recordOpen(emailLogId: string): Promise<void> {
    try {
      const emailLog = await db.emailLog.findUnique({
        where: { id: emailLogId },
        include: { prospect: { include: { campaign: true } } },
      })

      if (!emailLog) {
        // logger.error("Email log not found for open tracking", { emailLogId })
        logger.error("Email log not found for open tracking")
        return
      }

      // Update email log
      await db.emailLog.update({
        where: { id: emailLogId },
        data: {
          status: "OPENED",
          openedAt: emailLog.openedAt || new Date(), // Only set first open time
          opens: { increment: 1 },
        },
      })

      // Update prospect
      await db.prospect.update({
        where: { id: emailLog.prospectId },
        data: {
          emailsOpened: { increment: 1 },
        },
      })

      // Update campaign stat
      if (emailLog.prospect.campaignId) {
        await db.campaign.update({
          where: { id: emailLog.prospect.campaignId },
          data: {
            emailsOpened: { increment: 1 },
          },
        })
      }

      logger.info("Email open recorded", { emailLogId, prospectId: emailLog.prospectId })
    } catch (error) {
      logger.error("Failed to record email open", error as Error, { emailLogId })
    }
  }

  /**
   * Record link click
   */
  async recordClick(emailLogId: string, clickedUrl: string): Promise<void> {
    try {
      const emailLog = await db.emailLog.findUnique({
        where: { id: emailLogId },
        include: { prospect: { include: { campaign: true } } },
      })

      if (!emailLog) {
        // logger.error("Email log not found for click tracking", { emailLogId })
        logger.error("Email log not found for click tracking")
        return
      }

      // Update email lo
      await db.emailLog.update({
        where: { id: emailLogId },
        data: {
          clickedAt: emailLog.clickedAt || new Date(), // Only set first click tim
          clicks: { increment: 1 },
        },
      })

      // Update prospect
      await db.prospect.update({
        where: { id: emailLog.prospectId },
        data: {
          emailsClicked: { increment: 1 },
        },
      })

      // Update campaign stats
      if (emailLog.prospect.campaignId) {
        await db.campaign.update({
          where: { id: emailLog.prospect.campaignId },
          data: {
            emailsClicked: { increment: 1 },
          },
        })
      }

      logger.info("Email click recorded", {
        emailLogId,
        prospectId: emailLog.prospectId,
        clickedUrl,
      })
    } catch (error) {
      logger.error("Failed to record email click", error as Error, { emailLogId })
    }
  }
}

export const emailTracking = new EmailTrackingService()
