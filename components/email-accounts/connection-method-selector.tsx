"use client"

import { Button } from "@/components/ui/button"
import { ConnectionMethodCard } from "./connection-method-card"
import { ArrowLeft } from "lucide-react"

interface Props {
  onSelectProvider: (provider: "gmail" | "outlook" | "smtp") => void
  onCancel: () => void
}

export function ConnectionMethodSelector({ onSelectProvider, onCancel }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={onCancel} variant="ghost" size="icon" className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h3 className="text-2xl font-bold text-foreground">Add Email Account</h3>
          <p className="text-muted-foreground mt-1">Choose your email provider to get started</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ConnectionMethodCard
          title="Gmail"
          description="Personal or Google Workspace accounts"
          icon="gmail"
          onClick={() => onSelectProvider("gmail")}
        />
        <ConnectionMethodCard
          title="Outlook"
          description="Microsoft 365 or Outlook.com accounts"
          icon="outlook"
          onClick={() => onSelectProvider("outlook")}
        />
        <ConnectionMethodCard
          title="Custom SMTP"
          description="Any email provider with SMTP access"
          icon="smtp"
          onClick={() => onSelectProvider("smtp")}
        />
      </div>
    </div>
  )
}
