import { db } from "../db"
import { logger } from "../logger"

// Timezone mappings for common locations
const TIMEZONE_MAP: Record<string, string> = {
  // US
  "new york": "America/New_York",
  "los angeles": "America/Los_Angeles",
  chicago: "America/Chicago",
  "san francisco": "America/Los_Angeles",
  boston: "America/New_York",
  seattle: "America/Los_Angeles",
  austin: "America/Chicago",
  denver: "America/Denver",

  // Europe
  london: "Europe/London",
  paris: "Europe/Paris",
  berlin: "Europe/Berlin",
  amsterdam: "Europe/Amsterdam",
  madrid: "Europe/Madrid",
  rome: "Europe/Rome",

  // Asia
  tokyo: "Asia/Tokyo",
  singapore: "Asia/Singapore",
  "hong kong": "Asia/Hong_Kong",
  sydney: "Australia/Sydney",
  mumbai: "Asia/Kolkata",
  dubai: "Asia/Dubai",
}

class TimezoneDetector {
  detectTimezone(location?: string, websiteUrl?: string): string {
    // Try location first
    if (location) {
      const normalizedLocation = location.toLowerCase()

      for (const [city, timezone] of Object.entries(TIMEZONE_MAP)) {
        if (normalizedLocation.includes(city)) {
          logger.info("Timezone detected from location", { location, timezone })
          return timezone
        }
      }
    }

    // Try to detect from website TLD
    if (websiteUrl) {
      const tld = this.extractTLD(websiteUrl)
      const timezone = this.timezoneFromTLD(tld)
      if (timezone) {
        logger.info("Timezone detected from TLD", { websiteUrl, tld, timezone })
        return timezone
      }
    }

    // Default to US Eastern
    return "America/New_York"
  }

  private extractTLD(url: string): string {
    try {
      const domain = new URL(url).hostname
      const parts = domain.split(".")
      return parts[parts.length - 1]
    } catch {
      return ""
    }
  }

  private timezoneFromTLD(tld: string): string | null {
    const tldMap: Record<string, string> = {
      uk: "Europe/London",
      de: "Europe/Berlin",
      fr: "Europe/Paris",
      jp: "Asia/Tokyo",
      au: "Australia/Sydney",
      sg: "Asia/Singapore",
      in: "Asia/Kolkata",
      ca: "America/Toronto",
    }

    return tldMap[tld] || null
  }

  async updateProspectTimezone(prospectId: string): Promise<void> {
    const prospect = await db.prospect.findUnique({
      where: { id: prospectId },
    })

    if (!prospect || prospect.timezone) {
      return // Already has timezone
    }

    const timezone = this.detectTimezone(prospect.location || undefined, prospect.websiteUrl || undefined)

    await db.prospect.update({
      where: { id: prospectId },
      data: {
        timezone,
        timezoneDetectedAt: new Date(),
      },
    })

    logger.info("Prospect timezone updated", { prospectId, timezone })
  }

  getOptimalSendTime(timezone: string, preferredHour = 10): Date {
    const now = new Date()
    const targetDate = new Date(now)

    // Convert to target timezone and set to preferred hour
    const targetTime = new Date(targetDate.toLocaleString("en-US", { timeZone: timezone }))

    targetTime.setHours(preferredHour, 0, 0, 0)

    // If time has passed today, schedule for tomorrow
    if (targetTime < now) {
      targetTime.setDate(targetTime.getDate() + 1)
    }

    // Skip weekends
    const day = targetTime.getDay()
    if (day === 0) {
      // Sunday -> Monday
      targetTime.setDate(targetTime.getDate() + 1)
    } else if (day === 6) {
      // Saturday -> Monday
      targetTime.setDate(targetTime.getDate() + 2)
    }

    return targetTime
  }

  isBusinessHours(date: Date, timezone: string): boolean {
    const localTime = new Date(date.toLocaleString("en-US", { timeZone: timezone }))
    const hour = localTime.getHours()
    const day = localTime.getDay()

    // Monday-Friday, 9 AM - 5 PM
    const isWeekday = day >= 1 && day <= 5
    const isWorkingHours = hour >= 9 && hour < 17

    return isWeekday && isWorkingHours
  }
}

export const timezoneDetector = new TimezoneDetector()
