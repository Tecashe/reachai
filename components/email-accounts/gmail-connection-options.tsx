"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { GmailAppPasswordFlow } from "./gmail-app-password-flow"
import { ArrowLeft, Key, Globe } from "lucide-react"

interface Props {
  onAccountAdded: () => void
  onBack: () => void
}

type ConnectionType = "select" | "app-password" | "oauth"

export function GmailConnectionOptions({ onAccountAdded, onBack }: Props) {
  const [connectionType, setConnectionType] = useState<ConnectionType>("select")

  if (connectionType === "app-password") {
    return (
      <div className="space-y-4">
        <Button onClick={() => setConnectionType("select")} variant="ghost" size="sm" className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to options
        </Button>
        <GmailAppPasswordFlow onAccountAdded={onAccountAdded} />
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
          <h3 className="text-xl font-semibold text-foreground">Connect Gmail</h3>
          <p className="text-sm text-muted-foreground">Choose your connection method</p>
        </div>
      </div>

      <div className="grid gap-3">
        <Card
          onClick={() => setConnectionType("app-password")}
          className="p-5 bg-card border-border/50 cursor-pointer transition-all duration-200 hover:border-border hover:shadow-sm group"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-primary/5 flex items-center justify-center shrink-0">
              <Key className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-semibold text-sm text-foreground">App Password</h4>
                <p className="text-xs text-muted-foreground mt-1">Recommended for personal Gmail with 2FA enabled</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs px-2 py-0.5 rounded bg-success/10 text-success font-medium">Most secure</span>
                <span className="text-xs px-2 py-0.5 rounded bg-muted/50 text-muted-foreground font-medium">
                  Quick setup
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-card/50 border-dashed border-border/50 opacity-60">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-muted/30 flex items-center justify-center shrink-0">
              <Globe className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-semibold text-sm text-foreground">OAuth 2.0</h4>
                <p className="text-xs text-muted-foreground mt-1">Enterprise authentication (Coming soon)</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-muted/50 text-muted-foreground font-medium inline-block">
                Coming soon
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
