

// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { CheckCircle2, Circle, ArrowRight, Sparkles, Users, Mail, Send, BarChart3 } from "lucide-react"
// import { ProspectImportStep } from "./wizard-steps/prospect-import-step"
// import { ResearchStep } from "./wizard-steps/research-step"
// import { EmailGenerationStep } from "./wizard-steps/email-generation-step"
// import { ReviewStep } from "./wizard-steps/review-step"
// import { LaunchStepWithSequence } from "./wizard-steps/launch-step"
// import { updateCampaignWizardProgress } from "@/lib/actions/campaigns"
// import { useToast } from "@/hooks/use-toast"

// interface Campaign {
//   id: string
//   name: string
//   status: string
//   _count: {
//     prospects: number
//   }
//   wizardStep?: string
//   wizardCompletedSteps?: string[]
// }

// interface WizardStep {
//   id: string
//   title: string
//   description: string
//   icon: any
//   component: any
// }

// const steps: WizardStep[] = [
//   {
//     id: "prospects",
//     title: "Add Prospects",
//     description: "Import or add prospects to your campaign",
//     icon: Users,
//     component: ProspectImportStep,
//   },
//   {
//     id: "research",
//     title: "AI Research",
//     description: "Enrich prospects with AI-powered research",
//     icon: Sparkles,
//     component: ResearchStep,
//   },
//   {
//     id: "generate",
//     title: "Generate Emails",
//     description: "Create personalized emails with AI",
//     icon: Mail,
//     component: EmailGenerationStep,
//   },
//   {
//     id: "review",
//     title: "Review & Optimize",
//     description: "Check quality scores and make improvements",
//     icon: BarChart3,
//     component: ReviewStep,
//   },
//   {
//     id: "launch",
//     title: "Launch Campaign",
//     description: "Schedule and send your emails",
//     icon: Send,
//     component: LaunchStepWithSequence,
//   },
// ]

// export function CampaignWizard({ campaign }: { campaign: Campaign }) {
//   const router = useRouter()
//   const { toast } = useToast()

//   console.log("[v0] CampaignWizard mounted with campaign data:", {
//     campaignId: campaign.id,
//     wizardStep: campaign.wizardStep,
//     wizardCompletedSteps: campaign.wizardCompletedSteps,
//     prospectsCount: campaign._count?.prospects,
//   })

//   const [currentStepIndex, setCurrentStepIndex] = useState(() => {
//     const savedStep = campaign.wizardStep || "prospects"
//     const index = steps.findIndex((s) => s.id === savedStep)
//     console.log("[v0] Initial step calculation:", {
//       savedStep,
//       calculatedIndex: index,
//       fallbackIndex: index === -1 ? 0 : index,
//     })
//     return index === -1 ? 0 : index
//   })

//   const [completedSteps, setCompletedSteps] = useState<Set<string>>(() => {
//     const saved = (campaign.wizardCompletedSteps as string[]) || []
//     console.log("[v0] Initial completed steps:", saved)
//     return new Set(saved)
//   })

//   const currentStep = steps[currentStepIndex]
//   const StepComponent = currentStep.component

//   const progress = ((currentStepIndex + 1) / steps.length) * 100

//   useEffect(() => {
//     const autoSave = async () => {
//       console.log("[v0] Auto-saving wizard progress:", {
//         stepId: currentStep.id,
//         completedSteps: Array.from(completedSteps),
//       })

//       const result = await updateCampaignWizardProgress(campaign.id, currentStep.id, Array.from(completedSteps), {
//         lastUpdated: new Date().toISOString(),
//       })

//       if (!result.success) {
//         console.error("[v0] Failed to auto-save wizard progress:", result)
//       } else {
//         console.log("[v0] Successfully saved wizard progress")
//       }
//     }

//     const timeoutId = setTimeout(autoSave, 1000)
//     return () => clearTimeout(timeoutId)
//   }, [currentStepIndex, completedSteps, campaign.id, currentStep.id])

//   const handleNext = async () => {
//     setCompletedSteps((prev) => new Set(prev).add(currentStep.id))
//     if (currentStepIndex < steps.length - 1) {
//       setCurrentStepIndex(currentStepIndex + 1)
//     }
//   }

//   const handleBack = () => {
//     if (currentStepIndex > 0) {
//       setCurrentStepIndex(currentStepIndex - 1)
//     }
//   }

//   const handleStepClick = (index: number) => {
//     if (index <= currentStepIndex || completedSteps.has(steps[index - 1]?.id)) {
//       setCurrentStepIndex(index)
//     }
//   }

