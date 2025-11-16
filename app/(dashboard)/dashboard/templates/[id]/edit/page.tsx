// import { getTemplate } from "@/lib/actions/templates"
// import { VisualTemplateEditor } from "@/components/templates/template-editor/visual-template-editor"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft } from 'lucide-react'
// import Link from "next/link"
// import { redirect } from 'next/navigation'

// export default async function EditTemplatePage({ params }: { params: { id: string } }) {
//   const result = await getTemplate(params.id)

//   if (!result.success || !result.template) {
//     redirect("/dashboard/templates")
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-4">
//         <Button variant="ghost" size="icon" asChild>
//           <Link href={`/dashboard/templates/${params.id}`}>
//             <ArrowLeft className="h-5 w-5" />
//           </Link>
//         </Button>
//         <div>
//           <h1 className="text-balance text-3xl font-bold tracking-tight">Edit Template</h1>
//           <p className="text-muted-foreground">Use the visual editor to customize your template</p>
//         </div>
//       </div>

//       <VisualTemplateEditor template={result.template} />
//     </div>
//   )
// }

import { getTemplate } from "@/lib/actions/templates"
import { VisualTemplateEditor } from "@/components/templates/template-editor/visual-template-editor"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { redirect } from 'next/navigation'
import type { TemplateBlock } from "@/lib/types"

export default async function EditTemplatePage({ params }: { params: { id: string } }) {
  const result = await getTemplate(params.id)

  if (!result.success || !result.template) {
    redirect("/dashboard/templates")
  }

  const editorBlocks = result.template.editorBlocks as any
  const initialBlocks: TemplateBlock[] = editorBlocks?.blocks || []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/templates/${params.id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">Edit Template</h1>
          <p className="text-muted-foreground">Use the visual editor to customize your template</p>
        </div>
      </div>

      <VisualTemplateEditor 
        templateId={result.template.id} 
        initialBlocks={initialBlocks}
      />
    </div>
  )
}
