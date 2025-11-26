


import { Suspense } from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from 'next/navigation'
import { db } from "@/lib/db"
import { unifiedInbox } from "@/lib/services/unified-inbox"
import { InboxList } from "@/components/inbox/inbox-list"
import { InboxStats } from "@/components/inbox/inbox-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Unified Inbox</h1>
            <p className="text-muted-foreground">All your prospect replies in one place</p>
          </div>
        </div>
      </div>

      <InboxStats stats={stats} />

      <Tabs defaultValue={filter || "inbox"} className="w-full">
        <TabsList>
          <TabsTrigger value="inbox" asChild>
            <Link href="/dashboard/inbox">Inbox</Link>
          </TabsTrigger>
          <TabsTrigger value="archived" asChild>
            <Link href="/dashboard/inbox?filter=archived">Archived</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter || "inbox"}>
          <Suspense fallback={<div>Loading messages...</div>}>
            <InboxList messages={messages} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
