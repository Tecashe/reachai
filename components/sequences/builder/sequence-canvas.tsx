

"use client"

import * as React from "react"
import {
  Plus,
  Mail,
  Clock,
  Linkedin,
  Phone,
  CheckSquare,
  GripVertical,
  Copy,
  Trash2,
  MoreHorizontal,
  GitBranch,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { SequenceStep, StepType } from "@/lib/types/sequence"

interface SequenceCanvasProps {
  steps: SequenceStep[]
  selectedStepId: string | null
  zoomLevel: number
  sequenceId: string
  enableLinkedIn?: boolean
  enableCalls?: boolean
  enableTasks?: boolean
  onStepSelect: (stepId: string) => void
  onAddStep: (type: StepType, index: number) => void
  onDeleteStep: (stepId: string) => void
  onDuplicateStep: (stepId: string) => void
  onReorderSteps: (newSteps: SequenceStep[]) => void
}

const STEP_ICONS: Record<StepType, React.ElementType> = {
  EMAIL: Mail,
  DELAY: Clock,
  LINKEDIN_VIEW: Linkedin,
  LINKEDIN_CONNECT: Linkedin,
  LINKEDIN_MESSAGE: Linkedin,
  CALL: Phone,
  TASK: CheckSquare,
  CONDITION: GitBranch,
}

const STEP_COLORS: Record<StepType, string> = {
  EMAIL: "bg-blue-500/10 border-blue-500/30 text-blue-600",
  DELAY: "bg-gray-500/10 border-gray-500/30 text-gray-600",
  LINKEDIN_VIEW: "bg-sky-500/10 border-sky-500/30 text-sky-600",
  LINKEDIN_CONNECT: "bg-sky-500/10 border-sky-500/30 text-sky-600",
  LINKEDIN_MESSAGE: "bg-sky-500/10 border-sky-500/30 text-sky-600",
  CALL: "bg-green-500/10 border-green-500/30 text-green-600",
  TASK: "bg-purple-500/10 border-purple-500/30 text-purple-600",
  CONDITION: "bg-yellow-500/10 border-yellow-500/30 text-yellow-600",
}

const STEP_LABELS: Record<StepType, string> = {
  EMAIL: "Email",
  DELAY: "Delay",
  LINKEDIN_VIEW: "LinkedIn View",
  LINKEDIN_CONNECT: "LinkedIn Connect",
  LINKEDIN_MESSAGE: "LinkedIn Message",
  CALL: "Call",
  TASK: "Task",
  CONDITION: "Condition",
}

export function SequenceCanvas({
  steps,
  selectedStepId,
  zoomLevel,
  sequenceId,
  enableLinkedIn = false,
  enableCalls = false,
  enableTasks = false,
  onStepSelect,
  onAddStep,
  onDeleteStep,
  onDuplicateStep,
  onReorderSteps,
}: SequenceCanvasProps) {
  const [draggedStep, setDraggedStep] = React.useState<string | null>(null)
  const [showAddMenu, setShowAddMenu] = React.useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, stepId: string) => {
    setDraggedStep(stepId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (!draggedStep) return

    const draggedIndex = steps.findIndex((s) => s.id === draggedStep)
    if (draggedIndex === -1 || draggedIndex === targetIndex) {
      setDraggedStep(null)
      return
    }

    const newSteps = [...steps]
    const [removed] = newSteps.splice(draggedIndex, 1)
    newSteps.splice(targetIndex, 0, removed)

    onReorderSteps(newSteps)
    setDraggedStep(null)
  }

  const handleDragEnd = () => {
    setDraggedStep(null)
  }

  const getStepDescription = (step: SequenceStep) => {
    switch (step.stepType) {
      case "EMAIL":
        return step.subject || "No subject"
      case "DELAY":
        return `Wait ${step.delayValue} ${step.delayUnit.toLowerCase()}`
      case "LINKEDIN_VIEW":
        return "View profile"
      case "LINKEDIN_CONNECT":
        return "Send connection request"
      case "LINKEDIN_MESSAGE":
        return step.linkedInMessage?.slice(0, 50) || "Send message"
      case "CALL":
        return step.callScript?.slice(0, 50) || "Make call"
      case "TASK":
        return step.taskTitle || "Complete task"
      case "CONDITION":
        const conditions = step.conditions as Record<string, unknown> | null
        return (conditions?.description as string) || "Check condition"
      default:
        return ""
    }
  }

  return (
    <div
      className="min-h-full p-8 flex flex-col items-center"
      style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
    >
      {/* Start node */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-xs text-muted-foreground mt-2">Start</span>
      </div>

      {/* Connector line */}
      <div className="w-0.5 h-8 bg-border" />

      {/* Steps */}
      {steps.length === 0 ? (
        <div className="flex flex-col items-center">
          <AddStepButton
            onAdd={(type) => onAddStep(type, -1)}
            enableLinkedIn={enableLinkedIn}
            enableCalls={enableCalls}
            enableTasks={enableTasks}
          />
        </div>
      ) : (
        steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Add step button above */}
            {index === 0 && (
              <>
                <AddStepButton
                  onAdd={(type) => onAddStep(type, -1)}
                  enableLinkedIn={enableLinkedIn}
                  enableCalls={enableCalls}
                  enableTasks={enableTasks}
                />
                <div className="w-0.5 h-4 bg-border" />
              </>
            )}

            {/* Step card */}
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, step.id)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              onClick={() => onStepSelect(step.id)}
              className={cn(
                "w-80 rounded-lg border-2 p-4 cursor-pointer transition-all",
                STEP_COLORS[step.stepType],
                selectedStepId === step.id && "ring-2 ring-primary ring-offset-2",
                draggedStep === step.id && "opacity-50",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="cursor-grab active:cursor-grabbing">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className={cn("p-2 rounded-md", STEP_COLORS[step.stepType])}>
                  {React.createElement(STEP_ICONS[step.stepType], { className: "h-5 w-5" })}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{STEP_LABELS[step.stepType]}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            onDuplicateStep(step.id)
                          }}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteStep(step.id)
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-1">{getStepDescription(step)}</p>
                  {step.stepType === "EMAIL" && (
                    <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                      <span>Sent: {step.sent}</span>
                      <span>Opened: {step.opened}</span>
                      <span>Replied: {step.replied}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Connector and add button */}
            <div className="w-0.5 h-4 bg-border" />
            <AddStepButton
              onAdd={(type) => onAddStep(type, index)}
              enableLinkedIn={enableLinkedIn}
              enableCalls={enableCalls}
              enableTasks={enableTasks}
            />
            {index < steps.length - 1 && <div className="w-0.5 h-4 bg-border" />}
          </React.Fragment>
        ))
      )}

      {/* End node */}
      <div className="w-0.5 h-8 bg-border" />
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-red-500" />
        </div>
        <span className="text-xs text-muted-foreground mt-2">End</span>
      </div>
    </div>
  )
}

