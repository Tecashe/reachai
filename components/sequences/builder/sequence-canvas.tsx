// "use client"

// import * as React from "react"
// import {
//   Plus,
//   Mail,
//   Linkedin,
//   Phone,
//   Clock,
//   GitBranch,
//   CheckSquare,
//   GripVertical,
//   Trash2,
//   Copy,
//   MoreHorizontal,
//   ArrowDown,
//   ChevronRight,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { TooltipProvider } from "@/components/ui/tooltip"
// import { cn } from "@/lib/utils"
// import type { SequenceStep, StepType, DelayUnit } from "@/lib/types/sequence"

// interface SequenceCanvasProps {
//   steps: SequenceStep[]
//   selectedStepId: string | null
//   zoomLevel: number
//   sequenceId: string
//   onStepSelect: (stepId: string | null) => void
//   onAddStep: (stepType: StepType, afterIndex: number) => void
//   onDeleteStep: (stepId: string) => void
//   onDuplicateStep: (stepId: string) => void
//   onReorderSteps: (steps: SequenceStep[]) => void
// }

// const STEP_TYPE_CONFIG: Record<
//   StepType,
//   { icon: React.ElementType; label: string; color: string; bgColor: string; borderColor: string }
// > = {
//   EMAIL: {
//     icon: Mail,
//     label: "Email",
//     color: "text-primary",
//     bgColor: "bg-primary/10",
//     borderColor: "border-primary/20",
//   },
//   LINKEDIN_CONNECT: {
//     icon: Linkedin,
//     label: "LinkedIn Connect",
//     color: "text-blue-600",
//     bgColor: "bg-blue-600/10",
//     borderColor: "border-blue-600/20",
//   },
//   LINKEDIN_MESSAGE: {
//     icon: Linkedin,
//     label: "LinkedIn Message",
//     color: "text-blue-600",
//     bgColor: "bg-blue-600/10",
//     borderColor: "border-blue-600/20",
//   },
//   LINKEDIN_VIEW: {
//     icon: Linkedin,
//     label: "LinkedIn View",
//     color: "text-blue-600",
//     bgColor: "bg-blue-600/10",
//     borderColor: "border-blue-600/20",
//   },
//   CALL: {
//     icon: Phone,
//     label: "Call",
//     color: "text-green-600",
//     bgColor: "bg-green-600/10",
//     borderColor: "border-green-600/20",
//   },
//   TASK: {
//     icon: CheckSquare,
//     label: "Task",
//     color: "text-orange-600",
//     bgColor: "bg-orange-600/10",
//     borderColor: "border-orange-600/20",
//   },
//   DELAY: {
//     icon: Clock,
//     label: "Delay",
//     color: "text-orange-500",
//     bgColor: "bg-orange-500/10",
//     borderColor: "border-orange-500/20",
//   },
//   CONDITION: {
//     icon: GitBranch,
//     label: "Condition",
//     color: "text-yellow-600",
//     bgColor: "bg-yellow-600/10",
//     borderColor: "border-yellow-600/20",
//   },
// }

// const DELAY_UNIT_LABELS: Record<DelayUnit, string> = {
//   MINUTES: "min",
//   HOURS: "hr",
//   DAYS: "day",
//   WEEKS: "wk",
// }

// export function SequenceCanvas({
//   steps,
//   selectedStepId,
//   zoomLevel,
//   sequenceId,
//   onStepSelect,
//   onAddStep,
//   onDeleteStep,
//   onDuplicateStep,
//   onReorderSteps,
// }: SequenceCanvasProps) {
//   const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)
//   const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null)

//   const handleDragStart = (e: React.DragEvent, index: number) => {
//     setDraggedIndex(index)
//     e.dataTransfer.effectAllowed = "move"
//   }

//   const handleDragOver = (e: React.DragEvent, index: number) => {
//     e.preventDefault()
//     if (draggedIndex !== null && draggedIndex !== index) {
//       setDragOverIndex(index)
//     }
//   }

