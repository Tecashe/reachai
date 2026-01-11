// "use client"
// import { X, Globe, Shield, Zap, TestTube, Sparkles, Info } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Separator } from "@/components/ui/separator"
// import { Slider } from "@/components/ui/slider"
// import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
// import { cn } from "@/lib/utils"
// import type { Sequence, ABTestMetric } from "@/lib/types/sequence"

// interface SequenceSettingsPanelProps {
//   sequence: Sequence
//   onUpdate: (updates: Partial<Sequence>) => void
//   onClose: () => void
// }

// const TIMEZONES = [
//   { value: "America/New_York", label: "Eastern Time (ET)" },
//   { value: "America/Chicago", label: "Central Time (CT)" },
//   { value: "America/Denver", label: "Mountain Time (MT)" },
//   { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
//   { value: "Europe/London", label: "London (GMT)" },
//   { value: "Europe/Paris", label: "Paris (CET)" },
//   { value: "Asia/Tokyo", label: "Tokyo (JST)" },
//   { value: "Australia/Sydney", label: "Sydney (AEST)" },
// ]

// const DAYS = [
//   { value: 0, label: "Sun" },
//   { value: 1, label: "Mon" },
//   { value: 2, label: "Tue" },
//   { value: 3, label: "Wed" },
//   { value: 4, label: "Thu" },
//   { value: 5, label: "Fri" },
//   { value: 6, label: "Sat" },
// ]

// const TONES = [
//   { value: "professional", label: "Professional" },
//   { value: "casual", label: "Casual" },
//   { value: "friendly", label: "Friendly" },
//   { value: "formal", label: "Formal" },
//   { value: "empathetic", label: "Empathetic" },
//   { value: "bold", label: "Bold" },
// ]

// export function SequenceSettingsPanel({ sequence, onUpdate, onClose }: SequenceSettingsPanelProps) {
//   const toggleDay = (day: number) => {
//     const newDays = sequence.businessDays.includes(day)
//       ? sequence.businessDays.filter((d) => d !== day)
//       : [...sequence.businessDays, day].sort()
//     onUpdate({ businessDays: newDays })
//   }

//   return (
//     <TooltipProvider>
//       <div className="flex h-full flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-border px-4 py-3">
//           <h3 className="text-sm font-semibold text-foreground">Sequence Settings</h3>
//           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
//             <X className="h-4 w-4" />
//           </Button>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-auto p-4 space-y-6">
//           {/* Timezone & Schedule */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <Globe className="h-4 w-4 text-muted-foreground" />
//               <h4 className="text-sm font-medium text-foreground">Timezone & Schedule</h4>
//             </div>

//             <div className="space-y-2">
//               <Label className="text-xs">Timezone</Label>
//               <Select value={sequence.timezone} onValueChange={(v) => onUpdate({ timezone: v })}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {TIMEZONES.map((tz) => (
//                     <SelectItem key={tz.value} value={tz.value}>
//                       {tz.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <span className="text-sm">Send in business hours only</span>
//                 <Tooltip>
//                   <TooltipTrigger>
//                     <Info className="h-3.5 w-3.5 text-muted-foreground" />
//                   </TooltipTrigger>
//                   <TooltipContent className="max-w-xs">
//                     Emails will only be sent during the specified business hours
//                   </TooltipContent>
//                 </Tooltip>
//               </div>
//               <Switch
//                 checked={sequence.sendInBusinessHours}
//                 onCheckedChange={(checked) => onUpdate({ sendInBusinessHours: checked })}
//               />
//             </div>

//             {sequence.sendInBusinessHours && (
//               <>
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="space-y-2">
//                     <Label className="text-xs">Start time</Label>
//                     <Input
//                       type="time"
//                       value={sequence.businessHoursStart}
//                       onChange={(e) => onUpdate({ businessHoursStart: e.target.value })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-xs">End time</Label>
//                     <Input
//                       type="time"
//                       value={sequence.businessHoursEnd}
//                       onChange={(e) => onUpdate({ businessHoursEnd: e.target.value })}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-xs">Send on these days</Label>
//                   <div className="flex gap-1">
//                     {DAYS.map((day) => (
//                       <button
//                         key={day.value}
//                         onClick={() => toggleDay(day.value)}
//                         className={cn(
//                           "flex h-9 w-9 items-center justify-center rounded-md border text-xs font-medium transition-colors",
//                           sequence.businessDays.includes(day.value)
//                             ? "border-primary bg-primary text-primary-foreground"
//                             : "border-input bg-background text-muted-foreground hover:bg-muted",
//                         )}
//                       >
//                         {day.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>

