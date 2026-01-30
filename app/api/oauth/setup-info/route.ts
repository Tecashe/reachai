// app/api/oauth/setup-info/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { oauth2Service } from "@/lib/services/google/oauth2-service"

/**
 * GET /api/oauth/setup-info
 * 
 * Returns OAuth client ID and setup instructions for customers
 * This is what they need to allowlist your app in App Access Control
 */
export async function GET(request: NextRequest) {
    try {
        // Ensure user is authenticated
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // Get setup instructions
        const setupInfo = oauth2Service.getSetupInstructions()

        return NextResponse.json({
            success: true,
            ...setupInfo,
        })
    } catch (error) {
        console.error("[OAuth Setup Info API] Error:", error)

        return NextResponse.json(
            {
                success: false,
                error: "Failed to get setup information",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        )
    }
}