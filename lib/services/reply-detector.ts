// import { generateObject } from "ai"
// import { z } from "zod"
// import { db } from "../db"
// import { logger } from "../logger"

// const replyAnalysisSchema = z.object({
//   sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE", "AUTO_REPLY"]),
//   category: z.enum(["INTERESTED", "NOT_INTERESTED", "QUESTION", "OUT_OF_OFFICE", "UNSUBSCRIBE", "REFERRAL"]),
//   isAutoReply: z.boolean(),
//   shouldPauseCampaign: z.boolean(),
//   summary: z.string(),
// })

// interface ReplyEvent {
//   emailLogId: string
//   fromEmail: string
//   subject: string
//   body: string
// }

// class ReplyDetector {
//   async handleReply(event: ReplyEvent): Promise<void> {
//     const { emailLogId, fromEmail, subject, body } = event

//     try {
//       // Get email log
//       const emailLog = await db.emailLog.findUnique({
//         where: { id: emailLogId },
//         include: {
//           prospect: {
//             include: {
//               campaign: true,
//             },
//           },
//         },
//       })

//       if (!emailLog) {
//         logger.error("Email log not found for reply", { emailLogId })
//         return
//       }

//       // Analyze reply with AI
//       const analysis = await this.analyzeReply(subject, body)

//       // Create reply record
//       const reply = await db.emailReply.create({
//         data: {
//           emailLogId,
//           sendingAccountId: emailLog.sendingAccountId,
//           prospectId: emailLog.prospectId,
//           campaignId: emailLog.prospect.campaignId,
//           subject,
//           body,
//           fromEmail,
//           sentiment: analysis.sentiment,
//           category: analysis.category,
//           isAutoReply: analysis.isAutoReply,
//           analyzedAt: new Date(),
//         },
//       })

//       // Update email log
//       await db.emailLog.update({
//         where: { id: emailLogId },
//         data: {
//           status: "REPLIED",
//           repliedAt: new Date(),
//         },
//       })

//       // Update prospect
//       await db.prospect.update({
//         where: { id: emailLog.prospectId },
//         data: {
//           replied: true,
//           repliedAt: new Date(),
//           replyCount: { increment: 1 },
//           lastReplyAt: new Date(),
//           status: analysis.category === "INTERESTED" ? "REPLIED" : "CONTACTED",
//         },
//       })

//       // Update campaign stats
//       if (emailLog.prospect.campaignId) {
//         await db.campaign.update({
//           where: { id: emailLog.prospect.campaignId },
//           data: {
//             emailsReplied: { increment: 1 },
//           },
//         })

//         // Pause campaign if needed
//         if (analysis.shouldPauseCampaign && !analysis.isAutoReply) {
//           await db.campaign.update({
//             where: { id: emailLog.prospect.campaignId },
//             data: {
//               status: "PAUSED",
//             },
//           })

//           await db.emailReply.update({
//             where: { id: reply.id },
//             data: {
//               campaignPaused: true,
//             },
//           })

//           logger.info("Campaign paused due to reply", {
//             campaignId: emailLog.prospect.campaignId,
//             sentiment: analysis.sentiment,
//             category: analysis.category,
//           })
//         }
//       }

//       // Update sending account reply rate
//       if (emailLog.sendingAccountId) {
//         await this.updateAccountReplyRate(emailLog.sendingAccountId)
//       }

//       logger.info("Reply handled", {
//         emailLogId,
//         prospectId: emailLog.prospectId,
//         sentiment: analysis.sentiment,
//         category: analysis.category,
//       })
//     } catch (error) {
//       logger.error("Failed to handle reply", error as Error, { emailLogId })
//     }
//   }

//   private async analyzeReply(subject: string, body: string) {
//     try {
//       const { object: analysis } = await generateObject({
//         model: "openai/gpt-4o-mini",
//         schema: replyAnalysisSchema,
//         prompt: `Analyze this email reply and categorize it.

// Subject: ${subject}
// Body: ${body}

// Determine:
// 1. SENTIMENT: Is the reply positive (interested), neutral (asking questions), negative (not interested), or an auto-reply?
// 2. CATEGORY: What type of reply is this?
//    - INTERESTED: Wants to schedule call, demo, or learn more
//    - NOT_INTERESTED: Not a fit, not now, remove me
//    - QUESTION: Asking for more information
//    - OUT_OF_OFFICE: Auto-reply, vacation responder
//    - UNSUBSCRIBE: Wants to be removed from list
//    - REFERRAL: Forwarding to someone else
// 3. IS_AUTO_REPLY: Is this an automated response?
// 4. SHOULD_PAUSE_CAMPAIGN: Should we stop sending more emails to this prospect?
// 5. SUMMARY: Brief 1-sentence summary of the reply

