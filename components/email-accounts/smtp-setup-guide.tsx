"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"

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
      <div className="flex items-center gap-4">
        <Button type="button" onClick={onBack} variant="ghost" size="icon" className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h3 className="text-2xl font-bold text-foreground">Custom SMTP Setup</h3>
          <p className="text-muted-foreground mt-1">Configure your email provider's SMTP and IMAP settings</p>
        </div>
      </div>

      <Card className="p-6 bg-white space-y-5">
        <div>
          <h4 className="font-semibold text-foreground mb-4">Account Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Account Name</label>
              <Input
                name="accountName"
                placeholder="My Email Account"
                value={formData.accountName}
                onChange={handleInputChange}
                required
                className="bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <Input
                name="email"
                type="email"
                placeholder="your-email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-background"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white space-y-5">
        <div>
          <h4 className="font-semibold text-foreground mb-4">SMTP Settings (Outgoing)</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">SMTP Host</label>
              <Input
                name="smtpHost"
                placeholder="smtp.example.com"
                value={formData.smtpHost}
                onChange={handleInputChange}
                required
                className="bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">SMTP Port</label>
              <Input
                name="smtpPort"
                placeholder="587"
                value={formData.smtpPort}
                onChange={handleInputChange}
                required
                className="bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">SMTP Username</label>
              <Input
                name="smtpUsername"
                placeholder="username"
                value={formData.smtpUsername}
                onChange={handleInputChange}
                required
                className="bg-background"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">SMTP Password</label>
              <Input
                name="smtpPassword"
                type="password"
                placeholder="••••••••"
                value={formData.smtpPassword}
                onChange={handleInputChange}
                required
                className="bg-background"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white space-y-5">
        <div>
          <h4 className="font-semibold text-foreground mb-4">IMAP Settings (Incoming)</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">IMAP Host</label>
              <Input
                name="imapHost"
                placeholder="imap.example.com"
                value={formData.imapHost}
                onChange={handleInputChange}
                required
                className="bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">IMAP Port</label>
              <Input
                name="imapPort"
                placeholder="993"
                value={formData.imapPort}
                onChange={handleInputChange}
                required
                className="bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">IMAP Username</label>
              <Input
                name="imapUsername"
                placeholder="username"
                value={formData.imapUsername}
                onChange={handleInputChange}
                required
                className="bg-background"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">IMAP Password</label>
              <Input
                name="imapPassword"
                type="password"
                placeholder="••••••••"
                value={formData.imapPassword}
                onChange={handleInputChange}
                required
                className="bg-background"
              />
            </div>
          </div>
        </div>
      </Card>

      <Button type="submit" disabled={isLoading} className="w-full h-11 bg-primary hover:bg-primary/90 gap-2">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting...
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
