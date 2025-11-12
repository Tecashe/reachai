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

//     // Redirect back to settings with success message
//     return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=gmail_connected`)
//   } catch (error) {
//     console.error("[builtbycashe] Gmail OAuth callback error:", error)
//     return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=gmail_oauth_failed`)
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { gmailOAuth } from "@/lib/services/oauth/gmail-oauth"
import { db } from "@/lib/db"
import { encrypt } from "@/lib/encryption"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state") // This is the userId
    const error = searchParams.get("error")

    if (error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=gmail_oauth_denied`)
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=gmail_oauth_invalid`)
    }

    const userId = state

    // Exchange code for tokens
    const tokens = await gmailOAuth.getTokensFromCode(code)

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error("Failed to get tokens from Gmail")
    }

    // Get user's Gmail profile
    const profile = await gmailOAuth.getUserProfile(tokens.access_token)

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
      expiresAt: tokens.expiry_date,
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
        name: `Gmail - ${profile.email}`,
        email: profile.email,
        provider: "gmail",
        credentials: encryptedCredentials,
        dailyLimit: 500, // Gmail's daily limit
        hourlyLimit: 50,
        isActive: true,
      },
      update: {
        credentials: encryptedCredentials,
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
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=gmail_connected`)
    }

    // Redirect back to settings with success message
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=gmail_connected`)
  } catch (error) {
    console.error("[v0] Gmail OAuth callback error:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=gmail_oauth_failed`)
  }
}
