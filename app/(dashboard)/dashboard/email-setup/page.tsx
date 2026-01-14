
import { Suspense } from "react"
import { EmailSetupDashboard } from "@/components/email-setup/email-setup-dashboard"
import { Spinner } from "@/components/ui/spinner"
export const metadata = {
  title: "Domain Setup | Cold Email",
  description: "Configure your domains for maximum email deliverability",
}

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <EmailSetupDashboard />
      </Suspense>
    </main>
  )
}
