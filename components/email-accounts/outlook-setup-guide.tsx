"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { OutlookOAuthFlow } from "./outlook-oauth-flow"
import { OutlookVariantsSetup } from "./outlook-variants-setup"
import { OutlookManualSetup } from "./outlook-manual-setup"
import { ArrowLeft, Shield, Zap, Settings } from "lucide-react"

interface Props {
  onAccountAdded: () => void
  onBack: () => void
}

type SetupType = "select" | "oauth" | "quick" | "manual"

export function OutlookSetupGuide({ onAccountAdded, onBack }: Props) {
  const [setupType, setSetupType] = useState<SetupType>("select")

  if (setupType === "oauth") {
    return (
      <div className="space-y-4">
        <Button onClick={() => setSetupType("select")} variant="ghost" size="sm" className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to options
        </Button>
        <OutlookOAuthFlow onAccountAdded={onAccountAdded} />
      </div>
    )
  }

  if (setupType === "quick") {
    return (
      <div className="space-y-4">
        <Button onClick={() => setSetupType("select")} variant="ghost" size="sm" className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to options
        </Button>
        <OutlookVariantsSetup onAccountAdded={onAccountAdded} />
      </div>
    )
  }

  if (setupType === "manual") {
    return (
      <div className="space-y-4">
        <Button onClick={() => setSetupType("select")} variant="ghost" size="sm" className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to options
        </Button>
        <OutlookManualSetup onAccountAdded={onAccountAdded} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button onClick={onBack} variant="ghost" size="icon" className="shrink-0 h-9 w-9">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-xl font-semibold text-foreground">Connect Outlook</h3>
          <p className="text-sm text-muted-foreground">Choose your setup method</p>
        </div>
      </div>

      <div className="grid gap-3">
        <Card
          onClick={() => setSetupType("oauth")}
          className="p-5 bg-card border-border/50 cursor-pointer transition-all duration-200 hover:border-primary/30 hover:shadow-sm group"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-semibold text-sm text-foreground">OAuth Connection</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Secure sign-in with Microsoft — no passwords needed
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-success/10 text-success font-medium inline-block">
                  Recommended
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-medium inline-block">
                  Most Secure
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card
          onClick={() => setSetupType("quick")}
          className="p-5 bg-card border-border/50 cursor-pointer transition-all duration-200 hover:border-border hover:shadow-sm group"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-primary/5 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-semibold text-sm text-foreground">Quick Setup</h4>
                <p className="text-xs text-muted-foreground mt-1">Auto-configure common Outlook variants with password</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-muted/50 text-muted-foreground font-medium inline-block">
                Password-based
              </span>
            </div>
          </div>
        </Card>

        <Card
          onClick={() => setSetupType("manual")}
          className="p-5 bg-card border-border/50 cursor-pointer transition-all duration-200 hover:border-border hover:shadow-sm group"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-muted/50 flex items-center justify-center shrink-0">
              <Settings className="h-5 w-5 text-foreground" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-semibold text-sm text-foreground">Manual Setup</h4>
                <p className="text-xs text-muted-foreground mt-1">Enter custom SMTP/IMAP settings</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-muted/50 text-muted-foreground font-medium inline-block">
                Advanced
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
