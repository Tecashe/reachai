"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Search, Star, Clock, Plus, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Template {
  id: string
  name: string
  subject: string
  body: string
  category: string
  isFavorite: boolean
  usageCount: number
}

interface TemplatesDrawerProps {
  onSelectTemplate: (template: Template) => void
  children?: React.ReactNode
}

export function TemplatesDrawer({ onSelectTemplate, children }: TemplatesDrawerProps) {
  const [templates, setTemplates] = React.useState<Template[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const fetchTemplates = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/templates")
      if (!response.ok) throw new Error()
      const data = await response.json()
      setTemplates(data.templates || [])
    } catch {
      // Use mock data for now
      setTemplates([
        {
          id: "1",
          name: "Initial Outreach",
          subject: "Quick question about {{company}}",
          body: "Hi {{firstName}},\n\nI noticed {{company}} is doing great work in {{industry}}. I'd love to connect and explore how we might help with {{painPoint}}.\n\nWould you be open to a quick 15-minute call this week?\n\nBest,\n{{senderName}}",
          category: "Outreach",
          isFavorite: true,
          usageCount: 45,
        },
        {
          id: "2",
          name: "Follow-up #1",
          subject: "Re: Quick question about {{company}}",
          body: "Hi {{firstName}},\n\nJust wanted to follow up on my previous email. I understand you're busy, but I think we could add real value to {{company}}.\n\nWould a quick call work better for you?\n\nBest,\n{{senderName}}",
          category: "Follow-up",
          isFavorite: false,
          usageCount: 32,
        },
        {
          id: "3",
          name: "Meeting Confirmation",
          subject: "Confirmed: Call on {{meetingDate}}",
          body: "Hi {{firstName}},\n\nGreat! Looking forward to our call on {{meetingDate}} at {{meetingTime}}.\n\nHere's the meeting link: {{meetingLink}}\n\nSee you then!\n\nBest,\n{{senderName}}",
          category: "Scheduling",
          isFavorite: true,
          usageCount: 28,
        },
        {
          id: "4",
          name: "Objection: Budget",
          subject: "Re: Budget concerns",
          body: "Hi {{firstName}},\n\nI completely understand budget constraints. Many of our clients initially felt the same way.\n\nWhat helped them was seeing the ROI we deliver. On average, our customers see {{roiPercentage}}% improvement within {{timeframe}}.\n\nWould it help to see a case study from a similar company?\n\nBest,\n{{senderName}}",
          category: "Objections",
          isFavorite: false,
          usageCount: 18,
        },
        {
          id: "5",
          name: "Break-up Email",
          subject: "Closing the loop",
          body: "Hi {{firstName}},\n\nI've reached out a few times without hearing back, so I'll assume the timing isn't right.\n\nIf things change in the future, feel free to reach out. I'm always happy to help.\n\nWishing you and {{company}} all the best!\n\nBest,\n{{senderName}}",
          category: "Follow-up",
          isFavorite: false,
          usageCount: 12,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (isOpen && templates.length === 0) {
      fetchTemplates()
    }
  }, [isOpen])

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.body.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCopy = (template: Template) => {
    navigator.clipboard.writeText(template.body)
    setCopiedId(template.id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success("Template copied")
  }

  const handleSelect = (template: Template) => {
    onSelectTemplate(template)
    setIsOpen(false)
    toast.success(`Template "${template.name}" inserted`)
  }

  const categories = [...new Set(templates.map((t) => t.category))]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="gap-2 rounded-xl">
            <FileText className="h-4 w-4" />
            Templates
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Email Templates
          </SheetTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl border-border/50"
            />
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted/50 p-4 mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium">No templates found</p>
                <p className="text-xs text-muted-foreground mb-4">
                  {searchQuery ? "Try a different search" : "Create your first template"}
                </p>
                <Button size="sm" className="gap-2 rounded-xl">
                  <Plus className="h-4 w-4" />
                  Create Template
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={cn(
                      "group p-4 rounded-xl border border-border/50",
                      "bg-card hover:bg-accent/50 transition-colors cursor-pointer",
                    )}
                    onClick={() => handleSelect(template)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        {template.isFavorite && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopy(template)
                        }}
                      >
                        {copiedId === template.id ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{template.body}</p>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] h-5 px-2">
                        {template.category}
                      </Badge>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Used {template.usageCount}x
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
