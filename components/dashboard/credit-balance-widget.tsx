"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Brain, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"
import { LOW_CREDIT_THRESHOLDS } from "@/lib/constants"

interface CreditBalanceWidgetProps {
  emailCredits: number
  researchCredits: number
  compact?: boolean
}

export function CreditBalanceWidget({ emailCredits, researchCredits, compact = false }: CreditBalanceWidgetProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isEmailLow = emailCredits <= LOW_CREDIT_THRESHOLDS.EMAIL
  const isResearchLow = researchCredits <= LOW_CREDIT_THRESHOLDS.RESEARCH

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Zap className={`h-4 w-4 ${isEmailLow ? "text-orange-500" : "text-blue-500"}`} />
          <span className={`text-sm font-medium ${isEmailLow ? "text-orange-600 dark:text-orange-400" : ""}`}>
            {emailCredits.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Brain className={`h-4 w-4 ${isResearchLow ? "text-orange-500" : "text-purple-500"}`} />
          <span className={`text-sm font-medium ${isResearchLow ? "text-orange-600 dark:text-orange-400" : ""}`}>
            {researchCredits.toLocaleString()}
          </span>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link href="/dashboard/credits">
            <Plus className="h-3 w-3 mr-1" />
            Buy
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Credit Balance</h3>
          <Button size="sm" asChild>
            <Link href="/dashboard/credits">
              <Plus className="h-4 w-4 mr-1" />
              Buy Credits
            </Link>
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email Credits</p>
                <p className="text-2xl font-bold">{emailCredits.toLocaleString()}</p>
              </div>
            </div>
            {isEmailLow && (
              <Badge variant="outline" className="text-orange-600 dark:text-orange-400 border-orange-300">
                Low
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Research Credits</p>
                <p className="text-2xl font-bold">{researchCredits.toLocaleString()}</p>
              </div>
            </div>
            {isResearchLow && (
              <Badge variant="outline" className="text-orange-600 dark:text-orange-400 border-orange-300">
                Low
              </Badge>
            )}
          </div>
        </div>

        <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
          <Link href="/dashboard/credits">
            <TrendingUp className="h-3 w-3 mr-1" />
            View Usage History
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
