// "use client"

// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
// import { Shield, Globe, Users, Zap, RefreshCw, CheckCircle2, Crown } from "lucide-react"
// import type { EmailAccount, NetworkHealth } from "../warmup-dashboard"

// interface WarmupNetworkTabProps {
//   networkHealth: NetworkHealth | null
//   userTier: "FREE" | "STARTER" | "PRO" | "AGENCY"
//   accounts: EmailAccount[]
// }

// export function WarmupNetworkTab({ networkHealth, userTier, accounts }: WarmupNetworkTabProps) {
//   const isPaidTier = userTier === "PRO" || userTier === "AGENCY"

//   const compositionData = networkHealth
//     ? [
//         { name: "Google Workspace", value: networkHealth.composition.googleWorkspace, color: "hsl(var(--chart-1))" },
//         { name: "Office 365", value: networkHealth.composition.office365, color: "hsl(var(--chart-2))" },
//         { name: "Other Premium", value: networkHealth.composition.other, color: "hsl(var(--chart-3))" },
//       ]
//     : []

//   const getLetterGrade = (score: number) => {
//     if (score >= 95) return "A+"
//     if (score >= 90) return "A"
//     if (score >= 85) return "B+"
//     if (score >= 80) return "B"
//     if (score >= 75) return "C+"
//     return "C"
//   }

//   const getGradeColor = (score: number) => {
//     if (score >= 90) return "text-success"
//     if (score >= 75) return "text-warning"
//     return "text-destructive"
//   }

//   // For Free/Starter users
//   if (!isPaidTier) {
//     return (
//       <div className="space-y-6">
//         {/* Basic Pool Access Card */}
//         <Card className="border-border">
//           <CardHeader>
//             <div className="flex items-center gap-2">
//               <Shield className="h-5 w-5 text-primary" />
//               <CardTitle>Basic Warmup Pool</CardTitle>
//             </div>
//             <CardDescription>You have access to our basic warmup pool for standard email warming</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center gap-4 p-4 bg-success-muted rounded-lg border border-success/20">
//               <CheckCircle2 className="h-8 w-8 text-success" />
//               <div>
//                 <p className="font-medium text-foreground">Basic Pool Active</p>
//                 <p className="text-sm text-muted-foreground">
//                   Your accounts are warming up using our standard pool of verified senders
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="p-4 bg-muted/50 rounded-lg">
//                 <p className="text-2xl font-bold text-foreground">5,000+</p>
//                 <p className="text-sm text-muted-foreground">Active senders in pool</p>
//               </div>
//               <div className="p-4 bg-muted/50 rounded-lg">
//                 <p className="text-2xl font-bold text-foreground">92%</p>
//                 <p className="text-sm text-muted-foreground">Average inbox rate</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Upgrade CTA */}
//         <Card className="border-primary/20 bg-primary/5">
//           <CardHeader>
//             <div className="flex items-center gap-2">
//               <Crown className="h-5 w-5 text-primary" />
//               <CardTitle>Unlock P2P Network</CardTitle>
//             </div>
//             <CardDescription>Upgrade to access our premium peer-to-peer warmup network</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid gap-3">
//               <div className="flex items-center gap-3">
//                 <CheckCircle2 className="h-4 w-4 text-primary" />
//                 <span className="text-sm">96% Google Workspace senders</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <CheckCircle2 className="h-4 w-4 text-primary" />
//                 <span className="text-sm">Smart matching based on industry</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <CheckCircle2 className="h-4 w-4 text-primary" />
//                 <span className="text-sm">98%+ average inbox placement</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <CheckCircle2 className="h-4 w-4 text-primary" />
//                 <span className="text-sm">Real-time network health monitoring</span>
//               </div>
//             </div>
//             <Button className="w-full gap-2">
//               <Crown className="h-4 w-4" />
//               Upgrade to Pro
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   // For Pro/Agency users - Full Network Dashboard
//   return (
//     <div className="space-y-6">
//       {/* Network Health Score - Hero Section */}
//       <Card className="border-border">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Network Health Score</CardTitle>
//               <CardDescription>Overall quality of your P2P warmup network</CardDescription>
//             </div>
//             <Button variant="outline" size="sm" className="gap-2 bg-transparent">
//               <RefreshCw className="h-4 w-4" />
//               Refresh Score
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col md:flex-row items-center gap-8">
//             {/* Circular Score */}
//             <div className="relative">
//               <svg className="w-40 h-40 transform -rotate-90">
//                 <circle cx="80" cy="80" r="70" stroke="hsl(var(--muted))" strokeWidth="12" fill="none" />
//                 <circle
//                   cx="80"
//                   cy="80"
//                   r="70"
//                   stroke="hsl(var(--primary))"
//                   strokeWidth="12"
//                   fill="none"
//                   strokeDasharray={`${((networkHealth?.score || 0) / 100) * 440} 440`}
//                   strokeLinecap="round"
//                 />
//               </svg>
//               <div className="absolute inset-0 flex flex-col items-center justify-center">
//                 <span className="text-4xl font-bold text-foreground">{networkHealth?.score || 0}</span>
//                 <span className={`text-xl font-semibold ${getGradeColor(networkHealth?.score || 0)}`}>
//                   {getLetterGrade(networkHealth?.score || 0)}
//                 </span>
//               </div>
//             </div>

