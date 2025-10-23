// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Pause, Play, Settings, Mail, Users, TrendingUp, MousePointerClick } from "lucide-react"
// import { BatchResearchDialog } from "@/components/campaigns/batch-research-dialog"
// import { SendBulkEmailDialog } from "@/components/campaigns/send-bulk-email-dialog"
// import { getCampaignById, updateCampaignStatus } from "@/lib/actions/campaigns"
// import { getProspects } from "@/lib/actions/prospects"
// import { notFound } from "next/navigation"

// export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
//   const campaign = await getCampaignById(params.id).catch(() => null)

//   if (!campaign) {
//     notFound()
//   }

//   const prospects = await getProspects().catch(() => [])
//   const campaignProspects = prospects.filter((p) => p.campaignId === params.id)

//   const deliveryRate = campaign.emailsSent > 0 ? (campaign.emailsDelivered / campaign.emailsSent) * 100 : 0
//   const openRate = campaign.emailsDelivered > 0 ? (campaign.emailsOpened / campaign.emailsDelivered) * 100 : 0
//   const replyRate = campaign.emailsDelivered > 0 ? (campaign.emailsReplied / campaign.emailsDelivered) * 100 : 0

//   const stats = [
//     { title: "Total Prospects", value: campaign.totalProspects.toString(), icon: Users },
//     { title: "Emails Sent", value: campaign.emailsSent.toString(), icon: Mail },
//     { title: "Open Rate", value: `${Math.round(openRate * 10) / 10}%`, icon: TrendingUp },
//     { title: "Reply Rate", value: `${Math.round(replyRate * 10) / 10}%`, icon: MousePointerClick },
//   ]

//   return (
//     <div className="space-y-6">
//       <div className="flex items-start justify-between">
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
//             <Badge variant={campaign.status === "ACTIVE" ? "default" : "secondary"}>
//               {campaign.status.toLowerCase()}
//             </Badge>
//           </div>
//           <p className="text-muted-foreground">{campaign.description || "No description"}</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <BatchResearchDialog campaignId={params.id} prospectCount={campaign.totalProspects} />
//           <SendBulkEmailDialog campaignId={params.id} />
//           <Button variant="outline" size="icon">
//             <Settings className="h-4 w-4" />
//           </Button>
//           <form action={updateCampaignStatus}>
//             <input type="hidden" name="campaignId" value={params.id} />
//             <input type="hidden" name="status" value={campaign.status === "ACTIVE" ? "PAUSED" : "ACTIVE"} />
//             <Button variant="outline" type="submit">
//               {campaign.status === "ACTIVE" ? (
//                 <>
//                   <Pause className="h-4 w-4 mr-2" />
//                   Pause Campaign
//                 </>
//               ) : (
//                 <>
//                   <Play className="h-4 w-4 mr-2" />
//                   Resume Campaign
//                 </>
//               )}
//             </Button>
//           </form>
//         </div>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {stats.map((stat) => (
//           <Card key={stat.title}>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
//               <stat.icon className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stat.value}</div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <Tabs defaultValue="prospects" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="prospects">Prospects ({campaignProspects.length})</TabsTrigger>
//           <TabsTrigger value="settings">Settings</TabsTrigger>
//         </TabsList>

//         <TabsContent value="prospects" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Campaign Prospects</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {campaignProspects.length > 0 ? (
//                 <div className="space-y-2">
//                   {campaignProspects.slice(0, 10).map((prospect) => (
//                     <div key={prospect.id} className="flex items-center justify-between p-3 border rounded-lg">
//                       <div>
//                         <p className="font-medium">
//                           {prospect.firstName} {prospect.lastName}
//                         </p>
//                         <p className="text-sm text-muted-foreground">{prospect.email}</p>
//                       </div>
//                       <Badge variant="outline">{prospect.status.toLowerCase()}</Badge>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-muted-foreground text-center py-8">No prospects added yet</p>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="settings" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Campaign Settings</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div>
//                   <p className="text-sm font-medium mb-1">Daily Send Limit</p>
//                   <p className="text-2xl font-bold">{campaign.dailySendLimit}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium mb-1">Research Depth</p>
//                   <p className="text-2xl font-bold">{campaign.researchDepth}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium mb-1">Personalization Level</p>
//                   <p className="text-2xl font-bold">{campaign.personalizationLevel}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium mb-1">Tone of Voice</p>
//                   <p className="text-2xl font-bold">{campaign.toneOfVoice}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Pause, Play, Settings, Mail, Users, TrendingUp, MousePointerClick } from "lucide-react"
// import { BatchResearchDialog } from "@/components/campaigns/batch-research-dialog"
// import { SendBulkEmailDialog } from "@/components/campaigns/send-bulk-email-dialog"
// import { getCampaignById, updateCampaignStatus } from "@/lib/actions/campaigns"
// import { getProspects } from "@/lib/actions/prospects"
// import { notFound } from "next/navigation"

