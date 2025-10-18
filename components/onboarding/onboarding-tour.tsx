"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, ArrowRight, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface TourStep {
  target: string
  title: string
  description: string
  placement?: "top" | "bottom" | "left" | "right"
}

const tourSteps: TourStep[] = [
  {
    target: "[data-tour='dashboard']",
    title: "Welcome to ReachAI!",
    description: "Let's take a quick tour to help you get started with AI-powered cold email outreach.",
    placement: "bottom",
  },
  {
    target: "[data-tour='campaigns']",
    title: "Campaigns",
    description: "Create and manage your email campaigns. Track performance and optimize your outreach strategy.",
    placement: "right",
  },
  {
    target: "[data-tour='prospects']",
    title: "Prospects",
    description: "Add and manage your prospects. Our AI will research and personalize emails for each contact.",
    placement: "right",
  },
  {
    target: "[data-tour='ai-generator']",
    title: "AI Generator",
    description: "Generate personalized emails using AI. Create variations and test different approaches.",
    placement: "right",
  },
  {
    target: "[data-tour='analytics']",
    title: "Analytics",
    description: "Track your campaign performance with detailed analytics and insights.",
    placement: "right",
  },
]

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("reachai-tour-completed")
    if (!hasSeenTour) {
      setTimeout(() => setIsOpen(true), 1000)
    }
  }, [])

  useEffect(() => {
    if (isOpen && tourSteps[currentStep]) {
      const targetElement = document.querySelector(tourSteps[currentStep].target)
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect()
        const placement = tourSteps[currentStep].placement || "bottom"

        let top = 0
        let left = 0

        switch (placement) {
          case "bottom":
            top = rect.bottom + window.scrollY + 10
            left = rect.left + window.scrollX + rect.width / 2
            break
          case "right":
            top = rect.top + window.scrollY + rect.height / 2
            left = rect.right + window.scrollX + 10
            break
          case "top":
            top = rect.top + window.scrollY - 10
            left = rect.left + window.scrollX + rect.width / 2
            break
          case "left":
            top = rect.top + window.scrollY + rect.height / 2
            left = rect.left + window.scrollX - 10
            break
        }

        setPosition({ top, left })

        // Highlight the target element
        targetElement.classList.add("ring-2", "ring-primary", "ring-offset-2", "rounded-lg")

        return () => {
          targetElement.classList.remove("ring-2", "ring-primary", "ring-offset-2", "rounded-lg")
        }
      }
    }
  }, [isOpen, currentStep])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    setIsOpen(false)
    localStorage.setItem("reachai-tour-completed", "true")
  }

  const handleComplete = () => {
    setIsOpen(false)
    localStorage.setItem("reachai-tour-completed", "true")
  }

  if (!isOpen) return null

  const step = tourSteps[currentStep]

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in" onClick={handleSkip} />

      {/* Tour Card */}
      <Card
        className={cn(
          "fixed z-50 w-80 shadow-2xl animate-in fade-in slide-in-from-bottom-4",
          "transform -translate-x-1/2 -translate-y-1/2",
        )}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{step.title}</CardTitle>
              <CardDescription className="text-xs mt-1">
                Step {currentStep + 1} of {tourSteps.length}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{step.description}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            Skip Tour
          </Button>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button variant="outline" size="sm" onClick={handlePrevious}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            <Button size="sm" onClick={handleNext}>
              {currentStep < tourSteps.length - 1 ? (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                "Finish"
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}
