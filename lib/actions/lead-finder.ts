
"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { searchLeadsWithApollo } from "@/lib/services/apollo-lead-finder"
import { enrichLeadWithAI, generateTargetAudienceFromKeywords } from "@/lib/services/ai-lead-enrichement"
import { revalidatePath } from "next/cache"
import { syncLeadsFromCRM, type CrmCredentials } from "@/lib/services/crm-integrations"

/**
 * Find leads based on user description/keywords using AI + Apollo
 */
// ... (imports remain the same)

/**
 * Find leads based on user description/keywords using AI + Apollo
 */
export async function findLeadsFromDescription(
  description: string,
  campaignId?: string,
): Promise<{
  success: boolean
  leads?: any[]
  error?: string
  audienceProfile?: any
}> {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  // Security & Usage Checks
  if (user.subscriptionTier === "FREE") {
    return { success: false, error: "Lead Finder is available for PRO and ENTERPRISE plans only." }
  }

  // Estimate cost: 25 leads (default per page) * 1 credit per lead = 25 credits
  const estimatedCost = 25
  if (user.researchCredits < estimatedCost) {
    return {
      success: false,
      error: `Insufficient research credits. You need ${estimatedCost} credits to perform this search.`
    }
  }

  try {
    // Step 1: Use AI to generate target audience from description
    const audienceResult = await generateTargetAudienceFromKeywords(description)
    if (!audienceResult.success || !audienceResult.audience) {
      return { success: false, error: "Failed to generate target audience" }
    }

    const audience = audienceResult.audience

    // Step 2: Search Apollo.io with AI-generated criteria
    const searchResult = await searchLeadsWithApollo({
      jobTitles: audience.jobTitles,
      locations: audience.locations.length > 0 ? audience.locations : undefined,
      perPage: 25,
    })

    if (!searchResult.success || !searchResult.leads) {
      return {
        success: false,
        error: searchResult.error || "Failed to find leads",
        audienceProfile: audience,
      }
    }

    // Step 3: Enrich each lead with AI insights
    const enrichedLeads = await Promise.all(
      searchResult.leads.map(async (lead) => {
        const aiEnrichment = await enrichLeadWithAI({
          firstName: lead.firstName,
          lastName: lead.lastName,
          company: lead.company.name,
          title: lead.title,
          linkedinUrl: lead.linkedinUrl,
          websiteUrl: lead.company.website,
        })

        return {
          ...lead,
          aiInsights: aiEnrichment.success ? aiEnrichment.enrichedData : null,
          qualityScore: aiEnrichment.enrichedData?.qualityScore || 50,
        }
      }),
    )

    // Deduct credits only if successful
    await db.user.update({
      where: { id: user.id },
      data: { researchCredits: { decrement: estimatedCost } }
    })

    // Sort by quality score
    enrichedLeads.sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0))

    return {
      success: true,
      leads: enrichedLeads,
      audienceProfile: audience,
    }
  } catch (error: any) {
    console.error("[Lead Finder] Error:", error)
    return { success: false, error: error.message || "Failed to find leads" }
  }
}

// ... (importLeadsToCampaign remains same)

// ... (findLeadsWithApollo already has checks! skipping)

/**
 * Enrich leads with AI insights (used by dialog)
 */
export async function enrichLeadsWithAI(leads: any[]): Promise<{
  success: boolean
  enrichedLeads?: any[]
  error?: string
}> {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  // Check credits
  // Assuming AI enrichment costs 1 credit per lead for now (or use aiCreditsUsed)
  const costPerLead = 1
  const totalCost = leads.length * costPerLead

  if (user.researchCredits < totalCost) {
    return { success: false, error: `Insufficient credits. You need ${totalCost} credits.` }
  }

  try {
    const enrichedLeads = await Promise.all(
      leads.map(async (lead) => {
        const aiEnrichment = await enrichLeadWithAI({
          firstName: lead.firstName,
          lastName: lead.lastName,
          company: lead.company?.name,
          title: lead.title,
          linkedinUrl: lead.linkedinUrl,
          websiteUrl: lead.company?.website,
        })

        return {
          ...lead,
          aiInsights: aiEnrichment.success ? aiEnrichment.enrichedData?.enrichmentNotes : null,
          personalizedOpening: aiEnrichment.enrichedData?.personalizedOpening,
          painPoints: aiEnrichment.enrichedData?.painPoints,
          valueProposition: aiEnrichment.enrichedData?.valueProposition,
          qualityScore: aiEnrichment.enrichedData?.qualityScore || 50,
        }
      }),
    )

    // Deduct credits
    await db.user.update({
      where: { id: user.id },
      data: { researchCredits: { decrement: totalCost } }
    })

    // Sort by quality score descending
    enrichedLeads.sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0))

    return {
      success: true,
      enrichedLeads,
    }
  } catch (error: any) {
    console.error("[Enrich Leads AI] Error:", error)
    return { success: false, error: error.message || "Failed to enrich leads" }
  }
}

