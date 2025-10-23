"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Library, Copy, Eye } from "lucide-react"
import { TEMPLATE_LIBRARY, type SystemTemplate } from "@/lib/constants"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function TemplateLibraryDialog() {
  const [open, setOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<SystemTemplate | null>(null)
  const router = useRouter()

  const handleCloneTemplate = async (template: SystemTemplate) => {
    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${template.name} (Copy)`,
          category: template.category,
          subject: template.subject,
          body: template.body,
          variables: template.variables,
        }),
      })

      if (!response.ok) throw new Error("Failed to clone template")

      const data = await response.json()
      toast.success("Template cloned successfully!")
      setOpen(false)
      router.push(`/dashboard/templates/${data.id}`)
      router.refresh()
    } catch (error) {
      toast.error("Failed to clone template")
      console.error(error)
    }
  }

  const coldOutreachTemplates = TEMPLATE_LIBRARY.filter((t) => t.category === "cold_outreach")
  const followUpTemplates = TEMPLATE_LIBRARY.filter((t) => t.category === "follow_up")
  const meetingTemplates = TEMPLATE_LIBRARY.filter((t) => t.category === "meeting_request")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Library className="h-4 w-4 mr-2" />
          Template Library
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Email Template Library</DialogTitle>
          <DialogDescription>Browse and clone professional email templates to get started quickly</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="cold_outreach" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cold_outreach">Cold Outreach ({coldOutreachTemplates.length})</TabsTrigger>
            <TabsTrigger value="follow_up">Follow-up ({followUpTemplates.length})</TabsTrigger>
            <TabsTrigger value="meeting_request">Meeting Request ({meetingTemplates.length})</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4">
            <TabsContent value="cold_outreach" className="space-y-4">
              {coldOutreachTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onClone={handleCloneTemplate}
                  onPreview={setSelectedTemplate}
                />
              ))}
            </TabsContent>

            <TabsContent value="follow_up" className="space-y-4">
              {followUpTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onClone={handleCloneTemplate}
                  onPreview={setSelectedTemplate}
                />
              ))}
            </TabsContent>

            <TabsContent value="meeting_request" className="space-y-4">
              {meetingTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onClone={handleCloneTemplate}
                  onPreview={setSelectedTemplate}
                />
              ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Preview Modal */}
        {selectedTemplate && (
          <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedTemplate.name}</DialogTitle>
                <DialogDescription>{selectedTemplate.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Subject:</p>
                  <p className="text-sm bg-muted p-3 rounded-md">{selectedTemplate.subject}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Body:</p>
                  <pre className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">{selectedTemplate.body}</pre>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Variables:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map((variable) => (
                      <Badge key={variable} variant="secondary">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button onClick={() => handleCloneTemplate(selectedTemplate)} className="w-full">
                  <Copy className="h-4 w-4 mr-2" />
                  Clone This Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}

function TemplateCard({
  template,
  onClone,
  onPreview,
}: {
  template: SystemTemplate
  onClone: (template: SystemTemplate) => void
  onPreview: (template: SystemTemplate) => void
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold mb-1">{template.name}</h4>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </div>
          <Badge variant="outline" className="ml-2">
            System
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Subject:</p>
            <p className="text-sm font-medium line-clamp-1">{template.subject}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Preview:</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{template.body.substring(0, 150)}...</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onPreview(template)} className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" onClick={() => onClone(template)} className="flex-1">
            <Copy className="h-4 w-4 mr-2" />
            Use Template
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
