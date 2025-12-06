"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { ArrowUpRight, Mail, MessageSquare, Eye, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface Campaign {
  id: string
  name: string
  status: string
  emailsSent: number
  replyRate: number
  openRate: number
}

interface RecentCampaignsProps {
  campaigns: Campaign[]
}

export function RecentCampaigns({ campaigns }: RecentCampaignsProps) {
  if (!campaigns || campaigns.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2 text-foreground text-base">
            <div className="p-1.5 rounded-lg bg-foreground/5">
              <Target className="h-4 w-4" />
            </div>
            Top Campaigns
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground group">
            <Link href="/dashboard/campaigns">
              View all
              <ArrowUpRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="p-4 rounded-full bg-foreground/[0.03] mb-4">
            <Target className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground font-medium">No campaigns yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Create your first campaign to get started</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="flex items-center gap-2 text-foreground text-base">
            <div className="p-1.5 rounded-lg bg-foreground/5">
              <Target className="h-4 w-4" />
            </div>
            Top Campaigns
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-foreground/5 px-2 py-1 rounded-full">
              {campaigns.length} shown
            </span>
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground group">
              <Link href="/dashboard/campaigns">
                View all
                <ArrowUpRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[340px] pr-2">
          <div className="space-y-2">
            {campaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Link
                  href={`/dashboard/campaigns/${campaign.id}`}
                  className="block p-3 rounded-xl border border-border/50 bg-foreground/[0.01] hover:bg-foreground/[0.03] transition-all duration-200 hover:shadow-md hover:shadow-foreground/[0.02] hover:border-foreground/10 group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-xs font-medium text-muted-foreground/60 shrink-0">#{index + 1}</span>
                      <h3 className="font-medium text-sm text-foreground group-hover:text-foreground/90 transition-colors truncate">
                        {campaign.name}
                      </h3>
                    </div>
                    <Badge
                      variant={campaign.status === "ACTIVE" ? "default" : "secondary"}
                      className={
                        campaign.status === "ACTIVE"
                          ? "bg-foreground text-background shadow-sm shrink-0 text-[10px]"
                          : "bg-muted text-muted-foreground shrink-0 text-[10px]"
                      }
                    >
                      {campaign.status.toLowerCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {campaign.emailsSent.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {campaign.openRate.toFixed(1)}%
                    </span>
                    <span className="flex items-center gap-1 text-chart-2 font-medium">
                      <MessageSquare className="h-3 w-3" />
                      {campaign.replyRate.toFixed(1)}%
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
