import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    console.log("[builtbycashe] Template creation API called")
    const { userId } = await auth()
    if (!userId) {
      console.log("[builtbycashe] Unauthorized - no userId")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      console.log("[builtbycashe] User not found for clerkId:", userId)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    console.log("[builtbycashe] Request body:", JSON.stringify(body, null, 2))

    const { name, category, subject, body: bodyContent, bodyText, variables } = body
    const templateBody = bodyContent || bodyText

    if (!templateBody) {
      console.log("[builtbycashe] Missing template body")
      return NextResponse.json({ error: "Template body is required" }, { status: 400 })
    }

    console.log("[builtbycashe] Creating template with name:", name)
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

    console.log("[builtbycashe] Template created successfully:", template.id)
    return NextResponse.json(template)
  } catch (error) {
    console.error("[builtbycashe] Failed to create template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
