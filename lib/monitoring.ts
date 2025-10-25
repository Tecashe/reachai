import { logger } from "./logger"

interface MetricData {
  name: string
  value: number
  tags?: Record<string, string>
  timestamp?: Date
}

interface ErrorData {
  error: Error
  context?: Record<string, any>
  severity?: "low" | "medium" | "high" | "critical"
  userId?: string
}

class MonitoringService {
  // Track custom metrics
  trackMetric(data: MetricData): void {
    const { name, value, tags, timestamp = new Date() } = data

    // Log metric
    logger.info(`Metric: ${name}`, {
      metric: name,
      value,
      tags,
      timestamp: timestamp.toISOString(),
    })

    // In production, send to monitoring service (Datadog, New Relic, etc.)
    if (process.env.NODE_ENV === "production") {
      // Example: Send to external monitoring service
      // datadog.gauge(name, value, tags)
    }
  }

  // Track errors with context
  trackError(data: ErrorData): void {
    const { error, context, severity = "medium", userId } = data

    logger.error(error.message, error, {
      ...context,
      severity,
      userId,
      stack: error.stack,
    })

    // In production, send to error tracking service (Sentry)
    if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN) {
      // Sentry.captureException(error, { contexts: { custom: context }, user: { id: userId } })
    }

    // Send Slack notification for critical errors
    if (severity === "critical" && process.env.SLACK_WEBHOOK_URL) {
      this.sendSlackAlert({
        title: "Critical Error",
        message: error.message,
        context,
      })
    }
  }

  // Track user events
  trackEvent(userId: string, eventName: string, properties?: Record<string, any>): void {
    logger.info(`Event: ${eventName}`, {
      userId,
      event: eventName,
      properties,
    })

    // In production, send to analytics service (PostHog, Mixpanel, etc.)
    if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      // posthog.capture(userId, eventName, properties)
    }
  }

  // Track API performance
  trackApiPerformance(endpoint: string, duration: number, status: number): void {
    this.trackMetric({
      name: "api.response_time",
      value: duration,
      tags: {
        endpoint,
        status: status.toString(),
      },
    })

    // Alert if response time is too slow
    if (duration > 5000) {
      logger.warn("Slow API response", {
        endpoint,
        duration,
        status,
      })
    }
  }

  // Track email sending metrics
  trackEmailSent(success: boolean, provider: string, userId: string): void {
    this.trackMetric({
      name: "email.sent",
      value: 1,
      tags: {
        success: success.toString(),
        provider,
      },
    })

    this.trackEvent(userId, "email_sent", {
      success,
      provider,
    })
  }

  // Track campaign metrics
  trackCampaignLaunched(userId: string, campaignId: string, prospectCount: number): void {
    this.trackEvent(userId, "campaign_launched", {
      campaignId,
      prospectCount,
    })

    this.trackMetric({
      name: "campaign.launched",
      value: 1,
      tags: {
        userId,
      },
    })
  }

  // Track credit usage
  trackCreditUsage(userId: string, creditType: string, amount: number): void {
    this.trackMetric({
      name: "credits.used",
      value: amount,
      tags: {
        userId,
        type: creditType,
      },
    })
  }

  // Track subscription events
  trackSubscription(userId: string, action: string, tier: string): void {
    this.trackEvent(userId, `subscription_${action}`, {
      tier,
    })

    this.trackMetric({
      name: "subscription.event",
      value: 1,
      tags: {
        action,
        tier,
      },
    })
  }

  // Send Slack alert
  private async sendSlackAlert(data: {
    title: string
    message: string
    context?: Record<string, any>
  }): Promise<void> {
    if (!process.env.SLACK_WEBHOOK_URL) return

    try {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `*${data.title}*\n${data.message}`,
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: data.title,
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: data.message,
              },
            },
            ...(data.context
              ? [
                  {
                    type: "section",
                    fields: Object.entries(data.context).map(([key, value]) => ({
                      type: "mrkdwn",
                      text: `*${key}:*\n${value}`,
                    })),
                  },
                ]
              : []),
          ],
        }),
      })
    } catch (error) {
      logger.error("Failed to send Slack alert", error as Error)
    }
  }

  // Health check
  async healthCheck(): Promise<{
    status: "healthy" | "degraded" | "unhealthy"
    checks: Record<string, boolean>
  }> {
    const checks: Record<string, boolean> = {}

    // Check database
    try {
      const { db } = await import("./db")
      await db.$queryRaw`SELECT 1`
      checks.database = true
    } catch {
      checks.database = false
    }

    // Check external services
    checks.openai = !!process.env.OPENAI_API_KEY
    checks.resend = !!process.env.RESEND_API_KEY
    checks.stripe = !!process.env.STRIPE_SECRET_KEY

    const allHealthy = Object.values(checks).every((check) => check)
    const someHealthy = Object.values(checks).some((check) => check)

    return {
      status: allHealthy ? "healthy" : someHealthy ? "degraded" : "unhealthy",
      checks,
    }
  }
}

export const monitoring = new MonitoringService()
