"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Archive, Mail, MailOpen, MoreVertical, Sparkles, Trash2, ArrowRight } from "lucide-react"
import { toast } from "sonner"

interface InboxActionsProps {
  selectedIds: string[]
  onSuccess: () => void
}

export function InboxActions({ selectedIds, onSuccess }: InboxActionsProps) {
  const handleMarkRead = async (read: boolean) => {
    try {
      const response = await fetch("/api/inbox/actions/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyIds: selectedIds, read }),
      })

      if (!response.ok) throw new Error()

      toast.success(read ? "Marked as read" : "Marked as unread")
      onSuccess()
    } catch (error) {
      toast.error("Action failed")
    }
  }

  const handleArchive = async (archive: boolean) => {
    try {
      const response = await fetch("/api/inbox/actions/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyIds: selectedIds, archive }),
      })

      if (!response.ok) throw new Error()

      toast.success(archive ? "Archived" : "Unarchived")
      onSuccess()
    } catch (error) {
      toast.error("Action failed")
    }
  }

  if (selectedIds.length === 0) return null

  return (
    <div className="flex items-center gap-2 p-4 bg-accent rounded-lg border">
      <span className="text-sm text-muted-foreground">{selectedIds.length} selected</span>

      <div className="flex gap-2 ml-auto">
        <Button variant="outline" size="sm" onClick={() => handleMarkRead(true)}>
          <Mail className="h-4 w-4 mr-2" />
          Mark Read
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleMarkRead(false)}>
          <MailOpen className="h-4 w-4 mr-2" />
          Mark Unread
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleArchive(true)}>
          <Archive className="h-4 w-4 mr-2" />
          Archive
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <ArrowRight className="h-4 w-4 mr-2" />
              Add to Sequence
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Sparkles className="h-4 w-4 mr-2" />
              AI Bulk Reply
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
