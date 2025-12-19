
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { CampaignsList } from "@/components/campaigns/campaigns-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DraftCampaigns } from "@/components/campaigns/draft-campaigns"

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">Manage your email outreach campaigns</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/campaigns/new">
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Link>
          </Button>
        </div>
      </div>

      <DraftCampaigns />

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search campaigns..." className="pl-9" />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="ACTIVE">Active</TabsTrigger>
          <TabsTrigger value="PAUSED">Paused</TabsTrigger>
          <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <CampaignsList />
        </TabsContent>

        <TabsContent value="ACTIVE" className="space-y-4">
          <CampaignsList status="ACTIVE" />
        </TabsContent>

        <TabsContent value="PAUSED" className="space-y-4">
          <CampaignsList status="PAUSED" />
        </TabsContent>

        <TabsContent value="COMPLETED" className="space-y-4">
          <CampaignsList status="COMPLETED" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
