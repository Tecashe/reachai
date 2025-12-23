import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const campaign = await db.campaign.findFirst({
      where: {
        id: params.id,
        userId,
      },
      include: {
        prospects: {
          where: {
            generatedEmail: {
              not: undefined,
            },
          },
          select: {
            id: true,
          },
        },
      },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json({
      count: campaign.prospects?.length || 0,
      hasGeneratedEmails: (campaign.prospects?.length || 0) > 0,
    })
  } catch (error) {
    console.error("[v0] Error checking generated emails:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
