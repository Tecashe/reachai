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
//     toast.success("Copied!", {
//       description: "DNS record copied to clipboard",
//       duration: 2000,
//     })
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

// import { useState, useEffect } from "react"
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

// interface GuidedEmailWizardProps {
//   existingDomains?: Array<{
//     id: string
//     domain: string
//     isVerified: boolean
//     verificationAttempts: number
//     dnsRecords: any
//   }>
// }

// export function GuidedEmailWizard({ existingDomains = [] }: GuidedEmailWizardProps) {
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
//     toast.success("Copied!", {
//       description: "DNS record copied to clipboard",
//       duration: 2000,
//     })
//   }

//   const spfRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "@")
//   const dkimRecord = dnsRecords.find((r) => r.type === "CNAME" && r.name.includes("_domainkey"))
//   const dmarcRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "_dmarc")

//   useEffect(() => {
//     if (existingDomains.length > 0) {
//       const unconfigured = existingDomains.find((d) => !d.isVerified)
//       if (unconfigured) {
//         setDomain(unconfigured.domain)
//         setDomainId(unconfigured.id)
//         if (
//           unconfigured.dnsRecords &&
//           typeof unconfigured.dnsRecords === "object" &&
//           "records" in unconfigured.dnsRecords
//         ) {
//           setDnsRecords((unconfigured.dnsRecords as any).records || [])
//         }
//         if (unconfigured.verificationAttempts > 0) {
//           setCurrentStep("spf")
//           toast.info("Welcome back! Continue configuring your DNS records")
//         } else {
//           setCurrentStep("add-domain")
//         }
//       }
//     }
//   }, [existingDomains])

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

// import { useState, useEffect } from "react"
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

// interface GuidedEmailWizardProps {
//   existingDomains?: Array<{
//     id: string
//     domain: string
//     isVerified: boolean
//     verificationAttempts: number
//     dnsRecords: any
//     deliverabilityHealth?: any
//   }>
// }

// export function GuidedEmailWizard({ existingDomains = [] }: GuidedEmailWizardProps) {
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

//     const existingDomain = existingDomains?.find((d) => d.domain.toLowerCase() === domain.toLowerCase())

//     if (existingDomain) {
//       if (existingDomain.isVerified) {
//         toast.error("Domain already configured", {
//           description: "This domain is already verified and active. You can manage it in Settings.",
//         })
//         return
//       } else {
//         // Domain exists but not verified - resume configuration
//         setDomainId(existingDomain.id)
//         if (
//           existingDomain.dnsRecords &&
//           typeof existingDomain.dnsRecords === "object" &&
//           "records" in existingDomain.dnsRecords
//         ) {
//           setDnsRecords((existingDomain.dnsRecords as any).records || [])
//         }
//         setCompletedSteps((prev) => new Set(prev).add("add-domain"))
//         toast.info("Resuming configuration", {
//           description: "This domain was added before. Continue with DNS setup.",
//         })
//         setCurrentStep("spf")
//         return
//       }
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
//     toast.success("Copied!", {
//       description: "DNS record copied to clipboard",
//       duration: 2000,
//     })
//   }

//   const spfRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "@")
//   const dkimRecord = dnsRecords.find((r) => r.type === "CNAME" && r.name.includes("_domainkey"))
//   const dmarcRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "_dmarc")

//   useEffect(() => {
//     if (existingDomains.length > 0) {
//       const unconfigured = existingDomains.find((d) => !d.isVerified)
//       if (unconfigured) {
//         setDomain(unconfigured.domain)
//         setDomainId(unconfigured.id)

//         // Load DNS records
//         if (
//           unconfigured.dnsRecords &&
//           typeof unconfigured.dnsRecords === "object" &&
//           "records" in unconfigured.dnsRecords
//         ) {
//           setDnsRecords((unconfigured.dnsRecords as any).records || [])
//         }

//         // Determine which step to resume from based on verification attempts
//         if (unconfigured.verificationAttempts > 0) {
//           // Domain has been attempted, check deliverability health to see which records are verified
//           const health = existingDomains.find((d) => d.id === unconfigured.id)?.deliverabilityHealth

//           if (health) {
//             // Resume from first unverified record
//             if (!health.spfValid) {
//               setCurrentStep("spf")
//               toast.info("Resume DNS configuration", {
//                 description: "Continue configuring your SPF record",
//               })
//             } else if (!health.dkimValid) {
//               setCompletedSteps(new Set(["add-domain", "spf"]))
//               setCurrentStep("dkim")
//               toast.info("Resume DNS configuration", {
//                 description: "Continue configuring your DKIM key",
//               })
//             } else if (!health.dmarcValid) {
//               setCompletedSteps(new Set(["add-domain", "spf", "dkim"]))
//               setCurrentStep("dmarc")
//               toast.info("Resume DNS configuration", {
//                 description: "Continue configuring your DMARC policy",
//               })
//             } else if (!health.mxRecordsValid) {
//               setCompletedSteps(new Set(["add-domain", "spf", "dkim", "dmarc"]))
//               setCurrentStep("mx")
//               toast.info("Resume DNS configuration", {
//                 description: "Continue configuring your MX records",
//               })
//             } else {
//               setCompletedSteps(new Set(["add-domain", "spf", "dkim", "dmarc", "mx"]))
//               setCurrentStep("verify")
//               toast.info("Almost done!", {
//                 description: "Run final verification",
//               })
//             }
//           } else {
//             // No health record, start from SPF
//             setCurrentStep("spf")
//             toast.info("Welcome back!", {
//               description: "Continue configuring your DNS records",
//             })
//           }
//         } else {
//           // Never attempted verification, show add-domain screen with prefilled domain
//           setCurrentStep("add-domain")
//         }
//       }
//     }
//   }, [existingDomains])

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

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Progress } from "@/components/ui/progress"
// import { useRouter } from "next/navigation"
// import {
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   Loader2,
//   Copy,
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

// interface GuidedEmailWizardProps {
//   existingDomains?: Array<{
//     id: string
//     domain: string
//     isVerified: boolean
//     verificationAttempts: number
//     dnsRecords: any
//     deliverabilityHealth?: any
//   }>
//   existingAccounts?: any[]
// }

// export function GuidedEmailWizard({ existingDomains = [], existingAccounts = [] }: GuidedEmailWizardProps) {
//   const router = useRouter()
//   const [currentStep, setCurrentStep] = useState<SetupStep>("welcome")
//   const [completedSteps, setCompletedSteps] = useState<Set<SetupStep>>(new Set())
//   const [domainId, setDomainId] = useState<string | null>(null)
//   const [domainName, setDomainName] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [verificationResults, setVerificationResults] = useState<any>(null)
//   const [dnsRecords, setDnsRecords] = useState<any[]>([])
//   const [isManualNavigation, setIsManualNavigation] = useState(false)
//   const [hasInitialized, setHasInitialized] = useState(false)

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
//     if (!domainName) {
//       toast.error("Please enter a domain name")
//       return
//     }

//     const existingDomain = existingDomains?.find((d) => d.domain.toLowerCase() === domainName.toLowerCase())

//     if (existingDomain) {
//       if (existingDomain.isVerified) {
//         toast.error("Domain already configured", {
//           description: "This domain is already verified and active. You can manage it in Settings.",
//         })
//         return
//       } else {
//         setDomainId(existingDomain.id)
//         if (
//           existingDomain.dnsRecords &&
//           typeof existingDomain.dnsRecords === "object" &&
//           "records" in existingDomain.dnsRecords
//         ) {
//           setDnsRecords((existingDomain.dnsRecords as any).records || [])
//         }
//         setCompletedSteps((prev) => new Set([...prev, "add-domain"]))
//         toast.info("Resuming configuration", {
//           description: "This domain was added before. Continue with DNS setup.",
//         })
//         setCurrentStep("spf")
//         return
//       }
//     }

//     setLoading(true)
//     try {
//       const result = await addDomain(domainName)

//       if (result.success === false) {
//         toast.error(result.error || "Failed to add domain")
//         return
//       }

//       if (result.success && result.domainId && result.dnsRecords) {
//         setDomainId(result.domainId)
//         setDnsRecords(result.dnsRecords.records)
//         setCompletedSteps((prev) => new Set([...prev, "add-domain"]))
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
//     setIsManualNavigation(true)
//     try {
//       const result = await verifyDomain(domainId||"")
//       setVerificationResults(result)

//       const spfValid = result.results.find((r: any) => r.type === "SPF")?.valid
//       const dkimValid = result.results.find((r: any) => r.type === "DKIM")?.valid
//       const dmarcValid = result.results.find((r: any) => r.type === "DMARC")?.valid
//       const mxValid = result.results.find((r: any) => r.type === "MX")?.valid

//       if (step === "spf") {
//         if (spfValid) {
//           setCompletedSteps((prev) => new Set([...prev, "spf"]))
//           toast.success("SPF record verified!")
//           setCurrentStep("dkim")
//         } else {
//           toast.error("SPF record not verified yet", {
//             description: "DNS changes can take up to 48 hours to propagate. You can skip and come back later.",
//             action: {
//               label: "Skip for now",
//               onClick: () => {
//                 setIsManualNavigation(true)
//                 setCurrentStep("dkim")
//               },
//             },
//           })
//         }
//       } else if (step === "dkim") {
//         if (dkimValid) {
//           setCompletedSteps((prev) => new Set([...prev, "dkim"]))
//           toast.success("DKIM key verified!")
//           setCurrentStep("dmarc")
//         } else {
//           toast.error("DKIM key not verified yet", {
//             description: "DNS changes can take up to 48 hours to propagate. You can skip and come back later.",
//             action: {
//               label: "Skip for now",
//               onClick: () => {
//                 setIsManualNavigation(true)
//                 setCurrentStep("dmarc")
//               },
//             },
//           })
//         }
//       } else if (step === "dmarc") {
//         if (dmarcValid) {
//           setCompletedSteps((prev) => new Set([...prev, "dmarc"]))
//           toast.success("DMARC policy verified!")
//           setCurrentStep("mx")
//         } else {
//           toast.error("DMARC policy not verified yet", {
//             description: "DNS changes can take up to 48 hours to propagate. You can skip and come back later.",
//             action: {
//               label: "Skip for now",
//               onClick: () => {
//                 setIsManualNavigation(true)
//                 setCurrentStep("mx")
//               },
//             },
//           })
//         }
//       } else if (step === "mx") {
//         if (mxValid) {
//           setCompletedSteps((prev) => new Set([...prev, "mx"]))
//           toast.success("MX records verified!")
//           setCurrentStep("verify")
//         } else {
//           toast.error("MX records not verified yet", {
//             description: "DNS changes can take up to 48 hours to propagate. You can skip and come back later.",
//             action: {
//               label: "Skip for now",
//               onClick: () => {
//                 setIsManualNavigation(true)
//                 setCurrentStep("verify")
//               },
//             },
//           })
//         }
//       }
//     } catch (error) {
//       toast.error("Verification failed", {
//         description: "Please try again later",
//       })
//     } finally {
//       setLoading(false)
//       setTimeout(() => setIsManualNavigation(false), 1000)
//     }
//   }

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text)
//     toast.success("Copied!", {
//       description: "DNS record copied to clipboard",
//       duration: 2000,
//     })
//   }

//   const spfRecord = dnsRecords.find((r) => r.type === "TXT" && (r.name === "@" || r.name === "")) || {
//     type: "TXT",
//     name: "@",
//     value: `v=spf1 include:sendgrid.net ~all`,
//   }

//   const dkimRecord = dnsRecords.find((r) => r.type === "CNAME" && r.name.includes("_domainkey")) || {
//     type: "CNAME",
//     name: `default._domainkey`,
//     value: `default.sendgrid.net`,
//   }

//   const dmarcRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "_dmarc") || {
//     type: "TXT",
//     name: "_dmarc",
//     value: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${domainName || "yourdomain.com"}`,
//   }

//   useEffect(() => {
//     if (isManualNavigation || hasInitialized) return

//     if (existingDomains.length > 0) {
//       const unconfigured = existingDomains.find((d) => !d.isVerified)
//       if (unconfigured) {
//         setDomainId(unconfigured.id)
//         setDomainName(unconfigured.domain)
//         setCompletedSteps(new Set(["add-domain"]))

//         if (
//           unconfigured.dnsRecords &&
//           typeof unconfigured.dnsRecords === "object" &&
//           "records" in unconfigured.dnsRecords
//         ) {
//           setDnsRecords((unconfigured.dnsRecords as any).records || [])
//         }

//         if (unconfigured.verificationAttempts > 0) {
//           const health = existingDomains.find((d) => d.id === unconfigured.id)?.deliverabilityHealth

//           if (health) {
//             if (!health.spfValid) {
//               setCurrentStep("spf")
//               toast.info("Resume DNS configuration", {
//                 description: "Continue configuring your SPF record",
//               })
//             } else if (!health.dkimValid) {
//               setCompletedSteps(new Set(["add-domain", "spf"]))
//               setCurrentStep("dkim")
//               toast.info("Resume DNS configuration", {
//                 description: "Continue configuring your DKIM key",
//               })
//             } else if (!health.dmarcValid) {
//               setCompletedSteps(new Set(["add-domain", "spf", "dkim"]))
//               setCurrentStep("dmarc")
//               toast.info("Resume DNS configuration", {
//                 description: "Continue configuring your DMARC policy",
//               })
//             } else if (!health.mxRecordsValid) {
//               setCompletedSteps(new Set(["add-domain", "spf", "dkim", "dmarc"]))
//               setCurrentStep("mx")
//               toast.info("Resume DNS configuration", {
//                 description: "Continue configuring your MX records",
//               })
//             } else {
//               setCompletedSteps(new Set(["add-domain", "spf", "dkim", "dmarc", "mx"]))
//               setCurrentStep("verify")
//               toast.info("Almost done!", {
//                 description: "Run final verification",
//               })
//             }
//           } else {
//             setCurrentStep("spf")
//             toast.info("Welcome back!", {
//               description: "Continue configuring your DNS records",
//             })
//           }
//         } else {
//           setCurrentStep("add-domain")
//         }
//       } else {
//         setCurrentStep("connect-accounts")
//         setCompletedSteps(new Set(["add-domain", "spf", "dkim", "dmarc", "mx", "verify"]))
//       }
//     }

//     setHasInitialized(true)
//   }, [existingDomains, isManualNavigation, hasInitialized])

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
//                 value={domainName}
//                 onChange={(e) => setDomainName(e.target.value.trim().toLowerCase())}
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
//             <Button onClick={handleAddDomain} disabled={!domainName || loading} className="flex-1">
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Add Domain & Generate DNS Records
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* SPF Record Step - Removed conditional on spfRecord existing */}
//       {currentStep === "spf" && (
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

//       {/* DKIM Record Step - Removed conditional on dkimRecord existing */}
//       {currentStep === "dkim" && (
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

//       {/* DMARC Record Step - Removed conditional on dmarcRecord existing */}
//       {currentStep === "dmarc" && (
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

//       {/* Verify Step */}
//       {currentStep === "verify" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Final Verification</CardTitle>
//             <CardDescription>Let's run a complete check on your domain</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {verificationResults ? (
//               <div className="space-y-4">
//                 <div className="text-center">
//                   <div className="mb-4 text-4xl font-bold text-primary">{verificationResults.healthScore}%</div>
//                   <p className="text-muted-foreground">Domain Health Score</p>
//                 </div>

//                 <div className="space-y-2">
//                   {verificationResults.results.map((result: any) => (
//                     <div key={result.type} className="flex items-center justify-between rounded-lg border p-3">
//                       <div className="flex items-center gap-2">
//                         {result.valid ? (
//                           <CheckCircle2 className="h-5 w-5 text-green-500" />
//                         ) : (
//                           <XCircle className="h-5 w-5 text-red-500" />
//                         )}
//                         <span className="font-medium">{result.type}</span>
//                       </div>
//                       <Badge variant={result.valid ? "default" : "destructive"}>
//                         {result.valid ? "Verified" : "Not Verified"}
//                       </Badge>
//                     </div>
//                   ))}
//                 </div>

