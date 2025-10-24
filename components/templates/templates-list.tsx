// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { MoreVertical, Copy, Edit, Trash2, TrendingUp } from "lucide-react"
// import Link from "next/link"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// const mockTemplates = [
//   {
//     id: "1",
//     name: "SaaS Founder Outreach",
//     category: "cold_outreach",
//     subject: "Quick question about {{company}}'s growth",
//     preview: "Hi {{firstName}}, I noticed {{company}} recently...",
//     timesUsed: 45,
//     avgOpenRate: 42.5,
//     avgReplyRate: 18.3,
//     aiGenerated: true,
//   },
//   {
//     id: "2",
//     name: "Follow-up After No Response",
//     category: "follow_up",
//     subject: "Re: {{previousSubject}}",
//     preview: "Hi {{firstName}}, Following up on my previous email...",
//     timesUsed: 32,
//     avgOpenRate: 38.2,
//     avgReplyRate: 15.7,
//     aiGenerated: false,
//   },
//   {
//     id: "3",
//     name: "Meeting Request - Enterprise",
//     category: "meeting_request",
//     subject: "15-minute chat about {{painPoint}}?",
//     preview: "Hi {{firstName}}, I'd love to learn more about how {{company}}...",
//     timesUsed: 28,
//     avgOpenRate: 45.8,
//     avgReplyRate: 22.1,
//     aiGenerated: true,
//   },
// ]

// interface TemplatesListProps {
//   category?: string
// }

// export function TemplatesList({ category }: TemplatesListProps) {
//   const filteredTemplates = category ? mockTemplates.filter((t) => t.category === category) : mockTemplates

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//       {filteredTemplates.map((template) => (
//         <Card key={template.id} className="hover:shadow-md transition-shadow">
//           <CardContent className="p-6">
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Link href={`/dashboard/templates/${template.id}`}>
//                     <h3 className="font-semibold hover:text-primary transition-colors">{template.name}</h3>
//                   </Link>
//                   {template.aiGenerated && (
//                     <Badge variant="secondary" className="text-xs">
//                       AI
//                     </Badge>
//                   )}
//                 </div>
//                 <Badge variant="outline" className="text-xs">
//                   {template.category.replace("_", " ")}
//                 </Badge>
//               </div>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="icon">
//                     <MoreVertical className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem>
//                     <Edit className="h-4 w-4 mr-2" />
//                     Edit
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <Copy className="h-4 w-4 mr-2" />
//                     Duplicate
//                   </DropdownMenuItem>
//                   <DropdownMenuItem className="text-destructive">
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>

//             <div className="space-y-3">
//               <div>
//                 <p className="text-xs text-muted-foreground mb-1">Subject:</p>
//                 <p className="text-sm font-medium">{template.subject}</p>
//               </div>

//               <div>
//                 <p className="text-xs text-muted-foreground mb-1">Preview:</p>
//                 <p className="text-sm text-muted-foreground line-clamp-2">{template.preview}</p>
//               </div>

//               <div className="pt-3 border-t border-border space-y-2">
//                 <div className="flex items-center justify-between text-xs">
//                   <span className="text-muted-foreground">Used {template.timesUsed} times</span>
//                   <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
//                     <TrendingUp className="h-3 w-3" />
//                     {template.avgReplyRate}% reply
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}

//       {filteredTemplates.length === 0 && (
//         <Card className="col-span-full">
//           <CardContent className="p-12 text-center">
//             <p className="text-muted-foreground mb-4">No templates found</p>
//             <Button asChild>
//               <Link href="/dashboard/templates/new">Create Your First Template</Link>
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }

// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { MoreVertical, Copy, Edit, Trash2, TrendingUp } from "lucide-react"
// import Link from "next/link"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { getTemplates } from "@/lib/actions/templates"

// interface TemplatesListProps {
//   category?: string
// }

// export async function TemplatesList({ category }: TemplatesListProps) {
//   const templates = await getTemplates(category).catch(() => [])

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//       {templates.map((template) => (
//         <Card key={template.id} className="hover:shadow-md transition-shadow">
//           <CardContent className="p-6">
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Link href={`/dashboard/templates/${template.id}`}>
//                     <h3 className="font-semibold hover:text-primary transition-colors">{template.name}</h3>
//                   </Link>
//                   {template.aiGenerated && (
//                     <Badge variant="secondary" className="text-xs">
//                       AI
//                     </Badge>
//                   )}
//                 </div>
//                 {template.category && (
//                   <Badge variant="outline" className="text-xs">
//                     {template.category.replace("_", " ")}
//                   </Badge>
//                 )}
//               </div>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="icon">
//                     <MoreVertical className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem>
//                     <Edit className="h-4 w-4 mr-2" />
//                     Edit
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <Copy className="h-4 w-4 mr-2" />
//                     Duplicate
//                   </DropdownMenuItem>
//                   <DropdownMenuItem className="text-destructive">
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>

//             <div className="space-y-3">
//               <div>
//                 <p className="text-xs text-muted-foreground mb-1">Subject:</p>
//                 <p className="text-sm font-medium line-clamp-1">{template.subject}</p>
//               </div>

//               <div>
//                 <p className="text-xs text-muted-foreground mb-1">Preview:</p>
//                 <p className="text-sm text-muted-foreground line-clamp-2">{template.body.substring(0, 100)}...</p>
//               </div>

