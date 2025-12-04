// import { Card } from "@/components/ui/card"
// import { Mail, MessageSquare, ThumbsUp } from "lucide-react"

// interface InboxStatsProps {
//   stats: {
//     total: number
//     byCategory: {
//       interested: number
//       questions: number
//       notInterested: number
//       unsubscribes: number
//     }
//     bySentiment: {
//       positive: number
//       neutral: number
//       negative: number
//     }
//     responseRate: number
//   }
// }

// export function InboxStats({ stats }: InboxStatsProps) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//       <Card className="p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-muted-foreground">Total Replies</p>
//             <p className="text-3xl font-bold">{stats.total}</p>
//           </div>
//           <Mail className="h-8 w-8 text-muted-foreground" />
//         </div>
//       </Card>

//       <Card className="p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-muted-foreground">Interested</p>
//             <p className="text-3xl font-bold text-green-600">{stats.byCategory.interested}</p>
//           </div>
//           <ThumbsUp className="h-8 w-8 text-green-600" />
//         </div>
//       </Card>

//       <Card className="p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-muted-foreground">Questions</p>
//             <p className="text-3xl font-bold text-blue-600">{stats.byCategory.questions}</p>
//           </div>
//           <MessageSquare className="h-8 w-8 text-blue-600" />
//         </div>
//       </Card>

//       <Card className="p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-muted-foreground">Response Rate</p>
//             <p className="text-3xl font-bold">{stats.responseRate.toFixed(1)}%</p>
//           </div>
//           <ThumbsUp className="h-8 w-8 text-muted-foreground" />
//         </div>
//       </Card>
//     </div>
//   )
// }
import { Card } from "@/components/ui/card"
import { Mail, MessageSquare, ThumbsUp, TrendingUp } from "lucide-react"

interface InboxStatsProps {
  stats: {
    total: number
    byCategory: {
      interested: number
      questions: number
      notInterested: number
      unsubscribes: number
    }
    bySentiment: {
      positive: number
      neutral: number
      negative: number
    }
    responseRate: number
  }
}

export function InboxStats({ stats }: InboxStatsProps) {
  const statCards = [
    {
      label: "Total Replies",
      value: stats.total,
      icon: Mail,
      color: "text-foreground",
      bgColor: "bg-primary/5",
      iconBg: "bg-primary/10",
    },
    {
      label: "Interested",
      value: stats.byCategory.interested,
      icon: ThumbsUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/5",
      iconBg: "bg-emerald-500/10",
    },
    {
      label: "Questions",
      value: stats.byCategory.questions,
      icon: MessageSquare,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/5",
      iconBg: "bg-blue-500/10",
    },
    {
      label: "Response Rate",
      value: `${stats.responseRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-foreground",
      bgColor: "bg-primary/5",
      iconBg: "bg-primary/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card
          key={stat.label}
          className={`relative overflow-hidden border-border/50 ${stat.bgColor} backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 group`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className={`text-3xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`rounded-xl ${stat.iconBg} p-3 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
          {/* Subtle gradient accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-border/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Card>
      ))}
    </div>
  )
}
