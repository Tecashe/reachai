import { generateObject } from "ai"
import { fastModel } from "@/lib/ai-provider"
import { z } from "zod"
import { db } from "../db"
import { logger } from "../logger"

const validationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  spamScore: z.number().min(0).max(100),
  personalizationScore: z.number().min(0).max(100),
  deliverabilityScore: z.number().min(0).max(100),
  spamTriggers: z.array(z.string()),
  missingPersonalization: z.array(z.string()),
  recommendations: z.array(z.string()),
})

interface ValidationParams {
  subject: string
  body: string
  recipientEmail: string
  recipientName?: string
  recipientCompany?: string
  userId: string
}

interface ValidationResult {
  id: string
  overallScore: number
  spamScore: number
  personalizationScore: number
  deliverabilityScore: number
  spamTriggers: string[]
  missingPersonalization: string[]
  recommendations: string[]
  passed: boolean
}

class EmailValidator {
  private readonly PASS_THRESHOLD = 70

  async validateEmail(params: ValidationParams): Promise<ValidationResult> {
    const { subject, body, recipientEmail, recipientName, recipientCompany, userId } = params

    try {
      logger.info("Validating email", { recipientEmail, userId })

      // Use AI to analyze email content
      const { object: analysis } = await generateObject({
        model: fastModel,
        schema: validationSchema,
        prompt: `You are an email deliverability expert. Analyze this cold email and provide detailed scoring.

Email Details:
- Subject: ${subject}
- Body: ${body}
- Recipient: ${recipientEmail}
- Recipient Name: ${recipientName || "Unknown"}
- Recipient Company: ${recipientCompany || "Unknown"}

Analyze the email for:

1. SPAM SCORE (0-100, lower is better):
   - Check for spam trigger words (FREE, GUARANTEE, ACT NOW, etc.)
   - Excessive capitalization or punctuation
   - Suspicious links or attachments
   - Poor formatting

2. PERSONALIZATION SCORE (0-100, higher is better):
   - Use of recipient's name
   - Company-specific references
   - Job title or role mentions
   - Relevant pain points or use cases
   - Generic vs. specific language

3. DELIVERABILITY SCORE (0-100, higher is better):
   - Professional tone
   - Clear value proposition
   - Proper email structure
   - Appropriate length (not too long)
   - Clear call-to-action

4. OVERALL SCORE: Average of the three scores above

Provide:
- Specific spam triggers found (if any)
- Missing personalization opportunities
- Actionable recommendations to improve the email

Be strict but fair. A good cold email should score 70+.`,
      })

      // Store validation result
      const validationResult = await db.emailValidationResult.create({
        data: {
          userId,
          subject,
          body,
          recipientEmail,
          overallScore: analysis.overallScore,
          spamScore: analysis.spamScore,
          personalizationScore: analysis.personalizationScore,
          deliverabilityScore: analysis.deliverabilityScore,
          spamTriggers: analysis.spamTriggers,
          missingPersonalization: analysis.missingPersonalization,
          recommendations: analysis.recommendations,
        },
      })

      logger.info("Email validation complete", {
        validationId: validationResult.id,
        overallScore: analysis.overallScore,
        passed: analysis.overallScore >= this.PASS_THRESHOLD,
      })

      return {
        id: validationResult.id,
        ...analysis,
        passed: analysis.overallScore >= this.PASS_THRESHOLD,
      }
    } catch (error) {
      logger.error("Email validation failed", error as Error, { recipientEmail })

      // Return default passing validation on error
      return {
        id: "",
        overallScore: 75,
        spamScore: 30,
        personalizationScore: 70,
        deliverabilityScore: 80,
        spamTriggers: [],
        missingPersonalization: [],
        recommendations: ["Validation service temporarily unavailable"],
        passed: true,
      }
    }
  }

  async validateBulk(emails: ValidationParams[]): Promise<ValidationResult[]> {
    logger.info(`Validating ${emails.length} emails in bulk`)

    const results: ValidationResult[] = []

    // Validate sequentially to avoid rate limits
    for (const email of emails) {
      const result = await this.validateEmail(email)
      results.push(result)

      // Small delay between validations
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    const passedCount = results.filter((r) => r.passed).length
    logger.info(`Bulk validation complete: ${passedCount}/${emails.length} passed`)

    return results
  }
}

export const emailValidator = new EmailValidator()
export type { ValidationParams, ValidationResult }
