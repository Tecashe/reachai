// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import {
//   X,
//   Pencil,
//   Copy,
//   Smartphone,
//   Monitor,
//   Tablet,
//   Star,
//   Clock,
//   Eye,
//   TrendingUp,
//   Mail,
//   Sparkles,
// } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Separator } from "@/components/ui/separator"
// import { cn } from "@/lib/utils"
// import type { EnhancedEmailTemplate } from "@/lib/types"

// interface TemplatePreviewDialogProps {
//   template: EnhancedEmailTemplate | null
//   open: boolean
//   onOpenChange: (open: boolean) => void
// }

// type DevicePreview = "desktop" | "tablet" | "mobile"

// export function TemplatePreviewDialog({ template, open, onOpenChange }: TemplatePreviewDialogProps) {
//   const router = useRouter()
//   const [devicePreview, setDevicePreview] = useState<DevicePreview>("desktop")

//   if (!template) return null

//   const openRate = template.avgOpenRate ?? 0
//   const replyRate = template.avgReplyRate ?? 0

//   const getDeviceWidth = () => {
//     switch (devicePreview) {
//       case "mobile":
//         return "max-w-[375px]"
//       case "tablet":
//         return "max-w-[768px]"
//       default:
//         return "max-w-full"
//     }
//   }//

//   const renderContent = () => {
//     if (!template.body) {
//       return <div className="flex items-center justify-center h-64 text-muted-foreground">No content to preview</div>
//     }

//     if (template.body.includes("<") && (template.body.includes("</") || template.body.includes("/>"))) {
//       return (
//         <div
//           className="prose prose-sm dark:prose-invert max-w-none"
//           dangerouslySetInnerHTML={{ __html: template.body }}
//         />
//       )
//     }

//     return <div className="whitespace-pre-wrap text-sm leading-relaxed">{template.body}</div>
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-5xl h-[90vh] p-0 gap-0 overflow-hidden">
//         {/* Header */}
//         <DialogHeader className="px-6 py-4 border-b border-border/50 flex-shrink-0">
//           <div className="flex items-start justify-between gap-4">
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 mb-1">
//                 {template.aiGenerated && (
//                   <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10">
//                     <Sparkles className="w-3 h-3 text-primary" />
//                     <span className="text-[10px] font-medium text-primary">AI</span>
//                   </div>
//                 )}
//                 {template.category && (
//                   <Badge variant="secondary" className="text-xs">
//                     {template.category}
//                   </Badge>
//                 )}
//                 {template.isFavorite && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
//               </div>
//               <DialogTitle className="text-xl font-semibold truncate">{template.name}</DialogTitle>
//               <p className="text-sm text-muted-foreground mt-1 truncate">{template.subject || "No subject line"}</p>
//             </div>
//             <div className="flex items-center gap-2 flex-shrink-0">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   onOpenChange(false)
//                   router.push(`/dashboard/templates/${template.id}/edit`)
//                 }}
//               >
//                 <Pencil className="w-4 h-4 mr-2" />
//                 Edit
//               </Button>
//               <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
//                 <X className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>
//         </DialogHeader>

//         {/* Main content */}
//         <div className="flex flex-1 overflow-hidden">
//           {/* Preview panel */}
//           <div className="flex-1 flex flex-col overflow-hidden bg-muted/30">
//             {/* Device toggle */}
//             <div className="flex items-center justify-center px-4 py-3 border-b border-border/50 bg-background/50">
//               <Tabs value={devicePreview} onValueChange={(v) => setDevicePreview(v as DevicePreview)}>
//                 <TabsList className="h-8 p-1">
//                   <TabsTrigger value="desktop" className="h-6 px-2.5 text-xs">
//                     <Monitor className="w-3.5 h-3.5 mr-1.5" />
//                     Desktop
//                   </TabsTrigger>
//                   <TabsTrigger value="tablet" className="h-6 px-2.5 text-xs">
//                     <Tablet className="w-3.5 h-3.5 mr-1.5" />
//                     Tablet
//                   </TabsTrigger>
//                   <TabsTrigger value="mobile" className="h-6 px-2.5 text-xs">
//                     <Smartphone className="w-3.5 h-3.5 mr-1.5" />
//                     Mobile
//                   </TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </div>

