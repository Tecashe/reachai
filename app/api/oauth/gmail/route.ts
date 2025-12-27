// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { gmailOAuth } from "@/lib/services/oauth/gmail-oauth"

// export async function GET(request: NextRequest) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Generate OAuth URL
//     const authUrl = gmailOAuth.getAuthUrl(userId)

//     // Redirect user to Google OAuth consent screen
//     return NextResponse.redirect(authUrl)
//   } catch (error) {
//     console.error("[builtbycashe] Gmail OAuth error:", error)
//     return NextResponse.json({ error: "Failed to initiate Gmail OAuth" }, { status: 500 })
//   }
// }


// app/api/oauth/gmail/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { gmailOAuthImap } from "@/lib/services/email/gmail-oauth-imap"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate OAuth URL with IMAP/SMTP scopes (NOT gmail.send)
    const authUrl = gmailOAuthImap.getAuthUrl(userId)

    // Redirect user to Google OAuth consent screen
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error("[OAuth] Gmail initiation error:", error)
    return NextResponse.json({ error: "Failed to initiate Gmail OAuth" }, { status: 500 })
  }
}
