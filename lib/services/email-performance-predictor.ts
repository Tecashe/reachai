import { generateObject } from "ai"
import { z } from "zod"

interface EmailAnalysis {
  predictedOpenRate: number
  predictedClickRate: number
  predictedReplyRate: number
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  suggestions: Array<{
    category: "subject" | "opening" | "body" | "cta" | "personalization"
    issue: string
    fix: string
    impact: "high" | "medium" | "low"
  }>
  spamScore: number
  readabilityScore: number
  sentimentScore: number
  estimatedReadTime: number
}

interface PredictorParams {
  subject: string
  body: string
  prospectData?: {
    industry?: string
    jobTitle?: string
    companySize?: string
    previousEngagement?: boolean
  }
  historicalData?: {
    avgOpenRate: number
    avgClickRate: number
    avgReplyRate: number
  }
}

export async function predictEmailPerformance(params: PredictorParams): Promise<EmailAnalysis> {
  const { subject, body, prospectData, historicalData } = params

  // Calculate basic metrics
  const wordCount = body.split(/\s+/).length
  const estimatedReadTime = Math.ceil(wordCount / 200) // 200 words per minute

  const prompt = `
You are an expert email deliverability and performance analyst with deep knowledge of cold email best practices.

Analyze this cold email and predict its performance:

SUBJECT: ${subject}

BODY:
${body}

${
  prospectData
    ? `
PROSPECT CONTEXT:
- Industry: ${prospectData.industry || "Unknown"}
- Job Title: ${prospectData.jobTitle || "Unknown"}
- Company Size: ${prospectData.companySize || "Unknown"}
- Previous Engagement: ${prospectData.previousEngagement ? "Yes" : "No"}
`
    : ""
}

${
  historicalData
    ? `
HISTORICAL BENCHMARKS:
- Average Open Rate: ${historicalData.avgOpenRate}%
- Average Click Rate: ${historicalData.avgClickRate}%
- Average Reply Rate: ${historicalData.avgReplyRate}%
`
    : ""
}

Provide a comprehensive analysis with:

1. PREDICTED PERFORMANCE (0-100 scale):
   - Open Rate: Based on subject line quality, sender reputation factors
   - Click Rate: Based on CTA clarity, link placement, value proposition
   - Reply Rate: Based on personalization, question quality, ease of response

2. OVERALL SCORE (0-100): Weighted average of all factors

3. STRENGTHS: 3-5 specific things this email does well

4. WEAKNESSES: 3-5 specific issues that hurt performance

5. ACTIONABLE SUGGESTIONS: 5-8 specific improvements with:
   - Category (subject/opening/body/cta/personalization)
   - Issue description
   - Specific fix
   - Impact level (high/medium/low)

6. SPAM SCORE (0-100): Likelihood of landing in spam (0 = safe, 100 = spam)
   Consider: spam trigger words, excessive links, formatting issues

7. READABILITY SCORE (0-100): How easy it is to read and understand

8. SENTIMENT SCORE (-100 to 100): Emotional tone (-100 = negative, 0 = neutral, 100 = positive)

Be brutally honest and specific. Focus on actionable insights that will improve performance.
`

  try {
    const { object } = await generateObject({
      model: "openai/gpt-4o",
      prompt,
      schema: z.object({
        predictedOpenRate: z.number().min(0).max(100),
        predictedClickRate: z.number().min(0).max(100),
        predictedReplyRate: z.number().min(0).max(100),
        overallScore: z.number().min(0).max(100),
        strengths: z.array(z.string()).min(3).max(5),
        weaknesses: z.array(z.string()).min(3).max(5),
        suggestions: z
          .array(
            z.object({
              category: z.enum(["subject", "opening", "body", "cta", "personalization"]),
              issue: z.string(),
              fix: z.string(),
              impact: z.enum(["high", "medium", "low"]),
            }),
          )
          .min(5)
          .max(8),
        spamScore: z.number().min(0).max(100),
        readabilityScore: z.number().min(0).max(100),
        sentimentScore: z.number().min(-100).max(100),
      }),
    })

    return {
      ...object,
      estimatedReadTime,
    }
  } catch (error) {
    console.error("[v0] Email performance prediction failed:", error)
    throw new Error("Failed to predict email performance")
  }
}

export async function compareEmailVersions(emails: Array<{ subject: string; body: string; label: string }>): Promise<
  Array<{
    label: string
    analysis: EmailAnalysis
    recommendation: string
  }>
> {
  const analyses = await Promise.all(
    emails.map(async (email) => {
      const analysis = await predictEmailPerformance({
        subject: email.subject,
        body: email.body,
      })
      return {
        label: email.label,
        analysis,
        recommendation: "",
      }
    }),
  )

  // Determine which version is best
  const bestVersion = analyses.reduce((best, current) =>
    current.analysis.overallScore > best.analysis.overallScore ? current : best,
  )

  // Add recommendations
  return analyses.map((item) => ({
    ...item,
    recommendation:
      item.label === bestVersion.label
        ? "Recommended - Highest predicted performance"
        : `${Math.round(bestVersion.analysis.overallScore - item.analysis.overallScore)}% lower than best version`,
  }))
}

export function getPerformanceInsights(analysis: EmailAnalysis): {
  verdict: "excellent" | "good" | "needs-improvement" | "poor"
  color: string
  message: string
} {
  const score = analysis.overallScore

  if (score >= 80) {
    return {
      verdict: "excellent",
      color: "text-green-600 dark:text-green-400",
      message: "This email is highly optimized and ready to send!",
    }
  } else if (score >= 60) {
    return {
      verdict: "good",
      color: "text-blue-600 dark:text-blue-400",
      message: "Good email, but there's room for improvement.",
    }
  } else if (score >= 40) {
    return {
      verdict: "needs-improvement",
      color: "text-orange-600 dark:text-orange-400",
      message: "This email needs significant improvements before sending.",
    }
  } else {
    return {
      verdict: "poor",
      color: "text-red-600 dark:text-red-400",
      message: "Major issues detected. Please revise before sending.",
    }
  }
}
