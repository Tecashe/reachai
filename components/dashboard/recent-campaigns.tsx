import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowUpRight, Users, Mail, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

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
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Top Campaigns</CardTitle>
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Link href="/dashboard/campaigns">
              View all
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No campaigns yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Create your first campaign to get started</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Top Campaigns</CardTitle>
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Link href="/dashboard/campaigns">
            View all
            <ArrowUpRight className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {campaigns.map((campaign) => (
          <Link
            key={campaign.id}
            href={`/dashboard/campaigns/${campaign.id}`}
            className="block p-4 rounded-xl border border-border/50 bg-foreground/[0.01] hover:bg-foreground/[0.03] transition-all duration-200 hover:shadow-md hover:shadow-foreground/[0.02] group"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-foreground group-hover:text-foreground/90 transition-colors line-clamp-1">
                {campaign.name}
              </h3>
              <Badge
                variant={campaign.status === "ACTIVE" ? "default" : "secondary"}
                className={
                  campaign.status === "ACTIVE" ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                }
              >
                {campaign.status.toLowerCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {campaign.emailsSent}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {campaign.openRate.toFixed(1)}%
              </span>
              <span className="flex items-center gap-1.5 text-chart-2">
                <MessageSquare className="h-3.5 w-3.5" />
                {campaign.replyRate.toFixed(1)}%
              </span>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
