// "use client"

// import { useState, useEffect, useCallback, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { X, ArrowRight, ArrowLeft, Play } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { motion, AnimatePresence } from "framer-motion"

// interface TourStep {
//   target: string
//   title: string
//   description: string
//   placement?: "top" | "bottom" | "left" | "right" | "auto"
// }

// const tourSteps: TourStep[] = [
//   {
//     target: "[data-tour='dashboard']",
//     title: "Welcome to mailfra!",
//     description: "Let's take a quick tour to help you get started with AI-powered cold email outreach.",
//     placement: "auto",
//   },
//   {
//     target: "[data-tour='campaigns']",
//     title: "Campaigns",
//     description: "Create and manage your email campaigns. Track performance and optimize your outreach strategy.",
//     placement: "auto",
//   },
//   {
//     target: "[data-tour='prospects']",
//     title: "Prospects",
//     description: "Organize prospects into folders. Our AI will research and personalize emails for each contact.",
//     placement: "auto",
//   },
//   {
//     target: "[data-tour='warmup']",
//     title: "Email Warmup",
//     description:
//       "Warm up your sending accounts with our hybrid system. Start with test emails, then scale with peer network.",
//     placement: "auto",
//   },
//   {
//     target: "[data-tour='email-setup']",
//     title: "Email Setup",
//     description: "Configure your domains with SPF, DKIM, and DMARC records for optimal deliverability.",
//     placement: "auto",
//   },
//   {
//     target: "[data-tour='ai-generator']",
//     title: "AI Generator",
//     description: "Generate personalized emails using AI. Create variations and test different approaches.",
//     placement: "auto",
//   },
//   {
//     target: "[data-tour='analytics']",
//     title: "Analytics",
//     description: "Track your campaign performance with detailed analytics and insights.",
//     placement: "auto",
//   },
// ]

// interface Position {
//   top: number
//   left: number
//   placement: "top" | "bottom" | "left" | "right"
// }

// export function OnboardingTour() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [currentStep, setCurrentStep] = useState(0)
//   const [position, setPosition] = useState<Position>({ top: 0, left: 0, placement: "bottom" })
//   const cardRef = useRef<HTMLDivElement>(null)
//   const [isMobile, setIsMobile] = useState(false)
//   const [highlightedElement, setHighlightedElement] = useState<Element | null>(null)

//   // Check if mobile
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 768)
//     checkMobile()
//     window.addEventListener("resize", checkMobile)
//     return () => window.removeEventListener("resize", checkMobile)
//   }, [])

//   // Check if tour has been completed
//   useEffect(() => {
//     const hasSeenTour = localStorage.getItem("mailfra-tour-completed")
//     if (!hasSeenTour) {
//       setTimeout(() => setIsOpen(true), 1500)
//     }
//   }, [])

//   // Calculate optimal position for tour card
//   const calculatePosition = useCallback(
//     (targetElement: Element): Position => {
//       const rect = targetElement.getBoundingClientRect()
//       const cardWidth = isMobile ? window.innerWidth - 32 : 380
//       const cardHeight = 280
//       const padding = 16
//       const arrowOffset = 20

//       const viewportWidth = window.innerWidth
//       const viewportHeight = window.innerHeight

//       // Calculate available space in each direction
//       const spaceTop = rect.top
//       const spaceBottom = viewportHeight - rect.bottom
//       const spaceLeft = rect.left
//       const spaceRight = viewportWidth - rect.right

//       let placement: "top" | "bottom" | "left" | "right" = "bottom"
//       let top = 0
//       let left = 0

//       // On mobile, always center horizontally and place below or above
//       if (isMobile) {
//         left = viewportWidth / 2 - cardWidth / 2

//         if (spaceBottom >= cardHeight + padding) {
//           placement = "bottom"
//           top = rect.bottom + arrowOffset
//         } else if (spaceTop >= cardHeight + padding) {
//           placement = "top"
//           top = rect.top - cardHeight - arrowOffset
//         } else {
//           // Not enough space, center vertically
//           placement = "bottom"
//           top = Math.max(padding, Math.min(viewportHeight - cardHeight - padding, rect.bottom + arrowOffset))
//         }
//       } else {
//         // Desktop: try right, left, bottom, top in order of preference
//         if (spaceRight >= cardWidth + padding) {
//           placement = "right"
//           left = rect.right + arrowOffset
//           top = rect.top + rect.height / 2 - cardHeight / 2
//         } else if (spaceLeft >= cardWidth + padding) {
//           placement = "left"
//           left = rect.left - cardWidth - arrowOffset
//           top = rect.top + rect.height / 2 - cardHeight / 2
//         } else if (spaceBottom >= cardHeight + padding) {
//           placement = "bottom"
//           top = rect.bottom + arrowOffset
//           left = rect.left + rect.width / 2 - cardWidth / 2
//         } else if (spaceTop >= cardHeight + padding) {
//           placement = "top"
//           top = rect.top - cardHeight - arrowOffset
//           left = rect.left + rect.width / 2 - cardWidth / 2
//         } else {
//           // Fallback: center on screen
//           placement = "bottom"
//           top = viewportHeight / 2 - cardHeight / 2
//           left = viewportWidth / 2 - cardWidth / 2
//         }
//       }

