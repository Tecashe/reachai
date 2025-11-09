"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react"
import { verifyDomain } from "@/lib/actions/domain-action"
import { toast } from "sonner"

interface DomainStatus {
  id: string
  domain: string
  isVerified: boolean
  spfStatus: string | null
  dkimStatus: string | null
  dmarcStatus: string | null
  mxStatus: string | null
  healthScore: number
}

export function EmailAuthStatus() {
  const [domains, setDomains] = useState<DomainStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState<string | null>(null)

  useEffect(() => {
    fetchDomains()
  }, [])

  const fetchDomains = async () => {
    try {
      const response = await fetch("/api/domains")
      const data = await response.json()

      if (data.success) {
        setDomains(data.domains)
      }
    } catch (error) {
      console.error("Failed to fetch domains:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (domainId: string) => {
    setVerifying(domainId)
    try {
      const result = await verifyDomain(domainId)

      if (result.verified) {
        toast.success("Domain verified successfully!")
      } else {
        toast.error("DNS verification failed. Please check your records.")
      }

      // Refresh domains list
      await fetchDomains()
    } catch (error) {
      toast.error("Failed to verify domain")
    } finally {
      setVerifying(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {domains.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No domains added yet. Add a domain in the Domain Setup tab to get started.
        </p>
      ) : (
        domains.map((domain) => (
          <Card key={domain.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{domain.domain}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={domain.isVerified ? "default" : "secondary"}>
                    {domain.isVerified ? "Verified" : "Pending"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVerify(domain.id)}
                    disabled={verifying === domain.id}
                  >
                    {verifying === domain.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Verify Now"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">SPF</p>
                  <div className="flex items-center gap-2">
                    {domain.spfStatus === "VALID" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : domain.spfStatus === "INVALID" ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm text-muted-foreground">{domain.spfStatus || "Not configured"}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">DKIM</p>
                  <div className="flex items-center gap-2">
                    {domain.dkimStatus === "VALID" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : domain.dkimStatus === "INVALID" ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm text-muted-foreground">{domain.dkimStatus || "Not configured"}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">DMARC</p>
                  <div className="flex items-center gap-2">
                    {domain.dmarcStatus === "VALID" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : domain.dmarcStatus === "INVALID" ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm text-muted-foreground">{domain.dmarcStatus || "Not configured"}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Health Score</p>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-bold">{domain.healthScore || 0}%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
