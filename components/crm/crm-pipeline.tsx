// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { DollarSign, TrendingUp } from "lucide-react"

// const stages = [
//   { name: "New Leads", count: 45, value: 89000, color: "bg-blue-500" },
//   { name: "Contacted", count: 32, value: 67000, color: "bg-purple-500" },
//   { name: "Qualified", count: 18, value: 45000, color: "bg-yellow-500" },
//   { name: "Proposal", count: 12, value: 28000, color: "bg-orange-500" },
//   { name: "Closed Won", count: 8, value: 15000, color: "bg-green-500" },
// ]

// const deals = [
//   {
//     id: 1,
//     company: "Acme Corp",
//     contact: "John Doe",
//     value: 15000,
//     aiScore: 92,
//     stage: "Proposal",
//     lastActivity: "2 hours ago",
//   },
//   {
//     id: 2,
//     company: "TechStart Inc",
//     contact: "Jane Smith",
//     value: 8500,
//     aiScore: 87,
//     stage: "Qualified",
//     lastActivity: "5 hours ago",
//   },
//   {
//     id: 3,
//     company: "Global Solutions",
//     contact: "Mike Johnson",
//     value: 22000,
//     aiScore: 95,
//     stage: "Proposal",
//     lastActivity: "1 day ago",
//   },
// ]

// export function CrmPipeline() {
//   return (
//     <div className="space-y-6">
//       <div className="grid gap-4 md:grid-cols-5">
//         {stages.map((stage) => (
//           <Card key={stage.name}>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2">
//                 <div className={`h-2 rounded-full ${stage.color}`} />
//                 <div className="flex items-center justify-between">
//                   <span className="text-2xl font-bold">{stage.count}</span>
//                   <span className="text-sm text-muted-foreground">${(stage.value / 1000).toFixed(0)}K</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Hot Deals (AI Score &gt; 85)</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {deals.map((deal) => (
//               <div key={deal.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
//                 <div className="flex items-center gap-4">
//                   <Avatar>
//                     <AvatarFallback>{deal.contact.charAt(0)}</AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-medium">{deal.company}</p>
//                     <p className="text-sm text-muted-foreground">{deal.contact}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <div className="text-right">
//                     <div className="flex items-center gap-2">
//                       <DollarSign className="h-4 w-4 text-muted-foreground" />
//                       <span className="font-medium">${deal.value.toLocaleString()}</span>
//                     </div>
//                     <p className="text-xs text-muted-foreground">{deal.lastActivity}</p>
//                   </div>
//                   <Badge variant="default" className="bg-green-500">
//                     <TrendingUp className="h-3 w-3 mr-1" />
//                     {deal.aiScore}
//                   </Badge>
//                   <Badge variant="outline">{deal.stage}</Badge>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// "use client"

// import { motion } from "framer-motion"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
// import { DollarSign, TrendingUp, Clock, MoreHorizontal } from "lucide-react"
// import { Button } from "@/components/ui/button"

// const stages = [
//   { name: "New Leads", count: 45, value: 89000, color: "bg-blue-500", lightColor: "bg-blue-500/10" },
//   { name: "Contacted", count: 32, value: 67000, color: "bg-purple-500", lightColor: "bg-purple-500/10" },
//   { name: "Qualified", count: 18, value: 45000, color: "bg-amber-500", lightColor: "bg-amber-500/10" },
//   { name: "Proposal", count: 12, value: 28000, color: "bg-orange-500", lightColor: "bg-orange-500/10" },
//   { name: "Closed Won", count: 8, value: 15000, color: "bg-emerald-500", lightColor: "bg-emerald-500/10" },
// ]

