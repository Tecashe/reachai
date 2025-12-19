
import { generateObject, generateText } from "ai"
import { z } from "zod"
import { db } from "../db"
import { logger } from "../logger"

const variantSchema = z.object({
  subject: z.string(),
  body: z.string(),
  reasoning: z.string(),
  expectedPerformance: z.object({
    openRate: z.number(),
    replyRate: z.number(),
  }),
})

const optimizationSchema = z.object({
  variants: z.array(variantSchema),
  bestVariantIndex: z.number(),
  optimizationNotes: z.string(),
})

interface EmailOptimizationParams {
  originalSubject: string
  originalBody: string
  prospectData: {
    name?: string
    company?: string
    jobTitle?: string
    industry?: string
    researchData?: any
  }
  campaignGoal: string
  toneOfVoice: string
  variantCount?: number
}

interface EmailVariant {
  id: string
  subject: string
  body: string
  reasoning: string
  expectedOpenRate: number
  expectedReplyRate: number
  actualOpenRate?: number
  actualReplyRate?: number
  emailsSent: number
  isWinner: boolean
}

class AIEmailOptimizer {
  async generateVariants(params: EmailOptimizationParams): Promise<EmailVariant[]> {
    const { originalSubject, originalBody, prospectData, campaignGoal, toneOfVoice, variantCount = 3 } = params

    try {
      logger.info("Generating email variants", { variantCount })

      const { object: optimization } = await generateObject({
        model: "openai/gpt-4o-mini",
        schema: optimizationSchema,
        prompt: `You are an expert cold email copywriter. Generate ${variantCount} high-performing variants of this email.

Original Email:
Subject: ${originalSubject}
Body: ${originalBody}

Prospect Context:
- Name: ${prospectData.name || "Unknown"}
- Company: ${prospectData.company || "Unknown"}
- Job Title: ${prospectData.jobTitle || "Unknown"}
- Industry: ${prospectData.industry || "Unknown"}
- Research Data: ${JSON.stringify(prospectData.researchData || {})}

Campaign Goal: ${campaignGoal}
Tone: ${toneOfVoice}

Generate ${variantCount} variants that test different approaches:
1. Different subject line strategies (curiosity, value prop, question, personalization)
2. Different opening hooks
3. Different value propositions
4. Different CTAs

For each variant:
- Write a compelling subject line
- Write the full email body
- Explain your reasoning
- Predict open rate and reply rate (0-100)

Make each variant significantly different to test different hypotheses.`,
      })

      const variants: EmailVariant[] = optimization.variants.map((v, index) => ({
        id: `variant-${index}`,
        subject: v.subject,
        body: v.body,
        reasoning: v.reasoning,
        expectedOpenRate: v.expectedPerformance.openRate,
        expectedReplyRate: v.expectedPerformance.replyRate,
        emailsSent: 0,
        isWinner: index === optimization.bestVariantIndex,
      }))

      logger.info("Email variants generated", { count: variants.length })

      return variants
    } catch (error) {
      logger.error("Failed to generate email variants", error as Error)
      throw error
    }
  }

  async optimizeSubjectLine(subject: string, context: any): Promise<string[]> {
    try {
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt: `Generate 5 high-performing subject line variants for this cold email.

Original: ${subject}
Context: ${JSON.stringify(context)}

Requirements:
- Keep under 60 characters
- Test different approaches (curiosity, value, question, personalization, urgency)
- Avoid spam triggers
- Make them compelling and specific

Return only the 5 subject lines, one per line.`,
      })

