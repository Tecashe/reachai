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

"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Zap, ArrowRight } from "lucide-react"
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

  const handleUpgrade = async (tier: string) => {
    setLoading(true)
    window.location.href = `/dashboard/billing?upgrade=${tier}`
  }

  const availablePlans = PRICING_PLANS.filter((plan) => {
    const tierOrder = ["FREE", "STARTER", "PRO", "AGENCY"]
    const currentIndex = tierOrder.indexOf(currentTier)
    const planIndex = tierOrder.indexOf(plan.tier)
    return planIndex > currentIndex
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-6xl p-0 border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
        {/* Header Section */}
        <div className="relative px-6 sm:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Unlock Premium Features
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
                {message ||
                  `Get access to ${feature || "premium features"} and accelerate your growth with our most powerful plans`}
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="px-6 sm:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {availablePlans.map((plan, index) => (
              <div
                key={plan.tier}
                className={cn(
                  "relative group rounded-2xl transition-all duration-300 overflow-hidden",
                  plan.popular ? "md:col-span-2 lg:col-span-1 lg:scale-105 lg:shadow-2xl" : "hover:shadow-xl",
                )}
              >
                {/* Background gradient */}
                <div
                  className={cn(
                    "absolute inset-0 transition-all duration-300",
                    plan.popular
                      ? "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40"
                      : "bg-white dark:bg-slate-900",
                  )}
                />

                {/* Border gradient */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl transition-all duration-300",
                    plan.popular
                      ? "bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-800 dark:to-cyan-800 p-[1px]"
                      : "bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 p-[1px] group-hover:from-blue-300 group-hover:to-cyan-300 dark:group-hover:from-blue-700 dark:group-hover:to-cyan-700",
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-0 rounded-2xl",
                      plan.popular
                        ? "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40"
                        : "bg-white dark:bg-slate-900",
                    )}
                  />
                </div>

                {/* Content */}
                <div className="relative p-6 sm:p-8 flex flex-col h-full">
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="mb-4 inline-flex w-fit">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg">
                        <Zap className="h-3.5 w-3.5 text-white" />
                        <span className="text-xs font-bold text-white">MOST POPULAR</span>
                      </div>
                    </div>
                  )}

                  {/* Plan Name and Price */}
                  <div className="mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
                        ${plan.price}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">/{plan.interval}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.slice(0, 5).map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="flex items-center justify-center h-5 w-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 5 && (
                      <li className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                        +{plan.features.length - 5} more features
                      </li>
                    )}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleUpgrade(plan.tier)}
                    disabled={loading}
                    className={cn(
                      "w-full h-11 sm:h-12 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn",
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900",
                    )}
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Upgrade to {plan.name}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badge */}
          <div className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-slate-200 dark:border-slate-800">
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              ✓ All plans include a{" "}
              <span className="font-semibold text-slate-900 dark:text-white">14-day money-back guarantee</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