// const deals = [
//   {
//     id: 1,
//     company: "Acme Corp",
//     contact: "John Doe",
//     value: 15000,
//     aiScore: 92,
//     stage: "Proposal",
//     lastActivity: "2 hours ago",
//     avatar: "JD",
//   },
//   {
//     id: 2,
//     company: "TechStart Inc",
//     contact: "Jane Smith",
//     value: 8500,
//     aiScore: 87,
//     stage: "Qualified",
//     lastActivity: "5 hours ago",
//     avatar: "JS",
//   },
//   {
//     id: 3,
//     company: "Global Solutions",
//     contact: "Mike Johnson",
//     value: 22000,
//     aiScore: 95,
//     stage: "Proposal",
//     lastActivity: "1 day ago",
//     avatar: "MJ",
//   },
// ]

// export function CrmPipeline() {
//   const totalValue = stages.reduce((sum, s) => sum + s.value, 0)

//   return (
//     <div className="space-y-6">
//       {/* Pipeline stages - horizontal scroll on mobile */}
//       <ScrollArea className="w-full">
//         <div className="flex gap-4 pb-4 min-w-max">
//           {stages.map((stage, index) => (
//             <motion.div
//               key={stage.name}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className="w-[200px] flex-shrink-0"
//             >
//               <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-xl border-border/50 hover:shadow-lg hover:shadow-foreground/[0.02] transition-all duration-300">
//                 <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

//                 <CardContent className="relative p-5">
//                   <div className="flex items-center justify-between mb-4">
//                     <p className="text-sm font-medium text-muted-foreground">{stage.name}</p>
//                     <div className={`w-2 h-2 rounded-full ${stage.color}`} />
//                   </div>

//                   {/* Progress bar */}
//                   <div className="h-1.5 rounded-full bg-muted/50 mb-4 overflow-hidden">
//                     <motion.div
//                       className={`h-full rounded-full ${stage.color}`}
//                       initial={{ width: 0 }}
//                       animate={{ width: `${(stage.value / totalValue) * 100}%` }}
//                       transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
//                     />
//                   </div>

//                   <div className="flex items-end justify-between">
//                     <div>
//                       <p className="text-3xl font-bold">{stage.count}</p>
//                       <p className="text-xs text-muted-foreground">leads</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-lg font-semibold">${(stage.value / 1000).toFixed(0)}K</p>
//                       <p className="text-xs text-muted-foreground">value</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//         <ScrollBar orientation="horizontal" />
//       </ScrollArea>

//       {/* Hot Deals */}
//       <Card className="bg-card/50 backdrop-blur-xl border-border/50">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <div>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="w-5 h-5 text-emerald-500" />
//               Hot Deals
//             </CardTitle>
//             <p className="text-sm text-muted-foreground mt-1">AI Score &gt; 85</p>
//           </div>
//           <Button variant="ghost" size="sm">
//             View All
//           </Button>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             {deals.map((deal, index) => (
//               <motion.div
//                 key={deal.id}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="group flex items-center justify-between p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 hover:border-border/50 hover:shadow-md transition-all duration-300"
//               >
//                 <div className="flex items-center gap-4">
//                   <Avatar className="h-11 w-11 border-2 border-background shadow-sm">
//                     <AvatarFallback className="bg-primary/10 text-primary font-medium">{deal.avatar}</AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-semibold">{deal.company}</p>
//                     <p className="text-sm text-muted-foreground">{deal.contact}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-6">
//                   <div className="text-right hidden sm:block">
//                     <div className="flex items-center gap-1.5 text-muted-foreground">
//                       <Clock className="w-3.5 h-3.5" />
//                       <span className="text-xs">{deal.lastActivity}</span>
//                     </div>
//                   </div>

//                   <div className="text-right">
//                     <div className="flex items-center gap-1">
//                       <DollarSign className="h-4 w-4 text-muted-foreground" />
//                       <span className="font-semibold">{deal.value.toLocaleString()}</span>
//                     </div>
//                   </div>

//                   <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold">
//                     <TrendingUp className="h-3 w-3 mr-1" />
//                     {deal.aiScore}
//                   </Badge>

//                   <Badge variant="outline" className="hidden md:flex">
//                     {deal.stage}
//                   </Badge>

//                   <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
//                     <MoreHorizontal className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// "use client"