//             {/* Email preview */}
//             <ScrollArea className="flex-1">
//               <div className="p-6 flex justify-center">
//                 <div className={cn("w-full transition-all duration-300 ease-out", getDeviceWidth())}>
//                   {/* Email frame */}
//                   <div className="bg-background rounded-xl shadow-xl border border-border overflow-hidden">
//                     {/* Email header */}
//                     <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                           <Mail className="w-4 h-4 text-primary" />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium truncate">{template.subject || "No subject"}</p>
//                           <p className="text-xs text-muted-foreground">From: Your Company</p>
//                         </div>
//                       </div>
//                     </div>
//                     {/* Email body */}
//                     <div className="p-6">{renderContent()}</div>
//                   </div>
//                 </div>
//               </div>
//             </ScrollArea>
//           </div>

//           {/* Side panel */}
//           <div className="w-72 border-l border-border/50 flex flex-col bg-background">
//             <ScrollArea className="flex-1">
//               <div className="p-4 space-y-6">
//                 {/* Performance */}
//                 <div>
//                   <h4 className="text-sm font-medium mb-3">Performance</h4>
//                   <div className="grid grid-cols-2 gap-3">
//                     <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
//                       <div className="flex items-center gap-2 mb-1">
//                         <Eye className="w-3.5 h-3.5 text-muted-foreground" />
//                         <span className="text-xs text-muted-foreground">Open Rate</span>
//                       </div>
//                       <p className="text-lg font-semibold">{openRate.toFixed(1)}%</p>
//                     </div>
//                     <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
//                       <div className="flex items-center gap-2 mb-1">
//                         <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
//                         <span className="text-xs text-muted-foreground">Reply Rate</span>
//                       </div>
//                       <p className="text-lg font-semibold">{replyRate.toFixed(1)}%</p>
//                     </div>
//                   </div>
//                   {template.timesUsed > 0 && (
//                     <p className="text-xs text-muted-foreground mt-2">
//                       Used {template.timesUsed.toLocaleString()} times
//                     </p>
//                   )}
//                 </div>

//                 <Separator />

//                 {/* Details */}
//                 <div>
//                   <h4 className="text-sm font-medium mb-3">Details</h4>
//                   <div className="space-y-3 text-sm">
//                     <div className="flex items-center justify-between">
//                       <span className="text-muted-foreground">Created</span>
//                       <span>
//                         {new Date(template.createdAt).toLocaleDateString("en-US", {
//                           month: "short",
//                           day: "numeric",
//                           year: "numeric",
//                         })}
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-muted-foreground">Updated</span>
//                       <span className="flex items-center gap-1.5">
//                         <Clock className="w-3 h-3" />
//                         {new Date(template.updatedAt).toLocaleDateString("en-US", {
//                           month: "short",
//                           day: "numeric",
//                           year: "numeric",
//                         })}
//                       </span>
//                     </div>
//                     {template.category && (
//                       <div className="flex items-center justify-between">
//                         <span className="text-muted-foreground">Category</span>
//                         <Badge variant="secondary" className="text-xs">
//                           {template.category}
//                         </Badge>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Variables */}
//                 {template.variables && template.variables.length > 0 && (
//                   <>
//                     <Separator />
//                     <div>
//                       <h4 className="text-sm font-medium mb-3">Variables ({template.variables.length})</h4>
//                       <div className="flex flex-wrap gap-1.5">
//                         {template.variables.map((variable, i) => (
//                           <Badge key={i} variant="outline" className="text-xs font-mono">
//                             {`{{${variable.name}}}`}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </ScrollArea>