//                 {verificationResults.healthScore === 100 ? (
//                   <Alert className="bg-green-50 dark:bg-green-950">
//                     <CheckCircle2 className="h-4 w-4 text-green-600" />
//                     <AlertTitle className="text-green-900 dark:text-green-100">
//                       Perfect! All DNS records verified
//                     </AlertTitle>
//                     <AlertDescription className="text-green-800 dark:text-green-200">
//                       Your domain is fully configured for optimal email deliverability.
//                     </AlertDescription>
//                   </Alert>
//                 ) : (
//                   <Alert className="bg-amber-50 dark:bg-amber-950">
//                     <AlertCircle className="h-4 w-4 text-amber-600" />
//                     <AlertTitle className="text-amber-900 dark:text-amber-100">Some records need attention</AlertTitle>
//                     <AlertDescription className="text-amber-800 dark:text-amber-200">
//                       You can still proceed, but fixing the missing records will improve deliverability.
//                     </AlertDescription>
//                   </Alert>
//                 )}
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-muted-foreground mb-4">
//                   Click the button below to run the final verification check.
//                 </p>
//               </div>
//             )}
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             <Button variant="outline" onClick={() => setCurrentStep("mx")} disabled={loading}>
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             {verificationResults?.healthScore === 100 ? (
//               <Button onClick={() => setCurrentStep("connect-accounts")} className="flex-1">
//                 Continue to Connect Accounts
//                 <ChevronRight className="ml-2 h-4 w-4" />
//               </Button>
//             ) : (
//               <Button onClick={() => handleVerifyStep("mx")} disabled={loading} className="flex-1">
//                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 Run Verification
//                 <ChevronRight className="ml-2 h-4 w-4" />
//               </Button>
//             )}
//           </CardFooter>
//         </Card>
//       )}

//       {/* Connect Accounts Step */}
//       {currentStep === "connect-accounts" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Connect Email Accounts</CardTitle>
//             <CardDescription>Add your email accounts to start sending</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <Alert>
//               <Mail className="h-4 w-4" />
//               <AlertTitle>Almost Done!</AlertTitle>
//               <AlertDescription>
//                 Your domain is configured. Now connect your email accounts to start sending campaigns.
//               </AlertDescription>
//             </Alert>

//             <div className="grid gap-4">
//               <Button
//                 variant="outline"
//                 className="h-auto justify-start p-4 bg-transparent"
//                 onClick={() => router.push("/dashboard/settings?tab=sending-accounts")}
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
//                     <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//                   </div>
//                   <div className="text-left">
//                     <div className="font-semibold">Connect Gmail</div>
//                     <div className="text-sm text-muted-foreground">Use OAuth for quick setup</div>
//                   </div>
//                 </div>
//               </Button>

//               <Button
//                 variant="outline"
//                 className="h-auto justify-start p-4 bg-transparent"
//                 onClick={() => router.push("/dashboard/settings?tab=sending-accounts")}
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
//                     <Server className="h-5 w-5 text-purple-600 dark:text-purple-400" />
//                   </div>
//                   <div className="text-left">
//                     <div className="font-semibold">Add SMTP Account</div>
//                     <div className="text-sm text-muted-foreground">For custom email providers</div>
//                   </div>
//                 </div>
//               </Button>
//             </div>
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             <Button variant="outline" onClick={() => setCurrentStep("verify")} disabled={loading}>
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <Button onClick={() => setCurrentStep("complete")} className="flex-1">
//               Skip for Now
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* Complete Step */}
//       {currentStep === "complete" && (
//         <Card>
//           <CardHeader className="text-center">
//             <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
//               <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
//             </div>
//             <CardTitle>Setup Complete!</CardTitle>
//             <CardDescription>Your domain is ready for email campaigns</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="rounded-lg border p-4">
//               <h4 className="mb-2 font-semibold">What's Next?</h4>
//               <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
//                 <li>Connect your email accounts if you haven't already</li>
//                 <li>Enable email warmup for better deliverability</li>
//                 <li>Create your first campaign</li>
//                 <li>Import your prospects</li>
//               </ul>
//             </div>
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             <Button variant="outline" onClick={() => router.push("/dashboard/warmup")}>
//               Start Warmup
//             </Button>
//             <Button onClick={() => router.push("/dashboard/campaigns/new")} className="flex-1">
//               Create Campaign
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </CardFooter>
//         </Card>
//       )}
//     </div>
//   )
// }








// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Badge } from "@/components/ui/badge"
// import { useRouter } from "next/navigation"
// import {
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   Loader2,
//   Copy,
//   ChevronRight,
//   ChevronLeft,
//   Shield,
//   Mail,
//   Server,
//   CheckCheck,
//   RefreshCw,
//   ArrowRight,
//   Clock,
//   Info,
// } from "lucide-react"
// import { addDomain, verifyDomain } from "@/lib/actions/domain-action"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// type SetupStep = "welcome" | "add-domain" | "spf" | "dkim" | "dmarc" | "verify" | "complete"

// interface StepStatus {
//   completed: boolean
//   verified: boolean
//   skipped: boolean
// }

// interface WizardState {
//   currentStep: SetupStep
//   domainId: string | null
//   domainName: string
//   dnsRecords: any[]
//   stepStatuses: Record<SetupStep, StepStatus>
//   dkimSelector: string
// }

// interface GuidedEmailWizardProps {
//   existingDomains?: Array<{
//     id: string
//     domain: string
//     isVerified: boolean
//     verificationAttempts: number
//     dnsRecords: any
//     deliverabilityHealth?: any
//   }>
//   existingAccounts?: any[]
// }

// const STORAGE_KEY = "mailfra_email_wizard_state"

// const defaultStepStatus: StepStatus = { completed: false, verified: false, skipped: false }

// const defaultState: WizardState = {
//   currentStep: "welcome",
//   domainId: null,
//   domainName: "",
//   dnsRecords: [],
//   stepStatuses: {
//     welcome: { ...defaultStepStatus },
//     "add-domain": { ...defaultStepStatus },
//     spf: { ...defaultStepStatus },
//     dkim: { ...defaultStepStatus },
//     dmarc: { ...defaultStepStatus },
//     verify: { ...defaultStepStatus },
//     complete: { ...defaultStepStatus },
//   },
//   dkimSelector: "default",
// }

// export function GuidedEmailWizard({ existingDomains = [], existingAccounts = [] }: GuidedEmailWizardProps) {
//   const router = useRouter()
//   const [state, setState] = useState<WizardState>(defaultState)
//   const [loading, setLoading] = useState(false)
//   const [verificationResults, setVerificationResults] = useState<any>(null)
//   const [isInitialized, setIsInitialized] = useState(false)

//   const steps: { id: SetupStep; title: string; description: string; icon: any }[] = [
//     { id: "welcome", title: "Welcome", description: "Get started", icon: CheckCheck },
//     { id: "add-domain", title: "Domain", description: "Add your domain", icon: Server },
//     { id: "spf", title: "SPF", description: "Authorize servers", icon: Shield },
//     { id: "dkim", title: "DKIM", description: "Sign emails", icon: Mail },
//     { id: "dmarc", title: "DMARC", description: "Protect domain", icon: Shield },
//     { id: "verify", title: "Verify", description: "Final check", icon: CheckCircle2 },
//     { id: "complete", title: "Done", description: "All set!", icon: CheckCircle2 },
//   ]

//   const currentStepIndex = steps.findIndex((s) => s.id === state.currentStep)

//   useEffect(() => {
//     if (typeof window === "undefined") return

//     const savedState = localStorage.getItem(STORAGE_KEY)
//     if (savedState) {
//       try {
//         const parsed = JSON.parse(savedState)
//         setState(parsed)
//       } catch (e) {
//         console.error("Failed to parse saved state")
//       }
//     }

//     // Check for existing unconfigured domains from database
//     if (existingDomains.length > 0) {
//       const unconfigured = existingDomains.find((d) => !d.isVerified)
//       if (unconfigured) {
//         const health = unconfigured.deliverabilityHealth

//         setState((prev) => {
//           const newState = { ...prev }
//           newState.domainId = unconfigured.id
//           newState.domainName = unconfigured.domain

//           if (unconfigured.dnsRecords?.records) {
//             newState.dnsRecords = unconfigured.dnsRecords.records
//           }

//           // Set completed steps based on health data
//           if (health) {
//             newState.stepStatuses = {
//               ...prev.stepStatuses,
//               "add-domain": { completed: true, verified: true, skipped: false },
//               spf: {
//                 completed: true,
//                 verified: health.spfValid || false,
//                 skipped: !health.spfValid,
//               },
//               dkim: {
//                 completed: health.spfValid || false,
//                 verified: health.dkimValid || false,
//                 skipped: !health.dkimValid && health.spfValid,
//               },
//               dmarc: {
//                 completed: health.dkimValid || health.spfValid || false,
//                 verified: health.dmarcValid || false,
//                 skipped: !health.dmarcValid && (health.dkimValid || health.spfValid),
//               },
//             }

//             // Determine current step based on progress
//             if (!health.spfValid && !prev.stepStatuses.spf.skipped) {
//               newState.currentStep = "spf"
//             } else if (!health.dkimValid && !prev.stepStatuses.dkim.skipped) {
//               newState.currentStep = "dkim"
//             } else if (!health.dmarcValid && !prev.stepStatuses.dmarc.skipped) {
//               newState.currentStep = "dmarc"
//             } else {
//               newState.currentStep = "verify"
//             }
//           } else if (unconfigured.verificationAttempts > 0) {
//             newState.stepStatuses["add-domain"] = { completed: true, verified: true, skipped: false }
//             newState.currentStep = "spf"
//           }

//           return newState
//         })
//       }
//     }

//     setIsInitialized(true)
//   }, [existingDomains])

//   useEffect(() => {
//     if (!isInitialized) return
//     if (typeof window === "undefined") return
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
//   }, [state, isInitialized])

//   const updateStepStatus = (step: SetupStep, updates: Partial<StepStatus>) => {
//     setState((prev) => ({
//       ...prev,
//       stepStatuses: {
//         ...prev.stepStatuses,
//         [step]: { ...prev.stepStatuses[step], ...updates },
//       },
//     }))
//   }

//   const goToStep = (step: SetupStep) => {
//     setState((prev) => ({ ...prev, currentStep: step }))
//   }

//   const nextStep = () => {
//     const nextIndex = currentStepIndex + 1
//     if (nextIndex < steps.length) {
//       goToStep(steps[nextIndex].id)
//     }
//   }

//   const prevStep = () => {
//     const prevIndex = currentStepIndex - 1
//     if (prevIndex >= 0) {
//       goToStep(steps[prevIndex].id)
//     }
//   }

//   const handleAddDomain = async () => {
//     if (!state.domainName) {
//       toast.error("Please enter a domain name")
//       return
//     }

//     const cleanDomain = state.domainName
//       .trim()
//       .toLowerCase()
//       .replace(/^https?:\/\//, "")
//       .replace(/^www\./, "")
//       .replace(/\/.*$/, "")

//     setState((prev) => ({ ...prev, domainName: cleanDomain }))

//     const existingDomain = existingDomains?.find((d) => d.domain.toLowerCase() === cleanDomain)

//     if (existingDomain) {
//       if (existingDomain.isVerified) {
//         toast.error("Domain already configured", {
//           description: "This domain is already verified. You can manage it in Settings.",
//         })
//         return
//       } else {
//         setState((prev) => ({
//           ...prev,
//           domainId: existingDomain.id,
//           dnsRecords: existingDomain.dnsRecords?.records || [],
//         }))
//         updateStepStatus("add-domain", { completed: true, verified: true })
//         toast.info("Resuming configuration", {
//           description: "This domain was added before. Continue with DNS setup.",
//         })
//         goToStep("spf")
//         return
//       }
//     }

//     setLoading(true)
//     try {
//       const result = await addDomain(cleanDomain)

//       if (result.success === false) {
//         toast.error(result.error || "Failed to add domain")
//         return
//       }

//       if (result.success && result.domainId && result.dnsRecords) {
//         setState((prev) => ({
//           ...prev,
//           domainId: result.domainId,
//           dnsRecords: result.dnsRecords.records,
//           dkimSelector: result.dnsRecords.selector || "default",
//         }))
//         updateStepStatus("add-domain", { completed: true, verified: true })
//         toast.success("Domain added successfully!")
//         goToStep("spf")
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Failed to add domain")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleVerifyStep = async (step: "spf" | "dkim" | "dmarc") => {
//     if (!state.domainId) {
//       toast.error("No domain configured")
//       return
//     }

//     setLoading(true)
//     try {
//       const result = await verifyDomain(state.domainId)
//       setVerificationResults(result)

//       const stepResult = result.results.find((r: any) => r.type === step.toUpperCase())
//       const isValid = stepResult?.valid || false

//       if (isValid) {
//         updateStepStatus(step, { completed: true, verified: true, skipped: false })
//         toast.success(`${step.toUpperCase()} record verified!`, {
//           icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
//         })

//         // Auto advance to next step
//         const stepOrder: SetupStep[] = ["spf", "dkim", "dmarc", "verify"]
//         const currentIdx = stepOrder.indexOf(step)
//         if (currentIdx < stepOrder.length - 1) {
//           goToStep(stepOrder[currentIdx + 1])
//         }
//       } else {
//         toast.error(`${step.toUpperCase()} not verified yet`, {
//           description: "DNS changes can take up to 48 hours. You can skip and verify later.",
//         })
//       }
//     } catch (error) {
//       toast.error("Verification failed. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSkipStep = (step: "spf" | "dkim" | "dmarc") => {
//     updateStepStatus(step, { completed: true, skipped: true })
//     const stepOrder: SetupStep[] = ["spf", "dkim", "dmarc", "verify"]
//     const currentIdx = stepOrder.indexOf(step)
//     if (currentIdx < stepOrder.length - 1) {
//       goToStep(stepOrder[currentIdx + 1])
//     }
//   }

//   const handleFinalVerification = async () => {
//     if (!state.domainId) return

//     setLoading(true)
//     try {
//       const result = await verifyDomain(state.domainId)
//       setVerificationResults(result)

//       const allVerified = result.results.every((r: any) => r.valid)

//       if (allVerified) {
//         updateStepStatus("verify", { completed: true, verified: true })
//         toast.success("All DNS records verified! Your domain is ready.")
//         goToStep("complete")
//       } else {
//         const failed = result.results.filter((r: any) => !r.valid).map((r: any) => r.type)
//         toast.error(`Some records still pending: ${failed.join(", ")}`, {
//           description: "You can complete setup anyway or go back to fix them.",
//         })
//       }
//     } catch (error) {
//       toast.error("Verification failed. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCompleteSetup = () => {
//     // Clear saved state
//     localStorage.removeItem(STORAGE_KEY)
//     toast.success("Setup complete! Redirecting to settings...")
//     router.push("/dashboard/settings")
//   }

//   const resetWizard = () => {
//     localStorage.removeItem(STORAGE_KEY)
//     setState(defaultState)
//     toast.info("Wizard reset. Starting fresh.")
//   }

//   const copyToClipboard = (text: string, label: string) => {
//     navigator.clipboard.writeText(text)
//     toast.success(`${label} copied!`, { duration: 2000 })
//   }

//   // Get DNS records with fallbacks
//   const spfRecord = state.dnsRecords.find((r) => r.type === "TXT" && (r.name === "@" || r.name === "")) || {
//     type: "TXT",
//     name: "@",
//     value: `v=spf1 include:sendgrid.net ~all`,
//   }

//   const dkimRecord = state.dnsRecords.find((r) => r.type === "CNAME" && r.name?.includes("_domainkey")) || {
//     type: "CNAME",
//     name: `${state.dkimSelector}._domainkey`,
//     value: `${state.dkimSelector}.sendgrid.net`,
//   }

//   const dmarcRecord = state.dnsRecords.find((r) => r.type === "TXT" && r.name === "_dmarc") || {
//     type: "TXT",
//     name: "_dmarc",
//     value: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${state.domainName || "yourdomain.com"}`,
//   }

//   const getStepIcon = (step: (typeof steps)[0], index: number) => {
//     const status = state.stepStatuses[step.id]
//     const isCurrent = state.currentStep === step.id
//     const isPast = index < currentStepIndex

//     if (status.verified) {
//       return <CheckCircle2 className="h-5 w-5 text-white" />
//     }
//     if (status.skipped) {
//       return <Clock className="h-5 w-5 text-white" />
//     }
//     return <step.icon className="h-5 w-5" />
//   }

//   const getStepStyles = (step: (typeof steps)[0], index: number) => {
//     const status = state.stepStatuses[step.id]
//     const isCurrent = state.currentStep === step.id
//     const isPast = index < currentStepIndex

//     if (status.verified) {
//       return "border-green-500 bg-green-500 text-white"
//     }
//     if (status.skipped) {
//       return "border-amber-500 bg-amber-500 text-white"
//     }
//     if (isCurrent) {
//       return "border-primary bg-primary text-primary-foreground"
//     }
//     if (isPast || status.completed) {
//       return "border-muted-foreground/50 bg-muted text-muted-foreground"
//     }
//     return "border-muted-foreground/20 bg-background text-muted-foreground"
//   }

//   return (
//     <TooltipProvider>
//       <div className="mx-auto max-w-4xl space-y-6">
//         {/* Step Navigation - Clickable */}
//         <div className="relative">
//           <div className="flex items-center justify-between">
//             {steps.map((step, index) => {
//               const status = state.stepStatuses[step.id]
//               const isClickable = index <= currentStepIndex || status.completed || status.skipped

//               return (
//                 <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <button
//                         onClick={() => isClickable && goToStep(step.id)}
//                         disabled={!isClickable}
//                         className={cn(
//                           "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200",
//                           getStepStyles(step, index),
//                           isClickable && "cursor-pointer hover:scale-110",
//                           !isClickable && "cursor-not-allowed opacity-50",
//                         )}
//                       >
//                         {getStepIcon(step, index)}
//                       </button>
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p className="font-medium">{step.title}</p>
//                       <p className="text-xs text-muted-foreground">{step.description}</p>
//                       {status.verified && <p className="text-xs text-green-500">Verified</p>}
//                       {status.skipped && <p className="text-xs text-amber-500">Skipped - verify later</p>}
//                     </TooltipContent>
//                   </Tooltip>
//                   <div className="text-center">
//                     <span
//                       className={cn(
//                         "text-xs font-medium",
//                         state.currentStep === step.id ? "text-primary" : "text-muted-foreground",
//                       )}
//                     >
//                       {step.title}
//                     </span>
//                     {status.verified && (
//                       <Badge variant="outline" className="ml-1 h-4 px-1 text-[10px] border-green-500 text-green-600">
//                         Done
//                       </Badge>
//                     )}
//                     {status.skipped && (
//                       <Badge variant="outline" className="ml-1 h-4 px-1 text-[10px] border-amber-500 text-amber-600">
//                         Later
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>

//           {/* Progress line */}
//           <div className="absolute top-6 left-0 right-0 h-0.5 bg-muted -z-0">
//             <div
//               className="h-full bg-primary transition-all duration-300"
//               style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
//             />
//           </div>
//         </div>

//         {/* Welcome Step */}
//         {state.currentStep === "welcome" && (
//           <Card className="border-2">
//             <CardHeader className="text-center pb-2">
//               <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
//                 <Mail className="h-10 w-10 text-primary" />
//               </div>
//               <CardTitle className="text-2xl">Welcome to Email Setup</CardTitle>
//               <CardDescription className="text-base">
//                 Let's configure your domain for maximum email deliverability
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid gap-4 md:grid-cols-3">
//                 <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
//                   <Shield className="h-8 w-8 text-primary mb-2" />
//                   <h4 className="font-semibold">SPF Record</h4>
//                   <p className="text-sm text-muted-foreground">Authorize your email servers</p>
//                 </div>
//                 <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
//                   <Mail className="h-8 w-8 text-primary mb-2" />
//                   <h4 className="font-semibold">DKIM Key</h4>
//                   <p className="text-sm text-muted-foreground">Digitally sign your emails</p>
//                 </div>
//                 <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
//                   <Shield className="h-8 w-8 text-primary mb-2" />
//                   <h4 className="font-semibold">DMARC Policy</h4>
//                   <p className="text-sm text-muted-foreground">Protect against spoofing</p>
//                 </div>
//               </div>

//               <Alert>
//                 <Info className="h-4 w-4" />
//                 <AlertTitle>What you'll need</AlertTitle>
//                 <AlertDescription>
//                   <ul className="mt-2 space-y-1 text-sm">
//                     <li>• Access to your domain's DNS settings (GoDaddy, Cloudflare, etc.)</li>
//                     <li>• About 10-15 minutes of your time</li>
//                     <li>• Your domain name (e.g., yourbusiness.com)</li>
//                   </ul>
//                 </AlertDescription>
//               </Alert>

//               <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950 p-4">
//                 <p className="text-sm text-green-800 dark:text-green-200">
//                   <strong>Don't worry!</strong> We'll guide you through every step with clear, simple instructions. No
//                   technical knowledge required - just copy and paste!
//                 </p>
//               </div>
//             </CardContent>
//             <CardFooter>
//               <Button onClick={() => goToStep("add-domain")} className="w-full" size="lg">
//                 Let's Get Started
//                 <ArrowRight className="ml-2 h-5 w-5" />
//               </Button>
//             </CardFooter>
//           </Card>
//         )}

//         {/* Add Domain Step */}
//         {state.currentStep === "add-domain" && (
//           <Card className="border-2">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Server className="h-5 w-5" />
//                 Add Your Domain
//               </CardTitle>
//               <CardDescription>Enter the domain you want to send emails from</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="domain">Domain Name</Label>
//                 <Input
//                   id="domain"
//                   placeholder="yourbusiness.com"
//                   value={state.domainName}
//                   onChange={(e) =>
//                     setState((prev) => ({
//                       ...prev,
//                       domainName: e.target.value.trim().toLowerCase(),
//                     }))
//                   }
//                   disabled={loading}
//                   className="text-lg h-12"
//                 />
//                 <p className="text-sm text-muted-foreground">Just the domain - no http://, www, or paths</p>
//               </div>

//               <div className="flex gap-4 text-sm">
//                 <div className="flex items-center gap-2 text-green-600">
//                   <CheckCircle2 className="h-4 w-4" />
//                   <code>company.com</code>
//                 </div>
//                 <div className="flex items-center gap-2 text-red-600">
//                   <XCircle className="h-4 w-4" />
//                   <code>https://www.company.com</code>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className="flex gap-2">
//               <Button variant="outline" onClick={prevStep}>
//                 <ChevronLeft className="mr-2 h-4 w-4" />
//                 Back
//               </Button>
//               <Button onClick={handleAddDomain} disabled={!state.domainName || loading} className="flex-1">
//                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 Add Domain
//                 <ChevronRight className="ml-2 h-4 w-4" />
//               </Button>
//             </CardFooter>
//           </Card>
//         )}

//         {/* SPF Step */}
//         {state.currentStep === "spf" && (
//           <DNSRecordStep
//             title="SPF Record"
//             description="Sender Policy Framework - Tells email providers which servers can send emails from your domain"
//             icon={Shield}
//             recordType="TXT"
//             recordName={spfRecord.name}
//             recordValue={spfRecord.value}
//             isVerified={state.stepStatuses.spf.verified}
//             isSkipped={state.stepStatuses.spf.skipped}
//             loading={loading}
//             onVerify={() => handleVerifyStep("spf")}
//             onSkip={() => handleSkipStep("spf")}
//             onBack={prevStep}
//             onCopy={copyToClipboard}
//             helpText="Add this TXT record to your DNS. The '@' symbol means the root domain."
//           />
//         )}

//         {/* DKIM Step */}
//         {state.currentStep === "dkim" && (
//           <DNSRecordStep
//             title="DKIM Key"
//             description="DomainKeys Identified Mail - Digitally signs your emails to prove they're really from you"
//             icon={Mail}
//             recordType="CNAME"
//             recordName={dkimRecord.name}
//             recordValue={dkimRecord.value}
//             isVerified={state.stepStatuses.dkim.verified}
//             isSkipped={state.stepStatuses.dkim.skipped}
//             loading={loading}
//             onVerify={() => handleVerifyStep("dkim")}
//             onSkip={() => handleSkipStep("dkim")}
//             onBack={prevStep}
//             onCopy={copyToClipboard}
//             helpText="Add this CNAME record. Some providers call the Name field 'Host' or 'Alias'."
//             extraInfo={
//               <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
//                 <AlertCircle className="h-4 w-4 text-amber-600" />
//                 <AlertTitle className="text-amber-800 dark:text-amber-200">DKIM can be tricky</AlertTitle>
//                 <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm">
//                   <p>If verification fails, check:</p>
//                   <ul className="mt-1 list-disc pl-4">
//                     <li>Your email provider (Gmail, SendGrid, etc.) may use a different selector</li>
//                     <li>Some DNS providers need you to remove the domain suffix from the name</li>
//                     <li>DNS changes can take up to 48 hours to propagate</li>
//                   </ul>
//                 </AlertDescription>
//               </Alert>
//             }
//           />
//         )}

//         {/* DMARC Step */}
//         {state.currentStep === "dmarc" && (
//           <DNSRecordStep
//             title="DMARC Policy"
//             description="Domain-based Message Authentication - Protects your domain from being used in phishing attacks"
//             icon={Shield}
//             recordType="TXT"
//             recordName={dmarcRecord.name}
//             recordValue={dmarcRecord.value}
//             isVerified={state.stepStatuses.dmarc.verified}
//             isSkipped={state.stepStatuses.dmarc.skipped}
//             loading={loading}
//             onVerify={() => handleVerifyStep("dmarc")}
//             onSkip={() => handleSkipStep("dmarc")}
//             onBack={prevStep}
//             onCopy={copyToClipboard}
//             helpText="Add this TXT record. The name should be exactly '_dmarc' (with underscore)."
//           />
//         )}

//         {/* Verify Step */}
//         {state.currentStep === "verify" && (
//           <Card className="border-2">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <CheckCircle2 className="h-5 w-5" />
//                 Final Verification
//               </CardTitle>
//               <CardDescription>Let's verify all your DNS records are configured correctly</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {/* Status Summary */}
//               <div className="space-y-3">
//                 {[
//                   { id: "spf", name: "SPF Record", status: state.stepStatuses.spf },
//                   { id: "dkim", name: "DKIM Key", status: state.stepStatuses.dkim },
//                   { id: "dmarc", name: "DMARC Policy", status: state.stepStatuses.dmarc },
//                 ].map((item) => (
//                   <div
//                     key={item.id}
//                     className={cn(
//                       "flex items-center justify-between p-4 rounded-lg border-2",
//                       item.status.verified && "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950",
//                       item.status.skipped && "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950",
//                       !item.status.verified && !item.status.skipped && "border-muted",
//                     )}
//                   >
//                     <div className="flex items-center gap-3">
//                       {item.status.verified ? (
//                         <CheckCircle2 className="h-5 w-5 text-green-600" />
//                       ) : item.status.skipped ? (
//                         <Clock className="h-5 w-5 text-amber-600" />
//                       ) : (
//                         <XCircle className="h-5 w-5 text-muted-foreground" />
//                       )}
//                       <span className="font-medium">{item.name}</span>
//                     </div>
//                     {item.status.verified ? (
//                       <Badge className="bg-green-600">Verified</Badge>
//                     ) : item.status.skipped ? (
//                       <Button variant="outline" size="sm" onClick={() => goToStep(item.id as SetupStep)}>
//                         Go Back & Verify
//                       </Button>
//                     ) : (
//                       <Badge variant="outline">Pending</Badge>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {verificationResults && (
//                 <Alert
//                   className={cn(
//                     verificationResults.allValid
//                       ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
//                       : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950",
//                   )}
//                 >
//                   <AlertCircle className="h-4 w-4" />
//                   <AlertTitle>
//                     {verificationResults.allValid ? "All records verified!" : "Some records need attention"}
//                   </AlertTitle>
//                   <AlertDescription>
//                     {verificationResults.allValid
//                       ? "Your domain is properly configured for email sending."
//                       : "You can continue setup, but unverified records may affect deliverability."}
//                   </AlertDescription>
//                 </Alert>
//               )}
//             </CardContent>
//             <CardFooter className="flex gap-2">
//               <Button variant="outline" onClick={prevStep}>
//                 <ChevronLeft className="mr-2 h-4 w-4" />
//                 Back
//               </Button>
//               <Button
//                 onClick={handleFinalVerification}
//                 disabled={loading}
//                 variant="outline"
//                 className="flex-1 bg-transparent"
//               >
//                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 <RefreshCw className="mr-2 h-4 w-4" />
//                 Re-verify All
//               </Button>
//               <Button onClick={() => goToStep("complete")} className="flex-1">
//                 Complete Setup
//                 <ChevronRight className="ml-2 h-4 w-4" />
//               </Button>
//             </CardFooter>
//           </Card>
//         )}

//         {/* Complete Step */}
//         {state.currentStep === "complete" && (
//           <Card className="border-2 border-green-200 dark:border-green-900">
//             <CardHeader className="text-center pb-2">
//               <div className="mx-auto mb-4 p-4 bg-green-100 dark:bg-green-900 rounded-full w-fit">
//                 <CheckCircle2 className="h-12 w-12 text-green-600" />
//               </div>
//               <CardTitle className="text-2xl text-green-700 dark:text-green-300">Setup Complete!</CardTitle>
//               <CardDescription className="text-base">
//                 Your domain <strong>{state.domainName}</strong> is now configured for email sending
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid gap-4 md:grid-cols-3">
//                 {[
//                   { name: "SPF", status: state.stepStatuses.spf },
//                   { name: "DKIM", status: state.stepStatuses.dkim },
//                   { name: "DMARC", status: state.stepStatuses.dmarc },
//                 ].map((item) => (
//                   <div
//                     key={item.name}
//                     className={cn(
//                       "flex flex-col items-center p-4 rounded-lg",
//                       item.status.verified ? "bg-green-100 dark:bg-green-900/50" : "bg-amber-100 dark:bg-amber-900/50",
//                     )}
//                   >
//                     {item.status.verified ? (
//                       <CheckCircle2 className="h-8 w-8 text-green-600 mb-2" />
//                     ) : (
//                       <Clock className="h-8 w-8 text-amber-600 mb-2" />
//                     )}
//                     <span className="font-medium">{item.name}</span>
//                     <span className={cn("text-sm", item.status.verified ? "text-green-600" : "text-amber-600")}>
//                       {item.status.verified ? "Verified" : "Pending"}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {(state.stepStatuses.spf.skipped ||
//                 state.stepStatuses.dkim.skipped ||
//                 state.stepStatuses.dmarc.skipped) && (
//                 <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
//                   <Clock className="h-4 w-4 text-amber-600" />
//                   <AlertTitle className="text-amber-800 dark:text-amber-200">Some records pending</AlertTitle>
//                   <AlertDescription className="text-amber-700 dark:text-amber-300">
//                     You can start sending emails, but for best deliverability, come back to verify skipped records once
//                     your DNS changes propagate (up to 48 hours).
//                   </AlertDescription>
//                 </Alert>
//               )}

//               <div className="rounded-lg border p-4 space-y-3">
//                 <h4 className="font-semibold">Next Steps:</h4>
//                 <ul className="space-y-2 text-sm text-muted-foreground">
//                   <li className="flex items-center gap-2">
//                     <CheckCircle2 className="h-4 w-4 text-green-500" />
//                     Connect your email accounts in Settings
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <CheckCircle2 className="h-4 w-4 text-green-500" />
//                     Start email warmup to build reputation
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <CheckCircle2 className="h-4 w-4 text-green-500" />
//                     Create your first campaign
//                   </li>
//                 </ul>
//               </div>
//             </CardContent>
//             <CardFooter className="flex gap-2">
//               <Button variant="outline" onClick={resetWizard}>
//                 Setup Another Domain
//               </Button>
//               <Button onClick={handleCompleteSetup} className="flex-1">
//                 Go to Settings
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </CardFooter>
//           </Card>
//         )}
//       </div>
//     </TooltipProvider>
//   )
// }

// // Reusable DNS Record Step Component
// interface DNSRecordStepProps {
//   title: string
//   description: string
//   icon: any
//   recordType: string
//   recordName: string
//   recordValue: string
//   isVerified: boolean
//   isSkipped: boolean
//   loading: boolean
//   onVerify: () => void
//   onSkip: () => void
//   onBack: () => void
//   onCopy: (text: string, label: string) => void
//   helpText: string
//   extraInfo?: React.ReactNode
// }

// function DNSRecordStep({
//   title,
//   description,
//   icon: Icon,
//   recordType,
//   recordName,
//   recordValue,
//   isVerified,
//   isSkipped,
//   loading,
//   onVerify,
//   onSkip,
//   onBack,
//   onCopy,
//   helpText,
//   extraInfo,
// }: DNSRecordStepProps) {
//   return (
//     <Card className={cn("border-2", isVerified && "border-green-200 dark:border-green-900")}>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Icon className="h-5 w-5" />
//           {title}
//           {isVerified && <Badge className="bg-green-600 ml-2">Verified</Badge>}
//           {isSkipped && (
//             <Badge variant="outline" className="border-amber-500 text-amber-600 ml-2">
//               Skipped
//             </Badge>
//           )}
//         </CardTitle>
//         <CardDescription>{description}</CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {/* Visual Instructions */}
//         <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
//           <div className="flex items-start gap-3">
//             <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
//               1
//             </div>
//             <div>
//               <p className="font-medium">Go to your DNS provider</p>
//               <p className="text-sm text-muted-foreground">
//                 Open your domain registrar (GoDaddy, Cloudflare, Namecheap, etc.) and find DNS settings
//               </p>
//             </div>
//           </div>

//           <div className="flex items-start gap-3">
//             <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
//               2
//             </div>
//             <div>
//               <p className="font-medium">Add a new {recordType} record</p>
//               <p className="text-sm text-muted-foreground">{helpText}</p>
//             </div>
//           </div>

//           <div className="flex items-start gap-3">
//             <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
//               3
//             </div>
//             <div className="flex-1">
//               <p className="font-medium mb-3">Copy these values:</p>

//               <div className="space-y-3">
//                 <div className="space-y-1">
//                   <Label className="text-xs text-muted-foreground">Type</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 rounded bg-background px-3 py-2 text-sm font-mono border">
//                       {recordType}
//                     </code>
//                   </div>
//                 </div>

//                 <div className="space-y-1">
//                   <Label className="text-xs text-muted-foreground">Name / Host</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 rounded bg-background px-3 py-2 text-sm font-mono border truncate">
//                       {recordName}
//                     </code>
//                     <Button variant="outline" size="sm" onClick={() => onCopy(recordName, "Name")}>
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="space-y-1">
//                   <Label className="text-xs text-muted-foreground">Value / Content</Label>
//                   <div className="flex items-center gap-2">
//                     <code className="flex-1 rounded bg-background px-3 py-2 text-sm font-mono border break-all">
//                       {recordValue}
//                     </code>
//                     <Button variant="outline" size="sm" onClick={() => onCopy(recordValue, "Value")}>
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {extraInfo}

//         <Alert>
//           <Clock className="h-4 w-4" />
//           <AlertTitle>DNS changes take time</AlertTitle>
//           <AlertDescription>
//             It can take anywhere from a few minutes to 48 hours for DNS changes to propagate. If verification fails,
//             wait a bit and try again.
//           </AlertDescription>
//         </Alert>
//       </CardContent>
//       <CardFooter className="flex flex-col sm:flex-row gap-2">
//         <Button variant="outline" onClick={onBack}>
//           <ChevronLeft className="mr-2 h-4 w-4" />
//           Back
//         </Button>
//         <Button variant="outline" onClick={onSkip} className="sm:ml-auto bg-transparent">
//           <Clock className="mr-2 h-4 w-4" />
//           Skip for Now
//         </Button>
//         <Button onClick={onVerify} disabled={loading}>
//           {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//           <CheckCircle2 className="mr-2 h-4 w-4" />
//           Verify {title}
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }










