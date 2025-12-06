// "use client"

// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Mail, Phone, Linkedin } from "lucide-react"

// const leads = [
//   {
//     id: 1,
//     name: "Sarah Williams",
//     company: "Enterprise Tech",
//     title: "VP of Sales",
//     email: "sarah@enterprisetech.com",
//     phone: "+1 555-0123",
//     aiScore: 94,
//     status: "hot",
//     source: "LinkedIn",
//     lastContact: "Today",
//   },
//   {
//     id: 2,
//     name: "David Chen",
//     company: "StartupXYZ",
//     title: "CEO",
//     email: "david@startupxyz.com",
//     phone: "+1 555-0124",
//     aiScore: 88,
//     status: "warm",
//     source: "Website",
//     lastContact: "2 days ago",
//   },
//   {
//     id: 3,
//     name: "Emily Rodriguez",
//     company: "MegaCorp",
//     title: "Director of Marketing",
//     email: "emily@megacorp.com",
//     phone: "+1 555-0125",
//     aiScore: 76,
//     status: "cold",
//     source: "Referral",
//     lastContact: "1 week ago",
//   },
// ]

// export function CrmLeadsList() {
//   return (
//     <Card>
//       <CardContent className="p-0">
//         <div className="divide-y">
//           {leads.map((lead) => (
//             <div key={lead.id} className="p-6 hover:bg-muted/50 transition-colors">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-start gap-4">
//                   <Avatar className="h-12 w-12">
//                     <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
//                   </Avatar>
//                   <div className="space-y-1">
//                     <div className="flex items-center gap-2">
//                       <h3 className="font-semibold">{lead.name}</h3>
//                       <Badge
//                         variant={lead.status === "hot" ? "default" : "secondary"}
//                         className={
//                           lead.status === "hot"
//                             ? "bg-red-500"
//                             : lead.status === "warm"
//                               ? "bg-orange-500"
//                               : "bg-blue-500"
//                         }
//                       >
//                         {lead.status.toUpperCase()}
//                       </Badge>
//                       <Badge variant="outline">AI Score: {lead.aiScore}</Badge>
//                     </div>
//                     <p className="text-sm text-muted-foreground">
//                       {lead.title} at {lead.company}
//                     </p>
//                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                       <span className="flex items-center gap-1">
//                         <Mail className="h-3 w-3" />
//                         {lead.email}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Phone className="h-3 w-3" />
//                         {lead.phone}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                       <span>Source: {lead.source}</span>
//                       <span>•</span>
//                       <span>Last contact: {lead.lastContact}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button size="sm" variant="outline">
//                     <Mail className="h-4 w-4 mr-2" />
//                     Email
//                   </Button>
//                   <Button size="sm" variant="outline">
//                     <Linkedin className="h-4 w-4 mr-2" />
//                     View Profile
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mail, Phone, Linkedin, Search, Filter, MoreHorizontal, Flame, Snowflake, Sun } from "lucide-react"

const leads = [
  {
    id: 1,
    name: "Sarah Williams",
    company: "Enterprise Tech",
    title: "VP of Sales",
    email: "sarah@enterprisetech.com",
    phone: "+1 555-0123",
    aiScore: 94,
    status: "hot",
    source: "LinkedIn",
    lastContact: "Today",
  },
  {
    id: 2,
    name: "David Chen",
    company: "StartupXYZ",
    title: "CEO",
    email: "david@startupxyz.com",
    phone: "+1 555-0124",
    aiScore: 88,
    status: "warm",
    source: "Website",
    lastContact: "2 days ago",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    company: "MegaCorp",
    title: "Director of Marketing",
    email: "emily@megacorp.com",
    phone: "+1 555-0125",
    aiScore: 76,
    status: "cold",
    source: "Referral",
    lastContact: "1 week ago",
  },
  {
    id: 4,
    name: "Alex Thompson",
    company: "InnovateCo",
    title: "CTO",
    email: "alex@innovateco.com",
    phone: "+1 555-0126",
    aiScore: 91,
    status: "hot",
    source: "Conference",
    lastContact: "Yesterday",
  },
]

const statusConfig = {
  hot: {
    icon: Flame,
    color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    label: "HOT",
  },
  warm: {
    icon: Sun,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    label: "WARM",
  },
  cold: {
    icon: Snowflake,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    label: "COLD",
  },
}

export function CrmLeadsList() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CardTitle>All Leads</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              className="pl-9 w-[200px] bg-background/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="divide-y divide-border/50">
            {filteredLeads.map((lead, index) => {
              const status = statusConfig[lead.status as keyof typeof statusConfig]
              const StatusIcon = status.icon

              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group p-5 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-semibold">
                          {lead.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{lead.name}</h3>
                          <Badge variant="outline" className={status.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            AI: {lead.aiScore}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {lead.title} at <span className="font-medium text-foreground">{lead.company}</span>
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
                            <Mail className="h-3.5 w-3.5" />
                            {lead.email}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />
                            {lead.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                          <Badge variant="outline" className="text-xs font-normal">
                            {lead.source}
                          </Badge>
                          <span>Last contact: {lead.lastContact}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="outline" className="shadow-sm bg-transparent">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Button size="sm" variant="outline" className="shadow-sm bg-transparent">
                        <Linkedin className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
