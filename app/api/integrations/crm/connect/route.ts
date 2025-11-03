import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { crmType } = await req.json()

    if (!["hubspot", "salesforce", "pipedrive"].includes(crmType)) {
      return NextResponse.json({ error: "Invalid CRM type" }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const redirectUri = `${baseUrl}/api/integrations/callback/${crmType}`
    const state = Buffer.from(JSON.stringify({ userId })).toString("base64")

    let authUrl: string

    if (crmType === "hubspot") {
      const clientId = process.env.HUBSPOT_CLIENT_ID
      if (!clientId) return NextResponse.json({ error: "HubSpot not configured" }, { status: 500 })
      authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=crm.objects.contacts.read%20crm.objects.companies.read&state=${state}`
    } else if (crmType === "salesforce") {
      const clientId = process.env.SALESFORCE_CLIENT_ID
      if (!clientId) return NextResponse.json({ error: "Salesforce not configured" }, { status: 500 })
      authUrl = `https://login.salesforce.com/services/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`
    } else {
      const clientId = process.env.PIPEDRIVE_CLIENT_ID
      if (!clientId) return NextResponse.json({ error: "Pipedrive not configured" }, { status: 500 })
      authUrl = `https://oauth.pipedrive.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`
    }

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error("[v0] CRM connect error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
