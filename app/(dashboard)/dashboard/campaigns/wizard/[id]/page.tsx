
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { CampaignWizard } from "@/components/campaigns/campaign-wizard"

export default async function CampaignWizardPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    redirect("/sign-in")
  }

  const campaign = await db.campaign.findUnique({
    where: { id: params.id, userId: user.id },
    include: {
      prospects: {
        take: 10,
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { prospects: true },
      },
    },
  })

  if (!campaign) {
    redirect("/dashboard/campaigns")
  }

  const transformedCampaign = {
    ...campaign,
    wizardCompletedSteps: Array.isArray(campaign.wizardCompletedSteps)
      ? (campaign.wizardCompletedSteps as string[])
      : undefined,
  }

  return (
    <div className="max-w-5xl mx-auto">
      <CampaignWizard campaign={transformedCampaign} />
    </div>
  )
}
