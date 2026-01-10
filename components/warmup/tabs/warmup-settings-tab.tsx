// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Switch } from "@/components/ui/switch"
// import { Slider } from "@/components/ui/slider"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { toast } from "sonner"
// import { Settings, Shield, FileText, Bell, CreditCard, Save, RefreshCw } from "lucide-react"

// interface WarmupSettingsTabProps {
//   userTier: "FREE" | "STARTER" | "PRO" | "AGENCY"
//   onSettingsUpdate: () => void
// }

// export function WarmupSettingsTab({ userTier, onSettingsUpdate }: WarmupSettingsTabProps) {
//   const [saving, setSaving] = useState(false)

//   // Global Warmup Settings
//   const [startVolume, setStartVolume] = useState(5)
//   const [targetVolume, setTargetVolume] = useState(50)
//   const [rampSpeed, setRampSpeed] = useState("moderate")
//   const [businessHoursOnly, setBusinessHoursOnly] = useState(true)
//   const [weekendSending, setWeekendSending] = useState(false)
//   const [timezone, setTimezone] = useState("America/New_York")

//   // Spam Recovery Settings
//   const [autoSpamRecovery, setAutoSpamRecovery] = useState(true)
//   const [moveToInbox, setMoveToInbox] = useState(true)
//   const [markAsNotSpam, setMarkAsNotSpam] = useState(true)
//   const [markAsImportant, setMarkAsImportant] = useState(true)
//   const [starMessage, setStarMessage] = useState(false)
//   const [addToPrimary, setAddToPrimary] = useState(true)
//   const [recoveryFrequency, setRecoveryFrequency] = useState("immediate")

//   // Email Content Settings
//   const [contentQuality, setContentQuality] = useState("enhanced")
//   const [replyPercentage, setReplyPercentage] = useState(50)
//   const [conversationLength, setConversationLength] = useState(3)

//   // Alert Settings
//   const [emailNotifications, setEmailNotifications] = useState(true)
//   const [inboxRateThreshold, setInboxRateThreshold] = useState(90)
//   const [spamRateThreshold, setSpamRateThreshold] = useState(5)
//   const [reputationThreshold, setReputationThreshold] = useState(85)

//   const handleSaveSettings = async () => {
//     setSaving(true)
//     try {
//       const response = await fetch("/api/warmup/settings", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           startVolume,
//           targetVolume,
//           rampSpeed,
//           businessHoursOnly,
//           weekendSending,
//           timezone,
//           spamRecovery: {
//             enabled: autoSpamRecovery,
//             moveToInbox,
//             markAsNotSpam,
//             markAsImportant,
//             starMessage,
//             addToPrimary,
//             frequency: recoveryFrequency,
//           },
//           contentQuality,
//           replyPercentage,
//           conversationLength,
//           alerts: {
//             emailNotifications,
//             inboxRateThreshold,
//             spamRateThreshold,
//             reputationThreshold,
//           },
//         }),
//       })

//       if (!response.ok) throw new Error("Failed to save")
//       toast.success("Settings saved successfully")
//       onSettingsUpdate()
//     } catch (error) {
//       toast.error("Failed to save settings")
//     } finally {
//       setSaving(false)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       {/* Global Warmup Settings */}
//       <Card className="border-border">
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <Settings className="h-5 w-5 text-muted-foreground" />
//             <CardTitle>Global Warmup Settings</CardTitle>
//           </div>
//           <CardDescription>Default settings for all new email accounts</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             <div className="space-y-3">
//               <Label>Default Starting Volume</Label>
//               <div className="flex items-center gap-4">
//                 <Slider
//                   value={[startVolume]}
//                   onValueChange={([v]) => setStartVolume(v)}
//                   min={2}
//                   max={10}
//                   step={1}
//                   className="flex-1"
//                 />
//                 <span className="w-12 text-right font-medium">{startVolume}</span>
//               </div>
//               <p className="text-xs text-muted-foreground">Emails per day when starting warmup</p>
//             </div>

