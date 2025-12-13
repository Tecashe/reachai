import { TemplateEditor } from "@/components/templates/template-editor"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"

export const metadata = {
  title: "Create Template | Cold Email Platform",
  description: "Create a new email template",
}

export default async function NewTemplatePage() {
  const { userId } = await auth()

  if (!userId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Please sign in to create templates</p>
        </div>
      </div>
    )
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
        <h1 className="text-4xl font-bold mb-2">Create New Template</h1>
        <p className="text-muted-foreground text-lg">
          Build a custom email template with dynamic variables and live preview
        </p>
      </div>

      <TemplateEditor userId={userId} />
    </div>
  )
}