//   const handleDragEnd = () => {
//     if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
//       const newSteps = [...steps]
//       const [removed] = newSteps.splice(draggedIndex, 1)
//       newSteps.splice(dragOverIndex, 0, removed)
//       onReorderSteps(newSteps)
//     }
//     setDraggedIndex(null)
//     setDragOverIndex(null)
//   }

//   const formatDelay = (value: number, unit: DelayUnit) => {
//     const label = DELAY_UNIT_LABELS[unit]
//     return `${value} ${label}${value !== 1 ? "s" : ""}`
//   }

//   return (
//     <TooltipProvider>
//       <div
//         className="relative h-full w-full overflow-auto bg-muted/30"
//         style={{
//           backgroundImage: `radial-gradient(circle, var(--border) 1px, transparent 1px)`,
//           backgroundSize: `${20 * (zoomLevel / 100)}px ${20 * (zoomLevel / 100)}px`,
//         }}
//         onClick={() => onStepSelect(null)}
//       >
//         <div
//           className="flex min-h-full flex-col items-center py-12"
//           style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
//         >
//           {/* Start node */}
//           <div className="flex flex-col items-center">
//             <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-primary/50 bg-primary/10">
//               <ChevronRight className="h-5 w-5 text-primary" />
//             </div>
//             <span className="mt-2 text-sm font-medium text-muted-foreground">Start</span>
//           </div>

//           {/* Connection line */}
//           <div className="h-8 w-px bg-border" />

