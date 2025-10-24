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

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Mail, MoreVertical } from "lucide-react"
// // import { getSequences } from "@/lib/actions/sequences"

// interface SequencesListProps {
//   sequences: Array<{
//     id: string
//     campaignId: string
//     stepNumber: number
//     delayDays: number
//     sendOnlyIfNotReplied: boolean
//     sendOnlyIfNotOpened: boolean
//     campaign: { name: string }
//     template: { name: string; subject: string }
//   }>
// }

// export function SequencesList({ sequences }: SequencesListProps) {
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
//                     {sequence.sendOnlyIfNotOpened && (
//                       <Badge variant="outline" className="text-xs">
//                         Only if not opened
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
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Clock, ArrowRight, Eye } from "lucide-react"
import Link from "next/link"

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
    <div className="space-y-8">
      {Object.entries(groupedSequences).map(([campaignId, data]: [string, any]) => {
        // Sort sequences by step number
        const sortedSequences = [...data.sequences].sort((a, b) => a.stepNumber - b.stepNumber)

        return (
          <Card key={campaignId} className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{data.campaignName}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {sortedSequences.length} step{sortedSequences.length !== 1 ? "s" : ""} in sequence
                  </p>
                </div>
                <Link href={`/dashboard/sequences/${campaignId}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </Link>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="relative">
                {/* Flow container with horizontal scroll on mobile */}
                <div className="flex items-start gap-4 overflow-x-auto pb-4">
                  {sortedSequences.map((sequence: any, index: number) => (
                    <div key={sequence.id} className="flex items-center flex-shrink-0">
                      {/* Step Card */}
                      <div className="relative group">
                        {/* Step number badge */}
                        <div className="absolute -top-3 -left-3 z-10">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-bold shadow-lg">
                            {sequence.stepNumber}
                          </div>
                        </div>

                        {/* Main card */}
                        <Card className="w-[280px] border-2 transition-all duration-200 hover:border-primary/50 hover:shadow-lg">
                          <CardContent className="p-4 space-y-3">
                            {/* Template info */}
                            <div className="space-y-1">
                              <div className="flex items-start gap-2">
                                <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm line-clamp-1">{sequence.template.name}</p>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                    {sequence.template.subject}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Conditions */}
                            <div className="flex flex-wrap gap-1.5">
                              {sequence.sendOnlyIfNotReplied && (
                                <Badge variant="secondary" className="text-xs">
                                  No reply
                                </Badge>
                              )}
                              {sequence.sendOnlyIfNotOpened && (
                                <Badge variant="secondary" className="text-xs">
                                  Not opened
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Arrow connector */}
                      {index < sortedSequences.length - 1 && (
                        <div className="flex flex-col items-center mx-2 flex-shrink-0">
                          {/* Delay badge */}
                          <div className="mb-2 px-3 py-1 rounded-full bg-muted border border-border">
                            <div className="flex items-center gap-1.5 text-xs font-medium">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{sortedSequences[index + 1].delayDays}d</span>
                            </div>
                          </div>

                          {/* Arrow */}
                          <div className="flex items-center">
                            <div className="h-0.5 w-8 bg-gradient-to-r from-primary/60 to-primary" />
                            <ArrowRight className="h-5 w-5 text-primary -ml-1" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {sequences.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-4">
                <Mail className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No email sequences yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Create a campaign and add email sequences to automate your follow-ups with perfectly timed messages
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