//             {/* Actions */}
//             <div className="p-4 border-t border-border/50 space-y-2">
//               <Button
//                 className="w-full"
//                 onClick={() => {
//                   onOpenChange(false)
//                   router.push(`/dashboard/templates/${template.id}/edit`)
//                 }}
//               >
//                 <Pencil className="w-4 h-4 mr-2" />
//                 Edit Template
//               </Button>
//               <Button variant="outline" className="w-full bg-transparent">
//                 <Copy className="w-4 h-4 mr-2" />
//                 Duplicate
//               </Button>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import {
//   X,
//   Pencil,
//   Copy,
//   Smartphone,
//   Monitor,
//   Tablet,
//   Star,
//   Clock,
//   Eye,
//   TrendingUp,
//   Mail,
//   Sparkles,
//   ChevronRight,
// } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { cn } from "@/lib/utils"
// import type { EnhancedEmailTemplate } from "@/lib/types"

// interface TemplatePreviewDialogProps {
//   template: EnhancedEmailTemplate | null
//   open: boolean
//   onOpenChange: (open: boolean) => void
// }

// type DevicePreview = "desktop" | "tablet" | "mobile"

// function getVariablesArray(variables: unknown): Array<{ name: string }> {
//   if (!variables) return []
//   if (Array.isArray(variables)) {
//     return variables.filter(
//       (v): v is { name: string } => typeof v === "object" && v !== null && "name" in v && typeof v.name === "string",
//     )
//   }
//   return []
// }

// export function TemplatePreviewDialog({ template, open, onOpenChange }: TemplatePreviewDialogProps) {
//   const router = useRouter()
//   const [devicePreview, setDevicePreview] = useState<DevicePreview>("desktop")
//   const [showDetails, setShowDetails] = useState(true)

//   if (!template) return null

//   const openRate = template.avgOpenRate ?? 0
//   const replyRate = template.avgReplyRate ?? 0

//   const variablesArray = getVariablesArray(template.variables)

//   const getDeviceWidth = () => {
//     switch (devicePreview) {
//       case "mobile":
//         return "max-w-[375px]"
//       case "tablet":
//         return "max-w-[768px]"
//       default:
//         return "max-w-full"
//     }
//   }

//   const renderContent = () => {
//     if (!template.body) {
//       return <div className="flex items-center justify-center h-64 text-muted-foreground">No content to preview</div>
//     }

//     if (template.body.includes("<") && (template.body.includes("</") || template.body.includes("/>"))) {
//       return (
//         <div
//           className="prose prose-sm dark:prose-invert max-w-none"
//           dangerouslySetInnerHTML={{ __html: template.body }}
//         />
//       )
//     }

//     return <div className="whitespace-pre-wrap text-sm leading-relaxed">{template.body}</div>
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-6xl w-[95vw] h-[85vh] p-0 gap-0 overflow-hidden border-border/50 shadow-2xl">
//         {/* Header - More compact */}
//         <DialogHeader className="px-6 py-3 border-b border-border/50 flex-shrink-0 bg-background">
//           <div className="flex items-center justify-between gap-4">
//             <div className="flex items-center gap-3 min-w-0">
//               {template.category && (
//                 <Badge variant="secondary" className="text-xs shrink-0">
//                   {template.category}
//                 </Badge>
//               )}
//               <DialogTitle className="text-lg font-semibold truncate">{template.name}</DialogTitle>
//               {template.isFavorite && <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />}
//               {template.aiGenerated && (
//                 <Badge variant="outline" className="text-xs shrink-0 gap-1">
//                   <Sparkles className="w-3 h-3" />
//                   AI
//                 </Badge>
//               )}
//             </div>
//             <div className="flex items-center gap-2 shrink-0">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="h-8 bg-transparent"
//                 onClick={() => {
//                   onOpenChange(false)
//                   router.push(`/dashboard/templates/${template.id}/edit`)
//                 }}
//               >
//                 <Pencil className="w-3.5 h-3.5 mr-1.5" />
//                 Edit
//               </Button>
//               <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
//                 <X className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>
//         </DialogHeader>

