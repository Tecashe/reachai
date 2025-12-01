"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { Globe, CheckCircle2, XCircle, Clock, Settings, RefreshCw, ExternalLink, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { verifyDomain } from "@/lib/actions/domain-action"

interface DomainStatus {
  id: string
  domain: string
  isVerified: boolean
  emailProviderId?: string
  dkimSelector?: string
  spfStatus: "VALID" | "INVALID" | "PENDING" | null
  dkimStatus: "VALID" | "INVALID" | "PENDING" | null
  dmarcStatus: "VALID" | "INVALID" | "PENDING" | null
  mxStatus: "VALID" | "INVALID" | "PENDING" | null
  healthScore: number
  lastVerificationCheck?: Date
  verificationAttempts: number
}

interface DomainListProps {
  domains: DomainStatus[]
  onConfigure: (domainId: string) => void
  onRefresh: () => void
}

export function DomainList({ domains, onConfigure, onRefresh }: DomainListProps) {
  const [verifyingId, setVerifyingId] = useState<string | null>(null)

  const pendingDomains = domains.filter((d) => !d.isVerified)
  const verifiedDomains = domains.filter((d) => d.isVerified)

  const handleQuickVerify = async (domainId: string) => {
    setVerifyingId(domainId)
    try {
      const result = await verifyDomain(domainId)
      if (result.verified) {
        toast.success("Domain verified successfully!")
        onRefresh()
      } else {
        toast.error("Verification incomplete", {
          description: "Some DNS records still need configuration.",
        })
      }
    } catch {
      toast.error("Verification failed")
    } finally {
      setVerifyingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Pending Domains */}
      {pendingDomains.length > 0 && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" aria-hidden="true" />
                <CardTitle className="text-lg">Pending Setup</CardTitle>
                <Badge variant="outline" className="border-amber-500/30 text-amber-600">
                  {pendingDomains.length}
                </Badge>
              </div>
            </div>
            <CardDescription>These domains need DNS configuration to start sending emails.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingDomains.map((domain) => (
              <DomainCard
                key={domain.id}
                domain={domain}
                onConfigure={onConfigure}
                onVerify={handleQuickVerify}
                isVerifying={verifyingId === domain.id}
                variant="pending"
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Verified Domains */}
      {verifiedDomains.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />
                <CardTitle className="text-lg">Verified Domains</CardTitle>
                <Badge variant="outline" className="border-green-500/30 text-green-600">
                  {verifiedDomains.length}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Refresh domains</span>
              </Button>
            </div>
            <CardDescription>These domains are ready for sending cold emails.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {verifiedDomains.map((domain) => (
              <DomainCard
                key={domain.id}
                domain={domain}
                onConfigure={onConfigure}
                onVerify={handleQuickVerify}
                isVerifying={verifyingId === domain.id}
                variant="verified"
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function DomainCard({
  domain,
  onConfigure,
  onVerify,
  isVerifying,
  variant,
}: {
  domain: DomainStatus
  onConfigure: (id: string) => void
  onVerify: (id: string) => void
  isVerifying: boolean
  variant: "pending" | "verified"
}) {
  const StatusIcon = ({ status }: { status: string | null }) => {
    if (status === "VALID") return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
    if (status === "INVALID") return <XCircle className="h-3.5 w-3.5 text-red-500" />
    return <Clock className="h-3.5 w-3.5 text-amber-500" />
  }

  const healthColor =
    domain.healthScore >= 80 ? "text-green-500" : domain.healthScore >= 50 ? "text-amber-500" : "text-red-500"

  return (
    <div
      className={cn(
        "group relative rounded-lg border p-4 transition-all hover:shadow-sm",
        variant === "pending" ? "bg-background" : "bg-card",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Domain info */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              variant === "verified" ? "bg-green-500/10" : "bg-amber-500/10",
            )}
          >
            <Globe
              className={cn("h-5 w-5", variant === "verified" ? "text-green-500" : "text-amber-500")}
              aria-hidden="true"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{domain.domain}</span>
              {variant === "verified" && (
                <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-600 text-xs">
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <StatusIcon status={domain.spfStatus} />
                SPF
              </span>
              <span className="flex items-center gap-1">
                <StatusIcon status={domain.dkimStatus} />
                DKIM
              </span>
              <span className="flex items-center gap-1">
                <StatusIcon status={domain.dmarcStatus} />
                DMARC
              </span>
            </div>
          </div>
        </div>

        {/* Health score and actions */}
        <div className="flex items-center gap-4">
          {/* Health score */}
          <div className="text-right">
            <div className={cn("text-lg font-bold", healthColor)}>{domain.healthScore}%</div>
            <div className="text-xs text-muted-foreground">Health</div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {variant === "pending" ? (
              <Button size="sm" onClick={() => onConfigure(domain.id)}>
                Configure
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => onVerify(domain.id)} disabled={isVerifying}>
                {isVerifying ? <Spinner className="mr-2" /> : <RefreshCw className="mr-2 h-3.5 w-3.5" />}
                Re-verify
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onConfigure(domain.id)}>
                  <Settings className="mr-2 h-4 w-4" />
                  DNS Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onVerify(domain.id)} disabled={isVerifying}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Verify Records
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a
                    href={`https://www.whatsmydns.net/#TXT/${domain.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Check Propagation
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Progress bar for pending domains */}
      {variant === "pending" && (
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Setup Progress</span>
            <span className="font-medium">{domain.healthScore}%</span>
          </div>
          <Progress value={domain.healthScore} className="h-1.5" />
        </div>
      )}
    </div>
  )
}
