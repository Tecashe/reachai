// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Loader2, CheckCircle2 } from "lucide-react"
// import { addDomain } from "@/lib/actions/domain-action"
// import { toast } from "sonner"

// export function DomainSetupWizard() {
//   const [domain, setDomain] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [result, setResult] = useState<any>(null)

//   const handleAddDomain = async () => {
//     if (!domain) {
//       toast.error("Please enter a domain name")
//       return
//     }

//     setLoading(true)
//     try {
//       const response = await addDomain(domain)

//       if (response.success) {
//         setResult(response)
//         toast.success("Domain added successfully!")
//       } else {
//         // toast.error(response.error || "Failed to add domain")
//          toast.error("Failed to add domain")
//       }
//     } catch (error) {
//       toast.error("An error occurred")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="space-y-4">
//         <div className="space-y-2">
//           <Label htmlFor="domain">Domain Name</Label>
//           <div className="flex gap-2">
//             <Input
//               id="domain"
//               placeholder="example.com"
//               value={domain}
//               onChange={(e) => setDomain(e.target.value)}
//               disabled={loading}
//             />
//             <Button onClick={handleAddDomain} disabled={loading || !domain}>
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Add Domain
//             </Button>
//           </div>
//           <p className="text-sm text-muted-foreground">Enter your domain without http:// or www (e.g., example.com)</p>
//         </div>

//         {result && (
//           <Alert>
//             <CheckCircle2 className="h-4 w-4" />
//             <AlertDescription>
//               Domain added! Next, configure your DNS records in the DNS Configuration tab.
//             </AlertDescription>
//           </Alert>
//         )}
//       </div>
//     </div>
//   )
// }

// "use client"

// import type React from "react"

// import { useState, useCallback } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Badge } from "@/components/ui/badge"
// import { Spinner } from "@/components/ui/spinner"
// import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
// import { InputGroup, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
// import { CheckCircle2, XCircle, AlertCircle, Globe, ArrowRight, Sparkles } from "lucide-react"
// import { toast } from "sonner"
// import { addDomain } from "@/lib/actions/domain-action"
// import { cn } from "@/lib/utils"

// interface DomainStatus {
//   id: string
//   domain: string
//   isVerified: boolean
// }

// interface DomainSetupWizardProps {
//   onDomainAdded: (domainId: string) => void
//   existingDomains: DomainStatus[]
// }

// // Domain validation regex
// const DOMAIN_REGEX = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i

// export function DomainSetupWizard({ onDomainAdded, existingDomains }: DomainSetupWizardProps) {
//   const [domain, setDomain] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [validationState, setValidationState] = useState<"idle" | "valid" | "invalid" | "duplicate">("idle")
//   const [validationMessage, setValidationMessage] = useState("")

//   // Validate domain input
//   const validateDomain = useCallback(
//     (value: string) => {
//       const normalized = value
//         .trim()
//         .toLowerCase()
//         .replace(/^(https?:\/\/)?(www\.)?/, "")
//         .split("/")[0]

//       if (!normalized) {
//         setValidationState("idle")
//         setValidationMessage("")
//         return
//       }

//       // Check for duplicates
//       if (existingDomains.some((d) => d.domain === normalized)) {
//         setValidationState("duplicate")
//         setValidationMessage("This domain is already added to your account.")
//         return
//       }

//       // Validate format
//       if (!DOMAIN_REGEX.test(normalized)) {
//         setValidationState("invalid")
//         setValidationMessage("Please enter a valid domain (e.g., example.com)")
//         return
//       }

//       setValidationState("valid")
//       setValidationMessage("Domain format looks good!")
//     },
//     [existingDomains],
//   )

//   const handleDomainChange = (value: string) => {
//     setDomain(value)
//     validateDomain(value)
//   }

//   const handleAddDomain = async () => {
//     if (!domain || validationState !== "valid") {
//       toast.error("Please enter a valid domain")
//       return
//     }

//     setLoading(true)
//     try {
//       const normalizedDomain = domain
//         .trim()
//         .toLowerCase()
//         .replace(/^(https?:\/\/)?(www\.)?/, "")
//         .split("/")[0]
//       const result = await addDomain(normalizedDomain)

