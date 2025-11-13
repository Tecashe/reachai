// import { db } from "../db"
// import { logger } from "../logger"

// interface TriggerConditions {
//   opened?: boolean
//   clicked?: boolean
//   replied?: boolean
//   minOpens?: number
//   minClicks?: number
//   timeWindow?: number // hours
// }

// class SubsequenceManager {
//   /**
//    * Check if prospect meets trigger conditions
//    */
//   async checkTriggers(prospectId: string, campaignId: string): Promise<void> {
//     const prospect = await db.prospect.findUnique({
//       where: { id: prospectId },
//       include: {
//         emailLogs: {
//           where: { status: { in: ["DELIVERED", "OPENED", "CLICKED"] } },
//           orderBy: { sentAt: "desc" },
//         },
//       },
//     })

//     if (!prospect) return

//     const triggers = await db.subsequenceTrigger.findMany({
//       where: {
//         campaignId,
//         isActive: true,
//       },
//     })

//     for (const trigger of triggers) {
//       const conditions = trigger.conditions as TriggerConditions

//       if (await this.meetsConditions(prospect, conditions)) {
//         await this.executeTrigger(trigger.id, prospectId)
//       }
//     }
//   }

//   /**
//    * Check if prospect meets all conditions
//    */
//   private async meetsConditions(prospect: any, conditions: TriggerConditions): Promise<boolean> {
//     const recentEmails = prospect.emailLogs.filter((log: any) => {
//       if (!conditions.timeWindow) return true
//       const hoursSince = (Date.now() - log.sentAt.getTime()) / (1000 * 60 * 60)
//       return hoursSince <= conditions.timeWindow
//     })

//     // Check opened condition
//     if (conditions.opened !== undefined) {
//       const hasOpens = recentEmails.some((log: any) => log.openedAt)
//       if (conditions.opened !== hasOpens) return false
//     }

//     // Check clicked condition
//     if (conditions.clicked !== undefined) {
//       const hasClicks = recentEmails.some((log: any) => log.clickedAt)
//       if (conditions.clicked !== hasClicks) return false
//     }

//     // Check replied condition
//     if (conditions.replied !== undefined) {
//       if (conditions.replied !== prospect.replied) return false
//     }

//     // Check minimum opens
//     if (conditions.minOpens) {
//       const openCount = recentEmails.filter((log: any) => log.openedAt).length
//       if (openCount < conditions.minOpens) return false
//     }

//     // Check minimum clicks
//     if (conditions.minClicks) {
//       const clickCount = recentEmails.filter((log: any) => log.clickedAt).length
//       if (clickCount < conditions.minClicks) return false
//     }

//     return true
//   }

//   /**
//    * Execute trigger action
//    */
//   private async executeTrigger(triggerId: string, prospectId: string): Promise<void> {
//     const trigger = await db.subsequenceTrigger.findUnique({
//       where: { id: triggerId },
//       include: { campaign: true },
//     })

//     if (!trigger) return

//     logger.info("Executing subsequence trigger", { triggerId, prospectId })

//     switch (trigger.actionType) {
//       case "SEND_EMAIL":
//         await this.scheduleSubsequenceEmail(trigger, prospectId)
//         break
//       case "PAUSE_CAMPAIGN":
//         await this.pauseCampaignForProspect(prospectId)
//         break
//       case "ADD_TAG":
//         // Future: Add tagging system
//         break
//       case "UPDATE_CRM":
//         // Future: CRM integration
//         break
//       case "NOTIFY_TEAM":
//         await this.notifyTeam(trigger, prospectId)
//         break
//     }

//     // Update stats
//     await db.subsequenceTrigger.update({
//       where: { id: triggerId },
//       data: {
//         timesTriggered: { increment: 1 },
//       },
//     })
//   }

//   /**
//    * Schedule subsequence email
//    */
//   private async scheduleSubsequenceEmail(trigger: any, prospectId: string): Promise<void> {
//     const scheduledFor = new Date(Date.now() + trigger.delayHours * 60 * 60 * 1000)

//     await db.sendingSchedule.create({
//       data: {
//         userId: trigger.campaign.userId,
//         prospectId,
//         campaignId: trigger.campaignId,
//         subject: "Follow-up email",
//         body: "Subsequence email content",
//         scheduledFor,
//         status: "PENDING",
//       },
//     })

//     logger.info("Subsequence email scheduled", { prospectId, scheduledFor })
//   }

//   /**
//    * Pause campaign for specific prospect
//    */
//   private async pauseCampaignForProspect(prospectId: string): Promise<void> {
//     await db.prospect.update({
//       where: { id: prospectId },
//       data: { status: "COMPLETED" },
//     })

