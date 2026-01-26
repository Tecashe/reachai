
import { type NextRequest, NextResponse } from "next/server"
import { generateFullSequence } from "@/lib/services/email-generator"
import { protectApiRoute, checkCredits } from "@/lib/api-protection"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
    const { error, user } = await protectApiRoute()
    if (error) return error

    // Gate for Paid Users
    if (user!.subscriptionTier === "FREE") {
        return NextResponse.json(
            { error: "AI Sequence Generation is available for paid plans only." },
            { status: 403 }
        )
    }

    const creditCheck = await checkCredits(user!, "email") // Deduct email credits or use a specific "ai_gen" credit?
    if (!creditCheck.hasCredits) return creditCheck.error

    try {
        const body = await request.json()
        const { prospect, researchData, tone, stepsCount } = body

        const result = await generateFullSequence({
            prospect,
            researchData,
            tone,
            stepsCount
        })

        // Deduct credits (maybe more expensive for a whole sequence?)
        await db.user.update({
            where: { id: user!.id },
            data: { emailCredits: { decrement: stepsCount || 3 } },
        })

        return NextResponse.json({
            success: true,
            data: result,
        })
    } catch (error) {
        console.error("[builtbycashe] Sequence generation API error:", error)
        return NextResponse.json({ error: "Failed to generate sequence" }, { status: 500 })
    }
}
