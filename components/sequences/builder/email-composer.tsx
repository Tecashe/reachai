// "use client"

// import * as React from "react"
// import {
//   Bold,
//   Italic,
//   Link2,
//   Variable,
//   Sparkles,
//   Eye,
//   Smartphone,
//   Monitor,
//   Copy,
//   Check,
//   AlertTriangle,
//   CheckCircle2,
//   Loader2,
//   Undo2,
//   Redo2,
//   FileText,
//   ChevronDown,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { cn } from "@/lib/utils"
// import { DEFAULT_PERSONALIZATION_VARIABLES, type SequenceStep } from "@/lib/types/sequence"
// import { TooltipProvider } from "@/components/ui/tooltip"

// interface EmailComposerProps {
//   step: SequenceStep
//   onSave: (subject: string, body: string) => void
//   onClose: () => void
// }

// // Spam trigger words to check against
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

// // Email templates
// const EMAIL_TEMPLATES = [
//   {
//     id: "cold-intro",
//     name: "Cold Introduction",
//     category: "Outreach",
//     subject: "Quick question about {{company}}",
//     body: `Hi {{firstName}},

// I came across {{company}} and was impressed by your work in the industry.

// I'm reaching out because we help companies like yours [brief value prop].

// Would you be open to a quick 15-minute chat to see if there's a fit?

// Best,
// {{senderName}}`,
//   },
//   {
//     id: "follow-up-1",
//     name: "First Follow-up",
//     category: "Follow-up",
//     subject: "Re: Quick question about {{company}}",
//     body: `Hi {{firstName}},

// I wanted to follow up on my previous email. I know you're busy, so I'll keep this brief.

// [One-liner about value prop]

// Would a quick call this week work for you?

// Best,
// {{senderName}}`,
//   },
//   {
//     id: "value-add",
//     name: "Value-Add Touch",
//     category: "Nurture",
//     subject: "Thought you might find this useful",
//     body: `Hi {{firstName}},

// I came across [relevant resource/article/case study] and thought of {{company}}.

// [Brief insight about why it's relevant]

// Would love to hear your thoughts!

// Best,
// {{senderName}}`,
//   },
//   {
//     id: "breakup",
//     name: "Breakup Email",
//     category: "Follow-up",
//     subject: "Should I close your file?",
//     body: `Hi {{firstName}},

// I've reached out a few times but haven't heard back, which is totally fine.

// I'll assume the timing isn't right and will close out your file.

// If things change in the future, feel free to reach out.

// Best,
// {{senderName}}`,
//   },
//   {
//     id: "meeting-request",
//     name: "Meeting Request",
//     category: "Outreach",
//     subject: "15 min to discuss {{company}}'s [goal]",
//     body: `Hi {{firstName}},

// I've been following {{company}}'s growth and have some ideas on how we could help you [achieve specific goal].

// Would you be open to a brief 15-minute call this week to explore this?

// Here are a few times that work on my end: [suggest 2-3 times]

// Best,
// {{senderName}}`,
//   },
//   {
//     id: "referral",
//     name: "Referral Request",
//     category: "Outreach",
//     subject: "Who handles [area] at {{company}}?",
//     body: `Hi {{firstName}},

// I'm trying to connect with the person who handles [specific area] at {{company}}.

// Would you be able to point me in the right direction?

// Thanks in advance!

// Best,
// {{senderName}}`,
//   },
// ]

// const AI_REWRITE_TONES = [
//   { id: "professional", label: "Professional", description: "Formal and business-appropriate" },
//   { id: "friendly", label: "Friendly", description: "Warm and approachable" },
//   { id: "persuasive", label: "Persuasive", description: "Compelling and action-oriented" },
//   { id: "concise", label: "Concise", description: "Short and to the point" },
//   { id: "detailed", label: "Detailed", description: "Comprehensive with more context" },
// ]

// export function EmailComposer({ step, onSave, onClose }: EmailComposerProps) {
//   const [subject, setSubject] = React.useState(step.subject || "")
//   const [body, setBody] = React.useState(step.body || "")
//   const [viewMode, setViewMode] = React.useState<"edit" | "preview">("edit")
//   const [previewDevice, setPreviewDevice] = React.useState<"desktop" | "mobile">("desktop")
//   const [showTemplates, setShowTemplates] = React.useState(false)
//   const [isRewriting, setIsRewriting] = React.useState(false)
//   const [isCopied, setIsCopied] = React.useState(false)

//   // History for undo/redo
//   const [history, setHistory] = React.useState<{ subject: string; body: string }[]>([{ subject, body }])
//   const [historyIndex, setHistoryIndex] = React.useState(0)

//   const bodyRef = React.useRef<HTMLTextAreaElement>(null)
//   const subjectRef = React.useRef<HTMLInputElement>(null)

//   // Calculate spam score
//   const spamAnalysis = React.useMemo(() => {
//     const content = `${subject} ${body}`.toLowerCase()
//     const foundTriggers: string[] = []
//     const warnings: string[] = []

//     // Check for spam words
//     SPAM_TRIGGER_WORDS.forEach((word) => {
//       if (content.includes(word.toLowerCase())) {
//         foundTriggers.push(word)
//       }
//     })

//     // Check for excessive caps
//     const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length
//     if (capsRatio > 0.3) {
//       warnings.push("Excessive use of capital letters")
//     }

//     // Check for excessive punctuation
//     if ((content.match(/[!?]{2,}/g) || []).length > 0) {
//       warnings.push("Multiple exclamation/question marks")
//     }

//     // Check subject length
//     if (subject.length > 60) {
//       warnings.push("Subject line is too long (>60 chars)")
//     }
//     if (subject.length < 20 && subject.length > 0) {
//       warnings.push("Subject line might be too short")
//     }

//     // Check body length
//     if (body.length > 2000) {
//       warnings.push("Email body is very long")
//     }
//     if (body.length < 50 && body.length > 0) {
//       warnings.push("Email body might be too short")
//     }

//     // Check for links
//     const linkCount = (body.match(/https?:\/\//g) || []).length
//     if (linkCount > 3) {
//       warnings.push("Too many links in email")
//     }

//     // Calculate score (0-100, higher is better)
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