//             <div className="space-y-3">
//               <Label>Default Target Volume</Label>
//               <div className="flex items-center gap-4">
//                 <Slider
//                   value={[targetVolume]}
//                   onValueChange={([v]) => setTargetVolume(v)}
//                   min={20}
//                   max={100}
//                   step={5}
//                   className="flex-1"
//                 />
//                 <span className="w-12 text-right font-medium">{targetVolume}</span>
//               </div>
//               <p className="text-xs text-muted-foreground">Maximum emails per day after warmup</p>
//             </div>
//           </div>

//           <div className="space-y-3">
//             <Label>Ramp-up Speed</Label>
//             <div className="flex gap-4">
//               {["conservative", "moderate", "aggressive"].map((speed) => (
//                 <label
//                   key={speed}
//                   className={`flex-1 p-4 border rounded-lg cursor-pointer transition-colors ${
//                     rampSpeed === speed ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="rampSpeed"
//                     value={speed}
//                     checked={rampSpeed === speed}
//                     onChange={(e) => setRampSpeed(e.target.value)}
//                     className="sr-only"
//                   />
//                   <p className="font-medium capitalize text-foreground">{speed}</p>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     {speed === "conservative" && "30-35 days to full volume"}
//                     {speed === "moderate" && "21-28 days to full volume"}
//                     {speed === "aggressive" && "14-21 days to full volume"}
//                   </p>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="grid gap-6 md:grid-cols-2">
//             <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
//               <div>
//                 <Label>Business Hours Only</Label>
//                 <p className="text-xs text-muted-foreground mt-1">Send emails during work hours</p>
//               </div>
//               <Switch checked={businessHoursOnly} onCheckedChange={setBusinessHoursOnly} />
//             </div>

//             <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
//               <div>
//                 <Label>Weekend Sending</Label>
//                 <p className="text-xs text-muted-foreground mt-1">Continue warmup on weekends</p>
//               </div>
//               <Switch checked={weekendSending} onCheckedChange={setWeekendSending} />
//             </div>
//           </div>

//           <div className="space-y-3">
//             <Label>Timezone</Label>
//             <Select value={timezone} onValueChange={setTimezone}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
//                 <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
//                 <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
//                 <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
//                 <SelectItem value="Europe/London">London (GMT)</SelectItem>
//                 <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Spam Recovery Settings */}
//       <Card className="border-border">
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <Shield className="h-5 w-5 text-muted-foreground" />
//             <CardTitle>Spam Recovery Settings</CardTitle>
//           </div>
//           <CardDescription>Automatically rescue emails that land in spam</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
//             <div>
//               <Label className="text-base">Auto Spam Recovery</Label>
//               <p className="text-sm text-muted-foreground mt-1">Automatically move warmup emails out of spam folder</p>
//             </div>
//             <Switch checked={autoSpamRecovery} onCheckedChange={setAutoSpamRecovery} />
//           </div>

//           {autoSpamRecovery && (
//             <>
//               <div className="space-y-3">
//                 <Label>Recovery Actions</Label>
//                 <div className="grid gap-3 md:grid-cols-2">
//                   <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-primary/50">
//                     <input
//                       type="checkbox"
//                       checked={moveToInbox}
//                       onChange={(e) => setMoveToInbox(e.target.checked)}
//                       className="rounded border-border"
//                     />
//                     <span className="text-sm">Move to inbox</span>
//                   </label>
//                   <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-primary/50">
//                     <input
//                       type="checkbox"
//                       checked={markAsNotSpam}
//                       onChange={(e) => setMarkAsNotSpam(e.target.checked)}
//                       className="rounded border-border"
//                     />
//                     <span className="text-sm">Mark as not spam</span>
//                   </label>
//                   <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-primary/50">
//                     <input
//                       type="checkbox"
//                       checked={markAsImportant}
//                       onChange={(e) => setMarkAsImportant(e.target.checked)}
//                       className="rounded border-border"
//                     />
//                     <span className="text-sm">Mark as important</span>
//                   </label>
//                   <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-primary/50">
//                     <input
//                       type="checkbox"
//                       checked={starMessage}
//                       onChange={(e) => setStarMessage(e.target.checked)}
//                       className="rounded border-border"
//                     />
//                     <span className="text-sm">Star message</span>
//                   </label>
//                   <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-primary/50">
//                     <input
//                       type="checkbox"
//                       checked={addToPrimary}
//                       onChange={(e) => setAddToPrimary(e.target.checked)}
//                       className="rounded border-border"
//                     />
//                     <span className="text-sm">Add to Primary tab (Gmail)</span>
//                   </label>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <Label>Recovery Frequency</Label>
//                 <Select value={recoveryFrequency} onValueChange={setRecoveryFrequency}>
//                   <SelectTrigger className="w-full md:w-[200px]">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="immediate">Immediate</SelectItem>
//                     <SelectItem value="15min">Every 15 minutes</SelectItem>
//                     <SelectItem value="hourly">Hourly</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>

