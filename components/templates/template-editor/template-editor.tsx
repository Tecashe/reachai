"use client"

import { useState, useRef, useCallback, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Braces,
  Eye,
  EyeOff,
  Settings2,
  Bold,
  Italic,
  Link,
  List,
  Heading,
  Loader2,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { EmailPreview } from "./email-preview"
import { VariablePanel } from "./variable-panel"
import type { EnhancedEmailTemplate, TemplateCategory, TemplateVariable } from "@/lib/types"
import { updateTemplate, createTemplate } from "@/lib/actions/templates"
import { toast } from "sonner"
import { WaveLoader } from "@/components/loader/wave-loader"

interface TemplateEditorProps {
  template?: EnhancedEmailTemplate | null
  categories: TemplateCategory[]
  variables: TemplateVariable[]
  mode: "create" | "edit"
}

// Default sample data for preview
const DEFAULT_SAMPLE_DATA: Record<string, string> = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  fullName: "John Doe",
  companyName: "Acme Inc",
  currentDate: new Date().toLocaleDateString(),
  currentMonth: new Date().toLocaleString("default", { month: "long" }),
  currentYear: new Date().getFullYear().toString(),
}

export function TemplateEditor({ template, categories, variables, mode }: TemplateEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Form state - use body instead of content
  const [name, setName] = useState(template?.name || "")
  const [subject, setSubject] = useState(template?.subject || "")
  const [body, setBody] = useState(template?.body || "")
  const [category, setCategory] = useState(template?.category || "")

  // UI state
  const [showPreview, setShowPreview] = useState(true)
  const [showVariables, setShowVariables] = useState(true)
  const [devicePreview, setDevicePreview] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Track changes
  useEffect(() => {
    if (mode === "edit" && template) {
      const hasChanges =
        name !== template.name ||
        subject !== template.subject ||
        body !== template.body ||
        category !== template.category
      setHasUnsavedChanges(hasChanges)
    } else if (mode === "create") {
      setHasUnsavedChanges(name || subject || body ? true : false)
    }
  }, [name, subject, body, category, template, mode])

  // Insert variable at cursor position
  const handleInsertVariable = useCallback(
    (variable: string) => {
      const textarea = textareaRef.current
      if (!textarea) {
        setBody((prev) => prev + variable)
        return
      }

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newBody = body.substring(0, start) + variable + body.substring(end)
      setBody(newBody)

      // Restore cursor position after variable
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + variable.length, start + variable.length)
      }, 0)
    },
    [body],
  )

  // Insert formatting
  const handleInsertFormatting = (type: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = body.substring(start, end)

    let newText = ""
    switch (type) {
      case "bold":
        newText = `**${selectedText || "bold text"}**`
        break
      case "italic":
        newText = `*${selectedText || "italic text"}*`
        break
      case "link":
        newText = `[${selectedText || "link text"}](url)`
        break
      case "list":
        newText = `\n- ${selectedText || "list item"}\n`
        break
      case "heading":
        newText = `\n## ${selectedText || "Heading"}\n`
        break
      default:
        return
    }

    const newBody = body.substring(0, start) + newText + body.substring(end)
    setBody(newBody)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + newText.length, start + newText.length)
    }, 0)
  }

  // Save template - use body instead of content
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a template name")
      return
    }

    startTransition(async () => {
      if (mode === "edit" && template) {
        const result = await updateTemplate(template.id, {
          name,
          subject,
          body,
          category,
        })
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success("Template saved")
          setLastSaved(new Date())
          setHasUnsavedChanges(false)
        }
      } else {
        const result = await createTemplate({
          name,
          subject,
          body,
          category,
        })
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success("Template created")
          router.push(`/dashboard/templates/${result.template?.id}/edit`)
        }
      }
    })
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push("/dashboard/templates")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex flex-col">
            <h1 className="text-sm font-medium leading-tight">{mode === "edit" ? "Edit Template" : "New Template"}</h1>
            {lastSaved && (
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-500" />
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle buttons */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-lg bg-muted/50">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={showVariables ? "secondary" : "ghost"}
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowVariables(!showVariables)}
                  >
                    <Braces className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Variables panel</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={showPreview ? "secondary" : "ghost"}
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle preview</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Settings sheet for mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 md:hidden bg-transparent">
                <Settings2 className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Template Settings</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Save button */}
          <Button
            onClick={handleSave}
            disabled={isPending || !hasUnsavedChanges}
            className={cn("h-8 px-4", hasUnsavedChanges && "shadow-lg shadow-primary/20")}
          >
            {isPending ? <WaveLoader size="sm" bars={8} gap="tight" /> : <Save className="w-4 h-4 mr-2" />}
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Template settings bar */}
          <div className="flex items-center gap-4 px-4 py-3 border-b border-border/50 bg-muted/30 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <Input
                placeholder="Template name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 font-medium bg-background/50 border-border/50 focus:bg-background"
              />
            </div>
            <div className="hidden md:block w-48">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-9 bg-background/50 border-border/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subject line */}
          <div className="px-4 py-3 border-b border-border/50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Label className="text-sm text-muted-foreground w-16 flex-shrink-0">Subject</Label>
              <Input
                placeholder="Enter email subject line..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-9 bg-background/50 border-border/50 focus:bg-background"
              />
            </div>
          </div>

          {/* Formatting toolbar */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-border/50 bg-muted/20 flex-shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleInsertFormatting("bold")}
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bold</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleInsertFormatting("italic")}
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Italic</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" className="h-5 mx-1" />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleInsertFormatting("heading")}
                  >
                    <Heading className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Heading</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleInsertFormatting("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>List</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleInsertFormatting("link")}
                  >
                    <Link className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Link</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex-1" />

            {/* Mobile toggle for variables */}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 md:hidden"
              onClick={() => setShowVariables(!showVariables)}
            >
              <Braces className="w-4 h-4 mr-1.5" />
              Variables
            </Button>
          </div>

          {/* Content textarea */}
          <div className="flex-1 overflow-hidden">
            <Textarea
              ref={textareaRef}
              placeholder="Write your email content here...

Use {{firstName}} syntax to insert dynamic variables.
The preview will update as you type."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={cn(
                "h-full resize-none rounded-none border-0 p-4",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "font-mono text-sm leading-relaxed",
                "bg-background",
              )}
            />
          </div>
        </div>

        {/* Variables panel */}
        {showVariables && (
          <div className="hidden md:block w-64 flex-shrink-0">
            <VariablePanel variables={variables} onInsertVariable={handleInsertVariable} />
          </div>
        )}

        {/* Mobile variables sheet */}
        {showVariables && (
          <Sheet open={showVariables} onOpenChange={setShowVariables}>
            <SheetContent side="right" className="w-80 p-0 md:hidden">
              <VariablePanel
                variables={variables}
                onInsertVariable={handleInsertVariable}
                onClose={() => setShowVariables(false)}
              />
            </SheetContent>
          </Sheet>
        )}

        {/* Preview panel */}
        {showPreview && (
          <div className="hidden lg:block w-[45%] flex-shrink-0 border-l border-border/50">
            <EmailPreview
              subject={subject}
              content={body}
              sampleData={DEFAULT_SAMPLE_DATA}
              devicePreview={devicePreview}
              onDeviceChange={setDevicePreview}
            />
          </div>
        )}
      </div>
    </div>
  )
}