//           <Separator />

//           {/* Deliverability */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <Shield className="h-4 w-4 text-muted-foreground" />
//               <h4 className="text-sm font-medium text-foreground">Deliverability</h4>
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label className="text-xs">Daily send limit</Label>
//                 <span className="text-xs text-muted-foreground">{sequence.dailySendLimit} emails/day</span>
//               </div>
//               <Slider
//                 value={[sequence.dailySendLimit]}
//                 onValueChange={([v]) => onUpdate({ dailySendLimit: v })}
//                 max={200}
//                 min={10}
//                 step={10}
//               />
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Label className="text-xs">Min delay between sends</Label>
//                   <Tooltip>
//                     <TooltipTrigger>
//                       <Info className="h-3.5 w-3.5 text-muted-foreground" />
//                     </TooltipTrigger>
//                     <TooltipContent className="max-w-xs">
//                       Minimum time between sending emails to different prospects
//                     </TooltipContent>
//                   </Tooltip>
//                 </div>
//                 <span className="text-xs text-muted-foreground">{sequence.minDelayBetweenSends}s</span>
//               </div>
//               <Slider
//                 value={[sequence.minDelayBetweenSends]}
//                 onValueChange={([v]) => onUpdate({ minDelayBetweenSends: v })}
//                 max={300}
//                 min={15}
//                 step={15}
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <span className="text-sm">Track email opens</span>
//               <Switch checked={sequence.trackOpens} onCheckedChange={(checked) => onUpdate({ trackOpens: checked })} />
//             </div>

//             <div className="flex items-center justify-between">
//               <span className="text-sm">Track link clicks</span>
//               <Switch
//                 checked={sequence.trackClicks}
//                 onCheckedChange={(checked) => onUpdate({ trackClicks: checked })}
//               />
//             </div>
//           </div>

//           <Separator />

//           {/* Multi-channel */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <Zap className="h-4 w-4 text-muted-foreground" />
//               <h4 className="text-sm font-medium text-foreground">Multi-channel</h4>
//             </div>

//             <div className="flex items-center justify-between">
//               <div>
//                 <span className="text-sm">LinkedIn integration</span>
//                 <p className="text-xs text-muted-foreground">Enable LinkedIn steps</p>
//               </div>
//               <Switch
//                 checked={sequence.enableLinkedIn}
//                 onCheckedChange={(checked) => onUpdate({ enableLinkedIn: checked })}
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <div>
//                 <span className="text-sm">Phone calls</span>
//                 <p className="text-xs text-muted-foreground">Enable call task steps</p>
//               </div>
//               <Switch
//                 checked={sequence.enableCalls}
//                 onCheckedChange={(checked) => onUpdate({ enableCalls: checked })}
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <div>
//                 <span className="text-sm">Manual tasks</span>
//                 <p className="text-xs text-muted-foreground">Enable custom task steps</p>
//               </div>
//               <Switch
//                 checked={sequence.enableTasks}
//                 onCheckedChange={(checked) => onUpdate({ enableTasks: checked })}
//               />
//             </div>
//           </div>

//           <Separator />

//           {/* A/B Testing */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <TestTube className="h-4 w-4 text-muted-foreground" />
//               <h4 className="text-sm font-medium text-foreground">A/B Testing</h4>
//             </div>

//             <div className="flex items-center justify-between">
//               <div>
//                 <span className="text-sm">Enable A/B testing</span>
//                 <p className="text-xs text-muted-foreground">Test different email variants</p>
//               </div>
//               <Switch
//                 checked={sequence.enableABTesting}
//                 onCheckedChange={(checked) => onUpdate({ enableABTesting: checked })}
//               />
//             </div>

