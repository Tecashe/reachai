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


// "use client"
// import { useState, useTransition } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Slider } from "@/components/ui/slider"
// import { Switch } from "@/components/ui/switch"
// import { Card } from "@/components/ui/card"
// import { createCampaign } from "@/lib/actions/campaigns"
// import { useRouter } from "next/navigation"

// const RESEARCH_DEPTH_OPTIONS = [
//   { value: "QUICK", label: "Quick", description: "Basic research" },
//   { value: "STANDARD", label: "Standard", description: "Balanced approach" },
//   { value: "DEEP", label: "Deep", description: "Comprehensive research" },
// ]

// const PERSONALIZATION_LEVELS = [
//   { value: "LOW", label: "Low", description: "Generic messages" },
//   { value: "MEDIUM", label: "Medium", description: "Contextual personalization" },
//   { value: "HIGH", label: "High", description: "Deep personalization" },
// ]

// const TONE_OPTIONS = ["professional", "casual", "friendly", "bold"]

// type Step = "info" | "ai" | "sending" | "tracking" | "review"

// interface FormState {
//   name: string
//   description: string
//   researchDepth: string
//   personalizationLevel: string
//   tone: string
//   dailyLimit: number
//   trackOpens: boolean
//   trackClicks: boolean
// }

// export function CreateCampaignWizard() {
//   const [currentStep, setCurrentStep] = useState<Step>("info")
//   const [formState, setFormState] = useState<FormState>({
//     name: "",
//     description: "",
//     researchDepth: "STANDARD",
//     personalizationLevel: "MEDIUM",
//     tone: "professional",
//     dailyLimit: 50,
//     trackOpens: true,
//     trackClicks: true,
//   })
//   const [isPending, startTransition] = useTransition()
//   const router = useRouter()

//   const steps: Step[] = ["info", "ai", "sending", "tracking", "review"]
//   const stepLabels = {
//     info: "Campaign Info",
//     ai: "AI Settings",
//     sending: "Sending Settings",
//     tracking: "Tracking",
//     review: "Review",
//   }

//   const handleNext = () => {
//     const currentIndex = steps.indexOf(currentStep)
//     if (currentIndex < steps.length - 1) {
//       setCurrentStep(steps[currentIndex + 1])
//     }
//   }

//   const handleBack = () => {
//     const currentIndex = steps.indexOf(currentStep)
//     if (currentIndex > 0) {
//       setCurrentStep(steps[currentIndex - 1])
//     }
//   }

//   const handleSubmit = async () => {
//     const formData = new FormData()
//     formData.set("name", formState.name)
//     formData.set("description", formState.description)
//     formData.set("researchDepth", formState.researchDepth)
//     formData.set("personalizationLevel", formState.personalizationLevel)
//     formData.set("tone", formState.tone)
//     formData.set("dailyLimit", formState.dailyLimit.toString())
//     formData.set("trackOpens", formState.trackOpens.toString())
//     formData.set("trackClicks", formState.trackClicks.toString())

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

//   const isCurrentStepValid = () => {
//     switch (currentStep) {
//       case "info":
//         return formState.name.trim().length > 0
//       case "ai":
//       case "sending":
//       case "tracking":
//         return true
//       case "review":
//         return true
//       default:
//         return false
//     }
//   }