//   const addToHistory = (newSubject: string, newBody: string) => {
//     const newHistory = history.slice(0, historyIndex + 1)
//     newHistory.push({ subject: newSubject, body: newBody })
//     setHistory(newHistory)
//     setHistoryIndex(newHistory.length - 1)
//   }

//   const handleUndo = () => {
//     if (historyIndex > 0) {
//       const prev = history[historyIndex - 1]
//       setSubject(prev.subject)
//       setBody(prev.body)
//       setHistoryIndex(historyIndex - 1)
//     }
//   }

//   const handleRedo = () => {
//     if (historyIndex < history.length - 1) {
//       const next = history[historyIndex + 1]
//       setSubject(next.subject)
//       setBody(next.body)
//       setHistoryIndex(historyIndex + 1)
//     }
//   }

//   const handleSubjectChange = (value: string) => {
//     setSubject(value)
//     addToHistory(value, body)
//   }

//   const handleBodyChange = (value: string) => {
//     setBody(value)
//     addToHistory(subject, value)
//   }

//   const handleApplyTemplate = (template: (typeof EMAIL_TEMPLATES)[0]) => {
//     setSubject(template.subject)
//     setBody(template.body)
//     addToHistory(template.subject, template.body)
//     setShowTemplates(false)
//   }

//   const handleAIRewrite = async (tone: string) => {
//     setIsRewriting(true)
//     // Simulate AI rewrite - in production, this would call an AI API
//     await new Promise((resolve) => setTimeout(resolve, 1500))

//     // For demo, just add a note about the tone
//     const rewrittenBody = `[Rewritten in ${tone} tone]\n\n${body}`
//     setBody(rewrittenBody)
//     addToHistory(subject, rewrittenBody)
//     setIsRewriting(false)
//   }

//   const insertVariable = (variable: string) => {
//     const target = bodyRef.current
//     if (!target) return

//     const start = target.selectionStart || 0
//     const end = target.selectionEnd || 0
//     const variableText = `{{${variable}}}`
//     const newBody = body.substring(0, start) + variableText + body.substring(end)

//     setBody(newBody)
//     addToHistory(subject, newBody)

//     setTimeout(() => {
//       target.focus()
//       target.setSelectionRange(start + variableText.length, start + variableText.length)
//     }, 0)
//   }

//   const handleCopyToClipboard = async () => {
//     await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`)
//     setIsCopied(true)
//     setTimeout(() => setIsCopied(false), 2000)
//   }

//   const handleSave = () => {
//     onSave(subject, body)
//   }

//   // Preview with sample data
//   const previewContent = React.useMemo(() => {
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

//   return (
//     <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0">
//         <DialogHeader className="px-6 py-4 border-b">
//           <div className="flex items-center justify-between">
//             <div>
//               <DialogTitle>Email Composer</DialogTitle>
//               <DialogDescription>Create and optimize your email content with AI assistance</DialogDescription>
//             </div>
//             <div className="flex items-center gap-2">
//               {/* Spam score indicator */}
//               <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5">
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
//                 <div className="text-xs">
//                   <p className={cn("font-medium", getSpamScoreColor(spamAnalysis.score))}>
//                     {getSpamScoreLabel(spamAnalysis.score)}
//                   </p>
//                   <p className="text-muted-foreground">Deliverability</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </DialogHeader>

//         <div className="flex-1 flex overflow-hidden">
//           {/* Editor panel */}
//           <div className="flex-1 flex flex-col border-r">
//             {/* Toolbar */}
//             <div className="flex items-center justify-between border-b px-4 py-2">
//               <div className="flex items-center gap-1">
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8"
//                         onClick={handleUndo}
//                         disabled={historyIndex === 0}
//                       >
//                         <Undo2 className="h-4 w-4" />
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>Undo</TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8"
//                         onClick={handleRedo}
//                         disabled={historyIndex === history.length - 1}
//                       >
//                         <Redo2 className="h-4 w-4" />
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>Redo</TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>

//                 <Separator orientation="vertical" className="mx-1 h-6" />

//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button variant="ghost" size="icon" className="h-8 w-8">
//                         <Bold className="h-4 w-4" />
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>Bold</TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button variant="ghost" size="icon" className="h-8 w-8">
//                         <Italic className="h-4 w-4" />
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>Italic</TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button variant="ghost" size="icon" className="h-8 w-8">
//                         <Link2 className="h-4 w-4" />
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>Insert Link</TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>

//                 <Separator orientation="vertical" className="mx-1 h-6" />

//                 {/* Variable dropdown */}
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
//                       <Variable className="h-4 w-4" />
//                       Variables
//                       <ChevronDown className="h-3 w-3" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="start" className="w-64">
//                     {Object.entries(DEFAULT_PERSONALIZATION_VARIABLES).map(([category, vars]) => (
//                       <React.Fragment key={category}>
//                         <DropdownMenuItem disabled className="text-xs font-medium uppercase text-muted-foreground">
//                           {category}
//                         </DropdownMenuItem>
//                         {vars.map((v) => (
//                           <DropdownMenuItem key={v.key} className="text-xs" onClick={() => insertVariable(v.key)}>
//                             <span className="font-mono text-primary">{`{{${v.key}}}`}</span>
//                             <span className="ml-2 text-muted-foreground">{v.label}</span>
//                           </DropdownMenuItem>
//                         ))}
//                         <DropdownMenuSeparator />
//                       </React.Fragment>
//                     ))}
//                   </DropdownMenuContent>
//                 </DropdownMenu>

//                 {/* Templates */}
//                 <Popover open={showTemplates} onOpenChange={setShowTemplates}>
//                   <PopoverTrigger asChild>
//                     <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
//                       <FileText className="h-4 w-4" />
//                       Templates
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-80 p-0" align="start">
//                     <div className="p-3 border-b">
//                       <h4 className="font-medium text-sm">Email Templates</h4>
//                       <p className="text-xs text-muted-foreground">Choose a template to get started quickly</p>
//                     </div>
//                     <ScrollArea className="h-64">
//                       <div className="p-2 space-y-1">
//                         {EMAIL_TEMPLATES.map((template) => (
//                           <button
//                             key={template.id}
//                             className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors"
//                             onClick={() => handleApplyTemplate(template)}
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="text-sm font-medium">{template.name}</span>
//                               <Badge variant="outline" className="text-[10px]">
//                                 {template.category}
//                               </Badge>
//                             </div>
//                             <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{template.subject}</p>
//                           </button>
//                         ))}
//                       </div>
//                     </ScrollArea>
//                   </PopoverContent>
//                 </Popover>

