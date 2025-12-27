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

export function SmtpSetupGuide({ onAccountAdded }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    accountName: "",
    email: "",
    smtpHost: "",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    smtpSecure: false,
    imapHost: "",
    imapPort: "993",
    imapUsername: "",
    imapPassword: "",
    imapSecure: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const response = await fetch("/api/settings/sending-accounts/manual-smtp-imap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error("Failed to add account")
      toast({
        title: "Success",
        description: "Email account connected successfully",
      })
      onAccountAdded()
    } catch (error) {
      console.error("[v0] SMTP setup error:", error)
      toast({
        title: "Error",
        description: "Failed to connect email account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-foreground">Connect Any Email Provider</h3>
        <p className="text-muted-foreground text-lg">Use IMAP and SMTP credentials to connect any email provider</p>
      </div>

      {/* Account Info Section */}
      <div className="space-y-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
        <h4 className="font-semibold text-foreground">Account Information</h4>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Account Name</label>
            <Input
              name="accountName"
              placeholder="My Company Email"
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
        </div>
      </div>

      {/* SMTP Section */}
      <div className="space-y-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
        <h4 className="font-semibold text-foreground">SMTP Configuration (Sending)</h4>

        <div className="grid grid-cols-2 gap-4">
          <Input
            name="smtpHost"
            placeholder="smtp.gmail.com"
            value={formData.smtpHost}
            onChange={handleInputChange}
            required
            className="bg-white/5 border-white/20 col-span-2"
          />
          <Input
            name="smtpPort"
            type="number"
            placeholder="Port"
            value={formData.smtpPort}
            onChange={handleInputChange}
            className="bg-white/5 border-white/20"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="smtpSecure"
              checked={formData.smtpSecure}
              onChange={handleInputChange}
              className="rounded"
            />
            <label className="text-sm text-muted-foreground">Use TLS</label>
          </div>
          <Input
            name="smtpUsername"
            placeholder="Username/Email"
            value={formData.smtpUsername}
            onChange={handleInputChange}
            required
            className="bg-white/5 border-white/20 col-span-2"
          />
          <div className="relative col-span-2">
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

      {/* IMAP Section */}
      <div className="space-y-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
        <h4 className="font-semibold text-foreground">IMAP Configuration (Receiving)</h4>

        <div className="grid grid-cols-2 gap-4">
          <Input
            name="imapHost"
            placeholder="imap.gmail.com"
            value={formData.imapHost}
            onChange={handleInputChange}
            required
            className="bg-white/5 border-white/20 col-span-2"
          />
          <Input
            name="imapPort"
            type="number"
            placeholder="Port"
            value={formData.imapPort}
            onChange={handleInputChange}
            className="bg-white/5 border-white/20"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="imapSecure"
              checked={formData.imapSecure}
              onChange={handleInputChange}
              className="rounded"
            />
            <label className="text-sm text-muted-foreground">Use TLS</label>
          </div>
          <Input
            name="imapUsername"
            placeholder="Username/Email"
            value={formData.imapUsername}
            onChange={handleInputChange}
            required
            className="bg-white/5 border-white/20 col-span-2"
          />
          <Input
            name="imapPassword"
            type="password"
            placeholder="Password"
            value={formData.imapPassword}
            onChange={handleInputChange}
            required
            className="bg-white/5 border-white/20 col-span-2"
          />
        </div>
      </div>

      {/* Submit Button */}
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
            Connect Email Account
          </>
        )}
      </Button>
    </form>
  )
}
