"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DollarSign, TrendingUp } from "lucide-react"

const stages = [
  { name: "New Leads", count: 45, value: 89000, color: "bg-blue-500" },
  { name: "Contacted", count: 32, value: 67000, color: "bg-purple-500" },
  { name: "Qualified", count: 18, value: 45000, color: "bg-yellow-500" },
  { name: "Proposal", count: 12, value: 28000, color: "bg-orange-500" },
  { name: "Closed Won", count: 8, value: 15000, color: "bg-green-500" },
]

const deals = [
  {
    id: 1,
    company: "Acme Corp",
    contact: "John Doe",
    value: 15000,
    aiScore: 92,
    stage: "Proposal",
    lastActivity: "2 hours ago",
  },
  {
    id: 2,
    company: "TechStart Inc",
    contact: "Jane Smith",
    value: 8500,
    aiScore: 87,
    stage: "Qualified",
    lastActivity: "5 hours ago",
  },
  {
    id: 3,
    company: "Global Solutions",
    contact: "Mike Johnson",
    value: 22000,
    aiScore: 95,
    stage: "Proposal",
    lastActivity: "1 day ago",
  },
]

export function CrmPipeline() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-5">
        {stages.map((stage) => (
          <Card key={stage.name}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className={`h-2 rounded-full ${stage.color}`} />
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{stage.count}</span>
                  <span className="text-sm text-muted-foreground">${(stage.value / 1000).toFixed(0)}K</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hot Deals (AI Score &gt; 85)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deals.map((deal) => (
              <div key={deal.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{deal.contact.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{deal.company}</p>
                    <p className="text-sm text-muted-foreground">{deal.contact}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">${deal.value.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{deal.lastActivity}</p>
                  </div>
                  <Badge variant="default" className="bg-green-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {deal.aiScore}
                  </Badge>
                  <Badge variant="outline">{deal.stage}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
