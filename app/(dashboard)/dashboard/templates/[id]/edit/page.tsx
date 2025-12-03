import { notFound } from "next/navigation"
import { getTemplate, getTemplateCategories } from "@/lib/actions/templates"
import { TemplateEditor } from "@/components/templates/template-editor/template-editor"

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
  // Default variables since getTemplateVariables doesn't exist
  const variables = [
    { name: "firstName", required: true, description: "Contact first name" },
    { name: "lastName", required: false, description: "Contact last name" },
    { name: "email", required: true, description: "Contact email" },
    { name: "companyName", required: false, description: "Company name" },
    { name: "fullName", required: false, description: "Contact full name" },
  ]

  return <TemplateEditor template={templateResult.template} categories={categories} variables={variables} mode="edit" />
}
