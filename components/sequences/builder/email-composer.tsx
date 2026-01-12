
// "use client"

// import { useMemo } from "react"
// import { stripHtml, hasRichFormatting } from "@/lib/utils/emails"
// import {
//   Bold,
//   Italic,
//   Link2,
//   Variable,
//   Sparkles,
//   Copy,
//   Check,
//   AlertTriangle,
//   CheckCircle2,
//   FileText,
//   ChevronDown,
//   User,
//   Building2,
//   Briefcase,
//   AtSign,
//   Plus,
//   Maximize2,
//   ImageIcon,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { cn } from "@/lib/utils"
// import type { SequenceStep, EnhancedEmailTemplate } from "@/lib/types/sequence"
// import { TemplateLibrary } from "@/components/templates/template-library"
// import { TemplateEditor } from "@/components/templates/template-editor"
// import { toast } from "sonner"
// import { useEffect, useState, useRef } from "react"
// import { getTemplates } from "@/lib/actions/templates"

// const SPAM_TRIGGER_WORDS = [
//   "free",
//   "guarantee",
//   "no obligation",
//   "winner",
//   "congratulations",
//   "urgent",
//   "act now",
//   "limited time",
//   "click here",
//   "buy now",
//   "order now",
//   "call now",
//   "don't delete",
//   "earn money",
//   "make money",
//   "extra income",
//   "100%",
//   "no cost",
//   "no fees",
//   "cash",
//   "credit",
//   "incredible deal",
//   "amazing",
//   "unbelievable",
// ]

// const PERSONALIZATION_VARIABLES = {
//   prospect: {
//     label: "Prospect",
//     icon: User,
//     variables: [
//       { key: "firstName", label: "First Name" },
//       { key: "lastName", label: "Last Name" },
//       { key: "fullName", label: "Full Name" },
//       { key: "email", label: "Email" },
//     ],
//   },
//   company: {
//     label: "Company",
//     icon: Building2,
//     variables: [
//       { key: "company", label: "Company Name" },
//       { key: "industry", label: "Industry" },
//       { key: "companySize", label: "Company Size" },
//     ],
//   },
//   job: {
//     label: "Job Info",
//     icon: Briefcase,
//     variables: [{ key: "jobTitle", label: "Job Title" }],
//   },
//   sender: {
//     label: "Sender",
//     icon: AtSign,
//     variables: [
//       { key: "senderName", label: "Your Name" },
//       { key: "senderCompany", label: "Your Company" },
//     ],
//   },
// }

// const AI_REWRITE_TONES = [
//   { id: "professional", label: "Professional", description: "Formal and business-appropriate" },
//   { id: "friendly", label: "Friendly", description: "Warm and approachable" },
//   { id: "persuasive", label: "Persuasive", description: "Compelling and action-oriented" },
//   { id: "concise", label: "Concise", description: "Short and to the point" },
// ]

// type EmailComposerProps = {
//   step: SequenceStep
//   onSave: (subject: string, body: string) => void
//   onClose: () => void
//   isOpen: boolean
//   onOpenChange: (open: boolean) => void
//   userId: string
//   prospect: any // Define the type of prospect if possible
// }

// export function EmailComposer({ step, onSave, onClose, isOpen, onOpenChange, userId, prospect }: EmailComposerProps) {
//   const [subject, setSubject] = useState(step?.subject || "")
//   const [body, setBody] = useState(step?.body || "") // Changed step?.content to step?.body to match SequenceStep type
//   const [showTemplateLibrary, setShowTemplateLibrary] = useState(false)
//   const [showFullEditor, setShowFullEditor] = useState(false)
//   const [templates, setTemplates] = useState<EnhancedEmailTemplate[]>([])
//   const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
//   const [currentDate, setCurrentDate] = useState("")
//   const [fullEditorTemplate, setFullEditorTemplate] = useState({
//     id: "temp-new",
//     name: "",
//     subject: subject,
//     body: body,
//     userId: userId,
//     description: null,
//     category: null,
//     thumbnailUrl: null,
//     previewImageUrl: null,
//     colorScheme: null,
//     industry: null,
//     tags: [],
//     isSystemTemplate: false,
//     isFavorite: false,
//     isPublished: false,
//     version: 1,
//     avgOpenRate: 0,
//     avgClickRate: 0,
//     avgReplyRate: 0,
//     totalSent: 0,
//     templateType: "TEXT" as const,
//     editorBlocks: null,
//     aiGenerated: false,
//     aiModel: null,
//     aiPrompt: null,
//     aiGenerationId: null,
//     basePrompt: null,
//     editorVersion: null,
//     variables: null,
//     timesUsed: 0,
//     lastUsedAt: null,
//     viewCount: 0,
//     duplicateCount: 0,
//     createdAt: currentDate ? new Date(currentDate) : new Date(),
//     updatedAt: currentDate ? new Date(currentDate) : new Date(),
//   })
//   const [templateHasImages, setTemplateHasImages] = useState(false)

//   const subjectInputRef = useRef<HTMLInputElement | null>(null)
//   const textareaRef = useRef<HTMLTextAreaElement>(null)

//   useEffect(() => {
//     setCurrentDate(new Date().toISOString())
//   }, [])

//   // Sync fullEditorTemplate with current subject and body
//   useEffect(() => {
//     setFullEditorTemplate((prev) => ({
//       ...prev,
//       subject,
//       body,
//     }))
//   }, [subject, body])

//   const spamAnalysis = useMemo(() => {
//     const content = `${subject} ${body}`.toLowerCase()
//     const foundTriggers: string[] = []
//     const warnings: string[] = []

//     SPAM_TRIGGER_WORDS.forEach((word) => {
//       if (content.includes(word.toLowerCase())) {
//         foundTriggers.push(word)
//       }
//     })

//     const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length
//     if (capsRatio > 0.3) warnings.push("Excessive use of capital letters")
//     if ((content.match(/[!?]{2,}/g) || []).length > 0) warnings.push("Multiple exclamation/question marks")
//     if (subject.length > 60) warnings.push("Subject line is too long (>60 chars)")
//     if (subject.length < 20 && subject.length > 0) warnings.push("Subject line might be too short")
//     if (body.length > 2000) warnings.push("Email body is very long")
//     if (body.length < 50 && body.length > 0) warnings.push("Email body might be too short")

//     const linkCount = (body.match(/https?:\/\//g) || []).length
//     if (linkCount > 3) warnings.push("Too many links in email")

//     let score = 100
//     score -= foundTriggers.length * 10
//     score -= warnings.length * 5
//     score = Math.max(0, Math.min(100, score))

//     return { score, foundTriggers, warnings }
//   }, [subject, body])

//   const getSpamScoreColor = (score: number) => {
//     if (score >= 80) return "text-green-500"
//     if (score >= 60) return "text-yellow-500"
//     return "text-red-500"
//   }

//   const getSpamScoreLabel = (score: number) => {
//     if (score >= 80) return "Excellent"
//     if (score >= 60) return "Good"
//     if (score >= 40) return "Fair"
//     return "Poor"
//   }

//   const handleSubjectChange = (value: string) => {
//     setSubject(value)
//     setFullEditorTemplate((prev) => ({ ...prev, subject: value }))
//   }

//   const handleBodyChange = (value: string) => {
//     setBody(value)
//     setFullEditorTemplate((prev) => ({ ...prev, body: value }))
//   }

//   const handleApplyTemplate = async (template: EnhancedEmailTemplate) => {
//     console.log("[v0] handleApplyTemplate starting with template:", template.name)

//     const hasRichContent = hasRichFormatting(template.body)
//     setTemplateHasImages(hasRichContent)

//     setSubject(template.subject)

//     // This ensures images and CTA buttons work properly in sequences
//     if (step) {
//       setBody(template.body) // Preserve full HTML with images and buttons
//       toast.success(`Applied template: ${template.name}`, {
//         description: hasRichContent ? "Template includes images and buttons" : undefined,
//       })
//     } else {
//       // For standalone email composer, strip HTML for plain textarea
//       const cleanBody = stripHtml(template.body, true)
//       setBody(cleanBody)

//       if (hasRichContent) {
//         toast.info("Template contains rich formatting", {
//           description: "Images and buttons shown as placeholders. Use Full Editor to see and edit rich formatting.",
//         })
//       } else {
//         toast.success(`Applied template: ${template.name}`)
//       }
//     }

//     setShowTemplateLibrary(false)
//     console.log("[v0] Template applied successfully")
//   }

//   const handleAIRewrite = async (tone: string) => {
//     // Placeholder for AI rewrite logic
//   }

//   const insertVariable = (variable: string) => {
//     const target = textareaRef.current
//     if (!target) return

//     const start = target.selectionStart || 0
//     const end = target.selectionEnd || 0
//     const variableText = `{{${variable}}}`
//     const newBody = body.substring(0, start) + variableText + body.substring(end)

//     setBody(newBody)

