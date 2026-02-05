

// "use client"

// import * as React from "react"
// import {
//   Plus,
//   Mail,
//   Clock,
//   Linkedin,
//   Phone,
//   CheckSquare,
//   GripVertical,
//   Copy,
//   Trash2,
//   MoreHorizontal,
//   GitBranch,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { cn } from "@/lib/utils"
// import type { SequenceStep, StepType } from "@/lib/types/sequence"

// interface SequenceCanvasProps {
//   steps: SequenceStep[]
//   selectedStepId: string | null
//   zoomLevel: number
//   sequenceId: string
//   enableLinkedIn?: boolean
//   enableCalls?: boolean
//   enableTasks?: boolean
//   onStepSelect: (stepId: string) => void
//   onAddStep: (type: StepType, index: number) => void
//   onDeleteStep: (stepId: string) => void
//   onDuplicateStep: (stepId: string) => void
//   onReorderSteps: (newSteps: SequenceStep[]) => void
// }

// const STEP_ICONS: Record<StepType, React.ElementType> = {
//   EMAIL: Mail,
//   DELAY: Clock,
//   LINKEDIN_VIEW: Linkedin,
//   LINKEDIN_CONNECT: Linkedin,
//   LINKEDIN_MESSAGE: Linkedin,
//   CALL: Phone,
//   TASK: CheckSquare,
//   CONDITION: GitBranch,
// }

// const STEP_COLORS: Record<StepType, string> = {
//   EMAIL: "bg-blue-500/10 border-blue-500/30 text-blue-600",
//   DELAY: "bg-gray-500/10 border-gray-500/30 text-gray-600",
//   LINKEDIN_VIEW: "bg-sky-500/10 border-sky-500/30 text-sky-600",
//   LINKEDIN_CONNECT: "bg-sky-500/10 border-sky-500/30 text-sky-600",
//   LINKEDIN_MESSAGE: "bg-sky-500/10 border-sky-500/30 text-sky-600",
//   CALL: "bg-green-500/10 border-green-500/30 text-green-600",
//   TASK: "bg-purple-500/10 border-purple-500/30 text-purple-600",
//   CONDITION: "bg-yellow-500/10 border-yellow-500/30 text-yellow-600",
// }

// const STEP_LABELS: Record<StepType, string> = {
//   EMAIL: "Email",
//   DELAY: "Delay",
//   LINKEDIN_VIEW: "LinkedIn View",
//   LINKEDIN_CONNECT: "LinkedIn Connect",
//   LINKEDIN_MESSAGE: "LinkedIn Message",
//   CALL: "Call",
//   TASK: "Task",
//   CONDITION: "Condition",
// }

// export function SequenceCanvas({
//   steps,
//   selectedStepId,
//   zoomLevel,
//   sequenceId,
//   enableLinkedIn = false,
//   enableCalls = false,
//   enableTasks = false,
//   onStepSelect,
//   onAddStep,
//   onDeleteStep,
//   onDuplicateStep,
//   onReorderSteps,
// }: SequenceCanvasProps) {
//   const [draggedStep, setDraggedStep] = React.useState<string | null>(null)
//   const [showAddMenu, setShowAddMenu] = React.useState<number | null>(null)

//   const handleDragStart = (e: React.DragEvent, stepId: string) => {
//     setDraggedStep(stepId)
//     e.dataTransfer.effectAllowed = "move"
//   }

//   const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
//     e.preventDefault()
//     e.dataTransfer.dropEffect = "move"
//   }

//   const handleDrop = (e: React.DragEvent, targetIndex: number) => {
//     e.preventDefault()
//     if (!draggedStep) return

//     const draggedIndex = steps.findIndex((s) => s.id === draggedStep)
//     if (draggedIndex === -1 || draggedIndex === targetIndex) {
//       setDraggedStep(null)
//       return
//     }

//     const newSteps = [...steps]
//     const [removed] = newSteps.splice(draggedIndex, 1)
//     newSteps.splice(targetIndex, 0, removed)

