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
import { Card } from "@/components/ui/card"
import { X, ArrowRight, Sparkles, Zap, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface TourStep {
  target: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const tourSteps: TourStep[] = [
  {
    target: "[data-tour='dashboard']",
    title: "Welcome to MailFra",
    description:
      "Your AI-powered cold email platform. Let's take a quick tour to show you the essential features that will transform your outreach.",
    icon: Sparkles,
  },
  {
    target: "[data-tour='campaigns']",
    title: "Campaign Management",
    description:
      "Create, schedule, and monitor your email campaigns with real-time analytics. Track opens, clicks, and replies all in one place.",
    icon: Zap,
  },
  {
    target: "[data-tour='prospects']",
    title: "Intelligent Prospect Organization",
    description:
      "Organize your contacts into smart folders. Our AI researches each prospect and personalizes every message automatically.",
    icon: CheckCircle2,
  },
  {
    target: "[data-tour='warmup']",
    title: "Email Warmup",
    description:
      "Warm up your sending accounts with our hybrid system. Start with test emails, then scale with peer network.",
    icon: Zap,
  },
  {
    target: "[data-tour='email-setup']",
    title: "Email Setup",
    description: "Configure your domains with SPF, DKIM, and DMARC records for optimal deliverability.",
    icon: Zap,
  },
  {
    target: "[data-tour='ai-generator']",
    title: "AI Generator",
    description: "Generate personalized emails using AI. Create variations and test different approaches.",
    icon: Zap,
  },
  {
    target: "[data-tour='analytics']",
    title: "Analytics",
    description: "Track your campaign performance with detailed analytics and insights.",
    icon: Zap,
  },
]

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null)

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("mailfra-tour-completed")
    if (!hasSeenTour) {
      setTimeout(() => setIsOpen(true), 1500)
    }
  }, [])

  const calculatePosition = useCallback((targetElement: Element) => {
    const rect = targetElement.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    const top = rect.top + window.scrollY
    const left = rect.left + window.scrollX

    return { top, left }
  }, [])

  useEffect(() => {
    if (isOpen && tourSteps[currentStep]) {
      const updatePosition = () => {
        const targetElement = document.querySelector(tourSteps[currentStep].target)
        if (targetElement) {
          const newPosition = calculatePosition(targetElement)
          setHighlightedElement(targetElement)

          targetElement.classList.add(
            "!ring-4",
            "!ring-blue-500",
            "!ring-offset-4",
            "!ring-offset-background",
            "rounded-lg",
            "!relative",
            "!z-[60]",
            "transition-all",
            "duration-300",
          )

          setTimeout(() => {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "center",
            })
          }, 100)

          return () => {
            targetElement.classList.remove(
              "!ring-4",
              "!ring-blue-500",
              "!ring-offset-4",
              "!ring-offset-background",
              "rounded-lg",
              "!relative",
              "!z-[60]",
              "transition-all",
              "duration-300",
            )
          }
        }
      }

      const cleanup = updatePosition()

      window.addEventListener("resize", updatePosition)
      window.addEventListener("scroll", updatePosition, true)

      return () => {
        cleanup?.()
        setHighlightedElement(null)
        window.removeEventListener("resize", updatePosition)
        window.removeEventListener("scroll", updatePosition, true)
      }
    }
  }, [isOpen, currentStep, calculatePosition])

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

  const step = tourSteps[currentStep]
  const StepIcon = step.icon

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md"
            onClick={handleSkip}
          />

          {highlightedElement && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed z-50 pointer-events-none"
              style={{
                top: highlightedElement.getBoundingClientRect().top - 12,
                left: highlightedElement.getBoundingClientRect().left - 12,
                width: highlightedElement.getBoundingClientRect().width + 24,
                height: highlightedElement.getBoundingClientRect().height + 24,
                boxShadow: `
                  0 0 0 4px rgba(99, 102, 241, 0.4),
                  0 0 0 2000px rgba(0, 0, 0, 0.8),
                  0 0 60px rgba(99, 102, 241, 0.3)
                `,
                borderRadius: "16px",
              }}
            />
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[70] max-w-lg"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "calc(100vw - 32px)",
              maxWidth: "480px",
            }}
          >
            <Card className="relative overflow-hidden border-0 bg-background/95 backdrop-blur-2xl shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full hover:bg-muted"
                onClick={handleSkip}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                    <StepIcon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold tracking-tight">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Step {currentStep + 1} of {tourSteps.length}
                    </p>
                  </div>
                </div>

                <p className="text-base leading-relaxed text-muted-foreground mb-6">{step.description}</p>

                <div className="mb-6">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    {tourSteps.map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-2 h-2 rounded-full transition-colors",
                          index <= currentStep ? "bg-indigo-500" : "bg-muted",
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground hover:text-foreground">
                    Skip Tour
                  </Button>
                  <div className="flex gap-2">
                    {currentStep > 0 && (
                      <Button variant="outline" onClick={handlePrevious} className="rounded-xl bg-transparent">
                        Back
                      </Button>
                    )}
                    <Button
                      onClick={handleNext}
                      className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20"
                    >
                      {currentStep < tourSteps.length - 1 ? (
                        <>
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        "Get Started"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function TourTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  const startTour = () => {
    localStorage.removeItem("mailfra-tour-completed")
    setIsOpen(true)
    window.location.reload()
  }

  return (
    <Button variant="outline" size="sm" onClick={startTour} className="gap-2 bg-transparent">
      <Sparkles className="h-4 w-4" />
      Take Tour
    </Button>
  )
}