// "use client"

// import type React from "react"
// import { useState, useEffect, useCallback } from "react"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { useRouter } from "next/navigation"
// import {
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   Loader2,
//   Copy,
//   ChevronRight,
//   ChevronLeft,
//   Shield,
//   Mail,
//   Server,
//   CheckCheck,
//   RefreshCw,
//   ArrowRight,
//   Clock,
//   Info,
//   Sparkles,
//   HelpCircle,
//   Check,
// } from "lucide-react"
// import { addDomain, verifyDomain } from "@/lib/actions/domain-action"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"
// import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
// import { Progress } from "@/components/ui/progress"

// type SetupStep = "welcome" | "add-domain" | "spf" | "dkim" | "dmarc" | "verify" | "complete"

// interface StepStatus {
//   completed: boolean
//   verified: boolean
//   skipped: boolean
// }

// interface WizardState {
//   currentStep: SetupStep
//   domainId: string | null
//   domainName: string
//   dnsRecords: any[]
//   stepStatuses: Record<SetupStep, StepStatus>
//   dkimSelector: string
// }

// interface GuidedEmailWizardProps {
//   existingDomains?: Array<{
//     id: string
//     domain: string
//     isVerified: boolean
//     verificationAttempts: number
//     dnsRecords: any
//     deliverabilityHealth?: any
//   }>
//   existingAccounts?: any[]
// }

// const STORAGE_KEY = "mailfra_email_wizard_state"

// const defaultStepStatus: StepStatus = { completed: false, verified: false, skipped: false }

// const defaultState: WizardState = {
//   currentStep: "welcome",
//   domainId: null,
//   domainName: "",
//   dnsRecords: [],
//   stepStatuses: {
//     welcome: { ...defaultStepStatus },
//     "add-domain": { ...defaultStepStatus },
//     spf: { ...defaultStepStatus },
//     dkim: { ...defaultStepStatus },
//     dmarc: { ...defaultStepStatus },
//     verify: { ...defaultStepStatus },
//     complete: { ...defaultStepStatus },
//   },
//   dkimSelector: "default",
// }

// const steps: { id: SetupStep; title: string; shortTitle: string; description: string; icon: any }[] = [
//   { id: "welcome", title: "Welcome", shortTitle: "Start", description: "Get started", icon: Sparkles },
//   { id: "add-domain", title: "Add Domain", shortTitle: "Domain", description: "Enter your domain", icon: Server },
//   { id: "spf", title: "SPF Record", shortTitle: "SPF", description: "Authorize servers", icon: Shield },
//   { id: "dkim", title: "DKIM Key", shortTitle: "DKIM", description: "Sign emails", icon: Mail },
//   { id: "dmarc", title: "DMARC Policy", shortTitle: "DMARC", description: "Protect domain", icon: Shield },
//   { id: "verify", title: "Final Check", shortTitle: "Verify", description: "Verify all", icon: CheckCheck },
//   { id: "complete", title: "Complete", shortTitle: "Done", description: "All set!", icon: CheckCircle2 },
// ]

// export function GuidedEmailWizard({ existingDomains = [], existingAccounts = [] }: GuidedEmailWizardProps) {
//   const router = useRouter()
//   const [state, setState] = useState<WizardState>(defaultState)
//   const [loading, setLoading] = useState(false)
//   const [verificationResults, setVerificationResults] = useState<any>(null)
//   const [isInitialized, setIsInitialized] = useState(false)
//   const [copied, setCopied] = useState<string | null>(null)

//   const currentStepIndex = steps.findIndex((s) => s.id === state.currentStep)
//   const progress = Math.round((currentStepIndex / (steps.length - 1)) * 100)

//   useEffect(() => {
//     const handleSelectDomain = (event: CustomEvent<{ domainId: string; domainName: string }>) => {
//       const { domainId, domainName } = event.detail

//       // Find the domain in existing domains to get its data
//       const domain = existingDomains.find((d) => d.id === domainId)

//       if (domain) {
//         setState((prev) => ({
//           ...prev,
//           domainId: domain.id,
//           domainName: domain.domain,
//           dnsRecords: domain.dnsRecords?.records || [],
//           stepStatuses: {
//             ...prev.stepStatuses,
//             "add-domain": { completed: true, verified: true, skipped: false },
//           },
//           currentStep: "spf", // Start at SPF since domain is already added
//         }))

//         toast.info(`Configuring ${domain.domain}`, {
//           description: "Continue with DNS setup below",
//         })
//       }
//     }

//     window.addEventListener("select-domain", handleSelectDomain as EventListener)
//     return () => window.removeEventListener("select-domain", handleSelectDomain as EventListener)
//   }, [existingDomains])

//   // Load saved state from localStorage
//   useEffect(() => {
//     if (typeof window === "undefined") return

//     const savedState = localStorage.getItem(STORAGE_KEY)
//     if (savedState) {
//       try {
//         const parsed = JSON.parse(savedState)
//         setState(parsed)
//       } catch (e) {
//         console.error("Failed to parse saved wizard state")
//       }
//     }

//     // Check for existing unconfigured domains
//     if (existingDomains.length > 0) {
//       const unconfigured = existingDomains.find((d) => !d.isVerified)
//       if (unconfigured) {
//         const health = unconfigured.deliverabilityHealth

//         setState((prev) => {
//           const newState = { ...prev }
//           newState.domainId = unconfigured.id
//           newState.domainName = unconfigured.domain

//           if (unconfigured.dnsRecords?.records) {
//             newState.dnsRecords = unconfigured.dnsRecords.records
//           }

//           if (health) {
//             newState.stepStatuses = {
//               ...prev.stepStatuses,
//               "add-domain": { completed: true, verified: true, skipped: false },
//               spf: { completed: true, verified: health.spfValid || false, skipped: !health.spfValid },
//               dkim: {
//                 completed: health.spfValid || false,
//                 verified: health.dkimValid || false,
//                 skipped: !health.dkimValid && health.spfValid,
//               },
//               dmarc: {
//                 completed: health.dkimValid || health.spfValid || false,
//                 verified: health.dmarcValid || false,
//                 skipped: !health.dmarcValid && (health.dkimValid || health.spfValid),
//               },
//             }

//             if (!health.spfValid && !prev.stepStatuses.spf.skipped) {
//               newState.currentStep = "spf"
//             } else if (!health.dkimValid && !prev.stepStatuses.dkim.skipped) {
//               newState.currentStep = "dkim"
//             } else if (!health.dmarcValid && !prev.stepStatuses.dmarc.skipped) {
//               newState.currentStep = "dmarc"
//             } else {
//               newState.currentStep = "verify"
//             }
//           } else if (unconfigured.verificationAttempts > 0) {
//             newState.stepStatuses["add-domain"] = { completed: true, verified: true, skipped: false }
//             newState.currentStep = "spf"
//           }

//           return newState
//         })
//       }
//     }

//     setIsInitialized(true)
//   }, [existingDomains])

//   // Save state to localStorage whenever it changes
//   useEffect(() => {
//     if (!isInitialized || typeof window === "undefined") return
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
//   }, [state, isInitialized])

//   const updateStepStatus = useCallback((step: SetupStep, updates: Partial<StepStatus>) => {
//     setState((prev) => ({
//       ...prev,
//       stepStatuses: {
//         ...prev.stepStatuses,
//         [step]: { ...prev.stepStatuses[step], ...updates },
//       },
//     }))
//   }, [])

//   const goToStep = useCallback((step: SetupStep) => {
//     setState((prev) => ({ ...prev, currentStep: step }))
//   }, [])

//   const nextStep = useCallback(() => {
//     const nextIndex = currentStepIndex + 1
//     if (nextIndex < steps.length) {
//       goToStep(steps[nextIndex].id)
//     }
//   }, [currentStepIndex, goToStep])

//   const prevStep = useCallback(() => {
//     const prevIndex = currentStepIndex - 1
//     if (prevIndex >= 0) {
//       goToStep(steps[prevIndex].id)
//     }
//   }, [currentStepIndex, goToStep])

