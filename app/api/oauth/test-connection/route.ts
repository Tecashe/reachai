// app/api/oauth/test-connection/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { oauth2SMTPService } from "@/lib/services/email/oauth2-smtp-service"
import { db } from "@/lib/db"

/**
 * POST /api/oauth/test-connection
 * 
 * Tests OAuth SMTP connection and optionally sends a test email
 * 
 * Request body:
 * {
 *   "email": "user@company.com",
 *   "sendTestEmail": true (optional)
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
        const { email, sendTestEmail = false } = body

        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: "Email address is required" },
                { status: 400 }
            )
        }

        console.log(`[Test Connection] Testing OAuth connection for: ${email}`)

        // Verify account exists and belongs to user
        const account = await db.sendingAccount.findUnique({
            where: {
                userId_email: {
                    userId,
                    email,
                },
            },
            select: {
                isActive: true,
                delegationStatus: true,
                connectionMethod: true,
            },
        })

        if (!account) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Account not found or not connected"
                },
                { status: 404 }
            )
        }

        if (account.connectionMethod !== 'oauth2') {
            return NextResponse.json(
                {
                    success: false,
                    error: "This account is not connected via OAuth2"
                },
                { status: 400 }
            )
        }

        // Test SMTP connection
        try {
            await oauth2SMTPService.testConnection(email)
        } catch (error) {
            console.error("[Test Connection] SMTP connection test failed:", error)

            return NextResponse.json(
                {
                    success: false,
                    error: "SMTP connection failed",
                    details: error instanceof Error ? error.message : "Unknown error"
                },
                { status: 500 }
            )
        }

        // Optionally send a test email
        if (sendTestEmail) {
            try {
                const result = await oauth2SMTPService.sendTestEmail(email)

                if (!result.success) {
                    return NextResponse.json(
                        {
                            success: false,
                            error: "Test email failed to send",
                            details: result.error
                        },
                        { status: 500 }
                    )
                }

                console.log(`[Test Connection] ✅ Test email sent to: ${email}`)
            } catch (error) {
                console.error("[Test Connection] Test email send failed:", error)

                return NextResponse.json(
                    {
                        success: false,
                        error: "Failed to send test email",
                        details: error instanceof Error ? error.message : "Unknown error"
                    },
                    { status: 500 }
                )
            }
        }

        // Update account verification timestamp
        await db.sendingAccount.update({
            where: {
                userId_email: {
                    userId,
                    email,
                },
            },
            data: {
                lastVerifiedAt: new Date(),
                delegationStatus: 'verified',
            },
        })

        console.log(`[Test Connection] ✅ Successfully verified connection for: ${email}`)

        return NextResponse.json({
            success: true,
            message: "OAuth connection verified successfully",
            email,
            testEmailSent: sendTestEmail,
        })
    } catch (error) {
        console.error("[Test Connection API] Unexpected error:", error)

        return NextResponse.json(
            {
                success: false,
                error: "Connection test failed",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        )
    }
}