//       // Constrain to viewport
//       top = Math.max(padding, Math.min(top, viewportHeight - cardHeight - padding))
//       left = Math.max(padding, Math.min(left, viewportWidth - cardWidth - padding))

//       return { top, left, placement }
//     },
//     [isMobile],
//   )

//   // Update position when step changes
//   useEffect(() => {
//     if (isOpen && tourSteps[currentStep]) {
//       const updatePosition = () => {
//         const targetElement = document.querySelector(tourSteps[currentStep].target)
//         if (targetElement) {
//           const newPosition = calculatePosition(targetElement)
//           setPosition(newPosition)
//           setHighlightedElement(targetElement)

//           targetElement.classList.add(
//             "!ring-4",
//             "!ring-blue-500",
//             "!ring-offset-4",
//             "!ring-offset-background",
//             "rounded-lg",
//             "!relative",
//             "!z-[60]",
//             "transition-all",
//             "duration-300",
//           )

//           // Scroll target into view smoothly
//           setTimeout(() => {
//             targetElement.scrollIntoView({
//               behavior: "smooth",
//               block: "center",
//               inline: "center",
//             })
//           }, 100)

//           return () => {
//             targetElement.classList.remove(
//               "!ring-4",
//               "!ring-blue-500",
//               "!ring-offset-4",
//               "!ring-offset-background",
//               "rounded-lg",
//               "!relative",
//               "!z-[60]",
//               "transition-all",
//               "duration-300",
//             )
//           }
//         }
//       }

//       // Initial position
//       const cleanup = updatePosition()

//       // Update on resize
//       window.addEventListener("resize", updatePosition)
//       window.addEventListener("scroll", updatePosition, true)

//       return () => {
//         cleanup?.()
//         setHighlightedElement(null)
//         window.removeEventListener("resize", updatePosition)
//         window.removeEventListener("scroll", updatePosition, true)
//       }
//     }
//   }, [isOpen, currentStep, calculatePosition])

//   const handleNext = () => {
//     if (currentStep < tourSteps.length - 1) {
//       setCurrentStep(currentStep + 1)
//     } else {
//       handleComplete()
//     }
//   }

//   const handlePrevious = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1)
//     }
//   }

//   const handleSkip = () => {
//     setIsOpen(false)
//     localStorage.setItem("mailfra-tour-completed", "true")
//   }

//   const handleComplete = () => {
//     setIsOpen(false)
//     localStorage.setItem("mailfra-tour-completed", "true")
//   }

//   const step = tourSteps[currentStep]

//   return (
//     <>
//       <AnimatePresence>
//         {isOpen && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 z-40 bg-black/60"
//               onClick={handleSkip}
//             />

//             {highlightedElement && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="fixed z-50 pointer-events-none"
//                 style={{
//                   top: highlightedElement.getBoundingClientRect().top - 8,
//                   left: highlightedElement.getBoundingClientRect().left - 8,
//                   width: highlightedElement.getBoundingClientRect().width + 16,
//                   height: highlightedElement.getBoundingClientRect().height + 16,
//                   boxShadow: `
//                     0 0 0 4px rgba(59, 130, 246, 0.5),
//                     0 0 0 9999px rgba(0, 0, 0, 0.6)
//                   `,
//                   borderRadius: "12px",
//                   transition: "all 0.3s ease",
//                 }}
//               />
//             )}

