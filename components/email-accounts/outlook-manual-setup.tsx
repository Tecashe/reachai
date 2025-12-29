"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { WaveLoader } from "@/components/loader/wave-loader"
import { CheckCircle2 } from "lucide-react"

interface Props {
  onAccountAdded: () => void
}

export function OutlookManualSetup({ onAccountAdded }: Props) {
  const [formData, setFormData] = useState({
    accountName: "",
    email: "",
    smtpHost: "smtp.office365.com",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    imapHost: "outlook.office365.com",
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
      const response = await fetch("/api/settings/sending-accounts/outlook-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, provider: "outlook", connectionMethod: "manual" }),
      })
      if (!response.ok) throw new Error("Failed to add account")
      toast({
        title: "Success",
        description: "Outlook account connected successfully",
      })
      onAccountAdded()
    } catch (error) {
      console.error("[v0] Outlook manual setup error:", error)
      toast({
        title: "Error",
        description: "Failed to connect Outlook account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Manual Setup</h3>
        <p className="text-sm text-muted-foreground">Configure custom SMTP and IMAP</p>
      </div>

      <Card className="p-5 bg-card border-border/50 space-y-4">
        <h4 className="font-medium text-sm text-foreground">Account Information</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Account Name</label>
            <Input
              name="accountName"
              placeholder="My Outlook Account"
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
              placeholder="your-email@outlook.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="h-9 text-sm"
            />
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-card border-border/50 space-y-4">
        <h4 className="font-medium text-sm text-foreground">SMTP Settings</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-foreground mb-1.5">SMTP Host</label>
            <Input
              name="smtpHost"
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
              value={formData.smtpPassword}
              onChange={handleInputChange}
              required
              className="h-9 text-sm"
            />
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-card border-border/50 space-y-4">
        <h4 className="font-medium text-sm text-foreground">IMAP Settings</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-foreground mb-1.5">IMAP Host</label>
            <Input
              name="imapHost"
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
