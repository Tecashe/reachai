

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, Plus, Trash2, Power, PowerOff, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getApiKeys, createApiKey, deleteApiKey, toggleApiKey } from "@/lib/actions/api-keys"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface ApiKey {
  id: string
  name: string
  keyPrefix: string
  isActive: boolean
  lastUsedAt: Date | null
  requestCount: number
  createdAt: Date
  expiresAt: Date | null
}

const AVAILABLE_SCOPES = [
  { value: "campaigns:read", label: "Read Campaigns" },
  { value: "campaigns:write", label: "Write Campaigns" },
  { value: "prospects:read", label: "Read Prospects" },
  { value: "prospects:write", label: "Write Prospects" },
  { value: "emails:send", label: "Send Emails" },
  { value: "analytics:read", label: "Read Analytics" },
]

export function ApiKeysSettings() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showKey, setShowKey] = useState<string | null>(null)
  const [newKeyDialog, setNewKeyDialog] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>([])
  const [newKeyExpiry, setNewKeyExpiry] = useState<string>("never")
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadApiKeys()
  }, [])

  async function loadApiKeys() {
    setLoading(true)
    const result = await getApiKeys()
    if (result.success && result.apiKeys) {
      setApiKeys(result.apiKeys)
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to load API keys",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  async function handleCreateKey() {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the API key",
        variant: "destructive",
      })
      return
    }

    if (newKeyScopes.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one scope",
        variant: "destructive",
      })
      return
    }

    const expiresInDays = newKeyExpiry === "never" ? undefined : Number.parseInt(newKeyExpiry)

    const result = await createApiKey({
      name: newKeyName,
      scopes: newKeyScopes,
      expiresInDays,
    })

    if (result.success && result.apiKey) {
      setCreatedKey(result.apiKey.key)
      setNewKeyName("")
      setNewKeyScopes([])
      setNewKeyExpiry("never")
      await loadApiKeys()
      toast({
        title: "Success",
        description: "API key created successfully",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to create API key",
        variant: "destructive",
      })
    }
  }

  async function handleDeleteKey(keyId: string) {
    if (!confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      return
    }

    const result = await deleteApiKey(keyId)
    if (result.success) {
      await loadApiKeys()
      toast({
        title: "Success",
        description: "API key deleted successfully",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete API key",
        variant: "destructive",
      })
    }
  }

  async function handleToggleKey(keyId: string, isActive: boolean) {
    const result = await toggleApiKey(keyId, !isActive)
    if (result.success) {
      await loadApiKeys()
      toast({
        title: "Success",
        description: `API key ${!isActive ? "activated" : "deactivated"} successfully`,
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to toggle API key",
        variant: "destructive",
      })
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    })
  }

  function formatDate(date: Date | null) {
    if (!date) return "Never"
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for programmatic access</CardDescription>
            </div>
            <Dialog open={newKeyDialog} onOpenChange={setNewKeyDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>Generate a new API key for programmatic access to mailfra</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input
                      id="keyName"
                      placeholder="Production API Key"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="space-y-2">
                      {AVAILABLE_SCOPES.map((scope) => (
                        <div key={scope.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={scope.value}
                            checked={newKeyScopes.includes(scope.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewKeyScopes([...newKeyScopes, scope.value])
                              } else {
                                setNewKeyScopes(newKeyScopes.filter((s) => s !== scope.value))
                              }
                            }}
                          />
                          <label htmlFor={scope.value} className="text-sm cursor-pointer">
                            {scope.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiration</Label>
                    <Select value={newKeyExpiry} onValueChange={setNewKeyExpiry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewKeyDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateKey}>Create Key</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading API keys...</p>
          ) : apiKeys.length === 0 ? (
            <p className="text-sm text-muted-foreground">No API keys yet. Create one to get started.</p>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{apiKey.name}</p>
                      <Badge variant={apiKey.isActive ? "default" : "secondary"} className="text-xs">
                        {apiKey.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date() && (
                        <Badge variant="destructive" className="text-xs">
                          Expired
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-muted-foreground">{apiKey.keyPrefix}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(apiKey.keyPrefix)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created {formatDate(apiKey.createdAt)} • Last used {formatDate(apiKey.lastUsedAt)} •{" "}
                      {apiKey.requestCount} requests
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleToggleKey(apiKey.id, apiKey.isActive)}>
                      {apiKey.isActive ? (
                        <Power className="h-4 w-4 text-green-500" />
                      ) : (
                        <PowerOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteKey(apiKey.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {createdKey && (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="text-green-600">API Key Created Successfully!</CardTitle>
            <CardDescription>
              Copy this key now - you won't be able to see it again for security reasons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
              <code className="flex-1 text-sm font-mono">{createdKey}</code>
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(createdKey)}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setCreatedKey(null)}>
              I've saved my key
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>Learn how to use the mailfra API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Authentication</h4>
            <p className="text-sm text-muted-foreground">Include your API key in the Authorization header:</p>
            <code className="block p-3 bg-muted rounded text-sm">Authorization: Bearer sk_live_your_api_key_here</code>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Base URL</h4>
            <code className="block p-3 bg-muted rounded text-sm">https://mailfra.com/api/v1</code>
          </div>
          <Button variant="outline" asChild>
            <a href="/docs" target="_blank" rel="noreferrer">
              View Full Documentation
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
