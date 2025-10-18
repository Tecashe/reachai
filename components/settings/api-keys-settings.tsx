"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Copy, Plus, Trash2 } from "lucide-react"

const apiKeys = [
  {
    id: "1",
    name: "Production API Key",
    key: "sk_live_••••••••••••••••",
    created: "Jan 15, 2025",
    lastUsed: "2 hours ago",
  },
  {
    id: "2",
    name: "Development API Key",
    key: "sk_test_••••••••••••••••",
    created: "Jan 10, 2025",
    lastUsed: "1 day ago",
  },
]

export function ApiKeysSettings() {
  const [showKey, setShowKey] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for programmatic access</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{apiKey.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {apiKey.key.startsWith("sk_live") ? "Live" : "Test"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-muted-foreground">{apiKey.key}</code>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      {showKey === apiKey.id ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created {apiKey.created} • Last used {apiKey.lastUsed}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Settings</CardTitle>
          <CardDescription>Configure webhooks for real-time event notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input id="webhookUrl" placeholder="https://your-domain.com/webhook" />
          </div>

          <Button>Save Webhook</Button>
        </CardContent>
      </Card>
    </div>
  )
}