      return text.split("\n").filter((line) => line.trim().length > 0)
    } catch (error) {
      logger.error("Failed to optimize subject line", error as Error)
      return [subject]
    }
  }

  async analyzePerformance(variantGroup: string, campaignId: string): Promise<void> {
    const emailLogs = await db.emailLog.findMany({
      where: {
        prospect: {
          campaignId,
        },
        variantGroup,
      },
    })

    // Group by variant
    const variantStats = new Map<string, { sent: number; opened: number; replied: number }>()

    emailLogs.forEach((log) => {
      const variant = log.variant || "A"
      const stats = variantStats.get(variant) || { sent: 0, opened: 0, replied: 0 }

      stats.sent++
      if (log.openedAt) stats.opened++
      if (log.repliedAt) stats.replied++

      variantStats.set(variant, stats)
    })

    // Calculate rates for each variant
    const variantPerformance = Array.from(variantStats.entries()).map(([variant, stats]) => ({
      variant,
      sent: stats.sent,
      opened: stats.opened,
      replied: stats.replied,
      openRate: stats.sent > 0 ? (stats.opened / stats.sent) * 100 : 0,
      replyRate: stats.sent > 0 ? (stats.replied / stats.sent) * 100 : 0,
    }))

    logger.info("Variant performance analyzed", {
      variantGroup,
      campaignId,
      variants: variantPerformance,
    })

    const winner = await this.selectWinningVariant(variantPerformance, campaignId, variantGroup)

    if (winner) {
      logger.info("Winning variant selected", {
        variantGroup,
        winner: winner.variant,
        openRate: winner.openRate,
        replyRate: winner.replyRate,
      })
    }
  }

  private async selectWinningVariant(
    variants: Array<{
      variant: string
      sent: number
      opened: number
      replied: number
      openRate: number
      replyRate: number
    }>,
    campaignId: string,
    variantGroup: string,
  ): Promise<{ variant: string; openRate: number; replyRate: number } | null> {
    // Require minimum sample size for statistical significance
    const MIN_SAMPLE_SIZE = 30
    const SIGNIFICANCE_LEVEL = 0.05 // 95% confidence

    // Check if we have enough data
    const totalSent = variants.reduce((sum, v) => sum + v.sent, 0)
    if (totalSent < MIN_SAMPLE_SIZE * variants.length) {
      logger.info("Insufficient data for statistical significance", {
        totalSent,
        required: MIN_SAMPLE_SIZE * variants.length,
      })
      return null
    }

    // Find best performing variant by reply rate (primary metric)
    const sortedByReplyRate = [...variants].sort((a, b) => b.replyRate - a.replyRate)
    const bestVariant = sortedByReplyRate[0]
    const secondBest = sortedByReplyRate[1]

    if (!secondBest) {
      // Only one variant, declare it winner
      return {
        variant: bestVariant.variant,
        openRate: bestVariant.openRate,
        replyRate: bestVariant.replyRate,
      }
    }

    // Perform chi-square test for statistical significance
    const chiSquare = this.calculateChiSquare(
      bestVariant.replied,
      bestVariant.sent - bestVariant.replied,
      secondBest.replied,
      secondBest.sent - secondBest.replied,
    )

    // Chi-square critical value for 1 degree of freedom at 95% confidence is 3.841
    const CRITICAL_VALUE = 3.841

    if (chiSquare > CRITICAL_VALUE) {
      // Statistically significant difference
      logger.info("Statistically significant winner found", {
        winner: bestVariant.variant,
        chiSquare,
        criticalValue: CRITICAL_VALUE,
      })

      // Update campaign to use winning variant
      await this.applyWinningVariant(campaignId, variantGroup, bestVariant.variant)

      return {
        variant: bestVariant.variant,
        openRate: bestVariant.openRate,
        replyRate: bestVariant.replyRate,
      }
    }

    logger.info("No statistically significant winner yet", {
      chiSquare,
      criticalValue: CRITICAL_VALUE,
      bestVariant: bestVariant.variant,
      bestReplyRate: bestVariant.replyRate,
    })

    return null
  }

  private calculateChiSquare(a1: number, a2: number, b1: number, b2: number): number {
    // Chi-square test for 2x2 contingency table
    // a1 = variant A successes, a2 = variant A failures
    // b1 = variant B successes, b2 = variant B failures

    const n = a1 + a2 + b1 + b2
    const chiSquare = (n * Math.pow(a1 * b2 - a2 * b1, 2)) / ((a1 + a2) * (b1 + b2) * (a1 + b1) * (a2 + b2))

    return chiSquare
  }

  private async applyWinningVariant(campaignId: string, variantGroup: string, winningVariant: string): Promise<void> {
    // Get the winning email content
    const winningEmail = await db.emailLog.findFirst({
      where: {
        prospect: { campaignId },
        variantGroup,
        variant: winningVariant,
      },
      orderBy: { createdAt: "desc" },
    })

    if (!winningEmail) return

    // Update campaign's email template with winning variant
    const sequences = await db.emailSequence.findMany({
      where: { campaignId },
      include: { template: true },
    })

    if (sequences.length > 0) {
      const firstSequence = sequences[0]

      await db.emailTemplate.update({
        where: { id: firstSequence.templateId },
        data: {
          subject: winningEmail.subject,
          body: winningEmail.body,
        },
      })

      logger.info("Campaign updated with winning variant", {
        campaignId,
        variantGroup,
        winningVariant,
        templateId: firstSequence.templateId,
      })
    }
  }

  async trackVariantPerformance(emailLogId: string, event: "open" | "click" | "reply"): Promise<void> {
    const emailLog = await db.emailLog.findUnique({
      where: { id: emailLogId },
    })

    if (!emailLog || !emailLog.variantGroup) return

    // Trigger performance analysis if enough data
    const totalEmails = await db.emailLog.count({
      where: {
        variantGroup: emailLog.variantGroup,
      },
    })

    // Analyze every 10 emails
    if (totalEmails % 10 === 0) {
      const prospect = await db.prospect.findUnique({
        where: { id: emailLog.prospectId },
      })

      if (prospect?.campaignId) {
        await this.analyzePerformance(emailLog.variantGroup, prospect.campaignId)
      }
    }
  }
}

export const aiEmailOptimizer = new AIEmailOptimizer()
export type { EmailOptimizationParams, EmailVariant }
