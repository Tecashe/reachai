// "use client"

// import type React from "react"

// import { useState, useTransition } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { RESEARCH_DEPTH_OPTIONS, PERSONALIZATION_LEVELS, TONE_OPTIONS } from "@/lib/constants"
// import { Slider } from "@/components/ui/slider"
// import { Switch } from "@/components/ui/switch"
// import { createCampaign } from "@/lib/actions/campaigns"
// import { useRouter } from "next/navigation"

// export function CreateCampaignForm() {
//   const [dailyLimit, setDailyLimit] = useState([50])
//   const [researchDepth, setResearchDepth] = useState("STANDARD")
//   const [personalizationLevel, setPersonalizationLevel] = useState("MEDIUM")
//   const [tone, setTone] = useState("professional")
//   const [trackOpens, setTrackOpens] = useState(true)
//   const [trackClicks, setTrackClicks] = useState(true)
//   const [isPending, startTransition] = useTransition()
//   const router = useRouter()

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)

//     formData.set("researchDepth", researchDepth)
//     formData.set("personalizationLevel", personalizationLevel)
//     formData.set("tone", tone)
//     formData.set("dailyLimit", dailyLimit[0].toString())
//     formData.set("trackOpens", trackOpens.toString())
//     formData.set("trackClicks", trackClicks.toString())

//     startTransition(async () => {
//       try {
//         const result = await createCampaign(formData)
//         if (result.success) {
//           router.push(`/dashboard/campaigns/wizard/${result.campaignId}`)
//           router.refresh()
//         } else {
//           alert(result.error || "Failed to create campaign")
//         }
//       } catch (error) {
//         alert("An error occurred while creating the campaign")
//       }
//     })
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="space-y-4">
//         <div className="space-y-2">
//           <Label htmlFor="name">Campaign Name</Label>
//           <Input id="name" name="name" placeholder="e.g., Q1 Outreach - Tech Startups" required />
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="description">Description (Optional)</Label>
//           <Textarea
//             id="description"
//             name="description"
//             placeholder="Brief description of your campaign goals..."
//             rows={3}
//           />
//         </div>
//       </div>

//       <div className="border-t border-border pt-6">
//         <h3 className="text-lg font-semibold mb-4">AI Settings</h3>
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="research-depth">Research Depth</Label>
//             <Select value={researchDepth} onValueChange={setResearchDepth}>
//               <SelectTrigger id="research-depth">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {RESEARCH_DEPTH_OPTIONS.map((option) => (
//                   <SelectItem key={option.value} value={option.value}>
//                     <div>
//                       <div className="font-medium">{option.label}</div>
//                       <div className="text-xs text-muted-foreground">{option.description}</div>
//                     </div>
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="personalization">Personalization Level</Label>
//             <Select value={personalizationLevel} onValueChange={setPersonalizationLevel}>
//               <SelectTrigger id="personalization">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {PERSONALIZATION_LEVELS.map((option) => (
//                   <SelectItem key={option.value} value={option.value}>
//                     <div>
//                       <div className="font-medium">{option.label}</div>
//                       <div className="text-xs text-muted-foreground">{option.description}</div>
//                     </div>
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="tone">Tone of Voice</Label>
//             <Select value={tone} onValueChange={setTone}>
//               <SelectTrigger id="tone">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {TONE_OPTIONS.map((toneOption) => (
//                   <SelectItem key={toneOption} value={toneOption}>
//                     {toneOption.charAt(0).toUpperCase() + toneOption.slice(1)}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </div>

//       <div className="border-t border-border pt-6">
//         <h3 className="text-lg font-semibold mb-4">Sending Settings</h3>
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <div className="flex items-center justify-between">
//               <Label htmlFor="daily-limit">Daily Send Limit</Label>
//               <span className="text-sm text-muted-foreground">{dailyLimit[0]} emails/day</span>
//             </div>
//             <Slider id="daily-limit" min={10} max={200} step={10} value={dailyLimit} onValueChange={setDailyLimit} />
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label htmlFor="track-opens">Track Email Opens</Label>
//               <p className="text-sm text-muted-foreground">Monitor when prospects open your emails</p>
//             </div>
//             <Switch id="track-opens" checked={trackOpens} onCheckedChange={setTrackOpens} />
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label htmlFor="track-clicks">Track Link Clicks</Label>
//               <p className="text-sm text-muted-foreground">Monitor when prospects click links</p>
//             </div>
//             <Switch id="track-clicks" checked={trackClicks} onCheckedChange={setTrackClicks} />
//           </div>
//         </div>
//       </div>

//       <div className="flex gap-4 pt-6">
//         <Button type="submit" className="flex-1" disabled={isPending}>
//           {isPending ? "Creating..." : "Create Campaign"}
//         </Button>
//         <Button type="button" variant="outline">
//           Save as Draft
//         </Button>
//       </div>
//     </form>
//   )
// }
"use client"

import type React from "react"

import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RESEARCH_DEPTH_OPTIONS, PERSONALIZATION_LEVELS, TONE_OPTIONS } from "@/lib/constants"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { createCampaign } from "@/lib/actions/campaigns"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Mail, Users, ChevronRight, Loader2 } from "lucide-react"
import { WaveLoader } from "../loader/wave-loader"

interface ExistingSequence {
  id: string
  name: string
  status: string
  totalProspects: number
  emailSequences: { id: string; stepNumber: number }[]
}

