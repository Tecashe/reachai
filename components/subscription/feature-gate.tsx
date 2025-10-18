"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { UpgradeModal } from "./upgrade-modal"
import { checkFeatureAccess, type FeatureLimit } from "@/lib/subscription-gate"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

interface FeatureGateProps {
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const [access, setAccess] = useState<FeatureLimit | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkFeatureAccess(feature).then((result) => {
      setAccess(result)
      setLoading(false)
    })
  }, [feature])

  if (loading) {
    return <div className="animate-pulse bg-muted h-20 rounded-lg" />
  }

  if (!access?.allowed) {
    return (
      <>
        {fallback || (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Upgrade Required</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {access?.message || `This feature requires a premium plan`}
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Current usage: {access?.current} / {access?.limit}
            </p>
            <Button onClick={() => setShowUpgrade(true)}>
              Upgrade to {access?.tier === "FREE" ? "Starter" : "Pro"}
            </Button>
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