//     onReorderSteps(newSteps)
//     setDraggedStep(null)
//   }

//   const handleDragEnd = () => {
//     setDraggedStep(null)
//   }

//   const getStepDescription = (step: SequenceStep) => {
//     switch (step.stepType) {
//       case "EMAIL":
//         return step.subject || "No subject"
//       case "DELAY":
//         return `Wait ${step.delayValue} ${step.delayUnit.toLowerCase()}`
//       case "LINKEDIN_VIEW":
//         return "View profile"
//       case "LINKEDIN_CONNECT":
//         return "Send connection request"
//       case "LINKEDIN_MESSAGE":
//         return step.linkedInMessage?.slice(0, 50) || "Send message"
//       case "CALL":
//         return step.callScript?.slice(0, 50) || "Make call"
//       case "TASK":
//         return step.taskTitle || "Complete task"
//       case "CONDITION":
//         const conditions = step.conditions as Record<string, unknown> | null
//         return (conditions?.description as string) || "Check condition"
//       default:
//         return ""
//     }
//   }

//   return (
//     <div
//       className="min-h-full p-8 flex flex-col items-center"
//       style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
//     >
//       {/* Start node */}
//       <div className="flex flex-col items-center">
//         <div className="w-12 h-12 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
//           <div className="w-3 h-3 rounded-full bg-green-500" />
//         </div>
//         <span className="text-xs text-muted-foreground mt-2">Start</span>
//       </div>

//       {/* Connector line */}
//       <div className="w-0.5 h-8 bg-border" />

//       {/* Steps */}
//       {steps.length === 0 ? (
//         <div className="flex flex-col items-center">
//           <AddStepButton
//             onAdd={(type) => onAddStep(type, -1)}
//             enableLinkedIn={enableLinkedIn}
//             enableCalls={enableCalls}
//             enableTasks={enableTasks}
//           />
//         </div>
//       ) : (
//         steps.map((step, index) => (
//           <React.Fragment key={step.id}>
//             {/* Add step button above */}
//             {index === 0 && (
//               <>
//                 <AddStepButton
//                   onAdd={(type) => onAddStep(type, -1)}
//                   enableLinkedIn={enableLinkedIn}
//                   enableCalls={enableCalls}
//                   enableTasks={enableTasks}
//                 />
//                 <div className="w-0.5 h-4 bg-border" />
//               </>
//             )}

//             {/* Step card */}
//             <div
//               draggable
//               onDragStart={(e) => handleDragStart(e, step.id)}
//               onDragOver={(e) => handleDragOver(e, index)}
//               onDrop={(e) => handleDrop(e, index)}
//               onDragEnd={handleDragEnd}
//               onClick={() => onStepSelect(step.id)}
//               className={cn(
//                 "w-80 rounded-lg border-2 p-4 cursor-pointer transition-all",
//                 STEP_COLORS[step.stepType],
//                 selectedStepId === step.id && "ring-2 ring-primary ring-offset-2",
//                 draggedStep === step.id && "opacity-50",
//               )}
//             >
//               <div className="flex items-start gap-3">
//                 <div className="cursor-grab active:cursor-grabbing">
//                   <GripVertical className="h-5 w-5 text-muted-foreground" />
//                 </div>

//                 <div className={cn("p-2 rounded-md", STEP_COLORS[step.stepType])}>
//                   {React.createElement(STEP_ICONS[step.stepType], { className: "h-5 w-5" })}
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between">
//                     <span className="font-medium text-sm">{STEP_LABELS[step.stepType]}</span>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
//                         <Button variant="ghost" size="icon" className="h-6 w-6">
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             onDuplicateStep(step.id)
//                           }}
//                         >
//                           <Copy className="mr-2 h-4 w-4" />
//                           Duplicate
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             onDeleteStep(step.id)
//                           }}
//                           className="text-destructive focus:text-destructive"
//                         >
//                           <Trash2 className="mr-2 h-4 w-4" />
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>
//                   <p className="text-xs text-muted-foreground truncate mt-1">{getStepDescription(step)}</p>
//                   {step.stepType === "EMAIL" && (
//                     <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
//                       <span>Sent: {step.sent}</span>
//                       <span>Opened: {step.opened}</span>
//                       <span>Replied: {step.replied}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Connector and add button */}
//             <div className="w-0.5 h-4 bg-border" />
//             <AddStepButton
//               onAdd={(type) => onAddStep(type, index)}
//               enableLinkedIn={enableLinkedIn}
//               enableCalls={enableCalls}
//               enableTasks={enableTasks}
//             />
//             {index < steps.length - 1 && <div className="w-0.5 h-4 bg-border" />}
//           </React.Fragment>
//         ))
//       )}

