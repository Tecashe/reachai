"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, Loader2 } from "lucide-react"

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-foreground">Quick Setup</h3>
        <p className="text-muted-foreground mt-1">Enter your credentials and we'll handle the rest</p>
      </div>

      <Card className="p-6 bg-white space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Outlook Variant</label>
          <select
            name="variant"
            value={formData.variant}
            onChange={handleInputChange}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
          >
            <option value="outlook.com">Outlook.com / Hotmail.com</option>
            <option value="office365">Office 365 / Microsoft 365</option>
            <option value="exchange">Exchange Server</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Account Name</label>
          <Input
            name="accountName"
            placeholder="My Outlook Account"
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
            placeholder="your-email@outlook.com"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Password</label>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="bg-background"
          />
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
