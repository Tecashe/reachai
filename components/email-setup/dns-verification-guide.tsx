// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Copy, AlertCircle, RefreshCw } from "lucide-react"
// import { toast } from "sonner"

// export function DNSVerificationGuide() {
//   const [domains, setDomains] = useState<any[]>([])
//   const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
//   const [dnsRecords, setDnsRecords] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [verifying, setVerifying] = useState(false)

//   useEffect(() => {
//     fetchDomains()
//   }, [])

//   const fetchDomains = async () => {
//     try {
//       const response = await fetch("/api/domains")
//       const data = await response.json()

//       if (data.success && data.domains.length > 0) {
//         setDomains(data.domains)
//         // Auto-select first unverified domain
//         const unverified = data.domains.find((d: any) => !d.isVerified)
//         if (unverified) {
//           setSelectedDomain(unverified.id)
//           fetchDNSRecords(unverified.id)
//         }
//       }
//     } catch (error) {
//       console.error("Failed to fetch domains:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchDNSRecords = async (domainId: string) => {
//     try {
//       const response = await fetch(`/api/domains/${domainId}`)
//       const data = await response.json()

//       if (data.success) {
//         setDnsRecords(data.domain.dnsRecords)
//       }
//     } catch (error) {
//       console.error("Failed to fetch DNS records:", error)
//     }
//   }

//   const copyToClipboard = (text: string, label: string) => {
//     navigator.clipboard.writeText(text)
//     toast.success(`${label} copied to clipboard`)
//   }

//   const verifyDomain = async (domainId: string) => {
//     const response = await fetch(`/api/domains/${domainId}/verify`, { method: "POST" })
//     const data = await response.json()
//     return data
//   }

//   const handleVerify = async (domainId: string) => {
//     setVerifying(true)
//     try {
//       const result = await verifyDomain(domainId)

//       if (result.verified) {
//         toast.success("DNS records verified successfully!")
//         await fetchDomains()
//       } else {
//         toast.error("Some DNS records are not configured correctly")
//       }
//     } catch (error) {
//       toast.error("Failed to verify DNS records")
//     } finally {
//       setVerifying(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-8">
//         <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
//       </div>
//     )
//   }

//   if (domains.length === 0) {
//     return (
//       <Alert>
//         <AlertCircle className="h-4 w-4" />
//         <AlertDescription>No domains added yet. Please add a domain in the Domain Setup tab first.</AlertDescription>
//       </Alert>
//     )
//   }

//   const currentDomain = domains.find((d) => d.id === selectedDomain)
//   const spfRecord = dnsRecords?.records?.find((r: any) => r.type === "SPF")
//   const dkimRecord = dnsRecords?.records?.find((r: any) => r.type === "DKIM")
//   const dmarcRecord = dnsRecords?.records?.find((r: any) => r.type === "DMARC")

//   return (
//     <div className="space-y-6">
//       {/* Domain Selector */}
//       {domains.length > 1 && (
//         <div className="space-y-2">
//           <Label className="text-sm font-medium">Select Domain</Label>
//           <select
//             className="w-full p-2 border rounded-md"
//             value={selectedDomain || ""}
//             onChange={(e) => {
//               setSelectedDomain(e.target.value)
//               fetchDNSRecords(e.target.value)
//             }}
//           >
//             {domains.map((domain) => (
//               <option key={domain.id} value={domain.id}>
//                 {domain.domain} {domain.isVerified ? "(Verified)" : ""}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       <Alert>
//         <AlertCircle className="h-4 w-4" />
//         <AlertDescription>
//           DNS changes can take up to 48 hours to propagate, but typically complete within 1-2 hours.
//         </AlertDescription>
//       </Alert>

//       <Tabs defaultValue="spf" className="space-y-4">
//         <TabsList className="grid w-full grid-cols-4">
//           <TabsTrigger value="spf">SPF</TabsTrigger>
//           <TabsTrigger value="dkim">DKIM</TabsTrigger>
//           <TabsTrigger value="dmarc">DMARC</TabsTrigger>
//           <TabsTrigger value="mx">MX Records</TabsTrigger>
//         </TabsList>

