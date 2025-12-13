import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTemplate } from "@/lib/actions/template-actions"
import { TemplateEditor } from "@/components/templates/template-editor"
import { auth } from "@clerk/nextjs/server"
import type { TemplateCategory } from "@/lib/types"

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

  const result = await getTemplate(userId, id)

  return {
    title: result.template ? `Edit ${result.template.name}` : "Edit Template",
    description: "Edit your email template",
  }
}

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  const { userId } = await auth()

  if (!userId) {
    notFound()
  }

  const { id } = await params

  const templateResult = await getTemplate(userId, id)

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-4 px-6 py-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href="/dashboard/templates">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-semibold">Edit Template</h1>
          <p className="text-sm text-muted-foreground">{templateResult.template.name}</p>
        </div>
      </header>

      {/* Main content */}
      <div className="container max-w-7xl py-8">
        <TemplateEditor template={templateResult.template} categories={categories} variables={variables} mode="edit" />
      </div>
    </div>
  )
}
