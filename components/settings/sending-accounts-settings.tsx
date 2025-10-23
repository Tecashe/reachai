"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Mail, Trash2, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import {
  createSendingAccount,
  getSendingAccounts,
  deleteSendingAccount,
  toggleSendingAccount,
} from "@/lib/actions/sending-accounts"

interface SendingAccount {
  id: string
  name: string
  email: string
  provider: string
  dailyLimit: number
  hourlyLimit: number
  emailsSentToday: number
  emailsSentThisHour: number
  warmupEnabled: boolean
  warmupStage: number
  warmupDailyLimit: number
  isActive: boolean
  bounceRate: number
  createdAt: Date
}

export function SendingAccountsSettings() {
  const [accounts, setAccounts] = useState<SendingAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    provider: "resend",
    apiKey: "",
    dailyLimit: 50,
    hourlyLimit: 10,
  })

  useEffect(() => {
    loadAccounts()
  }, [])

  async function loadAccounts() {
    try {
      const data = await getSendingAccounts()
      setAccounts(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sending accounts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateAccount() {
    try {
      setLoading(true)
      await createSendingAccount(formData)
      toast({
        title: "Success",
        description: "Sending account created successfully",
      })
      setDialogOpen(false)
      setFormData({
        name: "",
        email: "",
        provider: "resend",
        apiKey: "",
        dailyLimit: 50,
        hourlyLimit: 10,
      })
      await loadAccounts()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create sending account",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteAccount(accountId: string) {
    if (!confirm("Are you sure you want to delete this sending account?")) return

    try {
      await deleteSendingAccount(accountId)
      toast({
        title: "Success",
        description: "Sending account deleted",
      })
      await loadAccounts()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete sending account",
        variant: "destructive",
      })
    }
  }

  async function handleToggleAccount(accountId: string, isActive: boolean) {
    try {
      await toggleSendingAccount(accountId, isActive)
      toast({
        title: "Success",
        description: `Sending account ${isActive ? "activated" : "deactivated"}`,
      })
      await loadAccounts()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update sending account",
        variant: "destructive",
      })
    }
  }

  if (loading && accounts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Sending Accounts</h3>
          <p className="text-sm text-muted-foreground">
            Manage multiple email accounts for better deliverability and higher sending limits
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Sending Account</DialogTitle>
              <DialogDescription>
                Connect a new email account to rotate sending and improve deliverability
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Account Name</Label>
                <Input
                  id="name"
                  placeholder="My Primary Account"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="noreply@yourdomain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Select
                  value={formData.provider}
                  onValueChange={(value) => setFormData({ ...formData, provider: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resend">Resend</SelectItem>
                    <SelectItem value="gmail">Gmail</SelectItem>
                    <SelectItem value="outlook">Outlook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="re_xxxxxxxxxxxx"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyLimit">Daily Limit</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    value={formData.dailyLimit}
                    onChange={(e) => setFormData({ ...formData, dailyLimit: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyLimit">Hourly Limit</Label>
                  <Input
                    id="hourlyLimit"
                    type="number"
                    value={formData.hourlyLimit}
                    onChange={(e) => setFormData({ ...formData, hourlyLimit: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <Button onClick={handleCreateAccount} disabled={loading} className="w-full">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Add Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {accounts.length === 0 ? (
        <Card className="p-12 text-center">
          <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No sending accounts</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first sending account to start sending emails with better deliverability
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {accounts.map((account) => (
            <Card key={account.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{account.name}</h4>
                      {account.isActive ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                      {account.bounceRate > 3 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          High Bounce Rate
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{account.email}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Provider: {account.provider}</span>
                      <span>•</span>
                      <span>
                        Sent today: {account.emailsSentToday}/
                        {account.warmupEnabled ? account.warmupDailyLimit : account.dailyLimit}
                      </span>
                      <span>•</span>
                      <span>Bounce rate: {account.bounceRate.toFixed(2)}%</span>
                    </div>
                    {account.warmupEnabled && (
                      <div className="mt-2">
                        <Badge variant="outline">Warmup Stage {account.warmupStage}/5</Badge>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={account.isActive}
                    onCheckedChange={(checked) => handleToggleAccount(account.id, checked)}
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteAccount(account.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Why use multiple sending accounts?</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Rotating between multiple email accounts helps maintain sender reputation, avoid rate limits, and improve
              deliverability. Each account has its own daily limits and warmup schedule.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