//     logger.info("Campaign paused for prospect", { prospectId })
//   }

//   /**
//    * Notify team about trigger
//    */
//   private async notifyTeam(trigger: any, prospectId: string): Promise<void> {
//     const prospect = await db.prospect.findUnique({
//       where: { id: prospectId },
//     })

//     if (!prospect) return

//     await db.realtimeNotification.create({
//       data: {
//         userId: trigger.campaign.userId,
//         type: "HOT_LEAD",
//         title: "Hot Lead Detected!",
//         message: `${prospect.firstName} ${prospect.lastName} at ${prospect.company} is highly engaged`,
//         priority: "HIGH",
//         entityType: "prospect",
//         entityId: prospectId,
//         playSound: true,
//       },
//     })
//   }

//   /**
//    * Create a new subsequence trigger
//    */
//   async createTrigger(
//     campaignId: string,
//     data: {
//       name: string
//       description?: string
//       conditions: TriggerConditions
//       actionType: string
//       templateId?: string
//       delayHours?: number
//     },
//   ) {
//     return db.subsequenceTrigger.create({
//       data: {
//         campaignId,
//         ...data,
//       },
//     })
//   }
// }

// export const subsequenceManager = new SubsequenceManager()




// import { db } from "../db"
// import { logger } from "../logger"

// interface TriggerConditions {
//   opened?: boolean
//   clicked?: boolean
//   replied?: boolean
//   minOpens?: number
//   minClicks?: number
//   timeWindow?: number // hours
// }

// class SubsequenceManager {
//   /**
//    * Check if prospect meets trigger conditions
//    */
//   async checkTriggers(prospectId: string, campaignId: string): Promise<void> {
//     const prospect = await db.prospect.findUnique({
//       where: { id: prospectId },
//       include: {
//         emailLogs: {
//           where: { status: { in: ["DELIVERED", "OPENED", "CLICKED"] } },
//           orderBy: { sentAt: "desc" },
//         },
//       },
//     })

//     if (!prospect) return

//     const triggers = await db.subsequenceTrigger.findMany({
//       where: {
//         campaignId,
//         isActive: true,
//       },
//     })

//     for (const trigger of triggers) {
//       const conditions = trigger.conditions as TriggerConditions

//       if (await this.meetsConditions(prospect, conditions)) {
//         await this.executeTrigger(trigger.id, prospectId)
//       }
//     }
//   }

//   /**
//    * Check if prospect meets all conditions
//    */
//   private async meetsConditions(prospect: any, conditions: TriggerConditions): Promise<boolean> {
//     const recentEmails = prospect.emailLogs.filter((log: any) => {
//       if (!conditions.timeWindow) return true
//       const hoursSince = (Date.now() - log.sentAt.getTime()) / (1000 * 60 * 60)
//       return hoursSince <= conditions.timeWindow
//     })

//     // Check opened condition
//     if (conditions.opened !== undefined) {
//       const hasOpens = recentEmails.some((log: any) => log.openedAt)
//       if (conditions.opened !== hasOpens) return false
//     }

//     // Check clicked condition
//     if (conditions.clicked !== undefined) {
//       const hasClicks = recentEmails.some((log: any) => log.clickedAt)
//       if (conditions.clicked !== hasClicks) return false
//     }

//     // Check replied condition
//     if (conditions.replied !== undefined) {
//       if (conditions.replied !== prospect.replied) return false
//     }

//     // Check minimum opens
//     if (conditions.minOpens) {
//       const openCount = recentEmails.filter((log: any) => log.openedAt).length
//       if (openCount < conditions.minOpens) return false
//     }

//     // Check minimum clicks
//     if (conditions.minClicks) {
//       const clickCount = recentEmails.filter((log: any) => log.clickedAt).length
//       if (clickCount < conditions.minClicks) return false
//     }

//     return true
//   }

//   /**
//    * Execute trigger action
//    */
//   private async executeTrigger(triggerId: string, prospectId: string): Promise<void> {
//     const trigger = await db.subsequenceTrigger.findUnique({
//       where: { id: triggerId },
//       include: { campaign: true },
//     })

//     if (!trigger) return

//     logger.info("Executing subsequence trigger", { triggerId, prospectId })

