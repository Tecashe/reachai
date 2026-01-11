
// "use client"

// import * as React from "react"
// import {
//   Mail,
//   Clock,
//   X,
//   Trash2,
//   ChevronDown,
//   Variable,
//   Linkedin,
//   Phone,
//   CheckSquare,
//   ArrowRight,
//   Settings2,
//   TestTube,
//   Wand2,
//   User,
//   Building2,
//   Briefcase,
//   AtSign,
//   Hash,
//   Plus,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Separator } from "@/components/ui/separator"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { cn } from "@/lib/utils"
// import { useToast } from "@/hooks/use-toast"
// import type { SequenceStep, StepType, DelayUnit, SequenceStepVariant } from "@/lib/types/sequence"
// import { EmailComposerClient } from "./email-composer-client"
// import { EmailBodyPreview } from "@/components/templates/email-body-preview"
// import { ABTestPanel } from "./ab-test-panel"

// interface SequenceStepPanelProps {
//   step: SequenceStep
//   sequenceId: string
//   userId: string
//   onUpdate: (updates: Partial<SequenceStep>) => void
//   onClose: () => void
//   onDelete: () => void
// }

// const STEP_TYPE_CONFIG: Record<StepType, { icon: React.ElementType; label: string; color: string }> = {
//   EMAIL: { icon: Mail, label: "Email", color: "text-blue-500" },
//   LINKEDIN_VIEW: { icon: Linkedin, label: "LinkedIn View", color: "text-blue-600" },
//   LINKEDIN_CONNECT: { icon: Linkedin, label: "LinkedIn Connect", color: "text-blue-600" },
//   LINKEDIN_MESSAGE: { icon: Linkedin, label: "LinkedIn Message", color: "text-blue-600" },
//   CALL: { icon: Phone, label: "Phone Call", color: "text-green-500" },
//   TASK: { icon: CheckSquare, label: "Manual Task", color: "text-purple-500" },
//   DELAY: { icon: Clock, label: "Delay", color: "text-orange-500" },
//   CONDITION: { icon: ArrowRight, label: "Condition", color: "text-yellow-500" },
// }

// const PERSONALIZATION_VARIABLES = {
//   prospect: {
//     label: "Prospect",
//     icon: User,
//     variables: [
//       { key: "firstName", label: "First Name", fallback: "there" },
//       { key: "lastName", label: "Last Name", fallback: "" },
//       { key: "fullName", label: "Full Name", fallback: "there" },
//       { key: "email", label: "Email", fallback: "" },
//       { key: "phoneNumber", label: "Phone", fallback: "" },
//     ],
//   },
//   company: {
//     label: "Company",
//     icon: Building2,
//     variables: [
//       { key: "company", label: "Company Name", fallback: "your company" },
//       { key: "industry", label: "Industry", fallback: "" },
//       { key: "companySize", label: "Company Size", fallback: "" },
//       { key: "websiteUrl", label: "Website", fallback: "" },
//     ],
//   },
//   job: {
//     label: "Job Info",
//     icon: Briefcase,
//     variables: [
//       { key: "jobTitle", label: "Job Title", fallback: "" },
//       { key: "department", label: "Department", fallback: "" },
//     ],
//   },
//   sender: {
//     label: "Sender",
//     icon: AtSign,
//     variables: [
//       { key: "senderName", label: "Your Name", fallback: "" },
//       { key: "senderCompany", label: "Your Company", fallback: "" },
//       { key: "senderTitle", label: "Your Title", fallback: "" },
//     ],
//   },
//   custom: {
//     label: "Custom",
//     icon: Hash,
//     variables: [
//       { key: "customField1", label: "Custom Field 1", fallback: "" },
//       { key: "customField2", label: "Custom Field 2", fallback: "" },
//     ],
//   },
// }

// export function SequenceStepPanel({ step, sequenceId, userId, onUpdate, onClose, onDelete }: SequenceStepPanelProps) {
//   const { toast } = useToast()

//   const config = STEP_TYPE_CONFIG[step.stepType]
//   const [activeTab, setActiveTab] = React.useState("content")
//   const [isConditionsOpen, setIsConditionsOpen] = React.useState(false)
//   const [showEmailComposer, setShowEmailComposer] = React.useState(false)
//   const [variants, setVariants] = React.useState<SequenceStepVariant[]>(step.variants || [])
//   const [activeField, setActiveField] = React.useState<"subject" | "body" | null>(null)

//   const subjectRef = React.useRef<HTMLInputElement>(null)
//   const bodyRef = React.useRef<HTMLTextAreaElement>(null)

//   React.useEffect(() => {
//     setVariants(step.variants || [])
//   }, [step.variants])

//   const insertVariable = (variable: string, field: "subject" | "body") => {
//     const targetRef = field === "subject" ? subjectRef : bodyRef
//     const target = targetRef.current
//     if (!target) return

//     const start = target.selectionStart || 0
//     const end = target.selectionEnd || 0
//     const currentValue = target.value
//     const variableText = `{{${variable}}}`
//     const newValue = currentValue.substring(0, start) + variableText + currentValue.substring(end)

//     if (field === "subject") {
//       onUpdate({ subject: newValue })
//     } else {
//       onUpdate({ body: newValue })
//     }

//     setTimeout(() => {
//       target.focus()
//       target.setSelectionRange(start + variableText.length, start + variableText.length)
//     }, 0)
//   }

//   const handleVariantsChange = (newVariants: SequenceStepVariant[]) => {
//     setVariants(newVariants)
//     onUpdate({ variants: newVariants })
//   }

//   const handleEmailComposerSave = (subject: string, body: string) => {
//     onUpdate({ subject, body })
//     setShowEmailComposer(false)
//     toast({ title: "Email content updated" })
//   }

//   const VariableQuickInsert = ({ field }: { field: "subject" | "body" }) => (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           size="sm"
//           className="h-7 gap-1.5 px-2 text-xs shadow-sm border-border/60 hover:bg-muted/80 bg-transparent"
//         >
//           <Variable className="h-3.5 w-3.5" />
//           Insert Variable
//           <ChevronDown className="h-3 w-3 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-80 p-0 shadow-lg border-border/60" align="end" sideOffset={4}>
//         <div className="p-3 border-b bg-muted/30">
//           <h4 className="font-medium text-sm">Personalization Variables</h4>
//           <p className="text-xs text-muted-foreground mt-0.5">Click to insert at cursor position</p>
//         </div>
//         <ScrollArea className="h-72">
//           <div className="p-2">
//             {Object.entries(PERSONALIZATION_VARIABLES).map(([categoryKey, category]) => {
//               const CategoryIcon = category.icon
//               return (
//                 <div key={categoryKey} className="mb-3 last:mb-0">
//                   <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                     <CategoryIcon className="h-3.5 w-3.5" />
//                     {category.label}
//                   </div>
//                   <div className="space-y-0.5">
//                     {category.variables.map((v) => (
//                       <button
//                         key={v.key}
//                         className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-muted/80 transition-colors group"
//                         onClick={() => insertVariable(v.key, field)}
//                       >
//                         <div className="flex items-center gap-2">
//                           <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">
//                             {`{{${v.key}}}`}
//                           </code>
//                           <span className="text-sm text-muted-foreground">{v.label}</span>
//                         </div>
//                         <Plus className="h-3.5 w-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </ScrollArea>
//         <div className="p-2 border-t bg-muted/20">
//           <p className="text-[10px] text-muted-foreground text-center">
//             Variables with missing data will use fallbacks or be removed
//           </p>
//         </div>
//       </PopoverContent>
//     </Popover>
//   )

//   return (
//     <TooltipProvider>
//       <div className="flex h-full flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-border px-4 py-3">
//           <div className="flex items-center gap-3">
//             <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", "bg-primary/10")}>
//               <config.icon className={cn("h-4 w-4", config.color)} />
//             </div>
//             <div>
//               <h3 className="text-sm font-semibold text-foreground">{config.label}</h3>
//               <p className="text-xs text-muted-foreground">Step {step.order}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-1">
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8 text-destructive hover:bg-destructive/10"
//                   onClick={onDelete}
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Delete step</TooltipContent>
//             </Tooltip>
//             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
//           <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4 h-10">
//             <TabsTrigger
//               value="content"
//               className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//             >
//               Content
//             </TabsTrigger>
//             <TabsTrigger
//               value="settings"
//               className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//             >
//               <Settings2 className="mr-1.5 h-3.5 w-3.5" />
//               Settings
//             </TabsTrigger>
//             {step.stepType === "EMAIL" && (
//               <TabsTrigger
//                 value="ab-test"
//                 className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//               >
//                 <TestTube className="mr-1.5 h-3.5 w-3.5" />
//                 A/B Test
//                 {variants.length > 0 && (
//                   <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
//                     {variants.length}
//                   </Badge>
//                 )}
//               </TabsTrigger>
//             )}
//           </TabsList>

//           {/* Content Tab */}
//           <TabsContent value="content" className="flex-1 overflow-auto mt-0">
//             <div className="p-4 space-y-4">
//               {/* Timing */}
//               <div className="space-y-2">
//                 <Label className="text-xs font-medium text-muted-foreground">Timing</Label>
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-muted-foreground">Wait</span>
//                   <Input
//                     type="number"
//                     min={0}
//                     value={step.delayValue}
//                     onChange={(e) => onUpdate({ delayValue: Number.parseInt(e.target.value) || 0 })}
//                     className="h-8 w-16 text-center"
//                   />
//                   <Select value={step.delayUnit} onValueChange={(v) => onUpdate({ delayUnit: v as DelayUnit })}>
//                     <SelectTrigger className="h-8 w-24">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="MINUTES">minutes</SelectItem>
//                       <SelectItem value="HOURS">hours</SelectItem>
//                       <SelectItem value="DAYS">days</SelectItem>
//                       <SelectItem value="WEEKS">weeks</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <span className="text-sm text-muted-foreground">before sending</span>
//                 </div>
//               </div>

//               <Separator />

