// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"

// export async function getFolders() {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const folders = await db.prospectFolder.findMany({
//     where: {
//       userId: user.id,
//       isTrashed: false,
//     },
//     orderBy: { createdAt: "asc" },
//     include: {
//       _count: {
//         select: {
//           directProspects: {
//             where: {
//               isTrashed: false,
//             },
//           },
//         },
//       },
//     },
//   })

//   return folders.map((folder) => ({
//     id: folder.id,
//     name: folder.name,
//     color: folder.color,
//     icon: folder.icon,
//     prospectCount: folder._count.directProspects,
//     createdAt: folder.createdAt,
//     updatedAt: folder.updatedAt,
//     userId: folder.userId,
//     isTrashed: folder.isTrashed,
//     trashedAt: folder.trashedAt,
//   }))
// }

// export async function createFolder(name: string, color?: string, icon?: string) {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) return { success: false, error: "User not found" }

//   try {
//     const folder = await db.prospectFolder.create({
//       data: {
//         userId: user.id,
//         name,
//         color: color || "#6366f1",
//         icon: icon || "folder",
//       },
//     })

//     revalidatePath("/dashboard/prospects")
//     return { success: true, folder }
//   } catch (error) {
//     console.error("Error creating folder:", error)
//     return { success: false, error: "Failed to create folder" }
//   }
// }

// export async function moveProspectsToFolder(prospectIds: string[], folderId: string | null) {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) return { success: false, error: "User not found" }

//   try {
//     await db.prospect.updateMany({
//       where: {
//         id: { in: prospectIds },
//         userId: user.id,
//       },
//       data: { folderId },
//     })

//     // Update folder prospect counts
//     if (folderId) {
//       const count = await db.prospect.count({
//         where: { folderId, isTrashed: false },
//       })
//       await db.prospectFolder.update({
//         where: { id: folderId },
//         data: { prospectCount: count },
//       })
//     }

//     revalidatePath("/dashboard/prospects")
//     return { success: true }
//   } catch (error) {
//     console.error("Error moving prospects:", error)
//     return { success: false, error: "Failed to move prospects" }
//   }
// }

// export async function deleteFolder(folderId: string) {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) return { success: false, error: "User not found" }

//   try {
//     // Move all prospects in folder to no folder
//     await db.prospect.updateMany({
//       where: { folderId },
//       data: { folderId: null },
//     })

//     await db.prospectFolder.delete({
//       where: { id: folderId, userId: user.id },
//     })

//     revalidatePath("/dashboard/prospects")
//     return { success: true }
//   } catch (error) {
//     console.error("Error deleting folder:", error)
//     return { success: false, error: "Failed to delete folder" }
//   }
// }

// export async function moveToTrash(prospectIds: string[]) {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) return { success: false, error: "User not found" }

//   try {
//     await db.prospect.updateMany({
//       where: {
//         id: { in: prospectIds },
//         userId: user.id,
//       },
//       data: {
//         isTrashed: true,
//         trashedAt: new Date(),
//       },
//     })

//     revalidatePath("/dashboard/prospects")
//     return { success: true }
//   } catch (error) {
//     console.error("Error moving to trash:", error)
//     return { success: false, error: "Failed to move to trash" }
//   }
// }

// export async function restoreFromTrash(prospectIds: string[]) {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) return { success: false, error: "User not found" }

//   try {
//     await db.prospect.updateMany({
//       where: {
//         id: { in: prospectIds },
//         userId: user.id,
//       },
//       data: {
//         isTrashed: false,
//         trashedAt: null,
//       },
//     })

//     revalidatePath("/dashboard/prospects")
//     return { success: true }
//   } catch (error) {
//     console.error("Error restoring from trash:", error)
//     return { success: false, error: "Failed to restore" }
//   }
// }

// export async function permanentlyDelete(prospectIds: string[]) {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) return { success: false, error: "User not found" }

//   try {
//     await db.prospect.deleteMany({
//       where: {
//         id: { in: prospectIds },
//         userId: user.id,
//         isTrashed: true,
//       },
//     })

//     revalidatePath("/dashboard/prospects")
//     return { success: true }
//   } catch (error) {
//     console.error("Error permanently deleting:", error)
//     return { success: false, error: "Failed to delete permanently" }
//   }
// }

