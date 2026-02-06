"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
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
  User,
  Bell,
  Key,
  UsersRound,
  Globe,
  Search,
  Cpu,
  MailCheck,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react"
import { UpgradeModal } from "@/components/subscription/upgrade-modal"
import { motion, AnimatePresence } from "framer-motion"

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  tourId?: string
  badge?: string
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
  {
    name: "Automations",
    icon: Zap,
    items: [
      { name: "All Automations", href: "/dashboard/automations", icon: List, tourId: "automations" },
      { name: "Create New", href: "/dashboard/automations/new", icon: Plus },
    ],
  },
]

// Bottom items (excluding Settings which gets special handling)
const bottomItems: NavItem[] = [
  { name: "Integrations", href: "/dashboard/integrations", icon: Zap, tourId: "integrations" },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard, tourId: "billing" },
]

// Settings sub-navigation items
const settingsNavItems: NavItem[] = [
  { name: "Profile", href: "/dashboard/settings/profile", icon: User },
  { name: "Email", href: "/dashboard/settings/email", icon: Mail },
  { name: "Email Accounts", href: "/dashboard/settings/email-accounts", icon: MailCheck },
  { name: "Research", href: "/dashboard/settings/research", icon: Search },
  { name: "AI Models", href: "/dashboard/settings/ai-models", icon: Cpu },
  { name: "Domains", href: "/dashboard/settings/domains", icon: Globe },
  { name: "Sending Accounts", href: "/dashboard/settings/sending", icon: Send },
  { name: "Deliverability", href: "/dashboard/settings/deliverability", icon: ShieldCheck },
  { name: "Compliance", href: "/dashboard/settings/compliance", icon: Shield },
  { name: "Notifications", href: "/dashboard/settings/notifications", icon: Bell },
  { name: "API Keys", href: "/dashboard/settings/api-keys", icon: Key, badge: "NEW" },
  { name: "Team", href: "/dashboard/settings/team", icon: UsersRound },
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

// Settings sidebar view component
function SettingsSidebarContent({
  collapsed,
  pathname,
  onNavigate,
  onBack,
}: {
  collapsed: boolean
  pathname: string
  onNavigate?: () => void
  onBack: () => void
}) {
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 py-2">
        <button
          onClick={onBack}
          className="flex items-center justify-center p-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
          title="Back to main menu"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="h-px w-8 bg-border/50 my-1" />
        {settingsNavItems.slice(0, 8).map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center justify-center p-3 rounded-lg transition-all duration-200",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              title={item.name}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Settings Header with back button */}
      <div className="p-4 border-b border-border/50">
        <button
          onClick={onBack}
          className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group w-full"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-base font-semibold text-foreground">Settings</span>
        </button>
      </div>

      {/* Settings Navigation Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {settingsNavItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary/20 text-primary rounded">
                  {item.badge}
                </span>
              )}
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

function SidebarContent({ collapsed = false, onToggleCollapse, onNavigate }: SidebarContentProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [sidebarView, setSidebarView] = useState<'main' | 'settings'>('main')

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    navGroups.forEach((group) => {
      const hasActiveItem = group.items.some((item) => pathname === item.href || pathname?.startsWith(item.href + "/"))
      initial[group.name] = hasActiveItem || (group.defaultOpen ?? false)
    })
    return initial
  })

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-switch to settings view when on settings pages
  useEffect(() => {
    if (pathname?.startsWith('/dashboard/settings')) {
      setSidebarView('settings')
    } else {
      setSidebarView('main')
    }
  }, [pathname])

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

  const handleSettingsClick = () => {
    setSidebarView('settings')
    router.push('/dashboard/settings/profile')
  }

  const handleBackToMain = () => {
    setSidebarView('main')
    router.push('/dashboard')
  }

  // Determine which logo to show
  const logoSrc = mounted && resolvedTheme === 'dark'
    ? '/mailfra-logo-dark.png'
    : '/mailfra-logo-light.png'

  // Animation variants for sidebar transitions
  const slideVariants = {
    enterFromRight: {
      x: 20,
      opacity: 0,
    },
    enterFromLeft: {
      x: -20,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exitToLeft: {
      x: -20,
      opacity: 0,
    },
    exitToRight: {
      x: 20,
      opacity: 0,
    },
  }

  return (
    <>
      {/* Logo */}
      <div className={cn("p-6 border-b border-border/50 transition-all duration-300", collapsed && "p-4")}>
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="relative h-10 w-10 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
            <Image
              src={logoSrc}
              alt="Mailfra Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Mailfra
            </span>
          )}
        </Link>
      </div>

      {/* Animated sidebar content */}
      <AnimatePresence mode="wait">
        {sidebarView === 'settings' ? (
          <motion.div
            key="settings"
            initial="enterFromRight"
            animate="center"
            exit="exitToRight"
            variants={slideVariants}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <SettingsSidebarContent
              collapsed={collapsed}
              pathname={pathname}
              onNavigate={onNavigate}
              onBack={handleBackToMain}
            />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial="enterFromLeft"
            animate="center"
            exit="exitToLeft"
            variants={slideVariants}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Main Navigation */}
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

              {/* Settings button - special handling */}
              <button
                onClick={handleSettingsClick}
                data-tour="settings"
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  pathname?.startsWith('/dashboard/settings')
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  collapsed && "justify-center px-2",
                )}
              >
                <Settings className="h-5 w-5" />
                {!collapsed && (
                  <>
                    <span>Settings</span>
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </>
                )}
              </button>
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
          </motion.div>
        )}
      </AnimatePresence>

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