export async function syncCRMLeads(
  crmType: string,
  folderId?: string,
): Promise<{
  success: boolean
  imported?: number
  skipped?: number
  lowQualityContacts?: Array<{
    name: string
    email?: string
    reason: string
  }>
  error?: string
}> {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        integrations: {
          where: {
            type: crmType as any,
            isActive: true,
          },
        },
      },
    })

    if (!user) throw new Error("User not found")

    const integration = user.integrations[0]
    if (!integration) {
      return { success: false, error: `${crmType} integration not found` }
    }

    if (!integration.credentials) {
      return { success: false, error: "Integration credentials not found" }
    }

    const credentials = integration.credentials as unknown as CrmCredentials

    const result = await syncLeadsFromCRM(user.id, crmType.toLowerCase(), credentials, folderId)

    // Revalidate the prospects page
    if (folderId) {
      revalidatePath(`/dashboard/prospects`)
    }

    return {
      success: true,
      imported: result.imported,
      skipped: result.skipped,
      lowQualityContacts: result.lowQualityContacts,
    }
  } catch (error: any) {
    console.error("[CRM Sync] Error:", error)
    return {
      success: false,
      error: error.message || "Failed to sync CRM leads",
    }
  }
}



// export async function syncCRMLeads(crmType: string): Promise<{
//   success: boolean
//   imported?: number
//   skipped?: number
//   lowQualityContacts?: Array<{
//     name: string
//     email?: string
//     reason: string
//   }>
//   error?: string
// }> {
//   try {
//     const { userId } = await auth()
//     if (!userId) throw new Error("Unauthorized")

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//       include: {
//         integrations: {
//           where: {
//             type: crmType as any,
//             isActive: true,
//           },
//         },
//       },
//     })

//     if (!user) throw new Error("User not found")

//     const integration = user.integrations[0]
//     if (!integration) {
//       return { success: false, error: `${crmType} integration not found` }
//     }

//     if (!integration.credentials) {
//       return { success: false, error: "Integration credentials not found" }
//     }

//     const credentials = integration.credentials as unknown as CrmCredentials

//     // Sync leads from CRM
//     const result = await syncLeadsFromCRM(user.id, crmType.toLowerCase(), credentials)

//     return {
//       success: true,
//       imported: result.imported,
//       skipped: result.skipped,
//       lowQualityContacts: result.lowQualityContacts,
//     }
//   } catch (error: any) {
//     console.error("[CRM Sync] Error:", error)
//     return {
//       success: false,
//       error: error.message || "Failed to sync CRM leads",
//     }
//   }
// }


// export async function syncCRMLeadsOLD(crmType: string): Promise<{
//   success: boolean
//   imported?: number
//   error?: string
// }> {
//   try {
//     const { userId } = await auth()
//     if (!userId) throw new Error("Unauthorized")

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//       include: {
//         integrations: {
//           where: {
//             type: crmType as any,
//             isActive: true,
//           },
//         },
//       },
//     })

//     if (!user) throw new Error("User not found")

//     const integration = user.integrations[0]
//     if (!integration) {
//       return { success: false, error: `${crmType} integration not found` }
//     }

//     if (!integration.credentials) {
//       return { success: false, error: "Integration credentials not found" }
//     }

//     const credentials = integration.credentials as unknown as CrmCredentials

//     // Sync leads from CRM
//     const leads = await syncLeadsFromCRM(user.id, crmType.toLowerCase(), credentials)

//     return {
//       success: true,
//       imported: leads.length,
//     }
//   } catch (error: any) {
//     console.error("[CRM Sync] Error:", error)
//     return {
//       success: false,
//       error: error.message || "Failed to sync CRM leads",
//     }
//   }
// }
