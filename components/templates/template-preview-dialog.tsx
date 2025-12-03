"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  X,
  Pencil,
  Copy,
  Smartphone,
  Monitor,
  Tablet,
  Star,
  Clock,
  Eye,
  TrendingUp,
  Mail,
  Sparkles,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { EnhancedEmailTemplate } from "@/lib/types"

interface TemplatePreviewDialogProps {
  template: EnhancedEmailTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type DevicePreview = "desktop" | "tablet" | "mobile"

export function TemplatePreviewDialog({ template, open, onOpenChange }: TemplatePreviewDialogProps) {
  const router = useRouter()
  const [devicePreview, setDevicePreview] = useState<DevicePreview>("desktop")

  if (!template) return null

  const openRate = template.avgOpenRate ?? 0
  const replyRate = template.avgReplyRate ?? 0

  const getDeviceWidth = () => {
    switch (devicePreview) {
      case "mobile":
        return "max-w-[375px]"
      case "tablet":
        return "max-w-[768px]"
      default:
        return "max-w-full"
    }
  }

  const renderContent = () => {
    if (!template.body) {
      return <div className="flex items-center justify-center h-64 text-muted-foreground">No content to preview</div>
    }

    if (template.body.includes("<") && (template.body.includes("</") || template.body.includes("/>"))) {
      return (
        <div
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: template.body }}
        />
      )
    }

    return <div className="whitespace-pre-wrap text-sm leading-relaxed">{template.body}</div>
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border/50 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {template.aiGenerated && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-medium text-primary">AI</span>
                  </div>
                )}
                {template.category && (
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                )}
                {template.isFavorite && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
              </div>
              <DialogTitle className="text-xl font-semibold truncate">{template.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1 truncate">{template.subject || "No subject line"}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false)
                  router.push(`/dashboard/templates/${template.id}/edit`)
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Preview panel */}
          <div className="flex-1 flex flex-col overflow-hidden bg-muted/30">
            {/* Device toggle */}
            <div className="flex items-center justify-center px-4 py-3 border-b border-border/50 bg-background/50">
              <Tabs value={devicePreview} onValueChange={(v) => setDevicePreview(v as DevicePreview)}>
                <TabsList className="h-8 p-1">
                  <TabsTrigger value="desktop" className="h-6 px-2.5 text-xs">
                    <Monitor className="w-3.5 h-3.5 mr-1.5" />
                    Desktop
                  </TabsTrigger>
                  <TabsTrigger value="tablet" className="h-6 px-2.5 text-xs">
                    <Tablet className="w-3.5 h-3.5 mr-1.5" />
                    Tablet
                  </TabsTrigger>
                  <TabsTrigger value="mobile" className="h-6 px-2.5 text-xs">
                    <Smartphone className="w-3.5 h-3.5 mr-1.5" />
                    Mobile
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Email preview */}
            <ScrollArea className="flex-1">
              <div className="p-6 flex justify-center">
                <div className={cn("w-full transition-all duration-300 ease-out", getDeviceWidth())}>
                  {/* Email frame */}
                  <div className="bg-background rounded-xl shadow-xl border border-border overflow-hidden">
                    {/* Email header */}
                    <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mail className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{template.subject || "No subject"}</p>
                          <p className="text-xs text-muted-foreground">From: Your Company</p>
                        </div>
                      </div>
                    </div>
                    {/* Email body */}
                    <div className="p-6">{renderContent()}</div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Side panel */}
          <div className="w-72 border-l border-border/50 flex flex-col bg-background">
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* Performance */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Performance</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Open Rate</span>
                      </div>
                      <p className="text-lg font-semibold">{openRate.toFixed(1)}%</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Reply Rate</span>
                      </div>
                      <p className="text-lg font-semibold">{replyRate.toFixed(1)}%</p>
                    </div>
                  </div>
                  {template.timesUsed > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Used {template.timesUsed.toLocaleString()} times
                    </p>
                  )}
                </div>

                <Separator />

                {/* Details */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Created</span>
                      <span>
                        {new Date(template.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Updated</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {new Date(template.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {template.category && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Category</span>
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Variables */}
                {template.variables && template.variables.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-3">Variables ({template.variables.length})</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {template.variables.map((variable, i) => (
                          <Badge key={i} variant="outline" className="text-xs font-mono">
                            {`{{${variable.name}}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>

            {/* Actions */}
            <div className="p-4 border-t border-border/50 space-y-2">
              <Button
                className="w-full"
                onClick={() => {
                  onOpenChange(false)
                  router.push(`/dashboard/templates/${template.id}/edit`)
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Template
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
