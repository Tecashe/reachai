
import { CreateCampaignWizard } from "@/components/campaigns/create-campaign-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewCampaignPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Campaign</h1>
        <p className="text-muted-foreground">Set up your email outreach campaign</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>Configure your campaign settings and AI personalization options</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateCampaignWizard />
        </CardContent>
      </Card>
    </div>
  )
}
