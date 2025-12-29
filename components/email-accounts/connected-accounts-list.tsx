"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EmailAccountCard } from "./email-account-card"
import { Plus, Upload, Loader2 } from "lucide-react"

interface Props {
  onAddAccount: () => void
  onBulkImport: () => void
}

interface Account {
  id: string
  name: string
  email: string
  provider: string
  status: "active" | "error" | "warming"
}

export function ConnectedAccountsList({ onAddAccount, onBulkImport }: Props) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/settings/sending-accounts")
      if (response.ok) {
        const data = await response.json()
        setAccounts(data.accounts || [])
      }
    } catch (error) {
      console.error("[v0] Failed to fetch accounts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id))
  }

  if (isLoading) {
    return (
      <Card className="p-12 bg-white">
        <div className="flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading accounts...</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white border-border">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Connected Accounts</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {accounts.length} {accounts.length === 1 ? "account" : "accounts"} connected
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={onBulkImport} variant="outline" className="gap-2 bg-transparent">
              <Upload className="h-4 w-4" />
              Import CSV
            </Button>
            <Button onClick={onAddAccount} className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Add Account
            </Button>
          </div>
        </div>
      </Card>

      {accounts.length === 0 ? (
        <Card className="p-12 bg-white border-dashed">
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">No accounts connected</h4>
              <p className="text-sm text-muted-foreground mt-1">Add your first email account to start sending</p>
            </div>
            <Button onClick={onAddAccount} className="mt-4">
              Add Account
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {accounts.map((account) => (
            <EmailAccountCard key={account.id} account={account} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