//         {/* Main content - Horizontal layout */}
//         <div className="flex flex-1 overflow-hidden">
//           {/* Preview panel - Takes most space */}
//           <div className="flex-1 flex flex-col overflow-hidden bg-muted/20">
//             {/* Toolbar - Device toggle + Subject line */}
//             <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-background/80 backdrop-blur-sm">
//               <p className="text-sm text-muted-foreground truncate max-w-md">{template.subject || "No subject line"}</p>
//               <Tabs value={devicePreview} onValueChange={(v) => setDevicePreview(v as DevicePreview)}>
//                 <TabsList className="h-8 p-1 bg-muted/50">
//                   <TabsTrigger value="desktop" className="h-6 px-2 text-xs gap-1">
//                     <Monitor className="w-3.5 h-3.5" />
//                     <span className="hidden sm:inline">Desktop</span>
//                   </TabsTrigger>
//                   <TabsTrigger value="tablet" className="h-6 px-2 text-xs gap-1">
//                     <Tablet className="w-3.5 h-3.5" />
//                     <span className="hidden sm:inline">Tablet</span>
//                   </TabsTrigger>
//                   <TabsTrigger value="mobile" className="h-6 px-2 text-xs gap-1">
//                     <Smartphone className="w-3.5 h-3.5" />
//                     <span className="hidden sm:inline">Mobile</span>
//                   </TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </div>

//             {/* Email preview */}
//             <ScrollArea className="flex-1">
//               <div className="p-6 flex justify-center">
//                 <div className={cn("w-full transition-all duration-300 ease-out", getDeviceWidth())}>
//                   {/* Email frame with liquid glass effect */}
//                   <div className="bg-background rounded-xl shadow-xl border border-border/50 overflow-hidden">
//                     {/* Email header */}
//                     <div className="px-4 py-3 border-b border-border/30 bg-muted/20">
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
//                           <Mail className="w-4 h-4 text-primary" />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium truncate">{template.subject || "No subject"}</p>
//                           <p className="text-xs text-muted-foreground">From: Your Company</p>
//                         </div>
//                       </div>
//                     </div>
//                     {/* Email body */}
//                     <div className="p-6">{renderContent()}</div>
//                   </div>
//                 </div>
//               </div>
//             </ScrollArea>
//           </div>

//           {/* Side panel - Collapsible, compact */}
//           <div
//             className={cn(
//               "border-l border-border/50 flex flex-col bg-background transition-all duration-300",
//               showDetails ? "w-64" : "w-12",
//             )}
//           >
//             {/* Toggle button */}
//             <button
//               onClick={() => setShowDetails(!showDetails)}
//               className="flex items-center justify-center h-10 border-b border-border/50 hover:bg-muted/50 transition-colors"
//             >
//               <ChevronRight className={cn("w-4 h-4 transition-transform", showDetails && "rotate-180")} />
//             </button>

//             {showDetails && (
//               <>
//                 <ScrollArea className="flex-1">
//                   <div className="p-4 space-y-4">
//                     {/* Performance - Compact cards */}
//                     <div>
//                       <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
//                         Performance
//                       </h4>
//                       <div className="grid grid-cols-2 gap-2">
//                         <div className="p-2.5 rounded-lg bg-muted/50 border border-border/30">
//                           <div className="flex items-center gap-1.5 mb-0.5">
//                             <Eye className="w-3 h-3 text-muted-foreground" />
//                             <span className="text-[10px] text-muted-foreground">Open Rate</span>
//                           </div>
//                           <p className="text-base font-semibold">{openRate.toFixed(1)}%</p>
//                         </div>
//                         <div className="p-2.5 rounded-lg bg-muted/50 border border-border/30">
//                           <div className="flex items-center gap-1.5 mb-0.5">
//                             <TrendingUp className="w-3 h-3 text-muted-foreground" />
//                             <span className="text-[10px] text-muted-foreground">Reply Rate</span>
//                           </div>
//                           <p className="text-base font-semibold">{replyRate.toFixed(1)}%</p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Details - Inline layout */}
//                     <div>
//                       <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
//                         Details
//                       </h4>
//                       <div className="space-y-2 text-xs">
//                         <div className="flex items-center justify-between">
//                           <span className="text-muted-foreground">Created</span>
//                           <span>
//                             {new Date(template.createdAt).toLocaleDateString("en-US", {
//                               month: "short",
//                               day: "numeric",
//                               year: "numeric",
//                             })}
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-muted-foreground">Updated</span>
//                           <span className="flex items-center gap-1">
//                             <Clock className="w-3 h-3" />
//                             {new Date(template.updatedAt).toLocaleDateString("en-US", {
//                               month: "short",
//                               day: "numeric",
//                               year: "numeric",
//                             })}
//                           </span>
//                         </div>
//                         {template.timesUsed > 0 && (
//                           <div className="flex items-center justify-between">
//                             <span className="text-muted-foreground">Used</span>
//                             <span>{template.timesUsed.toLocaleString()} times</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Variables - Fixed type error */}
//                     {variablesArray.length > 0 && (
//                       <div>
//                         <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
//                           Variables ({variablesArray.length})
//                         </h4>
//                         <div className="flex flex-wrap gap-1">
//                           {variablesArray.map((variable, i) => (
//                             <Badge key={i} variant="outline" className="text-[10px] font-mono px-1.5 py-0.5">
//                               {`{{${variable.name}}}`}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </ScrollArea>

