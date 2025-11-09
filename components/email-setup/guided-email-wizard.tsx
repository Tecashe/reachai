// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Progress } from "@/components/ui/progress"
// import {
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   Loader2,
//   Copy,
//   ExternalLink,
//   ChevronRight,
//   ChevronLeft,
//   Shield,
//   Mail,
//   Server,
//   CheckCheck,
// } from "lucide-react"
// import { addDomain, verifyDomain } from "@/lib/actions/domain-action"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// type SetupStep = "welcome" | "add-domain" | "spf" | "dkim" | "dmarc" | "mx" | "verify" | "connect-accounts" | "complete"

// interface DNSRecord {
//   type: string
//   name: string
//   value: string
//   selector?: string
// }

// export function GuidedEmailWizard() {
//   const [currentStep, setCurrentStep] = useState<SetupStep>("welcome")
//   const [domain, setDomain] = useState("")
//   const [domainId, setDomainId] = useState("")
//   const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([])
//   const [loading, setLoading] = useState(false)
//   const [verificationResults, setVerificationResults] = useState<any>(null)
//   const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

//   const steps: { id: SetupStep; title: string; icon: any }[] = [
//     { id: "welcome", title: "Welcome", icon: CheckCheck },
//     { id: "add-domain", title: "Add Domain", icon: Server },
//     { id: "spf", title: "SPF Record", icon: Shield },
//     { id: "dkim", title: "DKIM Key", icon: Mail },
//     { id: "dmarc", title: "DMARC Policy", icon: Shield },
//     { id: "mx", title: "MX Records", icon: Server },
//     { id: "verify", title: "Verify", icon: CheckCircle2 },
//     { id: "connect-accounts", title: "Connect Accounts", icon: Mail },
//     { id: "complete", title: "Complete", icon: CheckCircle2 },
//   ]

//   const currentStepIndex = steps.findIndex((s) => s.id === currentStep)
//   const progress = ((currentStepIndex + 1) / steps.length) * 100

//   const handleAddDomain = async () => {
//     if (!domain) {
//       toast.error("Please enter a domain name")
//       return
//     }

//     setLoading(true)
//     try {
//       const result = await addDomain(domain)
//       if (result.success) {
//         setDomainId(result.domainId)
//         setDnsRecords(result.dnsRecords.records)
//         setCompletedSteps((prev) => new Set(prev).add("add-domain"))
//         toast.success("Domain added! Let's configure your DNS records")
//         setCurrentStep("spf")
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Failed to add domain")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleVerifyStep = async (step: SetupStep) => {
//     setLoading(true)
//     try {
//       const result = await verifyDomain(domainId)
//       setVerificationResults(result)

//       // Check which records are valid
//       const spfValid = result.results.find((r: any) => r.type === "SPF")?.valid
//       const dkimValid = result.results.find((r: any) => r.type === "DKIM")?.valid
//       const dmarcValid = result.results.find((r: any) => r.type === "DMARC")?.valid
//       const mxValid = result.results.find((r: any) => r.type === "MX")?.valid

//       if (step === "spf" && spfValid) {
//         setCompletedSteps((prev) => new Set(prev).add("spf"))
//         toast.success("SPF record verified!")
//         setCurrentStep("dkim")
//       } else if (step === "dkim" && dkimValid) {
//         setCompletedSteps((prev) => new Set(prev).add("dkim"))
//         toast.success("DKIM key verified!")
//         setCurrentStep("dmarc")
//       } else if (step === "dmarc" && dmarcValid) {
//         setCompletedSteps((prev) => new Set(prev).add("dmarc"))
//         toast.success("DMARC policy verified!")
//         setCurrentStep("mx")
//       } else if (step === "mx" && mxValid) {
//         setCompletedSteps((prev) => new Set(prev).add("mx"))
//         toast.success("MX records verified!")
//         setCurrentStep("verify")
//       } else {
//         toast.error("DNS record not found or invalid. Please check your configuration and try again.")
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Verification failed")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text)
//     toast.success("Copied to clipboard!")
//   }

//   const spfRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "@")
//   const dkimRecord = dnsRecords.find((r) => r.type === "CNAME" && r.name.includes("_domainkey"))
//   const dmarcRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "_dmarc")

//   return (
//     <div className="mx-auto max-w-4xl space-y-6">
//       {/* Progress Bar */}
//       <div className="space-y-2">
//         <div className="flex items-center justify-between text-sm">
//           <span className="font-medium">Setup Progress</span>
//           <span className="text-muted-foreground">
//             Step {currentStepIndex + 1} of {steps.length}
//           </span>
//         </div>
//         <Progress value={progress} className="h-2" />
//       </div>

//       {/* Step Indicators */}
//       <div className="flex items-center justify-between">
//         {steps.map((step, index) => {
//           const Icon = step.icon
//           const isComplete = completedSteps.has(step.id)
//           const isCurrent = currentStep === step.id
//           const isPast = index < currentStepIndex

//           return (
//             <div key={step.id} className="flex flex-col items-center gap-2">
//               <div
//                 className={cn(
//                   "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
//                   isCurrent && "border-primary bg-primary text-primary-foreground",
//                   isComplete && "border-green-500 bg-green-500 text-white",
//                   !isCurrent && !isComplete && !isPast && "border-muted-foreground/20 bg-background",
//                   isPast && !isComplete && "border-muted-foreground/50 bg-muted",
//                 )}
//               >
//                 {isComplete ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
//               </div>
//               <span className="hidden text-xs text-muted-foreground sm:block">{step.title}</span>
//             </div>
//           )
//         })}
//       </div>

//       {/* Welcome Step */}
//       {currentStep === "welcome" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Welcome to Email Setup</CardTitle>
//             <CardDescription>
//               Let's get your domain configured for sending emails with maximum deliverability.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <Alert>
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>What we'll do together</AlertTitle>
//               <AlertDescription>
//                 <ol className="mt-2 list-inside list-decimal space-y-1 text-sm">
//                   <li>Add your domain (e.g., yourbusiness.com)</li>
//                   <li>Configure SPF record to authorize your email servers</li>
//                   <li>Set up DKIM key to digitally sign your emails</li>
//                   <li>Add DMARC policy to protect against spoofing</li>
//                   <li>Verify MX records for email delivery</li>
//                   <li>Connect your email accounts</li>
//                 </ol>
//               </AlertDescription>
//             </Alert>

//             <div className="space-y-2 rounded-lg border p-4">
//               <h4 className="font-semibold">What you'll need:</h4>
//               <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
//                 <li>Access to your domain's DNS settings (GoDaddy, Cloudflare, Namecheap, etc.)</li>
//                 <li>About 10-15 minutes of your time</li>
//                 <li>Your domain name</li>
//               </ul>
//             </div>

//             <div className="rounded-lg bg-muted p-4">
//               <p className="text-sm">
//                 <strong>Don't worry!</strong> We'll guide you through every step with clear instructions. You don't need
//                 to be technical - we'll explain everything in simple terms.
//               </p>
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button onClick={() => setCurrentStep("add-domain")} className="w-full">
//               Let's Get Started
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* Add Domain Step */}
//       {currentStep === "add-domain" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Add Your Domain</CardTitle>
//             <CardDescription>Enter the domain you want to send emails from</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="domain">Domain Name</Label>
//               <Input
//                 id="domain"
//                 placeholder="yourbusiness.com"
//                 value={domain}
//                 onChange={(e) => setDomain(e.target.value.trim().toLowerCase())}
//                 disabled={loading}
//               />
//               <p className="text-sm text-muted-foreground">
//                 Enter your domain without http://, www, or any paths. Just the domain name.
//               </p>
//             </div>

//             <Alert>
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>Examples</AlertTitle>
//               <AlertDescription>
//                 <div className="mt-2 space-y-1 text-sm">
//                   <div className="flex items-center gap-2">
//                     <CheckCircle2 className="h-4 w-4 text-green-500" />
//                     <code>yourbusiness.com</code>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <CheckCircle2 className="h-4 w-4 text-green-500" />
//                     <code>company.io</code>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <XCircle className="h-4 w-4 text-red-500" />
//                     <code>https://www.yourbusiness.com</code>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <XCircle className="h-4 w-4 text-red-500" />
//                     <code>www.company.io</code>
//                   </div>
//                 </div>
//               </AlertDescription>
//             </Alert>
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             <Button variant="outline" onClick={() => setCurrentStep("welcome")}>
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <Button onClick={handleAddDomain} disabled={!domain || loading} className="flex-1">
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Add Domain & Generate DNS Records
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* SPF Record Step */}
//       {currentStep === "spf" && spfRecord && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Configure SPF Record</CardTitle>
//             <CardDescription>Sender Policy Framework - Authorize email servers</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <Alert>
//               <Shield className="h-4 w-4" />
//               <AlertTitle>What is SPF?</AlertTitle>
//               <AlertDescription>
//                 SPF tells email providers which servers are allowed to send emails from your domain. Think of it like a
//                 guest list - only approved servers can send emails on your behalf.
//               </AlertDescription>
//             </Alert>

//             <div className="space-y-4">
//               <div>
//                 <h4 className="mb-2 font-semibold">Step 1: Log into your domain provider</h4>
//                 <p className="text-sm text-muted-foreground">
//                   Go to your domain registrar (GoDaddy, Cloudflare, Namecheap, etc.) and find the DNS settings. It's
//                   usually under "DNS Management", "DNS Settings", or "Zone Editor".
//                 </p>
//               </div>

//               <Separator />

//               <div>
//                 <h4 className="mb-2 font-semibold">Step 2: Add a new TXT record</h4>
//                 <p className="mb-3 text-sm text-muted-foreground">
//                   Click "Add Record" or "Add DNS Record" and select TXT as the record type.
//                 </p>

//                 <div className="space-y-3 rounded-lg border p-4">
//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Record Type</Label>
//                     <div className="flex items-center gap-2">
//                       <code className="rounded bg-muted px-2 py-1">TXT</code>
//                     </div>
//                   </div>

