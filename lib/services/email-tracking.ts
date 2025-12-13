
// import { db } from "@/lib/db"
// import { logger } from "@/lib/logger"

// export class EmailTrackingService {
//   /**
//    * Generate tracking pixel URL for open tracking
//    */
//   generateTrackingPixel(emailLogId: string): string {
//     const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.mailfra.com"
//     return `${baseUrl}/api/track/open/${emailLogId}/pixel.gif`
//   }

//   /**
//    * Generate tracked link for click tracking
//    */
//   generateTrackedLink(emailLogId: string, originalUrl: string): string {
//     const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.mailfra.com"
//     const encoded = encodeURIComponent(originalUrl)
//     return `${baseUrl}/api/track/click/${emailLogId}?url=${encoded}`
//   }

//   /**
//    * Inject tracking pixel into email HTML
//    */
//   injectTrackingPixel(htmlBody: string, emailLogId: string): string {
//     const pixelUrl = this.generateTrackingPixel(emailLogId)
//     const trackingPixel = `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:none;" />`

//     // Try to inject before closing </body> tag
//     if (htmlBody.includes("</body>")) {
//       return htmlBody.replace("</body>", `${trackingPixel}</body>`)
//     }

//     // Otherwise append to end
//     return htmlBody + trackingPixel
//   }

//   /**
//    * Wrap all links in email with tracking
//    */
//   injectLinkTracking(htmlBody: string, emailLogId: string): string {
//     // Regex to find all href attributes
//     const hrefRegex = /href="([^"]+)"/g

//     return htmlBody.replace(hrefRegex, (match, url) => {
//       // Don't track tracking pixels or unsubscribe links
//       if (url.includes("/track/") || url.includes("unsubscribe")) {
//         return match
//       }

//       const trackedUrl = this.generateTrackedLink(emailLogId, url)
//       return `href="${trackedUrl}"`
//     })
//   }

//   /**
//    * Record email open
//    */
//   async recordOpen(emailLogId: string): Promise<void> {
//     try {
//       const emailLog = await db.emailLog.findUnique({
//         where: { id: emailLogId },
//         include: { prospect: { include: { campaign: true } } },
//       })

//       if (!emailLog) {
//         // logger.error("Email log not found for open tracking", { emailLogId })
//         logger.error("Email log not found for open tracking")
//         return
//       }

//       // Update email log
//       await db.emailLog.update({
//         where: { id: emailLogId },
//         data: {
//           status: "OPENED",
//           openedAt: emailLog.openedAt || new Date(), // Only set first open time
//           opens: { increment: 1 },
//         },
//       })

//       // Update prospect
//       await db.prospect.update({
//         where: { id: emailLog.prospectId },
//         data: {
//           emailsOpened: { increment: 1 },
//         },
//       })

//       // Update campaign stat
//       if (emailLog.prospect.campaignId) {
//         await db.campaign.update({
//           where: { id: emailLog.prospect.campaignId },
//           data: {
//             emailsOpened: { increment: 1 },
//           },
//         })
//       }

//       logger.info("Email open recorded", { emailLogId, prospectId: emailLog.prospectId })
//     } catch (error) {
//       logger.error("Failed to record email open", error as Error, { emailLogId })
//     }
//   }

//   /**
//    * Record link click
//    */
//   async recordClick(emailLogId: string, clickedUrl: string): Promise<void> {
//     try {
//       const emailLog = await db.emailLog.findUnique({
//         where: { id: emailLogId },
//         include: { prospect: { include: { campaign: true } } },
//       })

//       if (!emailLog) {
//         // logger.error("Email log not found for click tracking", { emailLogId })
//         logger.error("Email log not found for click tracking")
//         return
//       }

//       // Update email lo
//       await db.emailLog.update({
//         where: { id: emailLogId },
//         data: {
//           clickedAt: emailLog.clickedAt || new Date(), // Only set first click tim
//           clicks: { increment: 1 },
//         },
//       })

//       // Update prospect
//       await db.prospect.update({
//         where: { id: emailLog.prospectId },
//         data: {
//           emailsClicked: { increment: 1 },
//         },
//       })

//       // Update campaign stats
//       if (emailLog.prospect.campaignId) {
//         await db.campaign.update({
//           where: { id: emailLog.prospect.campaignId },
//           data: {
//             emailsClicked: { increment: 1 },
//           },
//         })
//       }

//       logger.info("Email click recorded", {
//         emailLogId,
//         prospectId: emailLog.prospectId,
//         clickedUrl,
//       })
//     } catch (error) {
//       logger.error("Failed to record email click", error as Error, { emailLogId })
//     }
//   }
// }

// export const emailTracking = new EmailTrackingService()











// import { db } from "@/lib/db"
// import { logger } from "@/lib/logger"