interface AddStepButtonProps {
  onAdd: (type: StepType) => void
  enableLinkedIn?: boolean
  enableCalls?: boolean
  enableTasks?: boolean
}

function AddStepButton({
  onAdd,
  enableLinkedIn = false,
  enableCalls = false,
  enableTasks = false,
}: AddStepButtonProps) {
  const showLinkedInSection = enableLinkedIn
  const showCallsSection = enableCalls
  const showTasksSection = enableTasks

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-dashed hover:border-solid transition-all bg-transparent"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {/* Email and Delay are always available */}
        <DropdownMenuItem onClick={() => onAdd("EMAIL")}>
          <Mail className="mr-2 h-4 w-4 text-blue-500" />
          Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd("DELAY")}>
          <Clock className="mr-2 h-4 w-4 text-gray-500" />
          Delay
        </DropdownMenuItem>

        {/* LinkedIn options - only show if enabled */}
        {showLinkedInSection && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAdd("LINKEDIN_VIEW")}>
              <Linkedin className="mr-2 h-4 w-4 text-sky-500" />
              LinkedIn View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAdd("LINKEDIN_CONNECT")}>
              <Linkedin className="mr-2 h-4 w-4 text-sky-500" />
              LinkedIn Connect
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAdd("LINKEDIN_MESSAGE")}>
              <Linkedin className="mr-2 h-4 w-4 text-sky-500" />
              LinkedIn Message
            </DropdownMenuItem>
          </>
        )}

        {/* Call and Task options - only show if enabled */}
        {(showCallsSection || showTasksSection) && <DropdownMenuSeparator />}

        {showCallsSection && (
          <DropdownMenuItem onClick={() => onAdd("CALL")}>
            <Phone className="mr-2 h-4 w-4 text-green-500" />
            Call
          </DropdownMenuItem>
        )}

        {showTasksSection && (
          <DropdownMenuItem onClick={() => onAdd("TASK")}>
            <CheckSquare className="mr-2 h-4 w-4 text-purple-500" />
            Task
          </DropdownMenuItem>
        )}

        {/* Condition option - always available */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAdd("CONDITION")}>
          <GitBranch className="mr-2 h-4 w-4 text-yellow-500" />
          Condition
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
