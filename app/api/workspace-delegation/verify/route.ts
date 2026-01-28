// app/api/workspace-delegation/verify/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { serviceAccountAuth } from "@/lib/services/google/service-account-auth"
import { smtpService } from "@/lib/services/email/smtp-service"
import { db } from "@/lib/db" // Your Prisma client

/**
 * POST /api/workspace-delegation/verify
 * 
 * Verifies that domain-wide delegation is set up correctly
 * by testing authentication and optionally sending a test email
 * 
 * Request body:
 * {
 *   "email": "user@company.com",
 *   "sendTestEmail": true (optional)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Resolve internal user ID
    const user = await db.user.findUnique({
      where: { clerkId },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const userId = user.id

    const body = await request.json()
    const { email, sendTestEmail = false } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      )
    }

    // Validate email format
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    console.log(`[Verification] Testing domain-wide delegation for: ${email}`)

    // Extract domain from email
    const domain = email.split('@')[1]

    // Step 1: Test service account authentication
    try {
      await serviceAccountAuth.verifyDelegation(email)
    } catch (error) {
      console.error("[Verification] Authentication test failed:", error)

      return NextResponse.json(
        {
          success: false,
          error: "Domain-wide delegation not authorized",
          details: error instanceof Error ? error.message : "Unknown error",
          instructions: "Please ensure your Google Workspace admin has authorized our service account"
        },
        { status: 403 }
      )
    }

    // Step 2: Test SMTP connection
    try {
      await smtpService.testConnection(email)
    } catch (error) {
      console.error("[Verification] SMTP connection test failed:", error)

      return NextResponse.json(
        {
          success: false,
          error: "SMTP connection failed",
          details: error instanceof Error ? error.message : "Unknown error"
        },
        { status: 500 }
      )
    }

    // Step 3: Optionally send a test email
    if (sendTestEmail) {
      try {
        const result = await smtpService.sendTestEmail(email, email)

        if (!result.success) {
          return NextResponse.json(
            {
              success: false,
              error: "Test email failed to send",
              details: result.error
            },
            { status: 500 }
          )
        }
      } catch (error) {
        console.error("[Verification] Test email send failed:", error)

        return NextResponse.json(
          {
            success: false,
            error: "Failed to send test email",
            details: error instanceof Error ? error.message : "Unknown error"
          },
          { status: 500 }
        )
      }
    }

    // Step 4: Save workspace delegation record to database
    try {
      await db.workspaceDelegation.upsert({
        where: { domain },
        create: {
          userId,
          domain,
          status: 'verified',
          verificationMethod: sendTestEmail ? 'auto_test' : 'manual_test',
          serviceAccountEmail: serviceAccountAuth.getServiceAccountEmail(),
          serviceAccountClientId: serviceAccountAuth.getClientId(),
          authorizedScopes: ['https://mail.google.com/'],
          lastVerifiedAt: new Date(),
          lastVerifiedBy: email,
          verificationResult: 'Successfully verified domain-wide delegation',
          healthStatus: 'healthy',
        },
        update: {
          status: 'verified',
          verificationMethod: sendTestEmail ? 'auto_test' : 'manual_test',
          lastVerifiedAt: new Date(),
          lastVerifiedBy: email,
          verificationResult: 'Successfully verified domain-wide delegation',
          healthStatus: 'healthy',
        },
      })

      // Also create/update the email account record
      await db.sendingAccount.upsert({
        where: {
          userId_email: {
            userId,
            email,
          },
        },
        create: {
          userId,
          email,
          name: email, // Required field
          provider: 'google', // Required field
          connectionType: 'workspace-delegation',
          connectionMethod: 'workspace-delegation',
          workspaceDomain: domain,
          delegationStatus: 'verified',
          lastVerifiedAt: new Date(),
          isActive: true,
          credentials: {}, // Required field
        },
        update: {
          delegationStatus: 'verified',
          lastVerifiedAt: new Date(),
          isActive: true,
          // errorCount: 0, // Reset error count on successful verification
          // lastError: null,
        },
      })

      console.log(`[Verification] ✅ Successfully verified delegation for: ${email}`)

      return NextResponse.json({
        success: true,
        message: "Domain-wide delegation verified successfully",
        email,
        domain,
        testEmailSent: sendTestEmail,
      })
    } catch (dbError) {
      console.error("[Verification] Database error:", dbError)

      // Still return success since verification worked, but note the DB error
      return NextResponse.json({
        success: true,
        message: "Verification successful but failed to save to database",
        email,
        domain,
        testEmailSent: sendTestEmail,
        warning: "Please contact support if this persists"
      })
    }
  } catch (error) {
    console.error("[Verification API] Unexpected error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Verification failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

