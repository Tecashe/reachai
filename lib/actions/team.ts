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
//     console.error("[builtbycashe] Error inviting team member:", error)
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
//     console.error("[builtbycashe] Error removing team member:", error)
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
//     console.error("[builtbycashe] Error updating team member role:", error)
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
//     console.error("[builtbycashe] Error resending invitation:", error)
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
//     console.error("[builtbycashe] Error accepting invitation:", error)
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
//     console.error("[builtbycashe] Error declining invitation:", error)
//     return { success: false, error: "Failed to decline invitation" }
//   }
// }

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

//   console.log("[builtbycashe] Starting team invitation for:", email)

//   // Check permission to invite team members
//   try {
//     await requirePermission(userId, "team", "invite")
//   } catch (error) {
//     console.log("[builtbycashe] Permission check failed:", error)
//     return { success: false, error: "You don't have permission to invite team members" }
//   }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) {
//     console.log("[builtbycashe] User not found for clerkId:", userId)
//     return { success: false, error: "User not found" }
//   }

//   console.log("[builtbycashe] Found user:", user.email)

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

//     console.log("[builtbycashe] Creating team member record...")

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

//     console.log("[builtbycashe] Team member created:", teamMember.id)

//     const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitationToken}`
//     console.log("[builtbycashe] Invitation URL:", invitationUrl)

//     console.log("[builtbycashe] Rendering email template...")
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
//     console.log("[builtbycashe] Email template rendered, length:", emailHtml.length)

//     console.log("[builtbycashe] Sending email to:", email)
//     console.log("[builtbycashe] From:", FROM_EMAIL)

//     const result = await resend.send({
//       to: email,
//       subject: `You've been invited to join ${user.name || user.email}'s ReachAI workspace`,
//       html: emailHtml,
//     })

//     console.log("[builtbycashe] Email sent successfully! Result:", result)

//     revalidatePath("/dashboard/settings")
//     return { success: true, teamMember }
//   } catch (error) {
//     console.error("[builtbycashe] Error inviting team member:", error)
//     return {
//       success: false,
//       error:
//         error instanceof Error ? error.message : "Failed to send invitation. Please check your email configuration.",
//     }
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
//     console.error("[builtbycashe] Error removing team member:", error)
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
//     console.error("[builtbycashe] Error updating team member role:", error)
//     return { success: false, error: "Failed to update role" }
//   }
// }

// export async function resendInvitation(memberId: string) {
//   const { userId } = await auth()
//   if (!userId) return { success: false, error: "Unauthorized" }

//   console.log("[builtbycashe] Resending invitation for member:", memberId)

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

//     console.log("[builtbycashe] Rendering email template for resend...")
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

//     console.log("[builtbycashe] Resending email to:", teamMember.email)

//     const result = await resend.send({
//       to: teamMember.email,
//       subject: `Reminder: You've been invited to join ${user.name || user.email}'s ReachAI workspace`,
//       html: emailHtml,
//     })

//     console.log("[builtbycashe] Email resent successfully! Result:", result)

//     revalidatePath("/dashboard/settings")
//     return { success: true }
//   } catch (error) {
//     console.error("[builtbycashe] Error resending invitation:", error)
//     return {
//       success: false,
//       error:
//         error instanceof Error ? error.message : "Failed to resend invitation. Please check your email configuration.",
//     }
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
//     console.error("[builtbycashe] Error accepting invitation:", error)
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
//     console.error("[builtbycashe] Error declining invitation:", error)
//     return { success: false, error: "Failed to decline invitation" }
//   }
// }


// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { nanoid } from "nanoid"
// import { Resend } from "resend"
// import { revalidatePath } from "next/cache"

// const resend = new Resend(process.env.RESEND_API_KEY)

// export async function inviteTeamMember(email: string, role: "MEMBER" | "ADMIN") {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return { success: false, error: "Unauthorized" }
//     }

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       return { success: false, error: "User not found" }
//     }

//     // Check if already invited or member
//     const existing = await db.teamMember.findFirst({
//       where: {
//         userId: user.id,
//         email,
//       },
//     })

//     if (existing) {
//       return { success: false, error: "This email is already invited or is a member" }
//     }

//     // Generate invitation token
//     const invitationToken = nanoid(32)
//     const invitationExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

//     // Create team member
//     const teamMember = await db.teamMember.create({
//       data: {
//         userId: user.id,
//         email,
//         role,
//         invitationToken,
//         invitationExpiry,
//         invitedBy: user.id,
//         status: "PENDING",
//       },
//     })

//     // Send invitation email
//     const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitationToken}`

//     try {
//       await resend.emails.send({
//         from: "ReachAI <noreply@reachai.com>",
//         to: email,
//         subject: `${user.name || user.email} invited you to join their ReachAI team`,
//         html: `
//           <h2>You've been invited to join ${user.name || user.email}'s team on ReachAI</h2>
//           <p>You've been invited as a <strong>${role.toLowerCase()}</strong>.</p>
//           <p>Click the link below to accept the invitation:</p>
//           <a href="${invitationUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Accept Invitation</a>
//           <p>This invitation expires in 7 days.</p>
//           <p>If you didn't expect this invitation, you can safely ignore this email.</p>
//         `,
//       })
//     } catch (emailError) {
//       console.error("Failed to send invitation email:", emailError)
//       // Continue even if email fails - user can still manually resend
//     }

