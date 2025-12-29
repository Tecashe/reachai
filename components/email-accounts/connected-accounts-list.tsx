"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EmailAccountCard } from "./email-account-card"
import { WaveLoader } from "@/components/loader/wave-loader"
import { Plus, Upload } from "lucide-react"

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
      <Card className="p-16 bg-card border-border/50">
        <div className="flex flex-col items-center justify-center gap-4">
          <WaveLoader size="lg" />
          <p className="text-sm text-muted-foreground">Loading accounts...</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-5 bg-card border-border/50">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-base font-semibold text-foreground">Email Accounts</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {accounts.length} {accounts.length === 1 ? "account" : "accounts"} connected
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onBulkImport} variant="outline" size="sm" className="gap-2 bg-transparent">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Import CSV</span>
            </Button>
            <Button onClick={onAddAccount} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Account
            </Button>
          </div>
        </div>
      </Card>

      {accounts.length === 0 ? (
        <Card className="p-12 bg-card border-dashed border-border/50">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
              <Plus className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">No accounts connected</h4>
              <p className="text-sm text-muted-foreground mt-1">Add your first email account to start sending</p>
            </div>
            <Button onClick={onAddAccount} size="sm" className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-3">
          {accounts.map((account) => (
            <EmailAccountCard key={account.id} account={account} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
