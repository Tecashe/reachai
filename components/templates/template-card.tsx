// "use client"

// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Star, Copy, Eye, Edit, MoreVertical } from 'lucide-react'
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import Image from "next/image"

// interface TemplateCardProps {
//   template: any
//   viewMode: 'grid' | 'list'
//   onDuplicate: () => void
//   onToggleFavorite: () => void
//   onUse: () => void
// }

// export function TemplateCard({ 
//   template, 
//   viewMode,
//   onDuplicate, 
//   onToggleFavorite, 
//   onUse 
// }: TemplateCardProps) {
//   if (viewMode === 'list') {
//     return (
//       <Card className="hover:border-primary/50 transition-colors">
//         <div className="flex items-center gap-4 p-6">
//           <div className="relative w-32 h-24 shrink-0 rounded-md overflow-hidden bg-muted">
//             <Image
//               src={template.thumbnailUrl || '/placeholder.svg?height=96&width=128&query=template'}
//               alt={template.name}
//               fill
//               className="object-cover"
//             />
//           </div>

//           <div className="flex-1 min-w-0">
//             <div className="flex items-start justify-between gap-4">
//               <div className="space-y-1">
//                 <h3 className="font-semibold leading-none">{template.name}</h3>
//                 <p className="text-sm text-muted-foreground line-clamp-1">
//                   {template.subject}
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={onToggleFavorite}
//                   className="shrink-0"
//                 >
//                   <Star className={template.isFavorite ? "h-4 w-4 fill-current text-yellow-500" : "h-4 w-4"} />
//                 </Button>
//                 <Button onClick={onUse} size="sm">
//                   Use Template
//                 </Button>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="sm">
//                       <MoreVertical className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem onClick={onDuplicate}>
//                       <Copy className="mr-2 h-4 w-4" />
//                       Duplicate
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={onUse}>
//                       <Edit className="mr-2 h-4 w-4" />
//                       Edit
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </div>

//             <div className="flex items-center gap-2 mt-3">
//               {template.industry && (
//                 <Badge variant="secondary">{template.industry}</Badge>
//               )}
//               {template.category && (
//                 <Badge variant="outline">{template.category}</Badge>
//               )}
//               {template.isSystemTemplate && (
//                 <Badge className="bg-primary/10 text-primary border-primary/20">
//                   Premium
//                 </Badge>
//               )}
//               {template.aiGenerated && (
//                 <Badge variant="outline" className="border-accent/50 text-accent">
//                   AI Generated
//                 </Badge>
//               )}
//             </div>
//           </div>
//         </div>
//       </Card>
//     )
//   }

//   return (
//     <Card className="group hover:border-primary/50 transition-all hover:shadow-lg">
//       <CardHeader className="p-0">
//         <div className="relative aspect-video rounded-t-lg overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
//           <Image
//             src={template.thumbnailUrl || '/placeholder.svg?height=300&width=450&query=email-template'}
//             alt={template.name}
//             fill
//             className="object-cover transition-transform group-hover:scale-105"
//           />
//           <Button
//             variant="secondary"
//             size="sm"
//             className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
//             onClick={onToggleFavorite}
//           >
//             <Star className={template.isFavorite ? "h-4 w-4 fill-current text-yellow-500" : "h-4 w-4"} />
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent className="pt-4 space-y-3">
//         <div>
//           <CardTitle className="line-clamp-1">{template.name}</CardTitle>
//           <CardDescription className="line-clamp-2 mt-1">
//             {template.subject}
//           </CardDescription>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           {template.industry && (
//             <Badge variant="secondary" className="text-xs">
//               {template.industry}
//             </Badge>
//           )}
//           {template.category && (
//             <Badge variant="outline" className="text-xs">
//               {template.category}
//             </Badge>
//           )}
//         </div>

