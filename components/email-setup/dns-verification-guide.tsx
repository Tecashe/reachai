

"use client"

import type React from "react"
import { useEffect, useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Copy,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Search,
  HelpCircle,
  Zap,
  Shield,
  Mail,
  Server,
} from "lucide-react"
import { toast } from "sonner"
import { verifyDomain, checkDKIMSelector, updateDomainProvider, getProviders } from "@/lib/actions/domain-action"
import { cn } from "@/lib/utils"

// =============================================================================
// TYPES
// =============================================================================

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

interface EmailProvider {
  id: string
  name: string
  icon: string
  dkimSelectors: string[]
  spfInclude: string
  setupUrl: string
  instructions: string[]
  estimatedTime: string
}

interface DNSRecord {
  type: string
  name: string
  value: string
  selector?: string
}

interface VerificationResult {
  verified: boolean
  healthScore: number
  dkimSelector?: string
  results: Array<{
    type: string
    valid: boolean
    message?: string
    details?: string
  }>
  diagnostics?: {
    timestamp: Date
    dnsLookupTime: number
    selectorsChecked: number
  }
}

interface DNSVerificationGuideProps {
  domains: DomainStatus[]
  selectedDomainId: string | null
  onDomainSelect: (id: string) => void
  onVerificationComplete: () => void
}

// Selector validation
const validateSelector = (selector: string): boolean => {
  return /^[a-zA-Z0-9_-]+$/.test(selector) && selector.length <= 63
}

// =============================================================================
// PROVIDER ICONS
// =============================================================================

