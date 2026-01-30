// app/api/oauth/google/callback/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { oauth2Service } from "@/lib/services/google/oauth2-service"
import { db } from "@/lib/db"

/**
 * GET /api/oauth/google/callback
 * 
 * Handles the OAuth callback from Google after user consents
 * This is step 2 of the OAuth flow
 * 
 * Query params:
 * - code: Authorization code from Google
 * - state: State parameter for CSRF protection
 * - error: Error if user denied access
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')

        // Handle user denying access
        if (error) {
            console.error('[OAuth Callback] User denied access:', error)
            return NextResponse.redirect(
                new URL(`/dashboard/email-accounts?error=access_denied`, request.url)
            )
        }

        // Validate required parameters
        if (!code || !state) {
            console.error('[OAuth Callback] Missing code or state parameter')
            return NextResponse.redirect(
                new URL(`/dashboard/email-accounts?error=invalid_callback`, request.url)
            )
        }

        // Decode and verify state
        let stateData: { userId: string; nonce: string }
        try {
            stateData = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'))
        } catch (e) {
            console.error('[OAuth Callback] Invalid state parameter')
            return NextResponse.redirect(
                new URL(`/dashboard/email-accounts?error=invalid_state`, request.url)
            )
        }

        // Verify the user is still authenticated
        const { userId: currentUserId } = await auth()
        if (!currentUserId || currentUserId !== stateData.userId) {
            console.error('[OAuth Callback] User ID mismatch')
            return NextResponse.redirect(
                new URL(`/dashboard/email-accounts?error=unauthorized`, request.url)
            )
        }

        // Resolve internal user ID
        const user = await db.user.findUnique({
            where: { clerkId: currentUserId },
            select: { id: true }
        })

        if (!user) {
            console.error('[OAuth Callback] User not found in database')
            return NextResponse.redirect(
                new URL(`/dashboard/email-accounts?error=user_not_found`, request.url)
            )
        }

        const userId = user.id

        console.log(`[OAuth Callback] Processing callback for user: ${userId}`)

        // Exchange authorization code for tokens
        const tokens = await oauth2Service.getTokensFromCode(code)

        // Get user info from Google
        const userInfo = await oauth2Service.getUserInfo(tokens.accessToken)

        console.log(`[OAuth Callback] User info retrieved: ${userInfo.email}`)

        // Extract domain from email
        const domain = userInfo.email.split('@')[1]

        // Save or update the sending account in database
        await db.sendingAccount.upsert({
            where: {
                userId_email: {
                    userId,
                    email: userInfo.email,
                },
            },
            create: {
                userId,
                email: userInfo.email,
                name: userInfo.name || userInfo.email,
                provider: 'google',
                connectionType: 'oauth2',
                connectionMethod: 'oauth2',
                workspaceDomain: domain,
                delegationStatus: 'verified',
                isActive: true,
                lastVerifiedAt: new Date(),
                credentials: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    expiresAt: tokens.expiresAt.toISOString(),
                    scope: tokens.scope,
                    email: userInfo.email,
                    name: userInfo.name,
                    picture: userInfo.picture,
                },
            },
            update: {
                name: userInfo.name || userInfo.email,
                delegationStatus: 'verified',
                isActive: true,
                lastVerifiedAt: new Date(),
                credentials: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    expiresAt: tokens.expiresAt.toISOString(),
                    scope: tokens.scope,
                    email: userInfo.email,
                    name: userInfo.name,
                    picture: userInfo.picture,
                },
                // lastError: null, // Field does not exist in schema
            },
        })

        console.log(`[OAuth Callback] ✅ Successfully connected account: ${userInfo.email}`)

        // Redirect to success page
        return NextResponse.redirect(
            new URL(`/dashboard/email-accounts?success=connected&email=${encodeURIComponent(userInfo.email)}`, request.url)
        )
    } catch (error) {
        console.error("[OAuth Callback API] Error:", error)

        return NextResponse.redirect(
            new URL(`/dashboard/email-accounts?error=connection_failed`, request.url)
        )
    }
}