//   const handleAddDomain = async () => {
//     if (!state.domainName) {
//       toast.error("Please enter a domain name")
//       return
//     }

//     const cleanDomain = state.domainName
//       .trim()
//       .toLowerCase()
//       .replace(/^https?:\/\//, "")
//       .replace(/^www\./, "")
//       .replace(/\/.*$/, "")

//     setState((prev) => ({ ...prev, domainName: cleanDomain }))

//     const existingDomain = existingDomains?.find((d) => d.domain.toLowerCase() === cleanDomain)

//     if (existingDomain) {
//       if (existingDomain.isVerified) {
//         toast.error("Domain already configured", {
//           description: "This domain is already verified. You can manage it in Settings.",
//         })
//         return
//       } else {
//         setState((prev) => ({
//           ...prev,
//           domainId: existingDomain.id,
//           dnsRecords: existingDomain.dnsRecords?.records || [],
//         }))
//         updateStepStatus("add-domain", { completed: true, verified: true })
//         toast.info("Resuming configuration", {
//           description: "This domain was added before. Continue with DNS setup.",
//         })
//         goToStep("spf")
//         return
//       }
//     }

//     setLoading(true)
//     try {
//       const result = await addDomain(cleanDomain)

//       if (result.success === false) {
//         toast.error(result.error || "Failed to add domain")
//         return
//       }

//       if (result.success && result.domainId && result.dnsRecords) {
//         setState((prev) => ({
//           ...prev,
//           domainId: result.domainId,
//           dnsRecords: result.dnsRecords.records,
//           dkimSelector: result.dnsRecords.selector || "default",
//         }))
//         updateStepStatus("add-domain", { completed: true, verified: true })
//         toast.success("Domain added successfully!")
//         goToStep("spf")
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Failed to add domain")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleVerifyStep = async (step: "spf" | "dkim" | "dmarc") => {
//     if (!state.domainId) {
//       toast.error("No domain configured")
//       return
//     }

//     setLoading(true)
//     try {
//       const result = await verifyDomain(state.domainId)
//       setVerificationResults(result)

//       const stepResult = result.results.find((r: any) => r.type === step.toUpperCase())
//       const isValid = stepResult?.valid || false

//       if (isValid) {
//         updateStepStatus(step, { completed: true, verified: true, skipped: false })
//         toast.success(`${step.toUpperCase()} verified successfully!`)

//         // Auto advance to next step
//         const stepOrder: SetupStep[] = ["spf", "dkim", "dmarc", "verify"]
//         const currentIdx = stepOrder.indexOf(step)
//         if (currentIdx < stepOrder.length - 1) {
//           setTimeout(() => goToStep(stepOrder[currentIdx + 1]), 500)
//         }
//       } else {
//         toast.error(`${step.toUpperCase()} not verified yet`, {
//           description: "DNS changes can take up to 48 hours. You can skip and verify later.",
//         })
//       }
//     } catch (error) {
//       toast.error("Verification failed. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSkipStep = (step: "spf" | "dkim" | "dmarc") => {
//     updateStepStatus(step, { completed: true, skipped: true })
//     const stepOrder: SetupStep[] = ["spf", "dkim", "dmarc", "verify"]
//     const currentIdx = stepOrder.indexOf(step)
//     if (currentIdx < stepOrder.length - 1) {
//       goToStep(stepOrder[currentIdx + 1])
//     }
//     toast.info("Step skipped", { description: "You can verify this later." })
//   }

//   const handleFinalVerification = async () => {
//     if (!state.domainId) return

//     setLoading(true)
//     try {
//       const result = await verifyDomain(state.domainId)
//       setVerificationResults(result)

//       // Update step statuses based on verification results
//       for (const r of result.results) {
//         const stepId = r.type.toLowerCase() as "spf" | "dkim" | "dmarc"
//         if (steps.find((s) => s.id === stepId)) {
//           updateStepStatus(stepId, { verified: r.valid })
//         }
//       }

//       const allVerified = result.results.every((r: any) => r.valid)

//       if (allVerified) {
//         updateStepStatus("verify", { completed: true, verified: true })
//         toast.success("All DNS records verified!")
//         goToStep("complete")
//       } else {
//         const failed = result.results.filter((r: any) => !r.valid).map((r: any) => r.type)
//         toast.warning(`Pending: ${failed.join(", ")}`, {
//           description: "You can complete setup and verify these later.",
//         })
//       }
//     } catch (error) {
//       toast.error("Verification failed. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCompleteSetup = () => {
//     localStorage.removeItem(STORAGE_KEY)
//     toast.success("Setup complete!")
//     router.push("/dashboard/settings")
//   }

//   const resetWizard = () => {
//     localStorage.removeItem(STORAGE_KEY)
//     setState(defaultState)
//     toast.info("Starting fresh setup")
//   }

//   const copyToClipboard = async (text: string, label: string) => {
//     await navigator.clipboard.writeText(text)
//     setCopied(label)
//     toast.success(`${label} copied!`, { duration: 1500 })
//     setTimeout(() => setCopied(null), 2000)
//   }

//   // Get DNS records with fallbacks
//   const spfRecord = state.dnsRecords.find((r) => r.type === "TXT" && (r.name === "@" || r.name === "")) || {
//     type: "TXT",
//     name: "@",
//     value: `v=spf1 include:sendgrid.net ~all`,
//   }

//   const dkimRecord = state.dnsRecords.find((r) => r.type === "CNAME" && r.name?.includes("_domainkey")) || {
//     type: "CNAME",
//     name: `${state.dkimSelector}._domainkey`,
//     value: `${state.dkimSelector}.sendgrid.net`,
//   }

//   const dmarcRecord = state.dnsRecords.find((r) => r.type === "TXT" && r.name === "_dmarc") || {
//     type: "TXT",
//     name: "_dmarc",
//     value: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${state.domainName || "yourdomain.com"}`,
//   }

//   return (
//     <TooltipProvider>
//       <div className="mx-auto max-w-4xl space-y-8">
//         {/* Progress Header */}
//         <div className="space-y-4">
//           {/* Step indicators */}
//           <div className="relative flex items-center justify-between">
//             {/* Connection line */}
//             <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
//             <div
//               className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
//               style={{ width: `${progress}%` }}
//             />

//             {steps.map((step, index) => {
//               const status = state.stepStatuses[step.id]
//               const isCurrent = state.currentStep === step.id
//               const isPast = index < currentStepIndex
//               const isClickable = index <= currentStepIndex || status.completed || status.skipped

//               return (
//                 <Tooltip key={step.id}>
//                   <TooltipTrigger asChild>
//                     <button
//                       onClick={() => isClickable && goToStep(step.id)}
//                       disabled={!isClickable}
//                       className={cn(
//                         "relative z-10 flex flex-col items-center gap-2 transition-all duration-200",
//                         isClickable ? "cursor-pointer" : "cursor-not-allowed",
//                       )}
//                     >
//                       {/* Step circle */}
//                       <div
//                         className={cn(
//                           "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
//                           status.verified &&
//                             "border-[var(--success)] bg-[var(--success)] text-[var(--success-foreground)] animate-pulse-success",
//                           status.skipped &&
//                             "border-[var(--warning)] bg-[var(--warning)] text-[var(--warning-foreground)]",
//                           isCurrent &&
//                             !status.verified &&
//                             !status.skipped &&
//                             "border-primary bg-primary text-primary-foreground scale-110 shadow-lg",
//                           isPast &&
//                             !status.verified &&
//                             !status.skipped &&
//                             "border-primary/50 bg-primary/10 text-primary",
//                           !isPast &&
//                             !isCurrent &&
//                             !status.verified &&
//                             !status.skipped &&
//                             "border-muted-foreground/30 bg-background text-muted-foreground/50",
//                         )}
//                       >
//                         {status.verified ? (
//                           <Check className="h-5 w-5" strokeWidth={3} />
//                         ) : status.skipped ? (
//                           <Clock className="h-4 w-4" />
//                         ) : (
//                           <step.icon className="h-4 w-4" />
//                         )}
//                       </div>

//                       {/* Step label */}
//                       <span
//                         className={cn(
//                           "text-xs font-medium transition-colors hidden sm:block",
//                           isCurrent ? "text-primary" : "text-muted-foreground",
//                         )}
//                       >
//                         {step.shortTitle}
//                       </span>
//                     </button>
//                   </TooltipTrigger>
//                   <TooltipContent side="bottom" className="text-center">
//                     <p className="font-semibold">{step.title}</p>
//                     <p className="text-xs text-muted-foreground">{step.description}</p>
//                     {status.verified && <p className="text-xs text-[var(--success)] font-medium mt-1">Verified</p>}
//                     {status.skipped && (
//                       <p className="text-xs text-[var(--warning)] font-medium mt-1">Skipped - verify later</p>
//                     )}
//                   </TooltipContent>
//                 </Tooltip>
//               )
//             })}
//           </div>

//           {/* Progress bar */}
//           <div className="space-y-1">
//             <div className="flex justify-between text-xs text-muted-foreground">
//               <span>
//                 Step {currentStepIndex + 1} of {steps.length}
//               </span>
//               <span>{progress}% complete</span>
//             </div>
//             <Progress value={progress} className="h-1.5" />
//           </div>
//         </div>

//         {/* Welcome Step */}
//         {state.currentStep === "welcome" && (
//           <Card className="border-0 shadow-lg animate-slide-up">
//             <CardHeader className="text-center pb-4">
//               <div className="mx-auto mb-6 relative">
//                 <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
//                 <div className="relative p-5 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
//                   <Mail className="h-10 w-10 text-primary-foreground" />
//                 </div>
//               </div>
//               <CardTitle className="text-3xl font-bold tracking-tight">Email Deliverability Setup</CardTitle>
//               <CardDescription className="text-base max-w-md mx-auto">
//                 Configure your domain in 5 minutes to ensure your emails land in the inbox, not spam
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Benefits grid */}
//               <div className="grid gap-4 sm:grid-cols-3">
//                 {[
//                   { icon: Shield, title: "SPF", desc: "Authorize your email servers" },
//                   { icon: Mail, title: "DKIM", desc: "Digitally sign your emails" },
//                   { icon: Shield, title: "DMARC", desc: "Protect from spoofing" },
//                 ].map((item) => (
//                   <div
//                     key={item.title}
//                     className="flex flex-col items-center text-center p-5 rounded-xl bg-secondary/50 border border-border/50"
//                   >
//                     <div className="p-3 bg-primary/10 rounded-lg mb-3">
//                       <item.icon className="h-6 w-6 text-primary" />
//                     </div>
//                     <h4 className="font-semibold text-sm">{item.title}</h4>
//                     <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
//                   </div>
//                 ))}
//               </div>

//               {/* What you need */}
//               <div className="rounded-xl bg-secondary/30 border border-border/50 p-5">
//                 <div className="flex items-center gap-2 mb-3">
//                   <Info className="h-4 w-4 text-primary" />
//                   <h4 className="font-semibold text-sm">What you'll need</h4>
//                 </div>
//                 <ul className="space-y-2 text-sm text-muted-foreground">
//                   <li className="flex items-center gap-2">
//                     <div className="h-1.5 w-1.5 rounded-full bg-primary" />
//                     Access to your DNS settings (GoDaddy, Cloudflare, Namecheap, etc.)
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <div className="h-1.5 w-1.5 rounded-full bg-primary" />
//                     About 5-10 minutes of your time
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <div className="h-1.5 w-1.5 rounded-full bg-primary" />
//                     Your business domain (e.g., yourcompany.com)
//                   </li>
//                 </ul>
//               </div>

//               {/* Reassurance */}
//               <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--success-muted)] border border-[var(--success)]/20">
//                 <CheckCircle2 className="h-5 w-5 text-[var(--success)] shrink-0 mt-0.5" />
//                 <div>
//                   <p className="text-sm font-medium text-[var(--success)]">Don't worry, we'll guide you!</p>
//                   <p className="text-xs text-muted-foreground mt-0.5">
//                     No technical knowledge required. Just copy and paste the values we provide.
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className="pt-2">
//               <Button onClick={() => goToStep("add-domain")} className="w-full h-12 text-base font-semibold" size="lg">
//                 Start Setup
//                 <ArrowRight className="ml-2 h-5 w-5" />
//               </Button>
//             </CardFooter>
//           </Card>
//         )}

//         {/* Add Domain Step */}
//         {state.currentStep === "add-domain" && (
//           <Card className="border-0 shadow-lg animate-slide-up">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-3">
//                 <div className="p-2 bg-primary/10 rounded-lg">
//                   <Server className="h-5 w-5 text-primary" />
//                 </div>
//                 Add Your Domain
//               </CardTitle>
//               <CardDescription>Enter the domain you'll be sending emails from</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-3">
//                 <Label htmlFor="domain" className="text-base font-medium">
//                   Domain Name
//                 </Label>
//                 <Input
//                   id="domain"
//                   placeholder="yourcompany.com"
//                   value={state.domainName}
//                   onChange={(e) =>
//                     setState((prev) => ({
//                       ...prev,
//                       domainName: e.target.value.trim().toLowerCase(),
//                     }))
//                   }
//                   disabled={loading}
//                   className="h-12 text-lg"
//                 />
//                 <p className="text-sm text-muted-foreground">Just the domain name - no http://, www, or paths</p>
//               </div>

//               {/* Examples */}
//               <div className="flex flex-wrap gap-3 text-sm">
//                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--success-muted)] text-[var(--success)]">
//                   <Check className="h-3.5 w-3.5" />
//                   <code className="text-xs">company.com</code>
//                 </div>
//                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive">
//                   <XCircle className="h-3.5 w-3.5" />
//                   <code className="text-xs">https://www.company.com</code>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className="flex gap-3 pt-2">
//               <Button variant="outline" onClick={prevStep} className="px-6 bg-transparent">
//                 <ChevronLeft className="mr-2 h-4 w-4" />
//                 Back
//               </Button>
//               <Button onClick={handleAddDomain} disabled={!state.domainName || loading} className="flex-1 h-11">
//                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 Continue
//                 <ChevronRight className="ml-2 h-4 w-4" />
//               </Button>
//             </CardFooter>
//           </Card>
//         )}

//         {/* SPF Step */}
//         {state.currentStep === "spf" && (
//           <DNSRecordStep
//             title="SPF Record"
//             description="Sender Policy Framework - tells email providers which servers are allowed to send emails from your domain"
//             icon={Shield}
//             recordType="TXT"
//             recordName={spfRecord.name}
//             recordValue={spfRecord.value}
//             isVerified={state.stepStatuses.spf.verified}
//             isSkipped={state.stepStatuses.spf.skipped}
//             loading={loading}
//             onVerify={() => handleVerifyStep("spf")}
//             onSkip={() => handleSkipStep("spf")}
//             onBack={prevStep}
//             onCopy={copyToClipboard}
//             copied={copied}
//             helpText="The '@' symbol means the root domain (yourcompany.com)"
//             stepNumber={3}
//             totalSteps={7}
//           />
//         )}

//         {/* DKIM Step */}
//         {state.currentStep === "dkim" && (
//           <DNSRecordStep
//             title="DKIM Key"
//             description="DomainKeys Identified Mail - digitally signs your emails to prove they're really from you"
//             icon={Mail}
//             recordType="CNAME"
//             recordName={dkimRecord.name}
//             recordValue={dkimRecord.value}
//             isVerified={state.stepStatuses.dkim.verified}
//             isSkipped={state.stepStatuses.dkim.skipped}
//             loading={loading}
//             onVerify={() => handleVerifyStep("dkim")}
//             onSkip={() => handleSkipStep("dkim")}
//             onBack={prevStep}
//             onCopy={copyToClipboard}
//             copied={copied}
//             helpText="Some DNS providers call the Name field 'Host' or 'Alias'"
//             stepNumber={4}
//             totalSteps={7}
//             extraInfo={
//               <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--warning-muted)] border border-[var(--warning)]/20">
//                 <HelpCircle className="h-5 w-5 text-[var(--warning)] shrink-0 mt-0.5" />
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">DKIM verification can take longer</p>
//                   <ul className="text-xs text-muted-foreground space-y-1">
//                     <li>Your email provider (Gmail, SendGrid, etc.) may use a different selector</li>
//                     <li>Some DNS providers require you to remove the domain suffix from the name</li>
//                     <li>DNS changes can take up to 48 hours to propagate</li>
//                   </ul>
//                 </div>
//               </div>
//             }
//           />
//         )}

//         {/* DMARC Step */}
//         {state.currentStep === "dmarc" && (
//           <DNSRecordStep
//             title="DMARC Policy"
//             description="Domain-based Message Authentication - protects your domain from being used in phishing attacks"
//             icon={Shield}
//             recordType="TXT"
//             recordName={dmarcRecord.name}
//             recordValue={dmarcRecord.value}
//             isVerified={state.stepStatuses.dmarc.verified}
//             isSkipped={state.stepStatuses.dmarc.skipped}
//             loading={loading}
//             onVerify={() => handleVerifyStep("dmarc")}
//             onSkip={() => handleSkipStep("dmarc")}
//             onBack={prevStep}
//             onCopy={copyToClipboard}
//             copied={copied}
//             helpText="The name should be exactly '_dmarc' (with underscore)"
//             stepNumber={5}
//             totalSteps={7}
//           />
//         )}

//         {/* Verify Step */}
//         {state.currentStep === "verify" && (
//           <Card className="border-0 shadow-lg animate-slide-up">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-3">
//                 <div className="p-2 bg-primary/10 rounded-lg">
//                   <CheckCheck className="h-5 w-5 text-primary" />
//                 </div>
//                 Final Verification
//               </CardTitle>
//               <CardDescription>Let's verify all your DNS records are configured correctly</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Status cards */}
//               <div className="space-y-3">
//                 {[
//                   { id: "spf", name: "SPF Record", desc: "Server authorization", status: state.stepStatuses.spf },
//                   { id: "dkim", name: "DKIM Key", desc: "Email signing", status: state.stepStatuses.dkim },
//                   { id: "dmarc", name: "DMARC Policy", desc: "Spoofing protection", status: state.stepStatuses.dmarc },
//                 ].map((item) => (
//                   <div
//                     key={item.id}
//                     className={cn(
//                       "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
//                       item.status.verified && "border-[var(--success)]/30 bg-[var(--success-muted)]",
//                       item.status.skipped &&
//                         !item.status.verified &&
//                         "border-[var(--warning)]/30 bg-[var(--warning-muted)]",
//                       !item.status.verified && !item.status.skipped && "border-border bg-secondary/30",
//                     )}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div
//                         className={cn(
//                           "flex h-10 w-10 items-center justify-center rounded-full",
//                           item.status.verified && "bg-[var(--success)] text-[var(--success-foreground)]",
//                           item.status.skipped &&
//                             !item.status.verified &&
//                             "bg-[var(--warning)] text-[var(--warning-foreground)]",
//                           !item.status.verified && !item.status.skipped && "bg-muted text-muted-foreground",
//                         )}
//                       >
//                         {item.status.verified ? (
//                           <Check className="h-5 w-5" strokeWidth={3} />
//                         ) : item.status.skipped ? (
//                           <Clock className="h-5 w-5" />
//                         ) : (
//                           <AlertCircle className="h-5 w-5" />
//                         )}
//                       </div>
//                       <div>
//                         <p className="font-semibold">{item.name}</p>
//                         <p className="text-sm text-muted-foreground">{item.desc}</p>
//                       </div>
//                     </div>
//                     {item.status.verified ? (
//                       <Badge className="bg-[var(--success)] text-[var(--success-foreground)] hover:bg-[var(--success)]">
//                         Verified
//                       </Badge>
//                     ) : item.status.skipped ? (
//                       <Button variant="outline" size="sm" onClick={() => goToStep(item.id as SetupStep)}>
//                         Verify Now
//                       </Button>
//                     ) : (
//                       <Badge variant="outline">Pending</Badge>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {/* Status message */}
//               {verificationResults && (
//                 <div
//                   className={cn(
//                     "flex items-start gap-3 p-4 rounded-xl border",
//                     verificationResults.allValid
//                       ? "bg-[var(--success-muted)] border-[var(--success)]/20"
//                       : "bg-[var(--warning-muted)] border-[var(--warning)]/20",
//                   )}
//                 >
//                   {verificationResults.allValid ? (
//                     <CheckCircle2 className="h-5 w-5 text-[var(--success)] shrink-0" />
//                   ) : (
//                     <AlertCircle className="h-5 w-5 text-[var(--warning)] shrink-0" />
//                   )}
//                   <div>
//                     <p
//                       className={cn(
//                         "text-sm font-medium",
//                         verificationResults.allValid ? "text-[var(--success)]" : "text-[var(--warning)]",
//                       )}
//                     >
//                       {verificationResults.allValid ? "All records verified!" : "Some records still pending"}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-0.5">
//                       {verificationResults.allValid
//                         ? "Your domain is properly configured for email sending."
//                         : "You can complete setup now and verify pending records later."}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//             <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
//               <Button variant="outline" onClick={prevStep} className="sm:w-auto w-full bg-transparent">
//                 <ChevronLeft className="mr-2 h-4 w-4" />
//                 Back
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={handleFinalVerification}
//                 disabled={loading}
//                 className="sm:flex-1 w-full bg-transparent"
//               >
//                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 <RefreshCw className="mr-2 h-4 w-4" />
//                 Re-verify All
//               </Button>
//               <Button onClick={() => goToStep("complete")} className="sm:flex-1 w-full h-11">
//                 Complete Setup
//                 <ChevronRight className="ml-2 h-4 w-4" />
//               </Button>
//             </CardFooter>
//           </Card>
//         )}