//                 {/* AI Rewrite */}
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
//                       {isRewriting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
//                       AI Rewrite
//                       <ChevronDown className="h-3 w-3" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="start">
//                     {AI_REWRITE_TONES.map((tone) => (
//                       <DropdownMenuItem key={tone.id} onClick={() => handleAIRewrite(tone.id)} disabled={isRewriting}>
//                         <div>
//                           <p className="text-sm">{tone.label}</p>
//                           <p className="text-xs text-muted-foreground">{tone.description}</p>
//                         </div>
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>

//               <div className="flex items-center gap-1">
//                 <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "edit" | "preview")}>
//                   <TabsList className="h-8">
//                     <TabsTrigger value="edit" className="h-7 px-3 text-xs">
//                       Edit
//                     </TabsTrigger>
//                     <TabsTrigger value="preview" className="h-7 px-3 text-xs">
//                       <Eye className="mr-1 h-3 w-3" />
//                       Preview
//                     </TabsTrigger>
//                   </TabsList>
//                 </Tabs>
//               </div>
//             </div>

//             {/* Editor content */}
//             <div className="flex-1 overflow-auto p-4">
//               {viewMode === "edit" ? (
//                 <div className="space-y-4 max-w-2xl mx-auto">
//                   <div className="space-y-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Subject Line</Label>
//                     <Input
//                       ref={subjectRef}
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
//                       ref={bodyRef}
//                       value={body}
//                       onChange={(e) => handleBodyChange(e.target.value)}
//                       placeholder="Write your email content here..."
//                       className="min-h-[300px] text-sm resize-none font-mono"
//                     />
//                     <p className="text-xs text-muted-foreground">{body.length} characters</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="max-w-2xl mx-auto">
//                   <div className="flex justify-center mb-4">
//                     <div className="inline-flex rounded-lg border p-1">
//                       <Button
//                         variant={previewDevice === "desktop" ? "secondary" : "ghost"}
//                         size="sm"
//                         className="h-7 px-3"
//                         onClick={() => setPreviewDevice("desktop")}
//                       >
//                         <Monitor className="mr-1 h-3 w-3" />
//                         Desktop
//                       </Button>
//                       <Button
//                         variant={previewDevice === "mobile" ? "secondary" : "ghost"}
//                         size="sm"
//                         className="h-7 px-3"
//                         onClick={() => setPreviewDevice("mobile")}
//                       >
//                         <Smartphone className="mr-1 h-3 w-3" />
//                         Mobile
//                       </Button>
//                     </div>
//                   </div>

//                   <div
//                     className={cn(
//                       "mx-auto rounded-lg border bg-white shadow-sm overflow-hidden",
//                       previewDevice === "mobile" ? "max-w-[375px]" : "max-w-full",
//                     )}
//                   >
//                     <div className="border-b bg-muted/30 px-4 py-3">
//                       <p className="text-sm font-medium text-foreground">{previewContent.subject}</p>
//                       <p className="text-xs text-muted-foreground">To: john@company.com</p>
//                     </div>
//                     <div className="p-4">
//                       <pre className="whitespace-pre-wrap text-sm font-sans text-foreground">{previewContent.body}</pre>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Side panel - Spam analysis */}
//           <div className="w-72 flex flex-col overflow-hidden">
//             <div className="p-4 border-b">
//               <h4 className="font-medium text-sm">Deliverability Check</h4>
//             </div>
//             <ScrollArea className="flex-1">
//               <div className="p-4 space-y-4">
//                 {/* Score */}
//                 <div className="text-center py-4">
//                   <div
//                     className={cn(
//                       "inline-flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold",
//                       spamAnalysis.score >= 80
//                         ? "bg-green-500/10 text-green-500"
//                         : spamAnalysis.score >= 60
//                           ? "bg-yellow-500/10 text-yellow-500"
//                           : "bg-red-500/10 text-red-500",
//                     )}
//                   >
//                     {spamAnalysis.score}
//                   </div>
//                   <p className={cn("mt-2 font-medium", getSpamScoreColor(spamAnalysis.score))}>
//                     {getSpamScoreLabel(spamAnalysis.score)}
//                   </p>
//                   <p className="text-xs text-muted-foreground">Deliverability Score</p>
//                 </div>

//                 <Separator />

//                 {/* Warnings */}
//                 {(spamAnalysis.foundTriggers.length > 0 || spamAnalysis.warnings.length > 0) && (
//                   <div className="space-y-3">
//                     <h5 className="text-xs font-medium text-muted-foreground uppercase">Issues Found</h5>

//                     {spamAnalysis.foundTriggers.length > 0 && (
//                       <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30 p-3">
//                         <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
//                           <AlertTriangle className="h-4 w-4" />
//                           <span className="text-xs font-medium">Spam trigger words</span>
//                         </div>
//                         <div className="mt-2 flex flex-wrap gap-1">
//                           {spamAnalysis.foundTriggers.map((word) => (
//                             <Badge key={word} variant="outline" className="text-[10px] bg-white dark:bg-transparent">
//                               {word}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {spamAnalysis.warnings.map((warning, i) => (
//                       <div key={i} className="flex items-start gap-2 rounded-lg border bg-muted/50 p-3">
//                         <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
//                         <span className="text-xs">{warning}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {spamAnalysis.foundTriggers.length === 0 && spamAnalysis.warnings.length === 0 && (
//                   <div className="flex items-center gap-2 rounded-lg border bg-green-50 dark:bg-green-950/30 p-3">
//                     <CheckCircle2 className="h-4 w-4 text-green-500" />
//                     <span className="text-xs text-green-700 dark:text-green-400">
//                       No issues found. Your email looks great!
//                     </span>
//                   </div>
//                 )}

//                 <Separator />

