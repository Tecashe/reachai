// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { AlertCircle, AlertTriangle, Shield, TrendingUp } from "lucide-react"
// import Link from "next/link"
// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { redirect } from "next/navigation"
// import { DomainHealthCard } from "@/components/deliverability/domain-health-card"
// import { DeliverabilityDashboard } from "@/components/settings/deliverability-dashboard"

// export default async function DeliverabilityPage() {
//   const { userId: clerkId } = await auth()

//   if (!clerkId) {
//     redirect("/sign-in")
//   }

//   const user = await db.user.findUnique({
//     where: { clerkId },
//     select: { id: true },
//   })

//   if (!user) {
//     redirect("/sign-in")
//   }

//   // CHANGE: Fetch domains with deliverability health
//   const domains = await db.domain.findMany({
//     where: { userId: user.id },
//     include: {
//       deliverabilityHealth: true,
//       sendingAccounts: true,
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   // Fetch alerts
//   const alerts = await db.deliverabilityHealth.findMany({
//     where: {
//       domain: {
//         userId: user.id,
//       },
//       hasIssues: true,
//     },
//     include: {
//       domain: true,
//     },
//     orderBy: { updatedAt: "desc" },
//     take: 5,
//   })

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Deliverability Hub</h1>
//         <p className="text-muted-foreground mt-1">
//           Monitor your domain health, sending accounts, and email deliverability in one place.
//         </p>
//       </div>

//       {/* Top Metrics */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Domains Verified</CardTitle>
//             <Shield className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{domains.filter((d) => d.isVerified).length}</div>
//             <p className="text-xs text-muted-foreground">of {domains.length} total</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Avg Health Score</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {domains.length > 0 ? Math.round(domains.reduce((sum, d) => sum + d.healthScore, 0) / domains.length) : 0}
//             </div>
//             <p className="text-xs text-muted-foreground">out of 100</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Blacklisted Domains</CardTitle>
//             <AlertTriangle className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{domains.filter((d) => d.isBlacklisted).length}</div>
//             <p className="text-xs text-muted-foreground">requires action</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Critical Alerts</CardTitle>
//             <AlertCircle className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{alerts.filter((a) => a.alertLevel === "CRITICAL").length}</div>
//             <p className="text-xs text-muted-foreground">needs attention</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Alerts Section */}
//       {alerts.length > 0 && (
//         <div className="space-y-3">
//           <h2 className="text-lg font-semibold">Active Alerts</h2>
//           {alerts.map((alert) => (
//             <Alert key={alert.id} variant={alert.alertLevel === "CRITICAL" ? "destructive" : "default"}>
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>{alert.domain.domain}</AlertTitle>
//               <AlertDescription>{alert.alertMessage}</AlertDescription>
//             </Alert>
//           ))}
//         </div>
//       )}

//       {/* Domains Section */}
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-semibold">Your Domains</h2>
//           <Button asChild size="sm">
//             <Link href="/dashboard/settings?tab=domains">Add Domain</Link>
//           </Button>
//         </div>

//         {domains.length === 0 ? (
//           <Card className="p-12 text-center">
//             <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">No Domains Added</h3>
//             <p className="text-muted-foreground mb-4">
//               Add a domain to start sending emails with maximum deliverability.
//             </p>
//             <Button asChild>
//               <Link href="/dashboard/settings?tab=domains">Add Your First Domain</Link>
//             </Button>
//           </Card>
//         ) : (
//           <div className="grid gap-4">
//             {domains.map((domain) => (
//               <DomainHealthCard key={domain.id} domain={domain} />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Sending Accounts Section */}
//       <div className="space-y-4">
//         <h2 className="text-lg font-semibold">Email Account Health</h2>
//         <DeliverabilityDashboard />
//       </div>
//     </div>
//   )
// }

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Shield, TrendingUp, AlertTriangle, AlertCircle, Plus } from "lucide-react"
// import Link from "next/link"
// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { redirect } from "next/navigation"
// import { DomainHealthCard } from "@/components/deliverability/domain-health-card"
// import { DeliverabilityDashboard } from "@/components/settings/deliverability-dashboard"
// import { AlertsPanel } from "@/components/deliverability/alerts-panel"
// import { RotationStatusCard } from "@/components/deliverability/rotation-status-card"

// export default async function DeliverabilityPage() {
//   const { userId: clerkId } = await auth()

//   if (!clerkId) {
//     redirect("/sign-in")
//   }

//   const user = await db.user.findUnique({
//     where: { clerkId },
//     select: { id: true },
//   })

//   if (!user) {
//     redirect("/sign-in")
//   }

