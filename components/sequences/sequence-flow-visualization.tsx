// "use client"

// import { motion } from "framer-motion"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Clock, Mail, CheckCircle2, XCircle, Eye, Edit, Trash2 } from "lucide-react"
// import { useState } from "react"

// interface Sequence {
//   id: string
//   stepNumber: number
//   delayDays: number
//   sendOnlyIfNotReplied: boolean
//   sendOnlyIfNotOpened: boolean
//   template: {
//     id: string
//     name: string
//     subject: string
//     body: string
//   }
// }

// interface SequenceFlowVisualizationProps {
//   sequences: Sequence[]
//   campaignName: string
// }

// export function SequenceFlowVisualization({ sequences, campaignName }: SequenceFlowVisualizationProps) {
//   const [hoveredStep, setHoveredStep] = useState<number | null>(null)

//   if (sequences.length === 0) {
//     return (
//       <Card className="p-12 text-center">
//         <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
//         <h3 className="text-xl font-semibold mb-2">No sequences yet</h3>
//         <p className="text-muted-foreground mb-6">Create your first email sequence to get started</p>
//         <Button>Add First Step</Button>
//       </Card>
//     )
//   }

//   return (
//     <div className="relative py-8">
//       {/* Animated background gradient */}
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-lg -z-10" />

//       <div className="space-y-8">
//         {sequences.map((sequence, index) => {
//           const isEven = index % 2 === 0
//           const isLast = index === sequences.length - 1

//           return (
//             <motion.div
//               key={sequence.id}
//               initial={{ opacity: 0, x: isEven ? -50 : 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               className="relative"
//             >
//               {/* Step Container with Zigzag Layout */}
//               <div className={`flex items-center gap-8 ${isEven ? "flex-row" : "flex-row-reverse"} max-w-6xl mx-auto`}>
//                 {/* Step Number Badge */}
//                 <motion.div
//                   className="flex-shrink-0"
//                   whileHover={{ scale: 1.1, rotate: 5 }}
//                   onHoverStart={() => setHoveredStep(sequence.stepNumber)}
//                   onHoverEnd={() => setHoveredStep(null)}
//                 >
//                   <div className="relative">
//                     <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
//                       <span className="text-2xl font-bold text-primary-foreground">{sequence.stepNumber}</span>
//                     </div>
//                     {hoveredStep === sequence.stepNumber && (
//                       <motion.div
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         className="absolute -inset-2 rounded-full bg-primary/20 -z-10"
//                       />
//                     )}
//                   </div>
//                 </motion.div>

//                 {/* Email Card */}
//                 <motion.div
//                   className="flex-1"
//                   whileHover={{ scale: 1.02, y: -4 }}
//                   transition={{ type: "spring", stiffness: 300 }}
//                 >
//                   <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors shadow-lg">
//                     <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-4">
//                       <div className="flex items-start justify-between">
//                         <div className="space-y-2 flex-1">
//                           <div className="flex items-center gap-2">
//                             <Mail className="h-5 w-5 text-primary" />
//                             <CardTitle className="text-xl">{sequence.template.name}</CardTitle>
//                           </div>
//                           <p className="text-sm font-medium text-muted-foreground">
//                             Subject: <span className="text-foreground">{sequence.template.subject}</span>
//                           </p>
//                         </div>
//                         <div className="flex gap-1">
//                           <Button variant="ghost" size="icon" className="h-8 w-8">
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                           <Button variant="ghost" size="icon" className="h-8 w-8">
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="pt-4 space-y-4">
//                       {/* Email Preview */}
//                       <div className="bg-muted/50 rounded-lg p-4 max-h-32 overflow-hidden relative">
//                         <p className="text-sm text-muted-foreground line-clamp-4">{sequence.template.body}</p>
//                         <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted/50 to-transparent" />
//                       </div>

//                       {/* Conditions */}
//                       <div className="flex flex-wrap gap-2">
//                         {sequence.sendOnlyIfNotReplied && (
//                           <Badge variant="secondary" className="gap-1">
//                             <CheckCircle2 className="h-3 w-3" />
//                             Only if no reply
//                           </Badge>
//                         )}
//                         {sequence.sendOnlyIfNotOpened && (
//                           <Badge variant="secondary" className="gap-1">
//                             <XCircle className="h-3 w-3" />
//                             Only if not opened
//                           </Badge>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               </div>

