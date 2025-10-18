"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Zap } from "lucide-react"
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
    // Redirect to billing page with selected tier
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-500" />
            Upgrade Your Plan
          </DialogTitle>
          <DialogDescription>
            {message || `Unlock ${feature || "this feature"} and more with a premium plan`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {availablePlans.map((plan) => (
            <div
              key={plan.tier}
              className={cn(
                "relative rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg",
                plan.popular
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                  : "border-border hover:border-blue-300",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.slice(0, 5).map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.features.length > 5 && (
                  <li className="text-xs text-muted-foreground">+{plan.features.length - 5} more features</li>
                )}
              </ul>

              <Button
                onClick={() => handleUpgrade(plan.tier)}
                disabled={loading}
                className={cn(
                  "w-full",
                  plan.popular && "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600",
                )}
              >
                {loading ? "Processing..." : `Upgrade to ${plan.name}`}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>All plans include a 14-day money-back guarantee</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