//   // Fetch domains with deliverability health
//   const domains = await db.domain.findMany({
//     where: { userId: user.id },
//     include: {
//       deliverabilityHealth: true,
//       sendingAccounts: {
//         select: {
//           id: true,
//           email: true,
//           isActive: true,
//           healthScore: true,
//           bounceRate: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   // Fetch active alerts
//   const alertsData = await db.deliverabilityHealth.findMany({
//     where: {
//       domain: {
//         userId: user.id,
//       },
//       hasIssues: true,
//     },
//     include: {
//       domain: true,
//     },
//     orderBy: { updatedAt: "desc" },
//     take: 10,
//   })

//   // Transform alerts for display
//   const alerts = alertsData.map((alert) => ({
//     id: alert.id,
//     severity: alert.alertLevel as "CRITICAL" | "WARNING" | "INFO",
//     title: `${alert.alertLevel} Issue: ${alert.domain.domain}`,
//     message: alert.alertMessage || "No details available",
//     domainId: alert.domainId,
//     actionUrl: `/dashboard/deliverability?domain=${alert.domainId}`,
//     timestamp: alert.updatedAt,
//   }))

//   // Fetch sending accounts for rotation metrics
//   const sendingAccounts = await db.sendingAccount.findMany({
//     where: { userId: user.id },
//     select: {
//       id: true,
//       isActive: true,
//       emailsSentToday: true,
//     },
//   })

//   const rotationMetrics = {
//     totalAccounts: sendingAccounts.length,
//     activeAccounts: sendingAccounts.filter((a) => a.isActive).length,
//     rotationsToday: Math.floor(sendingAccounts.reduce((sum, a) => sum + a.emailsSentToday, 0) / 50),
//     avgEmailsPerAccount:
//       sendingAccounts.length > 0
//         ? Math.round(sendingAccounts.reduce((sum, a) => sum + a.emailsSentToday, 0) / sendingAccounts.length)
//         : 0,
//     nextRotationIn: 15,
//     rotationStrategy: "Health-Based",
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Deliverability Hub</h1>
//           <p className="text-muted-foreground mt-1">
//             Monitor your domain health, sending accounts, and email deliverability in one place.
//           </p>
//         </div>
//         <Button asChild>
//           <Link href="/dashboard/settings?tab=domains">
//             <Plus className="mr-2 h-4 w-4" />
//             Add Domain
//           </Link>
//         </Button>
//       </div>

//       {/* Top Metrics */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Domains Verified</CardTitle>
//             <Shield className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{domains.filter((d) => d.isVerified).length}</div>
//             <p className="text-xs text-muted-foreground">of {domains.length} total</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Avg Health Score</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {domains.length > 0 ? Math.round(domains.reduce((sum, d) => sum + d.healthScore, 0) / domains.length) : 0}
//             </div>
//             <p className="text-xs text-muted-foreground">out of 100</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Blacklisted Domains</CardTitle>
//             <AlertTriangle className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{domains.filter((d) => d.isBlacklisted).length}</div>
//             <p className="text-xs text-muted-foreground">requires action</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Critical Alerts</CardTitle>
//             <AlertCircle className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{alerts.filter((a) => a.severity === "CRITICAL").length}</div>
//             <p className="text-xs text-muted-foreground">needs attention</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Alerts Section */}
//       <div className="space-y-3">
//         <h2 className="text-lg font-semibold">Active Alerts</h2>
//         <AlertsPanel alerts={alerts} />
//       </div>

//       {/* Rotation Status */}
//       {sendingAccounts.length > 1 && <RotationStatusCard metrics={rotationMetrics} />}

//       {/* Domains Section */}
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-semibold">Your Domains</h2>
//         </div>

//         {domains.length === 0 ? (
//           <Card className="p-12 text-center">
//             <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">No Domains Added</h3>
//             <p className="text-muted-foreground mb-4">
//               Add a domain to start sending emails with maximum deliverability.
//             </p>
//             <Button asChild>
//               <Link href="/dashboard/settings?tab=domains">Add Your First Domain</Link>
//             </Button>
//           </Card>
//         ) : (
//           <div className="grid gap-4">
//             {domains.map((domain) => (
//               <DomainHealthCard key={domain.id} domain={domain} />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Sending Accounts Section */}
//       <div className="space-y-4">
//         <h2 className="text-lg font-semibold">Email Account Health</h2>
//         <DeliverabilityDashboard />
//       </div>
//     </div>
//   )
// }



