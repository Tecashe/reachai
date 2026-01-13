
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
//   Timer,
//   LogOut,
//   UserCheck,
//   Info,
//   BarChart3,
//   Wand2,
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
// import { EmailComposerClient } from "./email-composer-client"
// import { EmailBodyPreview } from "@/components/templates/email-body-preview"

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
//   const [showEmailComposer, setShowEmailComposer] = React.useState(false)

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
//     const hasHtmlContent = /<[^>]+>/.test(step.body || "")

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

//           {hasHtmlContent ? (
//             // Show rich HTML preview when body contains HTML
//             <EmailBodyPreview htmlContent={step.body || ""} onOpenEditor={() => setShowEmailComposer(true)} />
//           ) : (
//             // Show plain textarea for simple text with "Use Rich Editor" button
//             <>
//               <div className="flex justify-end mb-1">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="h-7 gap-1.5 px-2 text-xs shadow-sm bg-transparent"
//                   onClick={() => setShowEmailComposer(true)}
//                 >
//                   <Wand2 className="h-3.5 w-3.5" />
//                   Use Rich Editor
//                 </Button>
//               </div>
//               <Textarea
//                 ref={bodyRef}
//                 value={step.body || ""}
//                 onChange={(e) => onUpdate({ body: e.target.value })}
//                 onFocus={() => setActiveField("body")}
//                 placeholder="Write your email content..."
//                 className="min-h-[200px] text-sm resize-none font-mono"
//               />
//             </>
//           )}

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
//               {(step.stepType === "LINKEDIN_VIEW" ||
//                 step.stepType === "LINKEDIN_CONNECT" ||
//                 step.stepType === "LINKEDIN_MESSAGE") && <Linkedin className={cn("h-4 w-4", config.color)} />}
//             </div>
//             <div>
//               <h3 className="font-medium text-sm">{config.label}</h3>
//               <p className="text-xs text-muted-foreground">Step {step.order}</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-1">
//             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDelete}>
//               <Trash2 className="h-4 w-4 text-destructive" />
//             </Button>
//             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden">
//           <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4 h-auto py-0">
//             <TabsTrigger
//               value="content"
//               className="rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
//             >
//               Content
//             </TabsTrigger>
//             <TabsTrigger
//               value="settings"
//               className="rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
//             >
//               <Settings2 className="h-3.5 w-3.5 mr-1" />
//               Settings
//             </TabsTrigger>
//             <TabsTrigger
//               value="stats"
//               className="rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
//             >
//               <BarChart3 className="h-3.5 w-3.5 mr-1" />
//               Stats
//             </TabsTrigger>
//             {step.stepType === "EMAIL" && (
//               <TabsTrigger
//                 value="ab-test"
//                 className="rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs"
//               >
//                 <TestTube className="h-3.5 w-3.5 mr-1" />
//                 A/B Test
//               </TabsTrigger>
//             )}
//           </TabsList>

//           {/* Content Tab */}
//           <TabsContent value="content" className="flex-1 overflow-auto mt-0">
//             <ScrollArea className="h-full">
//               <div className="p-4 space-y-4">
//                 {/* Timing Section for EMAIL type */}
//                 {step.stepType === "EMAIL" && (
//                   <div className="space-y-3 pb-4 border-b">
//                     <Label className="text-xs font-medium text-muted-foreground">Timing</Label>
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm">Wait</span>
//                       <Input
//                         type="number"
//                         min={0}
//                         value={step.delayValue}
//                         onChange={(e) => onUpdate({ delayValue: Number.parseInt(e.target.value) || 0 })}
//                         className="w-16 h-8"
//                       />
//                       <Select value={step.delayUnit} onValueChange={(v) => onUpdate({ delayUnit: v as DelayUnit })}>
//                         <SelectTrigger className="w-24 h-8">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="minutes">minutes</SelectItem>
//                           <SelectItem value="hours">hours</SelectItem>
//                           <SelectItem value="days">days</SelectItem>
//                           <SelectItem value="weeks">weeks</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <span className="text-sm">before sending</span>
//                     </div>
//                   </div>
//                 )}

//                 {renderStepContent()}
//               </div>
//             </ScrollArea>
//           </TabsContent>

//           {/* Settings Tab */}
//           <TabsContent value="settings" className="flex-1 overflow-auto mt-0">
//             <div className="p-4 space-y-4">
//               <Collapsible open={isConditionsOpen} onOpenChange={setIsConditionsOpen}>
//                 <CollapsibleTrigger asChild>
//                   <Button variant="ghost" className="w-full justify-between h-9">
//                     <span className="text-sm font-medium">Skip conditions</span>
//                     <ChevronDown className={cn("h-4 w-4 transition-transform", isConditionsOpen && "rotate-180")} />
//                   </Button>
//                 </CollapsibleTrigger>
//                 <CollapsibleContent className="space-y-3 pt-3">
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
  Plus,
  AlertTriangle,
  Timer,
  LogOut,
  UserCheck,
  Info,
  BarChart3,
  GitBranch,
  Zap,
  MessageSquare,
  Gift,
  Sparkles,
  Copy,
  Eye,
  Save,
  RefreshCw,
  TrendingUp,
  Clock3,
  BookOpen,
} from "lucide-react"

// Mock UI components (in production, import from your UI library)
const Button = ({ children, className = "", variant = "default", size = "default", onClick, disabled, ...props }: any) => (
  <button
    className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${
      variant === "outline" ? "border border-gray-300 bg-white hover:bg-gray-100" :
      variant === "ghost" ? "hover:bg-gray-100" :
      variant === "destructive" ? "bg-red-600 text-white hover:bg-red-700" :
      "bg-blue-600 text-white hover:bg-blue-700"
    } ${
      size === "sm" ? "h-8 px-3 text-sm" :
      size === "icon" ? "h-9 w-9" :
      "h-10 px-4 py-2"
    } ${className}`}
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
)

const Input = ({ className = "", ...props }: any) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Textarea = ({ className = "", ...props }: any) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Label = ({ children, className = "", ...props }: any) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
    {children}
  </label>
)

const Switch = ({ checked, onCheckedChange, className = "" }: any) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange?.(!checked)}
    className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
      checked ? "bg-blue-600" : "bg-gray-200"
    } ${className}`}
  >
    <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
  </button>
)

const Select = ({ value, onValueChange, children }: any) => {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>{value || "Select..."}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, { onValueChange, setOpen })
          )}
        </div>
      )}
    </div>
  )
}

const SelectItem = ({ value, children, onValueChange, setOpen }: any) => (
  <button
    onClick={() => {
      onValueChange?.(value)
      setOpen?.(false)
    }}
    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
  >
    {children}
  </button>
)