//             {/* Tour Card */}
//             <motion.div
//               ref={cardRef}
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               transition={{ type: "spring", damping: 25, stiffness: 300 }}
//               className="fixed z-[70]"
//               style={{
//                 top: `${position.top}px`,
//                 left: `${position.left}px`,
//                 width: isMobile ? "calc(100vw - 32px)" : "380px",
//               }}
//             >
//               <Card className="shadow-2xl border-2 border-blue-500/20 bg-background/95 backdrop-blur-xl">
//                 {/* Arrow indicator */}
//                 <div
//                   className={cn(
//                     "absolute w-4 h-4 bg-background border-blue-500/20 rotate-45",
//                     position.placement === "bottom" && "-top-2 left-1/2 -translate-x-1/2 border-t-2 border-l-2",
//                     position.placement === "top" && "-bottom-2 left-1/2 -translate-x-1/2 border-b-2 border-r-2",
//                     position.placement === "right" && "-left-2 top-1/2 -translate-y-1/2 border-l-2 border-b-2",
//                     position.placement === "left" && "-right-2 top-1/2 -translate-y-1/2 border-r-2 border-t-2",
//                   )}
//                 />

//                 <CardHeader className="pb-3">
//                   <div className="flex items-start justify-between gap-2">
//                     <div className="flex-1">
//                       <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//                         {step.title}
//                       </CardTitle>
//                       <CardDescription className="text-xs mt-1.5 font-medium">
//                         Step {currentStep + 1} of {tourSteps.length}
//                       </CardDescription>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
//                       onClick={handleSkip}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   {/* Progress bar */}
//                   <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
//                     <motion.div
//                       className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
//                       initial={{ width: 0 }}
//                       animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
//                       transition={{ duration: 0.3 }}
//                     />
//                   </div>
//                 </CardHeader>

//                 <CardContent className="pb-4">
//                   <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
//                 </CardContent>

//                 <CardFooter className="flex items-center justify-between pt-0">
//                   <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
//                     Skip Tour
//                   </Button>
//                   <div className="flex items-center gap-2">
//                     {currentStep > 0 && (
//                       <Button variant="outline" size="sm" onClick={handlePrevious}>
//                         <ArrowLeft className="h-4 w-4 mr-1" />
//                         Back
//                       </Button>
//                     )}
//                     <Button
//                       size="sm"
//                       onClick={handleNext}
//                       className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md"
//                     >
//                       {currentStep < tourSteps.length - 1 ? (
//                         <>
//                           Next
//                           <ArrowRight className="h-4 w-4 ml-1" />
//                         </>
//                       ) : (
//                         "Finish"
//                       )}
//                     </Button>
//                   </div>
//                 </CardFooter>
//               </Card>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   )
// }

// export function TourTrigger() {
//   const [isOpen, setIsOpen] = useState(false)

//   const startTour = () => {
//     localStorage.removeItem("mailfra-tour-completed")
//     setIsOpen(true)
//     // Reload to restart tour
//     window.location.reload()
//   }

//   return (
//     <Button variant="outline" size="sm" onClick={startTour} className="gap-2 bg-transparent">
//       <Play className="h-4 w-4" />
//       Take Tour
//     </Button>
//   )
// }


