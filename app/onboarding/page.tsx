import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { OnboardingQuestionnaire } from "@/components/onboarding/onboarding-questionnaire"

export default async function OnboardingPage() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    redirect("/sign-in")
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    select: {
      onboardingCompletedQuestionnaire: true,
      companyName: true,
      userRole: true,
      useCase: true,
      monthlyVolume: true,
    },
  })

  // If already completed, redirect to the dashboarrd
  if (user?.onboardingCompletedQuestionnaire) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <OnboardingQuestionnaire />
    </div>
  )
}
