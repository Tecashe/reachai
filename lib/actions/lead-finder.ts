
"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { searchLeadsWithApollo, enrichLeadWithApollo } from "@/lib/services/apollo-lead-finder"
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
    // Step 1:Use AI to generate target audience from description
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

/**
 * Import found leads into campaign as prospects
 */
export async function importLeadsToCampaign(
  leads: any[],
  campaignId: string,
): Promise<{
  success: boolean
  imported?: number
  enrichedLeads?: any[]
  error?: string
}> {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  try {
    let imported = 0

    for (const lead of leads) {
      // Check if prospect already exists
      const existing = await db.prospect.findUnique({
        where: {
          email_campaignId: {
            email: lead.email,
            campaignId,
          },
        },
      })

      if (existing) continue

      // Create prospect with enriched data
      await db.prospect.create({
        data: {
          userId: user.id,
          campaignId,
          email: lead.email,
          firstName: lead.firstName,
          lastName: lead.lastName,
          company: lead.company?.name || lead.company,
          jobTitle: lead.title || lead.jobTitle,
          linkedinUrl: lead.linkedinUrl,
          websiteUrl: lead.company?.website,
          industry: lead.company?.industry,
          location: lead.location,
          phoneNumber: lead.phoneNumber,
          companySize: lead.company?.size,
          qualityScore: lead.qualityScore || 50,
          researchData: {
            apolloData: lead,
            aiInsights: lead.aiInsights,
            enrichedAt: new Date().toISOString(),
          },
          personalizationTokens: {
            personalizedOpening: lead.aiInsights?.personalizedOpening || lead.personalizedOpening,
            painPoints: lead.aiInsights?.painPoints || lead.painPoints,
            valueProposition: lead.aiInsights?.valueProposition || lead.valueProposition,
          },
        },
      })

      imported++
    }

    // Update campaign total prospects
    await db.campaign.update({
      where: { id: campaignId },
      data: { totalProspects: { increment: imported } },
    })

    revalidatePath(`/dashboard/campaigns/${campaignId}`)

    return { success: true, imported, enrichedLeads: leads }
  } catch (error: any) {
    console.error("[Import Leads] Error:", error)
    return { success: false, error: error.message || "Failed to import leads" }
  }
}

/**
 * Find leads with Apollo based on manual filters (used by dialog)
 */
export async function findLeadsWithApollo(params: {
  targetDescription?: string
  jobTitles?: string[]
  locations?: string[]
  companySize?: string
  industries?: string[]
  limit?: number
}): Promise<{
  success: boolean
  leads?: any[]
  error?: string
  creditsUsed?: number
}> {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  // Check subscription tier
  if (user.subscriptionTier === "FREE") {
    return { success: false, error: "Apollo lead finder requires a paid plan" }
  }

  const creditsNeeded = params.limit || 50

  // Check credits
  if (user.researchCredits < creditsNeeded) {
    return {
      success: false,
      error: `Insufficient credits. You need ${creditsNeeded} but have ${user.researchCredits}`,
    }
  }

  try {
    let searchParams: any = {
      perPage: params.limit || 50,
    }

    // If description provided, use AI to generate filters
    if (params.targetDescription) {
      const audienceResult = await generateTargetAudienceFromKeywords(params.targetDescription)
      if (audienceResult.success && audienceResult.audience) {
        searchParams.jobTitles = audienceResult.audience.jobTitles
        searchParams.locations = audienceResult.audience.locations
        searchParams.industries = audienceResult.audience.industries
      }
    } else {
      // Use manual filters
      searchParams = {
        jobTitles: params.jobTitles,
        locations: params.locations,
        industries: params.industries,
        perPage: params.limit || 50,
      }
    }

    // Search Apollo
    const searchResult = await searchLeadsWithApollo(searchParams)

    if (!searchResult.success || !searchResult.leads) {
      return {
        success: false,
        error: searchResult.error || "Failed to find leads",
      }
    }

    // Deduct credits
    await db.user.update({
      where: { id: user.id },
      data: { researchCredits: { decrement: creditsNeeded } },
    })

    return {
      success: true,
      leads: searchResult.leads,
      creditsUsed: creditsNeeded,
    }
  } catch (error: any) {
    console.error("[Find Leads Apollo] Error:", error)
    return { success: false, error: error.message || "Failed to find leads" }
  }
}

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

