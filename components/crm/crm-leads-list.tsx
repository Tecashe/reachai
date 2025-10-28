"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Linkedin } from "lucide-react"

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
]

export function CrmLeadsList() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {leads.map((lead) => (
            <div key={lead.id} className="p-6 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{lead.name}</h3>
                      <Badge
                        variant={lead.status === "hot" ? "default" : "secondary"}
                        className={
                          lead.status === "hot"
                            ? "bg-red-500"
                            : lead.status === "warm"
                              ? "bg-orange-500"
                              : "bg-blue-500"
                        }
                      >
                        {lead.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">AI Score: {lead.aiScore}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {lead.title} at {lead.company}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Source: {lead.source}</span>
                      <span>•</span>
                      <span>Last contact: {lead.lastContact}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline">
                    <Linkedin className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
