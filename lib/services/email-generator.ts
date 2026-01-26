import { generateObject } from "ai"
import { z } from "zod"

interface GenerateEmailParams {
  prospect: {
    firstName?: string
    lastName?: string
    company?: string
    jobTitle?: string
    email: string
  }
  researchData?: {
    companyInfo?: string
    recentNews?: string[]
    painPoints?: string[]
    talkingPoints?: string[]
    competitorTools?: string[]
  }
  template?: {
    subject?: string
    body?: string
  }
  tone?: string
  personalizationLevel?: "LOW" | "MEDIUM" | "HIGH" | "ULTRA"
  callToAction?: string
}

interface GeneratedEmail {
  subject: string
  body: string
  qualityScore: number
  personalizationScore: number
  suggestions: string[]
}

export async function generateEmail(params: GenerateEmailParams): Promise<GeneratedEmail> {
  console.log("[builtbycashe] Generating email for:", params.prospect.email)

  const {
    prospect,
    researchData,
    template,
    tone = "professional",
    personalizationLevel = "MEDIUM",
    callToAction = "schedule a quick call",
  } = params

  const prompt = buildEmailPrompt(prospect, researchData, template, tone, personalizationLevel, callToAction)

  try {
    const { object } = await generateObject({
      model: "openai/gpt-4o",
      prompt,
      schema: z.object({
        subject: z.string(),
        body: z.string(),
        qualityScore: z.number(),
        personalizationScore: z.number(),
        suggestions: z.array(z.string()),
      }),
    })

    console.log("[builtbycashe] Email generated with quality score:", object.qualityScore)

    return object as GeneratedEmail
  } catch (error) {
    console.error("[builtbycashe] Email generation failed:", error)
    throw new Error("Failed to generate email")
  }
}

function buildEmailPrompt(
  prospect: any,
  researchData: any,
  template: any,
  tone: string,
  personalizationLevel: string,
  callToAction: string,
): string {
  return `
You are an expert cold email copywriter. Write a highly personalized, compelling cold email that gets replies.

PROSPECT INFORMATION:
- Name: ${prospect.firstName} ${prospect.lastName}
- Company: ${prospect.company}
- Job Title: ${prospect.jobTitle}
- Email: ${prospect.email}

${researchData
      ? `
RESEARCH INSIGHTS:
- Company Info: ${researchData.companyInfo || "Not available"}
- Recent News: ${researchData.recentNews?.join(", ") || "Not available"}
- Pain Points: ${researchData.painPoints?.join(", ") || "Not available"}
- Talking Points: ${researchData.talkingPoints?.join(", ") || "Not available"}
- Current Tools: ${researchData.competitorTools?.join(", ") || "Not available"}
`
      : ""
    }

${template
      ? `
TEMPLATE GUIDANCE:
- Subject Template: ${template.subject || "Create from scratch"}
- Body Template: ${template.body || "Create from scratch"}
`
      : ""
    }

REQUIREMENTS:
- Tone: ${tone}
- Personalization Level: ${personalizationLevel}
- Call to Action: ${callToAction}
- Length: 100-150 words (keep it concise)
- Format: Professional business email

PERSONALIZATION GUIDELINES:
${personalizationLevel === "LOW" ? "- Use basic personalization (name, company)" : ""}
${personalizationLevel === "MEDIUM" ? "- Include job title and industry-specific insights" : ""}
${personalizationLevel === "HIGH" ? "- Reference recent news and specific pain points" : ""}
${personalizationLevel === "ULTRA" ? "- Deep personalization with competitor mentions and specific talking points" : ""}

BEST PRACTICES:
1. Start with a personalized hook (not "I hope this email finds you well")
2. Show you've done research (reference specific details)
3. Focus on THEIR problems, not your product
4. Keep it conversational and human
5. Clear, specific call to action
6. No buzzwords or corporate jargon
7. Short paragraphs (2-3 sentences max)

OUTPUT FORMAT:
Provide:
1. Subject line (6-8 words, compelling, personalized)
2. Email body (100-150 words, well-structured)
3. Quality score (0-100) based on personalization, clarity, and persuasiveness
4. Personalization score (0-100) based on how well research was incorporated
5. 3-5 suggestions for improvement

Make it feel like a human wrote it, not AI. Be specific, not generic.
`
}

export async function generateEmailVariations(params: GenerateEmailParams, count = 3): Promise<GeneratedEmail[]> {
  console.log("[builtbycashe] Generating", count, "email variations")

  const variations = await Promise.all(
    Array.from({ length: count }, async (_, i) => {
      // Vary the tone slightly for each variation
      const tones = ["professional", "casual", "friendly", "consultative"]
      const variedParams = {
        ...params,
        tone: tones[i % tones.length],
      }
      return generateEmail(variedParams)
    }),
  )

  return variations
}

