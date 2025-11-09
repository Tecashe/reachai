// import { NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"

// export async function GET() {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const user = await db.user.findUnique({ where: { clerkId: userId } })
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     // Get suppressed emails (prospects with unsubscribed or bounced status)
//     const suppressedProspects = await db.prospect.findMany({
//       where: {
//         userId: user.id,
//         OR: [{ status: "UNSUBSCRIBED" }, { status: "BOUNCED" }, { status: "SPAM_COMPLAINT" }],
//       },
//       select: {
//         email: true,
//         status: true,
//         updatedAt: true,
//       },
//       orderBy: { updatedAt: "desc" },
//     })

//     const suppressedEmails = suppressedProspects.map((p) => ({
//       email: p.email,
//       reason: p.status === "UNSUBSCRIBED" ? "Unsubscribed" : p.status === "BOUNCED" ? "Bounced" : "Spam Complaint",
//       date: p.updatedAt.toISOString().split("T")[0],
//     }))

//     return NextResponse.json({ success: true, suppressedEmails })
//   } catch (error) {
//     console.error("Error loading suppression list:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const suppressedProspects = await db.prospect.findMany({
      where: {
        userId: user.id,
        OR: [{ status: "UNSUBSCRIBED" }, { status: "BOUNCED" }, { bounced: true }, { unsubscribed: true }],
      },
      select: {
        email: true,
        status: true,
        bounced: true,
        unsubscribed: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    })

    const suppressedEmails = suppressedProspects.map((p) => ({
      email: p.email,
      reason: p.unsubscribed ? "Unsubscribed" : p.bounced ? "Bounced" : "Other",
      date: p.updatedAt.toISOString().split("T")[0],
    }))

    return NextResponse.json({ success: true, suppressedEmails })
  } catch (error) {
    console.error("Error loading suppression list:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
