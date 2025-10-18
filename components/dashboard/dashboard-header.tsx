// "use client"

// import { Bell, Search, Menu } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// export function DashboardHeader() {
//   return (
//     <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="flex h-16 items-center gap-4 px-6">
//         <Button variant="ghost" size="icon" className="md:hidden">
//           <Menu className="h-5 w-5" />
//         </Button>

//         <div className="flex-1 flex items-center gap-4">
//           <div className="relative w-full max-w-md">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input placeholder="Search campaigns, prospects..." className="pl-9" />
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <Button variant="ghost" size="icon">
//             <Bell className="h-5 w-5" />
//           </Button>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="relative h-9 w-9 rounded-full">
//                 <Avatar className="h-9 w-9">
//                   <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
//                   <AvatarFallback>JD</AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56">
//               <DropdownMenuLabel>
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium">John Doe</p>
//                   <p className="text-xs text-muted-foreground">john@example.com</p>
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>Profile</DropdownMenuItem>
//               <DropdownMenuItem>Settings</DropdownMenuItem>
//               <DropdownMenuItem>Billing</DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>Sign out</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </header>
//   )
// }

// "use client"

// import { Bell, Search, Menu } from "lucide-react"
// import { useUser, useClerk } from "@clerk/nextjs"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import Link from "next/link"

// export function DashboardHeader() {
//   const { user } = useUser()
//   const { signOut } = useClerk()

//   const userInitials =
//     user?.firstName && user?.lastName
//       ? `${user.firstName[0]}${user.lastName[0]}`
//       : user?.emailAddresses[0]?.emailAddress[0].toUpperCase() || "U"

//   return (
//     <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="flex h-16 items-center gap-4 px-6">
//         <Button variant="ghost" size="icon" className="md:hidden">
//           <Menu className="h-5 w-5" />
//         </Button>

//         <div className="flex-1 flex items-center gap-4">
//           <div className="relative w-full max-w-md">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input placeholder="Search campaigns, prospects..." className="pl-9" />
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <Button variant="ghost" size="icon">
//             <Bell className="h-5 w-5" />
//           </Button>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="relative h-9 w-9 rounded-full">
//                 <Avatar className="h-9 w-9">
//                   <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
//                   <AvatarFallback>{userInitials}</AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56">
//               <DropdownMenuLabel>
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium">{user?.fullName || "User"}</p>
//                   <p className="text-xs text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem asChild>
//                 <Link href="/dashboard/settings">Settings</Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href="/dashboard/billing">Billing</Link>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </header>
//   )
// }
// "use client"

// import React from "react"

// import { Bell, Search, Menu } from "lucide-react"
// import { useUser, useClerk } from "@clerk/nextjs"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import Link from "next/link"
// import { usePathname } from "next/navigation"

// export function DashboardHeader() {
//   const { user } = useUser()
//   const { signOut } = useClerk()
//   const pathname = usePathname()

//   const userInitials =
//     user?.firstName && user?.lastName
//       ? `${user.firstName[0]}${user.lastName[0]}`
//       : user?.emailAddresses[0]?.emailAddress[0].toUpperCase() || "U"

//   const generateBreadcrumbs = () => {
//     const paths = pathname.split("/").filter(Boolean)
//     const breadcrumbs = paths.map((path, index) => {
//       const href = "/" + paths.slice(0, index + 1).join("/")
//       const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ")
//       return { href, label }
//     })
//     return breadcrumbs
//   }

//   const breadcrumbs = generateBreadcrumbs()

//   return (
//     <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
//       <div className="flex h-16 items-center gap-4 px-6">
//         <Button variant="ghost" size="icon" className="md:hidden">
//           <Menu className="h-5 w-5" />
//         </Button>

//         <div className="flex-1 flex flex-col gap-2">
//           {breadcrumbs.length > 0 && (
//             <Breadcrumb>
//               <BreadcrumbList>
//                 {breadcrumbs.map((crumb, index) => (
//                   <React.Fragment key={crumb.href}>
//                     <BreadcrumbItem>
//                       {index === breadcrumbs.length - 1 ? (
//                         <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
//                       ) : (
//                         <BreadcrumbLink asChild>
//                           <Link href={crumb.href}>{crumb.label}</Link>
//                         </BreadcrumbLink>
//                       )}
//                     </BreadcrumbItem>
//                     {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
//                   </React.Fragment>
//                 ))}
//               </BreadcrumbList>
//             </Breadcrumb>
//           )}

