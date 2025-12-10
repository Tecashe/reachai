// import { db } from "@/lib/db"
// import { logger } from "@/lib/logger"
// import { emailSender } from "./email-sender"

// type ActionType = "send_email" | "add_tag" | "change_sequence" | "notify" | "pause" | "move_to_crm"

// interface AutomationAction {
//   type: ActionType
//   value?: string
//   delayHours?: number
// }

// interface PendingAction {
//   ruleId: string
//   prospectId: string
//   action: AutomationAction
//   executeAt: Date
// }

// class AutomationRuleExecutor {
//   private pendingActions: PendingAction[] = []

//   /**
//    * Process all active automation rules for all campaigns
//    * Called by cron job every 15 minutes
//    */
//   async processAllRules(): Promise<{ evaluated: number; triggered: number }> {
//     logger.info("Starting automation rule processing")

//     let evaluated = 0
//     let triggered = 0

//     // Get all active campaigns with automation rules
//     const campaigns = await db.campaign.findMany({
//       where: {
//         status: "ACTIVE",
//       },
//       include: {
//         sequenceAutomationRules: {
//           where: { isActive: true },
//           orderBy: { priority: "desc" },
//         },
//         prospects: {
//           where: {
//             status: "ACTIVE",
//           },
//           include: {
//             emailLogs: {
//               orderBy: { createdAt: "desc" },
//               take: 10,
//             },
//           },
//         },
//       },
//     })

//     for (const campaign of campaigns) {
//       for (const prospect of campaign.prospects) {
//         for (const rule of campaign.sequenceAutomationRules) {
//           evaluated++
//           const shouldTrigger = await this.evaluateRule(rule, prospect)

//           if (shouldTrigger) {
//             triggered++
//             await this.executeRule(rule, prospect, campaign)
//           }
//         }
//       }
//     }

//     // Process any pending delayed actions
//     await this.processPendingActions()

//     logger.info("Automation rule processing completed", { evaluated, triggered })
//     return { evaluated, triggered }
//   }

//   /**
//    * Evaluate if a rule should trigger for a prospect
//    */
//   private async evaluateRule(rule: any, prospect: any): Promise<boolean> {
//     const now = new Date()
//     const emailLogs = prospect.emailLogs || []
//     const latestEmail = emailLogs[0]

//     if (!latestEmail) return false

//     const hoursSinceLastEmail = latestEmail.sentAt
//       ? (now.getTime() - new Date(latestEmail.sentAt).getTime()) / (1000 * 60 * 60)
//       : 0

//     const timeWindow = rule.timeWindowHours || 48

//     switch (rule.triggerType) {
//       case "EMAIL_OPENED":
//         // Trigger if email was opened within time window
//         return latestEmail.openedAt && hoursSinceLastEmail <= timeWindow

//       case "EMAIL_CLICKED":
//         // Trigger if any link was clicked within time window
//         return latestEmail.clickedAt && hoursSinceLastEmail <= timeWindow

//       case "LINK_CLICKED":
//         // Trigger if specific link was clicked
//         // For now, check if any click happened - could enhance to track specific URLs
//         return latestEmail.clickedAt && hoursSinceLastEmail <= timeWindow

//       case "EMAIL_REPLIED":
//         // Trigger if prospect replied
//         return prospect.replied || latestEmail.repliedAt

//       case "NOT_OPENED":
//         // Trigger if email NOT opened after X hours
//         return !latestEmail.openedAt && hoursSinceLastEmail >= timeWindow

//       case "NOT_REPLIED":
//         // Trigger if NO reply after X hours
//         return !prospect.replied && !latestEmail.repliedAt && hoursSinceLastEmail >= timeWindow

//       case "TIME_ELAPSED":
//         // Trigger after X hours since last email
//         return hoursSinceLastEmail >= timeWindow

//       case "ENGAGEMENT_SCORE":
//         // Trigger based on engagement score threshold
//         const threshold = Number.parseInt(rule.triggerValue || "50")
//         const engagementScore = this.calculateEngagementScore(prospect, emailLogs)
//         return engagementScore >= threshold

