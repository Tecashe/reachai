"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { nanoid } from "nanoid"
import { Resend } from "resend"
import { revalidatePath } from "next/cache"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function inviteTeamMember(email: string, role: "MEMBER" | "ADMIN") {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Check if already invited or member
    const existing = await db.teamMember.findFirst({
      where: {
        userId: user.id,
        email,
      },
    })

    if (existing) {
      return { success: false, error: "This email is already invited or is a member" }
    }

    // Generate invitation token
    const invitationToken = nanoid(32)
    const invitationExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Create team member
    const teamMember = await db.teamMember.create({
      data: {
        userId: user.id,
        email,
        role,
        invitationToken,
        invitationExpiry,
        invitedBy: user.id,
        status: "PENDING",
      },
    })

    // Send invitation email
    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitationToken}`

    try {
      const emailResult = await resend.emails.send({
        from: "mailfra <noreply@mailfra.com>",
        to: email,
        subject: `${user.name || user.email} invited you to join their mailfra team`,
        html: `
          <h2>You've been invited to join ${user.name || user.email}'s team on mailfra</h2>
          <p>You've been invited as a <strong>${role.toLowerCase()}</strong>.</p>
          <p>Click the link below to accept the invitation:</p>
          <a href="${invitationUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Accept Invitation</a>
          <p>This invitation expires in 7 days.</p>
          <p>If you didn't expect this invitation, you can safely ignore this email.</p>
        `,
      })

      // console.log("[Team] Invitation email sent successfully:", emailResult.id)
    } catch (emailError: any) {
      console.error("[Team] Failed to send invitation email:", emailError)
      // Check if it's an API key issue
      if (emailError.message?.includes("API key")) {
        return {
          success: false,
          error: "Email service not configured. Please add RESEND_API_KEY to environment variables.",
        }
      }
      // Continue even if email fails - user can still manually resend
      console.warn("[Team] Continuing despite email failure - invitation saved to database")
    }

    revalidatePath("/dashboard/settings")

    return { success: true, teamMember }
  } catch (error) {
    console.error("Error inviting team member:", error)
    return { success: false, error: "Failed to send invitation" }
  }
}

export async function removeTeamMember(memberId: string) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Delete team member
    await db.teamMember.delete({
      where: {
        id: memberId,
        userId: user.id,
      },
    })

    revalidatePath("/dashboard/settings")

    return { success: true }
  } catch (error) {
    console.error("Error removing team member:", error)
    return { success: false, error: "Failed to remove team member" }
  }
}

export async function resendInvitation(memberId: string) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    const teamMember = await db.teamMember.findFirst({
      where: {
        id: memberId,
        userId: user.id,
        status: "PENDING",
      },
    })

    if (!teamMember) {
      return { success: false, error: "Team member not found or already accepted" }
    }

    // Generate new invitation token
    const invitationToken = nanoid(32)
    const invitationExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await db.teamMember.update({
      where: { id: memberId },
      data: {
        invitationToken,
        invitationExpiry,
      },
    })

    // Send invitation email
    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitationToken}`

    try {
      const emailResult = await resend.emails.send({
        from: "mailfra <noreply@mailfra.com>",
        to: teamMember.email,
        subject: `Reminder: ${user.name || user.email} invited you to join their mailfra team`,
        html: `
          <h2>You've been invited to join ${user.name || user.email}'s team on mailfra</h2>
          <p>You've been invited as a <strong>${teamMember.role.toLowerCase()}</strong>.</p>
          <p>Click the link below to accept the invitation:</p>
          <a href="${invitationUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Accept Invitation</a>
          <p>This invitation expires in 7 days.</p>
          <p>If you didn't expect this invitation, you can safely ignore this email.</p>
        `,
      })

      // console.log("[Team] Invitation email sent successfully:", emailResult.id)
    } catch (emailError: any) {
      console.error("[Team] Failed to send invitation email:", emailError)
      // Check if it's an API key issue
      if (emailError.message?.includes("API key")) {
        return {
          success: false,
          error: "Email service not configured. Please add RESEND_API_KEY to environment variables.",
        }
      }
      // Continue even if email fails - user can still manually resend
      console.warn("[Team] Continuing despite email failure - invitation saved to database")
    }

    revalidatePath("/dashboard/settings")

    return { success: true }
  } catch (error) {
    console.error("Error resending invitation:", error)
    return { success: false, error: "Failed to resend invitation" }
  }
}

export async function acceptInvitation(token: string) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Find invitation by token
    const invitation = await db.teamMember.findFirst({
      where: {
        invitationToken: token,
        status: "PENDING",
      },
    })

    if (!invitation) {
      return { success: false, error: "Invalid or expired invitation" }
    }

    // Check if invitation has expired
    if (invitation.invitationExpiry && invitation.invitationExpiry < new Date()) {
      return { success: false, error: "This invitation has expired" }
    }

    // Check if the email matches the logged-in user
    if (invitation.email !== user.email) {
      return {
        success: false,
        error: "This invitation was sent to a different email address",
      }
    }

    // Accept the invitation
    await db.teamMember.update({
      where: { id: invitation.id },
      data: {
        status: "ACCEPTED",
        acceptedAt: new Date(),
        invitationToken: null,
      },
    })

    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error accepting invitation:", error)
    return { success: false, error: "Failed to accept invitation" }
  }
}

export async function declineInvitation(token: string) {
  try {
    // Find invitation by token
    const invitation = await db.teamMember.findFirst({
      where: {
        invitationToken: token,
        status: "PENDING",
      },
    })

    if (!invitation) {
      return { success: false, error: "Invalid or expired invitation" }
    }

    // Update status to declined
    await db.teamMember.update({
      where: { id: invitation.id },
      data: {
        status: "DECLINED",
        invitationToken: null,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error declining invitation:", error)
    return { success: false, error: "Failed to decline invitation" }
  }
}