//   const currentIndex = steps.indexOf(currentStep)
//   const progress = ((currentIndex + 1) / steps.length) * 100

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
//       <div className="w-full max-w-2xl">
//         {/* Progress bar */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-2">
//             <h1 className="text-2xl font-semibold text-foreground">Create Campaign</h1>
//             <span className="text-sm text-muted-foreground">
//               {currentIndex + 1} of {steps.length}
//             </span>
//           </div>
//           <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
//             <div className="h-full bg-primary transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
//           </div>
//           <div className="flex justify-between mt-4 gap-2">
//             {steps.map((step, idx) => (
//               <div key={step} className="flex flex-col items-center flex-1">
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-500 ${
//                     idx <= currentIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
//                   }`}
//                 >
//                   {idx + 1}
//                 </div>
//                 <span className="text-xs mt-2 text-center text-muted-foreground hidden sm:block">
//                   {stepLabels[step]}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Main card with blur transition */}
//         <Card className="border border-border/50 shadow-lg">
//           <div className="relative p-8 sm:p-12">
//             <div className="relative min-h-96">
//               {/* Campaign Info Step */}
//               <div
//                 className={`absolute inset-0 transition-all duration-700 ease-out ${
//                   currentStep === "info"
//                     ? "opacity-100 scale-100 blur-0 pointer-events-auto"
//                     : "opacity-0 scale-95 blur-md pointer-events-none"
//                 }`}
//               >
//                 <div className="space-y-6">
//                   <div>
//                     <h2 className="text-xl font-semibold mb-6 text-foreground">Campaign Information</h2>
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="name" className="text-base font-medium">
//                           Campaign Name *
//                         </Label>
//                         <Input
//                           id="name"
//                           placeholder="e.g., Q1 Outreach - Tech Startups"
//                           value={formState.name}
//                           onChange={(e) => setFormState({ ...formState, name: e.target.value })}
//                           className="text-lg py-6 border-border/50 focus:border-primary/50"
//                           autoFocus
//                         />
//                         <p className="text-sm text-muted-foreground">
//                           Give your campaign a descriptive name for easy identification
//                         </p>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="description" className="text-base font-medium">
//                           Description
//                         </Label>
//                         <Textarea
//                           id="description"
//                           placeholder="Brief description of your campaign goals..."
//                           value={formState.description}
//                           onChange={(e) => setFormState({ ...formState, description: e.target.value })}
//                           rows={4}
//                           className="text-base border-border/50 focus:border-primary/50"
//                         />
//                         <p className="text-sm text-muted-foreground">
//                           Optional: Help your team understand the campaign objective
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* AI Settings Step */}
//               <div
//                 className={`absolute inset-0 transition-all duration-700 ease-out ${
//                   currentStep === "ai"
//                     ? "opacity-100 scale-100 blur-0 pointer-events-auto"
//                     : "opacity-0 scale-95 blur-md pointer-events-none"
//                 }`}
//               >
//                 <div className="space-y-6">
//                   <h2 className="text-xl font-semibold text-foreground">AI Configuration</h2>
//                   <div className="space-y-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="research-depth" className="text-base font-medium">
//                         Research Depth
//                       </Label>
//                       <Select
//                         value={formState.researchDepth}
//                         onValueChange={(value) => setFormState({ ...formState, researchDepth: value })}
//                       >
//                         <SelectTrigger id="research-depth" className="text-base py-6 border-border/50">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {RESEARCH_DEPTH_OPTIONS.map((option) => (
//                             <SelectItem key={option.value} value={option.value}>
//                               <div>
//                                 <div className="font-medium">{option.label}</div>
//                                 <div className="text-xs text-muted-foreground">{option.description}</div>
//                               </div>
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <p className="text-sm text-muted-foreground">How thoroughly should we research each prospect?</p>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="personalization" className="text-base font-medium">
//                         Personalization Level
//                       </Label>
//                       <Select
//                         value={formState.personalizationLevel}
//                         onValueChange={(value) => setFormState({ ...formState, personalizationLevel: value })}
//                       >
//                         <SelectTrigger id="personalization" className="text-base py-6 border-border/50">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {PERSONALIZATION_LEVELS.map((option) => (
//                             <SelectItem key={option.value} value={option.value}>
//                               <div>
//                                 <div className="font-medium">{option.label}</div>
//                                 <div className="text-xs text-muted-foreground">{option.description}</div>
//                               </div>
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <p className="text-sm text-muted-foreground">How personalized should the messages be?</p>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="tone" className="text-base font-medium">
//                         Tone of Voice
//                       </Label>
//                       <Select
//                         value={formState.tone}
//                         onValueChange={(value) => setFormState({ ...formState, tone: value })}
//                       >
//                         <SelectTrigger id="tone" className="text-base py-6 border-border/50">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {TONE_OPTIONS.map((option) => (
//                             <SelectItem key={option} value={option}>
//                               {option.charAt(0).toUpperCase() + option.slice(1)}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <p className="text-sm text-muted-foreground">What tone should your messages have?</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Sending Settings Step */}
//               <div
//                 className={`absolute inset-0 transition-all duration-700 ease-out ${
//                   currentStep === "sending"
//                     ? "opacity-100 scale-100 blur-0 pointer-events-auto"
//                     : "opacity-0 scale-95 blur-md pointer-events-none"
//                 }`}
//               >
//                 <div className="space-y-6">
//                   <h2 className="text-xl font-semibold text-foreground">Sending Configuration</h2>
//                   <div className="space-y-8">
//                     <div className="space-y-4">
//                       <div className="flex items-center justify-between">
//                         <Label htmlFor="daily-limit" className="text-base font-medium">
//                           Daily Send Limit
//                         </Label>
//                         <span className="text-2xl font-bold text-primary">{formState.dailyLimit}</span>
//                       </div>
//                       <Slider
//                         id="daily-limit"
//                         min={10}
//                         max={200}
//                         step={10}
//                         value={[formState.dailyLimit]}
//                         onValueChange={(value) => setFormState({ ...formState, dailyLimit: value[0] })}
//                         className="cursor-pointer"
//                       />
//                       <p className="text-sm text-muted-foreground">
//                         Limit sends to {formState.dailyLimit} emails per day to maintain deliverability
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Tracking Settings Step */}
//               <div
//                 className={`absolute inset-0 transition-all duration-700 ease-out ${
//                   currentStep === "tracking"
//                     ? "opacity-100 scale-100 blur-0 pointer-events-auto"
//                     : "opacity-0 scale-95 blur-md pointer-events-none"
//                 }`}
//               >
//                 <div className="space-y-6">
//                   <h2 className="text-xl font-semibold text-foreground">Tracking Preferences</h2>
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:border-border/50 transition-colors">
//                       <div className="space-y-1 flex-1">
//                         <Label className="text-base font-medium cursor-pointer">Track Email Opens</Label>
//                         <p className="text-sm text-muted-foreground">Monitor when prospects open your emails</p>
//                       </div>
//                       <Switch
//                         checked={formState.trackOpens}
//                         onCheckedChange={(checked) => setFormState({ ...formState, trackOpens: checked })}
//                       />
//                     </div>

