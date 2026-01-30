// app/api/oauth/google/authorize/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { oauth2Service } from "@/lib/services/google/oauth2-service"
import { nanoid } from "nanoid"

/**
 * GET /api/oauth/google/authorize
 * 
 * Initiates the OAuth flow by redirecting user to Google's consent screen
 * This is step 1 of the OAuth flow
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

        // Generate a random state for CSRF protection
        const state = nanoid(32)

        // Store state in a cookie or session for verification in callback
        // For simplicity, we'll encode userId in the state
        const stateData = {
            userId,
            nonce: state,
        }
        const stateParam = Buffer.from(JSON.stringify(stateData)).toString('base64')

        // Get authorization URL
        const authUrl = oauth2Service.getAuthorizationUrl(stateParam)

        console.log(`[OAuth Authorize] Redirecting user ${userId} to Google OAuth`)

        // Redirect to Google's OAuth consent screen
        return NextResponse.redirect(authUrl)
    } catch (error) {
        console.error("[OAuth Authorize API] Error:", error)

        return NextResponse.json(
            {
                error: "Failed to initiate OAuth flow",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        )
    }
}