// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { X, ArrowRight, ArrowLeft } from "lucide-react"
// import { cn } from "@/lib/utils"

// interface TourStep {
//   target: string
//   title: string
//   description: string
//   placement?: "top" | "bottom" | "left" | "right"
// }

// const tourSteps: TourStep[] = [
//   {
//     target: "[data-tour='dashboard']",
//     title: "Welcome to ReachAI!",
//     description: "Let's take a quick tour to help you get started with AI-powered cold email outreach.",
//     placement: "bottom",
//   },
//   {
//     target: "[data-tour='campaigns']",
//     title: "Campaigns",
//     description: "Create and manage your email campaigns. Track performance and optimize your outreach strategy.",
//     placement: "right",
//   },
//   {
//     target: "[data-tour='prospects']",
//     title: "Prospects",
//     description: "Add and manage your prospects. Our AI will research and personalize emails for each contact.",
//     placement: "right",
//   },
//   {
//     target: "[data-tour='ai-generator']",
//     title: "AI Generator",
//     description: "Generate personalized emails using AI. Create variations and test different approaches.",
//     placement: "right",
//   },
//   {
//     target: "[data-tour='analytics']",
//     title: "Analytics",
//     description: "Track your campaign performance with detailed analytics and insights.",
//     placement: "right",
//   },
// ]

// export function OnboardingTour() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [currentStep, setCurrentStep] = useState(0)
//   const [position, setPosition] = useState({ top: 0, left: 0 })

//   useEffect(() => {
//     const hasSeenTour = localStorage.getItem("reachai-tour-completed")
//     if (!hasSeenTour) {
//       setTimeout(() => setIsOpen(true), 1000)
//     }
//   }, [])

//   useEffect(() => {
//     if (isOpen && tourSteps[currentStep]) {
//       const targetElement = document.querySelector(tourSteps[currentStep].target)
//       if (targetElement) {
//         const rect = targetElement.getBoundingClientRect()
//         const placement = tourSteps[currentStep].placement || "bottom"

//         let top = 0
//         let left = 0

//         switch (placement) {
//           case "bottom":
//             top = rect.bottom + window.scrollY + 10
//             left = rect.left + window.scrollX + rect.width / 2
//             break
//           case "right":
//             top = rect.top + window.scrollY + rect.height / 2
//             left = rect.right + window.scrollX + 10
//             break
//           case "top":
//             top = rect.top + window.scrollY - 10
//             left = rect.left + window.scrollX + rect.width / 2
//             break
//           case "left":
//             top = rect.top + window.scrollY + rect.height / 2
//             left = rect.left + window.scrollX - 10
//             break
//         }

//         setPosition({ top, left })

//         // Highlight the target element
//         targetElement.classList.add("ring-2", "ring-primary", "ring-offset-2", "rounded-lg")

//         return () => {
//           targetElement.classList.remove("ring-2", "ring-primary", "ring-offset-2", "rounded-lg")
//         }
//       }
//     }
//   }, [isOpen, currentStep])

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
//     localStorage.setItem("reachai-tour-completed", "true")
//   }

//   const handleComplete = () => {
//     setIsOpen(false)
//     localStorage.setItem("reachai-tour-completed", "true")
//   }

//   if (!isOpen) return null

//   const step = tourSteps[currentStep]

//   return (
//     <>
//       {/* Overlay */}
//       <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in" onClick={handleSkip} />