//           {/* Add first step button */}
//           {steps.length === 0 && (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="sm" className="gap-2 rounded-full bg-transparent">
//                   <Plus className="h-4 w-4" />
//                   Add first step
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 {Object.entries(STEP_TYPE_CONFIG).map(([type, config]) => (
//                   <DropdownMenuItem key={type} onClick={() => onAddStep(type as StepType, -1)}>
//                     <config.icon className={cn("mr-2 h-4 w-4", config.color)} />
//                     {config.label}
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           )}

//           {/* Steps */}
//           {steps.map((step, index) => {
//             const config = STEP_TYPE_CONFIG[step.stepType]
//             const isSelected = selectedStepId === step.id
//             const isDragging = draggedIndex === index
//             const isDragOver = dragOverIndex === index

//             return (
//               <React.Fragment key={step.id}>
//                 {/* Delay indicator */}
//                 {index > 0 && (
//                   <div className="flex flex-col items-center">
//                     <div className="h-4 w-px bg-border" />
//                     <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
//                       <Clock className="h-3 w-3 text-muted-foreground" />
//                       <span className="text-xs font-medium text-muted-foreground">
//                         Wait {formatDelay(step.delayValue, step.delayUnit)}
//                       </span>
//                     </div>
//                     <div className="h-4 w-px bg-border" />
//                   </div>
//                 )}

//                 {/* Step card */}
//                 <div
//                   draggable
//                   onDragStart={(e) => handleDragStart(e, index)}
//                   onDragOver={(e) => handleDragOver(e, index)}
//                   onDragEnd={handleDragEnd}
//                   onClick={() => onStepSelect(step.id)}
//                   className={cn(
//                     "group relative w-80 cursor-pointer rounded-lg border bg-card p-4 shadow-sm transition-all",
//                     isSelected && "ring-2 ring-primary border-primary",
//                     isDragging && "opacity-50",
//                     isDragOver && "border-primary border-dashed",
//                     !isSelected && "hover:shadow-md hover:border-border/80",
//                   )}
//                 >
//                   {/* Drag handle */}
//                   <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
//                   </div>

//                   {/* Step header */}
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", config.bgColor)}>
//                         <config.icon className={cn("h-5 w-5", config.color)} />
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <span className="font-medium">{config.label}</span>
//                           <span className="text-xs text-muted-foreground">Step {index + 1}</span>
//                         </div>
//                         {step.subject && (
//                           <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{step.subject}</p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem onClick={() => onDuplicateStep(step.id)}>
//                           <Copy className="mr-2 h-4 w-4" />
//                           Duplicate
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem
//                           onClick={() => onDeleteStep(step.id)}
//                           className="text-destructive focus:text-destructive"
//                         >
//                           <Trash2 className="mr-2 h-4 w-4" />
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>

//                   {/* Stats */}
//                   {(step.sent > 0 || step.opened > 0 || step.replied > 0) && (
//                     <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
//                       <span>{step.sent} sent</span>
//                       <span>{step.opened} opened</span>
//                       <span>{step.replied} replied</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Connection line + Add button */}
//                 <div className="flex flex-col items-center">
//                   <div className="h-4 w-px bg-border" />
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity bg-transparent"
//                       >
//                         <Plus className="h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent>
//                       {Object.entries(STEP_TYPE_CONFIG).map(([type, cfg]) => (
//                         <DropdownMenuItem key={type} onClick={() => onAddStep(type as StepType, index)}>
//                           <cfg.icon className={cn("mr-2 h-4 w-4", cfg.color)} />
//                           {cfg.label}
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                   <div className="h-4 w-px bg-border" />
//                 </div>
//               </React.Fragment>
//             )
//           })}

//           {/* End node */}
//           {steps.length > 0 && (
//             <div className="flex flex-col items-center">
//               <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted">
//                 <ArrowDown className="h-5 w-5 text-muted-foreground" />
//               </div>
//               <span className="mt-2 text-sm font-medium text-muted-foreground">End</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </TooltipProvider>
//   )
// }

// "use client"

// import * as React from "react"
// import {
//   Plus,
//   Mail,
//   Linkedin,
//   Phone,
//   Clock,
//   GitBranch,
//   CheckSquare,
//   GripVertical,
//   Trash2,
//   Copy,
//   MoreHorizontal,
//   ArrowDown,
//   ChevronRight,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { TooltipProvider } from "@/components/ui/tooltip"
// import { cn } from "@/lib/utils"
// import type { SequenceStep, StepType, DelayUnit } from "@/lib/types/sequence"

// interface SequenceCanvasProps {
//   steps: SequenceStep[]
//   selectedStepId: string | null
//   zoomLevel: number
//   sequenceId: string
//   onStepSelect: (stepId: string | null) => void
//   onAddStep: (stepType: StepType, afterIndex: number) => void
//   onDeleteStep: (stepId: string) => void
//   onDuplicateStep: (stepId: string) => void
//   onReorderSteps: (steps: SequenceStep[]) => void
// }

// const STEP_TYPE_CONFIG: Record<
//   StepType,
//   { icon: React.ElementType; label: string; color: string; bgColor: string; borderColor: string }
// > = {
//   EMAIL: {
//     icon: Mail,
//     label: "Email",
//     color: "text-primary",
//     bgColor: "bg-primary/10",
//     borderColor: "border-primary/20",
//   },
//   LINKEDIN_CONNECT: {
//     icon: Linkedin,
//     label: "LinkedIn Connect",
//     color: "text-blue-600",
//     bgColor: "bg-blue-600/10",
//     borderColor: "border-blue-600/20",
//   },
//   LINKEDIN_MESSAGE: {
//     icon: Linkedin,
//     label: "LinkedIn Message",
//     color: "text-blue-600",
//     bgColor: "bg-blue-600/10",
//     borderColor: "border-blue-600/20",
//   },
//   LINKEDIN_VIEW: {
//     icon: Linkedin,
//     label: "LinkedIn View",
//     color: "text-blue-600",
//     bgColor: "bg-blue-600/10",
//     borderColor: "border-blue-600/20",
//   },
//   CALL: {
//     icon: Phone,
//     label: "Call",
//     color: "text-green-600",
//     bgColor: "bg-green-600/10",
//     borderColor: "border-green-600/20",
//   },
//   TASK: {
//     icon: CheckSquare,
//     label: "Task",
//     color: "text-orange-600",
//     bgColor: "bg-orange-600/10",
//     borderColor: "border-orange-600/20",
//   },
//   DELAY: {
//     icon: Clock,
//     label: "Delay",
//     color: "text-orange-500",
//     bgColor: "bg-orange-500/10",
//     borderColor: "border-orange-500/20",
//   },
//   CONDITION: {
//     icon: GitBranch,
//     label: "Condition",
//     color: "text-yellow-600",
//     bgColor: "bg-yellow-600/10",
//     borderColor: "border-yellow-600/20",
//   },
// }

// const DELAY_UNIT_LABELS: Record<DelayUnit, string> = {
//   MINUTES: "min",
//   HOURS: "hr",
//   DAYS: "day",
//   WEEKS: "wk",
// }

// export function SequenceCanvas({
//   steps,
//   selectedStepId,
//   zoomLevel,
//   sequenceId,
//   onStepSelect,
//   onAddStep,
//   onDeleteStep,
//   onDuplicateStep,
//   onReorderSteps,
// }: SequenceCanvasProps) {
//   const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)
//   const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null)

//   const handleDragStart = (e: React.DragEvent, index: number) => {
//     setDraggedIndex(index)
//     e.dataTransfer.effectAllowed = "move"
//   }

//   const handleDragOver = (e: React.DragEvent, index: number) => {
//     e.preventDefault()
//     if (draggedIndex !== null && draggedIndex !== index) {
//       setDragOverIndex(index)
//     }
//   }

//   const handleDragEnd = () => {
//     if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
//       const newSteps = [...steps]
//       const [removed] = newSteps.splice(draggedIndex, 1)
//       newSteps.splice(dragOverIndex, 0, removed)
//       onReorderSteps(newSteps)
//     }
//     setDraggedIndex(null)
//     setDragOverIndex(null)
//   }

//   const formatDelay = (value: number, unit: DelayUnit) => {
//     const label = DELAY_UNIT_LABELS[unit]
//     return `${value} ${label}${value !== 1 ? "s" : ""}`
//   }

//   return (
//     <TooltipProvider>
//       <div
//         className="relative h-full w-full overflow-auto bg-muted/30"
//         style={{
//           backgroundImage: `radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)`,
//           backgroundSize: `${20 * (zoomLevel / 100)}px ${20 * (zoomLevel / 100)}px`,
//         }}
//         onClick={(e) => {
//           // Only deselect if clicking directly on the canvas background
//           if (e.target === e.currentTarget) {
//             onStepSelect(null)
//           }
//         }}
//       >
//         <div
//           className="flex min-h-full flex-col items-center py-12 pb-32"
//           style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
//         >
//           {/* Start node */}
//           <div className="flex flex-col items-center">
//             <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-primary/10 shadow-sm">
//               <ChevronRight className="h-6 w-6 text-primary" />
//             </div>
//             <span className="mt-2 text-sm font-medium text-foreground">Start</span>
//           </div>

//           {/* Connection line */}
//           <div className="h-8 w-0.5 bg-border" />

//           {/* Add first step button - always visible */}
//           {steps.length === 0 && (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="gap-2 rounded-full border-dashed border-2 px-4 py-2 bg-card hover:bg-accent hover:border-primary transition-colors"
//                 >
//                   <Plus className="h-4 w-4" />
//                   Add first step
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-48">
//                 {Object.entries(STEP_TYPE_CONFIG).map(([type, config]) => (
//                   <DropdownMenuItem
//                     key={type}
//                     onClick={() => onAddStep(type as StepType, -1)}
//                     className="cursor-pointer"
//                   >
//                     <config.icon className={cn("mr-2 h-4 w-4", config.color)} />
//                     {config.label}
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           )}

