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
      <div className="flex items-center gap-3">
        <Button onClick={onCancel} variant="ghost" size="icon" className="shrink-0 h-9 w-9">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-xl font-semibold text-foreground">Add Email Account</h3>
          <p className="text-sm text-muted-foreground">Choose your email provider</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ConnectionMethodCard
          title="Gmail"
          description="Personal or Google Workspace"
          icon="gmail"
          onClick={() => onSelectProvider("gmail")}
        />
        <ConnectionMethodCard
          title="Outlook"
          description="Microsoft 365 or Outlook.com"
          icon="outlook"
          onClick={() => onSelectProvider("outlook")}
        />
        <ConnectionMethodCard
          title="Custom SMTP"
          description="Any email with SMTP access"
          icon="smtp"
          onClick={() => onSelectProvider("smtp")}
        />
      </div>
    </div>
  )
}
