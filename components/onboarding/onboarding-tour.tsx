
// "use client"

// import type React from "react"
// import { useState, useEffect, useCallback, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   X,
//   ArrowRight,
//   ArrowLeft,
//   Sparkles,
//   CheckCircle2,
//   Mail,
//   Users,
//   Shield,
//   Flame,
//   Server,
//   BarChart3,
//   Inbox,
//   LayoutDashboard,
//   FileText,
//   GitBranch,
//   Target,
//   Zap,
//   Settings,
// } from "lucide-react"
// import { cn } from "@/lib/utils"

// interface TourStep {
//   target: string
//   parentGroup?: string
//   title: string
//   description: string
//   icon: React.ComponentType<{ className?: string }>
// }

// const tourSteps: TourStep[] = [
//   {
//     target: "[data-tour='dashboard']",
//     title: "Your Dashboard",
//     description: "Your command center. View key metrics, recent activity, and quick actions all in one place.",
//     icon: LayoutDashboard,
//   },
//   {
//     target: "[data-tour='inbox']",
//     title: "Unified Inbox",
//     description: "All your email replies in one place. Reply, categorize, and manage conversations efficiently.",
//     icon: Inbox,
//   },
//   {
//     target: "[data-tour='campaigns']",
//     parentGroup: "campaigns",
//     title: "All Campaigns",
//     description: "View and manage all your email campaigns. Track performance, pause, or edit campaigns anytime.",
//     icon: Mail,
//   },
//   {
//     target: "[data-tour='analytics']",
//     parentGroup: "campaigns",
//     title: "Campaign Analytics",
//     description: "Deep insights into opens, clicks, replies, and conversions. A/B test results and trends over time.",
//     icon: BarChart3,
//   },
//   {
//     target: "[data-tour='prospects']",
//     parentGroup: "outreach",
//     title: "Your Prospects",
//     description: "Manage your contact lists. Import from CSV, segment by criteria, and track engagement history.",
//     icon: Users,
//   },
//   {
//     target: "[data-tour='sequences']",
//     parentGroup: "outreach",
//     title: "Email Sequences",
//     description: "Automate follow-ups with smart sequences. Set triggers, delays, and conditional logic.",
//     icon: GitBranch,
//   },
//   {
//     target: "[data-tour='templates']",
//     parentGroup: "outreach",
//     title: "Email Templates",
//     description: "Save time with reusable templates. Use variables for personalization at scale.",
//     icon: FileText,
//   },
//   {
//     target: "[data-tour='deliverability']",
//     parentGroup: "deliverability",
//     title: "Deliverability Hub",
//     description: "Monitor domain health, check blacklists, and optimize your sender reputation score.",
//     icon: Shield,
//   },
//   {
//     target: "[data-tour='warmup']",
//     parentGroup: "deliverability",
//     title: "Email Warmup",
//     description: "Gradually build sender reputation. Our system sends and receives emails to warm up your accounts.",
//     icon: Flame,
//   },
//   {
//     target: "[data-tour='email-setup']",
//     parentGroup: "deliverability",
//     title: "Email Setup",
//     description: "Configure SPF, DKIM, and DMARC records. Our wizard guides you through each step.",
//     icon: Server,
//   },
//   {
//     target: "[data-tour='ai-generator']",
//     parentGroup: "ai tools",
//     title: "AI Email Generator",
//     description: "Generate personalized emails with AI. Create compelling subject lines and body copy instantly.",
//     icon: Sparkles,
//   },
//   {
//     target: "[data-tour='ai-predictor']",
//     parentGroup: "ai tools",
//     title: "AI Predictor",
//     description: "Predict email performance before sending. Get scores for deliverability, spam risk, and engagement.",
//     icon: Target,
//   },
//   {
//     target: "[data-tour='integrations']",
//     title: "Integrations",
//     description: "Connect your favorite tools - CRMs, calendars, and more. Sync data automatically.",
//     icon: Zap,
//   },
//   {
//     target: "[data-tour='settings']",
//     title: "Settings",
//     description: "Configure your account, email sending settings, team members, and preferences.",
//     icon: Settings,
//   },
// ]

// interface HighlightRect {
//   top: number
//   left: number
//   width: number
//   height: number
// }

// export function OnboardingTour() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [currentStep, setCurrentStep] = useState(0)
//   const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(null)
//   const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
//   const [isTransitioning, setIsTransitioning] = useState(false)
//   const sidebarRef = useRef<HTMLElement | null>(null)
//   const highlightedElementRef = useRef<HTMLElement | null>(null)

//   useEffect(() => {
//     const hasSeenTour = localStorage.getItem("mailfra-tour-completed")
//     if (!hasSeenTour) {
//       setTimeout(() => setIsOpen(true), 800)
//     }
//   }, [])

//   useEffect(() => {
//     const sidebar = document.querySelector("aside") as HTMLElement
//     sidebarRef.current = sidebar

//     if (isOpen && sidebar) {
//       // Elevate the entire sidebar above the overlay
//       sidebar.style.position = "relative"
//       sidebar.style.zIndex = "10001"
//     }

//     return () => {
//       // Reset sidebar z-index when tour closes
//       if (sidebar) {
//         sidebar.style.position = ""
//         sidebar.style.zIndex = ""
//       }
//     }
//   }, [isOpen])