//       {/* Email Content Settings */}
//       <Card className="border-border">
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <FileText className="h-5 w-5 text-muted-foreground" />
//             <CardTitle>Email Content Settings</CardTitle>
//           </div>
//           <CardDescription>Configure AI-generated warmup email quality</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="space-y-3">
//             <Label>Conversation Quality Level</Label>
//             <Select value={contentQuality} onValueChange={setContentQuality}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="standard">Standard - Basic conversations</SelectItem>
//                 <SelectItem value="enhanced">Enhanced - Industry-relevant topics (AI)</SelectItem>
//                 <SelectItem value="premium">Premium - Contextual, human-like exchanges</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-3">
//             <Label>Reply Percentage</Label>
//             <div className="flex items-center gap-4">
//               <Slider
//                 value={[replyPercentage]}
//                 onValueChange={([v]) => setReplyPercentage(v)}
//                 min={30}
//                 max={80}
//                 step={5}
//                 className="flex-1"
//               />
//               <span className="w-12 text-right font-medium">{replyPercentage}%</span>
//             </div>
//             <p className="text-xs text-muted-foreground">Percentage of warmup emails that should receive replies</p>
//           </div>

//           <div className="space-y-3">
//             <Label>Conversation Length</Label>
//             <div className="flex items-center gap-4">
//               <Slider
//                 value={[conversationLength]}
//                 onValueChange={([v]) => setConversationLength(v)}
//                 min={1}
//                 max={5}
//                 step={1}
//                 className="flex-1"
//               />
//               <span className="w-12 text-right font-medium">{conversationLength}</span>
//             </div>
//             <p className="text-xs text-muted-foreground">Back-and-forth exchanges per conversation</p>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Alert Preferences */}
//       <Card className="border-border">
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <Bell className="h-5 w-5 text-muted-foreground" />
//             <CardTitle>Alert Preferences</CardTitle>
//           </div>
//           <CardDescription>Configure notifications for warmup issues</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
//             <div>
//               <Label>Email Notifications</Label>
//               <p className="text-sm text-muted-foreground mt-1">Receive alerts via email</p>
//             </div>
//             <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
//           </div>

