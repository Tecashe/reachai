
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Play,
  Pause,
  MoreHorizontal,
  Settings,
  BarChart3,
  Users,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Keyboard,
  Copy,
  Archive,
  Trash2,
  Loader2,
  Check,
  X,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import type { Sequence, SequenceStep, SequenceStatus, StepType } from "@/lib/types/sequence"
import { SequenceCanvas } from "./sequence-canvas"
import { SequenceStepPanel } from "./sequence-step-panel"
import { SequenceSettingsPanel } from "./sequence-settings-panel"
import { SequenceAnalyticsPanel } from "./sequence-analytics-panel"
import { SequenceProspectsPanel } from "./sequence-prospects-panel"
import {
  createSequence,
  updateSequence,
  updateSequenceStatus,
  deleteSequence,
  archiveSequence,
  duplicateSequence,
  createStep,
  updateStep,
  deleteStep,
  reorderSteps,
} from "@/lib/actions/sequence-actions"
import { WaveLoader } from "@/components/loader/wave-loader"

type ActivePanel = "settings" | null

const STATUS_CONFIG: Record<SequenceStatus, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-muted text-muted-foreground" },
  ACTIVE: { label: "Active", className: "bg-green-500/10 text-green-600" },
  PAUSED: { label: "Paused", className: "bg-yellow-500/10 text-yellow-600" },
  COMPLETED: { label: "Completed", className: "bg-blue-500/10 text-blue-600" },
  ARCHIVED: { label: "Archived", className: "bg-muted text-muted-foreground" },
}

interface SequenceBuilderContentProps {
  initialSequence?: Sequence & { steps: SequenceStep[] }
  isNew?: boolean
  userId: string
}

