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

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Mail, Users, TrendingUp, MousePointerClick, Flame, CheckCircle2, BarChart } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { RecentCampaigns } from "@/components/dashboard/recent-campaigns"
// import { ActivityFeed } from "@/components/dashboard/activity-feed"
// import { getDashboardStats } from "@/lib/actions/dashboard"
// import { OnboardingProgress } from "@/components/getting-started/onboarding-progress"
// import { Progress } from "@/components/ui/progress"

// export default async function DashboardPage() {
//   const stats = await getDashboardStats()

//   const statCards = [
//     {
//       title: "Emails Sent",
//       value: stats.emailsSent.toString(),
//       change: "+12.5%",
//       icon: Mail,
//       trend: "up",
//       color: "from-blue-500 to-cyan-500",
//     },
//     {
//       title: "Active Prospects",
//       value: stats.activeProspects.toString(),
//       change: "+8.2%",
//       icon: Users,
//       trend: "up",
//       color: "from-purple-500 to-pink-500",
//     },
//     {
//       title: "Open Rate",
//       value: `${stats.openRate}%`,
//       change: "+5.1%",
//       icon: TrendingUp,
//       trend: "up",
//       color: "from-green-500 to-emerald-500",
//     },
//     {
//       title: "Click Rate",
//       value: `${stats.clickRate}%`,
//       change: "+3.4%",
//       icon: MousePointerClick,
//       trend: "up",
//       color: "from-orange-500 to-amber-500",
//     },
//   ]

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//             Dashboard
//           </h1>
//           <p className="text-muted-foreground mt-1">Welcome back! Here's your campaign overview.</p>
//         </div>
//         <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
//           <Link href="/dashboard/campaigns/new">Create Campaign</Link>
//         </Button>
//       </div>