//           <div className="space-y-4">
//             <Label>Alert Thresholds</Label>
//             <div className="grid gap-4 md:grid-cols-3">
//               <div className="space-y-2">
//                 <Label className="text-sm text-muted-foreground">Inbox rate drops below</Label>
//                 <div className="flex items-center gap-2">
//                   <Input
//                     type="number"
//                     value={inboxRateThreshold}
//                     onChange={(e) => setInboxRateThreshold(Number(e.target.value))}
//                     className="w-20"
//                     min={50}
//                     max={99}
//                   />
//                   <span className="text-muted-foreground">%</span>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label className="text-sm text-muted-foreground">Spam rate exceeds</Label>
//                 <div className="flex items-center gap-2">
//                   <Input
//                     type="number"
//                     value={spamRateThreshold}
//                     onChange={(e) => setSpamRateThreshold(Number(e.target.value))}
//                     className="w-20"
//                     min={1}
//                     max={20}
//                   />
//                   <span className="text-muted-foreground">%</span>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label className="text-sm text-muted-foreground">Reputation below</Label>
//                 <div className="flex items-center gap-2">
//                   <Input
//                     type="number"
//                     value={reputationThreshold}
//                     onChange={(e) => setReputationThreshold(Number(e.target.value))}
//                     className="w-20"
//                     min={50}
//                     max={99}
//                   />
//                   <span className="text-muted-foreground">/100</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Billing & Usage */}
//       <Card className="border-border">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <CreditCard className="h-5 w-5 text-muted-foreground" />
//               <CardTitle>Billing & Usage</CardTitle>
//             </div>
//             <Badge variant="outline" className="capitalize">
//               {userTier}
//             </Badge>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-4 md:grid-cols-3">
//             <div className="p-4 bg-muted/50 rounded-lg">
//               <p className="text-sm text-muted-foreground">Warmup Emails This Month</p>
//               <p className="text-2xl font-bold text-foreground mt-1">1,247 / 5,000</p>
//             </div>
//             <div className="p-4 bg-muted/50 rounded-lg">
//               <p className="text-sm text-muted-foreground">API Calls Remaining</p>
//               <p className="text-2xl font-bold text-foreground mt-1">8,753 / 10,000</p>
//             </div>
//             <div className="p-4 bg-muted/50 rounded-lg">
//               <p className="text-sm text-muted-foreground">Network Access</p>
//               <Badge className="mt-2">
//                 {userTier === "FREE" || userTier === "STARTER" ? "Basic Pool" : "P2P Premium"}
//               </Badge>
//             </div>
//           </div>

//           {(userTier === "FREE" || userTier === "STARTER") && <Button className="w-full mt-4">Upgrade Plan</Button>}
//         </CardContent>
//       </Card>

//       {/* Save Button */}
//       <div className="flex justify-end gap-4">
//         <Button variant="outline" disabled={saving}>
//           <RefreshCw className="h-4 w-4 mr-2" />
//           Reset to Defaults
//         </Button>
//         <Button onClick={handleSaveSettings} disabled={saving}>
//           {saving ? (
//             <>
//               <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//               Saving...
//             </>
//           ) : (
//             <>
//               <Save className="h-4 w-4 mr-2" />
//               Save Settings
//             </>
//           )}
//         </Button>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Settings, Shield, FileText, Bell, CreditCard, Save, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { WaveLoader } from "@/components/loader/wave-loader"

interface WarmupSettingsTabProps {
  userTier: "FREE" | "STARTER" | "PRO" | "AGENCY"
  onSettingsUpdate: () => void
}

