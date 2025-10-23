import { type NextRequest, NextResponse } from "next/server"
import { protectApiRoute } from "@/lib/api-protection"
import { updateOnboardingStep } from "@/lib/actions/onboarding"

export async function POST(request: NextRequest) {
  const { error } = await protectApiRoute()
  if (error) return error

  try {
    const { step } = await request.json()

    if (!step) {
      return NextResponse.json({ error: "Step is required" }, { status: 400 })
    }

    const result = await updateOnboardingStep(step)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Failed to update onboarding step" }, { status: 500 })
  }
}
