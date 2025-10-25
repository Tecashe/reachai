"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, ArrowRight, Sparkles, Users, Mail, Send, BarChart3 } from "lucide-react"
import { ProspectImportStep } from "./wizard-steps/prospect-import-step"
import { ResearchStep } from "./wizard-steps/research-step"
import { EmailGenerationStep } from "./wizard-steps/email-generation-step"
import { ReviewStep } from "./wizard-steps/review-step"
import { LaunchStep } from "./wizard-steps/launch-step"

interface Campaign {
  id: string
  name: string
  status: string
  _count: {
    prospects: number
  }
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
    component: LaunchStep,
  },
]

export function CampaignWizard({ campaign }: { campaign: Campaign }) {
  const router = useRouter()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  const currentStep = steps[currentStepIndex]
  const StepComponent = currentStep.component

  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleNext = () => {
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
    // Allow jumping to any previous step or next step if current is complete
    if (index <= currentStepIndex || completedSteps.has(steps[index - 1]?.id)) {
      setCurrentStepIndex(index)
    }
  }

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
            <p className="text-muted-foreground">Campaign Setup Wizard</p>
          </div>
          <Badge variant={campaign.status === "ACTIVE" ? "default" : "secondary"}>{campaign.status}</Badge>
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

      {/* Step Navigation */}
      <Card>
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
                    className={`flex flex-col items-center gap-2 w-full p-3 rounded-lg transition-all ${
                      isCurrent
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

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <currentStep.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>{currentStep.title}</CardTitle>
              <CardDescription>{currentStep.description}</CardDescription>
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
          />
        </CardContent>
      </Card>
    </div>
  )
}
