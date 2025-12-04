// import { NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"

// export async function POST(request: Request) {
//   try {
//     console.log("[builtbycashe] Template creation API called")
//     const { userId } = await auth()
//     if (!userId) {
//       console.log("[builtbycashe] Unauthorized - no userId")
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       console.log("[builtbycashe] User not found for clerkId:", userId)
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     const body = await request.json()
//     console.log("[builtbycashe] Request body:", JSON.stringify(body, null, 2))

//     const { name, category, subject, body: bodyContent, bodyText, variables } = body
//     const templateBody = bodyContent || bodyText

//     if (!templateBody) {
//       console.log("[builtbycashe] Missing template body")
//       return NextResponse.json({ error: "Template body is required" }, { status: 400 })
//     }

//     console.log("[builtbycashe] Creating template with name:", name)
//     const template = await db.emailTemplate.create({
//       data: {
//         userId: user.id,
//         name,
//         category,
//         subject,
//         body: templateBody,
//         variables: variables || [],
//       },
//     })

//     console.log("[builtbycashe] Template created successfully:", template.id)
//     return NextResponse.json(template)
//   } catch (error) {
//     console.error("[builtbycashe] Failed to create template:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const templates = await db.emailTemplate.findMany({
      where: {
        OR: [{ userId: user.id }, { isSystemTemplate: true }],
      },
      orderBy: [{ isFavorite: "desc" }, { timesUsed: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        subject: true,
        body: true,
        category: true,
        isFavorite: true,
        timesUsed: true,
        industry: true,
        tags: true,
        isSystemTemplate: true,
      },
    })

    // Map to expected format
    const formattedTemplates = templates.map((t) => ({
      id: t.id,
      name: t.name,
      subject: t.subject,
      body: t.body,
      category: t.category || "General",
      isFavorite: t.isFavorite,
      usageCount: t.timesUsed,
    }))

    return NextResponse.json({ templates: formattedTemplates })
  } catch (error) {
    console.error("Templates fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, subject, body, category } = await req.json()

    if (!name || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const template = await db.emailTemplate.create({
      data: {
        userId: user.id,
        name,
        subject,
        body,
        category: category || "General",
      },
    })

    return NextResponse.json({
      success: true,
      template: {
        id: template.id,
        name: template.name,
        subject: template.subject,
        body: template.body,
        category: template.category,
        isFavorite: template.isFavorite,
        usageCount: template.timesUsed,
      },
    })
  } catch (error) {
    console.error("Template create error:", error)
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
  }
}
