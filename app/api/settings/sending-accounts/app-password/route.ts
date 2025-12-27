// import { NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { encrypt } from "@/lib/encryption"

// export async function POST(request: Request) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const user = await db.user.findUnique({ where: { clerkId: userId } })
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     const body = await request.json()
//     const { name, email, appPassword, provider } = body

//     if (!name || !email || !appPassword || !provider) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
//     }

//     // Remove spaces from app password
//     const cleanPassword = appPassword.replace(/\s/g, "")

//     // Encrypt credentials
//     const credentials = {
//       smtpHost: provider === "gmail" ? "smtp.gmail.com" : "smtp-mail.outlook.com",
//       smtpPort: 587,
//       smtpUser: email,
//       smtpPassword: encrypt(cleanPassword),
//       imapHost: provider === "gmail" ? "imap.gmail.com" : "outlook.office365.com",
//       imapPort: 993,
//       imapUser: email,
//       imapPassword: encrypt(cleanPassword),
//       authMethod: "app-password",
//     }

//     const account = await db.sendingAccount.create({
//       data: {
//         userId: user.id,
//         name,
//         email,
//         provider,
//         credentials,
//         dailyLimit: 50,
//         hourlyLimit: 10,
//         isActive: true,
//       },
//     })

//     return NextResponse.json({ success: true, accountId: account.id })
//   } catch (error) {
//     console.error("[v0] App password connection error:", error)
//     return NextResponse.json({ error: "Failed to connect account" }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { encryptPassword } from "@/lib/encryption"
import { emailConnectionService } from "@/lib/email-connection/smtp-imap-service"
import { getAutoConfigForEmail } from "@/lib/email-connection/provider-configs"

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

    if (!name || !email || !appPassword || provider !== "gmail") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get Gmail provider config (always use Gmail settings for app password)
    const autoConfig = getAutoConfigForEmail(email)
    if (!autoConfig) {
      return NextResponse.json({ error: "Unsupported email provider" }, { status: 400 })
    }

    // Clean password (remove spaces from app passwords)
    const cleanPassword = appPassword.replace(/\s/g, "")
    if (cleanPassword.length !== 16) {
      return NextResponse.json({ error: "App password must be 16 characters" }, { status: 400 })
    }

    // Test SMTP connection
    const smtpTest = await emailConnectionService.testSMTPConnection({
      host: autoConfig.smtp.host,
      port: autoConfig.smtp.port,
      secure: autoConfig.smtp.secure,
      username: email,
      password: cleanPassword,
    })

    if (!smtpTest.success) {
      return NextResponse.json({ error: `SMTP test failed: ${smtpTest.error}` }, { status: 400 })
    }

    // Test IMAP connection
    const imapTest = await emailConnectionService.testIMAPConnection({
      host: autoConfig.imap.host,
      port: autoConfig.imap.port,
      tls: autoConfig.imap.tls,
      username: email,
      password: cleanPassword,
    })

    if (!imapTest.success) {
      return NextResponse.json({ error: `IMAP test failed: ${imapTest.error}` }, { status: 400 })
    }

    // Create or update sending account
    const account = await db.sendingAccount.upsert({
      where: {
        userId_email: {
          userId: user.id,
          email: email,
        },
      },
      create: {
        userId: user.id,
        name,
        email,
        provider: "gmail",
        connectionMethod: "app_password",
        credentials: {}, // Add required credentials field
        smtpHost: autoConfig.smtp.host,
        smtpPort: autoConfig.smtp.port,
        smtpSecure: autoConfig.smtp.secure,
        smtpUsername: email,
        smtpPassword: encryptPassword(cleanPassword),
        imapHost: autoConfig.imap.host,
        imapPort: autoConfig.imap.port,
        imapTls: autoConfig.imap.tls,
        imapUsername: email,
        imapPassword: encryptPassword(cleanPassword),
        dailyLimit: 500,
        hourlyLimit: 50,
        isActive: true,
      },
      update: {
        name,
        credentials: {}, // Add required credentials field
        smtpPassword: encryptPassword(cleanPassword),
        imapPassword: encryptPassword(cleanPassword),
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, accountId: account.id })
  } catch (error) {
    console.error("[v0] App password connection error:", error)
    return NextResponse.json({ error: "Failed to connect account" }, { status: 500 })
  }
}