// export async function getTrashedCount() {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const count = await db.prospect.count({
//     where: {
//       userId: user.id,
//       isTrashed: true,
//     },
//   })

//   return count
// }

// export async function checkDuplicatesBeforeMerge(folderIds: string[]) {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) return { success: false, error: "User not found" }

//   try {
//     const allProspects = await db.prospect.findMany({
//       where: {
//         folderId: { in: folderIds },
//         userId: user.id,
//         isTrashed: false,
//       },
//       select: {
//         id: true,
//         email: true,
//         firstName: true,
//         lastName: true,
//         company: true,
//         jobTitle: true,
//         qualityScore: true,
//         linkedinUrl: true,
//         emailsOpened: true,
//         emailsReplied: true,
//       },
//     })

//     console.log("[v0] Found prospects to check:", allProspects.length)

//     // Group by email to find duplicates
//     const emailGroups = new Map()

//     for (const prospect of allProspects) {
//       if (!emailGroups.has(prospect.email)) {
//         emailGroups.set(prospect.email, [])
//       }
//       emailGroups.get(prospect.email).push(prospect)
//     }

//     // Find groups with more than one prospect
//     const duplicateGroups: any[] = []
//     emailGroups.forEach((prospects, email) => {
//       if (prospects.length > 1) {
//         duplicateGroups.push({
//           email,
//           reason: `Multiple prospects found with email: ${email}`,
//           prospects,
//         })
//       }
//     })

//     return {
//       success: true,
//       hasDuplicates: duplicateGroups.length > 0,
//       duplicateGroups,
//       totalProspects: allProspects.length,
//     }
//   } catch (error) {
//     console.error("[v0] Error checking duplicates:", error)
//     return { success: false, error: "Failed to check duplicates" }
//   }
// }

// export async function mergeFolders(
//   folderIds: string[],
//   newName: string,
//   trashOptions: { source: boolean; target: boolean },
//   excludeProspectIds?: string[],
// ) {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) return { success: false, error: "User not found" }

//   try {
//     console.log("[v0] Merging folders:", folderIds)

//     const newFolder = await db.prospectFolder.create({
//       data: {
//         userId: user.id,
//         name: newName,
//         color: "#6366f1",
//         icon: "folder",
//       },
//     })

//     console.log("[v0] Created new folder:", newFolder.id)

//     const whereClause: any = {
//       folderId: { in: folderIds },
//       userId: user.id,
//       isTrashed: false,
//     }

//     if (excludeProspectIds && excludeProspectIds.length > 0) {
//       whereClause.id = { notIn: excludeProspectIds }
//     }

//     const prospectsToMove = await db.prospect.findMany({
//       where: whereClause,
//       select: { id: true },
//     })

//     console.log("[v0] Found prospects to move:", prospectsToMove.length)

//     const updateResult = await db.prospect.updateMany({
//       where: {
//         id: { in: prospectsToMove.map((p) => p.id) },
//         userId: user.id,
//       },
//       data: {
//         folderId: newFolder.id,
//       },
//     })

//     console.log("[v0] Moved", updateResult.count, "prospects to new folder")

//     if (excludeProspectIds && excludeProspectIds.length > 0) {
//       await db.prospect.updateMany({
//         where: {
//           id: { in: excludeProspectIds },
//           userId: user.id,
//         },
//         data: {
//           isTrashed: true,
//           trashedAt: new Date(),
//         },
//       })
//       console.log("[v0] Trashed", excludeProspectIds.length, "duplicate prospects")
//     }

//     if (trashOptions.source && folderIds[0]) {
//       await db.prospectFolder.update({
//         where: { id: folderIds[0] },
//         data: { isTrashed: true, trashedAt: new Date() },
//       })
//       console.log("[v0] Trashed source folder")
//     }

//     if (trashOptions.target && folderIds[1]) {
//       await db.prospectFolder.update({
//         where: { id: folderIds[1] },
//         data: { isTrashed: true, trashedAt: new Date() },
//       })
//       console.log("[v0] Trashed target folder")
//     }

