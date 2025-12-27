
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


// app/api/oauth/gmail/callback/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { gmailOAuthImap } from "@/lib/services/email/gmail-oauth-imap"
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
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=gmail_oauth_denied`
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=gmail_oauth_invalid`
      )
    }

    const userId = state

    // Exchange code for tokens
    const tokens = await gmailOAuthImap.getTokensFromCode(code)

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error("Failed to get tokens from Gmail")
    }

    // Get user's Gmail profile
    const profile = await gmailOAuthImap.getUserProfile(tokens.access_token)

    // Verify IMAP/SMTP connections
    const connectionTest = await gmailOAuthImap.verifyConnections(
      profile.email,
      tokens.access_token
    )

    if (!connectionTest.healthy) {
      console.error("[OAuth] Connection verification failed:", connectionTest)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=gmail_connection_failed`
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
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expiry_date,
      provider: 'gmail',
      // Store connection type for clarity
      connectionType: 'oauth_imap_smtp',
      imapHost: 'imap.gmail.com',
      imapPort: 993,
      smtpHost: 'smtp.gmail.com',
      smtpPort: 465,
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
        name: `Gmail - ${profile.email}`,
        email: profile.email,
        provider: "gmail",
        credentials: encryptedCredentials,
        dailyLimit: 500, // Gmail's daily limit
        hourlyLimit: 50,
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
          provider: 'gmail',
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
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=gmail_connected`
      )
    }

    // Redirect back to settings with success message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=gmail_connected&email=${encodeURIComponent(profile.email)}`
    )
  } catch (error) {
    console.error("[OAuth] Gmail callback error:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=gmail_oauth_failed`
    )
  }
}