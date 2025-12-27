import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { encryptPassword } from "@/lib/encryption"
import { emailConnectionService } from "@/lib/email-connection/smtp-imap-service"

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
    const {
      name,
      email,
      provider,
      smtpHost,
      smtpPort,
      smtpSecure,
      smtpUsername,
      smtpPassword,
      imapHost,
      imapPort,
      imapTls,
      imapUsername,
      imapPassword,
    } = body

    if (!name || !email || !smtpHost || !smtpPort || !imapHost || !imapPort || !smtpPassword || !imapPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Test SMTP connection
    const smtpTest = await emailConnectionService.testSMTPConnection({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure || false,
      username: smtpUsername || email,
      password: smtpPassword,
    })

    if (!smtpTest.success) {
      return NextResponse.json({ error: `SMTP test failed: ${smtpTest.error}` }, { status: 400 })
    }

    // Test IMAP connection
    const imapTest = await emailConnectionService.testIMAPConnection({
      host: imapHost,
      port: imapPort,
      tls: imapTls || false,
      username: imapUsername || email,
      password: imapPassword,
    })

    if (!imapTest.success) {
      return NextResponse.json({ error: `IMAP test failed: ${imapTest.error}` }, { status: 400 })
    }

    // Create or update account
    const account = await db.sendingAccount.upsert({
      where: {
        userId_email: {
          userId: user.id,
          email,
        },
      },
      create: {
        userId: user.id,
        name,
        email,
        provider: provider || "custom",
        connectionMethod: "manual_imap_smtp",
        credentials: {}, // Add required credentials field
        smtpHost,
        smtpPort,
        smtpSecure: smtpSecure || false,
        smtpUsername: smtpUsername || email,
        smtpPassword: encryptPassword(smtpPassword),
        imapHost,
        imapPort,
        imapTls: imapTls || false,
        imapUsername: imapUsername || email,
        imapPassword: encryptPassword(imapPassword),
        dailyLimit: 300,
        hourlyLimit: 50,
        isActive: true,
      },
      update: {
        name,
        credentials: {}, // Add required credentials field
        smtpPassword: encryptPassword(smtpPassword),
        imapPassword: encryptPassword(imapPassword),
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, accountId: account.id })
  } catch (error) {
    console.error("[v0] Manual SMTP/IMAP connection error:", error)
    return NextResponse.json({ error: "Failed to connect account" }, { status: 500 })
  }
}