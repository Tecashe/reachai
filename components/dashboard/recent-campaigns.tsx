// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import Link from "next/link"
// import { ArrowRight } from "lucide-react"

// const campaigns = [
//   {
//     id: "1",
//     name: "Q1 Outreach - Tech Startups",
//     status: "active",
//     prospects: 150,
//     sent: 120,
//     replied: 29,
//   },
//   {
//     id: "2",
//     name: "SaaS Founders Follow-up",
//     status: "active",
//     prospects: 80,
//     sent: 65,
//     replied: 18,
//   },
//   {
//     id: "3",
//     name: "Enterprise Sales Campaign",
//     status: "paused",
//     prospects: 200,
//     sent: 45,
//     replied: 8,
//   },
// ]

// export function RecentCampaigns() {
//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle>Recent Campaigns</CardTitle>
//         <Link href="/dashboard/campaigns" className="text-sm text-primary hover:underline flex items-center gap-1">
//           View all
//           <ArrowRight className="h-3 w-3" />
//         </Link>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {campaigns.map((campaign) => (
//           <Link
//             key={campaign.id}
//             href={`/dashboard/campaigns/${campaign.id}`}
//             className="block p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
//           >
//             <div className="flex items-start justify-between mb-2">
//               <h3 className="font-semibold">{campaign.name}</h3>
//               <Badge variant={campaign.status === "active" ? "default" : "secondary"}>{campaign.status}</Badge>
//             </div>
//             <div className="flex items-center gap-4 text-sm text-muted-foreground">
//               <span>{campaign.prospects} prospects</span>
//               <span>•</span>
//               <span>{campaign.sent} sent</span>
//               <span>•</span>
//               <span className="text-green-600 dark:text-green-400">{campaign.replied} replied</span>
//             </div>
//           </Link>
//         ))}
//       </CardContent>
//     </Card>
//   )
// }

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getCampaigns } from "@/lib/actions/campaigns"

export async function RecentCampaigns() {
  const allCampaigns = await getCampaigns()
  const campaigns = allCampaigns.slice(0, 3)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Campaigns</CardTitle>
        <Link href="/dashboard/campaigns" className="text-sm text-primary hover:underline flex items-center gap-1">
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {campaigns.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No campaigns yet.{" "}
            <Link href="/dashboard/campaigns/new" className="text-primary hover:underline">
              Create your first campaign
            </Link>
          </p>
        ) : (
          campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/dashboard/campaigns/${campaign.id}`}
              className="block p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{campaign.name}</h3>
                <Badge variant={campaign.status === "ACTIVE" ? "default" : "secondary"}>
                  {campaign.status.toLowerCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{campaign.totalProspects} prospects</span>
                <span>•</span>
                <span>{campaign.emailsSent} sent</span>
                <span>•</span>
                <span className="text-green-600 dark:text-green-400">{campaign.emailsReplied} replied</span>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}
