import { notFound } from "next/navigation"
import { getCampaignById } from "@/lib/actions/campaigns"
import { CampaignEmailsDashboard } from "@/components/campaigns/campaign-emails-dashboard"

export default async function CampaignEmailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const campaign = await getCampaignById(id)

  if (!campaign) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{campaign.name} - Email Tracking</h1>
        <p className="text-muted-foreground">View and monitor all scheduled and sent emails for this campaign</p>
      </div>

      <CampaignEmailsDashboard campaignId={id} />
    </div>
  )
}