import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, TrendingUp, AlertTriangle, AlertCircle, Plus, CheckCircle2, XCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export default async function DeliverabilityPage() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    redirect("/sign-in")
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  })

  if (!user) {
    redirect("/sign-in")
  }

  const domains = await db.domain.findMany({
    where: { userId: user.id },
    include: {
      deliverabilityHealth: true,
      sendingAccounts: {
        select: {
          id: true,
          email: true,
          isActive: true,
          healthScore: true,
          bounceRate: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const alertsData = await db.deliverabilityHealth.findMany({
    where: {
      domain: {
        userId: user.id,
      },
      hasIssues: true,
    },
    include: {
      domain: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
  })

  const alerts = alertsData.map((alert) => ({
    id: alert.id,
    severity: alert.alertLevel as "CRITICAL" | "WARNING" | "INFO",
    title: `${alert.domain.domain}`,
    message: alert.alertMessage || "DNS configuration incomplete",
    domainId: alert.domainId,
    domain: alert.domain.domain,
  }))

  const verifiedCount = domains.filter((d) => d.isVerified).length
  const avgHealth =
    domains.length > 0 ? Math.round(domains.reduce((sum, d) => sum + d.healthScore, 0) / domains.length) : 0
  const blacklistedCount = domains.filter((d) => d.isBlacklisted).length
  const criticalAlerts = alerts.filter((a) => a.severity === "CRITICAL").length

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const getHealthBg = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deliverability</h1>
          <p className="text-muted-foreground mt-1">Monitor your domain health and email deliverability</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/email-setup">
            <Plus className="mr-2 h-4 w-4" />
            Add Domain
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified Domains</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{verifiedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">of {domains.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Health Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getHealthColor(avgHealth)}`}>{avgHealth}</div>
            <p className="text-xs text-muted-foreground mt-1">out of 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Blacklisted</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${blacklistedCount > 0 ? "text-red-600" : "text-green-600"}`}>
              {blacklistedCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {blacklistedCount > 0 ? "requires attention" : "all clear"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${criticalAlerts > 0 ? "text-red-600" : "text-green-600"}`}>
              {criticalAlerts}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{criticalAlerts > 0 ? "needs action" : "no issues"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Alerts</CardTitle>
            <CardDescription>Issues that need your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  alert.severity === "CRITICAL"
                    ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50"
                    : alert.severity === "WARNING"
                      ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50"
                      : "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {alert.severity === "CRITICAL" ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : alert.severity === "WARNING" ? (
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                  )}
                  <div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/email-setup?domain=${alert.domain}`}>Fix Now</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Domains Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Domains</h2>
        </div>

        {domains.length === 0 ? (
          <Card className="p-12 text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Domains Added</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add a domain to start sending emails with maximum deliverability. We'll guide you through DNS
              configuration.
            </p>
            <Button asChild size="lg">
              <Link href="/dashboard/email-setup">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Domain
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {domains.map((domain) => {
              const health = domain.deliverabilityHealth
              return (
                <Card key={domain.id} className="overflow-hidden">
                  <div className="flex">
                    {/* Health Score Indicator */}
                    <div className={`w-2 ${getHealthBg(domain.healthScore)}`} />

                    <div className="flex-1">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <CardTitle className="text-lg">{domain.domain}</CardTitle>
                              {domain.isVerified ? (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Setup Needed
                                </Badge>
                              )}
                              {domain.isBlacklisted && (
                                <Badge variant="destructive">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Blacklisted
                                </Badge>
                              )}
                            </div>
                            <CardDescription>
                              {domain.sendingAccounts.length} sending account
                              {domain.sendingAccounts.length !== 1 ? "s" : ""} connected
                            </CardDescription>
                          </div>

                          <div className="text-right">
                            <div className={`text-4xl font-bold ${getHealthColor(domain.healthScore)}`}>
                              {domain.healthScore}
                            </div>
                            <p className="text-xs text-muted-foreground">Health Score</p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* DNS Status Grid */}
                        <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              {health?.spfValid ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                              <span className="font-medium">SPF</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {health?.spfValid ? "Configured" : "Missing"}
                            </p>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              {health?.dkimValid ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                              <span className="font-medium">DKIM</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {health?.dkimValid ? "Configured" : "Missing"}
                            </p>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              {health?.dmarcValid ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                              <span className="font-medium">DMARC</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {health?.dmarcPolicy || (health?.dmarcValid ? "Set" : "Missing")}
                            </p>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              {health?.mxRecordsValid ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                              <span className="font-medium">MX</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {health?.mxRecordsValid ? "Found" : "Missing"}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {!domain.isVerified && (
                            <Button asChild>
                              <Link href={`/dashboard/email-setup?domain=${domain.domain}`}>Configure DNS</Link>
                            </Button>
                          )}
                          <Button variant="outline" asChild>
                            <Link href={`/dashboard/settings?tab=sending`}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Manage Accounts
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
