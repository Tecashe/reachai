// import { notFound } from "next/navigation"
// import { db } from "@/lib/db"
// import { SequenceFlowVisualization } from "@/components/sequences/sequence-flow-visualization"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft, Plus, Settings } from "lucide-react"
// import Link from "next/link"

// export default async function SequenceDetailPage({ params }: { params: { id: string } }) {
//   const campaign = await db.campaign.findUnique({
//     where: { id: params.id },
//     include: {
//       emailSequences: {
//         include: {
//           template: true,
//         },
//         orderBy: {
//           stepNumber: "asc",
//         },
//       },
//     },
//   })

//   if (!campaign) {
//     notFound()
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="space-y-1">
//           <div className="flex items-center gap-2">
//             <Link href="/dashboard/sequences">
//               <Button variant="ghost" size="icon">
//                 <ArrowLeft className="h-4 w-4" />
//               </Button>
//             </Link>
//             <h1 className="text-3xl font-bold">{campaign.name}</h1>
//           </div>
//           <p className="text-muted-foreground">
//             {campaign.emailSequences.length} step{campaign.emailSequences.length !== 1 ? "s" : ""} in this sequence
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline">
//             <Settings className="h-4 w-4 mr-2" />
//             Settings
//           </Button>
//           <Button>
//             <Plus className="h-4 w-4 mr-2" />
//             Add Step
//           </Button>
//         </div>
//       </div>

//       <SequenceFlowVisualization sequences={campaign.emailSequences} campaignName={campaign.name} />
//     </div>
//   )
// }



import { notFound } from 'next/navigation'
import { db } from "@/lib/db"
import { getCurrentUserFromDb } from "@/lib/auth"
import { SequenceFlowVisualization } from "@/components/sequences/sequence-flow-visualization"
import { SequenceMonitoringStats } from "@/components/sequences/sequence-monitoring-stats"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Settings } from 'lucide-react'
import Link from "next/link"

export default async function SequenceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const user = await getCurrentUserFromDb()
  if (!user) notFound()

  const campaign = await db.campaign.findUnique({
    where: { id, userId: user.id },
    include: {
      emailSequences: {
        include: {
          template: true,
        },
        orderBy: {
          stepNumber: "asc",
        },
      },
    },
  })

  if (!campaign) {
    notFound()
  }

  const scheduleStats = await db.sendingSchedule.groupBy({
    by: ["status"],
    where: {
      campaignId: id,
    },
    _count: true,
  })

  const prospectsByStep = await db.sendingSchedule.findMany({
    where: {
      campaignId: id,
    },
    include: {
      prospect: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          company: true,
          status: true,
        },
      },
    },
    orderBy: { scheduledFor: "asc" },
    take: 50,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/sequences">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">{campaign.name}</h1>
          </div>
          <p className="text-muted-foreground">
            {campaign.emailSequences.length} step{campaign.emailSequences.length !== 1 ? "s" : ""} in this sequence
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>
      </div>

      <SequenceMonitoringStats 
        scheduleStats={scheduleStats}
        prospectsByStep={prospectsByStep}
      />

      <SequenceFlowVisualization sequences={campaign.emailSequences} campaignName={campaign.name} />
    </div>
  )
}


