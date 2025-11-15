// "use client"

// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Archive, Mail, MailOpen, MoreVertical, Sparkles, Trash2, ArrowRight } from "lucide-react"
// import { toast } from "sonner"

// interface InboxActionsProps {
//   selectedIds: string[]
//   onSuccess: () => void
// }

// export function InboxActions({ selectedIds, onSuccess }: InboxActionsProps) {
//   const handleMarkRead = async (read: boolean) => {
//     try {
//       const response = await fetch("/api/inbox/actions/mark-read", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ replyIds: selectedIds, read }),
//       })

//       if (!response.ok) throw new Error()

//       toast.success(read ? "Marked as read" : "Marked as unread")
//       onSuccess()
//     } catch (error) {
//       toast.error("Action failed")
//     }
//   }

//   const handleArchive = async (archive: boolean) => {
//     try {
//       const response = await fetch("/api/inbox/actions/archive", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ replyIds: selectedIds, archive }),
//       })

//       if (!response.ok) throw new Error()

//       toast.success(archive ? "Archived" : "Unarchived")
//       onSuccess()
//     } catch (error) {
//       toast.error("Action failed")
//     }
//   }

//   if (selectedIds.length === 0) return null

//   return (
//     <div className="flex items-center gap-2 p-4 bg-accent rounded-lg border">
//       <span className="text-sm text-muted-foreground">{selectedIds.length} selected</span>

//       <div className="flex gap-2 ml-auto">
//         <Button variant="outline" size="sm" onClick={() => handleMarkRead(true)}>
//           <Mail className="h-4 w-4 mr-2" />
//           Mark Read
//         </Button>
//         <Button variant="outline" size="sm" onClick={() => handleMarkRead(false)}>
//           <MailOpen className="h-4 w-4 mr-2" />
//           Mark Unread
//         </Button>
//         <Button variant="outline" size="sm" onClick={() => handleArchive(true)}>
//           <Archive className="h-4 w-4 mr-2" />
//           Archive
//         </Button>

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" size="sm">
//               <MoreVertical className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem>
//               <ArrowRight className="h-4 w-4 mr-2" />
//               Add to Sequence
//             </DropdownMenuItem>
//             <DropdownMenuItem>
//               <Sparkles className="h-4 w-4 mr-2" />
//               AI Bulk Reply
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem className="text-destructive">
//               <Trash2 className="h-4 w-4 mr-2" />
//               Delete
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Archive, Mail, MailOpen, MoreVertical, Sparkles, Trash2, ArrowRight } from 'lucide-react'
// import { toast } from "sonner"
// import { SequenceSelectorDialog } from "./sequence-selector-dialog"

// interface InboxActionsProps {
//   selectedIds: string[]
//   onSuccess: () => void
// }

// export function InboxActions({ selectedIds, onSuccess }: InboxActionsProps) {
//   const [showSequenceSelector, setShowSequenceSelector] = useState(false)
//   const [isProcessing, setIsProcessing] = useState(false)

//   const handleMarkRead = async (read: boolean) => {
//     setIsProcessing(true)
//     try {
//       const response = await fetch("/api/inbox/actions/mark-read", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ replyIds: selectedIds, read }),
//       })

//       if (!response.ok) throw new Error()