//                     <div className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:border-border/50 transition-colors">
//                       <div className="space-y-1 flex-1">
//                         <Label className="text-base font-medium cursor-pointer">Track Link Clicks</Label>
//                         <p className="text-sm text-muted-foreground">
//                           Monitor when prospects click links in your emails
//                         </p>
//                       </div>
//                       <Switch
//                         checked={formState.trackClicks}
//                         onCheckedChange={(checked) => setFormState({ ...formState, trackClicks: checked })}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Review Step */}
//               <div
//                 className={`absolute inset-0 transition-all duration-700 ease-out ${
//                   currentStep === "review"
//                     ? "opacity-100 scale-100 blur-0 pointer-events-auto"
//                     : "opacity-0 scale-95 blur-md pointer-events-none"
//                 }`}
//               >
//                 <div className="space-y-6">
//                   <h2 className="text-xl font-semibold text-foreground">Review Your Campaign</h2>
//                   <div className="space-y-4">
//                     <div className="bg-muted/30 border border-border/30 rounded-lg p-4 space-y-3">
//                       <div>
//                         <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
//                           Campaign Name
//                         </p>
//                         <p className="text-lg font-medium text-foreground">{formState.name}</p>
//                       </div>
//                       {formState.description && (
//                         <div className="pt-3 border-t border-border/30">
//                           <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
//                             Description
//                           </p>
//                           <p className="text-sm text-foreground">{formState.description}</p>
//                         </div>
//                       )}
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="bg-muted/30 border border-border/30 rounded-lg p-4">
//                         <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
//                           Research Depth
//                         </p>
//                         <p className="text-base font-medium text-foreground mt-1">
//                           {RESEARCH_DEPTH_OPTIONS.find((o) => o.value === formState.researchDepth)?.label}
//                         </p>
//                       </div>
//                       <div className="bg-muted/30 border border-border/30 rounded-lg p-4">
//                         <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
//                           Personalization
//                         </p>
//                         <p className="text-base font-medium text-foreground mt-1">
//                           {PERSONALIZATION_LEVELS.find((o) => o.value === formState.personalizationLevel)?.label}
//                         </p>
//                       </div>
//                       <div className="bg-muted/30 border border-border/30 rounded-lg p-4">
//                         <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Tone</p>
//                         <p className="text-base font-medium text-foreground mt-1 capitalize">{formState.tone}</p>
//                       </div>
//                       <div className="bg-muted/30 border border-border/30 rounded-lg p-4">
//                         <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Daily Limit</p>
//                         <p className="text-base font-medium text-foreground mt-1">{formState.dailyLimit}/day</p>
//                       </div>
//                     </div>