const Badge = ({ children, variant = "default", className = "", onClick }: any) => (
  <span
    onClick={onClick}
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
      variant === "outline" ? "border border-gray-300 bg-white text-gray-700" : "bg-blue-100 text-blue-700"
    } ${onClick ? "cursor-pointer hover:opacity-80" : ""} ${className}`}
  >
    {children}
  </span>
)

const Slider = ({ value = [0], onValueChange, min = 0, max = 100, step = 1, className = "" }: any) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value[0]}
    onChange={(e) => onValueChange?.([parseInt(e.target.value)])}
    className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${className}`}
  />
)

const Tabs = ({ value, onValueChange, children, className = "" }: any) => (
  <div className={className}>
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { value, onValueChange })
    )}
  </div>
)

const TabsList = ({ children, className = "" }: any) => (
  <div className={`flex ${className}`}>{children}</div>
)

const TabsTrigger = ({ value: tabValue, children, value, onValueChange, className = "" }: any) => (
  <button
    onClick={() => onValueChange?.(tabValue)}
    className={`px-3 py-2 text-sm font-medium transition-colors ${
      value === tabValue ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"
    } ${className}`}
  >
    {children}
  </button>
)

const TabsContent = ({ value: tabValue, children, value, className = "" }: any) => (
  value === tabValue ? <div className={className}>{children}</div> : null
)

const Card = ({ children, className = "" }: any) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>{children}</div>
)

const CardHeader = ({ children, className = "" }: any) => (
  <div className={`p-4 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className = "" }: any) => (
  <h3 className={`font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
)

const CardContent = ({ children, className = "" }: any) => (
  <div className={`p-4 pt-0 ${className}`}>{children}</div>
)

const Progress = ({ value = 0, className = "" }: any) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
    <div
      className="h-full bg-blue-600 transition-all"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
)

// TYPE DEFINITIONS - This is what solves your TypeScript errors
type StepType =
  | "EMAIL"
  | "DELAY"
  | "WAIT_UNTIL"
  | "EXIT_TRIGGER"
  | "MANUAL_REVIEW"
  | "CALL"
  | "TASK"
  | "LINKEDIN_VIEW"
  | "LINKEDIN_CONNECT"
  | "LINKEDIN_MESSAGE"
  | "AB_SPLIT"
  | "MULTI_CHANNEL_TOUCH"
  | "BEHAVIOR_BRANCH"
  | "RANDOM_VARIANT"
  | "VOICEMAIL_DROP"
  | "DIRECT_MAIL"
  | "CONDITION"
  | "CONTENT_REFERENCE"

// This interface includes ALL properties that might be used
interface SequenceStep {
  id: string
  sequenceId: string
  order: number
  stepType: StepType
  delayValue: number
  delayUnit: string
  subject?: string
  body?: string
  skipIfReplied?: boolean
  skipIfBounced?: boolean
  taskPriority?: string
  spintaxEnabled?: boolean
  sent: number
  delivered: number
  opened: number
  clicked: number
  replied: number
  bounced: number
  isEnabled?: boolean
  createdAt: Date
  updatedAt: Date
  
  // Email properties
  preHeaderText?: string
  customFromName?: string
  replyToAddress?: string
  aiOptimizeSendTime?: boolean
  
  // Delay properties
  businessDaysOnly?: boolean
  randomizeDelay?: boolean
  delayRandomMin?: number
  delayRandomMax?: number
  sendAtTime?: string
  
  // Config objects
  waitUntilConfig?: {
    conditionType: string
    maxWaitDays: number
    specificTimeStart?: string
    specificTimeEnd?: string
    fallbackAction: string
  }
  exitTriggerConfig?: {
    conditions: string[]
    pageVisitedUrl?: string
    linkClickedUrl?: string
    actions?: any[]
  }
  manualReviewConfig?: {
    notifyEmail?: string
    reviewInstructions?: string
    autoApproveAfterDays?: number
  }
  
  // Task/Call properties
  callScript?: string
  callDuration?: number
  callOutcome?: string
  callBestTimeEnabled?: boolean
  taskTitle?: string
  taskDescription?: string
  taskEstimatedTime?: number
  taskRequiresProof?: boolean
  
  // LinkedIn properties
  linkedInConnectionNote?: string
  linkedInMessage?: string
  linkedInSafetyLimits?: boolean
  linkedInInMailEnabled?: boolean
  
  // Advanced configs
  abSplitConfig?: {
    branches: Array<{
      id: string
      name: string
      trafficPercent: number
      stats: { entered: number; converted: number }
    }>
    autoSelectWinner: boolean
    winnerThreshold: number
    mergeAfter?: boolean
  }
  multiChannelConfig?: {
    touches: Array<{
      id: string
      type: string
      order: number
      config: Record<string, any>
    }>
    executeSimultaneously: boolean
    delayBetweenTouches?: number
  }
  behaviorBranchConfig?: {
    branches: Array<{
      id: string
      name: string
      condition: string
      stats: { entered: number; converted: number }
    }>
    evaluationPeriodDays: number
  }
  randomVariantConfig?: {
    variants: Array<{
      id: string
      content: string
      usageCount: number
    }>
    variationType: string
  }
  voicemailDropConfig?: {
    useTts: boolean
    ttsMessage?: string
    audioUrl?: string
    integrationId?: string
    personalizeWithVariables?: boolean
  }
  directMailConfig?: {
    mailType: string
    message: string
    integrationId?: string
    useProspectAddress: boolean
    followUpEmailEnabled: boolean
    followUpDelay?: number
  }
  
  // Stats
  skipped?: number
  exited?: number
  avgTimeAtStep?: number
  internalNotes?: string
}

// Mock sequence step data
const mockStep: SequenceStep = {
  id: "step-1",
  sequenceId: "seq-1",
  order: 1,
  stepType: "EMAIL",
  delayValue: 2,
  delayUnit: "days",
  subject: "Hi {{firstName}}, quick question about {{company}}",
  body: "Hey {{firstName}},\n\nI noticed you're working at {{company}} as {{jobTitle}}. I wanted to reach out because...\n\nBest,\n{{senderName}}",
  skipIfReplied: true,
  skipIfBounced: true,
  taskPriority: "MEDIUM",
  spintaxEnabled: false,
  sent: 245,
  delivered: 238,
  opened: 156,
  clicked: 42,
  replied: 18,
  bounced: 7,
  isEnabled: true,
  createdAt: new Date(),
  updatedAt: new Date(),
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
}