//           {/* Steps */}
//           {steps.map((step, index) => {
//             const config = STEP_TYPE_CONFIG[step.stepType]
//             const isSelected = selectedStepId === step.id
//             const isDragging = draggedIndex === index
//             const isDragOver = dragOverIndex === index

//             return (
//               <React.Fragment key={step.id}>
//                 {/* Delay indicator */}
//                 {index > 0 && (
//                   <div className="flex flex-col items-center">
//                     <div className="h-4 w-0.5 bg-border" />
//                     <div className="flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 shadow-sm">
//                       <Clock className="h-3.5 w-3.5 text-muted-foreground" />
//                       <span className="text-xs font-medium text-muted-foreground">
//                         Wait {formatDelay(step.delayValue, step.delayUnit)}
//                       </span>
//                     </div>
//                     <div className="h-4 w-0.5 bg-border" />
//                   </div>
//                 )}

//                 {/* Step card */}
//                 <div
//                   draggable
//                   onDragStart={(e) => handleDragStart(e, index)}
//                   onDragOver={(e) => handleDragOver(e, index)}
//                   onDragEnd={handleDragEnd}
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     onStepSelect(step.id)
//                   }}
//                   className={cn(
//                     "group relative w-[340px] cursor-pointer rounded-xl border-2 bg-card p-4 shadow-sm transition-all duration-200",
//                     isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary shadow-md",
//                     isDragging && "opacity-50 scale-95",
//                     isDragOver && "border-primary border-dashed bg-primary/5",
//                     !isSelected && "hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5",
//                   )}
//                 >
//                   {/* Drag handle */}
//                   <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <div className="p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing">
//                       <GripVertical className="h-5 w-5 text-muted-foreground" />
//                     </div>
//                   </div>

