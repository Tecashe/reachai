"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
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
      <Card className="p-5 bg-warning/5 border-warning/20">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-warning-foreground flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Requirements</p>
            <ul className="text-sm text-muted-foreground space-y-1 leading-relaxed">
              <li>• 2-Factor Authentication must be enabled on your Google account</li>
              <li>• Generate an App Password at myaccount.google.com/apppasswords</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Account Name</label>
            <Input
              name="accountName"
              placeholder="My Gmail Account"
              value={formData.accountName}
              onChange={handleInputChange}
              required
              className="bg-background"
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
              className="bg-background"
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
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground mt-2">Enter the password without spaces</p>
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
