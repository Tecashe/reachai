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
      <div className="space-y-6">
        <Button onClick={() => setConnectionType("select")} variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to options
        </Button>
        <GmailAppPasswordFlow onAccountAdded={onAccountAdded} />
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
          <h3 className="text-2xl font-bold text-foreground">Connect Gmail</h3>
          <p className="text-muted-foreground mt-1">Choose how you want to connect your Gmail account</p>
        </div>
      </div>

      <div className="grid gap-4">
        <Card
          onClick={() => setConnectionType("app-password")}
          className="p-6 bg-white cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-foreground/20 group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
              <Key className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-semibold text-foreground text-lg">App Password</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended for personal Gmail accounts with 2FA enabled
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-md bg-success/10 text-success font-medium">Most secure</span>
                <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground font-medium">
                  Quick setup
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-dashed opacity-60">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Globe className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-semibold text-foreground text-lg">OAuth 2.0</h4>
                <p className="text-sm text-muted-foreground mt-1">Enterprise-grade authentication (Coming soon)</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground font-medium inline-block">
                Coming soon
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
