
// "use client"

// import { useState, useEffect } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Card } from "@/components/ui/card"
// import { AlertTriangle, Check } from "lucide-react"

// interface DuplicateDetectorDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   duplicateGroups: any[]
//   onResolved: (excludeIds: string[]) => void
// }

// export function DuplicateDetectorDialog({
//   open,
//   onOpenChange,
//   duplicateGroups,
//   onResolved,
// }: DuplicateDetectorDialogProps) {
//   const [currentGroupIndex, setCurrentGroupIndex] = useState(0)
//   const [selectedProspects, setSelectedProspects] = useState<Map<string, string>>(new Map())

//   const currentGroup = duplicateGroups[currentGroupIndex]

//   useEffect(() => {
//     if (currentGroup && !selectedProspects.has(currentGroup.email)) {
//       const best = currentGroup.prospects.reduce((prev: any, curr: any) =>
//         (curr.qualityScore || 0) > (prev.qualityScore || 0) ? curr : prev,
//       )
//       setSelectedProspects(new Map(selectedProspects.set(currentGroup.email, best.id)))
//     }
//   }, [currentGroup, currentGroupIndex])

//   const handleSelectProspect = (email: string, prospectId: string) => {
//     setSelectedProspects(new Map(selectedProspects.set(email, prospectId)))
//   }

//   const handleNext = () => {
//     if (currentGroupIndex < duplicateGroups.length - 1) {
//       setCurrentGroupIndex(currentGroupIndex + 1)
//     } else {
//       const excludeIds: string[] = []

//       duplicateGroups.forEach((group) => {
//         const selectedId = selectedProspects.get(group.email)
//         group.prospects.forEach((prospect: any) => {
//           if (prospect.id !== selectedId) {
//             excludeIds.push(prospect.id)
//           }
//         })
//       })

//       onResolved(excludeIds)
//     }
//   }

//   const handleKeepAll = () => {
//     // Keep all duplicates - don't exclude any
//     onResolved([])
//   }

//   if (!currentGroup) return null

//   const selectedProspectId = selectedProspects.get(currentGroup.email)

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <AlertTriangle className="h-5 w-5 text-yellow-500" />
//             Review Duplicates ({currentGroupIndex + 1} of {duplicateGroups.length})
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4">
//           <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
//             <p className="text-sm font-medium">{currentGroup.reason}</p>
//             <p className="text-xs text-muted-foreground mt-1">
//               Select which prospect to keep. Others will be moved to trash during the merge.
//             </p>
//           </div>

//           <div className="space-y-3">
//             {currentGroup.prospects.map((prospect: any) => (
//               <Card
//                 key={prospect.id}
//                 className={`p-4 cursor-pointer transition-all ${
//                   selectedProspectId === prospect.id
//                     ? "border-2 border-primary shadow-md"
//                     : "hover:border-muted-foreground/50"
//                 }`}
//                 onClick={() => handleSelectProspect(currentGroup.email, prospect.id)}
//               >
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-2">
//                       <h4 className="font-medium">
//                         {prospect.firstName} {prospect.lastName}
//                       </h4>
//                       {selectedProspectId === prospect.id && (
//                         <Badge variant="default" className="bg-green-500">
//                           <Check className="h-3 w-3 mr-1" />
//                           Keep This
//                         </Badge>
//                       )}
//                     </div>

//                     <div className="grid grid-cols-2 gap-3 text-sm">
//                       <div>
//                         <p className="text-muted-foreground">Email</p>
//                         <p className="font-medium">{prospect.email}</p>
//                       </div>
//                       <div>
//                         <p className="text-muted-foreground">Company</p>
//                         <p className="font-medium">{prospect.company || "—"}</p>
//                       </div>
//                       <div>
//                         <p className="text-muted-foreground">Job Title</p>
//                         <p className="font-medium">{prospect.jobTitle || "—"}</p>
//                       </div>
//                       <div>
//                         <p className="text-muted-foreground">Quality Score</p>
//                         <p className="font-medium">{prospect.qualityScore || 0}/100</p>
//                       </div>
//                       <div>
//                         <p className="text-muted-foreground">LinkedIn</p>
//                         <p className="font-medium">{prospect.linkedinUrl ? "✓ Yes" : "✗ No"}</p>
//                       </div>
//                       <div>
//                         <p className="text-muted-foreground">Engagement</p>
//                         <p className="font-medium">
//                           {prospect.emailsOpened || 0} opens, {prospect.emailsReplied || 0} replies
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>

//           <div className="flex items-center gap-3 justify-between pt-4 border-t">
//             <Button variant="outline" onClick={handleKeepAll}>
//               Keep All Duplicates
//             </Button>
//             <Button onClick={handleNext}>
//               {currentGroupIndex < duplicateGroups.length - 1 ? "Next Duplicate" : "Proceed to Merge"}
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }



"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle2, AlertTriangle, Trash2, Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { mergeDuplicates } from "@/lib/services/duplicate-detector"
import { toast } from "sonner"