//         {/* Complete Step */}
//         {state.currentStep === "complete" && (
//           <Card className="border-0 shadow-lg animate-slide-up overflow-hidden">
//             <div className="h-2 bg-gradient-to-r from-[var(--success)] via-primary to-[var(--success)]" />
//             <CardHeader className="text-center pb-4 pt-8">
//               <div className="mx-auto mb-6 relative">
//                 <div className="absolute inset-0 bg-[var(--success)]/30 blur-3xl rounded-full" />
//                 <div className="relative p-6 bg-[var(--success)] rounded-full shadow-lg animate-pulse-success">
//                   <CheckCircle2 className="h-12 w-12 text-[var(--success-foreground)]" />
//                 </div>
//               </div>
//               <CardTitle className="text-3xl font-bold tracking-tight text-[var(--success)]">Setup Complete!</CardTitle>
//               <CardDescription className="text-base">
//                 <strong className="text-foreground">{state.domainName}</strong> is now configured for email sending
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Final status */}
//               <div className="grid gap-3 sm:grid-cols-3">
//                 {[
//                   { name: "SPF", status: state.stepStatuses.spf },
//                   { name: "DKIM", status: state.stepStatuses.dkim },
//                   { name: "DMARC", status: state.stepStatuses.dmarc },
//                 ].map((item) => (
//                   <div
//                     key={item.name}
//                     className={cn(
//                       "flex flex-col items-center p-5 rounded-xl text-center",
//                       item.status.verified ? "bg-[var(--success-muted)]" : "bg-[var(--warning-muted)]",
//                     )}
//                   >
//                     {item.status.verified ? (
//                       <CheckCircle2 className="h-8 w-8 text-[var(--success)] mb-2" />
//                     ) : (
//                       <Clock className="h-8 w-8 text-[var(--warning)] mb-2" />
//                     )}
//                     <span className="font-semibold">{item.name}</span>
//                     <span
//                       className={cn(
//                         "text-sm",
//                         item.status.verified ? "text-[var(--success)]" : "text-[var(--warning)]",
//                       )}
//                     >
//                       {item.status.verified ? "Verified" : "Pending"}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* Pending warning */}
//               {(state.stepStatuses.spf.skipped ||
//                 state.stepStatuses.dkim.skipped ||
//                 state.stepStatuses.dmarc.skipped) && (
//                 <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--warning-muted)] border border-[var(--warning)]/20">
//                   <Clock className="h-5 w-5 text-[var(--warning)] shrink-0" />
//                   <div>
//                     <p className="text-sm font-medium">Some records are still pending</p>
//                     <p className="text-xs text-muted-foreground mt-0.5">
//                       You can start sending emails, but come back to verify skipped records once your DNS changes
//                       propagate (up to 48 hours).
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Next steps */}
//               <div className="rounded-xl border bg-secondary/30 p-5 space-y-4">
//                 <h4 className="font-semibold flex items-center gap-2">
//                   <Sparkles className="h-4 w-4 text-primary" />
//                   Next Steps
//                 </h4>
//                 <ul className="space-y-3">
//                   {[
//                     { text: "Connect your email accounts in Settings", done: false },
//                     { text: "Start email warmup to build reputation", done: false },
//                     { text: "Create your first campaign", done: false },
//                   ].map((step, i) => (
//                     <li key={i} className="flex items-center gap-3 text-sm">
//                       <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
//                         {i + 1}
//                       </div>
//                       {step.text}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </CardContent>
//             <CardFooter className="flex gap-3 pt-2">
//               <Button variant="outline" onClick={resetWizard}>
//                 Add Another Domain
//               </Button>
//               <Button onClick={handleCompleteSetup} className="flex-1 h-11">
//                 Go to Settings
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </CardFooter>
//           </Card>
//         )}
//       </div>
//     </TooltipProvider>
//   )
// }

// // DNS Record Step Component
// interface DNSRecordStepProps {
//   title: string
//   description: string
//   icon: any
//   recordType: string
//   recordName: string
//   recordValue: string
//   isVerified: boolean
//   isSkipped: boolean
//   loading: boolean
//   onVerify: () => void
//   onSkip: () => void
//   onBack: () => void
//   onCopy: (text: string, label: string) => void
//   copied: string | null
//   helpText: string
//   stepNumber: number
//   totalSteps: number
//   extraInfo?: React.ReactNode
// }

// function DNSRecordStep({
//   title,
//   description,
//   icon: Icon,
//   recordType,
//   recordName,
//   recordValue,
//   isVerified,
//   isSkipped,
//   loading,
//   onVerify,
//   onSkip,
//   onBack,
//   onCopy,
//   copied,
//   helpText,
//   stepNumber,
//   totalSteps,
//   extraInfo,
// }: DNSRecordStepProps) {
//   return (
//     <Card
//       className={cn(
//         "border-0 shadow-lg animate-slide-up transition-all",
//         isVerified && "ring-2 ring-[var(--success)]/30",
//       )}
//     >
//       {isVerified && <div className="h-1.5 bg-[var(--success)]" />}
//       <CardHeader>
//         <div className="flex items-start justify-between">
//           <div className="flex items-center gap-3">
//             <div className={cn("p-2 rounded-lg", isVerified ? "bg-[var(--success-muted)]" : "bg-primary/10")}>
//               <Icon className={cn("h-5 w-5", isVerified ? "text-[var(--success)]" : "text-primary")} />
//             </div>
//             <div>
//               <CardTitle className="flex items-center gap-2">
//                 {title}
//                 {isVerified && (
//                   <Badge className="bg-[var(--success)] text-[var(--success-foreground)] hover:bg-[var(--success)]">
//                     <Check className="h-3 w-3 mr-1" />
//                     Verified
//                   </Badge>
//                 )}
//                 {isSkipped && !isVerified && (
//                   <Badge variant="outline" className="border-[var(--warning)] text-[var(--warning)]">
//                     Skipped
//                   </Badge>
//                 )}
//               </CardTitle>
//               <CardDescription className="mt-1">{description}</CardDescription>
//             </div>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {/* Instructions */}
//         <div className="rounded-xl bg-secondary/50 border border-border/50 p-5 space-y-5">
//           {/* Step 1 */}
//           <div className="flex gap-4">
//             <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
//               1
//             </div>
//             <div>
//               <p className="font-medium">Open your DNS provider</p>
//               <p className="text-sm text-muted-foreground mt-0.5">
//                 Go to GoDaddy, Cloudflare, Namecheap, or wherever you bought your domain and find DNS settings
//               </p>
//             </div>
//           </div>

//           {/* Step 2 */}
//           <div className="flex gap-4">
//             <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
//               2
//             </div>
//             <div>
//               <p className="font-medium">Add a new {recordType} record</p>
//               <p className="text-sm text-muted-foreground mt-0.5">{helpText}</p>
//             </div>
//           </div>

//           {/* Step 3 - Copy values */}
//           <div className="flex gap-4">
//             <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
//               3
//             </div>
//             <div className="flex-1 space-y-4">
//               <p className="font-medium">Copy these values:</p>

//               {/* Type */}
//               <div className="space-y-1.5">
//                 <Label className="text-xs text-muted-foreground uppercase tracking-wider">Type</Label>
//                 <div className="px-4 py-3 rounded-lg bg-background border font-mono text-sm">{recordType}</div>
//               </div>

//               {/* Name */}
//               <div className="space-y-1.5">
//                 <Label className="text-xs text-muted-foreground uppercase tracking-wider">Name / Host</Label>
//                 <div className="flex items-center gap-2">
//                   <code className="flex-1 px-4 py-3 rounded-lg bg-background border font-mono text-sm break-all">
//                     {recordName}
//                   </code>
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={() => onCopy(recordName, "Name")}
//                     className={cn(
//                       "shrink-0 transition-all",
//                       copied === "Name" &&
//                         "bg-[var(--success)] text-[var(--success-foreground)] border-[var(--success)]",
//                     )}
//                   >
//                     {copied === "Name" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//                   </Button>
//                 </div>
//               </div>

//               {/* Value */}
//               <div className="space-y-1.5">
//                 <Label className="text-xs text-muted-foreground uppercase tracking-wider">Value / Content</Label>
//                 <div className="flex items-start gap-2">
//                   <code className="flex-1 px-4 py-3 rounded-lg bg-background border font-mono text-sm break-all">
//                     {recordValue}
//                   </code>
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={() => onCopy(recordValue, "Value")}
//                     className={cn(
//                       "shrink-0 transition-all",
//                       copied === "Value" &&
//                         "bg-[var(--success)] text-[var(--success-foreground)] border-[var(--success)]",
//                     )}
//                   >
//                     {copied === "Value" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {extraInfo}

//         {/* DNS propagation notice */}
//         <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border/50">
//           <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
//           <div>
//             <p className="text-sm font-medium">DNS changes take time to propagate</p>
//             <p className="text-xs text-muted-foreground mt-0.5">
//               It can take a few minutes to 48 hours. If verification fails, wait and try again.
//             </p>
//           </div>
//         </div>
//       </CardContent>
//       <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
//         <Button variant="outline" onClick={onBack} className="sm:w-auto w-full bg-transparent">
//           <ChevronLeft className="mr-2 h-4 w-4" />
//           Back
//         </Button>
//         <Button
//           variant="ghost"
//           onClick={onSkip}
//           className="sm:ml-auto sm:w-auto w-full text-muted-foreground hover:text-foreground"
//         >
//           <Clock className="mr-2 h-4 w-4" />
//           Skip for Now
//         </Button>
//         <Button onClick={onVerify} disabled={loading} className="sm:w-auto w-full h-11">
//           {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
//           Verify {title}
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }

// "use client"

// import type React from "react"
// import { useState, useEffect, useCallback } from "react"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import {
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   Loader2,
//   Copy,
//   ChevronRight,
//   ChevronLeft,
//   Shield,
//   Mail,
//   Server,
//   CheckCheck,
//   RefreshCw,
//   ArrowRight,
//   Clock,
//   Info,
//   Sparkles,
//   HelpCircle,
//   Check,
// } from "lucide-react"
// import { addDomain, verifyDomain } from "@/lib/actions/domain-action"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"
// import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
// import { Progress } from "@/components/ui/progress"

// type SetupStep = "welcome" | "add-domain" | "spf" | "dkim" | "dmarc" | "verify" | "complete"

// interface StepStatus {
//   completed: boolean
//   verified: boolean
//   skipped: boolean
// }

// interface WizardState {
//   currentStep: SetupStep
//   domainId: string | null
//   domainName: string
//   dnsRecords: any[]
//   stepStatuses: Record<SetupStep, StepStatus>
//   dkimSelector: string
// }

// interface GuidedEmailWizardProps {
//   existingDomains?: Array<{
//     id: string
//     domain: string
//     isVerified: boolean
//     verificationAttempts: number
//     dnsRecords: any
//     deliverabilityHealth?: any
//   }>
//   existingAccounts?: any[]
// }

// const STORAGE_KEY = "mailfra_email_wizard_state"

// const defaultStepStatus: StepStatus = { completed: false, verified: false, skipped: false }

// const defaultState: WizardState = {
//   currentStep: "welcome",
//   domainId: null,
//   domainName: "",
//   dnsRecords: [],
//   stepStatuses: {
//     welcome: { ...defaultStepStatus },
//     "add-domain": { ...defaultStepStatus },
//     spf: { ...defaultStepStatus },
//     dkim: { ...defaultStepStatus },
//     dmarc: { ...defaultStepStatus },
//     verify: { ...defaultStepStatus },
//     complete: { ...defaultStepStatus },
//   },
//   dkimSelector: "default",
// }

// const steps: { id: SetupStep; title: string; shortTitle: string; description: string; icon: any }[] = [
//   { id: "welcome", title: "Welcome", shortTitle: "Start", description: "Get started", icon: Sparkles },
//   { id: "add-domain", title: "Add Domain", shortTitle: "Domain", description: "Enter your domain", icon: Server },
//   { id: "spf", title: "SPF Record", shortTitle: "SPF", description: "Authorize servers", icon: Shield },
//   { id: "dkim", title: "DKIM Key", shortTitle: "DKIM", description: "Sign emails", icon: Mail },
//   { id: "dmarc", title: "DMARC Policy", shortTitle: "DMARC", description: "Protect domain", icon: Shield },
//   { id: "verify", title: "Final Check", shortTitle: "Verify", description: "Verify all", icon: CheckCheck },
//   { id: "complete", title: "Complete", shortTitle: "Done", description: "All set!", icon: CheckCircle2 },
// ]

// export function GuidedEmailWizard({ existingDomains = [], existingAccounts = [] }: GuidedEmailWizardProps) {
//   const router = useRouter()
//   const [state, setState] = useState<WizardState>(defaultState)
//   const [loading, setLoading] = useState(false)
//   const [verificationResults, setVerificationResults] = useState<any>(null)
//   const [isInitialized, setIsInitialized] = useState(false)
//   const [copied, setCopied] = useState<string | null>(null)

//   const currentStepIndex = steps.findIndex((s) => s.id === state.currentStep)
//   const progress = Math.round((currentStepIndex / (steps.length - 1)) * 100)

//   useEffect(() => {
//     const handleSelectDomain = (event: CustomEvent<{ domainId: string; domainName: string }>) => {
//       const { domainId, domainName } = event.detail

//       // Find the domain in existing domains to get its data
//       const domain = existingDomains.find((d) => d.id === domainId)

//       if (domain) {
//         setState((prev) => ({
//           ...prev,
//           domainId: domain.id,
//           domainName: domain.domain,
//           dnsRecords: domain.dnsRecords?.records || [],
//           stepStatuses: {
//             ...prev.stepStatuses,
//             "add-domain": { completed: true, verified: true, skipped: false },
//           },
//           currentStep: "spf", // Start at SPF since domain is already added
//         }))

//         toast.info(`Configuring ${domain.domain}`, {
//           description: "Continue with DNS setup below",
//         })
//       }
//     }

//     window.addEventListener("select-domain", handleSelectDomain as EventListener)
//     return () => window.removeEventListener("select-domain", handleSelectDomain as EventListener)
//   }, [existingDomains])

//   // Load saved state from localStorage
//   useEffect(() => {
//     if (typeof window === "undefined") return

//     const savedState = localStorage.getItem(STORAGE_KEY)
//     if (savedState) {
//       try {
//         const parsed = JSON.parse(savedState)
//         setState(parsed)
//       } catch (e) {
//         console.error("Failed to parse saved wizard state")
//       }
//     }

//     // Check for existing unconfigured domains
//     if (existingDomains.length > 0) {
//       const unconfigured = existingDomains.find((d) => !d.isVerified)
//       if (unconfigured) {
//         const health = unconfigured.deliverabilityHealth

//         setState((prev) => {
//           const newState = { ...prev }
//           newState.domainId = unconfigured.id
//           newState.domainName = unconfigured.domain

//           if (unconfigured.dnsRecords?.records) {
//             newState.dnsRecords = unconfigured.dnsRecords.records
//           }

//           if (health) {
//             newState.stepStatuses = {
//               ...prev.stepStatuses,
//               "add-domain": { completed: true, verified: true, skipped: false },
//               spf: { completed: true, verified: health.spfValid || false, skipped: !health.spfValid },
//               dkim: {
//                 completed: health.spfValid || false,
//                 verified: health.dkimValid || false,
//                 skipped: !health.dkimValid && health.spfValid,
//               },
//               dmarc: {
//                 completed: health.dkimValid || health.spfValid || false,
//                 verified: health.dmarcValid || false,
//                 skipped: !health.dmarcValid && (health.dkimValid || health.spfValid),
//               },
//             }

//             if (!health.spfValid && !prev.stepStatuses.spf.skipped) {
//               newState.currentStep = "spf"
//             } else if (!health.dkimValid && !prev.stepStatuses.dkim.skipped) {
//               newState.currentStep = "dkim"
//             } else if (!health.dmarcValid && !prev.stepStatuses.dmarc.skipped) {
//               newState.currentStep = "dmarc"
//             } else {
//               newState.currentStep = "verify"
//             }
//           } else if (unconfigured.verificationAttempts > 0) {
//             newState.stepStatuses["add-domain"] = { completed: true, verified: true, skipped: false }
//             newState.currentStep = "spf"
//           }

//           return newState
//         })
//       }
//     }

//     setIsInitialized(true)
//   }, [existingDomains])

//   // Save state to localStorage whenever it changes
//   useEffect(() => {
//     if (!isInitialized || typeof window === "undefined") return
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
//   }, [state, isInitialized])

//   const updateStepStatus = useCallback((step: SetupStep, updates: Partial<StepStatus>) => {
//     setState((prev) => ({
//       ...prev,
//       stepStatuses: {
//         ...prev.stepStatuses,
//         [step]: { ...prev.stepStatuses[step], ...updates },
//       },
//     }))
//   }, [])

//   const goToStep = useCallback((step: SetupStep) => {
//     setState((prev) => ({ ...prev, currentStep: step }))
//   }, [])

//   const nextStep = useCallback(() => {
//     const nextIndex = currentStepIndex + 1
//     if (nextIndex < steps.length) {
//       goToStep(steps[nextIndex].id)
//     }
//   }, [currentStepIndex, goToStep])

//   const prevStep = useCallback(() => {
//     const prevIndex = currentStepIndex - 1
//     if (prevIndex >= 0) {
//       goToStep(steps[prevIndex].id)
//     }
//   }, [currentStepIndex, goToStep])

//   const handleAddDomain = async () => {
//     if (!state.domainName) {
//       toast.error("Please enter a domain name")
//       return
//     }

//     const cleanDomain = state.domainName
//       .trim()
//       .toLowerCase()
//       .replace(/^https?:\/\//, "")
//       .replace(/^www\./, "")
//       .replace(/\/.*$/, "")

//     setState((prev) => ({ ...prev, domainName: cleanDomain }))

//     const existingDomain = existingDomains?.find((d) => d.domain.toLowerCase() === cleanDomain)

//     if (existingDomain) {
//       if (existingDomain.isVerified) {
//         toast.error("Domain already configured", {
//           description: "This domain is already verified. You can manage it in Settings.",
//         })
//         return
//       } else {
//         setState((prev) => ({
//           ...prev,
//           domainId: existingDomain.id,
//           dnsRecords: existingDomain.dnsRecords?.records || [],
//         }))
//         updateStepStatus("add-domain", { completed: true, verified: true })
//         toast.info("Resuming configuration", {
//           description: "This domain was added before. Continue with DNS setup.",
//         })
//         goToStep("spf")
//         return
//       }
//     }

