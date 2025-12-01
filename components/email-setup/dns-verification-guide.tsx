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
//                     {spfRecord?.value || "v=spf1 include:_spf.mailfra.com ~all"}
//                   </code>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() =>
//                       copyToClipboard(spfRecord?.value || "v=spf1 include:_spf.mailfra.com ~all", "SPF record")
//                     }
//                   >
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <Alert>
//                 <AlertDescription className="text-sm">
//                   <strong>Note:</strong> If you already have an SPF record, add <code>include:_spf.mailfra.com</code> to
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
//                   <code className="flex-1 bg-muted p-3 rounded-md text-sm">mailfra._domainkey</code>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => copyToClipboard("mailfra._domainkey", "DKIM host")}
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
//                     <code className="flex-1 bg-muted p-3 rounded-md text-sm">mx1.mailfra.com</code>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => copyToClipboard("mx1.mailfra.com", "MX record 1")}
//                     >
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-sm font-medium">Priority 20</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 bg-muted p-3 rounded-md text-sm">mx2.mailfra.com</code>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => copyToClipboard("mx2.mailfra.com", "MX record 2")}
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
//     toast.success("Copied!", {
//       description: `${label} copied to clipboard`,
//       duration: 2000,
//     })
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
//                     {spfRecord?.value || "v=spf1 include:_spf.mailfra.com ~all"}
//                   </code>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() =>
//                       copyToClipboard(spfRecord?.value || "v=spf1 include:_spf.mailfra.com ~all", "SPF record")
//                     }
//                   >
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <Alert>
//                 <AlertDescription className="text-sm">
//                   <strong>Note:</strong> If you already have an SPF record, add <code>include:_spf.mailfra.com</code> to
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
//                   <code className="flex-1 bg-muted p-3 rounded-md text-sm">mailfra._domainkey</code>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => copyToClipboard("mailfra._domainkey", "DKIM host")}
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
//                     <code className="flex-1 bg-muted p-3 rounded-md text-sm">mx1.mailfra.com</code>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => copyToClipboard("mx1.mailfra.com", "MX record 1")}
//                     >
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-sm font-medium">Priority 20</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 bg-muted p-3 rounded-md text-sm">mx2.mailfra.com</code>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => copyToClipboard("mx2.mailfra.com", "MX record 2")}
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


// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Progress } from "@/components/ui/progress"
// import { Separator } from "@/components/ui/separator"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import {
//   Copy,
//   AlertCircle,
//   RefreshCw,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   ExternalLink,
//   ChevronDown,
//   ChevronRight,
//   Search,
//   HelpCircle,
//   Zap,
//   Shield,
//   Mail,
//   Server,
// } from "lucide-react"
// import { toast } from "sonner"
// import { verifyDomain, checkDKIMSelector, updateDomainProvider, getProviders } from "@/lib/actions/domain-action"
// import { cn } from "@/lib/utils"

// // =============================================================================
// // TYPES
// // =============================================================================

// interface DomainStatus {
//   id: string
//   domain: string
//   isVerified: boolean
//   emailProviderId?: string
//   dkimSelector?: string
//   spfStatus: string | null
//   dkimStatus: string | null
//   dmarcStatus: string | null
//   mxStatus: string | null
//   healthScore: number
//   lastVerificationCheck?: Date
//   verificationAttempts: number
// }

// interface EmailProvider {
//   id: string
//   name: string
//   icon: string
//   dkimSelectors: string[]
//   spfInclude: string
//   setupUrl: string
//   instructions: string[]
//   estimatedTime: string
// }

// interface DNSRecord {
//   type: string
//   name: string
//   value: string
//   selector?: string
// }

// // =============================================================================
// // PROVIDER ICONS
// // =============================================================================

// const ProviderIcon = ({ provider, className }: { provider: string; className?: string }) => {
//   const icons: Record<string, React.ReactNode> = {
//     google: (
//       <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)}>
//         <path
//           fill="#4285F4"
//           d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//         />
//         <path
//           fill="#34A853"
//           d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//         />
//         <path
//           fill="#FBBC05"
//           d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//         />
//         <path
//           fill="#EA4335"
//           d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//         />
//       </svg>
//     ),
//     microsoft: (
//       <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)}>
//         <path fill="#F25022" d="M1 1h10v10H1z" />
//         <path fill="#00A4EF" d="M1 13h10v10H1z" />
//         <path fill="#7FBA00" d="M13 1h10v10H13z" />
//         <path fill="#FFB900" d="M13 13h10v10H13z" />
//       </svg>
//     ),
//     sendgrid: <Mail className={cn("h-5 w-5 text-blue-500", className)} />,
//     mailgun: <Mail className={cn("h-5 w-5 text-red-500", className)} />,
//     aws: <Server className={cn("h-5 w-5 text-orange-500", className)} />,
//     zoho: <Mail className={cn("h-5 w-5 text-green-600", className)} />,
//     server: <Server className={cn("h-5 w-5 text-muted-foreground", className)} />,
//   }
//   return <>{icons[provider] || icons.server}</>
// }

// // =============================================================================
// // MAIN COMPONENT
// // =============================================================================

// export function DNSVerificationGuide() {
//   const [domains, setDomains] = useState<DomainStatus[]>([])
//   const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null)
//   const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([])
//   const [providers, setProviders] = useState<EmailProvider[]>([])
//   const [loading, setLoading] = useState(true)
//   const [verifying, setVerifying] = useState(false)
//   const [lastVerification, setLastVerification] = useState<any>(null)

//   // Custom selector state
//   const [customSelector, setCustomSelector] = useState("")
//   const [checkingSelector, setCheckingSelector] = useState(false)
//   const [selectorResult, setSelectorResult] = useState<{
//     found: boolean
//     valid: boolean
//     record?: string
//   } | null>(null)

//   // Diagnostics panel
//   const [showDiagnostics, setShowDiagnostics] = useState(false)

//   // =============================================================================
//   // DATA FETCHING
//   // =============================================================================

//   useEffect(() => {
//     fetchDomains()
//     fetchProviders()
//   }, [])

//   const fetchDomains = async () => {
//     try {
//       const response = await fetch("/api/domains")
//       const data = await response.json()

//       if (data.success && data.domains.length > 0) {
//         setDomains(data.domains)
//         const unverified = data.domains.find((d: DomainStatus) => !d.isVerified)
//         if (unverified) {
//           setSelectedDomainId(unverified.id)
//           fetchDNSRecords(unverified.id)
//         } else if (data.domains[0]) {
//           setSelectedDomainId(data.domains[0].id)
//           fetchDNSRecords(data.domains[0].id)
//         }
//       }
//     } catch (error) {
//       console.error("Failed to fetch domains:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchProviders = async () => {
//     try {
//       const providerList = await getProviders()
//       setProviders(providerList)
//     } catch (error) {
//       console.error("Failed to fetch providers:", error)
//     }
//   }

//   const fetchDNSRecords = async (domainId: string) => {
//     try {
//       const response = await fetch(`/api/domains/${domainId}`)
//       const data = await response.json()
//       if (data.success && data.domain?.dnsRecords?.records) {
//         setDnsRecords(data.domain.dnsRecords.records)
//       }
//     } catch (error) {
//       console.error("Failed to fetch DNS records:", error)
//     }
//   }

//   // =============================================================================
//   // ACTIONS
//   // =============================================================================

//   const handleVerify = async () => {
//     if (!selectedDomainId) return

//     setVerifying(true)
//     setSelectorResult(null)

//     try {
//       const result = await verifyDomain(selectedDomainId, customSelector || undefined)
//       setLastVerification(result)

//       if (result.verified) {
//         toast.success("Domain verified successfully!", {
//           description: `Health score: ${result.healthScore}%`,
//         })
//       } else {
//         const failedRecords = result.results.filter((r: any) => !r.valid)
//         toast.error("Some DNS records need attention", {
//           description: failedRecords.map((r: any) => r.type).join(", ") + " not configured",
//         })
//       }

//       await fetchDomains()
//     } catch (error) {
//       toast.error("Verification failed", {
//         description: error instanceof Error ? error.message : "Please try again",
//       })
//     } finally {
//       setVerifying(false)
//     }
//   }

//   const handleCheckCustomSelector = async () => {
//     if (!selectedDomainId || !customSelector.trim()) return

//     setCheckingSelector(true)
//     try {
//       const result = await checkDKIMSelector(selectedDomainId, customSelector.trim())
//       setSelectorResult(result)

//       if (result.valid) {
//         toast.success("DKIM selector found!", {
//           description: `Selector "${customSelector}" is valid`,
//         })
//         await fetchDomains()
//       } else if (result.found) {
//         toast.warning("Selector found but may be invalid", {
//           description: "The record exists but might be misconfigured",
//         })
//       } else {
//         toast.error("Selector not found", {
//           description: `No DKIM record at ${customSelector}._domainkey`,
//         })
//       }
//     } catch (error) {
//       toast.error("Failed to check selector")
//     } finally {
//       setCheckingSelector(false)
//     }
//   }

//   const handleProviderChange = async (providerId: string) => {
//     if (!selectedDomainId) return

//     try {
//       const result = await updateDomainProvider(selectedDomainId, providerId)
//       if (result.success) {
//         toast.success("Email provider updated")
//         await fetchDomains()
//         await fetchDNSRecords(selectedDomainId)
//       }
//     } catch (error) {
//       toast.error("Failed to update provider")
//     }
//   }

//   const copyToClipboard = (text: string, label: string) => {
//     navigator.clipboard.writeText(text)
//     toast.success("Copied!", { description: `${label} copied to clipboard` })
//   }

//   // =============================================================================
//   // COMPUTED VALUES
//   // =============================================================================

//   const selectedDomain = domains.find((d) => d.id === selectedDomainId)
//   const selectedProvider = providers.find((p) => p.id === selectedDomain?.emailProviderId)
//   const spfRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "@")
//   const dmarcRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "_dmarc")

//   // Calculate verification progress
//   const getVerificationProgress = () => {
//     if (!selectedDomain) return 0
//     let progress = 0
//     if (selectedDomain.spfStatus === "VALID") progress += 30
//     if (selectedDomain.dkimStatus === "VALID") progress += 35
//     if (selectedDomain.dmarcStatus === "VALID") progress += 25
//     if (selectedDomain.mxStatus === "VALID") progress += 10
//     return progress
//   }

//   // =============================================================================
//   // RENDER HELPERS
//   // =============================================================================

//   const StatusBadge = ({ status }: { status: string | null }) => {
//     if (status === "VALID") {
//       return (
//         <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
//           <CheckCircle2 className="mr-1 h-3 w-3" />
//           Verified
//         </Badge>
//       )
//     }
//     if (status === "INVALID") {
//       return (
//         <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-500/20">
//           <XCircle className="mr-1 h-3 w-3" />
//           Invalid
//         </Badge>
//       )
//     }
//     return (
//       <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
//         <Clock className="mr-1 h-3 w-3" />
//         Pending
//       </Badge>
//     )
//   }

//   // =============================================================================
//   // LOADING STATE
//   // =============================================================================

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center space-y-3">
//           <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
//           <p className="text-sm text-muted-foreground">Loading domain configuration...</p>
//         </div>
//       </div>
//     )
//   }

//   // =============================================================================
//   // EMPTY STATE
//   // =============================================================================

