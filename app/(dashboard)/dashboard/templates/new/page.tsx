import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTemplateCategories } from "@/lib/actions/templates"
import { TemplateEditor } from "@/components/templates/template-editor"

export const metadata = {
  title: "New Template",
  description: "Create a new email template",
}

async function NewTemplateContent() {
  const categoriesResult = await getTemplateCategories()
  const categories = categoriesResult.success ? (categoriesResult.categories ?? []) : []

  const variables = [
    { name: "firstName", required: true, description: "Contact first name" },
    { name: "lastName", required: false, description: "Contact last name" },
    { name: "email", required: true, description: "Contact email" },
    { name: "companyName", required: false, description: "Company name" },
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
          <h1 className="text-lg font-semibold">Create New Template</h1>
          <p className="text-sm text-muted-foreground">Design your email template</p>
        </div>
      </header>

      {/* Main content */}
      <div className="container max-w-7xl py-8">
        <TemplateEditor categories={categories} variables={variables} mode="create" />
      </div>
    </div>
  )
}

export default function NewTemplatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <NewTemplateContent />
    </Suspense>
  )
}
