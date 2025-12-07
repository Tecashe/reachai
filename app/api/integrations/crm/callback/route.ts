// import { NextResponse } from "next/server"
// import { db } from "@/lib/db"

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url)
//   const code = searchParams.get("code")
//   const state = searchParams.get("state")
//   const error = searchParams.get("error")

//   if (error) {
//     return NextResponse.redirect(new URL("/crm?error=oauth_denied", request.url))
//   }

//   if (!code || !state) {
//     return NextResponse.redirect(new URL("/crm?error=missing_params", request.url))
//   }

//   try {
//     const { clerkId, crmType } = JSON.parse(Buffer.from(state, "base64url").toString())

//     const user = await db.user.findUnique({
//       where: { clerkId },
//       select: { id: true },
//     })

//     if (!user) {
//       return NextResponse.redirect(new URL("/crm?error=user_not_found", request.url))
//     }

//     const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
//     const redirectUri = `${baseUrl}/api/integrations/crm/callback`

//     let tokenData: {
//       access_token: string
//       refresh_token: string
//       expires_in: number
//       instance_url?: string
//     }

//     switch (crmType) {
//       case "hubspot":
//         const hubspotResponse = await fetch("https://api.hubapi.com/oauth/v1/token", {
//           method: "POST",
//           headers: { "Content-Type": "application/x-www-form-urlencoded" },
//           body: new URLSearchParams({
//             grant_type: "authorization_code",
//             client_id: process.env.HUBSPOT_CLIENT_ID!,
//             client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
//             redirect_uri: redirectUri,
//             code,
//           }),
//         })
//         if (!hubspotResponse.ok) throw new Error("HubSpot token exchange failed")
//         tokenData = await hubspotResponse.json()
//         break

//       case "salesforce":
//         const salesforceResponse = await fetch("https://login.salesforce.com/services/oauth2/token", {
//           method: "POST",
//           headers: { "Content-Type": "application/x-www-form-urlencoded" },
//           body: new URLSearchParams({
//             grant_type: "authorization_code",
//             client_id: process.env.SALESFORCE_CLIENT_ID!,
//             client_secret: process.env.SALESFORCE_CLIENT_SECRET!,
//             redirect_uri: redirectUri,
//             code,
//           }),
//         })
//         if (!salesforceResponse.ok) throw new Error("Salesforce token exchange failed")
//         tokenData = await salesforceResponse.json()
//         break

//       case "pipedrive":
//         const pipedriveResponse = await fetch("https://oauth.pipedrive.com/oauth/token", {
//           method: "POST",
//           headers: { "Content-Type": "application/x-www-form-urlencoded" },
//           body: new URLSearchParams({
//             grant_type: "authorization_code",
//             client_id: process.env.PIPEDRIVE_CLIENT_ID!,
//             client_secret: process.env.PIPEDRIVE_CLIENT_SECRET!,
//             redirect_uri: redirectUri,
//             code,
//           }),
//         })
//         if (!pipedriveResponse.ok) throw new Error("Pipedrive token exchange failed")
//         tokenData = await pipedriveResponse.json()
//         break

//       default:
//         return NextResponse.redirect(new URL("/crm?error=invalid_crm", request.url))
//     }

//     const integrationTypeMap: Record<string, "HUBSPOT" | "SALESFORCE" | "PIPEDRIVE"> = {
//       hubspot: "HUBSPOT",
//       salesforce: "SALESFORCE",
//       pipedrive: "PIPEDRIVE",
//     }

//     await db.integration.updateMany({
//       where: {
//         userId: user.id,
//         type: { in: ["HUBSPOT", "SALESFORCE", "PIPEDRIVE"] },
//       },
//       data: { isActive: false },
//     })

//     await db.integration.create({
//       data: {
//         userId: user.id,
//         type: integrationTypeMap[crmType],
//         name: crmType.charAt(0).toUpperCase() + crmType.slice(1),
//         credentials: {
//           accessToken: tokenData.access_token,
//           refreshToken: tokenData.refresh_token,
//           expiresAt: Date.now() + tokenData.expires_in * 1000,
//           instanceUrl: tokenData.instance_url,
//         },
//         isActive: true,
//       },
//     })

//     return NextResponse.redirect(new URL("/crm?success=connected", request.url))
//   } catch (error) {
//     console.error("[CRM Callback] Error:", error)
//     return NextResponse.redirect(new URL("/crm?error=connection_failed", request.url))
//   }
// }

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

    const user = await db.user.findUnique({
      where: { clerkId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.redirect(new URL("/dashboard/crm?error=user_not_found", request.url))
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const redirectUri = `${baseUrl}/api/integrations/crm/callback`

    let tokenData: {
      access_token: string
      refresh_token: string
      expires_in: number
      instance_url?: string
    }

    switch (crmType) {
      case "hubspot":
        const hubspotResponse = await fetch("https://api.hubapi.com/oauth/v1/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.HUBSPOT_CLIENT_ID!,
            client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
            redirect_uri: redirectUri,
            code,
          }),
        })
        if (!hubspotResponse.ok) throw new Error("HubSpot token exchange failed")
        tokenData = await hubspotResponse.json()
        break

      case "salesforce":
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
        if (!salesforceResponse.ok) throw new Error("Salesforce token exchange failed")
        tokenData = await salesforceResponse.json()
        break

      case "pipedrive":
        const pipedriveResponse = await fetch("https://oauth.pipedrive.com/oauth/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.PIPEDRIVE_CLIENT_ID!,
            client_secret: process.env.PIPEDRIVE_CLIENT_SECRET!,
            redirect_uri: redirectUri,
            code,
          }),
        })
        if (!pipedriveResponse.ok) throw new Error("Pipedrive token exchange failed")
        tokenData = await pipedriveResponse.json()
        break

      default:
        return NextResponse.redirect(new URL("/dashboard/crm?error=invalid_crm", request.url))
    }

    const integrationTypeMap: Record<string, "HUBSPOT" | "SALESFORCE" | "PIPEDRIVE"> = {
      hubspot: "HUBSPOT",
      salesforce: "SALESFORCE",
      pipedrive: "PIPEDRIVE",
    }

    await db.integration.updateMany({
      where: {
        userId: user.id,
        type: { in: ["HUBSPOT", "SALESFORCE", "PIPEDRIVE"] },
      },
      data: { isActive: false },
    })

    await db.integration.create({
      data: {
        userId: user.id,
        type: integrationTypeMap[crmType],
        name: crmType.charAt(0).toUpperCase() + crmType.slice(1),
        credentials: {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          expiresAt: Date.now() + tokenData.expires_in * 1000,
          instanceUrl: tokenData.instance_url,
        },
        isActive: true,
      },
    })

    return NextResponse.redirect(new URL("/dashboard/crm?success=connected", request.url))
  } catch (error) {
    console.error("[CRM Callback] Error:", error)
    return NextResponse.redirect(new URL("/dashboard/crm?error=connection_failed", request.url))
  }
}
