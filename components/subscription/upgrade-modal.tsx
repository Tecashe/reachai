"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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

const PLAN_HIGHLIGHTS: Record<string, string[]> = {
  STARTER: ["1,000 emails/month", "500 AI-enriched prospects", "5 active campaigns", "Email analytics & tracking"],
  PRO: ["5,000 emails/month", "2,500 AI-enriched prospects", "20 active campaigns", "Advanced AI personalization"],
  AGENCY: ["20,000 emails/month", "10,000 AI-enriched prospects", "Unlimited campaigns", "White-label & API access"],
}

export function UpgradeModal({ open, onOpenChange, currentTier, feature, message }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false)

  const availablePlans = PRICING_PLANS.filter((plan) => {
    const tierOrder = ["FREE", "STARTER", "PRO", "AGENCY"]
    const currentIndex = tierOrder.indexOf(currentTier)
    const planIndex = tierOrder.indexOf(plan.tier)
    return planIndex > currentIndex
  })

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
      <DialogContent className="w-[95vw] max-w-md glass-liquid border-0 p-0 gap-0">
        <div className="absolute inset-0 noise-overlay rounded-2xl pointer-events-none" />

        <div className="relative p-6">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2.5">
              <div className="neu-raised rounded-lg p-2">
                <Sparkles className="h-4 w-4" />
              </div>
              Upgrade Your Plan
            </DialogTitle>
            {(message || feature) && (
              <p className="text-sm text-muted-foreground mt-1.5">
                {message || `Unlock ${feature} with a premium plan`}
              </p>
            )}
          </DialogHeader>

          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 rounded-lg bg-muted/50 mb-5">
            {availablePlans.map((plan) => {
              const Icon = getPlanIcon(plan.tier)
              return (
                <button
                  key={plan.tier}
                  onClick={() => setSelectedTab(plan.tier)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    selectedTab === plan.tier
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{plan.name}</span>
                </button>
              )
            })}
          </div>

          {/* Selected Plan - Compact */}
          {selectedPlan && (
            <div key={selectedPlan.tier} className="animate-in fade-in-0 duration-200">
              {/* Price */}
              <div className="flex items-baseline justify-center gap-1 mb-5">
                {selectedPlan.popular && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 glass-liquid px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Popular
                  </span>
                )}
                <span className="text-4xl font-bold tracking-tight">${selectedPlan.price}</span>
                <span className="text-muted-foreground text-sm">/{selectedPlan.interval}</span>
              </div>

              <ul className="space-y-2.5 mb-5">
                {PLAN_HIGHLIGHTS[selectedPlan.tier]?.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm">
                    <div className="flex-shrink-0 rounded-full p-0.5 bg-foreground">
                      <Check className="h-2.5 w-2.5 text-background" />
                    </div>
                    <span className="text-foreground/80">{feat}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                onClick={() => handleUpgrade(selectedPlan.tier)}
                disabled={loading}
                className="w-full btn-press rounded-lg py-5 font-semibold bg-foreground text-background hover:bg-foreground/90 group"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? "Processing..." : `Get ${selectedPlan.name}`}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Button>

              {/* Guarantee */}
              <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                14-day money-back guarantee
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
