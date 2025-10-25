// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import type { TeamRole } from "@prisma/client"
// import { resend, FROM_EMAIL } from "@/lib/resend"
// import { TeamInvitationEmail } from "@/lib/email-templates/team-invitation"
// import { render } from "@react-email/render"
// import { requirePermission } from "@/lib/permissions"
// import crypto from "crypto"

// export async function inviteTeamMember(email: string, role: TeamRole = "MEMBER") {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   // Check permission to invite team members
//   try {
//     await requirePermission(userId, "team", "invite")
//   } catch (error) {
//     return { success: false, error: "You don't have permission to invite team members" }
//   }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) return { success: false, error: "User not found" }

//   try {
//     // Check if already invited
//     const existing = await db.teamMember.findUnique({
//       where: {
//         userId_email: {
//           userId: user.id,
//           email,
//         },
//       },
//     })

//     if (existing) {
//       if (existing.status === "ACCEPTED") {
//         return { success: false, error: "User is already a team member" }
//       }
//       if (existing.status === "PENDING") {
//         return { success: false, error: "Invitation already sent. Use 'Resend' to send again." }
//       }
//     }

//     // Generate secure invitation token
//     const invitationToken = crypto.randomBytes(32).toString("hex")
//     const invitationExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

//     const teamMember = await db.teamMember.create({
//       data: {
//         userId: user.id,
//         email,
//         role,
//         status: "PENDING",
//         invitationToken,
//         invitationExpiry,
//         invitedBy: user.id,
//       },
//     })

//     const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitationToken}`

//     const emailComponent = TeamInvitationEmail({
//       inviterName: user.name || user.email,
//       inviterEmail: user.email,
//       inviteeEmail: email,
//       role: role,
//       invitationUrl: invitationUrl,
//       expiresAt: invitationExpiry.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       }),
//     })

//     const emailHtml = await render(emailComponent)

//     await resend.emails.send({
//       from: FROM_EMAIL,
//       to: email,
//       subject: `You've been invited to join ${user.name || user.email}'s ReachAI workspace`,
//       html: emailHtml,
//     })

//     revalidatePath("/dashboard/settings")
//     return { success: true, teamMember }
//   } catch (error) {
//     console.error("[v0] Error inviting team member:", error)
//     return { success: false, error: "Failed to send invitation" }
//   }
// }

// export async function removeTeamMember(memberId: string) {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   // Check permission to remove team members
//   try {
//     await requirePermission(userId, "team", "remove")
//   } catch (error) {
//     return { success: false, error: "You don't have permission to remove team members" }
//   }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) return { success: false, error: "User not found" }

//   try {
//     await db.teamMember.delete({
//       where: {
//         id: memberId,
//         userId: user.id,
//       },
//     })

//     revalidatePath("/dashboard/settings")
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error removing team member:", error)
//     return { success: false, error: "Failed to remove team member" }
//   }
// }

// export async function updateTeamMemberRole(memberId: string, role: TeamRole) {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   // Check permission to update roles
//   try {
//     await requirePermission(userId, "team", "updateRoles")
//   } catch (error) {
//     return { success: false, error: "You don't have permission to update team member roles" }
//   }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) return { success: false, error: "User not found" }

//   try {
//     const teamMember = await db.teamMember.update({
//       where: {
//         id: memberId,
//         userId: user.id,
//       },
//       data: { role },
//     })

//     revalidatePath("/dashboard/settings")
//     return { success: true, teamMember }
//   } catch (error) {
//     console.error("[v0] Error updating team member role:", error)
//     return { success: false, error: "Failed to update role" }
//   }
// }

// export async function resendInvitation(memberId: string) {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   // Check permission to invite team members
//   try {
//     await requirePermission(userId, "team", "invite")
//   } catch (error) {
//     return { success: false, error: "You don't have permission to resend invitations" }
//   }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) return { success: false, error: "User not found" }

//   try {
//     const teamMember = await db.teamMember.findUnique({
//       where: {
//         id: memberId,
//         userId: user.id,
//       },
//     })

//     if (!teamMember) return { success: false, error: "Team member not found" }
//     if (teamMember.status === "ACCEPTED") {
//       return { success: false, error: "This invitation has already been accepted" }
//     }

//     // Generate new token and expiry
//     const invitationToken = crypto.randomBytes(32).toString("hex")
//     const invitationExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

//     await db.teamMember.update({
//       where: { id: memberId },
//       data: {
//         invitationToken,
//         invitationExpiry,
//         status: "PENDING",
//       },
//     })