//     setTimeout(() => {
//       target.focus()
//       target.setSelectionRange(start + variableText.length, start + variableText.length)
//     }, 0)
//   }

//   const handleCopyToClipboard = async () => {
//     await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`)
//     // Placeholder for processing state logic
//   }

//   const handleSave = () => {
//     onSave(subject, body)
//   }

//   const previewContent = useMemo(() => {
//     const sampleData: Record<string, string> = {
//       firstName: "John",
//       lastName: "Smith",
//       fullName: "John Smith",
//       email: "john@company.com",
//       company: "Acme Inc",
//       jobTitle: "VP of Sales",
//       industry: "Technology",
//       companySize: "50-100",
//       senderName: "Your Name",
//       senderCompany: "Your Company",
//     }

//     let previewSubject = subject
//     let previewBody = body

//     Object.entries(sampleData).forEach(([key, value]) => {
//       const regex = new RegExp(`{{${key}}}`, "gi")
//       previewSubject = previewSubject.replace(regex, value)
//       previewBody = previewBody.replace(regex, value)
//     })

//     return { subject: previewSubject, body: previewBody }
//   }, [subject, body])

//   const handleTemplateSelect = async (template: EnhancedEmailTemplate) => {
//     console.log("[v0] Template selected:", template.name)
//     console.log("[v0] About to call handleApplyTemplate")
//     await handleApplyTemplate(template)
//     console.log("[v0] handleApplyTemplate completed")
//   }

//   const handleFullEditorSave = (updatedSubject: string, updatedBody: string) => {
//     console.log("[v0] Full editor save called")
//     setSubject(updatedSubject)
//     setBody(updatedBody)
//     setShowFullEditor(false)
//     toast("Email updated from editor")
//   }

//   useEffect(() => {
//     const loadTemplates = async () => {
//       if (!userId || !showTemplateLibrary) return

//       setIsLoadingTemplates(true)
//       try {
//         const result = await getTemplates()
//         if (Array.isArray(result)) {
//           const userTemplates = result.filter(
//             (template: any) => template.userId === userId && !template.isSystemTemplate,
//           )
//           setTemplates(userTemplates as EnhancedEmailTemplate[])
//         }
//       } catch (error) {
//         console.error("Failed to load templates:", error)
//         toast("Failed to load templates")
//       } finally {
//         setIsLoadingTemplates(false)
//       }
//     }

//     loadTemplates()
//   }, [userId, showTemplateLibrary])

//   return (
//     <>
//       <Dialog open={isOpen} onOpenChange={onOpenChange}>
//         <DialogContent className="max-w-[1800px] w-[95vw] h-[92vh] overflow-hidden p-0">
//           <DialogHeader className="px-6 py-4 border-b">
//             <div className="flex items-center justify-between">
//               <div className="flex-1 min-w-0">
//                 <DialogTitle>Email Composer</DialogTitle>
//                 <DialogDescription>Compose and optimize email content</DialogDescription>
//               </div>
//               <div className="flex items-center gap-2 flex-shrink-0">
//                 <div
//                   className={cn(
//                     "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
//                     spamAnalysis.score >= 80
//                       ? "bg-green-500/10 text-green-500"
//                       : spamAnalysis.score >= 60
//                         ? "bg-yellow-500/10 text-yellow-500"
//                         : "bg-red-500/10 text-red-500",
//                   )}
//                 >
//                   {spamAnalysis.score}
//                 </div>
//                 <div className="text-xs whitespace-nowrap">
//                   <p className={cn("font-medium", getSpamScoreColor(spamAnalysis.score))}>
//                     {getSpamScoreLabel(spamAnalysis.score)}
//                   </p>
//                   <p className="text-muted-foreground">Deliverability</p>
//                 </div>
//               </div>
//             </div>
//           </DialogHeader>

//           <div className="flex-1 flex overflow-hidden">
//             {/* Editor panel */}
//             <div className="flex-1 flex flex-col border-r">
//               {/* Toolbar */}
//               <div className="flex items-center justify-between border-b px-4 py-2">
//                 <div className="flex items-center gap-1">
//                   {/* <TooltipProvider>
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <Button variant="ghost" size="icon" className="h-8 w-8">
//                           <Bold className="h-4 w-4" />
//                         </Button>
//                       </TooltipTrigger>
//                       <TooltipContent>Bold</TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider> */}
//                   {/* <TooltipProvider>
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <Button variant="ghost" size="icon" className="h-8 w-8">
//                           <Italic className="h-4 w-4" />
//                         </Button>
//                       </TooltipTrigger>
//                       <TooltipContent>Italic</TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider> */}
//                   {/* <TooltipProvider>
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <Button variant="ghost" size="icon" className="h-8 w-8">
//                           <Link2 className="h-4 w-4" />
//                         </Button>
//                       </TooltipTrigger>
//                       <TooltipContent>Insert Link</TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider> */}

//                   {/* <Separator orientation="vertical" className="mx-1 h-6" /> */}

//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
//                         <Variable className="h-4 w-4" />
//                         Variables
//                         <ChevronDown className="h-3 w-3" />
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-72 p-0" align="start">
//                       <div className="p-3 border-b bg-muted/30">
//                         <h4 className="font-medium text-sm">Insert Variable</h4>
//                         <p className="text-xs text-muted-foreground">Click to insert at cursor</p>
//                       </div>
//                       <ScrollArea className="h-64">
//                         <div className="p-2">
//                           {Object.entries(PERSONALIZATION_VARIABLES).map(([categoryKey, category]) => {
//                             const CategoryIcon = category.icon
//                             return (
//                               <div key={categoryKey} className="mb-3 last:mb-0">
//                                 <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                                   <CategoryIcon className="h-3.5 w-3.5" />
//                                   {category.label}
//                                 </div>
//                                 {category.variables.map((v) => (
//                                   <button
//                                     key={v.key}
//                                     className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-muted transition-colors group"
//                                     onClick={() => insertVariable(v.key)}
//                                   >
//                                     <div className="flex items-center gap-2">
//                                       <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">
//                                         {`{{${v.key}}}`}
//                                       </code>
//                                       <span className="text-sm text-muted-foreground">{v.label}</span>
//                                     </div>
//                                     <Plus className="h-3.5 w-3.5 opacity-0 group-hover:opacity-50" />
//                                   </button>
//                                 ))}
//                               </div>
//                             )
//                           })}
//                         </div>
//                       </ScrollArea>
//                     </PopoverContent>
//                   </Popover>

//                   {/* Templates */}
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="h-8 gap-1 text-xs"
//                     onClick={() => setShowTemplateLibrary(true)}
//                   >
//                     <FileText className="h-4 w-4" />
//                     Templates
//                   </Button>

//                   <Separator orientation="vertical" className="mx-1 h-6" />

//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="h-8 gap-1 text-xs"
//                     onClick={() => {
//                       console.log("[v0] Full Editor button clicked")
//                       setShowFullEditor(true)
//                     }}
//                   >
//                     <Maximize2 className="h-4 w-4" />
//                     Full Editor
//                   </Button>

//                   {/* AI Rewrite */}
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
//                         <Sparkles className="h-4 w-4" />
//                         AI Rewrite
//                         <ChevronDown className="h-3 w-3" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="start">
//                       {AI_REWRITE_TONES.map((tone) => (
//                         <DropdownMenuItem key={tone.id} onClick={() => handleAIRewrite(tone.id)}>
//                           <div>
//                             <p className="text-sm">{tone.label}</p>
//                             <p className="text-xs text-muted-foreground">{tone.description}</p>
//                           </div>
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>

//               {/* Editor content */}
//               <div className="flex-1 overflow-auto p-4">
//                 <div className="space-y-4 max-w-3xl mx-auto">
//                   <div className="space-y-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Subject Line</Label>
//                     <Input
//                       ref={subjectInputRef}
//                       value={subject}
//                       onChange={(e) => handleSubjectChange(e.target.value)}
//                       placeholder="Enter your subject line..."
//                       className="text-base"
//                     />
//                     <p className="text-xs text-muted-foreground">{subject.length}/60 characters</p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Email Body</Label>
//                     <Textarea
//                       ref={textareaRef}
//                       value={body}
//                       onChange={(e) => handleBodyChange(e.target.value)}
//                       placeholder="Write your email content here..."
//                       className="min-h-[350px] text-sm resize-none font-mono"
//                     />
//                     <div className="flex items-center justify-between">
//                       <p className="text-xs text-muted-foreground">{body.length} characters</p>
//                       <p className="text-xs text-muted-foreground">
//                         {(body.match(/\{\{[^}]+\}\}/g) || []).length} variables
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Side panel - Spam analysis */}
//             <div className="w-80 flex flex-col overflow-hidden">
//               <div className="p-4 border-b">
//                 <h4 className="font-medium text-sm">Deliverability Check</h4>
//               </div>
//               <ScrollArea className="flex-1">
//                 <div className="p-4 space-y-4">
//                   {templateHasImages && (
//                     <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
//                       <div className="flex items-start gap-3">
//                         <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
//                         <div className="flex-1">
//                           <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
//                             Rich Formatting Detected
//                           </h4>
//                           <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
//                             This template includes images and/or CTA buttons.{" "}
//                             {step
//                               ? "Full HTML is preserved for your sequence."
//                               : "Use Full Editor to see and edit rich formatting."}
//                           </p>
//                           {!step && (
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className="mt-2 border-blue-300 dark:border-blue-700 bg-transparent"
//                               onClick={() => setShowFullEditor(true)}
//                             >
//                               Open Full Editor
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   <div className="text-center py-4">
//                     <div
//                       className={cn(
//                         "inline-flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold",
//                         spamAnalysis.score >= 80
//                           ? "bg-green-500/10 text-green-500"
//                           : spamAnalysis.score >= 60
//                             ? "bg-yellow-500/10 text-yellow-500"
//                             : "bg-red-500/10 text-red-500",
//                       )}
//                     >
//                       {spamAnalysis.score}
//                     </div>
//                     <p className={cn("mt-2 font-medium", getSpamScoreColor(spamAnalysis.score))}>
//                       {getSpamScoreLabel(spamAnalysis.score)}
//                     </p>
//                     <p className="text-xs text-muted-foreground">Deliverability Score</p>
//                   </div>