//   if (domains.length === 0) {
//     return (
//       <Card>
//         <CardContent className="pt-6">
//           <div className="text-center py-8">
//             <Server className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">No Domains Added</h3>
//             <p className="text-sm text-muted-foreground mb-4">
//               Add a domain in the Domain Setup tab to get started with DNS configuration.
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   // =============================================================================
//   // MAIN RENDER
//   // =============================================================================

//   return (
//     <div className="space-y-6">
//       {/* Domain Selector & Progress */}
//       <Card>
//         <CardHeader className="pb-3">
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle className="text-lg">DNS Configuration</CardTitle>
//               <CardDescription>Configure email authentication for your domain</CardDescription>
//             </div>
//             {selectedDomain && (
//               <div className="text-right">
//                 <p className="text-2xl font-bold">{selectedDomain.healthScore || 0}%</p>
//                 <p className="text-xs text-muted-foreground">Health Score</p>
//               </div>
//             )}
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {/* Domain Selector */}
//           {domains.length > 1 && (
//             <div className="space-y-2">
//               <Label className="text-sm font-medium">Select Domain</Label>
//               <select
//                 className="w-full p-2 border rounded-md bg-background"
//                 value={selectedDomainId || ""}
//                 onChange={(e) => {
//                   setSelectedDomainId(e.target.value)
//                   fetchDNSRecords(e.target.value)
//                   setLastVerification(null)
//                   setSelectorResult(null)
//                 }}
//               >
//                 {domains.map((domain) => (
//                   <option key={domain.id} value={domain.id}>
//                     {domain.domain} {domain.isVerified ? "✓" : ""}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {/* Progress Bar */}
//           <div className="space-y-2">
//             <div className="flex items-center justify-between text-sm">
//               <span className="font-medium">Verification Progress</span>
//               <span className="text-muted-foreground">{getVerificationProgress()}% complete</span>
//             </div>
//             <Progress value={getVerificationProgress()} className="h-2" />
//           </div>

