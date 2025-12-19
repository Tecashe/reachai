
"use client"

import React, { useState, useEffect } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CommandPalette } from "@/components/command-palette/command-palette"
import { MobileSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { TourTrigger } from "@/components/onboarding/onboarding-tour"
import { CreditBalanceWidget } from "@/components/dashboard/credit-balance-widget"
import { InboxNotifications } from "@/components/inbox/inbox-notifications"

export function DashboardHeader() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const pathname = usePathname()

  const [credits, setCredits] = useState({ email: 0, research: 0 })

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/user/credits")
        const data = await response.json()
        setCredits({ email: data.emailCredits, research: data.researchCredits })
      } catch (error) {
        console.error("Failed to fetch credits:", error)
      }
    }
    fetchCredits()
  }, [])

  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : user?.emailAddresses[0]?.emailAddress[0].toUpperCase() || "U"

  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean)
    const breadcrumbs = paths.map((path, index) => {
      const href = "/" + paths.slice(0, index + 1).join("/")
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ")
      return { href, label }
    })
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6 lg:px-8">
        <MobileSidebar />

        <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          {breadcrumbs.length > 0 && (
            <Breadcrumb className="hidden sm:block">
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage className="font-semibold">{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={crumb.href} className="hover:text-foreground transition-colors">
                            {crumb.label}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}

          <CommandPalette />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <CreditBalanceWidget emailCredits={credits.email} researchCredits={credits.research} compact />
          </div>

          <ThemeToggle />
          <InboxNotifications />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full hover:ring-2 hover:ring-blue-500/20 transition-all"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.fullName || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <div className="w-full">
                  <TourTrigger />
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="text-red-600 dark:text-red-400">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
