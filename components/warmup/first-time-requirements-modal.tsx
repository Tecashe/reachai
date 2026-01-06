"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle2, Shield, Mail, Filter, Clock } from "lucide-react"
import { toast } from "sonner"

export function FirstTimeRequirementsModal() {
  const [open, setOpen] = useState(false)
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    // Check if user has seen this before
    const hasSeenRequirements = localStorage.getItem("warmup_requirements_agreed")
    if (!hasSeenRequirements) {
      setOpen(true)
    }
  }, [])

  const handleAgree = async () => {
    if (!agreed) {
      toast.error("Please check the box to confirm you understand the requirements")
      return
    }

    localStorage.setItem("warmup_requirements_agreed", "true")
    setOpen(false)
    toast.success("Welcome to the warmup system!")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-amber-600" />
            First Time Requirement
          </DialogTitle>
          <DialogDescription className="text-base">
            You must agree to follow below instructions before starting with warmup.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rule 1 */}
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold">1. Read the email from onboard series.</p>
              <p className="text-sm text-muted-foreground">We send first email after you verify email id with us.</p>
            </div>
          </div>

          {/* Rule 2 - Critical */}
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold text-red-900 dark:text-red-100">
                2. Never mark any Warmup Email as Spam. It will lead to permanent ban on Mystrika.
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Marking warmup emails as spam destroys your reputation and violates our terms of service.
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold">3. Your email ids must have SPF, DKIM and DMARC records already setup.</p>
              <p className="text-sm text-muted-foreground">
                These are provided by your email provider. If you have not setup or do not know how to setup SPF, DKIM
                and DMARC please contact your email provider and not ReachAI.
              </p>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="flex items-start gap-3">
            <Filter className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold">
                4. Set an email filter (not advised) if you don't want to see warmup emails at all.
              </p>
              <p className="text-sm text-muted-foreground">Video Guide available in documentation.</p>
            </div>
          </div>

          {/* Rule 5 */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <Clock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold">5. Don't start your Campaigns/Cold Emails.</p>
              <p className="text-sm text-muted-foreground">
                Unless you have warmed for 2 weeks, and has "Delivery Rate" over 90.
              </p>
            </div>
          </div>

          {/* Checkbox Agreement */}
          <div className="flex items-start gap-3 p-4 bg-muted rounded-lg mt-6">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-0.5"
            />
            <label htmlFor="agree" className="text-sm cursor-pointer select-none">
              By clicking "I Agree", you agree to these terms and understand that violating rule #2 (marking warmup
              emails as spam) will result in immediate account termination.
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAgree} disabled={!agreed} size="lg" className="w-full">
            <CheckCircle2 className="h-5 w-5 mr-2" />I AGREE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
