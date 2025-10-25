import { notFound } from "next/navigation"
import { getTemplate } from "@/lib/actions/templates"
import { EditTemplateForm } from "@/components/templates/edit-template-form"

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getTemplate(id)

  if (!result.success || !result.template) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Template</h1>
        <p className="text-muted-foreground">Update your email template details and content</p>
      </div>

      <EditTemplateForm template={result.template} />
    </div>
  )
}
