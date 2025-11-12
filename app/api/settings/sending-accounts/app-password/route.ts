import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { encrypt } from "@/lib/encryption"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { name, email, appPassword, provider } = body

    if (!name || !email || !appPassword || !provider) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Remove spaces from app password
    const cleanPassword = appPassword.replace(/\s/g, "")

    // Encrypt credentials
    const credentials = {
      smtpHost: provider === "gmail" ? "smtp.gmail.com" : "smtp-mail.outlook.com",
      smtpPort: 587,
      smtpUser: email,
      smtpPassword: encrypt(cleanPassword),
      imapHost: provider === "gmail" ? "imap.gmail.com" : "outlook.office365.com",
      imapPort: 993,
      imapUser: email,
      imapPassword: encrypt(cleanPassword),
      authMethod: "app-password",
    }

    const account = await db.sendingAccount.create({
      data: {
        userId: user.id,
        name,
        email,
        provider,
        credentials,
        dailyLimit: 50,
        hourlyLimit: 10,
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, accountId: account.id })
  } catch (error) {
    console.error("[v0] App password connection error:", error)
    return NextResponse.json({ error: "Failed to connect account" }, { status: 500 })
  }
}
