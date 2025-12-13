import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTemplate, getTemplateCategories } from "@/lib/actions/templates"
import { TemplateEditor } from "@/components/templates/template-editor"

interface EditTemplatePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditTemplatePageProps) {
  const { id } = await params
  const result = await getTemplate(id)

  return {
    title: result.template ? `Edit ${result.template.name}` : "Edit Template",
    description: "Edit your email template",
  }
}

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  const { id } = await params

  const [templateResult, categoriesResult] = await Promise.all([getTemplate(id), getTemplateCategories()])

  if (templateResult.error || !templateResult.template) {
    notFound()
  }

  const categories = categoriesResult.success ? (categoriesResult.categories ?? []) : []

  const variables = [
    { name: "firstName", required: true, description: "Contact first name" },
    { name: "lastName", required: false, description: "Contact last name" },
    { name: "email", required: true, description: "Contact email" },
    { name: "companyName", required: false, description: "Company name" },
    { name: "fullName", required: false, description: "Contact full name" },
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
