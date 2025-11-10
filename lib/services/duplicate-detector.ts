"use server"

import { db } from "@/lib/db"

interface DuplicateGroup {
  prospects: any[]
  score: number
  reason: string
}

export async function findDuplicates(userId: string): Promise<DuplicateGroup[]> {
  const prospects = await db.prospect.findMany({
    where: {
      campaign: {
        userId,
      },
      isTrashed: false,
    },
  })

  const duplicateGroups: DuplicateGroup[] = []
  const processed = new Set<string>()

  for (let i = 0; i < prospects.length; i++) {
    if (processed.has(prospects[i].id)) continue

    const duplicates = [prospects[i]]
    const mainEmail = prospects[i].email.toLowerCase().trim()

    for (let j = i + 1; j < prospects.length; j++) {
      if (processed.has(prospects[j].id)) continue

      const compareEmail = prospects[j].email.toLowerCase().trim()

      // Check for exact email match
      if (mainEmail === compareEmail) {
        duplicates.push(prospects[j])
        processed.add(prospects[j].id)
        continue
      }

      // Check for similar names and companies (fuzzy match)
      const nameMatch =
        prospects[i].firstName?.toLowerCase() === prospects[j].firstName?.toLowerCase() &&
        prospects[i].lastName?.toLowerCase() === prospects[j].lastName?.toLowerCase()

      const companyMatch = prospects[i].company?.toLowerCase() === prospects[j].company?.toLowerCase()

      if (nameMatch && companyMatch && prospects[i].company) {
        duplicates.push(prospects[j])
        processed.add(prospects[j].id)
      }
    }

    if (duplicates.length > 1) {
      duplicateGroups.push({
        prospects: duplicates,
        score: 100,
        reason: duplicates[0].email === duplicates[1].email ? "Exact email match" : "Same name and company",
      })
      processed.add(prospects[i].id)
    }
  }

  return duplicateGroups
}

export function selectBestProspect(prospects: any[]): any {
  // Score each prospect based on data completeness
  const scored = prospects.map((p) => {
    let score = 0
    if (p.firstName) score += 10
    if (p.lastName) score += 10
    if (p.company) score += 15
    if (p.jobTitle) score += 15
    if (p.linkedinUrl) score += 20
    if (p.websiteUrl) score += 10
    if (p.qualityScore > 70) score += 20

    // Prefer prospects with engagement
    if (p.emailsOpened > 0) score += 30
    if (p.emailsReplied > 0) score += 50

    return { prospect: p, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored[0].prospect
}
