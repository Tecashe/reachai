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

    // Map to simpler format for frontend
    const mapped = domains.map((domain) => ({
      id: domain.id,
      domain: domain.domain,
      isVerified: domain.isVerified,
      spfStatus: domain.deliverabilityHealth?.spfStatus || null,
      dkimStatus: domain.deliverabilityHealth?.dkimStatus || null,
      dmarcStatus: domain.deliverabilityHealth?.dmarcStatus || null,
      mxRecordsValid: domain.deliverabilityHealth?.mxRecordsValid || false,
      healthScore: domain.healthScore || 0,
      dnsRecords: domain.dnsRecords,
      accountsCount: domain.sendingAccounts.length,
    }))

    return NextResponse.json({ success: true, domains: mapped })
  } catch (error) {
    console.error("Failed to fetch domains:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch domains" }, { status: 500 })
  }
}