const ProviderIcon = ({ provider, className }: { provider: string; className?: string }) => {
  const icons: Record<string, React.ReactNode> = {
    google: (
      <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)}>
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
    microsoft: (
      <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)}>
        <path fill="#F25022" d="M1 1h10v10H1z" />
        <path fill="#00A4EF" d="M1 13h10v10H1z" />
        <path fill="#7FBA00" d="M13 1h10v10H13z" />
        <path fill="#FFB900" d="M13 13h10v10H13z" />
      </svg>
    ),
    sendgrid: <Mail className={cn("h-5 w-5 text-blue-500", className)} />,
    mailgun: <Mail className={cn("h-5 w-5 text-red-500", className)} />,
    aws: <Server className={cn("h-5 w-5 text-orange-500", className)} />,
    zoho: <Mail className={cn("h-5 w-5 text-green-600", className)} />,
    server: <Server className={cn("h-5 w-5 text-muted-foreground", className)} />,
  }
  return <>{icons[provider] || icons.server}</>
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function DNSVerificationGuide({
  domains,
  selectedDomainId,
  onDomainSelect,
  onVerificationComplete,
}: DNSVerificationGuideProps) {
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([])
  const [providers, setProviders] = useState<EmailProvider[]>([])
  const [verifying, setVerifying] = useState(false)
  const [lastVerification, setLastVerification] = useState<VerificationResult | null>(null)
  const [customSelector, setCustomSelector] = useState("")
  const [checkingSelector, setCheckingSelector] = useState(false)
  const [selectorResult, setSelectorResult] = useState<{ found: boolean; valid: boolean; record?: string } | null>(null)
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  const [updatingProvider, setUpdatingProvider] = useState(false)

  // Cache for DNS records
  const dnsRecordsCacheRef = useRef<Record<string, DNSRecord[]>>({})
  const abortControllerRef = useRef<AbortController | null>(null)

  const selectedDomain = domains.find((d) => d.id === selectedDomainId)
  const selectedProvider = providers.find((p) => p.id === selectedDomain?.emailProviderId)

  // Fetch providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const providerList = await getProviders()
        setProviders(providerList)
      } catch (error) {
        console.error("Failed to fetch providers:", error)
      }
    }
    fetchProviders()
  }, [])

  // Fetch DNS records with caching
  const fetchDNSRecords = useCallback(async (domainId: string) => {
    // Check cache first
    if (dnsRecordsCacheRef.current[domainId]) {
      setDnsRecords(dnsRecordsCacheRef.current[domainId])
      return
    }

    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch(`/api/domains/${domainId}`, {
        signal: abortControllerRef.current.signal,
      })
      const data = await response.json()

      if (data.success && data.domain?.dnsRecords?.records) {
        dnsRecordsCacheRef.current[domainId] = data.domain.dnsRecords.records
        setDnsRecords(data.domain.dnsRecords.records)
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return
      console.error("Failed to fetch DNS records:", error)
    }
  }, [])

  useEffect(() => {
    if (selectedDomainId) {
      fetchDNSRecords(selectedDomainId)
      setLastVerification(null)
      setSelectorResult(null)
    }

    return () => abortControllerRef.current?.abort()
  }, [selectedDomainId, fetchDNSRecords])

  // Handle verify
  const handleVerify = async () => {
    if (!selectedDomainId || verifying) return

    setVerifying(true)
    setSelectorResult(null)

    try {
      const result = await verifyDomain(selectedDomainId, customSelector || undefined)
      setLastVerification(result)

      if (result.verified) {
        toast.success("Domain verified successfully!", {
          description: `Health score: ${result.healthScore}%`,
        })
        onVerificationComplete()
      } else {
        const failedRecords = result.results.filter((r) => !r.valid)
        toast.error("Some DNS records need attention", {
          description: failedRecords.map((r) => r.type).join(", ") + " not configured correctly",
        })
      }
    } catch (error) {
      toast.error("Verification failed", {
        description: error instanceof Error ? error.message : "Please try again",
      })
    } finally {
      setVerifying(false)
    }
  }

  // Handle custom selector check
  const handleCheckCustomSelector = async () => {
    if (!selectedDomainId || !customSelector.trim() || checkingSelector) return

    if (!validateSelector(customSelector.trim())) {
      toast.error("Invalid selector format", {
        description: "Selector must contain only letters, numbers, hyphens, and underscores",
      })
      return
    }

    setCheckingSelector(true)

    try {
      const result = await checkDKIMSelector(selectedDomainId, customSelector.trim())
      setSelectorResult(result)

      if (result.valid) {
        toast.success("DKIM selector found!", { description: `Selector "${customSelector}" is valid` })
        // Clear cache to refetch updated status
        delete dnsRecordsCacheRef.current[selectedDomainId]
        onVerificationComplete()
      } else if (result.found) {
        toast.warning("Selector found but may be invalid", {
          description: "The record exists but might be misconfigured",
        })
      } else {
        toast.error("Selector not found", {
          description: `No DKIM record found. DNS propagation can take up to 48 hours.`,
        })
      }
    } catch {
      toast.error("Failed to check selector")
    } finally {
      setCheckingSelector(false)
    }
  }

  // Handle provider change with optimistic update
  const handleProviderChange = async (providerId: string) => {
    if (!selectedDomainId || updatingProvider) return

    setUpdatingProvider(true)

    try {
      const result = await updateDomainProvider(selectedDomainId, providerId)

      if (result.success) {
        toast.success("Email provider updated")
        // Clear cache for this domain
        delete dnsRecordsCacheRef.current[selectedDomainId]
        onVerificationComplete()
        fetchDNSRecords(selectedDomainId)
      } else {
        toast.error("Failed to update provider")
      }
    } catch {
      toast.error("Failed to update provider")
    } finally {
      setUpdatingProvider(false)
    }
  }

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied!", { description: `${label} copied to clipboard` })
  }

  // Get records
  const spfRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "@")
  const dmarcRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "_dmarc")

  // Calculate progress
  const getVerificationProgress = () => {
    if (!selectedDomain) return 0
    let progress = 0
    if (selectedDomain.spfStatus === "VALID") progress += 30
    if (selectedDomain.dkimStatus === "VALID") progress += 35
    if (selectedDomain.dmarcStatus === "VALID") progress += 25
    if (selectedDomain.mxStatus === "VALID") progress += 10
    return progress
  }

  // Status badge component
  const StatusBadge = ({ status }: { status: string | null }) => {
    if (status === "VALID") {
      return (
        <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
          <CheckCircle2 className="mr-1 h-3 w-3" aria-hidden="true" />
          Verified
        </Badge>
      )
    }
    if (status === "INVALID") {
      return (
        <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-500/20">
          <XCircle className="mr-1 h-3 w-3" aria-hidden="true" />
          Invalid
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
        <Clock className="mr-1 h-3 w-3" aria-hidden="true" />
        Pending
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Domain Selector & Progress - Liquid Glass Card */}
      <Card className="relative overflow-hidden">
        {/* Liquid glass background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <CardHeader className="relative pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">DNS Configuration</CardTitle>
              <CardDescription>Configure email authentication for your domain</CardDescription>
            </div>
            {selectedDomain && (
              <div className="relative rounded-xl bg-background/60 backdrop-blur-sm border px-4 py-2 text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  {selectedDomain.healthScore || 0}%
                </p>
                <p className="text-xs text-muted-foreground">Health Score</p>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Domain Selector */}
          {domains.length > 1 && (
            <div className="space-y-2">
              <label className="text-sm font-medium" id="domain-select-label">
                Select Domain
              </label>
              <Select
                value={selectedDomainId || ""}
                onValueChange={(value) => {
                  onDomainSelect(value)
                  setLastVerification(null)
                  setSelectorResult(null)
                }}
              >
                <SelectTrigger aria-labelledby="domain-select-label">
                  <SelectValue placeholder="Choose a domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem key={domain.id} value={domain.id}>
                      <span className="flex items-center gap-2">
                        {domain.domain}
                        {domain.isVerified && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Verification Progress</span>
              <span className="text-muted-foreground">{getVerificationProgress()}% complete</span>
            </div>
            <Progress value={getVerificationProgress()} className="h-2" />
          </div>

          {/* Status Grid */}
          {selectedDomain && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: "spf", label: "SPF", desc: "Sender authorization", status: selectedDomain.spfStatus },
                { key: "dkim", label: "DKIM", desc: "Email signatures", status: selectedDomain.dkimStatus },
                { key: "dmarc", label: "DMARC", desc: "Policy enforcement", status: selectedDomain.dmarcStatus },
                { key: "mx", label: "MX", desc: "Mail routing", status: selectedDomain.mxStatus },
              ].map((item) => (
                <div key={item.key} className="p-3 rounded-lg border bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Provider Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" aria-hidden="true" />
            Email Provider
          </CardTitle>
          <CardDescription>
            Select your email provider to get the correct DKIM selectors and setup instructions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleProviderChange(provider.id)}
                disabled={updatingProvider}
                className={cn(
                  "p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50 disabled:opacity-50",
                  selectedDomain?.emailProviderId === provider.id ? "border-primary bg-primary/5" : "border-border",
                )}
                aria-pressed={selectedDomain?.emailProviderId === provider.id}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ProviderIcon provider={provider.icon} />
                  <span className="font-medium text-sm">{provider.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{provider.estimatedTime}</p>
              </button>
            ))}
          </div>

          {/* Provider Instructions */}
          {selectedProvider && (
            <div className="mt-4 p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ProviderIcon provider={selectedProvider.icon} />
                  <span className="font-semibold">{selectedProvider.name} Setup</span>
                </div>
                {selectedProvider.setupUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedProvider.setupUrl} target="_blank" rel="noopener noreferrer">
                      Open {selectedProvider.name}
                      <ExternalLink className="ml-1 h-3 w-3" aria-hidden="true" />
                    </a>
                  </Button>
                )}
              </div>

              <Alert className="mb-4 border-amber-500/20 bg-amber-500/5">
                <Zap className="h-4 w-4 text-amber-500" aria-hidden="true" />
                <AlertTitle className="text-amber-600">Important: Complete DKIM Setup First</AlertTitle>
                <AlertDescription className="text-amber-600/80">
                  You must complete domain authentication in {selectedProvider.name} before DKIM verification will pass.
                </AlertDescription>
              </Alert>

              <ol className="space-y-2 text-sm">
                {selectedProvider.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>

              <Separator className="my-4" />

              <div className="text-xs text-muted-foreground">
                <strong>DKIM Selectors we check:</strong> {selectedProvider.dkimSelectors.slice(0, 3).join(", ")}
                {selectedProvider.dkimSelectors.length > 3 && ` +${selectedProvider.dkimSelectors.length - 3} more`}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DNS Records Tabs */}
      <Tabs defaultValue="spf" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="spf" className="gap-2">
            <Shield className="h-4 w-4" aria-hidden="true" />
            SPF
          </TabsTrigger>
          <TabsTrigger value="dkim" className="gap-2">
            <Mail className="h-4 w-4" aria-hidden="true" />
            DKIM
          </TabsTrigger>
          <TabsTrigger value="dmarc" className="gap-2">
            <Shield className="h-4 w-4" aria-hidden="true" />
            DMARC
          </TabsTrigger>
        </TabsList>

        {/* SPF Tab */}
        <TabsContent value="spf">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>SPF Record</span>
                <StatusBadge status={selectedDomain?.spfStatus || null} />
              </CardTitle>
              <CardDescription>
                Sender Policy Framework authorizes which servers can send email from your domain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {spfRecord && (
                <div className="space-y-3">
                  <DNSRecordField
                    label="Record Type"
                    value="TXT"
                    onCopy={() => copyToClipboard("TXT", "Record type")}
                  />
                  <DNSRecordField
                    label="Host / Name"
                    value="@"
                    hint="Use @ or leave blank for root domain"
                    onCopy={() => copyToClipboard("@", "Host")}
                  />
                  <DNSRecordField
                    label="Value"
                    value={spfRecord.value}
                    onCopy={() => copyToClipboard(spfRecord.value, "SPF record")}
                  />

                  <Alert>
                    <HelpCircle className="h-4 w-4" aria-hidden="true" />
                    <AlertDescription className="text-sm">
                      <strong>Already have an SPF record?</strong> Add{" "}
                      <code className="bg-muted px-1 rounded">
                        {selectedProvider?.spfInclude || "include:your-provider.com"}
                      </code>{" "}
                      to your existing record instead of replacing it.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DKIM Tab */}
        <TabsContent value="dkim">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>DKIM Configuration</span>
                <StatusBadge status={selectedDomain?.dkimStatus || null} />
              </CardTitle>
              <CardDescription>
                DomainKeys Identified Mail adds a digital signature to verify email authenticity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-blue-500/20 bg-blue-500/5">
                <AlertCircle className="h-4 w-4 text-blue-500" aria-hidden="true" />
                <AlertTitle className="text-blue-600">DKIM is configured in your email provider</AlertTitle>
                <AlertDescription className="text-blue-600/80">
                  Unlike SPF and DMARC, DKIM records are generated by your email provider (
                  {selectedProvider?.name || "Google, Microsoft, etc."}). Complete domain authentication there first.
                </AlertDescription>
              </Alert>

              {/* Found Selector Display */}
              {selectedDomain?.dkimSelector && (
                <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />
                    <span className="font-medium text-green-600">DKIM Verified</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Found valid DKIM with selector:{" "}
                    <code className="bg-muted px-1 rounded">{selectedDomain.dkimSelector}</code>
                  </p>
                </div>
              )}

              {/* Manual Selector Check */}
              {selectedDomain?.dkimStatus !== "VALID" && (
                <div className="space-y-3">
                  <Separator />
                  <Field>
                    <FieldLabel>Check Custom Selector</FieldLabel>
                    <FieldDescription>
                      If you know your DKIM selector from your email provider, enter it here:
                    </FieldDescription>
                    <InputGroup>
                      <InputGroupInput
                        placeholder="e.g., google, selector1, s1"
                        value={customSelector}
                        onChange={(e) => setCustomSelector(e.target.value)}
                        aria-label="DKIM selector"
                      />
                      <InputGroupAddon>
                        <InputGroupText className="text-muted-foreground text-xs">
                          ._domainkey.{selectedDomain?.domain}
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupButton>
                        <Button
                          variant="outline"
                          onClick={handleCheckCustomSelector}
                          disabled={checkingSelector || !customSelector.trim()}
                        >
                          {checkingSelector ? <Spinner/> : <Search className="h-4 w-4" />}
                          <span className="ml-2 hidden sm:inline">Check</span>
                        </Button>
                      </InputGroupButton>
                    </InputGroup>
                  </Field>

                  {selectorResult && (
                    <Alert
                      className={
                        selectorResult.valid ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"
                      }
                    >
                      {selectorResult.valid ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
                      )}
                      <AlertDescription>
                        {selectorResult.valid
                          ? `DKIM record found at ${customSelector}._domainkey.${selectedDomain?.domain}`
                          : selectorResult.found
                            ? "Record exists but may be misconfigured"
                            : `No DKIM record found. If you just added it, wait 15-60 minutes for DNS propagation.`}
                      </AlertDescription>
                    </Alert>
                  )}

                  <p className="text-xs text-muted-foreground">
                    We automatically check these selectors:{" "}
                    {selectedProvider?.dkimSelectors.slice(0, 5).join(", ") || "google, selector1, s1, default, ..."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DMARC Tab */}
        <TabsContent value="dmarc">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>DMARC Record</span>
                <StatusBadge status={selectedDomain?.dmarcStatus || null} />
              </CardTitle>
              <CardDescription>Domain-based Message Authentication protects against email spoofing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dmarcRecord && (
                <div className="space-y-3">
                  <DNSRecordField
                    label="Record Type"
                    value="TXT"
                    onCopy={() => copyToClipboard("TXT", "Record type")}
                  />
                  <DNSRecordField label="Host / Name" value="_dmarc" onCopy={() => copyToClipboard("_dmarc", "Host")} />
                  <DNSRecordField
                    label="Value"
                    value={dmarcRecord.value}
                    onCopy={() => copyToClipboard(dmarcRecord.value, "DMARC record")}
                  />

                  <Alert>
                    <HelpCircle className="h-4 w-4" aria-hidden="true" />
                    <AlertDescription className="text-sm">
                      <strong>DMARC Policies:</strong>
                      <ul className="mt-1 space-y-1 text-xs">
                        <li>
                          <code>p=none</code> - Monitor only (good for testing)
                        </li>
                        <li>
                          <code>p=quarantine</code> - Send suspicious emails to spam
                        </li>
                        <li>
                          <code>p=reject</code> - Block unauthenticated emails
                        </li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diagnostics Panel */}
      <Collapsible open={showDiagnostics} onOpenChange={setShowDiagnostics}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" aria-hidden="true" />
              Diagnostics & Debug Info
            </span>
            {showDiagnostics ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-2">
            <CardContent className="pt-4">
              {lastVerification ? (
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Last Check</p>
                      <p className="font-mono text-xs">
                        {lastVerification.diagnostics?.timestamp
                          ? lastVerification.diagnostics.timestamp.toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">DNS Lookup Time</p>
                      <p className="font-mono text-xs">{lastVerification.diagnostics?.dnsLookupTime || 0}ms</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Selectors Checked</p>
                      <p className="font-mono text-xs">{lastVerification.diagnostics?.selectorsChecked || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">DKIM Selector Found</p>
                      <p className="font-mono text-xs">{lastVerification.dkimSelector || "None"}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Verification Results</p>
                    <div className="space-y-2">
                      {lastVerification.results?.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <div className="flex items-center gap-2">
                            {result.valid ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
                            )}
                            <span className="font-medium">{result.type}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {result.message ? result.message : "No message provided"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Run a verification to see diagnostics</p>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Verify Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium">Ready to verify?</p>
              <p className="text-xs text-muted-foreground">
                {selectedDomain?.verificationAttempts || 0} verification attempts so far
              </p>
            </div>
            <Button onClick={handleVerify} disabled={verifying || !selectedDomainId} size="lg" className="gap-2">
              {verifying ? (
                <>
                  <Spinner />
                  Verifying DNS Records...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Verify DNS Records
                </>
              )}
            </Button>
          </div>

          <Alert className="mt-4">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <AlertDescription className="text-sm">
              DNS changes can take 5 minutes to 48 hours to propagate. If verification fails, wait and try again. Check
              propagation at{" "}
              <a
                href="https://www.whatsmydns.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                whatsmydns.net
              </a>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function DNSRecordField({
  label,
  value,
  hint,
  onCopy,
}: {
  label: string
  value: string
  hint?: string
  onCopy: () => void
}) {
  return (
    <div className="grid gap-2">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <code className="flex-1 rounded bg-muted px-3 py-2 text-sm break-all">{value}</code>
        <Button variant="outline" size="sm" onClick={onCopy} aria-label={`Copy ${label}`}>
          <Copy className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