const defaultNewSequence: Sequence = {
  id: "new",
  userId: "",
  name: "New Sequence",
  description: null,
  status: "DRAFT",
  timezone: "America/New_York",
  sendInBusinessHours: true,
  businessHoursStart: "09:00",
  businessHoursEnd: "17:00",
  businessDays: [1, 2, 3, 4, 5],
  dailySendLimit: 50,
  minDelayBetweenSends: 60,
  trackOpens: true,
  trackClicks: true,
  enableLinkedIn: false,
  enableCalls: false,
  enableTasks: false,
  enableABTesting: false,
  abTestWinnerMetric: "REPLY_RATE",
  abTestSampleSize: 20,
  abTestDuration: 48,
  aiOptimizeSendTime: true,
  aiPersonalization: true,
  toneOfVoice: "professional",
  totalSteps: 0,
  totalEnrolled: 0,
  totalCompleted: 0,
  avgOpenRate: null,
  avgReplyRate: null,
  avgClickRate: null,
  folderId: null,
  tags: [],
  archivedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export function SequenceBuilderContent({ initialSequence, isNew = false, userId }: SequenceBuilderContentProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [sequence, setSequence] = React.useState<Sequence>(initialSequence || { ...defaultNewSequence, userId })
  const [steps, setSteps] = React.useState<SequenceStep[]>(initialSequence?.steps || [])
  const [selectedStepId, setSelectedStepId] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState<"builder" | "analytics" | "prospects">("builder")
  const [activePanel, setActivePanel] = React.useState<ActivePanel>(null)
  const [zoomLevel, setZoomLevel] = React.useState(100)
  const [isEditingName, setIsEditingName] = React.useState(false)
  const [sequenceName, setSequenceName] = React.useState(sequence.name)
  const [isSaving, setIsSaving] = React.useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false)
  const [showShortcuts, setShowShortcuts] = React.useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)

  const [pendingStepChanges, setPendingStepChanges] = React.useState<Map<string, Partial<SequenceStep>>>(new Map())
  const [pendingSequenceChanges, setPendingSequenceChanges] = React.useState<Partial<Sequence>>({})

  const [history, setHistory] = React.useState<SequenceStep[][]>([steps])
  const [historyIndex, setHistoryIndex] = React.useState(0)

  const selectedStep = selectedStepId ? steps.find((s) => s.id === selectedStepId) : null

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "z") {
        e.preventDefault()
        handleRedo()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "=") {
        e.preventDefault()
        handleZoomIn()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "-") {
        e.preventDefault()
        handleZoomOut()
      }
      if (e.key === "Escape") {
        setSelectedStepId(null)
        setActivePanel(null)
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedStepId && !isEditingName) {
        const activeElement = document.activeElement
        if (activeElement?.tagName !== "INPUT" && activeElement?.tagName !== "TEXTAREA") {
          e.preventDefault()
          handleDeleteStep(selectedStepId)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedStepId, historyIndex, history, isEditingName])

  const handleNameChange = (newName: string) => {
    setSequenceName(newName)
    setHasUnsavedChanges(true)
    setPendingSequenceChanges((prev) => ({ ...prev, name: newName }))
  }

  const handleSaveName = () => {
    setIsEditingName(false)
    setSequence((prev) => ({ ...prev, name: sequenceName }))
  }

  const pushHistory = (newSteps: SequenceStep[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newSteps)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setSteps(history[historyIndex - 1])
      setHasUnsavedChanges(true)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setSteps(history[historyIndex + 1])
      setHasUnsavedChanges(true)
    }
  }

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 10, 150))
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 10, 50))
  const handleFitToScreen = () => setZoomLevel(100)

  const handleAddStep = async (stepType: StepType, afterIndex: number) => {
    const newStep: SequenceStep = {
      id: `temp_${Date.now()}`,
      sequenceId: sequence.id,
      order: afterIndex + 1,
      stepType,
      delayValue: 1,
      delayUnit: "DAYS",
      subject: stepType === "EMAIL" ? "" : null,
      body: stepType === "EMAIL" ? "" : null,
      bodyHtml: null,
      templateId: null,
      variables: null,
      spintaxEnabled: false,
      conditions: null,
      skipIfReplied: true,
      skipIfBounced: true,
      linkedInAction: stepType.startsWith("LINKEDIN_") ? (stepType.replace("LINKEDIN_", "") as any) : null,
      linkedInMessage: null,
      callScript: null,
      callDuration: null,
      taskTitle: stepType === "TASK" ? "Follow up task" : null,
      taskDescription: null,
      taskPriority: "MEDIUM",
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      bounced: 0,
      internalNotes: null,
      variants: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedSteps = steps.map((s) => (s.order > afterIndex ? { ...s, order: s.order + 1 } : s))
    const newSteps = [...updatedSteps.slice(0, afterIndex + 1), newStep, ...updatedSteps.slice(afterIndex + 1)]

    setSteps(newSteps)
    pushHistory(newSteps)
    setSelectedStepId(newStep.id)
    setHasUnsavedChanges(true)

    if (sequence.id !== "new") {
      try {
        const createdStep = await createStep(sequence.id, userId, {
          order: newStep.order,
          stepType: newStep.stepType,
          delayValue: newStep.delayValue,
          delayUnit: newStep.delayUnit,
          subject: newStep.subject,
          body: newStep.body,
        })

        setSteps((prev) => prev.map((s) => (s.id === newStep.id ? { ...s, id: createdStep.id } : s)))
        setSelectedStepId(createdStep.id)
      } catch (error) {
        toast({ title: "Error", description: "Failed to create step.", variant: "destructive" })
      }
    }
  }

  const handleUpdateStep = (stepId: string, updates: Partial<SequenceStep>) => {
    setSteps((prev) => prev.map((s) => (s.id === stepId ? { ...s, ...updates } : s)))
    setHasUnsavedChanges(true)

    setPendingStepChanges((prev) => {
      const newMap = new Map(prev)
      const existing = newMap.get(stepId) || {}
      newMap.set(stepId, { ...existing, ...updates })
      return newMap
    })
  }

  const handleDeleteStep = async (stepId: string) => {
    const newSteps = steps.filter((s) => s.id !== stepId).map((s, i) => ({ ...s, order: i }))

    setSteps(newSteps)
    pushHistory(newSteps)
    setSelectedStepId(null)
    setHasUnsavedChanges(true)

    if (!stepId.startsWith("temp_") && sequence.id !== "new") {
      try {
        await deleteStep(stepId, sequence.id, userId)
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete step.", variant: "destructive" })
      }
    }
  }

  const handleReorderSteps = async (reorderedSteps: SequenceStep[]) => {
    const newSteps = reorderedSteps.map((s, i) => ({ ...s, order: i }))

    setSteps(newSteps)
    pushHistory(newSteps)
    setHasUnsavedChanges(true)

    if (sequence.id !== "new") {
      try {
        await reorderSteps(
          sequence.id,
          userId,
          newSteps.map((s) => s.id),
        )
      } catch (error) {
        toast({ title: "Error", description: "Failed to reorder steps.", variant: "destructive" })
      }
    }
  }

  const handleDuplicateStep = async (stepId: string) => {
    const stepToDuplicate = steps.find((s) => s.id === stepId)
    if (!stepToDuplicate) return

    const newStep: SequenceStep = {
      ...stepToDuplicate,
      id: `temp_${Date.now()}`,
      order: stepToDuplicate.order + 1,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      bounced: 0,
      variants: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedSteps = steps.map((s) => (s.order > stepToDuplicate.order ? { ...s, order: s.order + 1 } : s))
    const insertIndex = updatedSteps.findIndex((s) => s.id === stepId) + 1
    const newSteps = [...updatedSteps.slice(0, insertIndex), newStep, ...updatedSteps.slice(insertIndex)]

    setSteps(newSteps)
    pushHistory(newSteps)
    setSelectedStepId(newStep.id)
    setHasUnsavedChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (sequence.id === "new" || isNew) {
        const created = await createSequence(userId, {
          name: sequenceName,
          description: sequence.description,
          status: "DRAFT",
          ...pendingSequenceChanges,
        })

        for (const step of steps) {
          await createStep(created.id, userId, {
            order: step.order,
            stepType: step.stepType,
            delayValue: step.delayValue,
            delayUnit: step.delayUnit,
            subject: step.subject,
            body: step.body,
          })
        }

        toast({ title: "Sequence created!", description: "Your sequence has been saved." })
        router.push(`/dashboard/sequences/${created.id}`)
      } else {
        if (Object.keys(pendingSequenceChanges).length > 0) {
          await updateSequence(sequence.id, userId, pendingSequenceChanges)
        }

        for (const [stepId, changes] of pendingStepChanges) {
          if (!stepId.startsWith("temp_")) {
            await updateStep(stepId, sequence.id, userId, changes)
          }
        }

        toast({ title: "Saved!", description: "All changes have been saved." })

        setPendingStepChanges(new Map())
        setPendingSequenceChanges({})
        setHasUnsavedChanges(false)
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save sequence.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: SequenceStatus) => {
    if (sequence.id === "new") {
      toast({
        title: "Save first",
        description: "Please save the sequence before changing status.",
        variant: "destructive",
      })
      return
    }

    try {
      await updateSequenceStatus(sequence.id, userId, newStatus)
      setSequence((prev) => ({ ...prev, status: newStatus }))
      toast({ title: "Status updated", description: `Sequence is now ${newStatus.toLowerCase()}.` })
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" })
    }
  }

  const handleDuplicate = async () => {
    if (sequence.id === "new") return

    try {
      const duplicated = await duplicateSequence(sequence.id, userId)
      toast({ title: "Duplicated!", description: "Sequence has been duplicated." })
      router.push(`/dashboard/sequences/${duplicated.id}`)
    } catch (error) {
      toast({ title: "Error", description: "Failed to duplicate sequence.", variant: "destructive" })
    }
  }

  const handleArchive = async () => {
    if (sequence.id === "new") return

    try {
      await archiveSequence(sequence.id, userId)
      toast({ title: "Archived", description: "Sequence has been archived." })
      router.push("/dashboard/sequences")
    } catch (error) {
      toast({ title: "Error", description: "Failed to archive sequence.", variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    if (sequence.id === "new") {
      router.push("/dashboard/sequences")
      return
    }

    try {
      await deleteSequence(sequence.id, userId)
      toast({ title: "Deleted", description: "Sequence has been deleted." })
      router.push("/dashboard/sequences")
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete sequence.", variant: "destructive" })
    }
  }

  const handleSettingsChange = (updates: Partial<Sequence>) => {
    setSequence((prev) => ({ ...prev, ...updates }))
    setHasUnsavedChanges(true)
    setPendingSequenceChanges((prev) => ({ ...prev, ...updates }))
  }

  const statusConfig = STATUS_CONFIG[sequence.status]

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/sequences")} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />

          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={sequenceName}
                onChange={(e) => handleNameChange(e.target.value)}
                className="h-8 w-64"
                autoFocus
                onBlur={handleSaveName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName()
                  if (e.key === "Escape") {
                    setSequenceName(sequence.name)
                    setIsEditingName(false)
                  }
                }}
              />
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSaveName}>
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  setSequenceName(sequence.name)
                  setIsEditingName(false)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="group flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted transition-colors"
            >
              <h1 className="text-lg font-semibold">{sequence.name}</h1>
              <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          )}

          <Badge className={statusConfig.className}>{statusConfig.label}</Badge>

          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-orange-500 border-orange-500/30 animate-pulse">
              Unsaved changes
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleUndo} disabled={historyIndex === 0}>
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="min-w-[3rem] text-center text-sm text-muted-foreground tabular-nums">{zoomLevel}%</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleFitToScreen}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowShortcuts(true)}>
            <Keyboard className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {sequence.status === "DRAFT" || sequence.status === "PAUSED" ? (
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              onClick={() => handleStatusChange("ACTIVE")}
              disabled={steps.length === 0}
            >
              <Play className="h-4 w-4" />
              Activate
            </Button>
          ) : sequence.status === "ACTIVE" ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
              onClick={() => handleStatusChange("PAUSED")}
            >
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          ) : null}

          <Button
            variant={hasUnsavedChanges ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <WaveLoader size="sm" bars={8} gap="tight" /> : <Save className="h-4 w-4" />}
            Save
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDuplicate} disabled={sequence.id === "new"}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleArchive} disabled={sequence.id === "new"}>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteConfirm(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Tab bar */}
      <div className="sticky top-14 z-10 flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="h-9">
            <TabsTrigger value="builder" className="gap-2">
              <Settings className="h-4 w-4" />
              Builder
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2" disabled={sequence.id === "new"}>
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="prospects" className="gap-2" disabled={sequence.id === "new"}>
              <Users className="h-4 w-4" />
              Prospects
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "builder" && (
          <Button
            variant={activePanel === "settings" ? "secondary" : "outline"}
            size="sm"
            className="gap-2 transition-colors"
            onClick={() => setActivePanel(activePanel === "settings" ? null : "settings")}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {activeTab === "builder" && (
          <>
            <div className="flex-1 overflow-auto">
              <SequenceCanvas
                steps={steps}
                selectedStepId={selectedStepId}
                zoomLevel={zoomLevel}
                sequenceId={sequence.id}
                enableLinkedIn={sequence.enableLinkedIn}
                enableCalls={sequence.enableCalls}
                enableTasks={sequence.enableTasks}
                onStepSelect={setSelectedStepId}
                onAddStep={handleAddStep}
                onDeleteStep={handleDeleteStep}
                onDuplicateStep={handleDuplicateStep}
                onReorderSteps={handleReorderSteps}
              />
            </div>

            {selectedStep && (
              <div className="w-[420px] shrink-0 border-l border-border bg-card flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                  <SequenceStepPanel
                    step={selectedStep}
                    sequenceId={sequence.id}
                    userId={userId}
                    onUpdate={(updates) => handleUpdateStep(selectedStep.id, updates)}
                    onClose={() => setSelectedStepId(null)}
                    onDelete={() => handleDeleteStep(selectedStep.id)}
                  />
                </div>
              </div>
            )}

            {activePanel === "settings" && !selectedStep && (
              <div className="w-[420px] shrink-0 border-l border-border bg-card flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                  <SequenceSettingsPanel
                    sequence={sequence}
                    onUpdate={handleSettingsChange}
                    onClose={() => setActivePanel(null)}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "analytics" && sequence.id !== "new" && (
          <div className="flex-1 overflow-auto">
            <SequenceAnalyticsPanel sequence={sequence} userId={userId} steps={steps} />
          </div>
        )}

        {activeTab === "prospects" && sequence.id !== "new" && (
          <div className="flex-1 overflow-auto">
            <SequenceProspectsPanel sequence={sequence} userId={userId} />
          </div>
        )}
      </div>

      {/* Keyboard shortcuts dialog */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>Speed up your workflow with these shortcuts</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {[
              { keys: ["⌘", "S"], action: "Save sequence" },
              { keys: ["⌘", "Z"], action: "Undo" },
              { keys: ["⌘", "⇧", "Z"], action: "Redo" },
              { keys: ["⌘", "+"], action: "Zoom in" },
              { keys: ["⌘", "-"], action: "Zoom out" },
              { keys: ["Esc"], action: "Close panel" },
              { keys: ["Del"], action: "Delete selected step" },
            ].map((shortcut) => (
              <div key={shortcut.action} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{shortcut.action}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key) => (
                    <kbd key={key} className="rounded-md border border-border bg-muted px-2 py-1 text-xs font-mono">
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sequence</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this sequence? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
