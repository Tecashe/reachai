import { getDraftCampaigns } from "@/lib/actions/campaigns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

const stepLabels: Record<string, string> = {
  prospects: "Adding Prospects",
  research: "AI Research",
  generate: "Email Generation",
  review: "Review & Optimize",
  launch: "Ready to Launch",
}

const stepProgress: Record<string, number> = {
  prospects: 20,
  research: 40,
  generate: 60,
  review: 80,
  launch: 100,
}

export async function DraftCampaigns() {
  const drafts = await getDraftCampaigns()

  if (drafts.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-500" />
          <div>
            <CardTitle>Resume Draft Campaigns</CardTitle>
            <CardDescription>Continue where you left off</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {drafts.map((draft) => {
            const currentStep = draft.wizardStep || "prospects"
            const progress = stepProgress[currentStep] || 0
            const stepLabel = stepLabels[currentStep] || "Getting Started"

            return (
              <div
                key={draft.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{draft.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {draft._count.prospects} prospect{draft._count.prospects !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{stepLabel}</span>
                      <span className="text-xs text-muted-foreground">
                        Last updated {formatDistanceToNow(new Date(draft.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
                <Button asChild className="ml-4">
                  <Link href={`/dashboard/campaigns/wizard/${draft.id}`}>
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
