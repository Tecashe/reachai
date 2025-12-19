
"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Mail,
  Phone,
  Search,
  Filter,
  MoreHorizontal,
  Flame,
  Snowflake,
  Sun,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface Lead {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  company: string | null
  jobTitle: string | null
  dealScore: number | null
  status: string
  phoneNumber: string | null
  crmSyncedAt: Date | null
  replied: boolean
}

type ScoreFilter = "all" | "hot" | "warm" | "cold"

const statusConfig = {
  hot: {
    icon: Flame,
    className: "bg-foreground/10 text-foreground border-foreground/20",
    label: "HOT",
  },
  warm: {
    icon: Sun,
    className: "bg-foreground/10 text-foreground border-foreground/20",
    label: "WARM",
  },
  cold: {
    icon: Snowflake,
    className: "bg-foreground/10 text-foreground border-foreground/20",
    label: "COLD",
  },
}

function getScoreStatus(score: number | null): "hot" | "warm" | "cold" {
  if (!score || score < 40) return "cold"
  if (score < 70) return "warm"
  return "hot"
}

export function CrmLeadsList() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const loadLeads = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        scoreFilter,
      })
      if (searchQuery) {
        params.set("search", searchQuery)
      }

      const response = await fetch(`/api/crm/leads?${params}`)
      const result = await response.json()

      if (result.success && result.data) {
        setLeads(result.data.leads)
        setTotalPages(result.data.pagination.totalPages)
        setTotal(result.data.pagination.total)
      }
    } catch (error) {
      console.error("[CRM Leads] Error:", error)
    } finally {
      setLoading(false)
    }
  }, [page, searchQuery, scoreFilter])

  useEffect(() => {
    loadLeads()
  }, [loadLeads])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, scoreFilter])

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle>All Leads</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{total} total leads</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              className="pl-9 w-[200px] bg-background/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={scoreFilter} onValueChange={(v) => setScoreFilter(v as ScoreFilter)}>
            <SelectTrigger className="w-[130px] bg-background/50">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Leads</SelectItem>
              <SelectItem value="hot">Hot Leads</SelectItem>
              <SelectItem value="warm">Warm Leads</SelectItem>
              <SelectItem value="cold">Cold Leads</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          {loading ? (
            <div className="divide-y divide-border/50">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-5">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No leads found. Sync your CRM to import leads.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {leads.map((lead, index) => {
                const scoreStatus = getScoreStatus(lead.dealScore)
                const status = statusConfig[scoreStatus]
                const StatusIcon = status.icon
                const name = [lead.firstName, lead.lastName].filter(Boolean).join(" ") || lead.email
                const initials =
                  lead.firstName && lead.lastName
                    ? `${lead.firstName[0]}${lead.lastName[0]}`
                    : lead.email.substring(0, 2).toUpperCase()

                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group p-5 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                          <AvatarFallback className="bg-foreground/5 text-foreground font-semibold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{name}</h3>
                            <Badge variant="outline" className={status.className}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {status.label}
                            </Badge>
                            {lead.dealScore && (
                              <Badge
                                variant="secondary"
                                className="bg-foreground/5 text-foreground border-foreground/10"
                              >
                                AI: {lead.dealScore}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {lead.jobTitle || "Contact"} at{" "}
                            <span className="font-medium text-foreground">{lead.company || "Unknown"}</span>
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
                              <Mail className="h-3.5 w-3.5" />
                              {lead.email}
                            </span>
                            {lead.phoneNumber && (
                              <span className="flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5" />
                                {lead.phoneNumber}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                            <Badge variant="outline" className="text-xs font-normal">
                              {lead.status}
                            </Badge>
                            {lead.replied && (
                              <Badge variant="outline" className="text-xs font-normal bg-foreground/5">
                                Replied
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="outline" className="shadow-sm bg-transparent">
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