//                     <div className="bg-muted/30 border border-border/30 rounded-lg p-4 space-y-2">
//                       <div className="flex items-center justify-between text-sm">
//                         <span className="text-muted-foreground">Track Opens</span>
//                         <span className="font-medium text-foreground">
//                           {formState.trackOpens ? "✓ Enabled" : "✗ Disabled"}
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between text-sm">
//                         <span className="text-muted-foreground">Track Clicks</span>
//                         <span className="font-medium text-foreground">
//                           {formState.trackClicks ? "✓ Enabled" : "✗ Disabled"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Navigation footer */}
//           <div className="border-t border-border/30 px-8 sm:px-12 py-6 bg-muted/30 flex items-center justify-between">
//             <Button
//               type="button"
//               variant="ghost"
//               onClick={handleBack}
//               disabled={currentIndex === 0}
//               className="text-base"
//             >
//               ← Back
//             </Button>

//             <div className="text-sm text-muted-foreground font-medium">
//               Step {currentIndex + 1} of {steps.length}
//             </div>

//             {currentStep === "review" ? (
//               <Button type="button" onClick={handleSubmit} disabled={isPending} className="text-base">
//                 {isPending ? "Creating..." : "Create Campaign"}
//               </Button>
//             ) : (
//               <Button type="button" onClick={handleNext} disabled={!isCurrentStepValid()} className="text-base">
//                 Next →
//               </Button>
//             )}
//           </div>
//         </Card>
//       </div>
//     </div>
//   )
// }

"use client"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { createCampaign } from "@/lib/actions/campaigns"
import { useRouter } from "next/navigation"

const RESEARCH_DEPTH_OPTIONS = [
  { value: "QUICK", label: "Quick", description: "Basic research" },
  { value: "STANDARD", label: "Standard", description: "Balanced approach" },
  { value: "DEEP", label: "Deep", description: "Comprehensive research" },
]

const PERSONALIZATION_LEVELS = [
  { value: "LOW", label: "Low", description: "Generic messages" },
  { value: "MEDIUM", label: "Medium", description: "Contextual personalization" },
  { value: "HIGH", label: "High", description: "Deep personalization" },
]

const TONE_OPTIONS = ["professional", "casual", "friendly", "bold"]

type Step = "info" | "ai" | "sending" | "tracking"

interface FormState {
  name: string
  description: string
  researchDepth: string
  personalizationLevel: string
  tone: string
  dailyLimit: number
  trackOpens: boolean
  trackClicks: boolean
}

