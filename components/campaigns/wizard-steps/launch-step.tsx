"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  ArrowLeft,
  Rocket,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle2,
  Mail,
  Users,
  AlertTriangle,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
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
  const [linkedSequence, setLinkedSequence] = useState<any>(null)
  const [settings, setSettings] = useState({
    startDate: new Date().toISOString().split("T")[0],
    dailyLimit: campaign.dailySendLimit || 50,
    sendInBusinessHours: true,
  })

  // Load the linked sequence
  useEffect(() => {
    const loadSequence = async () => {
      if (campaign.sequenceId) {
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

  const handleLaunchAndConfigure = async () => {
    if (!campaign.sequenceId) {
      toast.error("No sequence linked to this campaign")
      return
    }

    setIsLaunching(true)

    try {
      // Enroll all campaign prospects into the sequence
      const result = await enrollCampaignInSequence(campaign.id, campaign.sequenceId)

      if (result.success) {
        toast.success(
          `${result.enrolledCount} prospects enrolled! Now configure your sequence.`
        )
        // Redirect to sequence builder
        router.push(`/dashboard/sequences/${campaign.sequenceId}`)
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
  const hasSteps = linkedSequence?.totalSteps > 0
  const isSequenceReady = linkedSequence?.status === "ACTIVE" && hasSteps

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
          <h3 className="text-2xl font-bold">Launch Your Campaign</h3>
          <p className="text-muted-foreground mt-2">
            Enroll prospects and configure your email sequence
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Campaign Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{prospectsCount}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Users className="h-3 w-3" /> Prospects
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  <Sparkles className="h-6 w-6 mx-auto" />
                </div>
                <div className="text-xs text-muted-foreground">AI Research</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {linkedSequence?.totalSteps || 0}
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Mail className="h-3 w-3" /> Steps
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Linked Sequence Info */}
        {linkedSequence ? (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Linked Sequence
                </CardTitle>
                <Badge
                  variant="secondary"
                  className={
                    linkedSequence.status === "ACTIVE"
                      ? "bg-green-500/10 text-green-600"
                      : "bg-orange-500/10 text-orange-600"
                  }
                >
                  {linkedSequence.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{linkedSequence.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {hasSteps
                      ? `${linkedSequence.totalSteps} steps configured`
                      : "No steps configured yet"}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/dashboard/sequences/${campaign.sequenceId}`)
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Sequence
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Sequence Linked</AlertTitle>
            <AlertDescription>
              Please go back and select or create a sequence for this campaign.
            </AlertDescription>
          </Alert>
        )}

        {/* Important Notice */}
        {linkedSequence && !hasSteps && (
          <Alert>
            <Sparkles className="h-4 w-4 text-purple-500" />
            <AlertTitle>Next Step: Configure Your Sequence</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                After launching, you'll be taken to the sequence builder where you can:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                <li>Add email steps with personalized content</li>
                <li>
                  Use AI research variables like{" "}
                  <code className="bg-muted px-1 rounded">{"{{companyInfo}}"}</code>,{" "}
                  <code className="bg-muted px-1 rounded">{"{{painPoint}}"}</code>
                </li>
                <li>Set up multi-channel touchpoints (LinkedIn, calls)</li>
                <li>Configure A/B testing for subject lines</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

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
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack} disabled={isLaunching}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleLaunchAndConfigure}
          disabled={isLaunching || !campaign.sequenceId}
          size="lg"
          className="gap-2"
        >
          {isLaunching ? (
            "Launching..."
          ) : hasSteps ? (
            <>
              <Rocket className="h-4 w-4" />
              Launch Campaign
            </>
          ) : (
            <>
              Launch & Configure Sequence
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