// import { useEffect, useState } from "react"
// import { motion } from "framer-motion"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
// import { Skeleton } from "@/components/ui/skeleton"
// import { TrendingUp, Clock, MoreHorizontal } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { getPipelineStages, getHotDeals } from "@/lib/actions/crm"

// interface PipelineStage {
//   name: string
//   count: number
//   value: number
// }

// interface HotDeal {
//   id: string
//   email: string
//   firstName: string | null
//   lastName: string | null
//   company: string | null
//   dealScore: number | null
//   crmSyncedAt: Date | null
// }

// export function CrmPipeline() {
//   const [stages, setStages] = useState<PipelineStage[]>([])
//   const [deals, setDeals] = useState<HotDeal[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function loadData() {
//       try {
//         const [stagesResult, dealsResult] = await Promise.all([getPipelineStages(), getHotDeals(5)])

//         if (stagesResult.success && stagesResult.data) {
//           setStages(stagesResult.data)
//         }
//         if (dealsResult.success && dealsResult.data) {
//           setDeals(dealsResult.data)
//         }
//       } catch (error) {
//         console.error("[CRM Pipeline] Error loading data:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadData()
//   }, [])

//   const totalValue = stages.reduce((sum, s) => sum + s.value, 0)

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex gap-4">
//           {[...Array(5)].map((_, i) => (
//             <Skeleton key={i} className="h-40 w-[200px] flex-shrink-0" />
//           ))}
//         </div>
//         <Skeleton className="h-64 w-full" />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Pipeline stages */}
//       <ScrollArea className="w-full">
//         <div className="flex gap-4 pb-4 min-w-max">
//           {stages.map((stage, index) => (
//             <motion.div
//               key={stage.name}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className="w-[200px] flex-shrink-0"
//             >
//               <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-xl border-border/50 hover:shadow-lg hover:shadow-foreground/[0.02] transition-all duration-300">
//                 <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

//                 <CardContent className="relative p-5">
//                   <div className="flex items-center justify-between mb-4">
//                     <p className="text-sm font-medium text-muted-foreground">{stage.name}</p>
//                     <div className="w-2 h-2 rounded-full bg-foreground/30" />
//                   </div>

//                   {/* Progress bar */}
//                   <div className="h-1.5 rounded-full bg-muted/50 mb-4 overflow-hidden">
//                     <motion.div
//                       className="h-full rounded-full bg-foreground/50"
//                       initial={{ width: 0 }}
//                       animate={{ width: totalValue > 0 ? `${(stage.value / totalValue) * 100}%` : "0%" }}
//                       transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
//                     />
//                   </div>

//                   <div className="flex items-end justify-between">
//                     <div>
//                       <p className="text-3xl font-bold">{stage.count}</p>
//                       <p className="text-xs text-muted-foreground">leads</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-lg font-semibold">${(stage.value / 1000).toFixed(0)}K</p>
//                       <p className="text-xs text-muted-foreground">value</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//         <ScrollBar orientation="horizontal" />
//       </ScrollArea>

//       {/* Hot Deals */}
//       <Card className="bg-card/50 backdrop-blur-xl border-border/50">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <div>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="w-5 h-5 text-foreground/70" />
//               Hot Deals
//             </CardTitle>
//             <p className="text-sm text-muted-foreground mt-1">AI Score &gt; 70</p>
//           </div>
//           <Button variant="ghost" size="sm">
//             View All
//           </Button>
//         </CardHeader>
//         <CardContent>
//           {deals.length === 0 ? (
//             <div className="text-center py-8 text-muted-foreground">
//               <p>No hot deals yet. Sync your CRM to see leads with high AI scores.</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {deals.map((deal, index) => {
//                 const name = [deal.firstName, deal.lastName].filter(Boolean).join(" ") || deal.email
//                 const initials =
//                   deal.firstName && deal.lastName
//                     ? `${deal.firstName[0]}${deal.lastName[0]}`
//                     : deal.email.substring(0, 2).toUpperCase()
//                 const lastActivity = deal.crmSyncedAt ? new Date(deal.crmSyncedAt).toLocaleDateString() : "Never"

