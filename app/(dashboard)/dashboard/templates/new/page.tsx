import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft, Sparkles, FolderOpen, FileEdit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTemplateCategories, getSystemTemplates } from "@/lib/actions/templates"
import { AITemplateGenerator } from "@/components/templates/ai-template-generator"
import { SystemTemplates } from "@/components/templates/system-templates"
import { TemplateEditor } from "@/components/templates/template-editor/template-editor"

export const metadata = {
  title: "New Template",
  description: "Create a new email template",
}

async function NewTemplateContent() {
  const [categoriesResult, systemTemplates] = await Promise.all([getTemplateCategories(), getSystemTemplates()])

  const categories = categoriesResult.success ? (categoriesResult.categories ?? []) : []
  // Default variables since getTemplateVariables doesn't exist
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
          <p className="text-sm text-muted-foreground">Choose how you want to create your email template</p>
        </div>
      </header>

      {/* Main content */}
      <div className="container max-w-6xl py-8">
        <Tabs defaultValue="ai" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="ai" className="flex items-center gap-2 py-3 data-[state=active]:shadow-lg">
              <Sparkles className="w-4 h-4" />
              <div className="text-left">
                <p className="font-medium">AI Generate</p>
                <p className="text-xs text-muted-foreground hidden sm:block">Describe and generate</p>
              </div>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2 py-3 data-[state=active]:shadow-lg">
              <FolderOpen className="w-4 h-4" />
              <div className="text-left">
                <p className="font-medium">Gallery</p>
                <p className="text-xs text-muted-foreground hidden sm:block">Use a starter template</p>
              </div>
            </TabsTrigger>
            <TabsTrigger value="blank" className="flex items-center gap-2 py-3 data-[state=active]:shadow-lg">
              <FileEdit className="w-4 h-4" />
              <div className="text-left">
                <p className="font-medium">Blank</p>
                <p className="text-xs text-muted-foreground hidden sm:block">Start from scratch</p>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="min-h-[500px]">
            <AITemplateGenerator categories={categories} />
          </TabsContent>

          <TabsContent value="gallery" className="min-h-[500px]">
            <SystemTemplates templates={systemTemplates} />
          </TabsContent>

          <TabsContent value="blank">
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <TemplateEditor categories={categories} variables={variables} mode="create" />
            </div>
          </TabsContent>
        </Tabs>
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