//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Name / Host</Label>
//                     <div className="flex items-center gap-2">
//                       <code className="flex-1 rounded bg-muted px-2 py-1">{spfRecord.name}</code>
//                       <Button size="sm" variant="outline" onClick={() => copyToClipboard(spfRecord.name)}>
//                         <Copy className="h-4 w-4" />
//                       </Button>
//                     </div>
//                     <p className="text-xs text-muted-foreground">Use @ or leave blank for root domain</p>
//                   </div>

//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Value / TXT Value</Label>
//                     <div className="flex items-center gap-2">
//                       <code className="flex-1 rounded bg-muted px-2 py-1 text-xs">{spfRecord.value}</code>
//                       <Button size="sm" variant="outline" onClick={() => copyToClipboard(spfRecord.value)}>
//                         <Copy className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">TTL</Label>
//                     <code className="rounded bg-muted px-2 py-1">3600 (or Auto)</code>
//                   </div>
//                 </div>
//               </div>

//               <Separator />

//               <div>
//                 <h4 className="mb-2 font-semibold">Step 3: Save the record</h4>
//                 <p className="text-sm text-muted-foreground">
//                   Click "Save" or "Add Record". DNS changes can take 5-60 minutes to propagate worldwide.
//                 </p>
//               </div>
//             </div>

//             <Alert className="bg-blue-50 dark:bg-blue-950">
//               <AlertCircle className="h-4 w-4 text-blue-600" />
//               <AlertDescription className="text-blue-900 dark:text-blue-100">
//                 <strong>Have you added the SPF record?</strong>
//                 <br />
//                 Once you've saved the record in your DNS provider, click the button below to verify it.
//               </AlertDescription>
//             </Alert>
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             <Button variant="outline" onClick={() => setCurrentStep("add-domain")} disabled={loading}>
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <Button onClick={() => handleVerifyStep("spf")} disabled={loading} className="flex-1">
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               I've Added It - Verify SPF Record
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* DKIM Record Step */}
//       {currentStep === "dkim" && dkimRecord && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Configure DKIM Key</CardTitle>
//             <CardDescription>DomainKeys Identified Mail - Sign your emails</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <Alert>
//               <Mail className="h-4 w-4" />
//               <AlertTitle>What is DKIM?</AlertTitle>
//               <AlertDescription>
//                 DKIM adds a digital signature to your emails, proving they actually came from you and weren't tampered
//                 with. Think of it like a wax seal on an envelope.
//               </AlertDescription>
//             </Alert>

//             <div className="space-y-4">
//               <div>
//                 <h4 className="mb-2 font-semibold">Step 1: Add a new CNAME record</h4>
//                 <p className="text-sm text-muted-foreground">
//                   In your DNS settings, click "Add Record" and select CNAME as the record type.
//                 </p>
//               </div>

//               <Separator />

//               <div className="space-y-3 rounded-lg border p-4">
//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">Record Type</Label>
//                   <code className="rounded bg-muted px-2 py-1">CNAME</code>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">Name / Host</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 rounded bg-muted px-2 py-1 text-xs">{dkimRecord.name}</code>
//                     <Button size="sm" variant="outline" onClick={() => copyToClipboard(dkimRecord.name)}>
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     This is your DKIM selector - it must be exactly as shown
//                   </p>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">Value / Points To</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 rounded bg-muted px-2 py-1 text-xs">{dkimRecord.value}</code>
//                     <Button size="sm" variant="outline" onClick={() => copyToClipboard(dkimRecord.value)}>
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">TTL</Label>
//                   <code className="rounded bg-muted px-2 py-1">3600 (or Auto)</code>
//                 </div>
//               </div>

//               <Alert className="bg-amber-50 dark:bg-amber-950">
//                 <AlertCircle className="h-4 w-4 text-amber-600" />
//                 <AlertDescription className="text-amber-900 dark:text-amber-100">
//                   <strong>Important:</strong> Some DNS providers (like GoDaddy) automatically add your domain to the
//                   end. If that happens, remove the duplicate domain part.
//                 </AlertDescription>
//               </Alert>
//             </div>
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             <Button variant="outline" onClick={() => setCurrentStep("spf")} disabled={loading}>
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <Button onClick={() => handleVerifyStep("dkim")} disabled={loading} className="flex-1">
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               I've Added It - Verify DKIM Key
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* DMARC Record Step */}
//       {currentStep === "dmarc" && dmarcRecord && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Configure DMARC Policy</CardTitle>
//             <CardDescription>Domain-based Message Authentication - Protect your brand</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <Alert>
//               <Shield className="h-4 w-4" />
//               <AlertTitle>What is DMARC?</AlertTitle>
//               <AlertDescription>
//                 DMARC tells email providers what to do if an email fails SPF or DKIM checks. It protects your domain
//                 from being used in phishing attacks. Think of it as your security policy.
//               </AlertDescription>
//             </Alert>

//             <div className="space-y-4">
//               <div>
//                 <h4 className="mb-2 font-semibold">Add a new TXT record for DMARC</h4>
//                 <p className="text-sm text-muted-foreground">
//                   In your DNS settings, add another TXT record with these values:
//                 </p>
//               </div>

//               <Separator />

//               <div className="space-y-3 rounded-lg border p-4">
//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">Record Type</Label>
//                   <code className="rounded bg-muted px-2 py-1">TXT</code>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">Name / Host</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 rounded bg-muted px-2 py-1">{dmarcRecord.name}</code>
//                     <Button size="sm" variant="outline" onClick={() => copyToClipboard(dmarcRecord.name)}>
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <p className="text-xs text-muted-foreground">Must be exactly _dmarc</p>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">Value / TXT Value</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 rounded bg-muted px-2 py-1 text-xs">{dmarcRecord.value}</code>
//                     <Button size="sm" variant="outline" onClick={() => copyToClipboard(dmarcRecord.value)}>
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     This policy quarantines suspicious emails and sends you reports
//                   </p>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">TTL</Label>
//                   <code className="rounded bg-muted px-2 py-1">3600 (or Auto)</code>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             <Button variant="outline" onClick={() => setCurrentStep("dkim")} disabled={loading}>
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <Button onClick={() => handleVerifyStep("dmarc")} disabled={loading} className="flex-1">
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               I've Added It - Verify DMARC Policy
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* MX Records Step */}
//       {currentStep === "mx" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Verify MX Records</CardTitle>
//             <CardDescription>Mail Exchange - Ensure email delivery works</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <Alert>
//               <Server className="h-4 w-4" />
//               <AlertTitle>What are MX Records?</AlertTitle>
//               <AlertDescription>
//                 MX records direct incoming emails to the right mail servers. Most domains already have these configured
//                 by their email provider (Gmail, Outlook, etc.). We just need to verify they exist.
//               </AlertDescription>
//             </Alert>

//             <div className="rounded-lg border p-4">
//               <h4 className="mb-2 font-semibold">What to check:</h4>
//               <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
//                 <li>Your domain should already have MX records from your email provider</li>
//                 <li>If you use Gmail for Work, you'll see Google's mail servers</li>
//                 <li>If you use Office 365, you'll see Microsoft's mail servers</li>
//                 <li>You don't need to add anything - we're just verifying they exist</li>
//               </ul>
//             </div>