//       {/* Tour Card */}
//       <Card
//         className={cn(
//           "fixed z-50 w-80 shadow-2xl animate-in fade-in slide-in-from-bottom-4",
//           "transform -translate-x-1/2 -translate-y-1/2",
//         )}
//         style={{
//           top: `${position.top}px`,
//           left: `${position.left}px`,
//         }}
//       >
//         <CardHeader>
//           <div className="flex items-start justify-between">
//             <div>
//               <CardTitle className="text-lg">{step.title}</CardTitle>
//               <CardDescription className="text-xs mt-1">
//                 Step {currentStep + 1} of {tourSteps.length}
//               </CardDescription>
//             </div>
//             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleSkip}>
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <p className="text-sm text-muted-foreground">{step.description}</p>
//         </CardContent>
//         <CardFooter className="flex items-center justify-between">
//           <Button variant="ghost" size="sm" onClick={handleSkip}>
//             Skip Tour
//           </Button>
//           <div className="flex items-center gap-2">
//             {currentStep > 0 && (
//               <Button variant="outline" size="sm" onClick={handlePrevious}>
//                 <ArrowLeft className="h-4 w-4 mr-1" />
//                 Back
//               </Button>
//             )}
//             <Button size="sm" onClick={handleNext}>
//               {currentStep < tourSteps.length - 1 ? (
//                 <>
//                   Next
//                   <ArrowRight className="h-4 w-4 ml-1" />
//                 </>
//               ) : (
//                 "Finish"
//               )}
//             </Button>
//           </div>
//         </CardFooter>
//       </Card>
//     </>
//   )
// }

// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { X, ArrowRight, ArrowLeft } from "lucide-react"
// import { cn } from "@/lib/utils"

// interface TourStep {
//   target: string
//   title: string
//   description: string
//   placement?: "top" | "bottom" | "left" | "right"
// }

// const tourSteps: TourStep[] = [
//   {
//     target: "[data-tour='dashboard']",
//     title: "Welcome to ReachAI!",
//     description: "Let's take a quick tour to help you get started with AI-powered cold email outreach.",
//     placement: "bottom",
//   },
//   {
//     target: "[data-tour='campaigns']",
//     title: "Campaigns",
//     description: "Create and manage your email campaigns. Track performance and optimize your outreach strategy.",
//     placement: "right",
//   },
//   {
//     target: "[data-tour='prospects']",
//     title: "Prospects",
//     description: "Add and manage your prospects. Our AI will research and personalize emails for each contact.",
//     placement: "right",
//   },
//   {
//     target: "[data-tour='ai-generator']",
//     title: "AI Generator",
//     description: "Generate personalized emails using AI. Create variations and test different approaches.",
//     placement: "right",
//   },
//   {
//     target: "[data-tour='analytics']",
//     title: "Analytics",
//     description: "Track your campaign performance with detailed analytics and insights.",
//     placement: "right",
//   },
// ]

// export function OnboardingTour() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [currentStep, setCurrentStep] = useState(0)
//   const [position, setPosition] = useState({ top: 0, left: 0 })

//   useEffect(() => {
//     const hasSeenTour = localStorage.getItem("reachai-tour-completed")
//     if (!hasSeenTour) {
//       setTimeout(() => setIsOpen(true), 1000)
//     }
//   }, [])

//   useEffect(() => {
//     if (isOpen && tourSteps[currentStep]) {
//       const targetElement = document.querySelector(tourSteps[currentStep].target)
//       if (targetElement) {
//         const rect = targetElement.getBoundingClientRect()
//         const placement = tourSteps[currentStep].placement || "bottom"

//         let top = 0
//         let left = 0
//         const cardWidth = 320 // w-80 = 320px
//         const cardHeight = 250 // approximate card height
//         const padding = 20 // padding from viewport edges

//         switch (placement) {
//           case "bottom":
//             top = rect.bottom + 10
//             left = rect.left + rect.width / 2 - cardWidth / 2
//             break
//           case "right":
//             top = rect.top + rect.height / 2 - cardHeight / 2
//             left = rect.right + 10
//             break
//           case "top":
//             top = rect.top - cardHeight - 10
//             left = rect.left + rect.width / 2 - cardWidth / 2
//             break
//           case "left":
//             top = rect.top + rect.height / 2 - cardHeight / 2
//             left = rect.left - cardWidth - 10
//             break
//         }

//         // Constrain to viewport bounds
//         const maxLeft = window.innerWidth - cardWidth - padding
//         const maxTop = window.innerHeight - cardHeight - padding

