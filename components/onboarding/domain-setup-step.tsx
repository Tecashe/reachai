"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Copy, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { dnsVerificationService } from "@/lib/services/dns-verification"
import { WaveLoader } from "../loader/wave-loader"

interface DomainSetupStepProps {
  onComplete: (domain: string) => void
  onBack: () => void
}

export function DomainSetupStep({ onComplete, onBack }: DomainSetupStepProps) {
  const [step, setStep] = useState<"input" | "records" | "verify">("input")
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState<any>(null)
  const [verified, setVerified] = useState(false)

  const handleAddDomain = async () => {
    if (!domain) {
      toast.error("Please enter a domain")
      return
    }

    setLoading(true)
    try {
      // CHANGE: Generate DNS records for the domain
      const dnsRecords = dnsVerificationService.generateDNSRecords(domain)
      setRecords(dnsRecords)
      setStep("records")
    } catch (error) {
      toast.error("Failed to generate DNS records")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setLoading(true)
    try {
      // CHANGE: Verify DNS records
      const result = await dnsVerificationService.verifyDNSRecords(domain)

      if (result.overallValid) {
        setVerified(true)
        setStep("verify")
        toast.success("Domain verified successfully!")
      } else {
        toast.error(
          `DNS verification incomplete. Issues: ${result.spf.issues.concat(result.dkim.issues, result.dmarc.issues).join(", ")}`,
        )
      }
    } catch (error) {
      toast.error("Verification failed. Please check your DNS records and try again.")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value)
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {step === "input" && (
        <>
          <div className="space-y-2">
            <Label className="text-base">Add Your Sending Domain</Label>
            <p className="text-sm text-muted-foreground">
              Use a subdomain like mail.yourcompany.com to keep your main domain reputation intact
            </p>
            <Input
              placeholder="mail.yourcompany.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="text-base h-12"
              autoFocus
            />
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Why a subdomain?</AlertTitle>
            <AlertDescription>
              If your cold email domain gets a reputation issue, your main business email stays protected.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1 h-12 bg-transparent">
              Back
            </Button>
            <Button onClick={handleAddDomain} className="flex-1 h-12" disabled={!domain || loading}>
              {loading ? (
                <>
                  {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
                  <WaveLoader size="sm" bars={8} gap="tight" />
                  Generating...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </>
      )}

      {step === "records" && records && (
        <>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Add These DNS Records to {domain}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Go to your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.) and add these records:
              </p>
            </div>

            {records.map((record: any, idx: number) => (
              <Card key={idx} className="bg-muted/30">
                <CardContent className="pt-6 space-y-3">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground">Record Type</Label>
                    <div className="text-base font-mono">{record.type}</div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground">Name</Label>
                    <div className="flex items-center justify-between">
                      <div className="text-base font-mono break-all">{record.name}</div>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(record.name)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground">Value</Label>
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-mono break-all bg-background p-2 rounded flex-1">{record.value}</div>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(record.value)} className="mt-2">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground">TTL</Label>
                    <div className="text-base">{record.ttl} seconds</div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>DNS propagation takes time</AlertTitle>
              <AlertDescription>
                After adding these records, wait 5-30 minutes for DNS to propagate globally.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("input")} className="flex-1 h-12">
                Back
              </Button>
              <Button onClick={handleVerify} className="flex-1 h-12" disabled={loading}>
                {loading ? (
                  <>
                    {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
                    <WaveLoader size="sm" bars={8} gap="tight" />
                    Verifying...
                  </>
                ) : (
                  "I've Added These Records"
                )}
              </Button>
            </div>
          </div>
        </>
      )}

      {step === "verify" && verified && (
        <>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Domain Verified!</h3>
              <p className="text-sm text-muted-foreground mt-2">Your domain {domain} is ready for sending emails.</p>
            </div>

            <Alert className="bg-green-50 border-green-200">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">Email Deliverability Enabled</AlertTitle>
              <AlertDescription className="text-green-800">
                Your emails will now have maximum inbox placement rate with SPF, DKIM, and DMARC authentication.
              </AlertDescription>
            </Alert>

            <Button onClick={() => onComplete(domain)} className="w-full h-12">
              Next Step
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