//             <Alert className="bg-green-50 dark:bg-green-950">
//               <CheckCircle2 className="h-4 w-4 text-green-600" />
//               <AlertDescription className="text-green-900 dark:text-green-100">
//                 <strong>Good news!</strong> Most domains already have MX records. Click below to verify yours are set up
//                 correctly.
//               </AlertDescription>
//             </Alert>
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             <Button variant="outline" onClick={() => setCurrentStep("dmarc")} disabled={loading}>
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <Button onClick={() => handleVerifyStep("mx")} disabled={loading} className="flex-1">
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Verify MX Records
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* Final Verification Step */}
//       {currentStep === "verify" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Final Verification</CardTitle>
//             <CardDescription>Let's make sure everything is configured correctly</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {verificationResults && (
//               <div className="space-y-3">
//                 {verificationResults.results.map((result: any) => (
//                   <div
//                     key={result.type}
//                     className={cn(
//                       "flex items-center justify-between rounded-lg border p-3",
//                       result.valid
//                         ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
//                         : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950",
//                     )}
//                   >
//                     <div className="flex items-center gap-3">
//                       {result.valid ? (
//                         <CheckCircle2 className="h-5 w-5 text-green-600" />
//                       ) : (
//                         <XCircle className="h-5 w-5 text-red-600" />
//                       )}
//                       <div>
//                         <p className="font-medium">{result.type}</p>
//                         {result.message && <p className="text-sm text-muted-foreground">{result.message}</p>}
//                       </div>
//                     </div>
//                     <Badge variant={result.valid ? "default" : "destructive"}>
//                       {result.valid ? "Verified" : "Not Found"}
//                     </Badge>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {verificationResults?.verified ? (
//               <Alert className="bg-green-50 dark:bg-green-950">
//                 <CheckCircle2 className="h-4 w-4 text-green-600" />
//                 <AlertTitle className="text-green-900 dark:text-green-100">
//                   Perfect! All DNS records verified
//                 </AlertTitle>
//                 <AlertDescription className="text-green-900 dark:text-green-100">
//                   Your domain is fully configured and ready to send emails with maximum deliverability.
//                 </AlertDescription>
//               </Alert>
//             ) : (
//               <Alert>
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertTitle>Some records need attention</AlertTitle>
//                 <AlertDescription>
//                   DNS changes can take up to 60 minutes to propagate. If you just added the records, please wait a few
//                   minutes and try again.
//                 </AlertDescription>
//               </Alert>
//             )}
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             {!verificationResults?.verified && (
//               <Button variant="outline" onClick={() => setCurrentStep("spf")} disabled={loading}>
//                 <ChevronLeft className="mr-2 h-4 w-4" />
//                 Review Records
//               </Button>
//             )}
//             <Button
//               onClick={() => setCurrentStep("connect-accounts")}
//               disabled={!verificationResults?.verified}
//               className="flex-1"
//             >
//               Continue to Connect Accounts
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* Connect Accounts Step */}
//       {currentStep === "connect-accounts" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Connect Your Email Accounts</CardTitle>
//             <CardDescription>Add email accounts to start sending campaigns</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <Alert>
//               <Mail className="h-4 w-4" />
//               <AlertTitle>Ready to connect accounts</AlertTitle>
//               <AlertDescription>
//                 Now that your domain is verified, you can connect multiple email accounts from this domain. We'll
//                 automatically rotate between them to maximize deliverability.
//               </AlertDescription>
//             </Alert>

//             <div className="rounded-lg border p-4">
//               <h4 className="mb-2 font-semibold">What you can connect:</h4>
//               <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
//                 <li>Gmail accounts from your domain</li>
//                 <li>Outlook/Microsoft 365 accounts</li>
//                 <li>Resend API keys</li>
//               </ul>
//             </div>

//             <Alert className="bg-blue-50 dark:bg-blue-950">
//               <AlertCircle className="h-4 w-4 text-blue-600" />
//               <AlertDescription className="text-blue-900 dark:text-blue-100">
//                 <strong>Pro Tip:</strong> Connect 3-5 email accounts from your verified domain for best results. We'll
//                 automatically distribute your emails across them to prevent any single account from sending too much.
//               </AlertDescription>
//             </Alert>
//           </CardContent>
//           <CardFooter>
//             <Button onClick={() => (window.location.href = "/dashboard/settings")} className="w-full">
//               Go to Settings to Connect Accounts
//               <ExternalLink className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}
//     </div>
//   )
// }

// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Progress } from "@/components/ui/progress"
// import {
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   Loader2,
//   Copy,
//   ExternalLink,
//   ChevronRight,
//   ChevronLeft,
//   Shield,
//   Mail,
//   Server,
//   CheckCheck,
// } from "lucide-react"
// import { addDomain, verifyDomain } from "@/lib/actions/domain-action"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// type SetupStep = "welcome" | "add-domain" | "spf" | "dkim" | "dmarc" | "mx" | "verify" | "connect-accounts" | "complete"

// interface DNSRecord {
//   type: string
//   name: string
//   value: string
//   selector?: string
// }

// export function GuidedEmailWizard() {
//   const [currentStep, setCurrentStep] = useState<SetupStep>("welcome")
//   const [domain, setDomain] = useState("")
//   const [domainId, setDomainId] = useState("")
//   const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([])
//   const [loading, setLoading] = useState(false)
//   const [verificationResults, setVerificationResults] = useState<any>(null)
//   const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

//   const steps: { id: SetupStep; title: string; icon: any }[] = [
//     { id: "welcome", title: "Welcome", icon: CheckCheck },
//     { id: "add-domain", title: "Add Domain", icon: Server },
//     { id: "spf", title: "SPF Record", icon: Shield },
//     { id: "dkim", title: "DKIM Key", icon: Mail },
//     { id: "dmarc", title: "DMARC Policy", icon: Shield },
//     { id: "mx", title: "MX Records", icon: Server },
//     { id: "verify", title: "Verify", icon: CheckCircle2 },
//     { id: "connect-accounts", title: "Connect Accounts", icon: Mail },
//     { id: "complete", title: "Complete", icon: CheckCircle2 },
//   ]

//   const currentStepIndex = steps.findIndex((s) => s.id === currentStep)
//   const progress = ((currentStepIndex + 1) / steps.length) * 100

//   const handleAddDomain = async () => {
//     if (!domain) {
//       toast.error("Please enter a domain name")
//       return
//     }

//     setLoading(true)
//     try {
//       const result = await addDomain(domain)

//       if (result.success === false) {
//         toast.error("Failed to add domain")
//         return
//       }

//       if (result.success) {
//         setDomainId(result.domainId)
//         setDnsRecords(result.dnsRecords.records)
//         setCompletedSteps((prev) => new Set(prev).add("add-domain"))
//         toast.success("Domain added! Let's configure your DNS records")
//         setCurrentStep("spf")
//       }
//     } catch (error: any) {
//       if (error.message.includes("limit reached")) {
//         toast.error(error.message, { duration: 5000 })
//       } else {
//         toast.error(error.message || "Failed to add domain")
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleVerifyStep = async (step: SetupStep) => {
//     setLoading(true)
//     try {
//       const result = await verifyDomain(domainId)
//       setVerificationResults(result)

//       // Check which records are valid
//       const spfValid = result.results.find((r: any) => r.type === "SPF")?.valid
//       const dkimValid = result.results.find((r: any) => r.type === "DKIM")?.valid
//       const dmarcValid = result.results.find((r: any) => r.type === "DMARC")?.valid
//       const mxValid = result.results.find((r: any) => r.type === "MX")?.valid

//       if (step === "spf" && spfValid) {
//         setCompletedSteps((prev) => new Set(prev).add("spf"))
//         toast.success("SPF record verified!")
//         setCurrentStep("dkim")
//       } else if (step === "dkim" && dkimValid) {
//         setCompletedSteps((prev) => new Set(prev).add("dkim"))
//         toast.success("DKIM key verified!")
//         setCurrentStep("dmarc")
//       } else if (step === "dmarc" && dmarcValid) {
//         setCompletedSteps((prev) => new Set(prev).add("dmarc"))
//         toast.success("DMARC policy verified!")
//         setCurrentStep("mx")
//       } else if (step === "mx" && mxValid) {
//         setCompletedSteps((prev) => new Set(prev).add("mx"))
//         toast.success("MX records verified!")
//         setCurrentStep("verify")
//       } else {
//         toast.error("DNS record not found or invalid. Please check your configuration and try again.")
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Verification failed")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text)
//     toast.success("Copied to clipboard!")
//   }

//   const spfRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "@")
//   const dkimRecord = dnsRecords.find((r) => r.type === "CNAME" && r.name.includes("_domainkey"))
//   const dmarcRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "_dmarc")

//   return (
//     <div className="mx-auto max-w-4xl space-y-6">
//       {/* Progress Bar */}
//       <div className="space-y-2">
//         <div className="flex items-center justify-between text-sm">
//           <span className="font-medium">Setup Progress</span>
//           <span className="text-muted-foreground">
//             Step {currentStepIndex + 1} of {steps.length}
//           </span>
//         </div>
//         <Progress value={progress} className="h-2" />
//       </div>

//       {/* Step Indicators */}
//       <div className="flex items-center justify-between">
//         {steps.map((step, index) => {
//           const Icon = step.icon
//           const isComplete = completedSteps.has(step.id)
//           const isCurrent = currentStep === step.id
//           const isPast = index < currentStepIndex

//           return (
//             <div key={step.id} className="flex flex-col items-center gap-2">
//               <div
//                 className={cn(
//                   "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
//                   isCurrent && "border-primary bg-primary text-primary-foreground",
//                   isComplete && "border-green-500 bg-green-500 text-white",
//                   !isCurrent && !isComplete && !isPast && "border-muted-foreground/20 bg-background",
//                   isPast && !isComplete && "border-muted-foreground/50 bg-muted",
//                 )}
//               >
//                 {isComplete ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
//               </div>
//               <span className="hidden text-xs text-muted-foreground sm:block">{step.title}</span>
//             </div>
//           )
//         })}
//       </div>

//       {/* Welcome Step */}
//       {currentStep === "welcome" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Welcome to Email Setup</CardTitle>
//             <CardDescription>
//               Let's get your domain configured for sending emails with maximum deliverability.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <Alert>
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>What we'll do together</AlertTitle>
//               <AlertDescription>
//                 <ol className="mt-2 list-inside list-decimal space-y-1 text-sm">
//                   <li>Add your domain (e.g., yourbusiness.com)</li>
//                   <li>Configure SPF record to authorize your email servers</li>
//                   <li>Set up DKIM key to digitally sign your emails</li>
//                   <li>Add DMARC policy to protect against spoofing</li>
//                   <li>Verify MX records for email delivery</li>
//                   <li>Connect your email accounts</li>
//                 </ol>
//               </AlertDescription>
//             </Alert>

//             <div className="space-y-2 rounded-lg border p-4">
//               <h4 className="font-semibold">What you'll need:</h4>
//               <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
//                 <li>Access to your domain's DNS settings (GoDaddy, Cloudflare, Namecheap, etc.)</li>
//                 <li>About 10-15 minutes of your time</li>
//                 <li>Your domain name</li>
//               </ul>
//             </div>

//             <div className="rounded-lg bg-muted p-4">
//               <p className="text-sm">
//                 <strong>Don't worry!</strong> We'll guide you through every step with clear instructions. You don't need
//                 to be technical - we'll explain everything in simple terms.
//               </p>
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button onClick={() => setCurrentStep("add-domain")} className="w-full">
//               Let's Get Started
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* Add Domain Step */}
//       {currentStep === "add-domain" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Add Your Domain</CardTitle>
//             <CardDescription>Enter the domain you want to send emails from</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="domain">Domain Name</Label>
//               <Input
//                 id="domain"
//                 placeholder="yourbusiness.com"
//                 value={domain}
//                 onChange={(e) => setDomain(e.target.value.trim().toLowerCase())}
//                 disabled={loading}
//               />
//               <p className="text-sm text-muted-foreground">
//                 Enter your domain without http://, www, or any paths. Just the domain name.
//               </p>
//             </div>

//             <Alert>
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>Examples</AlertTitle>
//               <AlertDescription>
//                 <div className="mt-2 space-y-1 text-sm">
//                   <div className="flex items-center gap-2">
//                     <CheckCircle2 className="h-4 w-4 text-green-500" />
//                     <code>yourbusiness.com</code>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <CheckCircle2 className="h-4 w-4 text-green-500" />
//                     <code>company.io</code>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <XCircle className="h-4 w-4 text-red-500" />
//                     <code>https://www.yourbusiness.com</code>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <XCircle className="h-4 w-4 text-red-500" />
//                     <code>www.company.io</code>
//                   </div>
//                 </div>
//               </AlertDescription>
//             </Alert>
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             <Button variant="outline" onClick={() => setCurrentStep("welcome")}>
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <Button onClick={handleAddDomain} disabled={!domain || loading} className="flex-1">
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Add Domain & Generate DNS Records
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* SPF Record Step */}
//       {currentStep === "spf" && spfRecord && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Configure SPF Record</CardTitle>
//             <CardDescription>Sender Policy Framework - Authorize email servers</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <Alert>
//               <Shield className="h-4 w-4" />
//               <AlertTitle>What is SPF?</AlertTitle>
//               <AlertDescription>
//                 SPF tells email providers which servers are allowed to send emails from your domain. Think of it like a
//                 guest list - only approved servers can send emails on your behalf.
//               </AlertDescription>
//             </Alert>