export function WarmupSettingsTab({ userTier, onSettingsUpdate }: WarmupSettingsTabProps) {
  const [saving, setSaving] = useState(false)
  const [usage, setUsage] = useState<{
    warmupEmails: { used: number; limit: number }
    apiCalls: { used: number; limit: number }
    networkAccess: string
  } | null>(null)

  // Global Warmup Settings
  const [startVolume, setStartVolume] = useState(5)
  const [targetVolume, setTargetVolume] = useState(50)
  const [rampSpeed, setRampSpeed] = useState("moderate")
  const [businessHoursOnly, setBusinessHoursOnly] = useState(true)
  const [weekendSending, setWeekendSending] = useState(false)
  const [timezone, setTimezone] = useState("America/New_York")

  // Spam Recovery Settings
  const [autoSpamRecovery, setAutoSpamRecovery] = useState(true)
  const [moveToInbox, setMoveToInbox] = useState(true)
  const [markAsNotSpam, setMarkAsNotSpam] = useState(true)
  const [markAsImportant, setMarkAsImportant] = useState(true)
  const [starMessage, setStarMessage] = useState(false)
  const [addToPrimary, setAddToPrimary] = useState(true)
  const [recoveryFrequency, setRecoveryFrequency] = useState("immediate")

  // Email Content Settings
  const [contentQuality, setContentQuality] = useState("enhanced")
  const [replyPercentage, setReplyPercentage] = useState(50)
  const [conversationLength, setConversationLength] = useState(3)

  // Alert Settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [inboxRateThreshold, setInboxRateThreshold] = useState(90)
  const [spamRateThreshold, setSpamRateThreshold] = useState(5)
  const [reputationThreshold, setReputationThreshold] = useState(85)

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch("/api/warmup/usage")
        if (response.ok) {
          const data = await response.json()
          setUsage(data)
        }
      } catch (error) {
        console.error("Error fetching usage:", error)
      }
    }
    fetchUsage()
  }, [])

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/warmup/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startVolume,
          targetVolume,
          rampSpeed,
          businessHoursOnly,
          weekendSending,
          timezone,
          spamRecovery: {
            enabled: autoSpamRecovery,
            moveToInbox,
            markAsNotSpam,
            markAsImportant,
            starMessage,
            addToPrimary,
            frequency: recoveryFrequency,
          },
          contentQuality,
          replyPercentage,
          conversationLength,
          alerts: {
            emailNotifications,
            inboxRateThreshold,
            spamRateThreshold,
            reputationThreshold,
          },
        }),
      })

      if (!response.ok) throw new Error("Failed to save")
      toast.success("Settings saved successfully")
      onSettingsUpdate()
    } catch (error) {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Global Warmup Settings */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Global Warmup Settings</CardTitle>
          </div>
          <CardDescription>Default settings for all new email accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label>Default Starting Volume</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[startVolume]}
                  onValueChange={([v]) => setStartVolume(v)}
                  min={2}
                  max={10}
                  step={1}
                  className="flex-1"
                />
                <span className="w-12 text-right font-medium">{startVolume}</span>
              </div>
              <p className="text-xs text-muted-foreground">Emails per day when starting warmup</p>
            </div>

            <div className="space-y-3">
              <Label>Default Target Volume</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[targetVolume]}
                  onValueChange={([v]) => setTargetVolume(v)}
                  min={20}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="w-12 text-right font-medium">{targetVolume}</span>
              </div>
              <p className="text-xs text-muted-foreground">Maximum emails per day after warmup</p>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Ramp-up Speed</Label>
            <div className="flex gap-4">
              {["conservative", "moderate", "aggressive"].map((speed) => (
                <label
                  key={speed}
                  className={`flex-1 p-4 border rounded-lg cursor-pointer transition-colors ${
                    rampSpeed === speed ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="rampSpeed"
                    value={speed}
                    checked={rampSpeed === speed}
                    onChange={(e) => setRampSpeed(e.target.value)}
                    className="sr-only"
                  />
                  <p className="font-medium capitalize text-foreground">{speed}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {speed === "conservative" && "30-35 days to full volume"}
                    {speed === "moderate" && "21-28 days to full volume"}
                    {speed === "aggressive" && "14-21 days to full volume"}
                  </p>
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <Label>Business Hours Only</Label>
                <p className="text-xs text-muted-foreground mt-1">Send emails during work hours</p>
              </div>
              <Switch checked={businessHoursOnly} onCheckedChange={setBusinessHoursOnly} />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <Label>Weekend Sending</Label>
                <p className="text-xs text-muted-foreground mt-1">Continue warmup on weekends</p>
              </div>
              <Switch checked={weekendSending} onCheckedChange={setWeekendSending} />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Spam Recovery Settings */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Spam Recovery Settings</CardTitle>
          </div>
          <CardDescription>Automatically rescue emails that land in spam</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <Label className="text-base">Auto Spam Recovery</Label>
              <p className="text-sm text-muted-foreground mt-1">Automatically move warmup emails out of spam folder</p>
            </div>
            <Switch checked={autoSpamRecovery} onCheckedChange={setAutoSpamRecovery} />
          </div>

          {autoSpamRecovery && (
            <>
              <div className="space-y-3">
                <Label>Recovery Actions</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-primary/50">
                    <input
                      type="checkbox"
                      checked={moveToInbox}
                      onChange={(e) => setMoveToInbox(e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm">Move to inbox</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-primary/50">
                    <input
                      type="checkbox"
                      checked={markAsNotSpam}
                      onChange={(e) => setMarkAsNotSpam(e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm">Mark as not spam</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-primary/50">
                    <input
                      type="checkbox"
                      checked={markAsImportant}
                      onChange={(e) => setMarkAsImportant(e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm">Mark as important</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-primary/50">
                    <input
                      type="checkbox"
                      checked={starMessage}
                      onChange={(e) => setStarMessage(e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm">Star message</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-primary/50">
                    <input
                      type="checkbox"
                      checked={addToPrimary}
                      onChange={(e) => setAddToPrimary(e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm">Add to Primary tab (Gmail)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Recovery Frequency</Label>
                <Select value={recoveryFrequency} onValueChange={setRecoveryFrequency}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="15min">Every 15 minutes</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Email Content Settings */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Email Content Settings</CardTitle>
          </div>
          <CardDescription>Configure AI-generated warmup email quality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Conversation Quality Level</Label>
            <Select value={contentQuality} onValueChange={setContentQuality}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard - Basic conversations</SelectItem>
                <SelectItem value="enhanced">Enhanced - Industry-relevant topics (AI)</SelectItem>
                <SelectItem value="premium">Premium - Contextual, human-like exchanges</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Reply Percentage</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[replyPercentage]}
                onValueChange={([v]) => setReplyPercentage(v)}
                min={30}
                max={80}
                step={5}
                className="flex-1"
              />
              <span className="w-12 text-right font-medium">{replyPercentage}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Percentage of warmup emails that should receive replies</p>
          </div>

          <div className="space-y-3">
            <Label>Conversation Length</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[conversationLength]}
                onValueChange={([v]) => setConversationLength(v)}
                min={1}
                max={5}
                step={1}
                className="flex-1"
              />
              <span className="w-12 text-right font-medium">{conversationLength}</span>
            </div>
            <p className="text-xs text-muted-foreground">Back-and-forth exchanges per conversation</p>
          </div>
        </CardContent>
      </Card>

      {/* Alert Preferences */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Alert Preferences</CardTitle>
          </div>
          <CardDescription>Configure notifications for warmup issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground mt-1">Receive alerts via email</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          <div className="space-y-4">
            <Label>Alert Thresholds</Label>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Inbox rate drops below</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={inboxRateThreshold}
                    onChange={(e) => setInboxRateThreshold(Number(e.target.value))}
                    className="w-20"
                    min={50}
                    max={99}
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Spam rate exceeds</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={spamRateThreshold}
                    onChange={(e) => setSpamRateThreshold(Number(e.target.value))}
                    className="w-20"
                    min={1}
                    max={20}
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Reputation below</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={reputationThreshold}
                    onChange={(e) => setReputationThreshold(Number(e.target.value))}
                    className="w-20"
                    min={50}
                    max={99}
                  />
                  <span className="text-muted-foreground">/100</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing & Usage */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Billing & Usage</CardTitle>
            </div>
            <Badge variant="outline" className="capitalize">
              {userTier}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {usage ? (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Warmup Emails This Month</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {usage.warmupEmails.used.toLocaleString()} / {usage.warmupEmails.limit.toLocaleString()}
                </p>
                <Progress value={(usage.warmupEmails.used / usage.warmupEmails.limit) * 100} className="h-1.5 mt-2" />
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">API Calls Remaining</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {usage.apiCalls.used.toLocaleString()} / {usage.apiCalls.limit.toLocaleString()}
                </p>
                <Progress value={(usage.apiCalls.used / usage.apiCalls.limit) * 100} className="h-1.5 mt-2" />
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Network Access</p>
                <Badge className="mt-2">{usage.networkAccess}</Badge>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <WaveLoader size="sm" />
            </div>
          )}

          {(userTier === "FREE" || userTier === "STARTER") && <Button className="w-full mt-4">Upgrade Plan</Button>}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" disabled={saving}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button onClick={handleSaveSettings} disabled={saving}>
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
