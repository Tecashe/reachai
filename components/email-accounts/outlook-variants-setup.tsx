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

export function OutlookVariantsSetup({ onAccountAdded }: Props) {
  const [formData, setFormData] = useState({
    accountName: "",
    email: "",
    password: "",
    variant: "outlook.com",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const response = await fetch("/api/settings/sending-accounts/outlook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, provider: "outlook", connectionMethod: "quick" }),
      })
      if (!response.ok) throw new Error("Failed to add account")
      toast({
        title: "Success",
        description: "Outlook account connected successfully",
      })
      onAccountAdded()
    } catch (error) {
      console.error("[v0] Outlook setup error:", error)
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
        <h3 className="text-lg font-semibold text-foreground">Quick Setup</h3>
        <p className="text-sm text-muted-foreground">Enter credentials and we'll handle the rest</p>
      </div>

      <Card className="p-5 bg-card border-border/50 space-y-4">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">Outlook Variant</label>
          <select
            name="variant"
            value={formData.variant}
            onChange={handleInputChange}
            className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="outlook.com">Outlook.com / Hotmail.com</option>
            <option value="office365">Office 365 / Microsoft 365</option>
            <option value="exchange">Exchange Server</option>
          </select>
        </div>

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

        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">Password</label>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="h-9 text-sm"
          />
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
