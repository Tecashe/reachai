"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Edit, X } from 'lucide-react'
import Image from "next/image"

interface TemplatePreviewDialogProps {
  template: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onUse: () => void
  onDuplicate: () => void
}

export function TemplatePreviewDialog({
  template,
  open,
  onOpenChange,
  onUse,
  onDuplicate
}: TemplatePreviewDialogProps) {
  // Render email body with images
  const renderEmailBody = (body: string) => {
    return { __html: body.replace(/\n/g, '<br />') }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <DialogTitle className="text-2xl">{template.name}</DialogTitle>
                <DialogDescription>{template.description}</DialogDescription>
                <div className="flex flex-wrap gap-2 pt-2">
                  {template.industry && (
                    <Badge variant="secondary">{template.industry}</Badge>
                  )}
                  {template.category && (
                    <Badge variant="outline">{template.category}</Badge>
                  )}
                  {template.isSystemTemplate && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      Premium Template
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          <Separator />

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {/* Preview Image */}
              {template.previewImageUrl && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={template.previewImageUrl || "/placeholder.svg"}
                    alt={`${template.name} preview`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Subject Line */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Subject Line
                </h3>
                <p className="text-lg font-medium">{template.subject}</p>
              </div>

              <Separator />

              {/* Email Body */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Email Body
                </h3>
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert bg-card border rounded-lg p-6"
                  dangerouslySetInnerHTML={renderEmailBody(template.body)}
                />
              </div>

              {/* Variables */}
              {template.variables && template.variables.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Available Variables
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {template.variables.map((variable: string) => (
                        <Badge key={variable} variant="secondary" className="font-mono">
                          {`{{${variable}}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          <Separator />

          <div className="p-6 pt-4 flex gap-3">
            <Button onClick={onUse} className="flex-1" size="lg">
              <Edit className="mr-2 h-4 w-4" />
              Use & Customize Template
            </Button>
            <Button onClick={onDuplicate} variant="outline" size="lg">
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