//     setLoading(true)
//     try {
//       const result = await addDomain(cleanDomain)

//       if (result.success === false) {
//         toast.error(result.error || "Failed to add domain")
//         return
//       }

//       if (result.success && result.domainId && result.dnsRecords) {
//         setState((prev) => ({
//           ...prev,
//           domainId: result.domainId,
//           dnsRecords: result.dnsRecords.records,
//           dkimSelector: result.dnsRecords.selector || "default",
//         }))
//         updateStepStatus("add-domain", { completed: true, verified: true })
//         toast.success("Domain added successfully!")
//         goToStep("spf")
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Failed to add domain")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleVerifyStep = async (step: "spf" | "dkim" | "dmarc") => {
//     if (!state.domainId) {
//       toast.error("No domain configured")
//       return
//     }

//     setLoading(true)
//     try {
//       const result = await verifyDomain(state.domainId)
//       setVerificationResults(result)

//       const stepResult = result.results.find((r: any) => r.type === step.toUpperCase())
//       const isValid = stepResult?.valid || false

//       if (isValid) {
//         updateStepStatus(step, { completed: true, verified: true, skipped: false })
//         toast.success(`${step.toUpperCase()} verified successfully!`)

//         // Auto advance to next step
//         const stepOrder: SetupStep[] = ["spf", "dkim", "dmarc", "verify"]
//         const currentIdx = stepOrder.indexOf(step)
//         if (currentIdx < stepOrder.length - 1) {
//           setTimeout(() => goToStep(stepOrder[currentIdx + 1]), 500)
//         }
//       } else {
//         toast.error(`${step.toUpperCase()} not verified yet`, {
//           description: "DNS changes can take up to 48 hours. You can skip and verify later.",
//         })
//       }
//     } catch (error) {
//       toast.error("Verification failed. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSkipStep = (step: "spf" | "dkim" | "dmarc") => {
//     updateStepStatus(step, { completed: true, skipped: true })
//     const stepOrder: SetupStep[] = ["spf", "dkim", "dmarc", "verify"]
//     const currentIdx = stepOrder.indexOf(step)
//     if (currentIdx < stepOrder.length - 1) {
//       goToStep(stepOrder[currentIdx + 1])
//     }
//     toast.info("Step skipped", { description: "You can verify this later." })
//   }

//   const handleFinalVerification = async () => {
//     if (!state.domainId) return

//     setLoading(true)
//     try {
//       const result = await verifyDomain(state.domainId)
//       setVerificationResults(result)

//       // Update step statuses based on verification results
//       for (const r of result.results) {
//         const stepId = r.type.toLowerCase() as "spf" | "dkim" | "dmarc"
//         if (steps.find((s) => s.id === stepId)) {
//           updateStepStatus(stepId, { verified: r.valid })
//         }
//       }

//       const allVerified = result.results.every((r: any) => r.valid)

//       if (allVerified) {
//         updateStepStatus("verify", { completed: true, verified: true })
//         toast.success("All DNS records verified!")
//         goToStep("complete")
//       } else {
//         const failed = result.results.filter((r: any) => !r.valid).map((r: any) => r.type)
//         toast.warning(`Pending: ${failed.join(", ")}`, {
//           description: "You can complete setup and verify these later.",
//         })
//       }
//     } catch (error) {
//       toast.error("Verification failed. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCompleteSetup = () => {
//     localStorage.removeItem(STORAGE_KEY)
//     toast.success("Setup complete!")
//     router.push("/dashboard/settings")
//   }

//   const resetWizard = () => {
//     localStorage.removeItem(STORAGE_KEY)
//     setState(defaultState)
//     toast.info("Starting fresh setup")
//   }

//   const copyToClipboard = async (text: string, label: string) => {
//     await navigator.clipboard.writeText(text)
//     setCopied(label)
//     toast.success(`${label} copied!`, { duration: 1500 })
//     setTimeout(() => setCopied(null), 2000)
//   }

//   // Get DNS records with fallbacks
//   const spfRecord = state.dnsRecords.find((r) => r.type === "TXT" && (r.name === "@" || r.name === "")) || {
//     type: "TXT",
//     name: "@",
//     value: `v=spf1 include:sendgrid.net ~all`,
//   }

//   const dkimRecord = state.dnsRecords.find((r) => r.type === "CNAME" && r.name?.includes("_domainkey")) || {
//     type: "CNAME",
//     name: `${state.dkimSelector}._domainkey`,
//     value: `${state.dkimSelector}.sendgrid.net`,
//   }

//   const dmarcRecord = state.dnsRecords.find((r) => r.type === "TXT" && r.name === "_dmarc") || {
//     type: "TXT",
//     name: "_dmarc",
//     value: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${state.domainName || "yourdomain.com"}`,
//   }

//   return (
//     <TooltipProvider>
//       <div className="mx-auto max-w-4xl space-y-8">
//         {/* Progress Header */}
//         <div className="space-y-4">
//           {/* Step indicators */}
//           <div className="relative flex items-center justify-between">
//             {/* Connection line */}
//             <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
//             <div
//               className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
//               style={{ width: `${progress}%` }}
//             />

//             {steps.map((step, index) => {
//               const status = state.stepStatuses[step.id]
//               const isCurrent = state.currentStep === step.id
//               const isPast = index < currentStepIndex
//               const isClickable = index <= currentStepIndex || status.completed || status.skipped

//               return (
//                 <Tooltip key={step.id}>
//                   <TooltipTrigger asChild>
//                     <button
//                       onClick={() => isClickable && goToStep(step.id)}
//                       disabled={!isClickable}
//                       className={cn(
//                         "relative z-10 flex flex-col items-center gap-2 transition-all duration-200",
//                         isClickable ? "cursor-pointer" : "cursor-not-allowed",
//                       )}
//                     >
//                       {/* Step circle */}
//                       <div
//                         className={cn(
//                           "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
//                           status.verified &&
//                             "border-[var(--success)] bg-[var(--success)] text-[var(--success-foreground)] animate-pulse-success",
//                           status.skipped &&
//                             "border-[var(--warning)] bg-[var(--warning)] text-[var(--warning-foreground)]",
//                           isCurrent &&
//                             !status.verified &&
//                             !status.skipped &&
//                             "border-primary bg-primary text-primary-foreground scale-110 shadow-lg",
//                           isPast &&
//                             !status.verified &&
//                             !status.skipped &&
//                             "border-primary/50 bg-primary/10 text-primary",
//                           !isPast &&
//                             !isCurrent &&
//                             !status.verified &&
//                             !status.skipped &&
//                             "border-muted-foreground/30 bg-background text-muted-foreground/50",
//                         )}
//                       >
//                         {status.verified ? (
//                           <Check className="h-5 w-5" strokeWidth={3} />
//                         ) : status.skipped ? (
//                           <Clock className="h-4 w-4" />
//                         ) : (
//                           <step.icon className="h-4 w-4" />
//                         )}
//                       </div>

//                       {/* Step label */}
//                       <span
//                         className={cn(
//                           "text-xs font-medium transition-colors hidden sm:block",
//                           isCurrent ? "text-primary" : "text-muted-foreground",
//                         )}
//                       >
//                         {step.shortTitle}
//                       </span>
//                     </button>
//                   </TooltipTrigger>
//                   <TooltipContent side="bottom" className="text-center">
//                     <p className="font-semibold">{step.title}</p>
//                     <p className="text-xs text-muted-foreground">{step.description}</p>
//                     {status.verified && <p className="text-xs text-[var(--success)] font-medium mt-1">Verified</p>}
//                     {status.skipped && (
//                       <p className="text-xs text-[var(--warning)] font-medium mt-1">Skipped - verify later</p>
//                     )}
//                   </TooltipContent>
//                 </Tooltip>
//               )
//             })}
//           </div>

//           {/* Progress bar */}
//           <div className="space-y-1">
//             <div className="flex justify-between text-xs text-muted-foreground">
//               <span>
//                 Step {currentStepIndex + 1} of {steps.length}
//               </span>
//               <span>{progress}% complete</span>
//             </div>
//             <Progress value={progress} className="h-1.5" />
//           </div>
//         </div>

//         {/* Welcome Step */}
//         {state.currentStep === "welcome" && (
//           <Card className="border-0 shadow-lg animate-slide-up">
//             <CardHeader className="text-center pb-4">
//               <div className="mx-auto mb-6 relative">
//                 <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
//                 <div className="relative p-5 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
//                   <Mail className="h-10 w-10 text-primary-foreground" />
//                 </div>
//               </div>
//               <CardTitle className="text-3xl font-bold tracking-tight">Email Deliverability Setup</CardTitle>
//               <CardDescription className="text-base max-w-md mx-auto">
//                 Configure your domain in 5 minutes to ensure your emails land in the inbox, not spam
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Benefits grid */}
//               <div className="grid gap-4 sm:grid-cols-3">
//                 {[
//                   { icon: Shield, title: "SPF", desc: "Authorize your email servers" },
//                   { icon: Mail, title: "DKIM", desc: "Digitally sign your emails" },
//                   { icon: Shield, title: "DMARC", desc: "Protect from spoofing" },
//                 ].map((item) => (
//                   <div
//                     key={item.title}
//                     className="flex flex-col items-center text-center p-5 rounded-xl bg-secondary/50 border border-border/50"
//                   >
//                     <div className="p-3 bg-primary/10 rounded-lg mb-3">
//                       <item.icon className="h-6 w-6 text-primary" />
//                     </div>
//                     <h4 className="font-semibold text-sm">{item.title}</h4>
//                     <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
//                   </div>
//                 ))}
//               </div>

//               {/* What you need */}
//               <div className="rounded-xl bg-secondary/30 border border-border/50 p-5">
//                 <div className="flex items-center gap-2 mb-3">
//                   <Info className="h-4 w-4 text-primary" />
//                   <h4 className="font-semibold text-sm">What you'll need</h4>
//                 </div>
//                 <ul className="space-y-2 text-sm text-muted-foreground">
//                   <li className="flex items-center gap-2">
//                     <div className="h-1.5 w-1.5 rounded-full bg-primary" />
//                     Access to your DNS settings (GoDaddy, Cloudflare, Namecheap, etc.)
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <div className="h-1.5 w-1.5 rounded-full bg-primary" />
//                     About 5-10 minutes of your time
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <div className="h-1.5 w-1.5 rounded-full bg-primary" />
//                     Your business domain (e.g., yourcompany.com)
//                   </li>
//                 </ul>
//               </div>

//               {/* Reassurance */}
//               <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--success-muted)] border border-[var(--success)]/20">
//                 <CheckCircle2 className="h-5 w-5 text-[var(--success)] shrink-0 mt-0.5" />
//                 <div>
//                   <p className="text-sm font-medium text-[var(--success)]">Don't worry, we'll guide you!</p>
//                   <p className="text-xs text-muted-foreground mt-0.5">
//                     No technical knowledge required. Just copy and paste the values we provide.
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className="pt-2">
//               <Button onClick={() => goToStep("add-domain")} className="w-full h-12 text-base font-semibold" size="lg">
//                 Start Setup
//                 <ArrowRight className="ml-2 h-5 w-5" />
//               </Button>
//             </CardFooter>
//           </Card>
//         )}

//         {/* Add Domain Step */}
//         {state.currentStep === "add-domain" && (
//           <Card className="border-0 shadow-lg animate-slide-up">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-3">
//                 <div className="p-2 bg-primary/10 rounded-lg">
//                   <Server className="h-5 w-5 text-primary" />
//                 </div>
//                 Add Your Domain
//               </CardTitle>
//               <CardDescription>Enter the domain you'll be sending emails from</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-3">
//                 <Label htmlFor="domain" className="text-base font-medium">
//                   Domain Name
//                 </Label>
//                 <Input
//                   id="domain"
//                   placeholder="yourcompany.com"
//                   value={state.domainName}
//                   onChange={(e) =>
//                     setState((prev) => ({
//                       ...prev,
//                       domainName: e.target.value.trim().toLowerCase(),
//                     }))
//                   }
//                   disabled={loading}
//                   className="h-12 text-lg"
//                 />
//                 <p className="text-sm text-muted-foreground">Just the domain name - no http://, www, or paths</p>
//               </div>

//               {/* Examples */}
//               <div className="flex flex-wrap gap-3 text-sm">
//                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--success-muted)] text-[var(--success)]">
//                   <Check className="h-3.5 w-3.5" />
//                   <code className="text-xs">company.com</code>
//                 </div>
//                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive">
//                   <XCircle className="h-3.5 w-3.5" />
//                   <code className="text-xs">https://www.company.com</code>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className="flex gap-3 pt-2">
//               <Button variant="outline" onClick={prevStep} className="px-6 bg-transparent">
//                 <ChevronLeft className="mr-2 h-4 w-4" />
//                 Back
//               </Button>
//               <Button onClick={handleAddDomain} disabled={!state.domainName || loading} className="flex-1 h-11">
//                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 Continue
//                 <ChevronRight className="ml-2 h-4 w-4" />
//               </Button>
//             </CardFooter>
//           </Card>
//         )}

//         {/* SPF Step */}
//         {state.currentStep === "spf" && (
//           <DNSRecordStep
//             title="SPF Record"
//             description="Sender Policy Framework - tells email providers which servers are allowed to send emails from your domain"
//             icon={Shield}
//             recordType="TXT"
//             recordName={spfRecord.name}
//             recordValue={spfRecord.value}
//             isVerified={state.stepStatuses.spf.verified}
//             isSkipped={state.stepStatuses.spf.skipped}
//             loading={loading}
//             onVerify={() => handleVerifyStep("spf")}
//             onSkip={() => handleSkipStep("spf")}
//             onBack={prevStep}
//             onCopy={copyToClipboard}
//             copied={copied}
//             helpText="The '@' symbol means the root domain (yourcompany.com)"
//             stepNumber={3}
//             totalSteps={7}
//           />
//         )}

//         {/* DKIM Step */}
//         {state.currentStep === "dkim" && (
//           <DNSRecordStep
//             title="DKIM Key"
//             description="DomainKeys Identified Mail - digitally signs your emails to prove they're really from you"
//             icon={Mail}
//             recordType="CNAME"
//             recordName={dkimRecord.name}
//             recordValue={dkimRecord.value}
//             isVerified={state.stepStatuses.dkim.verified}
//             isSkipped={state.stepStatuses.dkim.skipped}
//             loading={loading}
//             onVerify={() => handleVerifyStep("dkim")}
//             onSkip={() => handleSkipStep("dkim")}
//             onBack={prevStep}
//             onCopy={copyToClipboard}
//             copied={copied}
//             helpText="Some DNS providers call the Name field 'Host' or 'Alias'"
//             stepNumber={4}
//             totalSteps={7}
//             extraInfo={
//               <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--warning-muted)] border border-[var(--warning)]/20">
//                 <HelpCircle className="h-5 w-5 text-[var(--warning)] shrink-0 mt-0.5" />
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">DKIM verification can take longer</p>
//                   <ul className="text-xs text-muted-foreground space-y-1">
//                     <li>Your email provider (Gmail, SendGrid, etc.) may use a different selector</li>
//                     <li>Some DNS providers require you to remove the domain suffix from the name</li>
//                     <li>DNS changes can take up to 48 hours to propagate</li>
//                   </ul>
//                 </div>
//               </div>
//             }
//           />
//         )}

//         {/* DMARC Step */}
//         {state.currentStep === "dmarc" && (
//           <DNSRecordStep
//             title="DMARC Policy"
//             description="Domain-based Message Authentication - protects your domain from being used in phishing attacks"
//             icon={Shield}
//             recordType="TXT"
//             recordName={dmarcRecord.name}
//             recordValue={dmarcRecord.value}
//             isVerified={state.stepStatuses.dmarc.verified}
//             isSkipped={state.stepStatuses.dmarc.skipped}
//             loading={loading}
//             onVerify={() => handleVerifyStep("dmarc")}
//             onSkip={() => handleSkipStep("dmarc")}
//             onBack={prevStep}
//             onCopy={copyToClipboard}
//             copied={copied}
//             helpText="The name should be exactly '_dmarc' (with underscore)"
//             stepNumber={5}
//             totalSteps={7}
//           />
//         )}

//         {/* Verify Step */}
//         {state.currentStep === "verify" && (
//           <Card className="border-0 shadow-lg animate-slide-up">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-3">
//                 <div className="p-2 bg-primary/10 rounded-lg">
//                   <CheckCheck className="h-5 w-5 text-primary" />
//                 </div>
//                 Final Verification
//               </CardTitle>
//               <CardDescription>Let's verify all your DNS records are configured correctly</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Status cards */}
//               <div className="space-y-3">
//                 {[
//                   { id: "spf", name: "SPF Record", desc: "Server authorization", status: state.stepStatuses.spf },
//                   { id: "dkim", name: "DKIM Key", desc: "Email signing", status: state.stepStatuses.dkim },
//                   { id: "dmarc", name: "DMARC Policy", desc: "Spoofing protection", status: state.stepStatuses.dmarc },
//                 ].map((item) => (
//                   <div
//                     key={item.id}
//                     className={cn(
//                       "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
//                       item.status.verified && "border-[var(--success)]/30 bg-[var(--success-muted)]",
//                       item.status.skipped &&
//                         !item.status.verified &&
//                         "border-[var(--warning)]/30 bg-[var(--warning-muted)]",
//                       !item.status.verified && !item.status.skipped && "border-border bg-secondary/30",
//                     )}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div
//                         className={cn(
//                           "flex h-10 w-10 items-center justify-center rounded-full",
//                           item.status.verified && "bg-[var(--success)] text-[var(--success-foreground)]",
//                           item.status.skipped &&
//                             !item.status.verified &&
//                             "bg-[var(--warning)] text-[var(--warning-foreground)]",
//                           !item.status.verified && !item.status.skipped && "bg-muted text-muted-foreground",
//                         )}
//                       >
//                         {item.status.verified ? (
//                           <Check className="h-5 w-5" strokeWidth={3} />
//                         ) : item.status.skipped ? (
//                           <Clock className="h-5 w-5" />
//                         ) : (
//                           <AlertCircle className="h-5 w-5" />
//                         )}
//                       </div>
//                       <div>
//                         <p className="font-semibold">{item.name}</p>
//                         <p className="text-sm text-muted-foreground">{item.desc}</p>
//                       </div>
//                     </div>
//                     {item.status.verified ? (
//                       <Badge className="bg-[var(--success)] text-[var(--success-foreground)] hover:bg-[var(--success)]">
//                         Verified
//                       </Badge>
//                     ) : item.status.skipped ? (
//                       <Button variant="outline" size="sm" onClick={() => goToStep(item.id as SetupStep)}>
//                         Verify Now
//                       </Button>
//                     ) : (
//                       <Badge variant="outline">Pending</Badge>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {/* Status message */}
//               {verificationResults && (
//                 <div
//                   className={cn(
//                     "flex items-start gap-3 p-4 rounded-xl border",
//                     verificationResults.allValid
//                       ? "bg-[var(--success-muted)] border-[var(--success)]/20"
//                       : "bg-[var(--warning-muted)] border-[var(--warning)]/20",
//                   )}
//                 >
//                   {verificationResults.allValid ? (
//                     <CheckCircle2 className="h-5 w-5 text-[var(--success)] shrink-0" />
//                   ) : (
//                     <AlertCircle className="h-5 w-5 text-[var(--warning)] shrink-0" />
//                   )}
//                   <div>
//                     <p
//                       className={cn(
//                         "text-sm font-medium",
//                         verificationResults.allValid ? "text-[var(--success)]" : "text-[var(--warning)]",
//                       )}
//                     >
//                       {verificationResults.allValid ? "All records verified!" : "Some records still pending"}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-0.5">
//                       {verificationResults.allValid
//                         ? "Your domain is properly configured for email sending."
//                         : "You can complete setup now and verify pending records later."}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//             <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
//               <Button variant="outline" onClick={prevStep} className="sm:w-auto w-full bg-transparent">
//                 <ChevronLeft className="mr-2 h-4 w-4" />
//                 Back
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={handleFinalVerification}
//                 disabled={loading}
//                 className="sm:flex-1 w-full bg-transparent"
//               >
//                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 <RefreshCw className="mr-2 h-4 w-4" />
//                 Re-verify All
//               </Button>
//               <Button onClick={() => goToStep("complete")} className="sm:flex-1 w-full h-11">
//                 Complete Setup
//                 <ChevronRight className="ml-2 h-4 w-4" />
//               </Button>
//             </CardFooter>
//           </Card>
//         )}