//         left = Math.max(padding, Math.min(left, maxLeft))
//         top = Math.max(padding, Math.min(top, maxTop))

//         setPosition({ top, left })

//         // Highlight the target element
//         targetElement.classList.add("ring-2", "ring-primary", "ring-offset-2", "rounded-lg")

//         // Scroll target into view if needed
//         targetElement.scrollIntoView({ behavior: "smooth", block: "center" })

//         return () => {
//           targetElement.classList.remove("ring-2", "ring-primary", "ring-offset-2", "rounded-lg")
//         }
//       }
//     }
//   }, [isOpen, currentStep])

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
//     localStorage.setItem("reachai-tour-completed", "true")
//   }

//   const handleComplete = () => {
//     setIsOpen(false)
//     localStorage.setItem("reachai-tour-completed", "true")
//   }

//   if (!isOpen) return null

//   const step = tourSteps[currentStep]

//   return (
//     <>
//       {/* Overlay */}
//       <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in" onClick={handleSkip} />

//       {/* Tour Card */}
//       <Card
//         className={cn(
//           "fixed z-50 w-80 shadow-2xl animate-in fade-in slide-in-from-bottom-4",
//           "transform -translate-x-1/2 -translate-y-1/2",
//         )}
//         style={{
//           top: `${position.top}px`,
//           left: `${position.left}px`,
//         }}
//       >
//         <CardHeader>
//           <div className="flex items-start justify-between">
//             <div>
//               <CardTitle className="text-lg">{step.title}</CardTitle>
//               <CardDescription className="text-xs mt-1">
//                 Step {currentStep + 1} of {tourSteps.length}
//               </CardDescription>
//             </div>
//             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleSkip}>
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <p className="text-sm text-muted-foreground">{step.description}</p>
//         </CardContent>
//         <CardFooter className="flex items-center justify-between">
//           <Button variant="ghost" size="sm" onClick={handleSkip}>
//             Skip Tour
//           </Button>
//           <div className="flex items-center gap-2">
//             {currentStep > 0 && (
//               <Button variant="outline" size="sm" onClick={handlePrevious}>
//                 <ArrowLeft className="h-4 w-4 mr-1" />
//                 Back
//               </Button>
//             )}
//             <Button size="sm" onClick={handleNext}>
//               {currentStep < tourSteps.length - 1 ? (
//                 <>
//                   Next
//                   <ArrowRight className="h-4 w-4 ml-1" />
//                 </>
//               ) : (
//                 "Finish"
//               )}
//             </Button>
//           </div>
//         </CardFooter>
//       </Card>
//     </>
//   )
// }


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
//     title: "Welcome to ReachAI!",
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
//     description: "Add and manage your prospects. Our AI will research and personalize emails for each contact.",
//     placement: "auto",
//   },
//   {
//     target: "[data-tour='ai-generator']",
//     title: "AI Generator",
//     description: "Generate personalized emails using AI. Create variations and test different approaches.",
//     placement: "auto",
//   },
//   {
//     target: "[data-tour='ai-predictor']",
//     title: "AI Performance Predictor",
//     description: "Predict email performance before sending. Get AI-powered suggestions to improve your emails.",
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

//   // Check if mobile
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 768)
//     checkMobile()
//     window.addEventListener("resize", checkMobile)
//     return () => window.removeEventListener("resize", checkMobile)
//   }, [])

//   // Check if tour has been completed
//   useEffect(() => {
//     const hasSeenTour = localStorage.getItem("reachai-tour-completed")
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

//           // Add highlight to target
//           targetElement.classList.add(
//             "!ring-4",
//             "!ring-blue-500/50",
//             "!ring-offset-4",
//             "!ring-offset-background",
//             "rounded-lg",
//             "relative",
//             "z-30",
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
//               "!ring-blue-500/50",
//               "!ring-offset-4",
//               "!ring-offset-background",
//               "rounded-lg",
//               "relative",
//               "z-30",
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
//     localStorage.setItem("reachai-tour-completed", "true")
//   }

