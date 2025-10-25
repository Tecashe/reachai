// import { type NextRequest, NextResponse } from "next/server"
// import { batchResearchProspects } from "@/lib/services/ai-research"

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { prospects, depth = "STANDARD" } = body

//     if (!prospects || !Array.isArray(prospects) || prospects.length === 0) {
//       return NextResponse.json({ error: "Prospects array is required" }, { status: 400 })
//     }

//     const results = await batchResearchProspects(prospects, depth)

//     return NextResponse.json({
//       success: true,
//       data: Object.fromEntries(results),
//       count: results.size,
//     })
//   } catch (error) {
//     console.error("[v0] Batch research API error:", error)
//     return NextResponse.json({ error: "Failed to research prospects" }, { status: 500 })
//   }
// }

// import { type NextRequest, NextResponse } from "next/server"
// import { batchResearchProspects } from "@/lib/services/ai-research"
// import { protectApiRoute } from "@/lib/api-protection"
// import { db } from "@/lib/db"

// export async function POST(request: NextRequest) {
//   const { error, user } = await protectApiRoute()
//   if (error) return error

//   try {
//     const body = await request.json()
//     const { prospects, depth = "STANDARD" } = body

//     if (!prospects || !Array.isArray(prospects) || prospects.length === 0) {
//       return NextResponse.json({ error: "Prospects array is required" }, { status: 400 })
//     }

//     if (user!.researchCredits < prospects.length) {
//       return NextResponse.json(
//         { error: `Insufficient research credits. Need ${prospects.length}, have ${user!.researchCredits}` },
//         { status: 403 },
//       )
//     }

//     const results = await batchResearchProspects(prospects, depth)

//     await db.user.update({
//       where: { id: user!.id },
//       data: { researchCredits: { decrement: prospects.length } },
//     })

//     return NextResponse.json({
//       success: true,
//       data: Object.fromEntries(results),
//       count: results.size,
//     })
//   } catch (error) {
//     console.error("[v0] Batch research API error:", error)
//     return NextResponse.json({ error: "Failed to research prospects" }, { status: 500 })
//   }
// }

// import { type NextRequest, NextResponse } from "next/server"
// import { batchResearchProspects } from "@/lib/services/ai-research"
// import { protectApiRoute } from "@/lib/api-protection"
// import { db } from "@/lib/db"

// export async function POST(request: NextRequest) {
//   console.log("[v0] Batch research API called")

//   const { error, user } = await protectApiRoute()
//   if (error) {
//     console.error("[v0] Auth failed in research API")
//     return error
//   }

//   try {
//     const body = await request.json()
//     console.log("[v0] Research request body:", body)

//     const { campaignId, depth = "STANDARD" } = body

//     if (!campaignId) {
//       console.error("[v0] Missing campaignId")
//       return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 })
//     }

//     // Fetch prospects for this campaign
//     console.log("[v0] Fetching prospects for campaign:", campaignId)
//     const prospectsFromDb = await db.prospect.findMany({
//       where: {
//         campaignId,
//         userId: user!.id, // Security: ensure user owns this campaign
//       },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         email: true,
//         company: true,
//         jobTitle: true, // was 'position'
//         linkedinUrl: true,
//         websiteUrl: true, // was 'companyWebsite'
//       },
//     })

//     if (prospectsFromDb.length === 0) {
//       console.error("[v0] No prospects found for campaign:", campaignId)
//       return NextResponse.json(
//         { error: "No prospects found for this campaign. Please add prospects first." },
//         { status: 400 },
//       )
//     }

//     console.log("[v0] Found", prospectsFromDb.length, "prospects to research")
//     console.log("[v0] User research credits:", user!.researchCredits)

//     if (user!.researchCredits < prospectsFromDb.length) {
//       console.error("[v0] Insufficient credits:", {
//         needed: prospectsFromDb.length,
//         available: user!.researchCredits,
//       })
//       return NextResponse.json(
//         { error: `Insufficient research credits. Need ${prospectsFromDb.length}, have ${user!.researchCredits}` },
//         { status: 403 },
//       )
//     }

//     const prospects = prospectsFromDb.map((p) => ({
//       email: p.email,
//       firstName: p.firstName ?? undefined,
//       lastName: p.lastName ?? undefined,
//       company: p.company ?? undefined,
//       jobTitle: p.jobTitle ?? undefined,
//       linkedinUrl: p.linkedinUrl ?? undefined,
//       websiteUrl: p.websiteUrl ?? undefined,
//     }))

//     console.log("[v0] Starting batch research for", prospects.length, "prospects")
//     const results = await batchResearchProspects(prospects, depth)
//     console.log("[v0] Batch research completed successfully:", results.size, "results")

