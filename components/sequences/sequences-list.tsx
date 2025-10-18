// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Mail, MoreVertical } from "lucide-react"

// const sequences = [
//   {
//     id: "1",
//     name: "Cold Outreach - 3 Step",
//     description: "Initial outreach with 2 follow-ups",
//     steps: 3,
//     activeProspects: 45,
//     openRate: "42%",
//     replyRate: "18%",
//     status: "active",
//   },
//   {
//     id: "2",
//     name: "Product Demo Follow-up",
//     description: "Post-demo nurture sequence",
//     steps: 4,
//     activeProspects: 23,
//     openRate: "68%",
//     replyRate: "34%",
//     status: "active",
//   },
//   {
//     id: "3",
//     name: "Re-engagement Campaign",
//     description: "Win back cold prospects",
//     steps: 2,
//     activeProspects: 12,
//     openRate: "28%",
//     replyRate: "9%",
//     status: "paused",
//   },
// ]

// export function SequencesList() {
//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//       {sequences.map((sequence) => (
//         <Card key={sequence.id} className="hover:shadow-md transition-shadow">
//           <CardHeader>
//             <div className="flex items-start justify-between">
//               <div className="space-y-1">
//                 <CardTitle className="text-lg">{sequence.name}</CardTitle>
//                 <CardDescription>{sequence.description}</CardDescription>
//               </div>
//               <Button variant="ghost" size="icon">
//                 <MoreVertical className="h-4 w-4" />
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between text-sm">
//               <div className="flex items-center gap-2">
//                 <Mail className="h-4 w-4 text-muted-foreground" />
//                 <span>{sequence.steps} steps</span>
//               </div>
//               <Badge variant={sequence.status === "active" ? "default" : "secondary"}>{sequence.status}</Badge>
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Active Prospects</span>
//                 <span className="font-medium">{sequence.activeProspects}</span>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Open Rate</span>
//                 <span className="font-medium">{sequence.openRate}</span>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Reply Rate</span>
//                 <span className="font-medium">{sequence.replyRate}</span>
//               </div>
//             </div>

//             <Button className="w-full bg-transparent" variant="outline">
//               View Sequence
//             </Button>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )
// }

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Mail, MoreVertical } from "lucide-react"
// import { getSequences } from "@/lib/actions/sequences"

// export async function SequencesList() {
//   const sequences = await getSequences().catch(() => [])

//   // Group sequences by campaign
//   const groupedSequences = sequences.reduce((acc: any, seq: any) => {
//     const campaignId = seq.campaignId
//     if (!acc[campaignId]) {
//       acc[campaignId] = {
//         campaignName: seq.campaign.name,
//         sequences: [],
//       }
//     }
//     acc[campaignId].sequences.push(seq)
//     return acc
//   }, {})

//   return (
//     <div className="space-y-6">
//       {Object.entries(groupedSequences).map(([campaignId, data]: [string, any]) => (
//         <div key={campaignId} className="space-y-4">
//           <h3 className="text-lg font-semibold">{data.campaignName}</h3>
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {data.sequences.map((sequence: any) => (
//               <Card key={sequence.id} className="hover:shadow-md transition-shadow">
//                 <CardHeader>
//                   <div className="flex items-start justify-between">
//                     <div className="space-y-1">
//                       <CardTitle className="text-lg">Step {sequence.stepNumber}</CardTitle>
//                       <CardDescription>{sequence.template.name}</CardDescription>
//                     </div>
//                     <Button variant="ghost" size="icon">
//                       <MoreVertical className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-muted-foreground">Subject</span>
//                       <span className="font-medium text-right line-clamp-1">{sequence.template.subject}</span>
//                     </div>
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-muted-foreground">Delay</span>
//                       <span className="font-medium">{sequence.delayDays} days</span>
//                     </div>
//                     {sequence.sendOnlyIfNotReplied && (
//                       <Badge variant="outline" className="text-xs">
//                         Only if no reply
//                       </Badge>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       ))}

//       {sequences.length === 0 && (
//         <Card>
//           <CardContent className="p-12 text-center">
//             <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//             <p className="text-muted-foreground mb-4">No email sequences created yet</p>
//             <p className="text-sm text-muted-foreground">
//               Create a campaign and add email sequences to automate your follow-ups
//             </p>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, MoreVertical } from "lucide-react"
// import { getSequences } from "@/lib/actions/sequences"

interface SequencesListProps {
  sequences: Array<{
    id: string
    campaignId: string
    stepNumber: number
    delayDays: number
    sendOnlyIfNotReplied: boolean
    sendOnlyIfNotOpened: boolean
    campaign: { name: string }
    template: { name: string; subject: string }
  }>
}

export function SequencesList({ sequences }: SequencesListProps) {
  // Group sequences by campaign
  const groupedSequences = sequences.reduce((acc: any, seq: any) => {
    const campaignId = seq.campaignId
    if (!acc[campaignId]) {
      acc[campaignId] = {
        campaignName: seq.campaign.name,
        sequences: [],
      }
    }
    acc[campaignId].sequences.push(seq)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(groupedSequences).map(([campaignId, data]: [string, any]) => (
        <div key={campaignId} className="space-y-4">
          <h3 className="text-lg font-semibold">{data.campaignName}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.sequences.map((sequence: any) => (
              <Card key={sequence.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">Step {sequence.stepNumber}</CardTitle>
                      <CardDescription>{sequence.template.name}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subject</span>
                      <span className="font-medium text-right line-clamp-1">{sequence.template.subject}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Delay</span>
                      <span className="font-medium">{sequence.delayDays} days</span>
                    </div>
                    {sequence.sendOnlyIfNotReplied && (
                      <Badge variant="outline" className="text-xs">
                        Only if no reply
                      </Badge>
                    )}
                    {sequence.sendOnlyIfNotOpened && (
                      <Badge variant="outline" className="text-xs">
                        Only if not opened
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {sequences.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No email sequences created yet</p>
            <p className="text-sm text-muted-foreground">
              Create a campaign and add email sequences to automate your follow-ups
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
