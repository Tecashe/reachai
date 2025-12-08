// "use client"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Check, Sparkles, Zap } from "lucide-react"
// import { PRICING_PLANS } from "@/lib/constants"
// import { cn } from "@/lib/utils"

// interface UpgradeModalProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   currentTier: string
//   feature?: string
//   message?: string
// }

// export function UpgradeModal({ open, onOpenChange, currentTier, feature, message }: UpgradeModalProps) {
//   const [loading, setLoading] = useState(false)

//   const handleUpgrade = async (tier: string) => {
//     setLoading(true)
//     // Redirect to billing page with selected tier
//     window.location.href = `/dashboard/billing?upgrade=${tier}`
//   }

//   const availablePlans = PRICING_PLANS.filter((plan) => {
//     const tierOrder = ["FREE", "STARTER", "PRO", "AGENCY"]
//     const currentIndex = tierOrder.indexOf(currentTier)
//     const planIndex = tierOrder.indexOf(plan.tier)
//     return planIndex > currentIndex
//   })

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="text-2xl flex items-center gap-2">
//             <Sparkles className="h-6 w-6 text-blue-500" />
//             Upgrade Your Plan
//           </DialogTitle>
//           <DialogDescription>
//             {message || `Unlock ${feature || "this feature"} and more with a premium plan`}
//           </DialogDescription>
//         </DialogHeader>

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
//           {availablePlans.map((plan) => (
//             <div
//               key={plan.tier}
//               className={cn(
//                 "relative rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg",
//                 plan.popular
//                   ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
//                   : "border-border hover:border-blue-300",
//               )}
//             >
//               {plan.popular && (
//                 <div className="absolute -top-3 left-1/2 -translate-x-1/2">
//                   <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
//                     <Zap className="h-3 w-3" />
//                     MOST POPULAR
//                   </span>
//                 </div>
//               )}

//               <div className="text-center mb-4">
//                 <h3 className="text-lg font-bold">{plan.name}</h3>
//                 <div className="mt-2">
//                   <span className="text-4xl font-bold">${plan.price}</span>
//                   <span className="text-muted-foreground">/{plan.interval}</span>
//                 </div>
//               </div>

//               <ul className="space-y-2 mb-6">
//                 {plan.features.slice(0, 5).map((feature, i) => (
//                   <li key={i} className="flex items-start gap-2 text-sm">
//                     <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//                     <span>{feature}</span>
//                   </li>
//                 ))}
//                 {plan.features.length > 5 && (
//                   <li className="text-xs text-muted-foreground">+{plan.features.length - 5} more features</li>
//                 )}
//               </ul>

//               <Button
//                 onClick={() => handleUpgrade(plan.tier)}
//                 disabled={loading}
//                 className={cn(
//                   "w-full",
//                   plan.popular && "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600",
//                 )}
//               >
//                 {loading ? "Processing..." : `Upgrade to ${plan.name}`}
//               </Button>
//             </div>
//           ))}
//         </div>

//         <div className="mt-4 text-center text-sm text-muted-foreground">
//           <p>All plans include a 14-day money-back guarantee</p>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
// "use client"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Check, Sparkles, Zap, ArrowRight } from "lucide-react"
// import { PRICING_PLANS } from "@/lib/constants"
// import { cn } from "@/lib/utils"

// interface UpgradeModalProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   currentTier: string
//   feature?: string
//   message?: string
// }

// export function UpgradeModal({ open, onOpenChange, currentTier, feature, message }: UpgradeModalProps) {
//   const [loading, setLoading] = useState(false)
//   const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

//   const handleUpgrade = async (tier: string) => {
//     setLoading(true)
//     window.location.href = `/dashboard/billing?upgrade=${tier}`
//   }

//   const availablePlans = PRICING_PLANS.filter((plan) => {
//     const tierOrder = ["FREE", "STARTER", "PRO", "AGENCY"]
//     const currentIndex = tierOrder.indexOf(currentTier)
//     const planIndex = tierOrder.indexOf(plan.tier)
//     return planIndex > currentIndex
//   })

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto glass-liquid border-0 p-0 gap-0">
//         {/* Noise texture */}
//         <div className="absolute inset-0 noise-overlay rounded-2xl pointer-events-none" />