//                   <Separator />

//                   {(spamAnalysis.foundTriggers.length > 0 || spamAnalysis.warnings.length > 0) && (
//                     <div className="space-y-3">
//                       <h5 className="text-xs font-medium text-muted-foreground uppercase">Issues Found</h5>

//                       {spamAnalysis.foundTriggers.length > 0 && (
//                         <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30 p-3">
//                           <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
//                             <AlertTriangle className="h-4 w-4" />
//                             <span className="text-xs font-medium">Spam trigger words</span>
//                           </div>
//                           <div className="mt-2 flex flex-wrap gap-1">
//                             {spamAnalysis.foundTriggers.map((word) => (
//                               <Badge key={word} variant="outline" className="text-[10px] bg-white dark:bg-transparent">
//                                 {word}
//                               </Badge>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {spamAnalysis.warnings.map((warning, i) => (
//                         <div key={i} className="flex items-start gap-2 rounded-lg border bg-muted/50 p-3">
//                           <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
//                           <span className="text-xs">{warning}</span>
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {spamAnalysis.foundTriggers.length === 0 && spamAnalysis.warnings.length === 0 && (
//                     <div className="flex items-center gap-2 rounded-lg border bg-green-50 dark:bg-green-950/30 p-3">
//                       <CheckCircle2 className="h-4 w-4 text-green-500" />
//                       <span className="text-xs text-green-700 dark:text-green-400">
//                         No issues found. Your email looks great!
//                       </span>
//                     </div>
//                   )}

//                   <Separator />

//                   <div className="space-y-2">
//                     <h5 className="text-xs font-medium text-muted-foreground uppercase">Best Practices</h5>
//                     <div className="space-y-2 text-xs text-muted-foreground">
//                       <div className="flex items-start gap-2">
//                         <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                         <span>Keep subject under 60 characters</span>
//                       </div>
//                       <div className="flex items-start gap-2">
//                         <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                         <span>Personalize with variables</span>
//                       </div>
//                       <div className="flex items-start gap-2">
//                         <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                         <span>Avoid spam trigger words</span>
//                       </div>
//                       <div className="flex items-start gap-2">
//                         <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                         <span>Limit to 1-2 links per email</span>
//                       </div>
//                       <div className="flex items-start gap-2">
//                         <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                         <span>Keep emails under 200 words</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </ScrollArea>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="flex items-center justify-between border-t px-6 py-4">
//             <Button variant="outline" onClick={handleCopyToClipboard} className="gap-2 shadow-sm bg-transparent">
//               <Copy className="h-4 w-4" />
//               Copy
//             </Button>
//             <div className="flex items-center gap-2">
//               <Button variant="outline" onClick={onClose} className="shadow-sm bg-transparent">
//                 Cancel
//               </Button>
//               <Button onClick={handleSave} className="gap-2 shadow-sm">
//                 <Check className="h-4 w-4" />
//                 Save Changes
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Template Library Dialog */}
//       <Dialog open={showTemplateLibrary} onOpenChange={setShowTemplateLibrary}>
//         <DialogContent className="max-w-[1800px] w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col">
//           <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
//             <DialogTitle>Choose Email Template</DialogTitle>
//             <DialogDescription>Select from your saved templates</DialogDescription>
//           </DialogHeader>
//           {userId && (
//             <div className="flex-1 overflow-auto p-6">
//               {isLoadingTemplates ? (
//                 <div className="flex items-center justify-center h-full">
//                   <div className="text-muted-foreground">Loading templates...</div>
//                 </div>
//               ) : templates.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full gap-4">
//                   <div className="text-center">
//                     <h3 className="text-lg font-semibold mb-2">No Templates Yet</h3>
//                     <p className="text-muted-foreground mb-4">
//                       You haven't created any email templates yet. Visit the Templates page to create your first
//                       template.
//                     </p>
//                     <Button
//                       onClick={() => {
//                         setShowTemplateLibrary(false)
//                         onOpenChange(false)
//                         window.location.href = "/dashboard/templates"
//                       }}
//                     >
//                       Go to Templates
//                     </Button>
//                   </div>
//                 </div>
//               ) : (
//                 <TemplateLibrary
//                   templates={templates}
//                   categories={[]}
//                   userId={userId}
//                   onSelectTemplate={handleTemplateSelect}
//                   onClose={() => setShowTemplateLibrary(false)}
//                   isEmbedded={true}
//                 />
//               )}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Full Editor Dialog - Separate from main dialog */}
//       {showFullEditor && console.log("[v0] Rendering full editor dialog")}
//       <Dialog open={showFullEditor} onOpenChange={setShowFullEditor}>
//         <DialogContent className="max-w-[99vw] w-full h-[98vh] p-0 overflow-hidden flex flex-col">
//           <div className="h-full w-full overflow-auto">
//             <TemplateEditor
//               template={fullEditorTemplate}
//               categories={[]}
//               variables={[]}
//               mode="create"
//               onSave={handleFullEditorSave}
//             />
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }

// "use client"

// import { useMemo } from "react"
// import { stripHtml, hasRichFormatting } from "@/lib/utils/emails"
// import {
//   Variable,
//   Sparkles,
//   Copy,
//   Check,
//   AlertTriangle,
//   CheckCircle2,
//   FileText,
//   ChevronDown,
//   User,
//   Building2,
//   Briefcase,
//   AtSign,
//   Plus,
//   Maximize2,
//   ImageIcon,
//   Eye,
//   Pencil,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { cn } from "@/lib/utils"
// import type { SequenceStep, EnhancedEmailTemplate } from "@/lib/types/sequence"
// import { TemplateLibrary } from "@/components/templates/template-library"
// import { TemplateEditor } from "@/components/templates/template-editor"
// import { toast } from "sonner"
// import { useEffect, useState, useRef } from "react"
// import { getTemplates } from "@/lib/actions/templates"

// const SPAM_TRIGGER_WORDS = [
//   "free",
//   "guarantee",
//   "no obligation",
//   "winner",
//   "congratulations",
//   "urgent",
//   "act now",
//   "limited time",
//   "click here",
//   "buy now",
//   "order now",
//   "call now",
//   "don't delete",
//   "earn money",
//   "make money",
//   "extra income",
//   "100%",
//   "no cost",
//   "no fees",
//   "cash",
//   "credit",
//   "incredible deal",
//   "amazing",
//   "unbelievable",
// ]

// const PERSONALIZATION_VARIABLES = {
//   prospect: {
//     label: "Prospect",
//     icon: User,
//     variables: [
//       { key: "firstName", label: "First Name" },
//       { key: "lastName", label: "Last Name" },
//       { key: "fullName", label: "Full Name" },
//       { key: "email", label: "Email" },
//     ],
//   },
//   company: {
//     label: "Company",
//     icon: Building2,
//     variables: [
//       { key: "company", label: "Company Name" },
//       { key: "industry", label: "Industry" },
//       { key: "companySize", label: "Company Size" },
//     ],
//   },
//   job: {
//     label: "Job Info",
//     icon: Briefcase,
//     variables: [{ key: "jobTitle", label: "Job Title" }],
//   },
//   sender: {
//     label: "Sender",
//     icon: AtSign,
//     variables: [
//       { key: "senderName", label: "Your Name" },
//       { key: "senderCompany", label: "Your Company" },
//     ],
//   },
// }

// const AI_REWRITE_TONES = [
//   { id: "professional", label: "Professional", description: "Formal and business-appropriate" },
//   { id: "friendly", label: "Friendly", description: "Warm and approachable" },
//   { id: "persuasive", label: "Persuasive", description: "Compelling and action-oriented" },
//   { id: "concise", label: "Concise", description: "Short and to the point" },
// ]