//           <div className="relative w-full max-w-md">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input placeholder="Search campaigns, prospects..." className="pl-9 h-9" />
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <Button variant="ghost" size="icon" className="relative">
//             <Bell className="h-5 w-5" />
//             <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
//           </Button>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="relative h-9 w-9 rounded-full">
//                 <Avatar className="h-9 w-9">
//                   <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
//                   <AvatarFallback>{userInitials}</AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56">
//               <DropdownMenuLabel>
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium">{user?.fullName || "User"}</p>
//                   <p className="text-xs text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem asChild>
//                 <Link href="/dashboard/settings">Settings</Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href="/dashboard/billing">Billing</Link>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </header>
//   )
// }

// "use client"

// import React from "react"
// import { Bell } from "lucide-react"
// import { useUser, useClerk } from "@clerk/nextjs"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { CommandPalette } from "@/components/command-palette/command-palette"
// import { MobileSidebar } from "@/components/dashboard/dashboard-sidebar"

// export function DashboardHeader() {
//   const { user } = useUser()
//   const { signOut } = useClerk()
//   const pathname = usePathname()

//   const userInitials =
//     user?.firstName && user?.lastName
//       ? `${user.firstName[0]}${user.lastName[0]}`
//       : user?.emailAddresses[0]?.emailAddress[0].toUpperCase() || "U"

//   const generateBreadcrumbs = () => {
//     const paths = pathname.split("/").filter(Boolean)
//     const breadcrumbs = paths.map((path, index) => {
//       const href = "/" + paths.slice(0, index + 1).join("/")
//       const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ")
//       return { href, label }
//     })
//     return breadcrumbs
//   }

//   const breadcrumbs = generateBreadcrumbs()

//   return (
//     <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
//       <div className="flex h-16 items-center gap-4 px-4 md:px-6">
//         <MobileSidebar />

//         <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
//           {breadcrumbs.length > 0 && (
//             <Breadcrumb className="hidden sm:block">
//               <BreadcrumbList>
//                 {breadcrumbs.map((crumb, index) => (
//                   <React.Fragment key={crumb.href}>
//                     <BreadcrumbItem>
//                       {index === breadcrumbs.length - 1 ? (
//                         <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
//                       ) : (
//                         <BreadcrumbLink asChild>
//                           <Link href={crumb.href}>{crumb.label}</Link>
//                         </BreadcrumbLink>
//                       )}
//                     </BreadcrumbItem>
//                     {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
//                   </React.Fragment>
//                 ))}
//               </BreadcrumbList>
//             </Breadcrumb>
//           )}

//           <CommandPalette />
//         </div>

//         <div className="flex items-center gap-2">
//           <Button variant="ghost" size="icon" className="relative">
//             <Bell className="h-5 w-5" />
//             <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
//           </Button>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="relative h-9 w-9 rounded-full">
//                 <Avatar className="h-9 w-9">
//                   <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
//                   <AvatarFallback>{userInitials}</AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56">
//               <DropdownMenuLabel>
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium">{user?.fullName || "User"}</p>
//                   <p className="text-xs text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem asChild>
//                 <Link href="/dashboard/settings">Settings</Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href="/dashboard/billing">Billing</Link>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </header>
//   )
// }


"use client"

import React, { useState } from "react"
import { Bell } from "lucide-react"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CommandPalette } from "@/components/command-palette/command-palette"
import { MobileSidebar } from "@/components/dashboard/dashboard-sidebar"

export function DashboardHeader() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const pathname = usePathname()
  const [notificationsOpen, setNotificationsOpen] = useState(false)

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

  // Mock notifications - replace with real data
  const notifications = [
    { id: 1, title: "Campaign 'Summer Outreach' completed", time: "2 hours ago", unread: true },
    { id: 2, title: "New reply from John Doe", time: "5 hours ago", unread: true },
    { id: 3, title: "50 prospects imported successfully", time: "1 day ago", unread: false },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

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
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-muted/50">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">No notifications yet</div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors",
                        notification.unread && "bg-blue-50/50 dark:bg-blue-950/20",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {notification.unread && <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-2 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    Mark all as read
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

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

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