//     for (const [email, researchData] of results.entries()) {
//       const prospect = prospectsFromDb.find((p) => p.email === email)
//       if (prospect) {
//         await db.prospect.update({
//           where: { id: prospect.id },
//           data: {
//             researchData: researchData as any,
//             qualityScore: researchData.qualityScore,
//             personalizationTokens: researchData.personalizationTokens as any,
//           },
//         })
//       }
//     }

//     await db.user.update({
//       where: { id: user!.id },
//       data: {
//         researchCredits: { decrement: prospects.length },
//         hasResearchedProspects: true, // Mark onboarding step complete
//       },
//     })
//     console.log("[v0] Credits decremented and research data saved successfully")

//     return NextResponse.json({
//       success: true,
//       data: Object.fromEntries(results),
//       count: results.size,
//     })
//   } catch (error) {
//     console.error("[v0] Batch research API error:", error)
//     console.error("[v0] Error details:", {
//       message: error instanceof Error ? error.message : "Unknown error",
//       stack: error instanceof Error ? error.stack : undefined,
//       name: error instanceof Error ? error.name : undefined,
//     })
//     return NextResponse.json(
//       {
//         error: "Failed to research prospects",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }



// import { type NextRequest, NextResponse } from "next/server"
// import { batchResearchProspects } from "@/lib/services/ai-research"
// import { protectApiRoute } from "@/lib/api-protection"
// import { db } from "@/lib/db"

// export async function POST(request: NextRequest) {
//   console.log("[v0] Batch research API called")

//   const { error, user } = await protectApiRoute()
//   if (error) {
//     console.error("[v0] Auth failed in research API")
//     return error
//   }

//   try {
//     const body = await request.json()
//     console.log("[v0] Research request body:", body)

//     const { campaignId, depth: requestDepth } = body

//     if (!campaignId) {
//       console.error("[v0] Missing campaignId")
//       return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 })
//     }

//     const userPreferences = (user!.preferences as any) || {}
//     const userScrapingMode = userPreferences.scrapingMode || "FAST"

//     // Convert scraping mode to research depth
//     const depth = userScrapingMode === "DEEP" ? "DEEP" : requestDepth || "STANDARD"

//     console.log("[v0] User scraping mode preference:", userScrapingMode)
//     console.log("[v0] Using research depth:", depth)

//     // Fetch prospects for this campaign
//     console.log("[v0] Fetching prospects for campaign:", campaignId)
//     const prospectsFromDb = await db.prospect.findMany({
//       where: {
//         campaignId,
//         userId: user!.id, // Security: ensure user owns this campaign
//       },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         email: true,
//         company: true,
//         jobTitle: true, // was 'position'
//         linkedinUrl: true,
//         websiteUrl: true, // was 'companyWebsite'
//       },
//     })

//     if (prospectsFromDb.length === 0) {
//       console.error("[v0] No prospects found for campaign:", campaignId)
//       return NextResponse.json(
//         { error: "No prospects found for this campaign. Please add prospects first." },
//         { status: 400 },
//       )
//     }

//     console.log("[v0] Found", prospectsFromDb.length, "prospects to research")
//     console.log("[v0] User research credits:", user!.researchCredits)

//     if (user!.researchCredits < prospectsFromDb.length) {
//       console.error("[v0] Insufficient credits:", {
//         needed: prospectsFromDb.length,
//         available: user!.researchCredits,
//       })
//       return NextResponse.json(
//         { error: `Insufficient research credits. Need ${prospectsFromDb.length}, have ${user!.researchCredits}` },
//         { status: 403 },
//       )
//     }

//     const prospects = prospectsFromDb.map((p) => ({
//       email: p.email,
//       firstName: p.firstName ?? undefined,
//       lastName: p.lastName ?? undefined,
//       company: p.company ?? undefined,
//       jobTitle: p.jobTitle ?? undefined,
//       linkedinUrl: p.linkedinUrl ?? undefined,
//       websiteUrl: p.websiteUrl ?? undefined,
//     }))

//     console.log("[v0] Starting batch research for", prospects.length, "prospects")
//     const results = await batchResearchProspects(prospects, depth)
//     console.log("[v0] Batch research completed successfully:", results.size, "results")

//     for (const [email, researchData] of results.entries()) {
//       const prospect = prospectsFromDb.find((p) => p.email === email)
//       if (prospect) {
//         await db.prospect.update({
//           where: { id: prospect.id },
//           data: {
//             researchData: researchData as any,
//             qualityScore: researchData.qualityScore,
//             personalizationTokens: researchData.personalizationTokens as any,
//           },
//         })
//       }
//     }

//     await db.user.update({
//       where: { id: user!.id },
//       data: {
//         researchCredits: { decrement: prospects.length },
//         hasResearchedProspects: true, // Mark onboarding step complete
//       },
//     })
//     console.log("[v0] Credits decremented and research data saved successfully")