//                 {/* Best practices */}
//                 <div className="space-y-2">
//                   <h5 className="text-xs font-medium text-muted-foreground uppercase">Best Practices</h5>
//                   <div className="space-y-2 text-xs text-muted-foreground">
//                     <div className="flex items-start gap-2">
//                       <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                       <span>Keep subject under 60 characters</span>
//                     </div>
//                     <div className="flex items-start gap-2">
//                       <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                       <span>Personalize with variables</span>
//                     </div>
//                     <div className="flex items-start gap-2">
//                       <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                       <span>Avoid spam trigger words</span>
//                     </div>
//                     <div className="flex items-start gap-2">
//                       <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                       <span>Limit to 1-2 links per email</span>
//                     </div>
//                     <div className="flex items-start gap-2">
//                       <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                       <span>Keep emails under 200 words</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </ScrollArea>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-between border-t px-6 py-4">
//           <Button variant="outline" onClick={handleCopyToClipboard} className="gap-2 bg-transparent">
//             {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//             {isCopied ? "Copied!" : "Copy"}
//           </Button>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button onClick={handleSave} className="gap-2">
//               <Check className="h-4 w-4" />
//               Save Changes
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

// "use client"

// import * as React from "react"
// import {
//   Bold,
//   Italic,
//   Link2,
//   Variable,
//   Sparkles,
//   Eye,
//   Smartphone,
//   Monitor,
//   Copy,
//   Check,
//   AlertTriangle,
//   CheckCircle2,
//   Undo2,
//   Redo2,
//   FileText,
//   ChevronDown,
//   User,
//   Building2,
//   Briefcase,
//   AtSign,
//   Plus,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { cn } from "@/lib/utils"
// import type { SequenceStep } from "@/lib/types/sequence"
// import { WaveLoader } from "@/components/loader/wave-loader"

// interface EmailComposerProps {
//   step: SequenceStep
//   onSave: (subject: string, body: string) => void
//   onClose: () => void
// }

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

// const EMAIL_TEMPLATES = [
//   {
//     id: "cold-intro",
//     name: "Cold Introduction",
//     category: "Outreach",
//     subject: "Quick question about {{company}}",
//     body: `Hi {{firstName}},

// I came across {{company}} and was impressed by your work in the industry.

// I'm reaching out because we help companies like yours [brief value prop].

// Would you be open to a quick 15-minute chat to see if there's a fit?

// Best,
// {{senderName}}`,
//   },
//   {
//     id: "follow-up-1",
//     name: "First Follow-up",
//     category: "Follow-up",
//     subject: "Re: Quick question about {{company}}",
//     body: `Hi {{firstName}},

// I wanted to follow up on my previous email. I know you're busy, so I'll keep this brief.

// [One-liner about value prop]

// Would a quick call this week work for you?

// Best,
// {{senderName}}`,
//   },
//   {
//     id: "value-add",
//     name: "Value-Add Touch",
//     category: "Nurture",
//     subject: "Thought you might find this useful",
//     body: `Hi {{firstName}},

// I came across [relevant resource/article/case study] and thought of {{company}}.

// [Brief insight about why it's relevant]

// Would love to hear your thoughts!

// Best,
// {{senderName}}`,
//   },
//   {
//     id: "breakup",
//     name: "Breakup Email",
//     category: "Follow-up",
//     subject: "Should I close your file?",
//     body: `Hi {{firstName}},

// I've reached out a few times but haven't heard back, which is totally fine.

// I'll assume the timing isn't right and will close out your file.

// If things change in the future, feel free to reach out.

// Best,
// {{senderName}}`,
//   },
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

// export function EmailComposer({ step, onSave, onClose }: EmailComposerProps) {
//   const [subject, setSubject] = React.useState(step.subject || "")
//   const [body, setBody] = React.useState(step.body || "")
//   const [viewMode, setViewMode] = React.useState<"edit" | "preview">("edit")
//   const [previewDevice, setPreviewDevice] = React.useState<"desktop" | "mobile">("desktop")
//   const [showTemplates, setShowTemplates] = React.useState(false)
//   const [isRewriting, setIsRewriting] = React.useState(false)
//   const [isCopied, setIsCopied] = React.useState(false)

//   const [history, setHistory] = React.useState<{ subject: string; body: string }[]>([{ subject, body }])
//   const [historyIndex, setHistoryIndex] = React.useState(0)

//   const bodyRef = React.useRef<HTMLTextAreaElement>(null)
//   const subjectRef = React.useRef<HTMLInputElement>(null)

//   const spamAnalysis = React.useMemo(() => {
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

//   const addToHistory = (newSubject: string, newBody: string) => {
//     const newHistory = history.slice(0, historyIndex + 1)
//     newHistory.push({ subject: newSubject, body: newBody })
//     setHistory(newHistory)
//     setHistoryIndex(newHistory.length - 1)
//   }

//   const handleUndo = () => {
//     if (historyIndex > 0) {
//       const prev = history[historyIndex - 1]
//       setSubject(prev.subject)
//       setBody(prev.body)
//       setHistoryIndex(historyIndex - 1)
//     }
//   }

//   const handleRedo = () => {
//     if (historyIndex < history.length - 1) {
//       const next = history[historyIndex + 1]
//       setSubject(next.subject)
//       setBody(next.body)
//       setHistoryIndex(historyIndex + 1)
//     }
//   }

//   const handleSubjectChange = (value: string) => {
//     setSubject(value)
//     addToHistory(value, body)
//   }

//   const handleBodyChange = (value: string) => {
//     setBody(value)
//     addToHistory(subject, value)
//   }

//   const handleApplyTemplate = (template: (typeof EMAIL_TEMPLATES)[0]) => {
//     setSubject(template.subject)
//     setBody(template.body)
//     addToHistory(template.subject, template.body)
//     setShowTemplates(false)
//   }

//   const handleAIRewrite = async (tone: string) => {
//     setIsRewriting(true)
//     await new Promise((resolve) => setTimeout(resolve, 1500))
//     const rewrittenBody = `[Rewritten in ${tone} tone]\n\n${body}`
//     setBody(rewrittenBody)
//     addToHistory(subject, rewrittenBody)
//     setIsRewriting(false)
//   }

//   const insertVariable = (variable: string) => {
//     const target = bodyRef.current
//     if (!target) return

