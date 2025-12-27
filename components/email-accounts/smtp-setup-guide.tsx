"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { WaveLoader } from "@/components/loader/wave-loader"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

interface Props {
  onAccountAdded: () => void
  onBack: () => void
}

export function SmtpSetupGuide({ onAccountAdded, onBack }: Props) {
  const [formData, setFormData] = useState({
    accountName: "",
    email: "",
    smtpHost: "",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    imapHost: "",
    imapPort: "993",
    imapUsername: "",
    imapPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const response = await fetch("/api/settings/sending-accounts/smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, provider: "smtp", connectionMethod: "smtp" }),
      })
      if (!response.ok) throw new Error("Failed to add account")
      toast({
        title: "Success",
        description: "SMTP account connected successfully",
      })
      onAccountAdded()
    } catch (error) {
      console.error("[v0] SMTP setup error:", error)
      toast({
        title: "Error",
        description: "Failed to connect SMTP account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3">
        <Button type="button" onClick={onBack} variant="ghost" size="icon" className="shrink-0 h-9 w-9">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-xl font-semibold text-foreground">Custom SMTP</h3>
          <p className="text-sm text-muted-foreground">Configure SMTP and IMAP settings</p>
        </div>
      </div>

      <Card className="p-5 bg-card border-border/50 space-y-4">
        <h4 className="font-medium text-sm text-foreground">Account Information</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Account Name</label>
            <Input
              name="accountName"
              placeholder="My Email Account"
              value={formData.accountName}
              onChange={handleInputChange}
              required
              className="h-9 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Email Address</label>
            <Input
              name="email"
              type="email"
              placeholder="your-email@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="h-9 text-sm"
            />
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-card border-border/50 space-y-4">
        <h4 className="font-medium text-sm text-foreground">SMTP Settings (Outgoing)</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-foreground mb-1.5">SMTP Host</label>
            <Input
              name="smtpHost"
              placeholder="smtp.example.com"
              value={formData.smtpHost}
              onChange={handleInputChange}
              required
              className="h-9 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Port</label>
            <Input
              name="smtpPort"
              placeholder="587"
              value={formData.smtpPort}
              onChange={handleInputChange}
              required
              className="h-9 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Username</label>
            <Input
              name="smtpUsername"
              placeholder="username"
              value={formData.smtpUsername}
              onChange={handleInputChange}
              required
              className="h-9 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-foreground mb-1.5">Password</label>
            <Input
              name="smtpPassword"
              type="password"
              placeholder="••••••••"
              value={formData.smtpPassword}
              onChange={handleInputChange}
              required
              className="h-9 text-sm"
            />
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-card border-border/50 space-y-4">
        <h4 className="font-medium text-sm text-foreground">IMAP Settings (Incoming)</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-foreground mb-1.5">IMAP Host</label>
            <Input
              name="imapHost"
              placeholder="imap.example.com"
              value={formData.imapHost}
              onChange={handleInputChange}
              required
              className="h-9 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Port</label>
            <Input
              name="imapPort"
              placeholder="993"
              value={formData.imapPort}
              onChange={handleInputChange}
              required
              className="h-9 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Username</label>
            <Input
              name="imapUsername"
              placeholder="username"
              value={formData.imapUsername}
              onChange={handleInputChange}
              required
              className="h-9 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-foreground mb-1.5">Password</label>
            <Input
              name="imapPassword"
              type="password"
              placeholder="••••••••"
              value={formData.imapPassword}
              onChange={handleInputChange}
              required
              className="h-9 text-sm"
            />
          </div>
        </div>
      </Card>

      <Button type="submit" disabled={isLoading} className="w-full h-10 gap-2" size="sm">
        {isLoading ? (
          <>
            <WaveLoader size="sm" color="bg-primary-foreground" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Connect Account
          </>
        )}
      </Button>
    </form>
  )
}
