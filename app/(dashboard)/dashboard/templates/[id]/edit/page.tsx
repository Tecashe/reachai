
import { notFound, redirect } from "next/navigation"
import { TemplateEditor } from "@/components/templates/template-editor"
import { auth } from "@clerk/nextjs/server"
import type { TemplateCategory } from "@/lib/types"
import { prisma } from "@/lib/db"
import { getTemplate } from "@/lib/actions/templates"

interface EditTemplatePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditTemplatePageProps) {
  const { id } = await params
  const { userId } = await auth()

  if (!userId) {
    return {
      title: "Edit Template",
      description: "Edit your email template",
    }
  }

  const template = await prisma.emailTemplate.findUnique({
    where: { id },
  })

  return {
    title: template ? `Edit ${template.name}` : "Edit Template",
    description: "Edit your email template",
  }
}

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  const { userId } = await auth()

  if (!userId) {
    notFound()
  }

  const { id } = await params

  const rawTemplate = await prisma.emailTemplate.findUnique({
    where: { id },
  })

  if (!rawTemplate) {
    notFound()
  }

  const currentUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!currentUser) {
    notFound()
  }

  if (rawTemplate.isSystemTemplate || rawTemplate.userId !== currentUser.id) {
    redirect(`/dashboard/templates/${id}/use`)
  }

  // Now fetch the template with proper formatting
  const templateResult = await getTemplate(id)

  if (!templateResult.success || !templateResult.template) {
    notFound()
  }

  const categories: TemplateCategory[] = [
    {
      id: "1",
      name: "Cold Outreach",
      slug: "cold-outreach",
      description: "Templates for initial contact with prospects",
      icon: "mail",
      color: "#3b82f6",
      order: 1,
      industry: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "Follow-up",
      slug: "follow-up",
      description: "Templates for following up with leads",
      icon: "repeat",
      color: "#8b5cf6",
      order: 2,
      industry: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      name: "Meeting Request",
      slug: "meeting-request",
      description: "Templates for scheduling meetings",
      icon: "calendar",
      color: "#10b981",
      order: 3,
      industry: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "4",
      name: "Product Demo",
      slug: "product-demo",
      description: "Templates for demo invitations",
      icon: "presentation",
      color: "#f59e0b",
      order: 4,
      industry: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const variables = [
    { name: "firstName", required: true, description: "Contact first name", defaultValue: "" },
    { name: "lastName", required: false, description: "Contact last name", defaultValue: "" },
    { name: "email", required: true, description: "Contact email", defaultValue: "" },
    { name: "companyName", required: false, description: "Company name", defaultValue: "" },
  ]

  return (
    <div className="h-screen flex flex-col bg-background w-full">
      <TemplateEditor template={templateResult.template} categories={categories} variables={variables} mode="edit" />
    </div>
  )
}
