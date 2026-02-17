import { generateObject } from "ai"
import { z } from "zod"
import { fastModel, qualityModel } from "./ai-provider"

// Re-export openai for backward compatibility if needed (though usage check showed none)
// effectively deprecated but keeping file structure
export const openai = null

export async function generateEmailContent({
  prospectData,
  campaignContext,
  tone = "professional",
  personalizationLevel = "MEDIUM",
}: {
  prospectData: {
    firstName?: string
    lastName?: string
    company?: string
    jobTitle?: string
    industry?: string
    researchData?: any
  }
  campaignContext: {
    goal: string
    valueProposition: string
    callToAction: string
  }
  tone?: string
  personalizationLevel?: "LOW" | "MEDIUM" | "HIGH" | "ULTRA"
}) {
  const personalizationPrompts = {
    LOW: "Use basic personalization with name and company.",
    MEDIUM: "Include job title and industry insights.",
    HIGH: "Deep personalization with specific pain points and solutions.",
    ULTRA: "Maximum personalization using all available research data and insights.",
  }

  const prompt = `You are an expert cold email copywriter. Generate a highly personalized cold email.

Prospect Information:
- Name: ${prospectData.firstName} ${prospectData.lastName}
- Company: ${prospectData.company}
- Job Title: ${prospectData.jobTitle}
- Industry: ${prospectData.industry}
${prospectData.researchData ? `- Research Insights: ${JSON.stringify(prospectData.researchData)}` : ""}

Campaign Context:
- Goal: ${campaignContext.goal}
- Value Proposition: ${campaignContext.valueProposition}
- Call to Action: ${campaignContext.callToAction}

Requirements:
- Tone: ${tone}
- Personalization Level: ${personalizationPrompts[personalizationLevel]}
- Keep it concise (under 150 words)
- Focus on the prospect's needs and pain points
- Include a clear, specific call to action
- Make it feel personal, not templated

Generate both a subject line and email body.`

  const schema = z.object({
    subject: z.string(),
    body: z.string(),
  })

  // Using fastModel (Gemini Flash) as it's sufficient for email gen and very fast
  const { object } = await generateObject({
    model: fastModel,
    schema,
    prompt,
    system: "You are an expert cold email copywriter who creates highly personalized, conversion-focused emails.",
    temperature: 0.7,
  })

  return object
}

export async function analyzeEmailPerformance({
  subject,
  body,
  prospectData,
}: {
  subject: string
  body: string
  prospectData?: any
}) {
  const prompt = `Analyze this cold email and predict its performance:

Subject: ${subject}
Body: ${body}

Provide predictions for:
1. Open rate (0-100%)
2. Click rate (0-100%)
3. Reply rate (0-100%)
4. Overall score (0-100)

Also provide 3-5 specific suggestions to improve the email.`

  const schema = z.object({
    openRate: z.number(),
    clickRate: z.number(),
    replyRate: z.number(),
    overallScore: z.number(),
    suggestions: z.array(z.string()),
  })

  const { object } = await generateObject({
    model: fastModel,
    schema,
    prompt,
    system: "You are an email marketing expert who analyzes cold emails and predicts their performance.",
    temperature: 0.3,
  })

  return object
}

export async function enrichProspectData({
  company,
  jobTitle,
  industry,
  websiteUrl,
}: {
  company?: string
  jobTitle?: string
  industry?: string
  websiteUrl?: string
}) {
  const prompt = `Generate insights about this prospect for cold email personalization:

Company: ${company || "Unknown"}
Job Title: ${jobTitle || "Unknown"}
Industry: ${industry || "Unknown"}
Website: ${websiteUrl || "Unknown"}

Provide:
1. Likely pain points for this role
2. Key priorities and goals
3. Relevant talking points
4. Personalization angles`

  const schema = z.object({
    painPoints: z.array(z.string()),
    priorities: z.array(z.string()),
    talkingPoints: z.array(z.string()),
    personalizationAngles: z.array(z.string()),
  })

  const { object } = await generateObject({
    model: fastModel,
    schema,
    prompt,
    system: "You are a B2B sales research expert who provides insights for cold email personalization.",
    temperature: 0.5,
  })

  return object
}