//         {/* Complete Step */}
//         {state.currentStep === "complete" && (
//           <Card className="border-0 shadow-lg animate-slide-up overflow-hidden">
//             <div className="h-2 bg-gradient-to-r from-[var(--success)] via-primary to-[var(--success)]" />
//             <CardHeader className="text-center pb-4 pt-8">
//               <div className="mx-auto mb-6 relative">
//                 <div className="absolute inset-0 bg-[var(--success)]/30 blur-3xl rounded-full" />
//                 <div className="relative p-6 bg-[var(--success)] rounded-full shadow-lg animate-pulse-success">
//                   <CheckCircle2 className="h-12 w-12 text-[var(--success-foreground)]" />
//                 </div>
//               </div>
//               <CardTitle className="text-3xl font-bold tracking-tight text-[var(--success)]">Setup Complete!</CardTitle>
//               <CardDescription className="text-base">
//                 <strong className="text-foreground">{state.domainName}</strong> is now configured for email sending
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Final status */}
//               <div className="grid gap-3 sm:grid-cols-3">
//                 {[
//                   { name: "SPF", status: state.stepStatuses.spf },
//                   { name: "DKIM", status: state.stepStatuses.dkim },
//                   { name: "DMARC", status: state.stepStatuses.dmarc },
//                 ].map((item) => (
//                   <div
//                     key={item.name}
//                     className={cn(
//                       "flex flex-col items-center p-5 rounded-xl text-center",
//                       item.status.verified ? "bg-[var(--success-muted)]" : "bg-[var(--warning-muted)]",
//                     )}
//                   >
//                     {item.status.verified ? (
//                       <CheckCircle2 className="h-8 w-8 text-[var(--success)] mb-2" />
//                     ) : (
//                       <Clock className="h-8 w-8 text-[var(--warning)] mb-2" />
//                     )}
//                     <span className="font-semibold">{item.name}</span>
//                     <span
//                       className={cn(
//                         "text-sm",
//                         item.status.verified ? "text-[var(--success)]" : "text-[var(--warning)]",
//                       )}
//                     >
//                       {item.status.verified ? "Verified" : "Pending"}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* Pending warning */}
//               {(state.stepStatuses.spf.skipped ||
//                 state.stepStatuses.dkim.skipped ||
//                 state.stepStatuses.dmarc.skipped) && (
//                 <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--warning-muted)] border border-[var(--warning)]/20">
//                   <Clock className="h-5 w-5 text-[var(--warning)] shrink-0" />
//                   <div>
//                     <p className="text-sm font-medium">Some records are still pending</p>
//                     <p className="text-xs text-muted-foreground mt-0.5">
//                       You can start sending emails, but come back to verify skipped records once your DNS changes
//                       propagate (up to 48 hours).
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Next steps */}
//               <div className="rounded-xl border bg-secondary/30 p-5 space-y-4">
//                 <h4 className="font-semibold flex items-center gap-2">
//                   <Sparkles className="h-4 w-4 text-primary" />
//                   Next Steps
//                 </h4>
//                 <ul className="space-y-3">
//                   <li>
//                     <Link
//                       href="/dashboard/settings?tab=sending"
//                       className="flex items-center gap-3 text-sm p-3 rounded-lg hover:bg-accent transition-colors"
//                     >
//                       <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
//                         1
//                       </div>
//                       <span className="flex-1">Connect your email accounts in Settings</span>
//                       <ChevronRight className="h-4 w-4 text-muted-foreground" />
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/dashboard/warmup"
//                       className="flex items-center gap-3 text-sm p-3 rounded-lg hover:bg-accent transition-colors"
//                     >
//                       <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
//                         2
//                       </div>
//                       <span className="flex-1">Start email warmup to build reputation</span>
//                       <ChevronRight className="h-4 w-4 text-muted-foreground" />
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/dashboard/campaigns/new"
//                       className="flex items-center gap-3 text-sm p-3 rounded-lg hover:bg-accent transition-colors"
//                     >
//                       <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
//                         3
//                       </div>
//                       <span className="flex-1">Create your first campaign</span>
//                       <ChevronRight className="h-4 w-4 text-muted-foreground" />
//                     </Link>
//                   </li>
//                 </ul>
//               </div>
//             </CardContent>
//             <CardFooter className="flex gap-3 pt-2">
//               <Button variant="outline" onClick={resetWizard}>
//                 Add Another Domain
//               </Button>
//               <Button onClick={handleCompleteSetup} className="flex-1 h-11">
//                 Go to Settings
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </CardFooter>
//           </Card>
//         )}
//       </div>
//     </TooltipProvider>
//   )
// }

// // DNS Record Step Component
// interface DNSRecordStepProps {
//   title: string
//   description: string
//   icon: any
//   recordType: string
//   recordName: string
//   recordValue: string
//   isVerified: boolean
//   isSkipped: boolean
//   loading: boolean
//   onVerify: () => void
//   onSkip: () => void
//   onBack: () => void
//   onCopy: (text: string, label: string) => void
//   copied: string | null
//   helpText: string
//   stepNumber: number
//   totalSteps: number
//   extraInfo?: React.ReactNode
// }

// function DNSRecordStep({
//   title,
//   description,
//   icon: Icon,
//   recordType,
//   recordName,
//   recordValue,
//   isVerified,
//   isSkipped,
//   loading,
//   onVerify,
//   onSkip,
//   onBack,
//   onCopy,
//   copied,
//   helpText,
//   stepNumber,
//   totalSteps,
//   extraInfo,
// }: DNSRecordStepProps) {
//   return (
//     <Card
//       className={cn(
//         "border-0 shadow-lg animate-slide-up transition-all",
//         isVerified && "ring-2 ring-[var(--success)]/30",
//       )}
//     >
//       {isVerified && <div className="h-1.5 bg-[var(--success)]" />}
//       <CardHeader>
//         <div className="flex items-start justify-between">
//           <div className="flex items-center gap-3">
//             <div className={cn("p-2 rounded-lg", isVerified ? "bg-[var(--success-muted)]" : "bg-primary/10")}>
//               <Icon className={cn("h-5 w-5", isVerified ? "text-[var(--success)]" : "text-primary")} />
//             </div>
//             <div>
//               <CardTitle className="flex items-center gap-2">
//                 {title}
//                 {isVerified && (
//                   <Badge className="bg-[var(--success)] text-[var(--success-foreground)] hover:bg-[var(--success)]">
//                     <Check className="h-3 w-3 mr-1" />
//                     Verified
//                   </Badge>
//                 )}
//                 {isSkipped && !isVerified && (
//                   <Badge variant="outline" className="border-[var(--warning)] text-[var(--warning)]">
//                     Skipped
//                   </Badge>
//                 )}
//               </CardTitle>
//               <CardDescription className="mt-1">{description}</CardDescription>
//             </div>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {/* Instructions */}
//         <div className="rounded-xl bg-secondary/50 border border-border/50 p-5 space-y-5">
//           {/* Step 1 */}
//           <div className="flex gap-4">
//             <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
//               1
//             </div>
//             <div>
//               <p className="font-medium">Open your DNS provider</p>
//               <p className="text-sm text-muted-foreground mt-0.5">
//                 Go to GoDaddy, Cloudflare, Namecheap, or wherever you bought your domain and find DNS settings
//               </p>
//             </div>
//           </div>

//           {/* Step 2 */}
//           <div className="flex gap-4">
//             <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
//               2
//             </div>
//             <div>
//               <p className="font-medium">Add a new {recordType} record</p>
//               <p className="text-sm text-muted-foreground mt-0.5">{helpText}</p>
//             </div>
//           </div>

//           {/* Step 3 - Copy values */}
//           <div className="flex gap-4">
//             <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
//               3
//             </div>
//             <div className="flex-1 space-y-4">
//               <p className="font-medium">Copy these values:</p>

//               {/* Type */}
//               <div className="space-y-1.5">
//                 <Label className="text-xs text-muted-foreground uppercase tracking-wider">Type</Label>
//                 <div className="px-4 py-3 rounded-lg bg-background border font-mono text-sm">{recordType}</div>
//               </div>

//               {/* Name */}
//               <div className="space-y-1.5">
//                 <Label className="text-xs text-muted-foreground uppercase tracking-wider">Name / Host</Label>
//                 <div className="flex items-center gap-2">
//                   <code className="flex-1 px-4 py-3 rounded-lg bg-background border font-mono text-sm break-all">
//                     {recordName}
//                   </code>
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={() => onCopy(recordName, "Name")}
//                     className={cn(
//                       "shrink-0 transition-all",
//                       copied === "Name" &&
//                         "bg-[var(--success)] text-[var(--success-foreground)] border-[var(--success)]",
//                     )}
//                   >
//                     {copied === "Name" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//                   </Button>
//                 </div>
//               </div>

//               {/* Value */}
//               <div className="space-y-1.5">
//                 <Label className="text-xs text-muted-foreground uppercase tracking-wider">Value / Content</Label>
//                 <div className="flex items-start gap-2">
//                   <code className="flex-1 px-4 py-3 rounded-lg bg-background border font-mono text-sm break-all">
//                     {recordValue}
//                   </code>
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={() => onCopy(recordValue, "Value")}
//                     className={cn(
//                       "shrink-0 transition-all",
//                       copied === "Value" &&
//                         "bg-[var(--success)] text-[var(--success-foreground)] border-[var(--success)]",
//                     )}
//                   >
//                     {copied === "Value" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {extraInfo}

//         {/* DNS propagation notice */}
//         <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border/50">
//           <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
//           <div>
//             <p className="text-sm font-medium">DNS changes take time to propagate</p>
//             <p className="text-xs text-muted-foreground mt-0.5">
//               It can take a few minutes to 48 hours. If verification fails, wait and try again.
//             </p>
//           </div>
//         </div>
//       </CardContent>
//       <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
//         <Button variant="outline" onClick={onBack} className="sm:w-auto w-full bg-transparent">
//           <ChevronLeft className="mr-2 h-4 w-4" />
//           Back
//         </Button>
//         <Button
//           variant="ghost"
//           onClick={onSkip}
//           className="sm:ml-auto sm:w-auto w-full text-muted-foreground hover:text-foreground"
//         >
//           <Clock className="mr-2 h-4 w-4" />
//           Skip for Now
//         </Button>
//         <Button onClick={onVerify} disabled={loading} className="sm:w-auto w-full h-11">
//           {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
//           Verify {title}
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }


"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Copy,
  ChevronRight,
  ChevronLeft,
  Shield,
  Mail,
  Server,
  CheckCheck,
  RefreshCw,
  ArrowRight,
  Clock,
  Info,
  Sparkles,
  HelpCircle,
  Check,
} from "lucide-react"
import { addDomain, verifyDomain } from "@/lib/actions/domain-action"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

type SetupStep = "welcome" | "add-domain" | "spf" | "dkim" | "dmarc" | "verify" | "complete"

interface StepStatus {
  completed: boolean
  verified: boolean
  skipped: boolean
}

interface WizardState {
  currentStep: SetupStep
  domainId: string | null
  domainName: string
  dnsRecords: any[]
  stepStatuses: Record<SetupStep, StepStatus>
  dkimSelector: string
}

interface GuidedEmailWizardProps {
  existingDomains?: Array<{
    id: string
    domain: string
    isVerified: boolean
    verificationAttempts: number
    dnsRecords: any
    deliverabilityHealth?: any
  }>
  existingAccounts?: any[]
}

const STORAGE_KEY = "mailfra_email_wizard_state"

const defaultStepStatus: StepStatus = { completed: false, verified: false, skipped: false }

const defaultState: WizardState = {
  currentStep: "welcome",
  domainId: null,
  domainName: "",
  dnsRecords: [],
  stepStatuses: {
    welcome: { ...defaultStepStatus },
    "add-domain": { ...defaultStepStatus },
    spf: { ...defaultStepStatus },
    dkim: { ...defaultStepStatus },
    dmarc: { ...defaultStepStatus },
    verify: { ...defaultStepStatus },
    complete: { ...defaultStepStatus },
  },
  dkimSelector: "default",
}

const steps: { id: SetupStep; title: string; shortTitle: string; description: string; icon: any }[] = [
  { id: "welcome", title: "Welcome", shortTitle: "Start", description: "Get started", icon: Sparkles },
  { id: "add-domain", title: "Add Domain", shortTitle: "Domain", description: "Enter your domain", icon: Server },
  { id: "spf", title: "SPF Record", shortTitle: "SPF", description: "Authorize servers", icon: Shield },
  { id: "dkim", title: "DKIM Key", shortTitle: "DKIM", description: "Sign emails", icon: Mail },
  { id: "dmarc", title: "DMARC Policy", shortTitle: "DMARC", description: "Protect domain", icon: Shield },
  { id: "verify", title: "Final Check", shortTitle: "Verify", description: "Verify all", icon: CheckCheck },
  { id: "complete", title: "Complete", shortTitle: "Done", description: "All set!", icon: CheckCircle2 },
]

