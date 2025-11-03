// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Mail, ExternalLink, Building2, Briefcase, MapPin, TrendingUp } from "lucide-react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { formatDate } from "@/lib/utils/format"
// import { ResearchProspectDialog } from "@/components/prospects/research-prospect-dialog"

// export default function ProspectDetailPage({ params }: { params: { id: string } }) {
//   const prospect = {
//     id: params.id,
//     email: "sarah.chen@techflow.com",
//     firstName: "Sarah",
//     lastName: "Chen",
//     company: "TechFlow",
//     jobTitle: "Head of Sales",
//     linkedinUrl: "https://linkedin.com/in/sarahchen",
//     websiteUrl: "https://techflow.com",
//     location: "San Francisco, CA",
//     status: "REPLIED",
//     qualityScore: 92,
//     emailsReceived: 2,
//     emailsOpened: 2,
//     emailsClicked: 1,
//     replied: true,
//     createdAt: new Date("2025-01-15"),
//   }

//   const researchData = {
//     companyInfo: "TechFlow is a B2B SaaS company providing workflow automation tools for sales teams.",
//     recentNews: ["Raised $10M Series A funding", "Launched new AI-powered features", "Expanded to European market"],
//     painPoints: ["Scaling sales operations", "Improving email response rates", "Automating repetitive tasks"],
//     competitorTools: ["Salesforce", "HubSpot", "Outreach"],
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-start justify-between">
//         <div className="flex items-start gap-4">
//           <Avatar className="h-16 w-16">
//             <AvatarImage src="/placeholder.svg?height=64&width=64" />
//             <AvatarFallback className="text-xl">
//               {prospect.firstName[0]}
//               {prospect.lastName[0]}
//             </AvatarFallback>
//           </Avatar>
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">
//               {prospect.firstName} {prospect.lastName}
//             </h1>
//             <p className="text-muted-foreground">{prospect.email}</p>
//             <div className="flex items-center gap-4 mt-2">
//               <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
//                 {prospect.status.toLowerCase()}
//               </Badge>
//               <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                 <TrendingUp className="h-4 w-4" />
//                 Quality Score:{" "}
//                 <span className="font-semibold text-green-600 dark:text-green-400">{prospect.qualityScore}/100</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <ResearchProspectDialog prospectId={prospect.id} prospectEmail={prospect.email} />
//           <Button variant="outline" asChild>
//             <a href={prospect.linkedinUrl} target="_blank" rel="noopener noreferrer">
//               <ExternalLink className="h-4 w-4 mr-2" />
//               LinkedIn
//             </a>
//           </Button>
//           <Button>
//             <Mail className="h-4 w-4 mr-2" />
//             Send Email
//           </Button>
//         </div>
//       </div>

//       <div className="grid gap-6 md:grid-cols-3">
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Company</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-2">
//               <Building2 className="h-4 w-4 text-muted-foreground" />
//               <span className="font-semibold">{prospect.company}</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Job Title</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-2">
//               <Briefcase className="h-4 w-4 text-muted-foreground" />
//               <span className="font-semibold">{prospect.jobTitle}</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Location</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-2">
//               <MapPin className="h-4 w-4 text-muted-foreground" />
//               <span className="font-semibold">{prospect.location}</span>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs defaultValue="overview" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="research">AI Research</TabsTrigger>
//           <TabsTrigger value="emails">Email History</TabsTrigger>
//           <TabsTrigger value="activity">Activity</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-4">
//           <div className="grid gap-6 md:grid-cols-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Engagement Stats</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-muted-foreground">Emails Received</span>
//                   <span className="text-2xl font-bold">{prospect.emailsReceived}</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-muted-foreground">Emails Opened</span>
//                   <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{prospect.emailsOpened}</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-muted-foreground">Links Clicked</span>
//                   <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{prospect.emailsClicked}</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-muted-foreground">Replied</span>
//                   <span className="text-2xl font-bold text-green-600 dark:text-green-400">
//                     {prospect.replied ? "Yes" : "No"}
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Timeline</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-start gap-3">
//                   <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/10">
//                     <div className="h-2 w-2 rounded-full bg-green-500" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">Replied to email</p>
//                     <p className="text-xs text-muted-foreground">2 hours ago</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
//                     <div className="h-2 w-2 rounded-full bg-blue-500" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">Opened email</p>
//                     <p className="text-xs text-muted-foreground">1 day ago</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-500/10">
//                     <div className="h-2 w-2 rounded-full bg-gray-500" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">Added to campaign</p>
//                     <p className="text-xs text-muted-foreground">{formatDate(prospect.createdAt)}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="research" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>AI Research Insights</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div>
//                 <h3 className="font-semibold mb-2">Company Overview</h3>
//                 <p className="text-sm text-muted-foreground leading-relaxed">{researchData.companyInfo}</p>
//               </div>

