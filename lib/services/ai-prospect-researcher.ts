
"use server"

import { generateText } from "ai"
import { qualityModel } from "@/lib/ai-provider"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"

interface ResearchResult {
  qualityScore: number
  companyOverview?: string
  recentNews?: string[]
  talkingPoints?: string[]
  personalizationHooks?: string[]
  enrichedData?: Record<string, any>
}

export class AIProspectResearcher {
  /**
   * Research a single prospect using AI
   */
  async researchProspect(prospectId: string): Promise<ResearchResult> {
    try {
      const prospect = await db.prospect.findUnique({
        where: { id: prospectId },
      })

      if (!prospect) {
        throw new Error("Prospect not found")
      }

      logger.info("Researching prospect", { prospectId, email: prospect.email })

      // Build research context
      const researchContext = this.buildResearchContext(prospect)

      // Use AI to analyze and generate insights
      const { text } = await generateText({
        model: qualityModel,
        prompt: `You are an expert sales researcher. Analyze this prospect and provide actionable insights for cold outreach.

Prospect Information:
${researchContext}

Provide a detailed analysis in JSON format with:
1. qualityScore (0-100): How good is this prospect for outreach?
2. companyOverview: 2-3 sentence overview of their business
3. recentNews: Array of recent notable events or achievements
4. talkingPoints: Array of conversation starters based on their situation
5. personalizationHooks: Array of specific things to mention in outreach
6. enrichedData: Any additional useful information

Be specific and actionable. Focus on recent events, pain points, and opportunities.`,
      })

      const result = JSON.parse(text) as ResearchResult

      await db.prospect.update({
        where: { id: prospectId },
        data: {
          researchData: result as any, // Cast to any to satisfy Prisma's JsonValue type
          qualityScore: result.qualityScore,
          personalizationTokens: {
            companyOverview: result.companyOverview,
            recentNews: result.recentNews,
            talkingPoints: result.talkingPoints,
          } as any, // Cast personalizationTokens to any as well
        },
      })

      logger.info("Prospect research completed", {
        prospectId,
        qualityScore: result.qualityScore,
      })

      return result
    } catch (error) {
      logger.error("Failed to research prospect", error as Error, { prospectId })
      throw error
    }
  }

  /**
   * Build research context from prospect data
   */
  private buildResearchContext(prospect: any): string {
    const parts: string[] = []

    if (prospect.firstName || prospect.lastName) {
      parts.push(`Name: ${prospect.firstName} ${prospect.lastName}`.trim())
    }
    if (prospect.email) parts.push(`Email: ${prospect.email}`)
    if (prospect.company) parts.push(`Company: ${prospect.company}`)
    if (prospect.jobTitle) parts.push(`Job Title: ${prospect.jobTitle}`)
    if (prospect.linkedinUrl) parts.push(`LinkedIn: ${prospect.linkedinUrl}`)
    if (prospect.location) parts.push(`Location: ${prospect.location}`)
    if (prospect.industry) parts.push(`Industry: ${prospect.industry}`)
    if (prospect.companySize) parts.push(`Company Size: ${prospect.companySize}`)

    return parts.join("\n")
  }

  /**
   * Bulk research prospects
   */
  async bulkResearch(prospectIds: string[]): Promise<ResearchResult[]> {
    const results: ResearchResult[] = []

    for (const prospectId of prospectIds) {
      try {
        const result = await this.researchProspect(prospectId)
        results.push(result)
      } catch (error) {
        logger.error("Bulk research failed for prospect", error as Error, { prospectId })
        results.push({
          qualityScore: 0,
        })
      }
    }

    return results
  }
}

export const aiProspectResearcher = new AIProspectResearcher()