//   // Cleanup highlighted element styles when tour closes
//   useEffect(() => {
//     return () => {
//       if (highlightedElementRef.current) {
//         highlightedElementRef.current.style.cssText = highlightedElementRef.current.dataset.originalStyle || ""
//         delete highlightedElementRef.current.dataset.originalStyle
//       }
//     }
//   }, [])

//   useEffect(() => {
//     if (!isOpen && highlightedElementRef.current) {
//       highlightedElementRef.current.style.cssText = highlightedElementRef.current.dataset.originalStyle || ""
//       delete highlightedElementRef.current.dataset.originalStyle
//       highlightedElementRef.current = null
//     }
//   }, [isOpen])

//   const expandParentGroup = useCallback((groupName: string | undefined): Promise<void> => {
//     return new Promise((resolve) => {
//       if (!groupName) {
//         resolve()
//         return
//       }

//       const groupButton = document.querySelector(`[data-tour-group="${groupName}"]`) as HTMLButtonElement
//       if (!groupButton) {
//         resolve()
//         return
//       }

//       const chevron = groupButton.querySelector("svg:last-child")
//       const isExpanded = chevron?.classList.contains("rotate-180")

//       if (!isExpanded) {
//         groupButton.click()
//         setTimeout(resolve, 300)
//       } else {
//         resolve()
//       }
//     })
//   }, [])

//   const updateHighlight = useCallback(async () => {
//     if (!isOpen || !tourSteps[currentStep]) return

//     const step = tourSteps[currentStep]

//     // Reset previous highlighted element
//     if (highlightedElementRef.current) {
//       highlightedElementRef.current.style.cssText = highlightedElementRef.current.dataset.originalStyle || ""
//       delete highlightedElementRef.current.dataset.originalStyle
//     }

//     // Expand parent group if needed
//     await expandParentGroup(step.parentGroup)
//     await new Promise((r) => setTimeout(r, 100))

//     const targetElement = document.querySelector(step.target) as HTMLElement | null
//     if (!targetElement) {
//       console.log("[v0] Tour target not found:", step.target)
//       return
//     }

//     highlightedElementRef.current = targetElement
//     targetElement.dataset.originalStyle = targetElement.style.cssText

//     // Apply highlight styles with !important to override Tailwind
//     targetElement.style.cssText += `
//       background-color: hsl(217, 91%, 60%, 0.2) !important;
//       box-shadow: 0 0 0 3px hsl(217, 91%, 60%), 0 0 30px 5px hsl(217, 91%, 60%, 0.4) !important;
//       border-radius: 8px !important;
//       position: relative !important;
//       z-index: 10002 !important;
//       transition: all 0.3s ease !important;
//     `

//     // Scroll the element into view within the sidebar
//     targetElement.scrollIntoView({
//       behavior: "smooth",
//       block: "center",
//     })

//     await new Promise((r) => setTimeout(r, 150))

//     // Get position for highlight overlay
//     const rect = targetElement.getBoundingClientRect()

//     setHighlightRect({
//       top: rect.top,
//       left: rect.left,
//       width: rect.width,
//       height: rect.height,
//     })

//     // Position tooltip to the right of sidebar
//     const sidebarWidth = sidebarRef.current?.offsetWidth || 256
//     const tooltipWidth = 380
//     const padding = 20

//     let tooltipTop = rect.top - 20

//     // Keep tooltip in viewport
//     const viewportHeight = window.innerHeight
//     const estimatedTooltipHeight = 300
//     if (tooltipTop + estimatedTooltipHeight > viewportHeight - 20) {
//       tooltipTop = viewportHeight - estimatedTooltipHeight - 20
//     }
//     if (tooltipTop < 20) {
//       tooltipTop = 20
//     }

//     setTooltipStyle({
//       position: "fixed",
//       top: tooltipTop,
//       left: sidebarWidth + padding,
//       width: tooltipWidth,
//       zIndex: 10003,
//     })
//   }, [isOpen, currentStep, expandParentGroup])

//   useEffect(() => {
//     if (!isOpen) return

//     setIsTransitioning(true)
//     const timer = setTimeout(() => {
//       updateHighlight()
//       setIsTransitioning(false)
//     }, 150)

//     window.addEventListener("resize", updateHighlight)

//     return () => {
//       clearTimeout(timer)
//       window.removeEventListener("resize", updateHighlight)
//     }
//   }, [isOpen, currentStep, updateHighlight])

//   const handleNext = () => {
//     if (currentStep < tourSteps.length - 1) {
//       setIsTransitioning(true)
//       setCurrentStep(currentStep + 1)
//     } else {
//       handleComplete()
//     }
//   }

//   const handlePrevious = () => {
//     if (currentStep > 0) {
//       setIsTransitioning(true)
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

//   const goToStep = (index: number) => {
//     setIsTransitioning(true)
//     setCurrentStep(index)
//   }

//   if (!isOpen) return null

//   const step = tourSteps[currentStep]
//   const StepIcon = step.icon

//   return (
//     <>
//       {/* Dark overlay - covers everything EXCEPT the sidebar which has higher z-index */}
//       <div className="fixed inset-0 bg-black/70 z-[10000]" onClick={handleSkip} />

