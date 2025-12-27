// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"
// import { encryptPassword } from "@/lib/encryption"

// export async function POST(request: NextRequest) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const formData = await request.formData()
//     const file = formData.get("file") as File

//     if (!file || !file.name.endsWith(".csv")) {
//       return NextResponse.json({ error: "Invalid CSV file" }, { status: 400 })
//     }

//     const text = await file.text()
//     const lines = text.split("\n").filter((line) => line.trim())

//     // Skip header line
//     const dataLines = lines.slice(1)

//     let imported = 0
//     const errors: string[] = []

//     for (const line of dataLines) {
//       const [
//         accountName,
//         email,
//         provider,
//         smtpHost,
//         smtpPort,
//         smtpUsername,
//         smtpPassword,
//         imapHost,
//         imapPort,
//         imapUsername,
//         imapPassword,
//       ] = line.split(",").map((field) => field.trim())

//       if (!email || !smtpHost || !smtpPassword) {
//         errors.push(`Skipped invalid row: ${email || "unknown"}`)
//         continue
//       }

//       try {
//         // Encrypt passwords
//         const encryptedSmtpPassword = encryptPassword(smtpPassword)
//         const encryptedImapPassword = imapPassword ? encryptPassword(imapPassword) : encryptedSmtpPassword

//         await prisma.sendingAccount.create({
//           data: {
//             userId,
//             name: accountName || email,
//             email,
//             provider: (provider?.toLowerCase() as any) || "smtp",
//             connectionMethod: "manual_imap_smtp",
//             smtpHost,
//             smtpPort: Number.parseInt(smtpPort) || 587,
//             smtpUsername: smtpUsername || email,
//             smtpPassword: encryptedSmtpPassword,
//             smtpSecure: Number.parseInt(smtpPort) === 465,
//             imapHost: imapHost || smtpHost,
//             imapPort: Number.parseInt(imapPort) || 993,
//             imapUsername: imapUsername || email,
//             imapPassword: encryptedImapPassword,
//             imapTls: true,
//             isActive: true,
//           },
//         })
//         imported++
//       } catch (error) {
//         console.error(`[v0] Failed to import account ${email}:`, error)
//         errors.push(`Failed to import: ${email}`)
//       }
//     }

//     console.log("[v0] Bulk import completed:", { imported, errors: errors.length })

//     return NextResponse.json({
//       imported,
//       failed: errors.length,
//       errors: errors.slice(0, 5), // Return first 5 errors
//     })
//   } catch (error) {
//     console.error("[v0] Bulk import error:", error)
//     return NextResponse.json({ error: "Failed to import accounts" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { encryptPassword } from "@/lib/encryption"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file || !file.name.endsWith(".csv")) {
      return NextResponse.json({ error: "Invalid CSV file" }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split("\n").filter((line) => line.trim())

    // Skip header line
    const dataLines = lines.slice(1)

    let imported = 0
    const errors: string[] = []

    for (const line of dataLines) {
      const [
        accountName,
        email,
        provider,
        smtpHost,
        smtpPort,
        smtpUsername,
        smtpPassword,
        imapHost,
        imapPort,
        imapUsername,
        imapPassword,
      ] = line.split(",").map((field) => field.trim())

      if (!email || !smtpHost || !smtpPassword) {
        errors.push(`Skipped invalid row: ${email || "unknown"}`)
        continue
      }

      try {
        // Encrypt passwords
        const encryptedSmtpPassword = encryptPassword(smtpPassword)
        const encryptedImapPassword = imapPassword ? encryptPassword(imapPassword) : encryptedSmtpPassword

        await prisma.sendingAccount.create({
          data: {
            userId,
            name: accountName || email,
            email,
            provider: (provider?.toLowerCase() as any) || "smtp",
            connectionMethod: "manual_imap_smtp",
            credentials: {}, // Add required credentials field
            smtpHost,
            smtpPort: Number.parseInt(smtpPort) || 587,
            smtpUsername: smtpUsername || email,
            smtpPassword: encryptedSmtpPassword,
            smtpSecure: Number.parseInt(smtpPort) === 465,
            imapHost: imapHost || smtpHost,
            imapPort: Number.parseInt(imapPort) || 993,
            imapUsername: imapUsername || email,
            imapPassword: encryptedImapPassword,
            imapTls: true,
            isActive: true,
          },
        })
        imported++
      } catch (error) {
        console.error(`[v0] Failed to import account ${email}:`, error)
        errors.push(`Failed to import: ${email}`)
      }
    }

    console.log("[v0] Bulk import completed:", { imported, errors: errors.length })

    return NextResponse.json({
      imported,
      failed: errors.length,
      errors: errors.slice(0, 5), // Return first 5 errors
    })
  } catch (error) {
    console.error("[v0] Bulk import error:", error)
    return NextResponse.json({ error: "Failed to import accounts" }, { status: 500 })
  }
}