"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

interface Props {
  onAccountAdded: () => void
}

export function GmailAppPasswordFlow({ onAccountAdded }: Props) {
  const [formData, setFormData] = useState({
    accountName: "",
    email: "",
    appPassword: "",
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
      const response = await fetch("/api/settings/sending-accounts/app-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          provider: "gmail",
          connectionMethod: "app_password",
        }),
      })
      if (!response.ok) throw new Error("Failed to add account")
      toast({
        title: "Success",
        description: "Gmail account connected successfully",
      })
      onAccountAdded()
    } catch (error) {
      console.error("[v0] App password setup error:", error)
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
        <h3 className="text-2xl font-bold text-foreground">Gmail App Password</h3>
        <p className="text-muted-foreground text-lg">Use a dedicated app password for your personal Gmail account</p>
      </div>

      {/* Prerequisites banner */}
      <div className="group relative overflow-hidden rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="font-semibold text-amber-300">Requirements</p>
            <ul className="text-sm text-amber-200/80 space-y-1">
              <li>• 2-Factor Authentication must be enabled on your Google account</li>
              <li>• Generate an App Password at myaccount.google.com/apppasswords</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Account Name</label>
          <Input
            name="accountName"
            placeholder="My Gmail Account"
            value={formData.accountName}
            onChange={handleInputChange}
            required
            className="bg-white/5 border-white/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Gmail Address</label>
          <Input
            name="email"
            type="email"
            placeholder="your-email@gmail.com"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="bg-white/5 border-white/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">App Password</label>
          <Input
            name="appPassword"
            type="password"
            placeholder="16-character app password"
            value={formData.appPassword}
            onChange={handleInputChange}
            required
            className="bg-white/5 border-white/20"
          />
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
            Connect with App Password
          </>
        )}
      </Button>
    </form>
  )
}