//     revalidatePath("/dashboard/settings")

//     return { success: true, teamMember }
//   } catch (error) {
//     console.error("Error inviting team member:", error)
//     return { success: false, error: "Failed to send invitation" }
//   }
// }

// export async function removeTeamMember(memberId: string) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return { success: false, error: "Unauthorized" }
//     }

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       return { success: false, error: "User not found" }
//     }

//     // Delete team member
//     await db.teamMember.delete({
//       where: {
//         id: memberId,
//         userId: user.id,
//       },
//     })

//     revalidatePath("/dashboard/settings")

//     return { success: true }
//   } catch (error) {
//     console.error("Error removing team member:", error)
//     return { success: false, error: "Failed to remove team member" }
//   }
// }

// export async function resendInvitation(memberId: string) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return { success: false, error: "Unauthorized" }
//     }

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       return { success: false, error: "User not found" }
//     }

//     const teamMember = await db.teamMember.findFirst({
//       where: {
//         id: memberId,
//         userId: user.id,
//         status: "PENDING",
//       },
//     })

//     if (!teamMember) {
//       return { success: false, error: "Team member not found or already accepted" }
//     }

//     // Generate new invitation token
//     const invitationToken = nanoid(32)
//     const invitationExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

//     await db.teamMember.update({
//       where: { id: memberId },
//       data: {
//         invitationToken,
//         invitationExpiry,
//       },
//     })

//     // Send invitation email
//     const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitationToken}`

//     try {
//       await resend.emails.send({
//         from: "ReachAI <noreply@reachai.com>",
//         to: teamMember.email,
//         subject: `Reminder: ${user.name || user.email} invited you to join their ReachAI team`,
//         html: `
//           <h2>You've been invited to join ${user.name || user.email}'s team on ReachAI</h2>
//           <p>You've been invited as a <strong>${teamMember.role.toLowerCase()}</strong>.</p>
//           <p>Click the link below to accept the invitation:</p>
//           <a href="${invitationUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Accept Invitation</a>
//           <p>This invitation expires in 7 days.</p>
//           <p>If you didn't expect this invitation, you can safely ignore this email.</p>
//         `,
//       })
//     } catch (emailError) {
//       console.error("Failed to send invitation email:", emailError)
//       return { success: false, error: "Failed to send email" }
//     }

//     revalidatePath("/dashboard/settings")

//     return { success: true }
//   } catch (error) {
//     console.error("Error resending invitation:", error)
//     return { success: false, error: "Failed to resend invitation" }
//   }
// }

// export async function acceptInvitation(token: string) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return { success: false, error: "Unauthorized" }
//     }

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       return { success: false, error: "User not found" }
//     }

//     // Find invitation by token
//     const invitation = await db.teamMember.findFirst({
//       where: {
//         invitationToken: token,
//         status: "PENDING",
//       },
//     })

//     if (!invitation) {
//       return { success: false, error: "Invalid or expired invitation" }
//     }

//     // Check if invitation has expired
//     if (invitation.invitationExpiry && invitation.invitationExpiry < new Date()) {
//       return { success: false, error: "This invitation has expired" }
//     }

//     // Check if the email matches the logged-in user
//     if (invitation.email !== user.email) {
//       return {
//         success: false,
//         error: "This invitation was sent to a different email address",
//       }
//     }

//     // Accept the invitation
//     await db.teamMember.update({
//       where: { id: invitation.id },
//       data: {
//         status: "ACCEPTED",
//         acceptedAt: new Date(),
//         invitationToken: null,
//       },
//     })

//     revalidatePath("/dashboard")

//     return { success: true }
//   } catch (error) {
//     console.error("Error accepting invitation:", error)
//     return { success: false, error: "Failed to accept invitation" }
//   }
// }

// export async function declineInvitation(token: string) {
//   try {
//     // Find invitation by token
//     const invitation = await db.teamMember.findFirst({
//       where: {
//         invitationToken: token,
//         status: "PENDING",
//       },
//     })

//     if (!invitation) {
//       return { success: false, error: "Invalid or expired invitation" }
//     }

//     // Update status to declined
//     await db.teamMember.update({
//       where: { id: invitation.id },
//       data: {
//         status: "DECLINED",
//         invitationToken: null,
//       },
//     })

//     return { success: true }
//   } catch (error) {
//     console.error("Error declining invitation:", error)
//     return { success: false, error: "Failed to decline invitation" }
//   }
// }


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
        from: "ReachAI <noreply@reachai.com>",
        to: email,
        subject: `${user.name || user.email} invited you to join their ReachAI team`,
        html: `
          <h2>You've been invited to join ${user.name || user.email}'s team on ReachAI</h2>
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
        from: "ReachAI <noreply@reachai.com>",
        to: teamMember.email,
        subject: `Reminder: ${user.name || user.email} invited you to join their ReachAI team`,
        html: `
          <h2>You've been invited to join ${user.name || user.email}'s team on ReachAI</h2>
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
