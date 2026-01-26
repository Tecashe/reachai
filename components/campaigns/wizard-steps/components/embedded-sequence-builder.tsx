"use client"

import * as React from "react"
import { nanoid } from "nanoid"
import {
    ArrowLeft,
    Save,
    Undo2,
    Redo2,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Settings,
    Eye,
    ChevronRight,
    Users,
    Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { type SequenceStep, type StepType, type DelayUnit } from "@/lib/types/sequence"
import { SequenceCanvas } from "@/components/sequences/builder/sequence-canvas"
import { SequenceStepPanel } from "@/components/sequences/builder/seq-step"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-mobile"

interface ResearchData {
    companyInfo?: string
    recentNews?: string[]
    painPoints?: string[]
    talkingPoints?: string[]
    competitorTools?: string[]
    qualityScore?: number
}

interface EmbeddedSequenceBuilderProps {
    campaignId: string
    campaignName: string
    userId: string
    researchData?: ResearchData
    prospectsCount: number
    isPaidUser: boolean
    initialSteps?: SequenceStep[]
    onSave: (steps: SequenceStep[], sequenceName: string) => Promise<void>
    onBack: () => void
}

let tempStepCounter = 0

export function EmbeddedSequenceBuilder({
    campaignId,
    campaignName,
    userId,
    researchData,
    prospectsCount,
    isPaidUser,
    initialSteps,
    onSave,
    onBack,
}: EmbeddedSequenceBuilderProps) {
    const { toast } = useToast()
    const isMobile = useMediaQuery("(max-width: 768px)")

    const [sequenceName, setSequenceName] = React.useState(`${campaignName} Sequence`)
    const [steps, setSteps] = React.useState<SequenceStep[]>(
        initialSteps?.length ? initialSteps : [createDefaultStep(0)]
    )
    const [selectedStepId, setSelectedStepId] = React.useState<string | null>(null)
    const [activeTab, setActiveTab] = React.useState<"builder" | "preview">("builder")
    const [zoomLevel, setZoomLevel] = React.useState(100)
    const [isSaving, setIsSaving] = React.useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false)
    const [mobileSheetOpen, setMobileSheetOpen] = React.useState(false)

    const [history, setHistory] = React.useState<SequenceStep[][]>([steps])
    const [historyIndex, setHistoryIndex] = React.useState(0)

    const selectedStep = selectedStepId ? steps.find((s) => s.id === selectedStepId) : null

    // Push to history for undo/redo
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

    const handleAddStep = (stepType: StepType, afterIndex: number) => {
        const newStep = createDefaultStep(afterIndex + 1, stepType)

        const updatedSteps = steps.map((s) =>
            s.order > afterIndex ? { ...s, order: s.order + 1 } : s
        )
        const newSteps = [
            ...updatedSteps.slice(0, afterIndex + 1),
            newStep,
            ...updatedSteps.slice(afterIndex + 1),
        ]

        setSteps(newSteps)
        pushHistory(newSteps)
        setSelectedStepId(newStep.id)
        setHasUnsavedChanges(true)

        if (isMobile) {
            setMobileSheetOpen(true)
        }
    }

    const handleUpdateStep = (stepId: string, updates: Partial<SequenceStep>) => {
        setSteps((prev) => prev.map((s) => (s.id === stepId ? { ...s, ...updates } : s)))
        setHasUnsavedChanges(true)
    }

    const handleDeleteStep = (stepId: string) => {
        if (steps.length <= 1) {
            toast({
                title: "Cannot delete",
                description: "You need at least one step in the sequence.",
                variant: "destructive",
            })
            return
        }

        const newSteps = steps
            .filter((s) => s.id !== stepId)
            .map((s, i) => ({ ...s, order: i }))

        setSteps(newSteps)
        pushHistory(newSteps)
        setSelectedStepId(null)
        setHasUnsavedChanges(true)
    }

    const handleDuplicateStep = (stepId: string) => {
        const stepToCopy = steps.find((s) => s.id === stepId)
        if (!stepToCopy) return

        const newStep: SequenceStep = {
            ...stepToCopy,
            id: `temp_${Date.now()}_${++tempStepCounter}`,
            order: stepToCopy.order + 1,
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

        const updatedSteps = steps.map((s) =>
            s.order > stepToCopy.order ? { ...s, order: s.order + 1 } : s
        )
        const insertIndex = updatedSteps.findIndex((s) => s.id === stepId) + 1
        const newSteps = [
            ...updatedSteps.slice(0, insertIndex),
            newStep,
            ...updatedSteps.slice(insertIndex),
        ]

        setSteps(newSteps)
        pushHistory(newSteps)
        setSelectedStepId(newStep.id)
        setHasUnsavedChanges(true)
    }

    const handleReorderSteps = (reorderedSteps: SequenceStep[]) => {
        const newSteps = reorderedSteps.map((s, i) => ({ ...s, order: i }))
        setSteps(newSteps)
        pushHistory(newSteps)
        setHasUnsavedChanges(true)
    }

    const handleSave = async () => {
        if (steps.length === 0) {
            toast({
                title: "No steps",
                description: "Please add at least one step to the sequence.",
                variant: "destructive",
            })
            return
        }

        // Check if all email steps have content
        const emptyEmails = steps.filter(
            (s) => s.stepType === "EMAIL" && (!s.subject || !s.body)
        )
        if (emptyEmails.length > 0) {
            toast({
                title: "Incomplete steps",
                description: "Please fill in subject and body for all email steps.",
                variant: "destructive",
            })
            return
        }

        setIsSaving(true)
        try {
            await onSave(steps, sequenceName)
            setHasUnsavedChanges(false)
            toast({
                title: "Sequence saved!",
                description: "Your sequence has been saved successfully.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save sequence. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    // Keyboard shortcuts
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
            if (e.key === "Escape") {
                setSelectedStepId(null)
                setMobileSheetOpen(false)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [steps, historyIndex, history])

    return (
        <div className="flex flex-col h-[calc(100vh-280px)] min-h-[600px] border rounded-lg bg-background overflow-hidden">
            {/* Header */}
            <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 bg-card">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <div className="flex items-center gap-2">
                        <Input
                            value={sequenceName}
                            onChange={(e) => {
                                setSequenceName(e.target.value)
                                setHasUnsavedChanges(true)
                            }}
                            className="h-8 w-48 md:w-64 text-sm font-medium"
                            placeholder="Sequence name..."
                        />
                        <Badge variant="secondary" className="hidden md:flex">
                            {steps.length} {steps.length === 1 ? "step" : "steps"}
                        </Badge>
                    </div>
                    {hasUnsavedChanges && (
                        <Badge variant="outline" className="text-orange-500 border-orange-500/30 animate-pulse hidden md:flex">
                            Unsaved
                        </Badge>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Undo/Redo */}
                    <div className="hidden md:flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleUndo}
                            disabled={historyIndex === 0}
                        >
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

                    <Separator orientation="vertical" className="h-6 hidden md:block" />

                    {/* Zoom controls */}
                    <div className="hidden md:flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="min-w-[3rem] text-center text-sm text-muted-foreground tabular-nums">
                            {zoomLevel}%
                        </span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleFitToScreen}>
                            <Maximize2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <Separator orientation="vertical" className="h-6 hidden md:block" />

                    <Button
                        variant={hasUnsavedChanges ? "default" : "outline"}
                        size="sm"
                        className="gap-2"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        <Save className="h-4 w-4" />
                        <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save & Continue"}</span>
                    </Button>
                </div>
            </header>

            {/* Research Context Bar */}
            {researchData && (
                <div className="h-10 border-b bg-purple-50/50 dark:bg-purple-950/20 flex items-center px-4 gap-4 overflow-x-auto">
                    <div className="flex items-center gap-2 text-xs">
                        <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                        <span className="font-medium text-purple-700 dark:text-purple-400">
                            AI Research Available:
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {researchData.companyInfo && (
                            <Badge variant="outline" className="text-xs">
                                {{ companyInfo }}
                            </Badge>
                        )}
                        {researchData.recentNews?.length && (
                            <Badge variant="outline" className="text-xs">
                                {{ recentNews }}
                            </Badge>
                        )}
                        {researchData.painPoints?.length && (
                            <Badge variant="outline" className="text-xs">
                                {{ painPoint }}
                            </Badge>
                        )}
                        {researchData.talkingPoints?.length && (
                            <Badge variant="outline" className="text-xs">
                                {{ talkingPoints }}
                            </Badge>
                        )}
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {prospectsCount} prospects
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
                {/* Canvas */}
                <div className="flex-1 overflow-auto">
                    <SequenceCanvas
                        steps={steps}
                        selectedStepId={selectedStepId}
                        zoomLevel={zoomLevel}
                        sequenceId={campaignId}
                        enableLinkedIn={isPaidUser}
                        enableCalls={isPaidUser}
                        enableTasks={true}
                        onStepSelect={(stepId) => {
                            setSelectedStepId(stepId)
                            if (isMobile) {
                                setMobileSheetOpen(true)
                            }
                        }}
                        onAddStep={handleAddStep}
                        onDeleteStep={handleDeleteStep}
                        onDuplicateStep={handleDuplicateStep}
                        onReorderSteps={handleReorderSteps}
                    />
                </div>

                {/* Desktop: Step Panel */}
                {selectedStep && !isMobile && (
                    <div className="w-[420px] shrink-0 border-l bg-card flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto">
                            <SequenceStepPanel
                                step={selectedStep}
                                sequenceId={campaignId}
                                userId={userId}
                                onUpdate={(updates) => handleUpdateStep(selectedStep.id, updates)}
                                onClose={() => setSelectedStepId(null)}
                                onDelete={() => handleDeleteStep(selectedStep.id)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile: Step Panel Sheet */}
            <Sheet open={mobileSheetOpen && isMobile} onOpenChange={setMobileSheetOpen}>
                <SheetContent side="bottom" className="h-[85vh] p-0">
                    <SheetHeader className="px-4 py-3 border-b">
                        <SheetTitle>Edit Step</SheetTitle>
                    </SheetHeader>
                    {selectedStep && (
                        <div className="flex-1 overflow-y-auto">
                            <SequenceStepPanel
                                step={selectedStep}
                                sequenceId={campaignId}
                                userId={userId}
                                onUpdate={(updates) => handleUpdateStep(selectedStep.id, updates)}
                                onClose={() => setMobileSheetOpen(false)}
                                onDelete={() => {
                                    handleDeleteStep(selectedStep.id)
                                    setMobileSheetOpen(false)
                                }}
                            />
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Footer */}
            <div className="h-14 border-t bg-background flex items-center justify-between px-4 shrink-0">
                <Button variant="outline" onClick={onBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <div className="text-sm text-muted-foreground hidden md:block">
                    {prospectsCount} prospects will receive this sequence
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save & Continue"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

// Helper function to create a default step
function createDefaultStep(order: number, stepType: StepType = "EMAIL"): SequenceStep {
    return {
        id: `temp_${Date.now()}_${++tempStepCounter}`,
        sequenceId: "",
        order,
        stepType,
        delayValue: order === 0 ? 0 : 2,
        delayUnit: "DAYS" as DelayUnit,
        subject: stepType === "EMAIL" ? "" : null,
        body: stepType === "EMAIL" ? "" : null,
        bodyHtml: null,
        templateId: null,
        variables: null,
        spintaxEnabled: false,
        conditions: null,
        skipIfReplied: true,
        skipIfBounced: true,
        linkedInAction: null,
        linkedInMessage: null,
        callScript: null,
        callDuration: null,
        taskTitle: stepType === "TASK" ? "" : null,
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
}