const STEP_TYPE_CONFIG: Record<StepType, any> = {
  EMAIL: {
    label: "Email",
    description: "Send an automated email",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    icon: Mail,
  },
  DELAY: {
    label: "Delay",
    description: "Wait before next step",
    color: "text-gray-600",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/30",
    icon: Clock,
  },
  WAIT_UNTIL: {
    label: "Wait Until",
    description: "Wait for condition",
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    icon: Timer,
  },
  EXIT_TRIGGER: {
    label: "Exit Trigger",
    description: "Auto-exit sequence",
    color: "text-red-600",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    icon: LogOut,
  },
  MANUAL_REVIEW: {
    label: "Manual Review",
    description: "Require approval",
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    icon: UserCheck,
  },
  CALL: {
    label: "Call",
    description: "Create call task",
    color: "text-green-600",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    icon: Phone,
  },
  TASK: {
    label: "Task",
    description: "Create manual task",
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    icon: CheckSquare,
  },
  LINKEDIN_VIEW: {
    label: "LinkedIn View",
    description: "View profile",
    color: "text-sky-600",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/30",
    icon: Linkedin,
  },
  LINKEDIN_CONNECT: {
    label: "LinkedIn Connect",
    description: "Send connection",
    color: "text-sky-600",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/30",
    icon: Linkedin,
  },
  LINKEDIN_MESSAGE: {
    label: "LinkedIn Message",
    description: "Send message",
    color: "text-sky-600",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/30",
    icon: Linkedin,
  },
  AB_SPLIT: {
    label: "A/B Split",
    description: "Test variants",
    color: "text-indigo-600",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    icon: GitBranch,
  },
  MULTI_CHANNEL_TOUCH: {
    label: "Multi-Channel",
    description: "Multiple touches",
    color: "text-cyan-600",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    icon: Zap,
  },
  BEHAVIOR_BRANCH: {
    label: "Behavior Branch",
    description: "Branch by engagement",
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    icon: TrendingUp,
  },
  RANDOM_VARIANT: {
    label: "Random Variant",
    description: "Add variation",
    color: "text-fuchsia-600",
    bgColor: "bg-fuchsia-500/10",
    borderColor: "border-fuchsia-500/30",
    icon: Sparkles,
  },
  VOICEMAIL_DROP: {
    label: "Voicemail Drop",
    description: "Leave voicemail",
    color: "text-rose-600",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    icon: MessageSquare,
  },
  DIRECT_MAIL: {
    label: "Direct Mail",
    description: "Physical mail",
    color: "text-violet-600",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    icon: Gift,
  },
  CONDITION: {
    label: "Condition",
    description: "Branch logic",
    color: "text-yellow-600",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    icon: GitBranch,
  },
  CONTENT_REFERENCE: {
    label: "Content Reference",
    description: "Track content",
    color: "text-teal-600",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/30",
    icon: BookOpen,
  },
}

