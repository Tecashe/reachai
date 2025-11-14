import { NextResponse } from "next/server"
import { resend, FROM_EMAIL } from "@/lib/resend"

export async function POST(request: Request) {
  try {
    const { to } = await request.json()

    if (!to) {
      return NextResponse.json({ error: "Email address required" }, { status: 400 })
    }

    console.log("[builtbycashe] Testing email send to:", to)
    console.log("[builtbycashe] From:", FROM_EMAIL)
    console.log("[builtbycashe] Resend API Key exists:", !!process.env.RESEND_API_KEY)

    const result = await resend.send({
      to,
      subject: "Test Email from mailfra",
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from mailfra to verify email sending is working correctly.</p>
        <p>If you received this, your email configuration is working!</p>
      `,
    })

    console.log("[builtbycashe] Email sent successfully:", result)

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      result,
    })
  } catch (error) {
    console.error("[builtbycashe] Error sending test email:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send test email",
        details: error,
      },
      { status: 500 },
    )
  }
}
