"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Search, Download, Eye, Loader2, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { EnhancedEmailTemplate } from "@/lib/types"
import { cloneSystemTemplate } from "@/lib/actions/templates"
import { toast } from "sonner"

interface SystemTemplatesProps {
  templates: EnhancedEmailTemplate[]
}

export function SystemTemplates({ templates }: SystemTemplatesProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState("")
  const [previewTemplate, setPreviewTemplate] = useState<EnhancedEmailTemplate | null>(null)
  const [cloningId, setCloningId] = useState<string | null>(null)

  const filteredTemplates = templates.filter((template) => {
    const query = searchQuery.toLowerCase()
    return (
      template.name.toLowerCase().includes(query) ||
      template.category?.toLowerCase().includes(query) ||
      template.description?.toLowerCase().includes(query)
    )
  })

  const handleClone = async (template: EnhancedEmailTemplate) => {
    setCloningId(template.id)
    startTransition(async () => {
      const result = await cloneSystemTemplate(template.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Template added to your library")
        router.push(`/dashboard/templates/${result.template?.id}/edit`)
      }
      setCloningId(null)
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      welcome: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      newsletter: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      promotional: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      transactional: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      followup: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
      notification: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    }
    return colors[category?.toLowerCase()] || "bg-muted text-muted-foreground"
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <FolderOpen className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div>
          <h2 className="font-semibold">Template Gallery</h2>
          <p className="text-sm text-muted-foreground">Start with a professionally designed template</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Templates grid */}
      <ScrollArea className="flex-1 -mx-1 px-1">
        {filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">No templates found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={cn(
                  "group relative flex flex-col p-4 rounded-xl",
                  "bg-card/50 border border-border/50",
                  "hover:bg-card hover:border-border hover:shadow-lg",
                  "transition-all duration-200",
                )}
              >
                {/* Category badge */}
                {template.category && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "absolute top-3 right-3 text-[10px] px-1.5 py-0 h-4",
                      getCategoryColor(template.category),
                    )}
                  >
                    {template.category}
                  </Badge>
                )}

                <h3 className="font-medium mb-1 pr-16">{template.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {template.description || template.subject || "No description"}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleClone(template)}
                    disabled={isPending && cloningId === template.id}
                  >
                    {isPending && cloningId === template.id ? (
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    Use
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Preview dialog - use body instead of content */}
      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {previewTemplate?.subject && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Subject</p>
                <p className="text-sm font-medium">{previewTemplate.subject}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Content</p>
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50 max-h-[400px] overflow-y-auto">
                <div className="whitespace-pre-wrap text-sm">{previewTemplate?.body}</div>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                if (previewTemplate) {
                  handleClone(previewTemplate)
                  setPreviewTemplate(null)
                }
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Use This Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
