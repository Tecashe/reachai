import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { predictEmailPerformance } from "@/lib/services/email-performance-predictor"
import { checkRateLimit } from "@/lib/api-protection"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(userId, "email-prediction")
    if (!rateLimitResult.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
    }

    const { subject, body, prospectData, historicalData } = await req.json()

    if (!subject || !body) {
      return NextResponse.json({ error: "Subject and body are required" }, { status: 400 })
    }

    const analysis = await predictEmailPerformance({
      subject,
      body,
      prospectData,
      historicalData,
    })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("[builtbycashe] Email performance prediction error:", error)
    return NextResponse.json({ error: "Failed to predict email performance" }, { status: 500 })
  }
}
