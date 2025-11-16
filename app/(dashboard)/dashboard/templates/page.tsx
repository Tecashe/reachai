
// import { Input } from "@/components/ui/input"
// import { Search, Sparkles } from "lucide-react"
// import { TemplatesList } from "@/components/templates/templates-list"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { CreateTemplateDialog } from "@/components/templates/create-template-dialog"
// import { TemplateLibraryDialog } from "@/components/templates/templates-library-dialog"
// import { getTemplates } from "@/lib/actions/templates"
// import { Alert, AlertDescription } from "@/components/ui/alert"

// export default async function TemplatesPage() {
//   const templates = await getTemplates()

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
//           <p className="text-muted-foreground">Create and manage your email templates</p>
//         </div>
//         <div className="flex gap-2">
//           <CreateTemplateDialog />
//         </div>
//       </div>

//       <Alert className="border-primary/50 bg-primary/5">
//         <Sparkles className="h-4 w-4 text-primary" />
//         <AlertDescription className="flex items-center justify-between">
//           <span className="text-sm">
//             <strong>New to email templates?</strong> Browse our professional template library with 9 ready-to-use
//             templates for cold outreach, follow-ups, and meeting requests.
//           </span>
//           <TemplateLibraryDialog />
//         </AlertDescription>
//       </Alert>

//       <div className="flex items-center gap-4">
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input placeholder="Search templates..." className="pl-9" />
//         </div>
//       </div>

//       <Tabs defaultValue="all" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="all">All Templates</TabsTrigger>
//           <TabsTrigger value="cold-outreach">Cold Outreach</TabsTrigger>
//           <TabsTrigger value="follow-up">Follow-up</TabsTrigger>
//           <TabsTrigger value="meeting">Meeting Request</TabsTrigger>
//         </TabsList>

//         <TabsContent value="all" className="space-y-4">
//           <TemplatesList templates={templates} />
//         </TabsContent>

//         <TabsContent value="cold-outreach" className="space-y-4">
//           <TemplatesList templates={templates.filter((t) => t.category === "cold_outreach")} />
//         </TabsContent>

//         <TabsContent value="follow-up" className="space-y-4">
//           <TemplatesList templates={templates.filter((t) => t.category === "follow_up")} />
//         </TabsContent>

//         <TabsContent value="meeting" className="space-y-4">
//           <TemplatesList templates={templates.filter((t) => t.category === "meeting_request")} />
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }
import { Suspense } from "react"
import { TemplateLibrary } from "@/components/templates/template-library"
import { TemplateLibrarySkeleton } from "@/components/templates/template-library-skeleton"

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Template Library</h1>
        <p className="text-muted-foreground mt-2">
          Choose from premium templates or create your own with AI
        </p>
      </div>

      <Suspense fallback={<TemplateLibrarySkeleton />}>
        <TemplateLibrary />
      </Suspense>
    </div>
  )
}
