"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shield, UserX, Download, Upload, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SuppressedEmail {
  email: string
  reason: string
  date: string
}

export function ComplianceDashboard() {
  const [suppressedEmails, setSuppressedEmails] = useState<SuppressedEmail[]>([
    { email: "john@example.com", reason: "Unsubscribed", date: "2024-01-15" },
    { email: "jane@example.com", reason: "Bounced", date: "2024-01-14" },
    { email: "bob@example.com", reason: "Spam Complaint", date: "2024-01-13" },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const filteredEmails = suppressedEmails.filter((item) => item.email.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleExport = () => {
    const csv = ["Email,Reason,Date", ...suppressedEmails.map((e) => `${e.email},${e.reason},${e.date}`)].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "suppression-list.csv"
    a.click()

    toast({
      title: "Export complete",
      description: "Suppression list downloaded successfully",
    })
  }

  const handleImport = () => {
    toast({
      title: "Import feature",
      description: "Upload a CSV file to bulk import suppressed emails",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Dashboard
          </CardTitle>
          <CardDescription>Manage suppression list and ensure GDPR/CAN-SPAM compliance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <UserX className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-2xl font-bold">{suppressedEmails.length}</p>
                  <p className="text-sm text-muted-foreground">Suppressed Emails</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <Shield className="h-8 w-8 mx-auto text-green-500" />
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-sm text-muted-foreground">Compliance Rate</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <UserX className="h-8 w-8 mx-auto text-amber-500" />
                  <p className="text-2xl font-bold">
                    {suppressedEmails.filter((e) => e.reason === "Unsubscribed").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Unsubscribes</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppressed emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>

          <div className="border rounded-lg">
            <div className="grid grid-cols-3 gap-4 p-3 border-b bg-muted/50 font-medium text-sm">
              <div>Email</div>
              <div>Reason</div>
              <div>Date</div>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {filteredEmails.map((item, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 p-3 text-sm">
                  <div className="font-mono">{item.email}</div>
                  <div>
                    <Badge
                      variant={
                        item.reason === "Spam Complaint"
                          ? "destructive"
                          : item.reason === "Bounced"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {item.reason}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground">{item.date}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
