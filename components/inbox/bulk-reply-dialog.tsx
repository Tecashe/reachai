"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Send } from 'lucide-react'
import { toast } from "sonner"
import { VariableTextarea } from "./variable-textarea"

interface BulkReplyDialogProps {
  isOpen: boolean
  onClose: () => void
  replyIds: string[]
  onSuccess: () => void
}

interface GeneratedReply {
  replyId: string
  generatedReply: string
  prospectName: string
  prospectEmail: string
}

export function BulkReplyDialog({ isOpen, onClose, replyIds, onSuccess }: BulkReplyDialogProps) {
  const [tone, setTone] = useState("professional")
  const [loading, setLoading] = useState(false)
  const [generatedReplies, setGeneratedReplies] = useState<GeneratedReply[]>([])
  const [editedReplies, setEditedReplies] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)

  async function handleGenerate() {
    setLoading(true)
    try {
      const response = await fetch("/api/inbox/generate-bulk-replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyIds, tone }),
      })

      if (!response.ok) throw new Error()

      const data = await response.json()
      setGeneratedReplies(data.replies)
      toast.success(`Generated ${data.replies.length} personalized replies`)
    } catch (error) {
      toast.error("Failed to generate replies")
    } finally {
      setLoading(false)
    }
  }

  async function handleSendAll() {
    setSending(true)
    let successCount = 0

    try {
      for (const reply of generatedReplies) {
        const body = editedReplies[reply.replyId] || reply.generatedReply
        
        const response = await fetch("/api/inbox/actions/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            replyId: reply.replyId,
            body,
          }),
        })

        if (response.ok) successCount++
      }

      toast.success(`Sent ${successCount} of ${generatedReplies.length} replies`)
      onSuccess()
      onClose()
    } catch (error) {
      toast.error("Failed to send some replies")
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk AI Replies</DialogTitle>
          <DialogDescription>
            Generate and send personalized replies to {replyIds.length} prospects at once
          </DialogDescription>
        </DialogHeader>

        {generatedReplies.length === 0 ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tone</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Sparkles className="mr-2 h-4 w-4" />
              Generate {replyIds.length} Personalized Replies
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{generatedReplies.length} replies generated</Badge>
              <Button onClick={handleSendAll} disabled={sending}>
                {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Send className="mr-2 h-4 w-4" />
                Send All
              </Button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {generatedReplies.map((reply) => (
                <Card key={reply.replyId} className="p-4">
                  <div className="mb-2">
                    <p className="font-medium">{reply.prospectName}</p>
                    <p className="text-sm text-muted-foreground">{reply.prospectEmail}</p>
                  </div>
                  <VariableTextarea
                    value={editedReplies[reply.replyId] || reply.generatedReply}
                    onChange={(value) =>
                      setEditedReplies((prev) => ({ ...prev, [reply.replyId]: value }))
                    }
                    placeholder="Edit your reply..."
                    rows={4}
                  />
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
