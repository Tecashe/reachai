// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import {
//   LayoutDashboard,
//   Mail,
//   Users,
//   FileText,
//   BarChart3,
//   Settings,
//   Sparkles,
//   Zap,
//   CreditCard,
//   GitBranch,
// } from "lucide-react"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail },
//   { name: "Prospects", href: "/dashboard/prospects", icon: Users },
//   { name: "Sequences", href: "/dashboard/sequences", icon: GitBranch },
//   { name: "Templates", href: "/dashboard/templates", icon: FileText },
//   { name: "AI Generator", href: "/dashboard/generate", icon: Sparkles },
//   { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
//   { name: "Integrations", href: "/dashboard/integrations", icon: Zap },
//   { name: "Settings", href: "/dashboard/settings", icon: Settings },
//   { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
// ]

// export function DashboardSidebar() {
//   const pathname = usePathname()

//   return (
//     <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
//       <div className="p-6 border-b border-border">
//         <Link href="/dashboard" className="flex items-center gap-2">
//           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500">
//             <Sparkles className="h-5 w-5 text-white" />
//           </div>
//           <span className="text-xl font-bold">mailfra</span>
//         </Link>
//       </div>

//       <nav className="flex-1 p-4 space-y-1">
//         {navigation.map((item) => {
//           const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
//                 isActive
//                   ? "bg-primary text-primary-foreground"
//                   : "text-muted-foreground hover:bg-muted hover:text-foreground",
//               )}
//             >
//               <item.icon className="h-5 w-5" />
//               {item.name}
//             </Link>
//           )
//         })}
//       </nav>

//       <div className="p-4 border-t border-border">
//         <div className="rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 p-4 text-white">
//           <p className="text-sm font-semibold mb-1">Upgrade to Pro</p>
//           <p className="text-xs text-blue-100 mb-3">Unlock unlimited campaigns and AI credits</p>
//           <Link
//             href="/dashboard/billing"
//             className="block w-full text-center bg-white text-blue-600 rounded-md px-3 py-1.5 text-xs font-semibold hover:bg-blue-50 transition-colors"
//           >
//             Upgrade Now
//           </Link>
//         </div>
//       </div>
//     </aside>
//   )
// }

// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import {
//   LayoutDashboard,
//   Mail,
//   Users,
//   FileText,
//   BarChart3,
//   Settings,
//   Sparkles,
//   Zap,
//   CreditCard,
//   GitBranch,
// } from "lucide-react"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, tourId: "dashboard" },
//   { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail, tourId: "campaigns" },
//   { name: "Prospects", href: "/dashboard/prospects", icon: Users, tourId: "prospects" },
//   { name: "Sequences", href: "/dashboard/sequences", icon: GitBranch, tourId: "sequences" },
//   { name: "Templates", href: "/dashboard/templates", icon: FileText, tourId: "templates" },
//   { name: "AI Generator", href: "/dashboard/generate", icon: Sparkles, tourId: "ai-generator" },
//   { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, tourId: "analytics" },
//   { name: "Integrations", href: "/dashboard/integrations", icon: Zap, tourId: "integrations" },
//   { name: "Settings", href: "/dashboard/settings", icon: Settings, tourId: "settings" },
//   { name: "Billing", href: "/dashboard/billing", icon: CreditCard, tourId: "billing" },
// ]

// export function DashboardSidebar() {
//   const pathname = usePathname()

//   return (
//     <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-sm">
//       <div className="p-6 border-b border-border">
//         <Link href="/dashboard" className="flex items-center gap-2 group">
//           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg group-hover:shadow-glow transition-all duration-300">
//             <Sparkles className="h-5 w-5 text-white" />
//           </div>
//           <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//             mailfra
//           </span>
//         </Link>
//       </div>

//       <nav className="flex-1 p-4 space-y-1">
//         {navigation.map((item) => {
//           const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               data-tour={item.tourId}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
//                 isActive
//                   ? "bg-primary text-primary-foreground shadow-md"
//                   : "text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-sm",
//               )}
//             >
//               {isActive && (
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg opacity-10" />
//               )}
//               <item.icon className={cn("h-5 w-5 transition-transform duration-200", isActive && "scale-110")} />
//               <span className="relative">{item.name}</span>
//               {isActive && <div className="absolute right-2 w-1 h-6 bg-primary-foreground/30 rounded-full" />}
//             </Link>
//           )
//         })}
//       </nav>

//       <div className="p-4 border-t border-border">
//         <div className="rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 p-4 text-white shadow-lg hover:shadow-glow-lg transition-all duration-300">
//           <p className="text-sm font-semibold mb-1">Upgrade to Pro</p>
//           <p className="text-xs text-blue-100 mb-3">Unlock unlimited campaigns and AI credits</p>
//           <Link
//             href="/dashboard/billing"
//             className="block w-full text-center bg-white text-blue-600 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg"
//           >
//             Upgrade Now
//           </Link>
//         </div>
//       </div>
//     </aside>
//   )
// }

// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import {
//   LayoutDashboard,
//   Mail,
//   Users,
//   FileText,
//   BarChart3,
//   Settings,
//   Sparkles,
//   Zap,
//   CreditCard,
//   GitBranch,
//   Menu,
//   Target,
// } from "lucide-react"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, tourId: "dashboard" },
//   { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail, tourId: "campaigns" },
//   { name: "Prospects", href: "/dashboard/prospects", icon: Users, tourId: "prospects" },
//   { name: "Sequences", href: "/dashboard/sequences", icon: GitBranch, tourId: "sequences" },
//   { name: "Templates", href: "/dashboard/templates", icon: FileText, tourId: "templates" },
//   { name: "AI Generator", href: "/dashboard/generate", icon: Sparkles, tourId: "ai-generator" },
//   { name: "AI Predictor", href: "/dashboard/predict", icon: Target, tourId: "ai-predictor" },
//   { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, tourId: "analytics" },
//   { name: "Integrations", href: "/dashboard/integrations", icon: Zap, tourId: "integrations" },
//   { name: "Settings", href: "/dashboard/settings", icon: Settings, tourId: "settings" },
//   { name: "Billing", href: "/dashboard/billing", icon: CreditCard, tourId: "billing" },
// ]

// function SidebarContent() {
//   const pathname = usePathname()

//   return (
//     <>
//       <div className="p-6 border-b border-border">
//         <Link href="/dashboard" className="flex items-center gap-2 group">
//           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg group-hover:shadow-glow transition-all duration-300">
//             <Sparkles className="h-5 w-5 text-white" />
//           </div>
//           <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//             mailfra
//           </span>
//         </Link>
//       </div>

//       <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
//         {navigation.map((item) => {
//           const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               data-tour={item.tourId}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
//                 isActive
//                   ? "bg-primary text-primary-foreground shadow-md"
//                   : "text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-sm",
//               )}
//             >
//               {isActive && (
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg opacity-10" />
//               )}
//               <item.icon className={cn("h-5 w-5 transition-transform duration-200", isActive && "scale-110")} />
//               <span className="relative">{item.name}</span>
//               {isActive && <div className="absolute right-2 w-1 h-6 bg-primary-foreground/30 rounded-full" />}
//             </Link>
//           )
//         })}
//       </nav>

//       <div className="p-4 border-t border-border">
//         <div className="rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 p-4 text-white shadow-lg hover:shadow-glow-lg transition-all duration-300">
//           <p className="text-sm font-semibold mb-1">Upgrade to Pro</p>
//           <p className="text-xs text-blue-100 mb-3">Unlock unlimited campaigns and AI credits</p>
//           <Link
//             href="/dashboard/billing"
//             className="block w-full text-center bg-white text-blue-600 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg"
//           >
//             Upgrade Now
//           </Link>
//         </div>
//       </div>
//     </>
//   )
// }

// export function DashboardSidebar() {
//   return (
//     <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-sm">
//       <SidebarContent />
//     </aside>
//   )
// }

// export function MobileSidebar() {
//   const [open, setOpen] = useState(false)

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>
//         <Button variant="ghost" size="icon" className="md:hidden">
//           <Menu className="h-5 w-5" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="p-0 w-64">
//         <div className="flex flex-col h-full">
//           <SidebarContent />
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// }


// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import {
//   LayoutDashboard,
//   Mail,
//   Users,
//   FileText,
//   BarChart3,
//   Settings,
//   Sparkles,
//   Zap,
//   CreditCard,
//   GitBranch,
//   Menu,
//   Target,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react"
// import { UpgradeModal } from "@/components/subscription/upgrade-modal"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, tourId: "dashboard" },
//   { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail, tourId: "campaigns" },
//   { name: "Prospects", href: "/dashboard/prospects", icon: Users, tourId: "prospects" },
//   { name: "Sequences", href: "/dashboard/sequences", icon: GitBranch, tourId: "sequences" },
//   { name: "Templates", href: "/dashboard/templates", icon: FileText, tourId: "templates" },
//   { name: "AI Generator", href: "/dashboard/generate", icon: Sparkles, tourId: "ai-generator" },
//   { name: "AI Predictor", href: "/dashboard/predict", icon: Target, tourId: "ai-predictor" },
//   { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, tourId: "analytics" },
//   { name: "Integrations", href: "/dashboard/integrations", icon: Zap, tourId: "integrations" },
//   { name: "Settings", href: "/dashboard/settings", icon: Settings, tourId: "settings" },
//   { name: "Billing", href: "/dashboard/billing", icon: CreditCard, tourId: "billing" },
// ]

// interface SidebarContentProps {
//   collapsed?: boolean
//   onToggleCollapse?: () => void
// }

// function SidebarContent({ collapsed = false, onToggleCollapse }: SidebarContentProps) {
//   const pathname = usePathname()
//   const [showUpgrade, setShowUpgrade] = useState(false)

//   return (
//     <>
//       <div className={cn("p-6 border-b border-border/50 transition-all duration-300", collapsed && "p-4")}>
//         <Link href="/dashboard" className="flex items-center gap-2 group">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 shadow-lg group-hover:shadow-glow-lg transition-all duration-300 group-hover:scale-110">
//             <Sparkles className="h-5 w-5 text-white" />
//           </div>
//           {!collapsed && (
//             <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
//               mailfra
//             </span>
//           )}
//         </Link>
//       </div>