//         {/* SPF Configuration */}
//         <TabsContent value="spf" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>SPF Record Configuration</CardTitle>
//               <CardDescription>
//                 Sender Policy Framework (SPF) prevents email spoofing by specifying which servers can send email from
//                 your domain.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">Record Type</Label>
//                 <div className="flex items-center gap-2">
//                   <code className="flex-1 bg-muted p-3 rounded-md text-sm">TXT</code>
//                   <Button variant="outline" size="sm" onClick={() => copyToClipboard("TXT", "Record type")}>
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">Host/Name</Label>
//                 <div className="flex items-center gap-2">
//                   <code className="flex-1 bg-muted p-3 rounded-md text-sm">@</code>
//                   <Button variant="outline" size="sm" onClick={() => copyToClipboard("@", "Host")}>
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">Value</Label>
//                 <div className="flex items-center gap-2">
//                   <code className="flex-1 bg-muted p-3 rounded-md text-sm break-all">
//                     {spfRecord?.value || "v=spf1 include:_spf.reachai.com ~all"}
//                   </code>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() =>
//                       copyToClipboard(spfRecord?.value || "v=spf1 include:_spf.reachai.com ~all", "SPF record")
//                     }
//                   >
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <Alert>
//                 <AlertDescription className="text-sm">
//                   <strong>Note:</strong> If you already have an SPF record, add <code>include:_spf.reachai.com</code> to
//                   your existing record instead of creating a new one.
//                 </AlertDescription>
//               </Alert>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* DKIM Configuration */}
//         <TabsContent value="dkim" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>DKIM Record Configuration</CardTitle>
//               <CardDescription>
//                 DomainKeys Identified Mail (DKIM) adds a digital signature to your emails to verify authenticity.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">Record Type</Label>
//                 <div className="flex items-center gap-2">
//                   <code className="flex-1 bg-muted p-3 rounded-md text-sm">TXT</code>
//                   <Button variant="outline" size="sm" onClick={() => copyToClipboard("TXT", "Record type")}>
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">Host/Name</Label>
//                 <div className="flex items-center gap-2">
//                   <code className="flex-1 bg-muted p-3 rounded-md text-sm">reachai._domainkey</code>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => copyToClipboard("reachai._domainkey", "DKIM host")}
//                   >
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">Value</Label>
//                 <div className="flex items-center gap-2">
//                   <code className="flex-1 bg-muted p-3 rounded-md text-sm break-all">
//                     {dkimRecord?.value || "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC..."}
//                   </code>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => copyToClipboard(dkimRecord?.value || "v=DKIM1; k=rsa; p=...", "DKIM record")}
//                   >
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <Alert>
//                 <AlertDescription className="text-sm">
//                   Each domain gets a unique DKIM key. Make sure to use the exact value provided for your domain.
//                 </AlertDescription>
//               </Alert>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* DMARC Configuration */}
//         <TabsContent value="dmarc" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>DMARC Record Configuration</CardTitle>
//               <CardDescription>
//                 DMARC (Domain-based Message Authentication, Reporting & Conformance) tells receiving servers how to
//                 handle unauthenticated emails.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">Record Type</Label>
//                 <div className="flex items-center gap-2">
//                   <code className="flex-1 bg-muted p-3 rounded-md text-sm">TXT</code>
//                   <Button variant="outline" size="sm" onClick={() => copyToClipboard("TXT", "Record type")}>
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">Host/Name</Label>
//                 <div className="flex items-center gap-2">
//                   <code className="flex-1 bg-muted p-3 rounded-md text-sm">_dmarc</code>
//                   <Button variant="outline" size="sm" onClick={() => copyToClipboard("_dmarc", "DMARC host")}>
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">Value (Recommended)</Label>
//                 <div className="flex items-center gap-2">
//                   <code className="flex-1 bg-muted p-3 rounded-md text-sm break-all">
//                     {dmarcRecord?.value || "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"}
//                   </code>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() =>
//                       copyToClipboard(
//                         dmarcRecord?.value || "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com",
//                         "DMARC record",
//                       )
//                     }
//                   >
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <Alert>
//                 <AlertDescription className="text-sm space-y-2">
//                   <div>
//                     <strong>Policy Options:</strong>
//                   </div>
//                   <ul className="list-disc list-inside space-y-1 ml-2">
//                     <li>
//                       <code>p=none</code> - Monitor only (recommended for testing)
//                     </li>
//                     <li>
//                       <code>p=quarantine</code> - Send suspicious emails to spam
//                     </li>
//                     <li>
//                       <code>p=reject</code> - Block unauthenticated emails completely
//                     </li>
//                   </ul>
//                 </AlertDescription>
//               </Alert>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* MX Records */}
//         <TabsContent value="mx" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>MX Record Configuration</CardTitle>
//               <CardDescription>
//                 Mail Exchange (MX) records route email to your mail server. Only needed if you want to receive emails at
//                 this domain.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <Alert>
//                 <AlertDescription>
//                   <strong>Optional:</strong> MX records are only required if you plan to receive emails at this domain.
//                   For sending-only domains, you can skip this step.
//                 </AlertDescription>
//               </Alert>