//               {/* Email content */}
//               {step.stepType === "EMAIL" && (
//                 <>
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <Label className="text-xs font-medium text-muted-foreground">Subject Line</Label>
//                       <VariableQuickInsert field="subject" />
//                     </div>
//                     <Input
//                       ref={subjectRef}
//                       value={step.subject || ""}
//                       onChange={(e) => onUpdate({ subject: e.target.value })}
//                       onFocus={() => setActiveField("subject")}
//                       placeholder="Enter subject line..."
//                       className="text-sm"
//                     />
//                     <p className="text-[10px] text-muted-foreground">{(step.subject || "").length} characters</p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Email Body</Label>
                    
//                     {/* Check if body has HTML content */}
//                     {/<[^>]+>/.test(step.body || "") ? (
//                       // Show rich HTML preview
//                       <EmailBodyPreview
//                         htmlContent={step.body || ""}
//                         onOpenEditor={() => setShowEmailComposer(true)}
//                       />
//                     ) : (
//                       // Show plain textarea for simple text
//                       <>
//                         <div className="flex items-center justify-between mb-2">
//                           <VariableQuickInsert field="body" />
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="h-7 gap-1.5 px-2 text-xs shadow-sm bg-transparent"
//                             onClick={() => setShowEmailComposer(true)}
//                           >
//                             <Wand2 className="h-3.5 w-3.5" />
//                             Use Rich Editor
//                           </Button>
//                         </div>
//                         <Textarea
//                           ref={bodyRef}
//                           value={step.body || ""}
//                           onChange={(e) => onUpdate({ body: e.target.value })}
//                           onFocus={() => setActiveField("body")}
//                           placeholder="Write your email content..."
//                           className="min-h-[200px] text-sm resize-none font-mono"
//                         />
//                         <div className="flex items-center justify-between">
//                           <p className="text-[10px] text-muted-foreground">{(step.body || "").length} characters</p>
//                           <p className="text-[10px] text-muted-foreground">
//                             {((step.body || "").match(/\{\{[^}]+\}\}/g) || []).length} variables used
//                           </p>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </>
//               )}


//               {/* LinkedIn content */}
//               {(step.stepType === "LINKEDIN_MESSAGE" || step.stepType === "LINKEDIN_CONNECT") && (
//                 <div className="space-y-2">
//                   <Label className="text-xs font-medium text-muted-foreground">LinkedIn Message</Label>
//                   <Textarea
//                     value={step.linkedInMessage || ""}
//                     onChange={(e) => onUpdate({ linkedInMessage: e.target.value })}
//                     placeholder="Write your LinkedIn message..."
//                     className="min-h-[150px] text-sm resize-none"
//                   />
//                   <p className="text-[10px] text-muted-foreground">
//                     {(step.linkedInMessage || "").length}/300 characters
//                   </p>
//                 </div>
//               )}

//               {/* Call script */}
//               {step.stepType === "CALL" && (
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Call Script</Label>
//                     <Textarea
//                       value={step.callScript || ""}
//                       onChange={(e) => onUpdate({ callScript: e.target.value })}
//                       placeholder="Write your call script or talking points..."
//                       className="min-h-[200px] text-sm resize-none"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Expected Duration (minutes)</Label>
//                     <Input
//                       type="number"
//                       min={1}
//                       value={step.callDuration || 5}
//                       onChange={(e) => onUpdate({ callDuration: Number.parseInt(e.target.value) || 5 })}
//                       className="h-8 w-24"
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Task content */}
//               {step.stepType === "TASK" && (
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Task Title</Label>
//                     <Input
//                       value={step.taskTitle || ""}
//                       onChange={(e) => onUpdate({ taskTitle: e.target.value })}
//                       placeholder="Enter task title..."
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Description</Label>
//                     <Textarea
//                       value={step.taskDescription || ""}
//                       onChange={(e) => onUpdate({ taskDescription: e.target.value })}
//                       placeholder="Describe what needs to be done..."
//                       className="min-h-[100px] text-sm resize-none"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Priority</Label>
//                     <Select
//                       value={step.taskPriority || "MEDIUM"}
//                       onValueChange={(v) => onUpdate({ taskPriority: v as any })}
//                     >
//                       <SelectTrigger className="w-32">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="LOW">Low</SelectItem>
//                         <SelectItem value="MEDIUM">Medium</SelectItem>
//                         <SelectItem value="HIGH">High</SelectItem>
//                         <SelectItem value="URGENT">Urgent</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </TabsContent>

//           {/* Settings Tab */}
//           <TabsContent value="settings" className="flex-1 overflow-auto mt-0">
//             <div className="p-4 space-y-4">
//               <Collapsible open={isConditionsOpen} onOpenChange={setIsConditionsOpen}>
//                 <CollapsibleTrigger asChild>
//                   <Button variant="ghost" className="w-full justify-between h-auto py-3 px-3">
//                     <div className="flex items-center gap-2">
//                       <Settings2 className="h-4 w-4 text-muted-foreground" />
//                       <span className="text-sm font-medium">Send Conditions</span>
//                     </div>
//                     <ChevronDown
//                       className={cn(
//                         "h-4 w-4 text-muted-foreground transition-transform",
//                         isConditionsOpen && "rotate-180",
//                       )}
//                     />
//                   </Button>
//                 </CollapsibleTrigger>
//                 <CollapsibleContent className="pt-2 space-y-4">
//                   <div className="flex items-center justify-between rounded-lg border p-3">
//                     <div>
//                       <p className="text-sm font-medium">Skip if replied</p>
//                       <p className="text-xs text-muted-foreground">Don't send if prospect has already replied</p>
//                     </div>
//                     <Switch
//                       checked={step.skipIfReplied}
//                       onCheckedChange={(checked) => onUpdate({ skipIfReplied: checked })}
//                     />
//                   </div>
//                   <div className="flex items-center justify-between rounded-lg border p-3">
//                     <div>
//                       <p className="text-sm font-medium">Skip if bounced</p>
//                       <p className="text-xs text-muted-foreground">Don't send if previous email bounced</p>
//                     </div>
//                     <Switch
//                       checked={step.skipIfBounced}
//                       onCheckedChange={(checked) => onUpdate({ skipIfBounced: checked })}
//                     />
//                   </div>
//                 </CollapsibleContent>
//               </Collapsible>

//               <Separator />

//               <div className="space-y-2">
//                 <Label className="text-xs font-medium text-muted-foreground">Internal Notes</Label>
//                 <Textarea
//                   value={step.internalNotes || ""}
//                   onChange={(e) => onUpdate({ internalNotes: e.target.value })}
//                   placeholder="Notes for your team (not sent to prospect)..."
//                   className="min-h-[80px] text-sm resize-none"
//                 />
//               </div>
//             </div>
//           </TabsContent>

//           {/* A/B Test Tab */}
//           {step.stepType === "EMAIL" && (
//             <TabsContent value="ab-test" className="flex-1 overflow-auto mt-0">
//               <ABTestPanel
//                 step={step}
//                 sequenceId={sequenceId}
//                 userId={userId}
//                 onUpdate={onUpdate}
//                 onVariantsChange={handleVariantsChange}
//               />
//             </TabsContent>
//           )}
//         </Tabs>
//       </div>

//       {/* Email Composer Dialog */}
//       {showEmailComposer && (
//         <EmailComposerClient
//           step={step}
//           userId={userId}
//           onSave={handleEmailComposerSave}
//           onClose={() => setShowEmailComposer(false)}
//         />
//       )}
//     </TooltipProvider>
//   )
// }
// "use client"

// import * as React from "react"
// import {
//   Mail,
//   Clock,
//   X,
//   Trash2,
//   ChevronDown,
//   Variable,
//   Linkedin,
//   Phone,
//   CheckSquare,
//   Settings2,
//   TestTube,
//   User,
//   Building2,
//   Briefcase,
//   AtSign,
//   Hash,
//   Plus,
//   AlertTriangle,
//   Split,
//   Timer,
//   LogOut,
//   UserCheck,
//   Layers,
//   Shuffle,
//   FileText,
//   Voicemail,
//   Send,
//   GitBranch,
//   Info,
//   BarChart3,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Separator } from "@/components/ui/separator"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Slider } from "@/components/ui/slider"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
// import { cn } from "@/lib/utils"
// import { useToast } from "@/hooks/use-toast"
// import type {
//   SequenceStep,
//   DelayUnit,
//   SequenceStepVariant,
//   WaitConditionType,
//   WaitFallbackAction,
//   ExitCondition,
//   CallOutcome,
// } from "@/lib/types/sequence"
// import { STEP_TYPE_CONFIG } from "@/lib/types/sequence"
// import { ABTestPanel } from "./ab-test-panel"

// interface SequenceStepPanelProps {
//   step: SequenceStep
//   sequenceId: string
//   userId: string
//   onUpdate: (updates: Partial<SequenceStep>) => void
//   onClose: () => void
//   onDelete: () => void
// }

// const PERSONALIZATION_VARIABLES = {
//   prospect: {
//     label: "Prospect",
//     icon: User,
//     variables: [
//       { key: "firstName", label: "First Name", fallback: "there" },
//       { key: "lastName", label: "Last Name", fallback: "" },
//       { key: "fullName", label: "Full Name", fallback: "there" },
//       { key: "email", label: "Email", fallback: "" },
//       { key: "phoneNumber", label: "Phone", fallback: "" },
//     ],
//   },
//   company: {
//     label: "Company",
//     icon: Building2,
//     variables: [
//       { key: "company", label: "Company Name", fallback: "your company" },
//       { key: "industry", label: "Industry", fallback: "" },
//       { key: "companySize", label: "Company Size", fallback: "" },
//       { key: "websiteUrl", label: "Website", fallback: "" },
//     ],
//   },
//   job: {
//     label: "Job Info",
//     icon: Briefcase,
//     variables: [
//       { key: "jobTitle", label: "Job Title", fallback: "" },
//       { key: "department", label: "Department", fallback: "" },
//     ],
//   },
//   sender: {
//     label: "Sender",
//     icon: AtSign,
//     variables: [
//       { key: "senderName", label: "Your Name", fallback: "" },
//       { key: "senderCompany", label: "Your Company", fallback: "" },
//       { key: "senderTitle", label: "Your Title", fallback: "" },
//     ],
//   },
//   custom: {
//     label: "Custom",
//     icon: Hash,
//     variables: [
//       { key: "customField1", label: "Custom Field 1", fallback: "" },
//       { key: "customField2", label: "Custom Field 2", fallback: "" },
//     ],
//   },
// }