//                   {/* Step header */}
//                   <div className="flex items-start justify-between gap-3">
//                     <div className="flex items-center gap-3 flex-1 min-w-0">
//                       <div
//                         className={cn(
//                           "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
//                           config.bgColor,
//                           config.borderColor,
//                           "border",
//                         )}
//                       >
//                         <config.icon className={cn("h-5 w-5", config.color)} />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2">
//                           <span className="font-semibold text-foreground">{config.label}</span>
//                           <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
//                             Step {index + 1}
//                           </span>
//                         </div>
//                         {step.subject && (
//                           <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{step.subject}</p>
//                         )}
//                         {!step.subject && step.stepType === "EMAIL" && (
//                           <p className="mt-1 text-sm text-muted-foreground/60 italic">No subject set</p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem onClick={() => onDuplicateStep(step.id)}>
//                           <Copy className="mr-2 h-4 w-4" />
//                           Duplicate
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem
//                           onClick={() => onDeleteStep(step.id)}
//                           className="text-destructive focus:text-destructive focus:bg-destructive/10"
//                         >
//                           <Trash2 className="mr-2 h-4 w-4" />
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>

//                   {/* Stats */}
//                   {(step.sent > 0 || step.opened > 0 || step.replied > 0) && (
//                     <div className="mt-3 pt-3 border-t flex items-center gap-4 text-xs">
//                       <div className="flex items-center gap-1">
//                         <span className="text-muted-foreground">Sent:</span>
//                         <span className="font-medium">{step.sent}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <span className="text-muted-foreground">Opened:</span>
//                         <span className="font-medium text-blue-600">{step.opened}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <span className="text-muted-foreground">Replied:</span>
//                         <span className="font-medium text-green-600">{step.replied}</span>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Connection line + Add button - ALWAYS VISIBLE */}
//                 <div className="flex flex-col items-center">
//                   <div className="h-3 w-0.5 bg-border" />
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         className="h-8 w-8 rounded-full border-2 border-dashed border-muted-foreground/30 bg-card hover:border-primary hover:bg-primary/10 transition-all shadow-sm"
//                       >
//                         <Plus className="h-4 w-4 text-muted-foreground" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent className="w-48">
//                       {Object.entries(STEP_TYPE_CONFIG).map(([type, cfg]) => (
//                         <DropdownMenuItem
//                           key={type}
//                           onClick={() => onAddStep(type as StepType, index)}
//                           className="cursor-pointer"
//                         >
//                           <cfg.icon className={cn("mr-2 h-4 w-4", cfg.color)} />
//                           {cfg.label}
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                   <div className="h-3 w-0.5 bg-border" />
//                 </div>
//               </React.Fragment>
//             )
//           })}

//           {/* End node */}
//           {steps.length > 0 && (
//             <div className="flex flex-col items-center">
//               <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/40 bg-muted shadow-sm">
//                 <ArrowDown className="h-6 w-6 text-muted-foreground" />
//               </div>
//               <span className="mt-2 text-sm font-medium text-muted-foreground">End</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </TooltipProvider>
//   )
// }


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