//             <div className="space-y-4">
//               <div>
//                 <h4 className="mb-2 font-semibold">Step 1: Log into your domain provider</h4>
//                 <p className="text-sm text-muted-foreground">
//                   Go to your domain registrar (GoDaddy, Cloudflare, Namecheap, etc.) and find the DNS settings. It's
//                   usually under "DNS Management", "DNS Settings", or "Zone Editor".
//                 </p>
//               </div>

//               <Separator />

//               <div>
//                 <h4 className="mb-2 font-semibold">Step 2: Add a new TXT record</h4>
//                 <p className="mb-3 text-sm text-muted-foreground">
//                   Click "Add Record" or "Add DNS Record" and select TXT as the record type.
//                 </p>

//                 <div className="space-y-3 rounded-lg border p-4">
//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Record Type</Label>
//                     <div className="flex items-center gap-2">
//                       <code className="rounded bg-muted px-2 py-1">TXT</code>
//                     </div>
//                   </div>

//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Name / Host</Label>
//                     <div className="flex items-center gap-2">
//                       <code className="flex-1 rounded bg-muted px-2 py-1">{spfRecord.name}</code>
//                       <Button size="sm" variant="outline" onClick={() => copyToClipboard(spfRecord.name)}>
//                         <Copy className="h-4 w-4" />
//                       </Button>
//                     </div>
//                     <p className="text-xs text-muted-foreground">Use @ or leave blank for root domain</p>
//                   </div>

//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Value / TXT Value</Label>
//                     <div className="flex items-center gap-2">
//                       <code className="flex-1 rounded bg-muted px-2 py-1 text-xs">{spfRecord.value}</code>
//                       <Button size="sm" variant="outline" onClick={() => copyToClipboard(spfRecord.value)}>
//                         <Copy className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">TTL</Label>
//                     <code className="rounded bg-muted px-2 py-1">3600 (or Auto)</code>
//                   </div>
//                 </div>
//               </div>

//               <Separator />

//               <div>
//                 <h4 className="mb-2 font-semibold">Step 3: Save the record</h4>
//                 <p className="text-sm text-muted-foreground">
//                   Click "Save" or "Add Record". DNS changes can take 5-60 minutes to propagate worldwide.
//                 </p>
//               </div>
//             </div>

//             <Alert className="bg-blue-50 dark:bg-blue-950">
//               <AlertCircle className="h-4 w-4 text-blue-600" />
//               <AlertDescription className="text-blue-900 dark:text-blue-100">
//                 <strong>Have you added the SPF record?</strong>
//                 <br />
//                 Once you've saved the record in your DNS provider, click the button below to verify it.
//               </AlertDescription>
//             </Alert>
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             <Button variant="outline" onClick={() => setCurrentStep("add-domain")} disabled={loading}>
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <Button onClick={() => handleVerifyStep("spf")} disabled={loading} className="flex-1">
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               I've Added It - Verify SPF Record
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* DKIM Record Step */}
//       {currentStep === "dkim" && dkimRecord && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Configure DKIM Key</CardTitle>
//             <CardDescription>DomainKeys Identified Mail - Sign your emails</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <Alert>
//               <Mail className="h-4 w-4" />
//               <AlertTitle>What is DKIM?</AlertTitle>
//               <AlertDescription>
//                 DKIM adds a digital signature to your emails, proving they actually came from you and weren't tampered
//                 with. Think of it like a wax seal on an envelope.
//               </AlertDescription>
//             </Alert>

//             <div className="space-y-4">
//               <div>
//                 <h4 className="mb-2 font-semibold">Step 1: Add a new CNAME record</h4>
//                 <p className="text-sm text-muted-foreground">
//                   In your DNS settings, click "Add Record" and select CNAME as the record type.
//                 </p>
//               </div>

//               <Separator />

//               <div className="space-y-3 rounded-lg border p-4">
//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">Record Type</Label>
//                   <code className="rounded bg-muted px-2 py-1">CNAME</code>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">Name / Host</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 rounded bg-muted px-2 py-1 text-xs">{dkimRecord.name}</code>
//                     <Button size="sm" variant="outline" onClick={() => copyToClipboard(dkimRecord.name)}>
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     This is your DKIM selector - it must be exactly as shown
//                   </p>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">Value / Points To</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 rounded bg-muted px-2 py-1 text-xs">{dkimRecord.value}</code>
//                     <Button size="sm" variant="outline" onClick={() => copyToClipboard(dkimRecord.value)}>
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">TTL</Label>
//                   <code className="rounded bg-muted px-2 py-1">3600 (or Auto)</code>
//                 </div>
//               </div>

//               <Alert className="bg-amber-50 dark:bg-amber-950">
//                 <AlertCircle className="h-4 w-4 text-amber-600" />
//                 <AlertDescription className="text-amber-900 dark:text-amber-100">
//                   <strong>Important:</strong> Some DNS providers (like GoDaddy) automatically add your domain to the
//                   end. If that happens, remove the duplicate domain part.
//                 </AlertDescription>
//               </Alert>
//             </div>
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             <Button variant="outline" onClick={() => setCurrentStep("spf")} disabled={loading}>
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <Button onClick={() => handleVerifyStep("dkim")} disabled={loading} className="flex-1">
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               I've Added It - Verify DKIM Key
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* DMARC Record Step */}
//       {currentStep === "dmarc" && dmarcRecord && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Configure DMARC Policy</CardTitle>
//             <CardDescription>Domain-based Message Authentication - Protect your brand</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <Alert>
//               <Shield className="h-4 w-4" />
//               <AlertTitle>What is DMARC?</AlertTitle>
//               <AlertDescription>
//                 DMARC tells email providers what to do if an email fails SPF or DKIM checks. It protects your domain
//                 from being used in phishing attacks. Think of it as your security policy.
//               </AlertDescription>
//             </Alert>

//             <div className="space-y-4">
//               <div>
//                 <h4 className="mb-2 font-semibold">Add a new TXT record for DMARC</h4>
//                 <p className="text-sm text-muted-foreground">
//                   In your DNS settings, add another TXT record with these values:
//                 </p>
//               </div>

//               <Separator />

//               <div className="space-y-3 rounded-lg border p-4">
//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">Record Type</Label>
//                   <code className="rounded bg-muted px-2 py-1">TXT</code>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">Name / Host</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 rounded bg-muted px-2 py-1">{dmarcRecord.name}</code>
//                     <Button size="sm" variant="outline" onClick={() => copyToClipboard(dmarcRecord.name)}>
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <p className="text-xs text-muted-foreground">Must be exactly _dmarc</p>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">Value / TXT Value</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 rounded bg-muted px-2 py-1 text-xs">{dmarcRecord.value}</code>
//                     <Button size="sm" variant="outline" onClick={() => copyToClipboard(dmarcRecord.value)}>
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     This policy quarantines suspicious emails and sends you reports
//                   </p>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">TTL</Label>
//                   <code className="rounded bg-muted px-2 py-1">3600 (or Auto)</code>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             <Button variant="outline" onClick={() => setCurrentStep("dkim")} disabled={loading}>
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <Button onClick={() => handleVerifyStep("dmarc")} disabled={loading} className="flex-1">
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               I've Added It - Verify DMARC Policy
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* MX Records Step */}
//       {currentStep === "mx" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Verify MX Records</CardTitle>
//             <CardDescription>Mail Exchange - Ensure email delivery works</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <Alert>
//               <Server className="h-4 w-4" />
//               <AlertTitle>What are MX Records?</AlertTitle>
//               <AlertDescription>
//                 MX records direct incoming emails to the right mail servers. Most domains already have these configured
//                 by their email provider (Gmail, Outlook, etc.). We just need to verify they exist.
//               </AlertDescription>
//             </Alert>

//             <div className="rounded-lg border p-4">
//               <h4 className="mb-2 font-semibold">What to check:</h4>
//               <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
//                 <li>Your domain should already have MX records from your email provider</li>
//                 <li>If you use Gmail for Work, you'll see Google's mail servers</li>
//                 <li>If you use Office 365, you'll see Microsoft's mail servers</li>
//                 <li>You don't need to add anything - we're just verifying they exist</li>
//               </ul>
//             </div>