//   const handleComplete = () => {
//     setIsOpen(false)
//     localStorage.setItem("reachai-tour-completed", "true")
//   }

//   const step = tourSteps[currentStep]

//   return (
//     <>
//       <AnimatePresence>
//         {isOpen && (
//           <>
//             {/* Backdrop overlay */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
//               onClick={handleSkip}
//             />

//             {/* Tour Card */}
//             <motion.div
//               ref={cardRef}
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               transition={{ type: "spring", damping: 25, stiffness: 300 }}
//               className="fixed z-50"
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
//     localStorage.removeItem("reachai-tour-completed")
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

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, ArrowRight, ArrowLeft, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface TourStep {
  target: string
  title: string
  description: string
  placement?: "top" | "bottom" | "left" | "right" | "auto"
}

const tourSteps: TourStep[] = [
  {
    target: "[data-tour='dashboard']",
    title: "Welcome to ReachAI!",
    description: "Let's take a quick tour to help you get started with AI-powered cold email outreach.",
    placement: "auto",
  },
  {
    target: "[data-tour='campaigns']",
    title: "Campaigns",
    description: "Create and manage your email campaigns. Track performance and optimize your outreach strategy.",
    placement: "auto",
  },
  {
    target: "[data-tour='prospects']",
    title: "Prospects",
    description: "Add and manage your prospects. Our AI will research and personalize emails for each contact.",
    placement: "auto",
  },
  {
    target: "[data-tour='ai-generator']",
    title: "AI Generator",
    description: "Generate personalized emails using AI. Create variations and test different approaches.",
    placement: "auto",
  },
  {
    target: "[data-tour='ai-predictor']",
    title: "AI Performance Predictor",
    description: "Predict email performance before sending. Get AI-powered suggestions to improve your emails.",
    placement: "auto",
  },
  {
    target: "[data-tour='analytics']",
    title: "Analytics",
    description: "Track your campaign performance with detailed analytics and insights.",
    placement: "auto",
  },
]

