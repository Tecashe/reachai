
"use server"

import { db } from "@/lib/db"
import { getCurrentUserFromDb } from "@/lib/auth"

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





export async function mergeDuplicates(
  keepId: string,
  deleteIds: string[],
): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUserFromDb()
  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    // Verify all prospects belong to user
    const prospects = await db.prospect.findMany({
      where: {
        id: { in: [keepId, ...deleteIds] },
        userId: user.id,
      },
    })

    if (prospects.length !== deleteIds.length + 1) {
      return { success: false, error: "Some prospects not found" }
    }

    // Delete the duplicate prospects
    await db.prospectInFolder.deleteMany({
      where: { prospectId: { in: deleteIds } },
    })

    await db.prospect.deleteMany({
      where: {
        id: { in: deleteIds },
        userId: user.id,
      },
    })

    // Update folder counts
    const deletedProspects = prospects.filter((p) => deleteIds.includes(p.id))
    const folderCounts = new Map<string, number>()

    for (const prospect of deletedProspects) {
      if (prospect.folderId) {
        folderCounts.set(prospect.folderId, (folderCounts.get(prospect.folderId) || 0) + 1)
      }
    }

    for (const [folderId, count] of folderCounts) {
      await db.prospectFolder.update({
        where: { id: folderId },
        data: { prospectCount: { decrement: count } },
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to merge duplicates:", error)
    return { success: false, error: "Failed to merge duplicates" }
  }
}









