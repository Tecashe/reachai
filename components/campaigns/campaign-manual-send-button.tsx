"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Loader2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CampaignManualSendButtonProps {
  campaignId: string
  pendingCount: number
}

export function CampaignManualSendButton({ campaignId, pendingCount }: CampaignManualSendButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const handleManualSend = async () => {
    setIsSending(true)

    try {
      const response = await fetch(`/api/campaigns/${campaignId}/send-now`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send emails")
      }

      toast.success(data.message)

      if (data.blocked > 0) {
        toast.warning(`${data.blocked} emails blocked by company send limits`, {
          description: "Some prospects reached their daily limit",
        })
      }

      // Refresh page to show updated status
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error("[v0] Manual send error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to send emails")
    } finally {
      setIsSending(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} disabled={pendingCount === 0 || isSending} className="gap-2">
        {isSending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Now ({pendingCount})
          </>
        )}
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Emails Manually?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                You are about to send <strong>{pendingCount} emails</strong> immediately. This action will:
              </p>

              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span>Respect company send limits (max 2 emails per company per day)</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span>Use available sending accounts with good health scores</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span>Process emails within the next 15 minutes</span>
                </li>
              </ul>

              <div className="bg-muted p-3 rounded-lg text-sm">
                <strong>Note:</strong> Some emails may be blocked if company limits are reached. You'll see a summary
                after sending.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleManualSend} disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>Send {pendingCount} Emails</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