// Be accurate and conservative. When in doubt, mark as NEUTRAL.`,
//       })

//       return analysis
//     } catch (error) {
//       logger.error("Failed to analyze reply", error as Error)

//       // Return safe defaults
//       return {
//         sentiment: "NEUTRAL" as const,
//         category: "QUESTION" as const,
//         isAutoReply: false,
//         shouldPauseCampaign: true, // Pause by default to be safe
//         summary: "Reply received (analysis failed)",
//       }
//     }
//   }

//   private async updateAccountReplyRate(accountId: string): Promise<void> {
//     const replies = await db.emailReply.findMany({
//       where: {
//         sendingAccountId: accountId,
//         repliedAt: {
//           gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
//         },
//       },
//     })

//     const totalSent = await db.emailLog.count({
//       where: {
//         sendingAccountId: accountId,
//         sentAt: {
//           gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
//         },
//       },
//     })

//     const replyRate = totalSent > 0 ? (replies.length / totalSent) * 100 : 0

//     await db.sendingAccount.update({
//       where: { id: accountId },
//       data: {
//         replyRate,
//       },
//     })

//     logger.info("Account reply rate updated", {
//       accountId,
//       replyRate,
//       replies: replies.length,
//       totalSent,
//     })
//   }

//   async getReplyStats(campaignId: string) {
//     const replies = await db.emailReply.findMany({
//       where: { campaignId },
//       include: {
//         prospect: {
//           select: {
//             email: true,
//             firstName: true,
//             lastName: true,
//             company: true,
//           },
//         },
//       },
//       orderBy: { repliedAt: "desc" },
//     })

//     const positive = replies.filter((r) => r.sentiment === "POSITIVE").length
//     const neutral = replies.filter((r) => r.sentiment === "NEUTRAL").length
//     const negative = replies.filter((r) => r.sentiment === "NEGATIVE").length
//     const autoReplies = replies.filter((r) => r.isAutoReply).length

//     return {
//       total: replies.length,
//       positive,
//       neutral,
//       negative,
//       autoReplies,
//       replyRate: 0, // Will be calculated by caller
//       recent: replies.slice(0, 10),
//     }
//   }
// }

// export const replyDetector = new ReplyDetector()

import { generateObject } from "ai"
import { z } from "zod"
import { db } from "../db"
import { logger } from "../logger"

const replyAnalysisSchema = z.object({
  sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE", "AUTO_REPLY"]),
  category: z.enum(["INTERESTED", "NOT_INTERESTED", "QUESTION", "OUT_OF_OFFICE", "UNSUBSCRIBE", "REFERRAL"]),
  isAutoReply: z.boolean(),
  shouldPauseCampaign: z.boolean(),
  summary: z.string(),
})

interface ReplyEvent {
  emailLogId: string
  fromEmail: string
  subject: string
  body: string
}