//       default:
//         return false
//     }
//   }

//   /**
//    * Calculate engagement score for a prospect
//    */
//   private calculateEngagementScore(prospect: any, emailLogs: any[]): number {
//     let score = 0

//     // Opens contribute 20 points each (max 60)
//     score += Math.min(prospect.emailsOpened * 20, 60)

//     // Clicks contribute 30 points each (max 60)
//     score += Math.min(prospect.emailsClicked * 30, 60)

//     // Replies contribute 50 points
//     if (prospect.replied) score += 50

//     // Recent activity bonus
//     const lastOpened = emailLogs.find((e: any) => e.openedAt)
//     if (lastOpened) {
//       const hoursSinceOpen = (Date.now() - new Date(lastOpened.openedAt).getTime()) / (1000 * 60 * 60)
//       if (hoursSinceOpen < 24) score += 20
//       else if (hoursSinceOpen < 72) score += 10
//     }

//     return Math.min(score, 100)
//   }

//   /**
//    * Execute all actions for a triggered rule
//    */
//   private async executeRule(rule: any, prospect: any, campaign: any): Promise<void> {
//     const actions = (rule.actions as AutomationAction[]) || []

//     logger.info("Executing automation rule", {
//       ruleId: rule.id,
//       ruleName: rule.name,
//       prospectId: prospect.id,
//       actionCount: actions.length,
//     })

//     for (const action of actions) {
//       if (action.delayHours && action.delayHours > 0) {
//         // Schedule delayed action
//         this.pendingActions.push({
//           ruleId: rule.id,
//           prospectId: prospect.id,
//           action,
//           executeAt: new Date(Date.now() + action.delayHours * 60 * 60 * 1000),
//         })
//       } else {
//         // Execute immediately
//         await this.executeAction(action, prospect, campaign, rule)
//       }
//     }

//     // Update rule stats
//     await db.sequenceAutomationRule.update({
//       where: { id: rule.id },
//       data: {
//         timesTriggered: { increment: 1 },
//         lastTriggeredAt: new Date(),
//       },
//     })
//   }

//   /**
//    * Execute a single action
//    */
//   private async executeAction(action: AutomationAction, prospect: any, campaign: any, rule: any): Promise<void> {
//     switch (action.type) {
//       case "send_email":
//         await this.actionSendEmail(action.value, prospect, campaign)
//         break

//       case "add_tag":
//         await this.actionAddTag(action.value, prospect)
//         break

//       case "change_sequence":
//         await this.actionChangeSequence(action.value, prospect)
//         break

//       case "notify":
//         await this.actionNotify(campaign.userId, prospect, rule)
//         break

//       case "pause":
//         await this.actionPauseSequence(prospect)
//         break

//       case "move_to_crm":
//         await this.actionMoveToCRM(prospect, campaign)
//         break
//     }
//   }

//   private async actionSendEmail(templateId: string | undefined, prospect: any, campaign: any): Promise<void> {
//     if (!templateId) return

//     const template = await db.emailTemplate.findUnique({
//       where: { id: templateId },
//     })

//     if (!template) {
//       logger.warn("Template not found for automation action", { templateId })
//       return
//     }

//     // Replace variables
//     let subject = template.subject
//     let body = template.body

//     const replacements: Record<string, string> = {
//       "{{firstName}}": prospect.firstName || "",
//       "{{lastName}}": prospect.lastName || "",
//       "{{company}}": prospect.company || "",
//       "{{jobTitle}}": prospect.jobTitle || "",
//     }

//     for (const [key, value] of Object.entries(replacements)) {
//       subject = subject.replace(new RegExp(key, "g"), value)
//       body = body.replace(new RegExp(key, "g"), value)
//     }

//     await emailSender.sendEmail({
//       to: prospect.email,
//       subject,
//       html: body,
//       prospectId: prospect.id,
//       campaignId: campaign.id,
//       trackingEnabled: campaign.trackOpens,
//     })

//     logger.info("Automation email sent", { prospectId: prospect.id, templateId })
//   }

