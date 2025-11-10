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
//     where: { userId: user.id },
//     orderBy: { createdAt: "asc" },
//   })

//   return folders
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
//     where: { userId: user.id },
//     orderBy: { createdAt: "asc" },
//     include: {
//       _count: {
//         select: {
//           prospects: {
//             where: { isTrashed: false },
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
//     prospectCount: folder._count.prospects,
//     createdAt: folder.createdAt,
//     updatedAt: folder.updatedAt,
//     userId: folder.userId,
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
//     where: { userId: user.id },
//     orderBy: { createdAt: "asc" },
//     include: {
//       _count: {
//         select: {
//           prospects: {
//             where: { isTrashed: false },
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
//     prospectCount: folder._count.prospects,
//     createdAt: folder.createdAt,
//     updatedAt: folder.updatedAt,
//     userId: folder.userId,
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

// export async function mergeFolders(folderIds: string[], newName: string) {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) return { success: false, error: "User not found" }

//   try {
//     // Create new merged folder
//     const newFolder = await db.prospectFolder.create({
//       data: {
//         userId: user.id,
//         name: newName,
//         color: "#6366f1",
//         icon: "folder",
//       },
//     })

//     // Move all prospects from selected folders to new folder
//     await db.prospect.updateMany({
//       where: {
//         folderId: { in: folderIds },
//         userId: user.id,
//       },
//       data: {
//         folderId: newFolder.id,
//       },
//     })

//     // Delete old folders
//     await db.prospectFolder.deleteMany({
//       where: {
//         id: { in: folderIds },
//         userId: user.id,
//       },
//     })

//     revalidatePath("/dashboard/prospects")
//     return { success: true, folderId: newFolder.id }
//   } catch (error) {
//     console.error("Error merging folders:", error)
//     return { success: false, error: "Failed to merge folders" }
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
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: {
          prospects: {
            where: { isTrashed: false },
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
    prospectCount: folder._count.prospects,
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
    userId: folder.userId,
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

export async function mergeFolders(folderIds: string[], newName: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    // Create new merged folder
    const newFolder = await db.prospectFolder.create({
      data: {
        userId: user.id,
        name: newName,
        color: "#6366f1",
        icon: "folder",
      },
    })

    // Move all prospects from selected folders to new folder
    await db.prospect.updateMany({
      where: {
        folderId: { in: folderIds },
        userId: user.id,
      },
      data: {
        folderId: newFolder.id,
      },
    })

    // Delete old folders
    await db.prospectFolder.deleteMany({
      where: {
        id: { in: folderIds },
        userId: user.id,
      },
    })

    revalidatePath("/dashboard/prospects")
    return { success: true, folderId: newFolder.id }
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