//               <div>
//                 <h3 className="font-semibold mb-2">Recent News</h3>
//                 <ul className="space-y-2">
//                   {researchData.recentNews.map((news, index) => (
//                     <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
//                       <span className="text-primary">•</span>
//                       {news}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div>
//                 <h3 className="font-semibold mb-2">Potential Pain Points</h3>
//                 <ul className="space-y-2">
//                   {researchData.painPoints.map((point, index) => (
//                     <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
//                       <span className="text-primary">•</span>
//                       {point}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div>
//                 <h3 className="font-semibold mb-2">Current Tools</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {researchData.competitorTools.map((tool, index) => (
//                     <Badge key={index} variant="secondary">
//                       {tool}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="emails" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Email History</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-muted-foreground">Email history will be displayed here</p>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="activity" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Activity Log</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-muted-foreground">Activity log will be displayed here</p>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Mail, ExternalLink, Building2, Briefcase, MapPin, TrendingUp } from "lucide-react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { formatDate } from "@/lib/utils/format"
// import { ResearchProspectDialog } from "@/components/prospects/research-prospect-dialog"
// import { getProspectById } from "@/lib/actions/prospects"
// import { notFound } from "next/navigation"

// export default async function ProspectDetailPage({ params }: { params: { id: string } }) {
//   const prospect = await getProspectById(params.id).catch(() => null)

//   if (!prospect) {
//     notFound()
//   }

//   const researchData = (prospect.researchData as any) || {}

//   return (
//     <div className="space-y-6">
//       <div className="flex items-start justify-between">
//         <div className="flex items-start gap-4">
//           <Avatar className="h-16 w-16">
//             <AvatarFallback className="text-xl">
//               {prospect.firstName?.[0] || "?"}
//               {prospect.lastName?.[0] || "?"}
//             </AvatarFallback>
//           </Avatar>
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">
//               {prospect.firstName} {prospect.lastName}
//             </h1>
//             <p className="text-muted-foreground">{prospect.email}</p>
//             <div className="flex items-center gap-4 mt-2">
//               <Badge variant="secondary">{prospect.status.toLowerCase()}</Badge>
//               {prospect.qualityScore && (
//                 <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                   <TrendingUp className="h-4 w-4" />
//                   Quality Score:{" "}
//                   <span className="font-semibold text-green-600 dark:text-green-400">{prospect.qualityScore}/100</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <ResearchProspectDialog prospectId={prospect.id} prospectEmail={prospect.email} />
//           {prospect.linkedinUrl && (
//             <Button variant="outline" asChild>
//               <a href={prospect.linkedinUrl} target="_blank" rel="noopener noreferrer">
//                 <ExternalLink className="h-4 w-4 mr-2" />
//                 LinkedIn
//               </a>
//             </Button>
//           )}
//           <Button>
//             <Mail className="h-4 w-4 mr-2" />
//             Send Email
//           </Button>
//         </div>
//       </div>