//               {/* Animated Arrow Connector */}
//               {!isLast && (
//                 <div className="relative h-24 flex items-center justify-center">
//                   <motion.div
//                     initial={{ pathLength: 0, opacity: 0 }}
//                     animate={{ pathLength: 1, opacity: 1 }}
//                     transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
//                     className="absolute"
//                   >
//                     <svg
//                       width="120"
//                       height="96"
//                       viewBox="0 0 120 96"
//                       fill="none"
//                       className={`${isEven ? "" : "scale-x-[-1]"}`}
//                     >
//                       <motion.path
//                         d="M 60 0 Q 80 48, 60 96"
//                         stroke="currentColor"
//                         strokeWidth="3"
//                         strokeDasharray="8 4"
//                         className="text-primary/40"
//                         initial={{ pathLength: 0 }}
//                         animate={{ pathLength: 1 }}
//                         transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
//                       />
//                       <motion.path
//                         d="M 60 96 L 54 86 M 60 96 L 66 86"
//                         stroke="currentColor"
//                         strokeWidth="3"
//                         strokeLinecap="round"
//                         className="text-primary/60"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: index * 0.1 + 0.8 }}
//                       />
//                     </svg>
//                   </motion.div>

//                   {/* Delay Badge */}
//                   <motion.div
//                     initial={{ scale: 0, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     transition={{ delay: index * 0.1 + 0.5 }}
//                     className="relative z-10"
//                   >
//                     <Badge
//                       variant="outline"
//                       className="bg-background border-2 border-primary/30 px-4 py-2 text-sm font-semibold shadow-md"
//                     >
//                       <Clock className="h-4 w-4 mr-2" />
//                       Wait {sequence.delayDays} {sequence.delayDays === 1 ? "day" : "days"}
//                     </Badge>
//                   </motion.div>
//                 </div>
//               )}
//             </motion.div>
//           )
//         })}
//       </div>

//       {/* Completion Badge */}
//       <motion.div
//         initial={{ scale: 0, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ delay: sequences.length * 0.1 + 0.5 }}
//         className="flex justify-center mt-8"
//       >
//         <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 rounded-full px-6 py-3 flex items-center gap-2">
//           <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
//           <span className="font-semibold text-green-700 dark:text-green-300">Sequence Complete</span>
//         </div>
//       </motion.div>
//     </div>
//   )
// }
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Clock,
  Mail,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Trash2,
  GripVertical,
  Plus,
  ChevronDown,
  ChevronUp,
  Copy,
  MoreHorizontal,
  ArrowDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Sequence {
  id: string
  stepNumber: number
  delayDays: number
  sendOnlyIfNotReplied: boolean
  sendOnlyIfNotOpened: boolean
  template: {
    id: string
    name: string
    subject: string
    body: string
  }
}

interface SequenceFlowVisualizationProps {
  sequences: Sequence[]
  campaignName: string
  onAddStep?: () => void
  onEditStep?: (id: string) => void
  onDeleteStep?: (id: string) => void
  onDuplicateStep?: (id: string) => void
}