//       toast.success(read ? `Marked ${selectedIds.length} as read` : `Marked ${selectedIds.length} as unread`)
//       onSuccess()
//     } catch (error) {
//       toast.error("Action failed")
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const handleArchive = async (archive: boolean) => {
//     setIsProcessing(true)
//     try {
//       const response = await fetch("/api/inbox/actions/archive", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ replyIds: selectedIds, archive }),
//       })

//       if (!response.ok) throw new Error()

//       toast.success(archive ? `Archived ${selectedIds.length} messages` : `Unarchived ${selectedIds.length} messages`)
//       onSuccess()
//     } catch (error) {
//       toast.error("Action failed")
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const handleDelete = async () => {
//     if (!confirm(`Are you sure you want to delete ${selectedIds.length} messages?`)) return

//     setIsProcessing(true)
//     try {
//       const response = await fetch("/api/inbox/actions/delete", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ replyIds: selectedIds }),
//       })

//       if (!response.ok) throw new Error()

//       toast.success(`Deleted ${selectedIds.length} messages`)
//       onSuccess()
//     } catch (error) {
//       toast.error("Failed to delete")
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   if (selectedIds.length === 0) return null

//   return (
//     <>
//       <div className="flex items-center gap-2 p-4 bg-accent rounded-lg border">
//         <span className="text-sm font-medium">{selectedIds.length} selected</span>

//         <div className="flex gap-2 ml-auto">
//           <Button variant="outline" size="sm" onClick={() => handleMarkRead(true)} disabled={isProcessing}>
//             <Mail className="h-4 w-4 mr-2" />
//             Mark Read
//           </Button>
//           <Button variant="outline" size="sm" onClick={() => handleMarkRead(false)} disabled={isProcessing}>
//             <MailOpen className="h-4 w-4 mr-2" />
//             Mark Unread
//           </Button>
//           <Button variant="outline" size="sm" onClick={() => handleArchive(true)} disabled={isProcessing}>
//             <Archive className="h-4 w-4 mr-2" />
//             Archive
//           </Button>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm" disabled={isProcessing}>
//                 <MoreVertical className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => setShowSequenceSelector(true)}>
//                 <ArrowRight className="h-4 w-4 mr-2" />
//                 Add to Sequence
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
//                 <Trash2 className="h-4 w-4 mr-2" />
//                 Delete
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       <SequenceSelectorDialog
//         isOpen={showSequenceSelector}
//         onClose={() => setShowSequenceSelector(false)}
//         replyIds={selectedIds}
//         onSuccess={onSuccess}
//       />
//     </>
//   )
// }


// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Archive, Mail, MailOpen, MoreVertical, Sparkles, Trash2, ArrowRight } from 'lucide-react'
// import { toast } from "sonner"
// import { SequenceSelectorDialog } from "./sequence-selector-dialog"

// interface InboxActionsProps {
//   selectedIds: string[]
//   onSuccess: () => void
// }

// export function InboxActions({ selectedIds, onSuccess }: InboxActionsProps) {
//   const [showSequenceSelector, setShowSequenceSelector] = useState(false)
//   const [isProcessing, setIsProcessing] = useState(false)

//   const handleMarkRead = async (read: boolean) => {
//     setIsProcessing(true)
//     try {
//       const response = await fetch("/api/inbox/actions/mark-read", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ replyIds: selectedIds, read }),
//       })

//       if (!response.ok) throw new Error()

//       toast.success(read ? `Marked ${selectedIds.length} as read` : `Marked ${selectedIds.length} as unread`)
//       onSuccess()
//     } catch (error) {
//       toast.error("Action failed")
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const handleArchive = async (archive: boolean) => {
//     setIsProcessing(true)
//     try {
//       const response = await fetch("/api/inbox/actions/archive", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ replyIds: selectedIds, archive }),
//       })

//       if (!response.ok) throw new Error()

//       toast.success(archive ? `Archived ${selectedIds.length} messages` : `Unarchived ${selectedIds.length} messages`)
//       onSuccess()
//     } catch (error) {
//       toast.error("Action failed")
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const handleDelete = async () => {
//     if (!confirm(`Are you sure you want to delete ${selectedIds.length} messages?`)) return

//     setIsProcessing(true)
//     try {
//       const response = await fetch("/api/inbox/actions/delete", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ replyIds: selectedIds }),
//       })

//       if (!response.ok) throw new Error()

//       toast.success(`Deleted ${selectedIds.length} messages`)
//       onSuccess()
//     } catch (error) {
//       toast.error("Failed to delete")
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   if (selectedIds.length === 0) return null

//   return (
//     <>
//       <div className="flex items-center gap-2 p-4 bg-accent rounded-lg border">
//         <span className="text-sm font-medium">{selectedIds.length} selected</span>

//         <div className="flex gap-2 ml-auto">
//           <Button variant="outline" size="sm" onClick={() => handleMarkRead(true)} disabled={isProcessing}>
//             <Mail className="h-4 w-4 mr-2" />
//             Mark Read
//           </Button>
//           <Button variant="outline" size="sm" onClick={() => handleMarkRead(false)} disabled={isProcessing}>
//             <MailOpen className="h-4 w-4 mr-2" />
//             Mark Unread
//           </Button>
//           <Button variant="outline" size="sm" onClick={() => handleArchive(true)} disabled={isProcessing}>
//             <Archive className="h-4 w-4 mr-2" />
//             Archive
//           </Button>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm" disabled={isProcessing}>
//                 <MoreVertical className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => setShowSequenceSelector(true)}>
//                 <ArrowRight className="h-4 w-4 mr-2" />
//                 Add to Sequence
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
//                 <Trash2 className="h-4 w-4 mr-2" />
//                 Delete
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       <SequenceSelectorDialog
//         isOpen={showSequenceSelector}
//         onClose={() => setShowSequenceSelector(false)}
//         replyIds={selectedIds}
//         onSuccess={onSuccess}
//       />
//     </>
//   )
// }

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Archive, Mail, MailOpen, MoreVertical, Sparkles, Trash2, ArrowRight, FileText } from 'lucide-react'
import { toast } from "sonner"
import { SequenceSelectorDialog } from "./sequence-selector-dialog"
import { AddNoteDialog } from "./add-note-dialog"
import { BulkReplyDialog } from "./bulk-reply-dialog"

interface InboxActionsProps {
  selectedIds: string[]
  onSuccess: () => void
}

export function InboxActions({ selectedIds, onSuccess }: InboxActionsProps) {
  const [showSequenceSelector, setShowSequenceSelector] = useState(false)
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [showBulkReplyDialog, setShowBulkReplyDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleMarkRead = async (read: boolean) => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/inbox/actions/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyIds: selectedIds, read }),
      })

      if (!response.ok) throw new Error()

      toast.success(read ? `Marked ${selectedIds.length} as read` : `Marked ${selectedIds.length} as unread`)
      onSuccess()
    } catch (error) {
      toast.error("Action failed")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleArchive = async (archive: boolean) => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/inbox/actions/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyIds: selectedIds, archive }),
      })

      if (!response.ok) throw new Error()

      toast.success(archive ? `Archived ${selectedIds.length} messages` : `Unarchived ${selectedIds.length} messages`)
      onSuccess()
    } catch (error) {
      toast.error("Action failed")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} messages?`)) return

    setIsProcessing(true)
    try {
      const response = await fetch("/api/inbox/actions/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyIds: selectedIds }),
      })

      if (!response.ok) throw new Error()

      toast.success(`Deleted ${selectedIds.length} messages`)
      onSuccess()
    } catch (error) {
      toast.error("Failed to delete")
    } finally {
      setIsProcessing(false)
    }
  }

  if (selectedIds.length === 0) return null

  return (
    <>
      <div className="flex items-center gap-2 p-4 bg-accent rounded-lg border">
        <Badge variant="secondary">{selectedIds.length} selected</Badge>

        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={() => handleMarkRead(true)} disabled={isProcessing}>
            <Mail className="h-4 w-4 mr-2" />
            Mark Read
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleMarkRead(false)} disabled={isProcessing}>
            <MailOpen className="h-4 w-4 mr-2" />
            Mark Unread
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleArchive(true)} disabled={isProcessing}>
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>

          <Button variant="default" size="sm" onClick={() => setShowBulkReplyDialog(true)} disabled={isProcessing}>
            <Sparkles className="h-4 w-4 mr-2" />
            Bulk AI Reply
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isProcessing}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowSequenceSelector(true)}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Add to Sequence
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowNoteDialog(true)}>
                <FileText className="h-4 w-4 mr-2" />
                Add Note
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <SequenceSelectorDialog
        isOpen={showSequenceSelector}
        onClose={() => setShowSequenceSelector(false)}
        replyIds={selectedIds}
        onSuccess={onSuccess}
      />

      <AddNoteDialog
        isOpen={showNoteDialog}
        onClose={() => setShowNoteDialog(false)}
        replyIds={selectedIds}
        onSuccess={onSuccess}
      />

      <BulkReplyDialog
        isOpen={showBulkReplyDialog}
        onClose={() => setShowBulkReplyDialog(false)}
        replyIds={selectedIds}
        onSuccess={onSuccess}
      />
    </>
  )
}
