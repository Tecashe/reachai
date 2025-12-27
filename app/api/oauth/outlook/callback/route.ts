
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


// app/api/oauth/outlook/callback/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { outlookOAuthImap } from "@/lib/services/email/outlook-oauth-imap"
import { db } from "@/lib/db"
import { encrypt } from "@/lib/encryption"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state") // This is the userId
    const error = searchParams.get("error")

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=outlook_oauth_denied`
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=outlook_oauth_invalid`
      )
    }

    const userId = state

    // Exchange code for tokens
    const tokens = await outlookOAuthImap.getTokensFromCode(code)

    if (!tokens.accessToken || !tokens.refreshToken) {
      throw new Error("Failed to get tokens from Outlook")
    }

    // Get user's Outlook profile
    const profile = await outlookOAuthImap.getUserProfile(tokens.accessToken)

    // Verify IMAP/SMTP connections
    const connectionTest = await outlookOAuthImap.verifyConnections(
      profile.email,
      tokens.accessToken
    )

    if (!connectionTest.healthy) {
      console.error("[OAuth] Connection verification failed:", connectionTest)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=outlook_connection_failed`
      )
    }

    // Find user in database
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=user_not_found`
      )
    }

    // Encrypt credentials
    const encryptedCredentials = encrypt({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresOn.getTime(),
      provider: 'outlook',
      connectionType: 'oauth_imap_smtp',
      imapHost: 'outlook.office365.com',
      imapPort: 993,
      smtpHost: 'smtp.office365.com',
      smtpPort: 587,
    })

    // Create or update sending account
    const sendingAccount = await db.sendingAccount.upsert({
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
        healthScore: 100,
        warmupEnabled: true,
        warmupStage: 'NEW',
        warmupDailyLimit: 20,
      },
      update: {
        credentials: encryptedCredentials,
        isActive: true,
        healthScore: 100,
      },
    })

    // Log successful connection
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'sending_account.connected',
        entityType: 'sending_account',
        entityId: sendingAccount.id,
        metadata: {
          provider: 'outlook',
          email: profile.email,
          connectionType: 'oauth_imap_smtp',
          imapVerified: connectionTest.imap,
          smtpVerified: connectionTest.smtp,
        },
      },
    })

    // Check if coming from onboarding
    const referer = request.headers.get("referer")
    if (referer && referer.includes("/onboarding")) {
      await db.user.update({
        where: { id: user.id },
        data: {
          onboardingCompletedQuestionnaire: true,
        },
      })
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=outlook_connected`
      )
    }

    // Redirect back to settings with success message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=outlook_connected&email=${encodeURIComponent(profile.email)}`
    )
  } catch (error) {
    console.error("[OAuth] Outlook callback error:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=outlook_oauth_failed`
    )
  }
}