//   private async actionAddTag(tag: string | undefined, prospect: any): Promise<void> {
//     if (!tag) return

//     // Store tags in personalizationTokens JSON field
//     const currentTokens = (prospect.personalizationTokens as Record<string, any>) || {}
//     const tags = currentTokens.tags || []

//     if (!tags.includes(tag)) {
//       tags.push(tag)
//       await db.prospect.update({
//         where: { id: prospect.id },
//         data: {
//           personalizationTokens: { ...currentTokens, tags },
//         },
//       })
//     }

//     logger.info("Tag added to prospect", { prospectId: prospect.id, tag })
//   }

//   private async actionChangeSequence(newCampaignId: string | undefined, prospect: any): Promise<void> {
//     if (!newCampaignId) return

//     await db.prospect.update({
//       where: { id: prospect.id },
//       data: {
//         campaignId: newCampaignId,
//         currentStep: 0,
//         status: "ACTIVE",
//       },
//     })

//     logger.info("Prospect moved to new sequence", { prospectId: prospect.id, newCampaignId })
//   }

//   private async actionNotify(userId: string, prospect: any, rule: any): Promise<void> {
//     await db.notification.create({
//       data: {
//         userId,
//         type: "automation_triggered",
//         title: `Automation Rule Triggered: ${rule.name}`,
//         message: `Rule triggered for ${prospect.firstName || prospect.email}`,
//         data: {
//           ruleId: rule.id,
//           prospectId: prospect.id,
//         },
//       },
//     })

//     logger.info("Notification sent for automation", { userId, ruleId: rule.id })
//   }

//   private async actionPauseSequence(prospect: any): Promise<void> {
//     await db.prospect.update({
//       where: { id: prospect.id },
//       data: { status: "PAUSED" },
//     })

//     logger.info("Sequence paused for prospect", { prospectId: prospect.id })
//   }

//   private async actionMoveToCRM(prospect: any, campaign: any): Promise<void> {
//     // Create a CRM activity record (placeholder for actual CRM integration)
//     await db.prospect.update({
//       where: { id: prospect.id },
//       data: {
//         crmData: {
//           ...(prospect.crmData || {}),
//           automationTriggered: true,
//           triggeredAt: new Date().toISOString(),
//         },
//       },
//     })

//     logger.info("Prospect marked for CRM", { prospectId: prospect.id })
//   }

//   /**
//    * Process any pending delayed actions
//    */
//   private async processPendingActions(): Promise<void> {
//     const now = new Date()
//     const actionsToExecute = this.pendingActions.filter((a) => a.executeAt <= now)

//     for (const pending of actionsToExecute) {
//       const prospect = await db.prospect.findUnique({
//         where: { id: pending.prospectId },
//         include: { campaign: true },
//       })

//       if (prospect && prospect.campaign) {
//         const rule = await db.sequenceAutomationRule.findUnique({
//           where: { id: pending.ruleId },
//         })

//         if (rule) {
//           await this.executeAction(pending.action, prospect, prospect.campaign, rule)
//         }
//       }
//     }

//     // Remove executed actions
//     this.pendingActions = this.pendingActions.filter((a) => a.executeAt > now)
//   }
// }

// export const automationRuleExecutor = new AutomationRuleExecutor()

// import { db } from "@/lib/db"
// import { logger } from "@/lib/logger"
// import { sendEmail } from "./email-sender"

// type ActionType = "send_email" | "add_tag" | "change_sequence" | "notify" | "pause" | "move_to_crm"

// interface AutomationAction {
//   type: ActionType
//   value?: string
//   delayHours?: number
// }

// interface PendingAction {
//   ruleId: string
//   prospectId: string
//   action: AutomationAction
//   executeAt: Date
// }

// class AutomationRuleExecutor {
//   private pendingActions: PendingAction[] = []

//   /**
//    * Process all active automation rules for all campaigns
//    * Called by cron job every 15 minutes
//    */
//   async processAllRules(): Promise<{ evaluated: number; triggered: number }> {
//     logger.info("Starting automation rule processing")

//     let evaluated = 0
//     let triggered = 0

