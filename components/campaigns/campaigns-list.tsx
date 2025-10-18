// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { MoreVertical, Play, Pause, Trash2 } from "lucide-react"
// import Link from "next/link"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { formatDate, formatPercentage } from "@/lib/utils/format"

// const mockCampaigns = [
//   {
//     id: "1",
//     name: "Q1 Outreach - Tech Startups",
//     status: "active",
//     totalProspects: 150,
//     emailsSent: 120,
//     emailsOpened: 45,
//     emailsReplied: 29,
//     createdAt: new Date("2025-01-15"),
//   },
//   {
//     id: "2",
//     name: "SaaS Founders Follow-up",
//     status: "active",
//     totalProspects: 80,
//     emailsSent: 65,
//     emailsOpened: 32,
//     emailsReplied: 18,
//     createdAt: new Date("2025-01-10"),
//   },
//   {
//     id: "3",
//     name: "Enterprise Sales Campaign",
//     status: "paused",
//     totalProspects: 200,
//     emailsSent: 45,
//     emailsOpened: 12,
//     emailsReplied: 8,
//     createdAt: new Date("2025-01-05"),
//   },
// ]

// interface CampaignsListProps {
//   status?: string
// }

// export function CampaignsList({ status }: CampaignsListProps) {
//   const filteredCampaigns = status ? mockCampaigns.filter((c) => c.status === status) : mockCampaigns

//   return (
//     <div className="space-y-4">
//       {filteredCampaigns.map((campaign) => (
//         <Card key={campaign.id} className="hover:shadow-md transition-shadow">
//           <CardContent className="p-6">
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-2">
//                   <Link href={`/dashboard/campaigns/${campaign.id}`}>
//                     <h3 className="text-lg font-semibold hover:text-primary transition-colors">{campaign.name}</h3>
//                   </Link>
//                   <Badge variant={campaign.status === "active" ? "default" : "secondary"}>{campaign.status}</Badge>
//                 </div>
//                 <p className="text-sm text-muted-foreground">Created {formatDate(campaign.createdAt)}</p>
//               </div>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="icon">
//                     <MoreVertical className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem>
//                     <Play className="h-4 w-4 mr-2" />
//                     Resume
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <Pause className="h-4 w-4 mr-2" />
//                     Pause
//                   </DropdownMenuItem>
//                   <DropdownMenuItem className="text-destructive">
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">Prospects</p>
//                 <p className="text-2xl font-bold">{campaign.totalProspects}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">Sent</p>
//                 <p className="text-2xl font-bold">{campaign.emailsSent}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">Open Rate</p>
//                 <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
//                   {formatPercentage(campaign.emailsOpened, campaign.emailsSent)}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">Reply Rate</p>
//                 <p className="text-2xl font-bold text-green-600 dark:text-green-400">
//                   {formatPercentage(campaign.emailsReplied, campaign.emailsSent)}
//                 </p>
//               </div>
//               <div className="flex items-end">
//                 <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
//                   <Link href={`/dashboard/campaigns/${campaign.id}`}>View Details</Link>
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}

//       {filteredCampaigns.length === 0 && (
//         <Card>
//           <CardContent className="p-12 text-center">
//             <p className="text-muted-foreground mb-4">No campaigns found</p>
//             <Button asChild>
//               <Link href="/dashboard/campaigns/new">Create Your First Campaign</Link>
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDate, formatPercentage } from "@/lib/utils/format"
import { getCampaigns } from "@/lib/actions/campaigns"
import { CampaignActions } from "./campaign-actions"

interface CampaignsListProps {
  status?: string
}

export async function CampaignsList({ status }: CampaignsListProps) {
  const campaigns = await getCampaigns(status)

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Link href={`/dashboard/campaigns/${campaign.id}`}>
                    <h3 className="text-lg font-semibold hover:text-primary transition-colors">{campaign.name}</h3>
                  </Link>
                  <Badge variant={campaign.status === "ACTIVE" ? "default" : "secondary"}>
                    {campaign.status.toLowerCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Created {formatDate(campaign.createdAt)}</p>
              </div>

              <CampaignActions campaignId={campaign.id} currentStatus={campaign.status} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Prospects</p>
                <p className="text-2xl font-bold">{campaign.totalProspects}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sent</p>
                <p className="text-2xl font-bold">{campaign.emailsSent}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Open Rate</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatPercentage(campaign.emailsOpened, campaign.emailsSent)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Reply Rate</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatPercentage(campaign.emailsReplied, campaign.emailsSent)}
                </p>
              </div>
              <div className="flex items-end">
                <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                  <Link href={`/dashboard/campaigns/${campaign.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {campaigns.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No campaigns found</p>
            <Button asChild>
              <Link href="/dashboard/campaigns/new">Create Your First Campaign</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
