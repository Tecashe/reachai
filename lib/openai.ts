import OpenAI from "openai"
import { env } from "./env"

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

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

Generate both a subject line and email body. Return as JSON with keys "subject" and "body".`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert cold email copywriter who creates highly personalized, conversion-focused emails.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  })

  const content = response.choices[0].message.content
  if (!content) {
    throw new Error("No content generated from OpenAI")
  }

  return JSON.parse(content) as { subject: string; body: string }
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

Also provide 3-5 specific suggestions to improve the email.

Return as JSON with keys: "openRate", "clickRate", "replyRate", "overallScore", "suggestions" (array of strings).`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an email marketing expert who analyzes cold emails and predicts their performance.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  })

  const content = response.choices[0].message.content
  if (!content) {
    throw new Error("No analysis generated from OpenAI")
  }

  return JSON.parse(content) as {
    openRate: number
    clickRate: number
    replyRate: number
    overallScore: number
    suggestions: string[]
  }
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
4. Personalization angles

Return as JSON with keys: "painPoints" (array), "priorities" (array), "talkingPoints" (array), "personalizationAngles" (array).`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a B2B sales research expert who provides insights for cold email personalization.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.5,
  })

  const content = response.choices[0].message.content
  if (!content) {
    throw new Error("No enrichment data generated from OpenAI")
  }

  return JSON.parse(content) as {
    painPoints: string[]
    priorities: string[]
    talkingPoints: string[]
    personalizationAngles: string[]
  }
}