interface Position {
  top: number
  left: number
  placement: "top" | "bottom" | "left" | "right"
}

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [position, setPosition] = useState<Position>({ top: 0, left: 0, placement: "bottom" })
  const cardRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Check if tour has been completed
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("reachai-tour-completed")
    if (!hasSeenTour) {
      setTimeout(() => setIsOpen(true), 1500)
    }
  }, [])

  // Calculate optimal position for tour card
  const calculatePosition = useCallback(
    (targetElement: Element): Position => {
      const rect = targetElement.getBoundingClientRect()
      const cardWidth = isMobile ? window.innerWidth - 32 : 380
      const cardHeight = 280
      const padding = 16
      const arrowOffset = 20

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Calculate available space in each direction
      const spaceTop = rect.top
      const spaceBottom = viewportHeight - rect.bottom
      const spaceLeft = rect.left
      const spaceRight = viewportWidth - rect.right

      let placement: "top" | "bottom" | "left" | "right" = "bottom"
      let top = 0
      let left = 0

      // On mobile, always center horizontally and place below or above
      if (isMobile) {
        left = viewportWidth / 2 - cardWidth / 2

        if (spaceBottom >= cardHeight + padding) {
          placement = "bottom"
          top = rect.bottom + arrowOffset
        } else if (spaceTop >= cardHeight + padding) {
          placement = "top"
          top = rect.top - cardHeight - arrowOffset
        } else {
          // Not enough space, center vertically
          placement = "bottom"
          top = Math.max(padding, Math.min(viewportHeight - cardHeight - padding, rect.bottom + arrowOffset))
        }
      } else {
        // Desktop: try right, left, bottom, top in order of preference
        if (spaceRight >= cardWidth + padding) {
          placement = "right"
          left = rect.right + arrowOffset
          top = rect.top + rect.height / 2 - cardHeight / 2
        } else if (spaceLeft >= cardWidth + padding) {
          placement = "left"
          left = rect.left - cardWidth - arrowOffset
          top = rect.top + rect.height / 2 - cardHeight / 2
        } else if (spaceBottom >= cardHeight + padding) {
          placement = "bottom"
          top = rect.bottom + arrowOffset
          left = rect.left + rect.width / 2 - cardWidth / 2
        } else if (spaceTop >= cardHeight + padding) {
          placement = "top"
          top = rect.top - cardHeight - arrowOffset
          left = rect.left + rect.width / 2 - cardWidth / 2
        } else {
          // Fallback: center on screen
          placement = "bottom"
          top = viewportHeight / 2 - cardHeight / 2
          left = viewportWidth / 2 - cardWidth / 2
        }
      }

      // Constrain to viewport
      top = Math.max(padding, Math.min(top, viewportHeight - cardHeight - padding))
      left = Math.max(padding, Math.min(left, viewportWidth - cardWidth - padding))

      return { top, left, placement }
    },
    [isMobile],
  )

  // Update position when step changes
  useEffect(() => {
    if (isOpen && tourSteps[currentStep]) {
      const updatePosition = () => {
        const targetElement = document.querySelector(tourSteps[currentStep].target)
        if (targetElement) {
          const newPosition = calculatePosition(targetElement)
          setPosition(newPosition)
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

          // Scroll target into view smoothly
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

      // Initial position
      const cleanup = updatePosition()

      // Update on resize
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
    localStorage.setItem("reachai-tour-completed", "true")
  }

  const handleComplete = () => {
    setIsOpen(false)
    localStorage.setItem("reachai-tour-completed", "true")
  }

  const step = tourSteps[currentStep]

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={handleSkip}
              style={{
                background: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(2px)",
              }}
            />

            {highlightedElement && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed z-50 pointer-events-none"
                style={{
                  top: highlightedElement.getBoundingClientRect().top - 8,
                  left: highlightedElement.getBoundingClientRect().left - 8,
                  width: highlightedElement.getBoundingClientRect().width + 16,
                  height: highlightedElement.getBoundingClientRect().height + 16,
                  boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 20px 4px rgba(59, 130, 246, 0.5)",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                }}
              />
            )}

            {/* Tour Card */}
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed z-[70]"
              style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: isMobile ? "calc(100vw - 32px)" : "380px",
              }}
            >
              <Card className="shadow-2xl border-2 border-blue-500/20 bg-background/95 backdrop-blur-xl">
                {/* Arrow indicator */}
                <div
                  className={cn(
                    "absolute w-4 h-4 bg-background border-blue-500/20 rotate-45",
                    position.placement === "bottom" && "-top-2 left-1/2 -translate-x-1/2 border-t-2 border-l-2",
                    position.placement === "top" && "-bottom-2 left-1/2 -translate-x-1/2 border-b-2 border-r-2",
                    position.placement === "right" && "-left-2 top-1/2 -translate-y-1/2 border-l-2 border-b-2",
                    position.placement === "left" && "-right-2 top-1/2 -translate-y-1/2 border-r-2 border-t-2",
                  )}
                />

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        {step.title}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1.5 font-medium">
                        Step {currentStep + 1} of {tourSteps.length}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                      onClick={handleSkip}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </CardHeader>

                <CardContent className="pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>

                <CardFooter className="flex items-center justify-between pt-0">
                  <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
                    Skip Tour
                  </Button>
                  <div className="flex items-center gap-2">
                    {currentStep > 0 && (
                      <Button variant="outline" size="sm" onClick={handlePrevious}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={handleNext}
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md"
                    >
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export function TourTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  const startTour = () => {
    localStorage.removeItem("reachai-tour-completed")
    setIsOpen(true)
    // Reload to restart tour
    window.location.reload()
  }

  return (
    <Button variant="outline" size="sm" onClick={startTour} className="gap-2 bg-transparent">
      <Play className="h-4 w-4" />
      Take Tour
    </Button>
  )
}