//     revalidatePath("/dashboard/prospects")
//     return {
//       success: true,
//       folderId: newFolder.id,
//       duplicatesRemoved: excludeProspectIds?.length || 0,
//       prospectsAdded: updateResult.count,
//     }
//   } catch (error) {
//     console.error("[v0] Error merging folders:", error)
//     return { success: false, error: "Failed to merge folders" }
//   }
// }

// export async function updateFolder(folderId: string, name: string, color: string) {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) return { success: false, error: "User not found" }

//   try {
//     await db.prospectFolder.update({
//       where: {
//         id: folderId,
//         userId: user.id,
//       },
//       data: {
//         name,
//         color,
//       },
//     })

//     revalidatePath("/dashboard/prospects")
//     return { success: true }
//   } catch (error) {
//     console.error("Error updating folder:", error)
//     return { success: false, error: "Failed to update folder" }
//   }
// }

// export async function trashFolder(folderId: string) {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) return { success: false, error: "User not found" }

//   try {
//     console.log("[v0] Trashing folder:", folderId)

//     await db.prospectFolder.update({
//       where: {
//         id: folderId,
//         userId: user.id,
//       },
//       data: {
//         isTrashed: true,
//         trashedAt: new Date(),
//       },
//     })

//     console.log("[v0] Folder trashed successfully")

//     revalidatePath("/dashboard/prospects")
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error trashing folder:", error)
//     return { success: false, error: "Failed to trash folder" }
//   }
// }

// export async function restoreFolder(folderId: string) {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) return { success: false, error: "User not found" }

//   try {
//     await db.prospectFolder.update({
//       where: {
//         id: folderId,
//         userId: user.id,
//       },
//       data: {
//         isTrashed: false,
//         trashedAt: null,
//       },
//     })

//     revalidatePath("/dashboard/prospects")
//     return { success: true }
//   } catch (error) {
//     console.error("Error restoring folder:", error)
//     return { success: false, error: "Failed to restore folder" }
//   }
// }

// export async function getTrashedFolders() {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const folders = await db.prospectFolder.findMany({
//     where: {
//       userId: user.id,
//       isTrashed: true,
//     },
//     orderBy: { trashedAt: "desc" },
//     include: {
//       _count: {
//         select: {
//           directProspects: true,
//         },
//       },
//     },
//   })

//   return folders.map((folder) => ({
//     id: folder.id,
//     name: folder.name,
//     color: folder.color,
//     icon: folder.icon,
//     prospectCount: folder._count.directProspects,
//     createdAt: folder.createdAt,
//     updatedAt: folder.updatedAt,
//     trashedAt: folder.trashedAt,
//     userId: folder.userId,
//     isTrashed: folder.isTrashed,
//   }))
// }

// export async function permanentlyDeleteFolder(folderId: string) {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) return { success: false, error: "User not found" }

//   try {
//     // Move all prospects to no folder before deleting
//     await db.prospect.updateMany({
//       where: { folderId },
//       data: { folderId: null },
//     })

//     await db.prospectFolder.delete({
//       where: { id: folderId, userId: user.id, isTrashed: true },
//     })

//     revalidatePath("/dashboard/prospects")
//     return { success: true }
//   } catch (error) {
//     console.error("Error permanently deleting folder:", error)
//     return { success: false, error: "Failed to delete folder permanently" }
//   }
// }




"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getFolders() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const folders = await db.prospectFolder.findMany({
    where: {
      userId: user.id,
      isTrashed: false,
    },
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: {
          directProspects: {
            where: {
              isTrashed: false,
            },
          },
        },
      },
    },
  })

  return folders.map((folder) => ({
    id: folder.id,
    name: folder.name,
    color: folder.color,
    icon: folder.icon,
    prospectCount: folder._count.directProspects,
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
    userId: folder.userId,
    isTrashed: folder.isTrashed,
    trashedAt: folder.trashedAt,
  }))
}

export async function createFolder(name: string, color?: string, icon?: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    const folder = await db.prospectFolder.create({
      data: {
        userId: user.id,
        name,
        color: color || "#6366f1",
        icon: icon || "folder",
      },
    })

    revalidatePath("/dashboard/prospects")
    return { success: true, folder }
  } catch (error) {
    console.error("Error creating folder:", error)
    return { success: false, error: "Failed to create folder" }
  }
}

