// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Search, Plus } from "lucide-react"
// import Link from "next/link"
// import { TemplatesList } from "@/components/templates/templates-list"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// export default function TemplatesPage() {
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
//           <p className="text-muted-foreground">Create and manage your email templates</p>
//         </div>
//         <Button asChild>
//           <Link href="/dashboard/templates/new">
//             <Plus className="h-4 w-4 mr-2" />
//             New Template
//           </Link>
//         </Button>
//       </div>

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
//           <TemplatesList />
//         </TabsContent>

//         <TabsContent value="cold-outreach" className="space-y-4">
//           <TemplatesList category="cold_outreach" />
//         </TabsContent>

//         <TabsContent value="follow-up" className="space-y-4">
//           <TemplatesList category="follow_up" />
//         </TabsContent>

//         <TabsContent value="meeting" className="space-y-4">
//           <TemplatesList category="meeting_request" />
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }



import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { TemplatesList } from "@/components/templates/templates-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateTemplateDialog } from "@/components/templates/create-template-dialog"
import { getTemplates } from "@/lib/actions/templates"

export default async function TemplatesPage() {
  const templates = await getTemplates()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-muted-foreground">Create and manage your email templates</p>
        </div>
        <CreateTemplateDialog />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search templates..." className="pl-9" />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="cold-outreach">Cold Outreach</TabsTrigger>
          <TabsTrigger value="follow-up">Follow-up</TabsTrigger>
          <TabsTrigger value="meeting">Meeting Request</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <TemplatesList templates={templates} />
        </TabsContent>

        <TabsContent value="cold-outreach" className="space-y-4">
          <TemplatesList templates={templates.filter((t) => t.category === "cold_outreach")} />
        </TabsContent>

        <TabsContent value="follow-up" className="space-y-4">
          <TemplatesList templates={templates.filter((t) => t.category === "follow_up")} />
        </TabsContent>

        <TabsContent value="meeting" className="space-y-4">
          <TemplatesList templates={templates.filter((t) => t.category === "meeting_request")} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
