"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

export function EmailAuthStatus() {
  const [domains, setDomains] = useState<any[]>([])

  return (
    <div className="space-y-4">
      {domains.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No domains added yet. Add a domain in the Domain Setup tab to get started.
        </p>
      ) : (
        domains.map((domain) => (
          <Card key={domain.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{domain.domain}</h3>
                <Badge variant={domain.isVerified ? "default" : "secondary"}>
                  {domain.isVerified ? "Verified" : "Pending"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">SPF</p>
                  <div className="flex items-center gap-2">
                    {domain.spfStatus === "VALID" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm text-muted-foreground">{domain.spfStatus || "Not configured"}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">DKIM</p>
                  <div className="flex items-center gap-2">
                    {domain.dkimStatus === "VALID" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm text-muted-foreground">{domain.dkimStatus || "Not configured"}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">DMARC</p>
                  <div className="flex items-center gap-2">
                    {domain.dmarcStatus === "VALID" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm text-muted-foreground">{domain.dmarcStatus || "Not configured"}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">MX</p>
                  <div className="flex items-center gap-2">
                    {domain.mxStatus === "VALID" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm text-muted-foreground">{domain.mxStatus || "Optional"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
