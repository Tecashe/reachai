"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertCircle, Copy, Plus, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DnsRecord {
  type: string
  name: string
  value: string
  status: "verified" | "pending" | "failed"
}

export function DomainVerification() {
  const [domain, setDomain] = useState("")
  const [domains, setDomains] = useState<
    Array<{
      domain: string
      verified: boolean
      dnsRecords: DnsRecord[]
    }>
  >([])
  const [isVerifying, setIsVerifying] = useState(false)
  const { toast } = useToast()

  const addDomain = async () => {
    if (!domain) return

    const dnsRecords: DnsRecord[] = [
      {
        type: "TXT",
        name: `_reachai-verification.${domain}`,
        value: `reachai-verification=${Math.random().toString(36).substring(7)}`,
        status: "pending",
      },
      {
        type: "TXT",
        name: domain,
        value: "v=spf1 include:reachai.io ~all",
        status: "pending",
      },
      {
        type: "TXT",
        name: `_dmarc.${domain}`,
        value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@reachai.io",
        status: "pending",
      },
      {
        type: "CNAME",
        name: `reachai._domainkey.${domain}`,
        value: "dkim.reachai.io",
        status: "pending",
      },
    ]

    setDomains([...domains, { domain, verified: false, dnsRecords }])
    setDomain("")

    toast({
      title: "Domain added",
      description: "Add the DNS records below to verify your domain",
    })
  }

  const verifyDomain = async (domainToVerify: string) => {
    setIsVerifying(true)

    // Simulate DNS verification
    setTimeout(() => {
      setDomains(
        domains.map((d) => {
          if (d.domain === domainToVerify) {
            return {
              ...d,
              verified: true,
              dnsRecords: d.dnsRecords.map((record) => ({
                ...record,
                status: "verified" as const,
              })),
            }
          }
          return d
        }),
      )

      toast({
        title: "Domain verified",
        description: `${domainToVerify} is now ready to send emails`,
      })

      setIsVerifying(false)
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "DNS record copied to clipboard",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Domain Verification</CardTitle>
          <CardDescription>
            Add and verify your domains for sending emails. Proper DNS configuration ensures maximum deliverability.
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
              />
            </div>
            <Button onClick={addDomain} className="mt-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Domain
            </Button>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              After adding DNS records, it may take up to 48 hours for changes to propagate. Click "Verify" to check
              status.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {domains.map((d) => (
        <Card key={d.domain}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {d.domain}
                  {d.verified ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {d.verified
                    ? "Your domain is verified and ready to send emails"
                    : "Add these DNS records to your domain provider"}
                </CardDescription>
              </div>
              <Button onClick={() => verifyDomain(d.domain)} disabled={isVerifying || d.verified}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isVerifying ? "animate-spin" : ""}`} />
                {d.verified ? "Verified" : "Verify Domain"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">DNS Records</h4>
                <div className="space-y-2">
                  {d.dnsRecords.map((record, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{record.type}</Badge>
                          {record.status === "verified" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          {record.status === "pending" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                          {record.status === "failed" && <XCircle className="h-4 w-4 text-red-500" />}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(record.value)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Name:</span>
                          <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">{record.name}</code>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Value:</span>
                          <code className="ml-2 bg-muted px-2 py-1 rounded text-xs break-all">{record.value}</code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Alert>
                <AlertDescription className="text-xs">
                  <strong>What these records do:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      <strong>SPF (TXT):</strong> Authorizes ReachAI to send emails on your behalf
                    </li>
                    <li>
                      <strong>DKIM (CNAME):</strong> Adds a digital signature to verify email authenticity
                    </li>
                    <li>
                      <strong>DMARC (TXT):</strong> Tells receiving servers how to handle unauthenticated emails
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