/**
 * Enrich selected leads with AI and import them directly into a campaign.
 * This is the new optimized flow: Search -> Select -> Enrich & Import.
 */
export async function enrichAndImportSelectedLeads(
  selectedLeads: any[],
  campaignId: string,
): Promise<{
  success: boolean
  imported?: number
  error?: string
  creditsUsed?: number
}> {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error("User not found")

  // Check subscription tier
  if (user.subscriptionTier === "FREE") {
    return { success: false, error: "This feature requires a paid plan" }
  }

  // Calculate enrichment cost (1 credit per lead for AI enrichment)
  const enrichmentCost = selectedLeads.length
  if (user.researchCredits < enrichmentCost) {
    return {
      success: false,
      error: `Insufficient credits. You need ${enrichmentCost} credits for AI enrichment.`,
    }
  }

  try {
    let imported = 0

    for (const lead of selectedLeads) {
      // Step 0: Ensure we have an email (Apollo Enrichment)
      let leadWithContactInfo = lead

      // If no email, we must enrich with Apollo first to reveal it
      if (!lead.email || lead.email.trim() === "") {
        console.log(`[Enrich & Import] Revealing email for lead ${lead.id}...`)
        const apolloEnrichment = await enrichLeadWithApollo({ id: lead.id })

        if (!apolloEnrichment.success || !apolloEnrichment.lead || !apolloEnrichment.lead.email) {
          console.warn(`[Enrich & Import] Failed to reveal email for lead ${lead.id}. Skipping.`, apolloEnrichment.error)
          continue
        }

        leadWithContactInfo = apolloEnrichment.lead
      }

      const finalLead = leadWithContactInfo

      // Check if prospect already exists
      const existing = await db.prospect.findUnique({
        where: {
          email_campaignId: {
            email: finalLead.email,
            campaignId,
          },
        },
      })

      if (existing) continue

      // Enrich this lead with AI
      const aiEnrichment = await enrichLeadWithAI({
        firstName: finalLead.firstName,
        lastName: finalLead.lastName,
        company: finalLead.company?.name || finalLead.company,
        title: finalLead.title,
        linkedinUrl: finalLead.linkedinUrl,
        websiteUrl: finalLead.company?.website,
      })

      // Create prospect with enriched data
      await db.prospect.create({
        data: {
          userId: user.id,
          campaignId,
          email: finalLead.email,
          firstName: finalLead.firstName,
          lastName: finalLead.lastName,
          company: finalLead.company?.name || finalLead.company,
          jobTitle: finalLead.title || finalLead.jobTitle,
          linkedinUrl: finalLead.linkedinUrl,
          websiteUrl: finalLead.company?.website,
          industry: finalLead.company?.industry,
          location: finalLead.location,
          phoneNumber: finalLead.phoneNumber,
          companySize: finalLead.company?.size,
          qualityScore: aiEnrichment.success ? aiEnrichment.enrichedData?.qualityScore || 50 : 50,
          researchData: {
            apolloData: finalLead,
            aiInsights: aiEnrichment.success ? (aiEnrichment.enrichedData as any) : null,
            enrichedAt: new Date().toISOString(),
          },
          personalizationTokens: {
            personalizedOpening: aiEnrichment.enrichedData?.personalizedOpening,
            painPoints: aiEnrichment.enrichedData?.painPoints,
            valueProposition: aiEnrichment.enrichedData?.valueProposition,
          },
        },
      })

      imported++
    }

    // Deduct credits for enrichment
    await db.user.update({
      where: { id: user.id },
      data: { researchCredits: { decrement: enrichmentCost } },
    })

    // Update campaign total prospects
    await db.campaign.update({
      where: { id: campaignId },
      data: { totalProspects: { increment: imported } },
    })

    revalidatePath(`/dashboard/campaigns/${campaignId}`)
    revalidatePath(`/dashboard/prospects`)

    return { success: true, imported, creditsUsed: enrichmentCost }
  } catch (error: any) {
    console.error("[Enrich & Import Leads] Error:", error)
    return { success: false, error: error.message || "Failed to enrich and import leads" }
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