// type EmailComposerProps = {
//   step: SequenceStep
//   onSave: (subject: string, body: string) => void
//   onClose: () => void
//   isOpen: boolean
//   onOpenChange: (open: boolean) => void
//   userId: string
//   prospect: any // Define the type of prospect if possible
// }

// export function EmailComposer({ step, onSave, onClose, isOpen, onOpenChange, userId, prospect }: EmailComposerProps) {
//   const [subject, setSubject] = useState(step?.subject || "")
//   const [body, setBody] = useState(step?.body || "") // Changed step?.content to step?.body to match SequenceStep type
//   const [showTemplateLibrary, setShowTemplateLibrary] = useState(false)
//   const [showFullEditor, setShowFullEditor] = useState(false)
//   const [templates, setTemplates] = useState<EnhancedEmailTemplate[]>([])
//   const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
//   const [currentDate, setCurrentDate] = useState("")
//   const [viewMode, setViewMode] = useState<"preview" | "edit">("preview")
//   const [fullEditorTemplate, setFullEditorTemplate] = useState({
//     id: "temp-new",
//     name: "",
//     subject: subject,
//     body: body,
//     userId: userId,
//     description: null,
//     category: null,
//     thumbnailUrl: null,
//     previewImageUrl: null,
//     colorScheme: null,
//     industry: null,
//     tags: [],
//     isSystemTemplate: false,
//     isFavorite: false,
//     isPublished: false,
//     version: 1,
//     avgOpenRate: 0,
//     avgClickRate: 0,
//     avgReplyRate: 0,
//     totalSent: 0,
//     templateType: "TEXT" as const,
//     editorBlocks: null,
//     aiGenerated: false,
//     aiModel: null,
//     aiPrompt: null,
//     aiGenerationId: null,
//     basePrompt: null,
//     editorVersion: null,
//     variables: null,
//     timesUsed: 0,
//     lastUsedAt: null,
//     viewCount: 0,
//     duplicateCount: 0,
//     createdAt: currentDate ? new Date(currentDate) : new Date(),
//     updatedAt: currentDate ? new Date(currentDate) : new Date(),
//   })
//   const [templateHasImages, setTemplateHasImages] = useState(false)

//   const subjectInputRef = useRef<HTMLInputElement | null>(null)
//   const textareaRef = useRef<HTMLTextAreaElement>(null)

//   const hasHtmlContent = useMemo(() => {
//     return /<[^>]+>/.test(body || "")
//   }, [body])

//   useEffect(() => {
//     if (hasHtmlContent) {
//       setViewMode("preview")
//     }
//   }, [hasHtmlContent])

//   useEffect(() => {
//     setCurrentDate(new Date().toISOString())
//   }, [])

//   // Sync fullEditorTemplate with current subject and body
//   useEffect(() => {
//     setFullEditorTemplate((prev) => ({
//       ...prev,
//       subject,
//       body,
//     }))
//   }, [subject, body])

//   const spamAnalysis = useMemo(() => {
//     const content = `${subject} ${body}`.toLowerCase()
//     const foundTriggers: string[] = []
//     const warnings: string[] = []

//     SPAM_TRIGGER_WORDS.forEach((word) => {
//       if (content.includes(word.toLowerCase())) {
//         foundTriggers.push(word)
//       }
//     })

//     const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length
//     if (capsRatio > 0.3) warnings.push("Excessive use of capital letters")
//     if ((content.match(/[!?]{2,}/g) || []).length > 0) warnings.push("Multiple exclamation/question marks")
//     if (subject.length > 60) warnings.push("Subject line is too long (>60 chars)")
//     if (subject.length < 20 && subject.length > 0) warnings.push("Subject line might be too short")
//     if (body.length > 2000) warnings.push("Email body is very long")
//     if (body.length < 50 && body.length > 0) warnings.push("Email body might be too short")

//     const linkCount = (body.match(/https?:\/\//g) || []).length
//     if (linkCount > 3) warnings.push("Too many links in email")

//     let score = 100
//     score -= foundTriggers.length * 10
//     score -= warnings.length * 5
//     score = Math.max(0, Math.min(100, score))

//     return { score, foundTriggers, warnings }
//   }, [subject, body])

//   const getSpamScoreColor = (score: number) => {
//     if (score >= 80) return "text-green-500"
//     if (score >= 60) return "text-yellow-500"
//     return "text-red-500"
//   }

//   const getSpamScoreLabel = (score: number) => {
//     if (score >= 80) return "Excellent"
//     if (score >= 60) return "Good"
//     if (score >= 40) return "Fair"
//     return "Poor"
//   }

//   const handleSubjectChange = (value: string) => {
//     setSubject(value)
//     setFullEditorTemplate((prev) => ({ ...prev, subject: value }))
//   }

//   const handleBodyChange = (value: string) => {
//     setBody(value)
//     setFullEditorTemplate((prev) => ({ ...prev, body: value }))
//   }

//   const handleApplyTemplate = async (template: EnhancedEmailTemplate) => {
//     console.log("[v0] handleApplyTemplate starting with template:", template.name)

//     const hasRichContent = hasRichFormatting(template.body)
//     setTemplateHasImages(hasRichContent)

//     setSubject(template.subject)

//     // This ensures images and CTA buttons work properly in sequences
//     if (step) {
//       setBody(template.body) // Preserve full HTML with images and buttons
//       toast.success(`Applied template: ${template.name}`, {
//         description: hasRichContent ? "Template includes images and buttons" : undefined,
//       })
//     } else {
//       // For standalone email composer, strip HTML for plain textarea
//       const cleanBody = stripHtml(template.body, true)
//       setBody(cleanBody)

//       if (hasRichContent) {
//         toast.info("Template contains rich formatting", {
//           description: "Images and buttons shown as placeholders. Use Full Editor to see and edit rich formatting.",
//         })
//       } else {
//         toast.success(`Applied template: ${template.name}`)
//       }
//     }

//     setShowTemplateLibrary(false)
//     console.log("[v0] Template applied successfully")
//   }

//   const handleAIRewrite = async (tone: string) => {
//     // Placeholder for AI rewrite logic
//   }

//   const insertVariable = (variable: string) => {
//     const target = textareaRef.current
//     if (!target) return

//     const start = target.selectionStart || 0
//     const end = target.selectionEnd || 0
//     const variableText = `{{${variable}}}`
//     const newBody = body.substring(0, start) + variableText + body.substring(end)

//     setBody(newBody)

//     setTimeout(() => {
//       target.focus()
//       target.setSelectionRange(start + variableText.length, start + variableText.length)
//     }, 0)
//   }

//   const handleCopyToClipboard = async () => {
//     await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`)
//     // Placeholder for processing state logic
//   }

//   const handleSave = () => {
//     onSave(subject, body)
//   }

//   const previewContent = useMemo(() => {
//     const sampleData: Record<string, string> = {
//       firstName: "John",
//       lastName: "Smith",
//       fullName: "John Smith",
//       email: "john@company.com",
//       company: "Acme Inc",
//       jobTitle: "VP of Sales",
//       industry: "Technology",
//       companySize: "50-100",
//       senderName: "Your Name",
//       senderCompany: "Your Company",
//     }

//     let previewSubject = subject
//     let previewBody = body

//     Object.entries(sampleData).forEach(([key, value]) => {
//       const regex = new RegExp(`{{${key}}}`, "gi")
//       previewSubject = previewSubject.replace(regex, value)
//       previewBody = previewBody.replace(regex, value)
//     })

//     return { subject: previewSubject, body: previewBody }
//   }, [subject, body])

//   const handleTemplateSelect = async (template: EnhancedEmailTemplate) => {
//     console.log("[v0] Template selected:", template.name)
//     console.log("[v0] About to call handleApplyTemplate")
//     await handleApplyTemplate(template)
//     console.log("[v0] handleApplyTemplate completed")
//   }

//   const handleFullEditorSave = (updatedSubject: string, updatedBody: string) => {
//     console.log("[v0] Full editor save called")
//     setSubject(updatedSubject)
//     setBody(updatedBody)
//     setShowFullEditor(false)
//     toast("Email updated from editor")
//   }

//   useEffect(() => {
//     const loadTemplates = async () => {
//       if (!userId || !showTemplateLibrary) return

//       setIsLoadingTemplates(true)
//       try {
//         const result = await getTemplates()
//         if (Array.isArray(result)) {
//           const userTemplates = result.filter(
//             (template: any) => template.userId === userId && !template.isSystemTemplate,
//           )
//           setTemplates(userTemplates as EnhancedEmailTemplate[])
//         }
//       } catch (error) {
//         console.error("Failed to load templates:", error)
//         toast("Failed to load templates")
//       } finally {
//         setIsLoadingTemplates(false)
//       }
//     }

//     loadTemplates()
//   }, [userId, showTemplateLibrary])

