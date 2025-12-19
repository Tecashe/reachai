
"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
  Plus,
  Search,
  Target,
  Building2,
  Inbox,
  Shield,
  Server,
  Flame,
  Clock,
} from "lucide-react"
import { ArrowRight } from "lucide-react"

const commands = [
  {
    group: "Navigation",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, keywords: ["home", "overview"] },
      { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail, keywords: ["email", "outreach"] },
      {
        name: "CRM",
        href: "/dashboard/crm",
        icon: Building2,
        keywords: ["crm", "contacts", "leads", "hubspot", "salesforce"],
      },
      { name: "Inbox", href: "/dashboard/inbox", icon: Inbox, keywords: ["inbox", "messages", "replies"] },
      {
        name: "Warmup",
        href: "/dashboard/warmup",
        icon: Flame,
        keywords: ["warmup", "email warmup", "domain reputation", "inbox placement"],
      },
      {
        name: "Deliverability",
        href: "/dashboard/deliverability",
        icon: Shield,
        keywords: ["deliverability", "health", "dns", "domains", "blacklist"],
      },
      {
        name: "Email Setup",
        href: "/dashboard/email-setup",
        icon: Server,
        keywords: ["email setup", "dns", "spf", "dkim", "dmarc", "domain configuration"],
      },
      { name: "Prospects", href: "/dashboard/prospects", icon: Users, keywords: ["contacts", "leads"] },
      { name: "Sequences", href: "/dashboard/sequences", icon: GitBranch, keywords: ["automation", "workflow"] },
      { name: "Templates", href: "/dashboard/templates", icon: FileText, keywords: ["email templates"] },
      { name: "AI Generator", href: "/dashboard/generate", icon: Sparkles, keywords: ["ai", "generate", "create"] },
      {
        name: "AI Predictor",
        href: "/dashboard/predict",
        icon: Target,
        keywords: ["predict", "performance", "analysis"],
      },
      { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, keywords: ["stats", "metrics", "reports"] },
      { name: "Integrations", href: "/dashboard/integrations", icon: Zap, keywords: ["connect", "apps"] },
      { name: "Settings", href: "/dashboard/settings", icon: Settings, keywords: ["preferences", "config"] },
      { name: "Billing", href: "/dashboard/billing", icon: CreditCard, keywords: ["subscription", "payment"] },
    ],
  },
  {
    group: "Actions",
    items: [
      {
        name: "Create Campaign",
        href: "/dashboard/campaigns/new",
        icon: Plus,
        keywords: ["new campaign", "start"],
      },
      { name: "Add Prospect", href: "/dashboard/prospects/new", icon: Plus, keywords: ["new prospect", "contact"] },
      {
        name: "Create Template",
        href: "/dashboard/templates/new",
        icon: Plus,
        keywords: ["new template", "email"],
      },
      {
        name: "Generate Email",
        href: "/dashboard/generate",
        icon: Sparkles,
        keywords: ["ai generate", "create email"],
      },
      {
        name: "Predict Performance",
        href: "/dashboard/predict",
        icon: Target,
        keywords: ["analyze", "test email"],
      },
    ],
  },
]

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [recentCommands, setRecentCommands] = useState<string[]>([])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recent-commands") || "[]")
    setRecentCommands(recent)
  }, [])

  const runCommand = useCallback(
    (command: () => void, commandName: string) => {
      setOpen(false)
      command()

      const recent = JSON.parse(localStorage.getItem("recent-commands") || "[]")
      const updated = [commandName, ...recent.filter((c: string) => c !== commandName)].slice(0, 5)
      localStorage.setItem("recent-commands", JSON.stringify(updated))
      setRecentCommands(updated)
    },
    [setOpen],
  )

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground bg-muted/40 rounded-xl border border-border/50 hover:bg-muted/60 hover:border-border transition-all duration-200 w-64"
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="flex-1 text-left">Search or jump to...</span>
        <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded-lg border border-border bg-background px-2 font-mono text-xs font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="border-b border-border/50 bg-muted/30">
          <CommandInput
            placeholder="Search commands, pages, or actions..."
            className="border-0 focus:ring-0 text-base h-14"
          />
        </div>
        <CommandList className="max-h-[500px] p-2">
          <CommandEmpty className="py-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No results found.</p>
              <p className="text-xs text-muted-foreground">Try a different search term</p>
            </div>
          </CommandEmpty>

          {recentCommands.length > 0 && (
            <CommandGroup
              heading={
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Clock className="h-3 w-3" />
                  Recent
                </div>
              }
            >
              {recentCommands.slice(0, 3).map((cmdName) => {
                const item = commands.flatMap((g) => g.items).find((i) => i.name === cmdName)
                if (!item) return null
                return (
                  <CommandItem
                    key={item.href}
                    value={`${item.name} ${item.keywords.join(" ")}`}
                    onSelect={() => runCommand(() => router.push(item.href), item.name)}
                    className="rounded-lg py-3 px-3 mb-1 aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-500/10 cursor-pointer"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 mr-3">
                      <item.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          )}

          {commands.map((group) => (
            <CommandGroup
              key={group.group}
              heading={
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
                  {group.group === "Navigation" && <LayoutDashboard className="h-3 w-3" />}
                  {group.group === "Actions" && <Zap className="h-3 w-3" />}
                  {group.group}
                </div>
              }
            >
              {group.items.map((item) => (
                <CommandItem
                  key={item.href}
                  value={`${item.name} ${item.keywords.join(" ")}`}
                  onSelect={() => runCommand(() => router.push(item.href), item.name)}
                  className="rounded-lg py-3 px-3 mb-1 aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-500/10 cursor-pointer group"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted group-aria-selected:bg-gradient-to-br group-aria-selected:from-indigo-500 group-aria-selected:to-purple-600 mr-3 transition-all">
                    <item.icon className="h-4 w-4 text-muted-foreground group-aria-selected:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">{item.name}</span>
                    {item.keywords.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.keywords.slice(0, 2).join(", ")}</p>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-aria-selected:opacity-100 transition-opacity" />
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>

        <div className="border-t border-border/50 bg-muted/30 px-4 py-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center rounded border border-border bg-background px-1.5 font-mono text-[10px]">
                  ↑↓
                </kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center rounded border border-border bg-background px-1.5 font-mono text-[10px]">
                  ⏎
                </kbd>
                <span>Select</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center rounded border border-border bg-background px-1.5 font-mono text-[10px]">
                ESC
              </kbd>
              <span>Close</span>
            </div>
          </div>
        </div>
      </CommandDialog>
    </>
  )
}