//             <Alert className="bg-green-50 dark:bg-green-950">
//               <CheckCircle2 className="h-4 w-4 text-green-600" />
//               <AlertDescription className="text-green-900 dark:text-green-100">
//                 <strong>Good news!</strong> Most domains already have MX records. Click below to verify yours are set up
//                 correctly.
//               </AlertDescription>
//             </Alert>
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             <Button variant="outline" onClick={() => setCurrentStep("dmarc")} disabled={loading}>
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <Button onClick={() => handleVerifyStep("mx")} disabled={loading} className="flex-1">
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Verify MX Records
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* Final Verification Step */}
//       {currentStep === "verify" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Final Verification</CardTitle>
//             <CardDescription>Let's make sure everything is configured correctly</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {verificationResults && (
//               <div className="space-y-3">
//                 {verificationResults.results.map((result: any) => (
//                   <div
//                     key={result.type}
//                     className={cn(
//                       "flex items-center justify-between rounded-lg border p-3",
//                       result.valid
//                         ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
//                         : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950",
//                     )}
//                   >
//                     <div className="flex items-center gap-3">
//                       {result.valid ? (
//                         <CheckCircle2 className="h-5 w-5 text-green-600" />
//                       ) : (
//                         <XCircle className="h-5 w-5 text-red-600" />
//                       )}
//                       <div>
//                         <p className="font-medium">{result.type}</p>
//                         {result.message && <p className="text-sm text-muted-foreground">{result.message}</p>}
//                       </div>
//                     </div>
//                     <Badge variant={result.valid ? "default" : "destructive"}>
//                       {result.valid ? "Verified" : "Not Found"}
//                     </Badge>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {verificationResults?.verified ? (
//               <Alert className="bg-green-50 dark:bg-green-950">
//                 <CheckCircle2 className="h-4 w-4 text-green-600" />
//                 <AlertTitle className="text-green-900 dark:text-green-100">
//                   Perfect! All DNS records verified
//                 </AlertTitle>
//                 <AlertDescription className="text-green-900 dark:text-green-100">
//                   Your domain is fully configured and ready to send emails with maximum deliverability.
//                 </AlertDescription>
//               </Alert>
//             ) : (
//               <Alert>
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertTitle>Some records need attention</AlertTitle>
//                 <AlertDescription>
//                   DNS changes can take up to 60 minutes to propagate. If you just added the records, please wait a few
//                   minutes and try again.
//                 </AlertDescription>
//               </Alert>
//             )}
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             {!verificationResults?.verified && (
//               <Button variant="outline" onClick={() => setCurrentStep("spf")} disabled={loading}>
//                 <ChevronLeft className="mr-2 h-4 w-4" />
//                 Review Records
//               </Button>
//             )}
//             <Button
//               onClick={() => setCurrentStep("connect-accounts")}
//               disabled={!verificationResults?.verified}
//               className="flex-1"
//             >
//               Continue to Connect Accounts
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* Connect Accounts Step */}
//       {currentStep === "connect-accounts" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Connect Your Email Accounts</CardTitle>
//             <CardDescription>Add email accounts to start sending campaigns</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <Alert>
//               <Mail className="h-4 w-4" />
//               <AlertTitle>Ready to connect accounts</AlertTitle>
//               <AlertDescription>
//                 Now that your domain is verified, you can connect multiple email accounts from this domain. We'll
//                 automatically rotate between them to maximize deliverability.
//               </AlertDescription>
//             </Alert>

//             <div className="rounded-lg border p-4">
//               <h4 className="mb-2 font-semibold">What you can connect:</h4>
//               <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
//                 <li>Gmail accounts from your domain</li>
//                 <li>Outlook/Microsoft 365 accounts</li>
//                 <li>Resend API keys</li>
//               </ul>
//             </div>

//             <Alert className="bg-blue-50 dark:bg-blue-950">
//               <AlertCircle className="h-4 w-4 text-blue-600" />
//               <AlertDescription className="text-blue-900 dark:text-blue-100">
//                 <strong>Pro Tip:</strong> Connect 3-5 email accounts from your verified domain for best results. We'll
//                 automatically distribute your emails across them to prevent any single account from sending too much.
//               </AlertDescription>
//             </Alert>
//           </CardContent>
//           <CardFooter>
//             <Button onClick={() => (window.location.href = "/dashboard/settings")} className="w-full">
//               Go to Settings to Connect Accounts
//               <ExternalLink className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}
//     </div>
//   )
// }


// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Progress } from "@/components/ui/progress"
// import {
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   Loader2,
//   Copy,
//   ExternalLink,
//   ChevronRight,
//   ChevronLeft,
//   Shield,
//   Mail,
//   Server,
//   CheckCheck,
// } from "lucide-react"
// import { addDomain, verifyDomain } from "@/lib/actions/domain-action"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// type SetupStep = "welcome" | "add-domain" | "spf" | "dkim" | "dmarc" | "mx" | "verify" | "connect-accounts" | "complete"

// interface DNSRecord {
//   type: string
//   name: string
//   value: string
//   selector?: string
// }

// export function GuidedEmailWizard() {
//   const [currentStep, setCurrentStep] = useState<SetupStep>("welcome")
//   const [domain, setDomain] = useState("")
//   const [domainId, setDomainId] = useState("")
//   const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([])
//   const [loading, setLoading] = useState(false)
//   const [verificationResults, setVerificationResults] = useState<any>(null)
//   const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

//   const steps: { id: SetupStep; title: string; icon: any }[] = [
//     { id: "welcome", title: "Welcome", icon: CheckCheck },
//     { id: "add-domain", title: "Add Domain", icon: Server },
//     { id: "spf", title: "SPF Record", icon: Shield },
//     { id: "dkim", title: "DKIM Key", icon: Mail },
//     { id: "dmarc", title: "DMARC Policy", icon: Shield },
//     { id: "mx", title: "MX Records", icon: Server },
//     { id: "verify", title: "Verify", icon: CheckCircle2 },
//     { id: "connect-accounts", title: "Connect Accounts", icon: Mail },
//     { id: "complete", title: "Complete", icon: CheckCircle2 },
//   ]

//   const currentStepIndex = steps.findIndex((s) => s.id === currentStep)
//   const progress = ((currentStepIndex + 1) / steps.length) * 100

//   const handleAddDomain = async () => {
//     if (!domain) {
//       toast.error("Please enter a domain name")
//       return
//     }

//     setLoading(true)
//     try {
//       const result = await addDomain(domain)

//       if (result.success === false) {
//         toast.error(result.error || "Failed to add domain")
//         return
//       }

//       if (result.success && result.domainId && result.dnsRecords) {
//         setDomainId(result.domainId)
//         setDnsRecords(result.dnsRecords.records)
//         setCompletedSteps((prev) => new Set(prev).add("add-domain"))
//         toast.success("Domain added! Let's configure your DNS records")
//         setCurrentStep("spf")
//       }
//     } catch (error: any) {
//       if (error.message.includes("limit reached")) {
//         toast.error(error.message, { duration: 5000 })
//       } else {
//         toast.error(error.message || "Failed to add domain")
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleVerifyStep = async (step: SetupStep) => {
//     setLoading(true)
//     try {
//       const result = await verifyDomain(domainId)
//       setVerificationResults(result)

//       // Check which records are valid
//       const spfValid = result.results.find((r: any) => r.type === "SPF")?.valid
//       const dkimValid = result.results.find((r: any) => r.type === "DKIM")?.valid
//       const dmarcValid = result.results.find((r: any) => r.type === "DMARC")?.valid
//       const mxValid = result.results.find((r: any) => r.type === "MX")?.valid

//       if (step === "spf" && spfValid) {
//         setCompletedSteps((prev) => new Set(prev).add("spf"))
//         toast.success("SPF record verified!")
//         setCurrentStep("dkim")
//       } else if (step === "dkim" && dkimValid) {
//         setCompletedSteps((prev) => new Set(prev).add("dkim"))
//         toast.success("DKIM key verified!")
//         setCurrentStep("dmarc")
//       } else if (step === "dmarc" && dmarcValid) {
//         setCompletedSteps((prev) => new Set(prev).add("dmarc"))
//         toast.success("DMARC policy verified!")
//         setCurrentStep("mx")
//       } else if (step === "mx" && mxValid) {
//         setCompletedSteps((prev) => new Set(prev).add("mx"))
//         toast.success("MX records verified!")
//         setCurrentStep("verify")
//       } else {
//         toast.error("DNS record not found or invalid. Please check your configuration and try again.")
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Verification failed")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text)
//     toast.success("Copied to clipboard!")
//   }

//   const spfRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "@")
//   const dkimRecord = dnsRecords.find((r) => r.type === "CNAME" && r.name.includes("_domainkey"))
//   const dmarcRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "_dmarc")

//   return (
//     <div className="mx-auto max-w-4xl space-y-6">
//       {/* Progress Bar */}
//       <div className="space-y-2">
//         <div className="flex items-center justify-between text-sm">
//           <span className="font-medium">Setup Progress</span>
//           <span className="text-muted-foreground">
//             Step {currentStepIndex + 1} of {steps.length}
//           </span>
//         </div>
//         <Progress value={progress} className="h-2" />
//       </div>

//       {/* Step Indicators */}
//       <div className="flex items-center justify-between">
//         {steps.map((step, index) => {
//           const Icon = step.icon
//           const isComplete = completedSteps.has(step.id)
//           const isCurrent = currentStep === step.id
//           const isPast = index < currentStepIndex

//           return (
//             <div key={step.id} className="flex flex-col items-center gap-2">
//               <div
//                 className={cn(
//                   "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
//                   isCurrent && "border-primary bg-primary text-primary-foreground",
//                   isComplete && "border-green-500 bg-green-500 text-white",
//                   !isCurrent && !isComplete && !isPast && "border-muted-foreground/20 bg-background",
//                   isPast && !isComplete && "border-muted-foreground/50 bg-muted",
//                 )}
//               >
//                 {isComplete ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
//               </div>
//               <span className="hidden text-xs text-muted-foreground sm:block">{step.title}</span>
//             </div>
//           )
//         })}
//       </div>

//       {/* Welcome Step */}
//       {currentStep === "welcome" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Welcome to Email Setup</CardTitle>
//             <CardDescription>
//               Let's get your domain configured for sending emails with maximum deliverability.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <Alert>
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>What we'll do together</AlertTitle>
//               <AlertDescription>
//                 <ol className="mt-2 list-inside list-decimal space-y-1 text-sm">
//                   <li>Add your domain (e.g., yourbusiness.com)</li>
//                   <li>Configure SPF record to authorize your email servers</li>
//                   <li>Set up DKIM key to digitally sign your emails</li>
//                   <li>Add DMARC policy to protect against spoofing</li>
//                   <li>Verify MX records for email delivery</li>
//                   <li>Connect your email accounts</li>
//                 </ol>
//               </AlertDescription>
//             </Alert>

//             <div className="space-y-2 rounded-lg border p-4">
//               <h4 className="font-semibold">What you'll need:</h4>
//               <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
//                 <li>Access to your domain's DNS settings (GoDaddy, Cloudflare, Namecheap, etc.)</li>
//                 <li>About 10-15 minutes of your time</li>
//                 <li>Your domain name</li>
//               </ul>
//             </div>

//             <div className="rounded-lg bg-muted p-4">
//               <p className="text-sm">
//                 <strong>Don't worry!</strong> We'll guide you through every step with clear instructions. You don't need
//                 to be technical - we'll explain everything in simple terms.
//               </p>
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button onClick={() => setCurrentStep("add-domain")} className="w-full">
//               Let's Get Started
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* Add Domain Step */}
//       {currentStep === "add-domain" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Add Your Domain</CardTitle>
//             <CardDescription>Enter the domain you want to send emails from</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="domain">Domain Name</Label>
//               <Input
//                 id="domain"
//                 placeholder="yourbusiness.com"
//                 value={domain}
//                 onChange={(e) => setDomain(e.target.value.trim().toLowerCase())}
//                 disabled={loading}
//               />
//               <p className="text-sm text-muted-foreground">
//                 Enter your domain without http://, www, or any paths. Just the domain name.
//               </p>
//             </div>

//             <Alert>
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>Examples</AlertTitle>
//               <AlertDescription>
//                 <div className="mt-2 space-y-1 text-sm">
//                   <div className="flex items-center gap-2">
//                     <CheckCircle2 className="h-4 w-4 text-green-500" />
//                     <code>yourbusiness.com</code>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <CheckCircle2 className="h-4 w-4 text-green-500" />
//                     <code>company.io</code>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <XCircle className="h-4 w-4 text-red-500" />
//                     <code>https://www.yourbusiness.com</code>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <XCircle className="h-4 w-4 text-red-500" />
//                     <code>www.company.io</code>
//                   </div>
//                 </div>
//               </AlertDescription>
//             </Alert>
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             <Button variant="outline" onClick={() => setCurrentStep("welcome")}>
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <Button onClick={handleAddDomain} disabled={!domain || loading} className="flex-1">
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Add Domain & Generate DNS Records
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* SPF Record Step */}
//       {currentStep === "spf" && spfRecord && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Configure SPF Record</CardTitle>
//             <CardDescription>Sender Policy Framework - Authorize email servers</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <Alert>
//               <Shield className="h-4 w-4" />
//               <AlertTitle>What is SPF?</AlertTitle>
//               <AlertDescription>
//                 SPF tells email providers which servers are allowed to send emails from your domain. Think of it like a
//                 guest list - only approved servers can send emails on your behalf.
//               </AlertDescription>
//             </Alert>

