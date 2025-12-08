"use client"

import { useState, useEffect, useCallback } from "react"
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

function AnimatedPrice({ price }: { price: number }) {
  const [displayPrice, setDisplayPrice] = useState(price)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (price !== displayPrice) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setDisplayPrice(price)
        setIsAnimating(false)
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [price, displayPrice])

  return (
    <span
      className={cn(
        "text-5xl font-bold tracking-tight tabular-nums transition-all duration-300 ease-out inline-block",
        isAnimating ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100 blur-0",
      )}
      style={{ willChange: "transform, opacity, filter" }}
    >
      ${displayPrice}
    </span>
  )
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
  const [displayedTab, setDisplayedTab] = useState<string>(defaultPlan)

  const [prevTabIndex, setPrevTabIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left")
  const [contentVisible, setContentVisible] = useState(true)

  const selectedPlan = availablePlans.find((p) => p.tier === displayedTab)

  const handleTabChange = useCallback(
    (tier: string) => {
      if (tier === selectedTab) return

      const newIndex = availablePlans.findIndex((p) => p.tier === tier)
      const oldIndex = availablePlans.findIndex((p) => p.tier === selectedTab)

      setSlideDirection(newIndex > oldIndex ? "left" : "right")
      setSelectedTab(tier)
      setContentVisible(false)

      // Single smooth transition - hide, swap, show
      setTimeout(() => {
        setDisplayedTab(tier)
        // Small delay before showing to ensure DOM has updated
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setContentVisible(true)
          })
        })
      }, 200)
    },
    [selectedTab, availablePlans],
  )

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
      <DialogContent className="w-[95vw] max-w-[420px] min-h-[480px] glass-liquid border-0 p-0 gap-0 overflow-hidden">
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
          <div className="flex gap-1 p-1 rounded-xl bg-muted/50 mb-6">
            {availablePlans.map((plan) => {
              const Icon = getPlanIcon(plan.tier)
              return (
                <button
                  key={plan.tier}
                  onClick={() => handleTabChange(plan.tier)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-out",
                    selectedTab === plan.tier
                      ? "bg-background shadow-md text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      selectedTab === plan.tier && "scale-110",
                    )}
                  />
                  <span>{plan.name}</span>
                </button>
              )
            })}
          </div>

          {selectedPlan && (
            <div
              className={cn(
                "transition-all duration-300 ease-out",
                contentVisible
                  ? "opacity-100 translate-x-0 blur-0"
                  : cn("opacity-0 blur-[2px]", slideDirection === "left" ? "-translate-x-3" : "translate-x-3"),
              )}
              style={{ willChange: "transform, opacity, filter" }}
            >
              {/* Price display */}
              <div className="flex items-baseline justify-center gap-1 mb-6 relative pt-2">
                {selectedPlan.popular && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 glass-liquid px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Popular
                  </span>
                )}
                <AnimatedPrice price={selectedPlan.price} />
                <span className="text-muted-foreground text-sm">/{selectedPlan.interval}</span>
              </div>

              {/* Features list */}
              <ul className="space-y-3 mb-6">
                {PLAN_HIGHLIGHTS[selectedPlan.tier]?.map((feat, i) => (
                  <li
                    key={`${selectedPlan.tier}-${i}`}
                    className="flex items-center gap-3 text-sm transition-all duration-300 ease-out"
                    style={{
                      transitionDelay: contentVisible ? `${i * 50}ms` : "0ms",
                      opacity: contentVisible ? 1 : 0,
                      transform: contentVisible ? "translateY(0)" : "translateY(4px)",
                    }}
                  >
                    <div className="flex-shrink-0 rounded-full p-1 bg-foreground">
                      <Check className="h-2.5 w-2.5 text-background" strokeWidth={3} />
                    </div>
                    <span className="text-foreground/80">{feat}</span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <div
                className="transition-all duration-300 ease-out"
                style={{
                  transitionDelay: contentVisible ? "200ms" : "0ms",
                  opacity: contentVisible ? 1 : 0,
                  transform: contentVisible ? "translateY(0)" : "translateY(6px)",
                }}
              >
                <Button
                  onClick={() => handleUpgrade(selectedPlan.tier)}
                  disabled={loading}
                  className="w-full btn-press rounded-xl py-6 font-semibold bg-foreground text-background hover:bg-foreground/90 group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? "Processing..." : `Get ${selectedPlan.name}`}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Button>

                <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  14-day money-back guarantee
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