//       if (result.success) {
//         toast.success("Domain added successfully!")
//         setDomain("")
//         setValidationState("idle")
//         onDomainAdded(result.domainId||"")
//       } else {
//         toast.error(result.error || "Failed to add domain")
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && validationState === "valid" && !loading) {
//       handleAddDomain()
//     }
//   }

//   return (
//     <div className="grid gap-6 lg:grid-cols-2">
//       {/* Add Domain Card */}
//       <Card className="relative overflow-hidden">
//         {/* Subtle gradient */}
//         <div className="pointer-events-none absolute inset-0" aria-hidden="true">
//           <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
//         </div>

//         <CardHeader className="relative">
//           <div className="flex items-center gap-2 mb-2">
//             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
//               <Globe className="h-4 w-4 text-primary" />
//             </div>
//             <Badge variant="secondary" className="text-xs">
//               Step 1
//             </Badge>
//           </div>
//           <CardTitle>Add Your Domain</CardTitle>
//           <CardDescription>Enter the domain you want to use for sending cold emails.</CardDescription>
//         </CardHeader>

//         <CardContent className="relative space-y-4">
//           <Field>
//             <FieldLabel htmlFor="domain-input">Domain Name</FieldLabel>
//             <InputGroup
//               className={cn(
//                 validationState === "valid" && "ring-2 ring-green-500/20",
//                 (validationState === "invalid" || validationState === "duplicate") && "ring-2 ring-red-500/20",
//               )}
//             >
//               <InputGroupText className="text-muted-foreground">https://</InputGroupText>
//               <InputGroupInput
//                 id="domain-input"
//                 placeholder="yourdomain.com"
//                 value={domain}
//                 onChange={(e) => handleDomainChange(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 disabled={loading}
//                 aria-describedby="domain-hint"
//                 aria-invalid={validationState === "invalid" || validationState === "duplicate"}
//               />
//             </InputGroup>

//             {/* Validation feedback */}
//             {validationState !== "idle" && (
//               <div
//                 className={cn(
//                   "flex items-center gap-2 text-sm mt-2",
//                   validationState === "valid" && "text-green-600",
//                   (validationState === "invalid" || validationState === "duplicate") && "text-red-600",
//                 )}
//               >
//                 {validationState === "valid" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
//                 {validationMessage}
//               </div>
//             )}

//             <FieldDescription id="domain-hint">
//               Enter without http://, https://, or www. Just the domain name.
//             </FieldDescription>
//           </Field>

//           <Button
//             onClick={handleAddDomain}
//             disabled={loading || validationState !== "valid"}
//             className="w-full gap-2"
//             size="lg"
//           >
//             {loading ? (
//               <>
//                 <Spinner />
//                 Adding Domain...
//               </>
//             ) : (
//               <>
//                 Add Domain
//                 <ArrowRight className="h-4 w-4" />
//               </>
//             )}
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Tips Card */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center gap-2 mb-2">
//             <Sparkles className="h-5 w-5 text-amber-500" />
//             <CardTitle className="text-lg">Pro Tips</CardTitle>
//           </div>
//           <CardDescription>Best practices for cold email domains</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-3">
//             <TipItem
//               title="Use a separate domain"
//               description="Don't use your main business domain for cold outreach. Create a similar domain (e.g., getacme.com instead of acme.com)."
//             />
//             <TipItem
//               title="Warm up new domains"
//               description="New domains need 2-4 weeks of gradual sending increase before full-scale outreach."
//             />
//             <TipItem
//               title="Multiple domains scale better"
//               description="Use 2-3 sending accounts per domain, and multiple domains for higher volume."
//             />
//           </div>

//           <Alert className="border-blue-500/20 bg-blue-500/5">
//             <AlertCircle className="h-4 w-4 text-blue-500" />
//             <AlertTitle className="text-blue-600">What happens next?</AlertTitle>
//             <AlertDescription className="text-blue-600/80">
//               After adding your domain, you'll configure SPF, DKIM, and DMARC records to authenticate your emails and
//               maximize deliverability.
//             </AlertDescription>
//           </Alert>
//         </CardContent>
//       </Card>

//       {/* Examples */}
//       <Card className="lg:col-span-2">
//         <CardHeader>
//           <CardTitle className="text-lg">Domain Format Examples</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-4 sm:grid-cols-2">
//             <div className="space-y-2">
//               <p className="text-sm font-medium text-green-600 flex items-center gap-2">
//                 <CheckCircle2 className="h-4 w-4" />
//                 Correct Format
//               </p>
//               <div className="space-y-1.5">
//                 {["yourbusiness.com", "outreach.company.io", "mail.startup.co"].map((example) => (
//                   <code key={example} className="block rounded bg-green-500/10 px-3 py-1.5 text-sm text-green-700">
//                     {example}
//                   </code>
//                 ))}
//               </div>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm font-medium text-red-600 flex items-center gap-2">
//                 <XCircle className="h-4 w-4" />
//                 Incorrect Format
//               </p>
//               <div className="space-y-1.5">
//                 {["https://www.yourbusiness.com", "www.company.io", "mail.startup.co/page"].map((example) => (
//                   <code key={example} className="block rounded bg-red-500/10 px-3 py-1.5 text-sm text-red-700">
//                     {example}
//                   </code>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// function TipItem({ title, description }: { title: string; description: string }) {
//   return (
//     <div className="flex gap-3">
//       <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
//         ✓
//       </div>
//       <div>
//         <p className="font-medium text-sm">{title}</p>
//         <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
//       </div>
//     </div>
//   )
// }

// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Spinner } from "@/components/ui/spinner"
// import {
//   Check,
//   Copy,
//   ArrowRight,
//   ArrowLeft,
//   Globe,
//   Shield,
//   Mail,
//   CheckCircle2,
//   AlertCircle,
//   Sparkles,
//   ExternalLink,
//   RefreshCw,
//   HelpCircle,
//   Zap,
// } from "lucide-react"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"
// import { addDomain, verifyDomain, updateDomainProvider, getProviders } from "@/lib/actions/domain-action"

// // =============================================================================
// // TYPES
// // =============================================================================

// type WizardStep =
//   | "welcome"
//   | "add-domain"
//   | "select-provider"
//   | "setup-spf"
//   | "setup-dkim"
//   | "setup-dmarc"
//   | "verify"
//   | "success"

// interface DomainData {
//   id: string
//   domain: string
//   providerId: string
//   providerName: string
// }

// interface DNSRecord {
//   type: string
//   name: string
//   value: string
// }

// interface Provider {
//   id: string
//   name: string
//   icon: string
//   dkimSelectors: string[]
//   spfInclude: string
//   setupUrl: string
//   instructions: string[]
//   estimatedTime: string
// }

// interface VerificationStatus {
//   spf: "pending" | "valid" | "invalid"
//   dkim: "pending" | "valid" | "invalid"
//   dmarc: "pending" | "valid" | "invalid"
// }

// // =============================================================================
// // STEP CONFIGURATION
// // =============================================================================

// const STEPS: { id: WizardStep; label: string; number: number }[] = [
//   { id: "add-domain", label: "Add Domain", number: 1 },
//   { id: "select-provider", label: "Email Provider", number: 2 },
//   { id: "setup-spf", label: "SPF Record", number: 3 },
//   { id: "setup-dkim", label: "DKIM Setup", number: 4 },
//   { id: "setup-dmarc", label: "DMARC Record", number: 5 },
//   { id: "verify", label: "Verify", number: 6 },
// ]

// // =============================================================================
// // MAIN COMPONENT
// // =============================================================================

// export function DomainSetupWizard() {
//   const [currentStep, setCurrentStep] = useState<WizardStep>("welcome")
//   const [domainData, setDomainData] = useState<DomainData | null>(null)
//   const [providers, setProviders] = useState<Provider[]>([])
//   const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([])
//   const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
//     spf: "pending",
//     dkim: "pending",
//     dmarc: "pending",
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const [isVerifying, setIsVerifying] = useState(false)

//   // Fetch providers on mount
//   useEffect(() => {
//     const fetchProviders = async () => {
//       try {
//         const providerList = await getProviders()
//         setProviders(providerList)
//       } catch (error) {
//         console.error("Failed to fetch providers:", error)
//       }
//     }
//     fetchProviders()
//   }, [])

//   // Get current step index for progress
//   const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep)
//   const progressPercentage =
//     currentStep === "welcome" ? 0 : currentStep === "success" ? 100 : ((currentStepIndex + 1) / STEPS.length) * 100

//   // Get SPF, DKIM, DMARC records
//   const spfRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "@")
//   const dmarcRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "_dmarc")
//   const selectedProvider = providers.find((p) => p.id === domainData?.providerId)

//   // =============================================================================
//   // HANDLERS
//   // =============================================================================

//   const handleAddDomain = async (domain: string) => {
//     setIsLoading(true)
//     try {
//       const result = await addDomain(domain)
//       if (result.success && result.domainId) {
//         setDomainData({
//           id: result.domainId,
//           domain: domain,
//           providerId: "",
//           providerName: "",
//         })
//         if (result.dnsRecords?.records) {
//           setDnsRecords(result.dnsRecords.records)
//         }
//         setCurrentStep("select-provider")
//         toast.success("Domain added successfully!")
//       } else {
//         toast.error(result.error || "Failed to add domain")
//       }
//     } catch (error) {
//       toast.error("Something went wrong. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // const handleAddDomain = async (domain: string) => {
//   //   setIsLoading(true)
//   //   try {
//   //     const result = await addDomain(domain)
//   //     if (result.success && result.domain) {
//   //       setDomainData({
//   //         id: result.domain.id,
//   //         domain: result.domain.domain,
//   //         providerId: "",
//   //         providerName: "",
//   //       })
//   //       if (result.dnsRecords) {
//   //         setDnsRecords(result.dnsRecords)
//   //       }
//   //       setCurrentStep("select-provider")
//   //       toast.success("Domain added successfully!")
//   //     } else {
//   //       toast.error(result.error || "Failed to add domain")
//   //     }
//   //   } catch (error) {
//   //     toast.error("Something went wrong. Please try again.")
//   //   } finally {
//   //     setIsLoading(false)
//   //   }
//   // }

//   const handleSelectProvider = async (provider: Provider) => {
//     if (!domainData) return
//     setIsLoading(true)
//     try {
//       const result = await updateDomainProvider(domainData.id, provider.id)
//       if (result.success) {
//         setDomainData({
//           ...domainData,
//           providerId: provider.id,
//           providerName: provider.name,
//         })
//         // Fetch updated DNS records
//         const response = await fetch(`/api/domains/${domainData.id}`)
//         const data = await response.json()
//         if (data.success && data.domain?.dnsRecords?.records) {
//           setDnsRecords(data.domain.dnsRecords.records)
//         }
//         setCurrentStep("setup-spf")
//       }
//     } catch (error) {
//       toast.error("Failed to update provider")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleVerify = async () => {
//     if (!domainData) return
//     setIsVerifying(true)
//     try {
//       const result = await verifyDomain(domainData.id)
//       if (result.success) {
//         const newStatus: VerificationStatus = {
//           spf: "pending",
//           dkim: "pending",
//           dmarc: "pending",
//         }
//         result.results?.forEach((r: { type: string; valid: boolean }) => {
//           const type = r.type.toLowerCase() as keyof VerificationStatus
//           if (type in newStatus) {
//             newStatus[type] = r.valid ? "valid" : "invalid"
//           }
//         })
//         setVerificationStatus(newStatus)

//         if (result.verified) {
//           setCurrentStep("success")
//           toast.success("Your domain is fully verified!")
//         } else {
//           toast.info("Some records are still propagating. This can take up to 48 hours.")
//         }
//       }
//     } catch (error) {
//       toast.error("Verification failed. Please try again.")
//     } finally {
//       setIsVerifying(false)
//     }
//   }

//   const copyToClipboard = (text: string, label: string) => {
//     navigator.clipboard.writeText(text)
//     toast.success(`${label} copied to clipboard!`)
//   }

//   const goToStep = (step: WizardStep) => {
//     setCurrentStep(step)
//   }

//   // =============================================================================
//   // RENDER
//   // =============================================================================

//   return (
//     <div className="flex min-h-screen flex-col">
//       {/* Header with Progress */}
//       {currentStep !== "welcome" && currentStep !== "success" && (
//         <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
//           <div className="mx-auto max-w-2xl px-4 py-4">
//             {/* Step indicator */}
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center gap-2">
//                 <Globe className="h-5 w-5 text-primary" />
//                 <span className="font-medium">{domainData?.domain || "Domain Setup"}</span>
//               </div>
//               <Badge variant="secondary" className="font-normal">
//                 Step {currentStepIndex + 1} of {STEPS.length}
//               </Badge>
//             </div>

//             {/* Progress bar */}
//             <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
//                 style={{ width: `${progressPercentage}%` }}
//               />
//             </div>

//             {/* Step labels */}
//             <div className="flex justify-between mt-2">
//               {STEPS.map((step, index) => (
//                 <button
//                   key={step.id}
//                   onClick={() => {
//                     // Only allow going back to completed steps
//                     if (index < currentStepIndex) {
//                       goToStep(step.id)
//                     }
//                   }}
//                   disabled={index >= currentStepIndex}
//                   className={cn(
//                     "text-xs transition-colors",
//                     index < currentStepIndex
//                       ? "text-primary cursor-pointer hover:underline"
//                       : index === currentStepIndex
//                         ? "text-foreground font-medium"
//                         : "text-muted-foreground",
//                   )}
//                 >
//                   {step.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </header>
//       )}

//       {/* Main Content */}
//       <main className="flex-1 flex items-center justify-center p-4">
//         <div className="w-full max-w-2xl">
//           {/* Welcome Step */}
//           {currentStep === "welcome" && <WelcomeStep onContinue={() => setCurrentStep("add-domain")} />}

//           {/* Add Domain Step */}
//           {currentStep === "add-domain" && <AddDomainStep onSubmit={handleAddDomain} isLoading={isLoading} />}

//           {/* Select Provider Step */}
//           {currentStep === "select-provider" && (
//             <SelectProviderStep providers={providers} onSelect={handleSelectProvider} isLoading={isLoading} />
//           )}

//           {/* SPF Setup Step */}
//           {currentStep === "setup-spf" && spfRecord && (
//             <DNSRecordStep
//               title="Add your SPF record"
//               description="This tells email servers that you're allowed to send emails from your domain."
//               recordType="TXT"
//               recordName="@"
//               recordValue={spfRecord.value}
//               tip="If you already have an SPF record, add our include statement to it instead of replacing it."
//               onCopy={copyToClipboard}
//               onContinue={() => setCurrentStep("setup-dkim")}
//               onBack={() => setCurrentStep("select-provider")}
//             />
//           )}

//           {/* DKIM Setup Step */}
//           {currentStep === "setup-dkim" && selectedProvider && (
//             <DKIMSetupStep
//               provider={selectedProvider}
//               domain={domainData?.domain || ""}
//               onContinue={() => setCurrentStep("setup-dmarc")}
//               onBack={() => setCurrentStep("setup-spf")}
//             />
//           )}

//           {/* DMARC Setup Step */}
//           {currentStep === "setup-dmarc" && dmarcRecord && (
//             <DNSRecordStep
//               title="Add your DMARC record"
//               description="This protects your domain from being used in phishing attacks."
//               recordType="TXT"
//               recordName="_dmarc"
//               recordValue={dmarcRecord.value}
//               tip="Start with a 'none' policy to monitor emails, then switch to 'quarantine' or 'reject' later."
//               onCopy={copyToClipboard}
//               onContinue={() => setCurrentStep("verify")}
//               onBack={() => setCurrentStep("setup-dkim")}
//             />
//           )}

//           {/* Verify Step */}
//           {currentStep === "verify" && (
//             <VerifyStep
//               status={verificationStatus}
//               isVerifying={isVerifying}
//               onVerify={handleVerify}
//               onBack={() => setCurrentStep("setup-dmarc")}
//             />
//           )}

//           {/* Success Step */}
//           {currentStep === "success" && (
//             <SuccessStep
//               domain={domainData?.domain || ""}
//               onAddAnother={() => {
//                 setDomainData(null)
//                 setDnsRecords([])
//                 setVerificationStatus({ spf: "pending", dkim: "pending", dmarc: "pending" })
//                 setCurrentStep("add-domain")
//               }}
//             />
//           )}
//         </div>
//       </main>
//     </div>
//   )
// }

// // =============================================================================
// // STEP COMPONENTS
// // =============================================================================

// function WelcomeStep({ onContinue }: { onContinue: () => void }) {
//   return (
//     <div className="text-center space-y-8">
//       {/* Hero */}
//       <div className="space-y-4">
//         <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-4">
//           <Mail className="h-10 w-10 text-primary" />
//         </div>
//         <h1 className="text-4xl font-bold tracking-tight">Connect your domain</h1>
//         <p className="text-xl text-muted-foreground max-w-md mx-auto">
//           Set up email authentication in minutes. We'll guide you through every step.
//         </p>
//       </div>

//       {/* What you'll do */}
//       <Card className="p-6 text-left max-w-md mx-auto">
//         <h2 className="font-semibold mb-4 flex items-center gap-2">
//           <Sparkles className="h-4 w-4 text-primary" />
//           What we'll do together
//         </h2>
//         <ul className="space-y-3">
//           {[
//             { icon: Globe, text: "Add your domain name" },
//             { icon: Shield, text: "Set up email authentication (SPF, DKIM, DMARC)" },
//             { icon: CheckCircle2, text: "Verify everything is working" },
//           ].map((item, i) => (
//             <li key={i} className="flex items-center gap-3 text-muted-foreground">
//               <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
//                 <item.icon className="h-4 w-4" />
//               </div>
//               {item.text}
//             </li>
//           ))}
//         </ul>
//       </Card>

//       {/* Time estimate */}
//       <p className="text-sm text-muted-foreground">Takes about 5-10 minutes</p>

//       {/* CTA */}
//       <Button size="lg" onClick={onContinue} className="gap-2 px-8">
//         Get Started
//         <ArrowRight className="h-4 w-4" />
//       </Button>
//     </div>
//   )
// }

// function AddDomainStep({
//   onSubmit,
//   isLoading,
// }: {
//   onSubmit: (domain: string) => void
//   isLoading: boolean
// }) {
//   const [domain, setDomain] = useState("")
//   const [error, setError] = useState("")

//   const validateDomain = (value: string) => {
//     const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i
//     return domainRegex.test(value)
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     const trimmed = domain.trim().toLowerCase()

//     if (!trimmed) {
//       setError("Please enter a domain")
//       return
//     }

//     if (!validateDomain(trimmed)) {
//       setError("Please enter a valid domain (e.g., example.com)")
//       return
//     }

//     setError("")
//     onSubmit(trimmed)
//   }

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="text-center space-y-2">
//         <h1 className="text-3xl font-bold tracking-tight">What's your domain?</h1>
//         <p className="text-muted-foreground">Enter the domain you want to send emails from</p>
//       </div>

//       {/* Form */}
//       <Card className="p-6">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <div className="relative">
//               <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//               <Input
//                 type="text"
//                 placeholder="yourdomain.com"
//                 value={domain}
//                 onChange={(e) => {
//                   setDomain(e.target.value)
//                   setError("")
//                 }}
//                 className={cn("pl-10 h-12 text-lg", error && "border-destructive focus-visible:ring-destructive")}
//                 autoFocus
//               />
//             </div>
//             {error && (
//               <p className="text-sm text-destructive flex items-center gap-1">
//                 <AlertCircle className="h-4 w-4" />
//                 {error}
//               </p>
//             )}
//           </div>

//           <Button type="submit" className="w-full h-12 gap-2" disabled={isLoading}>
//             {isLoading ? (
//               <>
//                 <Spinner/>
//                 Adding domain...
//               </>
//             ) : (
//               <>
//                 Continue
//                 <ArrowRight className="h-4 w-4" />
//               </>
//             )}
//           </Button>
//         </form>
//       </Card>

//       {/* Tip */}
//       <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 text-sm">
//         <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
//         <div className="text-muted-foreground">
//           <strong className="text-foreground">Tip:</strong> For cold email, we recommend using a separate domain (like
//           mail.yourdomain.com) to protect your main domain's reputation.
//         </div>
//       </div>
//     </div>
//   )
// }

// function SelectProviderStep({
//   providers,
//   onSelect,
//   isLoading,
// }: {
//   providers: Provider[]
//   onSelect: (provider: Provider) => void
//   isLoading: boolean
// }) {
//   const [selected, setSelected] = useState<Provider | null>(null)

//   const providerIcons: Record<string, React.ReactNode> = {
//     google: (
//       <svg viewBox="0 0 24 24" className="h-6 w-6">
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
//       <svg viewBox="0 0 24 24" className="h-6 w-6">
//         <path fill="#F25022" d="M1 1h10v10H1z" />
//         <path fill="#00A4EF" d="M1 13h10v10H1z" />
//         <path fill="#7FBA00" d="M13 1h10v10H13z" />
//         <path fill="#FFB900" d="M13 13h10v10H13z" />
//       </svg>
//     ),
//     sendgrid: <Mail className="h-6 w-6 text-blue-500" />,
//     mailgun: <Mail className="h-6 w-6 text-red-500" />,
//     aws: <Mail className="h-6 w-6 text-orange-500" />,
//     zoho: <Mail className="h-6 w-6 text-green-600" />,
//     custom: <Mail className="h-6 w-6 text-muted-foreground" />,
//   }

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="text-center space-y-2">
//         <h1 className="text-3xl font-bold tracking-tight">Choose your email provider</h1>
//         <p className="text-muted-foreground">Select the service you use to send emails</p>
//       </div>

//       {/* Provider grid */}
//       <div className="grid grid-cols-2 gap-3">
//         {providers.map((provider) => (
//           <button
//             key={provider.id}
//             onClick={() => setSelected(provider)}
//             className={cn(
//               "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all",
//               "hover:border-primary/50 hover:bg-muted/50",
//               selected?.id === provider.id ? "border-primary bg-primary/5" : "border-border",
//             )}
//           >
//             <div className="shrink-0">{providerIcons[provider.icon] || providerIcons.custom}</div>
//             <div>
//               <div className="font-medium">{provider.name}</div>
//               <div className="text-xs text-muted-foreground">{provider.estimatedTime}</div>
//             </div>
//             {selected?.id === provider.id && <Check className="h-5 w-5 text-primary ml-auto" />}
//           </button>
//         ))}
//       </div>

//       {/* Continue button */}
//       <Button
//         onClick={() => selected && onSelect(selected)}
//         disabled={!selected || isLoading}
//         className="w-full h-12 gap-2"
//       >
//         {isLoading ? (
//           <>
//             <Spinner />
//             Setting up...
//           </>
//         ) : (
//           <>
//             Continue
//             <ArrowRight className="h-4 w-4" />
//           </>
//         )}
//       </Button>

//       {/* Help text */}
//       <p className="text-center text-sm text-muted-foreground">
//         Not sure? Choose "Custom/Other" and we'll help you figure it out.
//       </p>
//     </div>
//   )
// }

// function DNSRecordStep({
//   title,
//   description,
//   recordType,
//   recordName,
//   recordValue,
//   tip,
//   onCopy,
//   onContinue,
//   onBack,
// }: {
//   title: string
//   description: string
//   recordType: string
//   recordName: string
//   recordValue: string
//   tip?: string
//   onCopy: (text: string, label: string) => void
//   onContinue: () => void
//   onBack: () => void
// }) {
//   const [copied, setCopied] = useState<"name" | "value" | null>(null)

//   const handleCopy = (text: string, label: string, field: "name" | "value") => {
//     onCopy(text, label)
//     setCopied(field)
//     setTimeout(() => setCopied(null), 2000)
//   }

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="text-center space-y-2">
//         <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
//         <p className="text-muted-foreground">{description}</p>
//       </div>

//       {/* Instructions */}
//       <Card className="p-6 space-y-6">
//         <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
//           <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
//           <div className="text-sm">
//             <strong>Go to your domain provider</strong> (like GoDaddy, Namecheap, or Cloudflare), find DNS settings, and
//             add this record:
//           </div>
//         </div>

//         {/* Record fields */}
//         <div className="space-y-4">
//           {/* Type */}
//           <div className="space-y-1.5">
//             <label className="text-sm font-medium text-muted-foreground">Type</label>
//             <div className="flex items-center gap-2 p-3 rounded-lg bg-muted font-mono text-sm">{recordType}</div>
//           </div>

//           {/* Name/Host */}
//           <div className="space-y-1.5">
//             <label className="text-sm font-medium text-muted-foreground">Name / Host</label>
//             <div className="flex items-center gap-2">
//               <div className="flex-1 p-3 rounded-lg bg-muted font-mono text-sm overflow-x-auto">{recordName}</div>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => handleCopy(recordName, "Host", "name")}
//                 className="shrink-0"
//               >
//                 {copied === "name" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
//               </Button>
//             </div>
//             <p className="text-xs text-muted-foreground">Use @ or leave blank for root domain</p>
//           </div>

//           {/* Value */}
//           <div className="space-y-1.5">
//             <label className="text-sm font-medium text-muted-foreground">Value / Content</label>
//             <div className="flex items-start gap-2">
//               <div className="flex-1 p-3 rounded-lg bg-muted font-mono text-sm break-all">{recordValue}</div>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => handleCopy(recordValue, "Value", "value")}
//                 className="shrink-0"
//               >
//                 {copied === "value" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Tip */}
//         {tip && (
//           <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 text-sm">
//             <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
//             <div className="text-muted-foreground">
//               <strong className="text-foreground">Note:</strong> {tip}
//             </div>
//           </div>
//         )}
//       </Card>

//       {/* Actions */}
//       <div className="flex gap-3">
//         <Button variant="outline" onClick={onBack} className="gap-2 bg-transparent">
//           <ArrowLeft className="h-4 w-4" />
//           Back
//         </Button>
//         <Button onClick={onContinue} className="flex-1 gap-2">
//           I've added this record
//           <ArrowRight className="h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   )
// }

// function DKIMSetupStep({
//   provider,
//   domain,
//   onContinue,
//   onBack,
// }: {
//   provider: Provider
//   domain: string
//   onContinue: () => void
//   onBack: () => void
// }) {
//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="text-center space-y-2">
//         <h1 className="text-3xl font-bold tracking-tight">Set up DKIM signing</h1>
//         <p className="text-muted-foreground">This adds a digital signature to verify your emails are authentic</p>
//       </div>

//       {/* Provider-specific instructions */}
//       <Card className="p-6 space-y-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
//               <Mail className="h-5 w-5" />
//             </div>
//             <div>
//               <div className="font-semibold">{provider.name}</div>
//               <div className="text-sm text-muted-foreground">Follow these steps</div>
//             </div>
//           </div>
//           {provider.setupUrl && (
//             <Button variant="outline" size="sm" asChild>
//               <a href={provider.setupUrl} target="_blank" rel="noopener noreferrer">
//                 Open {provider.name}
//                 <ExternalLink className="ml-1.5 h-3 w-3" />
//               </a>
//             </Button>
//           )}
//         </div>

//         <div className="space-y-3">
//           {provider.instructions.map((instruction, index) => (
//             <div key={index} className="flex gap-4">
//               <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0">
//                 {index + 1}
//               </div>
//               <p className="text-sm text-muted-foreground pt-0.5">{instruction}</p>
//             </div>
//           ))}
//         </div>

//         <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm">
//           <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
//           <div className="text-amber-800 dark:text-amber-200">
//             <strong>Important:</strong> Complete the domain authentication in {provider.name} first. The DKIM record is
//             generated by them, not by us.
//           </div>
//         </div>
//       </Card>

//       {/* Actions */}
//       <div className="flex gap-3">
//         <Button variant="outline" onClick={onBack} className="gap-2 bg-transparent">
//           <ArrowLeft className="h-4 w-4" />
//           Back
//         </Button>
//         <Button onClick={onContinue} className="flex-1 gap-2">
//           I've set up DKIM in {provider.name}
//           <ArrowRight className="h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   )
// }

// function VerifyStep({
//   status,
//   isVerifying,
//   onVerify,
//   onBack,
// }: {
//   status: VerificationStatus
//   isVerifying: boolean
//   onVerify: () => void
//   onBack: () => void
// }) {
//   const records = [
//     { key: "spf" as const, label: "SPF", description: "Sender authorization" },
//     { key: "dkim" as const, label: "DKIM", description: "Email signatures" },
//     { key: "dmarc" as const, label: "DMARC", description: "Policy enforcement" },
//   ]

//   const allValid = records.every((r) => status[r.key] === "valid")

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="text-center space-y-2">
//         <h1 className="text-3xl font-bold tracking-tight">Verify your records</h1>
//         <p className="text-muted-foreground">Let's check if your DNS records are set up correctly</p>
//       </div>

//       {/* Status cards */}
//       <Card className="p-6 space-y-4">
//         {records.map((record) => (
//           <div
//             key={record.key}
//             className={cn(
//               "flex items-center justify-between p-4 rounded-lg border",
//               status[record.key] === "valid"
//                 ? "bg-green-500/5 border-green-500/20"
//                 : status[record.key] === "invalid"
//                   ? "bg-red-500/5 border-red-500/20"
//                   : "bg-muted/50 border-border",
//             )}
//           >
//             <div className="flex items-center gap-3">
//               {status[record.key] === "valid" ? (
//                 <CheckCircle2 className="h-5 w-5 text-green-500" />
//               ) : status[record.key] === "invalid" ? (
//                 <AlertCircle className="h-5 w-5 text-red-500" />
//               ) : (
//                 <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
//               )}
//               <div>
//                 <div className="font-medium">{record.label}</div>
//                 <div className="text-sm text-muted-foreground">{record.description}</div>
//               </div>
//             </div>
//             <Badge
//               variant={
//                 status[record.key] === "valid"
//                   ? "default"
//                   : status[record.key] === "invalid"
//                     ? "destructive"
//                     : "secondary"
//               }
//               className={cn(status[record.key] === "valid" && "bg-green-500 hover:bg-green-500/80")}
//             >
//               {status[record.key] === "valid" ? "Verified" : status[record.key] === "invalid" ? "Not found" : "Pending"}
//             </Badge>
//           </div>
//         ))}
//       </Card>

//       {/* Info */}
//       <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 text-sm">
//         <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
//         <div className="text-muted-foreground">
//           <strong className="text-foreground">DNS takes time to update.</strong> Changes can take anywhere from 5
//           minutes to 48 hours to propagate. If verification fails, wait a bit and try again.
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex gap-3">
//         <Button variant="outline" onClick={onBack} className="gap-2 bg-transparent">
//           <ArrowLeft className="h-4 w-4" />
//           Back
//         </Button>
//         <Button
//           onClick={onVerify}
//           disabled={isVerifying}
//           className={cn("flex-1 gap-2", allValid && "bg-green-500 hover:bg-green-600")}
//         >
//           {isVerifying ? (
//             <>
//               <Spinner/>
//               Checking records...
//             </>
//           ) : allValid ? (
//             <>
//               <CheckCircle2 className="h-4 w-4" />
//               All verified! Continue
//             </>
//           ) : (
//             <>
//               <RefreshCw className="h-4 w-4" />
//               Check verification
//             </>
//           )}
//         </Button>
//       </div>
//     </div>
//   )
// }

// function SuccessStep({
//   domain,
//   onAddAnother,
// }: {
//   domain: string
//   onAddAnother: () => void
// }) {
//   return (
//     <div className="text-center space-y-8 celebrate">
//       {/* Success icon */}
//       <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10">
//         <CheckCircle2 className="h-12 w-12 text-green-500" />
//       </div>

//       {/* Message */}
//       <div className="space-y-2">
//         <h1 className="text-3xl font-bold tracking-tight">You're all set!</h1>
//         <p className="text-xl text-muted-foreground">
//           <span className="font-semibold text-foreground">{domain}</span> is ready to send emails
//         </p>
//       </div>

//       {/* What's next */}
//       <Card className="p-6 text-left max-w-md mx-auto">
//         <h2 className="font-semibold mb-4 flex items-center gap-2">
//           <Sparkles className="h-4 w-4 text-primary" />
//           What you can do now
//         </h2>
//         <ul className="space-y-3">
//           {[
//             "Start sending cold emails with confidence",
//             "Your emails are now authenticated and trusted",
//             "Monitor your deliverability in the dashboard",
//           ].map((item, i) => (
//             <li key={i} className="flex items-center gap-3 text-muted-foreground">
//               <Check className="h-4 w-4 text-green-500 shrink-0" />
//               {item}
//             </li>
//           ))}
//         </ul>
//       </Card>

//       {/* Actions */}
//       <div className="flex flex-col sm:flex-row gap-3 justify-center">
//         <Button variant="outline" onClick={onAddAnother} className="gap-2 bg-transparent">
//           Add another domain
//         </Button>
//         <Button className="gap-2" asChild>
//           <a href="/dashboard">
//             Go to Dashboard
//             <ArrowRight className="h-4 w-4" />
//           </a>
//         </Button>
//       </div>
//     </div>
//   )
// }



"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Check,
  Copy,
  ArrowRight,
  ArrowLeft,
  Globe,
  Shield,
  Mail,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  RefreshCw,
  HelpCircle,
  Zap,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { addDomain, verifyDomain, updateDomainProvider, getProviders } from "@/lib/actions/domain-action"

// =============================================================================
// TYPES
// =============================================================================

type WizardStep =
  | "welcome"
  | "add-domain"
  | "select-provider"
  | "setup-spf"
  | "setup-dkim"
  | "setup-dmarc"
  | "verify"
  | "success"

interface DomainData {
  id: string
  domain: string
  providerId: string
  providerName: string
}

interface DNSRecord {
  type: string
  name: string
  value: string
}

interface Provider {
  id: string
  name: string
  icon: string
  dkimSelectors: string[]
  spfInclude: string
  setupUrl: string
  instructions: string[]
  estimatedTime: string
}

interface VerificationStatus {
  spf: "pending" | "valid" | "invalid"
  dkim: "pending" | "valid" | "invalid"
  dmarc: "pending" | "valid" | "invalid"
}

interface DomainSetupWizardProps {
  onDomainAdded?: (domainId: string) => void
  existingDomains?: Array<{ domain: string; id?: string }>
  initialStep?: WizardStep
}

// =============================================================================
// STEP CONFIGURATION
// =============================================================================

const STEPS: { id: WizardStep; label: string; number: number }[] = [
  { id: "add-domain", label: "Add Domain", number: 1 },
  { id: "select-provider", label: "Email Provider", number: 2 },
  { id: "setup-spf", label: "SPF Record", number: 3 },
  { id: "setup-dkim", label: "DKIM Setup", number: 4 },
  { id: "setup-dmarc", label: "DMARC Record", number: 5 },
  { id: "verify", label: "Verify", number: 6 },
]

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function DomainSetupWizard({ 
  onDomainAdded, 
  existingDomains = [],
  initialStep = "welcome" 
}: DomainSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(initialStep)
  const [domainData, setDomainData] = useState<DomainData | null>(null)
  const [providers, setProviders] = useState<Provider[]>([])
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([])
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    spf: "pending",
    dkim: "pending",
    dmarc: "pending",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  // Fetch providers on mount
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

  // Get current step index for progress
  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep)
  const progressPercentage =
    currentStep === "welcome" ? 0 : currentStep === "success" ? 100 : ((currentStepIndex + 1) / STEPS.length) * 100

  // Get SPF, DKIM, DMARC records
  const spfRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "@")
  const dmarcRecord = dnsRecords.find((r) => r.type === "TXT" && r.name === "_dmarc")
  const selectedProvider = providers.find((p) => p.id === domainData?.providerId)

  // =============================================================================
  // HANDLERS
  // =============================================================================

  const handleAddDomain = async (domain: string) => {
    setIsLoading(true)
    try {
      // Check if domain already exists in parent
      if (existingDomains.some((d: { domain: string }) => d.domain.toLowerCase() === domain.toLowerCase())) {
        toast.error(`Domain "${domain}" is already added to your account.`)
        setIsLoading(false)
        return
      }

      const result = await addDomain(domain)
      if (result.success && result.domainId) {
        setDomainData({
          id: result.domainId,
          domain: domain,
          providerId: "",
          providerName: "",
        })
        if (result.dnsRecords?.records) {
          setDnsRecords(result.dnsRecords.records)
        }
        setCurrentStep("select-provider")
        toast.success("Domain added successfully!")
        
        // Notify parent component
        if (onDomainAdded) {
          onDomainAdded(result.domainId)
        }
      } else {
        toast.error(result.error || "Failed to add domain")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectProvider = async (provider: Provider) => {
    if (!domainData) return
    setIsLoading(true)
    try {
      const result = await updateDomainProvider(domainData.id, provider.id)
      if (result.success) {
        setDomainData({
          ...domainData,
          providerId: provider.id,
          providerName: provider.name,
        })
        // Update DNS records from the result
        if (result.dnsRecords?.records) {
          setDnsRecords(result.dnsRecords.records)
        }
        setCurrentStep("setup-spf")
      }
    } catch (error) {
      toast.error("Failed to update provider")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!domainData) return
    setIsVerifying(true)
    try {
      const result = await verifyDomain(domainData.id)
      if (result.success) {
        const newStatus: VerificationStatus = {
          spf: "pending",
          dkim: "pending",
          dmarc: "pending",
        }
        result.results?.forEach((r: { type: string; valid: boolean }) => {
          const type = r.type.toLowerCase() as keyof VerificationStatus
          if (type in newStatus) {
            newStatus[type] = r.valid ? "valid" : "invalid"
          }
        })
        setVerificationStatus(newStatus)

        if (result.verified) {
          setCurrentStep("success")
          toast.success("Your domain is fully verified!")
          
          // Notify parent component of successful verification
          if (domainData?.id && onDomainAdded) {
            onDomainAdded(domainData.id)
          }
        } else {
          toast.info("Some records are still propagating. This can take up to 48 hours.")
        }
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  const goToStep = (step: WizardStep) => {
    setCurrentStep(step)
  }

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with Progress */}
      {currentStep !== "welcome" && currentStep !== "success" && (
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="mx-auto max-w-2xl px-4 py-4">
            {/* Step indicator */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <span className="font-medium">{domainData?.domain || "Domain Setup"}</span>
              </div>
              <Badge variant="secondary" className="font-normal">
                Step {currentStepIndex + 1} of {STEPS.length}
              </Badge>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Step labels */}
            <div className="flex justify-between mt-2">
              {STEPS.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => {
                    // Only allow going back to completed steps
                    if (index < currentStepIndex) {
                      goToStep(step.id)
                    }
                  }}
                  disabled={index >= currentStepIndex}
                  className={cn(
                    "text-xs transition-colors",
                    index < currentStepIndex
                      ? "text-primary cursor-pointer hover:underline"
                      : index === currentStepIndex
                        ? "text-foreground font-medium"
                        : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </button>
              ))}
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Welcome Step */}
          {currentStep === "welcome" && <WelcomeStep onContinue={() => setCurrentStep("add-domain")} />}

          {/* Add Domain Step */}
          {currentStep === "add-domain" && <AddDomainStep onSubmit={handleAddDomain} isLoading={isLoading} />}

          {/* Select Provider Step */}
          {currentStep === "select-provider" && (
            <SelectProviderStep providers={providers} onSelect={handleSelectProvider} isLoading={isLoading} />
          )}

          {/* SPF Setup Step */}
          {currentStep === "setup-spf" && spfRecord && (
            <DNSRecordStep
              title="Add your SPF record"
              description="This tells email servers that you're allowed to send emails from your domain."
              recordType="TXT"
              recordName="@"
              recordValue={spfRecord.value}
              tip="If you already have an SPF record, add our include statement to it instead of replacing it."
              onCopy={copyToClipboard}
              onContinue={() => setCurrentStep("setup-dkim")}
              onBack={() => setCurrentStep("select-provider")}
            />
          )}

          {/* DKIM Setup Step */}
          {currentStep === "setup-dkim" && selectedProvider && (
            <DKIMSetupStep
              provider={selectedProvider}
              domain={domainData?.domain || ""}
              onContinue={() => setCurrentStep("setup-dmarc")}
              onBack={() => setCurrentStep("setup-spf")}
            />
          )}

          {/* DMARC Setup Step */}
          {currentStep === "setup-dmarc" && dmarcRecord && (
            <DNSRecordStep
              title="Add your DMARC record"
              description="This protects your domain from being used in phishing attacks."
              recordType="TXT"
              recordName="_dmarc"
              recordValue={dmarcRecord.value}
              tip="Start with a 'none' policy to monitor emails, then switch to 'quarantine' or 'reject' later."
              onCopy={copyToClipboard}
              onContinue={() => setCurrentStep("verify")}
              onBack={() => setCurrentStep("setup-dkim")}
            />
          )}

          {/* Verify Step */}
          {currentStep === "verify" && (
            <VerifyStep
              status={verificationStatus}
              isVerifying={isVerifying}
              onVerify={handleVerify}
              onBack={() => setCurrentStep("setup-dmarc")}
            />
          )}

          {/* Success Step */}
          {currentStep === "success" && (
            <SuccessStep
              domain={domainData?.domain || ""}
              onAddAnother={() => {
                setDomainData(null)
                setDnsRecords([])
                setVerificationStatus({ spf: "pending", dkim: "pending", dmarc: "pending" })
                setCurrentStep("add-domain")
              }}
            />
          )}
        </div>
      </main>
    </div>
  )
}

// =============================================================================
// STEP COMPONENTS
// =============================================================================

function WelcomeStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="text-center space-y-8">
      {/* Hero */}
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-4">
          <Mail className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Connect your domain</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Set up email authentication in minutes. We'll guide you through every step.
        </p>
      </div>

      {/* What you'll do */}
      <Card className="p-6 text-left max-w-md mx-auto">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          What we'll do together
        </h2>
        <ul className="space-y-3">
          {[
            { icon: Globe, text: "Add your domain name" },
            { icon: Shield, text: "Set up email authentication (SPF, DKIM, DMARC)" },
            { icon: CheckCircle2, text: "Verify everything is working" },
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-muted-foreground">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                <item.icon className="h-4 w-4" />
              </div>
              {item.text}
            </li>
          ))}
        </ul>
      </Card>

      {/* Time estimate */}
      <p className="text-sm text-muted-foreground">Takes about 5-10 minutes</p>

      {/* CTA */}
      <Button size="lg" onClick={onContinue} className="gap-2 px-8">
        Get Started
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

function AddDomainStep({
  onSubmit,
  isLoading,
}: {
  onSubmit: (domain: string) => void
  isLoading: boolean
}) {
  const [domain, setDomain] = useState("")
  const [error, setError] = useState("")

  const validateDomain = (value: string) => {
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i
    return domainRegex.test(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = domain.trim().toLowerCase()

    if (!trimmed) {
      setError("Please enter a domain")
      return
    }

    if (!validateDomain(trimmed)) {
      setError("Please enter a valid domain (e.g., example.com)")
      return
    }

    setError("")
    onSubmit(trimmed)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">What's your domain?</h1>
        <p className="text-muted-foreground">Enter the domain you want to send emails from</p>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="yourdomain.com"
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value)
                  setError("")
                }}
                className={cn("pl-10 h-12 text-lg", error && "border-destructive focus-visible:ring-destructive")}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full h-12 gap-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner />
                Adding domain...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Tip */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 text-sm">
        <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="text-muted-foreground">
          <strong className="text-foreground">Tip:</strong> For cold email, we recommend using a separate domain (like
          mail.yourdomain.com) to protect your main domain's reputation.
        </div>
      </div>
    </div>
  )
}

