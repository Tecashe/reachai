import { db } from "@/lib/db"
import { logger } from "@/lib/logger"
import { generateText } from "ai"

interface ProspectData {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  company?: string | null
  jobTitle?: string | null
  industry?: string | null
  companySize?: string | null
  qualityScore?: number | null
  emailsOpened: number
  emailsClicked: number
  replied: boolean
}

interface SequenceData {
  id: string
  campaignId: string
  campaignName: string
  description?: string | null
  stepCount: number
  avgOpenRate?: number
  avgReplyRate?: number
  targetIndustry?: string
  targetRole?: string
}

interface AssignmentResult {
  prospectId: string
  recommendedSequenceId: string
  confidence: number
  reasoning: string
}

class AISequenceAssigner {
  /**
   * Analyze a prospect and recommend the best sequence for them
   */
  async assignProspectToSequence(
    prospectId: string,
    availableSequenceIds?: string[],
  ): Promise<AssignmentResult | null> {
    try {
      // Get prospect data
      const prospect = await db.prospect.findUnique({
        where: { id: prospectId },
        include: {
          emailLogs: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      })

      if (!prospect) {
        logger.warn("Prospect not found for AI assignment", { prospectId })
        return null
      }

      // Get available sequences
      const sequences = await this.getAvailableSequences(prospect.userId, availableSequenceIds)

      if (sequences.length === 0) {
        logger.warn("No available sequences for assignment", { prospectId })
        return null
      }

      // Build prompt for AI
      const prompt = this.buildAssignmentPrompt(prospect, sequences)

      // Call AI to determine best sequence
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt,
        temperature: 0.3,
      })

      // Parse AI response
      const result = this.parseAIResponse(text, prospect.id, sequences)

      if (result) {
        logger.info("AI sequence assignment completed", {
          prospectId,
          sequenceId: result.recommendedSequenceId,
          confidence: result.confidence,
        })
      }

      return result
    } catch (error) {
      logger.error("AI sequence assignment failed")
      return null
    }
  }

  /**
   * Bulk assign prospects to sequences
   */
  async bulkAssignProspects(prospectIds: string[], availableSequenceIds?: string[]): Promise<AssignmentResult[]> {
    const results: AssignmentResult[] = []

    for (const prospectId of prospectIds) {
      const result = await this.assignProspectToSequence(prospectId, availableSequenceIds)
      if (result) {
        results.push(result)
      }
    }

    return results
  }

  /**
   * Auto-assign new prospects when they're added to the system
   */
  async autoAssignNewProspect(prospectId: string): Promise<boolean> {
    const result = await this.assignProspectToSequence(prospectId)

    if (result && result.confidence >= 0.7) {
      // Get the campaign ID for the recommended sequence
      const sequence = await db.campaign.findUnique({
        where: { id: result.recommendedSequenceId },
      })

      if (sequence) {
        await db.prospect.update({
          where: { id: prospectId },
          data: {
            campaignId: result.recommendedSequenceId,
            status: "ACTIVE",
            currentStep: 1,
          },
        })

        logger.info("Prospect auto-assigned to sequence", {
          prospectId,
          campaignId: result.recommendedSequenceId,
          confidence: result.confidence,
        })

        return true
      }
    }

    return false
  }

  /**
   * Re-evaluate and potentially reassign prospects based on engagement
   */
  async reevaluateProspectAssignment(prospectId: string): Promise<AssignmentResult | null> {
    const prospect = await db.prospect.findUnique({
      where: { id: prospectId },
    })

    if (!prospect || !prospect.campaignId) {
      return null
    }

    // Only re-evaluate if prospect has low engagement
    if (prospect.emailsOpened > 0 || prospect.replied) {
      return null // Engaged prospects stay in current sequence
    }

    // Check if prospect has been in sequence for more than 7 days without engagement
    const daysSinceAdded = prospect.createdAt
      ? (Date.now() - new Date(prospect.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      : 0

    if (daysSinceAdded < 7) {
      return null // Give sequence time to work
    }

    // Get alternative sequences (excluding current)
    const result = await this.assignProspectToSequence(prospectId)

    if (result && result.recommendedSequenceId !== prospect.campaignId && result.confidence >= 0.8) {
      return result
    }

    return null
  }

  private async getAvailableSequences(userId: string, sequenceIds?: string[]): Promise<SequenceData[]> {
    const where: any = {
      userId,
      status: { in: ["ACTIVE", "PAUSED", "DRAFT"] },
      emailSequences: { some: {} }, // Must have at least one sequence step
    }

    if (sequenceIds && sequenceIds.length > 0) {
      where.id = { in: sequenceIds }
    }

    const campaigns = await db.campaign.findMany({
      where,
      include: {
        emailSequences: true,
        prospects: {
          select: {
            emailsOpened: true,
            emailsReplied: true,
            emailsReceived: true,
          },
        },
      },
    })

    return campaigns.map((campaign) => {
      const totalSent = campaign.prospects.reduce((sum, p) => sum + p.emailsReceived, 0)
      const totalOpened = campaign.prospects.reduce((sum, p) => sum + p.emailsOpened, 0)
      const totalReplied = campaign.prospects.reduce((sum, p) => sum + p.emailsReplied, 0)

      return {
        id: campaign.id,
        campaignId: campaign.id,
        campaignName: campaign.name,
        description: campaign.description,
        stepCount: campaign.emailSequences.length,
        avgOpenRate: totalSent > 0 ? (totalOpened / totalSent) * 100 : undefined,
        avgReplyRate: totalSent > 0 ? (totalReplied / totalSent) * 100 : undefined,
      }
    })
  }

  private buildAssignmentPrompt(prospect: any, sequences: SequenceData[]): string {
    const prospectInfo = `
PROSPECT INFORMATION:
- Name: ${prospect.firstName || "Unknown"} ${prospect.lastName || ""}
- Email: ${prospect.email}
- Company: ${prospect.company || "Unknown"}
- Job Title: ${prospect.jobTitle || "Unknown"}
- Industry: ${prospect.industry || "Unknown"}
- Company Size: ${prospect.companySize || "Unknown"}
- Quality Score: ${prospect.qualityScore || "Not scored"}
- Previous Opens: ${prospect.emailsOpened}
- Previous Clicks: ${prospect.emailsClicked}
- Has Replied: ${prospect.replied ? "Yes" : "No"}
`

    const sequenceInfo = sequences
      .map(
        (seq, index) => `
SEQUENCE ${index + 1}:
- ID: ${seq.id}
- Name: ${seq.campaignName}
- Description: ${seq.description || "No description"}
- Email Steps: ${seq.stepCount}
- Average Open Rate: ${seq.avgOpenRate?.toFixed(1) || "N/A"}%
- Average Reply Rate: ${seq.avgReplyRate?.toFixed(1) || "N/A"}%
`,
      )
      .join("\n")

    return `You are an AI assistant helping to assign prospects to the best email sequence for cold outreach.

${prospectInfo}

AVAILABLE SEQUENCES:
${sequenceInfo}

TASK:
Analyze the prospect's profile and determine which sequence would be most effective for reaching them. Consider:
1. Their job title and seniority level
2. Their industry and company size
3. The sequence's historical performance
4. The prospect's previous engagement (if any)

RESPOND IN THIS EXACT JSON FORMAT:
{
  "sequenceId": "the_sequence_id",
  "confidence": 0.85,
  "reasoning": "Brief explanation of why this sequence is best"
}

Only respond with the JSON, no other text.`
  }

  private parseAIResponse(text: string, prospectId: string, sequences: SequenceData[]): AssignmentResult | null {
    try {
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        logger.warn("Could not parse AI response", { text })
        return null
      }

      const parsed = JSON.parse(jsonMatch[0])

      // Validate sequence ID exists
      const validSequence = sequences.find((s) => s.id === parsed.sequenceId)
      if (!validSequence) {
        // Fall back to first sequence
        return {
          prospectId,
          recommendedSequenceId: sequences[0].id,
          confidence: 0.5,
          reasoning: "Fallback assignment - AI returned invalid sequence ID",
        }
      }

      return {
        prospectId,
        recommendedSequenceId: parsed.sequenceId,
        confidence: Math.min(Math.max(parsed.confidence || 0.5, 0), 1),
        reasoning: parsed.reasoning || "No reasoning provided",
      }
    } catch (error) {
      logger.error("Failed to parse AI response")
      return null
    }
  }
}

export const aiSequenceAssigner = new AISequenceAssigner()
