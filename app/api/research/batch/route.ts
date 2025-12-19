
import { type NextRequest, NextResponse } from "next/server"
import { batchResearchProspects } from "@/lib/services/ai-research"
import { protectApiRoute } from "@/lib/api-protection"
import { db } from "@/lib/db"
import { deductCreditsWithTracking } from "@/lib/actions/credits"
import { getResearchLimits, type SubscriptionTier } from "@/lib/subscription-limits"

export const maxDuration = 300 // 5 minutes max

export async function POST(request: NextRequest) {
  console.log("[builtbycashe] Batch research API called")

  const { error, user } = await protectApiRoute()
  if (error) {
    console.error("[builtbycashe] Auth failed in research API")
    return error
  }

  try {
    const body = await request.json()
    console.log("[builtbycashe] Research request body:", body)

    const { campaignId, depth: requestDepth } = body

    if (!campaignId) {
      console.error("[builtbycashe] Missing campaignId")
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 })
    }

    const tier = user!.subscriptionTier as SubscriptionTier
    const limits = getResearchLimits(tier)
    console.log("[builtbycashe] User tier:", tier, "Limits:", limits)

    const userPreferences = (user!.preferences as any) || {}
    const userScrapingMode = userPreferences.scrapingMode || "FAST"

    const depth = userScrapingMode === "DEEP" ? "DEEP" : requestDepth || "STANDARD"

    console.log("[builtbycashe] User scraping mode preference:", userScrapingMode)
    console.log("[builtbycashe] Using research depth:", depth)

    console.log("[builtbycashe] Fetching prospects for campaign:", campaignId)
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
      console.error("[builtbycashe] No prospects found for campaign:", campaignId)
      return NextResponse.json(
        { error: "No prospects found for this campaign. Please add prospects first." },
        { status: 400 },
      )
    }

    console.log("[builtbycashe] Found", prospectsFromDb.length, "prospects to research")

    if (prospectsFromDb.length > limits.maxProspectsPerBatch) {
      console.error("[builtbycashe] Prospect limit exceeded:", {
        requested: prospectsFromDb.length,
        limit: limits.maxProspectsPerBatch,
        tier,
      })
      return NextResponse.json(
        {
          error: `Your ${tier} plan allows researching up to ${limits.maxProspectsPerBatch} prospects at once. You have ${prospectsFromDb.length} prospects. Please upgrade or research in smaller batches.`,
        },
        { status: 403 },
      )
    }

    console.log("[builtbycashe] User research credits:", user!.researchCredits)

    if (user!.researchCredits < prospectsFromDb.length) {
      console.error("[builtbycashe] Insufficient credits:", {
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

    console.log("[builtbycashe] Starting batch research for", prospects.length, "prospects (credits will be deducted on success)")
    console.log("[builtbycashe] Using concurrency:", limits.maxConcurrentResearch)

    let results: Map<string, any>

    try {
      console.log("[builtbycashe] Performing research...")
      results = await batchResearchProspects(prospects, depth, undefined, limits.maxConcurrentResearch)
      console.log("[builtbycashe] Batch research completed successfully:", results.size, "results")

      const successfulCount = results.size
      if (successfulCount > 0) {
        console.log("[builtbycashe] Research successful! Deducting", successfulCount, "research credits")
        await deductCreditsWithTracking(
          user!.id,
          "RESEARCH",
          successfulCount,
          `Research for ${successfulCount} prospect(s) in campaign`,
          "CAMPAIGN",
          campaignId,
        )
        console.log("[builtbycashe] Credits deducted successfully")
      }

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
      console.log("[builtbycashe] Research data saved successfully")

      return NextResponse.json({
        success: true,
        data: Object.fromEntries(results),
        count: results.size,
        failed: prospects.length - results.size,
      })
    } catch (researchError) {
      console.error("[builtbycashe] Research failed - no credits were deducted:", researchError)
      console.error("[builtbycashe] Error details:", {
        message: researchError instanceof Error ? researchError.message : "Unknown error",
        stack: researchError instanceof Error ? researchError.stack : undefined,
      })

      throw researchError
    }
  } catch (error) {
    console.error("[builtbycashe] Batch research API error:", error)
    console.error("[builtbycashe] Error details:", {
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
