"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Rocket, Calendar, Clock } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface LaunchStepProps {
  campaign: any
  onNext: () => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function LaunchStep({ campaign, onBack }: LaunchStepProps) {
  const router = useRouter()
  const [isLaunching, setIsLaunching] = useState(false)
  const [settings, setSettings] = useState({
    startDate: new Date().toISOString().split("T")[0],
    dailyLimit: campaign.dailySendLimit || 50,
    sendInBusinessHours: true,
    timezone: "America/New_York",
  })

  const launchCampaign = async () => {
    setIsLaunching(true)

    try {
      const response = await fetch(`/api/campaigns/${campaign.id}/launch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error("Failed to launch campaign")
      }

      toast.success("Campaign launched successfully!")
      router.push(`/dashboard/campaigns/${campaign.id}`)
    } catch (error) {
      console.error("[builtbycashe] Launch error:", error)
      toast.error("Failed to launch campaign. Please try again.")
      setIsLaunching(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 py-6">
        <div className="flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Rocket className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold">Ready to Launch!</h3>
          <p className="text-muted-foreground mt-2">Configure your sending schedule and launch your campaign</p>
        </div>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <Label htmlFor="startDate" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Start Date
          </Label>
          <Input
            id="startDate"
            type="date"
            value={settings.startDate}
            onChange={(e) => setSettings({ ...settings, startDate: e.target.value })}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="dailyLimit">Daily Send Limit</Label>
          <Input
            id="dailyLimit"
            type="number"
            value={settings.dailyLimit}
            onChange={(e) => setSettings({ ...settings, dailyLimit: Number.parseInt(e.target.value) })}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Recommended: 50-100 emails per day for new accounts</p>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="businessHours" className="cursor-pointer">
                Send in Business Hours Only
              </Label>
              <p className="text-xs text-muted-foreground">9 AM - 5 PM recipient's timezone</p>
            </div>
          </div>
          <Switch
            id="businessHours"
            checked={settings.sendInBusinessHours}
            onCheckedChange={(checked) => setSettings({ ...settings, sendInBusinessHours: checked })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack} disabled={isLaunching}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={launchCampaign} disabled={isLaunching} size="lg" className="gap-2">
          <Rocket className="h-4 w-4" />
          {isLaunching ? "Launching..." : "Launch Campaign"}
        </Button>
      </div>
    </div>
  )
}
