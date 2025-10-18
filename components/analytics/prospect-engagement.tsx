// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"

// const engagementLevels = [
//   { level: "Hot", count: 234, percentage: 7.2, color: "bg-red-500" },
//   { level: "Warm", count: 892, percentage: 27.5, color: "bg-orange-500" },
//   { level: "Cold", count: 1456, percentage: 44.8, color: "bg-blue-500" },
//   { level: "Unresponsive", count: 665, percentage: 20.5, color: "bg-gray-500" },
// ]

// const topProspects = [
//   { name: "Sarah Johnson", company: "TechCorp", score: 95, emails: 5, replies: 4 },
//   { name: "Michael Chen", company: "StartupXYZ", score: 92, emails: 4, replies: 3 },
//   { name: "Emily Rodriguez", company: "InnovateCo", score: 88, emails: 6, replies: 4 },
//   { name: "David Kim", company: "FutureTech", score: 85, emails: 3, replies: 2 },
//   { name: "Lisa Anderson", company: "GrowthLabs", score: 82, emails: 5, replies: 3 },
// ]

// export function ProspectEngagement() {
//   return (
//     <div className="grid gap-6 md:grid-cols-2">
//       <Card>
//         <CardHeader>
//           <CardTitle>Engagement Distribution</CardTitle>
//           <CardDescription>Prospects by engagement level</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {engagementLevels.map((level) => (
//             <div key={level.level} className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div className={`h-3 w-3 rounded-full ${level.color}`} />
//                   <span className="font-medium">{level.level}</span>
//                 </div>
//                 <div className="text-right">
//                   <span className="font-semibold">{level.count}</span>
//                   <span className="text-sm text-muted-foreground ml-2">({level.percentage}%)</span>
//                 </div>
//               </div>
//               <div className="h-2 bg-muted rounded-full overflow-hidden">
//                 <div className={`h-full ${level.color}`} style={{ width: `${level.percentage}%` }} />
//               </div>
//             </div>
//           ))}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Most Engaged Prospects</CardTitle>
//           <CardDescription>Top prospects by engagement score</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {topProspects.map((prospect, index) => (
//               <div key={index} className="flex items-center justify-between">
//                 <div className="space-y-1">
//                   <p className="font-medium">{prospect.name}</p>
//                   <p className="text-sm text-muted-foreground">{prospect.company}</p>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <div className="text-right text-sm">
//                     <p className="text-muted-foreground">
//                       {prospect.replies}/{prospect.emails} replies
//                     </p>
//                   </div>
//                   <Badge variant="secondary" className="font-semibold">
//                     {prospect.score}
//                   </Badge>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface ProspectEngagementProps {
  engagementLevels: {
    hot: number
    warm: number
    cold: number
    unresponsive: number
  }
  topProspects: Array<{
    id: string
    firstName: string
    lastName: string
    company: string
    qualityScore: number
    emailsSent: number
    emailsReplied: number
  }>
}

export function ProspectEngagement({ engagementLevels, topProspects }: ProspectEngagementProps) {
  const total = engagementLevels.hot + engagementLevels.warm + engagementLevels.cold + engagementLevels.unresponsive

  const levels = [
    {
      level: "Hot",
      count: engagementLevels.hot,
      percentage: total > 0 ? (engagementLevels.hot / total) * 100 : 0,
      color: "bg-red-500",
    },
    {
      level: "Warm",
      count: engagementLevels.warm,
      percentage: total > 0 ? (engagementLevels.warm / total) * 100 : 0,
      color: "bg-orange-500",
    },
    {
      level: "Cold",
      count: engagementLevels.cold,
      percentage: total > 0 ? (engagementLevels.cold / total) * 100 : 0,
      color: "bg-blue-500",
    },
    {
      level: "Unresponsive",
      count: engagementLevels.unresponsive,
      percentage: total > 0 ? (engagementLevels.unresponsive / total) * 100 : 0,
      color: "bg-gray-500",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Engagement Distribution</CardTitle>
          <CardDescription>Prospects by engagement level</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {levels.map((level) => (
            <div key={level.level} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${level.color}`} />
                  <span className="font-medium">{level.level}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{level.count}</span>
                  <span className="text-sm text-muted-foreground ml-2">({level.percentage.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${level.color}`} style={{ width: `${level.percentage}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most Engaged Prospects</CardTitle>
          <CardDescription>Top prospects by engagement score</CardDescription>
        </CardHeader>
        <CardContent>
          {topProspects.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No prospects yet</p>
          ) : (
            <div className="space-y-4">
              {topProspects.map((prospect) => (
                <Link
                  key={prospect.id}
                  href={`/dashboard/prospects/${prospect.id}`}
                  className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-lg transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      {prospect.firstName} {prospect.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{prospect.company}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">
                        {prospect.emailsReplied}/{prospect.emailsSent} replies
                      </p>
                    </div>
                    <Badge variant="secondary" className="font-semibold">
                      {prospect.qualityScore}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
