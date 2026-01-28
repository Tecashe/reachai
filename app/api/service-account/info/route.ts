// app/api/service-account/info/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { serviceAccountAuth } from "@/lib/services/google/service-account-auth"

/**
 * GET /api/service-account/info
 * 
 * Returns service account information that customers need
 * to authorize domain-wide delegation
 * 
 * This is safe to expose as it only returns public information
 * (client ID and service account email)
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

        // Get service account information
        const clientId = serviceAccountAuth.getClientId()
        const serviceAccountEmail = serviceAccountAuth.getServiceAccountEmail()

        return NextResponse.json({
            clientId,
            serviceAccountEmail,
            instructions: {
                adminConsoleUrl: "https://admin.google.com/ac/owl/domainwidedelegation",
                scope: "https://mail.google.com/",
                steps: [
                    "Go to Google Workspace Admin Console",
                    "Navigate to: Security → Access and data control → API Controls → Domain wide delegation",
                    "Click 'Add new'",
                    `Enter Client ID: ${clientId}`,
                    "Add OAuth scope: https://mail.google.com/",
                    "Click 'Authorize'"
                ]
            }
        })
    } catch (error) {
        console.error("[ServiceAccount Info API] Error:", error)

        return NextResponse.json(
            {
                error: "Failed to get service account information",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        )
    }
}