
import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const user = await getCurrentUserFromDb()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const hasSequences = searchParams.get("hasSequences") === "true"

    const campaigns = await db.campaign.findMany({
      where: {
        userId: user.id,
        status: hasSequences ? undefined : { in: ["ACTIVE", "PAUSED"] },
      },
      include: {
        emailSequences: {
          orderBy: {
            stepNumber: "asc",
          },
        },
        _count: {
          select: {
            prospects: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    let filteredCampaigns = campaigns
    if (hasSequences) {
      // Only return campaigns that have sequences
      filteredCampaigns = campaigns.filter((c) => c.emailSequences && c.emailSequences.length > 0)
    } else {
      // Default behavior: filter to only campaigns with sequences
      filteredCampaigns = campaigns.filter((c) => c.emailSequences && c.emailSequences.length > 0)
    }

    const mappedCampaigns = filteredCampaigns.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      totalProspects: c._count.prospects,
      emailSequences: c.emailSequences.map((seq) => ({
        id: seq.id,
        stepNumber: seq.stepNumber,
      })),
    }))

    return NextResponse.json({
      campaigns: mappedCampaigns,
    })
  } catch (error) {
    console.error("[v0] Error fetching campaigns:", error)
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}
