"use client"

import { useState, useEffect, useRef } from "react"
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

function useAnimatedPrice(targetPrice: number, duration = 400) {
  const [displayPrice, setDisplayPrice] = useState(targetPrice)
  const animationRef = useRef<number | null>(null) // Added null type and initial value
  const startTimeRef = useRef<number | null>(null) // Added null type and initial value
  const startPriceRef = useRef(targetPrice)

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    startPriceRef.current = displayPrice
    startTimeRef.current = null // Changed from undefined to null

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentPrice = startPriceRef.current + (targetPrice - startPriceRef.current) * easeOut

      setDisplayPrice(Math.round(currentPrice))

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [targetPrice, duration])

  return displayPrice
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

  const [prevTabIndex, setPrevTabIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const selectedPlan = availablePlans.find((p) => p.tier === selectedTab)
  const currentTabIndex = availablePlans.findIndex((p) => p.tier === selectedTab)

  const animatedPrice = useAnimatedPrice(selectedPlan?.price || 0, 350)

  const handleTabChange = (tier: string) => {
    const newIndex = availablePlans.findIndex((p) => p.tier === tier)
    setSlideDirection(newIndex > prevTabIndex ? "left" : "right")
    setPrevTabIndex(newIndex)
    setIsTransitioning(true)

    // Brief exit animation, then switch content
    setTimeout(() => {
      setSelectedTab(tier)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 150)
  }

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
      <DialogContent className="w-[95vw] max-w-md glass-liquid border-0 p-0 gap-0 overflow-hidden">
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
                  onClick={() => handleTabChange(plan.tier)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300",
                    selectedTab === plan.tier
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-300",
                      selectedTab === plan.tier && "scale-110",
                    )}
                  />
                  <span>{plan.name}</span>
                </button>
              )
            })}
          </div>

          {/* Selected Plan Content with Directional Transitions */}
          {selectedPlan && (
            <div
              className={cn(
                "transition-all duration-300 ease-out",
                isTransitioning
                  ? cn("opacity-0", slideDirection === "left" ? "-translate-x-4" : "translate-x-4")
                  : "opacity-100 translate-x-0",
              )}
            >
              {/* Price with counter animation */}
              <div className="flex items-baseline justify-center gap-1 mb-5 relative">
                {selectedPlan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 glass-liquid px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Popular
                  </span>
                )}
                <span className="text-4xl font-bold tracking-tight tabular-nums">${animatedPrice}</span>
                <span className="text-muted-foreground text-sm">/{selectedPlan.interval}</span>
              </div>

              {/* Features with staggered animation */}
              <ul className="space-y-2.5 mb-5">
                {PLAN_HIGHLIGHTS[selectedPlan.tier]?.map((feat, i) => (
                  <li
                    key={`${selectedPlan.tier}-${i}`}
                    className="flex items-center gap-2.5 text-sm transition-all duration-300 ease-out"
                    style={{
                      transitionDelay: isTransitioning ? "0ms" : `${i * 60}ms`,
                      opacity: isTransitioning ? 0 : 1,
                      transform: isTransitioning
                        ? `translateX(${slideDirection === "left" ? "-8px" : "8px"})`
                        : "translateX(0)",
                    }}
                  >
                    <div className="flex-shrink-0 rounded-full p-0.5 bg-foreground transition-transform duration-300 hover:scale-110">
                      <Check className="h-2.5 w-2.5 text-background" />
                    </div>
                    <span className="text-foreground/80">{feat}</span>
                  </li>
                ))}
              </ul>

              {/* CTA with delayed entrance */}
              <div
                className="transition-all duration-300 ease-out"
                style={{
                  transitionDelay: isTransitioning ? "0ms" : "240ms",
                  opacity: isTransitioning ? 0 : 1,
                  transform: isTransitioning ? "translateY(8px)" : "translateY(0)",
                }}
              >
                <Button
                  onClick={() => handleUpgrade(selectedPlan.tier)}
                  disabled={loading}
                  className="w-full btn-press rounded-lg py-5 font-semibold bg-foreground text-background hover:bg-foreground/90 group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? "Processing..." : `Get ${selectedPlan.name}`}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>

                {/* Guarantee */}
                <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
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
