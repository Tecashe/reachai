"use server"

import { generateText } from "ai"

interface LeadEnrichmentParams {
  firstName?: string
  lastName?: string
  company?: string
  title?: string
  linkedinUrl?: string
  websiteUrl?: string
}

interface EnrichedLead {
  personalizedOpening?: string
  painPoints?: string[]
  valueProposition?: string
  qualityScore: number
  enrichmentNotes?: string
}

/**
 * Use AI to enrich lead data with personalized insights
 */
export async function enrichLeadWithAI(lead: LeadEnrichmentParams): Promise<{
  success: boolean
  enrichedData?: EnrichedLead
  error?: string
}> {
  try {
    const prompt = `Analyze this lead and provide personalized outreach insights:

Lead Information:
- Name: ${lead.firstName} ${lead.lastName}
- Company: ${lead.company || "Unknown"}
- Title: ${lead.title || "Unknown"}
- LinkedIn: ${lead.linkedinUrl || "N/A"}
- Company Website: ${lead.websiteUrl || "N/A"}

Please provide:
1. A personalized opening line that references their role or company
2. 3 potential pain points they might have in their role
3. A tailored value proposition
4. A quality score (0-100) based on how well-qualified this lead appears
5. Brief notes on why this lead is/isn't a good fit

Format your response as JSON with these keys:
{
  "personalizedOpening": "...",
  "painPoints": ["...", "...", "..."],
  "valueProposition": "...",
  "qualityScore": 85,
  "enrichmentNotes": "..."
}`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
    })

    // Parse AI response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { success: false, error: "Failed to parse AI response" }
    }

    const enrichedData = JSON.parse(jsonMatch[0])

    return {
      success: true,
      enrichedData: {
        personalizedOpening: enrichedData.personalizedOpening,
        painPoints: enrichedData.painPoints || [],
        valueProposition: enrichedData.valueProposition,
        qualityScore: enrichedData.qualityScore || 50,
        enrichmentNotes: enrichedData.enrichmentNotes,
      },
    }
  } catch (error: any) {
    console.error("[AI Lead Enrichment] Error:", error)
    return {
      success: false,
      error: error.message || "AI enrichment failed",
    }
  }
}

/**
 * Generate a target audience description from keywords
 */
export async function generateTargetAudienceFromKeywords(keywords: string): Promise<{
  success: boolean
  audience?: {
    jobTitles: string[]
    industries: string[]
    companySizes: string[]
    locations: string[]
    searchStrategy: string
  }
  error?: string
}> {
  try {
    const prompt = `Based on these keywords or description: "${keywords}"

Generate a detailed target audience profile for B2B prospecting. Provide:
1. Specific job titles to target
2. Relevant industries
3. Ideal company sizes
4. Geographic locations (if applicable)
5. A search strategy summary

Format as JSON:
{
  "jobTitles": ["...", "..."],
  "industries": ["...", "..."],
  "companySizes": ["...", "..."],
  "locations": ["...", "..."],
  "searchStrategy": "..."
}`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { success: false, error: "Failed to parse AI response" }
    }

    const audience = JSON.parse(jsonMatch[0])

    return { success: true, audience }
  } catch (error: any) {
    console.error("[AI Audience Generation] Error:", error)
    return { success: false, error: error.message || "Failed to generate audience" }
  }
}