//   return (
//     <>
//       <Dialog open={isOpen} onOpenChange={onOpenChange}>
//         <DialogContent className="max-w-[1800px] w-[95vw] md:w-[95vw] h-[95vh] md:h-[92vh] overflow-hidden p-0">
//           <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b">
//             <div className="flex items-center justify-between">
//               <div className="flex-1 min-w-0">
//                 <DialogTitle className="text-base md:text-lg">Email Composer</DialogTitle>
//                 <DialogDescription className="text-xs md:text-sm">Compose and optimize email content</DialogDescription>
//               </div>
//               <div className="flex items-center gap-2 flex-shrink-0">
//                 <div
//                   className={cn(
//                     "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
//                     spamAnalysis.score >= 80
//                       ? "bg-green-500/10 text-green-500"
//                       : spamAnalysis.score >= 60
//                         ? "bg-yellow-500/10 text-yellow-500"
//                         : "bg-red-500/10 text-red-500",
//                   )}
//                 >
//                   {spamAnalysis.score}
//                 </div>
//                 <div className="text-xs whitespace-nowrap">
//                   <p className={cn("font-medium", getSpamScoreColor(spamAnalysis.score))}>
//                     {getSpamScoreLabel(spamAnalysis.score)}
//                   </p>
//                   <p className="text-muted-foreground">Deliverability</p>
//                 </div>
//               </div>
//             </div>
//           </DialogHeader>

//           <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
//             {/* Editor panel */}
//             <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r min-h-0">
//               {/* Toolbar - made scrollable on mobile */}
//               <div className="flex items-center justify-between border-b px-2 md:px-4 py-2 overflow-x-auto">
//                 <div className="flex items-center gap-1 flex-nowrap">
//                   {/* <TooltipProvider>
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <Button variant="ghost" size="icon" className="h-8 w-8">
//                           <Bold className="h-4 w-4" />
//                         </Button>
//                       </TooltipTrigger>
//                       <TooltipContent>Bold</TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider> */}
//                   {/* <TooltipProvider>
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <Button variant="ghost" size="icon" className="h-8 w-8">
//                           <Italic className="h-4 w-4" />
//                         </Button>
//                       </TooltipTrigger>
//                       <TooltipContent>Italic</TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider> */}
//                   {/* <TooltipProvider>
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <Button variant="ghost" size="icon" className="h-8 w-8">
//                           <Link2 className="h-4 w-4" />
//                         </Button>
//                       </TooltipTrigger>
//                       <TooltipContent>Insert Link</TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider> */}

//                   {/* <Separator orientation="vertical" className="mx-1 h-6" /> */}

//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs whitespace-nowrap">
//                         <Variable className="h-4 w-4" />
//                         <span className="hidden sm:inline">Variables</span>
//                         <ChevronDown className="h-3 w-3" />
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-72 p-0" align="start">
//                       <div className="p-3 border-b bg-muted/30">
//                         <h4 className="font-medium text-sm">Insert Variable</h4>
//                         <p className="text-xs text-muted-foreground">Click to insert at cursor</p>
//                       </div>
//                       <ScrollArea className="h-64">
//                         <div className="p-2">
//                           {Object.entries(PERSONALIZATION_VARIABLES).map(([categoryKey, category]) => {
//                             const CategoryIcon = category.icon
//                             return (
//                               <div key={categoryKey} className="mb-3 last:mb-0">
//                                 <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                                   <CategoryIcon className="h-3.5 w-3.5" />
//                                   {category.label}
//                                 </div>
//                                 {category.variables.map((v) => (
//                                   <button
//                                     key={v.key}
//                                     className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-muted transition-colors group"
//                                     onClick={() => insertVariable(v.key)}
//                                   >
//                                     <div className="flex items-center gap-2">
//                                       <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">
//                                         {`{{${v.key}}}`}
//                                       </code>
//                                       <span className="text-sm text-muted-foreground">{v.label}</span>
//                                     </div>
//                                     <Plus className="h-3.5 w-3.5 opacity-0 group-hover:opacity-50" />
//                                   </button>
//                                 ))}
//                               </div>
//                             )
//                           })}
//                         </div>
//                       </ScrollArea>
//                     </PopoverContent>
//                   </Popover>

//                   {/* Templates */}
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="h-8 gap-1 text-xs whitespace-nowrap"
//                     onClick={() => setShowTemplateLibrary(true)}
//                   >
//                     <FileText className="h-4 w-4" />
//                     <span className="hidden sm:inline">Templates</span>
//                   </Button>

//                   <Separator orientation="vertical" className="mx-1 h-6 hidden sm:block" />

//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="h-8 gap-1 text-xs whitespace-nowrap"
//                     onClick={() => {
//                       console.log("[v0] Full Editor button clicked")
//                       setShowFullEditor(true)
//                     }}
//                   >
//                     <Maximize2 className="h-4 w-4" />
//                     <span className="hidden sm:inline">Full Editor</span>
//                   </Button>

//                   {/* AI Rewrite */}
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs whitespace-nowrap">
//                         <Sparkles className="h-4 w-4" />
//                         <span className="hidden sm:inline">AI Rewrite</span>
//                         <ChevronDown className="h-3 w-3" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="start">
//                       {AI_REWRITE_TONES.map((tone) => (
//                         <DropdownMenuItem key={tone.id} onClick={() => handleAIRewrite(tone.id)}>
//                           <div>
//                             <p className="text-sm">{tone.label}</p>
//                             <p className="text-xs text-muted-foreground">{tone.description}</p>
//                           </div>
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>

//               {/* Editor content */}
//               <div className="flex-1 overflow-auto p-3 md:p-4">
//                 <div className="space-y-4 max-w-3xl mx-auto">
//                   <div className="space-y-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Subject Line</Label>
//                     <Input
//                       ref={subjectInputRef}
//                       value={subject}
//                       onChange={(e) => handleSubjectChange(e.target.value)}
//                       placeholder="Enter your subject line..."
//                       className="text-sm md:text-base"
//                     />
//                     <p className="text-xs text-muted-foreground">{subject.length}/60 characters</p>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <Label className="text-xs font-medium text-muted-foreground">Email Body</Label>
//                       {/* View mode toggle - only show when HTML content exists */}
//                       {hasHtmlContent && (
//                         <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
//                           <Button
//                             variant={viewMode === "preview" ? "default" : "ghost"}
//                             size="sm"
//                             className="h-7 px-2 text-xs gap-1"
//                             onClick={() => setViewMode("preview")}
//                           >
//                             <Eye className="h-3.5 w-3.5" />
//                             Preview
//                           </Button>
//                           <Button
//                             variant={viewMode === "edit" ? "default" : "ghost"}
//                             size="sm"
//                             className="h-7 px-2 text-xs gap-1"
//                             onClick={() => setViewMode("edit")}
//                           >
//                             <Pencil className="h-3.5 w-3.5" />
//                             Edit HTML
//                           </Button>
//                         </div>
//                       )}
//                     </div>

//                     {/* Conditional rendering based on viewMode and content type */}
//                     {hasHtmlContent && viewMode === "preview" ? (
//                       <div className="relative rounded-md border bg-white dark:bg-zinc-950">
//                         <ScrollArea className="h-[300px] md:h-[350px]">
//                           <div
//                             className="p-4 prose prose-sm dark:prose-invert max-w-none"
//                             dangerouslySetInnerHTML={{ __html: body }}
//                           />
//                         </ScrollArea>
//                         {/* Edit hint overlay */}
//                         <div className="absolute bottom-2 right-2">
//                           <Button
//                             variant="secondary"
//                             size="sm"
//                             className="h-7 text-xs gap-1 shadow-md"
//                             onClick={() => setShowFullEditor(true)}
//                           >
//                             <Pencil className="h-3 w-3" />
//                             Edit in Full Editor
//                           </Button>
//                         </div>
//                       </div>
//                     ) : (
//                       // Plain text / Edit HTML mode
//                       <Textarea
//                         ref={textareaRef}
//                         value={body}
//                         onChange={(e) => handleBodyChange(e.target.value)}
//                         placeholder="Write your email content here..."
//                         className="min-h-[250px] md:min-h-[350px] text-sm resize-none font-mono"
//                       />
//                     )}

