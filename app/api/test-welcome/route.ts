
import { NextResponse } from "next/server"
import { resend } from "@/lib/resend"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const email = searchParams.get("email") || "test@example.com"
        const name = searchParams.get("name") || "Test User"

        const data = await resend.sendWelcomeEmail(email, name)

        return NextResponse.json({ success: true, data })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        )
    }
}