//       <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
//         {navigation.map((item) => {
//           const isActive =
//             pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"))
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               data-tour={item.tourId}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
//                 isActive
//                   ? "bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-cyan-400 shadow-sm"
//                   : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
//                 collapsed && "justify-center px-2",
//               )}
//             >
//               {isActive && (
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-500/5 animate-pulse" />
//               )}
//               <item.icon
//                 className={cn(
//                   "h-5 w-5 transition-all duration-200 relative z-10",
//                   isActive && "scale-110 drop-shadow-glow",
//                 )}
//               />
//               {!collapsed && <span className="relative z-10">{item.name}</span>}
//               {isActive && !collapsed && (
//                 <div className="absolute right-2 w-1.5 h-8 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-full shadow-glow" />
//               )}
//             </Link>
//           )
//         })}
//       </nav>

//       {!collapsed && (
//         <div className="p-4 border-t border-border/50">
//           <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 p-[2px] shadow-lg hover:shadow-glow-lg transition-all duration-300">
//             <div className="rounded-2xl bg-background p-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <Sparkles className="h-5 w-5 text-blue-500" />
//                 <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//                   Upgrade to Pro
//                 </p>
//               </div>
//               <p className="text-xs text-muted-foreground mb-3">Unlock unlimited campaigns and AI credits</p>
//               <Button
//                 onClick={() => setShowUpgrade(true)}
//                 className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
//                 size="sm"
//               >
//                 Upgrade Now
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {onToggleCollapse && (
//         <div className="p-3 border-t border-border/50">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onToggleCollapse}
//             className="w-full justify-center hover:bg-muted/50"
//           >
//             {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//           </Button>
//         </div>
//       )}

//       <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} currentTier="FREE" />
//     </>
//   )
// }

// export function DashboardSidebar() {
//   const [collapsed, setCollapsed] = useState(false)

//   return (
//     <aside
//       className={cn(
//         "hidden md:flex flex-col border-r border-border/50 bg-card/30 backdrop-blur-xl transition-all duration-300 shadow-sm",
//         collapsed ? "w-20" : "w-64",
//       )}
//     >
//       <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
//     </aside>
//   )
// }

// export function MobileSidebar() {
//   const [open, setOpen] = useState(false)

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>
//         <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted/50">
//           <Menu className="h-5 w-5" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="p-0 w-64">
//         <div className="flex flex-col h-full">
//           <SidebarContent />
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// }


// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import {
//   LayoutDashboard,
//   Mail,
//   Users,
//   FileText,
//   BarChart3,
//   Settings,
//   Sparkles,
//   Zap,
//   CreditCard,
//   GitBranch,
//   Menu,
//   Target,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react"
// import { UpgradeModal } from "@/components/subscription/upgrade-modal"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, tourId: "dashboard" },
//   { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail, tourId: "campaigns" },
//   { name: "Prospects", href: "/dashboard/prospects", icon: Users, tourId: "prospects" },
//   { name: "Sequences", href: "/dashboard/sequences", icon: GitBranch, tourId: "sequences" },
//   { name: "Templates", href: "/dashboard/templates", icon: FileText, tourId: "templates" },
//   { name: "AI Generator", href: "/dashboard/generate", icon: Sparkles, tourId: "ai-generator" },
//   { name: "AI Predictor", href: "/dashboard/predict", icon: Target, tourId: "ai-predictor" },
//   { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, tourId: "analytics" },
//   { name: "Integrations", href: "/dashboard/integrations", icon: Zap, tourId: "integrations" },
//   { name: "Settings", href: "/dashboard/settings", icon: Settings, tourId: "settings" },
//   { name: "Billing", href: "/dashboard/billing", icon: CreditCard, tourId: "billing" },
// ]

// interface SidebarContentProps {
//   collapsed?: boolean
//   onToggleCollapse?: () => void
// }

// function SidebarContent({ collapsed = false, onToggleCollapse }: SidebarContentProps) {
//   const pathname = usePathname()
//   const [showUpgrade, setShowUpgrade] = useState(false)

//   return (
//     <>
//       <div className={cn("p-6 border-b border-border/50 transition-all duration-300", collapsed && "p-4")}>
//         <Link href="/dashboard" className="flex items-center gap-2 group">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 shadow-lg group-hover:shadow-glow-lg transition-all duration-300 group-hover:scale-110">
//             <Sparkles className="h-5 w-5 text-white" />
//           </div>
//           {!collapsed && (
//             <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
//               mailfra
//             </span>
//           )}
//         </Link>
//       </div>

//       <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
//         {navigation.map((item) => {
//           const isActive =
//             pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"))
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               data-tour={item.tourId}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
//                 isActive
//                   ? "bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-cyan-400 shadow-sm"
//                   : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
//                 collapsed && "justify-center px-2",
//               )}
//             >
//               {isActive && (
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-500/5 animate-pulse" />
//               )}
//               <item.icon
//                 className={cn(
//                   "h-5 w-5 transition-all duration-200 relative z-10",
//                   isActive && "scale-110 drop-shadow-glow",
//                 )}
//               />
//               {!collapsed && <span className="relative z-10">{item.name}</span>}
//               {isActive && !collapsed && (
//                 <div className="absolute right-2 w-1.5 h-8 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-full shadow-glow" />
//               )}
//             </Link>
//           )
//         })}
//       </nav>

//       {!collapsed && (
//         <div className="p-4 border-t border-border/50">
//           <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 p-[2px] shadow-lg hover:shadow-glow-lg transition-all duration-300">
//             <div className="rounded-2xl bg-background p-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <Sparkles className="h-5 w-5 text-blue-500" />
//                 <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//                   Upgrade to Pro
//                 </p>
//               </div>
//               <p className="text-xs text-muted-foreground mb-3">Unlock unlimited campaigns and AI credits</p>
//               <Button
//                 onClick={() => setShowUpgrade(true)}
//                 className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
//                 size="sm"
//               >
//                 Upgrade Now
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {onToggleCollapse && (
//         <div className="p-3 border-t border-border/50">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onToggleCollapse}
//             className="w-full justify-center hover:bg-muted/50"
//           >
//             {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//           </Button>
//         </div>
//       )}

//       <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} currentTier="FREE" />
//     </>
//   )
// }

// export function DashboardSidebar() {
//   const [collapsed, setCollapsed] = useState(false)

//   return (
//     <aside
//       className={cn(
//         "hidden md:flex flex-col h-screen border-r border-border/50 bg-card/30 backdrop-blur-xl transition-all duration-300 shadow-sm overflow-hidden",
//         collapsed ? "w-20" : "w-64",
//       )}
//     >
//       <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
//     </aside>
//   )
// }

// export function MobileSidebar() {
//   const [open, setOpen] = useState(false)

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>
//         <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted/50">
//           <Menu className="h-5 w-5" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="p-0 w-64">
//         <div className="flex flex-col h-full">
//           <SidebarContent />
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// }


// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import {
//   LayoutDashboard,
//   Mail,
//   Users,
//   FileText,
//   BarChart3,
//   Settings,
//   Sparkles,
//   Zap,
//   CreditCard,
//   GitBranch,
//   Menu,
//   Target,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react"
// import { UpgradeModal } from "@/components/subscription/upgrade-modal"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, tourId: "dashboard" },
//   { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail, tourId: "campaigns" },
//   { name: "Prospects", href: "/dashboard/prospects", icon: Users, tourId: "prospects" },
//   { name: "Sequences", href: "/dashboard/sequences", icon: GitBranch, tourId: "sequences" },
//   { name: "Templates", href: "/dashboard/templates", icon: FileText, tourId: "templates" },
//   { name: "AI Generator", href: "/dashboard/generate", icon: Sparkles, tourId: "ai-generator" },
//   { name: "AI Predictor", href: "/dashboard/predict", icon: Target, tourId: "ai-predictor" },
//   { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, tourId: "analytics" },
//   { name: "Integrations", href: "/dashboard/integrations", icon: Zap, tourId: "integrations" },
//   { name: "Settings", href: "/dashboard/settings", icon: Settings, tourId: "settings" },
//   { name: "Billing", href: "/dashboard/billing", icon: CreditCard, tourId: "billing" },
// ]

// interface SidebarContentProps {
//   collapsed?: boolean
//   onToggleCollapse?: () => void
// }

// function SidebarContent({ collapsed = false, onToggleCollapse }: SidebarContentProps) {
//   const pathname = usePathname()
//   const [showUpgrade, setShowUpgrade] = useState(false)

//   return (
//     <>
//       <div className={cn("p-6 border-b border-border/50 transition-all duration-300", collapsed && "p-4")}>
//         <Link href="/dashboard" className="flex items-center gap-2 group">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 shadow-lg drop-shadow-md group-hover:drop-shadow-2xl transition-all duration-300 group-hover:scale-110">
//             <Sparkles className="h-5 w-5 text-white" />
//           </div>
//           {!collapsed && (
//             <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
//               mailfra
//             </span>
//           )}
//         </Link>
//       </div>

//       <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
//         {navigation.map((item) => {
//           const isActive =
//             pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"))
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               data-tour={item.tourId}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
//                 isActive
//                   ? "bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-cyan-400 shadow-sm"
//                   : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
//                 collapsed && "justify-center px-2",
//               )}
//             >
//               {isActive && (
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-500/5 animate-pulse" />
//               )}
//               <item.icon
//                 className={cn(
//                   "h-5 w-5 transition-all duration-200 relative z-10",
//                   isActive && "scale-110 drop-shadow-md",
//                 )}
//               />
//               {!collapsed && <span className="relative z-10">{item.name}</span>}
//               {isActive && !collapsed && (
//                 <div className="absolute right-2 w-1.5 h-8 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-full drop-shadow-md" />
//               )}
//             </Link>
//           )
//         })}
//       </nav>

//       {!collapsed && (
//         <div className="p-4 border-t border-border/50">
//           <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 p-[2px] shadow-lg drop-shadow-lg hover:drop-shadow-xl transition-all duration-300">
//             <div className="rounded-2xl bg-background p-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <Sparkles className="h-5 w-5 text-blue-500" />
//                 <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//                   Upgrade to Pro
//                 </p>
//               </div>
//               <p className="text-xs text-muted-foreground mb-3">Unlock unlimited campaigns and AI credits</p>
//               <Button
//                 onClick={() => setShowUpgrade(true)}
//                 className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
//                 size="sm"
//               >
//                 Upgrade Now
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {onToggleCollapse && (
//         <div className="p-3 border-t border-border/50">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onToggleCollapse}
//             className="w-full justify-center hover:bg-muted/50"
//           >
//             {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//           </Button>
//         </div>
//       )}

//       <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} currentTier="FREE" />
//     </>
//   )
// }

// export function DashboardSidebar() {
//   const [collapsed, setCollapsed] = useState(false)

//   return (
//     <aside
//       className={cn(
//         "hidden md:flex flex-col h-screen border-r border-border/50 bg-card/30 backdrop-blur-xl transition-all duration-300 shadow-sm overflow-hidden",
//         collapsed ? "w-20" : "w-64",
//       )}
//     >
//       <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
//     </aside>
//   )
// }

// export function MobileSidebar() {
//   const [open, setOpen] = useState(false)

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>
//         <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted/50">
//           <Menu className="h-5 w-5" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="p-0 w-64">
//         <div className="flex flex-col h-full">
//           <SidebarContent />
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// }

// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import {
//   LayoutDashboard,
//   Mail,
//   Users,
//   FileText,
//   BarChart3,
//   Settings,
//   Sparkles,
//   Zap,
//   CreditCard,
//   GitBranch,
//   Menu,
//   Target,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react"
// import { UpgradeModal } from "@/components/subscription/upgrade-modal"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, tourId: "dashboard" },
//   { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail, tourId: "campaigns" },
//   { name: "Prospects", href: "/dashboard/prospects", icon: Users, tourId: "prospects" },
//   { name: "Sequences", href: "/dashboard/sequences", icon: GitBranch, tourId: "sequences" },
//   { name: "Templates", href: "/dashboard/templates", icon: FileText, tourId: "templates" },
//   { name: "AI Generator", href: "/dashboard/generate", icon: Sparkles, tourId: "ai-generator" },
//   { name: "AI Predictor", href: "/dashboard/predict", icon: Target, tourId: "ai-predictor" },
//   { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, tourId: "analytics" },
//   { name: "Integrations", href: "/dashboard/integrations", icon: Zap, tourId: "integrations" },
//   { name: "Settings", href: "/dashboard/settings", icon: Settings, tourId: "settings" },
//   { name: "Billing", href: "/dashboard/billing", icon: CreditCard, tourId: "billing" },
// ]

// interface SidebarContentProps {
//   collapsed?: boolean
//   onToggleCollapse?: () => void
//   onNavigate?: () => void // Added callback for navigation
// }

// function SidebarContent({ collapsed = false, onToggleCollapse, onNavigate }: SidebarContentProps) {
//   const pathname = usePathname()
//   const [showUpgrade, setShowUpgrade] = useState(false)

//   return (
//     <>
//       <div className={cn("p-6 border-b border-border/50 transition-all duration-300", collapsed && "p-4")}>
//         <Link href="/dashboard" className="flex items-center gap-2 group">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 shadow-lg drop-shadow-md group-hover:drop-shadow-2xl transition-all duration-300 group-hover:scale-110">
//             <Sparkles className="h-5 w-5 text-white" />
//           </div>
//           {!collapsed && (
//             <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
//               mailfra
//             </span>
//           )}
//         </Link>
//       </div>

//       <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40">
//         {navigation.map((item) => {
//           const isActive =
//             pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"))
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               data-tour={item.tourId}
//               onClick={onNavigate} // Call onNavigate when link is clicked
//               className={cn(
//                 "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
//                 isActive
//                   ? "bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-cyan-400 shadow-sm"
//                   : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
//                 collapsed && "justify-center px-2",
//               )}
//             >
//               {isActive && (
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-500/5 animate-pulse" />
//               )}
//               <item.icon
//                 className={cn(
//                   "h-5 w-5 transition-all duration-200 relative z-10",
//                   isActive && "scale-110 drop-shadow-md",
//                 )}
//               />
//               {!collapsed && <span className="relative z-10">{item.name}</span>}
//               {isActive && !collapsed && (
//                 <div className="absolute right-2 w-1.5 h-8 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-full drop-shadow-md" />
//               )}
//             </Link>
//           )
//         })}
//       </nav>

//       {!collapsed && (
//         <div className="p-4 border-t border-border/50">
//           <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 p-[2px] shadow-lg drop-shadow-lg hover:drop-shadow-xl transition-all duration-300">
//             <div className="rounded-2xl bg-background p-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <Sparkles className="h-5 w-5 text-blue-500" />
//                 <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//                   Upgrade to Pro
//                 </p>
//               </div>
//               <p className="text-xs text-muted-foreground mb-3">Unlock unlimited campaigns and AI credits</p>
//               <Button
//                 onClick={() => setShowUpgrade(true)}
//                 className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
//                 size="sm"
//               >
//                 Upgrade Now
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {onToggleCollapse && (
//         <div className="p-3 border-t border-border/50">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onToggleCollapse}
//             className="w-full justify-center hover:bg-muted/50"
//           >
//             {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//           </Button>
//         </div>
//       )}

//       <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} currentTier="FREE" />
//     </>
//   )
// }

// export function DashboardSidebar() {
//   const [collapsed, setCollapsed] = useState(false)

//   return (
//     <aside
//       className={cn(
//         "hidden md:flex flex-col h-screen border-r border-border/50 bg-card/30 backdrop-blur-xl transition-all duration-300 shadow-sm",
//         collapsed ? "w-20" : "w-64",
//       )}
//     >
//       <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
//     </aside>
//   )
// }

// export function MobileSidebar() {
//   const [open, setOpen] = useState(false)

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>
//         <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted/50">
//           <Menu className="h-5 w-5" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="p-0 w-64">
//         <div className="flex flex-col h-full">
//           <SidebarContent onNavigate={() => setOpen(false)} />
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// }


// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import {
//   LayoutDashboard,
//   Mail,
//   Users,
//   FileText,
//   BarChart3,
//   Settings,
//   Sparkles,
//   Zap,
//   CreditCard,
//   GitBranch,
//   Menu,
//   Target,
//   ChevronLeft,
//   ChevronRight,
//   Inbox,
// } from "lucide-react"
// import { UpgradeModal } from "@/components/subscription/upgrade-modal"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, tourId: "dashboard" },
//   { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail, tourId: "campaigns" },
//   { name: "Inbox", href: "/dashboard/inbox", icon: Inbox, tourId: "inbox" },
//   { name: "Prospects", href: "/dashboard/prospects", icon: Users, tourId: "prospects" },
//   { name: "Sequences", href: "/dashboard/sequences", icon: GitBranch, tourId: "sequences" },
//   { name: "Templates", href: "/dashboard/templates", icon: FileText, tourId: "templates" },
//   { name: "AI Generator", href: "/dashboard/generate", icon: Sparkles, tourId: "ai-generator" },
//   { name: "AI Predictor", href: "/dashboard/predict", icon: Target, tourId: "ai-predictor" },
//   { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, tourId: "analytics" },
//   { name: "Integrations", href: "/dashboard/integrations", icon: Zap, tourId: "integrations" },
//   { name: "Settings", href: "/dashboard/settings", icon: Settings, tourId: "settings" },
//   { name: "Billing", href: "/dashboard/billing", icon: CreditCard, tourId: "billing" },
// ]

// interface SidebarContentProps {
//   collapsed?: boolean
//   onToggleCollapse?: () => void
//   onNavigate?: () => void // Added callback for navigation
// }

// function SidebarContent({ collapsed = false, onToggleCollapse, onNavigate }: SidebarContentProps) {
//   const pathname = usePathname()
//   const [showUpgrade, setShowUpgrade] = useState(false)

//   return (
//     <>
//       <div className={cn("p-6 border-b border-border/50 transition-all duration-300", collapsed && "p-4")}>
//         <Link href="/dashboard" className="flex items-center gap-2 group">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 shadow-lg drop-shadow-md group-hover:drop-shadow-2xl transition-all duration-300 group-hover:scale-110">
//             <Sparkles className="h-5 w-5 text-white" />
//           </div>
//           {!collapsed && (
//             <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
//               mailfra
//             </span>
//           )}
//         </Link>
//       </div>

//       <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40">
//         {navigation.map((item) => {
//           const isActive =
//             pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"))
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               data-tour={item.tourId}
//               onClick={onNavigate} // Call onNavigate when link is clicked
//               className={cn(
//                 "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
//                 isActive
//                   ? "bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-cyan-400 shadow-sm"
//                   : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
//                 collapsed && "justify-center px-2",
//               )}
//             >
//               {isActive && (
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-500/5 animate-pulse" />
//               )}
//               <item.icon
//                 className={cn(
//                   "h-5 w-5 transition-all duration-200 relative z-10",
//                   isActive && "scale-110 drop-shadow-md",
//                 )}
//               />
//               {!collapsed && <span className="relative z-10">{item.name}</span>}
//               {isActive && !collapsed && (
//                 <div className="absolute right-2 w-1.5 h-8 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-full drop-shadow-md" />
//               )}
//             </Link>
//           )
//         })}
//       </nav>

//       {!collapsed && (
//         <div className="p-4 border-t border-border/50">
//           <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 p-[2px] shadow-lg drop-shadow-lg hover:drop-shadow-xl transition-all duration-300">
//             <div className="rounded-2xl bg-background p-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <Sparkles className="h-5 w-5 text-blue-500" />
//                 <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//                   Upgrade to Pro
//                 </p>
//               </div>
//               <p className="text-xs text-muted-foreground mb-3">Unlock unlimited campaigns and AI credits</p>
//               <Button
//                 onClick={() => setShowUpgrade(true)}
//                 className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
//                 size="sm"
//               >
//                 Upgrade Now
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {onToggleCollapse && (
//         <div className="p-3 border-t border-border/50">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onToggleCollapse}
//             className="w-full justify-center hover:bg-muted/50"
//           >
//             {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//           </Button>
//         </div>
//       )}

//       <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} currentTier="FREE" />
//     </>
//   )
// }

// export function DashboardSidebar() {
//   const [collapsed, setCollapsed] = useState(false)

//   return (
//     <aside
//       className={cn(
//         "hidden md:flex flex-col h-screen border-r border-border/50 bg-card/30 backdrop-blur-xl transition-all duration-300 shadow-sm",
//         collapsed ? "w-20" : "w-64",
//       )}
//     >
//       <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
//     </aside>
//   )
// }

// export function MobileSidebar() {
//   const [open, setOpen] = useState(false)

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>
//         <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted/50">
//           <Menu className="h-5 w-5" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="p-0 w-64">
//         <div className="flex flex-col h-full">
//           <SidebarContent onNavigate={() => setOpen(false)} />
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// }

// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import {
//   LayoutDashboard,
//   Mail,
//   Users,
//   FileText,
//   BarChart3,
//   Settings,
//   Sparkles,
//   Zap,
//   CreditCard,
//   GitBranch,
//   Menu,
//   Target,
//   ChevronLeft,
//   ChevronRight,
//   Inbox,
// } from "lucide-react"
// import { UpgradeModal } from "@/components/subscription/upgrade-modal"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, tourId: "dashboard" },
//   { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail, tourId: "campaigns" },
//   { name: "Inbox", href: "/dashboard/inbox", icon: Inbox, tourId: "inbox" },
//   { name: "Prospects", href: "/dashboard/prospects", icon: Users, tourId: "prospects" },
//   { name: "Sequences", href: "/dashboard/sequences", icon: GitBranch, tourId: "sequences" },
//   { name: "Templates", href: "/dashboard/templates", icon: FileText, tourId: "templates" },
//   { name: "AI Generator", href: "/dashboard/generate", icon: Sparkles, tourId: "ai-generator" },
//   { name: "AI Predictor", href: "/dashboard/predict", icon: Target, tourId: "ai-predictor" },
//   { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, tourId: "analytics" },
//   { name: "Integrations", href: "/dashboard/integrations", icon: Zap, tourId: "integrations" },
//   { name: "Settings", href: "/dashboard/settings", icon: Settings, tourId: "settings" },
//   { name: "Billing", href: "/dashboard/billing", icon: CreditCard, tourId: "billing" },
// ]

// interface SidebarContentProps {
//   collapsed?: boolean
//   onToggleCollapse?: () => void
//   onNavigate?: () => void // Added callback for navigation
// }

// function SidebarContent({ collapsed = false, onToggleCollapse, onNavigate }: SidebarContentProps) {
//   const pathname = usePathname()
//   const [showUpgrade, setShowUpgrade] = useState(false)

//   return (
//     <>
//       <div className={cn("p-6 border-b border-border/50 transition-all duration-300", collapsed && "p-4")}>
//         <Link href="/dashboard" className="flex items-center gap-2 group">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 shadow-lg drop-shadow-md group-hover:drop-shadow-2xl transition-all duration-300 group-hover:scale-110">
//             <Sparkles className="h-5 w-5 text-white" />
//           </div>
//           {!collapsed && (
//             <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
//               mailfra
//             </span>
//           )}
//         </Link>
//       </div>

//       <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40">
//         {navigation.map((item) => {
//           const isActive =
//             pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"))
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               data-tour={item.tourId}
//               onClick={onNavigate} // Call onNavigate when link is clicked
//               className={cn(
//                 "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
//                 isActive
//                   ? "bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-cyan-400 shadow-sm"
//                   : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
//                 collapsed && "justify-center px-2",
//               )}
//             >
//               {isActive && (
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-500/5 animate-pulse" />
//               )}
//               <item.icon
//                 className={cn(
//                   "h-5 w-5 transition-all duration-200 relative z-10",
//                   isActive && "scale-110 drop-shadow-md",
//                 )}
//               />
//               {!collapsed && <span className="relative z-10">{item.name}</span>}
//               {isActive && !collapsed && (
//                 <div className="absolute right-2 w-1.5 h-8 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-full drop-shadow-md" />
//               )}
//             </Link>
//           )
//         })}
//       </nav>

//       {!collapsed && (
//         <div className="p-4 border-t border-border/50">
//           <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 p-[2px] shadow-lg drop-shadow-lg hover:drop-shadow-xl transition-all duration-300">
//             <div className="rounded-2xl bg-background p-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <Sparkles className="h-5 w-5 text-blue-500" />
//                 <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//                   Upgrade to Pro
//                 </p>
//               </div>
//               <p className="text-xs text-muted-foreground mb-3">Unlock unlimited campaigns and AI credits</p>
//               <Button
//                 onClick={() => setShowUpgrade(true)}
//                 className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
//                 size="sm"
//               >
//                 Upgrade Now
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {onToggleCollapse && (
//         <div className="p-3 border-t border-border/50">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onToggleCollapse}
//             className="w-full justify-center hover:bg-muted/50"
//           >
//             {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//           </Button>
//         </div>
//       )}

//       <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} currentTier="FREE" />
//     </>
//   )
// }

// export function DashboardSidebar() {
//   const [collapsed, setCollapsed] = useState(false)

//   return (
//     <aside
//       className={cn(
//         "hidden md:flex flex-col h-screen border-r border-border/50 bg-card/30 backdrop-blur-xl transition-all duration-300 shadow-sm",
//         collapsed ? "w-20" : "w-64",
//       )}
//     >
//       <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
//     </aside>
//   )
// }

// export function MobileSidebar() {
//   const [open, setOpen] = useState(false)

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>
//         <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted/50">
//           <Menu className="h-5 w-5" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="p-0 w-64">
//         <div className="flex flex-col h-full">
//           <SidebarContent onNavigate={() => setOpen(false)} />
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// }

// "use client"

// import Link from "next/link"
// import Image from "next/image"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import {
//   LayoutDashboard,
//   Mail,
//   Users,
//   FileText,
//   BarChart3,
//   Settings,
//   Sparkles,
//   Zap,
//   CreditCard,
//   GitBranch,
//   Menu,
//   Target,
//   ChevronLeft,
//   ChevronRight,
//   Inbox,
// } from "lucide-react"
// import { UpgradeModal } from "@/components/subscription/upgrade-modal"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, tourId: "dashboard" },
//   { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail, tourId: "campaigns" },
//   { name: "Inbox", href: "/dashboard/inbox", icon: Inbox, tourId: "inbox" },
//   { name: "Prospects", href: "/dashboard/prospects", icon: Users, tourId: "prospects" },
//   { name: "Sequences", href: "/dashboard/sequences", icon: GitBranch, tourId: "sequences" },
//   { name: "Templates", href: "/dashboard/templates", icon: FileText, tourId: "templates" },
//   { name: "AI Generator", href: "/dashboard/generate", icon: Sparkles, tourId: "ai-generator" },
//   { name: "AI Predictor", href: "/dashboard/predict", icon: Target, tourId: "ai-predictor" },
//   { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, tourId: "analytics" },
//   { name: "Integrations", href: "/dashboard/integrations", icon: Zap, tourId: "integrations" },
//   { name: "Settings", href: "/dashboard/settings", icon: Settings, tourId: "settings" },
//   { name: "Billing", href: "/dashboard/billing", icon: CreditCard, tourId: "billing" },
// ]

// interface SidebarContentProps {
//   collapsed?: boolean
//   onToggleCollapse?: () => void
//   onNavigate?: () => void
// }

// function SidebarContent({ collapsed = false, onToggleCollapse, onNavigate }: SidebarContentProps) {
//   const pathname = usePathname()
//   const [showUpgrade, setShowUpgrade] = useState(false)

//   return (
//     <>
//       <div className={cn("p-6 border-b border-border/50 transition-all duration-300", collapsed && "p-4")}>
//         <Link href="/dashboard" className="flex items-center gap-2 group">
//           <div className="relative h-10 w-10 flex items-center justify-center rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
//             <Image
//               src="/logo.png"
//               alt="mailfra Logo"
//               width={40}
//               height={40}
//               className="object-contain"
//               priority
//             />
//           </div>
//           {!collapsed && (
//             <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
//               mailfra
//             </span>
//           )}
//         </Link>
//       </div>

//       <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40">
//         {navigation.map((item) => {
//           const isActive =
//             pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"))
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               data-tour={item.tourId}
//               onClick={onNavigate}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
//                 isActive
//                   ? "bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-cyan-400 shadow-sm"
//                   : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
//                 collapsed && "justify-center px-2",
//               )}
//             >
//               {isActive && (
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-500/5 animate-pulse" />
//               )}
//               <item.icon
//                 className={cn(
//                   "h-5 w-5 transition-all duration-200 relative z-10",
//                   isActive && "scale-110 drop-shadow-md",
//                 )}
//               />
//               {!collapsed && <span className="relative z-10">{item.name}</span>}
//               {isActive && !collapsed && (
//                 <div className="absolute right-2 w-1.5 h-8 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-full drop-shadow-md" />
//               )}
//             </Link>
//           )
//         })}
//       </nav>

//       {!collapsed && (
//         <div className="p-4 border-t border-border/50">
//           <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 p-[2px] shadow-lg drop-shadow-lg hover:drop-shadow-xl transition-all duration-300">
//             <div className="rounded-2xl bg-background p-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <Sparkles className="h-5 w-5 text-blue-500" />
//                 <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//                   Upgrade to Pro
//                 </p>
//               </div>
//               <p className="text-xs text-muted-foreground mb-3">Unlock unlimited campaigns and AI credits</p>
//               <Button
//                 onClick={() => setShowUpgrade(true)}
//                 className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
//                 size="sm"
//               >
//                 Upgrade Now
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {onToggleCollapse && (
//         <div className="p-3 border-t border-border/50">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onToggleCollapse}
//             className="w-full justify-center hover:bg-muted/50"
//           >
//             {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//           </Button>
//         </div>
//       )}

//       <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} currentTier="FREE" />
//     </>
//   )
// }

// export function DashboardSidebar() {
//   const [collapsed, setCollapsed] = useState(false)

//   return (
//     <aside
//       className={cn(
//         "hidden md:flex flex-col h-screen border-r border-border/50 bg-card/30 backdrop-blur-xl transition-all duration-300 shadow-sm",
//         collapsed ? "w-20" : "w-64",
//       )}
//     >
//       <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
//     </aside>
//   )
// }

// export function MobileSidebar() {
//   const [open, setOpen] = useState(false)

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>
//         <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted/50">
//           <Menu className="h-5 w-5" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="p-0 w-64">
//         <div className="flex flex-col h-full">
//           <SidebarContent onNavigate={() => setOpen(false)} />
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// }


// "use client"

// import Link from "next/link"
// import Image from "next/image"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import {
//   LayoutDashboard,
//   Mail,
//   Users,
//   FileText,
//   BarChart3,
//   Settings,
//   Sparkles,
//   Zap,
//   CreditCard,
//   GitBranch,
//   Menu,
//   Target,
//   ChevronLeft,
//   ChevronRight,
//   Inbox,
//   Building2,
//   MailCheck,
// } from "lucide-react"
// import { UpgradeModal } from "@/components/subscription/upgrade-modal"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, tourId: "dashboard" },
//   { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail, tourId: "campaigns" },
//   { name: "CRM", href: "/dashboard/crm", icon: Building2, tourId: "crm" },
//    { name: "Deliverability", href: "/dashboard/deliverability", icon: MailCheck, tourId: "deliverability" },
//   { name: "Inbox", href: "/dashboard/inbox", icon: Inbox, tourId: "inbox" },
//   { name: "Prospects", href: "/dashboard/prospects", icon: Users, tourId: "prospects" },
//   { name: "Sequences", href: "/dashboard/sequences", icon: GitBranch, tourId: "sequences" },
//   { name: "Templates", href: "/dashboard/templates", icon: FileText, tourId: "templates" },
//   { name: "AI Generator", href: "/dashboard/generate", icon: Sparkles, tourId: "ai-generator" },
//   { name: "AI Predictor", href: "/dashboard/predict", icon: Target, tourId: "ai-predictor" },
//   { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, tourId: "analytics" },
//   { name: "Integrations", href: "/dashboard/integrations", icon: Zap, tourId: "integrations" },
//   { name: "Settings", href: "/dashboard/settings", icon: Settings, tourId: "settings" },
//   { name: "Billing", href: "/dashboard/billing", icon: CreditCard, tourId: "billing" },
// ]

// interface SidebarContentProps {
//   collapsed?: boolean
//   onToggleCollapse?: () => void
//   onNavigate?: () => void // Added callback for navigation
// }

// function SidebarContent({ collapsed = false, onToggleCollapse, onNavigate }: SidebarContentProps) {
//   const pathname = usePathname()
//   const [showUpgrade, setShowUpgrade] = useState(false)

//   return (
//     <>
//       <div className={cn("p-6 border-b border-border/50 transition-all duration-300", collapsed && "p-4")}>
//         <Link href="/dashboard" className="flex items-center gap-2 group">
//           <div className="relative h-10 w-10 flex items-center justify-center rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
//             <Image
//               src="/logo.png"
//               alt="mailfra Logo"
//               width={40}
//               height={40}
//               className="object-contain"
//               priority
//             />
//           </div>
//           {!collapsed && (
//             <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
//               mailfra
//             </span>
//           )}
//         </Link>
//       </div>

//       <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40">
//         {navigation.map((item) => {
//           const isActive =
//             pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"))
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               data-tour={item.tourId}
//               onClick={onNavigate} // Call onNavigate when link is clicked
//               className={cn(
//                 "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
//                 isActive
//                   ? "bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-cyan-400 shadow-sm"
//                   : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
//                 collapsed && "justify-center px-2",
//               )}
//             >
//               {isActive && (
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-500/5 animate-pulse" />
//               )}
//               <item.icon
//                 className={cn(
//                   "h-5 w-5 transition-all duration-200 relative z-10",
//                   isActive && "scale-110 drop-shadow-md",
//                 )}
//               />
//               {!collapsed && <span className="relative z-10">{item.name}</span>}
//               {isActive && !collapsed && (
//                 <div className="absolute right-2 w-1.5 h-8 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-full drop-shadow-md" />
//               )}
//             </Link>
//           )
//         })}
//       </nav>

//       {!collapsed && (
//         <div className="p-4 border-t border-border/50">
//           <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 p-[2px] shadow-lg drop-shadow-lg hover:drop-shadow-xl transition-all duration-300">
//             <div className="rounded-2xl bg-background p-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <Sparkles className="h-5 w-5 text-blue-500" />
//                 <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//                   Upgrade to Pro
//                 </p>
//               </div>
//               <p className="text-xs text-muted-foreground mb-3">Unlock unlimited campaigns and AI credits</p>
//               <Button
//                 onClick={() => setShowUpgrade(true)}
//                 className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
//                 size="sm"
//               >
//                 Upgrade Now
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {onToggleCollapse && (
//         <div className="p-3 border-t border-border/50">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onToggleCollapse}
//             className="w-full justify-center hover:bg-muted/50"
//           >
//             {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//           </Button>
//         </div>
//       )}

//       <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} currentTier="FREE" />
//     </>
//   )
// }

// export function DashboardSidebar() {
//   const [collapsed, setCollapsed] = useState(false)

//   return (
//     <aside
//       className={cn(
//         "hidden md:flex flex-col h-screen border-r border-border/50 bg-card/30 backdrop-blur-xl transition-all duration-300 shadow-sm",
//         collapsed ? "w-20" : "w-64",
//       )}
//     >
//       <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
//     </aside>
//   )
// }

// export function MobileSidebar() {
//   const [open, setOpen] = useState(false)

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>
//         <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted/50">
//           <Menu className="h-5 w-5" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="p-0 w-64">
//         <div className="flex flex-col h-full">
//           <SidebarContent onNavigate={() => setOpen(false)} />
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// }


// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import {
//   LayoutDashboard,
//   Mail,
//   Users,
//   FileText,
//   BarChart3,
//   Settings,
//   Sparkles,
//   Zap,
//   CreditCard,
//   GitBranch,
//   Menu,
//   Target,
//   ChevronLeft,
//   ChevronRight,
//   Inbox,
//   Building2,
//   Shield,
// } from "lucide-react"
// import { UpgradeModal } from "@/components/subscription/upgrade-modal"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, tourId: "dashboard" },
//   { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail, tourId: "campaigns" },
//   { name: "CRM", href: "/dashboard/crm", icon: Building2, tourId: "crm" },
//   { name: "Inbox", href: "/dashboard/inbox", icon: Inbox, tourId: "inbox" },
//   { name: "Prospects", href: "/dashboard/prospects", icon: Users, tourId: "prospects" },
//   { name: "Deliverability", href: "/dashboard/deliverability", icon: Shield, tourId: "deliverability" }, // Added Deliverability to navigation
//   { name: "Sequences", href: "/dashboard/sequences", icon: GitBranch, tourId: "sequences" },
//   { name: "Templates", href: "/dashboard/templates", icon: FileText, tourId: "templates" },
//   { name: "AI Generator", href: "/dashboard/generate", icon: Sparkles, tourId: "ai-generator" },
//   { name: "AI Predictor", href: "/dashboard/predict", icon: Target, tourId: "ai-predictor" },
//   { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, tourId: "analytics" },
//   { name: "Integrations", href: "/dashboard/integrations", icon: Zap, tourId: "integrations" },
//   { name: "Settings", href: "/dashboard/settings", icon: Settings, tourId: "settings" },
//   { name: "Billing", href: "/dashboard/billing", icon: CreditCard, tourId: "billing" },
// ]

// interface SidebarContentProps {
//   collapsed?: boolean
//   onToggleCollapse?: () => void
//   onNavigate?: () => void // Added callback for navigation
// }

// function SidebarContent({ collapsed = false, onToggleCollapse, onNavigate }: SidebarContentProps) {
//   const pathname = usePathname()
//   const [showUpgrade, setShowUpgrade] = useState(false)

//   return (
//     <>
//       <div className={cn("p-6 border-b border-border/50 transition-all duration-300", collapsed && "p-4")}>
//         <Link href="/dashboard" className="flex items-center gap-2 group">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 shadow-lg drop-shadow-md group-hover:drop-shadow-2xl transition-all duration-300 group-hover:scale-110">
//             <Sparkles className="h-5 w-5 text-white" />
//           </div>
//           {!collapsed && (
//             <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
//               mailfra
//             </span>
//           )}
//         </Link>
//       </div>

//       <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40">
//         {navigation.map((item) => {
//           const isActive =
//             pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"))
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               data-tour={item.tourId}
//               onClick={onNavigate} // Call onNavigate when link is clicked
//               className={cn(
//                 "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
//                 isActive
//                   ? "bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-cyan-400 shadow-sm"
//                   : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
//                 collapsed && "justify-center px-2",
//               )}
//             >
//               {isActive && (
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-500/5 animate-pulse" />
//               )}
//               <item.icon
//                 className={cn(
//                   "h-5 w-5 transition-all duration-200 relative z-10",
//                   isActive && "scale-110 drop-shadow-md",
//                 )}
//               />
//               {!collapsed && <span className="relative z-10">{item.name}</span>}
//               {isActive && !collapsed && (
//                 <div className="absolute right-2 w-1.5 h-8 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-full drop-shadow-md" />
//               )}
//             </Link>
//           )
//         })}
//       </nav>

//       {!collapsed && (
//         <div className="p-4 border-t border-border/50">
//           <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 p-[2px] shadow-lg drop-shadow-lg hover:drop-shadow-xl transition-all duration-300">
//             <div className="rounded-2xl bg-background p-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <Sparkles className="h-5 w-5 text-blue-500" />
//                 <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//                   Upgrade to Pro
//                 </p>
//               </div>
//               <p className="text-xs text-muted-foreground mb-3">Unlock unlimited campaigns and AI credits</p>
//               <Button
//                 onClick={() => setShowUpgrade(true)}
//                 className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
//                 size="sm"
//               >
//                 Upgrade Now
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {onToggleCollapse && (
//         <div className="p-3 border-t border-border/50">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onToggleCollapse}
//             className="w-full justify-center hover:bg-muted/50"
//           >
//             {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//           </Button>
//         </div>
//       )}

//       <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} currentTier="FREE" />
//     </>
//   )
// }

// export function DashboardSidebar() {
//   const [collapsed, setCollapsed] = useState(false)

//   return (
//     <aside
//       className={cn(
//         "hidden md:flex flex-col h-screen border-r border-border/50 bg-card/30 backdrop-blur-xl transition-all duration-300 shadow-sm",
//         collapsed ? "w-20" : "w-64",
//       )}
//     >
//       <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
//     </aside>
//   )
// }

// export function MobileSidebar() {
//   const [open, setOpen] = useState(false)

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>
//         <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted/50">
//           <Menu className="h-5 w-5" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="p-0 w-64">
//         <div className="flex flex-col h-full">
//           <SidebarContent onNavigate={() => setOpen(false)} />
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// }

// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import {
//   LayoutDashboard,
//   Mail,
//   Users,
//   FileText,
//   BarChart3,
//   Settings,
//   Sparkles,
//   Zap,
//   CreditCard,
//   GitBranch,
//   Menu,
//   Target,
//   ChevronLeft,
//   ChevronRight,
//   Inbox,
//   Building2,
//   Shield,
//   Server,
// } from "lucide-react"
// import { UpgradeModal } from "@/components/subscription/upgrade-modal"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, tourId: "dashboard" },
//   { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail, tourId: "campaigns" },
//   { name: "CRM", href: "/dashboard/crm", icon: Building2, tourId: "crm" },
//   { name: "Inbox", href: "/dashboard/inbox", icon: Inbox, tourId: "inbox" },
//   { name: "Prospects", href: "/dashboard/prospects", icon: Users, tourId: "prospects" },
//   { name: "Deliverability", href: "/dashboard/deliverability", icon: Shield, tourId: "deliverability" },
//   { name: "Email Setup", href: "/dashboard/email-setup", icon: Server, tourId: "email-setup" },
//   { name: "Sequences", href: "/dashboard/sequences", icon: GitBranch, tourId: "sequences" },
//   { name: "Templates", href: "/dashboard/templates", icon: FileText, tourId: "templates" },
//   { name: "AI Generator", href: "/dashboard/generate", icon: Sparkles, tourId: "ai-generator" },
//   { name: "AI Predictor", href: "/dashboard/predict", icon: Target, tourId: "ai-predictor" },
//   { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, tourId: "analytics" },
//   { name: "Integrations", href: "/dashboard/integrations", icon: Zap, tourId: "integrations" },
//   { name: "Settings", href: "/dashboard/settings", icon: Settings, tourId: "settings" },
//   { name: "Billing", href: "/dashboard/billing", icon: CreditCard, tourId: "billing" },
// ]

// interface SidebarContentProps {
//   collapsed?: boolean
//   onToggleCollapse?: () => void
//   onNavigate?: () => void // Added callback for navigation
// }

// function SidebarContent({ collapsed = false, onToggleCollapse, onNavigate }: SidebarContentProps) {
//   const pathname = usePathname()
//   const [showUpgrade, setShowUpgrade] = useState(false)

//   return (
//     <>
//       <div className={cn("p-6 border-b border-border/50 transition-all duration-300", collapsed && "p-4")}>
//         <Link href="/dashboard" className="flex items-center gap-2 group">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 shadow-lg drop-shadow-md group-hover:drop-shadow-2xl transition-all duration-300 group-hover:scale-110">
//             <Sparkles className="h-5 w-5 text-white" />
//           </div>
//           {!collapsed && (
//             <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
//               mailfra
//             </span>
//           )}
//         </Link>
//       </div>

//       <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40">
//         {navigation.map((item) => {
//           const isActive =
//             pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"))
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               data-tour={item.tourId}
//               onClick={onNavigate} // Call onNavigate when link is clicked
//               className={cn(
//                 "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
//                 isActive
//                   ? "bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-cyan-400 shadow-sm"
//                   : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
//                 collapsed && "justify-center px-2",
//               )}
//             >
//               {isActive && (
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-500/5 animate-pulse" />
//               )}
//               <item.icon
//                 className={cn(
//                   "h-5 w-5 transition-all duration-200 relative z-10",
//                   isActive && "scale-110 drop-shadow-md",
//                 )}
//               />
//               {!collapsed && <span className="relative z-10">{item.name}</span>}
//               {isActive && !collapsed && (
//                 <div className="absolute right-2 w-1.5 h-8 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-full drop-shadow-md" />
//               )}
//             </Link>
//           )
//         })}
//       </nav>

//       {!collapsed && (
//         <div className="p-4 border-t border-border/50">
//           <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 p-[2px] shadow-lg drop-shadow-lg hover:drop-shadow-xl transition-all duration-300">
//             <div className="rounded-2xl bg-background p-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <Sparkles className="h-5 w-5 text-blue-500" />
//                 <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//                   Upgrade to Pro
//                 </p>
//               </div>
//               <p className="text-xs text-muted-foreground mb-3">Unlock unlimited campaigns and AI credits</p>
//               <Button
//                 onClick={() => setShowUpgrade(true)}
//                 className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
//                 size="sm"
//               >
//                 Upgrade Now
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {onToggleCollapse && (
//         <div className="p-3 border-t border-border/50">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onToggleCollapse}
//             className="w-full justify-center hover:bg-muted/50"
//           >
//             {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//           </Button>
//         </div>
//       )}

//       <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} currentTier="FREE" />
//     </>
//   )
// }

// export function DashboardSidebar() {
//   const [collapsed, setCollapsed] = useState(false)

//   return (
//     <aside
//       className={cn(
//         "hidden md:flex flex-col h-screen border-r border-border/50 bg-card/30 backdrop-blur-xl transition-all duration-300 shadow-sm",
//         collapsed ? "w-20" : "w-64",
//       )}
//     >
//       <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
//     </aside>
//   )
// }

// export function MobileSidebar() {
//   const [open, setOpen] = useState(false)

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>
//         <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted/50">
//           <Menu className="h-5 w-5" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="p-0 w-64">
//         <div className="flex flex-col h-full">
//           <SidebarContent onNavigate={() => setOpen(false)} />
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// }


// "use client"

// import Link from "next/link"
// import Image from "next/image"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import {
//   LayoutDashboard,
//   Mail,
//   Users,
//   FileText,
//   BarChart3,
//   Settings,
//   Sparkles,
//   Zap,
//   CreditCard,
//   GitBranch,
//   Menu,
//   Target,
//   ChevronLeft,
//   ChevronRight,
//   Inbox,
//   Building2,
//   Shield,
//   Server,
//   Flame,
// } from "lucide-react"
// import { UpgradeModal } from "@/components/subscription/upgrade-modal"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, tourId: "dashboard" },
//   { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail, tourId: "campaigns" },
//   { name: "CRM", href: "/dashboard/crm", icon: Building2, tourId: "crm" },
//   { name: "Inbox", href: "/dashboard/inbox", icon: Inbox, tourId: "inbox" },
//   { name: "Prospects", href: "/dashboard/prospects", icon: Users, tourId: "prospects" },
//   { name: "Warmup", href: "/dashboard/warmup", icon: Flame, tourId: "warmup" },
//   { name: "Deliverability", href: "/dashboard/deliverability", icon: Shield, tourId: "deliverability" },
//   { name: "Email Setup", href: "/dashboard/email-setup", icon: Server, tourId: "email-setup" },
//   { name: "Sequences", href: "/dashboard/sequences", icon: GitBranch, tourId: "sequences" },
//   { name: "Templates", href: "/dashboard/templates", icon: FileText, tourId: "templates" },
//   { name: "AI Generator", href: "/dashboard/generate", icon: Sparkles, tourId: "ai-generator" },
//   { name: "AI Predictor", href: "/dashboard/predict", icon: Target, tourId: "ai-predictor" },
//   { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, tourId: "analytics" },
//   { name: "Integrations", href: "/dashboard/integrations", icon: Zap, tourId: "integrations" },
//   { name: "Settings", href: "/dashboard/settings", icon: Settings, tourId: "settings" },
//   { name: "Billing", href: "/dashboard/billing", icon: CreditCard, tourId: "billing" },
// ]

// interface SidebarContentProps {
//   collapsed?: boolean
//   onToggleCollapse?: () => void
//   onNavigate?: () => void // Added callback for navigation
// }

// function SidebarContent({ collapsed = false, onToggleCollapse, onNavigate }: SidebarContentProps) {
//   const pathname = usePathname()
//   const [showUpgrade, setShowUpgrade] = useState(false)

//   return (
//     <>
//       <div className={cn("p-6 border-b border-border/50 transition-all duration-300", collapsed && "p-4")}>
//         <Link href="/dashboard" className="flex items-center gap-2 group">
//           <div className="relative h-10 w-10 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
//             <Image
//               src="/logo.png"
//               alt="mailfra Logo"
//               width={40}
//               height={40}
//               className="object-contain"
//               priority
//             />
//           </div>
//           {!collapsed && (
//             <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
//               Mailfra
//             </span>
//           )}
//         </Link>
//       </div>

//       <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40">
//         {navigation.map((item) => {
//           const isActive =
//             pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"))
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               data-tour={item.tourId}
//               onClick={onNavigate} 
//               className={cn(
//                 "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
//                 isActive
//                   ? "bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-cyan-400 shadow-sm"
//                   : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
//                 collapsed && "justify-center px-2",
//               )}
//             >
//               {isActive && (
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-500/5 animate-pulse" />
//               )}
//               <item.icon
//                 className={cn(
//                   "h-5 w-5 transition-all duration-200 relative z-10",
//                   isActive && "scale-110 drop-shadow-md",
//                 )}
//               />
//               {!collapsed && <span className="relative z-10">{item.name}</span>}
//               {isActive && !collapsed && (
//                 <div className="absolute right-2 w-1.5 h-8 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-full drop-shadow-md" />
//               )}
//             </Link>
//           )
//         })}
//       </nav>

//       {!collapsed && (
//         <div className="p-4 border-t border-border/50">
//           <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 p-[2px] shadow-lg drop-shadow-lg hover:drop-shadow-xl transition-all duration-300">
//             <div className="rounded-2xl bg-background p-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <Sparkles className="h-5 w-5 text-blue-500" />
//                 <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//                   Upgrade to Pro
//                 </p>
//               </div>
//               <p className="text-xs text-muted-foreground mb-3">Unlock unlimited campaigns and AI credits</p>
//               <Button
//                 onClick={() => setShowUpgrade(true)}
//                 className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
//                 size="sm"
//               >
//                 Upgrade Now
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {onToggleCollapse && (
//         <div className="p-3 border-t border-border/50">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onToggleCollapse}
//             className="w-full justify-center hover:bg-muted/50"
//           >
//             {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//           </Button>
//         </div>
//       )}

//       <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} currentTier="FREE" />
//     </>
//   )
// }

// export function DashboardSidebar() {
//   const [collapsed, setCollapsed] = useState(false)

//   return (
//     <aside
//       className={cn(
//         "hidden md:flex flex-col h-screen border-r border-border/50 bg-card/30 backdrop-blur-xl transition-all duration-300 shadow-sm",
//         collapsed ? "w-20" : "w-64",
//       )}
//     >
//       <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
//     </aside>
//   )
// }

// export function MobileSidebar() {
//   const [open, setOpen] = useState(false)

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>
//         <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted/50">
//           <Menu className="h-5 w-5" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="p-0 w-64">
//         <div className="flex flex-col h-full">
//           <SidebarContent onNavigate={() => setOpen(false)} />
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// }



// "use client"

// import type React from "react"


// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// // import Link from "next/link"
// import Image from "next/image"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import {
//   LayoutDashboard,
//   Mail,
//   Users,
//   FileText,
//   BarChart3,
//   Settings,
//   Sparkles,
//   Zap,
//   CreditCard,
//   GitBranch,
//   Menu,
//   Target,
//   ChevronLeft,
//   ChevronRight,
//   Inbox,
//   Building2,
//   Shield,
//   Server,
//   Flame,
//   ChevronDown,
//   Plus,
//   List,
//   PieChart,
//   Send,
//   Brain,
//   Wand2,
// } from "lucide-react"
// import { UpgradeModal } from "@/components/subscription/upgrade-modal"

// interface NavItem {
//   name: string
//   href: string
//   icon: React.ElementType
//   tourId?: string
// }

// interface NavGroup {
//   name: string
//   icon: React.ElementType
//   items: NavItem[]
//   defaultOpen?: boolean
// }

// // Single items (no submenus)
// const singleItems: NavItem[] = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, tourId: "dashboard" },
//   { name: "Inbox", href: "/dashboard/inbox", icon: Inbox, tourId: "inbox" },
// ]

// // Grouped items with submenus
// const navGroups: NavGroup[] = [
//   {
//     name: "Campaigns",
//     icon: Mail,
//     defaultOpen: true,
//     items: [
//       { name: "All Campaigns", href: "/dashboard/campaigns", icon: List, tourId: "campaigns" },
//       { name: "Create New", href: "/dashboard/campaigns/new", icon: Plus },
//       { name: "Analytics", href: "/dashboard/analytics", icon: PieChart, tourId: "analytics" },
//     ],
//   },
//   {
//     name: "Outreach",
//     icon: Send,
//     items: [
//       { name: "Prospects", href: "/dashboard/prospects", icon: Users, tourId: "prospects" },
//       { name: "CRM", href: "/dashboard/crm", icon: Building2, tourId: "crm" },
//       { name: "Sequences", href: "/dashboard/sequences", icon: GitBranch, tourId: "sequences" },
//       { name: "Templates", href: "/dashboard/templates", icon: FileText, tourId: "templates" },
//     ],
//   },
//   {
//     name: "Deliverability",
//     icon: Shield,
//     items: [
//       { name: "Overview", href: "/dashboard/deliverability", icon: BarChart3, tourId: "deliverability" },
//       { name: "Email Warmup", href: "/dashboard/warmup", icon: Flame, tourId: "warmup" },
//       { name: "Email Setup", href: "/dashboard/email-setup", icon: Server, tourId: "email-setup" },
//     ],
//   },
//   {
//     name: "AI Tools",
//     icon: Brain,
//     items: [
//       { name: "AI Generator", href: "/dashboard/generate", icon: Sparkles, tourId: "ai-generator" },
//       { name: "AI Predictor", href: "/dashboard/predict", icon: Target, tourId: "ai-predictor" },
//     ],
//   },
// ]







// // Bottom items
// const bottomItems: NavItem[] = [
//   { name: "Integrations", href: "/dashboard/integrations", icon: Zap, tourId: "integrations" },
//   { name: "Settings", href: "/dashboard/settings", icon: Settings, tourId: "settings" },
//   { name: "Billing", href: "/dashboard/billing", icon: CreditCard, tourId: "billing" },
// ]

// interface SidebarContentProps {
//   collapsed?: boolean
//   onToggleCollapse?: () => void
//   onNavigate?: () => void
// }

// function NavGroupComponent({
//   group,
//   collapsed,
//   pathname,
//   onNavigate,
//   expandedGroups,
//   toggleGroup,
// }: {
//   group: NavGroup
//   collapsed: boolean
//   pathname: string
//   onNavigate?: () => void
//   expandedGroups: Record<string, boolean>
//   toggleGroup: (name: string) => void
// }) {
//   const isExpanded = expandedGroups[group.name] ?? group.defaultOpen ?? false
//   const hasActiveItem = group.items.some((item) => pathname === item.href || pathname?.startsWith(item.href + "/"))

//   if (collapsed) {
//     // In collapsed mode, show first item's icon as group representative
//     const firstItem = group.items[0]
//     return (
//       <Link
//         href={firstItem.href}
//         onClick={onNavigate}
//         className={cn(
//           "flex items-center justify-center p-3 rounded-lg transition-all duration-200",
//           hasActiveItem ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
//         )}
//         title={group.name}
//       >
//         <group.icon className="h-5 w-5" />
//       </Link>
//     )
//   }

//   return (
//     <div className="space-y-1">
//       {/* Group header - clickable to expand/collapse */}
//       <button
//         onClick={() => toggleGroup(group.name)}
//         className={cn(
//           "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
//           hasActiveItem ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
//         )}
//       >
//         <div className="flex items-center gap-3">
//           <group.icon className={cn("h-4 w-4", hasActiveItem && "text-primary")} />
//           <span>{group.name}</span>
//         </div>
//         <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-180")} />
//       </button>

//       {/* Expandable submenu with smooth animation */}
//       <div
//         className={cn(
//           "overflow-hidden transition-all duration-200 ease-in-out",
//           isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
//         )}
//       >
//         <div className="ml-4 pl-3 border-l border-border/50 space-y-1 py-1">
//           {group.items.map((item) => {
//             const isActive =
//               pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"))

//             return (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 data-tour={item.tourId}
//                 onClick={onNavigate}
//                 className={cn(
//                   "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
//                   isActive
//                     ? "bg-primary/10 text-primary font-medium"
//                     : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
//                 )}
//               >
//                 <item.icon className="h-4 w-4" />
//                 <span>{item.name}</span>
//                 {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
//               </Link>
//             )
//           })}
//         </div>
//       </div>
//     </div>
//   )
// }

// function SidebarContent({ collapsed = false, onToggleCollapse, onNavigate }: SidebarContentProps) {
//   const pathname = usePathname()
//   const [showUpgrade, setShowUpgrade] = useState(false)

//   const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
//     const initial: Record<string, boolean> = {}
//     navGroups.forEach((group) => {
//       const hasActiveItem = group.items.some((item) => pathname === item.href || pathname?.startsWith(item.href + "/"))
//       initial[group.name] = hasActiveItem || (group.defaultOpen ?? false)
//     })
//     return initial
//   })

//   // Auto-expand group when navigating to a page within it
//   useEffect(() => {
//     navGroups.forEach((group) => {
//       const hasActiveItem = group.items.some((item) => pathname === item.href || pathname?.startsWith(item.href + "/"))
//       if (hasActiveItem) {
//         setExpandedGroups((prev) => ({ ...prev, [group.name]: true }))
//       }
//     })
//   }, [pathname])

//   const toggleGroup = (name: string) => {
//     setExpandedGroups((prev) => ({ ...prev, [name]: !prev[name] }))
//   }

//   return (
//     <>
//       {/* Logo */}
//       <div className={cn("p-6 border-b border-border/50 transition-all duration-300", collapsed && "p-4")}>
//          <Link href="/dashboard" className="flex items-center gap-2 group">
//            <div className="relative h-10 w-10 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
//              <Image
//                src="/logo.png"
//                alt="mailfra Logo"
//                width={40}
//                height={40}
//                className="object-contain"
//                priority
//              />
//            </div>
//            {!collapsed && (
//              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
//                Mailfra
//              </span>
//            )}
//          </Link>
//        </div>

      
//       {/* <div className={cn("p-4 border-b border-border/50 transition-all duration-300", collapsed && "p-3")}>
//         <Link href="/dashboard" className="flex items-center gap-2.5 group">
//           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm group-hover:shadow-md transition-all duration-200">
//             <Sparkles className="h-5 w-5 text-primary-foreground" />
//           </div>
//           {!collapsed && <span className="text-lg font-semibold tracking-tight">ReachAI</span>}
//         </Link>
//       </div> */}

//       {/* Navigation */}
//       <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
//         {/* Single items at top */}
//         {singleItems.map((item) => {
//           const isActive = pathname === item.href
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               data-tour={item.tourId}
//               onClick={onNavigate}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
//                 isActive
//                   ? "bg-primary/10 text-primary"
//                   : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
//                 collapsed && "justify-center px-2",
//               )}
//             >
//               <item.icon className="h-5 w-5" />
//               {!collapsed && <span>{item.name}</span>}
//               {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
//             </Link>
//           )
//         })}

//         {/* Separator */}
//         {!collapsed && (
//           <div className="py-2">
//             <div className="h-px bg-border/50" />
//           </div>
//         )}

//         {/* Grouped navigation */}
//         {navGroups.map((group) => (
//           <NavGroupComponent
//             key={group.name}
//             group={group}
//             collapsed={collapsed}
//             pathname={pathname}
//             onNavigate={onNavigate}
//             expandedGroups={expandedGroups}
//             toggleGroup={toggleGroup}
//           />
//         ))}

//         {/* Separator */}
//         {!collapsed && (
//           <div className="py-2">
//             <div className="h-px bg-border/50" />
//           </div>
//         )}

//         {/* Bottom items */}
//         {bottomItems.map((item) => {
//           const isActive =
//             pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"))
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               data-tour={item.tourId}
//               onClick={onNavigate}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
//                 isActive
//                   ? "bg-primary/10 text-primary"
//                   : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
//                 collapsed && "justify-center px-2",
//               )}
//             >
//               <item.icon className="h-5 w-5" />
//               {!collapsed && <span>{item.name}</span>}
//               {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
//             </Link>
//           )
//         })}
//       </nav>

//       {/* Upgrade card */}
//       {!collapsed && (
//         <div className="p-3 border-t border-border/50">
//           <div className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4">
//             <div className="flex items-center gap-2 mb-2">
//               <Wand2 className="h-4 w-4 text-primary" />
//               <p className="text-sm font-semibold">Upgrade to Pro</p>
//             </div>
//             <p className="text-xs text-muted-foreground mb-3">Unlock unlimited campaigns and AI credits</p>
//             <Button onClick={() => setShowUpgrade(true)} className="w-full" size="sm">
//               Upgrade Now
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Collapse toggle */}
//       {onToggleCollapse && (
//         <div className="p-3 border-t border-border/50">
//           <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="w-full justify-center">
//             {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//           </Button>
//         </div>
//       )}

//       <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} currentTier="FREE" />
//     </>
//   )
// }

// export function DashboardSidebar() {
//   const [collapsed, setCollapsed] = useState(false)

//   return (
//     <aside
//       className={cn(
//         "hidden md:flex flex-col h-screen border-r border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300",
//         collapsed ? "w-[70px]" : "w-64",
//       )}
//     >
//       <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
//     </aside>
//   )
// }

// export function MobileSidebar() {
//   const [open, setOpen] = useState(false)

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>
//         <Button variant="ghost" size="icon" className="md:hidden">
//           <Menu className="h-5 w-5" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="p-0 w-64">
//         <div className="flex flex-col h-full">
//           <SidebarContent onNavigate={() => setOpen(false)} />
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// }


"use client"

import type React from "react"


import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Mail,
  Users,
  FileText,
  BarChart3,
  Settings,
  Sparkles,
  Zap,
  CreditCard,
  GitBranch,
  Menu,
  Target,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Building2,
  Shield,
  Server,
  Flame,
  ChevronDown,
  Plus,
  List,
  PieChart,
  Send,
  Brain,
  Wand2,
} from "lucide-react"
import { UpgradeModal } from "@/components/subscription/upgrade-modal"

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  tourId?: string
}

interface NavGroup {
  name: string
  icon: React.ElementType
  items: NavItem[]
  defaultOpen?: boolean
}

// Single items (no submenus)
const singleItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, tourId: "dashboard" },
  { name: "Inbox", href: "/dashboard/inbox", icon: Inbox, tourId: "inbox" },
]

// Grouped items with submenus
const navGroups: NavGroup[] = [
  {
    name: "Campaigns",
    icon: Mail,
    defaultOpen: true,
    items: [
      { name: "All Campaigns", href: "/dashboard/campaigns", icon: List, tourId: "campaigns" },
      { name: "Create New", href: "/dashboard/campaigns/new", icon: Plus },
      { name: "Analytics", href: "/dashboard/analytics", icon: PieChart, tourId: "analytics" },
    ],
  },
  {
    name: "Outreach",
    icon: Send,
    items: [
      { name: "Prospects", href: "/dashboard/prospects", icon: Users, tourId: "prospects" },
      { name: "CRM", href: "/dashboard/crm", icon: Building2, tourId: "crm" },
      { name: "Sequences", href: "/dashboard/sequences", icon: GitBranch, tourId: "sequences" },
      { name: "Templates", href: "/dashboard/templates", icon: FileText, tourId: "templates" },
    ],
  },
  {
    name: "Deliverability",
    icon: Shield,
    items: [
      { name: "Overview", href: "/dashboard/deliverability", icon: BarChart3, tourId: "deliverability" },
      { name: "Email Warmup", href: "/dashboard/warmup", icon: Flame, tourId: "warmup" },
      { name: "Email Setup", href: "/dashboard/email-setup", icon: Server, tourId: "email-setup" },
    ],
  },
  {
    name: "AI Tools",
    icon: Brain,
    items: [
      { name: "AI Generator", href: "/dashboard/generate", icon: Sparkles, tourId: "ai-generator" },
      { name: "AI Predictor", href: "/dashboard/predict", icon: Target, tourId: "ai-predictor" },
    ],
  },
]

// Bottom items
const bottomItems: NavItem[] = [
  { name: "Integrations", href: "/dashboard/integrations", icon: Zap, tourId: "integrations" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, tourId: "settings" },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard, tourId: "billing" },
]

interface SidebarContentProps {
  collapsed?: boolean
  onToggleCollapse?: () => void
  onNavigate?: () => void
}

function NavGroupComponent({
  group,
  collapsed,
  pathname,
  onNavigate,
  expandedGroups,
  toggleGroup,
}: {
  group: NavGroup
  collapsed: boolean
  pathname: string
  onNavigate?: () => void
  expandedGroups: Record<string, boolean>
  toggleGroup: (name: string) => void
}) {
  const isExpanded = expandedGroups[group.name] ?? group.defaultOpen ?? false
  const hasActiveItem = group.items.some((item) => pathname === item.href || pathname?.startsWith(item.href + "/"))

  if (collapsed) {
    // In collapsed mode, show first item's icon as group representative
    const firstItem = group.items[0]
    return (
      <Link
        href={firstItem.href}
        onClick={onNavigate}
        className={cn(
          "flex items-center justify-center p-3 rounded-lg transition-all duration-200",
          hasActiveItem ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
        title={group.name}
      >
        <group.icon className="h-5 w-5" />
      </Link>
    )
  }

  return (
    <div className="space-y-1">
      {/* Group header - clickable to expand/collapse */}
      <button
        onClick={() => toggleGroup(group.name)}
        data-tour-group={group.name.toLowerCase()}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          hasActiveItem ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        )}
      >
        <div className="flex items-center gap-3">
          <group.icon className={cn("h-4 w-4", hasActiveItem && "text-primary")} />
          <span>{group.name}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-180")} />
      </button>

      {/* Expandable submenu with smooth animation */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="ml-4 pl-3 border-l border-border/50 space-y-1 py-1">
          {group.items.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"))

            return (
              <Link
                key={item.name}
                href={item.href}
                data-tour={item.tourId}
                data-tour-parent={group.name.toLowerCase()}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function SidebarContent({ collapsed = false, onToggleCollapse, onNavigate }: SidebarContentProps) {
  const pathname = usePathname()
  const [showUpgrade, setShowUpgrade] = useState(false)

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    navGroups.forEach((group) => {
      const hasActiveItem = group.items.some((item) => pathname === item.href || pathname?.startsWith(item.href + "/"))
      initial[group.name] = hasActiveItem || (group.defaultOpen ?? false)
    })
    return initial
  })

  // Auto-expand group when navigating to a page within it
  useEffect(() => {
    navGroups.forEach((group) => {
      const hasActiveItem = group.items.some((item) => pathname === item.href || pathname?.startsWith(item.href + "/"))
      if (hasActiveItem) {
        setExpandedGroups((prev) => ({ ...prev, [group.name]: true }))
      }
    })
  }, [pathname])

  const toggleGroup = (name: string) => {
    setExpandedGroups((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <>
      {/* Logo */}
      <div className={cn("p-6 border-b border-border/50 transition-all duration-300", collapsed && "p-4")}>
         <Link href="/dashboard" className="flex items-center gap-2 group">
           <div className="relative h-10 w-10 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
             <Image
               src="/mailfra-apple-icon.png"
               alt="mailfra Logo"
               width={40}
               height={40}
               className="object-contain"
               priority
             />
           </div>
           {!collapsed && (
             <span className="text-xl font-bold bg-white bg-clip-text text-transparent">
               Mailfra
             </span>
           )}
         </Link>
       </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* Single items at top */}
        {singleItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              data-tour={item.tourId}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.name}</span>}
              {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </Link>
          )
        })}

        {/* Separator */}
        {!collapsed && (
          <div className="py-2">
            <div className="h-px bg-border/50" />
          </div>
        )}

        {/* Grouped navigation */}
        {navGroups.map((group) => (
          <NavGroupComponent
            key={group.name}
            group={group}
            collapsed={collapsed}
            pathname={pathname}
            onNavigate={onNavigate}
            expandedGroups={expandedGroups}
            toggleGroup={toggleGroup}
          />
        ))}

        {/* Separator */}
        {!collapsed && (
          <div className="py-2">
            <div className="h-px bg-border/50" />
          </div>
        )}

        {/* Bottom items */}
        {bottomItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"))
          return (
            <Link
              key={item.name}
              href={item.href}
              data-tour={item.tourId}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.name}</span>}
              {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </Link>
          )
        })}
      </nav>

      {/* Upgrade card */}
      {!collapsed && (
        <div className="p-3 border-t border-border/50">
          <div className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wand2 className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">Upgrade to Pro</p>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Unlock unlimited campaigns and AI credits</p>
            <Button onClick={() => setShowUpgrade(true)} className="w-full" size="sm">
              Upgrade Now
            </Button>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      {onToggleCollapse && (
        <div className="p-3 border-t border-border/50">
          <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="w-full justify-center">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      )}

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} currentTier="FREE" />
    </>
  )
}

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen border-r border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300",
        collapsed ? "w-[70px]" : "w-64",
      )}
    >
      <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
    </aside>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <div className="flex flex-col h-full">
          <SidebarContent onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
