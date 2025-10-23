import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { CreditPurchaseInterface } from "@/components/credits/credit-purchase-interface"
import { CreditUsageHistory } from "@/components/credits/credit-usage-history"
import { CreditBalanceWidget } from "@/components/dashboard/credit-balance-widget"

export default async function CreditsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      emailCredits: true,
      researchCredits: true,
    },
  })

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Credits</h1>
        <p className="text-muted-foreground mt-2">
          Manage your email and research credits. Purchase more credits as needed.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <CreditBalanceWidget emailCredits={user.emailCredits} researchCredits={user.researchCredits} />
        </div>
        <div className="md:col-span-2">
          <CreditUsageHistory userId={user.id} />
        </div>
      </div>

      <CreditPurchaseInterface userId={user.id} />
    </div>
  )
}
