import { db } from "@/lib/db"
import crypto from "crypto"

export type WebhookEvent =
  | "campaign.created"
  | "campaign.launched"
  | "campaign.paused"
  | "campaign.completed"
  | "email.sent"
  | "email.opened"
  | "email.clicked"
  | "email.replied"
  | "email.bounced"
  | "prospect.created"
  | "prospect.updated"
  | "sequence.completed"

interface WebhookPayload {
  event: WebhookEvent
  data: any
  timestamp: string
  id: string
}

export class WebhookDeliveryService {
  private maxRetries = 5
  private retryDelays = [60, 300, 900, 3600, 7200] // 1m, 5m, 15m, 1h, 2h

  async triggerEvent(userId: string, event: WebhookEvent, data: any) {
    try {
      const webhooks = await db.webhook.findMany({
        where: {
          userId,
          isActive: true, // Changed from 'active' to 'isActive' to match schema
          events: {
            has: event,
          },
        },
      })

      const payload: WebhookPayload = {
        event,
        data,
        timestamp: new Date().toISOString(),
        id: crypto.randomUUID(),
      }

      for (const webhook of webhooks) {
        await this.queueDelivery(webhook.id, payload)
      }
    } catch (error) {
      console.error("[WEBHOOK] Failed to trigger event:", error)
    }
  }

  private async queueDelivery(webhookId: string, payload: WebhookPayload) {
    try {
      await db.webhookDelivery.create({
        data: {
          webhookId,
          eventType: payload.event, // Changed from 'event' to 'eventType' to match schema
          payload: payload as any, // Cast to any to satisfy Json type
          status: "PENDING", // Changed to uppercase enum value
          attempts: 0,
          nextRetryAt: new Date(),
        },
      })
    } catch (error) {
      console.error("[WEBHOOK] Failed to queue delivery:", error)
    }
  }

  async processDeliveries() {
    const pending = await db.webhookDelivery.findMany({
      where: {
        status: "PENDING", // Changed to uppercase enum value
        nextRetryAt: {
          lte: new Date(),
        },
        attempts: {
          lt: this.maxRetries,
        },
      },
      include: {
        webhook: true,
      },
      take: 50,
    })

    for (const delivery of pending) {
      await this.deliverWebhook(delivery)
    }
  }

  private async deliverWebhook(delivery: any) {
    try {
      const signature = this.generateSignature(delivery.payload, delivery.webhook.secret)

      const response = await fetch(delivery.webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signature,
          "X-Webhook-Event": delivery.eventType, // Changed from event to eventType
          "X-Webhook-ID": delivery.id,
          "User-Agent": "MailFra-Webhooks/1.0",
        },
        body: JSON.stringify(delivery.payload),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      })

      const responseBody = await response.text().catch(() => "")

      if (response.ok) {
        await db.webhookDelivery.update({
          where: { id: delivery.id },
          data: {
            status: "DELIVERED", // Changed to uppercase enum value
            responseStatus: response.status,
            responseBody: responseBody.slice(0, 1000),
            deliveredAt: new Date(), // Use deliveredAt instead of lastAttemptAt
          },
        })
      } else {
        await this.handleFailure(delivery, response.status, responseBody)
      }
    } catch (error: any) {
      await this.handleFailure(delivery, 0, error.message)
    }
  }

  private async handleFailure(delivery: any, statusCode: number, errorMessage: string) {
    const attempts = delivery.attempts + 1

    if (attempts >= this.maxRetries) {
      await db.webhookDelivery.update({
        where: { id: delivery.id },
        data: {
          status: "FAILED", // Changed to uppercase enum value
          attempts,
          responseStatus: statusCode,
          errorMessage: errorMessage.slice(0, 1000), // Use errorMessage field
        },
      })
    } else {
      const nextRetryDelay = this.retryDelays[attempts - 1] || 7200
      const nextRetryAt = new Date(Date.now() + nextRetryDelay * 1000)

      await db.webhookDelivery.update({
        where: { id: delivery.id },
        data: {
          status: "RETRY", // Changed to uppercase enum value
          attempts,
          responseStatus: statusCode,
          errorMessage: errorMessage.slice(0, 1000), // Use errorMessage field
          nextRetryAt,
        },
      })
    }
  }

  private generateSignature(payload: any, secret: string): string {
    const hmac = crypto.createHmac("sha256", secret)
    hmac.update(JSON.stringify(payload))
    return hmac.digest("hex")
  }

  static verifySignature(payload: string, signature: string, secret: string): boolean {
    const hmac = crypto.createHmac("sha256", secret)
    hmac.update(payload)
    const expected = hmac.digest("hex")
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  }
}

export const webhookService = new WebhookDeliveryService()
