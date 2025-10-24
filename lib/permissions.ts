import type { TeamRole } from "@prisma/client"
import { db } from "@/lib/db"

// Define what each role can do
export const ROLE_PERMISSIONS = {
  OWNER: {
    campaigns: { create: true, read: true, update: true, delete: true },
    prospects: { create: true, read: true, update: true, delete: true },
    templates: { create: true, read: true, update: true, delete: true },
    sequences: { create: true, read: true, update: true, delete: true },
    analytics: { read: true },
    settings: { read: true, update: true },
    team: { invite: true, remove: true, updateRoles: true },
    billing: { read: true, update: true },
    integrations: { create: true, read: true, update: true, delete: true },
  },
  ADMIN: {
    campaigns: { create: true, read: true, update: true, delete: true },
    prospects: { create: true, read: true, update: true, delete: true },
    templates: { create: true, read: true, update: true, delete: true },
    sequences: { create: true, read: true, update: true, delete: true },
    analytics: { read: true },
    settings: { read: true, update: false },
    team: { invite: true, remove: false, updateRoles: false },
    billing: { read: true, update: false },
    integrations: { create: true, read: true, update: true, delete: false },
  },
  MEMBER: {
    campaigns: { create: true, read: true, update: true, delete: false },
    prospects: { create: true, read: true, update: true, delete: false },
    templates: { create: true, read: true, update: true, delete: false },
    sequences: { create: true, read: true, update: true, delete: false },
    analytics: { read: true },
    settings: { read: true, update: false },
    team: { invite: false, remove: false, updateRoles: false },
    billing: { read: false, update: false },
    integrations: { create: false, read: true, update: false, delete: false },
  },
  VIEWER: {
    campaigns: { create: false, read: true, update: false, delete: false },
    prospects: { create: false, read: true, update: false, delete: false },
    templates: { create: false, read: true, update: false, delete: false },
    sequences: { create: false, read: true, update: false, delete: false },
    analytics: { read: true },
    settings: { read: false, update: false },
    team: { invite: false, remove: false, updateRoles: false },
    billing: { read: false, update: false },
    integrations: { create: false, read: true, update: false, delete: false },
  },
} as const

export type Resource = keyof typeof ROLE_PERMISSIONS.OWNER
export type Action = "create" | "read" | "update" | "delete" | "invite" | "remove" | "updateRoles"

/**
 * Check if a user has permission to perform an action on a resource
 */
export async function checkPermission(userId: string, resource: Resource, action: Action): Promise<boolean> {
  // Get user's role in the system
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  })

  if (!user) return false

  // Super admins can do anything
  if (user.role === "SUPER_ADMIN") return true

  // Check if user is owner (has no team membership, owns the account)
  const teamMembership = await db.teamMember.findFirst({
    where: {
      userId: user.id,
      status: "ACCEPTED",
    },
  })

  // If no team membership, user is the owner
  const role: TeamRole = teamMembership?.role || "OWNER"

  // Check permission
  const permissions = ROLE_PERMISSIONS[role]
  const resourcePermissions = permissions[resource] as any

  return resourcePermissions?.[action] === true
}

/**
 * Require permission or throw error
 */
export async function requirePermission(userId: string, resource: Resource, action: Action): Promise<void> {
  const hasPermission = await checkPermission(userId, resource, action)

  if (!hasPermission) {
    throw new Error(`Insufficient permissions to ${action} ${resource}`)
  }
}

/**
 * Get user's role in a workspace
 */
export async function getUserRole(userId: string): Promise<TeamRole> {
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  })

  if (!user) return "VIEWER"

  const teamMembership = await db.teamMember.findFirst({
    where: {
      userId: user.id,
      status: "ACCEPTED",
    },
  })

  return teamMembership?.role || "OWNER"
}