//       <div className="grid gap-6 md:grid-cols-3">
//         {prospect.company && (
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-medium text-muted-foreground">Company</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center gap-2">
//                 <Building2 className="h-4 w-4 text-muted-foreground" />
//                 <span className="font-semibold">{prospect.company}</span>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {prospect.jobTitle && (
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-medium text-muted-foreground">Job Title</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center gap-2">
//                 <Briefcase className="h-4 w-4 text-muted-foreground" />
//                 <span className="font-semibold">{prospect.jobTitle}</span>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {prospect.location && (
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-medium text-muted-foreground">Location</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center gap-2">
//                 <MapPin className="h-4 w-4 text-muted-foreground" />
//                 <span className="font-semibold">{prospect.location}</span>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       <Tabs defaultValue="overview" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="research">AI Research</TabsTrigger>
//           <TabsTrigger value="emails">Email History ({prospect.emailLogs?.length || 0})</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Engagement Stats</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">Emails Received</span>
//                 <span className="text-2xl font-bold">{prospect.emailsReceived}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">Emails Opened</span>
//                 <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{prospect.emailsOpened}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">Links Clicked</span>
//                 <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{prospect.emailsClicked}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">Replied</span>
//                 <span className="text-2xl font-bold text-green-600 dark:text-green-400">
//                   {prospect.replied ? "Yes" : "No"}
//                 </span>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="research" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>AI Research Insights</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {researchData && Object.keys(researchData).length > 0 ? (
//                 <div className="space-y-4">
//                   <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
//                     {JSON.stringify(researchData, null, 2)}
//                   </pre>
//                 </div>
//               ) : (
//                 <p className="text-muted-foreground text-center py-8">
//                   No research data available. Click "Run AI Research" to generate insights.
//                 </p>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="emails" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Email History</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {prospect.emailLogs && prospect.emailLogs.length > 0 ? (
//                 <div className="space-y-3">
//                   {prospect.emailLogs.map((log: any) => (
//                     <div key={log.id} className="p-4 border rounded-lg">
//                       <div className="flex items-start justify-between mb-2">
//                         <p className="font-medium">{log.subject}</p>
//                         <Badge variant="outline">{log.status.toLowerCase()}</Badge>
//                       </div>
//                       <p className="text-sm text-muted-foreground">
//                         {log.sentAt ? formatDate(log.sentAt) : "Not sent yet"}
//                       </p>
//                       {log.opens > 0 && <p className="text-xs text-muted-foreground mt-1">Opened {log.opens} times</p>}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-muted-foreground text-center py-8">No emails sent yet</p>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, ExternalLink, Building2, Briefcase, MapPin, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils/format"
import { ResearchProspectDialog } from "@/components/prospects/research-prospect-dialog"
import { getProspectById } from "@/lib/actions/prospects"
import { notFound } from "next/navigation"
import { ResearchInsightsView } from "@/components/prospects/research-insights-view"

export default async function ProspectDetailPage({ params }: { params: { id: string } }) {
  const prospect = await getProspectById(params.id).catch(() => null)

  if (!prospect) {
    notFound()
  }

  const researchData = (prospect.researchData as any) || {}

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl">
              {prospect.firstName?.[0] || "?"}
              {prospect.lastName?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {prospect.firstName} {prospect.lastName}
            </h1>
            <p className="text-muted-foreground">{prospect.email}</p>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="secondary">{prospect.status.toLowerCase()}</Badge>
              {prospect.qualityScore && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Quality Score:{" "}
                  <span className="font-semibold text-green-600 dark:text-green-400">{prospect.qualityScore}/100</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ResearchProspectDialog prospectId={prospect.id} prospectEmail={prospect.email} />
          {prospect.linkedinUrl && (
            <Button variant="outline" asChild>
              <a href={prospect.linkedinUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                LinkedIn
              </a>
            </Button>
          )}
          <Button>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {prospect.company && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Company</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{prospect.company}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {prospect.jobTitle && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Job Title</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{prospect.jobTitle}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {prospect.location && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{prospect.location}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="research">AI Research</TabsTrigger>
          <TabsTrigger value="emails">Email History ({prospect.emailLogs?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Emails Received</span>
                <span className="text-2xl font-bold">{prospect.emailsReceived}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Emails Opened</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{prospect.emailsOpened}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Links Clicked</span>
                <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{prospect.emailsClicked}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Replied</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {prospect.replied ? "Yes" : "No"}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="research" className="space-y-4">
          {researchData && Object.keys(researchData).length > 0 ? (
            <ResearchInsightsView data={researchData} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>AI Research Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  No research data available. Click "Run AI Research" to generate insights.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="emails" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email History</CardTitle>
            </CardHeader>
            <CardContent>
              {prospect.emailLogs && prospect.emailLogs.length > 0 ? (
                <div className="space-y-3">
                  {prospect.emailLogs.map((log: any) => (
                    <div key={log.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium">{log.subject}</p>
                        <Badge variant="outline">{log.status.toLowerCase()}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {log.sentAt ? formatDate(log.sentAt) : "Not sent yet"}
                      </p>
                      {log.opens > 0 && <p className="text-xs text-muted-foreground mt-1">Opened {log.opens} times</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No emails sent yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
