

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
import { WaveLoader } from "../loader/wave-loader"

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
        const domainId = result.domainId
        const dnsRecords = result.dnsRecords.records
        const dkimSelector = result.dnsRecords.selector || "default"
        
        setState((prev) => ({
          ...prev,
          domainId,
          dnsRecords,
          dkimSelector,
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
                {loading && <WaveLoader size="sm" bars={8} gap="tight" />}
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
                {loading && <WaveLoader size="sm" bars={8} gap="tight" />}
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
          {loading ? <WaveLoader size="sm" bars={8} gap="tight" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
          Verify {title}
        </Button>
      </CardFooter>
    </Card>
  )
}
