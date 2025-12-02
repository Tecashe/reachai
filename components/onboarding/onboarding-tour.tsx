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
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Mail,
  Users,
  Shield,
  Flame,
  Server,
  BarChart3,
  Inbox,
  LayoutDashboard,
  FileText,
  GitBranch,
  Target,
  Zap,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TourStep {
  target: string
  parentGroup?: string // Group that needs to be expanded first
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  position?: "right" | "bottom" // Where to position tooltip relative to target
}

// Steps follow the visual order: top items -> groups (expanded) -> bottom items
const tourSteps: TourStep[] = [
  // Top level items (always visible)
  {
    target: "[data-tour='dashboard']",
    title: "Your Dashboard",
    description: "Your command center. View key metrics, recent activity, and quick actions all in one place.",
    icon: LayoutDashboard,
    position: "right",
  },
  {
    target: "[data-tour='inbox']",
    title: "Unified Inbox",
    description: "All your email replies in one place. Reply, categorize, and manage conversations efficiently.",
    icon: Inbox,
    position: "right",
  },
  // Campaigns group
  {
    target: "[data-tour='campaigns']",
    parentGroup: "campaigns",
    title: "All Campaigns",
    description: "View and manage all your email campaigns. Track performance, pause, or edit campaigns anytime.",
    icon: Mail,
    position: "right",
  },
  {
    target: "[data-tour='analytics']",
    parentGroup: "campaigns",
    title: "Campaign Analytics",
    description: "Deep insights into opens, clicks, replies, and conversions. A/B test results and trends over time.",
    icon: BarChart3,
    position: "right",
  },
  // Outreach group
  {
    target: "[data-tour='prospects']",
    parentGroup: "outreach",
    title: "Your Prospects",
    description: "Manage your contact lists. Import from CSV, segment by criteria, and track engagement history.",
    icon: Users,
    position: "right",
  },
  {
    target: "[data-tour='sequences']",
    parentGroup: "outreach",
    title: "Email Sequences",
    description: "Automate follow-ups with smart sequences. Set triggers, delays, and conditional logic.",
    icon: GitBranch,
    position: "right",
  },
  {
    target: "[data-tour='templates']",
    parentGroup: "outreach",
    title: "Email Templates",
    description: "Save time with reusable templates. Use variables for personalization at scale.",
    icon: FileText,
    position: "right",
  },
  // Deliverability group
  {
    target: "[data-tour='deliverability']",
    parentGroup: "deliverability",
    title: "Deliverability Hub",
    description: "Monitor domain health, check blacklists, and optimize your sender reputation score.",
    icon: Shield,
    position: "right",
  },
  {
    target: "[data-tour='warmup']",
    parentGroup: "deliverability",
    title: "Email Warmup",
    description: "Gradually build sender reputation. Our system sends and receives emails to warm up your accounts.",
    icon: Flame,
    position: "right",
  },
  {
    target: "[data-tour='email-setup']",
    parentGroup: "deliverability",
    title: "Email Setup",
    description: "Configure SPF, DKIM, and DMARC records. Our wizard guides you through each step.",
    icon: Server,
    position: "right",
  },
  // AI Tools group
  {
    target: "[data-tour='ai-generator']",
    parentGroup: "ai tools",
    title: "AI Email Generator",
    description: "Generate personalized emails with AI. Create compelling subject lines and body copy instantly.",
    icon: Sparkles,
    position: "right",
  },
  {
    target: "[data-tour='ai-predictor']",
    parentGroup: "ai tools",
    title: "AI Predictor",
    description: "Predict email performance before sending. Get scores for deliverability, spam risk, and engagement.",
    icon: Target,
    position: "right",
  },
  // Bottom items (always visible)
  {
    target: "[data-tour='integrations']",
    title: "Integrations",
    description: "Connect your favorite tools - CRMs, calendars, and more. Sync data automatically.",
    icon: Zap,
    position: "right",
  },
  {
    target: "[data-tour='settings']",
    title: "Settings",
    description: "Configure your account, email sending settings, team members, and preferences.",
    icon: Settings,
    position: "right",
  },
]

