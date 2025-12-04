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
import { Archive, Mail, MailOpen, MoreVertical, Sparkles, Trash2, ArrowRight, FileText, CheckCheck } from "lucide-react"
import { toast } from "sonner"
import { SequenceSelectorDialog } from "./sequence-selector-dialog"
import { AddNoteDialog } from "./add-note-dialog"
import { BulkReplyDialog } from "./bulk-reply-dialog"
import { cn } from "@/lib/utils"

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
      <div className="sticky top-4 z-10">
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl",
            "bg-background/80 backdrop-blur-xl border border-border/50",
            "shadow-lg shadow-black/5",
          )}
        >
          <Badge variant="secondary" className="font-medium px-3 py-1 bg-primary/10 text-primary">
            <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
            {selectedIds.length} selected
          </Badge>

          <div className="h-6 w-px bg-border/50" />

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMarkRead(true)}
              disabled={isProcessing}
              className="h-9 px-3 rounded-xl hover:bg-accent"
            >
              <Mail className="h-4 w-4 mr-2" />
              Read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMarkRead(false)}
              disabled={isProcessing}
              className="h-9 px-3 rounded-xl hover:bg-accent"
            >
              <MailOpen className="h-4 w-4 mr-2" />
              Unread
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleArchive(true)}
              disabled={isProcessing}
              className="h-9 px-3 rounded-xl hover:bg-accent"
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          </div>

          <div className="h-6 w-px bg-border/50" />

          <Button
            size="sm"
            onClick={() => setShowBulkReplyDialog(true)}
            disabled={isProcessing}
            className="h-9 px-4 rounded-xl shadow-sm hover:shadow-md transition-all gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Bulk AI Reply
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={isProcessing}
                className="h-9 w-9 p-0 rounded-xl hover:bg-accent"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuItem onClick={() => setShowSequenceSelector(true)} className="rounded-lg">
                <ArrowRight className="h-4 w-4 mr-2" />
                Add to Sequence
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowNoteDialog(true)} className="rounded-lg">
                <FileText className="h-4 w-4 mr-2" />
                Add Note
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive rounded-lg" onClick={handleDelete}>
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
