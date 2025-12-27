
// import { type NextRequest, NextResponse } from "next/server"
// import { outlookOAuth } from "@/lib/services/oauth/outlook-oauth"
// import { db } from "@/lib/db"
// import { encrypt } from "@/lib/encryption"

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams
//     const code = searchParams.get("code")
//     const state = searchParams.get("state") // This is the userId
//     const error = searchParams.get("error")

//     if (error) {
//       return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=outlook_oauth_denied`)
//     }

//     if (!code || !state) {
//       return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=outlook_oauth_invalid`)
//     }

//     const userId = state

//     // Exchange code for tokens
//     const tokens = await outlookOAuth.getTokensFromCode(code)

//     if (!tokens.access_token || !tokens.refresh_token) {
//       throw new Error("Failed to get tokens from Outlook")
//     }

//     // Get user's Outlook profile
//     const profile = await outlookOAuth.getUserProfile(tokens.access_token)

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
//       expiresIn: tokens.expires_in,
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
//         name: `Outlook - ${profile.email}`,
//         email: profile.email,
//         provider: "outlook",
//         credentials: encryptedCredentials,
//         dailyLimit: 300, // Outlook's daily limit
//         hourlyLimit: 30,
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
//       return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=outlook_connected`)
//     }

//     // Redirect back to settings with success message
//     return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=outlook_connected`)
//   } catch (error) {
//     console.error("[v0] Outlook OAuth callback error:", error)
//     return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=outlook_oauth_failed`)
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { outlookOAuth } from "@/lib/services/oauth/outlook-oauth"
import { db } from "@/lib/db"
import { encryptPassword } from "@/lib/encryption"
import { getAutoConfigForEmail } from "@/lib/email-connection/provider-configs"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")
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

    const autoConfig = getAutoConfigForEmail(profile.email)
    if (!autoConfig) {
      throw new Error("Could not auto-configure Outlook settings")
    }

    const account = await db.sendingAccount.upsert({
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
        connectionMethod: "oauth_workspace",
        credentials: {}, // Add required credentials field
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
        oauthProvider: "outlook",
        oauthAccessToken: encryptPassword(tokens.access_token),
        oauthRefreshToken: encryptPassword(tokens.refresh_token),
        oauthTokenExpiry: new Date(Date.now() + (tokens.expires_in || 3600) * 1000),
        dailyLimit: 300,
        hourlyLimit: 30,
        isActive: true,
      },
      update: {
        name: `Outlook - ${profile.email}`,
        credentials: {}, // Add required credentials field
        smtpPassword: encryptPassword(tokens.access_token),
        imapPassword: encryptPassword(tokens.access_token),
        oauthAccessToken: encryptPassword(tokens.access_token),
        oauthRefreshToken: encryptPassword(tokens.refresh_token),
        oauthTokenExpiry: new Date(Date.now() + (tokens.expires_in || 3600) * 1000),
        isActive: true,
      },
    })

    const referer = request.headers.get("referer")
    if (referer && referer.includes("/onboarding")) {
      await db.user.update({
        where: { id: user.id },
        data: {
          onboardingCompletedQuestionnaire: true,
        },
      })
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=outlook_connected`)
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=outlook_connected`)
  } catch (error) {
    console.error("[v0] Outlook OAuth callback error:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=outlook_oauth_failed`)
  }
}