export function CreateCampaignForm() {
  const [dailyLimit, setDailyLimit] = useState([50])
  const [researchDepth, setResearchDepth] = useState("STANDARD")
  const [personalizationLevel, setPersonalizationLevel] = useState("MEDIUM")
  const [tone, setTone] = useState("professional")
  const [trackOpens, setTrackOpens] = useState(true)
  const [trackClicks, setTrackClicks] = useState(true)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const [existingSequences, setExistingSequences] = useState<ExistingSequence[]>([])
  const [selectedSequenceId, setSelectedSequenceId] = useState<string>("")
  const [importProspects, setImportProspects] = useState(false)
  const [isLoadingSequences, setIsLoadingSequences] = useState(true)

  useEffect(() => {
    const loadSequences = async () => {
      try {
        const response = await fetch("/api/campaigns?hasSequences=true")
        if (response.ok) {
          const data = await response.json()
          setExistingSequences(data.campaigns || [])
        }
      } catch (error) {
        console.error("Failed to load sequences:", error)
      } finally {
        setIsLoadingSequences(false)
      }
    }

    loadSequences()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    formData.set("researchDepth", researchDepth)
    formData.set("personalizationLevel", personalizationLevel)
    formData.set("tone", tone)
    formData.set("dailyLimit", dailyLimit[0].toString())
    formData.set("trackOpens", trackOpens.toString())
    formData.set("trackClicks", trackClicks.toString())

    if (selectedSequenceId) {
      formData.set("copyFromSequenceId", selectedSequenceId)
      formData.set("importProspects", importProspects.toString())
    }

    startTransition(async () => {
      try {
        const result = await createCampaign(formData)
        if (result.success) {
          router.push(`/dashboard/campaigns/wizard/${result.campaignId}`)
          router.refresh()
        } else {
          alert(result.error || "Failed to create campaign")
        }
      } catch (error) {
        alert("An error occurred while creating the campaign")
      }
    })
  }

  const selectedSequence = existingSequences.find((s) => s.id === selectedSequenceId)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Campaign Name</Label>
          <Input id="name" name="name" placeholder="e.g., Q1 Outreach - Tech Startups" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Brief description of your campaign goals..."
            rows={3}
          />
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          Use Existing Sequence (Optional)
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Copy email templates and optionally import prospects from an existing campaign sequence.
        </p>

        {isLoadingSequences ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            {/* <Loader2 className="h-4 w-4 animate-spin" /> */}
            <WaveLoader size="sm" bars={8} gap="tight" />
            Loading sequences...
          </div>
        ) : existingSequences.length === 0 ? (
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                No existing sequences found. Create your first campaign to build a sequence.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Sequence to Copy</Label>
              <Select value={selectedSequenceId} onValueChange={setSelectedSequenceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Start fresh (no sequence)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Start fresh (no sequence)</SelectItem>
                  {existingSequences.map((seq) => (
                    <SelectItem key={seq.id} value={seq.id}>
                      <div className="flex items-center gap-2">
                        <span>{seq.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {seq.emailSequences.length} steps
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSequence && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="font-medium">{selectedSequence.emailSequences.length} email steps</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {selectedSequence.totalProspects} prospects available
                        </span>
                      </div>
                    </div>
                    <Badge variant={selectedSequence.status === "ACTIVE" ? "default" : "secondary"}>
                      {selectedSequence.status}
                    </Badge>
                  </div>

                  {selectedSequence.totalProspects > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="import-prospects">Import Prospects</Label>
                          <p className="text-xs text-muted-foreground">
                            Copy {selectedSequence.totalProspects} prospects to this campaign
                          </p>
                        </div>
                        <Switch id="import-prospects" checked={importProspects} onCheckedChange={setImportProspects} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold mb-4">AI Settings</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="research-depth">Research Depth</Label>
            <Select value={researchDepth} onValueChange={setResearchDepth}>
              <SelectTrigger id="research-depth">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESEARCH_DEPTH_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personalization">Personalization Level</Label>
            <Select value={personalizationLevel} onValueChange={setPersonalizationLevel}>
              <SelectTrigger id="personalization">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERSONALIZATION_LEVELS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone of Voice</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONE_OPTIONS.map((toneOption) => (
                  <SelectItem key={toneOption} value={toneOption}>
                    {toneOption.charAt(0).toUpperCase() + toneOption.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold mb-4">Sending Settings</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-limit">Daily Send Limit</Label>
              <span className="text-sm text-muted-foreground">{dailyLimit[0]} emails/day</span>
            </div>
            <Slider id="daily-limit" min={10} max={200} step={10} value={dailyLimit} onValueChange={setDailyLimit} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="track-opens">Track Email Opens</Label>
              <p className="text-sm text-muted-foreground">Monitor when prospects open your emails</p>
            </div>
            <Switch id="track-opens" checked={trackOpens} onCheckedChange={setTrackOpens} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="track-clicks">Track Link Clicks</Label>
              <p className="text-sm text-muted-foreground">Monitor when prospects click links</p>
            </div>
            <Switch id="track-clicks" checked={trackClicks} onCheckedChange={setTrackClicks} />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? (
            <>
              {/* <Loader2 className="h-4 w-4 mr-2 animate-spin" /> */}
              <WaveLoader size="sm" bars={8} gap="tight" />
              Creating...
            </>
          ) : (
            <>
              Create Campaign
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
      </div>
    </form>
  )
}
