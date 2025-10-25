import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    console.log("[v0] Template creation API called")
    const { userId } = await auth()
    if (!userId) {
      console.log("[v0] Unauthorized - no userId")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      console.log("[v0] User not found for clerkId:", userId)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const { name, category, subject, body: bodyContent, bodyText, variables } = body
    const templateBody = bodyContent || bodyText

    if (!templateBody) {
      console.log("[v0] Missing template body")
      return NextResponse.json({ error: "Template body is required" }, { status: 400 })
    }

    console.log("[v0] Creating template with name:", name)
    const template = await db.emailTemplate.create({
      data: {
        userId: user.id,
        name,
        category,
        subject,
        body: templateBody,
        variables: variables || [],
      },
    })

    console.log("[v0] Template created successfully:", template.id)
    return NextResponse.json(template)
  } catch (error) {
    console.error("[v0] Failed to create template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
