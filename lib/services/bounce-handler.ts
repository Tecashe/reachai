import { db } from "../db"
import { logger } from "../logger"

interface BounceEvent {
  emailLogId: string
  bounceType: "HARD" | "SOFT" | "COMPLAINT"
  bounceReason?: string
  diagnosticCode?: string
  recipientEmail: string
}

class BounceHandler {
  async handleBounce(event: BounceEvent): Promise<void> {
    const { emailLogId, bounceType, bounceReason, diagnosticCode, recipientEmail } = event

    try {
      // Get email log
      const emailLog = await db.emailLog.findUnique({
        where: { id: emailLogId },
        include: {
          prospect: true,
          sendingAccount: true,
        },
      })

      if (!emailLog) {
        logger.error("Email log not found for bounce")
        return
      }

      // Create bounce record
      await db.emailBounce.create({
        data: {
          emailLogId,
          sendingAccountId: emailLog.sendingAccountId || "",
          bounceType,
          bounceReason,
          diagnosticCode,
          recipientEmail,
        },
      })

      // Update email log
      await db.emailLog.update({
        where: { id: emailLogId },
        data: {
          status: "BOUNCED",
          bouncedAt: new Date(),
          errorMessage: bounceReason,
        },
      })

      // Update prospect
      await db.prospect.update({
        where: { id: emailLog.prospectId },
        data: {
          bounced: true,
          status: bounceType === "HARD" ? "BOUNCED" : "ACTIVE",
        },
      })

      // Update sending account health
      if (emailLog.sendingAccountId) {
        await this.updateAccountHealth(emailLog.sendingAccountId, bounceType)
      }

      logger.info("Bounce handled", {
        emailLogId,
        bounceType,
        recipientEmail,
        accountId: emailLog.sendingAccountId,
      })
    } catch (error) {
      logger.error("Failed to handle bounce", error as Error, { emailLogId })
    }
  }

  private async updateAccountHealth(accountId: string, bounceType: string): Promise<void> {
    // Get bounce statistics
    const bounces = await db.emailBounce.findMany({
      where: {
        sendingAccountId: accountId,
        bouncedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    })

    const totalSent = await db.emailLog.count({
      where: {
        sendingAccountId: accountId,
        sentAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    })

    const hardBounces = bounces.filter((b) => b.bounceType === "HARD").length
    const complaints = bounces.filter((b) => b.bounceType === "COMPLAINT").length

    const bounceRate = totalSent > 0 ? (bounces.length / totalSent) * 100 : 0
    const complaintRate = totalSent > 0 ? (complaints / totalSent) * 100 : 0

    // Calculate health score (100 = perfect, 0 = terrible)
    let healthScore = 100
    healthScore -= bounceRate * 10 // -10 points per 1% bounce rate
    healthScore -= complaintRate * 20 // -20 points per 1% complaint rate
    healthScore = Math.max(0, Math.min(100, healthScore))

    // Update account
    await db.sendingAccount.update({
      where: { id: accountId },
      data: {
        bounceRate,
        spamComplaintRate: complaintRate,
        healthScore: Math.round(healthScore),
        lastHealthCheck: new Date(),
      },
    })

    // Pause account if health is critical
    if (healthScore < 50 || bounceRate > 5 || complaintRate > 0.5) {
      await db.sendingAccount.update({
        where: { id: accountId },
        data: {
          isActive: false,
          pausedReason: `Critical health: ${Math.round(healthScore)}% (Bounce: ${bounceRate.toFixed(1)}%, Complaints: ${complaintRate.toFixed(1)}%)`,
          pausedAt: new Date(),
        },
      })

    //   logger.error("Sending account paused due to poor health", {
    //     accountId,
    //     healthScore,
    //     bounceRate,
    //     complaintRate,
    //   })
    }

    logger.info("Account health updated", {
      accountId,
      healthScore,
      bounceRate,
      complaintRate,
    })
  }

  async getBounceStats(accountId: string) {
    const bounces = await db.emailBounce.findMany({
      where: { sendingAccountId: accountId },
      orderBy: { bouncedAt: "desc" },
      take: 100,
    })

    const hardBounces = bounces.filter((b) => b.bounceType === "HARD").length
    const softBounces = bounces.filter((b) => b.bounceType === "SOFT").length
    const complaints = bounces.filter((b) => b.bounceType === "COMPLAINT").length

    return {
      total: bounces.length,
      hard: hardBounces,
      soft: softBounces,
      complaints,
      recent: bounces.slice(0, 10),
    }
  }
}

export const bounceHandler = new BounceHandler()
