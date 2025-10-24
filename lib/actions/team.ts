"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { TeamRole } from "@prisma/client"

export async function inviteTeamMember(email: string, role: TeamRole = "MEMBER") {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    // Check if already invited
    const existing = await db.teamMember.findUnique({
      where: {
        userId_email: {
          userId: user.id,
          email,
        },
      },
    })

    if (existing) {
      return { success: false, error: "User already invited" }
    }

    const teamMember = await db.teamMember.create({
      data: {
        userId: user.id,
        email,
        role,
        status: "PENDING",
      },
    })

    // TODO: Send invitation email via Resend

    revalidatePath("/dashboard/settings")
    return { success: true, teamMember }
  } catch (error) {
    console.error("[v0] Error inviting team member:", error)
    return { success: false, error: "Failed to send invitation" }
  }
}

export async function removeTeamMember(memberId: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    await db.teamMember.delete({
      where: {
        id: memberId,
        userId: user.id,
      },
    })

    revalidatePath("/dashboard/settings")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error removing team member:", error)
    return { success: false, error: "Failed to remove team member" }
  }
}

export async function updateTeamMemberRole(memberId: string, role: TeamRole) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    const teamMember = await db.teamMember.update({
      where: {
        id: memberId,
        userId: user.id,
      },
      data: { role },
    })

    revalidatePath("/dashboard/settings")
    return { success: true, teamMember }
  } catch (error) {
    console.error("[v0] Error updating team member role:", error)
    return { success: false, error: "Failed to update role" }
  }
}

export async function resendInvitation(memberId: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return { success: false, error: "User not found" }

  try {
    const teamMember = await db.teamMember.findUnique({
      where: {
        id: memberId,
        userId: user.id,
      },
    })

    if (!teamMember) return { success: false, error: "Team member not found" }

    // TODO: Send invitation email via Resend

    revalidatePath("/dashboard/settings")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error resending invitation:", error)
    return { success: false, error: "Failed to resend invitation" }
  }
}