//         {template.isSystemTemplate && (
//           <div className="flex items-center gap-3 text-xs text-muted-foreground">
//             <span className="flex items-center gap-1">
//               <Eye className="h-3 w-3" />
//               {template.viewCount || 0}
//             </span>
//             <span className="flex items-center gap-1">
//               <Copy className="h-3 w-3" />
//               {template.duplicateCount || 0}
//             </span>
//           </div>
//         )}
//       </CardContent>
//       <CardFooter className="pt-0 flex gap-2">
//         <Button onClick={onUse} className="flex-1">
//           Use Template
//         </Button>
//         <Button variant="outline" onClick={onDuplicate}>
//           <Copy className="h-4 w-4" />
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Copy, Eye, Edit, MoreVertical } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TemplatePreviewDialog } from "./template-preview-dialog"
import Image from "next/image"

interface TemplateCardProps {
  template: any
  viewMode: 'grid' | 'list'
  onDuplicate: () => void
  onToggleFavorite: () => void
  onUse: () => void
}

export function TemplateCard({ 
  template, 
  viewMode,
  onDuplicate, 
  onToggleFavorite, 
  onUse 
}: TemplateCardProps) {
  const [showPreview, setShowPreview] = useState(false)

  const handlePreview = () => {
    setShowPreview(true)
  }

  const handleUseFromPreview = () => {
    setShowPreview(false)
    onUse()
  }

  const handleDuplicateFromPreview = () => {
    setShowPreview(false)
    onDuplicate()
  }

  if (viewMode === 'list') {
    return (
      <>
        <Card className="hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-4 p-6">
            <button 
              onClick={handlePreview}
              className="relative w-32 h-24 shrink-0 rounded-md overflow-hidden bg-muted hover:opacity-80 transition-opacity"
            >
              <Image
                src={template.thumbnailUrl || '/placeholder.svg?height=96&width=128&query=email template preview'}
                alt={template.name}
                fill
                className="object-cover"
              />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-semibold leading-none">{template.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {template.subject}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePreview}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleFavorite}
                    className="shrink-0"
                  >
                    <Star className={template.isFavorite ? "h-4 w-4 fill-current text-yellow-500" : "h-4 w-4"} />
                  </Button>
                  <Button onClick={onUse} size="sm">
                    Use Template
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handlePreview}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onDuplicate}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onUse}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                {template.industry && (
                  <Badge variant="secondary">{template.industry}</Badge>
                )}
                {template.category && (
                  <Badge variant="outline">{template.category}</Badge>
                )}
                {template.isSystemTemplate && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    Premium
                  </Badge>
                )}
                {template.aiGenerated && (
                  <Badge variant="outline" className="border-accent/50 text-accent">
                    AI Generated
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        <TemplatePreviewDialog
          template={template}
          open={showPreview}
          onOpenChange={setShowPreview}
          onUse={handleUseFromPreview}
          onDuplicate={handleDuplicateFromPreview}
        />
      </>
    )
  }

  return (
    <>
      <Card className="group hover:border-primary/50 transition-all hover:shadow-lg">
        <CardHeader className="p-0">
          <button
            onClick={handlePreview}
            className="relative aspect-video rounded-t-lg overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 w-full"
          >
            <Image
              src={template.thumbnailUrl || '/placeholder.svg?height=300&width=450&query=email template design'}
              alt={template.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-white flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <span className="font-medium">Preview Template</span>
              </div>
            </div>
          </button>
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite()
            }}
          >
            <Star className={template.isFavorite ? "h-4 w-4 fill-current text-yellow-500" : "h-4 w-4"} />
          </Button>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div>
            <CardTitle className="line-clamp-1">{template.name}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {template.subject}
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            {template.industry && (
              <Badge variant="secondary" className="text-xs">
                {template.industry}
              </Badge>
            )}
            {template.category && (
              <Badge variant="outline" className="text-xs">
                {template.category}
              </Badge>
            )}
          </div>

          {template.isSystemTemplate && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {template.viewCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <Copy className="h-3 w-3" />
                {template.duplicateCount || 0}
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-0 flex gap-2">
          <Button onClick={handlePreview} variant="outline" className="flex-1">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={onUse} className="flex-1">
            Use Template
          </Button>
        </CardFooter>
      </Card>

      <TemplatePreviewDialog
        template={template}
        open={showPreview}
        onOpenChange={setShowPreview}
        onUse={handleUseFromPreview}
        onDuplicate={handleDuplicateFromPreview}
      />
    </>
  )
}
