// "use client"

// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Copy, Edit, X } from 'lucide-react'
// import Image from "next/image"

// interface TemplatePreviewDialogProps {
//   template: any
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onUse: () => void
//   onDuplicate: () => void
// }

// export function TemplatePreviewDialog({
//   template,
//   open,
//   onOpenChange,
//   onUse,
//   onDuplicate
// }: TemplatePreviewDialogProps) {
//   // Render email body with images
//   const renderEmailBody = (body: string) => {
//     return { __html: body.replace(/\n/g, '<br />') }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-4xl max-h-[90vh] p-0">
//         <div className="flex flex-col h-full">
//           <DialogHeader className="p-6 pb-4">
//             <div className="flex items-start justify-between gap-4">
//               <div className="space-y-2 flex-1">
//                 <DialogTitle className="text-2xl">{template.name}</DialogTitle>
//                 <DialogDescription>{template.description}</DialogDescription>
//                 <div className="flex flex-wrap gap-2 pt-2">
//                   {template.industry && (
//                     <Badge variant="secondary">{template.industry}</Badge>
//                   )}
//                   {template.category && (
//                     <Badge variant="outline">{template.category}</Badge>
//                   )}
//                   {template.isSystemTemplate && (
//                     <Badge className="bg-primary/10 text-primary border-primary/20">
//                       Premium Template
//                     </Badge>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </DialogHeader>

//           <Separator />

//           <ScrollArea className="flex-1 p-6">
//             <div className="space-y-6">
//               {/* Preview Image */}
//               {template.previewImageUrl && (
//                 <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
//                   <Image
//                     src={template.previewImageUrl || "/placeholder.svg"}
//                     alt={`${template.name} preview`}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//               )}

//               {/* Subject Line */}
//               <div className="space-y-2">
//                 <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
//                   Subject Line
//                 </h3>
//                 <p className="text-lg font-medium">{template.subject}</p>
//               </div>

//               <Separator />

//               {/* Email Body */}
//               <div className="space-y-2">
//                 <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
//                   Email Body
//                 </h3>
//                 <div 
//                   className="prose prose-sm max-w-none dark:prose-invert bg-card border rounded-lg p-6"
//                   dangerouslySetInnerHTML={renderEmailBody(template.body)}
//                 />
//               </div>

//               {/* Variables */}
//               {template.variables && template.variables.length > 0 && (
//                 <>
//                   <Separator />
//                   <div className="space-y-2">
//                     <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
//                       Available Variables
//                     </h3>
//                     <div className="flex flex-wrap gap-2">
//                       {template.variables.map((variable: string) => (
//                         <Badge key={variable} variant="secondary" className="font-mono">
//                           {`{{${variable}}}`}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </ScrollArea>

//           <Separator />

//           <div className="p-6 pt-4 flex gap-3">
//             <Button onClick={onUse} className="flex-1" size="lg">
//               <Edit className="mr-2 h-4 w-4" />
//               Use & Customize Template
//             </Button>
//             <Button onClick={onDuplicate} variant="outline" size="lg">
//               <Copy className="mr-2 h-4 w-4" />
//               Duplicate
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }


// "use client"

// import { Dialog, DialogContent } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Copy, Edit, Eye, X, Sparkles, Tag } from 'lucide-react'
// import Image from "next/image"

// interface TemplatePreviewDialogProps {
//   template: any
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onUse: () => void
//   onDuplicate: () => void
// }

// export function TemplatePreviewDialog({
//   template,
//   open,
//   onOpenChange,
//   onUse,
//   onDuplicate
// }: TemplatePreviewDialogProps) {
//   // Render email body as HTML
//   const renderEmailBody = (body: string) => {
//     return { __html: body }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-5xl max-h-[95vh] p-0 gap-0">
//         <div className="flex flex-col h-full max-h-[95vh]">
//           {/* Header - Fixed */}
//           <div className="p-6 pb-4 border-b sticky top-0 bg-background z-10">
//             <div className="flex items-start justify-between gap-4">
//               <div className="space-y-3 flex-1">
//                 <div className="flex items-center gap-3">
//                   <h2 className="text-2xl font-bold tracking-tight">{template.name}</h2>
//                   {template.isSystemTemplate && (
//                     <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0">
//                       <Sparkles className="w-3 h-3 mr-1" />
//                       Premium
//                     </Badge>
//                   )}
//                 </div>
//                 <p className="text-muted-foreground leading-relaxed">{template.description}</p>
//                 <div className="flex flex-wrap gap-2">
//                   {template.industry && (
//                     <Badge variant="secondary" className="font-medium">
//                       <Tag className="w-3 h-3 mr-1" />
//                       {template.industry}
//                     </Badge>
//                   )}
//                   {template.category && (
//                     <Badge variant="outline" className="font-medium">
//                       {template.category}
//                     </Badge>
//                   )}
//                   {template.tags && template.tags.slice(0, 3).map((tag: string) => (
//                     <Badge key={tag} variant="outline" className="text-xs">
//                       {tag}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="shrink-0"
//                 onClick={() => onOpenChange(false)}
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>

//           {/* Body - Scrollable */}
//           <ScrollArea className="flex-1 px-6">
//             <div className="py-6 space-y-8">
//               {/* Preview Image */}
//               {template.previewImageUrl && (
//                 <div className="relative w-full rounded-xl overflow-hidden bg-muted border shadow-sm">
//                   <Image
//                     src={template.previewImageUrl || "/placeholder.svg"}
//                     alt={`${template.name} preview`}
//                     width={1200}
//                     height={800}
//                     className="w-full h-auto"
//                     priority
//                   />
//                 </div>
//               )}