//       {/* End node */}
//       <div className="w-0.5 h-8 bg-border" />
//       <div className="flex flex-col items-center">
//         <div className="w-12 h-12 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
//           <div className="w-3 h-3 rounded-full bg-red-500" />
//         </div>
//         <span className="text-xs text-muted-foreground mt-2">End</span>
//       </div>
//     </div>
//   )
// }

// interface AddStepButtonProps {
//   onAdd: (type: StepType) => void
//   enableLinkedIn?: boolean
//   enableCalls?: boolean
//   enableTasks?: boolean
// }

// function AddStepButton({
//   onAdd,
//   enableLinkedIn = false,
//   enableCalls = false,
//   enableTasks = false,
// }: AddStepButtonProps) {
//   const showLinkedInSection = enableLinkedIn
//   const showCallsSection = enableCalls
//   const showTasksSection = enableTasks

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="outline"
//           size="icon"
//           className="h-8 w-8 rounded-full border-dashed hover:border-solid transition-all bg-transparent"
//         >
//           <Plus className="h-4 w-4" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="center">
//         {/* Email and Delay are always available */}
//         <DropdownMenuItem onClick={() => onAdd("EMAIL")}>
//           <Mail className="mr-2 h-4 w-4 text-blue-500" />
//           Email
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => onAdd("DELAY")}>
//           <Clock className="mr-2 h-4 w-4 text-gray-500" />
//           Delay
//         </DropdownMenuItem>

//         {/* LinkedIn options - only show if enabled */}
//         {showLinkedInSection && (
//           <>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={() => onAdd("LINKEDIN_VIEW")}>
//               <Linkedin className="mr-2 h-4 w-4 text-sky-500" />
//               LinkedIn View
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => onAdd("LINKEDIN_CONNECT")}>
//               <Linkedin className="mr-2 h-4 w-4 text-sky-500" />
//               LinkedIn Connect
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => onAdd("LINKEDIN_MESSAGE")}>
//               <Linkedin className="mr-2 h-4 w-4 text-sky-500" />
//               LinkedIn Message
//             </DropdownMenuItem>
//           </>
//         )}

//         {/* Call and Task options - only show if enabled */}
//         {(showCallsSection || showTasksSection) && <DropdownMenuSeparator />}

//         {showCallsSection && (
//           <DropdownMenuItem onClick={() => onAdd("CALL")}>
//             <Phone className="mr-2 h-4 w-4 text-green-500" />
//             Call
//           </DropdownMenuItem>
//         )}

//         {showTasksSection && (
//           <DropdownMenuItem onClick={() => onAdd("TASK")}>
//             <CheckSquare className="mr-2 h-4 w-4 text-purple-500" />
//             Task
//           </DropdownMenuItem>
//         )}

//         {/* Condition option - always available */}
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={() => onAdd("CONDITION")}>
//           <GitBranch className="mr-2 h-4 w-4 text-yellow-500" />
//           Condition
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
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
  Split,
  Timer,
  LogOut,
  UserCheck,
  Layers,
  Shuffle,
  FileText,
  Voicemail,
  Send,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { SequenceStep, StepType } from "@/lib/types/sequence"
