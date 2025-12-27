"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { OutlookVariantsSetup } from "./outlook-variants-setup"
import { OutlookManualSetup } from "./outlook-manual-setup"
import { ArrowLeft, Zap, Settings } from "lucide-react"

interface Props {
  onAccountAdded: () => void
  onBack: () => void
}

type SetupType = "select" | "quick" | "manual"

export function OutlookSetupGuide({ onAccountAdded, onBack }: Props) {
  const [setupType, setSetupType] = useState<SetupType>("select")

  if (setupType === "quick") {
    return (
      <div className="space-y-6">
        <Button onClick={() => setSetupType("select")} variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to options
        </Button>
        <OutlookVariantsSetup onAccountAdded={onAccountAdded} />
      </div>
    )
  }

  if (setupType === "manual") {
    return (
      <div className="space-y-6">
        <Button onClick={() => setSetupType("select")} variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to options
        </Button>
        <OutlookManualSetup onAccountAdded={onAccountAdded} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="icon" className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h3 className="text-2xl font-bold text-foreground">Connect Outlook</h3>
          <p className="text-muted-foreground mt-1">Choose your setup method</p>
        </div>
      </div>

      <div className="grid gap-4">
        <Card
          onClick={() => setSetupType("quick")}
          className="p-6 bg-white cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-foreground/20 group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-semibold text-foreground text-lg">Quick Setup</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically configure settings for common Outlook variants
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded-md bg-success/10 text-success font-medium inline-block">
                Recommended
              </span>
            </div>
          </div>
        </Card>

        <Card
          onClick={() => setSetupType("manual")}
          className="p-6 bg-white cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-foreground/20 group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Settings className="h-6 w-6 text-foreground" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-semibold text-foreground text-lg">Manual Setup</h4>
                <p className="text-sm text-muted-foreground mt-1">Enter custom SMTP/IMAP settings manually</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground font-medium inline-block">
                Advanced
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
