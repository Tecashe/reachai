"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Eye, Code2, Sparkles, TrendingUp, Star, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EnhancedEmailTemplate } from "@/lib/types"

interface TemplatePreviewDialogProps {
  template: EnhancedEmailTemplate
  open: boolean
  onOpenChange: (open: boolean) => void
  onUseTemplate?: () => void
}

export function TemplatePreviewDialog({ template, open, onOpenChange, onUseTemplate }: TemplatePreviewDialogProps) {
  const [previewMode, setPreviewMode] = React.useState<"rendered" | "raw">("rendered")

  // Sample data for variable replacement
  const sampleVariables: Record<string, string> = {
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    email: "john@company.com",
    company: "Acme Inc",
    companyName: "Acme Inc",
    jobTitle: "VP of Sales",
    title: "VP of Sales",
    industry: "Technology",
    companySize: "50-100",
    skillArea: "B2B Sales",
    candidateName: "John Doe",
    recruiterName: "Jane Smith",
    senderName: "Your Name",
    senderCompany: "Your Company",
    salary: "$120k-$150k",
    salaryRange: "$120k-$150k",
    benefit1: "Health Insurance",
    benefit2: "401k Matching",
    responsibility1: "Lead sales team",
    responsibility2: "Develop strategy",
    responsibility3: "Close deals",
    applicationUrl: "https://example.com/apply",
  }

  // Replace variables in content
  const replaceVariables = (content: string) => {
    let result = content
    Object.entries(sampleVariables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "gi")
      result = result.replace(regex, value)
    })
    return result
  }

  const renderedSubject = replaceVariables(template.subject)
  const renderedBody = replaceVariables(template.body)

  const formatBodyForDisplay = (text: string) => {
    // Split by double line breaks for paragraphs
    const paragraphs = text.split("\n\n")
    return paragraphs
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
      .map((p) => `<p style="margin-bottom: 1em;">${p.replace(/\n/g, "<br>")}</p>`)
      .join("")
  }

  // Extract variables from template
  const extractedVariables = React.useMemo(() => {
    const variablePattern = /\{\{([^}]+)\}\}/g
    const found = new Set<string>()
    const allText = `${template.subject} ${template.body}`
    let match
    while ((match = variablePattern.exec(allText)) !== null) {
      found.add(match[1])
    }
    return Array.from(found)
  }, [template.subject, template.body])

  // Parse template variables from JSON if available
  const templateVariables = React.useMemo(() => {
    if (!template.variables) return []
    try {
      const vars = template.variables as any
      if (Array.isArray(vars)) return vars
      return []
    } catch {
      return []
    }
  }, [template.variables])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <DialogTitle className="text-xl">{template.name}</DialogTitle>
                {template.isSystemTemplate && (
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    System
                  </Badge>
                )}
                {template.isFavorite && (
                  <Badge variant="outline" className="gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    Favorite
                  </Badge>
                )}
              </div>
              {template.description && (
                <DialogDescription className="text-sm">{template.description}</DialogDescription>
              )}
              <div className="flex items-center gap-2 mt-3">
                {template.category && <Badge variant="outline">{template.category}</Badge>}
                {template.industry && (
                  <Badge variant="outline" className="capitalize">
                    {template.industry}
                  </Badge>
                )}
                {template.tags && template.tags.length > 0 && (
                  <>
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Template Stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Copy className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Used</span>
              <span className="font-medium">{template.timesUsed || 0} times</span>
            </div>
            {template.avgOpenRate && template.avgOpenRate > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Avg Open Rate</span>
                <span className="font-medium">{template.avgOpenRate.toFixed(1)}%</span>
              </div>
            )}
            {template.avgReplyRate && template.avgReplyRate > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Avg Reply Rate</span>
                <span className="font-medium">{template.avgReplyRate.toFixed(1)}%</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as "rendered" | "raw")} className="h-full">
            <div className="border-b px-6 py-2">
              <TabsList>
                <TabsTrigger value="rendered" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="raw" className="gap-2">
                  <Code2 className="h-4 w-4" />
                  Raw Template
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="h-[calc(90vh-280px)]">
              <TabsContent value="rendered" className="p-6 mt-0">
                <div className="max-w-2xl mx-auto">
                  <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                    {/* Email header */}
                    <div className="border-b bg-muted/30 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">Subject</p>
                          <p className="text-base font-semibold text-foreground mt-1">{renderedSubject}</p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1 mt-3">
                        <div className="flex gap-2">
                          <span className="font-medium">From:</span>
                          <span>your.name@company.com</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-medium">To:</span>
                          <span>john@company.com</span>
                        </div>
                      </div>
                    </div>

                    {/* Email body */}
                    <div className="p-6 bg-background">
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        style={{
                          fontFamily: "system-ui, -apple-system, sans-serif",
                          lineHeight: "1.6",
                        }}
                        dangerouslySetInnerHTML={{
                          __html:
                            template.templateType === "HTML" || template.templateType === "VISUAL"
                              ? renderedBody
                              : formatBodyForDisplay(renderedBody),
                        }}
                      />
                    </div>
                  </div>

                  {/* Variables used */}
                  {extractedVariables.length > 0 && (
                    <div className="mt-6 p-4 rounded-lg border bg-muted/30">
                      <h4 className="text-sm font-medium mb-3">Variables in this template</h4>
                      <div className="flex flex-wrap gap-2">
                        {extractedVariables.map((variable) => (
                          <Badge key={variable} variant="secondary" className="font-mono text-xs">
                            {`{{${variable}}}`}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        These will be automatically replaced with prospect data when sending
                      </p>
                    </div>
                  )}

                  {/* Template metadata */}
                  {templateVariables.length > 0 && (
                    <div className="mt-4 p-4 rounded-lg border bg-muted/30">
                      <h4 className="text-sm font-medium mb-3">Variable Definitions</h4>
                      <div className="space-y-2">
                        {templateVariables.map((v: any, i: number) => (
                          <div key={i} className="flex items-start gap-3 text-sm">
                            <code className="px-2 py-1 rounded bg-background font-mono text-xs">{`{{${v.name}}}`}</code>
                            <div className="flex-1">
                              {v.description && <p className="text-muted-foreground">{v.description}</p>}
                              {v.required && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  Required
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="raw" className="p-6 mt-0">
                <div className="max-w-2xl mx-auto space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-2 block">Subject Line</Label>
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <code className="text-sm font-mono">{template.subject}</code>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-2 block">Email Body</Label>
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <pre className="text-sm font-mono whitespace-pre-wrap text-foreground">{template.body}</pre>
                    </div>
                  </div>

                  {template.tags && template.tags.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground mb-2 block">Tags</Label>
                        <div className="flex flex-wrap gap-2">
                          {template.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-xs text-muted-foreground">
            
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {onUseTemplate && (
              <Button onClick={onUseTemplate} className="gap-2">
                <Copy className="h-4 w-4" />
                Use Template
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-sm font-medium", className)}>{children}</div>
}
