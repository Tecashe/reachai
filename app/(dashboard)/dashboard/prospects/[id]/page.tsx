
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