//     const start = target.selectionStart || 0
//     const end = target.selectionEnd || 0
//     const variableText = `{{${variable}}}`
//     const newBody = body.substring(0, start) + variableText + body.substring(end)

//     setBody(newBody)
//     addToHistory(subject, newBody)

//     setTimeout(() => {
//       target.focus()
//       target.setSelectionRange(start + variableText.length, start + variableText.length)
//     }, 0)
//   }

//   const handleCopyToClipboard = async () => {
//     await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`)
//     setIsCopied(true)
//     setTimeout(() => setIsCopied(false), 2000)
//   }

//   const handleSave = () => {
//     onSave(subject, body)
//   }

//   const previewContent = React.useMemo(() => {
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

//   return (
//     <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="max-w-[1400px] w-[95vw] h-[90vh] flex flex-col p-0 gap-0">
//         <DialogHeader className="px-6 py-4 border-b">
//           <div className="flex items-center justify-between">
//             <div>
//               <DialogTitle>Email Composer</DialogTitle>
//               <DialogDescription>Create and optimize your email content with AI assistance</DialogDescription>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5">
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
//                 <div className="text-xs">
//                   <p className={cn("font-medium", getSpamScoreColor(spamAnalysis.score))}>
//                     {getSpamScoreLabel(spamAnalysis.score)}
//                   </p>
//                   <p className="text-muted-foreground">Deliverability</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </DialogHeader>

//         <div className="flex-1 flex overflow-hidden">
//           {/* Editor panel */}
//           <div className="flex-1 flex flex-col border-r">
//             {/* Toolbar */}
//             <div className="flex items-center justify-between border-b px-4 py-2">
//               <div className="flex items-center gap-1">
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8"
//                         onClick={handleUndo}
//                         disabled={historyIndex === 0}
//                       >
//                         <Undo2 className="h-4 w-4" />
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>Undo</TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8"
//                         onClick={handleRedo}
//                         disabled={historyIndex === history.length - 1}
//                       >
//                         <Redo2 className="h-4 w-4" />
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>Redo</TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>

//                 <Separator orientation="vertical" className="mx-1 h-6" />

//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button variant="ghost" size="icon" className="h-8 w-8">
//                         <Bold className="h-4 w-4" />
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>Bold</TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button variant="ghost" size="icon" className="h-8 w-8">
//                         <Italic className="h-4 w-4" />
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>Italic</TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button variant="ghost" size="icon" className="h-8 w-8">
//                         <Link2 className="h-4 w-4" />
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>Insert Link</TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>

//                 <Separator orientation="vertical" className="mx-1 h-6" />

//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
//                       <Variable className="h-4 w-4" />
//                       Variables
//                       <ChevronDown className="h-3 w-3" />
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-72 p-0" align="start">
//                     <div className="p-3 border-b bg-muted/30">
//                       <h4 className="font-medium text-sm">Insert Variable</h4>
//                       <p className="text-xs text-muted-foreground">Click to insert at cursor</p>
//                     </div>
//                     <ScrollArea className="h-64">
//                       <div className="p-2">
//                         {Object.entries(PERSONALIZATION_VARIABLES).map(([categoryKey, category]) => {
//                           const CategoryIcon = category.icon
//                           return (
//                             <div key={categoryKey} className="mb-3 last:mb-0">
//                               <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                                 <CategoryIcon className="h-3.5 w-3.5" />
//                                 {category.label}
//                               </div>
//                               {category.variables.map((v) => (
//                                 <button
//                                   key={v.key}
//                                   className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-muted transition-colors group"
//                                   onClick={() => insertVariable(v.key)}
//                                 >
//                                   <div className="flex items-center gap-2">
//                                     <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">
//                                       {`{{${v.key}}}`}
//                                     </code>
//                                     <span className="text-sm text-muted-foreground">{v.label}</span>
//                                   </div>
//                                   <Plus className="h-3.5 w-3.5 opacity-0 group-hover:opacity-50" />
//                                 </button>
//                               ))}
//                             </div>
//                           )
//                         })}
//                       </div>
//                     </ScrollArea>
//                   </PopoverContent>
//                 </Popover>

//                 {/* Templates */}
//                 <Popover open={showTemplates} onOpenChange={setShowTemplates}>
//                   <PopoverTrigger asChild>
//                     <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
//                       <FileText className="h-4 w-4" />
//                       Templates
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-80 p-0" align="start">
//                     <div className="p-3 border-b">
//                       <h4 className="font-medium text-sm">Email Templates</h4>
//                       <p className="text-xs text-muted-foreground">Choose a template to get started quickly</p>
//                     </div>
//                     <ScrollArea className="h-64">
//                       <div className="p-2 space-y-1">
//                         {EMAIL_TEMPLATES.map((template) => (
//                           <button
//                             key={template.id}
//                             className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors"
//                             onClick={() => handleApplyTemplate(template)}
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="text-sm font-medium">{template.name}</span>
//                               <Badge variant="outline" className="text-[10px]">
//                                 {template.category}
//                               </Badge>
//                             </div>
//                             <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{template.subject}</p>
//                           </button>
//                         ))}
//                       </div>
//                     </ScrollArea>
//                   </PopoverContent>
//                 </Popover>

//                 {/* AI Rewrite */}
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
//                       {isRewriting ? <WaveLoader size="sm" bars={8} gap="tight" /> : <Sparkles className="h-4 w-4" />}
//                       AI Rewrite
//                       <ChevronDown className="h-3 w-3" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="start">
//                     {AI_REWRITE_TONES.map((tone) => (
//                       <DropdownMenuItem key={tone.id} onClick={() => handleAIRewrite(tone.id)} disabled={isRewriting}>
//                         <div>
//                           <p className="text-sm">{tone.label}</p>
//                           <p className="text-xs text-muted-foreground">{tone.description}</p>
//                         </div>
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>

//               <div className="flex items-center gap-1">
//                 <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "edit" | "preview")}>
//                   <TabsList className="h-8">
//                     <TabsTrigger value="edit" className="h-7 px-3 text-xs">
//                       Edit
//                     </TabsTrigger>
//                     <TabsTrigger value="preview" className="h-7 px-3 text-xs">
//                       <Eye className="mr-1 h-3 w-3" />
//                       Preview
//                     </TabsTrigger>
//                   </TabsList>
//                 </Tabs>
//               </div>
//             </div>

