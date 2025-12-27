// app/api/sending-accounts/custom/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { customSmtpImap } from "@/lib/services/email/custom-smtp-imap"
import { db } from "@/lib/db"
import { encrypt } from "@/lib/encryption"
import { z } from "zod"

const customSmtpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  // SMTP settings
  smtpHost: z.string().min(1, "SMTP host is required"),
  smtpPort: z.number().int().min(1).max(65535),
  smtpSecure: z.boolean(),
  smtpUsername: z.string().min(1, "SMTP username is required"),
  smtpPassword: z.string().min(1, "SMTP password is required"),
  // IMAP settings
  imapHost: z.string().min(1, "IMAP host is required"),
  imapPort: z.number().int().min(1).max(65535),
  imapUsername: z.string().min(1, "IMAP username is required"),
  imapPassword: z.string().min(1, "IMAP password is required"),
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input
    const validationResult = customSmtpSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Find user in database
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Validate SMTP/IMAP credentials
    const credentials = {
      email: data.email,
      smtpHost: data.smtpHost,
      smtpPort: data.smtpPort,
      smtpSecure: data.smtpSecure,
      smtpUsername: data.smtpUsername,
      smtpPassword: data.smtpPassword,
      imapHost: data.imapHost,
      imapPort: data.imapPort,
      imapUsername: data.imapUsername,
      imapPassword: data.imapPassword,
    }

    const validationTest = await customSmtpImap.validateCredentials(credentials)

    if (!validationTest.healthy) {
      return NextResponse.json(
        {
          error: "Connection validation failed",
          details: {
            smtp: validationTest.smtp,
            imap: validationTest.imap,
            message: validationTest.error,
          },
        },
        { status: 400 }
      )
    }

    // Encrypt credentials
    const encryptedCredentials = encrypt({
      provider: 'custom',
      connectionType: 'smtp_imap',
      smtpHost: data.smtpHost,
      smtpPort: data.smtpPort,
      smtpSecure: data.smtpSecure,
      smtpUsername: data.smtpUsername,
      smtpPassword: data.smtpPassword,
      imapHost: data.imapHost,
      imapPort: data.imapPort,
      imapUsername: data.imapUsername,
      imapPassword: data.imapPassword,
    })

    // Check if account already exists
    const existing = await db.sendingAccount.findUnique({
      where: {
        userId_email: {
          userId: user.id,
          email: data.email,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      )
    }

    // Create sending account
    const sendingAccount = await db.sendingAccount.create({
      data: {
        userId: user.id,
        name: data.name,
        email: data.email,
        provider: "custom",
        credentials: encryptedCredentials,
        dailyLimit: 100, // Conservative default for custom SMTP
        hourlyLimit: 10,
        isActive: true,
        healthScore: 100,
        warmupEnabled: true,
        warmupStage: 'NEW',
        warmupDailyLimit: 20,
      },
    })

    // Log successful connection
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'sending_account.connected',
        entityType: 'sending_account',
        entityId: sendingAccount.id,
        metadata: {
          provider: 'custom',
          email: data.email,
          connectionType: 'smtp_imap',
          smtpHost: data.smtpHost,
          imapHost: data.imapHost,
          smtpVerified: validationTest.smtp,
          imapVerified: validationTest.imap,
        },
      },
    })

    return NextResponse.json({
      success: true,
      account: {
        id: sendingAccount.id,
        name: sendingAccount.name,
        email: sendingAccount.email,
        provider: sendingAccount.provider,
        isActive: sendingAccount.isActive,
        healthScore: sendingAccount.healthScore,
      },
    })
  } catch (error) {
    console.error("[API] Custom SMTP/IMAP connection error:", error)
    return NextResponse.json(
      { error: "Failed to connect custom SMTP/IMAP account" },
      { status: 500 }
    )
  }
}

// GET endpoint to detect provider settings
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Try to detect provider settings
    const detectedSettings = customSmtpImap.detectProviderSettings(email)

    if (detectedSettings) {
      return NextResponse.json({
        detected: true,
        settings: detectedSettings,
      })
    }

    // Return common transactional providers as suggestions
    const transactionalProviders = customSmtpImap.getTransactionalProviders()

    return NextResponse.json({
      detected: false,
      suggestions: transactionalProviders,
    })
  } catch (error) {
    console.error("[API] Provider detection error:", error)
    return NextResponse.json(
      { error: "Failed to detect provider settings" },
      { status: 500 }
    )
  }
}