import { STEP_TYPE_CONFIG } from "@/lib/types/sequence"

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
  onToggleStep?: (stepId: string, enabled: boolean) => void
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
  AB_SPLIT: Split,
  WAIT_UNTIL: Timer,
  EXIT_TRIGGER: LogOut,
  MANUAL_REVIEW: UserCheck,
  MULTI_CHANNEL_TOUCH: Layers,
  BEHAVIOR_BRANCH: GitBranch,
  RANDOM_VARIANT: Shuffle,
  CONTENT_REFERENCE: FileText,
  VOICEMAIL_DROP: Voicemail,
  DIRECT_MAIL: Send,
  // Integration step types - uses Zap as fallback, actual icons from getProviderIcon
  INTEGRATION_CRM_SYNC: Zap,
  INTEGRATION_SLACK: Zap,
  INTEGRATION_NOTION: Zap,
  INTEGRATION_AIRTABLE: Zap,
  INTEGRATION_TRELLO: Zap,
  INTEGRATION_ASANA: Zap,
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
  onToggleStep,
}: SequenceCanvasProps) {
  const [draggedStep, setDraggedStep] = React.useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, stepId: string) => {
    setDraggedStep(stepId)
    e.dataTransfer.effectAllowed = "move"
    // Add some delay for better visual feedback
    setTimeout(() => {
      const target = e.target as HTMLElement
      target.style.opacity = "0.5"
    }, 0)
  }

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(targetIndex)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (!draggedStep) return

    const draggedIndex = steps.findIndex((s) => s.id === draggedStep)
    if (draggedIndex === -1 || draggedIndex === targetIndex) {
      setDraggedStep(null)
      setDragOverIndex(null)
      return
    }

    const newSteps = [...steps]
    const [removed] = newSteps.splice(draggedIndex, 1)
    newSteps.splice(targetIndex, 0, removed)

    onReorderSteps(newSteps)
    setDraggedStep(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement
    target.style.opacity = "1"
    setDraggedStep(null)
    setDragOverIndex(null)
  }

  const getStepDescription = (step: SequenceStep) => {
    switch (step.stepType) {
      case "EMAIL":
        return step.subject || "No subject"
      case "DELAY":
        const delayText = `Wait ${step.delayValue} ${step.delayUnit.toLowerCase()}`
        if (step.businessDaysOnly) return `${delayText} (business days)`
        if (step.randomizeDelay) return `${step.delayRandomMin}-${step.delayRandomMax} ${step.delayUnit.toLowerCase()}`
        return delayText
      case "LINKEDIN_VIEW":
        return "View profile"
      case "LINKEDIN_CONNECT":
        return step.linkedInConnectionNote || "Send connection request"
      case "LINKEDIN_MESSAGE":
        return step.linkedInMessage?.slice(0, 50) || "Send message"
      case "CALL":
        return step.callScript?.slice(0, 50) || "Make call"
      case "TASK":
        return step.taskTitle || "Complete task"
      case "CONDITION":
        return step.conditions?.sendIf ? "Check conditions" : "Branch logic"
      case "AB_SPLIT":
        const branches = step.abSplitConfig?.branches?.length || 2
        return `${branches} test paths`
      case "WAIT_UNTIL":
        const waitConfig = step.waitUntilConfig
        if (waitConfig?.conditionType === "EMAIL_OPENED") return "Wait until opened"
        if (waitConfig?.conditionType === "LINK_CLICKED") return "Wait until clicked"
        if (waitConfig?.conditionType === "SPECIFIC_TIME") return `Send at ${waitConfig.specificTimeStart}`
        return `Wait up to ${waitConfig?.maxWaitDays || 3} days`
      case "EXIT_TRIGGER":
        const exitConditions = step.exitTriggerConfig?.conditions || []
        return exitConditions.length > 0
          ? `Exit on: ${exitConditions[0].toLowerCase().replace(/_/g, " ")}`
          : "Exit sequence"
      case "MANUAL_REVIEW":
        const pending = step.manualReviewConfig?.pendingCount || 0
        return pending > 0 ? `${pending} pending` : "Awaiting approval"
      case "MULTI_CHANNEL_TOUCH":
        const touches = step.multiChannelConfig?.touches?.length || 0
        return `${touches} channels`
      case "BEHAVIOR_BRANCH":
        const behaviorBranches = step.behaviorBranchConfig?.branches?.length || 2
        return `${behaviorBranches} paths`
      case "RANDOM_VARIANT":
        const variants = step.randomVariantConfig?.variants?.length || 0
        return `${variants} variations`
      case "CONTENT_REFERENCE":
        return step.contentReferenceConfig?.resourceTitle || "Track content"
      case "VOICEMAIL_DROP":
        return step.voicemailDropConfig?.useTts ? "TTS voicemail" : "Pre-recorded VM"
      case "DIRECT_MAIL":
        return step.directMailConfig?.mailType?.replace(/_/g, " ") || "Physical mail"
      // Integration step descriptions
      case "INTEGRATION_CRM_SYNC":
        return step.integrationConfig?.provider
          ? `Sync to ${step.integrationConfig.provider}`
          : "Select CRM"
      case "INTEGRATION_SLACK":
        return step.integrationConfig?.config?.channel || "Send Slack message"
      case "INTEGRATION_NOTION":
        return step.integrationConfig?.config?.pageTitle || "Create Notion page"
      case "INTEGRATION_AIRTABLE":
        return step.integrationConfig?.provider ? "Add Airtable record" : "Configure Airtable"
      case "INTEGRATION_TRELLO":
        return step.integrationConfig?.config?.listId ? "Create Trello card" : "Configure Trello"
      case "INTEGRATION_ASANA":
        return step.integrationConfig?.config?.projectId ? "Create Asana task" : "Configure Asana"
      default:
        return ""
    }
  }

  const getStepStats = (step: SequenceStep) => {
    const total = step.sent || 0
    if (total === 0) return null

    return {
      sent: step.sent,
      openRate: total > 0 ? ((step.opened / total) * 100).toFixed(1) : "0",
      replyRate: total > 0 ? ((step.replied / total) * 100).toFixed(1) : "0",
      clickRate: total > 0 ? ((step.clicked / total) * 100).toFixed(1) : "0",
    }
  }

  const getStepWarnings = (step: SequenceStep): string[] => {
    const warnings: string[] = []

    if (step.stepType === "EMAIL") {
      if (!step.subject) warnings.push("Missing subject line")
      if (!step.body || step.body.length < 20) warnings.push("Email body too short")
      if (step.spamScore && step.spamScore > 5) warnings.push(`Spam score: ${step.spamScore}/10`)
    }

    if (step.stepType.startsWith("LINKEDIN_") && !enableLinkedIn) {
      warnings.push("LinkedIn not enabled")
    }

    if (step.stepType === "CALL" && !enableCalls) {
      warnings.push("Calls not enabled")
    }

    return warnings
  }

  const stepTypeConfig = (type: StepType) => STEP_TYPE_CONFIG[type]

  return (
    <TooltipProvider>
      <div
        className="min-h-full p-4 sm:p-8 flex flex-col items-center transition-transform duration-200"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
      >
        {/* Start node */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-2 border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background" />
          </div>
          <span className="text-xs font-medium text-muted-foreground mt-3">Sequence Start</span>
        </div>

        {/* Connector line */}
        <div className="w-0.5 h-6 sm:h-8 bg-gradient-to-b from-emerald-500/50 to-border" />

        {/* Steps */}
        {steps.length === 0 ? (
          <div className="flex flex-col items-center">
            <AddStepButton
              onAdd={(type) => onAddStep(type, -1)}
              enableLinkedIn={enableLinkedIn}
              enableCalls={enableCalls}
              enableTasks={enableTasks}
              isFirst
            />
          </div>
        ) : (
          steps.map((step, index) => {
            const config = stepTypeConfig(step.stepType)
            const Icon = STEP_ICONS[step.stepType]
            const stats = getStepStats(step)
            const warnings = getStepWarnings(step)
            const isDisabled = step.isEnabled === false
            const isDragging = draggedStep === step.id
            const isDragOver = dragOverIndex === index

            return (
              <React.Fragment key={step.id}>
                {/* Add step button above first */}
                {index === 0 && (
                  <>
                    <AddStepButton
                      onAdd={(type) => onAddStep(type, -1)}
                      enableLinkedIn={enableLinkedIn}
                      enableCalls={enableCalls}
                      enableTasks={enableTasks}
                    />
                    <div className="w-0.5 h-3 sm:h-4 bg-border" />
                  </>
                )}

                {/* Step card */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, step.id)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onStepSelect(step.id)}
                  className={cn(
                    "w-full max-w-[320px] sm:max-w-[360px] rounded-2xl border-2 p-3 sm:p-4 cursor-pointer transition-all duration-200 relative group",
                    "bg-gradient-to-br from-card to-card/80 backdrop-blur-sm",
                    config.bgColor,
                    config.borderColor,
                    selectedStepId === step.id && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-xl",
                    isDragging && "opacity-50 scale-95",
                    isDragOver && "ring-2 ring-primary/50 scale-[1.02]",
                    isDisabled && "opacity-50 grayscale",
                    "hover:shadow-lg hover:scale-[1.01]",
                  )}
                >
                  {/* Disabled indicator */}
                  {isDisabled && (
                    <div className="absolute top-3 right-12 z-10">
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Step disabled</TooltipContent>
                      </Tooltip>
                    </div>
                  )}

                  {/* Warnings badge */}
                  {warnings.length > 0 && (
                    <div className="absolute -top-2.5 -right-2.5 z-10">
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="h-6 w-6 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 animate-pulse">
                            <AlertCircle className="h-3.5 w-3.5 text-white" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <ul className="text-xs space-y-1">
                            {warnings.map((w, i) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <span className="h-1 w-1 rounded-full bg-amber-500" />
                                {w}
                              </li>
                            ))}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    {/* Drag handle */}
                    <div className="cursor-grab active:cursor-grabbing mt-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>

                    {/* Icon */}
                    <div
                      className={cn("p-2.5 rounded-xl border-2 shadow-sm shrink-0", config.bgColor, config.borderColor)}
                    >
                      <Icon className={cn("h-5 w-5", config.color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={cn("font-semibold text-sm", config.color)}>{config.label}</span>
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-5 font-mono bg-background/50 shrink-0"
                          >
                            #{step.order + 1}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                onDuplicateStep(step.id)
                              }}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate step
                            </DropdownMenuItem>
                            {onToggleStep && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onToggleStep(step.id, !isDisabled)
                                }}
                              >
                                {isDisabled ? (
                                  <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Enable step
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    Disable step
                                  </>
                                )}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeleteStep(step.id)
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete step
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-xs text-muted-foreground truncate mt-1.5">{getStepDescription(step)}</p>

                      {/* Stats for email/message steps */}
                      {stats && (step.stepType === "EMAIL" || step.stepType === "LINKEDIN_MESSAGE") && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-muted-foreground">{stats.sent} sent</span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-emerald-500" />
                              {stats.openRate}% open
                            </span>
                            <span className="text-muted-foreground">{stats.replyRate}% reply</span>
                          </div>
                          <Progress value={Number.parseFloat(stats.openRate)} className="h-1.5" />
                        </div>
                      )}

                      {/* Branch badges for split/branch nodes */}
                      {(step.stepType === "AB_SPLIT" || step.stepType === "BEHAVIOR_BRANCH") && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {step.stepType === "AB_SPLIT" &&
                            step.abSplitConfig?.branches?.slice(0, 3).map((branch) => (
                              <Badge
                                key={branch.id}
                                variant="outline"
                                className="text-[10px] font-medium bg-background/50"
                              >
                                {branch.name}: {branch.trafficPercent}%
                              </Badge>
                            ))}
                          {step.stepType === "BEHAVIOR_BRANCH" &&
                            step.behaviorBranchConfig?.branches?.slice(0, 3).map((branch) => (
                              <Badge
                                key={branch.id}
                                variant="outline"
                                className="text-[10px] font-medium bg-background/50"
                              >
                                {branch.name}
                              </Badge>
                            ))}
                        </div>
                      )}

                      {/* Pending reviews badge */}
                      {step.stepType === "MANUAL_REVIEW" && (step.manualReviewConfig?.pendingCount || 0) > 0 && (
                        <Badge className="mt-2 bg-amber-500 text-white border-0 shadow-sm">
                          <Sparkles className="h-3 w-3 mr-1" />
                          {step.manualReviewConfig?.pendingCount} pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Connector and add button */}
                <div className="w-0.5 h-3 sm:h-4 bg-border" />
                <AddStepButton
                  onAdd={(type) => onAddStep(type, index)}
                  enableLinkedIn={enableLinkedIn}
                  enableCalls={enableCalls}
                  enableTasks={enableTasks}
                />
                {index < steps.length - 1 && <div className="w-0.5 h-3 sm:h-4 bg-border" />}
              </React.Fragment>
            )
          })
        )}

        {/* End node */}
        <div className="w-0.5 h-6 sm:h-8 bg-gradient-to-b from-border to-red-500/50" />
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-500/5 border-2 border-red-500/30 flex items-center justify-center shadow-lg shadow-red-500/10">
              <LogOut className="h-6 w-6 sm:h-7 sm:w-7 text-red-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-background" />
          </div>
          <span className="text-xs font-medium text-muted-foreground mt-3">Sequence End</span>
        </div>
      </div>
    </TooltipProvider>
  )
}