//             {/* Editor content */}
//             <div className="flex-1 overflow-auto p-4">
//               {viewMode === "edit" ? (
//                 <div className="space-y-4 max-w-3xl mx-auto">
//                   <div className="space-y-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Subject Line</Label>
//                     <Input
//                       ref={subjectRef}
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
//                       ref={bodyRef}
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
//               ) : (
//                 <div className="max-w-3xl mx-auto">
//                   <div className="flex justify-center mb-4">
//                     <div className="inline-flex rounded-lg border p-1">
//                       <Button
//                         variant={previewDevice === "desktop" ? "secondary" : "ghost"}
//                         size="sm"
//                         className="h-7 px-3"
//                         onClick={() => setPreviewDevice("desktop")}
//                       >
//                         <Monitor className="mr-1 h-3 w-3" />
//                         Desktop
//                       </Button>
//                       <Button
//                         variant={previewDevice === "mobile" ? "secondary" : "ghost"}
//                         size="sm"
//                         className="h-7 px-3"
//                         onClick={() => setPreviewDevice("mobile")}
//                       >
//                         <Smartphone className="mr-1 h-3 w-3" />
//                         Mobile
//                       </Button>
//                     </div>
//                   </div>

//                   <div
//                     className={cn(
//                       "mx-auto rounded-lg border bg-white dark:bg-card shadow-sm overflow-hidden",
//                       previewDevice === "mobile" ? "max-w-[375px]" : "max-w-full",
//                     )}
//                   >
//                     <div className="border-b bg-muted/30 px-4 py-3">
//                       <p className="text-sm font-medium text-foreground">{previewContent.subject}</p>
//                       <p className="text-xs text-muted-foreground">To: john@company.com</p>
//                     </div>
//                     <div className="p-4">
//                       <pre className="whitespace-pre-wrap text-sm font-sans text-foreground">{previewContent.body}</pre>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Side panel - Spam analysis */}
//           <div className="w-80 flex flex-col overflow-hidden">
//             <div className="p-4 border-b">
//               <h4 className="font-medium text-sm">Deliverability Check</h4>
//             </div>
//             <ScrollArea className="flex-1">
//               <div className="p-4 space-y-4">
//                 <div className="text-center py-4">
//                   <div
//                     className={cn(
//                       "inline-flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold",
//                       spamAnalysis.score >= 80
//                         ? "bg-green-500/10 text-green-500"
//                         : spamAnalysis.score >= 60
//                           ? "bg-yellow-500/10 text-yellow-500"
//                           : "bg-red-500/10 text-red-500",
//                     )}
//                   >
//                     {spamAnalysis.score}
//                   </div>
//                   <p className={cn("mt-2 font-medium", getSpamScoreColor(spamAnalysis.score))}>
//                     {getSpamScoreLabel(spamAnalysis.score)}
//                   </p>
//                   <p className="text-xs text-muted-foreground">Deliverability Score</p>
//                 </div>

//                 <Separator />

//                 {(spamAnalysis.foundTriggers.length > 0 || spamAnalysis.warnings.length > 0) && (
//                   <div className="space-y-3">
//                     <h5 className="text-xs font-medium text-muted-foreground uppercase">Issues Found</h5>

//                     {spamAnalysis.foundTriggers.length > 0 && (
//                       <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30 p-3">
//                         <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
//                           <AlertTriangle className="h-4 w-4" />
//                           <span className="text-xs font-medium">Spam trigger words</span>
//                         </div>
//                         <div className="mt-2 flex flex-wrap gap-1">
//                           {spamAnalysis.foundTriggers.map((word) => (
//                             <Badge key={word} variant="outline" className="text-[10px] bg-white dark:bg-transparent">
//                               {word}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {spamAnalysis.warnings.map((warning, i) => (
//                       <div key={i} className="flex items-start gap-2 rounded-lg border bg-muted/50 p-3">
//                         <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
//                         <span className="text-xs">{warning}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {spamAnalysis.foundTriggers.length === 0 && spamAnalysis.warnings.length === 0 && (
//                   <div className="flex items-center gap-2 rounded-lg border bg-green-50 dark:bg-green-950/30 p-3">
//                     <CheckCircle2 className="h-4 w-4 text-green-500" />
//                     <span className="text-xs text-green-700 dark:text-green-400">
//                       No issues found. Your email looks great!
//                     </span>
//                   </div>
//                 )}

//                 <Separator />

//                 <div className="space-y-2">
//                   <h5 className="text-xs font-medium text-muted-foreground uppercase">Best Practices</h5>
//                   <div className="space-y-2 text-xs text-muted-foreground">
//                     <div className="flex items-start gap-2">
//                       <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                       <span>Keep subject under 60 characters</span>
//                     </div>
//                     <div className="flex items-start gap-2">
//                       <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                       <span>Personalize with variables</span>
//                     </div>
//                     <div className="flex items-start gap-2">
//                       <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                       <span>Avoid spam trigger words</span>
//                     </div>
//                     <div className="flex items-start gap-2">
//                       <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                       <span>Limit to 1-2 links per email</span>
//                     </div>
//                     <div className="flex items-start gap-2">
//                       <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500" />
//                       <span>Keep emails under 200 words</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </ScrollArea>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-between border-t px-6 py-4">
//           <Button variant="outline" onClick={handleCopyToClipboard} className="gap-2 shadow-sm bg-transparent">
//             {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//             {isCopied ? "Copied!" : "Copy"}
//           </Button>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" onClick={onClose} className="shadow-sm bg-transparent">
//               Cancel
//             </Button>
//             <Button onClick={handleSave} className="gap-2 shadow-sm">
//               <Check className="h-4 w-4" />
//               Save Changes
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client"

