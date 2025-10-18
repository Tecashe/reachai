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
//           <span className="text-xl font-bold">ReachAI</span>
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
//             ReachAI
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

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
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
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, tourId: "dashboard" },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail, tourId: "campaigns" },
  { name: "Prospects", href: "/dashboard/prospects", icon: Users, tourId: "prospects" },
  { name: "Sequences", href: "/dashboard/sequences", icon: GitBranch, tourId: "sequences" },
  { name: "Templates", href: "/dashboard/templates", icon: FileText, tourId: "templates" },
  { name: "AI Generator", href: "/dashboard/generate", icon: Sparkles, tourId: "ai-generator" },
  { name: "AI Predictor", href: "/dashboard/predict", icon: Target, tourId: "ai-predictor" },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, tourId: "analytics" },
  { name: "Integrations", href: "/dashboard/integrations", icon: Zap, tourId: "integrations" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, tourId: "settings" },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard, tourId: "billing" },
]

function SidebarContent() {
  const pathname = usePathname()

  return (
    <>
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg group-hover:shadow-glow transition-all duration-300">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            ReachAI
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              data-tour={item.tourId}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-sm",
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg opacity-10" />
              )}
              <item.icon className={cn("h-5 w-5 transition-transform duration-200", isActive && "scale-110")} />
              <span className="relative">{item.name}</span>
              {isActive && <div className="absolute right-2 w-1 h-6 bg-primary-foreground/30 rounded-full" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 p-4 text-white shadow-lg hover:shadow-glow-lg transition-all duration-300">
          <p className="text-sm font-semibold mb-1">Upgrade to Pro</p>
          <p className="text-xs text-blue-100 mb-3">Unlock unlimited campaigns and AI credits</p>
          <Link
            href="/dashboard/billing"
            className="block w-full text-center bg-white text-blue-600 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </>
  )
}

export function DashboardSidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-sm">
      <SidebarContent />
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
          <SidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  )
}
