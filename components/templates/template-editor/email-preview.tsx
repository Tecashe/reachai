// "use client"

// import { useMemo } from "react"
// import { Monitor, Tablet, Smartphone, Mail, Eye, AlertCircle } from "lucide-react"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { cn } from "@/lib/utils"

// interface EmailPreviewProps {
//   subject: string
//   content: string
//   sampleData?: Record<string, string>
//   devicePreview: "desktop" | "tablet" | "mobile"
//   onDeviceChange: (device: "desktop" | "tablet" | "mobile") => void
//   className?: string
// }

// export function EmailPreview({
//   subject,
//   content,
//   sampleData = {},
//   devicePreview,
//   onDeviceChange,
//   className,
// }: EmailPreviewProps) {
//   // Replace variables with sample data
//   const processedContent = useMemo(() => {
//     if (!content) return ""
//     let result = content
//     // Replace {{variable}} patterns with sample data or placeholder
//     result = result.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
//       return sampleData[varName] || `[${varName}]`
//     })
//     return result
//   }, [content, sampleData])

//   const processedSubject = useMemo(() => {
//     if (!subject) return "No subject"
//     let result = subject
//     result = result.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
//       return sampleData[varName] || `[${varName}]`
//     })
//     return result
//   }, [subject, sampleData])

//   const getDeviceWidth = () => {
//     switch (devicePreview) {
//       case "mobile":
//         return "max-w-[375px]"
//       case "tablet":
//         return "max-w-[600px]"
//       default:
//         return "max-w-[700px]"
//     }
//   }

//   // Detect if content is HTML
//   const isHtml = content.includes("<") && (content.includes("</") || content.includes("/>"))

//   const renderContent = () => {
//     if (!content) {
//       return (
//         <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
//           <Eye className="w-8 h-8 mb-2 opacity-50" />
//           <p className="text-sm">Start typing to see preview</p>
//         </div>
//       )
//     }

//     if (isHtml) {
//       return (
//         <div
//           className="prose prose-sm dark:prose-invert max-w-none"
//           dangerouslySetInnerHTML={{ __html: processedContent }}
//         />
//       )
//     }

//     // Plain text with variable highlighting
//     return <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{processedContent}</div>
//   }

//   return (
//     <div className={cn("flex flex-col h-full bg-muted/30", className)}>
//       {/* Device toggle header */}
//       <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/50 flex-shrink-0">
//         <div className="flex items-center gap-2 text-sm text-muted-foreground">
//           <Eye className="w-4 h-4" />
//           <span>Live Preview</span>
//         </div>
//         <Tabs value={devicePreview} onValueChange={(v) => onDeviceChange(v as "desktop" | "tablet" | "mobile")}>
//           <TabsList className="h-8 p-1 bg-muted/50">
//             <TabsTrigger value="desktop" className="h-6 px-2.5 text-xs gap-1.5">
//               <Monitor className="w-3.5 h-3.5" />
//               <span className="hidden sm:inline">Desktop</span>
//             </TabsTrigger>
//             <TabsTrigger value="tablet" className="h-6 px-2.5 text-xs gap-1.5">
//               <Tablet className="w-3.5 h-3.5" />
//               <span className="hidden sm:inline">Tablet</span>
//             </TabsTrigger>
//             <TabsTrigger value="mobile" className="h-6 px-2.5 text-xs gap-1.5">
//               <Smartphone className="w-3.5 h-3.5" />
//               <span className="hidden sm:inline">Mobile</span>
//             </TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </div>

//       {/* Preview area */}
//       <ScrollArea className="flex-1">
//         <div className="p-6 flex justify-center min-h-full">
//           <div className={cn("w-full transition-all duration-300 ease-out", getDeviceWidth())}>
//             {/* Email frame */}
//             <div className="bg-background rounded-xl shadow-xl border border-border overflow-hidden">
//               {/* Email header */}
//               <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
//                     <Mail className="w-5 h-5 text-primary" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium truncate">{processedSubject}</p>
//                     <p className="text-xs text-muted-foreground">From: Your Company &lt;hello@company.com&gt;</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Email body */}
//               <div className="p-6 min-h-[200px]">{renderContent()}</div>
//             </div>

//             {/* Warning for missing variables */}
//             {content && content.includes("{{") && Object.keys(sampleData).length === 0 && (
//               <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
//                 <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
//                 <div className="text-xs">
//                   <p className="font-medium">Variables detected</p>
//                   <p className="text-amber-600/80 dark:text-amber-400/80">
//                     Add sample data to preview with real values
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </ScrollArea>
//     </div>
//   )
// }


"use client"

import { useMemo } from "react"
import { Monitor, Tablet, Smartphone, Mail, Eye } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface EmailPreviewProps {
  subject: string
  content: string
  sampleData?: Record<string, string>
  devicePreview: "desktop" | "tablet" | "mobile"
  onDeviceChange: (device: "desktop" | "tablet" | "mobile") => void
  className?: string
}

export function EmailPreview({
  subject,
  content,
  sampleData = {},
  devicePreview,
  onDeviceChange,
  className,
}: EmailPreviewProps) {
  const processedContent = useMemo(() => {
    if (!content) return ""
    return content.replace(/\{\{(\w+)\}\}/g, (_, varName) => sampleData[varName] || `[${varName}]`)
  }, [content, sampleData])

  const processedSubject = useMemo(() => {
    if (!subject) return "No subject"
    return subject.replace(/\{\{(\w+)\}\}/g, (_, varName) => sampleData[varName] || `[${varName}]`)
  }, [subject, sampleData])

  const isHtml = content.includes("<") && (content.includes("</") || content.includes("/>"))

  return (
    <div className={cn("flex flex-col h-full bg-muted/20", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/50 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="w-4 h-4" />
          <span>Live Preview</span>
        </div>
        <Tabs value={devicePreview} onValueChange={(v) => onDeviceChange(v as typeof devicePreview)}>
          <TabsList className="h-8 p-1 bg-muted/50">
            <TabsTrigger value="desktop" className="h-6 px-2.5 text-xs gap-1.5">
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </TabsTrigger>
            <TabsTrigger value="tablet" className="h-6 px-2.5 text-xs gap-1.5">
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="h-6 px-2.5 text-xs gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 flex justify-center min-h-full">
          <div
            className={cn(
              "w-full transition-all duration-300",
              devicePreview === "mobile" && "max-w-[375px]",
              devicePreview === "tablet" && "max-w-[600px]",
              devicePreview === "desktop" && "max-w-[700px]",
            )}
          >
            <div className="bg-background rounded-xl shadow-layered-lg border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{processedSubject}</p>
                    <p className="text-xs text-muted-foreground">From: Your Company</p>
                  </div>
                </div>
              </div>
              <div className="p-6 min-h-[200px]">
                {!content ? (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <Eye className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">Start typing to see preview</p>
                  </div>
                ) : isHtml ? (
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: processedContent }}
                  />
                ) : (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{processedContent}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