function SelectProviderStep({
  providers,
  onSelect,
  isLoading,
}: {
  providers: Provider[]
  onSelect: (provider: Provider) => void
  isLoading: boolean
}) {
  const [selected, setSelected] = useState<Provider | null>(null)

  const providerIcons: Record<string, React.ReactNode> = {
    google: (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
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
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path fill="#F25022" d="M1 1h10v10H1z" />
        <path fill="#00A4EF" d="M1 13h10v10H1z" />
        <path fill="#7FBA00" d="M13 1h10v10H13z" />
        <path fill="#FFB900" d="M13 13h10v10H13z" />
      </svg>
    ),
    sendgrid: <Mail className="h-6 w-6 text-blue-500" />,
    mailgun: <Mail className="h-6 w-6 text-red-500" />,
    aws: <Mail className="h-6 w-6 text-orange-500" />,
    zoho: <Mail className="h-6 w-6 text-green-600" />,
    custom: <Mail className="h-6 w-6 text-muted-foreground" />,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Choose your email provider</h1>
        <p className="text-muted-foreground">Select the service you use to send emails</p>
      </div>

      {/* Provider grid */}
      <div className="grid grid-cols-2 gap-3">
        {providers.map((provider) => (
          <button
            key={provider.id}
            onClick={() => setSelected(provider)}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all",
              "hover:border-primary/50 hover:bg-muted/50",
              selected?.id === provider.id ? "border-primary bg-primary/5" : "border-border",
            )}
          >
            <div className="shrink-0">{providerIcons[provider.icon] || providerIcons.custom}</div>
            <div>
              <div className="font-medium">{provider.name}</div>
              <div className="text-xs text-muted-foreground">{provider.estimatedTime}</div>
            </div>
            {selected?.id === provider.id && <Check className="h-5 w-5 text-primary ml-auto" />}
          </button>
        ))}
      </div>

      {/* Continue button */}
      <Button
        onClick={() => selected && onSelect(selected)}
        disabled={!selected || isLoading}
        className="w-full h-12 gap-2"
      >
        {isLoading ? (
          <>
            <Spinner  />
            Setting up...
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      {/* Help text */}
      <p className="text-center text-sm text-muted-foreground">
        Not sure? Choose "Custom/Other" and we'll help you figure it out.
      </p>
    </div>
  )
}