interface DuplicateGroup {
  email: string
  prospects: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    company: string | null
    jobTitle: string | null
    folderId: string | null
    folderName: string | null
    createdAt: Date
  }[]
}

interface DuplicateDetectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  duplicateGroups: DuplicateGroup[]
  onResolved: () => void
}

export function DuplicateDetectorDialog({
  open,
  onOpenChange,
  duplicateGroups,
  onResolved,
}: DuplicateDetectorDialogProps) {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)
  const [selectedToKeep, setSelectedToKeep] = useState<string | null>(null)
  const [resolving, setResolving] = useState(false)
  const [resolvedCount, setResolvedCount] = useState(0)

  const currentGroup = duplicateGroups[currentGroupIndex]
  const hasMoreGroups = currentGroupIndex < duplicateGroups.length - 1

  const handleSelectToKeep = (id: string) => {
    setSelectedToKeep(id === selectedToKeep ? null : id)
  }

  const handleMerge = async () => {
    if (!selectedToKeep || !currentGroup) return

    setResolving(true)

    const deleteIds = currentGroup.prospects.filter((p) => p.id !== selectedToKeep).map((p) => p.id)

    const result = await mergeDuplicates(selectedToKeep, deleteIds)

    if (result.success) {
      setResolvedCount((prev) => prev + 1)
      toast.success(`Merged ${deleteIds.length} duplicate(s)`)

      if (hasMoreGroups) {
        setCurrentGroupIndex((prev) => prev + 1)
        setSelectedToKeep(null)
      } else {
        onResolved()
      }
    } else {
      toast.error(result.error || "Failed to merge duplicates")
    }

    setResolving(false)
  }

  const handleSkip = () => {
    if (hasMoreGroups) {
      setCurrentGroupIndex((prev) => prev + 1)
      setSelectedToKeep(null)
    } else {
      onResolved()
    }
  }

  const handleClose = () => {
    setCurrentGroupIndex(0)
    setSelectedToKeep(null)
    setResolvedCount(0)
    onOpenChange(false)
  }

  if (duplicateGroups.length === 0) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Detection</DialogTitle>
            <DialogDescription>Scan complete - no duplicates found</DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto text-green-600 mb-4" />
            <p className="text-muted-foreground">Your prospect list is clean!</p>
          </div>
          <Button onClick={handleClose}>Close</Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Resolve Duplicates
          </DialogTitle>
          <DialogDescription>
            Group {currentGroupIndex + 1} of {duplicateGroups.length} - Select the record to keep
          </DialogDescription>
        </DialogHeader>

        {currentGroup && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-sm">
                {currentGroup.email}
              </Badge>
              <span className="text-sm text-muted-foreground">{currentGroup.prospects.length} duplicates found</span>
            </div>

            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-3">
                {currentGroup.prospects.map((prospect) => {
                  const isSelected = selectedToKeep === prospect.id
                  const willBeDeleted = selectedToKeep && !isSelected

                  return (
                    <Card
                      key={prospect.id}
                      className={cn(
                        "cursor-pointer transition-all border-2",
                        isSelected && "border-primary bg-primary/5",
                        willBeDeleted && "opacity-50 border-destructive/30 bg-destructive/5",
                      )}
                      onClick={() => handleSelectToKeep(prospect.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>
                              {prospect.firstName?.[0] || ""}
                              {prospect.lastName?.[0] || "?"}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {prospect.firstName || ""} {prospect.lastName || "(No name)"}
                              </p>
                              {isSelected && (
                                <Badge variant="default" className="text-xs">
                                  <Check className="h-3 w-3 mr-1" />
                                  Keep
                                </Badge>
                              )}
                              {willBeDeleted && (
                                <Badge variant="destructive" className="text-xs">
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{prospect.email}</p>

                            <div className="flex flex-wrap gap-2 mt-2">
                              {prospect.company && (
                                <Badge variant="outline" className="text-xs">
                                  {prospect.company}
                                </Badge>
                              )}
                              {prospect.jobTitle && (
                                <Badge variant="outline" className="text-xs">
                                  {prospect.jobTitle}
                                </Badge>
                              )}
                              {prospect.folderName && (
                                <Badge variant="secondary" className="text-xs">
                                  {prospect.folderName}
                                </Badge>
                              )}
                            </div>

                            <p className="text-xs text-muted-foreground mt-2">
                              Added {new Date(prospect.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div
                            className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/30",
                            )}
                          >
                            {isSelected && <Check className="h-4 w-4" />}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>

            {selectedToKeep && (
              <div className="bg-muted/50 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  {currentGroup.prospects.length - 1} record(s) will be permanently deleted. This action cannot be
                  undone.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentGroupIndex === 0}
                  onClick={() => {
                    setCurrentGroupIndex((prev) => prev - 1)
                    setSelectedToKeep(null)
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">{resolvedCount} resolved</span>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleSkip}>
                  Skip
                  {hasMoreGroups && <ChevronRight className="h-4 w-4 ml-1" />}
                </Button>
                <Button onClick={handleMerge} disabled={!selectedToKeep || resolving}>
                  {resolving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Merging...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Keep Selected & Delete Others
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