//             {/* Score Breakdown */}
//             <div className="flex-1 space-y-4">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="p-4 bg-muted/50 rounded-lg">
//                   <p className="text-sm text-muted-foreground">Network Size</p>
//                   <p className="text-2xl font-bold text-foreground">
//                     {networkHealth?.totalSize?.toLocaleString() || "15,000"}
//                   </p>
//                   <p className="text-xs text-muted-foreground">active inboxes</p>
//                 </div>
//                 <div className="p-4 bg-muted/50 rounded-lg">
//                   <p className="text-sm text-muted-foreground">Avg Reputation</p>
//                   <p className="text-2xl font-bold text-foreground">{networkHealth?.averageReputation || 92}/100</p>
//                   <p className="text-xs text-muted-foreground">network-wide</p>
//                 </div>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 Last updated:{" "}
//                 {networkHealth?.lastUpdated ? new Date(networkHealth.lastUpdated).toLocaleString() : "Just now"}
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid gap-6 lg:grid-cols-2">
//         {/* Network Composition Chart */}
//         <Card className="border-border">
//           <CardHeader>
//             <CardTitle>Network Composition</CardTitle>
//             <CardDescription>Distribution of email providers in your network</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="h-[250px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={compositionData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={80}
//                     paddingAngle={2}
//                     dataKey="value"
//                   >
//                     {compositionData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "hsl(var(--card))",
//                       border: "1px solid hsl(var(--border))",
//                       borderRadius: "8px",
//                     }}
//                     formatter={(value: number) => [`${value}%`, ""]}
//                   />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="mt-4 space-y-2">
//               {compositionData.map((item, index) => (
//                 <div key={index} className="flex items-center justify-between text-sm">
//                   <div className="flex items-center gap-2">
//                     <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
//                     <span className="text-muted-foreground">{item.name}</span>
//                   </div>
//                   <span className="font-medium text-foreground">{item.value}%</span>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Network Performance Metrics */}
//         <Card className="border-border">
//           <CardHeader>
//             <CardTitle>Performance Metrics</CardTitle>
//             <CardDescription>Key indicators of network quality</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-4">
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center gap-2">
//                     <Shield className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-sm text-muted-foreground">Average Network Reputation</span>
//                   </div>
//                   <span className="font-medium text-foreground">{networkHealth?.averageReputation || 92}/100</span>
//                 </div>
//                 <Progress value={networkHealth?.averageReputation || 92} className="h-2" />
//               </div>

//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center gap-2">
//                     <Globe className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-sm text-muted-foreground">Geographic Distribution</span>
//                   </div>
//                   <span className="font-medium text-foreground">US, EU, UK</span>
//                 </div>
//                 <div className="flex gap-2">
//                   <Badge variant="outline">USA 45%</Badge>
//                   <Badge variant="outline">Europe 35%</Badge>
//                   <Badge variant="outline">UK 20%</Badge>
//                 </div>
//               </div>