//     const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitationToken}`

//     const emailComponent = TeamInvitationEmail({
//       inviterName: user.name || user.email,
//       inviterEmail: user.email,
//       inviteeEmail: teamMember.email,
//       role: teamMember.role,
//       invitationUrl: invitationUrl,
//       expiresAt: invitationExpiry.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       }),
//     })

//     const emailHtml = await render(emailComponent)

//     await resend.emails.send({
//       from: FROM_EMAIL,
//       to: teamMember.email,
//       subject: `Reminder: You've been invited to join ${user.name || user.email}'s ReachAI workspace`,
//       html: emailHtml,
//     })

//     revalidatePath("/dashboard/settings")
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error resending invitation:", error)
//     return { success: false, error: "Failed to resend invitation" }
//   }
// }

// export async function acceptInvitation(token: string) {
//   try {
//     const invitation = await db.teamMember.findUnique({
//       where: { invitationToken: token },
//       include: { user: true },
//     })

//     if (!invitation) {
//       return { success: false, error: "Invalid invitation link" }
//     }

//     if (invitation.status === "ACCEPTED") {
//       return { success: false, error: "This invitation has already been accepted" }
//     }

//     if (invitation.status === "DECLINED") {
//       return { success: false, error: "This invitation has been declined" }
//     }

//     if (invitation.invitationExpiry && invitation.invitationExpiry < new Date()) {
//       await db.teamMember.update({
//         where: { id: invitation.id },
//         data: { status: "EXPIRED" },
//       })
//       return { success: false, error: "This invitation has expired" }
//     }

//     // Accept the invitation
//     await db.teamMember.update({
//       where: { id: invitation.id },
//       data: {
//         status: "ACCEPTED",
//         acceptedAt: new Date(),
//         invitationToken: null, // Clear token after acceptance
//       },
//     })

//     return {
//       success: true,
//       workspaceName: invitation.user.name || invitation.user.email,
//       role: invitation.role,
//     }
//   } catch (error) {
//     console.error("[v0] Error accepting invitation:", error)
//     return { success: false, error: "Failed to accept invitation" }
//   }
// }

// export async function declineInvitation(token: string) {
//   try {
//     const invitation = await db.teamMember.findUnique({
//       where: { invitationToken: token },
//     })

//     if (!invitation) {
//       return { success: false, error: "Invalid invitation link" }
//     }

//     if (invitation.status === "ACCEPTED") {
//       return { success: false, error: "This invitation has already been accepted" }
//     }

//     await db.teamMember.update({
//       where: { id: invitation.id },
//       data: {
//         status: "DECLINED",
//         invitationToken: null,
//       },
//     })

//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error declining invitation:", error)
//     return { success: false, error: "Failed to decline invitation" }
//   }
// }

"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { TeamRole } from "@prisma/client"
import { resend, FROM_EMAIL } from "@/lib/resend"
import { TeamInvitationEmail } from "@/lib/email-templates/team-invitation"
import { render } from "@react-email/render"
import { requirePermission } from "@/lib/permissions"
import crypto from "crypto"

