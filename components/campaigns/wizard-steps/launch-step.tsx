"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  Rocket,
  Calendar,
  Clock,
  Zap,
  CheckCircle2,
  Mail,
  Users,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { SequenceSelector } from "./sequence-selector"
import { enrollCampaignInSequence } from "@/lib/actions/sequence-enrollment"
import { WaveLoader } from "@/components/loader/wave-loader"

interface LaunchStepWithSequenceProps {
  campaign: any
  onBack: () => void
}

export function LaunchStepWithSequence({ campaign, onBack }: LaunchStepWithSequenceProps) {
  const router = useRouter()
  const [isLaunching, setIsLaunching] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSequenceId, setSelectedSequenceId] = useState<string | null>(null)
  const [linkedSequence, setLinkedSequence] = useState<any>(null)
  const [settings, setSettings] = useState({
    startDate: new Date().toISOString().split("T")[0],
    dailyLimit: campaign.dailySendLimit || 50,
    sendInBusinessHours: true,
    timezone: "America/New_York",
  })

  // Auto-select the sequence created in the wizard
  useEffect(() => {
    const loadSequence = async () => {
      if (campaign.sequenceId) {
        setSelectedSequenceId(campaign.sequenceId)
        try {
          const response = await fetch(`/api/sequences/${campaign.sequenceId}`)
          if (response.ok) {
            const data = await response.json()
            setLinkedSequence(data.sequence)
          }
        } catch (error) {
          console.error("Failed to load linked sequence:", error)
        }
      }
      setIsLoading(false)
    }
    loadSequence()
  }, [campaign.sequenceId])

  const launchCampaign = async () => {
    if (!selectedSequenceId) {
      toast.error("Please select a sequence to enroll prospects")
      return
    }

    setIsLaunching(true)

    try {
      // Enroll all campaign prospects into the selected sequence
      const result = await enrollCampaignInSequence(campaign.id, selectedSequenceId)

      if (result.success) {
        toast.success(`Campaign launched! ${result.enrolledCount} prospects enrolled in sequence.`)
        router.push(`/dashboard/campaigns/${campaign.id}`)
      } else {
        throw new Error(result.error || "Failed to launch campaign")
      }
    } catch (error) {
      console.error("[Launch] Error:", error)
      toast.error("Failed to launch campaign. Please try again.")
      setIsLaunching(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <WaveLoader size="sm" bars={5} />
      </div>
    )
  }

  const prospectsCount = campaign._count?.prospects || campaign.prospects?.length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 py-6">
        <div className="flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Rocket className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold">Ready to Launch!</h3>
          <p className="text-muted-foreground mt-2">
            Review your settings and launch your campaign
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Campaign Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{prospectsCount}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Users className="h-3 w-3" /> Prospects
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {linkedSequence?.totalSteps || "—"}
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Mail className="h-3 w-3" /> Steps
                </div>
              </div>
              <div className="text-center col-span-2 md:col-span-1">
                <div className="text-2xl font-bold text-primary">{settings.dailyLimit}</div>
                <div className="text-xs text-muted-foreground">Emails/day</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sequence Section */}
        <div className="p-4 rounded-lg border bg-accent/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Sequence</h4>
            </div>
            {linkedSequence && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Created in wizard
              </Badge>
            )}
          </div>

          {linkedSequence ? (
            <div className="p-3 rounded-md border bg-background">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{linkedSequence.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {linkedSequence.totalSteps} steps •{" "}
                    {linkedSequence.enableLinkedIn ? "Multi-channel" : "Email only"}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setLinkedSequence(null)
                    setSelectedSequenceId(null)
                  }}
                >
                  Change
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                All {prospectsCount} prospects will be enrolled in the selected sequence
              </p>
              <SequenceSelector
                selectedSequenceId={selectedSequenceId}
                onSelect={(id) => setSelectedSequenceId(id)}
              />
            </>
          )}
        </div>

        {/* Settings */}
        <div className="space-y-4">
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
              onChange={(e) =>
                setSettings({ ...settings, dailyLimit: Number.parseInt(e.target.value) })
              }
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: 50-100 emails per day for new accounts
            </p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="businessHours" className="cursor-pointer">
                  Send in Business Hours Only
                </Label>
                <p className="text-xs text-muted-foreground">
                  9 AM - 5 PM recipient's timezone
                </p>
              </div>
            </div>
            <Switch
              id="businessHours"
              checked={settings.sendInBusinessHours}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, sendInBusinessHours: checked })
              }
            />
          </div>
        </div>

        {/* Warning if no sequence selected */}
        {!selectedSequenceId && (
          <div className="p-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900/50">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Please select a sequence to continue</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack} disabled={isLaunching}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={launchCampaign}
          disabled={isLaunching || !selectedSequenceId}
          size="lg"
          className="gap-2"
        >
          <Rocket className="h-4 w-4" />
          {isLaunching ? "Launching..." : "Launch Campaign"}
        </Button>
      </div>
    </div>
  )
}
