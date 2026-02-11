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

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mailfra.com"
    const settingsUrl = `${baseUrl}/dashboard/settings/email-accounts`

    if (error) {
      return NextResponse.redirect(`${settingsUrl}?error=outlook_oauth_denied`)
    }

    if (!code || !state) {
      return NextResponse.redirect(`${settingsUrl}?error=outlook_oauth_invalid`)
    }

    const userId = state

    // Exchange code for tokens
    const tokens = await outlookOAuth.getTokensFromCode(code)

    if (!tokens.access_token || !tokens.refresh_token || !tokens.id_token) {
      throw new Error("Failed to get tokens from Outlook")
    }

    // Get user's Outlook profile from ID token
    const profile = await outlookOAuth.getUserProfile(tokens.id_token)

    // Find user in database
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.redirect(`${settingsUrl}?error=user_not_found`)
    }

    // Auto-configure SMTP/IMAP settings, fallback to Office 365 defaults for custom domains
    const autoConfig = getAutoConfigForEmail(profile.email) || {
      provider: "office365",
      smtp: { host: "smtp.office365.com", port: 587, secure: false },
      imap: { host: "outlook.office365.com", port: 993, tls: true },
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
        name: profile.displayName || `Outlook - ${profile.email}`,
        email: profile.email,
        provider: "outlook",
        connectionMethod: "oauth",
        connectionType: "oauth",
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
        oauthProvider: "outlook",
        oauthAccessToken: encryptPassword(tokens.access_token),
        oauthRefreshToken: encryptPassword(tokens.refresh_token),
        oauthTokenExpiry: new Date(Date.now() + (tokens.expires_in || 3600) * 1000),
        dailyLimit: 300,
        hourlyLimit: 30,
        isActive: true,
      },
      update: {
        name: profile.displayName || `Outlook - ${profile.email}`,
        credentials: {},
        connectionMethod: "oauth",
        connectionType: "oauth",
        smtpHost: autoConfig.smtp.host,
        smtpPort: autoConfig.smtp.port,
        smtpUsername: profile.email,
        smtpPassword: encryptPassword(tokens.access_token),
        imapHost: autoConfig.imap.host,
        imapPort: autoConfig.imap.port,
        imapUsername: profile.email,
        imapPassword: encryptPassword(tokens.access_token),
        oauthProvider: "outlook",
        oauthAccessToken: encryptPassword(tokens.access_token),
        oauthRefreshToken: encryptPassword(tokens.refresh_token),
        oauthTokenExpiry: new Date(Date.now() + (tokens.expires_in || 3600) * 1000),
        isActive: true,
      },
    })

    console.log("[mailfra]Outlook OAuth account connected:", account.id, profile.email)

    return NextResponse.redirect(`${settingsUrl}?success=outlook_connected`)
  } catch (error) {
    console.error("[mailfra] Outlook OAuth callback error:", error)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mailfra.com"
    return NextResponse.redirect(`${baseUrl}/dashboard/settings/email-accounts?error=outlook_oauth_failed`)
  }
}