//                 {/* Actions - Compact */}
//                 <div className="p-3 border-t border-border/50 space-y-1.5">
//                   <Button
//                     size="sm"
//                     className="w-full h-8 text-xs"
//                     onClick={() => {
//                       onOpenChange(false)
//                       router.push(`/dashboard/templates/${template.id}/edit`)
//                     }}
//                   >
//                     <Pencil className="w-3.5 h-3.5 mr-1.5" />
//                     Edit Template
//                   </Button>
//                   <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-transparent">
//                     <Copy className="w-3.5 h-3.5 mr-1.5" />
//                     Duplicate
//                   </Button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import {
//   X,
//   Pencil,
//   Copy,
//   Smartphone,
//   Monitor,
//   Tablet,
//   Star,
//   Clock,
//   Eye,
//   TrendingUp,
//   Mail,
//   Sparkles,
//   ChevronRight,
// } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { cn } from "@/lib/utils"
// import type { EnhancedEmailTemplate } from "@/lib/types"

// interface TemplatePreviewDialogProps {
//   template: EnhancedEmailTemplate | null
//   open: boolean
//   onOpenChange: (open: boolean) => void
// }

// type DevicePreview = "desktop" | "tablet" | "mobile"

// function getVariablesArray(variables: unknown): Array<{ name: string }> {
//   if (!variables) return []
//   if (Array.isArray(variables)) {
//     return variables.filter(
//       (v): v is { name: string } => typeof v === "object" && v !== null && "name" in v && typeof v.name === "string",
//     )
//   }
//   return []
// }

// export function TemplatePreviewDialog({ template, open, onOpenChange }: TemplatePreviewDialogProps) {
//   const router = useRouter()
//   const [devicePreview, setDevicePreview] = useState<DevicePreview>("desktop")
//   const [showDetails, setShowDetails] = useState(true)

//   if (!template) return null

//   const openRate = template.avgOpenRate ?? 0
//   const replyRate = template.avgReplyRate ?? 0

//   const variablesArray = getVariablesArray(template.variables)

//   const getDeviceWidth = () => {
//     switch (devicePreview) {
//       case "mobile":
//         return "max-w-[375px]"
//       case "tablet":
//         return "max-w-[768px]"
//       default:
//         return "max-w-full"
//     }
//   }

//   const renderContent = () => {
//     if (!template.body) {
//       return <div className="flex items-center justify-center h-64 text-muted-foreground">No content to preview</div>
//     }

//     if (template.body.includes("<") && (template.body.includes("</") || template.body.includes("/>"))) {
//       return (
//         <div
//           className="prose prose-sm dark:prose-invert max-w-none"
//           dangerouslySetInnerHTML={{ __html: template.body }}
//         />
//       )
//     }