//             <div className="space-y-4">
//               <div>
//                 <h4 className="mb-2 font-semibold">Step 1: Log into your domain provider</h4>
//                 <p className="text-sm text-muted-foreground">
//                   Go to your domain registrar (GoDaddy, Cloudflare, Namecheap, etc.) and find the DNS settings. It's
//                   usually under "DNS Management", "DNS Settings", or "Zone Editor".
//                 </p>
//               </div>

//               <Separator />

//               <div>
//                 <h4 className="mb-2 font-semibold">Step 2: Add a new TXT record</h4>
//                 <p className="mb-3 text-sm text-muted-foreground">
//                   Click "Add Record" or "Add DNS Record" and select TXT as the record type.
//                 </p>

//                 <div className="space-y-3 rounded-lg border p-4">
//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Record Type</Label>
//                     <div className="flex items-center gap-2">
//                       <code className="rounded bg-muted px-2 py-1">TXT</code>
//                     </div>
//                   </div>

//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Name / Host</Label>
//                     <div className="flex items-center gap-2">
//                       <code className="flex-1 rounded bg-muted px-2 py-1">{spfRecord.name}</code>
//                       <Button size="sm" variant="outline" onClick={() => copyToClipboard(spfRecord.name)}>
//                         <Copy className="h-4 w-4" />
//                       </Button>
//                     </div>
//                     <p className="text-xs text-muted-foreground">Use @ or leave blank for root domain</p>
//                   </div>

//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">Value / TXT Value</Label>
//                     <div className="flex items-center gap-2">
//                       <code className="flex-1 rounded bg-muted px-2 py-1 text-xs">{spfRecord.value}</code>
//                       <Button size="sm" variant="outline" onClick={() => copyToClipboard(spfRecord.value)}>
//                         <Copy className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="grid gap-2">
//                     <Label className="text-xs font-medium text-muted-foreground">TTL</Label>
//                     <code className="rounded bg-muted px-2 py-1">3600 (or Auto)</code>
//                   </div>
//                 </div>
//               </div>

//               <Separator />

//               <div>
//                 <h4 className="mb-2 font-semibold">Step 3: Save the record</h4>
//                 <p className="text-sm text-muted-foreground">
//                   Click "Save" or "Add Record". DNS changes can take 5-60 minutes to propagate worldwide.
//                 </p>
//               </div>
//             </div>

//             <Alert className="bg-blue-50 dark:bg-blue-950">
//               <AlertCircle className="h-4 w-4 text-blue-600" />
//               <AlertDescription className="text-blue-900 dark:text-blue-100">
//                 <strong>Have you added the SPF record?</strong>
//                 <br />
//                 Once you've saved the record in your DNS provider, click the button below to verify it.
//               </AlertDescription>
//             </Alert>
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             <Button variant="outline" onClick={() => setCurrentStep("add-domain")} disabled={loading}>
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <Button onClick={() => handleVerifyStep("spf")} disabled={loading} className="flex-1">
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               I've Added It - Verify SPF Record
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* DKIM Record Step */}
//       {currentStep === "dkim" && dkimRecord && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Configure DKIM Key</CardTitle>
//             <CardDescription>DomainKeys Identified Mail - Sign your emails</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <Alert>
//               <Mail className="h-4 w-4" />
//               <AlertTitle>What is DKIM?</AlertTitle>
//               <AlertDescription>
//                 DKIM adds a digital signature to your emails, proving they actually came from you and weren't tampered
//                 with. Think of it like a wax seal on an envelope.
//               </AlertDescription>
//             </Alert>

//             <div className="space-y-4">
//               <div>
//                 <h4 className="mb-2 font-semibold">Step 1: Add a new CNAME record</h4>
//                 <p className="text-sm text-muted-foreground">
//                   In your DNS settings, click "Add Record" and select CNAME as the record type.
//                 </p>
//               </div>

//               <Separator />

//               <div className="space-y-3 rounded-lg border p-4">
//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">Record Type</Label>
//                   <code className="rounded bg-muted px-2 py-1">CNAME</code>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">Name / Host</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 rounded bg-muted px-2 py-1 text-xs">{dkimRecord.name}</code>
//                     <Button size="sm" variant="outline" onClick={() => copyToClipboard(dkimRecord.name)}>
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     This is your DKIM selector - it must be exactly as shown
//                   </p>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">Value / Points To</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 rounded bg-muted px-2 py-1 text-xs">{dkimRecord.value}</code>
//                     <Button size="sm" variant="outline" onClick={() => copyToClipboard(dkimRecord.value)}>
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">TTL</Label>
//                   <code className="rounded bg-muted px-2 py-1">3600 (or Auto)</code>
//                 </div>
//               </div>

//               <Alert className="bg-amber-50 dark:bg-amber-950">
//                 <AlertCircle className="h-4 w-4 text-amber-600" />
//                 <AlertDescription className="text-amber-900 dark:text-amber-100">
//                   <strong>Important:</strong> Some DNS providers (like GoDaddy) automatically add your domain to the
//                   end. If that happens, remove the duplicate domain part.
//                 </AlertDescription>
//               </Alert>
//             </div>
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             <Button variant="outline" onClick={() => setCurrentStep("spf")} disabled={loading}>
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <Button onClick={() => handleVerifyStep("dkim")} disabled={loading} className="flex-1">
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               I've Added It - Verify DKIM Key
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* DMARC Record Step */}
//       {currentStep === "dmarc" && dmarcRecord && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Configure DMARC Policy</CardTitle>
//             <CardDescription>Domain-based Message Authentication - Protect your brand</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <Alert>
//               <Shield className="h-4 w-4" />
//               <AlertTitle>What is DMARC?</AlertTitle>
//               <AlertDescription>
//                 DMARC tells email providers what to do if an email fails SPF or DKIM checks. It protects your domain
//                 from being used in phishing attacks. Think of it as your security policy.
//               </AlertDescription>
//             </Alert>

//             <div className="space-y-4">
//               <div>
//                 <h4 className="mb-2 font-semibold">Add a new TXT record for DMARC</h4>
//                 <p className="text-sm text-muted-foreground">
//                   In your DNS settings, add another TXT record with these values:
//                 </p>
//               </div>

//               <Separator />

//               <div className="space-y-3 rounded-lg border p-4">
//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">Record Type</Label>
//                   <code className="rounded bg-muted px-2 py-1">TXT</code>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">Name / Host</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 rounded bg-muted px-2 py-1">{dmarcRecord.name}</code>
//                     <Button size="sm" variant="outline" onClick={() => copyToClipboard(dmarcRecord.name)}>
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <p className="text-xs text-muted-foreground">Must be exactly _dmarc</p>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">Value / TXT Value</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 rounded bg-muted px-2 py-1 text-xs">{dmarcRecord.value}</code>
//                     <Button size="sm" variant="outline" onClick={() => copyToClipboard(dmarcRecord.value)}>
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     This policy quarantines suspicious emails and sends you reports
//                   </p>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-medium text-muted-foreground">TTL</Label>
//                   <code className="rounded bg-muted px-2 py-1">3600 (or Auto)</code>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             <Button variant="outline" onClick={() => setCurrentStep("dkim")} disabled={loading}>
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <Button onClick={() => handleVerifyStep("dmarc")} disabled={loading} className="flex-1">
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               I've Added It - Verify DMARC Policy
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* MX Records Step */}
//       {currentStep === "mx" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Verify MX Records</CardTitle>
//             <CardDescription>Mail Exchange - Ensure email delivery works</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <Alert>
//               <Server className="h-4 w-4" />
//               <AlertTitle>What are MX Records?</AlertTitle>
//               <AlertDescription>
//                 MX records direct incoming emails to the right mail servers. Most domains already have these configured
//                 by their email provider (Gmail, Outlook, etc.). We just need to verify they exist.
//               </AlertDescription>
//             </Alert>

//             <div className="rounded-lg border p-4">
//               <h4 className="mb-2 font-semibold">What to check:</h4>
//               <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
//                 <li>Your domain should already have MX records from your email provider</li>
//                 <li>If you use Gmail for Work, you'll see Google's mail servers</li>
//                 <li>If you use Office 365, you'll see Microsoft's mail servers</li>
//                 <li>You don't need to add anything - we're just verifying they exist</li>
//               </ul>
//             </div>