export function SequenceFlowVisualization({
  sequences,
  campaignName,
  onAddStep,
  onEditStep,
  onDeleteStep,
  onDuplicateStep,
}: SequenceFlowVisualizationProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null)
  const [previewStep, setPreviewStep] = useState<Sequence | null>(null)
  const [hoveredConnector, setHoveredConnector] = useState<number | null>(null)

  if (sequences.length === 0) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <Card className="relative border-2 border-dashed bg-gradient-to-br from-background to-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <div className="relative rounded-full bg-gradient-to-br from-primary/20 to-primary/5 p-6">
                <Mail className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Build Your Email Sequence</h3>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              Create a powerful multi-step email sequence to nurture your prospects and drive conversions
            </p>
            <Button size="lg" onClick={onAddStep} className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-5 w-5" />
              Add First Step
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.015]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Start Node */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-4">
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm">Sequence Start</span>
        </div>
      </motion.div>

      {/* Connector from Start */}
      <div className="flex justify-center mb-4">
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.2 }}
          className="w-0.5 h-8 bg-gradient-to-b from-emerald-500/50 to-primary/30 origin-top"
        />
      </div>

      {/* Sequence Steps */}
      <div className="space-y-0">
        {sequences.map((sequence, index) => {
          const isExpanded = expandedStep === sequence.id
          const isLast = index === sequences.length - 1

          return (
            <motion.div
              key={sequence.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              {/* Step Card */}
              <div className="relative flex justify-center">
                <motion.div whileHover={{ scale: 1.01 }} className="w-full max-w-2xl">
                  <Card className="relative overflow-hidden border-0 shadow-lg shadow-black/5 bg-gradient-to-br from-background via-background to-muted/20">
                    {/* Step Number Indicator */}
                    <div className="absolute -left-px top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

                    {/* Header */}
                    <div className="flex items-start gap-4 p-5 pb-4">
                      {/* Drag Handle & Step Number */}
                      <div className="flex flex-col items-center gap-2">
                        <button className="cursor-grab text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                          <GripVertical className="h-5 w-5" />
                        </button>
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md" />
                          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-lg shadow-lg">
                            {sequence.stepNumber}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                              <h3 className="font-semibold truncate">{sequence.template.name}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{sequence.template.subject}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => setPreviewStep(sequence)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => onEditStep?.(sequence.id)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Step
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDuplicateStep?.(sequence.id)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => onDeleteStep?.(sequence.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Conditions */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {sequence.sendOnlyIfNotReplied && (
                            <Badge
                              variant="secondary"
                              className="gap-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              No reply condition
                            </Badge>
                          )}
                          {sequence.sendOnlyIfNotOpened && (
                            <Badge
                              variant="secondary"
                              className="gap-1.5 bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                            >
                              <XCircle className="h-3 w-3" />
                              Not opened condition
                            </Badge>
                          )}
                        </div>

                        {/* Expand Toggle */}
                        <button
                          onClick={() => setExpandedStep(isExpanded ? null : sequence.id)}
                          className="flex items-center gap-1 mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-3.5 w-3.5" />
                              Hide preview
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3.5 w-3.5" />
                              Show preview
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-5 pb-5">
                            <div className="rounded-lg bg-muted/50 border p-4">
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-6">
                                {sequence.template.body}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              </div>

              {/* Connector with Delay */}
              {!isLast && (
                <div
                  className="relative flex flex-col items-center py-2"
                  onMouseEnter={() => setHoveredConnector(index)}
                  onMouseLeave={() => setHoveredConnector(null)}
                >
                  {/* Animated Line */}
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="w-0.5 h-6 bg-gradient-to-b from-border to-primary/30 origin-top"
                  />

                  {/* Delay Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.6, type: "spring" }}
                    whileHover={{ scale: 1.05 }}
                    className="relative my-2"
                  >
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border-2 border-primary/20 shadow-lg shadow-black/5">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">
                        {sequence.delayDays} {sequence.delayDays === 1 ? "day" : "days"}
                      </span>
                    </div>

                    {/* Add Step Button (appears on hover) */}
                    <AnimatePresence>
                      {hoveredConnector === index && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute -right-12 top-1/2 -translate-y-1/2"
                        >
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-full shadow-lg bg-transparent"
                            onClick={onAddStep}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Arrow */}
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: index * 0.1 + 0.7 }}
                    className="flex flex-col items-center origin-top"
                  >
                    <div className="w-0.5 h-4 bg-gradient-to-b from-primary/30 to-primary/50" />
                    <ArrowDown className="h-4 w-4 text-primary/50 -mt-1" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* End Node */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: sequences.length * 0.1 + 0.5 }}
        className="flex justify-center mt-6"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-0.5 h-6 bg-gradient-to-b from-primary/30 to-emerald-500/50" />
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm">Sequence Complete</span>
          </div>
        </div>
      </motion.div>

      {/* Add Step Button at Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: sequences.length * 0.1 + 0.7 }}
        className="flex justify-center mt-8"
      >
        <Button variant="outline" onClick={onAddStep} className="gap-2 bg-transparent">
          <Plus className="h-4 w-4" />
          Add Step
        </Button>
      </motion.div>

      {/* Preview Dialog */}
      <Dialog open={!!previewStep} onOpenChange={() => setPreviewStep(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              {previewStep?.template.name}
            </DialogTitle>
            <DialogDescription>Step {previewStep?.stepNumber} - Preview</DialogDescription>
          </DialogHeader>
          {previewStep && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 bg-muted/30">
                <p className="text-sm font-medium text-muted-foreground mb-1">Subject</p>
                <p className="font-semibold">{previewStep.template.subject}</p>
              </div>
              <div className="rounded-lg border p-4 bg-muted/30">
                <p className="text-sm font-medium text-muted-foreground mb-2">Body</p>
                <p className="text-sm whitespace-pre-wrap">{previewStep.template.body}</p>
              </div>
              <div className="flex gap-2">
                {previewStep.sendOnlyIfNotReplied && <Badge variant="secondary">Only if no reply</Badge>}
                {previewStep.sendOnlyIfNotOpened && <Badge variant="secondary">Only if not opened</Badge>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
