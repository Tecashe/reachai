import { notFound, redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { UseTemplateClient } from "@/components/templates/use-template-client"

interface UseTemplatePageProps {
  params: Promise<{ id: string }>
}

export default async function UseTemplatePage({ params }: UseTemplatePageProps) {
  const { userId } = await auth()

  if (!userId) {
    notFound()
  }

  const { id } = await params

  const template = await prisma.emailTemplate.findUnique({
    where: { id },
  })

  if (!template) {
    notFound()
  }

  const currentUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!currentUser) {
    notFound()
  }

  // If user already owns this template, redirect to edit
  if (template.userId === currentUser.id && !template.isSystemTemplate) {
    redirect(`/dashboard/templates/${id}/edit`)
  }

  return <UseTemplateClient templateId={id} templateName={template.name} />
}