// /**
//  * Generate tracking pixel URL for open tracking
//  */
// export function generateTrackingPixelUrl(emailLogId: string): string {
//   const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.mailfra.com"
//   return `${baseUrl}/api/track/open/${emailLogId}/pixel.gif`
// }

// /**
//  * Wrap URL with click tracking
//  */
// export function wrapLinkWithTracking(emailLogId: string, originalUrl: string): string {
//   const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.mailfra.com"
//   const encodedUrl = encodeURIComponent(originalUrl)
//   return `${baseUrl}/api/track/click/${emailLogId}?url=${encodedUrl}`
// }

// /**
//  * Inject tracking into email HTML
//  */
// export function injectTracking(emailHtml: string, emailLogId: string): string {
//   let trackedHtml = emailHtml

//   // Add tracking pixel at the end of the email
//   const trackingPixel = `<img src="${generateTrackingPixelUrl(emailLogId)}" width="1" height="1" style="display:none;" alt="" />`

//   // Try to inject before </body> tag
//   if (trackedHtml.includes("</body>")) {
//     trackedHtml = trackedHtml.replace("</body>", `${trackingPixel}</body>`)
//   } else {
//     // Otherwise append to end
//     trackedHtml += trackingPixel
//   }

//   // Wrap all links with click tracking
//   const linkRegex = /<a\s+([^>]*href=["']([^"']+)["'][^>]*)>/gi
//   trackedHtml = trackedHtml.replace(linkRegex, (match, attributes, url) => {
//     // Skip unsubscribe links and already tracked links
//     if (url.includes("unsubscribe") || url.includes("/track/")) {
//       return match
//     }
//     const trackedUrl = wrapLinkWithTracking(emailLogId, url)
//     return match.replace(url, trackedUrl)
//   })

//   return trackedHtml
// }

// /**
//  * Track email open event
//  * Note: This is called from API routes, not directly from client
//  */
// export async function trackEmailOpen(emailLogId: string, userAgent?: string, ipAddress?: string) {
//   try {
//     const emailLog = await db.emailLog.findUnique({
//       where: { id: emailLogId },
//       include: { prospect: true },
//     })

//     if (!emailLog) {
//       logger.warn("Email log not found for tracking", { emailLogId })
//       return { success: false, error: "Email log not found" }
//     }

//     // Update email log with open event
//     await db.emailLog.update({
//       where: { id: emailLogId },
//       data: {
//         status: "OPENED",
//         openedAt: emailLog.openedAt || new Date(), // Only set first open
//         opens: { increment: 1 },
//       },
//     })

//     // Update prospect status and engagement
//     if (emailLog.prospectId) {
//       await db.prospect.update({
//         where: { id: emailLog.prospectId },
//         data: {
//           status: "CONTACTED",
//           lastContactedAt: new Date(),
//           emailsOpened: { increment: 1 },
//         },
//       })
//     }

//     logger.info("Email open tracked", { emailLogId, userAgent, ipAddress })

//     return { success: true }
//   } catch (error) {
//     logger.error("Failed to track email open", error as Error)
//     return { success: false, error: "Failed to track email open" }
//   }
// }

// /**
//  * Track link click event
//  * Note: This is called from API routes, not directly from client
//  */
// export async function trackLinkClick(emailLogId: string, linkUrl: string, userAgent?: string, ipAddress?: string) {
//   try {
//     const emailLog = await db.emailLog.findUnique({
//       where: { id: emailLogId },
//       include: { prospect: true },
//     })

//     if (!emailLog) {
//       logger.warn("Email log not found for tracking", { emailLogId })
//       return { success: false, error: "Email log not found", redirectUrl: linkUrl }
//     }

//     // Update email log with click event
//     await db.emailLog.update({
//       where: { id: emailLogId },
//       data: {
//         clickedAt: emailLog.clickedAt || new Date(), // Only set first click
//         clicks: { increment: 1 },
//       },
//     })

//     // Update prospect engagement
//     if (emailLog.prospectId) {
//       await db.prospect.update({
//         where: { id: emailLog.prospectId },
//         data: {
//           status: "CONTACTED",
//           lastContactedAt: new Date(),
//           emailsClicked: { increment: 1 },
//         },
//       })
//     }

//     logger.info("Link click tracked", { emailLogId, linkUrl, userAgent, ipAddress })

//     return { success: true, redirectUrl: linkUrl }
//   } catch (error) {
//     logger.error("Failed to track link click", error as Error)
//     return { success: false, error: "Failed to track link click", redirectUrl: linkUrl }
//   }
// }

// export const emailTracking = {
//   generateTrackingPixelUrl,
//   wrapLinkWithTracking,
//   injectTracking,
//   trackEmailOpen,
//   trackLinkClick,
// }

import { db } from "@/lib/db"
import { logger } from "@/lib/logger"

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