//   return (
//     <div className="space-y-6 py-6">
//       <div className="space-y-2">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
//             <p className="text-muted-foreground">Campaign Setup Wizard</p>
//           </div>
//           <Badge variant={campaign.status === "ACTIVE" ? "default" : "secondary"}>{campaign.status}</Badge>
//         </div>
//         <div className="space-y-2">
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-muted-foreground">
//               Step {currentStepIndex + 1} of {steps.length}
//             </span>
//             <span className="font-medium">{Math.round(progress)}% Complete</span>
//           </div>
//           <Progress value={progress} className="h-2" />
//         </div>
//       </div>

//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex items-center justify-between gap-2">
//             {steps.map((step, index) => {
//               const isCompleted = completedSteps.has(step.id)
//               const isCurrent = index === currentStepIndex
//               const isAccessible = index <= currentStepIndex || completedSteps.has(steps[index - 1]?.id)
//               const Icon = step.icon

//               return (
//                 <div key={step.id} className="flex items-center flex-1">
//                   <button
//                     onClick={() => handleStepClick(index)}
//                     disabled={!isAccessible}
//                     className={`flex flex-col items-center gap-2 w-full p-3 rounded-lg transition-all ${
//                       isCurrent
//                         ? "bg-primary/10 border-2 border-primary"
//                         : isCompleted
//                           ? "bg-green-50 dark:bg-green-950 border-2 border-green-500"
//                           : "bg-muted/50 border-2 border-transparent hover:bg-muted"
//                     } ${!isAccessible ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
//                   >
//                     <div className="flex items-center gap-2">
//                       {isCompleted ? (
//                         <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
//                       ) : isCurrent ? (
//                         <Icon className="h-5 w-5 text-primary" />
//                       ) : (
//                         <Circle className="h-5 w-5 text-muted-foreground" />
//                       )}
//                     </div>
//                     <div className="text-center">
//                       <div className={`text-xs font-medium ${isCurrent ? "text-primary" : ""}`}>{step.title}</div>
//                     </div>
//                   </button>
//                   {index < steps.length - 1 && (
//                     <ArrowRight className="h-4 w-4 text-muted-foreground mx-1 flex-shrink-0" />
//                   )}
//                 </div>
//               )
//             })}
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
//               <currentStep.icon className="h-5 w-5 text-primary" />
//             </div>
//             <div>
//               <CardTitle>{currentStep.title}</CardTitle>
//               <CardDescription>{currentStep.description}</CardDescription>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <StepComponent
//             campaign={campaign}
//             onNext={handleNext}
//             onBack={handleBack}
//             isFirstStep={currentStepIndex === 0}
//             isLastStep={currentStepIndex === steps.length - 1}
//           />
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, ArrowRight, Sparkles, Users, Mail, Send, BarChart3, ChevronDown } from "lucide-react"
import { ProspectImportStep } from "./wizard-steps/prospect-import-step"
import { ResearchStep } from "./wizard-steps/research-step"
import { EmailGenerationStep } from "./wizard-steps/email-generation-step"
import { ReviewStep } from "./wizard-steps/review-step"
import { LaunchStepWithSequence } from "./wizard-steps/launch-step"
import { updateCampaignWizardProgress } from "@/lib/actions/campaigns"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface Campaign {
  id: string
  name: string
  status: string
  _count: {
    prospects: number
  }
  wizardStep?: string
  wizardCompletedSteps?: string[]
}

interface WizardStep {
  id: string
  title: string
  description: string
  icon: any
  component: any
}

const steps: WizardStep[] = [
  {
    id: "prospects",
    title: "Add Prospects",
    description: "Import or add prospects to your campaign",
    icon: Users,
    component: ProspectImportStep,
  },
  {
    id: "research",
    title: "AI Research",
    description: "Enrich prospects with AI-powered research",
    icon: Sparkles,
    component: ResearchStep,
  },
  {
    id: "generate",
    title: "Generate Emails",
    description: "Create personalized emails with AI",
    icon: Mail,
    component: EmailGenerationStep,
  },
  {
    id: "review",
    title: "Review & Optimize",
    description: "Check quality scores and make improvements",
    icon: BarChart3,
    component: ReviewStep,
  },
  {
    id: "launch",
    title: "Launch Campaign",
    description: "Schedule and send your emails",
    icon: Send,
    component: LaunchStepWithSequence,
  },
]