//     // Get all active campaigns with automation rules
//     const campaigns = await db.campaign.findMany({
//       where: {
//         status: "ACTIVE",
//       },
//       include: {
//         sequenceAutomationRules: {
//           where: { isActive: true },
//           orderBy: { priority: "desc" },
//         },
//         prospects: {
//           where: {
//             status: "ACTIVE",
//           },
//           include: {
//             emailLogs: {
//               orderBy: { createdAt: "desc" },
//               take: 10,
//             },
//           },
//         },
//       },
//     })

//     for (const campaign of campaigns) {
//       for (const prospect of campaign.prospects) {
//         for (const rule of campaign.sequenceAutomationRules) {
//           evaluated++
//           const shouldTrigger = await this.evaluateRule(rule, prospect)

//           if (shouldTrigger) {
//             triggered++
//             await this.executeRule(rule, prospect, campaign)
//           }
//         }
//       }
//     }

//     // Process any pending delayed actions
//     await this.processPendingActions()

//     logger.info("Automation rule processing completed", { evaluated, triggered })
//     return { evaluated, triggered }
//   }

//   /**
//    * Evaluate if a rule should trigger for a prospect
//    */
//   private async evaluateRule(rule: any, prospect: any): Promise<boolean> {
//     const now = new Date()
//     const emailLogs = prospect.emailLogs || []
//     const latestEmail = emailLogs[0]

//     if (!latestEmail) return false

//     const hoursSinceLastEmail = latestEmail.sentAt
//       ? (now.getTime() - new Date(latestEmail.sentAt).getTime()) / (1000 * 60 * 60)
//       : 0

//     const timeWindow = rule.timeWindowHours || 48

//     switch (rule.triggerType) {
//       case "EMAIL_OPENED":
//         // Trigger if email was opened within time window
//         return latestEmail.openedAt && hoursSinceLastEmail <= timeWindow

//       case "EMAIL_CLICKED":
//         // Trigger if any link was clicked within time window
//         return latestEmail.clickedAt && hoursSinceLastEmail <= timeWindow

//       case "LINK_CLICKED":
//         // Trigger if specific link was clicked
//         // For now, check if any click happened - could enhance to track specific URLs
//         return latestEmail.clickedAt && hoursSinceLastEmail <= timeWindow

//       case "EMAIL_REPLIED":
//         // Trigger if prospect replied
//         return prospect.replied || latestEmail.repliedAt

//       case "NOT_OPENED":
//         // Trigger if email NOT opened after X hours
//         return !latestEmail.openedAt && hoursSinceLastEmail >= timeWindow

//       case "NOT_REPLIED":
//         // Trigger if NO reply after X hours
//         return !prospect.replied && !latestEmail.repliedAt && hoursSinceLastEmail >= timeWindow

//       case "TIME_ELAPSED":
//         // Trigger after X hours since last email
//         return hoursSinceLastEmail >= timeWindow

//       case "ENGAGEMENT_SCORE":
//         // Trigger based on engagement score threshold
//         const threshold = Number.parseInt(rule.triggerValue || "50")
//         const engagementScore = this.calculateEngagementScore(prospect, emailLogs)
//         return engagementScore >= threshold

//       default:
//         return false
//     }
//   }

//   /**
//    * Calculate engagement score for a prospect
//    */
//   private calculateEngagementScore(prospect: any, emailLogs: any[]): number {
//     let score = 0

//     // Opens contribute 20 points each (max 60)
//     score += Math.min(prospect.emailsOpened * 20, 60)

//     // Clicks contribute 30 points each (max 60)
//     score += Math.min(prospect.emailsClicked * 30, 60)

//     // Replies contribute 50 points
//     if (prospect.replied) score += 50

//     // Recent activity bonus
//     const lastOpened = emailLogs.find((e: any) => e.openedAt)
//     if (lastOpened) {
//       const hoursSinceOpen = (Date.now() - new Date(lastOpened.openedAt).getTime()) / (1000 * 60 * 60)
//       if (hoursSinceOpen < 24) score += 20
//       else if (hoursSinceOpen < 72) score += 10
//     }

