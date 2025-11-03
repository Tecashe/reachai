// import { auth } from "@clerk/nextjs/server"
// import { type NextRequest, NextResponse } from "next/server"

// export async function POST(req: NextRequest) {
//   try {
//     const { userId } = await auth()
//     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//     const { crmType } = await req.json()

//     if (!["hubspot", "salesforce", "pipedrive"].includes(crmType)) {
//       return NextResponse.json({ error: "Invalid CRM type" }, { status: 400 })
//     }

//     const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
//     const redirectUri = `${baseUrl}/api/integrations/callback/${crmType}`
//     const state = Buffer.from(JSON.stringify({ userId })).toString("base64")

//     let authUrl: string

//     if (crmType === "hubspot") {
//       const clientId = process.env.HUBSPOT_CLIENT_ID
//       if (!clientId) return NextResponse.json({ error: "HubSpot not configured" }, { status: 500 })
//       authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=crm.objects.contacts.read%20crm.objects.companies.read&state=${state}`
//     } else if (crmType === "salesforce") {
//       const clientId = process.env.SALESFORCE_CLIENT_ID
//       if (!clientId) return NextResponse.json({ error: "Salesforce not configured" }, { status: 500 })
//       authUrl = `https://login.salesforce.com/services/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`
//     } else {
//       const clientId = process.env.PIPEDRIVE_CLIENT_ID
//       if (!clientId) return NextResponse.json({ error: "Pipedrive not configured" }, { status: 500 })
//       authUrl = `https://oauth.pipedrive.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`
//     }

//     return NextResponse.json({ authUrl })
//   } catch (error) {
//     console.error("[v0] CRM connect error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// import { auth } from "@clerk/nextjs/server"
// import { type NextRequest, NextResponse } from "next/server"

// export async function POST(req: NextRequest) {
//   try {
//     const { userId } = await auth()
//     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//     const body = await req.json().catch(() => ({}))
//     const { crmType } = body

//     if (!crmType || !["hubspot", "salesforce", "pipedrive"].includes(crmType)) {
//       console.error("[v0] Invalid CRM type:", crmType)
//       return NextResponse.json({ error: "Invalid CRM type" }, { status: 400 })
//     }

//     const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
//     const redirectUri = `${baseUrl}/api/integrations/callback/${crmType}`
//     const state = Buffer.from(JSON.stringify({ userId })).toString("base64")

//     let authUrl: string
//     let missingEnvVar: string | null = null

//     if (crmType === "hubspot") {
//       const clientId = process.env.HUBSPOT_CLIENT_ID
//       missingEnvVar = clientId ? null : "HUBSPOT_CLIENT_ID"
//       if (!clientId) {
//         console.error("[v0] HubSpot OAuth not configured - missing HUBSPOT_CLIENT_ID")
//         return NextResponse.json(
//           {
//             error: "HubSpot integration not configured. Please add HUBSPOT_CLIENT_ID to your environment variables.",
//             setupRequired: true,
//           },
//           { status: 503 },
//         )
//       }
//       authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=crm.objects.contacts.read%20crm.objects.companies.read&state=${state}`
//     } else if (crmType === "salesforce") {
//       const clientId = process.env.SALESFORCE_CLIENT_ID
//       if (!clientId) {
//         console.error("[v0] Salesforce OAuth not configured - missing SALESFORCE_CLIENT_ID")
//         return NextResponse.json(
//           {
//             error:
//               "Salesforce integration not configured. Please add SALESFORCE_CLIENT_ID to your environment variables.",
//             setupRequired: true,
//           },
//           { status: 503 },
//         )
//       }
//       authUrl = `https://login.salesforce.com/services/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`
//     } else {
//       const clientId = process.env.PIPEDRIVE_CLIENT_ID
//       if (!clientId) {
//         console.error("[v0] Pipedrive OAuth not configured - missing PIPEDRIVE_CLIENT_ID")
//         return NextResponse.json(
//           {
//             error:
//               "Pipedrive integration not configured. Please add PIPEDRIVE_CLIENT_ID to your environment variables.",
//             setupRequired: true,
//           },
//           { status: 503 },
//         )
//       }
//       authUrl = `https://oauth.pipedrive.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`
//     }

//     console.log("[v0] CRM auth flow initiated for:", crmType)
//     return NextResponse.json({ authUrl })
//   } catch (error) {
//     console.error("[v0] CRM connect error:", error)
//     console.error("[v0] Full error object:", {
//       message: error instanceof Error ? error.message : "Unknown error",
//       stack: error instanceof Error ? error.stack : undefined,
//     })
//     return NextResponse.json({ error: "Failed to initiate CRM connection. Please try again." }, { status: 500 })
//   }
// }

import { auth } from "@clerk/nextjs/server"
import { generateOAuthUrl } from "@/lib/services/crm-oauth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const { crmType } = body

    if (!crmType || !["hubspot", "salesforce", "pipedrive"].includes(crmType)) {
      console.error("[v0] Invalid CRM type:", crmType)
      return NextResponse.json({ error: "Invalid CRM type" }, { status: 400 })
    }

    try {
      const authUrl = generateOAuthUrl(crmType as "hubspot" | "salesforce" | "pipedrive", userId)
      console.log("[v0] CRM auth flow initiated for:", crmType)
      return NextResponse.json({ authUrl })
    } catch (error) {
      console.error("[v0] OAuth generation failed:", error)

      if (error instanceof Error && error.message.includes("not configured")) {
        return NextResponse.json(
          {
            error: `${crmType} integration not configured. Please add the required environment variables to Vercel.`,
            setupRequired: true,
            provider: crmType,
          },
          { status: 503 },
        )
      }

      if (error instanceof Error && error.message.includes("ENCRYPTION_KEY")) {
        return NextResponse.json(
          {
            error: "Encryption key not configured. Please set ENCRYPTION_KEY in environment variables.",
            setupRequired: true,
          },
          { status: 503 },
        )
      }

      throw error
    }
  } catch (error) {
    console.error("[v0] CRM connect error:", error)
    return NextResponse.json({ error: "Failed to initiate CRM connection. Please try again." }, { status: 500 })
  }
}