interface AddStepButtonProps {
  onAdd: (type: StepType) => void
  enableLinkedIn?: boolean
  enableCalls?: boolean
  enableTasks?: boolean
  isFirst?: boolean
}

function AddStepButton({
  onAdd,
  enableLinkedIn = false,
  enableCalls = false,
  enableTasks = false,
  isFirst = false,
}: AddStepButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-200 bg-transparent",
            isFirst ? "h-12 w-12 shadow-lg" : "h-9 w-9",
            "group",
          )}
        >
          <Plus className={cn("transition-transform group-hover:scale-110", isFirst ? "h-5 w-5" : "h-4 w-4")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-72 p-2">
        {/* Core Steps */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground font-medium px-2">Core Steps</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onAdd("EMAIL")} className="py-2.5 px-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Mail className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Email</p>
                <p className="text-xs text-muted-foreground">Send automated email</p>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAdd("DELAY")} className="py-2.5 px-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gray-500/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Delay</p>
                <p className="text-xs text-muted-foreground">Wait before next step</p>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* LinkedIn options */}
        {enableLinkedIn && (
          <>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground font-medium px-2">LinkedIn</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onAdd("LINKEDIN_VIEW")} className="py-2 px-3 rounded-lg">
                <Linkedin className="mr-3 h-4 w-4 text-sky-500" />
                <span className="text-sm">View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAdd("LINKEDIN_CONNECT")} className="py-2 px-3 rounded-lg">
                <Linkedin className="mr-3 h-4 w-4 text-sky-500" />
                <span className="text-sm">Send Connection</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAdd("LINKEDIN_MESSAGE")} className="py-2 px-3 rounded-lg">
                <Linkedin className="mr-3 h-4 w-4 text-sky-500" />
                <span className="text-sm">Send Message</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}

        {/* Multi-channel */}
        {(enableCalls || enableTasks) && (
          <>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground font-medium px-2">
                Multi-Channel
              </DropdownMenuLabel>
              {enableCalls && (
                <DropdownMenuItem onClick={() => onAdd("CALL")} className="py-2 px-3 rounded-lg">
                  <Phone className="mr-3 h-4 w-4 text-green-500" />
                  <span className="text-sm">Call Task</span>
                </DropdownMenuItem>
              )}
              {enableTasks && (
                <DropdownMenuItem onClick={() => onAdd("TASK")} className="py-2 px-3 rounded-lg">
                  <CheckSquare className="mr-3 h-4 w-4 text-purple-500" />
                  <span className="text-sm">Manual Task</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onAdd("MULTI_CHANNEL_TOUCH")} className="py-2 px-3 rounded-lg">
                <Layers className="mr-3 h-4 w-4 text-cyan-500" />
                <span className="text-sm">Multi-Channel Touch</span>
              </DropdownMenuItem>
              {enableCalls && (
                <DropdownMenuItem onClick={() => onAdd("VOICEMAIL_DROP")} className="py-2 px-3 rounded-lg">
                  <Voicemail className="mr-3 h-4 w-4 text-rose-500" />
                  <span className="text-sm">Voicemail Drop</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onAdd("DIRECT_MAIL")} className="py-2 px-3 rounded-lg">
                <Send className="mr-3 h-4 w-4 text-violet-500" />
                <span className="text-sm">Direct Mail</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}

        {/* Automation */}
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground font-medium px-2">Automation</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onAdd("CONDITION")} className="py-2 px-3 rounded-lg">
            <GitBranch className="mr-3 h-4 w-4 text-yellow-500" />
            <span className="text-sm">Condition Branch</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAdd("WAIT_UNTIL")} className="py-2 px-3 rounded-lg">
            <Timer className="mr-3 h-4 w-4 text-orange-500" />
            <span className="text-sm">Wait Until</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAdd("EXIT_TRIGGER")} className="py-2 px-3 rounded-lg">
            <LogOut className="mr-3 h-4 w-4 text-red-500" />
            <span className="text-sm">Exit Trigger</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAdd("BEHAVIOR_BRANCH")} className="py-2 px-3 rounded-lg">
            <GitBranch className="mr-3 h-4 w-4 text-emerald-500" />
            <span className="text-sm">Behavior Branch</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAdd("MANUAL_REVIEW")} className="py-2 px-3 rounded-lg">
            <UserCheck className="mr-3 h-4 w-4 text-amber-500" />
            <span className="text-sm">Manual Review</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Advanced */}
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground font-medium px-2">Advanced</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onAdd("AB_SPLIT")} className="py-2 px-3 rounded-lg">
            <Split className="mr-3 h-4 w-4 text-indigo-500" />
            <span className="text-sm">A/B Split Test</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAdd("RANDOM_VARIANT")} className="py-2 px-3 rounded-lg">
            <Shuffle className="mr-3 h-4 w-4 text-fuchsia-500" />
            <span className="text-sm">Random Variant</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAdd("CONTENT_REFERENCE")} className="py-2 px-3 rounded-lg">
            <FileText className="mr-3 h-4 w-4 text-teal-500" />
            <span className="text-sm">Content Reference</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Integrations */}
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground font-medium px-2">Integrations</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onAdd("INTEGRATION_CRM_SYNC")} className="py-2.5 px-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <img src="/icons/hubspot.svg" alt="CRM" className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">CRM Sync</p>
                <p className="text-xs text-muted-foreground">HubSpot, Salesforce, Pipedrive</p>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAdd("INTEGRATION_SLACK")} className="py-2.5 px-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                <img src="/icons/slack.svg" alt="Slack" className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Slack Notification</p>
                <p className="text-xs text-muted-foreground">Send to channel</p>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAdd("INTEGRATION_NOTION")} className="py-2.5 px-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-stone-500/10 flex items-center justify-center">
                <img src="/icons/notion.svg" alt="Notion" className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Notion Page</p>
                <p className="text-xs text-muted-foreground">Create database entry</p>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAdd("INTEGRATION_AIRTABLE")} className="py-2.5 px-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-lime-500/10 flex items-center justify-center">
                <img src="/icons/airtable.svg" alt="Airtable" className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Airtable Record</p>
                <p className="text-xs text-muted-foreground">Add to base</p>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAdd("INTEGRATION_TRELLO")} className="py-2.5 px-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <img src="/icons/trello.svg" alt="Trello" className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Trello Card</p>
                <p className="text-xs text-muted-foreground">Create card in list</p>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAdd("INTEGRATION_ASANA")} className="py-2.5 px-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <img src="/icons/asana.svg" alt="Asana" className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Asana Task</p>
                <p className="text-xs text-muted-foreground">Create in project</p>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