export async function improveEmail(
  originalEmail: { subject: string; body: string },
  feedback: string,
): Promise<GeneratedEmail> {
  console.log("[builtbycashe] Improving email based on feedback")

  const prompt = `
You are an expert email copywriter. Improve this cold email based on the feedback provided.

ORIGINAL EMAIL:
Subject: ${originalEmail.subject}

Body:
${originalEmail.body}

FEEDBACK:
${feedback}

Rewrite the email incorporating the feedback while maintaining personalization and effectiveness.
Provide the improved version with quality scores and suggestions.
`

  try {
    const { object } = await generateObject({
      model: "openai/gpt-4o",
      prompt,
      schema: z.object({
        subject: z.string(),
        body: z.string(),
        qualityScore: z.number(),
        personalizationScore: z.number(),
        suggestions: z.array(z.string()),
      }),
    })

    return object as GeneratedEmail
  } catch (error) {
    console.error("[builtbycashe] Email improvement failed:", error)
    throw new Error("Failed to improve email")
  }
}

export function scoreEmailQuality(email: { subject: string; body: string }): {
  overallScore: number
  breakdown: {
    personalization: number
    clarity: number
    length: number
    callToAction: number
  }
} {
  const breakdown = {
    personalization: 0,
    clarity: 0,
    length: 0,
    callToAction: 0,
  }

  // Check personalization (basic heuristics)
  const hasName = /\b[A-Z][a-z]+\b/.test(email.body)
  const hasCompany = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/.test(email.body)
  breakdown.personalization = (hasName ? 50 : 0) + (hasCompany ? 50 : 0)

  // Check clarity (sentence structure)
  const sentences = email.body.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  breakdown.clarity = Math.min(100, sentences.length * 20)

  // Check length (100-150 words is ideal)
  const wordCount = email.body.split(/\s+/).length
  if (wordCount >= 100 && wordCount <= 150) {
    breakdown.length = 100
  } else if (wordCount < 100) {
    breakdown.length = (wordCount / 100) * 100
  } else {
    breakdown.length = Math.max(0, 100 - (wordCount - 150) * 2)
  }

  // Check for call to action
  const ctaKeywords = ["call", "meeting", "chat", "discuss", "schedule", "connect", "reply"]
  const hasCTA = ctaKeywords.some((keyword) => email.body.toLowerCase().includes(keyword))
  breakdown.callToAction = hasCTA ? 100 : 0

  const overallScore = Math.round(
    (breakdown.personalization + breakdown.clarity + breakdown.length + breakdown.callToAction) / 4,
  )

  return { overallScore, breakdown }
}

export async function generateFullSequence(params: {
  prospect: any
  researchData?: any
  tone?: string
  stepsCount?: number // Default 3
}): Promise<{ steps: Array<{ subject: string; body: string; delayDays: number }> }> {
  console.log("[builtbycashe] Generating full sequence for:", params.prospect.email)

  const { prospect, researchData, tone = "professional", stepsCount = 3 } = params

  const prompt = `
You are an expert cold email strategist. Create a complete ${stepsCount}-step cold email sequence.

PROSPECT: ${prospect.firstName} ${prospect.lastName} (${prospect.jobTitle} at ${prospect.company})
${researchData ? `RESEARCH: ${JSON.stringify(researchData)}` : ""}

REQUIREMENTS:
- Tone: ${tone}
- Steps: ${stepsCount}
- Goal: Book a meeting
- Use Spintax where appropriate for variation (e.g. {Hi|Hello|Hey}).

OUTPUT FORMAT (JSON):
{
  "steps": [
    { "subject": "Step 1 Subject", "body": "Step 1 Body...", "delayDays": 0 },
    { "subject": "Step 2 Subject (RE:)", "body": "Step 2 Body...", "delayDays": 2 }
  ]
}
`

  try {
    const { object } = await generateObject({
      model: "openai/gpt-4o",
      prompt,
      schema: z.object({
        steps: z.array(
          z.object({
            subject: z.string(),
            body: z.string(),
            delayDays: z.number(),
          }),
        ),
      }),
    })

    return object
  } catch (error) {
    console.error("[builtbycashe] Sequence generation failed:", error)
    throw new Error("Failed to generate sequence")
  }
}

export async function generateSpintax(text: string): Promise<string> {
  const prompt = `
Rewrite the following text adding Spintax variations {option1|option2|option3} for greetings, openers, and common phrases to increase variability.
Keep the original meaning.

TEXT: "${text}"

OUTPUT: Just the rewriting text with Spintax.
`
  try {
    const { object } = await generateObject({
      model: "openai/gpt-4o", // Use a cheaper model if possible for this simple task
      prompt,
      schema: z.object({
        spintaxText: z.string(),
      }),
    })
    return object.spintaxText
  } catch (error) {
    return text // Fallback
  }
}