//     switch (trigger.actionType) {
//       case "SEND_EMAIL":
//         await this.scheduleSubsequenceEmail(trigger, prospectId)
//         break
//       case "PAUSE_CAMPAIGN":
//         await this.pauseCampaignForProspect(prospectId)
//         break
//       case "ADD_TAG":
//         // Future: Add tagging system
//         break
//       case "UPDATE_CRM":
//         // Future: CRM integration
//         break
//       case "NOTIFY_TEAM":
//         await this.notifyTeam(trigger, prospectId)
//         break
//     }

//     // Update stats
//     await db.subsequenceTrigger.update({
//       where: { id: triggerId },
//       data: {
//         timesTriggered: { increment: 1 },
//       },
//     })
//   }

//   /**
//    * Schedule subsequence email
//    */
//   private async scheduleSubsequenceEmail(trigger: any, prospectId: string): Promise<void> {
//     const scheduledFor = new Date(Date.now() + trigger.delayHours * 60 * 60 * 1000)

//     await db.sendingSchedule.create({
//       data: {
//         userId: trigger.campaign.userId,
//         prospectId,
//         campaignId: trigger.campaignId,
//         subject: "Follow-up email",
//         body: "Subsequence email content",
//         scheduledFor,
//         status: "PENDING",
//       },
//     })

//     logger.info("Subsequence email scheduled", { prospectId, scheduledFor })
//   }

//   /**
//    * Pause campaign for specific prospect
//    */
//   private async pauseCampaignForProspect(prospectId: string): Promise<void> {
//     await db.prospect.update({
//       where: { id: prospectId },
//       data: { status: "COMPLETED" },
//     })

//     logger.info("Campaign paused for prospect", { prospectId })
//   }

//   /**
//    * Notify team about trigger
//    */
//   private async notifyTeam(trigger: any, prospectId: string): Promise<void> {
//     const prospect = await db.prospect.findUnique({
//       where: { id: prospectId },
//     })

//     if (!prospect) return

//     await db.realtimeNotification.create({
//       data: {
//         userId: trigger.campaign.userId,
//         type: "HOT_LEAD",
//         title: "Hot Lead Detected!",
//         message: `${prospect.firstName} ${prospect.lastName} at ${prospect.company} is highly engaged`,
//         priority: "HIGH",
//         entityType: "prospect",
//         entityId: prospectId,
//         playSound: true,
//       },
//     })
//   }

//   /**
//    * Create a new subsequence trigger
//    */
//   async createTrigger(
//     campaignId: string,
//     data: {
//       name: string
//       description?: string
//       conditions: TriggerConditions
//       actionType: string
//       templateId?: string
//       delayHours?: number
//     },
//   ) {
//     return db.subsequenceTrigger.create({
//       data: {
//         campaignId,
//         name: data.name,
//         description: data.description,
//         conditions: data.conditions as any, // Cast to JSON
//         actionType: data.actionType as any,
//         templateId: data.templateId,
//         delayHours: data.delayHours,
//       },
//     })
//   }
// }

// export const subsequenceManager = new SubsequenceManager()

import { db } from "../db"
import { logger } from "../logger"

interface TriggerConditions {
  opened?: boolean
  clicked?: boolean
  replied?: boolean
  minOpens?: number
  minClicks?: number
  timeWindow?: number // hours
}

class SubsequenceManager {
  /**
   * Check if prospect meets trigger conditions
   */
  async checkTriggers(prospectId: string, campaignId: string): Promise<void> {
    const prospect = await db.prospect.findUnique({
      where: { id: prospectId },
      include: {
        emailLogs: {
          where: { status: { in: ["DELIVERED", "OPENED", "CLICKED"] } },
          orderBy: { sentAt: "desc" },
        },
      },
    })

    if (!prospect) return

    const triggers = await db.subsequenceTrigger.findMany({
      where: {
        campaignId,
        isActive: true,
      },
    })

    for (const trigger of triggers) {
      const conditions = trigger.conditions as TriggerConditions

      if (await this.meetsConditions(prospect, conditions)) {
        await this.executeTrigger(trigger.id, prospectId)
      }
    }
  }

  /**
   * Check if prospect meets all conditions
   */
  private async meetsConditions(prospect: any, conditions: TriggerConditions): Promise<boolean> {
    const recentEmails = prospect.emailLogs.filter((log: any) => {
      if (!conditions.timeWindow) return true
      const hoursSince = (Date.now() - log.sentAt.getTime()) / (1000 * 60 * 60)
      return hoursSince <= conditions.timeWindow
    })

    // Check opened condition
    if (conditions.opened !== undefined) {
      const hasOpens = recentEmails.some((log: any) => log.openedAt)
      if (conditions.opened !== hasOpens) return false
    }

    // Check clicked condition
    if (conditions.clicked !== undefined) {
      const hasClicks = recentEmails.some((log: any) => log.clickedAt)
      if (conditions.clicked !== hasClicks) return false
    }

    // Check replied condition
    if (conditions.replied !== undefined) {
      if (conditions.replied !== prospect.replied) return false
    }

    // Check minimum opens
    if (conditions.minOpens) {
      const openCount = recentEmails.filter((log: any) => log.openedAt).length
      if (openCount < conditions.minOpens) return false
    }

    // Check minimum clicks
    if (conditions.minClicks) {
      const clickCount = recentEmails.filter((log: any) => log.clickedAt).length
      if (clickCount < conditions.minClicks) return false
    }

    return true
  }