//     return <div className="whitespace-pre-wrap text-sm leading-relaxed">{template.body}</div>
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-6xl w-[95vw] h-[85vh] p-0 gap-0 overflow-hidden border-border/50 shadow-2xl">
//         {/* Header - More compact */}
//         <DialogHeader className="px-6 py-3 border-b border-border/50 flex-shrink-0 bg-background">
//           <div className="flex items-center justify-between gap-4">
//             <div className="flex items-center gap-3 min-w-0">
//               {template.category && (
//                 <Badge variant="secondary" className="text-xs shrink-0">
//                   {template.category}
//                 </Badge>
//               )}
//               <DialogTitle className="text-lg font-semibold truncate">{template.name}</DialogTitle>
//               {template.isFavorite && <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />}
//               {template.aiGenerated && (
//                 <Badge variant="outline" className="text-xs shrink-0 gap-1">
//                   <Sparkles className="w-3 h-3" />
//                   AI
//                 </Badge>
//               )}
//             </div>
//             <div className="flex items-center gap-2 shrink-0">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="h-8 bg-transparent"
//                 onClick={() => {
//                   onOpenChange(false)
//                   router.push(`/dashboard/templates/${template.id}/edit`)
//                 }}
//               >
//                 <Pencil className="w-3.5 h-3.5 mr-1.5" />
//                 Edit
//               </Button>
//               <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
//                 <X className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>
//         </DialogHeader>

//         {/* Main content - Horizontal layout */}
//         <div className="flex flex-1 overflow-hidden">
//           {/* Preview panel - Takes most space */}
//           <div className="flex-1 flex flex-col overflow-hidden bg-muted/20">
//             {/* Toolbar - Device toggle + Subject line */}
//             <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-background/80 backdrop-blur-sm">
//               <p className="text-sm text-muted-foreground truncate max-w-md">{template.subject || "No subject line"}</p>
//               <Tabs value={devicePreview} onValueChange={(v) => setDevicePreview(v as DevicePreview)}>
//                 <TabsList className="h-8 p-1 bg-muted/50">
//                   <TabsTrigger value="desktop" className="h-6 px-2 text-xs gap-1">
//                     <Monitor className="w-3.5 h-3.5" />
//                     <span className="hidden sm:inline">Desktop</span>
//                   </TabsTrigger>
//                   <TabsTrigger value="tablet" className="h-6 px-2 text-xs gap-1">
//                     <Tablet className="w-3.5 h-3.5" />
//                     <span className="hidden sm:inline">Tablet</span>
//                   </TabsTrigger>
//                   <TabsTrigger value="mobile" className="h-6 px-2 text-xs gap-1">
//                     <Smartphone className="w-3.5 h-3.5" />
//                     <span className="hidden sm:inline">Mobile</span>
//                   </TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </div>

//             {/* Email preview */}
//             <ScrollArea className="flex-1">
//               <div className="p-6 flex justify-center">
//                 <div className={cn("w-full transition-all duration-300 ease-out", getDeviceWidth())}>
//                   {/* Email frame with liquid glass effect */}
//                   <div className="bg-background rounded-xl shadow-xl border border-border/50 overflow-hidden">
//                     {/* Email header */}
//                     <div className="px-4 py-3 border-b border-border/30 bg-muted/20">
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
//                           <Mail className="w-4 h-4 text-primary" />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium truncate">{template.subject || "No subject"}</p>
//                           <p className="text-xs text-muted-foreground">From: Your Company</p>
//                         </div>
//                       </div>
//                     </div>
//                     {/* Email body */}
//                     <div className="p-6">{renderContent()}</div>
//                   </div>
//                 </div>
//               </div>
//             </ScrollArea>
//           </div>

//           {/* Side panel - Collapsible, compact */}
//           <div
//             className={cn(
//               "border-l border-border/50 flex flex-col bg-background transition-all duration-300",
//               showDetails ? "w-64" : "w-12",
//             )}
//           >
//             {/* Toggle button */}
//             <button
//               onClick={() => setShowDetails(!showDetails)}
//               className="flex items-center justify-center h-10 border-b border-border/50 hover:bg-muted/50 transition-colors"
//             >
//               <ChevronRight className={cn("w-4 h-4 transition-transform", showDetails && "rotate-180")} />
//             </button>

