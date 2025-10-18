import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, MoreVertical } from "lucide-react"

const sequences = [
  {
    id: "1",
    name: "Cold Outreach - 3 Step",
    description: "Initial outreach with 2 follow-ups",
    steps: 3,
    activeProspects: 45,
    openRate: "42%",
    replyRate: "18%",
    status: "active",
  },
  {
    id: "2",
    name: "Product Demo Follow-up",
    description: "Post-demo nurture sequence",
    steps: 4,
    activeProspects: 23,
    openRate: "68%",
    replyRate: "34%",
    status: "active",
  },
  {
    id: "3",
    name: "Re-engagement Campaign",
    description: "Win back cold prospects",
    steps: 2,
    activeProspects: 12,
    openRate: "28%",
    replyRate: "9%",
    status: "paused",
  },
]

export function SequencesList() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sequences.map((sequence) => (
        <Card key={sequence.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{sequence.name}</CardTitle>
                <CardDescription>{sequence.description}</CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{sequence.steps} steps</span>
              </div>
              <Badge variant={sequence.status === "active" ? "default" : "secondary"}>{sequence.status}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active Prospects</span>
                <span className="font-medium">{sequence.activeProspects}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Open Rate</span>
                <span className="font-medium">{sequence.openRate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Reply Rate</span>
                <span className="font-medium">{sequence.replyRate}</span>
              </div>
            </div>

            <Button className="w-full bg-transparent" variant="outline">
              View Sequence
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
