
// import { type NextRequest, NextResponse } from "next/server"
// import { gmailOAuth } from "@/lib/services/oauth/gmail-oauth"
// import { db } from "@/lib/db"
// import { encrypt } from "@/lib/encryption"

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams
//     const code = searchParams.get("code")
//     const state = searchParams.get("state") // This is the userId
//     const error = searchParams.get("error")

//     if (error) {
//       return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=gmail_oauth_denied`)
//     }

//     if (!code || !state) {
//       return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=gmail_oauth_invalid`)
//     }

//     const userId = state

//     // Exchange code for tokens
//     const tokens = await gmailOAuth.getTokensFromCode(code)

//     if (!tokens.access_token || !tokens.refresh_token) {
//       throw new Error("Failed to get tokens from Gmail")
//     }

//     // Get user's Gmail profile
//     const profile = await gmailOAuth.getUserProfile(tokens.access_token)

//     // Find user in database
//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=user_not_found`)
//     }

//     // Encrypt credentials
//     const encryptedCredentials = encrypt({
//       accessToken: tokens.access_token,
//       refreshToken: tokens.refresh_token,
//       expiresAt: tokens.expiry_date,
//     })

//     // Create or update sending account
//     await db.sendingAccount.upsert({
//       where: {
//         userId_email: {
//           userId: user.id,
//           email: profile.email,
//         },
//       },
//       create: {
//         userId: user.id,
//         name: `Gmail - ${profile.email}`,
//         email: profile.email,
//         provider: "gmail",
//         credentials: encryptedCredentials,
//         dailyLimit: 500, // Gmail's daily limit
//         hourlyLimit: 50,
//         isActive: true,
//       },
//       update: {
//         credentials: encryptedCredentials,
//         isActive: true,
//       },
//     })

//     const referer = request.headers.get("referer")
//     if (referer && referer.includes("/onboarding")) {
//       await db.user.update({
//         where: { id: user.id },
//         data: {
//           onboardingCompletedQuestionnaire: true,
//         },
//       })
//       return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=gmail_connected`)
//     }

//     // Redirect back to settings with success message
//     return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=gmail_connected`)
//   } catch (error) {
//     console.error("[v0] Gmail OAuth callback error:", error)
//     return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=gmail_oauth_failed`)
//   }
// }

// app/api/auth/gmail/callback/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { gmailXOAuth2 } from "@/lib/services/oauth/gmail-xoauth2"
import { db } from "@/lib/db"
import { encryptPassword } from "@/lib/encryption"
import { getAutoConfigForEmail } from "@/lib/email-connection/provider-configs"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state") // This is the userId
    const error = searchParams.get("error")

    if (error) {
      console.log("[v0] OAuth error:", error)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=gmail_oauth_denied`
      )
    }

    if (!code || !state) {
      console.log("[v0] Missing code or state")
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=gmail_oauth_invalid`
      )
    }

    const userId = state

    console.log("[v0] Processing OAuth callback for user:", userId)

    // Exchange code for tokens
    const tokens = await gmailXOAuth2.getTokensFromCode(code)

    if (!tokens.access_token) {
      throw new Error("Failed to get access token from Google")
    }

    console.log("[v0] Got access token, fetching user profile...")

    // Get user's Gmail profile
    const profile = await gmailXOAuth2.getUserProfile(tokens.access_token)

    console.log("[v0] User profile:", profile.email)

    // Find user in database
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      console.log("[v0] User not found in database")
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=user_not_found`
      )
    }

    // Get Gmail auto-config
    const autoConfig = getAutoConfigForEmail(profile.email)
    if (!autoConfig) {
      throw new Error("Could not auto-configure Gmail settings")
    }

    console.log("[v0] Creating/updating account...")

    // Create or update sending account
    const account = await db.sendingAccount.upsert({
      where: {
        userId_email: {
          userId: user.id,
          email: profile.email,
        },
      },
      create: {
        userId: user.id,
        name: `Gmail - ${profile.email}`,
        email: profile.email,
        provider: "gmail",
        connectionMethod: "oauth_workspace",
        credentials: {},
        smtpHost: autoConfig.smtp.host,
        smtpPort: autoConfig.smtp.port,
        smtpSecure: autoConfig.smtp.secure,
        smtpUsername: profile.email,
        smtpPassword: encryptPassword(tokens.access_token),
        imapHost: autoConfig.imap.host,
        imapPort: autoConfig.imap.port,
        imapTls: autoConfig.imap.tls,
        imapUsername: profile.email,
        imapPassword: encryptPassword(tokens.access_token),
        oauthProvider: "google",
        oauthAccessToken: encryptPassword(tokens.access_token),
        oauthRefreshToken: tokens.refresh_token ? encryptPassword(tokens.refresh_token) : null,
        oauthTokenExpiry: new Date(Date.now() + tokens.expires_in * 1000),
        dailyLimit: 500,
        hourlyLimit: 50,
        isActive: true,
      },
      update: {
        name: `Gmail - ${profile.email}`,
        credentials: {},
        smtpPassword: encryptPassword(tokens.access_token),
        imapPassword: encryptPassword(tokens.access_token),
        oauthAccessToken: encryptPassword(tokens.access_token),
        oauthRefreshToken: tokens.refresh_token ? encryptPassword(tokens.refresh_token) : null,
        oauthTokenExpiry: new Date(Date.now() + tokens.expires_in * 1000),
        isActive: true,
      },
    })

    console.log("[v0] Account created/updated successfully:", account.id)

    // Check if coming from onboarding
    const referer = request.headers.get("referer")
    if (referer && referer.includes("/onboarding")) {
      await db.user.update({
        where: { id: user.id },
        data: {
          onboardingCompletedQuestionnaire: true,
        },
      })
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=gmail_connected`)
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=gmail_connected`
    )
  } catch (error) {
    console.error("[v0] Gmail OAuth callback error:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=gmail_oauth_failed&details=${error instanceof Error ? error.message : 'unknown'}`
    )
  }
}