  /**
   * Execute trigger action
   */
  private async executeTrigger(triggerId: string, prospectId: string): Promise<void> {
    const trigger = await db.subsequenceTrigger.findUnique({
      where: { id: triggerId },
      include: { campaign: true },
    })

    if (!trigger) return

    logger.info("Executing subsequence trigger", { triggerId, prospectId })

    switch (trigger.actionType) {
      case "SEND_EMAIL":
        await this.scheduleSubsequenceEmail(trigger, prospectId)
        break
      case "PAUSE_CAMPAIGN":
        await this.pauseCampaignForProspect(prospectId)
        break
      case "ADD_TAG":
        // Future: Add tagging system
        break
      case "UPDATE_CRM":
        // Future: CRM integration
        break
      case "NOTIFY_TEAM":
        await this.notifyTeam(trigger, prospectId)
        break
    }

    // Update stats
    await db.subsequenceTrigger.update({
      where: { id: triggerId },
      data: {
        timesTriggered: { increment: 1 },
      },
    })
  }

  /**
   * Schedule subsequence email
   */
  private async scheduleSubsequenceEmail(trigger: any, prospectId: string): Promise<void> {
    const prospect = await db.prospect.findUnique({
      where: { id: prospectId },
    })

    if (!prospect) return

    const scheduledFor = new Date(Date.now() + trigger.delayHours * 60 * 60 * 1000)

    let subject = `Following up with ${prospect.firstName || "you"}`
    let body = `Hi ${prospect.firstName || "there"},\n\nI wanted to follow up on my previous email...`

    if (trigger.templateId) {
      const template = await db.emailTemplate.findUnique({
        where: { id: trigger.templateId },
      })

      if (template) {
        subject = template.subject
        body = template.body
          .replace(/{{firstName}}/g, prospect.firstName || "")
          .replace(/{{lastName}}/g, prospect.lastName || "")
          .replace(/{{company}}/g, prospect.company || "")
          .replace(/{{jobTitle}}/g, prospect.jobTitle || "")
      }
    }

    await db.sendingSchedule.create({
      data: {
        userId: trigger.campaign.userId,
        prospectId,
        campaignId: trigger.campaignId,
        subject,
        body,
        scheduledFor,
        status: "PENDING",
      },
    })

    logger.info("Subsequence email scheduled", { prospectId, scheduledFor, templateId: trigger.templateId })
  }

  /**
   * Pause campaign for specific prospect
   */
  private async pauseCampaignForProspect(prospectId: string): Promise<void> {
    await db.prospect.update({
      where: { id: prospectId },
      data: { status: "COMPLETED" },
    })

    logger.info("Campaign paused for prospect", { prospectId })
  }

  /**
   * Notify team about trigger
   */
  private async notifyTeam(trigger: any, prospectId: string): Promise<void> {
    const prospect = await db.prospect.findUnique({
      where: { id: prospectId },
    })

    if (!prospect) return

    await db.realtimeNotification.create({
      data: {
        userId: trigger.campaign.userId,
        type: "HOT_LEAD",
        title: "Hot Lead Detected!",
        message: `${prospect.firstName} ${prospect.lastName} at ${prospect.company} is highly engaged`,
        priority: "HIGH",
        entityType: "prospect",
        entityId: prospectId,
        playSound: true,
      },
    })
  }

  /**
   * Create a new subsequence trigger
   */
  async createTrigger(
    campaignId: string,
    data: {
      name: string
      description?: string
      conditions: TriggerConditions
      actionType: string
      templateId?: string
      delayHours?: number
    },
  ) {
    return db.subsequenceTrigger.create({
      data: {
        campaignId,
        name: data.name,
        description: data.description,
        conditions: data.conditions as any, // Cast to JSON
        actionType: data.actionType as any,
        templateId: data.templateId,
        delayHours: data.delayHours,
      },
    })
  }
}

export const subsequenceManager = new SubsequenceManager()
