
import type React from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { syncUserToDatabase } from "@/lib/actions/auth"
import { OnboardingTour } from "@/components/onboarding/onboarding-tour"
import { db } from "@/lib/db"
import { MailfraDashboardWrapper } from "@/components/mailfra/mailfra-dashboard-wrapper"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  try {
    await syncUserToDatabase(userId)
  } catch (error) {
    console.error("[builtbycashe] Failed to sync user to database:", error)
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { onboardingCompletedQuestionnaire: true, subscriptionTier: true },
  })

  if (user && !user.onboardingCompletedQuestionnaire) {
    redirect("/onboarding")
  }

  const isPaidUser = user?.subscriptionTier !== "FREE"

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6 lg:p-8 bg-gradient-to-br from-muted/30 via-background to-muted/20">
          <div className="max-w-[1600px] mx-auto w-full">{children}</div>
        </main>
      </div>
      <OnboardingTour />
      <MailfraDashboardWrapper isPaidUser={isPaidUser} />
    </div>
  )
}