//             <Alert className="bg-green-50 dark:bg-green-950">
//               <CheckCircle2 className="h-4 w-4 text-green-600" />
//               <AlertDescription className="text-green-900 dark:text-green-100">
//                 <strong>Good news!</strong> Most domains already have MX records. Click below to verify yours are set up
//                 correctly.
//               </AlertDescription>
//             </Alert>
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             <Button variant="outline" onClick={() => setCurrentStep("dmarc")} disabled={loading}>
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <Button onClick={() => handleVerifyStep("mx")} disabled={loading} className="flex-1">
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Verify MX Records
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* Final Verification Step */}
//       {currentStep === "verify" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Final Verification</CardTitle>
//             <CardDescription>Let's make sure everything is configured correctly</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {verificationResults && (
//               <div className="space-y-3">
//                 {verificationResults.results.map((result: any) => (
//                   <div
//                     key={result.type}
//                     className={cn(
//                       "flex items-center justify-between rounded-lg border p-3",
//                       result.valid
//                         ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
//                         : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950",
//                     )}
//                   >
//                     <div className="flex items-center gap-3">
//                       {result.valid ? (
//                         <CheckCircle2 className="h-5 w-5 text-green-600" />
//                       ) : (
//                         <XCircle className="h-5 w-5 text-red-600" />
//                       )}
//                       <div>
//                         <p className="font-medium">{result.type}</p>
//                         {result.message && <p className="text-sm text-muted-foreground">{result.message}</p>}
//                       </div>
//                     </div>
//                     <Badge variant={result.valid ? "default" : "destructive"}>
//                       {result.valid ? "Verified" : "Not Found"}
//                     </Badge>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {verificationResults?.verified ? (
//               <Alert className="bg-green-50 dark:bg-green-950">
//                 <CheckCircle2 className="h-4 w-4 text-green-600" />
//                 <AlertTitle className="text-green-900 dark:text-green-100">
//                   Perfect! All DNS records verified
//                 </AlertTitle>
//                 <AlertDescription className="text-green-900 dark:text-green-100">
//                   Your domain is fully configured and ready to send emails with maximum deliverability.
//                 </AlertDescription>
//               </Alert>
//             ) : (
//               <Alert>
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertTitle>Some records need attention</AlertTitle>
//                 <AlertDescription>
//                   DNS changes can take up to 60 minutes to propagate. If you just added the records, please wait a few
//                   minutes and try again.
//                 </AlertDescription>
//               </Alert>
//             )}
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             {!verificationResults?.verified && (
//               <Button variant="outline" onClick={() => setCurrentStep("spf")} disabled={loading}>
//                 <ChevronLeft className="mr-2 h-4 w-4" />
//                 Review Records
//               </Button>
//             )}
//             <Button
//               onClick={() => setCurrentStep("connect-accounts")}
//               disabled={!verificationResults?.verified}
//               className="flex-1"
//             >
//               Continue to Connect Accounts
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* Connect Accounts Step */}
//       {currentStep === "connect-accounts" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Connect Your Email Accounts</CardTitle>
//             <CardDescription>Add email accounts to start sending campaigns</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <Alert>
//               <Mail className="h-4 w-4" />
//               <AlertTitle>Ready to connect accounts</AlertTitle>
//               <AlertDescription>
//                 Now that your domain is verified, you can connect multiple email accounts from this domain. We'll
//                 automatically rotate between them to maximize deliverability.
//               </AlertDescription>
//             </Alert>

//             <div className="rounded-lg border p-4">
//               <h4 className="mb-2 font-semibold">What you can connect:</h4>
//               <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
//                 <li>Gmail accounts from your domain</li>
//                 <li>Outlook/Microsoft 365 accounts</li>
//                 <li>Resend API keys</li>
//               </ul>
//             </div>

//             <Alert className="bg-blue-50 dark:bg-blue-950">
//               <AlertCircle className="h-4 w-4 text-blue-600" />
//               <AlertDescription className="text-blue-900 dark:text-blue-100">
//                 <strong>Pro Tip:</strong> Connect 3-5 email accounts from your verified domain for best results. We'll
//                 automatically distribute your emails across them to prevent any single account from sending too much.
//               </AlertDescription>
//             </Alert>
//           </CardContent>
//           <CardFooter>
//             <Button onClick={() => (window.location.href = "/dashboard/settings")} className="w-full">
//               Go to Settings to Connect Accounts
//               <ExternalLink className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Shield,
  Mail,
  Server,
  CheckCheck,
} from "lucide-react"
import { addDomain, verifyDomain } from "@/lib/actions/domain-action"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type SetupStep = "welcome" | "add-domain" | "spf" | "dkim" | "dmarc" | "mx" | "verify" | "connect-accounts" | "complete"

interface DNSRecord {
  type: string
  name: string
  value: string
  selector?: string
}

