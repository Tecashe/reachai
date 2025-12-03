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

// import { notFound } from 'next/navigation'
// import { db } from "@/lib/db"
// import { getCurrentUserFromDb } from "@/lib/auth"
// import { SequenceFlowVisualization } from "@/components/sequences/sequence-flow-visualization"
// import { SequenceMonitoringStats } from "@/components/sequences/sequence-monitoring-stats"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft, Plus, Settings } from 'lucide-react'
// import Link from "next/link"

// export default async function SequenceDetailPage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params
  
//   const user = await getCurrentUserFromDb()
//   if (!user) notFound()

//   const campaign = await db.campaign.findUnique({
//     where: { id, userId: user.id },
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

//   const scheduleStats = await db.sendingSchedule.groupBy({
//     by: ["status"],
//     where: {
//       campaignId: id,
//     },
//     _count: true,
//   })

//   const prospectsByStep = await db.sendingSchedule.findMany({
//     where: {
//       campaignId: id,
//     },
//     include: {
//       prospect: {
//         select: {
//           id: true,
//           firstName: true,
//           lastName: true,
//           email: true,
//           company: true,
//           status: true,
//         },
//       },
//     },
//     orderBy: { scheduledFor: "asc" },
//     take: 50,
//   })

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

//       <SequenceMonitoringStats 
//         scheduleStats={scheduleStats}
//         prospectsByStep={prospectsByStep}
//       />

//       <SequenceFlowVisualization sequences={campaign.emailSequences} campaignName={campaign.name} />
//     </div>
//   )
// }

// import { notFound } from "next/navigation"
// import { db } from "@/lib/db"
// import { getCurrentUserFromDb } from "@/lib/auth"
// import { SequenceFlowVisualization } from "@/components/sequences/sequence-flow-visualization"
// import { SequenceMonitoringStats } from "@/components/sequences/sequence-monitoring-stats"
// import { AdvancedSequenceBuilder } from "@/components/sequences/advanced-sequence-builder"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft, Plus, Settings } from "lucide-react"
// import Link from "next/link"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// export default async function SequenceDetailPage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params

//   const user = await getCurrentUserFromDb()
//   if (!user) notFound()

//   const campaign = await db.campaign.findUnique({
//     where: { id, userId: user.id },
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

//   const scheduleStats = await db.sendingSchedule.groupBy({
//     by: ["status"],
//     where: {
//       campaignId: id,
//     },
//     _count: true,
//   })

//   const prospectsByStep = await db.sendingSchedule.findMany({
//     where: {
//       campaignId: id,
//     },
//     include: {
//       prospect: {
//         select: {
//           id: true,
//           firstName: true,
//           lastName: true,
//           email: true,
//           company: true,
//           status: true,
//         },
//       },
//     },
//     orderBy: { scheduledFor: "asc" },
//     take: 50,
//   })

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

//       <SequenceMonitoringStats scheduleStats={scheduleStats} prospectsByStep={prospectsByStep} />

//       <Tabs defaultValue="flow" className="space-y-6">
//         <TabsList>
//           <TabsTrigger value="flow">Sequence Flow</TabsTrigger>
//           <TabsTrigger value="automation">Automation Rules</TabsTrigger>
//         </TabsList>

//         <TabsContent value="flow">
//           <SequenceFlowVisualization sequences={campaign.emailSequences} campaignName={campaign.name} />
//         </TabsContent>

//         <TabsContent value="automation">
//           <AdvancedSequenceBuilder campaignId={id} />
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }


import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { getCurrentUserFromDb } from "@/lib/auth"
import { SequenceFlowVisualization } from "@/components/sequences/sequence-flow-visualization"
import { SequenceMonitoringStats } from "@/components/sequences/sequence-monitoring-stats"
import { AdvancedSequenceBuilder } from "@/components/sequences/advanced-sequence-builder"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Settings, Play, Pause, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

  const isActive = campaign.status === "ACTIVE"

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/sequences">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">{campaign.name}</h1>
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={
                    isActive ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" : ""
                  }
                >
                  {isActive ? "Active" : campaign.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {campaign.emailSequences.length} step{campaign.emailSequences.length !== 1 ? "s" : ""} in this sequence
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            {isActive ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Activate
              </>
            )}
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Step
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>Duplicate Sequence</DropdownMenuItem>
              <DropdownMenuItem>Export Data</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete Sequence</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats */}
      <SequenceMonitoringStats scheduleStats={scheduleStats} prospectsByStep={prospectsByStep} />

      {/* Tabs */}
      <Tabs defaultValue="flow" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="flow">Sequence Flow</TabsTrigger>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="flow" className="mt-6">
          <SequenceFlowVisualization sequences={campaign.emailSequences} campaignName={campaign.name} />
        </TabsContent>

        <TabsContent value="automation" className="mt-6">
          <AdvancedSequenceBuilder campaignId={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
