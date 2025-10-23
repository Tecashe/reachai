import { Card } from "@/components/ui/card"
import { Mail, MessageSquare, ThumbsUp } from "lucide-react"

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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Replies</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <Mail className="h-8 w-8 text-muted-foreground" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Interested</p>
            <p className="text-3xl font-bold text-green-600">{stats.byCategory.interested}</p>
          </div>
          <ThumbsUp className="h-8 w-8 text-green-600" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Questions</p>
            <p className="text-3xl font-bold text-blue-600">{stats.byCategory.questions}</p>
          </div>
          <MessageSquare className="h-8 w-8 text-blue-600" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Response Rate</p>
            <p className="text-3xl font-bold">{stats.responseRate.toFixed(1)}%</p>
          </div>
          <ThumbsUp className="h-8 w-8 text-muted-foreground" />
        </div>
      </Card>
    </div>
  )
}
