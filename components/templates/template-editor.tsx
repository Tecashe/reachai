
"use client"

import type React from "react"

import { useState, useRef, useCallback, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Eye,
  History,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { EmailPreview } from "./template-editor/email-preview"
import { VariablePanel } from "./variable-panel"
import { RichTextEditor } from "./rich-text-editor"
import { RichTextToolbar } from "./rich-text-toolbar"
import { VersionHistoryDialog } from "./version-history-dialog"
import { AutosaveIndicator } from "./autosave-indicator"
import { ConflictResolutionDialog } from "./conflict-resolution-dialog"
import { useAutosave } from "@/hooks/use-autosave"
import { useDebounce } from "@/hooks/use-dbounce"
import type { Editor } from "@tiptap/react"
import type { EnhancedEmailTemplate, TemplateCategory, TemplateVariable } from "@/lib/types"
import { updateTemplate, createTemplate } from "@/lib/actions/templates" // Import updateTemplate from correct file
import {
  createTemplateVersion,
  getTemplateVersions,
  restoreTemplateVersion,
} from "@/lib/actions/template-version-actions"
import { toast } from "sonner"
import { WaveLoader } from "@/components/loader/wave-loader"

interface TemplateEditorProps {
  template?: EnhancedEmailTemplate | null
  categories: TemplateCategory[]
  variables: TemplateVariable[]
  mode: "create" | "edit"
  onSave?: (subject: string, body: string) => void
}

const getDefaultSampleData = (): Record<string, string> => ({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  fullName: "John Doe",
  companyName: "Acme Inc",
  currentDate: new Date().toLocaleDateString(),
  currentMonth: new Date().toLocaleString("default", { month: "long" }),
  currentYear: new Date().getFullYear().toString(),
})

export function TemplateEditor({ template, categories, variables, mode, onSave }: TemplateEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const editorRef = useRef<Editor | null>(null)
  const [editor, setEditor] = useState<Editor | null>(null)

  const [sampleData, setSampleData] = useState<Record<string, string>>({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    fullName: "John Doe",
    companyName: "Acme Inc",
    currentDate: "",
    currentMonth: "",
    currentYear: "",
  })

  const [name, setName] = useState(template?.name || "")
  const [subject, setSubject] = useState(template?.subject || "")
  const [body, setBody] = useState(template?.body || "")
  const [category, setCategory] = useState(template?.category || "")

  const [showRightSidebar, setShowRightSidebar] = useState(true)
  const [rightSidebarTab, setRightSidebarTab] = useState<"preview" | "variables">("preview")
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [devicePreview, setDevicePreview] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [versions, setVersions] = useState<any[]>([])

  const [showConflictDialog, setShowConflictDialog] = useState(false)
  const [conflictData, setConflictData] = useState<{
    local: { subject: string; body: string; updatedAt: Date }
    server: { subject: string; body: string; updatedAt: Date; updatedBy?: string }
  } | null>(null)

  const [previewWidth, setPreviewWidth] = useState(480)
  const [isResizing, setIsResizing] = useState(false)
  const resizeRef = useRef<HTMLDivElement>(null)

  const debouncedName = useDebounce(name, 1000)
  const debouncedSubject = useDebounce(subject, 1000)
  const debouncedBody = useDebounce(body, 1000)
  const debouncedCategory = useDebounce(category, 1000)

  const { status, lastSaved, error, scheduleSave, saveNow, setInitialVersion } = useAutosave({
    onSave: async () => {
      if (mode === "create" || !template) {
        return { success: false, error: "Cannot autosave new templates" }
      }

      console.log("[v0] Autosaving template:", template.id)

      try {
        const result = await updateTemplate(template.id, {
          name,
          subject,
          body,
          category,
        })

        if (result.error) {
          console.error("[v0] Autosave failed:", result.error)
          return { success: false, error: result.error }
        }

        console.log("[v0] Autosave successful")
        setHasUnsavedChanges(false)
        return { success: true }
      } catch (err) {
        console.error("[v0] Autosave exception:", err)
        return { success: false, error: "Failed to save" }
      }
    },
    delay: 3000,
    onConflict: () => {
      handleConflictDetected()
    },
    enabled: mode === "edit" && hasUnsavedChanges,
  })

  useEffect(() => {
    if (mode === "edit" && hasUnsavedChanges) {
      scheduleSave()
    }
  }, [debouncedName, debouncedSubject, debouncedBody, debouncedCategory, mode, hasUnsavedChanges, scheduleSave])

  useEffect(() => {
    if (template?.version) {
      setInitialVersion(template.version)
    }
  }, [template?.version, setInitialVersion])

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

  useEffect(() => {
    if (template?.id) {
      loadVersions()
    }
  }, [template?.id])

  const loadVersions = async () => {
    if (!template?.id) return

    const result = await getTemplateVersions(template.id)
    if (result.success) {
      setVersions(result.versions)
    }
  }

  const handleConflictDetected = async () => {
    if (!template) return

    // In a real implementation, fetch the current server version
    // For now, we'll show a mock conflict
    setConflictData({
      local: {
        subject,
        body,
        updatedAt: new Date(),
      },
      server: {
        subject: template.subject,
        body: template.body,
        updatedAt: new Date(template.updatedAt),
        updatedBy: "Another user",
      },
    })
    setShowConflictDialog(true)
  }

  const handleResolveConflict = async (resolution: "local" | "server" | "merge") => {
    if (!conflictData) return

    switch (resolution) {
      case "local":
        // Keep local changes and force save
        await saveNow()
        break
      case "server":
        // Discard local changes
        setSubject(conflictData.server.subject)
        setBody(conflictData.server.body)
        setHasUnsavedChanges(false)
        break
      case "merge":
        // Keep local subject, merge bodies
        setBody(conflictData.server.body + "\n\n" + conflictData.local.body)
        await saveNow()
        break
    }

    setShowConflictDialog(false)
    setConflictData(null)
    toast.success("Conflict resolved")
  }

  const handleInsertVariable = useCallback((variable: string) => {
    if (editorRef.current) {
      editorRef.current.chain().focus().insertContent(variable).run()
    } else {
      setBody((prev) => prev + variable)
    }

    toast.success(`Inserted ${variable}`)
  }, [])

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a template name")
      return
    }

    if (onSave) {
      onSave(subject, body)
      return
    }

    startTransition(async () => {
      if (mode === "edit" && template) {
        await createTemplateVersion(template.id, "Manual save")

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
          setHasUnsavedChanges(false)
          await loadVersions()
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

  const handleRestoreVersion = async (versionId: string) => {
    if (!template?.id) return

    const result = await restoreTemplateVersion(template.id, versionId)
    if (result.success) {
      // Reload the page to get the restored content
      router.refresh()
      await loadVersions()
    }
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const newWidth = window.innerWidth - e.clientX
      if (newWidth >= 300 && newWidth <= 900) {
        setPreviewWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing])

  useEffect(() => {
    setSampleData(getDefaultSampleData())
  }, [])

  return (
    <div className="h-screen flex flex-col bg-background w-full max-w-none">
      {/* Header with template name and save button */}
      <header className="flex items-center justify-between px-6 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/templates")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Input
              placeholder="Untitled Template"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 max-w-md font-medium border-0 focus-visible:ring-1 focus-visible:ring-ring bg-muted/30 px-3"
            />
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-xs">
                Unsaved
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mode === "edit" && <AutosaveIndicator status={status} lastSaved={lastSaved} error={error} />}

          {mode === "edit" && template && (
            <Button variant="ghost" size="sm" onClick={() => setShowVersionHistory(true)}>
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
          )}

          <Separator orientation="vertical" className="h-6" />

          <Button
            onClick={handleSave}
            disabled={isPending || !hasUnsavedChanges}
            size="sm"
            className={cn(hasUnsavedChanges && "shadow-md")}
          >
            {isPending ? <WaveLoader size="sm" bars={8} gap="tight" /> : <Save className="w-4 h-4 mr-2" />}
            Save
          </Button>
        </div>
      </header>

      {/* Horizontal toolbar with category, subject, and formatting tools */}
      <div className="border-b bg-muted/20 flex-shrink-0">
        <div className="flex items-center gap-6 px-8 py-4">
          <div className="flex items-center gap-3">
            <Label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10 w-56">
                <SelectValue placeholder="Select category..." />
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

          <Separator orientation="vertical" className="h-8" />

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Subject</Label>
            <Input
              placeholder="Enter email subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-10 flex-1 max-w-2xl"
            />
          </div>
        </div>

        {editor && (
          <div className="px-8 pb-4">
            <RichTextToolbar editor={editor} />
          </div>
        )}
      </div>

      {/* Main content area with side-by-side editor and preview */}
      <div className="flex-1 flex overflow-hidden w-full max-w-none">
        {/* Editor panel */}
        <div className="flex-1 flex flex-col min-w-0 bg-background overflow-auto">
          <RichTextEditor
            content={body}
            onChange={(html) => setBody(html)}
            onEditorReady={(editorInstance) => {
              setEditor(editorInstance)
              editorRef.current = editorInstance
            }}
            placeholder="Start writing your email...

Use {{variableName}} to insert dynamic content."
            className="h-full min-h-[600px] border-0 p-8"
          />
        </div>

        {showRightSidebar && (
          <>
            {/* Resize handle */}
            <div
              ref={resizeRef}
              className={cn(
                "w-1 hover:w-1.5 bg-border hover:bg-primary/50 cursor-col-resize transition-all relative group flex-shrink-0",
                isResizing && "w-1.5 bg-primary",
              )}
              onMouseDown={handleMouseDown}
            >
              <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-primary/10" />
            </div>

            {/* Right sidebar with preview and variables */}
            <div
              style={{ width: previewWidth }}
              className="border-l bg-muted/10 flex flex-col flex-shrink-0 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0 bg-background/50">
                <Tabs value={rightSidebarTab} onValueChange={(v) => setRightSidebarTab(v as any)} className="flex-1">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview" className="text-sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="variables" className="text-sm">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Variables
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-2"
                  onClick={() => setShowRightSidebar(false)}
                  title="Hide sidebar (full editor view)"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-auto">
                {rightSidebarTab === "preview" ? (
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-center gap-1 p-3 border-b flex-shrink-0 bg-background/30">
                      <Button
                        variant={devicePreview === "desktop" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setDevicePreview("desktop")}
                        title="Desktop view"
                      >
                        <Monitor className="w-4 h-4 mr-2" />
                        Desktop
                      </Button>
                      <Button
                        variant={devicePreview === "tablet" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setDevicePreview("tablet")}
                        title="Tablet view"
                      >
                        <Tablet className="w-4 h-4 mr-2" />
                        Tablet
                      </Button>
                      <Button
                        variant={devicePreview === "mobile" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setDevicePreview("mobile")}
                        title="Mobile view"
                      >
                        <Smartphone className="w-4 h-4 mr-2" />
                        Mobile
                      </Button>
                    </div>
                    <div className="flex-1 overflow-auto p-6 bg-muted/5">
                      <EmailPreview
                        subject={subject}
                        content={body}
                        sampleData={sampleData}
                        devicePreview={devicePreview}
                        onDeviceChange={setDevicePreview}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full overflow-auto p-4">
                    <VariablePanel variables={variables} onInsertVariable={handleInsertVariable} />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {!showRightSidebar && (
          <Button
            variant="default"
            size="lg"
            className="fixed right-6 top-24 h-12 shadow-lg z-10 rounded-lg"
            onClick={() => setShowRightSidebar(true)}
            title="Show preview and variables"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Show Preview
          </Button>
        )}
      </div>

      {/* Dialogs */}
      {mode === "edit" && template && (
        <VersionHistoryDialog
          open={showVersionHistory}
          onOpenChange={setShowVersionHistory}
          versions={versions}
          currentVersion={versions[0]}
          onRestoreVersion={handleRestoreVersion}
        />
      )}

      {conflictData && (
        <ConflictResolutionDialog
          open={showConflictDialog}
          onOpenChange={setShowConflictDialog}
          localVersion={conflictData.local}
          serverVersion={conflictData.server}
          onResolve={handleResolveConflict}
        />
      )}
    </div>
  )
}