export function GuidedEmailWizard() {
  const [currentStep, setCurrentStep] = useState<SetupStep>("welcome")
  const [domain, setDomain] = useState("")
  const [domainId, setDomainId] = useState("")
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [verificationResults, setVerificationResults] = useState<any>(null)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  const steps: { id: SetupStep; title: string; icon: any }[] = [
    { id: "welcome", title: "Welcome", icon: CheckCheck },
    { id: "add-domain", title: "Add Domain", icon: Server },
    { id: "spf", title: "SPF Record", icon: Shield },
    { id: "dkim", title: "DKIM Key", icon: Mail },
    { id: "dmarc", title: "DMARC Policy", icon: Shield },
    { id: "mx", title: "MX Records", icon: Server },
    { id: "verify", title: "Verify", icon: CheckCircle2 },
    { id: "connect-accounts", title: "Connect Accounts", icon: Mail },
    { id: "complete", title: "Complete", icon: CheckCircle2 },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleAddDomain = async () => {
    if (!domain) {
      toast.error("Please enter a domain name")
      return
    }

    setLoading(true)
    try {
      const result = await addDomain(domain)

      if (result.success === false) {
        toast.error(result.error || "Failed to add domain")
        return
      }

      if (result.success && result.domainId && result.dnsRecords) {
        setDomainId(result.domainId)
        setDnsRecords(result.dnsRecords.records)
        setCompletedSteps((prev) => new Set(prev).add("add-domain"))
        toast.success("Domain added! Let's configure your DNS records")
        setCurrentStep("spf")
      }
    } catch (error: any) {
      if (error.message.includes("limit reached")) {
        toast.error(error.message, { duration: 5000 })
      } else {
        toast.error(error.message || "Failed to add domain")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyStep = async (step: SetupStep) => {
    setLoading(true)
    try {
      const result = await verifyDomain(domainId)
      setVerificationResults(result)

      // Check which records are valid
      const spfValid = result.results.find((r: any) => r.type === "SPF")?.valid
      const dkimValid = result.results.find((r: any) => r.type === "DKIM")?.valid
      const dmarcValid = result.results.find((r: any) => r.type === "DMARC")?.valid
      const mxValid = result.results.find((r: any) => r.type === "MX")?.valid

      if (step === "spf" && spfValid) {
        setCompletedSteps((prev) => new Set(prev).add("spf"))
        toast.success("SPF record verified!")
        setCurrentStep("dkim")
      } else if (step === "dkim" && dkimValid) {
        setCompletedSteps((prev) => new Set(prev).add("dkim"))
        toast.success("DKIM key verified!")
        setCurrentStep("dmarc")
      } else if (step === "dmarc" && dmarcValid) {
        setCompletedSteps((prev) => new Set(prev).add("dmarc"))
        toast.success("DMARC policy verified!")
        setCurrentStep("mx")
      } else if (step === "mx" && mxValid) {
        setCompletedSteps((prev) => new Set(prev).add("mx"))
        toast.success("MX records verified!")
        setCurrentStep("verify")
      } else {
        toast.error("DNS record not found or invalid. Please check your configuration and try again.")
      }
    } catch (error: any) {
      toast.error(error.message || "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied!", {
      description: "DNS record copied to clipboard",
      duration: 2000,
    })
  }

  const spfRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "@")
  const dkimRecord = dnsRecords.find((r) => r.type === "CNAME" && r.name.includes("_domainkey"))
  const dmarcRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "_dmarc")

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Setup Progress</span>
          <span className="text-muted-foreground">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isComplete = completedSteps.has(step.id)
          const isCurrent = currentStep === step.id
          const isPast = index < currentStepIndex

          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                  isCurrent && "border-primary bg-primary text-primary-foreground",
                  isComplete && "border-green-500 bg-green-500 text-white",
                  !isCurrent && !isComplete && !isPast && "border-muted-foreground/20 bg-background",
                  isPast && !isComplete && "border-muted-foreground/50 bg-muted",
                )}
              >
                {isComplete ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <span className="hidden text-xs text-muted-foreground sm:block">{step.title}</span>
            </div>
          )
        })}
      </div>

      {/* Welcome Step */}
      {currentStep === "welcome" && (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Email Setup</CardTitle>
            <CardDescription>
              Let's get your domain configured for sending emails with maximum deliverability.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>What we'll do together</AlertTitle>
              <AlertDescription>
                <ol className="mt-2 list-inside list-decimal space-y-1 text-sm">
                  <li>Add your domain (e.g., yourbusiness.com)</li>
                  <li>Configure SPF record to authorize your email servers</li>
                  <li>Set up DKIM key to digitally sign your emails</li>
                  <li>Add DMARC policy to protect against spoofing</li>
                  <li>Verify MX records for email delivery</li>
                  <li>Connect your email accounts</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="space-y-2 rounded-lg border p-4">
              <h4 className="font-semibold">What you'll need:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Access to your domain's DNS settings (GoDaddy, Cloudflare, Namecheap, etc.)</li>
                <li>About 10-15 minutes of your time</li>
                <li>Your domain name</li>
              </ul>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm">
                <strong>Don't worry!</strong> We'll guide you through every step with clear instructions. You don't need
                to be technical - we'll explain everything in simple terms.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setCurrentStep("add-domain")} className="w-full">
              Let's Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Add Domain Step */}
      {currentStep === "add-domain" && (
        <Card>
          <CardHeader>
            <CardTitle>Add Your Domain</CardTitle>
            <CardDescription>Enter the domain you want to send emails from</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain Name</Label>
              <Input
                id="domain"
                placeholder="yourbusiness.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value.trim().toLowerCase())}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Enter your domain without http://, www, or any paths. Just the domain name.
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Examples</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <code>yourbusiness.com</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <code>company.io</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <code>https://www.yourbusiness.com</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <code>www.company.io</code>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setCurrentStep("welcome")}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleAddDomain} disabled={!domain || loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Domain & Generate DNS Records
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* SPF Record Step */}
      {currentStep === "spf" && spfRecord && (
        <Card>
          <CardHeader>
            <CardTitle>Configure SPF Record</CardTitle>
            <CardDescription>Sender Policy Framework - Authorize email servers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>What is SPF?</AlertTitle>
              <AlertDescription>
                SPF tells email providers which servers are allowed to send emails from your domain. Think of it like a
                guest list - only approved servers can send emails on your behalf.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">Step 1: Log into your domain provider</h4>
                <p className="text-sm text-muted-foreground">
                  Go to your domain registrar (GoDaddy, Cloudflare, Namecheap, etc.) and find the DNS settings. It's
                  usually under "DNS Management", "DNS Settings", or "Zone Editor".
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 font-semibold">Step 2: Add a new TXT record</h4>
                <p className="mb-3 text-sm text-muted-foreground">
                  Click "Add Record" or "Add DNS Record" and select TXT as the record type.
                </p>

                <div className="space-y-3 rounded-lg border p-4">
                  <div className="grid gap-2">
                    <Label className="text-xs font-medium text-muted-foreground">Record Type</Label>
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-2 py-1">TXT</code>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xs font-medium text-muted-foreground">Name / Host</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded bg-muted px-2 py-1">{spfRecord.name}</code>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(spfRecord.name)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Use @ or leave blank for root domain</p>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xs font-medium text-muted-foreground">Value / TXT Value</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded bg-muted px-2 py-1 text-xs">{spfRecord.value}</code>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(spfRecord.value)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xs font-medium text-muted-foreground">TTL</Label>
                    <code className="rounded bg-muted px-2 py-1">3600 (or Auto)</code>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 font-semibold">Step 3: Save the record</h4>
                <p className="text-sm text-muted-foreground">
                  Click "Save" or "Add Record". DNS changes can take 5-60 minutes to propagate worldwide.
                </p>
              </div>
            </div>

            <Alert className="bg-blue-50 dark:bg-blue-950">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900 dark:text-blue-100">
                <strong>Have you added the SPF record?</strong>
                <br />
                Once you've saved the record in your DNS provider, click the button below to verify it.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setCurrentStep("add-domain")} disabled={loading}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={() => handleVerifyStep("spf")} disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              I've Added It - Verify SPF Record
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* DKIM Record Step */}
      {currentStep === "dkim" && dkimRecord && (
        <Card>
          <CardHeader>
            <CardTitle>Configure DKIM Key</CardTitle>
            <CardDescription>DomainKeys Identified Mail - Sign your emails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertTitle>What is DKIM?</AlertTitle>
              <AlertDescription>
                DKIM adds a digital signature to your emails, proving they actually came from you and weren't tampered
                with. Think of it like a wax seal on an envelope.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">Step 1: Add a new CNAME record</h4>
                <p className="text-sm text-muted-foreground">
                  In your DNS settings, click "Add Record" and select CNAME as the record type.
                </p>
              </div>

              <Separator />

              <div className="space-y-3 rounded-lg border p-4">
                <div className="grid gap-2">
                  <Label className="text-xs font-medium text-muted-foreground">Record Type</Label>
                  <code className="rounded bg-muted px-2 py-1">CNAME</code>
                </div>

                <div className="grid gap-2">
                  <Label className="text-xs font-medium text-muted-foreground">Name / Host</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded bg-muted px-2 py-1 text-xs">{dkimRecord.name}</code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(dkimRecord.name)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This is your DKIM selector - it must be exactly as shown
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label className="text-xs font-medium text-muted-foreground">Value / Points To</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded bg-muted px-2 py-1 text-xs">{dkimRecord.value}</code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(dkimRecord.value)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-xs font-medium text-muted-foreground">TTL</Label>
                  <code className="rounded bg-muted px-2 py-1">3600 (or Auto)</code>
                </div>
              </div>

              <Alert className="bg-amber-50 dark:bg-amber-950">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-900 dark:text-amber-100">
                  <strong>Important:</strong> Some DNS providers (like GoDaddy) automatically add your domain to the
                  end. If that happens, remove the duplicate domain part.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setCurrentStep("spf")} disabled={loading}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={() => handleVerifyStep("dkim")} disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              I've Added It - Verify DKIM Key
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* DMARC Record Step */}
      {currentStep === "dmarc" && dmarcRecord && (
        <Card>
          <CardHeader>
            <CardTitle>Configure DMARC Policy</CardTitle>
            <CardDescription>Domain-based Message Authentication - Protect your brand</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>What is DMARC?</AlertTitle>
              <AlertDescription>
                DMARC tells email providers what to do if an email fails SPF or DKIM checks. It protects your domain
                from being used in phishing attacks. Think of it as your security policy.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">Add a new TXT record for DMARC</h4>
                <p className="text-sm text-muted-foreground">
                  In your DNS settings, add another TXT record with these values:
                </p>
              </div>

              <Separator />

              <div className="space-y-3 rounded-lg border p-4">
                <div className="grid gap-2">
                  <Label className="text-xs font-medium text-muted-foreground">Record Type</Label>
                  <code className="rounded bg-muted px-2 py-1">TXT</code>
                </div>

                <div className="grid gap-2">
                  <Label className="text-xs font-medium text-muted-foreground">Name / Host</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded bg-muted px-2 py-1">{dmarcRecord.name}</code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(dmarcRecord.name)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Must be exactly _dmarc</p>
                </div>

                <div className="grid gap-2">
                  <Label className="text-xs font-medium text-muted-foreground">Value / TXT Value</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded bg-muted px-2 py-1 text-xs">{dmarcRecord.value}</code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(dmarcRecord.value)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This policy quarantines suspicious emails and sends you reports
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label className="text-xs font-medium text-muted-foreground">TTL</Label>
                  <code className="rounded bg-muted px-2 py-1">3600 (or Auto)</code>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setCurrentStep("dkim")} disabled={loading}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={() => handleVerifyStep("dmarc")} disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              I've Added It - Verify DMARC Policy
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* MX Records Step */}
      {currentStep === "mx" && (
        <Card>
          <CardHeader>
            <CardTitle>Verify MX Records</CardTitle>
            <CardDescription>Mail Exchange - Ensure email delivery works</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Server className="h-4 w-4" />
              <AlertTitle>What are MX Records?</AlertTitle>
              <AlertDescription>
                MX records direct incoming emails to the right mail servers. Most domains already have these configured
                by their email provider (Gmail, Outlook, etc.). We just need to verify they exist.
              </AlertDescription>
            </Alert>

            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">What to check:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Your domain should already have MX records from your email provider</li>
                <li>If you use Gmail for Work, you'll see Google's mail servers</li>
                <li>If you use Office 365, you'll see Microsoft's mail servers</li>
                <li>You don't need to add anything - we're just verifying they exist</li>
              </ul>
            </div>

            <Alert className="bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-900 dark:text-green-100">
                <strong>Good news!</strong> Most domains already have MX records. Click below to verify yours are set up
                correctly.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setCurrentStep("dmarc")} disabled={loading}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={() => handleVerifyStep("mx")} disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify MX Records
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Final Verification Step */}
      {currentStep === "verify" && (
        <Card>
          <CardHeader>
            <CardTitle>Final Verification</CardTitle>
            <CardDescription>Let's make sure everything is configured correctly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {verificationResults && (
              <div className="space-y-3">
                {verificationResults.results.map((result: any) => (
                  <div
                    key={result.type}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-3",
                      result.valid
                        ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
                        : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {result.valid ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium">{result.type}</p>
                        {result.message && <p className="text-sm text-muted-foreground">{result.message}</p>}
                      </div>
                    </div>
                    <Badge variant={result.valid ? "default" : "destructive"}>
                      {result.valid ? "Verified" : "Not Found"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {verificationResults?.verified ? (
              <Alert className="bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-900 dark:text-green-100">
                  Perfect! All DNS records verified
                </AlertTitle>
                <AlertDescription className="text-green-900 dark:text-green-100">
                  Your domain is fully configured and ready to send emails with maximum deliverability.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Some records need attention</AlertTitle>
                <AlertDescription>
                  DNS changes can take up to 60 minutes to propagate. If you just added the records, please wait a few
                  minutes and try again.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            {!verificationResults?.verified && (
              <Button variant="outline" onClick={() => setCurrentStep("spf")} disabled={loading}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Review Records
              </Button>
            )}
            <Button
              onClick={() => setCurrentStep("connect-accounts")}
              disabled={!verificationResults?.verified}
              className="flex-1"
            >
              Continue to Connect Accounts
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Connect Accounts Step */}
      {currentStep === "connect-accounts" && (
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Email Accounts</CardTitle>
            <CardDescription>Add email accounts to start sending campaigns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertTitle>Ready to connect accounts</AlertTitle>
              <AlertDescription>
                Now that your domain is verified, you can connect multiple email accounts from this domain. We'll
                automatically rotate between them to maximize deliverability.
              </AlertDescription>
            </Alert>

            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">What you can connect:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Gmail accounts from your domain</li>
                <li>Outlook/Microsoft 365 accounts</li>
                <li>Resend API keys</li>
              </ul>
            </div>

            <Alert className="bg-blue-50 dark:bg-blue-950">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900 dark:text-blue-100">
                <strong>Pro Tip:</strong> Connect 3-5 email accounts from your verified domain for best results. We'll
                automatically distribute your emails across them to prevent any single account from sending too much.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => (window.location.href = "/dashboard/settings")} className="w-full">
              Go to Settings to Connect Accounts
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
