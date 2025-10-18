import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pause, Settings, Mail, Users, TrendingUp, MousePointerClick } from "lucide-react"
import { BatchResearchDialog } from "@/components/campaigns/batch-research-dialog"
import { SendBulkEmailDialog } from "@/components/campaigns/send-bulk-email-dialog"

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const stats = [
    { title: "Total Prospects", value: "150", icon: Users },
    { title: "Emails Sent", value: "120", icon: Mail },
    { title: "Open Rate", value: "37.5%", icon: TrendingUp },
    { title: "Reply Rate", value: "24.2%", icon: MousePointerClick },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">Q1 Outreach - Tech Startups</h1>
            <Badge>Active</Badge>
          </div>
          <p className="text-muted-foreground">Created on Jan 15, 2025</p>
        </div>
        <div className="flex items-center gap-2">
          <BatchResearchDialog campaignId={params.id} prospectCount={150} />
          <SendBulkEmailDialog campaignId={params.id} />
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Pause className="h-4 w-4 mr-2" />
            Pause Campaign
          </Button>
          <Button>
            <Mail className="h-4 w-4 mr-2" />
            Send Test Email
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="prospects">Prospects</TabsTrigger>
          <TabsTrigger value="emails">Email Sequence</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Performance chart will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prospects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Prospects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Prospects list will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Sequence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Email sequence configuration will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Detailed analytics will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
