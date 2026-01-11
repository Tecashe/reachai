
import { Suspense } from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { unifiedInbox } from "@/lib/services/unified-inbox"
import { InboxList } from "@/components/inbox/inbox-list"
import { InboxStats } from "@/components/inbox/inbox-stats"
import { InboxStatsSkeleton } from "@/components/inbox/inbox-skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Inbox, ArchiveIcon, Keyboard } from "lucide-react"
import Link from "next/link"
import { WaveLoader } from "@/components/loader/wave-loader"

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
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <header className="flex-none px-6 py-4 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl bg-background/60 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md hover:bg-background/80 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Unified Inbox</h1>
              <p className="text-muted-foreground text-xs">
                Press <kbd className="px-1 py-0.5 rounded bg-muted border text-[10px] mx-0.5">⌘K</kbd> for commands
              </p>
            </div>
          </div>

          <Suspense fallback={<InboxStatsSkeleton />}>
            <InboxStats stats={stats} />
          </Suspense>

          <div className="flex items-center gap-3">
            <Tabs defaultValue={filter || "inbox"} className="w-auto">
              <TabsList className="h-9 bg-muted/50 backdrop-blur-sm border border-border/40 rounded-lg p-1">
                <TabsTrigger
                  value="inbox"
                  asChild
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md px-3 h-7 text-sm"
                >
                  <Link href="/dashboard/inbox" className="flex items-center gap-1.5">
                    <Inbox className="h-3.5 w-3.5" />
                    Inbox
                  </Link>
                </TabsTrigger>
                <TabsTrigger
                  value="archived"
                  asChild
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md px-3 h-7 text-sm"
                >
                  <Link href="/dashboard/inbox?filter=archived" className="flex items-center gap-1.5">
                    <ArchiveIcon className="h-3.5 w-3.5" />
                    Archived
                  </Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button variant="ghost" size="sm" className="h-9 text-xs text-muted-foreground gap-1.5 hidden lg:flex">
              <Keyboard className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">Press</span> ?
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 px-6 py-4">
        <div className="max-w-[1800px] mx-auto h-full">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                  <WaveLoader size="sm" bars={8} gap="tight" />
                  <p className="text-sm text-muted-foreground">Loading messages...</p>
                </div>
              </div>
            }
          >
            <InboxList messages={messages} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
