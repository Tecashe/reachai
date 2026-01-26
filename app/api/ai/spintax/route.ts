
import { type NextRequest, NextResponse } from "next/server"
import { generateSpintax } from "@/lib/services/email-generator"
import { protectApiRoute } from "@/lib/api-protection"

export async function POST(request: NextRequest) {
    const { error, user } = await protectApiRoute()
    if (error) return error

    // Gate for Paid Users
    if (user!.subscriptionTier === "FREE") {
        return NextResponse.json(
            { error: "AI Spintax is available for paid plans only." },
            { status: 403 }
        )
    }

    try {
        const body = await request.json()
        const { text } = body

        if (!text) return NextResponse.json({ error: "Text is required" }, { status: 400 })

        const spintaxText = await generateSpintax(text)

        return NextResponse.json({
            success: true,
            data: { spintaxText },
        })
    } catch (error) {
        console.error("[builtbycashe] Spintax API error:", error)
        return NextResponse.json({ error: "Failed to generate spintax" }, { status: 500 })
    }
}
