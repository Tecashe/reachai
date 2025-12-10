"use client"

import * as React from "react"
import {
  Plus,
  Mail,
  Linkedin,
  Phone,
  Clock,
  GitBranch,
  CheckSquare,
  GripVertical,
  Trash2,
  Copy,
  MoreHorizontal,
  ArrowDown,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { SequenceStep, StepType, DelayUnit } from "@/lib/types/sequence"

interface SequenceCanvasProps {
  steps: SequenceStep[]
  selectedStepId: string | null
  zoomLevel: number
  sequenceId: string
  onStepSelect: (stepId: string | null) => void
  onAddStep: (stepType: StepType, afterIndex: number) => void
  onDeleteStep: (stepId: string) => void
  onDuplicateStep: (stepId: string) => void
  onReorderSteps: (steps: SequenceStep[]) => void
}

const STEP_TYPE_CONFIG: Record<
  StepType,
  { icon: React.ElementType; label: string; color: string; bgColor: string; borderColor: string }
> = {
  EMAIL: {
    icon: Mail,
    label: "Email",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  LINKEDIN_CONNECT: {
    icon: Linkedin,
    label: "LinkedIn Connect",
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
    borderColor: "border-blue-600/20",
  },
  LINKEDIN_MESSAGE: {
    icon: Linkedin,
    label: "LinkedIn Message",
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
    borderColor: "border-blue-600/20",
  },
  LINKEDIN_VIEW: {
    icon: Linkedin,
    label: "LinkedIn View",
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
    borderColor: "border-blue-600/20",
  },
  CALL: {
    icon: Phone,
    label: "Call",
    color: "text-green-600",
    bgColor: "bg-green-600/10",
    borderColor: "border-green-600/20",
  },
  TASK: {
    icon: CheckSquare,
    label: "Task",
    color: "text-orange-600",
    bgColor: "bg-orange-600/10",
    borderColor: "border-orange-600/20",
  },
  DELAY: {
    icon: Clock,
    label: "Delay",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  CONDITION: {
    icon: GitBranch,
    label: "Condition",
    color: "text-yellow-600",
    bgColor: "bg-yellow-600/10",
    borderColor: "border-yellow-600/20",
  },
}

const DELAY_UNIT_LABELS: Record<DelayUnit, string> = {
  MINUTES: "min",
  HOURS: "hr",
  DAYS: "day",
  WEEKS: "wk",
}

export function SequenceCanvas({
  steps,
  selectedStepId,
  zoomLevel,
  sequenceId,
  onStepSelect,
  onAddStep,
  onDeleteStep,
  onDuplicateStep,
  onReorderSteps,
}: SequenceCanvasProps) {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newSteps = [...steps]
      const [removed] = newSteps.splice(draggedIndex, 1)
      newSteps.splice(dragOverIndex, 0, removed)
      onReorderSteps(newSteps)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const formatDelay = (value: number, unit: DelayUnit) => {
    const label = DELAY_UNIT_LABELS[unit]
    return `${value} ${label}${value !== 1 ? "s" : ""}`
  }

  return (
    <TooltipProvider>
      <div
        className="relative h-full w-full overflow-auto bg-muted/30"
        style={{
          backgroundImage: `radial-gradient(circle, var(--border) 1px, transparent 1px)`,
          backgroundSize: `${20 * (zoomLevel / 100)}px ${20 * (zoomLevel / 100)}px`,
        }}
        onClick={() => onStepSelect(null)}
      >
        <div
          className="flex min-h-full flex-col items-center py-12"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
        >
          {/* Start node */}
          <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-primary/50 bg-primary/10">
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
            <span className="mt-2 text-sm font-medium text-muted-foreground">Start</span>
          </div>

          {/* Connection line */}
          <div className="h-8 w-px bg-border" />

          {/* Add first step button */}
          {steps.length === 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 rounded-full bg-transparent">
                  <Plus className="h-4 w-4" />
                  Add first step
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.entries(STEP_TYPE_CONFIG).map(([type, config]) => (
                  <DropdownMenuItem key={type} onClick={() => onAddStep(type as StepType, -1)}>
                    <config.icon className={cn("mr-2 h-4 w-4", config.color)} />
                    {config.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Steps */}
          {steps.map((step, index) => {
            const config = STEP_TYPE_CONFIG[step.stepType]
            const isSelected = selectedStepId === step.id
            const isDragging = draggedIndex === index
            const isDragOver = dragOverIndex === index

            return (
              <React.Fragment key={step.id}>
                {/* Delay indicator */}
                {index > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">
                        Wait {formatDelay(step.delayValue, step.delayUnit)}
                      </span>
                    </div>
                    <div className="h-4 w-px bg-border" />
                  </div>
                )}

                {/* Step card */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onStepSelect(step.id)}
                  className={cn(
                    "group relative w-80 cursor-pointer rounded-lg border bg-card p-4 shadow-sm transition-all",
                    isSelected && "ring-2 ring-primary border-primary",
                    isDragging && "opacity-50",
                    isDragOver && "border-primary border-dashed",
                    !isSelected && "hover:shadow-md hover:border-border/80",
                  )}
                >
                  {/* Drag handle */}
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                  </div>

                  {/* Step header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", config.bgColor)}>
                        <config.icon className={cn("h-5 w-5", config.color)} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{config.label}</span>
                          <span className="text-xs text-muted-foreground">Step {index + 1}</span>
                        </div>
                        {step.subject && (
                          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{step.subject}</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onDuplicateStep(step.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDeleteStep(step.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Stats */}
                  {(step.sent > 0 || step.opened > 0 || step.replied > 0) && (
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{step.sent} sent</span>
                      <span>{step.opened} opened</span>
                      <span>{step.replied} replied</span>
                    </div>
                  )}
                </div>

                {/* Connection line + Add button */}
                <div className="flex flex-col items-center">
                  <div className="h-4 w-px bg-border" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity bg-transparent"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {Object.entries(STEP_TYPE_CONFIG).map(([type, cfg]) => (
                        <DropdownMenuItem key={type} onClick={() => onAddStep(type as StepType, index)}>
                          <cfg.icon className={cn("mr-2 h-4 w-4", cfg.color)} />
                          {cfg.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="h-4 w-px bg-border" />
                </div>
              </React.Fragment>
            )
          })}

          {/* End node */}
          {steps.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted">
                <ArrowDown className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="mt-2 text-sm font-medium text-muted-foreground">End</span>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