// export function SequenceStepPanel({ step, sequenceId, userId, onUpdate, onClose, onDelete }: SequenceStepPanelProps) {
//   const { toast } = useToast()

//   const config = STEP_TYPE_CONFIG[step.stepType]
//   const [activeTab, setActiveTab] = React.useState("content")
//   const [isConditionsOpen, setIsConditionsOpen] = React.useState(false)
//   const [variants, setVariants] = React.useState<SequenceStepVariant[]>(step.variants || [])
//   const [activeField, setActiveField] = React.useState<"subject" | "body" | null>(null)

//   const subjectRef = React.useRef<HTMLInputElement>(null)
//   const bodyRef = React.useRef<HTMLTextAreaElement>(null)

//   React.useEffect(() => {
//     setVariants(step.variants || [])
//   }, [step.variants])

//   const insertVariable = (variable: string, field: "subject" | "body") => {
//     const targetRef = field === "subject" ? subjectRef : bodyRef
//     const target = targetRef.current
//     if (!target) return

//     const start = target.selectionStart || 0
//     const end = target.selectionEnd || 0
//     const currentValue = target.value
//     const variableText = `{{${variable}}}`
//     const newValue = currentValue.substring(0, start) + variableText + currentValue.substring(end)

//     if (field === "subject") {
//       onUpdate({ subject: newValue })
//     } else {
//       onUpdate({ body: newValue })
//     }

//     setTimeout(() => {
//       target.focus()
//       target.setSelectionRange(start + variableText.length, start + variableText.length)
//     }, 0)
//   }

//   const handleVariantsChange = (newVariants: SequenceStepVariant[]) => {
//     setVariants(newVariants)
//     onUpdate({ variants: newVariants })
//   }

//   const getSpamScore = () => {
//     // Simple spam score calculation based on content
//     let score = 0
//     const body = step.body?.toLowerCase() || ""
//     const subject = step.subject?.toLowerCase() || ""

//     const spamTriggers = ["free", "act now", "limited time", "click here", "urgent", "guarantee", "winner"]
//     spamTriggers.forEach((trigger) => {
//       if (body.includes(trigger) || subject.includes(trigger)) score += 2
//     })

//     if (subject.toUpperCase() === subject && subject.length > 5) score += 2
//     if (body.includes("!!!") || subject.includes("!!!")) score += 1

//     return Math.min(score, 10)
//   }

//   const getWordCount = () => {
//     return (step.body || "").split(/\s+/).filter(Boolean).length
//   }

//   const VariableQuickInsert = ({ field }: { field: "subject" | "body" }) => (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           size="sm"
//           className="h-7 gap-1.5 px-2 text-xs shadow-sm border-border/60 hover:bg-muted/80 bg-transparent"
//         >
//           <Variable className="h-3.5 w-3.5" />
//           Insert Variable
//           <ChevronDown className="h-3 w-3 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-80 p-0 shadow-lg border-border/60" align="end" sideOffset={4}>
//         <div className="p-3 border-b bg-muted/30">
//           <h4 className="font-medium text-sm">Personalization Variables</h4>
//           <p className="text-xs text-muted-foreground mt-0.5">Click to insert at cursor position</p>
//         </div>
//         <ScrollArea className="h-72">
//           <div className="p-2">
//             {Object.entries(PERSONALIZATION_VARIABLES).map(([categoryKey, category]) => {
//               const CategoryIcon = category.icon
//               return (
//                 <div key={categoryKey} className="mb-3 last:mb-0">
//                   <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                     <CategoryIcon className="h-3.5 w-3.5" />
//                     {category.label}
//                   </div>
//                   <div className="space-y-0.5">
//                     {category.variables.map((v) => (
//                       <button
//                         key={v.key}
//                         className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-muted/80 transition-colors group"
//                         onClick={() => insertVariable(v.key, field)}
//                       >
//                         <div className="flex items-center gap-2">
//                           <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">
//                             {`{{${v.key}}}`}
//                           </code>
//                           <span className="text-sm text-muted-foreground">{v.label}</span>
//                         </div>
//                         <Plus className="h-3.5 w-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </ScrollArea>
//       </PopoverContent>
//     </Popover>
//   )

//   const renderEmailContent = () => {
//     const spamScore = getSpamScore()
//     const wordCount = getWordCount()
//     const isWordCountGood = wordCount >= 50 && wordCount <= 125

//     return (
//       <>
//         {/* Spam Score & Word Count Indicators */}
//         <div className="flex gap-2 mb-4">
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <div
//                 className={cn(
//                   "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
//                   spamScore <= 3
//                     ? "bg-green-500/10 text-green-600"
//                     : spamScore <= 6
//                       ? "bg-amber-500/10 text-amber-600"
//                       : "bg-red-500/10 text-red-600",
//                 )}
//               >
//                 <AlertTriangle className="h-3 w-3" />
//                 Spam: {spamScore}/10
//               </div>
//             </TooltipTrigger>
//             <TooltipContent>
//               {spamScore <= 3
//                 ? "Good - Low spam risk"
//                 : spamScore <= 6
//                   ? "Fair - Some spam triggers detected"
//                   : "Poor - High spam risk"}
//             </TooltipContent>
//           </Tooltip>

//           <div
//             className={cn(
//               "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
//               isWordCountGood ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600",
//             )}
//           >
//             {wordCount} words
//           </div>
//         </div>

//         {/* Pre-header text */}
//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="text-xs font-medium text-muted-foreground">Pre-header Text</Label>
//             <Tooltip>
//               <TooltipTrigger>
//                 <Info className="h-3.5 w-3.5 text-muted-foreground" />
//               </TooltipTrigger>
//               <TooltipContent className="max-w-xs">Preview text shown in inbox before opening</TooltipContent>
//             </Tooltip>
//           </div>
//           <Input
//             value={step.preHeaderText || ""}
//             onChange={(e) => onUpdate({ preHeaderText: e.target.value })}
//             placeholder="Preview text..."
//             className="text-sm"
//           />
//         </div>

//         {/* Subject Line */}
//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="text-xs font-medium text-muted-foreground">Subject Line</Label>
//             <VariableQuickInsert field="subject" />
//           </div>
//           <Input
//             ref={subjectRef}
//             value={step.subject || ""}
//             onChange={(e) => onUpdate({ subject: e.target.value })}
//             onFocus={() => setActiveField("subject")}
//             placeholder="Enter subject line..."
//             className="text-sm"
//           />
//           <p className="text-[10px] text-muted-foreground">{(step.subject || "").length} characters</p>
//         </div>

//         {/* Email Body */}
//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="text-xs font-medium text-muted-foreground">Email Body</Label>
//             <VariableQuickInsert field="body" />
//           </div>
//           <Textarea
//             ref={bodyRef}
//             value={step.body || ""}
//             onChange={(e) => onUpdate({ body: e.target.value })}
//             onFocus={() => setActiveField("body")}
//             placeholder="Write your email content..."
//             className="min-h-[200px] text-sm resize-none font-mono"
//           />
//           <div className="flex items-center justify-between">
//             <p className="text-[10px] text-muted-foreground">{(step.body || "").length} characters</p>
//             <p className="text-[10px] text-muted-foreground">
//               {((step.body || "").match(/\{\{[^}]+\}\}/g) || []).length} variables used
//             </p>
//           </div>
//         </div>

//         {/* Custom From Name & Reply To */}
//         <Collapsible>
//           <CollapsibleTrigger asChild>
//             <Button variant="ghost" className="w-full justify-between h-8 text-xs">
//               Advanced email settings
//               <ChevronDown className="h-3 w-3" />
//             </Button>
//           </CollapsibleTrigger>
//           <CollapsibleContent className="space-y-3 pt-2">
//             <div className="grid grid-cols-2 gap-3">
//               <div className="space-y-1">
//                 <Label className="text-xs">Custom From Name</Label>
//                 <Input
//                   value={step.customFromName || ""}
//                   onChange={(e) => onUpdate({ customFromName: e.target.value })}
//                   placeholder="Your Name"
//                   className="h-8 text-xs"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <Label className="text-xs">Reply-to Address</Label>
//                 <Input
//                   value={step.replyToAddress || ""}
//                   onChange={(e) => onUpdate({ replyToAddress: e.target.value })}
//                   placeholder="reply@example.com"
//                   className="h-8 text-xs"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <span className="text-xs">AI Optimize Send Time</span>
//               <Switch
//                 checked={step.aiOptimizeSendTime || false}
//                 onCheckedChange={(checked) => onUpdate({ aiOptimizeSendTime: checked })}
//               />
//             </div>
//           </CollapsibleContent>
//         </Collapsible>
//       </>
//     )
//   }

//   const renderDelayContent = () => (
//     <>
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <span className="text-sm">Business days only</span>
//           <Switch
//             checked={step.businessDaysOnly || false}
//             onCheckedChange={(checked) => onUpdate({ businessDaysOnly: checked })}
//           />
//         </div>

//         <div className="flex items-center justify-between">
//           <div>
//             <span className="text-sm">Randomize delay</span>
//             <p className="text-xs text-muted-foreground">Add natural variation</p>
//           </div>
//           <Switch
//             checked={step.randomizeDelay || false}
//             onCheckedChange={(checked) => onUpdate({ randomizeDelay: checked })}
//           />
//         </div>

//         {step.randomizeDelay && (
//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-1">
//               <Label className="text-xs">Min delay</Label>
//               <Input
//                 type="number"
//                 min={1}
//                 value={step.delayRandomMin || step.delayValue}
//                 onChange={(e) => onUpdate({ delayRandomMin: Number.parseInt(e.target.value) || 1 })}
//                 className="h-8"
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs">Max delay</Label>
//               <Input
//                 type="number"
//                 min={1}
//                 value={step.delayRandomMax || step.delayValue + 1}
//                 onChange={(e) => onUpdate({ delayRandomMax: Number.parseInt(e.target.value) || 2 })}
//                 className="h-8"
//               />
//             </div>
//           </div>
//         )}