//       {/* Tooltip card positioned to the right of sidebar */}
//       <div
//         className={cn(
//           "transition-all duration-300 ease-out",
//           isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0",
//         )}
//         style={tooltipStyle}
//       >
//         {/* Arrow pointing to the sidebar item */}
//         {highlightRect && (
//           <div
//             className="absolute w-4 h-4 bg-card border-l border-t border-border rotate-[-45deg]"
//             style={{
//               left: -8,
//               top: Math.max(
//                 30,
//                 Math.min(highlightRect.top - (tooltipStyle.top as number) + highlightRect.height / 2 - 8, 250),
//               ),
//             }}
//           />
//         )}

//         <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
//           {/* Gradient accent bar */}
//           <div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/50" />

//           <div className="p-6">
//             {/* Header */}
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-sm">
//                   <StepIcon className="h-6 w-6 text-primary" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg text-foreground">{step.title}</h3>
//                   <p className="text-sm text-muted-foreground">
//                     Step {currentStep + 1} of {tourSteps.length}
//                   </p>
//                 </div>
//               </div>
//               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted" onClick={handleSkip}>
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>

//             {/* Description */}
//             <p className="text-sm text-muted-foreground leading-relaxed mb-6">{step.description}</p>

//             {/* Progress dots */}
//             <div className="flex items-center justify-center gap-1.5 mb-6">
//               {tourSteps.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => goToStep(index)}
//                   className={cn(
//                     "transition-all duration-200 rounded-full hover:scale-110",
//                     index === currentStep
//                       ? "w-6 h-2 bg-primary"
//                       : index < currentStep
//                         ? "w-2 h-2 bg-primary/60"
//                         : "w-2 h-2 bg-muted-foreground/30",
//                   )}
//                   title={`Step ${index + 1}: ${tourSteps[index].title}`}
//                 />
//               ))}
//             </div>

