import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }

    const searchParams = req.nextUrl.searchParams
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      logger.error("Gmail OAuth error", new Error(error))
      return NextResponse.redirect(new URL("/dashboard/integrations?error=oauth_failed", req.url))
    }

    if (!code) {
      return NextResponse.redirect(new URL("/dashboard/integrations?error=no_code", req.url))
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/callback/gmail`,
        grant_type: "authorization_code",
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokens.access_token) {
      throw new Error("No access token received")
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      throw new Error("User not found")
    }

    // Store integration
    await db.integration.upsert({
      where: {
        userId_type: {
          userId: user.id,
          type: "GMAIL",
        },
      },
      create: {
        userId: user.id,
        type: "GMAIL",
        name: "Gmail",
        credentials: tokens,
        isActive: true,
      },
      update: {
        credentials: tokens,
        isActive: true,
        lastSyncedAt: new Date(),
      },
    })

    logger.info("Gmail integration connected", { userId: user.id })

    return NextResponse.redirect(new URL("/dashboard/integrations?success=gmail_connected", req.url))
  } catch (error) {
    logger.error("Gmail OAuth callback error", error as Error)
    return NextResponse.redirect(new URL("/dashboard/integrations?error=connection_failed", req.url))
  }
}
