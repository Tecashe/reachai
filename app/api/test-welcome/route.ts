
import { NextResponse } from "next/server"
import { resend, FROM_EMAIL } from "@/lib/resend"
import { env } from "@/lib/env"

export async function GET(req: Request) {
    let email = "test@example.com"
    let name = "Test User"

    try {
        const { searchParams } = new URL(req.url)
        email = searchParams.get("email") || email
        name = searchParams.get("name") || name

        // Diagnostics
        const apiKey = env.RESEND_API_KEY
        const hasApiKey = !!apiKey
        const maskedKey = apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : "MISSING"

        console.log("Testing Welcome Email:")
        console.log(`- TO: ${email}`)
        console.log(`- FROM: ${FROM_EMAIL}`)
        console.log(`- API KEY PRESENT: ${hasApiKey}`)
        console.log(`- MASKED KEY: ${maskedKey}`)

        if (!hasApiKey) {
            return NextResponse.json({
                success: false,
                error: "RESEND_API_KEY is missing directly in env. Please check your .env file."
            }, { status: 500 })
        }

        const data = await resend.sendWelcomeEmail(email, name)

        console.log("Email sent successfully:", data)

        return NextResponse.json({
            success: true,
            data,
            diagnostics: {
                from: FROM_EMAIL,
                to: email,
                apiKeyPresent: hasApiKey,
                maskedKey
            }
        })
    } catch (error) {
        console.error("Test email failed:", error)
        return NextResponse.json(
            {
                success: false,
                error: (error as Error).message,
                stack: (error as Error).stack,
                diagnostics: {
                    from: FROM_EMAIL,
                    to: email,
                }
            },
            { status: 500 }
        )
    }
}