//       <OnboardingProgress />

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {statCards.map((stat) => (
//           <Card key={stat.title} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
//             <div
//               className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}
//             />
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
//               <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
//                 <stat.icon className="h-4 w-4 text-white" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold">{stat.value}</div>
//               <div className="flex items-center gap-1 mt-1">
//                 <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
//                 <p className="text-xs text-green-600 dark:text-green-400 font-medium">{stat.change} from last month</p>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="grid gap-6 md:grid-cols-3">
//         <Card className="md:col-span-1 border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-amber-500/5">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <Flame className="h-5 w-5 text-orange-500" />
//                 Warmup Status
//               </CardTitle>
//               <Button asChild variant="ghost" size="sm">
//                 <Link href="/dashboard/warmup">View All</Link>
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Domain Health</span>
//                 <span className="font-semibold">85%</span>
//               </div>
//               <Progress value={85} className="h-2" />
//             </div>
//             <div className="grid grid-cols-2 gap-4 pt-2">
//               <div className="space-y-1">
//                 <p className="text-xs text-muted-foreground">Active Accounts</p>
//                 <p className="text-2xl font-bold">3</p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-xs text-muted-foreground">Inbox Rate</p>
//                 <p className="text-2xl font-bold text-green-600 dark:text-green-400">94%</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="md:col-span-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <BarChart className="h-5 w-5" />
//               Quick Stats
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-3 gap-4">
//               <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
//                 <CheckCircle2 className="h-8 w-8 mx-auto text-green-500" />
//                 <p className="text-2xl font-bold">{stats.emailsSent}</p>
//                 <p className="text-xs text-muted-foreground">Total Sent</p>
//               </div>
//               <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
//                 <Users className="h-8 w-8 mx-auto text-blue-500" />
//                 <p className="text-2xl font-bold">{stats.activeProspects}</p>
//                 <p className="text-xs text-muted-foreground">Prospects</p>
//               </div>
//               <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
//                 <TrendingUp className="h-8 w-8 mx-auto text-purple-500" />
//                 <p className="text-2xl font-bold">{stats.openRate}%</p>
//                 <p className="text-xs text-muted-foreground">Avg. Open</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <RecentCampaigns />
//         <ActivityFeed />
//       </div>
//     </div>
//   )
// }


// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Mail, Users, TrendingUp, MousePointerClick, Flame, CheckCircle2, BarChart } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { RecentCampaigns } from "@/components/dashboard/recent-campaigns"
// import { ActivityFeed } from "@/components/dashboard/activity-feed"
// import { getDashboardStats } from "@/lib/actions/dashboard"
// import { OnboardingProgress } from "@/components/getting-started/onboarding-progress"
// import { Progress } from "@/components/ui/progress"
// import { EmailSetupBanner } from "@/components/dashboard/email-setup-banner"

// export default async function DashboardPage() {
//   const stats = await getDashboardStats()

//   const statCards = [
//     {
//       title: "Emails Sent",
//       value: stats.emailsSent.toString(),
//       change: "+12.5%",
//       icon: Mail,
//       trend: "up",
//       color: "from-blue-500 to-cyan-500",
//     },
//     {
//       title: "Active Prospects",
//       value: stats.activeProspects.toString(),
//       change: "+8.2%",
//       icon: Users,
//       trend: "up",
//       color: "from-purple-500 to-pink-500",
//     },
//     {
//       title: "Open Rate",
//       value: `${stats.openRate}%`,
//       change: "+5.1%",
//       icon: TrendingUp,
//       trend: "up",
//       color: "from-green-500 to-emerald-500",
//     },
//     {
//       title: "Click Rate",
//       value: `${stats.clickRate}%`,
//       change: "+3.4%",
//       icon: MousePointerClick,
//       trend: "up",
//       color: "from-orange-500 to-amber-500",
//     },
//   ]

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//             Dashboard
//           </h1>
//           <p className="text-muted-foreground mt-1">Welcome back! Here's your campaign overview.</p>
//         </div>
//         <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
//           <Link href="/dashboard/campaigns/new">Create Campaign</Link>
//         </Button>
//       </div>

//       <OnboardingProgress />

//       <EmailSetupBanner />

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {statCards.map((stat) => (
//           <Card key={stat.title} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
//             <div
//               className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}
//             />
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
//               <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
//                 <stat.icon className="h-4 w-4 text-white" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold">{stat.value}</div>
//               <div className="flex items-center gap-1 mt-1">
//                 <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
//                 <p className="text-xs text-green-600 dark:text-green-400 font-medium">{stat.change} from last month</p>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="grid gap-6 md:grid-cols-3">
//         <Card className="md:col-span-1 border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-amber-500/5">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <Flame className="h-5 w-5 text-orange-500" />
//                 Warmup Status
//               </CardTitle>
//               <Button asChild variant="ghost" size="sm">
//                 <Link href="/dashboard/warmup">View All</Link>
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Domain Health</span>
//                 <span className="font-semibold">85%</span>
//               </div>
//               <Progress value={85} className="h-2" />
//             </div>
//             <div className="grid grid-cols-2 gap-4 pt-2">
//               <div className="space-y-1">
//                 <p className="text-xs text-muted-foreground">Active Accounts</p>
//                 <p className="text-2xl font-bold">3</p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-xs text-muted-foreground">Inbox Rate</p>
//                 <p className="text-2xl font-bold text-green-600 dark:text-green-400">94%</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="md:col-span-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <BarChart className="h-5 w-5" />
//               Quick Stats
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-3 gap-4">
//               <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
//                 <CheckCircle2 className="h-8 w-8 mx-auto text-green-500" />
//                 <p className="text-2xl font-bold">{stats.emailsSent}</p>
//                 <p className="text-xs text-muted-foreground">Total Sent</p>
//               </div>
//               <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
//                 <Users className="h-8 w-8 mx-auto text-blue-500" />
//                 <p className="text-2xl font-bold">{stats.activeProspects}</p>
//                 <p className="text-xs text-muted-foreground">Prospects</p>
//               </div>
//               <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
//                 <TrendingUp className="h-8 w-8 mx-auto text-purple-500" />
//                 <p className="text-2xl font-bold">{stats.openRate}%</p>
//                 <p className="text-xs text-muted-foreground">Avg. Open</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <RecentCampaigns />
//         <ActivityFeed />
//       </div>
//     </div>
//   )
// }

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Mail, Users, TrendingUp, MousePointerClick, Flame, CheckCircle2, BarChart } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { RecentCampaigns } from "@/components/dashboard/recent-campaigns"
// import { ActivityFeed } from "@/components/dashboard/activity-feed"
// import { getDashboardStats } from "@/lib/actions/dashboard"
// import { OnboardingProgress } from "@/components/getting-started/onboarding-progress"
// import { Progress } from "@/components/ui/progress"
// import { EmailSetupBanner } from "@/components/dashboard/email-setup-banner"
// import { getWarmupStats } from "@/lib/actions/warmup"

// export default async function DashboardPage() {
//   const stats = await getDashboardStats()
//   const warmupStats = await getWarmupStats()

//   const statCards = [
//     {
//       title: "Emails Sent",
//       value: stats.emailsSent.toString(),
//       change: "+12.5%",
//       icon: Mail,
//       trend: "up",
//       color: "from-blue-500 to-cyan-500",
//     },
//     {
//       title: "Active Prospects",
//       value: stats.activeProspects.toString(),
//       change: "+8.2%",
//       icon: Users,
//       trend: "up",
//       color: "from-purple-500 to-pink-500",
//     },
//     {
//       title: "Open Rate",
//       value: `${stats.openRate}%`,
//       change: "+5.1%",
//       icon: TrendingUp,
//       trend: "up",
//       color: "from-green-500 to-emerald-500",
//     },
//     {
//       title: "Click Rate",
//       value: `${stats.clickRate}%`,
//       change: "+3.4%",
//       icon: MousePointerClick,
//       trend: "up",
//       color: "from-orange-500 to-amber-500",
//     },
//   ]

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//             Dashboard
//           </h1>
//           <p className="text-muted-foreground mt-1">Welcome back! Here's your campaign overview.</p>
//         </div>
//         <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
//           <Link href="/dashboard/campaigns/new">Create Campaign</Link>
//         </Button>
//       </div>

//       <OnboardingProgress />

//       <EmailSetupBanner />

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {statCards.map((stat) => (
//           <Card key={stat.title} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
//             <div
//               className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}
//             />
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
//               <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
//                 <stat.icon className="h-4 w-4 text-white" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold">{stat.value}</div>
//               <div className="flex items-center gap-1 mt-1">
//                 <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
//                 <p className="text-xs text-green-600 dark:text-green-400 font-medium">{stat.change} from last month</p>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="grid gap-6 md:grid-cols-3">
//         <Card className="md:col-span-1 border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-amber-500/5">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <Flame className="h-5 w-5 text-orange-500" />
//                 Warmup Status
//               </CardTitle>
//               <Button asChild variant="ghost" size="sm">
//                 <Link href="/dashboard/warmup">View All</Link>
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Domain Health</span>
//                 <span className="font-semibold">{warmupStats.avgHealthScore}%</span>
//               </div>
//               <Progress value={warmupStats.avgHealthScore} className="h-2" />
//             </div>
//             <div className="grid grid-cols-2 gap-4 pt-2">
//               <div className="space-y-1">
//                 <p className="text-xs text-muted-foreground">Active Accounts</p>
//                 <p className="text-2xl font-bold">{warmupStats.activeAccounts}</p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-xs text-muted-foreground">Inbox Rate</p>
//                 <p className="text-2xl font-bold text-green-600 dark:text-green-400">{warmupStats.avgInboxRate}%</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="md:col-span-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <BarChart className="h-5 w-5" />
//               Quick Stats
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-3 gap-4">
//               <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
//                 <CheckCircle2 className="h-8 w-8 mx-auto text-green-500" />
//                 <p className="text-2xl font-bold">{stats.emailsSent}</p>
//                 <p className="text-xs text-muted-foreground">Total Sent</p>
//               </div>
//               <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
//                 <Users className="h-8 w-8 mx-auto text-blue-500" />
//                 <p className="text-2xl font-bold">{stats.activeProspects}</p>
//                 <p className="text-xs text-muted-foreground">Prospects</p>
//               </div>
//               <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
//                 <TrendingUp className="h-8 w-8 mx-auto text-purple-500" />
//                 <p className="text-2xl font-bold">{stats.openRate}%</p>
//                 <p className="text-xs text-muted-foreground">Avg. Open</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <RecentCampaigns />
//         <ActivityFeed />
//       </div>
//     </div>
//   )
// }



// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   Mail,
//   Users,
//   TrendingUp,
//   TrendingDown,
//   MousePointerClick,
//   Flame,
//   CheckCircle2,
//   BarChart,
//   Minus,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { RecentCampaigns } from "@/components/dashboard/recent-campaigns"
// import { ActivityFeed } from "@/components/dashboard/activity-feed"
// import { getDashboardStats } from "@/lib/actions/dashboard"
// import { OnboardingProgress } from "@/components/getting-started/onboarding-progress"
// import { Progress } from "@/components/ui/progress"
// import { EmailSetupBanner } from "@/components/dashboard/email-setup-banner"
// import { getWarmupStats } from "@/lib/actions/warmup"

// export default async function DashboardPage() {
//   const stats = await getDashboardStats()
//   const warmupStats = await getWarmupStats()

//   const statCards = [
//     {
//       title: "Emails Sent",
//       value: stats.emailsSent.toString(),
//       change: stats.emailsSentChange,
//       icon: Mail,
//       color: "from-blue-500 to-cyan-500",
//     },
//     {
//       title: "Active Prospects",
//       value: stats.activeProspects.toString(),
//       change: stats.prospectsChange,
//       icon: Users,
//       color: "from-purple-500 to-pink-500",
//     },
//     {
//       title: "Open Rate",
//       value: `${stats.openRate}%`,
//       change: stats.openRateChange,
//       icon: TrendingUp,
//       color: "from-green-500 to-emerald-500",
//     },
//     {
//       title: "Click Rate",
//       value: `${stats.clickRate}%`,
//       change: stats.clickRateChange,
//       icon: MousePointerClick,
//       color: "from-orange-500 to-amber-500",
//     },
//   ]

//   const renderChange = (change: number | null) => {
//     if (change === null || change === 0) {
//       return (
//         <div className="flex items-center gap-1 mt-1">
//           <Minus className="h-3 w-3 text-muted-foreground" />
//           <p className="text-xs text-muted-foreground font-medium">No change from last month</p>
//         </div>
//       )
//     }

//     const isPositive = change > 0
//     const displayChange = Math.min(Math.abs(change), 100).toFixed(1)

//     return (
//       <div className="flex items-center gap-1 mt-1">
//         {isPositive ? (
//           <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
//         ) : (
//           <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
//         )}
//         <p
//           className={`text-xs font-medium ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
//         >
//           {isPositive ? "+" : "-"}
//           {displayChange}% from last month
//         </p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//             Dashboard
//           </h1>
//           <p className="text-muted-foreground mt-1">Welcome back! Here's your campaign overview.</p>
//         </div>
//         <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
//           <Link href="/dashboard/campaigns/new">Create Campaign</Link>
//         </Button>
//       </div>

//       <OnboardingProgress />

//       <EmailSetupBanner />

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {statCards.map((stat) => (
//           <Card key={stat.title} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
//             <div
//               className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}
//             />
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
//               <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
//                 <stat.icon className="h-4 w-4 text-white" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold">{stat.value}</div>
//               {renderChange(stat.change)}
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="grid gap-6 md:grid-cols-3">
//         <Card className="md:col-span-1 border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-amber-500/5">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <Flame className="h-5 w-5 text-orange-500" />
//                 Warmup Status
//               </CardTitle>
//               <Button asChild variant="ghost" size="sm">
//                 <Link href="/dashboard/warmup">View All</Link>
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Domain Health</span>
//                 <span className="font-semibold">{warmupStats.avgHealthScore}%</span>
//               </div>
//               <Progress value={warmupStats.avgHealthScore} className="h-2" />
//             </div>
//             <div className="grid grid-cols-2 gap-4 pt-2">
//               <div className="space-y-1">
//                 <p className="text-xs text-muted-foreground">Active Accounts</p>
//                 <p className="text-2xl font-bold">{warmupStats.activeAccounts}</p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-xs text-muted-foreground">Inbox Rate</p>
//                 <p className="text-2xl font-bold text-green-600 dark:text-green-400">{warmupStats.avgInboxRate}%</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="md:col-span-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <BarChart className="h-5 w-5" />
//               Quick Stats
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-3 gap-4">
//               <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
//                 <CheckCircle2 className="h-8 w-8 mx-auto text-green-500" />
//                 <p className="text-2xl font-bold">{stats.emailsSent}</p>
//                 <p className="text-xs text-muted-foreground">Total Sent</p>
//               </div>
//               <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
//                 <Users className="h-8 w-8 mx-auto text-blue-500" />
//                 <p className="text-2xl font-bold">{stats.activeProspects}</p>
//                 <p className="text-xs text-muted-foreground">Prospects</p>
//               </div>
//               <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
//                 <TrendingUp className="h-8 w-8 mx-auto text-purple-500" />
//                 <p className="text-2xl font-bold">{stats.openRate}%</p>
//                 <p className="text-xs text-muted-foreground">Avg. Open</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <RecentCampaigns />
//         <ActivityFeed />
//       </div>
//     </div>
//   )
// }

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Mail,
  Users,
  TrendingUp,
  MousePointerClick,
  Flame,
  CheckCircle2,
  BarChart3,
  ArrowUpRight,
  Zap,
  CreditCard,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { RecentCampaigns } from "@/components/dashboard/recent-campaigns"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { DomainHealthRing } from "@/components/dashboard/domain-health-ring"
import { CampaignStatusChart } from "@/components/dashboard/campaign-status-chart"
import { ProspectStatusChart } from "@/components/dashboard/prospect-status-chart"
import { EmailEngagementChart } from "@/components/dashboard/email-engagement-chart"
import { SendingAccountsHealth } from "@/components/dashboard/sending-accounts-health"
import { getDashboardData } from "@/lib/actions/dashboard"

export default async function DashboardPage() {
  const data = await getDashboardData()

  const statCards = [
    {
      title: "Emails Sent",
      value: data.overview.totalEmailsSent.toLocaleString(),
      icon: Mail,
      description: "Total outreach",
      accent: false,
    },
    {
      title: "Active Prospects",
      value: data.overview.activeProspects.toLocaleString(),
      icon: Users,
      description: `of ${data.overview.totalProspects.toLocaleString()} total`,
      accent: false,
    },
    {
      title: "Open Rate",
      value: `${data.rates.openRate}%`,
      icon: TrendingUp,
      description: "Across all campaigns",
      accent: false,
    },
    {
      title: "Reply Rate",
      value: `${data.rates.replyRate}%`,
      icon: MousePointerClick,
      description: "Engagement rate",
      accent: true,
    },
  ]

  const creditCards = [
    {
      title: "Email Credits",
      value: data.overview.emailCredits.toLocaleString(),
      icon: Mail,
      color: "foreground",
    },
    {
      title: "Research Credits",
      value: data.overview.researchCredits.toLocaleString(),
      icon: Search,
      color: "foreground",
    },
  ]

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s your campaign overview.</p>
        </div>
        <Button
          asChild
          className="bg-foreground text-background hover:bg-foreground/90 shadow-lg shadow-foreground/10 transition-all hover:shadow-xl hover:shadow-foreground/15 hover:-translate-y-0.5"
        >
          <Link href="/dashboard/campaigns/new" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Create Campaign
          </Link>
        </Button>
      </div>

      {/* Stats Grid - Glassmorphic Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card
            key={stat.title}
            className={`group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] hover:shadow-xl hover:shadow-foreground/[0.06] transition-all duration-300 hover:-translate-y-1 ${
              stat.accent ? "ring-1 ring-foreground/10" : ""
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent pointer-events-none" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className="p-2.5 rounded-xl bg-foreground/5 shadow-inner">
                <stat.icon className="h-4 w-4 text-foreground/70" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Credits Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {creditCards.map((credit) => (
          <Card
            key={credit.title}
            className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-foreground/5 shadow-inner">
                  <credit.icon className="h-5 w-5 text-foreground/70" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{credit.title}</p>
                  <p className="text-2xl font-bold text-foreground">{credit.value}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="shadow-sm hover:shadow-md transition-shadow bg-transparent"
              >
                <Link href="/dashboard/billing">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Buy More
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Donut Charts Row */}
      <div className="grid gap-6 md:grid-cols-3">
        <CampaignStatusChart data={data.charts.campaignStatus} total={data.overview.totalCampaigns} />
        <ProspectStatusChart data={data.charts.prospectStatus} total={data.overview.totalProspects} />
        <EmailEngagementChart data={data.charts.emailEngagement} totalSent={data.overview.totalEmailsSent} />
      </div>

      {/* Main Content Grid - Bento Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance Chart - Spans 2 columns */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BarChart3 className="h-5 w-5" />
                Email Performance
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Last 14 days activity</p>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              View Details
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <PerformanceChart data={data.charts.dailyPerformance} />
          </CardContent>
        </Card>

        {/* Domain Health - Radial Progress */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <Flame className="h-5 w-5" />
                Warmup Status
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Link href="/dashboard/warmup">
                  View All
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <DomainHealthRing value={data.sendingAccounts.avgHealthScore} />
            <div className="grid grid-cols-2 gap-6 w-full mt-6 pt-6 border-t border-border/50">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{data.sendingAccounts.active}</p>
                <p className="text-xs text-muted-foreground mt-1">Active Accounts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{data.sendingAccounts.total}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <CheckCircle2 className="h-5 w-5" />
            Quick Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Reply Rate",
                value: `${data.rates.replyRate}%`,
                sublabel: Number.parseFloat(data.rates.replyRate) > 5 ? "Above average" : "Room to grow",
              },
              {
                label: "Bounce Rate",
                value: `${data.rates.bounceRate}%`,
                sublabel: Number.parseFloat(data.rates.bounceRate) < 2 ? "Excellent" : "Monitor this",
              },
              {
                label: "Click Rate",
                value: `${data.rates.clickRate}%`,
                sublabel: Number.parseFloat(data.rates.clickRate) > 3 ? "Good engagement" : "Add more CTAs",
              },
              {
                label: "Active Campaigns",
                value: data.overview.activeCampaigns.toString(),
                sublabel: `of ${data.overview.totalCampaigns} total`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-xl bg-foreground/[0.02] border border-border/50 shadow-inner hover:bg-foreground/[0.04] transition-colors"
              >
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-sm font-medium text-foreground/80 mt-1">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sublabel}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sending Accounts Health */}
      <SendingAccountsHealth
        accounts={data.sendingAccounts.accounts}
        warmupStages={data.sendingAccounts.warmupStages}
      />

      {/* Bottom Section - Campaigns & Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentCampaigns campaigns={data.topCampaigns} />
        <ActivityFeed activities={data.activityFeed} />
      </div>
    </div>
  )
}
