"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2 } from "lucide-react"
import { addDomain } from "@/lib/actions/domain-action"
import { toast } from "sonner"

export function DomainSetupWizard() {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleAddDomain = async () => {
    if (!domain) {
      toast.error("Please enter a domain name")
      return
    }

    setLoading(true)
    try {
      const response = await addDomain(domain)

      if (response.success) {
        setResult(response)
        toast.success("Domain added successfully!")
      } else {
        // toast.error(response.error || "Failed to add domain")
         toast.error("Failed to add domain")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="domain">Domain Name</Label>
          <div className="flex gap-2">
            <Input
              id="domain"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              disabled={loading}
            />
            <Button onClick={handleAddDomain} disabled={loading || !domain}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Domain
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Enter your domain without http:// or www (e.g., example.com)</p>
        </div>

        {result && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Domain added! Next, configure your DNS records in the DNS Configuration tab.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