export async function moveProspectsToFolder(prospectIds: string[], folderId: string | null) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    await db.prospect.updateMany({
      where: {
        id: { in: prospectIds },
        userId: user.id,
      },
      data: { folderId },
    })

    // Update folder prospect counts
    if (folderId) {
      const count = await db.prospect.count({
        where: { folderId, isTrashed: false },
      })
      await db.prospectFolder.update({
        where: { id: folderId },
        data: { prospectCount: count },
      })
    }

    revalidatePath("/dashboard/prospects")
    return { success: true }
  } catch (error) {
    console.error("Error moving prospects:", error)
    return { success: false, error: "Failed to move prospects" }
  }
}

export async function deleteFolder(folderId: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    // Move all prospects in folder to no folder
    await db.prospect.updateMany({
      where: { folderId },
      data: { folderId: null },
    })

    await db.prospectFolder.delete({
      where: { id: folderId, userId: user.id },
    })

    revalidatePath("/dashboard/prospects")
    return { success: true }
  } catch (error) {
    console.error("Error deleting folder:", error)
    return { success: false, error: "Failed to delete folder" }
  }
}

export async function moveToTrash(prospectIds: string[]) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    await db.prospect.updateMany({
      where: {
        id: { in: prospectIds },
        userId: user.id,
      },
      data: {
        isTrashed: true,
        trashedAt: new Date(),
      },
    })

    revalidatePath("/dashboard/prospects")
    return { success: true }
  } catch (error) {
    console.error("Error moving to trash:", error)
    return { success: false, error: "Failed to move to trash" }
  }
}

export async function restoreFromTrash(prospectIds: string[]) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    await db.prospect.updateMany({
      where: {
        id: { in: prospectIds },
        userId: user.id,
      },
      data: {
        isTrashed: false,
        trashedAt: null,
      },
    })

    revalidatePath("/dashboard/prospects")
    return { success: true }
  } catch (error) {
    console.error("Error restoring from trash:", error)
    return { success: false, error: "Failed to restore" }
  }
}

export async function permanentlyDelete(prospectIds: string[]) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    await db.prospect.deleteMany({
      where: {
        id: { in: prospectIds },
        userId: user.id,
        isTrashed: true,
      },
    })

    revalidatePath("/dashboard/prospects")
    return { success: true }
  } catch (error) {
    console.error("Error permanently deleting:", error)
    return { success: false, error: "Failed to delete permanently" }
  }
}

export async function getTrashedCount() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const count = await db.prospect.count({
    where: {
      userId: user.id,
      isTrashed: true,
    },
  })

  return count
}

export async function checkDuplicatesBeforeMerge(folderIds: string[]) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    const allProspects = await db.prospect.findMany({
      where: {
        folderId: { in: folderIds },
        userId: user.id,
        isTrashed: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        jobTitle: true,
        qualityScore: true,
        linkedinUrl: true,
        emailsOpened: true,
        emailsReplied: true,
      },
    })

    // Group by email to find duplicates
    const emailGroups = new Map()

    for (const prospect of allProspects) {
      if (!emailGroups.has(prospect.email)) {
        emailGroups.set(prospect.email, [])
      }
      emailGroups.get(prospect.email).push(prospect)
    }

    // Find groups with more than one prospect
    const duplicateGroups: any[] = []
    emailGroups.forEach((prospects, email) => {
      if (prospects.length > 1) {
        duplicateGroups.push({
          email,
          reason: `Multiple prospects found with email: ${email}`,
          prospects,
        })
      }
    })

    return {
      success: true,
      hasDuplicates: duplicateGroups.length > 0,
      duplicateGroups,
      totalProspects: allProspects.length,
    }
  } catch (error) {
    console.error("Error checking duplicates:", error)
    return { success: false, error: "Failed to check duplicates" }
  }
}

