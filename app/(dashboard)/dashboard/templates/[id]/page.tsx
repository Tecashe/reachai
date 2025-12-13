import { notFound } from "next/navigation"
import { getTemplate } from "@/lib/actions/template-actions"
import { TemplateEditor } from "@/components/templates/template-editor"
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
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/templates">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mb-2">Edit Template</h1>
        <p className="text-muted-foreground text-lg">Update your email template and preview changes in real-time</p>
      </div>

      <TemplateEditor userId={userId} template={result.template} />
    </div>
  )
}
