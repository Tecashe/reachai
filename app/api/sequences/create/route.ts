// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { z } from "zod"

// const createSequenceSchema = z.object({
//   name: z.string().min(1),
//   description: z.string().optional(),
//   campaignId: z.string().optional(),
//   steps: z.array(
//     z.object({
//       order: z.number(),
//       subject: z.string(),
//       body: z.string(),
//       delayDays: z.number(),
//     }),
//   ),
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
//     const data = createSequenceSchema.parse(body)

//     const sequence = await db.emailSequence.create({
//       data: {
//         name: data.name,
//         description: data.description,
//         campaignId: data.campaignId,
//         userId: user.id,
//         steps: {
//           create: data.steps.map((step) => ({
//             order: step.order,
//             subject: step.subject,
//             body: step.body,
//             delayDays: step.delayDays,
//           })),
//         },
//       },
//       include: {
//         steps: true,
//       },
//     })

//     return NextResponse.json({ success: true, sequence })
//   } catch (error) {
//     console.error("[builtbycashe] Error creating sequence:", error)
//     return NextResponse.json({ error: "Failed to create sequence" }, { status: 500 })
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
