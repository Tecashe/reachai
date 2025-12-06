"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  Mail,
  Send,
  Users,
  FileText,
  Inbox,
  BarChart3,
  Settings,
  Flame,
  Shield,
  ChevronRight,
  Zap,
  Target,
  ListOrdered,
  Plus,
  TrendingUp,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface NavChild {
  title: string
  href: string
  icon?: React.ReactNode
  badge?: string
}

interface NavItem {
  title: string
  href?: string
  icon: React.ReactNode
  children?: NavChild[]
  badge?: string
}

const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-[18px] w-[18px]" />,
  },
  {
    title: "Campaigns",
    icon: <Send className="h-[18px] w-[18px]" />,
    children: [
      { title: "All Campaigns", href: "/dashboard/campaigns", icon: <ListOrdered className="h-4 w-4" /> },
      { title: "Create New", href: "/dashboard/campaigns/new", icon: <Plus className="h-4 w-4" /> },
      { title: "Analytics", href: "/dashboard/analytics", icon: <BarChart3 className="h-4 w-4" /> },
    ],
  },
  {
    title: "Outreach",
    icon: <Target className="h-[18px] w-[18px]" />,
    children: [
      { title: "Sequences", href: "/dashboard/sequences", icon: <Zap className="h-4 w-4" /> },
      { title: "Templates", href: "/dashboard/templates", icon: <FileText className="h-4 w-4" /> },
      { title: "Prospects", href: "/dashboard/prospects", icon: <Users className="h-4 w-4" /> },
    ],
  },
  {
    title: "Inbox",
    href: "/dashboard/inbox",
    icon: <Inbox className="h-[18px] w-[18px]" />,
  },
  {
    title: "Deliverability",
    icon: <Shield className="h-[18px] w-[18px]" />,
    children: [
      { title: "Health Overview", href: "/dashboard/deliverability", icon: <TrendingUp className="h-4 w-4" /> },
      { title: "Email Setup", href: "/dashboard/email-setup", icon: <Mail className="h-4 w-4" /> },
      { title: "Warmup", href: "/dashboard/warmup", icon: <Flame className="h-4 w-4" /> },
    ],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-[18px] w-[18px]" />,
  },
]

// Modern animated nav item with expandable submenu
function NavItemComponent({
  item,
  isActive,
  isOpen,
  onToggle,
}: {
  item: NavItem
  isActive: (href: string) => boolean
  isOpen: boolean
  onToggle: () => void
}) {
  const hasChildren = item.children && item.children.length > 0
  const isChildActive = hasChildren && item.children!.some((child) => isActive(child.href))
  const isCurrentActive = item.href ? isActive(item.href) : false

  if (!hasChildren) {
    return (
      <Link
        href={item.href!}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
          isCurrentActive
            ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
        )}
      >
        <span
          className={cn(
            "flex items-center justify-center transition-transform duration-200",
            isCurrentActive ? "scale-110" : "group-hover:scale-110",
          )}
        >
          {item.icon}
        </span>
        <span>{item.title}</span>

        {/* Active indicator line */}
        {isCurrentActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground rounded-r-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </Link>
    )
  }

  return (
    <div className="space-y-1">
      <button
        onClick={onToggle}
        className={cn(
          "group relative flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
          isChildActive
            ? "bg-accent/80 text-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
        )}
      >
        <span className="flex items-center gap-3">
          <span
            className={cn(
              "flex items-center justify-center transition-transform duration-200",
              isChildActive ? "scale-110 text-primary" : "group-hover:scale-110",
            )}
          >
            {item.icon}
          </span>
          <span>{item.title}</span>
        </span>

        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          <ChevronRight className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="relative ml-3 pl-3 py-1 space-y-0.5">
              {/* Vertical connecting line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

              {item.children!.map((child, index) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                    isActive(child.href)
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {/* Horizontal connecting line */}
                  <div
                    className={cn(
                      "absolute left-[-12px] top-1/2 w-3 h-px transition-colors",
                      isActive(child.href) ? "bg-primary" : "bg-border",
                    )}
                  />

                  {child.icon && (
                    <span
                      className={cn(
                        "flex items-center justify-center opacity-70 transition-all duration-200",
                        isActive(child.href) ? "opacity-100" : "group-hover:opacity-100",
                      )}
                    >
                      {child.icon}
                    </span>
                  )}
                  <span>{child.title}</span>

                  {child.badge && (
                    <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                      {child.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>([])

  // Auto-expand sections based on current path
  useEffect(() => {
    const sectionsToOpen: string[] = []
    navigation.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some(
          (child) => pathname === child.href || pathname.startsWith(child.href + "/"),
        )
        if (isChildActive && !sectionsToOpen.includes(item.title)) {
          sectionsToOpen.push(item.title)
        }
      }
    })
    setOpenSections((prev) => {
      const newSections = [...new Set([...prev, ...sectionsToOpen])]
      return newSections
    })
  }, [pathname])

  const toggleSection = (title: string) => {
    setOpenSections((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card/50 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-5">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 transition-transform duration-200 group-hover:scale-105">
            <Mail className="h-4.5 w-4.5 text-primary-foreground" />
            <div className="absolute inset-0 rounded-xl bg-white/10" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">MailFra</span>
            <span className="text-[10px] text-muted-foreground font-medium -mt-0.5">Cold Email Platform</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-1">
        <div className="mb-2 px-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Main Menu</span>
        </div>

        {navigation.slice(0, 4).map((item) => (
          <NavItemComponent
            key={item.title}
            item={item}
            isActive={isActive}
            isOpen={openSections.includes(item.title)}
            onToggle={() => toggleSection(item.title)}
          />
        ))}

        <div className="pt-4 pb-2 px-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
            Email Health
          </span>
        </div>

        {navigation.slice(4, 5).map((item) => (
          <NavItemComponent
            key={item.title}
            item={item}
            isActive={isActive}
            isOpen={openSections.includes(item.title)}
            onToggle={() => toggleSection(item.title)}
          />
        ))}

        <div className="pt-4 pb-2 px-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Account</span>
        </div>

        {navigation.slice(5).map((item) => (
          <NavItemComponent
            key={item.title}
            item={item}
            isActive={isActive}
            isOpen={openSections.includes(item.title)}
            onToggle={() => toggleSection(item.title)}
          />
        ))}
      </nav>

      {/* Footer Card */}
      <div className="p-3">
        <div className="rounded-xl bg-gradient-to-br from-orange-500/10 via-amber-500/10 to-yellow-500/10 border border-orange-500/20 p-4">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-sm">
              <Flame className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="font-semibold text-sm">Warmup Active</span>
              <p className="text-[10px] text-muted-foreground">3 accounts warming</p>
            </div>
          </div>
          <div className="h-1.5 bg-orange-500/20 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "65%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <Link
            href="/dashboard/warmup"
            className="flex items-center justify-center gap-1.5 text-xs font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
          >
            View Details
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