//     return Math.min(score, 100)
//   }

//   /**
//    * Execute all actions for a triggered rule
//    */
//   private async executeRule(rule: any, prospect: any, campaign: any): Promise<void> {
//     const actions = (rule.actions as AutomationAction[]) || []

//     logger.info("Executing automation rule", {
//       ruleId: rule.id,
//       ruleName: rule.name,
//       prospectId: prospect.id,
//       actionCount: actions.length,
//     })

//     for (const action of actions) {
//       if (action.delayHours && action.delayHours > 0) {
//         // Schedule delayed action
//         this.pendingActions.push({
//           ruleId: rule.id,
//           prospectId: prospect.id,
//           action,
//           executeAt: new Date(Date.now() + action.delayHours * 60 * 60 * 1000),
//         })
//       } else {
//         // Execute immediately
//         await this.executeAction(action, prospect, campaign, rule)
//       }
//     }

//     // Update rule stats
//     await db.sequenceAutomationRule.update({
//       where: { id: rule.id },
//       data: {
//         timesTriggered: { increment: 1 },
//         lastTriggeredAt: new Date(),
//       },
//     })
//   }

//   /**
//    * Execute a single action
//    */
//   private async executeAction(action: AutomationAction, prospect: any, campaign: any, rule: any): Promise<void> {
//     switch (action.type) {
//       case "send_email":
//         await this.actionSendEmail(action.value, prospect, campaign)
//         break

//       case "add_tag":
//         await this.actionAddTag(action.value, prospect)
//         break

//       case "change_sequence":
//         await this.actionChangeSequence(action.value, prospect)
//         break

//       case "notify":
//         await this.actionNotify(campaign.userId, prospect, rule)
//         break

//       case "pause":
//         await this.actionPauseSequence(prospect)
//         break

//       case "move_to_crm":
//         await this.actionMoveToCRM(prospect, campaign)
//         break
//     }
//   }

//   private async actionSendEmail(templateId: string | undefined, prospect: any, campaign: any): Promise<void> {
//     if (!templateId) return

//     const template = await db.emailTemplate.findUnique({
//       where: { id: templateId },
//     })

//     if (!template) {
//       logger.warn("Template not found for automation action", { templateId })
//       return
//     }

//     // Replace variables
//     let subject = template.subject
//     let body = template.body

//     const replacements: Record<string, string> = {
//       "{{firstName}}": prospect.firstName || "",
//       "{{lastName}}": prospect.lastName || "",
//       "{{company}}": prospect.company || "",
//       "{{jobTitle}}": prospect.jobTitle || "",
//     }

//     for (const [key, value] of Object.entries(replacements)) {
//       subject = subject.replace(new RegExp(key, "g"), value)
//       body = body.replace(new RegExp(key, "g"), value)
//     }

//     await sendEmail({
//       to: prospect.email,
//       subject,
//       html: body,
//       prospectId: prospect.id,
//       campaignId: campaign.id,
//     })

//     logger.info("Automation email sent", { prospectId: prospect.id, templateId })
//   }

//   private async actionAddTag(tag: string | undefined, prospect: any): Promise<void> {
//     if (!tag) return

//     // Store tags in personalizationTokens JSON field
//     const currentTokens = (prospect.personalizationTokens as Record<string, any>) || {}
//     const tags = currentTokens.tags || []

//     if (!tags.includes(tag)) {
//       tags.push(tag)
//       await db.prospect.update({
//         where: { id: prospect.id },
//         data: {
//           personalizationTokens: { ...currentTokens, tags },
//         },
//       })
//     }

//     logger.info("Tag added to prospect", { prospectId: prospect.id, tag })
//   }

//   private async actionChangeSequence(newCampaignId: string | undefined, prospect: any): Promise<void> {
//     if (!newCampaignId) return

//     await db.prospect.update({
//       where: { id: prospect.id },
//       data: {
//         campaignId: newCampaignId,
//         currentStep: 0,
//         status: "ACTIVE",
//       },
//     })

//     logger.info("Prospect moved to new sequence", { prospectId: prospect.id, newCampaignId })
//   }

