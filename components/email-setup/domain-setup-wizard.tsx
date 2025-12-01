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

"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { CheckCircle2, XCircle, AlertCircle, Globe, ArrowRight, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { addDomain } from "@/lib/actions/domain-action"
import { cn } from "@/lib/utils"

interface DomainStatus {
  id: string
  domain: string
  isVerified: boolean
}

interface DomainSetupWizardProps {
  onDomainAdded: (domainId: string) => void
  existingDomains: DomainStatus[]
}

// Domain validation regex
const DOMAIN_REGEX = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i

export function DomainSetupWizard({ onDomainAdded, existingDomains }: DomainSetupWizardProps) {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [validationState, setValidationState] = useState<"idle" | "valid" | "invalid" | "duplicate">("idle")
  const [validationMessage, setValidationMessage] = useState("")

  // Validate domain input
  const validateDomain = useCallback(
    (value: string) => {
      const normalized = value
        .trim()
        .toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/, "")
        .split("/")[0]

      if (!normalized) {
        setValidationState("idle")
        setValidationMessage("")
        return
      }

      // Check for duplicates
      if (existingDomains.some((d) => d.domain === normalized)) {
        setValidationState("duplicate")
        setValidationMessage("This domain is already added to your account.")
        return
      }

      // Validate format
      if (!DOMAIN_REGEX.test(normalized)) {
        setValidationState("invalid")
        setValidationMessage("Please enter a valid domain (e.g., example.com)")
        return
      }

      setValidationState("valid")
      setValidationMessage("Domain format looks good!")
    },
    [existingDomains],
  )

  const handleDomainChange = (value: string) => {
    setDomain(value)
    validateDomain(value)
  }

  const handleAddDomain = async () => {
    if (!domain || validationState !== "valid") {
      toast.error("Please enter a valid domain")
      return
    }

    setLoading(true)
    try {
      const normalizedDomain = domain
        .trim()
        .toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/, "")
        .split("/")[0]
      const result = await addDomain(normalizedDomain)

      if (result.success) {
        toast.success("Domain added successfully!")
        setDomain("")
        setValidationState("idle")
        onDomainAdded(result.domainId||"")
      } else {
        toast.error(result.error || "Failed to add domain")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && validationState === "valid" && !loading) {
      handleAddDomain()
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Add Domain Card */}
      <Card className="relative overflow-hidden">
        {/* Subtle gradient */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <CardHeader className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-4 w-4 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Step 1
            </Badge>
          </div>
          <CardTitle>Add Your Domain</CardTitle>
          <CardDescription>Enter the domain you want to use for sending cold emails.</CardDescription>
        </CardHeader>

        <CardContent className="relative space-y-4">
          <Field>
            <FieldLabel htmlFor="domain-input">Domain Name</FieldLabel>
            <InputGroup
              className={cn(
                validationState === "valid" && "ring-2 ring-green-500/20",
                (validationState === "invalid" || validationState === "duplicate") && "ring-2 ring-red-500/20",
              )}
            >
              <InputGroupText className="text-muted-foreground">https://</InputGroupText>
              <InputGroupInput
                id="domain-input"
                placeholder="yourdomain.com"
                value={domain}
                onChange={(e) => handleDomainChange(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                aria-describedby="domain-hint"
                aria-invalid={validationState === "invalid" || validationState === "duplicate"}
              />
            </InputGroup>

            {/* Validation feedback */}
            {validationState !== "idle" && (
              <div
                className={cn(
                  "flex items-center gap-2 text-sm mt-2",
                  validationState === "valid" && "text-green-600",
                  (validationState === "invalid" || validationState === "duplicate") && "text-red-600",
                )}
              >
                {validationState === "valid" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {validationMessage}
              </div>
            )}

            <FieldDescription id="domain-hint">
              Enter without http://, https://, or www. Just the domain name.
            </FieldDescription>
          </Field>

          <Button
            onClick={handleAddDomain}
            disabled={loading || validationState !== "valid"}
            className="w-full gap-2"
            size="lg"
          >
            {loading ? (
              <>
                <Spinner />
                Adding Domain...
              </>
            ) : (
              <>
                Add Domain
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Pro Tips</CardTitle>
          </div>
          <CardDescription>Best practices for cold email domains</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <TipItem
              title="Use a separate domain"
              description="Don't use your main business domain for cold outreach. Create a similar domain (e.g., getacme.com instead of acme.com)."
            />
            <TipItem
              title="Warm up new domains"
              description="New domains need 2-4 weeks of gradual sending increase before full-scale outreach."
            />
            <TipItem
              title="Multiple domains scale better"
              description="Use 2-3 sending accounts per domain, and multiple domains for higher volume."
            />
          </div>

          <Alert className="border-blue-500/20 bg-blue-500/5">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-600">What happens next?</AlertTitle>
            <AlertDescription className="text-blue-600/80">
              After adding your domain, you'll configure SPF, DKIM, and DMARC records to authenticate your emails and
              maximize deliverability.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Examples */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Domain Format Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Correct Format
              </p>
              <div className="space-y-1.5">
                {["yourbusiness.com", "outreach.company.io", "mail.startup.co"].map((example) => (
                  <code key={example} className="block rounded bg-green-500/10 px-3 py-1.5 text-sm text-green-700">
                    {example}
                  </code>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-red-600 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Incorrect Format
              </p>
              <div className="space-y-1.5">
                {["https://www.yourbusiness.com", "www.company.io", "mail.startup.co/page"].map((example) => (
                  <code key={example} className="block rounded bg-red-500/10 px-3 py-1.5 text-sm text-red-700">
                    {example}
                  </code>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TipItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
        ✓
      </div>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  )
}
