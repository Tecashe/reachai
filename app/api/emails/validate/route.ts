import { type NextRequest, NextResponse } from "next/server"
import { protectApiRoute } from "@/lib/api-protection"
import { emailValidator } from "@/lib/services/email-validator"

export async function POST(request: NextRequest) {
  const { error, user } = await protectApiRoute()
  if (error) return error

  try {
    const body = await request.json()
    const { subject, body: emailBody, recipientEmail, recipientName, recipientCompany } = body

    if (!subject || !emailBody || !recipientEmail) {
      return NextResponse.json({ error: "Subject, body, and recipient email are required" }, { status: 400 })
    }

    const result = await emailValidator.validateEmail({
      subject,
      body: emailBody,
      recipientEmail,
      recipientName,
      recipientCompany,
      userId: user!.id,
    })

    return NextResponse.json({
      success: true,
      validation: result,
    })
  } catch (err) {
    console.error("[builtbycashe] Email validation error:", err)
    return NextResponse.json({ error: "Failed to validate email" }, { status: 500 })
  }
}