// export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
//   const campaign = await getCampaignById(params.id).catch(() => null)

//   if (!campaign) {
//     notFound()
//   }

//   const prospects = await getProspects().catch(() => [])
//   const campaignProspects = prospects.filter((p) => p.campaignId === params.id)

//   const deliveryRate =
//     campaign.stats.emailsSent > 0 ? (campaign.stats.emailsDelivered / campaign.stats.emailsSent) * 100 : 0
//   const openRate =
//     campaign.stats.emailsDelivered > 0 ? (campaign.stats.emailsOpened / campaign.stats.emailsDelivered) * 100 : 0
//   const replyRate =
//     campaign.stats.emailsDelivered > 0 ? (campaign.stats.emailsReplied / campaign.stats.emailsDelivered) * 100 : 0

//   const stats = [
//     { title: "Total Prospects", value: campaign.stats.totalProspects.toString(), icon: Users },
//     { title: "Emails Sent", value: campaign.stats.emailsSent.toString(), icon: Mail },
//     { title: "Open Rate", value: `${Math.round(openRate * 10) / 10}%`, icon: TrendingUp },
//     { title: "Reply Rate", value: `${Math.round(replyRate * 10) / 10}%`, icon: MousePointerClick },
//   ]

//   return (
//     <div className="space-y-6">
//       <div className="flex items-start justify-between">
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
//             <Badge variant={campaign.status === "ACTIVE" ? "default" : "secondary"}>
//               {campaign.status.toLowerCase()}
//             </Badge>
//           </div>
//           <p className="text-muted-foreground">{campaign.description || "No description"}</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <BatchResearchDialog campaignId={params.id} prospectCount={campaign.stats.totalProspects} />
//           <SendBulkEmailDialog campaignId={params.id} />
//           <Button variant="outline" size="icon">
//             <Settings className="h-4 w-4" />
//           </Button>
//           <form action={updateCampaignStatus}>
//             <input type="hidden" name="campaignId" value={params.id} />
//             <input type="hidden" name="status" value={campaign.status === "ACTIVE" ? "PAUSED" : "ACTIVE"} />
//             <Button variant="outline" type="submit">
//               {campaign.status === "ACTIVE" ? (
//                 <>
//                   <Pause className="h-4 w-4 mr-2" />
//                   Pause Campaign
//                 </>
//               ) : (
//                 <>
//                   <Play className="h-4 w-4 mr-2" />
//                   Resume Campaign
//                 </>
//               )}
//             </Button>
//           </form>
//         </div>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {stats.map((stat) => (
//           <Card key={stat.title}>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
//               <stat.icon className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stat.value}</div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <Tabs defaultValue="prospects" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="prospects">Prospects ({campaignProspects.length})</TabsTrigger>
//           <TabsTrigger value="settings">Settings</TabsTrigger>
//         </TabsList>

//         <TabsContent value="prospects" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Campaign Prospects</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {campaignProspects.length > 0 ? (
//                 <div className="space-y-2">
//                   {campaignProspects.slice(0, 10).map((prospect) => (
//                     <div key={prospect.id} className="flex items-center justify-between p-3 border rounded-lg">
//                       <div>
//                         <p className="font-medium">
//                           {prospect.firstName} {prospect.lastName}
//                         </p>
//                         <p className="text-sm text-muted-foreground">{prospect.email}</p>
//                       </div>
//                       <Badge variant="outline">{prospect.status.toLowerCase()}</Badge>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-muted-foreground text-center py-8">No prospects added yet</p>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="settings" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Campaign Settings</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div>
//                   <p className="text-sm font-medium mb-1">Daily Send Limit</p>
//                   <p className="text-2xl font-bold">{campaign.dailySendLimit}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium mb-1">Research Depth</p>
//                   <p className="text-2xl font-bold">{campaign.researchDepth}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium mb-1">Personalization Level</p>
//                   <p className="text-2xl font-bold">{campaign.personalizationLevel}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium mb-1">Tone of Voice</p>
//                   <p className="text-2xl font-bold">{campaign.toneOfVoice}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Pause, Play, Settings, Mail, Users, TrendingUp, MousePointerClick, ArrowLeft } from "lucide-react"
// import { BatchResearchDialog } from "@/components/campaigns/batch-research-dialog"
// import { SendBulkEmailDialog } from "@/components/campaigns/send-bulk-email-dialog"
// import { getCampaignById, updateCampaignStatus } from "@/lib/actions/campaigns"
// import { getProspects } from "@/lib/actions/prospects"
// import { notFound } from "next/navigation"
// import Link from "next/link"