//           {/* Status Grid */}
//           {selectedDomain && (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//               <div className="p-3 rounded-lg border bg-card">
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="text-xs font-medium text-muted-foreground">SPF</span>
//                   <StatusBadge status={selectedDomain.spfStatus} />
//                 </div>
//                 <p className="text-xs text-muted-foreground">Sender authorization</p>
//               </div>
//               <div className="p-3 rounded-lg border bg-card">
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="text-xs font-medium text-muted-foreground">DKIM</span>
//                   <StatusBadge status={selectedDomain.dkimStatus} />
//                 </div>
//                 <p className="text-xs text-muted-foreground">Email signatures</p>
//               </div>
//               <div className="p-3 rounded-lg border bg-card">
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="text-xs font-medium text-muted-foreground">DMARC</span>
//                   <StatusBadge status={selectedDomain.dmarcStatus} />
//                 </div>
//                 <p className="text-xs text-muted-foreground">Policy enforcement</p>
//               </div>
//               <div className="p-3 rounded-lg border bg-card">
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="text-xs font-medium text-muted-foreground">MX</span>
//                   <StatusBadge status={selectedDomain.mxStatus} />
//                 </div>
//                 <p className="text-xs text-muted-foreground">Mail routing (optional)</p>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Email Provider Selection */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg flex items-center gap-2">
//             <Mail className="h-5 w-5" />
//             Email Provider
//           </CardTitle>
//           <CardDescription>
//             Select your email provider to get the correct DKIM selectors and setup instructions
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             {providers.map((provider) => (
//               <button
//                 key={provider.id}
//                 onClick={() => handleProviderChange(provider.id)}
//                 className={cn(
//                   "p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50",
//                   selectedDomain?.emailProviderId === provider.id ? "border-primary bg-primary/5" : "border-border",
//                 )}
//               >
//                 <div className="flex items-center gap-2 mb-2">
//                   <ProviderIcon provider={provider.icon} />
//                   <span className="font-medium text-sm">{provider.name}</span>
//                 </div>
//                 <p className="text-xs text-muted-foreground">{provider.estimatedTime}</p>
//               </button>
//             ))}
//           </div>

//           {/* Provider Instructions */}
//           {selectedProvider && (
//             <div className="mt-4 p-4 rounded-lg bg-muted/50 border">
//               <div className="flex items-start justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <ProviderIcon provider={selectedProvider.icon} />
//                   <span className="font-semibold">{selectedProvider.name} Setup</span>
//                 </div>
//                 {selectedProvider.setupUrl && (
//                   <Button variant="outline" size="sm" asChild>
//                     <a href={selectedProvider.setupUrl} target="_blank" rel="noopener noreferrer">
//                       Open {selectedProvider.name}
//                       <ExternalLink className="ml-1 h-3 w-3" />
//                     </a>
//                   </Button>
//                 )}
//               </div>

//               <Alert className="mb-4 border-amber-500/20 bg-amber-500/5">
//                 <Zap className="h-4 w-4 text-amber-500" />
//                 <AlertTitle className="text-amber-600">Important: Complete DKIM Setup First</AlertTitle>
//                 <AlertDescription className="text-amber-600/80">
//                   You must complete domain authentication in {selectedProvider.name} before the DKIM verification will
//                   pass. Follow these steps:
//                 </AlertDescription>
//               </Alert>

//               <ol className="space-y-2 text-sm">
//                 {selectedProvider.instructions.map((instruction, index) => (
//                   <li key={index} className="flex gap-3">
//                     <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
//                       {index + 1}
//                     </span>
//                     <span className="text-muted-foreground pt-0.5">{instruction}</span>
//                   </li>
//                 ))}
//               </ol>

//               <Separator className="my-4" />

//               <div className="text-xs text-muted-foreground">
//                 <strong>DKIM Selectors we check:</strong> {selectedProvider.dkimSelectors.slice(0, 3).join(", ")}
//                 {selectedProvider.dkimSelectors.length > 3 && ` +${selectedProvider.dkimSelectors.length - 3} more`}
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* DNS Records Configuration */}
//       <Tabs defaultValue="spf" className="space-y-4">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="spf" className="gap-2">
//             <Shield className="h-4 w-4" />
//             SPF
//           </TabsTrigger>
//           <TabsTrigger value="dkim" className="gap-2">
//             <Mail className="h-4 w-4" />
//             DKIM
//           </TabsTrigger>
//           <TabsTrigger value="dmarc" className="gap-2">
//             <Shield className="h-4 w-4" />
//             DMARC
//           </TabsTrigger>
//         </TabsList>

//         {/* SPF Tab */}
//         <TabsContent value="spf">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>SPF Record</span>
//                 <StatusBadge status={selectedDomain?.spfStatus || null} />
//               </CardTitle>
//               <CardDescription>
//                 Sender Policy Framework authorizes which servers can send email from your domain
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {spfRecord && (
//                 <div className="space-y-3">
//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Record Type</Label>
//                     <code className="rounded bg-muted px-3 py-2 text-sm">TXT</code>
//                   </div>

//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Host / Name</Label>
//                     <div className="flex items-center gap-2">
//                       <code className="flex-1 rounded bg-muted px-3 py-2 text-sm">@</code>
//                       <Button variant="outline" size="sm" onClick={() => copyToClipboard("@", "Host")}>
//                         <Copy className="h-4 w-4" />
//                       </Button>
//                     </div>
//                     <p className="text-xs text-muted-foreground">Use @ or leave blank for root domain</p>
//                   </div>

//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Value</Label>
//                     <div className="flex items-center gap-2">
//                       <code className="flex-1 rounded bg-muted px-3 py-2 text-sm break-all">{spfRecord.value}</code>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => copyToClipboard(spfRecord.value, "SPF record")}
//                       >
//                         <Copy className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>

//                   <Alert>
//                     <HelpCircle className="h-4 w-4" />
//                     <AlertDescription className="text-sm">
//                       <strong>Already have an SPF record?</strong> Add{" "}
//                       <code className="bg-muted px-1 rounded">
//                         {selectedProvider?.spfInclude || "include:your-provider.com"}
//                       </code>{" "}
//                       to your existing record instead of replacing it.
//                     </AlertDescription>
//                   </Alert>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* DKIM Tab */}
//         <TabsContent value="dkim">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>DKIM Configuration</span>
//                 <StatusBadge status={selectedDomain?.dkimStatus || null} />
//               </CardTitle>
//               <CardDescription>
//                 DomainKeys Identified Mail adds a digital signature to verify email authenticity
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {/* DKIM Warning */}
//               <Alert className="border-blue-500/20 bg-blue-500/5">
//                 <AlertCircle className="h-4 w-4 text-blue-500" />
//                 <AlertTitle className="text-blue-600">DKIM is configured in your email provider</AlertTitle>
//                 <AlertDescription className="text-blue-600/80">
//                   Unlike SPF and DMARC, DKIM records are generated by your email provider (
//                   {selectedProvider?.name || "Google, Microsoft, etc."}). You must complete domain authentication there
//                   first, then we can verify the record exists.
//                 </AlertDescription>
//               </Alert>

//               {/* Found Selector Display */}
//               {selectedDomain?.dkimSelector && (
//                 <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
//                   <div className="flex items-center gap-2 mb-2">
//                     <CheckCircle2 className="h-5 w-5 text-green-500" />
//                     <span className="font-medium text-green-600">DKIM Verified</span>
//                   </div>
//                   <p className="text-sm text-muted-foreground">
//                     Found valid DKIM with selector:{" "}
//                     <code className="bg-muted px-1 rounded">{selectedDomain.dkimSelector}</code>
//                   </p>
//                 </div>
//               )}

//               {/* Manual Selector Check */}
//               {selectedDomain?.dkimStatus !== "VALID" && (
//                 <div className="space-y-3">
//                   <Separator />

//                   <div className="space-y-2">
//                     <Label className="text-sm font-medium">Check Custom Selector</Label>
//                     <p className="text-xs text-muted-foreground">
//                       If you know your DKIM selector (from your email provider), enter it here to verify:
//                     </p>
//                     <div className="flex gap-2">
//                       <Input
//                         placeholder="e.g., google, selector1, s1"
//                         value={customSelector}
//                         onChange={(e) => setCustomSelector(e.target.value)}
//                         className="flex-1"
//                       />
//                       <Button
//                         variant="outline"
//                         onClick={handleCheckCustomSelector}
//                         disabled={checkingSelector || !customSelector.trim()}
//                       >
//                         {checkingSelector ? (
//                           <RefreshCw className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <Search className="h-4 w-4" />
//                         )}
//                         <span className="ml-2">Check</span>
//                       </Button>
//                     </div>

//                     {selectorResult && (
//                       <Alert
//                         className={
//                           selectorResult.valid ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"
//                         }
//                       >
//                         {selectorResult.valid ? (
//                           <CheckCircle2 className="h-4 w-4 text-green-500" />
//                         ) : (
//                           <XCircle className="h-4 w-4 text-red-500" />
//                         )}
//                         <AlertDescription>
//                           {selectorResult.valid
//                             ? `DKIM record found at ${customSelector}._domainkey.${selectedDomain?.domain}`
//                             : selectorResult.found
//                               ? "Record exists but may be misconfigured"
//                               : `No DKIM record found at ${customSelector}._domainkey.${selectedDomain?.domain}`}
//                         </AlertDescription>
//                       </Alert>
//                     )}
//                   </div>

//                   <p className="text-xs text-muted-foreground">
//                     We automatically check these selectors:{" "}
//                     {selectedProvider?.dkimSelectors.slice(0, 5).join(", ") || "google, selector1, s1, default, ..."}
//                   </p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* DMARC Tab */}
//         <TabsContent value="dmarc">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>DMARC Record</span>
//                 <StatusBadge status={selectedDomain?.dmarcStatus || null} />
//               </CardTitle>
//               <CardDescription>Domain-based Message Authentication protects against email spoofing</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {dmarcRecord && (
//                 <div className="space-y-3">
//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Record Type</Label>
//                     <code className="rounded bg-muted px-3 py-2 text-sm">TXT</code>
//                   </div>

//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Host / Name</Label>
//                     <div className="flex items-center gap-2">
//                       <code className="flex-1 rounded bg-muted px-3 py-2 text-sm">_dmarc</code>
//                       <Button variant="outline" size="sm" onClick={() => copyToClipboard("_dmarc", "Host")}>
//                         <Copy className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Value</Label>
//                     <div className="flex items-center gap-2">
//                       <code className="flex-1 rounded bg-muted px-3 py-2 text-sm break-all">{dmarcRecord.value}</code>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => copyToClipboard(dmarcRecord.value, "DMARC record")}
//                       >
//                         <Copy className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>

//                   <Alert>
//                     <HelpCircle className="h-4 w-4" />
//                     <AlertDescription className="text-sm">
//                       <strong>DMARC Policies:</strong>
//                       <ul className="mt-1 space-y-1 text-xs">
//                         <li>
//                           <code>p=none</code> - Monitor only (good for testing)
//                         </li>
//                         <li>
//                           <code>p=quarantine</code> - Send suspicious emails to spam
//                         </li>
//                         <li>
//                           <code>p=reject</code> - Block unauthenticated emails
//                         </li>
//                       </ul>
//                     </AlertDescription>
//                   </Alert>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Diagnostics Panel */}
//       <Collapsible open={showDiagnostics} onOpenChange={setShowDiagnostics}>
//         <CollapsibleTrigger asChild>
//           <Button variant="ghost" className="w-full justify-between">
//             <span className="flex items-center gap-2">
//               <Search className="h-4 w-4" />
//               Diagnostics & Debug Info
//             </span>
//             {showDiagnostics ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
//           </Button>
//         </CollapsibleTrigger>
//         <CollapsibleContent>
//           <Card className="mt-2">
//             <CardContent className="pt-4">
//               {lastVerification ? (
//                 <div className="space-y-4 text-sm">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-xs text-muted-foreground mb-1">Last Check</p>
//                       <p className="font-mono text-xs">
//                         {lastVerification.diagnostics?.timestamp
//                           ? new Date(lastVerification.diagnostics.timestamp).toLocaleString()
//                           : "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground mb-1">DNS Lookup Time</p>
//                       <p className="font-mono text-xs">{lastVerification.diagnostics?.dnsLookupTime || 0}ms</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground mb-1">Selectors Checked</p>
//                       <p className="font-mono text-xs">{lastVerification.diagnostics?.selectorsChecked || 0}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground mb-1">DKIM Selector Found</p>
//                       <p className="font-mono text-xs">{lastVerification.dkimSelector || "None"}</p>
//                     </div>
//                   </div>

//                   <Separator />

//                   <div>
//                     <p className="text-xs text-muted-foreground mb-2">Verification Results</p>
//                     <div className="space-y-2">
//                       {lastVerification.results?.map((result: any, index: number) => (
//                         <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/50">
//                           <div className="flex items-center gap-2">
//                             {result.valid ? (
//                               <CheckCircle2 className="h-4 w-4 text-green-500" />
//                             ) : (
//                               <XCircle className="h-4 w-4 text-red-500" />
//                             )}
//                             <span className="font-medium">{result.type}</span>
//                           </div>
//                           <span className="text-xs text-muted-foreground">{result.message}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-sm text-muted-foreground text-center py-4">Run a verification to see diagnostics</p>
//               )}
//             </CardContent>
//           </Card>
//         </CollapsibleContent>
//       </Collapsible>

//       {/* Verify Button */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
//             <div className="text-center sm:text-left">
//               <p className="text-sm font-medium">Ready to verify?</p>
//               <p className="text-xs text-muted-foreground">
//                 {selectedDomain?.verificationAttempts || 0} verification attempts so far
//               </p>
//             </div>
//             <Button onClick={handleVerify} disabled={verifying} size="lg" className="gap-2">
//               {verifying ? (
//                 <>
//                   <RefreshCw className="h-4 w-4 animate-spin" />
//                   Verifying DNS Records...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle2 className="h-4 w-4" />
//                   Verify DNS Records
//                 </>
//               )}
//             </Button>
//           </div>

//           {/* Propagation Warning */}
//           <Alert className="mt-4">
//             <Clock className="h-4 w-4" />
//             <AlertDescription className="text-sm">
//               DNS changes can take 5 minutes to 48 hours to propagate. If verification fails, wait a bit and try again.
//               You can also check your DNS propagation at{" "}
//               <a
//                 href="https://www.whatsmydns.net/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="underline hover:text-primary"
//               >
//                 whatsmydns.net
//               </a>
//             </AlertDescription>
//           </Alert>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


// "use client"

// import type React from "react"
// import { useEffect, useState, useCallback, useRef } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Progress } from "@/components/ui/progress"
// import { Separator } from "@/components/ui/separator"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   Copy,
//   AlertCircle,
//   RefreshCw,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   ExternalLink,
//   ChevronDown,
//   ChevronRight,
//   Search,
//   HelpCircle,
//   Zap,
//   Shield,
//   Mail,
//   Server,
//   WifiOff,
// } from "lucide-react"
// import { toast } from "sonner"
// import { verifyDomain, checkDKIMSelector, updateDomainProvider, getProviders } from "@/lib/actions/domain-action"
// import { cn } from "@/lib/utils"

// // =============================================================================
// // TYPES - Added proper TypeScript interfaces
// // =============================================================================

// interface DomainStatus {
//   id: string
//   domain: string
//   isVerified: boolean
//   emailProviderId?: string
//   dkimSelector?: string
//   spfStatus: "VALID" | "INVALID" | "PENDING" | null
//   dkimStatus: "VALID" | "INVALID" | "PENDING" | null
//   dmarcStatus: "VALID" | "INVALID" | "PENDING" | null
//   mxStatus: "VALID" | "INVALID" | "PENDING" | null
//   healthScore: number
//   lastVerificationCheck?: Date
//   verificationAttempts: number
// }

// interface EmailProvider {
//   id: string
//   name: string
//   icon: string
//   dkimSelectors: string[]
//   spfInclude: string
//   setupUrl: string
//   instructions: string[]
//   estimatedTime: string
// }

// interface DNSRecord {
//   type: string
//   name: string
//   value: string
//   selector?: string
// }

// interface VerificationResult {
//   verified: boolean
//   healthScore: number
//   dkimSelector?: string
//   results: Array<{
//     type: string
//     valid: boolean
//     message: string
//   }>
//   diagnostics?: {
//     timestamp: string
//     dnsLookupTime: number
//     selectorsChecked: number
//   }
// }

// interface SelectorResult {
//   found: boolean
//   valid: boolean
//   record?: string
// }

// interface LoadingStates {
//   domains: boolean
//   providers: boolean
//   dnsRecords: boolean
//   verifying: boolean
//   checkingSelector: boolean
//   updatingProvider: boolean
// }

// interface ErrorState {
//   type: "domains" | "providers" | "dnsRecords" | "verification" | "selector" | "provider" | null
//   message: string
//   retryFn?: () => void
// }

// // =============================================================================
// // VALIDATION UTILITIES - Added input validation
// // =============================================================================

// const validateSelector = (selector: string): boolean => {
//   // DKIM selectors can only contain alphanumeric, hyphens, underscores
//   // Max length of 63 characters per DNS label rules
//   return /^[a-zA-Z0-9_-]+$/.test(selector) && selector.length <= 63 && selector.length > 0
// }

// const isDomainStatus = (obj: unknown): obj is DomainStatus => {
//   if (!obj || typeof obj !== "object") return false
//   const d = obj as Record<string, unknown>
//   return (
//     typeof d.id === "string" &&
//     typeof d.domain === "string" &&
//     typeof d.isVerified === "boolean" &&
//     typeof d.healthScore === "number"
//   )
// }

// const isEmailProvider = (obj: unknown): obj is EmailProvider => {
//   if (!obj || typeof obj !== "object") return false
//   const p = obj as Record<string, unknown>
//   return typeof p.id === "string" && typeof p.name === "string" && Array.isArray(p.dkimSelectors)
// }

// // =============================================================================
// // RETRY UTILITY - Added exponential backoff retry logic
// // =============================================================================

// async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, baseDelay = 1000): Promise<T> {
//   let lastError: Error | undefined

//   for (let i = 0; i < retries; i++) {
//     try {
//       return await fn()
//     } catch (error) {
//       lastError = error instanceof Error ? error : new Error(String(error))
//       if (i < retries - 1) {
//         await new Promise((r) => setTimeout(r, baseDelay * Math.pow(2, i)))
//       }
//     }
//   }

//   throw lastError
// }

// // =============================================================================
// // ONLINE STATUS HOOK - Added offline detection
// // =============================================================================

// function useOnlineStatus() {
//   const [isOnline, setIsOnline] = useState(true)

//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true)
//     const handleOffline = () => setIsOnline(false)

//     // Check initial status
//     setIsOnline(navigator.onLine)

//     window.addEventListener("online", handleOnline)
//     window.addEventListener("offline", handleOffline)

//     return () => {
//       window.removeEventListener("online", handleOnline)
//       window.removeEventListener("offline", handleOffline)
//     }
//   }, [])

//   return isOnline
// }

// // =============================================================================
// // PROVIDER ICONS
// // =============================================================================

// const ProviderIcon = ({ provider, className }: { provider: string; className?: string }) => {
//   const icons: Record<string, React.ReactNode> = {
//     google: (
//       <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} aria-hidden="true">
//         <path
//           fill="#4285F4"
//           d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//         />
//         <path
//           fill="#34A853"
//           d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//         />
//         <path
//           fill="#FBBC05"
//           d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//         />
//         <path
//           fill="#EA4335"
//           d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//         />
//       </svg>
//     ),
//     microsoft: (
//       <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} aria-hidden="true">
//         <path fill="#F25022" d="M1 1h10v10H1z" />
//         <path fill="#00A4EF" d="M1 13h10v10H1z" />
//         <path fill="#7FBA00" d="M13 1h10v10H13z" />
//         <path fill="#FFB900" d="M13 13h10v10H13z" />
//       </svg>
//     ),
//     sendgrid: <Mail className={cn("h-5 w-5 text-blue-500", className)} aria-hidden="true" />,
//     mailgun: <Mail className={cn("h-5 w-5 text-red-500", className)} aria-hidden="true" />,
//     aws: <Server className={cn("h-5 w-5 text-orange-500", className)} aria-hidden="true" />,
//     zoho: <Mail className={cn("h-5 w-5 text-green-600", className)} aria-hidden="true" />,
//     server: <Server className={cn("h-5 w-5 text-muted-foreground", className)} aria-hidden="true" />,
//   }
//   return <>{icons[provider] || icons.server}</>
// }

// // =============================================================================
// // MAIN COMPONENT
// // =============================================================================

// export function DNSVerificationGuide() {
//   const [domains, setDomains] = useState<DomainStatus[]>([])
//   const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null)
//   const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([])
//   const [providers, setProviders] = useState<EmailProvider[]>([])
//   const [lastVerification, setLastVerification] = useState<VerificationResult | null>(null)

//   const [loadingStates, setLoadingStates] = useState<LoadingStates>({
//     domains: true,
//     providers: true,
//     dnsRecords: false,
//     verifying: false,
//     checkingSelector: false,
//     updatingProvider: false,
//   })

//   const [error, setError] = useState<ErrorState>({ type: null, message: "" })

//   // Custom selector state
//   const [customSelector, setCustomSelector] = useState("")
//   const [selectorResult, setSelectorResult] = useState<SelectorResult | null>(null)

//   // Diagnostics panel
//   const [showDiagnostics, setShowDiagnostics] = useState(false)

//   const dnsRecordsCache = useRef<Record<string, DNSRecord[]>>({})

//   const abortControllerRef = useRef<AbortController | null>(null)

//   const isOnline = useOnlineStatus()

//   // =============================================================================
//   // HELPER FUNCTIONS
//   // =============================================================================

//   const updateLoadingState = useCallback((key: keyof LoadingStates, value: boolean) => {
//     setLoadingStates((prev) => ({ ...prev, [key]: value }))
//   }, [])

//   const clearError = useCallback(() => {
//     setError({ type: null, message: "" })
//   }, [])

//   // =============================================================================
//   // DATA FETCHING - Added proper cleanup and error handling
//   // =============================================================================

//   const fetchDomains = useCallback(async () => {
//     updateLoadingState("domains", true)
//     clearError()

//     try {
//       const response = await retryWithBackoff(async () => {
//         const res = await fetch("/api/domains")
//         if (!res.ok) throw new Error(`HTTP ${res.status}`)
//         return res.json()
//       })

//       if (response.success && Array.isArray(response.domains)) {
//         const validDomains = response.domains.filter(isDomainStatus)
//         if (validDomains.length > 0) {
//           setDomains(validDomains)
//           const unverified = validDomains.find((d: DomainStatus) => !d.isVerified)
//           const targetDomain = unverified || validDomains[0]
//           if (targetDomain) {
//             setSelectedDomainId(targetDomain.id)
//             // Don't await - let it load in background
//             fetchDNSRecords(targetDomain.id)
//           }
//         }
//       }
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Failed to load domains"
//       setError({
//         type: "domains",
//         message: "Unable to load domains. Please check your connection and try again.",
//         retryFn: fetchDomains,
//       })
//       console.error("Failed to fetch domains:", message)
//     } finally {
//       updateLoadingState("domains", false)
//     }
//   }, [updateLoadingState, clearError])

//   const fetchProviders = useCallback(async () => {
//     updateLoadingState("providers", true)

//     try {
//       const providerList = await retryWithBackoff(() => getProviders())

//       if (Array.isArray(providerList)) {
//         const validProviders = providerList.filter(isEmailProvider)
//         setProviders(validProviders)
//       }
//     } catch (err) {
//       console.error("Failed to fetch providers:", err)
//       // Non-critical - don't show error UI, providers can be loaded later
//     } finally {
//       updateLoadingState("providers", false)
//     }
//   }, [updateLoadingState])

//   const fetchDNSRecords = useCallback(
//     async (domainId: string) => {
//       if (dnsRecordsCache.current[domainId]) {
//         setDnsRecords(dnsRecordsCache.current[domainId])
//         return
//       }

//       updateLoadingState("dnsRecords", true)

//       try {
//         const response = await fetch(`/api/domains/${domainId}`)
//         if (!response.ok) throw new Error(`HTTP ${response.status}`)

//         const data = await response.json()
//         if (data.success && data.domain?.dnsRecords?.records) {
//           const records = data.domain.dnsRecords.records as DNSRecord[]
//           dnsRecordsCache.current[domainId] = records
//           setDnsRecords(records)
//         }
//       } catch (err) {
//         console.error("Failed to fetch DNS records:", err)
//         // Non-critical - DNS records are supplementary
//       } finally {
//         updateLoadingState("dnsRecords", false)
//       }
//     },
//     [updateLoadingState],
//   )

//   useEffect(() => {
//     abortControllerRef.current = new AbortController()

//     // Parallel fetch for initial data
//     Promise.all([fetchDomains(), fetchProviders()])

//     return () => {
//       abortControllerRef.current?.abort()
//     }
//   }, [fetchDomains, fetchProviders])

//   // =============================================================================
//   // ACTIONS - Added guards and improved error handling
//   // =============================================================================

//   const handleVerify = useCallback(async () => {
//     if (loadingStates.verifying || !selectedDomainId) return

//     if (!isOnline) {
//       toast.error("You appear to be offline", {
//         description: "Please check your internet connection and try again.",
//       })
//       return
//     }

//     updateLoadingState("verifying", true)
//     setSelectorResult(null)
//     clearError()

//     try {
//       const result = await verifyDomain(selectedDomainId, customSelector || undefined)

//       const verificationResult = result as VerificationResult
//       setLastVerification(verificationResult)

//       if (verificationResult.verified) {
//         toast.success("Domain verified successfully!", {
//           description: `Health score: ${verificationResult.healthScore}%`,
//         })
//       } else {
//         const failedRecords = verificationResult.results?.filter((r) => !r.valid) || []
//         const failedTypes = failedRecords.map((r) => r.type).join(", ")
//         toast.error("Some DNS records need attention", {
//           description: failedTypes ? `${failedTypes} not configured correctly` : "Please review your DNS settings",
//         })
//       }

//       delete dnsRecordsCache.current[selectedDomainId]
//       await fetchDomains()
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Verification failed"
//       let userMessage = "Please try again in a few moments."
//       if (message.includes("rate limit") || message.includes("429")) {
//         userMessage = "Too many verification attempts. Please wait a few minutes before trying again."
//       } else if (message.includes("timeout")) {
//         userMessage = "DNS lookup timed out. This may indicate DNS propagation is still in progress."
//       }

//       toast.error("Verification failed", { description: userMessage })
//       setError({
//         type: "verification",
//         message: userMessage,
//         retryFn: handleVerify,
//       })
//     } finally {
//       updateLoadingState("verifying", false)
//     }
//   }, [
//     loadingStates.verifying,
//     selectedDomainId,
//     isOnline,
//     customSelector,
//     updateLoadingState,
//     clearError,
//     fetchDomains,
//   ])

//   const handleCheckCustomSelector = useCallback(async () => {
//     if (!selectedDomainId || !customSelector.trim()) return
//     if (loadingStates.checkingSelector) return

//     const trimmedSelector = customSelector.trim()
//     if (!validateSelector(trimmedSelector)) {
//       toast.error("Invalid selector format", {
//         description: "Selector can only contain letters, numbers, hyphens, and underscores (max 63 characters)",
//       })
//       return
//     }

//     updateLoadingState("checkingSelector", true)

//     try {
//       const result = await checkDKIMSelector(selectedDomainId, trimmedSelector)
//       const selectorRes = result as SelectorResult
//       setSelectorResult(selectorRes)

//       if (selectorRes.valid) {
//         toast.success("DKIM selector found!", {
//           description: `Selector "${trimmedSelector}" is valid`,
//         })
//         // Invalidate cache and refresh
//         delete dnsRecordsCache.current[selectedDomainId]
//         await fetchDomains()
//       } else if (selectorRes.found) {
//         toast.warning("Selector found but may be invalid", {
//           description: "The record exists but might be misconfigured. Check the record value in your DNS.",
//         })
//       } else {
//         toast.error("Selector not found", {
//           description: `No DKIM record found. If you just added it, DNS propagation can take 15-60 minutes.`,
//         })
//       }
//     } catch (err) {
//       toast.error("Failed to check selector", {
//         description: "Please try again in a moment.",
//       })
//     } finally {
//       updateLoadingState("checkingSelector", false)
//     }
//   }, [selectedDomainId, customSelector, loadingStates.checkingSelector, updateLoadingState, fetchDomains])

//   const handleProviderChange = useCallback(
//     async (providerId: string) => {
//       if (!selectedDomainId || loadingStates.updatingProvider) return

//       const previousDomains = [...domains]
//       setDomains((prev) => prev.map((d) => (d.id === selectedDomainId ? { ...d, emailProviderId: providerId } : d)))

//       updateLoadingState("updatingProvider", true)

//       try {
//         const result = await updateDomainProvider(selectedDomainId, providerId)
//         if (result.success) {
//           toast.success("Email provider updated")
//           // Invalidate cache
//           delete dnsRecordsCache.current[selectedDomainId]
//           await fetchDNSRecords(selectedDomainId)
//         } else {
//           setDomains(previousDomains)
//           toast.error("Failed to update provider")
//         }
//       } catch (err) {
//         setDomains(previousDomains)
//         toast.error("Failed to update provider", {
//           description: "Please try again.",
//         })
//       } finally {
//         updateLoadingState("updatingProvider", false)
//       }
//     },
//     [selectedDomainId, domains, loadingStates.updatingProvider, updateLoadingState, fetchDNSRecords],
//   )

//   const handleDomainChange = useCallback(
//     (domainId: string) => {
//       if (loadingStates.verifying) return // Prevent change during verification

//       setSelectedDomainId(domainId)
//       setLastVerification(null)
//       setSelectorResult(null)
//       setCustomSelector("")
//       fetchDNSRecords(domainId)
//     },
//     [loadingStates.verifying, fetchDNSRecords],
//   )

//   const copyToClipboard = useCallback((text: string, label: string) => {
//     navigator.clipboard.writeText(text)
//     toast.success("Copied!", { description: `${label} copied to clipboard` })
//   }, [])

//   // =============================================================================
//   // COMPUTED VALUES
//   // =============================================================================

//   const selectedDomain = domains.find((d) => d.id === selectedDomainId)
//   const selectedProvider = providers.find((p) => p.id === selectedDomain?.emailProviderId)

//   const spfRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "@")
//   const dmarcRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "_dmarc")

//   const getVerificationProgress = useCallback(() => {
//     if (!selectedDomain) return 0
//     let progress = 0
//     if (selectedDomain.spfStatus === "VALID") progress += 30
//     if (selectedDomain.dkimStatus === "VALID") progress += 35
//     if (selectedDomain.dmarcStatus === "VALID") progress += 25
//     if (selectedDomain.mxStatus === "VALID") progress += 10
//     return progress
//   }, [selectedDomain])

//   const isLoading = loadingStates.domains || loadingStates.providers

//   // =============================================================================
//   // RENDER HELPERS
//   // =============================================================================

//   const StatusBadge = ({ status }: { status: string | null }) => {
//     if (status === "VALID") {
//       return (
//         <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
//           <CheckCircle2 className="mr-1 h-3 w-3" aria-hidden="true" />
//           <span>Verified</span>
//         </Badge>
//       )
//     }
//     if (status === "INVALID") {
//       return (
//         <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-500/20">
//           <XCircle className="mr-1 h-3 w-3" aria-hidden="true" />
//           <span>Invalid</span>
//         </Badge>
//       )
//     }
//     return (
//       <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
//         <Clock className="mr-1 h-3 w-3" aria-hidden="true" />
//         <span>Pending</span>
//       </Badge>
//     )
//   }

//   // =============================================================================
//   // OFFLINE BANNER - Added offline detection UI
//   // =============================================================================

//   if (!isOnline) {
//     return (
//       <Alert variant="destructive" className="mb-4">
//         <WifiOff className="h-4 w-4" />
//         <AlertTitle>You are offline</AlertTitle>
//         <AlertDescription>Please check your internet connection to continue with DNS verification.</AlertDescription>
//       </Alert>
//     )
//   }

//   // =============================================================================
//   // LOADING STATE
//   // =============================================================================

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-12" role="status" aria-label="Loading">
//         <div className="text-center space-y-3">
//           <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto" aria-hidden="true" />
//           <p className="text-sm text-muted-foreground">Loading domain configuration...</p>
//         </div>
//       </div>
//     )
//   }

//   // =============================================================================
//   // ERROR STATE - Added retry capability
//   // =============================================================================

//   if (error.type === "domains" && domains.length === 0) {
//     return (
//       <Card>
//         <CardContent className="pt-6">
//           <div className="text-center py-8">
//             <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" aria-hidden="true" />
//             <h3 className="text-lg font-semibold mb-2">Failed to Load Domains</h3>
//             <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
//             {error.retryFn && (
//               <Button onClick={error.retryFn} variant="outline">
//                 <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
//                 Try Again
//               </Button>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   // =============================================================================
//   // EMPTY STATE
//   // =============================================================================

//   if (domains.length === 0) {
//     return (
//       <Card>
//         <CardContent className="pt-6">
//           <div className="text-center py-8">
//             <Server className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
//             <h3 className="text-lg font-semibold mb-2">No Domains Added</h3>
//             <p className="text-sm text-muted-foreground mb-4">
//               Add a domain in the Domain Setup tab to get started with DNS configuration.
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   // =============================================================================
//   // MAIN RENDER
//   // =============================================================================

//   return (
//     <div className="space-y-6">
//       {/* Domain Selector & Progress */}
//       <Card>
//         <CardHeader className="pb-3">
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle className="text-lg">DNS Configuration</CardTitle>
//               <CardDescription>Configure email authentication for your domain</CardDescription>
//             </div>
//             {selectedDomain && (
//               <div className="text-right">
//                 <p
//                   className="text-2xl font-bold"
//                   aria-label={`Health score: ${selectedDomain.healthScore || 0} percent`}
//                 >
//                   {selectedDomain.healthScore || 0}%
//                 </p>
//                 <p className="text-xs text-muted-foreground">Health Score</p>
//               </div>
//             )}
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {domains.length > 1 && (
//             <div className="space-y-2">
//               <Label htmlFor="domain-select" className="text-sm font-medium">
//                 Select Domain
//               </Label>
//               <Select
//                 value={selectedDomainId || ""}
//                 onValueChange={handleDomainChange}
//                 disabled={loadingStates.verifying}
//               >
//                 <SelectTrigger id="domain-select" className="w-full" aria-label="Select a domain to configure">
//                   <SelectValue placeholder="Select a domain" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {domains.map((domain) => (
//                     <SelectItem key={domain.id} value={domain.id}>
//                       <span className="flex items-center gap-2">
//                         {domain.domain}
//                         {domain.isVerified && <CheckCircle2 className="h-3 w-3 text-green-500" aria-label="Verified" />}
//                       </span>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           {/* Progress Bar */}
//           <div className="space-y-2">
//             <div className="flex items-center justify-between text-sm">
//               <span className="font-medium">Verification Progress</span>
//               <span className="text-muted-foreground">{getVerificationProgress()}% complete</span>
//             </div>
//             <Progress
//               value={getVerificationProgress()}
//               className="h-2"
//               aria-label={`Verification progress: ${getVerificationProgress()} percent`}
//             />
//           </div>

//           {/* Status Grid */}
//           {selectedDomain && (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3" role="list" aria-label="DNS record status">
//               <div className="p-3 rounded-lg border bg-card" role="listitem">
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="text-xs font-medium text-muted-foreground">SPF</span>
//                   <StatusBadge status={selectedDomain.spfStatus} />
//                 </div>
//                 <p className="text-xs text-muted-foreground">Sender authorization</p>
//               </div>
//               <div className="p-3 rounded-lg border bg-card" role="listitem">
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="text-xs font-medium text-muted-foreground">DKIM</span>
//                   <StatusBadge status={selectedDomain.dkimStatus} />
//                 </div>
//                 <p className="text-xs text-muted-foreground">Email signatures</p>
//               </div>
//               <div className="p-3 rounded-lg border bg-card" role="listitem">
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="text-xs font-medium text-muted-foreground">DMARC</span>
//                   <StatusBadge status={selectedDomain.dmarcStatus} />
//                 </div>
//                 <p className="text-xs text-muted-foreground">Policy enforcement</p>
//               </div>
//               <div className="p-3 rounded-lg border bg-card" role="listitem">
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="text-xs font-medium text-muted-foreground">MX</span>
//                   <StatusBadge status={selectedDomain.mxStatus} />
//                 </div>
//                 <p className="text-xs text-muted-foreground">Mail routing (optional)</p>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Email Provider Selection */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg flex items-center gap-2">
//             <Mail className="h-5 w-5" aria-hidden="true" />
//             Email Provider
//           </CardTitle>
//           <CardDescription>
//             Select your email provider to get the correct DKIM selectors and setup instructions
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3" role="radiogroup" aria-label="Select email provider">
//             {providers.map((provider) => (
//               <button
//                 key={provider.id}
//                 onClick={() => handleProviderChange(provider.id)}
//                 disabled={loadingStates.updatingProvider}
//                 className={cn(
//                   "p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
//                   selectedDomain?.emailProviderId === provider.id ? "border-primary bg-primary/5" : "border-border",
//                   loadingStates.updatingProvider && "opacity-50 cursor-not-allowed",
//                 )}
//                 role="radio"
//                 aria-checked={selectedDomain?.emailProviderId === provider.id}
//                 aria-label={`${provider.name} - ${provider.estimatedTime}`}
//               >
//                 <div className="flex items-center gap-2 mb-2">
//                   <ProviderIcon provider={provider.icon} />
//                   <span className="font-medium text-sm">{provider.name}</span>
//                 </div>
//                 <p className="text-xs text-muted-foreground">{provider.estimatedTime}</p>
//               </button>
//             ))}
//           </div>

//           {/* Provider Instructions */}
//           {selectedProvider && (
//             <div className="mt-4 p-4 rounded-lg bg-muted/50 border">
//               <div className="flex items-start justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <ProviderIcon provider={selectedProvider.icon} />
//                   <span className="font-semibold">{selectedProvider.name} Setup</span>
//                 </div>
//                 {selectedProvider.setupUrl && (
//                   <Button variant="outline" size="sm" asChild>
//                     <a
//                       href={selectedProvider.setupUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       aria-label={`Open ${selectedProvider.name} setup in new tab`}
//                     >
//                       Open {selectedProvider.name}
//                       <ExternalLink className="ml-1 h-3 w-3" aria-hidden="true" />
//                     </a>
//                   </Button>
//                 )}
//               </div>
//               <Alert className="mb-4 border-amber-500/20 bg-amber-500/5">
//                 <Zap className="h-4 w-4 text-amber-500" aria-hidden="true" />
//                 <AlertTitle className="text-amber-600">Important: Complete DKIM Setup First</AlertTitle>
//                 <AlertDescription className="text-amber-600/80">
//                   You must complete domain authentication in {selectedProvider.name} before the DKIM verification will
//                   pass. Follow these steps:
//                 </AlertDescription>
//               </Alert>
//               <ol className="space-y-2 text-sm" aria-label="Setup instructions">
//                 {selectedProvider.instructions.map((instruction, index) => (
//                   <li key={index} className="flex gap-3">
//                     <span
//                       className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary"
//                       aria-hidden="true"
//                     >
//                       {index + 1}
//                     </span>
//                     <span className="text-muted-foreground pt-0.5">{instruction}</span>
//                   </li>
//                 ))}
//               </ol>
//               <Separator className="my-4" />
//               <div className="text-xs text-muted-foreground">
//                 <strong>DKIM Selectors we check:</strong> {selectedProvider.dkimSelectors.slice(0, 3).join(", ")}
//                 {selectedProvider.dkimSelectors.length > 3 && ` +${selectedProvider.dkimSelectors.length - 3} more`}
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* DNS Records Configuration */}
//       <Tabs defaultValue="spf" className="space-y-4">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="spf" className="gap-2">
//             <Shield className="h-4 w-4" aria-hidden="true" />
//             <span>SPF</span>
//           </TabsTrigger>
//           <TabsTrigger value="dkim" className="gap-2">
//             <Mail className="h-4 w-4" aria-hidden="true" />
//             <span>DKIM</span>
//           </TabsTrigger>
//           <TabsTrigger value="dmarc" className="gap-2">
//             <Shield className="h-4 w-4" aria-hidden="true" />
//             <span>DMARC</span>
//           </TabsTrigger>
//         </TabsList>

//         {/* SPF Tab */}
//         <TabsContent value="spf">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>SPF Record</span>
//                 <StatusBadge status={selectedDomain?.spfStatus || null} />
//               </CardTitle>
//               <CardDescription>
//                 Sender Policy Framework authorizes which servers can send email from your domain
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {spfRecord && (
//                 <div className="space-y-3">
//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Record Type</Label>
//                     <code className="rounded bg-muted px-3 py-2 text-sm">TXT</code>
//                   </div>
//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Host / Name</Label>
//                     <div className="flex items-center gap-2">
//                       <code className="flex-1 rounded bg-muted px-3 py-2 text-sm">@</code>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => copyToClipboard("@", "Host")}
//                         aria-label="Copy host to clipboard"
//                       >
//                         <Copy className="h-4 w-4" aria-hidden="true" />
//                       </Button>
//                     </div>
//                     <p className="text-xs text-muted-foreground">Use @ or leave blank for root domain</p>
//                   </div>
//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Value</Label>
//                     <div className="flex items-center gap-2">
//                       <code className="flex-1 rounded bg-muted px-3 py-2 text-sm break-all">{spfRecord.value}</code>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => copyToClipboard(spfRecord.value, "SPF record")}
//                         aria-label="Copy SPF record to clipboard"
//                       >
//                         <Copy className="h-4 w-4" aria-hidden="true" />
//                       </Button>
//                     </div>
//                   </div>
//                   <Alert>
//                     <HelpCircle className="h-4 w-4" aria-hidden="true" />
//                     <AlertDescription className="text-sm">
//                       <strong>Already have an SPF record?</strong> Add{" "}
//                       <code className="bg-muted px-1 rounded">
//                         {selectedProvider?.spfInclude || "include:your-provider.com"}
//                       </code>{" "}
//                       to your existing record instead of replacing it.
//                     </AlertDescription>
//                   </Alert>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* DKIM Tab */}
//         <TabsContent value="dkim">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>DKIM Configuration</span>
//                 <StatusBadge status={selectedDomain?.dkimStatus || null} />
//               </CardTitle>
//               <CardDescription>
//                 DomainKeys Identified Mail adds a digital signature to verify email authenticity
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {/* DKIM Warning */}
//               <Alert className="border-blue-500/20 bg-blue-500/5">
//                 <AlertCircle className="h-4 w-4 text-blue-500" aria-hidden="true" />
//                 <AlertTitle className="text-blue-600">DKIM is configured in your email provider</AlertTitle>
//                 <AlertDescription className="text-blue-600/80">
//                   Unlike SPF and DMARC, DKIM records are generated by your email provider (
//                   {selectedProvider?.name || "Google, Microsoft, etc."}). You must complete domain authentication there
//                   first, then we can verify the record exists.
//                 </AlertDescription>
//               </Alert>

//               {/* Found Selector Display */}
//               {selectedDomain?.dkimSelector && (
//                 <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
//                   <div className="flex items-center gap-2 mb-2">
//                     <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />
//                     <span className="font-medium text-green-600">DKIM Verified</span>
//                   </div>
//                   <p className="text-sm text-muted-foreground">
//                     Found valid DKIM with selector:{" "}
//                     <code className="bg-muted px-1 rounded">{selectedDomain.dkimSelector}</code>
//                   </p>
//                 </div>
//               )}

//               {/* Manual Selector Check */}
//               {selectedDomain?.dkimStatus !== "VALID" && (
//                 <div className="space-y-3">
//                   <Separator />
//                   <div className="space-y-2">
//                     <Label htmlFor="custom-selector" className="text-sm font-medium">
//                       Check Custom Selector
//                     </Label>
//                     <p className="text-xs text-muted-foreground">
//                       If you know your DKIM selector (from your email provider), enter it here to verify:
//                     </p>
//                     <div className="flex gap-2">
//                       <Input
//                         id="custom-selector"
//                         placeholder="e.g., google, selector1, s1"
//                         value={customSelector}
//                         onChange={(e) => setCustomSelector(e.target.value)}
//                         className="flex-1"
//                         aria-describedby="selector-hint"
//                         maxLength={63}
//                       />
//                       <Button
//                         variant="outline"
//                         onClick={handleCheckCustomSelector}
//                         disabled={loadingStates.checkingSelector || !customSelector.trim()}
//                         aria-label="Check DKIM selector"
//                       >
//                         {loadingStates.checkingSelector ? (
//                           <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
//                         ) : (
//                           <Search className="h-4 w-4" aria-hidden="true" />
//                         )}
//                         <span className="ml-2">Check</span>
//                       </Button>
//                     </div>
//                     <p id="selector-hint" className="text-xs text-muted-foreground">
//                       Only letters, numbers, hyphens, and underscores allowed (max 63 characters)
//                     </p>
//                     {selectorResult && (
//                       <Alert
//                         className={
//                           selectorResult.valid ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"
//                         }
//                       >
//                         {selectorResult.valid ? (
//                           <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
//                         ) : (
//                           <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
//                         )}
//                         <AlertDescription>
//                           {selectorResult.valid
//                             ? `DKIM record found at ${customSelector}._domainkey.${selectedDomain?.domain}`
//                             : selectorResult.found
//                               ? "Record exists but may be misconfigured. Check that the DKIM key is correctly formatted."
//                               : `No DKIM record found at ${customSelector}._domainkey.${selectedDomain?.domain}. If you just added it, wait 15-60 minutes for DNS propagation.`}
//                         </AlertDescription>
//                       </Alert>
//                     )}
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     We automatically check these selectors:{" "}
//                     {selectedProvider?.dkimSelectors.slice(0, 5).join(", ") || "google, selector1, s1, default, ..."}
//                   </p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* DMARC Tab */}
//         <TabsContent value="dmarc">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>DMARC Record</span>
//                 <StatusBadge status={selectedDomain?.dmarcStatus || null} />
//               </CardTitle>
//               <CardDescription>Domain-based Message Authentication protects against email spoofing</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {dmarcRecord && (
//                 <div className="space-y-3">
//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Record Type</Label>
//                     <code className="rounded bg-muted px-3 py-2 text-sm">TXT</code>
//                   </div>
//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Host / Name</Label>
//                     <div className="flex items-center gap-2">
//                       <code className="flex-1 rounded bg-muted px-3 py-2 text-sm">_dmarc</code>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => copyToClipboard("_dmarc", "Host")}
//                         aria-label="Copy host to clipboard"
//                       >
//                         <Copy className="h-4 w-4" aria-hidden="true" />
//                       </Button>
//                     </div>
//                   </div>
//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Value</Label>
//                     <div className="flex items-center gap-2">
//                       <code className="flex-1 rounded bg-muted px-3 py-2 text-sm break-all">{dmarcRecord.value}</code>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => copyToClipboard(dmarcRecord.value, "DMARC record")}
//                         aria-label="Copy DMARC record to clipboard"
//                       >
//                         <Copy className="h-4 w-4" aria-hidden="true" />
//                       </Button>
//                     </div>
//                   </div>
//                   <Alert>
//                     <HelpCircle className="h-4 w-4" aria-hidden="true" />
//                     <AlertDescription className="text-sm">
//                       <strong>DMARC Policies:</strong>
//                       <ul className="mt-1 space-y-1 text-xs">
//                         <li>
//                           <code>p=none</code> - Monitor only (good for testing)
//                         </li>
//                         <li>
//                           <code>p=quarantine</code> - Send suspicious emails to spam
//                         </li>
//                         <li>
//                           <code>p=reject</code> - Block unauthenticated emails
//                         </li>
//                       </ul>
//                     </AlertDescription>
//                   </Alert>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Diagnostics Panel */}
//       <Collapsible open={showDiagnostics} onOpenChange={setShowDiagnostics}>
//         <CollapsibleTrigger asChild>
//           <Button variant="ghost" className="w-full justify-between" aria-expanded={showDiagnostics}>
//             <span className="flex items-center gap-2">
//               <Search className="h-4 w-4" aria-hidden="true" />
//               Diagnostics & Debug Info
//             </span>
//             {showDiagnostics ? (
//               <ChevronDown className="h-4 w-4" aria-hidden="true" />
//             ) : (
//               <ChevronRight className="h-4 w-4" aria-hidden="true" />
//             )}
//           </Button>
//         </CollapsibleTrigger>
//         <CollapsibleContent>
//           <Card className="mt-2">
//             <CardContent className="pt-4">
//               {lastVerification ? (
//                 <div className="space-y-4 text-sm">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-xs text-muted-foreground mb-1">Last Check</p>
//                       <p className="font-mono text-xs">
//                         {lastVerification.diagnostics?.timestamp
//                           ? new Date(lastVerification.diagnostics.timestamp).toLocaleString()
//                           : "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground mb-1">DNS Lookup Time</p>
//                       <p className="font-mono text-xs">{lastVerification.diagnostics?.dnsLookupTime || 0}ms</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground mb-1">Selectors Checked</p>
//                       <p className="font-mono text-xs">{lastVerification.diagnostics?.selectorsChecked || 0}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground mb-1">DKIM Selector Found</p>
//                       <p className="font-mono text-xs">{lastVerification.dkimSelector || "None"}</p>
//                     </div>
//                   </div>
//                   <Separator />
//                   <div>
//                     <p className="text-xs text-muted-foreground mb-2">Verification Results</p>
//                     <div className="space-y-2" role="list" aria-label="Verification results">
//                       {lastVerification.results?.map((result, index) => (
//                         <div
//                           key={index}
//                           className="flex items-center justify-between p-2 rounded bg-muted/50"
//                           role="listitem"
//                         >
//                           <div className="flex items-center gap-2">
//                             {result.valid ? (
//                               <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
//                             ) : (
//                               <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
//                             )}
//                             <span className="font-medium">{result.type}</span>
//                           </div>
//                           <span className="text-xs text-muted-foreground">{result.message}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-sm text-muted-foreground text-center py-4">Run a verification to see diagnostics</p>
//               )}
//             </CardContent>
//           </Card>
//         </CollapsibleContent>
//       </Collapsible>

//       {/* Verify Button */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
//             <div className="text-center sm:text-left">
//               <p className="text-sm font-medium">Ready to verify?</p>
//               <p className="text-xs text-muted-foreground">
//                 {selectedDomain?.verificationAttempts || 0} verification attempts so far
//               </p>
//             </div>
//             <Button
//               onClick={handleVerify}
//               disabled={loadingStates.verifying || !selectedDomainId}
//               size="lg"
//               className="gap-2"
//               aria-label={loadingStates.verifying ? "Verifying DNS records" : "Verify DNS records"}
//             >
//               {loadingStates.verifying ? (
//                 <>
//                   <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
//                   Verifying DNS Records...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
//                   Verify DNS Records
//                 </>
//               )}
//             </Button>
//           </div>

//           {/* Propagation Warning */}
//           <Alert className="mt-4">
//             <Clock className="h-4 w-4" aria-hidden="true" />
//             <AlertDescription className="text-sm">
//               DNS changes can take 5 minutes to 48 hours to propagate. If verification fails, wait a bit and try again.
//               You can also check your DNS propagation at{" "}
//               <a
//                 href="https://www.whatsmydns.net/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="underline hover:text-primary"
//               >
//                 whatsmydns.net
//               </a>
//             </AlertDescription>
//           </Alert>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"

import type React from "react"
import { useEffect, useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
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
  RefreshCw,
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
  WifiOff,
  Plus,
} from "lucide-react"
import { toast } from "sonner"
import { verifyDomain, checkDKIMSelector, updateDomainProvider, getProviders } from "@/lib/actions/domain-action"
import { cn } from "@/lib/utils"

// =============================================================================
// TYPES - Added proper TypeScript interfaces
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
    message: string
  }>
  diagnostics?: {
    timestamp: string
    dnsLookupTime: number
    selectorsChecked: number
  }
}

interface SelectorResult {
  found: boolean
  valid: boolean
  record?: string
}

interface LoadingStates {
  domains: boolean
  providers: boolean
  dnsRecords: boolean
  verifying: boolean
  checkingSelector: boolean
  updatingProvider: boolean
}

interface ErrorState {
  type: "domains" | "providers" | "dnsRecords" | "verification" | "selector" | "provider" | null
  message: string
  retryFn?: () => void
}

// =============================================================================
// VALIDATION UTILITIES - Added input validation
// =============================================================================

const validateSelector = (selector: string): boolean => {
  // DKIM selectors can only contain alphanumeric, hyphens, underscores
  // Max length of 63 characters per DNS label rules
  return /^[a-zA-Z0-9_-]+$/.test(selector) && selector.length <= 63 && selector.length > 0
}

const isDomainStatus = (obj: unknown): obj is DomainStatus => {
  if (!obj || typeof obj !== "object") return false
  const d = obj as Record<string, unknown>
  return (
    typeof d.id === "string" &&
    typeof d.domain === "string" &&
    typeof d.isVerified === "boolean" &&
    typeof d.healthScore === "number"
  )
}

const isEmailProvider = (obj: unknown): obj is EmailProvider => {
  if (!obj || typeof obj !== "object") return false
  const p = obj as Record<string, unknown>
  return typeof p.id === "string" && typeof p.name === "string" && Array.isArray(p.dkimSelectors)
}

// =============================================================================
// RETRY UTILITY - Added exponential backoff retry logic
// =============================================================================

async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, baseDelay = 1000): Promise<T> {
  let lastError: Error | undefined

  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      if (i < retries - 1) {
        await new Promise((r) => setTimeout(r, baseDelay * Math.pow(2, i)))
      }
    }
  }

  throw lastError
}

// =============================================================================
// ONLINE STATUS HOOK - Added offline detection
// =============================================================================

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Check initial status
    setIsOnline(navigator.onLine)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return isOnline
}

// =============================================================================
// PROVIDER ICONS
// =============================================================================

const ProviderIcon = ({ provider, className }: { provider: string; className?: string }) => {
  const icons: Record<string, React.ReactNode> = {
    google: (
      <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} aria-hidden="true">
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
      <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} aria-hidden="true">
        <path fill="#F25022" d="M1 1h10v10H1z" />
        <path fill="#00A4EF" d="M1 13h10v10H1z" />
        <path fill="#7FBA00" d="M13 1h10v10H13z" />
        <path fill="#FFB900" d="M13 13h10v10H13z" />
      </svg>
    ),
    sendgrid: <Mail className={cn("h-5 w-5 text-blue-500", className)} aria-hidden="true" />,
    mailgun: <Mail className={cn("h-5 w-5 text-red-500", className)} aria-hidden="true" />,
    aws: <Server className={cn("h-5 w-5 text-orange-500", className)} aria-hidden="true" />,
    zoho: <Mail className={cn("h-5 w-5 text-green-600", className)} aria-hidden="true" />,
    server: <Server className={cn("h-5 w-5 text-muted-foreground", className)} aria-hidden="true" />,
  }
  return <>{icons[provider] || icons.server}</>
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function DNSVerificationGuide() {
  const [domains, setDomains] = useState<DomainStatus[]>([])
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null)
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([])
  const [providers, setProviders] = useState<EmailProvider[]>([])
  const [lastVerification, setLastVerification] = useState<VerificationResult | null>(null)

  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    domains: true,
    providers: true,
    dnsRecords: false,
    verifying: false,
    checkingSelector: false,
    updatingProvider: false,
  })

  const [error, setError] = useState<ErrorState>({ type: null, message: "" })

  // Custom selector state
  const [customSelector, setCustomSelector] = useState("")
  const [selectorResult, setSelectorResult] = useState<SelectorResult | null>(null)

  // Diagnostics panel
  const [showDiagnostics, setShowDiagnostics] = useState(false)

  const dnsRecordsCache = useRef<Record<string, DNSRecord[]>>({})

  const abortControllerRef = useRef<AbortController | null>(null)

  const isOnline = useOnlineStatus()

  // =============================================================================
  // HELPER FUNCTIONS
  // =============================================================================

  const updateLoadingState = useCallback((key: keyof LoadingStates, value: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }))
  }, [])

  const clearError = useCallback(() => {
    setError({ type: null, message: "" })
  }, [])

  // =============================================================================
  // DATA FETCHING - Added proper cleanup and error handling
  // =============================================================================

  const fetchDomains = useCallback(async () => {
    updateLoadingState("domains", true)
    clearError()

    try {
      const response = await retryWithBackoff(async () => {
        const res = await fetch("/api/domains")
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })

      if (response.success && Array.isArray(response.domains)) {
        const validDomains = response.domains.filter(isDomainStatus)
        if (validDomains.length > 0) {
          setDomains(validDomains)
          const unverified = validDomains.find((d: DomainStatus) => !d.isVerified)
          const targetDomain = unverified || validDomains[0]
          if (targetDomain) {
            setSelectedDomainId(targetDomain.id)
            // Don't await - let it load in background
            fetchDNSRecords(targetDomain.id)
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load domains"
      setError({
        type: "domains",
        message: "Unable to load domains. Please check your connection and try again.",
        retryFn: fetchDomains,
      })
      console.error("Failed to fetch domains:", message)
    } finally {
      updateLoadingState("domains", false)
    }
  }, [updateLoadingState, clearError])

  const fetchProviders = useCallback(async () => {
    updateLoadingState("providers", true)

    try {
      const providerList = await retryWithBackoff(() => getProviders())

      if (Array.isArray(providerList)) {
        const validProviders = providerList.filter(isEmailProvider)
        setProviders(validProviders)
      }
    } catch (err) {
      console.error("Failed to fetch providers:", err)
      // Non-critical - don't show error UI, providers can be loaded later
    } finally {
      updateLoadingState("providers", false)
    }
  }, [updateLoadingState])

  const fetchDNSRecords = useCallback(
    async (domainId: string) => {
      if (dnsRecordsCache.current[domainId]) {
        setDnsRecords(dnsRecordsCache.current[domainId])
        return
      }

      updateLoadingState("dnsRecords", true)

      try {
        const response = await fetch(`/api/domains/${domainId}`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const data = await response.json()
        if (data.success && data.domain?.dnsRecords?.records) {
          const records = data.domain.dnsRecords.records as DNSRecord[]
          dnsRecordsCache.current[domainId] = records
          setDnsRecords(records)
        }
      } catch (err) {
        console.error("Failed to fetch DNS records:", err)
        // Non-critical - DNS records are supplementary
      } finally {
        updateLoadingState("dnsRecords", false)
      }
    },
    [updateLoadingState],
  )

  useEffect(() => {
    abortControllerRef.current = new AbortController()

    // Parallel fetch for initial data
    Promise.all([fetchDomains(), fetchProviders()])

    return () => {
      abortControllerRef.current?.abort()
    }
  }, [fetchDomains, fetchProviders])

  // =============================================================================
  // ACTIONS - Added guards and improved error handling
  // =============================================================================

  const handleVerify = useCallback(async () => {
    if (loadingStates.verifying || !selectedDomainId) return

    if (!isOnline) {
      toast.error("You appear to be offline", {
        description: "Please check your internet connection and try again.",
      })
      return
    }

    updateLoadingState("verifying", true)
    setSelectorResult(null)
    clearError()

    try {
      const result = await verifyDomain(selectedDomainId, customSelector || undefined)

      const verificationResult = result as VerificationResult
      setLastVerification(verificationResult)

      if (verificationResult.verified) {
        toast.success("Domain verified successfully!", {
          description: `Health score: ${verificationResult.healthScore}%`,
        })
      } else {
        const failedRecords = verificationResult.results?.filter((r) => !r.valid) || []
        const failedTypes = failedRecords.map((r) => r.type).join(", ")
        toast.error("Some DNS records need attention", {
          description: failedTypes ? `${failedTypes} not configured correctly` : "Please review your DNS settings",
        })
      }

      delete dnsRecordsCache.current[selectedDomainId]
      await fetchDomains()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed"
      let userMessage = "Please try again in a few moments."
      if (message.includes("rate limit") || message.includes("429")) {
        userMessage = "Too many verification attempts. Please wait a few minutes before trying again."
      } else if (message.includes("timeout")) {
        userMessage = "DNS lookup timed out. This may indicate DNS propagation is still in progress."
      }

      toast.error("Verification failed", { description: userMessage })
      setError({
        type: "verification",
        message: userMessage,
        retryFn: handleVerify,
      })
    } finally {
      updateLoadingState("verifying", false)
    }
  }, [
    loadingStates.verifying,
    selectedDomainId,
    isOnline,
    customSelector,
    updateLoadingState,
    clearError,
    fetchDomains,
  ])

  const handleCheckCustomSelector = useCallback(async () => {
    if (!selectedDomainId || !customSelector.trim()) return
    if (loadingStates.checkingSelector) return

    const trimmedSelector = customSelector.trim()
    if (!validateSelector(trimmedSelector)) {
      toast.error("Invalid selector format", {
        description: "Selector can only contain letters, numbers, hyphens, and underscores (max 63 characters)",
      })
      return
    }

    updateLoadingState("checkingSelector", true)

    try {
      const result = await checkDKIMSelector(selectedDomainId, trimmedSelector)
      const selectorRes = result as SelectorResult
      setSelectorResult(selectorRes)

      if (selectorRes.valid) {
        toast.success("DKIM selector found!", {
          description: `Selector "${trimmedSelector}" is valid`,
        })
        // Invalidate cache and refresh
        delete dnsRecordsCache.current[selectedDomainId]
        await fetchDomains()
      } else if (selectorRes.found) {
        toast.warning("Selector found but may be invalid", {
          description: "The record exists but might be misconfigured. Check the record value in your DNS.",
        })
      } else {
        toast.error("Selector not found", {
          description: `No DKIM record found. If you just added it, DNS propagation can take 15-60 minutes.`,
        })
      }
    } catch (err) {
      toast.error("Failed to check selector", {
        description: "Please try again in a moment.",
      })
    } finally {
      updateLoadingState("checkingSelector", false)
    }
  }, [selectedDomainId, customSelector, loadingStates.checkingSelector, updateLoadingState, fetchDomains])

  const handleProviderChange = useCallback(
    async (providerId: string) => {
      if (!selectedDomainId || loadingStates.updatingProvider) return

      const previousDomains = [...domains]
      setDomains((prev) => prev.map((d) => (d.id === selectedDomainId ? { ...d, emailProviderId: providerId } : d)))

      updateLoadingState("updatingProvider", true)

      try {
        const result = await updateDomainProvider(selectedDomainId, providerId)
        if (result.success) {
          toast.success("Email provider updated")
          // Invalidate cache
          delete dnsRecordsCache.current[selectedDomainId]
          await fetchDNSRecords(selectedDomainId)
        } else {
          setDomains(previousDomains)
          toast.error("Failed to update provider")
        }
      } catch (err) {
        setDomains(previousDomains)
        toast.error("Failed to update provider", {
          description: "Please try again.",
        })
      } finally {
        updateLoadingState("updatingProvider", false)
      }
    },
    [selectedDomainId, domains, loadingStates.updatingProvider, updateLoadingState, fetchDNSRecords],
  )

  const handleDomainChange = useCallback(
    (domainId: string) => {
      if (loadingStates.verifying) return // Prevent change during verification

      setSelectedDomainId(domainId)
      setLastVerification(null)
      setSelectorResult(null)
      setCustomSelector("")
      fetchDNSRecords(domainId)
    },
    [loadingStates.verifying, fetchDNSRecords],
  )

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied!", { description: `${label} copied to clipboard` })
  }, [])

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  const selectedDomain = domains.find((d) => d.id === selectedDomainId)
  const selectedProvider = providers.find((p) => p.id === selectedDomain?.emailProviderId)

  const spfRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "@")
  const dmarcRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "_dmarc")

  const getVerificationProgress = useCallback(() => {
    if (!selectedDomain) return 0
    let progress = 0
    if (selectedDomain.spfStatus === "VALID") progress += 30
    if (selectedDomain.dkimStatus === "VALID") progress += 35
    if (selectedDomain.dmarcStatus === "VALID") progress += 25
    if (selectedDomain.mxStatus === "VALID") progress += 10
    return progress
  }, [selectedDomain])

  const isLoading = loadingStates.domains || loadingStates.providers

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const StatusBadge = ({ status }: { status: string | null }) => {
    if (status === "VALID") {
      return (
        <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
          <CheckCircle2 className="mr-1 h-3 w-3" aria-hidden="true" />
          <span>Verified</span>
        </Badge>
      )
    }
    if (status === "INVALID") {
      return (
        <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-500/20">
          <XCircle className="mr-1 h-3 w-3" aria-hidden="true" />
          <span>Invalid</span>
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
        <Clock className="mr-1 h-3 w-3" aria-hidden="true" />
        <span>Pending</span>
      </Badge>
    )
  }

  // =============================================================================
  // OFFLINE BANNER - Added offline detection UI
  // =============================================================================

  if (!isOnline) {
    return (
      <Empty className="border border-destructive/20 bg-destructive/5">
        <EmptyHeader>
          <EmptyMedia>
            <WifiOff className="h-12 w-12 text-destructive" />
          </EmptyMedia>
          <EmptyTitle>You are offline</EmptyTitle>
          <EmptyDescription>Please check your internet connection to continue with DNS verification.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Connection
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  // =============================================================================
  // LOADING STATE
  // =============================================================================

  if (isLoading) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Spinner className="h-12 w-12 text-primary" />
          </EmptyMedia>
          <EmptyTitle>Loading Configuration</EmptyTitle>
          <EmptyDescription>Fetching your domain and DNS settings...</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  // =============================================================================
  // ERROR STATE - Added retry capability
  // =============================================================================

  if (error.type === "domains" && domains.length === 0) {
    return (
      <Empty className="border border-destructive/20 bg-destructive/5">
        <EmptyHeader>
          <EmptyMedia>
            <AlertCircle className="h-12 w-12 text-destructive" />
          </EmptyMedia>
          <EmptyTitle>Failed to Load Domains</EmptyTitle>
          <EmptyDescription>{error.message}</EmptyDescription>
        </EmptyHeader>
        {error.retryFn && (
          <EmptyContent>
            <Button onClick={error.retryFn} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </EmptyContent>
        )}
      </Empty>
    )
  }

  // =============================================================================
  // EMPTY STATE
  // =============================================================================

  if (domains.length === 0) {
    return (
      <Empty className="border bg-muted/30">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Server className="h-12 w-12" />
          </EmptyMedia>
          <EmptyTitle>No Domains Added</EmptyTitle>
          <EmptyDescription>
            Add a domain in the Domain Setup tab to get started with DNS configuration.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Domain
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div className="space-y-6">
      {/* Domain Selector & Progress - Added liquid glass effect */}
      <Card className="relative overflow-hidden">
        {/* Liquid Glass Effect Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

        <CardHeader className="relative pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">DNS Configuration</CardTitle>
              <CardDescription>Configure email authentication for your domain</CardDescription>
            </div>
            {selectedDomain && (
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/20 shadow-lg" />
                <div className="relative px-4 py-2 text-center">
                  <p
                    className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                    aria-label={`Health score: ${selectedDomain.healthScore || 0} percent`}
                  >
                    {selectedDomain.healthScore || 0}%
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">Health Score</p>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="relative space-y-4">
          {domains.length > 1 && (
            <div className="space-y-2">
              <Label htmlFor="domain-select" className="text-sm font-medium">
                Select Domain
              </Label>
              <Select
                value={selectedDomainId || ""}
                onValueChange={handleDomainChange}
                disabled={loadingStates.verifying}
              >
                <SelectTrigger id="domain-select" className="w-full" aria-label="Select a domain to configure">
                  <SelectValue placeholder="Select a domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem key={domain.id} value={domain.id}>
                      <span className="flex items-center gap-2">
                        {domain.domain}
                        {domain.isVerified && <CheckCircle2 className="h-3 w-3 text-green-500" aria-label="Verified" />}
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
            <Progress
              value={getVerificationProgress()}
              className="h-2"
              aria-label={`Verification progress: ${getVerificationProgress()} percent`}
            />
          </div>

          {/* Status Grid */}
          {selectedDomain && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3" role="list" aria-label="DNS record status">
              <div className="p-3 rounded-lg border bg-card" role="listitem">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">SPF</span>
                  <StatusBadge status={selectedDomain.spfStatus} />
                </div>
                <p className="text-xs text-muted-foreground">Sender authorization</p>
              </div>
              <div className="p-3 rounded-lg border bg-card" role="listitem">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">DKIM</span>
                  <StatusBadge status={selectedDomain.dkimStatus} />
                </div>
                <p className="text-xs text-muted-foreground">Email signatures</p>
              </div>
              <div className="p-3 rounded-lg border bg-card" role="listitem">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">DMARC</span>
                  <StatusBadge status={selectedDomain.dmarcStatus} />
                </div>
                <p className="text-xs text-muted-foreground">Policy enforcement</p>
              </div>
              <div className="p-3 rounded-lg border bg-card" role="listitem">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">MX</span>
                  <StatusBadge status={selectedDomain.mxStatus} />
                </div>
                <p className="text-xs text-muted-foreground">Mail routing (optional)</p>
              </div>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3" role="radiogroup" aria-label="Select email provider">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleProviderChange(provider.id)}
                disabled={loadingStates.updatingProvider}
                className={cn(
                  "p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  selectedDomain?.emailProviderId === provider.id ? "border-primary bg-primary/5" : "border-border",
                  loadingStates.updatingProvider && "opacity-50 cursor-not-allowed",
                )}
                role="radio"
                aria-checked={selectedDomain?.emailProviderId === provider.id}
                aria-label={`${provider.name} - ${provider.estimatedTime}`}
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
                    <a
                      href={selectedProvider.setupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${selectedProvider.name} setup in new tab`}
                    >
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
                  You must complete domain authentication in {selectedProvider.name} before the DKIM verification will
                  pass. Follow these steps:
                </AlertDescription>
              </Alert>
              <ol className="space-y-2 text-sm" aria-label="Setup instructions">
                {selectedProvider.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary"
                      aria-hidden="true"
                    >
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

      {/* DNS Records Configuration */}
      <Tabs defaultValue="spf" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="spf" className="gap-2">
            <Shield className="h-4 w-4" aria-hidden="true" />
            <span>SPF</span>
          </TabsTrigger>
          <TabsTrigger value="dkim" className="gap-2">
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span>DKIM</span>
          </TabsTrigger>
          <TabsTrigger value="dmarc" className="gap-2">
            <Shield className="h-4 w-4" aria-hidden="true" />
            <span>DMARC</span>
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
                  <div className="grid gap-2">
                    <Label className="text-xs font-medium text-muted-foreground">Record Type</Label>
                    <code className="rounded bg-muted px-3 py-2 text-sm">TXT</code>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs font-medium text-muted-foreground">Host / Name</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded bg-muted px-3 py-2 text-sm">@</code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard("@", "Host")}
                        aria-label="Copy host to clipboard"
                      >
                        <Copy className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Use @ or leave blank for root domain</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs font-medium text-muted-foreground">Value</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded bg-muted px-3 py-2 text-sm break-all">{spfRecord.value}</code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(spfRecord.value, "SPF record")}
                        aria-label="Copy SPF record to clipboard"
                      >
                        <Copy className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
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
              {/* DKIM Warning */}
              <Alert className="border-blue-500/20 bg-blue-500/5">
                <AlertCircle className="h-4 w-4 text-blue-500" aria-hidden="true" />
                <AlertTitle className="text-blue-600">DKIM is configured in your email provider</AlertTitle>
                <AlertDescription className="text-blue-600/80">
                  Unlike SPF and DMARC, DKIM records are generated by your email provider (
                  {selectedProvider?.name || "Google, Microsoft, etc."}). You must complete domain authentication there
                  first, then we can verify the record exists.
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

              {/* Manual Selector Check - Using Field and InputGroup components */}
              {selectedDomain?.dkimStatus !== "VALID" && (
                <div className="space-y-3">
                  <Separator />
                  <Field>
                    <FieldLabel htmlFor="custom-selector">Check Custom Selector</FieldLabel>
                    <FieldDescription>
                      If you know your DKIM selector (from your email provider), enter it here to verify.
                    </FieldDescription>
                    <InputGroup>
                      <InputGroupInput
                        id="custom-selector"
                        placeholder="e.g., google, selector1, s1"
                        value={customSelector}
                        onChange={(e) => setCustomSelector(e.target.value)}
                        maxLength={63}
                        aria-describedby="selector-hint"
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText className="text-muted-foreground text-xs">._domainkey</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          onClick={handleCheckCustomSelector}
                          disabled={loadingStates.checkingSelector || !customSelector.trim()}
                          aria-label="Check DKIM selector"
                        >
                          {loadingStates.checkingSelector ? (
                            <Spinner className="h-4 w-4" />
                          ) : (
                            <Search className="h-4 w-4" />
                          )}
                          <span className="ml-2 hidden sm:inline">Check</span>
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldDescription id="selector-hint" className="text-xs">
                      Only letters, numbers, hyphens, and underscores allowed (max 63 characters)
                    </FieldDescription>
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
                            ? "Record exists but may be misconfigured. Check that the DKIM key is correctly formatted."
                            : `No DKIM record found at ${customSelector}._domainkey.${selectedDomain?.domain}. If you just added it, wait 15-60 minutes for DNS propagation.`}
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
                  <div className="grid gap-2">
                    <Label className="text-xs font-medium text-muted-foreground">Record Type</Label>
                    <code className="rounded bg-muted px-3 py-2 text-sm">TXT</code>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs font-medium text-muted-foreground">Host / Name</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded bg-muted px-3 py-2 text-sm">_dmarc</code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard("_dmarc", "Host")}
                        aria-label="Copy host to clipboard"
                      >
                        <Copy className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs font-medium text-muted-foreground">Value</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded bg-muted px-3 py-2 text-sm break-all">{dmarcRecord.value}</code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(dmarcRecord.value, "DMARC record")}
                        aria-label="Copy DMARC record to clipboard"
                      >
                        <Copy className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
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
          <Button variant="ghost" className="w-full justify-between" aria-expanded={showDiagnostics}>
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" aria-hidden="true" />
              Diagnostics & Debug Info
            </span>
            {showDiagnostics ? (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            )}
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
                          ? new Date(lastVerification.diagnostics.timestamp).toLocaleString()
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
                    <div className="space-y-2" role="list" aria-label="Verification results">
                      {lastVerification.results?.map((result, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded bg-muted/50"
                          role="listitem"
                        >
                          <div className="flex items-center gap-2">
                            {result.valid ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
                            )}
                            <span className="font-medium">{result.type}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{result.message}</span>
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

      {/* Verify Button - Using Spinner in button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium">Ready to verify?</p>
              <p className="text-xs text-muted-foreground">
                {selectedDomain?.verificationAttempts || 0} verification attempts so far
              </p>
            </div>
            <Button
              onClick={handleVerify}
              disabled={loadingStates.verifying || !selectedDomainId}
              size="lg"
              className="gap-2"
              aria-label={loadingStates.verifying ? "Verifying DNS records" : "Verify DNS records"}
            >
              {loadingStates.verifying ? (
                <>
                  <Spinner className="h-4 w-4" />
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

          {/* Propagation Warning */}
          <Alert className="mt-4">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <AlertDescription className="text-sm">
              DNS changes can take 5 minutes to 48 hours to propagate. If verification fails, wait a bit and try again.
              You can also check your DNS propagation at{" "}
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
