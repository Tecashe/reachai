"use client"

import { useState, useEffect } from "react"
import { ConnectedAccountsList } from "./connected-accounts-list"
import { ConnectionMethodSelector } from "./connection-method-selector"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

interface SendingAccount {
  id: string
  name: string
  email: string
  provider: "gmail" | "outlook" | "smtp"
  isActive: boolean
  createdAt: Date
}

export function EmailConnectionManager() {
  const [connectedAccounts, setConnectedAccounts] = useState<SendingAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showConnectionSelector, setShowConnectionSelector] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/settings/sending-accounts")
      if (!response.ok) throw new Error("Failed to fetch accounts")
      const data = await response.json()
      setConnectedAccounts(data.accounts || [])
    } catch (error) {
      console.error("[v0] Error fetching accounts:", error)
      toast({
        title: "Error",
        description: "Failed to load your email accounts",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccountAdded = () => {
    setShowConnectionSelector(false)
    fetchAccounts()
    toast({
      title: "Success",
      description: "Email account connected successfully",
    })
  }

  const handleAccountRemoved = () => {
    fetchAccounts()
    toast({
      title: "Success",
      description: "Email account removed",
    })
  }

  return (
    <div className="space-y-8">
      {/* Connected Accounts Section */}
      {connectedAccounts.length > 0 && (
        <ConnectedAccountsList
          accounts={connectedAccounts}
          isLoading={isLoading}
          onAccountRemoved={handleAccountRemoved}
        />
      )}

      {/* Connection Selector */}
      {showConnectionSelector ? (
        <ConnectionMethodSelector
          onAccountAdded={handleAccountAdded}
          onCancel={() => setShowConnectionSelector(false)}
        />
      ) : (
        <div className="flex justify-center pt-8">
          <button
            onClick={() => setShowConnectionSelector(true)}
            className="group relative px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:shadow-2xl"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-xl border border-primary/40 group-hover:border-primary/60 transition-all" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 rounded-2xl shadow-xl shadow-primary/20 group-hover:shadow-2xl group-hover:shadow-primary/40 transition-all" />

            <div className="relative flex items-center gap-3">
              <Plus className="h-5 w-5" />
              <span>Add Email Account</span>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
