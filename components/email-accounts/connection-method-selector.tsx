"use client"

import { useState } from "react"
import { ConnectionMethodCard } from "./connection-method-card"
import { GmailConnectionOptions } from "./setup-guides/gmail-connection-options"
import { OutlookVariantsSetup } from "./setup-guides/outlook-variants-setup"
import { SmtpSetupGuide } from "./setup-guides/smtp-setup-guide"
import { CsvBulkImport } from "./setup-guides/csv-bulk-import"
import { ChevronLeft } from "lucide-react"

interface Props {
  onAccountAdded: () => void
  onCancel: () => void
}

export function ConnectionMethodSelector({ onAccountAdded, onCancel }: Props) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)

  const providers = [
    {
      id: "gmail",
      name: "Google",
      provider: "Gmail / G-Suite",
      icon: "𝖦",
      color: "from-red-500 to-yellow-500",
      description: "Connect your Google Workspace or Gmail account for sending",
      guide: GmailConnectionOptions,
    },
    {
      id: "outlook",
      name: "Microsoft",
      provider: "Outlook / Office 365",
      icon: "◻",
      color: "from-blue-500 to-blue-600",
      description: "Connect your Outlook or Office 365 account",
      guide: OutlookVariantsSetup,
    },
    {
      id: "smtp",
      name: "Any Provider",
      provider: "IMAP / SMTP",
      icon: "✉",
      color: "from-slate-500 to-slate-600",
      description: "Connect any email provider using IMAP and SMTP",
      guide: SmtpSetupGuide,
    },
    {
      id: "csv",
      name: "Bulk Import",
      provider: "From CSV",
      icon: "📄",
      color: "from-purple-500 to-purple-600",
      description: "Import multiple accounts at once",
      guide: CsvBulkImport,
    },
  ]

  if (selectedProvider) {
    const provider = providers.find((p) => p.id === selectedProvider)
    if (!provider) return null

    const GuideComponent = provider.guide as any

    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <button
          onClick={() => setSelectedProvider(null)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to providers
        </button>

        {/* Setup guide */}
        <GuideComponent
          onAccountAdded={onAccountAdded}
          onAccountsAdded={onAccountAdded}
          onBack={() => setSelectedProvider(null)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-foreground">Add Email Account</h2>
        <p className="text-muted-foreground text-lg">
          Choose your email provider to get started with sending campaigns
        </p>
      </div>

      {/* Provider grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <ConnectionMethodCard
            key={provider.id}
            provider={provider}
            onClick={() => setSelectedProvider(provider.id)}
          />
        ))}
      </div>

      {/* Cancel button */}
      <div className="flex justify-center pt-4">
        <button onClick={onCancel} className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors">
          Cancel
        </button>
      </div>
    </div>
  )
}