//                 return (
//                   <motion.div
//                     key={deal.id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                     className="group flex items-center justify-between p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 hover:border-border/50 hover:shadow-md transition-all duration-300"
//                   >
//                     <div className="flex items-center gap-4">
//                       <Avatar className="h-11 w-11 border-2 border-background shadow-sm">
//                         <AvatarFallback className="bg-foreground/5 text-foreground font-medium">
//                           {initials}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <p className="font-semibold">{deal.company || "Unknown Company"}</p>
//                         <p className="text-sm text-muted-foreground">{name}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-6">
//                       <div className="text-right hidden sm:block">
//                         <div className="flex items-center gap-1.5 text-muted-foreground">
//                           <Clock className="w-3.5 h-3.5" />
//                           <span className="text-xs">{lastActivity}</span>
//                         </div>
//                       </div>

//                       <Badge className="bg-foreground/10 text-foreground border-foreground/20 font-semibold">
//                         <TrendingUp className="h-3 w-3 mr-1" />
//                         {deal.dealScore || 0}
//                       </Badge>

//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <MoreHorizontal className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </motion.div>
//                 )
//               })}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, Clock, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PipelineStage {
  name: string
  count: number
  value: number
}

interface HotDeal {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  company: string | null
  dealScore: number | null
  crmSyncedAt: Date | null
}

export function CrmPipeline() {
  const [stages, setStages] = useState<PipelineStage[]>([])
  const [deals, setDeals] = useState<HotDeal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [pipelineRes, dealsRes] = await Promise.all([fetch("/api/crm/pipeline"), fetch("/api/crm/deals?limit=5")])

        const pipelineData = await pipelineRes.json()
        const dealsData = await dealsRes.json()

        if (pipelineData.success && pipelineData.data) {
          setStages(pipelineData.data)
        }
        if (dealsData.success && dealsData.data) {
          setDeals(dealsData.data)
        }
      } catch (error) {
        console.error("[CRM Pipeline] Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const totalValue = stages.reduce((sum, s) => sum + s.value, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-[200px] flex-shrink-0" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Pipeline stages */}
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4 min-w-max">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-[200px] flex-shrink-0"
            >
              <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-xl border-border/50 hover:shadow-lg hover:shadow-foreground/[0.02] transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <CardContent className="relative p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-muted-foreground">{stage.name}</p>
                    <div className="w-2 h-2 rounded-full bg-foreground/30" />
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full bg-muted/50 mb-4 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-foreground/50"
                      initial={{ width: 0 }}
                      animate={{ width: totalValue > 0 ? `${(stage.value / totalValue) * 100}%` : "0%" }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    />
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold">{stage.count}</p>
                      <p className="text-xs text-muted-foreground">leads</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">${(stage.value / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-muted-foreground">value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Hot Deals */}
      <Card className="bg-card/50 backdrop-blur-xl border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-foreground/70" />
              Hot Deals
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">AI Score &gt; 70</p>
          </div>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {deals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hot deals yet. Sync your CRM to see leads with high AI scores.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deals.map((deal, index) => {
                const name = [deal.firstName, deal.lastName].filter(Boolean).join(" ") || deal.email
                const initials =
                  deal.firstName && deal.lastName
                    ? `${deal.firstName[0]}${deal.lastName[0]}`
                    : deal.email.substring(0, 2).toUpperCase()
                const lastActivity = deal.crmSyncedAt ? new Date(deal.crmSyncedAt).toLocaleDateString() : "Never"

                return (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex items-center justify-between p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 hover:border-border/50 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-11 w-11 border-2 border-background shadow-sm">
                        <AvatarFallback className="bg-foreground/5 text-foreground font-medium">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{deal.company || "Unknown Company"}</p>
                        <p className="text-sm text-muted-foreground">{name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs">{lastActivity}</span>
                        </div>
                      </div>

                      <Badge className="bg-foreground/10 text-foreground border-foreground/20 font-semibold">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {deal.dealScore || 0}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
