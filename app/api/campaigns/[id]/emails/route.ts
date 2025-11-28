import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Verify campaign belongs to user
    const campaign = await db.campaign.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    // Fetch all email logs for prospects in this campaign
    const emails = await db.emailLog.findMany({
      where: {
        prospect: {
          campaignId: id,
        },
      },
      include: {
        prospect: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            company: true,
            jobTitle: true,
          },
        },
        sendingAccount: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: [{ sentAt: "desc" }, { createdAt: "desc" }],
    })

    return NextResponse.json({
      success: true,
      emails,
    })
  } catch (error) {
    console.error("[v0] Error fetching campaign emails:", error)
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 })
  }
}