//         <div className="relative p-8">
//           <DialogHeader className="mb-8">
//             <DialogTitle className="text-3xl font-bold tracking-tight flex items-center gap-3">
//               <div className="neu-raised rounded-xl p-2.5">
//                 <Sparkles className="h-6 w-6" />
//               </div>
//               <span className="text-gradient">Upgrade Your Plan</span>
//             </DialogTitle>
//             <DialogDescription className="text-base text-muted-foreground mt-2">
//               {message || `Unlock ${feature || "this feature"} and more with a premium plan`}
//             </DialogDescription>
//           </DialogHeader>

//           {/* Bento grid of plans */}
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
//             {availablePlans.map((plan, index) => (
//               <div
//                 key={plan.tier}
//                 className={cn("relative group cursor-pointer", plan.popular && "lg:scale-105 lg:-my-2 z-10")}
//                 onMouseEnter={() => setHoveredPlan(plan.tier)}
//                 onMouseLeave={() => setHoveredPlan(null)}
//               >
//                 {/* Outer glow for popular/hovered */}
//                 <div
//                   className={cn(
//                     "absolute -inset-2 rounded-3xl transition-all duration-500",
//                     plan.popular || hoveredPlan === plan.tier ? "bg-foreground/5 blur-xl" : "bg-transparent",
//                   )}
//                 />

//                 {/* Card */}
//                 <div
//                   className={cn(
//                     "relative rounded-2xl p-6 transition-all duration-500 h-full",
//                     "border border-border/50 bg-card/50 backdrop-blur-sm",
//                     hoveredPlan === plan.tier && "border-foreground/20 shadow-layered-lg transform -translate-y-1",
//                     plan.popular && "border-foreground/30 bg-card",
//                   )}
//                 >
//                   {/* Popular badge */}
//                   {plan.popular && (
//                     <div className="absolute -top-3 left-1/2 -translate-x-1/2">
//                       <div className="glass-liquid px-4 py-1.5 rounded-full flex items-center gap-1.5">
//                         <Zap className="h-3.5 w-3.5" />
//                         <span className="text-xs font-bold uppercase tracking-wider">Most Popular</span>
//                       </div>
//                     </div>
//                   )}

//                   {/* Plan name and price */}
//                   <div className="text-center mb-6 pt-2">
//                     <h3 className="text-lg font-bold tracking-tight">{plan.name}</h3>
//                     <div className="mt-4 flex items-baseline justify-center gap-1">
//                       <span className="text-4xl font-bold tracking-tight">${plan.price}</span>
//                       <span className="text-muted-foreground text-sm">/{plan.interval}</span>
//                     </div>
//                   </div>

//                   {/* Features */}
//                   <ul className="space-y-3 mb-6">
//                     {plan.features.slice(0, 5).map((featureItem, i) => (
//                       <li key={i} className="flex items-start gap-3 text-sm">
//                         <div
//                           className={cn(
//                             "flex-shrink-0 rounded-full p-0.5 mt-0.5 transition-colors duration-300",
//                             hoveredPlan === plan.tier ? "bg-foreground" : "bg-foreground/20",
//                           )}
//                         >
//                           <Check
//                             className={cn(
//                               "h-3 w-3 transition-colors duration-300",
//                               hoveredPlan === plan.tier ? "text-background" : "text-foreground",
//                             )}
//                           />
//                         </div>
//                         <span className="text-muted-foreground">{featureItem}</span>
//                       </li>
//                     ))}
//                     {plan.features.length > 5 && (
//                       <li className="text-xs text-muted-foreground/60 pl-6">
//                         +{plan.features.length - 5} more features
//                       </li>
//                     )}
//                   </ul>

//                   {/* CTA Button */}
//                   <Button
//                     onClick={() => handleUpgrade(plan.tier)}
//                     disabled={loading}
//                     className={cn(
//                       "w-full btn-press relative overflow-hidden group/btn",
//                       "rounded-xl py-2.5 font-medium tracking-tight",
//                       plan.popular
//                         ? "bg-foreground text-background hover:bg-foreground/90"
//                         : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
//                     )}
//                   >
//                     <span className="relative z-10 flex items-center justify-center gap-2">
//                       {loading ? "Processing..." : `Upgrade to ${plan.name}`}
//                       <ArrowRight
//                         className={cn(
//                           "h-4 w-4 transition-transform duration-300",
//                           hoveredPlan === plan.tier && "translate-x-1",
//                         )}
//                       />
//                     </span>