export async function mergeFolders(
  folderIds: string[],
  newName: string,
  trashOptions: { source: boolean; target: boolean },
  excludeProspectIds?: string[],
) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    const newFolder = await db.prospectFolder.create({
      data: {
        userId: user.id,
        name: newName,
        color: "#6366f1",
        icon: "folder",
      },
    })

    const whereClause: any = {
      folderId: { in: folderIds },
      userId: user.id,
      isTrashed: false,
    }

    if (excludeProspectIds && excludeProspectIds.length > 0) {
      whereClause.id = { notIn: excludeProspectIds }
    }

    const prospectsToMove = await db.prospect.findMany({
      where: whereClause,
      select: { id: true },
    })

    const updateResult = await db.prospect.updateMany({
      where: {
        id: { in: prospectsToMove.map((p) => p.id) },
        userId: user.id,
      },
      data: {
        folderId: newFolder.id,
      },
    })

    if (excludeProspectIds && excludeProspectIds.length > 0) {
      await db.prospect.updateMany({
        where: {
          id: { in: excludeProspectIds },
          userId: user.id,
        },
        data: {
          isTrashed: true,
          trashedAt: new Date(),
        },
      })
    }

    if (trashOptions.source && folderIds[0]) {
      await db.prospectFolder.update({
        where: { id: folderIds[0] },
        data: { isTrashed: true, trashedAt: new Date() },
      })
    }

    if (trashOptions.target && folderIds[1]) {
      await db.prospectFolder.update({
        where: { id: folderIds[1] },
        data: { isTrashed: true, trashedAt: new Date() },
      })
    }

    revalidatePath("/dashboard/prospects")
    return {
      success: true,
      folderId: newFolder.id,
      duplicatesRemoved: excludeProspectIds?.length || 0,
      prospectsAdded: updateResult.count,
    }
  } catch (error) {
    console.error("Error merging folders:", error)
    return { success: false, error: "Failed to merge folders" }
  }
}

export async function updateFolder(folderId: string, name: string, color: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    await db.prospectFolder.update({
      where: {
        id: folderId,
        userId: user.id,
      },
      data: {
        name,
        color,
      },
    })

    revalidatePath("/dashboard/prospects")
    return { success: true }
  } catch (error) {
    console.error("Error updating folder:", error)
    return { success: false, error: "Failed to update folder" }
  }
}

export async function trashFolder(folderId: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    await db.prospectFolder.update({
      where: {
        id: folderId,
        userId: user.id,
      },
      data: {
        isTrashed: true,
        trashedAt: new Date(),
      },
    })

    revalidatePath("/dashboard/prospects")
    return { success: true }
  } catch (error) {
    console.error("Error trashing folder:", error)
    return { success: false, error: "Failed to trash folder" }
  }
}

export async function restoreFolder(folderId: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    await db.prospectFolder.update({
      where: {
        id: folderId,
        userId: user.id,
      },
      data: {
        isTrashed: false,
        trashedAt: null,
      },
    })

    revalidatePath("/dashboard/prospects")
    return { success: true }
  } catch (error) {
    console.error("Error restoring folder:", error)
    return { success: false, error: "Failed to restore folder" }
  }
}

export async function getTrashedFolders() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const folders = await db.prospectFolder.findMany({
    where: {
      userId: user.id,
      isTrashed: true,
    },
    orderBy: { trashedAt: "desc" },
    include: {
      _count: {
        select: {
          directProspects: true,
        },
      },
    },
  })

  return folders.map((folder) => ({
    id: folder.id,
    name: folder.name,
    color: folder.color,
    icon: folder.icon,
    prospectCount: folder._count.directProspects,
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
    trashedAt: folder.trashedAt,
    userId: folder.userId,
    isTrashed: folder.isTrashed,
  }))
}

export async function permanentlyDeleteFolder(folderId: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    // Move all prospects to no folder before deleting
    await db.prospect.updateMany({
      where: { folderId },
      data: { folderId: null },
    })

    await db.prospectFolder.delete({
      where: { id: folderId, userId: user.id, isTrashed: true },
    })

    revalidatePath("/dashboard/prospects")
    return { success: true }
  } catch (error) {
    console.error("Error permanently deleting folder:", error)
    return { success: false, error: "Failed to delete folder permanently" }
  }
}

export async function getFolderProspects(folderId: string) {
  const { userId } = await auth()
  if (!userId) return []

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return []

  const prospects = await db.prospect.findMany({
    where: {
      folderId,
      userId: user.id,
      isTrashed: false,
    },
    orderBy: { createdAt: "desc" },
  })

  return prospects
}