import * as React from "react"
import {
  Bold,
  Italic,
  Link2,
  Variable,
  Sparkles,
  Eye,
  Smartphone,
  Monitor,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  Undo2,
  Redo2,
  FileText,
  ChevronDown,
  User,
  Building2,
  Briefcase,
  AtSign,
  Plus,
  Maximize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { SequenceStep } from "@/lib/types/sequence"
import { WaveLoader } from "@/components/loader/wave-loader"
import { trackTemplateUsage } from "@/lib/actions/template-actions"
import { TemplateLibrary } from "@/components/templates/template-library"

interface EmailComposerProps {
  step: SequenceStep
  onSave: (subject: string, body: string) => void
  onClose: () => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  userId?: string
  prospect?: any
}

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

const EMAIL_TEMPLATES = [
  {
    id: "cold-intro",
    name: "Cold Introduction",
    category: "Outreach",
    subject: "Quick question about {{company}}",
    body: `Hi {{firstName}},

I came across {{company}} and was impressed by your work in the industry.

I'm reaching out because we help companies like yours [brief value prop].

Would you be open to a quick 15-minute chat to see if there's a fit?

Best,
{{senderName}}`,
  },
  {
    id: "follow-up-1",
    name: "First Follow-up",
    category: "Follow-up",
    subject: "Re: Quick question about {{company}}",
    body: `Hi {{firstName}},

I wanted to follow up on my previous email. I know you're busy, so I'll keep this brief.

[One-liner about value prop]

Would a quick call this week work for you?

Best,
{{senderName}}`,
  },
  {
    id: "value-add",
    name: "Value-Add Touch",
    category: "Nurture",
    subject: "Thought you might find this useful",
    body: `Hi {{firstName}},

I came across [relevant resource/article/case study] and thought of {{company}}.

[Brief insight about why it's relevant]

Would love to hear your thoughts!

Best,
{{senderName}}`,
  },
  {
    id: "breakup",
    name: "Breakup Email",
    category: "Follow-up",
    subject: "Should I close your file?",
    body: `Hi {{firstName}},

I've reached out a few times but haven't heard back, which is totally fine.

I'll assume the timing isn't right and will close out your file.

If things change in the future, feel free to reach out.

Best,
{{senderName}}`,
  },
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

export function EmailComposer({ step, onSave, onClose, isOpen, onOpenChange, userId, prospect }: EmailComposerProps) {
  const [subject, setSubject] = React.useState(step.subject || "")
  const [body, setBody] = React.useState(step.body || "")
  const [viewMode, setViewMode] = React.useState<"edit" | "preview">("edit")
  const [previewDevice, setPreviewDevice] = React.useState<"desktop" | "mobile">("desktop")
  const [showTemplateLibrary, setShowTemplateLibrary] = React.useState(false)
  const [showFullEditor, setShowFullEditor] = React.useState(false)
  const [isRewriting, setIsRewriting] = React.useState(false)
  const [isCopied, setIsCopied] = React.useState(false)

  const [history, setHistory] = React.useState<{ subject: string; body: string }[]>([{ subject, body }])
  const [historyIndex, setHistoryIndex] = React.useState(0)

  const bodyRef = React.useRef<HTMLTextAreaElement>(null)
  const subjectRef = React.useRef<HTMLInputElement>(null)

  const spamAnalysis = React.useMemo(() => {
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

  const addToHistory = (newSubject: string, newBody: string) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ subject: newSubject, body: newBody })
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1]
      setSubject(prev.subject)
      setBody(prev.body)
      setHistoryIndex(historyIndex - 1)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1]
      setSubject(next.subject)
      setBody(next.body)
      setHistoryIndex(historyIndex + 1)
    }
  }

  const handleSubjectChange = (value: string) => {
    setSubject(value)
    addToHistory(value, body)
  }

  const handleBodyChange = (value: string) => {
    setBody(value)
    addToHistory(subject, value)
  }

  const handleApplyTemplate = async (template: any) => {
    console.log("[v0] handleApplyTemplate started")
    console.log("[v0] Template subject:", template.subject)
    console.log("[v0] Template body:", template.body)

    setIsRewriting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let processedSubject = template.subject
    let processedBody = template.body

    if (prospect) {
      console.log("[v0] Processing variables with prospect data")
      const variableMap: Record<string, string> = {
        firstName: prospect.firstName || "",
        lastName: prospect.lastName || "",
        fullName: `${prospect.firstName || ""} ${prospect.lastName || ""}`.trim(),
        email: prospect.email || "",
        company: prospect.companyName || "",
        companyName: prospect.companyName || "",
        title: prospect.title || "",
        industry: prospect.industry || "",
        senderName: "Your Name",
        senderCompany: "Your Company",
      }

      Object.entries(variableMap).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, "g")
        processedSubject = processedSubject.replace(regex, value)
        processedBody = processedBody.replace(regex, value)
      })
    }

    if (userId && template.id && template.id !== "custom") {
      console.log("[v0] Tracking template usage")
      await trackTemplateUsage(userId, template.id)
    }

    console.log("[v0] Setting subject to:", processedSubject)
    console.log("[v0] Setting body to:", processedBody.substring(0, 100) + "...")

    setSubject(processedSubject)
    setBody(processedBody)
    addToHistory(processedSubject, processedBody)
    setShowTemplateLibrary(false)
    setIsRewriting(false)

    console.log("[v0] handleApplyTemplate completed")
  }

  const handleAIRewrite = async (tone: string) => {
    setIsRewriting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const rewrittenBody = `[Rewritten in ${tone} tone]\n\n${body}`
    setBody(rewrittenBody)
    addToHistory(subject, rewrittenBody)
    setIsRewriting(false)
  }

  const insertVariable = (variable: string) => {
    const target = bodyRef.current
    if (!target) return

    const start = target.selectionStart || 0
    const end = target.selectionEnd || 0
    const variableText = `{{${variable}}}`
    const newBody = body.substring(0, start) + variableText + body.substring(end)

    setBody(newBody)
    addToHistory(subject, newBody)

    setTimeout(() => {
      target.focus()
      target.setSelectionRange(start + variableText.length, start + variableText.length)
    }, 0)
  }

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleSave = () => {
    onSave(subject, body)
  }

  const previewContent = React.useMemo(() => {
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

  const handleTemplateSelect = async (template: any) => {
    console.log("[v0] Template selected:", template.name)
    console.log("[v0] About to call handleApplyTemplate")
    await handleApplyTemplate(template)
    console.log("[v0] handleApplyTemplate completed")
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[1400px] max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Email Composer</DialogTitle>
                <DialogDescription>Create and optimize your email content with AI assistance</DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5">
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
                  <div className="text-xs">
                    <p className={cn("font-medium", getSpamScoreColor(spamAnalysis.score))}>
                      {getSpamScoreLabel(spamAnalysis.score)}
                    </p>
                    <p className="text-muted-foreground">Deliverability</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 flex overflow-hidden">
            {/* Editor panel */}
            <div className="flex-1 flex flex-col border-r">
              {/* Toolbar */}
              <div className="flex items-center justify-between border-b px-4 py-2">
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleUndo}
                          disabled={historyIndex === 0}
                        >
                          <Undo2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Undo</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleRedo}
                          disabled={historyIndex === history.length - 1}
                        >
                          <Redo2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Redo</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Separator orientation="vertical" className="mx-1 h-6" />

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Bold className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bold</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Italic className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Italic</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Link2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Insert Link</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Separator orientation="vertical" className="mx-1 h-6" />

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                        <Variable className="h-4 w-4" />
                        Variables
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
                    className="h-8 gap-1 text-xs"
                    onClick={() => setShowTemplateLibrary(true)}
                  >
                    <FileText className="h-4 w-4" />
                    Templates
                  </Button>

                  <Separator orientation="vertical" className="mx-1 h-6" />

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-xs"
                    onClick={() => {
                      console.log("[v0] Full Editor button clicked")
                      setShowFullEditor(true)
                    }}
                  >
                    <Maximize2 className="h-4 w-4" />
                    Full Editor
                  </Button>

                  {/* AI Rewrite */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                        {isRewriting ? <WaveLoader size="sm" bars={8} gap="tight" /> : <Sparkles className="h-4 w-4" />}
                        AI Rewrite
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {AI_REWRITE_TONES.map((tone) => (
                        <DropdownMenuItem key={tone.id} onClick={() => handleAIRewrite(tone.id)} disabled={isRewriting}>
                          <div>
                            <p className="text-sm">{tone.label}</p>
                            <p className="text-xs text-muted-foreground">{tone.description}</p>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-1">
                  <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "edit" | "preview")}>
                    <TabsList className="h-8">
                      <TabsTrigger value="edit" className="h-7 px-3 text-xs">
                        Edit
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="h-7 px-3 text-xs">
                        <Eye className="mr-1 h-3 w-3" />
                        Preview
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {/* Editor content */}
              <div className="flex-1 overflow-auto p-4">
                {viewMode === "edit" ? (
                  <div className="space-y-4 max-w-3xl mx-auto">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">Subject Line</Label>
                      <Input
                        ref={subjectRef}
                        value={subject}
                        onChange={(e) => handleSubjectChange(e.target.value)}
                        placeholder="Enter your subject line..."
                        className="text-base"
                      />
                      <p className="text-xs text-muted-foreground">{subject.length}/60 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">Email Body</Label>
                      <Textarea
                        ref={bodyRef}
                        value={body}
                        onChange={(e) => handleBodyChange(e.target.value)}
                        placeholder="Write your email content here..."
                        className="min-h-[350px] text-sm resize-none font-mono"
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{body.length} characters</p>
                        <p className="text-xs text-muted-foreground">
                          {(body.match(/\{\{[^}]+\}\}/g) || []).length} variables
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto">
                    <div className="flex justify-center mb-4">
                      <div className="inline-flex rounded-lg border p-1">
                        <Button
                          variant={previewDevice === "desktop" ? "secondary" : "ghost"}
                          size="sm"
                          className="h-7 px-3"
                          onClick={() => setPreviewDevice("desktop")}
                        >
                          <Monitor className="mr-1 h-3 w-3" />
                          Desktop
                        </Button>
                        <Button
                          variant={previewDevice === "mobile" ? "secondary" : "ghost"}
                          size="sm"
                          className="h-7 px-3"
                          onClick={() => setPreviewDevice("mobile")}
                        >
                          <Smartphone className="mr-1 h-3 w-3" />
                          Mobile
                        </Button>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "mx-auto rounded-lg border bg-white dark:bg-card shadow-sm overflow-hidden",
                        previewDevice === "mobile" ? "max-w-[375px]" : "max-w-full",
                      )}
                    >
                      <div className="border-b bg-muted/30 px-4 py-3">
                        <p className="text-sm font-medium text-foreground">{previewContent.subject}</p>
                        <p className="text-xs text-muted-foreground">To: john@company.com</p>
                      </div>
                      <div className="p-4">
                        <pre className="whitespace-pre-wrap text-sm font-sans text-foreground">
                          {previewContent.body}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Side panel - Spam analysis */}
            <div className="w-80 flex flex-col overflow-hidden">
              <div className="p-4 border-b">
                <h4 className="font-medium text-sm">Deliverability Check</h4>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
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

          {/* Footer */}
          <div className="flex items-center justify-between border-t px-6 py-4">
            <Button variant="outline" onClick={handleCopyToClipboard} className="gap-2 shadow-sm bg-transparent">
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {isCopied ? "Copied!" : "Copy"}
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose} className="shadow-sm bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2 shadow-sm">
                <Check className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Library Dialog */}
      <Dialog open={showTemplateLibrary} onOpenChange={setShowTemplateLibrary}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-6">
          <DialogHeader>
            <DialogTitle>Template Library</DialogTitle>
            <DialogDescription>Choose a template to get started</DialogDescription>
          </DialogHeader>
          {userId && (
            <TemplateLibrary
              userId={userId}
              onSelectTemplate={handleTemplateSelect}
              onClose={() => setShowTemplateLibrary(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Full Editor Dialog */}
      <Dialog open={showFullEditor} onOpenChange={setShowFullEditor}>
        <DialogContent className="max-w-[1200px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Full Screen Editor</DialogTitle>
            <DialogDescription>Edit your email with more space and tools</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="full-subject">Subject Line</Label>
              <Input
                id="full-subject"
                value={subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="full-body">Email Body</Label>
              <Textarea
                id="full-body"
                value={body}
                onChange={(e) => handleBodyChange(e.target.value)}
                className="mt-2 min-h-[400px] font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowFullEditor(false)}>
              Close
            </Button>
            <Button onClick={() => setShowFullEditor(false)}>Apply</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