//             {sequence.enableABTesting && (
//               <>
//                 <div className="space-y-2">
//                   <Label className="text-xs">Winner metric</Label>
//                   <Select
//                     value={sequence.abTestWinnerMetric}
//                     onValueChange={(v) => onUpdate({ abTestWinnerMetric: v as ABTestMetric })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="OPEN_RATE">Open Rate</SelectItem>
//                       <SelectItem value="CLICK_RATE">Click Rate</SelectItem>
//                       <SelectItem value="REPLY_RATE">Reply Rate</SelectItem>
//                       <SelectItem value="POSITIVE_REPLY_RATE">Positive Reply Rate</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <Label className="text-xs">Test sample size</Label>
//                     <span className="text-xs text-muted-foreground">{sequence.abTestSampleSize}%</span>
//                   </div>
//                   <Slider
//                     value={[sequence.abTestSampleSize]}
//                     onValueChange={([v]) => onUpdate({ abTestSampleSize: v })}
//                     max={50}
//                     min={10}
//                     step={5}
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     {sequence.abTestSampleSize}% of prospects will receive test variants
//                   </p>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <Label className="text-xs">Test duration</Label>
//                     <span className="text-xs text-muted-foreground">{sequence.abTestDuration}h</span>
//                   </div>
//                   <Slider
//                     value={[sequence.abTestDuration]}
//                     onValueChange={([v]) => onUpdate({ abTestDuration: v })}
//                     max={168}
//                     min={24}
//                     step={24}
//                   />
//                   <p className="text-xs text-muted-foreground">Winner selected after {sequence.abTestDuration} hours</p>
//                 </div>
//               </>
//             )}
//           </div>

//           <Separator />

//           {/* AI Settings */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <Sparkles className="h-4 w-4 text-muted-foreground" />
//               <h4 className="text-sm font-medium text-foreground">AI Settings</h4>
//             </div>

//             <div className="flex items-center justify-between">
//               <div>
//                 <span className="text-sm">Optimize send time</span>
//                 <p className="text-xs text-muted-foreground">AI finds best time for each prospect</p>
//               </div>
//               <Switch
//                 checked={sequence.aiOptimizeSendTime}
//                 onCheckedChange={(checked) => onUpdate({ aiOptimizeSendTime: checked })}
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <div>
//                 <span className="text-sm">AI personalization</span>
//                 <p className="text-xs text-muted-foreground">Generate custom icebreakers</p>
//               </div>
//               <Switch
//                 checked={sequence.aiPersonalization}
//                 onCheckedChange={(checked) => onUpdate({ aiPersonalization: checked })}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label className="text-xs">Tone of voice</Label>
//               <Select value={sequence.toneOfVoice} onValueChange={(v) => onUpdate({ toneOfVoice: v })}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {TONES.map((tone) => (
//                     <SelectItem key={tone.value} value={tone.value}>
//                       {tone.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>
//       </div>
//     </TooltipProvider>
//   )
// }
"use client"
import { X, Globe, Shield, Zap, TestTube, Sparkles, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { Sequence, ABTestMetric } from "@/lib/types/sequence"

interface SequenceSettingsPanelProps {
  sequence: Sequence
  onUpdate: (updates: Partial<Sequence>) => void
  onClose: () => void
}

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
]

const DAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
]

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "empathetic", label: "Empathetic" },
  { value: "bold", label: "Bold" },
]

