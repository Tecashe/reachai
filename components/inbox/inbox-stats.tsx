import { Badge } from "@/components/ui/badge"
import { Mail, ThumbsUp, MessageSquare, TrendingUp } from "lucide-react"

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
  return (
    <div className="hidden md:flex items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
          <Mail className="h-4 w-4 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold leading-none">{stats.total}</span>
          <span className="text-[10px] text-muted-foreground">Total</span>
        </div>
      </div>

      <div className="h-8 w-px bg-border/50" />

      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-500/10">
          <ThumbsUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold leading-none text-emerald-600 dark:text-emerald-400">
            {stats.byCategory.interested}
          </span>
          <span className="text-[10px] text-muted-foreground">Interested</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-500/10">
          <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold leading-none text-blue-600 dark:text-blue-400">
            {stats.byCategory.questions}
          </span>
          <span className="text-[10px] text-muted-foreground">Questions</span>
        </div>
      </div>

      <div className="h-8 w-px bg-border/50" />

      <Badge variant="secondary" className="h-7 px-2.5 gap-1.5 bg-muted/50 border border-border/50">
        <TrendingUp className="h-3 w-3" />
        <span className="font-semibold">{stats.responseRate.toFixed(1)}%</span>
        <span className="text-muted-foreground text-[10px]">rate</span>
      </Badge>
    </div>
  )
}
