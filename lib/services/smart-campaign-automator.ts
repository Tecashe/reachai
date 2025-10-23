import { db } from "../db"
import { logger } from "../logger"
import { emailSender } from "./email-sender"

interface AutomationRule {
  trigger: "no_open" | "no_reply" | "opened" | "clicked" | "replied"
  delayHours: number
  action: "send_followup" | "pause_campaign" | "update_status" | "notify_user"
  templateId?: string
}

class SmartCampaignAutomator {
  async processAutomations(): Promise<void> {
    logger.info("Processing campaign automations")

    // Get all active campaigns with automation rules
    const campaigns = await db.campaign.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        prospects: {
          include: {
            emailLogs: {
              orderBy: { sentAt: "desc" },
              take: 1,
            },
          },
        },
        emailSequences: {
          include: {
            template: true,
          },
          orderBy: { stepNumber: "asc" },
        },
      },
    })

    for (const campaign of campaigns) {
      await this.processCampaignAutomation(campaign)
    }

    logger.info("Campaign automations processed")
  }

  private async processCampaignAutomation(campaign: any): Promise<void> {
    const now = new Date()

    for (const prospect of campaign.prospects) {
      const lastEmail = prospect.emailLogs[0]

      if (!lastEmail || !lastEmail.sentAt) continue

      const hoursSinceLastEmail = (now.getTime() - lastEmail.sentAt.getTime()) / (1000 * 60 * 60)

      // Auto-pause campaign if prospect replied
      if (lastEmail.repliedAt && campaign.status === "ACTIVE") {
        await this.pauseCampaignForProspect(campaign.id, prospect.id)
        continue
      }

      // Send follow-up if no reply after X days
      const nextSequence = campaign.emailSequences.find((seq: any) => seq.stepNumber === prospect.currentStep + 1)

      if (nextSequence && hoursSinceLastEmail >= nextSequence.delayDays * 24) {
        // Check conditions
        if (nextSequence.sendOnlyIfNotReplied && lastEmail.repliedAt) continue
        if (nextSequence.sendOnlyIfNotOpened && lastEmail.openedAt) continue

        await this.sendFollowUp(prospect, nextSequence.template, campaign)
      }
    }
  }

  private async pauseCampaignForProspect(campaignId: string, prospectId: string): Promise<void> {
    await db.prospect.update({
      where: { id: prospectId },
      data: {
        status: "REPLIED",
      },
    })

    logger.info("Campaign paused for prospect due to reply", { campaignId, prospectId })
  }

  private async sendFollowUp(prospect: any, template: any, campaign: any): Promise<void> {
    // Replace template variables
    let subject = template.subject
    let body = template.body

    const replacements: Record<string, string> = {
      "{{firstName}}": prospect.firstName || "",
      "{{lastName}}": prospect.lastName || "",
      "{{company}}": prospect.company || "",
      "{{jobTitle}}": prospect.jobTitle || "",
    }

    for (const [key, value] of Object.entries(replacements)) {
      subject = subject.replace(new RegExp(key, "g"), value)
      body = body.replace(new RegExp(key, "g"), value)
    }

    // Send email
    await emailSender.sendEmail({
      to: prospect.email,
      subject,
      html: body,
      prospectId: prospect.id,
      campaignId: campaign.id,
      trackingEnabled: campaign.trackOpens,
    })

    // Update prospect
    await db.prospect.update({
      where: { id: prospect.id },
      data: {
        currentStep: prospect.currentStep + 1,
        lastContactedAt: new Date(),
      },
    })

    logger.info("Follow-up sent automatically", {
      prospectId: prospect.id,
      step: prospect.currentStep + 1,
    })
  }

  async cleanProspectList(campaignId: string): Promise<void> {
    logger.info("Cleaning prospect list", { campaignId })

    // Remove bounced prospects
    await db.prospect.updateMany({
      where: {
        campaignId,
        bounced: true,
      },
      data: {
        status: "BOUNCED",
      },
    })

    // Remove unsubscribed prospects
    await db.prospect.updateMany({
      where: {
        campaignId,
        unsubscribed: true,
      },
      data: {
        status: "UNSUBSCRIBED",
      },
    })

    logger.info("Prospect list cleaned", { campaignId })
  }

  async scoreProspects(campaignId: string): Promise<void> {
    const prospects = await db.prospect.findMany({
      where: { campaignId },
      include: {
        emailLogs: true,
      },
    })

    for (const prospect of prospects) {
      let score = 0

      // Engagement scoring
      if (prospect.emailsOpened > 0) score += 20
      if (prospect.emailsClicked > 0) score += 30
      if (prospect.emailsReplied > 0) score += 50

      // Quality scoring
      if (prospect.qualityScore) score += prospect.qualityScore * 0.3

      // Recency scoring
      if (prospect.lastContactedAt) {
        const daysSinceContact = (Date.now() - prospect.lastContactedAt.getTime()) / (1000 * 60 * 60 * 24)
        if (daysSinceContact < 7) score += 10
      }

      // Update prospect with engagement score
      await db.prospect.update({
        where: { id: prospect.id },
        data: {
          qualityScore: Math.min(100, Math.round(score)),
        },
      })
    }

    logger.info("Prospects scored", { campaignId, count: prospects.length })
  }
}

export const smartCampaignAutomator = new SmartCampaignAutomator()
