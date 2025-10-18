// import { type NextRequest, NextResponse } from "next/server"
// import { generateEmail } from "@/lib/services/email-generator"

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { prospect, researchData, template, tone, personalizationLevel, callToAction } = body

//     if (!prospect || !prospect.email) {
//       return NextResponse.json({ error: "Prospect email is required" }, { status: 400 })
//     }

//     const result = await generateEmail({
//       prospect,
//       researchData,
//       template,
//       tone,
//       personalizationLevel,
//       callToAction,
//     })

//     return NextResponse.json({
//       success: true,
//       data: result,
//     })
//   } catch (error) {
//     console.error("[v0] Email generation API error:", error)
//     return NextResponse.json({ error: "Failed to generate email" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { generateEmail } from "@/lib/services/email-generator"
import { protectApiRoute, checkCredits } from "@/lib/api-protection"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  const { error, user } = await protectApiRoute()
  if (error) return error

  const creditCheck = await checkCredits(user!, "email")
  if (!creditCheck.hasCredits) return creditCheck.error

  try {
    const body = await request.json()
    const { prospect, researchData, template, tone, personalizationLevel, callToAction } = body

    if (!prospect || !prospect.email) {
      return NextResponse.json({ error: "Prospect email is required" }, { status: 400 })
    }

    const result = await generateEmail({
      prospect,
      researchData,
      template,
      tone,
      personalizationLevel,
      callToAction,
    })

    await db.user.update({
      where: { id: user!.id },
      data: { emailCredits: { decrement: 1 } },
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("[v0] Email generation API error:", error)
    return NextResponse.json({ error: "Failed to generate email" }, { status: 500 })
  }
}
