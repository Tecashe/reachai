"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const PROVIDERS = {
  gmail: { name: "Gmail", smtp: "smtp.gmail.com", smtpPort: 587, imap: "imap.gmail.com", imapPort: 993 },
  outlook: {
    name: "Outlook",
    smtp: "smtp-mail.outlook.com",
    smtpPort: 587,
    imap: "outlook.office365.com",
    imapPort: 993,
  },
  yahoo: { name: "Yahoo", smtp: "smtp.mail.yahoo.com", smtpPort: 465, imap: "imap.mail.yahoo.com", imapPort: 993 },
  custom: { name: "Custom", smtp: "", smtpPort: 587, imap: "", imapPort: 993 },
}

export function ManualSmtpSetup({ onSuccess }: { onSuccess?: () => void }) {
  const [provider, setProvider] = useState("gmail")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [smtpHost, setSmtpHost] = useState(PROVIDERS["gmail"].smtp)
  const [smtpPort, setSmtpPort] = useState(PROVIDERS["gmail"].smtpPort)
  const [imapHost, setImapHost] = useState(PROVIDERS["gmail"].imap)
  const [imapPort, setImapPort] = useState(PROVIDERS["gmail"].imapPort)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider)
    const config = PROVIDERS[newProvider as keyof typeof PROVIDERS]
    setSmtpHost(config.smtp)
    setSmtpPort(config.smtpPort)
    setImapHost(config.imap)
    setImapPort(config.imapPort)
  }

  const handleConnect = async () => {
    if (!email || !password || !smtpHost || !imapHost) {
      setError("All fields are required")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/settings/sending-accounts/manual-smtp-imap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} - ${email}`,
          email,
          provider,
          smtpHost,
          smtpPort,
          smtpSecure: smtpPort === 465,
          smtpUsername: email,
          smtpPassword: password,
          imapHost,
          imapPort,
          imapTls: imapPort === 993,
          imapUsername: email,
          imapPassword: password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to connect")
        return
      }

      setSuccess(true)
      toast({ title: "Success", description: "Email account connected!" })
      setTimeout(() => onSuccess?.(), 1500)
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual SMTP/IMAP</CardTitle>
        <CardDescription>Configure any email provider</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Provider</label>
          <Select value={provider} onValueChange={handleProviderChange} disabled={success}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PROVIDERS).map(([key, val]) => (
                <SelectItem key={key} value={key}>
                  {val.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={success}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password / App Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={success}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-2">SMTP Host</label>
            <Input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} disabled={success} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">SMTP Port</label>
            <Input
              type="number"
              value={smtpPort}
              onChange={(e) => setSmtpPort(Number(e.target.value))}
              disabled={success}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-2">IMAP Host</label>
            <Input value={imapHost} onChange={(e) => setImapHost(e.target.value)} disabled={success} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">IMAP Port</label>
            <Input
              type="number"
              value={imapPort}
              onChange={(e) => setImapPort(Number(e.target.value))}
              disabled={success}
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Connected successfully!</AlertDescription>
          </Alert>
        )}

        <Button onClick={handleConnect} disabled={loading || success} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Testing..." : "Connect Account"}
        </Button>
      </CardContent>
    </Card>
  )
}
