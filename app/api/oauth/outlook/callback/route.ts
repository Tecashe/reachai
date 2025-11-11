import { type NextRequest, NextResponse } from "next/server"
import { outlookOAuth } from "@/lib/services/oauth/outlook-oauth"
import { db } from "@/lib/db"
import { encrypt } from "@/lib/encryption"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state") // This is the userId
    const error = searchParams.get("error")

    if (error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=outlook_oauth_denied`)
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=outlook_oauth_invalid`)
    }

    const userId = state

    // Exchange code for tokens
    const tokens = await outlookOAuth.getTokensFromCode(code)

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error("Failed to get tokens from Outlook")
    }

    // Get user's Outlook profile
    const profile = await outlookOAuth.getUserProfile(tokens.access_token)

    // Find user in database
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=user_not_found`)
    }

    // Encrypt credentials
    const encryptedCredentials = encrypt({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
    })

    // Create or update sending account
    await db.sendingAccount.upsert({
      where: {
        userId_email: {
          userId: user.id,
          email: profile.email,
        },
      },
      create: {
        userId: user.id,
        name: `Outlook - ${profile.email}`,
        email: profile.email,
        provider: "outlook",
        credentials: encryptedCredentials,
        dailyLimit: 300, // Outlook's daily limit
        hourlyLimit: 30,
        isActive: true,
      },
      update: {
        credentials: encryptedCredentials,
        isActive: true,
      },
    })

    // Redirect back to settings with success message
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=outlook_connected`)
  } catch (error) {
    console.error("[builtbycashe] Outlook OAuth callback error:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=outlook_oauth_failed`)
  }
}