//         <div className="space-y-2">
//           <Label className="text-xs">Send at specific time</Label>
//           <Input
//             type="time"
//             value={step.sendAtTime || ""}
//             onChange={(e) => onUpdate({ sendAtTime: e.target.value })}
//             className="h-8"
//           />
//           <p className="text-xs text-muted-foreground">Leave empty to send anytime during business hours</p>
//         </div>
//       </div>
//     </>
//   )

//   const renderWaitUntilContent = () => {
//     const config = step.waitUntilConfig || {
//       conditionType: "EMAIL_OPENED" as WaitConditionType,
//       maxWaitDays: 3,
//       fallbackAction: "CONTINUE" as WaitFallbackAction,
//     }

//     return (
//       <div className="space-y-4">
//         <div className="space-y-2">
//           <Label className="text-xs">Wait condition</Label>
//           <Select
//             value={config.conditionType}
//             onValueChange={(v) =>
//               onUpdate({
//                 waitUntilConfig: { ...config, conditionType: v as WaitConditionType },
//               })
//             }
//           >
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="EMAIL_OPENED">Email is opened</SelectItem>
//               <SelectItem value="LINK_CLICKED">Link is clicked</SelectItem>
//               <SelectItem value="LINKEDIN_VIEWED">LinkedIn profile viewed back</SelectItem>
//               <SelectItem value="SPECIFIC_TIME">Specific time of day</SelectItem>
//               <SelectItem value="SPECIFIC_DAYS">Specific days only</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="text-xs">Max wait days</Label>
//             <span className="text-xs text-muted-foreground">{config.maxWaitDays} days</span>
//           </div>
//           <Slider
//             value={[config.maxWaitDays]}
//             onValueChange={([v]) => onUpdate({ waitUntilConfig: { ...config, maxWaitDays: v } })}
//             max={14}
//             min={1}
//             step={1}
//           />
//         </div>

//         {config.conditionType === "SPECIFIC_TIME" && (
//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-1">
//               <Label className="text-xs">Start time</Label>
//               <Input
//                 type="time"
//                 value={config.specificTimeStart || "09:00"}
//                 onChange={(e) => onUpdate({ waitUntilConfig: { ...config, specificTimeStart: e.target.value } })}
//                 className="h-8"
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs">End time</Label>
//               <Input
//                 type="time"
//                 value={config.specificTimeEnd || "11:00"}
//                 onChange={(e) => onUpdate({ waitUntilConfig: { ...config, specificTimeEnd: e.target.value } })}
//                 className="h-8"
//               />
//             </div>
//           </div>
//         )}

//         <div className="space-y-2">
//           <Label className="text-xs">If condition not met</Label>
//           <Select
//             value={config.fallbackAction}
//             onValueChange={(v) =>
//               onUpdate({
//                 waitUntilConfig: { ...config, fallbackAction: v as WaitFallbackAction },
//               })
//             }
//           >
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="SKIP">Skip this step</SelectItem>
//               <SelectItem value="CONTINUE">Continue anyway</SelectItem>
//               <SelectItem value="EXIT_SEQUENCE">Exit sequence</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="flex items-center justify-between">
//           <span className="text-sm">Use prospect timezone</span>
//           <Switch
//             checked={config.useProspectTimezone || false}
//             onCheckedChange={(checked) => onUpdate({ waitUntilConfig: { ...config, useProspectTimezone: checked } })}
//           />
//         </div>
//       </div>
//     )
//   }

//   const renderExitTriggerContent = () => {
//     const config = step.exitTriggerConfig || {
//       conditions: [],
//       actions: [],
//     }

//     const allConditions: ExitCondition[] = [
//       "ANY_REPLY",
//       "POSITIVE_REPLY",
//       "NEGATIVE_REPLY",
//       "MEETING_BOOKED",
//       "PAGE_VISITED",
//       "EMAIL_BOUNCED",
//       "UNSUBSCRIBED",
//       "LINK_CLICKED",
//     ]

//     const toggleCondition = (condition: ExitCondition) => {
//       const conditions = config.conditions.includes(condition)
//         ? config.conditions.filter((c) => c !== condition)
//         : [...config.conditions, condition]
//       onUpdate({ exitTriggerConfig: { ...config, conditions } })
//     }

//     return (
//       <div className="space-y-4">
//         <div className="space-y-2">
//           <Label className="text-xs">Exit when</Label>
//           <div className="flex flex-wrap gap-2">
//             {allConditions.map((condition) => (
//               <Badge
//                 key={condition}
//                 variant={config.conditions.includes(condition) ? "default" : "outline"}
//                 className="cursor-pointer"
//                 onClick={() => toggleCondition(condition)}
//               >
//                 {condition.toLowerCase().replace(/_/g, " ")}
//               </Badge>
//             ))}
//           </div>
//         </div>

//         {config.conditions.includes("PAGE_VISITED") && (
//           <div className="space-y-2">
//             <Label className="text-xs">Page URL to track</Label>
//             <Input
//               value={config.pageVisitedUrl || ""}
//               onChange={(e) => onUpdate({ exitTriggerConfig: { ...config, pageVisitedUrl: e.target.value } })}
//               placeholder="https://example.com/pricing"
//               className="text-sm"
//             />
//           </div>
//         )}

//         {config.conditions.includes("LINK_CLICKED") && (
//           <div className="space-y-2">
//             <Label className="text-xs">Link URL to track</Label>
//             <Input
//               value={config.linkClickedUrl || ""}
//               onChange={(e) => onUpdate({ exitTriggerConfig: { ...config, linkClickedUrl: e.target.value } })}
//               placeholder="https://example.com/demo"
//               className="text-sm"
//             />
//           </div>
//         )}
//       </div>
//     )
//   }

//   const renderManualReviewContent = () => {
//     const config = step.manualReviewConfig || {}

//     return (
//       <div className="space-y-4">
//         <div className="space-y-2">
//           <Label className="text-xs">Notify email</Label>
//           <Input
//             value={config.notifyEmail || ""}
//             onChange={(e) => onUpdate({ manualReviewConfig: { ...config, notifyEmail: e.target.value } })}
//             placeholder="team@example.com"
//             className="text-sm"
//           />
//         </div>

//         <div className="space-y-2">
//           <Label className="text-xs">Review instructions</Label>
//           <Textarea
//             value={config.reviewInstructions || ""}
//             onChange={(e) => onUpdate({ manualReviewConfig: { ...config, reviewInstructions: e.target.value } })}
//             placeholder="What should the reviewer look for?"
//             className="min-h-[80px] text-sm"
//           />
//         </div>

//         <div className="space-y-2">
//           <Label className="text-xs">Auto-approve after (days)</Label>
//           <Input
//             type="number"
//             min={0}
//             value={config.autoApproveAfterDays || ""}
//             onChange={(e) =>
//               onUpdate({
//                 manualReviewConfig: { ...config, autoApproveAfterDays: Number.parseInt(e.target.value) || undefined },
//               })
//             }
//             placeholder="Leave empty for no auto-approve"
//             className="text-sm"
//           />
//           <p className="text-xs text-muted-foreground">Set to 0 to require manual approval</p>
//         </div>
//       </div>
//     )
//   }

//   const renderCallContent = () => (
//     <div className="space-y-4">
//       <div className="space-y-2">
//         <Label className="text-xs font-medium text-muted-foreground">Call Script</Label>
//         <Textarea
//           value={step.callScript || ""}
//           onChange={(e) => onUpdate({ callScript: e.target.value })}
//           placeholder="Write your call script or talking points..."
//           className="min-h-[200px] text-sm resize-none"
//         />
//       </div>

//       <div className="space-y-2">
//         <Label className="text-xs font-medium text-muted-foreground">Expected Duration (minutes)</Label>
//         <Input
//           type="number"
//           min={1}
//           value={step.callDuration || 5}
//           onChange={(e) => onUpdate({ callDuration: Number.parseInt(e.target.value) || 5 })}
//           className="h-8 w-24"
//         />
//       </div>

//       <div className="flex items-center justify-between">
//         <span className="text-sm">Best time to call predictor</span>
//         <Switch
//           checked={step.callBestTimeEnabled || false}
//           onCheckedChange={(checked) => onUpdate({ callBestTimeEnabled: checked })}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label className="text-xs">Call outcome tracking</Label>
//         <Select value={step.callOutcome || ""} onValueChange={(v) => onUpdate({ callOutcome: v as CallOutcome })}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select outcome..." />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="CONNECTED">Connected</SelectItem>
//             <SelectItem value="VOICEMAIL">Voicemail</SelectItem>
//             <SelectItem value="NO_ANSWER">No Answer</SelectItem>
//             <SelectItem value="WRONG_NUMBER">Wrong Number</SelectItem>
//             <SelectItem value="GATEKEEPER">Gatekeeper</SelectItem>
//             <SelectItem value="BUSY">Busy</SelectItem>
//             <SelectItem value="CALLBACK_REQUESTED">Callback Requested</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//     </div>
//   )

//   const renderTaskContent = () => (
//     <div className="space-y-4">
//       <div className="space-y-2">
//         <Label className="text-xs font-medium text-muted-foreground">Task Title</Label>
//         <Input
//           value={step.taskTitle || ""}
//           onChange={(e) => onUpdate({ taskTitle: e.target.value })}
//           placeholder="Enter task title..."
//         />
//       </div>

//       <div className="space-y-2">
//         <Label className="text-xs font-medium text-muted-foreground">Description</Label>
//         <Textarea
//           value={step.taskDescription || ""}
//           onChange={(e) => onUpdate({ taskDescription: e.target.value })}
//           placeholder="Describe what needs to be done..."
//           className="min-h-[100px] text-sm resize-none"
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-3">
//         <div className="space-y-2">
//           <Label className="text-xs font-medium text-muted-foreground">Priority</Label>
//           <Select value={step.taskPriority || "MEDIUM"} onValueChange={(v) => onUpdate({ taskPriority: v as any })}>
//             <SelectTrigger className="w-full">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="LOW">Low</SelectItem>
//               <SelectItem value="MEDIUM">Medium</SelectItem>
//               <SelectItem value="HIGH">High</SelectItem>
//               <SelectItem value="URGENT">Urgent</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="space-y-2">
//           <Label className="text-xs font-medium text-muted-foreground">Est. Time (min)</Label>
//           <Input
//             type="number"
//             min={1}
//             value={step.taskEstimatedTime || ""}
//             onChange={(e) => onUpdate({ taskEstimatedTime: Number.parseInt(e.target.value) || undefined })}
//             placeholder="15"
//             className="h-9"
//           />
//         </div>
//       </div>

