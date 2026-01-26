import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params

        const campaign = await db.campaign.findFirst({
            where: {
                id,
                userId: user.id,
            },
            include: {
                _count: {
                    select: { prospects: true },
                },
            },
        })

        if (!campaign) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
        }

        return NextResponse.json({ campaign })
    } catch (error) {
        console.error("[API] GET /api/campaigns/[id] error:", error)
        return NextResponse.json(
            { error: "Failed to fetch campaign" },
            { status: 500 }
        )
    }
}
