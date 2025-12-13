import { notFound } from "next/navigation"
import { getTemplate } from "@/lib/actions/template-actions"
import { TemplateEditorForm } from "@/components/templates/template-editor-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"

export const metadata = {
  title: "Edit Template | Cold Email Platform",
  description: "Edit your email template",
}

interface TemplatePageProps {
  params: {
    id: string
  }
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { userId } = await auth()

  if (!userId) {
    return notFound()
  }

  const result = await getTemplate(userId, params.id)

  if (!result.success || !result.template) {
    return notFound()
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b px-6 py-4">
        <Link href="/templates">
          <Button variant="ghost" className="gap-2 mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Template</h1>
        <p className="text-muted-foreground">Update your email template and preview changes in real-time</p>
      </div>

      <div className="flex-1 overflow-hidden">
        <TemplateEditorForm userId={userId} template={result.template as any} />
      </div>
    </div>
  )
}