class ReplyDetector {
  async handleReply(event: ReplyEvent): Promise<void> {
    const { emailLogId, fromEmail, subject, body } = event

    try {
      // Get email log
      const emailLog = await db.emailLog.findUnique({
        where: { id: emailLogId },
        include: {
          prospect: {
            include: {
              campaign: true,
            },
          },
        },
      })

      if (!emailLog) {
        logger.error("Email log not found for reply", undefined, { emailLogId })
        return
      }

      // Analyze reply with AI
      const analysis = await this.analyzeReply(subject, body)

      // Create reply record
      const reply = await db.emailReply.create({
        data: {
          emailLogId,
          sendingAccountId: emailLog.sendingAccountId,
          prospectId: emailLog.prospectId,
          campaignId: emailLog.prospect.campaignId,
          subject,
          body,
          fromEmail,
          sentiment: analysis.sentiment,
          category: analysis.category,
          isAutoReply: analysis.isAutoReply,
          analyzedAt: new Date(),
        },
      })

      // Update email log
      await db.emailLog.update({
        where: { id: emailLogId },
        data: {
          status: "REPLIED",
          repliedAt: new Date(),
        },
      })

      // Update prospect
      await db.prospect.update({
        where: { id: emailLog.prospectId },
        data: {
          replied: true,
          repliedAt: new Date(),
          replyCount: { increment: 1 },
          lastReplyAt: new Date(),
          status: analysis.category === "INTERESTED" ? "REPLIED" : "CONTACTED",
        },
      })

      // Update campaign stats
      if (emailLog.prospect.campaignId) {
        await db.campaign.update({
          where: { id: emailLog.prospect.campaignId },
          data: {
            emailsReplied: { increment: 1 },
          },
        })

        // Pause campaign if needed
        if (analysis.shouldPauseCampaign && !analysis.isAutoReply) {
          await db.campaign.update({
            where: { id: emailLog.prospect.campaignId },
            data: {
              status: "PAUSED",
            },
          })

          await db.emailReply.update({
            where: { id: reply.id },
            data: {
              campaignPaused: true,
            },
          })

          logger.info("Campaign paused due to reply", {
            campaignId: emailLog.prospect.campaignId,
            sentiment: analysis.sentiment,
            category: analysis.category,
          })
        }
      }

      // Update sending account reply rate
      if (emailLog.sendingAccountId) {
        await this.updateAccountReplyRate(emailLog.sendingAccountId)
      }

      logger.info("Reply handled", {
        emailLogId,
        prospectId: emailLog.prospectId,
        sentiment: analysis.sentiment,
        category: analysis.category,
      })
    } catch (error) {
      logger.error("Failed to handle reply", error as Error, { emailLogId })
    }
  }

  private async analyzeReply(subject: string, body: string) {
    try {
      const { object: analysis } = await generateObject({
        model: "openai/gpt-4o-mini",
        schema: replyAnalysisSchema,
        prompt: `Analyze this email reply and categorize it.

Subject: ${subject}
Body: ${body}

Determine:
1. SENTIMENT: Is the reply positive (interested), neutral (asking questions), negative (not interested), or an auto-reply?
2. CATEGORY: What type of reply is this?
   - INTERESTED: Wants to schedule call, demo, or learn more
   - NOT_INTERESTED: Not a fit, not now, remove me
   - QUESTION: Asking for more information
   - OUT_OF_OFFICE: Auto-reply, vacation responder
   - UNSUBSCRIBE: Wants to be removed from list
   - REFERRAL: Forwarding to someone else
3. IS_AUTO_REPLY: Is this an automated response?
4. SHOULD_PAUSE_CAMPAIGN: Should we stop sending more emails to this prospect?
5. SUMMARY: Brief 1-sentence summary of the reply

Be accurate and conservative. When in doubt, mark as NEUTRAL.`,
      })

      return analysis
    } catch (error) {
      logger.error("Failed to analyze reply", error as Error)

      // Return safe defaults
      return {
        sentiment: "NEUTRAL" as const,
        category: "QUESTION" as const,
        isAutoReply: false,
        shouldPauseCampaign: true, // Pause by default to be safe
        summary: "Reply received (analysis failed)",
      }
    }
  }

  private async updateAccountReplyRate(accountId: string): Promise<void> {
    const replies = await db.emailReply.findMany({
      where: {
        sendingAccountId: accountId,
        repliedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    })

    const totalSent = await db.emailLog.count({
      where: {
        sendingAccountId: accountId,
        sentAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    })

    const replyRate = totalSent > 0 ? (replies.length / totalSent) * 100 : 0

    await db.sendingAccount.update({
      where: { id: accountId },
      data: {
        replyRate,
      },
    })

    logger.info("Account reply rate updated", {
      accountId,
      replyRate,
      replies: replies.length,
      totalSent,
    })
  }

  async getReplyStats(campaignId: string) {
    const replies = await db.emailReply.findMany({
      where: { campaignId },
      include: {
        prospect: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            company: true,
          },
        },
      },
      orderBy: { repliedAt: "desc" },
    })

    const positive = replies.filter((r) => r.sentiment === "POSITIVE").length
    const neutral = replies.filter((r) => r.sentiment === "NEUTRAL").length
    const negative = replies.filter((r) => r.sentiment === "NEGATIVE").length
    const autoReplies = replies.filter((r) => r.isAutoReply).length

    return {
      total: replies.length,
      positive,
      neutral,
      negative,
      autoReplies,
      replyRate: 0, // Will be calculated by caller
      recent: replies.slice(0, 10),
    }
  }
}

export const replyDetector = new ReplyDetector()
