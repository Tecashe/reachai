"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Sparkles, Send, Wand2, User } from "lucide-react"
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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Bulk AI Replies
          </DialogTitle>
          <DialogDescription>
            Generate and send personalized replies to {replyIds.length} prospects at once
          </DialogDescription>
        </DialogHeader>

        {generatedReplies.length === 0 ? (
          <div className="space-y-6 py-6">
            <div className="p-6 rounded-xl bg-muted/30 border border-border/50 space-y-4">
              <label className="text-sm font-medium">Select Tone</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="h-11 rounded-xl bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="professional" className="rounded-lg">
                    Professional
                  </SelectItem>
                  <SelectItem value="friendly" className="rounded-lg">
                    Friendly
                  </SelectItem>
                  <SelectItem value="casual" className="rounded-lg">
                    Casual
                  </SelectItem>
                  <SelectItem value="enthusiastic" className="rounded-lg">
                    Enthusiastic
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full h-12 rounded-xl gap-2 shadow-sm hover:shadow-md transition-all"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <Wand2 className="h-4 w-4" />
              Generate {replyIds.length} Personalized Replies
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {generatedReplies.length} replies generated
              </Badge>
              <Button
                onClick={handleSendAll}
                disabled={sending}
                className="h-10 px-5 rounded-xl gap-2 shadow-sm hover:shadow-md transition-all"
              >
                {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                <Send className="h-4 w-4" />
                Send All
              </Button>
            </div>

            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {generatedReplies.map((reply, index) => (
                  <Card key={reply.replyId} className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{reply.prospectName}</p>
                        <p className="text-xs text-muted-foreground truncate">{reply.prospectEmail}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <VariableTextarea
                        value={editedReplies[reply.replyId] || reply.generatedReply}
                        onChange={(value) => setEditedReplies((prev) => ({ ...prev, [reply.replyId]: value }))}
                        placeholder="Edit your reply..."
                        rows={4}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
