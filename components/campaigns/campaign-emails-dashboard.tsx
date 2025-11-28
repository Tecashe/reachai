"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Search,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MousePointerClick,
  Reply,
  AlertCircle,
  Calendar,
  User,
  FileText,
  ExternalLink,
  Filter,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { SentEmailPreviewDialog } from "./sent-email-preview-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CampaignEmailsDashboardProps {
  campaignId: string
}

export function CampaignEmailsDashboard({ campaignId }: CampaignEmailsDashboardProps) {
  const [emails, setEmails] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  useEffect(() => {
    const fetchEmails = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/campaigns/${campaignId}/emails`)
        const data = await response.json()
        setEmails(data.emails || [])
      } catch (error) {
        console.error("[v0] Failed to fetch campaign emails:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmails()
  }, [campaignId])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      QUEUED: { variant: "secondary", icon: Clock, label: "Queued" },
      SENDING: { variant: "default", icon: Mail, label: "Sending" },
      SENT: { variant: "default", icon: CheckCircle2, label: "Sent" },
      DELIVERED: { variant: "default", icon: CheckCircle2, label: "Delivered" },
      OPENED: { variant: "default", icon: Eye, label: "Opened" },
      CLICKED: { variant: "default", icon: MousePointerClick, label: "Clicked" },
      REPLIED: { variant: "default", icon: Reply, label: "Replied" },
      BOUNCED: { variant: "destructive", icon: XCircle, label: "Bounced" },
      FAILED: { variant: "destructive", icon: AlertCircle, label: "Failed" },
    }

    const config = variants[status] || variants.QUEUED
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.toEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.prospect?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.prospect?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === "all" || email.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: emails.length,
    queued: emails.filter((e) => e.status === "QUEUED").length,
    sent: emails.filter((e) => ["SENT", "DELIVERED", "OPENED", "CLICKED", "REPLIED"].includes(e.status)).length,
    opened: emails.filter((e) => ["OPENED", "CLICKED", "REPLIED"].includes(e.status)).length,
    clicked: emails.filter((e) => ["CLICKED", "REPLIED"].includes(e.status)).length,
    replied: emails.filter((e) => e.status === "REPLIED").length,
    bounced: emails.filter((e) => e.status === "BOUNCED").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Queued</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.queued}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Sent</p>
            <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Opened</p>
            <p className="text-2xl font-bold text-green-600">{stats.opened}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Clicked</p>
            <p className="text-2xl font-bold text-purple-600">{stats.clicked}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Replied</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.replied}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Bounced</p>
            <p className="text-2xl font-bold text-red-600">{stats.bounced}</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by recipient, subject, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="QUEUED">Queued</SelectItem>
            <SelectItem value="SENT">Sent</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="OPENED">Opened</SelectItem>
            <SelectItem value="CLICKED">Clicked</SelectItem>
            <SelectItem value="REPLIED">Replied</SelectItem>
            <SelectItem value="BOUNCED">Bounced</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Emails List */}
      <Card>
        <ScrollArea className="h-[600px]">
          <div className="divide-y">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading emails...</div>
            ) : filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No emails found matching your criteria</div>
            ) : (
              filteredEmails.map((email) => (
                <div
                  key={email.id}
                  className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedEmail(email)
                    setPreviewOpen(true)
                  }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Recipient Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <p className="font-medium truncate">
                          {email.prospect?.firstName} {email.prospect?.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">{email.toEmail}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-3 w-3 flex-shrink-0" />
                        <p className="truncate">{email.subject}</p>
                      </div>
                    </div>

                    {/* Status & Time */}
                    <div className="flex flex-wrap items-center gap-3">
                      {getStatusBadge(email.status)}

                      {/* Engagement Metrics */}
                      {email.opens > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <Eye className="h-3 w-3 text-green-600" />
                          <span className="text-muted-foreground">{email.opens}</span>
                        </div>
                      )}
                      {email.clicks > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <MousePointerClick className="h-3 w-3 text-purple-600" />
                          <span className="text-muted-foreground">{email.clicks}</span>
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {email.sentAt ? (
                          <span>Sent {formatDistanceToNow(new Date(email.sentAt), { addSuffix: true })}</span>
                        ) : email.scheduledAt ? (
                          <span>Scheduled {formatDistanceToNow(new Date(email.scheduledAt), { addSuffix: true })}</span>
                        ) : (
                          <span>Queued</span>
                        )}
                      </div>

                      {/* Preview Button */}
                      <Button variant="ghost" size="sm" className="gap-1">
                        <ExternalLink className="h-3 w-3" />
                        View
                      </Button>
                    </div>
                  </div>

                  {/* Company Info */}
                  {email.prospect?.company && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {email.prospect.company}
                      {email.prospect.jobTitle && ` • ${email.prospect.jobTitle}`}
                    </div>
                  )}

                  {/* Error Message */}
                  {email.errorMessage && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      {email.errorMessage}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Email Preview Dialog */}
      {selectedEmail && (
        <SentEmailPreviewDialog open={previewOpen} onOpenChange={setPreviewOpen} email={selectedEmail} />
      )}
    </div>
  )
}