export default function SequenceStepPanel() {
  const [step, setStep] = React.useState<SequenceStep>(mockStep)
  const [activeTab, setActiveTab] = React.useState("content")
  const [showVariableMenu, setShowVariableMenu] = React.useState(false)
  const [activeField, setActiveField] = React.useState<"subject" | "body" | null>(null)

  const config = STEP_TYPE_CONFIG[step.stepType]
  const Icon = config?.icon || Mail

  const updateStep = (updates: Partial<SequenceStep>) => {
    setStep({ ...step, ...updates })
  }

  const insertVariable = (varKey: string) => {
    const field = activeField || "body"
    const currentValue = field === "subject" ? step.subject : step.body
    const newValue = `${currentValue || ""} {{${varKey}}}`
    updateStep({ [field]: newValue })
    setShowVariableMenu(false)
  }

  const getSpamScore = () => {
    const body = (step.body || "").toLowerCase()
    const subject = (step.subject || "").toLowerCase()
    let score = 0
    
    const triggers = ["free", "act now", "limited time", "click here", "urgent", "guarantee"]
    triggers.forEach(t => {
      if (body.includes(t) || subject.includes(t)) score += 2
    })
    
    if (subject === subject.toUpperCase() && subject.length > 5) score += 2
    if (body.includes("!!!")) score += 1
    
    return Math.min(score, 10)
  }

  const getWordCount = () => (step.body || "").split(/\s+/).filter(Boolean).length

  // Render functions for each step type
  const renderEmailContent = () => {
    const spamScore = getSpamScore()
    const wordCount = getWordCount()
    const isGoodLength = wordCount >= 50 && wordCount <= 125

    return (
      <div className="space-y-4">
        {/* Health Indicators */}
        <div className="flex flex-wrap gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
            spamScore <= 3 ? "bg-green-100 text-green-700" :
            spamScore <= 6 ? "bg-amber-100 text-amber-700" :
            "bg-red-100 text-red-700"
          }`}>
            <AlertTriangle className="h-3 w-3" />
            Spam: {spamScore}/10
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
            isGoodLength ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
          }`}>
            <BookOpen className="h-3 w-3" />
            {wordCount} words
          </div>
        </div>

        {/* Pre-header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Pre-header Text</Label>
            <Info className="h-3.5 w-3.5 text-gray-400" />
          </div>
          <Input
            value={step.preHeaderText || ""}
            onChange={(e: any) => updateStep({ preHeaderText: e.target.value })}
            placeholder="Preview text shown in inbox..."
            className="text-sm"
          />
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Subject Line</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveField("subject")
                setShowVariableMenu(!showVariableMenu)
              }}
              className="h-7 gap-1.5 text-xs"
            >
              <Variable className="h-3 w-3" />
              Insert Variable
            </Button>
          </div>
          <Input
            value={step.subject || ""}
            onChange={(e: any) => updateStep({ subject: e.target.value })}
            onFocus={() => setActiveField("subject")}
            placeholder="Enter subject line..."
          />
          <p className="text-xs text-gray-500">{(step.subject || "").length} characters</p>
        </div>

        {/* Body */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Email Body</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveField("body")
                setShowVariableMenu(!showVariableMenu)
              }}
              className="h-7 gap-1.5 text-xs"
            >
              <Variable className="h-3 w-3" />
              Insert Variable
            </Button>
          </div>
          <Textarea
            value={step.body || ""}
            onChange={(e: any) => updateStep({ body: e.target.value })}
            onFocus={() => setActiveField("body")}
            placeholder="Write your email..."
            className="min-h-[200px] text-sm font-mono"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{(step.body || "").length} characters</span>
            <span>{((step.body || "").match(/\{\{[^}]+\}\}/g) || []).length} variables</span>
          </div>
        </div>

        {/* Variable Menu */}
        {showVariableMenu && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Personalization Variables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(PERSONALIZATION_VARIABLES).map(([key, category]: any) => {
                const CategoryIcon = category.icon
                return (
                  <div key={key}>
                    <div className="flex items-center gap-2 mb-2">
                      <CategoryIcon className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-xs font-medium text-gray-600">{category.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {category.variables.map((v: any) => (
                        <Badge
                          key={v.key}
                          variant="outline"
                          onClick={() => insertVariable(v.key)}
                          className="cursor-pointer hover:bg-blue-100"
                        >
                          {v.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* Advanced Settings */}
        <details className="border rounded-lg">
          <summary className="px-3 py-2 cursor-pointer text-sm font-medium hover:bg-gray-50">
            Advanced Email Settings
          </summary>
          <div className="p-3 space-y-3 border-t">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Custom From Name</Label>
                <Input
                  value={step.customFromName || ""}
                  onChange={(e: any) => updateStep({ customFromName: e.target.value })}
                  placeholder="Your Name"
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Reply-to Address</Label>
                <Input
                  value={step.replyToAddress || ""}
                  onChange={(e: any) => updateStep({ replyToAddress: e.target.value })}
                  placeholder="reply@example.com"
                  className="h-9"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">AI Optimize Send Time</span>
              <Switch
                checked={step.aiOptimizeSendTime || false}
                onCheckedChange={(checked: boolean) => updateStep({ aiOptimizeSendTime: checked })}
              />
            </div>
          </div>
        </details>
      </div>
    )
  }

  const renderDelayContent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm">Business days only</span>
        <Switch
          checked={step.businessDaysOnly || false}
          onCheckedChange={(checked: boolean) => updateStep({ businessDaysOnly: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm">Randomize delay</span>
          <p className="text-xs text-gray-500">Add natural variation</p>
        </div>
        <Switch
          checked={step.randomizeDelay || false}
          onCheckedChange={(checked: boolean) => updateStep({ randomizeDelay: checked })}
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
              onChange={(e: any) => updateStep({ delayRandomMin: parseInt(e.target.value) || 1 })}
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Max delay</Label>
            <Input
              type="number"
              min={1}
              value={step.delayRandomMax || step.delayValue + 1}
              onChange={(e: any) => updateStep({ delayRandomMax: parseInt(e.target.value) || 2 })}
              className="h-9"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-xs">Send at specific time</Label>
        <Input
          type="time"
          value={step.sendAtTime || ""}
          onChange={(e: any) => updateStep({ sendAtTime: e.target.value })}
          className="h-9"
        />
        <p className="text-xs text-gray-500">Leave empty for any time during business hours</p>
      </div>
    </div>
  )

  const renderWaitUntilContent = () => {
    const config = step.waitUntilConfig || {
      conditionType: "EMAIL_OPENED",
      maxWaitDays: 3,
      fallbackAction: "CONTINUE",
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Wait condition</Label>
          <Select
            value={config.conditionType}
            onValueChange={(v: string) => updateStep({
              waitUntilConfig: { ...config, conditionType: v }
            })}
          >
            <SelectItem value="EMAIL_OPENED">Email is opened</SelectItem>
            <SelectItem value="LINK_CLICKED">Link is clicked</SelectItem>
            <SelectItem value="LINKEDIN_VIEWED">LinkedIn viewed back</SelectItem>
            <SelectItem value="SPECIFIC_TIME">Specific time of day</SelectItem>
            <SelectItem value="SPECIFIC_DAYS">Specific days only</SelectItem>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs">Max wait days</Label>
            <span className="text-xs text-gray-500">{config.maxWaitDays} days</span>
          </div>
          <Slider
            value={[config.maxWaitDays]}
            onValueChange={([v]: number[]) => updateStep({
              waitUntilConfig: { ...config, maxWaitDays: v }
            })}
            max={14}
            min={1}
          />
        </div>

        {config.conditionType === "SPECIFIC_TIME" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Start time</Label>
              <Input
                type="time"
                value={config.specificTimeStart || "09:00"}
                onChange={(e: any) => updateStep({
                  waitUntilConfig: { ...config, specificTimeStart: e.target.value }
                })}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">End time</Label>
              <Input
                type="time"
                value={config.specificTimeEnd || "17:00"}
                onChange={(e: any) => updateStep({
                  waitUntilConfig: { ...config, specificTimeEnd: e.target.value }
                })}
                className="h-9"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs">If condition not met</Label>
          <Select
            value={config.fallbackAction}
            onValueChange={(v: string) => updateStep({
              waitUntilConfig: { ...config, fallbackAction: v }
            })}
          >
            <SelectItem value="SKIP">Skip this step</SelectItem>
            <SelectItem value="CONTINUE">Continue anyway</SelectItem>
            <SelectItem value="EXIT_SEQUENCE">Exit sequence</SelectItem>
          </Select>
        </div>
      </div>
    )
  }

  const renderExitTriggerContent = () => {
    const config = step.exitTriggerConfig || { conditions: [], actions: [] }
    const allConditions = [
      "ANY_REPLY", "POSITIVE_REPLY", "NEGATIVE_REPLY", "MEETING_BOOKED",
      "PAGE_VISITED", "EMAIL_BOUNCED", "UNSUBSCRIBED", "LINK_CLICKED"
    ]

    const toggleCondition = (condition: string) => {
      const conditions = config.conditions.includes(condition)
        ? config.conditions.filter((c: string) => c !== condition)
        : [...config.conditions, condition]
      updateStep({ exitTriggerConfig: { ...config, conditions } })
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Exit sequence when</Label>
          <div className="flex flex-wrap gap-2">
            {allConditions.map((condition) => (
              <Badge
                key={condition}
                variant={config.conditions.includes(condition) ? "default" : "outline"}
                onClick={() => toggleCondition(condition)}
                className="cursor-pointer"
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
              onChange={(e: any) => updateStep({
                exitTriggerConfig: { ...config, pageVisitedUrl: e.target.value }
              })}
              placeholder="https://example.com/pricing"
            />
          </div>
        )}

        {config.conditions.includes("LINK_CLICKED") && (
          <div className="space-y-2">
            <Label className="text-xs">Link URL to track</Label>
            <Input
              value={config.linkClickedUrl || ""}
              onChange={(e: any) => updateStep({
                exitTriggerConfig: { ...config, linkClickedUrl: e.target.value }
              })}
              placeholder="https://example.com/demo"
            />
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex gap-2">
            <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <p className="font-medium mb-1">Auto-exit behavior</p>
              <p className="text-blue-700">When any selected condition is met, the prospect will be automatically removed from the sequence and marked accordingly.</p>
            </div>
          </div>
        </div>
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
            onChange={(e: any) => updateStep({
              manualReviewConfig: { ...config, notifyEmail: e.target.value }
            })}
            placeholder="team@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Review instructions</Label>
          <Textarea
            value={config.reviewInstructions || ""}
            onChange={(e: any) => updateStep({
              manualReviewConfig: { ...config, reviewInstructions: e.target.value }
            })}
            placeholder="What should the reviewer check before proceeding?"
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Auto-approve after (days)</Label>
          <Input
            type="number"
            min={0}
            value={config.autoApproveAfterDays || ""}
            onChange={(e: any) => updateStep({
              manualReviewConfig: { ...config, autoApproveAfterDays: parseInt(e.target.value) || undefined }
            })}
            placeholder="Leave empty for no auto-approve"
          />
          <p className="text-xs text-gray-500">Set to 0 to always require manual approval</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex gap-2">
            <UserCheck className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <p className="font-medium mb-1">Pause for review</p>
              <p className="text-amber-700">Sequence will pause at this step until manually approved in the review queue.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderCallContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs">Call Script</Label>
        <Textarea
          value={step.callScript || ""}
          onChange={(e: any) => updateStep({ callScript: e.target.value })}
          placeholder="Opening: Hi {{firstName}}, this is {{senderName}} from {{senderCompany}}...&#10;&#10;Discovery questions:&#10;- What's your biggest challenge with...&#10;- How are you currently handling...&#10;&#10;Next steps: Schedule a demo / Send information"
          className="min-h-[200px] font-mono text-sm"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs">Expected Duration (min)</Label>
          <Input
            type="number"
            min={1}
            value={step.callDuration || 5}
            onChange={(e: any) => updateStep({ callDuration: parseInt(e.target.value) || 5 })}
            className="h-9"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Call Outcome</Label>
          <Select
            value={step.callOutcome || ""}
            onValueChange={(v: string) => updateStep({ callOutcome: v })}
          >
            <SelectItem value="CONNECTED">Connected</SelectItem>
            <SelectItem value="VOICEMAIL">Voicemail</SelectItem>
            <SelectItem value="NO_ANSWER">No Answer</SelectItem>
            <SelectItem value="WRONG_NUMBER">Wrong Number</SelectItem>
            <SelectItem value="GATEKEEPER">Gatekeeper</SelectItem>
            <SelectItem value="BUSY">Busy</SelectItem>
            <SelectItem value="CALLBACK_REQUESTED">Callback Requested</SelectItem>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm">Best time to call predictor</span>
          <p className="text-xs text-gray-500">AI suggests optimal call times</p>
        </div>
        <Switch
          checked={step.callBestTimeEnabled || false}
          onCheckedChange={(checked: boolean) => updateStep({ callBestTimeEnabled: checked })}
        />
      </div>
    </div>
  )

  const renderTaskContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs">Task Title</Label>
        <Input
          value={step.taskTitle || ""}
          onChange={(e: any) => updateStep({ taskTitle: e.target.value })}
          placeholder="Research {{company}} and personalize approach"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Description</Label>
        <Textarea
          value={step.taskDescription || ""}
          onChange={(e: any) => updateStep({ taskDescription: e.target.value })}
          placeholder="Check their recent LinkedIn posts, company news, and identify 2-3 relevant talking points..."
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs">Priority</Label>
          <Select
            value={step.taskPriority || "MEDIUM"}
            onValueChange={(v: string) => updateStep({ taskPriority: v })}
          >
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Est. Time (min)</Label>
          <Input
            type="number"
            min={1}
            value={step.taskEstimatedTime || ""}
            onChange={(e: any) => updateStep({ taskEstimatedTime: parseInt(e.target.value) || undefined })}
            placeholder="15"
            className="h-9"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm">Require completion proof</span>
          <p className="text-xs text-gray-500">Screenshot or note required</p>
        </div>
        <Switch
          checked={step.taskRequiresProof || false}
          onCheckedChange={(checked: boolean) => updateStep({ taskRequiresProof: checked })}
        />
      </div>
    </div>
  )

  const renderLinkedInContent = () => (
    <div className="space-y-4">
      {(step.stepType === "LINKEDIN_MESSAGE" || step.stepType === "LINKEDIN_CONNECT") && (
        <div className="space-y-2">
          <Label className="text-xs">
            {step.stepType === "LINKEDIN_CONNECT" ? "Connection Note (Optional)" : "LinkedIn Message"}
          </Label>
          <Textarea
            value={step.stepType === "LINKEDIN_CONNECT" ? step.linkedInConnectionNote || "" : step.linkedInMessage || ""}
            onChange={(e: any) => updateStep(
              step.stepType === "LINKEDIN_CONNECT"
                ? { linkedInConnectionNote: e.target.value }
                : { linkedInMessage: e.target.value }
            )}
            placeholder={
              step.stepType === "LINKEDIN_CONNECT"
                ? "Hi {{firstName}}, I'd love to connect and share insights on..."
                : "Hi {{firstName}},\n\nI noticed your work at {{company}}..."
            }
            className="min-h-[150px]"
          />
          <p className="text-xs text-gray-500">
            {(step.stepType === "LINKEDIN_CONNECT" ? step.linkedInConnectionNote || "" : step.linkedInMessage || "").length}/300 characters
          </p>
        </div>
      )}

      {step.stepType === "LINKEDIN_VIEW" && (
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-3">
          <div className="flex gap-2">
            <Eye className="h-4 w-4 text-sky-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-sky-900">
              <p className="font-medium mb-1">Profile view warmup</p>
              <p className="text-sky-700">Viewing a prospect's LinkedIn profile before connecting increases acceptance rates by 40%.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm">Safety limits</span>
          <p className="text-xs text-gray-500">Respect LinkedIn rate limits</p>
        </div>
        <Switch
          checked={step.linkedInSafetyLimits !== false}
          onCheckedChange={(checked: boolean) => updateStep({ linkedInSafetyLimits: checked })}
        />
      </div>

      {step.stepType === "LINKEDIN_MESSAGE" && (
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Use InMail if needed</span>
            <p className="text-xs text-gray-500">Use credits for non-connections</p>
          </div>
          <Switch
            checked={step.linkedInInMailEnabled || false}
            onCheckedChange={(checked: boolean) => updateStep({ linkedInInMailEnabled: checked })}
          />
        </div>
      )}
    </div>
  )

  const renderABSplitContent = () => {
    const config = step.abSplitConfig || {
      branches: [
        { id: "A", name: "Variant A", trafficPercent: 50, stats: { entered: 0, converted: 0 } },
        { id: "B", name: "Variant B", trafficPercent: 50, stats: { entered: 0, converted: 0 } }
      ],
      autoSelectWinner: true,
      winnerThreshold: 100,
      mergeAfter: true
    }

    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-xs">Test Variants</Label>
          {config.branches.map((branch: any, index: number) => (
            <Card key={branch.id} className="border-indigo-200">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Input
                    value={branch.name}
                    onChange={(e: any) => {
                      const newBranches = [...config.branches]
                      newBranches[index].name = e.target.value
                      updateStep({ abSplitConfig: { ...config, branches: newBranches } })
                    }}
                    className="h-8 font-medium"
                  />
                  <Badge>{branch.trafficPercent}%</Badge>
                </div>
                <Slider
                  value={[branch.trafficPercent]}
                  onValueChange={([v]: number[]) => {
                    const newBranches = [...config.branches]
                    newBranches[index].trafficPercent = v
                    updateStep({ abSplitConfig: { ...config, branches: newBranches } })
                  }}
                  max={100}
                  min={10}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Auto-select winner</span>
            <p className="text-xs text-gray-500">After {config.winnerThreshold} sends</p>
          </div>
          <Switch
            checked={config.autoSelectWinner}
            onCheckedChange={(checked: boolean) => updateStep({
              abSplitConfig: { ...config, autoSelectWinner: checked }
            })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Winner threshold (sends)</Label>
          <Input
            type="number"
            min={50}
            value={config.winnerThreshold}
            onChange={(e: any) => updateStep({
              abSplitConfig: { ...config, winnerThreshold: parseInt(e.target.value) || 100 }
            })}
            className="h-9"
          />
        </div>
      </div>
    )
  }

  const renderMultiChannelContent = () => {
    const config = step.multiChannelConfig || {
      touches: [
        { id: "1", type: "EMAIL", order: 1, config: {} }
      ],
      executeSimultaneously: false,
      delayBetweenTouches: 30
    }

    const channelTypes = ["EMAIL", "LINKEDIN_VIEW", "LINKEDIN_CONNECT", "LINKEDIN_MESSAGE", "CALL"]

    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Channels</Label>
            <Button
              size="sm"
              onClick={() => {
                const newTouches = [...config.touches, {
                  id: Date.now().toString(),
                  type: "EMAIL",
                  order: config.touches.length + 1,
                  config: {}
                }]
                updateStep({ multiChannelConfig: { ...config, touches: newTouches } })
              }}
              className="h-7 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Channel
            </Button>
          </div>

          {config.touches.map((touch: any, index: number) => (
            <Card key={touch.id} className="border-cyan-200">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">#{touch.order}</span>
                  <Select
                    value={touch.type}
                    onValueChange={(v: string) => {
                      const newTouches = [...config.touches]
                      newTouches[index].type = v
                      updateStep({ multiChannelConfig: { ...config, touches: newTouches } })
                    }}
                  >
                    {channelTypes.map(type => (
                      <SelectItem key={type} value={type}>{type.replace(/_/g, " ")}</SelectItem>
                    ))}
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newTouches = config.touches.filter((t: any) => t.id !== touch.id)
                      updateStep({ multiChannelConfig: { ...config, touches: newTouches } })
                    }}
                    className="ml-auto h-7 w-7 p-0"
                  >
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Execute simultaneously</span>
            <p className="text-xs text-gray-500">All channels at once</p>
          </div>
          <Switch
            checked={config.executeSimultaneously}
            onCheckedChange={(checked: boolean) => updateStep({
              multiChannelConfig: { ...config, executeSimultaneously: checked }
            })}
          />
        </div>

        {!config.executeSimultaneously && (
          <div className="space-y-2">
            <Label className="text-xs">Delay between touches (minutes)</Label>
            <Input
              type="number"
              min={5}
              value={config.delayBetweenTouches}
              onChange={(e: any) => updateStep({
                multiChannelConfig: { ...config, delayBetweenTouches: parseInt(e.target.value) || 30 }
              })}
              className="h-9"
            />
          </div>
        )}
      </div>
    )
  }

  const renderBehaviorBranchContent = () => {
    const config = step.behaviorBranchConfig || {
      branches: [
        { id: "high", name: "High Engagement", condition: "OPENED_EMAIL", stats: { entered: 0, converted: 0 } },
        { id: "low", name: "Low Engagement", condition: "NOT_OPENED", stats: { entered: 0, converted: 0 } }
      ],
      evaluationPeriodDays: 3
    }

    const conditions = ["OPENED_EMAIL", "NOT_OPENED", "CLICKED_LINK", "NOT_CLICKED", "REPLIED", "NO_ACTION"]

    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-xs">Behavior Paths</Label>
          {config.branches.map((branch: any, index: number) => (
            <Card key={branch.id} className="border-emerald-200">
              <CardContent className="p-3 space-y-2">
                <Input
                  value={branch.name}
                  onChange={(e: any) => {
                    const newBranches = [...config.branches]
                    newBranches[index].name = e.target.value
                    updateStep({ behaviorBranchConfig: { ...config, branches: newBranches } })
                  }}
                  className="h-8 font-medium"
                />
                <Select
                  value={branch.condition}
                  onValueChange={(v: string) => {
                    const newBranches = [...config.branches]
                    newBranches[index].condition = v
                    updateStep({ behaviorBranchConfig: { ...config, branches: newBranches } })
                  }}
                >
                  {conditions.map(cond => (
                    <SelectItem key={cond} value={cond}>{cond.replace(/_/g, " ")}</SelectItem>
                  ))}
                </Select>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Evaluation period (days)</Label>
          <Input
            type="number"
            min={1}
            max={14}
            value={config.evaluationPeriodDays}
            onChange={(e: any) => updateStep({
              behaviorBranchConfig: { ...config, evaluationPeriodDays: parseInt(e.target.value) || 3 }
            })}
            className="h-9"
          />
          <p className="text-xs text-gray-500">Wait this long before evaluating behavior</p>
        </div>
      </div>
    )
  }

  const renderRandomVariantContent = () => {
    const config = step.randomVariantConfig || {
      variants: [
        { id: "1", content: "Hey {{firstName}},", usageCount: 0 },
        { id: "2", content: "Hi {{firstName}},", usageCount: 0 },
        { id: "3", content: "{{firstName}},", usageCount: 0 }
      ],
      variationType: "opening"
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Variation type</Label>
          <Select
            value={config.variationType}
            onValueChange={(v: string) => updateStep({
              randomVariantConfig: { ...config, variationType: v }
            })}
          >
            <SelectItem value="subject">Subject line</SelectItem>
            <SelectItem value="opening">Email opening</SelectItem>
            <SelectItem value="signoff">Email sign-off</SelectItem>
            <SelectItem value="full_email">Full email</SelectItem>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Variants</Label>
            <Button
              size="sm"
              onClick={() => {
                const newVariants = [...config.variants, {
                  id: Date.now().toString(),
                  content: "",
                  usageCount: 0
                }]
                updateStep({ randomVariantConfig: { ...config, variants: newVariants } })
              }}
              className="h-7 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Variant
            </Button>
          </div>

          {config.variants.map((variant: any, index: number) => (
            <div key={variant.id} className="flex gap-2">
              <Input
                value={variant.content}
                onChange={(e: any) => {
                  const newVariants = [...config.variants]
                  newVariants[index].content = e.target.value
                  updateStep({ randomVariantConfig: { ...config, variants: newVariants } })
                }}
                placeholder={`Variant ${index + 1}...`}
                className="h-9"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newVariants = config.variants.filter((v: any) => v.id !== variant.id)
                  updateStep({ randomVariantConfig: { ...config, variants: newVariants } })
                }}
                className="h-9 w-9 p-0"
              >
                <Trash2 className="h-3 w-3 text-red-600" />
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-lg p-3">
          <div className="flex gap-2">
            <Sparkles className="h-4 w-4 text-fuchsia-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-fuchsia-900">
              <p className="font-medium mb-1">Natural variation</p>
              <p className="text-fuchsia-700">System randomly selects one variant for each send to make emails feel more natural and less templated.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderVoicemailContent = () => {
    const config = step.voicemailDropConfig || {
      useTts: false,
      personalizeWithVariables: true
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Use text-to-speech</span>
            <p className="text-xs text-gray-500">Generate from message</p>
          </div>
          <Switch
            checked={config.useTts}
            onCheckedChange={(checked: boolean) => updateStep({
              voicemailDropConfig: { ...config, useTts: checked }
            })}
          />
        </div>

        {config.useTts ? (
          <div className="space-y-2">
            <Label className="text-xs">Voicemail message</Label>
            <Textarea
              value={config.ttsMessage || ""}
              onChange={(e: any) => updateStep({
                voicemailDropConfig: { ...config, ttsMessage: e.target.value }
              })}
              placeholder="Hi {{firstName}}, this is {{senderName}} from {{senderCompany}}. I wanted to follow up on..."
              className="min-h-[100px]"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label className="text-xs">Pre-recorded audio URL</Label>
            <Input
              value={config.audioUrl || ""}
              onChange={(e: any) => updateStep({
                voicemailDropConfig: { ...config, audioUrl: e.target.value }
              })}
              placeholder="https://example.com/voicemail.mp3"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs">Integration provider</Label>
          <Select
            value={config.integrationId || ""}
            onValueChange={(v: string) => updateStep({
              voicemailDropConfig: { ...config, integrationId: v }
            })}
          >
            <SelectItem value="">Manual (task notification)</SelectItem>
            <SelectItem value="slybroadcast">Slybroadcast</SelectItem>
            <SelectItem value="drop_cowboy">Drop Cowboy</SelectItem>
          </Select>
        </div>
      </div>
    )
  }

  const renderDirectMailContent = () => {
    const config = step.directMailConfig || {
      mailType: "postcard",
      message: "",
      useProspectAddress: true,
      followUpEmailEnabled: true,
      followUpDelay: 7
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Mail type</Label>
          <Select
            value={config.mailType}
            onValueChange={(v: string) => updateStep({
              directMailConfig: { ...config, mailType: v }
            })}
          >
            <SelectItem value="postcard">Postcard</SelectItem>
            <SelectItem value="handwritten_note">Handwritten Note</SelectItem>
            <SelectItem value="lumpy_mail">Lumpy Mail / Gift</SelectItem>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Message</Label>
          <Textarea
            value={config.message}
            onChange={(e: any) => updateStep({
              directMailConfig: { ...config, message: e.target.value }
            })}
            placeholder="Hi {{firstName}},\n\nJust wanted to send you something special..."
            className="min-h-[100px]"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Use prospect address</span>
          <Switch
            checked={config.useProspectAddress}
            onCheckedChange={(checked: boolean) => updateStep({
              directMailConfig: { ...config, useProspectAddress: checked }
            })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Send follow-up email</span>
            <p className="text-xs text-gray-500">After {config.followUpDelay} days</p>
          </div>
          <Switch
            checked={config.followUpEmailEnabled}
            onCheckedChange={(checked: boolean) => updateStep({
              directMailConfig: { ...config, followUpEmailEnabled: checked }
            })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Integration provider</Label>
          <Select
            value={config.integrationId || ""}
            onValueChange={(v: string) => updateStep({
              directMailConfig: { ...config, integrationId: v }
            })}
          >
            <SelectItem value="">Manual (task notification)</SelectItem>
            <SelectItem value="lob">Lob</SelectItem>
            <SelectItem value="sendoso">Sendoso</SelectItem>
            <SelectItem value="postal">Postal.io</SelectItem>
          </Select>
        </div>
      </div>
    )
  }

  const renderConditionContent = () => (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex gap-2">
          <GitBranch className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-yellow-900">
            <p className="font-medium mb-1">Conditional branching</p>
            <p className="text-yellow-700">Route prospects to different steps based on their data, engagement, or custom conditions.</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Condition type</Label>
        <Select value="engagement">
          <SelectItem value="engagement">Engagement-based</SelectItem>
          <SelectItem value="field">Field value</SelectItem>
          <SelectItem value="time">Time-based</SelectItem>
          <SelectItem value="custom">Custom webhook</SelectItem>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">If condition is TRUE</Label>
        <Select value="">
          <SelectItem value="">Continue to next step</SelectItem>
          <SelectItem value="3">Jump to step 3</SelectItem>
          <SelectItem value="5">Jump to step 5</SelectItem>
          <SelectItem value="exit">Exit sequence</SelectItem>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">If condition is FALSE</Label>
        <Select value="">
          <SelectItem value="">Continue to next step</SelectItem>
          <SelectItem value="4">Jump to step 4</SelectItem>
          <SelectItem value="6">Jump to step 6</SelectItem>
          <SelectItem value="exit">Exit sequence</SelectItem>
        </Select>
      </div>
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
      case "AB_SPLIT":
        return renderABSplitContent()
      case "MULTI_CHANNEL_TOUCH":
        return renderMultiChannelContent()
      case "BEHAVIOR_BRANCH":
        return renderBehaviorBranchContent()
      case "RANDOM_VARIANT":
        return renderRandomVariantContent()
      case "VOICEMAIL_DROP":
        return renderVoicemailContent()
      case "DIRECT_MAIL":
        return renderDirectMailContent()
      case "CONDITION":
        return renderConditionContent()
      default:
        return (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Settings2 className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">Configuration for {step.stepType}</p>
          </div>
        )
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
              <CardTitle className="text-xs text-gray-500">Entered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{step.sent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-gray-500">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{step.delivered}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-gray-500">Skipped</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{step.skipped || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-gray-500">Exited</CardTitle>
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
                <span className="font-medium">Open rate</span>
                <span className="text-gray-500">{openRate}%</span>
              </div>
              <Progress value={parseFloat(openRate)} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium">Click rate</span>
                <span className="text-gray-500">{clickRate}%</span>
              </div>
              <Progress value={parseFloat(clickRate)} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium">Reply rate</span>
                <span className="text-gray-500">{replyRate}%</span>
              </div>
              <Progress value={parseFloat(replyRate)} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium">Bounce rate</span>
                <span className="text-gray-500">{bounceRate}%</span>
              </div>
              <Progress value={parseFloat(bounceRate)} className="h-2" />
            </div>
          </div>
        )}

        <div className="pt-3 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Avg. time at step</span>
            <span className="font-medium">{step.avgTimeAtStep ? `${step.avgTimeAtStep}h` : "N/A"}</span>
          </div>
        </div>
      </div>
    )
  }

  const renderSettingsTab = () => (
    <div className="p-4 space-y-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Skip Conditions</Label>
        
        <div className="flex items-center justify-between py-2">
          <span className="text-sm">Skip if replied</span>
          <Switch
            checked={step.skipIfReplied}
            onCheckedChange={(checked: boolean) => updateStep({ skipIfReplied: checked })}
          />
        </div>
        
        <div className="flex items-center justify-between py-2">
          <span className="text-sm">Skip if bounced</span>
          <Switch
            checked={step.skipIfBounced}
            onCheckedChange={(checked: boolean) => updateStep({ skipIfBounced: checked })}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Internal Notes</Label>
          <Textarea
            value={step.internalNotes || ""}
            onChange={(e: any) => updateStep({ internalNotes: e.target.value })}
            placeholder="Notes visible only to your team..."
            className="min-h-[100px] text-sm"
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium">Enable this step</span>
            <p className="text-xs text-gray-500">Disabled steps are skipped</p>
          </div>
          <Switch
            checked={step.isEnabled !== false}
            onCheckedChange={(checked: boolean) => updateStep({ isEnabled: checked })}
          />
        </div>
      </div>
    </div>
  )

  const renderABTestTab = () => (
    <div className="p-4 space-y-4">
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
        <div className="flex gap-2">
          <TestTube className="h-4 w-4 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-900">
            <p className="font-medium mb-1">A/B Testing</p>
            <p className="text-indigo-700">Test different versions of this email to find what works best.</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Test Variants</Label>
          <Button size="sm" className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Add Variant
          </Button>
        </div>

        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Variant A (Control)</CardTitle>
              <Badge>50%</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs text-gray-500">Using main email content</div>
            <div className="flex gap-2 text-xs">
              <div>
                <span className="text-gray-500">Sent:</span> <span className="font-medium">122</span>
              </div>
              <div>
                <span className="text-gray-500">Opens:</span> <span className="font-medium">78 (63.9%)</span>
              </div>
              <div>
                <span className="text-gray-500">Replies:</span> <span className="font-medium">9 (7.4%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Variant B</CardTitle>
              <Badge>50%</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input placeholder="Alternative subject line..." className="h-8 text-sm" />
            <Textarea placeholder="Alternative email body..." className="min-h-[60px] text-sm" />
            <div className="flex gap-2 text-xs">
              <div>
                <span className="text-gray-500">Sent:</span> <span className="font-medium">123</span>
              </div>
              <div>
                <span className="text-gray-500">Opens:</span> <span className="font-medium">85 (69.1%)</span>
              </div>
              <div>
                <span className="text-gray-500">Replies:</span> <span className="font-medium">12 (9.8%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium">Auto-select winner</span>
            <p className="text-xs text-gray-500">After 100 sends per variant</p>
          </div>
          <Switch checked={true} />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Winning metric</Label>
          <Select value="REPLY_RATE">
            <SelectItem value="OPEN_RATE">Open Rate</SelectItem>
            <SelectItem value="CLICK_RATE">Click Rate</SelectItem>
            <SelectItem value="REPLY_RATE">Reply Rate</SelectItem>
            <SelectItem value="POSITIVE_REPLY_RATE">Positive Reply Rate</SelectItem>
          </Select>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-white max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.bgColor}`}>
            <Icon className={`h-4 w-4 ${config.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{config.label}</h3>
            <p className="text-xs text-gray-500">Step {step.order}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Copy className="h-4 w-4 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Timing Control - Show for EMAIL steps */}
      {step.stepType === "EMAIL" && (
        <div className="border-b px-4 py-3 bg-gray-50">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Clock3 className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Wait</span>
            <Input
              type="number"
              min={0}
              value={step.delayValue}
              onChange={(e: any) => updateStep({ delayValue: parseInt(e.target.value) || 0 })}
              className="w-16 h-8"
            />
            <Select value={step.delayUnit} onValueChange={(v: string) => updateStep({ delayUnit: v })}>
              <SelectItem value="MINUTES">minutes</SelectItem>
              <SelectItem value="HOURS">hours</SelectItem>
              <SelectItem value="DAYS">days</SelectItem>
              <SelectItem value="WEEKS">weeks</SelectItem>
            </Select>
            <span className="text-gray-600">before sending</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="border-b px-4 bg-white sticky top-[57px] z-10">
          <TabsTrigger value="content">
            <Mail className="h-3.5 w-3.5 mr-1.5" />
            Content
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings2 className="h-3.5 w-3.5 mr-1.5" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
            Stats
          </TabsTrigger>
          {step.stepType === "EMAIL" && (
            <TabsTrigger value="ab-test">
              <TestTube className="h-3.5 w-3.5 mr-1.5" />
              A/B Test
            </TabsTrigger>
          )}
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent value="content" className="m-0 p-0">
            <div className="p-4">
              {renderStepContent()}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="m-0 p-0">
            {renderSettingsTab()}
          </TabsContent>

          <TabsContent value="stats" className="m-0 p-0">
            {renderStatsTab()}
          </TabsContent>

          {step.stepType === "EMAIL" && (
            <TabsContent value="ab-test" className="m-0 p-0">
              {renderABTestTab()}
            </TabsContent>
          )}
        </div>
      </Tabs>

      {/* Footer Actions */}
      <div className="border-t px-4 py-3 bg-white sticky bottom-0 flex gap-2 justify-end">
        <Button variant="outline" size="sm">
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Reset
        </Button>
        <Button size="sm">
          <Save className="h-3.5 w-3.5 mr-1.5" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}