//                     <div className="flex items-center justify-between">
//                       <p className="text-xs text-muted-foreground">{body.length} characters</p>
//                       <p className="text-xs text-muted-foreground">
//                         {(body.match(/\{\{[^}]+\}\}/g) || []).length} variables
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Side panel - Spam analysis - hidden on mobile, shown in sheet/drawer instead */}
//             <div className="hidden md:flex w-80 flex-col overflow-hidden">
//               <div className="p-4 border-b">
//                 <h4 className="font-medium text-sm">Deliverability Check</h4>
//               </div>
//               <ScrollArea className="flex-1">
//                 <div className="p-4 space-y-4">
//                   {templateHasImages && (
//                     <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
//                       <div className="flex items-start gap-3">
//                         <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
//                         <div className="flex-1">
//                           <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
//                             Rich Formatting Detected
//                           </h4>
//                           <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
//                             This template includes images and/or CTA buttons.{" "}
//                             {step
//                               ? "Full HTML is preserved for your sequence."
//                               : "Use Full Editor to see and edit rich formatting."}
//                           </p>
//                           {!step && (
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className="mt-2 border-blue-300 dark:border-blue-700 bg-transparent"
//                               onClick={() => setShowFullEditor(true)}
//                             >
//                               Open Full Editor
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   <div className="text-center py-4">
//                     <div
//                       className={cn(
//                         "inline-flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold",
//                         spamAnalysis.score >= 80
//                           ? "bg-green-500/10 text-green-500"
//                           : spamAnalysis.score >= 60
//                             ? "bg-yellow-500/10 text-yellow-500"
//                             : "bg-red-500/10 text-red-500",
//                       )}
//                     >
//                       {spamAnalysis.score}
//                     </div>
//                     <p className={cn("mt-2 font-medium", getSpamScoreColor(spamAnalysis.score))}>
//                       {getSpamScoreLabel(spamAnalysis.score)}
//                     </p>
//                     <p className="text-xs text-muted-foreground">Deliverability Score</p>
//                   </div>

//                   <Separator />

//                   {(spamAnalysis.foundTriggers.length > 0 || spamAnalysis.warnings.length > 0) && (
//                     <div className="space-y-3">
//                       <h5 className="text-xs font-medium text-muted-foreground uppercase">Issues Found</h5>

//                       {spamAnalysis.foundTriggers.length > 0 && (
//                         <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30 p-3">
//                           <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
//                             <AlertTriangle className="h-4 w-4" />
//                             <span className="text-xs font-medium">Spam trigger words</span>
//                           </div>
//                           <div className="mt-2 flex flex-wrap gap-1">
//                             {spamAnalysis.foundTriggers.map((word) => (
//                               <Badge key={word} variant="outline" className="text-[10px] bg-white dark:bg-transparent">
//                                 {word}
//                               </Badge>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {spamAnalysis.warnings.map((warning, i) => (
//                         <div key={i} className="flex items-start gap-2 rounded-lg border bg-muted/50 p-3">
//                           <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
//                           <span className="text-xs">{warning}</span>
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {spamAnalysis.foundTriggers.length === 0 && spamAnalysis.warnings.length === 0 && (
//                     <div className="flex items-center gap-2 rounded-lg border bg-green-50 dark:bg-green-950/30 p-3">
//                       <CheckCircle2 className="h-4 w-4 text-green-500" />
//                       <span className="text-xs text-green-700 dark:text-green-400">
//                         No issues found. Your email looks great!
//                       </span>
//                     </div>
//                   )}

//                   <Separator />

//                   <div className="space-y-2">
//                     <h5 className="text-xs font-medium text-muted-foreground uppercase">Best Practices</h5>
//                     <div className="space-y-2 text-xs text-muted-foreground">
//                       <div className="flex items-start gap-2">
//                         <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                         <span>Keep subject under 60 characters</span>
//                       </div>
//                       <div className="flex items-start gap-2">
//                         <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                         <span>Personalize with variables</span>
//                       </div>
//                       <div className="flex items-start gap-2">
//                         <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                         <span>Avoid spam trigger words</span>
//                       </div>
//                       <div className="flex items-start gap-2">
//                         <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                         <span>Limit to 1-2 links per email</span>
//                       </div>
//                       <div className="flex items-start gap-2">
//                         <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                         <span>Keep emails under 200 words</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </ScrollArea>
//             </div>
//           </div>

//           {/* Footer - made responsive */}
//           <div className="flex items-center justify-between border-t px-4 md:px-6 py-3 md:py-4 gap-2">
//             <Button
//               variant="outline"
//               onClick={handleCopyToClipboard}
//               className="gap-2 shadow-sm bg-transparent"
//               size="sm"
//             >
//               <Copy className="h-4 w-4" />
//               <span className="hidden sm:inline">Copy</span>
//             </Button>
//             <div className="flex items-center gap-2">
//               <Button variant="outline" onClick={onClose} className="shadow-sm bg-transparent" size="sm">
//                 Cancel
//               </Button>
//               <Button onClick={handleSave} className="gap-2 shadow-sm" size="sm">
//                 <Check className="h-4 w-4" />
//                 <span className="hidden sm:inline">Save Changes</span>
//                 <span className="sm:hidden">Save</span>
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Template Library Dialog */}
//       <Dialog open={showTemplateLibrary} onOpenChange={setShowTemplateLibrary}>
//         <DialogContent className="max-w-[1800px] w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col">
//           <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
//             <DialogTitle>Choose Email Template</DialogTitle>
//             <DialogDescription>Select from your saved templates</DialogDescription>
//           </DialogHeader>
//           {userId && (
//             <div className="flex-1 overflow-auto p-6">
//               {isLoadingTemplates ? (
//                 <div className="flex items-center justify-center h-full">
//                   <div className="text-muted-foreground">Loading templates...</div>
//                 </div>
//               ) : templates.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full gap-4">
//                   <div className="text-center">
//                     <h3 className="text-lg font-semibold mb-2">No Templates Yet</h3>
//                     <p className="text-muted-foreground mb-4">
//                       You haven't created any email templates yet. Visit the Templates page to create your first
//                       template.
//                     </p>
//                     <Button
//                       onClick={() => {
//                         setShowTemplateLibrary(false)
//                         onOpenChange(false)
//                         window.location.href = "/dashboard/templates"
//                       }}
//                     >
//                       Go to Templates
//                     </Button>
//                   </div>
//                 </div>
//               ) : (
//                 <TemplateLibrary
//                   templates={templates}
//                   categories={[]}
//                   userId={userId}
//                   onSelectTemplate={handleTemplateSelect}
//                   onClose={() => setShowTemplateLibrary(false)}
//                   isEmbedded={true}
//                 />
//               )}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Full Editor Dialog - Separate from main dialog */}
//       {showFullEditor && console.log("[v0] Rendering full editor dialog")}
//       <Dialog open={showFullEditor} onOpenChange={setShowFullEditor}>
//         <DialogContent className="max-w-[99vw] w-full h-[98vh] p-0 overflow-hidden flex flex-col">
//           <div className="h-full w-full overflow-auto">
//             <TemplateEditor
//               template={fullEditorTemplate}
//               categories={[]}
//               variables={[]}
//               mode="create"
//               onSave={handleFullEditorSave}
//             />
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }

"use client"

import { useMemo } from "react"
import { stripHtml, hasRichFormatting } from "@/lib/utils/emails"
import {
  Variable,
  Sparkles,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ChevronDown,
  User,
  Building2,
  Briefcase,
  AtSign,
  Plus,
  Maximize2,
  ImageIcon,
  Eye,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { SequenceStep, EnhancedEmailTemplate } from "@/lib/types/sequence"
import { TemplateLibrary } from "@/components/templates/template-library"
import { TemplateEditor } from "@/components/templates/template-editor"
import { toast } from "sonner"
import { useEffect, useState, useRef } from "react"
import { getTemplates } from "@/lib/actions/templates"

const SPAM_TRIGGER_WORDS = [
  "free",
  "guarantee",
  "no obligation",
  "winner",
  "congratulations",
  "urgent",
  "act now",
  "limited time",
  "click here",
  "buy now",
  "order now",
  "call now",
  "don't delete",
  "earn money",
  "make money",
  "extra income",
  "100%",
  "no cost",
  "no fees",
  "cash",
  "credit",
  "incredible deal",
  "amazing",
  "unbelievable",
]

const PERSONALIZATION_VARIABLES = {
  prospect: {
    label: "Prospect",
    icon: User,
    variables: [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "fullName", label: "Full Name" },
      { key: "email", label: "Email" },
    ],
  },
  company: {
    label: "Company",
    icon: Building2,
    variables: [
      { key: "company", label: "Company Name" },
      { key: "industry", label: "Industry" },
      { key: "companySize", label: "Company Size" },
    ],
  },
  job: {
    label: "Job Info",
    icon: Briefcase,
    variables: [{ key: "jobTitle", label: "Job Title" }],
  },
  sender: {
    label: "Sender",
    icon: AtSign,
    variables: [
      { key: "senderName", label: "Your Name" },
      { key: "senderCompany", label: "Your Company" },
    ],
  },
}

const AI_REWRITE_TONES = [
  { id: "professional", label: "Professional", description: "Formal and business-appropriate" },
  { id: "friendly", label: "Friendly", description: "Warm and approachable" },
  { id: "persuasive", label: "Persuasive", description: "Compelling and action-oriented" },
  { id: "concise", label: "Concise", description: "Short and to the point" },
]

type EmailComposerProps = {
  step: SequenceStep
  onSave: (subject: string, body: string) => void
  onClose: () => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  prospect: any // Define the type of prospect if possible
}

