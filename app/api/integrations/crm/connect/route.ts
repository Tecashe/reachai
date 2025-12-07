import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { initiateCRMConnection } from "@/lib/actions/crm"

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { crmType } = await request.json()

    if (!["hubspot", "salesforce", "pipedrive"].includes(crmType)) {
      return NextResponse.json({ error: "Invalid CRM type" }, { status: 400 })
    }

    const result = await initiateCRMConnection(crmType)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ authUrl: result.authUrl })
  } catch (error) {
    console.error("[CRM Connect] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