export function CreateCampaignWizard() {
  const [currentStep, setCurrentStep] = useState<Step>("info")
  const [formState, setFormState] = useState<FormState>({
    name: "",
    description: "",
    researchDepth: "STANDARD",
    personalizationLevel: "MEDIUM",
    tone: "professional",
    dailyLimit: 50,
    trackOpens: true,
    trackClicks: true,
  })
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const steps: Step[] = ["info", "ai", "sending", "tracking"]
  const stepLabels = {
    info: "Campaign Info",
    ai: "AI Settings",
    sending: "Sending Configuration",
    tracking: "Tracking Preferences",
  }

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.set("name", formState.name)
    formData.set("description", formState.description)
    formData.set("researchDepth", formState.researchDepth)
    formData.set("personalizationLevel", formState.personalizationLevel)
    formData.set("tone", formState.tone)
    formData.set("dailyLimit", formState.dailyLimit.toString())
    formData.set("trackOpens", formState.trackOpens.toString())
    formData.set("trackClicks", formState.trackClicks.toString())

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

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case "info":
        return formState.name.trim().length > 0
      default:
        return true
    }
  }

  const currentIndex = steps.indexOf(currentStep)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Simplified header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Create Campaign</h1>
        </div>

        <Card className="shadow-sm">
          <div className="p-8">
            <div className="min-h-80">
              {/* Campaign Info Step */}
              <div
                className={`transition-all duration-700 ease-out ${
                  currentStep === "info"
                    ? "opacity-100 scale-100 blur-0 pointer-events-auto"
                    : "opacity-0 scale-95 blur-md pointer-events-none"
                }`}
              >
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-foreground">Campaign Information</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium">
                        Campaign Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="e.g., Q1 Outreach"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="mt-2 border-border/40 focus:border-primary/60"
                        autoFocus
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-medium">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description..."
                        value={formState.description}
                        onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                        rows={3}
                        className="mt-2 border-border/40 focus:border-primary/60 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Settings Step */}
              <div
                className={`transition-all duration-700 ease-out ${
                  currentStep === "ai"
                    ? "opacity-100 scale-100 blur-0 pointer-events-auto"
                    : "opacity-0 scale-95 blur-md pointer-events-none"
                }`}
              >
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-foreground">AI Configuration</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="research-depth" className="text-sm font-medium">
                        Research Depth
                      </Label>
                      <Select
                        value={formState.researchDepth}
                        onValueChange={(value) => setFormState({ ...formState, researchDepth: value })}
                      >
                        <SelectTrigger id="research-depth" className="mt-2 border-border/40">
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

                    <div>
                      <Label htmlFor="personalization" className="text-sm font-medium">
                        Personalization Level
                      </Label>
                      <Select
                        value={formState.personalizationLevel}
                        onValueChange={(value) => setFormState({ ...formState, personalizationLevel: value })}
                      >
                        <SelectTrigger id="personalization" className="mt-2 border-border/40">
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

                    <div>
                      <Label htmlFor="tone" className="text-sm font-medium">
                        Tone of Voice
                      </Label>
                      <Select
                        value={formState.tone}
                        onValueChange={(value) => setFormState({ ...formState, tone: value })}
                      >
                        <SelectTrigger id="tone" className="mt-2 border-border/40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TONE_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sending Settings Step */}
              <div
                className={`transition-all duration-700 ease-out ${
                  currentStep === "sending"
                    ? "opacity-100 scale-100 blur-0 pointer-events-auto"
                    : "opacity-0 scale-95 blur-md pointer-events-none"
                }`}
              >
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-foreground">Sending Configuration</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label htmlFor="daily-limit" className="text-sm font-medium">
                          Daily Send Limit
                        </Label>
                        <span className="text-xl font-semibold text-foreground">{formState.dailyLimit}</span>
                      </div>
                      <Slider
                        id="daily-limit"
                        min={10}
                        max={200}
                        step={10}
                        value={[formState.dailyLimit]}
                        onValueChange={(value) => setFormState({ ...formState, dailyLimit: value[0] })}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking Settings Step */}
              <div
                className={`transition-all duration-700 ease-out ${
                  currentStep === "tracking"
                    ? "opacity-100 scale-100 blur-0 pointer-events-auto"
                    : "opacity-0 scale-95 blur-md pointer-events-none"
                }`}
              >
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-foreground">Tracking Preferences</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border/20">
                      <div>
                        <Label className="text-sm font-medium cursor-pointer">Track Email Opens</Label>
                      </div>
                      <Switch
                        checked={formState.trackOpens}
                        onCheckedChange={(checked) => setFormState({ ...formState, trackOpens: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-border/20">
                      <div>
                        <Label className="text-sm font-medium cursor-pointer">Track Link Clicks</Label>
                      </div>
                      <Switch
                        checked={formState.trackClicks}
                        onCheckedChange={(checked) => setFormState({ ...formState, trackClicks: checked })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-3 mt-8">
          {currentIndex > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 border-border/40 hover:bg-muted/50 bg-transparent"
            >
              Back
            </Button>
          )}
          {currentIndex < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={!isCurrentStepValid()} className="flex-1">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!isCurrentStepValid() || isPending} className="flex-1">
              {isPending ? "Creating..." : "Create Campaign"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