//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center gap-2">
//                     <Zap className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-sm text-muted-foreground">Engagement Quality</span>
//                   </div>
//                   <span className="font-medium text-foreground">Excellent</span>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2 text-sm">
//                   <div className="p-2 bg-muted/50 rounded">
//                     <span className="text-muted-foreground">Open Rate:</span>
//                     <span className="ml-1 font-medium text-foreground">68%</span>
//                   </div>
//                   <div className="p-2 bg-muted/50 rounded">
//                     <span className="text-muted-foreground">Reply Rate:</span>
//                     <span className="ml-1 font-medium text-foreground">42%</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Peer Matching Status */}
//       <Card className="border-border">
//         <CardHeader>
//           <CardTitle>Peer Matching Algorithm</CardTitle>
//           <CardDescription>How your emails are matched with network partners</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center gap-4 p-4 bg-success-muted rounded-lg border border-success/20 mb-4">
//             <CheckCircle2 className="h-8 w-8 text-success" />
//             <div>
//               <p className="font-medium text-foreground">Smart Matching Enabled</p>
//               <p className="text-sm text-muted-foreground">
//                 Your emails are matched with A-tier network partners based on industry and reputation
//               </p>
//             </div>
//           </div>

//           <div className="grid gap-4 md:grid-cols-3">
//             <div className="p-4 bg-muted/50 rounded-lg text-center">
//               <Users className="h-6 w-6 text-primary mx-auto mb-2" />
//               <p className="font-medium text-foreground">Industry Matching</p>
//               <p className="text-sm text-muted-foreground">Similar business verticals</p>
//             </div>
//             <div className="p-4 bg-muted/50 rounded-lg text-center">
//               <Zap className="h-6 w-6 text-primary mx-auto mb-2" />
//               <p className="font-medium text-foreground">Volume Matching</p>
//               <p className="text-sm text-muted-foreground">Comparable sending patterns</p>
//             </div>
//             <div className="p-4 bg-muted/50 rounded-lg text-center">
//               <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
//               <p className="font-medium text-foreground">Quality Filtering</p>
//               <p className="text-sm text-muted-foreground">Real business accounts only</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Shield, Globe, Users, Zap, RefreshCw, CheckCircle2, Crown } from "lucide-react"
import type { EmailAccount, NetworkHealth } from "../warmup-dashboard"

interface WarmupNetworkTabProps {
  networkHealth: NetworkHealth | null
  userTier: "FREE" | "STARTER" | "PRO" | "AGENCY"
  accounts: EmailAccount[]
}

