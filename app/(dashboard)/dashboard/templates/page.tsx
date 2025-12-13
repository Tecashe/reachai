import { Suspense } from "react"
import { TemplateLibrary } from "@/components/templates/template-library"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"

export const metadata = {
  title: "Email Templates | Cold Email Platform",
  description: "Browse and manage your email templates",
}

export default async function TemplatesPage() {
  const { userId } = await auth()

  if (!userId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Please sign in to view templates</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Email Templates</h1>
          <p className="text-muted-foreground text-lg">
            Browse high-converting cold email templates or create your own
          </p>
        </div>
        <Link href="/templates/new">
          <Button size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Create Template
          </Button>
        </Link>
      </div>

      <Suspense fallback={<TemplateLibrarySkeleton />}>
        <TemplateLibrary userId={userId} />
      </Suspense>
    </div>
  )
}

function TemplateLibrarySkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-12 bg-muted rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-80 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  )
}
