import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

interface Contact {
  id: string
  email: string | null
  firstName: string | null
  lastName: string | null
  company: string | null
  phone: string | null
  title: string | null
  quality: "high" | "medium" | "low"
  missingFields: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { contacts } = await request.json()

    if (!contacts || !Array.isArray(contacts)) {
      return NextResponse.json({ error: "Invalid contacts data" }, { status: 400 })
    }

    // Process contacts in batches for AI quality check
    const enhancedContacts: Contact[] = []

    for (const contact of contacts) {
      let quality: "high" | "medium" | "low" = "high"
      const missingFields: string[] = []
      let aiScore = 100

      // Basic field checks
      if (!contact.email || contact.email.trim() === "") {
        missingFields.push("email")
        aiScore -= 50 // Email is critical
      } else {
        // Check email quality with AI heuristics
        const emailDomain = contact.email.split("@")[1]?.toLowerCase()
        const genericDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com"]

        if (genericDomains.includes(emailDomain)) {
          aiScore -= 10 // Personal email, less valuable for B2B
        }

        // Check for disposable email patterns
        if (emailDomain?.includes("temp") || emailDomain?.includes("disposable")) {
          aiScore -= 30
        }
      }

      if (!contact.firstName && !contact.lastName) {
        missingFields.push("name")
        aiScore -= 20
      }

      if (!contact.company) {
        missingFields.push("company")
        aiScore -= 15
      }

      if (!contact.title) {
        missingFields.push("title")
        aiScore -= 10
      }

      if (!contact.phone) {
        missingFields.push("phone")
        aiScore -= 5
      }

      // Check for B2B relevance based on title
      if (contact.title) {
        const highValueTitles = ["ceo", "cto", "cfo", "founder", "director", "vp", "head", "manager", "owner"]
        const titleLower = contact.title.toLowerCase()
        const hasHighValueTitle = highValueTitles.some((t) => titleLower.includes(t))

        if (hasHighValueTitle) {
          aiScore += 15 // Bonus for decision makers
        }
      }

      // Determine quality tier
      if (aiScore >= 70) {
        quality = "high"
      } else if (aiScore >= 40) {
        quality = "medium"
      } else {
        quality = "low"
      }

      // Override to low if no email (cannot contact)
      if (!contact.email) {
        quality = "low"
      }

      enhancedContacts.push({
        ...contact,
        quality,
        missingFields,
      })
    }

    // Calculate summary
    const summary = {
      total: enhancedContacts.length,
      high: enhancedContacts.filter((c) => c.quality === "high").length,
      medium: enhancedContacts.filter((c) => c.quality === "medium").length,
      low: enhancedContacts.filter((c) => c.quality === "low").length,
    }

    return NextResponse.json({
      contacts: enhancedContacts,
      summary,
    })
  } catch (error: any) {
    console.error("[AI Quality Check] Error:", error)
    return NextResponse.json({ error: error.message || "AI quality check failed" }, { status: 500 })
  }
}
