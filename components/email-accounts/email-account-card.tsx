"use client"

import { useState } from "react"
import { MoreVertical, Trash2, CheckCircle2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SendingAccount {
  id: string
  name: string
  email: string
  provider: "gmail" | "outlook" | "smtp"
  isActive: boolean
  createdAt: Date
}

interface Props {
  account: SendingAccount
  onRemoved: () => void
}

export function EmailAccountCard({ account, onRemoved }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const { toast } = useToast()

  const providerConfig = {
    gmail: { label: "Google", logo: "𝖦", color: "from-red-500 to-yellow-500" },
    outlook: { label: "Microsoft", logo: "◻", color: "from-blue-500 to-blue-600" },
    smtp: { label: "SMTP", logo: "✉", color: "from-slate-500 to-slate-600" },
  }

  const config = providerConfig[account.provider]

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/settings/sending-accounts/${account.id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete account")
      toast({
        title: "Account removed",
        description: `${account.email} has been removed`,
      })
      onRemoved()
    } catch (error) {
      console.error("[v0] Error deleting account:", error)
      toast({
        title: "Error",
        description: "Failed to remove account",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowMenu(false)
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl">
      {/* Glassmorphism background with gradient border */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 group-hover:border-white/40 transition-all" />

      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-5`} />
      </div>

      {/* Content */}
      <div className="relative p-6 space-y-4">
        {/* Header with provider and status */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Provider logo */}
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${config.color} text-white font-bold text-lg shadow-lg`}
            >
              {config.logo}
            </div>

            {/* Provider info */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{config.label}</p>
              <h3 className="font-semibold text-foreground">{account.name}</h3>
            </div>
          </div>

          {/* Status and menu */}
          <div className="flex items-center gap-2">
            {account.isActive ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <MoreVertical className="h-5 w-5 text-muted-foreground" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-background border border-white/20 shadow-xl backdrop-blur-xl overflow-hidden z-10">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting ? "Removing..." : "Remove Account"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Email and date */}
        <div className="space-y-2 border-t border-white/10 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium text-foreground">{account.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Connected:</span>
            <span className="font-medium text-foreground">{new Date(account.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex gap-2 pt-2">
          {account.isActive && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold border border-green-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Active
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