export async function inviteTeamMember(email: string, role: TeamRole = "MEMBER") {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  console.log("[v0] Starting team invitation for:", email)

  // Check permission to invite team members
  try {
    await requirePermission(userId, "team", "invite")
  } catch (error) {
    console.log("[v0] Permission check failed:", error)
    return { success: false, error: "You don't have permission to invite team members" }
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    console.log("[v0] User not found for clerkId:", userId)
    return { success: false, error: "User not found" }
  }

  console.log("[v0] Found user:", user.email)

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
      if (existing.status === "ACCEPTED") {
        return { success: false, error: "User is already a team member" }
      }
      if (existing.status === "PENDING") {
        return { success: false, error: "Invitation already sent. Use 'Resend' to send again." }
      }
    }

    // Generate secure invitation token
    const invitationToken = crypto.randomBytes(32).toString("hex")
    const invitationExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    console.log("[v0] Creating team member record...")

    const teamMember = await db.teamMember.create({
      data: {
        userId: user.id,
        email,
        role,
        status: "PENDING",
        invitationToken,
        invitationExpiry,
        invitedBy: user.id,
      },
    })

    console.log("[v0] Team member created:", teamMember.id)

    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitationToken}`
    console.log("[v0] Invitation URL:", invitationUrl)

    console.log("[v0] Rendering email template...")
    const emailComponent = TeamInvitationEmail({
      inviterName: user.name || user.email,
      inviterEmail: user.email,
      inviteeEmail: email,
      role: role,
      invitationUrl: invitationUrl,
      expiresAt: invitationExpiry.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    })

    const emailHtml = await render(emailComponent)
    console.log("[v0] Email template rendered, length:", emailHtml.length)

    console.log("[v0] Sending email to:", email)
    console.log("[v0] From:", FROM_EMAIL)

    const result = await resend.send({
      to: email,
      subject: `You've been invited to join ${user.name || user.email}'s ReachAI workspace`,
      html: emailHtml,
    })

    console.log("[v0] Email sent successfully! Result:", result)

    revalidatePath("/dashboard/settings")
    return { success: true, teamMember }
  } catch (error) {
    console.error("[v0] Error inviting team member:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to send invitation. Please check your email configuration.",
    }
  }
}

export async function removeTeamMember(memberId: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  // Check permission to remove team members
  try {
    await requirePermission(userId, "team", "remove")
  } catch (error) {
    return { success: false, error: "You don't have permission to remove team members" }
  }

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

  // Check permission to update roles
  try {
    await requirePermission(userId, "team", "updateRoles")
  } catch (error) {
    return { success: false, error: "You don't have permission to update team member roles" }
  }

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

  console.log("[v0] Resending invitation for member:", memberId)

  // Check permission to invite team members
  try {
    await requirePermission(userId, "team", "invite")
  } catch (error) {
    return { success: false, error: "You don't have permission to resend invitations" }
  }

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
    if (teamMember.status === "ACCEPTED") {
      return { success: false, error: "This invitation has already been accepted" }
    }

    // Generate new token and expiry
    const invitationToken = crypto.randomBytes(32).toString("hex")
    const invitationExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await db.teamMember.update({
      where: { id: memberId },
      data: {
        invitationToken,
        invitationExpiry,
        status: "PENDING",
      },
    })

    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitationToken}`

    console.log("[v0] Rendering email template for resend...")
    const emailComponent = TeamInvitationEmail({
      inviterName: user.name || user.email,
      inviterEmail: user.email,
      inviteeEmail: teamMember.email,
      role: teamMember.role,
      invitationUrl: invitationUrl,
      expiresAt: invitationExpiry.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    })

    const emailHtml = await render(emailComponent)

    console.log("[v0] Resending email to:", teamMember.email)

    const result = await resend.send({
      to: teamMember.email,
      subject: `Reminder: You've been invited to join ${user.name || user.email}'s ReachAI workspace`,
      html: emailHtml,
    })

    console.log("[v0] Email resent successfully! Result:", result)

    revalidatePath("/dashboard/settings")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error resending invitation:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to resend invitation. Please check your email configuration.",
    }
  }
}

export async function acceptInvitation(token: string) {
  try {
    const invitation = await db.teamMember.findUnique({
      where: { invitationToken: token },
      include: { user: true },
    })

    if (!invitation) {
      return { success: false, error: "Invalid invitation link" }
    }

    if (invitation.status === "ACCEPTED") {
      return { success: false, error: "This invitation has already been accepted" }
    }

    if (invitation.status === "DECLINED") {
      return { success: false, error: "This invitation has been declined" }
    }

    if (invitation.invitationExpiry && invitation.invitationExpiry < new Date()) {
      await db.teamMember.update({
        where: { id: invitation.id },
        data: { status: "EXPIRED" },
      })
      return { success: false, error: "This invitation has expired" }
    }

    // Accept the invitation
    await db.teamMember.update({
      where: { id: invitation.id },
      data: {
        status: "ACCEPTED",
        acceptedAt: new Date(),
        invitationToken: null, // Clear token after acceptance
      },
    })

    return {
      success: true,
      workspaceName: invitation.user.name || invitation.user.email,
      role: invitation.role,
    }
  } catch (error) {
    console.error("[v0] Error accepting invitation:", error)
    return { success: false, error: "Failed to accept invitation" }
  }
}

export async function declineInvitation(token: string) {
  try {
    const invitation = await db.teamMember.findUnique({
      where: { invitationToken: token },
    })

    if (!invitation) {
      return { success: false, error: "Invalid invitation link" }
    }

    if (invitation.status === "ACCEPTED") {
      return { success: false, error: "This invitation has already been accepted" }
    }

    await db.teamMember.update({
      where: { id: invitation.id },
      data: {
        status: "DECLINED",
        invitationToken: null,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("[v0] Error declining invitation:", error)
    return { success: false, error: "Failed to decline invitation" }
  }
}
