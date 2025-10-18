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
} from "lucide-react"

const commands = [
  {
    group: "Navigation",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, keywords: ["home", "overview"] },
      { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail, keywords: ["email", "outreach"] },
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

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false)
      command()
    },
    [setOpen],
  )

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {commands.map((group) => (
            <CommandGroup key={group.group} heading={group.group}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.href}
                  value={`${item.name} ${item.keywords.join(" ")}`}
                  onSelect={() => {
                    runCommand(() => router.push(item.href))
                  }}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