//   private async actionNotify(userId: string, prospect: any, rule: any): Promise<void> {
//     await db.notification.create({
//       data: {
//         userId,
//         type: "SYSTEM_UPDATE",
//         title: `Automation Rule Triggered: ${rule.name}`,
//         message: `Rule triggered for ${prospect.firstName || prospect.email}`,
//         data: {
//           ruleId: rule.id,
//           prospectId: prospect.id,
//           automationType: "automation_triggered",
//         },
//       },
//     })

//     logger.info("Notification sent for automation", { userId, ruleId: rule.id })
//   }

//   private async actionPauseSequence(prospect: any): Promise<void> {
//     await db.prospect.update({
//       where: { id: prospect.id },
//       data: { status: "COMPLETED" },
//     })

//     logger.info("Sequence paused for prospect", { prospectId: prospect.id })
//   }

//   private async actionMoveToCRM(prospect: any, campaign: any): Promise<void> {
//     // Create a CRM activity record (placeholder for actual CRM integration)
//     await db.prospect.update({
//       where: { id: prospect.id },
//       data: {
//         crmData: {
//           ...(prospect.crmData || {}),
//           automationTriggered: true,
//           triggeredAt: new Date().toISOString(),
//         },
//       },
//     })

//     logger.info("Prospect marked for CRM", { prospectId: prospect.id })
//   }

//   /**
//    * Process any pending delayed actions
//    */
//   private async processPendingActions(): Promise<void> {
//     const now = new Date()
//     const actionsToExecute = this.pendingActions.filter((a) => a.executeAt <= now)

//     for (const pending of actionsToExecute) {
//       const prospect = await db.prospect.findUnique({
//         where: { id: pending.prospectId },
//         include: { campaign: true },
//       })

//       if (prospect && prospect.campaign) {
//         const rule = await db.sequenceAutomationRule.findUnique({
//           where: { id: pending.ruleId },
//         })

//         if (rule) {
//           await this.executeAction(pending.action, prospect, prospect.campaign, rule)
//         }
//       }
//     }

//     // Remove executed actions
//     this.pendingActions = this.pendingActions.filter((a) => a.executeAt > now)
//   }
// }

// export const automationRuleExecutor = new AutomationRuleExecutor()

import { db } from "@/lib/db"
import { logger } from "@/lib/logger"
import { sendEmail } from "./email-sender"

type ActionType = "send_email" | "add_tag" | "change_sequence" | "notify" | "pause" | "move_to_crm"

interface AutomationAction {
  type: ActionType
  value?: string
  delayHours?: number
}

interface PendingAction {
  ruleId: string
  prospectId: string
  action: AutomationAction
  executeAt: Date
}

class AutomationRuleExecutor {
  private pendingActions: PendingAction[] = []

