"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const PROVIDERS = {
  gmail: { smtp: { host: "smtp.gmail.com", port: 587 }, imap: { host: "imap.gmail.com", port: 993 } },
  outlook: { smtp: { host: "smtp-mail.outlook.com", port: 587 }, imap: { host: "outlook.office365.com", port: 993 } },
  yahoo: { smtp: { host: "smtp.mail.yahoo.com", port: 465 }, imap: { host: "imap.mail.yahoo.com", port: 993 } },
  custom: null,
}

export function ManualImapSmtpForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState("")
  const [provider, setProvider] = useState("custom")
  const [testing, setTesting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [smtp, setSmtp] = useState({
    host: "",
    port: 587,
    secure: false,
    password: "",
  })

  const [imap, setImap] = useState({
    host: "",
    port: 993,
    tls: true,
    password: "",
  })

  const { toast } = useToast()

  const handleProviderChange = (p: string) => {
    setProvider(p)
    if (p !== "custom") {
      const providerConfig = PROVIDERS[p as keyof typeof PROVIDERS]
      if (providerConfig) {
        setSmtp((s) => ({
          ...s,
          host: providerConfig.smtp.host,
          port: providerConfig.smtp.port,
        }))
        setImap((i) => ({
          ...i,
          host: providerConfig.imap.host,
          port: providerConfig.imap.port,
        }))
      }
    }
  }

  const handleSubmit = async () => {
    if (!email || !smtp.host || !smtp.password || !imap.host || !imap.password) {
      setError("All fields are required")
      return
    }

    setTesting(true)
    setError(null)

    try {
      const response = await fetch("/api/settings/sending-accounts/manual-smtp-imap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} - ${email}`,
          email,
          provider,
          smtpHost: smtp.host,
          smtpPort: smtp.port,
          smtpSecure: smtp.secure,
          smtpUsername: email,
          smtpPassword: smtp.password,
          imapHost: imap.host,
          imapPort: imap.port,
          imapTls: imap.tls,
          imapUsername: email,
          imapPassword: imap.password,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        setError(error.error || "Failed to connect")
        setTesting(false)
        return
      }

      const result = await response.json()

      toast({
        title: "Success",
        description: "Email account connected successfully",
      })

      setTesting(false)
      onSuccess?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Connection failed"
      setError(message)

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })

      setTesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual IMAP/SMTP Configuration</CardTitle>
        <CardDescription>Configure any email provider with manual SMTP/IMAP settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Provider</label>
          <Select value={provider} onValueChange={handleProviderChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gmail">Gmail</SelectItem>
              <SelectItem value="outlook">Outlook / Office 365</SelectItem>
              <SelectItem value="yahoo">Yahoo</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gmail.com" />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-sm">SMTP Settings (Sending)</h3>
          <Input
            placeholder="SMTP Host"
            value={smtp.host}
            onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Port"
            value={smtp.port}
            onChange={(e) => setSmtp({ ...smtp, port: Number.parseInt(e.target.value) })}
          />
          <Input
            type="password"
            placeholder="Password"
            value={smtp.password}
            onChange={(e) => setSmtp({ ...smtp, password: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-sm">IMAP Settings (Receiving)</h3>
          <Input
            placeholder="IMAP Host"
            value={imap.host}
            onChange={(e) => setImap({ ...imap, host: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Port"
            value={imap.port}
            onChange={(e) => setImap({ ...imap, port: Number.parseInt(e.target.value) })}
          />
          <Input
            type="password"
            placeholder="Password"
            value={imap.password}
            onChange={(e) => setImap({ ...imap, password: e.target.value })}
          />
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

        <Button onClick={handleSubmit} disabled={testing} className="w-full">
          {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {testing ? "Testing..." : "Connect Account"}
        </Button>
      </CardContent>
    </Card>
  )
}