//       <div className="flex items-center justify-between">
//         <div>
//           <span className="text-sm">Require completion proof</span>
//           <p className="text-xs text-muted-foreground">Screenshot or note before marking done</p>
//         </div>
//         <Switch
//           checked={step.taskRequiresProof || false}
//           onCheckedChange={(checked) => onUpdate({ taskRequiresProof: checked })}
//         />
//       </div>
//     </div>
//   )

//   const renderLinkedInContent = () => (
//     <div className="space-y-4">
//       {(step.stepType === "LINKEDIN_MESSAGE" || step.stepType === "LINKEDIN_CONNECT") && (
//         <div className="space-y-2">
//           <Label className="text-xs font-medium text-muted-foreground">
//             {step.stepType === "LINKEDIN_CONNECT" ? "Connection Note" : "LinkedIn Message"}
//           </Label>
//           <Textarea
//             value={
//               step.stepType === "LINKEDIN_CONNECT" ? step.linkedInConnectionNote || "" : step.linkedInMessage || ""
//             }
//             onChange={(e) =>
//               onUpdate(
//                 step.stepType === "LINKEDIN_CONNECT"
//                   ? { linkedInConnectionNote: e.target.value }
//                   : { linkedInMessage: e.target.value },
//               )
//             }
//             placeholder={
//               step.stepType === "LINKEDIN_CONNECT"
//                 ? "Hi {{firstName}}, I'd love to connect..."
//                 : "Write your LinkedIn message..."
//             }
//             className="min-h-[150px] text-sm resize-none"
//           />
//           <p className="text-[10px] text-muted-foreground">
//             {
//               (step.stepType === "LINKEDIN_CONNECT" ? step.linkedInConnectionNote || "" : step.linkedInMessage || "")
//                 .length
//             }
//             /300 characters
//           </p>
//         </div>
//       )}

//       <div className="flex items-center justify-between">
//         <div>
//           <span className="text-sm">Safety limits</span>
//           <p className="text-xs text-muted-foreground">Respect LinkedIn rate limits</p>
//         </div>
//         <Switch
//           checked={step.linkedInSafetyLimits !== false}
//           onCheckedChange={(checked) => onUpdate({ linkedInSafetyLimits: checked })}
//         />
//       </div>

//       {step.stepType === "LINKEDIN_MESSAGE" && (
//         <div className="flex items-center justify-between">
//           <div>
//             <span className="text-sm">Use InMail</span>
//             <p className="text-xs text-muted-foreground">Use InMail credits if not connected</p>
//           </div>
//           <Switch
//             checked={step.linkedInInMailEnabled || false}
//             onCheckedChange={(checked) => onUpdate({ linkedInInMailEnabled: checked })}
//           />
//         </div>
//       )}
//     </div>
//   )

//   const renderStepContent = () => {
//     switch (step.stepType) {
//       case "EMAIL":
//         return renderEmailContent()
//       case "DELAY":
//         return renderDelayContent()
//       case "WAIT_UNTIL":
//         return renderWaitUntilContent()
//       case "EXIT_TRIGGER":
//         return renderExitTriggerContent()
//       case "MANUAL_REVIEW":
//         return renderManualReviewContent()
//       case "CALL":
//         return renderCallContent()
//       case "TASK":
//         return renderTaskContent()
//       case "LINKEDIN_VIEW":
//       case "LINKEDIN_CONNECT":
//       case "LINKEDIN_MESSAGE":
//         return renderLinkedInContent()
//       default:
//         return <p className="text-sm text-muted-foreground">Configuration for {step.stepType} coming soon.</p>
//     }
//   }

//   const renderStatsTab = () => {
//     const total = step.sent || 0
//     const openRate = total > 0 ? ((step.opened / total) * 100).toFixed(1) : "0"
//     const clickRate = total > 0 ? ((step.clicked / total) * 100).toFixed(1) : "0"
//     const replyRate = total > 0 ? ((step.replied / total) * 100).toFixed(1) : "0"
//     const bounceRate = total > 0 ? ((step.bounced / total) * 100).toFixed(1) : "0"

//     return (
//       <div className="p-4 space-y-4">
//         <div className="grid grid-cols-2 gap-3">
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-xs text-muted-foreground">Entered</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold">{step.sent}</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-xs text-muted-foreground">Completed</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold">{step.delivered}</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-xs text-muted-foreground">Skipped</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold">{step.skipped || 0}</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-xs text-muted-foreground">Exited</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold">{step.exited || 0}</p>
//             </CardContent>
//           </Card>
//         </div>