// export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
//   const campaign = await getCampaignById(params.id).catch(() => null)

//   if (!campaign) {
//     notFound()
//   }

//   const prospects = await getProspects().catch(() => [])
//   const campaignProspects = prospects.filter((p) => p.campaignId === params.id)

//   const deliveryRate =
//     campaign.stats.emailsSent > 0 ? (campaign.stats.emailsDelivered / campaign.stats.emailsSent) * 100 : 0
//   const openRate =
//     campaign.stats.emailsDelivered > 0 ? (campaign.stats.emailsOpened / campaign.stats.emailsDelivered) * 100 : 0
//   const replyRate =
//     campaign.stats.emailsDelivered > 0 ? (campaign.stats.emailsReplied / campaign.stats.emailsDelivered) * 100 : 0

//   const stats = [
//     { title: "Total Prospects", value: campaign.stats.totalProspects.toString(), icon: Users },
//     { title: "Emails Sent", value: campaign.stats.emailsSent.toString(), icon: Mail },
//     { title: "Open Rate", value: `${Math.round(openRate * 10) / 10}%`, icon: TrendingUp },
//     { title: "Reply Rate", value: `${Math.round(replyRate * 10) / 10}%`, icon: MousePointerClick },
//   ]

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-4">
//         <Link href="/dashboard/campaigns">
//           <Button variant="ghost" size="icon">
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//         </Link>
//         <div className="flex-1 flex items-start justify-between">
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
//               <Badge variant={campaign.status === "ACTIVE" ? "default" : "secondary"}>
//                 {campaign.status.toLowerCase()}
//               </Badge>
//             </div>
//             <p className="text-muted-foreground">{campaign.description || "No description"}</p>
//           </div>
//           <div className="flex items-center gap-2">
//             <BatchResearchDialog campaignId={params.id} prospectCount={campaign.stats.totalProspects} />
//             <SendBulkEmailDialog campaignId={params.id} />
//             <Button variant="outline" size="icon">
//               <Settings className="h-4 w-4" />
//             </Button>
//             <form action={updateCampaignStatus}>
//               <input type="hidden" name="campaignId" value={params.id} />
//               <input type="hidden" name="status" value={campaign.status === "ACTIVE" ? "PAUSED" : "ACTIVE"} />
//               <Button variant="outline" type="submit">
//                 {campaign.status === "ACTIVE" ? (
//                   <>
//                     <Pause className="h-4 w-4 mr-2" />
//                     Pause Campaign
//                   </>
//                 ) : (
//                   <>
//                     <Play className="h-4 w-4 mr-2" />
//                     Resume Campaign
//                   </>
//                 )}
//               </Button>
//             </form>
//           </div>
//         </div>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {stats.map((stat) => (
//           <Card key={stat.title}>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
//               <stat.icon className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stat.value}</div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <Tabs defaultValue="prospects" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="prospects">Prospects ({campaignProspects.length})</TabsTrigger>
//           <TabsTrigger value="settings">Settings</TabsTrigger>
//         </TabsList>

