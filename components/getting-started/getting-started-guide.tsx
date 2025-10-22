"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, ChevronRight, BookOpen, X } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const steps = [
  {
    id: 1,
    title: "Create Your First Campaign",
    description: "Set up a campaign to organize your outreach efforts",
    link: "/dashboard/campaigns/new",
    completed: false,
  },
  {
    id: 2,
    title: "Add Prospects",
    description: "Upload a CSV or manually add prospects to your campaign",
    link: "/dashboard/prospects/new",
    completed: false,
  },
  {
    id: 3,
    title: "Research Prospects",
    description: "Use AI to gather insights about your prospects",
    link: "/dashboard/campaigns",
    completed: false,
  },
  {
    id: 4,
    title: "Generate Personalized Emails",
    description: "Create AI-powered personalized email content",
    link: "/dashboard/generate",
    completed: false,
  },
  {
    id: 5,
    title: "Send Your Campaign",
    description: "Review and send emails to your prospects",
    link: "/dashboard/campaigns",
    completed: false,
  },
  {
    id: 6,
    title: "Track Performance",
    description: "Monitor opens, clicks, and replies in analytics",
    link: "/dashboard/analytics",
    completed: false,
  },
]

export function GettingStartedGuide() {
  const [isOpen, setIsOpen] = useState(true)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const toggleStep = (stepId: number) => {
    setCompletedSteps((prev) => (prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]))
  }

  const progress = (completedSteps.length / steps.length) * 100

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
      >
        <BookOpen className="h-4 w-4 mr-2" />
        Getting Started Guide
      </Button>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 right-4 z-50 w-96"
      >
        <Card className="shadow-2xl border-2">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Getting Started</CardTitle>
                <CardDescription>Complete these steps to master ReachAI</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id)
              return (
                <div
                  key={step.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                >
                  <button onClick={() => toggleStep(step.id)} className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {index + 1}
                      </Badge>
                      <h4 className={`font-medium text-sm ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                    <Link href={step.link}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Go to step
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
