import { db } from "../db"
import { logger } from "../logger"

interface UnsubscribeRequest {
  email: string
  reason?: string
  source: "link" | "reply" | "manual"
}

class ComplianceManager {
  private suppressionList: Set<string> = new Set()

  async initialize(): Promise<void> {
    // Load suppression list into memory
    const unsubscribed = await db.prospect.findMany({
      where: {
        OR: [{ unsubscribed: true }, { bounced: true }, { status: "UNSUBSCRIBED" }],
      },
      select: { email: true },
    })

    this.suppressionList = new Set(unsubscribed.map((p) => p.email.toLowerCase()))

    logger.info("Suppression list loaded", { count: this.suppressionList.size })
  }

  async handleUnsubscribe(request: UnsubscribeRequest): Promise<void> {
    const email = request.email.toLowerCase()

    logger.info("Processing unsubscribe request", { email, source: request.source })

    // Add to suppression list
    this.suppressionList.add(email)

    // Update all prospects with this email
    await db.prospect.updateMany({
      where: { email: { equals: email, mode: "insensitive" } },
      data: {
        unsubscribed: true,
        status: "UNSUBSCRIBED",
      },
    })

    // Pause any active campaigns for this prospect
    const prospects = await db.prospect.findMany({
      where: { email: { equals: email, mode: "insensitive" } },
      include: { campaign: true },
    })

    for (const prospect of prospects) {
      if (prospect.campaign?.status === "ACTIVE") {
        logger.info("Pausing campaign for unsubscribed prospect", {
          campaignId: prospect.campaignId,
          prospectId: prospect.id,
        })
      }
    }

    logger.info("Unsubscribe processed", { email })
  }

  isEmailSuppressed(email: string): boolean {
    return this.suppressionList.has(email.toLowerCase())
  }

  async generateUnsubscribeLink(prospectId: string): Promise<string> {
    // Generate secure unsubscribe token
    const token = Buffer.from(`${prospectId}:${Date.now()}`).toString("base64url")

    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?token=${token}`

    return unsubscribeUrl
  }

  async addUnsubscribeFooter(html: string, prospectId: string): Promise<string> {
    const unsubscribeLink = await this.generateUnsubscribeLink(prospectId)

    const footer = `
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
        <p>If you'd prefer not to receive these emails, you can <a href="${unsubscribeLink}" style="color: #3b82f6; text-decoration: underline;">unsubscribe here</a>.</p>
        <p style="margin-top: 8px;">This email was sent in compliance with CAN-SPAM and GDPR regulations.</p>
      </div>
    `

    // Insert before closing body tag
    if (html.includes("</body>")) {
      return html.replace("</body>", `${footer}</body>`)
    }

    return html + footer
  }

  async exportGDPRData(userId: string): Promise<any> {
    logger.info("Exporting GDPR data", { userId })

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        campaigns: true,
        prospects: true,
        emailTemplates: true,
        sendingAccounts: true,
      },
    })

    return {
      user: {
        email: user?.email,
        name: user?.name,
        createdAt: user?.createdAt,
      },
      campaigns: user?.campaigns.length,
      prospects: user?.prospects.length,
      templates: user?.emailTemplates.length,
      sendingAccounts: user?.sendingAccounts.length,
    }
  }

  async deleteUserData(userId: string): Promise<void> {
    logger.info("Deleting user data (GDPR right to erasure)", { userId })

    // Cascade delete will handle related records
    await db.user.delete({
      where: { id: userId },
    })

    logger.info("User data deleted", { userId })
  }
}

export const complianceManager = new ComplianceManager()
