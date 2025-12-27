"use client"

import { useState } from "react"
import { OutlookSetupGuide } from "./outlook-setup-guide"
import { OutlookManualSetup } from "./outlook-manual-setup"
import { ChevronLeft } from "lucide-react"

interface Props {
  onAccountAdded: () => void
  onBack: () => void
}

export function OutlookVariantsSetup({ onAccountAdded, onBack }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<"oauth" | "manual" | null>(null)

  if (selectedVariant === "oauth") {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedVariant(null)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to options
        </button>
        <OutlookSetupGuide onAccountAdded={onAccountAdded} />
      </div>
    )
  }

  if (selectedVariant === "manual") {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedVariant(null)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to options
        </button>
        <OutlookManualSetup onAccountAdded={onAccountAdded} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
      >
        <ChevronLeft className="h-5 w-5" />
        Back to providers
      </button>

      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-foreground">Connect Outlook</h2>
        <p className="text-muted-foreground text-lg">Choose your account type</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          onClick={() => setSelectedVariant("oauth")}
          className="group relative overflow-hidden rounded-2xl text-left transition-all duration-300 hover:shadow-xl active:scale-95 p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-500/10 backdrop-blur-xl border-2 border-blue-500/40 group-hover:border-blue-500/60 transition-all" />
          <div className="relative space-y-3">
            <h3 className="text-xl font-bold text-foreground">Microsoft 365 / Office 365</h3>
            <p className="text-sm text-muted-foreground">Connect your Microsoft account with one click using OAuth</p>
          </div>
        </button>

        <button
          onClick={() => setSelectedVariant("manual")}
          className="group relative overflow-hidden rounded-2xl text-left transition-all duration-300 hover:shadow-xl active:scale-95 p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 group-hover:border-white/40 transition-all" />
          <div className="relative space-y-3">
            <h3 className="text-xl font-bold text-foreground">GoDaddy / Other Providers</h3>
            <p className="text-sm text-muted-foreground">Manual SMTP/IMAP setup for hosted Outlook accounts</p>
          </div>
        </button>
      </div>
    </div>
  )
}
