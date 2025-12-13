"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createTemplateVersion(templateId: string, changeNote?: string) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    // Get the current template
    const template = await db.emailTemplate.findFirst({
      where: { id: templateId, userId },
    })

    if (!template) {
      return { success: false, error: "Template not found" }
    }

    // Get the latest version number
    const latestVersion = await db.templateVersion.findFirst({
      where: { templateId },
      orderBy: { version: "desc" },
    })

    const newVersionNumber = (latestVersion?.version || 0) + 1

    // Create new version
    const version = await db.templateVersion.create({
      data: {
        templateId,
        version: newVersionNumber,
        name: template.name,
        subject: template.subject,
        body: template.body,
        changeNote,
        createdBy: userId,
      },
    })

    revalidatePath(`/dashboard/templates/${templateId}/edit`)

    return { success: true, version }
  } catch (error) {
    console.error("[v0] Create template version error:", error)
    return { success: false, error: "Failed to create version" }
  }
}

export async function getTemplateVersions(templateId: string) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized", versions: [] }
    }

    const template = await db.emailTemplate.findFirst({
      where: { id: templateId, userId },
    })

    if (!template) {
      return { success: false, error: "Template not found", versions: [] }
    }

    const versions = await db.templateVersion.findMany({
      where: { templateId },
      orderBy: { version: "desc" },
      take: 50, // Limit to last 50 versions
    })

    // Add current template as a version
    const currentVersion = {
      id: `current-${template.id}`,
      templateId: template.id,
      version: (versions[0]?.version || 0) + 1,
      name: template.name,
      subject: template.subject,
      body: template.body,
      createdAt: template.updatedAt,
      isCurrent: true,
    }

    return {
      success: true,
      versions: [currentVersion, ...versions.map((v) => ({ ...v, isCurrent: false }))],
    }
  } catch (error) {
    console.error("[v0] Get template versions error:", error)
    return { success: false, error: "Failed to fetch versions", versions: [] }
  }
}

export async function restoreTemplateVersion(templateId: string, versionId: string) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    const template = await db.emailTemplate.findFirst({
      where: { id: templateId, userId },
    })

    if (!template) {
      return { success: false, error: "Template not found" }
    }

    // Get the version to restore
    const version = await db.templateVersion.findFirst({
      where: { id: versionId, templateId },
    })

    if (!version) {
      return { success: false, error: "Version not found" }
    }

    // Save current state as a version before restoring
    await createTemplateVersion(templateId, "Auto-saved before restore")

    // Restore the version
    await db.emailTemplate.update({
      where: { id: templateId },
      data: {
        name: version.name,
        subject: version.subject,
        body: version.body,
      },
    })

    revalidatePath(`/dashboard/templates/${templateId}/edit`)

    return { success: true }
  } catch (error) {
    console.error("[v0] Restore template version error:", error)
    return { success: false, error: "Failed to restore version" }
  }
}
