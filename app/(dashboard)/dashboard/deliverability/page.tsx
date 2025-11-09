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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, TrendingUp, AlertTriangle, AlertCircle, Plus } from "lucide-react"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { DomainHealthCard } from "@/components/deliverability/domain-health-card"
import { DeliverabilityDashboard } from "@/components/settings/deliverability-dashboard"
import { AlertsPanel } from "@/components/deliverability/alerts-panel"
import { RotationStatusCard } from "@/components/deliverability/rotation-status-card"

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

  // Fetch domains with deliverability health
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

  // Fetch active alerts
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

  // Transform alerts for display
  const alerts = alertsData.map((alert) => ({
    id: alert.id,
    severity: alert.alertLevel as "CRITICAL" | "WARNING" | "INFO",
    title: `${alert.alertLevel} Issue: ${alert.domain.domain}`,
    message: alert.alertMessage || "No details available",
    domainId: alert.domainId,
    actionUrl: `/dashboard/deliverability?domain=${alert.domainId}`,
    timestamp: alert.updatedAt,
  }))

  // Fetch sending accounts for rotation metrics
  const sendingAccounts = await db.sendingAccount.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      isActive: true,
      emailsSentToday: true,
    },
  })

  const rotationMetrics = {
    totalAccounts: sendingAccounts.length,
    activeAccounts: sendingAccounts.filter((a) => a.isActive).length,
    rotationsToday: Math.floor(sendingAccounts.reduce((sum, a) => sum + a.emailsSentToday, 0) / 50),
    avgEmailsPerAccount:
      sendingAccounts.length > 0
        ? Math.round(sendingAccounts.reduce((sum, a) => sum + a.emailsSentToday, 0) / sendingAccounts.length)
        : 0,
    nextRotationIn: 15,
    rotationStrategy: "Health-Based",
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deliverability Hub</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your domain health, sending accounts, and email deliverability in one place.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/settings?tab=domains">
            <Plus className="mr-2 h-4 w-4" />
            Add Domain
          </Link>
        </Button>
      </div>

      {/* Top Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Domains Verified</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{domains.filter((d) => d.isVerified).length}</div>
            <p className="text-xs text-muted-foreground">of {domains.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Health Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {domains.length > 0 ? Math.round(domains.reduce((sum, d) => sum + d.healthScore, 0) / domains.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">out of 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Blacklisted Domains</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{domains.filter((d) => d.isBlacklisted).length}</div>
            <p className="text-xs text-muted-foreground">requires action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.filter((a) => a.severity === "CRITICAL").length}</div>
            <p className="text-xs text-muted-foreground">needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Active Alerts</h2>
        <AlertsPanel alerts={alerts} />
      </div>

      {/* Rotation Status */}
      {sendingAccounts.length > 1 && <RotationStatusCard metrics={rotationMetrics} />}

      {/* Domains Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Domains</h2>
        </div>

        {domains.length === 0 ? (
          <Card className="p-12 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Domains Added</h3>
            <p className="text-muted-foreground mb-4">
              Add a domain to start sending emails with maximum deliverability.
            </p>
            <Button asChild>
              <Link href="/dashboard/settings?tab=domains">Add Your First Domain</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {domains.map((domain) => (
              <DomainHealthCard key={domain.id} domain={domain} />
            ))}
          </div>
        )}
      </div>

      {/* Sending Accounts Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Email Account Health</h2>
        <DeliverabilityDashboard />
      </div>
    </div>
  )
}
