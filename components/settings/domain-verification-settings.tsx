

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertCircle, Plus, RefreshCw, ExternalLink, Shield, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { WaveLoader } from "../loader/wave-loader"

interface Domain {
  id: string
  domain: string
  isVerified: boolean
  healthScore: number
  dnsRecords: {
    spf?: { valid: boolean; status?: string }
    dkim?: { valid: boolean; status?: string }
    dmarc?: { valid: boolean; status?: string; policy?: string }
    mx?: { found: boolean }
  } | null
  createdAt: string
}

export function DomainVerification() {
  const [domain, setDomain] = useState("")
  const [domains, setDomains] = useState<Domain[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchDomains()
  }, [])

  const fetchDomains = async () => {
    try {
      const response = await fetch("/api/domains")
      if (response.ok) {
        const data = await response.json()
        let domainList: Domain[] = []
        if (Array.isArray(data)) {
          domainList = data
        } else if (data.domains) {
          domainList = data.domains
        } else if (data.success && data.domains) {
          domainList = data.domains
        }

        // Normalize domains to ensure dnsRecords is never undefined
        domainList = domainList.map((d) => ({
          ...d,
          dnsRecords: d.dnsRecords || {
            spf: { valid: false, status: "UNKNOWN" },
            dkim: { valid: false, status: "UNKNOWN" },
            dmarc: { valid: false, status: "UNKNOWN" },
            mx: { found: false },
          },
        }))

        setDomains(domainList)
      } else {
        console.error("Failed to fetch domains:", response.status)
        setDomains([])
      }
    } catch (error) {
      console.error("Failed to fetch domains:", error)
      setDomains([])
    } finally {
      setIsLoading(false)
    }
  }

  const addDomain = async () => {
    if (!domain.trim()) return

    setIsAdding(true)
    try {
      const response = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.trim().toLowerCase() }),
      })

      if (response.ok) {
        const data = await response.json()
        const newDomain = data.domain || data
        setDomains([...domains, newDomain])
        setDomain("")
        toast({
          title: "Domain added",
          description: "Go to Email Setup to configure DNS records",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to add domain",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add domain",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const verifyDomain = async (domainId: string) => {
    setVerifyingId(domainId)
    try {
      const response = await fetch(`/api/domains/${domainId}/verify`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        const updatedDomain = data.domain || data
        setDomains(domains.map((d) => (d.id === domainId ? { ...d, ...updatedDomain } : d)))

        if (updatedDomain.isVerified) {
          toast({
            title: "Domain verified",
            description: "Your domain is now ready to send emails",
          })
        } else {
          toast({
            title: "Verification incomplete",
            description: "Some DNS records are still missing or incorrect",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify domain",
        variant: "destructive",
      })
    } finally {
      setVerifyingId(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Value copied to clipboard",
    })
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          {/* <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /> */}
          <WaveLoader size="sm" bars={8} gap="tight" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Domain Verification</CardTitle>
          <CardDescription>
            Add and verify your domains for sending emails. For full DNS setup, use the{" "}
            <Link href="/dashboard/email-setup" className="text-primary hover:underline">
              Email Setup Wizard
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="domain">Domain Name</Label>
              <Input
                id="domain"
                placeholder="yourdomain.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addDomain()}
              />
            </div>
            <Button onClick={addDomain} className="mt-auto" disabled={isAdding}>
              {isAdding ? <WaveLoader size="sm" bars={8} gap="tight" /> : <Plus className="h-4 w-4 mr-2" />}
              Add Domain
            </Button>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              After adding a domain, use the{" "}
              <Link href="/dashboard/email-setup" className="font-medium text-primary hover:underline">
                Email Setup Wizard
              </Link>{" "}
              to configure SPF, DKIM, and DMARC records for maximum deliverability.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {domains.length === 0 ? (
        <Card className="p-12 text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Domains Added</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Add a domain above or use the Email Setup Wizard to configure your sending domain with proper DNS records.
          </p>
          <Button asChild>
            <Link href="/dashboard/email-setup">
              <ExternalLink className="h-4 w-4 mr-2" />
              Go to Email Setup Wizard
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {domains.map((d) => (
            <Card key={d.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{d.domain}</CardTitle>
                      {d.isVerified ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Needs Setup
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      Health Score:{" "}
                      <span className={`font-semibold ${getHealthColor(d.healthScore)}`}>{d.healthScore}/100</span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => verifyDomain(d.id)} disabled={verifyingId === d.id}>
                      {verifyingId === d.id ? (
                        <WaveLoader size="sm" bars={8} gap="tight" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Verify
                    </Button>
                    {!d.isVerified && (
                      <Button asChild>
                        <Link href={`/dashboard/email-setup?domain=${d.domain}`}>Configure DNS</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              {/* Show DNS status summary */}
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    {d.dnsRecords?.spf?.valid ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">SPF</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {d.dnsRecords?.dkim?.valid ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">DKIM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {d.dnsRecords?.dmarc?.valid ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">DMARC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {d.dnsRecords?.mx?.found ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">MX</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
