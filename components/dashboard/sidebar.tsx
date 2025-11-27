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
  ChevronDown,
  ChevronRight,
  Zap,
  Target,
  ListOrdered,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface NavItem {
  title: string
  href?: string
  icon: React.ReactNode
  children?: { title: string; href: string; icon?: React.ReactNode }[]
}

const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Campaigns",
    icon: <Send className="h-4 w-4" />,
    children: [
      { title: "All Campaigns", href: "/dashboard/campaigns", icon: <ListOrdered className="h-4 w-4" /> },
      { title: "Create New", href: "/dashboard/campaigns/new", icon: <Sparkles className="h-4 w-4" /> },
      { title: "Analytics", href: "/dashboard/analytics", icon: <BarChart3 className="h-4 w-4" /> },
    ],
  },
  {
    title: "Outreach",
    icon: <Target className="h-4 w-4" />,
    children: [
      { title: "Sequences", href: "/dashboard/sequences", icon: <Zap className="h-4 w-4" /> },
      { title: "Templates", href: "/dashboard/templates", icon: <FileText className="h-4 w-4" /> },
      { title: "Prospects", href: "/dashboard/prospects", icon: <Users className="h-4 w-4" /> },
    ],
  },
  {
    title: "Inbox",
    href: "/dashboard/inbox",
    icon: <Inbox className="h-4 w-4" />,
  },
  {
    title: "Deliverability",
    icon: <Shield className="h-4 w-4" />,
    children: [
      { title: "Overview", href: "/dashboard/deliverability", icon: <BarChart3 className="h-4 w-4" /> },
      { title: "Email Setup", href: "/dashboard/email-setup", icon: <Mail className="h-4 w-4" /> },
      { title: "Warmup", href: "/dashboard/warmup", icon: <Flame className="h-4 w-4" /> },
    ],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-4 w-4" />,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>([])

  useEffect(() => {
    const sectionsToOpen: string[] = []
    navigation.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some(
          (child) => pathname === child.href || pathname.startsWith(child.href + "/"),
        )
        if (isChildActive) {
          sectionsToOpen.push(item.title)
        }
      }
    })
    setOpenSections(sectionsToOpen)
  }, [pathname])

  const toggleSection = (title: string) => {
    setOpenSections((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Mail className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">MailFra</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navigation.map((item) =>
          item.children ? (
            <Collapsible
              key={item.title}
              open={openSections.includes(item.title)}
              onOpenChange={() => toggleSection(item.title)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between font-normal",
                    item.children.some((child) => isActive(child.href)) && "bg-accent",
                  )}
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                    {item.title}
                  </span>
                  {openSections.includes(item.title) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 mt-1 space-y-1 border-l pl-4">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive(child.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {child.icon}
                    {child.title}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href!)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ),
        )}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="font-medium text-sm">Warmup Status</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Keep your emails out of spam by warming up your accounts</p>
          <Button size="sm" variant="outline" className="w-full bg-transparent" asChild>
            <Link href="/dashboard/warmup">View Warmup</Link>
          </Button>
        </div>
      </div>
    </aside>
  )
}
