import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

interface CRMContact {
  id: string
  email: string | null
  firstName: string | null
  lastName: string | null
  company: string | null
  phone: string | null
  title: string | null
  quality: "high" | "medium" | "low"
  missingFields: string[]
}

async function fetchHubSpotContacts(accessToken: string): Promise<CRMContact[]> {
  const response = await fetch(
    "https://api.hubapi.com/crm/v3/objects/contacts?limit=100&properties=email,firstname,lastname,company,phone,jobtitle",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  )

  if (!response.ok) {
    throw new Error("Failed to fetch HubSpot contacts")
  }

  const data = await response.json()

  return data.results.map((contact: any) => {
    const props = contact.properties
    const missingFields: string[] = []

    if (!props.email) missingFields.push("email")
    if (!props.firstname) missingFields.push("firstName")
    if (!props.lastname) missingFields.push("lastName")
    if (!props.company) missingFields.push("company")

    let quality: "high" | "medium" | "low" = "high"
    if (!props.email) {
      quality = "low"
    } else if (missingFields.length >= 2) {
      quality = "medium"
    }

    return {
      id: contact.id,
      email: props.email || null,
      firstName: props.firstname || null,
      lastName: props.lastname || null,
      company: props.company || null,
      phone: props.phone || null,
      title: props.jobtitle || null,
      quality,
      missingFields,
    }
  })
}

async function fetchSalesforceContacts(accessToken: string, instanceUrl: string): Promise<CRMContact[]> {
  const response = await fetch(
    `${instanceUrl}/services/data/v57.0/query?q=SELECT+Id,Email,FirstName,LastName,Account.Name,Phone,Title+FROM+Contact+LIMIT+100`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  )

  if (!response.ok) {
    throw new Error("Failed to fetch Salesforce contacts")
  }

  const data = await response.json()

  return data.records.map((contact: any) => {
    const missingFields: string[] = []

    if (!contact.Email) missingFields.push("email")
    if (!contact.FirstName) missingFields.push("firstName")
    if (!contact.LastName) missingFields.push("lastName")
    if (!contact.Account?.Name) missingFields.push("company")

    let quality: "high" | "medium" | "low" = "high"
    if (!contact.Email) {
      quality = "low"
    } else if (missingFields.length >= 2) {
      quality = "medium"
    }

    return {
      id: contact.Id,
      email: contact.Email || null,
      firstName: contact.FirstName || null,
      lastName: contact.LastName || null,
      company: contact.Account?.Name || null,
      phone: contact.Phone || null,
      title: contact.Title || null,
      quality,
      missingFields,
    }
  })
}

async function fetchPipedriveContacts(apiToken: string): Promise<CRMContact[]> {
  const response = await fetch(`https://api.pipedrive.com/v1/persons?api_token=${apiToken}&limit=100`)

  if (!response.ok) {
    throw new Error("Failed to fetch Pipedrive contacts")
  }

  const data = await response.json()

  if (!data.data) return []

  return data.data.map((contact: any) => {
    const email = contact.email?.[0]?.value || null
    const phone = contact.phone?.[0]?.value || null
    const missingFields: string[] = []

    if (!email) missingFields.push("email")
    if (!contact.first_name) missingFields.push("firstName")
    if (!contact.last_name) missingFields.push("lastName")
    if (!contact.org_name) missingFields.push("company")

    let quality: "high" | "medium" | "low" = "high"
    if (!email) {
      quality = "low"
    } else if (missingFields.length >= 2) {
      quality = "medium"
    }

    return {
      id: String(contact.id),
      email,
      firstName: contact.first_name || null,
      lastName: contact.last_name || null,
      company: contact.org_name || null,
      phone,
      title: null,
      quality,
      missingFields,
    }
  })
}

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const crmType = request.nextUrl.searchParams.get("type")
    if (!crmType) {
      return NextResponse.json({ error: "CRM type required" }, { status: 400 })
    }

    const integration = await db.integration.findFirst({
      where: {
        userId: user.id,
        type: crmType.toUpperCase() as any,
      },
    })

    if (!integration || !integration.credentials) {
      return NextResponse.json({ error: "CRM not connected" }, { status: 404 })
    }

    const credentials = integration.credentials as any
    let contacts: CRMContact[] = []

    switch (crmType.toUpperCase()) {
      case "HUBSPOT":
        contacts = await fetchHubSpotContacts(credentials.accessToken)
        break
      case "SALESFORCE":
        contacts = await fetchSalesforceContacts(credentials.accessToken, credentials.instanceUrl)
        break
      case "PIPEDRIVE":
        contacts = await fetchPipedriveContacts(credentials.accessToken)
        break
      default:
        return NextResponse.json({ error: "Unsupported CRM type" }, { status: 400 })
    }

    const summary = {
      total: contacts.length,
      high: contacts.filter((c) => c.quality === "high").length,
      medium: contacts.filter((c) => c.quality === "medium").length,
      low: contacts.filter((c) => c.quality === "low").length,
    }

    return NextResponse.json({ contacts, summary })
  } catch (error: any) {
    console.error("CRM preview error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch contacts" }, { status: 500 })
  }
}
