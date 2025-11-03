import { type NextRequest, NextResponse } from "next/server"
import { protectApiRoute } from "@/lib/api-protection"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = await protectApiRoute()
  if (error) return error

  try {
    const { id: campaignId } = await params

    const campaign = await db.campaign.findUnique({
      where: { id: campaignId, userId: user!.id },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const prospects = await db.prospect.findMany({
      where: { campaignId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        company: true,
        jobTitle: true,
        researchData: true,
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json({ prospects })
  } catch (error) {
    console.error("[v0] Failed to fetch prospects:", error)
    return NextResponse.json({ error: "Failed to fetch prospects" }, { status: 500 })
  }
}