//                     {/* Button shine */}
//                     <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-background/10 to-transparent" />
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Footer guarantee */}
//           <div className="mt-8 text-center">
//             <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2">
//               <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
//               <p className="text-sm text-muted-foreground">All plans include a 14-day money-back guarantee</p>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Zap, ArrowRight, Crown, Building2 } from "lucide-react"
import { PRICING_PLANS } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentTier: string
  feature?: string
  message?: string
}

export function UpgradeModal({ open, onOpenChange, currentTier, feature, message }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false)

  const availablePlans = PRICING_PLANS.filter((plan) => {
    const tierOrder = ["FREE", "STARTER", "PRO", "AGENCY"]
    const currentIndex = tierOrder.indexOf(currentTier)
    const planIndex = tierOrder.indexOf(plan.tier)
    return planIndex > currentIndex
  })

  // Default to popular plan or first available
  const defaultPlan = availablePlans.find((p) => p.popular)?.tier || availablePlans[0]?.tier
  const [selectedTab, setSelectedTab] = useState<string>(defaultPlan)

  const selectedPlan = availablePlans.find((p) => p.tier === selectedTab)

  const handleUpgrade = async (tier: string) => {
    setLoading(true)
    window.location.href = `/dashboard/billing?upgrade=${tier}`
  }

  const getPlanIcon = (tier: string) => {
    switch (tier) {
      case "STARTER":
        return Zap
      case "PRO":
        return Crown
      case "AGENCY":
        return Building2
      default:
        return Sparkles
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto glass-liquid border-0 p-0 gap-0">
        {/* Noise texture */}
        <div className="absolute inset-0 noise-overlay rounded-2xl pointer-events-none" />

        <div className="relative p-6 md:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
              <div className="neu-raised rounded-xl p-2.5">
                <Sparkles className="h-5 w-5" />
              </div>
              <span>Upgrade Your Plan</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              {message || `Unlock ${feature || "this feature"} and more with a premium plan`}
            </DialogDescription>
          </DialogHeader>

          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 rounded-xl bg-muted/50 mb-6">
            {availablePlans.map((plan) => {
              const Icon = getPlanIcon(plan.tier)
              return (
                <button
                  key={plan.tier}
                  onClick={() => setSelectedTab(plan.tier)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                    selectedTab === plan.tier
                      ? "bg-background shadow-md text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{plan.name}</span>
                  {plan.popular && <span className="hidden sm:inline-flex h-1.5 w-1.5 rounded-full bg-foreground" />}
                </button>
              )
            })}
          </div>

          {/* Selected Plan Content */}
          {selectedPlan && (
            <div key={selectedPlan.tier} className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              {/* Price Section */}
              <div className="text-center mb-6 pb-6 border-b border-border/50">
                <div className="inline-flex items-center gap-2 mb-3">
                  {selectedPlan.popular && (
                    <span className="glass-liquid px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="h-3 w-3" />
                      Most Popular
                    </span>
                  )}
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold tracking-tight">${selectedPlan.price}</span>
                  <span className="text-muted-foreground">/{selectedPlan.interval}</span>
                </div>
              </div>

              {/* Features List - Full width, no truncation */}
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4 font-medium">
                  Everything included
                </p>
                <ul className="grid grid-cols-1 gap-3">
                  {selectedPlan.features.map((featureItem, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ animationDelay: `${i * 50}ms` }}>
                      <div className="flex-shrink-0 rounded-full p-1 bg-foreground mt-0.5">
                        <Check className="h-3 w-3 text-background" />
                      </div>
                      <span className="text-foreground/80 leading-relaxed">{featureItem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => handleUpgrade(selectedPlan.tier)}
                disabled={loading}
                className={cn(
                  "w-full btn-press relative overflow-hidden group/btn",
                  "rounded-xl py-6 font-semibold tracking-tight text-base",
                  "bg-foreground text-background hover:bg-foreground/90",
                )}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "Processing..." : `Upgrade to ${selectedPlan.name}`}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </span>

                {/* Button shine */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-background/20 to-transparent" />
              </Button>
            </div>
          )}

          {/* Footer guarantee */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <p>14-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
