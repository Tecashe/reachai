// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { UpgradeModal } from "./upgrade-modal"
// import { checkFeatureAccess, type FeatureLimit } from "@/lib/subscription-gate"
// import { Button } from "@/components/ui/button"
// import { Lock } from "lucide-react"

// interface FeatureGateProps {
//   feature: string
//   children: React.ReactNode
//   fallback?: React.ReactNode
// }

// export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
//   const [access, setAccess] = useState<FeatureLimit | null>(null)
//   const [showUpgrade, setShowUpgrade] = useState(false)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     checkFeatureAccess(feature).then((result) => {
//       setAccess(result)
//       setLoading(false)
//     })
//   }, [feature])

//   if (loading) {
//     return <div className="animate-pulse bg-muted h-20 rounded-lg" />
//   }

//   if (!access?.allowed) {
//     return (
//       <>
//         {fallback || (
//           <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
//             <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//             <h3 className="text-lg font-semibold mb-2">Upgrade Required</h3>
//             <p className="text-sm text-muted-foreground mb-4">
//               {access?.message || `This feature requires a premium plan`}
//             </p>
//             <p className="text-xs text-muted-foreground mb-4">
//               Current usage: {access?.current} / {access?.limit}
//             </p>
//             <Button onClick={() => setShowUpgrade(true)}>
//               Upgrade to {access?.tier === "FREE" ? "Starter" : "Pro"}
//             </Button>
//           </div>
//         )}
//         <UpgradeModal
//           open={showUpgrade}
//           onOpenChange={setShowUpgrade}
//           currentTier={access?.tier || "FREE"}
//           feature={feature}
//           message={access?.message}
//         />
//       </>
//     )
//   }

//   return <>{children}</>
// }

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { UpgradeModal } from "./upgrade-modal"
import { checkFeatureAccess, type FeatureLimit } from "@/lib/subscription-gate"
import { Button } from "@/components/ui/button"
import { Lock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureGateProps {
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const [access, setAccess] = useState<FeatureLimit | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    checkFeatureAccess(feature).then((result) => {
      setAccess(result)
      setLoading(false)
    })
  }, [feature])

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-2xl">
        {/* Skeleton with liquid glass effect */}
        <div className="glass-liquid h-48 rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
        <style jsx>{`
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    )
  }

  if (!access?.allowed) {
    return (
      <>
        {fallback || (
          <div
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Outer glow on hover */}
            <div
              className={cn(
                "absolute -inset-1 rounded-3xl transition-all duration-500",
                isHovered ? "bg-foreground/5 blur-xl" : "bg-transparent",
              )}
            />

            {/* Main container with liquid glass */}
            <div className="relative glass-liquid rounded-2xl p-8 overflow-hidden">
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-2xl gradient-border-animated" />

              {/* Subtle noise texture */}
              <div className="absolute inset-0 noise-overlay rounded-2xl" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Lock icon with layered design */}
                <div className="relative mb-6">
                  {/* Background circle */}
                  <div className="absolute inset-0 scale-150 rounded-full bg-gradient-to-br from-foreground/5 to-transparent blur-2xl" />

                  {/* Icon container */}
                  <div
                    className={cn(
                      "relative neu-raised rounded-2xl p-5 transition-all duration-500",
                      isHovered && "scale-110",
                    )}
                  >
                    <Lock
                      className={cn(
                        "h-8 w-8 transition-all duration-500",
                        isHovered ? "text-foreground" : "text-muted-foreground",
                      )}
                    />

                    {/* Sparkle accent */}
                    <Sparkles
                      className={cn(
                        "absolute -top-1 -right-1 h-4 w-4 text-foreground/60 transition-all duration-300",
                        isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75",
                      )}
                    />
                  </div>
                </div>

                {/* Text content */}
                <h3 className="text-xl font-semibold tracking-tight mb-2">Upgrade Required</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-xs leading-relaxed">
                  {access?.message || `This feature requires a premium plan`}
                </p>

                {/* Usage indicator - bento style */}
                <div className="glass rounded-xl px-4 py-2 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Usage</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold tabular-nums">{access?.current}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-sm text-muted-foreground">{access?.limit}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.min(((access?.current || 0) / (access?.limit || 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => setShowUpgrade(true)}
                  className={cn(
                    "btn-press relative overflow-hidden group/btn",
                    "bg-foreground text-background hover:bg-foreground/90",
                    "px-6 py-2.5 rounded-xl font-medium tracking-tight",
                  )}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Upgrade to {access?.tier === "FREE" ? "Starter" : "Pro"}
                  </span>

                  {/* Button shine effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-background/20 to-transparent" />
                </Button>
              </div>
            </div>
          </div>
        )}
        <UpgradeModal
          open={showUpgrade}
          onOpenChange={setShowUpgrade}
          currentTier={access?.tier || "FREE"}
          feature={feature}
          message={access?.message}
        />
      </>
    )
  }

  return <>{children}</>
}