//               <div className="pt-3 border-t border-border space-y-2">
//                 <div className="flex items-center justify-between text-xs">
//                   <span className="text-muted-foreground">Used {template.timesUsed} times</span>
//                   {template.avgReplyRate && (
//                     <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
//                       <TrendingUp className="h-3 w-3" />
//                       {Math.round(template.avgReplyRate * 10) / 10}% reply
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}

//       {templates.length === 0 && (
//         <Card className="col-span-full">
//           <CardContent className="p-12 text-center">
//             <p className="text-muted-foreground mb-4">No templates found</p>
//             <Button asChild>
//               <Link href="/dashboard/templates/new">Create Your First Template</Link>
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }

// "use client"

// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { MoreVertical, Copy, Edit, Trash2, TrendingUp } from "lucide-react"
// import Link from "next/link"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// interface TemplatesListProps {
//   templates: Array<{
//     id: string
//     name: string
//     description: string | null
//     category: string | null
//     subject: string
//     body: string
//     aiGenerated: boolean
//     timesUsed: number
//     avgOpenRate: number | null
//     avgReplyRate: number | null
//   }>
// }

// export function TemplatesList({ templates }: TemplatesListProps) {
//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//       {templates.map((template) => (
//         <Card key={template.id} className="hover:shadow-md transition-shadow">
//           <CardContent className="p-6">
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Link href={`/dashboard/templates/${template.id}`}>
//                     <h3 className="font-semibold hover:text-primary transition-colors">{template.name}</h3>
//                   </Link>
//                   {template.aiGenerated && (
//                     <Badge variant="secondary" className="text-xs">
//                       AI
//                     </Badge>
//                   )}
//                 </div>
//                 {template.category && (
//                   <Badge variant="outline" className="text-xs">
//                     {template.category.replace("_", " ")}
//                   </Badge>
//                 )}
//               </div>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="icon">
//                     <MoreVertical className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem>
//                     <Edit className="h-4 w-4 mr-2" />
//                     Edit
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <Copy className="h-4 w-4 mr-2" />
//                     Duplicate
//                   </DropdownMenuItem>
//                   <DropdownMenuItem className="text-destructive">
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>

//             <div className="space-y-3">
//               <div>
//                 <p className="text-xs text-muted-foreground mb-1">Subject:</p>
//                 <p className="text-sm font-medium line-clamp-1">{template.subject}</p>
//               </div>

//               <div>
//                 <p className="text-xs text-muted-foreground mb-1">Preview:</p>
//                 <p className="text-sm text-muted-foreground line-clamp-2">{template.body.substring(0, 100)}...</p>
//               </div>

//               <div className="pt-3 border-t border-border space-y-2">
//                 <div className="flex items-center justify-between text-xs">
//                   <span className="text-muted-foreground">Used {template.timesUsed} times</span>
//                   {template.avgReplyRate && (
//                     <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
//                       <TrendingUp className="h-3 w-3" />
//                       {Math.round(template.avgReplyRate * 10) / 10}% reply
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}

//       {templates.length === 0 && (
//         <Card className="col-span-full">
//           <CardContent className="p-12 text-center">
//             <p className="text-muted-foreground mb-4">No templates found</p>
//             <Button asChild>
//               <Link href="/dashboard/templates/new">Create Your First Template</Link>
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Copy, Edit, Trash2, TrendingUp } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { deleteTemplate, duplicateTemplate } from "@/lib/actions/templates"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TemplatesListProps {
  templates: Array<{
    id: string
    name: string
    description: string | null
    category: string | null
    subject: string
    body: string
    aiGenerated: boolean
    timesUsed: number
    avgReplyRate: number | null
  }>
}

export function TemplatesList({ templates }: TemplatesListProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)

  const handleDuplicate = async (templateId: string) => {
    const result = await duplicateTemplate(templateId)
    if (result.success) {
      toast.success("Template duplicated successfully")
      router.refresh()
    } else {
      toast.error(result.error || "Failed to duplicate template")
    }
  }

  const handleDelete = async () => {
    if (!templateToDelete) return

    const result = await deleteTemplate(templateToDelete)
    if (result.success) {
      toast.success("Template deleted successfully")
      setDeleteDialogOpen(false)
      setTemplateToDelete(null)
      router.refresh()
    } else {
      toast.error(result.error || "Failed to delete template")
    }
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Link href={`/dashboard/templates/${template.id}`}>
                      <h3 className="font-semibold hover:text-primary transition-colors">{template.name}</h3>
                    </Link>
                    {template.aiGenerated && (
                      <Badge variant="secondary" className="text-xs">
                        AI
                      </Badge>
                    )}
                  </div>
                  {template.category && (
                    <Badge variant="outline" className="text-xs">
                      {template.category.replace("_", " ")}
                    </Badge>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/templates/${template.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(template.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => {
                        setTemplateToDelete(template.id)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Subject:</p>
                  <p className="text-sm font-medium line-clamp-1">{template.subject}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{template.body.substring(0, 100)}...</p>
                </div>

                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Used {template.timesUsed} times</span>
                    {template.avgReplyRate && (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <TrendingUp className="h-3 w-3" />
                        {Math.round(template.avgReplyRate * 10) / 10}% reply
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {templates.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No templates found</p>
              <Button asChild>
                <Link href="/dashboard/templates/new">Create Your First Template</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
