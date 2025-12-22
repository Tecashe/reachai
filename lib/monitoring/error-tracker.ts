
interface ErrorContext {
  userId?: string
  apiKeyId?: string
  endpoint?: string
  method?: string
  requestBody?: any
  userAgent?: string
  ipAddress?: string
  [key: string]: any
}

class ErrorTracker {
  private enabled: boolean

  constructor() {
    this.enabled = process.env.NODE_ENV === "production"
  }

  captureException(error: Error, context?: ErrorContext) {
    console.error("[ERROR]", error.message, context)

    if (this.enabled) {
      this.logToDatabase(error, context).catch(console.error)

      if (process.env.SENTRY_DSN) {
        try {
          // Dynamically import Sentry to avoid bundle issues
          import("@sentry/nextjs").then((Sentry) => {
            Sentry.captureException(error, {
              contexts: { custom: context },
              tags: {
                userId: context?.userId,
                apiKeyId: context?.apiKeyId,
                endpoint: context?.endpoint,
              },
            })
          })
        } catch (err) {
          console.error("[ERROR TRACKER] Failed to send to Sentry:", err)
        }
      }
    }
  }

  captureMessage(message: string, level: "info" | "warning" | "error" = "info", context?: ErrorContext) {
    console.log(`[${level.toUpperCase()}]`, message, context)

    if (this.enabled && level === "error") {
      this.logToDatabase(new Error(message), context).catch(console.error)
    }
  }

  private async logToDatabase(error: Error, context?: ErrorContext) {
    try {
      const { db } = await import("@/lib/db")

      const fingerprint = this.generateFingerprint(error, context)

      await db.errorLog.create({
        data: {
          message: error.message,
          stack: error.stack || "",
          errorType: error.name,
          userId: context?.userId,
          apiKeyId: context?.apiKeyId,
          endpoint: context?.endpoint,
          method: context?.method,
          requestBody: context?.requestBody,
          userAgent: context?.userAgent,
          ipAddress: context?.ipAddress,
          fingerprint,
        },
      })
    } catch (err) {
      console.error("[ERROR TRACKER] Failed to log to database:", err)
    }
  }

  private generateFingerprint(error: Error, context?: ErrorContext): string {
    const parts = [error.name, error.message.substring(0, 100), context?.endpoint || ""]
    const crypto = require("crypto")
    return crypto.createHash("md5").update(parts.join(":")).digest("hex")
  }

  setUser(userId: string) {
    if (this.enabled && process.env.SENTRY_DSN) {
      import("@sentry/nextjs").then((Sentry) => {
        Sentry.setUser({ id: userId })
      })
    }
  }

  clearUser() {
    if (this.enabled && process.env.SENTRY_DSN) {
      import("@sentry/nextjs").then((Sentry) => {
        Sentry.setUser(null)
      })
    }
  }
}

export const errorTracker = new ErrorTracker()
