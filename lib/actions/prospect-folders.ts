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
  })

  return folders
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
