// import { NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"

// export async function GET() {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
//     }

//     const user = await db.user.findUnique({ where: { clerkId: userId } })
//     if (!user) {
//       return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
//     }

//     const domains = await db.domain.findMany({
//       where: { userId: user.id },
//       include: {
//         deliverabilityHealth: true,
//         sendingAccounts: true,
//       },
//       orderBy: { createdAt: "desc" },
//     })

//     // Map to simpler format for frontend
//     const mapped = domains.map((domain) => ({
//       id: domain.id,
//       domain: domain.domain,
//       isVerified: domain.isVerified,
//       spfStatus: domain.deliverabilityHealth?.spfStatus || null,
//       dkimStatus: domain.deliverabilityHealth?.dkimStatus || null,
//       dmarcStatus: domain.deliverabilityHealth?.dmarcStatus || null,
//       mxStatus: domain.deliverabilityHealth?.mxStatus || null,
//       healthScore: domain.healthScore || 0,
//       dnsRecords: domain.dnsRecords,
//       accountsCount: domain.sendingAccounts.length,
//     }))

//     return NextResponse.json({ success: true, domains: mapped })
//   } catch (error) {
//     console.error("Failed to fetch domains:", error)
//     return NextResponse.json({ success: false, error: "Failed to fetch domains" }, { status: 500 })
//   }
// }

// import { NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"

// export async function GET() {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
//     }

//     const user = await db.user.findUnique({ where: { clerkId: userId } })
//     if (!user) {
//       return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
//     }

//     const domains = await db.domain.findMany({
//       where: { userId: user.id },
//       include: {
//         deliverabilityHealth: true,
//         sendingAccounts: true,
//       },
//       orderBy: { createdAt: "desc" },
//     })

//     // Map to simpler format for frontend
//     const mapped = domains.map((domain) => ({
//       id: domain.id,
//       domain: domain.domain,
//       isVerified: domain.isVerified,
//       spfStatus: domain.deliverabilityHealth?.spfStatus || null,
//       dkimStatus: domain.deliverabilityHealth?.dkimStatus || null,
//       dmarcStatus: domain.deliverabilityHealth?.dmarcStatus || null,
//       mxRecordsValid: domain.deliverabilityHealth?.mxRecordsValid || false,
//       healthScore: domain.healthScore || 0,
//       dnsRecords: domain.dnsRecords,
//       accountsCount: domain.sendingAccounts.length,
//     }))

//     return NextResponse.json({ success: true, domains: mapped })
//   } catch (error) {
//     console.error("Failed to fetch domains:", error)
//     return NextResponse.json({ success: false, error: "Failed to fetch domains" }, { status: 500 })
//   }
// }
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const domains = await db.domain.findMany({
      where: { userId: user.id },
      include: {
        deliverabilityHealth: true,
        sendingAccounts: true,
      },
      orderBy: { createdAt: "desc" },
    })

    const mapped = domains.map((domain) => {
      const health = domain.deliverabilityHealth

      // Build dnsRecords object that matches what the frontend expects
      const dnsRecords = {
        spf: {
          valid: health?.spfValid ?? false,
          status: health?.spfStatus || "UNKNOWN",
        },
        dkim: {
          valid: health?.dkimValid ?? false,
          status: health?.dkimStatus || "UNKNOWN",
        },
        dmarc: {
          valid: health?.dmarcValid ?? false,
          status: health?.dmarcStatus || "UNKNOWN",
          policy: health?.dmarcPolicy || null,
        },
        mx: {
          found: health?.mxRecordsValid ?? false,
        },
      }

      return {
        id: domain.id,
        domain: domain.domain,
        isVerified: domain.isVerified,
        healthScore: domain.healthScore || 0,
        dnsRecords,
        createdAt: domain.createdAt.toISOString(),
        accountsCount: domain.sendingAccounts.length,
      }
    })

    return NextResponse.json({ success: true, domains: mapped })
  } catch (error) {
    console.error("Failed to fetch domains:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch domains" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { domain: domainName } = body

    if (!domainName || typeof domainName !== "string") {
      return NextResponse.json({ success: false, error: "Domain name is required" }, { status: 400 })
    }

    // Clean and validate domain
    const cleanDomain = domainName
      .trim()
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, "")
      .split("/")[0]

    // Check if domain already exists for this user
    const existing = await db.domain.findFirst({
      where: {
        userId: user.id,
        domain: cleanDomain,
      },
    })

    if (existing) {
      return NextResponse.json({ success: false, error: "Domain already exists" }, { status: 400 })
    }

    // Create the domain
    const domain = await db.domain.create({
      data: {
        userId: user.id,
        domain: cleanDomain,
        isVerified: false,
        healthScore: 0,
      },
    })

    // Create initial deliverability health record
    await db.deliverabilityHealth.create({
      data: {
        domainId: domain.id,
        spfValid: false,
        dkimValid: false,
        dmarcValid: false,
        mxRecordsValid: false,
        hasIssues: true,
        alertLevel: "WARNING",
        alertMessage: "DNS configuration incomplete",
      },
    })

    return NextResponse.json({
      success: true,
      domain: {
        id: domain.id,
        domain: domain.domain,
        isVerified: domain.isVerified,
        healthScore: domain.healthScore,
        dnsRecords: {
          spf: { valid: false, status: "UNKNOWN" },
          dkim: { valid: false, status: "UNKNOWN" },
          dmarc: { valid: false, status: "UNKNOWN" },
          mx: { found: false },
        },
        createdAt: domain.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Failed to create domain:", error)
    return NextResponse.json({ success: false, error: "Failed to create domain" }, { status: 500 })
  }
}
