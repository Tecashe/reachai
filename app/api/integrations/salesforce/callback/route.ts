import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    if (error) {
        return NextResponse.redirect(new URL("/dashboard/crm?error=oauth_denied", request.url))
    }

    if (!code || !state) {
        return NextResponse.redirect(new URL("/dashboard/crm?error=missing_params", request.url))
    }

    try {
        const { clerkId, crmType } = JSON.parse(Buffer.from(state, "base64url").toString())

        if (crmType !== "salesforce") {
            return NextResponse.redirect(new URL("/dashboard/crm?error=invalid_crm_type_for_route", request.url))
        }

        const user = await db.user.findUnique({
            where: { clerkId },
            select: { id: true },
        })

        if (!user) {
            return NextResponse.redirect(new URL("/dashboard/crm?error=user_not_found", request.url))
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        // THIS IS THE KEY CHANGE: Specific callback URL for Salesforce
        const redirectUri = `${baseUrl}/api/integrations/salesforce/callback`

        let tokenData: {
            access_token: string
            refresh_token: string
            expires_in?: number
            instance_url?: string
        }

        const salesforceResponse = await fetch("https://login.salesforce.com/services/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                client_id: process.env.SALESFORCE_CLIENT_ID!,
                client_secret: process.env.SALESFORCE_CLIENT_SECRET!,
                redirect_uri: redirectUri,
                code,
            }),
        })

        if (!salesforceResponse.ok) {
            const errorText = await salesforceResponse.text()
            console.error("Salesforce token exchange failed:", errorText)
            throw new Error("Salesforce token exchange failed")
        }

        tokenData = await salesforceResponse.json()

        // Salesforce might not return expires_in, default to 2 hours if missing? 
        // Actually standard OAuth usually does. If not, we handle it.
        const expiresIn = tokenData.expires_in || 7200

        await db.integration.updateMany({
            where: {
                userId: user.id,
                type: "SALESFORCE",
            },
            data: { isActive: false },
        })

        const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()

        await db.integration.create({
            data: {
                userId: user.id,
                type: "SALESFORCE",
                name: "Salesforce",
                credentials: {
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token,
                    expiresAt,
                    instanceUrl: tokenData.instance_url,
                },
                isActive: true,
            },
        })

        return NextResponse.redirect(new URL("/dashboard/crm?success=connected", request.url))
    } catch (error) {
        console.error("[Salesforce Callback] Error:", error)
        return NextResponse.redirect(new URL("/dashboard/crm?error=connection_failed", request.url))
    }
}