//         <TabsContent value="prospects" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Campaign Prospects</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {campaignProspects.length > 0 ? (
//                 <div className="space-y-2">
//                   {campaignProspects.slice(0, 10).map((prospect) => (
//                     <div key={prospect.id} className="flex items-center justify-between p-3 border rounded-lg">
//                       <div>
//                         <p className="font-medium">
//                           {prospect.firstName} {prospect.lastName}
//                         </p>
//                         <p className="text-sm text-muted-foreground">{prospect.email}</p>
//                       </div>
//                       <Badge variant="outline">{prospect.status.toLowerCase()}</Badge>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-muted-foreground text-center py-8">No prospects added yet</p>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="settings" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Campaign Settings</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div>
//                   <p className="text-sm font-medium mb-1">Daily Send Limit</p>
//                   <p className="text-2xl font-bold">{campaign.dailySendLimit}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium mb-1">Research Depth</p>
//                   <p className="text-2xl font-bold">{campaign.researchDepth}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium mb-1">Personalization Level</p>
//                   <p className="text-2xl font-bold">{campaign.personalizationLevel}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium mb-1">Tone of Voice</p>
//                   <p className="text-2xl font-bold">{campaign.toneOfVoice}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pause, Play, Settings, Mail, Users, TrendingUp, MousePointerClick, ArrowLeft } from "lucide-react"
import { BatchResearchDialog } from "@/components/campaigns/batch-research-dialog"
import { SendBulkEmailDialog } from "@/components/campaigns/send-bulk-email-dialog"
import { ABTestManager } from "@/components/campaigns/ab-test-manager"
import { getCampaignById, updateCampaignStatus } from "@/lib/actions/campaigns"
import { getProspects } from "@/lib/actions/prospects"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
  const campaign = await getCampaignById(params.id).catch(() => null)

  if (!campaign) {
    notFound()
  }

  const prospects = await getProspects().catch(() => [])
  const campaignProspects = prospects.filter((p) => p.campaignId === params.id)

  const deliveryRate =
    campaign.stats.emailsSent > 0 ? (campaign.stats.emailsDelivered / campaign.stats.emailsSent) * 100 : 0
  const openRate =
    campaign.stats.emailsDelivered > 0 ? (campaign.stats.emailsOpened / campaign.stats.emailsDelivered) * 100 : 0
  const replyRate =
    campaign.stats.emailsDelivered > 0 ? (campaign.stats.emailsReplied / campaign.stats.emailsDelivered) * 100 : 0

  const stats = [
    { title: "Total Prospects", value: campaign.stats.totalProspects.toString(), icon: Users },
    { title: "Emails Sent", value: campaign.stats.emailsSent.toString(), icon: Mail },
    { title: "Open Rate", value: `${Math.round(openRate * 10) / 10}%`, icon: TrendingUp },
    { title: "Reply Rate", value: `${Math.round(replyRate * 10) / 10}%`, icon: MousePointerClick },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/campaigns">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
              <Badge variant={campaign.status === "ACTIVE" ? "default" : "secondary"}>
                {campaign.status.toLowerCase()}
              </Badge>
            </div>
            <p className="text-muted-foreground">{campaign.description || "No description"}</p>
          </div>
          <div className="flex items-center gap-2">
            <BatchResearchDialog campaignId={params.id} prospectCount={campaign.stats.totalProspects} />
            <SendBulkEmailDialog campaignId={params.id} />
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <form action={updateCampaignStatus}>
              <input type="hidden" name="campaignId" value={params.id} />
              <input type="hidden" name="status" value={campaign.status === "ACTIVE" ? "PAUSED" : "ACTIVE"} />
              <Button variant="outline" type="submit">
                {campaign.status === "ACTIVE" ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Campaign
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume Campaign
                  </>
                )}
              </Button>
            </form>
          </div>
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

      <Tabs defaultValue="prospects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="prospects">Prospects ({campaignProspects.length})</TabsTrigger>
          <TabsTrigger value="ab-testing">A/B Testing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="prospects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Prospects</CardTitle>
            </CardHeader>
            <CardContent>
              {campaignProspects.length > 0 ? (
                <div className="space-y-2">
                  {campaignProspects.slice(0, 10).map((prospect) => (
                    <div key={prospect.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {prospect.firstName} {prospect.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{prospect.email}</p>
                      </div>
                      <Badge variant="outline">{prospect.status.toLowerCase()}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No prospects added yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ab-testing" className="space-y-4">
          <ABTestManager campaignId={params.id} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium mb-1">Daily Send Limit</p>
                  <p className="text-2xl font-bold">{campaign.dailySendLimit}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Research Depth</p>
                  <p className="text-2xl font-bold">{campaign.researchDepth}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Personalization Level</p>
                  <p className="text-2xl font-bold">{campaign.personalizationLevel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Tone of Voice</p>
                  <p className="text-2xl font-bold">{campaign.toneOfVoice}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