//         {(step.stepType === "EMAIL" || step.stepType === "LINKEDIN_MESSAGE") && (
//           <div className="space-y-3">
//             <div className="space-y-1">
//               <div className="flex justify-between text-xs">
//                 <span>Open rate</span>
//                 <span>{openRate}%</span>
//               </div>
//               <Progress value={Number.parseFloat(openRate)} className="h-2" />
//             </div>
//             <div className="space-y-1">
//               <div className="flex justify-between text-xs">
//                 <span>Click rate</span>
//                 <span>{clickRate}%</span>
//               </div>
//               <Progress value={Number.parseFloat(clickRate)} className="h-2" />
//             </div>
//             <div className="space-y-1">
//               <div className="flex justify-between text-xs">
//                 <span>Reply rate</span>
//                 <span>{replyRate}%</span>
//               </div>
//               <Progress value={Number.parseFloat(replyRate)} className="h-2" />
//             </div>
//             <div className="space-y-1">
//               <div className="flex justify-between text-xs">
//                 <span>Bounce rate</span>
//                 <span>{bounceRate}%</span>
//               </div>
//               <Progress value={Number.parseFloat(bounceRate)} className="h-2" />
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   return (
//     <TooltipProvider>
//       <div className="flex h-full flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-border px-4 py-3">
//           <div className="flex items-center gap-3">
//             <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", config.bgColor)}>
//               {step.stepType === "EMAIL" && <Mail className={cn("h-4 w-4", config.color)} />}
//               {step.stepType === "DELAY" && <Clock className={cn("h-4 w-4", config.color)} />}
//               {step.stepType === "WAIT_UNTIL" && <Timer className={cn("h-4 w-4", config.color)} />}
//               {step.stepType === "EXIT_TRIGGER" && <LogOut className={cn("h-4 w-4", config.color)} />}
//               {step.stepType === "MANUAL_REVIEW" && <UserCheck className={cn("h-4 w-4", config.color)} />}
//               {step.stepType === "CALL" && <Phone className={cn("h-4 w-4", config.color)} />}
//               {step.stepType === "TASK" && <CheckSquare className={cn("h-4 w-4", config.color)} />}
//               {step.stepType.startsWith("LINKEDIN_") && <Linkedin className={cn("h-4 w-4", config.color)} />}
//               {step.stepType === "CONDITION" && <GitBranch className={cn("h-4 w-4", config.color)} />}
//               {step.stepType === "AB_SPLIT" && <Split className={cn("h-4 w-4", config.color)} />}
//               {step.stepType === "MULTI_CHANNEL_TOUCH" && <Layers className={cn("h-4 w-4", config.color)} />}
//               {step.stepType === "BEHAVIOR_BRANCH" && <GitBranch className={cn("h-4 w-4", config.color)} />}
//               {step.stepType === "RANDOM_VARIANT" && <Shuffle className={cn("h-4 w-4", config.color)} />}
//               {step.stepType === "CONTENT_REFERENCE" && <FileText className={cn("h-4 w-4", config.color)} />}
//               {step.stepType === "VOICEMAIL_DROP" && <Voicemail className={cn("h-4 w-4", config.color)} />}
//               {step.stepType === "DIRECT_MAIL" && <Send className={cn("h-4 w-4", config.color)} />}
//             </div>
//             <div>
//               <h3 className="text-sm font-semibold text-foreground">{config.label}</h3>
//               <p className="text-xs text-muted-foreground">Step {step.order + 1}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-1">
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8 text-destructive hover:bg-destructive/10"
//                   onClick={onDelete}
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Delete step</TooltipContent>
//             </Tooltip>
//             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
//           <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4 h-10">
//             <TabsTrigger
//               value="content"
//               className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//             >
//               Content
//             </TabsTrigger>
//             <TabsTrigger
//               value="settings"
//               className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//             >
//               <Settings2 className="mr-1.5 h-3.5 w-3.5" />
//               Settings
//             </TabsTrigger>
//             <TabsTrigger
//               value="stats"
//               className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//             >
//               <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
//               Stats
//             </TabsTrigger>
//             {step.stepType === "EMAIL" && (
//               <TabsTrigger
//                 value="ab-test"
//                 className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
//               >
//                 <TestTube className="mr-1.5 h-3.5 w-3.5" />
//                 A/B Test
//                 {variants.length > 0 && (
//                   <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
//                     {variants.length}
//                   </Badge>
//                 )}
//               </TabsTrigger>
//             )}
//           </TabsList>

//           {/* Content Tab */}
//           <TabsContent value="content" className="flex-1 overflow-auto mt-0">
//             <div className="p-4 space-y-4">
//               {/* Timing - shown for all non-delay steps */}
//               {step.stepType !== "DELAY" && step.stepType !== "WAIT_UNTIL" && (
//                 <>
//                   <div className="space-y-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Timing</Label>
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm text-muted-foreground">Wait</span>
//                       <Input
//                         type="number"
//                         min={0}
//                         value={step.delayValue}
//                         onChange={(e) => onUpdate({ delayValue: Number.parseInt(e.target.value) || 0 })}
//                         className="h-8 w-16 text-center"
//                       />
//                       <Select value={step.delayUnit} onValueChange={(v) => onUpdate({ delayUnit: v as DelayUnit })}>
//                         <SelectTrigger className="h-8 w-24">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="MINUTES">minutes</SelectItem>
//                           <SelectItem value="HOURS">hours</SelectItem>
//                           <SelectItem value="DAYS">days</SelectItem>
//                           <SelectItem value="WEEKS">weeks</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <span className="text-sm text-muted-foreground">before sending</span>
//                     </div>
//                   </div>
//                   <Separator />
//                 </>
//               )}

//               {renderStepContent()}
//             </div>
//           </TabsContent>

//           {/* Settings Tab */}
//           <TabsContent value="settings" className="flex-1 overflow-auto mt-0">
//             <div className="p-4 space-y-4">
//               {/* Enable/Disable */}
//               <div className="flex items-center justify-between">
//                 <div>
//                   <span className="text-sm">Enable step</span>
//                   <p className="text-xs text-muted-foreground">Disabled steps are skipped</p>
//                 </div>
//                 <Switch
//                   checked={step.isEnabled !== false}
//                   onCheckedChange={(checked) => onUpdate({ isEnabled: checked })}
//                 />
//               </div>

//               <Separator />

//               {/* Conditions */}
//               <Collapsible open={isConditionsOpen} onOpenChange={setIsConditionsOpen}>
//                 <CollapsibleTrigger asChild>
//                   <Button variant="ghost" className="w-full justify-between">
//                     <span className="text-sm font-medium">Skip conditions</span>
//                     <ChevronDown className={cn("h-4 w-4 transition-transform", isConditionsOpen && "rotate-180")} />
//                   </Button>
//                 </CollapsibleTrigger>
//                 <CollapsibleContent className="space-y-3 pt-2">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm">Skip if replied</span>
//                     <Switch
//                       checked={step.skipIfReplied}
//                       onCheckedChange={(checked) => onUpdate({ skipIfReplied: checked })}
//                     />
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm">Skip if bounced</span>
//                     <Switch
//                       checked={step.skipIfBounced}
//                       onCheckedChange={(checked) => onUpdate({ skipIfBounced: checked })}
//                     />
//                   </div>
//                 </CollapsibleContent>
//               </Collapsible>

//               <Separator />

//               {/* Internal Notes */}
//               <div className="space-y-2">
//                 <Label className="text-xs">Internal notes</Label>
//                 <Textarea
//                   value={step.internalNotes || ""}
//                   onChange={(e) => onUpdate({ internalNotes: e.target.value })}
//                   placeholder="Notes visible only to your team..."
//                   className="min-h-[80px] text-sm resize-none"
//                 />
//               </div>
//             </div>
//           </TabsContent>

//           {/* Stats Tab */}
//           <TabsContent value="stats" className="flex-1 overflow-auto mt-0">
//             {renderStatsTab()}
//           </TabsContent>

//           {/* A/B Test Tab */}
//           {step.stepType === "EMAIL" && (
//             <TabsContent value="ab-test" className="flex-1 overflow-auto mt-0">
//               <ABTestPanel
//                 step={step}
//                 sequenceId={sequenceId}
//                 userId={userId}
//                 onUpdate={onUpdate}
//                 onVariantsChange={handleVariantsChange}
//               />
//             </TabsContent>
//           )}
//         </Tabs>
//       </div>
//     </TooltipProvider>
//   )
// }


"use client"

import * as React from "react"
import {
  Mail,
  Clock,
  X,
  Trash2,
  ChevronDown,
  Variable,
  Linkedin,
  Phone,
  CheckSquare,
  Settings2,
  TestTube,
  User,
  Building2,
  Briefcase,
  AtSign,
  Hash,
  Plus,
  AlertTriangle,
  Timer,
  LogOut,
  UserCheck,
  Info,
  BarChart3,
  Wand2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type {
  SequenceStep,
  DelayUnit,
  SequenceStepVariant,
  WaitConditionType,
  WaitFallbackAction,
  ExitCondition,
  CallOutcome,
} from "@/lib/types/sequence"
import { STEP_TYPE_CONFIG } from "@/lib/types/sequence"
import { ABTestPanel } from "./ab-test-panel"
import { EmailComposerClient } from "./email-composer-client"
import { EmailBodyPreview } from "@/components/templates/email-body-preview"

interface SequenceStepPanelProps {
  step: SequenceStep
  sequenceId: string
  userId: string
  onUpdate: (updates: Partial<SequenceStep>) => void
  onClose: () => void
  onDelete: () => void
}

const PERSONALIZATION_VARIABLES = {
  prospect: {
    label: "Prospect",
    icon: User,
    variables: [
      { key: "firstName", label: "First Name", fallback: "there" },
      { key: "lastName", label: "Last Name", fallback: "" },
      { key: "fullName", label: "Full Name", fallback: "there" },
      { key: "email", label: "Email", fallback: "" },
      { key: "phoneNumber", label: "Phone", fallback: "" },
    ],
  },
  company: {
    label: "Company",
    icon: Building2,
    variables: [
      { key: "company", label: "Company Name", fallback: "your company" },
      { key: "industry", label: "Industry", fallback: "" },
      { key: "companySize", label: "Company Size", fallback: "" },
      { key: "websiteUrl", label: "Website", fallback: "" },
    ],
  },
  job: {
    label: "Job Info",
    icon: Briefcase,
    variables: [
      { key: "jobTitle", label: "Job Title", fallback: "" },
      { key: "department", label: "Department", fallback: "" },
    ],
  },
  sender: {
    label: "Sender",
    icon: AtSign,
    variables: [
      { key: "senderName", label: "Your Name", fallback: "" },
      { key: "senderCompany", label: "Your Company", fallback: "" },
      { key: "senderTitle", label: "Your Title", fallback: "" },
    ],
  },
  custom: {
    label: "Custom",
    icon: Hash,
    variables: [
      { key: "customField1", label: "Custom Field 1", fallback: "" },
      { key: "customField2", label: "Custom Field 2", fallback: "" },
    ],
  },
}

export function SequenceStepPanel({ step, sequenceId, userId, onUpdate, onClose, onDelete }: SequenceStepPanelProps) {
  const { toast } = useToast()

  const config = STEP_TYPE_CONFIG[step.stepType]
  const [activeTab, setActiveTab] = React.useState("content")
  const [isConditionsOpen, setIsConditionsOpen] = React.useState(false)
  const [variants, setVariants] = React.useState<SequenceStepVariant[]>(step.variants || [])
  const [activeField, setActiveField] = React.useState<"subject" | "body" | null>(null)
  const [showEmailComposer, setShowEmailComposer] = React.useState(false)

  const subjectRef = React.useRef<HTMLInputElement>(null)
  const bodyRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    setVariants(step.variants || [])
  }, [step.variants])

  const insertVariable = (variable: string, field: "subject" | "body") => {
    const targetRef = field === "subject" ? subjectRef : bodyRef
    const target = targetRef.current
    if (!target) return

    const start = target.selectionStart || 0
    const end = target.selectionEnd || 0
    const currentValue = target.value
    const variableText = `{{${variable}}}`
    const newValue = currentValue.substring(0, start) + variableText + currentValue.substring(end)

    if (field === "subject") {
      onUpdate({ subject: newValue })
    } else {
      onUpdate({ body: newValue })
    }

    setTimeout(() => {
      target.focus()
      target.setSelectionRange(start + variableText.length, start + variableText.length)
    }, 0)
  }

  const handleVariantsChange = (newVariants: SequenceStepVariant[]) => {
    setVariants(newVariants)
    onUpdate({ variants: newVariants })
  }

  const handleEmailComposerSave = (subject: string, body: string) => {
    onUpdate({ subject, body })
    setShowEmailComposer(false)
    toast({ title: "Email content updated" })
  }

  const getSpamScore = () => {
    // Simple spam score calculation based on content
    let score = 0
    const body = step.body?.toLowerCase() || ""
    const subject = step.subject?.toLowerCase() || ""

    const spamTriggers = ["free", "act now", "limited time", "click here", "urgent", "guarantee", "winner"]
    spamTriggers.forEach((trigger) => {
      if (body.includes(trigger) || subject.includes(trigger)) score += 2
    })

    if (subject.toUpperCase() === subject && subject.length > 5) score += 2
    if (body.includes("!!!") || subject.includes("!!!")) score += 1

    return Math.min(score, 10)
  }

  const getWordCount = () => {
    return (step.body || "").split(/\s+/).filter(Boolean).length
  }

  const VariableQuickInsert = ({ field }: { field: "subject" | "body" }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs shadow-sm border-border/60 hover:bg-muted/80 bg-transparent"
        >
          <Variable className="h-3.5 w-3.5" />
          Insert Variable
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 shadow-lg border-border/60" align="end" sideOffset={4}>
        <div className="p-3 border-b bg-muted/30">
          <h4 className="font-medium text-sm">Personalization Variables</h4>
          <p className="text-xs text-muted-foreground mt-0.5">Click to insert at cursor position</p>
        </div>
        <ScrollArea className="h-72">
          <div className="p-2">
            {Object.entries(PERSONALIZATION_VARIABLES).map(([categoryKey, category]) => {
              const CategoryIcon = category.icon
              return (
                <div key={categoryKey} className="mb-3 last:mb-0">
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <CategoryIcon className="h-3.5 w-3.5" />
                    {category.label}
                  </div>
                  <div className="space-y-0.5">
                    {category.variables.map((v) => (
                      <button
                        key={v.key}
                        className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-muted/80 transition-colors group"
                        onClick={() => insertVariable(v.key, field)}
                      >
                        <div className="flex items-center gap-2">
                          <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">
                            {`{{${v.key}}}`}
                          </code>
                          <span className="text-sm text-muted-foreground">{v.label}</span>
                        </div>
                        <Plus className="h-3.5 w-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )

  const renderEmailContent = () => {
    const spamScore = getSpamScore()
    const wordCount = getWordCount()
    const isWordCountGood = wordCount >= 50 && wordCount <= 125
    const hasHtmlContent = /<[^>]+>/.test(step.body || "")

    return (
      <>
        {/* Spam Score & Word Count Indicators */}
        <div className="flex gap-2 mb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
                  spamScore <= 3
                    ? "bg-green-500/10 text-green-600"
                    : spamScore <= 6
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-red-500/10 text-red-600",
                )}
              >
                <AlertTriangle className="h-3 w-3" />
                Spam: {spamScore}/10
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {spamScore <= 3
                ? "Good - Low spam risk"
                : spamScore <= 6
                  ? "Fair - Some spam triggers detected"
                  : "Poor - High spam risk"}
            </TooltipContent>
          </Tooltip>

          <div
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
              isWordCountGood ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600",
            )}
          >
            {wordCount} words
          </div>
        </div>

        {/* Pre-header text */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Pre-header Text</Label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">Preview text shown in inbox before opening</TooltipContent>
            </Tooltip>
          </div>
          <Input
            value={step.preHeaderText || ""}
            onChange={(e) => onUpdate({ preHeaderText: e.target.value })}
            placeholder="Preview text..."
            className="text-sm"
          />
        </div>

        {/* Subject Line */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Subject Line</Label>
            <VariableQuickInsert field="subject" />
          </div>
          <Input
            ref={subjectRef}
            value={step.subject || ""}
            onChange={(e) => onUpdate({ subject: e.target.value })}
            onFocus={() => setActiveField("subject")}
            placeholder="Enter subject line..."
            className="text-sm"
          />
          <p className="text-[10px] text-muted-foreground">{(step.subject || "").length} characters</p>
        </div>

        {/* Email Body */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Email Body</Label>
            <VariableQuickInsert field="body" />
          </div>

          {hasHtmlContent ? (
            // Show rich HTML preview when body contains HTML
            <EmailBodyPreview htmlContent={step.body || ""} onOpenEditor={() => setShowEmailComposer(true)} />
          ) : (
            // Show plain textarea for simple text with "Use Rich Editor" button
            <>
              <div className="flex justify-end mb-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5 px-2 text-xs shadow-sm bg-transparent"
                  onClick={() => setShowEmailComposer(true)}
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  Use Rich Editor
                </Button>
              </div>
              <Textarea
                ref={bodyRef}
                value={step.body || ""}
                onChange={(e) => onUpdate({ body: e.target.value })}
                onFocus={() => setActiveField("body")}
                placeholder="Write your email content..."
                className="min-h-[200px] text-sm resize-none font-mono"
              />
            </>
          )}

          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground">{(step.body || "").length} characters</p>
            <p className="text-[10px] text-muted-foreground">
              {((step.body || "").match(/\{\{[^}]+\}\}/g) || []).length} variables used
            </p>
          </div>
        </div>

        {/* Custom From Name & Reply To */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between h-8 text-xs">
              Advanced email settings
              <ChevronDown className="h-3 w-3" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Custom From Name</Label>
                <Input
                  value={step.customFromName || ""}
                  onChange={(e) => onUpdate({ customFromName: e.target.value })}
                  placeholder="Your Name"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Reply-to Address</Label>
                <Input
                  value={step.replyToAddress || ""}
                  onChange={(e) => onUpdate({ replyToAddress: e.target.value })}
                  placeholder="reply@example.com"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs">AI Optimize Send Time</span>
              <Switch
                checked={step.aiOptimizeSendTime || false}
                onCheckedChange={(checked) => onUpdate({ aiOptimizeSendTime: checked })}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </>
    )
  }

  const renderDelayContent = () => (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Business days only</span>
          <Switch
            checked={step.businessDaysOnly || false}
            onCheckedChange={(checked) => onUpdate({ businessDaysOnly: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Randomize delay</span>
            <p className="text-xs text-muted-foreground">Add natural variation</p>
          </div>
          <Switch
            checked={step.randomizeDelay || false}
            onCheckedChange={(checked) => onUpdate({ randomizeDelay: checked })}
          />
        </div>

        {step.randomizeDelay && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Min delay</Label>
              <Input
                type="number"
                min={1}
                value={step.delayRandomMin || step.delayValue}
                onChange={(e) => onUpdate({ delayRandomMin: Number.parseInt(e.target.value) || 1 })}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Max delay</Label>
              <Input
                type="number"
                min={1}
                value={step.delayRandomMax || step.delayValue + 1}
                onChange={(e) => onUpdate({ delayRandomMax: Number.parseInt(e.target.value) || 2 })}
                className="h-8"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs">Send at specific time</Label>
          <Input
            type="time"
            value={step.sendAtTime || ""}
            onChange={(e) => onUpdate({ sendAtTime: e.target.value })}
            className="h-8"
          />
          <p className="text-xs text-muted-foreground">Leave empty to send anytime during business hours</p>
        </div>
      </div>
    </>
  )

  const renderWaitUntilContent = () => {
    const config = step.waitUntilConfig || {
      conditionType: "EMAIL_OPENED" as WaitConditionType,
      maxWaitDays: 3,
      fallbackAction: "CONTINUE" as WaitFallbackAction,
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Wait condition</Label>
          <Select
            value={config.conditionType}
            onValueChange={(v) =>
              onUpdate({
                waitUntilConfig: { ...config, conditionType: v as WaitConditionType },
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EMAIL_OPENED">Email is opened</SelectItem>
              <SelectItem value="LINK_CLICKED">Link is clicked</SelectItem>
              <SelectItem value="LINKEDIN_VIEWED">LinkedIn profile viewed back</SelectItem>
              <SelectItem value="SPECIFIC_TIME">Specific time of day</SelectItem>
              <SelectItem value="SPECIFIC_DAYS">Specific days only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Max wait days</Label>
            <span className="text-xs text-muted-foreground">{config.maxWaitDays} days</span>
          </div>
          <Slider
            value={[config.maxWaitDays]}
            onValueChange={([v]) => onUpdate({ waitUntilConfig: { ...config, maxWaitDays: v } })}
            max={14}
            min={1}
            step={1}
          />
        </div>

        {config.conditionType === "SPECIFIC_TIME" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Start time</Label>
              <Input
                type="time"
                value={config.specificTimeStart || "09:00"}
                onChange={(e) => onUpdate({ waitUntilConfig: { ...config, specificTimeStart: e.target.value } })}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">End time</Label>
              <Input
                type="time"
                value={config.specificTimeEnd || "11:00"}
                onChange={(e) => onUpdate({ waitUntilConfig: { ...config, specificTimeEnd: e.target.value } })}
                className="h-8"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs">If condition not met</Label>
          <Select
            value={config.fallbackAction}
            onValueChange={(v) =>
              onUpdate({
                waitUntilConfig: { ...config, fallbackAction: v as WaitFallbackAction },
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SKIP">Skip this step</SelectItem>
              <SelectItem value="CONTINUE">Continue anyway</SelectItem>
              <SelectItem value="EXIT_SEQUENCE">Exit sequence</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Use prospect timezone</span>
          <Switch
            checked={config.useProspectTimezone || false}
            onCheckedChange={(checked) => onUpdate({ waitUntilConfig: { ...config, useProspectTimezone: checked } })}
          />
        </div>
      </div>
    )
  }

  const renderExitTriggerContent = () => {
    const config = step.exitTriggerConfig || {
      conditions: [],
      actions: [],
    }

    const allConditions: ExitCondition[] = [
      "ANY_REPLY",
      "POSITIVE_REPLY",
      "NEGATIVE_REPLY",
      "MEETING_BOOKED",
      "PAGE_VISITED",
      "EMAIL_BOUNCED",
      "UNSUBSCRIBED",
      "LINK_CLICKED",
    ]

    const toggleCondition = (condition: ExitCondition) => {
      const conditions = config.conditions.includes(condition)
        ? config.conditions.filter((c) => c !== condition)
        : [...config.conditions, condition]
      onUpdate({ exitTriggerConfig: { ...config, conditions } })
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Exit when</Label>
          <div className="flex flex-wrap gap-2">
            {allConditions.map((condition) => (
              <Badge
                key={condition}
                variant={config.conditions.includes(condition) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleCondition(condition)}
              >
                {condition.toLowerCase().replace(/_/g, " ")}
              </Badge>
            ))}
          </div>
        </div>

        {config.conditions.includes("PAGE_VISITED") && (
          <div className="space-y-2">
            <Label className="text-xs">Page URL to track</Label>
            <Input
              value={config.pageVisitedUrl || ""}
              onChange={(e) => onUpdate({ exitTriggerConfig: { ...config, pageVisitedUrl: e.target.value } })}
              placeholder="https://example.com/pricing"
              className="text-sm"
            />
          </div>
        )}

        {config.conditions.includes("LINK_CLICKED") && (
          <div className="space-y-2">
            <Label className="text-xs">Link URL to track</Label>
            <Input
              value={config.linkClickedUrl || ""}
              onChange={(e) => onUpdate({ exitTriggerConfig: { ...config, linkClickedUrl: e.target.value } })}
              placeholder="https://example.com/demo"
              className="text-sm"
            />
          </div>
        )}
      </div>
    )
  }

  const renderManualReviewContent = () => {
    const config = step.manualReviewConfig || {}

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Notify email</Label>
          <Input
            value={config.notifyEmail || ""}
            onChange={(e) => onUpdate({ manualReviewConfig: { ...config, notifyEmail: e.target.value } })}
            placeholder="team@example.com"
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Review instructions</Label>
          <Textarea
            value={config.reviewInstructions || ""}
            onChange={(e) => onUpdate({ manualReviewConfig: { ...config, reviewInstructions: e.target.value } })}
            placeholder="What should the reviewer look for?"
            className="min-h-[80px] text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Auto-approve after (days)</Label>
          <Input
            type="number"
            min={0}
            value={config.autoApproveAfterDays || ""}
            onChange={(e) =>
              onUpdate({
                manualReviewConfig: { ...config, autoApproveAfterDays: Number.parseInt(e.target.value) || undefined },
              })
            }
            placeholder="Leave empty for no auto-approve"
            className="text-sm"
          />
          <p className="text-xs text-muted-foreground">Set to 0 to require manual approval</p>
        </div>
      </div>
    )
  }

  const renderCallContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Call Script</Label>
        <Textarea
          value={step.callScript || ""}
          onChange={(e) => onUpdate({ callScript: e.target.value })}
          placeholder="Write your call script or talking points..."
          className="min-h-[200px] text-sm resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Expected Duration (minutes)</Label>
        <Input
          type="number"
          min={1}
          value={step.callDuration || 5}
          onChange={(e) => onUpdate({ callDuration: Number.parseInt(e.target.value) || 5 })}
          className="h-8 w-24"
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm">Best time to call predictor</span>
        <Switch
          checked={step.callBestTimeEnabled || false}
          onCheckedChange={(checked) => onUpdate({ callBestTimeEnabled: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Call outcome tracking</Label>
        <Select value={step.callOutcome || ""} onValueChange={(v) => onUpdate({ callOutcome: v as CallOutcome })}>
          <SelectTrigger>
            <SelectValue placeholder="Select outcome..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CONNECTED">Connected</SelectItem>
            <SelectItem value="VOICEMAIL">Voicemail</SelectItem>
            <SelectItem value="NO_ANSWER">No Answer</SelectItem>
            <SelectItem value="WRONG_NUMBER">Wrong Number</SelectItem>
            <SelectItem value="GATEKEEPER">Gatekeeper</SelectItem>
            <SelectItem value="BUSY">Busy</SelectItem>
            <SelectItem value="CALLBACK_REQUESTED">Callback Requested</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderTaskContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Task Title</Label>
        <Input
          value={step.taskTitle || ""}
          onChange={(e) => onUpdate({ taskTitle: e.target.value })}
          placeholder="Enter task title..."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Description</Label>
        <Textarea
          value={step.taskDescription || ""}
          onChange={(e) => onUpdate({ taskDescription: e.target.value })}
          placeholder="Describe what needs to be done..."
          className="min-h-[100px] text-sm resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Priority</Label>
          <Select value={step.taskPriority || "MEDIUM"} onValueChange={(v) => onUpdate({ taskPriority: v as any })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Est. Time (min)</Label>
          <Input
            type="number"
            min={1}
            value={step.taskEstimatedTime || ""}
            onChange={(e) => onUpdate({ taskEstimatedTime: Number.parseInt(e.target.value) || undefined })}
            placeholder="15"
            className="h-9"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm">Require completion proof</span>
          <p className="text-xs text-muted-foreground">Screenshot or note before marking done</p>
        </div>
        <Switch
          checked={step.taskRequiresProof || false}
          onCheckedChange={(checked) => onUpdate({ taskRequiresProof: checked })}
        />
      </div>
    </div>
  )

  const renderLinkedInContent = () => (
    <div className="space-y-4">
      {(step.stepType === "LINKEDIN_MESSAGE" || step.stepType === "LINKEDIN_CONNECT") && (
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            {step.stepType === "LINKEDIN_CONNECT" ? "Connection Note" : "LinkedIn Message"}
          </Label>
          <Textarea
            value={
              step.stepType === "LINKEDIN_CONNECT" ? step.linkedInConnectionNote || "" : step.linkedInMessage || ""
            }
            onChange={(e) =>
              onUpdate(
                step.stepType === "LINKEDIN_CONNECT"
                  ? { linkedInConnectionNote: e.target.value }
                  : { linkedInMessage: e.target.value },
              )
            }
            placeholder={
              step.stepType === "LINKEDIN_CONNECT"
                ? "Hi {{firstName}}, I'd love to connect..."
                : "Write your LinkedIn message..."
            }
            className="min-h-[150px] text-sm resize-none"
          />
          <p className="text-[10px] text-muted-foreground">
            {
              (step.stepType === "LINKEDIN_CONNECT" ? step.linkedInConnectionNote || "" : step.linkedInMessage || "")
                .length
            }
            /300 characters
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm">Safety limits</span>
          <p className="text-xs text-muted-foreground">Respect LinkedIn rate limits</p>
        </div>
        <Switch
          checked={step.linkedInSafetyLimits !== false}
          onCheckedChange={(checked) => onUpdate({ linkedInSafetyLimits: checked })}
        />
      </div>

      {step.stepType === "LINKEDIN_MESSAGE" && (
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Use InMail</span>
            <p className="text-xs text-muted-foreground">Use InMail credits if not connected</p>
          </div>
          <Switch
            checked={step.linkedInInMailEnabled || false}
            onCheckedChange={(checked) => onUpdate({ linkedInInMailEnabled: checked })}
          />
        </div>
      )}
    </div>
  )

  const renderStepContent = () => {
    switch (step.stepType) {
      case "EMAIL":
        return renderEmailContent()
      case "DELAY":
        return renderDelayContent()
      case "WAIT_UNTIL":
        return renderWaitUntilContent()
      case "EXIT_TRIGGER":
        return renderExitTriggerContent()
      case "MANUAL_REVIEW":
        return renderManualReviewContent()
      case "CALL":
        return renderCallContent()
      case "TASK":
        return renderTaskContent()
      case "LINKEDIN_VIEW":
      case "LINKEDIN_CONNECT":
      case "LINKEDIN_MESSAGE":
        return renderLinkedInContent()
      default:
        return <p className="text-sm text-muted-foreground">Configuration for {step.stepType} coming soon.</p>
    }
  }

  const renderStatsTab = () => {
    const total = step.sent || 0
    const openRate = total > 0 ? ((step.opened / total) * 100).toFixed(1) : "0"
    const clickRate = total > 0 ? ((step.clicked / total) * 100).toFixed(1) : "0"
    const replyRate = total > 0 ? ((step.replied / total) * 100).toFixed(1) : "0"
    const bounceRate = total > 0 ? ((step.bounced / total) * 100).toFixed(1) : "0"

    return (
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Entered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{step.sent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{step.delivered}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Skipped</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{step.skipped || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Exited</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{step.exited || 0}</p>
            </CardContent>
          </Card>
        </div>

        {(step.stepType === "EMAIL" || step.stepType === "LINKEDIN_MESSAGE") && (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Open rate</span>
                <span>{openRate}%</span>
              </div>
              <Progress value={Number.parseFloat(openRate)} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Click rate</span>
                <span>{clickRate}%</span>
              </div>
              <Progress value={Number.parseFloat(clickRate)} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Reply rate</span>
                <span>{replyRate}%</span>
              </div>
              <Progress value={Number.parseFloat(replyRate)} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Bounce rate</span>
                <span>{bounceRate}%</span>
              </div>
              <Progress value={Number.parseFloat(bounceRate)} className="h-2" />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", config.bgColor)}>
              {step.stepType === "EMAIL" && <Mail className={cn("h-4 w-4", config.color)} />}
              {step.stepType === "DELAY" && <Clock className={cn("h-4 w-4", config.color)} />}
              {step.stepType === "WAIT_UNTIL" && <Timer className={cn("h-4 w-4", config.color)} />}
              {step.stepType === "EXIT_TRIGGER" && <LogOut className={cn("h-4 w-4", config.color)} />}
              {step.stepType === "MANUAL_REVIEW" && <UserCheck className={cn("h-4 w-4", config.color)} />}
              {step.stepType === "CALL" && <Phone className={cn("h-4 w-4", config.color)} />}
              {step.stepType === "TASK" && <CheckSquare className={cn("h-4 w-4", config.color)} />}
              {(step.stepType === "LINKEDIN_VIEW" ||
                step.stepType === "LINKEDIN_CONNECT" ||
                step.stepType === "LINKEDIN_MESSAGE") && <Linkedin className={cn("h-4 w-4", config.color)} />}
            </div>
            <div>
              <h3 className="font-medium text-sm">{config.label}</h3>
              <p className="text-xs text-muted-foreground">Step {step.order}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDelete}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4 h-auto py-0">
            <TabsTrigger
              value="content"
              className="rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
            >
              Content
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
            >
              <Settings2 className="h-3.5 w-3.5 mr-1" />
              Settings
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
            >
              <BarChart3 className="h-3.5 w-3.5 mr-1" />
              Stats
            </TabsTrigger>
            {step.stepType === "EMAIL" && (
              <TabsTrigger
                value="ab-test"
                className="rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
              >
                <TestTube className="h-3.5 w-3.5 mr-1" />
                A/B Test
              </TabsTrigger>
            )}
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="flex-1 overflow-auto mt-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {/* Timing Section for EMAIL type */}
                {step.stepType === "EMAIL" && (
                  <div className="space-y-3 pb-4 border-b">
                    <Label className="text-xs font-medium text-muted-foreground">Timing</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Wait</span>
                      <Input
                        type="number"
                        min={0}
                        value={step.delayValue}
                        onChange={(e) => onUpdate({ delayValue: Number.parseInt(e.target.value) || 0 })}
                        className="w-16 h-8"
                      />
                      <Select value={step.delayUnit} onValueChange={(v) => onUpdate({ delayUnit: v as DelayUnit })}>
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minutes">minutes</SelectItem>
                          <SelectItem value="hours">hours</SelectItem>
                          <SelectItem value="days">days</SelectItem>
                          <SelectItem value="weeks">weeks</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm">before sending</span>
                    </div>
                  </div>
                )}

                {renderStepContent()}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="flex-1 overflow-auto mt-0">
            <div className="p-4 space-y-4">
              <Collapsible open={isConditionsOpen} onOpenChange={setIsConditionsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between h-9">
                    <span className="text-sm font-medium">Skip conditions</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isConditionsOpen && "rotate-180")} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Skip if replied</span>
                    <Switch
                      checked={step.skipIfReplied}
                      onCheckedChange={(checked) => onUpdate({ skipIfReplied: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Skip if bounced</span>
                    <Switch
                      checked={step.skipIfBounced}
                      onCheckedChange={(checked) => onUpdate({ skipIfBounced: checked })}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Internal Notes */}
              <div className="space-y-2">
                <Label className="text-xs">Internal notes</Label>
                <Textarea
                  value={step.internalNotes || ""}
                  onChange={(e) => onUpdate({ internalNotes: e.target.value })}
                  placeholder="Notes visible only to your team..."
                  className="min-h-[80px] text-sm resize-none"
                />
              </div>
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="flex-1 overflow-auto mt-0">
            {renderStatsTab()}
          </TabsContent>

          {/* A/B Test Tab */}
          {step.stepType === "EMAIL" && (
            <TabsContent value="ab-test" className="flex-1 overflow-auto mt-0">
              <ABTestPanel
                step={step}
                sequenceId={sequenceId}
                userId={userId}
                onUpdate={onUpdate}
                onVariantsChange={handleVariantsChange}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>

      {showEmailComposer && (
        <EmailComposerClient
          step={step}
          userId={userId}
          onSave={handleEmailComposerSave}
          onClose={() => setShowEmailComposer(false)}
        />
      )}
    </TooltipProvider>
  )
}
