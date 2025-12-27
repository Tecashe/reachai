"use client"
import { EmailAccountCard } from "./email-account-card"
import { CheckCircle2 } from "lucide-react"

interface SendingAccount {
  id: string
  name: string
  email: string
  provider: "gmail" | "outlook" | "smtp"
  isActive: boolean
  createdAt: Date
}

interface Props {
  accounts: SendingAccount[]
  isLoading: boolean
  onAccountRemoved: () => void
}

export function ConnectedAccountsList({ accounts, isLoading, onAccountRemoved }: Props) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with status */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-md animate-pulse" />
            <CheckCircle2 className="relative h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Connected Accounts</h2>
            <p className="text-sm text-muted-foreground">
              {accounts.length} account{accounts.length !== 1 ? "s" : ""} connected
            </p>
          </div>
        </div>

        {/* Quick info cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="group relative overflow-hidden rounded-2xl p-4">
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-xl border border-blue-500/20 group-hover:border-blue-500/40 transition-all" />

            {/* Content */}
            <div className="relative space-y-1">
              <p className="text-sm font-semibold text-blue-300">Connected Providers</p>
              <p className="text-2xl font-bold text-foreground">{new Set(accounts.map((a) => a.provider)).size}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl p-4">
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-xl border border-green-500/20 group-hover:border-green-500/40 transition-all" />

            {/* Content */}
            <div className="relative space-y-1">
              <p className="text-sm font-semibold text-green-300">Active Accounts</p>
              <p className="text-2xl font-bold text-foreground">{accounts.filter((a) => a.isActive).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <EmailAccountCard key={account.id} account={account} onRemoved={onAccountRemoved} />
        ))}
      </div>
    </div>
  )
}
