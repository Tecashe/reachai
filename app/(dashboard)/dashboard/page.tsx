// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Mail, Users, TrendingUp, MousePointerClick } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { RecentCampaigns } from "@/components/dashboard/recent-campaigns"
// import { ActivityFeed } from "@/components/dashboard/activity-feed"

// export default function DashboardPage() {
//   const stats = [
//     {
//       title: "Emails Sent",
//       value: "1,234",
//       change: "+12.5%",
//       icon: Mail,
//       trend: "up",
//     },
//     {
//       title: "Active Prospects",
//       value: "456",
//       change: "+8.2%",
//       icon: Users,
//       trend: "up",
//     },
//     {
//       title: "Reply Rate",
//       value: "24.3%",
//       change: "+5.1%",
//       icon: TrendingUp,
//       trend: "up",
//     },
//     {
//       title: "Click Rate",
//       value: "18.7%",
//       change: "+3.4%",
//       icon: MousePointerClick,
//       trend: "up",
//     },
//   ]

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back! Here's your campaign overview.</p>
//         </div>
//         <Button asChild>
//           <Link href="/dashboard/campaigns/new">Create Campaign</Link>
//         </Button>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {stats.map((stat) => (
//           <Card key={stat.title}>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
//               <stat.icon className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stat.value}</div>
//               <p className="text-xs text-green-600 dark:text-green-400">{stat.change} from last month</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <RecentCampaigns />
//         <ActivityFeed />
//       </div>
//     </div>
//   )
// }

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Mail, Users, TrendingUp, MousePointerClick } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { RecentCampaigns } from "@/components/dashboard/recent-campaigns"
// import { ActivityFeed } from "@/components/dashboard/activity-feed"
// import { getDashboardStats } from "@/lib/actions/dashboard"

// export default async function DashboardPage() {
//   const stats = await getDashboardStats()

//   const statCards = [
//     {
//       title: "Emails Sent",
//       value: stats.emailsSent.toString(),
//       change: "+12.5%",
//       icon: Mail,
//       trend: "up",
//     },
//     {
//       title: "Active Prospects",
//       value: stats.activeProspects.toString(),
//       change: "+8.2%",
//       icon: Users,
//       trend: "up",
//     },
//     {
//       title: "Open Rate",
//       value: `${stats.openRate}%`,
//       change: "+5.1%",
//       icon: TrendingUp,
//       trend: "up",
//     },
//     {
//       title: "Click Rate",
//       value: `${stats.clickRate}%`,
//       change: "+3.4%",
//       icon: MousePointerClick,
//       trend: "up",
//     },
//   ]

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back! Here's your campaign overview.</p>
//         </div>
//         <Button asChild>
//           <Link href="/dashboard/campaigns/new">Create Campaign</Link>
//         </Button>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {statCards.map((stat) => (
//           <Card key={stat.title}>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
//               <stat.icon className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stat.value}</div>
//               <p className="text-xs text-green-600 dark:text-green-400">{stat.change} from last month</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <RecentCampaigns />
//         <ActivityFeed />
//       </div>
//     </div>
//   )
// }


// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Mail, Users, TrendingUp, MousePointerClick } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { RecentCampaigns } from "@/components/dashboard/recent-campaigns"
// import { ActivityFeed } from "@/components/dashboard/activity-feed"
// import { getDashboardStats } from "@/lib/actions/dashboard"
// import { GettingStartedGuide } from "@/components/getting-started/getting-started-guide"

// export default async function DashboardPage() {
//   const stats = await getDashboardStats()

//   const statCards = [
//     {
//       title: "Emails Sent",
//       value: stats.emailsSent.toString(),
//       change: "+12.5%",
//       icon: Mail,
//       trend: "up",
//     },
//     {
//       title: "Active Prospects",
//       value: stats.activeProspects.toString(),
//       change: "+8.2%",
//       icon: Users,
//       trend: "up",
//     },
//     {
//       title: "Open Rate",
//       value: `${stats.openRate}%`,
//       change: "+5.1%",
//       icon: TrendingUp,
//       trend: "up",
//     },
//     {
//       title: "Click Rate",
//       value: `${stats.clickRate}%`,
//       change: "+3.4%",
//       icon: MousePointerClick,
//       trend: "up",
//     },
//   ]