//               {/* Subject Line */}
//               <div className="space-y-3">
//                 <div className="flex items-center gap-2">
//                   <Eye className="w-4 h-4 text-muted-foreground" />
//                   <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
//                     Subject Line
//                   </h3>
//                 </div>
//                 <div className="bg-muted/50 border rounded-lg p-4">
//                   <p className="text-lg font-medium">{template.subject}</p>
//                 </div>
//               </div>

//               <Separator />

//               {/* Email Body Preview */}
//               <div className="space-y-3">
//                 <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
//                   Email Preview
//                 </h3>
//                 <div 
//                   className="prose prose-sm max-w-none dark:prose-invert bg-card border rounded-xl p-8 shadow-sm"
//                   style={{
//                     fontFamily: 'system-ui, -apple-system, sans-serif',
//                   }}
//                   dangerouslySetInnerHTML={renderEmailBody(template.body)}
//                 />
//               </div>

//               {/* Variables */}
//               {template.variables && template.variables.length > 0 && (
//                 <>
//                   <Separator />
//                   <div className="space-y-3">
//                     <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
//                       Personalization Variables ({template.variables.length})
//                     </h3>
//                     <div className="flex flex-wrap gap-2">
//                       {template.variables.map((variable: string) => (
//                         <Badge 
//                           key={variable} 
//                           variant="secondary" 
//                           className="font-mono text-xs px-3 py-1"
//                         >
//                           {'{{'}{ variable}{'}}'} 
//                         </Badge>
//                       ))}
//                     </div>
//                     <p className="text-sm text-muted-foreground">
//                       These fields will be automatically filled with your contact data
//                     </p>
//                   </div>
//                 </>
//               )}
//             </div>
//           </ScrollArea>

//           {/* Footer - Fixed */}
//           <div className="p-6 pt-4 border-t bg-muted/30 sticky bottom-0">
//             <div className="flex gap-3">
//               <Button onClick={onUse} className="flex-1 h-11" size="lg">
//                 <Edit className="mr-2 h-4 w-4" />
//                 Use & Customize Template
//               </Button>
//               <Button onClick={onDuplicate} variant="outline" size="lg" className="h-11">
//                 <Copy className="mr-2 h-4 w-4" />
//                 Duplicate
//               </Button>
//             </div>
//             <p className="text-xs text-muted-foreground text-center mt-3">
//               Clicking "Use & Customize" will create a copy in your library
//             </p>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Edit, Eye, X, Sparkles, Tag } from 'lucide-react'
import Image from "next/image"

interface TemplatePreviewDialogProps {
  template: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onUse: () => void
  onDuplicate: () => void
}

export function TemplatePreviewDialog({
  template,
  open,
  onOpenChange,
  onUse,
  onDuplicate
}: TemplatePreviewDialogProps) {
  const renderEmailPreview = () => {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Email Container - looks like a real email */}
        <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-md">
          {/* Email Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between mb-2 text-xs">
              <div className="font-medium opacity-90">From: you@yourcompany.com</div>
              <div className="opacity-90">To: {'{{email}}'}</div>
            </div>
            <div className="flex items-center justify-between text-xs opacity-75 mb-3">
              <div>Reply-To: you@yourcompany.com</div>
              <div>{new Date().toLocaleDateString()}</div>
            </div>
            <div className="text-sm font-semibold border-t border-white/20 pt-3">
              Subject: {template.subject}
            </div>
          </div>

          {/* Email Body */}
          <div 
            className="px-8 py-8 prose prose-sm max-w-none dark:prose-invert"
            style={{
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
              lineHeight: '1.6',
              fontSize: '14px'
            }}
            dangerouslySetInnerHTML={{ __html: template.body }}
          />

          {/* Email Footer */}
          <div className="bg-gray-50 dark:bg-gray-800 px-8 py-4 border-t text-center space-y-2">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Your Company Name | 123 Business St, City, State 12345
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              <a href="#" className="hover:underline">Unsubscribe</a> | <a href="#" className="hover:underline">Preferences</a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 gap-0">
        <div className="flex flex-col h-full max-h-[95vh]">
          {/* Header - Fixed */}
          <div className="p-6 pb-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold tracking-tight">{template.name}</h2>
                  {template.isSystemTemplate && (
                    <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed">{template.description}</p>
                <div className="flex flex-wrap gap-2">
                  {template.industry && (
                    <Badge variant="secondary" className="font-medium">
                      <Tag className="w-3 h-3 mr-1" />
                      {template.industry}
                    </Badge>
                  )}
                  {template.category && (
                    <Badge variant="outline" className="font-medium">
                      {template.category}
                    </Badge>
                  )}
                  {template.tags && template.tags.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Body - Scrollable */}
          <ScrollArea className="flex-1 px-6">
            <div className="py-6 space-y-8">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Email Preview
                </h3>
                {renderEmailPreview()}
              </div>

              {/* Variables */}
              {template.variables && template.variables.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      Personalization Variables ({template.variables.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {template.variables.map((variable: string) => (
                        <Badge 
                          key={variable} 
                          variant="secondary" 
                          className="font-mono text-xs px-3 py-1"
                        >
                          {'{{'}{ variable}{'}}'} 
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      These fields will be automatically filled with your contact data
                    </p>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          {/* Footer - Fixed */}
          <div className="p-6 pt-4 border-t bg-muted/30 sticky bottom-0">
            <div className="flex gap-3">
              <Button onClick={onUse} className="flex-1 h-11" size="lg">
                <Edit className="mr-2 h-4 w-4" />
                Use & Customize Template
              </Button>
              <Button onClick={onDuplicate} variant="outline" size="lg" className="h-11">
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Clicking "Use & Customize" will create a copy in your library
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
