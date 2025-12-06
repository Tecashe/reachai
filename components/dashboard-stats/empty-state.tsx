"use client"

import { Button } from "@/components/ui/button"
import { Mail, Users, BarChart3, Plus } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  type: "campaigns" | "prospects" | "activity" | "accounts"
  className?: string
}

const emptyStates = {
  campaigns: {
    icon: Mail,
    title: "No campaigns yet",
    description: "Create your first email campaign to start reaching prospects",
    action: { label: "Create Campaign", href: "/dashboard/campaigns/new" },
  },
  prospects: {
    icon: Users,
    title: "No prospects found",
    description: "Add prospects to your campaigns or import from a CSV file",
    action: { label: "Add Prospects", href: "/dashboard/prospects/import" },
  },
  activity: {
    icon: BarChart3,
    title: "No activity yet",
    description: "Activity will appear here once you start sending emails",
    action: null,
  },
  accounts: {
    icon: Mail,
    title: "No sending accounts",
    description: "Connect your email accounts to start sending campaigns",
    action: { label: "Connect Account", href: "/dashboard/accounts/connect" },
  },
}

export function EmptyState({ type, className }: EmptyStateProps) {
  const state = emptyStates[type]
  const Icon = state.icon

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
      <div className="relative mb-6">
        {/* Decorative rings */}
        <div className="absolute inset-0 rounded-full bg-foreground/5 scale-150 animate-pulse" />
        <div className="absolute inset-0 rounded-full bg-foreground/5 scale-125" />
        <div className="relative p-4 rounded-full bg-foreground/5 border border-border/50">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{state.title}</h3>
      <p className="text-sm text-muted-foreground max-w-[250px] mb-6">{state.description}</p>
      {state.action && (
        <Button asChild size="sm" className="gap-2">
          <Link href={state.action.href}>
            <Plus className="h-4 w-4" />
            {state.action.label}
          </Link>
        </Button>
      )}
    </div>
  )
}
