// app/api/oauth/disconnect/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { oauth2Service } from "@/lib/services/google/oauth2-service"
import { oauth2SMTPService } from "@/lib/services/email/oauth2-smtp-service"
import { db } from "@/lib/db"

/**
 * POST /api/oauth/disconnect
 * 
 * Disconnects an OAuth account and revokes tokens
 * 
 * Request body:
 * {
 *   "email": "user@company.com"
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const { userId: clerkId } = await auth()

        if (!clerkId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // Resolve internal user ID
        const user = await db.user.findUnique({
            where: { clerkId },
            select: { id: true }
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        const userId = user.id

        const body = await request.json()
        const { email } = body

        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: "Email address is required" },
                { status: 400 }
            )
        }

        console.log(`[Disconnect] Disconnecting account: ${email}`)

        // Get account from database
        const account = await db.sendingAccount.findUnique({
            where: {
                userId_email: {
                    userId,
                    email,
                },
            },
            select: {
                credentials: true,
                connectionMethod: true,
            },
        })

        if (!account) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Account not found"
                },
                { status: 404 }
            )
        }

        // Revoke tokens with Google
        if (account.credentials && typeof account.credentials === 'object') {
            const credentials = account.credentials as any
            if (credentials.accessToken) {
                try {
                    await oauth2Service.revokeToken(credentials.accessToken)
                    console.log(`[Disconnect] Revoked tokens for: ${email}`)
                } catch (error) {
                    console.error(`[Disconnect] Failed to revoke tokens:`, error)
                    // Continue anyway - we'll delete from our database
                }
            }
        }

        // Clear cache
        oauth2SMTPService.clearCacheForUser(email)

        // Delete from database
        await db.sendingAccount.delete({
            where: {
                userId_email: {
                    userId,
                    email,
                },
            },
        })

        console.log(`[Disconnect] ✅ Successfully disconnected: ${email}`)

        return NextResponse.json({
            success: true,
            message: "Account disconnected successfully",
            email,
        })
    } catch (error) {
        console.error("[Disconnect API] Error:", error)

        return NextResponse.json(
            {
                success: false,
                error: "Failed to disconnect account",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        )
    }
}