//     return NextResponse.json({
//       success: true,
//       data: Object.fromEntries(results),
//       count: results.size,
//     })
//   } catch (error) {
//     console.error("[v0] Batch research API error:", error)
//     console.error("[v0] Error details:", {
//       message: error instanceof Error ? error.message : "Unknown error",
//       stack: error instanceof Error ? error.stack : undefined,
//       name: error instanceof Error ? error.name : undefined,
//     })
//     return NextResponse.json(
//       {
//         error: "Failed to research prospects",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }

// import { type NextRequest, NextResponse } from "next/server"
// import { batchResearchProspects } from "@/lib/services/ai-research"
// import { protectApiRoute } from "@/lib/api-protection"
// import { db } from "@/lib/db"
// import { deductCreditsWithTracking, refundCredits } from "@/lib/actions/credits"

// export async function POST(request: NextRequest) {
//   console.log("[v0] Batch research API called")

//   const { error, user } = await protectApiRoute()
//   if (error) {
//     console.error("[v0] Auth failed in research API")
//     return error
//   }

//   try {
//     const body = await request.json()
//     console.log("[v0] Research request body:", body)

//     const { campaignId, depth: requestDepth } = body

//     if (!campaignId) {
//       console.error("[v0] Missing campaignId")
//       return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 })
//     }

//     const userPreferences = (user!.preferences as any) || {}
//     const userScrapingMode = userPreferences.scrapingMode || "FAST"

//     const depth = userScrapingMode === "DEEP" ? "DEEP" : requestDepth || "STANDARD"

//     console.log("[v0] User scraping mode preference:", userScrapingMode)
//     console.log("[v0] Using research depth:", depth)

//     console.log("[v0] Fetching prospects for campaign:", campaignId)
//     const prospectsFromDb = await db.prospect.findMany({
//       where: {
//         campaignId,
//         userId: user!.id,
//       },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         email: true,
//         company: true,
//         jobTitle: true,
//         linkedinUrl: true,
//         websiteUrl: true,
//       },
//     })

//     if (prospectsFromDb.length === 0) {
//       console.error("[v0] No prospects found for campaign:", campaignId)
//       return NextResponse.json(
//         { error: "No prospects found for this campaign. Please add prospects first." },
//         { status: 400 },
//       )
//     }

//     console.log("[v0] Found", prospectsFromDb.length, "prospects to research")
//     console.log("[v0] User research credits:", user!.researchCredits)

//     if (user!.researchCredits < prospectsFromDb.length) {
//       console.error("[v0] Insufficient credits:", {
//         needed: prospectsFromDb.length,
//         available: user!.researchCredits,
//       })
//       return NextResponse.json(
//         { error: `Insufficient research credits. Need ${prospectsFromDb.length}, have ${user!.researchCredits}` },
//         { status: 403 },
//       )
//     }

//     const prospects = prospectsFromDb.map((p) => ({
//       email: p.email,
//       firstName: p.firstName ?? undefined,
//       lastName: p.lastName ?? undefined,
//       company: p.company ?? undefined,
//       jobTitle: p.jobTitle ?? undefined,
//       linkedinUrl: p.linkedinUrl ?? undefined,
//       websiteUrl: p.websiteUrl ?? undefined,
//     }))

//     console.log("[v0] Deducting", prospects.length, "research credits with transaction logging")
//     await deductCreditsWithTracking(
//       user!.id,
//       "RESEARCH",
//       prospects.length,
//       `Research for ${prospects.length} prospect(s) in campaign`,
//       "CAMPAIGN",
//       campaignId,
//     )

//     let researchSuccessful = false
//     let results: Map<string, any>

//     try {
//       console.log("[v0] Starting batch research for", prospects.length, "prospects")
//       results = await batchResearchProspects(prospects, depth)
//       console.log("[v0] Batch research completed successfully:", results.size, "results")
//       researchSuccessful = true

//       for (const [email, researchData] of results.entries()) {
//         const prospect = prospectsFromDb.find((p) => p.email === email)
//         if (prospect) {
//           await db.prospect.update({
//             where: { id: prospect.id },
//             data: {
//               researchData: researchData as any,
//               qualityScore: researchData.qualityScore,
//               personalizationTokens: researchData.personalizationTokens as any,
//             },
//           })
//         }
//       }

//       await db.user.update({
//         where: { id: user!.id },
//         data: {
//           hasResearchedProspects: true,
//         },
//       })
//       console.log("[v0] Research data saved successfully")

//       return NextResponse.json({
//         success: true,
//         data: Object.fromEntries(results),
//         count: results.size,
//       })
//     } catch (researchError) {
//       console.error("[v0] Research failed, refunding credits:", researchError)

//       await refundCredits(
//         user!.id,
//         "RESEARCH",
//         prospects.length,
//         `Refund: Research failed for ${prospects.length} prospect(s)`,
//         "CAMPAIGN",
//         campaignId,
//       )