function DNSRecordStep({
  title,
  description,
  recordType,
  recordName,
  recordValue,
  tip,
  onCopy,
  onContinue,
  onBack,
}: {
  title: string
  description: string
  recordType: string
  recordName: string
  recordValue: string
  tip?: string
  onCopy: (text: string, label: string) => void
  onContinue: () => void
  onBack: () => void
}) {
  const [copied, setCopied] = useState<"name" | "value" | null>(null)

  const handleCopy = (text: string, label: string, field: "name" | "value") => {
    onCopy(text, label)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Instructions */}
      <Card className="p-6 space-y-6">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <strong>Go to your domain provider</strong> (like GoDaddy, Namecheap, or Cloudflare), find DNS settings, and
            add this record:
          </div>
        </div>

        {/* Record fields */}
        <div className="space-y-4">
          {/* Type */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Type</label>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted font-mono text-sm">{recordType}</div>
          </div>

          {/* Name/Host */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Name / Host</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 rounded-lg bg-muted font-mono text-sm overflow-x-auto">{recordName}</div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(recordName, "Host", "name")}
                className="shrink-0"
              >
                {copied === "name" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Use @ or leave blank for root domain</p>
          </div>

          {/* Value */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Value / Content</label>
            <div className="flex items-start gap-2">
              <div className="flex-1 p-3 rounded-lg bg-muted font-mono text-sm break-all">{recordValue}</div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(recordValue, "Value", "value")}
                className="shrink-0"
              >
                {copied === "value" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Tip */}
        {tip && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 text-sm">
            <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-muted-foreground">
              <strong className="text-foreground">Note:</strong> {tip}
            </div>
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="gap-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={onContinue} className="flex-1 gap-2">
          I've added this record
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}


function DKIMSetupStep({
  provider,
  domain,
  onContinue,
  onBack,
}: {
  provider: Provider
  domain: string
  onContinue: () => void
  onBack: () => void
}) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Set up DKIM signing</h1>
        <p className="text-muted-foreground">This adds a digital signature to verify your emails are authentic</p>
      </div>

      {/* Provider-specific instructions */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">{provider.name}</div>
              <div className="text-sm text-muted-foreground">Follow these steps</div>
            </div>
          </div>
          {provider.setupUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={provider.setupUrl} target="_blank" rel="noopener noreferrer">
                Open {provider.name}
                <ExternalLink className="ml-1.5 h-3 w-3" />
              </a>
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {provider.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0">
                {index + 1}
              </div>
              <p className="text-sm text-muted-foreground pt-0.5">{instruction}</p>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-amber-800 dark:text-amber-200">
            <strong>Important:</strong> Complete the domain authentication in {provider.name} first. The DKIM record is
            generated by them, not by us.
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="gap-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={onContinue} className="flex-1 gap-2">
          I've set up DKIM in {provider.name}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function VerifyStep({
  status,
  isVerifying,
  onVerify,
  onBack,
}: {
  status: VerificationStatus
  isVerifying: boolean
  onVerify: () => void
  onBack: () => void
}) {
  const records = [
    { key: "spf" as const, label: "SPF", description: "Sender authorization" },
    { key: "dkim" as const, label: "DKIM", description: "Email signatures" },
    { key: "dmarc" as const, label: "DMARC", description: "Policy enforcement" },
  ]

  const allValid = records.every((r) => status[r.key] === "valid")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Verify your records</h1>
        <p className="text-muted-foreground">Let's check if your DNS records are set up correctly</p>
      </div>

      {/* Status cards */}
      <Card className="p-6 space-y-4">
        {records.map((record) => (
          <div
            key={record.key}
            className={cn(
              "flex items-center justify-between p-4 rounded-lg border",
              status[record.key] === "valid"
                ? "bg-green-500/5 border-green-500/20"
                : status[record.key] === "invalid"
                  ? "bg-red-500/5 border-red-500/20"
                  : "bg-muted/50 border-border",
            )}
          >
            <div className="flex items-center gap-3">
              {status[record.key] === "valid" ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : status[record.key] === "invalid" ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
              )}
              <div>
                <div className="font-medium">{record.label}</div>
                <div className="text-sm text-muted-foreground">{record.description}</div>
              </div>
            </div>
            <Badge
              variant={
                status[record.key] === "valid"
                  ? "default"
                  : status[record.key] === "invalid"
                    ? "destructive"
                    : "secondary"
              }
              className={cn(status[record.key] === "valid" && "bg-green-500 hover:bg-green-500/80")}
            >
              {status[record.key] === "valid" ? "Verified" : status[record.key] === "invalid" ? "Not found" : "Pending"}
            </Badge>
          </div>
        ))}
      </Card>

      {/* Info */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 text-sm">
        <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="text-muted-foreground">
          <strong className="text-foreground">DNS takes time to update.</strong> Changes can take anywhere from 5
          minutes to 48 hours to propagate. If verification fails, wait a bit and try again.
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="gap-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={onVerify}
          disabled={isVerifying}
          className={cn("flex-1 gap-2", allValid && "bg-green-500 hover:bg-green-600")}
        >
          {isVerifying ? (
            <>
              <Spinner/>
              Checking records...
            </>
          ) : allValid ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              All verified! Continue
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Check verification
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function SuccessStep({
  domain,
  onAddAnother,
}: {
  domain: string
  onAddAnother: () => void
}) {
  return (
    <div className="text-center space-y-8 celebrate">
      {/* Success icon */}
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">You're all set!</h1>
        <p className="text-xl text-muted-foreground">
          <span className="font-semibold text-foreground">{domain}</span> is ready to send emails
        </p>
      </div>

      {/* What's next */}
      <Card className="p-6 text-left max-w-md mx-auto">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          What you can do now
        </h2>
        <ul className="space-y-3">
          {[
            "Start sending cold emails with confidence",
            "Your emails are now authenticated and trusted",
            "Monitor your deliverability in the dashboard",
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-muted-foreground">
              <Check className="h-4 w-4 text-green-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" onClick={onAddAnother} className="gap-2 bg-transparent">
          Add another domain
        </Button>
        <Button className="gap-2" asChild>
          <a href="/dashboard">
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}