export function GuidedEmailWizard({ existingDomains = [], existingAccounts = [] }: GuidedEmailWizardProps) {
  const router = useRouter()
  const [state, setState] = useState<WizardState>(defaultState)
  const [loading, setLoading] = useState(false)
  const [verificationResults, setVerificationResults] = useState<any>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const currentStepIndex = steps.findIndex((s) => s.id === state.currentStep)
  const progress = Math.round((currentStepIndex / (steps.length - 1)) * 100)

  useEffect(() => {
    const handleSelectDomain = (event: CustomEvent<{ domainId: string; domainName: string }>) => {
      const { domainId, domainName } = event.detail

      // Find the domain in existing domains to get its data
      const domain = existingDomains.find((d) => d.id === domainId)

      if (domain) {
        setState((prev) => ({
          ...prev,
          domainId: domain.id,
          domainName: domain.domain,
          dnsRecords: domain.dnsRecords?.records || [],
          stepStatuses: {
            ...prev.stepStatuses,
            "add-domain": { completed: true, verified: true, skipped: false },
          },
          currentStep: "spf", // Start at SPF since domain is already added
        }))

        toast.info(`Configuring ${domain.domain}`, {
          description: "Continue with DNS setup below",
        })
      }
    }

    window.addEventListener("select-domain", handleSelectDomain as EventListener)
    return () => window.removeEventListener("select-domain", handleSelectDomain as EventListener)
  }, [existingDomains])

  // Load saved state from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return

    const savedState = localStorage.getItem(STORAGE_KEY)
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        setState(parsed)
      } catch (e) {
        console.error("Failed to parse saved wizard state")
      }
    }

    // Check for existing unconfigured domains
    if (existingDomains.length > 0) {
      const unconfigured = existingDomains.find((d) => !d.isVerified)
      if (unconfigured) {
        const health = unconfigured.deliverabilityHealth

        setState((prev) => {
          const newState = { ...prev }
          newState.domainId = unconfigured.id
          newState.domainName = unconfigured.domain

          if (unconfigured.dnsRecords?.records) {
            newState.dnsRecords = unconfigured.dnsRecords.records
          }

          if (health) {
            newState.stepStatuses = {
              ...prev.stepStatuses,
              "add-domain": { completed: true, verified: true, skipped: false },
              spf: { completed: true, verified: health.spfValid || false, skipped: !health.spfValid },
              dkim: {
                completed: health.spfValid || false,
                verified: health.dkimValid || false,
                skipped: !health.dkimValid && health.spfValid,
              },
              dmarc: {
                completed: health.dkimValid || health.spfValid || false,
                verified: health.dmarcValid || false,
                skipped: !health.dmarcValid && (health.dkimValid || health.spfValid),
              },
            }

            if (!health.spfValid && !prev.stepStatuses.spf.skipped) {
              newState.currentStep = "spf"
            } else if (!health.dkimValid && !prev.stepStatuses.dkim.skipped) {
              newState.currentStep = "dkim"
            } else if (!health.dmarcValid && !prev.stepStatuses.dmarc.skipped) {
              newState.currentStep = "dmarc"
            } else {
              newState.currentStep = "verify"
            }
          } else if (unconfigured.verificationAttempts > 0) {
            newState.stepStatuses["add-domain"] = { completed: true, verified: true, skipped: false }
            newState.currentStep = "spf"
          }

          return newState
        })
      }
    }

    setIsInitialized(true)
  }, [existingDomains])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, isInitialized])

  const updateStepStatus = useCallback((step: SetupStep, updates: Partial<StepStatus>) => {
    setState((prev) => ({
      ...prev,
      stepStatuses: {
        ...prev.stepStatuses,
        [step]: { ...prev.stepStatuses[step], ...updates },
      },
    }))
  }, [])

  const goToStep = useCallback((step: SetupStep) => {
    setState((prev) => ({ ...prev, currentStep: step }))
  }, [])

  const nextStep = useCallback(() => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      goToStep(steps[nextIndex].id)
    }
  }, [currentStepIndex, goToStep])

  const prevStep = useCallback(() => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      goToStep(steps[prevIndex].id)
    }
  }, [currentStepIndex, goToStep])

  const handleAddDomain = async () => {
    if (!state.domainName) {
      toast.error("Please enter a domain name")
      return
    }

    const cleanDomain = state.domainName
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/.*$/, "")

    setState((prev) => ({ ...prev, domainName: cleanDomain }))

    const existingDomain = existingDomains?.find((d) => d.domain.toLowerCase() === cleanDomain)

    if (existingDomain) {
      if (existingDomain.isVerified) {
        toast.error("Domain already configured", {
          description: "This domain is already verified. You can manage it in Settings.",
        })
        return
      } else {
        setState((prev) => ({
          ...prev,
          domainId: existingDomain.id,
          dnsRecords: existingDomain.dnsRecords?.records || [],
        }))
        updateStepStatus("add-domain", { completed: true, verified: true })
        toast.info("Resuming configuration", {
          description: "This domain was added before. Continue with DNS setup.",
        })
        goToStep("spf")
        return
      }
    }

    setLoading(true)
    try {
      const result = await addDomain(cleanDomain)

      if (result.success === false) {
        toast.error(result.error || "Failed to add domain")
        return
      }

      if (result.success && result.domainId && result.dnsRecords) {
        setState((prev) => ({
          ...prev,
          domainId: result.domainId,
          dnsRecords: result.dnsRecords.records,
          dkimSelector: result.dnsRecords.selector || "default",
        }))
        updateStepStatus("add-domain", { completed: true, verified: true })
        toast.success("Domain added successfully!")
        goToStep("spf")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add domain")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyStep = async (step: "spf" | "dkim" | "dmarc") => {
    if (!state.domainId) {
      toast.error("No domain configured")
      return
    }

    setLoading(true)
    try {
      const result = await verifyDomain(state.domainId)
      setVerificationResults(result)

      const stepResult = result.results.find((r: any) => r.type === step.toUpperCase())
      const isValid = stepResult?.valid || false

      if (isValid) {
        updateStepStatus(step, { completed: true, verified: true, skipped: false })
        toast.success(`${step.toUpperCase()} verified successfully!`)

        // Auto advance to next step
        const stepOrder: SetupStep[] = ["spf", "dkim", "dmarc", "verify"]
        const currentIdx = stepOrder.indexOf(step)
        if (currentIdx < stepOrder.length - 1) {
          setTimeout(() => goToStep(stepOrder[currentIdx + 1]), 500)
        }
      } else {
        toast.error(`${step.toUpperCase()} not verified yet`, {
          description: "DNS changes can take up to 48 hours. You can skip and verify later.",
        })
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSkipStep = (step: "spf" | "dkim" | "dmarc") => {
    updateStepStatus(step, { completed: true, skipped: true })
    const stepOrder: SetupStep[] = ["spf", "dkim", "dmarc", "verify"]
    const currentIdx = stepOrder.indexOf(step)
    if (currentIdx < stepOrder.length - 1) {
      goToStep(stepOrder[currentIdx + 1])
    }
    toast.info("Step skipped", { description: "You can verify this later." })
  }

  const handleFinalVerification = async () => {
    if (!state.domainId) return

    setLoading(true)
    try {
      const result = await verifyDomain(state.domainId)
      setVerificationResults(result)

      // Update step statuses based on verification results
      for (const r of result.results) {
        const stepId = r.type.toLowerCase() as "spf" | "dkim" | "dmarc"
        if (steps.find((s) => s.id === stepId)) {
          updateStepStatus(stepId, { verified: r.valid })
        }
      }

      const allVerified = result.results.every((r: any) => r.valid)

      if (allVerified) {
        updateStepStatus("verify", { completed: true, verified: true })
        toast.success("All DNS records verified!")
        goToStep("complete")
      } else {
        const failed = result.results.filter((r: any) => !r.valid).map((r: any) => r.type)
        toast.warning(`Pending: ${failed.join(", ")}`, {
          description: "You can complete setup and verify these later.",
        })
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteSetup = () => {
    localStorage.removeItem(STORAGE_KEY)
    toast.success("Setup complete!")
    router.push("/dashboard/settings")
  }

  const resetWizard = () => {
    localStorage.removeItem(STORAGE_KEY)
    setState(defaultState)
    toast.info("Starting fresh setup")
  }

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    toast.success(`${label} copied!`, { duration: 1500 })
    setTimeout(() => setCopied(null), 2000)
  }

  // Get DNS records with fallbacks
  const spfRecord = state.dnsRecords.find((r) => r.type === "TXT" && (r.name === "@" || r.name === "")) || {
    type: "TXT",
    name: "@",
    value: `v=spf1 include:sendgrid.net ~all`,
  }

  const dkimRecord = state.dnsRecords.find((r) => r.type === "CNAME" && r.name?.includes("_domainkey")) || {
    type: "CNAME",
    name: `${state.dkimSelector}._domainkey`,
    value: `${state.dkimSelector}.sendgrid.net`,
  }

  const dmarcRecord = state.dnsRecords.find((r) => r.type === "TXT" && r.name === "_dmarc") || {
    type: "TXT",
    name: "_dmarc",
    value: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${state.domainName || "yourdomain.com"}`,
  }

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Progress Header */}
        <div className="space-y-4">
          {/* Step indicators */}
          <div className="relative flex items-center justify-between">
            {/* Connection line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />

            {steps.map((step, index) => {
              const status = state.stepStatuses[step.id]
              const isCurrent = state.currentStep === step.id
              const isPast = index < currentStepIndex
              const isClickable = index <= currentStepIndex || status.completed || status.skipped

              return (
                <Tooltip key={step.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => isClickable && goToStep(step.id)}
                      disabled={!isClickable}
                      className={cn(
                        "relative z-10 flex flex-col items-center gap-2 transition-all duration-200",
                        isClickable ? "cursor-pointer" : "cursor-not-allowed",
                      )}
                    >
                      {/* Step circle */}
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                          status.verified &&
                            "border-[var(--success)] bg-[var(--success)] text-[var(--success-foreground)] animate-pulse-success",
                          status.skipped &&
                            "border-[var(--warning)] bg-[var(--warning)] text-[var(--warning-foreground)]",
                          isCurrent &&
                            !status.verified &&
                            !status.skipped &&
                            "border-primary bg-primary text-primary-foreground scale-110 shadow-lg",
                          isPast &&
                            !status.verified &&
                            !status.skipped &&
                            "border-primary/50 bg-primary/10 text-primary",
                          !isPast &&
                            !isCurrent &&
                            !status.verified &&
                            !status.skipped &&
                            "border-muted-foreground/30 bg-background text-muted-foreground/50",
                        )}
                      >
                        {status.verified ? (
                          <Check className="h-5 w-5" strokeWidth={3} />
                        ) : status.skipped ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <step.icon className="h-4 w-4" />
                        )}
                      </div>

                      {/* Step label */}
                      <span
                        className={cn(
                          "text-xs font-medium transition-colors hidden sm:block",
                          isCurrent ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        {step.shortTitle}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-center">
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                    {status.verified && <p className="text-xs text-[var(--success)] font-medium mt-1">Verified</p>}
                    {status.skipped && (
                      <p className="text-xs text-[var(--warning)] font-medium mt-1">Skipped - verify later</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span>{progress}% complete</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>

        {/* Welcome Step */}
        {state.currentStep === "welcome" && (
          <Card className="border-0 shadow-lg animate-slide-up">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                <div className="relative p-5 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
                  <Mail className="h-10 w-10 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight">Email Deliverability Setup</CardTitle>
              <CardDescription className="text-base max-w-md mx-auto">
                Configure your domain in 5 minutes to ensure your emails land in the inbox, not spam
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Benefits grid */}
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Shield, title: "SPF", desc: "Authorize your email servers" },
                  { icon: Mail, title: "DKIM", desc: "Digitally sign your emails" },
                  { icon: Shield, title: "DMARC", desc: "Protect from spoofing" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-col items-center text-center p-5 rounded-xl bg-secondary/50 border border-border/50"
                  >
                    <div className="p-3 bg-primary/10 rounded-lg mb-3">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* What you need */}
              <div className="rounded-xl bg-secondary/30 border border-border/50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-sm">What you'll need</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Access to your DNS settings (GoDaddy, Cloudflare, Namecheap, etc.)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    About 5-10 minutes of your time
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Your business domain (e.g., yourcompany.com)
                  </li>
                </ul>
              </div>

              {/* Reassurance */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--success-muted)] border border-[var(--success)]/20">
                <CheckCircle2 className="h-5 w-5 text-[var(--success)] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[var(--success)]">Don't worry, we'll guide you!</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    No technical knowledge required. Just copy and paste the values we provide.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button onClick={() => goToStep("add-domain")} className="w-full h-12 text-base font-semibold" size="lg">
                Start Setup
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Add Domain Step */}
        {state.currentStep === "add-domain" && (
          <Card className="border-0 shadow-lg animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Server className="h-5 w-5 text-primary" />
                </div>
                Add Your Domain
              </CardTitle>
              <CardDescription>Enter the domain you'll be sending emails from</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="domain" className="text-base font-medium">
                  Domain Name
                </Label>
                <Input
                  id="domain"
                  placeholder="yourcompany.com"
                  value={state.domainName}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      domainName: e.target.value.trim().toLowerCase(),
                    }))
                  }
                  disabled={loading}
                  className="h-12 text-lg"
                />
                <p className="text-sm text-muted-foreground">Just the domain name - no http://, www, or paths</p>
              </div>

              {/* Examples */}
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--success-muted)] text-[var(--success)]">
                  <Check className="h-3.5 w-3.5" />
                  <code className="text-xs">company.com</code>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive">
                  <XCircle className="h-3.5 w-3.5" />
                  <code className="text-xs">https://www.company.com</code>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3 pt-2">
              <Button variant="outline" onClick={prevStep} className="px-6 bg-transparent">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleAddDomain} disabled={!state.domainName || loading} className="flex-1 h-11">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* SPF Step */}
        {state.currentStep === "spf" && (
          <DNSRecordStep
            title="SPF Record"
            description="Sender Policy Framework - tells email providers which servers are allowed to send emails from your domain"
            icon={Shield}
            recordType="TXT"
            recordName={spfRecord.name}
            recordValue={spfRecord.value}
            isVerified={state.stepStatuses.spf.verified}
            isSkipped={state.stepStatuses.spf.skipped}
            loading={loading}
            onVerify={() => handleVerifyStep("spf")}
            onSkip={() => handleSkipStep("spf")}
            onBack={prevStep}
            onCopy={copyToClipboard}
            copied={copied}
            helpText="The '@' symbol means the root domain (yourcompany.com)"
            stepNumber={3}
            totalSteps={7}
          />
        )}

        {/* DKIM Step */}
        {state.currentStep === "dkim" && (
          <DNSRecordStep
            title="DKIM Key"
            description="DomainKeys Identified Mail - digitally signs your emails to prove they're really from you"
            icon={Mail}
            recordType="CNAME"
            recordName={dkimRecord.name}
            recordValue={dkimRecord.value}
            isVerified={state.stepStatuses.dkim.verified}
            isSkipped={state.stepStatuses.dkim.skipped}
            loading={loading}
            onVerify={() => handleVerifyStep("dkim")}
            onSkip={() => handleSkipStep("dkim")}
            onBack={prevStep}
            onCopy={copyToClipboard}
            copied={copied}
            helpText="Some DNS providers call the Name field 'Host' or 'Alias'"
            stepNumber={4}
            totalSteps={7}
            extraInfo={
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--warning-muted)] border border-[var(--warning)]/20">
                <HelpCircle className="h-5 w-5 text-[var(--warning)] shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">DKIM verification can take longer</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>Your email provider (Gmail, SendGrid, etc.) may use a different selector</li>
                    <li>Some DNS providers require you to remove the domain suffix from the name</li>
                    <li>DNS changes can take up to 48 hours to propagate</li>
                  </ul>
                </div>
              </div>
            }
          />
        )}

        {/* DMARC Step */}
        {state.currentStep === "dmarc" && (
          <DNSRecordStep
            title="DMARC Policy"
            description="Domain-based Message Authentication - protects your domain from being used in phishing attacks"
            icon={Shield}
            recordType="TXT"
            recordName={dmarcRecord.name}
            recordValue={dmarcRecord.value}
            isVerified={state.stepStatuses.dmarc.verified}
            isSkipped={state.stepStatuses.dmarc.skipped}
            loading={loading}
            onVerify={() => handleVerifyStep("dmarc")}
            onSkip={() => handleSkipStep("dmarc")}
            onBack={prevStep}
            onCopy={copyToClipboard}
            copied={copied}
            helpText="The name should be exactly '_dmarc' (with underscore)"
            stepNumber={5}
            totalSteps={7}
          />
        )}

        {/* Verify Step */}
        {state.currentStep === "verify" && (
          <Card className="border-0 shadow-lg animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CheckCheck className="h-5 w-5 text-primary" />
                </div>
                Final Verification
              </CardTitle>
              <CardDescription>Let's verify all your DNS records are configured correctly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status cards */}
              <div className="space-y-3">
                {[
                  { id: "spf", name: "SPF Record", desc: "Server authorization", status: state.stepStatuses.spf },
                  { id: "dkim", name: "DKIM Key", desc: "Email signing", status: state.stepStatuses.dkim },
                  { id: "dmarc", name: "DMARC Policy", desc: "Spoofing protection", status: state.stepStatuses.dmarc },
                ].map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                      item.status.verified && "border-[var(--success)]/30 bg-[var(--success-muted)]",
                      item.status.skipped &&
                        !item.status.verified &&
                        "border-[var(--warning)]/30 bg-[var(--warning-muted)]",
                      !item.status.verified && !item.status.skipped && "border-border bg-secondary/30",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          item.status.verified && "bg-[var(--success)] text-[var(--success-foreground)]",
                          item.status.skipped &&
                            !item.status.verified &&
                            "bg-[var(--warning)] text-[var(--warning-foreground)]",
                          !item.status.verified && !item.status.skipped && "bg-muted text-muted-foreground",
                        )}
                      >
                        {item.status.verified ? (
                          <Check className="h-5 w-5" strokeWidth={3} />
                        ) : item.status.skipped ? (
                          <Clock className="h-5 w-5" />
                        ) : (
                          <AlertCircle className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    {item.status.verified ? (
                      <Badge className="bg-[var(--success)] text-[var(--success-foreground)] hover:bg-[var(--success)]">
                        Verified
                      </Badge>
                    ) : item.status.skipped ? (
                      <Button variant="outline" size="sm" onClick={() => goToStep(item.id as SetupStep)}>
                        Verify Now
                      </Button>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </div>
                ))}
              </div>

              {/* Status message */}
              {verificationResults && (
                <div
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border",
                    verificationResults.allValid
                      ? "bg-[var(--success-muted)] border-[var(--success)]/20"
                      : "bg-[var(--warning-muted)] border-[var(--warning)]/20",
                  )}
                >
                  {verificationResults.allValid ? (
                    <CheckCircle2 className="h-5 w-5 text-[var(--success)] shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-[var(--warning)] shrink-0" />
                  )}
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        verificationResults.allValid ? "text-[var(--success)]" : "text-[var(--warning)]",
                      )}
                    >
                      {verificationResults.allValid ? "All records verified!" : "Some records still pending"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {verificationResults.allValid
                        ? "Your domain is properly configured for email sending."
                        : "You can complete setup now and verify pending records later."}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="outline" onClick={prevStep} className="sm:w-auto w-full bg-transparent">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                variant="outline"
                onClick={handleFinalVerification}
                disabled={loading}
                className="sm:flex-1 w-full bg-transparent"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <RefreshCw className="mr-2 h-4 w-4" />
                Re-verify All
              </Button>
              <Button onClick={() => goToStep("complete")} className="sm:flex-1 w-full h-11">
                Complete Setup
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Complete Step */}
        {state.currentStep === "complete" && (
          <Card className="border-0 shadow-lg animate-slide-up overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-[var(--success)] via-primary to-[var(--success)]" />
            <CardHeader className="text-center pb-4 pt-8">
              <div className="mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-[var(--success)]/30 blur-3xl rounded-full" />
                <div className="relative p-6 bg-[var(--success)] rounded-full shadow-lg animate-pulse-success">
                  <CheckCircle2 className="h-12 w-12 text-[var(--success-foreground)]" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-[var(--success)]">Setup Complete!</CardTitle>
              <CardDescription className="text-base">
                <strong className="text-foreground">{state.domainName}</strong> is now configured for email sending
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Final status */}
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { name: "SPF", status: state.stepStatuses.spf },
                  { name: "DKIM", status: state.stepStatuses.dkim },
                  { name: "DMARC", status: state.stepStatuses.dmarc },
                ].map((item) => (
                  <div
                    key={item.name}
                    className={cn(
                      "flex flex-col items-center p-5 rounded-xl text-center",
                      item.status.verified ? "bg-[var(--success-muted)]" : "bg-[var(--warning-muted)]",
                    )}
                  >
                    {item.status.verified ? (
                      <CheckCircle2 className="h-8 w-8 text-[var(--success)] mb-2" />
                    ) : (
                      <Clock className="h-8 w-8 text-[var(--warning)] mb-2" />
                    )}
                    <span className="font-semibold">{item.name}</span>
                    <span
                      className={cn(
                        "text-sm",
                        item.status.verified ? "text-[var(--success)]" : "text-[var(--warning)]",
                      )}
                    >
                      {item.status.verified ? "Verified" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pending warning */}
              {(state.stepStatuses.spf.skipped ||
                state.stepStatuses.dkim.skipped ||
                state.stepStatuses.dmarc.skipped) && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--warning-muted)] border border-[var(--warning)]/20">
                  <Clock className="h-5 w-5 text-[var(--warning)] shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Some records are still pending</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      You can start sending emails, but come back to verify skipped records once your DNS changes
                      propagate (up to 48 hours).
                    </p>
                  </div>
                </div>
              )}

              {/* Next steps */}
              <div className="rounded-xl border bg-secondary/30 p-5 space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Next Steps
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/dashboard/settings?tab=sending"
                      className="flex items-center gap-3 text-sm p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        1
                      </div>
                      <span className="flex-1">Connect your email accounts in Settings</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/warmup"
                      className="flex items-center gap-3 text-sm p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        2
                      </div>
                      <span className="flex-1">Start email warmup to build reputation</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/campaigns/new"
                      className="flex items-center gap-3 text-sm p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        3
                      </div>
                      <span className="flex-1">Create your first campaign</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3 pt-2">
              <Button variant="outline" onClick={resetWizard}>
                Add Another Domain
              </Button>
              <Button onClick={handleCompleteSetup} className="flex-1 h-11">
                Go to Settings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}

// DNS Record Step Component
interface DNSRecordStepProps {
  title: string
  description: string
  icon: any
  recordType: string
  recordName: string
  recordValue: string
  isVerified: boolean
  isSkipped: boolean
  loading: boolean
  onVerify: () => void
  onSkip: () => void
  onBack: () => void
  onCopy: (text: string, label: string) => void
  copied: string | null
  helpText: string
  stepNumber: number
  totalSteps: number
  extraInfo?: React.ReactNode
}

function DNSRecordStep({
  title,
  description,
  icon: Icon,
  recordType,
  recordName,
  recordValue,
  isVerified,
  isSkipped,
  loading,
  onVerify,
  onSkip,
  onBack,
  onCopy,
  copied,
  helpText,
  stepNumber,
  totalSteps,
  extraInfo,
}: DNSRecordStepProps) {
  return (
    <Card
      className={cn(
        "border-0 shadow-lg animate-slide-up transition-all",
        isVerified && "ring-2 ring-[var(--success)]/30",
      )}
    >
      {isVerified && <div className="h-1.5 bg-[var(--success)]" />}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", isVerified ? "bg-[var(--success-muted)]" : "bg-primary/10")}>
              <Icon className={cn("h-5 w-5", isVerified ? "text-[var(--success)]" : "text-primary")} />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {title}
                {isVerified && (
                  <Badge className="bg-[var(--success)] text-[var(--success-foreground)] hover:bg-[var(--success)]">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {isSkipped && !isVerified && (
                  <Badge variant="outline" className="border-[var(--warning)] text-[var(--warning)]">
                    Skipped
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div className="rounded-xl bg-secondary/50 border border-border/50 p-5 space-y-5">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              1
            </div>
            <div>
              <p className="font-medium">Open your DNS provider</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Go to GoDaddy, Cloudflare, Namecheap, or wherever you bought your domain and find DNS settings
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              2
            </div>
            <div>
              <p className="font-medium">Add a new {recordType} record</p>
              <p className="text-sm text-muted-foreground mt-0.5">{helpText}</p>
            </div>
          </div>

          {/* Step 3 - Copy values */}
          <div className="flex gap-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              3
            </div>
            <div className="flex-1 space-y-4">
              <p className="font-medium">Copy these values:</p>

              {/* Type */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Type</Label>
                <div className="px-4 py-3 rounded-lg bg-background border font-mono text-sm">{recordType}</div>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Name / Host</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-3 rounded-lg bg-background border font-mono text-sm break-all">
                    {recordName}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onCopy(recordName, "Name")}
                    className={cn(
                      "shrink-0 transition-all",
                      copied === "Name" &&
                        "bg-[var(--success)] text-[var(--success-foreground)] border-[var(--success)]",
                    )}
                  >
                    {copied === "Name" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Value */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Value / Content</Label>
                <div className="flex items-start gap-2">
                  <code className="flex-1 px-4 py-3 rounded-lg bg-background border font-mono text-sm break-all">
                    {recordValue}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onCopy(recordValue, "Value")}
                    className={cn(
                      "shrink-0 transition-all",
                      copied === "Value" &&
                        "bg-[var(--success)] text-[var(--success-foreground)] border-[var(--success)]",
                    )}
                  >
                    {copied === "Value" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {extraInfo}

        {/* DNS propagation notice */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border/50">
          <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium">DNS changes take time to propagate</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              It can take a few minutes to 48 hours. If verification fails, wait and try again.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button variant="outline" onClick={onBack} className="sm:w-auto w-full bg-transparent">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          variant="ghost"
          onClick={onSkip}
          className="sm:ml-auto sm:w-auto w-full text-muted-foreground hover:text-foreground"
        >
          <Clock className="mr-2 h-4 w-4" />
          Skip for Now
        </Button>
        <Button onClick={onVerify} disabled={loading} className="sm:w-auto w-full h-11">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
          Verify {title}
        </Button>
      </CardFooter>
    </Card>
  )
}