//             {showDetails && (
//               <>
//                 <ScrollArea className="flex-1">
//                   <div className="p-4 space-y-4">
//                     {/* Performance - Compact cards */}
//                     <div>
//                       <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
//                         Performance
//                       </h4>
//                       <div className="grid grid-cols-2 gap-2">
//                         <div className="p-2.5 rounded-lg bg-muted/50 border border-border/30">
//                           <div className="flex items-center gap-1.5 mb-0.5">
//                             <Eye className="w-3 h-3 text-muted-foreground" />
//                             <span className="text-[10px] text-muted-foreground">Open Rate</span>
//                           </div>
//                           <p className="text-base font-semibold">{openRate.toFixed(1)}%</p>
//                         </div>
//                         <div className="p-2.5 rounded-lg bg-muted/50 border border-border/30">
//                           <div className="flex items-center gap-1.5 mb-0.5">
//                             <TrendingUp className="w-3 h-3 text-muted-foreground" />
//                             <span className="text-[10px] text-muted-foreground">Reply Rate</span>
//                           </div>
//                           <p className="text-base font-semibold">{replyRate.toFixed(1)}%</p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Details - Inline layout */}
//                     <div>
//                       <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
//                         Details
//                       </h4>
//                       <div className="space-y-2 text-xs">
//                         <div className="flex items-center justify-between">
//                           <span className="text-muted-foreground">Created</span>
//                           <span>
//                             {new Date(template.createdAt).toLocaleDateString("en-US", {
//                               month: "short",
//                               day: "numeric",
//                               year: "numeric",
//                             })}
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-muted-foreground">Updated</span>
//                           <span className="flex items-center gap-1">
//                             <Clock className="w-3 h-3" />
//                             {new Date(template.updatedAt).toLocaleDateString("en-US", {
//                               month: "short",
//                               day: "numeric",
//                               year: "numeric",
//                             })}
//                           </span>
//                         </div>
//                         {template.timesUsed > 0 && (
//                           <div className="flex items-center justify-between">
//                             <span className="text-muted-foreground">Used</span>
//                             <span>{template.timesUsed.toLocaleString()} times</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Variables - Fixed type error */}
//                     {variablesArray.length > 0 && (
//                       <div>
//                         <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
//                           Variables ({variablesArray.length})
//                         </h4>
//                         <div className="flex flex-wrap gap-1">
//                           {variablesArray.map((variable, i) => (
//                             <Badge key={i} variant="outline" className="text-[10px] font-mono px-1.5 py-0.5">
//                               {`{{${variable.name}}}`}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </ScrollArea>

//                 {/* Actions - Compact */}
//                 <div className="p-3 border-t border-border/50 space-y-1.5">
//                   <Button
//                     size="sm"
//                     className="w-full h-8 text-xs"
//                     onClick={() => {
//                       onOpenChange(false)
//                       router.push(`/dashboard/templates/${template.id}/edit`)
//                     }}
//                   >
//                     <Pencil className="w-3.5 h-3.5 mr-1.5" />
//                     Edit Template
//                   </Button>
//                   <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-transparent">
//                     <Copy className="w-3.5 h-3.5 mr-1.5" />
//                     Duplicate
//                   </Button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  X,
  Pencil,
  Copy,
  Smartphone,
  Monitor,
  Tablet,
  Eye,
  TrendingUp,
  Mail,
  Sparkles,
  Calendar,
  ChevronRight,
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { EnhancedEmailTemplate } from "@/lib/types"

interface TemplatePreviewDialogProps {
  template: EnhancedEmailTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type DevicePreview = "desktop" | "tablet" | "mobile"

function getVariablesArray(variables: unknown): Array<{ name: string }> {
  if (!variables) return []
  if (!Array.isArray(variables)) return []
  return variables.filter(
    (v): v is { name: string } => typeof v === "object" && v !== null && "name" in v && typeof v.name === "string",
  )
}

export function TemplatePreviewDialog({ template, open, onOpenChange }: TemplatePreviewDialogProps) {
  const router = useRouter()
  const [device, setDevice] = useState<DevicePreview>("desktop")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setDevice("desktop")
      // Stagger the visibility for entrance animation
      const timer = setTimeout(() => setIsVisible(true), 50)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [open])

  if (!template) return null

  const openRate = template.avgOpenRate ?? 0
  const replyRate = template.avgReplyRate ?? 0
  const variablesArray = getVariablesArray(template.variables)

  const deviceWidths = {
    desktop: "max-w-full",
    tablet: "max-w-[600px]",
    mobile: "max-w-[375px]",
  }