"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  CheckCircle2,
  Mail,
  Users,
  Shield,
  Flame,
  Server,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TourStep {
  target: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const tourSteps: TourStep[] = [
  {
    target: "[data-tour='dashboard']",
    title: "Welcome to Your Dashboard",
    description:
      "This is your command center. See all your key metrics, recent campaigns, and quick actions at a glance.",
    icon: Sparkles,
  },
  {
    target: "[data-tour='campaigns']",
    title: "Campaign Management",
    description: "Create, schedule, and monitor your email campaigns. Track opens, clicks, and replies in real-time.",
    icon: Mail,
  },
  {
    target: "[data-tour='prospects']",
    title: "Prospect Management",
    description: "Organize your contacts into smart lists. Import from CSV or add them manually.",
    icon: Users,
  },
  {
    target: "[data-tour='warmup']",
    title: "Email Warmup",
    description:
      "Build sender reputation gradually. Our system warms up your email accounts to improve deliverability.",
    icon: Flame,
  },
  {
    target: "[data-tour='email-setup']",
    title: "Email Setup",
    description: "Configure SPF, DKIM, and DMARC records for your domains to maximize inbox placement.",
    icon: Server,
  },
  {
    target: "[data-tour='deliverability']",
    title: "Deliverability Hub",
    description: "Monitor your domain health, check blacklist status, and optimize your sending reputation.",
    icon: Shield,
  },
  {
    target: "[data-tour='ai-generator']",
    title: "AI Email Generator",
    description: "Generate personalized, high-converting emails using AI. Create multiple variations instantly.",
    icon: Zap,
  },
  {
    target: "[data-tour='analytics']",
    title: "Analytics & Insights",
    description: "Deep dive into your campaign performance with detailed charts and actionable insights.",
    icon: BarChart3,
  },
]

interface TooltipPosition {
  top: number
  left: number
}

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ top: 100, left: 280 })
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("mailfra-tour-completed")
    if (!hasSeenTour) {
      setTimeout(() => setIsOpen(true), 1000)
    }
  }, [])

  const updateHighlight = useCallback(() => {
    if (!isOpen || !tourSteps[currentStep]) return

    const targetElement = document.querySelector(tourSteps[currentStep].target)
    if (!targetElement) return

    const rect = targetElement.getBoundingClientRect()
    setHighlightRect(rect)

    // Position tooltip to the RIGHT of the sidebar item
    // Sidebar is ~256px wide, so position tooltip starting at ~280px from left
    const tooltipLeft = Math.max(rect.right + 20, 280)
    const tooltipTop = Math.max(rect.top - 10, 20)

    setTooltipPosition({
      top: tooltipTop,
      left: tooltipLeft,
    })

    // Scroll the element into view if needed
    targetElement.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [isOpen, currentStep])

  useEffect(() => {
    updateHighlight()

    // Update on resize/scroll
    window.addEventListener("resize", updateHighlight)
    window.addEventListener("scroll", updateHighlight, true)

    // Also update after a small delay for animations
    const timer = setTimeout(updateHighlight, 100)

    return () => {
      window.removeEventListener("resize", updateHighlight)
      window.removeEventListener("scroll", updateHighlight, true)
      clearTimeout(timer)
    }
  }, [updateHighlight])

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
    localStorage.setItem("mailfra-tour-completed", "true")
  }

  const handleComplete = () => {
    setIsOpen(false)
    localStorage.setItem("mailfra-tour-completed", "true")
  }

  if (!isOpen) return null

  const step = tourSteps[currentStep]
  const StepIcon = step.icon

  return (
    <>
      {/* Dark overlay with cutout for highlighted element */}
      <div className="fixed inset-0 z-[100] pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <mask id="tour-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {highlightRect && (
                <rect
                  x={highlightRect.left - 4}
                  y={highlightRect.top - 4}
                  width={highlightRect.width + 8}
                  height={highlightRect.height + 8}
                  rx="8"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="rgba(0, 0, 0, 0.75)" mask="url(#tour-mask)" />
        </svg>
      </div>

      {/* Highlight ring around target element */}
      {highlightRect && (
        <div
          className="fixed z-[101] pointer-events-none rounded-lg ring-2 ring-primary ring-offset-2 ring-offset-background"
          style={{
            top: highlightRect.top - 4,
            left: highlightRect.left - 4,
            width: highlightRect.width + 8,
            height: highlightRect.height + 8,
          }}
        >
          {/* Animated pulse effect */}
          <div className="absolute inset-0 rounded-lg animate-pulse bg-primary/20" />
        </div>
      )}

      {/* Clickable overlay to allow skip */}
      <div className="fixed inset-0 z-[102] cursor-pointer" onClick={handleSkip} aria-label="Click to skip tour" />

      {/* Tooltip positioned next to highlighted element */}
      <div
        className="fixed z-[103] w-[340px] animate-in fade-in slide-in-from-left-2 duration-300"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        {/* Arrow pointing to the highlighted element */}
        <div
          className="absolute -left-2 top-6 w-0 h-0"
          style={{
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
            borderRight: "8px solid hsl(var(--card))",
          }}
        />

        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
          {/* Progress bar at top */}
          <div className="h-1 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
            />
          </div>

          <div className="p-5">
            {/* Header with icon and step counter */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <StepIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    Step {currentStep + 1} of {tourSteps.length}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-1" onClick={handleSkip}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.description}</p>

            {/* Step indicators */}
            <div className="flex items-center gap-1.5 mb-4">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-200",
                    index === currentStep
                      ? "w-6 bg-primary"
                      : index < currentStep
                        ? "w-1.5 bg-primary/60"
                        : "w-1.5 bg-muted",
                  )}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                Skip
              </Button>
              <div className="flex gap-2">
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
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Done
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function TourTrigger() {
  const startTour = () => {
    localStorage.removeItem("mailfra-tour-completed")
    window.location.reload()
  }

  return (
    <Button variant="outline" size="sm" onClick={startTour} className="gap-2 bg-transparent">
      <Sparkles className="h-4 w-4" />
      Take Tour
    </Button>
  )
}