  /**
   * Process all active automation rules for all campaigns
   * Called by cron job every 15 minutes
   */
  async processAllRules(): Promise<{ evaluated: number; triggered: number }> {
    logger.info("Starting automation rule processing")

    let evaluated = 0
    let triggered = 0

    // Get all active campaigns with automation rules
    const campaigns = await db.campaign.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        sequenceAutomationRules: {
          where: { isActive: true },
          orderBy: { priority: "desc" },
        },
        prospects: {
          where: {
            status: "ACTIVE",
          },
          include: {
            emailLogs: {
              orderBy: { createdAt: "desc" },
              take: 10,
            },
          },
        },
      },
    })

    for (const campaign of campaigns) {
      for (const prospect of campaign.prospects) {
        for (const rule of campaign.sequenceAutomationRules) {
          evaluated++
          const shouldTrigger = await this.evaluateRule(rule, prospect)

          if (shouldTrigger) {
            triggered++
            await this.executeRule(rule, prospect, campaign)
          }
        }
      }
    }

    // Process any pending delayed actions
    await this.processPendingActions()

    logger.info("Automation rule processing completed", { evaluated, triggered })
    return { evaluated, triggered }
  }

  /**
   * Evaluate if a rule should trigger for a prospect
   */
  private async evaluateRule(rule: any, prospect: any): Promise<boolean> {
    const now = new Date()
    const emailLogs = prospect.emailLogs || []
    const latestEmail = emailLogs[0]

    if (!latestEmail) return false

    const hoursSinceLastEmail = latestEmail.sentAt
      ? (now.getTime() - new Date(latestEmail.sentAt).getTime()) / (1000 * 60 * 60)
      : 0

    const timeWindow = rule.timeWindowHours || 48

    switch (rule.triggerType) {
      case "EMAIL_OPENED":
        // Trigger if email was opened within time window
        return latestEmail.openedAt && hoursSinceLastEmail <= timeWindow

      case "EMAIL_CLICKED":
        // Trigger if any link was clicked within time window
        return latestEmail.clickedAt && hoursSinceLastEmail <= timeWindow

      case "LINK_CLICKED":
        // Trigger if specific link was clicked
        // For now, check if any click happened - could enhance to track specific URLs
        return latestEmail.clickedAt && hoursSinceLastEmail <= timeWindow

      case "EMAIL_REPLIED":
        // Trigger if prospect replied
        return prospect.replied || latestEmail.repliedAt

      case "NOT_OPENED":
        // Trigger if email NOT opened after X hours
        return !latestEmail.openedAt && hoursSinceLastEmail >= timeWindow

      case "NOT_REPLIED":
        // Trigger if NO reply after X hours
        return !prospect.replied && !latestEmail.repliedAt && hoursSinceLastEmail >= timeWindow

      case "TIME_ELAPSED":
        // Trigger after X hours since last email
        return hoursSinceLastEmail >= timeWindow

      case "ENGAGEMENT_SCORE":
        // Trigger based on engagement score threshold
        const threshold = Number.parseInt(rule.triggerValue || "50")
        const engagementScore = this.calculateEngagementScore(prospect, emailLogs)
        return engagementScore >= threshold

      default:
        return false
    }
  }

  /**
   * Calculate engagement score for a prospect
   */
  private calculateEngagementScore(prospect: any, emailLogs: any[]): number {
    let score = 0

    // Opens contribute 20 points each (max 60)
    score += Math.min(prospect.emailsOpened * 20, 60)

    // Clicks contribute 30 points each (max 60)
    score += Math.min(prospect.emailsClicked * 30, 60)

    // Replies contribute 50 points
    if (prospect.replied) score += 50

    // Recent activity bonus
    const lastOpened = emailLogs.find((e: any) => e.openedAt)
    if (lastOpened) {
      const hoursSinceOpen = (Date.now() - new Date(lastOpened.openedAt).getTime()) / (1000 * 60 * 60)
      if (hoursSinceOpen < 24) score += 20
      else if (hoursSinceOpen < 72) score += 10
    }

    return Math.min(score, 100)
  }

  /**
   * Execute all actions for a triggered rule
   */
  private async executeRule(rule: any, prospect: any, campaign: any): Promise<void> {
    const actions = (rule.actions as AutomationAction[]) || []

    logger.info("Executing automation rule", {
      ruleId: rule.id,
      ruleName: rule.name,
      prospectId: prospect.id,
      actionCount: actions.length,
    })

    for (const action of actions) {
      if (action.delayHours && action.delayHours > 0) {
        // Schedule delayed action
        this.pendingActions.push({
          ruleId: rule.id,
          prospectId: prospect.id,
          action,
          executeAt: new Date(Date.now() + action.delayHours * 60 * 60 * 1000),
        })
      } else {
        // Execute immediately
        await this.executeAction(action, prospect, campaign, rule)
      }
    }

    // Update rule stats
    await db.sequenceAutomationRule.update({
      where: { id: rule.id },
      data: {
        timesTriggered: { increment: 1 },
        lastTriggeredAt: new Date(),
      },
    })
  }

  /**
   * Execute a single action
   */
  private async executeAction(action: AutomationAction, prospect: any, campaign: any, rule: any): Promise<void> {
    switch (action.type) {
      case "send_email":
        await this.actionSendEmail(action.value, prospect, campaign)
        break

      case "add_tag":
        await this.actionAddTag(action.value, prospect)
        break

      case "change_sequence":
        await this.actionChangeSequence(action.value, prospect)
        break

      case "notify":
        await this.actionNotify(campaign.userId, prospect, rule)
        break

      case "pause":
        await this.actionPauseSequence(prospect)
        break

      case "move_to_crm":
        await this.actionMoveToCRM(prospect, campaign)
        break
    }
  }

  private async actionSendEmail(templateId: string | undefined, prospect: any, campaign: any): Promise<void> {
    if (!templateId) return

    const template = await db.emailTemplate.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      logger.warn("Template not found for automation action", { templateId })
      return
    }

    // Replace variables
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

    await sendEmail({
      to: prospect.email,
      subject,
      html: body,
      prospectId: prospect.id,
      campaignId: campaign.id,
    })

    logger.info("Automation email sent", { prospectId: prospect.id, templateId })
  }

  private async actionAddTag(tag: string | undefined, prospect: any): Promise<void> {
    if (!tag) return

    // Store tags in personalizationTokens JSON field
    const currentTokens = (prospect.personalizationTokens as Record<string, any>) || {}
    const tags = currentTokens.tags || []

    if (!tags.includes(tag)) {
      tags.push(tag)
      await db.prospect.update({
        where: { id: prospect.id },
        data: {
          personalizationTokens: { ...currentTokens, tags },
        },
      })
    }

    logger.info("Tag added to prospect", { prospectId: prospect.id, tag })
  }

  private async actionChangeSequence(newCampaignId: string | undefined, prospect: any): Promise<void> {
    if (!newCampaignId) return

    await db.prospect.update({
      where: { id: prospect.id },
      data: {
        campaignId: newCampaignId,
        currentStep: 1,
        status: "ACTIVE",
      },
    })

    logger.info("Prospect moved to new sequence", { prospectId: prospect.id, newCampaignId })
  }

  private async actionNotify(userId: string, prospect: any, rule: any): Promise<void> {
    await db.notification.create({
      data: {
        userId,
        type: "SYSTEM_UPDATE",
        title: `Automation Rule Triggered: ${rule.name}`,
        message: `Rule triggered for ${prospect.firstName || prospect.email}`,
        metadata: {
          ruleId: rule.id,
          prospectId: prospect.id,
          automationType: "automation_triggered",
        },
        entityType: "prospect",
        entityId: prospect.id,
      },
    })

    logger.info("Notification sent for automation", { userId, ruleId: rule.id })
  }

  private async actionPauseSequence(prospect: any): Promise<void> {
    await db.prospect.update({
      where: { id: prospect.id },
      data: { status: "COMPLETED" },
    })

    logger.info("Sequence paused for prospect", { prospectId: prospect.id })
  }

  private async actionMoveToCRM(prospect: any, campaign: any): Promise<void> {
    // Create a CRM activity record (placeholder for actual CRM integration)
    await db.prospect.update({
      where: { id: prospect.id },
      data: {
        crmData: {
          ...(prospect.crmData || {}),
          automationTriggered: true,
          triggeredAt: new Date().toISOString(),
        },
      },
    })

    logger.info("Prospect marked for CRM", { prospectId: prospect.id })
  }

  /**
   * Process any pending delayed actions
   */
  private async processPendingActions(): Promise<void> {
    const now = new Date()
    const actionsToExecute = this.pendingActions.filter((a) => a.executeAt <= now)

    for (const pending of actionsToExecute) {
      const prospect = await db.prospect.findUnique({
        where: { id: pending.prospectId },
        include: { campaign: true },
      })

      if (prospect && prospect.campaign) {
        const rule = await db.sequenceAutomationRule.findUnique({
          where: { id: pending.ruleId },
        })

        if (rule) {
          await this.executeAction(pending.action, prospect, prospect.campaign, rule)
        }
      }
    }

    // Remove executed actions
    this.pendingActions = this.pendingActions.filter((a) => a.executeAt > now)
  }
}

export const automationRuleExecutor = new AutomationRuleExecutor()
