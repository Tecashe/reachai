"use client"

import { GmailAppPasswordFlow } from "./gmail-app-password-flow"
import { AlertCircle } from "lucide-react"
import { ChevronLeft } from "lucide-react"

interface Props {
  onAccountAdded: () => void
  onBack: () => void
}

export function GmailConnectionOptions({ onAccountAdded, onBack }: Props) {
  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
      >
        <ChevronLeft className="h-5 w-5" />
        Back to providers
      </button>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-2xl font-bold text-white">
            G
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Connect Gmail Account</h2>
            <p className="text-muted-foreground">Gmail / G-Suite</p>
          </div>
        </div>
      </div>

      {/* Important notice about Gmail API */}
      <div className="group relative overflow-hidden rounded-2xl p-5 border border-blue-500/20 bg-blue-500/5">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="font-semibold text-blue-300">SMTP/IMAP Connection</p>
            <p className="text-sm text-blue-200/80">
              We use industry-standard SMTP/IMAP protocols for sending, not the Gmail API. This ensures compliance with
              Google's policies for commercial email sending.
            </p>
          </div>
        </div>
      </div>

      {/* App Password Flow */}
      <GmailAppPasswordFlow onAccountAdded={onAccountAdded} />

      {/* Setup instructions */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4">
        <h4 className="font-semibold text-foreground">How to generate an App Password:</h4>
        <ol className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/20 text-primary text-xs font-semibold">
              1
            </span>
            <span>Go to your Google Account at myaccount.google.com</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/20 text-primary text-xs font-semibold">
              2
            </span>
            <span>Click on Security → 2-Step Verification (enable if not already enabled)</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/20 text-primary text-xs font-semibold">
              3
            </span>
            <span>Scroll down and click on "App passwords"</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/20 text-primary text-xs font-semibold">
              4
            </span>
            <span>Select "Mail" as the app and "Other" as the device</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/20 text-primary text-xs font-semibold">
              5
            </span>
            <span>Enter a name like "ReachAI" and click "Generate"</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/20 text-primary text-xs font-semibold">
              6
            </span>
            <span>Copy the 16-character password and paste it in the form above</span>
          </li>
        </ol>
      </div>
    </div>
  )
}
