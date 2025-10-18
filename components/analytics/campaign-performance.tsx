// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { ArrowUpRight } from "lucide-react"

// const campaigns = [
//   {
//     name: "Q1 Tech Outreach",
//     status: "active",
//     sent: 1250,
//     opened: 529,
//     clicked: 187,
//     replied: 94,
//     openRate: 42.3,
//     clickRate: 15.0,
//     replyRate: 7.5,
//   },
//   {
//     name: "Product Demo Follow-up",
//     status: "active",
//     sent: 450,
//     opened: 306,
//     clicked: 142,
//     replied: 89,
//     openRate: 68.0,
//     clickRate: 31.6,
//     replyRate: 19.8,
//   },
//   {
//     name: "Enterprise Outreach",
//     status: "active",
//     sent: 890,
//     opened: 378,
//     clicked: 156,
//     replied: 67,
//     openRate: 42.5,
//     clickRate: 17.5,
//     replyRate: 7.5,
//   },
//   {
//     name: "Re-engagement Campaign",
//     status: "paused",
//     sent: 670,
//     opened: 187,
//     clicked: 45,
//     replied: 12,
//     openRate: 27.9,
//     clickRate: 6.7,
//     replyRate: 1.8,
//   },
// ]

// export function CampaignPerformance() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Campaign Performance Comparison</CardTitle>
//         <CardDescription>Detailed metrics for all campaigns</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {campaigns.map((campaign) => (
//             <div key={campaign.name} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
//               <div className="flex items-start justify-between mb-4">
//                 <div>
//                   <h3 className="font-semibold">{campaign.name}</h3>
//                   <p className="text-sm text-muted-foreground">{campaign.sent} emails sent</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Badge variant={campaign.status === "active" ? "default" : "secondary"}>{campaign.status}</Badge>
//                   <Button variant="ghost" size="sm">
//                     <ArrowUpRight className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="grid grid-cols-3 gap-4">
//                 <div className="space-y-1">
//                   <p className="text-xs text-muted-foreground">Open Rate</p>
//                   <p className="text-2xl font-bold">{campaign.openRate}%</p>
//                   <p className="text-xs text-muted-foreground">{campaign.opened} opens</p>
//                 </div>
//                 <div className="space-y-1">
//                   <p className="text-xs text-muted-foreground">Click Rate</p>
//                   <p className="text-2xl font-bold">{campaign.clickRate}%</p>
//                   <p className="text-xs text-muted-foreground">{campaign.clicked} clicks</p>
//                 </div>
//                 <div className="space-y-1">
//                   <p className="text-xs text-muted-foreground">Reply Rate</p>
//                   <p className="text-2xl font-bold">{campaign.replyRate}%</p>
//                   <p className="text-xs text-muted-foreground">{campaign.replied} replies</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

interface CampaignPerformanceProps {
  campaigns: Array<{
    id: string
    name: string
    status: string
    emailsSent: number
    emailsOpened: number
    emailsClicked: number
    emailsReplied: number
  }>
}

export function CampaignPerformance({ campaigns }: CampaignPerformanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance Comparison</CardTitle>
        <CardDescription>Detailed metrics for all campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        {campaigns.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No campaigns yet</p>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const openRate = campaign.emailsSent > 0 ? (campaign.emailsOpened / campaign.emailsSent) * 100 : 0
              const clickRate = campaign.emailsSent > 0 ? (campaign.emailsClicked / campaign.emailsSent) * 100 : 0
              const replyRate = campaign.emailsSent > 0 ? (campaign.emailsReplied / campaign.emailsSent) * 100 : 0

              return (
                <div
                  key={campaign.id}
                  className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground">{campaign.emailsSent} emails sent</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={campaign.status === "ACTIVE" ? "default" : "secondary"}>
                        {campaign.status.toLowerCase()}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/campaigns/${campaign.id}`}>
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Open Rate</p>
                      <p className="text-2xl font-bold">{openRate.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">{campaign.emailsOpened} opens</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Click Rate</p>
                      <p className="text-2xl font-bold">{clickRate.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">{campaign.emailsClicked} clicks</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Reply Rate</p>
                      <p className="text-2xl font-bold">{replyRate.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">{campaign.emailsReplied} replies</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
