import { Suspense } from "react"
import { getTemplates, getTemplateCategories } from "@/lib/actions/templates"
import { TemplateLibrary } from "@/components/templates/template-library"
import { TemplateLibrarySkeleton } from "@/components/templates/template-library-skeleton"

export const metadata = {
  title: "Email Templates",
  description: "Manage your email templates",
}

async function TemplateLibraryLoader() {
  const [templates, categoriesResult] = await Promise.all([getTemplates(), getTemplateCategories()])

  const categories = categoriesResult.success ? (categoriesResult.categories ?? []) : []

  return <TemplateLibrary templates={templates} categories={categories} />
}

export default function TemplatesPage() {
  return (
    <div className="container max-w-7xl py-8">
      <Suspense fallback={<TemplateLibrarySkeleton />}>
        <TemplateLibraryLoader />
      </Suspense>
    </div>
  )
}