export function SequenceSettingsPanel({ sequence, onUpdate, onClose }: SequenceSettingsPanelProps) {
  const toggleDay = (day: number) => {
    const newDays = sequence.businessDays.includes(day)
      ? sequence.businessDays.filter((d) => d !== day)
      : [...sequence.businessDays, day].sort()
    onUpdate({ businessDays: newDays })
  }

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">Sequence Settings</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {/* Timezone & Schedule */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium text-foreground">Timezone & Schedule</h4>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Timezone</Label>
              <Select value={sequence.timezone} onValueChange={(v) => onUpdate({ timezone: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">Send in business hours only</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    Emails will only be sent during the specified business hours
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                checked={sequence.sendInBusinessHours}
                onCheckedChange={(checked) => onUpdate({ sendInBusinessHours: checked })}
              />
            </div>

            {sequence.sendInBusinessHours && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Start time</Label>
                    <Input
                      type="time"
                      value={sequence.businessHoursStart}
                      onChange={(e) => onUpdate({ businessHoursStart: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">End time</Label>
                    <Input
                      type="time"
                      value={sequence.businessHoursEnd}
                      onChange={(e) => onUpdate({ businessHoursEnd: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Send on these days</Label>
                  <div className="flex gap-1">
                    {DAYS.map((day) => (
                      <button
                        key={day.value}
                        onClick={() => toggleDay(day.value)}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-md border text-xs font-medium transition-colors",
                          sequence.businessDays.includes(day.value)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background text-muted-foreground hover:bg-muted",
                        )}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <Separator />

          {/* Deliverability */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium text-foreground">Deliverability</h4>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Daily send limit</Label>
                <span className="text-xs text-muted-foreground">{sequence.dailySendLimit} emails/day</span>
              </div>
              <Slider
                value={[sequence.dailySendLimit]}
                onValueChange={([v]) => onUpdate({ dailySendLimit: v })}
                max={200}
                min={10}
                step={10}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-xs">Min delay between sends</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      Minimum time between sending emails to different prospects
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-xs text-muted-foreground">{sequence.minDelayBetweenSends}s</span>
              </div>
              <Slider
                value={[sequence.minDelayBetweenSends]}
                onValueChange={([v]) => onUpdate({ minDelayBetweenSends: v })}
                max={300}
                min={15}
                step={15}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Track email opens</span>
              <Switch checked={sequence.trackOpens} onCheckedChange={(checked) => onUpdate({ trackOpens: checked })} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Track link clicks</span>
              <Switch
                checked={sequence.trackClicks}
                onCheckedChange={(checked) => onUpdate({ trackClicks: checked })}
              />
            </div>
          </div>

          <Separator />

          {/* Multi-channel */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium text-foreground">Multi-channel</h4>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm">LinkedIn integration</span>
                <p className="text-xs text-muted-foreground">Enable LinkedIn steps</p>
              </div>
              <Switch
                checked={sequence.enableLinkedIn}
                onCheckedChange={(checked) => onUpdate({ enableLinkedIn: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm">Phone calls</span>
                <p className="text-xs text-muted-foreground">Enable call task steps</p>
              </div>
              <Switch
                checked={sequence.enableCalls}
                onCheckedChange={(checked) => onUpdate({ enableCalls: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm">Manual tasks</span>
                <p className="text-xs text-muted-foreground">Enable custom task steps</p>
              </div>
              <Switch
                checked={sequence.enableTasks}
                onCheckedChange={(checked) => onUpdate({ enableTasks: checked })}
              />
            </div>
          </div>

          <Separator />

          {/* A/B Testing */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TestTube className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium text-foreground">A/B Testing</h4>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm">Enable A/B testing</span>
                <p className="text-xs text-muted-foreground">Test different email variants</p>
              </div>
              <Switch
                checked={sequence.enableABTesting}
                onCheckedChange={(checked) => onUpdate({ enableABTesting: checked })}
              />
            </div>

            {sequence.enableABTesting && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs">Winner metric</Label>
                  <Select
                    value={sequence.abTestWinnerMetric}
                    onValueChange={(v) => onUpdate({ abTestWinnerMetric: v as ABTestMetric })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN_RATE">Open Rate</SelectItem>
                      <SelectItem value="CLICK_RATE">Click Rate</SelectItem>
                      <SelectItem value="REPLY_RATE">Reply Rate</SelectItem>
                      <SelectItem value="POSITIVE_REPLY_RATE">Positive Reply Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Test sample size</Label>
                    <span className="text-xs text-muted-foreground">{sequence.abTestSampleSize}%</span>
                  </div>
                  <Slider
                    value={[sequence.abTestSampleSize]}
                    onValueChange={([v]) => onUpdate({ abTestSampleSize: v })}
                    max={50}
                    min={10}
                    step={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    {sequence.abTestSampleSize}% of prospects will receive test variants
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Test duration</Label>
                    <span className="text-xs text-muted-foreground">{sequence.abTestDuration}h</span>
                  </div>
                  <Slider
                    value={[sequence.abTestDuration]}
                    onValueChange={([v]) => onUpdate({ abTestDuration: v })}
                    max={168}
                    min={24}
                    step={24}
                  />
                  <p className="text-xs text-muted-foreground">Winner selected after {sequence.abTestDuration} hours</p>
                </div>
              </>
            )}
          </div>

          <Separator />

          {/* AI Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium text-foreground">AI Settings</h4>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm">Optimize send time</span>
                <p className="text-xs text-muted-foreground">AI finds best time for each prospect</p>
              </div>
              <Switch
                checked={sequence.aiOptimizeSendTime}
                onCheckedChange={(checked) => onUpdate({ aiOptimizeSendTime: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm">AI personalization</span>
                <p className="text-xs text-muted-foreground">Generate custom icebreakers</p>
              </div>
              <Switch
                checked={sequence.aiPersonalization}
                onCheckedChange={(checked) => onUpdate({ aiPersonalization: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Tone of voice</Label>
              <Select value={sequence.toneOfVoice} onValueChange={(v) => onUpdate({ toneOfVoice: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
