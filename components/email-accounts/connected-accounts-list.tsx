"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WaveLoader } from "@/components/loader/wave-loader"
import {
  Plus,
  Upload,
  Mail,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Shield,
  Key,
  Settings,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"

interface Props {
  onAddAccount: () => void
  onBulkImport: () => void
}

interface Account {
  id: string
  name: string
  email: string
  provider: string
  connectionMethod?: string | null
  connectionType?: string | null
  oauthProvider?: string | null
  isActive: boolean
  healthScore?: number
  warmupStage?: string
  warmupEnabled?: boolean
  dailyLimit?: number
  emailsSentToday?: number
  createdAt?: string
}

function getProviderLabel(provider: string): string {
  const map: Record<string, string> = {
    gmail: "Google",
    outlook: "Microsoft",
    office365: "Microsoft 365",
    smtp: "Custom SMTP",
    resend: "Resend",
  }
  return map[provider.toLowerCase()] || provider
}

function getProviderColor(provider: string): string {
  const map: Record<string, string> = {
    gmail: "bg-red-500/10 text-red-600 border-red-500/20",
    outlook: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    office365: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    smtp: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  }
  return map[provider.toLowerCase()] || "bg-gray-500/10 text-gray-600 border-gray-500/20"
}

function getConnectionLabel(method?: string | null, type?: string | null, oauthProvider?: string | null): { label: string; icon: React.ReactNode } {
  if (type === "oauth" || method === "oauth" || method === "oauth_workspace") {
    return { label: "OAuth 2.0", icon: <Shield className="h-3 w-3" /> }
  }
  if (method === "app_password" || method === "app-password") {
    return { label: "App Password", icon: <Key className="h-3 w-3" /> }
  }
  if (method === "manual" || method === "manual-smtp-imap") {
    return { label: "SMTP/IMAP", icon: <Settings className="h-3 w-3" /> }
  }
  if (method === "quick") {
    return { label: "Quick Setup", icon: <CheckCircle2 className="h-3 w-3" /> }
  }
  if (method === "workspace-delegation" || type === "workspace-delegation") {
    return { label: "Workspace Delegation", icon: <Shield className="h-3 w-3" /> }
  }
  return { label: "Direct", icon: <Mail className="h-3 w-3" /> }
}

function getStatusConfig(account: Account) {
  if (!account.isActive) {
    return {
      icon: <AlertCircle className="h-3.5 w-3.5" />,
      label: "Inactive",
      className: "bg-destructive/10 text-destructive border-destructive/20",
    }
  }
  if (account.warmupStage === "NEW" || account.warmupStage === "COLD") {
    return {
      icon: <Clock className="h-3.5 w-3.5" />,
      label: "Warming Up",
      className: "bg-warning/10 text-warning-foreground border-warning/20",
    }
  }
  return {
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    label: "Active",
    className: "bg-success/10 text-success border-success/20",
  }
}

export function ConnectedAccountsList({ onAddAccount, onBulkImport }: Props) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchAccounts()
  }, [])

  // Show success/error toast based on URL params (from OAuth callback redirect)
  useEffect(() => {
    const success = searchParams.get("success")
    const error = searchParams.get("error")

    if (success === "outlook_connected") {
      toast({
        title: "Microsoft account connected!",
        description: "Your Outlook account has been successfully connected.",
      })
      // Clean URL params
      window.history.replaceState({}, "", window.location.pathname)
      // Refresh accounts list
      fetchAccounts()
    }

    if (error) {
      const errorMessages: Record<string, string> = {
        outlook_oauth_denied: "You cancelled the Microsoft authorization.",
        outlook_oauth_invalid: "Invalid OAuth response from Microsoft.",
        outlook_oauth_failed: "Failed to connect your Microsoft account. Please try again.",
        user_not_found: "User not found. Please sign in again.",
      }
      toast({
        title: "Connection failed",
        description: errorMessages[error] || "An unexpected error occurred.",
        variant: "destructive",
      })
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [searchParams, toast])

  const fetchAccounts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/settings/sending-accounts")
      if (response.ok) {
        const data = await response.json()
        // API returns array directly
        setAccounts(Array.isArray(data) ? data : data.accounts || [])
      }
    } catch (error) {
      console.error("[mailfra] Failed to fetch accounts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/settings/sending-accounts/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setAccounts((prev) => prev.filter((acc) => acc.id !== id))
        toast({
          title: "Account removed",
          description: "Email account has been disconnected.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove account.",
        variant: "destructive",
      })
    }
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

  // Group accounts by provider
  const googleAccounts = accounts.filter((a) => a.provider === "gmail")
  const microsoftAccounts = accounts.filter((a) => ["outlook", "office365"].includes(a.provider))
  const otherAccounts = accounts.filter((a) => !["gmail", "outlook", "office365"].includes(a.provider))

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
        <div className="space-y-6">
          {/* Google Accounts Section */}
          {googleAccounts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-red-500/10 flex items-center justify-center">
                  <Mail className="h-3 w-3 text-red-500" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">Google Accounts</h4>
                <span className="text-xs text-muted-foreground">({googleAccounts.length})</span>
              </div>
              <div className="grid gap-2">
                {googleAccounts.map((account) => (
                  <AccountRow key={account.id} account={account} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}

          {/* Microsoft Accounts Section */}
          {microsoftAccounts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-blue-500/10 flex items-center justify-center">
                  <Mail className="h-3 w-3 text-blue-500" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">Microsoft Accounts</h4>
                <span className="text-xs text-muted-foreground">({microsoftAccounts.length})</span>
              </div>
              <div className="grid gap-2">
                {microsoftAccounts.map((account) => (
                  <AccountRow key={account.id} account={account} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}

          {/* Other Accounts Section */}
          {otherAccounts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-gray-500/10 flex items-center justify-center">
                  <Settings className="h-3 w-3 text-gray-500" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">Other Accounts</h4>
                <span className="text-xs text-muted-foreground">({otherAccounts.length})</span>
              </div>
              <div className="grid gap-2">
                {otherAccounts.map((account) => (
                  <AccountRow key={account.id} account={account} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function AccountRow({ account, onDelete }: { account: Account; onDelete: (id: string) => void }) {
  const statusConfig = getStatusConfig(account)
  const connectionInfo = getConnectionLabel(account.connectionMethod, account.connectionType, account.oauthProvider)
  const providerColor = getProviderColor(account.provider)

  return (
    <Card className="p-4 bg-card border-border/50 hover:border-border transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-md bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
            <Mail className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <h4 className="font-medium text-sm text-foreground truncate">{account.name}</h4>
              <p className="text-xs text-muted-foreground truncate">{account.email}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={`text-xs h-5 ${providerColor}`}>
                {getProviderLabel(account.provider)}
              </Badge>
              <Badge variant="outline" className="text-xs h-5 gap-1">
                {connectionInfo.icon}
                {connectionInfo.label}
              </Badge>
              <Badge className={`${statusConfig.className} text-xs h-5 gap-1`}>
                {statusConfig.icon}
                {statusConfig.label}
              </Badge>
            </div>
          </div>
        </div>
        <Button
          onClick={() => onDelete(account.id)}
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  )
}
