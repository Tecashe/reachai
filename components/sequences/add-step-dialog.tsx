"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Mail,
  Search,
  Clock,
  Sparkles,
  FileText,
  CheckCircle2,
  ArrowRight,
  Eye,
  Plus,
  Loader2,
  Star,
  Zap,
  TrendingUp,
} from "lucide-react"
import { getTemplates } from "@/lib/actions/templates"
import { addSequenceStep } from "@/lib/actions/sequences"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { EnhancedEmailTemplate } from "@/lib/types"

interface AddStepDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaignId: string
  afterStepNumber?: number
  onStepAdded?: () => void
}

export function AddStepDialog({ open, onOpenChange, campaignId, afterStepNumber, onStepAdded }: AddStepDialogProps) {
  const [activeTab, setActiveTab] = useState<"templates" | "blank">("templates")
  const [templates, setTemplates] = useState<EnhancedEmailTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<EnhancedEmailTemplate | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step configuration
  const [delayDays, setDelayDays] = useState(1)
  const [sendOnlyIfNotReplied, setSendOnlyIfNotReplied] = useState(true)
  const [sendOnlyIfNotOpened, setSendOnlyIfNotOpened] = useState(false)

  // Blank template state
  const [blankSubject, setBlankSubject] = useState("")
  const [blankBody, setBlankBody] = useState("")

  useEffect(() => {
    if (open) {
      loadTemplates()
    }
  }, [open])

  const loadTemplates = async () => {
    setIsLoading(true)
    try {
      const result = await getTemplates()
      // getTemplates returns the array directly, not { success, templates }
      if (Array.isArray(result)) {
        setTemplates(result as unknown as EnhancedEmailTemplate[])
      }
    } catch (error) {
      console.error("Failed to load templates:", error)
      toast.error("Failed to load templates")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddStep = async () => {
    if (activeTab === "templates" && !selectedTemplate) {
      toast.error("Please select a template")
      return
    }

    if (activeTab === "blank" && (!blankSubject || !blankBody)) {
      toast.error("Please fill in subject and body")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await addSequenceStep({
        campaignId,
        templateId: selectedTemplate?.id,
        subject: activeTab === "blank" ? blankSubject : undefined,
        body: activeTab === "blank" ? blankBody : undefined,
        delayDays,
        sendOnlyIfNotReplied,
        sendOnlyIfNotOpened,
        afterStepNumber,
      })

      if (result.success) {
        toast.success("Step added successfully")
        onOpenChange(false)
        onStepAdded?.()
        // Reset state
        setSelectedTemplate(null)
        setBlankSubject("")
        setBlankBody("")
        setDelayDays(1)
      } else {
        toast.error(result.error || "Failed to add step")
      }
    } catch (error) {
      toast.error("Failed to add step")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden rounded-3xl">
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 border-b bg-gradient-to-b from-muted/50 to-transparent">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-xl shadow-primary/20">
                <Plus className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Add Sequence Step</DialogTitle>
                <DialogDescription className="text-base mt-1">
                  {afterStepNumber ? `Insert after step ${afterStepNumber}` : "Add a new email to your sequence"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="flex flex-col lg:flex-row h-[600px]">
          {/* Left Panel - Template Selection */}
          <div className="flex-1 border-r">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "templates" | "blank")}
              className="h-full flex flex-col"
            >
              <div className="px-6 pt-4">
                <TabsList className="w-full grid grid-cols-2 h-12 p-1 bg-muted/50 rounded-xl">
                  <TabsTrigger value="templates" className="gap-2 rounded-lg data-[state=active]:shadow-md">
                    <FileText className="h-4 w-4" />
                    From Template
                  </TabsTrigger>
                  <TabsTrigger value="blank" className="gap-2 rounded-lg data-[state=active]:shadow-md">
                    <Sparkles className="h-4 w-4" />
                    Write New
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="templates" className="flex-1 mt-0 overflow-hidden">
                <div className="p-6 pb-0">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-11 h-12 rounded-xl bg-muted/30 border-0"
                    />
                  </div>
                </div>

                <ScrollArea className="flex-1 h-[380px] px-6 py-4">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                      <p className="text-muted-foreground">Loading templates...</p>
                    </div>
                  ) : filteredTemplates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground/50 mb-3" />
                      <p className="font-medium">No templates found</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Try a different search or create a new template
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTemplates.map((template) => {
                        const isSelected = selectedTemplate?.id === template.id
                        return (
                          <motion.button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={cn(
                              "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200",
                              isSelected
                                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                : "border-transparent bg-muted/30 hover:bg-muted/50 hover:border-muted",
                            )}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={cn(
                                  "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted",
                                )}
                              >
                                <Mail className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold truncate">{template.name}</h4>
                                  {template.isFavorite && (
                                    <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                                  )}
                                  {template.aiGenerated && (
                                    <Badge variant="secondary" className="text-[10px] h-5 gap-1">
                                      <Sparkles className="h-2.5 w-2.5" />
                                      AI
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{template.subject}</p>
                                {template.avgOpenRate && (
                                  <div className="flex items-center gap-3 mt-2">
                                    <span className="flex items-center gap-1 text-xs text-emerald-600">
                                      <TrendingUp className="h-3 w-3" />
                                      {Math.round(template.avgOpenRate)}% opens
                                    </span>
                                  </div>
                                )}
                              </div>
                              {isSelected && <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />}
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="blank" className="flex-1 mt-0 p-6 overflow-auto">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Subject Line</Label>
                    <Input
                      placeholder="Enter email subject..."
                      value={blankSubject}
                      onChange={(e) => setBlankSubject(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Email Body</Label>
                    <textarea
                      placeholder="Write your email content here..."
                      value={blankBody}
                      onChange={(e) => setBlankBody(e.target.value)}
                      className="w-full h-[280px] p-4 rounded-xl border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Configuration */}
          <div className="w-full lg:w-[320px] p-6 bg-muted/20 flex flex-col">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Step Configuration
            </h3>

            <div className="space-y-6 flex-1">
              {/* Delay Setting */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Wait before sending
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={0}
                    max={365}
                    value={delayDays}
                    onChange={(e) => setDelayDays(Number(e.target.value))}
                    className="w-24 h-12 text-center rounded-xl text-lg font-semibold"
                  />
                  <span className="text-muted-foreground">{delayDays === 1 ? "day" : "days"}</span>
                </div>
              </div>

              {/* Conditions */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Sending Conditions</Label>

                <div className="space-y-3">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Mail className="h-4 w-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Skip if replied</p>
                            <p className="text-xs text-muted-foreground">Don&apos;t send if prospect replied</p>
                          </div>
                        </div>
                        <Switch checked={sendOnlyIfNotReplied} onCheckedChange={setSendOnlyIfNotReplied} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Eye className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Skip if opened</p>
                            <p className="text-xs text-muted-foreground">Only send to non-openers</p>
                          </div>
                        </div>
                        <Switch checked={sendOnlyIfNotOpened} onCheckedChange={setSendOnlyIfNotOpened} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Selected Template Preview */}
              {activeTab === "templates" && selectedTemplate && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Selected Template</Label>
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{selectedTemplate.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{selectedTemplate.subject}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Add Button */}
            <Button
              onClick={handleAddStep}
              disabled={
                isSubmitting ||
                (activeTab === "templates" && !selectedTemplate) ||
                (activeTab === "blank" && (!blankSubject || !blankBody))
              }
              className="w-full h-14 rounded-2xl gap-3 text-base shadow-xl shadow-primary/20 mt-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Adding Step...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Add Step to Sequence
                  <ArrowRight className="h-5 w-5 ml-auto" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
