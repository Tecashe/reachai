"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, Send, Clock, ListChecks } from "lucide-react"
import { toast } from "sonner"

interface SequenceSelectorDialogProps {
  isOpen: boolean
  onClose: () => void
  replyIds: string[]
  onSuccess: () => void
}

export function SequenceSelectorDialog({ isOpen, onClose, replyIds, onSuccess }: SequenceSelectorDialogProps) {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState("")
  const [delayHours, setDelayHours] = useState(24)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadCampaigns()
    }
  }, [isOpen])

  const loadCampaigns = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/campaigns")
      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Failed to load campaigns:", response.status, errorText)
        throw new Error(`Failed to load campaigns: ${response.status}`)
      }

      const data = await response.json()
      setCampaigns(data.campaigns || [])

      if (!data.campaigns || data.campaigns.length === 0) {
        toast.error("No active campaigns with sequences found. Please create a campaign with email sequences first.")
      }
    } catch (error) {
      console.error("[v0] Error loading campaigns:", error)
      toast.error("Failed to load campaigns. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedCampaign) {
      toast.error("Please select a campaign")
      return
    }

    setIsSubmitting(true)
    try {
      let totalScheduled = 0

      for (const replyId of replyIds) {
        const response = await fetch("/api/inbox/actions/add-to-sequence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            replyId,
            sequenceId: selectedCampaign,
            delayHours,
          }),
        })

        if (!response.ok) throw new Error()

        const data = await response.json()
        totalScheduled += data.emailsScheduled || 0
      }

      toast.success(`Added ${replyIds.length} prospects to sequence! ${totalScheduled} emails scheduled.`)
      onSuccess()
      onClose()
    } catch (error) {
      toast.error("Failed to add to sequence")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            Add to Sequence
          </DialogTitle>
          <DialogDescription>
            Add {replyIds.length} prospect{replyIds.length > 1 ? "s" : ""} to an email sequence
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Campaign with Sequence</Label>
            {isLoading ? (
              <div className="flex items-center justify-center py-8 rounded-xl bg-muted/30 border border-border/50">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/50">
                  <SelectValue placeholder="Select a campaign..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id} className="rounded-lg">
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Start After (hours)
            </Label>
            <Input
              type="number"
              value={delayHours}
              onChange={(e) => setDelayHours(Number.parseInt(e.target.value) || 0)}
              min={0}
              max={168}
              className="h-11 rounded-xl bg-muted/20 border-border/50"
            />
            <p className="text-xs text-muted-foreground">First email will be sent {delayHours} hours from now</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 px-5 rounded-xl border-border/50 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedCampaign}
              className="h-11 px-5 rounded-xl gap-2 shadow-sm hover:shadow-md transition-all"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Add to Sequence
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
