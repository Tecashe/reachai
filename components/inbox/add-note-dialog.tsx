"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { toast } from "sonner"

interface AddNoteDialogProps {
  isOpen: boolean
  onClose: () => void
  replyIds: string[]
  existingNote?: string
  onSuccess: () => void
}

export function AddNoteDialog({ isOpen, onClose, replyIds, existingNote, onSuccess }: AddNoteDialogProps) {
  const [note, setNote] = useState(existingNote || "")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/inbox/actions/add-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyIds, note }),
      })

      if (!response.ok) throw new Error()

      toast.success(`Note ${replyIds.length === 1 ? "added" : `added to ${replyIds.length} messages`}`)
      onSuccess()
      onClose()
    } catch (error) {
      toast.error("Failed to add note")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Add a private note to {replyIds.length === 1 ? "this message" : `${replyIds.length} messages`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add your note here..."
              rows={5}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !note.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