//       console.log("[v0] Credits refunded due to research failure")

//       throw researchError
//     }
//   } catch (error) {
//     console.error("[v0] Batch research API error:", error)
//     console.error("[v0] Error details:", {
//       message: error instanceof Error ? error.message : "Unknown error",
//       stack: error instanceof Error ? error.stack : undefined,
//       name: error instanceof Error ? error.name : undefined,
//     })
//     return NextResponse.json(
//       {
//         error: "Failed to research prospects. Your credits have been refunded.",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { batchResearchProspects } from "@/lib/services/ai-research"
import { protectApiRoute } from "@/lib/api-protection"
import { db } from "@/lib/db"
import { deductCreditsWithTracking } from "@/lib/actions/credits"

export async function POST(request: NextRequest) {
  console.log("[v0] Batch research API called")

  const { error, user } = await protectApiRoute()
  if (error) {
    console.error("[v0] Auth failed in research API")
    return error
  }

  try {
    const body = await request.json()
    console.log("[v0] Research request body:", body)

    const { campaignId, depth: requestDepth } = body

    if (!campaignId) {
      console.error("[v0] Missing campaignId")
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 })
    }

    const userPreferences = (user!.preferences as any) || {}
    const userScrapingMode = userPreferences.scrapingMode || "FAST"

    const depth = userScrapingMode === "DEEP" ? "DEEP" : requestDepth || "STANDARD"

    console.log("[v0] User scraping mode preference:", userScrapingMode)
    console.log("[v0] Using research depth:", depth)

    console.log("[v0] Fetching prospects for campaign:", campaignId)
    const prospectsFromDb = await db.prospect.findMany({
      where: {
        campaignId,
        userId: user!.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        company: true,
        jobTitle: true,
        linkedinUrl: true,
        websiteUrl: true,
      },
    })

    if (prospectsFromDb.length === 0) {
      console.error("[v0] No prospects found for campaign:", campaignId)
      return NextResponse.json(
        { error: "No prospects found for this campaign. Please add prospects first." },
        { status: 400 },
      )
    }

    console.log("[v0] Found", prospectsFromDb.length, "prospects to research")
    console.log("[v0] User research credits:", user!.researchCredits)

    if (user!.researchCredits < prospectsFromDb.length) {
      console.error("[v0] Insufficient credits:", {
        needed: prospectsFromDb.length,
        available: user!.researchCredits,
      })
      return NextResponse.json(
        { error: `Insufficient research credits. Need ${prospectsFromDb.length}, have ${user!.researchCredits}` },
        { status: 403 },
      )
    }

    const prospects = prospectsFromDb.map((p) => ({
      email: p.email,
      firstName: p.firstName ?? undefined,
      lastName: p.lastName ?? undefined,
      company: p.company ?? undefined,
      jobTitle: p.jobTitle ?? undefined,
      linkedinUrl: p.linkedinUrl ?? undefined,
      websiteUrl: p.websiteUrl ?? undefined,
    }))

    console.log("[v0] Starting batch research for", prospects.length, "prospects (credits will be deducted on success)")

    let results: Map<string, any>

    try {
      console.log("[v0] Performing research...")
      results = await batchResearchProspects(prospects, depth)
      console.log("[v0] Batch research completed successfully:", results.size, "results")

      console.log("[v0] Research successful! Deducting", prospects.length, "research credits")
      await deductCreditsWithTracking(
        user!.id,
        "RESEARCH",
        prospects.length,
        `Research for ${prospects.length} prospect(s) in campaign`,
        "CAMPAIGN",
        campaignId,
      )
      console.log("[v0] Credits deducted successfully")

      // Save research data to database
      for (const [email, researchData] of results.entries()) {
        const prospect = prospectsFromDb.find((p) => p.email === email)
        if (prospect) {
          await db.prospect.update({
            where: { id: prospect.id },
            data: {
              researchData: researchData as any,
              qualityScore: researchData.qualityScore,
              personalizationTokens: researchData.personalizationTokens as any,
            },
          })
        }
      }

      await db.user.update({
        where: { id: user!.id },
        data: {
          hasResearchedProspects: true,
        },
      })
      console.log("[v0] Research data saved successfully")

      return NextResponse.json({
        success: true,
        data: Object.fromEntries(results),
        count: results.size,
      })
    } catch (researchError) {
      console.error("[v0] Research failed - no credits were deducted:", researchError)
      console.error("[v0] Error details:", {
        message: researchError instanceof Error ? researchError.message : "Unknown error",
        stack: researchError instanceof Error ? researchError.stack : undefined,
      })

      throw researchError
    }
  } catch (error) {
    console.error("[v0] Batch research API error:", error)
    console.error("[v0] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    })
    return NextResponse.json(
      {
        error: "Failed to research prospects. No credits were charged.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
