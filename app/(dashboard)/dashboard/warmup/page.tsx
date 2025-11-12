import { Suspense } from "react"
import { WarmupDashboard } from "@/components/warmup/warmup-dashboard"

export const metadata = {
  title: "Email Warmup - ReachAI",
  description: "Monitor and manage email warmup for optimal deliverability",
}

export default function WarmupPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Email Warmup</h1>
        <p className="text-muted-foreground">Build domain reputation with our intelligent warmup system</p>
      </div>

      <Suspense fallback={<div>Loading warmup dashboard...</div>}>
        <WarmupDashboard />
      </Suspense>
    </div>
  )
}
