"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Zap, Clock, ArrowRight, CheckCircle2, Mail, Bell, Tag, Pause, TrendingUp } from "lucide-react"

export function SequenceSystemInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          How Sequences & Automation Work
        </CardTitle>
        <CardDescription>Understanding the two systems that power your outreach</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sequence">Sequence Flow</TabsTrigger>
            <TabsTrigger value="automation">Automation Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-blue-50/50 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Sequence Flow</h4>
                </div>
                <p className="text-sm text-blue-700">
                  Linear email steps sent at defined intervals. Think of it as your default outreach path.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-blue-600">
                  <Badge variant="outline" className="bg-white">
                    Step 1
                  </Badge>
                  <ArrowRight className="h-3 w-3" />
                  <Badge variant="outline" className="bg-white">
                    Step 2
                  </Badge>
                  <ArrowRight className="h-3 w-3" />
                  <Badge variant="outline" className="bg-white">
                    Step 3
                  </Badge>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-purple-50/50 border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">Automation Rules</h4>
                </div>
                <p className="text-sm text-purple-700">
                  Conditional triggers based on behavior. Handle exceptions and hot leads automatically.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-purple-600">
                  <Badge variant="outline" className="bg-white">
                    IF opened
                  </Badge>
                  <ArrowRight className="h-3 w-3" />
                  <Badge variant="outline" className="bg-white">
                    THEN notify
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-muted/30">
              <h4 className="font-semibold mb-2">Working Together</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Both systems run every 15 minutes. Sequence Flow sends scheduled emails, while Automation Rules watch
                for behaviors and trigger special actions.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Automation rules take priority over sequence flow</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sequence" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">How Sequence Flow Works</h4>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Badge className="mt-0.5">1</Badge>
                  <span>When campaign launches, prospects start at Step 1</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="mt-0.5">2</Badge>
                  <span>After each email, system waits X days before next step</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="mt-0.5">3</Badge>
                  <span>Conditions can skip steps (e.g., "only if not replied")</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="mt-0.5">4</Badge>
                  <span>Sequence ends when all steps complete or prospect replies</span>
                </li>
              </ol>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <h5 className="text-sm font-medium mb-2">Example Sequence</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>Step 1: Cold intro</span>
                  <Badge variant="outline">Day 0</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>Step 2: Value prop follow-up</span>
                  <Badge variant="outline">Day 3</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>Step 3: Social proof</span>
                  <Badge variant="outline">Day 7</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Trigger Types</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                  <Badge variant="outline">Opened</Badge>
                  <span>Email was opened</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                  <Badge variant="outline">Clicked</Badge>
                  <span>Link was clicked</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                  <Badge variant="outline">Replied</Badge>
                  <span>Got a reply</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                  <Badge variant="outline">No Open</Badge>
                  <span>No opens after X hours</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Action Types</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span>Send Email</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-green-600" />
                  <span>Add Tag</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-yellow-600" />
                  <span>Send Notification</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-purple-600" />
                  <span>Move to Sequence</span>
                </div>
                <div className="flex items-center gap-2">
                  <Pause className="h-4 w-4 text-orange-600" />
                  <span>Pause Sequence</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  <span>Create CRM Deal</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