//             {/* Actions */}
//             <div className="flex items-center justify-between">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handleSkip}
//                 className="text-muted-foreground hover:text-foreground"
//               >
//                 Skip tour
//               </Button>
//               <div className="flex gap-2">
//                 {currentStep > 0 && (
//                   <Button variant="outline" size="sm" onClick={handlePrevious} className="gap-1 bg-transparent">
//                     <ArrowLeft className="h-4 w-4" />
//                     Back
//                   </Button>
//                 )}
//                 <Button size="sm" onClick={handleNext} className="gap-1 min-w-[100px]">
//                   {currentStep < tourSteps.length - 1 ? (
//                     <>
//                       Next
//                       <ArrowRight className="h-4 w-4" />
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle2 className="h-4 w-4" />
//                       Complete
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export function TourTrigger() {
//   const startTour = () => {
//     localStorage.removeItem("mailfra-tour-completed")
//     window.location.reload()
//   }

//   return (
//     <Button variant="outline" size="sm" onClick={startTour} className="gap-2 bg-transparent">
//       <Sparkles className="h-4 w-4" />
//       Take Tour
//     </Button>
//   )
// }

// "use client"

// import type React from "react"
// import { useState, useEffect, useCallback, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   X,
//   ArrowRight,
//   ArrowLeft,
//   Sparkles,
//   CheckCircle2,
//   Mail,
//   Users,
//   Shield,
//   Flame,
//   Server,
//   BarChart3,
//   Inbox,
//   LayoutDashboard,
//   FileText,
//   GitBranch,
//   Target,
//   Zap,
//   Settings,
// } from "lucide-react"
// import { cn } from "@/lib/utils"

// interface TourStep {
//   target: string
//   parentGroup?: string
//   title: string
//   description: string
//   icon: React.ComponentType<{ className?: string }>
// }

// const tourSteps: TourStep[] = [
//   {
//     target: "[data-tour='dashboard']",
//     title: "Your Dashboard",
//     description: "Your command center. View key metrics, recent activity, and quick actions all in one place.",
//     icon: LayoutDashboard,
//   },
//   {
//     target: "[data-tour='inbox']",
//     title: "Unified Inbox",
//     description: "All your email replies in one place. Reply, categorize, and manage conversations efficiently.",
//     icon: Inbox,
//   },
//   {
//     target: "[data-tour='campaigns']",
//     parentGroup: "campaigns",
//     title: "All Campaigns",
//     description: "View and manage all your email campaigns. Track performance, pause, or edit campaigns anytime.",
//     icon: Mail,
//   },
//   {
//     target: "[data-tour='analytics']",
//     parentGroup: "campaigns",
//     title: "Campaign Analytics",
//     description: "Deep insights into opens, clicks, replies, and conversions. A/B test results and trends over time.",
//     icon: BarChart3,
//   },
//   {
//     target: "[data-tour='prospects']",
//     parentGroup: "outreach",
//     title: "Your Prospects",
//     description: "Manage your contact lists. Import from CSV, segment by criteria, and track engagement history.",
//     icon: Users,
//   },
//   {
//     target: "[data-tour='sequences']",
//     parentGroup: "outreach",
//     title: "Email Sequences",
//     description: "Automate follow-ups with smart sequences. Set triggers, delays, and conditional logic.",
//     icon: GitBranch,
//   },
//   {
//     target: "[data-tour='templates']",
//     parentGroup: "outreach",
//     title: "Email Templates",
//     description: "Save time with reusable templates. Use variables for personalization at scale.",
//     icon: FileText,
//   },
//   {
//     target: "[data-tour='deliverability']",
//     parentGroup: "deliverability",
//     title: "Deliverability Hub",
//     description: "Monitor domain health, check blacklists, and optimize your sender reputation score.",
//     icon: Shield,
//   },
//   {
//     target: "[data-tour='warmup']",
//     parentGroup: "deliverability",
//     title: "Email Warmup",
//     description: "Gradually build sender reputation. Our system sends and receives emails to warm up your accounts.",
//     icon: Flame,
//   },
//   {
//     target: "[data-tour='email-setup']",
//     parentGroup: "deliverability",
//     title: "Email Setup",
//     description: "Configure SPF, DKIM, and DMARC records. Our wizard guides you through each step.",
//     icon: Server,
//   },
//   {
//     target: "[data-tour='ai-generator']",
//     parentGroup: "ai tools",
//     title: "AI Email Generator",
//     description: "Generate personalized emails with AI. Create compelling subject lines and body copy instantly.",
//     icon: Sparkles,
//   },
//   {
//     target: "[data-tour='ai-predictor']",
//     parentGroup: "ai tools",
//     title: "AI Predictor",
//     description: "Predict email performance before sending. Get scores for deliverability, spam risk, and engagement.",
//     icon: Target,
//   },
//   {
//     target: "[data-tour='integrations']",
//     title: "Integrations",
//     description: "Connect your favorite tools - CRMs, calendars, and more. Sync data automatically.",
//     icon: Zap,
//   },
//   {
//     target: "[data-tour='settings']",
//     title: "Settings",
//     description: "Configure your account, email sending settings, team members, and preferences.",
//     icon: Settings,
//   },
// ]

// interface HighlightRect {
//   top: number
//   left: number
//   width: number
//   height: number
// }

// export function OnboardingTour() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [currentStep, setCurrentStep] = useState(0)
//   const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(null)
//   const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
//   const [isTransitioning, setIsTransitioning] = useState(false)
//   const sidebarRef = useRef<HTMLElement | null>(null)
//   const highlightedElementRef = useRef<HTMLElement | null>(null)

//   useEffect(() => {
//     const hasSeenTour = localStorage.getItem("mailfra-tour-completed")
//     if (!hasSeenTour) {
//       setTimeout(() => setIsOpen(true), 800)
//     }
//   }, [])

//   useEffect(() => {
//     const sidebar = document.querySelector("aside") as HTMLElement
//     sidebarRef.current = sidebar

//     if (isOpen && sidebar) {
//       sidebar.style.position = "relative"
//       sidebar.style.zIndex = "10001"
//     }

//     return () => {
//       if (sidebar) {
//         sidebar.style.position = ""
//         sidebar.style.zIndex = ""
//       }
//     }
//   }, [isOpen])

//   useEffect(() => {
//     return () => {
//       if (highlightedElementRef.current) {
//         highlightedElementRef.current.style.cssText = highlightedElementRef.current.dataset.originalStyle || ""
//         delete highlightedElementRef.current.dataset.originalStyle
//       }
//     }
//   }, [])

//   useEffect(() => {
//     if (!isOpen && highlightedElementRef.current) {
//       highlightedElementRef.current.style.cssText = highlightedElementRef.current.dataset.originalStyle || ""
//       delete highlightedElementRef.current.dataset.originalStyle
//       highlightedElementRef.current = null
//     }
//   }, [isOpen])

//   const expandParentGroup = useCallback((groupName: string | undefined): Promise<void> => {
//     return new Promise((resolve) => {
//       if (!groupName) {
//         resolve()
//         return
//       }

//       const groupButton = document.querySelector(`[data-tour-group="${groupName}"]`) as HTMLButtonElement
//       if (!groupButton) {
//         resolve()
//         return
//       }

//       const chevron = groupButton.querySelector("svg:last-child")
//       const isExpanded = chevron?.classList.contains("rotate-180")

//       if (!isExpanded) {
//         groupButton.click()
//         setTimeout(resolve, 300)
//       } else {
//         resolve()
//       }
//     })
//   }, [])

//   const updateHighlight = useCallback(async () => {
//     if (!isOpen || !tourSteps[currentStep]) return

//     const step = tourSteps[currentStep]

//     if (highlightedElementRef.current) {
//       highlightedElementRef.current.style.cssText = highlightedElementRef.current.dataset.originalStyle || ""
//       delete highlightedElementRef.current.dataset.originalStyle
//     }

//     await expandParentGroup(step.parentGroup)
//     await new Promise((r) => setTimeout(r, 100))

//     const targetElement = document.querySelector(step.target) as HTMLElement | null
//     if (!targetElement) {
//       console.log("[v0] Tour target not found:", step.target)
//       return
//     }

//     highlightedElementRef.current = targetElement
//     targetElement.dataset.originalStyle = targetElement.style.cssText

//     // Using monochrome theme colors for highlight
//     // Light mode: black highlight, Dark mode: white highlight
//     const isDark = document.documentElement.classList.contains('dark')
//     const highlightColor = isDark ? 'rgb(250, 250, 250)' : 'rgb(23, 23, 23)'
//     const highlightBg = isDark ? 'rgba(250, 250, 250, 0.08)' : 'rgba(23, 23, 23, 0.08)'
//     const highlightShadow = isDark ? 'rgba(250, 250, 250, 0.3)' : 'rgba(23, 23, 23, 0.3)'
    
//     targetElement.style.cssText += `
//       background-color: ${highlightBg} !important;
//       box-shadow: 0 0 0 3px ${highlightColor}, 0 0 30px 5px ${highlightShadow} !important;
//       border-radius: 8px !important;
//       position: relative !important;
//       z-index: 10002 !important;
//       transition: all 0.3s ease !important;
//     `

//     targetElement.scrollIntoView({
//       behavior: "smooth",
//       block: "center",
//     })

//     await new Promise((r) => setTimeout(r, 150))

//     const rect = targetElement.getBoundingClientRect()

//     setHighlightRect({
//       top: rect.top,
//       left: rect.left,
//       width: rect.width,
//       height: rect.height,
//     })

//     const sidebarWidth = sidebarRef.current?.offsetWidth || 256
//     const tooltipWidth = 380
//     const padding = 20

//     let tooltipTop = rect.top - 20

//     const viewportHeight = window.innerHeight
//     const estimatedTooltipHeight = 300
//     if (tooltipTop + estimatedTooltipHeight > viewportHeight - 20) {
//       tooltipTop = viewportHeight - estimatedTooltipHeight - 20
//     }
//     if (tooltipTop < 20) {
//       tooltipTop = 20
//     }

//     setTooltipStyle({
//       position: "fixed",
//       top: tooltipTop,
//       left: sidebarWidth + padding,
//       width: tooltipWidth,
//       zIndex: 10003,
//     })
//   }, [isOpen, currentStep, expandParentGroup])

//   useEffect(() => {
//     if (!isOpen) return

//     setIsTransitioning(true)
//     const timer = setTimeout(() => {
//       updateHighlight()
//       setIsTransitioning(false)
//     }, 150)

//     window.addEventListener("resize", updateHighlight)

//     return () => {
//       clearTimeout(timer)
//       window.removeEventListener("resize", updateHighlight)
//     }
//   }, [isOpen, currentStep, updateHighlight])

//   const handleNext = () => {
//     if (currentStep < tourSteps.length - 1) {
//       setIsTransitioning(true)
//       setCurrentStep(currentStep + 1)
//     } else {
//       handleComplete()
//     }
//   }

//   const handlePrevious = () => {
//     if (currentStep > 0) {
//       setIsTransitioning(true)
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

//   const goToStep = (index: number) => {
//     setIsTransitioning(true)
//     setCurrentStep(index)
//   }

//   if (!isOpen) return null

//   const step = tourSteps[currentStep]
//   const StepIcon = step.icon

//   return (
//     <>
//       {/* Dark overlay */}
//       <div className="fixed inset-0 bg-black/70 z-[10000]" onClick={handleSkip} />

//       {/* Tooltip card */}
//       <div
//         className={cn(
//           "transition-all duration-300 ease-out",
//           isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0",
//         )}
//         style={tooltipStyle}
//       >
//         {/* Arrow pointing to sidebar */}
//         {highlightRect && (
//           <div
//             className="absolute w-4 h-4 bg-card border-l border-t border-border rotate-[-45deg]"
//             style={{
//               left: -8,
//               top: Math.max(
//                 30,
//                 Math.min(highlightRect.top - (tooltipStyle.top as number) + highlightRect.height / 2 - 8, 250),
//               ),
//             }}
//           />
//         )}

//         <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
//           {/* Monochrome accent bar - uses foreground color */}
//           <div className="h-1.5 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60" />

//           <div className="p-6">
//             {/* Header */}
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 border border-foreground/10 shadow-sm">
//                   <StepIcon className="h-6 w-6 text-foreground" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg text-foreground">{step.title}</h3>
//                   <p className="text-sm text-muted-foreground">
//                     Step {currentStep + 1} of {tourSteps.length}
//                   </p>
//                 </div>
//               </div>
//               <Button 
//                 variant="ghost" 
//                 size="icon" 
//                 className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground" 
//                 onClick={handleSkip}
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>

//             {/* Description */}
//             <p className="text-sm text-muted-foreground leading-relaxed mb-6">{step.description}</p>

//             {/* Progress dots */}
//             <div className="flex items-center justify-center gap-1.5 mb-6">
//               {tourSteps.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => goToStep(index)}
//                   className={cn(
//                     "transition-all duration-200 rounded-full hover:scale-110",
//                     index === currentStep
//                       ? "w-6 h-2 bg-foreground"
//                       : index < currentStep
//                         ? "w-2 h-2 bg-foreground/60"
//                         : "w-2 h-2 bg-muted-foreground/30",
//                   )}
//                   title={`Step ${index + 1}: ${tourSteps[index].title}`}
//                 />
//               ))}
//             </div>

//             {/* Actions */}
//             <div className="flex items-center justify-between">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handleSkip}
//                 className="text-muted-foreground hover:text-foreground hover:bg-muted"
//               >
//                 Skip tour
//               </Button>
//               <div className="flex gap-2">
//                 {currentStep > 0 && (
//                   <Button 
//                     variant="outline" 
//                     size="sm" 
//                     onClick={handlePrevious} 
//                     className="gap-1 bg-transparent hover:bg-muted"
//                   >
//                     <ArrowLeft className="h-4 w-4" />
//                     Back
//                   </Button>
//                 )}
//                 <Button 
//                   size="sm" 
//                   onClick={handleNext} 
//                   className="gap-1 min-w-[100px] bg-foreground text-background hover:bg-foreground/90"
//                 >
//                   {currentStep < tourSteps.length - 1 ? (
//                     <>
//                       Next
//                       <ArrowRight className="h-4 w-4" />
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle2 className="h-4 w-4" />
//                       Complete
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export function TourTrigger() {
//   const startTour = () => {
//     localStorage.removeItem("mailfra-tour-completed")
//     window.location.reload()
//   }

//   return (
//     <Button 
//       variant="outline" 
//       size="sm" 
//       onClick={startTour} 
//       className="gap-2 bg-transparent hover:bg-muted"
//     >
//       <Sparkles className="h-4 w-4" />
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
  Menu,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TourStep {
  target: string
  parentGroup?: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  mobileDescription?: string
}

const tourSteps: TourStep[] = [
  {
    target: "[data-tour='dashboard']",
    title: "Your Dashboard",
    description: "Your command center. View key metrics, recent activity, and quick actions all in one place.",
    mobileDescription: "Access all your key metrics and recent activity from the main menu.",
    icon: LayoutDashboard,
  },
  {
    target: "[data-tour='inbox']",
    title: "Unified Inbox",
    description: "All your email replies in one place. Reply, categorize, and manage conversations efficiently.",
    mobileDescription: "Manage all your email conversations in one unified inbox.",
    icon: Inbox,
  },
  {
    target: "[data-tour='campaigns']",
    parentGroup: "campaigns",
    title: "All Campaigns",
    description: "View and manage all your email campaigns. Track performance, pause, or edit campaigns anytime.",
    mobileDescription: "Create and manage your email campaigns. Track performance in real-time.",
    icon: Mail,
  },
  {
    target: "[data-tour='analytics']",
    parentGroup: "campaigns",
    title: "Campaign Analytics",
    description: "Deep insights into opens, clicks, replies, and conversions. A/B test results and trends over time.",
    mobileDescription: "Get detailed analytics on email performance, engagement, and conversions.",
    icon: BarChart3,
  },
  {
    target: "[data-tour='prospects']",
    parentGroup: "outreach",
    title: "Your Prospects",
    description: "Manage your contact lists. Import from CSV, segment by criteria, and track engagement history.",
    mobileDescription: "Build and manage your contact lists with powerful segmentation tools.",
    icon: Users,
  },
  {
    target: "[data-tour='sequences']",
    parentGroup: "outreach",
    title: "Email Sequences",
    description: "Automate follow-ups with smart sequences. Set triggers, delays, and conditional logic.",
    mobileDescription: "Automate your email outreach with intelligent follow-up sequences.",
    icon: GitBranch,
  },
  {
    target: "[data-tour='templates']",
    parentGroup: "outreach",
    title: "Email Templates",
    description: "Save time with reusable templates. Use variables for personalization at scale.",
    mobileDescription: "Create reusable templates with personalization variables.",
    icon: FileText,
  },
  {
    target: "[data-tour='deliverability']",
    parentGroup: "deliverability",
    title: "Deliverability Hub",
    description: "Monitor domain health, check blacklists, and optimize your sender reputation score.",
    mobileDescription: "Monitor your email deliverability and sender reputation.",
    icon: Shield,
  },
  {
    target: "[data-tour='warmup']",
    parentGroup: "deliverability",
    title: "Email Warmup",
    description: "Gradually build sender reputation. Our system sends and receives emails to warm up your accounts.",
    mobileDescription: "Automatically warm up your email accounts to improve deliverability.",
    icon: Flame,
  },
  {
    target: "[data-tour='email-setup']",
    parentGroup: "deliverability",
    title: "Email Setup",
    description: "Configure SPF, DKIM, and DMARC records. Our wizard guides you through each step.",
    mobileDescription: "Set up your email authentication with our guided wizard.",
    icon: Server,
  },
  {
    target: "[data-tour='ai-generator']",
    parentGroup: "ai tools",
    title: "AI Email Generator",
    description: "Generate personalized emails with AI. Create compelling subject lines and body copy instantly.",
    mobileDescription: "Use AI to generate personalized email content instantly.",
    icon: Sparkles,
  },
  {
    target: "[data-tour='ai-predictor']",
    parentGroup: "ai tools",
    title: "AI Predictor",
    description: "Predict email performance before sending. Get scores for deliverability, spam risk, and engagement.",
    mobileDescription: "Predict email success before sending with AI-powered insights.",
    icon: Target,
  },
  {
    target: "[data-tour='integrations']",
    title: "Integrations",
    description: "Connect your favorite tools - CRMs, calendars, and more. Sync data automatically.",
    mobileDescription: "Connect with your favorite CRMs and tools for seamless data sync.",
    icon: Zap,
  },
  {
    target: "[data-tour='settings']",
    title: "Settings",
    description: "Configure your account, email sending settings, team members, and preferences.",
    mobileDescription: "Customize your account settings and preferences.",
    icon: Settings,
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
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpened, setSidebarOpened] = useState(false)
  const sidebarRef = useRef<HTMLElement | null>(null)
  const highlightedElementRef = useRef<HTMLElement | null>(null)

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("mailfra-tour-completed")
    if (!hasSeenTour) {
      setTimeout(() => setIsOpen(true), 800)
    }
  }, [])

  useEffect(() => {
    const sidebar = document.querySelector("aside") as HTMLElement
    sidebarRef.current = sidebar

    if (isOpen && sidebar && !isMobile) {
      sidebar.style.position = "relative"
      sidebar.style.zIndex = "10001"
    }

    return () => {
      if (sidebar && !isMobile) {
        sidebar.style.position = ""
        sidebar.style.zIndex = ""
      }
    }
  }, [isOpen, isMobile])

  useEffect(() => {
    return () => {
      if (highlightedElementRef.current) {
        highlightedElementRef.current.style.cssText = highlightedElementRef.current.dataset.originalStyle || ""
        delete highlightedElementRef.current.dataset.originalStyle
      }
    }
  }, [])

  useEffect(() => {
    if (!isOpen && highlightedElementRef.current) {
      highlightedElementRef.current.style.cssText = highlightedElementRef.current.dataset.originalStyle || ""
      delete highlightedElementRef.current.dataset.originalStyle
      highlightedElementRef.current = null
    }
  }, [isOpen])

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

      const chevron = groupButton.querySelector("svg:last-child")
      const isExpanded = chevron?.classList.contains("rotate-180")

      if (!isExpanded) {
        groupButton.click()
        setTimeout(resolve, 300)
      } else {
        resolve()
      }
    })
  }, [])

  const openSidebarTemporarily = useCallback(() => {
    const menuButton = document.querySelector('[data-sidebar-toggle]') as HTMLButtonElement
    if (menuButton && isMobile) {
      menuButton.click()
      setSidebarOpened(true)
      setTimeout(() => {
        updateHighlight()
      }, 350)
    }
  }, [isMobile])

  const closeSidebarIfOpened = useCallback(() => {
    if (sidebarOpened && isMobile) {
      const menuButton = document.querySelector('[data-sidebar-toggle]') as HTMLButtonElement
      if (menuButton) {
        menuButton.click()
        setSidebarOpened(false)
      }
    }
  }, [sidebarOpened, isMobile])

  const updateHighlight = useCallback(async () => {
    if (!isOpen || !tourSteps[currentStep]) return
    
    // On mobile, don't highlight - we use modal approach
    if (isMobile) return

    const step = tourSteps[currentStep]

    if (highlightedElementRef.current) {
      highlightedElementRef.current.style.cssText = highlightedElementRef.current.dataset.originalStyle || ""
      delete highlightedElementRef.current.dataset.originalStyle
    }

    await expandParentGroup(step.parentGroup)
    await new Promise((r) => setTimeout(r, 100))

    const targetElement = document.querySelector(step.target) as HTMLElement | null
    if (!targetElement) {
      console.log("[Tour] Target not found:", step.target)
      return
    }

    highlightedElementRef.current = targetElement
    targetElement.dataset.originalStyle = targetElement.style.cssText

    const isDark = document.documentElement.classList.contains('dark')
    const highlightColor = isDark ? 'rgb(250, 250, 250)' : 'rgb(23, 23, 23)'
    const highlightBg = isDark ? 'rgba(250, 250, 250, 0.08)' : 'rgba(23, 23, 23, 0.08)'
    const highlightShadow = isDark ? 'rgba(250, 250, 250, 0.3)' : 'rgba(23, 23, 23, 0.3)'
    
    targetElement.style.cssText += `
      background-color: ${highlightBg} !important;
      box-shadow: 0 0 0 3px ${highlightColor}, 0 0 30px 5px ${highlightShadow} !important;
      border-radius: 8px !important;
      position: relative !important;
      z-index: 10002 !important;
      transition: all 0.3s ease !important;
    `

    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })

    await new Promise((r) => setTimeout(r, 150))

    const rect = targetElement.getBoundingClientRect()

    setHighlightRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    })

    const sidebarWidth = sidebarRef.current?.offsetWidth || 256
    const tooltipWidth = 380
    const padding = 20

    let tooltipTop = rect.top - 20

    const viewportHeight = window.innerHeight
    const estimatedTooltipHeight = 300
    if (tooltipTop + estimatedTooltipHeight > viewportHeight - 20) {
      tooltipTop = viewportHeight - estimatedTooltipHeight - 20
    }
    if (tooltipTop < 20) {
      tooltipTop = 20
    }

    setTooltipStyle({
      position: "fixed",
      top: tooltipTop,
      left: sidebarWidth + padding,
      width: tooltipWidth,
      zIndex: 10003,
    })
  }, [isOpen, currentStep, expandParentGroup, isMobile])

  useEffect(() => {
    if (!isOpen || isMobile) return

    setIsTransitioning(true)
    const timer = setTimeout(() => {
      updateHighlight()
      setIsTransitioning(false)
    }, 150)

    window.addEventListener("resize", updateHighlight)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", updateHighlight)
    }
  }, [isOpen, currentStep, updateHighlight, isMobile])

  const handleNext = () => {
    closeSidebarIfOpened()
    if (currentStep < tourSteps.length - 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
      }, 100)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    closeSidebarIfOpened()
    if (currentStep > 0) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
      }, 100)
    }
  }

  const handleSkip = () => {
    closeSidebarIfOpened()
    setIsOpen(false)
    localStorage.setItem("mailfra-tour-completed", "true")
  }

  const handleComplete = () => {
    closeSidebarIfOpened()
    setIsOpen(false)
    localStorage.setItem("mailfra-tour-completed", "true")
  }

  const goToStep = (index: number) => {
    closeSidebarIfOpened()
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep(index)
    }, 100)
  }

  if (!isOpen) return null

  const step = tourSteps[currentStep]
  const StepIcon = step.icon
  const description = isMobile && step.mobileDescription ? step.mobileDescription : step.description

  // Mobile Layout - Centered Modal
  if (isMobile) {
    return (
      <>
        {/* Dark overlay */}
        <div className="fixed inset-0 bg-black/80 z-[10000] backdrop-blur-sm" onClick={handleSkip} />

        {/* Mobile centered modal */}
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none">
          <div 
            className={cn(
              "pointer-events-auto w-full max-w-sm transition-all duration-300 ease-out",
              isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
            )}
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60" />

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-foreground/8 border border-foreground/10">
                      <StepIcon className="h-7 w-7 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-foreground mb-1">{step.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        Step {currentStep + 1} of {tourSteps.length}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 shrink-0 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground -mt-1 -mr-2" 
                    onClick={handleSkip}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {description}
                </p>

                {/* Show in menu button - only if not dashboard/settings */}
                {step.target !== "[data-tour='dashboard']" && step.target !== "[data-tour='settings']" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openSidebarTemporarily}
                    className="w-full mb-6 gap-2 bg-transparent hover:bg-muted touch-manipulation"
                  >
                    <Eye className="h-4 w-4" />
                    Show in Menu
                  </Button>
                )}

                {/* Progress dots */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  {tourSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToStep(index)}
                      className={cn(
                        "transition-all duration-200 rounded-full touch-manipulation",
                        index === currentStep
                          ? "w-8 h-2.5 bg-foreground"
                          : index < currentStep
                            ? "w-2.5 h-2.5 bg-foreground/60"
                            : "w-2.5 h-2.5 bg-muted-foreground/30",
                      )}
                      aria-label={`Go to step ${index + 1}: ${tourSteps[index].title}`}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted touch-manipulation"
                  >
                    Skip tour
                  </Button>
                  <div className="flex gap-2">
                    {currentStep > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handlePrevious} 
                        className="gap-1 bg-transparent hover:bg-muted touch-manipulation"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only">Back</span>
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      onClick={handleNext} 
                      className="gap-1 min-w-[100px] bg-foreground text-background hover:bg-foreground/90 touch-manipulation"
                    >
                      {currentStep < tourSteps.length - 1 ? (
                        <>
                          Next
                          <ArrowRight className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Finish
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Desktop Layout - Original sidebar tooltip
  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/70 z-[10000]" onClick={handleSkip} />

      {/* Desktop tooltip card */}
      <div
        className={cn(
          "transition-all duration-300 ease-out",
          isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0",
        )}
        style={tooltipStyle}
      >
        {/* Arrow pointing to sidebar */}
        {highlightRect && (
          <div
            className="absolute w-4 h-4 bg-card border-l border-t border-border rotate-[-45deg]"
            style={{
              left: -8,
              top: Math.max(
                30,
                Math.min(highlightRect.top - (tooltipStyle.top as number) + highlightRect.height / 2 - 8, 250),
              ),
            }}
          />
        )}

        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60" />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 border border-foreground/10 shadow-sm">
                  <StepIcon className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Step {currentStep + 1} of {tourSteps.length}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground" 
                onClick={handleSkip}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{description}</p>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 mb-6">
              {tourSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={cn(
                    "transition-all duration-200 rounded-full hover:scale-110",
                    index === currentStep
                      ? "w-6 h-2 bg-foreground"
                      : index < currentStep
                        ? "w-2 h-2 bg-foreground/60"
                        : "w-2 h-2 bg-muted-foreground/30",
                  )}
                  title={`Step ${index + 1}: ${tourSteps[index].title}`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                Skip tour
              </Button>
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePrevious} 
                    className="gap-1 bg-transparent hover:bg-muted"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                )}
                <Button 
                  size="sm" 
                  onClick={handleNext} 
                  className="gap-1 min-w-[100px] bg-foreground text-background hover:bg-foreground/90"
                >
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
    <Button 
      variant="outline" 
      size="sm" 
      onClick={startTour} 
      className="gap-2 bg-transparent hover:bg-muted"
    >
      <Sparkles className="h-4 w-4" />
      Take Tour
    </Button>
  )
}