"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Settings,
  XCircle,
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
  const [showNoStepsDialog, setShowNoStepsDialog] = useState(false)
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

  const handleLaunch = async () => {
    if (!campaign.sequenceId) {
      toast.error("No sequence linked to this campaign")
      return
    }

    // Check if sequence has steps
    const hasSteps = linkedSequence?.totalSteps > 0
    if (!hasSteps) {
      setShowNoStepsDialog(true)
      return
    }

    // Check if sequence is active
    if (linkedSequence?.status !== "ACTIVE") {
      toast.warning(
        "Your sequence is not active yet. Prospects will be enrolled but emails won't send until you activate the sequence.",
        { duration: 5000 }
      )
    }

    setIsLaunching(true)

    try {
      const result = await enrollCampaignInSequence(campaign.id, campaign.sequenceId)

      if (result.success) {
        toast.success(
          `🚀 ${result.enrolledCount} prospects enrolled successfully!`,
          { duration: 4000 }
        )
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

  const handleGoToSequence = () => {
    setShowNoStepsDialog(false)
    router.push(`/dashboard/sequences/${campaign.sequenceId}`)
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
  const isSequenceActive = linkedSequence?.status === "ACTIVE"
  const canLaunch = campaign.sequenceId && hasSteps

  return (
    <>
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
              Enroll prospects and start your email sequence
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

          {/* Sequence Status Card */}
          {linkedSequence ? (
            <Card className={!hasSteps ? "border-orange-300 dark:border-orange-800" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {hasSteps ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {linkedSequence.name}
                        <Badge
                          variant="secondary"
                          className={
                            isSequenceActive
                              ? "bg-green-500/10 text-green-600"
                              : "bg-orange-500/10 text-orange-600"
                          }
                        >
                          {linkedSequence.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {hasSteps ? (
                          `${linkedSequence.totalSteps} email steps configured`
                        ) : (
                          <span className="text-orange-600 font-medium">
                            No email steps configured yet
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/sequences/${campaign.sequenceId}`)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>

                {!hasSteps && (
                  <Alert className="mt-4 border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900/50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertTitle className="text-orange-700 dark:text-orange-400">
                      Sequence needs email steps
                    </AlertTitle>
                    <AlertDescription className="text-orange-600 dark:text-orange-300">
                      Before launching, add at least one email step to your sequence. Click
                      "Configure" above to set up your emails.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ) : (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>No Sequence Linked</AlertTitle>
              <AlertDescription>
                Please go back and select or create a sequence for this campaign.
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
            onClick={handleLaunch}
            disabled={isLaunching || !campaign.sequenceId}
            size="lg"
            className="gap-2"
          >
            {isLaunching ? (
              "Launching..."
            ) : canLaunch ? (
              <>
                <Rocket className="h-4 w-4" />
                Launch Campaign
              </>
            ) : (
              <>
                Configure Sequence First
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* No Steps Dialog */}
      <Dialog open={showNoStepsDialog} onOpenChange={setShowNoStepsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Sequence Has No Email Steps
            </DialogTitle>
            <DialogDescription>
              Your sequence doesn't have any email steps yet. You need to configure at least
              one email step before launching your campaign.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              In the sequence builder, you can:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
              <li>Add email steps with personalized content</li>
              <li>Use AI research variables like {"{{companyInfo}}"}</li>
              <li>Set delays between emails</li>
              <li>Add A/B variants for testing</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoStepsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleGoToSequence}>
              <Settings className="mr-2 h-4 w-4" />
              Configure Sequence
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