export function CampaignWizard({ campaign, isPaidUser = false }: { campaign: Campaign; isPaidUser?: boolean }) {
  const router = useRouter()
  const { toast } = useToast()

  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    const savedStep = campaign.wizardStep || "prospects"
    const index = steps.findIndex((s) => s.id === savedStep)
    return index === -1 ? 0 : index
  })

  const [completedSteps, setCompletedSteps] = useState<Set<string>>(() => {
    const saved = (campaign.wizardCompletedSteps as string[]) || []
    return new Set(saved)
  })

  const currentStep = steps[currentStepIndex]
  const StepComponent = currentStep.component
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  useEffect(() => {
    const autoSave = async () => {
      const result = await updateCampaignWizardProgress(campaign.id, currentStep.id, Array.from(completedSteps), {
        lastUpdated: new Date().toISOString(),
      })

      if (!result.success) {
        console.error("Failed to auto-save wizard progress:", result)
      }
    }

    const timeoutId = setTimeout(autoSave, 1000)
    return () => clearTimeout(timeoutId)
  }, [currentStepIndex, completedSteps, campaign.id, currentStep.id])

  const handleNext = async () => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep.id))
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const handleStepClick = (index: number) => {
    if (index <= currentStepIndex || completedSteps.has(steps[index - 1]?.id)) {
      setCurrentStepIndex(index)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 py-4 sm:py-6 px-4 sm:px-0">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">{campaign.name}</h1>
            <p className="text-sm text-muted-foreground">Campaign Setup Wizard</p>
          </div>
          <Badge variant={campaign.status === "ACTIVE" ? "default" : "secondary"} className="w-fit">
            {campaign.status}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Desktop: Horizontal Stepper */}
      <Card className="hidden lg:block">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-2">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(step.id)
              const isCurrent = index === currentStepIndex
              const isAccessible = index <= currentStepIndex || completedSteps.has(steps[index - 1]?.id)
              const Icon = step.icon

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => handleStepClick(index)}
                    disabled={!isAccessible}
                    className={`flex flex-col items-center gap-2 w-full p-3 rounded-lg transition-all ${isCurrent
                      ? "bg-primary/10 border-2 border-primary"
                      : isCompleted
                        ? "bg-green-50 dark:bg-green-950 border-2 border-green-500"
                        : "bg-muted/50 border-2 border-transparent hover:bg-muted"
                      } ${!isAccessible ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : isCurrent ? (
                        <Icon className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="text-center">
                      <div className={`text-xs font-medium ${isCurrent ? "text-primary" : ""}`}>{step.title}</div>
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground mx-1 flex-shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tablet: Compact Horizontal */}
      <Card className="hidden md:block lg:hidden">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-1">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(step.id)
              const isCurrent = index === currentStepIndex
              const isAccessible = index <= currentStepIndex || completedSteps.has(steps[index - 1]?.id)
              const Icon = step.icon

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => handleStepClick(index)}
                    disabled={!isAccessible}
                    className={`flex flex-col items-center gap-1.5 w-full p-2 rounded-lg transition-all ${isCurrent
                      ? "bg-primary/10 border-2 border-primary"
                      : isCompleted
                        ? "bg-green-50 dark:bg-green-950 border-2 border-green-500"
                        : "bg-muted/50 border-2 border-transparent hover:bg-muted"
                      } ${!isAccessible ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : isCurrent ? (
                      <Icon className="h-4 w-4 text-primary" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div className={`text-[10px] font-medium text-center leading-tight ${isCurrent ? "text-primary" : ""}`}>
                      {step.title}
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-3 w-3 text-muted-foreground mx-0.5 flex-shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mobile: Dropdown Selector */}
      <Card className="md:hidden">
        <CardContent className="pt-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <currentStep.icon className="h-4 w-4" />
                  <span className="font-medium">{currentStep.title}</span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(100vw-2rem)] max-w-md">
              {steps.map((step, index) => {
                const isCompleted = completedSteps.has(step.id)
                const isCurrent = index === currentStepIndex
                const isAccessible = index <= currentStepIndex || completedSteps.has(steps[index - 1]?.id)
                const Icon = step.icon

                return (
                  <DropdownMenuItem
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    disabled={!isAccessible}
                    className={`flex items-center gap-3 p-3 ${isCurrent ? "bg-primary/10" : ""} ${!isAccessible ? "opacity-50" : ""
                      }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : isCurrent ? (
                        <Icon className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${isCurrent ? "text-primary" : ""}`}>{step.title}</div>
                      <div className="text-xs text-muted-foreground">{step.description}</div>
                    </div>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile: Visual Progress Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(step.id)
              const isCurrent = index === currentStepIndex

              return (
                <div
                  key={step.id}
                  className={`h-2 rounded-full transition-all ${isCurrent
                    ? "w-8 bg-primary"
                    : isCompleted
                      ? "w-2 bg-green-500"
                      : "w-2 bg-muted-foreground/30"
                    }`}
                />
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content*/}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <currentStep.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="break-words">{currentStep.title}</CardTitle>
              <CardDescription className="break-words">{currentStep.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StepComponent
            campaign={campaign}
            onNext={handleNext}
            onBack={handleBack}
            isFirstStep={currentStepIndex === 0}
            isLastStep={currentStepIndex === steps.length - 1}
            isPaidUser={isPaidUser}
          />
        </CardContent>
      </Card>
    </div>
  )
}