//   return (
//     <>
//       <div className="space-y-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//             <p className="text-muted-foreground">Welcome back! Here's your campaign overview.</p>
//           </div>
//           <Button asChild>
//             <Link href="/dashboard/campaigns/new">Create Campaign</Link>
//           </Button>
//         </div>

//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           {statCards.map((stat) => (
//             <Card key={stat.title}>
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
//                 <stat.icon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{stat.value}</div>
//                 <p className="text-xs text-green-600 dark:text-green-400">{stat.change} from last month</p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         <div className="grid gap-6 md:grid-cols-2">
//           <RecentCampaigns />
//           <ActivityFeed />
//         </div>
//       </div>

//       <GettingStartedGuide />
//     </>
//   )
// }
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Mail, Users, TrendingUp, MousePointerClick } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { RecentCampaigns } from "@/components/dashboard/recent-campaigns"
// import { ActivityFeed } from "@/components/dashboard/activity-feed"
// import { getDashboardStats } from "@/lib/actions/dashboard"
// import { OnboardingProgress } from "@/components/getting-started/onboarding-progress"

// export default async function DashboardPage() {
//   const stats = await getDashboardStats()

//   const statCards = [
//     {
//       title: "Emails Sent",
//       value: stats.emailsSent.toString(),
//       change: "+12.5%",
//       icon: Mail,
//       trend: "up",
//     },
//     {
//       title: "Active Prospects",
//       value: stats.activeProspects.toString(),
//       change: "+8.2%",
//       icon: Users,
//       trend: "up",
//     },
//     {
//       title: "Open Rate",
//       value: `${stats.openRate}%`,
//       change: "+5.1%",
//       icon: TrendingUp,
//       trend: "up",
//     },
//     {
//       title: "Click Rate",
//       value: `${stats.clickRate}%`,
//       change: "+3.4%",
//       icon: MousePointerClick,
//       trend: "up",
//     },
//   ]

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back! Here's your campaign overview.</p>
//         </div>
//         <Button asChild>
//           <Link href="/dashboard/campaigns/new">Create Campaign</Link>
//         </Button>
//       </div>

//       <OnboardingProgress />

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {statCards.map((stat) => (
//           <Card key={stat.title}>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
//               <stat.icon className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stat.value}</div>
//               <p className="text-xs text-green-600 dark:text-green-400">{stat.change} from last month</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <RecentCampaigns />
//         <ActivityFeed />
//       </div>
//     </div>
//   )
// }


import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { TemplatesList } from "@/components/templates/templates-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateTemplateDialog } from "@/components/templates/create-template-dialog"
import { TemplateLibraryDialog } from "@/components/templates/templates-library-dialog"
import { getTemplates } from "@/lib/actions/templates"

export default async function TemplatesPage() {
  const templates = await getTemplates()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-muted-foreground">Create and manage your email templates</p>
        </div>
        <div className="flex gap-2">
          <TemplateLibraryDialog />
          <CreateTemplateDialog />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search templates..." className="pl-9" />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="cold-outreach">Cold Outreach</TabsTrigger>
          <TabsTrigger value="follow-up">Follow-up</TabsTrigger>
          <TabsTrigger value="meeting">Meeting Request</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <TemplatesList templates={templates} />
        </TabsContent>

        <TabsContent value="cold-outreach" className="space-y-4">
          <TemplatesList templates={templates.filter((t) => t.category === "cold_outreach")} />
        </TabsContent>

        <TabsContent value="follow-up" className="space-y-4">
          <TemplatesList templates={templates.filter((t) => t.category === "follow_up")} />
        </TabsContent>

        <TabsContent value="meeting" className="space-y-4">
          <TemplatesList templates={templates.filter((t) => t.category === "meeting_request")} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
