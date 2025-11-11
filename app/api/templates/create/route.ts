// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { z } from "zod"

// const createTemplateSchema = z.object({
//   name: z.string().min(1),
//   subject: z.string().min(1),
//   body: z.string().min(1),
//   category: z.enum(["COLD_OUTREACH", "FOLLOW_UP", "MEETING_REQUEST", "INTRODUCTION", "THANK_YOU"]),
//   variables: z.array(z.string()),
// })

// export async function POST(req: NextRequest) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const user = await db.user.findUnique({ where: { clerkId: userId } })
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     const body = await req.json()
//     const data = createTemplateSchema.parse(body)

//     // Extract variables from subject and body
//     const variableRegex = /\{\{(\w+)\}\}/g
//     const extractedVars = new Set<string>()

//     const subjectMatches = data.subject.matchAll(variableRegex)
//     for (const match of subjectMatches) {
//       extractedVars.add(match[1])
//     }

//     const bodyMatches = data.body.matchAll(variableRegex)
//     for (const match of bodyMatches) {
//       extractedVars.add(match[1])
//     }

//     const template = await db.emailTemplate.create({
//       data: {
//         name: data.name,
//         subject: data.subject,
//         body: data.body,
//         category: data.category,
//         variables: Array.from(extractedVars),
//         userId: user.id,
//       },
//     })

//     return NextResponse.json({ success: true, template })
//   } catch (error) {
//     console.error("[builtbycashe] Error creating template:", error)
//     return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { z } from "zod"

const createSequenceSchema = z.object({
  campaignId: z.string(),
  templateId: z.string(),
  stepNumber: z.number().int().positive(),
  delayDays: z.number().int().min(0).default(2),
  sendOnlyIfNotReplied: z.boolean().default(true),
  sendOnlyIfNotOpened: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await req.json()
    const data = createSequenceSchema.parse(body)

    const campaign = await db.campaign.findFirst({
      where: { id: data.campaignId, userId: user.id },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const template = await db.emailTemplate.findFirst({
      where: { id: data.templateId, userId: user.id },
    })

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    const sequence = await db.emailSequence.create({
      data: {
        campaignId: data.campaignId,
        templateId: data.templateId,
        stepNumber: data.stepNumber,
        delayDays: data.delayDays,
        sendOnlyIfNotReplied: data.sendOnlyIfNotReplied,
        sendOnlyIfNotOpened: data.sendOnlyIfNotOpened,
      },
      include: {
        template: true,
        campaign: true,
      },
    })

    return NextResponse.json({ success: true, sequence })
  } catch (error) {
    console.error("[builtbycashe] Error creating sequence:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create sequence" }, { status: 500 })
  }
}
