
import { Suspense } from "react"
import { getTemplateCategories } from "@/lib/actions/template-actions"
import { TemplateEditor } from "@/components/templates/template-editor"
import type { TemplateCategory } from "@/lib/types"
import { WaveLoader } from "@/components/loader/wave-loader"

export const metadata = {
  title: "New Template",
  description: "Create a new email template",
}

async function NewTemplateContent() {
  const categoriesResult = await getTemplateCategories()

  const categories: TemplateCategory[] =
    categoriesResult.success && categoriesResult.categories
      ? categoriesResult.categories.map((name, index) => ({
          id: `cat-${index}`,
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
          description: `Templates for ${name.toLowerCase()}`,
          icon: "mail",
          color: "#3b82f6",
          order: index + 1,
          industry: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      : []

  const variables = [
    { name: "firstName", required: true, description: "Contact first name", defaultValue: "" },
    { name: "lastName", required: false, description: "Contact last name", defaultValue: "" },
    { name: "email", required: true, description: "Contact email", defaultValue: "" },
    { name: "companyName", required: false, description: "Company name", defaultValue: "" },
  ]

  return (
    <div className="h-screen flex flex-col bg-background w-full">
      <TemplateEditor categories={categories} variables={variables} mode="create" />
    </div>
  )
}

export default function NewTemplatePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-background flex items-center justify-center">
          {/* <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" /> */}
          <WaveLoader size="sm" bars={8} gap="tight" />
        </div>
      }
    >
      <NewTemplateContent />
    </Suspense>
  )
}
