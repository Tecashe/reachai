


// import { Suspense } from "react"
// import { auth } from "@clerk/nextjs/server"
// import { redirect } from 'next/navigation'
// import { db } from "@/lib/db"
// import { unifiedInbox } from "@/lib/services/unified-inbox"
// import { InboxList } from "@/components/inbox/inbox-list"
// import { InboxStats } from "@/components/inbox/inbox-stats"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft } from 'lucide-react'
// import Link from "next/link"

// export default async function InboxPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
//   const { filter } = await searchParams
//   const { userId: clerkId } = await auth()

//   if (!clerkId) {
//     redirect("/sign-in")
//   }

//   const user = await db.user.findUnique({
//     where: { clerkId },
//   })

//   if (!user) {
//     redirect("/sign-in")
//   }

//   const messages = await unifiedInbox.getInboxMessages(user.id, { isArchived: filter === "archived" })
//   const stats = await unifiedInbox.getInboxStats(user.id)

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Link href="/dashboard">
//             <Button variant="ghost" size="icon">
//               <ArrowLeft className="h-4 w-4" />
//             </Button>
//           </Link>
//           <div>
//             <h1 className="text-3xl font-bold">Unified Inbox</h1>
//             <p className="text-muted-foreground">All your prospect replies in one place</p>
//           </div>
//         </div>
//       </div>

//       <InboxStats stats={stats} />

//       <Tabs defaultValue={filter || "inbox"} className="w-full">
//         <TabsList>
//           <TabsTrigger value="inbox" asChild>
//             <Link href="/dashboard/inbox">Inbox</Link>
//           </TabsTrigger>
//           <TabsTrigger value="archived" asChild>
//             <Link href="/dashboard/inbox?filter=archived">Archived</Link>
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value={filter || "inbox"}>
//           <Suspense fallback={<div>Loading messages...</div>}>
//             <InboxList messages={messages} />
//           </Suspense>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }



// import { Suspense } from "react"
// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { db } from "@/lib/db"
// import { unifiedInbox } from "@/lib/services/unified-inbox"
// import { InboxList } from "@/components/inbox/inbox-list"
// import { InboxStats } from "@/components/inbox/inbox-stats"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft, Inbox, ArchiveIcon, Loader2 } from "lucide-react"
// import Link from "next/link"

// export default async function InboxPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
//   const { filter } = await searchParams
//   const { userId: clerkId } = await auth()

//   if (!clerkId) {
//     redirect("/sign-in")
//   }

//   const user = await db.user.findUnique({
//     where: { clerkId },
//   })

//   if (!user) {
//     redirect("/sign-in")
//   }

//   const messages = await unifiedInbox.getInboxMessages(user.id, { isArchived: filter === "archived" })
//   const stats = await unifiedInbox.getInboxStats(user.id)

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
//       <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
//         {/* Header with glassmorphism */}
//         <header className="flex items-center justify-between">
//           <div className="flex items-center gap-5">
//             <Link href="/dashboard">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="rounded-xl bg-background/60 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md hover:bg-background/80 transition-all"
//               >
//                 <ArrowLeft className="h-4 w-4" />
//               </Button>
//             </Link>
//             <div>
//               <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
//                 Unified Inbox
//               </h1>
//               <p className="text-muted-foreground text-sm mt-1">All your prospect replies in one place</p>
//             </div>
//           </div>
//         </header>

//         <InboxStats stats={stats} />

//         {/* Tabs with modern styling */}
//         <Tabs defaultValue={filter || "inbox"} className="w-full">
//           <TabsList className="inline-flex h-11 items-center justify-center rounded-xl bg-muted/50 p-1 backdrop-blur-sm border border-border/50">
//             <TabsTrigger
//               value="inbox"
//               asChild
//               className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-6 transition-all"
//             >
//               <Link href="/dashboard/inbox" className="flex items-center gap-2">
//                 <Inbox className="h-4 w-4" />
//                 Inbox
//               </Link>
//             </TabsTrigger>
//             <TabsTrigger
//               value="archived"
//               asChild
//               className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-6 transition-all"
//             >
//               <Link href="/dashboard/inbox?filter=archived" className="flex items-center gap-2">
//                 <ArchiveIcon className="h-4 w-4" />
//                 Archived
//               </Link>
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value={filter || "inbox"} className="mt-6">
//             <Suspense
//               fallback={
//                 <div className="flex items-center justify-center py-20">
//                   <div className="flex flex-col items-center gap-4">
//                     <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//                     <p className="text-sm text-muted-foreground">Loading messages...</p>
//                   </div>
//                 </div>
//               }
//             >
//               <InboxList messages={messages} />
//             </Suspense>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }


import { Suspense } from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { unifiedInbox } from "@/lib/services/unified-inbox"
import { InboxList } from "@/components/inbox/inbox-list"
import { InboxStats } from "@/components/inbox/inbox-stats"
import { InboxStatsSkeleton } from "@/components/inbox/inbox-skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Inbox, ArchiveIcon, Loader2, Keyboard } from "lucide-react"
import Link from "next/link"

export default async function InboxPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter } = await searchParams
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    redirect("/sign-in")
  }

  const user = await db.user.findUnique({
    where: { clerkId },
  })

  if (!user) {
    redirect("/sign-in")
  }

  const messages = await unifiedInbox.getInboxMessages(user.id, { isArchived: filter === "archived" })
  const stats = await unifiedInbox.getInboxStats(user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-[1800px] mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl bg-background/60 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md hover:bg-background/80 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Unified Inbox</h1>
              <p className="text-muted-foreground text-sm">
                All prospect replies in one place • Press{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px] mx-1">⌘K</kbd> for commands
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1.5">
              <Keyboard className="h-3.5 w-3.5" />
              Press ? for shortcuts
            </Button>
          </div>
        </header>

        {/* Stats */}
        <Suspense fallback={<InboxStatsSkeleton />}>
          <InboxStats stats={stats} />
        </Suspense>

        {/* Tabs */}
        <Tabs defaultValue={filter || "inbox"} className="w-full">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-xl bg-muted/50 p-1 backdrop-blur-sm border border-border/50">
            <TabsTrigger
              value="inbox"
              asChild
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-5 transition-all"
            >
              <Link href="/dashboard/inbox" className="flex items-center gap-2">
                <Inbox className="h-4 w-4" />
                Inbox
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              asChild
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-5 transition-all"
            >
              <Link href="/dashboard/inbox?filter=archived" className="flex items-center gap-2">
                <ArchiveIcon className="h-4 w-4" />
                Archived
              </Link>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter || "inbox"} className="mt-4">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading messages...</p>
                  </div>
                </div>
              }
            >
              <InboxList messages={messages} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