//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label className="text-sm font-medium">Priority 10</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 bg-muted p-3 rounded-md text-sm">mx1.reachai.com</code>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => copyToClipboard("mx1.reachai.com", "MX record 1")}
//                     >
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-sm font-medium">Priority 20</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 bg-muted p-3 rounded-md text-sm">mx2.reachai.com</code>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => copyToClipboard("mx2.reachai.com", "MX record 2")}
//                     >
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       <div className="flex justify-end">
//         <Button onClick={() => selectedDomain && handleVerify(selectedDomain)} disabled={verifying}>
//           {verifying && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
//           Verify DNS Records
//         </Button>
//       </div>
//     </div>
//   )
// }

// function Label({ children, className }: { children: React.ReactNode; className?: string }) {
//   return <label className={className}>{children}</label>
// }


"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, AlertCircle, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export function DNSVerificationGuide() {
  const [domains, setDomains] = useState<any[]>([])
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [dnsRecords, setDnsRecords] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    fetchDomains()
  }, [])

  const fetchDomains = async () => {
    try {
      const response = await fetch("/api/domains")
      const data = await response.json()

      if (data.success && data.domains.length > 0) {
        setDomains(data.domains)
        // Auto-select first unverified domain
        const unverified = data.domains.find((d: any) => !d.isVerified)
        if (unverified) {
          setSelectedDomain(unverified.id)
          fetchDNSRecords(unverified.id)
        }
      }
    } catch (error) {
      console.error("Failed to fetch domains:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDNSRecords = async (domainId: string) => {
    try {
      const response = await fetch(`/api/domains/${domainId}`)
      const data = await response.json()

      if (data.success) {
        setDnsRecords(data.domain.dnsRecords)
      }
    } catch (error) {
      console.error("Failed to fetch DNS records:", error)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied!", {
      description: `${label} copied to clipboard`,
      duration: 2000,
    })
  }

  const verifyDomain = async (domainId: string) => {
    const response = await fetch(`/api/domains/${domainId}/verify`, { method: "POST" })
    const data = await response.json()
    return data
  }

  const handleVerify = async (domainId: string) => {
    setVerifying(true)
    try {
      const result = await verifyDomain(domainId)

      if (result.verified) {
        toast.success("DNS records verified successfully!")
        await fetchDomains()
      } else {
        toast.error("Some DNS records are not configured correctly")
      }
    } catch (error) {
      toast.error("Failed to verify DNS records")
    } finally {
      setVerifying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (domains.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No domains added yet. Please add a domain in the Domain Setup tab first.</AlertDescription>
      </Alert>
    )
  }

  const currentDomain = domains.find((d) => d.id === selectedDomain)
  const spfRecord = dnsRecords?.records?.find((r: any) => r.type === "SPF")
  const dkimRecord = dnsRecords?.records?.find((r: any) => r.type === "DKIM")
  const dmarcRecord = dnsRecords?.records?.find((r: any) => r.type === "DMARC")

  return (
    <div className="space-y-6">
      {/* Domain Selector */}
      {domains.length > 1 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Select Domain</Label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedDomain || ""}
            onChange={(e) => {
              setSelectedDomain(e.target.value)
              fetchDNSRecords(e.target.value)
            }}
          >
            {domains.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.domain} {domain.isVerified ? "(Verified)" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          DNS changes can take up to 48 hours to propagate, but typically complete within 1-2 hours.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="spf" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="spf">SPF</TabsTrigger>
          <TabsTrigger value="dkim">DKIM</TabsTrigger>
          <TabsTrigger value="dmarc">DMARC</TabsTrigger>
          <TabsTrigger value="mx">MX Records</TabsTrigger>
        </TabsList>

        {/* SPF Configuration */}
        <TabsContent value="spf" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SPF Record Configuration</CardTitle>
              <CardDescription>
                Sender Policy Framework (SPF) prevents email spoofing by specifying which servers can send email from
                your domain.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Record Type</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted p-3 rounded-md text-sm">TXT</code>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard("TXT", "Record type")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Host/Name</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted p-3 rounded-md text-sm">@</code>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard("@", "Host")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Value</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted p-3 rounded-md text-sm break-all">
                    {spfRecord?.value || "v=spf1 include:_spf.reachai.com ~all"}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(spfRecord?.value || "v=spf1 include:_spf.reachai.com ~all", "SPF record")
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  <strong>Note:</strong> If you already have an SPF record, add <code>include:_spf.reachai.com</code> to
                  your existing record instead of creating a new one.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DKIM Configuration */}
        <TabsContent value="dkim" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DKIM Record Configuration</CardTitle>
              <CardDescription>
                DomainKeys Identified Mail (DKIM) adds a digital signature to your emails to verify authenticity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Record Type</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted p-3 rounded-md text-sm">TXT</code>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard("TXT", "Record type")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Host/Name</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted p-3 rounded-md text-sm">reachai._domainkey</code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("reachai._domainkey", "DKIM host")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Value</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted p-3 rounded-md text-sm break-all">
                    {dkimRecord?.value || "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC..."}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(dkimRecord?.value || "v=DKIM1; k=rsa; p=...", "DKIM record")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  Each domain gets a unique DKIM key. Make sure to use the exact value provided for your domain.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DMARC Configuration */}
        <TabsContent value="dmarc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DMARC Record Configuration</CardTitle>
              <CardDescription>
                DMARC (Domain-based Message Authentication, Reporting & Conformance) tells receiving servers how to
                handle unauthenticated emails.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Record Type</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted p-3 rounded-md text-sm">TXT</code>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard("TXT", "Record type")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Host/Name</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted p-3 rounded-md text-sm">_dmarc</code>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard("_dmarc", "DMARC host")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Value (Recommended)</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted p-3 rounded-md text-sm break-all">
                    {dmarcRecord?.value || "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        dmarcRecord?.value || "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com",
                        "DMARC record",
                      )
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Alert>
                <AlertDescription className="text-sm space-y-2">
                  <div>
                    <strong>Policy Options:</strong>
                  </div>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      <code>p=none</code> - Monitor only (recommended for testing)
                    </li>
                    <li>
                      <code>p=quarantine</code> - Send suspicious emails to spam
                    </li>
                    <li>
                      <code>p=reject</code> - Block unauthenticated emails completely
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MX Records */}
        <TabsContent value="mx" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>MX Record Configuration</CardTitle>
              <CardDescription>
                Mail Exchange (MX) records route email to your mail server. Only needed if you want to receive emails at
                this domain.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  <strong>Optional:</strong> MX records are only required if you plan to receive emails at this domain.
                  For sending-only domains, you can skip this step.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Priority 10</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-muted p-3 rounded-md text-sm">mx1.reachai.com</code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard("mx1.reachai.com", "MX record 1")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Priority 20</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-muted p-3 rounded-md text-sm">mx2.reachai.com</code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard("mx2.reachai.com", "MX record 2")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={() => selectedDomain && handleVerify(selectedDomain)} disabled={verifying}>
          {verifying && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
          Verify DNS Records
        </Button>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