  const renderBody = () => {
    if (!template.body) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Mail className="w-10 h-10 opacity-20 mb-3" />
          <span className="text-sm">No content</span>
        </div>
      )
    }

    const isHTML = template.body.includes("<") && (template.body.includes("</") || template.body.includes("/>"))

    if (isHTML) {
      return (
        <div
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: template.body }}
        />
      )
    }

    return <div className="whitespace-pre-wrap text-sm leading-7 text-foreground/80">{template.body}</div>
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-4xl w-[92vw] p-0 gap-0 overflow-hidden",
          "bg-background border-border/50",
          "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]",
          "dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]",
        )}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Category Badge */}
            {template.category && (
              <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-foreground/5 text-foreground/70 rounded-md">
                {template.category}
              </span>
            )}

            {/* AI Badge */}
            {template.aiGenerated && (
              <span className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-md">
                <Sparkles className="w-3 h-3" />
                AI
              </span>
            )}

            {/* Template Name */}
            <h2 className="text-base font-semibold truncate">{template.name}</h2>
          </div>

          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 -mr-2 rounded-lg hover:bg-foreground/5 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row">
          {/* Left: Email Preview */}
          <div
            className={cn(
              "flex-1 p-6 transition-all duration-500",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            {/* Device Switcher */}
            <div className="flex items-center justify-center gap-1 mb-5">
              {[
                { id: "desktop" as const, icon: Monitor, label: "Desktop" },
                { id: "tablet" as const, icon: Tablet, label: "Tablet" },
                { id: "mobile" as const, icon: Smartphone, label: "Mobile" },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setDevice(id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    device === id
                      ? "bg-foreground text-background shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Email Frame */}
            <div className="flex justify-center">
              <div className={cn("w-full transition-all duration-500 ease-out", deviceWidths[device])}>
                <div className={cn("rounded-xl overflow-hidden", "bg-card border border-border/60", "shadow-sm")}>
                  {/* Email Header */}
                  <div className="px-5 py-4 border-b border-border/40 bg-muted/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-foreground/50" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{template.subject || "No subject"}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">From: Your Company</p>
                      </div>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="p-5 max-h-[45vh] overflow-y-auto">{renderBody()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Stats & Actions */}
          <div
            className={cn(
              "w-full lg:w-72 p-6 border-t lg:border-t-0 lg:border-l border-border/50 bg-muted/10",
              "transition-all duration-500 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-xl bg-background border border-border/40">
                <Eye className="w-4 h-4 text-emerald-500 mb-2" />
                <p className="text-2xl font-bold">{openRate.toFixed(1)}%</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Opens</p>
              </div>
              <div className="p-4 rounded-xl bg-background border border-border/40">
                <TrendingUp className="w-4 h-4 text-blue-500 mb-2" />
                <p className="text-2xl font-bold">{replyRate.toFixed(1)}%</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Replies</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Created
                </span>
                <span className="font-medium">
                  {new Date(template.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Used</span>
                <span className="font-medium">{(template.timesUsed || 0).toLocaleString()} times</span>
              </div>
            </div>

            {/* Variables */}
            {variablesArray.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  Variables
                  <span className="px-1.5 py-0.5 bg-muted rounded text-[10px]">{variablesArray.length}</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {variablesArray.slice(0, 6).map((v, i) => (
                    <code
                      key={i}
                      className="px-2 py-1 text-[10px] bg-muted/50 border border-border/40 rounded font-mono"
                    >
                      {`{{${v.name}}}`}
                    </code>
                  ))}
                  {variablesArray.length > 6 && (
                    <span className="px-2 py-1 text-[10px] text-muted-foreground">+{variablesArray.length - 6}</span>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <Button
                className="w-full justify-between group"
                onClick={() => {
                  onOpenChange(false)
                  router.push(`/dashboard/templates/${template.id}/edit`)
                }}
              >
                <span className="flex items-center gap-2">
                  <Pencil className="w-4 h-4" />
                  Edit Template
                </span>
                <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-0.5 transition-transform" />
              </Button>
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <Copy className="w-4 h-4" />
                Duplicate
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
