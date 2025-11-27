// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { CheckCircle2, XCircle, AlertCircle, Copy, Plus, RefreshCw } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// interface DnsRecord {
//   type: string
//   name: string
//   value: string
//   status: "verified" | "pending" | "failed"
// }

// export function DomainVerification() {
//   const [domain, setDomain] = useState("")
//   const [domains, setDomains] = useState<
//     Array<{
//       domain: string
//       verified: boolean
//       dnsRecords: DnsRecord[]
//     }>
//   >([])
//   const [isVerifying, setIsVerifying] = useState(false)
//   const { toast } = useToast()

//   const addDomain = async () => {
//     if (!domain) return

//     const dnsRecords: DnsRecord[] = [
//       {
//         type: "TXT",
//         name: `_mailfra-verification.${domain}`,
//         value: `mailfra-verification=${Math.random().toString(36).substring(7)}`,
//         status: "pending",
//       },
//       {
//         type: "TXT",
//         name: domain,
//         value: "v=spf1 include:mailfra.io ~all",
//         status: "pending",
//       },
//       {
//         type: "TXT",
//         name: `_dmarc.${domain}`,
//         value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@mailfra.io",
//         status: "pending",
//       },
//       {
//         type: "CNAME",
//         name: `mailfra._domainkey.${domain}`,
//         value: "dkim.mailfra.io",
//         status: "pending",
//       },
//     ]

//     setDomains([...domains, { domain, verified: false, dnsRecords }])
//     setDomain("")

//     toast({
//       title: "Domain added",
//       description: "Add the DNS records below to verify your domain",
//     })
//   }

//   const verifyDomain = async (domainToVerify: string) => {
//     setIsVerifying(true)

//     // Simulate DNS verification
//     setTimeout(() => {
//       setDomains(
//         domains.map((d) => {
//           if (d.domain === domainToVerify) {
//             return {
//               ...d,
//               verified: true,
//               dnsRecords: d.dnsRecords.map((record) => ({
//                 ...record,
//                 status: "verified" as const,
//               })),
//             }
//           }
//           return d
//         }),
//       )

//       toast({
//         title: "Domain verified",
//         description: `${domainToVerify} is now ready to send emails`,
//       })

//       setIsVerifying(false)
//     }, 2000)
//   }

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text)
//     toast({
//       title: "Copied",
//       description: "DNS record copied to clipboard",
//     })
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Domain Verification</CardTitle>
//           <CardDescription>
//             Add and verify your domains for sending emails. Proper DNS configuration ensures maximum deliverability.
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex gap-2">
//             <div className="flex-1">
//               <Label htmlFor="domain">Domain Name</Label>
//               <Input
//                 id="domain"
//                 placeholder="yourdomain.com"
//                 value={domain}
//                 onChange={(e) => setDomain(e.target.value)}
//               />
//             </div>
//             <Button onClick={addDomain} className="mt-auto">
//               <Plus className="h-4 w-4 mr-2" />
//               Add Domain
//             </Button>
//           </div>

//           <Alert>
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>
//               After adding DNS records, it may take up to 48 hours for changes to propagate. Click "Verify" to check
//               status.
//             </AlertDescription>
//           </Alert>
//         </CardContent>
//       </Card>

//       {domains.map((d) => (
//         <Card key={d.domain}>
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle className="flex items-center gap-2">
//                   {d.domain}
//                   {d.verified ? (
//                     <Badge variant="default" className="bg-green-500">
//                       <CheckCircle2 className="h-3 w-3 mr-1" />
//                       Verified
//                     </Badge>
//                   ) : (
//                     <Badge variant="secondary">
//                       <AlertCircle className="h-3 w-3 mr-1" />
//                       Pending
//                     </Badge>
//                   )}
//                 </CardTitle>
//                 <CardDescription>
//                   {d.verified
//                     ? "Your domain is verified and ready to send emails"
//                     : "Add these DNS records to your domain provider"}
//                 </CardDescription>
//               </div>
//               <Button onClick={() => verifyDomain(d.domain)} disabled={isVerifying || d.verified}>
//                 <RefreshCw className={`h-4 w-4 mr-2 ${isVerifying ? "animate-spin" : ""}`} />
//                 {d.verified ? "Verified" : "Verify Domain"}
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div>
//                 <h4 className="font-semibold mb-2">DNS Records</h4>
//                 <div className="space-y-2">
//                   {d.dnsRecords.map((record, index) => (
//                     <div key={index} className="border border-border rounded-lg p-4 space-y-2">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <Badge variant="outline">{record.type}</Badge>
//                           {record.status === "verified" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
//                           {record.status === "pending" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
//                           {record.status === "failed" && <XCircle className="h-4 w-4 text-red-500" />}
//                         </div>
//                         <Button variant="ghost" size="sm" onClick={() => copyToClipboard(record.value)}>
//                           <Copy className="h-4 w-4" />
//                         </Button>
//                       </div>
//                       <div className="space-y-1">
//                         <div className="text-sm">
//                           <span className="text-muted-foreground">Name:</span>
//                           <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">{record.name}</code>
//                         </div>
//                         <div className="text-sm">
//                           <span className="text-muted-foreground">Value:</span>
//                           <code className="ml-2 bg-muted px-2 py-1 rounded text-xs break-all">{record.value}</code>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <Alert>
//                 <AlertDescription className="text-xs">
//                   <strong>What these records do:</strong>
//                   <ul className="list-disc list-inside mt-2 space-y-1">
//                     <li>
//                       <strong>SPF (TXT):</strong> Authorizes mailfra to send emails on your behalf
//                     </li>
//                     <li>
//                       <strong>DKIM (CNAME):</strong> Adds a digital signature to verify email authenticity
//                     </li>
//                     <li>
//                       <strong>DMARC (TXT):</strong> Tells receiving servers how to handle unauthenticated emails
//                     </li>
//                   </ul>
//                 </AlertDescription>
//               </Alert>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )
// }
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
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
              {isAdding ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
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
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
