"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface DomainHealthCardProps {
  domain: any
}

export function DomainHealthCard({ domain }: DomainHealthCardProps) {
  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getHealthBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>
  }

  const health = domain.deliverabilityHealth

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle>{domain.domain}</CardTitle>
            {domain.isVerified ? (
              <Badge className="bg-green-100 text-green-800">Verified</Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {domain.sendingAccounts.length} sending account{domain.sendingAccounts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${getHealthColor(domain.healthScore)}`}>{domain.healthScore}</div>
          <div className="text-sm text-muted-foreground">Health Score</div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* DNS Records Status */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {health?.spfValid ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm font-medium">SPF</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {health?.spfStatus === "VALID" ? "Valid" : health?.spfStatus === "MISSING" ? "Missing" : "Invalid"}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {health?.dkimValid ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm font-medium">DKIM</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {health?.dkimStatus === "VALID" ? "Valid" : health?.dkimStatus === "MISSING" ? "Missing" : "Invalid"}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {health?.dmarcValid ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm font-medium">DMARC</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {health?.dmarcStatus === "VALID" ? "Valid" : health?.dmarcStatus === "MISSING" ? "Missing" : "Invalid"}
            </p>
          </div>
        </div>

        {/* Metrics */}
        {health && (
          <div className="grid grid-cols-2 gap-4 pt-3 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Bounce Rate</p>
              <p className="text-sm font-semibold">{domain.bounceRate.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Spam Complaints</p>
              <p className="text-sm font-semibold">{domain.spamComplaintRate.toFixed(2)}%</p>
            </div>
          </div>
        )}

        {/* Warnings */}
        {(domain.isBlacklisted || domain.healthScore < 60) && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-red-900">Action Required</p>
              <p className="text-red-700 text-xs mt-1">
                {domain.isBlacklisted && "This domain is blacklisted. "}
                {domain.healthScore < 60 && "Low health score may impact deliverability."}
              </p>
            </div>
          </div>
        )}

        <Button asChild variant="outline" className="w-full bg-transparent">
          <Link href={`/dashboard/deliverability/${domain.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
