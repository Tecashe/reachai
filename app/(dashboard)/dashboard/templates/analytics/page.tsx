import { Suspense } from "react"
import { getTemplates } from "@/lib/actions/template-actions"
import { TemplateAnalyticsDashboard } from "@/components/templates/template-analytics-dashboard"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"

export const metadata = {
  title: "Template Analytics | Cold Email Platform",
  description: "View analytics and performance metrics for your email templates",
}

export default async function TemplateAnalyticsPage() {
  const { userId } = await auth()

  if (!userId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Please sign in to view analytics</p>
        </div>
      </div>
    )
  }

  const result = await getTemplates(userId, { includeSystem: true })
  const templates = result.success && result.templates ? result.templates : []

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/templates">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mb-2">Template Analytics</h1>
        <p className="text-muted-foreground text-lg">
          Track performance metrics and identify your best-performing templates
        </p>
      </div>

      <Suspense fallback={<AnalyticsSkeleton />}>
        <TemplateAnalyticsDashboard templates={templates as any} />
      </Suspense>
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="h-96 bg-muted rounded-lg animate-pulse" />
    </div>
  )
}