export function WarmupNetworkTab({ networkHealth, userTier, accounts }: WarmupNetworkTabProps) {
  const isPaidTier = userTier === "PRO" || userTier === "AGENCY"

  const compositionData = networkHealth
    ? [
        { name: "Google Workspace", value: networkHealth.composition.googleWorkspace, color: "hsl(var(--chart-1))" },
        { name: "Office 365", value: networkHealth.composition.office365, color: "hsl(var(--chart-2))" },
        { name: "Other Premium", value: networkHealth.composition.other, color: "hsl(var(--chart-3))" },
      ]
    : []

  const getLetterGrade = (score: number) => {
    if (score >= 95) return "A+"
    if (score >= 90) return "A"
    if (score >= 85) return "B+"
    if (score >= 80) return "B"
    if (score >= 75) return "C+"
    return "C"
  }

  const getGradeColor = (score: number) => {
    if (score >= 90) return "text-success"
    if (score >= 75) return "text-warning"
    return "text-destructive"
  }

  // For Free/Starter users
  if (!isPaidTier) {
    return (
      <div className="space-y-6">
        {/* Basic Pool Access Card */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Basic Warmup Pool</CardTitle>
            </div>
            <CardDescription>You have access to our basic warmup pool for standard email warming</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-success-muted rounded-lg border border-success/20">
              <CheckCircle2 className="h-8 w-8 text-success" />
              <div>
                <p className="font-medium text-foreground">Basic Pool Active</p>
                <p className="text-sm text-muted-foreground">
                  Your accounts are warming up using our standard pool of verified senders
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">5,000+</p>
                <p className="text-sm text-muted-foreground">Active senders in pool</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">92%</p>
                <p className="text-sm text-muted-foreground">Average inbox rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade CTA */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <CardTitle>Unlock P2P Network</CardTitle>
            </div>
            <CardDescription>Upgrade to access our premium peer-to-peer warmup network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm">96% Google Workspace senders</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm">Smart matching based on industry</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm">98%+ average inbox placement</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm">Real-time network health monitoring</span>
              </div>
            </div>
            <Button className="w-full gap-2">
              <Crown className="h-4 w-4" />
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // For Pro/Agency users - Full Network Dashboard
  return (
    <div className="space-y-6">
      {/* Network Health Score - Hero Section */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Network Health Score</CardTitle>
              <CardDescription>Overall quality of your P2P warmup network</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Refresh Score
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Circular Score */}
            <div className="relative">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="hsl(var(--muted))" strokeWidth="12" fill="none" />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="hsl(var(--primary))"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${((networkHealth?.score || 0) / 100) * 440} 440`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-foreground">{networkHealth?.score || 0}</span>
                <span className={`text-xl font-semibold ${getGradeColor(networkHealth?.score || 0)}`}>
                  {getLetterGrade(networkHealth?.score || 0)}
                </span>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="flex-1 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Network Size</p>
                  <p className="text-2xl font-bold text-foreground">
                    {networkHealth?.totalSize?.toLocaleString() || "15,000"}
                  </p>
                  <p className="text-xs text-muted-foreground">active inboxes</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Avg Reputation</p>
                  <p className="text-2xl font-bold text-foreground">{networkHealth?.averageReputation || 92}/100</p>
                  <p className="text-xs text-muted-foreground">network-wide</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Last updated:{" "}
                {networkHealth?.lastUpdated ? new Date(networkHealth.lastUpdated).toLocaleString() : "Just now"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Network Composition Chart */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Network Composition</CardTitle>
            <CardDescription>Distribution of email providers in your network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={compositionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${value}%`}
                    labelLine={false}
                  >
                    {compositionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="hsl(var(--card))" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      return (
                        <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
                            <p className="text-sm text-muted-foreground">{payload[0].value}% of network</p>
                          </div>
                        </div>
                      )
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3">
              {compositionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Network Performance Metrics */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key indicators of network quality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Average Network Reputation</span>
                  </div>
                  <span className="font-medium text-foreground">{networkHealth?.averageReputation || 92}/100</span>
                </div>
                <Progress value={networkHealth?.averageReputation || 92} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Geographic Distribution</span>
                  </div>
                  <span className="font-medium text-foreground">US, EU, UK</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">USA 45%</Badge>
                  <Badge variant="outline">Europe 35%</Badge>
                  <Badge variant="outline">UK 20%</Badge>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Engagement Quality</span>
                  </div>
                  <span className="font-medium text-foreground">Excellent</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-muted/50 rounded">
                    <span className="text-muted-foreground">Open Rate:</span>
                    <span className="ml-1 font-medium text-foreground">68%</span>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <span className="text-muted-foreground">Reply Rate:</span>
                    <span className="ml-1 font-medium text-foreground">42%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peer Matching Status */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Peer Matching Algorithm</CardTitle>
          <CardDescription>How your emails are matched with network partners</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-success-muted rounded-lg border border-success/20 mb-4">
            <CheckCircle2 className="h-8 w-8 text-success" />
            <div>
              <p className="font-medium text-foreground">Smart Matching Enabled</p>
              <p className="text-sm text-muted-foreground">
                Your emails are matched with A-tier network partners based on industry and reputation
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <Users className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="font-medium text-foreground">Industry Matching</p>
              <p className="text-sm text-muted-foreground">Similar business verticals</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <Zap className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="font-medium text-foreground">Volume Matching</p>
              <p className="text-sm text-muted-foreground">Comparable sending patterns</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="font-medium text-foreground">Quality Filtering</p>
              <p className="text-sm text-muted-foreground">Real business accounts only</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
