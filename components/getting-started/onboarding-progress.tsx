
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, ChevronRight, Sparkles, X, RotateCcw } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { getOnboardingProgress } from "@/lib/actions/onboarding"
import { useToast } from "@/hooks/use-toast"

interface OnboardingStep {
  id: string
  title: string
  description: string
  link: string
  key: keyof OnboardingData
}

interface OnboardingData {
  hasCreatedCampaign: boolean
  hasAddedProspects: boolean
  hasResearchedProspects: boolean
  hasGeneratedEmail: boolean
  hasSentEmail: boolean
  hasViewedAnalytics: boolean
  onboardingCompletedAt: Date | null
  completedCount: number
  totalSteps: number
  progress: number
  isComplete: boolean
}

const steps: OnboardingStep[] = [
  {
    id: "1",
    title: "Create Your First Campaign",
    description: "Set up a campaign to organize your outreach",
    link: "/dashboard/campaigns/new",
    key: "hasCreatedCampaign",
  },
  {
    id: "2",
    title: "Add Prospects",
    description: "Upload CSV or add prospects manually",
    link: "/dashboard/prospects/new",
    key: "hasAddedProspects",
  },
  {
    id: "3",
    title: "Research Prospects",
    description: "Use AI to gather insights",
    link: "/dashboard/campaigns",
    key: "hasResearchedProspects",
  },
  {
    id: "4",
    title: "Generate Personalized Emails",
    description: "Create AI-powered email content",
    link: "/dashboard/generate",
    key: "hasGeneratedEmail",
  },
  {
    id: "5",
    title: "Send Your Campaign",
    description: "Review and send emails to prospects",
    link: "/dashboard/campaigns",
    key: "hasSentEmail",
  },
  {
    id: "6",
    title: "Track Performance",
    description: "Monitor opens, clicks, and replies",
    link: "/dashboard/analytics",
    key: "hasViewedAnalytics",
  },
]

export function OnboardingProgress() {
  const [data, setData] = useState<OnboardingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadProgress()
    const dismissed = localStorage.getItem("onboarding-dismissed")
    if (dismissed === "true") {
      setIsMinimized(true)
    }
  }, [])

  const loadProgress = async () => {
    const result = await getOnboardingProgress()
    if (result.success && result.data) {
      setData(result.data as OnboardingData)
      if (result.data.onboardingCompletedAt && result.data.isComplete) {
        setIsDismissed(true)
      }
    }
    setIsLoading(false)
  }

  const handleDismiss = async () => {
    setIsMinimized(true)
    localStorage.setItem("onboarding-dismissed", "true")
    toast({
      title: "Guide minimized",
      description: "Click the button below to show it again anytime.",
    })
  }

  const handleRestore = () => {
    setIsMinimized(false)
    localStorage.removeItem("onboarding-dismissed")
  }

  if (isLoading || !data || isDismissed) {
    return null
  }

  if (isMinimized) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <Button
          variant="outline"
          onClick={handleRestore}
          className="border-primary/20 hover:border-primary/50 bg-transparent"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Show Getting Started Guide ({data.completedCount}/{data.totalSteps})
        </Button>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Get Started with mailfra</CardTitle>
                  <CardDescription>
                    {data.isComplete
                      ? "🎉 Congratulations! You've mastered the basics!"
                      : `${data.completedCount} of ${data.totalSteps} steps completed`}
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleDismiss}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground font-medium">Your Progress</span>
                <Badge variant={data.progress === 100 ? "default" : "secondary"}>{data.progress}%</Badge>
              </div>
              <Progress value={data.progress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {steps.map((step) => {
                const isCompleted = data[step.key]
                return (
                  <Link key={step.id} href={step.link}>
                    <div
                      className={`p-3 rounded-lg border transition-all hover:border-primary/50 hover:shadow-sm ${
                        isCompleted ? "bg-primary/5 border-primary/20" : "bg-card"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {step.id}
                            </Badge>
                            <h4
                              className={`font-medium text-sm ${isCompleted ? "text-muted-foreground line-through" : ""}`}
                            >
                              {step.title}
                            </h4>
                          </div>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                          {!isCompleted && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-primary font-medium">
                              Start now
                              <ChevronRight className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
