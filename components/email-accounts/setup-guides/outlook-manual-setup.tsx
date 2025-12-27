"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react"

interface Props {
  onAccountAdded: () => void
}

export function OutlookManualSetup({ onAccountAdded }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    accountName: "",
    email: "",
    smtpHost: "smtp.office365.com",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    imapHost: "outlook.office365.com",
    imapPort: "993",
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

      const payload = {
        accountName: formData.accountName,
        email: formData.email,
        provider: "outlook",
        connectionMethod: "manual_imap_smtp",
        smtpHost: formData.smtpHost,
        smtpPort: Number.parseInt(formData.smtpPort),
        smtpUsername: formData.smtpUsername,
        smtpPassword: formData.smtpPassword,
        smtpSecure: Number.parseInt(formData.smtpPort) === 465,
        imapHost: formData.imapHost,
        imapPort: Number.parseInt(formData.imapPort),
        imapUsername: formData.smtpUsername, // Use same username
        imapPassword: formData.smtpPassword, // Use same password
        imapSecure: true,
      }

      console.log("[v0] Submitting Outlook manual setup:", { email: formData.email })

      const response = await fetch("/api/settings/sending-accounts/manual-smtp-imap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to add account")
      }

      toast({
        title: "Success",
        description: "Outlook account connected successfully",
      })
      onAccountAdded()
    } catch (error: any) {
      console.error("[v0] Outlook setup error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to connect email account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-foreground">Outlook Manual Setup</h3>
        <p className="text-muted-foreground text-lg">
          Connect your Outlook account with manual SMTP/IMAP configuration
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Account Name</label>
          <Input
            name="accountName"
            placeholder="My Outlook Account"
            value={formData.accountName}
            onChange={handleInputChange}
            required
            className="bg-white/5 border-white/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
          <Input
            name="email"
            type="email"
            placeholder="your-email@domain.com"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="bg-white/5 border-white/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Username</label>
          <Input
            name="smtpUsername"
            placeholder="your-email@domain.com"
            value={formData.smtpUsername}
            onChange={handleInputChange}
            required
            className="bg-white/5 border-white/20"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-foreground mb-2">Password</label>
          <div className="relative">
            <Input
              name="smtpPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.smtpPassword}
              onChange={handleInputChange}
              required
              className="bg-white/5 border-white/20 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Connect Outlook Account
          </>
        )}
      </Button>
    </form>
  )
}
