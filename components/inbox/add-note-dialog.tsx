"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, StickyNote, Save } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface AddNoteDialogProps {
  isOpen: boolean
  onClose: () => void
  replyIds: string[]
  onSuccess: () => void
}

export function AddNoteDialog({ isOpen, onClose, replyIds, onSuccess }: AddNoteDialogProps) {
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!note.trim()) {
      toast.error("Please enter a note")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/inbox/actions/add-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyIds, note }),
      })

      if (!response.ok) throw new Error()

      toast.success(`Note added to ${replyIds.length} message${replyIds.length > 1 ? "s" : ""}`)
      setNote("")
      onSuccess()
      onClose()
    } catch (error) {
      toast.error("Failed to add note")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-blue-500" />
            Add Note
          </DialogTitle>
          <DialogDescription>
            Add a note to {replyIds.length} selected message{replyIds.length > 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <Textarea
            placeholder="Enter your note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={5}
            className={cn(
              "resize-none rounded-xl border-border/50 bg-muted/20",
              "focus-visible:ring-primary/20 focus-visible:border-primary/50",
              "placeholder:text-muted-foreground/50",
            )}
          />

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-11 px-5 rounded-xl border-border/50 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !note.trim()}
              className="h-11 px-5 rounded-xl gap-2 shadow-sm hover:shadow-md transition-all"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Note
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