interface HighlightRect {
  top: number
  left: number
  width: number
  height: number
}

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(null)
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const [isTransitioning, setIsTransitioning] = useState(false)
  const observerRef = useRef<MutationObserver | null>(null)

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("mailfra-tour-completed")
    if (!hasSeenTour) {
      setTimeout(() => setIsOpen(true), 800)
    }
  }, [])

  const expandParentGroup = useCallback((groupName: string | undefined): Promise<void> => {
    return new Promise((resolve) => {
      if (!groupName) {
        resolve()
        return
      }

      const groupButton = document.querySelector(`[data-tour-group="${groupName}"]`) as HTMLButtonElement
      if (!groupButton) {
        resolve()
        return
      }

      // Check if group is already expanded by looking at the chevron rotation
      const chevron = groupButton.querySelector("svg:last-child")
      const isExpanded = chevron?.classList.contains("rotate-180")

      if (!isExpanded) {
        groupButton.click()
        // Wait for animation to complete
        setTimeout(resolve, 250)
      } else {
        resolve()
      }
    })
  }, [])

  const updateHighlight = useCallback(async () => {
    if (!isOpen || !tourSteps[currentStep]) return

    const step = tourSteps[currentStep]

    // First, expand the parent group if needed
    await expandParentGroup(step.parentGroup)

    // Small delay to let DOM update after expansion
    await new Promise((r) => setTimeout(r, 50))

    const targetElement = document.querySelector(step.target) as HTMLElement | null
    if (!targetElement) {
      console.log("[v0] Tour target not found:", step.target)
      return
    }

    const sidebar =
      document.querySelector('[data-sidebar="sidebar"]') ||
      document.querySelector(".sidebar-content") ||
      targetElement.closest("aside") ||
      targetElement.closest('[role="navigation"]')

    const scrollableContainer =
      sidebar?.querySelector("[data-radix-scroll-area-viewport]") ||
      sidebar?.querySelector(".overflow-y-auto") ||
      sidebar

    if (scrollableContainer) {
      // Get the target's position relative to the scrollable container
      const containerRect = scrollableContainer.getBoundingClientRect()
      const targetRect = targetElement.getBoundingClientRect()

      // Check if element is outside visible area
      const isAboveView = targetRect.top < containerRect.top
      const isBelowView = targetRect.bottom > containerRect.bottom

      if (isAboveView || isBelowView) {
        const elementTop = targetElement.offsetTop
        const containerHeight = scrollableContainer.clientHeight
        const elementHeight = targetElement.clientHeight || 40
        const scrollTo = elementTop - containerHeight / 2 + elementHeight / 2

        scrollableContainer.scrollTo({
          top: Math.max(0, scrollTo),
          behavior: "smooth",
        })

        // Wait for scroll to complete before updating highlight position
        await new Promise((r) => setTimeout(r, 350))
      }
    }

    // Fallback: use native scrollIntoView if custom scroll didn't work
    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    })

    // Wait a bit more for scroll to settle
    await new Promise((r) => setTimeout(r, 100))

    // Now get the updated rect after scrolling
    const rect = targetElement.getBoundingClientRect()

    // Set highlight rectangle around the target
    setHighlightRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    })

    // Position tooltip to the right of the sidebar (sidebar is ~256px wide)
    // Account for different screen sizes
    const sidebarWidth = 256
    const tooltipWidth = 360
    const padding = 24

    const tooltipLeft = sidebarWidth + padding
    let tooltipTop = rect.top

    // Ensure tooltip doesn't go off screen vertically
    const viewportHeight = window.innerHeight
    const estimatedTooltipHeight = 280
    if (tooltipTop + estimatedTooltipHeight > viewportHeight - 20) {
      tooltipTop = viewportHeight - estimatedTooltipHeight - 20
    }
    if (tooltipTop < 20) {
      tooltipTop = 20
    }

    setTooltipStyle({
      position: "fixed",
      top: tooltipTop,
      left: tooltipLeft,
      width: tooltipWidth,
      zIndex: 10003,
    })
  }, [isOpen, currentStep, expandParentGroup])

  useEffect(() => {
    if (!isOpen) return

    setIsTransitioning(true)
    const timer = setTimeout(() => {
      updateHighlight()
      setIsTransitioning(false)
    }, 100)

    // Watch for DOM changes
    observerRef.current = new MutationObserver(() => {
      updateHighlight()
    })
    observerRef.current.observe(document.body, { childList: true, subtree: true })

    window.addEventListener("resize", updateHighlight)

    return () => {
      clearTimeout(timer)
      observerRef.current?.disconnect()
      window.removeEventListener("resize", updateHighlight)
    }
  }, [isOpen, currentStep, updateHighlight])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setIsTransitioning(true)
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsTransitioning(true)
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

  const goToStep = (index: number) => {
    setIsTransitioning(true)
    setCurrentStep(index)
  }

  if (!isOpen) return null

  const step = tourSteps[currentStep]
  const StepIcon = step.icon

  return (
    <>
      {/* Dark overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] transition-opacity duration-300"
        onClick={handleSkip}
      />

      {/* Highlight cutout - creates a "hole" in the overlay */}
      {highlightRect && (
        <>
          {/* Clear area around target */}
          <div
            className="fixed z-[10001] bg-background rounded-lg transition-all duration-300 ease-out"
            style={{
              top: highlightRect.top - 6,
              left: highlightRect.left - 6,
              width: highlightRect.width + 12,
              height: highlightRect.height + 12,
            }}
          />
          {/* Animated border ring */}
          <div
            className="fixed z-[10002] rounded-lg border-2 border-primary transition-all duration-300 ease-out"
            style={{
              top: highlightRect.top - 6,
              left: highlightRect.left - 6,
              width: highlightRect.width + 12,
              height: highlightRect.height + 12,
              boxShadow: "0 0 0 4px rgba(var(--primary), 0.2), 0 0 20px rgba(var(--primary), 0.3)",
            }}
          >
            {/* Pulse animation */}
            <div className="absolute inset-0 rounded-lg border-2 border-primary animate-ping opacity-30" />
          </div>
        </>
      )}

      {/* Tooltip card */}
      <div
        className={cn(
          "transition-all duration-300 ease-out",
          isTransitioning ? "opacity-0 translate-x-2" : "opacity-100 translate-x-0",
        )}
        style={tooltipStyle}
      >
        {/* Arrow pointing left to the sidebar */}
        <div
          className="absolute -left-3 top-8 w-0 h-0"
          style={{
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderRight: "12px solid hsl(var(--card))",
            filter: "drop-shadow(-2px 0 2px rgba(0,0,0,0.1))",
          }}
        />

        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Gradient accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                  <StepIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Step {currentStep + 1} of {tourSteps.length}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted" onClick={handleSkip}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{step.description}</p>

            {/* Progress dots - clickable */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {tourSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={cn(
                    "transition-all duration-200 rounded-full",
                    index === currentStep
                      ? "w-8 h-2 bg-primary"
                      : index < currentStep
                        ? "w-2 h-2 bg-primary/50 hover:bg-primary/70"
                        : "w-2 h-2 bg-muted hover:bg-muted-foreground/30",
                  )}
                  title={`Go to step ${index + 1}: ${tourSteps[index].title}`}
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
                Skip tour
              </Button>
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" size="sm" onClick={handlePrevious} className="gap-1 bg-transparent">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                )}
                <Button size="sm" onClick={handleNext} className="gap-1 min-w-[100px]">
                  {currentStep < tourSteps.length - 1 ? (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Complete
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