export function EmailComposer({ step, onSave, onClose, isOpen, onOpenChange, userId, prospect }: EmailComposerProps) {
  const [subject, setSubject] = useState(step?.subject || "")
  const [body, setBody] = useState(step?.body || "") // Changed step?.content to step?.body to match SequenceStep type
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false)
  const [showFullEditor, setShowFullEditor] = useState(false)
  const [templates, setTemplates] = useState<EnhancedEmailTemplate[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [currentDate, setCurrentDate] = useState("")
  const [viewMode, setViewMode] = useState<"preview" | "edit">("preview")
  const [fullEditorTemplate, setFullEditorTemplate] = useState({
    id: "temp-new",
    name: "",
    subject: subject,
    body: body,
    userId: userId,
    description: null,
    category: null,
    thumbnailUrl: null,
    previewImageUrl: null,
    colorScheme: null,
    industry: null,
    tags: [],
    isSystemTemplate: false,
    isFavorite: false,
    isPublished: false,
    version: 1,
    avgOpenRate: 0,
    avgClickRate: 0,
    avgReplyRate: 0,
    totalSent: 0,
    templateType: "TEXT" as const,
    editorBlocks: null,
    aiGenerated: false,
    aiModel: null,
    aiPrompt: null,
    aiGenerationId: null,
    basePrompt: null,
    editorVersion: null,
    variables: null,
    timesUsed: 0,
    lastUsedAt: null,
    viewCount: 0,
    duplicateCount: 0,
    createdAt: currentDate ? new Date(currentDate) : new Date(),
    updatedAt: currentDate ? new Date(currentDate) : new Date(),
  })
  const [templateHasImages, setTemplateHasImages] = useState(false)

  const subjectInputRef = useRef<HTMLInputElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const hasHtmlContent = useMemo(() => {
    return /<[^>]+>/.test(body || "")
  }, [body])

  useEffect(() => {
    if (hasHtmlContent) {
      setViewMode("preview")
    }
  }, [hasHtmlContent])

  useEffect(() => {
    setCurrentDate(new Date().toISOString())
  }, [])

  // Sync fullEditorTemplate with current subject and body
  useEffect(() => {
    setFullEditorTemplate((prev) => ({
      ...prev,
      subject,
      body,
    }))
  }, [subject, body])

  const spamAnalysis = useMemo(() => {
    const content = `${subject} ${body}`.toLowerCase()
    const foundTriggers: string[] = []
    const warnings: string[] = []

    SPAM_TRIGGER_WORDS.forEach((word) => {
      if (content.includes(word.toLowerCase())) {
        foundTriggers.push(word)
      }
    })

    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length
    if (capsRatio > 0.3) warnings.push("Excessive use of capital letters")
    if ((content.match(/[!?]{2,}/g) || []).length > 0) warnings.push("Multiple exclamation/question marks")
    if (subject.length > 60) warnings.push("Subject line is too long (>60 chars)")
    if (subject.length < 20 && subject.length > 0) warnings.push("Subject line might be too short")
    if (body.length > 2000) warnings.push("Email body is very long")
    if (body.length < 50 && body.length > 0) warnings.push("Email body might be too short")

    const linkCount = (body.match(/https?:\/\//g) || []).length
    if (linkCount > 3) warnings.push("Too many links in email")

    let score = 100
    score -= foundTriggers.length * 10
    score -= warnings.length * 5
    score = Math.max(0, Math.min(100, score))

    return { score, foundTriggers, warnings }
  }, [subject, body])

  const getSpamScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getSpamScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Poor"
  }

  const handleSubjectChange = (value: string) => {
    setSubject(value)
    setFullEditorTemplate((prev) => ({ ...prev, subject: value }))
  }

  const handleBodyChange = (value: string) => {
    setBody(value)
    setFullEditorTemplate((prev) => ({ ...prev, body: value }))
  }

  const handleApplyTemplate = async (template: EnhancedEmailTemplate) => {
    console.log("[v0] handleApplyTemplate starting with template:", template.name)

    const hasRichContent = hasRichFormatting(template.body)
    setTemplateHasImages(hasRichContent)

    setSubject(template.subject)

    // This ensures images and CTA buttons work properly in sequences
    if (step) {
      setBody(template.body) // Preserve full HTML with images and buttons
      toast.success(`Applied template: ${template.name}`, {
        description: hasRichContent ? "Template includes images and buttons" : undefined,
      })
    } else {
      // For standalone email composer, strip HTML for plain textarea
      const cleanBody = stripHtml(template.body, true)
      setBody(cleanBody)

      if (hasRichContent) {
        toast.info("Template contains rich formatting", {
          description: "Images and buttons shown as placeholders. Use Full Editor to see and edit rich formatting.",
        })
      } else {
        toast.success(`Applied template: ${template.name}`)
      }
    }

    setShowTemplateLibrary(false)
    console.log("[v0] Template applied successfully")
  }

  const handleAIRewrite = async (tone: string) => {
    // Placeholder for AI rewrite logic
  }

  const insertVariable = (variable: string) => {
    const target = textareaRef.current
    if (!target) return

    const start = target.selectionStart || 0
    const end = target.selectionEnd || 0
    const variableText = `{{${variable}}}`
    const newBody = body.substring(0, start) + variableText + body.substring(end)

    setBody(newBody)

    setTimeout(() => {
      target.focus()
      target.setSelectionRange(start + variableText.length, start + variableText.length)
    }, 0)
  }

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`)
    // Placeholder for processing state logic
  }

  const handleSave = () => {
    onSave(subject, body)
  }

  const previewContent = useMemo(() => {
    const sampleData: Record<string, string> = {
      firstName: "John",
      lastName: "Smith",
      fullName: "John Smith",
      email: "john@company.com",
      company: "Acme Inc",
      jobTitle: "VP of Sales",
      industry: "Technology",
      companySize: "50-100",
      senderName: "Your Name",
      senderCompany: "Your Company",
    }

    let previewSubject = subject
    let previewBody = body

    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "gi")
      previewSubject = previewSubject.replace(regex, value)
      previewBody = previewBody.replace(regex, value)
    })

    return { subject: previewSubject, body: previewBody }
  }, [subject, body])

  const handleTemplateSelect = async (template: EnhancedEmailTemplate) => {
    console.log("[v0] Template selected:", template.name)
    console.log("[v0] About to call handleApplyTemplate")
    await handleApplyTemplate(template)
    console.log("[v0] handleApplyTemplate completed")
  }

  const handleFullEditorSave = (updatedSubject: string, updatedBody: string) => {
    console.log("[v0] Full editor save called")
    setSubject(updatedSubject)
    setBody(updatedBody)
    setShowFullEditor(false)
    toast("Email updated from editor")
  }

  useEffect(() => {
    const loadTemplates = async () => {
      if (!userId || !showTemplateLibrary) return

      setIsLoadingTemplates(true)
      try {
        const result = await getTemplates()
        if (Array.isArray(result)) {
          const userTemplates = result.filter(
            (template: any) => template.userId === userId && !template.isSystemTemplate,
          )
          setTemplates(userTemplates as EnhancedEmailTemplate[])
        }
      } catch (error) {
        console.error("Failed to load templates:", error)
        toast("Failed to load templates")
      } finally {
        setIsLoadingTemplates(false)
      }
    }

    loadTemplates()
  }, [userId, showTemplateLibrary])

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[98vw] w-[95vw] sm:w-[90vw] lg:w-[95vw] xl:w-[98vw] h-[95vh] md:h-[92vh] overflow-hidden p-0">
          <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base md:text-lg">Email Composer</DialogTitle>
                <DialogDescription className="text-xs md:text-sm">Compose and optimize email content</DialogDescription>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                    spamAnalysis.score >= 80
                      ? "bg-green-500/10 text-green-500"
                      : spamAnalysis.score >= 60
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-red-500/10 text-red-500",
                  )}
                >
                  {spamAnalysis.score}
                </div>
                <div className="text-xs whitespace-nowrap">
                  <p className={cn("font-medium", getSpamScoreColor(spamAnalysis.score))}>
                    {getSpamScoreLabel(spamAnalysis.score)}
                  </p>
                  <p className="text-muted-foreground">Deliverability</p>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Editor panel */}
            <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r min-h-0">
              {/* Toolbar - made scrollable on mobile */}
              <div className="flex items-center justify-between border-b px-2 md:px-4 py-2 overflow-x-auto">
                <div className="flex items-center gap-1 flex-nowrap">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs whitespace-nowrap">
                        <Variable className="h-4 w-4" />
                        <span className="hidden sm:inline">Variables</span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-0" align="start">
                      <div className="p-3 border-b bg-muted/30">
                        <h4 className="font-medium text-sm">Insert Variable</h4>
                        <p className="text-xs text-muted-foreground">Click to insert at cursor</p>
                      </div>
                      <ScrollArea className="h-64">
                        <div className="p-2">
                          {Object.entries(PERSONALIZATION_VARIABLES).map(([categoryKey, category]) => {
                            const CategoryIcon = category.icon
                            return (
                              <div key={categoryKey} className="mb-3 last:mb-0">
                                <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  <CategoryIcon className="h-3.5 w-3.5" />
                                  {category.label}
                                </div>
                                {category.variables.map((v) => (
                                  <button
                                    key={v.key}
                                    className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-muted transition-colors group"
                                    onClick={() => insertVariable(v.key)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">
                                        {`{{${v.key}}}`}
                                      </code>
                                      <span className="text-sm text-muted-foreground">{v.label}</span>
                                    </div>
                                    <Plus className="h-3.5 w-3.5 opacity-0 group-hover:opacity-50" />
                                  </button>
                                ))}
                              </div>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>

                  {/* Templates */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-xs whitespace-nowrap"
                    onClick={() => setShowTemplateLibrary(true)}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Templates</span>
                  </Button>

                  <Separator orientation="vertical" className="mx-1 h-6 hidden sm:block" />

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-xs whitespace-nowrap"
                    onClick={() => {
                      console.log("[v0] Full Editor button clicked")
                      setShowFullEditor(true)
                    }}
                  >
                    <Maximize2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Full Editor</span>
                  </Button>

                  {/* AI Rewrite */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs whitespace-nowrap">
                        <Sparkles className="h-4 w-4" />
                        <span className="hidden sm:inline">AI Rewrite</span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {AI_REWRITE_TONES.map((tone) => (
                        <DropdownMenuItem key={tone.id} onClick={() => handleAIRewrite(tone.id)}>
                          <div>
                            <p className="text-sm">{tone.label}</p>
                            <p className="text-xs text-muted-foreground">{tone.description}</p>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Editor content */}
              <div className="flex-1 overflow-auto p-3 md:p-4">
                <div className="space-y-4 max-w-3xl mx-auto">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Subject Line</Label>
                    <Input
                      ref={subjectInputRef}
                      value={subject}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      placeholder="Enter your subject line..."
                      className="text-sm md:text-base"
                    />
                    <p className="text-xs text-muted-foreground">{subject.length}/60 characters</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-muted-foreground">Email Body</Label>
                      {/* View mode toggle - only show when HTML content exists */}
                      {hasHtmlContent && (
                        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
                          <Button
                            variant={viewMode === "preview" ? "default" : "ghost"}
                            size="sm"
                            className="h-7 px-2 text-xs gap-1"
                            onClick={() => setViewMode("preview")}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Preview
                          </Button>
                          <Button
                            variant={viewMode === "edit" ? "default" : "ghost"}
                            size="sm"
                            className="h-7 px-2 text-xs gap-1"
                            onClick={() => setViewMode("edit")}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit HTML
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Conditional rendering based on viewMode and content type */}
                    {hasHtmlContent && viewMode === "preview" ? (
                      <div className="relative rounded-md border bg-white dark:bg-zinc-950">
                        <ScrollArea className="h-[300px] md:h-[350px]">
                          <div
                            className="p-4 prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: body }}
                          />
                        </ScrollArea>
                        {/* Edit hint overlay */}
                        <div className="absolute bottom-2 right-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-7 text-xs gap-1 shadow-md"
                            onClick={() => setShowFullEditor(true)}
                          >
                            <Pencil className="h-3 w-3" />
                            Edit in Full Editor
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Plain text / Edit HTML mode
                      <Textarea
                        ref={textareaRef}
                        value={body}
                        onChange={(e) => handleBodyChange(e.target.value)}
                        placeholder="Write your email content here..."
                        className="min-h-[250px] md:min-h-[350px] text-sm resize-none font-mono"
                      />
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{body.length} characters</p>
                      <p className="text-xs text-muted-foreground">
                        {(body.match(/\{\{[^}]+\}\}/g) || []).length} variables
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side panel - Spam analysis - hidden on mobile, shown in sheet/drawer instead */}
            <div className="hidden lg:flex w-80 xl:w-96 flex-col overflow-hidden border-l">
              <div className="p-4 border-b">
                <h4 className="font-medium text-sm">Deliverability Check</h4>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {templateHasImages && (
                    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-start gap-3">
                        <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Rich Formatting Detected
                          </h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            This template includes images and/or CTA buttons.{" "}
                            {step
                              ? "Full HTML is preserved for your sequence."
                              : "Use Full Editor to see and edit rich formatting."}
                          </p>
                          {!step && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 border-blue-300 dark:border-blue-700 bg-transparent"
                              onClick={() => setShowFullEditor(true)}
                            >
                              Open Full Editor
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-center py-4">
                    <div
                      className={cn(
                        "inline-flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold",
                        spamAnalysis.score >= 80
                          ? "bg-green-500/10 text-green-500"
                          : spamAnalysis.score >= 60
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-red-500/10 text-red-500",
                      )}
                    >
                      {spamAnalysis.score}
                    </div>
                    <p className={cn("mt-2 font-medium", getSpamScoreColor(spamAnalysis.score))}>
                      {getSpamScoreLabel(spamAnalysis.score)}
                    </p>
                    <p className="text-xs text-muted-foreground">Deliverability Score</p>
                  </div>

                  <Separator />

                  {(spamAnalysis.foundTriggers.length > 0 || spamAnalysis.warnings.length > 0) && (
                    <div className="space-y-3">
                      <h5 className="text-xs font-medium text-muted-foreground uppercase">Issues Found</h5>

                      {spamAnalysis.foundTriggers.length > 0 && (
                        <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30 p-3">
                          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-xs font-medium">Spam trigger words</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {spamAnalysis.foundTriggers.map((word) => (
                              <Badge key={word} variant="outline" className="text-[10px] bg-white dark:bg-transparent">
                                {word}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {spamAnalysis.warnings.map((warning, i) => (
                        <div key={i} className="flex items-start gap-2 rounded-lg border bg-muted/50 p-3">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                          <span className="text-xs">{warning}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {spamAnalysis.foundTriggers.length === 0 && spamAnalysis.warnings.length === 0 && (
                    <div className="flex items-center gap-2 rounded-lg border bg-green-50 dark:bg-green-950/30 p-3">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-700 dark:text-green-400">
                        No issues found. Your email looks great!
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-muted-foreground uppercase">Best Practices</h5>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
                        <span>Keep subject under 60 characters</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
                        <span>Personalize with variables</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
                        <span>Avoid spam trigger words</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
                        <span>Limit to 1-2 links per email</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
                        <span>Keep emails under 200 words</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Footer - made responsive */}
          <div className="flex items-center justify-between border-t px-4 md:px-6 py-3 md:py-4 gap-2">
            <Button
              variant="outline"
              onClick={handleCopyToClipboard}
              className="gap-2 shadow-sm bg-transparent"
              size="sm"
            >
              <Copy className="h-4 w-4" />
              <span className="hidden sm:inline">Copy</span>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose} className="shadow-sm bg-transparent" size="sm">
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2 shadow-sm" size="sm">
                <Check className="h-4 w-4" />
                <span className="hidden sm:inline">Save Changes</span>
                <span className="sm:hidden">Save</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Library Dialog */}
      <Dialog open={showTemplateLibrary} onOpenChange={setShowTemplateLibrary}>
        <DialogContent className="max-w-[98vw] w-[95vw] sm:w-[90vw] lg:w-[95vw] xl:w-[98vw] h-[90vh] sm:h-[85vh] lg:h-[90vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle>Choose Email Template</DialogTitle>
            <DialogDescription>Select from your saved templates</DialogDescription>
          </DialogHeader>
          {userId && (
            <div className="flex-1 overflow-auto p-6">
              {isLoadingTemplates ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-muted-foreground">Loading templates...</div>
                </div>
              ) : templates.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">No Templates Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't created any email templates yet. Visit the Templates page to create your first
                      template.
                    </p>
                    <Button
                      onClick={() => {
                        setShowTemplateLibrary(false)
                        onOpenChange(false)
                        window.location.href = "/dashboard/templates"
                      }}
                    >
                      Go to Templates
                    </Button>
                  </div>
                </div>
              ) : (
                <TemplateLibrary
                  templates={templates}
                  categories={[]}
                  userId={userId}
                  onSelectTemplate={handleTemplateSelect}
                  onClose={() => setShowTemplateLibrary(false)}
                  isEmbedded={true}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Full Editor Dialog - Separate from main dialog */}
      {showFullEditor && console.log("[v0] Rendering full editor dialog")}
      <Dialog open={showFullEditor} onOpenChange={setShowFullEditor}>
        <DialogContent className="max-w-[99vw] w-[98vw] sm:w-[95vw] lg:w-[98vw] xl:w-[99vw] h-[98vh] sm:h-[95vh] lg:h-[98vh] p-0 overflow-hidden flex flex-col">
          <div className="h-full w-full overflow-auto">
            <TemplateEditor
              template={fullEditorTemplate}
              categories={[]}
              variables={[]}
              mode="create"
              onSave={handleFullEditorSave}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}